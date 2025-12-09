# Arduino Code Changes - State Broadcasting

## Overview

The Arduino is already sending position data. We just need to ensure it broadcasts complete state information consistently so the web interface can synchronize.

## Current State (What Works)

Your Arduino already has:
- `motorSpeedMultiplier` (1-5) ✓
- `stepModeEnabled` (boolean) ✓
- Position tracking (countX, countY, angle, indexPosition) ✓
- Serial output capability ✓

## What Needs Adding

The web interface needs regular state updates. Currently, the Arduino only sends data when something changes. For better synchronization, it should broadcast full state every 100ms.

---

## Code Changes

### Location 1: Add State Broadcast Function

**Where**: Add this function to your `.ino` file (anywhere outside of other functions)

```cpp
// ==================== STATE BROADCAST FUNCTION ====================
// Broadcasts current machine state every 100ms so web interface can stay synchronized

void broadcastMachineState() {
    static unsigned long lastBroadcast = 0;
    unsigned long currentTime = millis();
    
    // Broadcast every 100ms (10 times per second - smooth sync)
    if (currentTime - lastBroadcast >= 100) {
        lastBroadcast = currentTime;
        
        // Format: [DATA] pX:VALUE pY:VALUE pA:VALUE pI:VALUE spd:VALUE mod:VALUE
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
// ====================================================================
```

### Location 2: Call Broadcast in loop()

**Where**: In your main `loop()` function, add this line:

```cpp
void loop() {
    // ... your existing code ...
    
    // EXISTING CODE (keep as-is)
    // Button reading, joystick handling, etc.
    
    // ADD THIS LINE:
    broadcastMachineState();  // Send state to web every 100ms
    
    // ... rest of your loop code ...
}
```

**Example of where to place it** (in context):
```cpp
void loop() {
    // Read from serial for commands
    handleSerialInput();
    
    // Read button inputs
    readButtons();
    
    // Read joystick
    readJoystick();
    
    // Move motors if needed
    updateMotors();
    
    // BROADCAST STATE (Add here)
    broadcastMachineState();
    
    // Update Nextion display
    updateDisplay();
    
    // Small delay
    delay(10);
}
```

---

## What This Does

**Before** (Current):
- Arduino only sends data when something changes
- Web might miss updates or have stale data
- Synchronization is sporadic

**After** (With broadcasts):
- Arduino sends complete state every 100ms
- Web always has fresh data (max 100ms stale)
- AI always sees current machine condition
- Position, speed, and mode always in sync

---

## Serial Message Format

**What gets sent**:
```
[DATA] pX:150 pY:200 pA:45 pI:32 spd:3 mod:step
[DATA] pX:151 pY:200 pA:45 pI:32 spd:3 mod:step
[DATA] pX:152 pY:201 pA:45 pI:32 spd:3 mod:step
... repeats every 100ms
```

**What each part means**:
- `[DATA]` - Message type marker
- `pX:150` - X position is 150
- `pY:200` - Y position is 200
- `pA:45` - Angle (rotation) is 45°
- `pI:32` - Index position is 32 (lap selector)
- `spd:3` - Speed multiplier is 3 (of 5)
- `mod:step` - Mode is step (or "continuous")

**Web interface parses this** and updates:
```javascript
machineGlobalState.hardware.position.x = 150
machineGlobalState.hardware.position.y = 200
machineGlobalState.hardware.position.angle = 45
machineGlobalState.hardware.position.index = 32
machineGlobalState.hardware.motorSpeed = 3
machineGlobalState.hardware.motorMode = "step"
```

---

## Performance Impact

**CPU Load**: Negligible
- Serial.print() is very fast
- Only ~10 writes per second
- Non-blocking operation

**Serial Bandwidth**: Minimal
- ~80 bytes per message
- ~800 bytes per second
- Standard baud rate easily handles this

**Memory**: No increase
- Uses existing variables
- No new buffers or arrays

---

## Validation

To verify it's working:

1. **Open Arduino Serial Monitor**
2. **Set baud rate to 9600**
3. **You should see** (repeating every 100ms):
```
[DATA] pX:0 pY:0 pA:0 pI:0 spd:3 mod:continuous
[DATA] pX:0 pY:0 pA:0 pI:0 spd:3 mod:continuous
[DATA] pX:5 pY:0 pA:0 pI:0 spd:3 mod:continuous
[DATA] pX:10 pY:0 pA:0 pI:0 spd:3 mod:continuous
```

4. **Move joystick or buttons** - Values should change
5. **Change speed slider** - `spd:X` should change
6. **Toggle step mode** - `mod:` should change between "step" and "continuous"

---

## Optional Enhancement: Menu Forwarding

If your Nextion touch screen is connected, also forward menu changes so web knows what mode the user is in:

```cpp
// When menu page changes (add to existing menu change handler):
void onMenuPageChanged(uint16_t newPage) {
    // ... existing menu code ...
    
    // ADD THIS to also send to web:
    Serial.print("[MENU] page:");
    Serial.println(newPage);
}
```

**Examples**:
- Page 1 = Settings
- Page 14 = Design Mode
- Page 16 = Preform Mode
- Page 17 = Cut Mode
- Page 18 = Polish Mode

Web will receive: `[MENU] page:17` and know user is in Cut Mode.

---

## Troubleshooting

**Problem**: Serial Monitor shows garbage characters
- **Solution**: Check baud rate (should be 9600)
- **Solution**: Check USB cable is properly connected

**Problem**: Messages show `[DATA]` but values don't change
- **Solution**: This is normal if not using buttons/joystick
- **Solution**: Press buttons or move joystick to see values change

**Problem**: Web shows position as 0,0 still
- **Solution**: Ensure Arduino is connected (green light in web interface)
- **Solution**: Check that MACHINE_STATE_SYNC_CODE.js is integrated
- **Solution**: Verify serial parser has `updateHardwareStateFromArduino(line)` call

**Problem**: State broadcasts too fast or too slow
- **Solution**: Change the 100 in line `if (currentTime - lastBroadcast >= 100)` to:
  - 50 = Twice per second (more responsive, more bandwidth)
  - 200 = Half per second (less responsive, less bandwidth)
  - Keep at 100 for balance

---

## Integration Checklist

- [ ] Add `broadcastMachineState()` function to Arduino code
- [ ] Call `broadcastMachineState()` in `loop()` function
- [ ] Upload modified Arduino code
- [ ] Open Serial Monitor to verify messages appear
- [ ] Test by moving joystick/buttons
- [ ] Test by changing speed
- [ ] Test by toggling step mode
- [ ] Connect to web interface
- [ ] Verify web shows actual position (not 0,0)
- [ ] Verify AI uses correct speed (not default 1)
- [ ] Optional: Add menu forwarding if menu changes

---

## Complete Code Example

Here's what your loop might look like after changes:

```cpp
void loop() {
    // Check for serial commands from web
    if (Serial.available()) {
        handleSerialCommand();
    }
    
    // Read input devices
    readJoystickAndButtons();
    
    // Process motion commands
    if (shouldMoveX) {
        moveXAxis();
    }
    if (shouldMoveY) {
        moveYAxis();
    }
    if (shouldRotate) {
        rotateStone();
    }
    
    // Update Nextion display
    updateNexionDisplay();
    
    // BROADCAST CURRENT STATE (keeps web synchronized)
    broadcastMachineState();
    
    // Small delay to prevent overwhelming the system
    delay(10);
}
```

---

## Summary

**What You Add**: 
- 1 new function (15 lines)
- 1 function call in loop (1 line)

**What You Get**:
- Web interface always has fresh machine state
- AI can see actual speed, mode, position
- Perfect synchronization between Arduino and web
- AI guidance becomes contextually accurate

**Time to Implement**: 5 minutes
**Testing Time**: 10 minutes
**Risk Level**: Very low (just adding serial output)

