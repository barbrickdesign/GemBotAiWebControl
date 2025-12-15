/**
 * GemBot 3D Machine Mirror System
 * Real-time synchronization between physical and virtual machines
 * Uses Three.js for enhanced line tracing and tool path visualization
 * © 2024-2025 Ryan Barbrick / Barbrick Design
 */

const GemBot3DMirror = {
    // Connection state
    connected: false,
    physicalMachine: null,
    virtualMachine: null,
    
    // Position tracking
    realPosition: { x: 0, y: 0, z: 0, p: 0 },
    virtualPosition: { x: 0, y: 0, z: 0, p: 0 },
    
    // Tool path recording
    toolPath: [],
    maxPathPoints: 5000,
    recordingPath: false,
    
    // Three.js components for line tracing
    threeRenderer: null,
    threeScene: null,
    threeCamera: null,
    pathLine: null,
    pathGeometry: null,
    pathMaterial: null,
    
    // Sync settings
    syncInterval: 50, // ms between sync updates
    syncTimer: null,
    smoothingFactor: 0.15,
    
    // Animation queues
    animationQueue: [],
    isAnimating: false,
    
    /**
     * Initialize the mirror system
     */
    init(options = {}) {
        console.log('🔄 Initializing GemBot 3D Mirror System...');
        
        // Get virtual machine reference
        this.virtualMachine = window.virtualMachine3D || window.VirtualMachine3D;
        
        // Initialize Three.js overlay for tool path visualization
        if (options.enablePathVisualization !== false) {
            this.initThreeJSOverlay();
        }
        
        // Set up event listeners for physical machine updates
        this.setupEventListeners();
        
        // Start sync loop
        this.startSyncLoop();
        
        console.log('✅ GemBot 3D Mirror System initialized');
        return this;
    },
    
    /**
     * Initialize Three.js overlay for path tracing
     */
    initThreeJSOverlay() {
        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
            console.log('📦 Loading Three.js for path visualization...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
            script.onload = () => this.setupThreeJS();
            document.head.appendChild(script);
        } else {
            this.setupThreeJS();
        }
    },
    
    /**
     * Set up Three.js scene for path visualization
     */
    setupThreeJS() {
        if (typeof THREE === 'undefined') {
            console.warn('⚠️ Three.js not loaded, path visualization disabled');
            return;
        }
        
        // Create scene
        this.threeScene = new THREE.Scene();
        
        // Create path material with glow effect
        this.pathMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });
        
        // Create geometry for tool path
        this.pathGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.maxPathPoints * 3);
        this.pathGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.pathGeometry.setDrawRange(0, 0);
        
        // Create line
        this.pathLine = new THREE.Line(this.pathGeometry, this.pathMaterial);
        this.threeScene.add(this.pathLine);
        
        console.log('✅ Three.js path visualization ready');
    },
    
    /**
     * Set up event listeners for machine state updates
     */
    setupEventListeners() {
        // Listen for position updates from physical machine
        document.addEventListener('gembot-position-update', (e) => {
            this.updateFromPhysical(e.detail);
        });
        
        // Listen for connection status
        document.addEventListener('gembot-connection-change', (e) => {
            this.connected = e.detail.connected;
            if (this.connected) {
                this.onConnect();
            } else {
                this.onDisconnect();
            }
        });
        
        // Listen for motor commands
        document.addEventListener('gembot-motor-command', (e) => {
            this.queueAnimation(e.detail);
        });
    },
    
    /**
     * Start the synchronization loop
     */
    startSyncLoop() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }
        
        this.syncTimer = setInterval(() => {
            this.syncPositions();
        }, this.syncInterval);
    },
    
    /**
     * Stop the synchronization loop
     */
    stopSyncLoop() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
        }
    },
    
    /**
     * Synchronize positions between physical and virtual
     */
    syncPositions() {
        if (!this.virtualMachine) {
            this.virtualMachine = window.virtualMachine3D;
            if (!this.virtualMachine) return;
        }
        
        // Get current virtual position
        const virtualPos = this.virtualMachine.getPositions ? 
            this.virtualMachine.getPositions() : 
            { x: 0, y: 0, p: 0 };
        
        // Smooth interpolation if connected to physical machine
        if (this.connected) {
            // Lerp virtual position toward real position
            this.virtualPosition.x += (this.realPosition.x - this.virtualPosition.x) * this.smoothingFactor;
            this.virtualPosition.y += (this.realPosition.y - this.virtualPosition.y) * this.smoothingFactor;
            this.virtualPosition.z += (this.realPosition.z - this.virtualPosition.z) * this.smoothingFactor;
            this.virtualPosition.p += (this.realPosition.p - this.virtualPosition.p) * this.smoothingFactor;
            
            // Update virtual machine
            if (this.virtualMachine.setPosition) {
                this.virtualMachine.setPosition(
                    this.virtualPosition.x,
                    this.virtualPosition.y,
                    this.virtualPosition.p
                );
            }
            
            // Record path if enabled
            if (this.recordingPath) {
                this.addPathPoint(this.virtualPosition);
            }
        }
    },
    
    /**
     * Update from physical machine data
     */
    updateFromPhysical(data) {
        if (data.x !== undefined) this.realPosition.x = data.x;
        if (data.y !== undefined) this.realPosition.y = data.y;
        if (data.z !== undefined) this.realPosition.z = data.z;
        if (data.p !== undefined) this.realPosition.p = data.p;
        
        // Emit event for UI updates
        document.dispatchEvent(new CustomEvent('gembot-mirror-update', {
            detail: {
                real: { ...this.realPosition },
                virtual: { ...this.virtualPosition },
                synced: this.connected
            }
        }));
    },
    
    /**
     * Handle connection to physical machine
     */
    onConnect() {
        console.log('🔌 Physical machine connected - starting mirror sync');
        this.connected = true;
        
        // Request initial position
        this.requestPosition();
        
        // Show connection indicator
        this.showConnectionStatus(true);
    },
    
    /**
     * Handle disconnection from physical machine
     */
    onDisconnect() {
        console.log('🔌 Physical machine disconnected');
        this.connected = false;
        
        // Show disconnection indicator
        this.showConnectionStatus(false);
    },
    
    /**
     * Request current position from physical machine
     */
    requestPosition() {
        document.dispatchEvent(new CustomEvent('gembot-request-position'));
    },
    
    /**
     * Show connection status indicator
     */
    showConnectionStatus(connected) {
        const indicator = document.getElementById('mirrorConnectionIndicator');
        if (indicator) {
            indicator.innerHTML = connected 
                ? '<span style="color:#00ff88">●</span> Machine Synced'
                : '<span style="color:#ff4444">●</span> Not Connected';
        }
        
        // Update bonus indicator if in game mode
        const bonus = document.getElementById('realMachineBonus');
        if (bonus) {
            bonus.classList.toggle('hidden', !connected);
        }
    },
    
    // ==================== TOOL PATH RECORDING ====================
    
    /**
     * Start recording tool path
     */
    startPathRecording() {
        this.toolPath = [];
        this.recordingPath = true;
        console.log('🎥 Started recording tool path');
    },
    
    /**
     * Stop recording tool path
     */
    stopPathRecording() {
        this.recordingPath = false;
        console.log(`🎥 Stopped recording. ${this.toolPath.length} points recorded`);
        return this.toolPath;
    },
    
    /**
     * Add a point to the tool path
     */
    addPathPoint(position) {
        if (this.toolPath.length >= this.maxPathPoints) {
            this.toolPath.shift(); // Remove oldest point
        }
        
        this.toolPath.push({
            x: position.x,
            y: position.y,
            z: position.z,
            p: position.p,
            timestamp: Date.now()
        });
        
        // Update Three.js visualization
        this.updatePathVisualization();
    },
    
    /**
     * Update Three.js path visualization
     */
    updatePathVisualization() {
        if (!this.pathGeometry || this.toolPath.length < 2) return;
        
        const positions = this.pathGeometry.attributes.position.array;
        
        this.toolPath.forEach((point, i) => {
            // Convert machine coordinates to visualization space
            const vx = (point.x / 100) * 80;
            const vy = 60 + (point.z || 0);
            const vz = (point.y / 100) * -40;
            
            positions[i * 3] = vx;
            positions[i * 3 + 1] = vy;
            positions[i * 3 + 2] = vz;
        });
        
        this.pathGeometry.attributes.position.needsUpdate = true;
        this.pathGeometry.setDrawRange(0, this.toolPath.length);
    },
    
    /**
     * Clear the tool path
     */
    clearPath() {
        this.toolPath = [];
        if (this.pathGeometry) {
            this.pathGeometry.setDrawRange(0, 0);
        }
        console.log('🧹 Tool path cleared');
    },
    
    /**
     * Export tool path as G-code style data
     */
    exportPath() {
        let gcode = '; GemBot Tool Path Export\n';
        gcode += `; Generated: ${new Date().toISOString()}\n`;
        gcode += `; Points: ${this.toolPath.length}\n\n`;
        
        this.toolPath.forEach((point, i) => {
            gcode += `G1 X${point.x.toFixed(2)} Y${point.y.toFixed(2)} P${point.p.toFixed(2)}\n`;
        });
        
        return gcode;
    },
    
    // ==================== ANIMATION QUEUE ====================
    
    /**
     * Queue an animation for smooth playback
     */
    queueAnimation(command) {
        this.animationQueue.push({
            type: command.type,
            axis: command.axis,
            value: command.value,
            duration: command.duration || 500,
            timestamp: Date.now()
        });
        
        if (!this.isAnimating) {
            this.processAnimationQueue();
        }
    },
    
    /**
     * Process the animation queue
     */
    processAnimationQueue() {
        if (this.animationQueue.length === 0) {
            this.isAnimating = false;
            return;
        }
        
        this.isAnimating = true;
        const anim = this.animationQueue.shift();
        
        // Calculate animation steps
        const steps = Math.ceil(anim.duration / this.syncInterval);
        const startPos = { ...this.virtualPosition };
        let currentStep = 0;
        
        const animate = () => {
            currentStep++;
            const progress = currentStep / steps;
            const easeProgress = this.easeInOutQuad(progress);
            
            switch (anim.axis) {
                case 'x':
                    this.virtualPosition.x = startPos.x + (anim.value - startPos.x) * easeProgress;
                    break;
                case 'y':
                    this.virtualPosition.y = startPos.y + (anim.value - startPos.y) * easeProgress;
                    break;
                case 'z':
                    this.virtualPosition.z = startPos.z + (anim.value - startPos.z) * easeProgress;
                    break;
                case 'p':
                    this.virtualPosition.p = startPos.p + (anim.value - startPos.p) * easeProgress;
                    break;
            }
            
            // Update virtual machine
            if (this.virtualMachine && this.virtualMachine.setPosition) {
                this.virtualMachine.setPosition(
                    this.virtualPosition.x,
                    this.virtualPosition.y,
                    this.virtualPosition.p
                );
            }
            
            if (currentStep < steps) {
                setTimeout(animate, this.syncInterval);
            } else {
                // Process next animation in queue
                this.processAnimationQueue();
            }
        };
        
        animate();
    },
    
    /**
     * Easing function for smooth animations
     */
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    // ==================== PRESET MOVEMENTS ====================
    
    /**
     * Run demo animation sequence
     */
    runDemo() {
        console.log('🎬 Running demo sequence...');
        
        // Demo movements
        const sequence = [
            { axis: 'x', value: 50, duration: 800 },
            { axis: 'p', value: 45, duration: 400 },
            { axis: 'y', value: 70, duration: 600 },
            { axis: 'p', value: 90, duration: 400 },
            { axis: 'x', value: -50, duration: 800 },
            { axis: 'p', value: 135, duration: 400 },
            { axis: 'y', value: 30, duration: 600 },
            { axis: 'p', value: 180, duration: 400 },
            { axis: 'x', value: 0, duration: 800 },
            { axis: 'y', value: 50, duration: 600 },
            { axis: 'p', value: 0, duration: 800 }
        ];
        
        sequence.forEach(cmd => this.queueAnimation(cmd));
    },
    
    /**
     * Home all axes with animation
     */
    homeAnimation() {
        console.log('🏠 Homing all axes...');
        this.queueAnimation({ axis: 'x', value: 0, duration: 1000 });
        this.queueAnimation({ axis: 'y', value: 0, duration: 1000 });
        this.queueAnimation({ axis: 'p', value: 0, duration: 500 });
    },
    
    /**
     * Simulate a cutting sequence
     */
    simulateCut(facetIndex = 0, totalFacets = 8) {
        console.log(`💎 Simulating facet cut ${facetIndex + 1}/${totalFacets}`);
        
        const angle = (360 / totalFacets) * facetIndex;
        
        // Move to facet position
        this.queueAnimation({ axis: 'p', value: angle, duration: 300 });
        
        // Lower to lap
        this.queueAnimation({ axis: 'y', value: 85, duration: 400 });
        
        // Hold for cutting
        setTimeout(() => {
            // Raise from lap
            this.queueAnimation({ axis: 'y', value: 50, duration: 400 });
        }, 1500);
    },
    
    // ==================== UTILITY METHODS ====================
    
    /**
     * Get current sync status
     */
    getStatus() {
        return {
            connected: this.connected,
            realPosition: { ...this.realPosition },
            virtualPosition: { ...this.virtualPosition },
            pathPoints: this.toolPath.length,
            isRecording: this.recordingPath,
            animationQueueLength: this.animationQueue.length
        };
    },
    
    /**
     * Set smoothing factor (0.01 to 1.0)
     */
    setSmoothingFactor(factor) {
        this.smoothingFactor = Math.max(0.01, Math.min(1.0, factor));
    },
    
    /**
     * Dispose of resources
     */
    dispose() {
        this.stopSyncLoop();
        
        if (this.threeScene) {
            this.threeScene.clear();
        }
        
        this.toolPath = [];
        this.animationQueue = [];
        
        console.log('🗑️ GemBot3DMirror disposed');
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure other components are ready
    setTimeout(() => {
        GemBot3DMirror.init();
    }, 1000);
});

// Export for use
if (typeof window !== 'undefined') {
    window.GemBot3DMirror = GemBot3DMirror;
}
