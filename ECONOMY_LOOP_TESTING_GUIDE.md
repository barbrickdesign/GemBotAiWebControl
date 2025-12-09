# Phase 4: Full Economy Loop Testing Guide

## System Ready for Testing ✅

The GemForge economy system is now fully integrated and operational with no warnings. Here's how to test it end-to-end.

---

## Test 1: Check Current Economy Status

**Goal**: Verify baseline economy state

**Steps**:
1. Open the web controller in browser
2. Look at header - you should see: `💎 100 | 🏆 Apprentice | 🔥 0`
3. Type in chat: `"What's my balance?"`
4. Type in chat: `"What's my tier?"`
5. Type in chat: `"Claim daily bonus"`

**Expected Results**:
- ✅ Header displays starting balance (100 gems)
- ✅ Chat confirms Apprentice tier
- ✅ Daily bonus awards 10 gems
- ✅ Balance in header updates to 110
- ✅ Streak shows `🔥 1`

---

## Test 2: Execute Commands & Track Gem Cost

**Goal**: Verify pay-per-action gem cost system

**Steps**:
1. Note current gem balance from header
2. Click SCAN button → should connect to Arduino
3. Press any button on web controller (e.g., "UP" to move stone up)
4. Observe gem balance in header decrease

**Expected Results**:
- ✅ Command executes normally
- ✅ Gems deduct by 1 (Apprentice tier = 1 gem/command)
- ✅ Header shows new balance: `💎 99`
- ✅ No console warnings
- ✅ Serial communication logs in browser console (no errors)

**Gem Cost by Tier**:
| Tier | Cost/Command |
|------|-------------|
| Apprentice | 1 gem |
| Journeyman | 1.2 gems → rounds to 1 |
| Artisan | 1.5 gems → rounds to 2 |
| Master | 2 gems |
| Grandmaster | 2.5 gems → rounds to 3 |

---

## Test 3: Record Cut Completion & Earn Gems

**Goal**: Verify cut completion triggers gem reward

**Steps**:
1. Initiate a cut sequence on the machine
2. Perform all steps of cut (move stone, rotate, polish, etc.)
3. Watch for Arduino completion signal (check serial data)
4. Monitor gem balance after completion

**Expected Results**:
- ✅ Cut completes successfully
- ✅ Gems awarded: 10 + quality bonus (10-50 gems)
  - Standard cut = +10 gems
  - Good cut = +20 gems
  - Perfect cut = +50 gems
- ✅ Header updates: `💎 [balance + reward]`
- ✅ Chat shows completion message with gem award

**How to Trigger Cut Completion**:
If using Arduino menu system:
1. Select "S" in menu to enter stone selection
2. Choose stone (e.g., "Q" for Quartz)
3. Navigate to "C" for Cut
4. Execute movement commands
5. Complete cut sequence
6. Arduino responds with cut completion status

---

## Test 4: Tier Advancement

**Goal**: Verify tier advancement system after sufficient cuts

**Steps**:
1. Note current cuts and tier: Ask "What's my tier?" in chat
2. Execute 10+ different cuts (or use test scenario below)
3. After 10th cut, ask: "What tier am I?"
4. Observe: You should promote from Apprentice → Journeyman

**Expected Results**:
- ✅ After 10 cuts, tier advances to Journeyman
- ✅ Header updates: `🏆 Journeyman`
- ✅ New stones unlock: Citrine, Topaz
- ✅ Gem cost increases: 1.0 → 1.2 per command
- ✅ Chat confirms promotion with badge: 📍

**Tier Advancement Thresholds**:
| Tier | Cuts Needed | New Stones | Cost Multiplier |
|------|------------|-----------|-----------------|
| Apprentice → Journeyman | 10 | Citrine, Topaz | 1.0 → 1.2 |
| Journeyman → Artisan | 50 | Garnet, Tourmaline | 1.2 → 1.5 |
| Artisan → Master | 200 | Aquamarine, Sapphire, Ruby | 1.5 → 2.0 |
| Master → Grandmaster | 500 | Emerald, Diamond | 2.0 → 2.5 |

---

## Test 5: Achievements & Rank

**Goal**: Verify achievement tracking system

**Steps**:
1. Ask in chat: "What achievements have I earned?"
2. Execute various actions to trigger achievements:
   - Complete cuts (cuts_completed)
   - Claim bonus daily (streak_days)
   - Advance tiers (tier_advances)
   - Earn gems (gems_earned)
   - Learn lessons (lesson_completed)
3. Ask again: "What's my rank?"

**Expected Achievements**:
```
Milestone Achievements:
- 1 Cut Completed → +10 points
- 5 Cuts Completed → +25 points
- 10 Cuts Completed → +50 points (with Journeyman unlock)
- 3 Day Streak → +15 points
- First Tier Advance → +100 points
- 500 Gems Earned → +50 points
- Complete Lesson → +20 points

Rank Progression:
- 0 pts: Novice
- 100 pts: Initiate
- 250 pts: Practitioner
- 500 pts: Skilled
- 1000 pts: Expert
- 2500 pts: Master
- 5000 pts: Legendary
```

---

## Test 6: Available Stones Per Tier

**Goal**: Verify stone progression system

**Steps**:
1. Ask: "What stones can I cut?"
2. Advance to Journeyman tier (10+ cuts)
3. Ask again: "What stones can I cut?"
4. Advance to Artisan tier (50+ cuts)
5. Ask again: "What stones can I cut?"

**Expected Results**:

**Apprentice** (0 cuts):
- Quartz (hardness 7, speed 100-150 RPM)
- Amethyst (hardness 7, speed 100-150 RPM)

**Journeyman** (10+ cuts):
- + Citrine (hardness 7, speed 100-150 RPM)
- + Topaz (hardness 8, speed 80-120 RPM)

**Artisan** (50+ cuts):
- + Garnet (hardness 7.5, speed 90-130 RPM)
- + Tourmaline (hardness 7-7.5, speed 90-130 RPM)

**Master** (200+ cuts):
- + Aquamarine (hardness 7.5, speed 90-130 RPM)
- + Sapphire (hardness 9, speed 50-100 RPM)
- + Ruby (hardness 9, speed 50-100 RPM)

**Grandmaster** (500+ cuts):
- + Emerald (hardness 7.5, speed 90-130 RPM)
- + Diamond (hardness 10, speed 30-60 RPM)

---

## Test 7: Streak & Daily Bonus

**Goal**: Verify daily bonus streak multiplier

**Steps**:
1. Claim bonus Day 1: "Claim daily bonus" → Should get 10 gems + 1.0x multiplier = 10 gems
2. If testing across days, claim on Day 2 → Should get 10 gems + 1.1x multiplier = 11 gems
3. Continue claiming to test multiplier: 1.0 → 1.1 → 1.2 → ... → 3.0 (max at 7+ days)

**Expected Results**:
- ✅ Daily bonus claims exactly once per UTC day
- ✅ Streak counter: 🔥 1, 🔥 2, 🔥 3, etc.
- ✅ Multiplier increases: 1.0x → 1.5x → 2.0x → 3.0x
- ✅ Can't claim twice on same day
- ✅ Streak resets if you miss a day

**Multiplier Schedule**:
| Day Streak | Bonus Calculation | Gems Awarded |
|-----------|-------------------|--------------|
| 1 (first) | 10 × 1.0 | 10 gems |
| 2 | 10 × 1.1 | 11 gems |
| 3 | 10 × 1.2 | 12 gems |
| 4 | 10 × 1.5 | 15 gems |
| 5 | 10 × 1.8 | 18 gems |
| 6 | 10 × 2.0 | 20 gems |
| 7+ | 10 × 3.0 | 30 gems (max) |

---

## Test 8: Machine Access Tracking

**Goal**: Verify command execution counting for achievements

**Steps**:
1. Ask in chat: "Tell me about my machine access"
2. Execute 10 commands
3. Ask again: "Tell me about my machine access"

**Expected Results**:
- ✅ Tracks total commands executed
- ✅ Counter increments with each button press
- ✅ Used for achievement thresholds

---

## Test 9: Persistence Across Refresh

**Goal**: Verify localStorage saves economy state

**Steps**:
1. Check balance and tier: `💎 100 | 🏆 Apprentice`
2. Execute 5 commands: balance should be around `💎 95`
3. Advance to Journeyman (if possible)
4. Refresh page (Ctrl+R or F5)
5. Check header and ask "What's my tier?"

**Expected Results**:
- ✅ Balance persists across refresh
- ✅ Tier persists across refresh
- ✅ Transaction history preserved
- ✅ Achievement points saved
- ✅ Streak data saved

---

## Test 10: Full Flow Integration

**Goal**: Test all systems working together

**Script**:
1. Start with fresh session (or check current balance)
2. Claim daily bonus: `+10 gems` → `💎 110`
3. Execute 5 UP commands: `-5 gems` → `💎 105`
4. Execute 5 DOWN commands: `-5 gems` → `💎 100`
5. Complete 1 quality cut: `+15 gems` → `💎 115`
6. Ask achievements: Should have "Cuts Completed" badge
7. Continue cutting (9+ more) to reach Journeyman
8. After 10th cut:
   - Tier advances → `🏆 Journeyman`
   - Gem cost increases → 1.2x per command
   - New stones unlock
   - Achievement points awarded
9. Refresh page and confirm all data persists

**Expected Final State** (after 10 quality cuts at ~15 gems each):
- Balance: ~215 gems (110 start + 10 bonus + 10×15 cuts)
- Tier: Journeyman
- Cuts: 10
- Available Stones: Quartz, Amethyst, Citrine, Topaz
- Achievement Points: ~120+ points
- Rank: Initiate

---

## Debugging Checklist

If any test fails, check these:

### Gems Not Deducting
- [ ] Check browser console for errors
- [ ] Verify merlin object initialized (not undefined)
- [ ] Check if spendGemCoins() is being called in sendCommand()
- [ ] Verify balance check isn't preventing deduction

### Tier Not Advancing
- [ ] Verify cut count is being tracked in recordCutCompletion()
- [ ] Check if checkTierAdvancement() is being called
- [ ] Ensure tier thresholds are correct (Apprentice=0, Journeyman=10, etc.)
- [ ] Check localStorage for userProfile.gemForge.certification.tier

### Bonuses Not Working
- [ ] Check daily bonus time logic (UTC-based)
- [ ] Verify claimed flag is being set
- [ ] Check streak calculation
- [ ] Ensure localStorage is being saved

### Data Not Persisting
- [ ] Check browser localStorage quota
- [ ] Verify saveUserProfile() is called after changes
- [ ] Check for console errors during save
- [ ] Try browser cache clear (Ctrl+Shift+Delete)

### Commands Not Executing
- [ ] Check Arduino connection (SCAN → CONNECT)
- [ ] Verify serial port is open
- [ ] Look for errors in browser console
- [ ] Check if button event handlers are attached

---

## Success Criteria

✅ All systems ready when you can:
- [ ] Check gem balance in header
- [ ] Execute commands and see gems decrease
- [ ] Complete cuts and see gems increase
- [ ] Advance to Journeyman tier after 10 cuts
- [ ] Ask economy questions and get responses
- [ ] Persist data across page refresh
- [ ] No console warnings or errors

---

## Ready to Test?

Open the web controller and try Test 1 first. Let me know the results!

**Expected Console Output** (should NOT see warnings):
```
✅ Merlin AI Initialized
✅ All Diagnostic Checks Passed
✅ Arduino Connected at 9600 baud
✅ User Profile Loaded
✅ Serial Communication Tracking Active
[No warnings or errors]
```

---

**Document Status**: ✅ COMPLETE
**Last Updated**: 2025-01-07
**Phase**: 4 (Testing & Validation)
