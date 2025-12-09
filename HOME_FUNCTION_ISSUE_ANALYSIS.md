# Home Function Issue Analysis - GemBot WorkingMini2025

**Date:** December 6, 2025  
**Issue:** After Switch Test, Home function sometimes fails:
- Y axis doesn't trigger limit switch
- Y axis goes down and angle just sets to 90 instead of completing home
- Workaround: Re-running home function fixes it

---

## 🔍 Root Cause Identified

### Problem #1: Y Limit Switch State Not Reset After Switch Test

**Location:** `settingsHome()` function (line 2768)

```cpp
void settingsHome(){
  limitSwitchy.resetCount();  // ← This DOES reset count
  int ystepCount = 0;
  // ... but the switch STATE may still be "pressed" from switchTest()
```

**Issue:** The `resetCount()` only resets the *count*, NOT the actual button state. If the Y switch was pressed during `switchTest()` and not released, the `limitSwitchy.isPressed()` call in `settingsHome()` will fail because the switch is already in the pressed state.

### Problem #2: Y Limit Switch State Tracking

**In switchTest()** (line 2436):
```cpp
while(testYSet != 90){
    limitSwitchy.loop();
    if(limitSwitchy.isPressed()){
        // ... test complete
        testYSet = 90;  // Exit loop WITHOUT waiting for release
    }
}
```

**Then immediately after**, if user navigates to `settingsHome()` without releasing the Y switch physically:
- The ezButton library still thinks the switch is pressed
- `limitSwitchy.isPressed()` returns false (because it only triggers on transitions: untouched→touched)
- The home function can't detect when the switch is pressed again

### Problem #3: P Axis Gets Set to 90 Early

**Location:** `settingsHome()` (line 2866)

```cpp
while(homePSet != 90){
    limitSwitchp.loop();
    PaxisMotor->step(1,BACKWARD,MICROSTEP);
    if(limitSwitchp.isPressed()){
        homePSet = 90;  // ← P angle is set to 90 immediately
        // ...
    }
}
```

If the Y limit switch detection fails (Problem #1), the code skips the Y homing while loop and jumps directly to P angle homing. This explains why you see "angle just sets to 90 without proper home function."

---

## ✅ Solutions

### Solution #1: Force Limit Switch State Reset

Add explicit state reset in `settingsHome()`:

```cpp
void settingsHome(){
  // Reset Y limit switch state completely
  limitSwitchy.resetCount();
  limitSwitchy.loop();  // Call loop to update internal state
  
  // Wait for switch to be released (if pressed)
  int releaseTimeout = 0;
  while(limitSwitchy.getState() == 1 && releaseTimeout < 200) {
    limitSwitchy.loop();
    delay(10);
    releaseTimeout++;
  }
  
  if(releaseTimeout >= 200) {
    Serial.println("WARNING: Y limit switch not released after Switch Test!");
  }
  
  // Now safe to home
  int ystepCount = 0;
  homeYSet = 0;
  // ... rest of code
```

### Solution #2: Add Explicit Switch Release Detection

Add a "release wait" before starting home sequence:

```cpp
void settingsHome(){
  limitSwitchy.resetCount();
  limitSwitchy.loop();
  
  // Ensure Y switch is fully released
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Ready to Home");
  lcd.setCursor(0,1);
  lcd.print("Waiting for release");
  
  // Wait up to 2 seconds for switch to be released
  unsigned long startTime = millis();
  while(limitSwitchy.getState() == 1 && (millis() - startTime) < 2000) {
    limitSwitchy.loop();
    delay(10);
  }
  
  // Now proceed with homing
  lcd.clear();
  int ystepCount = 0;
  homeYSet = 0;
  // ... rest of code
```

### Solution #3: Check Switch State Before Motion

Add safety check in Y homing loop:

```cpp
while(homeYSet == 0){
  limitSwitchy.loop();
  
  // Safety: Skip motion if switch is already pressed
  if(limitSwitchy.getState() == 0) {  // Only move if not pressed
    YaxisMotor->step(1,BACKWARD,SINGLE);
    ystepCount += 1;
  }
  
  if(limitSwitchy.isPressed()){
    // Switch just got pressed
    Serial.println("y limit switch: Untouched -> Touched 16");
    homeYSet = homeYSet + 1;
    // ... offset and positioning
  }
  
  // Timeout safety: If no press after 5000 steps, abort
  if(ystepCount > 5000) {
    Serial.println("ERROR: Y homing timeout - switch may be stuck!");
    homeYSet = 1;
    // Could add retry logic here
  }
}
```

### Solution #4: Recommended Comprehensive Fix

**Best approach - combine Solutions #1 and #3:**

```cpp
void settingsHome(){
  // Part 1: Reset and wait for release
  limitSwitchy.resetCount();
  limitSwitchy.loop();
  
  Serial.println("DEBUG: settingsHome() - Resetting Y limit switch");
  
  // Wait for Y switch to be fully released (from Switch Test)
  unsigned long releaseTimeout = millis();
  while(limitSwitchy.getState() == 1) {
    limitSwitchy.loop();
    delay(5);
    if(millis() - releaseTimeout > 2000) {
      Serial.println("ERROR: Y switch stuck in pressed state!");
      break;
    }
  }
  
  Serial.println("DEBUG: Y switch ready for homing");
  
  // Part 2: Proceed with normal homing
  int ystepCount = 0;
  homeYSet = 0;
  homeYSet2 = 0;
  homeYPosition = 0;
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Homing Y");
  
  while(homeYSet == 0){
    limitSwitchy.loop();
    
    // Step only if switch not currently pressed
    if(limitSwitchy.getState() == 0) {
      YaxisMotor->step(1,BACKWARD,SINGLE);
      ystepCount += 1;
    }
    
    // Detect press transition
    if(limitSwitchy.isPressed()){
      Serial.println("Y switch pressed at step: " + String(ystepCount));
      lcd.print(" Set");
      homeYSet = homeYSet + 1;
      
      // Offset from switch
      YaxisMotor->step(100,FORWARD,MICROSTEP);
      homeYPosition = 0;
      
      // Double-check for bouncing
      delay(50);
    }
    
    // Timeout protection
    if(ystepCount > 10000) {
      Serial.println("ERROR: Y homing exceeded 10000 steps!");
      homeYSet = 1;
      break;
    }
  }
  
  // Continue with X and P homing...
}
```

---

## 📋 Comparison Table

| Issue | Before | After |
|-------|--------|-------|
| Y switch state after test | May be stuck pressed | Explicitly released |
| Y motion detection | Miss transitions | Reliably detects |
| Angle jumping to 90 | Yes (skips Y homing) | No (Y completes first) |
| Timeout protection | None | 10000 step limit |
| Debug visibility | Minimal | Full state logging |

---

## 🧪 Testing Procedure

After implementing the fix:

1. Run **Switch Test** (press all 3 switches)
2. Immediately run **Home** function
3. Verify:
   - ✅ Y axis moves up toward switch
   - ✅ Y switch triggers (see "y limit switch: Untouched -> Touched" in console)
   - ✅ Y axis backs off 100 steps
   - ✅ X homing proceeds
   - ✅ P angle sets to 90
   - ✅ Manual Control page displays

4. Run Home 5+ times consecutively without reset
   - All attempts should succeed consistently

---

## 📝 Recommendation

Implement **Solution #4** as it:
- ✅ Handles state reset properly
- ✅ Adds timeout protection
- ✅ Provides debug output to diagnose issues
- ✅ Prevents motion during problematic states
- ✅ Most robust against bounce/timing issues

The issue is definitely **not** in the touch screen script - it's the switch state not being properly managed between functions.

