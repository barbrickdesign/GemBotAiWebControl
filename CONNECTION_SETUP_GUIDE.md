# 🔌 GemBot Connection & Setup Guide (Updated 2025)

## 🎯 Current Status

✅ **All systems ready for testing**
- Dual connection methods implemented (Direct + Bridge)
- Mobile-to-desktop camera streaming working
- Merlin AI fully enhanced with setup guidance
- Both Windows/Mac USB and cloud hosting supported

---

## 📋 What You Need

- [ ] Arduino with USB cable
- [ ] Browser: Chrome, Edge, or Opera (Web Serial API support)
- [ ] (Optional) USB webcam or mobile phone for camera
- [ ] (Optional) Desktop PC running `local-usb-bridge.js` if using cloud hosting

---

## 🚀 Quick Start (Choose Your Setup)

### Setup A: LOCAL NETWORK (Simplest)

You have: Desktop PC + Arduino on same WiFi

```
1. Open: https://gembotaiwebcontrol.onrender.com
2. Click 🔍 SCAN
3. Select your port (usually COM3, COM4, etc.)
4. Click 🔌 CONNECT
5. Status should turn 🟢 GREEN
✅ Done!
```

**Pros**: Simple, fast, no extra software
**Cons**: Only works on local/LAN network

---

### Setup B: CLOUD HOSTING + LOCAL BRIDGE (Best for Cloud)

You have: Cloud app (Render.com) + Arduino on local desktop

```
STEP 1 - RUN BRIDGE ON DESKTOP:
  1. Open PowerShell/Terminal on desktop
  2. cd to project folder
  3. Run: node local-usb-bridge.js
  4. You should see: "🌉 Bridge listening on http://localhost:8001"

STEP 2 - CONNECT VIA WEB APP:
  5. Open: https://gembotaiwebcontrol.onrender.com
  6. Click 🔍 SCAN
  7. Look for "🌉 Bridge: COM3", "🌉 Bridge: COM4", etc.
  8. Click 🔌 CONNECT
  9. Status should turn 🟢 GREEN
✅ Done!
```

**Pros**: Works with cloud hosting, stable, works anywhere
**Cons**: Requires desktop server running, slightly higher latency

---

### Setup C: 3D VIRTUAL MACHINE (No Hardware Needed)

No Arduino? No problem!

```
1. Open: https://gembotaiwebcontrol.onrender.com
2. Click 📍 MACHINE in header
3. Select "3D Virtual Machine"
4. Click 📷 START CAMERA to see 3D view
5. Move sliders to control virtual machine
✅ Practice risk-free!
```

**Pros**: Learn without hardware, safe, instant
**Cons**: Virtual only, no real cutting

---

## 📱 Mobile Camera Setup

### Link Mobile to Desktop

```
MOBILE SIDE (iPhone/Android):
  1. Open same URL on mobile: https://gembotaiwebcontrol.onrender.com
  2. Tap 🔗 LINK TO DESKTOP
  3. Grant camera permission
  4. Look for: "📤 Streaming camera to desktop..."

DESKTOP SIDE:
  5. You'll see: "📱 Mobile Device Connected"
  6. In camera dropdown, select: 📲 Mobile Device Camera
  7. Click 📷 START CAMERA
  8. Mobile camera appears on desktop!
```

**Why?** Mobile camera provides better view of cutting area than webcam.

---

## 🔌 Connection Methods Explained

### Method 1: Direct WebSerial (Setup A)

```
Browser WebSerial API
        ↓
    Local USB
        ↓
    Arduino
```

**Requirements**:
- Browser: Chrome, Edge, Opera (not Safari/Firefox)
- Arduino on same computer or local network

**Best for**:
- Local development
- LAN networks
- Direct USB connection

**Install**:
- No extra installation needed!
- Just plug in Arduino and go

---

### Method 2: Local USB Bridge (Setup B)

```
Web App (Render.com)
        ↓
  WebSocket relay
        ↓
  Bridge Server (localhost:8001)
        ↓
  Node.js + SerialPort
        ↓
  Local USB
        ↓
  Arduino
```

**Requirements**:
- Desktop PC running `local-usb-bridge.js`
- Node.js installed
- Dependencies: `npm install ws serialport @serialport/parser-readline`

**Best for**:
- Cloud hosting (Render, Heroku, etc.)
- Remote monitoring
- Multiple machines

**Install Bridge Server**:
```bash
# 1. Make sure you have Node.js installed
# 2. In project folder, run:
npm install ws serialport @serialport/parser-readline

# 3. Start the bridge:
node local-usb-bridge.js

# 4. Should see:
# 🌉 Bridge listening on http://localhost:8001
# Connected to Render WebSocket server
```

---

## 🆘 Troubleshooting

### Status Won't Turn Green

**Problem**: Arduino connected but status stays 🔴 RED

**Solutions** (Try in order):
1. Unplug USB, wait 3 seconds, plug back in
2. Click 🔍 SCAN again
3. Try different USB port
4. Try different USB cable
5. Restart your Arduino board
6. Ask Merlin: "Arduino won't connect"

---

### No Ports Found

**Problem**: SCAN button doesn't show COM3/COM4/etc.

**Windows**:
1. Open Device Manager
2. Expand "Ports (COM & LPT)"
3. Look for "USB Serial Port" or "CH340"
4. If missing or with ⚠️: Driver needed
5. Try another USB port

**Mac/Linux**:
1. Open Terminal
2. Run: `ls /dev/tty.usbserial-*`
3. If empty: Driver needed (CH340 driver)
4. Install from: https://sparks.gogo.co.nz/ch340.html

---

### Bridge Not Working

**Problem**: Can't connect via bridge method

**Check**:
1. Is bridge running? Look for: "🌉 Bridge listening..."
2. Web app sees bridge? Click SCAN, look for "🌉 Bridge:" options
3. Bridge connected to Render? Look for: "Connected to Render WebSocket"

**Fix**:
1. Kill bridge: Press Ctrl+C
2. Restart: `node local-usb-bridge.js`
3. Try web app SCAN again

---

### Mobile Camera Won't Stream

**Problem**: Mobile linked but camera not on desktop

**Check**:
1. Both on same WiFi? (Required!)
2. Mobile shows "📤 Streaming..."? 
3. Desktop shows "📱 Mobile Connected"?

**Fix**:
1. Click 🔗 LINK again on mobile
2. Grant camera permission when asked
3. Wait 3 seconds for "Streaming..." message
4. Check desktop for "📱 Mobile Connected" message
5. Select 📲 Mobile Device Camera in dropdown

---

## 📊 Status Indicator Guide

| Color | Status | Action |
|-------|--------|--------|
| 🔴 RED | Not connected | Click CONNECT |
| 🟡 YELLOW | Connecting... | Wait a moment |
| 🟢 GREEN | Connected! | Ready to use |
| ⚫ BLACK | Not available | Reconnect |
| ⚪ WHITE | Unknown | Check browser console |

---

## 🎮 Controls After Connecting (Status 🟢)

### Movement
- **X Axis (Left/Right)**: 1000 RPM, smooth movement
- **Y Axis (Forward/Back)**: 100 RPM, precision control
- **P Axis (Spindle Rotation)**: 300 RPM, continuous
- **HOME Button**: Return to (0,0,0) position

### Camera
- **START CAMERA**: Turn on video feed
- **STOP CAMERA**: Turn off video
- **Source Dropdown**: 
  - Desktop Webcam (USB camera)
  - 📲 Mobile Device Camera (linked phone)

### Machine
- **Load Stone**: Select stone type/size
- **Cut**: Initiate cutting sequence
- **Emergency Stop (E-Stop)**: Safety shutoff

### AI
- **Ask Merlin**: Type questions anytime
- Merlin learns your skill level
- Provides contextual guidance

---

## 🧪 Testing Your Connection

### Test 1: Basic Connection
```
1. Status should show 🟢 GREEN
2. Try moving X slider
3. You should see responses in console
✅ Success: Commands are reaching Arduino
```

### Test 2: Both Methods (if doing Setup A → B transition)
```
1. Direct Method: Click CONNECT without bridge
2. Check status: Should be 🟢
3. Start bridge: node local-usb-bridge.js
4. Click DISCONNECT
5. Click SCAN, select "🌉 Bridge:" option
6. Click CONNECT
7. Check status: Should be 🟢
✅ Success: Both methods work!
```

### Test 3: Full Integration
```
1. Status 🟢 GREEN
2. Mobile camera linked and streaming
3. Desktop sees "📱 Mobile Connected"
4. Move X, Y, P sliders
5. Motion shows in camera view
6. Ask Merlin: "What should I cut?"
✅ Success: Full system working!
```

---

## 💡 Pro Tips

1. **Best Camera Setup**
   - Mount mobile phone to see cutting area
   - Position camera straight down for best Merlin AI analysis
   - Good lighting helps Merlin see details

2. **Optimal Connection**
   - Local/LAN? Use Method 1 (Direct) - simpler
   - Cloud hosting? Use Method 2 (Bridge) - more stable
   - Both available? Try Method 1 first, fallback to Method 2

3. **Smoothest Operation**
   - Keep USB cable short and direct
   - Avoid USB hubs if possible
   - Don't plug/unplug during operation
   - Check for WiFi interference with mobile camera

4. **Getting Help**
   - Ask Merlin AI any question
   - Merlin explains both connection methods
   - Merlin has troubleshooting guidance
   - Merlin learns what help you need

5. **First Cut Tips**
   - Practice on 3D Machine first (no risk!)
   - Start with simple shapes
   - Use camera for positioning
   - Ask Merlin for recommendations

---

## 🔍 Connection Flow Diagram

### Method 1 (Direct)
```
┌─────────────┐
│   Browser   │ ← Open: localhost:8000 or Render app
│ (WebSerial) │
└──────┬──────┘
       │ USB cable
       ↓
┌─────────────┐
│   Arduino   │ ← Should see status 🟢 GREEN
│    Board    │
└─────────────┘
```

### Method 2 (Bridge)
```
┌──────────────────┐
│  Web App         │ ← Open: Render cloud app
│ (Chrome/Edge)    │
└────────┬─────────┘
         │ HTTPS WebSocket
         ↓
┌──────────────────┐
│ Render Server    │ ← Relays commands
│ (launch-server)  │
└────────┬─────────┘
         │ Local WebSocket (port 8001)
         ↓
┌──────────────────┐
│ Desktop Bridge   │ ← Run: node local-usb-bridge.js
│ (local-usb-bridge)│
└────────┬─────────┘
         │ USB serial
         ↓
┌──────────────────┐
│   Arduino        │ ← Same Arduino, different connection!
│    Board         │
└──────────────────┘
```

---

## ✅ Pre-Flight Checklist

- [ ] Arduino plugged in with USB cable
- [ ] Browser is Chrome, Edge, or Opera
- [ ] Can access https://gembotaiwebcontrol.onrender.com
- [ ] (If Bridge) Node.js installed (`node --version` shows v14+)
- [ ] (If Bridge) `npm install ws serialport @serialport/parser-readline` completed
- [ ] (If Mobile) Have iPhone or Android available
- [ ] (If Mobile) Can access same WiFi network

---

## 🎯 Next Steps

1. **Choose your setup** (A, B, or C above)
2. **Follow the quick start** for your setup
3. **Check status indicator** - should be 🟢
4. **Ask Merlin a question** - verify AI is working
5. **Try a simple cut** - start with practice mode (3D Machine)
6. **Ready to cut real stone** - position with camera first!

---

## 📞 Getting Help

**In the app**:
- Ask Merlin AI any question
- Press F12 for Console debug info
- Check status indicator color

**Connection questions**:
- "How to connect Arduino?"
- "Which connection method should I use?"
- "Arduino won't connect, help!"

**Feature questions**:
- "How to set up camera?"
- "How to link mobile device?"
- "What should I cut?"

**Technical issues**:
- "Port not showing up"
- "Bridge connection failed"
- "Mobile camera won't stream"

---

## 🚀 Ready to Go!

Your system is ready. Choose your setup above and get started!

Questions? Ask Merlin AI - it's there 24/7.

Happy cutting! ✨
