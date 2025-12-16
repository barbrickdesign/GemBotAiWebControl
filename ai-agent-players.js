/**
 * GemBot AI Agent Players
 * Autonomous AI agents that simulate real players for testing, engagement, and marketing
 * 
 * Features:
 * - Multiple personality types (Casual, Hardcore, Strategic, Social)
 * - Realistic gameplay patterns
 * - Error detection and reporting
 * - Leaderboard integration
 * - Social media sharing
 * - Continuous learning
 * 
 * @author Ryan Barbrick / Barbrick Design
 * @email BarbrickDesign@gmail.com
 */

class AIAgentPlayer {
    constructor(config = {}) {
        this.id = config.id || `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.name = config.name || this.generateName();
        this.personality = config.personality || this.selectRandomPersonality();
        this.avatar = config.avatar || this.generateAvatar();
        
        // Player stats
        this.stats = {
            gemsCollected: 0,
            machinesDeployed: 0,
            upgradesPurchased: 0,
            playTime: 0,
            level: 1,
            experience: 0,
            achievements: [],
            errors: [],
            actions: [],
            startTime: Date.now(),
            lastAction: Date.now()
        };
        
        // GBUV balance (separate from global GBUV)
        this.balance = {
            gems: 100,
            tokens: 10,
            machines: 0,
            realWorldAssets: 0
        };
        
        // Personality traits affect behavior
        this.traits = this.getPersonalityTraits();
        
        // Current state
        this.state = 'idle';
        this.goals = [];
        
        // Logging
        this.activityLog = [];
        
        this.init();
    }
    
    init() {
        console.log(`🤖 AI Agent initialized: ${this.name} (${this.personality})`);
        this.logAction('initialized', { personality: this.personality });
        
        // Set initial goals based on personality
        this.setInitialGoals();
    }
    
    /**
     * Generate random player name
     */
    generateName() {
        const prefixes = ['Gem', 'Crystal', 'Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Jade', 'Opal', 'Pearl'];
        const suffixes = ['Master', 'Hunter', 'Miner', 'Cutter', 'Collector', 'Seeker', 'Wizard', 'Baron', 'King'];
        const numbers = Math.floor(Math.random() * 999);
        
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}${numbers}`;
    }
    
    /**
     * Select random personality type
     */
    selectRandomPersonality() {
        const types = ['casual', 'hardcore', 'strategic', 'social'];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    /**
     * Generate avatar emoji/icon
     */
    generateAvatar() {
        const avatars = ['🤖', '👾', '🎮', '💎', '⚡', '🔥', '⭐', '🌟', '💫', '✨', '🎯', '🏆'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }
    
    /**
     * Get personality traits
     */
    getPersonalityTraits() {
        const traits = {
            casual: {
                actionFrequency: 0.3,      // Low activity
                riskTolerance: 0.5,        // Moderate risk
                grindWillingness: 0.2,     // Doesn't grind much
                socialEngagement: 0.4,     // Some social
                explorationRate: 0.6,      // Likes exploring
                upgradeThreshold: 0.7      // Waits to upgrade
            },
            hardcore: {
                actionFrequency: 0.9,      // Very active
                riskTolerance: 0.8,        // High risk
                grindWillingness: 1.0,     // Grinds constantly
                socialEngagement: 0.3,     // Less social
                explorationRate: 0.4,      // Focused gameplay
                upgradeThreshold: 0.3      // Upgrades quickly
            },
            strategic: {
                actionFrequency: 0.6,      // Moderate activity
                riskTolerance: 0.3,        // Low risk
                grindWillingness: 0.7,     // Grinds strategically
                socialEngagement: 0.5,     // Moderate social
                explorationRate: 0.8,      // Explores thoroughly
                upgradeThreshold: 0.5      // Strategic upgrades
            },
            social: {
                actionFrequency: 0.5,      // Moderate activity
                riskTolerance: 0.6,        // Moderate risk
                grindWillingness: 0.4,     // Grinds for social goals
                socialEngagement: 1.0,     // Very social
                explorationRate: 0.7,      // Explores for content
                upgradeThreshold: 0.6      // Upgrades for show
            }
        };
        
        return traits[this.personality];
    }
    
    /**
     * Set initial goals based on personality
     */
    setInitialGoals() {
        this.goals = [];
        
        if (this.personality === 'casual') {
            this.goals.push('Deploy first machine');
            this.goals.push('Collect 1000 gems');
        } else if (this.personality === 'hardcore') {
            this.goals.push('Deploy 10 machines');
            this.goals.push('Reach level 20');
            this.goals.push('Top leaderboard');
        } else if (this.personality === 'strategic') {
            this.goals.push('Calculate optimal upgrade path');
            this.goals.push('Maximize gems per second');
            this.goals.push('Unlock all machines');
        } else if (this.personality === 'social') {
            this.goals.push('Share achievement');
            this.goals.push('Help other players');
            this.goals.push('Post on social media');
        }
    }
    
    /**
     * Log an action
     */
    logAction(action, data = {}) {
        const entry = {
            timestamp: Date.now(),
            action,
            data,
            balance: { ...this.balance },
            state: this.state
        };
        
        this.activityLog.push(entry);
        this.stats.actions.push(entry);
        this.stats.lastAction = Date.now();
        
        // Send to central logging system
        if (window.AIAgentLogger) {
            window.AIAgentLogger.log(this.id, entry);
        }
    }
    
    /**
     * Start autonomous gameplay
     */
    async startPlaying() {
        console.log(`🎮 ${this.name} started playing!`);
        this.state = 'playing';
        this.logAction('start_playing');
        
        // Main gameplay loop
        while (this.state === 'playing') {
            await this.performAction();
            
            // Wait based on personality
            const waitTime = this.calculateWaitTime();
            await this.sleep(waitTime);
        }
    }
    
    /**
     * Perform a single action based on personality and current state
     */
    async performAction() {
        try {
            // Decide what to do
            const action = this.decideNextAction();
            
            console.log(`🤖 ${this.name}: ${action.type}`);
            
            switch (action.type) {
                case 'deploy_machine':
                    await this.deployMachine();
                    break;
                    
                case 'collect_gems':
                    await this.collectGems();
                    break;
                    
                case 'upgrade_machine':
                    await this.upgradeMachine();
                    break;
                    
                case 'unlock_model':
                    await this.unlockModel();
                    break;
                    
                case 'chat_with_merlin':
                    await this.chatWithMerlin();
                    break;
                    
                case 'share_achievement':
                    await this.shareAchievement();
                    break;
                    
                case 'explore':
                    await this.explore();
                    break;
                    
                case 'idle':
                    await this.idle();
                    break;
            }
            
            // Update stats
            this.updateStats();
            
        } catch (error) {
            console.error(`❌ ${this.name} encountered error:`, error);
            this.logError(error);
        }
    }
    
    /**
     * Decide next action based on personality and state
     */
    decideNextAction() {
        const random = Math.random();
        
        // Check if can afford machine deployment
        if (this.balance.gems >= 500 && random < this.traits.actionFrequency) {
            return { type: 'deploy_machine' };
        }
        
        // Collect gems if production available
        if (this.balance.machines > 0 && random < 0.7) {
            return { type: 'collect_gems' };
        }
        
        // Upgrade if threshold met
        if (this.balance.gems >= 1000 && random < this.traits.upgradeThreshold) {
            return { type: 'upgrade_machine' };
        }
        
        // Unlock new model
        if (this.balance.gems >= 5000 && random < 0.3) {
            return { type: 'unlock_model' };
        }
        
        // Chat with Merlin
        if (random < 0.2) {
            return { type: 'chat_with_merlin' };
        }
        
        // Share achievement (social personality)
        if (this.personality === 'social' && random < this.traits.socialEngagement) {
            return { type: 'share_achievement' };
        }
        
        // Explore
        if (random < this.traits.explorationRate * 0.3) {
            return { type: 'explore' };
        }
        
        // Default: idle
        return { type: 'idle' };
    }
    
    /**
     * Deploy a virtual machine
     */
    async deployMachine() {
        if (this.balance.gems < 500) {
            this.logAction('deploy_failed', { reason: 'insufficient_gems' });
            return;
        }
        
        this.balance.gems -= 500;
        this.balance.machines += 1;
        this.stats.machinesDeployed += 1;
        
        this.logAction('deploy_machine', {
            cost: 500,
            totalMachines: this.balance.machines
        });
        
        // Check for achievement
        if (this.balance.machines === 1) {
            this.unlockAchievement('first_machine', 'Deployed First Machine! 🤖');
        } else if (this.balance.machines === 10) {
            this.unlockAchievement('machine_tycoon', 'Machine Tycoon! 🏭');
        }
    }
    
    /**
     * Collect gems from machines
     */
    async collectGems() {
        if (this.balance.machines === 0) return;
        
        // Calculate production (10 gems per machine)
        const production = this.balance.machines * 10;
        this.balance.gems += production;
        this.stats.gemsCollected += production;
        
        this.logAction('collect_gems', {
            amount: production,
            totalGems: this.balance.gems
        });
    }
    
    /**
     * Upgrade a machine
     */
    async upgradeMachine() {
        if (this.balance.gems < 1000) {
            this.logAction('upgrade_failed', { reason: 'insufficient_gems' });
            return;
        }
        
        this.balance.gems -= 1000;
        this.stats.upgradesPurchased += 1;
        
        this.logAction('upgrade_machine', {
            cost: 1000,
            totalUpgrades: this.stats.upgradesPurchased
        });
        
        // Achievement
        if (this.stats.upgradesPurchased === 5) {
            this.unlockAchievement('upgrader', 'Upgrade Master! ⚡');
        }
    }
    
    /**
     * Unlock a new 3D model
     */
    async unlockModel() {
        if (this.balance.gems < 5000) return;
        
        const models = ['gembot2', 'gembot3', 'gembot4'];
        const model = models[Math.floor(Math.random() * models.length)];
        
        this.balance.gems -= 5000;
        
        this.logAction('unlock_model', {
            model,
            cost: 5000
        });
        
        this.unlockAchievement('collector', 'Model Collector! 💎');
    }
    
    /**
     * Chat with Merlin AI
     */
    async chatWithMerlin() {
        const questions = [
            'How do I deploy a machine?',
            'What\'s the best strategy?',
            'How can I earn more gems?',
            'Tell me about upgrades',
            'What are achievements?'
        ];
        
        const question = questions[Math.floor(Math.random() * questions.length)];
        
        this.logAction('chat_merlin', { question });
    }
    
    /**
     * Share achievement on social media
     */
    async shareAchievement() {
        const achievement = this.stats.achievements[this.stats.achievements.length - 1];
        
        if (!achievement) return;
        
        this.logAction('share_social', {
            achievement,
            platform: 'twitter'
        });
        
        // Trigger social media post
        if (window.SocialMediaAutomation) {
            window.SocialMediaAutomation.post({
                player: this.name,
                achievement,
                referralLink: `https://gembot.game/ref/${this.id}`
            });
        }
    }
    
    /**
     * Explore the game
     */
    async explore() {
        const actions = ['check_leaderboard', 'view_inventory', 'read_news', 'explore_3d'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        this.logAction('explore', { action });
    }
    
    /**
     * Idle waiting
     */
    async idle() {
        this.logAction('idle', { duration: 5000 });
    }
    
    /**
     * Unlock achievement
     */
    unlockAchievement(id, title) {
        const achievement = {
            id,
            title,
            timestamp: Date.now()
        };
        
        this.stats.achievements.push(achievement);
        
        this.logAction('achievement_unlocked', achievement);
        
        console.log(`🏆 ${this.name} unlocked: ${title}`);
        
        // Share if social personality
        if (this.personality === 'social' && Math.random() < 0.8) {
            setTimeout(() => this.shareAchievement(), 2000);
        }
    }
    
    /**
     * Log an error
     */
    logError(error) {
        const errorLog = {
            timestamp: Date.now(),
            message: error.message,
            stack: error.stack
        };
        
        this.stats.errors.push(errorLog);
        this.logAction('error', errorLog);
    }
    
    /**
     * Update stats
     */
    updateStats() {
        this.stats.playTime = Date.now() - this.stats.startTime;
        
        // Calculate level based on experience
        this.stats.experience = this.stats.gemsCollected + (this.stats.machinesDeployed * 100);
        this.stats.level = Math.floor(this.stats.experience / 1000) + 1;
    }
    
    /**
     * Calculate wait time based on personality
     */
    calculateWaitTime() {
        const baseWait = 5000; // 5 seconds
        const personalityMultiplier = 1 - this.traits.actionFrequency;
        const randomVariation = Math.random() * 0.5 + 0.75; // 0.75-1.25x
        
        return baseWait * personalityMultiplier * randomVariation;
    }
    
    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Stop playing
     */
    stopPlaying() {
        this.state = 'stopped';
        this.logAction('stop_playing');
        console.log(`🛑 ${this.name} stopped playing`);
    }
    
    /**
     * Get player summary for leaderboard
     */
    getLeaderboardEntry() {
        return {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            personality: this.personality,
            isAI: true,
            level: this.stats.level,
            gemsCollected: this.stats.gemsCollected,
            machinesDeployed: this.stats.machinesDeployed,
            achievements: this.stats.achievements.length,
            playTime: this.stats.playTime
        };
    }
    
    /**
     * Export full data
     */
    exportData() {
        return {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            personality: this.personality,
            traits: this.traits,
            stats: this.stats,
            balance: this.balance,
            goals: this.goals,
            activityLog: this.activityLog
        };
    }
}

/**
 * AI Agent Manager
 * Manages multiple AI agents, coordinates gameplay, and handles logging
 */
class AIAgentManager {
    constructor() {
        this.agents = [];
        this.maxAgents = 20;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        console.log('🤖 AI Agent Manager initialized');
    }
    
    /**
     * Spawn multiple AI agents
     */
    spawnAgents(count = 10) {
        const personalities = ['casual', 'hardcore', 'strategic', 'social'];
        
        for (let i = 0; i < count; i++) {
            const personality = personalities[i % personalities.length];
            const agent = new AIAgentPlayer({ personality });
            
            this.agents.push(agent);
            
            // Stagger start times
            setTimeout(() => {
                agent.startPlaying();
            }, i * 2000);
        }
        
        console.log(`✅ Spawned ${count} AI agents`);
    }
    
    /**
     * Get leaderboard data
     */
    getLeaderboard() {
        return this.agents
            .map(agent => agent.getLeaderboardEntry())
            .sort((a, b) => b.gemsCollected - a.gemsCollected)
            .slice(0, 100);
    }
    
    /**
     * Get all agent data
     */
    getAllData() {
        return this.agents.map(agent => agent.exportData());
    }
    
    /**
     * Stop all agents
     */
    stopAllAgents() {
        this.agents.forEach(agent => agent.stopPlaying());
        console.log('🛑 All agents stopped');
    }
    
    /**
     * Remove inactive agents
     */
    cleanupInactiveAgents() {
        const now = Date.now();
        const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
        
        this.agents = this.agents.filter(agent => {
            if (now - agent.stats.lastAction > inactiveThreshold) {
                agent.stopPlaying();
                return false;
            }
            return true;
        });
    }
    
    /**
     * Get statistics
     */
    getStatistics() {
        const totalActions = this.agents.reduce((sum, a) => sum + a.stats.actions.length, 0);
        const totalGems = this.agents.reduce((sum, a) => sum + a.stats.gemsCollected, 0);
        const totalMachines = this.agents.reduce((sum, a) => sum + a.stats.machinesDeployed, 0);
        const totalErrors = this.agents.reduce((sum, a) => sum + a.stats.errors.length, 0);
        
        return {
            totalAgents: this.agents.length,
            activeAgents: this.agents.filter(a => a.state === 'playing').length,
            totalActions,
            totalGems,
            totalMachines,
            totalErrors,
            avgLevel: this.agents.reduce((sum, a) => sum + a.stats.level, 0) / this.agents.length
        };
    }
}

// Initialize global manager
window.AIAgentManager = new AIAgentManager();

// Convenience functions
window.spawnAIAgents = (count) => window.AIAgentManager.spawnAgents(count);
window.getAILeaderboard = () => window.AIAgentManager.getLeaderboard();
window.getAIStats = () => window.AIAgentManager.getStatistics();
window.stopAIAgents = () => window.AIAgentManager.stopAllAgents();

console.log('✅ AI Agent Players loaded');
console.log('📝 Commands:');
console.log('   spawnAIAgents(10)   - Spawn 10 AI players');
console.log('   getAILeaderboard()  - View leaderboard');
console.log('   getAIStats()        - View statistics');
console.log('   stopAIAgents()      - Stop all AI players');
