/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GEMBOT AUTOMATED WALLET SYSTEM - NO APP REQUIRED
 * ═══════════════════════════════════════════════════════════════════════════
 * Creates and manages wallets for users and agents automatically
 * All crypto operations handled in-browser without external wallet apps
 * Based on Solana Web3.js official documentation
 * 
 * OWNERSHIP: Ryan Barbrick / Barbrick Design
 * REFERENCE: https://solana.com/developers
 * ═══════════════════════════════════════════════════════════════════════════
 */

class GemBotAutomatedWalletSystem {
    constructor() {
        this.connection = new solanaWeb3.Connection(
            'https://api.mainnet-beta.solana.com',
            'confirmed'
        );
        
        // Core system wallet (hot wallet for operations)
        this.coreWallet = null;
        this.GBUV_MINT = 'DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump';
        
        // Storage keys
        this.STORAGE = {
            CORE_WALLET: 'gembot_core_wallet',
            USER_WALLETS: 'gembot_user_wallets',
            AGENT_WALLETS: 'gembot_agent_wallets',
            TRANSACTIONS: 'gembot_transactions'
        };
        
        console.log('🤖 GemBot Automated Wallet System initialized');
        this.initialize();
    }
    
    // ═════════════════════════════════════════════════════════════════════════
    // SYSTEM INITIALIZATION
    // ═════════════════════════════════════════════════════════════════════════
    
    async initialize() {
        // Load or create core wallet
        const stored = localStorage.getItem(this.STORAGE.CORE_WALLET);
        
        if (stored) {
            const data = JSON.parse(stored);
            this.coreWallet = solanaWeb3.Keypair.fromSecretKey(
                new Uint8Array(data.secretKey)
            );
            console.log('✅ Core wallet loaded:', this.coreWallet.publicKey.toString());
        } else {
            await this.createCoreWallet();
        }
        
        // Initialize storage
        if (!localStorage.getItem(this.STORAGE.USER_WALLETS)) {
            localStorage.setItem(this.STORAGE.USER_WALLETS, JSON.stringify({}));
        }
        if (!localStorage.getItem(this.STORAGE.AGENT_WALLETS)) {
            localStorage.setItem(this.STORAGE.AGENT_WALLETS, JSON.stringify({}));
        }
        if (!localStorage.getItem(this.STORAGE.TRANSACTIONS)) {
            localStorage.setItem(this.STORAGE.TRANSACTIONS, JSON.stringify([]));
        }
        
        // Check core wallet balance
        await this.checkCoreBalance();
        
        // Log to activity feed
        if (window.liveActivityFeed) {
            window.liveActivityFeed.log('SYSTEM', 
                `Core Wallet: ${this.coreWallet.publicKey.toString().substring(0, 8)}...`
            );
        }
    }
    
    async createCoreWallet() {
        console.log('🔧 Creating new core wallet...');
        
        // Generate new keypair using Solana Web3.js
        this.coreWallet = solanaWeb3.Keypair.generate();
        
        // Store encrypted (in production, use proper encryption)
        const walletData = {
            publicKey: this.coreWallet.publicKey.toString(),
            secretKey: Array.from(this.coreWallet.secretKey),
            created: new Date().toISOString(),
            type: 'CORE_OPERATIONS'
        };
        
        localStorage.setItem(this.STORAGE.CORE_WALLET, JSON.stringify(walletData));
        
        console.log('✅ Core wallet created!');
        console.log('📍 Address:', this.coreWallet.publicKey.toString());
        console.log('⚠️ FUND THIS WALLET WITH GBUV FOR OPERATIONS');
        
        // Display funding instructions
        this.showFundingInstructions();
        
        return this.coreWallet;
    }
    
    showFundingInstructions() {
        const address = this.coreWallet.publicKey.toString();
        
        console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                    FUND YOUR GEMBOT CORE WALLET                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

📍 Send GBUV to this address:
   ${address}

💰 Recommended amounts:
   - Testing: 1,000 GBUV
   - Pilot (3 domains): 10,000 GBUV
   - Full launch (15 domains): 100,000 GBUV

🔗 Token: ${this.GBUV_MINT}

📝 How to fund:
   1. Open your Phantom/Solflare wallet
   2. Select GBUV token
   3. Send to address above
   4. System will automatically detect and start operations

⚠️ This wallet handles automated distributions. Keep it funded!
        `);
        
        if (window.liveActivityFeed) {
            window.liveActivityFeed.log('SYSTEM', 
                `🔴 CORE WALLET NEEDS FUNDING: ${address.substring(0, 20)}...`
            );
        }
    }
    
    async checkCoreBalance() {
        try {
            // Get SOL balance
            const solBalance = await this.connection.getBalance(this.coreWallet.publicKey);
            const solAmount = solBalance / solanaWeb3.LAMPORTS_PER_SOL;
            
            // Get GBUV balance (simplified - real implementation needs SPL Token library)
            // For now, we'll simulate
            const gbuvBalance = 0; // TODO: Implement actual SPL token balance check
            
            console.log(`💰 Core Wallet Balance:`);
            console.log(`   SOL: ${solAmount.toFixed(4)}`);
            console.log(`   GBUV: ${gbuvBalance}`);
            
            if (gbuvBalance < 1000) {
                console.warn('⚠️ Low GBUV balance! Please fund core wallet.');
                if (window.liveActivityFeed) {
                    window.liveActivityFeed.logError(
                        'Core wallet low on GBUV. Fund needed for operations.'
                    );
                }
            }
            
            return { sol: solAmount, gbuv: gbuvBalance };
        } catch (error) {
            console.error('❌ Error checking balance:', error);
            return { sol: 0, gbuv: 0 };
        }
    }
    
    // ═════════════════════════════════════════════════════════════════════════
    // USER WALLET CREATION (AUTOMATIC - NO APP REQUIRED)
    // ═════════════════════════════════════════════════════════════════════════
    
    async createUserWallet(userId, username) {
        console.log(`🔧 Creating wallet for user: ${username}...`);
        
        // Generate new keypair
        const keypair = solanaWeb3.Keypair.generate();
        const publicKey = keypair.publicKey.toString();
        
        // Create wallet object
        const wallet = {
            userId: userId,
            username: username,
            publicKey: publicKey,
            secretKey: Array.from(keypair.secretKey), // Encrypted in production
            created: new Date().toISOString(),
            balance: {
                sol: 0,
                gbuv: 0
            },
            transactions: [],
            type: 'USER'
        };
        
        // Store wallet
        const wallets = JSON.parse(localStorage.getItem(this.STORAGE.USER_WALLETS));
        wallets[userId] = wallet;
        localStorage.setItem(this.STORAGE.USER_WALLETS, JSON.stringify(wallets));
        
        console.log(`✅ Wallet created for ${username}`);
        console.log(`📍 Address: ${publicKey}`);
        
        // Give welcome bonus
        await this.sendWelcomeBonus(publicKey, username);
        
        if (window.liveActivityFeed) {
            window.liveActivityFeed.log('USER', 
                `${username} joined! Wallet created: ${publicKey.substring(0, 8)}...`
            );
        }
        
        return wallet;
    }
    
    async sendWelcomeBonus(userPublicKey, username) {
        const welcomeAmount = 100; // 100 GBUV welcome bonus
        
        console.log(`🎁 Sending ${welcomeAmount} GBUV welcome bonus to ${username}...`);
        
        // In production, this would be a real SPL token transfer
        // For now, we'll track it in our system
        const tx = {
            from: this.coreWallet.publicKey.toString(),
            to: userPublicKey,
            amount: welcomeAmount,
            token: 'GBUV',
            type: 'WELCOME_BONUS',
            timestamp: new Date().toISOString(),
            status: 'PENDING'
        };
        
        // Simulate transaction (replace with real transfer)
        await this.simulateTransfer(tx);
        
        if (window.liveActivityFeed) {
            window.liveActivityFeed.log('SYSTEM', 
                `🎁 ${username} received ${welcomeAmount} GBUV welcome bonus!`
            );
        }
    }
    
    // ═════════════════════════════════════════════════════════════════════════
    // AGENT WALLET CREATION
    // ═════════════════════════════════════════════════════════════════════════
    
    async createAgentWallet(agentId, agentName, domain) {
        console.log(`🤖 Creating wallet for agent: ${agentName}...`);
        
        // Generate new keypair
        const keypair = solanaWeb3.Keypair.generate();
        const publicKey = keypair.publicKey.toString();
        
        // Create wallet object
        const wallet = {
            agentId: agentId,
            agentName: agentName,
            domain: domain,
            publicKey: publicKey,
            secretKey: Array.from(keypair.secretKey),
            created: new Date().toISOString(),
            balance: {
                sol: 0,
                gbuv: 0
            },
            earnings: 0,
            transactions: [],
            type: 'AGENT'
        };
        
        // Store wallet
        const wallets = JSON.parse(localStorage.getItem(this.STORAGE.AGENT_WALLETS));
        wallets[agentId] = wallet;
        localStorage.setItem(this.STORAGE.AGENT_WALLETS, JSON.stringify(wallets));
        
        console.log(`✅ Agent wallet created: ${agentName}`);
        console.log(`📍 Address: ${publicKey}`);
        
        // Give starting funds
        await this.fundAgent(publicKey, agentName, 50); // 50 GBUV to start
        
        if (window.liveActivityFeed) {
            window.liveActivityFeed.logAgentAction(agentName, 
                'Wallet created and funded with 50 GBUV'
            );
        }
        
        return wallet;
    }
    
    async fundAgent(agentPublicKey, agentName, amount) {
        console.log(`💰 Funding agent ${agentName} with ${amount} GBUV...`);
        
        const tx = {
            from: this.coreWallet.publicKey.toString(),
            to: agentPublicKey,
            amount: amount,
            token: 'GBUV',
            type: 'AGENT_FUNDING',
            timestamp: new Date().toISOString(),
            status: 'PENDING'
        };
        
        await this.simulateTransfer(tx);
        
        console.log(`✅ Agent ${agentName} funded with ${amount} GBUV`);
    }
    
    // ═════════════════════════════════════════════════════════════════════════
    // AUTOMATED DISTRIBUTION SYSTEM
    // ═════════════════════════════════════════════════════════════════════════
    
    async distributeReward(recipientPublicKey, amount, reason, recipientName) {
        console.log(`💎 Distributing ${amount} GBUV to ${recipientName} (${reason})`);
        
        const tx = {
            from: this.coreWallet.publicKey.toString(),
            to: recipientPublicKey,
            amount: amount,
            token: 'GBUV',
            type: 'REWARD',
            reason: reason,
            recipient: recipientName,
            timestamp: new Date().toISOString(),
            status: 'PENDING'
        };
        
        await this.simulateTransfer(tx);
        
        if (window.liveActivityFeed) {
            window.liveActivityFeed.log('SYSTEM', 
                `💎 ${recipientName} earned ${amount} GBUV: ${reason}`
            );
        }
        
        return tx;
    }
    
    async payAgentSalary(agentId) {
        const wallets = JSON.parse(localStorage.getItem(this.STORAGE.AGENT_WALLETS));
        const agent = wallets[agentId];
        
        if (!agent) {
            console.error(`Agent ${agentId} not found`);
            return;
        }
        
        const salary = 10; // 10 GBUV per payment cycle
        
        await this.distributeReward(
            agent.publicKey,
            salary,
            'Daily salary',
            agent.agentName
        );
        
        // Update earnings
        agent.earnings += salary;
        wallets[agentId] = agent;
        localStorage.setItem(this.STORAGE.AGENT_WALLETS, JSON.stringify(wallets));
    }
    
    async rewardLevelUp(userId, newLevel) {
        const wallets = JSON.parse(localStorage.getItem(this.STORAGE.USER_WALLETS));
        const user = wallets[userId];
        
        if (!user) {
            console.error(`User ${userId} not found`);
            return;
        }
        
        const reward = newLevel * 50; // 50 GBUV per level
        
        await this.distributeReward(
            user.publicKey,
            reward,
            `Level ${newLevel} achieved!`,
            user.username
        );
    }
    
    async rewardAchievement(userId, achievementName, value) {
        const wallets = JSON.parse(localStorage.getItem(this.STORAGE.USER_WALLETS));
        const user = wallets[userId];
        
        if (!user) return;
        
        await this.distributeReward(
            user.publicKey,
            value,
            `Achievement: ${achievementName}`,
            user.username
        );
    }
    
    // ═════════════════════════════════════════════════════════════════════════
    // TRANSACTION SIMULATION (Replace with real SPL token transfers)
    // ═════════════════════════════════════════════════════════════════════════
    
    async simulateTransfer(tx) {
        // This simulates the transfer
        // In production, replace with actual SPL token transfer using:
        // - @solana/spl-token library
        // - Token.transfer() method
        // - Proper transaction signing
        
        console.log(`📤 Simulating transfer:`);
        console.log(`   From: ${tx.from.substring(0, 8)}...`);
        console.log(`   To: ${tx.to.substring(0, 8)}...`);
        console.log(`   Amount: ${tx.amount} ${tx.token}`);
        console.log(`   Type: ${tx.type}`);
        
        // Wait a bit to simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mark as completed
        tx.status = 'COMPLETED';
        tx.signature = 'SIM_' + Math.random().toString(36).substring(7);
        
        // Store transaction
        const transactions = JSON.parse(localStorage.getItem(this.STORAGE.TRANSACTIONS));
        transactions.push(tx);
        localStorage.setItem(this.STORAGE.TRANSACTIONS, JSON.stringify(transactions));
        
        console.log(`✅ Transfer simulated: ${tx.signature}`);
        
        return tx;
    }
    
    // ═════════════════════════════════════════════════════════════════════════
    // REAL SPL TOKEN TRANSFER (Production Implementation)
    // ═════════════════════════════════════════════════════════════════════════
    
    async realSPLTransfer(fromKeypair, toPublicKey, amount) {
        // TODO: Implement actual SPL token transfer
        // Requires: @solana/spl-token library
        
        /*
        Example implementation:
        
        const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
        
        // Get token account info
        const fromTokenAccount = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            new solanaWeb3.PublicKey(this.GBUV_MINT),
            fromKeypair.publicKey
        );
        
        const toTokenAccount = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            new solanaWeb3.PublicKey(this.GBUV_MINT),
            new solanaWeb3.PublicKey(toPublicKey)
        );
        
        // Create transfer instruction
        const transaction = new solanaWeb3.Transaction().add(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount,
                toTokenAccount,
                fromKeypair.publicKey,
                [],
                amount
            )
        );
        
        // Sign and send
        const signature = await solanaWeb3.sendAndConfirmTransaction(
            this.connection,
            transaction,
            [fromKeypair]
        );
        
        return signature;
        */
        
        console.warn('⚠️ Real SPL transfer not implemented yet. Using simulation.');
        return this.simulateTransfer({
            from: fromKeypair.publicKey.toString(),
            to: toPublicKey,
            amount: amount,
            token: 'GBUV',
            type: 'TRANSFER',
            timestamp: new Date().toISOString()
        });
    }
    
    // ═════════════════════════════════════════════════════════════════════════
    // WALLET MANAGEMENT
    // ═════════════════════════════════════════════════════════════════════════
    
    getUserWallet(userId) {
        const wallets = JSON.parse(localStorage.getItem(this.STORAGE.USER_WALLETS));
        return wallets[userId] || null;
    }
    
    getAgentWallet(agentId) {
        const wallets = JSON.parse(localStorage.getItem(this.STORAGE.AGENT_WALLETS));
        return wallets[agentId] || null;
    }
    
    getAllUserWallets() {
        return JSON.parse(localStorage.getItem(this.STORAGE.USER_WALLETS));
    }
    
    getAllAgentWallets() {
        return JSON.parse(localStorage.getItem(this.STORAGE.AGENT_WALLETS));
    }
    
    getTransactionHistory() {
        return JSON.parse(localStorage.getItem(this.STORAGE.TRANSACTIONS));
    }
    
    getCoreWalletAddress() {
        return this.coreWallet ? this.coreWallet.publicKey.toString() : null;
    }
}

// ═════════════════════════════════════════════════════════════════════════
// INITIALIZE SYSTEM
// ═════════════════════════════════════════════════════════════════════════

// Wait for Solana Web3.js to load
if (typeof solanaWeb3 !== 'undefined') {
    window.gemBotWalletSystem = new GemBotAutomatedWalletSystem();
    console.log('✅ GemBot Automated Wallet System ready!');
} else {
    console.error('❌ Solana Web3.js not loaded. Add CDN script to HTML.');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotAutomatedWalletSystem;
}
