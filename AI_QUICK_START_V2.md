# GemBot AI Assistant v2 - Quick Reference Guide

## 🎯 What's New

Your GemBot now has an intelligent AI assistant that:
- ✅ Talks like JARVIS (sophisticated British butler)
- ✅ Understands 9 different types of questions
- ✅ Shows helpful buttons when you're stuck
- ✅ Learns from failures and warns you
- ✅ Greets you on power-up
- ✅ Helps elderly/inexperienced users
- ✅ Monitors your cutting process

## 💬 How to Chat

### Simple Questions (AI Understands These)

**About Position**: "Where am I?" / "What's my position?" / "Show coordinates"
- AI tells you current X, Y, Rotation, Index

**About Mode**: "What's continuous mode?" / "How does step mode work?"
- AI explains current mode and alternatives

**About Speed**: "How fast?" / "What's the current speed?"
- AI shows level 1-5 with implications

**About Cutting**: "How do I cut?" / "Tell me about the process"
- AI gives step-by-step technique guidance

**About Stones**: "How do I switch stones?" / "Tell me about lap selection"
- AI shows complete switching procedure with helper buttons

**If Stuck**: "Motor won't move" / "Command not working" / "Connection lost"
- AI diagnoses problem and shows troubleshooting steps

**Emergency**: "Help!" / "Emergency!" / "Stuck!"
- AI provides immediate crisis guidance

### Assistant Responses

AI speaks in these personalities:
- **Greeting**: "Good morning. I am your GemBot assistant. All systems are nominal."
- **Working**: "Understood. I am monitoring the situation."
- **Alert**: "I must bring something to your attention."
- **Offering Help**: "How may I be of service in your cutting endeavor?"

## 🎯 Helper Buttons

When you ask for help, buttons appear:

| Button | What It Does |
|--------|-------------|
| 📚 How to Cut | Complete cutting procedure step-by-step |
| 🔄 Switch Stone | Full stone/lap switching with HOME button |
| 🛑 Emergency Help | Immediate action if in crisis |
| 🔧 Troubleshoot | Systematic problem diagnosis |
| 🏠 Go Home | Instantly execute HOME command |
| 📖 Quick Guide | One-minute orientation to basics |

**Click any button to see detailed guidance!**

## 🔊 Voice Features

### Jarvis Voice Automatically Set
When you connect:
1. AI selects best available English voice
2. Sets slower speed (0.85x) for clarity
3. Uses lower pitch (0.9) for sophistication
4. Volume set to 0.9

### You Can Adjust
- **Toggle**: Click 🔊 Voice ON/OFF button
- **Speed**: Slower (0.5x) to Faster (2.0x)
- **Pitch**: Lower (0.5) to Higher (2.0)
- **Volume**: 0-100%

### Auto-Speak
- AI automatically speaks all responses
- Can turn off with toggle button
- Settings saved for next session

## ♿ Accessibility Mode

### For Elderly or Inexperienced Users

**Click** the ♿ **Accessibility** button in top right of AI panel

**Enables**:
- ✅ Larger text (16px instead of 14px)
- ✅ Simpler language (no jargon)
- ✅ Extra spacing (easier to read)
- ✅ Button tooltips (hover to see what each does)
- ✅ More confirmation messages
- ✅ Helpful encouragement

**Example**:
- **Normal**: "Position: X=23, Y=45"
- **Accessibility**: "Your position: X-axis is at 23, Y-axis is at 45"

## 🔍 AI Learning

### Failure Detection
AI watches for problems:
- **Stuck Motor**: Motor not responding
- **Connection Lost**: Serial link broken
- **Ignored Commands**: Sent but not working
- **Camera Issues**: Video not available

### Pattern Recognition
After same failure happens 3+ times:
- AI alerts you: "I have noticed this issue 3 times"
- Shows troubleshooting steps
- Offers helper buttons
- Remembers pattern for future warnings

### Example
```
[3rd time motor stuck]
AI: "The motor has become unresponsive 3 times. 
     Try: 1) HOME button 2) EMERGENCY STOP 3) Reconnect"
[Shows troubleshooting buttons]
```

## 🏠 Power-Up Sequence (Automatic)

### On Page Load (1-2 seconds)
**Jarvis Voice**: "Good morning. I am your GemBot assistant. All systems are nominal and prepared for operation."

### On Connection Success (auto-detected)
**Jarvis Voice**: "Connection established. All systems green. Ready to proceed with your cutting session."

**2 seconds later**, Jarvis gives random helpful tip:
- "For optimal results, use STEP mode during positioning"
- "The camera is available for visual verification"
- "Do not hesitate to ask for guidance anytime"

### On Connection Loss
**Jarvis Voice**: "Connection lost. Machine state saved. Upon reconnection, I will restore your session."

## 📝 Example Conversations

### Example 1: Beginner Asking About Mode
```
You: "I don't understand continuous mode"

Jarvis: "In CONTINUOUS mode, hold a button to move continuously. 
        Release to stop. This is ideal for longer movements. 
        Your machine is currently in CONTINUOUS mode."

[Buttons appear: 📖 Quick Guide | 📚 How to Cut]
```

### Example 2: Stuck Motor (3rd Time)
```
You: "Motor won't work again!"

Jarvis: "I have observed a recurring issue: The motor has become 
        unresponsive 3 times. This suggests a connection or position 
        issue. First try HOME button, then EMERGENCY STOP if unresponsive, 
        then reconnect."

[Buttons appear: 🔧 Troubleshoot | 🏠 Go Home | 🛑 Emergency Help]
```

### Example 3: Asking About Cutting Process
```
You: "How do I cut a stone?"

Jarvis: "The cutting process requires precision and patience. 
        Position your stone carefully using STEP mode for accuracy. 
        Use the appropriate lap for your stage: rough cut first, 
        then fine cut, then polish. Monitor your angle and check 
        progress frequently. Remember to use HOME button between 
        major adjustments."

[Buttons appear: 📚 How to Cut | 🔄 Switch Stone | 🏠 Go Home]
```

### Example 4: Cut Complete (Auto-Detection)
```
[AI monitors your position - you haven't moved for a while]

Jarvis: "💡 You appear to be near your final position. 
        Is the cut complete?"

You: "Yes, now I need to switch stones"

Jarvis: "[Full stone switching guide with step-by-step]"

[Buttons appear: 🔄 Switch Stone | 🏠 Go Home]
```

## 🎬 Knowledge Base Topics

AI can help with:

### Cutting
- How to position stone
- What speed to use
- What mode for precision
- Detecting when cut is complete
- How to switch stones

### Control
- What STEP mode does
- What CONTINUOUS mode does
- How speed 1-5 work
- How X/Y axes work
- Using rotation and index

### Emergency
- When to press EMERGENCY STOP
- What happens after emergency stop
- How to recover
- Power loss recovery

### Troubleshooting
- Motor won't move
- Connection lost
- Camera not working
- Command ignored
- Position wrong

## 💡 Pro Tips

1. **Before you start**: Ask "how do I cut?" for full procedure
2. **If stuck**: Click helper buttons - they have step-by-step guides
3. **For precision**: Always use STEP mode
4. **For quick moves**: Increase speed but lower it again for final cuts
5. **Always**: Use HOME button to reset position between major changes
6. **Emergency**: EMERGENCY STOP works instantly, don't hesitate
7. **Accessibility**: Enable ♿ if text too small or confusing
8. **Voice**: AI speaks responses - turn up volume if can't hear

## ❓ Frequently Asked Questions

**Q: Will AI teach me everything?**
A: Yes! Ask questions and it will guide you step-by-step

**Q: Can I turn off voice?**
A: Yes, click 🔊 Voice ON/OFF button

**Q: Does it remember past failures?**
A: Yes, it learns patterns and warns you if same issue happens again

**Q: What if I don't understand?**
A: Click helper buttons for more detailed step-by-step guides

**Q: Can elderly people use it?**
A: Yes! Click ♿ Accessibility for larger text and simpler language

**Q: What if power fails?**
A: AI saves your position and recovers it automatically on reconnect

**Q: Can I ask any question?**
A: Yes! AI understands questions about cutting, control, positioning, 
   emergencies, stone switching, speeds, modes, and troubleshooting

## 🎯 Summary

Your GemBot AI is like having an expert guide with you:
- **Smart**: Understands your questions
- **Helpful**: Shows buttons to guide you
- **Learning**: Detects and warns about problems
- **Friendly**: Talks like a British butler
- **Accessible**: Works for everyone including elderly users
- **Reliable**: Saves your work and recovers from failures

Just ask it anything about gem cutting and it will help!

---

**Questions?** Type in the chat box and AI will respond!  
**Stuck?** Click a helper button for step-by-step guidance!  
**Need help?** Say "Help!" and AI gives emergency assistance!

