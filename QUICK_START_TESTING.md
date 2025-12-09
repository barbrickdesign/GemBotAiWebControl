# 🚀 QUICK START: Economy Loop Testing

## Current Status
✅ **READY TO TEST** - Zero warnings, all systems operational

---

## 5-Minute Health Check

### Open Browser Console (F12)
Should see **NO warnings** ✅

### Check Header Display
Should see: `💎 100 | 🏆 Apprentice | 🔥 0` ✅

### Test Economy Queries
Type in chat:
```
"What's my balance?"      → Should say "100 gems"
"What tier am I?"         → Should say "Apprentice"
"Claim daily bonus"       → Should add 10 gems to balance
```

All working? → **PROCEED TO FULL TESTING** ✅

---

## 20-Minute Economy Loop Test

### Step 1: Execute 5 Commands
- Click SCAN → Connect to Arduino
- Click UP button 5 times
- Balance should drop from 100 → 95 ✅

### Step 2: Complete 1 Cut
- Execute full cut sequence on machine
- Should award 10-50 gems (quality-dependent)
- Balance should increase ✅

### Step 3: Continue for 10 Total Cuts
- Execute 9 more quality cuts
- Each cut: +10 gems minimum
- Total should be 100+ gems ✅

### Step 4: Check Tier Advancement
After 10 cuts:
- Type: "What tier am I?"
- Should show: `🏆 Journeyman` ✅
- Type: "What stones can I cut?"
- Should show: Citrine, Topaz unlocked ✅

---

## Full Test Checklist

- [ ] **Header Display**: Shows gem balance, tier, streak
- [ ] **Commands**: Deduct gems when executed
- [ ] **Bonus**: Claim daily bonus awards gems
- [ ] **Cuts**: Completing cuts awards gems
- [ ] **Tier**: Advancement happens after 10 cuts
- [ ] **Stones**: New stones unlock after tier advance
- [ ] **Achievements**: Badges appear after milestones
- [ ] **Persistence**: Data saves across refresh
- [ ] **No Warnings**: Console is clean
- [ ] **No Errors**: All systems responsive

---

## Gem Economy Summary

### Earning Gems
| Action | Reward |
|--------|--------|
| Daily Bonus | 10 + streak multiplier |
| Standard Cut | +10 gems |
| Good Cut | +20 gems |
| Perfect Cut | +50 gems |
| Lesson Complete | +5 gems |

### Spending Gems
| Action | Cost |
|--------|------|
| Command (Apprentice) | 1 gem |
| Command (Journeyman) | 1.2 gems |
| Command (Artisan) | 1.5 gems |
| Command (Master) | 2.0 gems |
| Command (Grandmaster) | 2.5 gems |

### Tier Progression
| Tier | Cuts | Cost/Cmd | New Stones |
|------|------|----------|-----------|
| Apprentice | 0 | 1.0x | Quartz, Amethyst |
| Journeyman | 10 | 1.2x | + Citrine, Topaz |
| Artisan | 50 | 1.5x | + Garnet, Tourmaline |
| Master | 200 | 2.0x | + Aquamarine, Sapphire, Ruby |
| Grandmaster | 500 | 2.5x | + Emerald, Diamond |

---

## If Something Doesn't Work

### Gems Not Deducting?
1. Check console for errors (F12)
2. Verify Arduino connected (should see menu)
3. Try refreshing page
4. Check if balance is 0 (can't spend if empty)

### Tier Not Advancing?
1. Verify you've done 10+ cuts
2. Ask "What tier am I?" to check current
3. Check console for errors
4. Try refreshing page

### Balance Not Displaying?
1. Check if header shows: `💎 100 | 🏆 ...`
2. If missing, try Ctrl+Shift+Delete (clear cache)
3. Check console for errors
4. Try different browser

### Data Lost After Refresh?
1. Check if localStorage is enabled
2. Try Ctrl+Shift+Delete to clear cache
3. Check for "Clear on exit" setting in browser
4. Look for "Storage" in browser settings

---

## Chat Commands Reference

```
Economy Info:
"What's my balance?"          → Current gems
"What's my tier?"             → Current tier
"What's my rank?"             → Achievement rank
"What achievements have I?"   → List earned badges
"What stones can I cut?"      → Tier-specific stones
"Claim daily bonus"           → Get daily reward

Teaching:
"Can you teach me"            → Get lesson menu
"How do I..."                 → Get specific lesson
"Explain..."                  → Detailed explanation

Machine:
"Scan"                        → Search for Arduino
"Connect"                     → Connect to serial port
[button clicks]               → Execute commands
```

---

## Success = You See This

### After Claiming Bonus
```
Chat shows: "✅ Daily bonus claimed! You earned 10 gems (1.0x streak)"
Header shows: 💎 110 | 🏆 Apprentice | 🔥 1
```

### After Executing Cuts (10+)
```
Chat shows: "🎉 You've advanced to Journeyman tier!"
Header shows: 💎 200+ | 🏆 Journeyman | 🔥 1
"What stones can I cut?" → Shows new stones unlocked
```

### After Refresh
```
All data persists exactly as before
No data loss
Console shows no errors
```

---

## Emergency Reset

If things get stuck:
1. Open console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Refresh page
5. System resets to default state

⚠️ **Warning**: This deletes all save data

---

## Next Steps

1. **Run Health Check** (5 min) → Confirm no warnings
2. **Test Economy Loop** (20 min) → Execute cuts, verify gems
3. **Full Testing** (1-2 hours) → All 10 test scenarios
4. **Report Results** → Document findings
5. **Implement Features** → Marketplace, Investor, Streaming

---

## Files to Reference

📄 **ECONOMY_LOOP_TESTING_GUIDE.md** - Detailed test steps
📄 **PHASE_4_PROJECT_STATUS.md** - Complete system overview
📄 **PHASE_4_COMPLETE_SUMMARY.md** - This phase's work

---

**Status**: ✅ READY
**Time to Test**: ~30 minutes (full loop)
**Expected Result**: All systems working
**Console Output**: Zero warnings

🚀 **Start testing whenever ready!**
