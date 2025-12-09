/**
 * GemBot Mini Virtual 3D Machine
 * Physics-based simulation using Babylon.js
 * Synchronized with real hardware via serial/USB
 */

class VirtualMachine3D {
    constructor(canvasId = 'babylon-canvas') {
        this.canvasElement = document.getElementById(canvasId);
        this.engine = null;
        this.scene = null;
        this.camera = null;
        
        // 3D Models
        this.machine = null;
        this.xAxisCarriage = null;
        this.yAxisCarriage = null;
        this.pAxisSpindle = null;
        this.workpiecePlaceholder = null;
        
        // Motor specifications (from Arduino code)
        this.motors = {
            // X-axis: 200 steps/rev, 1000 RPM, 16x microstep = 3200 microsteps/rev
            x: {
                stepsPerRev: 200,
                microSteps: 16,
                totalMicrosteps: 3200,
                rpm: 1000,
                maxCount: 4200,  // from Arduino countX
                mmPerRev: 5,     // Estimated based on gantry machine
                currentPosition: 0,
                targetPosition: 0
            },
            // Y-axis: 200 steps/rev, 100 RPM, 16x microstep
            y: {
                stepsPerRev: 200,
                microSteps: 16,
                totalMicrosteps: 3200,
                rpm: 100,
                maxCount: 3300,  // from Arduino countY
                mmPerRev: 5,
                currentPosition: 0,
                targetPosition: 0
            },
            // P-axis (rotation): 200 steps/rev, 300 RPM
            p: {
                stepsPerRev: 200,
                microSteps: 16,
                totalMicrosteps: 3200,
                rpm: 300,
                maxCount: 360,   // Full rotation
                degreesPerRev: 360,
                currentPosition: 0,
                targetPosition: 0
            }
        };
        
        // Movement update interval (from Arduino motorUpdateInterval)
        this.updateInterval = 50; // milliseconds
        this.lastUpdate = 0;
        
        // Animation state
        this.isMoving = false;
        this.movementQueue = [];
        
        // Collision detection
        this.limitSwitches = {
            x: false,
            y: false,
            p: false
        };
    }
    
    /**
     * Initialize Babylon.js scene
     */
    async initialize() {
        try {
            // Wait for BABYLON to be available
            let retries = 0;
            while (typeof BABYLON === 'undefined' && retries < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }
            
            if (typeof BABYLON === 'undefined') {
                throw new Error('Babylon.js failed to load after 5 seconds');
            }
            
            console.log('✅ Babylon.js loaded, initializing scene...');
            
            // Create engine
            this.engine = new BABYLON.Engine(this.canvasElement, true, {
                preserveDrawingBuffer: true,
                antialias: true,
                stencil: true,
                disableWebGL2Support: false
            });
            
            if (!this.engine) {
                throw new Error('Failed to create Babylon.js engine');
            }
            
            console.log('✅ Engine created');
            
            // Create scene
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color3(0.1, 0.12, 0.16);
            this.scene.collisionsEnabled = false; // Disable for now, enable if needed
            
            console.log('✅ Scene created');
            
            // Setup camera - Front view of machine
            this.setupCamera();
            console.log('✅ Camera setup');
            
            // Setup lighting
            this.setupLighting();
            console.log('✅ Lighting setup');
            
            // Create machine geometry
            try {
                this.createMachineGeometry();
                console.log('✅ Machine geometry created');
            } catch (e) {
                console.warn('⚠️ Machine geometry creation failed, creating minimal scene:', e);
                // Create a simple cube instead if geometry fails
                const simpleMesh = BABYLON.MeshBuilder.CreateBox('machineBox', { size: 20 }, this.scene);
                simpleMesh.position.y = 10;
            }
            
            // Skip physics for now - not needed for visualization
            // this.setupPhysics();
            
            // Start render loop
            this.startRenderLoop();
            console.log('✅ Render loop started');
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (this.engine) this.engine.resize();
            });
            
            console.log('✅ Virtual Machine 3D initialized successfully!');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Virtual Machine 3D:', error);
            // Log more details
            console.error('Canvas element:', this.canvasElement);
            console.error('BABYLON defined:', typeof BABYLON !== 'undefined');
            return false;
        }
    }
    
    /**
     * Setup camera for front-facing view
     */
    setupCamera() {
        // Front view camera looking at machine
        this.camera = new BABYLON.ArcRotateCamera(
            'machineCamera',
            Math.PI,              // Alpha (horizontal rotation)
            Math.PI / 2.8,        // Beta (vertical rotation)
            120,                  // Radius (distance) - increased for better view
            new BABYLON.Vector3(0, 35, 0)  // Target (center of machine)
        );
        
        this.camera.attachControl(this.canvasElement, true);
        this.camera.wheelPrecision = 50;
        this.camera.inertia = 0.7;
        this.camera.angularSensibilityX = 1000;
        this.camera.angularSensibilityY = 1000;
        this.camera.minZ = 1;
        this.camera.maxZ = 500;
        
        // Limit camera zoom
        this.camera.lowerRadiusLimit = 40;
        this.camera.upperRadiusLimit = 150;
    }
    
    /**
     * Setup scene lighting
     */
    setupLighting() {
        // Ambient light
        const ambientLight = new BABYLON.HemisphericLight(
            'ambientLight',
            new BABYLON.Vector3(1, 1, 1),
            this.scene
        );
        ambientLight.intensity = 0.6;
        
        // Main directional light
        const mainLight = new BABYLON.PointLight(
            'mainLight',
            new BABYLON.Vector3(50, 100, 50),
            this.scene
        );
        mainLight.intensity = 1.2;
        mainLight.range = 500;
        
        // Fill light from front
        const frontLight = new BABYLON.PointLight(
            'frontLight',
            new BABYLON.Vector3(0, 50, 80),
            this.scene
        );
        frontLight.intensity = 0.8;
        frontLight.range = 400;
    }
    
    /**
     * Create 3D geometry for the machine
     */
    createMachineGeometry() {
        try {
        // Base platform
        const baseSize = 150;
        const baseMaterial = new BABYLON.StandardMaterial('baseMaterial', this.scene);
        baseMaterial.diffuse = new BABYLON.Color3(0.2, 0.2, 0.3);
        baseMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        
        const base = BABYLON.MeshBuilder.CreateBox(
            'machineBase',
            { width: baseSize, height: 5, depth: baseSize },
            this.scene
        );
        base.material = baseMaterial;
        base.position.y = 0;
        
        // Frame columns (vertical supports)
        const frameHeight = 80;
        const frameMaterial = new BABYLON.StandardMaterial('frameMaterial', this.scene);
        frameMaterial.diffuse = new BABYLON.Color3(0.3, 0.3, 0.4);
        
        for (let x of [-baseSize/3, baseSize/3]) {
            for (let z of [-baseSize/3, baseSize/3]) {
                const column = BABYLON.MeshBuilder.CreateCylinder(
                    `column_${x}_${z}`,
                    { diameter: 8, height: frameHeight },
                    this.scene
                );
                column.material = frameMaterial;
                column.position = new BABYLON.Vector3(x, frameHeight/2, z);
            }
        }
        
        // Y-axis rail (front to back movement)
        const yRailMaterial = new BABYLON.StandardMaterial('yRailMaterial', this.scene);
        yRailMaterial.diffuse = new BABYLON.Color3(0.4, 0.4, 0.5);
        
        const yRail = BABYLON.MeshBuilder.CreateBox(
            'yAxisRail',
            { width: 10, height: 8, depth: 100 },
            this.scene
        );
        yRail.material = yRailMaterial;
        yRail.position.y = frameHeight / 2;
        
        // X-axis gantry (left-right movement on Y rail)
        const xGantryMaterial = new BABYLON.StandardMaterial('xGantryMaterial', this.scene);
        xGantryMaterial.diffuse = new BABYLON.Color3(0.3, 0.5, 0.6);
        
        this.xAxisCarriage = BABYLON.MeshBuilder.CreateBox(
            'xAxisCarriage',
            { width: 120, height: 12, depth: 15 },
            this.scene
        );
        this.xAxisCarriage.material = xGantryMaterial;
        this.xAxisCarriage.position.y = frameHeight / 2 + 10;
        this.xAxisCarriage.position.z = 0;
        
        // Y-axis carriage (moves along rails)
        this.yAxisCarriage = BABYLON.MeshBuilder.CreateBox(
            'yAxisCarriage',
            { width: 20, height: 10, depth: 20 },
            this.scene
        );
        this.yAxisCarriage.material = xGantryMaterial;
        this.yAxisCarriage.position.y = frameHeight / 2 + 15;
        this.yAxisCarriage.position.z = 0;
        
        // Parent Y carriage to X carriage
        this.yAxisCarriage.parent = this.xAxisCarriage;
        this.yAxisCarriage.position.z = 0;
        
        // P-axis (rotation/spindle)
        const spindleMaterial = new BABYLON.StandardMaterial('spindleMaterial', this.scene);
        spindleMaterial.diffuse = new BABYLON.Color3(0.8, 0.6, 0.2);
        spindleMaterial.specularColor = new BABYLON.Color3(1, 0.8, 0.4);
        
        this.pAxisSpindle = BABYLON.MeshBuilder.CreateCylinder(
            'pAxisSpindle',
            { diameter: 12, height: 8, tessellation: 32 },
            this.scene
        );
        this.pAxisSpindle.material = spindleMaterial;
        this.pAxisSpindle.position.y = frameHeight / 2 + 25;
        this.pAxisSpindle.position.z = 0;
        
        // Parent spindle to Y carriage
        this.pAxisSpindle.parent = this.yAxisCarriage;
        
        // Workpiece placeholder
        const workpieceMaterial = new BABYLON.StandardMaterial('workpieceMaterial', this.scene);
        workpieceMaterial.diffuse = new BABYLON.Color3(0.9, 0.8, 0.6);
        workpieceMaterial.wireframe = false;
        
        this.workpiecePlaceholder = BABYLON.MeshBuilder.CreateSphere(
            'workpiece',
            { diameter: 8, segments: 16 },
            this.scene
        );
        this.workpiecePlaceholder.material = workpieceMaterial;
        this.workpiecePlaceholder.position.y = frameHeight / 2 + 25;
        this.workpiecePlaceholder.position.z = 5;
        
        // Parent workpiece to spindle
        this.workpiecePlaceholder.parent = this.pAxisSpindle;
        
        // Ground plane for reference
        const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuse = new BABYLON.Color3(0.15, 0.15, 0.2);
        
        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground',
            { width: 200, height: 200, subdivisions: 2 },
            this.scene
        );
        ground.material = groundMaterial;
        ground.position.y = -5;
        } catch (error) {
            console.error('Error creating machine geometry:', error);
            // Create fallback simple box
            const box = BABYLON.MeshBuilder.CreateBox('simpleMachine', { size: 10 }, this.scene);
            box.position.y = 5;
        }
    }
    
    /**
     * Setup physics engine (disabled for now)
     */
    setupPhysics() {
        // Physics disabled - not needed for visualization
        // Enable later if collision detection is needed
        console.log('Physics disabled (visualization only)');
    }
    
    /**
     * Convert motor steps to physical movement
     */
    stepsToMM(axis, steps) {
        const motor = this.motors[axis];
        if (!motor) return 0;
        
        // Calculate rotation: steps / stepsPerRev = revolutions
        const revolutions = steps / motor.stepsPerRev;
        
        // Calculate distance: revolutions * mmPerRev
        return revolutions * motor.mmPerRev;
    }
    
    /**
     * Convert motor steps to rotation angle
     */
    stepsToRotation(axis, steps) {
        const motor = this.motors[axis];
        if (!motor) return 0;
        
        // For rotation axis: steps / stepsPerRev * 360
        return (steps / motor.stepsPerRev) * 360;
    }
    
    /**
     * Move motor to target position
     * @param {string} axis - 'x', 'y', or 'p'
     * @param {number} steps - Number of steps to move
     */
    moveMotor(axis, steps) {
        if (!this.motors[axis]) return;
        
        this.motors[axis].targetPosition += steps;
        
        // Clamp to limits
        this.motors[axis].targetPosition = Math.max(
            0,
            Math.min(this.motors[axis].targetPosition, this.motors[axis].maxCount)
        );
        
        this.isMoving = true;
    }
    
    /**
     * Immediate motor position command
     */
    setMotorPosition(axis, position) {
        if (!this.motors[axis]) return;
        
        this.motors[axis].targetPosition = position;
        this.motors[axis].currentPosition = position;
        
        // Update 3D mesh immediately
        this.updateMachineGeometry();
    }
    
    /**
     * Update 3D geometry based on motor positions
     */
    updateMachineGeometry() {
        if (!this.xAxisCarriage) return;
        
        // X-axis: horizontal left-right movement
        const xMM = this.stepsToMM('x', this.motors.x.currentPosition);
        this.xAxisCarriage.position.x = (xMM - this.stepsToMM('x', this.motors.x.maxCount / 2));
        
        // Y-axis: forward-backward movement (along carriage)
        const yMM = this.stepsToMM('y', this.motors.y.currentPosition);
        this.yAxisCarriage.position.z = yMM - this.stepsToMM('y', this.motors.y.maxCount / 2);
        
        // P-axis: rotation (spindle)
        const rotation = this.stepsToRotation('p', this.motors.p.currentPosition);
        this.pAxisSpindle.rotation.y = BABYLON.Tools.ToRadians(rotation);
    }
    
    /**
     * Animate motor movement (physics-based)
     */
    animateMovement(deltaTime) {
        if (!this.isMoving) return;
        
        let anyMoving = false;
        
        for (let axis of ['x', 'y', 'p']) {
            const motor = this.motors[axis];
            if (motor.currentPosition === motor.targetPosition) continue;
            
            anyMoving = true;
            
            // Calculate speed based on RPM
            const stepRate = (motor.rpm / 60) * motor.stepsPerRev;
            const stepsPerMs = stepRate / 1000;
            const stepChange = stepsPerMs * this.updateInterval;
            
            // Move toward target
            if (motor.currentPosition < motor.targetPosition) {
                motor.currentPosition = Math.min(
                    motor.currentPosition + stepChange,
                    motor.targetPosition
                );
            } else {
                motor.currentPosition = Math.max(
                    motor.currentPosition - stepChange,
                    motor.targetPosition
                );
            }
        }
        
        this.updateMachineGeometry();
        this.isMoving = anyMoving;
    }
    
    /**
     * Start main render loop
     */
    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            const now = performance.now();
            
            // Update physics
            if (now - this.lastUpdate >= this.updateInterval) {
                this.animateMovement(this.updateInterval);
                this.lastUpdate = now;
            }
            
            // Render scene
            this.scene.render();
        });
    }
    
    /**
     * Get current motor positions as object
     */
    getMotorPositions() {
        return {
            x: this.motors.x.currentPosition,
            y: this.motors.y.currentPosition,
            p: this.motors.p.currentPosition
        };
    }
    
    /**
     * Reset all motors to home position
     */
    homeAllMotors() {
        this.motors.x.targetPosition = 0;
        this.motors.y.targetPosition = 0;
        this.motors.p.targetPosition = 0;
    }
    
    /**
     * Emergency stop
     */
    emergencyStop() {
        this.motors.x.targetPosition = this.motors.x.currentPosition;
        this.motors.y.targetPosition = this.motors.y.currentPosition;
        this.motors.p.targetPosition = this.motors.p.currentPosition;
        this.isMoving = false;
    }
    
    /**
     * Dispose and cleanup
     */
    dispose() {
        if (this.engine) {
            this.engine.dispose();
        }
    }
}

// Export for use in HTML
window.VirtualMachine3D = VirtualMachine3D;
