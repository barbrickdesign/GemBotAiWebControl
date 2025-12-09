/**
 * GemBot Web Control - Backend Server
 * Bridges Serial Communication between USB Arduino and Web Clients via WebSocket
 * 
 * Installation:
 * npm install express http ws serialport cors dotenv
 * 
 * Usage:
 * node server.js
 * Then open http://localhost:3000 in your browser
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const fs = require('fs');

// Configuration
const PORT = process.env.PORT || 3000;
const BAUD_RATE = 9600;
const SERIAL_TIMEOUT = 5000;
const DEVICE_PASSWORD = process.env.DEVICE_PASSWORD || '0000';  // Default password

// Initialize Express App
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve from root directory
app.use(cors());

// Route to serve GemBot_Control_AI.html at root (the fully enhanced version with all features)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'GemBot_Control_AI.html'));
});

// Also serve GemBot_Control_Redesigned.html for backward compatibility
app.get('/redesigned', (req, res) => {
    res.sendFile(path.join(__dirname, 'GemBot_Control_Redesigned.html'));
});

// Global State
let serialPort = null;
let parser = null;
let isConnected = false;
let connectedClients = new Set();
let authenticatedClients = new Set();

// ==========================================
// Serial Port Management
// ==========================================

/**
 * List all available serial ports
 */
async function listSerialPorts() {
    try {
        const ports = await SerialPort.list();
        return ports.map(port => ({
            path: port.path,
            manufacturer: port.manufacturer || 'Unknown',
            productId: port.productId,
            vendorId: port.vendorId,
            serialNumber: port.serialNumber
        }));
    } catch (error) {
        console.error('Error listing ports:', error);
        return [];
    }
}

/**
 * Connect to a specific serial port
 */
async function connectToPort(portPath) {
    return new Promise((resolve, reject) => {
        try {
            if (serialPort && serialPort.isOpen) {
                serialPort.close((err) => {
                    if (err) console.error('Error closing previous port:', err);
                });
            }

            serialPort = new SerialPort({
                path: portPath,
                baudRate: BAUD_RATE
            });

            // Setup parser for line-based reading
            parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

            serialPort.on('open', () => {
                console.log(`Serial port opened: ${portPath}`);
                isConnected = true;
                resolve(true);
                broadcastMessage('connection', { status: 'connected', port: portPath });
            });

            serialPort.on('error', (err) => {
                console.error('Serial port error:', err);
                isConnected = false;
                reject(err);
                broadcastMessage('error', { message: `Serial port error: ${err.message}` });
            });

            serialPort.on('close', () => {
                console.log('Serial port closed');
                isConnected = false;
                broadcastMessage('connection', { status: 'disconnected' });
            });

            // Handle incoming data from device
            if (parser) {
                parser.on('data', (data) => {
                    console.log(`Device -> ${data}`);
                    broadcastMessage('data', { content: data });
                });
            }

            // Timeout for connection establishment
            setTimeout(() => {
                if (!isConnected) {
                    reject(new Error('Connection timeout'));
                }
            }, SERIAL_TIMEOUT);

        } catch (error) {
            console.error('Connection error:', error);
            isConnected = false;
            reject(error);
        }
    });
}

/**
 * Send data to the serial device
 */
function sendToDevice(data) {
    return new Promise((resolve, reject) => {
        if (!serialPort || !isConnected) {
            reject(new Error('Serial port not connected'));
            return;
        }

        serialPort.write(data, (err) => {
            if (err) {
                console.error('Write error:', err);
                reject(err);
            } else {
                console.log(`Web -> Device: ${data}`);
                resolve();
            }
        });
    });
}

/**
 * Close the serial connection
 */
async function disconnectPort() {
    return new Promise((resolve) => {
        if (serialPort && serialPort.isOpen) {
            serialPort.close((err) => {
                if (err) console.error('Error closing port:', err);
                isConnected = false;
                resolve();
            });
        } else {
            resolve();
        }
    });
}

// ==========================================
// WebSocket Communication
// ==========================================

/**
 * Broadcast message to all connected clients
 */
function broadcastMessage(type, data) {
    const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    connectedClients.add(ws);
    let isAuthenticated = false;

    ws.on('message', async (message) => {
        try {
            const parsed = JSON.parse(message);
            const { type, command, data, password } = parsed;

            console.log(`WebSocket message: ${type || command}`);

            // Handle authentication
            if (type === 'auth') {
                if (password === DEVICE_PASSWORD) {
                    isAuthenticated = true;
                    authenticatedClients.add(ws);
                    console.log('Client authenticated successfully');
                    ws.send(JSON.stringify({
                        type: 'auth-response',
                        success: true,
                        timestamp: new Date().toISOString()
                    }));
                    
                    // Send current connection status after auth
                    ws.send(JSON.stringify({
                        type: 'connection',
                        data: { status: isConnected ? 'connected' : 'disconnected' },
                        timestamp: new Date().toISOString()
                    }));
                } else {
                    console.log('Authentication failed: Invalid password');
                    ws.send(JSON.stringify({
                        type: 'auth-response',
                        success: false,
                        message: 'Invalid password',
                        timestamp: new Date().toISOString()
                    }));
                }
                return;
            }

            // Check authentication for other commands
            if (!isAuthenticated) {
                console.log('Unauthorized command attempt');
                ws.send(JSON.stringify({
                    type: 'error',
                    data: { message: 'Not authenticated. Please provide password.' },
                    timestamp: new Date().toISOString()
                }));
                return;
            }

            switch (command) {
                case 'list-ports':
                    const ports = await listSerialPorts();
                    ws.send(JSON.stringify({
                        type: 'ports',
                        data: ports,
                        timestamp: new Date().toISOString()
                    }));
                    break;

                case 'connect':
                    try {
                        await connectToPort(data.port);
                        ws.send(JSON.stringify({
                            type: 'connection',
                            data: { status: 'connected', port: data.port },
                            timestamp: new Date().toISOString()
                        }));
                    } catch (error) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            data: { message: error.message },
                            timestamp: new Date().toISOString()
                        }));
                    }
                    break;

                case 'disconnect':
                    await disconnectPort();
                    ws.send(JSON.stringify({
                        type: 'connection',
                        data: { status: 'disconnected' },
                        timestamp: new Date().toISOString()
                    }));
                    break;

                case 'send':
                    try {
                        await sendToDevice(data.content);
                        ws.send(JSON.stringify({
                            type: 'ack',
                            data: { message: 'Data sent' },
                            timestamp: new Date().toISOString()
                        }));
                    } catch (error) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            data: { message: error.message },
                            timestamp: new Date().toISOString()
                        }));
                    }
                    break;

                default:
                    console.warn(`Unknown command: ${command}`);
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
            ws.send(JSON.stringify({
                type: 'error',
                data: { message: error.message },
                timestamp: new Date().toISOString()
            }));
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        connectedClients.delete(ws);
        authenticatedClients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// ==========================================
// REST API Endpoints
// ==========================================

/**
 * Get list of available serial ports
 */
app.get('/api/ports', async (req, res) => {
    try {
        const ports = await listSerialPorts();
        res.json({ success: true, ports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Get connection status
 */
app.get('/api/status', (req, res) => {
    res.json({
        connected: isConnected,
        clients: connectedClients.size,
        baudRate: BAUD_RATE
    });
});

/**
 * Connect to a port
 */
app.post('/api/connect', async (req, res) => {
    const { port } = req.body;

    if (!port) {
        return res.status(400).json({ success: false, error: 'Port is required' });
    }

    try {
        await connectToPort(port);
        res.json({ success: true, message: `Connected to ${port}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Disconnect from port
 */
app.post('/api/disconnect', async (req, res) => {
    try {
        await disconnectPort();
        res.json({ success: true, message: 'Disconnected' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Send data to device
 */
app.post('/api/send', async (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({ success: false, error: 'Data is required' });
    }

    try {
        await sendToDevice(data);
        res.json({ success: true, message: 'Data sent' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// Server Startup
// ==========================================

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║       GemBot Web Control Server v1.0             ║
║         Serial Bridge via WebSocket              ║
╚══════════════════════════════════════════════════╝

Server running at: http://localhost:${PORT}
WebSocket: ws://localhost:${PORT}
Baud Rate: ${BAUD_RATE}

Ready to accept connections...
    `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await disconnectPort();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nTerminating...');
    await disconnectPort();
    process.exit(0);
});
