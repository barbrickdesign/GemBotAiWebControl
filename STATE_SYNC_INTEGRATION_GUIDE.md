# State Synchronization Implementation - Integration Guide

## Quick Start

### Step 1: Add State Sync Code to GemBot_Control_AI.html

**Location**: Before the `class GemBotAI {` declaration (around line 1610)

**Code**: Copy the entire content from `MACHINE_STATE_SYNC_CODE.js` and paste it into the HTML file's `<script>` section.

**Result**: All functions will be available globally and AI can access `machineGlobalState` directly.

---

## Integration Points

### 1. Serial Input Handler Integration

**Location in GemBot_Control_AI.html**: Lines 1100-1150 (where you parse serial messages)

**BEFORE**:
```javascript
if (line.includes('pX:')) {
    const xMatch = line.match(/pX:(\d+)/);
    if (xMatch) {
        x = parseInt(xMatch[1]);
        updateStatusBox('X', x);
    }
}
```

**AFTER**:
```javascript
if (line.includes('pX:') || line.includes('[DATA]')) {
    // Update hardware state in global system
    updateHardwareStateFromArduino(line);  // NEW LINE
    
    // Keep existing parsing for backward compatibility
    const xMatch = line.match(/pX:(\d+)/);
    if (xMatch) {
        x = parseInt(xMatch[1]);
        updateStatusBox('X', x);
    }
}
```

**Result**: Every time Arduino sends position, global state updates automatically.

---

### 2. Speed Slider Integration

**Location**: Where speed slider change event fires (search for `speedSlider.addEventListener`)

**BEFORE**:
```javascript
speedSlider.addEventListener('input', (e) => {
    motorSpeed = parseInt(e.target.value);
    speedDisplay.textContent = motorSpeed;
    // ... rest of code
});
```

**AFTER**:
```javascript
speedSlider.addEventListener('input', (e) => {
    motorSpeed = parseInt(e.target.value);
    machineGlobalState.hardware.motorSpeed = motorSpeed;  // NEW LINE - Sync state
    speedDisplay.textContent = motorSpeed;
    updateGuidanceState();  // NEW LINE - Update AI context
    // ... rest of code
});
```

**Result**: When user changes speed, AI knows about it instantly.

---

### 3. Mode Toggle Integration

**Location**: Where mode buttons change event fires (search for `btnModeStep.addEventListener`)

**BEFORE**:
```javascript
btnModeStep.addEventListener('click', () => {
    motorControlMode = 'step';
    // ... styling code
});
```

**AFTER**:
```javascript
btnModeStep.addEventListener('click', () => {
    motorControlMode = 'step';
    machineGlobalState.hardware.motorMode = 'step';  // NEW LINE - Sync state
    updateGuidanceState();  // NEW LINE - Update AI context
    // ... styling code
});
```

**Result**: When user toggles mode, AI guidance adapts.

---

### 4. AI Response Integration

**Location in GemBot_Control_AI.html**: In `getSmartContextResponse()` method (around line 2250)

**REPLACE the entire method with this**:

```javascript
getSmartContextResponse(query, speed, mode, posX, posY) {
    const lowerQuery = query.toLowerCase();
    
    // Get current context from global state (NOT from parameters)
    const context = getAIContextObject();
    
    // Connection/Arduino questions
    if (/connect|arduino|port|scan|usb/.test(lowerQuery)) {
        return `Connection: (1) Plug Arduino via USB. (2) Click SCAN to find ports. (3) Select correct port. (4) Click CONNECT. Machine will recover previous position automatically.`;
    }
    
    // Speed-related questions
    if (/speed|fast|slow|quick|adjust|increase|decrease/.test(lowerQuery)) {
        const speedText = context.currentSpeed === 1 ? 'slowest' :
                         context.currentSpeed === 2 ? 'slow' :
                         context.currentSpeed === 3 ? 'normal' :
                         context.currentSpeed === 4 ? 'fast' : 'fastest';
        
        return `SPEED CONTROL: Level 1-2 = Polishing (precise, gentle). Level 3 = Balanced work. Level 4-5 = Roughing (aggressive). 
                **Current speed: ${context.currentSpeed}/5 (${speedText})**.
                Phase: ${context.currentPhase || 'None selected'}
                Lap: ${context.lapType || 'Not set'} (${context.gritGrade || 'N/A'} grit)
                Higher speed = faster material removal but LESS CONTROL. Start slow when learning!`;
    }
    
    // Mode questions (Step vs Continuous)
    if (/mode|step|continuous|click|hold/.test(lowerQuery)) {
        return `TWO MODES: 
                • CONTINUOUS (hold button → smooth movement) = rough work, flowing cuts
                • STEP (press → single move) = precision work, control
                **Current mode: ${context.currentMode.toUpperCase()}**
                Phase: ${context.currentPhase || 'None selected'}
                ${context.currentMode === 'step' ? 'Perfect for accuracy.' : 'Good for sweeping cuts.'}`;
    }
    
    // Position/Movement questions
    if (/position|where|move|axis|x-axis|y-axis|location|coordinate/.test(lowerQuery)) {
        return `POSITIONING: GemBot has 4 axes:
                • X (left-right rotation)
                • Y (forward-back to lap)
                • Rotation (spin stone)
                • Index (switch laps)
                
                **Current position: X=${context.position.x}, Y=${context.position.y}, Rotation=${context.position.rotation}°, Index=${context.position.index}**
                Use buttons to move step-by-step or hold for continuous movement.`;
    }
    
    // Cutting phase/progress questions
    if (/progress|remaining|how many|facet|cut|cutting|phase|rough|polish|fine/.test(lowerQuery)) {
        if (context.totalFacets > 0) {
            return `CUTTING PROGRESS:
                    • Current facet: ${context.currentFacet} of ${context.totalFacets}
                    • Remaining: ${context.facetsRemaining} facets
                    • Phase: ${context.currentPhase || 'Not selected'}
                    • Estimated time: ${context.estimatedTimeRemaining}
                    • Stone: ${context.stoneType || 'Not selected'}
                    • Lap: ${context.lapType || 'Not set'} (${context.gritGrade || 'N/A'} grit)`;
        } else {
            return `CUTTING PHASES: (1) ROUGHING = Speed 4-5, CONTINUOUS, shape the form. 
                    (2) FINE CUTTING = Speed 2-3, STEP, refine angles. 
                    (3) POLISHING = Speed 1-2, STEP only, light touches. 
                    **Current speed ${context.currentSpeed}, mode ${context.currentMode}. What phase are you in?**`;
        }
    }
    
    // Stone-related questions
    if (/stone|diamond|ruby|sapphire|emerald|opal|lap|cutting stone|grit|wheel/.test(lowerQuery)) {
        if (context.stoneType) {
            const stone = stoneDatabase[context.stoneType.toLowerCase()];
            return `STONE: ${context.stoneType.toUpperCase()}
                    • Hardness: Mohs ${context.stoneHardness}
                    • Characteristics: ${context.stoneCharacteristics}
                    • Special handling: ${stone.requiresWater ? 'Requires water cooling' : 'Standard dry cutting'}
                    • Lap type: ${context.lapType || 'Not set'}
                    • Grit grade: ${context.gritGrade || 'Not set'}`;
        } else {
            return `STONES: Different stones need different speeds & techniques. Diamond = fastest. Ruby/Sapphire = medium. Softer stones = slower speeds. Tell me your stone TYPE and I'll guide the correct cutting phases & speeds.`;
        }
    }
    
    // "How" questions (procedural)
    if (/how|teach|guide|help|process|procedure|steps/.test(lowerQuery)) {
        if (/change.*stone|switch|replace|new stone/.test(lowerQuery)) {
            return `CHANGING STONE: (1) Click HOME to reset position. (2) Carefully remove current stone. (3) Position new stone on lap. (4) Use STEP mode, speed 1-3. (5) Fine-tune the position. (6) Proceed with appropriate cutting phase.`;
        } else if (/start|begin|first/.test(lowerQuery)) {
            return `GETTING STARTED: (1) CONNECT Arduino via USB. (2) Tell me your stone type. (3) Click HOME. (4) Use STEP mode with speed 1-3. (5) Practice positioning carefully. (6) Watch camera feed for guidance.`;
        } else {
            return `Tell me specifically: Are you asking about positioning? Cutting? Changing stones? Connecting? Speed control? Phase selection? I'll give detailed step-by-step guidance.`;
        }
    }
    
    // "Why" or explanation questions
    if (/why|explain|reason|because/.test(lowerQuery)) {
        if (/speed|slow/.test(lowerQuery)) {
            return `WHY SPEED MATTERS: 
                    • Lower speeds (1-2) = more control, precision, gentle
                    • Higher speeds (4-5) = faster material removal, less control, aggressive
                    • Soft stones = slower speeds
                    • Hard stones = can use higher speeds
                    • **Current speed: ${context.currentSpeed}** (${context.currentSpeed <= 2 ? 'precision work' : context.currentSpeed === 3 ? 'balanced work' : 'aggressive work'})`;
        } else if (/home|reset/.test(lowerQuery)) {
            return `WHY HOME MATTERS: HOME resets to origin (0,0,0). Prevents position drift. Establishes reference point. Essential before major changes. Always HOME when: connecting, changing stones, or powering down.`;
        } else if (/step|mode/.test(lowerQuery)) {
            return `WHY MODES MATTER: STEP = precision (each press = one move). CONTINUOUS = flowing (hold = smooth movement). STEP for accuracy. CONTINUOUS for rough work. **You're in ${context.currentMode} mode.**`;
        } else {
            return `I understand you're asking why. Tell me the specific topic and I'll explain the reasoning.`;
        }
    }
    
    // Catch remaining unmatched queries with contextual guidance
    if (query.length > 2) {
        return `I want to help! Could you clarify: Are you asking about (1) SPEED control? (2) MODES (step/continuous)? (3) POSITIONING? (4) CUTTING phases? (5) CONNECTING? (6) Your current STONE? (7) A specific PROBLEM? Tell me more!`;
    }
    
    return '';  // Only empty for very short or nonsense
}
```

**Result**: Every AI response now uses ACTUAL machine state, not defaults.

---

### 5. Initialize State When Connecting

**Location**: After successful Arduino connection (search for when connection status turns green)

**ADD these lines**:

```javascript
// After successful Arduino connection
machineGlobalState.hardware.connectionStatus = 'connected';
machineGlobalState.hardware.lastUpdate = Date.now();
console.log('✓ Machine state initialized - ready for AI guidance');
logMachineState();  // Log for debugging
```

**Result**: State system knows connection is active.

---

### 6. User Sets Stone Type

**Location**: When user selects a stone (design mode or before cutting)

**ADD these lines** when selection is made:

```javascript
// Example: User clicks "Diamond" button
function onStoneTypeSelected(stoneType) {
    machineGlobalState.touchScreen.stoneSelected = stoneType;
    updateGuidanceState();
    console.log('Stone selected:', stoneType);
    
    // AI can now give stone-specific guidance
    const aiContext = getAIContextObject();
    console.log('AI Context:', aiContext);
}
```

**Result**: AI gives stone-specific speed/mode/lap recommendations.

---

### 7. User Sets Lap Type

**Location**: When user changes lap or grit

**ADD these lines**:

```javascript
// Example: User puts in 220 grit lap
function onLapTypeChanged(lapType, gritGrade) {
    machineGlobalState.touchScreen.lapType = lapType;
    machineGlobalState.touchScreen.gritGrade = gritGrade;
    updateGuidanceState();
    console.log('Lap changed:', lapType, 'Grit:', gritGrade);
}
```

**Result**: AI references correct lap type in guidance.

---

### 8. User Completes Facet

**Location**: When detecting facet completion or user clicks "Next Facet" button

**ADD these lines**:

```javascript
// Example: User finishes first facet
function onFacetFinished() {
    markFacetComplete();
    const remaining = machineGlobalState.touchScreen.facetsRemaining;
    const timeLeft = formatTimeEstimate(machineGlobalState.touchScreen.estimatedTimeRemaining);
    
    console.log(`Facet complete! ${remaining} remaining. Est. time: ${timeLeft}`);
    
    // AI can now mention progress
    addMessage(`Great! You've completed facet ${machineGlobalState.touchScreen.currentFacet - 1}. ${remaining} facets remaining. Estimated time: ${timeLeft}`, 'assistant');
}
```

**Result**: AI tracks and celebrates progress.

---

## Testing Checklist

### Test 1: State Sync on Startup
- [ ] Page loads
- [ ] Run `logMachineState()` in console
- [ ] Shows default values (speed: 1, mode: continuous, position: 0,0)

### Test 2: Arduino Position Sync
- [ ] Connect Arduino
- [ ] Move stone in any axis (physical buttons on Nextion)
- [ ] Run `console.log(machineGlobalState.hardware.position)`
- [ ] Position matches Arduino display

### Test 3: Speed Sync
- [ ] Change speed slider to 4
- [ ] Run `console.log(machineGlobalState.hardware.motorSpeed)`
- [ ] Shows 4

### Test 4: Mode Sync
- [ ] Click Step mode button
- [ ] Run `console.log(machineGlobalState.hardware.motorMode)`
- [ ] Shows 'step'

### Test 5: AI Uses Real State
- [ ] Connect Arduino
- [ ] Set speed to 4, mode to continuous
- [ ] Ask AI: "What speed am I using?"
- [ ] AI responds: "Current speed: 4/5 (fastest)"
- [ ] NOT: "Current speed: 1/5" (default)

### Test 6: Stone Type Tracking
- [ ] Select diamond as stone type
- [ ] Ask AI: "What stone am I cutting?"
- [ ] AI responds: "Stone: DIAMOND" with properties
- [ ] Change to emerald
- [ ] Ask again
- [ ] AI responds: "Stone: EMERALD" with properties

### Test 7: Facet Progress
- [ ] Initialize design (Standard Round Brilliant = 58 facets)
- [ ] Complete first facet
- [ ] Ask AI: "How many facets left?"
- [ ] AI responds: "Remaining: 57 facets. Est. time: 2h 45m"

### Test 8: Phase-Aware Guidance
- [ ] Set speed 4, mode continuous
- [ ] Ask AI: "What lap should I use?"
- [ ] AI responds: "Use rough lap (60 grit)" (roughing phase detected)
- [ ] Set speed 2, mode step
- [ ] Ask same question
- [ ] AI responds: "Use fine lap (600 grit)" (fine cutting detected)

---

## Arduino Code Changes Required

For **full synchronization**, Arduino needs to send state every 100ms:

**Add to Arduino loop() function**:

```cpp
void broadcastMachineState() {
    static unsigned long lastBroadcast = 0;
    if (millis() - lastBroadcast >= 100) {  // Every 100ms
        lastBroadcast = millis();
        
        // Send current position and settings
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

// Call in loop():
void loop() {
    // ... existing code ...
    broadcastMachineState();  // Add this line
    // ... rest of loop ...
}
```

---

## Files to Modify

1. **GemBot_Control_AI.html** - Main integration
   - Add MACHINE_STATE_SYNC_CODE.js content
   - Update serial parser
   - Update speed/mode handlers
   - Replace getSmartContextResponse()

2. **Arduino code** - Optional but recommended
   - Add broadcastMachineState() function
   - Call in loop()

---

## Benefits After Integration

✅ **AI knows actual machine state** - Gives contextual responses  
✅ **AI tracks cutting progress** - Knows facets remaining, time left  
✅ **AI adapts to stone type** - Different guidance per stone  
✅ **AI matches phase recommendations** - Speed/mode/lap correct for phase  
✅ **AI detects phase automatically** - From speed/mode patterns  
✅ **AI provides estimates** - Time remaining based on actual data  
✅ **State persists** - Can recover if user refreshes page  

---

## Debugging

**Enable state logging**:
```javascript
logMachineState();  // Prints all state to console
```

**Check AI context**:
```javascript
console.log(getAIContextObject());  // What AI sees
```

**Monitor updates**:
```javascript
// In browser console, set breakpoint
debugger; updateGuidanceState();
```

---

**Status**: Ready to implement  
**Complexity**: Medium (mostly copy-paste)  
**Time estimate**: 2-3 hours  
**Testing time**: 1-2 hours
