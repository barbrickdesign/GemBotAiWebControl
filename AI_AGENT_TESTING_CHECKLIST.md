# ✅ AI Agent Systems - Testing Checklist

**Created by Ryan Barbrick / Barbrick Design**

---

## 🎯 Pre-Testing Setup

- [ ] **HTML Integration**: Verify all 4 JS files linked in `GemBot_Control_AI.html`
  - [ ] `ai-agent-players.js`
  - [ ] `ai-agent-logger.js`
  - [ ] `ai-agent-systems.js`
  - [ ] `ai-agent-news-referral.js`
- [ ] **CSS Loaded**: Confirm `ai-agent-systems.css` linked
- [ ] **Dependencies**: Check GBUV and Merlin systems loaded
  - [ ] `window.GBUV` exists
  - [ ] `window.MerlinCardIntegrated` exists
- [ ] **Browser Console**: Open DevTools (F12) → Console tab

---

## 🤖 AI Agent Player System Tests

### Test 1: Spawn Single Agent
```javascript
spawnAIAgents(1);
```
- [ ] Console shows: "✅ Spawned 1 AI agents"
- [ ] Agent starts playing within 1-3 seconds
- [ ] Console shows agent actions (deploy, collect, etc.)
- [ ] No errors in console

### Test 2: Spawn Multiple Agents
```javascript
spawnAIAgents(10);
```
- [ ] Console shows: "✅ Spawned 10 AI agents"
- [ ] All 10 agents start playing
- [ ] Different personalities assigned (casual, hardcore, strategic, social)
- [ ] Actions appear rapidly in console

### Test 3: Check AI Stats
```javascript
const stats = getAIStats();
console.log(stats);
```
- [ ] Returns object with:
  - [ ] `totalAgents`: Correct count
  - [ ] `totalGems`: Increasing number
  - [ ] `totalMachines`: > 0
  - [ ] `totalActions`: Increasing rapidly
  - [ ] `topAgent`: Object with agent details

### Test 4: Get Leaderboard
```javascript
const leaderboard = getAILeaderboard();
console.log(leaderboard);
```
- [ ] Returns array of agents
- [ ] Sorted by gems (highest first)
- [ ] Each entry has: id, name, avatar, gems, level, achievements
- [ ] Includes personality and isAI flags

### Test 5: Stop Agents
```javascript
stopAIAgents();
```
- [ ] Console shows: "🛑 Stopping all AI agents..."
- [ ] Console shows: "✅ Stopped X AI agents"
- [ ] No more action logs appearing
- [ ] Can spawn new agents after stopping

---

## 📝 Logging System Tests

### Test 6: Verify Logging Active
```javascript
console.log(window.aiLogger.logs.length);
```
- [ ] Returns number > 0
- [ ] Number increases as agents play
- [ ] Logs contain: agentId, action, timestamp, details

### Test 7: Check Log Storage
```javascript
const savedLogs = localStorage.getItem('gembot_ai_logs');
console.log(JSON.parse(savedLogs).length);
```
- [ ] Returns number > 0
- [ ] Logs persist after page refresh
- [ ] Maximum 10,000 logs stored

### Test 8: View Recent Logs
```javascript
console.log(window.aiLogger.logs.slice(-10));
```
- [ ] Shows last 10 log entries
- [ ] Each log has: agentId, action, timestamp, success, details
- [ ] Actions include: deploy_machine, collect_gems, upgrade_machine, etc.

---

## ⏱️ 24-Hour Analysis Cycle Tests

### Test 9: First Analysis (Runs at 5 seconds)
**Wait 5 seconds after page load, then check console:**
- [ ] Console shows: "📊 Running daily AI agent analysis..."
- [ ] Analysis output appears with:
  - [ ] Metrics (totalActions, successRate, topActions)
  - [ ] Error analysis (if any errors occurred)
  - [ ] Generated fixes
  - [ ] Improvement suggestions
  - [ ] Generated news content
- [ ] Console shows: "✅ Daily analysis complete"

### Test 10: Manual Analysis Trigger
```javascript
window.aiLogger.runDailyAnalysis();
```
- [ ] Analysis runs immediately
- [ ] Full output logged to console
- [ ] No errors during analysis
- [ ] Changelog entry added

### Test 11: View Last Analysis
```javascript
console.log(window.aiLogger.lastAnalysis);
```
- [ ] Returns object with:
  - [ ] `timestamp`: Recent date/time
  - [ ] `metrics`: Statistics object
  - [ ] `errors`: Array (empty if no errors)
  - [ ] `fixes`: Array of fix recommendations
  - [ ] `improvements`: Array of suggestions
  - [ ] `news`: Changelog content object

---

## 🏆 Leaderboard System Tests

### Test 12: Open Leaderboard
```javascript
openLeaderboard();
```
- [ ] Modal appears with leaderboard
- [ ] Shows all AI agents + real players
- [ ] Ranked by gems → level → achievements
- [ ] Top 3 have gold styling
- [ ] AI badges visible on AI agents
- [ ] Personality badges visible

### Test 13: Leaderboard Auto-Update
**Wait 30 seconds with leaderboard open:**
- [ ] Stats update automatically
- [ ] Gem counts increase
- [ ] Rankings may shift
- [ ] No manual refresh needed

### Test 14: Close Leaderboard
Click X button or outside modal:
- [ ] Modal closes smoothly
- [ ] Page still functional
- [ ] Can reopen with `openLeaderboard()`

### Test 15: Manual Leaderboard Update
```javascript
updateLeaderboard();
```
- [ ] Leaderboard refreshes immediately (if open)
- [ ] Latest stats pulled from AI agents
- [ ] Rankings recalculated

### Test 16: Add Custom Entry
```javascript
window.gemBotLeaderboard.addEntry({
    id: 'test-player',
    name: 'Test Player',
    avatar: '👑',
    gems: 999999,
    level: 100,
    achievements: 50,
    isAI: false
});
openLeaderboard();
```
- [ ] Custom entry appears at top (highest gems)
- [ ] No AI badge (isAI: false)
- [ ] Shows correct stats

---

## 📰 Changelog System Tests

### Test 17: Open Changelog
```javascript
openChangelog();
```
- [ ] Modal appears with changelog
- [ ] Timeline view with date markers
- [ ] At least one entry visible (from first analysis)
- [ ] Sections: Stats, Fixes, Improvements, Achievements

### Test 18: View Changelog Content
**Inspect first entry:**
- [ ] Title present (e.g., "Daily Update - Dec 7, 2025")
- [ ] Date formatted correctly
- [ ] Stats section has bullet points
- [ ] Each section has relevant content
- [ ] Styled with cyan/purple gradient

### Test 19: Manual Changelog Entry
```javascript
window.changelogPublisher.publish({
    title: 'Test Update',
    sections: {
        stats: ['Test stat 1', 'Test stat 2'],
        fixes: ['Test fix 1'],
        improvements: ['Test improvement 1'],
        achievements: ['Test achievement 1']
    }
});
openChangelog();
```
- [ ] New entry appears at top
- [ ] Contains all custom content
- [ ] Properly formatted
- [ ] Persists after page refresh

### Test 20: 30-Day Limit
```javascript
// Check how many entries stored
const changelog = JSON.parse(localStorage.getItem('gembot_changelog'));
console.log(`Changelog entries: ${changelog.length}`);
```
- [ ] Maximum 30 entries stored
- [ ] Oldest entries removed automatically
- [ ] Most recent always present

---

## 💰 Referral System Tests

### Test 21: Generate Referral Link
```javascript
const link = generateReferralLink('test-player-123');
console.log(link);
```
- [ ] Returns string like: `?ref=REF-test-player-123-1733612345678`
- [ ] Contains player ID
- [ ] Contains timestamp
- [ ] Can copy/paste to URL bar

### Test 22: Test Referral URL Detection
**Manually add to URL**: `http://localhost/?ref=REF-test-123-1733612345678`
**Then check console:**
- [ ] Console shows: "🎁 Referral detected!"
- [ ] Shows referrer ID and rewards
- [ ] Referrer gets 1000 gems (if exists in system)
- [ ] New player gets 500 gems

### Test 23: Check Referral Stats
```javascript
const stats = window.referralSystem.getPlayerStats('test-player-123');
console.log(stats);
```
- [ ] Returns object with:
  - [ ] `conversions`: Number of successful referrals
  - [ ] `totalRewards`: Total gems earned from referrals

### Test 24: Referral Persistence
**After processing referral, refresh page and check:**
```javascript
const referrals = JSON.parse(localStorage.getItem('gembot_referrals'));
console.log(referrals);
```
- [ ] Referral links persisted
- [ ] Conversions tracked
- [ ] Rewards recorded

---

## 📱 Social Media System Tests

### Test 25: Check Post Queue
```javascript
console.log(window.socialMedia.postQueue);
```
- [ ] Array of pending posts
- [ ] Posts have: type, content, timestamp
- [ ] Queue processes every 30 seconds

### Test 26: Manual Post
```javascript
window.socialMedia.post({
    type: 'achievement',
    playerName: 'Test Player',
    achievement: 'Test Achievement',
    referralLink: '?ref=TEST-123'
});
```
- [ ] Post added to queue
- [ ] Console shows: "📱 Social media post queued"
- [ ] Post processed within 30 seconds (simulated)

### Test 27: Daily Update Post
```javascript
window.socialMedia.postDailyUpdate({
    totalActions: 1000,
    activePlayers: 50,
    successRate: 95,
    fixesImplemented: 3,
    improvements: 5
});
```
- [ ] Post added to queue
- [ ] Contains all stats
- [ ] Formatted correctly in console output

### Test 28: Milestone Post
```javascript
window.socialMedia.postMilestone({
    title: '1000 Players!',
    description: 'We hit 1000 players!',
    stats: { players: 1000 }
});
```
- [ ] Milestone post created
- [ ] Contains title and description
- [ ] Stats included

### Test 29: Configure Platform (Optional - Real Posting)
```javascript
window.socialMedia.configurePlatform('discord', {
    webhookUrl: 'https://discord.com/api/webhooks/YOUR-WEBHOOK-HERE'
});
```
- [ ] Platform configured
- [ ] Saved to localStorage
- [ ] Can retrieve: `window.socialMedia.platformConfig.discord`

---

## 🧙‍♂️ Merlin AI Learning Tests

### Test 30: Check Knowledge Base
```javascript
console.log(window.merlinLearning.knowledgeBase);
```
- [ ] Returns object with:
  - [ ] `commonActions`: Object with action counts
  - [ ] `successfulStrategies`: Array of learned strategies
  - [ ] `commonErrors`: Array of frequent errors
  - [ ] `playerPatterns`: Object with per-personality data
  - [ ] `improvements`: Array of suggested improvements

### Test 31: Update Knowledge Base
**Let AI agents play for 2 minutes, then:**
```javascript
window.aiLogger.runDailyAnalysis();
```
**Then check:**
```javascript
console.log(window.merlinLearning.knowledgeBase.commonActions);
```
- [ ] Action counts updated
- [ ] Reflects recent AI activity
- [ ] Strategies added (if patterns detected)

### Test 32: Get Personalized Advice
```javascript
const advice = window.merlinLearning.getAdvice({
    gems: 5000,
    level: 5,
    machines: 2,
    achievements: 1
});
console.log(advice);
```
- [ ] Returns relevant advice string
- [ ] Based on learned patterns
- [ ] Actionable recommendation
- [ ] References commonActions or successfulStrategies

### Test 33: Merlin Learning Persistence
**Refresh page and check:**
```javascript
const saved = localStorage.getItem('gembot_merlin_knowledge');
console.log(JSON.parse(saved));
```
- [ ] Knowledge base persisted
- [ ] All learned data present
- [ ] Accumulates over sessions

---

## 🔄 Integration Tests

### Test 34: Full Workflow (End-to-End)
**Execute in order:**
```javascript
// 1. Spawn agents
spawnAIAgents(5);

// 2. Wait 30 seconds (let them play)
// ... wait ...

// 3. Check stats
console.log(getAIStats());

// 4. Open leaderboard
openLeaderboard();

// 5. Wait 5 seconds, then trigger analysis
setTimeout(() => window.aiLogger.runDailyAnalysis(), 5000);

// 6. Open changelog (after analysis)
setTimeout(() => openChangelog(), 10000);

// 7. Generate referral
const link = generateReferralLink('test-player');
console.log(link);
```
**Verify:**
- [ ] All steps execute without errors
- [ ] Agents play autonomously
- [ ] Stats update correctly
- [ ] Leaderboard shows agents
- [ ] Analysis completes
- [ ] Changelog has new entry
- [ ] Referral link generated

### Test 35: Cross-System Communication
**Verify systems communicate:**
- [ ] AI agents → Logger (actions logged)
- [ ] Logger → Merlin (analysis data fed)
- [ ] Merlin → Advice (learned patterns used)
- [ ] AI agents → Leaderboard (stats updated)
- [ ] AI agents → Social Media (achievements posted)
- [ ] Referral → GBUV (gems awarded)
- [ ] Logger → Changelog (news published)

---

## 🚀 Performance Tests

### Test 36: Spawn Many Agents
```javascript
spawnAIAgents(50);
```
- [ ] All 50 agents spawn successfully
- [ ] Page remains responsive
- [ ] No browser lag
- [ ] Console logs manageable (not overwhelming)
- [ ] Can still open leaderboard/changelog

### Test 37: Memory Usage
**Open browser Task Manager (Shift+Esc in Chrome):**
- [ ] Memory usage < 500MB with 50 agents
- [ ] No memory leaks over time
- [ ] Stabilizes after initial spike

### Test 38: localStorage Size
```javascript
let totalSize = 0;
Object.keys(localStorage).forEach(key => {
    if (key.startsWith('gembot_')) {
        totalSize += localStorage.getItem(key).length;
    }
});
console.log(`GemBot localStorage size: ${(totalSize / 1024).toFixed(2)} KB`);
```
- [ ] Size < 5 MB (5120 KB)
- [ ] Doesn't grow infinitely
- [ ] Old logs pruned automatically

---

## 🔒 Error Handling Tests

### Test 39: Simulate Network Error
**Block network in DevTools (Network tab → Offline), then:**
```javascript
spawnAIAgents(1);
```
- [ ] Agent handles gracefully
- [ ] Error logged with category: "network"
- [ ] Agent continues trying other actions
- [ ] Analysis detects pattern

### Test 40: Simulate Null Reference
**Temporarily break GBUV:**
```javascript
const tempGBUV = window.GBUV;
window.GBUV = null;
spawnAIAgents(1);
```
- [ ] Agent handles gracefully
- [ ] Error logged with category: "null_reference"
- [ ] Doesn't crash page
```javascript
// Restore
window.GBUV = tempGBUV;
```

### Test 41: Check Error Logging
```javascript
// View all errors
window.aiLogger.logs.filter(log => !log.success).forEach(log => {
    console.log(`Error: ${log.action} - ${log.error}`);
});
```
- [ ] Errors logged with details
- [ ] Categories assigned correctly
- [ ] Timestamps present

---

## 📱 Mobile/Responsive Tests

### Test 42: Mobile View
**Resize browser to 375px width (iPhone size):**
- [ ] Leaderboard modal fits screen
- [ ] Changelog modal scrolls properly
- [ ] AI status indicator visible
- [ ] Notification toasts appear correctly
- [ ] All text readable

### Test 43: Tablet View
**Resize browser to 768px width (iPad size):**
- [ ] Layouts adjust appropriately
- [ ] Modals centered
- [ ] Stats displayed properly
- [ ] Touch-friendly buttons

---

## 🎨 UI/Visual Tests

### Test 44: Leaderboard Styling
**Open leaderboard and check:**
- [ ] Top 3 have gold glow
- [ ] AI badges are blue
- [ ] Personality badges are purple
- [ ] Hover effects work
- [ ] Smooth animations
- [ ] Gradient header

### Test 45: Changelog Styling
**Open changelog and check:**
- [ ] Timeline has vertical line
- [ ] Date markers present
- [ ] Cyan/purple gradient theme
- [ ] Sections properly formatted
- [ ] Bullet points visible
- [ ] Smooth scrolling

### Test 46: Notification Toasts
**Trigger referral to see toast:**
- [ ] Toast appears top-right
- [ ] Slides in from right
- [ ] Fades out after 5 seconds
- [ ] Doesn't block UI

### Test 47: AI Status Indicator
**If implemented in HTML:**
- [ ] Shows in bottom-right
- [ ] Updates in real-time
- [ ] Shows active agents count
- [ ] Shows total actions
- [ ] Styled with cyan border

---

## 🔧 Cleanup Tests

### Test 48: Stop and Clear
```javascript
// Stop agents
stopAIAgents();

// Clear logs
localStorage.removeItem('gembot_ai_logs');
localStorage.removeItem('gembot_leaderboard');
localStorage.removeItem('gembot_changelog');

// Verify cleared
console.log(localStorage.getItem('gembot_ai_logs')); // Should be null
```
- [ ] All agents stopped
- [ ] localStorage cleared
- [ ] No errors
- [ ] Can restart fresh

### Test 49: Page Refresh
**After running tests, refresh page:**
- [ ] All systems reload correctly
- [ ] Persisted data loads from localStorage
- [ ] No errors in console
- [ ] Can spawn new agents immediately

### Test 50: Full Reset
```javascript
// Clear ALL GemBot data
Object.keys(localStorage)
    .filter(key => key.startsWith('gembot_'))
    .forEach(key => localStorage.removeItem(key));

// Refresh page
location.reload();
```
- [ ] All GemBot data cleared
- [ ] Page reloads fresh
- [ ] No errors
- [ ] Ready for new session

---

## ✅ Final Checklist

- [ ] **All 50 tests passed**
- [ ] **No console errors**
- [ ] **Systems communicate correctly**
- [ ] **Performance acceptable**
- [ ] **Mobile responsive**
- [ ] **Data persists correctly**
- [ ] **UI looks professional**
- [ ] **Ready for production**

---

## 📊 Expected Results Summary

After running all tests successfully:

✅ **AI Agents**: Spawn and play autonomously  
✅ **Logging**: All actions tracked and persisted  
✅ **Analysis**: Runs every 24 hours automatically  
✅ **Leaderboard**: Updates every 30 seconds  
✅ **Changelog**: Published after each analysis  
✅ **Referrals**: Generate links and track conversions  
✅ **Social Media**: Queue posts and simulate posting  
✅ **Merlin Learning**: Update knowledge base continuously  
✅ **Error Handling**: Graceful degradation on failures  
✅ **Performance**: Smooth with 50+ concurrent agents  

---

## 🐛 Bug Reporting

If any test fails, note:
1. Test number and name
2. Expected behavior
3. Actual behavior
4. Console errors (screenshot)
5. Steps to reproduce

**Report to**: BarbrickDesign@gmail.com

---

**© 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.**
