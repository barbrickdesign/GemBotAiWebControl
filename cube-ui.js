/**
 * GemBot Rotating Cube UI
 * Futuristic 3D interface with 6 faces
 * Works on mobile, tablet, and desktop
 */

class GemBotCubeUI {
    constructor() {
        this.currentFace = 0; // 0=Dashboard, 1=Controls, 2=Learning, 3=Stats, 4=Settings, 5=Camera
        this.faces = ['Dashboard', 'Controls', 'Learning', 'Stats', 'Settings', 'Camera'];
        this.isRotating = false;
        this.rotationDuration = 600; // milliseconds
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.setupEventListeners();
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe controls
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
        
        // Mouse wheel controls
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // Arrow button controls
        document.addEventListener('click', (e) => this.handleClickControls(e));
    }
    
    /**
     * Handle keyboard navigation
     */
    handleKeyboard(e) {
        if (this.isRotating) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'd':
                e.preventDefault();
                this.rotateCube('right');
                break;
            case 'ArrowLeft':
            case 'a':
                e.preventDefault();
                this.rotateCube('left');
                break;
            case 'ArrowUp':
            case 'w':
                e.preventDefault();
                this.rotateCube('up');
                break;
            case 'ArrowDown':
            case 's':
                e.preventDefault();
                this.rotateCube('down');
                break;
        }
    }
    
    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        if (this.isRotating) return;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    /**
     * Handle touch end (swipe detection)
     */
    handleTouchEnd(e) {
        if (this.isRotating) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        const minSwipeDistance = 50;
        
        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.rotateCube('left');
            } else {
                this.rotateCube('right');
            }
        }
        // Vertical swipe
        else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                this.rotateCube('up');
            } else {
                this.rotateCube('down');
            }
        }
    }
    
    /**
     * Handle touch move (prevent scrolling during swipe)
     */
    handleTouchMove(e) {
        // Optional: can add drag preview here
    }
    
    /**
     * Handle mouse wheel
     */
    handleWheel(e) {
        if (this.isRotating) return;
        e.preventDefault();
        
        if (e.deltaY > 0) {
            this.rotateCube('right');
        } else {
            this.rotateCube('left');
        }
    }
    
    /**
     * Handle click controls (navigation buttons)
     */
    handleClickControls(e) {
        if (this.isRotating) return;
        
        const target = e.target;
        if (target.classList.contains('cube-nav-left')) {
            this.rotateCube('left');
        } else if (target.classList.contains('cube-nav-right')) {
            this.rotateCube('right');
        } else if (target.classList.contains('cube-nav-up')) {
            this.rotateCube('up');
        } else if (target.classList.contains('cube-nav-down')) {
            this.rotateCube('down');
        } else if (target.classList.contains('cube-face-link')) {
            const faceIndex = parseInt(target.dataset.face);
            this.rotateToCube(faceIndex);
        }
    }
    
    /**
     * Rotate cube in a direction
     */
    rotateCube(direction) {
        if (this.isRotating) return;
        
        this.isRotating = true;
        const cube = document.querySelector('.cube');
        if (!cube) return;
        
        const currentRotation = this.getRotation(cube);
        let newRotation = { ...currentRotation };
        
        switch(direction) {
            case 'right':
                newRotation.y += 90;
                this.currentFace = (this.currentFace + 1) % 6;
                break;
            case 'left':
                newRotation.y -= 90;
                this.currentFace = (this.currentFace - 1 + 6) % 6;
                break;
            case 'up':
                newRotation.x += 90;
                this.currentFace = (this.currentFace + 2) % 6;
                break;
            case 'down':
                newRotation.x -= 90;
                this.currentFace = (this.currentFace - 2 + 6) % 6;
                break;
        }
        
        this.applyRotation(cube, newRotation);
        
        setTimeout(() => {
            this.isRotating = false;
            this.updateFaceIndicator();
            this.onFaceChange(this.currentFace);
        }, this.rotationDuration);
    }
    
    /**
     * Rotate directly to a specific face
     */
    rotateToCube(faceIndex) {
        if (this.isRotating) return;
        
        this.isRotating = true;
        const cube = document.querySelector('.cube');
        if (!cube) return;
        
        const rotations = [
            { x: 0, y: 0 },      // Dashboard (front)
            { x: 0, y: -90 },    // Controls (right)
            { x: 0, y: 180 },    // Learning (back)
            { x: 0, y: 90 },     // Stats (left)
            { x: 90, y: 0 },     // Settings (top)
            { x: -90, y: 0 }     // Camera (bottom)
        ];
        
        this.applyRotation(cube, rotations[faceIndex]);
        this.currentFace = faceIndex;
        
        setTimeout(() => {
            this.isRotating = false;
            this.updateFaceIndicator();
            this.onFaceChange(this.currentFace);
        }, this.rotationDuration);
    }
    
    /**
     * Get current rotation from element
     */
    getRotation(element) {
        const transform = element.style.transform;
        const match = transform.match(/rotateX\(([-\d.]+)deg\)/);
        const match2 = transform.match(/rotateY\(([-\d.]+)deg\)/);
        
        return {
            x: match ? parseFloat(match[1]) : 0,
            y: match2 ? parseFloat(match2[1]) : 0
        };
    }
    
    /**
     * Apply rotation to cube
     */
    applyRotation(element, rotation) {
        element.style.transition = `transform ${this.rotationDuration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        element.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    }
    
    /**
     * Update face indicator
     */
    updateFaceIndicator() {
        const indicator = document.querySelector('.cube-indicator');
        if (indicator) {
            indicator.textContent = `${this.faces[this.currentFace]}`;
            indicator.dataset.face = this.currentFace;
        }
    }
    
    /**
     * Called when face changes
     */
    onFaceChange(faceIndex) {
        console.log(`Switched to: ${this.faces[faceIndex]}`);
        
        // Trigger any face-specific initialization
        switch(faceIndex) {
            case 0: // Dashboard
                this.initDashboard();
                break;
            case 1: // Controls
                this.initControls();
                break;
            case 2: // Learning
                this.initLearning();
                break;
            case 3: // Stats
                this.initStats();
                break;
            case 4: // Settings
                this.initSettings();
                break;
            case 5: // Camera
                this.initCamera();
                break;
        }
    }
    
    /**
     * Initialize Dashboard face
     */
    initDashboard() {
        console.log('Dashboard initialized');
        // Will be populated by main app
    }
    
    /**
     * Initialize Controls face
     */
    initControls() {
        console.log('Controls initialized');
        // Will be populated by main app
    }
    
    /**
     * Initialize Learning face
     */
    initLearning() {
        console.log('Learning initialized');
        // Will be populated by main app
    }
    
    /**
     * Initialize Stats face
     */
    initStats() {
        console.log('Stats initialized');
        // Will be populated by main app
    }
    
    /**
     * Initialize Settings face
     */
    initSettings() {
        console.log('Settings initialized');
        // Will be populated by main app
    }
    
    /**
     * Initialize Camera face
     */
    initCamera() {
        console.log('Camera initialized');
        // Will be populated by main app
    }
    
    /**
     * Get current face index
     */
    getCurrentFace() {
        return this.currentFace;
    }
    
    /**
     * Get face content element
     */
    getFaceElement(index) {
        return document.querySelector(`.cube-face[data-face="${index}"]`);
    }
}

// Export for use in HTML
window.GemBotCubeUI = GemBotCubeUI;
