# GemBot Web Interface - Complete Testing Checklist

**Date:** December 6, 2025
**Changes:** Joystick fixes, P-axis safety gate, Index axis control, position display

## Pre-Test Verification

- [ ] Arduino code compiled and uploaded to Mega 2560
- [ ] Web interface HTML/CSS/JS loaded in browser
- [ ] USB connection established (check "Connected" status in web UI)
- [ ] Nextion touch screen connected to Serial1 (pins 18/19)
- [ ] Motor shields powered and initialized

---

## Test 1: Web Interface Connection

**Objective:** Verify web interface can communicate with Arduino

1. Open web interface in browser
2. Look for "Connected: Yes" message at top
3. Check serial monitor for: `Connected to Web Client`
4. **Expected Result:** Green "Connected" indicator shows

---

## Test 2: Joystick Canvas Functionality

**Objective:** Verify joystick canvas accepts mouse/touch input and sends correct values

### Test 2A: Mouse Drag
1. Click and drag on joystick canvas
2. Move cursor to various positions:
   - Far left (X=~28)
   - Far right (X=~228)
   - Far up (Y=~228)
   - Far down (Y=~28)
   - Corners (diagonal)

3. **Expected Results:**
   - Position values update in real-time
   - Values stay within 0-255 range (NO values >255 or <0)
   - Y-axis: Up movement increases value, Down movement decreases
   - X-axis: Right movement increases value, Left movement decreases
   - Motors respond smoothly to joystick position

### Test 2B: Center Return
1. Release mouse from joystick canvas
2. Joystick should return to center position
3. **Expected Result:** Position shows X=128, Y=128, P=128

### Test 2C: Release Command
1. Watch serial monitor while dragging joystick
2. When mouse is released, should see 'k' command sent
3. **Expected Result:** Serial shows `I received: k` and `k`

---

## Test 3: Individual Button Controls

**Objective:** Test all discrete movement buttons

### Test 3A: Y-Axis Controls
1. Click **▲ Y UP** button
   - **Expected:** Motors move up, serial shows `Y UP (PRECISION): 1 step`
2. Click **▼ Y DOWN** button
   - **Expected:** Motors move down, serial shows `Y DOWN (PRECISION): 1 step`

### Test 3B: X-Axis Controls
1. Click **◄ X LEFT** button
   - **Expected:** Motors move left, serial shows `X LEFT (PRECISION): 1 step`
   - Motor should respond, Y/X/P limit switches should NOT be affected
2. Click **► X RIGHT** button
   - **Expected:** Motors move right, serial shows `X RIGHT (PRECISION): 1 step`

### Test 3C: P-Axis Controls (WITHOUT Safety Gate)
1. Run **Home** function from touch screen to clear Y-axis
2. Wait for home to complete (Y limit should release)
3. Click **↶ P CCW** button
   - **Expected:** P-axis rotates, serial shows `P UP (PRECISION): 1 step`
   - **Should NOT see:** "P BLOCKED" message
4. Click **↷ P CW** button
   - **Expected:** P-axis rotates, serial shows `P DOWN (PRECISION): 1 step`
   - **Should NOT see:** "P BLOCKED" message

---

## Test 4: P-Axis Safety Gate (Critical!)

**Objective:** Verify P-axis cannot move when Y limit is pressed

### Test 4A: Trigger Safety Gate
1. From touch screen, run **Home** function
2. Wait for "y limit switch: Untouched -> Touched" message
3. **Without clicking anything**, go to web interface
4. Click **↶ P CCW** button (P up)
   - **Expected:** Nothing happens
   - **Serial shows:** `I received: q` and `P BLOCKED: Y-axis at limit (safety gate)`
5. Click **↷ P CW** button (P down)
   - **Expected:** Nothing happens  
   - **Serial shows:** `I received: e` and `P BLOCKED: Y-axis at limit (safety gate)`

### Test 4B: Release and Retry
1. From web interface, click **▲ Y UP** button several times
   - Y-axis should move up, releasing Y limit switch
2. Watch for: `y limit switch: Touched -> Untouched` message
3. Now click **↶ P CCW** again
   - **Expected:** P-axis now rotates freely
   - **Should see:** `P UP (PRECISION): 1 step` (no "BLOCKED" message)

---

## Test 5: Speed Toggle

**Objective:** Verify speed mode affects all button commands

### Test 5A: Default Precision Mode
1. Verify button shows: **"⚡ Speed: PRECISION MODE"** (green)
2. Click **▲ Y UP** button
   - **Expected:** `Y UP (PRECISION): 1 step`
3. Click **◄ X LEFT** button
   - **Expected:** `X LEFT (PRECISION): 1 step`

### Test 5B: Toggle to Fast Mode
1. Click speed toggle button
   - **Expected:** Button changes to red and shows **"⚡ Speed: FAST MODE"**
2. Click **▲ Y UP** button
   - **Expected:** `Y UP (FAST): 10 steps`
3. Click **◄ X LEFT** button
   - **Expected:** `X LEFT (FAST): 5 steps`
4. Click **✓ ENTER** on touch screen (or toggle again on web)
   - Watch serial for: `INFO: Motors set to FAST mode`

### Test 5C: Toggle Back to Precision
1. Click speed toggle button again
   - **Expected:** Changes back to green, shows **"⚡ Speed: PRECISION MODE"**
2. Verify buttons now send 1-step commands again

---

## Test 6: Index Axis Controls (NEW!)

**Objective:** Verify Index axis buttons work correctly

### Test 6A: Index Decrement
1. Click **◀ INDEX** button
   - **Expected:** Index motor moves backward
   - **Serial shows:** `I received: i` and `INDEX DEC (PRECISION): 1 step`
   - **Display updates:** Index value decreases by 5

### Test 6B: Index Increment
1. Click **INDEX ▶** button
   - **Expected:** Index motor moves forward
   - **Serial shows:** `I received: o` and `INDEX INC (PRECISION): 1 step`
   - **Display updates:** Index value increases by 5

### Test 6C: Index in Fast Mode
1. Toggle to **FAST MODE**
2. Click **◀ INDEX** button
   - **Expected:** Larger movement
   - **Serial shows:** `INDEX DEC (FAST): 5 steps`
3. Click **INDEX ▶** button
   - **Expected:** Larger movement
   - **Serial shows:** `INDEX INC (FAST): 5 steps`

---

## Test 7: Position Display Synchronization

**Objective:** Verify position values update correctly in real-time

### Test 7A: Display Updates on Button Click
1. Note current position display values
2. Click **▲ Y UP** button
   - **Expected:** Y value increases (moves closer to 255)
3. Click **▼ Y DOWN** button
   - **Expected:** Y value decreases (moves closer to 0)
4. Click **► X RIGHT** button
   - **Expected:** X value increases
5. Click **◀ INDEX** button
   - **Expected:** Index value decreases by 5

### Test 7B: Display Updates During Joystick Drag
1. Click and drag joystick to upper right corner
   - **Expected:** X increases, Y increases, P changes
2. Watch position values update in real-time
3. Drag to lower left
   - **Expected:** X decreases, Y decreases, P changes
4. Release
   - **Expected:** All values return to center (128)

### Test 7C: Value Ranges
1. Drag joystick to all corners and extremes
2. **Verify all values stay within 0-255 range**
   - No values should show <0 or >255
   - Common mistake: values of 256 or higher

---

## Test 8: Serial Communication Log Verification

**Objective:** Verify serial output matches expected behavior

Check serial monitor for these patterns:

### Expected Messages When Using Buttons:
```
I received: w
Y UP (PRECISION): 1 step

I received: z
Y DOWN (PRECISION): 1 step

I received: a
X LEFT (PRECISION): 1 step

I received: d
X RIGHT (PRECISION): 1 step

I received: q
P UP (PRECISION): 1 step

I received: e
P DOWN (PRECISION): 1 step

I received: i
INDEX DEC (PRECISION): 1 step

I received: o
INDEX INC (PRECISION): 1 step

I received: t
INFO: Motors set to FAST mode

I received: k
[joystick resets to center]
```

### Expected Messages for Joystick:
```
I received: j
[motor movement occurs, no output for individual j command]

I received: k
[stops joystick, resets to center]
```

### Expected Safety Gate Messages:
```
I received: q
P BLOCKED: Y-axis at limit (safety gate)

I received: e
P BLOCKED: Y-axis at limit (safety gate)
```

---

## Sign-Off Checklist

After completing all tests, verify:

- [ ] Joystick canvas accepts drag input
- [ ] Position values update in real-time
- [ ] All values stay in 0-255 range
- [ ] All discrete buttons work (Y, X, P, Index)
- [ ] P-axis safety gate prevents movement at Y limit
- [ ] P-axis works normally when Y limit released
- [ ] Speed toggle affects all commands correctly
- [ ] Index buttons move motor in correct direction
- [ ] Touch screen menu still works independently
- [ ] Serial output matches expected messages
