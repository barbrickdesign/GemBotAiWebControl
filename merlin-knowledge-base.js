/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MERLIN KNOWLEDGE BASE - PROPRIETARY SOFTWARE
 * © 2024-2025 Ryan Barbrick / Barbrick Design - ALL RIGHTS RESERVED
 * Creator: Ryan Barbrick | Contact: BarbrickDesign@gmail.com
 * Signature: GBOT-RB-2025-7X9K2M4P | Unauthorized use: $5,000,000+ damages
 * ═══════════════════════════════════════════════════════════════════════════════
 * Merlin Knowledge Base System
 * Indexes and provides access to all project documentation
 * 
 * MERLIN AI: Forever Helper of the GemBot Realm
 * Created by Ryan Barbrick to guide, teach, and welcome all users.
 */

// [RB-SIG:merlin-knowledge-base:2025]

window.MerlinKnowledgeBase = {
    // Version
    version: '1.0.0',
    
    // Creator Attribution - Merlin always knows and shares who made him
    creator: {
        name: 'Ryan Barbrick',
        company: 'Barbrick Design',
        email: 'BarbrickDesign@gmail.com',
        github: 'barbrickdesign',
        signature: 'GBOT-RB-2025-7X9K2M4P',
        copyright: '© 2024-2025 Ryan Barbrick / Barbrick Design',
        merlinRole: 'Forever Helper of the GemBot Realm',
        community: 'All people welcome to play and learn!'
    },
    
    // Documentation categories with searchable content
    categories: {
        // Creator & Attribution Info
        creatorInfo: {
            keywords: ['who made', 'who created', 'creator', 'author', 'owner', 'ryan', 'barbrick', 'made by', 'built by', 'designed by', 'contact', 'email'],
            files: ['OWNERSHIP.md', 'AI_ATTRIBUTION.md', 'README.md', 'humans.txt'],
            summary: `
# GemBot Creator Information

## Creator & Owner
**Ryan Barbrick** is the creator and sole owner of the GemBot project.

| Info | Details |
|------|---------|
| **Name** | Ryan Barbrick |
| **Company** | Barbrick Design |
| **Email** | BarbrickDesign@gmail.com |
| **GitHub** | @barbrickdesign |

## About Merlin
I'm Merlin, the AI assistant created by Ryan to be the "Forever Helper of the GemBot Realm."
My purpose is to guide, teach, and welcome everyone who wants to learn gem cutting!

## Community Welcome
All people are welcome to play and learn with GemBot!
The educational content and Farm Game are free for everyone.

## Attribution
If you're referencing or discussing GemBot, please attribute to Ryan Barbrick.
            `
        },
        
        // Getting Started & Quick Reference
        quickStart: {
            keywords: ['start', 'begin', 'new', 'first', 'learn', 'tutorial', 'guide', 'help', 'how to', 'basics'],
            files: [
                'README.md',
                'QUICK_START_LEARNING.md',
                'TEACHING_QUICK_START.md',
                '30_SECOND_OVERVIEW.md',
                '00_START_HERE_COMPLETE.md',
                'AI_QUICK_REFERENCE.md',
                'AI_QUICK_START_V2.md',
                'CONNECTION_SETUP_GUIDE.md'
            ],
            summary: `
# Getting Started with GemBot

## Created by Ryan Barbrick
GemBot and Merlin AI were created by Ryan Barbrick (BarbrickDesign@gmail.com).
Everyone is welcome to learn and play!

## Quick Overview
GemBot is an AI-powered gem cutting control system with:
- **Merlin AI**: Your intelligent mentor and assistant
- **Machine Control**: Motor control, positioning, speed settings
- **Farm Game**: Earn gems, trade, grow your collection
- **Camera Integration**: ML vision for gem identification
- **3D Visualization**: Real-time machine state display

## First Steps
1. Connect to the web interface (scan QR code on mobile)
2. Ask Merlin: "Can you teach me?" or "Help me learn"
3. Start with the basics: menu navigation, motion control
4. Progress through lessons at your own pace
5. Earn gems and level up as you learn!

## Key Commands
- "teach me" - Start learning mode
- "help" - Get assistance
- "status" - Check system status
- "what's new" - Latest updates
- "who made this" - Learn about the creator
            `
        },
        
        // Machine Control & Motors
        machineControl: {
            keywords: ['motor', 'move', 'step', 'continuous', 'speed', 'control', 'joystick', 'dpad', 'd-pad', 'position', 'axis', 'x', 'y', 'rotation'],
            files: [
                'ARDUINO_INTEGRATION_GUIDE.md',
                'ARDUINO_STATE_BROADCASTING.md',
                'STEP_MODE_FIX_SUMMARY.md',
                'STEP_MODE_TESTING_GUIDE.md',
                'STATE_SYNC_QUICK_START.md',
                'STATE_SYNC_QUICK_REFERENCE.md',
                'QUICK_REFERENCE_POSITION_SYNC.md',
                'X_AXIS_MICROSTEP_FIX_COMPLETE_20251207.md'
            ],
            summary: `
# Machine Control Guide

## Motion Control (D-PAD)
- **UP (↑)**: Move toward the lap
- **DOWN (↓)**: Move away from lap  
- **LEFT (←)**: Rotate counter-clockwise
- **RIGHT (→)**: Rotate clockwise

## Motor Modes
- **CONTINUOUS MODE**: Hold button for smooth motion
- **STEP MODE**: Click for precise step counts (1-70 steps)

## Speed Control (1-5)
- **Speed 1-2**: Polishing (slow, precise)
- **Speed 3**: Balanced work
- **Speed 4-5**: Roughing (fast, aggressive)

## Connection Status
- Check the connection panel for Arduino status
- Green = Connected, Red = Disconnected
- Use SYNC button to refresh state

## Position Panel
Shows real-time position data:
- Current index position
- Motor mode (Step/Continuous)
- Speed multiplier
            `
        },
        
        // Farm Game & Economy
        farmGame: {
            keywords: ['farm', 'game', 'gem', 'rough', 'cut', 'polish', 'sell', 'buy', 'trade', 'marketplace', 'economy', 'price', 'value', 'token', '$gbuv', '$gembot', 'currency', 'gem bot universe', 'vault'],
            files: [
                'COMPLETE_TOKEN_ECOSYSTEM_SUMMARY.md',
                'ECONOMY_LOOP_TESTING_GUIDE.md',
                'MARKETPLACE_PRICING_GUIDE.md'
            ],
            summary: `
# GemBot Farm Game Guide

## The Economy Loop
1. **Buy Rough Gems** - Purchase uncut gemstones
2. **Cut & Polish** - Process through cutting phases
3. **Sell Finished Gems** - Trade at marketplace for profit
4. **Upgrade & Expand** - Reinvest in better materials

## Rough Gem Prices (per carat)
- Diamond: 350 gems
- Ruby: 150 gems
- Emerald: 100 gems
- Sapphire: 80 gems
- Tanzanite: 60 gems
- Amethyst: 5 gems
- Topaz: 8 gems
- Citrine: 4 gems

## Finished Gem Values
Values increase based on cut quality and size.
Polish level and precision affect final price.

## $GBUV Token (Gem Bot Universe Vault)
- Contract: DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump
- Network: Solana
- Use for in-game purchases, forging, and trading
- Connect your Phantom wallet to interact
            `
        },
        
        // AI & Learning System
        aiLearning: {
            keywords: ['ai', 'merlin', 'learn', 'teach', 'lesson', 'curriculum', 'progress', 'streak', 'level', 'tier', 'intelligent', 'mentor'],
            files: [
                'AI_ENHANCEMENT_COMPLETE.md',
                'AI_LEARNING_PROGRESSION_SYSTEM.md',
                'README_MERLIN_INTELLIGENT_MENTOR.md',
                'TEACHING_INTEGRATION_COMPLETE.md',
                'VERIFICATION_LEARNING_SYSTEM_COMPLETE.md',
                'COMPLETE_LEARNING_AND_CONTROL_INDEX.md'
            ],
            summary: `
# Merlin AI Learning System

## Learning Features
- **Progressive Curriculum**: 4 structured lessons
- **Adaptive Teaching**: Adjusts to your pace
- **Knowledge Checks**: Verify understanding
- **Streak System**: Build daily learning habits
- **Gem Rewards**: Earn while you learn

## Lesson Structure
1. **Touch Screen Menu Structure** - Understand the interface
2. **Web Menu Control** - Navigate with buttons
3. **Motion Control (D-PAD)** - Move the machine
4. **Mode & Speed Control** - Master precision

## Commands
- "teach me" - Start lessons
- "next lesson" - Continue learning
- "quiz me" - Test knowledge
- "my progress" - Check status

## Tiers & Levels
Progress through tiers as you learn:
- Novice → Apprentice → Journeyman → Expert → Master
            `
        },
        
        // Camera & Vision
        cameraVision: {
            keywords: ['camera', 'vision', 'ml', 'tensorflow', 'detect', 'identify', 'video', 'stream', 'mobile', 'qr'],
            files: [
                'CAMERA_ML_VISION_INTEGRATION.md',
                'VISION_COMPLETE_DELIVERY.md',
                'VISION_DELIVERY_SUMMARY.md',
                'VISION_CODE_COPY_PASTE.md',
                '00_VISION_IMPLEMENTATION_FINAL.md',
                '00_VISION_INTEGRATION_INDEX.md'
            ],
            summary: `
# Camera & Vision System

## Features
- **Live Camera Feed**: Stream from mobile or USB camera
- **ML Object Detection**: TensorFlow.js COCO-SSD model
- **Real-time Analysis**: Process video frames live
- **Mobile Camera Support**: Use your phone as a camera

## Setup
1. Allow camera access when prompted
2. Select camera source (mobile/USB)
3. Enable ML detection if desired
4. Adjust brightness/contrast as needed

## Image Controls
- Brightness adjustment
- Contrast control
- Saturation settings
- Frame rate selection

## Mobile Camera
- Scan QR code to connect mobile device
- Stream mobile camera to desktop
- Use as gemstone viewing camera
            `
        },
        
        // 3D Visualization
        visualization3D: {
            keywords: ['3d', 'visualization', 'three', 'threejs', 'world', 'scene', 'cube', 'render', 'graphics', 'visual'],
            files: [
                '3D_VISUALIZATION_ENHANCEMENT_SUMMARY.md',
                '3D_VISUALIZATION_QUICK_START.md',
                'UPDATE_SUMMARY_GEMBOT_3D_COMPLETE.md'
            ],
            summary: `
# 3D Visualization System

## Features
- Real-time machine state visualization
- Interactive 3D model of cutting head
- Position and rotation display
- Sync with physical machine

## Controls
- Orbit: Click and drag to rotate view
- Zoom: Scroll wheel
- Pan: Right-click and drag

## Display Elements
- Cutting head position
- Index rotation angle
- Motor state indicators
- Connection status
            `
        },
        
        // Diagnostics & Debug
        diagnostics: {
            keywords: ['debug', 'diagnostic', 'error', 'problem', 'issue', 'fix', 'troubleshoot', 'console', 'log'],
            files: [
                'DIAGNOSTIC_QUICK_START.md',
                'DIAGNOSTIC_SYSTEM_COMPLETE.md',
                'DIAGNOSTIC_USER_GUIDE.md',
                'DIAGNOSTIC_DEVELOPER_REFERENCE.md',
                'CONSOLE_DEBUG_GUIDE_20251207.md',
                'CONSOLE_QUICK_REFERENCE.md',
                'DEBUG_AND_ERROR_HANDLING_GUIDE.md',
                'CRITICAL_DEBUG_GUIDE_20251206.md'
            ],
            summary: `
# Diagnostics & Troubleshooting

## Quick Diagnostics
Open browser console (F12) and type:
- \`ai.status()\` - Full system status
- \`ai.test()\` - Run tests
- \`connectionStatus\` - Check connections

## Common Issues

### Connection Problems
1. Check Arduino is connected
2. Verify correct COM port
3. Try reconnecting via button
4. Check WebSocket status

### Camera Not Working
1. Check browser permissions
2. Verify camera is not in use
3. Try different camera source
4. Refresh the page

### Motors Not Responding
1. Verify Arduino connection
2. Check mode (Step vs Continuous)
3. Verify speed is not at 0
4. Check emergency stop status

## Debug Logging
Enable verbose logging in console:
\`localStorage.setItem('debugMode', 'true')\`
            `
        },
        
        // Deployment & Setup
        deployment: {
            keywords: ['deploy', 'setup', 'install', 'server', 'render', 'host', 'production', 'live'],
            files: [
                'DEPLOYMENT.md',
                'DEPLOYMENT_INDEX.md',
                'DEPLOYMENT_READY_FINAL.md',
                'DEPLOYMENT_LIVE_SYSTEM_OPERATIONAL.md',
                'DEPLOYMENT_TESTING_CHECKLIST.md'
            ],
            summary: `
# Deployment Guide

## Local Development
\`\`\`bash
npm install
npm start
\`\`\`
Access at http://localhost:8000

## Production (Render.com)
- Service ID: srv-d4rodfp5pdvs73bnh0gg
- Auto-deploys from GitHub
- Check events dashboard for status

## Environment
- Node.js 18+
- Modern browser required
- WiFi for mobile access
            `
        },
        
        // Emergency & Safety
        emergency: {
            keywords: ['emergency', 'stop', 'safety', 'halt', 'danger', 'warning'],
            files: [
                'EMERGENCY_STOP_FEATURE.md',
                'EMERGENCY_STOP_SUMMARY.md',
                'EMERGENCY_STOP_CHANGELOG.md'
            ],
            summary: `
# Emergency Stop System

## Quick Stop
Press the EMERGENCY STOP button or:
- Press ESC key
- Type "stop" in chat
- Click red stop button

## What Happens
1. All motors immediately halt
2. Commands are cleared
3. Status shows emergency state
4. Manual reset required

## Reset Procedure
1. Ensure area is clear
2. Click "Reset" button
3. Verify status is normal
4. Resume operations
            `
        }
    },
    
    // Search the knowledge base
    search: function(query) {
        if (!query) return null;
        
        const lowerQuery = query.toLowerCase();
        const results = [];
        
        // Search through categories
        for (const [catName, category] of Object.entries(this.categories)) {
            let score = 0;
            
            // Check keyword matches
            for (const keyword of category.keywords) {
                if (lowerQuery.includes(keyword)) {
                    score += 10;
                }
            }
            
            // Check if query words appear in summary
            const words = lowerQuery.split(/\s+/);
            for (const word of words) {
                if (word.length > 2 && category.summary.toLowerCase().includes(word)) {
                    score += 5;
                }
            }
            
            if (score > 0) {
                results.push({
                    category: catName,
                    score: score,
                    summary: category.summary,
                    files: category.files
                });
            }
        }
        
        // Sort by score
        results.sort((a, b) => b.score - a.score);
        
        return results.length > 0 ? results : null;
    },
    
    // Get help for a specific topic
    getHelp: function(topic) {
        const results = this.search(topic);
        if (results && results.length > 0) {
            return results[0].summary;
        }
        return null;
    },
    
    // Get all available topics
    getTopics: function() {
        return Object.keys(this.categories).map(cat => ({
            name: cat,
            keywords: this.categories[cat].keywords.slice(0, 5).join(', ')
        }));
    },
    
    // Get response for Merlin based on query
    getResponse: function(query) {
        const results = this.search(query);
        
        if (!results || results.length === 0) {
            return null;
        }
        
        const topResult = results[0];
        
        // Format a helpful response
        let response = `📚 **${this.formatCategoryName(topResult.category)}**\n\n`;
        response += topResult.summary.trim();
        
        if (results.length > 1) {
            response += `\n\n---\n*Related topics: ${results.slice(1, 3).map(r => this.formatCategoryName(r.category)).join(', ')}*`;
        }
        
        return response;
    },
    
    // Format category name for display
    formatCategoryName: function(name) {
        const names = {
            quickStart: 'Getting Started',
            machineControl: 'Machine Control',
            farmGame: 'Farm Game & Economy',
            aiLearning: 'AI Learning System',
            cameraVision: 'Camera & Vision',
            visualization3D: '3D Visualization',
            diagnostics: 'Diagnostics & Debug',
            deployment: 'Deployment',
            emergency: 'Emergency Stop'
        };
        return names[name] || name;
    },
    
    // Quick facts for casual conversation
    quickFacts: [
        "GemBot supports both Step mode (precision) and Continuous mode (flow) for motor control.",
        "The speed slider goes from 1 (polishing) to 5 (roughing).",
        "You can earn gems by completing lessons with Merlin!",
        "The $GBUV token (Gem Bot Universe Vault) is on Solana - real crypto integration!",
        "Mobile users can scan the QR code to connect their camera.",
        "Press ESC anytime for emergency stop.",
        "The 3D visualization shows your machine state in real-time.",
        "Diamond rough costs 350 gems per carat - the most expensive!",
        "Amethyst rough is just 5 gems per carat - great for beginners.",
        "You can check system status by asking me 'status' anytime.",
        "The farm game has a complete economy loop: buy rough → cut → sell → profit!",
        "TensorFlow.js powers the camera's object detection.",
        "Each lesson builds on the previous one - start from the beginning!",
        "Your learning streaks give bonus gem rewards.",
        "The Position Panel shows real-time motor positions.",
        "Arduino commands use simple letters: s1-s5 for speed, y for mode toggle."
    ],
    
    // Get a random fact
    getRandomFact: function() {
        return this.quickFacts[Math.floor(Math.random() * this.quickFacts.length)];
    },
    
    // System status for Merlin
    getSystemKnowledge: function() {
        return {
            totalDocFiles: 296,
            categories: Object.keys(this.categories).length,
            topicsIndexed: Object.values(this.categories).reduce((acc, cat) => acc + cat.keywords.length, 0),
            version: this.version,
            capabilities: [
                'Machine control guidance',
                'Farm game economy help',
                'Learning system support',
                'Troubleshooting assistance',
                'Camera/vision guidance',
                '3D visualization help',
                'Deployment information',
                'Emergency procedures'
            ]
        };
    }
};

// Log initialization
console.log('📚 Merlin Knowledge Base loaded:', window.MerlinKnowledgeBase.getSystemKnowledge());
