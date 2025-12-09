# State Synchronization - Developer Quick Reference

## Problem Statement (One Line)
**Web interface uses hardcoded defaults (speed=1, mode=continuous, position=0,0) instead of real machine state, causing AI to give inaccurate guidance.**

---

## Solution Overview (One Line)
**Integrate machineGlobalState object that maintains real-time synchronization with Arduino hardware and Nextion menu, providing accurate context to AI.**

---

## The Three Systems

```
ARDUINO (Source of Truth)      NEXTION (Menu)           WEB (Coordinator)
├─ motorSpeedMultiplier 1-5    ├─ Menu Pages 1-18      ├─ machineGlobalState
├─ stepModeEnabled bool        ├─ Menu Changes         ├─ Serial Parser
├─ position X,Y,A,I            └─ Stage Tracking       ├─ AI System
└─ Broadcasts every 100ms          [MENU] page:17      └─ GUI Display
   [DATA] pX:... pY:...                                
```

---

## Four Key Functions to Know

### 1. updateHardwareStateFromArduino(line)
**What**: Parses Arduino serial messages and updates hardware state  
**Where**: Called from serial parser (line ~1100)  
**Input**: `"[DATA] pX:150 pY:200 pA:45 pI:32 spd:3 mod:step"`  
**Updates**: `machineGlobalState.hardware.*`  
**Example**:
```javascript
updateHardwareStateFromArduino("[DATA] pX:100 pY:200 pA:0 pI:0 spd:4 mod:continuous");
// Now: motorSpeed=4, motorMode=continuous, position=(100,200)
```

### 2. getAIContextObject()
**What**: Returns complete machine state as object  
**Where**: Called from getSmartContextResponse()  
**Returns**: Current values (speed, mode, position, phase, stone, progress)  
**Example**:
```javascript
const ctx = getAIContextObject();
if (ctx.currentSpeed >= 4) { /* high speed mode */ }
```

### 3. detectCuttingPhase()
**What**: Auto-detects phase from speed + mode pattern  
**Where**: Called after speed/mode changes  
**Logic**: 
- Speed 4-5 + Continuous = Roughing
- Speed 2-3 + Step = Fine Cutting
- Speed 1-2 + Step = Polishing
**Example**:
```javascript
detectCuttingPhase();
// If speed=4 & continuous → phase="roughing"
```

### 4. getSmartContextResponse(query)
**What**: AI response method (MUST be rewritten)  
**Where**: GemBotAI class, around line 2250  
**Key Change**: Must call getAIContextObject() instead of using defaults  
**Old**:
```javascript
getSmartContextResponse(query, speed, mode, posX, posY) {
    // Uses passed parameters which are defaults!
}
```
**New**:
```javascript
getSmartContextResponse(query) {
    const context = getAIContextObject();  // Gets REAL state
    if (/speed/.test(query)) {
        return `Current speed: ${context.currentSpeed}...`;  // Real value!
    }
}
```

---

## Three Integration Points (Must Do These)

### Integration Point 1: Add Code to HTML
```html
<script>
    // Add entire MACHINE_STATE_SYNC_CODE.js here
    // (around line 1600, before class GemBotAI)
</script>
```

### Integration Point 2: Update Serial Parser
```javascript
// In serial input handler (~line 1100)
if (line.includes('[DATA]') || line.includes('pX:')) {
    updateHardwareStateFromArduino(line);  // ADD THIS LINE
    // Keep existing code...
}
```

### Integration Point 3: Replace getSmartContextResponse()
```javascript
// In class GemBotAI (~line 2250)
// DELETE old method, REPLACE with new version
// NEW version MUST call: const context = getAIContextObject();
```

---

## Three Browser Console Tests

### Test 1: State Object Exists
```javascript
typeof machineGlobalState === 'object'
// Must return: true
```

### Test 2: AI Gets Real Context
```javascript
const ctx = getAIContextObject();
ctx.currentSpeed > 0  // Check has real value, not undefined
ctx.currentMode === 'step' || ctx.currentMode === 'continuous'
// Must both be true
```

### Test 3: AI Uses Context
```javascript
// Set speed to 4
machineGlobalState.hardware.motorSpeed = 4;

// Ask AI
const response = gemBotAI.getSmartContextResponse("What speed am I using?");
response.includes("4")  // MUST be true (not "1"!)
```

---

## Arduino Changes (Optional but Recommended)

### Add This Function (15 lines)
```cpp
void broadcastMachineState() {
    static unsigned long lastBroadcast = 0;
    if (millis() - lastBroadcast >= 100) {
        lastBroadcast = millis();
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

### Call in loop() (1 line)
```cpp
void loop() {
    // ... existing code ...
    broadcastMachineState();  // ADD THIS
    // ... rest ...
}
```

---

## State Object Structure

```javascript
machineGlobalState = {
  hardware: {
    connectionStatus: "connected",
    motorSpeed: 4,        // 1-5
    motorMode: "step",    // "step" or "continuous"
    motorStepSize: 5,     // number of steps
    position: {
      x: 150,             // current X position
      y: 200,             // current Y position
      rotation: 45,       // rotation angle
      index: 32           // index position
    },
    lastUpdate: 1234567890
  },
  touchScreen: {
    stoneSelected: "diamond",
    lapType: "copper",
    gritGrade: 600,
    designSelected: "standard_rb",
    shapeSelected: "round",
    currentFacet: 15,
    totalFacets: 58,
    facetsRemaining: 43,
    detectedPhase: "fine_cutting",
    estimatedTimeRemaining: "2h 15m",
    // ... more fields
  }
}
```

---

## Quick Checklist Before Starting

- [ ] GemBot_Control_AI.html open and ready to edit
- [ ] MACHINE_STATE_SYNC_CODE.js copied to clipboard
- [ ] Arduino file open (if doing Arduino changes)
- [ ] Browser DevTools open for testing
- [ ] Backup of GemBot_Control_AI.html created
- [ ] Serial Monitor open (for Arduino testing)

---

## Success = AI Responds Accurately

### BEFORE (Wrong)
```
User: "What speed should I use?"
AI: "Use speed 1-2 for polishing..."
Reality: User has speed set to 4, doing roughing work
Result: ❌ WRONG
```

### AFTER (Correct)
```
User: "What speed should I use?"
AI: "You're at speed 4/5 (fastest). Perfect for aggressive work."
Reality: User has speed set to 4, doing roughing work
Result: ✅ CORRECT
```

---

## Four Things That Will Break If Not Done Right

1. **Don't include MACHINE_STATE_SYNC_CODE.js**
   - Error: `ReferenceError: getAIContextObject is not defined`
   - Fix: Copy entire file to HTML before class GemBotAI

2. **Don't update getSmartContextResponse()**
   - Error: AI still says "speed 1" when speed is 4
   - Fix: Replace method to call getAIContextObject()

3. **Don't call updateHardwareStateFromArduino()**
   - Error: State never updates from Arduino
   - Fix: Add call in serial input handler

4. **Arduino not broadcasting state**
   - Error: Web shows "position 0,0" when moving
   - Fix: Add broadcastMachineState() to Arduino loop()

---

## Debugging Commands (Run in Console)

```javascript
// Show all state
logMachineState();

// Show what AI sees
console.log(getAIContextObject());

// Test Arduino parsing
updateHardwareStateFromArduino("[DATA] pX:100 pY:200 pA:0 pI:0 spd:4 mod:continuous");

// Check if functions exist
typeof updateHardwareStateFromArduino === 'function'  // true?
typeof getAIContextObject === 'function'              // true?
typeof detectCuttingPhase === 'function'              // true?

// Manually trigger AI
gemBotAI.getSmartContextResponse("What speed am I using?")

// Check current state
machineGlobalState.hardware.motorSpeed
machineGlobalState.hardware.motorMode
```

---

## Files You Need

| File | Purpose | Where |
|------|---------|-------|
| MACHINE_STATE_SYNC_CODE.js | Implementation code | Copy to HTML |
| STATE_SYNC_INTEGRATION_GUIDE.md | Detailed steps | Reference while coding |
| ARDUINO_STATE_BROADCASTING.md | Arduino changes | Copy snippets |
| STATE_SYNC_TEST_CASES.md | Validation | Run after integration |
| This file | Quick reference | Keep open |

---

## Time Breakdown

| Task | Time |
|------|------|
| Read documentation | 30 min |
| Copy code to HTML | 15 min |
| Update serial parser | 15 min |
| Update getSmartContextResponse() | 30 min |
| Test in browser | 30 min |
| Arduino changes | 20 min |
| Full test suite | 60 min |
| **Total** | **3 hours** |

---

## One-Sentence Summary

**Replace hardcoded defaults with real-time state synchronization so AI guidance is accurate.**

---

## Status

✅ Code ready  
✅ Documentation complete  
✅ Tests designed  
⏳ Awaiting implementation

**Ready to start?** Begin with STATE_SYNC_INTEGRATION_GUIDE.md

