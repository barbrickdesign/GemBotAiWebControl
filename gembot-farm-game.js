/**
 * GemBot Farm Game - Cyberpunk Gem Cutting Idle/Clicker Game
 * Integrates with real GemBot hardware for bonuses
 * MERLIN AI INTEGRATION: Merlin guides, teaches, and learns alongside the player
 * 
 * REALISTIC TIMING SYSTEM (Based on actual GemBot machine):
 * - Reflects real gem cutting process: prep, dop, shape, preform, cut, polish
 * - Timing derived from Arduino code: 50ms motor intervals, 40 steps/mm removal
 * - Lap progression: 600→800→1200 grit, then polish with 8k→14k→50k→100k→200k paste
 * - Includes human interaction requirements and realistic hazards
 * 
 * Features:
 * - Multiple GemBot machines in a virtual farm
 * - Cyberpunk 3D scene environment
 * - REALISTIC gem cutting with proper timing
 * - Level progression and achievements
 * - Crypto token rewards integration
 * - Real machine connection bonuses
 * - Merlin AI assistant in-game for tips, teaching, and celebration
 * - Educational - teaches actual faceting process
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
                totalGemsEver: 0,
                stonesLost: 0,        // Stones lost to accidents
                stonesCompleted: 0    // Successfully completed stones
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
                lessonsCompleted: 0,
                dopFailures: 0,       // Stones flew off dop
                transferFailures: 0,  // Alignment failures during transfer
                totalTimeSpentCutting: 0 // Real accumulated cutting time (seconds)
            },
            merlinInteractions: {
                tipsGiven: 0,
                questionsAnswered: 0,
                celebrationsMade: 0,
                teachingMoments: 0
            },
            currentStones: [] // Stones currently being cut
        };
        
        // Game configuration
        this.config = {
            baseProductionRate: 1,
            realMachineBonus: 1.5,
            merlinWisdomBonus: 1.1, // Bonus when Merlin gives tips
            maxMachinesPerRoom: 6,
            tickRate: 1000, // 1 second game tick
            autoSaveInterval: 30000, // 30 seconds
            merlinTipInterval: 45000, // Merlin speaks every 45 seconds
            // Realistic timing factors (in game-seconds, accelerated from real hours)
            timeAcceleration: 60 // 1 real second = 60 game seconds (1 min = 1 hr of cutting)
        };
        
        // Machine types - affects cutting speed and precision
        this.machineTypes = {
            'gembot_basic': {
                name: 'GemBot Basic',
                cost: 0,
                production: 1,
                speed: 1,        // Base speed multiplier
                precision: 0.7,  // Lower precision = more dop failures
                model: 'basic'
            },
            'gembot_pro': {
                name: 'GemBot Pro',
                cost: 100,
                production: 3,
                speed: 1.5,
                precision: 0.85,
                model: 'pro'
            },
            'gembot_ultra': {
                name: 'GemBot Ultra',
                cost: 500,
                production: 10,
                speed: 2,
                precision: 0.95, // High precision = fewer accidents
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
        
        // ==================== REALISTIC GEM CUTTING DATA ====================
        // Based on actual faceting: hardness affects cut time, complexity affects stages
        
        // Mohs hardness scale affects cutting time significantly
        // Harder stones = more time on each lap
        this.gemTypes = [
            { 
                name: 'Quartz (Amethyst)', 
                value: 15, 
                color: '#8000ff', 
                rarity: 'common',
                hardness: 7,           // Mohs scale
                complexity: 'simple',  // 32 facets standard
                facetCount: 32,
                fragility: 0.1,        // 10% chance of issues
                description: 'Good starter stone, forgiving material'
            },
            { 
                name: 'Quartz (Citrine)', 
                value: 12, 
                color: '#ffaa00', 
                rarity: 'common',
                hardness: 7,
                complexity: 'simple',
                facetCount: 32,
                fragility: 0.1,
                description: 'Warm colored quartz, easy to cut'
            },
            { 
                name: 'Garnet', 
                value: 20, 
                color: '#8b0000', 
                rarity: 'common',
                hardness: 7.5,
                complexity: 'simple',
                facetCount: 48,
                fragility: 0.15,
                description: 'Classic red gem, slightly harder'
            },
            { 
                name: 'Topaz', 
                value: 35, 
                color: '#ffd700', 
                rarity: 'uncommon',
                hardness: 8,
                complexity: 'medium',
                facetCount: 57,
                fragility: 0.2,        // Perfect cleavage = risky
                description: 'Beautiful but has perfect cleavage - handle with care!'
            },
            { 
                name: 'Emerald', 
                value: 80, 
                color: '#00ff80', 
                rarity: 'uncommon',
                hardness: 7.5,
                complexity: 'medium',
                facetCount: 48,
                fragility: 0.25,       // Inclusions make it fragile
                description: 'Precious but included - high risk of fracture'
            },
            { 
                name: 'Ruby', 
                value: 120, 
                color: '#ff0040', 
                rarity: 'rare',
                hardness: 9,           // Corundum
                complexity: 'complex',
                facetCount: 64,
                fragility: 0.05,       // Very durable
                description: 'Second hardest gem - takes time but very durable'
            },
            { 
                name: 'Sapphire', 
                value: 150, 
                color: '#0080ff', 
                rarity: 'rare',
                hardness: 9,
                complexity: 'complex',
                facetCount: 64,
                fragility: 0.05,
                description: 'Corundum like ruby - requires patience'
            },
            { 
                name: 'Opal', 
                value: 100, 
                color: '#ff80ff', 
                rarity: 'rare',
                hardness: 5.5,         // Soft!
                complexity: 'special', // Cabochon usually
                facetCount: 0,         // Usually cabochon cut
                fragility: 0.4,        // Very fragile, heat sensitive
                description: 'Delicate! Soft, heat-sensitive, requires special care'
            },
            { 
                name: 'Diamond', 
                value: 500, 
                color: '#ffffff', 
                rarity: 'legendary',
                hardness: 10,          // Hardest
                complexity: 'master',
                facetCount: 57,        // Brilliant cut
                fragility: 0.08,       // Cleavage planes
                description: 'Ultimate challenge - hardest material, cleavage planes'
            },
            { 
                name: 'Alexandrite', 
                value: 1000, 
                color: '#00ffff', 
                rarity: 'legendary',
                hardness: 8.5,
                complexity: 'master',
                facetCount: 72,
                fragility: 0.12,
                description: 'Color-changing chrysoberyl - extremely rare and valuable'
            }
        ];
        
        // ==================== CUTTING STAGES & TIMING ====================
        // Based on actual GemBot process: prep → shape → cut → polish → transfer → repeat
        // Times in game-seconds (1 game-second = 1/60 real second with acceleration)
        
        this.cuttingStages = {
            // PREPARATION (Human interaction required)
            'prep_rough': {
                name: 'Inspect & Prep Rough',
                description: 'Examine rough stone, plan orientation, clean material',
                baseTime: 120,  // 2 min game time
                humanRequired: true,
                canFail: false
            },
            'dop_stone': {
                name: 'Dop the Stone',
                description: 'Heat dop wax, attach stone to dop stick, align properly',
                baseTime: 180,  // 3 min game time
                humanRequired: true,
                canFail: true,
                failureType: 'dop_failure',
                failureChance: 0.02 // 2% base chance
            },
            'mount_chuck': {
                name: 'Mount in Chuck',
                description: 'Insert dop into machine chuck, verify alignment',
                baseTime: 60,   // 1 min game time
                humanRequired: true,
                canFail: false
            },
            
            // PREFORM PAVILION (Machine + human monitoring)
            'preform_girdle': {
                name: 'Preform Girdle',
                description: 'Shape the outline at 90° using coarse lap',
                baseTime: 300,  // 5 min - 96 index positions, rough shaping
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: 'coarse'
            },
            'preform_pavilion': {
                name: 'Preform Pavilion Point',
                description: 'Cut pavilion to a point at ~42° angle',
                baseTime: 240,  // 4 min
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: 'coarse'
            },
            
            // CUT PAVILION FACETS (Progressive laps)
            'cut_pavilion_600': {
                name: 'Cut Pavilion (600 grit)',
                description: 'Cut main pavilion facets with 600 grit lap',
                baseTime: 480,  // 8 min - based on 40 steps/mm, multiple angles
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: '600_grit'
            },
            'cut_pavilion_800': {
                name: 'Refine Pavilion (800 grit)',
                description: 'Remove 600 grit scratches, refine facets',
                baseTime: 360,  // 6 min
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: '800_grit'
            },
            'cut_pavilion_1200': {
                name: 'Pre-polish Pavilion (1200 grit)',
                description: 'Final cutting lap, prepare for polish',
                baseTime: 300,  // 5 min
                humanRequired: false,
                canFail: false,
                lapType: '1200_grit'
            },
            
            // POLISH PAVILION (Diamond paste progression)
            'polish_pavilion_8k': {
                name: 'Polish Pavilion (8,000 grit)',
                description: 'Begin polish sequence with 8k diamond paste on copper lap',
                baseTime: 420,  // 7 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_8k'
            },
            'polish_pavilion_14k': {
                name: 'Polish Pavilion (14,000 grit)',
                description: 'Continue polish with 14k paste',
                baseTime: 360,  // 6 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_14k'
            },
            'polish_pavilion_50k': {
                name: 'Polish Pavilion (50,000 grit)',
                description: 'High polish with 50k paste',
                baseTime: 300,  // 5 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_50k'
            },
            'polish_pavilion_100k': {
                name: 'Polish Pavilion (100,000 grit)',
                description: 'Near-final polish with 100k paste',
                baseTime: 300,  // 5 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_100k'
            },
            'polish_pavilion_200k': {
                name: 'Final Polish Pavilion (200,000 grit)',
                description: 'Mirror finish with 200k paste',
                baseTime: 240,  // 4 min
                humanRequired: false,
                canFail: false,
                lapType: 'copper_200k'
            },
            
            // TRANSFER (Critical human step - high failure risk)
            'remove_from_machine': {
                name: 'Remove from Machine',
                description: 'Carefully remove dop from chuck',
                baseTime: 60,
                humanRequired: true,
                canFail: false
            },
            'transfer_dop': {
                name: 'Transfer to Crown Dop',
                description: 'Heat transfer - align pavilion, attach crown dop, release old dop',
                baseTime: 300,  // 5 min - CRITICAL STEP
                humanRequired: true,
                canFail: true,
                failureType: 'transfer_failure',
                failureChance: 0.05 // 5% base chance - this is where stones are often lost!
            },
            'remount_chuck': {
                name: 'Remount for Crown',
                description: 'Insert crown dop, verify alignment to pavilion',
                baseTime: 120,
                humanRequired: true,
                canFail: true,
                failureType: 'alignment_failure',
                failureChance: 0.03
            },
            
            // CUT CROWN (Same progression as pavilion)
            'preform_crown': {
                name: 'Preform Crown',
                description: 'Shape crown angle at ~42°',
                baseTime: 240,
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: 'coarse'
            },
            'cut_table': {
                name: 'Cut Table Facet',
                description: 'Flatten table at 0° angle',
                baseTime: 180,  // 3 min
                humanRequired: false,
                canFail: false,
                lapType: '600_grit'
            },
            'cut_crown_600': {
                name: 'Cut Crown (600 grit)',
                description: 'Cut crown mains and star facets',
                baseTime: 540,  // 9 min - more facets than pavilion typically
                humanRequired: false,
                canFail: true,
                failureType: 'dop_flyoff',
                lapType: '600_grit'
            },
            'cut_crown_800': {
                name: 'Refine Crown (800 grit)',
                description: 'Remove scratches from crown',
                baseTime: 420,
                humanRequired: false,
                canFail: false,
                lapType: '800_grit'
            },
            'cut_crown_1200': {
                name: 'Pre-polish Crown (1200 grit)',
                description: 'Prepare crown for polish',
                baseTime: 360,
                humanRequired: false,
                canFail: false,
                lapType: '1200_grit'
            },
            
            // POLISH CROWN
            'polish_crown_8k': {
                name: 'Polish Crown (8,000 grit)',
                description: 'Begin crown polish with 8k paste',
                baseTime: 480,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_8k'
            },
            'polish_crown_14k': {
                name: 'Polish Crown (14,000 grit)',
                description: 'Continue with 14k paste',
                baseTime: 420,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_14k'
            },
            'polish_crown_50k': {
                name: 'Polish Crown (50,000 grit)',
                description: 'High polish crown',
                baseTime: 360,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_50k'
            },
            'polish_crown_100k': {
                name: 'Polish Crown (100,000 grit)',
                description: 'Near-final crown polish',
                baseTime: 300,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_100k'
            },
            'polish_crown_200k': {
                name: 'Final Polish Crown (200,000 grit)',
                description: 'Mirror finish on crown',
                baseTime: 240,
                humanRequired: false,
                canFail: false,
                lapType: 'copper_200k'
            },
            
            // COMPLETION
            'final_remove': {
                name: 'Remove Finished Stone',
                description: 'Heat dop, carefully remove completed gemstone',
                baseTime: 180,
                humanRequired: true,
                canFail: true,
                failureType: 'removal_chip',
                failureChance: 0.01 // 1% chance of chipping on removal
            },
            'clean_inspect': {
                name: 'Clean & Inspect',
                description: 'Clean stone, inspect for quality, grade the cut',
                baseTime: 120,
                humanRequired: true,
                canFail: false
            }
        };
        
        // Stage order for complete cut
        this.stageOrder = [
            'prep_rough', 'dop_stone', 'mount_chuck',
            'preform_girdle', 'preform_pavilion',
            'cut_pavilion_600', 'cut_pavilion_800', 'cut_pavilion_1200',
            'polish_pavilion_8k', 'polish_pavilion_14k', 'polish_pavilion_50k', 
            'polish_pavilion_100k', 'polish_pavilion_200k',
            'remove_from_machine', 'transfer_dop', 'remount_chuck',
            'preform_crown', 'cut_table',
            'cut_crown_600', 'cut_crown_800', 'cut_crown_1200',
            'polish_crown_8k', 'polish_crown_14k', 'polish_crown_50k',
            'polish_crown_100k', 'polish_crown_200k',
            'final_remove', 'clean_inspect'
        ];
        
        // Calculate total base time for a simple stone (in game-seconds)
        // Sum of all stages = ~7200 game-seconds = 2 hours real time (accelerated)
        // With 60x acceleration = ~2 minutes real time for a simple stone
        
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
     * Game tick - process production with REALISTIC TIMING
     */
    tick() {
        const now = Date.now();
        const deltaTime = (now - this.lastTick) / 1000;
        this.lastTick = now;
        
        // Update play time
        this.state.stats.playTime += deltaTime;
        
        // Calculate game time passed (accelerated)
        const gameTimePassed = deltaTime * this.config.timeAcceleration;
        
        // Process each machine's current stone
        this.state.machines.forEach(machine => {
            this.processRealisticCutting(machine, gameTimePassed);
        });
        
        // Check for level up
        this.checkLevelUp();
        
        // Update UI
        if (this.onUIUpdate) this.onUIUpdate(this.state);
    }
    
    /**
     * Process realistic gem cutting with stages, timing, and hazards
     */
    processRealisticCutting(machine, gameTimePassed) {
        const machineType = this.machineTypes[machine.type];
        
        // If machine has no current stone, start a new one
        if (!machine.currentStone) {
            this.startNewStone(machine);
            return;
        }
        
        const stone = machine.currentStone;
        const stage = this.cuttingStages[stone.currentStage];
        
        if (!stage) {
            console.error('Invalid stage:', stone.currentStage);
            return;
        }
        
        // Calculate time for this stage based on gem properties
        const stageTime = this.calculateStageTime(stone, stage, machineType);
        
        // Progress the stage
        stone.stageProgress += gameTimePassed * machineType.speed;
        
        // Update accumulated cutting time
        this.state.stats.totalTimeSpentCutting += gameTimePassed / this.config.timeAcceleration;
        
        // Check for stage completion
        if (stone.stageProgress >= stageTime) {
            // Stage complete - check for failure
            if (stage.canFail) {
                const failureResult = this.checkForFailure(stone, stage, machineType);
                if (failureResult.failed) {
                    this.handleCuttingFailure(machine, stone, failureResult);
                    return;
                }
            }
            
            // Move to next stage
            this.advanceToNextStage(machine, stone);
        }
        
        // Update machine visuals based on current stage
        this.updateMachineVisuals(machine, stone, stage);
    }
    
    /**
     * Start cutting a new stone on a machine
     */
    startNewStone(machine) {
        // Select gem type based on player level
        const availableGems = this.gemTypes.filter(gem => {
            if (gem.rarity === 'legendary') return this.state.player.level >= 15;
            if (gem.rarity === 'rare') return this.state.player.level >= 8;
            if (gem.rarity === 'uncommon') return this.state.player.level >= 3;
            return true;
        });
        
        const gem = availableGems[Math.floor(Math.random() * availableGems.length)];
        
        // Create stone cutting record
        machine.currentStone = {
            id: 'stone_' + Date.now(),
            gem: gem,
            currentStage: this.stageOrder[0], // Start with prep
            stageIndex: 0,
            stageProgress: 0,
            startTime: Date.now(),
            perfectBonus: 1, // Increases with good execution
            qualityScore: 100, // Decreases with issues
            isPaused: false,  // For human interaction stages
            failureLog: []
        };
        
        // Notify of new stone
        if (this.merlin) {
            this.merlinSpeak(`Starting a ${gem.name} - ${gem.description}`);
        }
        
        console.log(`💎 Started cutting: ${gem.name} (Hardness: ${gem.hardness}, Facets: ${gem.facetCount})`);
    }
    
    /**
     * Calculate time required for a stage based on gem properties
     */
    calculateStageTime(stone, stage, machineType) {
        const gem = stone.gem;
        let time = stage.baseTime;
        
        // Hardness multiplier: harder stones take longer to cut
        // Base is hardness 7 (quartz), scale from there
        const hardnessMultiplier = Math.pow(gem.hardness / 7, 1.5);
        time *= hardnessMultiplier;
        
        // Complexity multiplier: more facets = more time
        const facetMultiplier = gem.facetCount > 0 ? (gem.facetCount / 32) : 1;
        if (stage.name.includes('Cut') || stage.name.includes('Polish')) {
            time *= facetMultiplier;
        }
        
        // Special handling for soft stones (opal)
        if (gem.hardness < 6) {
            // Soft stones need gentler (slower) cutting on machine stages
            if (!stage.humanRequired) {
                time *= 1.5;
            }
        }
        
        return time;
    }
    
    /**
     * Check if a failure occurs during a stage
     */
    checkForFailure(stone, stage, machineType) {
        const gem = stone.gem;
        let failureChance = stage.failureChance || 0.02;
        
        // Gem fragility affects failure chance
        failureChance += gem.fragility * 0.1;
        
        // Machine precision reduces failure chance
        failureChance *= (1 - machineType.precision);
        
        // Player skill (level) reduces failure
        const skillReduction = Math.min(this.state.player.level * 0.01, 0.3);
        failureChance *= (1 - skillReduction);
        
        // Roll for failure
        if (Math.random() < failureChance) {
            return {
                failed: true,
                type: stage.failureType || 'unknown',
                recoverable: stage.failureType !== 'dop_flyoff' // Some failures can be recovered
            };
        }
        
        return { failed: false };
    }
    
    /**
     * Handle a cutting failure
     */
    handleCuttingFailure(machine, stone, failureResult) {
        const gem = stone.gem;
        
        stone.failureLog.push({
            stage: stone.currentStage,
            type: failureResult.type,
            time: Date.now()
        });
        
        switch (failureResult.type) {
            case 'dop_flyoff':
                // Stone flew off the dop - catastrophic loss
                this.state.stats.dopFailures++;
                this.state.player.stonesLost++;
                machine.currentStone = null;
                
                if (this.merlin) {
                    const messages = [
                        `Oh no! The ${gem.name} flew off the dop! This is why we always check our dop wax temperature.`,
                        `The stone escaped! Remember: proper dop adhesion is critical. The ${gem.name} is lost.`,
                        `Disaster! The ${gem.name} launched from the dop. Always ensure firm adhesion before cutting.`
                    ];
                    this.merlinSpeak(messages[Math.floor(Math.random() * messages.length)]);
                }
                console.log(`❌ STONE LOST: ${gem.name} flew off dop at ${stone.currentStage}`);
                break;
                
            case 'dop_failure':
                // Dop didn't hold during mounting - restart
                this.state.stats.dopFailures++;
                stone.stageIndex = 0;
                stone.currentStage = this.stageOrder[0];
                stone.stageProgress = 0;
                stone.qualityScore -= 5;
                
                if (this.merlin) {
                    this.merlinSpeak(`The dop wax didn't hold. Let's try mounting the ${gem.name} again. Heat management is key!`);
                }
                break;
                
            case 'transfer_failure':
                // Transfer failed - stone may be damaged but not lost
                this.state.stats.transferFailures++;
                stone.qualityScore -= 20;
                stone.perfectBonus *= 0.8;
                
                // Go back to try transfer again
                stone.stageProgress = 0;
                
                if (stone.qualityScore < 50) {
                    // Too damaged, lose the stone
                    this.state.player.stonesLost++;
                    machine.currentStone = null;
                    if (this.merlin) {
                        this.merlinSpeak(`The ${gem.name} couldn't survive the transfer. Alignment is everything in gem cutting.`);
                    }
                } else {
                    if (this.merlin) {
                        this.merlinSpeak(`Transfer misaligned! The ${gem.name} is damaged but salvageable. Quality reduced.`);
                    }
                }
                break;
                
            case 'alignment_failure':
                // Crown alignment issue - reduces quality
                stone.qualityScore -= 15;
                stone.perfectBonus *= 0.9;
                stone.stageProgress = 0;
                
                if (this.merlin) {
                    this.merlinSpeak(`Crown misaligned with pavilion. This affects brilliance. Re-mounting...`);
                }
                break;
                
            case 'removal_chip':
                // Chipped during removal - partial loss
                stone.qualityScore -= 25;
                stone.perfectBonus *= 0.7;
                
                if (this.merlin) {
                    this.merlinSpeak(`Ouch! A small chip occurred during removal. The ${gem.name} loses some value.`);
                }
                break;
        }
    }
    
    /**
     * Advance stone to next cutting stage
     */
    advanceToNextStage(machine, stone) {
        const prevStage = stone.currentStage;
        stone.stageIndex++;
        stone.stageProgress = 0;
        
        // Check if stone is complete
        if (stone.stageIndex >= this.stageOrder.length) {
            this.completeStone(machine, stone);
            return;
        }
        
        stone.currentStage = this.stageOrder[stone.stageIndex];
        const newStage = this.cuttingStages[stone.currentStage];
        
        // Log stage transition
        console.log(`🔧 ${stone.gem.name}: ${prevStage} → ${stone.currentStage}`);
        
        // Merlin commentary on important stages
        if (this.merlin && Math.random() < 0.3) { // 30% chance to comment
            this.giveStageTip(stone, newStage);
        }
    }
    
    /**
     * Complete a stone - calculate final value
     */
    completeStone(machine, stone) {
        const gem = stone.gem;
        const machineType = this.machineTypes[machine.type];
        
        // Base value
        let value = gem.value;
        
        // Quality modifier (0-100 becomes 0.5-1.5)
        const qualityMod = 0.5 + (stone.qualityScore / 100);
        value *= qualityMod;
        
        // Perfect bonus
        value *= stone.perfectBonus;
        
        // Machine production bonus
        value *= machineType.production;
        
        // Room bonus
        const room = this.roomTypes[machine.room];
        if (room) {
            value *= room.bonus;
        }
        
        // Real machine connection bonus
        if (this.realMachineConnected) {
            value *= this.config.realMachineBonus;
        }
        
        // Determine if perfect cut
        const isPerfect = stone.qualityScore >= 95 && stone.perfectBonus >= 1;
        if (isPerfect) {
            value *= 1.5;
            this.state.stats.perfectCuts++;
        }
        
        value = Math.floor(value);
        
        // Calculate cutting time in real minutes
        const cuttingTime = (Date.now() - stone.startTime) / 1000 / 60;
        
        // Award rewards
        this.state.player.gems += value;
        this.state.player.totalGemsEver += value;
        this.state.player.xp += Math.floor(value / 2) + Math.floor(cuttingTime * 10);
        this.state.stats.totalCuts++;
        this.state.player.stonesCompleted++;
        machine.totalCuts++;
        
        // Visual effect
        this.showCutEffect(machine, gem, isPerfect);
        
        // Merlin celebration
        if (this.merlin) {
            if (isPerfect) {
                this.merlinCelebrate('perfect_cut', { gemName: gem.name });
            } else if (gem.rarity === 'legendary' || gem.rarity === 'rare') {
                this.merlinCelebrate('rare_gem', { gemName: gem.name });
            } else {
                const messages = [
                    `The ${gem.name} is complete! ${value} gems earned. Quality: ${stone.qualityScore}%`,
                    `Excellent! Finished a ${gem.name} worth ${value} gems in ${cuttingTime.toFixed(1)} minutes.`,
                    `Another ${gem.name} joins your collection! That's ${this.state.player.stonesCompleted} stones cut.`
                ];
                this.merlinSpeak(messages[Math.floor(Math.random() * messages.length)]);
            }
        }
        
        console.log(`✅ COMPLETED: ${gem.name} | Value: ${value} | Quality: ${stone.qualityScore}% | Time: ${cuttingTime.toFixed(1)}m | Perfect: ${isPerfect}`);
        
        // Callback
        if (this.onGemCut) {
            this.onGemCut({
                machine,
                gem,
                value,
                perfect: isPerfect,
                quality: stone.qualityScore,
                cuttingTime
            });
        }
        
        // Clear current stone
        machine.currentStone = null;
    }
    
    /**
     * Give Merlin tip about current stage
     */
    giveStageTip(stone, stage) {
        const tips = {
            'prep_rough': [
                'Always examine the rough for inclusions before starting. They can cause fractures!',
                'Orientation matters - find the best axis for color and brilliance.',
                'Clean your rough thoroughly. Dirt can scratch your laps.'
            ],
            'dop_stone': [
                'Temperature is key! Too hot and the wax burns, too cold and it won\'t bond.',
                'Center the stone carefully - misalignment compounds through every stage.',
                'Let the dop cool slowly. Quick cooling can stress the stone.'
            ],
            'transfer_dop': [
                'This is the riskiest moment! Heat both dops evenly for a clean transfer.',
                'Alignment here determines final symmetry. Take your time.',
                'Keep the pavilion supported while releasing. One moment of carelessness...'
            ],
            'cut_pavilion_600': [
                'The 600 grit removes material quickly. Check your angles frequently.',
                'Each facet must meet precisely at the culet. Patience!',
                'Watch your depth - too deep and you lose size, too shallow and no brilliance.'
            ],
            'polish_pavilion_50k': [
                'We\'re in the high polish range now. Any scratch here will show.',
                'Keep your laps clean! One contaminated lap ruins hours of work.',
                'The sound changes when you reach a true polish. Listen carefully.'
            ],
            'cut_crown_600': [
                'Crown angles affect fire and brilliance. Each degree matters.',
                'Star facets should touch precisely at the table edge.',
                'Check your meet points after each facet. Cumulative errors are unforgiving.'
            ],
            'cut_table': [
                'A perfectly flat table is harder than it looks. Check with a loupe.',
                'The table should be parallel to the girdle. Any tilt shows immediately.',
                'Size matters - too large loses brilliance, too small looks odd.'
            ]
        };
        
        const stageTips = tips[stage.name?.toLowerCase().replace(/[()]/g, '')] || tips[stone.currentStage];
        if (stageTips) {
            this.merlinSpeak(stageTips[Math.floor(Math.random() * stageTips.length)]);
        }
    }
    
    /**
     * Update machine visuals based on cutting progress
     */
    updateMachineVisuals(machine, stone, stage) {
        if (!machine.statusMat) return;
        
        // Update status light color based on stage type
        if (stage.humanRequired) {
            // Yellow for human interaction needed
            machine.statusMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0);
        } else if (stage.lapType?.includes('polish')) {
            // Cyan for polishing
            machine.statusMat.emissiveColor = new BABYLON.Color3(0, 1, 1);
        } else if (stage.lapType?.includes('grit')) {
            // Blue for cutting
            machine.statusMat.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
        } else {
            // Green for normal operation
            machine.statusMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        }
    }
    
    /**
     * Get current cutting status for UI display
     */
    getCuttingStatus(machine) {
        if (!machine.currentStone) {
            return { status: 'idle', message: 'Waiting for rough...' };
        }
        
        const stone = machine.currentStone;
        const stage = this.cuttingStages[stone.currentStage];
        const stageTime = this.calculateStageTime(stone, stage, this.machineTypes[machine.type]);
        const progress = Math.min(100, (stone.stageProgress / stageTime) * 100);
        
        return {
            status: 'cutting',
            gemName: stone.gem.name,
            gemColor: stone.gem.color,
            stage: stage.name,
            stageDescription: stage.description,
            progress: progress,
            qualityScore: stone.qualityScore,
            humanRequired: stage.humanRequired,
            stageIndex: stone.stageIndex + 1,
            totalStages: this.stageOrder.length,
            lapType: stage.lapType || 'N/A'
        };
    }
    
    /**
     * Legacy processCut method for compatibility - redirects to realistic system
     */
    processCut(machine) {
        // This method is now handled by processRealisticCutting
        // Kept for backward compatibility with any external calls
        this.processRealisticCutting(machine, this.config.timeAcceleration);
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
     * Get tips relevant to current game state - REALISTIC GEM CUTTING EDUCATION
     */
    getContextualTips() {
        const player = this.state.player;
        const machines = this.state.machines;
        const tips = [];
        
        // ==================== BEGINNER TIPS (Level 1-3) ====================
        if (player.level < 3) {
            // Basic process tips
            tips.push('Gem cutting starts with examining the rough - look for inclusions, cracks, and color orientation.');
            tips.push('The dop is a metal stick that holds your stone. Proper dopping is CRITICAL to success!');
            tips.push('Dop wax melts at around 150°F. Too hot burns the stone, too cold won\'t bond properly.');
            tips.push('Watch the stage indicator - yellow means human interaction is needed!');
            tips.push('Every stone goes through: Prep → Pavilion → Transfer → Crown → Polish');
        }
        
        // ==================== INTERMEDIATE TIPS (Level 3-7) ====================
        if (player.level >= 3 && player.level < 8) {
            // Process understanding
            tips.push('The pavilion is cut first because it\'s easier to transfer to than a finished crown.');
            tips.push('The girdle is the widest part of the stone - it determines your final size.');
            tips.push('Transfer is the riskiest moment! The stone moves from pavilion dop to crown dop.');
            tips.push('Laps progress from rough (600 grit) to fine (1200 grit) before polishing.');
            tips.push('Polish uses diamond paste: 8k → 14k → 50k → 100k → 200k for mirror finish.');
            
            // Hazard warnings
            tips.push('If the dop wax is too cold, the stone can fly off at high speed. DANGEROUS!');
            tips.push('Always let the dop cool naturally. Rapid cooling stresses both stone and bond.');
            tips.push('The copper lap for polishing must be charged with only ONE grit at a time.');
        }
        
        // ==================== ADVANCED TIPS (Level 8+) ====================
        if (player.level >= 8) {
            // Precision techniques
            tips.push('Diamond (Mohs 10) requires patience - expect 3-4x the cutting time of quartz.');
            tips.push('Corundum (Ruby/Sapphire at Mohs 9) is second hardest - good practice for diamond.');
            tips.push('Opal (Mohs 5.5) is soft AND heat sensitive - never let it get warm from friction!');
            tips.push('Topaz has perfect cleavage - one wrong tap and it splits along crystal planes.');
            tips.push('Emerald is included by nature - these inclusions create fracture risks.');
            
            // Pro techniques
            tips.push('Master cutters pre-polish pavilion facets before transfer to check angles.');
            tips.push('The 42° pavilion angle is standard for maximum brilliance in most stones.');
            tips.push('Crown angles affect fire (rainbow dispersion) - shallower = more fire.');
            tips.push('Table size affects brilliance vs fire trade-off. Typically 50-60% of girdle width.');
        }
        
        // ==================== MACHINE-SPECIFIC TIPS ====================
        if (machines.length === 1) {
            tips.push('One machine means mastering basics before scaling. Learn the rhythm of cutting.');
        }
        
        if (machines.length >= 3) {
            tips.push('With multiple machines, watch for transfer stages - they all need attention!');
            tips.push('Pro tip: Stagger your stones so transfers don\'t happen simultaneously.');
        }
        
        // ==================== REAL GemBot PROCESS TIPS ====================
        // These reflect the actual GemBot machine operation
        tips.push('On real GemBot: X-axis moves the stone in/out, Y-axis moves up/down to lap.');
        tips.push('The P-axis (Index) rotates the stone to each facet position. 96-tooth gear = 96 positions.');
        tips.push('Speed control is crucial - fast for rough cutting, slow for precision finishing.');
        tips.push('Step mode gives precise control: each click = exact number of motor steps.');
        tips.push('The limit switches protect your stone from crashing into the lap.');
        tips.push('Motor timeout (60 seconds) is a safety feature - prevents runaway operations.');
        
        // ==================== MATERIAL SCIENCE TIPS ====================
        tips.push('Mohs hardness is relative, not linear. Diamond (10) is ~4x harder than corundum (9).');
        tips.push('Quartz family (amethyst, citrine) are ideal learner stones - hard enough, forgiving.');
        tips.push('Garnet is slightly harder than quartz and comes in every color except blue.');
        tips.push('Heat damages many stones. Opal cracks, topaz changes color, some emeralds fracture.');
        
        // ==================== FAILURE EDUCATION ====================
        if (this.state.stats.dopFailures > 0) {
            tips.push('Dop failures happen to everyone. Check: wax temp, stone cleanliness, bond time.');
        }
        
        if (this.state.stats.transferFailures > 0) {
            tips.push('Transfer takes practice. Support the stone, heat evenly, align precisely.');
        }
        
        if (this.state.player.stonesLost > 0) {
            tips.push(`You've lost ${this.state.player.stonesLost} stones. Every loss teaches a lesson!`);
        }
        
        // ==================== PROGRESS TIPS ====================
        if (player.stonesCompleted > 10) {
            tips.push(`${player.stonesCompleted} stones completed! You're developing real skill.`);
        }
        
        if (player.gems > 500 && machines.length < 3) {
            tips.push('Consider expanding - the Pro GemBot has better precision, fewer failures.');
        }
        
        // ==================== REAL MACHINE INTEGRATION ====================
        if (this.realMachineConnected) {
            tips.push('Real GemBot connected! The game simulates what your machine can actually do.');
            tips.push('Use the game to plan cuts before committing real rough - practice virtually!');
        } else {
            tips.push('Connect your physical GemBot to see real motor positions reflected in the game!');
            tips.push('The virtual GemBot teaches the process - apply it to your real machine.');
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
     * Get advice from Merlin about a specific topic - DETAILED GEM CUTTING EDUCATION
     */
    askMerlin(topic) {
        this.state.merlinInteractions.questionsAnswered++;
        
        const advice = {
            'gems': 'Each gem has unique properties defined by Mohs hardness: Quartz=7, Topaz=8, Corundum (Ruby/Sapphire)=9, Diamond=10. Harder stones take longer to cut but polish beautifully. Softer stones like Opal (5.5) require gentle treatment and can\'t handle heat.',
            
            'machines': 'GemBot machines control 3 axes: X (in/out toward lap), Y (up/down), and Index (rotation). Step mode gives precise single-step control. Continuous mode for roughing. Higher quality machines have better precision = fewer dop failures.',
            
            'strategy': 'Start with Quartz family stones (Amethyst, Citrine) - they\'re forgiving and teach the process. Master the transfer before tackling valuable stones. One lost ruby teaches expensive lessons!',
            
            'real_machine': 'The virtual game teaches the EXACT process used by physical GemBot: mount rough, preform shape, cut pavilion through progressive laps (600→800→1200), polish with paste (8k→14k→50k→100k→200k), transfer, cut crown, final polish.',
            
            'process': 'Full cut process: 1) Prep rough, 2) Dop to stick, 3) Mount in chuck, 4) Preform girdle & pavilion, 5) Cut pavilion facets through grits, 6) Polish pavilion, 7) TRANSFER to crown dop, 8) Cut crown & table, 9) Polish crown, 10) Remove & clean.',
            
            'laps': 'Cutting laps: 600 grit (rough shaping, fast removal), 800 grit (remove 600 scratches), 1200 grit (pre-polish). Polish laps: Copper charged with diamond paste - 8k to 200k for mirror finish. NEVER mix grit sizes on one lap!',
            
            'dopping': 'Dop wax temperature is critical - around 150°F. Stone must be clean and warm. Press firmly, center precisely, let cool SLOWLY. Rapid cooling = weak bond = flying stones. Re-dop if ANY doubt about bond strength!',
            
            'transfer': 'The riskiest step! Heat BOTH dops (old pavilion dop AND new crown dop). Apply crown dop to table, align precisely with pavilion center. Heat old dop to release. SUPPORT THE STONE during entire process!',
            
            'failures': 'Common failures: Dop flyoff (cold wax, dirty stone, quick cool), Transfer loss (misalignment, uneven heat), Chipping (hard landing on lap, bad angles). Each failure teaches something!',
            
            'hardness': 'Mohs scale: Diamond=10 (takes FOREVER to cut, needs special laps), Corundum=9 (Ruby/Sapphire, patient work), Topaz=8 (perfect cleavage risk!), Quartz=7 (ideal learning), Opal=5.5 (soft, heat sensitive).',
            
            'angles': 'Standard pavilion: ~42° for maximum brilliance. Crown mains: ~42°. Star facets: lower angle. Table: 0° (flat). The index gear has 96 teeth = 3.75° per tooth for precise facet placement.',
            
            'levels': 'Higher levels unlock harder gems that take longer but pay more. Level 3: Topaz/Emerald. Level 8: Ruby/Sapphire. Level 15: Diamond/Alexandrite. Master the basics before tackling precious stones!',
            
            'tokens': 'Tokens represent proven skill in gem cutting. Earned through completing stones, especially perfect cuts and difficult materials. Use them to unlock upgrades and prove your mastery.',
            
            'safety': 'The GemBot has limit switches on all axes to prevent crashes. Emergency stop releases all motors. Motor timeout (60 seconds) stops runaway operations. Respect these safety systems!'
        };
        
        const response = advice[topic] || 'Ask me about: gems, machines, strategy, process, laps, dopping, transfer, failures, hardness, angles, levels, tokens, or safety - and I shall enlighten you with the wisdom of the ages!';
        this.merlinSpeak(response);
        return response;
    }
}

// Export for global access
window.GemBotFarmGame = GemBotFarmGame;
console.log('🎮 GemBot Farm Game module loaded (with Merlin AI integration)');
