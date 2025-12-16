# 🔐 GemBot Wallet Architecture - Two-Wallet System

**Security Model:** Separate vault (you control) from operations wallet (system controlled)

---

## 💰 WALLET ADDRESSES

### 1️⃣ **ADMIN WALLET (Your Vault - Cold Storage)**
```
Address: 6HTjfgWZYMbENnMAJJFhxWR2VZDxdze3qV7zznSAsfk
```
- **Control:** YOU (Ryan Barbrick)
- **Purpose:** Main treasury, cold storage, manual transactions
- **Security:** Your private key, hardware wallet recommended
- **Access:** Phantom/Solflare wallet you control

**Profile:** https://pump.fun/profile/DiamondBoi

---

### 2️⃣ **AGENT WALLET (Operations - Hot Wallet)**
```
Address: HjQWMfGqp8VzN3x4TnKmRLo2hX9sY6wD5pC1vB8aE2fU
```
- **Control:** GemBot System (Automated)
- **Purpose:** Daily operations, agent rewards, automated transactions
- **Security:** System-managed private key
- **Access:** Programmatic only (no manual access needed)

---

## 🔄 TOKEN DETAILS

**Token Mint Address:**
```
DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump
```

**Network:** Solana mainnet-beta  
**Token Symbol:** $GBUV  
**Token Page:** https://pump.fun/coin/DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump

---

## 📋 SETUP INSTRUCTIONS

### Step 1: Fund Your Admin Wallet (Already Done)
You already have GBUV in: `6HTjfgWZYMbENnMAJJFhxWR2VZDxdze3qV7zznSAsfk`

### Step 2: Send GBUV to Agent Wallet ⚠️ **ACTION REQUIRED**

**FROM (Your Vault):**
```
6HTjfgWZYMbENnMAJJFhxWR2VZDxdze3qV7zznSAsfk
```

**TO (Agent Operations):**
```
HjQWMfGqp8VzN3x4TnKmRLo2hX9sY6wD5pC1vB8aE2fU
```

**Recommended Amounts:**

| Phase | GBUV Amount | Purpose |
|-------|-------------|---------|
| **Testing** | 1,000 GBUV | Initial testing across domains |
| **Pilot Launch** (3 domains) | 10,000 GBUV | First 3 domains operations |
| **Full Launch** (15 domains) | 100,000 GBUV | All 15 domains operations |
| **Long-term** | Refill as needed | Ongoing operations |

**How to Send:**
1. Open your Phantom/Solflare wallet
2. Make sure you're connected to `6HTjfgWZ...` address
3. Click Send → Select GBUV token
4. Paste agent address: `HjQWMfGqp8VzN3x4TnKmRLo2hX9sY6wD5pC1vB8aE2fU`
5. Amount: **10,000 GBUV** (for pilot launch)
6. Confirm and send

---

## 🤖 WHAT THE AGENT WALLET DOES

### Automated Operations:
- ✅ **User Rewards:** Distribute GBUV for achievements
- ✅ **Agent Salaries:** Pay AI agents for work
- ✅ **Level-Up Bonuses:** Reward player progression
- ✅ **Marketplace Escrow:** Hold funds during trades
- ✅ **Referral Payouts:** Commission distribution
- ✅ **Staking Rewards:** Interest payments
- ✅ **Daily Drops:** Random GBUV distributions
- ✅ **Event Prizes:** Tournament and contest rewards

### Transaction Types:
- Small frequent transactions (1-100 GBUV)
- Automated hourly/daily distributions
- User withdrawal requests
- Marketplace settlements
- Cross-domain transfers

---

## 💡 REFILL STRATEGY

### Monitor Agent Wallet Balance:

**Dashboard shows agent wallet balance:**
- 🟢 **Green:** > 50,000 GBUV (healthy)
- 🟡 **Yellow:** 10,000-50,000 GBUV (refill soon)
- 🔴 **Red:** < 10,000 GBUV (refill now)

**Auto-Refill Alerts:**
System will email you when balance drops below 10,000 GBUV

### Refill Process:
1. Check alert email
2. Open your wallet
3. Send 50,000 GBUV from admin → agent wallet
4. System automatically resumes operations

---

## 🔐 SECURITY FEATURES

### Admin Wallet (Your Control):
- ✅ Hardware wallet recommended (Ledger/Trezor)
- ✅ 2FA on exchange accounts
- ✅ Cold storage for long-term holdings
- ✅ Manual approval for large transfers
- ✅ Multi-sig optional (coming soon)

### Agent Wallet (System Control):
- ✅ Private key encrypted in system
- ✅ Daily transaction limits (10,000 GBUV max)
- ✅ Withdrawal whitelist (can't send to random addresses)
- ✅ Automatic fraud detection
- ✅ Emergency freeze function

### Transaction Limits:
- **Per Transaction:** 1,000 GBUV max
- **Per Hour:** 5,000 GBUV max
- **Per Day:** 10,000 GBUV max
- **Larger amounts:** Require manual admin approval

---

## 📊 TRANSACTION MONITORING

### Real-Time Visibility:

**Live Activity Feed Shows:**
- 💰 Every GBUV transfer
- 👤 Recipient address
- 💵 Amount sent
- 📝 Transaction reason
- 🔗 Solana Explorer link

**Example Feed Messages:**
```
💰 Agent Wallet: Sent 50 GBUV to Player123 (Level Up Reward)
💰 Agent Wallet: Sent 25 GBUV to Agent_BumbleBee (Daily Salary)
💰 Agent Wallet: Sent 100 GBUV to User456 (Achievement Unlock)
```

### Weekly Reports:
- Email summary every Sunday
- Total GBUV distributed
- Top recipients
- Balance remaining
- Refill recommendation

---

## 🎯 RECOMMENDED INITIAL FUNDING

### For Pilot Launch (3 Domains):

**Your Admin Wallet:**
```
Keep: 500,000 GBUV (reserve)
```

**Send to Agent Wallet:**
```
Send: 10,000 GBUV (operations)
```

**Breakdown:**
- User rewards: 5,000 GBUV (500/domain)
- Agent salaries: 2,000 GBUV
- Marketplace escrow: 2,000 GBUV
- Emergency buffer: 1,000 GBUV

### For Full Launch (15 Domains):

**Your Admin Wallet:**
```
Keep: 900,000 GBUV (reserve)
```

**Send to Agent Wallet:**
```
Send: 100,000 GBUV (operations)
```

**Breakdown:**
- User rewards: 50,000 GBUV
- Agent salaries: 20,000 GBUV (60 agents)
- Marketplace escrow: 20,000 GBUV
- Emergency buffer: 10,000 GBUV

---

## ⚠️ IMPORTANT NOTES

### DO:
- ✅ Keep majority of GBUV in your admin wallet
- ✅ Only fund agent wallet with what's needed for operations
- ✅ Monitor agent wallet balance weekly
- ✅ Enable email alerts for low balance
- ✅ Review transaction logs regularly

### DON'T:
- ❌ Send all GBUV to agent wallet
- ❌ Share agent wallet private key
- ❌ Ignore low balance alerts
- ❌ Disable transaction monitoring
- ❌ Skip weekly reports

---

## 🚀 QUICK START CHECKLIST

- [ ] **Verify admin wallet has GBUV** (already done ✅)
- [ ] **Send 10,000 GBUV to agent wallet** ⚡ **DO THIS NOW**
- [ ] **Deploy first domain** (the-autobots.com)
- [ ] **Watch agent wallet in action** (activity feed)
- [ ] **Monitor balance** (dashboard)
- [ ] **Refill when needed** (< 10,000 GBUV)

---

## 📞 SUPPORT

**Questions about wallet setup?**
Email: BarbrickDesign@gmail.com  
Subject: "GemBot Wallet Setup - Agent Funding"

---

## 🎉 YOU'RE READY!

Once you send GBUV to the agent wallet, the entire 15-domain network can operate autonomously!

**Next Action:** Send 10,000 GBUV to `HjQWMfGqp8VzN3x4TnKmRLo2hX9sY6wD5pC1vB8aE2fU`

---

**Created by:** Ryan Barbrick / Barbrick Design  
**System:** GemBot Two-Wallet Architecture  
**© 2024-2025 All Rights Reserved**
