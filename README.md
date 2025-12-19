# 🤖 GemBot AI Web Control System

> **Created by Ryan Barbrick** | © 2024-2025 Barbrick Design | All Rights Reserved
> 
> 📧 Contact: BarbrickDesign@gmail.com | 🔗 GitHub: [@barbrickdesign](https://github.com/barbrickdesign)

---

## 🔒 OWNERSHIP NOTICE

**This project is the intellectual property of Ryan Barbrick / Barbrick Design.**

- **Creator & Owner**: Ryan Barbrick
- **Contact**: BarbrickDesign@gmail.com
- **AI Assistant**: Merlin AI (Forever Helper of the GemBot Realm)
- **Community**: All people welcome to play and learn!

⚠️ **Unauthorized copying, reproduction, or sale without compensation to Ryan Barbrick is prohibited.**
See [OWNERSHIP.md](OWNERSHIP.md) and [AI_ATTRIBUTION.md](AI_ATTRIBUTION.md) for full details.

---

An interactive AI-powered learning platform with real-time control capabilities, mobile integration, and intelligent tutoring through Merlin AI.

---

## 🤖 NEW: Automated Agent Deployment System

**A revolutionary free resource-sharing platform that helps developers in intense development mode!**

The **Automated Agent Deployment System** (AADS) automatically:
- 📡 Scans and indexes repositories
- 🤖 Deploys intelligent agents to assist with development
- 🔗 Creates links between repositories for resource sharing
- 📦 Allocates resources to repositories in need
- 🌐 Amplifies signals across a developer network
- 🗺️ Visualizes the network with interactive bubble maps

### Quick Start with AADS

```javascript
// Initialize the system
await window.aads.init({ visualizerId: 'bubble-map-container' });

// Add your repository
await window.aads.addRepository({
    owner: 'your-username',
    name: 'your-repo'
});

// Request help when needed
await window.aads.requestHelp('your-username/your-repo', 'testing');

// Get system stats
const stats = window.aads.getStats();
```

### Demo & Documentation
- **Demo**: Open `automated-agent-deployment-demo.html` in your browser
- **Full Guide**: See [AUTOMATED_AGENT_DEPLOYMENT_SYSTEM.md](AUTOMATED_AGENT_DEPLOYMENT_SYSTEM.md)
- **Implementation Details**: See [AUTOMATED_AGENT_DEPLOYMENT_TODO.md](AUTOMATED_AGENT_DEPLOYMENT_TODO.md)

### Key Features
✅ **8 Agent Types**: CODE_HELPER, TEST_RUNNER, DOC_WRITER, RESOURCE_MONITOR, LINK_BUILDER, DEPLOY_AGENT, SECURITY_SCANNER, COLLAB_COORDINATOR  
✅ **Automatic Deployment**: Agents deploy every 1 minute based on demand  
✅ **Network Effects**: Links create resource-sharing opportunities  
✅ **Comprehensive Fallbacks**: Every function has 3-4 fallback methods  
✅ **Real-time Visualization**: Interactive bubble map of your repository network  
✅ **Zero Setup Required**: Works entirely client-side with localStorage  

---

## 📊 Current Status (Last Updated: December 19, 2025)

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
| **Automated Agent Deployment System** | ✅ **NEW** | Full agent deployment and repository networking system |

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

## 🚀 Idea Promotion Workflow

We use a unified instruction set for idea-to-implementation that ensures every promoted idea becomes a **traceable, testable, auto-enhancing, and auto-deployed artifact**.

### Quick Start
```bash
# Create a new idea
node scripts/idea-management/create-idea.js "Your idea title"

# Check idea status
node scripts/idea-management/prompt-status.js IDEA-2025-XXXX

# Check if implementation exists
node scripts/idea-management/check-implementation.js IDEA-2025-XXXX

# Validate the registry
node scripts/idea-management/validate-registry.js
```

### Key Resources
| Resource | Description |
|----------|-------------|
| [INSTRUCTIONS.md](INSTRUCTIONS.md) | Full promotion workflow documentation |
| [docs/ideas/registry.json](docs/ideas/registry.json) | Canonical idea registry |
| [docs/ideas/prompts/](docs/ideas/prompts/) | Prompt binding files |
| [.github/workflows/](https://github.com/barbrickdesign/GemBotAiWebControl/actions) | CI/CD pipelines |

See **[INSTRUCTIONS.md](INSTRUCTIONS.md)** for complete details on governance, logging, error reporting, and auto-enhancement.

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

### 🔑 Universe Key System (NEW!)
- **Physical USB Authentication**: Collectible USB keys with cold storage wallets
- **1,000 GBUV Preloaded**: Each key contains 1,000 GemBot Universe tokens
- **Machine Linking**: Secure hardware fingerprinting for single-machine activation
- **Futuristic Launcher**: Animated starfield interface with 8-button action grid
- **Admin Management API**: Complete key generation, activation, and tracking system
- **Auto-Launch**: Windows AUTORUN.INF + BAT script for one-click access
- **Cold Storage**: AES-256 encrypted Solana wallet with private keys
- **Warranty & Support**: 1-year warranty included with each physical key

### 🔬 AI Vision System
- **Object Detection**: TensorFlow.js-powered COCO-SSD model (desktop only)
- **Real-time Analysis**: Live video processing and detection
- **Image Adjustment**: Brightness, contrast, and saturation controls
- **Mobile Camera Support**: Use iPhone/Android cameras
- **Lightweight Mobile Mode**: No ML overhead for fast mobile access

### 🛡️ Security & Anti-Fraud System
- **Multi-Layer Detection**: 6-layer fraud detection (IP, fingerprinting, email validation)
- **Suspicion Scoring**: 0-100 score based on behavior patterns
- **Automated Wallet Allocation**: 100 GBUV for safe users, 10 GBUV for suspicious accounts
- **Admin Dashboard**: Complete security monitoring with IP tracking and flagged accounts
- **Rate Limiting**: Prevents spam and abuse
- **Real-time Alerts**: Instant notifications for high-risk registrations

### 📊 Admin Dashboard
- **AI Agent Management**: Monitor and control all AI agents (security, wallet, academy, support)
- **Security Dashboard**: View fraud detection stats, IP tracking, and flagged accounts
- **Wallet Management**: Track all user wallets, balances, and transactions
- **Code Editor**: Built-in Monaco editor with GitHub integration
- **Visual Editor**: Direct DOM manipulation for live site updates
- **User Management**: View and manage all registered users
- **Game Control**: Monitor in-game activity and statistics
- **Settings**: Configure GitHub tokens, deployment options, and system settings

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

### 🔑 Universe Key Quick Start

**If you have a physical Universe Key USB:**
1. Insert USB into your Windows PC
2. Double-click `AUTOLAUNCH.BAT` on the USB drive
3. Launcher opens automatically in your browser
4. Click "🔗 Link Machine" to activate on your device
5. Access your 1,000 GBUV wallet and project files

**Testing the Universe Key System:**
1. Open `TEST_UNIVERSE_KEY.html` in your browser
2. Click "🔑 Open Universe Key Launcher" to test the interface
3. Click "⚙️ Test Admin API" to test key generation and management
4. See `00_UNIVERSE_KEY_TESTING_CHECKLIST.md` for complete testing guide

**Admin: Generate New Universe Keys:**
```javascript
// Load admin API in browser console
const script = document.createElement('script');
script.src = 'universe-key-admin-api.js';
document.head.appendChild(script);

// Generate new key
const newKey = await window.universeKeyManager.generateKey('owner@email.com', 1000);
console.log(newKey);

// Copy KEY_ID.json output to USB drive
```

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

### December 19, 2025 - Automated Agent Deployment System 🤖

**NEW: Complete Agent Deployment Platform**
- Created 8-component automated agent deployment system (2,846+ lines of code)
- Repository Scanner: Automatic scanning, indexing, and health monitoring
- Agent Orchestrator: 8 agent types with automatic deployment based on demand
- Network Builder: Repository linking with similarity calculation and resource sharing
- Bubble Map Visualizer: Interactive force-directed graph visualization
- Main Orchestrator: Coordinates all components with automatic processes
- Demo Interface: Full interactive dashboard with real-time stats
- Documentation: Complete guides with fallback strategies and API reference

**Key Features**
- Automatic agent deployment every 1 minute
- Automatic link discovery every 2 minutes
- Network optimization every 5 minutes
- Comprehensive fallback mechanisms (3-4 fallbacks per function)
- Resource allocation and sharing between repositories
- Signal amplification across network
- Real-time monitoring and health checks

### December 15, 2025 (Evening Update - Universe Key Launch!)

**NEW: Universe Key System** 🔑
- Created complete physical USB authentication system (11 files, 1,873+ lines)
- Launcher interface: HTML/CSS/JS with animated starfield and 8-button grid
- Auto-launch system: AUTORUN.INF + AUTOLAUNCH.BAT for Windows
- Admin API: Full key generation, activation, and management (400 lines)
- Testing suite: Comprehensive 6-phase testing checklist
- Documentation: 7,000+ words across 4 markdown files

**Admin Dashboard Complete** 📊
- Added AI Agents section: Monitor and control all AI agents
- Added Security section: Fraud dashboard with IP tracking and suspicion scores
- Added Wallets section: Complete wallet management with balances and transactions
- 320+ lines of JavaScript: refreshAIAgents(), refreshSecurity(), refreshWallets()
- Full CSS styling: Tables, badges, action buttons, search/filter functionality

**3D Visualization Fixed** ✨
- Fixed camera distance (250 → 200 units) for better viewing angle
- Increased ambient light (0.6 → 1.0) for proper illumination
- Added forced mesh visibility to all loaded models
- Added diagnostic console logging for debugging

**Academy Content Expansion** 📚
- cutting_fundamentals: Added 4 detailed lessons (angles, facet sequence, table size, girdle)
- polishing_mastery: Added 4 lessons (compounds, lap speed, scratch removal, mirror polish)
- advanced_designs: Added 4 lessons (fancy shapes, custom faceting, concave, fantasy cuts)
- All lessons now have complete interactive content, quizzes, and practice exercises

**Previous (Morning Update)**
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

