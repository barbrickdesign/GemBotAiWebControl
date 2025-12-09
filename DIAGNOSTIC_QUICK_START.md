# 🚀 QUICK START - DIAGNOSTIC SYSTEM

## 30-Second Overview

The diagnostic system is now ready! Here's what it does:

1. **Click the 🔧 DIAGNOSTIC button** in the top toolbar
2. **Tell Merlin your name** (only asked once)
3. **Answer 7 simple questions** about your machine
4. **Get a report** of what's working and what needs fixing
5. **Follow Merlin's repair guide** if there are issues

---

## For End Users

### How to Access
- Open GemBot Control web interface
- Look for **🔧 DIAGNOSTIC** button in top toolbar (next to DISCONNECT)
- Click it to begin

### What to Expect
- First time: Merlin asks for your name
- Then: 7 questions about your machine (each answerable with YES/NO or a choice)
- Takes about 2-3 minutes total
- Results tell you if your machine is healthy or what needs fixing

### If Everything Works
✅ You'll see: *"Your machine is in excellent condition!"*  
✅ You're ready to start cutting gemstones  

### If Something Needs Fixing
⚠️ You'll see step-by-step instructions  
⚠️ Follow the steps to fix the issue  
⚠️ Run diagnostic again to verify it's fixed  

---

## For Developers

### Code Location
- **File**: `GemBot_Control_AI.html`
- **Method**: `startDiagnostic()` in MerlinPersonality class
- **Button Handler**: Line ~6449

### To Test
```javascript
// In browser console, type:
merlin.startDiagnostic();

// Or click the button in the UI
```

### Key Methods
```javascript
merlin.promptForUserName()        // Get user's name
merlin.startDiagnostic()          // Begin diagnostic
merlin.beginDiagnosticQuestions() // Ask questions
merlin.completeDiagnostic()       // Finish and analyze
merlin.generateRepairGuidance()   // Provide fix steps
```

### Data Saved
- User name → `userProfile.userName`
- Machine health → `userProfile.machineHealthStatus`
- Full history → `userProfile.diagnosticHistory`

---

## The 7 Questions

| # | Question | What It Tests | Answer With |
|---|----------|--------------|-------------|
| 1 | "Your name is [Name], correct?" | Personal info | YES or NO |
| 2 | "How experienced are you?" | Knowledge level | Beginner / Intermediate / Advanced |
| 3 | "Can SCAN show Arduino ports?" | Connection | YES or NO |
| 4 | "Do motors respond?" | Motor control | YES or NO |
| 5 | "Do HOME & SYNC work?" | Position tracking | YES or NO |
| 6 | "Does camera show video?" | Camera | YES or NO |
| 7 | "Emergency stop tested?" | Safety | YES or NO |

---

## What Gets Fixed

### If Connection Fails
→ 6-step guide to troubleshoot USB, ports, cables, drivers

### If Motors Don't Move
→ 6-step guide to check power, jams, cables, speed settings

### If Position is Wrong
→ 6-step guide to reset position, synchronize, check encoders

### If Camera Doesn't Work
→ 6-step guide to check permissions, conflicts, alternatives

### If Safety Untested
→ Reminder to test Emergency Stop before cutting

---

## Example Interaction

```
[You click 🔧 DIAGNOSTIC]

🧙 Merlin: "Greetings, seeker. What is your name, dear student?"
[Name prompt appears]

[You type: "Sarah"]

✅ Name captured: Sarah

🧙 Merlin: "Ah, Sarah! What a fine name..."

[Question 1 of 7]
First, let me confirm: your name is Sarah, correct?

[You type: "yes"]

🧙 Merlin: "Good. I will remember you well."

[Question 2 of 7]
How experienced are you with gemstone cutting?
1. Beginner
2. Intermediate
3. Advanced

[You type: "Beginner"]

🧙 Merlin: "Wisdom begins with humility. We shall grow together."

... [Questions 3-7 continue] ...

✅ DIAGNOSTIC COMPLETE
🧙 Merlin: "Sarah, your machine is in excellent condition!"
```

---

## Troubleshooting

### "Button doesn't appear"
- Reload the page
- Check browser console (F12) for errors
- Verify JavaScript is enabled

### "Name prompt doesn't show"
- Try again - only shows first time
- Clear localStorage to reset
- Check browser popup blockers

### "Can't answer questions"
- Just type YES, NO, or the number of your choice
- Hit ENTER or click the send button
- The system is flexible with answers

### "Got stuck?"
- Reload the page and try again
- Clear browser cache and refresh
- Check browser console for error messages

---

## Files to Know

### Main Application
- `GemBot_Control_AI.html` - Contains all code (6,676 lines)

### Documentation  
- `DIAGNOSTIC_SYSTEM_COMPLETE.md` - Complete feature overview
- `DIAGNOSTIC_USER_GUIDE.md` - Detailed user instructions
- `DIAGNOSTIC_DEVELOPER_REFERENCE.md` - Technical API reference
- `IMPLEMENTATION_COMPLETE_SUMMARY.md` - Project summary
- `DIAGNOSTIC_QUICK_START.md` - This file

---

## Key Features

✅ **Personalized**: Remembers your name and uses it throughout  
✅ **Intelligent**: Adapts questions based on your experience  
✅ **Helpful**: Provides specific repair steps, not generic advice  
✅ **Persistent**: Saves your data across sessions  
✅ **Safe**: Emphasizes testing emergency stop  
✅ **Quick**: Takes 2-3 minutes to complete  
✅ **Repeatable**: Run anytime to verify fixes  

---

## Commands Reference

For developers, these work in browser console:

```javascript
// Start diagnostic
merlin.startDiagnostic();

// Just get name (usually automatic)
merlin.promptForUserName();

// Check machine health status
console.log(merlin.userProfile.machineHealthStatus);

// See all diagnostics done
console.log(merlin.userProfile.diagnosticHistory);

// See current user name
console.log(merlin.userProfile.userName);
```

---

## What's New vs. Before

### Before
- No name capture
- No machine diagnostics
- No repair guidance
- No health tracking
- Users had to guess what was wrong

### After
- Merlin remembers your name
- 7 smart questions test each system
- Specific repair guides for each issue
- Machine health status tracked over time
- Merlin guides you to fix problems

---

## Next Steps

1. **Try it out**: Click 🔧 DIAGNOSTIC and tell Merlin your name
2. **Answer questions**: Be honest about what works/doesn't
3. **Review results**: See if your machine is healthy
4. **If needed**: Follow Merlin's repair steps
5. **Test fixes**: Run diagnostic again to verify

---

## Quick Facts

- **7 questions** about your machine
- **5 health metrics** tracked: connection, motors, position, camera, safety
- **4 repair guides** available: connection, motors, position, camera
- **3 types** of responses: good, issues found, safety warning
- **2 minutes** to complete diagnostic
- **1 click** to get started

---

## Still Have Questions?

- Read `DIAGNOSTIC_USER_GUIDE.md` for detailed walkthrough
- Read `DIAGNOSTIC_DEVELOPER_REFERENCE.md` for technical details
- Check browser console (F12) for debug messages
- Look at existing diagnostic history in console

---

## You're All Set! 🎉

Everything is ready to go. Just click **🔧 DIAGNOSTIC** and Merlin will guide you through the rest.

Good luck with your gemstones! 💎✨

