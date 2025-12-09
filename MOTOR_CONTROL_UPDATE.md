# Motor Control System Update (December 6, 2025)

## ✅ Fixed Issues

### Problem
Motor controls were sending **STOP (u) command on every mouseup**, immediately halting motors even when trying to do continuous movements. This caused:
- Single button press → immediate stop
- No hold-to-move capability
- 5-second timeout triggering unexpectedly

### Root Cause
The button handlers were:
```javascript
// ❌ WRONG: Sends STOP immediately
btn.addEventListener('mouseup', () => {
    sendCommand('u');  // Stops motors immediately!
});
```

### Solution
Implemented proper **state-based motor control** with:
- ✅ Hold-to-move for continuous mode (send command every 50ms while held)
- ✅ Step mode for precise single/multi-step movements
- ✅ Stop only when ALL buttons released (not on every mouseup)
- ✅ Debounced STOP command (50ms cooldown between stops)

---

## 🎮 New Motor Control Modes

### CONTINUOUS MODE (Default) ✅ Hold-to-Move
- **How it works:** Hold mouse button → motors move continuously
- **Release button** → motors stop automatically
- **Button behavior:**
  1. `mousedown`: Send movement command repeatedly (every 50ms)
  2. Hold: Motor continues moving
  3. `mouseup`: Flag sets to false, interval detects no buttons pressed
  4. Stop: Sends STOP command once (50ms debounce)

**Visual Feedback:**
```
🎛️ Motor Mode: [▶️ CONTINUOUS] [⏸️ STEP]  ← Blue = Active
📏 Step Size: 1/70  (disabled in continuous mode)
```

### STEP MODE ⏸️ Precise Stepping
- **How it works:** Click button → moves N steps (configured by slider)
- **Step size:** 1-70 steps (adjustable with slider)
- **Button behavior:**
  1. `mousedown`: Send movement command N times (50ms apart)
  2. After N commands sent: Send STOP automatically
  3. Button press completes action

**Visual Feedback:**
```
🎛️ Motor Mode: [▶️ CONTINUOUS] [⏸️ STEP]  ← Orange = Active
📏 Step Size: 5/70  (active: determines how many steps)
   (Hold button to move 5 steps)
```

---

## 🎚️ Step Interval Slider

**Location:** Motor Control Panel → "📏 Step Size"

**Features:**
- **Range:** 1-70 steps
- **Default:** 1 step
- **Real-time display:** Shows "Step Size: X/70"
- **Active in:** Both CONTINUOUS and STEP modes
  - CONTINUOUS: Controls repeat rate (steps per hold)
  - STEP: Controls total steps per click

**Examples:**
- Slider at `1` → Move 1 step (smallest increment)
- Slider at `10` → Move 10 steps per click
- Slider at `70` → Move 70 steps (maximum per Nextion limit)

---

## 🔄 Motor Control Flow

### Continuous Mode Flow
```
USER PRESSES BUTTON
    ↓
[START] Send 'd' (X RIGHT)
[INTERVAL 50ms] Send 'd' again
[INTERVAL 50ms] Send 'd' again
...repeats while held...
USER RELEASES BUTTON
    ↓
[STOP] Interval detects no buttons pressed
[STOP] Send 'u' (STOP COMMAND)
[DONE] Motors halt
```

### Step Mode Flow
```
USER PRESSES BUTTON
    ↓
[START LOOP, steps=0]
[LOOP 1: 0ms] Send 'd' (X RIGHT), steps++
[LOOP 2: 50ms] Send 'd' (X RIGHT), steps++
[LOOP 3: 100ms] Send 'd' (X RIGHT), steps++
[LOOP COMPLETE] steps == motorStepSize
    ↓
[STOP] Send 'u' (STOP COMMAND)
[DONE] Motors halt
```

---

## 📊 Command Mapping

| Motor | Direction | Continuous | Step |
|-------|-----------|-----------|------|
| **X-Axis** | Left | `d` | `d` × N |
| **X-Axis** | Right | `a` | `a` × N |
| **Y-Axis** | Up | `w` | `w` × N |
| **Y-Axis** | Down | `z` | `z` × N |
| **P-Axis** | CW | `e` | `e` × N |
| **P-Axis** | CCW | `j` | `j` × N |
| **STOP** | All Motors | `u` | `u` (auto) |
| **Index** | Increment | `c` (manual) | N/A |
| **Index** | Decrement | `i` (manual) | N/A |

---

## ⚙️ Arduino Side (Unchanged)

The Arduino code remains the same:
- `motorXRight`, `motorYUp`, etc. flags control motion
- 50ms update cycle processes continuous movements
- 5-second timeout auto-stops runaway motors
- Limit switches still monitored

Web interface now:
- ✅ Sends commands consistently (no premature STOP)
- ✅ Respects hold duration (only stops on release)
- ✅ Handles debouncing (prevents rapid stop/start)

---

## 🧪 Testing Checklist

- [ ] **CONTINUOUS MODE:**
  - [ ] Press button → motor moves
  - [ ] Hold button → motor continues
  - [ ] Release button → motor stops (within 100ms)
  - [ ] No timeout errors during normal operation

- [ ] **STEP MODE (set slider to 5):**
  - [ ] Click button → motor moves exactly 5 times
  - [ ] Motor stops automatically after steps
  - [ ] Change slider to 10, click → motor moves 10 times
  - [ ] Slider range 1-70 works correctly

- [ ] **Mode Switching:**
  - [ ] Switch CONTINUOUS → STEP → works
  - [ ] Switch STEP → CONTINUOUS → works
  - [ ] Visual buttons highlight correctly (blue/orange)

- [ ] **E-STOP Button:**
  - [ ] Press E-STOP anytime → motors halt immediately
  - [ ] 5 redundant commands sent
  - [ ] Button flashes red for 2 seconds

---

## 📝 Code References

**HTML UI Elements:**
- `btnModeContinuous` / `btnModeStep` → Mode selection buttons
- `stepIntervalSlider` → Step size slider (1-70)
- `stepSizeDisplay` / `stepSizeLabel` → Display updates

**JavaScript Variables:**
- `motorControlMode` → Current mode ('continuous' or 'step')
- `motorStepSize` → Steps per action (1-70)
- `buttonStates` → Tracks which buttons held
- `activeSendInterval` → Continuous mode interval handle

**Key Functions:**
- `setInterval()` → 50ms continuous command loop
- `sendCommand(cmd)` → Send single command to Arduino
- `addMessage()` / `log()` → Console feedback

---

## 🚀 Next Steps

1. **Test on hardware** with actual motor movement
2. **Verify 50ms interval** doesn't overload Arduino
3. **Adjust motorStepSize** max if needed (currently 70 per Nextion limit)
4. **Document Nextion behavior** for reference
5. **Consider adding speed control** per axis in future

---

## 📌 Notes

- **E-STOP still works** the same way (immediate halt)
- **Index buttons** unaffected (manual stepper mode)
- **Emergency timeout** (5 sec) still active for safety
- **Limit switches** still monitored during movement
- **Auto-save** removed to prevent conflicts with new logic
