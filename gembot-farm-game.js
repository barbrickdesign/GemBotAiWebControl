/**
 * GemBot Farm Game - Cyberpunk Gem Cutting Idle/Clicker Game
 * Integrates with real GemBot hardware for bonuses
 * MERLIN AI INTEGRATION: Merlin guides, teaches, and learns alongside the player
 * 
 * REALISTIC TIMING SYSTEM (Based on actual GemBot machine):
 * - Reflects real gem cutting process: prep, dop, shape, preform, cut, polish
 * - Timing derived from Arduino code: 50ms motor intervals, 40 steps/mm removal
 * - Lap progression: 600→800→1200 grit, then polish with 8k→14k→50k→100k→200k paste
 * - Includes human interaction requirements and realistic hazards
 * 
 * Features:
 * - Multiple GemBot machines in a virtual farm
 * - Cyberpunk 3D scene environment
 * - REALISTIC gem cutting with proper timing
 * - Level progression and achievements
 * - Crypto token rewards integration
 * - Real machine connection bonuses
 * - Merlin AI assistant in-game for tips, teaching, and celebration
 * - Educational - teaches actual faceting process
 */

class GemBotFarmGame {
    constructor() {
        // Babylon.js components
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        
        // Merlin AI Integration
        this.merlin = null;
        this.merlinAvatar = null;
        this.merlinSpeechBubble = null;
        this.merlinLastMessage = '';
        this.merlinMessageQueue = [];
        this.merlinTipInterval = null;
        
        // Game state
        this.state = {
            player: {
                level: 1,
                xp: 0,
                xpToNext: 100,
                gems: 50,          // Starting currency (earned from selling cut stones)
                tokens: 0,         // Premium currency (convertible to crypto!)
                totalGemsEver: 0,
                stonesLost: 0,        // Stones lost to accidents
                stonesCompleted: 0,   // Successfully completed stones
                totalCaratsCut: 0,    // Lifetime carats of finished stones
                totalCaratsLost: 0,   // Carats lost to failures
                cryptoEarned: 0,      // Total crypto rewards earned (in smallest unit)
                lastPlayTime: Date.now(),  // For offline progress calculation
                isSearching: false    // True when out of resources, searching for more
            },
            // ==================== PER-GEM BALANCE (Cut Stone Inventory) ====================
            // Each gem type has its own inventory of finished stones
            gemBalance: {
                'Quartz (Amethyst)': [],    // Array of { caratWeight, quality, value, cutDate, design }
                'Quartz (Citrine)': [],
                'Garnet': [],
                'Topaz': [],
                'Emerald': [],
                'Ruby': [],
                'Sapphire': [],
                'Opal': [],
                'Diamond': [],
                'Alexandrite': []
            },
            // ==================== INVENTORY SYSTEM ====================
            inventory: {
                // Rough stones inventory (by gem type name)
                // Each entry is an array of rough pieces with carat weights
                rough: {
                    'Quartz (Amethyst)': [
                        { carats: 2.5, quality: 'good' },
                        { carats: 3.2, quality: 'good' },
                        { carats: 1.8, quality: 'fair' },
                        { carats: 4.1, quality: 'excellent' },
                        { carats: 2.0, quality: 'good' }
                    ],
                    'Quartz (Citrine)': [
                        { carats: 2.8, quality: 'good' },
                        { carats: 1.5, quality: 'fair' },
                        { carats: 3.5, quality: 'good' }
                    ],
                    'Garnet': [],
                    'Topaz': [],
                    'Emerald': [],
                    'Ruby': [],
                    'Sapphire': [],
                    'Opal': [],
                    'Diamond': [],
                    'Alexandrite': []
                },
                // Cut stones ready for sale (array of cut stone objects)
                cutStones: [],
                // Consumables
                consumables: {
                    dopWax: 100,              // Units of dop wax (1 per stone)
                    water: 100,               // Water tank % (0-100)
                    lubricant: 100            // Machine lubricant % (0-100)
                }
            },
            // ==================== LAPS INVENTORY ====================
            laps: {
                // Cutting laps (condition 0-100%)
                coarse: { condition: 100, owned: true },
                '600_grit': { condition: 100, owned: true },
                '800_grit': { condition: 100, owned: true },
                '1200_grit': { condition: 100, owned: true },
                // Polishing laps - copper lap with charged paste
                copper: { 
                    condition: 100, 
                    owned: true,
                    currentPaste: null  // Currently charged paste grit
                }
            },
            // ==================== POLISHING PASTE INVENTORY ====================
            paste: {
                '8k': 50,    // Units of paste (charges copper lap ~5 times each)
                '14k': 50,
                '50k': 30,
                '100k': 20,
                '200k': 10
            },
            // ==================== UNLOCKED SHAPES & DESIGNS ====================
            unlockedShapes: ['round'],  // Start with round only
            unlockedDesigns: ['simple_round', 'standard_round_brilliant'],  // Start with basic designs
            // ==================== INVENTORY UPGRADES ====================
            upgradelevels: {
                water_tank: 0,
                lap_storage: 0,
                paste_cabinet: 0,
                rough_storage: 0
            },
            // ==================== PENDING INTERACTIONS ====================
            // Tracks what machines need human interaction clicks
            pendingInteractions: [],  // Array of { machineId, interactionType, description }
            machines: [],
            rooms: ['home_desk'],  // Start with home desk (1 slot) - proper beginner experience
            upgrades: {},
            achievements: [],
            stats: {
                totalCuts: 0,
                perfectCuts: 0,
                playTime: 0,
                realMachineTime: 0,
                merlinTipsReceived: 0,
                lessonsCompleted: 0,
                dopFailures: 0,       // Stones flew off dop
                transferFailures: 0,  // Alignment failures during transfer
                totalTimeSpentCutting: 0, // Real accumulated cutting time (seconds)
                lapsReplaced: 0,
                waterRefills: 0,
                maintenancePerformed: 0,
                stonesSold: 0,
                totalSalesValue: 0
            },
            merlinInteractions: {
                tipsGiven: 0,
                questionsAnswered: 0,
                celebrationsMade: 0,
                teachingMoments: 0
            },
            currentStones: [] // Stones currently being cut
        };
        
        // Game configuration
        this.config = {
            baseProductionRate: 1,
            realMachineBonus: 1.5,
            merlinWisdomBonus: 1.1, // Bonus when Merlin gives tips
            maxMachinesPerRoom: 6,
            tickRate: 1000, // 1 second game tick
            autoSaveInterval: 30000, // 30 seconds
            merlinTipInterval: 45000, // Merlin speaks every 45 seconds
            // Realistic timing factors (in game-seconds, accelerated from real hours)
            timeAcceleration: 60, // 1 real second = 60 game seconds (1 min = 1 hr of cutting)
            // Save key for localStorage
            saveKey: 'gembot_farm_save_v2',
            // Crypto conversion rates
            cryptoConversion: {
                tokensPerCrypto: 1000,     // 1000 tokens = 1 crypto unit
                minTokensToConvert: 100,   // Minimum tokens to convert
                conversionFee: 0.05        // 5% fee on conversion
            }
        };
        
        // ==================== CARAT WEIGHT & YIELD SYSTEM ====================
        // Realistic yield percentages based on design complexity
        this.caratYield = {
            // Design-based yield: finished weight / rough weight
            'simple_round': 0.45,           // 45% yield - simple cuts lose less
            'standard_round_brilliant': 0.40, // 40% yield - standard brilliant
            'portuguese_round': 0.30,       // 30% yield - complex designs lose more
            'emerald_step': 0.55,           // 55% yield - step cuts preserve weight
            'trillion_brilliant': 0.38,     // 38% yield
            'default': 0.40                 // Default 40% yield
        };
        
        // Carat-based pricing multipliers
        this.caratPricing = {
            // Under 1ct: lower value per carat
            'tiny': { maxCarats: 0.5, multiplier: 0.5 },
            'small': { maxCarats: 1.0, multiplier: 0.8 },
            // 1-2ct: standard pricing
            'medium': { maxCarats: 2.0, multiplier: 1.0 },
            // 2-5ct: premium
            'large': { maxCarats: 5.0, multiplier: 1.5 },
            // 5ct+: exceptional
            'exceptional': { maxCarats: Infinity, multiplier: 2.5 }
        };
        
        // Rough quality affects yield
        this.roughQuality = {
            'poor': { yieldMod: 0.8, failureMod: 1.5 },
            'fair': { yieldMod: 0.9, failureMod: 1.2 },
            'good': { yieldMod: 1.0, failureMod: 1.0 },
            'excellent': { yieldMod: 1.1, failureMod: 0.8 },
            'exceptional': { yieldMod: 1.15, failureMod: 0.6 }
        };
        
        // ==================== SHOP PRICES ====================
        // All prices in gems (game currency)
        // Rough prices are PER CARAT
        this.shopPrices = {
            // Rough stone costs PER CARAT (by gem name)
            // Prices reflect real-world wholesale rough market (1 gem ≈ $1 USD)
            // These are mid-grade material prices for lapidary practice
            roughPerCarat: {
                'Quartz (Amethyst)': 2,      // $2/ct - common practice material
                'Quartz (Citrine)': 3,       // $3/ct - heat-treated amethyst is common
                'Garnet': 8,                 // $8/ct - almandine/pyrope rough
                'Topaz': 15,                 // $15/ct - blue topaz rough (irradiated)
                'Emerald': 75,               // $75/ct - commercial grade Colombian
                'Ruby': 150,                 // $150/ct - mid-grade Burmese/Thai
                'Sapphire': 120,             // $120/ct - mid-grade Ceylon/Australian
                'Opal': 50,                  // $50/ct - Ethiopian/Australian rough
                'Diamond': 500,              // $500/ct - rough industrial to gem-grade
                'Alexandrite': 2000          // $2000/ct - extremely rare, Brazil/Russia
            },
            // Lap costs (new replacement) - reflects real lap prices
            laps: {
                coarse: 45,       // ~$45 for coarse diamond lap
                '600_grit': 55,   // ~$55 for 600 grit
                '800_grit': 60,   // ~$60 for 800 grit
                '1200_grit': 70,  // ~$70 for 1200 grit
                copper: 85        // ~$85 for copper charging lap
            },
            // Polishing paste (per unit, ~5 lap charges each)
            paste: {
                '8k': 8,          // ~$8 per unit
                '14k': 12,        // ~$12 per unit
                '50k': 20,        // ~$20 per unit
                '100k': 35,       // ~$35 per unit
                '200k': 50        // ~$50 per unit
            },
            // Consumables
            consumables: {
                dopWax: 5,        // Per 10 units (~$5)
                water: 2,         // Per 25% tank refill
                lubricant: 8      // Per 25% refill
            },
            // Machine repairs
            repairs: {
                minor: 35,        // Quick fix (restores 25% condition)
                major: 100,       // Full service (restores 50% condition)
                overhaul: 300     // Complete rebuild (restores 100%)
            }
        };
        
        // ==================== CUT GEM VALUES (per carat finished weight) ====================
        // Prices reflect real-world wholesale cut gem prices (1 gem ≈ $1 USD)
        // Perfect cuts command significant premiums in real market
        this.gemValues = {
            'Quartz (Amethyst)': { base: 15, perfectBonus: 1.8 },     // $15/ct cut, $27/ct perfect
            'Quartz (Citrine)': { base: 18, perfectBonus: 1.8 },     // $18/ct cut, $32/ct perfect
            'Garnet': { base: 35, perfectBonus: 2.0 },               // $35/ct cut, $70/ct perfect
            'Topaz': { base: 60, perfectBonus: 2.0 },                // $60/ct cut, $120/ct perfect
            'Emerald': { base: 300, perfectBonus: 2.5 },             // $300/ct cut, $750/ct perfect
            'Ruby': { base: 600, perfectBonus: 3.0 },                // $600/ct cut, $1800/ct perfect
            'Sapphire': { base: 500, perfectBonus: 3.0 },            // $500/ct cut, $1500/ct perfect
            'Opal': { base: 200, perfectBonus: 2.2 },                // $200/ct cut, $440/ct perfect
            'Diamond': { base: 2500, perfectBonus: 4.0 },            // $2500/ct cut, $10000/ct perfect
            'Alexandrite': { base: 8000, perfectBonus: 4.0 }         // $8000/ct cut, $32000/ct perfect
        };
        
        // ==================== RESOURCE CONSUMPTION RATES ====================
        this.consumptionRates = {
            dopWaxPerStone: 1,            // 1 unit per stone mounted
            waterPerMinute: 0.5,          // % of tank per game minute of cutting
            lubricantPerHour: 1,          // % per hour of machine runtime
            lapWearPerStage: {
                coarse: 0.5,              // 0.5% wear per use
                '600_grit': 0.3,
                '800_grit': 0.25,
                '1200_grit': 0.2,
                copper: 0.1               // Polish laps last longer
            },
            pastePerCharge: 10            // Units of paste to charge copper lap
        };
        
        // ==================== MACHINE MAINTENANCE ====================
        this.maintenanceConfig = {
            conditionDecayRate: 0.05,     // % condition loss per game hour
            cleaningThreshold: 70,         // Warn when below this
            criticalThreshold: 30,         // Machine slows when below this
            breakdownThreshold: 10,        // Machine can break when below this
            breakdownChance: 0.1,          // 10% per tick when critical
            // Maintenance actions
            cleaning: {
                cost: 0,                   // Free, just takes time
                timeMinutes: 5,            // Game minutes
                conditionBoost: 10         // % restored
            },
            lubrication: {
                costLubricant: 5,          // % lubricant used
                conditionBoost: 15
            },
            repair: {
                cost: 30,                  // Gems cost
                conditionBoost: 50
            }
        };
        
        // ==================== HARDWARE FAILURE TYPES ====================
        this.hardwareFailures = {
            motor_issue: {
                name: 'Motor Issue',
                description: 'Motor not responding properly - needs service',
                severity: 'medium',
                repairCost: 40,
                downtimeMinutes: 30
            },
            limit_switch: {
                name: 'Limit Switch Fault',
                description: 'Limit switch triggered unexpectedly - needs calibration',
                severity: 'low',
                repairCost: 15,
                downtimeMinutes: 10
            },
            belt_wear: {
                name: 'Belt Wear',
                description: 'Drive belt showing wear - replace soon',
                severity: 'medium',
                repairCost: 35,
                downtimeMinutes: 20
            },
            bearing_noise: {
                name: 'Bearing Noise',
                description: 'Unusual noise from bearings - needs lubrication',
                severity: 'low',
                repairCost: 20,
                downtimeMinutes: 15
            },
            spindle_runout: {
                name: 'Spindle Runout',
                description: 'Spindle alignment off - affects cut quality',
                severity: 'high',
                repairCost: 75,
                downtimeMinutes: 60
            },
            coolant_leak: {
                name: 'Coolant Leak',
                description: 'Water system leaking - needs seal replacement',
                severity: 'medium',
                repairCost: 25,
                downtimeMinutes: 25
            }
        };
        
        // ==================== SHAPE & DESIGN LIBRARY ====================
        // Each design has specific facet tiers with angles and index positions
        // Based on 96-tooth index gear (3.75° per step)
        
        this.shapes = {
            'round': {
                name: 'Round',
                description: 'Classic circular shape',
                levelRequired: 1,
                baseDifficulty: 1.0
            },
            'oval': {
                name: 'Oval',
                description: 'Elongated round shape',
                levelRequired: 3,
                baseDifficulty: 1.2
            },
            'pear': {
                name: 'Pear',
                description: 'Teardrop shape',
                levelRequired: 5,
                baseDifficulty: 1.3
            },
            'marquise': {
                name: 'Marquise',
                description: 'Football/boat shape with pointed ends',
                levelRequired: 7,
                baseDifficulty: 1.5
            },
            'square': {
                name: 'Square',
                description: 'Square outline',
                levelRequired: 4,
                baseDifficulty: 1.1
            },
            'emerald_cut': {
                name: 'Emerald Cut',
                description: 'Rectangular step cut',
                levelRequired: 8,
                baseDifficulty: 1.4
            },
            'trillion': {
                name: 'Trillion',
                description: 'Triangular brilliant',
                levelRequired: 6,
                baseDifficulty: 1.3
            },
            'cushion': {
                name: 'Cushion',
                description: 'Square with rounded corners',
                levelRequired: 5,
                baseDifficulty: 1.25
            },
            'heart': {
                name: 'Heart',
                description: 'Romantic heart shape',
                levelRequired: 10,
                baseDifficulty: 1.8
            }
        };
        
        // Faceting designs with actual facet data
        // Each tier: { angle, indexPositions[], facetsPerTier }
        this.designs = {
            'standard_round_brilliant': {
                name: 'Standard Round Brilliant',
                shape: 'round',
                levelRequired: 1,
                description: '57-facet classic brilliant cut',
                totalFacets: 57,
                valueMultiplier: 1.0,
                // Pavilion facets (cut first)
                pavilion: {
                    girdle: { angle: 90, indices: [0,6,12,18,24,30,36,42,48,54,60,66,72,78,84,90], facetCount: 16 },
                    mains: { angle: 42, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    breaks: { angle: 41, indices: [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93], facetCount: 16 }
                },
                // Crown facets (after transfer)
                crown: {
                    girdle: { angle: 90, indices: [0,6,12,18,24,30,36,42,48,54,60,66,72,78,84,90], facetCount: 16 },
                    mains: { angle: 42, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    stars: { angle: 20, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    breaks: { angle: 32, indices: [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93], facetCount: 16 },
                    table: { angle: 0, indices: [0], facetCount: 1 }
                }
            },
            'simple_round': {
                name: 'Simple Round',
                shape: 'round',
                levelRequired: 1,
                description: '33-facet beginner cut',
                totalFacets: 33,
                valueMultiplier: 0.7,
                pavilion: {
                    girdle: { angle: 90, indices: [0,12,24,36,48,60,72,84], facetCount: 8 },
                    mains: { angle: 43, indices: [6,18,30,42,54,66,78,90], facetCount: 8 }
                },
                crown: {
                    girdle: { angle: 90, indices: [0,12,24,36,48,60,72,84], facetCount: 8 },
                    mains: { angle: 40, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    table: { angle: 0, indices: [0], facetCount: 1 }
                }
            },
            'portuguese_round': {
                name: 'Portuguese Round',
                shape: 'round',
                levelRequired: 8,
                description: '161-facet complex brilliant',
                totalFacets: 161,
                valueMultiplier: 2.5,
                pavilion: {
                    girdle: { angle: 90, indices: [0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93], facetCount: 32 },
                    tier1: { angle: 45, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    tier2: { angle: 50, indices: [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93], facetCount: 16 },
                    tier3: { angle: 55, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    tier4: { angle: 58, indices: [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93], facetCount: 16 }
                },
                crown: {
                    girdle: { angle: 90, indices: [0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93], facetCount: 32 },
                    tier1: { angle: 45, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    tier2: { angle: 35, indices: [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93], facetCount: 16 },
                    tier3: { angle: 25, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    tier4: { angle: 15, indices: [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93], facetCount: 16 },
                    table: { angle: 0, indices: [0], facetCount: 1 }
                }
            },
            'emerald_step': {
                name: 'Emerald Step Cut',
                shape: 'emerald_cut',
                levelRequired: 8,
                description: 'Classic step cut with hall-of-mirrors effect',
                totalFacets: 58,
                valueMultiplier: 1.8,
                pavilion: {
                    girdle: { angle: 90, indices: [0,24,48,72], facetCount: 4 },
                    step1: { angle: 49, indices: [12,36,60,84], facetCount: 4 },
                    step2: { angle: 57, indices: [0,24,48,72], facetCount: 4 },
                    step3: { angle: 65, indices: [12,36,60,84], facetCount: 4 },
                    corners: { angle: 45, indices: [6,18,30,42,54,66,78,90], facetCount: 8 }
                },
                crown: {
                    girdle: { angle: 90, indices: [0,24,48,72], facetCount: 4 },
                    step1: { angle: 34, indices: [12,36,60,84], facetCount: 4 },
                    step2: { angle: 25, indices: [0,24,48,72], facetCount: 4 },
                    step3: { angle: 15, indices: [12,36,60,84], facetCount: 4 },
                    corners: { angle: 30, indices: [6,18,30,42,54,66,78,90], facetCount: 8 },
                    table: { angle: 0, indices: [0], facetCount: 1 }
                }
            },
            'trillion_brilliant': {
                name: 'Trillion Brilliant',
                shape: 'trillion',
                levelRequired: 6,
                description: 'Triangular with brilliant facets',
                totalFacets: 43,
                valueMultiplier: 1.5,
                pavilion: {
                    girdle: { angle: 90, indices: [0,32,64], facetCount: 3 },
                    mains: { angle: 41, indices: [16,48,80], facetCount: 3 },
                    breaks: { angle: 40, indices: [8,24,40,56,72,88], facetCount: 6 }
                },
                crown: {
                    girdle: { angle: 90, indices: [0,32,64], facetCount: 3 },
                    mains: { angle: 35, indices: [16,48,80], facetCount: 3 },
                    stars: { angle: 20, indices: [0,32,64], facetCount: 3 },
                    breaks: { angle: 30, indices: [8,24,40,56,72,88], facetCount: 6 },
                    table: { angle: 0, indices: [0], facetCount: 1 }
                }
            }
        };
        
        // ==================== REALISTIC TIMING CONSTANTS ====================
        // Based on actual GemBot machine operation
        this.machineTimings = {
            homeTime: 5,              // Seconds to run home function
            angleChangeTime: 3,       // Seconds to change mast angle
            indexChangeTime: 2,       // Seconds to rotate to new index position
            approachTime: 2,          // Seconds to move stone close to wheel
            cutTimePerFacet: 15,      // Base seconds per facet on cutting lap
            polishTimePerFacet: 20,   // Base seconds per facet on polish lap
            retractTime: 1,           // Seconds to retract after each facet
            // Lap changes require human interaction
            lapChangeTime: 60,        // How long to simulate lap change
            pasteChargeTime: 30       // Time to charge copper lap with paste
        };
        
        // ==================== INVENTORY UPGRADES ====================
        this.inventoryUpgrades = {
            water_tank: {
                name: 'Larger Water Tank',
                levels: [
                    { capacity: 100, cost: 0 },      // Base
                    { capacity: 150, cost: 50 },
                    { capacity: 200, cost: 100 },
                    { capacity: 300, cost: 200 },
                    { capacity: 500, cost: 500 }
                ]
            },
            lap_storage: {
                name: 'Lap Storage Rack',
                levels: [
                    { spareSlots: 0, cost: 0 },      // Base - no spares
                    { spareSlots: 2, cost: 75 },
                    { spareSlots: 4, cost: 150 },
                    { spareSlots: 6, cost: 300 }
                ]
            },
            paste_cabinet: {
                name: 'Paste Storage Cabinet',
                levels: [
                    { maxPaste: 50, cost: 0 },       // Base
                    { maxPaste: 100, cost: 60 },
                    { maxPaste: 200, cost: 120 },
                    { maxPaste: 400, cost: 250 }
                ]
            },
            rough_storage: {
                name: 'Rough Stone Storage',
                levels: [
                    { maxRough: 20, cost: 0 },       // Base
                    { maxRough: 50, cost: 80 },
                    { maxRough: 100, cost: 160 },
                    { maxRough: 250, cost: 400 }
                ]
            }
        };
        
        // Machine types - affects cutting speed and precision
        this.machineTypes = {
            'gembot_basic': {
                name: 'GemBot Basic',
                cost: 0,
                production: 1,
                speed: 1,        // Base speed multiplier
                precision: 0.7,  // Lower precision = more dop failures
                model: 'basic'
            },
            'gembot_pro': {
                name: 'GemBot Pro',
                cost: 100,
                production: 3,
                speed: 1.5,
                precision: 0.85,
                model: 'pro'
            },
            'gembot_ultra': {
                name: 'GemBot Ultra',
                cost: 500,
                production: 10,
                speed: 2,
                precision: 0.95, // High precision = fewer accidents
                model: 'ultra'
            }
        };
        
        // Room types - From home hobby to industrial warehouse scale
        // Goal: Support 1000s of GemBots for ultimate factory simulation
        this.roomTypes = {
            // ===== TIER 1: HOME OPERATIONS =====
            'home_desk': {
                name: 'Home Desk Setup',
                tier: 1,
                slots: 1,
                bonus: 1.0,
                cost: 0,
                description: 'Single GemBot on your desk - where every cutter starts',
                dimensions: { width: 3, depth: 2 },
                unlockLevel: 1
            },
            'home_workshop': {
                name: 'Home Workshop',
                tier: 1,
                slots: 4,
                bonus: 1.05,
                cost: 0,  // Free - this is the starter room
                description: 'Your dedicated workshop space - 4 GemBot capacity',
                dimensions: { width: 8, depth: 6 },
                unlockLevel: 1
            },
            'home_studio': {
                name: 'Home Studio',
                tier: 1,
                slots: 8,
                bonus: 1.1,
                cost: 500,
                description: 'Full home studio with proper workbenches',
                dimensions: { width: 12, depth: 10 },
                unlockLevel: 5
            },
            // ===== TIER 2: SMALL BUSINESS =====
            'small_shop': {
                name: 'Small Retail Shop',
                tier: 2,
                slots: 12,
                bonus: 1.15,
                cost: 2000,
                description: 'Small storefront with back workshop',
                dimensions: { width: 16, depth: 12 },
                unlockLevel: 8
            },
            'brick_mortar': {
                name: 'Brick & Mortar Store',
                tier: 2,
                slots: 20,
                bonus: 1.2,
                cost: 5000,
                description: 'Full jewelry store with production area',
                dimensions: { width: 24, depth: 16 },
                unlockLevel: 12
            },
            'boutique_factory': {
                name: 'Boutique Factory',
                tier: 2,
                slots: 35,
                bonus: 1.25,
                cost: 15000,
                description: 'Small factory with multiple cutting stations',
                dimensions: { width: 32, depth: 24 },
                unlockLevel: 18
            },
            // ===== TIER 3: INDUSTRIAL =====
            'small_warehouse': {
                name: 'Small Warehouse',
                tier: 3,
                slots: 75,
                bonus: 1.3,
                cost: 50000,
                description: 'Industrial space with rows of GemBots',
                dimensions: { width: 50, depth: 40 },
                unlockLevel: 25
            },
            'medium_warehouse': {
                name: 'Medium Warehouse',
                tier: 3,
                slots: 200,
                bonus: 1.35,
                cost: 150000,
                description: 'Serious gem cutting operation',
                dimensions: { width: 80, depth: 60 },
                unlockLevel: 35
            },
            'large_warehouse': {
                name: 'Large Warehouse',
                tier: 3,
                slots: 500,
                bonus: 1.4,
                cost: 500000,
                description: 'Major production facility',
                dimensions: { width: 120, depth: 80 },
                unlockLevel: 50
            },
            // ===== TIER 4: MEGA OPERATIONS =====
            'mega_factory': {
                name: 'Mega Factory',
                tier: 4,
                slots: 1000,
                bonus: 1.5,
                cost: 2000000,
                description: 'Massive automated gem cutting facility',
                dimensions: { width: 200, depth: 150 },
                unlockLevel: 75
            },
            'industrial_complex': {
                name: 'Industrial Complex',
                tier: 4,
                slots: 2500,
                bonus: 1.6,
                cost: 10000000,
                description: 'Multiple buildings, thousands of machines',
                dimensions: { width: 300, depth: 250 },
                unlockLevel: 100
            },
            'gembot_empire': {
                name: 'GemBot Empire HQ',
                tier: 4,
                slots: 5000,
                bonus: 2.0,
                cost: 50000000,
                description: 'The ultimate gem cutting empire - legendary status',
                dimensions: { width: 500, depth: 400 },
                unlockLevel: 150
            }
        };
        
        // Track which tier locations player has unlocked
        this.locationTiers = {
            1: ['home_desk'],  // Start with home desk
            2: [],
            3: [],
            4: []
        };
        
        // ==================== REALISTIC GEM CUTTING DATA ====================
        // Based on actual faceting: hardness affects cut time, complexity affects stages
        
        // Mohs hardness scale affects cutting time significantly
        // Harder stones = more time on each lap
        this.gemTypes = [
            { 
                name: 'Quartz (Amethyst)', 
                value: 15, 
                color: '#8000ff', 
                rarity: 'common',
                hardness: 7,           // Mohs scale
                complexity: 'simple',  // 32 facets standard
                facetCount: 32,
                fragility: 0.1,        // 10% chance of issues
                description: 'Good starter stone, forgiving material'
            },
            { 
                name: 'Quartz (Citrine)', 
                value: 12, 
                color: '#ffaa00', 
                rarity: 'common',
                hardness: 7,
                complexity: 'simple',
                facetCount: 32,
                fragility: 0.1,
                description: 'Warm colored quartz, easy to cut'
            },
            { 
                name: 'Garnet', 
                value: 20, 
                color: '#8b0000', 
                rarity: 'common',
                hardness: 7.5,
                complexity: 'simple',
                facetCount: 48,
                fragility: 0.15,
                description: 'Classic red gem, slightly harder'
            },
            { 
                name: 'Topaz', 
                value: 35, 
                color: '#ffd700', 
                rarity: 'uncommon',
                hardness: 8,
                complexity: 'medium',
                facetCount: 57,
                fragility: 0.2,        // Perfect cleavage = risky
                description: 'Beautiful but has perfect cleavage - handle with care!'
            },
            { 
                name: 'Emerald', 
                value: 80, 
                color: '#00ff80', 
                rarity: 'uncommon',
                hardness: 7.5,
                complexity: 'medium',
                facetCount: 48,
                fragility: 0.25,       // Inclusions make it fragile
                description: 'Precious but included - high risk of fracture'
            },
            { 
                name: 'Ruby', 
                value: 120, 
                color: '#ff0040', 
                rarity: 'rare',
                hardness: 9,           // Corundum
                complexity: 'complex',
                facetCount: 64,
                fragility: 0.05,       // Very durable
                description: 'Second hardest gem - takes time but very durable'
            },
            { 
                name: 'Sapphire', 
                value: 150, 
                color: '#0080ff', 
                rarity: 'rare',
                hardness: 9,
                complexity: 'complex',
                facetCount: 64,
                fragility: 0.05,
                description: 'Corundum like ruby - requires patience'
            },
            { 
                name: 'Opal', 
                value: 100, 
                color: '#ff80ff', 
                rarity: 'rare',
                hardness: 5.5,         // Soft!
                complexity: 'special', // Cabochon usually
                facetCount: 0,         // Usually cabochon cut
                fragility: 0.4,        // Very fragile, heat sensitive
                description: 'Delicate! Soft, heat-sensitive, requires special care'
            },
            { 
                name: 'Diamond', 
                value: 500, 
                color: '#ffffff', 
                rarity: 'legendary',
                hardness: 10,          // Hardest
                complexity: 'master',
                facetCount: 57,        // Brilliant cut
                fragility: 0.08,       // Cleavage planes
                description: 'Ultimate challenge - hardest material, cleavage planes'
            },
            { 
                name: 'Alexandrite', 
                value: 1000, 
                color: '#00ffff', 
                rarity: 'legendary',
                hardness: 8.5,
                complexity: 'master',
                facetCount: 72,
                fragility: 0.12,
                description: 'Color-changing chrysoberyl - extremely rare and valuable'
            }
        ];
        
        // ==================== CUTTING STAGES & TIMING ====================
        // Based on actual GemBot process: prep → shape → cut → polish → transfer → repeat
        // Times in game-seconds (1 game-second = 1/60 real second with acceleration)
        
        this.cuttingStages = {
            // PREPARATION (Human interaction required)
            'prep_rough': {
                name: 'Inspect & Prep Rough',
                description: 'Examine rough stone, plan orientation, clean material',
                baseTime: 120,  // 2 min game time
                humanRequired: true,
                canFail: false
            },
            'dop_stone': {
                name: 'Dop the Stone',
                description: 'Heat dop wax, attach stone to dop stick, align properly',
                baseTime: 180,  // 3 min game time
                humanRequired: true,
                canFail: true,
                failureType: 'dop_failure',
                failureChance: 0.02 // 2% base chance
            },
            'mount_chuck': {
                name: 'Mount in Chuck',
                description: 'Insert dop into machine chuck, verify alignment',
                baseTime: 60,   // 1 min game time
                humanRequired: true,
                canFail: false
            },
            
            // PREFORM PAVILION (Machine + human monitoring)
            'preform_girdle': {
                name: 'Preform Girdle',
                description: 'Shape the outline at 90° using coarse lap',
                baseTime: 300,  // 5 min - 96 index positions, rough shaping
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: 'coarse'
            },
            'preform_pavilion': {
                name: 'Preform Pavilion Point',
                description: 'Cut pavilion to a point at ~42° angle',
                baseTime: 240,  // 4 min
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: 'coarse'
            },
            
            // CUT PAVILION FACETS (Progressive laps)
            'cut_pavilion_600': {
                name: 'Cut Pavilion (600 grit)',
                description: 'Cut main pavilion facets with 600 grit lap',
                baseTime: 480,  // 8 min - based on 40 steps/mm, multiple angles
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: '600_grit'
            },
            'cut_pavilion_800': {
                name: 'Refine Pavilion (800 grit)',
                description: 'Remove 600 grit scratches, refine facets',
                baseTime: 360,  // 6 min
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: '800_grit'
            },
            'cut_pavilion_1200': {
                name: 'Pre-polish Pavilion (1200 grit)',
                description: 'Final cutting lap, prepare for polish',
                baseTime: 300,  // 5 min
                humanRequired: false,
                canFail: false,
                lapType: '1200_grit'
            },
            
            // POLISH PAVILION (Diamond paste progression)
            'polish_pavilion_8k': {
                name: 'Polish Pavilion (8,000 grit)',
                description: 'Begin polish sequence with 8k diamond paste on copper lap',
                baseTime: 420,  // 7 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_8k'
            },
            'polish_pavilion_14k': {
                name: 'Polish Pavilion (14,000 grit)',
                description: 'Continue polish with 14k paste',
                baseTime: 360,  // 6 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_14k'
            },
            'polish_pavilion_50k': {
                name: 'Polish Pavilion (50,000 grit)',
                description: 'High polish with 50k paste',
                baseTime: 300,  // 5 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_50k'
            },
            'polish_pavilion_100k': {
                name: 'Polish Pavilion (100,000 grit)',
                description: 'Near-final polish with 100k paste',
                baseTime: 300,  // 5 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_100k'
            },
            'polish_pavilion_200k': {
                name: 'Final Polish Pavilion (200,000 grit)',
                description: 'Mirror finish with 200k paste',
                baseTime: 240,  // 4 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_200k'
            },
            
            // TRANSFER (Critical human step - high failure risk)
            'remove_from_machine': {
                name: 'Remove from Machine',
                description: 'Carefully remove dop from chuck',
                baseTime: 60,
                humanRequired: true,
                canFail: false
            },
            'transfer_dop': {
                name: 'Transfer to Crown Dop',
                description: 'Heat transfer - align pavilion, attach crown dop, release old dop',
                baseTime: 300,  // 5 min - CRITICAL STEP
                humanRequired: true,
                canFail: true,
                failureType: 'transfer_failure',
                failureChance: 0.05 // 5% base chance - this is where stones are often lost!
            },
            'remount_chuck': {
                name: 'Remount for Crown',
                description: 'Insert crown dop, verify alignment to pavilion',
                baseTime: 120,
                humanRequired: true,
                canFail: true,
                failureType: 'alignment_failure',
                failureChance: 0.03
            },
            
            // CUT CROWN (Same progression as pavilion)
            'preform_crown': {
                name: 'Preform Crown',
                description: 'Shape crown angle at ~42°',
                baseTime: 240,
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: 'coarse'
            },
            'cut_table': {
                name: 'Cut Table Facet',
                description: 'Flatten table at 0° angle',
                baseTime: 180,  // 3 min
                humanRequired: false,
                canFail: false,
                lapType: '600_grit'
            },
            'cut_crown_600': {
                name: 'Cut Crown (600 grit)',
                description: 'Cut crown mains and star facets',
                baseTime: 540,  // 9 min - more facets than pavilion typically
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: '600_grit'
            },
            'cut_crown_800': {
                name: 'Refine Crown (800 grit)',
                description: 'Remove scratches from crown',
                baseTime: 420,
                humanRequired: false,
                canFail: false,
                lapType: '800_grit'
            },
            'cut_crown_1200': {
                name: 'Pre-polish Crown (1200 grit)',
                description: 'Prepare crown for polish',
                baseTime: 360,
                humanRequired: false,
                canFail: false,
                lapType: '1200_grit'
            },
            
            // POLISH CROWN
            'polish_crown_8k': {
                name: 'Polish Crown (8,000 grit)',
                description: 'Begin crown polish with 8k paste',
                baseTime: 480,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_8k'
            },
            'polish_crown_14k': {
                name: 'Polish Crown (14,000 grit)',
                description: 'Continue with 14k paste',
                baseTime: 420,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_14k'
            },
            'polish_crown_50k': {
                name: 'Polish Crown (50,000 grit)',
                description: 'High polish crown',
                baseTime: 360,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_50k'
            },
            'polish_crown_100k': {
                name: 'Polish Crown (100,000 grit)',
                description: 'Near-final crown polish',
                baseTime: 300,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_100k'
            },
            'polish_crown_200k': {
                name: 'Final Polish Crown (200,000 grit)',
                description: 'Mirror finish on crown',
                baseTime: 240,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_200k'
            },
            
            // COMPLETION
            'final_remove': {
                name: 'Remove Finished Stone',
                description: 'Heat dop, carefully remove completed gemstone',
                baseTime: 180,
                humanRequired: true,
                canFail: true,
                failureType: 'removal_chip',
                failureChance: 0.01 // 1% chance of chipping on removal
            },
            'clean_inspect': {
                name: 'Clean & Inspect',
                description: 'Clean stone, inspect for quality, grade the cut',
                baseTime: 120,
                humanRequired: true,
                canFail: false
            }
        };
        
        // Stage order for complete cut
        this.stageOrder = [
            'prep_rough', 'dop_stone', 'mount_chuck',
            'preform_girdle', 'preform_pavilion',
            'cut_pavilion_600', 'cut_pavilion_800', 'cut_pavilion_1200',
            'polish_pavilion_8k', 'polish_pavilion_14k', 'polish_pavilion_50k', 
            'polish_pavilion_100k', 'polish_pavilion_200k',
            'remove_from_machine', 'transfer_dop', 'remount_chuck',
            'preform_crown', 'cut_table',
            'cut_crown_600', 'cut_crown_800', 'cut_crown_1200',
            'polish_crown_8k', 'polish_crown_14k', 'polish_crown_50k',
            'polish_crown_100k', 'polish_crown_200k',
            'final_remove', 'clean_inspect'
        ];
        
        // Calculate total base time for a simple stone (in game-seconds)
        // Sum of all stages = ~7200 game-seconds = 2 hours real time (accelerated)
        // With 60x acceleration = ~2 minutes real time for a simple stone
        
        // 3D scene objects
        this.sceneObjects = {
            machines: [],
            gemstones: [],
            environment: null
        };
        
        // Game loop
        this.gameLoop = null;
        this.lastTick = Date.now();
        this.isPaused = false;
        
        // Real machine connection
        this.realMachineConnected = false;
        
        // Callbacks
        this.onGemCut = null;
        this.onLevelUp = null;
        this.onAchievement = null;
        this.onUIUpdate = null;
        
        // Load saved state
        this.loadState();
    }
    
    /**
     * Initialize the game with Babylon.js scene
     */
    async initialize(canvasId = 'game-canvas') {
        try {
            console.log('🎮 Initializing GemBot Farm...');
            
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Game canvas not found');
                return false;
            }
            
            // Wait for Babylon.js
            let retries = 0;
            while (typeof BABYLON === 'undefined' && retries < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }
            
            if (typeof BABYLON === 'undefined') {
                console.error('Babylon.js not loaded');
                return false;
            }
            
            // Create engine
            this.engine = new BABYLON.Engine(this.canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });
            
            // Create scene
            await this.createScene();
            
            // Start render loop
            this.engine.runRenderLoop(() => {
                if (this.scene && !this.isPaused) {
                    this.scene.render();
                }
            });
            
            // Handle resize
            window.addEventListener('resize', () => {
                this.engine.resize();
            });
            
            // Start game loop
            this.startGameLoop();
            
            // Ensure player has at least one machine
            if (this.state.machines.length === 0) {
                this.addMachine('gembot_basic', 'home_desk');
            }
            
            // Initialize Merlin AI integration
            this.initializeMerlin();
            
            console.log('✅ GemBot Farm ready!');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            return false;
        }
    }
    
    /**
     * Create the cyberpunk game scene with first-person camera
     */
    async createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        
        // Dark cyberpunk background
        this.scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.05, 1);
        
        // First-person camera - player stands at proper height to see workbench
        this.camera = new BABYLON.UniversalCamera(
            'firstPersonCam',
            new BABYLON.Vector3(0, 2.2, 6),  // Higher eye level (2.2m) to see tables clearly
            this.scene
        );
        this.camera.attachControl(this.canvas, true);
        
        // WASD + Arrow keys for movement
        this.camera.keysUp = [87, 38];       // W, Up
        this.camera.keysDown = [83, 40];     // S, Down
        this.camera.keysLeft = [65, 37];     // A, Left
        this.camera.keysRight = [68, 39];    // D, Right
        
        // Camera settings - FASTER movement for better feel
        this.camera.speed = 0.8;  // Much faster movement
        this.camera.angularSensibility = 1500;  // More responsive look
        this.camera.inertia = 0.5;  // Less floaty
        this.camera.minZ = 0.1;
        
        // Look at the work area
        this.camera.setTarget(new BABYLON.Vector3(0, 1.5, 0));
        
        // Enable gravity and collision for proper indoor movement
        this.scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
        this.camera.checkCollisions = true;
        this.scene.collisionsEnabled = true;
        
        // Store movement state for on-screen controls
        this.movementState = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        
        // Create on-screen movement controls
        this.createMovementControls();
        
        // Cyberpunk lighting - ambient
        const mainLight = new BABYLON.HemisphericLight(
            'mainLight',
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        mainLight.intensity = 0.4;
        mainLight.diffuse = new BABYLON.Color3(0.8, 0.8, 1);
        mainLight.groundColor = new BABYLON.Color3(0.1, 0, 0.15);
        
        // Neon accent lights inside the room
        this.createNeonLight('neon1', -5, 2.5, 4, new BABYLON.Color3(1, 0, 0.5));
        this.createNeonLight('neon2', 5, 2.5, 4, new BABYLON.Color3(0, 1, 1));
        this.createNeonLight('neon3', -5, 2.5, -4, new BABYLON.Color3(0.5, 0, 1));
        this.createNeonLight('neon4', 5, 2.5, -4, new BABYLON.Color3(1, 0.5, 0));
        
        // Create environment
        await this.createEnvironment();
        
        // Create initial machines
        this.renderMachines();
        
        // Add particle effects
        this.createAmbientParticles();
        
        // Handle on-screen control updates in render loop
        this.scene.registerBeforeRender(() => {
            this.updateMovementFromControls();
        });
        
        console.log('🎨 First-person scene created');
    }
    
    /**
     * Create on-screen movement controls (arrow buttons)
     */
    createMovementControls() {
        // Create control container
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'movement-controls';
        controlsDiv.innerHTML = `
            <style>
                #movement-controls {
                    position: absolute;
                    bottom: 100px;
                    left: 20px;
                    z-index: 1000;
                    user-select: none;
                    touch-action: none;
                }
                .move-btn-row {
                    display: flex;
                    justify-content: center;
                    gap: 5px;
                    margin: 3px 0;
                }
                .move-btn {
                    width: 50px;
                    height: 50px;
                    background: rgba(0, 255, 255, 0.2);
                    border: 2px solid rgba(0, 255, 255, 0.6);
                    border-radius: 8px;
                    color: #0ff;
                    font-size: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.15s;
                }
                .move-btn:hover, .move-btn.active {
                    background: rgba(0, 255, 255, 0.4);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                }
                .move-btn:active, .move-btn.pressed {
                    background: rgba(0, 255, 255, 0.6);
                    transform: scale(0.95);
                }
                .move-spacer {
                    width: 50px;
                    height: 50px;
                }
                #look-hint {
                    position: absolute;
                    bottom: -50px;
                    left: 0;
                    color: rgba(0, 255, 255, 0.7);
                    font-size: 11px;
                    font-family: monospace;
                    white-space: nowrap;
                }
            </style>
            <div class="move-btn-row">
                <div class="move-spacer"></div>
                <button class="move-btn" id="btn-forward">▲</button>
                <div class="move-spacer"></div>
            </div>
            <div class="move-btn-row">
                <button class="move-btn" id="btn-left">◄</button>
                <button class="move-btn" id="btn-backward">▼</button>
                <button class="move-btn" id="btn-right">►</button>
            </div>
            <div id="look-hint">🖱️ Drag to look | WASD to move</div>
        `;
        
        // Append to game canvas parent
        const canvasParent = this.canvas.parentElement;
        if (canvasParent) {
            canvasParent.style.position = 'relative';
            canvasParent.appendChild(controlsDiv);
        }
        
        // Bind button events after DOM is ready
        setTimeout(() => {
            this.bindMovementButton('btn-forward', 'forward');
            this.bindMovementButton('btn-backward', 'backward');
            this.bindMovementButton('btn-left', 'left');
            this.bindMovementButton('btn-right', 'right');
        }, 100);
    }
    
    /**
     * Bind movement button to state
     */
    bindMovementButton(buttonId, direction) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        
        const startMove = (e) => {
            e.preventDefault();
            this.movementState[direction] = true;
            btn.classList.add('pressed');
        };
        
        const stopMove = (e) => {
            e.preventDefault();
            this.movementState[direction] = false;
            btn.classList.remove('pressed');
        };
        
        // Mouse events
        btn.addEventListener('mousedown', startMove);
        btn.addEventListener('mouseup', stopMove);
        btn.addEventListener('mouseleave', stopMove);
        
        // Touch events for mobile
        btn.addEventListener('touchstart', startMove);
        btn.addEventListener('touchend', stopMove);
        btn.addEventListener('touchcancel', stopMove);
    }
    
    /**
     * Update camera movement from on-screen controls
     */
    updateMovementFromControls() {
        if (!this.camera || !this.movementState) return;
        
        const speed = 0.35;  // Much faster on-screen control movement
        const forward = this.camera.getDirection(BABYLON.Vector3.Forward());
        const right = this.camera.getDirection(BABYLON.Vector3.Right());
        
        // Zero out Y component for horizontal movement only
        forward.y = 0;
        forward.normalize();
        right.y = 0;
        right.normalize();
        
        if (this.movementState.forward) {
            this.camera.position.addInPlace(forward.scale(speed));
        }
        if (this.movementState.backward) {
            this.camera.position.addInPlace(forward.scale(-speed));
        }
        if (this.movementState.left) {
            this.camera.position.addInPlace(right.scale(-speed));
        }
        if (this.movementState.right) {
            this.camera.position.addInPlace(right.scale(speed));
        }
        
        // Keep player inside room bounds
        const bounds = { minX: -6, maxX: 6, minZ: -6, maxZ: 10 };
        this.camera.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, this.camera.position.x));
        this.camera.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, this.camera.position.z));
        this.camera.position.y = 2.2; // Lock to proper eye height above tables
    }
    
    /**
     * Create a neon point light
     */
    createNeonLight(name, x, y, z, color) {
        const light = new BABYLON.PointLight(name, new BABYLON.Vector3(x, y, z), this.scene);
        light.diffuse = color;
        light.intensity = 2;
        light.range = 25;
        
        // Create glow sphere
        const glowSphere = BABYLON.MeshBuilder.CreateSphere(
            name + '_glow',
            { diameter: 0.5 },
            this.scene
        );
        glowSphere.position = new BABYLON.Vector3(x, y, z);
        
        const glowMat = new BABYLON.StandardMaterial(name + '_mat', this.scene);
        glowMat.emissiveColor = color;
        glowSphere.material = glowMat;
        
        return light;
    }
    
    /**
     * Create the game environment - enclosed workshop room
     */
    async createEnvironment() {
        // Room dimensions
        const roomWidth = 14;
        const roomDepth = 14;
        const roomHeight = 4;
        
        // Floor with cyberpunk grid pattern
        const floor = BABYLON.MeshBuilder.CreateGround(
            'floor',
            { width: roomWidth, height: roomDepth },
            this.scene
        );
        floor.position.y = 0;
        floor.checkCollisions = true;
        
        const floorMat = new BABYLON.StandardMaterial('floorMat', this.scene);
        floorMat.diffuseColor = new BABYLON.Color3(0.08, 0.08, 0.12);
        floorMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.2);
        
        // Create grid texture for floor
        const gridTexture = new BABYLON.DynamicTexture('gridTex', 512, this.scene);
        const ctx = gridTexture.getContext();
        ctx.fillStyle = '#101018';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i <= 512; i += 32) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }
        gridTexture.update();
        floorMat.diffuseTexture = gridTexture;
        floor.material = floorMat;
        
        // Ceiling
        const ceiling = BABYLON.MeshBuilder.CreateGround(
            'ceiling',
            { width: roomWidth, height: roomDepth },
            this.scene
        );
        ceiling.position.y = roomHeight;
        ceiling.rotation.x = Math.PI;
        
        const ceilingMat = new BABYLON.StandardMaterial('ceilingMat', this.scene);
        ceilingMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.08);
        ceilingMat.backFaceCulling = false;
        ceiling.material = ceilingMat;
        
        // Create walls
        this.createWalls(roomWidth, roomDepth, roomHeight);
        
        // Create workbench with GemBot tables in center
        this.createWorkbench(roomWidth, roomDepth);
        
        // Create computer stations along walls
        this.createComputerStations(roomWidth, roomDepth);
        
        // Neon strips on walls
        this.createNeonStrips(roomWidth, roomDepth, roomHeight);
        
        // Overhead lighting
        this.createOverheadLights(roomWidth, roomDepth);
        
        // Create interactive doors to other rooms
        this.createDoors(roomWidth, roomDepth, roomHeight);
        
        // Holographic title
        this.createHolographicText();
        
        console.log('🏠 Workshop room created');
    }
    
    /**
     * Create room walls with windows/panels
     */
    createWalls(roomWidth, roomDepth, roomHeight) {
        const wallThickness = 0.2;
        const wallMat = new BABYLON.StandardMaterial('wallMat', this.scene);
        wallMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.15);
        wallMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.08);
        
        // Back wall (negative Z)
        const backWall = BABYLON.MeshBuilder.CreateBox('backWall', {
            width: roomWidth, height: roomHeight, depth: wallThickness
        }, this.scene);
        backWall.position = new BABYLON.Vector3(0, roomHeight/2, -roomDepth/2);
        backWall.material = wallMat;
        backWall.checkCollisions = true;
        
        // Front wall (positive Z) - with door opening
        const frontWallLeft = BABYLON.MeshBuilder.CreateBox('frontWallLeft', {
            width: roomWidth/2 - 1, height: roomHeight, depth: wallThickness
        }, this.scene);
        frontWallLeft.position = new BABYLON.Vector3(-roomWidth/4 - 0.5, roomHeight/2, roomDepth/2);
        frontWallLeft.material = wallMat;
        frontWallLeft.checkCollisions = true;
        
        const frontWallRight = BABYLON.MeshBuilder.CreateBox('frontWallRight', {
            width: roomWidth/2 - 1, height: roomHeight, depth: wallThickness
        }, this.scene);
        frontWallRight.position = new BABYLON.Vector3(roomWidth/4 + 0.5, roomHeight/2, roomDepth/2);
        frontWallRight.material = wallMat;
        frontWallRight.checkCollisions = true;
        
        // Door frame top
        const doorTop = BABYLON.MeshBuilder.CreateBox('doorTop', {
            width: 2, height: roomHeight - 2.5, depth: wallThickness
        }, this.scene);
        doorTop.position = new BABYLON.Vector3(0, roomHeight - (roomHeight - 2.5)/2, roomDepth/2);
        doorTop.material = wallMat;
        doorTop.checkCollisions = true;
        
        // Left wall - split into sections with door opening at z=-2
        const leftWallFront = BABYLON.MeshBuilder.CreateBox('leftWallFront', {
            width: wallThickness, height: roomHeight, depth: roomDepth/2 - 3
        }, this.scene);
        leftWallFront.position = new BABYLON.Vector3(-roomWidth/2, roomHeight/2, roomDepth/4 + 0.5);
        leftWallFront.material = wallMat;
        leftWallFront.checkCollisions = true;
        
        const leftWallBack = BABYLON.MeshBuilder.CreateBox('leftWallBack', {
            width: wallThickness, height: roomHeight, depth: roomDepth/2 - 3
        }, this.scene);
        leftWallBack.position = new BABYLON.Vector3(-roomWidth/2, roomHeight/2, -roomDepth/4 - 0.5);
        leftWallBack.material = wallMat;
        leftWallBack.checkCollisions = true;
        
        const leftDoorTop = BABYLON.MeshBuilder.CreateBox('leftDoorTop', {
            width: wallThickness, height: roomHeight - 2.5, depth: 2
        }, this.scene);
        leftDoorTop.position = new BABYLON.Vector3(-roomWidth/2, roomHeight - (roomHeight - 2.5)/2, -2);
        leftDoorTop.material = wallMat;
        leftDoorTop.checkCollisions = true;
        
        // Right wall - split into sections with door opening at z=-2
        const rightWallFront = BABYLON.MeshBuilder.CreateBox('rightWallFront', {
            width: wallThickness, height: roomHeight, depth: roomDepth/2 - 3
        }, this.scene);
        rightWallFront.position = new BABYLON.Vector3(roomWidth/2, roomHeight/2, roomDepth/4 + 0.5);
        rightWallFront.material = wallMat;
        rightWallFront.checkCollisions = true;
        
        const rightWallBack = BABYLON.MeshBuilder.CreateBox('rightWallBack', {
            width: wallThickness, height: roomHeight, depth: roomDepth/2 - 3
        }, this.scene);
        rightWallBack.position = new BABYLON.Vector3(roomWidth/2, roomHeight/2, -roomDepth/4 - 0.5);
        rightWallBack.material = wallMat;
        rightWallBack.checkCollisions = true;
        
        const rightDoorTop = BABYLON.MeshBuilder.CreateBox('rightDoorTop', {
            width: wallThickness, height: roomHeight - 2.5, depth: 2
        }, this.scene);
        rightDoorTop.position = new BABYLON.Vector3(roomWidth/2, roomHeight - (roomHeight - 2.5)/2, -2);
        rightDoorTop.material = wallMat;
        rightDoorTop.checkCollisions = true;
        
        // Add window panels on back wall
        this.createWindowPanels(roomWidth, roomDepth, roomHeight);
    }
    
    /**
     * Create glowing window panels
     */
    createWindowPanels(roomWidth, roomDepth, roomHeight) {
        const windowMat = new BABYLON.StandardMaterial('windowMat', this.scene);
        windowMat.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.3);
        windowMat.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.15);
        windowMat.alpha = 0.8;
        
        // Three windows on back wall
        for (let i = -1; i <= 1; i++) {
            const window = BABYLON.MeshBuilder.CreateBox(`window_${i}`, {
                width: 2.5, height: 1.5, depth: 0.05
            }, this.scene);
            window.position = new BABYLON.Vector3(i * 4, 2.5, -roomDepth/2 + 0.15);
            window.material = windowMat;
        }
    }
    
    /**
     * Create central workbench with GemBot placement areas
     */
    createWorkbench(roomWidth, roomDepth) {
        // Main workbench table in center
        const benchWidth = 8;
        const benchDepth = 3;
        const benchHeight = 0.9;
        
        const bench = BABYLON.MeshBuilder.CreateBox('workbench', {
            width: benchWidth, height: 0.1, depth: benchDepth
        }, this.scene);
        bench.position = new BABYLON.Vector3(0, benchHeight, 0);
        
        const benchMat = new BABYLON.StandardMaterial('benchMat', this.scene);
        benchMat.diffuseColor = new BABYLON.Color3(0.2, 0.18, 0.15);
        benchMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        bench.material = benchMat;
        
        // Bench legs
        const legPositions = [
            {x: -benchWidth/2 + 0.2, z: -benchDepth/2 + 0.2},
            {x: benchWidth/2 - 0.2, z: -benchDepth/2 + 0.2},
            {x: -benchWidth/2 + 0.2, z: benchDepth/2 - 0.2},
            {x: benchWidth/2 - 0.2, z: benchDepth/2 - 0.2}
        ];
        
        const legMat = new BABYLON.StandardMaterial('legMat', this.scene);
        legMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.18);
        
        legPositions.forEach((pos, i) => {
            const leg = BABYLON.MeshBuilder.CreateBox(`benchLeg_${i}`, {
                width: 0.1, height: benchHeight, depth: 0.1
            }, this.scene);
            leg.position = new BABYLON.Vector3(pos.x, benchHeight/2, pos.z);
            leg.material = legMat;
        });
        
        // GemBot slot indicators on the bench (where machines go)
        const slotCount = 4;
        const slotSpacing = benchWidth / (slotCount + 1);
        
        for (let i = 0; i < slotCount; i++) {
            const x = -benchWidth/2 + slotSpacing * (i + 1);
            
            // Slot platform
            const slot = BABYLON.MeshBuilder.CreateBox(`machineSlot_${i}`, {
                width: 1.2, height: 0.05, depth: 1.2
            }, this.scene);
            slot.position = new BABYLON.Vector3(x, benchHeight + 0.08, 0);
            
            const slotMat = new BABYLON.StandardMaterial(`slotMat_${i}`, this.scene);
            slotMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.12);
            slotMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0.3);
            slot.material = slotMat;
            
            // Indicator light
            const indicator = BABYLON.MeshBuilder.CreateBox(`indicator_${i}`, {
                width: 0.3, height: 0.03, depth: 0.3
            }, this.scene);
            indicator.position = new BABYLON.Vector3(x, benchHeight + 0.12, 0);
            
            const indicatorMat = new BABYLON.StandardMaterial(`indicatorMat_${i}`, this.scene);
            indicatorMat.emissiveColor = new BABYLON.Color3(0.2, 0.8, 0.2);
            indicator.material = indicatorMat;
        }
        
        // ===== WATER STATION (on the right side of bench) =====
        this.createWaterStation(benchWidth/2 + 1.5, 0, benchDepth/2);
    }
    
    /**
     * Create interactive water refill station
     * Includes faucet, water tank/reservoir, and auto-refill upgrade slot
     */
    createWaterStation(x, y, z) {
        const stationRoot = new BABYLON.TransformNode('waterStation', this.scene);
        stationRoot.position = new BABYLON.Vector3(x, y, z);
        
        // ===== SINK BASIN =====
        const basinMat = new BABYLON.StandardMaterial('basinMat', this.scene);
        basinMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.72);
        basinMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.95);
        
        const basin = BABYLON.MeshBuilder.CreateBox('sinkBasin', {
            width: 1.2, height: 0.3, depth: 0.8
        }, this.scene);
        basin.parent = stationRoot;
        basin.position.y = 0.85;
        basin.material = basinMat;
        
        // Basin interior (darker)
        const basinInner = BABYLON.MeshBuilder.CreateBox('sinkInner', {
            width: 1.0, height: 0.25, depth: 0.6
        }, this.scene);
        basinInner.parent = stationRoot;
        basinInner.position.y = 0.9;
        const innerMat = new BABYLON.StandardMaterial('basinInnerMat', this.scene);
        innerMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32);
        basinInner.material = innerMat;
        
        // ===== FAUCET =====
        // Faucet stem
        const faucetStem = BABYLON.MeshBuilder.CreateCylinder('faucetStem', {
            height: 0.5, diameter: 0.08
        }, this.scene);
        faucetStem.parent = stationRoot;
        faucetStem.position = new BABYLON.Vector3(-0.3, 1.25, -0.2);
        
        const faucetMat = new BABYLON.StandardMaterial('faucetMat', this.scene);
        faucetMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.8);
        faucetMat.specularColor = new BABYLON.Color3(1, 1, 1);
        faucetMat.specularPower = 64;
        faucetStem.material = faucetMat;
        
        // Faucet spout (curved pipe)
        const spout = BABYLON.MeshBuilder.CreateTorus('faucetSpout', {
            diameter: 0.3, thickness: 0.04, arc: 0.5
        }, this.scene);
        spout.parent = stationRoot;
        spout.position = new BABYLON.Vector3(-0.3, 1.5, -0.05);
        spout.rotation.x = Math.PI / 2;
        spout.rotation.z = Math.PI;
        spout.material = faucetMat;
        
        // Faucet handle
        const handle = BABYLON.MeshBuilder.CreateBox('faucetHandle', {
            width: 0.15, height: 0.05, depth: 0.03
        }, this.scene);
        handle.parent = stationRoot;
        handle.position = new BABYLON.Vector3(-0.3, 1.55, -0.2);
        handle.material = faucetMat;
        
        // ===== WATER RESERVOIR TANK (transparent with water level) =====
        const tankMat = new BABYLON.StandardMaterial('tankMat', this.scene);
        tankMat.diffuseColor = new BABYLON.Color3(0.4, 0.5, 0.6);
        tankMat.alpha = 0.4;
        tankMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.9);
        
        const tank = BABYLON.MeshBuilder.CreateCylinder('waterTank', {
            height: 1.0, diameter: 0.6
        }, this.scene);
        tank.parent = stationRoot;
        tank.position = new BABYLON.Vector3(0.4, 1.4, 0);
        tank.material = tankMat;
        
        // Water level inside tank (dynamic height based on inventory)
        const waterLevel = this.state.inventory.consumables.water / 100;
        const waterMat = new BABYLON.StandardMaterial('waterMat', this.scene);
        waterMat.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.8);
        waterMat.alpha = 0.7;
        waterMat.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.4);
        
        const water = BABYLON.MeshBuilder.CreateCylinder('waterInTank', {
            height: 0.9 * waterLevel, diameter: 0.55
        }, this.scene);
        water.parent = stationRoot;
        water.position = new BABYLON.Vector3(0.4, 0.95 + (0.45 * waterLevel), 0);
        water.material = waterMat;
        
        // Store reference for updating water level
        this.waterTankMesh = water;
        this.waterTankMat = waterMat;
        this.waterStationRoot = stationRoot;
        
        // ===== WATER LEVEL INDICATOR =====
        // Create label above tank
        const labelPlane = BABYLON.MeshBuilder.CreatePlane('waterLabel', {
            width: 0.8, height: 0.3
        }, this.scene);
        labelPlane.parent = stationRoot;
        labelPlane.position = new BABYLON.Vector3(0.4, 2.1, 0);
        labelPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        
        const labelTex = new BABYLON.DynamicTexture('waterLabelTex', { width: 128, height: 48 }, this.scene);
        this.updateWaterLabel(labelTex);
        
        const labelMat = new BABYLON.StandardMaterial('waterLabelMat', this.scene);
        labelMat.diffuseTexture = labelTex;
        labelMat.emissiveTexture = labelTex;
        labelMat.opacityTexture = labelTex;
        labelMat.backFaceCulling = false;
        labelPlane.material = labelMat;
        
        this.waterLabelTex = labelTex;
        
        // ===== CLICK INTERACTION =====
        // Make faucet and tank clickable
        [faucetStem, spout, handle, tank, basin].forEach(mesh => {
            mesh.isPickable = true;
            mesh.actionManager = new BABYLON.ActionManager(this.scene);
            
            // Hover glow
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    if (faucetMat.emissiveColor) {
                        faucetMat.emissiveColor = new BABYLON.Color3(0.2, 0.4, 0.5);
                    }
                    this.updateWaterLabel(this.waterLabelTex, true); // Show "Click to refill"
                }
            ));
            
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    if (faucetMat.emissiveColor) {
                        faucetMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
                    }
                    this.updateWaterLabel(this.waterLabelTex, false);
                }
            ));
            
            // Click to refill
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    this.onWaterStationClicked();
                }
            ));
        });
        
        this.sceneObjects.waterStation = stationRoot;
        console.log('💧 Created water refill station');
    }
    
    /**
     * Update water level label texture
     */
    updateWaterLabel(texture, showHint = false) {
        if (!texture) return;
        
        const ctx = texture.getContext();
        const waterLevel = this.state.inventory.consumables.water || 0;
        
        // Clear
        ctx.clearRect(0, 0, 128, 48);
        
        // Background
        ctx.fillStyle = 'rgba(0, 30, 50, 0.8)';
        ctx.fillRect(0, 0, 128, 48);
        
        // Border
        const borderColor = waterLevel < 25 ? '#ff4444' : waterLevel < 50 ? '#ffaa00' : '#00ffff';
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 124, 44);
        
        // Water level text
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = borderColor;
        ctx.textAlign = 'center';
        ctx.fillText(`💧 ${Math.round(waterLevel)}%`, 64, 22);
        
        // Hint text
        ctx.font = '10px Arial';
        ctx.fillStyle = showHint ? '#ffffff' : 'rgba(255,255,255,0.5)';
        ctx.fillText(showHint ? 'Click to refill!' : 'Water Tank', 64, 40);
        
        texture.update();
    }
    
    /**
     * Handle water station click - refill water tank
     */
    onWaterStationClicked() {
        const currentWater = this.state.inventory.consumables.water || 0;
        const maxWater = 100 + (this.state.inventory.upgradelevels?.water_tank || 0) * 50;
        
        if (currentWater >= maxWater) {
            console.log('💧 Water tank is full!');
            this.showWaterNotification('Tank Full!', '#00ff88');
            return;
        }
        
        // Refill cost (free basic refill for now, costs scale with upgrades later)
        const refillAmount = 25;
        const newLevel = Math.min(currentWater + refillAmount, maxWater);
        this.state.inventory.consumables.water = newLevel;
        this.state.stats.waterRefills = (this.state.stats.waterRefills || 0) + 1;
        
        console.log(`💧 Water refilled: ${currentWater}% → ${newLevel}%`);
        
        // Update visuals
        this.updateWaterTankVisual();
        this.updateWaterLabel(this.waterLabelTex);
        this.showWaterNotification(`+${refillAmount}% Water`, '#00aaff');
        
        // Animate faucet water flow
        this.animateWaterFlow();
    }
    
    /**
     * Update the water tank visual based on current level
     */
    updateWaterTankVisual() {
        if (!this.waterTankMesh || !this.waterStationRoot) return;
        
        const waterLevel = (this.state.inventory.consumables.water || 0) / 100;
        const maxLevel = 1 + ((this.state.inventory.upgradelevels?.water_tank || 0) * 0.5);
        const normalizedLevel = Math.min(waterLevel / maxLevel, 1);
        
        // Recreate water mesh with new height
        this.waterTankMesh.dispose();
        
        const water = BABYLON.MeshBuilder.CreateCylinder('waterInTank', {
            height: 0.9 * normalizedLevel, diameter: 0.55
        }, this.scene);
        water.parent = this.waterStationRoot;
        water.position = new BABYLON.Vector3(0.4, 0.95 + (0.45 * normalizedLevel), 0);
        water.material = this.waterTankMat;
        
        this.waterTankMesh = water;
    }
    
    /**
     * Animate water flowing from faucet
     */
    animateWaterFlow() {
        if (!this.scene || !this.waterStationRoot) return;
        
        // Create water drop particles
        const emitter = new BABYLON.Vector3(
            this.waterStationRoot.position.x - 0.15,
            this.waterStationRoot.position.y + 1.4,
            this.waterStationRoot.position.z - 0.05
        );
        
        // Create simple water drops
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const drop = BABYLON.MeshBuilder.CreateSphere('waterDrop_' + i, {
                    diameter: 0.05
                }, this.scene);
                drop.position = emitter.clone();
                drop.position.x += (Math.random() - 0.5) * 0.1;
                
                const dropMat = new BABYLON.StandardMaterial('dropMat_' + i, this.scene);
                dropMat.diffuseColor = new BABYLON.Color3(0.3, 0.6, 0.9);
                dropMat.alpha = 0.8;
                drop.material = dropMat;
                
                // Animate drop falling
                let vy = 0;
                const gravity = 0.005;
                const animate = () => {
                    vy += gravity;
                    drop.position.y -= vy;
                    
                    if (drop.position.y > 0.9) {
                        requestAnimationFrame(animate);
                    } else {
                        drop.dispose();
                        dropMat.dispose();
                    }
                };
                requestAnimationFrame(animate);
            }, i * 50);
        }
    }
    
    /**
     * Show floating notification for water actions
     */
    showWaterNotification(text, color) {
        if (!this.scene || !this.waterStationRoot) return;
        
        const plane = BABYLON.MeshBuilder.CreatePlane('waterNotify_' + Date.now(), {
            width: 1.5, height: 0.4
        }, this.scene);
        plane.position = this.waterStationRoot.position.clone();
        plane.position.y += 2.5;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        
        const tex = new BABYLON.DynamicTexture('waterNotifyTex', { width: 192, height: 48 }, this.scene);
        const ctx = tex.getContext();
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 192, 48);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 188, 44);
        
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(text, 96, 32);
        tex.update();
        
        const mat = new BABYLON.StandardMaterial('waterNotifyMat', this.scene);
        mat.diffuseTexture = tex;
        mat.emissiveTexture = tex;
        mat.opacityTexture = tex;
        mat.backFaceCulling = false;
        plane.material = mat;
        
        // Float up and fade
        let alpha = 1;
        const floatUp = () => {
            plane.position.y += 0.02;
            alpha -= 0.015;
            mat.alpha = alpha;
            
            if (alpha > 0) {
                requestAnimationFrame(floatUp);
            } else {
                plane.dispose();
                tex.dispose();
                mat.dispose();
            }
        };
        requestAnimationFrame(floatUp);
    }
    
    /**
     * Create interactive computer stations along walls
     * Each screen links to a different game feature
     */
    createComputerStations(roomWidth, roomDepth) {
        const deskMat = new BABYLON.StandardMaterial('deskMat', this.scene);
        deskMat.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.15);
        
        // Define interactive screens with their functions
        const screenConfigs = [
            // Left wall screens
            { side: 0, idx: 0, icon: '🛒', label: 'SHOP', action: 'openShopPanel', color: new BABYLON.Color3(0.1, 0.4, 0.1) },
            { side: 0, idx: 1, icon: '📦', label: 'INVENTORY', action: 'openInventoryPanel', color: new BABYLON.Color3(0.1, 0.2, 0.4) },
            { side: 0, idx: 2, icon: '🏪', label: 'MARKETPLACE', action: 'openMarketplace', color: new BABYLON.Color3(0.4, 0.2, 0.1) },
            // Right wall screens
            { side: 1, idx: 0, icon: '🤖', label: 'GEMBOT', action: 'closeGameMode', color: new BABYLON.Color3(0, 0.3, 0.4) },
            { side: 1, idx: 1, icon: '📊', label: 'STATS', action: 'showGameStats', color: new BABYLON.Color3(0.3, 0.1, 0.3) },
            { side: 1, idx: 2, icon: '🏠', label: 'ROOMS', action: 'showRoomsPanel', color: new BABYLON.Color3(0.2, 0.3, 0.1) }
        ];
        
        // Store interactive meshes for raycasting
        this.interactiveScreens = [];
        
        const sides = [{x: -roomWidth/2 + 1.5, rotY: Math.PI/2}, {x: roomWidth/2 - 1.5, rotY: -Math.PI/2}];
        
        screenConfigs.forEach(config => {
            const side = sides[config.side];
            const z = -roomDepth/2 + 3 + config.idx * 4;
            
            // Desk
            const desk = BABYLON.MeshBuilder.CreateBox(`desk_${config.side}_${config.idx}`, {
                width: 2, height: 0.05, depth: 1
            }, this.scene);
            desk.position = new BABYLON.Vector3(side.x, 0.75, z);
            desk.material = deskMat;
            
            // Monitor frame
            const monitorFrame = BABYLON.MeshBuilder.CreateBox(`monitorFrame_${config.side}_${config.idx}`, {
                width: 1.3, height: 0.9, depth: 0.08
            }, this.scene);
            monitorFrame.position = new BABYLON.Vector3(side.x + (config.side === 0 ? 0.3 : -0.3), 1.2, z);
            monitorFrame.rotation.y = side.rotY;
            const frameMat = new BABYLON.StandardMaterial(`frameMat_${config.side}_${config.idx}`, this.scene);
            frameMat.diffuseColor = new BABYLON.Color3(0.08, 0.08, 0.1);
            monitorFrame.material = frameMat;
            
            // Interactive screen surface
            const screen = BABYLON.MeshBuilder.CreatePlane(`screen_${config.side}_${config.idx}`, {
                width: 1.2, height: 0.8
            }, this.scene);
            screen.position = new BABYLON.Vector3(
                side.x + (config.side === 0 ? 0.35 : -0.35), 
                1.2, 
                z
            );
            screen.rotation.y = side.rotY;
            
            // Create screen texture with icon and label
            const screenMat = new BABYLON.StandardMaterial(`screenMat_${config.side}_${config.idx}`, this.scene);
            const screenTex = new BABYLON.DynamicTexture(`screenTex_${config.side}_${config.idx}`, {width: 256, height: 180}, this.scene);
            const ctx = screenTex.getContext();
            
            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, `rgb(${Math.floor(config.color.r*60)}, ${Math.floor(config.color.g*60)}, ${Math.floor(config.color.b*60)})`);
            gradient.addColorStop(1, `rgb(${Math.floor(config.color.r*30)}, ${Math.floor(config.color.g*30)}, ${Math.floor(config.color.b*30)})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 180);
            
            // Icon
            ctx.font = '48px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(config.icon, 128, 70);
            
            // Label
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#00ffff';
            ctx.fillText(config.label, 128, 110);
            
            // "Click to open" hint
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText('[ CLICK TO OPEN ]', 128, 150);
            
            screenTex.update();
            
            screenMat.diffuseTexture = screenTex;
            screenMat.emissiveTexture = screenTex;
            screenMat.emissiveColor = config.color.scale(0.5);
            screenMat.backFaceCulling = false;
            screen.material = screenMat;
            
            // Store for interaction
            screen.actionManager = new BABYLON.ActionManager(this.scene);
            screen.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => this.handleScreenClick(config.action, config.label)
            ));
            
            // Hover effect
            screen.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    screenMat.emissiveColor = config.color;
                    document.body.style.cursor = 'pointer';
                }
            ));
            screen.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    screenMat.emissiveColor = config.color.scale(0.5);
                    document.body.style.cursor = 'default';
                }
            ));
            
            this.interactiveScreens.push({ mesh: screen, config });
        });
    }
    
    /**
     * Handle computer screen click
     */
    handleScreenClick(action, label) {
        console.log(`🖥️ Screen clicked: ${label}`);
        
        // Call the appropriate function in the main app
        switch(action) {
            case 'openShopPanel':
                if (typeof openShopPanel === 'function') openShopPanel();
                break;
            case 'openInventoryPanel':
                if (typeof openInventoryPanel === 'function') openInventoryPanel();
                break;
            case 'openMarketplace':
                if (typeof openMarketplace === 'function') openMarketplace();
                else if (typeof window.marketplace?.openMarketplace === 'function') window.marketplace.openMarketplace();
                break;
            case 'closeGameMode':
                if (typeof closeGameMode === 'function') closeGameMode();
                break;
            case 'showGameStats':
                this.showStatsOverlay();
                break;
            case 'showRoomsPanel':
                this.showRoomsOverlay();
                break;
        }
    }
    
    /**
     * Show stats overlay
     */
    showStatsOverlay() {
        const stats = this.state;
        alert(`📊 GemBot Stats\n\nLevel: ${stats.level}\nXP: ${stats.xp}\nCoins: ${stats.coins}\nGems Cut: ${stats.gemsCut || 0}\nMachines: ${stats.machines.length}`);
    }
    
    /**
     * Show rooms overlay  
     */
    showRoomsOverlay() {
        const rooms = Object.entries(this.roomTypes)
            .filter(([key, room]) => room.unlockLevel <= this.state.level)
            .map(([key, room]) => `${room.name} (${room.slots} slots) - ${room.cost === 0 ? 'FREE' : room.cost + ' coins'}`)
            .join('\n');
        alert(`🏠 Available Rooms\n\n${rooms}`);
    }
    
    /**
     * Create doors to other rooms with lock status
     */
    createDoors(roomWidth, roomDepth, roomHeight) {
        // Store doors for interaction
        this.doors = [];
        
        // Door positions - front (main entrance) and side doors
        const doorConfigs = [
            { 
                name: 'main_entrance',
                position: new BABYLON.Vector3(0, 1.25, roomDepth/2 - 0.1),
                rotation: 0,
                targetRoom: null, // Exit to main menu
                label: 'EXIT',
                locked: false,
                keyRequired: null
            },
            {
                name: 'studio_door',
                position: new BABYLON.Vector3(-roomWidth/2 + 0.1, 1.25, -2),
                rotation: Math.PI/2,
                targetRoom: 'home_studio',
                label: 'STUDIO',
                locked: true,
                keyRequired: 'studio_key',
                unlockLevel: 5,
                cost: 500
            },
            {
                name: 'shop_door',
                position: new BABYLON.Vector3(roomWidth/2 - 0.1, 1.25, -2),
                rotation: -Math.PI/2,
                targetRoom: 'small_shop',
                label: 'SHOP',
                locked: true,
                keyRequired: 'shop_key',
                unlockLevel: 8,
                cost: 2000
            }
        ];
        
        doorConfigs.forEach((config, i) => {
            // Check if player has unlocked this door
            const isUnlocked = !config.locked || 
                (this.state.level >= (config.unlockLevel || 1) && 
                 (this.state.unlockedRooms?.includes(config.targetRoom) || !config.cost));
            
            // Door frame
            const frame = BABYLON.MeshBuilder.CreateBox(`doorFrame_${i}`, {
                width: 1.8, height: 2.5, depth: 0.15
            }, this.scene);
            frame.position = config.position.clone();
            frame.position.y = 1.25;
            frame.rotation.y = config.rotation;
            
            const frameMat = new BABYLON.StandardMaterial(`doorFrameMat_${i}`, this.scene);
            frameMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.18);
            frame.material = frameMat;
            
            // Door panel (clickable)
            const door = BABYLON.MeshBuilder.CreateBox(`door_${i}`, {
                width: 1.5, height: 2.3, depth: 0.1
            }, this.scene);
            door.position = config.position.clone();
            door.position.y = 1.15;
            door.rotation.y = config.rotation;
            
            const doorMat = new BABYLON.StandardMaterial(`doorMat_${i}`, this.scene);
            if (isUnlocked) {
                doorMat.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.3);
                doorMat.emissiveColor = new BABYLON.Color3(0.05, 0.15, 0.1);
            } else {
                doorMat.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.2);
                doorMat.emissiveColor = new BABYLON.Color3(0.15, 0.05, 0.05);
            }
            door.material = doorMat;
            
            // Door label sign
            const sign = BABYLON.MeshBuilder.CreatePlane(`doorSign_${i}`, {
                width: 1, height: 0.3
            }, this.scene);
            sign.position = config.position.clone();
            sign.position.y = 2.2;
            sign.rotation.y = config.rotation;
            
            const signTex = new BABYLON.DynamicTexture(`signTex_${i}`, {width: 200, height: 60}, this.scene);
            const ctx = signTex.getContext();
            ctx.fillStyle = isUnlocked ? '#1a3a2a' : '#3a1a1a';
            ctx.fillRect(0, 0, 200, 60);
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = isUnlocked ? '#00ff88' : '#ff4444';
            ctx.textAlign = 'center';
            ctx.fillText(config.label, 100, 25);
            ctx.font = '12px Arial';
            ctx.fillStyle = '#aaaaaa';
            if (!isUnlocked && config.unlockLevel) {
                ctx.fillText(`🔒 Lvl ${config.unlockLevel} | ${config.cost} coins`, 100, 48);
            } else {
                ctx.fillText(isUnlocked ? '[ CLICK TO ENTER ]' : '🔒 LOCKED', 100, 48);
            }
            signTex.update();
            
            const signMat = new BABYLON.StandardMaterial(`signMat_${i}`, this.scene);
            signMat.diffuseTexture = signTex;
            signMat.emissiveTexture = signTex;
            signMat.backFaceCulling = false;
            sign.material = signMat;
            
            // Lock icon if locked
            if (!isUnlocked) {
                const lockIcon = BABYLON.MeshBuilder.CreateBox(`lock_${i}`, {
                    width: 0.2, height: 0.25, depth: 0.05
                }, this.scene);
                lockIcon.position = config.position.clone();
                lockIcon.position.y = 1.4;
                lockIcon.position.addInPlace(new BABYLON.Vector3(
                    Math.sin(config.rotation) * 0.1,
                    0,
                    Math.cos(config.rotation) * 0.1
                ));
                lockIcon.rotation.y = config.rotation;
                
                const lockMat = new BABYLON.StandardMaterial(`lockMat_${i}`, this.scene);
                lockMat.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.1);
                lockMat.emissiveColor = new BABYLON.Color3(0.3, 0.2, 0);
                lockIcon.material = lockMat;
            }
            
            // Door interaction
            door.actionManager = new BABYLON.ActionManager(this.scene);
            door.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => this.handleDoorClick(config, isUnlocked)
            ));
            
            // Hover effects
            door.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    doorMat.emissiveColor = isUnlocked ? 
                        new BABYLON.Color3(0.1, 0.3, 0.2) : 
                        new BABYLON.Color3(0.3, 0.1, 0.1);
                    document.body.style.cursor = 'pointer';
                }
            ));
            door.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    doorMat.emissiveColor = isUnlocked ? 
                        new BABYLON.Color3(0.05, 0.15, 0.1) : 
                        new BABYLON.Color3(0.15, 0.05, 0.05);
                    document.body.style.cursor = 'default';
                }
            ));
            
            this.doors.push({ mesh: door, config, isUnlocked });
        });
    }
    
    /**
     * Handle door click - unlock or enter room
     */
    handleDoorClick(config, isUnlocked) {
        console.log(`🚪 Door clicked: ${config.label}`);
        
        if (config.name === 'main_entrance') {
            // Exit to main GemBot controller
            if (typeof closeGameMode === 'function') {
                closeGameMode();
            }
            return;
        }
        
        if (isUnlocked) {
            // Enter the room
            this.enterRoom(config.targetRoom);
        } else {
            // Show unlock dialog
            this.showUnlockDialog(config);
        }
    }
    
    /**
     * Show unlock dialog for locked doors
     */
    showUnlockDialog(config) {
        const canAfford = this.state.coins >= config.cost;
        const meetsLevel = this.state.level >= config.unlockLevel;
        
        let message = `🚪 ${config.label}\n\n`;
        message += `Required Level: ${config.unlockLevel} ${meetsLevel ? '✅' : '❌ (You: ' + this.state.level + ')'}\n`;
        message += `Cost: ${config.cost} coins ${canAfford ? '✅' : '❌ (You: ' + this.state.coins + ')'}\n\n`;
        
        if (meetsLevel && canAfford) {
            if (confirm(message + 'Unlock this room?')) {
                this.unlockRoom(config);
            }
        } else {
            alert(message + 'Requirements not met!');
        }
    }
    
    /**
     * Unlock a room
     */
    unlockRoom(config) {
        if (!this.state.unlockedRooms) {
            this.state.unlockedRooms = [];
        }
        
        this.state.coins -= config.cost;
        this.state.unlockedRooms.push(config.targetRoom);
        
        // Give the key
        if (!this.state.keys) {
            this.state.keys = [];
        }
        this.state.keys.push(config.keyRequired);
        
        this.saveState();
        
        // Refresh the scene to update door status
        this.addActivityMessage(`🔑 Unlocked ${config.label}!`);
        
        // Rebuild doors to show updated status
        this.rebuildDoors();
    }
    
    /**
     * Rebuild doors after unlock
     */
    rebuildDoors() {
        // Remove existing doors
        if (this.doors) {
            this.doors.forEach(d => {
                d.mesh.dispose();
            });
        }
        
        // Dispose all door-related meshes
        this.scene.meshes
            .filter(m => m.name.startsWith('door') || m.name.startsWith('lock') || m.name.startsWith('sign'))
            .forEach(m => m.dispose());
        
        // Recreate doors
        this.createDoors(14, 14, 4);
    }
    
    /**
     * Enter a different room
     */
    enterRoom(roomKey) {
        const room = this.roomTypes[roomKey];
        if (!room) {
            console.error('Room not found:', roomKey);
            return;
        }
        
        console.log(`🏠 Entering room: ${room.name}`);
        this.addActivityMessage(`🏠 Entered ${room.name}`);
        
        // Update current room
        this.currentRoom = roomKey;
        
        // Save room change
        if (!this.state.rooms) {
            this.state.rooms = [];
        }
        if (!this.state.rooms.includes(roomKey)) {
            this.state.rooms.push(roomKey);
        }
        this.saveState();
        
        // For now, show confirmation - full room transition would rebuild the scene
        alert(`🏠 Welcome to ${room.name}!\n\nSlots: ${room.slots}\nBonus: ${Math.round((room.bonus - 1) * 100)}%\n\n(Full room transitions coming soon!)`);
    }
    
    /**
     * Create neon light strips along walls
     */
    createNeonStrips(roomWidth, roomDepth, roomHeight) {
        const neonMat = new BABYLON.StandardMaterial('neonMat', this.scene);
        neonMat.emissiveColor = new BABYLON.Color3(0, 1, 1);
        neonMat.diffuseColor = new BABYLON.Color3(0, 0.5, 0.5);
        
        // Bottom edge neon strips
        const stripPositions = [
            {x: 0, y: 0.1, z: -roomDepth/2 + 0.15, w: roomWidth - 1, h: 0.05, d: 0.05},
            {x: 0, y: 0.1, z: roomDepth/2 - 0.15, w: roomWidth - 1, h: 0.05, d: 0.05},
            {x: -roomWidth/2 + 0.15, y: 0.1, z: 0, w: 0.05, h: 0.05, d: roomDepth - 1},
            {x: roomWidth/2 - 0.15, y: 0.1, z: 0, w: 0.05, h: 0.05, d: roomDepth - 1}
        ];
        
        stripPositions.forEach((strip, i) => {
            const neonStrip = BABYLON.MeshBuilder.CreateBox(`neonStrip_${i}`, {
                width: strip.w, height: strip.h, depth: strip.d
            }, this.scene);
            neonStrip.position = new BABYLON.Vector3(strip.x, strip.y, strip.z);
            neonStrip.material = neonMat;
        });
    }
    
    /**
     * Create neon strip (helper for old calls)
     */
    createNeonStripOld(x, y, z, width, depth, color) {
        const strip = BABYLON.MeshBuilder.CreateBox(
            'neonStripOld',
            { width, height: 0.1, depth },
            this.scene
        );
        strip.position = new BABYLON.Vector3(x, y, z);
        
        const mat = new BABYLON.StandardMaterial('neonMatOld', this.scene);
        mat.emissiveColor = color;
        mat.diffuseColor = color;
        strip.material = mat;
    }
    
    /**
     * Create overhead work lights
     */
    createOverheadLights(roomWidth, roomDepth) {
        const lightCount = 4;
        const lightSpacing = roomWidth / (lightCount + 1);
        
        for (let i = 0; i < lightCount; i++) {
            const x = -roomWidth/2 + lightSpacing * (i + 1);
            
            // Light fixture housing
            const fixture = BABYLON.MeshBuilder.CreateBox(
                `lightFixture_${i}`,
                { width: 1.5, height: 0.15, depth: 0.4 },
                this.scene
            );
            fixture.position = new BABYLON.Vector3(x, 5, 0);
            
            const fixtureMat = new BABYLON.StandardMaterial(`fixtureMat_${i}`, this.scene);
            fixtureMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            fixture.material = fixtureMat;
            
            // Light panel (emissive)
            const lightPanel = BABYLON.MeshBuilder.CreateBox(
                `lightPanel_${i}`,
                { width: 1.4, height: 0.05, depth: 0.35 },
                this.scene
            );
            lightPanel.position = new BABYLON.Vector3(x, 4.9, 0);
            
            const lightMat = new BABYLON.StandardMaterial(`lightMat_${i}`, this.scene);
            lightMat.emissiveColor = new BABYLON.Color3(1, 0.98, 0.95);
            lightMat.diffuseColor = new BABYLON.Color3(1, 0.98, 0.95);
            lightPanel.material = lightMat;
            
            // Actual point light
            const light = new BABYLON.PointLight(
                `workLight_${i}`,
                new BABYLON.Vector3(x, 4.5, 0),
                this.scene
            );
            light.intensity = 0.4;
            light.diffuse = new BABYLON.Color3(1, 0.95, 0.9);
            light.range = 12;
        }
    }

    /**
     * Create holographic title text
     */
    createHolographicText() {
        // Create a simple "GEMBOT FARM" sign
        const plane = BABYLON.MeshBuilder.CreatePlane(
            'titlePlane',
            { width: 12, height: 3 },
            this.scene
        );
        plane.position = new BABYLON.Vector3(0, 8, -9);
        plane.rotation.x = Math.PI * 0.1;
        
        const titleMat = new BABYLON.StandardMaterial('titleMat', this.scene);
        
        // Create title texture
        const titleTex = new BABYLON.DynamicTexture('titleTex', { width: 512, height: 128 }, this.scene);
        const ctx = titleTex.getContext();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 512, 128);
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#00ffff';
        ctx.textAlign = 'center';
        ctx.fillText('GEMBOT FARM', 256, 75);
        titleTex.update();
        titleTex.hasAlpha = true;
        
        titleMat.diffuseTexture = titleTex;
        titleMat.emissiveTexture = titleTex;
        titleMat.backFaceCulling = false;
        titleMat.useAlphaFromDiffuseTexture = true;
        plane.material = titleMat;
    }
    
    /**
     * Create ambient particle effects
     */
    createAmbientParticles() {
        const particleSystem = new BABYLON.ParticleSystem('particles', 100, this.scene);
        
        // Create particle texture
        const particleTex = new BABYLON.DynamicTexture('particleTex', 32, this.scene);
        const ctx = particleTex.getContext();
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(0,255,255,1)');
        gradient.addColorStop(1, 'rgba(0,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        particleTex.update();
        
        particleSystem.particleTexture = particleTex;
        
        // Emitter
        particleSystem.emitter = new BABYLON.Vector3(0, 10, 0);
        particleSystem.minEmitBox = new BABYLON.Vector3(-20, 0, -15);
        particleSystem.maxEmitBox = new BABYLON.Vector3(20, 0, 15);
        
        // Particle behavior
        particleSystem.color1 = new BABYLON.Color4(0, 1, 1, 0.5);
        particleSystem.color2 = new BABYLON.Color4(1, 0, 0.5, 0.5);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;
        
        particleSystem.minLifeTime = 3;
        particleSystem.maxLifeTime = 6;
        
        particleSystem.emitRate = 10;
        
        particleSystem.gravity = new BABYLON.Vector3(0, -0.1, 0);
        
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        
        particleSystem.start();
    }
    
    /**
     * Add a machine to the farm
     */
    addMachine(typeId, roomId) {
        const machineType = this.machineTypes[typeId];
        if (!machineType) {
            console.error('Unknown machine type:', typeId);
            return false;
        }
        
        // Check cost
        if (this.state.player.gems < machineType.cost) {
            console.log('Not enough gems for machine');
            return false;
        }
        
        // Check room capacity
        const roomMachines = this.state.machines.filter(m => m.room === roomId);
        const roomType = this.roomTypes[roomId];
        if (roomMachines.length >= (roomType?.slots || 3)) {
            console.log('Room is full');
            return false;
        }
        
        // Deduct cost
        if (machineType.cost > 0) {
            this.state.player.gems -= machineType.cost;
        }
        
        // Create machine
        const machine = {
            id: 'machine_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: typeId,
            room: roomId,
            level: 1,
            production: machineType.production,
            speed: machineType.speed,
            lastCut: Date.now(),
            totalCuts: 0,
            mesh: null
        };
        
        this.state.machines.push(machine);
        
        // Create 3D representation
        this.createMachineMesh(machine, roomMachines.length);
        
        console.log(`✅ Added ${machineType.name} to ${roomId}`);
        
        if (this.onUIUpdate) this.onUIUpdate(this.state);
        
        return true;
    }
    
    /**
     * Create accurate GemBot Mini 3D mesh
     * 
     * GemBot Mini anatomy:
     * - Base unit with motor and lap spindle
     * - Lap disc (cutting/polishing wheel) - spins horizontally
     * - Mast (vertical support arm)
     * - Angle Control Box (attached to mast) - contains index motor
     * - Index Wheel (96-tooth gear for facet positioning)
     * - Quill/Chuck assembly (holds dop stick)
     * - Dop Stick (wax attachment for stone)
     * - Stone (the gem being cut)
     * 
     * Home position: Arm at 90° (parallel to lap), positioned up on Y and right on X
     * Scale: ~18" x 12" x 10" real size - one GemBot fills a standard workbench
     */
    createMachineMesh(machine, index) {
        if (!this.scene) return;
        
        const machineType = this.machineTypes[machine.type];
        const roomType = this.roomTypes[machine.room];
        
        // Scale: 1 unit = ~2 inches, GemBot Mini is ~18" wide = 9 units
        // Each GemBot needs a full table (about 10x8 units)
        const scale = 1.0;
        const tableSpacing = 10; // Each table is 10 units apart
        
        // Position based on room layout - one GemBot per table
        const roomDims = roomType?.dimensions || { width: 12, depth: 10 };
        const slotsPerRow = Math.max(1, Math.floor(roomDims.width / tableSpacing));
        const gridX = (index % slotsPerRow) * tableSpacing - (roomDims.width / 2) + tableSpacing / 2;
        const gridZ = Math.floor(index / slotsPerRow) * tableSpacing - (roomDims.depth / 2) + tableSpacing / 2;
        
        // Create machine root
        const machineRoot = new BABYLON.TransformNode(machine.id, this.scene);
        machineRoot.position = new BABYLON.Vector3(gridX, 0, gridZ);
        
        // Store animation targets
        machine.animationTargets = {};
        
        // ===== MATERIALS =====
        const metalMat = new BABYLON.StandardMaterial(machine.id + '_metal', this.scene);
        metalMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        metalMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.7);
        metalMat.specularPower = 32;
        
        const darkMetalMat = new BABYLON.StandardMaterial(machine.id + '_darkMetal', this.scene);
        darkMetalMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.18);
        darkMetalMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.5);
        
        const blackMat = new BABYLON.StandardMaterial(machine.id + '_black', this.scene);
        blackMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.07);
        
        const copperMat = new BABYLON.StandardMaterial(machine.id + '_copper', this.scene);
        copperMat.diffuseColor = new BABYLON.Color3(0.72, 0.45, 0.2);
        copperMat.specularColor = new BABYLON.Color3(0.9, 0.7, 0.5);
        
        const acrylicMat = new BABYLON.StandardMaterial(machine.id + '_acrylic', this.scene);
        acrylicMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.15);
        acrylicMat.alpha = 0.7;
        
        // ===== 1. BASE UNIT (Motor housing) =====
        const baseWidth = 4.5 * scale;
        const baseHeight = 1.5 * scale;
        const baseDepth = 3 * scale;
        
        const base = BABYLON.MeshBuilder.CreateBox(machine.id + '_base', {
            width: baseWidth, height: baseHeight, depth: baseDepth
        }, this.scene);
        base.parent = machineRoot;
        base.position.y = baseHeight / 2;
        base.material = darkMetalMat;
        
        // Base feet
        const footPositions = [
            [-baseWidth/2 + 0.3, 0, -baseDepth/2 + 0.3],
            [baseWidth/2 - 0.3, 0, -baseDepth/2 + 0.3],
            [-baseWidth/2 + 0.3, 0, baseDepth/2 - 0.3],
            [baseWidth/2 - 0.3, 0, baseDepth/2 - 0.3]
        ];
        footPositions.forEach((pos, i) => {
            const foot = BABYLON.MeshBuilder.CreateCylinder(machine.id + '_foot' + i, {
                height: 0.2, diameter: 0.4
            }, this.scene);
            foot.parent = machineRoot;
            foot.position = new BABYLON.Vector3(pos[0], 0.1, pos[2]);
            foot.material = blackMat;
        });
        
        // ===== 2. LAP SPINDLE & DISC =====
        // Spindle housing (center of base, top)
        const spindleHousing = BABYLON.MeshBuilder.CreateCylinder(machine.id + '_spindleHousing', {
            height: 0.8, diameter: 1.2
        }, this.scene);
        spindleHousing.parent = machineRoot;
        spindleHousing.position = new BABYLON.Vector3(0, baseHeight + 0.4, 0);
        spindleHousing.material = metalMat;
        
        // Lap disc (cutting wheel) - sits on spindle
        const lapDisc = BABYLON.MeshBuilder.CreateCylinder(machine.id + '_lap', {
            height: 0.15, diameter: 3.5
        }, this.scene);
        lapDisc.parent = machineRoot;
        lapDisc.position = new BABYLON.Vector3(0, baseHeight + 0.85, 0);
        
        const lapMat = new BABYLON.StandardMaterial(machine.id + '_lapMat', this.scene);
        lapMat.diffuseColor = new BABYLON.Color3(0.5, 0.45, 0.4); // Bronze/copper lap color
        lapMat.specularColor = new BABYLON.Color3(0.7, 0.6, 0.5);
        lapDisc.material = lapMat;
        machine.lapMesh = lapDisc;
        machine.lapMat = lapMat;
        machine.lapBaseY = baseHeight + 0.85;
        machine.currentLapType = 'coarse'; // Track current lap
        
        // Water drip tray rim
        const trayRim = BABYLON.MeshBuilder.CreateTorus(machine.id + '_trayRim', {
            diameter: 4, thickness: 0.1, tessellation: 32
        }, this.scene);
        trayRim.parent = machineRoot;
        trayRim.position = new BABYLON.Vector3(0, baseHeight + 0.7, 0);
        trayRim.material = metalMat;
        
        // ===== 3. MAST (Vertical support arm) =====
        const mastHeight = 3.5 * scale;
        const mast = BABYLON.MeshBuilder.CreateBox(machine.id + '_mast', {
            width: 0.4, height: mastHeight, depth: 0.4
        }, this.scene);
        mast.parent = machineRoot;
        mast.position = new BABYLON.Vector3(-baseWidth/2 - 0.3, baseHeight + mastHeight/2, 0);
        mast.material = metalMat;
        
        // Mast base bracket
        const mastBracket = BABYLON.MeshBuilder.CreateBox(machine.id + '_mastBracket', {
            width: 0.8, height: 0.3, depth: 0.6
        }, this.scene);
        mastBracket.parent = machineRoot;
        mastBracket.position = new BABYLON.Vector3(-baseWidth/2 - 0.3, baseHeight + 0.15, 0);
        mastBracket.material = darkMetalMat;
        
        // ===== 4. ANGLE CONTROL BOX (Contains index motor) =====
        // This is the key component - holds the index wheel mechanism
        const angleBoxWidth = 1.2;
        const angleBoxHeight = 1.0;
        const angleBoxDepth = 0.8;
        
        // Angle arm pivot (attaches to mast, allows vertical angle adjustment)
        const angleArmPivot = new BABYLON.TransformNode(machine.id + '_angleArmPivot', this.scene);
        angleArmPivot.parent = machineRoot;
        angleArmPivot.position = new BABYLON.Vector3(-baseWidth/2 - 0.3, baseHeight + mastHeight - 0.5, 0);
        machine.animationTargets.angleArmPivot = angleArmPivot;
        
        // Horizontal arm from mast to angle box
        const angleArm = BABYLON.MeshBuilder.CreateBox(machine.id + '_angleArm', {
            width: 2.5, height: 0.3, depth: 0.3
        }, this.scene);
        angleArm.parent = angleArmPivot;
        angleArm.position = new BABYLON.Vector3(1.25, 0, 0);
        angleArm.material = metalMat;
        
        // Angle control box (motor housing for index)
        const angleBox = BABYLON.MeshBuilder.CreateBox(machine.id + '_angleBox', {
            width: angleBoxWidth, height: angleBoxHeight, depth: angleBoxDepth
        }, this.scene);
        angleBox.parent = angleArmPivot;
        angleBox.position = new BABYLON.Vector3(2.5, 0, 0);
        angleBox.material = darkMetalMat;
        
        // ===== 5. INDEX WHEEL (96-tooth gear for facet positioning) =====
        const indexWheelPivot = new BABYLON.TransformNode(machine.id + '_indexWheelPivot', this.scene);
        indexWheelPivot.parent = angleArmPivot;
        indexWheelPivot.position = new BABYLON.Vector3(2.5 + angleBoxWidth/2 + 0.3, 0, 0);
        machine.animationTargets.indexWheelPivot = indexWheelPivot;
        
        // Index wheel (gear-like appearance)
        const indexWheel = BABYLON.MeshBuilder.CreateCylinder(machine.id + '_indexWheel', {
            height: 0.15, diameter: 0.9
        }, this.scene);
        indexWheel.parent = indexWheelPivot;
        indexWheel.rotation.z = Math.PI / 2;
        indexWheel.material = metalMat;
        
        // Index wheel teeth suggestion (outer ring)
        const indexRing = BABYLON.MeshBuilder.CreateTorus(machine.id + '_indexRing', {
            diameter: 0.95, thickness: 0.05, tessellation: 48
        }, this.scene);
        indexRing.parent = indexWheelPivot;
        indexRing.rotation.z = Math.PI / 2;
        indexRing.material = copperMat;
        
        // ===== 6. QUILL/CHUCK ASSEMBLY =====
        const chuckPivot = new BABYLON.TransformNode(machine.id + '_chuckPivot', this.scene);
        chuckPivot.parent = indexWheelPivot;
        chuckPivot.position = new BABYLON.Vector3(0.3, 0, 0);
        machine.animationTargets.chuckPivot = chuckPivot;
        
        // Chuck body
        const chuck = BABYLON.MeshBuilder.CreateCylinder(machine.id + '_chuck', {
            height: 0.6, diameterTop: 0.25, diameterBottom: 0.35
        }, this.scene);
        chuck.parent = chuckPivot;
        chuck.rotation.z = Math.PI / 2;
        chuck.position.x = 0.3;
        chuck.material = metalMat;
        
        // ===== 7. DOP STICK =====
        const dopStick = BABYLON.MeshBuilder.CreateCylinder(machine.id + '_dopStick', {
            height: 1.2, diameter: 0.08
        }, this.scene);
        dopStick.parent = chuckPivot;
        dopStick.rotation.z = Math.PI / 2;
        dopStick.position.x = 1.2;
        
        const dopMat = new BABYLON.StandardMaterial(machine.id + '_dopMat', this.scene);
        dopMat.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.3); // Brass color
        dopStick.material = dopMat;
        
        // Dop wax bulb (where stone attaches)
        const dopWax = BABYLON.MeshBuilder.CreateSphere(machine.id + '_dopWax', {
            diameter: 0.2
        }, this.scene);
        dopWax.parent = chuckPivot;
        dopWax.position.x = 1.8;
        
        const waxMat = new BABYLON.StandardMaterial(machine.id + '_waxMat', this.scene);
        waxMat.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.1); // Brown wax
        dopWax.material = waxMat;
        
        // ===== 8. STONE (Gem being cut) =====
        const stonePivot = new BABYLON.TransformNode(machine.id + '_stonePivot', this.scene);
        stonePivot.parent = chuckPivot;
        stonePivot.position = new BABYLON.Vector3(1.95, 0, 0);
        machine.animationTargets.stonePivot = stonePivot;
        
        // Create gem stone (octahedron shape for rough, or faceted for in-progress)
        const stone = BABYLON.MeshBuilder.CreatePolyhedron(machine.id + '_stone', {
            type: 1, // Octahedron
            size: 0.12
        }, this.scene);
        stone.parent = stonePivot;
        
        const stoneMat = new BABYLON.StandardMaterial(machine.id + '_stoneMat', this.scene);
        stoneMat.diffuseColor = new BABYLON.Color3(0.5, 0, 1); // Purple amethyst default
        stoneMat.specularColor = new BABYLON.Color3(1, 1, 1);
        stoneMat.specularPower = 64;
        stoneMat.alpha = 0.85;
        stone.material = stoneMat;
        machine.stoneMesh = stone;
        machine.stoneMat = stoneMat;
        
        // ===== 9. STATUS INDICATORS =====
        // LED status light on base
        const statusLED = BABYLON.MeshBuilder.CreateSphere(machine.id + '_statusLED', {
            diameter: 0.15
        }, this.scene);
        statusLED.parent = machineRoot;
        statusLED.position = new BABYLON.Vector3(baseWidth/2 - 0.3, baseHeight + 0.1, baseDepth/2 - 0.3);
        
        const statusMat = new BABYLON.StandardMaterial(machine.id + '_statusMat', this.scene);
        statusMat.emissiveColor = new BABYLON.Color3(0, 1, 0); // Green = idle
        statusLED.material = statusMat;
        machine.statusMesh = statusLED;
        machine.statusMat = statusMat;
        
        // ===== 10. SET HOME POSITION =====
        // Home: Arm at 90° (horizontal, parallel to lap surface)
        // The arm extends from the mast to the right (+X direction)
        // Stone should be UP on Y axis and to the RIGHT on X axis
        angleArmPivot.rotation.z = 0; // 0 radians = horizontal arm (90° from vertical)
        
        // Position the stone above and to the side of the lap (home/park position)
        // When angle is 0 (horizontal), stone is positioned to the side of the lap
        indexWheelPivot.rotation.x = 0; // Index at position 0 (96-tooth gear)
        
        // Store the home position for reference
        machine.homePosition = {
            armAngle: 90,  // degrees - horizontal
            indexPosition: 0  // index gear position (0-95)
        };
        
        // ===== STORE REFERENCES =====
        machine.mesh = machineRoot;
        machine.angleArmPivot = angleArmPivot;
        machine.indexWheelPivot = indexWheelPivot;
        machine.chuckPivot = chuckPivot;
        
        // ===== REGISTER ANIMATIONS =====
        this.registerMachineAnimations(machine, machineType);
        
        // ===== CLICK INTERACTION =====
        this.setupMachineInteraction(machine, machineRoot);
        
        this.sceneObjects.machines.push(machineRoot);
        
        console.log(`🤖 Created GemBot Mini: ${machine.id} at (${gridX.toFixed(1)}, ${gridZ.toFixed(1)})`);
    }
    
    /**
     * Register animation handlers for a GemBot machine
     */
    registerMachineAnimations(machine, machineType) {
        if (!this.scene || !machine.lapMesh) return;
        
        const speed = machineType?.speed || 1;
        
        // Animation state for this machine
        machine.animState = {
            lapSpinning: false,
            currentAngle: 90, // Start at home (90° = parallel to lap)
            targetAngle: 90,
            currentIndex: 0,
            targetIndex: 0,
            isMoving: false
        };
        
        // Main animation loop for this machine
        this.scene.registerBeforeRender(() => {
            if (this.isPaused) return;
            
            const stone = machine.currentStone;
            const animState = machine.animState;
            
            // Lap spinning (when cutting/polishing)
            if (animState.lapSpinning && machine.lapMesh) {
                machine.lapMesh.rotation.y += 0.03 * speed;
            }
            
            // Smooth angle transitions
            if (machine.angleArmPivot && animState.currentAngle !== animState.targetAngle) {
                const angleDiff = animState.targetAngle - animState.currentAngle;
                const angleStep = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 0.5);
                animState.currentAngle += angleStep;
                
                // Convert to radians (0° = vertical down, 90° = horizontal)
                const radians = (90 - animState.currentAngle) * Math.PI / 180;
                machine.angleArmPivot.rotation.z = radians;
            }
            
            // Index wheel rotation (facet positioning)
            if (machine.indexWheelPivot && animState.currentIndex !== animState.targetIndex) {
                const indexDiff = animState.targetIndex - animState.currentIndex;
                const indexStep = Math.sign(indexDiff) * Math.min(Math.abs(indexDiff), 1);
                animState.currentIndex += indexStep;
                
                // 96 index positions = 3.75° per position
                const indexRadians = animState.currentIndex * (3.75 * Math.PI / 180);
                machine.indexWheelPivot.rotation.x = indexRadians;
            }
            
            // Update stone color based on current gem
            if (stone && machine.stoneMat) {
                const color = stone.gem?.color || '#ffffff';
                const r = parseInt(color.slice(1, 3), 16) / 255;
                const g = parseInt(color.slice(3, 5), 16) / 255;
                const b = parseInt(color.slice(5, 7), 16) / 255;
                machine.stoneMat.diffuseColor = new BABYLON.Color3(r, g, b);
            }
            
            // Update status LED based on machine state
            if (machine.statusMat) {
                if (stone?.awaitingInteraction) {
                    // Yellow - waiting for click
                    machine.statusMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0);
                } else if (stone && !stone.isPaused) {
                    // Blue - actively cutting
                    machine.statusMat.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
                    animState.lapSpinning = true;
                } else if (stone?.isPaused) {
                    // Red - paused/error
                    machine.statusMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    animState.lapSpinning = false;
                } else {
                    // Green - idle
                    machine.statusMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
                    animState.lapSpinning = false;
                }
            }
        });
    }
    
    /**
     * Setup click interaction for a machine
     */
    setupMachineInteraction(machine, meshRoot) {
        if (!this.scene) return;
        
        // Make all child meshes pickable
        meshRoot.getChildMeshes().forEach(mesh => {
            mesh.isPickable = true;
            mesh.actionManager = new BABYLON.ActionManager(this.scene);
            
            // Hover highlight
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    this.highlightMachine(machine, true);
                }
            ));
            
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    this.highlightMachine(machine, false);
                }
            ));
            
            // Click action
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    this.onMachineClicked(machine);
                }
            ));
        });
    }
    
    /**
     * Highlight a machine (hover effect)
     */
    highlightMachine(machine, highlight) {
        if (!machine.mesh) return;
        
        machine.mesh.getChildMeshes().forEach(mesh => {
            if (mesh.material && mesh.material.emissiveColor) {
                if (highlight) {
                    mesh.material.emissiveColor = mesh.material.emissiveColor.add(
                        new BABYLON.Color3(0.1, 0.1, 0.15)
                    );
                } else {
                    mesh.material.emissiveColor = mesh.material.emissiveColor.subtract(
                        new BABYLON.Color3(0.1, 0.1, 0.15)
                    );
                }
            }
        });
    }
    
    /**
     * Handle machine click
     */
    onMachineClicked(machine) {
        console.log(`🖱️ Machine clicked: ${machine.id}`);
        
        const stone = machine.currentStone;
        
        // Check for pending interaction
        if (stone?.awaitingInteraction) {
            this.handleInteraction(machine.id, stone.interactionType);
            return;
        }
        
        // Check for pending interactions in the queue
        const pending = this.state.inventory.pendingInteractions?.find(
            p => p.machineId === machine.id
        );
        if (pending) {
            this.handleInteraction(machine.id, pending.interactionType);
            return;
        }
        
        // Check if lap change is needed (interaction type from cutting process)
        if (stone?.needsLapChange) {
            const newLapType = stone.nextLapType;
            this.animateLapChange(machine, newLapType, () => {
                stone.needsLapChange = false;
                stone.nextLapType = null;
                // Resume cutting after lap change
                if (machine.animState) {
                    machine.animState.lapSpinning = true;
                }
            });
            return;
        }
        
        // No stone - start a new one
        if (!stone) {
            this.startNewStone(machine);
            return;
        }
        
        // Show machine status popup with options
        this.showMachineStatus(machine);
    }
    
    /**
     * Show machine status popup
     */
    showMachineStatus(machine) {
        const stone = machine.currentStone;
        const status = {
            machineId: machine.id,
            type: this.machineTypes[machine.type]?.name,
            status: stone ? 'Cutting' : 'Idle',
            stone: stone ? {
                gem: stone.gem?.name,
                design: stone.design?.name,
                stage: stone.currentStage,
                progress: stone.stageProgress,
                quality: stone.qualityScore,
                roughCarats: stone.roughCarats,
                expectedYield: stone.expectedFinishedCarats
            } : null,
            totalCuts: machine.totalCuts
        };
        
        console.log('📊 Machine Status:', status);
        
        // Trigger UI callback if available
        if (this.onMachineSelected) {
            this.onMachineSelected(status);
        }
    }
    
    /**
     * Update machine animation based on cutting stage
     */
    updateMachineAnimation(machine, stage, facetData) {
        if (!machine.animState) return;
        
        // Set target angle based on stage
        switch (stage) {
            case 'prep':
            case 'dopping':
                machine.animState.targetAngle = 90; // Home position
                machine.animState.lapSpinning = false;
                break;
            case 'shaping':
            case 'preform':
                machine.animState.targetAngle = 45; // Medium angle for rough shaping
                machine.animState.lapSpinning = true;
                break;
            case 'pavilion_main':
            case 'pavilion_break':
            case 'pavilion_girdle':
                machine.animState.targetAngle = 42; // Typical pavilion angle
                machine.animState.lapSpinning = true;
                if (facetData?.indexPosition) {
                    machine.animState.targetIndex = facetData.indexPosition;
                }
                break;
            case 'transfer':
                machine.animState.targetAngle = 90; // Home for transfer
                machine.animState.lapSpinning = false;
                break;
            case 'crown_main':
            case 'crown_break':
            case 'crown_star':
            case 'crown_girdle':
                machine.animState.targetAngle = 42; // Crown angle
                machine.animState.lapSpinning = true;
                if (facetData?.indexPosition) {
                    machine.animState.targetIndex = facetData.indexPosition;
                }
                break;
            case 'table':
                machine.animState.targetAngle = 0; // Flat for table
                machine.animState.lapSpinning = true;
                break;
            case 'polish_pavilion':
            case 'polish_crown':
            case 'polish_table':
            case 'final_polish':
                // Same angles but slower lap for polish
                machine.animState.lapSpinning = true;
                break;
            case 'inspection':
            case 'complete':
                machine.animState.targetAngle = 90; // Back to home
                machine.animState.lapSpinning = false;
                break;
        }
    }
    
    /**
     * LAP COLORS - Visual representation of different lap types
     */
    getLapColor(lapType) {
        const lapColors = {
            // Cutting laps (diamond plated)
            'coarse': { diffuse: new BABYLON.Color3(0.3, 0.3, 0.35), specular: new BABYLON.Color3(0.5, 0.5, 0.6), name: 'Coarse Diamond (180 mesh)' },
            '600_grit': { diffuse: new BABYLON.Color3(0.35, 0.35, 0.4), specular: new BABYLON.Color3(0.6, 0.6, 0.7), name: '600 Grit Diamond' },
            '800_grit': { diffuse: new BABYLON.Color3(0.4, 0.4, 0.45), specular: new BABYLON.Color3(0.7, 0.7, 0.8), name: '800 Grit Diamond' },
            '1200_grit': { diffuse: new BABYLON.Color3(0.5, 0.5, 0.55), specular: new BABYLON.Color3(0.8, 0.8, 0.9), name: '1200 Grit Diamond' },
            // Polishing laps (copper with paste)
            'copper_8k': { diffuse: new BABYLON.Color3(0.72, 0.45, 0.2), specular: new BABYLON.Color3(0.9, 0.7, 0.5), name: 'Copper + 8K Paste' },
            'copper_14k': { diffuse: new BABYLON.Color3(0.75, 0.5, 0.25), specular: new BABYLON.Color3(0.9, 0.75, 0.55), name: 'Copper + 14K Paste' },
            'copper_50k': { diffuse: new BABYLON.Color3(0.78, 0.55, 0.3), specular: new BABYLON.Color3(0.95, 0.8, 0.6), name: 'Copper + 50K Paste' },
            'copper_100k': { diffuse: new BABYLON.Color3(0.8, 0.6, 0.35), specular: new BABYLON.Color3(1.0, 0.85, 0.7), name: 'Copper + 100K Paste' },
            'copper_200k': { diffuse: new BABYLON.Color3(0.85, 0.65, 0.4), specular: new BABYLON.Color3(1.0, 0.9, 0.8), name: 'Copper + 200K Mirror' }
        };
        return lapColors[lapType] || lapColors['coarse'];
    }
    
    /**
     * Animate lap change - record player style lift/swap/drop
     * @param {Object} machine - The machine object
     * @param {string} newLapType - The lap type to switch to
     * @param {Function} callback - Called when animation completes
     */
    animateLapChange(machine, newLapType, callback) {
        if (!machine.lapMesh || !machine.lapMat || !this.scene) {
            if (callback) callback();
            return;
        }
        
        // Skip if same lap
        if (machine.currentLapType === newLapType) {
            if (callback) callback();
            return;
        }
        
        console.log(`🔄 Changing lap: ${machine.currentLapType} → ${newLapType}`);
        
        const lapMesh = machine.lapMesh;
        const lapMat = machine.lapMat;
        const baseY = machine.lapBaseY || 2.35;
        const liftHeight = 1.5; // How high the lap lifts
        const animDuration = 1500; // Total animation time in ms
        
        // Stop lap spinning during change
        if (machine.animState) {
            machine.animState.lapSpinning = false;
        }
        
        // Animation phases: lift (0-0.3), pause (0.3-0.5), drop (0.5-0.8), settle (0.8-1.0)
        const startTime = performance.now();
        const newLapColor = this.getLapColor(newLapType);
        
        const animFrame = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / animDuration, 1);
            
            if (progress < 0.3) {
                // Phase 1: Lift old lap up
                const liftProgress = progress / 0.3;
                const eased = 1 - Math.pow(1 - liftProgress, 3); // Ease out
                lapMesh.position.y = baseY + (liftHeight * eased);
                // Fade out old lap
                lapMat.alpha = 1 - (liftProgress * 0.5);
            } else if (progress < 0.5) {
                // Phase 2: Swap colors (lap at top, hidden)
                lapMesh.position.y = baseY + liftHeight;
                lapMat.alpha = 0.3;
                // Change lap color midway
                if (progress > 0.4) {
                    lapMat.diffuseColor = newLapColor.diffuse;
                    lapMat.specularColor = newLapColor.specular;
                }
            } else if (progress < 0.8) {
                // Phase 3: Drop new lap down
                const dropProgress = (progress - 0.5) / 0.3;
                const eased = Math.pow(dropProgress, 2); // Ease in
                lapMesh.position.y = baseY + liftHeight - (liftHeight * eased);
                // Fade in new lap
                lapMat.alpha = 0.3 + (dropProgress * 0.7);
            } else {
                // Phase 4: Settle with bounce
                const settleProgress = (progress - 0.8) / 0.2;
                const bounce = Math.sin(settleProgress * Math.PI) * 0.05;
                lapMesh.position.y = baseY + bounce;
                lapMat.alpha = 1;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animFrame);
            } else {
                // Animation complete
                lapMesh.position.y = baseY;
                lapMat.alpha = 1;
                machine.currentLapType = newLapType;
                console.log(`✅ Lap changed to: ${newLapColor.name}`);
                
                // Show floating text notification
                this.showLapChangeNotification(machine, newLapColor.name);
                
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animFrame);
    }
    
    /**
     * Show floating notification when lap changes
     */
    showLapChangeNotification(machine, lapName) {
        if (!this.scene || !machine.mesh) return;
        
        // Create floating text plane above the machine
        const plane = BABYLON.MeshBuilder.CreatePlane('lapNotify_' + Date.now(), {
            width: 2.5, height: 0.5
        }, this.scene);
        
        plane.position = machine.mesh.position.clone();
        plane.position.y += 3;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        
        // Create dynamic texture for text
        const texture = new BABYLON.DynamicTexture('lapNotifyTex', { width: 256, height: 64 }, this.scene);
        const ctx = texture.getContext();
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 256, 64);
        
        // Border
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 252, 60);
        
        // Text
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#00ffff';
        ctx.textAlign = 'center';
        ctx.fillText('🔄 ' + lapName, 128, 40);
        
        texture.update();
        
        const mat = new BABYLON.StandardMaterial('lapNotifyMat', this.scene);
        mat.diffuseTexture = texture;
        mat.emissiveTexture = texture;
        mat.opacityTexture = texture;
        mat.backFaceCulling = false;
        plane.material = mat;
        
        // Animate: float up and fade out
        let startY = plane.position.y;
        let alpha = 1;
        const floatAnim = () => {
            plane.position.y += 0.02;
            alpha -= 0.01;
            mat.alpha = alpha;
            
            if (alpha > 0) {
                requestAnimationFrame(floatAnim);
            } else {
                plane.dispose();
                texture.dispose();
                mat.dispose();
            }
        };
        requestAnimationFrame(floatAnim);
    }
    
    /**
     * Handle lap change interaction from machine click
     */
    handleLapChangeClick(machine) {
        if (!machine) return;
        
        // Get available laps from inventory
        const availableLaps = Object.entries(this.state.inventory.laps)
            .filter(([key, lap]) => lap.owned && lap.condition > 0)
            .map(([key]) => key);
        
        // Add polishing laps if paste is available
        Object.entries(this.state.inventory.paste).forEach(([grit, amount]) => {
            if (amount > 0) {
                availableLaps.push(`copper_${grit}`);
            }
        });
        
        // Find current lap index and cycle to next
        const currentIndex = availableLaps.indexOf(machine.currentLapType);
        const nextIndex = (currentIndex + 1) % availableLaps.length;
        const nextLap = availableLaps[nextIndex];
        
        // Animate the lap change
        this.animateLapChange(machine, nextLap);
    }
    
    /**
     * Render all machines
     */
    renderMachines() {
        this.state.machines.forEach((machine, index) => {
            if (!machine.mesh) {
                this.createMachineMesh(machine, index);
            }
        });
    }
    
    /**
     * Start the game loop
     */
    startGameLoop() {
        if (this.gameLoop) return;
        
        this.gameLoop = setInterval(() => {
            if (!this.isPaused) {
                this.tick();
            }
        }, this.config.tickRate);
        
        // Auto-save
        setInterval(() => {
            this.saveState();
        }, this.config.autoSaveInterval);
    }
    
    /**
     * Game tick - process production with REALISTIC TIMING
     */
    tick() {
        const now = Date.now();
        const deltaTime = (now - this.lastTick) / 1000;
        this.lastTick = now;
        
        // Update play time
        this.state.stats.playTime += deltaTime;
        
        // Calculate game time passed (accelerated)
        const gameTimePassed = deltaTime * this.config.timeAcceleration;
        
        // Process each machine's current stone
        this.state.machines.forEach(machine => {
            this.processRealisticCutting(machine, gameTimePassed);
        });
        
        // Check for level up
        this.checkLevelUp();
        
        // Update UI
        if (this.onUIUpdate) this.onUIUpdate(this.state);
    }
    
    /**
     * Process realistic gem cutting with stages, timing, and hazards
     */
    processRealisticCutting(machine, gameTimePassed) {
        const machineType = this.machineTypes[machine.type];
        
        // ===== CHECK MACHINE CONDITION =====
        const machineStatus = this.checkMachineCondition(machine);
        if (!machineStatus.operational) {
            // Machine is down - can't cut
            return;
        }
        
        // Apply condition decay
        this.applyConditionDecay(machine, gameTimePassed);
        
        // If machine has no current stone, start a new one
        if (!machine.currentStone) {
            this.startNewStone(machine);
            return;
        }
        
        const stone = machine.currentStone;
        const stage = this.cuttingStages[stone.currentStage];
        
        if (!stage) {
            console.error('Invalid stage:', stone.currentStage);
            return;
        }
        
        // ===== CHECK FOR AWAITING INTERACTION - FULL STOP =====
        if (stone.awaitingInteraction) {
            // Machine is paused waiting for human click
            // DO NOT PROGRESS - show visual indicator
            // Don't log every tick - too spammy
            return;
        }
        
        // ===== CHECK WATER LEVEL =====
        const waterCheck = this.checkWaterLevel();
        if (waterCheck.level <= 10) {
            // Low water - require interaction to refill
            stone.awaitingInteraction = true;
            stone.interactionType = 'refill_water';
            this.addPendingInteraction(machine.id, 'refill_water', 
                `Water tank low (${waterCheck.level}%)! Click to refill.`);
            
            if (this.merlin) {
                this.merlinSpeak('STOP! Water tank nearly empty! Click to refill before continuing.');
            }
            return;
        }
        
        // Consume water while cutting
        this.consumeWater(gameTimePassed);
        
        // ===== CHECK LAP CONDITION =====
        if (stage.lapType) {
            const lapKey = stage.lapType.replace('copper_', 'copper');
            const lapType = lapKey === 'coarse' ? 'coarse' : 
                           lapKey.includes('grit') ? lapKey : 'copper';
            const lapStatus = this.isLapUsable(lapType);
            
            if (!lapStatus.usable) {
                // Lap needs replaced - require interaction
                stone.awaitingInteraction = true;
                stone.interactionType = 'change_lap';
                this.addPendingInteraction(machine.id, 'change_lap', 
                    `${lapStatus.reason} Click to change lap.`);
                
                if (this.merlin) {
                    this.merlinSpeak(`Lap issue: ${lapStatus.reason} Click machine to change lap.`);
                }
                return;
            }
            
            // Check if paste is needed for polish stages
            if (stage.name.includes('Polish') && lapType === 'copper') {
                const requiredPaste = this.getRequiredPaste(stone.currentStage);
                if (requiredPaste) {
                    const pasteLevel = this.state.inventory.paste[requiredPaste] || 0;
                    const copperCharges = this.state.inventory.laps.copper.charges || 0;
                    
                    if (copperCharges <= 0) {
                        stone.awaitingInteraction = true;
                        stone.interactionType = 'charge_paste';
                        this.addPendingInteraction(machine.id, 'charge_paste', 
                            `Copper lap needs ${requiredPaste} paste charge. Click to apply.`);
                        return;
                    }
                }
            }
            
            // Apply lap wear periodically
            if (stone.stageProgress % 60 < gameTimePassed) {
                this.applyLapWear(lapType);
            }
        }
        
        // ===== CHECK FOR HUMAN REQUIRED STAGES =====
        if (stage.humanRequired && stone.stageProgress === 0) {
            // Human stage just started - wait for click
            stone.awaitingInteraction = true;
            
            // Determine interaction type based on stage
            if (stage.name.includes('Prep')) {
                stone.interactionType = 'start_prep';
            } else if (stage.name.includes('Dop')) {
                stone.interactionType = 'complete_dop';
            } else if (stage.name.includes('Mount')) {
                stone.interactionType = 'mount_chuck';
            } else if (stage.name.includes('Transfer')) {
                stone.interactionType = 'transfer';
            } else if (stage.name.includes('Final') || stage.name.includes('Remove')) {
                stone.interactionType = 'final_remove';
            } else {
                stone.interactionType = 'human_task';
            }
            
            this.addPendingInteraction(machine.id, stone.interactionType, 
                `${stage.name} - ${stage.description}. Click when ready.`);
            
            console.log(`👤 Human stage: ${stage.name} - awaiting click`);
            return;
        }
        
        // ===== PROCESS CUTTING/POLISHING =====
        stone.isPaused = false;
        
        // Calculate time for this stage based on gem properties AND design
        const stageTime = this.calculateStageTime(stone, stage, machineType);
        
        // Apply machine condition speed modifier
        const effectiveSpeed = machineType.speed * (machineStatus.speedMultiplier || 1);
        
        // Progress the stage
        stone.stageProgress += gameTimePassed * effectiveSpeed;
        
        // Update accumulated cutting time
        this.state.stats.totalTimeSpentCutting += gameTimePassed / this.config.timeAcceleration;
        
        // ===== FACET-BY-FACET PROGRESS TRACKING =====
        if (stage.name.includes('Cut') || stage.name.includes('Polish')) {
            this.updateFacetProgress(stone, stage, stageTime);
        }
        
        // Check for stage completion
        if (stone.stageProgress >= stageTime) {
            // Stage complete - check for failure
            if (stage.canFail) {
                const failureResult = this.checkForFailure(stone, stage, machineType);
                if (failureResult.failed) {
                    this.handleCuttingFailure(machine, stone, failureResult);
                    return;
                }
            }
            
            // Move to next stage
            this.advanceToNextStage(machine, stone);
        }
        
        // Update machine visuals based on current stage
        this.updateMachineVisuals(machine, stone, stage);
    }
    
    /**
     * Update facet-by-facet progress for cutting/polishing stages
     */
    updateFacetProgress(stone, stage, stageTime) {
        if (!stone.facetSequence || stone.facetSequence.length === 0) return;
        
        const currentPhase = stone.cuttingPhase || 'pavilion';
        
        // Filter sequence by current phase
        const phaseFacets = stone.facetSequence.filter(f => f.phase === currentPhase);
        if (phaseFacets.length === 0) return;
        
        // Calculate which facet we're on based on progress
        const progressPercent = stone.stageProgress / stageTime;
        const facetIndex = Math.min(
            Math.floor(progressPercent * phaseFacets.length),
            phaseFacets.length - 1
        );
        
        const currentFacet = phaseFacets[facetIndex];
        if (currentFacet) {
            stone.currentFacetIndex = facetIndex;
            stone.currentAngle = currentFacet.angle;
            stone.currentIndex = currentFacet.index;
            stone.currentTier = currentFacet.tier;
        }
    }
    
    /**
     * Check water level in tank
     */
    checkWaterLevel() {
        return {
            level: this.state.inventory.consumables.water || 0,
            maxLevel: 100 + (this.state.upgradelevels.water_tank * 50)
        };
    }
    
    /**
     * Start cutting a new stone on a machine
     * Now includes design selection and per-facet timing
     */
    startNewStone(machine) {
        // ===== CHECK FOR AVAILABLE ROUGH IN INVENTORY =====
        // Now rough is an array of pieces with carat weights
        const availableRough = [];
        Object.entries(this.state.inventory.rough).forEach(([name, pieces]) => {
            if (Array.isArray(pieces) && pieces.length > 0) {
                const gem = this.gemTypes.find(g => g.name === name);
                if (gem) {
                    pieces.forEach((piece, index) => {
                        availableRough.push({
                            ...gem,
                            pieceIndex: index,
                            roughCarats: piece.carats,
                            roughQuality: piece.quality || 'good'
                        });
                    });
                }
            }
        });
        
        // Filter by player level
        const levelFilteredGems = availableRough.filter(gem => {
            if (gem.rarity === 'legendary') return this.state.player.level >= 15;
            if (gem.rarity === 'rare') return this.state.player.level >= 8;
            if (gem.rarity === 'uncommon') return this.state.player.level >= 3;
            return true;
        });
        
        if (levelFilteredGems.length === 0) {
            // No rough available - enter searching mode
            this.state.player.isSearching = true;
            if (this.merlin && Math.random() < 0.1) {
                this.merlinSpeak('No rough stones available! Visit the shop to buy more material, or go searching for rough!');
            }
            return; // Can't start a new stone
        }
        
        this.state.player.isSearching = false;
        
        // Select a random rough piece from available inventory
        const selectedRough = levelFilteredGems[Math.floor(Math.random() * levelFilteredGems.length)];
        const gem = this.gemTypes.find(g => g.name === selectedRough.name);
        
        // ===== SELECT DESIGN =====
        // Pick best available design for this player's level
        const availableDesigns = Object.entries(this.designs)
            .filter(([id, design]) => {
                return this.state.unlockedDesigns.includes(id) && 
                       design.levelRequired <= this.state.player.level;
            })
            .map(([id, design]) => ({ id, ...design }));
        
        // Prefer designs with more facets for better value (if player level allows)
        const sortedDesigns = availableDesigns.sort((a, b) => b.totalFacets - a.totalFacets);
        const selectedDesign = sortedDesigns[0] || { 
            id: 'simple_round', 
            ...this.designs['simple_round'] 
        };
        
        // ===== CALCULATE EXPECTED FINISHED WEIGHT =====
        const baseYield = this.caratYield[selectedDesign.id] || this.caratYield['default'];
        const qualityMod = this.roughQuality[selectedRough.roughQuality]?.yieldMod || 1.0;
        const expectedYield = baseYield * qualityMod;
        const expectedFinishedCarats = selectedRough.roughCarats * expectedYield;
        
        // ===== CALCULATE CUTTING TIME BASED ON CARATS =====
        // Larger stones take longer (not linear - use square root for realistic scaling)
        const caratTimeFactor = Math.sqrt(selectedRough.roughCarats);
        
        // ===== CHECK DOP WAX =====
        const dopResult = this.consumeDopWax();
        if (!dopResult.success) {
            if (this.merlin && Math.random() < 0.2) {
                this.merlinSpeak(dopResult.message);
            }
            return; // Can't start without dop wax
        }
        
        // ===== REMOVE FROM INVENTORY =====
        const roughArray = this.state.inventory.rough[selectedRough.name];
        roughArray.splice(selectedRough.pieceIndex, 1);
        
        // ===== BUILD FACET CUTTING SEQUENCE =====
        const facetSequence = this.buildFacetSequence(selectedDesign);
        
        // Create stone cutting record with full facet data and carat tracking
        machine.currentStone = {
            id: 'stone_' + Date.now(),
            gem: gem,
            design: selectedDesign,
            designId: selectedDesign.id,
            // ===== CARAT TRACKING =====
            roughCarats: selectedRough.roughCarats,
            roughQuality: selectedRough.roughQuality,
            expectedYield: expectedYield,
            expectedFinishedCarats: expectedFinishedCarats,
            caratTimeFactor: caratTimeFactor,
            // Stage tracking
            currentStage: this.stageOrder[0], // Start with prep
            stageIndex: 0,
            stageProgress: 0,
            // Facet tracking (for cutting/polishing stages)
            facetSequence: facetSequence,
            currentFacetIndex: 0,
            currentAngle: 0,
            currentIndex: 0,
            cuttingPhase: 'pavilion', // pavilion or crown
            currentTier: null,
            // Timing
            startTime: Date.now(),
            // Quality tracking
            perfectBonus: 1, // Increases with good execution
            qualityScore: 100, // Decreases with issues
            // Interaction tracking
            awaitingInteraction: false,  // TRUE when waiting for human click
            interactionType: null,       // What kind of interaction needed
            isPaused: false,
            failureLog: []
        };
        
        // ===== REQUIRE HUMAN INTERACTION TO START =====
        // First stage is always prep - needs human click
        machine.currentStone.awaitingInteraction = true;
        machine.currentStone.interactionType = 'start_prep';
        
        this.addPendingInteraction(machine.id, 'start_prep', 
            `Click to start preparing ${selectedRough.roughCarats.toFixed(2)}ct ${gem.name} (${selectedRough.roughQuality}) with ${selectedDesign.name}`);
        
        // Notify of new stone with carat info
        if (this.merlin) {
            this.merlinSpeak(`${selectedRough.roughCarats.toFixed(2)}ct ${gem.name} (${selectedRough.roughQuality} quality) ready! Expected ${expectedFinishedCarats.toFixed(2)}ct finished. ${selectedDesign.totalFacets} facets. Click to begin!`);
        }
        
        console.log(`💎 Started cutting: ${selectedRough.roughCarats.toFixed(2)}ct ${gem.name} (${selectedRough.roughQuality}) → Expected ${expectedFinishedCarats.toFixed(2)}ct with ${selectedDesign.name}`);
    }
    
    /**
     * Start cutting with a specific design selection (called from UI)
     * @param {string} machineId - Machine ID to use
     * @param {string} gemName - Name of gem from inventory
     * @param {number} pieceIndex - Index of the piece in the rough array
     * @param {string} designId - ID of the design to use
     * @returns {Object} result with success status
     */
    startCuttingWithDesign(machineId, gemName, pieceIndex, designId) {
        const machine = this.state.machines.find(m => m.id === machineId);
        if (!machine) {
            return { success: false, message: 'Machine not found' };
        }
        
        if (machine.currentStone) {
            return { success: false, message: 'Machine is already cutting' };
        }
        
        if (machine.isDown) {
            return { success: false, message: 'Machine needs repair' };
        }
        
        // Get the specific rough piece
        const roughArray = this.state.inventory.rough[gemName];
        if (!roughArray || !Array.isArray(roughArray) || !roughArray[pieceIndex]) {
            return { success: false, message: 'Stone not found in inventory' };
        }
        
        const piece = roughArray[pieceIndex];
        const gem = this.gemTypes.find(g => g.name === gemName);
        if (!gem) {
            return { success: false, message: 'Unknown gem type' };
        }
        
        // Get the design
        const design = this.designs[designId];
        if (!design) {
            return { success: false, message: 'Design not found' };
        }
        
        // Check level requirement
        if (design.levelRequired > this.state.player.level) {
            return { success: false, message: `Need level ${design.levelRequired} for this design` };
        }
        
        // Check dop wax
        const dopResult = this.consumeDopWax();
        if (!dopResult.success) {
            return { success: false, message: dopResult.message };
        }
        
        // Remove from inventory
        roughArray.splice(pieceIndex, 1);
        
        // Calculate expected yield
        const baseYield = this.caratYield[designId] || this.caratYield['default'];
        const qualityMod = this.roughQuality[piece.quality || 'good']?.yieldMod || 1.0;
        const expectedYield = baseYield * qualityMod;
        const expectedFinishedCarats = piece.carats * expectedYield;
        const caratTimeFactor = Math.sqrt(piece.carats);
        
        // Build facet sequence
        const facetSequence = this.buildFacetSequence(design);
        
        // Create stone cutting record
        machine.currentStone = {
            id: 'stone_' + Date.now(),
            gem: gem,
            design: design,
            designId: designId,
            roughCarats: piece.carats,
            roughQuality: piece.quality || 'good',
            expectedYield: expectedYield,
            expectedFinishedCarats: expectedFinishedCarats,
            caratTimeFactor: caratTimeFactor,
            currentStage: this.stageOrder[0],
            stageIndex: 0,
            stageProgress: 0,
            facetSequence: facetSequence,
            currentFacetIndex: 0,
            currentAngle: 0,
            currentIndex: 0,
            cuttingPhase: 'pavilion',
            currentTier: null,
            startTime: Date.now(),
            perfectBonus: 1,
            qualityScore: 100,
            awaitingInteraction: true,
            interactionType: 'start_prep',
            isPaused: false,
            failureLog: []
        };
        
        this.addPendingInteraction(machine.id, 'start_prep', 
            `Click to start preparing ${piece.carats.toFixed(2)}ct ${gem.name} with ${design.name}`);
        
        if (this.merlin) {
            this.merlinSpeak(`${piece.carats.toFixed(2)}ct ${gem.name} ready for ${design.name}! ${design.totalFacets} facets. Click to begin!`);
        }
        
        console.log(`💎 Player selected: ${piece.carats.toFixed(2)}ct ${gem.name} → ${design.name} (${design.totalFacets} facets)`);
        
        return { 
            success: true, 
            message: `Started cutting ${gem.name} with ${design.name}`,
            expectedFinishedCarats: expectedFinishedCarats,
            totalFacets: design.totalFacets
        };
    }
    
    /**
     * Build the complete facet cutting sequence for a design
     * Returns array of { tier, angle, index, phase } for each facet
     */
    buildFacetSequence(design) {
        const sequence = [];
        
        // Pavilion facets first
        if (design.pavilion) {
            Object.entries(design.pavilion).forEach(([tierName, tier]) => {
                tier.indices.forEach((indexPos, i) => {
                    sequence.push({
                        phase: 'pavilion',
                        tier: tierName,
                        angle: tier.angle,
                        index: indexPos,
                        facetNumber: sequence.length + 1
                    });
                });
            });
        }
        
        // Crown facets after transfer
        if (design.crown) {
            Object.entries(design.crown).forEach(([tierName, tier]) => {
                tier.indices.forEach((indexPos, i) => {
                    sequence.push({
                        phase: 'crown',
                        tier: tierName,
                        angle: tier.angle,
                        index: indexPos,
                        facetNumber: sequence.length + 1
                    });
                });
            });
        }
        
        return sequence;
    }
    
    /**
     * Add a pending interaction that requires user click
     */
    addPendingInteraction(machineId, interactionType, description) {
        // Remove any existing interaction for this machine
        this.state.pendingInteractions = this.state.pendingInteractions.filter(
            i => i.machineId !== machineId
        );
        
        this.state.pendingInteractions.push({
            machineId,
            interactionType,
            description,
            addedAt: Date.now()
        });
        
        console.log(`⏸️ Awaiting interaction on ${machineId}: ${interactionType}`);
    }
    
    /**
     * Alias for handleMachineInteraction (called from internal code)
     */
    handleInteraction(machineId, interactionType) {
        return this.handleMachineInteraction(machineId);
    }
    
    /**
     * Handle user click on a machine to complete interaction
     */
    handleMachineInteraction(machineId) {
        const machine = this.state.machines.find(m => m.id === machineId);
        if (!machine || !machine.currentStone) {
            return { success: false, message: 'No stone on this machine' };
        }
        
        const stone = machine.currentStone;
        if (!stone.awaitingInteraction) {
            return { success: false, message: 'No interaction needed' };
        }
        
        const interactionType = stone.interactionType;
        
        // Clear the interaction state
        stone.awaitingInteraction = false;
        stone.interactionType = null;
        stone.isPaused = false;
        
        // CRITICAL: Advance stage progress slightly so the humanRequired check doesn't re-trigger
        // The check is: if (stage.humanRequired && stone.stageProgress === 0)
        if (stone.stageProgress === 0) {
            stone.stageProgress = 0.001;
        }
        
        // Remove from pending list
        this.state.pendingInteractions = this.state.pendingInteractions.filter(
            i => i.machineId !== machineId
        );
        
        // Handle specific interaction types
        switch(interactionType) {
            case 'start_prep':
                console.log('✅ start_prep handled, stageProgress now:', stone.stageProgress);
                if (this.merlin) {
                    this.merlinSpeak('Examining the rough... looking for inclusions and best orientation.');
                }
                break;
                
            case 'complete_dop':
                if (this.merlin) {
                    this.merlinSpeak('Stone dopped successfully! The wax bond looks solid.');
                }
                break;
                
            case 'mount_chuck':
                if (this.merlin) {
                    this.merlinSpeak('Dop mounted in chuck. Alignment verified. Ready to cut!');
                }
                break;
                
            case 'change_lap':
                const stage = this.cuttingStages[stone.currentStage];
                if (this.merlin) {
                    this.merlinSpeak(`Lap changed to ${stage?.lapType || 'new lap'}. Continuing the cut...`);
                }
                break;
                
            case 'refill_water':
                this.state.inventory.consumables.water = 100;
                this.state.stats.waterRefills++;
                if (this.merlin) {
                    this.merlinSpeak('Water tank refilled! Cooling system ready.');
                }
                break;
                
            case 'charge_paste':
                // Need to determine which paste to charge
                const requiredPaste = this.getRequiredPaste(stone.currentStage);
                if (requiredPaste) {
                    const chargeResult = this.chargeCopperLap(requiredPaste);
                    if (!chargeResult.success) {
                        // Put interaction back
                        stone.awaitingInteraction = true;
                        stone.interactionType = 'charge_paste';
                        this.addPendingInteraction(machineId, 'charge_paste', chargeResult.message);
                        return chargeResult;
                    }
                }
                break;
                
            case 'transfer':
                if (this.merlin) {
                    this.merlinSpeak('Transfer complete! Crown dop aligned with pavilion. Continuing to crown...');
                }
                stone.cuttingPhase = 'crown';
                break;
                
            case 'final_remove':
                if (this.merlin) {
                    this.merlinSpeak('Stone carefully removed from dop. Time to inspect!');
                }
                break;
        }
        
        console.log(`✅ Interaction completed: ${interactionType} on ${machineId}`);
        
        return { success: true, message: `Completed: ${interactionType}` };
    }
    
    /**
     * Get required paste grit for current stage
     */
    getRequiredPaste(stageName) {
        if (stageName.includes('8k')) return '8k';
        if (stageName.includes('14k')) return '14k';
        if (stageName.includes('50k')) return '50k';
        if (stageName.includes('100k')) return '100k';
        if (stageName.includes('200k')) return '200k';
        return null;
    }
    
    /**
     * Calculate time required for a stage based on gem properties AND design facets
     */
    calculateStageTime(stone, stage, machineType) {
        const gem = stone.gem;
        const design = stone.design;
        let time = stage.baseTime;
        
        // Hardness multiplier: harder stones take longer to cut
        // Base is hardness 7 (quartz), scale from there
        const hardnessMultiplier = Math.pow(gem.hardness / 7, 1.5);
        time *= hardnessMultiplier;
        
        // ===== CARAT-BASED TIMING =====
        // Larger stones take longer (not linear - square root for realistic scaling)
        const caratFactor = stone.caratTimeFactor || Math.sqrt(stone.roughCarats || 2);
        time *= caratFactor;
        
        // ===== Design-based timing =====
        if (design && (stage.name.includes('Cut') || stage.name.includes('Polish'))) {
            // Calculate based on actual facets in this phase
            const phase = stone.cuttingPhase || 'pavilion';
            const phaseData = design[phase];
            
            if (phaseData) {
                // Count total facets in this phase
                let phaseFacets = 0;
                Object.values(phaseData).forEach(tier => {
                    phaseFacets += tier.facetCount || tier.indices?.length || 0;
                });
                
                // Base time per facet based on stage type
                const isPolish = stage.name.includes('Polish');
                const baseTimePerFacet = isPolish ? 
                    this.machineTimings.polishTimePerFacet : 
                    this.machineTimings.cutTimePerFacet;
                
                // Time = (home + angle change + index change + approach + cut + retract) * facets
                const timePerFacet = 
                    this.machineTimings.homeTime / phaseFacets +  // Amortized home time
                    this.machineTimings.angleChangeTime / 4 +     // Angle changes per tier
                    this.machineTimings.indexChangeTime +
                    this.machineTimings.approachTime +
                    baseTimePerFacet +
                    this.machineTimings.retractTime;
                
                time = phaseFacets * timePerFacet * this.config.timeAcceleration;
                
                // Apply hardness AND carat factor to per-facet time
                time *= hardnessMultiplier * caratFactor;
            }
        } else {
            // Legacy: Complexity multiplier for non-design stages
            const facetMultiplier = gem.facetCount > 0 ? (gem.facetCount / 32) : 1;
            if (stage.name.includes('Cut') || stage.name.includes('Polish')) {
                time *= facetMultiplier;
            }
        }
        
        // Special handling for soft stones (opal)
        if (gem.hardness < 6) {
            // Soft stones need gentler (slower) cutting on machine stages
            if (!stage.humanRequired) {
                time *= 1.5;
            }
        }
        
        return time;
    }
    
    /**
     * Check if a failure occurs during a stage
     */
    checkForFailure(stone, stage, machineType) {
        const gem = stone.gem;
        let failureChance = stage.failureChance || 0.02;
        
        // Gem fragility affects failure chance
        failureChance += gem.fragility * 0.1;
        
        // Machine precision reduces failure chance
        failureChance *= (1 - machineType.precision);
        
        // Player skill (level) reduces failure
        const skillReduction = Math.min(this.state.player.level * 0.01, 0.3);
        failureChance *= (1 - skillReduction);
        
        // Roll for failure
        if (Math.random() < failureChance) {
            return {
                failed: true,
                type: stage.failureType || 'unknown',
                recoverable: stage.failureType !== 'dop_flyoff' // Some failures can be recovered
            };
        }
        
        return { failed: false };
    }
    
    /**
     * Handle a cutting failure
     */
    handleCuttingFailure(machine, stone, failureResult) {
        const gem = stone.gem;
        
        stone.failureLog.push({
            stage: stone.currentStage,
            type: failureResult.type,
            time: Date.now()
        });
        
        switch (failureResult.type) {
            case 'dop_flyoff':
                // Stone flew off the dop - catastrophic loss
                this.state.stats.dopFailures++;
                this.state.player.stonesLost++;
                machine.currentStone = null;
                
                if (this.merlin) {
                    const messages = [
                        `Oh no! The ${gem.name} flew off the dop! This is why we always check our dop wax temperature.`,
                        `The stone escaped! Remember: proper dop adhesion is critical. The ${gem.name} is lost.`,
                        `Disaster! The ${gem.name} launched from the dop. Always ensure firm adhesion before cutting.`
                    ];
                    this.merlinSpeak(messages[Math.floor(Math.random() * messages.length)]);
                }
                console.log(`❌ STONE LOST: ${gem.name} flew off dop at ${stone.currentStage}`);
                break;
                
            case 'dop_failure':
                // Dop didn't hold during mounting - restart
                this.state.stats.dopFailures++;
                stone.stageIndex = 0;
                stone.currentStage = this.stageOrder[0];
                stone.stageProgress = 0;
                stone.qualityScore -= 5;
                
                if (this.merlin) {
                    this.merlinSpeak(`The dop wax didn't hold. Let's try mounting the ${gem.name} again. Heat management is key!`);
                }
                break;
                
            case 'transfer_failure':
                // Transfer failed - stone may be damaged but not lost
                this.state.stats.transferFailures++;
                stone.qualityScore -= 20;
                stone.perfectBonus *= 0.8;
                
                // Go back to try transfer again
                stone.stageProgress = 0;
                
                if (stone.qualityScore < 50) {
                    // Too damaged, lose the stone
                    this.state.player.stonesLost++;
                    machine.currentStone = null;
                    if (this.merlin) {
                        this.merlinSpeak(`The ${gem.name} couldn't survive the transfer. Alignment is everything in gem cutting.`);
                    }
                } else {
                    if (this.merlin) {
                        this.merlinSpeak(`Transfer misaligned! The ${gem.name} is damaged but salvageable. Quality reduced.`);
                    }
                }
                break;
                
            case 'alignment_failure':
                // Crown alignment issue - reduces quality
                stone.qualityScore -= 15;
                stone.perfectBonus *= 0.9;
                stone.stageProgress = 0;
                
                if (this.merlin) {
                    this.merlinSpeak(`Crown misaligned with pavilion. This affects brilliance. Re-mounting...`);
                }
                break;
                
            case 'removal_chip':
                // Chipped during removal - partial loss
                stone.qualityScore -= 25;
                stone.perfectBonus *= 0.7;
                
                if (this.merlin) {
                    this.merlinSpeak(`Ouch! A small chip occurred during removal. The ${gem.name} loses some value.`);
                }
                break;
        }
    }
    
    /**
     * Advance stone to next cutting stage
     */
    advanceToNextStage(machine, stone) {
        const prevStage = stone.currentStage;
        stone.stageIndex++;
        stone.stageProgress = 0;
        
        // Check if stone is complete
        if (stone.stageIndex >= this.stageOrder.length) {
            this.completeStone(machine, stone);
            return;
        }
        
        stone.currentStage = this.stageOrder[stone.stageIndex];
        const newStage = this.cuttingStages[stone.currentStage];
        
        // Log stage transition
        console.log(`🔧 ${stone.gem.name}: ${prevStage} → ${stone.currentStage}`);
        
        // ===== CHECK IF ENTERING A HUMAN REQUIRED STAGE =====
        if (newStage.humanRequired) {
            // This stage needs human interaction - will be caught in processRealisticCutting
            console.log(`👤 Entering human stage: ${newStage.name}`);
        }
        
        // ===== CHECK FOR PHASE TRANSITION (pavilion → crown) =====
        if (stone.currentStage === 'transfer') {
            // Transfer stage - switching from pavilion to crown
            stone.cuttingPhase = 'crown';
            stone.currentFacetIndex = 0;
            console.log(`🔄 Phase transition: pavilion → crown`);
        }
        
        // ===== CHECK IF LAP CHANGE NEEDED FOR NEW STAGE =====
        if (newStage.lapType && newStage.lapType !== this.cuttingStages[prevStage]?.lapType) {
            // Different lap type needed
            const lapKey = newStage.lapType.replace('copper_', 'copper');
            const lapType = lapKey === 'coarse' ? 'coarse' : 
                           lapKey.includes('grit') ? lapKey : 'copper';
            
            // Require interaction to change lap
            stone.awaitingInteraction = true;
            stone.interactionType = 'change_lap';
            this.addPendingInteraction(machine.id, 'change_lap', 
                `Stage ${newStage.name} requires ${newStage.lapType} lap. Click to install.`);
            
            if (this.merlin && Math.random() < 0.5) {
                this.merlinSpeak(`Time to change to ${newStage.lapType} lap for ${newStage.name}`);
            }
        }
        
        // Merlin commentary on important stages
        if (this.merlin && Math.random() < 0.3) { // 30% chance to comment
            this.giveStageTip(stone, newStage);
        }
    }
    
    /**
     * Complete a stone - calculate final value and add to per-gem balance
     * Uses carat weight system for realistic valuation
     */
    completeStone(machine, stone) {
        const gem = stone.gem;
        const machineType = this.machineTypes[machine.type];
        
        // ===== CALCULATE FINISHED CARAT WEIGHT =====
        // Start with expected yield, adjust for quality score
        const qualityYieldMod = 0.8 + (stone.qualityScore / 100) * 0.4; // 80-120%
        let finishedCarats = stone.expectedFinishedCarats * qualityYieldMod;
        
        // Random variance (±5%)
        finishedCarats *= 0.95 + (Math.random() * 0.1);
        finishedCarats = Math.max(0.01, finishedCarats); // Minimum 0.01ct
        
        // ===== CALCULATE VALUE BASED ON CARATS =====
        const gemValue = this.gemValues[gem.name] || { base: 10, perfectBonus: 1.5 };
        let valuePerCarat = gemValue.base;
        
        // Apply carat size multiplier
        let caratMultiplier = 1.0;
        for (const [size, data] of Object.entries(this.caratPricing)) {
            if (finishedCarats <= data.maxCarats) {
                caratMultiplier = data.multiplier;
                break;
            }
        }
        valuePerCarat *= caratMultiplier;
        
        // Quality modifier (0-100 becomes 0.5-1.5)
        const qualityMod = 0.5 + (stone.qualityScore / 100);
        valuePerCarat *= qualityMod;
        
        // Design complexity bonus
        const design = stone.design;
        if (design && design.valueMultiplier) {
            valuePerCarat *= design.valueMultiplier;
        }
        
        // Machine production bonus
        valuePerCarat *= machineType.production;
        
        // Room bonus
        const room = this.roomTypes[machine.room];
        if (room) {
            valuePerCarat *= room.bonus;
        }
        
        // Real machine connection bonus
        if (this.realMachineConnected) {
            valuePerCarat *= this.config.realMachineBonus;
        }
        
        // Determine if perfect cut
        const isPerfect = stone.qualityScore >= 95 && stone.perfectBonus >= 1;
        if (isPerfect) {
            valuePerCarat *= gemValue.perfectBonus;
            this.state.stats.perfectCuts++;
        }
        
        // Final value calculation
        const totalValue = Math.floor(valuePerCarat * finishedCarats);
        
        // Calculate cutting time in real minutes
        const cuttingTime = (Date.now() - stone.startTime) / 1000 / 60;
        
        // ===== ADD TO PER-GEM BALANCE =====
        const finishedStone = {
            id: stone.id,
            caratWeight: parseFloat(finishedCarats.toFixed(2)),
            roughCarats: stone.roughCarats,
            yieldPercent: Math.round((finishedCarats / stone.roughCarats) * 100),
            quality: stone.qualityScore,
            isPerfect: isPerfect,
            design: design?.name || 'Standard',
            designId: stone.designId,
            value: totalValue,
            valuePerCarat: Math.round(valuePerCarat),
            cutDate: Date.now(),
            cuttingTime: cuttingTime,
            machineUsed: machine.type
        };
        
        // Initialize gem balance array if needed
        if (!this.state.gemBalance[gem.name]) {
            this.state.gemBalance[gem.name] = [];
        }
        this.state.gemBalance[gem.name].push(finishedStone);
        
        // Track total carats cut
        this.state.player.totalCaratsCut += finishedCarats;
        
        // Award XP for completing the cut
        const xpEarned = Math.floor(totalValue / 4) + Math.floor(cuttingTime * 5) + Math.floor(finishedCarats * 10);
        this.state.player.xp += xpEarned;
        this.state.stats.totalCuts++;
        this.state.player.stonesCompleted++;
        machine.totalCuts++;
        
        // Award tokens based on quality and rarity (for crypto conversion!)
        let tokensEarned = 0;
        if (isPerfect) tokensEarned += 5;
        if (gem.rarity === 'rare') tokensEarned += 3;
        if (gem.rarity === 'legendary') tokensEarned += 10;
        if (finishedCarats >= 2) tokensEarned += 2;
        if (finishedCarats >= 5) tokensEarned += 5;
        this.state.player.tokens += tokensEarned;
        
        // Visual effect
        this.showCutEffect(machine, gem, isPerfect);
        
        // Merlin celebration with detailed info
        if (this.merlin) {
            if (isPerfect) {
                this.merlinCelebrate('perfect_cut', { 
                    gemName: gem.name, 
                    carats: finishedCarats.toFixed(2),
                    value: totalValue 
                });
            } else if (gem.rarity === 'legendary' || gem.rarity === 'rare') {
                this.merlinCelebrate('rare_gem', { 
                    gemName: gem.name,
                    carats: finishedCarats.toFixed(2)
                });
            } else {
                const messages = [
                    `${finishedCarats.toFixed(2)}ct ${gem.name} complete! Worth ${totalValue} gems (${Math.round(valuePerCarat)}/ct). Quality: ${stone.qualityScore}%`,
                    `Finished ${finishedCarats.toFixed(2)}ct ${gem.name} in ${cuttingTime.toFixed(1)} min. ${stone.yieldPercent || Math.round((finishedCarats/stone.roughCarats)*100)}% yield from ${stone.roughCarats.toFixed(2)}ct rough.`,
                    `+${tokensEarned} tokens earned! Your ${gem.name} collection: ${this.state.gemBalance[gem.name].length} stones`
                ];
                this.merlinSpeak(messages[Math.floor(Math.random() * messages.length)]);
            }
            
            // Occasionally remind about crypto conversion
            if (this.state.player.tokens >= 100 && Math.random() < 0.1) {
                setTimeout(() => {
                    this.merlinSpeak(`💎 You have ${this.state.player.tokens} tokens! Remember, these can be converted to real crypto rewards for your time invested!`);
                }, 3000);
            }
        }
        
        console.log(`✅ COMPLETED: ${finishedCarats.toFixed(2)}ct ${gem.name} | Value: ${totalValue} (${Math.round(valuePerCarat)}/ct) | Quality: ${stone.qualityScore}% | Yield: ${Math.round((finishedCarats/stone.roughCarats)*100)}% | Perfect: ${isPerfect} | +${tokensEarned} tokens`);
        
        // Callback
        if (this.onGemCut) {
            this.onGemCut({
                machine,
                gem,
                finishedCarats,
                roughCarats: stone.roughCarats,
                value: totalValue,
                valuePerCarat: Math.round(valuePerCarat),
                perfect: isPerfect,
                quality: stone.qualityScore,
                cuttingTime,
                tokensEarned,
                designName: design?.name
            });
        }
        
        // Clear current stone
        machine.currentStone = null;
        
        // Auto-save after completing a stone
        this.saveState();
    }
    
    /**
     * Give Merlin tip about current stage
     */
    giveStageTip(stone, stage) {
        const tips = {
            'prep_rough': [
                'Always examine the rough for inclusions before starting. They can cause fractures!',
                'Orientation matters - find the best axis for color and brilliance.',
                'Clean your rough thoroughly. Dirt can scratch your laps.'
            ],
            'dop_stone': [
                'Temperature is key! Too hot and the wax burns, too cold and it won\'t bond.',
                'Center the stone carefully - misalignment compounds through every stage.',
                'Let the dop cool slowly. Quick cooling can stress the stone.'
            ],
            'transfer_dop': [
                'This is the riskiest moment! Heat both dops evenly for a clean transfer.',
                'Alignment here determines final symmetry. Take your time.',
                'Keep the pavilion supported while releasing. One moment of carelessness...'
            ],
            'cut_pavilion_600': [
                'The 600 grit removes material quickly. Check your angles frequently.',
                'Each facet must meet precisely at the culet. Patience!',
                'Watch your depth - too deep and you lose size, too shallow and no brilliance.'
            ],
            'polish_pavilion_50k': [
                'We\'re in the high polish range now. Any scratch here will show.',
                'Keep your laps clean! One contaminated lap ruins hours of work.',
                'The sound changes when you reach a true polish. Listen carefully.'
            ],
            'cut_crown_600': [
                'Crown angles affect fire and brilliance. Each degree matters.',
                'Star facets should touch precisely at the table edge.',
                'Check your meet points after each facet. Cumulative errors are unforgiving.'
            ],
            'cut_table': [
                'A perfectly flat table is harder than it looks. Check with a loupe.',
                'The table should be parallel to the girdle. Any tilt shows immediately.',
                'Size matters - too large loses brilliance, too small looks odd.'
            ]
        };
        
        const stageTips = tips[stage.name?.toLowerCase().replace(/[()]/g, '')] || tips[stone.currentStage];
        if (stageTips) {
            this.merlinSpeak(stageTips[Math.floor(Math.random() * stageTips.length)]);
        }
    }
    
    /**
     * Update machine visuals based on cutting progress
     */
    updateMachineVisuals(machine, stone, stage) {
        if (!machine.statusMat) return;
        
        // Update status light color based on stage type
        if (stage.humanRequired) {
            // Yellow for human interaction needed
            machine.statusMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0);
        } else if (stage.lapType?.includes('polish')) {
            // Cyan for polishing
            machine.statusMat.emissiveColor = new BABYLON.Color3(0, 1, 1);
        } else if (stage.lapType?.includes('grit')) {
            // Blue for cutting
            machine.statusMat.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
        } else {
            // Green for normal operation
            machine.statusMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        }
    }
    
    /**
     * Get current cutting status for UI display
     */
    getCuttingStatus(machine) {
        if (!machine.currentStone) {
            return { status: 'idle', message: 'Waiting for rough...' };
        }
        
        const stone = machine.currentStone;
        const stage = this.cuttingStages[stone.currentStage];
        const stageTime = this.calculateStageTime(stone, stage, this.machineTypes[machine.type]);
        const progress = Math.min(100, (stone.stageProgress / stageTime) * 100);
        
        return {
            status: 'cutting',
            gemName: stone.gem.name,
            gemColor: stone.gem.color,
            stage: stage.name,
            stageDescription: stage.description,
            progress: progress,
            qualityScore: stone.qualityScore,
            humanRequired: stage.humanRequired,
            stageIndex: stone.stageIndex + 1,
            totalStages: this.stageOrder.length,
            lapType: stage.lapType || 'N/A'
        };
    }
    
    /**
     * Legacy processCut method for compatibility - redirects to realistic system
     */
    processCut(machine) {
        // This method is now handled by processRealisticCutting
        // Kept for backward compatibility with any external calls
        this.processRealisticCutting(machine, this.config.timeAcceleration);
    }
    
    /**
     * Show visual effect for gem cut
     */
    showCutEffect(machine, gem, isPerfect) {
        if (!this.scene || !machine.mesh) return;
        
        // Create floating gem
        const gemMesh = BABYLON.MeshBuilder.CreatePolyhedron(
            'cutGem',
            { type: 2, size: 0.3 },
            this.scene
        );
        gemMesh.position = machine.mesh.position.clone();
        gemMesh.position.y += 3;
        
        const gemMat = new BABYLON.StandardMaterial('cutGemMat', this.scene);
        gemMat.emissiveColor = BABYLON.Color3.FromHexString(gem.color);
        gemMat.diffuseColor = BABYLON.Color3.FromHexString(gem.color);
        gemMesh.material = gemMat;
        
        // Animate up and fade
        let frame = 0;
        const animation = () => {
            if (frame < 60) {
                gemMesh.position.y += 0.05;
                gemMesh.rotation.y += 0.1;
                gemMat.alpha = 1 - (frame / 60);
                frame++;
            } else {
                gemMesh.dispose();
                this.scene.unregisterBeforeRender(animation);
            }
        };
        this.scene.registerBeforeRender(animation);
        
        // Flash status light
        if (machine.statusMat) {
            machine.statusMat.emissiveColor = isPerfect 
                ? new BABYLON.Color3(1, 1, 0) 
                : BABYLON.Color3.FromHexString(gem.color);
            
            setTimeout(() => {
                if (machine.statusMat) {
                    machine.statusMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
                }
            }, 200);
        }
    }
    
    /**
     * Get production multiplier from all sources
     */
    getProductionMultiplier() {
        let mult = this.config.baseProductionRate;
        
        // Level bonus
        mult *= 1 + (this.state.player.level * 0.1);
        
        // Room bonus
        const currentRoom = this.roomTypes[this.state.rooms[this.state.rooms.length - 1]];
        if (currentRoom) {
            mult *= currentRoom.bonus;
        }
        
        // Real machine bonus
        if (this.realMachineConnected) {
            mult *= this.config.realMachineBonus;
        }
        
        return mult;
    }
    
    /**
     * Check and process level up
     */
    checkLevelUp() {
        while (this.state.player.xp >= this.state.player.xpToNext) {
            this.state.player.xp -= this.state.player.xpToNext;
            this.state.player.level++;
            this.state.player.xpToNext = Math.floor(100 * Math.pow(1.5, this.state.player.level - 1));
            
            // Award tokens on level up
            const tokenReward = this.state.player.level * 5;
            this.state.player.tokens += tokenReward;
            
            if (this.onLevelUp) {
                this.onLevelUp(this.state.player.level);
            }
            
            console.log(`🎉 Level up! Now level ${this.state.player.level}, earned ${tokenReward} tokens`);
        }
    }
    
    // ==================== SHOP & INVENTORY SYSTEM ====================
    
    /**
     * Buy rough stones from the shop
     * Uses roughPerCarat pricing with random carat weight per piece
     */
    buyRough(gemName, quantity = 1) {
        const pricePerCarat = this.shopPrices.roughPerCarat[gemName];
        if (!pricePerCarat) {
            console.error(`Unknown gem type: ${gemName}`);
            return { success: false, message: 'Unknown gem type' };
        }
        
        // Check if player level allows this gem
        const gem = this.gemTypes.find(g => g.name === gemName);
        if (gem) {
            if (gem.rarity === 'legendary' && this.state.player.level < 15) {
                return { success: false, message: 'Need level 15 to buy legendary stones!' };
            }
            if (gem.rarity === 'rare' && this.state.player.level < 8) {
                return { success: false, message: 'Need level 8 to buy rare stones!' };
            }
            if (gem.rarity === 'uncommon' && this.state.player.level < 3) {
                return { success: false, message: 'Need level 3 to buy uncommon stones!' };
            }
        }
        
        // Check storage capacity
        const currentRoughCount = Object.values(this.state.inventory.rough)
            .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        const maxRough = this.inventoryUpgrades?.rough_storage?.levels?.[this.state.upgradelevels?.rough_storage || 0]?.maxRough || 20;
        
        if (currentRoughCount + quantity > maxRough) {
            return { success: false, message: `Rough storage full! (${currentRoughCount}/${maxRough})` };
        }
        
        // Calculate total cost (random carat weight per piece, 1-3ct range for shop purchases)
        let totalCost = 0;
        const purchasedStones = [];
        
        for (let i = 0; i < quantity; i++) {
            const carats = Math.round((1 + Math.random() * 2) * 100) / 100; // 1-3ct, rounded to 2 decimals
            const stoneCost = Math.ceil(pricePerCarat * carats);
            totalCost += stoneCost;
            purchasedStones.push({ carats, cost: stoneCost });
        }
        
        if (this.state.player.gems < totalCost) {
            return { success: false, message: `Not enough gems! Need ${totalCost}, have ${this.state.player.gems}` };
        }
        
        // Deduct cost
        this.state.player.gems -= totalCost;
        
        // Ensure array exists for this gem type
        if (!Array.isArray(this.state.inventory.rough[gemName])) {
            this.state.inventory.rough[gemName] = [];
        }
        
        // Add stones to inventory
        purchasedStones.forEach(stone => {
            this.state.inventory.rough[gemName].push({
                carats: stone.carats,
                quality: 'good',
                purchasedAt: Date.now(),
                purchasePrice: stone.cost
            });
        });
        
        const totalCarats = purchasedStones.reduce((sum, s) => sum + s.carats, 0).toFixed(2);
        console.log(`🛒 Bought ${quantity}x ${gemName} rough (${totalCarats}ct total) for ${totalCost} gems`);
        if (this.merlin) {
            this.merlinSpeak(`Excellent purchase! ${quantity} ${gemName} rough (${totalCarats}ct) added to your inventory.`);
        }
        
        this.saveState();
        return { success: true, message: `Purchased ${quantity}x ${gemName} (${totalCarats}ct)`, cost: totalCost };
    }
    
    /**
     * Sell a cut stone from gem balance
     * @param {string} gemName - Name of the gem type
     * @param {number} stoneIndex - Index in that gem's array
     */
    sellCutStone(gemName, stoneIndex) {
        if (!this.state.gemBalance[gemName] || stoneIndex < 0 || stoneIndex >= this.state.gemBalance[gemName].length) {
            return { success: false, message: 'Invalid stone' };
        }
        
        const stone = this.state.gemBalance[gemName][stoneIndex];
        const salePrice = stone.value;
        
        // Add to player gems
        this.state.player.gems += salePrice;
        this.state.player.totalGemsEver += salePrice;
        this.state.stats.stonesSold++;
        this.state.stats.totalSalesValue += salePrice;
        
        // Remove from gem balance
        this.state.gemBalance[gemName].splice(stoneIndex, 1);
        
        console.log(`💰 Sold ${stone.caratWeight}ct ${gemName} (${stone.quality}% quality) for ${salePrice} gems`);
        if (this.merlin) {
            if (stone.isPerfect) {
                this.merlinSpeak(`A masterpiece sold! ${salePrice} gems for that perfect ${stone.caratWeight}ct ${gemName}!`);
            } else {
                this.merlinSpeak(`${stone.caratWeight}ct ${gemName} sold for ${salePrice} gems. Your balance: ${this.state.player.gems}`);
            }
        }
        
        // Auto-save after sale
        this.saveState();
        
        return { success: true, message: `Sold for ${salePrice} gems`, value: salePrice, stone };
    }
    
    /**
     * Sell all stones of a specific gem type
     */
    sellAllOfGem(gemName) {
        const stones = this.state.gemBalance[gemName];
        if (!stones || stones.length === 0) {
            return { success: false, message: `No ${gemName} stones to sell!` };
        }
        
        let totalValue = stones.reduce((sum, s) => sum + s.value, 0);
        let totalCarats = stones.reduce((sum, s) => sum + s.caratWeight, 0);
        let count = stones.length;
        
        this.state.player.gems += totalValue;
        this.state.player.totalGemsEver += totalValue;
        this.state.stats.stonesSold += count;
        this.state.stats.totalSalesValue += totalValue;
        this.state.gemBalance[gemName] = [];
        
        console.log(`💰 Sold all ${gemName}: ${count} stones (${totalCarats.toFixed(2)}ct) for ${totalValue} gems!`);
        if (this.merlin) {
            this.merlinSpeak(`${count} ${gemName} stones (${totalCarats.toFixed(2)} total carats) sold for ${totalValue} gems!`);
        }
        
        this.saveState();
        return { success: true, count, totalCarats, totalValue };
    }
    
    /**
     * Sell ALL cut stones across all gem types
     */
    sellAllCutStones() {
        let totalValue = 0;
        let totalCount = 0;
        let totalCarats = 0;
        
        Object.entries(this.state.gemBalance).forEach(([gemName, stones]) => {
            if (stones.length > 0) {
                const gemValue = stones.reduce((sum, s) => sum + s.value, 0);
                const gemCarats = stones.reduce((sum, s) => sum + s.caratWeight, 0);
                totalValue += gemValue;
                totalCarats += gemCarats;
                totalCount += stones.length;
            }
        });
        
        if (totalCount === 0) {
            return { success: false, message: 'No stones to sell!' };
        }
        
        this.state.player.gems += totalValue;
        this.state.player.totalGemsEver += totalValue;
        this.state.stats.stonesSold += totalCount;
        this.state.stats.totalSalesValue += totalValue;
        
        // Clear all gem balances
        Object.keys(this.state.gemBalance).forEach(gemName => {
            this.state.gemBalance[gemName] = [];
        });
        
        console.log(`💰 MEGA SALE: ${totalCount} stones (${totalCarats.toFixed(2)}ct) for ${totalValue} gems!`);
        if (this.merlin) {
            this.merlinSpeak(`💎 MASSIVE SALE! ${totalCount} gems totaling ${totalCarats.toFixed(2)} carats sold for ${totalValue} gems! You're building wealth!`);
        }
        
        this.saveState();
        return { success: true, count: totalCount, totalCarats, totalValue };
    }
    
    /**
     * Buy rough stone with specific carat weight (advanced purchase)
     */
    buyRoughWithCarats(gemName, carats = null, quality = 'good') {
        const pricePerCarat = this.shopPrices.roughPerCarat[gemName];
        if (!pricePerCarat) {
            return { success: false, message: 'Unknown gem type' };
        }
        
        // Check level requirements
        const gem = this.gemTypes.find(g => g.name === gemName);
        if (gem) {
            if (gem.rarity === 'legendary' && this.state.player.level < 15) {
                return { success: false, message: 'Requires level 15!' };
            }
            if (gem.rarity === 'rare' && this.state.player.level < 8) {
                return { success: false, message: 'Requires level 8!' };
            }
            if (gem.rarity === 'uncommon' && this.state.player.level < 3) {
                return { success: false, message: 'Requires level 3!' };
            }
        }
        
        // Random carat weight if not specified (1-5ct range)
        if (!carats) {
            carats = 1 + Math.random() * 4;
        }
        carats = Math.round(carats * 100) / 100; // Round to 2 decimal places
        
        const totalPrice = Math.ceil(pricePerCarat * carats);
        
        if (this.state.player.gems < totalPrice) {
            return { success: false, message: `Not enough gems! Need ${totalPrice} for ${carats}ct ${gemName}` };
        }
        
        // Check storage capacity
        const currentRoughCount = Object.values(this.state.inventory.rough)
            .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        const maxRough = this.inventoryUpgrades?.rough_storage?.levels?.[this.state.upgradelevels?.rough_storage || 0]?.maxRough || 20;
        
        if (currentRoughCount >= maxRough) {
            return { success: false, message: `Rough storage full! Upgrade or use some stones. (${currentRoughCount}/${maxRough})` };
        }
        
        this.state.player.gems -= totalPrice;
        
        // Ensure array exists
        if (!Array.isArray(this.state.inventory.rough[gemName])) {
            this.state.inventory.rough[gemName] = [];
        }
        
        // Add rough piece
        this.state.inventory.rough[gemName].push({
            carats: carats,
            quality: quality,
            purchasedAt: Date.now(),
            purchasePrice: totalPrice
        });
        
        console.log(`💎 Purchased ${carats}ct ${gemName} rough (${quality}) for ${totalPrice} gems`);
        if (this.merlin && Math.random() < 0.3) {
            const messages = [
                `${carats}ct of ${gemName} rough acquired! ${quality} quality should yield nicely.`,
                `New rough in inventory! This ${carats}ct ${gemName} should cut beautifully.`,
                `Good choice! ${gemName} is ${gem?.description || 'a fine material to work with'}.`
            ];
            this.merlinSpeak(messages[Math.floor(Math.random() * messages.length)]);
        }
        
        this.state.player.isSearching = false;
        this.saveState();
        
        return { success: true, carats, quality, price: totalPrice };
    }
    
    /**
     * Convert tokens to crypto rewards
     */
    convertTokensToCrypto(tokenAmount) {
        const { tokensPerCrypto, minTokensToConvert, conversionFee } = this.config.cryptoConversion;
        
        if (tokenAmount < minTokensToConvert) {
            return { success: false, message: `Minimum ${minTokensToConvert} tokens required for conversion` };
        }
        
        if (this.state.player.tokens < tokenAmount) {
            return { success: false, message: `Not enough tokens! You have ${this.state.player.tokens}` };
        }
        
        // Calculate crypto amount (after fee)
        const grossCrypto = tokenAmount / tokensPerCrypto;
        const fee = grossCrypto * conversionFee;
        const netCrypto = grossCrypto - fee;
        
        // Deduct tokens
        this.state.player.tokens -= tokenAmount;
        this.state.player.cryptoEarned += netCrypto;
        
        console.log(`🪙 Converted ${tokenAmount} tokens → ${netCrypto.toFixed(4)} crypto (${(conversionFee * 100)}% fee)`);
        
        if (this.merlin) {
            this.merlinSpeak(`💰 Tokens converted to crypto! ${tokenAmount} tokens = ${netCrypto.toFixed(4)} crypto. Your time in the gem workshop has real value!`);
        }
        
        this.saveState();
        
        return { 
            success: true, 
            tokensSpent: tokenAmount, 
            cryptoEarned: netCrypto,
            fee: fee,
            totalCryptoEarned: this.state.player.cryptoEarned
        };
    }
    
    /**
     * Get gem balance summary for UI
     */
    getGemBalanceSummary() {
        const summary = {};
        let totalStones = 0;
        let totalCarats = 0;
        let totalValue = 0;
        
        Object.entries(this.state.gemBalance).forEach(([gemName, stones]) => {
            if (stones.length > 0) {
                const gemCarats = stones.reduce((sum, s) => sum + s.caratWeight, 0);
                const gemValue = stones.reduce((sum, s) => sum + s.value, 0);
                const gem = this.gemTypes.find(g => g.name === gemName);
                
                summary[gemName] = {
                    count: stones.length,
                    totalCarats: gemCarats,
                    totalValue: gemValue,
                    avgQuality: Math.round(stones.reduce((sum, s) => sum + s.quality, 0) / stones.length),
                    perfectCount: stones.filter(s => s.isPerfect).length,
                    color: gem?.color || '#888888',
                    stones: stones
                };
                
                totalStones += stones.length;
                totalCarats += gemCarats;
                totalValue += gemValue;
            }
        });
        
        return {
            byGem: summary,
            totals: {
                stones: totalStones,
                carats: totalCarats.toFixed(2),
                value: totalValue
            }
        };
    }
    
    /**
     * Get rough inventory summary for UI
     */
    getRoughInventorySummary() {
        const summary = {};
        let totalPieces = 0;
        let totalCarats = 0;
        
        Object.entries(this.state.inventory.rough).forEach(([gemName, pieces]) => {
            if (Array.isArray(pieces) && pieces.length > 0) {
                const gemCarats = pieces.reduce((sum, p) => sum + p.carats, 0);
                const gem = this.gemTypes.find(g => g.name === gemName);
                
                summary[gemName] = {
                    count: pieces.length,
                    totalCarats: gemCarats,
                    avgCarats: (gemCarats / pieces.length).toFixed(2),
                    color: gem?.color || '#888888',
                    pieces: pieces
                };
                
                totalPieces += pieces.length;
                totalCarats += gemCarats;
            }
        });
        
        const maxRough = this.inventoryUpgrades.rough_storage.levels[this.state.upgradelevels?.rough_storage || 0]?.maxRough || 20;
        
        return {
            byGem: summary,
            totals: {
                pieces: totalPieces,
                carats: totalCarats.toFixed(2),
                capacity: maxRough,
                capacityUsed: `${totalPieces}/${maxRough}`
            }
        };
    }
    
    // ==================== SEARCHING FOR ROUGH ====================
    
    /**
     * Go searching for rough when out of money and materials
     * This is a "grinding" mechanic - takes time but yields free rough
     */
    goSearching() {
        // Check if already searching
        if (this.state.player.isSearching) {
            const timeRemaining = Math.max(0, (this.state.player.searchEndTime || 0) - Date.now());
            if (timeRemaining > 0) {
                const secondsLeft = Math.ceil(timeRemaining / 1000);
                return { 
                    success: false, 
                    message: `Already searching! ${secondsLeft} seconds remaining.`,
                    timeRemaining: timeRemaining
                };
            }
        }
        
        // Start new search - takes 60 seconds (accelerated by timeAcceleration)
        const searchDuration = 60000 / this.config.timeAcceleration; // 1 second real time at 60x
        
        this.state.player.isSearching = true;
        this.state.player.searchStartTime = Date.now();
        this.state.player.searchEndTime = Date.now() + searchDuration;
        
        if (this.merlin) {
            this.merlinSpeak('Time to go rockhounding! This might take a while, but you might find some nice rough...');
        }
        
        console.log('🔍 Started searching for rough...');
        
        return { 
            success: true, 
            message: `Searching started! Check back in ${Math.ceil(searchDuration / 1000)} seconds for results.`,
            searchStartTime: Date.now(),
            searchEndTime: this.state.player.searchEndTime
        };
    }
    
    /**
     * Complete a search attempt - called by game loop or manually
     * Chance to find various rough based on player level
     */
    completeSearch() {
        if (!this.state.player.isSearching) {
            return { success: false, message: 'Not currently searching' };
        }
        
        // Check if search time is complete
        const timeRemaining = (this.state.player.searchEndTime || 0) - Date.now();
        if (timeRemaining > 0) {
            const secondsLeft = Math.ceil(timeRemaining / 1000);
            return { 
                success: false, 
                message: `Still searching! ${secondsLeft} seconds remaining.`,
                timeRemaining: timeRemaining
            };
        }
        
        const finds = [];
        const playerLevel = this.state.player.level;
        
        // Base chance to find something (improves with level)
        const findChance = 0.3 + (playerLevel * 0.02); // 30-50% base chance
        
        // Common finds
        const commonGems = ['Quartz (Amethyst)', 'Quartz (Citrine)', 'Garnet'];
        const uncommonGems = ['Topaz', 'Emerald'];
        const rareGems = ['Ruby', 'Sapphire', 'Opal'];
        const legendaryGems = ['Diamond', 'Alexandrite'];
        
        // Roll for finds (1-3 pieces possible)
        const numRolls = 1 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numRolls; i++) {
            if (Math.random() < findChance) {
                let gemName;
                let quality;
                const roll = Math.random();
                
                // What did we find?
                if (roll < 0.6) {
                    // Common (60%)
                    gemName = commonGems[Math.floor(Math.random() * commonGems.length)];
                    quality = ['poor', 'fair', 'good'][Math.floor(Math.random() * 3)];
                } else if (roll < 0.85 && playerLevel >= 3) {
                    // Uncommon (25%)
                    gemName = uncommonGems[Math.floor(Math.random() * uncommonGems.length)];
                    quality = ['poor', 'fair', 'fair'][Math.floor(Math.random() * 3)];
                } else if (roll < 0.97 && playerLevel >= 8) {
                    // Rare (12%)
                    gemName = rareGems[Math.floor(Math.random() * rareGems.length)];
                    quality = ['poor', 'fair'][Math.floor(Math.random() * 2)];
                } else if (playerLevel >= 15) {
                    // Legendary (3%)
                    gemName = legendaryGems[Math.floor(Math.random() * legendaryGems.length)];
                    quality = 'poor'; // Always poor quality finds for legendary
                } else {
                    // Nothing on this roll
                    continue;
                }
                
                // Random small size (found rough is usually small)
                const carats = 0.5 + Math.random() * 2; // 0.5-2.5ct
                
                // Ensure array exists
                if (!Array.isArray(this.state.inventory.rough[gemName])) {
                    this.state.inventory.rough[gemName] = [];
                }
                
                // Add to inventory
                this.state.inventory.rough[gemName].push({
                    carats: Math.round(carats * 100) / 100,
                    quality: quality,
                    foundWhileSearching: true,
                    foundAt: Date.now()
                });
                
                finds.push({ gemName, carats: Math.round(carats * 100) / 100, quality });
            }
        }
        
        this.state.player.isSearching = false;
        
        // Award XP for searching
        const searchXP = 5 + finds.length * 3;
        this.state.player.xp += searchXP;
        
        // Report findings
        if (finds.length > 0) {
            console.log(`🔍 Search complete! Found:`, finds);
            if (this.merlin) {
                const findList = finds.map(f => `${f.carats}ct ${f.gemName} (${f.quality})`).join(', ');
                this.merlinSpeak(`Great finds! You discovered: ${findList}. Time to get cutting!`);
            }
        } else {
            console.log('🔍 Search complete - nothing found this time');
            if (this.merlin) {
                this.merlinSpeak('No luck this time. Keep searching or buy some rough from the shop!');
            }
        }
        
        this.saveState();
        
        return { 
            success: true, 
            found: finds,
            totalFinds: finds.length,
            xpEarned: searchXP
        };
    }
    
    /**
     * Check if player is broke (no money AND no rough)
     */
    isBroke() {
        const totalRough = Object.values(this.state.inventory.rough)
            .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        
        const totalCutValue = Object.values(this.state.gemBalance)
            .reduce((sum, arr) => sum + arr.reduce((s, stone) => s + (stone.value || 0), 0), 0);
        
        return this.state.player.gems < 5 && totalRough === 0 && totalCutValue === 0;
    }
    
    /**
     * Buy a new lap or replace worn one
     */
    buyLap(lapType) {
        const price = this.shopPrices.laps[lapType];
        if (!price) {
            return { success: false, message: 'Unknown lap type' };
        }
        
        if (this.state.player.gems < price) {
            return { success: false, message: `Not enough gems! Need ${price}` };
        }
        
        this.state.player.gems -= price;
        this.state.laps[lapType] = { condition: 100, owned: true };
        if (lapType === 'copper') {
            this.state.laps[lapType].currentPaste = null;
        }
        this.state.stats.lapsReplaced++;
        
        console.log(`🔧 Purchased new ${lapType} lap for ${price} gems`);
        if (this.merlin) {
            this.merlinSpeak(`Fresh ${lapType} lap installed! 100% cutting efficiency restored.`);
        }
        
        return { success: true, message: `New ${lapType} lap ready!` };
    }
    
    /**
     * Buy polishing paste
     */
    buyPaste(grit, quantity = 1) {
        const price = this.shopPrices.paste[grit];
        if (!price) {
            return { success: false, message: 'Unknown paste grit' };
        }
        
        const totalCost = price * quantity;
        if (this.state.player.gems < totalCost) {
            return { success: false, message: `Not enough gems! Need ${totalCost}` };
        }
        
        this.state.player.gems -= totalCost;
        this.state.paste[grit] = (this.state.paste[grit] || 0) + (quantity * 10); // Buy in units of 10
        
        console.log(`🧴 Bought ${quantity * 10} units of ${grit} paste for ${totalCost} gems`);
        
        return { success: true, message: `Purchased ${grit} diamond paste` };
    }
    
    /**
     * Charge copper lap with paste
     */
    chargeCopperLap(grit) {
        const pasteUnits = this.state.paste[grit] || 0;
        const required = this.consumptionRates.pastePerCharge;
        
        if (pasteUnits < required) {
            return { success: false, message: `Not enough ${grit} paste! Need ${required}, have ${pasteUnits}` };
        }
        
        if (!this.state.laps.copper.owned) {
            return { success: false, message: 'No copper lap owned!' };
        }
        
        this.state.paste[grit] -= required;
        this.state.laps.copper.currentPaste = grit;
        
        console.log(`✨ Copper lap charged with ${grit} diamond paste`);
        if (this.merlin) {
            this.merlinSpeak(`Copper lap charged with ${grit} paste. Ready for polishing!`);
        }
        
        return { success: true, message: `Lap charged with ${grit} paste` };
    }
    
    /**
     * Buy consumables (dop wax, water, lubricant)
     */
    buyConsumable(type, quantity = 1) {
        const prices = this.shopPrices.consumables;
        let price, amount;
        
        switch(type) {
            case 'dopWax':
                price = prices.dopWax * quantity;
                amount = 10 * quantity; // Buy in units of 10
                break;
            case 'water':
                price = prices.water * quantity;
                amount = 25 * quantity; // Refill 25% per purchase
                break;
            case 'lubricant':
                price = prices.lubricant * quantity;
                amount = 25 * quantity;
                break;
            default:
                return { success: false, message: 'Unknown consumable type' };
        }
        
        if (this.state.player.gems < price) {
            return { success: false, message: `Not enough gems! Need ${price}` };
        }
        
        this.state.player.gems -= price;
        
        if (type === 'dopWax') {
            this.state.inventory.consumables.dopWax += amount;
        } else if (type === 'water') {
            this.state.inventory.consumables.water = Math.min(100, this.state.inventory.consumables.water + amount);
            this.state.stats.waterRefills++;
        } else if (type === 'lubricant') {
            this.state.inventory.consumables.lubricant = Math.min(100, this.state.inventory.consumables.lubricant + amount);
        }
        
        console.log(`🛒 Purchased ${type}: +${amount}`);
        
        return { success: true, message: `Purchased ${type}` };
    }
    
    /**
     * Get shop inventory with prices
     */
    getShopInventory() {
        return {
            rough: Object.entries(this.shopPrices.roughPerCarat).map(([name, pricePerCarat]) => {
                const gem = this.gemTypes.find(g => g.name === name);
                const currentStock = this.state.inventory.rough[name];
                const stockCount = Array.isArray(currentStock) ? currentStock.length : 0;
                return {
                    name,
                    pricePerCarat,
                    examplePrice: Math.ceil(pricePerCarat * 2.5), // For a 2.5ct stone
                    rarity: gem?.rarity || 'common',
                    color: gem?.color,
                    levelRequired: gem?.rarity === 'legendary' ? 15 : 
                                   gem?.rarity === 'rare' ? 8 : 
                                   gem?.rarity === 'uncommon' ? 3 : 1,
                    canBuy: this.canBuyGem(name),
                    currentStock: stockCount
                };
            }),
            cutGems: this.getGemBalanceSummary(),
            laps: Object.entries(this.shopPrices.laps).map(([type, price]) => ({
                type,
                price,
                currentCondition: this.state.laps[type]?.condition || 0
            })),
            paste: Object.entries(this.shopPrices.paste).map(([grit, price]) => ({
                grit,
                pricePerUnit: price,
                currentStock: this.state.paste[grit] || 0
            })),
            consumables: {
                dopWax: { price: this.shopPrices.consumables.dopWax, per: 10, current: this.state.inventory.consumables.dopWax },
                water: { price: this.shopPrices.consumables.water, per: '25%', current: this.state.inventory.consumables.water },
                lubricant: { price: this.shopPrices.consumables.lubricant, per: '25%', current: this.state.inventory.consumables.lubricant }
            },
            cryptoInfo: {
                tokensAvailable: this.state.player.tokens,
                conversionRate: `${this.config.cryptoConversion.tokensPerCrypto} tokens = 1 crypto`,
                minToConvert: this.config.cryptoConversion.minTokensToConvert,
                fee: `${this.config.cryptoConversion.conversionFee * 100}%`,
                totalCryptoEarned: this.state.player.cryptoEarned
            }
        };
    }
    
    /**
     * Check if player can buy a specific gem
     */
    canBuyGem(gemName) {
        const gem = this.gemTypes.find(g => g.name === gemName);
        if (!gem) return false;
        
        if (gem.rarity === 'legendary') return this.state.player.level >= 15;
        if (gem.rarity === 'rare') return this.state.player.level >= 8;
        if (gem.rarity === 'uncommon') return this.state.player.level >= 3;
        return true;
    }
    
    // ==================== DESIGNS AND UPGRADES ====================
    
    /**
     * Unlock a new gem shape
     */
    unlockShape(shapeId) {
        const shape = this.shapes[shapeId];
        if (!shape) {
            return { success: false, message: 'Unknown shape' };
        }
        
        if (this.state.unlockedShapes.includes(shapeId)) {
            return { success: false, message: 'Shape already unlocked' };
        }
        
        if (this.state.player.level < shape.levelRequired) {
            return { success: false, message: `Requires level ${shape.levelRequired}` };
        }
        
        // Shape unlock costs scale with difficulty
        const unlockCost = Math.floor(100 * shape.baseDifficulty);
        if (this.state.player.gems < unlockCost) {
            return { success: false, message: `Not enough gems! Need ${unlockCost}` };
        }
        
        this.state.player.gems -= unlockCost;
        this.state.unlockedShapes.push(shapeId);
        
        if (this.merlin) {
            this.merlinSpeak(`New shape unlocked: ${shapeId}! More cutting possibilities available.`);
        }
        
        return { success: true, message: `Unlocked ${shapeId} shape` };
    }
    
    /**
     * Unlock a new faceting design
     */
    unlockDesign(designId) {
        const design = this.designs[designId];
        if (!design) {
            return { success: false, message: 'Unknown design' };
        }
        
        if (this.state.unlockedDesigns.includes(designId)) {
            return { success: false, message: 'Design already unlocked' };
        }
        
        if (this.state.player.level < design.levelRequired) {
            return { success: false, message: `Requires level ${design.levelRequired}` };
        }
        
        // Design unlock costs based on facet count and value multiplier
        const unlockCost = Math.floor(design.totalFacets * 10 * design.valueMultiplier);
        if (this.state.player.gems < unlockCost) {
            return { success: false, message: `Not enough gems! Need ${unlockCost}` };
        }
        
        this.state.player.gems -= unlockCost;
        this.state.unlockedDesigns.push(designId);
        
        if (this.merlin) {
            this.merlinSpeak(`New design learned: ${design.name}! ${design.totalFacets} facets - ${design.description || ''}`);
        }
        
        return { success: true, message: `Unlocked ${design.name}` };
    }
    
    /**
     * Purchase inventory upgrade
     */
    purchaseUpgrade(upgradeType) {
        const upgrade = this.inventoryUpgrades[upgradeType];
        if (!upgrade) {
            return { success: false, message: 'Unknown upgrade type' };
        }
        
        const currentLevel = this.state.upgradelevels[upgradeType] || 0;
        if (currentLevel >= upgrade.maxLevel) {
            return { success: false, message: 'Already at max level' };
        }
        
        const levelData = upgrade.levels[currentLevel];
        if (this.state.player.gems < levelData.cost) {
            return { success: false, message: `Not enough gems! Need ${levelData.cost}` };
        }
        
        this.state.player.gems -= levelData.cost;
        this.state.upgradelevels[upgradeType] = currentLevel + 1;
        
        // Apply upgrade effects
        this.applyUpgradeEffect(upgradeType, currentLevel + 1);
        
        if (this.merlin) {
            this.merlinSpeak(`${upgrade.name} upgraded to level ${currentLevel + 1}! ${levelData.description || ''}`);
        }
        
        return { success: true, message: `Upgraded ${upgrade.name}` };
    }
    
    /**
     * Apply upgrade effect
     */
    applyUpgradeEffect(upgradeType, level) {
        const upgrade = this.inventoryUpgrades[upgradeType];
        const levelData = upgrade.levels[level - 1];
        
        switch(upgradeType) {
            case 'water_tank':
                // Water capacity increased - will be checked in checkWaterLevel()
                break;
            case 'lap_storage':
                // More backup laps - reduces lap change time
                break;
            case 'paste_cabinet':
                // Paste doesn't expire - better storage
                break;
            case 'rough_storage':
                // Can hold more rough in inventory
                break;
        }
    }
    
    /**
     * Get available designs for shop display
     */
    getAvailableDesigns() {
        return Object.entries(this.designs).map(([id, design]) => ({
            id,
            name: design.name,
            totalFacets: design.totalFacets,
            valueMultiplier: design.valueMultiplier,
            levelRequired: design.levelRequired,
            unlocked: this.state.unlockedDesigns.includes(id),
            canUnlock: this.state.player.level >= design.levelRequired,
            unlockCost: Math.floor(design.totalFacets * 10 * design.valueMultiplier)
        }));
    }
    
    /**
     * Get available shapes for shop display
     */
    getAvailableShapes() {
        return Object.entries(this.shapes).map(([id, shape]) => ({
            id,
            levelRequired: shape.levelRequired,
            baseDifficulty: shape.baseDifficulty,
            unlocked: this.state.unlockedShapes.includes(id),
            canUnlock: this.state.player.level >= shape.levelRequired,
            unlockCost: Math.floor(100 * shape.baseDifficulty)
        }));
    }
    
    /**
     * Get available upgrades for shop display
     */
    getAvailableUpgrades() {
        return Object.entries(this.inventoryUpgrades).map(([type, upgrade]) => {
            const currentLevel = this.state.upgradelevels[type] || 0;
            const nextLevel = upgrade.levels[currentLevel];
            return {
                type,
                name: upgrade.name,
                description: upgrade.description,
                currentLevel,
                maxLevel: upgrade.maxLevel,
                atMax: currentLevel >= upgrade.maxLevel,
                nextLevelCost: nextLevel ? nextLevel.cost : null,
                nextLevelBonus: nextLevel ? nextLevel.bonus : null,
                nextLevelDescription: nextLevel ? nextLevel.description : null
            };
        });
    }
    
    // ==================== RESOURCE CONSUMPTION ====================
    
    /**
     * Consume water during cutting
     */
    consumeWater(gameTimePassed) {
        const minutesPassed = gameTimePassed / 60;
        const consumption = minutesPassed * this.consumptionRates.waterPerMinute;
        
        this.state.inventory.consumables.water = Math.max(0, this.state.inventory.consumables.water - consumption);
        
        // Warn if low
        if (this.state.inventory.consumables.water < 20 && this.state.inventory.consumables.water > 15) {
            if (this.merlin && Math.random() < 0.1) {
                this.merlinSpeak('Water tank running low! Refill soon to avoid overheating stones.');
            }
        }
        
        return this.state.inventory.consumables.water > 0;
    }
    
    /**
     * Consume dop wax when mounting a stone
     */
    consumeDopWax() {
        if (this.state.inventory.consumables.dopWax < this.consumptionRates.dopWaxPerStone) {
            return { success: false, message: 'Out of dop wax! Buy more from the shop.' };
        }
        
        this.state.inventory.consumables.dopWax -= this.consumptionRates.dopWaxPerStone;
        return { success: true };
    }
    
    /**
     * Apply lap wear from cutting
     */
    applyLapWear(lapType) {
        const wear = this.consumptionRates.lapWearPerStage[lapType];
        if (!wear) return;
        
        if (this.state.laps[lapType]) {
            this.state.laps[lapType].condition = Math.max(0, this.state.laps[lapType].condition - wear);
            
            // Warn if lap getting worn
            if (this.state.laps[lapType].condition < 30 && this.state.laps[lapType].condition > 25) {
                if (this.merlin) {
                    this.merlinSpeak(`Your ${lapType} lap is getting worn. Consider replacing it soon.`);
                }
            }
        }
    }
    
    /**
     * Check if lap is usable
     */
    isLapUsable(lapType) {
        const lap = this.state.laps[lapType];
        if (!lap || !lap.owned) return { usable: false, reason: 'Lap not owned' };
        if (lap.condition <= 0) return { usable: false, reason: 'Lap completely worn out' };
        if (lapType === 'copper' && !lap.currentPaste) return { usable: false, reason: 'Copper lap needs paste charge' };
        
        // Reduced efficiency if worn
        const efficiency = lap.condition / 100;
        return { usable: true, efficiency };
    }
    
    // ==================== MACHINE MAINTENANCE SYSTEM ====================
    
    /**
     * Check machine condition and apply maintenance effects
     */
    checkMachineCondition(machine) {
        if (!machine.condition) machine.condition = 100;
        if (!machine.needsCleaning) machine.needsCleaning = false;
        if (!machine.needsLubrication) machine.needsLubrication = false;
        if (!machine.hardwareIssue) machine.hardwareIssue = null;
        if (!machine.isDown) machine.isDown = false;
        if (!machine.downUntil) machine.downUntil = null;
        
        // If machine is down, check if repair time is complete
        if (machine.isDown && machine.downUntil) {
            if (Date.now() >= machine.downUntil) {
                machine.isDown = false;
                machine.downUntil = null;
                machine.hardwareIssue = null;
                console.log(`🔧 Machine ${machine.id} is back online!`);
                if (this.merlin) {
                    this.merlinSpeak('Machine repairs complete! Back to cutting gems.');
                }
            }
            return { operational: false, reason: 'Under repair' };
        }
        
        // Check for hardware issues
        if (machine.hardwareIssue) {
            return { operational: false, reason: machine.hardwareIssue.name };
        }
        
        // Check condition thresholds
        if (machine.condition < this.maintenanceConfig.breakdownThreshold) {
            // Risk of breakdown
            if (Math.random() < this.maintenanceConfig.breakdownChance) {
                this.triggerHardwareFailure(machine);
                return { operational: false, reason: 'Hardware failure!' };
            }
        }
        
        // Calculate speed penalty for poor condition
        let speedMultiplier = 1;
        if (machine.condition < this.maintenanceConfig.criticalThreshold) {
            speedMultiplier = 0.5; // Half speed when critical
        } else if (machine.condition < this.maintenanceConfig.cleaningThreshold) {
            speedMultiplier = 0.8; // 80% speed when needs cleaning
        }
        
        return { 
            operational: true, 
            speedMultiplier,
            needsMaintenance: machine.condition < this.maintenanceConfig.cleaningThreshold
        };
    }
    
    /**
     * Apply condition decay over time
     */
    applyConditionDecay(machine, gameTimePassed) {
        const hoursPassed = gameTimePassed / 3600;
        const decay = hoursPassed * this.maintenanceConfig.conditionDecayRate;
        
        machine.condition = Math.max(0, (machine.condition || 100) - decay);
        
        // Also consume lubricant
        const lubricantUse = hoursPassed * this.consumptionRates.lubricantPerHour;
        this.state.inventory.consumables.lubricant = Math.max(0, this.state.inventory.consumables.lubricant - lubricantUse);
        
        // Mark as needing maintenance
        if (machine.condition < this.maintenanceConfig.cleaningThreshold) {
            machine.needsCleaning = true;
        }
        if (this.state.inventory.consumables.lubricant < 20) {
            machine.needsLubrication = true;
        }
    }
    
    /**
     * Trigger a random hardware failure
     */
    triggerHardwareFailure(machine) {
        const failures = Object.entries(this.hardwareFailures);
        const [failureId, failure] = failures[Math.floor(Math.random() * failures.length)];
        
        machine.hardwareIssue = { id: failureId, ...failure };
        machine.isDown = true;
        machine.downUntil = Date.now() + (failure.downtimeMinutes * 60000 / this.config.timeAcceleration);
        
        console.log(`⚠️ HARDWARE FAILURE on ${machine.id}: ${failure.name}`);
        if (this.merlin) {
            this.merlinSpeak(`Oh no! ${failure.name} on the machine! ${failure.description}`);
        }
    }
    
    /**
     * Perform maintenance on a machine
     */
    performMaintenance(machineId, maintenanceType) {
        const machine = this.state.machines.find(m => m.id === machineId);
        if (!machine) {
            return { success: false, message: 'Machine not found' };
        }
        
        switch(maintenanceType) {
            case 'clean':
                machine.needsCleaning = false;
                machine.condition = Math.min(100, machine.condition + this.maintenanceConfig.cleaning.conditionBoost);
                this.state.stats.maintenancePerformed++;
                console.log(`🧹 Cleaned machine ${machineId}`);
                if (this.merlin) {
                    this.merlinSpeak('Machine cleaned! Smooth operation restored.');
                }
                return { success: true, message: 'Machine cleaned!' };
                
            case 'lubricate':
                const lubCost = this.maintenanceConfig.lubrication.costLubricant;
                if (this.state.inventory.consumables.lubricant < lubCost) {
                    return { success: false, message: 'Not enough lubricant!' };
                }
                this.state.inventory.consumables.lubricant -= lubCost;
                machine.needsLubrication = false;
                machine.condition = Math.min(100, machine.condition + this.maintenanceConfig.lubrication.conditionBoost);
                this.state.stats.maintenancePerformed++;
                console.log(`🛢️ Lubricated machine ${machineId}`);
                return { success: true, message: 'Machine lubricated!' };
                
            case 'repair':
                const repairCost = this.maintenanceConfig.repair.cost;
                if (this.state.player.gems < repairCost) {
                    return { success: false, message: `Not enough gems! Need ${repairCost}` };
                }
                this.state.player.gems -= repairCost;
                machine.condition = Math.min(100, machine.condition + this.maintenanceConfig.repair.conditionBoost);
                machine.hardwareIssue = null;
                machine.isDown = false;
                machine.downUntil = null;
                this.state.stats.maintenancePerformed++;
                console.log(`🔧 Repaired machine ${machineId}`);
                if (this.merlin) {
                    this.merlinSpeak('Full repair complete! Machine is good as new.');
                }
                return { success: true, message: 'Machine repaired!' };
                
            default:
                return { success: false, message: 'Unknown maintenance type' };
        }
    }
    
    /**
     * Fix a specific hardware issue
     */
    fixHardwareIssue(machineId) {
        const machine = this.state.machines.find(m => m.id === machineId);
        if (!machine || !machine.hardwareIssue) {
            return { success: false, message: 'No hardware issue to fix' };
        }
        
        const repairCost = machine.hardwareIssue.repairCost;
        if (this.state.player.gems < repairCost) {
            return { success: false, message: `Not enough gems! Need ${repairCost}` };
        }
        
        this.state.player.gems -= repairCost;
        const issueName = machine.hardwareIssue.name;
        machine.hardwareIssue = null;
        machine.isDown = false;
        machine.downUntil = null;
        machine.condition = Math.min(100, machine.condition + 25);
        
        console.log(`🔧 Fixed ${issueName} on ${machineId} for ${repairCost} gems`);
        if (this.merlin) {
            this.merlinSpeak(`${issueName} fixed! The machine hums with renewed vigor.`);
        }
        
        return { success: true, message: `Fixed ${issueName}`, cost: repairCost };
    }
    
    /**
     * Get machine status summary
     */
    getMachineStatus(machine) {
        const stone = machine.currentStone;
        return {
            id: machine.id,
            type: machine.type,
            condition: machine.condition || 100,
            needsCleaning: machine.needsCleaning || false,
            needsLubrication: machine.needsLubrication || false,
            isDown: machine.isDown || false,
            hardwareIssue: machine.hardwareIssue,
            downUntil: machine.downUntil,
            // NEW: Interaction status
            awaitingInteraction: stone ? (stone.awaitingInteraction || false) : false,
            interactionType: stone ? (stone.interactionType || null) : null,
            pendingInteraction: this.state.pendingInteractions.find(i => i.machineId === machine.id) || null,
            // Current stone info
            currentStone: stone ? {
                gem: stone.gem.name,
                stage: stone.currentStage,
                quality: stone.qualityScore,
                design: stone.design ? stone.design.name : null,
                totalFacets: stone.design ? stone.design.totalFacets : null,
                cuttingPhase: stone.cuttingPhase || 'pavilion',
                currentFacetIndex: stone.currentFacetIndex || 0,
                currentAngle: stone.currentAngle || 0,
                currentIndex: stone.currentIndex || 0,
                currentTier: stone.currentTier || null,
                awaitingInteraction: stone.awaitingInteraction || false,
                interactionType: stone.interactionType || null
            } : null
        };
    }
    
    /**
     * Get all pending interactions across all machines
     */
    getPendingInteractions() {
        return this.state.pendingInteractions.map(interaction => {
            const machine = this.state.machines.find(m => m.id === interaction.machineId);
            return {
                ...interaction,
                machineName: machine ? this.machineTypes[machine.type]?.name : interaction.machineId,
                stoneInfo: machine?.currentStone ? {
                    gem: machine.currentStone.gem.name,
                    stage: machine.currentStone.currentStage
                } : null
            };
        });
    }
    
    /**
     * Check if any machine is awaiting interaction
     */
    hasAwaitingInteractions() {
        return this.state.pendingInteractions.length > 0;
    }
    
    /**
     * Get all resources status
     */
    getResourceStatus() {
        return {
            inventory: {
                rough: { ...this.state.inventory.rough },
                cutStones: this.state.inventory.cutStones.length,
                cutStonesValue: this.state.inventory.cutStones.reduce((sum, s) => sum + s.saleValue, 0)
            },
            consumables: { ...this.state.inventory.consumables },
            laps: Object.entries(this.state.laps).map(([type, data]) => ({
                type,
                condition: data.condition,
                owned: data.owned,
                currentPaste: data.currentPaste
            })),
            paste: { ...this.state.paste },
            warnings: this.getResourceWarnings()
        };
    }
    
    /**
     * Get warnings for low resources
     */
    getResourceWarnings() {
        const warnings = [];
        
        // Check consumables
        if (this.state.inventory.consumables.water < 20) {
            warnings.push({ type: 'water', message: 'Water tank low!', severity: 'high' });
        } else if (this.state.inventory.consumables.water < 40) {
            warnings.push({ type: 'water', message: 'Water tank getting low', severity: 'medium' });
        }
        
        if (this.state.inventory.consumables.dopWax < 5) {
            warnings.push({ type: 'dopWax', message: 'Almost out of dop wax!', severity: 'high' });
        } else if (this.state.inventory.consumables.dopWax < 15) {
            warnings.push({ type: 'dopWax', message: 'Dop wax running low', severity: 'medium' });
        }
        
        if (this.state.inventory.consumables.lubricant < 20) {
            warnings.push({ type: 'lubricant', message: 'Machine lubricant low!', severity: 'high' });
        }
        
        // Check laps
        Object.entries(this.state.laps).forEach(([type, data]) => {
            if (data.owned && data.condition < 20) {
                warnings.push({ type: 'lap', lapType: type, message: `${type} lap nearly worn out!`, severity: 'high' });
            } else if (data.owned && data.condition < 40) {
                warnings.push({ type: 'lap', lapType: type, message: `${type} lap getting worn`, severity: 'medium' });
            }
        });
        
        // Check paste
        Object.entries(this.state.paste).forEach(([grit, amount]) => {
            if (amount < 10) {
                warnings.push({ type: 'paste', grit, message: `${grit} paste running low`, severity: 'medium' });
            }
        });
        
        // Check rough inventory (now array-based)
        const totalRough = Object.values(this.state.inventory.rough)
            .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        if (totalRough === 0) {
            warnings.push({ type: 'rough', message: 'OUT OF ROUGH! Buy more or go searching!', severity: 'critical' });
        } else if (totalRough < 3) {
            warnings.push({ type: 'rough', message: 'Low on rough stones!', severity: 'medium' });
        }
        
        // Check machines
        this.state.machines.forEach(machine => {
            if (machine.isDown) {
                warnings.push({ type: 'machine', machineId: machine.id, message: `${machine.id} is down!`, severity: 'critical' });
            } else if ((machine.condition || 100) < 30) {
                warnings.push({ type: 'machine', machineId: machine.id, message: `${machine.id} needs maintenance`, severity: 'high' });
            }
        });
        
        return warnings;
    }
    
    /**
     * Called when real machine connects
     */
    onRealMachineConnected() {
        this.realMachineConnected = true;
        console.log('🔌 Real GemBot connected - 50% bonus active!');
    }
    
    /**
     * Called when real machine disconnects
     */
    onRealMachineDisconnected() {
        this.realMachineConnected = false;
        console.log('🔌 Real GemBot disconnected');
    }
    
    /**
     * Pause the game
     */
    pause() {
        this.isPaused = true;
    }
    
    /**
     * Resume the game
     */
    resume() {
        this.isPaused = false;
        this.lastTick = Date.now();
    }
    
    /**
     * Get current game state
     */
    getState() {
        return this.state;
    }
    
    /**
     * Create a clean copy of state that can be serialized to JSON
     * Removes Babylon.js mesh objects and circular references
     */
    createSaveableState() {
        const cleanState = {
            player: { ...this.state.player },
            inventory: JSON.parse(JSON.stringify(this.state.inventory)),
            laps: {},
            paste: { ...this.state.paste },
            upgradeLevels: { ...this.state.upgradeLevels },
            unlockedShapes: [...this.state.unlockedShapes],
            unlockedDesigns: [...this.state.unlockedDesigns],
            rooms: this.state.rooms.map(r => ({
                id: r.id,
                name: r.name,
                unlocked: r.unlocked,
                machineSlots: r.machineSlots
            })),
            machines: this.state.machines.map(m => ({
                id: m.id,
                type: m.type,
                room: m.room,
                condition: m.condition,
                isDown: m.isDown,
                hardwareIssue: m.hardwareIssue,
                currentStone: m.currentStone ? {
                    id: m.currentStone.id,
                    designId: m.currentStone.designId,
                    roughCarats: m.currentStone.roughCarats,
                    roughQuality: m.currentStone.roughQuality,
                    expectedFinishedCarats: m.currentStone.expectedFinishedCarats,
                    currentStage: m.currentStone.currentStage,
                    stageIndex: m.currentStone.stageIndex,
                    stageProgress: m.currentStone.stageProgress,
                    currentFacetIndex: m.currentStone.currentFacetIndex,
                    qualityScore: m.currentStone.qualityScore,
                    perfectBonus: m.currentStone.perfectBonus,
                    awaitingInteraction: m.currentStone.awaitingInteraction,
                    interactionType: m.currentStone.interactionType,
                    gem: m.currentStone.gem ? {
                        name: m.currentStone.gem.name,
                        color: m.currentStone.gem.color,
                        hardness: m.currentStone.gem.hardness,
                        rarity: m.currentStone.gem.rarity
                    } : null
                } : null
            })),
            pendingInteractions: this.state.pendingInteractions ? [...this.state.pendingInteractions] : [],
            stats: { ...this.state.stats },
            currentRoom: this.state.currentRoom
        };
        
        // Copy laps (clean of any mesh refs)
        Object.entries(this.state.laps).forEach(([key, lap]) => {
            cleanState.laps[key] = {
                type: lap.type,
                condition: lap.condition,
                currentPaste: lap.currentPaste
            };
        });
        
        return cleanState;
    }
    
    /**
     * Save game state
     */
    save() {
        this.saveState();
    }
    
    /**
     * Save state to localStorage - COMPREHENSIVE
     */
    saveState() {
        try {
            // Record last play time for offline calculations
            this.state.player.lastPlayTime = Date.now();
            
            // Create clean copy without Babylon.js objects (they cause circular reference errors)
            const saveData = this.createSaveableState();
            
            // Double-check machines are clean
            if (saveData.machines) {
                saveData.machines.forEach(m => {
                    delete m.mesh;
                    delete m.lapMesh;
                    delete m.statusMesh;
                    delete m.statusMat;
                    delete m.particleSystem;
                    // Clean currentStone of any mesh refs
                    if (m.currentStone) {
                        delete m.currentStone.mesh;
                        delete m.currentStone.material;
                        // Clean gem object too
                        if (m.currentStone.gem) {
                            m.currentStone.gem = {
                                name: m.currentStone.gem.name,
                                color: m.currentStone.gem.color,
                                hardness: m.currentStone.gem.hardness,
                                rarity: m.currentStone.gem.rarity
                            };
                        }
                    }
                });
            }
            
            // Add save metadata
            saveData._saveVersion = 2;
            saveData._savedAt = Date.now();
            saveData._totalPlayTime = this.state.stats.playTime;
            
            // Save to localStorage
            localStorage.setItem(this.config.saveKey, JSON.stringify(saveData));
            
            // Also save a backup with timestamp
            const backupKey = `gembot_backup_${new Date().toISOString().split('T')[0]}`;
            localStorage.setItem(backupKey, JSON.stringify(saveData));
            
            console.log('💾 Game saved successfully!', {
                gems: this.state.player.gems,
                tokens: this.state.player.tokens,
                level: this.state.player.level,
                totalCarats: this.state.player.totalCaratsCut?.toFixed(2)
            });
            
            return { success: true, savedAt: Date.now() };
        } catch (e) {
            console.error('Failed to save game:', e);
            return { success: false, error: e.message };
        }
    }
    
    /**
     * Load state from localStorage - COMPREHENSIVE with migration
     */
    loadState() {
        try {
            // Try new save key first, then old
            let saved = localStorage.getItem(this.config.saveKey);
            let needsMigration = false;
            
            if (!saved) {
                saved = localStorage.getItem('gembot_farm_save');
                needsMigration = true;
            }
            
            if (saved) {
                const data = JSON.parse(saved);
                
                // Calculate offline progress
                const offlineTime = Date.now() - (data.player?.lastPlayTime || Date.now());
                const offlineMinutes = Math.floor(offlineTime / 60000);
                
                // Merge with default state to handle new properties
                this.state = this.deepMerge(this.state, data);
                
                // Ensure all gem balance arrays exist
                this.gemTypes.forEach(gem => {
                    if (!this.state.gemBalance[gem.name]) {
                        this.state.gemBalance[gem.name] = [];
                    }
                });
                
                // Ensure all rough arrays exist and migrate from old format
                if (needsMigration || !Array.isArray(Object.values(this.state.inventory.rough)[0])) {
                    this.migrateRoughInventory();
                }
                
                // Ensure player has all required fields
                this.state.player = {
                    level: 1,
                    xp: 0,
                    xpToNext: 100,
                    gems: 50,
                    tokens: 0,
                    totalGemsEver: 0,
                    stonesLost: 0,
                    stonesCompleted: 0,
                    totalCaratsCut: 0,
                    totalCaratsLost: 0,
                    cryptoEarned: 0,
                    lastPlayTime: Date.now(),
                    isSearching: false,
                    ...this.state.player
                };
                
                // Report offline progress
                if (offlineMinutes > 1) {
                    console.log(`📂 Game loaded! You were away for ${offlineMinutes} minutes.`);
                    
                    // Show welcome back message
                    if (this.merlin) {
                        setTimeout(() => {
                            this.merlinSpeak(`Welcome back! You were away for ${offlineMinutes > 60 ? Math.floor(offlineMinutes/60) + ' hours' : offlineMinutes + ' minutes'}. Your gems: ${this.state.player.gems}, Tokens: ${this.state.player.tokens}`);
                        }, 2000);
                    }
                }
                
                console.log('📂 Game loaded successfully!', {
                    gems: this.state.player.gems,
                    tokens: this.state.player.tokens,
                    level: this.state.player.level,
                    totalCarats: this.state.player.totalCaratsCut?.toFixed(2),
                    gemBalance: Object.entries(this.state.gemBalance)
                        .filter(([k, v]) => v.length > 0)
                        .map(([k, v]) => `${k}: ${v.length} stones`)
                });
                
                return { success: true, offlineMinutes };
            }
            
            return { success: false, message: 'No save found - starting fresh!' };
        } catch (e) {
            console.error('Failed to load game:', e);
            return { success: false, error: e.message };
        }
    }
    
    /**
     * Deep merge objects recursively
     */
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }
    
    /**
     * Migrate old rough inventory (counts) to new format (array of pieces with carats)
     */
    migrateRoughInventory() {
        console.log('🔄 Migrating rough inventory to carat-based system...');
        
        const oldRough = this.state.inventory.rough;
        const newRough = {};
        
        Object.entries(oldRough).forEach(([gemName, value]) => {
            if (typeof value === 'number') {
                // Old format: convert count to array of pieces
                newRough[gemName] = [];
                for (let i = 0; i < value; i++) {
                    newRough[gemName].push({
                        carats: 1.5 + Math.random() * 3, // Random 1.5-4.5ct pieces
                        quality: ['fair', 'good', 'good', 'excellent'][Math.floor(Math.random() * 4)]
                    });
                }
            } else if (Array.isArray(value)) {
                // Already new format
                newRough[gemName] = value;
            } else {
                newRough[gemName] = [];
            }
        });
        
        this.state.inventory.rough = newRough;
        console.log('✅ Rough inventory migrated:', Object.entries(newRough).filter(([k,v]) => v.length > 0).map(([k,v]) => `${k}: ${v.length} pieces`));
    }
    
    /**
     * Export save data for backup/sharing
     */
    exportSave() {
        const saveData = JSON.parse(JSON.stringify(this.state));
        saveData._exportedAt = Date.now();
        saveData._version = 2;
        
        const exportString = btoa(JSON.stringify(saveData));
        console.log('📤 Save exported! Length:', exportString.length);
        
        return exportString;
    }
    
    /**
     * Import save data from backup
     */
    importSave(exportString) {
        try {
            const saveData = JSON.parse(atob(exportString));
            
            if (!saveData._version) {
                return { success: false, message: 'Invalid save format' };
            }
            
            localStorage.setItem(this.config.saveKey, JSON.stringify(saveData));
            this.loadState();
            
            return { success: true, message: 'Save imported successfully!' };
        } catch (e) {
            return { success: false, message: 'Failed to import: ' + e.message };
        }
    }
    
    /**
     * Reset game to initial state (with confirmation)
     */
    resetGame(confirm = false) {
        if (!confirm) {
            return { success: false, message: 'Call resetGame(true) to confirm reset' };
        }
        
        localStorage.removeItem(this.config.saveKey);
        localStorage.removeItem('gembot_farm_save');
        
        console.log('🔄 Game reset! Refresh to start fresh.');
        return { success: true, message: 'Game reset. Refresh the page.' };
    }
    
    /**
     * Get save statistics
     */
    getSaveStats() {
        const totalRough = Object.values(this.state.inventory.rough)
            .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        
        const totalCutStones = Object.values(this.state.gemBalance)
            .reduce((sum, arr) => sum + arr.length, 0);
        
        const totalCutCarats = Object.values(this.state.gemBalance)
            .reduce((sum, arr) => sum + arr.reduce((s, stone) => s + (stone.caratWeight || 0), 0), 0);
        
        const totalCutValue = Object.values(this.state.gemBalance)
            .reduce((sum, arr) => sum + arr.reduce((s, stone) => s + (stone.value || 0), 0), 0);
        
        return {
            player: {
                level: this.state.player.level,
                gems: this.state.player.gems,
                tokens: this.state.player.tokens,
                totalCaratsCut: this.state.player.totalCaratsCut,
                cryptoEarned: this.state.player.cryptoEarned
            },
            inventory: {
                roughPieces: totalRough,
                cutStones: totalCutStones,
                cutCarats: totalCutCarats.toFixed(2),
                cutValue: totalCutValue
            },
            stats: {
                totalCuts: this.state.stats.totalCuts,
                perfectCuts: this.state.stats.perfectCuts,
                stonesLost: this.state.player.stonesLost,
                playTime: this.state.stats.playTime
            }
        };
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        if (this.merlinTipInterval) {
            clearInterval(this.merlinTipInterval);
            this.merlinTipInterval = null;
        }
        
        if (this.engine) {
            this.engine.dispose();
        }
    }
    
    // ==================== MERLIN AI INTEGRATION ====================
    
    /**
     * Initialize Merlin AI in the game
     */
    initializeMerlin() {
        // Get reference to global Merlin
        this.merlin = window.merlin || null;
        
        if (this.merlin) {
            console.log('🧙 Merlin AI connected to GemBot Farm');
            
            // Create Merlin's avatar in the 3D scene
            this.createMerlinAvatar();
            
            // Welcome message
            this.merlinSpeak(this.getMerlinWelcomeMessage());
            
            // Start periodic tips
            this.startMerlinTips();
            
            // Sync game progress with Merlin's knowledge
            this.syncWithMerlin();
        } else {
            console.log('⚠️ Merlin AI not available, game will function without AI guidance');
        }
    }
    
    /**
     * Create Merlin's 3D avatar in the scene
     */
    createMerlinAvatar() {
        if (!this.scene) return;
        
        // Create wizard character
        const merlinRoot = new BABYLON.TransformNode('merlin_avatar', this.scene);
        merlinRoot.position = new BABYLON.Vector3(-12, 1, 8);
        
        // Robe body
        const robe = BABYLON.MeshBuilder.CreateCylinder('merlin_robe', {
            height: 3,
            diameterTop: 0.8,
            diameterBottom: 1.5
        }, this.scene);
        robe.parent = merlinRoot;
        robe.position.y = 1.5;
        
        const robeMat = new BABYLON.StandardMaterial('merlin_robe_mat', this.scene);
        robeMat.diffuseColor = new BABYLON.Color3(0.2, 0.1, 0.4);
        robeMat.emissiveColor = new BABYLON.Color3(0.1, 0.05, 0.2);
        robe.material = robeMat;
        
        // Head
        const head = BABYLON.MeshBuilder.CreateSphere('merlin_head', { diameter: 0.8 }, this.scene);
        head.parent = merlinRoot;
        head.position.y = 3.4;
        
        const headMat = new BABYLON.StandardMaterial('merlin_head_mat', this.scene);
        headMat.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.7);
        head.material = headMat;
        
        // Wizard hat
        const hat = BABYLON.MeshBuilder.CreateCylinder('merlin_hat', {
            height: 1.2,
            diameterTop: 0,
            diameterBottom: 0.8
        }, this.scene);
        hat.parent = merlinRoot;
        hat.position.y = 4.2;
        
        const hatMat = new BABYLON.StandardMaterial('merlin_hat_mat', this.scene);
        hatMat.diffuseColor = new BABYLON.Color3(0.1, 0.05, 0.3);
        hatMat.emissiveColor = new BABYLON.Color3(0.05, 0.02, 0.15);
        hat.material = hatMat;
        
        // Hat brim
        const brim = BABYLON.MeshBuilder.CreateCylinder('merlin_brim', {
            height: 0.1,
            diameter: 1.2
        }, this.scene);
        brim.parent = merlinRoot;
        brim.position.y = 3.7;
        brim.material = hatMat;
        
        // Staff
        const staff = BABYLON.MeshBuilder.CreateCylinder('merlin_staff', {
            height: 4,
            diameter: 0.1
        }, this.scene);
        staff.parent = merlinRoot;
        staff.position = new BABYLON.Vector3(0.8, 2, 0);
        staff.rotation.z = 0.1;
        
        const staffMat = new BABYLON.StandardMaterial('merlin_staff_mat', this.scene);
        staffMat.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.1);
        staff.material = staffMat;
        
        // Glowing orb on staff
        const orb = BABYLON.MeshBuilder.CreateSphere('merlin_orb', { diameter: 0.4 }, this.scene);
        orb.parent = merlinRoot;
        orb.position = new BABYLON.Vector3(0.9, 4.2, 0);
        
        const orbMat = new BABYLON.StandardMaterial('merlin_orb_mat', this.scene);
        orbMat.emissiveColor = new BABYLON.Color3(0, 1, 1);
        orbMat.diffuseColor = new BABYLON.Color3(0.5, 1, 1);
        orb.material = orbMat;
        
        // Pulsing animation for orb
        this.scene.registerBeforeRender(() => {
            if (orb) {
                const pulse = 0.3 + Math.sin(Date.now() / 500) * 0.1;
                orb.scaling = new BABYLON.Vector3(pulse / 0.4, pulse / 0.4, pulse / 0.4);
            }
        });
        
        // Create speech bubble
        this.createSpeechBubble(merlinRoot);
        
        this.merlinAvatar = merlinRoot;
    }
    
    /**
     * Create speech bubble above Merlin
     */
    createSpeechBubble(parent) {
        const bubblePlane = BABYLON.MeshBuilder.CreatePlane('speech_bubble', {
            width: 6,
            height: 2
        }, this.scene);
        bubblePlane.parent = parent;
        bubblePlane.position = new BABYLON.Vector3(2, 5.5, 0);
        bubblePlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        
        // Dynamic texture for text
        const bubbleTex = new BABYLON.DynamicTexture('bubble_tex', { width: 512, height: 180 }, this.scene);
        
        const bubbleMat = new BABYLON.StandardMaterial('bubble_mat', this.scene);
        bubbleMat.diffuseTexture = bubbleTex;
        bubbleMat.emissiveTexture = bubbleTex;
        bubbleMat.backFaceCulling = false;
        bubbleMat.useAlphaFromDiffuseTexture = true;
        bubblePlane.material = bubbleMat;
        
        this.merlinSpeechBubble = {
            plane: bubblePlane,
            texture: bubbleTex,
            visible: false
        };
        
        // Start hidden
        bubblePlane.isVisible = false;
    }
    
    /**
     * Update speech bubble text
     */
    updateSpeechBubble(text) {
        if (!this.merlinSpeechBubble) return;
        
        const tex = this.merlinSpeechBubble.texture;
        const ctx = tex.getContext();
        
        // Clear and draw background
        ctx.clearRect(0, 0, 512, 180);
        
        // Rounded rectangle background
        ctx.fillStyle = 'rgba(20, 10, 40, 0.9)';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        this.roundRect(ctx, 10, 10, 492, 160, 15);
        ctx.fill();
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        
        // Word wrap
        const words = text.split(' ');
        let line = '';
        let y = 50;
        const maxWidth = 460;
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), 256, y);
                line = word + ' ';
                y += 28;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), 256, y);
        
        tex.update();
        
        // Show bubble
        this.merlinSpeechBubble.plane.isVisible = true;
        
        // Hide after delay
        setTimeout(() => {
            if (this.merlinSpeechBubble) {
                this.merlinSpeechBubble.plane.isVisible = false;
            }
        }, 8000);
    }
    
    /**
     * Helper to draw rounded rectangle
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    /**
     * Make Merlin speak
     */
    merlinSpeak(message) {
        if (!message) return;
        
        this.merlinLastMessage = message;
        this.state.merlinInteractions.tipsGiven++;
        this.state.stats.merlinTipsReceived++;
        
        // Update 3D speech bubble
        this.updateSpeechBubble(message);
        
        // Also display in game activity feed if available
        if (typeof addGameActivity === 'function') {
            addGameActivity(`🧙 Merlin: "${message}"`);
        }
        
        // Use text-to-speech if Merlin's voice is enabled
        if (this.merlin && this.merlin.merlinSettings?.voiceEnabled) {
            this.speakWithVoice(message);
        }
        
        console.log(`🧙 Merlin says: "${message}"`);
    }
    
    /**
     * Text-to-speech for Merlin
     */
    speakWithVoice(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Use Merlin's voice settings
            if (this.merlin?.merlinSettings) {
                utterance.rate = this.merlin.merlinSettings.speechRate || 1.2;
                utterance.pitch = this.merlin.merlinSettings.pitch || 0.55;
                utterance.volume = this.merlin.merlinSettings.volume || 1.0;
            }
            
            // Find a suitable voice
            const voices = speechSynthesis.getVoices();
            const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Mark'));
            if (maleVoice) utterance.voice = maleVoice;
            
            speechSynthesis.speak(utterance);
        }
    }
    
    /**
     * Get contextual welcome message from Merlin
     */
    getMerlinWelcomeMessage() {
        const player = this.state.player;
        const userName = this.merlin?.userProfile?.userName || 'young apprentice';
        
        if (player.totalGemsEver === 0) {
            return `Welcome to the GemBot Farm, ${userName}! I am Merlin, your guide. Watch as the machines cut gems, and I shall teach you the ancient art!`;
        } else if (player.level < 5) {
            return `Ah, ${userName} returns! Your farm grows nicely. Keep cutting gems and you shall unlock the secrets of the rarer stones.`;
        } else if (player.level < 10) {
            return `${userName}, your skill impresses me. The machines respond to your mastery. Soon, you will unlock the legendary Alexandrite!`;
        } else {
            return `Greetings, Master ${userName}! Your gem empire flourishes. I sense great things ahead in your journey.`;
        }
    }
    
    /**
     * Start periodic tips from Merlin
     */
    startMerlinTips() {
        if (this.merlinTipInterval) {
            clearInterval(this.merlinTipInterval);
        }
        
        this.merlinTipInterval = setInterval(() => {
            if (!this.isPaused) {
                this.giveMerlinTip();
            }
        }, this.config.merlinTipInterval);
    }
    
    /**
     * Give contextual tip based on game state
     */
    giveMerlinTip() {
        const tips = this.getContextualTips();
        if (tips.length > 0) {
            const tip = tips[Math.floor(Math.random() * tips.length)];
            this.merlinSpeak(tip);
        }
    }
    
    /**
     * Get tips relevant to current game state - REALISTIC GEM CUTTING EDUCATION
     */
    getContextualTips() {
        const player = this.state.player;
        const machines = this.state.machines;
        const tips = [];
        
        // ==================== BEGINNER TIPS (Level 1-3) ====================
        if (player.level < 3) {
            // Basic process tips
            tips.push('Gem cutting starts with examining the rough - look for inclusions, cracks, and color orientation.');
            tips.push('The dop is a metal stick that holds your stone. Proper dopping is CRITICAL to success!');
            tips.push('Dop wax melts at around 150°F. Too hot burns the stone, too cold won\'t bond properly.');
            tips.push('Watch the stage indicator - yellow means human interaction is needed!');
            tips.push('Every stone goes through: Prep → Pavilion → Transfer → Crown → Polish');
        }
        
        // ==================== INTERMEDIATE TIPS (Level 3-7) ====================
        if (player.level >= 3 && player.level < 8) {
            // Process understanding
            tips.push('The pavilion is cut first because it\'s easier to transfer to than a finished crown.');
            tips.push('The girdle is the widest part of the stone - it determines your final size.');
            tips.push('Transfer is the riskiest moment! The stone moves from pavilion dop to crown dop.');
            tips.push('Laps progress from rough (600 grit) to fine (1200 grit) before polishing.');
            tips.push('Polish uses diamond paste: 8k → 14k → 50k → 100k → 200k for mirror finish.');
            
            // Hazard warnings
            tips.push('If the dop wax is too cold, the stone can fly off at high speed. DANGEROUS!');
            tips.push('Always let the dop cool naturally. Rapid cooling stresses both stone and bond.');
            tips.push('The copper lap for polishing must be charged with only ONE grit at a time.');
        }
        
        // ==================== ADVANCED TIPS (Level 8+) ====================
        if (player.level >= 8) {
            // Precision techniques
            tips.push('Diamond (Mohs 10) requires patience - expect 3-4x the cutting time of quartz.');
            tips.push('Corundum (Ruby/Sapphire at Mohs 9) is second hardest - good practice for diamond.');
            tips.push('Opal (Mohs 5.5) is soft AND heat sensitive - never let it get warm from friction!');
            tips.push('Topaz has perfect cleavage - one wrong tap and it splits along crystal planes.');
            tips.push('Emerald is included by nature - these inclusions create fracture risks.');
            
            // Pro techniques
            tips.push('Master cutters pre-polish pavilion facets before transfer to check angles.');
            tips.push('The 42° pavilion angle is standard for maximum brilliance in most stones.');
            tips.push('Crown angles affect fire (rainbow dispersion) - shallower = more fire.');
            tips.push('Table size affects brilliance vs fire trade-off. Typically 50-60% of girdle width.');
        }
        
        // ==================== MACHINE-SPECIFIC TIPS ====================
        if (machines.length === 1) {
            tips.push('One machine means mastering basics before scaling. Learn the rhythm of cutting.');
        }
        
        if (machines.length >= 3) {
            tips.push('With multiple machines, watch for transfer stages - they all need attention!');
            tips.push('Pro tip: Stagger your stones so transfers don\'t happen simultaneously.');
        }
        
        // ==================== REAL GemBot PROCESS TIPS ====================
        // These reflect the actual GemBot machine operation
        tips.push('On real GemBot: X-axis moves the stone in/out, Y-axis moves up/down to lap.');
        tips.push('The P-axis (Index) rotates the stone to each facet position. 96-tooth gear = 96 positions.');
        tips.push('Speed control is crucial - fast for rough cutting, slow for precision finishing.');
        tips.push('Step mode gives precise control: each click = exact number of motor steps.');
        tips.push('The limit switches protect your stone from crashing into the lap.');
        tips.push('Motor timeout (60 seconds) is a safety feature - prevents runaway operations.');
        
        // ==================== MATERIAL SCIENCE TIPS ====================
        tips.push('Mohs hardness is relative, not linear. Diamond (10) is ~4x harder than corundum (9).');
        tips.push('Quartz family (amethyst, citrine) are ideal learner stones - hard enough, forgiving.');
        tips.push('Garnet is slightly harder than quartz and comes in every color except blue.');
        tips.push('Heat damages many stones. Opal cracks, topaz changes color, some emeralds fracture.');
        
        // ==================== FAILURE EDUCATION ====================
        if (this.state.stats.dopFailures > 0) {
            tips.push('Dop failures happen to everyone. Check: wax temp, stone cleanliness, bond time.');
        }
        
        if (this.state.stats.transferFailures > 0) {
            tips.push('Transfer takes practice. Support the stone, heat evenly, align precisely.');
        }
        
        if (this.state.player.stonesLost > 0) {
            tips.push(`You've lost ${this.state.player.stonesLost} stones. Every loss teaches a lesson!`);
        }
        
        // ==================== PROGRESS TIPS ====================
        if (player.stonesCompleted > 10) {
            tips.push(`${player.stonesCompleted} stones completed! You're developing real skill.`);
        }
        
        if (player.gems > 500 && machines.length < 3) {
            tips.push('Consider expanding - the Pro GemBot has better precision, fewer failures.');
        }
        
        // ==================== REAL MACHINE INTEGRATION ====================
        if (this.realMachineConnected) {
            tips.push('Real GemBot connected! The game simulates what your machine can actually do.');
            tips.push('Use the game to plan cuts before committing real rough - practice virtually!');
        } else {
            tips.push('Connect your physical GemBot to see real motor positions reflected in the game!');
            tips.push('The virtual GemBot teaches the process - apply it to your real machine.');
        }
        
        return tips;
    }
    
    /**
     * Merlin celebrates achievements
     */
    merlinCelebrate(achievementType, data) {
        this.state.merlinInteractions.celebrationsMade++;
        
        const celebrations = {
            'level_up': [
                `Magnificent! Level ${data.level}! Your mastery grows!`,
                `You have ascended! Level ${data.level} achieved!`,
                `The ancient spirits acknowledge your growth to level ${data.level}!`
            ],
            'perfect_cut': [
                'A PERFECT cut! The gem sings with brilliance!',
                'Flawless execution! Even I could not have done better!',
                'Perfect! This gem will be spoken of for generations!'
            ],
            'rare_gem': [
                `A ${data.gemName}! Truly rare and precious!`,
                `The ${data.gemName} reveals itself! Fortune smiles upon you!`,
                `${data.gemName}! Few ever witness such beauty!`
            ],
            'new_machine': [
                'A new machine joins your workshop! Production increases!',
                'The workshop grows! Your empire expands!',
                'Another faithful machine to serve your vision!'
            ],
            'milestone': [
                `${data.count} gems cut! A milestone worthy of celebration!`,
                'You have carved your name into gem cutting history!',
                'The ancients would be proud of such achievement!'
            ]
        };
        
        const messages = celebrations[achievementType] || ['Well done, apprentice!'];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.merlinSpeak(message);
    }
    
    /**
     * Sync game progress with Merlin's knowledge system
     */
    syncWithMerlin() {
        if (!this.merlin) return;
        
        // Update Merlin's knowledge of user's game progress
        if (this.merlin.userProfile) {
            // Record game stats
            this.merlin.userProfile.gemForge = this.merlin.userProfile.gemForge || {};
            this.merlin.userProfile.gemForge.gameStats = {
                farmLevel: this.state.player.level,
                totalGems: this.state.player.totalGemsEver,
                machineCount: this.state.machines.length,
                perfectCuts: this.state.stats.perfectCuts,
                playTime: this.state.stats.playTime
            };
            
            // Increase relationship score for playing
            this.merlin.userProfile.merlinRelationshipScore += 1;
            
            // Save Merlin's profile
            this.merlin.saveUserProfile();
        }
    }
    
    /**
     * Get advice from Merlin about a specific topic - DETAILED GEM CUTTING EDUCATION
     */
    askMerlin(topic) {
        this.state.merlinInteractions.questionsAnswered++;
        
        const advice = {
            'gems': 'Each gem has unique properties defined by Mohs hardness: Quartz=7, Topaz=8, Corundum (Ruby/Sapphire)=9, Diamond=10. Harder stones take longer to cut but polish beautifully. Softer stones like Opal (5.5) require gentle treatment and can\'t handle heat.',
            
            'machines': 'GemBot machines control 3 axes: X (in/out toward lap), Y (up/down), and Index (rotation). Step mode gives precise single-step control. Continuous mode for roughing. Higher quality machines have better precision = fewer dop failures.',
            
            'strategy': 'Start with Quartz family stones (Amethyst, Citrine) - they\'re forgiving and teach the process. Master the transfer before tackling valuable stones. One lost ruby teaches expensive lessons!',
            
            'real_machine': 'The virtual game teaches the EXACT process used by physical GemBot: mount rough, preform shape, cut pavilion through progressive laps (600→800→1200), polish with paste (8k→14k→50k→100k→200k), transfer, cut crown, final polish.',
            
            'process': 'Full cut process: 1) Prep rough, 2) Dop to stick, 3) Mount in chuck, 4) Preform girdle & pavilion, 5) Cut pavilion facets through grits, 6) Polish pavilion, 7) TRANSFER to crown dop, 8) Cut crown & table, 9) Polish crown, 10) Remove & clean.',
            
            'laps': 'Cutting laps: 600 grit (rough shaping, fast removal), 800 grit (remove 600 scratches), 1200 grit (pre-polish). Polish laps: Copper charged with diamond paste - 8k to 200k for mirror finish. NEVER mix grit sizes on one lap!',
            
            'dopping': 'Dop wax temperature is critical - around 150°F. Stone must be clean and warm. Press firmly, center precisely, let cool SLOWLY. Rapid cooling = weak bond = flying stones. Re-dop if ANY doubt about bond strength!',
            
            'transfer': 'The riskiest step! Heat BOTH dops (old pavilion dop AND new crown dop). Apply crown dop to table, align precisely with pavilion center. Heat old dop to release. SUPPORT THE STONE during entire process!',
            
            'failures': 'Common failures: Dop flyoff (cold wax, dirty stone, quick cool), Transfer loss (misalignment, uneven heat), Chipping (hard landing on lap, bad angles). Each failure teaches something!',
            
            'hardness': 'Mohs scale: Diamond=10 (takes FOREVER to cut, needs special laps), Corundum=9 (Ruby/Sapphire, patient work), Topaz=8 (perfect cleavage risk!), Quartz=7 (ideal learning), Opal=5.5 (soft, heat sensitive).',
            
            'angles': 'Standard pavilion: ~42° for maximum brilliance. Crown mains: ~42°. Star facets: lower angle. Table: 0° (flat). The index gear has 96 teeth = 3.75° per tooth for precise facet placement.',
            
            'levels': 'Higher levels unlock harder gems that take longer but pay more. Level 3: Topaz/Emerald. Level 8: Ruby/Sapphire. Level 15: Diamond/Alexandrite. Master the basics before tackling precious stones!',
            
            'tokens': 'Tokens represent proven skill in gem cutting. Earned through completing stones, especially perfect cuts and difficult materials. Use them to unlock upgrades and prove your mastery.',
            
            'safety': 'The GemBot has limit switches on all axes to prevent crashes. Emergency stop releases all motors. Motor timeout (60 seconds) stops runaway operations. Respect these safety systems!'
        };
        
        const response = advice[topic] || 'Ask me about: gems, machines, strategy, process, laps, dopping, transfer, failures, hardness, angles, levels, tokens, or safety - and I shall enlighten you with the wisdom of the ages!';
        this.merlinSpeak(response);
        return response;
    }
}

// Export for global access
window.GemBotFarmGame = GemBotFarmGame;
console.log('🎮 GemBot Farm Game module loaded (with Merlin AI integration)');
