# 🛡️ ANTI-FRAUD SECURITY - QUICK REFERENCE

## 🚨 INSTANT SECURITY STATUS CHECK

Open browser console (F12) and run:

```javascript
// View all wallets with security scores
const wallets = JSON.parse(localStorage.getItem('gembot_wallets') || '{}');
const securityReport = Object.values(wallets).map(w => ({
    username: w.username,
    email: w.email,
    bonus: w.welcomeBonus || 100,
    score: w.security?.score || 0,
    flagged: w.security?.flagged ? '⚠️ YES' : '✅ NO'
}));
console.table(securityReport);
```

---

## 📊 DETECTION THRESHOLDS

| Score | Status | Bonus | Action |
|-------|--------|-------|--------|
| 0-49 | 🟢 **SAFE** | 100 GBUV | Account approved |
| 50-79 | 🟡 **FLAGGED** | 10 GBUV | Reduced bonus + review |
| 80-100 | 🔴 **BLOCKED** | 0 GBUV | Registration prevented |

---

## 🔍 RISK FACTORS

### IP Address (+50 points max)
- 5+ accounts from IP: **+30**
- 3-4 accounts: **+20**
- 2 accounts: **+10**
- VPN detected: **+15**
- Proxy detected: **+15**
- Tor detected: **+20**
- Datacenter IP: **+10**

### Device Fingerprint (+30 points max)
- 3+ accounts from device: **+30**
- 2 accounts: **+20**

### Email Pattern (+25 points max)
- Disposable email (tempmail, guerrillamail): **+25**
- Sequential pattern (user1@, user2@): **+15**
- Suspicious keywords (test, fake, bot): **+10**
- Temp mail domain: **+20**

### Behavior (+20 points max)
- Bot-like mouse movements: **+10**
- Perfect keyboard timing: **+5**
- Less than 10 seconds on site: **+10**
- Less than 3 interactions: **+10**

### Rate Limiting (+20 points)
- Registration within 5 minutes: **+20**

---

## 🧪 TESTING SCENARIOS

### Test 1: Normal User (100 GBUV)
```javascript
Username: alice
Email: alice@gmail.com
Expected Score: 0-20
Bonus: 100 GBUV ✅
```

### Test 2: Second Account (100 GBUV)
```javascript
Username: bob
Email: bob@outlook.com
Expected Score: 10-30
Bonus: 100 GBUV ✅
```

### Test 3: Third Account (10 GBUV)
```javascript
Username: charlie
Email: test123@tempmail.com
Expected Score: 50-70
Bonus: 10 GBUV ⚠️
```

### Test 4: Fourth Account (BLOCKED)
```javascript
Username: dave
Email: bot5@throwaway.email
Expected Score: 80-100
Result: ❌ "Security violation detected"
```

---

## 🔧 ADMIN COMMANDS

### View Flagged Accounts
```javascript
const flagged = Object.values(wallets).filter(w => w.security?.flagged);
console.table(flagged.map(w => ({
    user: w.username,
    score: w.security.score,
    bonus: w.welcomeBonus,
    created: new Date(w.created).toLocaleString()
})));
```

### View IP Tracking Data
```javascript
const ipData = JSON.parse(localStorage.getItem('ip_tracking') || '{}');
console.log('Accounts per IP:', 
    Object.entries(ipData).map(([ip, accounts]) => 
        `${ip}: ${accounts.length} accounts`
    )
);
```

### View Device Fingerprints
```javascript
const prints = JSON.parse(localStorage.getItem('fingerprint_tracking') || '{}');
console.log('Accounts per device:', 
    Object.entries(prints).map(([fp, accounts]) => 
        `${fp.substring(0,16)}...: ${accounts.length} accounts`
    )
);
```

### Check Current Device Fingerprint
```javascript
const fp = await window.securitySystem.generateDeviceFingerprint();
console.log('Your device fingerprint:', fp);
```

### Manually Grant Bonus (False Positive)
```javascript
const wallet = window.walletFactory.getWalletByUsername('username');
await window.walletFactory.rewardUser(
    wallet.publicKey, 
    90,  // Remainder to reach 100 GBUV
    'Manual review - false positive'
);
```

### Clear All Security Data (Testing Only)
```javascript
localStorage.removeItem('ip_tracking');
localStorage.removeItem('fingerprint_tracking');
localStorage.removeItem('mouse_tracking');
localStorage.removeItem('keyboard_timing');
localStorage.removeItem('interaction_count');
localStorage.removeItem('session_start');
localStorage.removeItem('last_registration_attempt');
console.log('✅ Security data cleared');
```

---

## ⚙️ CONFIGURATION

**File:** `anti-fraud-system.js`

```javascript
// Adjust these values in constructor:
this.maxAccountsPerIP = 3;        // Max accounts per IP
this.maxAccountsPerDevice = 2;    // Max accounts per device
this.suspicionThreshold = 50;     // Score for reduced bonus
this.banThreshold = 80;           // Score for blocking
this.registrationCooldown = 300000; // 5 minutes
```

**File:** `automated-wallet-system.js`

```javascript
// Adjust bonus amounts:
let welcomeBonus = 100;           // Standard bonus
if (securityCheck.flagged) {
    welcomeBonus = 10;            // Reduced bonus
}
```

---

## 📱 ACTIVITY FEED MESSAGES

| Icon | Message | Meaning |
|------|---------|---------|
| 💎 | "New user X joined! Wallet created." | Normal registration (100 GBUV) |
| ⚠️ | "Flagged account X created (10 GBUV)" | Suspicious account (reduced) |
| ❌ | "Suspicious registration attempt blocked" | High-risk blocked |

---

## 🚨 COMMON FALSE POSITIVES

### Shared Internet (Office/School)
**Problem:** Multiple legitimate users from same IP
**Detection:** 3+ accounts from IP
**Solution:** Increase `maxAccountsPerIP` to 5

### Public WiFi
**Problem:** Many users on same network
**Detection:** High account count per IP
**Solution:** Whitelist known public WiFi IPs

### VPN Users (Privacy)
**Problem:** Legitimate user using VPN for privacy
**Detection:** VPN/proxy flag
**Solution:** Manual review + grant full bonus

### Shared Computer
**Problem:** Family members on same device
**Detection:** Multiple accounts per device
**Solution:** Increase `maxAccountsPerDevice` to 3

---

## 📈 STATISTICS DASHBOARD

```javascript
// Run this weekly for security report
const wallets = Object.values(JSON.parse(localStorage.getItem('gembot_wallets') || '{}'));
const total = wallets.length;
const flagged = wallets.filter(w => w.security?.flagged).length;
const blocked = 0; // Blocked users don't create wallets
const bonusDistributed = wallets.reduce((sum, w) => sum + (w.welcomeBonus || 100), 0);
const averageScore = wallets.reduce((sum, w) => sum + (w.security?.score || 0), 0) / total;

console.log(`
═══════════════════════════════════════
   GEMBOT SECURITY REPORT
═══════════════════════════════════════
📊 Total Accounts: ${total}
✅ Normal: ${total - flagged} (${((total-flagged)/total*100).toFixed(1)}%)
⚠️  Flagged: ${flagged} (${(flagged/total*100).toFixed(1)}%)
❌ Blocked: ${blocked}
💰 Bonus Distributed: ${bonusDistributed} GBUV
📈 Average Security Score: ${averageScore.toFixed(1)}/100
═══════════════════════════════════════
`);
```

---

## 🎯 DEPLOYMENT STATUS

### Integrated Files:
- ✅ anti-fraud-system.js (600+ lines)
- ✅ automated-wallet-system.js (security checks)
- ✅ GemBot_Control_AI.html (script loaded)
- ✅ DOMAIN_TEMPLATE.html (script loaded)
- ✅ All 15 domain configs (regenerated)

### Protection Coverage:
- ✅ Main GemBot Control Panel
- ✅ betterbook.co.uk
- ✅ electrical-airplane.com
- ✅ hermeticmicro.com
- ✅ madeinnatoalliance.org
- ✅ messier-45.com
- ✅ oc-tc.com
- ✅ orioncrusader.com
- ✅ realhogwarts.com
- ✅ robertcrobertsoniii.com
- ✅ the-autobots.com
- ✅ theduesenberg.com
- ✅ topofthepyramid.org
- ✅ trismegistus-capital.com
- ✅ trismegistustech.com
- ✅ truetemple.org

**100% Network Coverage** 🛡️

---

## 📞 EMERGENCY PROCEDURES

### Massive Attack Detected
```javascript
// Temporarily block ALL registrations
window.securitySystem.banThreshold = 0;
console.log('⛔ All registrations blocked until further notice');
```

### Mass False Positives
```javascript
// Temporarily disable security (use with caution!)
window.securitySystem.suspicionThreshold = 999;
window.securitySystem.banThreshold = 999;
console.log('⚠️ Security temporarily disabled - monitor closely!');
```

### Reset to Defaults
```javascript
window.securitySystem.maxAccountsPerIP = 3;
window.securitySystem.maxAccountsPerDevice = 2;
window.securitySystem.suspicionThreshold = 50;
window.securitySystem.banThreshold = 80;
console.log('✅ Security reset to default settings');
```

---

## 🔔 MONITORING ALERTS

Set up these checks in your monitoring system:

**Alert 1: High Fraud Rate**
```javascript
// If >20% accounts flagged in last hour
if (flaggedRate > 0.2) {
    alert('⚠️ High fraud rate detected!');
}
```

**Alert 2: Unusual IP Activity**
```javascript
// If any single IP has 5+ accounts
const maxPerIP = Math.max(...Object.values(ipData).map(a => a.length));
if (maxPerIP >= 5) {
    alert('🚨 Potential bonus farm detected!');
}
```

**Alert 3: Bot Attack**
```javascript
// If 5+ registrations in 5 minutes
const recent = wallets.filter(w => 
    Date.now() - new Date(w.created) < 300000
);
if (recent.length >= 5) {
    alert('🤖 Possible bot attack!');
}
```

---

## 🎓 TRAINING DATA

After 30 days, export data for ML training:

```javascript
const trainingData = wallets.map(w => ({
    features: w.security,
    label: w.security.flagged ? 'fraud' : 'legitimate'
}));
console.log(JSON.stringify(trainingData, null, 2));
// Use this to train ML model for improved detection
```

---

## ✅ SECURITY SYSTEM IS LIVE!

**Protection Active On:**
- All 15 Squarespace domains ✅
- Main control panel ✅
- Automated wallet creation ✅
- Welcome bonus distribution ✅

**Your network is now secured against bonus farming!** 🛡️🚀
