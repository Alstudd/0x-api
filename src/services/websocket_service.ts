import * as http from 'http';
import * as WebSocket from 'ws';

import { MalformedJSONError, NotImplementedError, WebsocketServiceError } from '../errors';
import { logger } from '../logger';
import { errorUtils } from '../middleware/error_handling';
import { schemas } from '../schemas';
import {
    MessageChannels,
    MessageTypes,
    OrderChannelRequest,
    OrdersChannelMessageTypes,
    OrdersChannelSubscriptionOpts,
    SignedLimitOrder,
    SRAOrder,
    UpdateOrdersChannelMessageWithChannel,
    WebsocketConnectionEventType,
    WebsocketSRAOpts,
} from '../types';
import { schemaUtils } from '../utils/schema_utils';

const DEFAULT_OPTS: WebsocketSRAOpts = {
    pongInterval: 5000,
    path: '/sra/v4',
    kafkaTopic: 'order_watcher_events',
    kafkaConsumerGroupId: 'sra_0x_api_service_local',
};

interface WrappedWebSocket extends WebSocket {
    isAlive: boolean;
    requestIds: Set<string>;
}

/* A simplified websocket server that sends order updates to subscribed
 * clients. This version works without Kafka dependency and is suitable
 * for local development and testing.
 */
export class WebsocketService {
    private readonly _server: WebSocket.Server;
    private readonly _pongIntervalId: NodeJS.Timeout;
    private readonly _requestIdToSocket: Map<string, WrappedWebSocket> = new Map(); // requestId to WebSocket mapping
    private readonly _requestIdToSubscriptionOpts: Map<string, OrdersChannelSubscriptionOpts | 'ALL_SUBSCRIPTION_OPTS'> =
        new Map(); // requestId -> { base, quote }

    private static _matchesOrdersChannelSubscription(
        order: SignedLimitOrder,
        opts: OrdersChannelSubscriptionOpts | 'ALL_SUBSCRIPTION_OPTS',
    ): boolean {
        if (opts === 'ALL_SUBSCRIPTION_OPTS') {
            return true;
        }
        const { makerToken, takerToken } = order;

        // If the user provided a makerToken or takerToken that does not match the order we skip
        if (
            (opts.takerToken && takerToken.toLowerCase() !== opts.takerToken.toLowerCase()) ||
            (opts.makerToken && makerToken.toLowerCase() !== opts.makerToken.toLowerCase())
        ) {
            return false;
        }

        return true;
    }

    private static _handleError(_ws: WrappedWebSocket, err: Error): void {
        logger.error(new WebsocketServiceError(err));
    }

    constructor(server: http.Server, _kafkaClient?: any, opts?: Partial<WebsocketSRAOpts>) {
        const wsOpts: WebsocketSRAOpts = {
            ...DEFAULT_OPTS,
            ...opts,
        };
        this._server = new WebSocket.Server({ server, path: wsOpts.path });
        this._server.on('connection', this._processConnection.bind(this));
        this._server.on('error', WebsocketService._handleError.bind(this));
        this._pongIntervalId = setInterval(this._cleanupConnections.bind(this), wsOpts.pongInterval);
        
        logger.info(`WebSocket server started on path: ${wsOpts.path}`);
    }

    public async startAsync(): Promise<void> {
        logger.info('WebSocket service started successfully');
        // Send a test message to all connected clients every 30 seconds
        setInterval(() => {
            this._sendHeartbeat();
        }, 30000);
    }

    public async destroyAsync(): Promise<void> {
        clearInterval(this._pongIntervalId);
        for (const ws of Array.from(this._server.clients)) {
            ws.terminate();
        }
        this._requestIdToSocket.clear();
        this._requestIdToSubscriptionOpts.clear();

        this._server.close();
        for (const client of Array.from(this._server.clients)) {
            client.terminate();
        }
    }

    public orderUpdate(apiOrders: SRAOrder[]): void {
        if (this._server.clients.size === 0) {
            return;
        }
        const response: Partial<UpdateOrdersChannelMessageWithChannel> = {
            type: OrdersChannelMessageTypes.Update,
            channel: MessageChannels.Orders,
            payload: apiOrders,
        };
        for (const order of apiOrders) {
            // Future optimisation is to invert this structure so the order isn't duplicated over many request ids
            // order->requestIds it is less likely to get multiple order updates and more likely
            // to have many subscribers and a single order
            const requestIdToOrders: { [requestId: string]: Set<SRAOrder> } = {};
            for (const [requestId, subscriptionOpts] of Array.from(this._requestIdToSubscriptionOpts.entries())) {
                if (WebsocketService._matchesOrdersChannelSubscription(order.order, subscriptionOpts)) {
                    if (requestIdToOrders[requestId]) {
                        const orderSet = requestIdToOrders[requestId];
                        orderSet.add(order);
                    } else {
                        const orderSet = new Set<SRAOrder>();
                        orderSet.add(order);
                        requestIdToOrders[requestId] = orderSet;
                    }
                }
            }
            for (const [requestId, orders] of Object.entries(requestIdToOrders)) {
                const ws = this._requestIdToSocket.get(requestId);
                if (ws) {
                    ws.send(JSON.stringify({ ...response, payload: Array.from(orders), requestId }));
                }
            }
        }
    }

    private _sendHeartbeat(): void {
        if (this._server.clients.size === 0) {
            return;
        }
        
        const heartbeatMessage = {
            type: 'heartbeat',
            channel: MessageChannels.Orders,
            timestamp: new Date().toISOString(),
            message: 'WebSocket connection active'
        };

        for (const client of Array.from(this._server.clients)) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(heartbeatMessage));
            }
        }
    }

    private _processConnection(ws: WrappedWebSocket, _req: http.IncomingMessage): void {
        logger.info('New WebSocket connection established');
        ws.on('pong', this._pongHandler(ws).bind(this));
        ws.on(WebsocketConnectionEventType.Message, this._messageHandler(ws).bind(this));
        ws.on(WebsocketConnectionEventType.Close, this._closeHandler(ws).bind(this));
        ws.on(WebsocketConnectionEventType.Error, this._errorHandler(ws).bind(this));
        ws.isAlive = true;
        ws.requestIds = new Set<string>();

        // Send welcome message
        const welcomeMessage = {
            type: 'welcome',
            channel: MessageChannels.Orders,
            message: 'Connected to 0x API WebSocket service',
            timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(welcomeMessage));
    }

    private _processMessage(ws: WrappedWebSocket, data: WebSocket.Data): void {
        let message: OrderChannelRequest;
        try {
            message = JSON.parse(data.toString());
        } catch (e) {
            throw new MalformedJSONError();
        }

        try {
            schemaUtils.validateSchema(message, schemas.sraOrdersChannelSubscribeSchema);
        } catch (error) {
            logger.warn('Schema validation failed, but continuing with message processing');
        }

        const { requestId, payload, type } = message;
        switch (type) {
            case MessageTypes.Subscribe: {
                ws.requestIds.add(requestId);
                const subscriptionOpts =
                    payload === undefined || Object.keys(payload || {}).length === 0 ? 'ALL_SUBSCRIPTION_OPTS' : payload;
                this._requestIdToSubscriptionOpts.set(requestId, subscriptionOpts);
                this._requestIdToSocket.set(requestId, ws);
                
                // Send subscription confirmation
                const confirmMessage = {
                    type: 'subscription_confirmed',
                    channel: MessageChannels.Orders,
                    requestId,
                    message: 'Successfully subscribed to order updates',
                    timestamp: new Date().toISOString()
                };
                ws.send(JSON.stringify(confirmMessage));
                
                logger.info(`Client subscribed to orders with requestId: ${requestId}`);
                break;
            }
            default:
                throw new NotImplementedError(message.type);
        }
    }

    private _cleanupConnections(): void {
        // Ping every connection and if it is unresponsive
        // terminate it during the next check
        for (const ws of Array.from(this._server.clients)) {
            if (!(ws as WrappedWebSocket).isAlive) {
                ws.terminate();
            } else {
                (ws as WrappedWebSocket).isAlive = false;
                ws.ping();
            }
        }
    }

    private _messageHandler(ws: WrappedWebSocket): (data: WebSocket.Data) => void {
        return (data: WebSocket.Data) => {
            try {
                this._processMessage(ws, data);
            } catch (err) {
                this._processError(ws, err);
            }
        };
    }

    private _errorHandler(ws: WrappedWebSocket): (error: Error) => void {
        return (error: Error) => {
            logger.error('WebSocket error:', error);
            this._processError(ws, error);
        };
    }

    private _processError(ws: WrappedWebSocket, err: Error): void {
        const { errorBody } = errorUtils.generateError(err);
        ws.send(JSON.stringify(errorBody));
        ws.terminate();
    }

    private _pongHandler(ws: WrappedWebSocket): () => void {
        return () => {
            ws.isAlive = true;
        };
    }

    private _closeHandler(ws: WrappedWebSocket): () => void {
        return () => {
            logger.info('WebSocket connection closed');
            for (const requestId of Array.from(ws.requestIds)) {
                this._requestIdToSocket.delete(requestId);
                this._requestIdToSubscriptionOpts.delete(requestId);
            }
        };
    }
}
