# 🔧 GemBot Machine Integration System

> **Third-Party Machine Integration with Merlin AI Enhancement**
> 
> Owner: Ryan Barbrick / Barbrick Design  
> Contact: BarbrickDesign@gmail.com  
> Payment: $4200 USD via PayPal

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Licensing & Payment](#licensing--payment)
3. [System Requirements](#system-requirements)
4. [Getting Started](#getting-started)
5. [USB Connection Process](#usb-connection-process)
6. [Board Detection & Identification](#board-detection--identification)
7. [Motor Configuration Analysis](#motor-configuration-analysis)
8. [Web Control Meshing](#web-control-meshing)
9. [Testing & Debugging](#testing--debugging)
10. [Backup & Restore](#backup--restore)
11. [Troubleshooting](#troubleshooting)
12. [API Reference](#api-reference)

---

## Overview

The GemBot Machine Integration System allows third-party automated gem cutting machines to integrate with our advanced web control interface and Merlin AI enhancement system. This system provides:

### ✨ Key Features

- **USB Board Detection**: Automatic identification of Arduino, GRBL, Marlin, and other controller boards
- **Motor Configuration Analysis**: Reads and analyzes your machine's motor setup
- **Dynamic Control Meshing**: Adapts web controls to match your machine's capabilities
- **Merlin AI Enhancement**: AI-powered optimization and intelligent control
- **Configuration Backup**: Safe backup and restore of original machine settings
- **Physical Testing**: Comprehensive testing framework for motors and switches

### 🎯 Supported Board Types

| Board Type | Firmware | Baud Rate | Max Motors |
|-----------|----------|-----------|------------|
| Arduino Uno | Custom | 115200 | 4 |
| Arduino Mega | Custom | 115200 | 8 |
| GRBL | v0.9+, v1.1+ | 115200 | 6 |
| Marlin | 1.x, 2.x | 250000 | 8 |
| Smoothieware | All versions | 115200 | 6 |
| Generic | Various | 9600-115200 | 4 |

---

## Licensing & Payment

### 💳 Payment Process

**Price: $4200 USD (One-time, Lifetime License)**

1. **Make Payment**
   - Send $4200 USD to **BarbrickDesign@gmail.com** via PayPal
   - Include "GemBot Machine License" in payment note
   - Save your PayPal transaction ID

2. **Submit Verification**
   - Open the Machine Integration panel in GemBot Web Control
   - Fill out the verification form with:
     - Your name
     - Your email
     - PayPal transaction ID
   - Copy the generated verification email

3. **Contact for Activation**
   - Email verification to: **BarbrickDesign@gmail.com**
   - Subject: "GemBot Machine Integration License - Payment Verification"
   - Include your transaction ID

4. **Receive License Key**
   - Ryan Barbrick will verify your payment (within 24 hours)
   - You'll receive your unique license key via email
   - License key format: `GBMI-XXXX-XXXX-XXXX`

5. **Activate License**
   - Enter license key in the integration panel
   - Link your machine (one machine per license)
   - Begin using the system

### 📦 What's Included

✅ **Lifetime Access** to Machine Integration System  
✅ **USB Board Detection** and identification  
✅ **Motor Configuration** analysis and meshing  
✅ **Dynamic Control Layout** generation  
✅ **Merlin AI Enhancement** system access  
✅ **Configuration Backup** and restore tools  
✅ **Priority Support** from Ryan Barbrick  
✅ **Free Updates** for life  

---

## System Requirements

### Hardware

- **Desktop/Laptop** with USB ports
- **USB Cable** for machine connection
- **Supported Controller Board** (see list above)
- **Modern Web Browser** (Chrome, Edge, Opera recommended)

### Software

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Browser**: Chrome 89+, Edge 89+, or Opera 76+
- **Node.js**: 14.0+ (for local USB bridge server)
- **NPM**: 6.0+ (included with Node.js)

### Network

- **Internet Connection** for license verification and Merlin AI
- **WiFi** (optional, for mobile device integration)

---

## Getting Started

### Step 1: Install Dependencies

```bash
# Clone the repository (if not already installed)
git clone https://github.com/barbrickdesign/GemBotAiWebControl.git
cd GemBotAiWebControl

# Install Node.js dependencies
npm install
```

### Step 2: Start Local Server

```bash
# Start the main server
npm start

# Or for development with auto-reload
npm run dev
```

The server will start on `http://localhost:8000`

### Step 3: Open Web Interface

1. Open your browser
2. Navigate to `http://localhost:8000`
3. The GemBot Control Interface will load

### Step 4: Access Machine Integration

1. Click the **"Machine Integration"** button in the main menu
2. Or navigate to the settings panel
3. Select **"Third-Party Machine Setup"**

---

## USB Connection Process

### Connection Steps

1. **Connect Physical USB Cable**
   - Connect your machine's controller board to your computer via USB
   - Ensure the machine is powered on
   - Wait for operating system to recognize the device

2. **Open Machine Integration Panel**
   - Click **"Scan for Machines"** button
   - Browser will prompt you to select a serial port
   - Select your machine's COM port from the list

3. **Authorize Connection**
   - Browser will ask for permission to access the serial port
   - Click **"Allow"** to grant permission
   - Connection will be established automatically

4. **Wait for Identification**
   - System will automatically identify the board type
   - This takes 2-5 seconds
   - Progress indicator will show detection status

### Troubleshooting Connection

**Port Not Showing Up?**
- Check USB cable is properly connected
- Try a different USB port
- Restart your computer
- Check device drivers are installed

**Permission Denied?**
- Close other programs using the serial port (Arduino IDE, PlatformIO, etc.)
- Restart the browser
- Run browser as administrator (Windows)

**Connection Timeout?**
- Try different baud rates (9600, 115200, 250000)
- Check machine is powered on
- Verify controller board is functioning

---

## Board Detection & Identification

### Automatic Detection Process

The system sends identification commands to the connected board:

```
1. Send: M115\n     (Marlin version request)
2. Send: $$\n       (GRBL settings request)
3. Send: version\n  (Smoothieware version request)
```

The board's response determines its type and configuration.

### Detection Results

You'll see a panel showing:

- **Board Type**: Arduino Uno, Mega, GRBL, Marlin, etc.
- **Firmware Version**: Version number of the firmware
- **Manufacturer**: Brand or creator
- **Baud Rate**: Communication speed
- **Max Motors**: Maximum supported motors/axes

### Manual Configuration

If automatic detection fails:

1. Click **"Manual Configuration"**
2. Select board type from dropdown
3. Set baud rate manually
4. Confirm selection

---

## Motor Configuration Analysis

### Analysis Process

Once the board is identified, the system analyzes motor configuration:

#### For GRBL Controllers

```gcode
$$ - List all settings
$x=value - Get specific setting
$# - View coordinate offsets
```

The system extracts:
- Number of axes (X, Y, Z, A, B, C)
- Steps per mm for each axis
- Max speeds and accelerations
- Homing configuration
- Soft limits

#### For Marlin Controllers

```gcode
M503 - Report settings
M92 - Steps per unit
M201 - Max acceleration
M203 - Max feedrates
```

The system extracts:
- Stepper motor configuration
- Endstop configuration
- Temperature sensors (if applicable)
- Extruder settings (if applicable)

### Configuration Display

The analysis results show:

```javascript
{
  axes: ['X', 'Y', 'Z'],
  motors: [
    {
      axis: 'X',
      type: 'stepper',
      stepsPerRev: 200,
      microstepping: 16,
      maxSpeed: 1000,
      acceleration: 500
    },
    // ... more motors
  ],
  capabilities: {
    hasSpindle: true,
    hasCoolant: true,
    hasProbe: false,
    hasHeatedBed: false
  }
}
```

---

## Web Control Meshing

### Dynamic Button Layout

Based on the motor configuration, the system generates a custom control layout:

#### Basic Layout (2-axis machines)

```
[Home] [Start] [Stop] [Pause] [Reset]
[X+] [X-] [Y+] [Y-]
```

#### Advanced Layout (3+ axis machines)

```
[Home] [Start] [Stop] [Pause] [Reset]
[X+] [X-] [Y+] [Y-] [Z+] [Z-]
[Jog] [Zero] [Goto]
```

#### Full Layout (with accessories)

```
[Home] [Start] [Stop] [Pause] [Reset]
[X+] [X-] [Y+] [Y-] [Z+] [Z-] [A+] [A-]
[Jog] [Zero] [Goto] [Probe]
[Spindle On] [Spindle Off] [Speed: ____]
[Coolant On] [Coolant Off]
```

### Layout Customization

You can customize the layout:

1. Click **"Customize Layout"**
2. Drag and drop buttons to reposition
3. Add/remove buttons as needed
4. Click **"Save Layout"**

Layouts are saved to your license and machine profile.

### Control Meshing Process

1. **Read Machine Capabilities**
   - Parse motor configuration
   - Identify available features
   - Detect accessories (spindle, coolant, probe)

2. **Generate Control Mapping**
   - Map machine commands to web controls
   - Create button actions
   - Setup keyboard shortcuts

3. **Apply to Web Interface**
   - Update button layout
   - Bind event handlers
   - Enable/disable features

4. **Test Controls**
   - Verify each button function
   - Test joystick input
   - Validate command execution

---

## Testing & Debugging

### Physical Motor Testing

The system includes a comprehensive testing suite:

#### Test Sequence

1. **Connection Test**
   - Verify serial communication
   - Check command/response
   - Measure latency

2. **Motor Test**
   - Each axis tested individually
   - Small movements (1mm)
   - Verify direction
   - Check speed control

3. **Switch Test**
   - Test each limit switch
   - Verify home switch
   - Check emergency stop

4. **Full Movement Test**
   - Multi-axis coordinated movement
   - Speed ramping
   - Acceleration testing

#### Running Tests

```javascript
// Access testing framework
const tester = window.MachineIntegrationHub;

// Run all tests
await tester.runAllTests();

// Run specific test
await tester.testMotor('X');
await tester.testSwitch('X_MIN');

// View test results
console.log(tester.getTestResults());
```

### Debug Console

Access the debug console:

1. Press `F12` to open browser DevTools
2. Go to **Console** tab
3. View real-time command log:

```
> SEND: G0 X10
< OK
> SEND: G0 Y5
< OK
```

### Logging Configuration

```javascript
// Enable verbose logging
window.MachineIntegrationHub.config.logLevel = 'verbose';

// Log all serial communication
window.MachineIntegrationHub.config.logSerial = true;
```

---

## Backup & Restore

### Automatic Backup

The system automatically backs up your machine configuration on first connection:

```javascript
{
  machineId: "machine_1234567890",
  boardType: "grbl",
  timestamp: "2025-12-19T02:00:00.000Z",
  configuration: {
    // Full GRBL $$ settings
    "$0": "10",
    "$1": "25",
    // ...
  }
}
```

### Manual Backup

Create a manual backup:

1. Click **"Backup Configuration"**
2. System reads current settings
3. Backup saved to localStorage
4. Download backup file (optional)

### Restore Original Configuration

If anything goes wrong:

1. Click **"Restore Original"**
2. Confirm restoration
3. System writes original settings back to machine
4. Machine reboots with original configuration

### Export/Import Backups

```javascript
// Export backup to file
const backup = window.MachineIntegrationHub.exportBackup();
// Download as JSON file

// Import backup from file
await window.MachineIntegrationHub.importBackup(backupData);
```

---

## Troubleshooting

### Common Issues

#### Machine Not Detected

**Symptoms**: "No machine found" error

**Solutions**:
- Check USB cable connection
- Try different USB port
- Restart machine
- Update USB drivers
- Close other serial programs

#### Wrong Board Type Detected

**Symptoms**: Incorrect firmware identification

**Solutions**:
- Use manual configuration
- Update firmware to latest version
- Check baud rate settings
- Try different identification commands

#### Controls Not Working

**Symptoms**: Buttons don't move machine

**Solutions**:
- Verify machine is not in alarm state
- Check emergency stop is not active
- Ensure machine is homed (if required)
- Test with manual G-code commands
- Check motor enable pins

#### Configuration Lost

**Symptoms**: Machine settings reverted

**Solutions**:
- Restore from backup
- Re-run configuration wizard
- Check EEPROM is functioning
- Flash firmware if needed

### Support

For additional support:

- **Email**: BarbrickDesign@gmail.com
- **Priority Support**: Included with license
- **Response Time**: Within 24 hours for licensed users

---

## API Reference

### MachineIntegrationHub

Main integration system API.

#### Methods

##### `init()`
Initialize the integration system.

```javascript
await window.MachineIntegrationHub.init();
```

##### `scanForMachines()`
Scan for connected machines.

```javascript
const machine = await window.MachineIntegrationHub.scanForMachines();
```

##### `connectMachine()`
Complete connection workflow.

```javascript
const result = await window.MachineIntegrationHub.connectMachine();
// Returns: { machine, motorConfig, layout }
```

##### `analyzeMotorConfiguration()`
Analyze motor setup.

```javascript
const config = await window.MachineIntegrationHub.analyzeMotorConfiguration();
```

##### `generateControlLayout(motorConfig)`
Generate dynamic control layout.

```javascript
const layout = window.MachineIntegrationHub.generateControlLayout(motorConfig);
```

##### `backupOriginalScript()`
Backup machine configuration.

```javascript
const backup = await window.MachineIntegrationHub.backupOriginalScript();
```

##### `restoreOriginalScript()`
Restore original configuration.

```javascript
await window.MachineIntegrationHub.restoreOriginalScript();
```

##### `getStatus()`
Get current status.

```javascript
const status = window.MachineIntegrationHub.getStatus();
// Returns: { initialized, licensed, connected, machine, licensing }
```

### PayPalMachineLicensing

Payment and licensing API.

#### Methods

##### `submitPaymentVerification(paymentData)`
Submit payment for verification.

```javascript
const result = await window.PayPalMachineLicensing.submitPaymentVerification({
  name: 'John Doe',
  email: 'john@example.com',
  transactionId: 'PAYPAL-XXXXXX'
});
```

##### `verifyLicense(licenseKey)`
Verify a license key.

```javascript
const verification = await window.PayPalMachineLicensing.verifyLicense('GBMI-XXXX-XXXX-XXXX');
```

##### `linkMachine(licenseKey, machineFingerprint)`
Link license to machine.

```javascript
await window.PayPalMachineLicensing.linkMachine(licenseKey, machineFingerprint);
```

##### `generateMachineFingerprint()`
Generate unique machine ID.

```javascript
const fingerprint = window.PayPalMachineLicensing.generateMachineFingerprint();
```

---

## License Agreement

This software and integration system is provided by Ryan Barbrick / Barbrick Design.

**Terms:**
- One license per machine
- Lifetime updates included
- Non-transferable without approval
- Commercial use permitted
- Modifications allowed for personal use
- Priority support included

**Contact:**
- Email: BarbrickDesign@gmail.com
- Payment: PayPal to BarbrickDesign@gmail.com
- Price: $4200 USD one-time payment

---

© 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.
