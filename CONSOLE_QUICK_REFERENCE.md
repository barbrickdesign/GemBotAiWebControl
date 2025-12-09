# Console Diagnostics Quick Reference Card

**Print this or bookmark it!**

---

## 🔍 Opening Browser Console

| Browser | Shortcut | Menu |
|---------|----------|------|
| **Chrome** | `F12` | ⋮ → More tools → Developer tools |
| **Edge** | `F12` | ⋯ → More tools → Developer tools |
| **Firefox** | `Ctrl+Shift+K` | ☰ → More → Web Developer → Web Console |
| **Safari** | `Cmd+Option+I` | Safari → Preferences → Advanced → Show Develop |
| **Opera** | `F12` | ⋮ → Developer → Developer tools |

---

## 📋 Console Message Types

| Icon | Type | Color | Meaning |
|------|------|-------|---------|
| ✗ | error | 🔴 Red | Critical failure - action needed |
| ⚠ | warning | 🟠 Orange | Issue but may recover |
| ✓ | success | 🟢 Green | Operation completed successfully |
| ● | info | 🔵 Blue | General information |
| [DX] | diagnostic | 🔷 Cyan | System diagnostics |
| ⬅/→ | data | ⚪ Gray | Data being transmitted |
| 🔍 | debug | 🟣 Purple | Technical debugging info |

---

## 🎯 What to Look For

### Connection Successful
```
✅ Port opened successfully in XXms
✓ Connected successfully (X.XXs)
Connection established in X.XXs
=== Connection Successful ===
```

### Connection Failed
```
❌ Connection FAILED after X.XXs
Error: [specific error message]
Troubleshooting:
• [suggested fix 1]
• [suggested fix 2]
```

### No Devices Found
```
⚠️ No USB devices detected
Found 0 device(s)
Troubleshooting steps:
1. Check USB cable is connected
2. ...
```

### WebSocket Issues
```
❌ Connection TIMEOUT after 5.00s
WebSocket stuck in CONNECTING state
Possible causes: 1) Server not running...
```

---

## 🚀 Common Actions & Console Output

### Clicking "Scan Ports"
```
🔍 Starting port scan...
Port scan completed in XXXms
✅ Found 1 device(s)
  Port 1: VID=0x2341 (Arduino), PID=0x0042
```

### Clicking "Connect" (Browser Mode)
```
=== Connection Diagnostics ===
Mode: Browser Serial API
Attempt #1
Ports detected: 1
Selected port index: 0
Attempting to open port with baudRate 9600...
✅ Port opened successfully in 45ms
Connection established in 0.25s
```

### Clicking "Connect" (Server Mode)
```
=== Connection Diagnostics ===
Mode: WebSocket Server
Attempt #1
Server: localhost:3000
Protocol: WS
Resolving server: ws://localhost:3000
WebSocket state: 0 (connecting)
✅ WebSocket connected in 0.50s
=== WebSocket Connection Successful ===
```

### Sending Data
```
[SEND] 1 bytes: 0
[SEND] 15 bytes: page\x0000\xFF\xFF\xFF
```

### Receiving Data
```
[RX] 45 bytes: {"status":"ok"}
```

### Disconnecting
```
Closed serial port (connected for 5.23s)
Total data RX: 1234 bytes, TX: 56 bytes
Disconnected
```

---

## 🔧 Quick Troubleshooting

| Problem | Solution | Check Console For |
|---------|----------|-------------------|
| No ports found | Check USB cable | "⚠️ No USB devices detected" |
| Port busy | Close Arduino IDE | "Port is busy" or "Port is in use" |
| Connection failed | Try different USB port | "❌ Connection FAILED" |
| WebSocket timeout | Start server (npm start) | "❌ Connection TIMEOUT" |
| Browser not supported | Use Chrome/Edge | "Serial API not available" |
| Slow connection | Check USB port quality | "Connection established in X.XXs" |

---

## 📊 Status Panel Meanings

### Status: Connected
✅ Device is connected and ready

### Status: Disconnected  
❌ Device is not connected

### Port/Server
Shows where you're connected:
- `COM3` = USB port 3
- `localhost:3000` = Local server
- `None` = Not connected

### Mode
- `Browser API` = Direct USB (Chrome/Edge)
- `WebSocket` = Network connection (any browser)

### Data RX | TX
- `RX: 1234` = 1234 bytes received
- `TX: 56` = 56 bytes sent
- Updates in real-time

---

## 💡 Pro Tips

**Tip 1:** Look for RED messages first (errors)  
**Tip 2:** Read suggested fixes below errors  
**Tip 3:** Check timestamps to understand sequence  
**Tip 4:** Save console output for bug reports  
**Tip 5:** Filter console to show only errors  

---

## 🆘 Getting Help

1. **Open Browser Console (F12)**
2. **Try to connect** (let it fail if it does)
3. **Copy all RED messages** from console
4. **Include in bug report** with:
   - Browser name and version
   - Error messages (word-for-word)
   - What you were trying to do
   - What happened instead

**Example Report:**
```
Browser: Chrome 120.0
Device: Arduino Mega via COM3
Error: "Failed to open serial port"
Steps: Clicked Scan Ports → Selected COM3 → Clicked Connect
Expected: Should connect
Actual: Failed after 0.45s
Console shows: "Port may be in use"
```

---

## ✅ Verification Checklist

- [ ] Browser console opens with F12
- [ ] Can see colored messages
- [ ] Timestamps appear on each message
- [ ] Console shows browser capabilities on load
- [ ] Error messages are helpful and clear
- [ ] Data transmission is logged
- [ ] Connection timing is displayed
- [ ] Status panel updates in real-time

---

**Keep this page handy for quick reference!**

Version 1.0 | December 2, 2025 | Enhanced Diagnostics
