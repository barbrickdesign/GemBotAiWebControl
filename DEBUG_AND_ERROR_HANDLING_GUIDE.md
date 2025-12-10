# GemBot Debug & Error Handling Guide

## Quick Reference

### Console Debug Command
Open browser DevTools (F12) and type:
```javascript
merlinDebug()        // Show all sections
merlinDebug('state') // Machine state only
merlinDebug('serial')// Serial connection
merlinDebug('ai')    // AI systems status
merlinDebug('feedback') // Feedback system
merlinDebug('errors')   // Error log
merlinDebug('games')    // Game systems
merlinDebug('ui')       // UI elements check
```

---

## Error Handling System

### GemBotErrorHandler
Automatically captures all JavaScript errors:
- `window.onerror` - Catches runtime errors
- `unhandledrejection` - Catches Promise rejections
- Stores last 50 errors in `localStorage`

### Access Error Log
```javascript
// Get all errors
GemBotErrorHandler.getErrors()

// Clear errors
GemBotErrorHandler.clearErrors()

// Log custom error
GemBotErrorHandler.logError('Custom error message', 'MySource')
```

### Error Log Format
```json
{
  "timestamp": "2025-06-11T10:30:00.000Z",
  "message": "Error description",
  "source": "script.js",
  "line": 123,
  "column": 45,
  "stack": "Error stack trace..."
}
```

---

## State Management Overview

### Three State Objects

1. **machineGlobalState** (Primary global state)
   - `machineGlobalState.hardware.position` - X, Y, rotation, index
   - `machineGlobalState.hardware.lastUpdate` - Timestamp
   - `machineGlobalState.touchScreen` - Nextion display status
   - `machineGlobalState.web` - Connection status

2. **machineState** (MachineStateManager instance)
   - `machineState.position` - Current position
   - `machineState.operationMode` - step/continuous
   - `machineState.isHomed` - Homing status
   - Auto-saves to localStorage every 30 seconds

3. **nextion.variables** (Nextion sync object)
   - `positionX`, `positionY`, `rotationAngle`, `indexPosition`
   - `motorSpeed`, `motorMode`
   - Synced on serial data and SYNC button

### Data Flow
```
Serial Port → parsePositionData() → updateStatusBox()
                                      ↓
                    ┌─────────────────┼─────────────────┐
                    ↓                 ↓                 ↓
              nextion.variables  machineGlobalState  machineState
                    ↓                 ↓                 ↓
              Nextion Sync        AI Context      Auto-Save
```

---

## AI Systems Status Check

### Verify AI is Working
```javascript
// Check Merlin personality
merlin.userProfile

// Check adaptive AI
window.merlinAdaptive

// Check screen context
window.merlinScreen

// Test AI response
gemBotAI.getSmartContextResponse('test', {})
```

### Feedback System
```javascript
// Log bad AI response
feedbackSystem.logBadResponse('Response text', 'category', 'comment')

// Export all feedback
feedbackSystem.exportFeedback()

// Get learning suggestions
feedbackSystem.getLearningConcept('topic')
```

---

## Common Debug Scenarios

### 1. Serial Not Connecting
```javascript
merlinDebug('serial')
// Check: Connected status, Port info
```

### 2. Position Not Updating
```javascript
merlinDebug('state')
// Check: machineGlobalState.hardware.lastUpdate
// Should update when serial data received
```

### 3. AI Not Responding
```javascript
merlinDebug('ai')
// Check: All systems show "Loaded" or "Active"
```

### 4. UI Elements Missing
```javascript
merlinDebug('ui')
// Check: All elements show content, not "MISSING"
```

### 5. JavaScript Errors Occurring
```javascript
merlinDebug('errors')
// Shows last 5 errors with timestamps
```

---

## Build Info
- **Commit**: e5e38e8
- **Date**: 2025-06-11
- **Features Added**:
  - GemBotErrorHandler with localStorage persistence
  - merlinDebug() console helper
  - Fixed updateStatusBox() state sync
  - machineGlobalState.hardware.lastUpdate tracking

---

## Files Modified

| File | Changes |
|------|---------|
| GemBot_Control_AI.html | +194 lines (error handler, debug helper, state sync fix) |

---

## Previous Enhancements (This Session)

1. ✅ Global error handler with window.onerror
2. ✅ unhandledrejection Promise error capture  
3. ✅ localStorage error persistence (50 error limit)
4. ✅ updateStatusBox() syncs to nextion.variables
5. ✅ updateStatusBox() syncs to machineGlobalState
6. ✅ lastUpdate timestamp tracking
7. ✅ merlinDebug() console command
8. ✅ Debug sections: state, serial, ai, feedback, errors, games, ui
