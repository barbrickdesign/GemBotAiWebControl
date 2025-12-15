# 🧙 Merlin AI Contextual Guidance System

## Overview
Merlin now acts as an intelligent guide that analyzes conversation context and automatically:
1. **Flips the card** to show the control panel
2. **Highlights specific buttons** the user needs to press
3. **Provides clear instructions** on what action to take

## 🎯 How It Works

### Automatic Context Analysis
When a user sends a message, Merlin analyzes keywords to determine intent:

```javascript
User: "How do I plant gems?"
Merlin: [Flips card] → [Highlights "Plant Gems" button] → "🌱 Press 'Plant Gems' to start growing your gem farm!"

User: "I want to craft something"
Merlin: [Flips card] → [Highlights "Craft Item" button] → "⚒️ Press 'Craft Item' to forge something new!"

User: "Where is the marketplace?"
Merlin: [Flips card] → [Highlights "Marketplace" button] → "🛒 Press 'Marketplace' to browse items!"
```

## 🎮 Control Panel Layout

### Back of Card (6 Sections)

```
╔═══════════════════════════════════════╗
║     🎮 GemBot Controls                ║
╠═══════════════════════════════════════╣
║  🧙‍♂️ Press the highlighted button... ║ ← Merlin's Advice Banner
╠═══════════════════════════════════════╣
║  🌾 Farm                              ║
║  [🌱 Plant Gems]                      ║
║  [💎 Harvest]                         ║
║  [⬆️ Upgrade Farm]                    ║
╠═══════════════════════════════════════╣
║  🔨 Forge                             ║
║  [⚒️ Craft Item]                      ║
║  [🔧 Repair]                          ║
║  [✨ Enhance]                         ║
╠═══════════════════════════════════════╣
║  🤖 Machine                           ║
║  [🔍 Scan Area]                       ║
║  [🔗 Connect]                         ║
║  [📊 Analyze]                         ║
╠═══════════════════════════════════════╣
║  🏪 Trading                           ║
║  [🛒 Marketplace]                     ║
║  [💰 Trade Gems]                      ║
║  [🎒 Inventory]                       ║
╠═══════════════════════════════════════╣
║  📚 Academy                           ║
║  [📖 Learn Skill]                     ║
║  [🎓 Tutorial]                        ║
║  [📜 Guide]                           ║
╠═══════════════════════════════════════╣
║  ⚙️ System                            ║
║  [⚙️ Settings]                        ║
║  [❓ Help]                            ║
║  [🚪 Exit]                            ║
╠═══════════════════════════════════════╣
║       [← Back to Chat]                ║
╚═══════════════════════════════════════╝
```

## 📚 Keyword Mappings

### 🌾 Farm Actions
| User Says | Merlin Highlights | Advice |
|-----------|-------------------|---------|
| plant, grow, seed | Plant Gems | 🌱 Press "Plant Gems" to start growing |
| harvest, collect, pick | Harvest | 💎 Press "Harvest" to collect mature gems |
| upgrade farm, improve | Upgrade Farm | ⬆️ Press "Upgrade Farm" to expand |

### 🔨 Forge Actions
| User Says | Merlin Highlights | Advice |
|-----------|-------------------|---------|
| craft, make, create | Craft Item | ⚒️ Press "Craft Item" to forge something |
| repair, fix, broken | Repair | 🔧 Press "Repair" to fix damaged items |
| enhance, upgrade, improve | Enhance | ✨ Press "Enhance" to power up items |

### 🤖 Machine Actions
| User Says | Merlin Highlights | Advice |
|-----------|-------------------|---------|
| scan, search, find | Scan Area | 🔍 Press "Scan Area" to discover resources |
| connect, link, pair | Connect | 🔗 Press "Connect" to link your machine |
| analyze, check, inspect | Analyze | 📊 Press "Analyze" to examine data |

### 🏪 Trading Actions
| User Says | Merlin Highlights | Advice |
|-----------|-------------------|---------|
| buy, shop, market | Marketplace | 🛒 Press "Marketplace" to browse items |
| trade, sell, exchange | Trade Gems | 💰 Press "Trade Gems" to exchange |
| inventory, items, bag | Inventory | 🎒 Press "Inventory" to view items |

### 📚 Academy Actions
| User Says | Merlin Highlights | Advice |
|-----------|-------------------|---------|
| learn, teach, skill | Learn Skill | 📖 Press "Learn Skill" for new abilities |
| tutorial, how to | Tutorial | 🎓 Press "Tutorial" to learn basics |
| guide | Guide | 📜 Press "Guide" for detailed help |

### ⚙️ System Actions
| User Says | Merlin Highlights | Advice |
|-----------|-------------------|---------|
| help, stuck, confused | Help | ❓ Press "Help" for assistance |

## 🎨 Visual Effects

### Advice Banner
- **Purple gradient background** with pulsing glow
- **Wizard icon** (🧙‍♂️) with drop shadow
- **Dynamic text** that changes based on context
- **Animated pulse** to draw attention

### Button Highlighting
```css
Normal Button:
┌─────────────────┐
│ 🌱 Plant Gems   │ (Dark background)
└─────────────────┘

Highlighted Button:
╔═════════════════╗
║ 🌱 Plant Gems   ║ (Purple glow, scaled up)
╚═════════════════╝ (Pulsing animation)
```

**Effects:**
- Gradient purple background
- 2px glowing border
- Scale: 1.05x (slightly larger)
- Translate: 8px right (stands out)
- Pulsing animation (1.5s loop)
- Box shadow: 0-40px purple glow

## 🔧 API Methods

### Manual Guidance
```javascript
// Guide user to specific control
MerlinCardIntegrated.guideToControl('plant', '🌱 Plant your first gems!');

// Parameters:
// - actionId: 'plant', 'harvest', 'craft', 'scan', etc.
// - advice: Custom text to display in banner

// This will:
// 1. Flip card to control panel (if not already)
// 2. Update advice banner text
// 3. Highlight the specified button
// 4. Scroll button into view
// 5. Animate gemstone + particles
```

### Automatic Analysis
```javascript
// Analyze user message and auto-guide
const wasGuided = MerlinCardIntegrated.analyzeAndGuide(userMessage);

// Returns: true if keyword matched and guidance triggered, false otherwise
```

### Handle Control Press
```javascript
// Triggered when user clicks a control button
window.addEventListener('merlinControlAction', (e) => {
    const action = e.detail.action; // 'plant', 'harvest', etc.
    console.log('User pressed:', action);
    
    // Your game logic here
    if (action === 'plant') {
        GemBot.farm.plantGems();
    }
});
```

## 💡 Usage Examples

### Example 1: Natural Conversation
```javascript
User: "I want to start a gem farm"
Merlin: [Auto-analyzes keywords: "start", "gem", "farm"]
        [Flips to control panel]
        [Highlights "Plant Gems"]
        "🌱 Press 'Plant Gems' to start growing your gem farm!"

User: [Clicks "Plant Gems" button]
System: [Triggers 'merlinControlAction' event]
        [Executes GemBot.farm.plantGems()]
Merlin: [Flips back to chat]
        "Executing plant... ✨"
```

### Example 2: Multiple Keywords
```javascript
User: "How do I fix my broken items?"
Merlin: [Detects: "fix", "broken"]
        [Flips to control panel]
        [Highlights "Repair"]
        "🔧 Press 'Repair' to fix damaged items!"
```

### Example 3: No Match (Standard Response)
```javascript
User: "What's the weather like?"
Merlin: [No keywords matched]
        [Stays on chat side]
        "I received your message: What's the weather like?"
        [No guidance triggered]
```

## 🎬 Animation Sequence

When guidance is triggered:

```
1. Card flips (0.8s smooth rotation)
   └─ rotateY(180deg)

2. Advice banner pulses (immediately visible)
   └─ Glow animation starts

3. Target button highlights (0.3s delay)
   ├─ Scale up to 1.05x
   ├─ Purple glow appears
   ├─ Pulsing animation starts
   └─ Scrolls into view (smooth)

4. Gemstone changes color (question = amber)
   └─ Color transition (0.8s)

5. Wizard animation triggers
   ├─ Pointing animation
   └─ Magic particles (intensity 2)
```

After user presses button:

```
1. Button press animation (0.3s)
   └─ Scale down slightly

2. Highlight removed
   └─ Returns to normal state

3. Card flips back (0.8s)
   └─ rotateY(0deg)

4. Merlin confirms action
   ├─ Gemstone: success color (green)
   └─ Message: "Executing {action}... ✨"
```

## 🔌 Integration with GemBot

### Connect to Existing Systems
```javascript
// In your main GemBot code:

// Listen for Merlin control actions
window.addEventListener('merlinControlAction', (e) => {
    const { action } = e.detail;
    
    switch(action) {
        case 'plant':
            if (GemBotFarm) GemBotFarm.plantSeeds();
            break;
        case 'harvest':
            if (GemBotFarm) GemBotFarm.harvestGems();
            break;
        case 'craft':
            if (GemBotForge) GemBotForge.openCraftingMenu();
            break;
        case 'scan':
            if (VirtualMachine3D) VirtualMachine3D.scanArea();
            break;
        case 'marketplace':
            if (GemBotMarketplace) GemBotMarketplace.open();
            break;
        // ... etc
    }
});

// Trigger guidance from AI responses
window.addEventListener('aiResponse', (e) => {
    const response = e.detail.message;
    
    // Let Merlin analyze and guide if relevant
    MerlinCardIntegrated.analyzeAndGuide(response);
});
```

### Custom Guidance Triggers
```javascript
// When user enters new area
GemBot.on('enterArea', (area) => {
    if (area === 'farm') {
        MerlinCardIntegrated.guideToControl('plant', 
            '🌾 Welcome to the farm! Start by planting gems.');
    }
});

// When tutorial step completes
GemBot.tutorial.on('stepComplete', (step) => {
    if (step === 3) {
        MerlinCardIntegrated.guideToControl('harvest',
            '🎓 Great job! Now try harvesting your first gem.');
    }
});

// When low on resources
GemBot.on('lowResources', () => {
    MerlinCardIntegrated.guideToControl('marketplace',
        '⚠️ Running low on gems. Visit the marketplace!');
});
```

## 📊 Statistics & Tracking

Track guidance effectiveness:
```javascript
let guidanceStats = {
    triggered: 0,
    followed: 0,
    ignored: 0
};

// When guidance triggers
MerlinCardIntegrated.on('guidanceShown', (action) => {
    guidanceStats.triggered++;
});

// When user presses highlighted button
window.addEventListener('merlinControlAction', (e) => {
    guidanceStats.followed++;
});

// Calculate effectiveness
const effectiveness = (guidanceStats.followed / guidanceStats.triggered) * 100;
console.log(`Merlin guidance followed ${effectiveness}% of the time`);
```

## 🎯 Future Enhancements

### Planned Features:
1. **Voice Commands** - "Merlin, show me how to plant"
2. **Multi-step Guidance** - Show sequence of buttons
3. **Visual Arrows** - Draw lines from Merlin to button
4. **Animated Tooltips** - Floating help text on hover
5. **Learning Mode** - Adapt suggestions based on user behavior
6. **Custom Mappings** - Let users define their own keywords

## 📱 Responsive Design

Control panel adapts to screen size:
- **Desktop (>768px)**: 6-column grid
- **Tablet (480-768px)**: 3-column grid
- **Mobile (<400px)**: 2-column grid, smaller buttons

## 🎨 Theming

Control panel uses consistent purple theme:
```css
Primary: #9333ea (147, 51, 234)
Accent:  #a855f7 (168, 85, 247)
Glow:    rgba(168, 85, 247, 0.8)
```

Highlighted button stands out with brighter purple and pulsing animation.

---

**Merlin is now an intelligent contextual guide that helps users navigate GemBot by analyzing conversation and highlighting exactly what they need to do! 🧙✨**
