# 🛡️ GEMBOT SECURITY FLOW DIAGRAM

```
═══════════════════════════════════════════════════════════════════════════════
                        GEMBOT ANTI-FRAUD SECURITY SYSTEM
                           Multi-Layered Protection Flow
═══════════════════════════════════════════════════════════════════════════════


                              ┌─────────────────┐
                              │  USER VISITS    │
                              │  GEMBOT SITE    │
                              └────────┬────────┘
                                       │
                                       ↓
                        ┌──────────────────────────┐
                        │   🔍 PASSIVE TRACKING    │
                        │   (Background Monitoring) │
                        └──────────────────────────┘
                                       │
                        ┌──────────────┼──────────────┐
                        │              │              │
                        ↓              ↓              ↓
                 ┌────────────┐ ┌───────────┐ ┌────────────┐
                 │  🖱️ Mouse  │ │ ⌨️ Keyboard│ │ 👆 Clicks  │
                 │  Movement  │ │   Timing   │ │ Interactions│
                 └────────────┘ └───────────┘ └────────────┘
                        │              │              │
                        └──────────────┴──────────────┘
                                       │
                                       ↓
                              ┌─────────────────┐
                              │  USER CLICKS    │
                              │   "REGISTER"    │
                              └────────┬────────┘
                                       │
                                       ↓
                        ═══════════════════════════════
                        ║   🛡️ SECURITY CHECK START  ║
                        ═══════════════════════════════
                                       │
                        ┌──────────────┴──────────────┐
                        │                             │
                        ↓                             ↓
           ┌──────────────────────┐      ┌──────────────────────┐
           │   1️⃣ IP ADDRESS      │      │  2️⃣ DEVICE           │
           │      TRACKING         │      │     FINGERPRINT      │
           ├──────────────────────┤      ├──────────────────────┤
           │ • Count accounts     │      │ • Browser signature  │
           │ • Check VPN/Proxy    │      │ • GPU renderer       │
           │ • Detect Tor         │      │ • Canvas print       │
           │ • Datacenter check   │      │ • Audio print        │
           │                      │      │ • Screen resolution  │
           │ Risk: 0-50 points    │      │ • Installed fonts    │
           └──────────┬───────────┘      └──────────┬───────────┘
                      │                             │
                      └──────────────┬──────────────┘
                                     │
                                     ↓
                        ┌──────────────────────────┐
                        │  3️⃣ EMAIL PATTERN        │
                        │     ANALYSIS             │
                        ├──────────────────────────┤
                        │ • Disposable check       │
                        │ • Sequential pattern     │
                        │ • Temp mail domains      │
                        │ • Suspicious keywords    │
                        │                          │
                        │ Risk: 0-25 points        │
                        └──────────┬───────────────┘
                                   │
                                   ↓
                        ┌──────────────────────────┐
                        │  4️⃣ BEHAVIOR             │
                        │     ANALYSIS             │
                        ├──────────────────────────┤
                        │ • Mouse patterns         │
                        │ • Keyboard timing        │
                        │ • Time on site           │
                        │ • Interaction count      │
                        │                          │
                        │ Risk: 0-20 points        │
                        └──────────┬───────────────┘
                                   │
                                   ↓
                        ┌──────────────────────────┐
                        │  5️⃣ RATE LIMITING        │
                        ├──────────────────────────┤
                        │ • Last registration time │
                        │ • 5-minute cooldown      │
                        │                          │
                        │ Risk: 0 or 20 points     │
                        └──────────┬───────────────┘
                                   │
                                   ↓
                        ┌──────────────────────────┐
                        │  6️⃣ CROSS-CHECK          │
                        ├──────────────────────────┤
                        │ • Username exists?       │
                        │ • Email exists?          │
                        │                          │
                        │ Risk: 0 points           │
                        └──────────┬───────────────┘
                                   │
                                   ↓
                        ═══════════════════════════════
                        ║  📊 CALCULATE TOTAL SCORE  ║
                        ║     (Sum of all risks)     ║
                        ═══════════════════════════════
                                   │
                   ┌───────────────┼───────────────┐
                   │               │               │
                   ↓               ↓               ↓
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │   SCORE: 0-49│  │ SCORE: 50-79 │  │ SCORE: 80-100│
        │   🟢 SAFE    │  │  🟡 FLAGGED  │  │  🔴 BLOCKED  │
        └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
               │                 │                  │
               ↓                 ↓                  ↓
        ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
        │ ✅ CREATE   │   │ ⚠️ CREATE   │   │ ❌ BLOCK    │
        │   WALLET    │   │   WALLET    │   │ REGISTRATION│
        │             │   │             │   │             │
        │ 100 GBUV    │   │ 10 GBUV     │   │ 0 GBUV      │
        │ BONUS       │   │ BONUS       │   │             │
        └─────┬───────┘   └─────┬───────┘   └─────┬───────┘
              │                 │                  │
              ↓                 ↓                  ↓
       ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
       │ Show Success │  │ Show Success │  │ Show Error   │
       │ Modal        │  │ Modal + ⚠️   │  │ Message      │
       │              │  │ "Under Review"│  │ "Security    │
       │ Full Wallet  │  │              │  │  Violation"  │
       │ Credentials  │  │ Full Wallet  │  │              │
       └──────┬───────┘  │ Credentials  │  └──────┬───────┘
              │          └──────┬───────┘         │
              │                 │                  │
              ↓                 ↓                  ↓
       ┌────────────────────────────────────────────────┐
       │        📋 LOG TO ACTIVITY FEED                 │
       ├────────────────────────────────────────────────┤
       │ ✅ "New user joined! 100 GBUV sent"           │
       │ ⚠️ "Flagged account created (10 GBUV)"        │
       │ ❌ "Suspicious registration blocked"          │
       └────────────────────────────────────────────────┘
                              │
                              ↓
                     ┌─────────────────┐
                     │  USER STARTS    │
                     │  USING GEMBOT   │
                     └─────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              SECURITY DATA STORAGE
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                           localStorage                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  gembot_wallets: {                                                          │
│    "publicKey123...": {                                                     │
│      username: "alice",                                                     │
│      email: "alice@gmail.com",                                             │
│      welcomeBonus: 100,                                                     │
│      security: {                                                            │
│        score: 15,                                                           │
│        flagged: false,                                                      │
│        reducedBonus: false                                                  │
│      }                                                                       │
│    }                                                                         │
│  }                                                                           │
│                                                                             │
│  ip_tracking: {                                                             │
│    "192.168.1.100": [                                                       │
│      { timestamp: 1702658400000, data: { country: "US", vpn: false } }     │
│    ]                                                                         │
│  }                                                                           │
│                                                                             │
│  fingerprint_tracking: {                                                    │
│    "a3f7b9...": [                                                           │
│      { timestamp: 1702658400000 }                                           │
│    ]                                                                         │
│  }                                                                           │
│                                                                             │
│  mouse_tracking: [                                                          │
│    { x: 450, y: 320, t: 1702658400100 },                                   │
│    { x: 452, y: 325, t: 1702658400200 }                                    │
│  ]                                                                           │
│                                                                             │
│  keyboard_timing: [                                                         │
│    { key: "a", t: 1702658401000 },                                         │
│    { key: "l", t: 1702658401150 }                                          │
│  ]                                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                           RISK SCORE BREAKDOWN EXAMPLES
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXAMPLE 1: LEGITIMATE USER                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ User: alice                                                                  │
│ Email: alice@gmail.com                                                      │
│                                                                             │
│ IP Address:         1st account from IP          = 0 points   ✅           │
│ Device:             New device fingerprint        = 0 points   ✅           │
│ Email:              gmail.com (legitimate)        = 0 points   ✅           │
│ Behavior:           45 seconds browsing           = 0 points   ✅           │
│ Rate Limit:         First attempt                 = 0 points   ✅           │
│                                                     ──────────              │
│                                            TOTAL:   0 / 100     🟢          │
│                                                                             │
│ RESULT: ✅ Account approved - 100 GBUV bonus                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXAMPLE 2: SUSPICIOUS USER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ User: bob99                                                                  │
│ Email: test123@tempmail.com                                                 │
│                                                                             │
│ IP Address:         3rd account from IP          = 20 points  ⚠️           │
│ Device:             2nd account from device       = 20 points  ⚠️           │
│ Email:              tempmail.com (disposable)     = 25 points  ⚠️           │
│ Behavior:           12 seconds on site            = 10 points  ⚠️           │
│ Rate Limit:         No violation                  = 0 points   ✅           │
│                                                     ──────────              │
│                                            TOTAL:   75 / 100    🟡          │
│                                                                             │
│ RESULT: ⚠️ Account flagged - 10 GBUV reduced bonus                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXAMPLE 3: BONUS FARMER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ User: bot_farmnow                                                           │
│ Email: farm7@throwaway.email                                                │
│                                                                             │
│ IP Address:         6th account + VPN detected   = 45 points  🔴           │
│ Device:             3rd account from device       = 30 points  🔴           │
│ Email:              throwaway.email + "bot"       = 45 points  🔴           │
│ Behavior:           Bot-like patterns detected    = 20 points  🔴           │
│ Rate Limit:         Attempted 2 min after last    = 20 points  🔴           │
│                                                     ──────────              │
│                                            TOTAL:   160 / 100   🔴          │
│                                            (Capped at 100)                  │
│                                                                             │
│ RESULT: ❌ Registration blocked - "Security violation detected"             │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                            DEPLOYMENT COVERAGE MAP
═══════════════════════════════════════════════════════════════════════════════

                    ┌─────────────────────────────────┐
                    │   🌐 GEMBOT NETWORK             │
                    │   (15 Squarespace Domains)      │
                    └──────────────┬──────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ↓                         ↓                         ↓
   ┌──────────┐            ┌──────────┐             ┌──────────┐
   │ Domain 1 │            │ Domain 8 │             │Domain 15 │
   │ betterbook│            │realhogwarts│          │truetemple│
   │  🛡️ ✅   │            │  🛡️ ✅   │             │  🛡️ ✅   │
   └──────────┘            └──────────┘             └──────────┘
         │                         │                         │
         ↓                         ↓                         ↓
   [Anti-Fraud]            [Anti-Fraud]              [Anti-Fraud]
   [System]                [System]                  [System]
         │                         │                         │
         └─────────────────────────┴─────────────────────────┘
                                   │
                                   ↓
                    ┌──────────────────────────────┐
                    │  📊 CENTRALIZED TRACKING     │
                    │  (Each domain's localStorage) │
                    └──────────────────────────────┘


All 15 domains protected! 🛡️
100% network coverage ✅
Every registration secured 🔒


═══════════════════════════════════════════════════════════════════════════════
                          ADMIN MONITORING DASHBOARD
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                     🛡️ SECURITY DASHBOARD                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 TOTAL REGISTRATIONS:  47                                                │
│  ✅ Approved (0-49):      42  (89.4%)  ───────────██████████████           │
│  ⚠️  Flagged (50-79):      4  (8.5%)   ──█                                 │
│  ❌ Blocked (80-100):      1  (2.1%)   ─                                    │
│                                                                             │
│  💰 BONUS DISTRIBUTED:    4,240 GBUV                                        │
│  📈 AVERAGE SCORE:        18.7 / 100                                        │
│  🚨 FRAUD ATTEMPTS:       1 blocked today                                   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────┐        │
│  │  RECENT ACTIVITY                                               │        │
│  ├───────────────────────────────────────────────────────────────┤        │
│  │  ✅ alice          | Score: 5  | Bonus: 100 GBUV | 14:23      │        │
│  │  ✅ bob_smith      | Score: 12 | Bonus: 100 GBUV | 14:18      │        │
│  │  ⚠️  charlie99     | Score: 68 | Bonus: 10 GBUV  | 14:15      │        │
│  │  ❌ bot_farmer     | Score: 95 | BLOCKED         | 14:10      │        │
│  └───────────────────────────────────────────────────────────────┘        │
│                                                                             │
│  [View Flagged Accounts]  [Export Report]  [Adjust Thresholds]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 KEY TAKEAWAYS

1. **Multi-Layered Defense** - 6 independent security checks
2. **Dynamic Scoring** - 0-100 points determine trust level
3. **Smart Bonuses** - 100 GBUV for legitimate, 10 GBUV for suspicious
4. **Complete Blocking** - High-risk users can't register at all
5. **Full Coverage** - Every domain and every registration protected

**Your network is secure!** 🛡️🚀
