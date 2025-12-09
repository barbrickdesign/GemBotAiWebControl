/**
 * GemBot Farm - Idle/Clicker Gem Cutting Game
 * Set in a cyberpunk world where players run a gem cutting operation
 * Connected to real-world GemBot machines for bonus rewards
 */

class GemBotFarmGame {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.lastTick = Date.now();
        this.tickRate = 100;
        
        // Babylon.js
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.canvas = null;
        
        // Models
        this.cyberpunkScene = null;
        this.gemBotMachines = [];
        this.currentRoom = 'workshop';
        
        // Player state
        this.player = {
            name: 'Player',
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            gems: 0,
            roughStones: 10,
            cutGems: 0,
            tokens: 0,
            totalGemsEarned: 0,
            totalStonesCut: 0,
            totalMachineTime: 0,
            perfectCuts: 0,
            baseMultiplier: 1.0,
            realMachineBonus: 0,
            prestigeBonus: 0,
            unlockedRooms: ['workshop'],
            unlockedMachines: ['gembot_basic'],
            achievements: [],
            soundEnabled: true
        };
        
        // Machine types
        this.machineTypes = {
            gembot_basic: {
                id: 'gembot_basic', name: 'GemBot Mini', baseCost: 0,
                baseProduction: 1, activeBonus: 5, qualityChance: 0.1,
                upgradeCost: 100, maxLevel: 10, modelPath: './3_axis_cnc_animation.glb'
            },
            gembot_pro: {
                id: 'gembot_pro', name: 'GemBot Pro', baseCost: 500,
                baseProduction: 2.5, activeBonus: 8, qualityChance: 0.2,
                upgradeCost: 250, maxLevel: 15, unlockLevel: 5, modelPath: './cnc_meachine.glb'
            },
            gembot_elite: {
                id: 'gembot_elite', name: 'GemBot Elite', baseCost: 2500,
                baseProduction: 5, activeBonus: 12, qualityChance: 0.35,
                upgradeCost: 500, maxLevel: 20, unlockLevel: 15
            },
            gembot_quantum: {
                id: 'gembot_quantum', name: 'GemBot Quantum', baseCost: 25000,
                baseProduction: 15, activeBonus: 25, qualityChance: 0.5,
                upgradeCost: 2500, maxLevel: 30, unlockLevel: 30
            }
        };
        
        // Rooms
        this.rooms = {
            workshop: { id: 'workshop', name: 'Workshop', maxMachines: 2, unlockCost: 0, position: {x:0,y:0,z:0} },
            lab: { id: 'lab', name: 'Gem Lab', maxMachines: 4, unlockCost: 1000, unlockLevel: 10, position: {x:50,y:0,z:0} },
            factory: { id: 'factory', name: 'Factory Floor', maxMachines: 8, unlockCost: 10000, unlockLevel: 25, position: {x:100,y:0,z:0} },
            penthouse: { id: 'penthouse', name: 'Penthouse Suite', maxMachines: 6, unlockCost: 50000, unlockLevel: 40, position: {x:0,y:50,z:0} }
        };
        
        // Gem types
        this.gemTypes = {
            quartz: { name: 'Quartz', value: 1, color: '#fff', rarity: 'common', chance: 0.4 },
            amethyst: { name: 'Amethyst', value: 3, color: '#9b59b6', rarity: 'common', chance: 0.25 },
            topaz: { name: 'Topaz', value: 5, color: '#f39c12', rarity: 'uncommon', chance: 0.15 },
            emerald: { name: 'Emerald', value: 15, color: '#2ecc71', rarity: 'rare', chance: 0.1 },
            ruby: { name: 'Ruby', value: 25, color: '#e74c3c', rarity: 'rare', chance: 0.06 },
            sapphire: { name: 'Sapphire', value: 30, color: '#3498db', rarity: 'epic', chance: 0.03 },
            diamond: { name: 'Diamond', value: 100, color: '#ecf0f1', rarity: 'legendary', chance: 0.01 }
        };
        
        this.activeMachines = [];
        this.achievements = {
            first_gem: { name: 'First Cut', reward: 10 },
            hundred_gems: { name: 'Century', reward: 50 },
            thousand_gems: { name: 'Gem Master', reward: 200 },
            first_perfect: { name: 'Perfection', reward: 25 },
            real_connection: { name: 'Real Deal', reward: 500 },
            first_diamond: { name: 'Diamond Cutter', reward: 100 },
            multi_machine: { name: 'Entrepreneur', reward: 150 },
            level_10: { name: 'Journeyman', reward: 100 },
            level_25: { name: 'Expert', reward: 500 }
        };
        
        this.onGemCut = null;
        this.onLevelUp = null;
        this.onAchievement = null;
        this.onUIUpdate = null;
        this.realMachineConnected = false;
    }
    
    async initialize(canvasId = 'game-canvas') {
        console.log('🎮 Initializing GemBot Farm...');
        
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
        }
        
        let retries = 0;
        while (typeof BABYLON === 'undefined' && retries < 50) {
            await new Promise(r => setTimeout(r, 100));
            retries++;
        }
        
        if (typeof BABYLON === 'undefined') return false;
        
        this.engine = new BABYLON.Engine(this.canvas, true, { antialias: true });
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.05, 1);
        
        this.setupCamera();
        this.setupLighting();
        await this.loadCyberpunkScene();
        this.loadGameState();
        
        if (this.activeMachines.length === 0) {
            this.addMachine('gembot_basic', 'workshop');
        }
        
        this.engine.runRenderLoop(() => this.scene.render());
        this.startGameLoop();
        
        window.addEventListener('resize', () => this.engine.resize());
        this.syncWithExistingSystems();
        
        console.log('✅ GemBot Farm initialized!');
        this.isRunning = true;
        return true;
    }
    
    setupCamera() {
        this.camera = new BABYLON.ArcRotateCamera('cam', Math.PI/2, Math.PI/3, 50, new BABYLON.Vector3(0,5,0), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.wheelPrecision = 20;
        this.camera.lowerRadiusLimit = 20;
        this.camera.upperRadiusLimit = 150;
    }
    
    setupLighting() {
        const ambient = new BABYLON.HemisphericLight('amb', new BABYLON.Vector3(0,1,0), this.scene);
        ambient.intensity = 0.3;
        
        const neonPink = new BABYLON.PointLight('pink', new BABYLON.Vector3(-20,10,0), this.scene);
        neonPink.diffuse = new BABYLON.Color3(1, 0.2, 0.6);
        neonPink.intensity = 0.8;
        
        const neonCyan = new BABYLON.PointLight('cyan', new BABYLON.Vector3(20,10,0), this.scene);
        neonCyan.diffuse = new BABYLON.Color3(0.2, 1, 1);
        neonCyan.intensity = 0.8;
    }
    
    async loadCyberpunkScene() {
        try {
            const result = await BABYLON.SceneLoader.ImportMeshAsync('', '', './cyberpunk_game_scene.glb', this.scene);
            this.cyberpunkScene = result.meshes[0];
            
            if (this.cyberpunkScene) {
                const bounds = this.cyberpunkScene.getHierarchyBoundingVectors();
                const size = bounds.max.subtract(bounds.min);
                const scale = 100 / Math.max(size.x, size.y, size.z);
                this.cyberpunkScene.scaling = new BABYLON.Vector3(scale, scale, scale);
            }
            
            result.animationGroups?.forEach(g => g.play(true));
            console.log('✅ Cyberpunk scene loaded');
        } catch (e) {
            console.warn('⚠️ Scene load failed:', e);
            this.createFallbackEnv();
        }
    }
    
    createFallbackEnv() {
        const ground = BABYLON.MeshBuilder.CreateGround('ground', {width:100,height:100}, this.scene);
        const gMat = new BABYLON.StandardMaterial('gMat', this.scene);
        gMat.diffuseColor = new BABYLON.Color3(0.1,0.1,0.15);
        ground.material = gMat;
        
        const table = BABYLON.MeshBuilder.CreateBox('table', {width:20,height:1,depth:10}, this.scene);
        table.position.y = 3;
        table.material = gMat;
    }
    
    startGameLoop() {
        this.lastTick = Date.now();
        this.gameLoop = setInterval(() => this.tick(), this.tickRate);
    }
    
    tick() {
        if (this.isPaused) return;
        
        const now = Date.now();
        const dt = (now - this.lastTick) / 1000;
        this.lastTick = now;
        
        this.activeMachines.forEach(m => this.updateMachine(m, dt));
        this.checkAchievements();
        this.checkLevelUp();
        
        if (this.onUIUpdate) this.onUIUpdate(this.getState());
        if (now % 30000 < this.tickRate) this.save();
    }
    
    updateMachine(m, dt) {
        if (!m.isActive) return;
        
        const type = this.machineTypes[m.typeId];
        const prod = this.calcProduction(m);
        
        m.accum += prod * dt;
        while (m.accum >= 1) {
            m.accum -= 1;
            this.produceGem(m);
        }
        
        m.runTime += dt;
        this.player.totalMachineTime += dt;
    }
    
    calcProduction(m) {
        const type = this.machineTypes[m.typeId];
        let prod = type.baseProduction * (1 + m.level * 0.1) * this.player.baseMultiplier;
        if (this.realMachineConnected) prod *= (1 + this.player.realMachineBonus);
        if (m.activeCutting) prod *= type.activeBonus;
        return prod;
    }
    
    produceGem(m) {
        const type = this.machineTypes[m.typeId];
        const gem = this.rollGem();
        const perfect = Math.random() < type.qualityChance * (1 + m.level * 0.05);
        
        let val = gem.value * this.player.baseMultiplier;
        if (perfect) { val *= 2; this.player.perfectCuts++; m.perfect++; }
        if (this.realMachineConnected) val *= (1 + this.player.realMachineBonus);
        
        this.player.gems += Math.floor(val);
        this.player.totalGemsEarned += Math.floor(val);
        this.player.cutGems++;
        this.player.totalStonesCut++;
        m.cut++;
        
        this.player.xp += Math.ceil(val / 2);
        
        if (this.onGemCut) this.onGemCut({ gem, value: Math.floor(val), perfect, machine: m.id });
        if (gem.name === 'Diamond' && !this.player.achievements.includes('first_diamond')) {
            this.unlock('first_diamond');
        }
    }
    
    rollGem() {
        const r = Math.random();
        let c = 0;
        for (const g of Object.values(this.gemTypes)) {
            c += g.chance;
            if (r <= c) return g;
        }
        return this.gemTypes.quartz;
    }
    
    async addMachine(typeId, roomId) {
        const type = this.machineTypes[typeId];
        const room = this.rooms[roomId];
        if (!type || !room) return null;
        if (!this.player.unlockedRooms.includes(roomId)) return null;
        
        const count = this.activeMachines.filter(m => m.roomId === roomId).length;
        if (count >= room.maxMachines) return null;
        if (this.player.gems < type.baseCost) return null;
        
        this.player.gems -= type.baseCost;
        
        const m = {
            id: `m_${Date.now()}`,
            typeId, roomId,
            level: 1,
            isActive: true,
            activeCutting: false,
            accum: 0,
            cut: 0,
            perfect: 0,
            runTime: 0,
            mesh: null
        };
        
        this.activeMachines.push(m);
        
        if (this.activeMachines.length >= 3 && !this.player.achievements.includes('multi_machine')) {
            this.unlock('multi_machine');
        }
        
        return m;
    }
    
    upgradeMachine(id) {
        const m = this.activeMachines.find(x => x.id === id);
        if (!m) return false;
        
        const type = this.machineTypes[m.typeId];
        const cost = type.upgradeCost * m.level;
        
        if (m.level >= type.maxLevel || this.player.gems < cost) return false;
        
        this.player.gems -= cost;
        m.level++;
        return true;
    }
    
    unlockRoom(roomId) {
        const room = this.rooms[roomId];
        if (!room) return false;
        if (this.player.unlockedRooms.includes(roomId)) return false;
        if (room.unlockLevel && this.player.level < room.unlockLevel) return false;
        if (this.player.gems < room.unlockCost) return false;
        
        this.player.gems -= room.unlockCost;
        this.player.unlockedRooms.push(roomId);
        return true;
    }
    
    checkLevelUp() {
        while (this.player.xp >= this.player.xpToNextLevel) {
            this.player.xp -= this.player.xpToNextLevel;
            this.player.level++;
            this.player.xpToNextLevel = Math.floor(100 * Math.pow(1.2, this.player.level - 1));
            this.player.gems += this.player.level * 10;
            
            if (this.player.level >= 10 && !this.player.achievements.includes('level_10')) this.unlock('level_10');
            if (this.player.level >= 25 && !this.player.achievements.includes('level_25')) this.unlock('level_25');
            
            if (this.onLevelUp) this.onLevelUp(this.player.level);
        }
    }
    
    checkAchievements() {
        if (this.player.totalStonesCut >= 1 && !this.player.achievements.includes('first_gem')) this.unlock('first_gem');
        if (this.player.totalStonesCut >= 100 && !this.player.achievements.includes('hundred_gems')) this.unlock('hundred_gems');
        if (this.player.totalStonesCut >= 1000 && !this.player.achievements.includes('thousand_gems')) this.unlock('thousand_gems');
        if (this.player.perfectCuts >= 1 && !this.player.achievements.includes('first_perfect')) this.unlock('first_perfect');
    }
    
    unlock(id) {
        if (this.player.achievements.includes(id)) return;
        const a = this.achievements[id];
        if (!a) return;
        
        this.player.achievements.push(id);
        this.player.gems += a.reward;
        console.log(`🏆 ${a.name}`);
        if (this.onAchievement) this.onAchievement(a);
    }
    
    onRealMachineConnected() {
        this.realMachineConnected = true;
        this.player.realMachineBonus = 0.5;
        if (!this.player.achievements.includes('real_connection')) this.unlock('real_connection');
        console.log('🔌 Real GemBot connected! +50% bonus');
    }
    
    onRealMachineDisconnected() {
        this.realMachineConnected = false;
    }
    
    onRealMachineCut() {
        this.player.tokens += 10 * this.player.level;
        this.player.gems += Math.floor(50 * this.player.baseMultiplier);
        this.player.xp += 25;
    }
    
    syncWithExistingSystems() {
        if (typeof merlin !== 'undefined' && merlin.userProfile?.gemForge) {
            const gf = merlin.userProfile.gemForge;
            this.player.gems = gf.wallet?.balance || this.player.gems;
            this.player.tokens = gf.wallet?.tokenBalance || this.player.tokens;
            this.player.totalGemsEarned = gf.wallet?.lifetimeEarned || this.player.totalGemsEarned;
            this.player.totalStonesCut = gf.stoneAccess?.stonesCompleted || this.player.totalStonesCut;
        }
        
        if (typeof serial !== 'undefined' && serial.port) {
            this.onRealMachineConnected();
        }
    }
    
    pushToSystems() {
        if (typeof merlin !== 'undefined' && merlin.userProfile?.gemForge) {
            const gf = merlin.userProfile.gemForge;
            gf.wallet.balance = this.player.gems;
            gf.wallet.tokenBalance = this.player.tokens;
            gf.wallet.lifetimeEarned = this.player.totalGemsEarned;
            gf.stoneAccess.stonesCompleted = this.player.totalStonesCut;
            merlin.saveUserProfile?.();
        }
        leaderboardUI?.loadData?.();
    }
    
    getState() {
        return {
            player: this.player,
            machines: this.activeMachines,
            currentRoom: this.currentRoom,
            realMachineConnected: this.realMachineConnected,
            timestamp: Date.now()
        };
    }
    
    save() {
        localStorage.setItem('gembot_farm', JSON.stringify(this.getState()));
        this.pushToSystems();
    }
    
    loadGameState() {
        try {
            const s = localStorage.getItem('gembot_farm');
            if (s) {
                const d = JSON.parse(s);
                Object.assign(this.player, d.player);
                this.activeMachines = d.machines || [];
                this.currentRoom = d.currentRoom || 'workshop';
                
                if (d.timestamp) {
                    const offline = Math.min((Date.now() - d.timestamp) / 1000, 8 * 3600);
                    let earned = 0;
                    this.activeMachines.forEach(m => {
                        if (m.isActive) earned += this.calcProduction(m) * 0.5 * offline;
                    });
                    if (earned > 0) {
                        this.player.gems += Math.floor(earned);
                        this.player.totalGemsEarned += Math.floor(earned);
                        console.log(`💰 Offline: +${Math.floor(earned)} gems`);
                    }
                }
            }
        } catch (e) { console.warn('Load failed:', e); }
    }
    
    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; this.lastTick = Date.now(); }
    
    dispose() {
        this.save();
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.scene?.dispose();
        this.engine?.dispose();
    }
}

window.GemBotFarmGame = GemBotFarmGame;
