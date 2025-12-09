// ========================================================================
// GEMBOT STATE SYNCHRONIZATION - Implementation Code
// Integrate into GemBot_Control_AI.html (before GemBotAI class definition)
// ========================================================================

/**
 * Global Machine State Object - Single source of truth
 * Synchronizes Arduino hardware, touch screen, web interface, and AI guidance
 */
const machineGlobalState = {
    // ===== HARDWARE STATE (FROM ARDUINO) =====
    hardware: {
        motorSpeed: 1,              // 1-5 from Arduino
        motorMode: 'continuous',    // or 'step'
        stepSize: 1,                // 1-70 steps per command
        position: {
            x: 0,
            y: 0,
            rotation: 0,            // degrees
            index: 0
        },
        motorTimeout: 0,            // seconds since last command
        emergencyStopActive: false,
        connectionStatus: 'disconnected', // connected/disconnected/error
        lastUpdate: 0               // timestamp
    },
    
    // ===== TOUCH SCREEN STATE =====
    touchScreen: {
        currentMenuMode: 'manual_control',  // manual_control, design, preform, cut, polish, settings
        currentPhase: null,                  // roughing, fine_cutting, polishing, grinding, preforming
        currentStage: null,                  // girdle, pavilion, crown, table
        currentFacet: 0,                     // Which facet in sequence (0-indexed)
        totalFacets: 0,                      // Total to cut
        facetsCompleted: 0,                  // How many done
        facetsRemaining: 0,                  // How many left
        lapType: null,                       // rough, fine, polish
        gritGrade: null,                     // 60, 220, 600, 1200, 8000, 14000
        designSelected: null,                // User's selected cut design
        shapeSelected: null,                 // Shape being cut
        stoneSelected: null,                 // Stone type selected
        estimatedTimeRemaining: 0,           // seconds
        lastPhaseChange: 0                   // timestamp
    },
    
    // ===== WEB INTERFACE STATE =====
    web: {
        recordingActive: false,
        cameraActive: false,
        mlModelLoaded: false,
        sessionData: [],
        debugLogsEnabled: true,
        lastStateUpdate: 0
    },
    
    // ===== COMPUTED / GUIDANCE STATE =====
    guidance: {
        recommendedSpeed: null,         // Based on phase & stone
        recommendedMode: null,          // Based on phase
        recommendedLap: null,           // Based on phase
        recommendedGrit: null,          // Based on phase
        currentPhaseName: 'MANUAL CONTROL',
        phaseDuration: null,            // Estimated duration string
        phaseTechnique: null,           // How to work in this phase
        stoneName: null,
        stoneHardness: null,            // Mohs hardness for recommendations
        stoneCharacteristics: null,
        requiresSpecialHandling: false, // e.g., emerald = true
        lastUpdate: 0
    }
};

/**
 * Stone database with properties
 */
const stoneDatabase = {
    'diamond': {
        mohs: 10,
        characteristics: 'hardest natural stone',
        requiresWater: false,
        rougingSpeed: 5,
        fineSpeed: 3,
        polishSpeed: 1,
        estimatedHours: { roughing: 1, fine: 2, polish: 1 }
    },
    'ruby': {
        mohs: 9,
        characteristics: 'very hard, heat sensitive',
        requiresWater: false,
        rougingSpeed: 4,
        fineSpeed: 3,
        polishSpeed: 1,
        estimatedHours: { roughing: 1.5, fine: 2.5, polish: 1.5 }
    },
    'sapphire': {
        mohs: 9,
        characteristics: 'versatile, many colors',
        requiresWater: false,
        rougingSpeed: 4,
        fineSpeed: 3,
        polishSpeed: 1,
        estimatedHours: { roughing: 1.5, fine: 2.5, polish: 1.5 }
    },
    'emerald': {
        mohs: 7.5,
        characteristics: 'brittle, fragile, often treated',
        requiresWater: true,
        rougingSpeed: 3,
        fineSpeed: 2,
        polishSpeed: 1,
        estimatedHours: { roughing: 2, fine: 3, polish: 2 }
    },
    'opal': {
        mohs: 5.5,
        characteristics: 'fragile, sensitive to heat and water',
        requiresWater: false,
        rougingSpeed: 2,
        fineSpeed: 2,
        polishSpeed: 1,
        estimatedHours: { roughing: 2.5, fine: 3.5, polish: 2.5 }
    }
};

/**
 * Design database - facet counts and specifications per design
 */
const designDatabase = {
    'standard_round_brilliant': {
        shape: 'round',
        totalFacets: 58,
        stages: {
            'girdle': 8,
            'pavilion': 24,
            'crown': 32,
            'table': 1
        },
        angles: {
            'pavilion_preform': 52,  // degrees
            'crown_preform': 52,
            'girdle': 90,
            'pavilion_fine': 40.75,
            'crown_fine': 34.5,
            'table_percent': 55
        }
    },
    'crushed_ice': {
        shape: 'round',
        totalFacets: 81,
        stages: {
            'pavilion': 32,
            'crown': 48,
            'table': 1
        },
        angles: {
            'pavilion_preform': 51,
            'crown_preform': 50,
            'pavilion_fine': 40.5,
            'crown_fine': 32.5
        }
    }
    // Add more designs from user manual
};

/**
 * Lap/Grit specifications by cutting phase
 */
const lapSpecifications = {
    'roughing': {
        lapType: 'rough',
        gritGrade: 60,
        description: 'Coarse grit for aggressive material removal',
        recommendedSpeeds: [4, 5],
        recommendedMode: 'continuous',
        pressure: 'moderate to heavy'
    },
    'preforming': {
        lapType: 'fine',
        gritGrade: 220,
        description: 'Medium grit for shaping toward angles',
        recommendedSpeeds: [3, 4],
        recommendedMode: 'both',  // Can use either
        pressure: 'light to moderate'
    },
    'fine_cutting': {
        lapType: 'fine',
        gritGrade: 600,
        description: 'Fine grit for precision angle work',
        recommendedSpeeds: [2, 3],
        recommendedMode: 'step',
        pressure: 'light'
    },
    'grinding': {
        lapType: 'fine',
        gritGrade: 1200,
        description: 'Very fine for edge refinement',
        recommendedSpeeds: [2],
        recommendedMode: 'step',
        pressure: 'extremely light'
    },
    'polishing': {
        lapType: 'polish',
        gritGrade: 8000,
        description: 'Polish grit for final shine',
        recommendedSpeeds: [1, 2],
        recommendedMode: 'step',
        pressure: 'feather light'
    }
};

// ========================================================================
// STATE UPDATE FUNCTIONS
// ========================================================================

/**
 * Parse Arduino serial message and update hardware state
 * Expected format: [DATA] pX:150 pY:200 pA:45 pI:32 spd:3 mod:step
 */
function updateHardwareStateFromArduino(message) {
    if (!message.includes('[DATA]')) return;
    
    const updates = {};
    
    // Extract position values
    const xMatch = message.match(/pX:(\d+)/);
    const yMatch = message.match(/pY:(\d+)/);
    const angleMatch = message.match(/pA:(\d+)/);
    const indexMatch = message.match(/pI:(\d+)/);
    const speedMatch = message.match(/spd:(\d)/);
    const modeMatch = message.match(/mod:(\w+)/);
    
    if (xMatch) machineGlobalState.hardware.position.x = parseInt(xMatch[1]);
    if (yMatch) machineGlobalState.hardware.position.y = parseInt(yMatch[1]);
    if (angleMatch) machineGlobalState.hardware.position.rotation = parseInt(angleMatch[1]);
    if (indexMatch) machineGlobalState.hardware.position.index = parseInt(indexMatch[1]);
    if (speedMatch) machineGlobalState.hardware.motorSpeed = parseInt(speedMatch[1]);
    if (modeMatch) machineGlobalState.hardware.motorMode = modeMatch[1].toLowerCase();
    
    machineGlobalState.hardware.lastUpdate = Date.now();
    machineGlobalState.hardware.connectionStatus = 'connected';
    
    console.log('✓ Hardware state updated:', machineGlobalState.hardware);
    updateGuidanceState();
}

/**
 * Parse Nextion menu page change and update touch screen state
 * Expected format: [MENU] page:17
 */
function updateMenuModeFromTouchScreen(message) {
    if (!message.includes('[MENU]')) return;
    
    const pageMatch = message.match(/page:(\d+)/);
    if (!pageMatch) return;
    
    const pageNumber = parseInt(pageMatch[1]);
    
    const menuMap = {
        '1': { mode: 'settings', phase: null },
        '10': { mode: 'manual_control', phase: null },
        '12': { mode: 'manual_control', phase: null },  // Manual control
        '14': { mode: 'design', phase: null },
        '16': { mode: 'preform', phase: 'preforming' },
        '17': { mode: 'cut', phase: null },  // Phase will be auto-detected
        '18': { mode: 'polish', phase: 'polishing' }
    };
    
    const mapping = menuMap[pageNumber.toString()];
    if (!mapping) return;
    
    machineGlobalState.touchScreen.currentMenuMode = mapping.mode;
    if (mapping.phase) {
        machineGlobalState.touchScreen.currentPhase = mapping.phase;
        machineGlobalState.touchScreen.lastPhaseChange = Date.now();
    }
    
    console.log('✓ Menu mode updated:', machineGlobalState.touchScreen.currentMenuMode);
    updateGuidanceState();
}

/**
 * Auto-detect cutting phase based on speed and mode
 */
function detectCuttingPhase() {
    // Only detect phase if in cut mode
    if (machineGlobalState.touchScreen.currentMenuMode !== 'cut') {
        return null;
    }
    
    const speed = machineGlobalState.hardware.motorSpeed;
    const mode = machineGlobalState.hardware.motorMode;
    
    // Map speed + mode combinations to phases
    if (speed >= 4 && mode === 'continuous') {
        return 'roughing';
    } else if (speed >= 3 && speed <= 4 && (mode === 'continuous' || mode === 'step')) {
        return 'preforming';
    } else if ((speed === 2 || speed === 3) && mode === 'step') {
        return 'fine_cutting';
    } else if (speed === 2 && mode === 'step') {
        return 'grinding';  // Very fine work
    } else if (speed === 1 && mode === 'step') {
        return 'polishing';
    }
    
    return null;
}

/**
 * Update guidance state based on all factors
 */
function updateGuidanceState() {
    const phase = detectCuttingPhase() || machineGlobalState.touchScreen.currentPhase;
    const stone = machineGlobalState.touchScreen.stoneSelected;
    
    if (!phase || !stone) {
        machineGlobalState.guidance.currentPhaseName = 'MANUAL CONTROL';
        return;
    }
    
    // Get lap specifications for this phase
    const lapSpec = lapSpecifications[phase];
    if (!lapSpec) return;
    
    // Get stone data
    const stoneData = stoneDatabase[stone.toLowerCase()];
    if (!stoneData) return;
    
    // Update guidance state
    machineGlobalState.guidance.currentPhaseName = phase.toUpperCase().replace('_', ' ');
    machineGlobalState.guidance.recommendedLap = lapSpec.lapType;
    machineGlobalState.guidance.recommendedGrit = lapSpec.gritGrade;
    machineGlobalState.guidance.recommendedMode = lapSpec.recommendedMode;
    machineGlobalState.guidance.recommendedSpeed = lapSpec.recommendedSpeeds;
    machineGlobalState.guidance.phaseTechnique = lapSpec.description;
    machineGlobalState.guidance.stoneName = stone;
    machineGlobalState.guidance.stoneHardness = stoneData.mohs;
    machineGlobalState.guidance.stoneCharacteristics = stoneData.characteristics;
    machineGlobalState.guidance.requiresSpecialHandling = stoneData.requiresWater;
    machineGlobalState.guidance.phaseDuration = stoneData.estimatedHours[phase] + ' hours';
    machineGlobalState.guidance.lastUpdate = Date.now();
    
    console.log('✓ Guidance state updated for phase:', phase, 'stone:', stone);
}

/**
 * Initialize a cutting design
 */
function initializeDesign(designName, stoneType, shapeType) {
    const design = designDatabase[designName];
    if (!design) {
        console.error('Design not found:', designName);
        return false;
    }
    
    machineGlobalState.touchScreen.designSelected = designName;
    machineGlobalState.touchScreen.stoneSelected = stoneType;
    machineGlobalState.touchScreen.shapeSelected = shapeType;
    machineGlobalState.touchScreen.totalFacets = design.totalFacets;
    machineGlobalState.touchScreen.facetsCompleted = 0;
    machineGlobalState.touchScreen.facetsRemaining = design.totalFacets;
    machineGlobalState.touchScreen.currentFacet = 1;
    
    console.log('✓ Design initialized:', designName, 'Stone:', stoneType, 'Facets:', design.totalFacets);
    return true;
}

/**
 * Mark a facet as complete and update time estimates
 */
function markFacetComplete() {
    if (machineGlobalState.touchScreen.facetsRemaining > 0) {
        machineGlobalState.touchScreen.facetsCompleted++;
        machineGlobalState.touchScreen.facetsRemaining--;
        machineGlobalState.touchScreen.currentFacet++;
        
        updateTimeRemaining();
        console.log('✓ Facet complete. Remaining:', machineGlobalState.touchScreen.facetsRemaining);
        return true;
    }
    return false;
}

/**
 * Set the current lap type and grit grade
 */
function setLapConfiguration(lapType, gritGrade) {
    machineGlobalState.touchScreen.lapType = lapType;
    machineGlobalState.touchScreen.gritGrade = gritGrade;
    console.log('✓ Lap configured:', lapType, 'Grit:', gritGrade);
}

/**
 * Calculate remaining time based on facets, phase, and stone
 */
function updateTimeRemaining() {
    const factors = {
        facetsRemaining: machineGlobalState.touchScreen.facetsRemaining,
        currentPhase: detectCuttingPhase() || machineGlobalState.touchScreen.currentPhase,
        stone: machineGlobalState.touchScreen.stoneSelected,
        currentSpeed: machineGlobalState.hardware.motorSpeed
    };
    
    // Time per facet in minutes (varies by phase)
    const timePerFacet = {
        'roughing': 2,          // 2 min per facet
        'preforming': 3,        // 3 min per facet
        'fine_cutting': 5,      // 5 min per facet
        'grinding': 3,          // 3 min per facet
        'polishing': 3          // 3 min per facet
    };
    
    // Stone multiplier (some stones cut slower)
    const stoneModifier = {
        'diamond': 1.0,
        'ruby': 1.2,
        'sapphire': 1.1,
        'emerald': 1.5,
        'opal': 1.4
    };
    
    const baseTime = timePerFacet[factors.currentPhase] || 3;
    const modifier = stoneModifier[factors.stone?.toLowerCase()] || 1.0;
    const totalSeconds = Math.ceil(factors.facetsRemaining * baseTime * modifier * 60);
    
    machineGlobalState.touchScreen.estimatedTimeRemaining = totalSeconds;
    return formatTimeEstimate(totalSeconds);
}

/**
 * Format seconds into human-readable time
 */
function formatTimeEstimate(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

/**
 * Get AI-ready context object
 */
function getAIContextObject() {
    return {
        currentSpeed: machineGlobalState.hardware.motorSpeed,
        currentMode: machineGlobalState.hardware.motorMode,
        position: {
            x: machineGlobalState.hardware.position.x,
            y: machineGlobalState.hardware.position.y,
            rotation: machineGlobalState.hardware.position.rotation,
            index: machineGlobalState.hardware.position.index
        },
        currentPhase: detectCuttingPhase() || machineGlobalState.touchScreen.currentPhase,
        currentStage: machineGlobalState.touchScreen.currentStage,
        lapType: machineGlobalState.touchScreen.lapType,
        gritGrade: machineGlobalState.touchScreen.gritGrade,
        stoneType: machineGlobalState.touchScreen.stoneSelected,
        currentFacet: machineGlobalState.touchScreen.currentFacet,
        totalFacets: machineGlobalState.touchScreen.totalFacets,
        facetsRemaining: machineGlobalState.touchScreen.facetsRemaining,
        estimatedTimeRemaining: formatTimeEstimate(machineGlobalState.touchScreen.estimatedTimeRemaining),
        recommendedSpeed: machineGlobalState.guidance.recommendedSpeed,
        recommendedMode: machineGlobalState.guidance.recommendedMode,
        guidanceTechnique: machineGlobalState.guidance.phaseTechnique,
        stoneCharacteristics: machineGlobalState.guidance.stoneCharacteristics
    };
}

/**
 * Log state for debugging
 */
function logMachineState() {
    console.log('=== MACHINE GLOBAL STATE ===');
    console.log('Hardware:', machineGlobalState.hardware);
    console.log('TouchScreen:', machineGlobalState.touchScreen);
    console.log('Web:', machineGlobalState.web);
    console.log('Guidance:', machineGlobalState.guidance);
}

// ========================================================================
// INTEGRATION WITH EXISTING CODE
// ========================================================================

/**
 * Call this in your serial input parser when receiving Arduino data
 * Example: In the serial read section where you parse pX:, pY: messages
 */
function onSerialDataReceived(message) {
    // Parse Arduino hardware state
    updateHardwareStateFromArduino(message);
    
    // Parse touch screen menu changes (if Arduino forwards them)
    updateMenuModeFromTouchScreen(message);
}

/**
 * When user selects a design, call this:
 * Example: User clicks "Standard Round Brilliant" button
 */
function onDesignSelected(designName, stoneType) {
    initializeDesign(designName, stoneType, 'round');
}

/**
 * When user changes lap/grit, call this:
 * Example: User puts in 220 grit lap for preforming
 */
function onLapChanged(lapType, gritGrade) {
    setLapConfiguration(lapType, gritGrade);
}

/**
 * When a facet is completed, call this:
 * Example: User finishes first girdle facet
 */
function onFacetCompleted() {
    markFacetComplete();
}

// ========================================================================
// Export for AI system to use
// ========================================================================

// Make available globally so GemBotAI class can access
window.machineGlobalState = machineGlobalState;
window.getAIContextObject = getAIContextObject;
window.updateHardwareStateFromArduino = updateHardwareStateFromArduino;
window.onDesignSelected = onDesignSelected;
window.onLapChanged = onLapChanged;
window.onFacetCompleted = onFacetCompleted;
window.logMachineState = logMachineState;
