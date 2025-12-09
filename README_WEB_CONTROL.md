# 🔷 GemBot Web Control Interface

Professional web-based control panel for the GemBot automated gem cutting machine. Control your device from any browser on any device—desktop, tablet, or mobile.

## ✨ Features

### 🎮 Full Control Interface
- **Directional Pad**: Navigate menus (Up, Down, Left, Right, Enter)
- **Quick Commands**: One-click access to Settings, Design, Preform, Cut, Polish, Calibration
- **Custom Commands**: Send raw serial commands for advanced control
- **Real-time Feedback**: Instant response from your GemBot

### 📡 Dual Connection Modes
1. **Browser Serial API** - Direct USB connection (Chrome/Edge/Opera)
2. **WebSocket Server** - Network bridge for any browser and remote access

### 🌐 Mobile Responsive
- Works perfectly on smartphones and tablets
- Touch-optimized buttons
- Auto-scaling interface
- Offline-capable with PWA support

### 📊 Advanced Monitoring
- **Real-time Serial Monitor**: See all device communication
- **Status Dashboard**: Connection status, port info, data received
- **Command Logging**: Track all sent/received data with timestamps
- **Color-coded Messages**: Easy identification of data types

### 🔒 Local Control
- No cloud required
- Runs completely locally
- USB-connected device only
- Full privacy and security

## 🚀 Quick Start

### The Fastest Way (Browser Serial API)

1. **Download**: Save `GemBot_Web_Control_DualMode.html` (recommended) or `GemBot_Web_Control.html`
2. **Connect**: Plug GemBot into USB port
3. **Open**: Double-click the HTML file in Chrome/Edge/Opera
4. **Scan**: Click "Scan Ports"
5. **Select**: Choose your Arduino port
6. **Connect**: Click "Connect"
7. **Control**: Start using the virtual control pad

✅ **That's it! No installation, no server, no setup.**

### Network Access (WebSocket Server)

Want to control from other devices on your network? Set up the Node.js server:

```powershell
# Install Node.js first from https://nodejs.org/

# Navigate to project folder
cd c:\Users\barbr\Desktop\GemBotMemory2025

# Install dependencies
npm install

# Start the server
npm start

# Open in browser
http://localhost:3000

# Access from other devices
http://[your-ip]:3000
```

## 📁 Files Included

| File | Purpose | Use Case |
|------|---------|----------|
| `GemBot_Web_Control_DualMode.html` | ⭐ Recommended - Both connection modes | Main interface - supports browser API and server |
| `GemBot_Web_Control.html` | Browser Serial API only | Direct USB only (desktop browsers) |
| `server.js` | Node.js WebSocket bridge | Network access, any browser |
| `package.json` | Node dependencies | Required for server mode |
| `QUICK_START.md` | 2-minute setup guide | Getting started quickly |
| `GEMBOT_WEB_SETUP.md` | Complete documentation | Reference guide |
| `README.md` | This file | Overview |

## 🖥️ Browser Support

| Browser | Mode 1: API | Mode 2: Server | Recommended |
|---------|-----------|----------------|------------|
| Chrome Desktop | ✅ | ✅ | Best |
| Edge Desktop | ✅ | ✅ | Best |
| Opera Desktop | ✅ | ✅ | Good |
| Firefox Desktop | ❌ | ✅ | Server Mode |
| Safari Desktop | ❌ | ✅ | Server Mode |
| Chrome Mobile | ❌ | ✅ | Server Mode |
| Safari Mobile | ❌ | ⚠️ | Limited |

## 🎯 System Requirements

### Minimum
- Computer with USB port
- Chrome, Edge, or Opera browser (v89+)
- Arduino Mega with USB cable
- Windows 7+ / Mac / Linux

### For Network Mode
- Node.js v14+ 
- npm v6+
- Network access to server computer

## 🔧 Hardware Setup

### USB Connection
1. Connect GemBot to computer via USB cable
2. Arduino should power on automatically
3. Device should appear in "Select COM Port" dropdown
4. If not: Install CH340 USB drivers (search "CH340 driver")

### Nextion Display
- Should work as normal with touch screen
- Web interface mirrors the touch controls
- Both can be used simultaneously

## 💻 Control Interface Explained

### Virtual Control Pad
```
        ▲ UP
   ◄ LEFT  ✓ ENTER  ► RIGHT
        ▼ DOWN
    [Exit] [Print Menu]
```

### Quick Command Buttons
- **Settings**: `page 0\xFF\xFF\xFF` - Opens settings menu
- **Design**: `page 14\xFF\xFF\xFF` - Design mode
- **Preform**: `page 16\xFF\xFF\xFF` - Preforming operation
- **Cut**: `page 17\xFF\xFF\xFF` - Cutting mode
- **Polish**: `page 18\xFF\xFF\xFF` - Polishing operation
- **Calibrate**: Customizable calibration command

### Serial Monitor
Shows real-time communication:
- `[RX]` - Data received from device
- `[TX]` - Commands sent to device
- `[✓]` - Success messages
- `[!]` - Warnings
- `[✗]` - Errors

### Status Dashboard
- **Connection Status**: Connected / Disconnected
- **Port / Server**: Which port or server you're using
- **Mode**: Browser API or WebSocket
- **Data RX**: Total bytes received from device

## 🔌 Connection Modes Explained

### Mode 1: Browser Serial API (Default)
**How it works:**
- Browser directly accesses USB device
- No server needed
- Low latency, fast response

**Pros:**
- ✅ No installation
- ✅ Fast and responsive
- ✅ Works offline
- ✅ Maximum privacy

**Cons:**
- ❌ Desktop only (Chrome/Edge/Opera)
- ❌ Requires USB on same computer
- ❌ Not available on mobile

**Best for:**
- Direct control on your desktop
- Development and testing
- Home use

### Mode 2: WebSocket Server
**How it works:**
- Server runs on computer with GemBot
- Connects to USB device
- Broadcasts to any browser client

**Pros:**
- ✅ Network access
- ✅ Works on any browser (Firefox, Safari, mobile)
- ✅ Multiple users simultaneously
- ✅ Remote access possible

**Cons:**
- ⚠️ Requires Node.js installation
- ⚠️ Server must stay running
- ⚠️ Network latency

**Best for:**
- Multiple users
- Mobile control
- Network access
- Remote workshops

## 📊 Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User's Devices                       │
│  (Desktop, Tablet, Mobile - Any Browser)                │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│ Browser Serial   │         │ WebSocket Server │
│ API (Direct)     │         │ (Bridge)         │
│ Chrome/Edge      │         │ Node.js          │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         └──────────────┬─────────────┘
                        ▼
               ┌─────────────────┐
               │  Serial Port    │
               │   (USB COM)     │
               └────────┬────────┘
                        ▼
               ┌─────────────────┐
               │  Arduino Mega   │
               │  + Nextion      │
               │  GemBot Device  │
               └─────────────────┘
```

## 🛡️ Security & Privacy

### Local Operation
- Everything runs locally on your computer
- No data sent to cloud
- No internet required
- Full privacy guaranteed

### Network Mode Security
For local network only:
- ✅ Encrypted with HTTPS/WSS
- ✅ Firewall protection
- ⚠️ Not recommended for internet exposure

For remote access:
- Use VPN
- Use authentication
- Use reverse proxy
- Don't expose directly to internet

## 🐛 Troubleshooting

### Port Not Detected
```
✅ Try: Reconnect USB cable
✅ Try: Different USB port
✅ Try: Update CH340 drivers
✅ Try: Check Device Manager
```

### Browser Says "Serial API Not Available"
```
✅ Use: Chrome, Edge, or Opera
✅ Update: Browser to latest version
✅ Try: WebSocket Server mode instead
```

### Data Not Showing in Monitor
```
✅ Check: Arduino Serial Monitor shows data
✅ Verify: 9600 baud rate configured
✅ Check: USB cable quality
✅ Try: Different USB port
```

### WebSocket Server Won't Connect
```
✅ Check: Node.js installed (node --version)
✅ Check: npm installed (npm --version)
✅ Check: Port 3000 not in use
✅ Try: Different port (edit server.js)
```

### Multiple Users Fighting for Control
- Only one command at a time
- Last button press wins
- Consider implementing a queue system (future update)

See `GEMBOT_WEB_SETUP.md` for detailed troubleshooting.

## 🔮 Future Enhancements

### Planned for v2.0+
- [ ] WiFi connection support via Nextion
- [ ] Data logging and export
- [ ] Command sequences/macros
- [ ] Real-time video streaming
- [ ] Sensor data visualization
- [ ] User presets
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Mobile native app
- [ ] Cloud sync (optional)

### Community Contributions Welcome
- Bug reports
- Feature requests
- Code improvements
- Documentation

## 📚 Documentation

### Quick References
- **QUICK_START.md** - Get running in 2 minutes
- **GEMBOT_WEB_SETUP.md** - Complete setup guide
- **This file** - Overview and architecture

### Code Documentation
All code is well-commented:
- HTML/CSS: UI implementation
- JavaScript: Client logic
- Node.js: Server bridge logic

### Arduino Communication
See the Arduino sketch comments:
- `GemBotArduinoMemoryUpgrade2025_copy_20251201233437.ino`

## 🤝 Contributing

Want to improve GemBot Web Control?

1. **Report Bugs**: Describe issue with browser/OS/steps
2. **Suggest Features**: Open an issue with use case
3. **Submit Code**: Fork, modify, test, create pull request
4. **Improve Docs**: Fix typos, add examples, clarify

## 📄 License

MIT License - Free to use, modify, and distribute

## 🙏 Credits

**Created by:** GemBot Development Team  
**Contributors:** Austin Moore, Ryan Barbrick, and community  
**Based on:** Arduino Mega, Nextion Display, Node.js  

## 📞 Support

### Getting Help
1. Check **Troubleshooting** section
2. Read **GEMBOT_WEB_SETUP.md**
3. Review Arduino code comments
4. Check browser console (F12)
5. Verify hardware is working first

### Testing Order
1. Test with Arduino IDE Serial Monitor first
2. Then try web interface
3. If web fails but Arduino IDE works, it's browser/driver issue
4. If both fail, it's hardware/firmware issue

## 🎓 Learning Resources

### Serial Communication
- Arduino Serial Library: https://www.arduino.cc/en/reference/serial
- Chrome Serial API: https://developer.mozilla.org/en-US/docs/Web/API/Serial

### Web Technologies
- HTML/CSS: Mozilla Developer Network
- JavaScript: JavaScript.info
- WebSocket: MDN Web Docs

### Node.js
- Official Docs: https://nodejs.org/en/docs/
- Express: https://expressjs.com/
- ws library: https://github.com/websockets/ws

## ✅ Verification Checklist

Before deploying to production:
- [ ] Test with real GemBot hardware
- [ ] Test on Chrome, Edge, Firefox, Safari
- [ ] Test on mobile browser
- [ ] Test WebSocket server mode
- [ ] Test network access from different machine
- [ ] Verify all controls respond
- [ ] Check serial monitor shows data
- [ ] Test disconnect/reconnect
- [ ] Test with long sessions (stability)
- [ ] Document any issues found

## 📈 Version History

**v2.0** (Current - Dual Mode)
- Combined Browser API + WebSocket Server
- Improved UI with mode selector
- Settings persistence (localStorage)
- Better error handling

**v1.0** (Original)
- Browser Serial API only
- Real-time serial monitoring
- Virtual control pad
- Mobile responsive design

## 🌟 Show Your Support

If you find this useful:
- ⭐ Star the project
- 📢 Share with others
- 💬 Send feedback
- 🐛 Report bugs
- 💡 Suggest features

---

**Ready to control your GemBot?**

1. Open `GemBot_Web_Control_DualMode.html` in Chrome
2. Click "Scan Ports"
3. Select your Arduino
4. Click "Connect"
5. Start cutting! 💎

---

**Questions? See GEMBOT_WEB_SETUP.md for complete documentation.**

**Happy gem cutting! 🔷✨**

---

Last Updated: December 2, 2025  
Supported Hardware: Arduino Mega 2560 + Nextion Display  
Compatibility: Windows, Mac, Linux
