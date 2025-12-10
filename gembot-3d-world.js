/**
 * GemBot 3D World System
 * A futuristic learning environment with room-based progression
 * Inspired by CSS 3D maze techniques + quantum neural network visuals
 * 
 * Features:
 * - Level-gated rooms requiring keys to unlock
 * - Progressive skill learning through room exploration
 * - Integration with GemBot marketplace, Arya Intel, and Merlin AI
 * - Quantum gemstone visual effects
 * - Futuristic cyberpunk aesthetic
 */

window.GemBot3DWorld = {
    version: '1.0.0',
    initialized: false,
    
    // Player state
    player: {
        level: 1,
        xp: 0,
        position: { x: 6, z: 6 }, // Start in center of first room
        rotation: 0, // 0=North, 90=East, 180=South, 270=West
        keys: [],
        unlockedRooms: ['lobby'],
        currentRoom: 'lobby',
        inventory: []
    },
    
    // Room definitions - each room teaches different skills
    rooms: {
        // ==================== FLOOR 1: BEGINNER ZONE ====================
        lobby: {
            id: 'lobby',
            name: '💎 GemBot Lobby',
            description: 'Welcome to GemBot Academy! Your journey into gemstone mastery begins here.',
            floor: 1,
            requiredLevel: 1,
            requiredKey: null,
            theme: 'cyber-blue',
            gridSize: { cols: 12, rows: 12 },
            features: ['welcome_terminal', 'merlin_hologram', 'basics_tutorial'],
            connections: {
                north: 'cutting_basics',
                east: 'stone_gallery',
                south: null,
                west: 'tool_room'
            },
            npcs: ['merlin_intro'],
            collectibles: ['first_gem_token'],
            ambientSound: 'gentle_hum',
            lighting: { color: '#00ffff', intensity: 0.8 }
        },
        
        cutting_basics: {
            id: 'cutting_basics',
            name: '✂️ Cutting Basics Lab',
            description: 'Learn the fundamentals of gemstone cutting and faceting.',
            floor: 1,
            requiredLevel: 1,
            requiredKey: null,
            theme: 'warm-workshop',
            gridSize: { cols: 8, rows: 10 },
            features: ['cutting_simulator', 'angle_trainer', 'practice_station'],
            connections: {
                north: null,
                east: 'polishing_room',
                south: 'lobby',
                west: null
            },
            npcs: ['master_cutter'],
            collectibles: ['basic_loupe', 'training_rough'],
            skills: ['angle_basics', 'depth_control'],
            ambientSound: 'cutting_machine',
            lighting: { color: '#ffaa00', intensity: 0.9 }
        },
        
        stone_gallery: {
            id: 'stone_gallery',
            name: '🏛️ Stone Gallery',
            description: 'Explore the beautiful world of gemstones. Each case holds secrets.',
            floor: 1,
            requiredLevel: 2,
            requiredKey: 'gallery_key',
            theme: 'museum-dark',
            gridSize: { cols: 10, rows: 10 },
            features: ['gem_displays', 'info_terminals', 'arya_intel_station'],
            connections: {
                north: 'rare_collection',
                east: null,
                south: null,
                west: 'lobby'
            },
            npcs: ['curator_bot'],
            collectibles: ['mineral_handbook', 'gallery_key_piece1'],
            skills: ['gem_identification', 'value_assessment'],
            ambientSound: 'soft_music',
            lighting: { color: '#8855ff', intensity: 0.6 }
        },
        
        tool_room: {
            id: 'tool_room',
            name: '🔧 Tool Workshop',
            description: 'Equipment storage and maintenance. Learn about your tools.',
            floor: 1,
            requiredLevel: 1,
            requiredKey: null,
            theme: 'industrial',
            gridSize: { cols: 8, rows: 8 },
            features: ['tool_wall', 'maintenance_bench', 'calibration_station'],
            connections: {
                north: 'print_lab',
                east: 'lobby',
                south: null,
                west: null
            },
            npcs: ['tech_bot'],
            collectibles: ['precision_gauge', 'tool_manual'],
            skills: ['tool_maintenance', 'calibration'],
            ambientSound: 'workshop_ambience',
            lighting: { color: '#00ff88', intensity: 0.85 }
        },
        
        polishing_room: {
            id: 'polishing_room',
            name: '✨ Polishing Chamber',
            description: 'The final step in creating a brilliant gemstone.',
            floor: 1,
            requiredLevel: 3,
            requiredKey: 'polish_key',
            theme: 'clean-white',
            gridSize: { cols: 8, rows: 8 },
            features: ['polish_wheels', 'inspection_station', 'quality_scanner'],
            connections: {
                north: null,
                east: null,
                south: null,
                west: 'cutting_basics'
            },
            npcs: ['polish_master'],
            collectibles: ['diamond_paste', 'polish_cloth'],
            skills: ['polish_technique', 'final_inspection'],
            ambientSound: 'polishing_wheel',
            lighting: { color: '#ffffff', intensity: 1.0 }
        },
        
        supply_room: {
            id: 'supply_room',
            name: '📦 Supply Depot',
            description: 'Resources and materials for your crafting needs.',
            floor: 1,
            requiredLevel: 2,
            requiredKey: null,
            theme: 'warehouse',
            gridSize: { cols: 10, rows: 6 },
            features: ['storage_racks', 'ordering_terminal', 'material_scanner'],
            connections: {
                north: null,
                east: null,
                south: 'tool_room',
                west: 'marketplace_hub'
            },
            npcs: ['supply_bot'],
            collectibles: ['rough_sapphire', 'wax_supply'],
            ambientSound: 'warehouse_hum',
            lighting: { color: '#ffcc00', intensity: 0.7 }
        },
        
        // ==================== FLOOR 1: INTERMEDIATE ====================
        marketplace_hub: {
            id: 'marketplace_hub',
            name: '🏪 Marketplace Hub',
            description: 'Trade gems, buy equipment, and connect with other players.',
            floor: 1,
            requiredLevel: 5,
            requiredKey: 'market_key',
            theme: 'cyber-market',
            gridSize: { cols: 12, rows: 12 },
            features: ['trading_posts', 'auction_terminal', 'player_stalls'],
            connections: {
                north: 'forge_entrance',
                east: 'supply_room',
                south: null,
                west: null
            },
            npcs: ['merchant_guild', 'auction_bot'],
            collectibles: ['trading_license', 'market_discount'],
            skills: ['trading', 'negotiation'],
            ambientSound: 'market_bustle',
            lighting: { color: '#ff6600', intensity: 0.8 }
        },
        
        rare_collection: {
            id: 'rare_collection',
            name: '💍 Rare Collection Vault',
            description: 'The most precious specimens in the academy. Handle with care.',
            floor: 1,
            requiredLevel: 7,
            requiredKey: 'vault_key',
            theme: 'high-security',
            gridSize: { cols: 8, rows: 8 },
            features: ['laser_grid', 'specimen_cases', 'security_terminal'],
            connections: {
                north: null,
                east: null,
                south: 'stone_gallery',
                west: 'research_lab'
            },
            npcs: ['security_bot', 'rare_gem_ai'],
            collectibles: ['rare_gem_shard', 'collector_badge'],
            skills: ['rare_gem_handling', 'authentication'],
            ambientSound: 'security_hum',
            lighting: { color: '#ff00ff', intensity: 0.5 }
        },
        
        // ==================== FLOOR 2: ADVANCED ====================
        research_lab: {
            id: 'research_lab',
            name: '🔬 Arya Intel Research Lab',
            description: 'Advanced gemological research with Dr. Arya Akhavan\'s methods.',
            floor: 2,
            requiredLevel: 10,
            requiredKey: 'research_key',
            theme: 'high-tech-lab',
            gridSize: { cols: 12, rows: 10 },
            features: ['spectroscope', 'ai_analysis', 'database_terminal'],
            connections: {
                north: 'quantum_chamber',
                east: 'rare_collection',
                south: null,
                west: 'recut_station'
            },
            npcs: ['arya_hologram', 'research_bot'],
            collectibles: ['research_data', 'spectroscope_lens'],
            skills: ['advanced_analysis', 'ai_research'],
            ambientSound: 'lab_equipment',
            lighting: { color: '#00ffaa', intensity: 0.9 }
        },
        
        forge_entrance: {
            id: 'forge_entrance',
            name: '🔥 Forge Entrance',
            description: 'The gateway to ring crafting and jewelry creation.',
            floor: 2,
            requiredLevel: 8,
            requiredKey: 'forge_key',
            theme: 'volcanic',
            gridSize: { cols: 10, rows: 8 },
            features: ['heat_barrier', 'safety_gear', 'metal_storage'],
            connections: {
                north: 'main_forge',
                east: null,
                south: 'marketplace_hub',
                west: null
            },
            npcs: ['forge_guardian'],
            collectibles: ['fire_resistant_gloves', 'forge_access_badge'],
            skills: ['heat_management', 'metal_basics'],
            ambientSound: 'distant_forge',
            lighting: { color: '#ff4400', intensity: 0.7 }
        },
        
        main_forge: {
            id: 'main_forge',
            name: '⚒️ Grand Forge',
            description: 'Create legendary rings and bind gemstones permanently.',
            floor: 2,
            requiredLevel: 12,
            requiredKey: 'master_forge_key',
            theme: 'forge-fire',
            gridSize: { cols: 14, rows: 12 },
            features: ['anvils', 'molten_metal', 'binding_altar', 'cooling_pools'],
            connections: {
                north: null,
                east: 'enchantment_room',
                south: 'forge_entrance',
                west: null
            },
            npcs: ['master_smith', 'fire_elemental'],
            collectibles: ['legendary_hammer', 'fire_essence'],
            skills: ['ring_forging', 'stone_binding', 'metal_mastery'],
            ambientSound: 'forge_sounds',
            lighting: { color: '#ff6600', intensity: 1.0 }
        },
        
        recut_station: {
            id: 'recut_station',
            name: '✂️ Professional Recut Station',
            description: 'Transform stones to fit any setting with precision recutting.',
            floor: 2,
            requiredLevel: 10,
            requiredKey: null, // Accessible if research_lab unlocked
            theme: 'precision-workshop',
            gridSize: { cols: 10, rows: 10 },
            features: ['precision_saw', 'recut_calculator', 'material_analyzer'],
            connections: {
                north: null,
                east: 'research_lab',
                south: null,
                west: null
            },
            npcs: ['recut_specialist'],
            collectibles: ['precision_blade', 'calibration_stone'],
            skills: ['professional_recut', 'weight_optimization'],
            ambientSound: 'precision_cutting',
            lighting: { color: '#00ccff', intensity: 0.9 }
        },
        
        // ==================== FLOOR 3: MASTER LEVEL ====================
        quantum_chamber: {
            id: 'quantum_chamber',
            name: '⚛️ Quantum Visualization Chamber',
            description: 'See gemstones at the molecular level with quantum rendering.',
            floor: 3,
            requiredLevel: 15,
            requiredKey: 'quantum_key',
            theme: 'quantum-void',
            gridSize: { cols: 12, rows: 12 },
            features: ['quantum_viewer', 'neural_network', 'molecular_scanner'],
            connections: {
                north: 'master_vault',
                east: null,
                south: 'research_lab',
                west: 'slinginrockz_gallery'
            },
            npcs: ['quantum_ai', 'neural_guide'],
            collectibles: ['quantum_lens', 'neural_shard'],
            skills: ['quantum_visualization', 'molecular_analysis'],
            ambientSound: 'quantum_hum',
            lighting: { color: '#8800ff', intensity: 0.6 }
        },
        
        print_lab: {
            id: 'print_lab',
            name: '🖨️ 3D Print Lab',
            description: 'Browse 200+ printable GemBot parts and download STL files.',
            floor: 2,
            requiredLevel: 6,
            requiredKey: 'tech_key',
            theme: 'tech-workshop',
            gridSize: { cols: 12, rows: 10 },
            features: ['stl_gallery', 'print_preview', 'parts_catalog', 'download_terminal'],
            connections: {
                north: 'quantum_chamber',
                east: null,
                south: 'tool_room',
                west: null
            },
            npcs: ['printer_bot', 'design_assistant'],
            collectibles: ['part_blueprint', 'print_token'],
            skills: ['3d_modeling', 'part_assembly'],
            ambientSound: 'printer_hum',
            lighting: { color: '#00aaff', intensity: 0.85 }
        },
        
        enchantment_room: {
            id: 'enchantment_room',
            name: '🌟 Enchantment Chamber',
            description: 'Imbue your creations with special properties and powers.',
            floor: 3,
            requiredLevel: 18,
            requiredKey: 'enchant_key',
            theme: 'mystical',
            gridSize: { cols: 10, rows: 10 },
            features: ['enchant_altar', 'rune_library', 'power_crystals'],
            connections: {
                north: null,
                east: null,
                south: null,
                west: 'main_forge'
            },
            npcs: ['enchantress', 'rune_keeper'],
            collectibles: ['enchant_scroll', 'power_crystal'],
            skills: ['basic_enchanting', 'rune_reading'],
            ambientSound: 'mystical_chimes',
            lighting: { color: '#ff88ff', intensity: 0.7 }
        },
        
        slinginrockz_gallery: {
            id: 'slinginrockz_gallery',
            name: '🪨 SlinginRockz Mineral Hall',
            description: 'Andy Acker\'s legendary mineral collection in holographic display.',
            floor: 3,
            requiredLevel: 15,
            requiredKey: null, // Unlocks with quantum_chamber
            theme: 'mineral-museum',
            gridSize: { cols: 14, rows: 10 },
            features: ['hologram_displays', 'instagram_wall', 'mineral_database'],
            connections: {
                north: null,
                east: 'quantum_chamber',
                south: null,
                west: null
            },
            npcs: ['andy_hologram', 'mineral_guide'],
            collectibles: ['rare_mineral_sample', 'collector_pass'],
            skills: ['mineral_expertise', 'specimen_photography'],
            ambientSound: 'gallery_ambience',
            lighting: { color: '#ff9900', intensity: 0.8 }
        },
        
        master_vault: {
            id: 'master_vault',
            name: '👑 Master\'s Vault',
            description: 'The ultimate collection. Only true masters may enter.',
            floor: 3,
            requiredLevel: 25,
            requiredKey: 'master_key',
            theme: 'legendary',
            gridSize: { cols: 16, rows: 16 },
            features: ['legendary_gems', 'hall_of_fame', 'creation_altar'],
            connections: {
                north: null,
                east: null,
                south: 'quantum_chamber',
                west: null
            },
            npcs: ['grand_master', 'gem_spirit'],
            collectibles: ['master_certification', 'legendary_gem'],
            skills: ['master_crafting', 'legendary_creation'],
            ambientSound: 'celestial_choir',
            lighting: { color: '#ffd700', intensity: 1.0 }
        }
    },
    
    // Key definitions
    keys: {
        gallery_key: {
            id: 'gallery_key',
            name: '🗝️ Gallery Key',
            description: 'Grants access to the Stone Gallery',
            obtainedFrom: 'Complete Cutting Basics tutorial',
            requiredLevel: 2
        },
        polish_key: {
            id: 'polish_key',
            name: '✨ Polish Chamber Key',
            description: 'Unlocks the Polishing Chamber',
            obtainedFrom: 'Reach Level 3 and complete angle training',
            requiredLevel: 3
        },
        tech_key: {
            id: 'tech_key',
            name: '🖨️ 3D Print Lab Key',
            description: 'Unlocks the 3D Print Lab with 200+ printable parts',
            obtainedFrom: 'Complete tool calibration tutorial',
            requiredLevel: 6
        },
        market_key: {
            id: 'market_key',
            name: '🏪 Market Access Card',
            description: 'Trading license for the Marketplace',
            obtainedFrom: 'Complete 5 successful gem sales',
            requiredLevel: 5
        },
        vault_key: {
            id: 'vault_key',
            name: '💎 Vault Access Key',
            description: 'Security clearance for the Rare Collection',
            obtainedFrom: 'Identify 10 different gem types correctly',
            requiredLevel: 7
        },
        forge_key: {
            id: 'forge_key',
            name: '🔥 Forge Pass',
            description: 'Grants entry to the Forge Entrance',
            obtainedFrom: 'Trade 1000 tokens worth of materials',
            requiredLevel: 8
        },
        research_key: {
            id: 'research_key',
            name: '🔬 Research Clearance',
            description: 'Access to Arya Intel Research Lab',
            obtainedFrom: 'Complete advanced gem identification course',
            requiredLevel: 10
        },
        master_forge_key: {
            id: 'master_forge_key',
            name: '⚒️ Master Forge Key',
            description: 'Unlocks the Grand Forge',
            obtainedFrom: 'Craft 5 rings with 4+ star quality',
            requiredLevel: 12
        },
        quantum_key: {
            id: 'quantum_key',
            name: '⚛️ Quantum Access',
            description: 'Opens the Quantum Visualization Chamber',
            obtainedFrom: 'Analyze 20 gems with Arya Intel',
            requiredLevel: 15
        },
        enchant_key: {
            id: 'enchant_key',
            name: '🌟 Enchantment Key',
            description: 'Access to the Enchantment Chamber',
            obtainedFrom: 'Forge a legendary ring',
            requiredLevel: 18
        },
        master_key: {
            id: 'master_key',
            name: '👑 Master\'s Key',
            description: 'The ultimate key to the Master\'s Vault',
            obtainedFrom: 'Reach Level 25 with all skills mastered',
            requiredLevel: 25
        }
    },
    
    // Visual themes for rooms
    themes: {
        'cyber-blue': {
            floor: 'linear-gradient(45deg, #001133 25%, #002244 25%, #002244 50%, #001133 50%, #001133 75%, #002244 75%)',
            walls: 'linear-gradient(to bottom, #003366, #001144)',
            ceiling: 'radial-gradient(circle, #004488 0%, #001133 100%)',
            accent: '#00ffff',
            fog: 'rgba(0, 100, 150, 0.3)'
        },
        'warm-workshop': {
            floor: 'linear-gradient(45deg, #3d2817 25%, #4a3020 25%, #4a3020 50%, #3d2817 50%, #3d2817 75%, #4a3020 75%)',
            walls: 'linear-gradient(to bottom, #5c4033, #3d2817)',
            ceiling: '#2d1f14',
            accent: '#ffaa00',
            fog: 'rgba(100, 60, 20, 0.2)'
        },
        'museum-dark': {
            floor: '#1a1a2e',
            walls: 'linear-gradient(to bottom, #16213e, #0f0f23)',
            ceiling: '#0a0a14',
            accent: '#8855ff',
            fog: 'rgba(50, 30, 80, 0.4)'
        },
        'quantum-void': {
            floor: 'radial-gradient(circle, #110022 0%, #000011 100%)',
            walls: 'linear-gradient(to bottom, #220044 0%, #000022 100%)',
            ceiling: '#000000',
            accent: '#8800ff',
            fog: 'rgba(80, 0, 160, 0.5)'
        },
        'forge-fire': {
            floor: 'linear-gradient(45deg, #2d0a00 25%, #3d1500 25%)',
            walls: 'linear-gradient(to bottom, #4d1a00, #2d0a00)',
            ceiling: '#1d0500',
            accent: '#ff4400',
            fog: 'rgba(255, 100, 0, 0.3)'
        },
        'legendary': {
            floor: 'linear-gradient(45deg, #1a1a00 25%, #2d2d00 25%)',
            walls: 'linear-gradient(to bottom, #4d4d00, #1a1a00)',
            ceiling: 'radial-gradient(circle, #666600 0%, #1a1a00 100%)',
            accent: '#ffd700',
            fog: 'rgba(255, 215, 0, 0.2)'
        }
    },
    
    // ==================== INITIALIZATION ====================
    init() {
        console.log('🌍 GemBot 3D World System initializing...');
        
        // Load saved state
        this.loadState();
        
        // Set up event listeners
        this.setupControls();
        
        // Initialize quantum effects if available
        this.initQuantumEffects();
        
        this.initialized = true;
        console.log('✅ GemBot 3D World ready!');
        
        return this;
    },
    
    // ==================== STATE MANAGEMENT ====================
    loadState() {
        const saved = localStorage.getItem('gembot3DWorld');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.player = { ...this.player, ...state.player };
                if (state.achievements) {
                    this.achievements = { ...this.achievements, ...state.achievements };
                }
                if (state.printQueue) {
                    this.printQueue = state.printQueue;
                }
                console.log('📂 Loaded 3D World state:', this.player);
                console.log('🏆 Achievements:', this.achievements);
            } catch (e) {
                console.warn('⚠️ Could not load 3D World state:', e);
            }
        }
    },
    
    saveState() {
        const state = {
            player: this.player,
            achievements: this.achievements,
            printQueue: this.printQueue || [],
            timestamp: Date.now()
        };
        localStorage.setItem('gembot3DWorld', JSON.stringify(state));
        console.log('💾 3D World state saved');
    },
    
    // ==================== ROOM ACCESS ====================
    canAccessRoom(roomId) {
        const room = this.rooms[roomId];
        if (!room) return { allowed: false, reason: 'Room does not exist' };
        
        // Check level requirement
        if (this.player.level < room.requiredLevel) {
            return {
                allowed: false,
                reason: `Requires Level ${room.requiredLevel}. You are Level ${this.player.level}.`,
                requiredLevel: room.requiredLevel
            };
        }
        
        // Check key requirement
        if (room.requiredKey && !this.player.keys.includes(room.requiredKey)) {
            const keyInfo = this.keys[room.requiredKey];
            return {
                allowed: false,
                reason: `Requires ${keyInfo.name}. ${keyInfo.obtainedFrom}`,
                requiredKey: room.requiredKey
            };
        }
        
        return { allowed: true };
    },
    
    enterRoom(roomId) {
        const access = this.canAccessRoom(roomId);
        
        if (!access.allowed) {
            this.showAccessDenied(roomId, access.reason);
            return false;
        }
        
        const room = this.rooms[roomId];
        
        // Add to unlocked rooms if new
        if (!this.player.unlockedRooms.includes(roomId)) {
            this.player.unlockedRooms.push(roomId);
            this.onRoomUnlocked(room);
        }
        
        this.player.currentRoom = roomId;
        this.saveState();
        
        // Render the new room
        this.renderRoom(room);
        
        // Trigger room events
        this.onRoomEnter(room);
        
        return true;
    },
    
    // ==================== KEY MANAGEMENT ====================
    grantKey(keyId) {
        if (this.player.keys.includes(keyId)) {
            console.log(`🔑 Already have key: ${keyId}`);
            return false;
        }
        
        const key = this.keys[keyId];
        if (!key) return false;
        
        this.player.keys.push(keyId);
        this.saveState();
        
        this.showKeyObtained(key);
        console.log(`🔑 Key obtained: ${key.name}`);
        
        return true;
    },
    
    // ==================== LEVEL PROGRESSION ====================
    addXP(amount, source = 'unknown') {
        this.player.xp += amount;
        console.log(`⭐ +${amount} XP from ${source}. Total: ${this.player.xp}`);
        
        // Check for level up
        const xpForNextLevel = this.getXPForLevel(this.player.level + 1);
        
        while (this.player.xp >= xpForNextLevel) {
            this.levelUp();
        }
        
        this.saveState();
    },
    
    getXPForLevel(level) {
        // Progressive XP curve
        return Math.floor(100 * Math.pow(1.5, level - 1));
    },
    
    levelUp() {
        this.player.level++;
        console.log(`🎉 LEVEL UP! Now Level ${this.player.level}`);
        
        this.showLevelUpNotification();
        this.checkKeyUnlocks();
        this.saveState();
    },
    
    checkKeyUnlocks() {
        // Check if any keys should be automatically granted at this level
        Object.entries(this.keys).forEach(([keyId, key]) => {
            if (key.requiredLevel <= this.player.level && 
                !this.player.keys.includes(keyId)) {
                // Key becomes available but not automatically granted
                console.log(`🔓 ${key.name} is now obtainable at your level!`);
                this.showNotification(`🔓 New key available: ${key.name}!\n${key.obtainedFrom}`);
            }
        });
    },
    
    // ==================== ACHIEVEMENT KEY SYSTEM ====================
    achievements: {
        gems_identified: 0,
        gems_cut: 0,
        rings_forged: 0,
        trades_completed: 0,
        tutorials_completed: 0,
        arya_analyses: 0,
        rooms_visited: 0,
        npcs_talked: 0
    },
    
    // Track achievement and check for key drops
    trackAchievement(type, amount = 1) {
        if (!this.achievements[type]) this.achievements[type] = 0;
        this.achievements[type] += amount;
        
        console.log(`🏆 Achievement: ${type} = ${this.achievements[type]}`);
        this.checkAchievementKeyDrops();
        this.saveState();
    },
    
    checkAchievementKeyDrops() {
        const keyDropConditions = {
            gallery_key: () => this.achievements.tutorials_completed >= 1,
            polish_key: () => this.achievements.gems_cut >= 3,
            tech_key: () => this.achievements.tutorials_completed >= 2,
            market_key: () => this.achievements.trades_completed >= 5,
            vault_key: () => this.achievements.gems_identified >= 10,
            forge_key: () => this.achievements.trades_completed >= 10,
            research_key: () => this.achievements.arya_analyses >= 5,
            master_forge_key: () => this.achievements.rings_forged >= 5,
            quantum_key: () => this.achievements.arya_analyses >= 20,
            enchant_key: () => this.achievements.rings_forged >= 10,
            master_key: () => this.player.level >= 25 && this.achievements.tutorials_completed >= 10
        };
        
        Object.entries(keyDropConditions).forEach(([keyId, condition]) => {
            if (!this.player.keys.includes(keyId) && 
                this.player.level >= this.keys[keyId].requiredLevel &&
                condition()) {
                this.grantKey(keyId);
            }
        });
    },
    
    showKeyObtained(key) {
        this.showNotification(`🔑 KEY OBTAINED!\n${key.name}\n\n${key.description}`);
        
        // Visual celebration
        if (window.gameFarm?.addActivity) {
            window.gameFarm.addActivity(`🎉 New key unlocked: ${key.name}!`);
        }
    },
    
    showLevelUpNotification() {
        this.showNotification(`🎉 LEVEL UP!\nYou are now Level ${this.player.level}!\n\nNew areas may be accessible.`);
        
        if (window.gameFarm?.addActivity) {
            window.gameFarm.addActivity(`🎉 Level Up! Now Level ${this.player.level}`);
        }
    },
    
    // ==================== RENDERING ====================
    renderRoom(room) {
        console.log(`🏠 Rendering room: ${room.name}`);
        
        const theme = this.themes[room.theme] || this.themes['cyber-blue'];
        
        // Generate room HTML (CSS 3D approach)
        const roomHTML = this.generateRoomHTML(room, theme);
        
        // Update the 3D world container
        const container = document.getElementById('gembot-3d-world');
        if (container) {
            container.innerHTML = roomHTML;
            
            // Initialize quantum effects for specific rooms
            this.initRoomQuantumEffects(room);
            this.applyRoomEffects(room, theme);
        }
    },
    
    generateRoomHTML(room, theme) {
        const { cols, rows } = room.gridSize;
        
        return `
            <div class="world-room" data-room="${room.id}" style="--accent-color: ${theme.accent};">
                <div class="room-header">
                    <h2>${room.name}</h2>
                    <p>${room.description}</p>
                    <div class="room-level">Floor ${room.floor} | Requires Lv.${room.requiredLevel}</div>
                </div>
                
                <div class="room-viewport">
                    <div class="room-floor" style="
                        background: ${theme.floor};
                        grid-template-columns: repeat(${cols}, 1fr);
                        grid-template-rows: repeat(${rows}, 1fr);
                    ">
                        ${this.generateTiles(cols, rows, room)}
                    </div>
                    
                    <div class="room-walls" style="background: ${theme.walls};">
                        ${this.generateWalls(room)}
                    </div>
                    
                    <div class="room-fog" style="background: ${theme.fog};"></div>
                </div>
                
                <div class="room-features">
                    ${room.features.map(f => `<div class="feature" data-feature="${f}" onclick="GemBot3DWorld.activateFeature('${f}')">${this.getFeatureIcon(f)}</div>`).join('')}
                </div>
                
                <div class="room-connections">
                    ${this.generateConnectionButtons(room)}
                </div>
                
                <div class="room-npcs">
                    ${room.npcs.map(npc => `<div class="npc" data-npc="${npc}" onclick="GemBot3DWorld.talkToNPC('${npc}')">${this.getNPCDisplay(npc)}</div>`).join('')}
                </div>
            </div>
        `;
    },
    
    generateTiles(cols, rows, room) {
        let tiles = '';
        for (let z = 1; z <= rows; z++) {
            for (let x = 1; x <= cols; x++) {
                tiles += `<div class="tile" data-x="${x}" data-z="${z}"></div>`;
            }
        }
        return tiles;
    },
    
    generateWalls(room) {
        // Generate walls based on connections (open if connected)
        const { north, south, east, west } = room.connections;
        
        return `
            <div class="wall wall-north ${north ? 'has-door' : ''}" data-connects="${north || ''}">
                ${north ? this.getDoorHTML(north, 'north') : ''}
            </div>
            <div class="wall wall-south ${south ? 'has-door' : ''}" data-connects="${south || ''}">
                ${south ? this.getDoorHTML(south, 'south') : ''}
            </div>
            <div class="wall wall-east ${east ? 'has-door' : ''}" data-connects="${east || ''}">
                ${east ? this.getDoorHTML(east, 'east') : ''}
            </div>
            <div class="wall wall-west ${west ? 'has-door' : ''}" data-connects="${west || ''}">
                ${west ? this.getDoorHTML(west, 'west') : ''}
            </div>
        `;
    },
    
    getDoorHTML(roomId, direction) {
        const room = this.rooms[roomId];
        const access = this.canAccessRoom(roomId);
        
        return `
            <div class="door ${access.allowed ? 'unlocked' : 'locked'}" 
                 onclick="GemBot3DWorld.tryEnterRoom('${roomId}')"
                 data-direction="${direction}">
                <span class="door-icon">${access.allowed ? '🚪' : '🔒'}</span>
                <span class="door-label">${room.name}</span>
                ${!access.allowed ? `<span class="door-req">Lv.${room.requiredLevel}</span>` : ''}
            </div>
        `;
    },
    
    generateConnectionButtons(room) {
        const directions = ['north', 'east', 'south', 'west'];
        const arrows = { north: '⬆️', east: '➡️', south: '⬇️', west: '⬅️' };
        
        return directions.map(dir => {
            const targetRoom = room.connections[dir];
            if (!targetRoom) return '';
            
            const target = this.rooms[targetRoom];
            const access = this.canAccessRoom(targetRoom);
            
            return `
                <button class="nav-btn nav-${dir} ${access.allowed ? '' : 'locked'}"
                        onclick="GemBot3DWorld.tryEnterRoom('${targetRoom}')"
                        title="${target.name}${!access.allowed ? ' (Locked)' : ''}">
                    ${arrows[dir]} ${target.name}
                </button>
            `;
        }).join('');
    },
    
    getFeatureIcon(feature) {
        const icons = {
            welcome_terminal: '🖥️ Terminal',
            merlin_hologram: '🧙 Merlin',
            basics_tutorial: '📚 Tutorial',
            cutting_simulator: '✂️ Simulator',
            angle_trainer: '📐 Angles',
            practice_station: '🎯 Practice',
            gem_displays: '💎 Displays',
            info_terminals: '📊 Info',
            arya_intel_station: '🔬 Arya Intel',
            spectroscope: '🔭 Spectroscope',
            ai_analysis: '🤖 AI Analysis',
            quantum_viewer: '⚛️ Quantum View',
            neural_network: '🧠 Neural Net',
            anvils: '⚒️ Anvils',
            molten_metal: '🔥 Molten Metal',
            binding_altar: '💍 Binding Altar',
            hologram_displays: '📸 Holograms',
            instagram_wall: '📱 Instagram Wall',
            // 3D Print Lab features
            stl_gallery: '🖼️ STL Gallery',
            print_preview: '👁️ Preview',
            parts_catalog: '📋 Parts Catalog',
            download_terminal: '⬇️ Downloads'
        };
        return icons[feature] || `🔹 ${feature}`;
    },
    
    getNPCDisplay(npc) {
        const npcs = {
            merlin_intro: '🧙‍♂️ Merlin AI',
            master_cutter: '👨‍🔧 Master Cutter',
            curator_bot: '🤖 Curator Bot',
            tech_bot: '🔧 Tech Support',
            polish_master: '✨ Polish Master',
            arya_hologram: '👨‍🔬 Dr. Arya',
            master_smith: '⚒️ Master Smith',
            andy_hologram: '🪨 Andy Acker',
            grand_master: '👑 Grand Master',
            // 3D Print Lab NPCs
            printer_bot: '🤖 Printer Bot',
            design_assistant: '👨‍💻 Design Assistant'
        };
        return npcs[npc] || `👤 ${npc}`;
    },
    
    // ==================== FEATURE INTERACTIONS ====================
    activateFeature(featureId) {
        console.log(`🎯 Activating feature: ${featureId}`);
        
        const featureActions = {
            // Terminal features
            welcome_terminal: () => this.showWelcomeTerminal(),
            info_terminals: () => this.showInfoTerminal(),
            download_terminal: () => this.showSTLGallery(),
            
            // Learning features
            merlin_hologram: () => this.callMerlin('general'),
            basics_tutorial: () => this.startTutorial('cutting_basics'),
            angle_trainer: () => this.startTutorial('angle_training'),
            practice_station: () => this.startPractice(),
            
            // Arya Intel features
            arya_intel_station: () => this.openAryaIntel(),
            spectroscope: () => this.openAryaIntel('spectroscopy'),
            ai_analysis: () => this.openAryaIntel('analysis'),
            
            // Visualization features
            quantum_viewer: () => this.showQuantumGem({ type: 'diamond' }),
            neural_network: () => this.showNeuralNetwork(),
            gem_displays: () => this.showGemGallery(),
            
            // Forge features
            anvils: () => this.openForge('crafting'),
            molten_metal: () => this.openForge('smelting'),
            binding_altar: () => this.openForge('binding'),
            
            // Market features
            trading_posts: () => this.openMarketplace('trading'),
            auction_terminal: () => this.openMarketplace('auction'),
            
            // 3D Print Lab features
            stl_gallery: () => this.showSTLGallery(),
            print_preview: () => this.showSTLGallery('core'),
            parts_catalog: () => this.showPartsCatalog(),
            
            // Gallery features
            hologram_displays: () => this.showMineralGallery(),
            instagram_wall: () => this.openSocialWall()
        };
        
        const action = featureActions[featureId];
        if (action) {
            action();
            this.addXP(5, `Interacted with ${featureId}`);
        } else {
            this.showFeatureInfo(featureId);
        }
    },
    
    // NPC Interactions
    talkToNPC(npcId) {
        console.log(`💬 Talking to NPC: ${npcId}`);
        
        const npcDialogs = {
            merlin_intro: {
                name: 'Merlin AI',
                greeting: "Welcome, young gemologist! I am Merlin, your AI guide through the world of precious stones.",
                actions: ['Learn Basics', 'Ask Question', 'Get Quest']
            },
            master_cutter: {
                name: 'Master Cutter',
                greeting: "Ah, another aspiring cutter! The angles must be precise - let me show you.",
                actions: ['Learn Cutting', 'Practice', 'Get Tips']
            },
            arya_hologram: {
                name: 'Dr. Arya Akhavan',
                greeting: "Greetings! I've developed comprehensive analysis methods for gemstone identification. Let me share my research.",
                actions: ['Open Arya Intel', 'Learn Analysis', 'View Research']
            },
            master_smith: {
                name: 'Master Smith',
                greeting: "The forge burns hot today! Ready to craft something magnificent?",
                actions: ['Start Forging', 'Learn Metalwork', 'View Recipes']
            },
            andy_hologram: {
                name: 'Andy Acker (SlinginRockz)',
                greeting: "Hey there! Welcome to my mineral collection. These specimens tell incredible stories of Earth's history.",
                actions: ['View Collection', 'Learn Minerals', 'Follow @SlinginRockz']
            },
            printer_bot: {
                name: 'Printer Bot',
                greeting: "Beep boop! I can help you find and print GemBot components. Over 200 parts available!",
                actions: ['Browse Parts', 'View Queue', 'Get Help']
            },
            grand_master: {
                name: 'Grand Master',
                greeting: "Few reach this sanctum. You have proven yourself worthy. The greatest secrets await...",
                actions: ['Receive Blessing', 'View Legends', 'Master Challenge']
            }
        };
        
        const npc = npcDialogs[npcId];
        if (npc) {
            this.showNPCDialog(npc, npcId);
        } else {
            this.showGenericNPCDialog(npcId);
        }
        
        this.addXP(10, `Talked to ${npcId}`);
    },
    
    showNPCDialog(npc, npcId) {
        const modal = document.createElement('div');
        modal.className = 'npc-dialog-modal';
        modal.innerHTML = `
            <div class="npc-dialog-content">
                <div class="npc-portrait">${this.getNPCDisplay(npcId)}</div>
                <h3>${npc.name}</h3>
                <p class="npc-greeting">"${npc.greeting}"</p>
                <div class="npc-actions">
                    ${npc.actions.map((action, i) => `
                        <button class="npc-action-btn" onclick="GemBot3DWorld.handleNPCAction('${npcId}', ${i})">${action}</button>
                    `).join('')}
                </div>
                <button class="close-dialog" onclick="this.closest('.npc-dialog-modal').remove()">Close</button>
            </div>
        `;
        modal.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.85);
            display: flex; align-items: center; justify-content: center; z-index: 10001;
        `;
        document.body.appendChild(modal);
    },
    
    handleNPCAction(npcId, actionIndex) {
        document.querySelector('.npc-dialog-modal')?.remove();
        
        const actions = {
            merlin_intro: [() => this.startTutorial('basics'), () => this.callMerlin('question'), () => this.getQuest()],
            arya_hologram: [() => this.openAryaIntel(), () => this.startTutorial('analysis'), () => this.showResearch()],
            master_smith: [() => this.openForge('crafting'), () => this.startTutorial('forging'), () => this.showRecipes()],
            andy_hologram: [() => this.showMineralGallery(), () => this.startTutorial('minerals'), () => window.open('https://instagram.com/slinginrockz', '_blank')],
            printer_bot: [() => this.showSTLGallery(), () => this.showPrintQueue(), () => this.showPrintHelp()],
            grand_master: [() => this.receiveMasterBlessing(), () => this.showLegends(), () => this.startMasterChallenge()]
        };
        
        if (actions[npcId] && actions[npcId][actionIndex]) {
            actions[npcId][actionIndex]();
        }
    },
    
    // ==================== GAME INTEGRATIONS ====================
    openAryaIntel(tab = null) {
        if (window.AryaIntelSystem) {
            window.AryaIntelSystem.show();
            if (tab) window.AryaIntelSystem.showTab(tab);
        } else {
            this.showNotification('Arya Intel System not loaded');
        }
    },
    
    openMarketplace(section = null) {
        if (window.GemBotMarketplace) {
            window.GemBotMarketplace.show();
        } else if (typeof openStoneMarketplace === 'function') {
            openStoneMarketplace();
        } else {
            this.showNotification('Marketplace not available');
        }
    },
    
    openForge(mode = 'crafting') {
        if (typeof openRingForge === 'function') {
            openRingForge();
        } else {
            this.showNotification('Ring Forge not available');
        }
    },
    
    callMerlin(topic = 'general') {
        if (window.merlinAI) {
            window.merlinAI.askQuestion(topic);
        } else if (typeof askMerlin === 'function') {
            askMerlin(`Tell me about ${topic}`);
        } else {
            this.showNotification('Merlin AI is thinking...');
        }
    },
    
    startTutorial(tutorialId) {
        console.log(`📚 Starting tutorial: ${tutorialId}`);
        this.showNotification(`Starting tutorial: ${tutorialId}`);
        this.addXP(25, `Started tutorial: ${tutorialId}`);
        this.trackAchievement('tutorials_completed');
    },
    
    startPractice() {
        console.log('🎯 Starting practice mode');
        this.showNotification('Practice mode activated!');
        this.addXP(10, 'Practice session');
    },
    
    // Called when player identifies a gem (connect to Arya Intel)
    onGemIdentified(gemData) {
        this.trackAchievement('gems_identified');
        this.addXP(20, `Identified: ${gemData?.name || 'gem'}`);
    },
    
    // Called when player cuts a gem
    onGemCut(gemData) {
        this.trackAchievement('gems_cut');
        this.addXP(30, `Cut: ${gemData?.name || 'gem'}`);
    },
    
    // Called when player forges a ring
    onRingForged(ringData) {
        this.trackAchievement('rings_forged');
        this.addXP(50, `Forged: ${ringData?.name || 'ring'}`);
    },
    
    // Called when player completes a trade
    onTradeCompleted(tradeData) {
        this.trackAchievement('trades_completed');
        this.addXP(15, 'Trade completed');
    },
    
    // Called when player uses Arya Intel analysis
    onAryaAnalysis(analysisData) {
        this.trackAchievement('arya_analyses');
        this.addXP(25, 'Arya Intel analysis');
    },
    
    getQuest() {
        const quests = [
            { name: 'Identify 5 Gems', reward: 50, key: null },
            { name: 'Cut your first stone', reward: 100, key: 'gallery_key' },
            { name: 'Trade in the marketplace', reward: 75, key: 'market_key' },
            { name: 'Analyze with Arya Intel', reward: 150, key: 'research_key' }
        ];
        const quest = quests[Math.floor(Math.random() * quests.length)];
        this.showNotification(`🎯 New Quest: ${quest.name}\nReward: ${quest.reward} XP${quest.key ? ` + ${quest.key}` : ''}`);
    },
    
    showMineralGallery() {
        this.showNotification('🪨 Opening mineral gallery...');
        this.trackAchievement('rooms_visited');
    },
    
    openSocialWall() {
        window.open('https://instagram.com/slinginrockz', '_blank');
    },
    
    showPrintQueue() {
        const queue = this.printQueue || [];
        this.showNotification(`📋 Print Queue: ${queue.length} items\n${queue.join(', ') || 'Empty'}`);
    },
    
    showPrintHelp() {
        this.showNotification('🖨️ 3D Print Help:\n1. Browse parts in STL Gallery\n2. Add parts to queue\n3. Download STL files\n4. Print with your 3D printer!');
    },
    
    receiveMasterBlessing() {
        this.addXP(500, 'Master\'s Blessing');
        this.showNotification('👑 You have received the Master\'s Blessing!\n+500 XP');
    },
    
    showLegends() {
        this.showNotification('📜 The Legends of GemBot...\nComing soon!');
    },
    
    startMasterChallenge() {
        this.showNotification('⚔️ Master Challenge initiated!\nProve your worth...');
    },
    
    showResearch() {
        this.showNotification('📊 Dr. Arya\'s Research Papers\nAccess via Arya Intel System');
    },
    
    showRecipes() {
        this.showNotification('📖 Forge Recipes:\n• Gold Ring: 100 gold\n• Silver Band: 50 silver\n• Gem Setting: 1 cut gem');
    },
    
    showPartsCatalog() {
        this.showSTLGallery('all');
    },
    
    showNeuralNetwork() {
        if (window.QuantumGemVisualizer) {
            // Create fullscreen neural network view
            const modal = document.createElement('div');
            modal.className = 'neural-view-modal';
            modal.innerHTML = `
                <canvas id="neural-fullscreen" style="width:100%;height:100%;"></canvas>
                <button onclick="this.parentElement.remove();window.QuantumGemVisualizer.stop();" 
                        style="position:absolute;top:20px;right:20px;padding:10px 20px;background:#8800ff;color:white;border:none;border-radius:8px;cursor:pointer;">
                    Close
                </button>
            `;
            modal.style.cssText = 'position:fixed;inset:0;background:#000;z-index:10001;';
            document.body.appendChild(modal);
            
            setTimeout(() => {
                window.QuantumGemVisualizer.renderNeuralNetwork('neural-fullscreen');
            }, 100);
        }
    },
    
    showGemGallery() {
        this.showNotification('💎 Opening gem gallery...');
    },
    
    showWelcomeTerminal() {
        this.showNotification('🖥️ Welcome to GemBot Academy!\nUse the menu to navigate.');
    },
    
    showInfoTerminal() {
        const room = this.getCurrentRoom();
        this.showNotification(`📊 Room Info: ${room.name}\nFeatures: ${room.features.length}\nNPCs: ${room.npcs.length}`);
    },
    
    showFeatureInfo(featureId) {
        this.showNotification(`🔹 Feature: ${featureId}\nInteraction coming soon!`);
    },
    
    showGenericNPCDialog(npcId) {
        this.showNotification(`👤 ${npcId} waves at you.`);
    },
    
    showNotification(message) {
        // Use game's notification system or create simple one
        if (window.gameFarm?.addActivity) {
            window.gameFarm.addActivity(message);
        } else {
            alert(message);
        }
    },
    
    // ==================== ROOM INTERACTION ====================
    tryEnterRoom(roomId) {
        const access = this.canAccessRoom(roomId);
        
        if (access.allowed) {
            this.enterRoom(roomId);
        } else {
            this.showAccessDenied(roomId, access.reason);
        }
    },
    
    // ==================== QUANTUM EFFECTS ====================
    initQuantumEffects() {
        // Initialize quantum gem visualizer if available
        if (window.QuantumGemVisualizer) {
            console.log('⚛️ Quantum Gem Visualizer available');
            this.quantumReady = true;
            window.QuantumGemVisualizer.init();
        }
    },
    
    // Initialize quantum effects for specific rooms
    initRoomQuantumEffects(room) {
        if (!window.QuantumGemVisualizer) return;
        
        // Stop any existing effects
        window.QuantumGemVisualizer.stop();
        
        // Apply room-specific quantum effects
        const roomEffects = {
            'identification-lab': () => {
                // Show gem pulse effect in identification lab
                this.addQuantumBackdrop('pulse', 'sapphire');
            },
            'ai-core': () => {
                // Show neural network in AI Core
                this.addQuantumBackdrop('neural');
            },
            'cutting-chamber': () => {
                // Show crystal refraction
                this.addQuantumBackdrop('crystal', 'diamond');
            },
            'master-sanctum': () => {
                // Ultimate quantum display
                this.addQuantumBackdrop('pulse', 'alexandrite');
            },
            'forge-workshop': () => {
                // Fiery pulse effect
                this.addQuantumBackdrop('pulse', 'ruby');
            },
            'market-terminal': () => {
                // Emerald market vibes
                this.addQuantumBackdrop('crystal', 'emerald');
            }
        };
        
        if (roomEffects[room.id]) {
            roomEffects[room.id]();
        }
    },
    
    // Add quantum backdrop to current room
    addQuantumBackdrop(effectType, gemType = 'sapphire') {
        const viewport = document.querySelector('.room-viewport');
        if (!viewport) return;
        
        // Create canvas for quantum effect
        const canvas = document.createElement('canvas');
        canvas.id = 'quantum-room-backdrop';
        canvas.className = 'quantum-backdrop';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3;
            pointer-events: none;
            z-index: 0;
        `;
        viewport.insertBefore(canvas, viewport.firstChild);
        
        // Initialize the appropriate effect
        setTimeout(() => {
            canvas.width = viewport.offsetWidth;
            canvas.height = viewport.offsetHeight;
            
            if (effectType === 'pulse') {
                window.QuantumGemVisualizer.renderPulseGem(gemType, 'quantum-room-backdrop');
            } else if (effectType === 'neural') {
                window.QuantumGemVisualizer.renderNeuralNetwork('quantum-room-backdrop');
            } else if (effectType === 'crystal') {
                const ri = window.QuantumGemVisualizer.getRefractiveIndex(gemType);
                window.QuantumGemVisualizer.renderCrystalGem(gemType, ri, 'quantum-room-backdrop');
            }
        }, 100);
    },
    
    showQuantumGem(gemData) {
        if (!this.quantumReady || !window.QuantumGemVisualizer) return;
        
        // Create quantum visualization of gemstone
        console.log('⚛️ Showing quantum view of:', gemData);
        
        // Create a modal with the gem visualization
        const modal = document.createElement('div');
        modal.className = 'quantum-gem-modal';
        modal.innerHTML = `
            <div class="quantum-gem-modal-content">
                <h3>⚛️ Quantum Gem Analysis</h3>
                <div class="quantum-gem-display">
                    <canvas id="quantum-gem-display" width="300" height="300"></canvas>
                </div>
                <div class="quantum-gem-info">
                    <p>Gem Type: ${gemData.type || 'Unknown'}</p>
                    <p>Refractive Index: ${window.QuantumGemVisualizer.getRefractiveIndex(gemData.type)}</p>
                </div>
                <button onclick="this.closest('.quantum-gem-modal').remove()">Close</button>
            </div>
        `;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        document.body.appendChild(modal);
        
        // Start gem visualization
        setTimeout(() => {
            window.QuantumGemVisualizer.renderCrystalGem(
                gemData.type || 'diamond', 
                window.QuantumGemVisualizer.getRefractiveIndex(gemData.type),
                'quantum-gem-display'
            );
        }, 100);
    },
    
    // ==================== NOTIFICATIONS ====================
    showAccessDenied(roomId, reason) {
        const room = this.rooms[roomId];
        console.log(`🔒 Access denied to ${room.name}: ${reason}`);
        
        // Show in-game notification
        if (window.gameFarm?.addActivity) {
            window.gameFarm.addActivity(`🔒 Cannot enter ${room.name}: ${reason}`);
        }
        
        // Could also show a modal
        this.showNotification('🔒 Access Denied', reason, 'error');
    },
    
    showKeyObtained(key) {
        this.showNotification('🔑 Key Obtained!', `You received: ${key.name}`, 'success');
    },
    
    showLevelUpNotification() {
        this.showNotification('🎉 Level Up!', `You are now Level ${this.player.level}!`, 'success');
    },
    
    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `world-notification world-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    },
    
    onRoomEnter(room) {
        console.log(`🚶 Entered: ${room.name}`);
        
        // Grant XP for exploration
        if (!this.player.unlockedRooms.includes(room.id)) {
            this.addXP(50, 'room_discovery');
        }
        
        // Trigger room-specific events
        if (room.id === 'lobby' && window.merlinAI) {
            window.merlinAI.speak('Welcome to GemBot Academy! Explore the rooms to learn gemstone mastery.');
        }
    },
    
    onRoomUnlocked(room) {
        console.log(`🔓 Room unlocked: ${room.name}`);
        this.addXP(100, 'room_unlock');
        this.showNotification('🔓 New Area!', `You discovered: ${room.name}`, 'success');
    },
    
    // ==================== CONTROLS ====================
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.initialized) return;
            
            const room = this.rooms[this.player.currentRoom];
            if (!room) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (room.connections.north) this.tryEnterRoom(room.connections.north);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (room.connections.south) this.tryEnterRoom(room.connections.south);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (room.connections.east) this.tryEnterRoom(room.connections.east);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (room.connections.west) this.tryEnterRoom(room.connections.west);
                    break;
            }
        });
    },
    
    applyRoomEffects(room, theme) {
        // Apply special effects based on room type
        if (room.id === 'quantum_chamber' && this.quantumReady) {
            this.startQuantumVisualization();
        }
    },
    
    startQuantumVisualization() {
        console.log('⚛️ Starting quantum visualization...');
        // Would integrate with 3d-quantum-neural-network here
    },
    
    // ==================== STL GALLERY ====================
    // List of all STL preview images
    stlPreviews: [
        'Foot_Large_Hole.png', 'Foot_Small_Hole.png', 'cube.png', 'Cube-Front.png',
        'gemBotRobot.png', 'MiniGemBot.png', 'GemBotJigMain.png', 'GemBotJigMirror.png',
        'touchScreenHolder.png', 'arduinoBox.png', 'crystalBoxBottom.png', 'crystalBoxLid.png',
        'arborExtensionV10.png', 'arbor screw.png', 'Atlas_96_Tooth_Gear.png', '96 Tooth Pointer good.png',
        'indexMotorBoxGood.png', 'backStopGood.png', 'Arm.png', 'TransferJig.png',
        'Linear_Rail_Shaft_Guide_8mm.png', '2020endCap.png', 'Nema17_Mount.png',
        'TB6600_DIN_rail_mount.png', 'BatteryBank18650.png', '20x4_LCD_Casing_Front.png',
        // ... add more as needed - full list in STL_Previews folder
    ],
    
    // Category mappings for STL parts
    stlCategories: {
        core: ['gemBotRobot.png', 'MiniGemBot.png', 'cube.png', 'Cube-Front.png', 'Cube-left.png', 'Cube-right.png', 'Cube-top.png', 'Cube-bottom.png'],
        jigs: ['GemBotJigMain.png', 'GemBotJigMirror.png', 'TransferJig.png', 'TransferJigMain.png', 'TransferJigMirror.png', 'JigMain.png', 'JigMirror.png', 'JigLid.png'],
        motors: ['Nema17_Mount.png', 'indexMotorBoxGood.png', 'Nema 17 40mm 5_1 Planetary Gearbox.png', 'Carrier_motor_attach.png'],
        electronics: ['arduinoBox.png', 'touchScreenHolder.png', 'lcdBackImproved.png', '20x4_LCD_Casing_Front.png', 'TB6600_DIN_rail_mount.png', 'MEGA_R2_MOUNT.png'],
        rails: ['Linear_Rail_Shaft_Guide_8mm.png', 'Linear_Rail_Shaft_Guide_10mm.png', 'LongRail403mm.png', 'ShortRail304mm.png', '50mm 2020rail.png', '2020_v_Linear_rail_2.png'],
        storage: ['crystalBoxBottom.png', 'crystalBoxLid.png', 'BatteryBank18650.png', 'SD_Card_Holder.png', 'mineral_stand.png'],
        tools: ['Arm.png', 'arborExtensionV10.png', 'arbor screw.png', 'backStopGood.png', 'weightAdder.png', 'pawl.png', 'ratchet.png'],
        gears: ['Atlas_96_Tooth_Gear.png', '96 Tooth Pointer good.png', 'indexGearMount.png', 'Clock_hand_for_stepper_motor.png']
    },
    
    // Show STL gallery modal
    showSTLGallery(category = 'all') {
        console.log('🖼️ Opening STL Gallery...');
        
        const modal = document.createElement('div');
        modal.className = 'stl-gallery-modal';
        modal.innerHTML = `
            <div class="stl-gallery-content">
                <div class="stl-gallery-header">
                    <h2>🖨️ GemBot 3D Print Parts Gallery</h2>
                    <p>200+ printable parts for building your GemBot</p>
                    <button class="close-gallery" onclick="GemBot3DWorld.closeSTLGallery()">✕</button>
                </div>
                
                <div class="stl-gallery-categories">
                    <button class="cat-btn ${category === 'all' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('all')">📁 All Parts</button>
                    <button class="cat-btn ${category === 'core' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('core')">🤖 Core</button>
                    <button class="cat-btn ${category === 'jigs' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('jigs')">🔧 Jigs</button>
                    <button class="cat-btn ${category === 'motors' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('motors')">⚙️ Motors</button>
                    <button class="cat-btn ${category === 'electronics' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('electronics')">💡 Electronics</button>
                    <button class="cat-btn ${category === 'rails' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('rails')">📏 Rails</button>
                    <button class="cat-btn ${category === 'storage' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('storage')">📦 Storage</button>
                    <button class="cat-btn ${category === 'tools' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('tools')">🛠️ Tools</button>
                    <button class="cat-btn ${category === 'gears' ? 'active' : ''}" onclick="GemBot3DWorld.filterSTLGallery('gears')">⚛️ Gears</button>
                </div>
                
                <div class="stl-gallery-grid" id="stl-grid">
                    ${this.generateSTLGrid(category)}
                </div>
                
                <div class="stl-gallery-footer">
                    <p>💡 Click any part to view details and download STL files</p>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease-out;
        `;
        
        document.body.appendChild(modal);
        this.stlGalleryOpen = true;
    },
    
    // Generate STL grid HTML
    generateSTLGrid(category) {
        let files = [];
        
        if (category === 'all') {
            // Get all unique files from all categories
            Object.values(this.stlCategories).forEach(catFiles => {
                catFiles.forEach(f => {
                    if (!files.includes(f)) files.push(f);
                });
            });
        } else if (this.stlCategories[category]) {
            files = this.stlCategories[category];
        }
        
        if (files.length === 0) {
            return '<p class="no-parts">No parts in this category</p>';
        }
        
        return files.map(file => {
            const name = file.replace('.png', '').replace(/_/g, ' ').replace(/-/g, ' ');
            return `
                <div class="stl-part" onclick="GemBot3DWorld.showSTLDetail('${file}')">
                    <img src="./STL_Previews/${file}" alt="${name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text fill=%22%23888%22 x=%2250%22 y=%2255%22 text-anchor=%22middle%22>No Preview</text></svg>'">
                    <span class="part-name">${name}</span>
                </div>
            `;
        }).join('');
    },
    
    // Filter gallery by category
    filterSTLGallery(category) {
        const grid = document.getElementById('stl-grid');
        if (grid) {
            grid.innerHTML = this.generateSTLGrid(category);
        }
        
        // Update active button
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent.includes('All'))) {
                btn.classList.add('active');
            }
        });
    },
    
    // Show detailed view of an STL part
    showSTLDetail(filename) {
        const name = filename.replace('.png', '').replace(/_/g, ' ').replace(/-/g, ' ');
        
        const detail = document.createElement('div');
        detail.className = 'stl-detail-modal';
        detail.innerHTML = `
            <div class="stl-detail-content">
                <button class="close-detail" onclick="this.closest('.stl-detail-modal').remove()">✕</button>
                <img src="./STL_Previews/${filename}" alt="${name}">
                <h3>${name}</h3>
                <p class="part-info">3D Printable GemBot Component</p>
                <div class="part-actions">
                    <button class="action-btn" onclick="GemBot3DWorld.downloadSTL('${filename}')">⬇️ Download STL</button>
                    <button class="action-btn" onclick="GemBot3DWorld.addToQueue('${filename}')">📋 Add to Print Queue</button>
                </div>
            </div>
        `;
        
        detail.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        `;
        
        document.body.appendChild(detail);
    },
    
    // Download STL file (placeholder - would link to actual STL files)
    downloadSTL(filename) {
        const stlFile = filename.replace('.png', '.stl');
        console.log('⬇️ Downloading:', stlFile);
        
        // In production, this would link to actual STL files
        alert(`📥 Download started: ${stlFile}\n\nSTL files available on GitHub:\ngithub.com/GemBot/STL-Files`);
    },
    
    // Add to print queue
    addToQueue(filename) {
        if (!this.printQueue) this.printQueue = [];
        
        const name = filename.replace('.png', '');
        if (!this.printQueue.includes(name)) {
            this.printQueue.push(name);
            console.log('📋 Added to print queue:', name);
            alert(`✅ Added "${name}" to print queue!\n\nQueue: ${this.printQueue.length} items`);
        } else {
            alert('Already in queue!');
        }
    },
    
    // Close STL gallery
    closeSTLGallery() {
        const modal = document.querySelector('.stl-gallery-modal');
        if (modal) modal.remove();
        this.stlGalleryOpen = false;
    },
    
    // ==================== INTEGRATION METHODS ====================
    connectToMarketplace() {
        if (window.GemBotMarketplace) {
            return window.GemBotMarketplace;
        }
        return null;
    },
    
    connectToAryaIntel() {
        if (window.AryaIntelSystem) {
            return window.AryaIntelSystem;
        }
        return null;
    },
    
    connectToMerlin() {
        if (window.merlinAI) {
            return window.merlinAI;
        }
        return null;
    },
    
    // Get current room data
    getCurrentRoom() {
        return this.rooms[this.player.currentRoom];
    },
    
    // Get all accessible rooms
    getAccessibleRooms() {
        return Object.values(this.rooms).filter(room => this.canAccessRoom(room.id).allowed);
    },
    
    // Get map data for minimap
    getMapData() {
        return {
            currentRoom: this.player.currentRoom,
            unlockedRooms: this.player.unlockedRooms,
            allRooms: Object.keys(this.rooms),
            playerLevel: this.player.level
        };
    }
};

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GemBot3DWorld.init());
} else {
    GemBot3DWorld.init();
}

console.log('📦 GemBot 3D World System loaded');
