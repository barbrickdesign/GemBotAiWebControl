/**
 * 💎 GemBot STL Preview Catalog
 * Complete inventory of 3D printable parts with preview images
 * 
 * Source: STL_Previews/ folder (200+ parts)
 * Links to: gembot-parts-database.js for purchasing/crafting
 * 
 * Categories:
 * - Structural components
 * - Motor mounts & brackets
 * - Electronics enclosures
 * - Index gear system
 * - Transfer jig components
 * - Touch screen holders
 * - Decorative elements
 */

const GemBotSTLCatalog = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",
    previewFolder: "STL_Previews/",
    
    // Print settings
    printSettings: {
        materials: {
            PLA: { cost: 0.02, strength: 60, heatResist: 60, printTemp: 200 },
            PETG: { cost: 0.025, strength: 80, heatResist: 80, printTemp: 240 },
            ABS: { cost: 0.03, strength: 85, heatResist: 95, printTemp: 250 },
            Nylon: { cost: 0.05, strength: 95, heatResist: 90, printTemp: 260 },
            TPU: { cost: 0.04, strength: 70, heatResist: 70, printTemp: 220 }
        },
        infillLevels: {
            low: { percent: 20, strengthMultiplier: 0.6, timeMultiplier: 0.7, materialMultiplier: 0.7 },
            medium: { percent: 40, strengthMultiplier: 0.8, timeMultiplier: 0.85, materialMultiplier: 0.85 },
            high: { percent: 60, strengthMultiplier: 0.95, timeMultiplier: 1.0, materialMultiplier: 1.0 },
            solid: { percent: 100, strengthMultiplier: 1.0, timeMultiplier: 1.3, materialMultiplier: 1.3 }
        }
    },

    // Part categories
    categories: {
        structural: {
            id: "structural",
            name: "Structural Components",
            icon: "🏗️",
            description: "Frame connectors, brackets, and structural supports"
        },
        motorMounts: {
            id: "motorMounts",
            name: "Motor Mounts & Brackets",
            icon: "⚙️",
            description: "Motor mounting hardware and drive system brackets"
        },
        electronics: {
            id: "electronics",
            name: "Electronics Enclosures",
            icon: "🔌",
            description: "Arduino boxes, LCD cases, and controller housings"
        },
        indexGear: {
            id: "indexGear",
            name: "Index Gear System",
            icon: "🎯",
            description: "96-tooth gear, pointers, and positioning components"
        },
        transferJig: {
            id: "transferJig",
            name: "Transfer Jig Components",
            icon: "🔄",
            description: "Precision jigs for gemstone transfer"
        },
        touchScreen: {
            id: "touchScreen",
            name: "Touch Screen Holders",
            icon: "📱",
            description: "Mounts and cases for Nextion display"
        },
        arbor: {
            id: "arbor",
            name: "Arbor & Tooling",
            icon: "🔧",
            description: "Arbor extensions, screws, and tool holders"
        },
        limitSwitch: {
            id: "limitSwitch",
            name: "Limit Switches & Sensors",
            icon: "🚦",
            description: "Switch mounts and sensor housings"
        },
        drip: {
            id: "drip",
            name: "Drip System",
            icon: "💧",
            description: "Coolant delivery and water management"
        },
        decorative: {
            id: "decorative",
            name: "Decorative & Cosmetic",
            icon: "🎨",
            description: "Robot mascots, badges, and visual elements"
        },
        enclosures: {
            id: "enclosures",
            name: "Main Enclosures",
            icon: "📦",
            description: "Cube housing and main body panels"
        },
        platform: {
            id: "platform",
            name: "Platform & Axis",
            icon: "📐",
            description: "Mid-platforms, axis brackets, and supports"
        },
        accessories: {
            id: "accessories",
            name: "Accessories",
            icon: "🔩",
            description: "Clips, feet, spacers, and misc hardware"
        }
    },

    // Complete parts catalog with preview images
    parts: [
        // ==========================================
        // STRUCTURAL COMPONENTS
        // ==========================================
        {
            id: "vslot_t_connect",
            name: "V-Slot T-Connector",
            preview: "VslotTconnect.png",
            category: "structural",
            description: "T-shaped connector for 2020 aluminum extrusions",
            printTime: 45, // minutes
            materialWeight: 8, // grams
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 5, craftXP: 10 }
        },
        {
            id: "90_2020_connector",
            name: "90° 2020 Connector",
            preview: "90 2020 connector.png",
            category: "structural",
            description: "Right-angle corner connector for frame assembly",
            printTime: 35,
            materialWeight: 6,
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 4, craftXP: 8 }
        },
        {
            id: "l_bracket",
            name: "L-Bracket",
            preview: "l-bracket.png",
            category: "structural",
            description: "Standard L-shaped reinforcement bracket",
            printTime: 30,
            materialWeight: 5,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 3, craftXP: 6 }
        },
        {
            id: "l_angle_bracket",
            name: "L Angle Bracket Corner Connector",
            preview: "L_Angle_Bracket_Corner_Connector_.png",
            category: "structural",
            description: "Heavy-duty corner connector for rigid joints",
            printTime: 40,
            materialWeight: 7,
            recommendedMaterial: "ABS",
            recommendedInfill: "solid",
            difficulty: 2,
            gameData: { unlockLevel: 2, sellPrice: 6, craftXP: 12 }
        },
        {
            id: "2020_end_cap",
            name: "2020 End Cap",
            preview: "2020endCap.png",
            category: "structural",
            description: "Protective end cap for aluminum extrusion",
            printTime: 15,
            materialWeight: 2,
            recommendedMaterial: "PLA",
            recommendedInfill: "medium",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 1, craftXP: 3 }
        },
        {
            id: "openbeam_foot",
            name: "OpenBeam Foot",
            preview: "OpenbeamFootPlain.png",
            category: "structural",
            description: "Adjustable foot for frame leveling",
            printTime: 25,
            materialWeight: 4,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 3, craftXP: 5 }
        },
        {
            id: "openbeam_90_coupler",
            name: "OpenBeam 90° Corner Coupler",
            preview: "OpenBeam_90_Degree_Corner_Coupler.png",
            category: "structural",
            description: "Corner connector for OpenBeam frames",
            printTime: 40,
            materialWeight: 8,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 2, sellPrice: 7, craftXP: 14 }
        },

        // ==========================================
        // MOTOR MOUNTS & BRACKETS
        // ==========================================
        {
            id: "y_motor_mount",
            name: "Y-Axis Motor Mount",
            preview: "y motor mount mod.png",
            category: "motorMounts",
            description: "NEMA17 stepper motor mount for Y-axis",
            printTime: 90,
            materialWeight: 25,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 20, craftXP: 40 }
        },
        {
            id: "y_motor_mount_long",
            name: "Extended Y Motor Mount",
            preview: "longer y axis motor mount.png",
            category: "motorMounts",
            description: "Extended mount for Y-axis motor positioning",
            printTime: 120,
            materialWeight: 35,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 5, sellPrice: 28, craftXP: 55 }
        },
        {
            id: "motor_attach",
            name: "Motor Attachment Plate",
            preview: "Motor_Attach.png",
            category: "motorMounts",
            description: "Universal motor mounting plate",
            printTime: 60,
            materialWeight: 18,
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 15, craftXP: 30 }
        },
        {
            id: "carrier_motor_attach",
            name: "Carrier Motor Attachment",
            preview: "Carrier_motor_attach.png",
            category: "motorMounts",
            description: "Motor mount for carriage assembly",
            printTime: 75,
            materialWeight: 22,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 18, craftXP: 36 }
        },
        {
            id: "nema17_mount",
            name: "NEMA 17 Mount",
            preview: "Nema17_Mount.png",
            category: "motorMounts",
            description: "Standard NEMA 17 stepper motor bracket",
            printTime: 50,
            materialWeight: 15,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 12, craftXP: 24 }
        },
        {
            id: "nema17_gearbox",
            name: "NEMA 17 Planetary Gearbox Mount",
            preview: "Nema 17 5_1 Planetary Gearbox.png",
            category: "motorMounts",
            description: "5:1 planetary gearbox housing for NEMA 17",
            printTime: 180,
            materialWeight: 45,
            recommendedMaterial: "Nylon",
            recommendedInfill: "solid",
            difficulty: 5,
            gameData: { unlockLevel: 7, sellPrice: 50, craftXP: 100 }
        },

        // ==========================================
        // ELECTRONICS ENCLOSURES
        // ==========================================
        {
            id: "arduino_box",
            name: "Arduino Enclosure Box",
            preview: "arduinoBox.png",
            category: "electronics",
            description: "Protective enclosure for Arduino Mega",
            printTime: 120,
            materialWeight: 40,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 25, craftXP: 50 }
        },
        {
            id: "modular_arduino_bbox",
            name: "Modular Arduino BBox",
            preview: "modular arduino BBox.png",
            category: "electronics",
            description: "Modular Arduino enclosure with expansion slots",
            printTime: 150,
            materialWeight: 50,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 5, sellPrice: 35, craftXP: 70 }
        },
        {
            id: "mega_r2_mount",
            name: "Arduino Mega R2 Mount",
            preview: "MEGA_R2_MOUNT.png",
            category: "electronics",
            description: "DIN-rail compatible Mega mount",
            printTime: 60,
            materialWeight: 20,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 15, craftXP: 30 }
        },
        {
            id: "lcd_casing_back",
            name: "20x4 LCD Casing Back",
            preview: "20x4_LCD_Casing_Back.png",
            category: "electronics",
            description: "Rear panel for 20x4 character LCD",
            printTime: 45,
            materialWeight: 12,
            recommendedMaterial: "PLA",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 2, sellPrice: 8, craftXP: 16 }
        },
        {
            id: "lcd_casing_front",
            name: "20x4 LCD Casing Front",
            preview: "20x4_LCD_Casing_Front.png",
            category: "electronics",
            description: "Front bezel for 20x4 character LCD",
            printTime: 50,
            materialWeight: 14,
            recommendedMaterial: "PLA",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 2, sellPrice: 10, craftXP: 20 }
        },
        {
            id: "lcd_back_improved",
            name: "LCD Back Improved",
            preview: "lcdBackImproved.png",
            category: "electronics",
            description: "Enhanced LCD back panel with ventilation",
            printTime: 55,
            materialWeight: 15,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 12, craftXP: 24 }
        },
        {
            id: "tb6600_din_mount",
            name: "TB6600 DIN Rail Mount",
            preview: "TB6600_DIN_rail_mount.png",
            category: "electronics",
            description: "DIN rail mount for TB6600 stepper driver",
            printTime: 40,
            materialWeight: 10,
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 8, craftXP: 16 }
        },
        {
            id: "buck_display_end",
            name: "Buck Converter Display End",
            preview: "Buck_with_Display-Side-End.png",
            category: "electronics",
            description: "End cap for buck converter with display",
            printTime: 30,
            materialWeight: 8,
            recommendedMaterial: "PLA",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 2, sellPrice: 6, craftXP: 12 }
        },

        // ==========================================
        // INDEX GEAR SYSTEM
        // ==========================================
        {
            id: "atlas_96_tooth_gear",
            name: "Atlas 96-Tooth Index Gear",
            preview: "Atlas_96_Tooth_Gear.png",
            category: "indexGear",
            description: "Precision 96-tooth gear for faceting index",
            printTime: 300,
            materialWeight: 80,
            recommendedMaterial: "Nylon",
            recommendedInfill: "solid",
            difficulty: 5,
            gameData: { unlockLevel: 8, sellPrice: 100, craftXP: 200, critical: true }
        },
        {
            id: "96_tooth_pointer",
            name: "96-Tooth Pointer",
            preview: "96 Tooth Pointer good.png",
            category: "indexGear",
            description: "Precision pointer for index gear alignment",
            printTime: 60,
            materialWeight: 15,
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 4,
            gameData: { unlockLevel: 6, sellPrice: 25, craftXP: 50 }
        },
        {
            id: "96_tooth_pointer_mount",
            name: "96-Tooth Pointer Mount",
            preview: "96 Tooth PointerMount.png",
            category: "indexGear",
            description: "Mount bracket for index pointer",
            printTime: 45,
            materialWeight: 12,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 5, sellPrice: 18, craftXP: 36 }
        },
        {
            id: "index_gear_mount",
            name: "Index Gear Mount",
            preview: "indexGearMount.png",
            category: "indexGear",
            description: "Central mount for index gear assembly",
            printTime: 90,
            materialWeight: 30,
            recommendedMaterial: "ABS",
            recommendedInfill: "solid",
            difficulty: 4,
            gameData: { unlockLevel: 6, sellPrice: 40, craftXP: 80, critical: true }
        },
        {
            id: "index_motor_box",
            name: "Index Motor Box",
            preview: "indexMotorBoxGood.png",
            category: "indexGear",
            description: "Enclosure for index stepper motor",
            printTime: 120,
            materialWeight: 35,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 3,
            gameData: { unlockLevel: 5, sellPrice: 30, craftXP: 60 }
        },

        // ==========================================
        // TRANSFER JIG COMPONENTS
        // ==========================================
        {
            id: "transfer_jig_main",
            name: "Transfer Jig Main Body",
            preview: "TransferJigMain.png",
            category: "transferJig",
            description: "Main body of precision transfer jig",
            printTime: 180,
            materialWeight: 60,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 4,
            gameData: { unlockLevel: 6, sellPrice: 55, craftXP: 110, critical: true }
        },
        {
            id: "transfer_jig_mirror",
            name: "Transfer Jig Mirror",
            preview: "TransferJigMirror.png",
            category: "transferJig",
            description: "Mirrored half of transfer jig",
            printTime: 180,
            materialWeight: 60,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 4,
            gameData: { unlockLevel: 6, sellPrice: 55, craftXP: 110 }
        },
        {
            id: "transfer_jig_knob",
            name: "Transfer Jig Knob",
            preview: "TransferJigKnob.png",
            category: "transferJig",
            description: "Adjustment knob for transfer jig",
            printTime: 30,
            materialWeight: 8,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 4, sellPrice: 8, craftXP: 16 }
        },
        {
            id: "transfer_jig_lid",
            name: "Transfer Jig Lid",
            preview: "JigLid.png",
            category: "transferJig",
            description: "Top cover for transfer jig",
            printTime: 45,
            materialWeight: 15,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 4, sellPrice: 12, craftXP: 24 }
        },
        {
            id: "transfer_pad_complete",
            name: "Transfer Pad Complete",
            preview: "TransferPadComplete.png",
            category: "transferJig",
            description: "Complete transfer pad assembly",
            printTime: 60,
            materialWeight: 20,
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 5, sellPrice: 25, craftXP: 50 }
        },

        // ==========================================
        // TOUCH SCREEN HOLDERS
        // ==========================================
        {
            id: "touch_screen_holder",
            name: "Touch Screen Holder",
            preview: "touchScreenHolder.png",
            category: "touchScreen",
            description: "Basic mount for Nextion touch screen",
            printTime: 90,
            materialWeight: 30,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 22, craftXP: 44 }
        },
        {
            id: "touch_screen_stand",
            name: "Touch Screen Stand",
            preview: "touchScreenStandComplete.png",
            category: "touchScreen",
            description: "Complete stand with adjustable angle",
            printTime: 150,
            materialWeight: 50,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 5, sellPrice: 40, craftXP: 80 }
        },
        {
            id: "touch_screen_case",
            name: "Touch Screen Case",
            preview: "touchScreenCase.png",
            category: "touchScreen",
            description: "Protective case for Nextion display",
            printTime: 120,
            materialWeight: 40,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 30, craftXP: 60 }
        },
        {
            id: "touch_screen_fancy",
            name: "Touch Screen Holder Fancy",
            preview: "touchScreenHolderFancy.png",
            category: "touchScreen",
            description: "Decorative touch screen mount",
            printTime: 180,
            materialWeight: 55,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 3,
            gameData: { unlockLevel: 6, sellPrice: 35, craftXP: 70, cosmetic: true }
        },

        // ==========================================
        // ARBOR & TOOLING
        // ==========================================
        {
            id: "arbor_extension",
            name: "Arbor Extension",
            preview: "arbor Extension.png",
            category: "arbor",
            description: "Standard arbor extension for dop sticks",
            printTime: 60,
            materialWeight: 20,
            recommendedMaterial: "Nylon",
            recommendedInfill: "solid",
            difficulty: 4,
            gameData: { unlockLevel: 5, sellPrice: 25, craftXP: 50, critical: true }
        },
        {
            id: "arbor_extension_v10",
            name: "Arbor Extension V10",
            preview: "arborExtensionV10.png",
            category: "arbor",
            description: "Latest version arbor extension",
            printTime: 75,
            materialWeight: 25,
            recommendedMaterial: "Nylon",
            recommendedInfill: "solid",
            difficulty: 4,
            gameData: { unlockLevel: 6, sellPrice: 35, craftXP: 70, critical: true }
        },
        {
            id: "arbor_screw",
            name: "Arbor Screw",
            preview: "arbor screw.png",
            category: "arbor",
            description: "Locking screw for arbor assembly",
            printTime: 20,
            materialWeight: 5,
            recommendedMaterial: "Nylon",
            recommendedInfill: "solid",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 8, craftXP: 16 }
        },
        {
            id: "base_holder",
            name: "Base Holder",
            preview: "Base_Holder.png",
            category: "arbor",
            description: "Base holder for dop stick assembly",
            printTime: 50,
            materialWeight: 18,
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 15, craftXP: 30 }
        },
        {
            id: "carrier_2",
            name: "Carrier Assembly",
            preview: "Carrier_2.png",
            category: "arbor",
            description: "Dop stick carrier assembly",
            printTime: 90,
            materialWeight: 30,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 5, sellPrice: 28, craftXP: 56 }
        },

        // ==========================================
        // LIMIT SWITCHES & SENSORS
        // ==========================================
        {
            id: "limit_switch_cover",
            name: "Limit Switch Cover",
            preview: "limit_switch_cover.png",
            category: "limitSwitch",
            description: "Protective cover for limit switches",
            printTime: 20,
            materialWeight: 4,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 1,
            gameData: { unlockLevel: 2, sellPrice: 3, craftXP: 6 }
        },
        {
            id: "x_limit_switch",
            name: "X-Axis Limit Switch Bracket",
            preview: "X_Limit_Switch.png",
            category: "limitSwitch",
            description: "Mount bracket for X-axis limit switch",
            printTime: 25,
            materialWeight: 6,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 5, craftXP: 10 }
        },
        {
            id: "z_axis_limit_bracket",
            name: "Z-Axis Limit Bracket",
            preview: "Z axis limit bracket.png",
            category: "limitSwitch",
            description: "Mount for Z-axis limit switch",
            printTime: 30,
            materialWeight: 8,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 6, craftXP: 12 }
        },
        {
            id: "x_limit_bracket_beefed",
            name: "X-Axis Limit Bracket (Heavy Duty)",
            preview: "x axis limit switch bracket beefed up v2.png",
            category: "limitSwitch",
            description: "Reinforced X-axis limit switch mount",
            printTime: 40,
            materialWeight: 12,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 4, sellPrice: 10, craftXP: 20 }
        },
        {
            id: "switch_mount",
            name: "Switch Mount",
            preview: "switchmount.png",
            category: "limitSwitch",
            description: "Universal switch mounting bracket",
            printTime: 20,
            materialWeight: 5,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 1,
            gameData: { unlockLevel: 2, sellPrice: 4, craftXP: 8 }
        },

        // ==========================================
        // DRIP SYSTEM
        // ==========================================
        {
            id: "drip_switch_housing",
            name: "Drip Switch Housing",
            preview: "Drip Switch Housing.png",
            category: "drip",
            description: "Housing for drip control valve",
            printTime: 45,
            materialWeight: 15,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 12, craftXP: 24 }
        },
        {
            id: "drip_lid",
            name: "Drip Lid",
            preview: "dripLid.png",
            category: "drip",
            description: "Lid for drip reservoir",
            printTime: 30,
            materialWeight: 10,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 8, craftXP: 16 }
        },
        {
            id: "drip_hole_fix",
            name: "Drip Hole Fix",
            preview: "drip hole fix.png",
            category: "drip",
            description: "Repair plug for drip holes",
            printTime: 10,
            materialWeight: 2,
            recommendedMaterial: "TPU",
            recommendedInfill: "solid",
            difficulty: 1,
            gameData: { unlockLevel: 2, sellPrice: 2, craftXP: 4 }
        },

        // ==========================================
        // DECORATIVE & COSMETIC
        // ==========================================
        {
            id: "gembot_robot",
            name: "GemBot Robot Mascot",
            preview: "gemBotRobot.png",
            category: "decorative",
            description: "Decorative robot mascot figure",
            printTime: 180,
            materialWeight: 40,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 3,
            gameData: { unlockLevel: 10, sellPrice: 30, craftXP: 60, cosmetic: true }
        },
        {
            id: "gembot_arm",
            name: "GemBot Robot Arm",
            preview: "gbNewArmTest.png",
            category: "decorative",
            description: "Articulated arm for robot mascot",
            printTime: 30,
            materialWeight: 8,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 2,
            gameData: { unlockLevel: 10, sellPrice: 5, craftXP: 10, cosmetic: true }
        },
        {
            id: "gembot_hand",
            name: "GemBot Robot Hand",
            preview: "gbNewHandTest.png",
            category: "decorative",
            description: "Hand for robot mascot",
            printTime: 20,
            materialWeight: 5,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 2,
            gameData: { unlockLevel: 10, sellPrice: 3, craftXP: 6, cosmetic: true }
        },
        {
            id: "grayson_county_sun",
            name: "Grayson County Sun Logo",
            preview: "grayson county sun.png",
            category: "decorative",
            description: "Decorative Grayson County sun emblem",
            printTime: 60,
            materialWeight: 15,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 2,
            gameData: { unlockLevel: 8, sellPrice: 10, craftXP: 20, cosmetic: true }
        },

        // ==========================================
        // MAIN ENCLOSURES
        // ==========================================
        {
            id: "cube_front",
            name: "Cube Front Panel",
            preview: "cube Front.png",
            category: "enclosures",
            description: "Front panel for cube enclosure",
            printTime: 240,
            materialWeight: 80,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 7, sellPrice: 50, craftXP: 100 }
        },
        {
            id: "cube_back",
            name: "Cube Back Panel",
            preview: "Cube-Back-14mm-ssd.png",
            category: "enclosures",
            description: "Back panel with SSD mount",
            printTime: 240,
            materialWeight: 80,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 7, sellPrice: 50, craftXP: 100 }
        },
        {
            id: "cube_bottom",
            name: "Cube Bottom Panel",
            preview: "Cube-bottom.png",
            category: "enclosures",
            description: "Bottom panel for cube enclosure",
            printTime: 200,
            materialWeight: 70,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 7, sellPrice: 45, craftXP: 90 }
        },
        {
            id: "cube_top",
            name: "Cube Top Panel",
            preview: "Cube-top.png",
            category: "enclosures",
            description: "Top panel for cube enclosure",
            printTime: 200,
            materialWeight: 70,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 7, sellPrice: 45, craftXP: 90 }
        },
        {
            id: "cube_left",
            name: "Cube Left Panel",
            preview: "Cube-left.png",
            category: "enclosures",
            description: "Left side panel for cube enclosure",
            printTime: 220,
            materialWeight: 75,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 7, sellPrice: 48, craftXP: 96 }
        },
        {
            id: "cube_right",
            name: "Cube Right Panel",
            preview: "Cube-right.png",
            category: "enclosures",
            description: "Right side panel for cube enclosure",
            printTime: 220,
            materialWeight: 75,
            recommendedMaterial: "ABS",
            recommendedInfill: "medium",
            difficulty: 4,
            gameData: { unlockLevel: 7, sellPrice: 48, craftXP: 96 }
        },
        {
            id: "cube_corner",
            name: "Cube Corner Piece",
            preview: "Cube-corner.png",
            category: "enclosures",
            description: "Corner connector for cube panels",
            printTime: 30,
            materialWeight: 10,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 6, sellPrice: 8, craftXP: 16 }
        },

        // ==========================================
        // PLATFORM & AXIS
        // ==========================================
        {
            id: "mid_platform_8mm",
            name: "Z-Axis Mid Platform 8mm",
            preview: "13 8mm w zaxis mid platform (1).png",
            category: "platform",
            description: "Central platform for Z-axis assembly",
            printTime: 180,
            materialWeight: 60,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 4,
            gameData: { unlockLevel: 6, sellPrice: 45, craftXP: 90, critical: true }
        },
        {
            id: "mid_platform_arch_support",
            name: "Mid Platform Arch Support",
            preview: "midPlatformArchSupport.png",
            category: "platform",
            description: "Arch support for mid platform",
            printTime: 60,
            materialWeight: 20,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 3,
            gameData: { unlockLevel: 5, sellPrice: 18, craftXP: 36 }
        },
        {
            id: "z_spacer_bracket",
            name: "Z-Axis Spacer Bracket",
            preview: "zspacerbracket.png",
            category: "platform",
            description: "Spacer bracket for Z-axis alignment",
            printTime: 40,
            materialWeight: 12,
            recommendedMaterial: "PETG",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 4, sellPrice: 10, craftXP: 20 }
        },
        {
            id: "z_coupler",
            name: "Z-Axis Coupler",
            preview: "Z_Coupler.png",
            category: "platform",
            description: "Shaft coupler for Z-axis lead screw",
            printTime: 30,
            materialWeight: 8,
            recommendedMaterial: "Nylon",
            recommendedInfill: "solid",
            difficulty: 3,
            gameData: { unlockLevel: 4, sellPrice: 12, craftXP: 24 }
        },
        {
            id: "z_axis_stop_bracket",
            name: "Z-Axis Stop Bracket",
            preview: "Z_axis_stop_bracket.png",
            category: "platform",
            description: "Hard stop bracket for Z-axis travel",
            printTime: 25,
            materialWeight: 7,
            recommendedMaterial: "ABS",
            recommendedInfill: "high",
            difficulty: 2,
            gameData: { unlockLevel: 3, sellPrice: 6, craftXP: 12 }
        },

        // ==========================================
        // ACCESSORIES
        // ==========================================
        {
            id: "2020_wire_clip",
            name: "2020 Wire Clip",
            preview: "2020_Wire_Clip.png",
            category: "accessories",
            description: "Cable management clip for 2020 profile",
            printTime: 10,
            materialWeight: 2,
            recommendedMaterial: "PLA",
            recommendedInfill: "medium",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 1, craftXP: 2 }
        },
        {
            id: "cable_organizer",
            name: "Cable Organizer",
            preview: "Cable_organizer.png",
            category: "accessories",
            description: "Cable management organizer",
            printTime: 25,
            materialWeight: 6,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 4, craftXP: 8 }
        },
        {
            id: "foot_large_hole",
            name: "Adjustable Foot (Large Hole)",
            preview: "-Foot_Large_Hole.png",
            category: "accessories",
            description: "Adjustable foot with large mounting hole",
            printTime: 25,
            materialWeight: 8,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 5, craftXP: 10 }
        },
        {
            id: "foot_small_hole",
            name: "Adjustable Foot (Small Hole)",
            preview: "-Foot_Small_Hole.png",
            category: "accessories",
            description: "Adjustable foot with small mounting hole",
            printTime: 25,
            materialWeight: 8,
            recommendedMaterial: "PETG",
            recommendedInfill: "medium",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 5, craftXP: 10 }
        },
        {
            id: "sd_card_holder",
            name: "SD Card Holder",
            preview: "SD_Card_Holder.png",
            category: "accessories",
            description: "Holder for SD/MicroSD cards",
            printTime: 20,
            materialWeight: 5,
            recommendedMaterial: "PLA",
            recommendedInfill: "low",
            difficulty: 1,
            gameData: { unlockLevel: 2, sellPrice: 3, craftXP: 6 }
        },
        {
            id: "spacer",
            name: "Universal Spacer",
            preview: "spacer_.png",
            category: "accessories",
            description: "Multi-purpose spacer/standoff",
            printTime: 10,
            materialWeight: 2,
            recommendedMaterial: "PETG",
            recommendedInfill: "solid",
            difficulty: 1,
            gameData: { unlockLevel: 1, sellPrice: 1, craftXP: 2 }
        }
    ],

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Get all parts
     */
    getAllParts() {
        return this.parts;
    },

    /**
     * Get part by ID
     */
    getPartById(partId) {
        return this.parts.find(part => part.id === partId);
    },

    /**
     * Get parts by category
     */
    getPartsByCategory(categoryId) {
        return this.parts.filter(part => part.category === categoryId);
    },

    /**
     * Get all category IDs
     */
    getCategoryIds() {
        return Object.keys(this.categories);
    },

    /**
     * Calculate print cost for a part
     */
    calculatePrintCost(partId, material = null, infill = null) {
        const part = this.getPartById(partId);
        if (!part) return 0;

        const mat = material || part.recommendedMaterial;
        const inf = infill || part.recommendedInfill;
        
        const materialCost = this.printSettings.materials[mat]?.cost || 0.02;
        const infillMultiplier = this.printSettings.infillLevels[inf]?.materialMultiplier || 1;
        
        return Math.round(part.materialWeight * materialCost * infillMultiplier * 100) / 100;
    },

    /**
     * Calculate adjusted print time
     */
    calculatePrintTime(partId, infill = null) {
        const part = this.getPartById(partId);
        if (!part) return 0;

        const inf = infill || part.recommendedInfill;
        const timeMultiplier = this.printSettings.infillLevels[inf]?.timeMultiplier || 1;
        
        return Math.round(part.printTime * timeMultiplier);
    },

    /**
     * Get parts unlocked at a specific level
     */
    getPartsUnlockedAtLevel(level) {
        return this.parts.filter(part => part.gameData?.unlockLevel === level);
    },

    /**
     * Get all critical parts
     */
    getCriticalParts() {
        return this.parts.filter(part => part.gameData?.critical);
    },

    /**
     * Get all cosmetic parts
     */
    getCosmeticParts() {
        return this.parts.filter(part => part.gameData?.cosmetic);
    },

    /**
     * Generate part preview HTML
     */
    generatePartPreviewHTML(partId) {
        const part = this.getPartById(partId);
        if (!part) return '';
        
        const category = this.categories[part.category];
        
        return `
            <div class="stl-part-card">
                <div class="part-preview">
                    <img src="${this.previewFolder}${part.preview}" alt="${part.name}" />
                </div>
                <div class="part-info">
                    <h3>${part.name}</h3>
                    <span class="category-badge">${category?.icon} ${category?.name}</span>
                    <p>${part.description}</p>
                    <div class="part-specs">
                        <span>⏱️ ${part.printTime} min</span>
                        <span>⚖️ ${part.materialWeight}g</span>
                        <span>🎯 ${part.recommendedMaterial}</span>
                    </div>
                    <div class="game-data">
                        <span>🔓 Level ${part.gameData?.unlockLevel}</span>
                        <span>💰 Sell: $${part.gameData?.sellPrice}</span>
                        <span>⭐ XP: ${part.gameData?.craftXP}</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Get total print statistics
     */
    getTotalPrintStats() {
        const allParts = this.getAllParts();
        return {
            totalParts: allParts.length,
            totalPrintTime: allParts.reduce((sum, p) => sum + p.printTime, 0),
            totalWeight: allParts.reduce((sum, p) => sum + p.materialWeight, 0),
            categories: Object.keys(this.categories).length
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotSTLCatalog;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.GemBotSTLCatalog = GemBotSTLCatalog;
}

const stats = GemBotSTLCatalog.getTotalPrintStats();
console.log('💎 GemBot STL Catalog loaded!');
console.log(`🖨️ Total parts: ${stats.totalParts}`);
console.log(`⏱️ Total print time: ${Math.round(stats.totalPrintTime / 60)} hours`);
console.log(`⚖️ Total material: ${stats.totalWeight}g`);
