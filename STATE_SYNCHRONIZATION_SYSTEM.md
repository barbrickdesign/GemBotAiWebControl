# GemBot State Synchronization System - Implementation Plan

## Problem Statement

Currently, the web interface has **hardcoded defaults** that don't sync with:
- Arduino's actual machine state (position, motor speed, mode)
- Touch screen menu state (current mode: design, cut, polish, manual control)
- Cutting phase progression (preform → rough → fine → polish)
- Actual grit wheel being used (determines lap type)
- Estimated time remaining (based on facets to cut)

## Three-System State Synchronization Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARDUINO (Hardware Source of Truth)             │
│ Variables: motorSpeed, stepModeEnabled, posX, posY, angle, index │
│ LCD Display: Current mode, phase, position                        │
└──────────────┬──────────────────────────────────────────────────┘
               │ Serial Protocol (pX:, pY:, pA:, pI: messages)
               │
    ┌──────────┴──────────┬──────────────────────┐
    │                     │                      │
    v                     v                      v
┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  TOUCH      │  │  WEB INTERFACE   │  │   AI KNOWLEDGE   │
│  SCREEN     │  │  (This file)     │  │   (GemBot_      │
│  (Nextion)  │  │                  │  │    Control_AI)  │
│             │  │ ├─ motorSpeed    │  │                 │
│ ├─ Current  │  │ ├─ motorMode     │  │ Must fetch from:│
│   Mode      │  │ ├─ posX, posY    │  │ ├─ machineState │
│ ├─ Position │  │ ├─ angle, index  │  │ ├─ motorSpeed   │
│ ├─ Phase    │  │ ├─ currentPhase  │  │ ├─ motorMode    │
│ ├─ Facet #  │  │ ├─ stoneType     │  │ ├─ currentPhase │
│ └─ Grit     │  │ ├─ gritGrade     │  │ └─ gritGrade    │
│   Wheel     │  │ ├─ lapType       │  │                 │
│             │  │ └─ timeRemaining │  │                 │
└─────────────┘  └──────────────────┘  └──────────────────┘
```

## Current Issues

### 1. **Hardcoded Values in Web Interface**

**BEFORE** (lines 2333-2337):
```javascript
const currentSpeed = motorSpeed || 1;                    // Default 1
const currentMode = motorMode || 'continuous';          // Default continuous
const posX = machineState?.currentState?.positionX || 0;// Default 0
const posY = machineState?.currentState?.positionY || 0;// Default 0
```

**PROBLEM**: 
- If Arduino has speed=4, web shows 1
- If in STEP mode, web shows CONTINUOUS
- Position shows 0,0 even if Arduino is at 100,200

### 2. **No Touch Screen Mode Tracking**

**Missing Information**:
- Is machine in "Manual Control" mode or "Cut Mode" or "Polish Mode"?
- What cutting PHASE is active? (preform, rough, fine, polish)
- What STAGE in phase? (e.g., Girdle → Pavilion → Crown → Table)
- Is user in "Design" mode selecting cuts?

### 3. **No Lap Type / Grit Awareness**

**Missing Information**:
- What grit wheel is currently mounted? (60, 220, 600, 1200, 8000, 14000)
- Rough lap, Fine lap, or Polish lap?
- Affects recommended speeds and techniques

### 4. **No Facet/Angle Tracking**

**Missing Information**:
- How many facets total to cut?
- How many DONE? How many REMAINING?
- Current facet being worked on
- Current target angle

### 5. **No Time Estimation**

**Missing Information**:
- Estimated time remaining based on:
  - Number of facets left
  - Stone type (diamond vs ruby vs emerald = different times)
  - Current phase (roughing fastest, polishing slowest)
  - User skill level

## Implementation Plan

### Phase 1: Core State Variables (Week 1)

Create a unified state object that pulls from all three sources:

```javascript
// Global state object - source of truth for all three systems
const machineGlobalState = {
    // ===== HARDWARE STATE (FROM ARDUINO) =====
    hardware: {
        motorSpeed: 1,              // 1-5 from Arduino
        motorMode: 'continuous',    // or 'step'
        stepSize: 1,                // 1-70 steps per command
        position: {
            x: 0,
            y: 0,
            rotation: 0,            // degrees
            index: 0
        },
        motorTimeout: 0,            // seconds since last command
        emergencyStopActive: false,
        connectionStatus: 'disconnected' // connected/disconnected/error
    },
    
    // ===== TOUCH SCREEN STATE =====
    touchScreen: {
        currentMenuMode: 'manual_control',  // manual_control, design, preform, cut, polish, settings
        currentPhase: 'roughing',           // roughing, fine_cutting, polishing, grinding
        currentStage: 'girdle',             // girdle, pavilion, crown, table (for cut phase)
        currentFacet: 1,                    // Which facet in sequence
        totalFacets: 0,                     // Total to cut (0 if not calculated)
        factetsRemaining: 0,                // How many left
        lapType: 'rough',                   // rough, fine, polish
        gritGrade: 60,                      // 60, 220, 600, 1200, 8000, 14000
        designSelected: null,               // User's selected cut design
        shapeSelected: 'round',             // Shape being cut
        stoneSelected: null,                // Stone type selected
        estimatedTimeRemaining: 0           // seconds
    },
    
    // ===== WEB INTERFACE STATE =====
    web: {
        recordingActive: false,
        cameraActive: false,
        mlModelLoaded: false,
        sessionData: [],
        debugLogsEnabled: true
    },
    
    // ===== COMPUTED / GUIDANCE STATE =====
    guidance: {
        recommendedSpeed: 4,            // Based on phase & stone
        recommendedMode: 'continuous',  // Based on phase
        recommendedLap: 'rough',        // Based on phase
        currentPhaseName: 'ROUGHING',
        phaseDuration: '30-60%',
        phaseTechnique: 'Let the lap do the work. Steady pressure, flowing movements.',
        stoneName: null,
        stoneHardness: null,            // Mohs hardness for recommendations
        stoneCharacteristics: null
    }
};
```

### Phase 2: Arduino Communication Protocol (Week 1-2)

**Arduino sends position every 100ms**:
```
[DATA] pX:150 pY:200 pA:45 pI:32 spd:3 mod:step
```

**Web parses and updates**:
```javascript
function parseArduinoState(message) {
    const matches = {
        x: message.match(/pX:(\d+)/),
        y: message.match(/pY:(\d+)/),
        angle: message.match(/pA:(\d+)/),
        index: message.match(/pI:(\d+)/),
        speed: message.match(/spd:(\d)/),
        mode: message.match(/mod:(\w+)/)
    };
    
    if (matches.x) machineGlobalState.hardware.position.x = parseInt(matches.x[1]);
    if (matches.y) machineGlobalState.hardware.position.y = parseInt(matches.y[1]);
    if (matches.angle) machineGlobalState.hardware.position.rotation = parseInt(matches.angle[1]);
    if (matches.index) machineGlobalState.hardware.position.index = parseInt(matches.index[1]);
    if (matches.speed) machineGlobalState.hardware.motorSpeed = parseInt(matches.speed[1]);
    if (matches.mode) machineGlobalState.hardware.motorMode = matches.mode[1];
    
    updateAllSystems();  // Propagate changes to AI, UI, etc.
}
```

### Phase 3: Touch Screen Mode Tracking (Week 2)

**Arduino sends menu page changes**:
```
[MENU] page:1 (Settings)
[MENU] page:14 (Design)
[MENU] page:16 (Preform)
[MENU] page:17 (Cut)
[MENU] page:18 (Polish)
```

**Web parses and updates**:
```javascript
const menuPageMap = {
    '1': { mode: 'settings', phase: null },
    '10': { mode: 'manual_control', phase: null },
    '14': { mode: 'design', phase: null },
    '16': { mode: 'preform', phase: 'preforming' },
    '17': { mode: 'cut', phase: 'roughing' },  // Default, refined by user selections
    '18': { mode: 'polish', phase: 'polishing' }
};
```

### Phase 4: Cutting Phase Detection (Week 2-3)

**Based on user menu selections AND speed/mode**:

```javascript
function detectCuttingPhase() {
    // If not in cut mode, no phase
    if (machineGlobalState.touchScreen.currentMenuMode !== 'cut') {
        return null;
    }
    
    const speed = machineGlobalState.hardware.motorSpeed;
    const mode = machineGlobalState.hardware.motorMode;
    
    // Phase detection from speed/mode patterns
    if (speed >= 4 && mode === 'continuous') {
        return 'roughing';  // Aggressive work
    } else if (speed >= 2 && speed <= 3 && mode === 'step') {
        return 'fine_cutting';  // Precision work
    } else if (speed === 1 && mode === 'step') {
        return 'polishing';  // Gentle work
    } else if (speed === 2 && mode === 'step') {
        return 'grinding';  // Bridge phase
    } else if (speed >= 3 && speed <= 4 && (mode === 'continuous' || mode === 'step')) {
        return 'preforming';  // Intermediate phase
    }
    
    // Fallback: ask user or default based on menu
    return 'unknown';
}
```

### Phase 5: Lap Type / Grit Integration (Week 3)

**User selects grit at start of phase**:

```javascript
const lapGrits = {
    'roughing': {
        grit: 60,
        lapType: 'rough',
        description: 'Coarse grit for aggressive material removal',
        recommendedSpeeds: '4-5'
    },
    'preforming': {
        grit: 220,
        lapType: 'fine',
        description: 'Medium grit for shaping toward angles',
        recommendedSpeeds: '3-4'
    },
    'fine_cutting': {
        grit: 600,
        lapType: 'fine',
        description: 'Fine grit for precision angle work',
        recommendedSpeeds: '2-3'
    },
    'grinding': {
        grit: 1200,
        lapType: 'fine',
        description: 'Very fine for edge refinement',
        recommendedSpeeds: '2'
    },
    'polishing': {
        grit: 8000,
        lapType: 'polish',
        description: 'Polish grit for final shine',
        recommendedSpeeds: '1-2'
    }
};
```

### Phase 6: Facet Tracking (Week 3-4)

**Based on selected design, calculate facet progression**:

```javascript
function initializeDesignFacets(designName, shape) {
    // Load design specifications from user manual
    const designs = {
        'standard_round_brilliant': {
            shape: 'round',
            totalFacets: 58,  // 1 table + 8 girdle + 8 upper girdle + 
                              // 16 upper pavilion + 1 culet
            stages: {
                'girdle': 8,
                'pavilion': 24,
                'crown': 32,
                'table': 1
            },
            estimatedHours: {
                'rough': 2,      // Varies by stone
                'fine': 3,
                'polish': 2
            }
        }
    };
    
    machineGlobalState.touchScreen.designSelected = designName;
    machineGlobalState.touchScreen.totalFacets = designs[designName].totalFacets;
    machineGlobalState.touchScreen.factetsRemaining = designs[designName].totalFacets;
}

function markFacetComplete() {
    if (machineGlobalState.touchScreen.factetsRemaining > 0) {
        machineGlobalState.touchScreen.factetsRemaining--;
        machineGlobalState.touchScreen.currentFacet++;
        updateTimeRemaining();
    }
}
```

### Phase 7: Time Estimation (Week 4)

**Calculate based on multiple factors**:

```javascript
function estimateTimeRemaining() {
    const factors = {
        facetsRemaining: machineGlobalState.touchScreen.factetsRemaining,
        currentPhase: machineGlobalState.touchScreen.currentPhase,
        stone: machineGlobalState.touchScreen.stoneSelected,
        userSkillLevel: 'intermediate',  // From user profile
        currentSpeed: machineGlobalState.hardware.motorSpeed
    };
    
    // Time per facet varies by phase
    const timePerFacet = {
        'roughing': 2,          // 2 min per facet (rough)
        'fine_cutting': 5,      // 5 min per facet (precision)
        'polishing': 3          // 3 min per facet (polish)
    };
    
    // Stone modifier (some stones cut faster)
    const stoneModifier = {
        'diamond': 1.0,
        'ruby': 1.2,            // Slower due to hardness
        'sapphire': 1.1,
        'emerald': 1.5,         // Much slower, fragile
        'opal': 1.4             // Very slow, delicate
    };
    
    const baseTime = timePerFacet[factors.currentPhase] || 3;
    const modifier = stoneModifier[factors.stone] || 1.0;
    const totalSeconds = Math.ceil(factors.facetsRemaining * baseTime * modifier * 60);
    
    machineGlobalState.touchScreen.estimatedTimeRemaining = totalSeconds;
    return formatTime(totalSeconds);  // Returns "2h 30m"
}
```

### Phase 8: AI Integration (Week 4-5)

**AI now has accurate context**:

```javascript
// In GemBotAI.getSmartContextResponse():
getSmartContextResponse(query, speed, mode, posX, posY) {
    // NOW we can use ACTUAL state, not defaults
    const actualState = machineGlobalState;
    
    // Example: Speed question
    if (/speed|fast|slow/.test(query)) {
        return `SPEED CONTROL: Current speed: ${actualState.hardware.motorSpeed}/5.
                Phase: ${actualState.guidance.currentPhaseName} 
                Lap: ${actualState.touchScreen.lapType} (${actualState.touchScreen.gritGrade} grit)
                Technique: ${actualState.guidance.phaseTechnique}`;
    }
    
    // Example: Mode question
    if (/mode|step|continuous/.test(query)) {
        return `MODES: Current mode: ${actualState.hardware.motorMode.toUpperCase()}
                Phase: ${actualState.touchScreen.currentPhase}
                ${actualState.guidance.currentPhaseRecommendation}`;
    }
    
    // Example: Progress question
    if (/progress|remaining|how many/.test(query)) {
        return `Progress: Facet ${actualState.touchScreen.currentFacet} of ${actualState.touchScreen.totalFacets}
                Remaining: ${actualState.touchScreen.factetsRemaining} facets
                Est. time: ${formatTime(actualState.touchScreen.estimatedTimeRemaining)}
                Stone: ${actualState.touchScreen.stoneSelected}`;
    }
}
```

## User Manual Integration Points

**From manual, add to knowledge base**:

1. **Preform Angles** (per stone)
   - Round: 90° girdle, 52° pavilion
   - Square: 90° girdle, 43° pavilion
   - Etc.

2. **Cutting Angles** (per stone, per facet type)
   - Crown angles: 34-40° (varies by design)
   - Pavilion angles: 40-43° (varies by design)
   - Table size: 50-65% of diameter

3. **Cutting Times** (per phase, per stone)
   - Diamond: Fastest
   - Ruby: Medium
   - Emerald: Slowest (fragile)

4. **Grit Selection** (per phase)
   - Roughing: 60 grit
   - Preforming: 220 grit
   - Fine cutting: 600 grit
   - Grinding: 1200 grit
   - Polishing: 8000-14000 grit

5. **Speed Recommendations** (per phase, per stone)
   - Emerald roughing: Speed 3 (not 4-5, too fragile)
   - Opal fine cutting: Speed 1-2 only
   - Diamond polishing: Speed 1-2 with polish compound

## Arduino Code Changes Required

**Add state broadcasting every 100ms**:

```cpp
// In Arduino loop():
void broadcastMachineState() {
    static unsigned long lastBroadcast = 0;
    if (millis() - lastBroadcast >= 100) {
        lastBroadcast = millis();
        
        // Send current position
        Serial.print("[DATA] pX:");
        Serial.print(countX);
        Serial.print(" pY:");
        Serial.print(countY);
        Serial.print(" pA:");
        Serial.print(angle);
        Serial.print(" pI:");
        Serial.print(indexPosition);
        Serial.print(" spd:");
        Serial.print(motorSpeedMultiplier);
        Serial.print(" mod:");
        Serial.println(stepModeEnabled ? "step" : "continuous");
    }
}
```

## Summary of Changes

| Component | Current | New | Benefit |
|-----------|---------|-----|---------|
| **Speed** | Default 1 | Real speed from Arduino | AI gives accurate speed context |
| **Mode** | Default continuous | Real mode from Arduino | AI gives accurate mode guidance |
| **Position** | Default 0,0 | Real position from Arduino | AI aware of actual location |
| **Menu Mode** | Unknown | Tracked from Nextion | AI knows if in cut/polish/design |
| **Phase** | Assumed | Detected from speed/mode | AI matches guidance to phase |
| **Lap Type** | Unknown | User-selected per phase | AI knows what lap is active |
| **Grit Grade** | Unknown | Tracked with lap type | AI can reference grit number |
| **Facets** | Unknown | Calculated from design | AI shows progress |
| **Time Est.** | Unknown | Calculated dynamically | AI shows time remaining |

## Timeline

- **Week 1-2**: Core state object + Arduino parsing
- **Week 2-3**: Touch screen mode + phase detection
- **Week 3**: Lap type / grit integration
- **Week 4**: Facet tracking + time estimation
- **Week 5**: AI integration + testing

## Testing Protocol

1. **State Sync Test**: Arduino sends position → Web updates → Verify match
2. **Mode Test**: User selects menu → Web detects → AI uses real mode
3. **Phase Test**: Speed/mode change → Phase auto-detects → AI adjusts guidance
4. **Time Test**: Run 5 facets → Check remaining estimates → Verify accuracy
5. **AI Test**: Ask contextual questions → AI responds with actual values

---

**Owner**: GemBot Development  
**Status**: Planned  
**Priority**: CRITICAL - Blocks accurate AI guidance  
**Dependency**: Requires Arduino state broadcasting implementation
