/**
 * 💎 GemBot Game Master Integration
 * Unified system connecting all game modules with real-world purchase integration
 * 
 * Features:
 * - Central game state management
 * - Module integration (Parts, Designs, STL, Cards, Printing, Troubleshooting)
 * - Real-world purchase pathways
 * - Achievement system
 * - Daily challenges
 * - Progression tracking
 */

const GemBotGameMaster = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",

    // Real-world integration configuration
    realWorldConfig: {
        amazonAffiliateTag: "gembot-20", // Replace with actual affiliate tag
        baseAmazonUrl: "https://www.amazon.com/dp/",
        
        // STL marketplace integration
        stlMarketplace: {
            etsyShop: "GemBotParts", // Placeholder
            printablesProfile: "GemBot3D",
            thingiverseProfile: "GemBotCreator"
        },
        
        // Payment integration (conceptual)
        paymentProviders: {
            stripe: { enabled: false, publicKey: "" },
            paypal: { enabled: false, clientId: "" }
        },
        
        // Pricing tiers for STL files
        stlPricing: {
            basic: { price: 2.99, includes: "Single STL file" },
            bundle: { price: 9.99, includes: "Category pack (5-10 files)" },
            complete: { price: 49.99, includes: "All STL files + updates" }
        }
    },

    // Achievement definitions
    achievements: {
        // Getting Started
        firstGem: {
            id: "firstGem",
            name: "First Sparkle",
            description: "Cut your first gemstone",
            icon: "💎",
            xpReward: 50,
            category: "beginner"
        },
        firstPrint: {
            id: "firstPrint",
            name: "Layer by Layer",
            description: "Complete your first 3D print",
            icon: "🖨️",
            xpReward: 50,
            category: "beginner"
        },
        firstRepair: {
            id: "firstRepair",
            name: "Handy Worker",
            description: "Successfully repair a component",
            icon: "🔧",
            xpReward: 75,
            category: "beginner"
        },
        
        // Milestones
        cut10Gems: {
            id: "cut10Gems",
            name: "Gem Collector",
            description: "Cut 10 different gem designs",
            icon: "💠",
            xpReward: 200,
            category: "milestone"
        },
        print25Parts: {
            id: "print25Parts",
            name: "Print Master",
            description: "Successfully print 25 parts",
            icon: "🏭",
            xpReward: 300,
            category: "milestone"
        },
        earnGold1000: {
            id: "earnGold1000",
            name: "Gold Digger",
            description: "Earn 1,000 gold coins",
            icon: "🪙",
            xpReward: 150,
            category: "milestone"
        },
        
        // Skill Based
        perfectCut: {
            id: "perfectCut",
            name: "Precision Master",
            description: "Achieve a perfect cut with 100% symmetry",
            icon: "⭐",
            xpReward: 250,
            category: "skill"
        },
        perfectPrint: {
            id: "perfectPrint",
            name: "Perfect Print",
            description: "Get an A+ quality print",
            icon: "✨",
            xpReward: 200,
            category: "skill"
        },
        masterDiagnostic: {
            id: "masterDiagnostic",
            name: "Diagnostic Genius",
            description: "Complete 10 perfect diagnostics",
            icon: "🧠",
            xpReward: 350,
            category: "skill"
        },
        
        // Collection
        collectAllRound: {
            id: "collectAllRound",
            name: "Round Collector",
            description: "Unlock all Round Brilliant variations",
            icon: "🔵",
            xpReward: 500,
            category: "collection"
        },
        collectRareCards: {
            id: "collectRareCards",
            name: "Rare Finder",
            description: "Collect 10 rare or better cards",
            icon: "🃏",
            xpReward: 400,
            category: "collection"
        },
        
        // Real World
        firstRealPurchase: {
            id: "firstRealPurchase",
            name: "Going Physical",
            description: "Purchase your first real component",
            icon: "📦",
            xpReward: 100,
            category: "realWorld"
        },
        buildComplete: {
            id: "buildComplete",
            name: "Master Builder",
            description: "Complete a full GemBot machine build",
            icon: "🏆",
            xpReward: 5000,
            category: "realWorld"
        }
    },

    // Daily challenge templates
    dailyChallenges: {
        quickPrint: {
            id: "quickPrint",
            name: "Quick Print",
            description: "Complete 3 prints today",
            target: 3,
            type: "printCount",
            xpReward: 100,
            goldReward: 50
        },
        materialEfficiency: {
            id: "materialEfficiency",
            name: "Material Saver",
            description: "Print without any failures today",
            target: 5,
            type: "noFailurePrints",
            xpReward: 150,
            goldReward: 75
        },
        repairRush: {
            id: "repairRush",
            name: "Repair Rush",
            description: "Complete 2 repairs in under 10 minutes each",
            target: 2,
            type: "quickRepairs",
            xpReward: 125,
            goldReward: 60
        },
        gemCutter: {
            id: "gemCutter",
            name: "Gem Cutter",
            description: "Cut 5 gems of any type",
            target: 5,
            type: "gemssCut",
            xpReward: 100,
            goldReward: 50
        },
        cardCollector: {
            id: "cardCollector",
            name: "Card Hunter",
            description: "Open 3 card packs",
            target: 3,
            type: "packsOpened",
            xpReward: 75,
            goldReward: 25
        },
        qualitySeeker: {
            id: "qualitySeeker",
            name: "Quality Seeker",
            description: "Get 3 A-grade or better prints",
            target: 3,
            type: "highQualityPrints",
            xpReward: 175,
            goldReward: 100
        }
    },

    // Create unified player state
    createGameState() {
        return {
            // Player identity
            playerId: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            playerName: "New Lapidary",
            createdAt: Date.now(),
            lastActive: Date.now(),
            
            // Currency
            gold: 500, // Starting gold
            gems: 0, // Premium currency
            
            // Progression
            level: 1,
            xp: 0,
            totalXP: 0,
            
            // Module states (created by their respective modules)
            printing: null, // Use GemBot3DPrinting.createPlayerPrintingState()
            troubleshooting: null, // Use GemBotTroubleshooting.createPlayerTroubleshootingState()
            cardCollection: {},
            unlockedDesigns: ["round_brilliant_standard"],
            
            // Achievements
            achievements: [],
            achievementsProgress: {},
            
            // Daily challenges
            activeDailyChallenge: null,
            dailyChallengeProgress: 0,
            lastDailyChallengeDate: null,
            completedDailyChallenges: 0,
            
            // Statistics
            stats: {
                gemsCut: 0,
                totalPrintTime: 0,
                repairsCompleted: 0,
                cardsCollected: 0,
                packsOpened: 0,
                goldEarned: 0,
                goldSpent: 0,
                realPurchases: 0,
                playTime: 0
            },
            
            // Real world integration
            wishlist: [],
            purchaseHistory: [],
            savedBuilds: []
        };
    },

    // Level progression curve
    levelXPRequirements: [
        0,      // Level 1
        100,    // Level 2
        250,    // Level 3
        500,    // Level 4
        1000,   // Level 5
        1750,   // Level 6
        2750,   // Level 7
        4000,   // Level 8
        5500,   // Level 9
        7500,   // Level 10
        10000,  // Level 11
        13000,  // Level 12
        16500,  // Level 13
        20500,  // Level 14
        25000,  // Level 15
        30000,  // Level 16
        36000,  // Level 17
        43000,  // Level 18
        51000,  // Level 19
        60000   // Level 20 (Master Lapidary)
    ],

    /**
     * Add XP and check for level up
     */
    addXP(gameState, amount, source = "unknown") {
        gameState.xp += amount;
        gameState.totalXP += amount;
        
        const levelUps = [];
        
        // Check for level up(s)
        while (gameState.level < this.levelXPRequirements.length &&
               gameState.xp >= this.levelXPRequirements[gameState.level]) {
            gameState.xp -= this.levelXPRequirements[gameState.level];
            gameState.level++;
            
            levelUps.push({
                newLevel: gameState.level,
                rewards: this._getLevelUpRewards(gameState.level)
            });
        }
        
        return {
            xpAdded: amount,
            source: source,
            levelUps: levelUps,
            currentLevel: gameState.level,
            currentXP: gameState.xp,
            xpToNext: this.levelXPRequirements[gameState.level] || "MAX"
        };
    },

    /**
     * Get rewards for leveling up
     */
    _getLevelUpRewards(level) {
        const baseGold = 100 + (level * 50);
        const rewards = { gold: baseGold };
        
        // Milestone rewards
        if (level === 5) {
            rewards.unlock = "PETG material";
            rewards.cardPack = "rare";
        } else if (level === 10) {
            rewards.unlock = "ABS material + Professional Printer";
            rewards.cardPack = "epic";
        } else if (level === 15) {
            rewards.unlock = "Nylon material + Industrial Printer";
            rewards.cardPack = "epic";
        } else if (level === 20) {
            rewards.unlock = "All materials + Master achievement";
            rewards.cardPack = "legendary";
            rewards.title = "Master Lapidary";
        }
        
        return rewards;
    },

    /**
     * Check and award achievement
     */
    checkAchievement(gameState, achievementId) {
        if (gameState.achievements.includes(achievementId)) {
            return null; // Already earned
        }
        
        const achievement = this.achievements[achievementId];
        if (!achievement) return null;
        
        gameState.achievements.push(achievementId);
        const xpResult = this.addXP(gameState, achievement.xpReward, `Achievement: ${achievement.name}`);
        
        return {
            achievement: achievement,
            xpResult: xpResult,
            message: `🏆 Achievement Unlocked: ${achievement.icon} ${achievement.name}!`
        };
    },

    /**
     * Generate new daily challenge
     */
    generateDailyChallenge(gameState) {
        const today = new Date().toDateString();
        
        // Check if already have today's challenge
        if (gameState.lastDailyChallengeDate === today && gameState.activeDailyChallenge) {
            return {
                existing: true,
                challenge: this.dailyChallenges[gameState.activeDailyChallenge],
                progress: gameState.dailyChallengeProgress
            };
        }
        
        // Pick random challenge
        const challengeIds = Object.keys(this.dailyChallenges);
        const randomId = challengeIds[Math.floor(Math.random() * challengeIds.length)];
        
        gameState.activeDailyChallenge = randomId;
        gameState.dailyChallengeProgress = 0;
        gameState.lastDailyChallengeDate = today;
        
        return {
            existing: false,
            challenge: this.dailyChallenges[randomId],
            progress: 0
        };
    },

    /**
     * Update daily challenge progress
     */
    updateDailyChallengeProgress(gameState, progressType, amount = 1) {
        if (!gameState.activeDailyChallenge) return null;
        
        const challenge = this.dailyChallenges[gameState.activeDailyChallenge];
        if (challenge.type !== progressType) return null;
        
        gameState.dailyChallengeProgress += amount;
        
        if (gameState.dailyChallengeProgress >= challenge.target) {
            // Challenge complete!
            gameState.gold += challenge.goldReward;
            const xpResult = this.addXP(gameState, challenge.xpReward, `Daily Challenge: ${challenge.name}`);
            gameState.completedDailyChallenges++;
            
            const completedChallenge = gameState.activeDailyChallenge;
            gameState.activeDailyChallenge = null;
            
            return {
                completed: true,
                challenge: challenge,
                goldEarned: challenge.goldReward,
                xpResult: xpResult,
                message: `🎯 Daily Challenge Complete: ${challenge.name}!`
            };
        }
        
        return {
            completed: false,
            challenge: challenge,
            progress: gameState.dailyChallengeProgress,
            remaining: challenge.target - gameState.dailyChallengeProgress
        };
    },

    // === REAL WORLD INTEGRATION ===

    /**
     * Generate Amazon affiliate link
     */
    generateAmazonLink(asin) {
        return `${this.realWorldConfig.baseAmazonUrl}${asin}?tag=${this.realWorldConfig.amazonAffiliateTag}`;
    },

    /**
     * Add item to real-world wishlist
     */
    addToWishlist(gameState, item) {
        if (!gameState.wishlist.some(w => w.id === item.id)) {
            gameState.wishlist.push({
                ...item,
                addedAt: Date.now(),
                amazonLink: item.amazonASIN ? this.generateAmazonLink(item.amazonASIN) : null
            });
            return true;
        }
        return false;
    },

    /**
     * Generate build shopping list
     */
    generateShoppingList(gameState, buildType = "basic") {
        // Reference the parts database
        const builds = {
            basic: {
                name: "Basic GemBot Build",
                estimatedCost: 564,
                parts: [
                    { category: "frameAndStructural", items: ["aluminumExtrusion_2020x600", "aluminumExtrusion_2020x300"] },
                    { category: "motionSystem", items: ["stepperMotor_nema23", "timingBelt_gt2_400mm"] },
                    { category: "electronicsAndControl", items: ["arduinoMega_2560", "stepperDriver_dm542"] }
                ]
            },
            complete: {
                name: "Complete GemBot Build",
                estimatedCost: 4200,
                parts: [
                    { category: "all", items: "all" }
                ],
                includes3DPrinted: true
            }
        };
        
        const build = builds[buildType];
        if (!build) return null;
        
        return {
            buildName: build.name,
            estimatedCost: build.estimatedCost,
            parts: build.parts,
            generatedAt: Date.now(),
            affiliateTag: this.realWorldConfig.amazonAffiliateTag
        };
    },

    /**
     * Track real-world purchase (for achievements)
     */
    trackPurchase(gameState, purchaseData) {
        gameState.purchaseHistory.push({
            ...purchaseData,
            purchasedAt: Date.now()
        });
        
        gameState.stats.realPurchases++;
        
        // Check for first purchase achievement
        if (gameState.stats.realPurchases === 1) {
            return this.checkAchievement(gameState, "firstRealPurchase");
        }
        
        return null;
    },

    /**
     * Generate STL download package info
     */
    generateSTLPackageInfo(packageType) {
        const pricing = this.realWorldConfig.stlPricing[packageType];
        if (!pricing) return null;
        
        return {
            packageType: packageType,
            price: pricing.price,
            includes: pricing.includes,
            formats: ["STL", "STEP", "3MF"],
            license: "Personal use + single commercial sale",
            support: packageType === "complete" ? "Email support included" : "Community support"
        };
    },

    // === UI GENERATION ===

    /**
     * Generate main dashboard HTML
     */
    generateDashboardHTML(gameState) {
        const xpToNext = this.levelXPRequirements[gameState.level] || gameState.xp;
        const xpProgress = gameState.level >= 20 ? 100 : (gameState.xp / xpToNext) * 100;
        
        const dailyChallenge = gameState.activeDailyChallenge ? 
            this.dailyChallenges[gameState.activeDailyChallenge] : null;
        
        return `
            <div class="gembot-dashboard">
                <header class="dashboard-header">
                    <div class="player-info">
                        <h2>${gameState.playerName}</h2>
                        <div class="level-badge">Level ${gameState.level}</div>
                    </div>
                    
                    <div class="currency-display">
                        <span class="gold">🪙 ${gameState.gold.toLocaleString()}</span>
                        <span class="gems">💎 ${gameState.gems}</span>
                    </div>
                </header>
                
                <div class="xp-section">
                    <div class="xp-bar">
                        <div class="xp-fill" style="width: ${xpProgress}%"></div>
                    </div>
                    <div class="xp-text">
                        ${gameState.level >= 20 ? 'MAX LEVEL' : `${gameState.xp} / ${xpToNext} XP`}
                    </div>
                </div>
                
                ${dailyChallenge ? `
                    <div class="daily-challenge">
                        <h3>🎯 Daily Challenge</h3>
                        <div class="challenge-info">
                            <span class="challenge-name">${dailyChallenge.name}</span>
                            <span class="challenge-desc">${dailyChallenge.description}</span>
                            <div class="challenge-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(gameState.dailyChallengeProgress / dailyChallenge.target) * 100}%"></div>
                                </div>
                                <span>${gameState.dailyChallengeProgress}/${dailyChallenge.target}</span>
                            </div>
                            <div class="challenge-rewards">
                                Rewards: ${dailyChallenge.xpReward} XP + ${dailyChallenge.goldReward} 🪙
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="daily-challenge empty">
                        <button onclick="GemBotGameMaster.generateDailyChallenge(gameState)">
                            Get Today's Challenge
                        </button>
                    </div>
                `}
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-icon">💎</span>
                        <span class="stat-value">${gameState.stats.gemsCut}</span>
                        <span class="stat-label">Gems Cut</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-icon">🖨️</span>
                        <span class="stat-value">${gameState.printing?.successfulPrints || 0}</span>
                        <span class="stat-label">Prints Done</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-icon">🔧</span>
                        <span class="stat-value">${gameState.troubleshooting?.totalRepairs || 0}</span>
                        <span class="stat-label">Repairs</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-icon">🃏</span>
                        <span class="stat-value">${Object.keys(gameState.cardCollection).length}</span>
                        <span class="stat-label">Cards</span>
                    </div>
                </div>
                
                <div class="achievements-preview">
                    <h3>🏆 Recent Achievements</h3>
                    <div class="achievement-list">
                        ${gameState.achievements.slice(-3).map(id => {
                            const ach = this.achievements[id];
                            return `<span class="achievement-badge">${ach.icon} ${ach.name}</span>`;
                        }).join('') || '<span class="no-achievements">Start playing to earn achievements!</span>'}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Generate real-world shop HTML
     */
    generateShopHTML(gameState) {
        return `
            <div class="gembot-shop">
                <h2>🏪 GemBot Shop</h2>
                
                <section class="shop-section">
                    <h3>📦 Build Kits</h3>
                    <div class="product-grid">
                        <div class="product-card">
                            <div class="product-image">🔧</div>
                            <h4>Basic Build Kit</h4>
                            <p>Essential components to get started</p>
                            <div class="price">$564</div>
                            <button onclick="GemBotGameMaster.generateShoppingList(gameState, 'basic')">
                                View Parts List
                            </button>
                        </div>
                        
                        <div class="product-card featured">
                            <div class="featured-badge">BEST VALUE</div>
                            <div class="product-image">⚙️</div>
                            <h4>Complete Build Kit</h4>
                            <p>Everything needed for full GemBot machine</p>
                            <div class="price">$4,200</div>
                            <button onclick="GemBotGameMaster.generateShoppingList(gameState, 'complete')">
                                View Parts List
                            </button>
                        </div>
                    </div>
                </section>
                
                <section class="shop-section">
                    <h3>📐 STL Files</h3>
                    <div class="product-grid">
                        <div class="product-card">
                            <div class="product-image">📄</div>
                            <h4>Single Part STL</h4>
                            <p>Individual 3D printable file</p>
                            <div class="price">$2.99</div>
                        </div>
                        
                        <div class="product-card">
                            <div class="product-image">📁</div>
                            <h4>Category Bundle</h4>
                            <p>5-10 related STL files</p>
                            <div class="price">$9.99</div>
                        </div>
                        
                        <div class="product-card featured">
                            <div class="featured-badge">COMPLETE</div>
                            <div class="product-image">📚</div>
                            <h4>Full STL Collection</h4>
                            <p>All STL files + lifetime updates</p>
                            <div class="price">$49.99</div>
                        </div>
                    </div>
                </section>
                
                <section class="shop-section">
                    <h3>💎 Your Wishlist (${gameState.wishlist.length} items)</h3>
                    ${gameState.wishlist.length > 0 ? `
                        <div class="wishlist-items">
                            ${gameState.wishlist.map(item => `
                                <div class="wishlist-item">
                                    <span class="item-name">${item.name}</span>
                                    ${item.amazonLink ? 
                                        `<a href="${item.amazonLink}" target="_blank" class="buy-btn">Buy on Amazon</a>` :
                                        '<span class="no-link">Link unavailable</span>'
                                    }
                                </div>
                            `).join('')}
                        </div>
                        <div class="wishlist-total">
                            Estimated Total: $${gameState.wishlist.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
                        </div>
                    ` : '<p class="empty-wishlist">Add items to your wishlist from the parts database!</p>'}
                </section>
            </div>
        `;
    },

    /**
     * Generate CSS styles for game UI
     */
    getGameStyles() {
        return `
            <style>
            .gembot-dashboard {
                font-family: 'Segoe UI', system-ui, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                color: #eee;
                border-radius: 16px;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .level-badge {
                background: linear-gradient(45deg, #f39c12, #e74c3c);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .currency-display {
                display: flex;
                gap: 15px;
                font-size: 18px;
            }
            
            .xp-section {
                margin-bottom: 20px;
            }
            
            .xp-bar {
                height: 20px;
                background: #333;
                border-radius: 10px;
                overflow: hidden;
            }
            
            .xp-fill {
                height: 100%;
                background: linear-gradient(90deg, #3498db, #9b59b6);
                transition: width 0.3s ease;
            }
            
            .xp-text {
                text-align: center;
                font-size: 12px;
                margin-top: 5px;
                color: #888;
            }
            
            .daily-challenge {
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .daily-challenge h3 {
                margin: 0 0 10px 0;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .stat-card {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            
            .stat-icon {
                font-size: 24px;
                display: block;
            }
            
            .stat-value {
                font-size: 24px;
                font-weight: bold;
                display: block;
            }
            
            .stat-label {
                font-size: 11px;
                color: #888;
                text-transform: uppercase;
            }
            
            .achievements-preview {
                background: rgba(255,215,0,0.1);
                border-radius: 12px;
                padding: 15px;
            }
            
            .achievement-badge {
                display: inline-block;
                background: rgba(255,215,0,0.2);
                padding: 5px 10px;
                border-radius: 20px;
                margin: 3px;
                font-size: 12px;
            }
            
            /* Shop styles */
            .gembot-shop {
                font-family: 'Segoe UI', system-ui, sans-serif;
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .product-card {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                position: relative;
            }
            
            .product-card.featured {
                border: 2px solid #f39c12;
            }
            
            .featured-badge {
                position: absolute;
                top: -10px;
                right: 20px;
                background: #f39c12;
                color: #fff;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 10px;
                font-weight: bold;
            }
            
            .product-image {
                font-size: 48px;
                margin-bottom: 10px;
            }
            
            .price {
                font-size: 24px;
                font-weight: bold;
                color: #27ae60;
                margin: 10px 0;
            }
            
            .product-card button {
                background: #3498db;
                color: #fff;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .product-card button:hover {
                background: #2980b9;
            }
            </style>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotGameMaster;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.GemBotGameMaster = GemBotGameMaster;
}

console.log('💎 GemBot Game Master loaded!');
console.log(`🏆 Achievements: ${Object.keys(GemBotGameMaster.achievements).length}`);
console.log(`🎯 Daily Challenges: ${Object.keys(GemBotGameMaster.dailyChallenges).length}`);
console.log(`📊 Max Level: ${GemBotGameMaster.levelXPRequirements.length}`);
