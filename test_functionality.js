// Test script to check GemBot_Control_AI.html functionality
// Run this in the browser console (F12)

console.log("=== GemBot Control AI - Function Test ===");

// Test 1: Check if mlModel exists
console.log("mlModel defined?", typeof mlModel !== 'undefined');
if (typeof mlModel !== 'undefined') {
    console.log("mlModel type:", mlModel.constructor.name);
    console.log("mlModel.load type:", typeof mlModel.load);
    console.log("mlModel.detect type:", typeof mlModel.detectObjects);
}

// Test 2: Check if serial exists
console.log("\nserial defined?", typeof serial !== 'undefined');
if (typeof serial !== 'undefined') {
    console.log("serial type:", serial.constructor.name);
    console.log("serial.scanPorts type:", typeof serial.scanPorts);
    console.log("serial.connect type:", typeof serial.connect);
    console.log("serial.sendCommand type:", typeof serial.sendCommand);
}

// Test 3: Check if sessionRecorder exists
console.log("\nsessionRecorder defined?", typeof sessionRecorder !== 'undefined');
if (typeof sessionRecorder !== 'undefined') {
    console.log("sessionRecorder type:", sessionRecorder.constructor.name);
    console.log("sessionRecorder.startRecording type:", typeof sessionRecorder.startRecording);
}

// Test 4: Check if key functions exist
console.log("\nFunction checks:");
console.log("addMessage exists?", typeof addMessage === 'function');
console.log("startCamera exists?", typeof startCamera === 'function');
console.log("stopCamera exists?", typeof stopCamera === 'function');
console.log("autoAdjustImage exists?", typeof autoAdjustImage === 'function');

// Test 5: Check if buttons exist in DOM
console.log("\nButton checks:");
const buttons = [
    'scanBtn', 'connectBtn', 'disconnectBtn', 'cameraStartBtn', 
    'cameraStopBtn', 'recordBtn', 'btnContinuous', 'btnStep',
    'btnRotateCCW', 'btnRotateCW', 'btnIndexBack', 'btnIndexFwd',
    'emergencyStop', 'btnHome', 'btnDiagnostic', 'autoAdjustBtn'
];

buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    console.log(`  ${btnId}: ${btn ? '✅ EXISTS' : '❌ MISSING'}`);
});

// Test 6: Check if key elements exist
console.log("\nElement checks:");
const elements = [
    'cameraFeed', 'mlCanvas', 'aiMessages', 'portSelect',
    'speedSlider', 'stepSlider', 'brightnesSlider', 'contrastSlider', 'saturationSlider'
];

elements.forEach(elemId => {
    const elem = document.getElementById(elemId);
    console.log(`  ${elemId}: ${elem ? '✅ EXISTS' : '❌ MISSING'}`);
});

// Test 7: Try clicking scan button
console.log("\n=== Testing Scan Button Click ===");
const scanBtn = document.getElementById('scanBtn');
if (scanBtn) {
    console.log("Clicking scanBtn...");
    scanBtn.click();
} else {
    console.log("❌ scanBtn not found");
}

console.log("\n=== Test Complete ===");
