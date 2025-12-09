/**
 * GemBot Sync Server
 * WebSocket server for real-time multi-device synchronization
 * 
 * Run: node gembot-sync-server.js
 */

const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

class GemBotSyncServer {
    constructor(port = 8080) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        
        // Connected devices
        this.devices = new Map();
        
        // Message queue for offline devices
        this.messageQueue = new Map();
        
        // Hardware connection
        this.hardwareConnected = false;
        this.hardwareSocket = null;
        
        this.init();
    }
    
    init() {
        console.log('🚀 GemBot Sync Server initializing...');
        
        // Setup Express routes
        this.setupRoutes();
        
        // Setup WebSocket handlers
        this.setupWebSocketHandlers();
        
        // Start listening
        this.server.listen(this.port, () => {
            console.log(`✅ GemBot Sync Server listening on port ${this.port}`);
        });
    }
    
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                devices: this.devices.size,
                hardwareConnected: this.hardwareConnected,
                timestamp: Date.now()
            });
        });
        
        // Get connected devices
        this.app.get('/devices', (req, res) => {
            const deviceList = Array.from(this.devices.values()).map(device => ({
                id: device.id,
                type: device.type,
                name: device.name,
                lastSeen: device.lastSeen,
                status: 'connected'
            }));
            res.json(deviceList);
        });
        
        // Get sync updates (polling fallback)
        this.app.get('/gembot-sync-updates', (req, res) => {
            const deviceId = req.query.deviceId;
            const messages = this.messageQueue.get(deviceId) || [];
            this.messageQueue.delete(deviceId);
            res.json(messages);
        });
        
        // Hardware status
        this.app.get('/hardware-status', (req, res) => {
            res.json({
                connected: this.hardwareConnected,
                timestamp: Date.now()
            });
        });
        
        // Serve static files
        this.app.use(express.static(path.join(__dirname, 'public')));
    }
    
    setupWebSocketHandlers() {
        this.wss.on('connection', (ws, req) => {
            const clientIp = req.socket.remoteAddress;
            console.log(`🔗 New WebSocket connection from ${clientIp}`);
            
            let deviceId = null;
            let deviceType = null;
            
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    
                    // First message should be device info
                    if (!deviceId && message.type === 'device-info') {
                        deviceId = message.sourceDeviceId;
                        deviceType = message.payload.type;
                        
                        this.registerDevice(deviceId, deviceType, message.payload, ws);
                        console.log(`👥 Device registered: ${deviceType} (${deviceId})`);
                    }
                    
                    // Route message to target device(s)
                    this.routeMessage(message, deviceId);
                    
                } catch (error) {
                    console.error('❌ Error processing message:', error);
                }
            });
            
            ws.on('close', () => {
                if (deviceId) {
                    console.log(`⚠️ Device disconnected: ${deviceId}`);
                    this.devices.delete(deviceId);
                    
                    // Notify other devices
                    this.broadcastToAll({
                        type: 'device-disconnected',
                        payload: { deviceId },
                        timestamp: Date.now()
                    });
                }
            });
            
            ws.on('error', (error) => {
                console.error('❌ WebSocket error:', error);
            });
        });
    }
    
    /**
     * Register a new device
     */
    registerDevice(deviceId, deviceType, payload, ws) {
        this.devices.set(deviceId, {
            id: deviceId,
            type: deviceType,
            name: payload.name,
            capabilities: payload.capabilities,
            ws,
            lastSeen: Date.now(),
            status: 'connected'
        });
        
        // Send list of other connected devices
        const otherDevices = Array.from(this.devices.values())
            .filter(d => d.id !== deviceId)
            .map(d => ({
                id: d.id,
                type: d.type,
                name: d.name,
                status: 'connected'
            }));
        
        this.sendToDevice(deviceId, {
            type: 'linked-devices',
            payload: otherDevices,
            timestamp: Date.now()
        });
        
        // Notify other devices about this new device
        this.broadcastToAllExcept(deviceId, {
            type: 'device-connected',
            payload: {
                id: deviceId,
                type: deviceType,
                name: payload.name
            },
            timestamp: Date.now()
        });
    }
    
    /**
     * Route message to appropriate target(s)
     */
    routeMessage(message, sourceDeviceId) {
        const { type, targetDeviceId, sourceDeviceId: msgSourceId } = message;
        
        // Update device last seen
        const device = this.devices.get(msgSourceId);
        if (device) {
            device.lastSeen = Date.now();
        }
        
        switch (type) {
            case 'heartbeat':
                // Update last seen and continue
                break;
                
            case 'machine-state-update':
                // Broadcast to all devices
                this.broadcastToAllExcept(sourceDeviceId, message);
                break;
                
            case 'video-stream-start':
            case 'video-stream-chunk':
            case 'video-stream-end':
                // Route video streams to all devices
                this.broadcastToAllExcept(sourceDeviceId, message);
                break;
                
            case 'hardware-connected':
                this.hardwareConnected = true;
                this.broadcastToAll(message);
                break;
                
            case 'hardware-disconnected':
                this.hardwareConnected = false;
                this.broadcastToAll(message);
                break;
                
            case 'sync-request':
                // Route to specific device if specified
                if (targetDeviceId) {
                    this.sendToDevice(targetDeviceId, message);
                } else {
                    this.broadcastToAllExcept(sourceDeviceId, message);
                }
                break;
                
            default:
                // Route based on target
                if (targetDeviceId) {
                    this.sendToDevice(targetDeviceId, message);
                } else {
                    this.broadcastToAllExcept(sourceDeviceId, message);
                }
        }
    }
    
    /**
     * Send message to specific device
     */
    sendToDevice(deviceId, message) {
        const device = this.devices.get(deviceId);
        
        if (device && device.ws && device.ws.readyState === WebSocket.OPEN) {
            try {
                device.ws.send(JSON.stringify(message));
            } catch (error) {
                console.error(`❌ Failed to send to ${deviceId}:`, error);
                // Queue message for retry
                if (!this.messageQueue.has(deviceId)) {
                    this.messageQueue.set(deviceId, []);
                }
                this.messageQueue.get(deviceId).push(message);
            }
        } else {
            // Device offline, queue message
            if (!this.messageQueue.has(deviceId)) {
                this.messageQueue.set(deviceId, []);
            }
            this.messageQueue.get(deviceId).push(message);
        }
    }
    
    /**
     * Broadcast to all connected devices
     */
    broadcastToAll(message) {
        this.devices.forEach((device, deviceId) => {
            this.sendToDevice(deviceId, message);
        });
    }
    
    /**
     * Broadcast to all devices except specified one
     */
    broadcastToAllExcept(excludeDeviceId, message) {
        this.devices.forEach((device, deviceId) => {
            if (deviceId !== excludeDeviceId) {
                this.sendToDevice(deviceId, message);
            }
        });
    }
    
    /**
     * Get server status
     */
    getStatus() {
        return {
            running: true,
            port: this.port,
            connectedDevices: this.devices.size,
            deviceList: Array.from(this.devices.values()).map(d => ({
                id: d.id,
                type: d.type,
                name: d.name,
                lastSeen: d.lastSeen
            })),
            hardwareConnected: this.hardwareConnected,
            queuedMessages: this.messageQueue.size,
            timestamp: Date.now()
        };
    }
}

// Start server
const server = new GemBotSyncServer(process.env.PORT || 8080);

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down GemBot Sync Server...');
    process.exit(0);
});

module.exports = GemBotSyncServer;
