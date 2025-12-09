# GemBot Specifications & Features Complete Reference

## 🎯 Overview

The **GemBot** is a professional-grade, automated robotic faceting machine designed for precision gemstone cutting and polishing. It automates the complex process of creating multiple facets on gemstones with accuracy and repeatability that would be extremely difficult to achieve manually.

---

## 🤖 Core Functionality

### Primary Purpose
Automated cutting and polishing of gemstones with precision faceting capabilities for:
- Diamond cutting
- Colored gemstone faceting
- Crown and pavilion facet creation
- Table polishing
- Custom design implementation

### Operational Modes

#### Manual Control Mode
- **X-Axis Control**: Left/Right positioning (stone approach/retract from wheel)
- **Y-Axis Control**: Height adjustment (cutting platform up/down)
- **Angle Control**: Facet angle adjustment via secondary stepper motor
- **Index Control**: 96-step rotational positioning for exact facet placement
- **Real-time Readouts**: Live display of all axis positions and angles

#### Automated Cut Mode
- Pre-programmed cutting sequences
- Input specific gemstone dimensions
- Automated facet generation following design parameters
- Consistent results across multiple stones
- Support for standard cuts (brilliant, emerald, cushion, etc.)

---

## ⚙️ Technical Specifications

### Motor System (5 Stepper Motors Total)

#### 1. Index Motor (X-Axis)
- **Type**: Stepper Motor (NEMA 17 standard)
- **Steps per Revolution**: 200
- **Microstepping**: 16x capability
- **Total Microsteps**: 3,200 per revolution
- **Facet Positions**: 96-step index system
- **Microsteps per Facet**: 33.33 steps
- **Rotation**: Bi-directional (clockwise/counterclockwise)
- **Purpose**: Rotates gemstone through 96 precisely-indexed facet positions

#### 2. Y-Axis Motor (Height Control)
- **Type**: Stepper Motor (NEMA 17)
- **Steps per Revolution**: 200
- **Microstepping**: 16x
- **Total Microsteps**: 3,200 per revolution
- **Travel Range**: ~20.6mm (approximately 3,300 microsteps max)
- **Resolution**: ~0.006mm per microstep
- **Purpose**: Controls platform height (approach/retract from spinning wheel)

#### 3. X-Axis Motor (Lateral Movement)
- **Type**: Stepper Motor (NEMA 17)
- **Steps per Revolution**: 200
- **Microstepping**: 16x
- **Total Microsteps**: 3,200 per revolution
- **Travel Range**: ~240mm (full carriage movement)
- **Purpose**: Left/right positioning of cutting platform

#### 4. Spindle Motor (P-Axis)
- **Type**: Stepper Motor or Variable Speed DC Motor
- **Speed Range**: Variable RPM
- **Purpose**: Rotates the grinding wheel at controlled speeds

#### 5. Secondary Angle Motor
- **Type**: Stepper Motor (NEMA 17)
- **Purpose**: Controls facet angle adjustment
- **Range**: Full 360° capability
- **Resolution**: Fine angle control for precise cut angles

### Control Board & Electronics
- Dedicated control circuitry for motor coordination
- Real-time position tracking on all axes
- Touch screen interface for manual and automated control
- Pre-defined cutting programs for standard gemstone shapes
- Emergency stop system
- Safety interlocks

---

## 🔧 Frame & Structure

### Aluminum Frame (20x20mm Extrusion Rails)
- Rigid structural support using professional-grade aluminum
- Four vertical corner posts providing stability
- Horizontal top rail for ball screw mounting
- Designed for minimal deflection during cutting operations

### Key Mechanical Components

**Ball Screws**:
- X-Axis Ball Screw: Mounted on top rails for left-right carriage movement
- Y-Axis Ball Screw: Controls vertical platform height
- Preloaded for precision and minimal backlash

**Linear Bearings**:
- Enable smooth, frictionless movement
- Low-wear design for extended service life

**Grinding Wheel Spindle**:
- Horizontal orientation (wheel sits flat)
- 100mm diameter grinding wheel
- Replaceable grit options

---

## 💎 Grinding Wheel System

### Wheel Specifications

**Size**: 80-100mm diameter × 12-15mm thickness

**Grit Options** (Color-Coded):

| Grit | Color | Purpose | Stage |
|------|-------|---------|-------|
| **60-80** | Light Gray (#C0C0C0) | Rough shaping | Initial facet definition |
| **120** | Dark Gray (#A9A9A9) | Coarse grinding | Facet refinement |
| **220** | Medium Gray (#808080) | Fine grinding | Surface preparation |
| **600+** | Very Dark Gray (#696969) | Polishing | Final shine & finish |

### Lap Types

**Diamond Laps** (Topper Laps):
- **600 Grit**: Aggressive material removal
- **1200 Grit**: Standard grinding stage
- **2000 Grit**: Fine grinding and detail work
- **3000 Grit**: Pre-polish preparation

**Copper Lap**:
- Used with diamond polishing paste
- Provides soft polishing surface
- Best for final finishing and shine

### Polishing Compounds

**Diamond Paste Range**:
- **4K Grit**: Initial polishing
- **8K Grit**: Medium polish
- **14K Grit**: Fine polish
- **50K Grit**: Ultra-fine polish
- **100K Grit**: Mirror finish
- **200K Grit**: Final high-gloss polish

---

## 🎨 Chuck & Dop Stick System

### Chuck Assembly
- **Type**: Rotating collet chuck
- **Mount**: Attached to index gear/motor assembly
- **Purpose**: Securely holds the dop stick during cutting
- **Rotation**: Couples with 96-step index motor for precise facet positioning

### Dop Stick (Removable)
- **Material**: Typically hardwood or specialized polymer
- **Length**: 60-80mm
- **Diameter**: 8-10mm
- **Design**: Removable for hand preparation of rough stones
- **Interface**: Fits securely in chuck, quick-release capability

### Gemstone Attachment
- **Process**: Rough stones are hand-prepared first
- **Mounting**: Glued to the dop stick using specialized adhesive
- **Orientation**: Positioned for optimal cutting geometry
- **Removability**: Stones can be removed after cutting for inspection

---

## 🔨 Workflow: Stone Preparation & Cutting

### Phase 1: Hand Preparation (Pre-Machine)
1. **Stone Selection** - Choose rough gemstone from inventory
2. **Visual Inspection** - Check for cracks, inclusions, and grain direction
3. **Initial Planning** - Determine optimal cutting design based on stone shape
4. **Hand Faceting** (Optional) - Create initial table facet by hand
5. **Adhesive Preparation** - Apply appropriate adhesive to dop stick

### Phase 2: Machine Setup
1. **Mount Stone** - Secure dop stick with glued stone into chuck
2. **Wheel Selection** - Install appropriate grit wheel for cutting stage
3. **Position Calibration** - Home all axes and set reference positions
4. **Coolant Setup** - Activate water cooling system

### Phase 3: Automated Cutting (CNC)
1. **Input Parameters** - Enter desired cut specifications
   - Cut type (brilliant, emerald, etc.)
   - Desired angles
   - Facet sequence
2. **Auto-Execute** - Machine follows programmed sequence
3. **Position Feedback** - Real-time display of index, height, and angle
4. **Automatic Progression** - Index rotates through each facet position

### Phase 4: Manual Fine-Tuning (if needed)
1. **Height Adjustment** - Fine-tune stone approach using Y-axis controls
2. **Angle Correction** - Adjust facet angles using secondary motor
3. **Inspection** - Visual check of each facet during cutting
4. **Pressure Adjustment** - Modify cutting pressure by adjusting height

### Phase 5: Wheel Changes & Progression
1. **Coarse Grit** (60-80): Rough facet definition
2. **Medium Grit** (120-220): Refinement and detail work
3. **Fine Grit** (600+): Pre-polish preparation
4. **Polish Stage**: Diamond paste with copper lap for final finish

### Phase 6: Removal & Inspection
1. **Retract Platform** - Raise cutting platform away from wheel
2. **Remove Stone** - Lift stone and dop stick from chuck
3. **Clean** - Remove coolant and dust
4. **Inspect** - Check facets for quality and accuracy
5. **Post-Polish** - Hand-finish or additional polish if needed

---

## 📊 Precision & Accuracy Specifications

### Positioning Accuracy
- **X-Axis Repeatability**: ±0.1mm
- **Y-Axis Repeatability**: ±0.01mm (0.006mm per microstep)
- **Index Positioning**: ±1 facet position (96-point accuracy)
- **Angle Accuracy**: ±0.1°

### Material Removal Rate
- **Coarse Grit**: 0.5-1.0mm per facet (initial stage)
- **Medium Grit**: 0.2-0.5mm per facet
- **Fine Grit**: 0.05-0.2mm per facet
- **Polish**: 0.01-0.05mm final smoothing

### Speed & Performance
- **Spindle Speed**: 2,000-10,000 RPM (variable)
- **Cutting Time per Stone**: 15-45 minutes (depending on complexity)
- **Batch Processing**: Can cut multiple stones sequentially
- **Design Complexity**: Support for 30+ facet designs

---

## 🧊 Cooling & Contamination Control

### Water Cooling System
- **Reservoir**: 20-30L capacity
- **Pump**: Submersible coolant pump
- **Delivery**: Spray/drip system onto grinding wheel
- **Purpose**: 
  - Removes heat from friction
  - Prevents stone thermal damage
  - Extends wheel life
  - Reduces dust generation

### Dust Collection (Optional)
- Vacuum connection point
- Reduces airborne diamond particles
- Healthier work environment

---

## 🛠️ Accessories & Add-ons

### Included Components
- Set of diamond topper laps (600, 1200, 2000, 3000 grit)
- Copper polishing lap
- Diamond polishing paste kit (4K-200K grit range)
- Dop sticks (assorted sizes)
- Chuck adapters for different dop sizes
- Water coolant concentrate

### Optional Upgrades

#### AI Vision System (Future)
- **Camera**: High-resolution optical sensor
- **Object Recognition**: AI-powered facet detection
- **ML Capability**: Machine learning for:
  - Automatic facet quality assessment
  - Stone geometry analysis
  - Optimal cut path planning
  - Defect detection
  - Light refraction prediction
- **Integration**: Feeds data back to control system for real-time optimization

#### Enhanced Features
- Network connectivity for remote monitoring
- Expanded design library (50+ cuts)
- Advanced analytics and statistics
- Multi-language support
- Custom cut upload capability

---

## 💰 Pricing & Specifications

### Base Machine Cost
- **Retail Price** (Early 2024): **$4,120** (built-to-order)
- **Typical Shipping**: Additional $200-500 depending on location
- **Warranty**: 1-2 years on parts and labor (varies by supplier)

### What's Included
- ✅ Complete machine assembly
- ✅ Stepper motors and control board
- ✅ Initial wheel set (4 diamond laps + copper lap)
- ✅ Starter polishing compound kit
- ✅ 5-6 dop sticks
- ✅ Basic training/documentation
- ✅ USB/network connectivity

### Optional Add-ons
- Enhanced software package: +$300-500
- AI camera upgrade: +$2,000-3,000 (future release)
- Extended warranty (3-5 years): +$400-800
- Professional training: +$500-1,000
- Custom cut design service: +$100-300 per design

---

## 🎓 Training & Certification

### Basic Operation (8-12 hours)
- Machine setup and calibration
- Manual control fundamentals
- Safety procedures
- Basic automated cutting
- Wheel changing and maintenance

### Advanced Programming (16-20 hours)
- Custom cut design creation
- Automated sequence programming
- Parameter optimization
- Troubleshooting and maintenance
- Batch processing workflows

### Professional Certification (40+ hours)
- Master faceting techniques
- Advanced stone preparation
- Design optimization
- Business practices for professional cutters
- AI system operation (when available)

---

## 📈 Production Capabilities

### Throughput
- **Stones per Day** (8-hour shift): 8-15 depending on complexity
- **Batch Size**: Single stone or unlimited (sequential)
- **Design Complexity**: Simple (15-20 min) to Complex (45+ min)

### Quality Metrics
- **Facet Accuracy**: ±0.5° angle tolerance
- **Surface Finish**: Ra 0.2-0.8μm (depending on grit)
- **Consistency**: >95% facet uniformity across batch
- **Yield Rate**: 90-98% depending on stone quality

### Maintenance Schedule
- **Daily**: Coolant level check, basic cleaning
- **Weekly**: Wheel inspection, bearing lubrication
- **Monthly**: Full system calibration, motor testing
- **Quarterly**: Coolant replacement, deep cleaning
- **Annually**: Belt/bearing replacement, software updates

---

## 🌟 Key Advantages Over Manual Cutting

| Feature | Manual | GemBot |
|---------|--------|--------|
| **Speed** | 1-2 stones/day | 8-15 stones/day |
| **Consistency** | 60-70% | 95%+ |
| **Precision** | ±1-2° | ±0.1° |
| **Learning Curve** | 2-5 years | 2-3 weeks |
| **Repetitive Strain** | High | Minimal |
| **Design Complexity** | Limited by skill | Unlimited |
| **Cost per Stone** | High labor | Low labor |
| **Training Time** | Very long | Moderate |

---

## 🔒 Safety Features

### Emergency Systems
- **Emergency Stop Button**: Immediate power cutoff
- **Interlock Switch**: Prevents operation if cover open
- **Thermal Monitoring**: Automatic shutdown if overheating
- **Motor Stall Detection**: Stops if excessive resistance

### Operator Safety
- Enclosed cutting area with transparent guard
- Automatic spindle stop on power loss
- Coolant splash guards
- Non-pinch points on moving parts
- Clear labeling and warning indicators

### Maintenance Safety
- Isolated power circuits
- Motor lockout capability during maintenance
- Pressure release points before disassembly
- Temperature interlocks on hot components

---

## 📝 Specifications Summary Table

| Parameter | Specification |
|-----------|---------------|
| **Machine Type** | CNC Robotic Faceting Machine |
| **Power Supply** | 110-240V AC, 50-60Hz |
| **Power Consumption** | 500-800W average |
| **Footprint** | 800mm × 600mm × 400mm |
| **Weight** | 45-55 kg |
| **Stepper Motors** | 5 × NEMA 17 (200 steps/rev) |
| **Max Travel (X)** | 240mm |
| **Max Travel (Y)** | ~20.6mm |
| **Index Positions** | 96 discrete positions |
| **Wheel Diameter** | 80-100mm |
| **Wheel Speed Range** | 2,000-10,000 RPM |
| **Coolant Capacity** | 20-30L |
| **Interface** | 7" Touch Screen + USB |
| **Design Library** | 30+ standard cuts |
| **Warranty** | 12-24 months |
| **Certification** | CE/FCC (varies by region) |

---

## 🚀 Future Roadmap

### Planned Enhancements
1. **AI Vision Integration** - Real-time facet quality monitoring
2. **Cloud Connectivity** - Remote monitoring and design sharing
3. **Mobile App** - Smartphone control and status updates
4. **Expanded Library** - 100+ design templates
5. **Wireless Control** - Eliminate tether requirements
6. **Advanced Analytics** - ML-driven optimization suggestions

### Community Features (Planned)
- Design sharing marketplace
- User community forums
- Video tutorial library
- Professional network access

---

## 📞 Support & Resources

### Documentation
- Complete assembly manual
- Operation guide (40+ pages)
- Troubleshooting reference
- Design template library
- Video tutorial series (20+ videos)

### Technical Support
- Email support: 24-hour response
- Phone support: Business hours
- Remote diagnostics available
- Spare parts available
- Firmware updates (free)

### Community
- User forum: 500+ active members
- Monthly webinars: Advanced techniques
- Design contests: Community challenges
- Knowledge base: 2,000+ articles

---

## 🎯 Ideal Applications

### Professional Use
- Custom jewelry design studios
- Diamond cutting operations
- Gemstone retail shops
- Training institutions
- Research facilities

### Hobbyist/Enthusiast
- Gem collecting and customization
- Stone preparation for jewelry makers
- Educational demonstrations
- Precision hobby machining
- Art & craft applications

### Industrial
- High-volume gemstone production
- Standardized cut manufacturing
- Quality control and sorting
- Material research
- Prototype development

---

**Last Updated**: December 2025  
**Version**: 2.0 - Complete Specifications  
**Status**: Production Ready
