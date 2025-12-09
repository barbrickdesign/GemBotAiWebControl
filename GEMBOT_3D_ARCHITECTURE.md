# GemBot 3D Visualization Architecture & Technical Specifications

## System Overview

The GemBot 3D visualization system is a **safety-critical, real-time simulation** that must accurately mirror both virtual and physical machine states. This system serves dual purposes:

1. **Educational/Game Mode** - Virtual machine for user training
2. **Physical Machine Mirror** - Real-time sync with actual hardware for remote operation safety

---

## Critical Safety Requirements

### Position Accuracy
- **No guessing about stone position relative to wheel**
- All coordinates must be precisely calculated from motor microstep values
- Visual representation must match data readouts exactly
- If visual and data differ, the visual is WRONG (not the data)

### Synchronization
- **Real-time updates** as UI controls change motor positions
- **Latency < 50ms** for safety-critical operations
- **State consistency** - 3D view always matches control panel data
- **Connection monitoring** - Clear indication of physical vs virtual mode

### Operational Modes
- **Virtual Mode** - Standalone testing/training with no hardware
- **Physical Mode** - Real-time mirror of connected hardware
- **Fallback Mode** - Default to virtual if connection lost
- **Disconnect Detection** - Immediate visual indication if physical connection drops

---

## Machine Coordinate System

### Motor Specifications (from actual hardware)

#### Index Motor (Stone Rotation)
- **Steps per Revolution**: 200 native steps
- **Microstepping**: 16x
- **Total Microsteps**: 3,200 per revolution
- **Physical Positions**: 96 facet index positions
- **Calculation**: 3,200 microsteps ÷ 96 positions = 33.33 microsteps per facet position
- **Angular Resolution**: 360° ÷ 3,200 = 0.1125° per microstep
- **Default Home**: Index 0 = 0°
- **Rotation**: Clockwise positive (as viewed from above)

#### Y-Axis Motor (Height/Approach Control)
- **Steps per Revolution**: 200 native steps
- **Microstepping**: 16x
- **Total Microsteps**: 3,200 per revolution
- **Physical Travel**: ~20.6mm (height adjustment)
- **Motor to Mechanism**: Likely through gear reduction or screw pitch
- **Screw Pitch**: Assumed 2mm (common for ball screws)
- **Calculation**: If 2mm pitch: 3,200 microsteps = 6.4mm (scaling required)
- **Actual Range**: ~20.6mm ÷ 6.4mm per rev = ~3.2 revolutions max
- **Maximum Microsteps**: ~10,240 microsteps
- **Safe Home**: Y = 0 (platform fully retracted from wheel)
- **Safe Limit**: Y = max (platform fully extended, stone far from wheel)
- **Default Position**: Y calibrated by "Rough Calibration"

#### X-Axis Motor (Lateral/Left-Right Movement)
- **Steps per Revolution**: 200 native steps
- **Microstepping**: 16x
- **Total Microsteps**: 3,200 per revolution
- **Physical Travel**: ~240mm (full left-right carriage range)
- **Maximum Revolutions**: 240mm ÷ 2mm pitch = 120 revolutions
- **Maximum Microsteps**: ~384,000 microsteps total range
- **Position Resolution**: 240mm ÷ 384,000 = 0.000625mm per microstep
- **Default Home**: X = 0 (center position)
- **Safe Limits**: X min/max defined by mechanical stops

#### Angle Motor (Facet Angle Control)
- **Type**: Secondary axis control
- **Range**: 0-360° (full rotation)
- **Step Size**: 0.1125° per microstep (same as index motor)
- **Common Angles**: 45°, 90°, etc. for standard facet cuts
- **Default**: 90° (table facet, perpendicular to wheel)

#### Spindle Motor (Wheel Rotation)
- **Type**: Continuous rotation or stepper
- **Speed Range**: 2,000-10,000 RPM (variable)
- **Purpose**: Rotates grinding wheel
- **Visual**: Show as spinning cylinder in 3D

---

## Physical Machine Layout (3D Coordinate System)

### Global Origin (0, 0, 0)
- **Position**: Center of grinding wheel axis
- **Reference**: Front-left-bottom corner of machine base
- **Units**: Millimeters

### Machine Base
- **Dimensions**: ~600mm W × ~400mm D × ~300mm H (external)
- **Frame Material**: Black aluminum extrusion 20×20mm
- **Frame Type**: Rectangular cage structure
- **Footprint**: Mounted on wooden workbench

### Grinding Wheel Assembly
- **Position**: Z = +150mm (height above base)
- **Diameter**: 100mm
- **Thickness**: 14mm
- **Orientation**: Horizontal (flat face down toward stone)
- **Center Coordinates**: (300, 300, 150) - relative to machine origin
- **Rotation**: Continuous Z-axis rotation (spindle motor)
- **Grit Colors**: 
  - Coarse (60-80): Light gray (#C0C0C0)
  - Medium (120): Dark gray (#A9A9A9)
  - Fine (220): Medium gray (#808080)
  - Polish (600+): Very dark gray (#696969)

### Y-Axis Carriage (Height Control)
- **Movement**: Vertical (Z-axis)
- **Range**: Z from 100mm (retracted) to 120.6mm (extended)
- **Parent**: Fixed to frame via ball screws
- **Controls**: Stone approach/retract from wheel
- **Home Position**: Z = 100mm (fully retracted, safe distance from wheel)
- **Default Cutting Position**: Z = ~110mm (calibrated distance)

### X-Axis Carriage (Left-Right Movement)
- **Movement**: Horizontal (Y-axis, left-right when viewed from front)
- **Range**: Y from -120mm to +120mm (240mm total)
- **Parent**: Mounted on Y-axis carriage
- **Controls**: Stone position relative to wheel center
- **Home Position**: Y = 0mm (center)
- **Travel Speed**: Proportional to microstep rate

### Chuck Assembly
- **Position**: Above Y-axis carriage
- **Mounting**: Rotates with index motor
- **Diameter**: 30mm
- **Height**: 60mm from carriage
- **Holds**: Dop stick (10mm diameter)
- **Rotation**: Z-axis (96-position index, 96-step motor)
- **Orientation**: Points downward toward wheel

### Dop Stick (Removable)
- **Diameter**: 10mm
- **Length**: 80mm
- **Material**: Wood/hardwood (cream color)
- **Mount Point**: Inserted into chuck
- **Rotation**: Follows chuck rotation (96 discrete index positions)
- **Stone Mounting**: Stone glued to bottom of dop stick
- **Removal**: Can be removed by user for hand prep

### Gemstone (On Dop Stick)
- **Shape**: Polyhedron (varies by design)
- **Mount**: Glued to bottom of dop stick
- **Size Range**: ~10-30mm (varies)
- **Color**: Golden/amber (visual indicator)
- **Position**: Directly below dop stick
- **Distance to Wheel**: Calculated as wheel_height - stone_height - Y_position
- **Removal**: Can be unglued and replaced

---

## 3D Machine Component Hierarchy

```
MachineRoot (0, 0, 0)
├── Base Platform (Frame)
│   ├── Front-Left Rail
│   ├── Front-Right Rail
│   ├── Back-Left Rail
│   ├── Back-Right Rail
│   ├── Top-Front Rail
│   ├── Top-Back Rail
│   ├── Support Brackets (×2)
│   └── Ground Reference Plane
│
├── Spindle Assembly (Fixed)
│   ├── Motor Housing (0, 0, 0)
│   ├── Motor Shaft (animated - spins continuously)
│   └── Grinding Wheel (animated - follows spindle motor)
│
├── X-Axis System (Parent: Base)
│   ├── Ball Screw X (horizontal, Y-axis oriented)
│   ├── X-Axis Carriage (moves along screw)
│   │   └── Parent: Ball Screw X (position = X_microsteps)
│   │
│   └── Y-Axis System (Parent: X-Axis Carriage)
│       ├── Ball Screw Y (vertical, Z-axis oriented)
│       ├── Y-Axis Platform (moves along screw)
│       │   └── Parent: Ball Screw Y (position = Y_microsteps)
│       │
│       └── Index Motor Assembly (Parent: Y-Axis Platform)
│           ├── Motor Housing
│           ├── Motor Shaft (rotates with index motor)
│           ├── Index Gear (96-tooth, follows motor)
│           ├── Chuck Assembly (rotates with index gear)
│           │   └── Dop Stick (inserted into chuck)
│           │       └── Gemstone (mounted on dop stick)
│           │
│           ├── Control Panel Display
│           ├── Cooling System
│           └── Cable Management
│
├── Workbench Table (Parent: Static Ground)
│   ├── Table Surface (wood)
│   ├── Rough Stone Holder
│   │   ├── Stone Sample 1 (clickable)
│   │   ├── Stone Sample 2 (clickable)
│   │   ├── Stone Sample 3 (clickable)
│   │   ├── Stone Sample 4 (clickable)
│   │   ├── Stone Sample 5 (clickable)
│   │   └── Stone Sample 6 (clickable)
│   ├── Dop Stick Holder
│   │   ├── Dop Stick A (clickable, removable)
│   │   ├── Dop Stick B (clickable, removable)
│   │   ├── Dop Stick C (clickable, removable)
│   │   └── Dop Stick D (clickable, removable)
│   ├── Grinding Wheel Storage
│   │   ├── Wheel - 60 Grit (clickable)
│   │   ├── Wheel - 120 Grit (clickable)
│   │   ├── Wheel - 220 Grit (clickable)
│   │   └── Wheel - Polish (clickable)
│   ├── Polishing Compound Bottles
│   ├── Tools Container
│   ├── Coolant Bottle
│   └── Documentation/Manuals
│
└── Environment
    ├── Room Background
    ├── Lighting (3-point: key, fill, back)
    └── Shadows
```

---

## Real-Time Data Synchronization

### Motor Position Tracking

```javascript
// X-Axis Position
xPosition_mm = (xMicrosteps / 3200) * 2; // 2mm screw pitch
xLocation = xMicrosteps; // Raw value for UI display

// Y-Axis Position
yPosition_mm = (yMicrosteps / 3200) * 2; // 2mm screw pitch
yLocation = yMicrosteps; // Raw value for UI display

// Index Position (96-step discrete)
indexPosition = (indexMicrosteps % 3200) / 33.33; // 0-95
indexAngle = (indexPosition / 96) * 360; // 0-360°

// Angle Motor Position
anglePosition_degrees = (angleMicrosteps % 3200) * 0.1125; // 0-360°

// Spindle Position
wheelRotation = spindleRPM * deltaTime; // Continuous rotation
```

### 3D Position Calculations

```javascript
// Stone Position in 3D Space
stoneX = machine.position.x + xPosition_mm - 120; // Offset to center
stoneY = machine.position.y + (300 - (Y_SAFE_DISTANCE - yPosition_mm));
stoneZ = machine.position.z + (wheelHeight - stoneSize/2);

// Distance to Wheel
distanceToWheel = wheelHeight - stoneZ;
// CRITICAL: If distanceToWheel < 0, stone is TOUCHING or PENETRATING wheel (ERROR)
```

### Data Binding (UI ↔ 3D)

| Control | 3D Effect | Safety Check |
|---------|-----------|--------------|
| X Slider | Move carriage left/right | Mechanical limits: ±120mm |
| Y Slider | Move platform up/down | Limits: 0-20.6mm safe zone |
| Index Button | Rotate chuck 96 positions | Discrete steps, no intermediate |
| Angle Button | Adjust facet angle | Continuous, 0-360° |
| Spindle Power | Wheel rotation speed | RPM limits enforced |

---

## Interactive Objects & Pick Detection

### Selectable Objects
1. **Rough Stones** (Clickable in 3D)
   - Ray casting from camera through mouse position
   - Highlight on hover
   - Select on click
   - Display info panel

2. **Dop Sticks** (Clickable, Removable)
   - Can be picked up from holder
   - Can be inserted into chuck
   - Shows attachment point when carried

3. **Grinding Wheels** (Clickable, Swappable)
   - Can be removed from spindle
   - Can be installed on spindle
   - Grit color changes 3D display

### Pick Detection Implementation
```javascript
// Ray casting for 3D object selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', function(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(selectableObjects);
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    handleObjectSelection(clickedObject);
  }
});
```

---

## Visual Fidelity Standards

### Model Accuracy
- **Wheel Assembly**: ±2mm tolerance (actual wheel dimensions)
- **Chuck Position**: ±1mm relative to wheel
- **Stone Distance**: ±0.5mm (critical for safety)
- **Frame Geometry**: ±5mm (non-critical, but visible)

### Material Realism
- **Aluminum**: Brushed aluminum texture, slight reflections
- **Black Metal**: Matte black, no reflections
- **Grinding Wheel**: Realistic grit pattern, texture mapping
- **Wood (Dop/Table)**: Wood grain texture
- **Stone**: Translucent with golden/amber color

### Lighting & Shadows
- **Key Light**: 45° above, slightly from front (simulates workshop light)
- **Fill Light**: Opposite side, lower intensity (reduces shadows)
- **Back Light**: Behind scene for depth
- **Real-time Shadows**: Shows stone approaching wheel
- **Ambient Light**: Enables visibility of all surfaces

---

## Performance Considerations

### Optimization
- **LOD (Level of Detail)**: Reduce detail on distant objects
- **Culling**: Hide objects outside camera view
- **Batching**: Combine static meshes (frame, base)
- **Update Rate**: 60 FPS minimum for real-time response
- **Motor Update Rate**: Match UI control rate (typically 100ms)

### Memory Management
- **Texture Atlasing**: Combine textures where possible
- **Geometry Reuse**: Cylinders/boxes for multiple parts
- **Pool Objects**: Reuse stones/dops instead of creating new

---

## Safety-Critical Data Validation

### Pre-Movement Checks
```javascript
function validateMotorCommand(motor, targetValue) {
  // Check against mechanical limits
  if (targetValue < motor.minLimit || targetValue > motor.maxLimit) {
    return { valid: false, reason: "Exceeds mechanical limit" };
  }
  
  // Check for collision
  if (motor === yAxis) {
    const stonePos = calculateStonePosition(targetValue);
    if (stonePos.z > wheelPos.z) {
      return { valid: false, reason: "Stone collision with wheel" };
    }
  }
  
  return { valid: true };
}
```

### Redundant Position Display
- **3D Visual**: Shows exact position visually
- **Data Readout**: Shows coordinates in UI
- **Discrepancy Alert**: If visual ≠ data, ERROR condition
- **Operator Must Verify**: Before executing critical movements

---

## Development Phases

### Phase 1: Core 3D Rendering
- Machine geometry (frame, motors, chuck, wheel)
- Basic lighting and materials
- Static positioning

### Phase 2: Real-Time Synchronization
- Motor data binding
- Live position updates
- Smooth animations

### Phase 3: Interactive Objects
- Clickable workbench items
- Drag-and-drop functionality
- State management

### Phase 4: Safety Features
- Collision detection
- Limit enforcement
- Error visualization

### Phase 5: Physical Machine Integration
- Hardware communication
- Real-time mirroring
- Connection monitoring

### Phase 6: Polish & Optimization
- Visual refinements
- Performance tuning
- User experience improvements

---

## Testing & Validation

### Unit Tests
- Motor calculation accuracy
- Collision detection
- Position synchronization

### Integration Tests
- UI ↔ 3D synchronization
- Physical ↔ Virtual mirroring
- Error handling

### Safety Tests
- Mechanical limit enforcement
- Stone-to-wheel distance monitoring
- Emergency stop verification

### User Acceptance Tests
- Training workflow validation
- Intuitive control verification
- Safety procedure verification

---

**Document Version**: 1.0  
**Last Updated**: December 9, 2025  
**Status**: Architecture Phase Complete - Ready for Implementation
