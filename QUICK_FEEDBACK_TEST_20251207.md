# Quick Feedback System Test (5 Minutes)
**Status:** Ready to test  
**Expected Time:** 5 minutes  

---

## Test 1: Button Appearance (1 minute)

1. Open GemBot in browser
2. Ask any question: **"Hello Merlin"**
3. Look for response with **👎 Not helpful** button below it
4. ✅ Button should be dark gray with light text

---

## Test 2: Feedback Logging (2 minutes)

1. Ask: **"Tell me about diamond cutting"**
2. When response appears, click the **👎 Not helpful** button
3. Prompt appears: "Why wasn't this helpful?"
4. Type: **"Too basic"** (or leave blank)
5. Click OK
6. ✅ Button should turn green: **✓ Thanks for feedback**
7. Open browser console (F12)
8. Type: `feedback.feedbackLog` and press Enter
9. ✅ Should see your feedback entry logged

---

## Test 3: Learning Concept Suggestion (2 minutes)

1. Ask: **"How do I cut emerald?"**
2. When response appears, click **👎** button
3. Type optional reason
4. Look above or below the button
5. ✅ Should see learning concept box:
   ```
   📚 Learning Tip: [Concept Name]
   [Educational explanation]
   ```
6. Verify concept is relevant to emerald (should suggest cleavage, heat, or brittle)

---

## Quick Console Verification

In browser console (F12), run:

```javascript
// How many feedback entries?
feedback.feedbackLog.length

// See them all
feedback.feedbackLog

// Get stats
feedback.getFeedbackStats()
```

---

## Expected Results

✅ All tests pass when:
- [x] 👎 button appears below every response
- [x] Button click opens prompt for reason
- [x] Button turns green after feedback
- [x] Feedback appears in console log
- [x] Learning concept appears (for matching keywords)
- [x] Each response gets its own button (independent)
- [x] Refreshing page keeps feedback (localStorage works)

---

## If Something Fails

**No button showing?**
- Check console (F12) for errors
- Make sure response type is 'assistant'
- Try refreshing page

**Button doesn't log feedback?**
- Check console shows `feedback.logBadResponse()` call
- Verify localStorage is enabled in browser
- Look for error messages in red in console

**No learning concept?**
- Try asking about specific stones: ruby, emerald, diamond
- Try questions mentioning: heat, angle, polish, speed
- Check console: `feedback.getLearningConcept("your question")`

---

## All Features Working?
✅ Ready for full integration testing!
