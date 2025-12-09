/**
 * 💎 GemBot Parts Database System
 * Complete inventory of all GemBot machine components for game mechanics
 * Total Build Cost: $4,200 (including 3D-printed parts)
 * 
 * Categories:
 * - Frame & Structural ($118)
 * - Motion System ($108)
 * - Electronics & Control ($282)
 * - Wiring & Miscellaneous ($24)
 * - Custom 3D Printed Parts (~$3,500)
 */

const GemBotPartsDatabase = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",
    
    // Build cost summary
    costSummary: {
        offTheShelf: 700,
        custom3DPrinted: 3500,
        grandTotal: 4200,
        currency: "USD"
    },

    // Rarity tiers for game mechanics
    rarityTiers: {
        common: { color: "#9e9e9e", multiplier: 1.0, dropRate: 0.50, failureChance: 0.02 },
        uncommon: { color: "#4caf50", multiplier: 1.5, dropRate: 0.30, failureChance: 0.05 },
        rare: { color: "#2196f3", multiplier: 2.5, dropRate: 0.15, failureChance: 0.08 },
        epic: { color: "#9c27b0", multiplier: 4.0, dropRate: 0.04, failureChance: 0.12 },
        legendary: { color: "#ff9800", multiplier: 8.0, dropRate: 0.01, failureChance: 0.15 }
    },

    // ==========================================
    // CATEGORY 1: FRAME & STRUCTURAL COMPONENTS
    // ==========================================
    frameAndStructural: {
        categoryId: "frame",
        categoryName: "Frame & Structural",
        categoryIcon: "🏗️",
        totalCost: 118,

        parts: [
            {
                id: "frame_2020_300mm",
                name: "2020 Aluminum Frame Extrusion - 300mm",
                description: "Precision 20mm x 20mm T-slot aluminum extrusion, 300mm length. Foundation of the GemBot frame.",
                category: "frame",
                subcategory: "extrusion",
                price: 36,
                amazonUrl: "https://amzn.to/3Mr9ShN",
                quantity: 1,
                rarity: "common",
                stats: {
                    durability: 95,
                    weight: 0.3, // kg
                    material: "6063-T5 Aluminum",
                    tolerance: "±0.5mm"
                },
                gameData: {
                    unlockLevel: 1,
                    craftable: false,
                    sellPrice: 28,
                    repairCost: 5
                }
            },
            {
                id: "frame_2020_400mm",
                name: "2020 Aluminum Frame Extrusion - 400mm",
                description: "Precision 20mm x 20mm T-slot aluminum extrusion, 400mm length. Extended frame support.",
                category: "frame",
                subcategory: "extrusion",
                price: 40,
                amazonUrl: "https://amzn.to/3xMvuB9",
                quantity: 1,
                rarity: "common",
                stats: {
                    durability: 95,
                    weight: 0.4, // kg
                    material: "6063-T5 Aluminum",
                    tolerance: "±0.5mm"
                },
                gameData: {
                    unlockLevel: 1,
                    craftable: false,
                    sellPrice: 32,
                    repairCost: 6
                }
            },
            {
                id: "linear_rail_300mm",
                name: "Linear Rails & Supports - 300mm",
                description: "Precision linear motion guide rails, 300mm length with support brackets.",
                category: "frame",
                subcategory: "linear_motion",
                price: 20,
                amazonUrl: "https://amzn.to/3v9yXbg",
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 90,
                    precision: 0.01, // mm accuracy
                    loadCapacity: 50, // kg
                    material: "Hardened Steel"
                },
                gameData: {
                    unlockLevel: 3,
                    craftable: false,
                    sellPrice: 16,
                    repairCost: 4
                }
            },
            {
                id: "linear_rail_400mm",
                name: "Linear Rails & Supports - 400mm",
                description: "Precision linear motion guide rails, 400mm length for Y-axis travel.",
                category: "frame",
                subcategory: "linear_motion",
                price: 22,
                amazonUrl: "https://amzn.to/3rPi4k3",
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 90,
                    precision: 0.01,
                    loadCapacity: 50,
                    material: "Hardened Steel"
                },
                gameData: {
                    unlockLevel: 3,
                    craftable: false,
                    sellPrice: 18,
                    repairCost: 4
                }
            },
            {
                id: "linear_rail_460mm",
                name: "Linear Rails & Supports - 460mm (Full Length)",
                description: "Full-length precision linear rails for maximum axis travel. Premium quality.",
                category: "frame",
                subcategory: "linear_motion",
                price: 28,
                amazonUrl: "https://www.amazon.com/gp/product/B09Q5MYGF6",
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 92,
                    precision: 0.008,
                    loadCapacity: 60,
                    material: "Hardened Chrome Steel"
                },
                gameData: {
                    unlockLevel: 5,
                    craftable: false,
                    sellPrice: 22,
                    repairCost: 5
                }
            },
            {
                id: "corner_stiffener_brackets",
                name: "Corner Stiffener Brackets",
                description: "Heavy-duty corner reinforcement brackets for rigid frame assembly.",
                category: "frame",
                subcategory: "brackets",
                price: 12,
                amazonUrl: "https://amzn.to/3k5D0iA",
                quantity: 8,
                rarity: "common",
                stats: {
                    durability: 85,
                    material: "Die-cast Aluminum",
                    strength: "High"
                },
                gameData: {
                    unlockLevel: 1,
                    craftable: true,
                    sellPrice: 8,
                    repairCost: 2
                }
            },
            {
                id: "corner_slot_brackets",
                name: "Corner Slot Brackets",
                description: "T-slot compatible corner connectors for frame assembly.",
                category: "frame",
                subcategory: "brackets",
                price: 10,
                amazonUrl: "https://amzn.to/3vZvz2b",
                quantity: 8,
                rarity: "common",
                stats: {
                    durability: 80,
                    material: "Aluminum Alloy",
                    compatibility: "2020 Profile"
                },
                gameData: {
                    unlockLevel: 1,
                    craftable: true,
                    sellPrice: 7,
                    repairCost: 2
                }
            }
        ]
    },

    // ==========================================
    // CATEGORY 2: MOTION SYSTEM
    // ==========================================
    motionSystem: {
        categoryId: "motion",
        categoryName: "Motion System",
        categoryIcon: "⚙️",
        totalCost: 108,

        parts: [
            {
                id: "ball_screw_250mm_y",
                name: "Ball Screw & Guide - Y Axis (250mm)",
                description: "5mm pitch ball screw with guide for precise Y-axis movement. Critical for positioning accuracy.",
                category: "motion",
                subcategory: "ball_screw",
                price: 32,
                amazonUrl: "https://amzn.to/3vIMEgz",
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 88,
                    pitch: 5, // mm per revolution
                    length: 250,
                    accuracy: 0.05, // mm
                    material: "Chrome Steel",
                    efficiency: 0.9
                },
                gameData: {
                    unlockLevel: 4,
                    craftable: false,
                    sellPrice: 25,
                    repairCost: 8,
                    criticalPart: true
                }
            },
            {
                id: "ball_screw_350mm_z",
                name: "Ball Screw & Guide - Z Axis (350mm)",
                description: "5mm pitch ball screw with guide for Z-axis depth control. Essential for cut depth precision.",
                category: "motion",
                subcategory: "ball_screw",
                price: 42,
                amazonUrl: "https://amzn.to/393gUeg",
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 88,
                    pitch: 5,
                    length: 350,
                    accuracy: 0.05,
                    material: "Chrome Steel",
                    efficiency: 0.9
                },
                gameData: {
                    unlockLevel: 4,
                    craftable: false,
                    sellPrice: 33,
                    repairCost: 10,
                    criticalPart: true
                }
            },
            {
                id: "pulley_large",
                name: "Large Pulley for Motor",
                description: "High-torque pulley for motor output. Determines gear ratio for cutting speed.",
                category: "motion",
                subcategory: "pulley",
                price: 10,
                amazonUrl: "https://amzn.to/3EGEDN4",
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 80,
                    teeth: 60,
                    material: "Aluminum",
                    boreSize: "8mm"
                },
                gameData: {
                    unlockLevel: 2,
                    craftable: true,
                    sellPrice: 8,
                    repairCost: 2
                }
            },
            {
                id: "pulley_small",
                name: "Small Pulley for Motor",
                description: "Speed pulley for motor coupling. Paired with large pulley for gear reduction.",
                category: "motion",
                subcategory: "pulley",
                price: 10,
                amazonUrl: "https://amzn.to/3ELvdAc",
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 80,
                    teeth: 20,
                    material: "Aluminum",
                    boreSize: "5mm"
                },
                gameData: {
                    unlockLevel: 2,
                    craftable: true,
                    sellPrice: 8,
                    repairCost: 2
                }
            },
            {
                id: "pillow_block_bearings",
                name: "1/2\" Bore Pillow Block Bearings",
                description: "Self-aligning pillow block bearings for shaft support. Quantity: 2 required.",
                category: "motion",
                subcategory: "bearings",
                price: 24,
                amazonUrl: "https://amzn.to/3xLAZQJ",
                quantity: 2,
                rarity: "uncommon",
                stats: {
                    durability: 85,
                    bore: 0.5, // inches
                    type: "Self-aligning",
                    loadRating: 500, // lbs
                    material: "Cast Iron Housing, Chrome Steel Ball"
                },
                gameData: {
                    unlockLevel: 3,
                    craftable: false,
                    sellPrice: 18,
                    repairCost: 5
                }
            }
        ]
    },

    // ==========================================
    // CATEGORY 3: ELECTRONICS & CONTROL
    // ==========================================
    electronicsAndControl: {
        categoryId: "electronics",
        categoryName: "Electronics & Control",
        categoryIcon: "🔌",
        totalCost: 282,

        parts: [
            {
                id: "arduino_atmega",
                name: "Arduino ATMega (High GPIO)",
                description: "ATMega microcontroller with expanded GPIO pins. The brain of the GemBot control system.",
                category: "electronics",
                subcategory: "microcontroller",
                price: 42,
                amazonUrl: "https://amzn.to/3vI0ksc",
                quantity: 1,
                rarity: "epic",
                stats: {
                    durability: 75,
                    gpioPins: 54,
                    analogInputs: 16,
                    clockSpeed: "16MHz",
                    flashMemory: "256KB",
                    voltage: "5V"
                },
                gameData: {
                    unlockLevel: 5,
                    craftable: false,
                    sellPrice: 35,
                    repairCost: 15,
                    criticalPart: true
                }
            },
            {
                id: "keypad_3x4",
                name: "3x4 Membrane Keypad",
                description: "Numeric keypad for manual input and emergency controls.",
                category: "electronics",
                subcategory: "input",
                price: 18,
                amazonUrl: "https://amzn.to/3xQsnZd",
                quantity: 1,
                rarity: "common",
                stats: {
                    durability: 70,
                    keys: 12,
                    interface: "Matrix",
                    material: "Membrane"
                },
                gameData: {
                    unlockLevel: 2,
                    craftable: false,
                    sellPrice: 12,
                    repairCost: 4
                }
            },
            {
                id: "power_toggle_switch",
                name: "Power Toggle Switch",
                description: "Heavy-duty toggle switch for main power control. Safety-rated.",
                category: "electronics",
                subcategory: "power",
                price: 12,
                amazonUrl: "https://amzn.to/37Egwm4",
                quantity: 1,
                rarity: "common",
                stats: {
                    durability: 90,
                    rating: "20A @ 12V",
                    type: "SPST Toggle",
                    mounting: "Panel"
                },
                gameData: {
                    unlockLevel: 1,
                    craftable: false,
                    sellPrice: 8,
                    repairCost: 2
                }
            },
            {
                id: "power_supply_400w",
                name: "400W 33A 12V DC Power Supply",
                description: "High-capacity switching power supply. Powers all motors and electronics.",
                category: "electronics",
                subcategory: "power",
                price: 69,
                amazonUrl: "https://amzn.to/3k6Cr87",
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 85,
                    wattage: 400,
                    outputVoltage: 12,
                    outputCurrent: 33,
                    efficiency: 0.85,
                    inputVoltage: "110V/220V AC"
                },
                gameData: {
                    unlockLevel: 4,
                    craftable: false,
                    sellPrice: 55,
                    repairCost: 15,
                    criticalPart: true
                }
            },
            {
                id: "brushed_motor_12v",
                name: "Brushed Electric Motor - 12V 5600 RPM",
                description: "High-speed brushed DC motor for spindle drive. Core cutting power.",
                category: "electronics",
                subcategory: "motor",
                price: 80,
                amazonUrl: "https://amzn.to/3MseOTL",
                quantity: 1,
                rarity: "epic",
                stats: {
                    durability: 80,
                    voltage: 12,
                    rpm: 5600,
                    type: "Brushed DC",
                    torque: "High",
                    noise: "Medium"
                },
                gameData: {
                    unlockLevel: 5,
                    craftable: false,
                    sellPrice: 65,
                    repairCost: 20,
                    criticalPart: true,
                    wearRate: 0.001 // per operation
                }
            },
            {
                id: "pwm_motor_controller",
                name: "12V 40A PWM DC Motor Speed Controller",
                description: "Pulse-width modulation controller for precise motor speed control. Quantity: 2 required.",
                category: "electronics",
                subcategory: "controller",
                price: 21,
                amazonUrl: "https://amzn.to/38lVUze",
                quantity: 2,
                rarity: "uncommon",
                stats: {
                    durability: 75,
                    voltage: 12,
                    maxCurrent: 40,
                    pwmFrequency: "15kHz",
                    efficiency: 0.95
                },
                gameData: {
                    unlockLevel: 3,
                    craftable: false,
                    sellPrice: 16,
                    repairCost: 5
                }
            },
            {
                id: "rpm_sensor_display",
                name: "RPM Sensor and Display",
                description: "Real-time RPM monitoring with digital display. Essential for speed calibration.",
                category: "electronics",
                subcategory: "sensor",
                price: 19,
                amazonUrl: "https://amzn.to/38iITGG",
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 70,
                    maxRpm: 99999,
                    accuracy: "±1 RPM",
                    display: "4-digit LED"
                },
                gameData: {
                    unlockLevel: 3,
                    craftable: false,
                    sellPrice: 15,
                    repairCost: 4
                }
            }
        ]
    },

    // ==========================================
    // CATEGORY 4: WIRING & MISCELLANEOUS
    // ==========================================
    wiringAndMisc: {
        categoryId: "wiring",
        categoryName: "Wiring & Miscellaneous",
        categoryIcon: "🔧",
        totalCost: 24,

        parts: [
            {
                id: "silicone_tubing",
                name: "Silicone Tubing",
                description: "Flexible silicone tubing for coolant/lubricant delivery system.",
                category: "wiring",
                subcategory: "tubing",
                price: 9,
                amazonUrl: "https://amzn.to/3k8kW7x",
                quantity: 1,
                rarity: "common",
                stats: {
                    durability: 85,
                    material: "Food-grade Silicone",
                    temperatureRange: "-40°C to 200°C",
                    flexibility: "High"
                },
                gameData: {
                    unlockLevel: 1,
                    craftable: false,
                    sellPrice: 6,
                    repairCost: 2
                }
            },
            {
                id: "premium_wires",
                name: "Premium Silicone-Covered Wires",
                description: "High-quality cut-to-length wires with premium silicone insulation.",
                category: "wiring",
                subcategory: "wiring",
                price: 15,
                amazonUrl: "https://amzn.to/3xVmb29",
                quantity: 1,
                rarity: "common",
                stats: {
                    durability: 80,
                    gaugeRange: "12-22 AWG",
                    insulation: "Silicone",
                    temperatureRating: "200°C"
                },
                gameData: {
                    unlockLevel: 1,
                    craftable: false,
                    sellPrice: 10,
                    repairCost: 3
                }
            }
        ]
    },

    // ==========================================
    // CATEGORY 5: CUSTOM 3D PRINTED PARTS
    // ==========================================
    custom3DPrinted: {
        categoryId: "3dprinted",
        categoryName: "Custom 3D Printed Parts",
        categoryIcon: "🖨️",
        totalCost: 3500,
        note: "Custom designed and fabricated parts - value includes design, print time, materials, and finishing",

        parts: [
            {
                id: "structural_connectors",
                name: "Structural Connectors Set",
                description: "Custom-designed connectors for frame assembly. Precision-printed for perfect fit.",
                category: "3dprinted",
                subcategory: "structural",
                price: 250,
                stlFiles: ["VslotTconnect.png", "90 2020 connector.png", "L-bracket (1).png"],
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 70,
                    material: "PETG/ABS",
                    infill: "60%",
                    printTime: "8 hours"
                },
                gameData: {
                    unlockLevel: 6,
                    craftable: true,
                    printTime: 480, // minutes
                    materialCost: 15,
                    sellPrice: 180,
                    repairCost: 20
                }
            },
            {
                id: "motor_mounts",
                name: "Motor Mounts Set",
                description: "Precision motor mounting brackets for perfect alignment.",
                category: "3dprinted",
                subcategory: "mounts",
                price: 300,
                stlFiles: ["y motor mount mod.png", "longer y axis motor mount.png", "Motor_Attach.png", "Carrier_motor_attach.png"],
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 75,
                    material: "ABS",
                    infill: "80%",
                    printTime: "12 hours"
                },
                gameData: {
                    unlockLevel: 6,
                    craftable: true,
                    printTime: 720,
                    materialCost: 20,
                    sellPrice: 220,
                    repairCost: 25
                }
            },
            {
                id: "sensor_housings",
                name: "Sensor Housings Set",
                description: "Protective housings for all sensors and limit switches.",
                category: "3dprinted",
                subcategory: "housings",
                price: 150,
                stlFiles: ["limit_switch_cover.png", "X_Limit_Switch.png", "Z axis limit bracket.png", "switchmount.png"],
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 65,
                    material: "PLA/PETG",
                    infill: "40%",
                    printTime: "4 hours"
                },
                gameData: {
                    unlockLevel: 4,
                    craftable: true,
                    printTime: 240,
                    materialCost: 8,
                    sellPrice: 100,
                    repairCost: 12
                }
            },
            {
                id: "touch_screen_holder",
                name: "Touch Screen Holder Assembly",
                description: "Custom mount for Nextion touch screen display with cable management.",
                category: "3dprinted",
                subcategory: "mounts",
                price: 200,
                stlFiles: ["touchScreenHolder.png", "touchScreenStand.png", "touchScreenCase.png", "touchScreenMount.png"],
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 70,
                    material: "PETG",
                    infill: "50%",
                    printTime: "6 hours"
                },
                gameData: {
                    unlockLevel: 5,
                    craftable: true,
                    printTime: 360,
                    materialCost: 12,
                    sellPrice: 140,
                    repairCost: 18
                }
            },
            {
                id: "arduino_enclosure",
                name: "Arduino Enclosure Box",
                description: "Protective enclosure for Arduino ATMega with ventilation and wire routing.",
                category: "3dprinted",
                subcategory: "enclosures",
                price: 180,
                stlFiles: ["arduinoBox.png", "modular arduino BBox.png", "MEGA_R2_MOUNT.png"],
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 75,
                    material: "ABS",
                    infill: "45%",
                    printTime: "5 hours"
                },
                gameData: {
                    unlockLevel: 4,
                    craftable: true,
                    printTime: 300,
                    materialCost: 10,
                    sellPrice: 130,
                    repairCost: 15
                }
            },
            {
                id: "lcd_casing",
                name: "20x4 LCD Casing",
                description: "Front and back casing for 20x4 character LCD display.",
                category: "3dprinted",
                subcategory: "enclosures",
                price: 120,
                stlFiles: ["20x4_LCD_Casing_Back.png", "20x4_LCD_Casing_Front.png", "lcdBackImproved.png"],
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 70,
                    material: "PLA",
                    infill: "35%",
                    printTime: "3 hours"
                },
                gameData: {
                    unlockLevel: 3,
                    craftable: true,
                    printTime: 180,
                    materialCost: 6,
                    sellPrice: 85,
                    repairCost: 10
                }
            },
            {
                id: "arbor_extension",
                name: "Arbor Extension Set",
                description: "Custom arbor extensions for various dop stick sizes.",
                category: "3dprinted",
                subcategory: "tooling",
                price: 350,
                stlFiles: ["arbor Extension.png", "arborExtensionV10.png", "arborExtensionV2.png", "arbor screw.png"],
                quantity: 1,
                rarity: "epic",
                stats: {
                    durability: 80,
                    material: "PETG/Nylon",
                    infill: "100%",
                    printTime: "10 hours"
                },
                gameData: {
                    unlockLevel: 7,
                    craftable: true,
                    printTime: 600,
                    materialCost: 25,
                    sellPrice: 260,
                    repairCost: 30,
                    criticalPart: true
                }
            },
            {
                id: "index_gear_system",
                name: "96-Tooth Index Gear System",
                description: "Precision 96-tooth index gear with pointer for faceting angles.",
                category: "3dprinted",
                subcategory: "precision",
                price: 500,
                stlFiles: ["Atlas_96_Tooth_Gear.png", "96 Tooth Pointer.png", "96 Tooth PointerMount.png", "indexGearMount.png"],
                quantity: 1,
                rarity: "legendary",
                stats: {
                    durability: 85,
                    teeth: 96,
                    material: "Nylon/PETG",
                    infill: "100%",
                    printTime: "15 hours",
                    accuracy: "0.5°"
                },
                gameData: {
                    unlockLevel: 8,
                    craftable: true,
                    printTime: 900,
                    materialCost: 35,
                    sellPrice: 380,
                    repairCost: 45,
                    criticalPart: true
                }
            },
            {
                id: "dop_stick_holders",
                name: "Dop Stick & Collet Holders",
                description: "Specialized holders for various dop stick sizes and collets.",
                category: "3dprinted",
                subcategory: "tooling",
                price: 280,
                stlFiles: ["Base_Holder.png", "HolderOneV01.png", "Carrier_2.png"],
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 75,
                    material: "PETG",
                    infill: "70%",
                    printTime: "8 hours"
                },
                gameData: {
                    unlockLevel: 6,
                    craftable: true,
                    printTime: 480,
                    materialCost: 18,
                    sellPrice: 200,
                    repairCost: 25
                }
            },
            {
                id: "transfer_jig",
                name: "Transfer Jig Complete Set",
                description: "Precision transfer jig for flipping gemstones during cutting.",
                category: "3dprinted",
                subcategory: "tooling",
                price: 400,
                stlFiles: ["TransferJig.png", "TransferJigMain.png", "TransferJigMirror.png", "TransferJigKnob.png", "TransferPadComplete.png"],
                quantity: 1,
                rarity: "epic",
                stats: {
                    durability: 80,
                    material: "ABS/PETG",
                    infill: "60%",
                    printTime: "12 hours"
                },
                gameData: {
                    unlockLevel: 7,
                    craftable: true,
                    printTime: 720,
                    materialCost: 28,
                    sellPrice: 300,
                    repairCost: 35,
                    criticalPart: true
                }
            },
            {
                id: "drip_system",
                name: "Water Drip System Components",
                description: "Complete drip system for coolant delivery during cutting.",
                category: "3dprinted",
                subcategory: "accessories",
                price: 150,
                stlFiles: ["Drip Switch Housing.png", "dripLid.png", "drip hole fix.png"],
                quantity: 1,
                rarity: "uncommon",
                stats: {
                    durability: 70,
                    material: "PETG",
                    infill: "45%",
                    printTime: "4 hours"
                },
                gameData: {
                    unlockLevel: 4,
                    craftable: true,
                    printTime: 240,
                    materialCost: 8,
                    sellPrice: 100,
                    repairCost: 12
                }
            },
            {
                id: "mid_platform",
                name: "Z-Axis Mid Platform Assembly",
                description: "Central platform for Z-axis with arch supports.",
                category: "3dprinted",
                subcategory: "structural",
                price: 320,
                stlFiles: ["13 8mm w zaxis mid platform (1).png", "midPlatformArchSupport.png", "zspacerbracket.png"],
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 75,
                    material: "ABS/PETG",
                    infill: "65%",
                    printTime: "10 hours"
                },
                gameData: {
                    unlockLevel: 6,
                    craftable: true,
                    printTime: 600,
                    materialCost: 22,
                    sellPrice: 240,
                    repairCost: 28
                }
            },
            {
                id: "cube_enclosure",
                name: "GemBot Cube Enclosure",
                description: "Modular cube-style enclosure for electronics and display.",
                category: "3dprinted",
                subcategory: "enclosures",
                price: 450,
                stlFiles: ["cube.png", "cube Front.png", "Cube-Back-14mm-ssd.png", "Cube-bottom.png", "Cube-top.png", "Cube-left.png", "Cube-right.png"],
                quantity: 1,
                rarity: "epic",
                stats: {
                    durability: 80,
                    material: "ABS",
                    infill: "50%",
                    printTime: "20 hours"
                },
                gameData: {
                    unlockLevel: 8,
                    craftable: true,
                    printTime: 1200,
                    materialCost: 40,
                    sellPrice: 340,
                    repairCost: 40
                }
            },
            {
                id: "decorative_robot",
                name: "GemBot Robot Mascot",
                description: "Decorative robot figure with articulated arms.",
                category: "3dprinted",
                subcategory: "decorative",
                price: 100,
                stlFiles: ["gemBotRobot.png", "gbNewArmTest.png", "gbNewHandTest.png"],
                quantity: 1,
                rarity: "rare",
                stats: {
                    durability: 60,
                    material: "PLA",
                    infill: "20%",
                    printTime: "6 hours"
                },
                gameData: {
                    unlockLevel: 10,
                    craftable: true,
                    printTime: 360,
                    materialCost: 8,
                    sellPrice: 75,
                    repairCost: 8,
                    cosmetic: true
                }
            }
        ]
    },

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Get all parts as a flat array
     */
    getAllParts() {
        return [
            ...this.frameAndStructural.parts,
            ...this.motionSystem.parts,
            ...this.electronicsAndControl.parts,
            ...this.wiringAndMisc.parts,
            ...this.custom3DPrinted.parts
        ];
    },

    /**
     * Get part by ID
     */
    getPartById(partId) {
        return this.getAllParts().find(part => part.id === partId);
    },

    /**
     * Get all parts by category
     */
    getPartsByCategory(categoryId) {
        const categoryMap = {
            'frame': this.frameAndStructural,
            'motion': this.motionSystem,
            'electronics': this.electronicsAndControl,
            'wiring': this.wiringAndMisc,
            '3dprinted': this.custom3DPrinted
        };
        return categoryMap[categoryId]?.parts || [];
    },

    /**
     * Get all parts by rarity
     */
    getPartsByRarity(rarity) {
        return this.getAllParts().filter(part => part.rarity === rarity);
    },

    /**
     * Get all critical parts (required for machine to function)
     */
    getCriticalParts() {
        return this.getAllParts().filter(part => part.gameData?.criticalPart);
    },

    /**
     * Get all craftable (3D printable) parts
     */
    getCraftableParts() {
        return this.getAllParts().filter(part => part.gameData?.craftable);
    },

    /**
     * Calculate total cost for a list of part IDs
     */
    calculateTotalCost(partIds) {
        return partIds.reduce((total, partId) => {
            const part = this.getPartById(partId);
            return total + (part ? part.price * (part.quantity || 1) : 0);
        }, 0);
    },

    /**
     * Get random part based on rarity drop rates
     */
    getRandomPartByRarity() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [rarity, data] of Object.entries(this.rarityTiers)) {
            cumulative += data.dropRate;
            if (rand <= cumulative) {
                const partsOfRarity = this.getPartsByRarity(rarity);
                if (partsOfRarity.length > 0) {
                    return partsOfRarity[Math.floor(Math.random() * partsOfRarity.length)];
                }
            }
        }
        
        // Fallback to common
        const commonParts = this.getPartsByRarity('common');
        return commonParts[Math.floor(Math.random() * commonParts.length)];
    },

    /**
     * Check if part has failed based on rarity failure chance
     */
    checkPartFailure(partId) {
        const part = this.getPartById(partId);
        if (!part) return false;
        
        const failureChance = this.rarityTiers[part.rarity]?.failureChance || 0.05;
        return Math.random() < failureChance;
    },

    /**
     * Get build progress percentage
     */
    getBuildProgress(ownedPartIds) {
        const allParts = this.getAllParts();
        const ownedCount = ownedPartIds.filter(id => this.getPartById(id)).length;
        return Math.round((ownedCount / allParts.length) * 100);
    },

    /**
     * Generate part card HTML for display
     */
    generatePartCardHTML(partId) {
        const part = this.getPartById(partId);
        if (!part) return '';
        
        const rarityColor = this.rarityTiers[part.rarity]?.color || '#9e9e9e';
        
        return `
            <div class="part-card" style="border-color: ${rarityColor}">
                <div class="part-header" style="background: ${rarityColor}">
                    <span class="part-rarity">${part.rarity.toUpperCase()}</span>
                    <span class="part-name">${part.name}</span>
                </div>
                <div class="part-body">
                    <p class="part-description">${part.description}</p>
                    <div class="part-stats">
                        <span class="stat">💰 $${part.price}</span>
                        <span class="stat">🔧 Durability: ${part.stats?.durability || 'N/A'}</span>
                        <span class="stat">📦 Qty: ${part.quantity || 1}</span>
                    </div>
                    ${part.gameData ? `
                        <div class="game-stats">
                            <span class="stat">🎮 Unlock: Lv.${part.gameData.unlockLevel}</span>
                            <span class="stat">💵 Sell: $${part.gameData.sellPrice}</span>
                            ${part.gameData.craftable ? '<span class="stat craftable">🖨️ Craftable</span>' : ''}
                            ${part.gameData.criticalPart ? '<span class="stat critical">⚠️ Critical</span>' : ''}
                        </div>
                    ` : ''}
                </div>
                ${part.amazonUrl ? `
                    <div class="part-footer">
                        <a href="${part.amazonUrl}" target="_blank" class="buy-link">Buy on Amazon</a>
                    </div>
                ` : ''}
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotPartsDatabase;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.GemBotPartsDatabase = GemBotPartsDatabase;
}

console.log('💎 GemBot Parts Database loaded!');
console.log(`📦 Total parts: ${GemBotPartsDatabase.getAllParts().length}`);
console.log(`💰 Total build cost: $${GemBotPartsDatabase.costSummary.grandTotal}`);
