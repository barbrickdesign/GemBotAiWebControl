# 🤖 Local Claude LLM Integration with $GBUV Gas Fees

## Overview

This system integrates a local Claude API instance with the GemBot ecosystem, charging $GBUV tokens as "gas fees" for AI-powered responses. Users pay for better AI responses while maintaining full control over the local instance.

## Features

✅ **Local Claude Instance** - Run Claude locally for privacy and control  
✅ **$GBUV Gas Fees** - Pay tokens for AI responses (gas fee model)  
✅ **Merlin Personality** - Maintains wizard mentor character  
✅ **Smart Fallback** - Falls back to basic Q&A if Claude unavailable  
✅ **Automatic Balance Check** - Verifies sufficient tokens before API call  
✅ **Retry Logic** - Handles network issues gracefully  
✅ **Usage Statistics** - Track calls, success rate, and gas spent  

## Setup

### 1. Local Claude API Endpoint

First, ensure your local Claude instance is running:

```bash
# Example: Start local Claude server
# (Replace with your actual Claude setup command)
claude-server --port 8000 --model claude-3-sonnet
```

The endpoint should respond to:
- `GET /health` - Health check
- `POST /v1/chat` - Chat completion

### 2. Add Script to HTML

Include the integration script in your HTML:

```html
<!-- Load after marketplace but before Merlin -->
<script src="claude-local-integration.js"></script>
```

### 3. Initialize Integration

```javascript
// Initialize with default settings
const claudeAI = new ClaudeLocalIntegration({
    claudeEndpoint: 'http://localhost:8000',
    gasFeePerCall: 10, // 10 $GBUV tokens per call
    fallbackToBasic: true // Use basic Q&A if Claude unavailable
});

// Make globally available
window.claudeAI = claudeAI;
```

## Configuration Options

```javascript
const config = {
    // Local Claude API endpoint
    claudeEndpoint: 'http://localhost:8000',
    
    // API path for chat completion
    apiPath: '/v1/chat',
    
    // Gas fee in $GBUV tokens per API call
    gasFeePerCall: 10,
    
    // Token contract address
    tokenAddress: 'DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump',
    
    // Number of retries on failure
    maxRetries: 3,
    
    // Timeout in milliseconds
    timeout: 30000,
    
    // Fall back to basic Q&A if Claude unavailable
    fallbackToBasic: true
};
```

## Usage

### Basic Question

```javascript
// Ask Claude a question (costs gas)
const response = await claudeAI.askClaude(
    "How do I polish a sapphire?",
    {
        playerLevel: 5,
        currentStone: 'Sapphire',
        recentActions: ['cutting', 'shaping']
    }
);

// Display response
console.log(response);
```

### With Merlin Integration

```javascript
// In your game's Q&A handler
async function handlePlayerQuestion(question) {
    try {
        // Get player context
        const context = {
            playerLevel: game.state.player.level,
            currentStone: currentMachine?.currentStone?.gem?.name,
            recentActions: getRecentActions(),
            struggles: game.intelligence?.playerBehavior?.strugglingWith
        };
        
        // Ask Claude (charges gas automatically)
        const response = await window.claudeAI.askClaude(question, context);
        
        // Speak through Merlin
        game.merlinSpeak(response);
        
    } catch (error) {
        if (error.message.includes('Insufficient')) {
            game.merlinSpeak("My powers require $GBUV tokens to channel, young apprentice. You need more tokens!");
        } else {
            game.merlinSpeak("The mystical energies are disrupted. Let me consult my ancient scrolls instead...");
        }
    }
}
```

## Gas Fee System

### How It Works

1. **User asks question** → System checks $GBUV balance
2. **Balance sufficient** → Calls local Claude API
3. **Response received** → Charges gas fee from user's wallet
4. **Response delivered** → User receives AI-powered answer

### Balance Checking

```javascript
// Check if user has enough tokens
const hasBalance = await claudeAI.checkGasBalance();

if (hasBalance) {
    console.log("✅ User has sufficient $GBUV for gas");
} else {
    console.log("❌ Insufficient $GBUV balance");
}
```

### Manual Gas Charging

```javascript
// Charge custom amount
try {
    await claudeAI.chargeGasFee(null, 20); // Charge 20 $GBUV
    console.log("Gas fee charged successfully");
} catch (error) {
    console.error("Failed to charge gas:", error);
}
```

## Events

Listen for gas fee events:

```javascript
window.addEventListener('gembot:gas-fee-charged', (event) => {
    const { amount, previousBalance, newBalance, timestamp } = event.detail;
    
    console.log(`⛽ Gas charged: ${amount} $GBUV`);
    console.log(`Balance: ${previousBalance} → ${newBalance}`);
    
    // Update UI
    updateTokenDisplay(newBalance);
});
```

## Statistics

Track usage and spending:

```javascript
const stats = claudeAI.getStats();

console.log('Claude AI Stats:', {
    available: stats.available,          // Is API available?
    totalCalls: stats.totalCalls,        // Total successful calls
    failedCalls: stats.failedCalls,      // Failed attempts
    successRate: stats.successRate,      // Success percentage
    totalGasPaid: stats.totalGasPaid,    // Total $GBUV spent
    gasFeePerCall: stats.gasFeePerCall,  // Cost per call
    lastCheck: stats.lastCheck           // Last availability check
});

// Display in UI
document.getElementById('claude-stats').innerHTML = `
    <div>Total AI Calls: ${stats.totalCalls}</div>
    <div>Success Rate: ${stats.successRate}</div>
    <div>Total Gas Paid: ${stats.totalGasPaid} $GBUV</div>
    <div>Status: ${stats.available ? '✅ Online' : '⚠️ Offline'}</div>
`;
```

## Fallback System

When Claude is unavailable or user lacks tokens:

```javascript
// Automatically falls back to basic Q&A
const response = await claudeAI.askClaude("How do I cut a diamond?");

// If Claude unavailable:
// → Uses window.MerlinEnhancedResponses
// → Returns pre-written answer
// → No gas fee charged
```

## Benefits

### For Users
- 🧠 **Smarter Responses** - AI-powered answers vs. scripted
- 💡 **Context-Aware** - Understands your situation
- 🎯 **Personalized** - Adapts to your level and needs
- 🔒 **Privacy** - Runs locally, not cloud-based
- 💰 **Optional** - Can still use basic Q&A

### For Developers
- 💸 **Monetization** - Gas fees create token demand
- 🎮 **Enhanced Gameplay** - Better AI = better experience
- 🛡️ **Rate Limiting** - Gas fees prevent spam
- 📊 **Analytics** - Track AI usage patterns
- 🔌 **Flexible** - Easy to adjust fees or disable

## API Response Format

Claude API should return JSON:

```json
{
    "content": [
        {
            "text": "Ah, young apprentice! To polish a sapphire..."
        }
    ]
}
```

Or alternative formats:
```json
{ "message": "Response text..." }
{ "response": "Response text..." }
```

## Error Handling

```javascript
try {
    const response = await claudeAI.askClaude(question, context);
    
} catch (error) {
    if (error.message.includes('Insufficient')) {
        // User needs more $GBUV tokens
        showTokenShop();
        
    } else if (error.message.includes('not available')) {
        // Claude API is down
        useFallback();
        
    } else {
        // Other error
        console.error('Claude error:', error);
    }
}
```

## Testing

### 1. Check Availability
```javascript
const available = await claudeAI.checkAvailability();
console.log('Claude available:', available);
```

### 2. Test Question (Free)
```javascript
// Temporarily disable gas fee for testing
claudeAI.config.gasFeePerCall = 0;

const response = await claudeAI.askClaude("Test question");
console.log('Response:', response);

// Restore gas fee
claudeAI.config.gasFeePerCall = 10;
```

### 3. Test Balance Check
```javascript
// Give user demo tokens
marketplace.wallet.tokenBalance = 100;

const hasBalance = await claudeAI.checkGasBalance();
console.log('Has balance:', hasBalance);
```

## Pricing Examples

Adjust gas fees based on your economy:

```javascript
// Free tier (demo mode)
gasFeePerCall: 0

// Basic tier
gasFeePerCall: 5

// Standard tier (default)
gasFeePerCall: 10

// Premium tier
gasFeePerCall: 25

// Enterprise tier
gasFeePerCall: 50
```

## Troubleshooting

### Claude API Not Available
```
⚠️ Local Claude API not available: Failed to fetch
```
**Solution**: Ensure Claude server is running on correct port

### Insufficient Balance
```
❌ Insufficient $GBUV balance: 5 < 10
```
**Solution**: User needs to buy more $GBUV tokens

### Timeout Errors
```
Attempt 3 failed: timeout
```
**Solution**: Increase timeout or check Claude server performance

## Integration Checklist

- [ ] Local Claude API running on localhost:8000
- [ ] Health endpoint (`/health`) responding
- [ ] Chat endpoint (`/v1/chat`) accepting POST requests
- [ ] Marketplace initialized with $GBUV tokens
- [ ] User has token balance for testing
- [ ] Script loaded after marketplace
- [ ] Integration initialized in code
- [ ] Error handling implemented
- [ ] UI updated to show gas fees
- [ ] Statistics display working

## Next Steps

1. **Start Local Claude** - Get your instance running
2. **Configure Endpoint** - Set correct URL and port
3. **Test Connection** - Verify health check works
4. **Add Demo Tokens** - Give users initial $GBUV
5. **Integrate with Merlin** - Connect to Q&A system
6. **Monitor Usage** - Track stats and costs
7. **Adjust Pricing** - Optimize gas fees for your economy

## Support

For issues or questions:
- Check console for error messages
- Verify Claude API is running: `curl http://localhost:8000/health`
- Check user token balance in marketplace
- Review integration statistics
- Test fallback system

---

**Remember**: Users must have $GBUV tokens to use Claude AI. Make tokens available through:
- Gameplay rewards
- Token shop purchases
- Daily login bonuses
- Achievement rewards
