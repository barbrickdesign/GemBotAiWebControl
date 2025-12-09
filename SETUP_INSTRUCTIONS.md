# GemBot Web Control - Setup Instructions

## Quick Start (Simplified Node Hosting)

### For the Computer Connected to GemBot:

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Install the LTS version

2. **Install Dependencies**
   ```bash
   npm install express http ws serialport cors
   ```

3. **Start the Server**
   ```bash
   node server-simple.js
   ```

   You'll see output like:
   ```
   ✅ Server running at:
      • Local:  http://localhost:3000
      • Remote: http://192.168.1.100:3000
   
   📋 Instructions:
      1. Share this IP with other users: 192.168.1.100
      2. They can access: http://192.168.1.100:3000
   ```

4. **Connect Your GemBot**
   - Open `GemBot_Web_Control_DualMode.html` in your browser
   - Select "🌐 WebSocket Server (Network)" mode
   - Enter: `localhost:3000`
   - Click Connect
   - Select your COM port and connect

### For Other Users (Remote Control):

1. **Get the IP Address**
   - Ask the person with the GemBot for their computer's IP
   - Example: `192.168.1.100`

2. **Open the Web Control**
   - Open `GemBot_Web_Control_DualMode.html` in your browser
   - Select "🌐 WebSocket Server (Network)" mode
   - Enter: `192.168.1.100:3000` (use the IP you received)
   - Click Connect
   - You're ready to control!

## How It Works

```
Your Computer (with Arduino)
    ↓
    └─→ Node.js Server (server-simple.js)
        ↓
        ├─→ Serial Connection to GemBot
        └─→ WebSocket Broadcast to All Users
            ↓
            ├─→ User 1 (Local or Remote)
            ├─→ User 2 (Local or Remote)
            └─→ User 3 (Local or Remote)
```

## Firewall Settings

If others can't connect, check your Windows Firewall:

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Click "Allow another app"
4. Browse to Node.js installation (usually `C:\Program Files\nodejs\node.exe`)
5. Click "Add"
6. Make sure it's checked for both "Private" and "Public"

## Troubleshooting

**"Connection refused"**
- Make sure `server-simple.js` is running
- Check the IP address is correct
- Check firewall settings

**"Serial port not found"**
- Make sure Arduino is connected via USB
- Check Device Manager for COM port
- Try clicking "Scan" in the web interface

**"Can't find server from another computer"**
- Use the IP address shown when server starts (not localhost)
- Make sure both computers are on the same network
- Check firewall allows port 3000

## File Locations

- `GemBot_Web_Control_DualMode.html` - Web interface (open in browser)
- `server-simple.js` - Node.js server (run with `node server-simple.js`)
- `SETUP_INSTRUCTIONS.md` - This file

## Questions?

The server will display your IP address when it starts. Share that IP with anyone who needs to control the GemBot remotely!
