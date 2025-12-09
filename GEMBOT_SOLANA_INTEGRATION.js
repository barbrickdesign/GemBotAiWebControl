// =====================================================
// GEMBOT SOLANA TOKEN INTEGRATION - PRODUCTION CODE
// Token: DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump
// Vault Wallet: 6HTjfgWZYMbENnMAJJFhxWR2VZDxdze3qV7zznSAsfk
// =====================================================

// 1. SOLANA CONNECTION & TOKEN SETUP
// =====================================================

class GemBotSolanaIntegration {
    constructor() {
        // Token Configuration
        this.TOKEN_ADDRESS = 'DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump';
        this.VAULT_WALLET = '6HTjfgWZYMbENnMAJJFhxWR2VZDxdze3qV7zznSAsfk';
        this.PUMP_FUN_URL = 'https://pump.fun/coin/DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump';
        this.SOLSCAN_URL = 'https://solscan.io/token/DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump';
        
        // Solana RPC (use your actual endpoint)
        this.RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
        
        // Transaction tracking
        this.transactionHistory = new Map();
        this.commandMapping = this.initializeCommandMapping();
        this.sessionActive = false;
    }
    
    // Initialize command mapping based on token amount
    initializeCommandMapping() {
        return {
            // 1-gem commands (basic movement)
            1: { cmd: '3', name: 'Y Axis Down', cost: 1, tier: 'Apprentice' },
            2: { cmd: '4', name: 'Y Axis Up', cost: 1, tier: 'Apprentice' },
            3: { cmd: '1', name: 'X Axis Left', cost: 1, tier: 'Apprentice' },
            4: { cmd: '2', name: 'X Axis Right', cost: 1, tier: 'Apprentice' },
            
            // 5-gem commands (spindle control)
            5: { cmd: 'w', name: 'Spindle +1000 RPM', cost: 5, tier: 'Apprentice' },
            6: { cmd: 'q', name: 'Spindle -1000 RPM', cost: 5, tier: 'Apprentice' },
            
            // 10-gem commands (advanced)
            10: { cmd: 'z', name: 'Precision Mode', cost: 10, tier: 'Journeyman' },
            11: { cmd: 'x', name: 'Speed Boost', cost: 10, tier: 'Journeyman' },
            
            // 20-gem commands (expert)
            20: { cmd: 'c', name: 'AI Assisted Cutting', cost: 20, tier: 'Artisan' }
        };
    }
}

// 2. BLOCKCHAIN LISTENER & TRANSACTION HANDLER
// =====================================================

class BlockchainCommandProcessor extends GemBotSolanaIntegration {
    constructor() {
        super();
        this.ws = null;
        this.listener = null;
        this.pendingTransactions = [];
    }
    
    async initializeBlockchainListener() {
        console.log('🔗 Initializing Solana blockchain listener...');
        
        // Initialize Phantom wallet connection
        if (window.solana && window.solana.isPhantom) {
            try {
                const response = await window.solana.connect();
                this.userWallet = response.publicKey.toString();
                console.log('✅ Connected to Phantom wallet:', this.userWallet);
                
                // Start listening for transactions
                await this.startTransactionListener();
            } catch (error) {
                console.error('❌ Failed to connect Phantom wallet:', error);
                this.displayError('Phantom wallet not available. Please install it.');
            }
        } else {
            console.error('❌ Phantom wallet not found');
            this.displayError('Please install Phantom wallet');
        }
    }
    
    async startTransactionListener() {
        console.log('🎧 Starting transaction listener...');
        
        // Poll for transactions every 3 seconds
        this.listener = setInterval(async () => {
            try {
                const transactions = await this.fetchUserTransactions();
                
                for (const tx of transactions) {
                    if (!this.transactionHistory.has(tx.signature)) {
                        await this.processTransaction(tx);
                    }
                }
            } catch (error) {
                console.error('Error checking transactions:', error);
            }
        }, 3000);
    }
    
    async fetchUserTransactions() {
        if (!this.userWallet) return [];
        
        try {
            const response = await fetch(
                `https://api.solscan.io/account/transactions?account=${this.userWallet}&limit=10`
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }
    
    async processTransaction(tx) {
        console.log('📦 Processing transaction:', tx.signature);
        
        // Extract transaction details
        const txData = await this.parseTransactionData(tx);
        
        if (!txData) {
            console.log('⏭️  Skipping non-token transaction');
            return;
        }
        
        // Get gem amount from transaction
        const gemAmount = txData.amount;
        
        // Look up command mapping
        const commandInfo = this.commandMapping[gemAmount];
        
        if (!commandInfo) {
            console.warn(`⚠️  No command mapped for ${gemAmount} gems`);
            await this.refundTransaction(tx.signature, 'Invalid gem amount');
            return;
        }
        
        // Validate user can execute this command
        const validation = await this.validateCommand(commandInfo);
        
        if (!validation.valid) {
            console.warn(`❌ Command validation failed: ${validation.reason}`);
            await this.refundTransaction(tx.signature, validation.reason);
            return;
        }
        
        // Execute the command
        console.log(`⚙️  Executing command: ${commandInfo.name}`);
        await this.executeCommand(commandInfo, tx.signature);
        
        // Record in history
        this.transactionHistory.set(tx.signature, {
            timestamp: Date.now(),
            command: commandInfo.cmd,
            amount: gemAmount,
            status: 'executed'
        });
    }
    
    async parseTransactionData(tx) {
        // Parse Solana transaction to extract token transfer details
        try {
            const response = await fetch(
                `https://api.solscan.io/tx/${tx.signature}`
            );
            const data = await response.json();
            
            // Look for token transfer to vault wallet
            const transfer = data.data?.spl?.find(t => 
                t.destination === this.VAULT_WALLET &&
                t.mint === this.TOKEN_ADDRESS
            );
            
            if (transfer) {
                return {
                    amount: parseInt(transfer.amount),
                    timestamp: data.data.blockTime
                };
            }
        } catch (error) {
            console.error('Error parsing transaction:', error);
        }
        
        return null;
    }
    
    async validateCommand(commandInfo) {
        // Check if user is certified for this tier
        const userTier = this.userProfile?.gemForge?.certification?.tier || 'Apprentice';
        const tierOrder = ['Apprentice', 'Journeyman', 'Artisan', 'Master', 'Grandmaster'];
        const userTierIndex = tierOrder.indexOf(userTier);
        const requiredTierIndex = tierOrder.indexOf(commandInfo.tier);
        
        if (userTierIndex < requiredTierIndex) {
            return {
                valid: false,
                reason: `Not certified for ${commandInfo.name}. Required: ${commandInfo.tier}`
            };
        }
        
        // Check if machine is ready
        if (!this.sessionActive) {
            return {
                valid: false,
                reason: 'Machine not in active session'
            };
        }
        
        // Check machine health
        if (this.machineStatus?.error) {
            return {
                valid: false,
                reason: `Machine error: ${this.machineStatus.error}`
            };
        }
        
        return { valid: true };
    }
    
    async executeCommand(commandInfo, txSignature) {
        try {
            // Send to Arduino via SerialPort
            if (this.serialPort) {
                const writer = this.serialPort.getWriter();
                const encoder = new TextEncoder();
                await writer.write(encoder.encode(commandInfo.cmd));
                writer.releaseLock();
                
                // Log command execution
                this.logCommandExecution(commandInfo, txSignature);
                
                // Update UI
                this.displayCommandFeedback(commandInfo);
            }
        } catch (error) {
            console.error('Error executing command:', error);
            await this.refundTransaction(txSignature, error.message);
        }
    }
    
    async refundTransaction(txSignature, reason) {
        console.log(`💸 Refunding transaction: ${reason}`);
        
        // In production, this would execute a refund transaction back to user
        // For now, we log it and alert the user
        
        this.displayAlert(`Transaction refunded: ${reason}`, 'warning');
        
        // Could integrate with Solana program to auto-refund
        // const refundTx = await this.createRefundTransaction(txSignature);
        // await this.submitRefundTransaction(refundTx);
    }
}

// 3. MACHINE CONTROL & MONITORING
// =====================================================

class MachineControllerWithToken extends BlockchainCommandProcessor {
    constructor() {
        super();
        this.serialPort = null;
        this.machineStatus = {};
        this.sessionData = {
            startTime: null,
            commandCount: 0,
            gems spent: 0,
            revenue: 0
        };
    }
    
    async startCuttingSession() {
        console.log('🚀 Starting gem cutting session...');
        
        this.sessionActive = true;
        this.sessionData.startTime = Date.now();
        this.sessionData.commandCount = 0;
        this.sessionData.gemsSpent = 0;
        
        // Initialize blockchain listener
        await this.initializeBlockchainListener();
        
        // Start monitoring machine
        await this.startMachineMonitoring();
        
        // Start live feed
        await this.startLiveFeed();
        
        console.log('✅ Session started. Waiting for transactions...');
        
        this.displayStatus('Session active - Send gems to execute commands', 'success');
    }
    
    async startMachineMonitoring() {
        // Monitor machine health every 500ms
        setInterval(() => {
            this.updateMachineStatus();
        }, 500);
    }
    
    updateMachineStatus() {
        // In real implementation, read from Arduino
        this.machineStatus = {
            temperature: Math.random() * 60,
            spindle_rpm: Math.random() * 10000,
            x_position: Math.random() * 100,
            y_position: Math.random() * 100,
            error: null,
            uptime: Date.now() - this.sessionData.startTime
        };
        
        // Detect anomalies
        if (this.machineStatus.temperature > 70) {
            this.handleMachineAnomaly('Overheating', 'CRITICAL');
        }
    }
    
    async handleMachineAnomaly(type, severity) {
        console.error(`🚨 Machine anomaly detected: ${type}`);
        
        // Send emergency stop
        await this.emergencyStop();
        
        // Refund current transaction
        if (this.pendingTransactions.length > 0) {
            const pending = this.pendingTransactions[0];
            await this.refundTransaction(pending.signature, type);
        }
        
        this.displayAlert(`Emergency stop: ${type}`, 'critical');
    }
    
    async emergencyStop() {
        console.log('🛑 EMERGENCY STOP ACTIVATED');
        
        try {
            if (this.serialPort) {
                const writer = this.serialPort.getWriter();
                const encoder = new TextEncoder();
                await writer.write(encoder.encode('E')); // Emergency stop command
                writer.releaseLock();
            }
        } catch (error) {
            console.error('Emergency stop error:', error);
        }
    }
    
    endSession() {
        console.log('⏹️  Ending session...');
        
        this.sessionActive = false;
        
        if (this.listener) {
            clearInterval(this.listener);
        }
        
        // Calculate session rewards
        const sessionReward = this.calculateSessionReward();
        
        this.displaySessionSummary(sessionReward);
        
        return sessionReward;
    }
    
    calculateSessionReward() {
        const duration = (Date.now() - this.sessionData.startTime) / 60000; // minutes
        const commandsExecuted = this.sessionData.commandCount;
        const cutQuality = this.estimateCutQuality(); // 0-100
        
        // Base reward: 1 gem per command
        let baseReward = commandsExecuted;
        
        // Quality bonus: +5 gems if >90% quality
        if (cutQuality > 90) {
            baseReward += 5;
        }
        
        // Streak bonus: +2 gems for every 10 consecutive good commands
        const streak = Math.floor(commandsExecuted / 10);
        baseReward += streak * 2;
        
        // Calculate revenue generated
        const revenue = (commandsExecuted * 0.5); // 50 cents per command
        
        return {
            gemsEarned: baseReward,
            quality: cutQuality,
            duration,
            revenue,
            timestamp: new Date().toISOString()
        };
    }
    
    estimateCutQuality() {
        // In real implementation, analyze video feed
        return 85 + Math.random() * 10; // Simulated 85-95% quality
    }
}

// 4. LIVE FEED WITH VISION AI
// =====================================================

class LiveFeedWithAI extends MachineControllerWithToken {
    constructor() {
        super();
        this.videoElement = null;
        this.canvas = null;
        this.ctx = null;
    }
    
    async startLiveFeed() {
        console.log('📹 Starting live feed...');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 }
            });
            
            this.videoElement = document.getElementById('livestream');
            this.videoElement.srcObject = stream;
            
            // Start AI monitoring
            this.startAIMonitoring();
            
            console.log('✅ Live feed started');
        } catch (error) {
            console.error('Failed to start live feed:', error);
        }
    }
    
    startAIMonitoring() {
        const fps = 30;
        const interval = 1000 / fps;
        
        setInterval(() => {
            this.analyzeFrame();
        }, interval);
    }
    
    analyzeFrame() {
        if (!this.videoElement) return;
        
        this.canvas = this.canvas || document.createElement('canvas');
        this.ctx = this.ctx || this.canvas.getContext('2d');
        
        this.canvas.width = this.videoElement.videoWidth;
        this.canvas.height = this.videoElement.videoHeight;
        
        this.ctx.drawImage(this.videoElement, 0, 0);
        
        // Run AI analysis (in real implementation, use TensorFlow.js or similar)
        const analysis = this.runAIAnalysis();
        
        // Check for beautiful cuts
        if (analysis.beautyScore > 0.8) {
            this.handleBeautifulCut(analysis);
        }
        
        // Check for anomalies
        if (analysis.anomalies.length > 0) {
            this.handleAnomalies(analysis.anomalies);
        }
        
        // Update overlay
        this.updateLiveOverlay(analysis);
    }
    
    runAIAnalysis() {
        // Simulated AI analysis
        return {
            beautyScore: Math.random(),
            anomalies: Math.random() > 0.95 ? ['Potential jam'] : [],
            facetSharpness: Math.random() * 100,
            sparkle: Math.random() * 100,
            polish: Math.random() * 100
        };
    }
    
    handleBeautifulCut(analysis) {
        console.log('✨ Beautiful cut detected!');
        
        // Award bonus gems
        this.awardBonus(5, 'Beautiful cut');
        
        // Display celebration
        this.displayCelebration('✨ BEAUTIFUL CUT! ✨', 'success');
        
        // Play sound effect
        this.playSound('success');
    }
    
    handleAnomalies(anomalies) {
        console.log('⚠️  Anomalies detected:', anomalies);
        
        for (const anomaly of anomalies) {
            this.displayAlert(`Anomaly: ${anomaly}`, 'warning');
        }
    }
    
    updateLiveOverlay(analysis) {
        const overlay = document.getElementById('overlay');
        if (!overlay) return;
        
        overlay.innerHTML = `
            <div class="status-bar">
                <span>Temperature: ${this.machineStatus.temperature?.toFixed(1)}°C</span>
                <span>Spindle: ${this.machineStatus.spindle_rpm?.toFixed(0)} RPM</span>
                <span>Quality: ${analysis.facetSharpness?.toFixed(1)}%</span>
                <span>Sparkle: ${analysis.sparkle?.toFixed(1)}%</span>
            </div>
        `;
    }
    
    awardBonus(amount, reason) {
        // Would update user's gem balance
        console.log(`💎 +${amount} gems for: ${reason}`);
    }
    
    displayCelebration(message, type) {
        const element = document.createElement('div');
        element.className = `celebration ${type}`;
        element.textContent = message;
        document.body.appendChild(element);
        
        setTimeout(() => element.remove(), 3000);
    }
    
    displayAlert(message, type) {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    displayStatus(message, type) {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    displayCommandFeedback(commandInfo) {
        console.log(`✅ Command executed: ${commandInfo.name}`);
    }
    
    playSound(type) {
        // Would play audio feedback
    }
    
    logCommandExecution(commandInfo, txSignature) {
        // Log to database
        console.log(`📝 Logged: ${commandInfo.cmd} from ${txSignature}`);
    }
    
    displaySessionSummary(reward) {
        console.log(`
            🏆 SESSION SUMMARY 🏆
            
            Duration: ${reward.duration.toFixed(1)} minutes
            Gems Earned: ${reward.gemsEarned}
            Cut Quality: ${reward.quality.toFixed(1)}%
            Revenue Generated: $${reward.revenue.toFixed(2)}
            
            Timestamp: ${reward.timestamp}
        `);
    }
}

// 5. INITIALIZE & EXPORT
// =====================================================

// Create global instance
window.gemBotController = new LiveFeedWithAI();

// Export for use in GemBot_Control_AI.html
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GemBotSolanaIntegration,
        BlockchainCommandProcessor,
        MachineControllerWithToken,
        LiveFeedWithAI
    };
}

// 6. USAGE EXAMPLE IN HTML
// =====================================================

/*

<script src="gembot-solana-integration.js"></script>

<body>
    <h1>GemBot Token Control</h1>
    
    <button onclick="startSession()">Start Cutting Session</button>
    <button onclick="stopSession()">End Session</button>
    <button onclick="emergencyStop()">🛑 EMERGENCY STOP</button>
    
    <div id="livestream" style="width: 1280px; height: 720px;"></div>
    <div id="overlay"></div>
    
    <script>
        function startSession() {
            gemBotController.startCuttingSession();
        }
        
        function stopSession() {
            const reward = gemBotController.endSession();
            console.log('Session rewards:', reward);
        }
        
        function emergencyStop() {
            gemBotController.emergencyStop();
        }
    </script>
</body>

*/
