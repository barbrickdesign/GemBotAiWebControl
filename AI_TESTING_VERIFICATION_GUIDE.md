# 🧪 AI Enhancement v2 - Testing & Verification Guide

## Verification Checklist

Use this checklist to verify all features are working correctly.

### ✅ Power-Up Sequence

**Test**: Load the page in browser

**Expected**:
- [ ] Page loads without errors
- [ ] After 1-2 seconds, Jarvis speaks greeting: "Good morning..."
- [ ] AI chat area shows welcome message
- [ ] Voice indicator shows "🔊 Ready"

**Console Check**:
- [ ] No JavaScript errors
- [ ] Log shows: "✅ All systems initialized - Jarvis AI online"

---

### ✅ Voice Configuration

**Test**: Check voice settings after page load

**Expected**:
- [ ] Voice dropdown populated with system voices
- [ ] Speed slider set to ~0.85 (85%)
- [ ] Pitch slider set to ~0.9
- [ ] Volume slider set to ~0.9
- [ ] Voice should sound clear and sophisticated

**Check localStorage**:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('gembot_voice_settings'))
// Should show: {voiceEnabled: true, speechRate: 0.85, pitch: 0.9, volume: 0.9}
```

---

### ✅ Connection Success Message

**Test**: Connect Arduino via SCAN/CONNECT buttons

**Expected**:
- [ ] When connection succeeds, AI speaks confirmation
- [ ] Message appears: "Connection established. All systems green..."
- [ ] After 2 seconds, helpful tip appears and is spoken
- [ ] Examples of tips:
  - "For optimal results, use STEP mode during positioning"
  - "The camera is available for visual verification"
  - "Do not hesitate to ask for guidance"

---

### ✅ Basic Conversation - Help Intent

**Test**: Type "How do I cut?" and click SEND

**Expected**:
- [ ] Message sent, appears as "user" type
- [ ] AI responds with detailed cutting guidance
- [ ] Response includes: "positioning", "speed", "technique"
- [ ] Helper buttons appear: 📚 How to Cut, 🔄 Switch Stone, 🏠 Go Home
- [ ] Response is automatically spoken by voice
- [ ] Text appears in AI messages area

---

### ✅ Position Query

**Test**: Type "What is my current position?" 

**Expected**:
- [ ] AI responds with actual position values
- [ ] Message includes: "X: [number], Y: [number], Rotation: [number]°, Index: [number]"
- [ ] Values match status box on right side of screen

---

### ✅ Mode Question

**Test**: Type "Tell me about step mode"

**Expected**:
- [ ] AI explains current mode
- [ ] Shows current mode is STEP or CONTINUOUS
- [ ] Explains what each mode does
- [ ] Compares with other mode
- [ ] Helper buttons appear: 📖 Quick Guide

---

### ✅ Speed Question

**Test**: Type "What speed am I using?"

**Expected**:
- [ ] AI shows current speed level (1-5)
- [ ] Explains what that speed level means
- [ ] Gives guidance: "For beginners: use level 1-2"
- [ ] Speed value matches speed slider on left panel

---

### ✅ Stone Switching Request

**Test**: Type "How do I switch stones?"

**Expected**:
- [ ] AI provides step-by-step procedure:
  1. Press HOME button
  2. Remove current stone
  3. Position new stone
  4. Use STEP mode for fine adjustment
  5. Resume cutting
- [ ] Helper buttons: 🔄 Switch Stone | 🏠 Go Home | 🛑 Emergency
- [ ] Response is spoken by Jarvis voice

---

### ✅ Emergency Query

**Test**: Type "Emergency!" or "Help! Stuck!"

**Expected**:
- [ ] AI provides immediate crisis guidance
- [ ] Message mentions EMERGENCY STOP button
- [ ] Suggests action sequence: STOP → Assess → Home → Reconnect
- [ ] Helper buttons: 🛑 Emergency Help | 🔧 Troubleshoot | 🏠 Go Home

---

### ✅ Helper Button Actions

**Test**: Click each helper button

| Button | Expected Action |
|--------|-----------------|
| 📚 How to Cut | Shows detailed cutting steps in new message |
| 🔄 Switch Stone | Shows stone switching procedure with HOME instructions |
| 🛑 Emergency Help | Shows emergency response procedure |
| 🔧 Troubleshoot | Shows troubleshooting steps: check connection, try HOME, reconnect |
| 🏠 Go Home | **If connected**: Executes HOME command, updates position to 0,0 |
| 🏠 Go Home | **If not connected**: Shows error "Cannot execute HOME - not connected" |
| 📖 Quick Guide | Shows quick orientation to modes, speeds, positioning |

---

### ✅ Failure Detection System

**Test Part 1: Single Failure**
1. Move motor with UP button (or any axis)
2. Unplug USB or let it timeout 3 times
3. Type "Motor won't work"

**Expected**:
- [ ] AI records failure internally
- [ ] Response includes troubleshooting steps
- [ ] No alert yet (threshold is 3+)

**Test Part 2: Pattern Detection (Repeat 3+ times)**
1. Simulate same failure 2 more times (total 3)
2. Type "Motor stuck again" 

**Expected**:
- [ ] AI alerts: "I have observed a recurring issue: The motor has become unresponsive 3 times"
- [ ] Suggests: "This suggests a connection or position issue"
- [ ] Recommends: "Try HOME button, then EMERGENCY STOP if unresponsive, then reconnect"
- [ ] Helper buttons: 🔧 Troubleshoot | 🏠 Go Home | 🛑 Emergency Help

**Check localStorage**:
```javascript
// In browser console:
// Note: Failures stored in memory, but machine state saves
JSON.parse(localStorage.getItem('gembot_machine_state'))
```

---

### ✅ Accessibility Mode

**Test Part 1: Enable**
1. Look for ♿ Accessibility button (top right of AI panel)
2. Click it

**Expected**:
- [ ] Button click confirmed
- [ ] Message appears: "✅ Accessibility Mode ENABLED. Text is larger..."
- [ ] Text in AI messages area noticeably larger (16px)
- [ ] Input field becomes larger
- [ ] Line spacing increases
- [ ] Button appearance updates

**Test Part 2: Check Settings**
1. Hover over buttons (UP, DOWN, LEFT, RIGHT, etc.)
2. Tooltips should appear: "Click to move UP" etc.

**Test Part 3: Persistence**
1. Enable accessibility mode
2. Close browser tab
3. Reopen page
4. Check if accessibility still enabled

**Expected**:
- [ ] Setting persists in localStorage
- [ ] Text still large on page reload
- [ ] localStorage key: `gembot_accessibility_enabled` = `true`

**Test Part 4: Disable**
1. Click ♿ Accessibility button again

**Expected**:
- [ ] Message: "✅ Accessibility Mode disabled."
- [ ] Text returns to normal size
- [ ] localStorage key: `gembot_accessibility_enabled` = `false`

---

### ✅ Cut Completion Detection

**Test**: 
1. Perform several moves (UP, DOWN, LEFT, RIGHT)
2. Then **stop moving** and leave idle
3. Wait 10+ seconds with no position changes

**Expected**:
- [ ] AI monitors command history every 5 seconds
- [ ] Detects position stabilization
- [ ] Sends message like: "💡 You appear to be near your final position. Is the cut complete?"
- [ ] Or: "Good positioning. Once you are satisfied, we can proceed to stone switching."

**Note**: Detection requires 10+ recent commands with no position change

---

### ✅ Stuck User Detection

**Test**:
1. Click UP button rapidly 8+ times in quick succession
2. Do NOT click any other button
3. Wait 5 seconds

**Expected**:
- [ ] AI detects repeated same command
- [ ] Message appears: "I notice you are repeating the same movement."
- [ ] Suggests: "May I suggest: Try a different axis, or use helper buttons for step-by-step guidance?"
- [ ] Helper buttons appear: 📖 Quick Guide, 🛑 Emergency Help

---

### ✅ Conversational Responses

**Test**: Ask open-ended questions that don't fit specific intents

Examples:
- "Hello"
- "Can you help?"
- "I'm learning"
- "Good morning"

**Expected**:
- [ ] AI responds conversationally (not just error)
- [ ] Responses use Jarvis personality:
  - "I appreciate your inquiry..."
  - "How may I be of service..."
  - "I note your statement..."
  - "Understood. I remain vigilant..."

---

### ✅ Voice On/Off Toggle

**Test**:
1. Click 🔊 Voice ON button (top right of voice panel)

**Expected**:
- [ ] Button text changes to 🔇 Voice OFF
- [ ] Button color changes red (#7c2e2e)
- [ ] Next AI response does NOT play audio
- [ ] Message appears: "🔊 Voice disabled"

**Test Part 2: Re-enable**
1. Click 🔇 Voice OFF button

**Expected**:
- [ ] Button changes back to 🔊 Voice ON
- [ ] Color changes green (#4a7c2e)
- [ ] Next AI response plays audio again
- [ ] Message: "🔊 Voice enabled"

---

### ✅ Voice Control Sliders

**Test**: Adjust each control while AI speaks

**Speed Slider** (0.5x - 2.0x):
- [ ] Move to 0.5x → Next speech should be slower
- [ ] Move to 2.0x → Next speech should be faster
- [ ] Move to 1.0x → Normal speed

**Pitch Slider** (0.5 - 2.0):
- [ ] Move to 0.5 → Lower pitch voice
- [ ] Move to 2.0 → Higher pitch voice
- [ ] 1.0 = normal pitch

**Volume Slider** (0% - 100%):
- [ ] 0% → Silent
- [ ] 50% → Half volume
- [ ] 100% → Full volume

**Tip**: Ask AI to respond first, then adjust slider mid-speech to hear change

---

### ✅ Knowledge Base Coverage

**Test**: Ask about different topics

| Topic | Test Question | Should Know |
|-------|--------------|------------|
| Cutting | "How do I cut?" | Technique, positioning, speed, facets |
| Mode | "What's continuous?" | Difference from STEP, when to use |
| Speed | "What does speed 3 mean?" | It's standard speed, 20ms interval |
| Position | "Where am I?" | Current X, Y, Rotation, Index |
| Emergency | "What if I panic?" | EMERGENCY STOP will cut power |
| Stone | "How to switch?" | HOME → Remove → Position → Resume |
| Recovery | "Power failed, what now?" | State is saved, will recover |
| Index | "How to navigate positions?" | Use INDEX buttons, navigate laps |
| Rotation | "How does rotation work?" | CCW/CW buttons control spindle |

---

### ✅ Intent Detection Accuracy

**Test**: Try different phrasings for same intent

**Help Intent**: "how", "what", "help", "explain", "tell me"
```
"How do I...?" ✅ Detected
"What's continuous?" ✅ Detected
"Help me cut" ✅ Detected
"Explain speed" ✅ Detected
"Tell me about..." ✅ Detected
```

**Position Intent**: "position", "where", "coordinate", "location"
```
"Where am I?" ✅ Should show position
"Current position?" ✅ Should show position
"Show me coordinates" ✅ Should show position
"Location please" ✅ Should show position
```

**Mode Intent**: "mode", "continuous", "step", "click", "hold"
```
"What mode?" ✅ Should explain modes
"Continuous vs step?" ✅ Should compare
"How to click?" ✅ Should explain STEP
```

---

### ✅ Connection Monitoring

**Test**: Watch connection status indicator (top left)

1. **Disconnected State**:
   - [ ] Red indicator (pulsing)
   - [ ] Status: "DISCONNECTED"
   - [ ] Helper buttons disabled ("Cannot execute HOME - not connected")

2. **After Connecting**:
   - [ ] Indicator turns green
   - [ ] Status: "CONNECTED"
   - [ ] AI greeting for successful connection appears
   - [ ] Helper buttons like "Go Home" become active

3. **After Disconnecting**:
   - [ ] Indicator back to red
   - [ ] AI message: "Connection lost. Machine state saved."
   - [ ] Position recovered automatically when reconnected

---

### ✅ localStorage Persistence

**Test**: In browser console, check what's saved

```javascript
// Check AI accessibility mode
localStorage.getItem('gembot_accessibility_enabled')
// Should be: "true" or "false"

// Check voice settings
JSON.parse(localStorage.getItem('gembot_voice_settings'))
// Should show: {voiceEnabled, voiceIndex, speechRate, pitch, volume}

// Check machine state
JSON.parse(localStorage.getItem('gembot_machine_state'))
// Should show: {positionX, positionY, angle, index, mode, speed, history, timestamp}
```

---

### ✅ Message Types & Styling

**Test**: Observe message appearance

**User Message** (what you type):
- [ ] Aligned to right side
- [ ] Dark background color
- [ ] Your text appears clearly

**Assistant Message** (AI response):
- [ ] Aligned to left side
- [ ] Different background color
- [ ] Shows emoji to indicate context
- [ ] Is automatically spoken

**System Message** (connection, status):
- [ ] Different styling
- [ ] Informational messages
- [ ] Status updates
- [ ] NOT automatically spoken

---

### ✅ Browser Compatibility

**Test on Different Browsers**:
- [ ] Chrome/Chromium → All features work
- [ ] Firefox → All features work
- [ ] Edge → All features work
- [ ] Safari → Check Web Speech API support
- [ ] Mobile browsers → Responsive design

**Known Limitations**:
- Web Speech API best supported on Chrome/Chromium
- Firefox may have different voice options
- Safari may have limited voices

---

## 🐛 Troubleshooting

### Issue: No greeting on page load
**Solution**: Check console for errors, refresh page, wait 2-3 seconds

### Issue: Voice not speaking
**Solution**: 
- Check 🔊 Voice ON button is green
- Check browser Web Speech API support (Chrome best)
- Try different voice in dropdown
- Check volume slider not at 0%

### Issue: Helper buttons not appearing
**Solution**: 
- Buttons only show for certain intent types
- Try asking "How do I cut?" (definitely shows buttons)
- Check that aiMessages div exists in DOM

### Issue: Accessibility mode buttons missing
**Solution**: 
- Button is top-right of AI panel
- May be hidden if AI panel too small
- Try maximizing browser window

### Issue: Failure detection not working
**Solution**:
- Threshold is 3 failures minimum
- Must be same type of failure
- Check console for: "🔍 Failure recorded:"

### Issue: Motor stuck detection not firing
**Solution**:
- Need 8+ of same command in 15 recent commands
- Try clicking UP button 8 times fast
- Wait 5 seconds for next check cycle

### Issue: Connection success message not showing
**Solution**:
- Arduino must be successfully connected (status green)
- Message appears ~500ms after connection
- Wait 2-3 seconds after seeing green indicator

---

## 📊 Verification Report Template

Use this template to document testing:

```
AI ENHANCEMENT V2 TESTING REPORT
Date: _______________
Tester: _______________
Browser: _______________

POWER-UP SEQUENCE: [ ] PASS [ ] FAIL
- Greeting spoken: [ ]
- Voice working: [ ]
- No console errors: [ ]

CONVERSATION TESTING: [ ] PASS [ ] FAIL
- Help intent: [ ]
- Position query: [ ]
- Mode question: [ ]
- Speed question: [ ]
- Stone switching: [ ]

HELPER BUTTONS: [ ] PASS [ ] FAIL
- Buttons appear: [ ]
- All 7 buttons tested: [ ]
- Actions work: [ ]

FAILURE DETECTION: [ ] PASS [ ] FAIL
- Single failure recorded: [ ]
- Pattern detection (3+): [ ]
- Alert message shows: [ ]

ACCESSIBILITY MODE: [ ] PASS [ ] FAIL
- Enable button works: [ ]
- Text enlarges: [ ]
- Setting persists: [ ]
- Disable works: [ ]

VOICE CONTROLS: [ ] PASS [ ] FAIL
- On/Off toggle: [ ]
- Speed slider: [ ]
- Pitch slider: [ ]
- Volume slider: [ ]

SCENARIO DETECTION: [ ] PASS [ ] FAIL
- Cut completion detected: [ ]
- Stuck user detected: [ ]
- Helpful suggestion shown: [ ]

OVERALL: [ ] PRODUCTION READY [ ] NEEDS FIXES

Notes:
_______________________________
_______________________________
```

---

## ✅ Sign-Off

Once all checkboxes pass, the system is ready for:
- [ ] Hardware integration testing
- [ ] User acceptance testing with real operators
- [ ] Elderly user accessibility testing
- [ ] Production deployment

**Final Status**: ✅ READY FOR TESTING

