# GemBot Gemstone Cutting - Quick Reference
**Your 3D Model Now Accurately Represents the Lapidary Machine**

---

## 🎯 What GemBot Actually Is

**NOT a 3D printer** → **YES, a professional gemstone cutting machine!**

### Key Hardware Visible in 3D Model:

```
┌─────────────────────────────────────────────┐
│          GRINDING WHEEL (spins)             │ ← 80mm diameter
│          Various grits (gray shades)        │    Different colors = different grits
│                     │                       │
│      ┌──────────────┼──────────────┐        │
│      │              │              │        │
│   INDEX        Y-AXIS PLATFORM    ANGLE    │
│   MOTOR        (up/down)          MOTOR    │
│  (left)        with GEM           (right)  │
│  96-step       HOLDER                      │
│  rotation                                  │
│      │                                     │
└──────┴─────────────────────────────────────┘
       BASE WITH WATER COOLING SYSTEM
```

---

## 🔄 How It Works

### Step 1: Load Gemstone
- Secure rough gemstone in holder
- Adjust angle with angle motor
- Position at cutting platform

### Step 2: Select Wheel
- **Coarse** (60-80 grit) → Rough shaping
- **Medium** (120 grit) → Refine shape
- **Fine** (220 grit) → Polish prep
- **Polish** (600+) → Final shine

### Step 3: Index to Facet
- Use 96-step index motor
- Each step = 3.75°
- Position stone at correct angle
- Lower platform onto spinning wheel

### Step 4: Cut Facet
- Wheel spins continuously
- Water keeps everything cool
- Platform lowers onto wheel
- 3-10 seconds per facet

### Step 5: Repeat
- Rotate index motor to next facet
- ~96 positions for complex cuts
- 57-60 facets total for brilliant cut

---

## 🎨 Wheel Changing Gameplay

**Color-coded wheels in 3D model show current grit:**

```javascript
// Console commands to switch wheels:
virtualMachine.changeGrindingWheel('coarse');   // Light gray
virtualMachine.changeGrindingWheel('medium');   // Dark gray
virtualMachine.changeGrindingWheel('fine');     // Darker gray
virtualMachine.changeGrindingWheel('polish');   // Very dark gray

// Check which wheel is active:
console.log(virtualMachine.getCurrentWheel());  // Returns wheel name
```

---

## 📊 96-Position Index System

Your stepper motor controls **exactly 96 positions** around the gemstone:

```
Position 0°  ────────────────────  Position 360°
│                                   │
0    12    24    36    48    60    72    84   96
│     │     │     │     │     │     │     │     │
└─ Each position = 3.75° rotation ─┘

Perfect for:
✓ Brilliant cuts (57 facets)
✓ Cushion cuts (58 facets)
✓ Emerald cuts (25-49 facets)
✓ Custom designs (any angle needed)
```

---

## 💎 Gemstone Workpiece Indicator

**Red octahedral shape in 3D = Your gem being cut**

As you operate the machine:
- Gem moves UP/DOWN with Y-axis (height adjustment)
- Gem ROTATES with X-axis (facet positioning)
- Spinning wheel approaches/recedes based on platform height

---

## ⚙️ Motor Breakdown

| Motor | Steps | Purpose | In 3D Model |
|-------|-------|---------|------------|
| **Index (X)** | 96 positions | Facet angle | Left motor box |
| **Y-Axis** | 3300 microsteps | Height control | Moving platform |
| **Spindle (P)** | Continuous | Wheel rotation | Spinning wheel |
| **Angle** | Variable | Cut angle | Right motor |

---

## 🎮 Interactive Visualization

### Watch These in Real-Time:

1. **Wheel Selection**
   - Watch wheel color change in 3D
   - Different shade = different grit

2. **Platform Movement**
   - Lower platform toward wheel
   - Watch Y-axis carriage move down
   - Gem holder approaches the wheel

3. **Wheel Spinning**
   - Watch wheel rotate continuously
   - Simulates grinding action

4. **Index Rotation**
   - Rotate to next facet position
   - See platform twist to new angle

---

## 🔧 Key Differences from 3D Printer

| Aspect | 3D Printer | GemBot Cutter |
|--------|----------|--------------|
| **Purpose** | Builds material layer-by-layer | Removes material precision |
| **Tools** | Hot nozzle (extruder) | Abrasive wheel |
| **Motion** | XYZ + extrusion | XYP + approach |
| **Result** | 3D object built up | Shaped gemstone polished |
| **Speed** | Slow (hours) | Fast (minutes per facet) |
| **Material** | Plastic filament | Natural gemstone |
| **Precision** | ±0.2mm | ±0.5° angle |

---

## 💧 Water Cooling System (3D Reference)

**Visible in 3D model as blue transparent tank:**

### Why Water?
- Grinding = **EXTREME HEAT**
- Stone protection from thermal stress
- Wheel longevity
- Operator safety
- Better surface finish

### In Your System:
- Pump circulates ~1-5 liters/minute
- Catches spray from wheel
- Keeps everything wet during operation
- Blue tank visible in 3D scene

---

## 📋 Typical Gemstone Program Flow

```
Start
  ↓
[Load Ruby in Holder]
  ↓
[Select Coarse Wheel] ← Changes wheel color in 3D
  ↓
[Index to Position 0]  ← Rotates platform to angle
  ↓
[Lower Platform]       ← Y-axis moves down (visible in 3D)
  ↓
[GRIND 5 seconds]      ← Wheel spins (animated)
  ↓
[Raise Platform]       ← Y-axis moves up
  ↓
[Index to Position 1]  ← Next facet angle
  ↓
[Switch to Medium Wheel] ← Color changes again
  ↓
... repeat for 56 more facets ...
  ↓
[Switch to Fine Wheel] ← Lighter color
  ↓
... final facets ...
  ↓
[Switch to Polish]     ← Darkest color
  ↓
... final polish pass ...
  ↓
[Home All Motors]      ← Return to start
  ↓
[Unload Finished Gem]  
  ↓
Complete! 💎✨
```

---

## 🎯 Control Panel Commands

### Essential Console Commands:

```javascript
// Switch wheels
vm.changeGrindingWheel('coarse');      // Start with rough
vm.changeGrindingWheel('medium');      // Refine
vm.changeGrindingWheel('fine');        // Pre-polish
vm.changeGrindingWheel('polish');      // Final shine

// Move Y-axis (height)
vm.moveMotor('y', 100);    // Lower (toward wheel)
vm.moveMotor('y', -100);   // Raise (away from wheel)

// Rotate to facets (96 total = 33 microsteps each)
vm.moveMotor('x', 33);     // Next facet

// Check status
vm.getMotorPositions();    // See all axis positions
vm.getCurrentWheel();      // What wheel is loaded?

// Safety
vm.homeAllMotors();        // Return to start
vm.emergencyStop();        // Stop everything NOW
```

---

## 🌟 Visual Features You Can See

### In 3D Model:
- ✅ Black metal frame structure
- ✅ Rotating grinding wheel (animated)
- ✅ Color-coded wheel grits
- ✅ Moving Y-axis platform
- ✅ Gemstone holder (red gem)
- ✅ Stainless steel rails
- ✅ Motor housings
- ✅ Water cooling tank
- ✅ Precise positioning system

### Physics Represented:
- ✅ Wheel rotation speed
- ✅ Platform height control
- ✅ Facet angle positioning
- ✅ Motor movement synchronization

---

## 🎓 Pro Tips

### For Efficient Cutting:

1. **Use Coarse First**
   - Remove bulk material quickly
   - Don't worry about finish

2. **Medium for Shaping**
   - Refine facet geometry
   - Better surface quality

3. **Fine for Prep**
   - Remove medium grit scratches
   - Prepare for polish

4. **Polish Last**
   - Mirror-like final surface
   - Show off your gem!

### Angle Precision:
- Each index position = 3.75°
- Stepper accuracy = ±0.1°
- Good enough for professional cuts
- Better than hand-cutting

---

## 📱 Gameplay Elements

### Color Feedback System:
- **Light Gray Wheel** = Coarse (rough work)
- **Dark Gray Wheel** = Medium (refining)
- **Darker Gray Wheel** = Fine (polishing)
- **Very Dark Gray Wheel** = Polish (final shine)

### Movement Visualization:
- **Platform Rises/Falls** = Height adjustment working
- **Wheel Rotates** = Grinding active
- **Gem Position Changes** = Index motor working
- **Wheel Color Changes** = Grit selection active

---

## ✨ Perfect For Learning

This 3D model helps you understand:
1. **Precision Control** - How stepper motors work
2. **Facet Geometry** - Mathematical gem cutting
3. **Process Workflow** - Multi-step grinding
4. **Tool Selection** - Right grit for each phase
5. **Real Machine Operation** - Exactly what happens physically

---

## 🎉 You're All Set!

Your GemBot Gemstone Cutting Machine 3D visualization is ready to show:
- How gemstones are professionally cut
- Precise motor control in action
- Multi-stage polishing process
- Real-time machine operation

**Enjoy cutting beautiful gems! 💎✨**

---

**Quick Version**: 1.0  
**Machine Type**: Lapidary Gemstone Grinder  
**Status**: ✅ Ready to Use  
**Date**: December 8, 2025
