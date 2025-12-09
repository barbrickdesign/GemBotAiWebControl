# 📱 Nextion Protocol & Command Details

## Overview

The Nextion HMI (Human Machine Interface) communicates with the Arduino via serial protocol. The web controller can send commands to the Nextion through the Arduino bridge.

## Command Protocol

### Basic Command Format

**Nextion Command Structure:**
```
command [parameters] [0xFF 0xFF 0xFF]
```

The three `0xFF` bytes are the command terminator (required by Nextion protocol).

### Menu Navigation Commands

These commands navigate the Nextion touch screen menu:

```
Command: 0       (Navigate Left)
Command: 1       (Select/Enter)
Command: 3       (Navigate Right)
```

**Implementation:**
```javascript
serial.sendCommand('0');  // Left
serial.sendCommand('1');  // Enter
serial.sendCommand('3');  // Right
```

## Variable System

### Getting Variables

**Format:**
```
get variable_name
```

**Example:**
```
get motorSpeed
get motorMode
get positionX
get selectedStone
```

**Nextion Response:**
```
variable_name=value
```

**Examples:**
```
motorSpeed=3
motorMode=step
positionX=125
selectedStone=Ruby
```

### Setting Variables

**Format:**
```
set variable_name value
```

**Examples:**
```
set motorSpeed 4
set motorMode continuous
set selectedStone Emerald
```

## Communication Protocol

### Serial Port Configuration

- **Baud Rate:** 9600 (default Nextion) or 115200
- **Data Bits:** 8
- **Stop Bits:** 1
- **Parity:** None
- **Flow Control:** None

### Message Format

All messages to Nextion should end with newline (`\n`) or the 3-byte terminator:

```javascript
// Method 1: Newline termination (used in implementation)
"get motorSpeed\n"

// Method 2: 0xFF 0xFF 0xFF termination (Nextion native)
"get motorSpeed" + String.fromCharCode(0xFF, 0xFF, 0xFF)
```

## Implemented Variables

### Motor Control Variables

```javascript
motorSpeed        // Type: Number (1-5)
                 // Description: Motor speed level
                 // Default: 1

motorMode        // Type: String ('step' or 'continuous')
                // Description: Motor operation mode
                // Default: 'continuous'

motorStepSize    // Type: Number (1-70)
                // Description: Step size in step mode
                // Default: 1
```

### Position Variables

```javascript
positionX        // Type: Number
                // Description: X-axis position
                // Default: 0
                // Range: Depends on hardware

positionY        // Type: Number
                // Description: Y-axis position
                // Default: 0
                // Range: Depends on hardware

rotationAngle    // Type: Number
                // Description: Stone rotation angle in degrees
                // Default: 0
                // Range: 0-360

indexPosition    // Type: Number
                // Description: Index/lap position
                // Default: 0
                // Range: Depends on hardware
```

### System Variables

```javascript
connectionStatus // Type: String
                // Values: 'connected', 'disconnected', 'error'
                // Default: 'disconnected'

machineMode     // Type: String
                // Values: 'idle', 'running', 'homing', 'error'
                // Default: 'idle'

systemVoltage   // Type: Number
                // Description: System supply voltage (V)
                // Default: 0

systemCurrent   // Type: Number
                // Description: System current draw (A)
                // Default: 0
```

### Touch Screen State Variables

```javascript
currentMenu      // Type: String
                // Description: Current menu page
                // Examples: 'main', 'settings', 'cut_mode'
                // Default: 'main'

selectedStone    // Type: String
                // Description: Currently selected gemstone
                // Examples: 'Diamond', 'Ruby', 'Sapphire'
                // Default: ''

cuttingPhase     // Type: String
                // Values: 'roughing', 'fine_cutting', 'polishing'
                // Default: 'roughing'
```

## Variable Response Processing

### Response Format

When Nextion responds to a `get` command:

```
variable_name=value\n
```

### Parsing

```javascript
// In NextionInterface.processVariableResponse(data):
const parts = data.trim().split('=');
const [varName, varValue] = parts;

// Try parsing as number first
const numVal = parseInt(varValue, 10);
const finalValue = isNaN(numVal) ? varValue : numVal;

// Update internal cache
this.variables[varName] = finalValue;
```

## Command Examples

### Complete Variable Fetch Sequence

```
WEB CONTROLLER → ARDUINO → NEXTION
get motorSpeed
get motorMode
get motorStepSize
get positionX
get positionY
get rotationAngle
get indexPosition
get currentMenu
get selectedStone
get cuttingPhase

NEXTION → ARDUINO → WEB CONTROLLER
motorSpeed=3
motorMode=step
motorStepSize=1
positionX=125
positionY=87
rotationAngle=45
indexPosition=0
currentMenu=main
selectedStone=Ruby
cuttingPhase=fine_cutting
```

### Menu Navigation Sequence

```
User clicks "Right" button
WEB → ARDUINO → NEXTION
3

NEXTION UPDATES DISPLAY
(Menu moves right)

WEB → ARDUINO → NEXTION
1

NEXTION RESPONDS
(Selects menu item)
```

## Error Handling

### Response Timeout

If Nextion doesn't respond within `responseTimeout` (1000ms):

```javascript
reject(new Error(`Timeout waiting for ${variableName}`));
```

### No Response

If command is sent but no response received:

```
Status: "❌ Sync failed"
Console: "❌ Sync error: Timeout"
```

### Invalid Variable Name

If variable doesn't exist on Nextion:

```
NEXTION → ARDUINO: (No response)
TIMEOUT after 1000ms
ERROR: "Timeout waiting for nonexistentVariable"
```

## Hardware Communication Flow

### Complete Data Flow

```
┌─────────────────────────────────────────────┐
│        WEB BROWSER (JavaScript)             │
│  ┌─────────────────────────────────────┐   │
│  │ NextionInterface (nextion)          │   │
│  │ - sendCommand()                     │   │
│  │ - requestVariable()                 │   │
│  │ - fetchAllVariables()               │   │
│  │ - setVariable()                     │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼──────────────────────────┘
                  │ WebSerial API
                  ↓
┌─────────────────────────────────────────────┐
│        ARDUINO (Serial Bridge)              │
│  ┌─────────────────────────────────────┐   │
│  │ Serial Input (from Web)             │   │
│  │ Process: Forward to Nextion         │   │
│  │ Serial Output (from Nextion)        │   │
│  │ Process: Forward to Web             │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼──────────────────────────┘
                  │ UART/Serial
                  ↓
┌─────────────────────────────────────────────┐
│     NEXTION DISPLAY (HMI)                   │
│  ┌─────────────────────────────────────┐   │
│  │ Command Processor                   │   │
│  │ - Parse commands (0, 1, 3)          │   │
│  │ - Get variable values               │   │
│  │ - Set variable values               │   │
│  │ - Update display                    │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────↓──────────────────────┐   │
│  │ Touch Screen Display                │   │
│  │ - Current menu                      │   │
│  │ - Position display                  │   │
│  │ - Status indicators                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Synchronization Strategy

### Auto-Sync on Connection

```javascript
// When Arduino connects:
setTimeout(() => {
    nextion.initialize();  // Fetch all variables
}, 1000);
```

### Manual Sync

```javascript
// User clicks SYNC button:
document.getElementById('btnSyncVariables').click();
→ nextion.fetchAllVariables();
→ Sends 10 get commands
→ Waits 500ms for responses
→ Updates UI automatically
```

### Continuous Polling (Optional)

```javascript
// Update every 5 seconds:
setInterval(() => {
    if (isConnected) {
        nextion.fetchAllVariables();
    }
}, 5000);
```

## Nextion Configuration Requirements

To use these commands with your Nextion display, ensure:

1. **Serial Communication Enabled**
   - Nextion firmware supports serial input
   - Serial port configured correctly

2. **Variable Names Match**
   - All variable names in code match Nextion variable names
   - Case-sensitive matching required

3. **Baud Rate Consistency**
   - Arduino → Nextion: Default 9600 or configured rate
   - Web → Arduino: Auto-detected (9600, 115200, etc.)

4. **Nextion Code (Sample)**
   ```
   // In Nextion Editor, create variables:
   int motorSpeed = 1;
   text motorMode = "continuous";
   int positionX = 0;
   int positionY = 0;
   
   // Add touch commands to buttons:
   On Click: recvCommand("0")  // Left
   On Click: recvCommand("1")  // Enter
   On Click: recvCommand("3")  // Right
   ```

## Troubleshooting Guide

### Commands Not Reaching Nextion

**Check:**
1. Arduino is connected (web console shows "Connected")
2. Nextion is powered and responsive
3. Serial cable is properly connected
4. Baud rate matches configuration

**Debug:**
```javascript
// Check serial connection
console.log(serial.isConnected);        // Should be true
console.log(serial.port);               // Should show port info

// Manually send command
serial.sendCommand('0');                // Should log: "📡 TRANSMITTING: '0'"
```

### Variables Not Updating

**Check:**
1. Variable names match exactly (case-sensitive)
2. Nextion has these variables defined
3. Sync button shows "✅ Synced" status
4. Check browser console for errors

**Debug:**
```javascript
// Check current variables
console.log(nextion.variables);         // Should show fetched values

// Manually request a variable
await nextion.requestVariable('motorSpeed');
console.log(nextion.variables.motorSpeed);
```

### Sync Timeout

**Check:**
1. Nextion is responding to serial input
2. Arduino serial monitor shows responses
3. Nextion variable names are correct

**Debug:**
```javascript
// Increase timeout and try again
nextion.responseTimeout = 2000;         // 2 seconds
await nextion.fetchAllVariables();
```

## Implementation Checklist

- ✅ Menu navigation commands (0, 1, 3)
- ✅ Variable get/set protocol
- ✅ Response parsing
- ✅ Error handling
- ✅ Timeout handling
- ✅ UI updates
- ✅ Status indicators
- ✅ Auto-sync on connection
- ✅ Console logging

## Reference Documents

- **MENU_CONTROLS_IMPLEMENTATION.md** - Full feature documentation
- **MENU_CONTROLS_QUICK_START.md** - Quick usage guide
- **GemBot_Control_AI.html** - Implementation code

---

**Nextion Protocol Version:** 1.0  
**Implementation Date:** December 8, 2025  
**Status:** ✅ Complete
