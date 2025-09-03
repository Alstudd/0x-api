const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

class WebSocketService {
    constructor(server) {
        this._server = new WebSocket.Server({ server, path: '/sra/v4' });
        this._clients = new Set();
        
        this._server.on('connection', this._handleConnection.bind(this));
        this._server.on('error', this._handleError.bind(this));
        
        console.log('📡 WebSocket server started on path: /sra/v4');
    }

    _handleConnection(ws, req) {
        console.log('🔌 New WebSocket connection established');
        this._clients.add(ws);
        
        // Send welcome message
        const welcomeMessage = {
            type: 'welcome',
            channel: 'orders',
            message: 'Connected to 0x API WebSocket service',
            timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(welcomeMessage));

        ws.on('message', (data) => {
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

    _handleMessage(ws, message) {
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

    _handleError(error) {
        console.error('❌ WebSocket server error:', error);
    }
}

const wsService = new WebSocketService(server);

const WS_PORT = process.env.WS_PORT || 3002;
const BACKEND_PORT = process.env.HTTP_PORT || 3000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3001;

const WS_URL = process.env.WS_URL || `ws://localhost:${WS_PORT}`;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${BACKEND_PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${FRONTEND_PORT}`;

console.log('🚀 Starting WebSocket proxy server with configuration:');
console.log(`   WebSocket Port: ${WS_PORT}`);
console.log(`   Backend Port: ${BACKEND_PORT}`);
console.log(`   Frontend Port: ${FRONTEND_PORT}`);
console.log(`   WebSocket URL: ${WS_URL}`);
console.log(`   Backend URL: ${BACKEND_URL}`);
console.log(`   Frontend URL: ${FRONTEND_URL}`);

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'WebSocket proxy server running',
        websocket: `${WS_URL}/sra/v4`,
        backend: BACKEND_URL,
        frontend: FRONTEND_URL,
        ports: {
            websocket: WS_PORT,
            backend: BACKEND_PORT,
            frontend: FRONTEND_PORT
        },
        timestamp: new Date().toISOString()
    });
});

app.use('/', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    logLevel: 'silent',
    onError: (err, req, res) => {
        console.log(`⚠️  Backend not available at ${BACKEND_URL}, serving local responses`);
        if (req.path === '/sra/v4/orders') {
            res.json({ 
                records: [], 
                total: 0, 
                page: 1, 
                per_page: 20,
                message: 'Backend not available, serving local response'
            });
        } else {
            res.json({ 
                message: 'Backend not available',
                websocket: `${WS_URL}/sra/v4`,
            });
        }
    }
}));

server.listen(WS_PORT, () => {
    console.log(`🚀 WebSocket proxy server running on port ${WS_PORT}`);
    console.log(`📡 WebSocket endpoint: ${WS_URL}/sra/v4`);
    console.log(`🌐 HTTP proxy to: ${BACKEND_URL}`);
    console.log(`💚 Health check: ${BACKEND_URL}/health`);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down proxy server...');
    server.close(() => {
        console.log('✅ Server shut down gracefully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down proxy server...');
    server.close(() => {
        console.log('✅ Server shut down gracefully');
        process.exit(0);
    });
});