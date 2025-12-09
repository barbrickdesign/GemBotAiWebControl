/**
 * GemBot Farm Game - Cyberpunk Gem Cutting Idle/Clicker Game
 * Integrates with real GemBot hardware for bonuses
 * MERLIN AI INTEGRATION: Merlin guides, teaches, and learns alongside the player
 * 
 * Features:
 * - Multiple GemBot machines in a virtual farm
 * - Cyberpunk 3D scene environment
 * - Idle gem production with manual boosts
 * - Level progression and achievements
 * - Crypto token rewards integration
 * - Real machine connection bonuses
 * - Merlin AI assistant in-game for tips, teaching, and celebration
 */

class GemBotFarmGame {
    constructor() {
        // Babylon.js components
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        
        // Merlin AI Integration
        this.merlin = null;
        this.merlinAvatar = null;
        this.merlinSpeechBubble = null;
        this.merlinLastMessage = '';
        this.merlinMessageQueue = [];
        this.merlinTipInterval = null;
        
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
                realMachineTime: 0,
                merlinTipsReceived: 0,
                lessonsCompleted: 0
            },
            merlinInteractions: {
                tipsGiven: 0,
                questionsAnswered: 0,
                celebrationsMade: 0,
                teachingMoments: 0
            }
        };
        
        // Game configuration
        this.config = {
            baseProductionRate: 1,
            realMachineBonus: 1.5,
            merlinWisdomBonus: 1.1, // Bonus when Merlin gives tips
            maxMachinesPerRoom: 6,
            tickRate: 1000, // 1 second
            autoSaveInterval: 30000, // 30 seconds
            merlinTipInterval: 45000 // Merlin speaks every 45 seconds
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
            
            // Initialize Merlin AI integration
            this.initializeMerlin();
            
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
        
        if (this.merlinTipInterval) {
            clearInterval(this.merlinTipInterval);
            this.merlinTipInterval = null;
        }
        
        if (this.engine) {
            this.engine.dispose();
        }
    }
    
    // ==================== MERLIN AI INTEGRATION ====================
    
    /**
     * Initialize Merlin AI in the game
     */
    initializeMerlin() {
        // Get reference to global Merlin
        this.merlin = window.merlin || null;
        
        if (this.merlin) {
            console.log('🧙 Merlin AI connected to GemBot Farm');
            
            // Create Merlin's avatar in the 3D scene
            this.createMerlinAvatar();
            
            // Welcome message
            this.merlinSpeak(this.getMerlinWelcomeMessage());
            
            // Start periodic tips
            this.startMerlinTips();
            
            // Sync game progress with Merlin's knowledge
            this.syncWithMerlin();
        } else {
            console.log('⚠️ Merlin AI not available, game will function without AI guidance');
        }
    }
    
    /**
     * Create Merlin's 3D avatar in the scene
     */
    createMerlinAvatar() {
        if (!this.scene) return;
        
        // Create wizard character
        const merlinRoot = new BABYLON.TransformNode('merlin_avatar', this.scene);
        merlinRoot.position = new BABYLON.Vector3(-12, 1, 8);
        
        // Robe body
        const robe = BABYLON.MeshBuilder.CreateCylinder('merlin_robe', {
            height: 3,
            diameterTop: 0.8,
            diameterBottom: 1.5
        }, this.scene);
        robe.parent = merlinRoot;
        robe.position.y = 1.5;
        
        const robeMat = new BABYLON.StandardMaterial('merlin_robe_mat', this.scene);
        robeMat.diffuseColor = new BABYLON.Color3(0.2, 0.1, 0.4);
        robeMat.emissiveColor = new BABYLON.Color3(0.1, 0.05, 0.2);
        robe.material = robeMat;
        
        // Head
        const head = BABYLON.MeshBuilder.CreateSphere('merlin_head', { diameter: 0.8 }, this.scene);
        head.parent = merlinRoot;
        head.position.y = 3.4;
        
        const headMat = new BABYLON.StandardMaterial('merlin_head_mat', this.scene);
        headMat.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.7);
        head.material = headMat;
        
        // Wizard hat
        const hat = BABYLON.MeshBuilder.CreateCylinder('merlin_hat', {
            height: 1.2,
            diameterTop: 0,
            diameterBottom: 0.8
        }, this.scene);
        hat.parent = merlinRoot;
        hat.position.y = 4.2;
        
        const hatMat = new BABYLON.StandardMaterial('merlin_hat_mat', this.scene);
        hatMat.diffuseColor = new BABYLON.Color3(0.1, 0.05, 0.3);
        hatMat.emissiveColor = new BABYLON.Color3(0.05, 0.02, 0.15);
        hat.material = hatMat;
        
        // Hat brim
        const brim = BABYLON.MeshBuilder.CreateCylinder('merlin_brim', {
            height: 0.1,
            diameter: 1.2
        }, this.scene);
        brim.parent = merlinRoot;
        brim.position.y = 3.7;
        brim.material = hatMat;
        
        // Staff
        const staff = BABYLON.MeshBuilder.CreateCylinder('merlin_staff', {
            height: 4,
            diameter: 0.1
        }, this.scene);
        staff.parent = merlinRoot;
        staff.position = new BABYLON.Vector3(0.8, 2, 0);
        staff.rotation.z = 0.1;
        
        const staffMat = new BABYLON.StandardMaterial('merlin_staff_mat', this.scene);
        staffMat.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.1);
        staff.material = staffMat;
        
        // Glowing orb on staff
        const orb = BABYLON.MeshBuilder.CreateSphere('merlin_orb', { diameter: 0.4 }, this.scene);
        orb.parent = merlinRoot;
        orb.position = new BABYLON.Vector3(0.9, 4.2, 0);
        
        const orbMat = new BABYLON.StandardMaterial('merlin_orb_mat', this.scene);
        orbMat.emissiveColor = new BABYLON.Color3(0, 1, 1);
        orbMat.diffuseColor = new BABYLON.Color3(0.5, 1, 1);
        orb.material = orbMat;
        
        // Pulsing animation for orb
        this.scene.registerBeforeRender(() => {
            if (orb) {
                const pulse = 0.3 + Math.sin(Date.now() / 500) * 0.1;
                orb.scaling = new BABYLON.Vector3(pulse / 0.4, pulse / 0.4, pulse / 0.4);
            }
        });
        
        // Create speech bubble
        this.createSpeechBubble(merlinRoot);
        
        this.merlinAvatar = merlinRoot;
    }
    
    /**
     * Create speech bubble above Merlin
     */
    createSpeechBubble(parent) {
        const bubblePlane = BABYLON.MeshBuilder.CreatePlane('speech_bubble', {
            width: 6,
            height: 2
        }, this.scene);
        bubblePlane.parent = parent;
        bubblePlane.position = new BABYLON.Vector3(2, 5.5, 0);
        bubblePlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        
        // Dynamic texture for text
        const bubbleTex = new BABYLON.DynamicTexture('bubble_tex', { width: 512, height: 180 }, this.scene);
        
        const bubbleMat = new BABYLON.StandardMaterial('bubble_mat', this.scene);
        bubbleMat.diffuseTexture = bubbleTex;
        bubbleMat.emissiveTexture = bubbleTex;
        bubbleMat.backFaceCulling = false;
        bubbleMat.useAlphaFromDiffuseTexture = true;
        bubblePlane.material = bubbleMat;
        
        this.merlinSpeechBubble = {
            plane: bubblePlane,
            texture: bubbleTex,
            visible: false
        };
        
        // Start hidden
        bubblePlane.isVisible = false;
    }
    
    /**
     * Update speech bubble text
     */
    updateSpeechBubble(text) {
        if (!this.merlinSpeechBubble) return;
        
        const tex = this.merlinSpeechBubble.texture;
        const ctx = tex.getContext();
        
        // Clear and draw background
        ctx.clearRect(0, 0, 512, 180);
        
        // Rounded rectangle background
        ctx.fillStyle = 'rgba(20, 10, 40, 0.9)';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        this.roundRect(ctx, 10, 10, 492, 160, 15);
        ctx.fill();
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        
        // Word wrap
        const words = text.split(' ');
        let line = '';
        let y = 50;
        const maxWidth = 460;
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), 256, y);
                line = word + ' ';
                y += 28;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), 256, y);
        
        tex.update();
        
        // Show bubble
        this.merlinSpeechBubble.plane.isVisible = true;
        
        // Hide after delay
        setTimeout(() => {
            if (this.merlinSpeechBubble) {
                this.merlinSpeechBubble.plane.isVisible = false;
            }
        }, 8000);
    }
    
    /**
     * Helper to draw rounded rectangle
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    /**
     * Make Merlin speak
     */
    merlinSpeak(message) {
        if (!message) return;
        
        this.merlinLastMessage = message;
        this.state.merlinInteractions.tipsGiven++;
        this.state.stats.merlinTipsReceived++;
        
        // Update 3D speech bubble
        this.updateSpeechBubble(message);
        
        // Also display in game activity feed if available
        if (typeof addGameActivity === 'function') {
            addGameActivity(`🧙 Merlin: "${message}"`);
        }
        
        // Use text-to-speech if Merlin's voice is enabled
        if (this.merlin && this.merlin.merlinSettings?.voiceEnabled) {
            this.speakWithVoice(message);
        }
        
        console.log(`🧙 Merlin says: "${message}"`);
    }
    
    /**
     * Text-to-speech for Merlin
     */
    speakWithVoice(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Use Merlin's voice settings
            if (this.merlin?.merlinSettings) {
                utterance.rate = this.merlin.merlinSettings.speechRate || 1.2;
                utterance.pitch = this.merlin.merlinSettings.pitch || 0.55;
                utterance.volume = this.merlin.merlinSettings.volume || 1.0;
            }
            
            // Find a suitable voice
            const voices = speechSynthesis.getVoices();
            const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Mark'));
            if (maleVoice) utterance.voice = maleVoice;
            
            speechSynthesis.speak(utterance);
        }
    }
    
    /**
     * Get contextual welcome message from Merlin
     */
    getMerlinWelcomeMessage() {
        const player = this.state.player;
        const userName = this.merlin?.userProfile?.userName || 'young apprentice';
        
        if (player.totalGemsEver === 0) {
            return `Welcome to the GemBot Farm, ${userName}! I am Merlin, your guide. Watch as the machines cut gems, and I shall teach you the ancient art!`;
        } else if (player.level < 5) {
            return `Ah, ${userName} returns! Your farm grows nicely. Keep cutting gems and you shall unlock the secrets of the rarer stones.`;
        } else if (player.level < 10) {
            return `${userName}, your skill impresses me. The machines respond to your mastery. Soon, you will unlock the legendary Alexandrite!`;
        } else {
            return `Greetings, Master ${userName}! Your gem empire flourishes. I sense great things ahead in your journey.`;
        }
    }
    
    /**
     * Start periodic tips from Merlin
     */
    startMerlinTips() {
        if (this.merlinTipInterval) {
            clearInterval(this.merlinTipInterval);
        }
        
        this.merlinTipInterval = setInterval(() => {
            if (!this.isPaused) {
                this.giveMerlinTip();
            }
        }, this.config.merlinTipInterval);
    }
    
    /**
     * Give contextual tip based on game state
     */
    giveMerlinTip() {
        const tips = this.getContextualTips();
        if (tips.length > 0) {
            const tip = tips[Math.floor(Math.random() * tips.length)];
            this.merlinSpeak(tip);
        }
    }
    
    /**
     * Get tips relevant to current game state
     */
    getContextualTips() {
        const player = this.state.player;
        const machines = this.state.machines;
        const tips = [];
        
        // Level-based tips
        if (player.level < 3) {
            tips.push('Each machine cuts gems automatically. More machines means faster production!');
            tips.push('Watch for the golden glow - that means a PERFECT cut! Double value!');
            tips.push('Your level increases with XP. Higher levels unlock rarer gem types.');
        }
        
        if (player.level >= 3 && player.level < 7) {
            tips.push('The Pro GemBot costs 100 gems but produces 3x faster. A worthy investment!');
            tips.push('Connect a REAL GemBot machine for a 50% production bonus!');
            tips.push('Rare gems like Diamond and Opal are unlocked at higher levels.');
        }
        
        if (player.level >= 7) {
            tips.push('The Ultra GemBot is the pinnacle of gem cutting technology!');
            tips.push('Legendary Alexandrite appears only for master cutters like yourself.');
            tips.push('Your mastery grows. Soon, no gem shall be beyond your skill.');
        }
        
        // Machine-based tips
        if (machines.length === 1) {
            tips.push('A single machine works hard, but two would double your output!');
        }
        
        if (machines.length >= 3) {
            tips.push('Your workshop bustles with activity! Consider upgrading to the Neon Factory for more slots.');
        }
        
        // Economy tips
        if (player.gems > 200 && machines.length < 3) {
            tips.push('You have gems to spare. Perhaps invest in another machine?');
        }
        
        if (player.tokens > 0) {
            tips.push('Tokens earned here can be used in the main GemForge economy!');
        }
        
        // Teaching moments
        tips.push('In real gem cutting, the angle of the facet determines how light dances within the stone.');
        tips.push('The lap spins at thousands of RPM. Patience and precision are the cutter\'s virtues.');
        tips.push('Each gem type has unique hardness. Diamond is hardest, but Opal requires the gentlest touch.');
        tips.push('A perfect cut maximizes brilliance - the light that returns to your eye.');
        
        // Real machine integration tips
        if (this.realMachineConnected) {
            tips.push('Your real GemBot is connected! The virtual farm learns from your actual cuts.');
        } else {
            tips.push('Connect your physical GemBot to earn bonus gems and sync your learning!');
        }
        
        return tips;
    }
    
    /**
     * Merlin celebrates achievements
     */
    merlinCelebrate(achievementType, data) {
        this.state.merlinInteractions.celebrationsMade++;
        
        const celebrations = {
            'level_up': [
                `Magnificent! Level ${data.level}! Your mastery grows!`,
                `You have ascended! Level ${data.level} achieved!`,
                `The ancient spirits acknowledge your growth to level ${data.level}!`
            ],
            'perfect_cut': [
                'A PERFECT cut! The gem sings with brilliance!',
                'Flawless execution! Even I could not have done better!',
                'Perfect! This gem will be spoken of for generations!'
            ],
            'rare_gem': [
                `A ${data.gemName}! Truly rare and precious!`,
                `The ${data.gemName} reveals itself! Fortune smiles upon you!`,
                `${data.gemName}! Few ever witness such beauty!`
            ],
            'new_machine': [
                'A new machine joins your workshop! Production increases!',
                'The workshop grows! Your empire expands!',
                'Another faithful machine to serve your vision!'
            ],
            'milestone': [
                `${data.count} gems cut! A milestone worthy of celebration!`,
                'You have carved your name into gem cutting history!',
                'The ancients would be proud of such achievement!'
            ]
        };
        
        const messages = celebrations[achievementType] || ['Well done, apprentice!'];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.merlinSpeak(message);
    }
    
    /**
     * Sync game progress with Merlin's knowledge system
     */
    syncWithMerlin() {
        if (!this.merlin) return;
        
        // Update Merlin's knowledge of user's game progress
        if (this.merlin.userProfile) {
            // Record game stats
            this.merlin.userProfile.gemForge = this.merlin.userProfile.gemForge || {};
            this.merlin.userProfile.gemForge.gameStats = {
                farmLevel: this.state.player.level,
                totalGems: this.state.player.totalGemsEver,
                machineCount: this.state.machines.length,
                perfectCuts: this.state.stats.perfectCuts,
                playTime: this.state.stats.playTime
            };
            
            // Increase relationship score for playing
            this.merlin.userProfile.merlinRelationshipScore += 1;
            
            // Save Merlin's profile
            this.merlin.saveUserProfile();
        }
    }
    
    /**
     * Get advice from Merlin about a specific topic
     */
    askMerlin(topic) {
        this.state.merlinInteractions.questionsAnswered++;
        
        const advice = {
            'gems': 'Each gem has unique properties. Harder gems like Diamond require slower, more precise cuts. Softer gems like Opal need gentle treatment.',
            'machines': 'Your machines work tirelessly. Upgrade to Pro for speed, or Ultra for maximum production. Each has its purpose.',
            'strategy': 'Balance is key. Invest in machines early, then let production compound. Patience builds empires.',
            'real_machine': 'The virtual farm teaches concepts, but true mastery comes from the physical machine. The two work in harmony.',
            'levels': 'Higher levels unlock rarer gems. Focus on consistent production and perfect cuts to advance quickly.',
            'tokens': 'Tokens earned here have value in the broader GemForge ecosystem. They represent your proven skill.'
        };
        
        const response = advice[topic] || 'Hmm, ask me about gems, machines, strategy, or levels, and I shall enlighten you.';
        this.merlinSpeak(response);
        return response;
    }
}

// Export for global access
window.GemBotFarmGame = GemBotFarmGame;
console.log('🎮 GemBot Farm Game module loaded (with Merlin AI integration)');
