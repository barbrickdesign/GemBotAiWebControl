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
            // ==================== MATERIALS ====================
            const aluminumMat = new BABYLON.StandardMaterial('aluminum', this.scene);
            aluminumMat.diffuse = new BABYLON.Color3(0.75, 0.77, 0.8);
            aluminumMat.specularColor = new BABYLON.Color3(1, 1, 1);
            aluminumMat.specularPower = 96;

            const blackMetalMat = new BABYLON.StandardMaterial('blackMetal', this.scene);
            blackMetalMat.diffuse = new BABYLON.Color3(0.08, 0.08, 0.1);
            blackMetalMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            blackMetalMat.specularPower = 32;

            const stainlessMat = new BABYLON.StandardMaterial('stainless', this.scene);
            stainlessMat.diffuse = new BABYLON.Color3(0.85, 0.87, 0.9);
            stainlessMat.specularColor = new BABYLON.Color3(1, 1, 1);
            stainlessMat.specularPower = 128;

            const chuckMat = new BABYLON.StandardMaterial('chuck', this.scene);
            chuckMat.diffuse = new BABYLON.Color3(0.2, 0.2, 0.2);
            chuckMat.specularColor = new BABYLON.Color3(0.35, 0.35, 0.35);
            chuckMat.specularPower = 64;

            const dopStickMat = new BABYLON.StandardMaterial('dopStick', this.scene);
            dopStickMat.diffuse = new BABYLON.Color3(0.92, 0.9, 0.88);
            dopStickMat.specularColor = new BABYLON.Color3(1, 1, 1);
            dopStickMat.specularPower = 100;

            // Grinding wheel materials
            const wheelMaterials = {
                coarse: this.createWheelMaterial('#C0C0C0', 'coarseWheel'),
                medium: this.createWheelMaterial('#A9A9A9', 'mediumWheel'),
                fine: this.createWheelMaterial('#808080', 'fineWheel'),
                polish: this.createWheelMaterial('#696969', 'polishWheel')
            };

            // ==================== BASE PLATFORM ====================
            const basePlatform = BABYLON.MeshBuilder.CreateBox('basePlatform',
                { width: 280, height: 20, depth: 220 }, this.scene);
            basePlatform.material = aluminumMat;
            basePlatform.position.y = 10;

            // ==================== 20x20 ALUMINUM FRAME ====================
            // Front-left vertical rail
            const railFL = BABYLON.MeshBuilder.CreateBox('railFL',
                { width: 20, height: 180, depth: 20 }, this.scene);
            railFL.material = aluminumMat;
            railFL.position.set(-120, 90, -100);

            // Front-right vertical rail
            const railFR = BABYLON.MeshBuilder.CreateBox('railFR',
                { width: 20, height: 180, depth: 20 }, this.scene);
            railFR.material = aluminumMat;
            railFR.position.set(120, 90, -100);

            // Back-left vertical rail
            const railBL = BABYLON.MeshBuilder.CreateBox('railBL',
                { width: 20, height: 180, depth: 20 }, this.scene);
            railBL.material = aluminumMat;
            railBL.position.set(-120, 90, 100);

            // Back-right vertical rail
            const railBR = BABYLON.MeshBuilder.CreateBox('railBR',
                { width: 20, height: 180, depth: 20 }, this.scene);
            railBR.material = aluminumMat;
            railBR.position.set(120, 90, 100);

            // Top-front horizontal rail
            const railTF = BABYLON.MeshBuilder.CreateBox('railTF',
                { width: 260, height: 20, depth: 20 }, this.scene);
            railTF.material = aluminumMat;
            railTF.position.set(0, 170, -100);

            // Top-back horizontal rail
            const railTB = BABYLON.MeshBuilder.CreateBox('railTB',
                { width: 260, height: 20, depth: 20 }, this.scene);
            railTB.material = aluminumMat;
            railTB.position.set(0, 170, 100);

            // ==================== FLAT HORIZONTAL GRINDING WHEEL ====================
            const wheelDiameter = 100;
            const wheelThickness = 14;

            this.pAxisSpindle = BABYLON.MeshBuilder.CreateCylinder('grindingWheel',
                { diameter: wheelDiameter, height: wheelThickness, tessellation: 64 }, this.scene);
            this.pAxisSpindle.material = wheelMaterials.coarse;
            this.pAxisSpindle.position.set(90, 120, 0);
            // Wheel sits FLAT - no rotation needed
            this.pAxisSpindle.wheelType = 'coarse';
            this.pAxisSpindle.wheelTypes = wheelMaterials;

            // Wheel motor housing
            const wheelMotor = BABYLON.MeshBuilder.CreateBox('wheelMotor',
                { width: 35, height: 35, depth: 35 }, this.scene);
            wheelMotor.material = blackMetalMat;
            wheelMotor.position.set(90, 100, 0);

            // ==================== X-AXIS BALL SCREW (LEFT-RIGHT) ====================
            this.ballScrewX = BABYLON.MeshBuilder.CreateCylinder('ballScrewX',
                { diameter: 12, height: 240, tessellation: 32 }, this.scene);
            this.ballScrewX.material = stainlessMat;
            this.ballScrewX.position.set(0, 155, 0);
            this.ballScrewX.rotation.z = Math.PI / 2;

            // ==================== X-AXIS CARRIAGE ====================
            this.xAxisCarriage = BABYLON.MeshBuilder.CreateBox('xCarriage',
                { width: 60, height: 35, depth: 100 }, this.scene);
            this.xAxisCarriage.material = aluminumMat;
            this.xAxisCarriage.position.set(0, 135, 0);
            this.xAxisPosition = 0;

            // ==================== Y-AXIS BALL SCREW (UP-DOWN) ====================
            this.ballScrewY = BABYLON.MeshBuilder.CreateCylinder('ballScrewY',
                { diameter: 12, height: 120, tessellation: 32 }, this.scene);
            this.ballScrewY.material = stainlessMat;
            this.ballScrewY.position.set(30, 110, 0);

            // ==================== Y-AXIS PLATFORM (RAISES/LOWERS) ====================
            this.yAxisPlatform = BABYLON.MeshBuilder.CreateBox('yPlatform',
                { width: 140, height: 18, depth: 120 }, this.scene);
            this.yAxisPlatform.material = aluminumMat;
            this.yAxisPlatform.position.set(0, 80, 0);
            this.yAxisPlatform.parent = this.xAxisCarriage;
            this.yAxisPosition = 0;

            // ==================== INDEX MOTOR & CHUCK ASSEMBLY ====================
            // Index motor housing (96-step stepper)
            const indexMotorHousing = BABYLON.MeshBuilder.CreateBox('indexMotor',
                { width: 40, height: 40, depth: 40 }, this.scene);
            indexMotorHousing.material = blackMetalMat;
            indexMotorHousing.position.set(-50, 105, 0);
            indexMotorHousing.parent = this.yAxisPlatform;

            // Motor shaft
            this.motorShaft = BABYLON.MeshBuilder.CreateCylinder('motorShaft',
                { diameter: 10, height: 60, tessellation: 24 }, this.scene);
            this.motorShaft.material = stainlessMat;
            this.motorShaft.position.set(-20, 105, 0);
            this.motorShaft.rotation.z = Math.PI / 2;
            this.motorShaft.parent = this.yAxisPlatform;

            // 96-step index gear
            this.indexGear = BABYLON.MeshBuilder.CreateCylinder('indexGear',
                { diameter: 70, height: 12, tessellation: 96 }, this.scene);
            this.indexGear.material = chuckMat;
            this.indexGear.position.set(10, 105, 0);
            this.indexGear.rotation.z = Math.PI / 2;
            this.indexGear.parent = this.yAxisPlatform;

            // ==================== CHUCK (HOLDS DOP STICK) ====================
            this.chuck = BABYLON.MeshBuilder.CreateCylinder('chuck',
                { diameter: 30, height: 35, tessellation: 32 }, this.scene);
            this.chuck.material = chuckMat;
            this.chuck.position.set(40, 105, 0);
            this.chuck.rotation.z = Math.PI / 2;
            this.chuck.parent = this.yAxisPlatform;

            // ==================== DOP STICK (REMOVABLE) ====================
            this.dopStick = BABYLON.MeshBuilder.CreateCylinder('dopStick',
                { diameter: 10, height: 80, tessellation: 16 }, this.scene);
            this.dopStick.material = dopStickMat;
            this.dopStick.position.set(55, 105, 0);
            this.dopStick.rotation.z = Math.PI / 2;
            this.dopStick.parent = this.chuck;
            this.dopStick.isRemovable = true;

            // ==================== GEMSTONE (REMOVABLE) ====================
            this.gemstone = BABYLON.MeshBuilder.CreatePolyhedron('gemstone', { type: 3 }, this.scene);
            this.gemstone.material = new BABYLON.StandardMaterial('gemMat', this.scene);
            this.gemstone.material.diffuse = new BABYLON.Color3(0.95, 0.85, 0.4);
            this.gemstone.material.specularColor = new BABYLON.Color3(1, 1, 1);
            this.gemstone.material.alpha = 0.95;
            this.gemstone.scaling.set(16, 16, 16);
            this.gemstone.position.set(85, 105, 0);
            this.gemstone.parent = this.dopStick;
            this.gemstone.isRemovable = true;

            // ==================== ROUGH STONE SELECTION AREA ====================
            // Work bench for hand prepping rough stones
            const workBench = BABYLON.MeshBuilder.CreateBox('workBench',
                { width: 140, height: 12, depth: 120 }, this.scene);
            workBench.material = new BABYLON.StandardMaterial('benchMat', this.scene);
            workBench.material.diffuse = new BABYLON.Color3(0.35, 0.3, 0.25);
            workBench.position.set(-120, 50, 0);

            // Rough stone display area
            const displayArea = BABYLON.MeshBuilder.CreateBox('displayArea',
                { width: 140, height: 4, depth: 120 }, this.scene);
            displayArea.material = new BABYLON.StandardMaterial('displayMat', this.scene);
            displayArea.material.diffuse = new BABYLON.Color3(0.25, 0.3, 0.28);
            displayArea.position.set(-120, 45, 0);

            // 6 rough stones for selection (different colors)
            for (let i = 0; i < 6; i++) {
                const roughStone = BABYLON.MeshBuilder.CreatePolyhedron('roughStone' + i, { type: 2 }, this.scene);
                roughStone.material = new BABYLON.StandardMaterial('roughMat' + i, this.scene);
                const colors = [
                    new BABYLON.Color3(0.65, 0.55, 0.35),  // Brown
                    new BABYLON.Color3(0.75, 0.72, 0.55),  // Tan
                    new BABYLON.Color3(0.55, 0.65, 0.45),  // Olive
                    new BABYLON.Color3(0.65, 0.65, 0.65),  // Gray
                    new BABYLON.Color3(0.82, 0.65, 0.45),  // Orange
                    new BABYLON.Color3(0.75, 0.58, 0.55)   // Red
                ];
                roughStone.material.diffuse = colors[i];
                roughStone.scaling.set(12, 12, 12);
                roughStone.position.set(-140 + (i % 3) * 40, 65, -50 + Math.floor(i / 3) * 60);
            }

            // ==================== SUPPORT BRACKETS ====================
            const supportL = BABYLON.MeshBuilder.CreateBox('supportL',
                { width: 20, height: 40, depth: 20 }, this.scene);
            supportL.material = aluminumMat;
            supportL.position.set(60, 90, -55);
            supportL.parent = this.yAxisPlatform;

            const supportR = BABYLON.MeshBuilder.CreateBox('supportR',
                { width: 20, height: 40, depth: 20 }, this.scene);
            supportR.material = aluminumMat;
            supportR.position.set(60, 90, 55);
            supportR.parent = this.yAxisPlatform;

            // ==================== COOLING SYSTEM ====================
            const waterTank = BABYLON.MeshBuilder.CreateBox('waterTank',
                { width: 70, height: 30, depth: 50 }, this.scene);
            const waterMat = new BABYLON.StandardMaterial('waterMat', this.scene);
            waterMat.diffuse = new BABYLON.Color3(0.3, 0.6, 0.9);
            waterMat.alpha = 0.5;
            waterTank.material = waterMat;
            waterTank.position.set(70, 35, -80);

            const coolingPump = BABYLON.MeshBuilder.CreateBox('pump',
                { width: 25, height: 25, depth: 25 }, this.scene);
            coolingPump.material = blackMetalMat;
            coolingPump.position.set(60, 25, -100);

            // ==================== TOUCH SCREEN CONTROLLER AREA ====================
            const controlPanel = BABYLON.MeshBuilder.CreateBox('controlPanel',
                { width: 100, height: 120, depth: 20 }, this.scene);
            controlPanel.material = new BABYLON.StandardMaterial('panelMat', this.scene);
            controlPanel.material.diffuse = new BABYLON.Color3(0.15, 0.15, 0.18);
            controlPanel.position.set(-135, 100, 120);

            const panelScreen = BABYLON.MeshBuilder.CreateBox('panelScreen',
                { width: 85, height: 85, depth: 8 }, this.scene);
            panelScreen.material = new BABYLON.StandardMaterial('screenMat', this.scene);
            panelScreen.material.diffuse = new BABYLON.Color3(0.05, 0.05, 0.08);
            panelScreen.position.set(-135, 105, 128);

            // ==================== GROUND REFERENCE ====================
            const ground = BABYLON.MeshBuilder.CreateGround('ground',
                { width: 500, height: 500 }, this.scene);
            const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
            groundMat.diffuse = new BABYLON.Color3(0.15, 0.18, 0.15);
            ground.material = groundMat;
            ground.position.y = 0;

            console.log('✅ Accurate GemBot Gemstone Cutting Machine 3D model created!');
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
     * Update gemstone mesh from detected camera contour (edge detection)
     * Creates/updates a 3D representation based on edge-detected contour points
     * @param {Array} points3D - Array of {x, y, z} points from edge detection
     */
    updateGemContour(points3D) {
        if (!points3D || points3D.length < 10) return;
        
        try {
            // Create or update contour visualization mesh
            if (this.detectedContourMesh) {
                this.detectedContourMesh.dispose();
            }
            
            // Create material for detected gem outline
            if (!this.contourMaterial) {
                this.contourMaterial = new BABYLON.StandardMaterial('contourMat', this.scene);
                this.contourMaterial.diffuseColor = new BABYLON.Color3(0.3, 1, 0.7);
                this.contourMaterial.specularColor = new BABYLON.Color3(0.5, 1, 0.8);
                this.contourMaterial.alpha = 0.7;
                this.contourMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.4, 0.3);
            }
            
            // Build ribbon mesh from contour points for 3D visualization
            const paths = [];
            const topPath = [];
            const bottomPath = [];
            
            for (let i = 0; i < points3D.length; i++) {
                const p = points3D[i];
                // Top surface (positive z)
                topPath.push(new BABYLON.Vector3(p.x, p.y, p.z + 5));
                // Bottom surface (negative z)
                bottomPath.push(new BABYLON.Vector3(p.x, p.y, -p.z - 5));
            }
            
            // Close the paths by connecting back to start
            if (topPath.length > 0) {
                topPath.push(topPath[0].clone());
                bottomPath.push(bottomPath[0].clone());
            }
            
            paths.push(bottomPath);
            paths.push(topPath);
            
            // Create ribbon mesh
            this.detectedContourMesh = BABYLON.MeshBuilder.CreateRibbon('detectedGem', {
                pathArray: paths,
                closePath: false,
                closeArray: false,
                sideOrientation: BABYLON.Mesh.DOUBLESIDE
            }, this.scene);
            
            this.detectedContourMesh.material = this.contourMaterial;
            
            // Position near the gemstone on the dop stick
            this.detectedContourMesh.position.set(85, 105, 0);
            this.detectedContourMesh.scaling.set(0.3, 0.3, 0.3);
            
            // Optionally parent to dop stick so it rotates with the index motor
            if (this.dopStick) {
                this.detectedContourMesh.parent = this.dopStick;
                this.detectedContourMesh.position.set(30, 0, 0);
            }
            
            console.log(`🔷 Updated 3D gem contour with ${points3D.length} points`);
            
        } catch (error) {
            console.warn('Error updating gem contour:', error.message);
        }
    }
    
    /**
     * Clear detected contour mesh
     */
    clearDetectedContour() {
        if (this.detectedContourMesh) {
            this.detectedContourMesh.dispose();
            this.detectedContourMesh = null;
            console.log('🔷 Cleared detected gem contour');
        }
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
