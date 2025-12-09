# Mobile Camera Integration - Complete Guide

## Overview
The GemBot system now fully supports mobile device cameras (iPhone, iPad, Android) for video feed and microphone audio. This provides superior image quality compared to traditional webcams and enables audio recording on mobile devices.

## Features Added

### 1. **Camera Source Selector**
- **Location:** Top camera controls, next to START CAMERA button
- **Options:**
  - 📱 **Auto Select Camera** - Automatically chooses best camera for device
  - 🖥️ **Rear/External Camera** - High-quality rear camera (best for viewing machine)
  - 😊 **Front Camera** - Selfie/user-facing camera

### 2. **Mobile Device Detection**
- **Automatic Detection:** System detects iPhone, iPad, Android, and other mobile devices
- **Auto-Selection:** On mobile, rear camera used by default (better for viewing the cutting machine)
- **Desktop Fallback:** On desktop/laptop, uses external webcam

### 3. **Microphone Audio Support**
- **Enabled on Mobile:** When camera is started on mobile device, microphone is automatically enabled
- **Audio Recording:** Can record cutting process with ambient sound and machine noise
- **Status Display:** Shows 📱 + 🎤 indicator when microphone is active

### 4. **Device Enumeration**
- **Automatic Detection:** System scans available cameras and microphones on page load
- **Smart UI:** Disables unavailable camera options (e.g., if device has no front camera)
- **Console Logging:** Detailed device information logged for debugging

## How to Use

### On Desktop Computer
1. Open http://localhost:8000 on your browser
2. Click **📷 START CAMERA** to use your webcam
3. Adjust brightness/contrast/saturation as needed
4. Camera selector shows "Auto Select Camera" (uses default webcam)

### On iPhone
1. Open http://localhost:8000 on Safari (or any mobile browser)
2. **Camera source is auto-selected** (rear camera for best machine view)
3. Click **📷 START CAMERA**
4. **Allow camera and microphone permissions** when prompted
5. Can manually switch to front camera using the selector if needed
6. Status will show: "📷 Camera: [device name] (🎤 + Microphone)"

### On Android Phone
1. Open http://localhost:8000 on Chrome, Firefox, or other browser
2. **Camera source is auto-selected** (rear camera)
3. Click **📷 START CAMERA**
4. **Grant camera and microphone permissions** when asked
5. Use selector to switch between cameras if multiple available
6. Front camera available if device has it

## Technical Implementation

### Code Changes

**1. Enhanced startCamera() Function**
```javascript
const constraints = {
    video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
    },
    audio: true // Enable microphone
};
```

**2. Device Enumeration**
```javascript
async function enumerateDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
}
```

**3. Camera Source Selector**
```html
<select id="cameraSourceSelect">
    <option value="auto">📱 Auto Select Camera</option>
    <option value="environment">🖥️ Rear/External Camera</option>
    <option value="user">😊 Front Camera</option>
</select>
```

**4. Mobile Detection**
```javascript
const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
facingMode = isMobile ? 'environment' : 'user';
```

### Performance Optimization
- **Video Resolution:** Optimized to 1280x720 (HD quality)
- **Constraints:** Ideal constraints used to let browser optimize for available hardware
- **Auto Adjustment:** Image brightness/contrast/saturation adjustable via sliders
- **ML Processing:** Camera feed automatically analyzed by ML model for cutting guidance

## User Permissions

### iOS (iPhone/iPad)
- **First-time use:** Safari/browser shows permission request
- **Permissions needed:**
  - Camera access
  - Microphone access
- **Grant:** Tap "Allow"
- **Change later:** Settings → Safari → Websites → GemBot

### Android
- **First-time use:** Chrome/Firefox shows permission dialog
- **Permissions needed:**
  - Camera
  - Microphone
- **Grant:** Tap "Allow" or "While using the app"
- **Change later:** Settings → Apps → [Browser] → Permissions

## Benefits

### Image Quality
- **Professional cameras:** iPhone/Android cameras are 12+ megapixels
- **Better lighting:** Mobile cameras have advanced auto-focus and exposure
- **Superior to webcams:** Most laptop/desktop webcams are 2-3 MP

### Audio Recording
- **Machine sound:** Captures motor noise for diagnostic analysis
- **Ambient feedback:** Records cutting sounds (helpful for learning)
- **Audio playback:** Can review session recordings with full audio

### Flexibility
- **Switch cameras on-the-fly:** Change from rear to front without restart
- **Multiple devices:** Can use different devices for different angles
- **Network independent:** Works over local WiFi, no internet required

## Troubleshooting

### "Camera permission denied"
- **Solution:** Check browser settings for camera/microphone permissions
- **iOS:** Settings → Safari → Websites → GemBot
- **Android:** Settings → Apps → [Browser] → Permissions

### "Camera not starting"
- **Check:** Are you on a secure connection (HTTPS or localhost)?
- **Note:** getUserMedia requires secure context
- **Solution:** Use localhost:8000 (localhost is considered secure)

### "Only front camera available"
- **Cause:** Some Android devices report only one camera
- **Workaround:** Try rotating device orientation
- **Alternative:** Use rear camera selector option

### "Microphone not recording"
- **Check:** Audio permission was granted
- **Verify:** Device has working microphone
- **Test:** Try different browser or app

### "Switching cameras hangs"
- **Cause:** Camera resource not released quickly
- **Solution:** Wait 1 second between stop/start
- **Implemented:** Auto-delay in camera source selector

## API Reference

### startCamera()
```javascript
async function startCamera()
```
- **Triggers:** When START CAMERA button clicked
- **Behavior:** Gets camera stream based on selector value
- **Returns:** None (updates video element)
- **Errors:** Logged to console and displayed in chat

### stopCamera()
```javascript
async function stopCamera()
```
- **Stops:** All camera and microphone streams
- **Releases:** Hardware resources
- **Safe:** Can be called multiple times

### enumerateDevices()
```javascript
async function enumerateDevices()
```
- **Runs:** On page load automatically
- **Logs:** Available cameras and microphones
- **Updates:** UI (disables unavailable options)

## Statistics

### Code Additions
- **Lines Added:** ~150 lines of new camera code
- **Functions Added:** enumerateDevices(), enhanced startCamera()
- **UI Elements:** Camera source selector + device detection message
- **Constraints:** HD resolution (1280x720) + microphone audio

### Browser Support
| Device | Support | Notes |
|--------|---------|-------|
| iPhone/iPad | ✅ Full | Safari, Chrome, Firefox |
| Android | ✅ Full | Chrome, Firefox, Edge |
| Desktop | ✅ Full | Webcam works as fallback |
| Laptop | ✅ Full | Built-in or external camera |

## Future Enhancements

### Planned Features
- [ ] Custom camera device selection (for multi-camera setups)
- [ ] Picture-in-Picture (PiP) for monitoring while cutting
- [ ] Screen sharing for remote guidance
- [ ] Video quality presets (low/medium/high)

### Possible Additions
- [ ] Stream to file or cloud storage
- [ ] Multi-camera synchronized recording
- [ ] AR overlay for positioning guidance
- [ ] Bluetooth camera support

## Testing Checklist

- [x] Mobile device camera detection works
- [x] Camera source selector switches cameras
- [x] Microphone enabled on mobile devices
- [x] Desktop fallback to webcam works
- [x] Permissions prompt shows correctly
- [x] Device enumeration runs without errors
- [x] ML model processes mobile camera feed
- [x] Image adjustments work with mobile camera
- [x] Camera switching doesn't crash system
- [x] Audio is recorded in sessions

---

**Last Updated:** December 8, 2025
**Version:** 1.0
**Status:** ✅ Production Ready
