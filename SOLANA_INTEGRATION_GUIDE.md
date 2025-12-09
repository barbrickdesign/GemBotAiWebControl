# Integrating Solana Token with GemBot_Control_AI.html

## Quick Start (5 minutes)

### Step 1: Add Script Reference

In `GemBot_Control_AI.html`, add this line in the `<head>` section:

```html
<script src="GEMBOT_SOLANA_INTEGRATION.js"></script>
```

### Step 2: Connect UI to Token System

Replace your existing session start button with:

```html
<button id="startSessionBtn" onclick="initializeGemBotSession()" class="btn-primary">
    🚀 Start Cutting Session (Token: DPHc...pump)
</button>
<button id="stopSessionBtn" onclick="endGemBotSession()" class="btn-primary" disabled>
    ⏹️ End Session
</button>
<button id="emergencyBtn" onclick="gemBotController.emergencyStop()" class="btn-danger">
    🛑 EMERGENCY STOP
</button>
```

### Step 3: Add Session Control JavaScript

```javascript
async function initializeGemBotSession() {
    console.log('🎬 Initializing GemBot session with Solana integration...');
    
    // Verify Phantom wallet is connected
    if (!window.solana) {
        alert('❌ Please install Phantom wallet first');
        return;
    }
    
    try {
        // Start the cutting session
        await window.gemBotController.startCuttingSession();
        
        // Update UI
        document.getElementById('startSessionBtn').disabled = true;
        document.getElementById('stopSessionBtn').disabled = false;
        
        // Show transaction waiting message
        displayMessage(
            '🎧 Listening for transactions...\n' +
            'Send gems to: ' + window.gemBotController.VAULT_WALLET + '\n' +
            'Each gem amount = different command',
            'info'
        );
        
    } catch (error) {
        console.error('Session initialization failed:', error);
        alert('Failed to start session: ' + error.message);
    }
}

function endGemBotSession() {
    const reward = window.gemBotController.endSession();
    
    // Update UI
    document.getElementById('startSessionBtn').disabled = false;
    document.getElementById('stopSessionBtn').disabled = true;
    
    // Show session summary
    displaySessionReward(reward);
}

function displaySessionReward(reward) {
    const message = `
        🏆 SESSION COMPLETE! 🏆
        
        ⏱️  Duration: ${reward.duration.toFixed(1)} minutes
        💎 Gems Earned: ${reward.gemsEarned}
        ✨ Cut Quality: ${reward.quality.toFixed(1)}%
        💰 Revenue Generated: $${reward.revenue.toFixed(2)}
        
        Your vault: ${window.gemBotController.VAULT_WALLET}
        Token: ${window.gemBotController.TOKEN_ADDRESS}
    `;
    
    displayMessage(message, 'success');
}

function displayMessage(text, type = 'info') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${type}`;
    msgDiv.textContent = text;
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 20px;
        border-radius: 5px;
        z-index: 10000;
        max-width: 400px;
        font-family: monospace;
        white-space: pre-wrap;
    `;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => msgDiv.remove(), 5000);
}
```

---

## Command Mapping Reference

When users send tokens to the vault, different amounts trigger different commands:

```
1 Gem  → Y Axis Down        (Cost: 1 gem,  Tier: Apprentice)
2 Gems → Y Axis Up          (Cost: 1 gem,  Tier: Apprentice)
3 Gems → X Axis Left        (Cost: 1 gem,  Tier: Apprentice)
4 Gems → X Axis Right       (Cost: 1 gem,  Tier: Apprentice)
5 Gems → Spindle +1000 RPM  (Cost: 5 gems, Tier: Apprentice)
6 Gems → Spindle -1000 RPM  (Cost: 5 gems, Tier: Apprentice)
10 Gems → Precision Mode    (Cost: 10 gems, Tier: Journeyman)
11 Gems → Speed Boost       (Cost: 10 gems, Tier: Journeyman)
20 Gems → AI Assisted Cut   (Cost: 20 gems, Tier: Artisan)
```

---

## Integration with Existing Merlin AI

Add this to your Merlin AI class to support token queries:

```javascript
// In your Merlin AI class, add this method:

async handleTokenQuery(query) {
    if (query.includes('token') || query.includes('send') || query.includes('transaction')) {
        return `
            💎 TOKEN CONTROL SYSTEM
            
            Token Address: ${window.gemBotController.TOKEN_ADDRESS}
            
            ✅ TO CONTROL THE MACHINE:
            1. Open Phantom wallet
            2. Send gems to: ${window.gemBotController.VAULT_WALLET}
            3. The amount you send = command executed:
               - 1 gem = Move Y axis down
               - 2 gems = Move Y axis up
               - 3 gems = Move X axis left
               - 4 gems = Move X axis right
               - 5 gems = Spindle +1000 RPM
               - etc.
            
            💡 TIPS:
            - Each command must match your certification tier
            - Transaction confirms within 3 seconds
            - Failed commands automatically refund
            - Beautiful cuts earn +5 bonus gems
            
            🔗 Trade Token: ${this.gemBotController.PUMP_FUN_URL}
            📊 View on Explorer: ${this.gemBotController.SOLSCAN_URL}
        `;
    }
}
```

---

## Live Feed Integration

Add this HTML structure for the live feed:

```html
<div id="liveStreamContainer" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
    
    <!-- Video Feed -->
    <div style="position: relative;">
        <video id="livestream" 
               style="width: 100%; border: 2px solid #FFD700; border-radius: 10px;" 
               autoplay playsinline>
        </video>
        <div id="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color: white; font-family: monospace; pointer-events: none;"></div>
    </div>
    
    <!-- Stats Panel -->
    <div id="statsPanel" style="background: #1a1a1a; border: 2px solid #FFD700; border-radius: 10px; padding: 20px; overflow-y: auto;">
        <h3>📊 Session Stats</h3>
        <div id="sessionStats" style="font-family: monospace; line-height: 1.8;">
            <div>⏱️  Duration: <span id="duration">0:00</span></div>
            <div>💎 Commands: <span id="commandCount">0</span></div>
            <div>💰 Revenue: $<span id="revenue">0.00</span></div>
            <div>✨ Quality: <span id="quality">0%</span></div>
            <div>🌡️  Temp: <span id="temperature">0°C</span></div>
            <div>⚙️  Spindle: <span id="spindle">0 RPM</span></div>
            <div>📍 Position: X:<span id="posX">0</span> Y:<span id="posY">0</span></div>
        </div>
        
        <h3 style="margin-top: 20px;">🎯 Recent Commands</h3>
        <div id="commandLog" style="max-height: 200px; overflow-y: auto; font-size: 0.9em;">
            <!-- Commands logged here -->
        </div>
    </div>
</div>
```

Update stats in real-time:

```javascript
// Add this to your session loop
setInterval(() => {
    if (!window.gemBotController.sessionActive) return;
    
    const duration = (Date.now() - window.gemBotController.sessionData.startTime) / 1000;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    
    document.getElementById('duration').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('commandCount').textContent = window.gemBotController.sessionData.commandCount;
    document.getElementById('temperature').textContent = window.gemBotController.machineStatus.temperature?.toFixed(1) || '0';
    document.getElementById('spindle').textContent = Math.round(window.gemBotController.machineStatus.spindle_rpm || 0);
    document.getElementById('posX').textContent = window.gemBotController.machineStatus.x_position?.toFixed(1) || '0';
    document.getElementById('posY').textContent = window.gemBotController.machineStatus.y_position?.toFixed(1) || '0';
}, 100);
```

---

## Connecting to Arduino SerialPort

The integration automatically connects to your Arduino:

```javascript
// In GemBot_Control_AI.html, add to your Arduino initialization:

async function initializeArduinoWithToken() {
    try {
        // Get port
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        
        // Connect to GemBot controller
        window.gemBotController.serialPort = port;
        
        console.log('✅ Arduino connected to token system');
    } catch (error) {
        console.error('Failed to initialize Arduino:', error);
    }
}

// Call this before starting session
await initializeArduinoWithToken();
```

---

## Testing the Integration

### 1. Test Transaction Listening
```javascript
// In browser console:
gemBotController.startTransactionListener();
// Now send a test transaction from Phantom wallet
```

### 2. Test Command Execution
```javascript
// Simulate a command:
const testCommand = gemBotController.commandMapping[5];
await gemBotController.executeCommand(testCommand, 'test_tx_signature');
```

### 3. Test Emergency Stop
```javascript
// Trigger emergency stop:
await gemBotController.emergencyStop();
```

### 4. View Live Status
```javascript
// Check machine status:
console.log(gemBotController.machineStatus);

// Check transaction history:
console.log(gemBotController.transactionHistory);

// Check session data:
console.log(gemBotController.sessionData);
```

---

## Production Checklist

- [ ] Install Phantom wallet extension
- [ ] Add GEMBOT_SOLANA_INTEGRATION.js to project
- [ ] Update HTML with token buttons and live feed UI
- [ ] Test transaction listening on Solana devnet
- [ ] Connect Arduino SerialPort
- [ ] Test all command mappings
- [ ] Test emergency stop procedures
- [ ] Add error logging and monitoring
- [ ] Configure vault wallet for production
- [ ] Set up transaction monitoring dashboard

---

## Token Economics

**Platform Revenue Model:**
```
User pays X gems → Machine executes command
    ↓
60% to machine owner
40% to investor pool
    ↓
Platform fee: 5% (goes to vault wallet)
    ↓
Revenue flows back to:
    - Merlin AI improvements
    - Sora 2 video generation
    - New feature development
    - Community incentives
```

**Example Session:**
```
User sends 5 gems to vault
↓
Executed: Spindle +1000 RPM
↓
Revenue generated: $2.50
↓
Machine owner: $1.50
Investors: $1.00
Platform: $0.25
```

---

## Support & Monitoring

### Monitor Transaction Status
```javascript
// Check for stuck transactions
setInterval(() => {
    const pending = gemBotController.pendingTransactions;
    if (pending.length > 10) {
        console.warn('⚠️  Many pending transactions. Check network.');
    }
}, 5000);
```

### Error Tracking
```javascript
// Log all errors to dashboard
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
    // Send to error tracking service
});
```

### User Support Links
- **Trade Token:** https://pump.fun/coin/DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump
- **View Explorer:** https://solscan.io/token/DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump
- **Vault Wallet:** 6HTjfgWZYMbENnMAJJFhxWR2VZDxdze3qV7zznSAsfk

---

## Next Steps

1. ✅ Copy `GEMBOT_SOLANA_INTEGRATION.js` to your project
2. ✅ Update `GemBot_Control_AI.html` with token buttons
3. ✅ Test on Solana devnet (free transactions)
4. ✅ Train beta users on token control system
5. ✅ Deploy to production with mainnet-beta
6. ✅ Monitor transaction throughput and errors

**You're now ready to control GemBot machines with Solana tokens!** 🚀💎
