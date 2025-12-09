# 🔧 DIAGNOSTIC SYSTEM - USER GUIDE

## What is the Diagnostic System?

The Diagnostic System is an interactive tool that helps you understand:
1. **How much you know** about your GemBot machine
2. **What's working** properly on your machine
3. **What needs fixing** if something breaks
4. **How to fix it** with step-by-step guidance

Merlin will ask you questions and remember your name, then guide you through repairs with his wizard wisdom.

---

## How to Use the Diagnostic System

### Starting a Diagnostic

1. Click the **🔧 DIAGNOSTIC** button in the top toolbar
2. On your first run, Merlin will ask for your name:
   - A dialog box will appear asking "What is your name, dear student?"
   - Type your name (e.g., "Sarah")
   - Click OK
   - Merlin will remember your name from then on

3. After you provide your name, Merlin begins:
   > "I am Merlin, and I am about to ask you some questions to understand how well you know your machine and whether it is functioning properly."

### Answering Questions

You'll be asked 7 questions about your machine:

```
[Question 1 of 7]

First, let me confirm: your name is Sarah, correct?

Please answer with YES or NO.
```

Type your response in the message box at the bottom. You can type:
- **"yes"** or **"y"** or **"true"** or just **"ok"**
- **"no"** or **"n"** or **"false"**
- For choice questions, type the number or the full choice

### The 7 Diagnostic Questions

#### 1. **Name Confirmation** (Personal)
- **Question**: "First, let me confirm: your name is [Name], correct?"
- **Your Answer**: YES or NO
- **Why**: Merlin wants to make sure he has your name right

#### 2. **Experience Level** (Knowledge Assessment)
- **Question**: "How experienced are you with gemstone cutting?"
- **Your Answer**: Choose from:
  - 1. Beginner
  - 2. Intermediate  
  - 3. Advanced
  - 4. Other
- **Why**: Merlin adjusts his guidance based on your skill level

#### 3. **Connection Status** (Hardware Test)
- **Question**: "When you click the SCAN button at the top, can you see available Arduino ports?"
- **Your Answer**: YES or NO
- **Why**: This checks if your machine can talk to the computer

#### 4. **Motor Response** (Machine Functionality)
- **Question**: "When you click CONNECT and then use the motor controls, do the motors spin and respond?"
- **Your Answer**: YES or NO
- **Why**: This checks if the cutting motors are working

#### 5. **Position Tracking** (Positioning System)
- **Question**: "When you click HOME, does the machine move to a starting position? And when you click SYNC, do the position coordinates update?"
- **Your Answer**: YES or NO
- **Why**: This checks if the machine knows where it is

#### 6. **Camera Function** (Vision System)
- **Question**: "Does the camera start when you click START CAMERA? Do you see a live video feed?"
- **Your Answer**: YES or NO
- **Why**: This checks if the camera system works

#### 7. **Emergency Stop** (Safety System)
- **Question**: "Have you tested the Emergency Stop button? Does it immediately halt all motors?"
- **Your Answer**: YES or NO
- **Why**: Safety is critical - we verify your emergency stop works

---

## After the Questions

### If Everything Works

You'll see a success message from Merlin:

> ✅ DIAGNOSTIC COMPLETE
> 
> 🧙 Merlin says: "Sarah, I have identified some issues that need attention:
>
> Your machine is in excellent condition! All systems are functioning properly.
>
> You are ready to create beautiful gemstones. The path is clear, Sarah."

🎉 Your machine is ready to use!

### If Something Isn't Working

Merlin will show you exactly what's broken and how to fix it:

> ⚠️ MACHINE HEALTH REPORT
> 
> 🧙 Merlin says: "Sarah, I have identified some issues that need attention:
> 
> **Issue 1: CONNECTION**
> 1. Check that your Arduino is properly connected via USB cable
> 2. Try a different USB port on your computer
> 3. Try a different USB cable (sometimes cables fail)
> 4. Restart the GemBot software and try SCAN again
> 5. Check Device Manager (Windows) or System Report (Mac) for Arduino device
> 6. If still failing, your Arduino may need driver installation
> 
> **Issue 2: MOTORS**
> 1. Verify the machine is powered on (check power LED)
> 2. Make sure motors are not physically jammed - try moving by hand
> ... (more steps)
> 
> Once you've tried these steps, you can run DIAGNOSTIC again to verify the fixes worked."

---

## Common Issues & Quick Fixes

### Issue: Connection Not Working

**Most Common Cause**: USB cable is loose or damaged

**Quick Fix**:
1. Check the USB cable connection to your Arduino
2. Try wiggling it gently - does it connect?
3. If not, try a different USB cable
4. Restart the GemBot software and click SCAN again

### Issue: Motors Don't Move

**Most Common Cause**: Machine needs power or motors are jammed

**Quick Fix**:
1. Check that your machine has power (look for a power LED)
2. Try moving the motors by hand - are they stuck?
3. If stuck, gently wiggle them back and forth to free them
4. Turn power back on and try again

### Issue: Position Shows Wrong Coordinates

**Most Common Cause**: The position tracker got out of sync

**Quick Fix**:
1. Click the **HOME** button to reset to starting position
2. Click the **SYNC** button to tell the system where you are
3. Now the coordinates should match reality

### Issue: Camera Doesn't Show Video

**Most Common Cause**: Browser permissions or camera conflict

**Quick Fix**:
1. Make sure no other app is using the camera
2. Check browser permissions for camera access
3. Restart your browser
4. Try running the diagnostic again

### Issue: Emergency Stop Button Untested

**Most Important**: Always test your emergency stop before cutting

**How to Test**:
1. Make sure the machine is moving or running a command
2. Click the **🛑 EMERGENCY STOP** button
3. The machine should immediately stop all movement
4. Good! Your safety system works

---

## Tips for Best Results

✅ **DO**:
- Answer honestly about your experience level
- Test each feature before answering (try clicking the buttons)
- Run diagnostic regularly (monthly is good)
- Share the results with support if you get stuck
- Keep a record of your diagnostic results over time

❌ **DON'T**:
- Guess at answers - actually test the features
- Run diagnostic while the machine is actively cutting
- Ignore safety issues (especially Emergency Stop)
- Assume something "probably works" - test it

---

## Multiple Diagnostics

You can run the diagnostic as many times as you want:

- **First Time**: Merlin asks for your name and runs full diagnostic
- **Second+ Times**: Merlin remembers your name and asks if anything changed
- **After Fixing Issues**: Run diagnostic again to verify fixes worked
- **Regular Checkups**: Monthly diagnostics help catch problems early

---

## Understanding the Results

### Green Light ✅
- Connection: OK
- Motors: GOOD
- Position: GOOD  
- Camera: WORKING
- Emergency Stop: TESTED

This means your system is ready to use!

### Yellow Light ⚠️
- Connection: FAILED
- Motors: FAILED
- Position: FAILED
- Camera: NOT_WORKING
- Emergency Stop: UNTESTED

This means you have something to fix. Merlin will give you step-by-step guidance.

---

## Need More Help?

If the repair steps don't fix the problem:

1. **Note the exact issue** (which system failed)
2. **Try the steps twice** (sometimes needs a second attempt)
3. **Check the console** for error messages (right-click → Inspect → Console tab)
4. **Contact support** with your diagnostic results

---

## Merlin's Wisdom

> "Take your time, and don't hesitate to try things again. The machine responds to patience and careful attention. Each problem you solve teaches you mastery."

Good luck, and happy cutting! 💎✨

