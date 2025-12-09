# GemBot Web Control - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Option 1: Direct Browser Connection (Easiest)

1. **Connect your GemBot** via USB to your computer
2. **Open the web interface** in Chrome/Edge/Opera:
   - Double-click `GemBot_Web_Control.html`
   - Or drag and drop into browser
3. **Click "Scan Ports"** button
4. **Select your port** from dropdown (usually shows Arduino device)
5. **Click "Connect"**
6. **Start controlling!** Use the virtual controls

✅ **Done!** No installation needed.

---

### Option 2: WebSocket Server (For Network Access)

Use this if you want to control from other devices on your network.

**Step 1: Install Node.js**
- Download from https://nodejs.org/ (LTS version)
- Run installer, next, next, finish
- Close and reopen PowerShell

**Step 2: Install Server**
```powershell
cd c:\Users\barbr\Desktop\GemBotMemory2025
npm install
```

**Step 3: Start Server**
```powershell
npm start
```

You should see:
```
Server running at: http://localhost:3000
WebSocket: ws://localhost:3000
Ready to accept connections...
```

**Step 4: Open Browser**
- Go to `http://localhost:3000`
- Same instructions as Option 1 from here

**Step 5: Access from Other Devices** (Optional)
- Find your PC's IP: Open PowerShell and type `ipconfig`
- Look for "IPv4 Address" (e.g., 192.168.1.5)
- On another device: `http://192.168.1.5:3000`

---

## 🎮 Basic Controls

### Virtual Pad (Left Side)
```
        ▲
   ◄    ✓    ►
        ▼
```
- **Arrow buttons**: Navigate menus
- **✓ (Green Enter button)**: Confirm selection
- **Exit button**: Go back

### Quick Buttons
- **Settings**: Opens device settings page
- **Design**: Enters design mode
- **Preform**: Starts preforming
- **Cut Gem**: Begins cutting
- **Polish**: Starts polishing
- **Calibrate**: Runs calibration

### Serial Monitor (Right Side)
Shows all communication between your computer and GemBot in real-time.

Send custom commands:
1. Type in the input field
2. Press Enter or click "Send"
3. See response in the monitor

---

## ⚠️ Troubleshooting

### "No USB devices found" when scanning
- ✅ Reconnect USB cable
- ✅ Try a different USB port
- ✅ Restart browser
- ✅ Make sure Arduino is powered on and responsive

### Port shows but won't connect
- ✅ Close Arduino IDE if open (it locks the port)
- ✅ Disconnect/reconnect USB
- ✅ Check that sketch is running on Arduino
- ✅ Try different USB cable

### Browser doesn't support Serial API
- ✅ Use Chrome, Edge, or Opera (not Firefox/Safari)
- ✅ Update browser to latest version
- ✅ Use the WebSocket server instead

### WebSocket server won't start
- ✅ Make sure Node.js is installed: `node --version`
- ✅ Check you're in the correct folder
- ✅ Try port 3001: Edit `server.js`, change `PORT = 3000` to `3001`

### Data not appearing in serial monitor
- ✅ Check Arduino is sending data (use Arduino IDE Serial Monitor to verify)
- ✅ Make sure baud rate matches (9600)
- ✅ Verify connection is successful (green status dot)

---

## 🌐 Accessing from Mobile

**The GemBot website works great on tablets and phones!**

1. Start server on your computer (Option 2 above)
2. Find your PC's IP address (use `ipconfig` command)
3. On mobile, visit: `http://[your-pc-ip]:3000`
4. Example: `http://192.168.1.50:3000`

The interface is fully mobile responsive - buttons are big enough to tap!

---

## 📱 Browser Support

| Browser | Works? | Notes |
|---------|--------|-------|
| Chrome Desktop | ✅ | Best option |
| Edge Desktop | ✅ | Best option |
| Opera Desktop | ✅ | Good |
| Firefox Desktop | ✅ | Use server mode |
| Safari Desktop | ✅ | Use server mode |
| Chrome Mobile | ✅ | Use server mode |
| Safari Mobile | ⚠️ | Limited, use server |

**Use "Server Mode" (Option 2) for best compatibility!**

---

## 🔗 Connection Flow

```
GemBot (USB)
    ↓
Computer (Arduino Port)
    ↓
    ├─→ Option 1: Browser Serial API → Chrome
    │   (Direct connection, desktop only)
    │
    └─→ Option 2: Node.js Server → WebSocket → Any Browser
        (Network bridge, works on mobile & remote devices)
```

---

## 💡 Tips & Tricks

1. **Test without GemBot**: The interface works even if not connected. Monitor shows status.

2. **Send raw commands**: Use the serial input field for advanced testing:
   - Type `page 0` to load page 0
   - Type `1` to simulate left arrow
   - Type `0` to simulate enter

3. **Keep server running**: Start server in morning, leave it running. Access from anywhere.

4. **Network stability**: Use wired Ethernet for server for best performance.

5. **Multiple users**: Multiple browsers can connect to same server simultaneously. Last one to press a button wins!

---

## 📞 Need Help?

1. Check the **GEMBOT_WEB_SETUP.md** for detailed documentation
2. Review **Troubleshooting** section above
3. Check browser console for errors (Press F12)
4. Verify Arduino sketch is working with Arduino IDE first

---

## 🎯 Next Steps

After you get it working:

1. **Customize controls**: Edit HTML file to add more buttons
2. **Add logging**: Modify server.js to save data to file
3. **Monitor temperature**: Read sensor data in serial monitor
4. **Create presets**: Add buttons for your favorite settings
5. **Deploy online**: Use ngrok or cloud hosting for remote access

---

## 📊 Status Indicator Legend

- **🟢 Green**: Connected and communicating
- **🔴 Red**: Disconnected or error
- **⚪ Gray**: Initializing or scanning

---

**Enjoy controlling your GemBot from anywhere! 💎**

Version 1.0 | December 2025 | GemBot Development Team
