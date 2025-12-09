# 💎 GemBot Game Systems Documentation

## Quick Start Guide
**Last Updated**: December 9, 2025

---

## 📦 Module Overview

| Module | File | Purpose | Status |
|--------|------|---------|--------|
| Parts Database | `gembot-parts-database.js` | Complete machine parts inventory | ✅ Complete |
| Faceting Designs | `gembot-faceting-designs.js` | 40+ gem cutting patterns | ✅ Complete |
| STL Catalog | `gembot-stl-catalog.js` | 70+ 3D printable parts | ✅ Complete |
| Game Cards | `gembot-game-cards.js` | RPG card system with packs | ✅ Complete |
| 3D Printing | `gembot-3d-printing.js` | Virtual print queue & marketplace | ✅ Complete |
| Troubleshooting | `gembot-troubleshooting.js` | Failures & diagnostic mini-games | ✅ Complete |
| Game Master | `gembot-game-master.js` | Central integration & progression | ✅ Complete |

---

## 🎮 Game Economy

### Currency
- **Gold (🪙)**: Primary currency, earned through printing/selling parts
- **Gems (💎)**: Premium currency for special items
- **XP**: Experience points for level progression

### Starting Values
```javascript
gold: 500    // Starting gold
gems: 0      // Premium currency
level: 1     // Starting level
xp: 0        // Current XP
```

---

## 🏆 Progression System

### Level Requirements
| Level | XP Required | Unlocks |
|-------|-------------|---------|
| 1 | 0 | Basic printer, PLA material |
| 2 | 100 | - |
| 3 | 250 | PETG material |
| 5 | 1,000 | ABS material, Standard printer |
| 10 | 7,500 | Professional printer |
| 15 | 25,000 | Industrial printer, Nylon |
| 20 | 60,000 | Master Lapidary title |

### Achievements (17 total)
- **Beginner**: First Sparkle, Layer by Layer, Handy Worker
- **Milestone**: Gem Collector, Print Master, Gold Digger
- **Skill**: Precision Master, Perfect Print, Diagnostic Genius
- **Collection**: Round Collector, Rare Finder
- **Real World**: Going Physical, Master Builder

---

## 🖨️ 3D Printing System

### Printer Tiers
```javascript
basic: {
    cost: 500,
    unlockLevel: 1,
    speedMultiplier: 1.0,
    failureRate: 1.0,
    materials: ["PLA", "PETG"]
}

professional: {
    cost: 5,000,
    unlockLevel: 10,
    speedMultiplier: 1.8,
    failureRate: 0.5,
    materials: ["PLA", "PETG", "ABS", "Nylon"]
}
```

### Materials
| Material | Cost/gram | Unlock Level | Strength |
|----------|-----------|--------------|----------|
| PLA | $0.02 | 1 | 60 |
| PETG | $0.025 | 3 | 80 |
| ABS | $0.03 | 5 | 85 |
| Nylon | $0.05 | 8 | 95 |
| TPU | $0.04 | 6 | 70 |

### Print Quality Grades
- **A+ (Perfect)**: 10% chance, 1.3x sell value
- **A (Excellent)**: 25% chance, 1.15x sell value
- **B (Good)**: 40% chance, 1.0x sell value
- **C (Acceptable)**: 20% chance, 0.85x sell value
- **D (Poor)**: 5% chance, 0.6x sell value

### Failure Types (7)
- Bed Adhesion (5%)
- Layer Shift (3%)
- Spaghetti Monster (4%)
- Nozzle Clog (2%)
- Stringing (8%)
- Warping (6%)
- Under-Extrusion (4%)

---

## 🔧 Troubleshooting System

### Component Failure Categories
- **Motion System**: Stepper motor, belt slip, bearing wear
- **Electronics**: Arduino, touch screen, power supply
- **Mechanical**: Index gear, mast alignment
- **Sensors**: Limit switch, potentiometer
- **Consumables**: Lap wear, dop wax

### Technician Levels
| Level | Name | XP Required | Repair Speed | Failure Reduction |
|-------|------|-------------|--------------|-------------------|
| 1 | Novice | 0 | 100% | 0% |
| 2 | Apprentice | 500 | 90% | 10% |
| 3 | Journeyman | 1,500 | 80% | 20% |
| 4 | Expert | 4,000 | 70% | 30% |
| 5 | Master | 10,000 | 50% | 40% |

### Diagnostic Mini-Games (12)
1. Waveform Analysis
2. Belt Tension Test
3. Runout Measurement
4. Serial Debug Challenge
5. Touch Calibration
6. Voltage Reading
7. Gear Tooth Inspection
8. Laser Alignment
9. Switch Continuity
10. Signal Quality Check
11. Visual Inspection
12. Bond Strength Test

---

## 🃏 Card System

### Rarity Distribution
| Rarity | Drop Rate | Border Color |
|--------|-----------|--------------|
| Common | 50% | Gray |
| Uncommon | 30% | Green |
| Rare | 15% | Blue |
| Epic | 4% | Purple |
| Legendary | 1% | Gold (animated) |

### Card Packs
- **Basic Pack** (3 cards): 100 gold
- **Standard Pack** (5 cards): 200 gold
- **Premium Pack** (5 cards, guaranteed rare+): 500 gold
- **Legendary Pack** (5 cards, guaranteed epic+): 1000 gold

---

## 💰 Real-World Integration

### Build Costs
- **Basic Build**: $564 (essential components only)
- **Complete Build**: $4,200 (including 3D printed parts)

### Amazon Affiliate Integration
```javascript
amazonAffiliateTag: "gembot-20"
generateAmazonLink(asin) // Returns affiliate URL
```

### STL File Pricing
- **Single STL**: $2.99
- **Category Bundle**: $9.99
- **Complete Collection**: $49.99

---

## 🔗 Module Integration

### Loading All Modules (Browser)
```html
<script src="gembot-parts-database.js"></script>
<script src="gembot-faceting-designs.js"></script>
<script src="gembot-stl-catalog.js"></script>
<script src="gembot-game-cards.js"></script>
<script src="gembot-3d-printing.js"></script>
<script src="gembot-troubleshooting.js"></script>
<script src="gembot-game-master.js"></script>

<script>
    // Initialize game state
    const gameState = GemBotGameMaster.createGameState();
    gameState.printing = GemBot3DPrinting.createPlayerPrintingState();
    gameState.troubleshooting = GemBotTroubleshooting.createPlayerTroubleshootingState();
</script>
```

### Loading All Modules (Node.js)
```javascript
const GemBotPartsDatabase = require('./gembot-parts-database.js');
const GemBotFacetingDesigns = require('./gembot-faceting-designs.js');
const GemBotSTLCatalog = require('./gembot-stl-catalog.js');
const GemBotGameCards = require('./gembot-game-cards.js');
const GemBot3DPrinting = require('./gembot-3d-printing.js');
const GemBotTroubleshooting = require('./gembot-troubleshooting.js');
const GemBotGameMaster = require('./gembot-game-master.js');
```

---

## 📊 API Quick Reference

### GemBot3DPrinting
```javascript
// Create player state
const printState = GemBot3DPrinting.createPlayerPrintingState();

// Start a print
GemBot3DPrinting.startPrint(printState, partData, "PLA", "medium");

// Check print queue
GemBot3DPrinting.updatePrintQueue(printState);

// Purchase material
GemBot3DPrinting.purchaseMaterial(printState, "PETG", 2);
```

### GemBotTroubleshooting
```javascript
// Create troubleshooting state
const troubleState = GemBotTroubleshooting.createPlayerTroubleshootingState();

// Roll for random failure
GemBotTroubleshooting.rollForFailure(troubleState, "heavyLoad");

// Start diagnostic
GemBotTroubleshooting.startDiagnostic(troubleState, failureId);

// Complete repair
GemBotTroubleshooting.attemptRepair(troubleState, failureId);
```

### GemBotGameMaster
```javascript
// Create full game state
const gameState = GemBotGameMaster.createGameState();

// Add XP
GemBotGameMaster.addXP(gameState, 100, "print completed");

// Check achievement
GemBotGameMaster.checkAchievement(gameState, "firstPrint");

// Generate daily challenge
GemBotGameMaster.generateDailyChallenge(gameState);

// Generate Amazon link
GemBotGameMaster.generateAmazonLink("B07SDCX8H1");
```

---

## 📁 Project Structure

```
GemBotMemory2025/
├── gembot-parts-database.js     # 30+ parts with Amazon links
├── gembot-faceting-designs.js   # 40+ shape categories
├── gembot-stl-catalog.js        # 70+ STL files cataloged
├── gembot-game-cards.js         # RPG card system
├── gembot-3d-printing.js        # Print queue & marketplace
├── gembot-troubleshooting.js    # Failures & diagnostics
├── gembot-game-master.js        # Central integration
├── GEMBOT_GAME_SYSTEMS.md       # This documentation
├── allShapesAndDesigns/         # Source faceting patterns
├── STL_Previews/                # 200+ part images
└── sdcard0/                     # Touch screen data files
```

---

## 🚀 Next Steps

1. **Web Integration**: Add these modules to GemBot_Control_AI.html
2. **State Persistence**: Add localStorage/database save/load
3. **Multiplayer**: Marketplace trading between players
4. **Tutorials**: Guided first-time user experience
5. **Mobile**: Responsive design for tablet operation

---

*💎 GemBot Game Systems v1.0.0 - Built for makers who dream of gemstones*
