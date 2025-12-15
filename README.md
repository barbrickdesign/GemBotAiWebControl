# 🤖 GemBot AI Web Control System

An interactive AI-powered learning platform with real-time control capabilities, mobile integration, and intelligent tutoring through Merlin AI.

## 📊 Current Status (Last Updated: December 15, 2025)

### ✅ Working Features
| Feature | Status | Notes |
|---------|--------|-------|
| Page Load | ✅ Working | Site loads correctly |
| Authentication UI | ✅ Working | Auto-continues as guest after 3 seconds |
| Merlin AI Responses | ✅ Working | AI chat and responses functional |
| 3D Visualization | ✅ Working | Babylon.js virtual machine renders |
| Mobile Detection | ✅ Working | Lightweight mode on mobile devices |
| QR Code Generation | ✅ Working | For mobile device connection |
| Local Storage | ✅ Working | Saves user progress and settings |
| Game Integration | ✅ Working | Optional enhancement module |
| Console Logging | ✅ Working | Debug output visible in F12 console |
| GemBot Farm Game | ✅ Working | Access via profile menu → 🎮 GemBot Farm |

### ⚠️ Known Issues / Expected Warnings
| Feature | Status | Notes |
|---------|--------|-------|
| Firebase Auth | ⚠️ Limited | Falls back to localStorage (expected on GitHub Pages) |
| WebSocket Sync | ⚠️ Expected | 404 errors normal - no WebSocket server on static hosting |
| Multi-device Sync | ⚠️ Optional | Requires server setup for full functionality |

### 🔧 Recent Fixes (December 15, 2025)
- Removed 740 lines of duplicate/corrupted code
- Added early stubs for `authSystem` and `leaderboardUI` to prevent reference errors
- Fixed duplicate `AccessibilityMode` class declaration
- Fixed auth overlay auto-continuing as guest after 3 seconds
- Removed unnecessary error banners for optional modules

---

## ✨ Features

### 🎓 Intelligent Learning System
- **Merlin AI Mentor**: Personalized AI tutor that adapts to your learning pace
- **Progressive Curriculum**: Structured lessons from beginner to advanced
- **Real-time Feedback**: Instant responses to your questions and progress
- **Gamified Learning**: Earn gems, level up, and track streaks
- **Knowledge Persistence**: AI remembers what you've learned

### 📱 Mobile Integration
- **Cross-Device Support**: Use desktop and mobile devices together
- **QR Code Connection**: Easy one-tap mobile access via QR code
- **Camera Streaming**: Stream mobile device camera to desktop for analysis
- **Network Discovery**: Automatic detection of devices on your network
- **Lightweight Mobile UI**: Optimized interface for phone and tablet

### 🎮 Control Features
- **Motor Control**: Precision control with step/continuous modes
- **Joystick Input**: Real-time analog control on mobile devices
- **Serial Communication**: Direct hardware integration via Arduino
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Status**: Live feedback from connected hardware

### 🔬 AI Vision System
- **Object Detection**: TensorFlow.js-powered COCO-SSD model (desktop only)
- **Real-time Analysis**: Live video processing and detection
- **Image Adjustment**: Brightness, contrast, and saturation controls
- **Mobile Camera Support**: Use iPhone/Android cameras
- **Lightweight Mobile Mode**: No ML overhead for fast mobile access

## 🚀 Quick Start

### Local Deployment

```bash
# Clone the repository
git clone https://github.com/barbrickdesign/GemBotAiWebControl.git
cd GemBotAiWebControl

# Install dependencies
npm install

# Start the server
npm start
```

Then open:
- **Desktop**: `http://localhost:8000`
- **Mobile (same WiFi)**: Scan QR code or visit `http://{your-ip}:8000`

### Public Deployment (Render.com)

1. Connect your GitHub repo to [Render.com](https://render.com)
2. Use the `render.yaml` configuration provided
3. Deploy automatically - your public URL will be ready instantly

## 📚 Usage Guide

### Getting Started
1. **Desktop**: Opens full interface with AI vision
2. **Mobile**: Lightweight interface loads instantly
3. **Connect**: QR code appears automatically on desktop
4. **Learn**: Start with Merlin by clicking "Start Teaching"
5. **Control**: Use motors, camera, and commands from any device

### Learning with Merlin
- Answer knowledge check questions
- Receive personalized curriculum
- Earn gems and unlock tiers
- Build learning streaks
- Get real-time AI feedback

### Device Connection
- Desktop and mobile on same WiFi
- Desktop shows QR code for mobile
- Automatic device discovery
- Real-time chat and control sharing

## 🔧 Technology Stack

- **Frontend**: HTML5 + JavaScript + CSS3
- **Backend**: Node.js + HTTP server
- **AI/ML**: TensorFlow.js + COCO-SSD
- **Mobile**: Responsive design + native camera API
- **QR Codes**: QR Server API (no library needed)

## 📋 System Requirements

### Minimum
- Node.js 18+
- Modern browser (Chrome, Safari, Firefox)
- WiFi network (for mobile access)

### Optional
- Arduino for motor control
- USB camera or mobile device
- Gamepad/joystick

## 🎨 Customization

Edit `GemBot_Control_AI.html` to customize:
- Colors and themes
- Learning curriculum
- Token rewards
- UI layout
- Hardware settings

## 🤝 Contributing

See CONTRIBUTING.md for guidelines.

## 📄 License

MIT - Free for personal and commercial use

## 🆘 Support & Troubleshooting

### Common Issues

**Slow page load?**
- Mobile: No ML models loaded - should be fast
- Desktop: ML loads in background after page renders

**QR code not showing?**
- Check internet connection (QR generation via API)
- Click "Copy URL" button as alternative

**Can't connect mobile?**
- Both devices on same WiFi?
- Desktop server running (`npm start`)?
- Port 8000 accessible?

**Merlin not responding?**
- Refresh page
- Check browser console (F12)
- Verify server is running

## 📊 Performance

- Page load: 1-5 seconds
- QR generation: <200ms  
- AI response: 500ms-2s
- Mobile connection: <1s
- Video: 30 FPS (desktop), unlimited (mobile)

## 🌟 Roadmap

- Voice control
- Multi-language support
- User accounts & cloud sync
- Mobile native app
- Advanced ML models
- Educational platform integration

---

**Built with ❤️ by barbrickdesign**  
[GitHub](https://github.com/barbrickdesign/GemBotAiWebControl)

---

## 📝 Changelog

### December 15, 2025
- Fixed authentication UI overlay persistence issue
- Removed Three.js and Node.js require() shim (not needed)
- Fixed game integration module timing
- Removed critical error banners for optional modules
- Cleaned up duplicate code blocks causing syntax errors

### December 7, 2025
- Added AI enhancement features
- Improved mobile UI responsiveness
- Fixed button behavior issues

---

## 🔧 Troubleshooting

### Page Not Loading?
1. Check browser console (F12) for errors
2. Clear browser cache and reload
3. Check that all JS files exist on server

### Auth Not Working?
1. Firebase may be blocked by CSP - uses localStorage fallback
2. Check that overlay hides after clicking Login/Register

### Modules Not Found Warnings?
- These are informational only - optional features
- Core functionality works without them

---

**Live Demo**: https://barbrickdesign.github.io/GemBotAiWebControl/GemBot_Control_AI.html

