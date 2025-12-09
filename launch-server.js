const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1><p>' + req.url + '</p>');
      return;
    }
    
    // Inject network URL into HTML as a global variable
    let html = content.toString();
    html = html.replace(
      '</head>', 
      `<script>
        window.GEMBOT_NETWORK_URL = '${networkURL}';
        console.log('✅ Network URL injected:', window.GEMBOT_NETWORK_URL);
      </script></head>`
    );
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
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
  console.log('✓ Press Ctrl+C to stop');
  console.log('');
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
