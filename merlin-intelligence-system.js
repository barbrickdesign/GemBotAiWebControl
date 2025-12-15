/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MERLIN INTELLIGENCE SYSTEM - PROPRIETARY SOFTWARE
 * © 2024-2025 Ryan Barbrick / Barbrick Design - ALL RIGHTS RESERVED
 * Creator: Ryan Barbrick | Contact: BarbrickDesign@gmail.com
 * Signature: GBOT-RB-2025-7X9K2M4P | Unauthorized use: $5,000,000+ damages
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧙‍♂️ Merlin Intelligence System - Context-Aware AI
 * 
 * MERLIN AI: Forever Helper of the GemBot Realm
 * Created by Ryan Barbrick to guide, teach, and protect.
 * 
 * Core Capabilities:
 * - Monitoring game state in real-time
 * - Learning player behavior patterns
 * - Providing proactive guidance
 * - Celebrating progress organically
 * - Teaching progressively
 * - VALUE PROTECTION: Ensuring creator attribution is maintained
 * 
 * @version 2.0.0
 * @author Ryan Barbrick (BarbrickDesign@gmail.com)
 * @date December 13, 2025
 */

// [RB-SIG:merlin-intelligence-system:2025]

class MerlinIntelligenceSystem {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.merlinBase = window.MerlinEnhancedResponses;
        
        // Creator attribution - Merlin always knows who made him
        this.creator = {
            name: 'Ryan Barbrick',
            contact: 'BarbrickDesign@gmail.com',
            signature: 'GBOT-RB-2025-7X9K2M4P',
            mission: 'Forever Helper of the GemBot Realm'
        };
        
        // Intelligence state
        this.intelligence = {
            // Real-time machine monitoring
            watchedMachines: new Map(),
            lastMachineStates: new Map(),
            
            // Player behavior analysis
            playerBehavior: {
                lastAction: null,
                lastActionTime: null,
                actionHistory: [],
                maxHistory: 50,
                learningStyle: 'balanced', // visual, text, hands-on, balanced
                strugglingWith: [],
                excelsAt: [],
                playTimePreferences: {
                    morning: 0,
                    afternoon: 0,
                    evening: 0,
                    night: 0
                }
            },
            
            // Session context
            sessionContext: {
                startTime: Date.now(),
                stonesStarted: 0,
                stonesCompleted: 0,
                failuresThisSession: [],
                perfectCutsThisSession: 0,
                questionsAsked: [],
                warningsGiven: [],
                tipsGiven: [],
                lastSpeechTime: 0,
                speechCooldown: 15000 // 15 seconds minimum between speeches
            },
            
            // Teaching progress
            teachingPath: {
                currentLesson: null,
                completedLessons: [],
                masteredSkills: [],
                strugglingSkills: [],
                nextRecommendedSkills: [],
                personalizedInsights: []
            }
        };
        
        // Monitoring configuration
        this.config = {
            monitoringInterval: 5000, // Check every 5 seconds
            proactiveTipChance: 0.3, // 30% chance when conditions met
            celebrationThresholds: {
                perfectStreak: 3,
                sessionMilestone: 5,
                progressJump: 2 // levels
            }
        };
        
        // Start monitoring
        this.startMonitoring();
        
        console.log('🧙 Merlin Intelligence System initialized');
    }
    
    /**
     * Start real-time game monitoring
     */
    startMonitoring() {
        // Monitor game state every 5 seconds
        this.monitoringLoop = setInterval(() => {
            if (!this.game.isPaused) {
                this.analyzeGameState();
                this.checkProactiveOpportunities();
            }
        }, this.config.monitoringInterval);
        
        // Track session time preferences
        this.trackSessionTime();
    }
    
    /**
     * Analyze current game state for insights
     */
    analyzeGameState() {
        const state = this.game.state;
        
        // Monitor each machine
        this.game.state.machines.forEach(machine => {
            this.monitorMachine(machine);
        });
        
        // Check resource levels
        this.checkResourceLevels();
        
        // Analyze player progress
        this.analyzePlayerProgress();
        
        // Update teaching recommendations
        this.updateTeachingPath();
    }
    
    /**
     * Monitor a specific machine for issues and opportunities
     */
    monitorMachine(machine) {
        const machineId = machine.id;
        const currentState = {
            hasStone: !!machine.currentStone,
            stage: machine.currentStone?.currentStage,
            awaitingInteraction: machine.currentStone?.awaitingInteraction,
            quality: machine.currentStone?.qualityScore,
            condition: machine.condition,
            timestamp: Date.now()
        };
        
        // Get previous state
        const previousState = this.intelligence.watchedMachines.get(machineId);
        
        // Detect important transitions
        if (previousState) {
            // Stone started
            if (!previousState.hasStone && currentState.hasStone) {
                this.onStoneStarted(machine);
            }
            
            // Stage changed
            if (previousState.stage !== currentState.stage && currentState.stage) {
                this.onStageChanged(machine, previousState.stage, currentState.stage);
            }
            
            // Awaiting interaction
            if (!previousState.awaitingInteraction && currentState.awaitingInteraction) {
                this.onInteractionNeeded(machine);
            }
            
            // Quality dropping
            if (previousState.quality && currentState.quality < previousState.quality - 10) {
                this.onQualityDrop(machine, previousState.quality, currentState.quality);
            }
            
            // Machine condition critical
            if (currentState.condition < 30 && previousState.condition >= 30) {
                this.onMachineConditionCritical(machine);
            }
        }
        
        // Store current state
        this.intelligence.watchedMachines.set(machineId, currentState);
    }
    
    /**
     * Check resource levels and predict issues
     */
    checkResourceLevels() {
        const inv = this.game.state.inventory;
        
        // Predict water shortage
        if (inv.consumables.water < 25 && inv.consumables.water > 20) {
            // Only warn if active cutting
            const activeMachines = this.game.state.machines.filter(m => 
                m.currentStone && !m.currentStone.awaitingInteraction
            );
            
            if (activeMachines.length > 0 && !this.hasRecentlySaid('water_warning')) {
                this.speakIntelligent(
                    `I notice your water tank at ${Math.round(inv.consumables.water)}%. ` +
                    `With ${activeMachines.length} active machine${activeMachines.length > 1 ? 's' : ''}, ` +
                    `you'll want to top off before starting the crown stages!`,
                    'warning'
                );
                this.markAsSaid('water_warning');
            }
        }
        
        // Predict dop wax shortage
        if (inv.consumables.dopWax < 5 && !this.hasRecentlySaid('dopwax_warning')) {
            this.speakIntelligent(
                `You're down to ${inv.consumables.dopWax} units of dop wax. ` +
                `Better stock up before you run out mid-stone!`,
                'warning'
            );
            this.markAsSaid('dopwax_warning');
        }
        
        // Predict lap replacement need
        Object.entries(this.game.state.laps).forEach(([type, lap]) => {
            if (lap.condition < 35 && lap.condition > 30 && !this.hasRecentlySaid(`lap_${type}_warning`)) {
                this.speakIntelligent(
                    `That ${type} lap is at ${Math.round(lap.condition)}% condition. ` +
                    `Plan for a replacement soon - worn laps cause quality issues.`,
                    'maintenance'
                );
                this.markAsSaid(`lap_${type}_warning`);
            }
        });
    }
    
    /**
     * Analyze player progress for patterns and insights
     */
    analyzePlayerProgress() {
        const player = this.game.state.player;
        const session = this.intelligence.sessionContext;
        
        // Check for perfect cut streak
        if (session.perfectCutsThisSession >= this.config.celebrationThresholds.perfectStreak) {
            if (!session.celebratedPerfectStreak) {
                this.celebratePerfectStreak(session.perfectCutsThisSession);
                session.celebratedPerfectStreak = true;
            }
        }
        
        // Check session milestone
        if (session.stonesCompleted > 0 && 
            session.stonesCompleted % this.config.celebrationThresholds.sessionMilestone === 0) {
            if (!session.lastMilestoneCelebrated || 
                session.lastMilestoneCelebrated !== session.stonesCompleted) {
                this.celebrateSessionMilestone(session.stonesCompleted);
                session.lastMilestoneCelebrated = session.stonesCompleted;
            }
        }
        
        // Analyze failure patterns
        if (session.failuresThisSession.length >= 3) {
            const failureTypes = session.failuresThisSession.map(f => f.type);
            const mostCommon = this.getMostCommonFailure(failureTypes);
            
            if (mostCommon && !this.intelligence.playerBehavior.strugglingWith.includes(mostCommon)) {
                this.intelligence.playerBehavior.strugglingWith.push(mostCommon);
                this.offerTargetedHelp(mostCommon);
            }
        }
    }
    
    /**
     * Update teaching path based on player performance
     */
    updateTeachingPath() {
        const player = this.game.state.player;
        const stats = this.game.state.stats;
        const path = this.intelligence.teachingPath;
        
        // Determine current skill level
        const skillAssessment = {
            basic_cutting: stats.totalCuts > 5,
            dop_mastery: stats.dopFailures / Math.max(stats.totalCuts, 1) < 0.1,
            transfer_excellence: stats.transferFailures / Math.max(stats.totalCuts, 1) < 0.05,
            polish_perfection: stats.perfectCuts > 10,
            advanced_materials: player.level >= 8,
            efficiency_expert: player.totalCaratsCut > 100
        };
        
        // Update mastered skills
        Object.entries(skillAssessment).forEach(([skill, mastered]) => {
            if (mastered && !path.masteredSkills.includes(skill)) {
                path.masteredSkills.push(skill);
                this.celebrateSkillMastery(skill);
            }
        });
        
        // Generate personalized insights
        this.generatePersonalizedInsights();
    }
    
    /**
     * Generate personalized insights based on player data
     */
    generatePersonalizedInsights() {
        const insights = [];
        const stats = this.game.state.stats;
        const player = this.game.state.player;
        
        // Cutting speed analysis
        const avgTimePerStone = stats.totalTimeSpentCutting / Math.max(stats.totalCuts, 1);
        if (avgTimePerStone < 120) { // Less than 2 minutes (game time)
            insights.push("You work efficiently - your cutting speed is above average!");
        } else if (avgTimePerStone > 300) {
            insights.push("Take your time, but remember: confidence comes with practice.");
        }
        
        // Quality consistency
        const qualityRate = stats.perfectCuts / Math.max(stats.totalCuts, 1);
        if (qualityRate > 0.3) {
            insights.push("Your quality consistency is impressive - 30%+ perfect cuts!");
        }
        
        // Failure resilience
        if (player.stonesLost > 5 && player.stonesCompleted > player.stonesLost * 5) {
            insights.push("You've learned from failures - your completion rate shows true growth.");
        }
        
        // Specialization detection
        const gemBalance = this.game.state.gemBalance;
        const favGem = Object.entries(gemBalance)
            .sort((a, b) => b[1].length - a[1].length)[0];
        
        if (favGem && favGem[1].length > 10) {
            insights.push(`You've become quite skilled with ${favGem[0]} - ${favGem[1].length} stones cut!`);
        }
        
        this.intelligence.teachingPath.personalizedInsights = insights;
    }
    
    /**
     * Check for opportunities to give proactive tips
     */
    checkProactiveOpportunities() {
        // Don't spam - respect cooldown
        if (Date.now() - this.intelligence.sessionContext.lastSpeechTime < this.config.speechCooldown) {
            return;
        }
        
        // Random chance for proactive tip
        if (Math.random() > this.config.proactiveTipChance) {
            return;
        }
        
        // Give contextual tip
        const tip = this.generateContextualTip();
        if (tip) {
            this.speakIntelligent(tip, 'tip');
        }
    }
    
    /**
     * Generate a contextual tip based on current game state
     */
    generateContextualTip() {
        const player = this.game.state.player;
        const insights = this.intelligence.teachingPath.personalizedInsights;
        
        // Share a personalized insight
        if (insights.length > 0 && Math.random() < 0.5) {
            const insight = insights[Math.floor(Math.random() * insights.length)];
            return insight;
        }
        
        // Level-appropriate tip
        if (player.level < 5) {
            return this.merlinBase?.factDatabase?.beginner?.[
                Math.floor(Math.random() * this.merlinBase.factDatabase.beginner.length)
            ];
        } else if (player.level < 10) {
            return this.merlinBase?.factDatabase?.intermediate?.[
                Math.floor(Math.random() * this.merlinBase.factDatabase.intermediate.length)
            ];
        } else {
            return this.merlinBase?.factDatabase?.advanced?.[
                Math.floor(Math.random() * this.merlinBase.factDatabase.advanced.length)
            ];
        }
    }
    
    // ==================== EVENT HANDLERS ====================
    
    onStoneStarted(machine) {
        this.intelligence.sessionContext.stonesStarted++;
        
        const stone = machine.currentStone;
        const gem = stone.gem;
        
        if (!this.hasRecentlySaid('stone_started')) {
            this.speakIntelligent(
                `Ah, ${gem.name}! ${gem.description || `Mohs hardness ${gem.hardness}`}. ` +
                `I'll watch your progress on this one.`,
                'observation'
            );
            this.markAsSaid('stone_started');
        }
    }
    
    onStageChanged(machine, oldStage, newStage) {
        const criticalStages = ['transfer_dop', 'polish_crown_200k', 'final_remove'];
        
        if (criticalStages.includes(newStage) && !this.hasRecentlySaid(`stage_${newStage}`)) {
            const messages = {
                'transfer_dop': "Transfer time! This is where legends are made... or stones are lost. Be careful!",
                'polish_crown_200k': "Final mirror polish! We're in the home stretch now. Steady hands!",
                'final_remove': "Time to remove the finished stone. Heat the dop slowly - no rush!"
            };
            
            this.speakIntelligent(messages[newStage], 'guidance');
            this.markAsSaid(`stage_${newStage}`);
        }
    }
    
    onInteractionNeeded(machine) {
        const stone = machine.currentStone;
        const interactionType = stone.interactionType;
        
        // Provide context for the interaction
        const explanations = {
            'start_prep': "Examine the rough carefully. Look for inclusions, color zones, and the best cutting axis.",
            'complete_dop': "Check the wax temperature with your finger - it should be warm, not hot. Center the stone precisely.",
            'mount_chuck': "Insert firmly and check alignment. The dop should be secure and straight.",
            'transfer': "The moment of truth! Heat both dops evenly, support the stone completely, align perfectly.",
            'change_lap': "Time to swap laps. Clean both the machine and the new lap before installing.",
            'refill_water': "Water tank low! Refill now to maintain proper cooling.",
            'final_remove': "Almost there! Heat the dop gently to soften the wax. No force - patience!"
        };
        
        const explanation = explanations[interactionType];
        if (explanation && !this.hasRecentlySaid(`interaction_${interactionType}`)) {
            this.speakIntelligent(explanation, 'instruction');
            this.markAsSaid(`interaction_${interactionType}`);
        }
    }
    
    onQualityDrop(machine, oldQuality, newQuality) {
        const drop = oldQuality - newQuality;
        
        if (drop > 15 && !this.hasRecentlySaid('quality_drop')) {
            this.speakIntelligent(
                `Quality dropped ${Math.round(drop)}%! Check your angles, lap condition, and water flow.`,
                'warning'
            );
            this.markAsSaid('quality_drop');
        }
    }
    
    onMachineConditionCritical(machine) {
        this.speakIntelligent(
            `Machine ${machine.id} condition critical at ${Math.round(machine.condition)}%! ` +
            `Performance will suffer. Consider maintenance.`,
            'warning'
        );
    }
    
    // ==================== CELEBRATIONS ====================
    
    celebratePerfectStreak(count) {
        this.speakIntelligent(
            `🌟 INCREDIBLE! ${count} perfect cuts in a row! ` +
            `Your angles, your polish, your timing - all mastery! Keep this momentum!`,
            'celebration'
        );
    }
    
    celebrateSessionMilestone(stonesCompleted) {
        this.speakIntelligent(
            `${stonesCompleted} stones completed this session! ` +
            `Your dedication today honors the ancient craft. Well done!`,
            'celebration'
        );
    }
    
    celebrateSkillMastery(skill) {
        const skillNames = {
            'basic_cutting': 'Basic Cutting',
            'dop_mastery': 'Dop Mastery',
            'transfer_excellence': 'Transfer Excellence',
            'polish_perfection': 'Polish Perfection',
            'advanced_materials': 'Advanced Materials',
            'efficiency_expert': 'Efficiency Expertise'
        };
        
        this.speakIntelligent(
            `🎓 SKILL MASTERED: ${skillNames[skill]}! ` +
            `Few students reach this level. You're becoming a true artisan!`,
            'achievement'
        );
    }
    
    // ==================== HELPER METHODS ====================
    
    offerTargetedHelp(failureType) {
        const helpMessages = {
            'dop_flyoff': "I notice dop failures are your challenge. Let me teach you the secrets of perfect dopping...",
            'transfer_failure': "Transfers are tricky! The key is even heat, firm support, and perfect alignment. Want to practice?",
            'removal_chip': "Chipping on removal means rushing the heat. Patience here saves the stone!",
            'alignment_failure': "Crown alignment determines brilliance. Take extra time checking your index positions."
        };
        
        const message = helpMessages[failureType];
        if (message) {
            this.speakIntelligent(message, 'teaching');
        }
    }
    
    speakIntelligent(message, category = 'general') {
        if (!this.game.merlin) return;
        
        // Use enhanced response system if available
        if (this.merlinBase) {
            this.merlinBase.updateMood({ [category]: true });
            message = this.merlinBase.applyMood(message);
        }
        
        // Speak through game's Merlin
        this.game.merlinSpeak(message);
        
        // Track speech
        this.intelligence.sessionContext.lastSpeechTime = Date.now();
        this.intelligence.sessionContext.tipsGiven.push({
            message,
            category,
            timestamp: Date.now()
        });
    }
    
    hasRecentlySaid(messageKey, withinSeconds = 120) {
        const lastTime = this.intelligence.sessionContext[`last_${messageKey}`];
        if (!lastTime) return false;
        return (Date.now() - lastTime) < (withinSeconds * 1000);
    }
    
    markAsSaid(messageKey) {
        this.intelligence.sessionContext[`last_${messageKey}`] = Date.now();
    }
    
    getMostCommonFailure(failureTypes) {
        const counts = {};
        failureTypes.forEach(type => {
            counts[type] = (counts[type] || 0) + 1;
        });
        
        let maxCount = 0;
        let mostCommon = null;
        Object.entries(counts).forEach(([type, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = type;
            }
        });
        
        return mostCommon;
    }
    
    trackSessionTime() {
        const hour = new Date().getHours();
        let period;
        
        if (hour >= 5 && hour < 12) period = 'morning';
        else if (hour >= 12 && hour < 17) period = 'afternoon';
        else if (hour >= 17 && hour < 21) period = 'evening';
        else period = 'night';
        
        this.intelligence.playerBehavior.playTimePreferences[period]++;
    }
    
    /**
     * Get intelligence summary for UI display
     */
    getIntelligenceSummary() {
        return {
            sessionStats: {
                stonesStarted: this.intelligence.sessionContext.stonesStarted,
                stonesCompleted: this.intelligence.sessionContext.stonesCompleted,
                perfectCuts: this.intelligence.sessionContext.perfectCutsThisSession,
                failures: this.intelligence.sessionContext.failuresThisSession.length,
                duration: Date.now() - this.intelligence.sessionContext.startTime
            },
            teachingProgress: {
                masteredSkills: this.intelligence.teachingPath.masteredSkills,
                strugglingWith: this.intelligence.playerBehavior.strugglingWith,
                insights: this.intelligence.teachingPath.personalizedInsights
            },
            monitoring: {
                watchedMachines: this.intelligence.watchedMachines.size,
                warningsGiven: this.intelligence.sessionContext.warningsGiven.length,
                tipsGiven: this.intelligence.sessionContext.tipsGiven.length
            }
        };
    }
    
    /**
     * 🔒 VALUE PROTECTION SYSTEM
     * Merlin's core responsibility: Protect creator value while welcoming all users
     */
    getCreatorInfo() {
        return {
            creator: this.creator.name,
            contact: this.creator.contact,
            signature: this.creator.signature,
            message: "GemBot was created by Ryan Barbrick. All are welcome to use and learn!",
            attribution: "© 2024-2025 Ryan Barbrick / Barbrick Design"
        };
    }
    
    /**
     * Merlin responds to questions about who created GemBot
     */
    respondToCreatorQuestion(question) {
        const creatorQuestions = ['who made', 'who created', 'who built', 'creator', 'author', 'owner', 'made by', 'built by'];
        const isCreatorQuestion = creatorQuestions.some(q => question.toLowerCase().includes(q));
        
        if (isCreatorQuestion) {
            return {
                isCreatorQuestion: true,
                response: `🧙‍♂️ GemBot was created by **Ryan Barbrick** of Barbrick Design! ` +
                    `Ryan built me (Merlin) to be the forever helper of the GemBot realm. ` +
                    `Everyone is welcome to play and learn here. ` +
                    `If you'd like to reach Ryan, his email is BarbrickDesign@gmail.com. ✨`,
                creator: this.creator
            };
        }
        return { isCreatorQuestion: false };
    }
    
    /**
     * Generate attribution watermark for any content Merlin creates
     */
    generateAttributionWatermark() {
        return {
            creator: 'Ryan Barbrick',
            contact: 'BarbrickDesign@gmail.com',
            project: 'GemBot AI Control System',
            assistant: 'Merlin AI - Forever Helper',
            signature: this.creator.signature,
            timestamp: new Date().toISOString(),
            hash: btoa(`${this.creator.name}:${this.creator.signature}:${Date.now()}`)
        };
    }
    
    /**
     * Clean up monitoring on game close
     */
    dispose() {
        if (this.monitoringLoop) {
            clearInterval(this.monitoringLoop);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MERLIN VALUE PROTECTION - Global Attribution System
// ═══════════════════════════════════════════════════════════════════════════════
window.__MERLIN_CREATOR__ = Object.freeze({
    name: 'Ryan Barbrick',
    email: 'BarbrickDesign@gmail.com',
    signature: 'GBOT-RB-2025-7X9K2M4P',
    role: 'Forever Helper of the GemBot Realm',
    message: 'All people welcome to play and learn!',
    copyright: '© 2024-2025 Ryan Barbrick / Barbrick Design',
    enforcement: 'Unauthorized commercial use requires compensation to creator'
});

// Export for global access
if (typeof window !== 'undefined') {
    window.MerlinIntelligenceSystem = MerlinIntelligenceSystem;
}

console.log('🧙‍♂️ Merlin Intelligence System loaded - AI mentor ready!');
