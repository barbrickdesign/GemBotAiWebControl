/**
 * GemBot 3D Model Inventory System
 * Manages all 3D assets, player unlocks, and model customization
 */

class GemBot3DInventory {
    constructor() {
        this.catalog = null;
        this.playerInventory = {
            unlocked: ['base'], // Start with base model unlocked
            selected: 'base',
            favorites: []
        };
        
        this.models = {
            machines: [
                {
                    id: 'base',
                    name: 'Base Gem Bot',
                    file: 'base.obj',
                    size: 55.18,
                    triangles: 499902,
                    cost: 0, // Free starter machine
                    description: 'The original Gem Bot cutting machine. Your foundation for gemstone processing.',
                    category: 'machine',
                    power: 1.0,
                    speed: 1.0,
                    unlocked: true
                },
                {
                    id: 'gembot2',
                    name: 'Gem Bot MK2',
                    file: 'gembot2.glb',
                    cost: 5000,
                    description: 'Advanced cutting mechanism with improved precision.',
                    category: 'machine',
                    power: 1.5,
                    speed: 1.2,
                    unlocked: false
                },
                {
                    id: 'gembot3',
                    name: 'Gem Bot MK3',
                    file: 'gembot3.glb',
                    cost: 15000,
                    description: 'Professional-grade gemstone processing with automated polishing.',
                    category: 'machine',
                    power: 2.0,
                    speed: 1.5,
                    unlocked: false
                },
                {
                    id: 'gembot4',
                    name: 'Gem Bot MK4',
                    file: 'gembot4.glb',
                    cost: 50000,
                    description: 'Industrial-strength multi-axis cutting system.',
                    category: 'machine',
                    power: 3.0,
                    speed: 2.0,
                    unlocked: false
                },
                {
                    id: 'gembot3dmodel1',
                    name: 'Gem Bot Pro',
                    file: 'gembot3dmodel1.glb',
                    cost: 100000,
                    description: 'The ultimate gemstone cutting machine with AI-guided precision.',
                    category: 'machine',
                    power: 5.0,
                    speed: 3.0,
                    unlocked: false
                }
            ],
            
            environments: [
                {
                    id: 'warehouse',
                    name: '80s Warehouse',
                    file: '80s_warehouse.glb',
                    size: 10.85,
                    cost: 2000,
                    description: 'Retro warehouse atmosphere with neon lights.',
                    category: 'environment',
                    unlocked: false
                },
                {
                    id: 'alien_planet',
                    name: 'Alien Planet',
                    file: 'alien_planet.glb',
                    size: 1.52,
                    cost: 3000,
                    description: 'Otherworldly mining colony on a distant planet.',
                    category: 'environment',
                    unlocked: false
                }
            ],
            
            decorations: [
                {
                    id: 'angel_wings',
                    name: 'Angel Wings',
                    file: 'angel_wings.glb',
                    size: 0.47,
                    cost: 500,
                    description: 'Decorative angel wings for your machine.',
                    category: 'decoration',
                    unlocked: false
                },
                {
                    id: 'noisy_cricket',
                    name: 'Noisy Cricket',
                    file: 'archive_sm_noisycricket_01_a.glb',
                    size: 3.17,
                    cost: 1000,
                    description: 'Small but powerful energy device.',
                    category: 'decoration',
                    unlocked: false
                }
            ],
            
            mining_equipment: [
                {
                    id: 'ant_miner',
                    name: 'Ant Miner S19 Pro',
                    file: 'ant_miner_s19_pro.glb',
                    size: 23.97,
                    cost: 25000,
                    description: 'Add cryptocurrency mining to your operations.',
                    category: 'equipment',
                    power: 2.0,
                    unlocked: false
                },
                {
                    id: 'apple_ii',
                    name: 'Apple II Computer',
                    file: 'apple_ii_computer.glb',
                    size: 108.82,
                    cost: 5000,
                    description: 'Vintage computing power for nostalgia.',
                    category: 'equipment',
                    unlocked: false
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.loadPlayerInventory();
        this.loadCatalog();
        console.log('📦 3D Inventory System initialized');
        console.log(`   Machines: ${this.models.machines.length}`);
        console.log(`   Environments: ${this.models.environments.length}`);
        console.log(`   Decorations: ${this.models.decorations.length}`);
        console.log(`   Equipment: ${this.models.mining_equipment.length}`);
    }
    
    /**
     * Load full 3D asset catalog from JSON
     */
    async loadCatalog() {
        try {
            const response = await fetch('./3d-asset-catalog.json');
            this.catalog = await response.json();
            console.log(`✅ Loaded ${this.catalog.length} 3D assets from catalog`);
        } catch (error) {
            console.warn('⚠️ Could not load 3D catalog:', error);
        }
    }
    
    /**
     * Load player inventory from localStorage
     */
    loadPlayerInventory() {
        const saved = localStorage.getItem('gembot_3d_inventory');
        if (saved) {
            try {
                this.playerInventory = JSON.parse(saved);
                console.log('✅ Player inventory loaded');
            } catch (error) {
                console.error('❌ Failed to load inventory:', error);
            }
        }
    }
    
    /**
     * Save player inventory to localStorage
     */
    savePlayerInventory() {
        localStorage.setItem('gembot_3d_inventory', JSON.stringify(this.playerInventory));
    }
    
    /**
     * Get all models of a specific category
     */
    getModelsByCategory(category) {
        const key = {
            'machine': 'machines',
            'environment': 'environments',
            'decoration': 'decorations',
            'equipment': 'mining_equipment'
        }[category];
        
        return this.models[key] || [];
    }
    
    /**
     * Get all unlocked models
     */
    getUnlockedModels() {
        const unlocked = [];
        
        Object.keys(this.models).forEach(category => {
            this.models[category].forEach(model => {
                if (this.playerInventory.unlocked.includes(model.id)) {
                    unlocked.push(model);
                }
            });
        });
        
        return unlocked;
    }
    
    /**
     * Check if player can afford a model
     */
    canAfford(modelId) {
        if (!window.GBUV) return false;
        
        const model = this.findModelById(modelId);
        if (!model) return false;
        
        const balance = window.GBUV.getBalance();
        return balance.gems >= model.cost;
    }
    
    /**
     * Unlock a model (purchase)
     */
    unlockModel(modelId) {
        const model = this.findModelById(modelId);
        if (!model) {
            return { success: false, error: 'Model not found' };
        }
        
        if (this.playerInventory.unlocked.includes(modelId)) {
            return { success: false, error: 'Already unlocked' };
        }
        
        if (!this.canAfford(modelId)) {
            return { success: false, error: 'Insufficient gems' };
        }
        
        // Deduct cost
        if (window.GBUV) {
            const spent = window.GBUV.spendGems(model.cost, `unlock_${modelId}`);
            if (!spent.success) {
                return { success: false, error: spent.error };
            }
        }
        
        // Unlock model
        this.playerInventory.unlocked.push(modelId);
        this.savePlayerInventory();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('modelUnlocked', {
            detail: { modelId, model }
        }));
        
        console.log(`✅ Unlocked: ${model.name}`);
        
        return { success: true, model };
    }
    
    /**
     * Select a model (equip/use)
     */
    selectModel(modelId) {
        if (!this.playerInventory.unlocked.includes(modelId)) {
            return { success: false, error: 'Model not unlocked' };
        }
        
        const model = this.findModelById(modelId);
        if (!model) {
            return { success: false, error: 'Model not found' };
        }
        
        this.playerInventory.selected = modelId;
        this.savePlayerInventory();
        
        // Dispatch event to update 3D viewer
        window.dispatchEvent(new CustomEvent('modelSelected', {
            detail: { modelId, model }
        }));
        
        console.log(`🎯 Selected: ${model.name}`);
        
        return { success: true, model };
    }
    
    /**
     * Toggle favorite
     */
    toggleFavorite(modelId) {
        const index = this.playerInventory.favorites.indexOf(modelId);
        
        if (index > -1) {
            this.playerInventory.favorites.splice(index, 1);
        } else {
            this.playerInventory.favorites.push(modelId);
        }
        
        this.savePlayerInventory();
    }
    
    /**
     * Find model by ID
     */
    findModelById(modelId) {
        for (const category in this.models) {
            const found = this.models[category].find(m => m.id === modelId);
            if (found) return found;
        }
        return null;
    }
    
    /**
     * Get currently selected model
     */
    getSelectedModel() {
        return this.findModelById(this.playerInventory.selected);
    }
    
    /**
     * Get model stats (power, speed multipliers)
     */
    getModelStats(modelId) {
        const model = this.findModelById(modelId);
        if (!model) return { power: 1.0, speed: 1.0 };
        
        return {
            power: model.power || 1.0,
            speed: model.speed || 1.0
        };
    }
    
    /**
     * Generate inventory UI HTML
     */
    generateInventoryHTML() {
        const selected = this.getSelectedModel();
        
        let html = `
            <div class="inventory-container">
                <div class="inventory-header">
                    <h2>🏭 3D Model Inventory</h2>
                    <div class="selected-model">
                        Currently Using: <strong>${selected ? selected.name : 'None'}</strong>
                    </div>
                </div>
                
                <div class="inventory-tabs">
                    <button class="tab active" data-category="machine">🤖 Machines</button>
                    <button class="tab" data-category="environment">🌍 Environments</button>
                    <button class="tab" data-category="decoration">✨ Decorations</button>
                    <button class="tab" data-category="equipment">⚙️ Equipment</button>
                </div>
                
                <div class="inventory-grid" id="inventory-grid">
                    ${this.generateCategoryHTML('machine')}
                </div>
            </div>
        `;
        
        return html;
    }
    
    /**
     * Generate HTML for a category
     */
    generateCategoryHTML(category) {
        const models = this.getModelsByCategory(category);
        const balance = window.GBUV ? window.GBUV.getBalance() : { gems: 0 };
        
        let html = '';
        
        models.forEach(model => {
            const unlocked = this.playerInventory.unlocked.includes(model.id);
            const selected = this.playerInventory.selected === model.id;
            const favorite = this.playerInventory.favorites.includes(model.id);
            const canAfford = balance.gems >= model.cost;
            
            html += `
                <div class="inventory-item ${unlocked ? 'unlocked' : 'locked'} ${selected ? 'selected' : ''}" data-model-id="${model.id}">
                    <div class="item-preview">
                        <div class="item-icon">🤖</div>
                        ${favorite ? '<span class="favorite">⭐</span>' : ''}
                        ${selected ? '<span class="selected-badge">ACTIVE</span>' : ''}
                    </div>
                    
                    <div class="item-info">
                        <h3>${model.name}</h3>
                        <p>${model.description}</p>
                        
                        ${model.power ? `<div class="stat">⚡ Power: ${model.power}x</div>` : ''}
                        ${model.speed ? `<div class="stat">⚡ Speed: ${model.speed}x</div>` : ''}
                        ${model.size ? `<div class="stat">💾 ${model.size}MB</div>` : ''}
                        ${model.triangles ? `<div class="stat">🔺 ${model.triangles.toLocaleString()} tris</div>` : ''}
                    </div>
                    
                    <div class="item-actions">
                        ${unlocked ? `
                            <button class="btn-select" onclick="GemBot3DInventory.selectModel('${model.id}')">
                                ${selected ? '✓ Selected' : 'Use'}
                            </button>
                            <button class="btn-favorite" onclick="GemBot3DInventory.toggleFavorite('${model.id}')">
                                ${favorite ? '⭐' : '☆'}
                            </button>
                        ` : `
                            <button class="btn-unlock ${canAfford ? '' : 'disabled'}" onclick="GemBot3DInventory.unlockModel('${model.id}')">
                                💎 ${model.cost} Gems
                            </button>
                        `}
                    </div>
                </div>
            `;
        });
        
        return html;
    }
    
    /**
     * Open inventory UI
     */
    openInventory() {
        // Check if inventory modal exists
        let modal = document.getElementById('inventory-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'inventory-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content inventory-modal-content">
                    <button class="modal-close" onclick="window.GemBot3DInventory.closeInventory()">×</button>
                    ${this.generateInventoryHTML()}
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add event listeners for tabs
            modal.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    const category = tab.dataset.category;
                    const grid = modal.querySelector('#inventory-grid');
                    grid.innerHTML = this.generateCategoryHTML(category);
                });
            });
        }
        
        modal.style.display = 'flex';
    }
    
    /**
     * Close inventory UI
     */
    closeInventory() {
        const modal = document.getElementById('inventory-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize global inventory system
window.GemBot3DInventory = new GemBot3DInventory();

// Add convenient global function
window.openInventory = () => window.GemBot3DInventory.openInventory();

console.log('✅ 3D Inventory System loaded');
console.log('📝 Command: openInventory() - Open 3D model shop');
