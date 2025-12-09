/**
 * GemBot Farm Game - Cyberpunk Gem Cutting Idle/Clicker Game
 * Integrates with real GemBot hardware for bonuses
 * 
 * Features:
 * - Multiple GemBot machines in a virtual farm
 * - Cyberpunk 3D scene environment
 * - Idle gem production with manual boosts
 * - Level progression and achievements
 * - Crypto token rewards integration
 * - Real machine connection bonuses
 */

class GemBotFarmGame {
    constructor() {
        // Babylon.js components
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        
        // Game state
        this.state = {
            player: {
                level: 1,
                xp: 0,
                xpToNext: 100,
                gems: 0,
                tokens: 0,
                totalGemsEver: 0
            },
            machines: [],
            rooms: ['starter_workshop'],
            upgrades: {},
            achievements: [],
            stats: {
                totalCuts: 0,
                perfectCuts: 0,
                playTime: 0,
                realMachineTime: 0
            }
        };
        
        // Game configuration
        this.config = {
            baseProductionRate: 1,
            realMachineBonus: 1.5,
            maxMachinesPerRoom: 6,
            tickRate: 1000, // 1 second
            autoSaveInterval: 30000 // 30 seconds
        };
        
        // Machine types
        this.machineTypes = {
            'gembot_basic': {
                name: 'GemBot Basic',
                cost: 0,
                production: 1,
                speed: 1,
                model: 'basic'
            },
            'gembot_pro': {
                name: 'GemBot Pro',
                cost: 100,
                production: 3,
                speed: 1.5,
                model: 'pro'
            },
            'gembot_ultra': {
                name: 'GemBot Ultra',
                cost: 500,
                production: 10,
                speed: 2,
                model: 'ultra'
            }
        };
        
        // Room types
        this.roomTypes = {
            'starter_workshop': {
                name: 'Starter Workshop',
                slots: 3,
                bonus: 1
            },
            'neon_factory': {
                name: 'Neon Factory',
                cost: 250,
                slots: 6,
                bonus: 1.2
            },
            'quantum_lab': {
                name: 'Quantum Lab',
                cost: 1000,
                slots: 10,
                bonus: 1.5
            }
        };
        
        // Gem types
        this.gemTypes = [
            { name: 'Ruby', value: 5, color: '#ff0040', rarity: 'common' },
            { name: 'Sapphire', value: 8, color: '#0080ff', rarity: 'common' },
            { name: 'Emerald', value: 10, color: '#00ff80', rarity: 'uncommon' },
            { name: 'Amethyst', value: 15, color: '#8000ff', rarity: 'uncommon' },
            { name: 'Diamond', value: 25, color: '#ffffff', rarity: 'rare' },
            { name: 'Opal', value: 40, color: '#ff80ff', rarity: 'rare' },
            { name: 'Alexandrite', value: 100, color: '#00ffff', rarity: 'legendary' }
        ];
        
        // 3D scene objects
        this.sceneObjects = {
            machines: [],
            gemstones: [],
            environment: null
        };
        
        // Game loop
        this.gameLoop = null;
        this.lastTick = Date.now();
        this.isPaused = false;
        
        // Real machine connection
        this.realMachineConnected = false;
        
        // Callbacks
        this.onGemCut = null;
        this.onLevelUp = null;
        this.onAchievement = null;
        this.onUIUpdate = null;
        
        // Load saved state
        this.loadState();
    }
    
    /**
     * Initialize the game with Babylon.js scene
     */
    async initialize(canvasId = 'game-canvas') {
        try {
            console.log('🎮 Initializing GemBot Farm...');
            
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Game canvas not found');
                return false;
            }
            
            // Wait for Babylon.js
            let retries = 0;
            while (typeof BABYLON === 'undefined' && retries < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }
            
            if (typeof BABYLON === 'undefined') {
                console.error('Babylon.js not loaded');
                return false;
            }
            
            // Create engine
            this.engine = new BABYLON.Engine(this.canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });
            
            // Create scene
            await this.createScene();
            
            // Start render loop
            this.engine.runRenderLoop(() => {
                if (this.scene && !this.isPaused) {
                    this.scene.render();
                }
            });
            
            // Handle resize
            window.addEventListener('resize', () => {
                this.engine.resize();
            });
            
            // Start game loop
            this.startGameLoop();
            
            // Ensure player has at least one machine
            if (this.state.machines.length === 0) {
                this.addMachine('gembot_basic', 'starter_workshop');
            }
            
            console.log('✅ GemBot Farm ready!');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            return false;
        }
    }
    
    /**
     * Create the cyberpunk game scene
     */
    async createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        
        // Cyberpunk color scheme
        this.scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.05, 1);
        
        // Camera
        this.camera = new BABYLON.ArcRotateCamera(
            'camera',
            Math.PI / 4,
            Math.PI / 3,
            40,
            new BABYLON.Vector3(0, 5, 0),
            this.scene
        );
        this.camera.attachControl(this.canvas, true);
        this.camera.lowerRadiusLimit = 15;
        this.camera.upperRadiusLimit = 80;
        this.camera.wheelPrecision = 20;
        
        // Cyberpunk lighting
        const mainLight = new BABYLON.HemisphericLight(
            'mainLight',
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        mainLight.intensity = 0.5;
        mainLight.diffuse = new BABYLON.Color3(0.8, 0.8, 1);
        mainLight.groundColor = new BABYLON.Color3(0.2, 0, 0.3);
        
        // Neon accent lights
        this.createNeonLight('neon1', -15, 8, -10, new BABYLON.Color3(1, 0, 0.5));
        this.createNeonLight('neon2', 15, 8, -10, new BABYLON.Color3(0, 1, 1));
        this.createNeonLight('neon3', 0, 8, 15, new BABYLON.Color3(0.5, 0, 1));
        
        // Create environment
        await this.createEnvironment();
        
        // Create initial machines
        this.renderMachines();
        
        // Add particle effects
        this.createAmbientParticles();
    }
    
    /**
     * Create a neon point light
     */
    createNeonLight(name, x, y, z, color) {
        const light = new BABYLON.PointLight(name, new BABYLON.Vector3(x, y, z), this.scene);
        light.diffuse = color;
        light.intensity = 2;
        light.range = 25;
        
        // Create glow sphere
        const glowSphere = BABYLON.MeshBuilder.CreateSphere(
            name + '_glow',
            { diameter: 0.5 },
            this.scene
        );
        glowSphere.position = new BABYLON.Vector3(x, y, z);
        
        const glowMat = new BABYLON.StandardMaterial(name + '_mat', this.scene);
        glowMat.emissiveColor = color;
        glowSphere.material = glowMat;
        
        return light;
    }
    
    /**
     * Create the game environment
     */
    async createEnvironment() {
        // Ground with grid texture
        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground',
            { width: 60, height: 60 },
            this.scene
        );
        
        const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.1);
        groundMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.3);
        
        // Create grid texture procedurally
        const gridTexture = new BABYLON.DynamicTexture('gridTex', 512, this.scene);
        const ctx = gridTexture.getContext();
        ctx.fillStyle = '#0a0a15';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 512; i += 32) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }
        gridTexture.update();
        
        groundMat.diffuseTexture = gridTexture;
        ground.material = groundMat;
        
        // Create workshop building
        this.createWorkshopBuilding();
        
        // Try to load cyberpunk scene
        await this.tryLoadCyberpunkScene();
    }
    
    /**
     * Try to load the cyberpunk GLB scene
     */
    async tryLoadCyberpunkScene() {
        try {
            const result = await BABYLON.SceneLoader.ImportMeshAsync(
                '',
                './',
                'cyberpunk_game_scene.glb',
                this.scene
            );
            
            if (result.meshes.length > 0) {
                console.log('✅ Cyberpunk scene loaded');
                
                // Position and scale the scene
                const root = result.meshes[0];
                root.position = new BABYLON.Vector3(0, 0, -30);
                root.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
                
                this.sceneObjects.environment = root;
            }
        } catch (error) {
            console.log('⚠️ Cyberpunk scene not available, using procedural environment');
        }
    }
    
    /**
     * Create procedural workshop building
     */
    createWorkshopBuilding() {
        // Main workshop platform
        const platform = BABYLON.MeshBuilder.CreateBox(
            'platform',
            { width: 30, height: 1, depth: 20 },
            this.scene
        );
        platform.position = new BABYLON.Vector3(0, 0.5, 0);
        
        const platformMat = new BABYLON.StandardMaterial('platformMat', this.scene);
        platformMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.15);
        platformMat.emissiveColor = new BABYLON.Color3(0.02, 0.02, 0.05);
        platform.material = platformMat;
        
        // Neon edge strips
        this.createNeonStrip(-14.5, 1.1, 0, 0.3, 20, new BABYLON.Color3(1, 0, 0.5));
        this.createNeonStrip(14.5, 1.1, 0, 0.3, 20, new BABYLON.Color3(0, 1, 1));
        this.createNeonStrip(0, 1.1, -9.5, 30, 0.3, new BABYLON.Color3(0.5, 0, 1));
        this.createNeonStrip(0, 1.1, 9.5, 30, 0.3, new BABYLON.Color3(0.5, 0, 1));
        
        // Holographic title
        this.createHolographicText();
    }
    
    /**
     * Create neon strip
     */
    createNeonStrip(x, y, z, width, depth, color) {
        const strip = BABYLON.MeshBuilder.CreateBox(
            'neonStrip',
            { width, height: 0.1, depth },
            this.scene
        );
        strip.position = new BABYLON.Vector3(x, y, z);
        
        const mat = new BABYLON.StandardMaterial('neonMat', this.scene);
        mat.emissiveColor = color;
        mat.diffuseColor = color;
        strip.material = mat;
    }
    
    /**
     * Create holographic title text
     */
    createHolographicText() {
        // Create a simple "GEMBOT FARM" sign
        const plane = BABYLON.MeshBuilder.CreatePlane(
            'titlePlane',
            { width: 12, height: 3 },
            this.scene
        );
        plane.position = new BABYLON.Vector3(0, 8, -9);
        plane.rotation.x = Math.PI * 0.1;
        
        const titleMat = new BABYLON.StandardMaterial('titleMat', this.scene);
        
        // Create title texture
        const titleTex = new BABYLON.DynamicTexture('titleTex', { width: 512, height: 128 }, this.scene);
        const ctx = titleTex.getContext();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 512, 128);
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#00ffff';
        ctx.textAlign = 'center';
        ctx.fillText('GEMBOT FARM', 256, 75);
        titleTex.update();
        titleTex.hasAlpha = true;
        
        titleMat.diffuseTexture = titleTex;
        titleMat.emissiveTexture = titleTex;
        titleMat.backFaceCulling = false;
        titleMat.useAlphaFromDiffuseTexture = true;
        plane.material = titleMat;
    }
    
    /**
     * Create ambient particle effects
     */
    createAmbientParticles() {
        const particleSystem = new BABYLON.ParticleSystem('particles', 100, this.scene);
        
        // Create particle texture
        const particleTex = new BABYLON.DynamicTexture('particleTex', 32, this.scene);
        const ctx = particleTex.getContext();
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(0,255,255,1)');
        gradient.addColorStop(1, 'rgba(0,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        particleTex.update();
        
        particleSystem.particleTexture = particleTex;
        
        // Emitter
        particleSystem.emitter = new BABYLON.Vector3(0, 10, 0);
        particleSystem.minEmitBox = new BABYLON.Vector3(-20, 0, -15);
        particleSystem.maxEmitBox = new BABYLON.Vector3(20, 0, 15);
        
        // Particle behavior
        particleSystem.color1 = new BABYLON.Color4(0, 1, 1, 0.5);
        particleSystem.color2 = new BABYLON.Color4(1, 0, 0.5, 0.5);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;
        
        particleSystem.minLifeTime = 3;
        particleSystem.maxLifeTime = 6;
        
        particleSystem.emitRate = 10;
        
        particleSystem.gravity = new BABYLON.Vector3(0, -0.1, 0);
        
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        
        particleSystem.start();
    }
    
    /**
     * Add a machine to the farm
     */
    addMachine(typeId, roomId) {
        const machineType = this.machineTypes[typeId];
        if (!machineType) {
            console.error('Unknown machine type:', typeId);
            return false;
        }
        
        // Check cost
        if (this.state.player.gems < machineType.cost) {
            console.log('Not enough gems for machine');
            return false;
        }
        
        // Check room capacity
        const roomMachines = this.state.machines.filter(m => m.room === roomId);
        const roomType = this.roomTypes[roomId];
        if (roomMachines.length >= (roomType?.slots || 3)) {
            console.log('Room is full');
            return false;
        }
        
        // Deduct cost
        if (machineType.cost > 0) {
            this.state.player.gems -= machineType.cost;
        }
        
        // Create machine
        const machine = {
            id: 'machine_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: typeId,
            room: roomId,
            level: 1,
            production: machineType.production,
            speed: machineType.speed,
            lastCut: Date.now(),
            totalCuts: 0,
            mesh: null
        };
        
        this.state.machines.push(machine);
        
        // Create 3D representation
        this.createMachineMesh(machine, roomMachines.length);
        
        console.log(`✅ Added ${machineType.name} to ${roomId}`);
        
        if (this.onUIUpdate) this.onUIUpdate(this.state);
        
        return true;
    }
    
    /**
     * Create 3D mesh for a machine
     */
    createMachineMesh(machine, index) {
        if (!this.scene) return;
        
        const machineType = this.machineTypes[machine.type];
        
        // Position in grid
        const gridX = (index % 3) * 8 - 8;
        const gridZ = Math.floor(index / 3) * 8 - 4;
        
        // Create machine group
        const machineRoot = new BABYLON.TransformNode(machine.id, this.scene);
        machineRoot.position = new BABYLON.Vector3(gridX, 1, gridZ);
        
        // Machine base
        const base = BABYLON.MeshBuilder.CreateBox(
            machine.id + '_base',
            { width: 4, height: 2, depth: 3 },
            this.scene
        );
        base.parent = machineRoot;
        base.position.y = 1;
        
        const baseMat = new BABYLON.StandardMaterial(machine.id + '_baseMat', this.scene);
        baseMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.25);
        baseMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.6);
        base.material = baseMat;
        
        // Machine arm (vertical)
        const arm = BABYLON.MeshBuilder.CreateBox(
            machine.id + '_arm',
            { width: 0.5, height: 3, depth: 0.5 },
            this.scene
        );
        arm.parent = machineRoot;
        arm.position = new BABYLON.Vector3(-1.5, 3.5, 0);
        
        const armMat = new BABYLON.StandardMaterial(machine.id + '_armMat', this.scene);
        armMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        arm.material = armMat;
        
        // Spindle head
        const spindle = BABYLON.MeshBuilder.CreateCylinder(
            machine.id + '_spindle',
            { height: 1.5, diameter: 0.8 },
            this.scene
        );
        spindle.parent = machineRoot;
        spindle.position = new BABYLON.Vector3(-1.5, 5.5, 0);
        spindle.rotation.z = Math.PI / 2;
        
        const spindleMat = new BABYLON.StandardMaterial(machine.id + '_spindleMat', this.scene);
        spindleMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.55);
        spindleMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.9);
        spindle.material = spindleMat;
        
        // Lap disc
        const lap = BABYLON.MeshBuilder.CreateCylinder(
            machine.id + '_lap',
            { height: 0.3, diameter: 2 },
            this.scene
        );
        lap.parent = machineRoot;
        lap.position = new BABYLON.Vector3(0.5, 2.2, 0);
        
        const lapMat = new BABYLON.StandardMaterial(machine.id + '_lapMat', this.scene);
        lapMat.diffuseColor = new BABYLON.Color3(0.4, 0.35, 0.3);
        lapMat.specularColor = new BABYLON.Color3(0.6, 0.5, 0.4);
        lap.material = lapMat;
        
        // Status light
        const statusLight = BABYLON.MeshBuilder.CreateSphere(
            machine.id + '_status',
            { diameter: 0.3 },
            this.scene
        );
        statusLight.parent = machineRoot;
        statusLight.position = new BABYLON.Vector3(1.8, 2.3, 1.3);
        
        const statusMat = new BABYLON.StandardMaterial(machine.id + '_statusMat', this.scene);
        statusMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        statusLight.material = statusMat;
        
        // Store mesh reference
        machine.mesh = machineRoot;
        machine.lapMesh = lap;
        machine.statusMesh = statusLight;
        machine.statusMat = statusMat;
        
        // Add spinning animation for lap
        this.scene.registerBeforeRender(() => {
            if (lap && !this.isPaused) {
                lap.rotation.y += 0.02 * machineType.speed;
            }
        });
        
        this.sceneObjects.machines.push(machineRoot);
    }
    
    /**
     * Render all machines
     */
    renderMachines() {
        this.state.machines.forEach((machine, index) => {
            if (!machine.mesh) {
                this.createMachineMesh(machine, index);
            }
        });
    }
    
    /**
     * Start the game loop
     */
    startGameLoop() {
        if (this.gameLoop) return;
        
        this.gameLoop = setInterval(() => {
            if (!this.isPaused) {
                this.tick();
            }
        }, this.config.tickRate);
        
        // Auto-save
        setInterval(() => {
            this.saveState();
        }, this.config.autoSaveInterval);
    }
    
    /**
     * Game tick - process production
     */
    tick() {
        const now = Date.now();
        const deltaTime = (now - this.lastTick) / 1000;
        this.lastTick = now;
        
        // Update play time
        this.state.stats.playTime += deltaTime;
        
        // Process each machine
        this.state.machines.forEach(machine => {
            const timeSinceLastCut = (now - machine.lastCut) / 1000;
            const cutInterval = 1 / (machine.speed * this.getProductionMultiplier());
            
            if (timeSinceLastCut >= cutInterval) {
                this.processCut(machine);
                machine.lastCut = now;
            }
        });
        
        // Check for level up
        this.checkLevelUp();
        
        // Update UI
        if (this.onUIUpdate) this.onUIUpdate(this.state);
    }
    
    /**
     * Process a gem cut
     */
    processCut(machine) {
        // Select random gem type based on level
        const availableGems = this.gemTypes.filter(gem => {
            if (gem.rarity === 'legendary') return this.state.player.level >= 10;
            if (gem.rarity === 'rare') return this.state.player.level >= 5;
            if (gem.rarity === 'uncommon') return this.state.player.level >= 2;
            return true;
        });
        
        const gem = availableGems[Math.floor(Math.random() * availableGems.length)];
        
        // Calculate value with bonuses
        let value = gem.value * machine.production;
        const isPerfect = Math.random() < 0.1; // 10% chance for perfect cut
        
        if (isPerfect) {
            value *= 2;
            this.state.stats.perfectCuts++;
        }
        
        // Apply production multiplier
        value *= this.getProductionMultiplier();
        value = Math.floor(value);
        
        // Add to player
        this.state.player.gems += value;
        this.state.player.totalGemsEver += value;
        this.state.player.xp += Math.floor(value / 2);
        this.state.stats.totalCuts++;
        machine.totalCuts++;
        
        // Visual feedback
        this.showCutEffect(machine, gem, isPerfect);
        
        // Callback
        if (this.onGemCut) {
            this.onGemCut({
                machine,
                gem,
                value,
                perfect: isPerfect
            });
        }
    }
    
    /**
     * Show visual effect for gem cut
     */
    showCutEffect(machine, gem, isPerfect) {
        if (!this.scene || !machine.mesh) return;
        
        // Create floating gem
        const gemMesh = BABYLON.MeshBuilder.CreatePolyhedron(
            'cutGem',
            { type: 2, size: 0.3 },
            this.scene
        );
        gemMesh.position = machine.mesh.position.clone();
        gemMesh.position.y += 3;
        
        const gemMat = new BABYLON.StandardMaterial('cutGemMat', this.scene);
        gemMat.emissiveColor = BABYLON.Color3.FromHexString(gem.color);
        gemMat.diffuseColor = BABYLON.Color3.FromHexString(gem.color);
        gemMesh.material = gemMat;
        
        // Animate up and fade
        let frame = 0;
        const animation = () => {
            if (frame < 60) {
                gemMesh.position.y += 0.05;
                gemMesh.rotation.y += 0.1;
                gemMat.alpha = 1 - (frame / 60);
                frame++;
            } else {
                gemMesh.dispose();
                this.scene.unregisterBeforeRender(animation);
            }
        };
        this.scene.registerBeforeRender(animation);
        
        // Flash status light
        if (machine.statusMat) {
            machine.statusMat.emissiveColor = isPerfect 
                ? new BABYLON.Color3(1, 1, 0) 
                : BABYLON.Color3.FromHexString(gem.color);
            
            setTimeout(() => {
                if (machine.statusMat) {
                    machine.statusMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
                }
            }, 200);
        }
    }
    
    /**
     * Get production multiplier from all sources
     */
    getProductionMultiplier() {
        let mult = this.config.baseProductionRate;
        
        // Level bonus
        mult *= 1 + (this.state.player.level * 0.1);
        
        // Room bonus
        const currentRoom = this.roomTypes[this.state.rooms[this.state.rooms.length - 1]];
        if (currentRoom) {
            mult *= currentRoom.bonus;
        }
        
        // Real machine bonus
        if (this.realMachineConnected) {
            mult *= this.config.realMachineBonus;
        }
        
        return mult;
    }
    
    /**
     * Check and process level up
     */
    checkLevelUp() {
        while (this.state.player.xp >= this.state.player.xpToNext) {
            this.state.player.xp -= this.state.player.xpToNext;
            this.state.player.level++;
            this.state.player.xpToNext = Math.floor(100 * Math.pow(1.5, this.state.player.level - 1));
            
            // Award tokens on level up
            const tokenReward = this.state.player.level * 5;
            this.state.player.tokens += tokenReward;
            
            if (this.onLevelUp) {
                this.onLevelUp(this.state.player.level);
            }
            
            console.log(`🎉 Level up! Now level ${this.state.player.level}, earned ${tokenReward} tokens`);
        }
    }
    
    /**
     * Called when real machine connects
     */
    onRealMachineConnected() {
        this.realMachineConnected = true;
        console.log('🔌 Real GemBot connected - 50% bonus active!');
    }
    
    /**
     * Called when real machine disconnects
     */
    onRealMachineDisconnected() {
        this.realMachineConnected = false;
        console.log('🔌 Real GemBot disconnected');
    }
    
    /**
     * Pause the game
     */
    pause() {
        this.isPaused = true;
    }
    
    /**
     * Resume the game
     */
    resume() {
        this.isPaused = false;
        this.lastTick = Date.now();
    }
    
    /**
     * Get current game state
     */
    getState() {
        return this.state;
    }
    
    /**
     * Save game state
     */
    save() {
        this.saveState();
    }
    
    /**
     * Save state to localStorage
     */
    saveState() {
        try {
            // Clean up non-serializable properties
            const saveData = JSON.parse(JSON.stringify(this.state));
            saveData.machines.forEach(m => {
                delete m.mesh;
                delete m.lapMesh;
                delete m.statusMesh;
                delete m.statusMat;
            });
            
            localStorage.setItem('gembot_farm_save', JSON.stringify(saveData));
            console.log('💾 Game saved');
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }
    
    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('gembot_farm_save');
            if (saved) {
                const data = JSON.parse(saved);
                // Merge with default state to handle new properties
                this.state = { ...this.state, ...data };
                this.state.player = { ...this.state.player, ...data.player };
                this.state.stats = { ...this.state.stats, ...data.stats };
                console.log('📂 Game loaded');
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        if (this.engine) {
            this.engine.dispose();
        }
    }
}

// Export for global access
window.GemBotFarmGame = GemBotFarmGame;
console.log('🎮 GemBot Farm Game module loaded');
