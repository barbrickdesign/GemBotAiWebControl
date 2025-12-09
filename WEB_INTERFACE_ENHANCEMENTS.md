# GemBot Web Interface Control Enhancements
**December 6, 2025** | Motor Speed Control & Joystick-Style Movement

---

## 📋 Overview

This document describes the enhancements made to the **web interface control system** for the GemBot automated faceting machine. These changes enable:

1. ✅ **Dual-Mode Motor Speeds** - Switch between precision and fast movement modes
2. ✅ **P-Axis Safety Gate** - Prevents homing accidents when stone is at 90°
3. ✅ **Web Joystick Control** - Single-step precision or multi-step rapid repositioning

---

## 🎮 Web Interface Commands

### Menu Navigation Commands (Already Implemented)
These commands navigate the menu system:
- **'0'** = ENTER / Select menu item
- **'1'** = LEFT / Navigate left in menu
- **'2'** = EXIT / Close menu / Release motors
- **'3'** = RIGHT / Navigate right in menu

### New Motor Control Commands (Web Only)
Send these characters from the web interface to control motors directly:

#### Speed Mode Toggle
```
't' or 'T'  = Toggle between PRECISION and FAST modes
```
- **PRECISION MODE**: Single-step or small increments (accuracy focused)
- **FAST MODE**: Multi-step movements (speed focused for rapid repositioning)
- Toggles all motors simultaneously
- LCD displays current mode: "PRECISION MODE" or "FAST MODE"

#### Y-Axis Movement (Up/Down)
```
'w' or 'W'  = Move Y axis UP
'z' or 'Z'  = Move Y axis DOWN
```
**PRECISION Mode:**
- 'W' or 'Z' = 1 step at a time
- Use for fine-tuning stone position

**FAST Mode:**
- 'W' = 10 steps up (rapid clear from wheel)
- 'Z' = 10 steps down (rapid lower to wheel)
- Use for rapid repositioning during cutting

#### X-Axis Movement (Left/Right)
```
'a' or 'A'  = Move X axis LEFT
'd' or 'D'  = Move X axis RIGHT
```
**PRECISION Mode:**
- 'A' or 'D' = 1 step at a time
- Use for fine-tuning facet position

**FAST Mode:**
- 'A' = 5 steps left (rapid indexing)
- 'D' = 5 steps right (rapid indexing)
- Use for moving between facets quickly

#### P-Axis Movement (Angle Up/Down)
```
'q' or 'Q'  = Move P axis UP (counter-clockwise)
'e' or 'E'  = Move P axis DOWN (clockwise)
```
**PRECISION Mode:**
- 'Q' or 'E' = 1 step at a time
- Use for fine-tuning cutting angle

**FAST Mode:**
- 'Q' = 3 steps up (faster angle adjustment)
- 'E' = 3 steps down (faster angle adjustment)
- Use for rapid angle changes between stages

---

## ⚡ Motor Speed Configuration

### Current Settings

| Axis | Function | Precision Speed | Fast Speed | Step Mode |
|------|----------|-----------------|-----------|-----------|
| Y | Lift/Lower Stone | 100 RPM | 200 RPM | MICROSTEP |
| X | Index Stone | 1000 RPM | 2000 RPM | SINGLE |
| P | Rotate Angle | 300 RPM | 800 RPM | MICROSTEP |
| Index | Rotate Gem | 300 RPM | 800 RPM | Standard |

### Movement Rates

| Axis | Precision Steps | Fast Steps | Precision Speed | Fast Speed |
|------|-----------------|-----------|-----------------|-----------|
| Y | 1 step | 10 steps | 0.83 steps/sec | 1.67 steps/sec |
| X | 1 step | 5 steps | 8.3 steps/sec | 16.7 steps/sec |
| P | 1 step | 3 steps | 2.5 steps/sec | 6.7 steps/sec |

---

## 🔄 Motor Speed Control Function

The code includes a new function `updateMotorSpeeds()` that switches all motors between modes:

```cpp
void updateMotorSpeeds() {
  if(fastMode) {
    // Set all motors to FAST speeds
    YaxisMotor->setSpeed(Y_AXIS_FAST_SPEED);
    XaxisMotor->setSpeed(X_AXIS_FAST_SPEED);
    PaxisMotor->setSpeed(P_AXIS_FAST_SPEED);
    indexMotor.setSpeed(INDEX_FAST_SPEED);
    Serial.println("INFO: Motors set to FAST mode");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("FAST MODE");
    delay(800);
  } else {
    // Set all motors to PRECISION speeds
    YaxisMotor->setSpeed(Y_AXIS_PRECISION_SPEED);
    XaxisMotor->setSpeed(X_AXIS_PRECISION_SPEED);
    PaxisMotor->setSpeed(P_AXIS_PRECISION_SPEED);
    indexMotor.setSpeed(INDEX_PRECISION_SPEED);
    Serial.println("INFO: Motors set to PRECISION mode");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("PRECISION MODE");
    delay(800);
  }
}
```

---

## 🛡️ P-Axis Home Safety Feature

When running `settingsHome()`, the code now checks if the P-axis is already at the home position (90°):

### Safety Gate Logic
```
1. Check if P limit switch is pressed (already at 90°)
   ↓
2. If pressed: Move Y axis UP 50 steps to clear grinding wheel
   ↓
3. Then proceed with normal P axis homing
   ↓
4. If not pressed: Skip Y clearance, proceed normally
```

### What This Prevents
- **Before:** If stone was still at the wheel at 90°, home could trigger incorrectly
- **After:** Y axis automatically moves stone clear before P homing proceeds

### Example Scenario
```
User is cutting at 90° angle with stone at grinding wheel
  ↓
User sends HOME command ('k' or menu HOME)
  ↓
System detects P is at 90° (limit switch pressed)
  ↓
System moves Y axis UP 50 steps (stone moves away from wheel)
  ↓
System then proceeds with normal home sequence
  ↓
Stone is safe, machine homed successfully
```

---

## 📝 Usage Examples

### Example 1: Fine-Tune Facet Angle (Precision Mode)

```
Current Mode: PRECISION (default)

1. User needs to adjust P angle slightly
2. Send 'q' → P axis moves 1 step UP
3. Send 'q' → P axis moves 1 step UP
4. Send 'q' → P axis moves 1 step UP (total: 3 steps)
5. Fine-tuning complete!
```

### Example 2: Rapid Stone Repositioning (Fast Mode)

```
1. User sends 't' → Toggle to FAST mode (LCD: "FAST MODE")
2. User sends 'z' → Y axis moves 10 steps DOWN quickly
3. User sends 'd' → X axis moves 5 steps RIGHT quickly
4. User sends 'e' → P axis moves 3 steps DOWN quickly
5. Stone repositioned to wheel rapidly!
6. User sends 't' → Toggle back to PRECISION mode
```

### Example 3: Complete Cut Workflow

```
Phase 1: Setup (PRECISION MODE)
- Send menu commands to navigate to Manual Control
- Send 'a' several times to fine-tune X position
- Send 'q' several times to fine-tune angle
- Facet perfectly positioned

Phase 2: Cut (FAST MODE)
- Send 't' → Toggle to FAST mode
- Send 'z' multiple times → Rapidly move stone to wheel
- Cut facet (through separate cutting system)
- Send 'w' → Rapidly move stone away from wheel
- Send 'e' → Rapidly adjust to next angle
- Send 't' → Toggle back to PRECISION
- Fine-tune next facet position
- Repeat for each facet
```

---

## 🔧 Technical Implementation Details

### Global Variables Added
```cpp
// Motor speed constants
const int Y_AXIS_PRECISION_SPEED = 100;
const int X_AXIS_PRECISION_SPEED = 1000;
const int P_AXIS_PRECISION_SPEED = 300;
const int INDEX_PRECISION_SPEED = 300;

const int Y_AXIS_FAST_SPEED = 200;
const int X_AXIS_FAST_SPEED = 2000;
const int P_AXIS_FAST_SPEED = 800;
const int INDEX_FAST_SPEED = 800;

// Global speed mode flag
bool fastMode = false;  // false=precision, true=fast

// Joystick control structure (for future use)
struct JoystickControl {
  char lastKey = 0;
  unsigned long keyPressTime = 0;
  bool isHeld = false;
  const unsigned long HOLD_THRESHOLD = 100;  // ms
  const unsigned long REPEAT_INTERVAL = 50;   // ms
  unsigned long lastRepeatTime = 0;
};
JoystickControl joystick;
```

### Web Command Handler (In main loop)
- Checks `Start` variable for web commands
- Routes 't/T' to speed toggle
- Routes 'w/W', 'z/Z' to Y axis movement
- Routes 'a/A', 'd/D' to X axis movement
- Routes 'q/Q', 'e/E' to P axis movement
- Each command automatically uses current speed mode
- Serial output logs all movements for debugging

---

## 📊 Serial Monitor Output Examples

### Speed Toggle
```
INFO: Motors set to FAST mode
INFO: Motors set to PRECISION mode
```

### Motor Movements
```
Y UP (PRECISION): 1 step
Y DOWN (FAST): 10 steps
X LEFT (PRECISION): 1 step
X RIGHT (FAST): 5 steps
P UP (PRECISION): 1 step
P DOWN (FAST): 3 steps
```

### Home Safety
```
INFO: P axis already at home position (90°)
INFO: Moving Y axis clear of wheel first for safety
INFO: Y axis cleared, safe to reference P home
```

---

## ⚠️ Important Notes

1. **Menu Navigation Still Works**: The original menu system (0, 1, 2, 3 for menu nav) is unchanged
2. **Motor Release**: Command '2' still releases all motors when exiting menu
3. **Speed Affects All Motors**: Toggling mode changes all motors simultaneously
4. **Serial Logging**: All motor movements are logged to Serial Monitor for debugging
5. **Touch Screen Not Affected**: Touch screen manual control ('d', 'e', 'f', 'i', 'g', 'j', 'k', 'l', etc.) remains unchanged
6. **Home Safety Automatic**: P-axis safety check runs automatically during home sequence

---

## 🧪 Testing Checklist

- [ ] Send 't' from web interface → Motor speeds toggle
- [ ] LCD displays "PRECISION MODE" and "FAST MODE"
- [ ] In PRECISION: 'w' = 1 step Y up
- [ ] In FAST: 'w' = 10 steps Y up
- [ ] In PRECISION: 'a' = 1 step X left
- [ ] In FAST: 'a' = 5 steps X left
- [ ] In PRECISION: 'q' = 1 step P up
- [ ] In FAST: 'q' = 3 steps P up
- [ ] All serial output appears correct
- [ ] Menu navigation still works (0, 1, 2, 3)
- [ ] Motor '2' EXIT still releases motors
- [ ] Home sequence activates Y safety gate at 90°

---

## 🔄 Future Enhancement Ideas

1. **Holding Button Support**: Track repeated commands and move continuously while held
2. **Speed Levels**: Add 3+ speed modes instead of just 2
3. **Axis Lock**: Prevent multiple axes moving simultaneously
4. **Step Count Display**: Show total steps moved on LCD
5. **Speed Presets**: Save/load preferred speed combinations per operation
6. **Motor Current Display**: Show motor current draw on LCD

---

**Code Modifications Summary:**
- Added speed mode constants and joystick structure (lines ~185-210)
- Added `updateMotorSpeeds()` function (lines ~2958-2985)
- Modified motor initialization to use precision speeds (line ~695-700)
- Modified `settingsHome()` with P-axis safety gate (lines ~2910-2945)
- Added web command handler in main loop (lines ~845-920)

