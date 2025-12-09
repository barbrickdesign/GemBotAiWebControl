# GemBot Control - Quick Reference Card
**2025-12-07 | Ready for Testing**

---

## 🎮 Web Interface Controls

| Control | Type | Range | Function |
|---------|------|-------|----------|
| **Speed Slider** | Slider | 1-5 | Sets motor speed (1=slow, 5=fast) |
| **Mode Buttons** | Buttons | - | CONTINUOUS (hold) vs STEP (click) |
| **Step Size** | Slider | 1-70 | Steps per button click in STEP mode |
| **Direction Buttons** | Grid | 6 dirs | X LEFT/RIGHT, Y UP/DOWN, P CW/CCW |
| **E-STOP** | Button | - | Emergency stop (stops all motors) |

---

## 🔌 Arduino Serial Commands

### Motor Movement
```
a = X LEFT       d = X RIGHT
w = Y UP         z = Y DOWN
e = P CW         j = P CCW
u = STOP ALL
```

### New Controls
```
s1 ... s5 = Speed (1=slow, 5=fast)
y = Toggle mode (CONTINUOUS ↔ STEP)
n1 ... n70 = Step count (1-70)
```

### Index Precision
```
c = Index INC    i = Index DEC
```

---

## 📊 Operating Modes

### CONTINUOUS MODE
- **Hold** button → smooth motion until release
- **Release** button → motors stop immediately
- **Speed** affects motion smoothness (1-5 levels)
- **Timeout** = 60 seconds (was 5 seconds, now fixed!)

### STEP MODE  
- **Click** button → exactly N steps then stop
- **N** = slider value (1-70 steps)
- **Speed** affects step execution rate
- **Auto-stop** after all steps complete

---

## ✅ Expected Behavior

| Scenario | Expected Result |
|----------|-----------------|
| Hold button 3 sec in CONTINUOUS | Smooth motion for full duration, stops on release |
| Set speed=1, hold button | Slow, deliberate motion |
| Set speed=5, hold button | Fast, responsive motion |
| Switch to STEP, set steps=5, click | Exactly 5 steps, then stop |
| Switch to STEP, set steps=1, click | Exactly 1 step, then stop |
| Hold P CW button 2 sec | Continuous rotation, stops on release |
| Click E-STOP during motion | Immediate stop |
| Change mode mid-motion | Clean transition (may complete motion) |

---

## 🚨 Serial Monitor Output

### At Startup
```
[SYSTEM] GemBot Motor Control System Initialized
[MOTOR TIMEOUT] Set to: 60000 ms
[SYSTEM] Waiting for commands...
```

### When Speed Changes
```
[SPEED] Motor speed multiplier set to: 3
```

### When Mode Changes
```
[MODE] CONTINUOUS mode enabled - Hold for motion
[MODE] STEP mode enabled - Click for N steps
```

### When Step Size Changes
```
[MOTOR CONTROL] Step size set to: 5
```

### During Motion
```
[MOTOR START] Motors engaged
[MOTOR COMMAND] X axis moving LEFT
[MOTOR STOP] All motors stopped
```

---

## 🔧 If Something's Wrong

### Motors don't move
- [ ] Check power connections
- [ ] Verify Arduino received command (serial monitor)
- [ ] Check MOTOR_TIMEOUT is 60000 (not 5000)
- [ ] Verify stepper drivers are active

### Speed changes don't work
- [ ] Check serial monitor for `[SPEED]` messages
- [ ] Verify slider sends `s1`, `s2`, etc.
- [ ] Check motorSpeedMultiplier in Arduino

### Step mode wrong
- [ ] Check serial monitor for `[MOTOR CONTROL]` messages
- [ ] Verify step count in Arduino matches slider
- [ ] Count actual steps executed (is it N steps?)

### Directions are wrong
- [ ] X LEFT should send 'a' (was wrong before, now fixed!)
- [ ] X RIGHT should send 'd'
- [ ] Check button mappings in HTML

### Motors stop after 5 seconds
- [ ] **THIS WAS THE CRITICAL BUG - NOW FIXED!**
- [ ] Verify MOTOR_TIMEOUT = 60000
- [ ] Check if holding button keeps motors running

### Mode toggle not working
- [ ] Check serial monitor for `[MODE]` messages
- [ ] Verify buttons send 'y' command
- [ ] Check stepModeEnabled in Arduino

---

## 📏 Test Checklist - QUICK VERSION

```
CONTINUOUS MODE:
  [ ] X LEFT: Hold 2 sec → smooth, release → stop
  [ ] X RIGHT: Hold 2 sec → smooth, release → stop
  [ ] Y UP: Hold 2 sec → smooth, release → stop
  [ ] Y DOWN: Hold 2 sec → smooth, release → stop
  [ ] P CW: Hold 2 sec → smooth, release → stop
  [ ] P CCW: Hold 2 sec → smooth, release → stop

SPEED TEST:
  [ ] Speed=1 (slowest)
  [ ] Speed=5 (fastest)
  [ ] Verify 5 levels are noticeably different

STEP MODE:
  [ ] Click with steps=1 → 1 step only
  [ ] Click with steps=5 → 5 steps only
  [ ] Click with steps=10 → 10 steps only
  [ ] Try steps=50 → 50 steps only

EMERGENCY STOP:
  [ ] E-STOP during continuous → stops immediately
  [ ] E-STOP during step sequence → aborts cleanly

OVERALL:
  [ ] No 5-second timeouts
  [ ] All 6 directions work
  [ ] Speed affects motion rate
  [ ] Step mode accurate to step count
```

---

## 📞 Key Files

- **Arduino Code:** `joystickRevert_copy_20251206152907.ino`
  - Line 176: MOTOR_TIMEOUT = 60000 ✅
  - Lines 1032-1080: Speed/Mode/Step commands ✅
  - Lines 1282-1310: Speed multiplier applied ✅

- **Web Interface:** `GemBot_Web_Control_DualMode.html`
  - Lines 671-681: Speed slider ✅
  - Lines 2075-2091: Speed command handler ✅
  - Lines 2119-2150: Mode toggle with 'y' command ✅
  - Lines 2142-2150: Step size with 'n' command ✅

- **Full Guides:**
  - `TESTING_GUIDE_20251207.md` - 7-phase comprehensive testing
  - `IMPLEMENTATION_SUMMARY_20251207.md` - Complete implementation details

---

## 🎯 Next Steps

1. **Test CONTINUOUS mode** - Verify smooth motion, speed control
2. **Test STEP mode** - Verify exact step counts
3. **Test SPEED** - Verify 1-5 levels work
4. **Test all 6 directions** - Verify X/Y/P all work
5. **Diagnose Nextion** - Fix character mapping issue

---

**Status: ✅ READY FOR HARDWARE TESTING**

All controls implemented, commands ready, testing guides complete. Connect hardware and run tests!
