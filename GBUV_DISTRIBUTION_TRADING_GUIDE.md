# 💎 GBUV Distribution & AI Agent Trading System Guide

**Author:** Ryan Barbrick / Barbrick Design  
**Contact:** BarbrickDesign@gmail.com  
**Copyright:** © 2024-2025 Ryan Barbrick. All Rights Reserved.

---

## 📋 Overview

The GBUV Distribution & AI Agent Trading System is a comprehensive solution for managing GBUV token distribution, AI agent trading simulation, and creator rewards within the GemBot ecosystem. This system integrates seamlessly with the Solana wallet infrastructure.

### Features

- **GBUV Token Distribution**: Distribute GBUV tokens to AI agents and new players
- **AI Agent Trading**: Simulate automated trading with configurable strategies on pump.fun
- **Creator Rewards**: Award GBUV for gameplay, trading, content creation, and achievements
- **Trading Analytics**: Track performance metrics and trading history
- **Persistent Storage**: All data is stored in localStorage for session persistence

---

## 🚀 Getting Started

### Prerequisites

1. The Solana wallet system must be loaded first (`solana-wallet-system.js`)
2. Open the application in a web browser (e.g., `GemBot_Control_AI.html`)

### Script Loading Order

Ensure scripts are loaded in this order in your HTML:

```html
<script src="./solana-wallet-system.js"></script>
<script src="./gbuv-distribution-trading.js"></script>
```

### Initialization

The system automatically initializes three global instances:

```javascript
window.gbuvDistribution   // GBUVDistributionSystem instance
window.agentTrading       // AIAgentTradingSystem instance
window.creatorRewards     // CreatorRewardsSystem instance
```

---

## 💰 GBUV Distribution System

### Distribute to AI Agents

Distribute GBUV tokens to all registered AI agent wallets:

```javascript
// Distribute 1000 GBUV to each agent
await distributeToAgents('YOUR_ADMIN_WALLET_PUBLIC_KEY', 1000);

// Or use the full API
await window.gbuvDistribution.distributeToAgents('ADMIN_WALLET', 1000);
```

**Output:**
```
🤖 Distributing GBUV to AI agents...
📊 Distribution Plan:
   - Agents: 5
   - Per Agent: 1000 GBUV
   - Total: 5000 GBUV
✅ Distribution complete: 5/5 successful
```

### Distribute to Players

Give welcome bonuses to new players:

```javascript
const playerWallets = [
    'PLAYER_WALLET_1',
    'PLAYER_WALLET_2',
    'PLAYER_WALLET_3'
];

await window.gbuvDistribution.distributeToPlayers(
    'ADMIN_WALLET',
    playerWallets,
    500  // 500 GBUV per player
);
```

### View Distribution History

```javascript
// Get last 50 distributions
const history = window.gbuvDistribution.getDistributionHistory(50);
console.log(history);
```

---

## 📈 AI Agent Trading System

### Register an Agent

Register an AI agent with a trading strategy:

```javascript
// Strategies: 'conservative', 'moderate', 'aggressive'
window.agentTrading.registerAgent(
    'agent-1',                    // Agent ID
    'AGENT_WALLET_PUBLIC_KEY',    // Wallet address
    'aggressive'                   // Trading strategy
);
```

### Trading Strategies

| Strategy      | Trade Freq | Max Trade Size | Target Profit | Stop Loss |
|---------------|-----------|----------------|---------------|-----------|
| Conservative  | 30%       | 10%            | 5%            | 3%        |
| Moderate      | 60%       | 20%            | 10%           | 5%        |
| Aggressive    | 90%       | 30%            | 20%           | 10%       |

### Start/Stop Trading

```javascript
// Start trading
startAgentTrading('agent-1');

// Stop trading
stopAgentTrading('agent-1');
```

### View Trading Statistics

```javascript
// Get stats for all agents
const allStats = getTradingStats();
console.log(allStats);

// Get stats for specific agent
const agentStats = window.agentTrading.getAgentStats('agent-1');
console.log(agentStats);

/*
Example output:
{
    id: 'agent-1',
    wallet: 'WALLET_KEY',
    strategy: {...},
    strategyName: 'aggressive',
    isActive: true,
    totalTrades: 42,
    successfulTrades: 28,
    totalProfit: 156.32,
    successRate: '66.67%',
    avgProfit: '3.72'
}
*/
```

### View Trading History

```javascript
// All trades (last 100)
const allTrades = window.agentTrading.getTradingHistory();

// Specific agent trades
const agentTrades = window.agentTrading.getTradingHistory('agent-1', 50);
```

---

## 🎁 Creator Rewards System

### Reward Types and Rates

| Reward Type   | Rate               | Method                    |
|---------------|--------------------|-----------------------------|
| Gameplay      | 10 GBUV/hour       | `awardGameplayReward()`    |
| Trading       | 5 GBUV/trade       | `awardTradingReward()`     |
| Content       | 100 GBUV/piece     | `awardContentReward()`     |
| Achievement   | 50 GBUV/achieve    | Built into system          |
| Referral      | 1000 GBUV/referral | Existing system            |

### Award Gameplay Rewards

```javascript
// Award for 2.5 hours of gameplay
await window.creatorRewards.awardGameplayReward(
    'PLAYER_WALLET',
    2.5  // hours played
);

// Result: 25 GBUV (2.5 × 10)
```

### Award Trading Rewards

```javascript
// Award for 10 successful trades
await window.creatorRewards.awardTradingReward(
    'PLAYER_WALLET',
    10  // successful trades
);

// Result: 50 GBUV (10 × 5)
```

### Award Content Creation

```javascript
// Award for creating content
await window.creatorRewards.awardContentReward(
    'PLAYER_WALLET',
    'video tutorial'  // content type
);

// Result: 100 GBUV
```

### Process Pending Rewards

Rewards are initially marked as "pending". Process them to distribute:

```javascript
// Check pending rewards
const pending = window.creatorRewards.getPendingTotal();
console.log(`Pending: ${pending.count} rewards, ${pending.total} GBUV`);

// Distribute all pending rewards
const results = await processPendingRewards('ADMIN_WALLET');
console.log(results);
```

### View Reward History

```javascript
// All rewards (last 100)
const allRewards = window.creatorRewards.getRewardHistory();

// Specific player rewards
const playerRewards = window.creatorRewards.getRewardHistory('PLAYER_WALLET', 50);
```

---

## 🔧 Integration Examples

### Complete Workflow Example

```javascript
// 1. Setup: Generate agent wallets
await window.solanaWallet.generateAgentWallets(5);

// 2. Distribute GBUV to agents
await distributeToAgents('ADMIN_WALLET', 1000);

// 3. Register agents for trading
window.agentTrading.registerAgent('agent-1', 'WALLET_1', 'conservative');
window.agentTrading.registerAgent('agent-2', 'WALLET_2', 'moderate');
window.agentTrading.registerAgent('agent-3', 'WALLET_3', 'aggressive');

// 4. Start trading
startAgentTrading('agent-1');
startAgentTrading('agent-2');
startAgentTrading('agent-3');

// 5. Monitor stats (after some time)
setInterval(() => {
    const stats = getTradingStats();
    console.log('Trading Stats:', stats);
}, 60000); // Every minute

// 6. Award player rewards
await window.creatorRewards.awardGameplayReward('PLAYER_WALLET', 1.5);
await window.creatorRewards.awardTradingReward('PLAYER_WALLET', 5);

// 7. Process rewards
await processPendingRewards('ADMIN_WALLET');
```

### Player Onboarding

```javascript
async function onboardNewPlayer(playerWallet) {
    // 1. Welcome bonus
    await window.gbuvDistribution.distributeToPlayers(
        'ADMIN_WALLET',
        [playerWallet],
        500
    );
    
    // 2. First gameplay reward
    await window.creatorRewards.awardGameplayReward(playerWallet, 0.5);
    
    // 3. Process immediately
    await processPendingRewards('ADMIN_WALLET');
    
    console.log(`✅ Player ${playerWallet} onboarded with 525 GBUV`);
}
```

---

## 📊 Data Storage

All system data is stored in localStorage:

- **`gembot_distributions`**: Distribution history
- **`gembot_trades`**: Trading history
- **`gembot_rewards`**: Reward history

### Clear Data (if needed)

```javascript
// Clear distribution history
localStorage.removeItem('gembot_distributions');

// Clear trading history
localStorage.removeItem('gembot_trades');

// Clear rewards
localStorage.removeItem('gembot_rewards');
```

---

## 🔍 Troubleshooting

### Common Issues

1. **"Agent wallets not found"**
   - Solution: Generate agent wallets first with `window.solanaWallet.generateAgentWallets(count)`

2. **"Cannot read property of undefined"**
   - Solution: Ensure `solana-wallet-system.js` loads before `gbuv-distribution-trading.js`

3. **"Agent has no GBUV to trade"**
   - Solution: Distribute GBUV to agents first using `distributeToAgents()`

4. **Rewards not distributing**
   - Solution: Call `processPendingRewards('ADMIN_WALLET')` to execute pending distributions

---

## 📝 API Reference

### GBUVDistributionSystem

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `distributeToAgents()` | `fromWallet`, `amountPerAgent` | `Promise<Object>` | Distribute to all agents |
| `distributeToPlayers()` | `fromWallet`, `playerWallets[]`, `welcomeBonus` | `Promise<Object>` | Distribute to players |
| `getDistributionHistory()` | `limit` | `Array` | Get distribution history |

### AIAgentTradingSystem

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `registerAgent()` | `agentId`, `walletKey`, `strategy` | `Object` | Register trading agent |
| `startTrading()` | `agentId` | `Boolean` | Start agent trading |
| `stopTrading()` | `agentId` | `Boolean` | Stop agent trading |
| `executeTrade()` | `agentId` | `Promise<Object>` | Execute single trade |
| `getAgentStats()` | `agentId` | `Object` | Get agent statistics |
| `getAllStats()` | - | `Array` | Get all agent stats |
| `getTradingHistory()` | `agentId`, `limit` | `Array` | Get trading history |

### CreatorRewardsSystem

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `awardGameplayReward()` | `wallet`, `hoursPlayed` | `Promise<Object>` | Award gameplay GBUV |
| `awardTradingReward()` | `wallet`, `successfulTrades` | `Promise<Object>` | Award trading GBUV |
| `awardContentReward()` | `wallet`, `contentType` | `Promise<Object>` | Award content GBUV |
| `processPendingRewards()` | `fromWallet` | `Promise<Array>` | Distribute pending rewards |
| `getRewardHistory()` | `wallet`, `limit` | `Array` | Get reward history |
| `getPendingTotal()` | - | `Object` | Get pending rewards summary |

---

## 🎯 Quick Reference

```javascript
// === DISTRIBUTION ===
distributeToAgents('ADMIN_WALLET', 1000)
window.gbuvDistribution.distributeToPlayers('ADMIN_WALLET', wallets, 500)

// === TRADING ===
window.agentTrading.registerAgent('agent-1', 'WALLET', 'aggressive')
startAgentTrading('agent-1')
stopAgentTrading('agent-1')
getTradingStats()

// === REWARDS ===
window.creatorRewards.awardGameplayReward('WALLET', 2.5)
window.creatorRewards.awardTradingReward('WALLET', 10)
processPendingRewards('ADMIN_WALLET')
```

---

## 📞 Support

For questions or issues:
- **Email:** BarbrickDesign@gmail.com
- **GitHub:** https://github.com/barbrickdesign/GemBotAiWebControl

---

**Last Updated:** December 2025  
**System Version:** 1.0.0  
**Commit Reference:** fda890c3e86d877ec2615a00a8a5284e1b0f8c5b
