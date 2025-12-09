/**
 * AI VISION INTEGRATION MODULE
 * Connects camera/ML system with GemBot AI
 * Enables AI to "see" and reference visual data in responses
 * 
 * File: GEMBOT_AI_VISION_CODE.js
 * Purpose: Production-ready code for camera/ML integration with AI
 * Integration: Copy these functions into GemBotAI class in GemBot_Control_AI.html
 */

// ==================== AI VISION DATA STRUCTURE ====================
// Add this GLOBALLY (before mlState definition, around line 4110)

const aiVisionContext = {
    // Current frame analysis from ML
    currentFrame: {
        timestamp: null,        // When frame was analyzed
        brightness: 0,          // 0-255 brightness value
        focusQuality: 0,        // 0-100 focus quality percentage
        centerBrightness: 0,    // Center area brightness
        hasValidFrames: false   // Are we getting frames?
    },
    
    // Object detection results
    detections: {
        found: false,           // Any objects detected?
        count: 0,               // Number of objects found
        objects: [],            // Array of detected objects
        maxConfidence: 0,       // Highest confidence (0-1)
        averageConfidence: 0    // Average confidence across detections
    },
    
    // Analysis quality
    analysis: {
        lastUpdateTime: null,
        framesSinceLastDetection: 0,
        detectionFrequency: 0,  // How often detections occur
        averageFocusQuality: 0  // Running average focus quality
    },
    
    // AI-friendly description of current visual state
    visualState: '',            // "Clear view, good lighting, object visible"
    lightingStatus: '',         // "Optimal", "Dim", "Bright"
    detectionStatus: '',        // "Object visible", "No clear objects"
    recommendations: []         // Array of visual recommendations
};

// ==================== AI VISION METHODS ====================
// Add these methods to GemBotAI CLASS (after getSmartContextResponse method, around line 2330)

/**
 * updateAIVisionContext()
 * Called from processVideoFrames() to keep AI aware of current visual state
 * Updates the global aiVisionContext with latest camera/ML data
 * 
 * @param {Object} frameFeatures - Frame analysis from ML (brightness, focusQuality, etc.)
 * @param {Array} mlDetections - Array of detected objects from CocoSSD model
 */
updateAIVisionContext(frameFeatures, mlDetections) {
    if (!frameFeatures || !mlDetections) return;
    
    // Update frame analysis
    aiVisionContext.currentFrame.timestamp = frameFeatures.timestamp;
    aiVisionContext.currentFrame.brightness = frameFeatures.brightness;
    aiVisionContext.currentFrame.focusQuality = frameFeatures.focusQuality;
    aiVisionContext.currentFrame.centerBrightness = frameFeatures.centerBrightness;
    aiVisionContext.currentFrame.hasValidFrames = true;
    
    // Update detection results
    aiVisionContext.detections.found = mlDetections.length > 0;
    aiVisionContext.detections.count = mlDetections.length;
    aiVisionContext.detections.objects = mlDetections;
    
    if (mlDetections.length > 0) {
        const confidences = mlDetections.map(d => d.score);
        aiVisionContext.detections.maxConfidence = Math.max(...confidences);
        aiVisionContext.detections.averageConfidence = 
            confidences.reduce((a, b) => a + b, 0) / confidences.length;
        aiVisionContext.analysis.framesSinceLastDetection = 0;
    } else {
        aiVisionContext.analysis.framesSinceLastDetection++;
    }
    
    // Generate visual state descriptions
    this.generateVisualStateDescription();
}

/**
 * generateVisualStateDescription()
 * Creates human-readable descriptions of current visual conditions
 * Used by AI to reference what it "sees" in responses
 */
generateVisualStateDescription() {
    const vision = aiVisionContext;
    
    // Lighting status
    if (vision.currentFrame.brightness < 80) {
        vision.lightingStatus = 'Dim - consider increasing light';
    } else if (vision.currentFrame.brightness < 150) {
        vision.lightingStatus = 'Moderate - adequate for work';
    } else if (vision.currentFrame.brightness < 220) {
        vision.lightingStatus = 'Good - optimal for precision';
    } else {
        vision.lightingStatus = 'Bright - excellent lighting conditions';
    }
    
    // Focus quality status
    if (vision.currentFrame.focusQuality > 85) {
        vision.detectionStatus = 'Excellent focus - center is sharp';
    } else if (vision.currentFrame.focusQuality > 70) {
        vision.detectionStatus = 'Good focus - mostly in alignment';
    } else if (vision.currentFrame.focusQuality > 50) {
        vision.detectionStatus = 'Fair focus - some adjustment needed';
    } else {
        vision.detectionStatus = 'Poor focus - reposition for clarity';
    }
    
    // Object detection status
    if (vision.detections.found) {
        const confidence = vision.detections.maxConfidence;
        if (confidence > 0.85) {
            vision.detectionStatus = `Clear visibility - ${vision.detections.count} object(s) detected with ${(confidence*100).toFixed(0)}% confidence`;
        } else if (confidence > 0.70) {
            vision.detectionStatus = `Visible - ${vision.detections.count} object(s) partially clear at ${(confidence*100).toFixed(0)}% confidence`;
        } else {
            vision.detectionStatus = `Faint - ${vision.detections.count} object(s) barely visible at ${(confidence*100).toFixed(0)}% confidence`;
        }
    } else if (vision.analysis.framesSinceLastDetection < 60) {
        vision.detectionStatus = 'No objects visible in current frame';
    } else {
        vision.detectionStatus = 'No objects detected - check positioning';
    }
    
    // Combined visual state
    vision.visualState = `${vision.lightingStatus} | ${vision.detectionStatus}`;
    
    // Generate recommendations
    this.generateVisualRecommendations();
}

/**
 * generateVisualRecommendations()
 * Creates actionable recommendations based on visual analysis
 */
generateVisualRecommendations() {
    const vision = aiVisionContext;
    vision.recommendations = [];
    
    // Lighting recommendations
    if (vision.currentFrame.brightness < 100) {
        vision.recommendations.push('📍 Increase lighting - surface clarity is low');
    } else if (vision.currentFrame.brightness > 230) {
        vision.recommendations.push('🌞 Reduce glare - consider adjusting light angle');
    }
    
    // Focus recommendations
    if (vision.currentFrame.focusQuality < 65) {
        vision.recommendations.push('🎯 Adjust stone position - focus quality is poor');
    }
    
    // Detection recommendations
    if (!vision.detections.found && vision.analysis.framesSinceLastDetection > 30) {
        vision.recommendations.push('👀 Check if stone is properly positioned in frame');
    } else if (vision.detections.found && vision.detections.maxConfidence < 0.7) {
        vision.recommendations.push('🔍 Object partially obscured - reposition for clarity');
    } else if (vision.detections.found && vision.detections.maxConfidence > 0.85) {
        vision.recommendations.push('✅ Excellent visibility - ready for precision work');
    }
    
    // Speed recommendations
    if (vision.currentFrame.brightness > 150 && vision.detections.found) {
        vision.recommendations.push('⚡ Lighting optimal - can proceed with current speed');
    }
}

/**
 * getVisionData()
 * Returns current vision context for AI to use
 * Called by getSmartContextResponse() to include visual awareness
 * 
 * @returns {Object} Vision data structure with all current visual info
 */
getVisionData() {
    return {
        hasVision: aiVisionContext.currentFrame.hasValidFrames,
        brightness: aiVisionContext.currentFrame.brightness,
        focusQuality: aiVisionContext.currentFrame.focusQuality,
        objectsDetected: aiVisionContext.detections.found,
        detectionCount: aiVisionContext.detections.count,
        confidence: aiVisionContext.detections.maxConfidence,
        visualState: aiVisionContext.visualState,
        lightingStatus: aiVisionContext.lightingStatus,
        detectionStatus: aiVisionContext.detectionStatus,
        recommendations: aiVisionContext.recommendations
    };
}

// ==================== INTEGRATION IN EXISTING METHODS ====================

/**
 * MODIFICATION 1: Update getSmartContextResponse() signature
 * 
 * BEFORE:
 * getSmartContextResponse(query, speed, mode, posX, posY) {
 * 
 * AFTER:
 * getSmartContextResponse(query, speed, mode, posX, posY, visionData = null) {
 * 
 * Then add vision-aware response patterns below existing patterns
 */

// Vision-aware response patterns to add to getSmartContextResponse():

// PATTERN 1: Camera/Vision questions
if (/see|visible|camera|view|focus|clarity|bright|light|lens|frame/.test(lowerQuery)) {
    if (visionData && visionData.hasVision) {
        let response = `I'm watching your workspace: ${visionData.visualState}. `;
        
        if (visionData.recommendations.length > 0) {
            response += visionData.recommendations.slice(0, 2).join(' ') + ' ';
        }
        
        response += `Current readings: Brightness ${visionData.brightness}/255, Focus quality ${visionData.focusQuality}%. `;
        
        if (visionData.objectsDetected) {
            response += `I detect ${visionData.detectionCount} object(s) with ${(visionData.confidence*100).toFixed(0)}% confidence.`;
        } else {
            response += `No objects currently visible - check stone positioning.`;
        }
        
        return response;
    } else {
        return `Camera is not active. Click START CAMERA to begin visual monitoring of your workspace.`;
    }
}

// PATTERN 2: Positioning with visual feedback
if (/position|where|move|axis|x-axis|y-axis|location|coordinate/.test(lowerQuery)) {
    let response = `POSITIONING: GemBot has 4 axes: X (left-right), Y (forward-back to lap), Rotation (spin stone), Index (switch laps). Current position: X=${posX}, Y=${posY}. Use buttons to move step-by-step or hold for continuous movement.`;
    
    if (visionData && visionData.hasVision) {
        if (visionData.objectsDetected) {
            response += ` 👁️ I see: ${visionData.detectionStatus}`;
        }
        if (visionData.focusQuality < 70) {
            response += ` Consider adjusting for better focus (currently ${visionData.focusQuality}%).`;
        }
    }
    
    return response;
}

// PATTERN 3: Lighting/Illumination questions
if (/light|bright|dark|dim|illuminate|illuminate|glow|shadow/.test(lowerQuery)) {
    if (visionData && visionData.hasVision) {
        return `LIGHTING: I measure your workspace brightness at ${visionData.brightness}/255. ${visionData.lightingStatus}. ${visionData.recommendations.filter(r => r.includes('light') || r.includes('💡') || r.includes('🌞')).join(' ') || 'Current lighting is adequate for work.'}`;
    } else {
        return `LIGHTING: Optimal gem cutting requires good, consistent lighting. Start the camera to see current light levels. Aim for brightness 150-220 for best visibility and precision.`;
    }
}

// PATTERN 4: Problem diagnosis with visual data
if (/stuck|won't|error|problem|issue|help|trouble|can't|cannot|not working/.test(lowerQuery)) {
    let response = `Machine issue? `;
    
    if (visionData && visionData.hasVision) {
        if (!visionData.objectsDetected && visionData.brightness > 100) {
            response += `Visual check: No object detected in camera. Is the stone positioned on the lap? `;
        } else if (visionData.focusQuality < 60) {
            response += `Visual check: Object is detected but poorly focused (${visionData.focusQuality}% quality). Adjust stone position for clarity. `;
        } else if (visionData.objectsDetected && visionData.focusQuality > 75) {
            response += `Visual check: Stone is clearly visible and well-positioned. `;
        }
    }
    
    if (/connection|disconnect|lost|port/.test(lowerQuery)) {
        response = `Lost connection? (1) Click SCAN to find available ports. (2) Select correct COM port. (3) CONNECT. (4) Click HOME to reset position. (5) Check USB cable.`;
    } else {
        response += `Try this: (1) Check connection status (top-left indicator). (2) Click HOME to reset position. (3) Try buttons again. (4) If still stuck: EMERGENCY STOP, wait 2 seconds, DISCONNECT, then SCAN and RECONNECT.`;
    }
    
    return response;
}

// PATTERN 5: Focus/Clarity questions
if (/focus|clear|clarity|sharp|blur|adjust position/.test(lowerQuery)) {
    if (visionData && visionData.hasVision) {
        let response = `FOCUS: Current focus quality is ${visionData.focusQuality}%. `;
        
        if (visionData.focusQuality > 80) {
            response += `Excellent! Your stone is well-positioned. Safe to proceed with cutting.`;
        } else if (visionData.focusQuality > 65) {
            response += `Good focus - adequate for most work. Fine adjustments can improve further.`;
        } else {
            response += `Poor focus - reposition your stone carefully. Move slowly with STEP mode, watching the camera for sharpness improvement.`;
        }
        
        return response;
    } else {
        return `FOCUS: Start the camera to see focus quality. Use STEP mode to carefully position your stone until the center is sharp and clear.`;
    }
}

// PATTERN 6: Detection/Visibility questions  
if (/detect|see.*object|visibility|object|visible|visible/.test(lowerQuery)) {
    if (visionData && visionData.hasVision) {
        let response = `DETECTION: `;
        
        if (visionData.objectsDetected) {
            response += `I detect ${visionData.detectionCount} object(s). Confidence: ${(visionData.confidence*100).toFixed(0)}%. ${visionData.detectionStatus}. `;
            if (visionData.confidence > 0.85) {
                response += `Visibility is excellent - clear for detailed work.`;
            } else if (visionData.confidence > 0.7) {
                response += `Adequate visibility - consider minor positioning adjustments.`;
            } else {
                response += `Low confidence - reposition for better visibility.`;
            }
        } else {
            response += `No objects detected. Is your stone positioned in the camera view? Check alignment and try again.`;
        }
        
        return response;
    } else {
        return `DETECTION: Start the camera to see object detection. The AI will identify what's in frame and help guide positioning.`;
    }
}

/**
 * MODIFICATION 2: Update getConversationalResponse() method
 * 
 * BEFORE:
 * getConversationalResponse(query) {
 *     const currentSpeed = motorSpeed || 1;
 *     const currentMode = motorMode || 'continuous';
 *     const posX = machineState?.currentState?.positionX || 0;
 *     const posY = machineState?.currentState?.positionY || 0;
 *     
 *     let response = this.getSmartContextResponse(query, currentSpeed, currentMode, posX, posY);
 * 
 * AFTER:
 * getConversationalResponse(query) {
 *     const currentSpeed = motorSpeed || 1;
 *     const currentMode = motorMode || 'continuous';
 *     const posX = machineState?.currentState?.positionX || 0;
 *     const posY = machineState?.currentState?.positionY || 0;
 *     const visionData = this.getVisionData();  // NEW LINE
 *     
 *     let response = this.getSmartContextResponse(query, currentSpeed, currentMode, posX, posY, visionData);  // MODIFIED
 */

/**
 * MODIFICATION 3: Hook into processVideoFrames()
 * 
 * Location: After ML detection (around line 4065)
 * 
 * BEFORE:
 * if (mlState.frameCount % 30 === 0 && mlModelLoaded) {
 *     const predictions = await mlModel.detectObjects(video);
 *     mlState.detections = predictions;
 *     
 *     sessionRecorder.logFrameAnalysis(features, predictions);
 * 
 * AFTER:
 * if (mlState.frameCount % 30 === 0 && mlModelLoaded) {
 *     const predictions = await mlModel.detectObjects(video);
 *     mlState.detections = predictions;
 *     
 *     // UPDATE AI VISION CONTEXT
 *     if (gemBotAI) {
 *         gemBotAI.updateAIVisionContext(features, predictions);
 *     }
 *     
 *     sessionRecorder.logFrameAnalysis(features, predictions);
 */

// ==================== INTEGRATION SUMMARY ====================
/**
 * SUMMARY OF CHANGES:
 * 
 * 1. ADD aiVisionContext global object (line 4110, before mlState)
 * 2. ADD 4 new methods to GemBotAI class:
 *    - updateAIVisionContext()
 *    - generateVisualStateDescription()
 *    - generateVisualRecommendations()
 *    - getVisionData()
 * 
 * 3. MODIFY getSmartContextResponse() signature to accept visionData parameter
 * 4. ADD 6 new response patterns to getSmartContextResponse() for vision-aware responses
 * 
 * 5. MODIFY getConversationalResponse() to:
 *    - Get visionData via this.getVisionData()
 *    - Pass visionData to getSmartContextResponse()
 * 
 * 6. MODIFY processVideoFrames() to:
 *    - Call gemBotAI.updateAIVisionContext() after ML detection
 * 
 * RESULT: AI can now "see" camera feed and reference visual conditions in responses
 */

// ==================== TESTING CHECKLIST ====================
/**
 * Test each integration point:
 * 
 * [ ] aiVisionContext initializes with all fields
 * [ ] updateAIVisionContext() receives frame data
 * [ ] generateVisualStateDescription() updates descriptions
 * [ ] generateVisualRecommendations() creates recommendations
 * [ ] getVisionData() returns correct structure
 * [ ] Camera startup calls updateAIVisionContext()
 * [ ] getSmartContextResponse() accepts visionData parameter
 * [ ] getConversationalResponse() passes visionData
 * 
 * User Testing:
 * [ ] Ask "Can you see the stone?" → AI references camera visibility
 * [ ] Ask "Where should I move it?" → AI includes focus quality
 * [ ] Ask "Why isn't it visible?" → AI references brightness/focus
 * [ ] Ask "Is it clearly visible?" → AI uses detection confidence
 * [ ] Change lighting → AI response changes based on brightness
 * [ ] Reposition stone → AI response updates based on focus quality
 * 
 * [ ] All vision-aware response patterns work
 * [ ] AI provides accurate visual diagnostics
 * [ ] Recommendations are actionable
 * [ ] Camera off → AI gracefully handles missing vision data
 */
