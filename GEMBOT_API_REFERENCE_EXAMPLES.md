# GemBot API Reference & Code Examples
**Quick copy-paste commands for gemstone cutting operations**

---

## 🎯 Most Useful Commands

### Change Grinding Wheel
```javascript
// Start with coarse grit (rough shaping)
virtualMachine.changeGrindingWheel('coarse');

// Switch to medium grit (refining)
virtualMachine.changeGrindingWheel('medium');

// Fine grit (pre-polish)
virtualMachine.changeGrindingWheel('fine');

// Polish grit (final shine)
virtualMachine.changeGrindingWheel('polish');

// Check which wheel is loaded
console.log('Current wheel:', virtualMachine.getCurrentWheel());
```

### Move Y-Axis (Height Control)
```javascript
// Lower platform toward wheel (start cutting)
virtualMachine.moveMotor('y', 50);   // Small movement
virtualMachine.moveMotor('y', 100);  // Medium movement
virtualMachine.moveMotor('y', 200);  // Large movement

// Raise platform away from wheel (retract)
virtualMachine.moveMotor('y', -50);   // Small raise
virtualMachine.moveMotor('y', -100);  // Medium raise
virtualMachine.moveMotor('y', -200);  // Large raise
```

### Index Rotation (Facet Positioning)
```javascript
// One facet = ~33 microsteps (3200 steps ÷ 96 positions)
const FACET_STEPS = 33;

// Rotate to next facet
virtualMachine.moveMotor('x', FACET_STEPS);

// Rotate to specific facet number
function rotateToFacet(facetNumber) {
    const targetPosition = facetNumber * FACET_STEPS;
    virtualMachine.setMotorPosition('x', targetPosition);
}

// Example: Go to facet #15
rotateToFacet(15);
```

### Check Machine Status
```javascript
// Get all current positions
const positions = virtualMachine.getMotorPositions();
console.log('X (Index):', positions.x, 'microsteps');
console.log('Y (Height):', positions.y, 'microsteps');
console.log('P (Spindle):', positions.p, 'microsteps');

// Get current wheel
console.log('Wheel:', virtualMachine.getCurrentWheel());

// Check if moving
console.log('Is moving:', virtualMachine.isMoving);
```

---

## 💎 Complete Cutting Sequence Example

```javascript
// =====================================================
// GEMSTONE CUTTING SEQUENCE FOR BRILLIANT CUT
// 57 facets total = 57 × 3 operations
// =====================================================

const FACET_STEPS = 33;
const GRIT_SEQUENCE = [
    { wheel: 'coarse', passes: 1, depth: 150 },  // Rough shaping
    { wheel: 'medium', passes: 1, depth: 100 },  // Refine
    { wheel: 'fine', passes: 1, depth: 50 },     // Pre-polish
    { wheel: 'polish', passes: 1, depth: 25 }    // Final polish
];

async function cutBrilliantGem() {
    console.log('Starting brilliant cut sequence...');
    
    // Home the machine first
    virtualMachine.homeAllMotors();
    await sleep(1000);
    
    let facetCount = 0;
    
    // For each grit stage
    for (let gritStage of GRIT_SEQUENCE) {
        console.log(`Switching to ${gritStage.wheel} wheel...`);
        virtualMachine.changeGrindingWheel(gritStage.wheel);
        await sleep(500);
        
        // For each facet (simplified - 57 for brilliant cut)
        for (let facet = 0; facet < 57; facet++) {
            facetCount++;
            
            // Rotate to this facet
            virtualMachine.moveMotor('x', FACET_STEPS);
            await sleep(200);
            
            // Lower onto wheel
            virtualMachine.moveMotor('y', gritStage.depth);
            
            // Simulate cutting time (5 seconds per facet)
            await sleep(5000);
            
            // Raise away from wheel
            virtualMachine.moveMotor('y', -gritStage.depth);
            await sleep(200);
            
            console.log(`Completed facet ${facet + 1}/57 with ${gritStage.wheel} wheel`);
        }
    }
    
    // Home and complete
    console.log('Returning to home position...');
    virtualMachine.homeAllMotors();
    console.log(`✨ Brilliant cut complete! ${facetCount} facets processed!`);
}

// Helper function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the cutting sequence
cutBrilliantGem();
```

---

## 🔧 Helper Functions

### Convert Between Units
```javascript
// Convert steps to millimeters (Y-axis example)
function stepsToMM(steps, mmPerRev = 5, stepsPerRev = 200) {
    return (steps / stepsPerRev) * mmPerRev;
}

// Convert degrees to steps (for index motor)
function degreesToSteps(degrees) {
    return (degrees / 3.75);  // 3.75° per step on 96-position index
}

// Get current height in MM
function getCurrentHeightMM() {
    const positions = virtualMachine.getMotorPositions();
    return stepsToMM(positions.y);
}

// Examples:
console.log('100 steps = ', stepsToMM(100), 'mm');
console.log('45 degrees = ', degreesToSteps(45), 'steps');
console.log('Current height:', getCurrentHeightMM(), 'mm');
```

### Multi-Facet Cutter
```javascript
/**
 * Cuts multiple facets with same settings
 * @param {number} startFacet - Starting position (0-95)
 * @param {number} numFacets - How many facets to cut
 * @param {string} wheel - Which wheel ('coarse', 'medium', 'fine', 'polish')
 * @param {number} depth - How far to lower (microsteps)
 * @param {number} cutTime - How long to grind (milliseconds)
 */
async function cutMultipleFacets(startFacet, numFacets, wheel, depth, cutTime) {
    virtualMachine.changeGrindingWheel(wheel);
    
    for (let i = 0; i < numFacets; i++) {
        const facet = startFacet + i;
        
        // Rotate to facet
        virtualMachine.moveMotor('x', 33);
        await sleep(200);
        
        // Cut
        virtualMachine.moveMotor('y', depth);
        await sleep(cutTime);
        virtualMachine.moveMotor('y', -depth);
        
        console.log(`Facet ${facet} done with ${wheel} wheel`);
    }
}

// Usage:
cutMultipleFacets(0, 10, 'coarse', 100, 3000);  // First 10 with coarse
```

### Emergency Safety
```javascript
// Immediate stop (for safety)
function quickStop() {
    virtualMachine.emergencyStop();
    console.warn('EMERGENCY STOP ACTIVATED!');
}

// Safe shutdown sequence
function safeShutdown() {
    console.log('Initiating safe shutdown...');
    virtualMachine.emergencyStop();        // Stop all movement
    virtualMachine.homeAllMotors();        // Return to origin
    console.log('✓ Machine returned to home position');
    console.log('✓ Safe to power down');
}

// Keyboard shortcut for emergency stop
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        quickStop();
    }
});
```

---

## 📊 Status Monitoring

### Real-Time Dashboard
```javascript
// Create a real-time status display
function displayMachineStatus() {
    const positions = virtualMachine.getMotorPositions();
    const wheel = virtualMachine.getCurrentWheel();
    const moving = virtualMachine.isMoving ? 'YES' : 'IDLE';
    
    console.clear();
    console.log('╔═══════════════════════════════════════╗');
    console.log('║     GEMBOT MACHINE STATUS              ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║ Index Position (X):  ${String(positions.x).padEnd(20)} │`);
    console.log(`║ Height Position (Y): ${String(positions.y).padEnd(20)} │`);
    console.log(`║ Spindle Position (P): ${String(positions.p).padEnd(19)} │`);
    console.log(`║ Current Wheel:      ${String(wheel).padEnd(20)} │`);
    console.log(`║ Status:            ${String(moving).padEnd(20)} │`);
    console.log('╚═══════════════════════════════════════╝');
}

// Update status every 500ms
setInterval(displayMachineStatus, 500);
```

### Logging Movements
```javascript
// Log all motor movements to file/console
const movements = [];

function logMovement(axis, steps, direction) {
    const timestamp = new Date().toLocaleTimeString();
    const move = {
        timestamp,
        axis,
        steps,
        direction,
        currentPositions: virtualMachine.getMotorPositions()
    };
    movements.push(move);
    console.log(`[${timestamp}] ${axis.toUpperCase()} ${direction}: ${steps} steps`, move.currentPositions);
}

// Modified motor control with logging
const originalMove = virtualMachine.moveMotor;
virtualMachine.moveMotor = function(axis, steps) {
    const direction = steps > 0 ? '+' : '-';
    logMovement(axis, Math.abs(steps), direction);
    return originalMove.call(this, axis, steps);
};
```

---

## 🎮 Interactive Control Panel Code

```javascript
// Simple HTML+JS for manual control
const controlHTML = `
<div id="gembotControl" style="border: 2px solid #667eea; padding: 15px; border-radius: 8px;">
    <h3>GemBot Control Panel</h3>
    
    <!-- Wheel Selector -->
    <label>Grinding Wheel:</label>
    <select id="wheelSelect" onchange="selectWheel(this.value)">
        <option value="coarse">Coarse (60-80)</option>
        <option value="medium">Medium (120)</option>
        <option value="fine">Fine (220)</option>
        <option value="polish">Polish (600+)</option>
    </select>
    <button onclick="applyWheel()">Apply</button>
    
    <!-- Height Control -->
    <label>Height Control:</label>
    <button onclick="virtualMachine.moveMotor('y', 50)">↓ Lower (+50)</button>
    <button onclick="virtualMachine.moveMotor('y', -50)">↑ Raise (-50)</button>
    <input type="range" id="heightSlider" min="0" max="3300" value="0">
    
    <!-- Index Rotation -->
    <label>Facet Rotation:</label>
    <button onclick="virtualMachine.moveMotor('x', 33)">→ Next Facet</button>
    <input type="text" placeholder="Enter facet number (0-95)">
    <button onclick="rotateTo(this.previousElementSibling.value)">Go To</button>
    
    <!-- Status Display -->
    <div id="statusDisplay" style="background: #f0f0f0; padding: 10px; margin-top: 10px;">
        Status: <span id="statusText">Idle</span>
    </div>
</div>

<script>
function selectWheel(wheel) {
    document.getElementById('wheelSelect').value = wheel;
}

function applyWheel() {
    const wheel = document.getElementById('wheelSelect').value;
    virtualMachine.changeGrindingWheel(wheel);
    console.log('Wheel changed to:', wheel);
}

function rotateTo(facetNum) {
    const num = parseInt(facetNum);
    if (num >= 0 && num <= 95) {
        virtualMachine.setMotorPosition('x', num * 33);
        console.log('Rotated to facet:', num);
    }
}

// Update status display
setInterval(() => {
    const positions = virtualMachine.getMotorPositions();
    const wheel = virtualMachine.getCurrentWheel();
    document.getElementById('statusText').innerHTML = 
        `Wheel: ${wheel} | Index: ${positions.x.toFixed(0)} | Height: ${positions.y.toFixed(0)}`;
}, 500);
</script>
`;

// Insert into page
document.body.insertAdjacentHTML('beforeend', controlHTML);
```

---

## 🚀 Advanced Examples

### Automated Diamond Cut Program
```javascript
// Pre-programmed diamond cutting sequence
const DIAMOND_PROGRAM = {
    name: 'Round Brilliant (57 facets)',
    facets: [
        // Table (top center)
        { index: 0, grit: 'coarse', depth: 150, time: 3000 },
        { index: 1, grit: 'coarse', depth: 150, time: 3000 },
        
        // Crown facets (8 main)
        { index: 2, grit: 'medium', depth: 100, time: 4000 },
        { index: 4, grit: 'medium', depth: 100, time: 4000 },
        { index: 6, grit: 'medium', depth: 100, time: 4000 },
        { index: 8, grit: 'medium', depth: 100, time: 4000 },
        // ... etc for all 57 facets
        
        // Final polish all
        { grit: 'polish', allFacets: true, depth: 25, time: 2000 }
    ]
};

async function executeDiamondProgram() {
    console.log(`Starting: ${DIAMOND_PROGRAM.name}`);
    
    for (let step of DIAMOND_PROGRAM.facets) {
        if (step.allFacets) {
            // Polish all facets
            virtualMachine.changeGrindingWheel(step.grit);
            for (let i = 0; i < 57; i++) {
                virtualMachine.moveMotor('x', 33);
                await sleep(200);
                virtualMachine.moveMotor('y', step.depth);
                await sleep(step.time);
                virtualMachine.moveMotor('y', -step.depth);
            }
        } else {
            // Single facet
            virtualMachine.changeGrindingWheel(step.grit);
            virtualMachine.setMotorPosition('x', step.index * 33);
            await sleep(200);
            virtualMachine.moveMotor('y', step.depth);
            await sleep(step.time);
            virtualMachine.moveMotor('y', -step.depth);
        }
    }
    
    console.log('✨ Diamond cutting complete!');
}
```

---

## 📝 Notes & Tips

### Command Examples in Console (F12):
```javascript
// Quickest way to test:
vm = virtualMachine;  // Shorter name

// Change wheel and watch color
vm.changeGrindingWheel('polish');

// Move down 100 units
vm.moveMotor('y', 100);

// Check status
vm.getMotorPositions();

// Back home
vm.homeAllMotors();
```

### Converting Units:
- **Index**: 33 microsteps = 1 facet (on 96-position system)
- **Height**: 1 microstep ≈ 0.006mm (fine control)
- **Degrees**: Each 3.75° = one facet position
- **Time**: 3-10 seconds per facet typical

---

## 🎯 Quick Copy-Paste Commands

```javascript
// Quick coarse grinding
vm.changeGrindingWheel('coarse'); vm.moveMotor('y', 100); 

// Lower platform
vm.moveMotor('y', 50);

// Raise platform
vm.moveMotor('y', -50);

// Next facet
vm.moveMotor('x', 33);

// Check status
vm.getMotorPositions();

// Polish time
vm.changeGrindingWheel('polish');

// Emergency stop
vm.emergencyStop();

// Home all
vm.homeAllMotors();
```

---

**Ready to cut some gems! 💎✨**

**Date**: December 8, 2025  
**Version**: 1.0 API Reference
