# GemBot AI Enhancement - Quick Reference

## What's New

### 🤖 Intelligent AI Assistant
- **Knowledge Base**: Fully trained with GemBot manual information
- **Context-Aware**: Responds based on current machine state
- **Smart Hints**: Random cutting tips and best practices
- **Recovery Info**: Shows how to resume from last position

### 💾 Machine State Persistence
- **Auto-Save**: Every 2 seconds to browser localStorage
- **Power Loss Recovery**: Automatic save on disconnect
- **Position Tracking**: X, Y, angle, index logged per command
- **Mode/Speed Memory**: Remembers all settings

### 🛡️ Power Fault Detection
- **Watchdog Timer**: Monitors connection every 1 second
- **Auto-Shutdown**: Saves state on power loss
- **Emergency Stop**: Records state when 🛑 pressed
- **Recovery Point**: Position restored on reconnection

## Usage

### Ask the AI
Type in the "Ask AI for help..." box:
```
"how do I move left?"        → Detailed axis explanation
"what's my current speed?"   → Speed level with timing
"where am I?"                → Current X, Y, angle, index
"how to recover?"            → Resume from last position
"emergency stop procedure"   → Safety instructions
```

### Check Your Position
- **Status Panel** (right side): Shows X, Y, ANGLE, INDEX in real-time
- **Ask AI**: "where am I?" for formatted position info
- **Recovery Point**: Available if power fails

### Resume After Power Loss
1. **Automatic**: On startup, previous position/mode/speed loads
2. **Recovery Info**: Ask AI "how to recover?" to see saved state
3. **Manual Resume**: Use arrow buttons to return to last position
4. **Verify**: Check Status panel matches expected position

### Monitor Your Cutting
- **AI Logger**: All commands saved with timestamps
- **Position Tracking**: Every motion updates in Status panel
- **Session Log**: Full history available for debugging

## Data Saved

### Per Machine Session
```
✅ Position (X, Y, Rotation, Index)
✅ Mode (CONTINUOUS or STEP)
✅ Speed Level (1-5)
✅ Step Size (if applicable)
✅ Last Command Sent
✅ Timestamp
✅ All Commands This Session
✅ Last 50 Commands with Positions
```

### Storage Location
- **Browser**: localStorage
- **Key Name**: `gembot_machine_state`
- **Survives**: Browser restart, page refresh
- **Size**: ~3-5 KB

## AI Query Examples

### Movement Help
```
"How do I move?"
→ "📖 Available: mode, speed, position, axes, emergency stop"

"Left and right?"
→ "X-Axis (Left/Right): Left/Right - Horizontal movement. 
   LEFT=clockwise, RIGHT=counter-clockwise"

"Up down?"
→ "Y-Axis (Up/Down): Up/Down - Vertical movement. 
   UP=backward, DOWN=forward"
```

### Current Status
```
"Where am I?"
→ "📍 Current Position: X: 150 (Left/Right)
   Y: 200 (Up/Down) Rotation: 45° Index: 3"

"What mode?"
→ "🎮 Current Mode: STEP
   Click buttons = single step only. Very precise."

"How fast?"
→ "⚡ Speed Level: 3/5
   20ms - Standard cutting speed"
```

### Recovery
```
"Can I recover?"
→ "📋 Recovery Point Available:
   X: 150, Y: 200
   Mode: step, Speed: 3
   Last Command: d"
```

### Tips
```
Random hints include:
- "💡 Tip: Use STEP mode for precise cuts"
- "⚡ Tip: Lower speed (1-2) for better control"
- "🎯 Tip: Check position indicator before cutting"
- "📸 Tip: Camera helps you see the cutting surface"
- "🛑 Tip: Emergency Stop cuts power immediately"
```

## Key Features in Action

### Auto-Save
```
Every 2 seconds during operation:
Console: "💾 Machine state auto-saved"
```

### Connection Lost
```
If Arduino disconnects:
Message: "🚨 Connection lost - Machine state saved for recovery"
State: Automatically saved to localStorage
```

### Emergency Stop
```
Press 🛑 EMERGENCY STOP:
Message: "🛑 EMERGENCY STOP ACTIVATED - ALL MOTORS KILLED"
Then: "Emergency shutdown complete - All machine state saved"
Result: Motors killed instantly, state preserved
```

### Home Command
```
Press 🏠 HOME:
Message: "🏠 Homing sequence started - Returning to home position"
State: Position set to X:0, Y:0, Index:0
```

### Disconnect
```
Press DISCONNECT:
State: Machine state saved before closing port
Message: "✅ Disconnected - Machine state saved"
```

## Technical Details

### Watchdog Timer
- Checks connection status every 1 second
- If disconnected: triggers auto-save
- Prevents data loss from unexpected power failure

### Command Recording
All motor commands recorded with:
- Command character (d, e, f, i, a, w, z, j, u, h, etc.)
- Position at time of command
- Timestamp (milliseconds)
- Current mode and speed
- Stored in `machineState.sessionLog`

### State Loading
On page startup:
1. Check localStorage for previous state
2. If found: restore position, mode, speed
3. If not found: use defaults
4. Message: "📋 Loaded previous state - X: ..., Y: ..., Angle: ...°"

## Troubleshooting

### Lost Position After Power Down
**Solution**: Position auto-saved, check Status panel on reconnect

### AI Not Responding
**Check**: 
- Type complete question (e.g., "how do I move?")
- Check browser console for errors
- Refresh page if stuck

### State Not Saving
**Check**:
- Browser allows localStorage (check privacy settings)
- Not in private/incognito mode
- Disk space available

### Recovery Not Accurate
**Note**: Machine state saved at time of disconnect, may differ by ±1 step
**Solution**: Use HOME button to reset, then resume manually

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements**:
- Web Serial API (Arduino connection)
- localStorage (state persistence)
- localStorage size: ~5 KB typical

---

For detailed technical documentation, see: `AI_ENHANCEMENT_COMPLETE.md`
