const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Get local IP address for network access
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
// Use environment variable for public URL if available (Render deployment)
const isProduction = process.env.RENDER === 'true';
const networkURL = isProduction 
  ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}`
  : `http://${localIP}:${PORT}`;

// Store connected mobile devices and desktop clients
let mobileDevices = new Map();
let desktopClients = new Set();

const server = http.createServer((req, res) => {
  // Log incoming connections with user agent info
  const userAgent = req.headers['user-agent'] || 'unknown';
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Health check endpoint for debugging
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      networkURL: networkURL, 
      timestamp: new Date().toISOString(),
      clientIP: clientIP,
      isMobile: isMobile
    }));
    return;
  }
  
  if (req.url === '/' || req.url === '/GemBot_Control_AI.html') {
    if (isMobile) {
      console.log(`📱 MOBILE CONNECTION: ${clientIP} - ${userAgent.substring(0, 50)}...`);
    } else {
      console.log(`💻 DESKTOP CONNECTION: ${clientIP}`);
    }
  }
  
  // Default to GemBot_Control_AI.html
  let filePath = path.join(__dirname, 'GemBot_Control_AI.html');
  
  if (req.url === '/' || req.url === '/GemBot_Control_AI.html') {
    filePath = path.join(__dirname, 'GemBot_Control_AI.html');
  } else if (req.url === '/redesigned' || req.url === '/GemBot_Control_Redesigned.html') {
    filePath = path.join(__dirname, 'GemBot_Control_Redesigned.html');
  } else {
    filePath = path.join(__dirname, req.url);
  }

  // Determine content type based on file extension
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8'
  };
  
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const isBinary = ['.glb', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.mp3', '.wav', '.mp4', '.webm'].includes(ext);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1><p>' + req.url + '</p>');
      return;
    }
    
    // Only inject network URL into HTML files
    if (ext === '.html') {
      let html = content.toString();
      html = html.replace(
        '</head>', 
        `<script>
          window.GEMBOT_NETWORK_URL = '${networkURL}';
          console.log('✅ Network URL injected:', window.GEMBOT_NETWORK_URL);
        </script></head>`
      );
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(html);
    } else {
      // Serve other files as-is with proper content type
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   GemBot Web Control Server Started    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log('✓ Server listening on all interfaces (0.0.0.0)');
  console.log('✓ Local access: http://127.0.0.1:' + PORT);
  console.log('✓ Network URL: ' + networkURL);
  console.log('✓ Mobile devices on WiFi can access: ' + networkURL);
  console.log('✓ Health check: ' + networkURL + '/health');
  console.log('✓ Serving: GemBot_Control_AI.html');
  console.log('✓ WebSocket relay: /mobile-camera-send (mobile→desktop)');
  console.log('✓ WebSocket relay: /mobile-camera (desktop receives)');
  console.log('✓ Press Ctrl+C to stop');
  console.log('');
});

// Create WebSocket server for camera streaming
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const url = req.url;
  const clientIP = req.socket.remoteAddress;
  
  if (url === '/mobile-camera-send') {
    // Mobile device sending camera frames to desktop
    console.log(`📤 Mobile camera send connection from ${clientIP}`);
    const mobileId = `mobile-${Date.now()}`;
    mobileDevices.set(mobileId, ws);
    
    ws.on('message', (data) => {
      // Relay frame data to all connected desktop clients
      desktopClients.forEach(desktop => {
        if (desktop.readyState === WebSocket.OPEN) {
          desktop.send(data);
        }
      });
    });
    
    ws.on('close', () => {
      console.log(`📤 Mobile camera closed: ${mobileId}`);
      mobileDevices.delete(mobileId);
    });
    
    ws.on('error', (err) => {
      console.error(`📤 Mobile camera error: ${err.message}`);
    });
  } 
  else if (url === '/mobile-camera') {
    // Desktop client receiving camera frames from mobile
    console.log(`📥 Desktop camera receive connection from ${clientIP}`);
    desktopClients.add(ws);
    
    ws.on('close', () => {
      console.log(`📥 Desktop client disconnected`);
      desktopClients.delete(ws);
    });
    
    ws.on('error', (err) => {
      console.error(`📥 Desktop client error: ${err.message}`);
    });
  }
});
