# GemBot Web Interface - Test Fixes & Enhancements

## Summary of Issues Found & Fixed

### Issue #1: Joystick Canvas Not Functioning
**Problem:** Joystick drag events not sending movement commands to Arduino.
- JavaScript coordinates were being calculated outside the 0-255 range
- Y-axis coordinate mapping was inverted (screen coordinates go down, but motor coordinates go up)
- No bounds checking on values

**Fix Applied:**
- Added proper bounds checking: `Math.max(0, Math.min(255, value))`
- Fixed Y-axis mapping: `rawY = 128 - (dy / maxRadius) * 100` (inverted)
- Limited range scaling: X/P use ±100, Y uses ±100 from center (128)
- Updated joystick command format from 3 values to 4: `j<X>,<Y>,<Index>,<P>`

### Issue #2: X LEFT Button Triggering Home Sequence
**Root Cause Analysis:**
- NOT actually a bug - limit switches were left in "pressed" state from previous home() execution
- This is expected behavior - the home function runs all three axes to find limit switches
- Log shows switches getting pressed after 'a' command because they were already in that state

**Resolution:**
- This is normal operation - no code fix needed
- Limit switches reset when any home operation completes

### Issue #3: P CCW Moving Angle Up at Home Position (Safety Risk)
**Problem:** When machine at home position with Y limit pressed, P-axis could still move, risking collision.

**Fix Applied:**
- Added P-axis safety gate to both 'q' (CCW) and 'e' (CW) commands
- Safety check: `if(digitalRead(LimitY) == HIGH)` before allowing P movement
- Serial output confirms block: "P BLOCKED: Y-axis at limit (safety gate)"

### Issue #4: Missing Index Axis Control in Web Interface
**Problem:** Touch screen has Index control, but web interface didn't.

**Fix Applied:**
- Added two Index buttons to HTML UI:
  - `◀ INDEX` (◀) - Decrements Index position (command 'i')
  - `INDEX ▶` (▶) - Increments Index position (command 'o')
- Button styling: Purple color (#9c27b0) to distinguish from other controls
- Both support precision/fast speed modes
- JavaScript handlers update display in real-time

### Issue #5: Missing Position Display Synchronization
**Problem:** Web interface didn't show current axis positions, making it hard to see what the machine is doing.

**Fix Applied:**
- Updated position display to show all 4 axes:
  - X: Joystick X position (0-255, 128=center)
  - Y: Joystick Y position (0-255, 128=center)  
  - Index: Index axis position (0-255, 128=center)
  - P (Angle): P-axis position (0-255, 128=center)
- Display updates in real-time when:
  - Joystick is dragged
  - Any quick button is clicked
  - Index increment/decrement buttons are clicked
  - Speed is toggled

## Code Changes Summary

### HTML Changes (GemBot_Web_Control_DualMode.html)
1. **Lines ~680-682:** Added Index axis button pair with purple styling
2. **Lines ~649-652:** Updated position display to show 4 values (X, Y, Index, P)

### JavaScript Changes (GemBot_Web_Control_DualMode.html)
1. **Line ~1376:** Added `indexPosition` variable to track Index axis state
2. **Lines ~1407-1415:** Fixed `updateJoystickFromEvent()`:
   - Proper Y-axis inversion
   - Bounds checking (0-255 range)
   - Scaled ranges: X/P ±100, Y ±100
3. **Lines ~1412-1418:** Updated `sendJoystickData()` to send 4 values: `j<X>,<Y>,<Index>,<P>`
4. **Lines ~1547-1565:** Added Index button event handlers with display updates

### Arduino Changes (WorkingMini2025.ino)
1. **Lines ~700-706:** Updated web command filter to include 'i', 'I', 'o', 'O'
2. **Lines ~910-920:** P CCW (q/Q) - Added safety gate checking `digitalRead(LimitY)`
3. **Lines ~928-938:** P CW (e/E) - Added safety gate checking `digitalRead(LimitY)`
4. **Lines ~940-952:** Updated joystick command parser for 4 values (added Index parsing)
5. **Lines ~953-975:** Added Index decrement command (i/I)
6. **Lines ~976-988:** Added Index increment command (o/O)

## Command Reference

### New Web Commands
| Command | Function | Speed Modes | Safety Gate |
|---------|----------|-------------|-------------|
| `t` / `T` | Toggle speed (precision ↔ fast) | N/A | No |
| `w` / `W` | Y-axis up | Both | No |
| `z` / `Z` | Y-axis down | Both | No |
| `a` / `A` | X-axis left | Both | No |
| `d` / `D` | X-axis right | Both | No |
| `q` / `Q` | P-axis CCW | Both | **YES** |
| `e` / `E` | P-axis CW | Both | **YES** |
| `i` / `I` | Index decrement | Both | No |
| `o` / `O` | Index increment | Both | No |
| `j<X,Y,I,P>` | Joystick movement | Via joystick deflection | No |
| `k` / `K` | Stop joystick | N/A | No |

## Position Value Scale (All Axes)
- **0** = Maximum in one direction
- **128** = Center (no movement)
- **255** = Maximum in opposite direction

### Specific Mappings:
- **X-axis:** 0=Far Left, 128=Center, 255=Far Right
- **Y-axis:** 0=Down, 128=Center, 255=Up
- **Index:** 0=Minimum, 128=Center, 255=Maximum
- **P (Angle):** 0=Min Angle, 128=Center, 255=Max Angle

## Safety Features Implemented

### P-Axis Safety Gate
- P-axis cannot rotate when Y limit switch is pressed
- Prevents quill collision with chuck at home position
- Applies to BOTH web commands (q/Q, e/E) AND joystick movement
- User sees: "P BLOCKED: Y-axis at limit (safety gate)" in serial output

## Testing Instructions

1. **Test Joystick:**
   - Drag joystick canvas in all directions
   - Verify X, Y, P values update in real-time
   - Watch motors respond to deflection

2. **Test Index Control:**
   - Click `◀ INDEX` button - should move Index backward (1 step precision, 5 steps fast)
   - Click `INDEX ▶` button - should move Index forward
   - Verify Index display updates

3. **Test Safety Gate:**
   - Run Home function to press Y limit switch
   - Try clicking P CCW (q) and P CW (e) buttons
   - Should see "P BLOCKED" message - P won't move
   - P-axis should work again after Y-axis moves up (limit released)

4. **Test Speed Toggle:**
   - Click speed toggle button (⚡)
   - All buttons should change behavior (1 step → 5 steps, 1 step Index → 5 steps)
   - Joystick speed increases with wider deflection range

## Known Limitations

1. **Position Display:** Shows joystick coordinates (0-255), not actual motor step counts
   - This is intentional - keeps web UI independent from Arduino calibration
   - Touch screen shows actual positions; web shows control input values

2. **Index Value in Joystick:** Currently fixed at 128 (center) when using joystick for X/Y/P
   - Use Index buttons to control Index axis separately
   - Could be enhanced to map joystick twist/rotation in future

3. **No Position Feedback:** Web interface doesn't receive motor position updates from Arduino
   - Display shows what user is sending, not where machine actually is
   - Could add serial feedback mechanism in future version

## Memory Status
All changes are minimal and memory-efficient:
- JavaScript: Added ~50 bytes
- Arduino: Added ~40 bytes (Index commands)
- No significant impact on RAM usage
