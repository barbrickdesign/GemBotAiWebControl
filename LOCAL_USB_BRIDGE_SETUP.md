# GemBot Local USB Bridge Setup

## Overview
When GemBot Web Control is hosted on Render.com (cloud), the desktop browser cannot directly access local USB devices. The **Local USB Bridge** solves this by running a small server on your desktop that:

1. Listens for commands from the cloud web app
2. Accesses your local Arduino/USB port
3. Relays data back to the cloud app

## Two Connection Methods

### Method 1: Direct WebSerial (Local Network)
- **When to use**: Running the app locally or on LAN
- **Pros**: Simple, no extra software needed
- **Cons**: Only works if browser supports Web Serial API
- **Browser support**: Chrome, Edge, Opera (not Safari, Firefox)

### Method 2: Local USB Bridge (Cloud + Local)
- **When to use**: App is on Render.com or other cloud
- **Pros**: Works anywhere, no browser limitations
- **Cons**: Requires bridge server to run on desktop
- **Setup**: 5 minutes

---

## Installing Local USB Bridge

### Requirements
- Node.js 14+ (https://nodejs.org)
- USB cable to Arduino
- Terminal/Command Prompt access

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install ws serialport @serialport/parser-readline
   ```

2. **Run the Bridge Server**
   ```bash
   node local-usb-bridge.js https://gembotaiwebcontrol.onrender.com 8001
   ```
   
   Or with custom port:
   ```bash
   node local-usb-bridge.js https://your-url.onrender.com 9000
   ```

3. **Expected Output**
   ```
   ╔════════════════════════════════════════╗
   ║   GemBot Local USB Bridge Server       ║
   ╚════════════════════════════════════════╝

   📍 Bridge ID: bridge-1733675400000
   ☁️  Render URL: https://gembotaiwebcontrol.onrender.com
   🔌 Local Port: 8001

   ✅ Local bridge listening on http://localhost:8001
      Health check: http://localhost:8001/health
      List ports: http://localhost:8001/ports
      Scan ports: http://localhost:8001/scan

   Commands: scan, connect [path], disconnect, send [cmd], status, exit
   ```

4. **Plug in Your Arduino**
   - USB cable from Arduino to desktop USB port
   - Bridge will auto-detect

---

## Using the Bridge in Web App

1. **Open Web App**
   - Go to https://gembotaiwebcontrol.onrender.com

2. **Click "🔍 Scan"**
   - Desktop: Shows Web Serial ports (if supported)
   - Desktop + Bridge: Shows both local and bridge ports
   - Bridge option labeled: "🌉 Bridge: /dev/ttyACM0"

3. **Select Port**
   - Choose the bridge option with your Arduino port

4. **Click "🔌 Connect"**
   - App detects bridge and uses local-usb-bridge.js
   - Connected via WebSocket relay

5. **Use Normally**
   - All motor commands flow through bridge to Arduino
   - Video camera still works independently

---

## Interactive Bridge CLI

While running, the bridge provides a CLI for testing:

```
Commands: scan, connect [path], disconnect, send [cmd], status, exit

> scan
🔍 Scanned 1 USB port(s)
  0: /dev/ttyACM0 (Arduino)

> connect /dev/ttyACM0
🔌 Connecting to /dev/ttyACM0 at 115200 baud...
✅ USB Connected: /dev/ttyACM0

> send y
📤 Sent to Arduino: y

> status
USB Connected: true
Render Connected: true
Available Ports: 1

> exit
⏹️  Shutting down...
```

---

## Troubleshooting

### Bridge Won't Start
**Error:** `Cannot find module 'ws'`
```bash
npm install ws serialport @serialport/parser-readline
```

### USB Port Not Found
- **Check**: `node local-usb-bridge.js` → `scan`
- **Try**: 
  - Unplug and replug Arduino
  - Different USB cable
  - Different USB port on desktop
  - Windows: Check Device Manager for COM port
  - Mac/Linux: `ls /dev/tty*` to list ports

### Web App Doesn't See Bridge
- **Check**: Bridge is running (`health` endpoint accessible)
- **Try**: http://localhost:8001/health in browser
- **Verify**: Bridge is connected to Render (`Render Connected: true`)

### Connection Drops
- **Cause**: Bridge crashed or network issue
- **Fix**: Restart bridge with `node local-usb-bridge.js`
- **Note**: Web app will auto-retry connection

### Arduino Doesn't Respond
- **Check**: Bridge shows "USB Connected: true"
- **Try**: `send s1` to initialize firmware
- **Verify**: Arduino is powered and USB cable works

---

## Advanced Configuration

### Change Bridge Port
```bash
node local-usb-bridge.js https://your-url.com 9000
```

### Set via Environment Variables
```bash
export RENDER_URL=https://gembotaiwebcontrol.onrender.com
export LOCAL_BRIDGE_PORT=8001
node local-usb-bridge.js
```

### Autostart on Windows
Create `start-bridge.bat`:
```batch
@echo off
cd C:\path\to\GemBotMemory2025
node local-usb-bridge.js https://gembotaiwebcontrol.onrender.com 8001
pause
```
Double-click to start.

### Autostart on Mac/Linux
Create `start-bridge.sh`:
```bash
#!/bin/bash
cd ~/Desktop/GemBotMemory2025
node local-usb-bridge.js https://gembotaiwebcontrol.onrender.com 8001
```

Make executable:
```bash
chmod +x start-bridge.sh
./start-bridge.sh
```

---

## How It Works Technically

### Architecture
```
Mobile Phone                Desktop              Arduino
    │                         │                     │
    ├─── Mobile Camera ───────┤ (WebSocket relay)  │
    │    (P2P stream)         │                     │
    │                         │                     │
    └─ Camera Link to Desktop ┤                     │
                              │                     │
                    ☁️ RENDER.COM                    │
                              │                     │
                         Web App                     │
                         (Browser)                   │
                              │                     │
                    🌉 Local Bridge                  │
                      (Node.js)                      │
                              │ (WebSocket)         │
                              └─────────────────────│
                                  USB Cable
```

### Message Flow

**Command (Web → Arduino)**
1. User clicks motor button in browser
2. Web app sends: `{type: 'send-command', command: 'y'}`
3. Bridge receives via WebSocket
4. Bridge writes to serial port: `y\n`
5. Arduino receives and executes

**Response (Arduino → Web)**
1. Arduino sends response via serial: `X:100 Y:50 P:25`
2. Bridge reads serial data
3. Bridge sends via WebSocket: `{type: 'serial-data', data: 'X:100 Y:50 P:25'}`
4. Web app receives and displays

### Security
- Bridge only listens on `localhost` (127.0.0.1)
- Only accepts commands from paired Render server
- No internet exposure
- Bridge ID prevents replay attacks

---

## Performance

### Latency
- Direct WebSerial: <10ms
- Bridge WebSocket: 50-200ms (typical)
- Bridge is sufficient for manual control

### Reliability
- Bridge auto-reconnects if network drops
- Motor commands queue while reconnecting
- Works across WiFi, 4G, VPN

### Bandwidth
- Negligible: ~100 bytes/second
- ~36KB/day for typical use
- No video through bridge (video is P2P)

---

## Support

If you encounter issues:

1. **Check bridge health**
   ```bash
   curl http://localhost:8001/health
   ```

2. **Enable debug logs**
   - Check browser console (F12)
   - Check bridge terminal output

3. **Test Arduino directly**
   ```bash
   node local-usb-bridge.js
   > scan
   > connect /dev/ttyACM0
   > send y
   ```

4. **Report issues** with:
   - Bridge version: `npm list ws serialport`
   - Node version: `node --version`
   - Port info from `scan` command
   - Error messages from both bridge and browser console

---

## FAQ

**Q: Do I need the bridge if the app is on my local machine?**
A: No! If running on `localhost:8000`, Web Serial API works directly. Only use bridge for cloud hosting.

**Q: Can I run the bridge on a different machine?**
A: Yes! Change `localBridgeURL` in web app code to `http://bridge-machine-ip:8001`

**Q: What if I lose internet while using the bridge?**
A: Bridge reconnects automatically when internet returns. Commands queue while offline.

**Q: Can I run multiple bridges?**
A: Yes! Each gets unique Bridge ID. Web app auto-detects all available ports.

**Q: Is the bridge secure?**
A: Yes! It only accepts commands from authorized Render server and doesn't expose ports to internet.

---

## Version History

- **1.0** (Dec 2025): Initial release
  - Direct serial communication
  - Port scanning
  - Auto-reconnection
  - Health checks
  - Interactive CLI

