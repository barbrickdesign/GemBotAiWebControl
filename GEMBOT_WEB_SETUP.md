# GemBot Web Control Interface

A professional, mobile-responsive web application for controlling the GemBot automated gem cutting machine via USB serial connection. Features real-time serial communication, virtual touch controls, and a comprehensive dashboard.

## Features

✅ **USB Serial Connection**
- Automatic Arduino port detection
- 9600 baud rate communication
- Real-time data streaming

✅ **Control Interface**
- Directional pad (Up, Down, Left, Right, Enter)
- Quick command buttons for common operations
- Menu navigation controls
- Settings, Design, Preform, Cut, and Polish functions

✅ **Serial Monitor**
- Real-time data display
- Command logging
- Timestamp tracking
- Scrollable message history
- Send custom commands directly

✅ **Device Status Dashboard**
- Connection status indicator
- Port information
- Baud rate display
- Data received counter

✅ **Mobile Responsive**
- Works on tablets and smartphones
- Touch-friendly button sizing
- Responsive grid layouts
- Optimized for various screen sizes

✅ **Multiple Connection Options**
1. **Browser Serial API** (Chrome/Edge/Opera) - Direct USB connection
2. **WebSocket Server** (Node.js) - Network-based bridge

## Installation & Setup

### Option 1: Browser Serial API (Direct Connection)

**Requirements:**
- Chrome, Edge, or Opera browser (version 89+)
- USB cable connecting GemBot to computer

**Steps:**
1. Open `GemBot_Web_Control.html` directly in your browser
2. Click "Scan Ports" to detect connected Arduino boards
3. Select your port from the dropdown
4. Click "Connect"
5. Start controlling your GemBot!

**Advantages:**
- No server required
- Works offline
- Direct, low-latency connection
- Cross-device control (share link with other devices on same network)

**Limitations:**
- Desktop browsers only
- Not available on mobile Safari or Firefox
- USB device must be plugged into the computer running the browser

### Option 2: WebSocket Server Bridge (Recommended for Networks)

This option allows you to control your GemBot from any device on your network, or remotely via the internet.

**Requirements:**
- Node.js (v14 or higher)
- npm (v6 or higher)
- USB connection to Arduino on server machine

**Installation Steps:**

1. **Install Node.js**
   - Download from https://nodejs.org/
   - Install the LTS version

2. **Install Dependencies**
   ```powershell
   cd c:\Users\barbr\Desktop\GemBotMemory2025
   npm install
   ```

3. **Start the Server**
   ```powershell
   npm start
   ```
   
   Or with auto-reload during development:
   ```powershell
   npm install --save-dev nodemon
   npm run dev
   ```

4. **Open in Browser**
   - Open http://localhost:3000 in your browser
   - Click "Scan Ports" to find your GemBot
   - Select port and click "Connect"
   - Use the control interface

5. **Access from Other Devices**
   - Find your computer's IP address:
     ```powershell
     ipconfig
     ```
     Look for "IPv4 Address" (e.g., 192.168.1.100)
   
   - From other devices on the same network:
     ```
     http://192.168.1.100:3000
     ```

6. **Internet Access (Optional)**
   - Use a service like ngrok or Cloudflare Tunnel
   - Or deploy to a VPS with your own domain

## File Structure

```
GemBotMemory2025/
├── GemBot_Web_Control.html      # Main web interface (Browser API)
├── server.js                     # Node.js WebSocket server
├── package.json                  # Node.js dependencies
├── GEMBOT_WEB_SETUP.md          # This file
└── /public/                      # (Optional) Place HTML here for server
    └── index.html               # Copy of GemBot_Web_Control.html
```

## Usage Guide

### Control Pad

The virtual control pad mirrors the physical Nextion touch screen:

```
        ▲ UP
   ◄ LEFT ✓ ENTER ► RIGHT
        ▼ DOWN
```

- **UP/DOWN/LEFT/RIGHT**: Navigate menus and options
- **ENTER**: Confirm selections
- **EXIT**: Go back/exit current menu

### Quick Commands

One-click access to common operations:
- **Settings**: Open device settings
- **Design**: Enter design mode
- **Preform**: Start preforming operation
- **Cut Gem**: Begin cutting process
- **Polish**: Polish the gem
- **Calibrate**: Run calibration routine

### Serial Monitor

**Receiving Data:**
- All data from the Arduino is displayed in real-time
- Timestamps show exactly when each message arrived
- Messages are color-coded by type:
  - `[DATA]`: Incoming device data (green)
  - `[SENT]`: Commands you sent (blue)
  - `[✓]`: Success messages (green)
  - `[!]`: Warnings (yellow)
  - `[✗]`: Errors (red)

**Sending Commands:**
- Type raw commands directly in the input field
- Press Enter or click "Send" to transmit
- Useful for debugging and advanced control

**Example Commands:**
- `page 0` - Load page 0 on Nextion display
- `page 14\xFF\xFF\xFF` - Load page 14 with proper terminator
- Custom JSON or serial protocols specific to your device

### Status Dashboard

Monitor device status in real-time:
- **Connection Status**: Connected/Disconnected
- **Selected Port**: Which COM port is in use
- **Baud Rate**: Communication speed (9600)
- **Data Received**: Total bytes received from device

## Device Communication Protocol

The GemBot uses a simple text-based serial protocol at 9600 baud.

### Message Format

**Device → Computer (Input)**
```
Single characters or strings terminated by newline
Examples:
- Individual key presses: "0", "1", "2", "3", "8"
- Page navigation: "page 0", "page 14"
```

**Computer → Device (Output)**
```
Commands as strings (match device expectations)
Examples:
- "0"           # Enter/Confirm
- "1"           # Left arrow
- "3"           # Right arrow
- "page 14"     # Load UI page
```

### Command Reference

| Command | Function |
|---------|----------|
| `0` | Enter/Confirm |
| `1` | Navigate Left |
| `2` | Exit/Back |
| `3` | Navigate Right |
| `8` | Print Menu |
| `page N` | Load display page N |
| `page N\xFF\xFF\xFF` | Load page with Nextion terminator |

For a complete command list, review the Arduino code in `GemBotArduinoMemoryUpgrade2025_copy_20251201233437.ino`.

## Troubleshooting

### "No USB devices found"
- Ensure GemBot is connected via USB
- Try a different USB port or cable
- Check Device Manager to see if Arduino appears
- On Windows, you may need to install CH340 drivers

### Port appears but won't connect
- Make sure no other applications are using the serial port
- Close Arduino IDE if it's open
- Try disconnecting and reconnecting USB
- Verify the Arduino sketch is uploaded and running

### Serial API not available
- Use Chrome, Edge, or Opera (not Firefox or Safari)
- Update your browser to the latest version
- Use the WebSocket server option instead

### Data not appearing in monitor
- Verify 9600 baud rate matches your Arduino configuration
- Check that the Arduino sketch includes Serial.begin(9600)
- Use Arduino IDE Serial Monitor to verify device output
- Try pressing keys on the physical Nextion display

### WebSocket Server won't start
- Verify Node.js is installed: `node --version`
- Check that port 3000 is not in use
- Run: `netstat -ano | findstr :3000`
- If in use, stop that process or change PORT in server.js

### Can't connect from other devices
- Verify both devices are on same network
- Check Windows Firewall (port 3000 may need to be open)
- Use your computer's IP address, not localhost
- Find IP with: `ipconfig` (look for IPv4 Address)

## Security Notes

⚠️ **Important for Remote Access:**

If exposing this interface to the internet:
1. Add authentication (username/password)
2. Use HTTPS/WSS (encrypted connections)
3. Implement rate limiting
4. Use a VPN for remote access
5. Never expose directly to the internet without authentication

For local network only, the current setup is fine.

## Browser Compatibility

| Browser | Serial API | WebSocket | Recommended |
|---------|-----------|-----------|-------------|
| Chrome 89+ | ✅ | ✅ | Best |
| Edge 89+ | ✅ | ✅ | Best |
| Opera 75+ | ✅ | ✅ | Good |
| Firefox | ❌ | ✅ | Server mode |
| Safari | ❌ | ✅ | Server mode |
| Mobile Chrome | ❌ | ✅ | Server mode |
| Mobile Safari | ❌ | ❌ | Limited |

**Note:** Mobile browsers can use the WebSocket server on a desktop. They cannot use direct Serial API.

## Performance Optimization

### For Large Data Streams
- Increase buffer size if experiencing data loss
- In server.js, adjust parser settings
- Monitor CPU usage on the server machine

### For Network Lag
- Keep server on same local network as clients
- Close other applications using bandwidth
- Consider wired Ethernet connection for server

### For Multiple Clients
- Current server supports unlimited WebSocket connections
- Each client gets independent control
- Implement message queuing if conflicts occur

## Advanced Configuration

### Changing Baud Rate

**In HTML file (Serial API):**
```javascript
// Line in openPort() function
await this.port.open({ baudRate: 115200 }); // Change 9600 to desired rate
```

**In server.js (WebSocket):**
```javascript
// Line 11
const BAUD_RATE = 115200; // Change 9600 to desired rate
```

### Custom Port Configuration

**Serial API:**
```javascript
await this.port.open({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    flowControl: 'none'
});
```

### Environment Variables (Server)

Create `.env` file:
```
PORT=3000
BAUD_RATE=9600
SERIAL_TIMEOUT=5000
```

## API Reference (WebSocket Server)

### Connection Messages

**Connect Command:**
```json
{
  "command": "connect",
  "data": { "port": "/dev/ttyUSB0" }
}
```

**List Ports:**
```json
{
  "command": "list-ports"
}
```

**Send Data:**
```json
{
  "command": "send",
  "data": { "content": "page 0\xFF\xFF\xFF" }
}
```

**Disconnect:**
```json
{
  "command": "disconnect"
}
```

### Response Messages

**Connection Status:**
```json
{
  "type": "connection",
  "data": { "status": "connected", "port": "/dev/ttyUSB0" },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

**Data Received:**
```json
{
  "type": "data",
  "data": { "content": "Device response here" },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

**Error:**
```json
{
  "type": "error",
  "data": { "message": "Error description" },
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

## Future Enhancements

Planned features for v2.0:
- [ ] WiFi connection support (via Nextion's network integration)
- [ ] Data logging and export (CSV, JSON)
- [ ] Recording and playback of control sequences
- [ ] Real-time video feed integration
- [ ] Temperature and sensor monitoring graphs
- [ ] Parameter presets and saving
- [ ] Multi-device management
- [ ] Mobile app (PWA - Progressive Web App)
- [ ] Dark mode theme
- [ ] Gesture controls for mobile

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the Arduino code comments
3. Check browser console for JavaScript errors (F12)
4. Verify device is working with Arduino IDE Serial Monitor

## Version History

**v1.0.0** (2025-12-02)
- Initial release
- Serial API support (Chrome/Edge/Opera)
- WebSocket server option
- Real-time serial monitoring
- Virtual control pad
- Mobile responsive design
- Status dashboard

---

**Created by:** GemBot Development Team  
**Last Updated:** December 2, 2025  
**Arduino Target:** Arduino Mega 2560 + Nextion Display
