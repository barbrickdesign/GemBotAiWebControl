# Quick Response Test Card
**Status:** Diagnostic logging active  
**Goal:** Identify why responses aren't showing

---

## 30-Second Test

1. **Press F12** (opens Developer Tools)
2. **Click Console tab**
3. **Type in GemBot:** `Hello Merlin`
4. **Click Send**
5. **Look at console** - you should see lots of green ✓ logs

---

## What You Should See

**Good:** Lots of logs like:
```
📝 Processing query: "hello merlin"
✓ Matched: About Merlin
✅ Displaying response: "Welcome, seeker..."
🔵 addMessage called: type="assistant"
✓ aiMessages element found
✓ Message appended to DOM
```

**Bad:** Nothing appears, or message in chat but no logs = we know where to fix

---

## Console Commands to Try

```javascript
// Is AI working?
ai.handleUserQuery('hello')

// Can addMessage display?
addMessage('Test', 'assistant')

// Check feedback system
feedback.feedbackLog

// Check voice
voice.voiceEnabled

// Check DOM
document.getElementById('aiMessages')
```

---

## Quick Fixes to Try

1. **Page not responsive?**
   - Ctrl+Shift+R (hard refresh)

2. **Still no response?**
   - Check console for red errors
   - Try: `voice.voiceEnabled = false` (disable voice)

3. **Message appears but no button?**
   - Voice system might be hanging
   - Try disabling voice above

4. **Feedback button breaks message?**
   - Try: Change `&& typeof feedback` to `&& false` in addMessage

---

## Report Format

When reporting issue, include:
1. **What you typed:** "..."
2. **What appeared in console:** (copy/paste from console)
3. **What appeared in chat:** Did message show? Did button show?
4. **Error messages:** Any red text in console?

---

## Success = 
- Message appears in chat ✓
- 👎 Button below response ✓
- Console shows green logs ✓
- Can click button and add feedback ✓

---

**Ready to test?** Open browser, press F12, ask "Hello" and share console logs!
