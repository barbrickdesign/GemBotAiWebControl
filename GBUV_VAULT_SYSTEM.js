/**
 * GBUV - Gem Bot Universe Vault
 * Web3 Play-to-Learn/Play-to-Earn Integration
 * Links real-world gemstone cutting machines to in-game virtual assets
 */

class GemBotUniverseVault {
    constructor() {
        this.playerBalance = {
            gems: 0,           // In-game gemstones
            tokens: 0,          // GBUV tokens (web3)
            machines: [],       // Owned machines (real + virtual)
            realWorldAssets: [] // NFT/physical machine links
        };
        
        this.transactions = [];
        this.rewards = {
            daily: 0,
            weekly: 0,
            achievements: []
        };
        
        this.bonuses = {
            realWorldMultiplier: 1.0, // Bonus from owning real machines
            machineEfficiency: {},     // Per-machine efficiency bonuses
            specialEvents: []
        };
        
        this.init();
    }
    
    init() {
        console.log('[GBUV] Gem Bot Universe Vault initializing...');
        this.loadPlayerData();
        this.setupEventListeners();
        this.startRewardTracking();
    }
    
    /**
     * Load player balance and assets from localStorage/blockchain
     */
    loadPlayerData() {
        const saved = localStorage.getItem('gbuv_player_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.playerBalance = { ...this.playerBalance, ...data.balance };
                this.transactions = data.transactions || [];
                this.rewards = { ...this.rewards, ...data.rewards };
                this.bonuses = { ...this.bonuses, ...data.bonuses };
                console.log('[GBUV] Player data loaded:', this.playerBalance);
            } catch (e) {
                console.error('[GBUV] Failed to load player data:', e);
            }
        } else {
            // New player - set initial welcome bonus
            this.playerBalance.gems = 100;
            this.playerBalance.tokens = 10;
            this.savePlayerData();
            console.log('[GBUV] New player initialized with starter bonus');
        }
    }
    
    /**
     * Save player data to localStorage (and eventually blockchain)
     */
    savePlayerData() {
        const data = {
            balance: this.playerBalance,
            transactions: this.transactions.slice(-100), // Keep last 100
            rewards: this.rewards,
            bonuses: this.bonuses,
            lastSaved: Date.now()
        };
        localStorage.setItem('gbuv_player_data', JSON.stringify(data));
        this.broadcastBalanceUpdate();
    }
    
    /**
     * Get current player balance
     */
    getBalance() {
        return {
            gems: this.playerBalance.gems,
            tokens: this.playerBalance.tokens,
            machines: this.playerBalance.machines.length,
            realWorldBonus: this.bonuses.realWorldMultiplier
        };
    }
    
    /**
     * Add gems to player balance
     */
    addGems(amount, source = 'production') {
        const multiplier = this.bonuses.realWorldMultiplier;
        const bonusAmount = Math.floor(amount * multiplier);
        
        this.playerBalance.gems += bonusAmount;
        
        this.transactions.push({
            type: 'gem_earned',
            amount: bonusAmount,
            source,
            multiplier,
            timestamp: Date.now()
        });
        
        this.savePlayerData();
        console.log(`[GBUV] +${bonusAmount} gems (${multiplier}x bonus)`);
        
        return bonusAmount;
    }
    
    /**
     * Spend gems (returns true if successful)
     */
    spendGems(amount, purpose = 'purchase') {
        if (this.playerBalance.gems < amount) {
            console.warn(`[GBUV] Insufficient gems: ${this.playerBalance.gems}/${amount}`);
            return false;
        }
        
        this.playerBalance.gems -= amount;
        
        this.transactions.push({
            type: 'gem_spent',
            amount,
            purpose,
            timestamp: Date.now()
        });
        
        this.savePlayerData();
        console.log(`[GBUV] -${amount} gems for ${purpose}`);
        
        return true;
    }
    
    /**
     * Add GBUV tokens (web3 currency)
     */
    addTokens(amount, source = 'reward') {
        this.playerBalance.tokens += amount;
        
        this.transactions.push({
            type: 'token_earned',
            amount,
            source,
            timestamp: Date.now()
        });
        
        this.savePlayerData();
        console.log(`[GBUV] +${amount} GBUV tokens`);
        
        return amount;
    }
    
    /**
     * Link real-world machine to in-game account
     * Real machines provide permanent production bonuses
     */
    linkRealWorldMachine(machineId, machineType, verificationProof) {
        const machine = {
            id: machineId,
            type: machineType,
            linkedAt: Date.now(),
            verified: true,
            proof: verificationProof,
            bonusMultiplier: this.calculateMachineBonus(machineType)
        };
        
        this.playerBalance.realWorldAssets.push(machine);
        
        // Update real-world multiplier
        this.recalculateRealWorldBonus();
        
        // Give linking reward
        const linkReward = 1000; // gems
        const tokenReward = 50;   // tokens
        this.addGems(linkReward, 'machine_linked');
        this.addTokens(tokenReward, 'machine_linked');
        
        this.savePlayerData();
        console.log(`[GBUV] Real machine linked: ${machineId} (${machineType})`);
        
        return {
            success: true,
            machine,
            rewards: { gems: linkReward, tokens: tokenReward }
        };
    }
    
    /**
     * Calculate production bonus based on machine type
     */
    calculateMachineBonus(machineType) {
        const bonuses = {
            'faceting_machine': 1.5,   // 50% production bonus
            'polishing_machine': 1.3,   // 30% bonus
            'cutting_machine': 1.4,     // 40% bonus
            'automated_system': 2.0     // 100% bonus!
        };
        
        return bonuses[machineType] || 1.2; // Default 20%
    }
    
    /**
     * Recalculate total real-world bonus multiplier
     */
    recalculateRealWorldBonus() {
        let totalMultiplier = 1.0;
        
        this.playerBalance.realWorldAssets.forEach(asset => {
            if (asset.verified) {
                totalMultiplier += (asset.bonusMultiplier - 1.0);
            }
        });
        
        this.bonuses.realWorldMultiplier = totalMultiplier;
        console.log(`[GBUV] Real-world bonus updated: ${totalMultiplier.toFixed(2)}x`);
    }
    
    /**
     * Deploy virtual machine (idle game mechanic)
     */
    deployVirtualMachine(machineType, cost) {
        if (!this.spendGems(cost, `deploy_${machineType}`)) {
            return { success: false, error: 'Insufficient gems' };
        }
        
        const machine = {
            id: `vm_${Date.now()}`,
            type: machineType,
            level: 1,
            production: this.calculateMachineProduction(machineType, 1),
            deployedAt: Date.now(),
            lastProduction: Date.now()
        };
        
        this.playerBalance.machines.push(machine);
        this.savePlayerData();
        
        console.log(`[GBUV] Virtual machine deployed: ${machine.id}`);
        
        return { success: true, machine };
    }
    
    /**
     * Calculate production rate for virtual machines
     */
    calculateMachineProduction(machineType, level) {
        const baseRates = {
            'basic_cutter': 1,
            'advanced_cutter': 3,
            'master_cutter': 10,
            'quantum_cutter': 50
        };
        
        const baseRate = baseRates[machineType] || 1;
        return baseRate * level * this.bonuses.realWorldMultiplier;
    }
    
    /**
     * Collect idle production from all machines
     */
    collectProduction() {
        const now = Date.now();
        let totalGems = 0;
        
        this.playerBalance.machines.forEach(machine => {
            const elapsedSeconds = (now - machine.lastProduction) / 1000;
            const gemsPerSecond = machine.production / 3600; // Per hour to per second
            const produced = Math.floor(elapsedSeconds * gemsPerSecond);
            
            if (produced > 0) {
                totalGems += produced;
                machine.lastProduction = now;
            }
        });
        
        if (totalGems > 0) {
            this.addGems(totalGems, 'machine_production');
            this.savePlayerData();
        }
        
        return totalGems;
    }
    
    /**
     * Upgrade virtual machine
     */
    upgradeMachine(machineId, upgradeCost) {
        const machine = this.playerBalance.machines.find(m => m.id === machineId);
        if (!machine) {
            return { success: false, error: 'Machine not found' };
        }
        
        if (!this.spendGems(upgradeCost, `upgrade_machine_${machineId}`)) {
            return { success: false, error: 'Insufficient gems' };
        }
        
        machine.level++;
        machine.production = this.calculateMachineProduction(machine.type, machine.level);
        
        this.savePlayerData();
        console.log(`[GBUV] Machine upgraded: ${machineId} -> Level ${machine.level}`);
        
        return { success: true, machine };
    }
    
    /**
     * Award daily/weekly rewards
     */
    awardReward(type, amount, description) {
        const reward = {
            type,
            amount,
            description,
            timestamp: Date.now()
        };
        
        if (type === 'gems') {
            this.addGems(amount, 'reward');
        } else if (type === 'tokens') {
            this.addTokens(amount, 'reward');
        }
        
        this.rewards.achievements.push(reward);
        this.savePlayerData();
        
        console.log(`[GBUV] Reward awarded: ${amount} ${type} - ${description}`);
        
        return reward;
    }
    
    /**
     * Setup event listeners for game integration
     */
    setupEventListeners() {
        // Listen for Merlin control actions
        window.addEventListener('merlinControlAction', (e) => {
            const { action } = e.detail;
            
            if (action === 'deploy') {
                this.handleDeployMachine();
            } else if (action === 'monitor') {
                this.displayProductionStats();
            } else if (action === 'upgrade-automation') {
                this.handleUpgradeAutomation();
            }
        });
    }
    
    /**
     * Handle deploy machine action
     */
    handleDeployMachine() {
        const cost = 500; // gems
        const result = this.deployVirtualMachine('basic_cutter', cost);
        
        if (result.success) {
            this.showNotification(`🚀 Machine deployed! Production: ${result.machine.production}/hr`);
        } else {
            this.showNotification(`❌ ${result.error}. Need ${cost} gems.`);
        }
    }
    
    /**
     * Display production statistics
     */
    displayProductionStats() {
        const collected = this.collectProduction();
        const balance = this.getBalance();
        
        const stats = `
📊 Production Report:
• Collected: ${collected} gems
• Balance: ${balance.gems} gems | ${balance.tokens} GBUV
• Machines: ${balance.machines}
• Real-World Bonus: ${balance.realWorldBonus.toFixed(2)}x
        `;
        
        console.log(stats);
        this.showNotification(stats);
    }
    
    /**
     * Handle upgrade automation
     */
    handleUpgradeAutomation() {
        if (this.playerBalance.machines.length === 0) {
            this.showNotification('❌ No machines to upgrade!');
            return;
        }
        
        const machine = this.playerBalance.machines[0]; // Upgrade first machine
        const cost = machine.level * 200; // Scaling cost
        
        const result = this.upgradeMachine(machine.id, cost);
        
        if (result.success) {
            this.showNotification(`⚡ Machine upgraded to Level ${result.machine.level}!`);
        } else {
            this.showNotification(`❌ ${result.error}. Need ${cost} gems.`);
        }
    }
    
    /**
     * Show notification to player
     */
    showNotification(message) {
        // Send to Merlin card
        if (window.MerlinCardIntegrated) {
            window.MerlinCardIntegrated.addMessage(message, 'assistant');
        }
        
        console.log(`[GBUV] ${message}`);
    }
    
    /**
     * Broadcast balance update to all systems
     */
    broadcastBalanceUpdate() {
        window.dispatchEvent(new CustomEvent('gbuvBalanceUpdate', {
            detail: this.getBalance()
        }));
    }
    
    /**
     * Start tracking rewards and production
     */
    startRewardTracking() {
        // Auto-collect production every 60 seconds
        setInterval(() => {
            const collected = this.collectProduction();
            if (collected > 0) {
                console.log(`[GBUV] Auto-collected ${collected} gems`);
            }
        }, 60000);
        
        console.log('[GBUV] Reward tracking started');
    }
    
    /**
     * Get transaction history
     */
    getTransactionHistory(limit = 20) {
        return this.transactions.slice(-limit).reverse();
    }
    
    /**
     * Export player data for backup/migration
     */
    exportPlayerData() {
        return {
            version: '1.0',
            exported: Date.now(),
            balance: this.playerBalance,
            transactions: this.transactions,
            rewards: this.rewards,
            bonuses: this.bonuses
        };
    }
}

// Initialize GBUV system
window.GBUV = new GemBotUniverseVault();

console.log('✅ GBUV - Gem Bot Universe Vault loaded');
console.log('   Real-world machines → In-game bonuses');
console.log('   Play-to-Learn | Play-to-Earn | Web3 Ready');
