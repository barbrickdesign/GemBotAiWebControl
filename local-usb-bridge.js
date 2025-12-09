#!/usr/bin/env node
/**
 * LOCAL USB BRIDGE SERVER
 * Runs on your desktop machine to bridge local USB/Arduino access
 * to the cloud-hosted Render web app via WebSocket
 * 
 * Usage: node local-usb-bridge.js [desktop-url] [local-port]
 * Example: node local-usb-bridge.js https://gembotaiwebcontrol.onrender.com 8001
 */

const WebSocket = require('ws');
const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const readline = require('readline');

// Configuration
const RENDER_URL = process.argv[2] || process.env.RENDER_URL || 'https://gembotaiwebcontrol.onrender.com';
const LOCAL_PORT = parseInt(process.argv[3] || process.env.LOCAL_BRIDGE_PORT || 8001);
const BRIDGE_ID = `bridge-${Date.now()}`;

console.log('╔════════════════════════════════════════╗');
console.log('║   GemBot Local USB Bridge Server       ║');
console.log('╚════════════════════════════════════════╝');
console.log('');
console.log(`📍 Bridge ID: ${BRIDGE_ID}`);
console.log(`☁️  Render URL: ${RENDER_URL}`);
console.log(`🔌 Local Port: ${LOCAL_PORT}`);
console.log('');

// Serial port management
let port = null;
let parser = null;
let isConnected = false;
let availablePorts = [];
let commandQueue = [];

// WebSocket connection to Render server
let renderWS = null;
let renderConnected = false;

// Local HTTP server for bridge operations
const localServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      bridgeId: BRIDGE_ID,
      usbConnected: isConnected,
      renderConnected: renderConnected,
      availablePorts: availablePorts
    }));
    return;
  }

  if (req.url === '/ports' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ ports: availablePorts }));
    return;
  }

  if (req.url === '/scan' && req.method === 'GET') {
    scanPorts();
    setTimeout(() => {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        ports: availablePorts,
        scanning: true 
      }));
    }, 500);
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

async function scanPorts() {
  try {
    availablePorts = await SerialPort.list();
    console.log(`🔍 Scanned ${availablePorts.length} USB port(s)`);
    availablePorts.forEach((p, idx) => {
      console.log(`  ${idx}: ${p.path} (${p.manufacturer || 'Unknown'})`);
    });
    
    // Notify Render server about available ports
    if (renderWS && renderConnected) {
      renderWS.send(JSON.stringify({
        type: 'ports-available',
        ports: availablePorts
      }));
    }
  } catch (err) {
    console.error('❌ Port scan error:', err.message);
  }
}

async function connectToUSB(portPath, baudRate = 115200) {
  try {
    if (port && port.isOpen) {
      await port.close();
    }

    console.log(`🔌 Connecting to ${portPath} at ${baudRate} baud...`);
    
    port = new SerialPort({ 
      path: portPath, 
      baudRate: baudRate,
      autoOpen: false 
    });

    parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('open', () => {
      isConnected = true;
      console.log(`✅ USB Connected: ${portPath}`);
      notifyRender({ type: 'usb-connected', port: portPath, baudRate });
    });

    parser.on('data', (data) => {
      // Forward Arduino responses to Render
      if (renderWS && renderConnected) {
        renderWS.send(JSON.stringify({
          type: 'serial-data',
          data: data.toString().trim()
        }));
      }
    });

    port.on('error', (err) => {
      console.error('❌ Serial port error:', err.message);
      isConnected = false;
      notifyRender({ 
        type: 'usb-error',
        error: err.message
      });
    });

    port.on('close', () => {
      isConnected = false;
      console.log('⏹️  USB Disconnected');
      notifyRender({ type: 'usb-disconnected' });
    });

    await port.open();
    
    // Send initial command to Arduino to verify connection
    setTimeout(() => {
      if (isConnected) {
        sendToArduino('S0\n');
      }
    }, 500);

  } catch (error) {
    console.error(`❌ Connection failed: ${error.message}`);
    isConnected = false;
    notifyRender({ 
      type: 'usb-error',
      error: error.message
    });
  }
}

async function disconnectUSB() {
  try {
    if (port && port.isOpen) {
      await port.close();
      console.log('✅ USB Disconnected');
    }
  } catch (err) {
    console.error('❌ Disconnect error:', err.message);
  }
}

function sendToArduino(command) {
  if (!port || !isConnected) {
    console.warn('⚠️  USB not connected, queuing command:', command.trim());
    commandQueue.push(command);
    return;
  }

  try {
    port.write(command, (err) => {
      if (err) {
        console.error('❌ Write error:', err.message);
      } else {
        console.log(`📤 Sent to Arduino: ${command.trim()}`);
      }
    });
  } catch (err) {
    console.error('❌ Send error:', err.message);
  }
}

function notifyRender(message) {
  if (renderWS && renderConnected) {
    renderWS.send(JSON.stringify(message));
  }
}

function connectToRender() {
  const wsUrl = RENDER_URL.replace('https://', 'wss://').replace('http://', 'ws://') + '/local-bridge';
  
  console.log(`🔗 Connecting to Render server at ${wsUrl}...`);
  
  renderWS = new WebSocket(wsUrl);

  renderWS.onopen = () => {
    renderConnected = true;
    console.log('✅ Connected to Render server');
    
    // Identify bridge to server
    renderWS.send(JSON.stringify({
      type: 'bridge-identified',
      bridgeId: BRIDGE_ID,
      version: '1.0'
    }));

    // Send current status
    scanPorts();
  };

  renderWS.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'scan-ports':
          scanPorts();
          break;
          
        case 'connect-usb':
          connectToUSB(message.port, message.baudRate || 115200);
          break;
          
        case 'disconnect-usb':
          disconnectUSB();
          break;
          
        case 'send-command':
          sendToArduino(message.command + '\n');
          break;
          
        case 'ping':
          renderWS.send(JSON.stringify({ type: 'pong', bridgeId: BRIDGE_ID }));
          break;

        default:
          console.log('📨 Unknown message type:', message.type);
      }
    } catch (err) {
      console.error('❌ Message parse error:', err.message);
    }
  };

  renderWS.onerror = (error) => {
    console.error('❌ Render connection error:', error.message);
    renderConnected = false;
  };

  renderWS.onclose = () => {
    console.log('⏹️  Render connection closed, reconnecting in 5 seconds...');
    renderConnected = false;
    setTimeout(connectToRender, 5000);
  };
}

// Start local HTTP server
localServer.listen(LOCAL_PORT, 'localhost', () => {
  console.log(`\n✅ Local bridge listening on http://localhost:${LOCAL_PORT}`);
  console.log('   Health check: http://localhost:' + LOCAL_PORT + '/health');
  console.log('   List ports: http://localhost:' + LOCAL_PORT + '/ports');
  console.log('   Scan ports: http://localhost:' + LOCAL_PORT + '/scan\n');
});

// Connect to Render server
setTimeout(connectToRender, 1000);

// Interactive CLI for testing
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Commands: scan, connect [path], disconnect, send [cmd], status, exit\n');

function prompt() {
  rl.question('> ', async (line) => {
    const [cmd, ...args] = line.trim().split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'scan':
        await scanPorts();
        break;
      case 'connect':
        if (args[0]) {
          await connectToUSB(args[0], parseInt(args[1]) || 115200);
        } else {
          console.log('Usage: connect [port-path] [baudrate]');
        }
        break;
      case 'disconnect':
        await disconnectUSB();
        break;
      case 'send':
        sendToArduino(args.join(' '));
        break;
      case 'status':
        console.log(`USB Connected: ${isConnected}`);
        console.log(`Render Connected: ${renderConnected}`);
        console.log(`Available Ports: ${availablePorts.length}`);
        break;
      case 'exit':
        process.exit(0);
        break;
      default:
        if (line.trim()) console.log('Unknown command');
    }
    
    prompt();
  });
}

prompt();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down...');
  if (port) await disconnectUSB();
  if (renderWS) renderWS.close();
  localServer.close();
  process.exit(0);
});
