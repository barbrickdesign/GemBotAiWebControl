/**
 * 💎 GemBot Part Failure & Troubleshooting System
 * Component failures, diagnostic mini-games, and repair mechanics
 * 
 * Features:
 * - Random component failures during machine operation
 * - Diagnostic mini-games to identify problems
 * - Repair system using spare parts
 * - Machine health tracking
 * - Emergency repair kits
 * - Technician skill leveling
 */

const GemBotTroubleshooting = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",

    // Component categories and failure data
    componentFailures: {
        // === Motion System Failures ===
        stepperMotor: {
            id: "stepperMotor",
            category: "motionSystem",
            name: "Stepper Motor Failure",
            icon: "⚙️",
            description: "NEMA23 stepper motor has stopped working properly",
            symptoms: [
                "Grinding noise during rotation",
                "Motor getting extremely hot",
                "Inconsistent step angles",
                "Complete motor stall"
            ],
            baseProbability: 0.02,
            severity: "high",
            repairDifficulty: 4,
            repairParts: ["stepperMotor_nema23", "stepperDriver_dm542"],
            repairCost: 45,
            repairTime: 30, // minutes
            xpReward: 150,
            diagnosticType: "waveformAnalysis"
        },
        beltSlip: {
            id: "beltSlip",
            category: "motionSystem",
            name: "Belt Slippage",
            icon: "🔗",
            description: "GT2 timing belt is slipping on the pulleys",
            symptoms: [
                "Index wheel not reaching correct positions",
                "Backlash in motion system",
                "Visible belt wear or fraying",
                "Clicking sounds during movement"
            ],
            baseProbability: 0.05,
            severity: "medium",
            repairDifficulty: 2,
            repairParts: ["timingBelt_gt2_400mm"],
            repairCost: 15,
            repairTime: 15,
            xpReward: 50,
            diagnosticType: "tensionTest"
        },
        bearingWear: {
            id: "bearingWear",
            category: "motionSystem",
            name: "Bearing Wear",
            icon: "🔘",
            description: "Linear bearings showing excessive wear",
            symptoms: [
                "Gritty feeling during motion",
                "Play in the linear axis",
                "Squeaking or grinding",
                "Uneven facet surfaces"
            ],
            baseProbability: 0.03,
            severity: "medium",
            repairDifficulty: 3,
            repairParts: ["linearBearing_lm8uu"],
            repairCost: 25,
            repairTime: 25,
            xpReward: 75,
            diagnosticType: "runoutTest"
        },
        
        // === Electronics Failures ===
        arduinoGlitch: {
            id: "arduinoGlitch",
            category: "electronics",
            name: "Arduino Malfunction",
            icon: "🖥️",
            description: "Arduino Mega is experiencing firmware issues",
            symptoms: [
                "Random position resets",
                "Unresponsive to commands",
                "Erratic LED behavior",
                "Communication timeouts"
            ],
            baseProbability: 0.01,
            severity: "critical",
            repairDifficulty: 5,
            repairParts: ["arduinoMega_2560"],
            repairCost: 40,
            repairTime: 45,
            xpReward: 200,
            diagnosticType: "serialDebug"
        },
        touchScreenError: {
            id: "touchScreenError",
            category: "electronics",
            name: "Touch Screen Error",
            icon: "📱",
            description: "Nextion NX8048K070 display showing errors",
            symptoms: [
                "Touch not registering correctly",
                "Display flickering",
                "Corrupted graphics",
                "SD card read errors"
            ],
            baseProbability: 0.02,
            severity: "medium",
            repairDifficulty: 3,
            repairParts: ["nextionDisplay_nx8048k070"],
            repairCost: 80,
            repairTime: 20,
            xpReward: 100,
            diagnosticType: "displayCalibration"
        },
        powerSupplyFault: {
            id: "powerSupplyFault",
            category: "electronics",
            name: "Power Supply Fault",
            icon: "⚡",
            description: "24V power supply not providing stable voltage",
            symptoms: [
                "Motor stalling under load",
                "Voltage fluctuations on display",
                "Random system resets",
                "Burning smell from PSU"
            ],
            baseProbability: 0.02,
            severity: "critical",
            repairDifficulty: 4,
            repairParts: ["powerSupply_24v_15a"],
            repairCost: 35,
            repairTime: 25,
            xpReward: 125,
            diagnosticType: "voltageTest"
        },
        
        // === Mechanical Failures ===
        indexGearDamage: {
            id: "indexGearDamage",
            category: "mechanical",
            name: "Index Gear Damage",
            icon: "⚙️",
            description: "96-tooth index gear has damaged teeth",
            symptoms: [
                "Incorrect facet positioning",
                "Gear not meshing properly",
                "Visible tooth damage",
                "Repeated position errors"
            ],
            baseProbability: 0.03,
            severity: "high",
            repairDifficulty: 3,
            repairParts: ["indexGear_96tooth"],
            repairCost: 25,
            repairTime: 35,
            xpReward: 100,
            diagnosticType: "toothInspection"
        },
        mastAlignment: {
            id: "mastAlignment",
            category: "mechanical",
            name: "Mast Misalignment",
            icon: "📐",
            description: "Mast not perpendicular to faceting lap",
            symptoms: [
                "Uneven facet cutting",
                "Asymmetric pavilion angles",
                "Meet point errors",
                "Crown-pavilion alignment issues"
            ],
            baseProbability: 0.04,
            severity: "medium",
            repairDifficulty: 3,
            repairParts: ["mainMast_assembly"],
            repairCost: 20,
            repairTime: 40,
            xpReward: 85,
            diagnosticType: "laserAlignment"
        },
        
        // === Sensor Failures ===
        limitSwitchFailure: {
            id: "limitSwitchFailure",
            category: "sensors",
            name: "Limit Switch Failure",
            icon: "🔴",
            description: "Mechanical limit switch not triggering",
            symptoms: [
                "Axis not homing correctly",
                "Crash at end of travel",
                "Home position drift",
                "Switch clicking but not registering"
            ],
            baseProbability: 0.06,
            severity: "low",
            repairDifficulty: 2,
            repairParts: ["limitSwitch_mechanical"],
            repairCost: 5,
            repairTime: 10,
            xpReward: 30,
            diagnosticType: "switchTest"
        },
        potentiometerDrift: {
            id: "potentiometerDrift",
            category: "sensors",
            name: "Potentiometer Drift",
            icon: "🎚️",
            description: "Angle feedback potentiometer giving incorrect readings",
            symptoms: [
                "Displayed angle doesn't match actual",
                "Angle jumps around unexpectedly",
                "Calibration won't hold",
                "Noisy signal on graph"
            ],
            baseProbability: 0.04,
            severity: "medium",
            repairDifficulty: 2,
            repairParts: ["potentiometer_10k"],
            repairCost: 10,
            repairTime: 15,
            xpReward: 45,
            diagnosticType: "signalAnalysis"
        },
        
        // === Consumables ===
        lapWear: {
            id: "lapWear",
            category: "consumables",
            name: "Worn Faceting Lap",
            icon: "💿",
            description: "Diamond faceting lap has lost cutting ability",
            symptoms: [
                "Increased cutting time",
                "Poor surface finish",
                "Uneven material removal",
                "Heat buildup during cutting"
            ],
            baseProbability: 0.08,
            severity: "low",
            repairDifficulty: 1,
            repairParts: ["facetingLap_600grit"],
            repairCost: 45,
            repairTime: 5,
            xpReward: 20,
            diagnosticType: "visualInspection"
        },
        dopWaxCrack: {
            id: "dopWaxCrack",
            category: "consumables",
            name: "Dop Wax Failure",
            icon: "🕯️",
            description: "Stone came loose from dop stick",
            symptoms: [
                "Stone shifting during cutting",
                "Visible crack in wax bond",
                "Stone flew off during operation",
                "Inconsistent angle during cut"
            ],
            baseProbability: 0.10,
            severity: "low",
            repairDifficulty: 1,
            repairParts: ["dopWax_stick"],
            repairCost: 5,
            repairTime: 10,
            xpReward: 15,
            diagnosticType: "bondTest"
        }
    },

    // Diagnostic mini-games for troubleshooting
    diagnosticMinigames: {
        waveformAnalysis: {
            id: "waveformAnalysis",
            name: "Waveform Analysis",
            description: "Match the stepper motor waveform to identify the fault",
            type: "pattern-match",
            difficulty: 4,
            timeLimit: 30,
            instructions: "Compare the motor signal to reference waveforms and identify the anomaly",
            successXP: 50,
            hints: [
                "Look for irregular step patterns",
                "Check for voltage spikes",
                "Missing phases indicate coil damage"
            ]
        },
        tensionTest: {
            id: "tensionTest",
            name: "Belt Tension Test",
            description: "Adjust the belt tension to the correct value",
            type: "slider-game",
            difficulty: 2,
            timeLimit: 20,
            instructions: "Use the slider to set belt tension. Too loose = slipping, too tight = bearing wear",
            successXP: 25,
            targetRange: [65, 75] // Percentage of max tension
        },
        runoutTest: {
            id: "runoutTest",
            name: "Runout Measurement",
            description: "Use the dial indicator to measure bearing runout",
            type: "precision-game",
            difficulty: 3,
            timeLimit: 25,
            instructions: "Position the indicator and read the total runout. Identify if within spec.",
            successXP: 35,
            acceptableRunout: 0.05 // mm
        },
        serialDebug: {
            id: "serialDebug",
            name: "Serial Debug Challenge",
            description: "Parse the serial output to find the error code",
            type: "code-puzzle",
            difficulty: 5,
            timeLimit: 45,
            instructions: "Read the debug output and identify the error. Fix the command sequence.",
            successXP: 75,
            sampleOutput: [
                ">> GEMBOT DIAGNOSTIC v2.1",
                ">> Initializing...",
                ">> Motor A: OK",
                ">> Motor B: ERR_TIMEOUT",
                ">> Display: OK",
                ">> FAULT CODE: 0x4B2F"
            ]
        },
        displayCalibration: {
            id: "displayCalibration",
            name: "Touch Calibration",
            description: "Calibrate the touch screen by tapping targets",
            type: "tap-targets",
            difficulty: 2,
            timeLimit: 30,
            instructions: "Tap each calibration target as it appears. Accuracy matters!",
            successXP: 30,
            targetCount: 5
        },
        voltageTest: {
            id: "voltageTest",
            name: "Voltage Reading",
            description: "Use the multimeter to check power supply voltages",
            type: "measurement-game",
            difficulty: 3,
            timeLimit: 25,
            instructions: "Measure voltages at test points. Identify any out-of-spec readings.",
            successXP: 40,
            testPoints: [
                { label: "24V Rail", expected: 24.0, tolerance: 0.5 },
                { label: "5V Logic", expected: 5.0, tolerance: 0.25 },
                { label: "3.3V Ref", expected: 3.3, tolerance: 0.1 }
            ]
        },
        toothInspection: {
            id: "toothInspection",
            name: "Gear Tooth Inspection",
            description: "Find the damaged teeth on the index gear",
            type: "spot-difference",
            difficulty: 3,
            timeLimit: 35,
            instructions: "Rotate the gear and click on any damaged or worn teeth",
            successXP: 35,
            damagedTeethCount: 3
        },
        laserAlignment: {
            id: "laserAlignment",
            name: "Laser Alignment",
            description: "Use the laser to verify mast perpendicularity",
            type: "alignment-game",
            difficulty: 4,
            timeLimit: 40,
            instructions: "Adjust the mast until the laser hits the target perfectly",
            successXP: 50,
            toleranceDegrees: 0.5
        },
        switchTest: {
            id: "switchTest",
            name: "Switch Continuity Test",
            description: "Test the limit switch with a multimeter",
            type: "simple-test",
            difficulty: 1,
            timeLimit: 15,
            instructions: "Press the switch and verify continuity changes on the meter",
            successXP: 15
        },
        signalAnalysis: {
            id: "signalAnalysis",
            name: "Signal Quality Check",
            description: "Analyze the potentiometer signal for noise",
            type: "graph-analysis",
            difficulty: 3,
            timeLimit: 30,
            instructions: "Identify noise patterns and determine if the potentiometer needs replacement",
            successXP: 40,
            noiseThreshold: 0.1
        },
        visualInspection: {
            id: "visualInspection",
            name: "Visual Inspection",
            description: "Inspect the lap surface for wear patterns",
            type: "image-quiz",
            difficulty: 1,
            timeLimit: 20,
            instructions: "Look at the lap surface and rate the wear level",
            successXP: 10
        },
        bondTest: {
            id: "bondTest",
            name: "Bond Strength Test",
            description: "Test the dop wax bond integrity",
            type: "simple-test",
            difficulty: 1,
            timeLimit: 10,
            instructions: "Apply gentle pressure to the stone and check for movement",
            successXP: 10
        }
    },

    // Technician skill levels
    technicianSkills: {
        novice: {
            level: 1,
            name: "Novice Technician",
            xpRequired: 0,
            repairSpeedBonus: 1.0,
            failureReduction: 0,
            diagnosticTimeBonus: 1.0,
            unlockedDiagnostics: ["visualInspection", "bondTest", "switchTest"]
        },
        apprentice: {
            level: 2,
            name: "Apprentice Technician",
            xpRequired: 500,
            repairSpeedBonus: 0.9,
            failureReduction: 0.1,
            diagnosticTimeBonus: 0.95,
            unlockedDiagnostics: ["tensionTest", "displayCalibration"]
        },
        journeyman: {
            level: 3,
            name: "Journeyman Technician",
            xpRequired: 1500,
            repairSpeedBonus: 0.8,
            failureReduction: 0.2,
            diagnosticTimeBonus: 0.9,
            unlockedDiagnostics: ["runoutTest", "toothInspection", "signalAnalysis"]
        },
        expert: {
            level: 4,
            name: "Expert Technician",
            xpRequired: 4000,
            repairSpeedBonus: 0.7,
            failureReduction: 0.3,
            diagnosticTimeBonus: 0.85,
            unlockedDiagnostics: ["voltageTest", "laserAlignment"]
        },
        master: {
            level: 5,
            name: "Master Technician",
            xpRequired: 10000,
            repairSpeedBonus: 0.5,
            failureReduction: 0.4,
            diagnosticTimeBonus: 0.75,
            unlockedDiagnostics: ["waveformAnalysis", "serialDebug"]
        }
    },

    // Emergency repair kits
    repairKits: {
        basicKit: {
            id: "basicKit",
            name: "Basic Repair Kit",
            description: "Essential tools and common spare parts",
            cost: 50,
            contents: [
                { part: "limitSwitch_mechanical", quantity: 2 },
                { part: "dopWax_stick", quantity: 5 },
                { part: "potentiometer_10k", quantity: 1 }
            ],
            repairTimeReduction: 0.2,
            unlockLevel: 1
        },
        motionKit: {
            id: "motionKit",
            name: "Motion System Kit",
            description: "Belts, bearings, and motor components",
            cost: 150,
            contents: [
                { part: "timingBelt_gt2_400mm", quantity: 2 },
                { part: "linearBearing_lm8uu", quantity: 4 },
                { part: "stepperDriver_dm542", quantity: 1 }
            ],
            repairTimeReduction: 0.3,
            unlockLevel: 3
        },
        electronicsKit: {
            id: "electronicsKit",
            name: "Electronics Kit",
            description: "Controllers, displays, and wiring",
            cost: 200,
            contents: [
                { part: "arduinoMega_2560", quantity: 1 },
                { part: "powerSupply_24v_15a", quantity: 1 }
            ],
            repairTimeReduction: 0.25,
            unlockLevel: 5
        },
        masterKit: {
            id: "masterKit",
            name: "Master Technician Kit",
            description: "Complete professional repair kit",
            cost: 500,
            contents: [
                { part: "stepperMotor_nema23", quantity: 1 },
                { part: "indexGear_96tooth", quantity: 1 },
                { part: "nextionDisplay_nx8048k070", quantity: 1 },
                { part: "arduinoMega_2560", quantity: 1 }
            ],
            repairTimeReduction: 0.5,
            unlockLevel: 8
        }
    },

    // Machine health system
    machineHealth: {
        maxHealth: 100,
        criticalThreshold: 25,
        warningThreshold: 50,
        
        healthEffects: {
            critical: {
                failureRateMultiplier: 3.0,
                qualityPenalty: 0.4,
                speedPenalty: 0.5
            },
            warning: {
                failureRateMultiplier: 1.5,
                qualityPenalty: 0.15,
                speedPenalty: 0.2
            },
            normal: {
                failureRateMultiplier: 1.0,
                qualityPenalty: 0,
                speedPenalty: 0
            }
        }
    },

    // Create player troubleshooting state
    createPlayerTroubleshootingState() {
        return {
            technicianXP: 0,
            technicianLevel: "novice",
            machineHealth: 100,
            activeFailures: [],
            completedRepairs: [],
            partsInventory: {},
            ownedKits: [],
            totalRepairs: 0,
            perfectDiagnostics: 0,
            coinsSpentOnRepairs: 0
        };
    },

    /**
     * Roll for random failure during operation
     */
    rollForFailure(playerState, operationType = "normal") {
        const healthStatus = this._getMachineHealthStatus(playerState.machineHealth);
        const healthEffects = this.machineHealth.healthEffects[healthStatus];
        const skill = this.technicianSkills[playerState.technicianLevel];
        
        // Operation type modifiers
        const operationModifiers = {
            normal: 1.0,
            heavyLoad: 1.5,
            continuous: 1.3,
            precision: 0.8 // More careful = less failures
        };
        
        const operationMod = operationModifiers[operationType] || 1.0;
        
        // Check each component for failure
        for (const [failureId, failure] of Object.entries(this.componentFailures)) {
            // Skip if this failure is already active
            if (playerState.activeFailures.some(f => f.id === failureId)) {
                continue;
            }
            
            // Calculate adjusted probability
            let probability = failure.baseProbability 
                * healthEffects.failureRateMultiplier 
                * (1 - skill.failureReduction)
                * operationMod;
            
            if (Math.random() < probability) {
                const activeFailure = {
                    ...failure,
                    occurredAt: Date.now(),
                    diagnosed: false,
                    symptomIndex: Math.floor(Math.random() * failure.symptoms.length)
                };
                
                playerState.activeFailures.push(activeFailure);
                
                // Reduce machine health based on severity
                const healthReduction = this._getSeverityHealthReduction(failure.severity);
                playerState.machineHealth = Math.max(0, playerState.machineHealth - healthReduction);
                
                return {
                    failure: activeFailure,
                    symptom: failure.symptoms[activeFailure.symptomIndex],
                    healthLost: healthReduction,
                    message: `⚠️ ${failure.icon} ${failure.name}: ${failure.symptoms[activeFailure.symptomIndex]}`
                };
            }
        }
        
        return null; // No failure occurred
    },

    /**
     * Start diagnostic mini-game
     */
    startDiagnostic(playerState, failureId) {
        const failure = playerState.activeFailures.find(f => f.id === failureId);
        if (!failure) {
            return { success: false, error: "Failure not found" };
        }
        
        const diagnostic = this.diagnosticMinigames[failure.diagnosticType];
        const skill = this.technicianSkills[playerState.technicianLevel];
        
        // Check if player has unlocked this diagnostic
        const allUnlocked = this._getAllUnlockedDiagnostics(playerState.technicianLevel);
        if (!allUnlocked.includes(failure.diagnosticType)) {
            return { 
                success: false, 
                error: `You need ${skill.name} level or higher to perform ${diagnostic.name}` 
            };
        }
        
        const adjustedTimeLimit = Math.round(diagnostic.timeLimit * skill.diagnosticTimeBonus);
        
        return {
            success: true,
            diagnostic: {
                ...diagnostic,
                timeLimit: adjustedTimeLimit,
                forFailure: failureId
            },
            message: `Starting ${diagnostic.name}...`
        };
    },

    /**
     * Complete diagnostic mini-game
     */
    completeDiagnostic(playerState, failureId, success, score = 0) {
        const failureIndex = playerState.activeFailures.findIndex(f => f.id === failureId);
        if (failureIndex === -1) {
            return { success: false, error: "Failure not found" };
        }
        
        const failure = playerState.activeFailures[failureIndex];
        const diagnostic = this.diagnosticMinigames[failure.diagnosticType];
        
        if (success) {
            failure.diagnosed = true;
            const xpEarned = diagnostic.successXP;
            playerState.technicianXP += xpEarned;
            
            // Perfect diagnostic bonus
            if (score >= 90) {
                playerState.perfectDiagnostics++;
                const bonusXP = Math.round(xpEarned * 0.5);
                playerState.technicianXP += bonusXP;
                
                return {
                    success: true,
                    perfect: true,
                    xpEarned: xpEarned + bonusXP,
                    message: `🌟 Perfect diagnosis! Problem identified: ${failure.name}. +${xpEarned + bonusXP} XP`
                };
            }
            
            return {
                success: true,
                perfect: false,
                xpEarned: xpEarned,
                message: `✅ Problem identified: ${failure.name}. +${xpEarned} XP`
            };
        } else {
            return {
                success: false,
                xpEarned: Math.round(diagnostic.successXP * 0.25), // Partial XP for trying
                message: `❌ Diagnostic failed. Try again or use a hint.`
            };
        }
    },

    /**
     * Attempt repair
     */
    attemptRepair(playerState, failureId) {
        const failureIndex = playerState.activeFailures.findIndex(f => f.id === failureId);
        if (failureIndex === -1) {
            return { success: false, error: "Failure not found" };
        }
        
        const failure = playerState.activeFailures[failureIndex];
        
        if (!failure.diagnosed) {
            return { 
                success: false, 
                error: "Must diagnose the problem first!" 
            };
        }
        
        // Check if player has required parts
        for (const partId of failure.repairParts) {
            if (!playerState.partsInventory[partId] || playerState.partsInventory[partId] < 1) {
                return { 
                    success: false, 
                    error: `Missing required part: ${partId}` 
                };
            }
        }
        
        // Consume parts
        for (const partId of failure.repairParts) {
            playerState.partsInventory[partId]--;
        }
        
        // Calculate repair time with bonuses
        const skill = this.technicianSkills[playerState.technicianLevel];
        let repairTime = failure.repairTime * skill.repairSpeedBonus;
        
        // Apply kit bonuses
        for (const kitId of playerState.ownedKits) {
            const kit = this.repairKits[kitId];
            repairTime *= (1 - kit.repairTimeReduction);
        }
        
        repairTime = Math.max(5, Math.round(repairTime));
        
        // Remove failure
        playerState.activeFailures.splice(failureIndex, 1);
        
        // Award XP
        const xpEarned = failure.xpReward;
        playerState.technicianXP += xpEarned;
        playerState.totalRepairs++;
        playerState.coinsSpentOnRepairs += failure.repairCost;
        
        // Restore some health
        const healthRestored = this._getSeverityHealthReduction(failure.severity);
        playerState.machineHealth = Math.min(100, playerState.machineHealth + healthRestored);
        
        // Record completed repair
        playerState.completedRepairs.push({
            failureId: failureId,
            failureName: failure.name,
            repairedAt: Date.now(),
            repairTime: repairTime,
            xpEarned: xpEarned
        });
        
        // Check for level up
        const levelUp = this._checkLevelUp(playerState);
        
        return {
            success: true,
            repairTime: repairTime,
            xpEarned: xpEarned,
            healthRestored: healthRestored,
            levelUp: levelUp,
            message: `🔧 Repaired ${failure.name}! +${xpEarned} XP, +${healthRestored} health`
        };
    },

    /**
     * Quick repair using repair kit (no diagnostic needed)
     */
    quickRepair(playerState, failureId, kitId) {
        const kit = this.repairKits[kitId];
        if (!kit) {
            return { success: false, error: "Invalid repair kit" };
        }
        
        if (!playerState.ownedKits.includes(kitId)) {
            return { success: false, error: "You don't own this repair kit" };
        }
        
        const failureIndex = playerState.activeFailures.findIndex(f => f.id === failureId);
        if (failureIndex === -1) {
            return { success: false, error: "Failure not found" };
        }
        
        const failure = playerState.activeFailures[failureIndex];
        
        // Check if kit has required parts
        const kitParts = {};
        for (const item of kit.contents) {
            kitParts[item.part] = item.quantity;
        }
        
        const hasRequiredParts = failure.repairParts.every(part => 
            kitParts[part] && kitParts[part] > 0
        );
        
        if (!hasRequiredParts) {
            return { 
                success: false, 
                error: "This kit doesn't have the parts needed for this repair" 
            };
        }
        
        // Remove failure (reduced XP since no diagnostic)
        playerState.activeFailures.splice(failureIndex, 1);
        
        const reducedXP = Math.round(failure.xpReward * 0.5);
        playerState.technicianXP += reducedXP;
        playerState.totalRepairs++;
        
        const healthRestored = this._getSeverityHealthReduction(failure.severity);
        playerState.machineHealth = Math.min(100, playerState.machineHealth + healthRestored);
        
        return {
            success: true,
            xpEarned: reducedXP,
            healthRestored: healthRestored,
            message: `⚡ Quick repair: ${failure.name}! +${reducedXP} XP (reduced for skipping diagnostic)`
        };
    },

    /**
     * Get machine health status
     */
    _getMachineHealthStatus(health) {
        if (health <= this.machineHealth.criticalThreshold) return "critical";
        if (health <= this.machineHealth.warningThreshold) return "warning";
        return "normal";
    },

    /**
     * Get health reduction based on failure severity
     */
    _getSeverityHealthReduction(severity) {
        const reductions = {
            critical: 20,
            high: 15,
            medium: 10,
            low: 5
        };
        return reductions[severity] || 10;
    },

    /**
     * Get all unlocked diagnostics for a level
     */
    _getAllUnlockedDiagnostics(currentLevel) {
        const allDiagnostics = [];
        const levels = Object.values(this.technicianSkills)
            .sort((a, b) => a.level - b.level);
        
        for (const level of levels) {
            allDiagnostics.push(...level.unlockedDiagnostics);
            if (level.level >= this.technicianSkills[currentLevel].level) {
                break;
            }
        }
        
        // Include all diagnostics up to current level
        const currentLevelData = this.technicianSkills[currentLevel];
        for (const level of levels) {
            if (level.level <= currentLevelData.level) {
                allDiagnostics.push(...level.unlockedDiagnostics);
            }
        }
        
        return [...new Set(allDiagnostics)];
    },

    /**
     * Check if player leveled up
     */
    _checkLevelUp(playerState) {
        const levels = Object.entries(this.technicianSkills)
            .sort((a, b) => a[1].level - b[1].level);
        
        for (const [levelId, levelData] of levels) {
            if (playerState.technicianXP >= levelData.xpRequired && 
                this.technicianSkills[playerState.technicianLevel].level < levelData.level) {
                playerState.technicianLevel = levelId;
                return {
                    newLevel: levelId,
                    levelName: levelData.name,
                    newDiagnostics: levelData.unlockedDiagnostics
                };
            }
        }
        
        return null;
    },

    /**
     * Generate machine status panel HTML
     */
    generateMachineStatusHTML(playerState) {
        const status = this._getMachineHealthStatus(playerState.machineHealth);
        const statusColors = {
            critical: "#f44336",
            warning: "#ff9800",
            normal: "#4caf50"
        };
        
        const skill = this.technicianSkills[playerState.technicianLevel];
        const nextLevel = Object.values(this.technicianSkills)
            .find(s => s.level === skill.level + 1);
        
        return `
            <div class="machine-status">
                <h3>🔧 Machine Status</h3>
                
                <div class="health-bar">
                    <div class="health-fill" style="
                        width: ${playerState.machineHealth}%;
                        background: ${statusColors[status]};
                    "></div>
                    <span class="health-text">${playerState.machineHealth}%</span>
                </div>
                
                <div class="status-label" style="color: ${statusColors[status]}">
                    ${status.toUpperCase()}
                </div>
                
                <div class="technician-info">
                    <h4>👨‍🔧 ${skill.name}</h4>
                    <div class="xp-bar">
                        <div class="xp-fill" style="
                            width: ${nextLevel ? 
                                ((playerState.technicianXP - skill.xpRequired) / 
                                (nextLevel.xpRequired - skill.xpRequired) * 100) : 100}%;
                        "></div>
                        <span>${playerState.technicianXP} XP</span>
                    </div>
                    ${nextLevel ? `<small>Next: ${nextLevel.name} at ${nextLevel.xpRequired} XP</small>` : 
                        '<small>Max level reached!</small>'}
                </div>
                
                ${playerState.activeFailures.length > 0 ? `
                    <div class="active-failures">
                        <h4>⚠️ Active Problems (${playerState.activeFailures.length})</h4>
                        ${playerState.activeFailures.map(f => `
                            <div class="failure-item severity-${f.severity}">
                                <span class="icon">${f.icon}</span>
                                <span class="name">${f.name}</span>
                                <span class="status ${f.diagnosed ? 'diagnosed' : 'unknown'}">
                                    ${f.diagnosed ? '✓ Diagnosed' : '? Unknown'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="all-good">✅ All systems operational!</p>'}
                
                <div class="stats-summary">
                    <span>Total Repairs: ${playerState.totalRepairs}</span>
                    <span>Perfect Diagnoses: ${playerState.perfectDiagnostics}</span>
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotTroubleshooting;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.GemBotTroubleshooting = GemBotTroubleshooting;
}

console.log('💎 GemBot Troubleshooting System loaded!');
console.log(`🔧 Component failures: ${Object.keys(GemBotTroubleshooting.componentFailures).length}`);
console.log(`🎮 Diagnostic mini-games: ${Object.keys(GemBotTroubleshooting.diagnosticMinigames).length}`);
console.log(`📊 Technician levels: ${Object.keys(GemBotTroubleshooting.technicianSkills).length}`);
