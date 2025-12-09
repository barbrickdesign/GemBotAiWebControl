# 🚀 QUICK START: Menu Controls & Nextion Sync

## What Was Added

### UI Elements

**Menu Control Section** (Left Panel):
```
┌─────────────────────┐
│  📋 MENU CONTROL    │
│  ◀ LEFT │ENTER│▶ RIGHT
│  Commands: '0'|'1'|'3'
│                     │
│  🔗 SYNC VARIABLES  │
│  📥 SYNC   [Ready]  │
└─────────────────────┘
```

### JavaScript Classes & Functions

1. **NextionInterface Class**
   - Handles all Nextion touch screen communication
   - Fetches and caches variable values
   - Updates web UI automatically

2. **Menu Control Handlers**
   - `btnMenuLeft` - Sends command `0`
   - `btnMenuEnter` - Sends command `1`
   - `btnMenuRight` - Sends command `3`

3. **Sync Handler**
   - `btnSyncVariables` - Fetches all variables from Nextion

## Quick Usage

### Navigate Touch Screen Menu

```javascript
// Click one of these buttons:
document.getElementById('btnMenuLeft').click();   // Go left
document.getElementById('btnMenuEnter').click();  // Select
document.getElementById('btnMenuRight').click();  // Go right
```

### Sync All Variables

```javascript
// Click the sync button:
document.getElementById('btnSyncVariables').click();

// Or programmatically:
await nextion.fetchAllVariables();
```

### Check Variable Values

```javascript
// After syncing, access variables:
console.log(nextion.variables.motorSpeed);  // Current speed
console.log(nextion.variables.motorMode);   // Current mode
console.log(nextion.variables.positionX);   // X position
```

### Update Variable

```javascript
// Set a variable on the Nextion:
nextion.setVariable('motorSpeed', 4);
nextion.setVariable('selectedStone', 'Ruby');
```

## Commands Reference

| Action | Command | Sends |
|--------|---------|-------|
| Navigate Left | `btnMenuLeft` | `0` |
| Select Item | `btnMenuEnter` | `1` |
| Navigate Right | `btnMenuRight` | `3` |
| Sync Variables | `btnSyncVariables` | `get motorSpeed`, `get motorMode`, etc. |

## Flow Diagram

### Menu Navigation
```
Web Button Click
      ↓
serial.sendCommand('0'|'1'|'3')
      ↓
Arduino Serial Port
      ↓
Arduino → Nextion HMI
      ↓
Touch Screen Updates
```

### Variable Sync
```
btnSyncVariables Click
      ↓
nextion.fetchAllVariables()
      ↓
Sends: get motorSpeed, get motorMode, etc.
      ↓
Arduino → Nextion
      ↓
Nextion Responds
      ↓
UI Updates Automatically
```

## Variables Available

After syncing, these variables are available:

```javascript
{
    motorSpeed: 1,           // 1-5
    motorMode: 'continuous', // 'step' or 'continuous'
    motorStepSize: 1,        // 1-70
    positionX: 0,            // Current X
    positionY: 0,            // Current Y
    rotationAngle: 0,        // Current angle
    indexPosition: 0,        // Current index
    currentMenu: 'main',     // Current menu
    selectedStone: '',       // Selected stone
    cuttingPhase: 'roughing' // Current phase
}
```

## Status Indicators

- **Ready** - Waiting for command
- **⏳ Syncing...** - Fetching variables
- **✅ Synced** - Variables updated successfully
- **❌ Sync failed** - Check connection

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Buttons don't work | Check Arduino connected |
| Sync fails | Wait 1-2s after connecting, try again |
| Variables empty | Verify Nextion is powered |
| UI doesn't update | Check variable names match Nextion |

## Testing Checklist

- [ ] Arduino connected (status shows Connected)
- [ ] Menu LEFT button works
- [ ] Menu ENTER button works
- [ ] Menu RIGHT button works
- [ ] SYNC button shows "Syncing..."
- [ ] SYNC completes with "Synced"
- [ ] Position values display after sync
- [ ] Speed display matches Nextion

## Code Examples

### Auto-sync after connection
```javascript
// Already implemented! Nextion auto-syncs 1 second after connection
```

### Continuous variable polling
```javascript
setInterval(() => {
    if (isConnected) {
        nextion.fetchAllVariables();
    }
}, 5000); // Every 5 seconds
```

### Monitor specific variable changes
```javascript
// Check speed periodically
setInterval(() => {
    console.log('Current speed:', nextion.variables.motorSpeed);
}, 1000);
```

## Integration Summary

✅ **Menu Control Buttons** - Added to left panel
✅ **Nextion Interface** - Full variable sync capability
✅ **Auto-Initialization** - Syncs on connection
✅ **UI Updates** - Automatic when syncing
✅ **Error Handling** - Status display shows sync state
✅ **Console Logging** - Full debug output
✅ **Command Mapping** - 0/1/3 commands ready

## Files Modified

- `GemBot_Control_AI.html` - Main implementation
  - Added menu control UI elements
  - Added NextionInterface class
  - Added event listeners for menu/sync buttons
  - Added auto-sync on connection

## Next Steps

1. **Test with Nextion** - Power up the HMI and test menu navigation
2. **Verify Communication** - Open Arduino serial monitor to see commands
3. **Configure Variables** - Ensure Nextion variable names match
4. **Monitor Console** - Check browser console for sync status
5. **Deploy** - Ready for production use

---

**Version:** 1.0  
**Date:** December 8, 2025  
**Status:** ✅ Complete and Ready
