import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

class StandaloneWebSocketService {
    private readonly _server: WebSocket.Server;
    private readonly _pongIntervalId: NodeJS.Timeout;
    private readonly _clients: Set<WebSocket> = new Set();

    constructor(server: http.Server, path: string = '/sra/v4') {
        this._server = new WebSocket.Server({ server, path });
        this._server.on('connection', this._handleConnection.bind(this));
        this._server.on('error', this._handleError.bind(this));
        
        this._pongIntervalId = setInterval(this._pingClients.bind(this), 5000);
        
        console.log(`📡 WebSocket server started on path: ${path}`);
    }

    public async startAsync(): Promise<void> {
        console.log('✅ Standalone WebSocket service started successfully');
        
        setInterval(() => {
            this._sendHeartbeat();
        }, 30000);
    }

    public async destroyAsync(): Promise<void> {
        clearInterval(this._pongIntervalId);
        
        for (const client of Array.from(this._clients)) {
            client.terminate();
        }
        this._clients.clear();
        
        this._server.close();
        console.log('✅ WebSocket service destroyed');
    }

    private _handleConnection(ws: WebSocket, req: http.IncomingMessage): void {
        console.log('🔌 New WebSocket connection established');
        this._clients.add(ws);
        
        const welcomeMessage = {
            type: 'welcome',
            channel: 'orders',
            message: 'Connected to 0x API WebSocket service',
            timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(welcomeMessage));

        ws.on('message', (data: WebSocket.Data) => {
            try {
                const message = JSON.parse(data.toString());
                this._handleMessage(ws, message);
            } catch (error) {
                console.error('❌ Failed to parse message:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid JSON message'
                }));
            }
        });

        ws.on('close', () => {
            console.log('🔌 WebSocket connection closed');
            this._clients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
            this._clients.delete(ws);
        });
    }

    private _handleMessage(ws: WebSocket, message: any): void {
        console.log('📨 Received message:', message);
        
        if (message.type === 'subscribe') {
            const confirmMessage = {
                type: 'subscription_confirmed',
                channel: 'orders',
                requestId: message.requestId || 'default',
                message: 'Successfully subscribed to order updates',
                timestamp: new Date().toISOString()
            };
            ws.send(JSON.stringify(confirmMessage));
            console.log('✅ Client subscribed to orders');
        } else {
            ws.send(JSON.stringify({
                type: 'error',
                message: `Unknown message type: ${message.type}`
            }));
        }
    }

    private _handleError(error: Error): void {
        console.error('❌ WebSocket server error:', error);
    }

    private _pingClients(): void {
        for (const client of Array.from(this._clients)) {
            if (client.readyState === WebSocket.OPEN) {
                client.ping();
            }
        }
    }

    private _sendHeartbeat(): void {
        if (this._clients.size === 0) {
            return;
        }
        
        const heartbeatMessage = {
            type: 'heartbeat',
            channel: 'orders',
            timestamp: new Date().toISOString(),
            message: 'WebSocket connection active',
            connectedClients: this._clients.size
        };

        for (const client of Array.from(this._clients)) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(heartbeatMessage));
            }
        }
    }
}

const app = express();
const server = http.createServer(app);

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Standalone WebSocket test server running',
        timestamp: new Date().toISOString()
    });
});

app.get('/sra/v4/orders', (req, res) => {
    res.json({ 
        records: [], 
        total: 0, 
        page: 1, 
        per_page: 20,
        message: 'SRA endpoint working'
    });
});

const wsService = new StandaloneWebSocketService(server, '/sra/v4');

const PORT = 3002;

server.listen(PORT, () => {
    console.log(`🚀 Standalone WebSocket test server running on port ${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/sra/v4`);
    console.log(`🌐 HTTP endpoint: http://localhost:${PORT}/health`);
    console.log(`📊 SRA endpoint: http://localhost:${PORT}/sra/v4/orders`);
    
    wsService.startAsync().then(() => {
        console.log('✅ WebSocket service started successfully');
    }).catch((error) => {
        console.error('❌ Failed to start WebSocket service:', error);
    });
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await wsService.destroyAsync();
    server.close(() => {
        console.log('✅ Server shut down gracefully');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    await wsService.destroyAsync();
    server.close(() => {
        console.log('✅ Server shut down gracefully');
        process.exit(0);
    });
});
