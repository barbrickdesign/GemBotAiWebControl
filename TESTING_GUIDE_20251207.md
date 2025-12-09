# GemBot Motor Control - Testing Guide
**Date:** 2025-12-07  
**Status:** Ready for Hardware Testing  
**Previous Session:** Timeout fix, speed/mode/step framework implementation  
**Current Session:** Web UI controls added, command mappings fixed  

---

## 🎯 What Was Just Fixed

### 1. ✅ Motor Timeout (CRITICAL FIX)
- **Before:** 5000ms (5 seconds) - Motors would stop after 5 seconds during continuous operation
- **After:** 60000ms (60 seconds) - Allows 60+ seconds of continuous motion
- **File:** `joystickRevert_copy_20251206152907.ino` line 176
- **Impact:** Continuous mode now works without interruption

### 2. ✅ Speed Control Framework
- **What:** Added variable speed 1-5 levels with motorSpeedMultiplier
- **How:** Slider in web interface sends `s1`, `s2`, `s3`, `s4`, `s5` commands
- **Arduino Response:** Multiplies all motor step counts by the speed level
- **File:** Web UI has new speed slider (lines 671-678)
- **Impact:** Slow=1 step per cycle, Fast=5 steps per cycle

### 3. ✅ Mode Toggle (STEP vs CONTINUOUS)
- **What:** Added stepModeEnabled boolean for selecting control mode
- **How:** Web buttons send `y` command to toggle between modes
- **Current Mode:** Defaults to CONTINUOUS (hold button = motion)
- **File:** Mode toggle buttons now send `y` command
- **Impact:** Can switch between continuous hold and step-by-step control

### 4. ✅ Step Size Control
- **What:** Added stepCount variable (1-70 steps per command)
- **How:** Slider in web interface sends `n1` through `n70` commands
- **File:** Web UI step slider sends `n` + value (lines 703-708)
- **Impact:** Can control how many steps each button press executes

### 5. ✅ Direction Mapping Fix
- **What:** X LEFT/RIGHT were backwards in web interface
- **Fixed:** 
  - btnXLeft now sends 'a' (was 'd') ← X LEFT
  - btnXRight now sends 'd' (was 'a') ← X RIGHT
- **File:** Lines 2153-2156 and HTML buttons fixed
- **Impact:** Directions now match Arduino expectations

### 6. ✅ Web UI Controls Complete
- Added speed slider (1-5 with labels: Slowest/Slow/Normal/Fast/Fastest)
- Mode toggle buttons now send `y` command to Arduino
- Step size slider now sends `n` + value command to Arduino
- All controls properly integrated with command sending

---

## 📋 Testing Checklist

### PHASE 1: Web Interface Testing (Before Hardware)
```
□ Open GemBot_Web_Control_DualMode.html in browser
□ Connect to Arduino serial server (if applicable)
□ Check that all UI elements appear correctly:
  □ Speed slider (1-5) visible
  □ Mode buttons (CONTINUOUS/STEP) visible
  □ Step size slider (1-70) visible
  □ Direction buttons present
```

### PHASE 2: Serial Command Verification
Open Arduino Serial Monitor (Tools > Serial Monitor) at 115200 baud:

```
Test: Adjust speed slider to different levels
Expected Serial Output:
  [SPEED] Motor speed multiplier set to: 1
  [SPEED] Motor speed multiplier set to: 2
  [SPEED] Motor speed multiplier set to: 3
  ... etc

Test: Click mode toggle button (STEP mode)
Expected Serial Output:
  [MODE] STEP mode enabled - Click for N steps
  
Test: Click mode toggle button (CONTINUOUS mode)  
Expected Serial Output:
  [MODE] CONTINUOUS mode enabled - Hold for motion

Test: Adjust step size slider
Expected Serial Output:
  [MOTOR CONTROL] Step size set to: 5
  [MOTOR CONTROL] Step size set to: 20
  ... etc
```

### PHASE 3: Continuous Mode Testing
**Prerequisites:** Motor timeout is now 60 seconds (was 5 seconds)

1. **Test: Hold X RIGHT button for 3+ seconds**
   - Expected: Smooth continuous rightward motion
   - Expected: NO timeout interruption
   - Release button
   - Expected: Motors stop immediately
   - ✓ If works: Note "CONTINUOUS MODE WORKING"

2. **Test: Hold Y UP button for 2+ seconds**
   - Expected: Smooth continuous upward motion
   - Expected: Motors engaged for full hold duration
   - Release button
   - Expected: Motors stop immediately
   - ✓ If works: Note "Y AXIS CONTINUOUS WORKING"

3. **Test: Hold P CW button for 2+ seconds**
   - Expected: Smooth continuous rotation
   - Expected: Motors engaged (no 5-sec timeout)
   - Release button
   - Expected: Motors stop immediately
   - ✓ If works: Note "P AXIS CONTINUOUS WORKING"

4. **Test: All 6 directions for continuous mode**
   - X LEFT, X RIGHT, Y UP, Y DOWN, P CW, P CCW
   - Each: Hold 2+ seconds, verify smooth motion, verify stop on release
   - ✓ All 6 passing?

### PHASE 4: Speed Control Testing
**Setup:** Put system in CONTINUOUS mode

1. **Test: Speed Level 1 (Slowest)**
   - Set speed slider to 1
   - Hold X RIGHT for 2 seconds
   - Expected: Very slow rightward motion (1 step per 50ms = slowest)
   - ✓ Noticeably slow?

2. **Test: Speed Level 5 (Fastest)**
   - Set speed slider to 5
   - Hold X RIGHT for 2 seconds
   - Expected: Fast rightward motion (5 steps per 50ms = 5x faster)
   - ✓ Noticeably faster than level 1?

3. **Test: Speed progression 1→5**
   - Set speed to 1: Hold button, estimate motion rate
   - Set speed to 2: Hold button, should be ~2x faster
   - Set speed to 3: Hold button, should be ~3x faster
   - Set speed to 4: Hold button, should be ~4x faster
   - Set speed to 5: Hold button, should be ~5x faster (fastest)
   - ✓ Linear speed increase?

4. **Test: Speed in all directions**
   - Y UP, Y DOWN, P CW, P CCW with different speed levels
   - ✓ All respond to speed changes?

### PHASE 5: Step Mode Testing
**Setup:** Switch to STEP mode in web interface

1. **Test: Single step (Step=1)**
   - Set step slider to 1
   - Click X RIGHT button once
   - Expected: Motors move exactly 1 step, then stop
   - Expected: NOT continuous motion
   - Expected: NOT multi-step movement
   - ✓ Exactly 1 step?

2. **Test: Multi-step (Step=5)**
   - Set step slider to 5
   - Click X RIGHT button once
   - Expected: Motors move exactly 5 steps, then stop automatically
   - Expected: Smooth execution (100ms per step pattern)
   - ✓ Exactly 5 steps?

3. **Test: Step size progression**
   - Set step=1: Click, count steps (should be 1)
   - Set step=3: Click, count steps (should be 3)
   - Set step=10: Click, count steps (should be 10)
   - Set step=20: Click, count steps (should be 20)
   - Set step=70: Click, count steps (should be 70)
   - ✓ All accurate?

4. **Test: Step mode with speed control**
   - Set step=5, speed=1 (slow)
   - Click X RIGHT: Should move 5 steps slowly
   - Set speed=5 (fast)
   - Click X RIGHT: Should move 5 steps quickly
   - ✓ Speed affects step mode?

5. **Test: All directions in step mode**
   - Test each of 6 directions (X LEFT/RIGHT, Y UP/DOWN, P CW/CCW)
   - Each direction with different step counts (1, 5, 10)
   - ✓ All 6 directions working in step mode?

### PHASE 6: Mode Switching Under Motion
1. **Test: Switch from CONTINUOUS to STEP during motion**
   - Hold X RIGHT button (in CONTINUOUS mode)
   - While motor is moving, click STEP mode button
   - Expected: Motor continues, then stops when button released
   - Expected: No glitching or erratic behavior
   - ✓ Clean transition?

2. **Test: Switch from STEP to CONTINUOUS**
   - Do a step sequence (e.g., 5 steps)
   - While stepping completes, switch to CONTINUOUS
   - Expected: Mode switches cleanly
   - ✓ No errors?

### PHASE 7: Emergency Stop Testing
1. **Test: E-STOP during continuous motion**
   - Start continuous motion (hold button)
   - Click E-STOP button
   - Expected: Motors stop immediately
   - Expected: Command 'u' sent to Arduino
   - ✓ Stops immediately?

2. **Test: E-STOP during step sequence**
   - Start a long step sequence (e.g., 50 steps)
   - Click E-STOP mid-sequence
   - Expected: Motors stop immediately
   - Expected: Step sequence aborts
   - ✓ Clean abort?

---

## 📊 Test Results Template

```
═══════════════════════════════════════════════════════════
GemBot Motor Control Test Results - 2025-12-07
═══════════════════════════════════════════════════════════

CONTINUOUS MODE:
  X LEFT (hold 3 sec)    [PASS] [FAIL]  Smooth? Y/N
  X RIGHT (hold 3 sec)   [PASS] [FAIL]  Smooth? Y/N
  Y UP (hold 3 sec)      [PASS] [FAIL]  Smooth? Y/N
  Y DOWN (hold 3 sec)    [PASS] [FAIL]  Smooth? Y/N
  P CW (hold 3 sec)      [PASS] [FAIL]  Smooth? Y/N
  P CCW (hold 3 sec)     [PASS] [FAIL]  Smooth? Y/N

SPEED CONTROL (CONTINUOUS):
  Speed 1 (slowest)      [PASS] [FAIL]  Slow enough? Y/N
  Speed 2                [PASS] [FAIL]  2x speed? Y/N
  Speed 3                [PASS] [FAIL]  3x speed? Y/N
  Speed 4                [PASS] [FAIL]  4x speed? Y/N
  Speed 5 (fastest)      [PASS] [FAIL]  Fast enough? Y/N

STEP MODE:
  Step=1, click          [PASS] [FAIL]  Exact 1 step? Y/N
  Step=5, click          [PASS] [FAIL]  Exact 5 steps? Y/N
  Step=10, click         [PASS] [FAIL]  Exact 10 steps? Y/N
  Step=20, click         [PASS] [FAIL]  Exact 20 steps? Y/N
  Step=50, click         [PASS] [FAIL]  Exact 50 steps? Y/N

STEP MODE SPEED:
  Step=5, Speed=1        [PASS] [FAIL]  Slow steps? Y/N
  Step=5, Speed=5        [PASS] [FAIL]  Fast steps? Y/N

EMERGENCY STOP:
  E-STOP during motion   [PASS] [FAIL]  Immediate stop? Y/N
  E-STOP during steps    [PASS] [FAIL]  Clean abort? Y/N

ISSUES FOUND:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

NEXT STEPS:
_______________________________________________
_______________________________________________
```

---

## 🔧 Expected Arduino Serial Messages

### At Startup
```
[SYSTEM] GemBot Motor Control System Initialized
[MOTOR TIMEOUT] Set to: 60000 ms
[SYSTEM] Waiting for commands...
```

### Speed Control
```
[SPEED] Motor speed multiplier set to: 1
[SPEED] Motor speed multiplier set to: 2
[SPEED] Motor speed multiplier set to: 3
[SPEED] Motor speed multiplier set to: 4
[SPEED] Motor speed multiplier set to: 5
```

### Mode Toggle
```
[MODE] CONTINUOUS mode enabled - Hold for motion
[MODE] STEP mode enabled - Click for N steps
```

### Step Size
```
[MOTOR CONTROL] Step size set to: 1
[MOTOR CONTROL] Step size set to: 5
[MOTOR CONTROL] Step size set to: 10
[MOTOR CONTROL] Step size set to: 20
[MOTOR CONTROL] Step size set to: 70
```

### Motor Movement
```
[MOTOR START] Motors engaged
[MOTOR COMMAND] X axis moving LEFT
[MOTOR COMMAND] Y axis moving UP
[MOTOR COMMAND] P axis rotating CW
[MOTOR STOP] All motors stopped (STOP command)
```

---

## 🛠️ If Tests Fail

### Symptom: "No serial messages appearing"
1. Check Arduino serial connection (baud 115200)
2. Check that Arduino code was uploaded successfully
3. Look for [ERROR] messages in serial monitor

### Symptom: "Motors don't move when button pressed"
1. Check motor connections (power, stepper driver)
2. Verify Arduino received command in serial monitor
3. Check MOTOR_TIMEOUT value (should be 60000, not 5000)
4. Verify motor flag variables are working

### Symptom: "Speed changes don't affect motion"
1. Verify speed slider sends 's' commands to Arduino
2. Check serial monitor for [SPEED] messages
3. Verify motorSpeedMultiplier is being applied in motor loop
4. Check that motor steps use: `motorSpeed * motorSpeedMultiplier`

### Symptom: "Step mode moves wrong number of steps"
1. Verify step slider sends 'n' commands to Arduino
2. Check stepCount value in Arduino
3. Verify HTML code sends correct format: `'n' + stepCount`
4. Look for [MOTOR CONTROL] Step size messages

### Symptom: "Mode toggle not working"
1. Verify mode buttons send 'y' command
2. Check stepModeEnabled variable in Arduino
3. Verify motor loop checks this flag
4. Look for [MODE] messages in serial monitor

### Symptom: "Directions are wrong (left goes right, etc.)"
1. **FIXED IN THIS SESSION:** Check command mappings
   - 'a' = X LEFT (was wrong in previous version)
   - 'd' = X RIGHT (was wrong in previous version)
2. Verify buttons sending correct characters
3. Check Arduino case statements match commands

### Symptom: "Continuous motion stops after ~5 seconds"
1. **THIS WAS THE CRITICAL BUG - NOW FIXED**
2. Verify MOTOR_TIMEOUT = 60000 in Arduino (not 5000)
3. Check that motor loop doesn't have additional timeout logic
4. Verify timeout only applies to emergency scenarios

---

## 📝 Next Steps After Testing

**If All Tests Pass:**
1. Proceed to Nextion integration testing
2. Diagnose character mapping issue from Nextion (d→a, f→expected, q→j)
3. Integrate Nextion touch screen display with web controls
4. Validate full system with both web and Nextion interfaces

**If Some Tests Fail:**
1. Document which tests failed specifically
2. Provide serial monitor output showing failure
3. Identify pattern (all directions fail? speed only? step mode only?)
4. Create focused fix for identified issue

**Known Issues Still to Address:**
1. ⚠️ Nextion character mapping problem (receiving wrong characters)
2. ⚠️ Step mode motor loop logic may need refinement (auto-clear on count)
3. ⚠️ Index axis controls need separate testing (uses different driver)

---

## 🎓 Technical Reference

**Arduino Variables (Updated):**
- `MOTOR_TIMEOUT = 60000` - Timeout in milliseconds (60 seconds)
- `motorSpeedMultiplier` - Speed level 1-5
- `stepModeEnabled` - Boolean for step vs continuous mode
- `stepCount` - Number of steps (1-70) per command

**Serial Commands (Complete Set):**
```
Motor Commands:
  'a' = X axis LEFT
  'd' = X axis RIGHT
  'w' = Y axis UP
  'z' = Y axis DOWN
  'e' = P axis CW
  'j' = P axis CCW
  'u' = STOP all motors

Index/Precision:
  'c' = Index axis INC
  'i' = Index axis DEC

NEW Controls:
  's' + digit (1-5) = Set speed (s1 through s5)
  'y' = Toggle STEP/CONTINUOUS mode
  'n' + digits (1-70) = Set step count (n1 through n70)
```

**Motor Timing:**
- Motor loop: 50ms update interval
- Speed multiplier: Applied per 50ms cycle
- Continuous mode: Flag stays true while button held
- Step mode: Flag true for ~100ms, then 'u' stop sent

---

**Ready to test? Connect hardware and start with PHASE 2: Serial Command Verification!**
