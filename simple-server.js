/**
 * Simple HTTP Server for GemBot_Control_AI.html
 * Minimal setup - just serves files
 */

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve GemBot_Control_AI.html at root
app.get('/', (req, res) => {
    console.log('✓ Request received for root path');
    res.sendFile(path.join(__dirname, 'GemBot_Control_AI.html'));
});

// Also serve it at the explicit path
app.get('/GemBot_Control_AI.html', (req, res) => {
    console.log('✓ Request received for GemBot_Control_AI.html');
    res.sendFile(path.join(__dirname, 'GemBot_Control_AI.html'));
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   GemBot Web Control Server Started    ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`✓ Server running at: http://localhost:${PORT}`);
    console.log(`✓ Serving: GemBot_Control_AI.html`);
    console.log(`✓ File size: Check console`);
    console.log('\nAccess at:');
    console.log(`  • http://localhost:${PORT}/`);
    console.log(`  • http://localhost:${PORT}/GemBot_Control_AI.html\n`);
    console.log('Press Ctrl+C to stop server\n');
});

// Handle errors
process.on('error', (err) => {
    console.error('Server error:', err);
});
