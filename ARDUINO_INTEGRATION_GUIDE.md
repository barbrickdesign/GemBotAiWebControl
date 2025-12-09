# GemBot Arduino Integration Guide

**Status:** Integration & Troubleshooting Guide  
**Target Hardware:** Arduino Mega 2560  
**Display:** Nextion Serial Display (Serial1: pins 18/19)  
**Web Interface:** GemBot_Web_Control_DualMode.html  
**Date:** December 2, 2025

---

## 🔴 Current Issues & Solutions

### Issue 1: WebSocket Server Connection Failed
**Error:** `Connection timeout` at localhost:3000

**Causes:**
- Node.js server not running
- Server running on different port
- Server crashed or not started
- Firewall blocking port 3000

**Solutions:**
1. **Start the server manually:**
   ```bash
   npm install
   npm start
   ```

2. **Verify server is running:**
   - Check console: Should say `Server running on port 3000`
   - Open browser: http://localhost:3000 (should show page)

3. **Check if port 3000 is in use:**
   ```powershell
   netstat -ano | findstr :3000
   ```

4. **Kill process using port 3000:**
   ```powershell
   taskkill /PID <PID> /F
   ```

---

### Issue 2: Serial Port Connection Failed
**Error:** `Failed to execute 'open' on 'SerialPort': Failed to open serial port`

**Causes:**
- Arduino not properly connected via USB
- Wrong COM port selected
- Arduino drivers not installed
- Serial port already open by another application
- Baud rate mismatch

**Solutions:**

#### A. Verify Hardware Connection
1. **Check USB cable:** Use known-working USB cable
2. **Check COM port appears in Device Manager:**
   - Windows: Devices & Printers → COM Ports
   - Should see: "Arduino Mega 2560" or "CH340" device

#### B. Install Arduino Drivers
If COM port doesn't appear:
1. Download CH340 drivers (if using compatible board):
   - http://www.wch.cn/downloads/CH341SER_EXE.html
2. Or install official Arduino IDE (includes drivers)

#### C. Verify Browser Support
- **Chrome/Edge/Opera:** Support Serial API ✅
- **Firefox/Safari:** Use WebSocket mode only ❌ (no Serial API)

#### D. Disable Other Applications
- Close Arduino IDE serial monitor
- Close PuTTY, Tera Term, or other serial tools
- Close any application using COM port

#### E. Refresh Port List
1. Disconnect Arduino
2. Click "Scan Ports" (should show empty)
3. Reconnect Arduino
4. Click "Scan Ports" again (should appear)

---

## 🟢 Arduino Sketch Analysis

### Current Configuration

**Serial Ports:**
```cpp
Serial.begin(9600);           // USB debugging (COM port visible to browser)
Serial1.begin(9600);          // Nextion display (pins 18/19)
// Serial2 available for future expansion
```

**Pin Mapping:**
- **D0-D3 (pins 11,7,9,8):** Index motor control
- **D11,D12:** Enable pins for index motor
- **D22-D24:** Limit switches (P, X, Y)
- **D2-D7:** Other limit switches
- **D30-D36:** Keypad pins
- **D34-D36:** Keypad columns
- **D30-D33:** Keypad rows
- **A4/A5:** I2C (LCD display)

**Motor Control:**
```cpp
// Motor Shield 1 (AFMS) - 5V
Adafruit_StepperMotor *YaxisMotor = AFMS.getStepper(200, 2);

// Motor Shield 2 (AFMS2) - 12V
Adafruit_StepperMotor *PaxisMotor = AFMS2.getStepper(200, 1);
Adafruit_StepperMotor *XaxisMotor = AFMS2.getStepper(200, 2);
```

---

## 📡 Serial Communication Protocol

### From Web Interface → Arduino

The sketch listens on `Serial` (USB) for commands in the `getKey()` function:

**Control Commands (Single Character):**
```
'0' = Enter/Start
'1' = Left
'2' = Exit
'3' = Right
'8' = Print menu (currently unused in web interface)
```

**Movement Commands (Sent via Serial):**
```
'd' = Move X axis left
'f' = Move X axis right
'e' = Move Y axis up
'i' = Move Y axis down
'c' = Step index motor forward
'b' = Step index motor backward
'a' = Home calibration
'p' = Decrease stone width
'o' = Increase stone width
'q' = Increase desired width
'r' = Decrease desired width
```

**Nextion Display Commands (Serial1):**
```cpp
Serial1.print("page N");        // Go to page N (0-18)
Serial1.print("\xFF\xFF\xFF");  // Nextion terminator (required)
```

### From Arduino → Web Interface

The sketch outputs JSON status via `Serial.println()`:

**Current Format (JSON):**
```json
{
  "shape": "Round",
  "design": "32 Fold",
  "facet": 1,
  "angle": 51.0,
  "index": 4,
  "stage": "Preform",
  "calib": {
    "x": 1000,
    "y": 2500
  },
  "tip": "Ready to cut girdle facets"
}
```

---

## ✅ Recommended Arduino Code Modifications

### 1. Add Baud Rate Check Function

**Add after `setup()` function:**

```cpp
// Verify Serial communication is working
void verifySerialConnection() {
  Serial.println("=== GemBot Serial Connection Test ===");
  Serial.println("Device: Arduino Mega 2560");
  Serial.println("Baud Rate: 9600");
  Serial.println("Status: CONNECTED");
  Serial.println("Ready for web interface commands");
  Serial.println("=====================================");
  delay(1000);
}
```

**Call in `setup()` after `Serial.begin(9600);`:**
```cpp
Serial.begin(9600);
delay(500);
verifySerialConnection();
```

### 2. Improve Command Handling

**Replace the current `getKey()` function** to handle both Nextion and web commands:

```cpp
// Enhanced key input handling for web interface
KeyType getKey(){
    KeyType key = KeyNone;
    
    // Check USB serial (from web interface)
    if (Serial.available() > 0) {
        char webCommand = Serial.read();
        // Log for debugging
        Serial.print("WEB CMD: ");
        Serial.println(webCommand);
        
        // Map web commands to key types
        switch (webCommand) {
            case '0': return KeyEnter;
            case '1': return KeyLeft;
            case '2': return KeyExit;
            case '3': return KeyRight;
            default: break;
        }
    }
    
    // Check Nextion display (Serial1)
    if (Serial1.available() > 0) {
        char nextionCmd = Serial1.read();
        // Handle Nextion commands here
        return key;
    }
    
    return key;
}
```

### 3. Add JSON Status Output

**Add this function for real-time status:**

```cpp
// Output current machine state as JSON for web monitoring
void outputCurrentState() {
    StaticJsonDocument<512> doc;
    
    // Machine state
    doc["connected"] = true;
    doc["device"] = "GemBot_001";
    doc["timestamp"] = millis();
    
    // Position data
    JsonObject pos = doc.createNestedObject("position");
    pos["x"] = countX;
    pos["y"] = countY;
    pos["index"] = indexNumber;
    pos["angle"] = homePPosition;
    
    // Calibration data
    JsonObject calib = doc.createNestedObject("calibration");
    calib["chuckX"] = calibratedXPositionChuck;
    calib["chuckY"] = calibratedYPositionChuck;
    calib["dopX"] = calibratedXPositionDop;
    calib["dopY"] = calibratedYPositionDop;
    
    // Stone dimensions
    JsonObject stone = doc.createNestedObject("stone");
    stone["roughWidth"] = roughStoneWidth;
    stone["roughHeight"] = roughStoneHeight;
    stone["currentWidth"] = roundWidth;
    stone["desiredWidth"] = roundDesiredWidth;
    
    // Output as JSON
    String json;
    serializeJson(doc, json);
    Serial.println(json);
}
```

**Call periodically in `loop()` (every 500ms):**
```cpp
static unsigned long lastStatusOutput = 0;
if (millis() - lastStatusOutput > 500) {
    outputCurrentState();
    lastStatusOutput = millis();
}
```

---

## 🌐 Web Interface → Arduino Command Mapping

Update the `GemBot_Web_Control_DualMode.html` to match Arduino commands:

### Current Web Commands
```javascript
// Direction pad
UP    → sends '8'  (currently unused)
DOWN  → sends '8'  (currently unused)
LEFT  → sends '1'  (KeyLeft)
RIGHT → sends '3'  (KeyRight)
ENTER → sends '0'  (KeyEnter)

// Quick buttons (to be mapped)
Button 1: Design       → should send '8' (print menu)
Button 2: Preform      → should navigate to Preform
Button 3: Cut          → should navigate to Cut
Button 4: Polish       → should navigate to Polish
Button 5: Settings     → should send 'S' (custom)
Button 6: Home         → should send 'H' (custom)
```

### Recommended Web Commands

**Update web interface to send:**
```
Navigation: 0,1,2,3 (Enter, Left, Exit, Right)
Movement:   d,e,f,i (X-left, Y-up, X-right, Y-down)
Index:      b,c     (Index back, Index forward)
Home:       a,H     (Calibration, Home all axes)
Calibrate:  C       (Chuck calibration)
Dopple:     D       (Dop calibration)
```

---

## 🔧 Step-by-Step Troubleshooting Checklist

### Step 1: Hardware Verification
- [ ] Arduino connected via USB to computer
- [ ] COM port appears in Device Manager
- [ ] Using Chrome/Edge/Opera browser (not Firefox/Safari)
- [ ] USB cable is known-working (not damaged)

### Step 2: Driver Installation
- [ ] Arduino drivers installed (check Device Manager)
- [ ] No yellow warning icons on COM port
- [ ] Device shows as "Arduino Mega" not "Unknown Device"

### Step 3: Port Scanning Test
- [ ] Open `GemBot_Web_Control_DualMode.html` in Chrome
- [ ] Click "Scan Ports" button
- [ ] Verify COM port appears in dropdown
- [ ] Note the exact COM port number (e.g., COM3)

### Step 4: Connection Test
- [ ] Select correct COM port from dropdown
- [ ] Click "Connect" button
- [ ] Wait 5 seconds for connection
- [ ] Check browser console (F12) for errors

### Step 5: Serial Communication Test
- [ ] Open Arduino IDE Serial Monitor
- [ ] Set baud rate to 9600
- [ ] Should see: "=== GemBot Serial Connection Test ===" (after modification)
- [ ] Close Arduino IDE serial monitor
- [ ] Try web interface again

### Step 6: Network Server Test (if using Server mode)
- [ ] Open terminal/PowerShell
- [ ] Navigate to project folder
- [ ] Run: `npm install` (if not done)
- [ ] Run: `npm start`
- [ ] Should see: "Server running on port 3000"
- [ ] Wait 10 seconds
- [ ] Try web interface WebSocket mode

---

## 🐛 Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to open serial port` | Port in use | Close Arduino IDE, close terminal, restart |
| `Port not found` | Arduino disconnected | Reconnect USB, refresh scan |
| `Connection timeout` | Server not running | Run `npm start` in terminal |
| `Connection refused` | Wrong port number | Scan ports again, verify COM port |
| `No devices found` | Drivers missing | Install Arduino drivers |
| `CORS error` | Server not running | Start server, use localhost:3000 |

---

## 📋 Arduino Code Quality Improvements

### Current Issues in Sketch

1. **Duplicate includes** (lines 1, 67, 70)
   - `#include <SPI.h>` appears twice
   - Should consolidate

2. **Duplicate Serial.begin()** (lines 285, 328)
   - First at line 285
   - Second at line 328
   - Should use only one

3. **Duplicate menu printing** (lines 348-388)
   - `printMenuEntry()` has identical code blocks
   - Should use loop or if/else if

4. **Stub functions** (lines 1840+)
   - Many functions declared but not implemented
   - Should either implement or remove

### Recommended Refactoring

1. **Consolidate includes** to top of file
2. **Remove duplicate Serial.begin()**
3. **Create helper function for page switching:**
   ```cpp
   void loadNextionPage(int pageNumber) {
       Serial1.print("page ");
       Serial1.print(pageNumber);
       Serial1.print("\xFF\xFF\xFF");
   }
   ```

4. **Implement stub functions** with actual code
5. **Add error handling** for motor operations

---

## 🚀 Next Steps

### For Browser Serial API (Direct USB)

1. **Verify Arduino is detected:**
   - Open web interface
   - Click "Scan Ports"
   - Arduino should appear in dropdown

2. **Add diagnostic output:**
   - Modify Arduino to print status on startup
   - Web interface should display in serial monitor

3. **Test commands:**
   - Click direction buttons
   - Check Arduino responds
   - Monitor serial output

### For WebSocket Server (Network)

1. **Start Node.js server:**
   ```bash
   npm start
   ```

2. **Verify server running:**
   - Should say "Server running on port 3000"
   - Open http://localhost:3000 in browser

3. **Switch web interface to Server mode:**
   - Select "Server (WebSocket)" radio button
   - Set server to "localhost:3000"
   - Click "Connect"

### For Production Deployment

1. **Arduino modifications needed:**
   - Add `verifySerialConnection()` function
   - Improve `getKey()` for robust command parsing
   - Add `outputCurrentState()` for JSON status

2. **Web interface customization:**
   - Map buttons to actual Arduino commands
   - Add command logging for debugging
   - Implement state synchronization

3. **Testing checklist:**
   - [ ] All directional buttons work
   - [ ] Motors respond to commands
   - [ ] Status updates in real-time
   - [ ] Limit switches trigger correctly
   - [ ] Nextion display updates appropriately

---

## 📞 Support Resources

**Arduino Serial Communication:**
- Official: https://www.arduino.cc/reference/en/language/functions/communication/serial/
- Serial Events: https://www.arduino.cc/en/Tutorial/BuiltInExamples/SerialEvent

**Web Serial API:**
- MDN Docs: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API
- Chrome Support: https://caniuse.com/web-serial

**Nextion Display:**
- Documentation: https://nextion.itead.cc/resources/
- Instruction Set: Search "Nextion Instruction Set"

**ArduinoJSON:**
- Official: https://arduinojson.org/
- Assistant: https://arduinojson.org/v6/assistant/

---

**Document Version:** 1.0  
**Last Updated:** December 2, 2025  
**Status:** Ready for Implementation
