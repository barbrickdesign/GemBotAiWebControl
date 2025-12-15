/**
 * 💎 GemBot Game Systems Integration Bridge
 * Connects all new game modules with GemBot_Control_AI.html and Farm Game
 * 
 * This file acts as the glue between:
 * - gembot-parts-database.js
 * - gembot-faceting-designs.js  
 * - gembot-stl-catalog.js
 * - gembot-game-cards.js
 * - gembot-3d-printing.js
 * - gembot-troubleshooting.js
 * - gembot-game-master.js
 * - merlin-enhanced-responses.js
 * - Existing MerlinPersonality class
 * - Existing GemBotFarmGame class
 */

const GemBotGameIntegration = {
    version: "1.0.0",
    initialized: false,
    
    // References to loaded modules
    modules: {
        partsDatabase: null,
        facetingDesigns: null,
        stlCatalog: null,
        gameCards: null,
        printing: null,
        troubleshooting: null,
        gameMaster: null,
        merlinResponses: null
    },

    // Unified player state combining all systems
    unifiedState: null,

    /**
     * Initialize all game systems
     */
    async init() {
        if (this.initialized) {
            console.log('⚠️ GemBot Game Integration already initialized');
            return;
        }

        console.log('💎 Initializing GemBot Game Integration...');

        // Detect available modules
        this.detectModules();

        // Create or load unified state
        this.unifiedState = this.loadUnifiedState();

        // Integrate with existing Merlin
        this.enhanceMerlin();

        // Integrate with Farm Game
        this.integrateFarmGame();

        // Setup event listeners
        this.setupEventListeners();

        this.initialized = true;
        console.log('✅ GemBot Game Integration initialized!');
        
        return this;
    },

    /**
     * Detect which modules are loaded
     */
    detectModules() {
        this.modules.partsDatabase = window.GemBotPartsDatabase || null;
        this.modules.facetingDesigns = window.GemBotFacetingDesigns || null;
        this.modules.stlCatalog = window.GemBotSTLCatalog || null;
        this.modules.gameCards = window.GemBotGameCards || null;
        this.modules.printing = window.GemBot3DPrinting || null;
        this.modules.troubleshooting = window.GemBotTroubleshooting || null;
        this.modules.gameMaster = window.GemBotGameMaster || null;
        this.modules.merlinResponses = window.MerlinEnhancedResponses || null;

        const loaded = Object.entries(this.modules)
            .filter(([_, v]) => v !== null)
            .map(([k, _]) => k);
        
        console.log(`📦 Loaded modules: ${loaded.join(', ') || 'none'}`);
    },

    /**
     * Load or create unified player state
     */
    loadUnifiedState() {
        try {
            const saved = localStorage.getItem('gembot_unified_state');
            if (saved) {
                const state = JSON.parse(saved);
                console.log('📂 Loaded existing unified state');
                return state;
            }
        } catch (e) {
            console.warn('Could not load unified state:', e);
        }

        // Create new state
        const state = {
            version: "1.0.0",
            createdAt: Date.now(),
            lastSaved: Date.now(),
            
            // From GameMaster
            player: this.modules.gameMaster?.createGameState() || {
                playerId: `player_${Date.now()}`,
                playerName: "New Lapidary",
                level: 1,
                xp: 0,
                gold: 500,
                gems: 0
            },
            
            // From 3D Printing
            printing: this.modules.printing?.createPlayerPrintingState() || null,
            
            // From Troubleshooting
            troubleshooting: this.modules.troubleshooting?.createPlayerTroubleshootingState() || null,
            
            // Card collection
            cardCollection: {},
            
            // Unlocked content
            unlockedDesigns: ['round_brilliant_standard'],
            unlockedParts: ['basic_frame'],
            
            // Integration flags
            syncedWithFarmGame: false,
            syncedWithMerlin: false
        };

        console.log('🆕 Created new unified state');
        return state;
    },

    /**
     * Save unified state
     */
    saveUnifiedState() {
        if (!this.unifiedState) return;
        
        this.unifiedState.lastSaved = Date.now();
        localStorage.setItem('gembot_unified_state', JSON.stringify(this.unifiedState));
    },

    /**
     * Enhance the existing Merlin AI with new response system
     */
    enhanceMerlin() {
        if (!window.merlin) {
            console.warn('⚠️ Merlin not found - will enhance when available');
            // User-facing error banner
            if (!document.getElementById('merlin-error-banner')) {
                const banner = document.createElement('div');
                banner.id = 'merlin-error-banner';
                banner.style = 'background:#b71c1c;color:#fff;padding:8px 16px;margin:8px 0;border-radius:4px;font-weight:bold;z-index:9999;position:relative;';
                banner.textContent = 'Critical: Merlin AI module not found. Some features will be unavailable.';
                document.body.prepend(banner);
            }
            return;
        }

        const originalMerlin = window.merlin;
        const enhancedResponses = this.modules.merlinResponses;

        if (!enhancedResponses) {
            console.warn('⚠️ Enhanced responses module not loaded');
            return;
        }

        // Override greeting generation to use enhanced system
        const originalGreeting = originalMerlin.generateAdaptiveGreeting?.bind(originalMerlin);
        
        originalMerlin.generateAdaptiveGreeting = function() {
            // Build context from Merlin's knowledge
            const context = {
                userName: this.userProfile?.userName,
                title: this.getAffectionateTitle?.() || 'apprentice',
                isFirstTime: this.userProfile?.sessionCount === 1,
                sessionCount: this.userProfile?.sessionCount || 1,
                daysSinceLastVisit: this.calculateDaysSinceLastVisit?.() || 0,
                lastTopic: this.userProfile?.topicsLearned?.slice(-1)[0],
                skillLevel: this.userProfile?.skillLevel || 'novice',
                progressNote: this.getProgressNote?.() || ''
            };

            // Try enhanced greeting first
            try {
                const enhanced = enhancedResponses.generateGreeting(context);
                if (enhanced && enhanced.length > 0) {
                    return enhanced;
                }
            } catch (e) {
                console.warn('Enhanced greeting failed, using original:', e);
            }

            // Fall back to original
            return originalGreeting ? originalGreeting() : "Welcome, seeker of brilliance.";
        };

        // Add helper method for days calculation
        originalMerlin.calculateDaysSinceLastVisit = function() {
            if (!this.userProfile?.lastSessionDate) return 0;
            const last = new Date(this.userProfile.lastSessionDate);
            const now = new Date();
            return Math.floor((now - last) / (1000 * 60 * 60 * 24));
        };

        // Add progress note generator
        originalMerlin.getProgressNote = function() {
            const topics = this.userProfile?.topicsLearned?.length || 0;
            const sessions = this.userProfile?.sessionCount || 0;
            
            if (topics > 20) return "Your knowledge grows vast!";
            if (topics > 10) return "You've learned much.";
            if (sessions > 10) return "Our bond strengthens.";
            return "";
        };

        // Enhance the follow-up greeting too
        const originalFollowUp = originalMerlin.generateGreetingFollowUp?.bind(originalMerlin);
        
        originalMerlin.generateGreetingFollowUp = function() {
            const context = {
                userName: this.userProfile?.userName,
                skillLevel: this.userProfile?.skillLevel || 'novice',
                connectionStatus: this.connectionStatus
            };

            // Generate contextual tip instead of static follow-up
            try {
                if (enhancedResponses && Math.random() > 0.3) {
                    const tip = enhancedResponses.generateTip(context);
                    if (tip) return tip;
                }
            } catch (e) {
                console.warn('Enhanced tip failed:', e);
            }

            return originalFollowUp ? originalFollowUp() : "How may I guide you today?";
        };

        // Mark as enhanced
        originalMerlin._enhanced = true;
        console.log('🧙 Merlin AI enhanced with unique response system');
    },

    /**
     * Integrate with existing Farm Game
     */
    integrateFarmGame() {
        if (!window.gemBotFarmGame) {
            console.warn('⚠️ Farm Game not found - will integrate when available');
            // Set up observer for when it loads
            const checkInterval = setInterval(() => {
                if (window.gemBotFarmGame) {
                    clearInterval(checkInterval);
                    this.doFarmGameIntegration();
                }
            }, 1000);
            // Stop checking after 30 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!window.gemBotFarmGame && !document.getElementById('farmgame-error-banner')) {
                    const banner = document.createElement('div');
                    banner.id = 'farmgame-error-banner';
                    banner.style = 'background:#b71c1c;color:#fff;padding:8px 16px;margin:8px 0;border-radius:4px;font-weight:bold;z-index:9999;position:relative;';
                    banner.textContent = 'Critical: Farm Game module not found. Game features will be unavailable.';
                    document.body.prepend(banner);
                }
            }, 30000);
            return;
        }

        this.doFarmGameIntegration();
    },

    /**
     * Actually perform farm game integration
     */
    doFarmGameIntegration() {
        const farmGame = window.gemBotFarmGame;
        if (!farmGame) return;

        console.log('🎮 Integrating with Farm Game...');

        // Enhance Merlin tips in farm game with our tip database
        const originalGetTips = farmGame.getContextualTips?.bind(farmGame);
        
        if (originalGetTips && this.modules.merlinResponses) {
            farmGame.getContextualTips = () => {
                const originalTips = originalGetTips();
                
                // Add enhanced tips based on player context
                const context = {
                    skillLevel: this.getSkillLevelFromFarmGame(farmGame),
                    userName: window.merlin?.userProfile?.userName
                };

                // Generate some unique tips
                const enhancedTips = [];
                for (let i = 0; i < 3; i++) {
                    try {
                        const tip = this.modules.merlinResponses.generateTip(context);
                        if (tip && !originalTips.includes(tip)) {
                            enhancedTips.push(tip);
                        }
                    } catch (e) {
                        // Silent fail - original tips are fine
                    }
                }

                return [...originalTips, ...enhancedTips];
            };
        }

        // Sync progression between systems
        this.syncProgressionSystems(farmGame);

        // Add new game mechanics to farm game
        this.addNewMechanicsToFarm(farmGame);

        console.log('✅ Farm Game integration complete');
    },

    /**
     * Get skill level from farm game state
     */
    getSkillLevelFromFarmGame(farmGame) {
        const level = farmGame?.state?.player?.level || 1;
        if (level < 3) return 'beginner';
        if (level < 8) return 'intermediate';
        return 'advanced';
    },

    /**
     * Sync progression between all systems
     */
    syncProgressionSystems(farmGame) {
        if (!farmGame || !this.unifiedState) return;

        // Sync level
        const farmLevel = farmGame.state?.player?.level || 1;
        const masterLevel = this.unifiedState.player?.level || 1;
        
        // Use the higher level
        const syncedLevel = Math.max(farmLevel, masterLevel);
        
        if (this.modules.gameMaster && this.unifiedState.player) {
            this.unifiedState.player.level = syncedLevel;
        }

        // Sync currency (combine)
        if (this.unifiedState.player) {
            const farmGems = farmGame.state?.player?.gems || 0;
            const masterGold = this.unifiedState.player.gold || 0;
            
            // Keep them separate but accessible
            this.unifiedState.player.farmGems = farmGems;
            this.unifiedState.player.gold = masterGold;
        }

        this.saveUnifiedState();
    },

    /**
     * Add new mechanics hooks to farm game
     */
    addNewMechanicsToFarm(farmGame) {
        // Add 3D printing as a feature
        if (this.modules.printing) {
            farmGame.printing = this.modules.printing;
            farmGame.printingState = this.unifiedState.printing;
            
            console.log('🖨️ 3D Printing system added to Farm Game');
        }

        // Add troubleshooting as machine maintenance
        if (this.modules.troubleshooting) {
            farmGame.troubleshooting = this.modules.troubleshooting;
            farmGame.troubleshootingState = this.unifiedState.troubleshooting;
            
            // Hook into machine operations
            const originalTick = farmGame.gameTick?.bind(farmGame);
            if (originalTick) {
                farmGame.gameTick = () => {
                    originalTick();
                    
                    // Roll for random failures occasionally
                    if (Math.random() < 0.001 && farmGame.troubleshootingState) {
                        const failure = this.modules.troubleshooting.rollForFailure(
                            farmGame.troubleshootingState,
                            'normal'
                        );
                        
                        if (failure) {
                            console.log('⚠️ Machine failure:', failure.failure?.name);
                            if (farmGame.merlinSpeak) {
                                farmGame.merlinSpeak(
                                    `Warning! ${failure.failure?.name}: ${failure.symptom}`
                                );
                            }
                        }
                    }
                };
            }
            
            console.log('🔧 Troubleshooting system added to Farm Game');
        }

        // Add card pack rewards
        if (this.modules.gameCards) {
            farmGame.gameCards = this.modules.gameCards;
            
            // Hook into achievement rewards
            const originalCelebrate = farmGame.merlinCelebrate?.bind(farmGame);
            if (originalCelebrate) {
                farmGame.merlinCelebrate = (type, data) => {
                    originalCelebrate(type, data);
                    
                    // Award card packs for achievements
                    if (type === 'level_up' && data.level % 5 === 0) {
                        const packResult = this.modules.gameCards.openCardPack(
                            this.unifiedState.cardCollection,
                            data.level >= 10 ? 'premium' : 'standard'
                        );
                        
                        console.log('🎴 Awarded card pack for level milestone!', packResult);
                    }
                };
            }
            
            console.log('🃏 Card system added to Farm Game');
        }
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Auto-save periodically
        setInterval(() => {
            this.saveUnifiedState();
        }, 30000);

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveUnifiedState();
        });

        // Listen for custom game events
        window.addEventListener('gembot-level-up', (e) => {
            if (this.modules.gameMaster && this.unifiedState) {
                const result = this.modules.gameMaster.addXP(
                    this.unifiedState.player,
                    e.detail?.xp || 100,
                    e.detail?.source || 'level_up'
                );
                console.log('📈 Level up processed:', result);
            }
        });

        window.addEventListener('gembot-achievement', (e) => {
            if (this.modules.gameMaster && this.unifiedState) {
                const result = this.modules.gameMaster.checkAchievement(
                    this.unifiedState.player,
                    e.detail?.achievementId
                );
                if (result) {
                    console.log('🏆 Achievement unlocked:', result);
                }
            }
        });
    },

    /**
     * Get current unified state summary
     */
    getStateSummary() {
        if (!this.unifiedState) return null;

        return {
            playerName: this.unifiedState.player?.playerName,
            level: this.unifiedState.player?.level,
            gold: this.unifiedState.player?.gold,
            cardsCollected: Object.keys(this.unifiedState.cardCollection || {}).length,
            printsCompleted: this.unifiedState.printing?.successfulPrints || 0,
            repairsCompleted: this.unifiedState.troubleshooting?.totalRepairs || 0,
            modulesActive: Object.values(this.modules).filter(m => m !== null).length
        };
    },

    /**
     * Award XP through the unified system
     */
    awardXP(amount, source) {
        if (!this.modules.gameMaster || !this.unifiedState?.player) return null;
        
        const result = this.modules.gameMaster.addXP(this.unifiedState.player, amount, source);
        this.saveUnifiedState();
        
        return result;
    },

    /**
     * Trigger achievement check
     */
    checkAchievement(achievementId) {
        if (!this.modules.gameMaster || !this.unifiedState?.player) return null;
        
        const result = this.modules.gameMaster.checkAchievement(this.unifiedState.player, achievementId);
        if (result) {
            this.saveUnifiedState();
        }
        
        return result;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        GemBotGameIntegration.init();
    });
} else {
    // DOM already ready
    GemBotGameIntegration.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotGameIntegration;
}

// Global access
window.GemBotGameIntegration = GemBotGameIntegration;

console.log('🔗 GemBot Game Integration Bridge loaded!');
