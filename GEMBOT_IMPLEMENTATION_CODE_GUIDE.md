# GEMBOT ECOSYSTEM: Implementation Guide for GemBot_Control_AI.html

## Overview

This document shows **exactly how to integrate** the decentralized gem-cutting economy into your existing Merlin AI web controller. All code examples are designed to work with your current architecture.

---

## Module 1: Blockchain Integration

### 1.1 Add to MerlinPersonality Class

```javascript
// ==================== BLOCKCHAIN ECONOMY INTEGRATION ====================

class BlockchainEconomy {
    constructor(contractAddress, rpcUrl) {
        this.contractAddress = contractAddress;
        this.rpcUrl = rpcUrl;
        this.transactionListener = null;
        this.commandQueue = [];
        this.lastBlockChecked = 0;
    }

    async initializeListener() {
        // Start watching blockchain for transactions
        console.log('🔗 Blockchain listener initialized');
        this.startTransactionWatcher();
    }

    async startTransactionWatcher() {
        // Check for incoming transactions every 3 seconds
        setInterval(async () => {
            try {
                const newTransactions = await this.fetchNewTransactions();
                newTransactions.forEach(tx => {
                    this.processTransaction(tx);
                });
            } catch (error) {
                console.error('Transaction watcher error:', error);
            }
        }, 3000);
    }

    async fetchNewTransactions() {
        // Mock implementation (replace with actual blockchain call)
        // In production: use ethers.js or web3.js to fetch real transactions
        return [];
    }

    processTransaction(tx) {
        // Map transaction amount to serial command
        const command = this.mapAmountToCommand(tx.amount, tx.sender);
        
        if (command) {
            this.commandQueue.push({
                transaction: tx,
                command: command,
                timestamp: Date.now(),
                sender: tx.sender,
                amount: tx.amount
            });
            
            console.log(`💎 Pending command: ${command} (cost: ${tx.amount} gems)`);
        }
    }

    mapAmountToCommand(amount, userAddress) {
        // Transaction amount maps directly to serial command
        const commandMap = {
            1: { cmd: '3', name: 'Y Axis Down', cost: 1 },
            2: { cmd: '4', name: 'Y Axis Up', cost: 2 },
            3: { cmd: '1', name: 'X Axis Left', cost: 3 },
            4: { cmd: '2', name: 'X Axis Right', cost: 4 },
            5: { cmd: 'w', name: 'Spindle +1000 RPM', cost: 5 },
            6: { cmd: 'q', name: 'Spindle -1000 RPM', cost: 6 },
            10: { cmd: '5', name: 'Polish Mode', cost: 10 },
            20: { cmd: 'H', name: 'Home Position', cost: 20 }
        };
        
        return commandMap[amount] || null;
    }

    async validateCommand(command, userTier, gemstoneType, userWallet) {
        // AI oversight: ensure command is safe for this user + tier
        const validation = {
            isValid: true,
            warnings: [],
            tieredCost: this.calculateTieredCost(command, userTier)
        };

        // Check user tier eligibility
        if (gemstoneType === 'Diamond' && userTier !== 'Master') {
            validation.isValid = false;
            validation.warnings.push('Diamond tier requires Master certification');
        }

        // Check wallet balance
        const balance = await this.getUserBalance(userWallet);
        if (balance < validation.tieredCost) {
            validation.isValid = false;
            validation.warnings.push('Insufficient gem coins');
        }

        // Check machine readiness
        if (!this.isMachineReady()) {
            validation.isValid = false;
            validation.warnings.push('Machine not ready or in emergency state');
        }

        return validation;
    }

    calculateTieredCost(command, tier) {
        const baseCost = command.cost || 1;
        const tierMultipliers = {
            'Apprentice': 1.0,
            'Journeyman': 1.2,
            'Artisan': 1.5,
            'Master': 2.0,
            'Grandmaster': 2.5
        };
        
        return Math.ceil(baseCost * (tierMultipliers[tier] || 1.0));
    }

    async executeCommand(command, userWallet) {
        // Execute validated command
        console.log(`⚡ Executing: ${command.cmd}`);
        
        // Send to Arduino via serial
        if (typeof sendCommand === 'function') {
            sendCommand(command.cmd);
            
            // Log to blockchain for transparency
            this.logCommandExecution(command, userWallet);
            
            return { success: true, command: command.cmd };
        }
    }

    logCommandExecution(command, userWallet) {
        // Keep immutable record of all machine interactions
        const log = {
            timestamp: Date.now(),
            user: userWallet,
            command: command.cmd,
            amount: command.amount,
            status: 'executed'
        };
        
        console.log('📋 Command logged to blockchain', log);
    }

    async refundTransaction(txHash, reason) {
        // If command failed, refund user's gem coins
        console.log(`💰 Refund initiated: ${txHash} - Reason: ${reason}`);
    }

    isMachineReady() {
        // Check if machine is healthy + safe to receive commands
        return true; // Replace with actual machine health check
    }

    async getUserBalance(walletAddress) {
        // Fetch current gem coin balance from smart contract
        return 100; // Mock: replace with real contract call
    }
}
```

### 1.2 Instantiate in Merlin Initialization

```javascript
// In window.onload or after merlin = new MerlinPersonality():

merlin.blockchain = new BlockchainEconomy(
    '0x123...', // Contract address
    'https://api.solana.com' // or Polygon RPC
);

merlin.blockchain.initializeListener();
```

---

## Module 2: Live Feed Integration

### 2.1 Add to Merlin Class

```javascript
class LiveFeedManager {
    constructor(containerId, machineId) {
        this.containerId = containerId;
        this.machineId = machineId;
        this.videoElement = null;
        this.canvas = null;
        this.statusOverlay = null;
        this.isStreaming = false;
    }

    async startFeed() {
        console.log(`🎥 Starting live feed for ${this.machineId}`);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 }
            });
            
            this.videoElement = document.getElementById(this.containerId);
            this.videoElement.srcObject = stream;
            this.isStreaming = true;
            
            // Start AI monitoring
            this.startAIMonitoring();
            
            // Start overlay updates
            this.startStatusOverlay();
            
            return { success: true, message: 'Feed started' };
        } catch (error) {
            console.error('Feed error:', error);
            return { success: false, error: error.message };
        }
    }

    startAIMonitoring() {
        // Monitor for anomalies, safety issues, beautiful moments
        setInterval(() => {
            const frame = this.captureFrame();
            
            // Send to AI for analysis
            this.analyzeFrame(frame);
        }, 1000); // Check every 1 second
    }

    captureFrame() {
        // Capture current video frame for AI analysis
        if (this.videoElement) {
            const canvas = document.createElement('canvas');
            canvas.width = this.videoElement.videoWidth;
            canvas.height = this.videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.videoElement, 0, 0);
            return canvas.toDataURL('image/jpeg');
        }
    }

    analyzeFrame(frameData) {
        // AI analysis (mock - replace with TensorFlow.js model)
        const analysis = {
            anomalies: this.detectAnomalies(frameData),
            beautifulMoment: this.detectBeautifulCut(frameData),
            machineHealth: 'good',
            powerStatus: 'stable'
        };

        if (analysis.anomalies.length > 0) {
            this.handleAnomaly(analysis.anomalies[0]);
        }

        if (analysis.beautifulMoment) {
            this.highlightBeautifulMoment();
        }
    }

    detectAnomalies(frameData) {
        // Simple anomaly detection (replace with ML model)
        // Look for: jams, misalignment, overheating, sparks
        const anomalies = [];
        
        // Mock detection
        if (Math.random() < 0.01) {
            anomalies.push({
                type: 'potential_jam',
                confidence: 0.85,
                location: 'spindle_area'
            });
        }
        
        return anomalies;
    }

    detectBeautifulCut(frameData) {
        // Detect beautiful cutting moments (facet completion, polish, sparkle)
        // Mock: replace with actual CV model
        return Math.random() < 0.05; // 5% chance per frame
    }

    handleAnomaly(anomaly) {
        console.warn(`⚠️ Anomaly detected: ${anomaly.type}`);
        
        // Alert machine owner
        addMessage(`🚨 ALERT: ${anomaly.type} detected! Pausing machine...`, 'system');
        
        // Send emergency stop to Arduino
        if (typeof sendCommand === 'function') {
            sendCommand('E'); // Emergency stop
        }
        
        // Refund user's gem coins for interrupted session
        merlin.blockchain?.refundTransaction(
            'current_tx',
            `Anomaly detected: ${anomaly.type}`
        );
    }

    highlightBeautifulMoment() {
        console.log('✨ Beautiful cut detected!');
        
        // Visual feedback on stream
        this.addOverlayAnimation('✨ BEAUTIFUL CUT!');
        
        // Play celebratory sound
        this.playCelebration();
        
        // Award bonus gems to cutter
        merlin.earnGemCoins(5, 'Beautiful cut bonus');
        
        // Announce on chat
        addMessage('✨ What a beautiful facet! +5 bonus gems!', 'merlin');
    }

    startStatusOverlay() {
        // Update overlay with current machine status every 500ms
        setInterval(() => {
            this.updateOverlay({
                machineStatus: 'cutting',
                spindle: 'running',
                axis: { x: 150, y: 200, z: 75 },
                powerStatus: 'stable',
                temperature: 45,
                gemstoneType: 'Quartz',
                cutterTier: 'Journeyman',
                gemCoinsThisSession: 25
            });
        }, 500);
    }

    updateOverlay(status) {
        // Update overlay text on video
        const overlay = document.getElementById('statusOverlay');
        if (overlay) {
            overlay.innerHTML = `
                <div style="position: absolute; top: 10px; right: 10px; 
                           background: rgba(0,0,0,0.7); color: #0f0; 
                           padding: 10px; font-size: 12px; font-family: monospace;">
                    Machine: ${status.machineStatus}<br>
                    Spindle: ${status.spindle} @ ${status.temperature}°C<br>
                    Axis: X=${status.axis.x} Y=${status.axis.y} Z=${status.axis.z}<br>
                    Power: ${status.powerStatus}<br>
                    Gem: ${status.gemstoneType}<br>
                    Cutter: ${status.cutterTier}<br>
                    💎 This Session: ${status.gemCoinsThisSession}
                </div>
            `;
        }
    }

    addOverlayAnimation(text) {
        // Flash celebratory text on screen
        const animation = document.createElement('div');
        animation.textContent = text;
        animation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            color: gold;
            text-shadow: 0 0 10px gold;
            animation: pulse 1s;
            z-index: 10000;
        `;
        document.body.appendChild(animation);
        setTimeout(() => animation.remove(), 1000);
    }

    playCelebration() {
        // Play success sound (mock)
        const audio = new Audio('data:audio/wav;base64,...');
        audio.play().catch(e => console.log('Audio play failed', e));
    }

    stopFeed() {
        if (this.videoElement && this.videoElement.srcObject) {
            this.videoElement.srcObject.getTracks().forEach(track => track.stop());
            this.isStreaming = false;
            console.log('📹 Feed stopped');
        }
    }
}
```

### 2.2 Add HTML Container

```html
<div id="liveStreamContainer" style="position: relative; width: 100%; max-width: 800px; margin: 10px auto;">
    <video id="cameraFeedLive" width="800" height="600" autoplay playsinline 
           style="width: 100%; background: #000; border: 2px solid #667eea; border-radius: 8px;"></video>
    <div id="statusOverlay"></div>
</div>
```

---

## Module 3: Sora 2 Training Integration

### 3.1 Add to Merlin Class

```javascript
class SoraTrainingModule {
    constructor() {
        this.trainingCourses = this.initializeCourses();
        this.userProgress = {};
    }

    initializeCourses() {
        return {
            'tier_1_quartz': {
                title: 'Quartz Cutting Basics',
                videos: [
                    { 
                        id: 'sora2_quartz_101',
                        title: 'Introduction to Quartz',
                        duration: 5,
                        content: 'Watch this Sora 2 generated video about quartz properties...'
                    },
                    {
                        id: 'sora2_quartz_facet',
                        title: 'Cutting Your First Facet',
                        duration: 8,
                        content: 'Learn the basics of facet cutting on quartz...'
                    }
                ],
                simulation: {
                    type: 'virtual_gembot',
                    difficulty: 'beginner',
                    duration: 15
                },
                certification: {
                    questions: 5,
                    passingScore: 80
                }
            },
            'tier_2_topaz': {
                title: 'Topaz: Harder Materials',
                videos: [
                    {
                        id: 'sora2_topaz_101',
                        title: 'Topaz Properties & Challenges',
                        duration: 7,
                        content: 'Sora 2 video on topaz hardness and cutting techniques...'
                    }
                ],
                simulation: {
                    type: 'virtual_gembot',
                    difficulty: 'intermediate',
                    duration: 20
                },
                certification: {
                    questions: 10,
                    passingScore: 85
                }
            }
        };
    }

    async startTraining(userId, tier) {
        console.log(`🎓 Starting ${tier} training for ${userId}`);
        
        const course = this.trainingCourses[tier];
        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        // Watch videos
        for (const video of course.videos) {
            await this.playTrainingVideo(video);
        }

        // Run simulation
        const simResult = await this.runSimulation(course.simulation);
        
        if (!simResult.success) {
            return { success: false, error: 'Simulation failed' };
        }

        // Take certification quiz
        const quizResult = await this.takeCertification(course.certification, tier);
        
        if (quizResult.passed) {
            await this.unlockTier(userId, tier);
            merlin.earnGemCoins(50, `${tier} certification completed`);
            return { success: true, message: 'Certification passed!' };
        } else {
            return { success: false, error: 'Certification failed. Try again.' };
        }
    }

    async playTrainingVideo(video) {
        console.log(`📺 Playing: ${video.title}`);
        
        // Simulate watching video
        return new Promise(resolve => {
            // In production: embed Sora 2 video player here
            const videoContainer = document.getElementById('trainingVideoContainer');
            if (videoContainer) {
                videoContainer.innerHTML = `
                    <div style="background: #1a1a2e; padding: 20px; border-radius: 8px;">
                        <h3>${video.title}</h3>
                        <p>Duration: ${video.duration} minutes</p>
                        <button onclick="completeVideo()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Mark as Watched
                        </button>
                    </div>
                `;
            }
            
            // User clicks "Mark as Watched"
            window.completeVideo = () => resolve();
        });
    }

    async runSimulation(config) {
        console.log(`🎮 Running ${config.difficulty} simulation`);
        
        // Simulate gem-cutting in VR/3D environment
        const simResult = {
            success: Math.random() > 0.3, // 70% success rate
            precision: Math.random() * 100,
            speed: Math.random() * 100,
            qualityScore: Math.random() * 100
        };

        if (simResult.qualityScore > 70) {
            return { success: true, score: simResult.qualityScore };
        } else {
            return { success: false, message: 'Try again - focus on precision' };
        }
    }

    async takeCertification(config, tier) {
        console.log(`📝 Certification quiz for ${tier}`);
        
        const questions = this.generateQuestions(config.questions, tier);
        let score = 0;

        for (const question of questions) {
            const answer = await this.askQuestion(question);
            if (answer === question.correct) {
                score += 10;
            }
        }

        const passed = score >= config.passingScore;
        
        return {
            passed: passed,
            score: score,
            message: passed ? 'Congratulations!' : 'Try again'
        };
    }

    async askQuestion(question) {
        // Display question and get user's answer
        return new Promise(resolve => {
            const options = question.options.map((opt, i) => 
                `<button onclick="answerQuestion(${i})" style="display: block; margin: 5px; padding: 10px; width: 100%; cursor: pointer;">
                    ${opt}
                </button>`
            ).join('');
            
            window.answerQuestion = (index) => resolve(index);
            
            // Render quiz UI
            console.log(`Q: ${question.text}`);
        });
    }

    generateQuestions(count, tier) {
        return [
            {
                text: 'What is the hardness of quartz on the Mohs scale?',
                options: ['5', '7', '9', '10'],
                correct: 1
            },
            {
                text: 'What spindle RPM is recommended for quartz?',
                options: ['1000', '3000', '5000', '8000'],
                correct: 2
            }
            // ... more questions
        ];
    }

    async unlockTier(userId, tier) {
        console.log(`✅ Tier unlocked: ${tier}`);
        
        if (!this.userProgress[userId]) {
            this.userProgress[userId] = { certifications: [] };
        }
        
        this.userProgress[userId].certifications.push(tier);
        
        // Update user profile
        merlin.userProfile.teachingStats.lessonsCompleted.push({
            type: 'certification',
            tier: tier,
            completedAt: Date.now()
        });
        
        merlin.saveUserProfile();
    }

    async checkCertification(userId, tier) {
        const progress = this.userProgress[userId] || {};
        return progress.certifications?.includes(tier) || false;
    }
}
```

### 3.2 Add Chat Commands for Training

```javascript
// In Merlin's handleUserQuery() method, add:

if (query.toLowerCase().includes('train') || 
    query.toLowerCase().includes('teach') ||
    query.toLowerCase().includes('learn')) {
    
    const tier = this.detectTierRequest(query);
    if (tier) {
        addMessage(`Starting ${tier} training course...`, 'merlin');
        const result = await merlin.trainingModule.startTraining(
            merlin.userProfile.userId,
            tier
        );
        addMessage(result.message, 'merlin');
    }
}
```

---

## Module 4: Machine Investment Pools

### 4.1 Add to MerlinPersonality

```javascript
class MachineInvestmentPool {
    constructor(machineId, machineOwner, fundingTarget) {
        this.machineId = machineId;
        this.machineOwner = machineOwner;
        this.fundingTarget = fundingTarget;
        this.investors = {};
        this.totalRaised = 0;
        this.cumulativeRevenue = 0;
    }

    async buyShares(investorWallet, numShares) {
        const shareCost = this.fundingTarget / 100; // 100 shares total
        const investmentAmount = numShares * shareCost;
        
        if (this.totalRaised + investmentAmount > this.fundingTarget) {
            return { success: false, error: 'Exceeds funding target' };
        }

        this.investors[investorWallet] = {
            shares: numShares,
            investmentAmount: investmentAmount,
            dateInvested: Date.now(),
            dividendsEarned: 0
        };

        this.totalRaised += investmentAmount;

        console.log(`💰 ${investorWallet} bought ${numShares} shares for ${investmentAmount} gems`);
        
        return {
            success: true,
            sharesOwned: numShares,
            sharePrice: shareCost,
            fundingPercentage: (this.totalRaised / this.fundingTarget * 100).toFixed(1)
        };
    }

    async distributeRevenue(revenue) {
        // Split revenue: 60% to machine owner, 40% to investors
        const ownerShare = revenue * 0.60;
        const investorShare = revenue * 0.40;

        // Distribute to investors proportionally
        const totalShares = Object.values(this.investors).reduce((sum, inv) => sum + inv.shares, 0);
        
        for (const [wallet, investor] of Object.entries(this.investors)) {
            const proportion = investor.shares / totalShares;
            const dividendPayment = investorShare * proportion;
            
            investor.dividendsEarned += dividendPayment;
            
            console.log(`💎 ${wallet} earned ${dividendPayment} gems from machine revenue`);
        }

        this.cumulativeRevenue += revenue;

        return {
            machineOwnerPayment: ownerShare,
            investorPayments: this.getInvestorPayments(),
            totalDistributed: revenue
        };
    }

    getInvestorPayments() {
        const payments = {};
        for (const [wallet, investor] of Object.entries(this.investors)) {
            const totalShares = Object.values(this.investors).reduce((sum, inv) => sum + inv.shares, 0);
            const proportion = investor.shares / totalShares;
            const payment = this.cumulativeRevenue * 0.40 * proportion;
            payments[wallet] = payment;
        }
        return payments;
    }

    calculateROI(investorWallet) {
        const investor = this.investors[investorWallet];
        if (!investor) return 0;

        const roi = ((investor.dividendsEarned / investor.investmentAmount) * 100).toFixed(2);
        return parseFloat(roi);
    }

    getPoolStatus() {
        return {
            machineId: this.machineId,
            fundingTarget: this.fundingTarget,
            totalRaised: this.totalRaised,
            fundingPercentage: (this.totalRaised / this.fundingTarget * 100).toFixed(1),
            numInvestors: Object.keys(this.investors).length,
            cumulativeRevenue: this.cumulativeRevenue,
            investors: this.investors
        };
    }
}

// In MerlinPersonality constructor, add:
this.machineInvestmentPools = {
    'machine_1': new MachineInvestmentPool('machine_1', 'owner_1', 1000),
    'machine_2': new MachineInvestmentPool('machine_2', 'owner_2', 1500),
    'machine_3': new MachineInvestmentPool('machine_3', 'owner_3', 1200)
};
```

---

## Module 5: Gemstone Marketplace

### 5.1 Add to MerlinPersonality

```javascript
class GemstoneMarketplace {
    constructor() {
        this.listings = [];
        this.sales = [];
    }

    async listStone(sellerWallet, stone, quality, price) {
        const listing = {
            id: `stone_${Date.now()}`,
            seller: sellerWallet,
            stone: stone,
            quality: quality,
            price: price,
            listedAt: Date.now(),
            sold: false
        };

        this.listings.push(listing);
        console.log(`💎 ${seller} listed ${stone} (${quality}) for ${price} gems`);
        
        return listing.id;
    }

    async buyStone(buyerWallet, stoneId) {
        const listing = this.listings.find(l => l.id === stoneId);
        
        if (!listing || listing.sold) {
            return { success: false, error: 'Stone not available' };
        }

        // Transfer gems from buyer to seller
        const transaction = {
            from: buyerWallet,
            to: listing.seller,
            amount: listing.price,
            stoneId: stoneId,
            timestamp: Date.now(),
            status: 'completed'
        };

        this.sales.push(transaction);
        listing.sold = true;

        console.log(`✨ ${buyerWallet} bought ${listing.stone} from ${listing.seller}`);
        
        return {
            success: true,
            stone: listing.stone,
            price: listing.price
        };
    }

    async commissionCustomJewelry(buyerWallet, design, gemstone, designerWallet) {
        // User commissions custom jewelry
        const commission = {
            id: `commission_${Date.now()}`,
            buyer: buyerWallet,
            designer: designerWallet,
            design: design,
            gemstone: gemstone,
            status: 'pending_creation',
            depositAmount: 100, // Design deposit
            createdAt: Date.now()
        };

        console.log(`👑 Commission created: ${design} with ${gemstone}`);
        
        return commission.id;
    }

    getAvailableStones(tier) {
        // Return stones available for this tier
        const tierStones = {
            'Apprentice': ['Quartz', 'Amethyst'],
            'Journeyman': ['Citrine', 'Topaz'],
            'Artisan': ['Garnet', 'Tourmaline'],
            'Master': ['Aquamarine', 'Sapphire', 'Ruby'],
            'Grandmaster': ['Emerald', 'Diamond']
        };

        return this.listings.filter(l => 
            !l.sold && 
            tierStones[tier]?.includes(l.stone)
        );
    }

    getMarketplaceSummary() {
        return {
            totalListings: this.listings.length,
            activeListing: this.listings.filter(l => !l.sold).length,
            totalSales: this.sales.length,
            totalVolume: this.sales.reduce((sum, s) => sum + s.amount, 0),
            topStones: this.getTopStones()
        };
    }

    getTopStones() {
        const stoneCounts = {};
        this.sales.forEach(sale => {
            const stone = this.listings.find(l => l.id === sale.stoneId)?.stone;
            if (stone) stoneCounts[stone] = (stoneCounts[stone] || 0) + 1;
        });
        return stoneCounts;
    }
}

// In MerlinPersonality constructor:
this.marketplace = new GemstoneMarketplace();
```

---

## Module 6: Comprehensive Integration Example

### 6.1 Full Cutting Session Flow

```javascript
// This shows a complete session from user perspective

async function startCuttingSession(userWallet, machineId, gemstoneType) {
    console.log(`🚀 Starting cutting session: ${gemstoneType} on ${machineId}`);

    // 1. Check user certification
    const isCertified = await merlin.trainingModule.checkCertification(
        userWallet,
        `tier_${gemstoneType.toLowerCase()}`
    );
    
    if (!isCertified) {
        addMessage('❌ You must complete training first', 'merlin');
        return;
    }

    // 2. Start live feed
    const feedManager = new LiveFeedManager(machineId, 'cameraFeedLive');
    await feedManager.startFeed();

    // 3. Start blockchain listener
    const sessionStart = Date.now();
    let sessionGemCoins = 0;

    addMessage(`✅ Live feed started. Commands: Send gem coins to control. Example: Send 3 gems to move Y down`, 'merlin');

    // 4. Listen for transactions
    const transactionInterval = setInterval(async () => {
        // Check for pending commands
        if (merlin.blockchain.commandQueue.length > 0) {
            const queuedItem = merlin.blockchain.commandQueue.shift();
            
            // Validate command
            const validation = await merlin.blockchain.validateCommand(
                queuedItem.command,
                merlin.userProfile.gemForge.certification.tier,
                gemstoneType,
                userWallet
            );

            if (validation.isValid) {
                // Execute command
                await merlin.blockchain.executeCommand(queuedItem.command, userWallet);
                
                sessionGemCoins += validation.tieredCost;
                
                // Update UI
                updateSessionDisplay({
                    command: queuedItem.command.name,
                    cost: validation.tieredCost,
                    totalThisSession: sessionGemCoins
                });
            } else {
                // Reject & refund
                addMessage(`⚠️ Command blocked: ${validation.warnings.join(', ')}`, 'merlin');
                await merlin.blockchain.refundTransaction(queuedItem.transaction.hash, validation.warnings[0]);
            }
        }

        // Monitor for completion (timeout after 1 hour)
        const elapsed = Date.now() - sessionStart;
        if (elapsed > 3600000) {
            endCuttingSession(sessionGemCoins, 'quality_high');
            clearInterval(transactionInterval);
        }
    }, 1000);

    return {
        sessionStart: sessionStart,
        machineId: machineId,
        gemstoneType: gemstoneType,
        startGemCoins: merlin.userProfile.gemForge.wallet.balance,
        stoppingInterval: transactionInterval
    };
}

async function endCuttingSession(gemCoinsSpent, cutQuality) {
    console.log(`🏁 Session ended. Gems spent: ${gemCoinsSpent}, Quality: ${cutQuality}`);

    // Record cut completion
    merlin.recordCutCompletion(cutQuality);

    // Calculate machine owner revenue
    const revenue = gemCoinsSpent * 1.5; // 1.5x multiplier for overhead
    
    // Distribute to machine owner + investors
    for (const [machineId, pool] of Object.entries(merlin.machineInvestmentPools)) {
        pool.distributeRevenue(revenue);
    }

    // Award machine owner
    const machineOwner = 'owner_1'; // Should be dynamic
    merlin.earnGemCoins(revenue * 0.60, `Machine operation revenue`);

    // Show summary
    addMessage(`Session Summary:
    ⏱️ Duration: ${(sessionEnd - sessionStart) / 60000} minutes
    💎 Gems spent: ${gemCoinsSpent}
    ⭐ Quality: ${cutQuality}
    🏆 Tier progress: +1 cut toward advancement
    📈 Marketplace value: $150-300 depending on quality`, 'merlin');
}
```

---

## Integration Checklist

### Phase 1: Blockchain (Week 1)
- [ ] Deploy gem coin smart contract (testnet)
- [ ] Create transaction listener (Node.js)
- [ ] Map transaction amounts to commands
- [ ] Test command execution

### Phase 2: Live Feed (Week 2)
- [ ] Set up webcam integration
- [ ] Create status overlay
- [ ] Implement anomaly detection
- [ ] Test beautiful cut detection

### Phase 3: Training (Week 3)
- [ ] Create Sora 2 videos (5+ per tier)
- [ ] Build simulation environment
- [ ] Create certification quizzes
- [ ] Test progression system

### Phase 4: Marketplace (Week 4)
- [ ] Create listing interface
- [ ] Build stone browser
- [ ] Implement commission system
- [ ] Test transactions

### Phase 5: Investment Pools (Week 5)
- [ ] Create pool UI
- [ ] Implement share buying
- [ ] Build dividend distribution
- [ ] Test ROI calculations

---

## Next Steps

1. **Copy these modules** into your GemBot_Control_AI.html
2. **Deploy gem coin contract** on testnet
3. **Test transaction→command flow** with 3 machines
4. **Launch first training course**
5. **Invite beta cutters** (10-15 users)
6. **Monitor KPIs** and iterate

**Timeline**: 4-6 weeks to full integration

---

**Status**: Implementation Guide Complete
**Ready to Code**: YES
**Testing Environment**: Recommended
