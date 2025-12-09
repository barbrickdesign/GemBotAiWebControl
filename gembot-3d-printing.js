/**
 * 💎 GemBot 3D Printing Mechanics System
 * Virtual 3D printing simulation with crafting, marketplace, and economy
 * 
 * Features:
 * - Print queue management
 * - Material costs and consumption
 * - Print failure simulation
 * - Part quality variance
 * - Player marketplace for selling parts
 * - Print upgrades and improvements
 */

const GemBot3DPrinting = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",

    // Printer configurations (upgradable)
    printerTiers: {
        basic: {
            id: "basic",
            name: "Basic FDM Printer",
            cost: 500,
            unlockLevel: 1,
            maxPrintSize: [200, 200, 200], // mm
            printSpeedMultiplier: 1.0,
            qualityMultiplier: 1.0,
            failureRateModifier: 1.0,
            simultaneousPrints: 1,
            materialsSupported: ["PLA", "PETG"]
        },
        standard: {
            id: "standard",
            name: "Standard FDM Printer",
            cost: 1500,
            unlockLevel: 5,
            maxPrintSize: [300, 300, 300],
            printSpeedMultiplier: 1.3,
            qualityMultiplier: 1.2,
            failureRateModifier: 0.8,
            simultaneousPrints: 1,
            materialsSupported: ["PLA", "PETG", "ABS"]
        },
        professional: {
            id: "professional",
            name: "Professional FDM Printer",
            cost: 5000,
            unlockLevel: 10,
            maxPrintSize: [400, 400, 400],
            printSpeedMultiplier: 1.8,
            qualityMultiplier: 1.5,
            failureRateModifier: 0.5,
            simultaneousPrints: 2,
            materialsSupported: ["PLA", "PETG", "ABS", "Nylon"]
        },
        industrial: {
            id: "industrial",
            name: "Industrial Printer",
            cost: 15000,
            unlockLevel: 15,
            maxPrintSize: [500, 500, 500],
            printSpeedMultiplier: 2.5,
            qualityMultiplier: 2.0,
            failureRateModifier: 0.3,
            simultaneousPrints: 4,
            materialsSupported: ["PLA", "PETG", "ABS", "Nylon", "TPU"]
        }
    },

    // Material inventory and costs
    materials: {
        PLA: {
            id: "PLA",
            name: "PLA Filament",
            description: "Beginner-friendly, biodegradable plastic",
            costPerGram: 0.02,
            spoolSize: 1000, // grams
            spoolCost: 20,
            strength: 60,
            heatResistance: 55, // °C max
            printTemp: [190, 220],
            bedTemp: [50, 60],
            color: "#4caf50",
            unlockLevel: 1
        },
        PETG: {
            id: "PETG",
            name: "PETG Filament",
            description: "Strong, flexible, food-safe plastic",
            costPerGram: 0.025,
            spoolSize: 1000,
            spoolCost: 25,
            strength: 80,
            heatResistance: 75,
            printTemp: [230, 250],
            bedTemp: [70, 80],
            color: "#2196f3",
            unlockLevel: 3
        },
        ABS: {
            id: "ABS",
            name: "ABS Filament",
            description: "Heat-resistant, durable engineering plastic",
            costPerGram: 0.03,
            spoolSize: 1000,
            spoolCost: 30,
            strength: 85,
            heatResistance: 95,
            printTemp: [230, 260],
            bedTemp: [90, 110],
            requiresEnclosure: true,
            color: "#f44336",
            unlockLevel: 5
        },
        Nylon: {
            id: "Nylon",
            name: "Nylon Filament",
            description: "Professional-grade, highest strength",
            costPerGram: 0.05,
            spoolSize: 750,
            spoolCost: 45,
            strength: 95,
            heatResistance: 90,
            printTemp: [250, 280],
            bedTemp: [70, 90],
            requiresDryBox: true,
            color: "#9c27b0",
            unlockLevel: 8
        },
        TPU: {
            id: "TPU",
            name: "TPU Filament",
            description: "Flexible, rubber-like material",
            costPerGram: 0.04,
            spoolSize: 500,
            spoolCost: 35,
            strength: 70,
            flexibility: 95,
            printTemp: [210, 240],
            bedTemp: [30, 50],
            printSpeedPenalty: 0.5,
            color: "#ff9800",
            unlockLevel: 6
        }
    },

    // Print failure types and probabilities
    failureTypes: {
        bedAdhesion: {
            id: "bedAdhesion",
            name: "Bed Adhesion Failure",
            description: "Part detached from build plate during print",
            baseProbability: 0.05,
            icon: "🔲",
            recoveryTime: 5, // minutes to clean up
            materialWaste: 0.2, // 20% of planned material
            fixable: false
        },
        layerShift: {
            id: "layerShift",
            name: "Layer Shift",
            description: "Layers misaligned due to belt slip or obstruction",
            baseProbability: 0.03,
            icon: "↔️",
            recoveryTime: 10,
            materialWaste: 0.5,
            fixable: false
        },
        spaghetti: {
            id: "spaghetti",
            name: "Spaghetti Monster",
            description: "Print became detached and created a tangled mess",
            baseProbability: 0.04,
            icon: "🍝",
            recoveryTime: 15,
            materialWaste: 0.8,
            fixable: false
        },
        clog: {
            id: "clog",
            name: "Nozzle Clog",
            description: "Hotend became clogged, stopping extrusion",
            baseProbability: 0.02,
            icon: "🔧",
            recoveryTime: 20,
            materialWaste: 0.3,
            fixable: true,
            fixCost: 5
        },
        stringing: {
            id: "stringing",
            name: "Excessive Stringing",
            description: "Part has stringy artifacts between features",
            baseProbability: 0.08,
            icon: "🕸️",
            recoveryTime: 5,
            materialWaste: 0,
            fixable: true, // Can clean up
            qualityPenalty: 0.2
        },
        warping: {
            id: "warping",
            name: "Warping",
            description: "Part corners lifted due to thermal stress",
            baseProbability: 0.06,
            icon: "📐",
            recoveryTime: 0,
            materialWaste: 0,
            fixable: true,
            qualityPenalty: 0.15
        },
        underExtrusion: {
            id: "underExtrusion",
            name: "Under-Extrusion",
            description: "Not enough material deposited, weak layers",
            baseProbability: 0.04,
            icon: "📉",
            recoveryTime: 0,
            materialWaste: 0,
            fixable: false,
            qualityPenalty: 0.25
        }
    },

    // Quality grades based on print outcome
    qualityGrades: {
        perfect: {
            grade: "A+",
            name: "Perfect",
            multiplier: 1.2,
            sellBonus: 1.3,
            color: "#ffd700",
            probability: 0.10
        },
        excellent: {
            grade: "A",
            name: "Excellent",
            multiplier: 1.1,
            sellBonus: 1.15,
            color: "#4caf50",
            probability: 0.25
        },
        good: {
            grade: "B",
            name: "Good",
            multiplier: 1.0,
            sellBonus: 1.0,
            color: "#2196f3",
            probability: 0.40
        },
        acceptable: {
            grade: "C",
            name: "Acceptable",
            multiplier: 0.9,
            sellBonus: 0.85,
            color: "#ff9800",
            probability: 0.20
        },
        poor: {
            grade: "D",
            name: "Poor",
            multiplier: 0.75,
            sellBonus: 0.6,
            color: "#f44336",
            probability: 0.05
        }
    },

    // Printer upgrades available
    printerUpgrades: {
        autoBedLeveling: {
            id: "autoBedLeveling",
            name: "Auto Bed Leveling",
            description: "Reduces bed adhesion failures by 50%",
            cost: 200,
            effect: { reduceFailure: "bedAdhesion", amount: 0.5 },
            unlockLevel: 3
        },
        enclosure: {
            id: "enclosure",
            name: "Heated Enclosure",
            description: "Enables ABS printing, reduces warping by 70%",
            cost: 500,
            effect: { enableMaterial: "ABS", reduceFailure: "warping", amount: 0.7 },
            unlockLevel: 5
        },
        dryBox: {
            id: "dryBox",
            name: "Filament Dry Box",
            description: "Enables Nylon, reduces moisture-related failures",
            cost: 150,
            effect: { enableMaterial: "Nylon", qualityBonus: 0.1 },
            unlockLevel: 7
        },
        directDrive: {
            id: "directDrive",
            name: "Direct Drive Extruder",
            description: "Better filament control, enables TPU",
            cost: 300,
            effect: { enableMaterial: "TPU", reduceFailure: "clog", amount: 0.5 },
            unlockLevel: 6
        },
        speedUpgrade: {
            id: "speedUpgrade",
            name: "High-Speed Kit",
            description: "Increase print speed by 30%",
            cost: 400,
            effect: { speedMultiplier: 1.3 },
            unlockLevel: 8
        },
        qualityUpgrade: {
            id: "qualityUpgrade",
            name: "Precision Components",
            description: "Improve print quality by 20%",
            cost: 600,
            effect: { qualityMultiplier: 1.2 },
            unlockLevel: 10
        },
        multiColor: {
            id: "multiColor",
            name: "Multi-Color System",
            description: "Print with multiple colors, cosmetic bonus",
            cost: 800,
            effect: { cosmeticBonus: 1.5 },
            unlockLevel: 12
        }
    },

    // Player state (initialized per player)
    createPlayerPrintingState() {
        return {
            ownedPrinter: "basic",
            installedUpgrades: [],
            materialInventory: {
                PLA: 1000,
                PETG: 0,
                ABS: 0,
                Nylon: 0,
                TPU: 0
            },
            printQueue: [],
            completedPrints: [],
            totalPrints: 0,
            successfulPrints: 0,
            failedPrints: 0,
            totalMaterialUsed: 0,
            xpEarned: 0,
            coinsEarned: 0
        };
    },

    /**
     * Start a print job
     */
    startPrint(playerState, partData, material, infillLevel = "medium") {
        const printer = this.printerTiers[playerState.ownedPrinter];
        const materialInfo = this.materials[material];
        
        // Check if material is supported
        if (!printer.materialsSupported.includes(material)) {
            return { 
                success: false, 
                error: `Your printer doesn't support ${material}. Upgrade required.` 
            };
        }
        
        // Check material inventory
        const materialNeeded = this._calculateMaterialNeeded(partData, infillLevel);
        if (playerState.materialInventory[material] < materialNeeded) {
            return {
                success: false,
                error: `Not enough ${material}. Need ${materialNeeded}g, have ${playerState.materialInventory[material]}g`
            };
        }
        
        // Calculate print time with modifiers
        const basePrintTime = partData.printTime || 60;
        const infillModifier = this._getInfillTimeModifier(infillLevel);
        const printerSpeedModifier = printer.printSpeedMultiplier;
        const materialSpeedModifier = materialInfo.printSpeedPenalty || 1;
        
        const adjustedPrintTime = Math.round(
            basePrintTime * infillModifier / printerSpeedModifier * materialSpeedModifier
        );
        
        // Calculate cost
        const materialCost = materialNeeded * materialInfo.costPerGram;
        
        // Create print job
        const printJob = {
            id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            partId: partData.id,
            partName: partData.name,
            material: material,
            infillLevel: infillLevel,
            materialNeeded: materialNeeded,
            printTime: adjustedPrintTime,
            startTime: Date.now(),
            estimatedEndTime: Date.now() + (adjustedPrintTime * 60 * 1000), // in ms
            status: "printing",
            progress: 0,
            cost: materialCost
        };
        
        // Deduct material
        playerState.materialInventory[material] -= materialNeeded;
        playerState.printQueue.push(printJob);
        
        return {
            success: true,
            printJob: printJob,
            message: `Started printing ${partData.name}. ETA: ${adjustedPrintTime} minutes.`
        };
    },

    /**
     * Check print progress and resolve completed prints
     */
    updatePrintQueue(playerState) {
        const now = Date.now();
        const results = [];
        
        playerState.printQueue = playerState.printQueue.filter(job => {
            // Update progress
            const elapsed = now - job.startTime;
            const totalTime = job.estimatedEndTime - job.startTime;
            job.progress = Math.min(100, Math.round((elapsed / totalTime) * 100));
            
            // Check if complete
            if (now >= job.estimatedEndTime) {
                const result = this._resolvePrint(playerState, job);
                results.push(result);
                return false; // Remove from queue
            }
            
            return true; // Keep in queue
        });
        
        return results;
    },

    /**
     * Resolve a completed print job
     */
    _resolvePrint(playerState, job) {
        const printer = this.printerTiers[playerState.ownedPrinter];
        
        // Check for failures
        const failure = this._rollForFailure(playerState, job);
        
        if (failure) {
            playerState.failedPrints++;
            playerState.totalPrints++;
            
            // Calculate wasted material
            const wastedMaterial = Math.round(job.materialNeeded * failure.materialWaste);
            playerState.totalMaterialUsed += wastedMaterial;
            
            return {
                success: false,
                job: job,
                failure: failure,
                wastedMaterial: wastedMaterial,
                message: `❌ Print failed: ${failure.name}. ${failure.description}`
            };
        }
        
        // Success! Determine quality
        const quality = this._rollForQuality(playerState);
        
        // Calculate rewards
        const baseXP = job.printTime * 2;
        const xpReward = Math.round(baseXP * quality.multiplier);
        
        playerState.successfulPrints++;
        playerState.totalPrints++;
        playerState.totalMaterialUsed += job.materialNeeded;
        playerState.xpEarned += xpReward;
        
        // Create completed part
        const completedPart = {
            id: `${job.partId}_${Date.now()}`,
            originalPartId: job.partId,
            name: job.partName,
            material: job.material,
            infill: job.infillLevel,
            quality: quality,
            printedAt: Date.now(),
            sellValue: Math.round((job.cost * 2) * quality.sellBonus)
        };
        
        playerState.completedPrints.push(completedPart);
        
        return {
            success: true,
            job: job,
            quality: quality,
            part: completedPart,
            xpReward: xpReward,
            message: `✅ Print complete! Quality: ${quality.grade} (${quality.name}). +${xpReward} XP`
        };
    },

    /**
     * Roll for print failure
     */
    _rollForFailure(playerState, job) {
        const printer = this.printerTiers[playerState.ownedPrinter];
        
        for (const [failureId, failure] of Object.entries(this.failureTypes)) {
            // Calculate adjusted probability
            let probability = failure.baseProbability * printer.failureRateModifier;
            
            // Apply upgrade modifiers
            for (const upgradeId of playerState.installedUpgrades) {
                const upgrade = this.printerUpgrades[upgradeId];
                if (upgrade?.effect?.reduceFailure === failureId) {
                    probability *= (1 - upgrade.effect.amount);
                }
            }
            
            // Material-specific modifiers
            if (job.material === "ABS" && failureId === "warping") {
                probability *= 1.5;
            }
            if (job.material === "Nylon" && failureId === "stringing") {
                probability *= 1.3;
            }
            
            if (Math.random() < probability) {
                return failure;
            }
        }
        
        return null; // No failure
    },

    /**
     * Roll for print quality
     */
    _rollForQuality(playerState) {
        const printer = this.printerTiers[playerState.ownedPrinter];
        let roll = Math.random();
        
        // Quality bonus from printer
        roll += (printer.qualityMultiplier - 1) * 0.2;
        
        // Quality bonus from upgrades
        for (const upgradeId of playerState.installedUpgrades) {
            const upgrade = this.printerUpgrades[upgradeId];
            if (upgrade?.effect?.qualityBonus) {
                roll += upgrade.effect.qualityBonus * 0.2;
            }
        }
        
        // Clamp roll
        roll = Math.min(1, Math.max(0, roll));
        
        // Determine grade based on adjusted roll
        if (roll > 0.90) return this.qualityGrades.perfect;
        if (roll > 0.65) return this.qualityGrades.excellent;
        if (roll > 0.25) return this.qualityGrades.good;
        if (roll > 0.05) return this.qualityGrades.acceptable;
        return this.qualityGrades.poor;
    },

    /**
     * Calculate material needed for a part
     */
    _calculateMaterialNeeded(partData, infillLevel) {
        const baseWeight = partData.materialWeight || 20;
        const infillModifiers = {
            low: 0.7,
            medium: 0.85,
            high: 1.0,
            solid: 1.3
        };
        return Math.round(baseWeight * (infillModifiers[infillLevel] || 1));
    },

    /**
     * Get print time modifier for infill level
     */
    _getInfillTimeModifier(infillLevel) {
        const modifiers = {
            low: 0.7,
            medium: 0.85,
            high: 1.0,
            solid: 1.3
        };
        return modifiers[infillLevel] || 1;
    },

    /**
     * Purchase material
     */
    purchaseMaterial(playerState, materialId, spoolCount = 1) {
        const material = this.materials[materialId];
        if (!material) {
            return { success: false, error: "Unknown material" };
        }
        
        const totalCost = material.spoolCost * spoolCount;
        const totalMaterial = material.spoolSize * spoolCount;
        
        // Assume player has enough coins (check should be done externally)
        playerState.materialInventory[materialId] += totalMaterial;
        
        return {
            success: true,
            materialAdded: totalMaterial,
            cost: totalCost,
            message: `Purchased ${spoolCount} spool(s) of ${material.name} (+${totalMaterial}g)`
        };
    },

    /**
     * Install printer upgrade
     */
    installUpgrade(playerState, upgradeId) {
        const upgrade = this.printerUpgrades[upgradeId];
        if (!upgrade) {
            return { success: false, error: "Unknown upgrade" };
        }
        
        if (playerState.installedUpgrades.includes(upgradeId)) {
            return { success: false, error: "Upgrade already installed" };
        }
        
        playerState.installedUpgrades.push(upgradeId);
        
        return {
            success: true,
            upgrade: upgrade,
            message: `Installed ${upgrade.name}: ${upgrade.description}`
        };
    },

    /**
     * Upgrade printer tier
     */
    upgradePrinter(playerState, newTier) {
        const printer = this.printerTiers[newTier];
        if (!printer) {
            return { success: false, error: "Unknown printer tier" };
        }
        
        playerState.ownedPrinter = newTier;
        
        return {
            success: true,
            printer: printer,
            message: `Upgraded to ${printer.name}!`
        };
    },

    /**
     * List parts available in player's marketplace
     */
    getMarketplaceListings(playerState) {
        return playerState.completedPrints.map(part => ({
            ...part,
            listed: true,
            listPrice: part.sellValue
        }));
    },

    /**
     * Sell a part on marketplace
     */
    sellPart(playerState, partId) {
        const partIndex = playerState.completedPrints.findIndex(p => p.id === partId);
        if (partIndex === -1) {
            return { success: false, error: "Part not found" };
        }
        
        const part = playerState.completedPrints[partIndex];
        playerState.completedPrints.splice(partIndex, 1);
        playerState.coinsEarned += part.sellValue;
        
        return {
            success: true,
            part: part,
            earnings: part.sellValue,
            message: `Sold ${part.name} for ${part.sellValue} coins!`
        };
    },

    /**
     * Generate print queue UI HTML
     */
    generatePrintQueueHTML(playerState) {
        if (playerState.printQueue.length === 0) {
            return '<div class="print-queue empty">No active prints</div>';
        }
        
        return `
            <div class="print-queue">
                <h3>🖨️ Print Queue</h3>
                ${playerState.printQueue.map(job => `
                    <div class="print-job">
                        <div class="job-header">
                            <span class="job-name">${job.partName}</span>
                            <span class="job-material">${job.material}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${job.progress}%"></div>
                        </div>
                        <div class="job-footer">
                            <span class="progress-text">${job.progress}%</span>
                            <span class="eta">ETA: ${Math.ceil((job.estimatedEndTime - Date.now()) / 60000)} min</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Generate printer stats HTML
     */
    generatePrinterStatsHTML(playerState) {
        const printer = this.printerTiers[playerState.ownedPrinter];
        const successRate = playerState.totalPrints > 0 ? 
            Math.round((playerState.successfulPrints / playerState.totalPrints) * 100) : 0;
        
        return `
            <div class="printer-stats">
                <h3>🖨️ ${printer.name}</h3>
                <div class="stats-grid">
                    <div class="stat">
                        <span class="label">Total Prints</span>
                        <span class="value">${playerState.totalPrints}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Success Rate</span>
                        <span class="value">${successRate}%</span>
                    </div>
                    <div class="stat">
                        <span class="label">Material Used</span>
                        <span class="value">${playerState.totalMaterialUsed}g</span>
                    </div>
                    <div class="stat">
                        <span class="label">XP Earned</span>
                        <span class="value">${playerState.xpEarned}</span>
                    </div>
                </div>
                
                <h4>📦 Material Inventory</h4>
                <div class="materials">
                    ${Object.entries(playerState.materialInventory).map(([mat, amount]) => `
                        <div class="material-item" style="border-color: ${this.materials[mat]?.color || '#888'}">
                            <span class="mat-name">${mat}</span>
                            <span class="mat-amount">${amount}g</span>
                        </div>
                    `).join('')}
                </div>
                
                <h4>⬆️ Installed Upgrades</h4>
                <div class="upgrades">
                    ${playerState.installedUpgrades.length === 0 ? 
                        '<span class="no-upgrades">No upgrades installed</span>' :
                        playerState.installedUpgrades.map(id => `
                            <span class="upgrade-badge">${this.printerUpgrades[id]?.name}</span>
                        `).join('')
                    }
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBot3DPrinting;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.GemBot3DPrinting = GemBot3DPrinting;
}

console.log('💎 GemBot 3D Printing System loaded!');
console.log(`🖨️ Printer tiers: ${Object.keys(GemBot3DPrinting.printerTiers).length}`);
console.log(`🧵 Materials: ${Object.keys(GemBot3DPrinting.materials).length}`);
console.log(`⚠️ Failure types: ${Object.keys(GemBot3DPrinting.failureTypes).length}`);
