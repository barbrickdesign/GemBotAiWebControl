# State Synchronization - Test Cases

## Pre-Testing Setup

**Requirements**:
1. GemBot_Control_AI.html with MACHINE_STATE_SYNC_CODE.js integrated
2. Arduino code with broadcastMachineState() function
3. Both devices connected (Arduino via USB, web interface loaded)
4. Browser DevTools Console open (F12)

---

## Test Suite 1: Initial State Validation

### Test 1.1: State Object Exists
**Expected**: machineGlobalState object initialized on page load

```javascript
// Run in console:
typeof machineGlobalState === 'object'
// Expected result: true

machineGlobalState.hardware.motorSpeed
// Expected result: 1 (default)

machineGlobalState.hardware.motorMode
// Expected result: "continuous" (default)

machineGlobalState.hardware.position.x
// Expected result: 0 (default)
```

**Pass Criteria**: All properties accessible, default values correct

---

### Test 1.2: AI Context Object Callable
**Expected**: getAIContextObject() returns properly formatted context

```javascript
// Run in console:
const ctx = getAIContextObject();
console.log(ctx);

// Expected output:
{
  connectionStatus: "disconnected",
  currentSpeed: 1,
  currentMode: "continuous",
  position: { x: 0, y: 0, rotation: 0, index: 0 },
  currentPhase: "none",
  stoneType: null,
  stoneHardness: null,
  lapType: null,
  gritGrade: null,
  totalFacets: 0,
  facetsRemaining: 0,
  estimatedTimeRemaining: "0m"
}
```

**Pass Criteria**: All fields present, defaults are reasonable

---

### Test 1.3: All Update Functions Exist
**Expected**: All 8 state functions are callable

```javascript
// Run in console - should not error:
typeof updateHardwareStateFromArduino === 'function'  // true
typeof updateMenuModeFromTouchScreen === 'function'   // true
typeof detectCuttingPhase === 'function'               // true
typeof updateGuidanceState === 'function'              // true
typeof initializeDesign === 'function'                 // true
typeof markFacetComplete === 'function'                // true
typeof setLapConfiguration === 'function'              // true
typeof updateTimeRemaining === 'function'              // true
```

**Pass Criteria**: All functions callable, no syntax errors

---

## Test Suite 2: Hardware State Synchronization

### Test 2.1: Arduino Connection Detection
**Expected**: When Arduino connects, state updates

**Steps**:
1. Open page with Arduino NOT connected
2. Run: `logMachineState()` (should show "connectionStatus: disconnected")
3. Connect Arduino via USB
4. Click SCAN then CONNECT in web interface
5. Run: `logMachineState()`

**Expected Result**:
```
connectionStatus: "connected"
lastUpdate: [recent timestamp]
```

**Pass Criteria**: connectionStatus changes from "disconnected" to "connected"

---

### Test 2.2: Position Sync from Arduino
**Expected**: When Arduino position changes, web state updates

**Steps**:
1. Arduino connected
2. Record: `machineGlobalState.hardware.position.x`
3. Using Nextion touch screen, move X axis (press X+ or X- buttons 5 times)
4. Record: `machineGlobalState.hardware.position.x`

**Expected Result**: Second reading > First reading (position increased)

**Pass Criteria**: Position value changed to match Arduino movement

---

### Test 2.3: Speed Sync from Slider
**Expected**: When user changes speed slider, global state updates

**Steps**:
1. Record initial: `machineGlobalState.hardware.motorSpeed`
2. Move speed slider from 1 to 4
3. Record new value: `machineGlobalState.hardware.motorSpeed`

**Expected Result**: Value changes from 1 to 4

**Pass Criteria**: Speed value matches slider position

---

### Test 2.4: Mode Sync from Toggle
**Expected**: When user toggles mode, global state updates

**Steps**:
1. Record: `machineGlobalState.hardware.motorMode` (should be "continuous")
2. Click "Step Mode" button
3. Record: `machineGlobalState.hardware.motorMode`

**Expected Result**: Value changes to "step"

**Pass Criteria**: Mode matches button state

---

### Test 2.5: Rapid State Changes
**Expected**: State updates don't miss rapid changes

**Steps**:
1. Rapidly click X+ button 20 times
2. Record final position: `machineGlobalState.hardware.position.x`
3. Compare to Nextion display position

**Expected Result**: Web position matches Nextion position (within 1-2 steps)

**Pass Criteria**: No position values skipped

---

## Test Suite 3: Phase Detection

### Test 3.1: Roughing Phase Detection
**Expected**: Speed 4-5 + Continuous mode = Roughing phase

**Steps**:
1. Set speed slider to 4
2. Ensure mode is CONTINUOUS
3. Run: `detectCuttingPhase()`
4. Run: `console.log(machineGlobalState.touchScreen.detectedPhase)`

**Expected Result**: "roughing"

**Pass Criteria**: Phase matches speed/mode pattern

---

### Test 3.2: Fine Cutting Phase Detection
**Expected**: Speed 2-3 + Step mode = Fine cutting phase

**Steps**:
1. Set speed slider to 3
2. Click Step Mode button
3. Run: `detectCuttingPhase()`
4. Run: `console.log(machineGlobalState.touchScreen.detectedPhase)`

**Expected Result**: "fine_cutting"

**Pass Criteria**: Phase matches speed/mode pattern

---

### Test 3.3: Polishing Phase Detection
**Expected**: Speed 1-2 + Step mode = Polishing phase

**Steps**:
1. Set speed slider to 1
2. Ensure mode is STEP
3. Run: `detectCuttingPhase()`
4. Run: `console.log(machineGlobalState.touchScreen.detectedPhase)`

**Expected Result**: "polishing"

**Pass Criteria**: Phase matches speed/mode pattern

---

## Test Suite 4: Stone Database

### Test 4.1: Stone Properties Load
**Expected**: Stone data accessible and correct

```javascript
// Run in console:
stoneDatabase['diamond']
// Expected:
{
  hardness: 10,
  color: 'various',
  characteristics: 'Hardest natural mineral. Excellent polish.',
  requiresWater: false,
  speedRange: [3, 5],
  bestLap: 'copper',
  polishingTime: 1.0
}
```

**Pass Criteria**: Stone properties load correctly

---

### Test 4.2: Stone Selection Updates Context
**Expected**: Selecting stone updates AI context

**Steps**:
1. Run: `initializeDesign('standard_rb', 'diamond', 'round')`
2. Run: `getAIContextObject()`

**Expected Result**:
```
stoneType: "diamond"
stoneHardness: 10
totalFacets: 58
```

**Pass Criteria**: Stone data reflected in AI context

---

### Test 4.3: Emerald Special Handling
**Expected**: Emerald shows water requirement

**Steps**:
1. Run: `const ctx = getAIContextObject(); ctx.stoneType = 'emerald'; updateGuidanceState();`
2. Ask AI: "What precautions do I need for this stone?"
3. AI should mention water/cooling

**Expected Result**: AI mentions "Requires water cooling" for emerald

**Pass Criteria**: Stone-specific guidance appears

---

## Test Suite 5: AI Context Integration

### Test 5.1: AI Uses Real Speed
**Expected**: AI response mentions actual speed, not default

**Setup**:
1. Set speed slider to 4
2. Set mode to CONTINUOUS
3. Ask AI: "What speed am I using?"

**Expected Response**: Should say "speed: 4/5" or "fastest"

**FAIL Condition**: AI says "speed: 1" or "slowest"

**Pass Criteria**: AI uses actual speed value

---

### Test 5.2: AI Uses Real Mode
**Expected**: AI response mentions actual mode

**Setup**:
1. Click Step Mode button
2. Ask AI: "What mode am I in?"

**Expected Response**: Should mention "STEP" mode

**FAIL Condition**: AI says "continuous" or ignores mode

**Pass Criteria**: AI uses actual mode value

---

### Test 5.3: AI Uses Real Position
**Expected**: AI response mentions actual position

**Setup**:
1. Move X axis to position 100 (using buttons)
2. Ask AI: "What is my current position?"

**Expected Response**: Should mention X=100 in response

**FAIL Condition**: AI says "position: 0,0"

**Pass Criteria**: AI uses actual position values

---

### Test 5.4: Speed Question Contextual
**Expected**: AI adapts speed explanation to current state

**Test A - High Speed**:
- Set speed to 5, mode continuous
- Ask: "Should I go faster?"
- AI should mention: "Already at maximum"

**Test B - Low Speed**:
- Set speed to 1, mode step
- Ask: "Can I go faster?"
- AI should mention: "Can increase for different work"

**Pass Criteria**: Response adapts to current state

---

### Test 5.5: Mode Question Contextual
**Expected**: AI adapts mode explanation to current state

**Test A - Step Mode**:
- Select Step mode
- Ask: "What mode am I in?"
- AI should confirm: "STEP mode"

**Test B - Continuous Mode**:
- Select Continuous mode
- Ask: "What mode am I in?"
- AI should confirm: "CONTINUOUS mode"

**Pass Criteria**: Response matches actual mode

---

## Test Suite 6: Design & Facets

### Test 6.1: Design Initialization
**Expected**: Design setup calculates correct facet count

```javascript
// Run:
initializeDesign('standard_rb', 'diamond', 'round');

// Check:
machineGlobalState.touchScreen.totalFacets
// Expected: 58

machineGlobalState.touchScreen.facetsRemaining
// Expected: 58

machineGlobalState.touchScreen.currentFacet
// Expected: 1
```

**Pass Criteria**: All facet counts correct

---

### Test 6.2: Facet Progress Tracking
**Expected**: Completing facets updates remaining count

**Steps**:
1. Initialize design (58 facets)
2. Run 5 times: `markFacetComplete()`
3. Check: `machineGlobalState.touchScreen.facetsRemaining`

**Expected Result**: 53 (58 - 5)

**Pass Criteria**: Facet count decrements correctly

---

### Test 6.3: Time Estimation Updates
**Expected**: Time remaining decreases as facets complete

**Steps**:
1. Initialize design
2. Record: `machineGlobalState.touchScreen.estimatedTimeRemaining`
3. Complete 10 facets: `markFacetComplete()` x 10
4. Record: `machineGlobalState.touchScreen.estimatedTimeRemaining`

**Expected Result**: Second time is less than first time

**Pass Criteria**: Time remaining decreases appropriately

---

## Test Suite 7: Lap & Grit Configuration

### Test 7.1: Lap Configuration Sets Correctly
**Expected**: Setting lap updates global state

```javascript
// Run:
setLapConfiguration('copper', 220);

// Check:
machineGlobalState.touchScreen.lapType
// Expected: "copper"

machineGlobalState.touchScreen.gritGrade
// Expected: 220
```

**Pass Criteria**: Lap type and grit stored correctly

---

### Test 7.2: AI References Lap Type
**Expected**: AI mentions configured lap in responses

**Setup**:
1. Run: `setLapConfiguration('copper', 600)`
2. Ask AI: "What lap should I use?"

**Expected Response**: Should mention "copper lap" and "600 grit"

**Pass Criteria**: AI references actual lap configuration

---

## Test Suite 8: Complete Workflow

### Test 8.1: Full Cutting Workflow
**Scenario**: User cuts a diamond

**Steps**:
1. Connect Arduino (verify connection status)
2. Initialize design: `initializeDesign('standard_rb', 'diamond', 'round')`
3. Set speed to 5, mode to CONTINUOUS
4. Ask AI: "What lap should I use?" → AI says "60 grit rough lap" (roughing phase)
5. Complete 10 facets
6. Ask AI: "How many facets remain?" → AI says "48 remaining"
7. Set speed to 2, mode to STEP
8. Ask AI: "What phase am I in now?" → AI says "fine cutting phase"
9. Set lap to 220 grit
10. Ask AI: "Should I change my technique?" → AI mentions step mode, fine lap

**Expected Result**: Every response is contextually accurate throughout

**Pass Criteria**: AI guidance is accurate at every step

---

### Test 8.2: Stone-Specific Workflow
**Scenario**: User switches stones

**Setup**:
1. Initialize diamond (speed 5, continuous)
2. Ask AI: "Can I use maximum speed?" → AI says "Yes, diamond is hard"
3. Change to emerald
4. Ask AI: "Can I use maximum speed?" → AI says "No, emerald is fragile"
5. Set lap to fine (600) → AI should adjust guidance

**Expected Result**: AI guidance changes based on stone type

**Pass Criteria**: Stone-specific recommendations accurate

---

## Test Suite 9: Console Debugging

### Test 9.1: State Logging Function
**Expected**: logMachineState() produces readable output

```javascript
// Run:
logMachineState();

// Expected output in console:
=== MACHINE STATE ===
HARDWARE:
  Connection: connected
  Speed: 4
  Mode: step
  Position: X=150, Y=200, Angle=45°, Index=32
TOUCH SCREEN:
  Stone: diamond
  Design: standard_rb
  Phase: fine_cutting
  Lap: copper, 600 grit
  Progress: Facet 15 of 58 (43 remaining)
  Time Est: 2h 15m
```

**Pass Criteria**: Output shows all current state clearly

---

### Test 9.2: AI Context Logging
**Expected**: AI context object shows what AI sees

```javascript
// Run:
console.log(getAIContextObject());

// Check that it shows:
- Current speed
- Current mode
- Current position
- Current stone
- Current phase
- Time remaining
```

**Pass Criteria**: AI context contains all required fields

---

## Summary Table

| Test Suite | Focus | Count | Critical? |
|-----------|-------|-------|-----------|
| Suite 1 | Initialization | 3 | YES |
| Suite 2 | Hardware Sync | 5 | YES |
| Suite 3 | Phase Detection | 3 | YES |
| Suite 4 | Stone Database | 3 | NO |
| Suite 5 | AI Integration | 5 | YES |
| Suite 6 | Design/Facets | 3 | YES |
| Suite 7 | Lap/Grit | 2 | YES |
| Suite 8 | Complete Workflows | 2 | YES |
| Suite 9 | Debugging | 2 | NO |

**Critical Tests** (must pass): Suites 1, 2, 3, 5, 6, 7, 8
**Total Tests**: 28
**Estimated Time**: 3-4 hours

---

## Pass/Fail Criteria

### PASS: All Critical Tests Pass
- Initialization works
- Hardware state syncs
- Phase detection accurate
- AI uses real state (not defaults)
- Facet tracking works
- Lap/grit tracking works
- Complete workflows accurate

### FAIL: Any Critical Test Fails
- If initialization fails, nothing works
- If hardware sync fails, AI context wrong
- If AI uses defaults, guidance inaccurate
- If facet tracking fails, progress not shown

---

## Regression Testing

After each change, run these quick tests:

**Quick Check 1**: 
```javascript
typeof getAIContextObject === 'function' && 
machineGlobalState !== undefined
// Must be true
```

**Quick Check 2**: 
- Move Arduino position
- Verify: `machineGlobalState.hardware.position` updates

**Quick Check 3**: 
- Ask AI a speed question
- Verify: AI mentions actual speed, not "1"

**Quick Check 4**: 
- Set speed=4, mode=continuous
- Verify: detectCuttingPhase() returns "roughing"

---

## Troubleshooting Test Failures

**If Suite 1 fails**: MACHINE_STATE_SYNC_CODE.js not included in HTML

**If Suite 2 fails**: Arduino serial messages not being parsed

**If Suite 3 fails**: Phase detection logic has incorrect thresholds

**If Suite 5 fails**: getSmartContextResponse() not calling getAIContextObject()

**If Suite 6 fails**: Design database not loading or facet math wrong

**If Suite 7 fails**: setLapConfiguration() not updating global state

**If Suite 8 fails**: Multiple integration points broken, test suites 2-7 first

