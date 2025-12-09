# 📋 Menu Controls & Nextion Integration

## Overview

Menu controls enable you to navigate the Nextion touch screen directly from the web controller, mirroring the commands that the Arduino receives from the physical touch screen. This creates a fully integrated web-to-hardware control system.

## Menu Control Features

### 1. **Menu Navigation Buttons**

Three buttons for navigating the Nextion touch screen menu:

- **◀ LEFT** - Navigate left in menu (sends: `0`)
- **ENTER** - Select/confirm menu item (sends: `1`)
- **▶ RIGHT** - Navigate right in menu (sends: `3`)

**Location in UI:** Left Panel > MENU CONTROL Section

### 2. **Touch Screen Sync**

A dedicated sync button to fetch all current variable values from the Nextion touch screen:

- **📥 SYNC** - Fetches all variables and updates the web interface
- **Sync Status Display** - Shows current sync state (Ready/Syncing/Synced)

## Nextion Protocol Integration

The `NextionInterface` class handles all communication with the Nextion HMI.

### Nextion Variables Fetched

```javascript
{
    // Motor Control Variables
    motorSpeed: 1,              // Speed level 1-5
    motorMode: 'continuous',    // 'step' or 'continuous'
    motorStepSize: 1,           // Step size 1-70
    
    // Position Variables
    positionX: 0,               // X-axis position
    positionY: 0,               // Y-axis position
    rotationAngle: 0,           // Rotation angle in degrees
    indexPosition: 0,           // Index position
    
    // System Variables
    connectionStatus: 'disconnected',  // Connection state
    machineMode: 'idle',              // Machine operational state
    systemVoltage: 0,                 // System voltage
    systemCurrent: 0,                 // System current
    
    // Touch Screen State
    currentMenu: 'main',        // Current menu displayed
    selectedStone: '',          // Currently selected stone
    cuttingPhase: 'roughing'    // Current cutting phase
}
```

## Command Format

### Menu Navigation Commands

Commands are sent to the Arduino, which forwards them to the Nextion:

```
LEFT:   '0'
ENTER:  '1'
RIGHT:  '3'
```

Example:
```javascript
serial.sendCommand('0');  // Navigate left in menu
serial.sendCommand('1');  // Select menu item
serial.sendCommand('3');  // Navigate right in menu
```

### Variable Request Commands

Fetch variables from Nextion using the `get` command:

```
get motorSpeed      -> Nextion responds with: motorSpeed=3
get motorMode       -> Nextion responds with: motorMode=step
get positionX       -> Nextion responds with: positionX=125
```

### Variable Set Commands

Update variables on Nextion:

```
set motorSpeed 5    -> Sets speed to level 5 on Nextion
set motorMode step  -> Sets mode to step on Nextion
```

## Usage Examples

### Basic Menu Navigation

```javascript
// Navigate the touch screen menu from web controller
document.getElementById('btnMenuLeft').click();  // Go left in menu
document.getElementById('btnMenuEnter').click(); // Select item
document.getElementById('btnMenuRight').click(); // Go right in menu
```

### Fetch All Variables

```javascript
// Sync all variables from Nextion
document.getElementById('btnSyncVariables').click();

// Or programmatically:
await nextion.fetchAllVariables();
console.log(nextion.variables);  // View all synced values
```

### Get Specific Variable

```javascript
// Request a specific variable
await nextion.requestVariable('motorSpeed');
console.log(nextion.variables.motorSpeed);  // Get the value
```

### Set Variable on Nextion

```javascript
// Update a variable on the Nextion
nextion.setVariable('motorSpeed', 4);
nextion.setVariable('motorMode', 'step');
nextion.setVariable('selectedStone', 'Ruby');
```

## Integration with Web Controller

### Auto-Sync on Connection

When you connect to the Arduino, the Nextion interface automatically initializes:

```javascript
// In serial.connect() method:
setTimeout(() => {
    nextion.initialize();  // Auto-fetch all variables
}, 1000);
```

### UI Updates from Nextion

When variables are synced, the web UI automatically updates:

```javascript
// Speed display
document.getElementById('speedDisplay').textContent = nextion.variables.motorSpeed;

// Mode buttons
if (nextion.variables.motorMode === 'step') {
    document.getElementById('btnStep').classList.add('active');
}

// Position display
document.getElementById('statusX').textContent = nextion.variables.positionX;
document.getElementById('statusY').textContent = nextion.variables.positionY;
```

## Serial Communication Flow

### Menu Navigation Flow

```
Web UI Button Click
        ↓
JavaScript Handler
        ↓
serial.sendCommand('0')  // Menu command
        ↓
Arduino Serial Port
        ↓
Arduino → Nextion HMI
        ↓
Nextion Touch Screen Updates
```

### Variable Sync Flow

```
btnSyncVariables Click
        ↓
nextion.fetchAllVariables()
        ↓
Sends batch of "get" commands:
  get motorSpeed
  get motorMode
  get positionX
  ...
        ↓
Arduino Serial Port → Nextion
        ↓
Nextion Responds:
  motorSpeed=3
  motorMode=step
  positionX=125
  ...
        ↓
nextion.processVariableResponse(data)
        ↓
UI Updates Automatically
```

## JavaScript API

### NextionInterface Class

#### Methods

```javascript
// Send a command to Nextion
nextion.sendCommand(cmd)
// Returns: boolean (success/failure)

// Request a specific variable
await nextion.requestVariable(varName)
// Returns: Promise<value>

// Fetch all variables at once
await nextion.fetchAllVariables()
// Returns: Promise<object> (all variables)

// Process incoming variable response
nextion.processVariableResponse(data)
// Parses "varName=value" format

// Update web UI with current values
nextion.updateUI()
// Updates all display elements

// Set a variable on Nextion
nextion.setVariable(varName, value)
// Returns: boolean (success/failure)

// Initialize interface and sync
await nextion.initialize()
// Returns: Promise<boolean>
```

#### Properties

```javascript
nextion.variables              // Object containing all fetched variables
nextion.lastUpdateTime         // Timestamp of last sync
nextion.responseTimeout        // Timeout for waiting for responses (ms)
```

## Error Handling

### Connection Not Available

```javascript
if (!serial.isConnected) {
    console.warn('⚠️ Not connected');
    addMessage('⚠️ Not connected. Please connect first.', 'warning');
}
```

### Sync Timeout

```javascript
// If Nextion doesn't respond within responseTimeout (1000ms):
syncStatus.textContent = '❌ Sync failed';
console.error('❌ Sync error: Timeout');
```

### Variable Not Found

```javascript
// If variable doesn't exist on Nextion:
// The requestVariable promise will timeout
reject(new Error(`Timeout waiting for ${variableName}`));
```

## Troubleshooting

### Menu Buttons Not Working

**Problem:** Clicking menu buttons has no effect

**Solution:**
1. Ensure Arduino is connected (check connection status)
2. Verify Nextion is powered and responding
3. Check Arduino baud rate (should be 9600 or 115200)
4. Inspect browser console for error messages

### Variables Not Syncing

**Problem:** Sync button shows "Sync failed" or "❌ Sync failed"

**Solution:**
1. Check Arduino connection
2. Verify Nextion variable names match those in the code
3. Wait 1-2 seconds after connecting before syncing
4. Check Arduino serial monitor for communication

### Variables Not Updating UI

**Problem:** Sync completes but UI doesn't change

**Solution:**
1. Verify variable names in `VARIABLES_TO_FETCH` list
2. Check that HTML element IDs match the update code
3. Ensure Nextion is actually updating variables
4. Check browser console for JavaScript errors

## Hardware Configuration

### Arduino Serial Communication

The Arduino acts as a bridge:

```
Nextion HMI (Serial1)
        ↓
Arduino (receives commands from web + Nextion)
        ↓
Web Controller (via USB Serial)
        ↓
Browser WebSerial API
```

### Baud Rate Configuration

- **Web → Arduino:** 9600 or 115200 baud (auto-detected)
- **Arduino → Nextion:** Should match Nextion configuration (typically 9600)

## Command Reference Quick Guide

| Button | Command | Purpose |
|--------|---------|---------|
| ◀ LEFT | `0` | Navigate left in menu |
| ENTER | `1` | Select/confirm menu item |
| ▶ RIGHT | `3` | Navigate right in menu |
| 📥 SYNC | `get *` | Fetch all variables |

## Advanced Usage

### Custom Variable Polling

```javascript
// Continuously sync variables every 5 seconds
setInterval(() => {
    if (isConnected) {
        nextion.fetchAllVariables();
    }
}, 5000);
```

### Bi-directional Sync

```javascript
// When speed changes in web UI, update Nextion
speedSlider.addEventListener('input', (e) => {
    const newSpeed = e.target.value;
    nextion.setVariable('motorSpeed', newSpeed);
});

// When user adjusts Nextion, fetch and update web
setInterval(() => {
    nextion.fetchAllVariables();
}, 2000);
```

### Menu Navigation Automation

```javascript
// Simulate menu navigation sequence
async function navigateMenu() {
    serial.sendCommand('3');  // Right
    await sleep(300);
    serial.sendCommand('3');  // Right
    await sleep(300);
    serial.sendCommand('1');  // Enter
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Status Indicators

### Sync Status Display Colors

- **Ready** (Gray `#aaa`) - Waiting for sync command
- **⏳ Syncing...** (Blue `#667eea`) - Sync in progress
- **✅ Synced** (Green `#4a7c2e`) - Sync successful
- **❌ Sync failed** (Red `#d32f2f`) - Sync failed, check connection

### Console Logging

All menu and sync operations log to browser console:

```
📱 Nextion Command: 0
📋 Menu LEFT button pressed - sending "0"
📱 Fetching all variables from Nextion...
📱 Sent 10 variable requests to Nextion
✅ Nextion interface initialized
```

## Testing Menu Controls

### Manual Test Procedure

1. **Connect Arduino**
   - Click SCAN
   - Select port
   - Click CONNECT
   - Verify "Connected" status

2. **Test Menu Navigation**
   - Click ◀ LEFT - Nextion should respond
   - Click ENTER - Nextion should select
   - Click ▶ RIGHT - Nextion should navigate

3. **Test Variable Sync**
   - Click 📥 SYNC button
   - Wait for status to change
   - Verify status displays "✅ Synced"
   - Check that position values updated

4. **Verify Communication**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Observe command logs
   - Check for any error messages

## Integration Checklist

- ✅ Menu control buttons added to UI
- ✅ NextionInterface class implemented
- ✅ Serial communication for menu commands
- ✅ Variable fetching via Nextion protocol
- ✅ Auto-initialization on connection
- ✅ UI updates from synced variables
- ✅ Error handling and status display
- ✅ Console logging for debugging

## Support

For issues with menu controls or Nextion sync:

1. Check browser console for error messages
2. Verify Arduino is connected and responsive
3. Ensure Nextion display is powered
4. Check Arduino serial monitor for communication
5. Verify variable names match Nextion configuration
