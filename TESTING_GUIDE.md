# GemBot AI Control System - Deployment & Testing Guide

## 🚀 Quick Start

### Server Setup
```powershell
cd c:\Users\barbr\Desktop\GemBotMemory2025
python -m http.server 8000 --bind 127.0.0.1
```

**Then open**: http://127.0.0.1:8000/GemBot_Control_AI.html

---

## ✅ Browser Compatibility

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| Chrome | 89+ | ✅ Full | Recommended - best TensorFlow.js performance |
| Edge | 89+ | ✅ Full | Chromium-based, identical to Chrome |
| Firefox | 130+ | ⚠️ Partial | Web Serial API support limited |
| Safari | 15+ | ❌ No | Web Serial API not supported |

**Recommendation**: Use Chrome or Edge for full feature support

---

## 🧪 Testing Phase 1: Interface & ML Model

### 1. UI Load Test
- [ ] Page loads without errors
- [ ] Dark theme displays correctly
- [ ] All buttons visible and responsive
- [ ] Connection status shows "DISCONNECTED" with red indicator

**Expected**: Professional 3-column layout with purple gradient header

### 2. ML Model Loading Test
1. Click **START CAMERA**
2. Grant camera permission
3. Video stream appears in center panel
4. Check browser console (F12 → Console)
5. Should see: `✅ ML model loaded successfully!` in AI chat

**Expected**: 
- Video feed visible
- Message "ML model loaded successfully"
- No red error messages in console

### 3. Frame Analysis Test (no camera needed)
1. Check **ML Status** at bottom of camera panel
2. Should show: `🔴 Recording • Frame: 0 • Brightness: — • Focus: —%`
3. Once camera starts, these update in real-time

**Expected**: 
- Frame count increases
- Brightness value 0-255
- Focus quality 0-100%

### 4. TensorFlow Detection Test
1. With camera running, point at any object
2. Every 30 frames, should draw green bounding boxes
3. Labels show: `[object name] [confidence]%`

**Expected**:
- Green boxes around detected objects
- Confidence scores 0-100%
- ML chat generates suggestions every ~3-4 seconds

---

## 🔌 Testing Phase 2: Web Serial API (Requires Arduino)

### 1. Connection Test
1. Upload GemBotArduino firmware to Arduino
2. Connect USB cable
3. Click **SCAN** button
4. Select your USB device from dropdown
5. Click **CONNECT**

**Expected**:
- Status changes to "CONNECTED" (green indicator)
- Message: `✅ Connected!`
- DISCONNECT button appears
- SCAN and port select disabled

### 2. Motor Command Test
**Test Speed Control**:
1. Move Speed slider to level 3
2. Check Arduino Serial Monitor (or GemBot status)
3. Command `s3` should be received

**Test Mode Toggle**:
1. Click CONTINUOUS button (should already be active)
2. Click STEP button
3. Commands `y` sent to toggle modes

**Test Movement (D-Pad)**:
1. Click UP arrow → sends `w`
2. Click DOWN arrow → sends `z`
3. Click LEFT arrow → sends `a`
4. Click RIGHT arrow → sends `d`
5. Click STOP → sends `u`

**Test Rotation**:
1. Click CCW → sends `j`
2. Click CW → sends `e`

**Test Index**:
1. Click BACK → sends `i`
2. Click FWD → sends `c`

**Expected**:
- Arduino receives correct command codes
- GemBot motors respond
- Position data appears in status boxes (X, Y, ANGLE, INDEX)

### 3. Position Data Display
While motors moving, status boxes should update:
- **X**: Horizontal position
- **Y**: Vertical position
- **ANGLE**: Rotation angle (shows degree symbol)
- **INDEX**: Index position number

**Expected Data Format**:
```
X: 512
Y: 384
ANGLE: 45°
INDEX: 0
```

---

## 📹 Testing Phase 3: Session Recording

### Setup
1. Start Camera
2. Connect to Arduino (optional - can test without hardware)
3. Verify ML model loaded

### Recording Test
1. Click **RECORD** button (turns red: ⏹ STOP RECORD)
2. Wait 5-10 seconds
3. Move camera around (captures different lighting/focus)
4. Send some motor commands (if Arduino connected)
5. Click RECORD button again to stop

**Expected**:
- Message: `🔴 Session recording started`
- Message: `⏹ Session recording stopped - processing...`
- Final message: `✅ Session saved (ID: 1733567401234) - 7 commands, 450 frames analyzed`
- ID is current timestamp

### Session Data Verification
1. Open browser DevTools (F12)
2. Go to **Application** → **IndexedDB** → **GemBotSessions** → **sessions**
3. You should see your session with:
   - `id`: Timestamp
   - `timestamp`: Date object
   - `commandCount`: Number of motor commands
   - `frameCount`: Number of analyzed frames
   - `duration`: Session length in ms
   - Blobs for `videoBlob` and `dataJSON`

**Expected**:
- At least one session visible
- Session contains recorded video blob
- Metadata shows correct counts

---

## 🤖 Testing Phase 4: AI Suggestions

### Smart Suggestion Test
1. Start Camera
2. Adjust lighting (point at bright window)
3. Wait ~6-10 seconds
4. Check AI chat panel for suggestions

**Expected Suggestions**:
- If bright: `🌟 Good lighting detected - surface clarity optimal`
- If dimly lit: `💡 Increase lighting for better surface visibility`
- If centered: `🎯 Excellent focus alignment - perfect for precision cuts`
- If off-center: `⚠️ Adjust positioning for better center focus`

### Context-Aware Suggestions
Messages change based on:
1. **Brightness** - lighting quality feedback
2. **Focus Quality** - positioning in center of frame
3. **Detections** - what objects are visible
4. **Combined** - speed recommendations when all optimal

---

## 📊 Integration Test: Full Workflow

### Scenario: Complete Cutting Session

1. **Initialization**
   - [ ] Page loads
   - [ ] Status shows DISCONNECTED
   - [ ] All controls visible

2. **Hardware Connection**
   - [ ] Click SCAN
   - [ ] Select Arduino port
   - [ ] Click CONNECT
   - [ ] Status → CONNECTED (green)

3. **Camera & ML**
   - [ ] Click START CAMERA
   - [ ] Camera permission granted
   - [ ] Video stream visible
   - [ ] ML model loads
   - [ ] Frame counter increments

4. **Recording Session**
   - [ ] Click RECORD
   - [ ] Message confirms recording started
   - [ ] Status shows "Recording"

5. **Cutting Operations**
   - [ ] Adjust speed slider
   - [ ] Toggle mode
   - [ ] Move cutting head (D-pad)
   - [ ] Position data updates (X, Y, ANGLE, INDEX)
   - [ ] All commands logged

6. **AI Monitoring**
   - [ ] Suggestions appear periodically
   - [ ] Focus quality shown in status
   - [ ] Brightness updates in real-time

7. **Session End**
   - [ ] Click RECORD to stop
   - [ ] Message: session saved with ID
   - [ ] Check IndexedDB for saved data

---

## 🐛 Troubleshooting

### TensorFlow.js Not Loading
**Symptom**: Message says `❌ ML load failed`

**Solutions**:
1. Check internet connection (needs CDN)
2. Open browser console (F12), look for 404 errors
3. Wait 5+ seconds (large model download)
4. Clear browser cache (Ctrl+Shift+Del)
5. Try different browser (Chrome preferred)

### Web Serial API Not Available
**Symptom**: Click SCAN → no error, but nothing happens

**Solutions**:
1. Use Chrome or Edge (Firefox/Safari don't support)
2. Update browser to latest version
3. Check if USB device is connected
4. Check Windows Device Manager (COM port showing?)
5. Install CH340 drivers if using Arduino clone

### Camera Permission Denied
**Symptom**: Click START CAMERA → no camera appears

**Solutions**:
1. Check browser notification (top-right)
2. Allow camera permission
3. Check Windows Settings → Camera permissions
4. Restart browser
5. Try incognito window

### Position Data Not Updating
**Symptom**: X, Y, ANGLE, INDEX still show "—"

**Solutions**:
1. Ensure Arduino firmware sends `pX:XXX pY:XXX pA:XXX pI:XXX` format
2. Check Serial Monitor to see actual data
3. Verify baud rate is 9600
4. Open browser console for parsing errors
5. Try moving machine manually to trigger position reports

### Session Not Saving
**Symptom**: Recording stops but no save message

**Solutions**:
1. Check IndexedDB available (DevTools → Application)
2. Ensure camera still running (don't stop camera during recording)
3. Wait 3-5 seconds after stop before checking
4. Check browser console for errors
5. Try shorter recording (5 seconds) first

---

## 🔧 Development Mode Debugging

### Enable Verbose Logging
Add to browser console (F12):
```javascript
// Show all session data
indexedDB.databases().then(dbs => {
  dbs.forEach(db => console.log(db.name));
});

// List all sessions
const req = indexedDB.open('GemBotSessions', 1);
req.onsuccess = (e) => {
  const store = e.target.result.transaction('sessions', 'readonly').objectStore('sessions');
  store.getAll().onsuccess = (ev) => {
    console.log('All Sessions:', ev.target.result);
  };
};
```

### Check ML Frame Processing
Add to console:
```javascript
// Log current ML state every 5 seconds
setInterval(() => {
  console.log('ML State:', {
    frameCount: mlState.frameCount,
    detections: mlState.detections.length,
    confidence: mlState.confidence
  });
}, 5000);
```

### Monitor Serial Communication
Add to console:
```javascript
// Log all commands sent to Arduino
const originalSend = serial.sendCommand.bind(serial);
serial.sendCommand = async (cmd) => {
  console.log('📤 Serial OUT:', cmd);
  await originalSend(cmd);
};
```

---

## 📈 Performance Benchmarks

### Expected Performance

| Metric | Value | Notes |
|--------|-------|-------|
| Frame Rate | 60 FPS | requestAnimationFrame |
| ML Detection Frequency | 2x/sec | Every 30 frames |
| Suggestion Frequency | 1.3x/sec | Every 90 frames |
| Memory per Hour | ~600 MB | Mostly video data |
| CPU Usage | 15-25% | Without heavy ML |
| Startup Time | 3-5 sec | TensorFlow model load |
| Session Save Time | 1-2 sec | Video + metadata compression |

---

## 🎯 Success Checklist

- [ ] **UI**: Page loads, layout correct, all buttons present
- [ ] **ML**: TensorFlow.js loads, bounding boxes draw
- [ ] **Serial**: Arduino connects, commands sent correctly
- [ ] **Position**: Status boxes update with motor position
- [ ] **Recording**: Sessions save to IndexedDB
- [ ] **Suggestions**: AI generates contextual recommendations
- [ ] **Integration**: Full workflow from connection to session save works
- [ ] **Performance**: No lag, smooth 60 FPS video

---

## 🚀 Next Steps After Successful Testing

1. **Deploy to Production**
   - Host on web server or local network
   - Access from tablet/phone

2. **Hardware Integration**
   - Run real cutting sessions
   - Verify all motor feedback correct
   - Test position accuracy

3. **Model Training Phase**
   - Collect 10-20 high-quality sessions
   - Extract features from successful cuts
   - Train custom TensorFlow model

4. **Continuous Improvement**
   - Gather user feedback
   - Refine suggestion logic
   - Build predictive capabilities

---

## 📞 Support Reference

**File Structure**:
```
GemBot_Control_AI.html          ← Main application
ML_IMPLEMENTATION_PROGRESS.md    ← Technical details
TESTING_GUIDE.md                 ← This file
```

**Key Classes**:
- `GemBotSerial` - Web Serial API communication
- `GemBotMLModel` - TensorFlow.js analysis
- `SessionRecorder` - Video + data recording to IndexedDB

**API Endpoints** (if hosted):
- GET `/GemBot_Control_AI.html` - Main application
- IndexedDB storage handled client-side

---

Generated: December 6, 2025
Version: 1.0 Production
Status: Ready for Testing
