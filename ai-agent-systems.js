/**
 * GemBot Leaderboard System
 * Real-time leaderboard with AI agents and real players
 * 
 * @author Ryan Barbrick / Barbrick Design
 */

class GemBotLeaderboard {
    constructor() {
        this.entries = [];
        this.updateInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('🏆 Leaderboard System initialized');
        
        // Load from localStorage
        this.load();
        
        // Auto-update every 30 seconds
        this.startAutoUpdate();
    }
    
    /**
     * Add entry to leaderboard
     */
    addEntry(entry) {
        // Remove old entry if exists
        this.entries = this.entries.filter(e => e.id !== entry.id);
        
        // Add new entry
        this.entries.push({
            ...entry,
            lastUpdated: Date.now()
        });
        
        // Sort by gems collected
        this.sortLeaderboard();
        
        // Save
        this.save();
    }
    
    /**
     * Update from AI agents
     */
    updateFromAIAgents() {
        if (window.AIAgentManager) {
            const aiLeaderboard = window.AIAgentManager.getLeaderboard();
            
            aiLeaderboard.forEach(entry => {
                this.addEntry(entry);
            });
        }
    }
    
    /**
     * Sort leaderboard
     */
    sortLeaderboard() {
        this.entries.sort((a, b) => {
            // Primary: gems collected
            if (b.gemsCollected !== a.gemsCollected) {
                return b.gemsCollected - a.gemsCollected;
            }
            
            // Secondary: level
            if (b.level !== a.level) {
                return b.level - a.level;
            }
            
            // Tertiary: achievements
            return b.achievements - a.achievements;
        });
        
        // Add ranks
        this.entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });
    }
    
    /**
     * Get top N entries
     */
    getTop(n = 100) {
        return this.entries.slice(0, n);
    }
    
    /**
     * Get player rank
     */
    getPlayerRank(playerId) {
        const entry = this.entries.find(e => e.id === playerId);
        return entry ? entry.rank : null;
    }
    
    /**
     * Generate HTML
     */
    generateHTML() {
        const top100 = this.getTop(100);
        
        let html = `
            <div class="leaderboard-container">
                <div class="leaderboard-header">
                    <h2>🏆 Leaderboard</h2>
                    <div class="leaderboard-stats">
                        <span>${this.entries.length} Total Players</span>
                        <span>${this.entries.filter(e => e.isAI).length} AI Agents</span>
                        <span>${this.entries.filter(e => !e.isAI).length} Real Players</span>
                    </div>
                </div>
                
                <div class="leaderboard-list">
                    ${top100.map(entry => this.generateEntryHTML(entry)).join('')}
                </div>
            </div>
        `;
        
        return html;
    }
    
    /**
     * Generate entry HTML
     */
    generateEntryHTML(entry) {
        const rankEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '';
        const aiBadge = entry.isAI ? '<span class="ai-badge">🤖 AI</span>' : '';
        const personalityBadge = entry.personality ? `<span class="personality-badge">${entry.personality}</span>` : '';
        
        return `
            <div class="leaderboard-entry ${entry.rank <= 3 ? 'top-three' : ''}">
                <div class="rank">${rankEmoji || `#${entry.rank}`}</div>
                <div class="avatar">${entry.avatar}</div>
                <div class="info">
                    <div class="name">
                        ${entry.name}
                        ${aiBadge}
                        ${personalityBadge}
                    </div>
                    <div class="stats">
                        <span>💎 ${entry.gemsCollected.toLocaleString()}</span>
                        <span>⚡ Lv.${entry.level}</span>
                        <span>🏭 ${entry.machinesDeployed}</span>
                        <span>🏆 ${entry.achievements}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Start auto-update
     */
    startAutoUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateFromAIAgents();
        }, 30000); // 30 seconds
    }
    
    /**
     * Save to localStorage
     */
    save() {
        try {
            localStorage.setItem('gembot_leaderboard', JSON.stringify(this.entries));
        } catch (error) {
            console.warn('Failed to save leaderboard:', error);
        }
    }
    
    /**
     * Load from localStorage
     */
    load() {
        try {
            const saved = localStorage.getItem('gembot_leaderboard');
            if (saved) {
                this.entries = JSON.parse(saved);
                this.sortLeaderboard();
                console.log(`✅ Loaded ${this.entries.length} leaderboard entries`);
            }
        } catch (error) {
            console.warn('Failed to load leaderboard:', error);
        }
    }
    
    /**
     * Open leaderboard UI
     */
    open() {
        let modal = document.getElementById('leaderboard-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'leaderboard-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content leaderboard-modal-content">
                    <button class="modal-close" onclick="window.GemBotLeaderboard.close()">×</button>
                    ${this.generateHTML()}
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            // Update content
            modal.querySelector('.modal-content').innerHTML = `
                <button class="modal-close" onclick="window.GemBotLeaderboard.close()">×</button>
                ${this.generateHTML()}
            `;
        }
        
        modal.style.display = 'flex';
    }
    
    /**
     * Close leaderboard UI
     */
    close() {
        const modal = document.getElementById('leaderboard-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

/**
 * Social Media Automation System
 * Auto-posts achievements, milestones, and updates to social platforms
 */
class SocialMediaAutomation {
    constructor() {
        this.platforms = {
            twitter: { enabled: false, apiKey: null },
            discord: { enabled: false, webhookUrl: null },
            telegram: { enabled: false, botToken: null }
        };
        
        this.queue = [];
        this.postHistory = [];
        
        this.init();
    }
    
    init() {
        console.log('📱 Social Media Automation initialized');
    }
    
    /**
     * Post AI agent achievement
     */
    post(data) {
        const post = {
            timestamp: Date.now(),
            type: 'achievement',
            player: data.player,
            achievement: data.achievement,
            referralLink: data.referralLink,
            platforms: ['twitter', 'discord']
        };
        
        this.queue.push(post);
        this.processQueue();
        
        // Log for analytics
        console.log(`📤 Social post queued: ${data.player} - ${data.achievement.title}`);
    }
    
    /**
     * Post daily update
     */
    postDailyUpdate(data) {
        const message = `
🤖 GemBot Daily Update!

📊 Today's Stats:
${data.stats.totalActions.toLocaleString()} actions
${data.stats.uniqueAgents} active players
${data.stats.successRate} success rate

🔧 ${data.fixes} fixes applied
✨ ${data.improvements} improvements made

Play now: https://gembot.game
        `.trim();
        
        const post = {
            timestamp: Date.now(),
            type: 'daily_update',
            message,
            platforms: ['twitter', 'discord', 'telegram']
        };
        
        this.queue.push(post);
        this.processQueue();
    }
    
    /**
     * Post milestone
     */
    postMilestone(milestone) {
        const message = `
🎉 GemBot Milestone Reached!

${milestone.title}
${milestone.description}

Join the community: https://gembot.game
        `.trim();
        
        const post = {
            timestamp: Date.now(),
            type: 'milestone',
            message,
            platforms: ['twitter', 'discord']
        };
        
        this.queue.push(post);
        this.processQueue();
    }
    
    /**
     * Process post queue
     */
    processQueue() {
        // Simulate posting (in production, would use actual APIs)
        while (this.queue.length > 0) {
            const post = this.queue.shift();
            
            // Log to console (replace with actual API calls)
            console.log(`📱 Posted to social media:`, post);
            
            this.postHistory.push(post);
            
            // Save history
            this.saveHistory();
        }
    }
    
    /**
     * Configure platform
     */
    configurePlatform(platform, config) {
        if (this.platforms[platform]) {
            this.platforms[platform] = { ...this.platforms[platform], ...config };
            console.log(`✅ ${platform} configured`);
        }
    }
    
    /**
     * Save history
     */
    saveHistory() {
        try {
            // Keep last 1000 posts
            const history = this.postHistory.slice(-1000);
            localStorage.setItem('social_post_history', JSON.stringify(history));
        } catch (error) {
            console.warn('Failed to save post history:', error);
        }
    }
}

/**
 * Merlin AI Learning System
 * Learns from player data to provide better guidance
 */
class MerlinAILearning {
    constructor() {
        this.knowledgeBase = {
            commonActions: {},
            successfulStrategies: [],
            commonErrors: [],
            playerPatterns: {},
            improvements: []
        };
        
        this.init();
    }
    
    init() {
        console.log('🧙 Merlin AI Learning System initialized');
        this.loadKnowledge();
    }
    
    /**
     * Learn from analysis data
     */
    learn(data) {
        console.log('🧠 Merlin AI learning from player data...');
        
        // Update common actions
        if (data.topActions) {
            data.topActions.forEach(action => {
                this.knowledgeBase.commonActions[action.action] = action.count;
            });
        }
        
        // Store common errors
        if (data.commonErrors) {
            data.commonErrors.forEach(error => {
                if (!this.knowledgeBase.commonErrors.find(e => e.message === error.message)) {
                    this.knowledgeBase.commonErrors.push(error);
                }
            });
        }
        
        // Store improvements
        if (data.improvements) {
            this.knowledgeBase.improvements.push(...data.improvements);
        }
        
        // Detect successful strategies
        this.detectStrategies(data.metrics);
        
        // Save knowledge
        this.saveKnowledge();
        
        console.log('✅ Merlin AI knowledge updated');
    }
    
    /**
     * Detect successful strategies from metrics
     */
    detectStrategies(metrics) {
        // Example: If players with high gems collected deploy machines early
        if (metrics.totalActions > 100) {
            this.knowledgeBase.successfulStrategies.push({
                strategy: 'deploy_early',
                description: 'Players who deploy machines early tend to collect more gems',
                confidence: 0.8,
                timestamp: Date.now()
            });
        }
    }
    
    /**
     * Get personalized advice for player
     */
    getAdvice(playerState) {
        const advice = [];
        
        // Check balance
        if (playerState.gems >= 500 && playerState.machines === 0) {
            advice.push('You have enough gems to deploy your first machine! This will start your passive income.');
        }
        
        // Check common actions
        const topAction = Object.keys(this.knowledgeBase.commonActions)[0];
        if (topAction) {
            advice.push(`Most players are currently: ${topAction}`);
        }
        
        // Check strategies
        if (this.knowledgeBase.successfulStrategies.length > 0) {
            const strategy = this.knowledgeBase.successfulStrategies[0];
            advice.push(`Pro tip: ${strategy.description}`);
        }
        
        return advice;
    }
    
    /**
     * Save knowledge base
     */
    saveKnowledge() {
        try {
            localStorage.setItem('merlin_knowledge', JSON.stringify(this.knowledgeBase));
        } catch (error) {
            console.warn('Failed to save knowledge:', error);
        }
    }
    
    /**
     * Load knowledge base
     */
    loadKnowledge() {
        try {
            const saved = localStorage.getItem('merlin_knowledge');
            if (saved) {
                this.knowledgeBase = JSON.parse(saved);
                console.log('✅ Merlin AI knowledge loaded');
            }
        } catch (error) {
            console.warn('Failed to load knowledge:', error);
        }
    }
}

// Initialize global systems
window.GemBotLeaderboard = new GemBotLeaderboard();
window.SocialMediaAutomation = new SocialMediaAutomation();
window.MerlinAILearning = new MerlinAILearning();

// Convenience functions
window.openLeaderboard = () => window.GemBotLeaderboard.open();
window.updateLeaderboard = () => window.GemBotLeaderboard.updateFromAIAgents();

console.log('✅ Leaderboard, Social Media, and Merlin AI systems loaded');
console.log('📝 Commands:');
console.log('   openLeaderboard()   - View leaderboard');
console.log('   updateLeaderboard() - Refresh from AI agents');
