# GemBot AI Learning Progression System

## Overview

Merlin (the AI assistant) now implements a **smart learning progression system** that:

1. **Tracks what you've learned** - Never repeats the same lesson twice
2. **Teaches in logical order** - Builds knowledge progressively
3. **Provides structured lessons** - Organized, step-by-step instruction
4. **Highlights web features** - Shows how web controls mirror touch screen functions
5. **Maintains context** - Remembers completed lessons within the session

---

## Learning Progression Order

When you ask for help, Merlin will teach lessons in this sequence:

### Lesson 1: Nextion Menu Structure
**Trigger**: Ask for help, teach, learn, guide, tutorial, beginner, or lesson
**Topics Covered**:
- Main Menu and its 5 options
- Design Menu (8 cutting phases)
- Manual Control Menu
- Settings Menu
- Menu navigation patterns

**What You Learn**:
- How the touch screen is organized
- What each menu section does
- How to navigate between menus

### Lesson 2: Web Menu Navigation
**Prerequisites**: Completed Lesson 1
**Topics Covered**:
- LEFT button (◀) - Command '1' - Navigate back/left
- ENTER button (✓) - Command '0' - Select/confirm
- RIGHT button (▶) - Command '3' - Navigate forward/right
- SYNC button - Update with touch screen state
- Step-by-step menu navigation technique

**What You Learn**:
- How to navigate menus from the web interface
- What each menu button does
- How to use the SYNC button to see current menu state

### Lesson 3: Manual Motion Control (D-PAD)
**Prerequisites**: Completed Lesson 2
**Topics Covered**:
- UP button (↑) - Y-axis forward (toward lap)
- DOWN button (↓) - Y-axis backward (away from lap)
- LEFT button (◀) - X-axis left (counter-clockwise rotation)
- RIGHT button (▶) - X-axis right (clockwise rotation)
- STEP vs CONTINUOUS modes for each axis

**What You Learn**:
- How to move each machine axis
- Difference between STEP (precise) and CONTINUOUS (smooth) movement
- When to use each mode for different tasks

### Lesson 4: Mode & Speed Control
**Prerequisites**: Completed Lesson 3
**Topics Covered**:
- STEP MODE: One movement per click (precision)
- CONTINUOUS MODE: Hold for smooth movement (flow)
- Speed Levels 1-5:
  - Level 1-2: Polishing precision
  - Level 3: Balanced work
  - Level 4-5: Aggressive roughing

**What You Learn**:
- How to toggle between modes
- Speed levels for different cutting phases
- Control vs Speed tradeoff
- Best practices for each cutting phase

### Lesson 5: Cutting Phases (Unlocked after Lessons 1-4)
**Prerequisites**: Completed Lessons 1-4
**Topics Covered**:
- Roughing Phase (Speed 4-5, CONTINUOUS)
- Fine Cutting Phase (Speed 2-3, STEP)
- Polishing Phase (Speed 1-2, STEP)
- Phase-specific techniques and settings

### Lesson 6: Stone Properties (Unlocked after Lessons 1-5)
**Prerequisites**: Completed Lessons 1-5
**Topics Covered**:
- Diamond properties and cutting requirements
- Ruby/Sapphire properties and techniques
- Emerald handling (fragile stone)
- Opal characteristics (fragile, special care)
- Speed and technique for each stone type

### Lesson 7: Emergency Procedures (Available anytime)
**Trigger**: Ask about emergency, stop, danger, stuck
**Topics Covered**:
- Emergency stop button location and use
- Motor release procedures
- Safe recovery from emergency state
- When to call for help

---

## How to Use the Learning System

### Starting a Lesson
Simply ask Merlin one of these questions:

```
"Can you teach me?"
"Help me learn this"
"Show me the tutorial"
"How do I start?"
"What should I learn first?"
"Guide me through the basics"
"Teach me the menu system"
"I'm a beginner"
```

### Progressing Through Lessons
- **Complete Lesson 1** → Lesson 2 becomes available
- **Complete Lesson 2** → Lesson 3 becomes available
- **Complete Lesson 3** → Lesson 4 becomes available
- **Complete Lesson 4** → Lessons 5-6 unlock
- **Complete All** → Merlin recognizes mastery and shifts to advanced guidance

### Skipping Lessons
You don't have to learn in order! Ask about any specific topic:
- "Tell me about mode and speed"
- "How do I control the D-PAD?"
- "What's the menu structure?"

Merlin will teach that topic and mark it as learned.

### Resuming Learning
The system remembers within the session:
- If you complete Lesson 1, it stays completed
- The next time you ask for help, you'll get Lesson 2
- Lessons completed in this session won't be repeated

---

## Web Control Features Highlighted in Each Lesson

### In Lesson 1: Menu Structure
Shows how web interface mirrors Nextion menu organization

### In Lesson 2: Menu Navigation
Highlights the three web menu buttons:
- **LEFT button** with icon ◀
- **ENTER button** with icon ✓
- **RIGHT button** with icon ▶
- **SYNC button** to verify state

### In Lesson 3: Motion Control
Shows the D-PAD button layout:
```
        ↑ (UP)
    ← (LEFT)  → (RIGHT)
        ↓ (DOWN)
```
Explains how each button maps to machine axes

### In Lesson 4: Mode & Speed
Highlights:
- **MODE BUTTON** - Toggle between STEP and CONTINUOUS
- **SPEED SLIDER** - Adjust levels 1-5
- **Speed UP/DOWN buttons** - Quick adjustments

---

## Learning Progression Data Structure

The system tracks progress in `learningProgress`:

```javascript
this.learningProgress = {
    completedLessons: [
        'nextion_menu_structure',
        'menu_navigation_web_control',
        // ... completed lessons stored here
    ],
    currentLesson: null,
    maxContext: 20
};
```

### Methods for Managing Learning

**Check if lesson completed**:
```javascript
gemBotAI.hasLearnedLesson('menu_navigation_web_control') // true/false
```

**Mark lesson as completed**:
```javascript
gemBotAI.completeLesson('nextion_menu_structure')
```

**Get next available lesson**:
```javascript
const nextLesson = gemBotAI.getNextLesson()
// Returns: 'menu_navigation_web_control' or null if all complete
```

---

## Automatic Lesson Teaching Methods

The AI now has dedicated teaching methods:

```javascript
// Teach Nextion touch screen menu structure
gemBotAI.teachNextionMenuStructure()

// Teach how to navigate using web controls
gemBotAI.teachMenuNavigation()

// Teach manual axis control with D-PAD
gemBotAI.teachManualControl()

// Teach mode switching and speed control
gemBotAI.teachModeAndSpeed()
```

Each method returns a formatted lesson with:
- Clear visual hierarchy
- Step-by-step instructions
- Web control button references
- Practical examples
- Pro tips and best practices

---

## Example Conversation Flow

### User asks for help as a beginner:

**User**: "I don't know how to use this. Can you teach me?"

**Merlin** (Lesson 1): Shows complete Nextion menu structure with visual tree
```
📍 **MAIN MENU**
├─ ▶ DESIGN (Cutting phase selection)
├─ ▶ HOME (Return to safe position)
...
```
Explains each menu section and how to navigate.

---

### User completes first lesson, asks for next help:

**User**: "What's next?"

**Merlin** (Lesson 2): Shows the three menu buttons
- Explains LEFT button (◀) - Command '1'
- Explains ENTER button (✓) - Command '0'
- Explains RIGHT button (▶) - Command '3'
- Shows how to use SYNC button

---

### User completes menu navigation, asks about motion:

**User**: "How do I move the machine?"

**Merlin** (Lesson 3): Shows D-PAD control
- UP moves Y-axis toward lap
- DOWN moves Y-axis away from lap
- LEFT rotates counter-clockwise
- RIGHT rotates clockwise
- Explains STEP vs CONTINUOUS difference

---

### User learns D-PAD, needs to understand control:

**User**: "When do I use STEP mode?"

**Merlin** (Lesson 4): Teaches mode and speed
- STEP = one click = one movement (precision)
- CONTINUOUS = hold = smooth flow (rough work)
- Speed 1-2 for polishing
- Speed 3 for balanced work
- Speed 4-5 for aggressive roughing

---

### All fundamentals learned, ready for advanced topics:

**User**: "What do I learn now?"

**Merlin**: "You have mastered the fundamental lessons! You now understand the touch screen menus, web controls, manual operation, and speed/mode settings. You're ready for advanced cutting techniques. Ask me about: stone properties, cutting phases, or specific techniques."

---

## Benefits of This System

✅ **No Knowledge Duplication** - Same lesson never repeated unless explicitly asked
✅ **Logical Progression** - Fundamentals first, advanced topics after
✅ **User Confidence** - Clear pathway from beginner to proficient
✅ **Organized Learning** - Not overwhelming; lessons build on each other
✅ **Web-Centric** - Emphasizes web control features alongside touch screen knowledge
✅ **Flexible** - Can skip ahead to specific topics anytime
✅ **Session Memory** - Progress tracked within the conversation session

---

## Testing the Learning System

### To Test Lesson Progression:

1. Open GemBot_Control_AI.html in browser
2. In console (F12 → Console tab), test:

```javascript
// Check initial state
console.log(gemBotAI.learningProgress.completedLessons); // Should be empty []

// Check next lesson
console.log(gemBotAI.getNextLesson()); // 'nextion_menu_structure'

// Ask for help
// Type in chat: "Can you teach me?"
// Should get Lesson 1

// Check completed lessons
console.log(gemBotAI.learningProgress.completedLessons); // ['nextion_menu_structure']

// Get next lesson
console.log(gemBotAI.getNextLesson()); // 'menu_navigation_web_control'

// Ask for help again
// Type in chat: "What else should I learn?"
// Should get Lesson 2
```

---

## Extending the Learning System

To add new lessons:

1. **Add lesson ID to lesson list** (in `getNextLesson()`):
```javascript
const lessons = [
    'nextion_menu_structure',
    'menu_navigation_web_control',
    'manual_control_web_dpad',
    'mode_and_speed_control',
    'cutting_phases',
    'stone_properties',
    'emergency_procedures',
    'your_new_lesson_id'  // Add here
];
```

2. **Create teaching method**:
```javascript
teachYourNewLesson() {
    let response = `Your lesson title...\n\n`;
    response += `Lesson content with formatting...\n`;
    response += `Step-by-step instructions...\n`;
    
    this.completeLesson('your_new_lesson_id');
    return response;
}
```

3. **Add trigger in getSmartContextResponse()**:
```javascript
} else if (nextLesson === 'your_new_lesson_id') {
    return this.teachYourNewLesson();
}
```

---

## Summary

The **AI Learning Progression System** transforms Merlin from a reactive answerer to a **proactive teacher** that:

- **Guides users through systematic learning**
- **Never wastes time with repetition**
- **Builds confidence through structured progression**
- **Highlights web control capabilities**
- **Remembers what you've already learned**

Start your journey: Simply ask Merlin **"Can you teach me?"** and begin mastering GemBot!
