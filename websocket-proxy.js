const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { createProxyMiddleware } = require('http-proxy-middleware');

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

const BACKEND_PORT = 3000;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'WebSocket proxy server running',
        websocket: 'ws://localhost:3000/sra/v4',
        backend: BACKEND_URL,
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
                websocket: 'ws://localhost:3002/sra/v4'
            });
        }
    }
}));

const PORT = 3002;

server.listen(PORT, () => {
    console.log(`🚀 WebSocket proxy server running on port ${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/sra/v4`);
    console.log(`🌐 HTTP proxy to: ${BACKEND_URL}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    
    console.log('\n📋 To use this setup:');
    console.log('1. Start your main backend on port 3000 (or change BACKEND_PORT above)');
    console.log('2. Frontend connects to ws://localhost:3002/sra/v4 (WebSocket)');
    console.log('3. HTTP requests are proxied to your backend');
    console.log('4. WebSocket requests are handled locally');
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
