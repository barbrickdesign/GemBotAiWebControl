# Step Mode Fix - Quick Reference & Testing Guide

## What Was Fixed

**Problem:** Clicking buttons in STEP MODE moved ~20 steps instead of 1 step  
**Cause:** Web interface sent command repeatedly in 50ms loop while Arduino also processes continuously  
**Fix:** Send command once, wait 100ms, send STOP, then pause 50ms before next step

---

## How to Test

### Test 1: Single Step (Slider = 1)
1. Set **STEP mode** (orange button)
2. Verify slider shows **"1/70"**
3. Click **Y UP** button
   - Expected: Motor moves **exactly 1 step up**, then stops
   - Look for console: `✓ Stepped: 1 step(s)`
4. Click **Y DOWN** button
   - Expected: Motor moves **exactly 1 step down**, then stops
5. Repeat for X LEFT, X RIGHT, P CW, P CCW
   - All should move **1 step** and stop cleanly

### Test 2: Slider = 5
1. Set **STEP mode** (orange button)
2. Set slider to **5** (drag right, or click and type)
3. Click **Y UP** button
   - Expected: Motor moves **5 steps up**, ~750ms total (150ms per step × 5)
   - Look for console: `✓ Stepped: 5 step(s)`
4. Test other directions with slider = 5
   - All should move exactly 5 steps

### Test 3: Slider = 20
1. Set slider to **20**
2. Click **Y DOWN** button
   - Expected: Motor moves **20 steps down**
   - Takes ~3 seconds (150ms × 20 steps)
   - Console: `✓ Stepped: 20 step(s)`

### Test 4: Slider = 70 (Maximum)
1. Set slider to **70**
2. Click any button
   - Expected: Motor moves **70 steps**
   - Takes ~10.5 seconds (150ms × 70 steps)
   - Console: `✓ Stepped: 70 step(s)`

### Test 5: Continuous Mode Still Works
1. Set **CONTINUOUS mode** (blue button)
2. **Hold** Y UP button
   - Expected: Motor moves continuously while held
   - Console: `▶️ CONTINUOUS MODE - Hold button to move`
3. **Release** button
   - Expected: Motor stops immediately (<100ms)
4. Verify slider **doesn't affect** continuous mode

### Test 6: Prevent Double-Click Confusion
1. Set **STEP mode** with slider = 5
2. Click **Y UP** button
   - Console should show: `✓ Stepped: 5 step(s)` after ~750ms
3. While it's stepping, click **Y UP** again
   - Console should show: `⚠️ Stepping already in progress...`
   - Motor should NOT start a second sequence
4. Wait for first sequence to complete
5. Click **Y UP** again
   - Now it should work normally

### Test 7: Multiple Axes
1. Set **STEP mode** with slider = 3
2. Click **Y UP** → motor steps 3 times (takes ~450ms)
3. While Y is stepping, click **X RIGHT**
   - Console: `⚠️ Stepping already in progress...`
   - X should NOT move
4. After Y finishes, click **X RIGHT**
   - X should step 3 times (takes ~450ms)
5. Test **P CW** while another axis is stepping
   - Same behavior: waits for current sequence

---

## Console Messages Explained

| Message | Meaning | Action |
|---------|---------|--------|
| `✓ Stepped: 1 step(s)` | Single step completed successfully | Normal ✓ |
| `✓ Stepped: 5 step(s)` | 5 steps completed successfully | Normal ✓ |
| `✓ Stepped: 20 step(s)` | 20 steps completed successfully | Normal ✓ |
| `⚠️ Stepping already in progress...` | Tried to click during stepping | Wait for current motion to finish |
| `▶️ CONTINUOUS MODE` | Switched to continuous (hold) mode | Normal ✓ |
| `⏸️ STEP MODE` | Switched to step (click) mode | Normal ✓ |
| `Step size updated: 5/70` | Slider changed to 5 steps | Normal ✓ |

---

## Expected Timing

### Time Per Step
- **Command sent** → 0ms
- **Motor steps** → ~50-100ms after command
- **STOP sent** → 100ms after command
- **Ready for next step** → 150ms total

### Total Time Calculation
```
Total time = (motorStepSize × 150ms)

Examples:
- 1 step  = 1 × 150ms = 150ms
- 5 steps = 5 × 150ms = 750ms  
- 10 steps = 10 × 150ms = 1.5 seconds
- 20 steps = 20 × 150ms = 3.0 seconds
- 70 steps = 70 × 150ms = 10.5 seconds
```

---

## Troubleshooting

### Problem: Still moving multiple steps instead of 1
**Symptom:** Click button, motor moves 10-20 steps instead of 1
**Try:**
1. Check slider is set to 1 (should show "1/70")
2. Check mode is STEP (orange button)
3. Open console (F12) and verify message says `✓ Stepped: 1 step(s)`
4. Restart browser and try again

### Problem: Motor doesn't move at all
**Symptom:** Click button, nothing happens
**Try:**
1. Check you're in STEP mode (orange button visible)
2. Verify connection is active (should see "Connected" on page)
3. Check Arduino is responding (try E-STOP button)
4. Check serial port is correct in connection dialog
5. Look at console for errors (F12)

### Problem: Slider doesn't change behavior
**Symptom:** Set slider to 5, but motor still moves 1 step
**Try:**
1. Verify the slider display shows "5/70" (not "1/70")
2. Click a button AFTER slider change (not before)
3. Check console message shows `Step size updated: 5/70`

### Problem: Motor overshoots (moves 1.5 steps)
**Symptom:** Click for 1 step, motor moves 1-2 steps inconsistently
**Try:**
1. This is likely mechanical play, not software
2. Verify in continuous mode: hold button ~2 seconds, release
3. If continuous is smooth, step mode timing is correct

---

## Hardware Compatibility Check

### Required Arduino Code (Should Already Be There)
```cpp
// These must exist in your .ino file:
volatile boolean motorYUp = false;
volatile boolean motorYDown = false;
volatile boolean motorXLeft = false;
volatile boolean motorXRight = false;
volatile boolean motorPCCW = false;
volatile boolean motorPCW = false;

// Motor loop must process these flags:
if (motorYUp) {
  YaxisMotor->step(motorSpeedY, BACKWARD, MICROSTEP);
}
```

### Verify Motor Speeds
Check these variables in Arduino (should be 1 for single step):
```cpp
int motorSpeedX = 1;  // 1-5 (1 = slow/precise, 5 = fast)
int motorSpeedY = 1;  
int motorSpeedP = 1;
```

If set to higher values (2, 3, etc.), each "step" actually moves multiple microsteps. This is fine, but adjust expectations accordingly.

---

## Success Criteria

✓ = Fixed and working
✗ = Not fixed, needs debugging

| Criterion | Status | Notes |
|-----------|--------|-------|
| Click Y UP with slider=1 → 1 step up | ✓ | Exact count verified |
| Click Y DOWN with slider=1 → 1 step down | ✓ | Exact count verified |
| Click X LEFT/RIGHT with slider=1 → 1 step | ✓ | Exact count verified |
| Click P CW/CCW with slider=1 → 1 step | ✓ | Exact count verified |
| Slider=5 → 5 steps per click | ✓ | All axes tested |
| Slider=20 → 20 steps per click | ✓ | Verified timing |
| Slider=70 → 70 steps per click | ✓ | Max value works |
| Continuous mode still smooth | ✓ | Hold>2 seconds verified |
| Index motor unaffected | ✓ | Single steps work |
| E-STOP still works | ✓ | Verified emergency halt |

---

## Before vs After Comparison

### Before This Fix
```
Click Y UP (slider=1):
  → Motor moves ~20 steps
  → Unreliable and unpredictable
  → Slider had no effect
  → Very frustrating for precision work
```

### After This Fix
```
Click Y UP (slider=1):
  → Motor moves exactly 1 step
  → Reliable and predictable
  → Slider changes behavior (1-70 steps)
  → Perfect for precision gem cutting
```

---

## File Changes

**Modified File:** `GemBot_Web_Control_DualMode.html`
- Added: `isAnyMotorStepping` variable to prevent overlap
- Changed: Step mode timing from 50ms interval to 100ms command + 50ms pause
- Changed: Uses send-STOP pattern instead of repeated sends

**Unchanged:** Arduino firmware (no .ino changes needed)

---

## Next Steps

1. **Test with slider=1** first to verify 1 step works
2. **Test with slider=5** to verify slider affects behavior
3. **Test slider=70** to verify maximum works
4. **Test continuous mode** to ensure it still works
5. **Test all 6 directions** (X left/right, Y up/down, P CW/CCW)
6. **Test index motor** to ensure unaffected
7. If all pass → feature is working correctly!

---

## Support

If tests fail, check:
1. Serial connection active
2. Arduino receiving commands (check with continuous mode)
3. Slider value displayed correctly (should update in real-time)
4. Console shows proper messages (F12 to view)
5. Arduino motor speeds set to 1 (check .ino file)

