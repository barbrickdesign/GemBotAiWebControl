/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GEMBOT GBUV DISTRIBUTION & AI AGENT TRADING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * OWNERSHIP: Ryan Barbrick / Barbrick Design
 * CONTACT: BarbrickDesign@gmail.com
 * COPYRIGHT: © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * 
 * This system handles:
 * - GBUV token distribution to agents and players
 * - AI agent trading on pump.fun
 * - Creator rewards distribution
 * - Trading performance analytics
 * ═══════════════════════════════════════════════════════════════════════════
 */

class GBUVDistributionSystem {
    constructor(solanaWallet) {
        this.wallet = solanaWallet;
        this.distributionHistory = [];
        this.loadDistributionHistory();
        
        console.log(`💎 GBUV Distribution System initialized`);
    }
    
    loadDistributionHistory() {
        const saved = localStorage.getItem('gembot_distributions');
        this.distributionHistory = saved ? JSON.parse(saved) : [];
    }
    
    saveDistributionHistory() {
        localStorage.setItem('gembot_distributions', JSON.stringify(this.distributionHistory));
    }
    
    /**
     * Distribute GBUV to AI agents
     * @param {string} fromWallet - Admin wallet public key
     * @param {number} amountPerAgent - GBUV amount per agent
     */
    async distributeToAgents(fromWallet, amountPerAgent = 1000) {
        console.log(`🤖 Distributing GBUV to AI agents...`);
        
        // Get all agent wallets
        const wallets = this.wallet.listWallets();
        const agentWallets = wallets.filter(w => w.label.startsWith('agent-'));
        
        if (agentWallets.length === 0) {
            console.log(`⚠️ No agent wallets found. Create them first with generateAgentWallets()`);
            return null;
        }
        
        const recipients = agentWallets.map(w => w.publicKey);
        const totalAmount = amountPerAgent * recipients.length;
        
        console.log(`📊 Distribution Plan:`);
        console.log(`   - Agents: ${recipients.length}`);
        console.log(`   - Per Agent: ${amountPerAgent} GBUV`);
        console.log(`   - Total: ${totalAmount} GBUV`);
        
        // Distribute
        const results = await this.wallet.distributeGBUV(fromWallet, recipients, amountPerAgent);
        
        // Log distribution
        const distribution = {
            id: `dist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            from: fromWallet,
            recipients: recipients.length,
            amountPerRecipient: amountPerAgent,
            totalAmount: totalAmount,
            successful: results.filter(r => r.status === 'success').length,
            results: results
        };
        
        this.distributionHistory.push(distribution);
        this.saveDistributionHistory();
        
        console.log(`✅ Distribution complete: ${distribution.successful}/${recipients.length} successful`);
        
        return distribution;
    }
    
    /**
     * Distribute GBUV to new players
     * @param {string} fromWallet - Admin wallet public key
     * @param {Array} playerWallets - Array of player wallet addresses
     * @param {number} welcomeBonus - GBUV amount for new players
     */
    async distributeToPlayers(fromWallet, playerWallets, welcomeBonus = 500) {
        console.log(`👥 Distributing welcome bonus to ${playerWallets.length} players...`);
        
        const totalAmount = welcomeBonus * playerWallets.length;
        
        console.log(`📊 Distribution Plan:`);
        console.log(`   - Players: ${playerWallets.length}`);
        console.log(`   - Per Player: ${welcomeBonus} GBUV`);
        console.log(`   - Total: ${totalAmount} GBUV`);
        
        // Distribute
        const results = await this.wallet.distributeGBUV(fromWallet, playerWallets, welcomeBonus);
        
        // Log distribution
        const distribution = {
            id: `dist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'player_welcome',
            from: fromWallet,
            recipients: playerWallets.length,
            amountPerRecipient: welcomeBonus,
            totalAmount: totalAmount,
            successful: results.filter(r => r.status === 'success').length,
            results: results
        };
        
        this.distributionHistory.push(distribution);
        this.saveDistributionHistory();
        
        return distribution;
    }
    
    /**
     * Get distribution history
     */
    getDistributionHistory(limit = 50) {
        return this.distributionHistory.slice(-limit).reverse();
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// AI AGENT TRADING SYSTEM (pump.fun Integration)
// ═════════════════════════════════════════════════════════════════════════════

class AIAgentTradingSystem {
    constructor(solanaWallet) {
        this.wallet = solanaWallet;
        this.tradingAgents = new Map();
        this.tradingHistory = [];
        this.loadTradingHistory();
        
        // Trading strategies
        this.strategies = {
            conservative: {
                tradeFrequency: 0.3,      // Trade 30% of the time
                maxTradeSize: 0.1,        // Max 10% of balance per trade
                targetProfit: 0.05,        // 5% profit target
                stopLoss: 0.03             // 3% stop loss
            },
            moderate: {
                tradeFrequency: 0.6,
                maxTradeSize: 0.2,
                targetProfit: 0.10,
                stopLoss: 0.05
            },
            aggressive: {
                tradeFrequency: 0.9,
                maxTradeSize: 0.3,
                targetProfit: 0.20,
                stopLoss: 0.10
            }
        };
        
        console.log(`📈 AI Agent Trading System initialized`);
    }
    
    loadTradingHistory() {
        const saved = localStorage.getItem('gembot_trades');
        this.tradingHistory = saved ? JSON.parse(saved) : [];
    }
    
    saveTradingHistory() {
        localStorage.setItem('gembot_trades', JSON.stringify(this.tradingHistory));
    }
    
    /**
     * Register AI agent for trading
     */
    registerAgent(agentId, walletPublicKey, strategy = 'moderate') {
        const agent = {
            id: agentId,
            wallet: walletPublicKey,
            strategy: this.strategies[strategy],
            strategyName: strategy,
            isActive: false,
            totalTrades: 0,
            successfulTrades: 0,
            totalProfit: 0,
            created: new Date().toISOString()
        };
        
        this.tradingAgents.set(agentId, agent);
        console.log(`✅ Registered trading agent: ${agentId} (${strategy})`);
        
        return agent;
    }
    
    /**
     * Start trading for an agent
     */
    startTrading(agentId) {
        const agent = this.tradingAgents.get(agentId);
        if (!agent) {
            console.error(`❌ Agent not found: ${agentId}`);
            return false;
        }
        
        agent.isActive = true;
        this.runTradingLoop(agentId);
        
        console.log(`📈 Trading started for agent: ${agentId}`);
        return true;
    }
    
    /**
     * Stop trading for an agent
     */
    stopTrading(agentId) {
        const agent = this.tradingAgents.get(agentId);
        if (!agent) return false;
        
        agent.isActive = false;
        console.log(`🛑 Trading stopped for agent: ${agentId}`);
        return true;
    }
    
    /**
     * Trading loop for an agent
     */
    async runTradingLoop(agentId) {
        const agent = this.tradingAgents.get(agentId);
        if (!agent || !agent.isActive) return;
        
        // Wait based on strategy frequency
        const waitTime = (1 - agent.strategy.tradeFrequency) * 60000; // 0-60 seconds
        
        setTimeout(async () => {
            // Execute trade
            await this.executeTrade(agentId);
            
            // Continue loop if still active
            if (agent.isActive) {
                this.runTradingLoop(agentId);
            }
        }, waitTime);
    }
    
    /**
     * Execute a trade for an agent
     */
    async executeTrade(agentId) {
        const agent = this.tradingAgents.get(agentId);
        if (!agent) return;
        
        try {
            // Get current GBUV balance
            const balance = await this.wallet.getGBUVBalance(agent.wallet);
            
            if (balance === 0) {
                console.log(`⚠️ Agent ${agentId} has no GBUV to trade`);
                return;
            }
            
            // Calculate trade amount
            const tradeAmount = balance * agent.strategy.maxTradeSize;
            
            // Simulate trade decision (buy or sell)
            const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
            
            // Simulate price movement
            const priceChange = (Math.random() - 0.5) * 0.2; // -10% to +10%
            const profit = tradeAmount * priceChange;
            
            // Create trade record
            const trade = {
                id: `trade-${Date.now()}-${agentId}`,
                agentId: agentId,
                wallet: agent.wallet,
                action: action,
                amount: tradeAmount,
                price: 1.0, // Simulated price
                priceChange: priceChange,
                profit: profit,
                timestamp: new Date().toISOString(),
                platform: 'pump.fun',
                status: 'simulated' // Real trades would be 'executed'
            };
            
            // Update agent stats
            agent.totalTrades++;
            if (profit > 0) {
                agent.successfulTrades++;
            }
            agent.totalProfit += profit;
            
            // Log trade
            this.tradingHistory.push(trade);
            this.saveTradingHistory();
            
            console.log(`📊 Trade executed for ${agentId}:`);
            console.log(`   Action: ${action}`);
            console.log(`   Amount: ${tradeAmount.toFixed(2)} GBUV`);
            console.log(`   Profit: ${profit >= 0 ? '+' : ''}${profit.toFixed(2)} GBUV`);
            
            return trade;
        } catch (error) {
            console.error(`❌ Trade error for ${agentId}:`, error);
            return null;
        }
    }
    
    /**
     * Get trading statistics for an agent
     */
    getAgentStats(agentId) {
        const agent = this.tradingAgents.get(agentId);
        if (!agent) return null;
        
        const successRate = agent.totalTrades > 0 
            ? (agent.successfulTrades / agent.totalTrades) * 100 
            : 0;
        
        return {
            ...agent,
            successRate: successRate.toFixed(2) + '%',
            avgProfit: agent.totalTrades > 0 
                ? (agent.totalProfit / agent.totalTrades).toFixed(2) 
                : '0.00'
        };
    }
    
    /**
     * Get all trading statistics
     */
    getAllStats() {
        const stats = [];
        for (const [agentId, agent] of this.tradingAgents) {
            stats.push(this.getAgentStats(agentId));
        }
        return stats;
    }
    
    /**
     * Get trading history
     */
    getTradingHistory(agentId = null, limit = 100) {
        let trades = this.tradingHistory;
        
        if (agentId) {
            trades = trades.filter(t => t.agentId === agentId);
        }
        
        return trades.slice(-limit).reverse();
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// CREATOR REWARDS SYSTEM
// ═════════════════════════════════════════════════════════════════════════════

class CreatorRewardsSystem {
    constructor(solanaWallet) {
        this.wallet = solanaWallet;
        this.rewards = [];
        this.loadRewards();
        
        // Reward rates
        this.rates = {
            gameplay: 10,           // 10 GBUV per hour of gameplay
            trading: 5,             // 5 GBUV per successful trade
            referral: 1000,         // 1000 GBUV per referral (existing)
            content: 100,           // 100 GBUV per content creation
            achievement: 50         // 50 GBUV per achievement
        };
        
        console.log(`🎁 Creator Rewards System initialized`);
    }
    
    loadRewards() {
        const saved = localStorage.getItem('gembot_rewards');
        this.rewards = saved ? JSON.parse(saved) : [];
    }
    
    saveRewards() {
        localStorage.setItem('gembot_rewards', JSON.stringify(this.rewards));
    }
    
    /**
     * Award gameplay rewards
     */
    async awardGameplayReward(playerWallet, hoursPlayed) {
        const amount = hoursPlayed * this.rates.gameplay;
        
        const reward = {
            id: `reward-${Date.now()}`,
            type: 'gameplay',
            recipient: playerWallet,
            amount: amount,
            details: { hoursPlayed },
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        this.rewards.push(reward);
        this.saveRewards();
        
        console.log(`🎮 Awarded ${amount} GBUV for ${hoursPlayed} hours of gameplay`);
        
        return reward;
    }
    
    /**
     * Award trading rewards
     */
    async awardTradingReward(playerWallet, successfulTrades) {
        const amount = successfulTrades * this.rates.trading;
        
        const reward = {
            id: `reward-${Date.now()}`,
            type: 'trading',
            recipient: playerWallet,
            amount: amount,
            details: { successfulTrades },
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        this.rewards.push(reward);
        this.saveRewards();
        
        console.log(`📈 Awarded ${amount} GBUV for ${successfulTrades} successful trades`);
        
        return reward;
    }
    
    /**
     * Award content creation rewards
     */
    async awardContentReward(playerWallet, contentType) {
        const amount = this.rates.content;
        
        const reward = {
            id: `reward-${Date.now()}`,
            type: 'content',
            recipient: playerWallet,
            amount: amount,
            details: { contentType },
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        this.rewards.push(reward);
        this.saveRewards();
        
        console.log(`🎨 Awarded ${amount} GBUV for ${contentType} content creation`);
        
        return reward;
    }
    
    /**
     * Process pending rewards (batch distribution)
     */
    async processPendingRewards(fromWallet) {
        const pending = this.rewards.filter(r => r.status === 'pending');
        
        if (pending.length === 0) {
            console.log(`✅ No pending rewards`);
            return [];
        }
        
        console.log(`💰 Processing ${pending.length} pending rewards...`);
        
        const results = [];
        
        for (const reward of pending) {
            try {
                // Send GBUV
                const signature = await this.wallet.sendGBUV(
                    fromWallet,
                    reward.recipient,
                    reward.amount
                );
                
                reward.status = 'distributed';
                reward.signature = signature;
                reward.distributedAt = new Date().toISOString();
                
                results.push({ ...reward, success: true });
                console.log(`✅ Distributed ${reward.amount} GBUV to ${reward.recipient}`);
            } catch (error) {
                reward.status = 'failed';
                reward.error = error.message;
                
                results.push({ ...reward, success: false });
                console.error(`❌ Failed to distribute to ${reward.recipient}:`, error.message);
            }
            
            // Delay between transactions
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        this.saveRewards();
        
        const successful = results.filter(r => r.success).length;
        console.log(`✅ Rewards processed: ${successful}/${pending.length} successful`);
        
        return results;
    }
    
    /**
     * Get reward history
     */
    getRewardHistory(playerWallet = null, limit = 100) {
        let rewards = this.rewards;
        
        if (playerWallet) {
            rewards = rewards.filter(r => r.recipient === playerWallet);
        }
        
        return rewards.slice(-limit).reverse();
    }
    
    /**
     * Get pending rewards total
     */
    getPendingTotal() {
        const pending = this.rewards.filter(r => r.status === 'pending');
        const total = pending.reduce((sum, r) => sum + r.amount, 0);
        
        return {
            count: pending.length,
            total: total,
            rewards: pending
        };
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// GLOBAL INSTANCES & CONVENIENCE FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

// Initialize systems (requires solanaWallet to be loaded first)
window.gbuvDistribution = new GBUVDistributionSystem(window.solanaWallet);
window.agentTrading = new AIAgentTradingSystem(window.solanaWallet);
window.creatorRewards = new CreatorRewardsSystem(window.solanaWallet);

// Convenience functions
window.distributeToAgents = (fromWallet, amount) => 
    window.gbuvDistribution.distributeToAgents(fromWallet, amount);

window.startAgentTrading = (agentId) => 
    window.agentTrading.startTrading(agentId);

window.stopAgentTrading = (agentId) => 
    window.agentTrading.stopTrading(agentId);

window.getTradingStats = () => 
    window.agentTrading.getAllStats();

window.processPendingRewards = (fromWallet) => 
    window.creatorRewards.processPendingRewards(fromWallet);

console.log(`
═══════════════════════════════════════════════════════════════════════════
💎 GBUV DISTRIBUTION & TRADING SYSTEM LOADED
═══════════════════════════════════════════════════════════════════════════

📚 Quick Commands:

DISTRIBUTION:
   distributeToAgents('ADMIN_WALLET', 1000)  - Give 1000 GBUV to each agent
   
AGENT TRADING:
   agentTrading.registerAgent('agent-1', 'WALLET_KEY', 'aggressive')
   startAgentTrading('agent-1')               - Start trading
   stopAgentTrading('agent-1')                - Stop trading
   getTradingStats()                          - View all agent stats
   
CREATOR REWARDS:
   creatorRewards.awardGameplayReward('WALLET', 2.5)  - 2.5 hours played
   creatorRewards.awardTradingReward('WALLET', 10)    - 10 successful trades
   processPendingRewards('ADMIN_WALLET')              - Distribute rewards

═══════════════════════════════════════════════════════════════════════════
`);
