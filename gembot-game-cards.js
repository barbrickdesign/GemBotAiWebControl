/**
 * 💎 GemBot Game Card System
 * RPG-style equipment cards for all GemBot components
 * 
 * Features:
 * - Trading card style display
 * - Rarity tiers with visual effects
 * - Stats: cost, durability, failure chance, function
 * - Unlockable through gameplay progression
 * - Collection tracking and achievements
 */

const GemBotGameCards = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",

    // Card rarity configuration
    rarityConfig: {
        common: {
            name: "Common",
            color: "#9e9e9e",
            bgGradient: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
            borderGlow: "none",
            foilEffect: false,
            dropRate: 0.50,
            valueMultiplier: 1.0,
            failureChance: 0.02,
            icon: "⚪"
        },
        uncommon: {
            name: "Uncommon",
            color: "#4caf50",
            bgGradient: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
            borderGlow: "0 0 10px rgba(76, 175, 80, 0.5)",
            foilEffect: false,
            dropRate: 0.30,
            valueMultiplier: 1.5,
            failureChance: 0.05,
            icon: "🟢"
        },
        rare: {
            name: "Rare",
            color: "#2196f3",
            bgGradient: "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
            borderGlow: "0 0 15px rgba(33, 150, 243, 0.7)",
            foilEffect: true,
            dropRate: 0.15,
            valueMultiplier: 2.5,
            failureChance: 0.08,
            icon: "🔵"
        },
        epic: {
            name: "Epic",
            color: "#9c27b0",
            bgGradient: "linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)",
            borderGlow: "0 0 20px rgba(156, 39, 176, 0.8)",
            foilEffect: true,
            dropRate: 0.04,
            valueMultiplier: 4.0,
            failureChance: 0.12,
            icon: "🟣"
        },
        legendary: {
            name: "Legendary",
            color: "#ff9800",
            bgGradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 50%, #ffc107 100%)",
            borderGlow: "0 0 25px rgba(255, 152, 0, 1), 0 0 50px rgba(255, 193, 7, 0.5)",
            foilEffect: true,
            animated: true,
            dropRate: 0.01,
            valueMultiplier: 8.0,
            failureChance: 0.15,
            icon: "🟠"
        }
    },

    // Card types
    cardTypes: {
        part: {
            id: "part",
            name: "Equipment Part",
            icon: "⚙️",
            description: "Physical component for GemBot assembly"
        },
        printable: {
            id: "printable",
            name: "3D Printable",
            icon: "🖨️",
            description: "Custom 3D printed component"
        },
        design: {
            id: "design",
            name: "Faceting Design",
            icon: "💎",
            description: "Gemstone cutting pattern"
        },
        consumable: {
            id: "consumable",
            name: "Consumable",
            icon: "🧪",
            description: "Materials and supplies"
        },
        upgrade: {
            id: "upgrade",
            name: "Upgrade",
            icon: "⬆️",
            description: "Performance enhancement"
        },
        special: {
            id: "special",
            name: "Special",
            icon: "⭐",
            description: "Unique or limited items"
        }
    },

    // Stat icons
    statIcons: {
        cost: "💰",
        durability: "🛡️",
        power: "⚡",
        precision: "🎯",
        speed: "🏃",
        weight: "⚖️",
        level: "🔓",
        xp: "⭐",
        time: "⏱️",
        quantity: "📦",
        criticalPart: "⚠️",
        craftable: "🔨"
    },

    // Card CSS styles
    cardStyles: `
        .gembot-card {
            width: 280px;
            height: 400px;
            border-radius: 15px;
            position: relative;
            overflow: hidden;
            font-family: 'Segoe UI', Arial, sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .gembot-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        
        .card-border {
            position: absolute;
            inset: 0;
            border-radius: 15px;
            padding: 3px;
        }
        
        .card-inner {
            background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
            border-radius: 12px;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .card-header {
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .card-name {
            color: white;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            flex: 1;
        }
        
        .card-type-badge {
            font-size: 20px;
            margin-left: 8px;
        }
        
        .card-image {
            width: 100%;
            height: 160px;
            background: linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .card-image img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.5));
        }
        
        .card-image .placeholder-icon {
            font-size: 80px;
            opacity: 0.7;
        }
        
        .rarity-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        
        .card-body {
            flex: 1;
            padding: 12px 15px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .card-description {
            color: #b0b0c0;
            font-size: 11px;
            line-height: 1.4;
            flex: 1;
        }
        
        .card-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
        }
        
        .stat-item {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.05);
            padding: 6px 10px;
            border-radius: 8px;
        }
        
        .stat-icon {
            font-size: 14px;
        }
        
        .stat-value {
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .stat-label {
            color: #8080a0;
            font-size: 9px;
            text-transform: uppercase;
        }
        
        .card-footer {
            padding: 10px 15px;
            background: rgba(0,0,0,0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .card-price {
            color: #ffd700;
            font-size: 18px;
            font-weight: bold;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .card-level {
            color: #00bcd4;
            font-size: 12px;
            font-weight: bold;
        }
        
        /* Foil effect for rare+ cards */
        .foil-effect {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                135deg,
                transparent 0%,
                rgba(255,255,255,0.1) 45%,
                rgba(255,255,255,0.3) 50%,
                rgba(255,255,255,0.1) 55%,
                transparent 100%
            );
            animation: foil-shine 3s ease-in-out infinite;
            pointer-events: none;
        }
        
        @keyframes foil-shine {
            0%, 100% { transform: translateX(-100%) rotate(0deg); }
            50% { transform: translateX(100%) rotate(0deg); }
        }
        
        /* Legendary animated border */
        .legendary-border {
            background: linear-gradient(90deg, 
                #ff9800, #ffc107, #ffeb3b, #ffc107, #ff9800
            );
            background-size: 200% 100%;
            animation: legendary-glow 2s linear infinite;
        }
        
        @keyframes legendary-glow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }
        
        /* Card tags */
        .card-tags {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
            margin-top: 4px;
        }
        
        .tag {
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
            color: #a0a0c0;
        }
        
        .tag.critical {
            background: rgba(244, 67, 54, 0.3);
            color: #ff8a80;
        }
        
        .tag.craftable {
            background: rgba(76, 175, 80, 0.3);
            color: #a5d6a7;
        }
    `,

    /**
     * Generate card HTML from part data
     */
    generatePartCard(partData, options = {}) {
        const rarity = this.rarityConfig[partData.rarity || 'common'];
        const cardType = this.cardTypes[partData.cardType || 'part'];
        const showImage = options.showImage !== false;
        
        const isCritical = partData.gameData?.criticalPart;
        const isCraftable = partData.gameData?.craftable;
        
        return `
            <div class="gembot-card" data-rarity="${partData.rarity}" data-id="${partData.id}">
                <div class="card-border ${rarity.animated ? 'legendary-border' : ''}" 
                     style="background: ${rarity.bgGradient}; box-shadow: ${rarity.borderGlow}">
                    <div class="card-inner">
                        
                        <!-- Header -->
                        <div class="card-header" style="border-bottom: 2px solid ${rarity.color}40">
                            <span class="card-name">${partData.name}</span>
                            <span class="card-type-badge">${cardType.icon}</span>
                        </div>
                        
                        <!-- Image -->
                        <div class="card-image">
                            ${showImage && partData.preview ? 
                                `<img src="STL_Previews/${partData.preview}" alt="${partData.name}" />` :
                                `<span class="placeholder-icon">${cardType.icon}</span>`
                            }
                            <span class="rarity-badge" style="background: ${rarity.color}">
                                ${rarity.icon} ${rarity.name}
                            </span>
                            ${rarity.foilEffect ? '<div class="foil-effect"></div>' : ''}
                        </div>
                        
                        <!-- Body -->
                        <div class="card-body">
                            <p class="card-description">${partData.description}</p>
                            
                            <div class="card-stats">
                                ${this._generateStatItem('durability', partData.stats?.durability || '—')}
                                ${this._generateStatItem('weight', partData.stats?.weight || partData.materialWeight ? 
                                    `${partData.stats?.weight || partData.materialWeight}g` : '—')}
                                ${partData.printTime ? 
                                    this._generateStatItem('time', `${partData.printTime}m`) : 
                                    this._generateStatItem('quantity', `×${partData.quantity || 1}`)}
                                ${this._generateStatItem('xp', partData.gameData?.craftXP || partData.gameData?.sellPrice || '—')}
                            </div>
                            
                            <div class="card-tags">
                                ${isCritical ? '<span class="tag critical">⚠️ Critical</span>' : ''}
                                ${isCraftable ? '<span class="tag craftable">🔨 Craftable</span>' : ''}
                                ${partData.category ? `<span class="tag">${partData.category}</span>` : ''}
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div class="card-footer">
                            <span class="card-price">${this.statIcons.cost} $${partData.price}</span>
                            <span class="card-level">${this.statIcons.level} Lv.${partData.gameData?.unlockLevel || 1}</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Generate stat item HTML
     */
    _generateStatItem(statType, value) {
        const labels = {
            durability: 'DUR',
            weight: 'WEIGHT',
            time: 'TIME',
            quantity: 'QTY',
            xp: 'XP'
        };
        
        return `
            <div class="stat-item">
                <span class="stat-icon">${this.statIcons[statType] || '📊'}</span>
                <div>
                    <div class="stat-value">${value}</div>
                    <div class="stat-label">${labels[statType] || statType}</div>
                </div>
            </div>
        `;
    },

    /**
     * Generate design card (for faceting patterns)
     */
    generateDesignCard(design) {
        const rarity = this.rarityConfig[design.baseRarity || 'common'];
        
        return `
            <div class="gembot-card" data-rarity="${design.baseRarity}" data-id="${design.id}">
                <div class="card-border ${rarity.animated ? 'legendary-border' : ''}" 
                     style="background: ${rarity.bgGradient}; box-shadow: ${rarity.borderGlow}">
                    <div class="card-inner">
                        
                        <div class="card-header" style="border-bottom: 2px solid ${rarity.color}40">
                            <span class="card-name">${design.name}</span>
                            <span class="card-type-badge">💎</span>
                        </div>
                        
                        <div class="card-image">
                            <span class="placeholder-icon">${design.icon}</span>
                            <span class="rarity-badge" style="background: ${rarity.color}">
                                ${rarity.icon} ${rarity.name}
                            </span>
                            ${rarity.foilEffect ? '<div class="foil-effect"></div>' : ''}
                        </div>
                        
                        <div class="card-body">
                            <p class="card-description">${design.description}</p>
                            
                            <div class="card-stats">
                                ${this._generateStatItem('durability', `Diff: ${design.difficulty}`)}
                                ${this._generateStatItem('quantity', `${design.totalDesigns} designs`)}
                                ${this._generateStatItem('xp', `${design.difficulty * 50} XP`)}
                                ${this._generateStatItem('time', `${30 + design.difficulty * 10}m`)}
                            </div>
                            
                            ${design.popularDesigns?.length > 0 ? `
                                <div class="card-tags">
                                    ${design.popularDesigns.slice(0, 3).map(d => 
                                        `<span class="tag">${d}</span>`
                                    ).join('')}
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="card-footer">
                            <span class="card-price">${this.statIcons.cost} ${design.totalDesigns * 10} 💎</span>
                            <span class="card-level">${this.statIcons.level} Lv.${design.unlockLevel}</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Generate card pack opening HTML
     */
    generateCardPack(packType = 'standard', cardCount = 5) {
        const packConfig = {
            standard: { 
                name: 'Standard Pack', 
                cost: 100,
                guaranteedRare: false,
                legendaryBonus: 0
            },
            premium: { 
                name: 'Premium Pack', 
                cost: 500,
                guaranteedRare: true,
                legendaryBonus: 0.02
            },
            legendary: { 
                name: 'Legendary Pack', 
                cost: 2000,
                guaranteedRare: true,
                legendaryBonus: 0.10
            }
        };
        
        const pack = packConfig[packType] || packConfig.standard;
        
        return `
            <div class="card-pack" data-pack-type="${packType}">
                <div class="pack-header">
                    <h3>${pack.name}</h3>
                    <span class="pack-cost">${this.statIcons.cost} ${pack.cost} 💎</span>
                </div>
                <div class="pack-info">
                    <p>Contains ${cardCount} cards</p>
                    ${pack.guaranteedRare ? '<span class="tag rare">✨ Guaranteed Rare+</span>' : ''}
                </div>
                <button class="open-pack-btn">Open Pack</button>
            </div>
        `;
    },

    /**
     * Simulate opening a card pack
     */
    openCardPack(packType = 'standard', availableCards = []) {
        const packConfig = {
            standard: { 
                guaranteedRare: false,
                legendaryBonus: 0
            },
            premium: { 
                guaranteedRare: true,
                legendaryBonus: 0.02
            },
            legendary: { 
                guaranteedRare: true,
                legendaryBonus: 0.10
            }
        };
        
        const pack = packConfig[packType] || packConfig.standard;
        const cards = [];
        const cardCount = 5;
        
        for (let i = 0; i < cardCount; i++) {
            // Apply guaranteed rare for first card if premium/legendary
            const isGuaranteedSlot = i === 0 && pack.guaranteedRare;
            const rarity = this._rollRarity(pack.legendaryBonus, isGuaranteedSlot);
            
            // Select random card of this rarity
            const cardsOfRarity = availableCards.filter(c => c.rarity === rarity);
            if (cardsOfRarity.length > 0) {
                cards.push(cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)]);
            }
        }
        
        return cards;
    },

    /**
     * Roll for rarity
     */
    _rollRarity(legendaryBonus = 0, guaranteedRare = false) {
        const roll = Math.random();
        
        // Adjust rates with bonus
        const rates = {
            legendary: 0.01 + legendaryBonus,
            epic: 0.04,
            rare: 0.15,
            uncommon: 0.30,
            common: 0.50
        };
        
        let cumulative = 0;
        
        for (const [rarity, rate] of Object.entries(rates)) {
            cumulative += rate;
            if (roll <= cumulative) {
                // If guaranteed rare, upgrade common/uncommon
                if (guaranteedRare && (rarity === 'common' || rarity === 'uncommon')) {
                    return 'rare';
                }
                return rarity;
            }
        }
        
        return guaranteedRare ? 'rare' : 'common';
    },

    /**
     * Calculate collection completion percentage
     */
    calculateCollectionProgress(ownedCardIds, allCards) {
        const owned = new Set(ownedCardIds);
        const totalCards = allCards.length;
        const ownedCount = allCards.filter(c => owned.has(c.id)).length;
        
        // Calculate by rarity
        const byRarity = {};
        for (const [rarity] of Object.entries(this.rarityConfig)) {
            const rarityCards = allCards.filter(c => c.rarity === rarity);
            const rarityOwned = rarityCards.filter(c => owned.has(c.id));
            byRarity[rarity] = {
                total: rarityCards.length,
                owned: rarityOwned.length,
                percent: rarityCards.length > 0 ? 
                    Math.round((rarityOwned.length / rarityCards.length) * 100) : 0
            };
        }
        
        return {
            total: totalCards,
            owned: ownedCount,
            percent: Math.round((ownedCount / totalCards) * 100),
            byRarity
        };
    },

    /**
     * Generate collection stats HTML
     */
    generateCollectionStatsHTML(progress) {
        return `
            <div class="collection-stats">
                <div class="overall-progress">
                    <h3>Collection Progress</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percent}%"></div>
                    </div>
                    <span class="progress-text">${progress.owned}/${progress.total} (${progress.percent}%)</span>
                </div>
                
                <div class="rarity-progress">
                    ${Object.entries(progress.byRarity).map(([rarity, data]) => `
                        <div class="rarity-item">
                            <span class="rarity-icon">${this.rarityConfig[rarity].icon}</span>
                            <span class="rarity-name">${this.rarityConfig[rarity].name}</span>
                            <span class="rarity-count">${data.owned}/${data.total}</span>
                            <div class="mini-progress">
                                <div class="mini-fill" style="width: ${data.percent}%; background: ${this.rarityConfig[rarity].color}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Get card styles for injection
     */
    getStyles() {
        return this.cardStyles;
    },

    /**
     * Inject styles into page
     */
    injectStyles() {
        if (!document.getElementById('gembot-card-styles')) {
            const style = document.createElement('style');
            style.id = 'gembot-card-styles';
            style.textContent = this.cardStyles;
            document.head.appendChild(style);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotGameCards;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.GemBotGameCards = GemBotGameCards;
}

console.log('💎 GemBot Game Card System loaded!');
console.log(`🎴 Rarity tiers: ${Object.keys(GemBotGameCards.rarityConfig).length}`);
console.log(`📦 Card types: ${Object.keys(GemBotGameCards.cardTypes).length}`);
