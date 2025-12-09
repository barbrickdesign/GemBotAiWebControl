# 🔧 DIAGNOSTIC SYSTEM - DEVELOPER REFERENCE

## Architecture Overview

The diagnostic system is implemented as a collection of methods in the `MerlinPersonality` class. It integrates with the existing:
- User profile persistence system
- Message display system (`addMessage()`)
- Machine state tracking
- localStorage for data persistence

---

## Class Methods

### 1. `promptForUserName()`

**Purpose**: Display a browser prompt asking for the user's name

**Parameters**: None

**Returns**: void (saves name to `this.userProfile.userName`)

**Code Location**: MerlinPersonality class, ~367 lines from start

**Behavior**:
- Checks if `userProfile.userName` is already set
- If already set, returns immediately (no duplicate prompts)
- If not set, shows browser prompt dialog
- Saves trimmed name to `userProfile.userName`
- Calls `this.saveUserProfile()` to persist
- Adds Merlin message: "Ah, [Name]! What a fine name. I shall remember you well."
- Logs to console: "✅ User name captured: [Name]"

**Example Usage**:
```javascript
merlin.promptForUserName();
```

---

### 2. `startDiagnostic()`

**Purpose**: Initialize and begin the diagnostic workflow

**Parameters**: None

**Returns**: void

**Behavior**:
1. Calls `promptForUserName()` if no name exists
2. Sets `this.userProfile.diagnosticMode = true`
3. Initializes `this.userProfile.currentDiagnostic` object with:
   - `startTime`: Current timestamp
   - `questionsAsked`: Empty array
   - `responses`: Empty array
   - `machineHealth`: Empty object
4. Displays welcome message mentioning user's name
5. After 500ms delay, calls `beginDiagnosticQuestions()`

**Example Usage**:
```javascript
merlin.startDiagnostic();
```

**Related Data**:
```javascript
this.userProfile = {
    userName: "Sarah",
    diagnosticMode: true,
    currentDiagnostic: {
        startTime: Date,
        questionsAsked: [],
        responses: [],
        machineHealth: {}
    }
}
```

---

### 3. `beginDiagnosticQuestions()`

**Purpose**: Launch the 7-question diagnostic sequence

**Parameters**: None

**Returns**: void

**Questions Array**: Contains 7 question objects:
```javascript
[
    {
        id: 'name_confirm',
        question: String,
        category: 'personal'|'knowledge'|'connection'|'motors'|'position'|'camera'|'safety',
        type: 'yes_no'|'choice',
        followUps: Object
    },
    // ... 6 more questions
]
```

**Behavior**:
1. Defines array of 7 diagnostic questions
2. Sets `this.userProfile.diagnosticMode = true`
3. Calls `askDiagnosticQuestion(questions, 0)` to start at first question

**Example Usage**:
```javascript
merlin.beginDiagnosticQuestions();
```

---

### 4. `askDiagnosticQuestion(questions, index)`

**Purpose**: Display a single diagnostic question and wait for response

**Parameters**:
- `questions` (Array): Full array of question objects
- `index` (Number): Current question index (0-6)

**Returns**: void

**Behavior**:
1. Checks if `index >= questions.length` → if so, calls `completeDiagnostic()`
2. Gets current question from `questions[index]`
3. Calculates remaining questions count
4. Stores questions array in `currentDiagnostic.allQuestions`
5. Formats and displays the question via `addMessage()`:
   - Shows "[Question X of Y]"
   - Shows question text
   - Shows instructions based on question type:
     - YES/NO: "Please answer with YES or NO"
     - CHOICE: Lists options with numbers "1. Option1\n2. Option2\n..."
6. Sets `window.pendingDiagnosticState` object with:
   - `currentQuestion`: Current question object
   - `questions`: Full questions array
   - `currentIndex`: Current index
   - `onAnswer`: Callback function
7. Waits for user to send message (message handler checks `pendingDiagnosticState`)

**Example Usage**:
```javascript
// Called internally by beginDiagnosticQuestions()
this.askDiagnosticQuestion(questions, 2);
```

**Window State**:
```javascript
window.pendingDiagnosticState = {
    currentQuestion: {...},
    questions: [...],
    currentIndex: 2,
    onAnswer: function(response) {...}
}
```

---

### 5. `handleDiagnosticAnswer(question, response, questions, index)`

**Purpose**: Process user's response to a diagnostic question

**Parameters**:
- `question` (Object): Current question object
- `response` (String): User's text response
- `questions` (Array): Full questions array
- `index` (Number): Current question index

**Returns**: void

**Behavior**:
1. Records response to `currentDiagnostic`:
   - Adds question ID to `questionsAsked`
   - Adds response object to `responses` array with:
     - `questionId`, `category`, `response`, `timestamp`
2. Provides Merlin follow-up based on response:
   - For YES/NO questions: Checks if response starts with "yes"/"y"/"true"/"1"/"ok"/"sure"/"yep"
   - Updates `machineHealthStatus` based on answer:
     - Connection: Sets `connectionStatus` = "OK"/"FAILED"
     - Motors: Sets `motorResponsiveness` = "GOOD"/"FAILED"
     - Position: Sets `positionAccuracy` = "GOOD"/"FAILED"
     - Camera: Sets `cameraFunctionality` = "WORKING"/"NOT_WORKING"
     - Safety: Sets `emergencyStopStatus` = "TESTED"/"UNTESTED"
   - Updates `skillLevel` for experience question
3. Displays appropriate `followUp` message via `addMessage()`
4. After 1 second delay, calls `askDiagnosticQuestion(questions, index + 1)`

**Health Status Updates**:
```javascript
this.userProfile.machineHealthStatus = {
    connectionStatus: 'OK' | 'FAILED',
    motorResponsiveness: 'GOOD' | 'FAILED',
    positionAccuracy: 'GOOD' | 'FAILED',
    cameraFunctionality: 'WORKING' | 'NOT_WORKING',
    emergencyStopStatus: 'TESTED' | 'UNTESTED'
}
```

**Example Usage**:
```javascript
// Called from message handler via onAnswer callback
this.handleDiagnosticAnswer(question, "yes", questions, 3);
```

---

### 6. `completeDiagnostic()`

**Purpose**: Finalize diagnostic and generate results/repair guidance

**Parameters**: None

**Returns**: void

**Behavior**:
1. Checks if all systems are healthy:
   - `connectionStatus === 'OK'`
   - `motorResponsiveness === 'GOOD'`
   - `positionAccuracy === 'GOOD'`
   - `cameraFunctionality === 'WORKING'`
2. Sets `diagnosticMode = false`
3. Saves current diagnostic to `diagnosticHistory` array
4. Calls `this.saveUserProfile()` to persist
5. If all good: Displays success message
   - "✅ DIAGNOSTIC COMPLETE"
   - "Your machine is in excellent condition!"
   - Personalizes with user's name
6. If issues found: Calls `generateRepairGuidance(machineHealthStatus)`

**Example Usage**:
```javascript
// Called automatically when last question is answered
merlin.completeDiagnostic();
```

---

### 7. `generateRepairGuidance(health)`

**Purpose**: Create personalized repair instructions for identified issues

**Parameters**:
- `health` (Object): Machine health status object with 5 properties

**Returns**: void (displays guidance via `addMessage()`)

**Repair Guides Provided**:

#### Connection Issues (6 steps)
1. Check USB cable connection
2. Try different USB port
3. Try different USB cable
4. Restart software and SCAN again
5. Check Device Manager/System Report
6. Install Arduino drivers if needed

#### Motor Issues (6 steps)
1. Verify power is on (check power LED)
2. Check for physical jams
3. Verify motor cable connections
4. Test Emergency Stop → RESET procedure
5. Test with SLOW speed first
6. Check for dead motor or bad connection

#### Position Tracking Issues (6 steps)
1. Click HOME to reset position
2. Manually move to known position
3. Click SYNC to synchronize
4. Check encoder integrity
5. Verify encoder cables are tight
6. Note position resets on reconnect (normal)

#### Camera Issues (6 steps)
1. Check camera is plugged in
2. Verify lens is not covered
3. Allow camera permissions in browser
4. Restart browser
5. Check for app conflicts
6. Try alternative camera if available

#### Safety Warning
- If Emergency Stop untested: Emphasizes testing requirement

**Example Usage**:
```javascript
const health = this.userProfile.machineHealthStatus;
this.generateRepairGuidance(health);
```

---

## Integration Points

### 1. Message Handler Integration

**Location**: Event listener for `#aiSendBtn` click

**Code**:
```javascript
document.getElementById('aiSendBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    if (message) {
        addMessage(message, 'user');
        
        // Check if we're in diagnostic mode
        if (window.pendingDiagnosticState) {
            const diagnostic = window.pendingDiagnosticState;
            diagnostic.onAnswer(message);
            window.pendingDiagnosticState = null;
        } else {
            // Normal AI handling
            await ai.handleUserQuery(message);
        }
        
        input.value = '';
    }
});
```

### 2. Button Event Handler

**Location**: Button event listeners section

**Code**:
```javascript
document.getElementById('btnDiagnostic')?.addEventListener('click', () => {
    console.log('🔧 DIAGNOSTIC BUTTON CLICKED - Starting Merlin diagnostic system');
    merlin.startDiagnostic();
});
```

### 3. Data Persistence

**Uses Existing Methods**:
- `this.saveUserProfile()` - Saves to localStorage
- `this.loadUserProfile()` - Loads from localStorage
- Called after name capture and after diagnostic complete

---

## Data Flow Diagram

```
User clicks 🔧 DIAGNOSTIC
    ↓
startDiagnostic()
    ├─ promptForUserName() [if needed]
    ├─ Save name to userProfile.userName
    ├─ Set diagnosticMode = true
    └─ Call beginDiagnosticQuestions()
         ↓
    beginDiagnosticQuestions()
         ├─ Create 7 question array
         └─ Call askDiagnosticQuestion(questions, 0)
             ↓
        askDiagnosticQuestion(questions, index)
             ├─ Display current question
             ├─ Set window.pendingDiagnosticState
             └─ Wait for user input
                 ↓
            [User types response and sends]
                 ↓
            Message handler routes to diagnostic
                 ↓
            handleDiagnosticAnswer(question, response, questions, index)
                 ├─ Record response
                 ├─ Update machineHealthStatus
                 ├─ Display follow-up message
                 └─ After 1s: Call askDiagnosticQuestion(questions, index + 1)
                     ↓
                [Loop back for questions 2-7]
                     ↓
            completeDiagnostic()
                 ├─ Check all systems
                 ├─ Save to diagnosticHistory
                 ├─ Save userProfile
                 └─ If issues: generateRepairGuidance()
```

---

## State Objects

### userProfile

```javascript
{
    // Existing fields
    userName: "Sarah",
    sessionCount: 5,
    skillLevel: "intermediate",
    questionsAsked: [...],
    topicsLearned: [...],
    troubleSpots: [...],
    favoriteStones: [...],
    
    // Diagnostic fields
    diagnosticMode: false,          // Boolean, true during diagnostic
    currentDiagnostic: {            // Object, active diagnostic session
        startTime: Date,
        questionsAsked: [],
        responses: [],
        machineHealth: {}
    },
    diagnosticHistory: [            // Array, past diagnostics
        {
            startTime: Date,
            questionsAsked: [...],
            responses: [...],
            machineHealth: {...}
        },
        // ... more past diagnostics
    ],
    machineHealthStatus: {          // Object, current machine health
        connectionStatus: 'OK' | 'FAILED',
        motorResponsiveness: 'GOOD' | 'FAILED',
        positionAccuracy: 'GOOD' | 'FAILED',
        cameraFunctionality: 'WORKING' | 'NOT_WORKING',
        emergencyStopStatus: 'TESTED' | 'UNTESTED'
    }
}
```

### pendingDiagnosticState (window object)

```javascript
window.pendingDiagnosticState = {
    currentQuestion: {...},        // Current question object
    questions: [...],              // All 7 questions
    currentIndex: 2,               // Index 0-6
    onAnswer: function(response) {} // Callback when user responds
}
```

---

## Console Logging

The diagnostic system logs extensively for debugging:

```
✅ User name captured: Sarah
🔧 DIAGNOSTIC BUTTON CLICKED - Starting Merlin diagnostic system
🔧 DIAGNOSTIC MODE STARTED
[Question 1 of 7]
🧙 Merlin says: "Ah, Sarah! Visit 3..."
... [per-question logs] ...
✅ DIAGNOSTIC COMPLETE
```

---

## Error Handling

### Graceful Degradation

1. **No name provided**: Skips name prompt, uses "dear student" or "friend" in messages
2. **Invalid response**: Defaults to "no" for yes/no questions
3. **Missing question data**: Uses generic follow-up messages
4. **localStorage error**: Continues without persistence

### Try-Catch Blocks

All critical operations wrapped in try-catch where applicable:
```javascript
try {
    this.userProfile.userName = userName.trim();
    this.saveUserProfile();
} catch (error) {
    console.error('Error saving user name:', error);
}
```

---

## Performance Considerations

- **Async Operations**: Uses `setTimeout()` for 500-1000ms delays between questions (prevents UI blocking)
- **Memory**: Diagnostic history grows over time; old entries could be archived if needed
- **localStorage**: User profile is JSON stringified; size should remain < 5MB even with extensive history

---

## Testing Checklist

For developers extending this system:

- [ ] Verify name prompt appears on first run
- [ ] Verify name is saved and persists on reload
- [ ] Verify all 7 questions display with correct counter
- [ ] Verify responses are recorded correctly
- [ ] Verify machine health status updates based on responses
- [ ] Verify correct follow-up messages appear
- [ ] Verify repair guides format correctly
- [ ] Verify diagnostic history is saved
- [ ] Verify multiple diagnostics can be run
- [ ] Verify localStorage persistence works
- [ ] Test with edge cases (empty responses, special characters in name, etc.)

---

## Code Size

- **Total methods**: 7
- **Total lines**: ~367 lines
- **Average method size**: ~52 lines
- **Dependencies**: 
  - `addMessage()` (existing)
  - `merlin.saveUserProfile()` (existing)
  - `window.pendingDiagnosticState` (new)

---

## Backward Compatibility

✅ **Fully compatible** with existing code:
- Uses existing `userProfile` object (extends with new fields)
- Respects existing data structures
- Doesn't modify existing methods
- New fields are optional (system works without them)
- Old user profiles load fine and grow diagnostic data over time

---

**Documentation Version**: 1.0  
**Last Updated**: 2025-01-XX  
**Status**: COMPLETE  
