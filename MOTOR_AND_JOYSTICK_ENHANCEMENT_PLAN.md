# GemBot Control System Enhancement Plan
**December 6, 2025** | Addressing Motor Speed, P-Axis Home Logic, and Joystick Control

---

## 🎯 Three Major Issues to Address

### Issue #1: P-Axis (90°) Home Logic
**Problem:** P limit switch is continuously pressed at 90°, so home can trigger incorrectly if stone is still at wheel

**Current Code (line 2866):**
```cpp
while(homePSet != 90){
    limitSwitchp.loop();
    PaxisMotor->step(1,BACKWARD,MICROSTEP);
    if(limitSwitchp.isPressed()){
        homePSet = 90;  // Sets immediately without checking Y position!
    }
}
```

**Issue:** No check that Y axis has moved stone away from wheel before allowing P home.

---

### Issue #2: Motor Speed - Current Configuration
```
Y Axis:  100 rpm  - For lifting/lowering quill and stone positioning
X Axis:  1000 rpm - For rotating and indexing
P Axis:  300 rpm  - For angle changes (gear-driven)
Index:   300 rpm  - For gear indexing
```

**Analysis:**
- Y axis at 100 rpm = ~0.83 steps/sec (MICROSTEP mode) = **VERY SLOW** for rapid positioning
- X axis at 1000 rpm = ~8.3 steps/sec (SINGLE mode) = Reasonable for precision
- P axis at 300 rpm = ~2.5 steps/sec (MICROSTEP mode) = Good for angle precision
- Single button press = only 1 step = minimal movement

**Recommendation:**
- Keep precision speeds for homing/cutting sequences
- Add "fast drive" speeds for manual positioning (5-10x faster)
- Y axis should be 200-400 rpm for rapid repositioning during cuts

---

### Issue #3: Joystick Control System Needed

**Current System (manual control):**
- Single character input per button press
- Each press = 1 step or 1-8 steps max
- No continuous movement ("hold button = constant motion")
- No speed selection (precision vs fast)

**Needed System:**
- **Press Mode** (discrete): Single button press = 1 or more steps (precision)
- **Hold Mode** (continuous): Holding button = continuous rapid movement
- **Speed Control**: Switch between precision and fast modes
- **Axis Priority**: Can't move multiple axes simultaneously (motor shield limitation)

---

## ✅ Implementation Strategy

### Fix #1: Safe P-Axis Home with Y Position Check

Add safety check that Y has moved away from limit:

```cpp
void settingsHome(){
  // ... Y and X homing code ...
  
  // SAFETY: Only home P axis if Y has moved enough away from wheel
  // Home routine should have already moved Y up 100+ steps
  if(homeYPosition == 0 && ystepCount > 100) {
    // Y homing completed successfully, safe to home P
    Serial.println("DEBUG: Y homing complete, proceeding to P homing");
    
    // P Axis homing with safety check
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Setting Home");
    
    PaxisMotor->step(10,FORWARD,MICROSTEP);  // Pre-move away from limit
    
    while(homePSet != 90){
      limitSwitchp.loop();
      lcd.setCursor(0,1);
      lcd.print("Homing P Angle");
      
      PaxisMotor->step(1,BACKWARD,MICROSTEP);
      
      // CRITICAL: Only accept press if we're actually moving toward the switch
      // (prevent false trigger from already-pressed switch at 90°)
      if(limitSwitchp.isPressed() && limitSwitchp.getCount() < 2) {
        Serial.println("p limit switch: Angle set to 90");
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home P Angle Set to 90");
        homePSet = 90;
      }
      
      // Timeout: If we haven't found switch in 500 steps, abort
      if(homePSet == 0 && /* step_counter */ > 500) {
        Serial.println("ERROR: P home timeout - switch may already be at 90");
        homePSet = 90;  // Force exit
      }
    }
  } else {
    Serial.println("ERROR: Cannot home P axis - Y homing incomplete!");
    homePSet = 90;  // Safety fallback
  }
  
  manualControl();
}
```

---

### Fix #2: Optimized Motor Speeds

```cpp
// Add at top with other speed definitions (around line 660)

// PRECISION SPEEDS (for homing, cutting, fine positioning)
const int Y_AXIS_PRECISION_SPEED = 100;   // Current: slow and steady
const int X_AXIS_PRECISION_SPEED = 1000;  // Current: good for precision
const int P_AXIS_PRECISION_SPEED = 300;   // Current: good for angles
const int INDEX_PRECISION_SPEED = 300;    // Current: good

// FAST SPEEDS (for rapid repositioning during workflows)
const int Y_AXIS_FAST_SPEED = 400;        // 4x faster = ~3.3 steps/sec
const int X_AXIS_FAST_SPEED = 2000;       // 2x faster = ~16.7 steps/sec
const int P_AXIS_FAST_SPEED = 800;        // 2.7x faster = ~6.7 steps/sec
const int INDEX_FAST_SPEED = 800;         // 2.7x faster

// Global variable for current speed mode
bool fastMode = false;  // false=precision, true=fast

// Function to set all motors to current speed
void updateMotorSpeeds() {
  if(fastMode) {
    YaxisMotor->setSpeed(Y_AXIS_FAST_SPEED);
    XaxisMotor->setSpeed(X_AXIS_FAST_SPEED);
    PaxisMotor->setSpeed(P_AXIS_FAST_SPEED);
    indexMotor.setSpeed(INDEX_FAST_SPEED);
    Serial.println("INFO: Motors set to FAST mode");
  } else {
    YaxisMotor->setSpeed(Y_AXIS_PRECISION_SPEED);
    XaxisMotor->setSpeed(X_AXIS_PRECISION_SPEED);
    PaxisMotor->setSpeed(P_AXIS_PRECISION_SPEED);
    indexMotor.setSpeed(INDEX_PRECISION_SPEED);
    Serial.println("INFO: Motors set to PRECISION mode");
  }
}
```

---

### Fix #3: Joystick Control System

Add to the character input handler in `getKey()` or serial receive:

```cpp
// Add near top of file (global variables section)
struct JoystickControl {
  char lastKey = 0;
  unsigned long keyPressTime = 0;
  bool isHeld = false;
  const unsigned long HOLD_THRESHOLD = 100;  // ms before "hold" activates
  const unsigned long REPEAT_INTERVAL = 50;   // ms between repeated steps
  unsigned long lastRepeatTime = 0;
};

JoystickControl joystick;

// Modify in your key handler (around line 960-1080 in manualControl)

case 'd':  // LEFT - X Axis
{
  if(!joystick.isHeld) {
    // First press - single step
    XaxisMotor->step(1, FORWARD, SINGLE);
    countX -= 1;
    Serial.println("X LEFT single step: " + String(countX));
    joystick.lastKey = 'd';
    joystick.keyPressTime = millis();
    joystick.isHeld = true;
  } 
  else if(joystick.lastKey == 'd' && millis() - joystick.lastRepeatTime > joystick.REPEAT_INTERVAL) {
    // Held - continuous steps (fast movement)
    XaxisMotor->step(5, FORWARD, SINGLE);  // 5 steps per repeat
    countX -= 5;
    Serial.println("X LEFT rapid: " + String(countX));
    joystick.lastRepeatTime = millis();
  }
  break;
}

case 'e':  // UP - Y Axis
{
  if(!joystick.isHeld) {
    YaxisMotor->step(1, BACKWARD, MICROSTEP);
    countY -= 1;
    Serial.println("Y UP single step: " + String(countY));
    joystick.lastKey = 'e';
    joystick.keyPressTime = millis();
    joystick.isHeld = true;
  }
  else if(joystick.lastKey == 'e' && millis() - joystick.lastRepeatTime > joystick.REPEAT_INTERVAL) {
    YaxisMotor->step(10, BACKWARD, MICROSTEP);  // 10 steps per repeat
    countY -= 10;
    Serial.println("Y UP rapid: " + String(countY));
    joystick.lastRepeatTime = millis();
  }
  break;
}

case 'f':  // RIGHT - X Axis
{
  if(!joystick.isHeld) {
    XaxisMotor->step(1, BACKWARD, SINGLE);
    countX += 1;
    Serial.println("X RIGHT single step: " + String(countX));
    joystick.lastKey = 'f';
    joystick.keyPressTime = millis();
    joystick.isHeld = true;
  }
  else if(joystick.lastKey == 'f' && millis() - joystick.lastRepeatTime > joystick.REPEAT_INTERVAL) {
    XaxisMotor->step(5, BACKWARD, SINGLE);
    countX += 5;
    Serial.println("X RIGHT rapid: " + String(countX));
    joystick.lastRepeatTime = millis();
  }
  break;
}

case 'i':  // DOWN - Y Axis
{
  if(!joystick.isHeld) {
    YaxisMotor->step(1, FORWARD, MICROSTEP);
    countY += 1;
    Serial.println("Y DOWN single step: " + String(countY));
    joystick.lastKey = 'i';
    joystick.keyPressTime = millis();
    joystick.isHeld = true;
  }
  else if(joystick.lastKey == 'i' && millis() - joystick.lastRepeatTime > joystick.REPEAT_INTERVAL) {
    YaxisMotor->step(10, FORWARD, MICROSTEP);
    countY += 10;
    Serial.println("Y DOWN rapid: " + String(countY));
    joystick.lastRepeatTime = millis();
  }
  break;
}

case 'g':  // ANGLE DOWN (P axis)
{
  if(!joystick.isHeld) {
    PaxisMotor->step(1, FORWARD, MICROSTEP);
    joystick.lastKey = 'g';
    joystick.keyPressTime = millis();
    joystick.isHeld = true;
  }
  else if(joystick.lastKey == 'g' && millis() - joystick.lastRepeatTime > joystick.REPEAT_INTERVAL) {
    PaxisMotor->step(3, FORWARD, MICROSTEP);  // 3 steps per repeat
    joystick.lastRepeatTime = millis();
  }
  break;
}

case 'j':  // ANGLE UP (P axis)
{
  if(!joystick.isHeld) {
    PaxisMotor->step(1, BACKWARD, MICROSTEP);
    joystick.lastKey = 'j';
    joystick.keyPressTime = millis();
    joystick.isHeld = true;
  }
  else if(joystick.lastKey == 'j' && millis() - joystick.lastRepeatTime > joystick.REPEAT_INTERVAL) {
    PaxisMotor->step(3, BACKWARD, MICROSTEP);
    joystick.lastRepeatTime = millis();
  }
  break;
}

// KEY RELEASE HANDLER (add new case or use touch screen release event)
case RELEASE:  // Or use a function called when button released
{
  if(joystick.isHeld) {
    unsigned long holdDuration = millis() - joystick.keyPressTime;
    Serial.println("Key released after " + String(holdDuration) + "ms");
    joystick.isHeld = false;
    joystick.lastKey = 0;
    joystick.lastRepeatTime = 0;
  }
  break;
}

// SPEED MODE TOGGLE (add new character for mode switching)
case 's':  // Toggle between precision and fast modes
{
  fastMode = !fastMode;
  updateMotorSpeeds();
  if(fastMode) {
    Serial.println("Switched to FAST mode");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("FAST MODE");
  } else {
    Serial.println("Switched to PRECISION mode");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("PRECISION MODE");
  }
  break;
}
```

---

## 📊 Movement Speed Comparison

| Axis | Mode | Speed | Steps/Sec | Time to Move 50 Steps |
|------|------|-------|-----------|----------------------|
| Y | Precision | 100 rpm | 0.83 | 60 sec ⚠️ SLOW |
| Y | Fast | 400 rpm | 3.33 | 15 sec ✅ Better |
| X | Precision | 1000 rpm | 8.3 | 6 sec |
| X | Fast | 2000 rpm | 16.7 | 3 sec ✅ Better |
| P | Precision | 300 rpm | 2.5 | 20 sec |
| P | Fast | 800 rpm | 6.7 | 7.5 sec ✅ Better |

---

## 🎮 Joystick Behavior

### Press Once = Single Step
```
User presses RIGHT button once
  ↓
Motor steps 1x (SINGLE mode)
  ↓
User releases
  ↓
Motor stops
```

### Hold Button = Continuous Motion
```
User holds RIGHT button for 2+ seconds
  ↓
Motor steps 1x (first)
  ↓
[50ms pause]
  ↓
Motor steps 5x (continuous)
  ↓
[50ms pause]
  ↓
Motor steps 5x (continuous)
  ↓
... repeats until release
  ↓
Motor stops immediately when released
```

### Speed Mode Toggle
```
User sends 's' command (or UI button)
  ↓
All motors switch to FAST speeds
  ↓
LCD displays "FAST MODE"
  ↓
Same joystick controls, but 2-4x faster movement
```

---

## 🔧 Implementation Priority

1. **CRITICAL - Fix P Axis Home**: Prevents angle home from triggering during cutting
2. **HIGH - Add Speed Control**: Enables faster repositioning (major workflow improvement)
3. **HIGH - Joystick Control**: Enables rapid/precise movement selection

---

## ✅ Testing Checklist

- [ ] P axis home only triggers after Y moves away
- [ ] Y axis rapid mode (400 rpm) moves stone to wheel faster
- [ ] Single button press = single step precision
- [ ] Holding button for 2+ sec = rapid continuous motion
- [ ] Speed toggle works (test both precision and fast modes)
- [ ] All axes respond correctly in both modes
- [ ] Motor speeds are responsive but not jerky

---

**Ready to implement? I can apply these changes to the code now.**
