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
     * Setup camera for front-facing view (matches physical reference image)
     */
    setupCamera() {
        // Front view camera looking at machine - optimized for GemBot visualization
        this.camera = new BABYLON.ArcRotateCamera(
            'machineCamera',
            Math.PI,              // Alpha (horizontal rotation) - 180° = front view
            Math.PI / 3,          // Beta (vertical rotation) - ~60° for isometric view
            200,                  // Radius (distance) - increased for better overall view
            new BABYLON.Vector3(0, 55, 0)  // Target (center of machine, accounting for drawer base)
        );
        
        this.camera.attachControl(this.canvasElement, true);
        this.camera.wheelPrecision = 50;
        this.camera.inertia = 0.7;
        this.camera.angularSensibilityX = 1000;
        this.camera.angularSensibilityY = 1000;
        this.camera.minZ = 1;
        this.camera.maxZ = 500;
        
        // Limit camera zoom for comfortable viewing
        this.camera.lowerRadiusLimit = 60;
        this.camera.upperRadiusLimit = 250;
        
        // Enable keyboard controls for better interaction
        this.camera.keys = [];  // Disable default keyboard to prevent conflicts
    }
    
    /**
     * Setup scene lighting for realistic industrial machine appearance
     */
    setupLighting() {
        // Ambient light - subtle base illumination
        const ambientLight = new BABYLON.HemisphericLight(
            'ambientLight',
            new BABYLON.Vector3(0.5, 1, 0.5),
            this.scene
        );
        ambientLight.intensity = 0.5;
        ambientLight.diffuse = new BABYLON.Color3(0.8, 0.8, 0.85);
        ambientLight.groundColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        
        // Main key light - from front left (simulating window/studio light)
        const keyLight = new BABYLON.PointLight(
            'keyLight',
            new BABYLON.Vector3(-80, 120, 100),
            this.scene
        );
        keyLight.intensity = 1.3;
        keyLight.range = 600;
        keyLight.diffuse = new BABYLON.Color3(1, 0.98, 0.95);
        keyLight.specular = new BABYLON.Color3(1, 1, 1);
        
        // Fill light - from front right (softer, warmer)
        const fillLight = new BABYLON.PointLight(
            'fillLight',
            new BABYLON.Vector3(80, 80, 100),
            this.scene
        );
        fillLight.intensity = 0.7;
        fillLight.range = 500;
        fillLight.diffuse = new BABYLON.Color3(0.95, 0.96, 1);
        
        // Top light - for edge highlighting
        const topLight = new BABYLON.PointLight(
            'topLight',
            new BABYLON.Vector3(0, 200, 0),
            this.scene
        );
        topLight.intensity = 0.5;
        topLight.range = 400;
        topLight.diffuse = new BABYLON.Color3(1, 1, 1);
        
        // Back light - subtle rim lighting for depth
        const backLight = new BABYLON.PointLight(
            'backLight',
            new BABYLON.Vector3(0, 100, -150),
            this.scene
        );
        backLight.intensity = 0.3;
        backLight.range = 300;
        backLight.diffuse = new BABYLON.Color3(0.6, 0.7, 0.9);
    }
    
    /**
     * Create 3D geometry for the GemBot Gemstone Cutting Machine
     * Lapidary equipment with index motor (96-step), grinding wheel, and Y-axis platform
     */
    createMachineGeometry() {
        try {
            // === MATERIALS ===
            const blackMetalMaterial = new BABYLON.StandardMaterial('blackMetal', this.scene);
            blackMetalMaterial.diffuse = new BABYLON.Color3(0.15, 0.15, 0.18);
            blackMetalMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.35);
            blackMetalMaterial.specularPower = 32;
            
            const stainlessMaterial = new BABYLON.StandardMaterial('stainless', this.scene);
            stainlessMaterial.diffuse = new BABYLON.Color3(0.7, 0.7, 0.75);
            stainlessMaterial.specularColor = new BABYLON.Color3(0.9, 0.9, 0.95);
            stainlessMaterial.specularPower = 64;
            
            const platformMaterial = new BABYLON.StandardMaterial('platformMaterial', this.scene);
            platformMaterial.diffuse = new BABYLON.Color3(0.25, 0.25, 0.3);
            platformMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.45);
            
            // Grinding wheel materials - different grits with color coding
            const wheelMaterials = {
                coarse: this.createWheelMaterial('#C0C0C0', 'coarseWheel'),      // Light gray - 60-80 grit
                medium: this.createWheelMaterial('#A9A9A9', 'mediumWheel'),      // Dark gray - 120 grit
                fine: this.createWheelMaterial('#808080', 'fineWheel'),           // Darker gray - 220 grit
                polish: this.createWheelMaterial('#696969', 'polishWheel')        // Very dark gray - 600+ grit
            };
            
            const motorMaterial = new BABYLON.StandardMaterial('motorMaterial', this.scene);
            motorMaterial.diffuse = new BABYLON.Color3(0.3, 0.3, 0.35);
            
            const gemstoneMaterial = new BABYLON.StandardMaterial('gemstoneMaterial', this.scene);
            gemstoneMaterial.diffuse = new BABYLON.Color3(0.8, 0.2, 0.2);  // Ruby red
            gemstoneMaterial.specularColor = new BABYLON.Color3(1, 0.5, 0.5);
            gemstoneMaterial.specularPower = 128;
            
            // === BASE STRUCTURE ===
            const baseWidth = 200;
            const baseHeight = 40;
            const baseDepth = 160;
            
            const base = BABYLON.MeshBuilder.CreateBox(
                'machineBase',
                { width: baseWidth, height: baseHeight, depth: baseDepth },
                this.scene
            );
            base.material = blackMetalMaterial;
            base.position.y = baseHeight / 2;
            
            // === INDEX MOTOR HOUSING ===
            // This houses the 96-step rotation stepper motor
            const motorBoxSize = 30;
            const motorHousing = BABYLON.MeshBuilder.CreateBox(
                'indexMotorHousing',
                { width: motorBoxSize, height: motorBoxSize, depth: motorBoxSize },
                this.scene
            );
            motorHousing.material = blackMetalMaterial;
            motorHousing.position.set(-baseWidth / 3, baseHeight + motorBoxSize / 2, 0);
            
            const motorShaft = BABYLON.MeshBuilder.CreateCylinder(
                'motorShaft',
                { diameter: 8, height: 12, tessellation: 16 },
                this.scene
            );
            motorShaft.material = stainlessMaterial;
            motorShaft.position.set(-baseWidth / 3 + motorBoxSize / 2, baseHeight + motorBoxSize / 2, 0);
            motorShaft.rotation.z = Math.PI / 2;
            
            // === GRINDING WHEEL SPINDLE ===
            // Main rotating spindle with interchangeable wheel
            const spindleShaftLength = 100;
            const spindleShaft = BABYLON.MeshBuilder.CreateCylinder(
                'spindleShaft',
                { diameter: 12, height: spindleShaftLength, tessellation: 32 },
                this.scene
            );
            spindleShaft.material = stainlessMaterial;
            spindleShaft.position.set(baseWidth / 3, baseHeight + 60, 0);
            spindleShaft.rotation.z = Math.PI / 2;
            
            // === GRINDING WHEEL - Default COARSE (60-80 grit) ===
            const wheelDiameter = 80;
            const wheelThickness = 12;
            
            this.pAxisSpindle = BABYLON.MeshBuilder.CreateCylinder(
                'grindingWheel',
                { diameter: wheelDiameter, height: wheelThickness, tessellation: 64 },
                this.scene
            );
            this.pAxisSpindle.material = wheelMaterials.coarse;
            this.pAxisSpindle.position.set(baseWidth / 3, baseHeight + 60, 0);
            this.pAxisSpindle.rotation.z = Math.PI / 2;
            this.pAxisSpindle.wheelType = 'coarse';
            this.pAxisSpindle.wheelTypes = wheelMaterials;
            
            // Wheel grooves for texture detail
            for (let i = 0; i < 8; i++) {
                const groove = BABYLON.MeshBuilder.CreateTorus(
                    `groove_${i}`,
                    { diameter: wheelDiameter * 0.95, thickness: 1 },
                    this.scene
                );
                groove.material = new BABYLON.StandardMaterial(`grooveMat_${i}`, this.scene);
                groove.material.diffuse = new BABYLON.Color3(0.4, 0.4, 0.4);
                groove.position.set(baseWidth / 3, baseHeight + 60, -wheelThickness / 2 + (wheelThickness / 9) * i);
                groove.rotation.z = Math.PI / 2;
            }
            
            // === Y-AXIS PLATFORM (Height/Approach Control) ===
            // Raises/lowers gemstone against the spinning wheel
            const platformWidth = 100;
            const platformHeight = 15;
            const platformDepth = 80;
            
            this.yAxisCarriage = BABYLON.MeshBuilder.CreateBox(
                'cuttingPlatform',
                { width: platformWidth, height: platformHeight, depth: platformDepth },
                this.scene
            );
            this.yAxisCarriage.material = platformMaterial;
            this.yAxisCarriage.position.set(0, baseHeight + 80, 0);
            
            // === GEMSTONE HOLDER / FIXTURE ===
            const gemHolderSize = 20;
            const gemHolder = BABYLON.MeshBuilder.CreateBox(
                'gemstoneHolder',
                { width: gemHolderSize, height: gemHolderSize, depth: gemHolderSize },
                this.scene
            );
            gemHolder.material = platformMaterial;
            gemHolder.position.set(baseWidth / 3 - 15, baseHeight + 95, 0);
            gemHolder.parent = this.yAxisCarriage;
            
            // === ACTUAL GEMSTONE (Visual Indicator) ===
            this.workpiecePlaceholder = BABYLON.MeshBuilder.CreateOctahedron(
                'gemstone',
                { size: 6 },
                this.scene
            );
            this.workpiecePlaceholder.material = gemstoneMaterial;
            this.workpiecePlaceholder.position.set(baseWidth / 3 - 5, baseHeight + 95, 0);
            this.workpiecePlaceholder.parent = gemHolder;
            
            // === ANGLE ADJUSTMENT MOTOR ===
            // Secondary stepper controlling cut angle
            const angleMotor = BABYLON.MeshBuilder.CreateCylinder(
                'angleMotor',
                { diameter: 10, height: 10, tessellation: 16 },
                this.scene
            );
            angleMotor.material = motorMaterial;
            angleMotor.position.set(-baseWidth / 3.5, baseHeight + 40, baseDepth / 3);
            
            // Angle adjustment arm
            const angleArm = BABYLON.MeshBuilder.CreateBox(
                'angleArm',
                { width: 8, height: 4, depth: 40 },
                this.scene
            );
            angleArm.material = blackMetalMaterial;
            angleArm.position.set(-baseWidth / 3.5, baseHeight + 45, baseDepth / 2.5);
            
            // === X-AXIS (Lateral Positioning) ===
            this.xAxisCarriage = BABYLON.MeshBuilder.CreateBox(
                'lateralGuide',
                { width: 10, height: 12, depth: baseDepth * 0.8 },
                this.scene
            );
            this.xAxisCarriage.material = blackMetalMaterial;
            this.xAxisCarriage.position.set(0, baseHeight + 30, 0);
            
            // === Z-AXIS SUPPORT FRAME ===
            // Vertical rails for Y-axis movement
            const railThickness = 6;
            const railHeight = 100;
            
            for (let x of [-baseWidth / 2.5, baseWidth / 2.5]) {
                const rail = BABYLON.MeshBuilder.CreateBox(
                    `zRail_${x}`,
                    { width: railThickness, height: railHeight, depth: railThickness },
                    this.scene
                );
                rail.material = stainlessMaterial;
                rail.position.set(x, baseHeight + railHeight / 2, 0);
            }
            
            // === WATER COOLING SYSTEM ===
            const waterTankHeight = 25;
            const waterTank = BABYLON.MeshBuilder.CreateBox(
                'waterTank',
                { width: 60, height: waterTankHeight, depth: 40 },
                this.scene
            );
            const waterMaterial = new BABYLON.StandardMaterial('waterMaterial', this.scene);
            waterMaterial.diffuse = new BABYLON.Color3(0.2, 0.5, 0.8);
            waterMaterial.alpha = 0.6;
            waterTank.material = waterMaterial;
            waterTank.position.set(-baseWidth / 2.5, baseHeight + waterTankHeight / 2, -baseDepth / 2.5);
            
            // === REFERENCE GROUND ===
            const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
            groundMaterial.diffuse = new BABYLON.Color3(0.12, 0.12, 0.15);
            
            const ground = BABYLON.MeshBuilder.CreateGround(
                'ground',
                { width: 300, height: 300, subdivisions: 4 },
                this.scene
            );
            ground.material = groundMaterial;
            ground.position.y = -5;
            
            console.log('✅ GemBot Gemstone Cutting Machine 3D model created successfully!');
        } catch (error) {
            console.error('Error creating machine geometry:', error);
            const fallback = BABYLON.MeshBuilder.CreateBox('fallback', { size: 20 }, this.scene);
            fallback.material = new BABYLON.StandardMaterial('fallbackMat', this.scene);
            fallback.position.y = 20;
        }
    }
    
    /**
     * Create grinding wheel material with texture-like appearance
     */
    createWheelMaterial(hexColor, name) {
        const material = new BABYLON.StandardMaterial(name, this.scene);
        const rgb = parseInt(hexColor.substring(1), 16);
        const r = (rgb >> 16) & 255;
        const g = (rgb >> 8) & 255;
        const b = rgb & 255;
        
        material.diffuse = new BABYLON.Color3(r / 255, g / 255, b / 255);
        material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        material.specularPower = 16;
        
        return material;
    }
    
    /**
     * Change grinding wheel (grit type)
     */
    changeGrindingWheel(wheelType) {
        if (!this.pAxisSpindle || !this.pAxisSpindle.wheelTypes) return;
        
        const wheelTypes = ['coarse', 'medium', 'fine', 'polish'];
        if (!wheelTypes.includes(wheelType)) {
            console.warn(`Unknown wheel type: ${wheelType}`);
            return;
        }
        
        this.pAxisSpindle.material = this.pAxisSpindle.wheelTypes[wheelType];
        this.pAxisSpindle.wheelType = wheelType;
        
        console.log(`🔄 Grinding wheel changed to: ${wheelType}`);
    }
    
    /**
     * Get current wheel type
     */
    getCurrentWheel() {
        return this.pAxisSpindle ? this.pAxisSpindle.wheelType : null;
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
