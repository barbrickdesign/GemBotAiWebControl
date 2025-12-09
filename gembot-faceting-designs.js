/**
 * 💎 GemBot Faceting Designs Database
 * Complete library of gemstone cutting patterns from facetdiagrams.org
 * 
 * Data sourced from:
 * - allShapesAndDesigns/ folder (40+ shape categories)
 * - HTML files with cutting angles and index positions
 * - CSV files with design listings
 * 
 * Game Mechanics:
 * - Designs unlock as players progress
 * - Difficulty ratings based on facet count and complexity
 * - Rarity based on design uniqueness
 */

const GemBotFacetingDesigns = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",
    sourceUrl: "http://www.facetdiagrams.org",

    // Shape categories with metadata
    shapeCategories: {
        // ROUND SHAPES
        round: {
            id: "round",
            name: "Round",
            icon: "⭕",
            description: "Classic circular gemstone shapes, most popular for brilliants",
            difficulty: 2,
            unlockLevel: 1,
            totalDesigns: 150,
            popularDesigns: [
                "Round Brilliant", "Portuguese Cut", "Hearts and Arrows Diamond",
                "Ring of Fire", "Chrysanthemum", "Eight Ball"
            ],
            indexGear: 96,
            baseRarity: "common"
        },

        // OVAL SHAPES
        oval: {
            id: "oval",
            name: "Oval",
            icon: "🥚",
            description: "Elegant elongated round shapes",
            difficulty: 3,
            unlockLevel: 3,
            totalDesigns: 85,
            popularDesigns: [
                "Oval Brilliant", "Barion Oval", "Mixed Oval"
            ],
            indexGear: 96,
            baseRarity: "common"
        },

        // SQUARE SHAPES
        square: {
            id: "square",
            name: "Square",
            icon: "⬜",
            description: "Perfect four-sided symmetrical shapes",
            difficulty: 2,
            unlockLevel: 2,
            totalDesigns: 90,
            popularDesigns: [
                "Princess Cut", "Square Brilliant", "Barion Square"
            ],
            indexGear: 96,
            baseRarity: "common"
        },

        // RECTANGLE / EMERALD
        emerald: {
            id: "emerald",
            name: "Emerald",
            icon: "🟩",
            description: "Classic step-cut rectangular shape",
            difficulty: 3,
            unlockLevel: 4,
            totalDesigns: 70,
            popularDesigns: [
                "Emerald Cut", "Baguette", "Step Cut Rectangle"
            ],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        rectangle: {
            id: "rectangle",
            name: "Rectangle",
            icon: "📐",
            description: "Elongated four-sided shapes",
            difficulty: 3,
            unlockLevel: 4,
            totalDesigns: 65,
            popularDesigns: [
                "Rectangle Brilliant", "Long Rectangle Bar"
            ],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        // TRIANGLE SHAPES
        triangle: {
            id: "triangle",
            name: "Triangle",
            icon: "🔺",
            description: "Three-sided geometric brilliance",
            difficulty: 3,
            unlockLevel: 5,
            totalDesigns: 80,
            popularDesigns: [
                "Trillion", "Triangle Brilliant", "Barion Triangle"
            ],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        cushionTriangle: {
            id: "cushionTriangle",
            name: "Cushion Triangle",
            icon: "🔻",
            description: "Softened triangle with rounded corners",
            difficulty: 4,
            unlockLevel: 6,
            totalDesigns: 45,
            popularDesigns: [
                "Cushion Trillion", "Soft Triangle"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        cutCornerTriangle: {
            id: "cutCornerTriangle",
            name: "Cut Corner Triangle",
            icon: "📐",
            description: "Triangle with truncated corners",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 25,
            popularDesigns: [
                "Barion Tri", "Asterisk Illusion"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        // HEXAGON SHAPES
        hexagon: {
            id: "hexagon",
            name: "Hexagon",
            icon: "⬡",
            description: "Six-sided geometric perfection",
            difficulty: 4,
            unlockLevel: 6,
            totalDesigns: 80,
            popularDesigns: [
                "Hexagonal Barion", "Honeycomb", "Evening Star",
                "Excalibur", "Cowichan Snowflake"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        // OCTAGON SHAPES
        octagon: {
            id: "octagon",
            name: "Octagon",
            icon: "🛑",
            description: "Eight-sided balanced shape",
            difficulty: 4,
            unlockLevel: 6,
            totalDesigns: 75,
            popularDesigns: [
                "Octagon Brilliant", "Asscher Cut"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        longOctagon: {
            id: "longOctagon",
            name: "Long Octagon",
            icon: "📏",
            description: "Elongated eight-sided shape",
            difficulty: 5,
            unlockLevel: 8,
            totalDesigns: 30,
            popularDesigns: [
                "Long Octagon Step"
            ],
            indexGear: 96,
            baseRarity: "epic"
        },

        // PENTAGON SHAPES
        pentagon: {
            id: "pentagon",
            name: "Pentagon",
            icon: "⬠",
            description: "Five-sided geometric shape",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 40,
            popularDesigns: [
                "Pentagon Brilliant"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        taperedPentagon: {
            id: "taperedPentagon",
            name: "Tapered Pentagon",
            icon: "🔻",
            description: "Pentagon with tapered base",
            difficulty: 5,
            unlockLevel: 8,
            totalDesigns: 20,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "epic"
        },

        // HEPTAGON
        heptagon: {
            id: "heptagon",
            name: "Heptagon",
            icon: "7️⃣",
            description: "Seven-sided shape - challenging symmetry",
            difficulty: 5,
            unlockLevel: 9,
            totalDesigns: 25,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "epic"
        },

        // NONAGON
        nonagon: {
            id: "nonagon",
            name: "Nonagon",
            icon: "9️⃣",
            description: "Nine-sided advanced shape",
            difficulty: 5,
            unlockLevel: 9,
            totalDesigns: 20,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "epic"
        },

        // DECAGON
        decagon: {
            id: "decagon",
            name: "Decagon",
            icon: "🔟",
            description: "Ten-sided shape approaching circular",
            difficulty: 4,
            unlockLevel: 8,
            totalDesigns: 30,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // UNDECAGON
        undecagon: {
            id: "undecagon",
            name: "Undecagon",
            icon: "1️⃣1️⃣",
            description: "Eleven-sided rare shape",
            difficulty: 6,
            unlockLevel: 10,
            totalDesigns: 10,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "legendary"
        },

        // DODECAGON
        dodecagon: {
            id: "dodecagon",
            name: "Dodecagon",
            icon: "🔷",
            description: "Twelve-sided near-circular shape",
            difficulty: 5,
            unlockLevel: 9,
            totalDesigns: 45,
            popularDesigns: [
                "Atlas", "Catherine", "David"
            ],
            indexGear: 96,
            baseRarity: "epic"
        },

        // HEART
        heart: {
            id: "heart",
            name: "Heart",
            icon: "❤️",
            description: "Romantic heart-shaped gemstone",
            difficulty: 5,
            unlockLevel: 8,
            totalDesigns: 35,
            popularDesigns: [
                "Heart Brilliant", "Valentine"
            ],
            indexGear: 96,
            baseRarity: "epic"
        },

        // PEAR
        pear: {
            id: "pear",
            name: "Pear",
            icon: "🍐",
            description: "Teardrop shape - elegant and timeless",
            difficulty: 4,
            unlockLevel: 6,
            totalDesigns: 55,
            popularDesigns: [
                "Pear Brilliant", "Teardrop"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        // NAVETTE / MARQUISE
        navette: {
            id: "navette",
            name: "Navette/Marquise",
            icon: "🚣",
            description: "Boat-shaped pointed oval",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 40,
            popularDesigns: [
                "Marquise Brilliant"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        navetteOval: {
            id: "navetteOval",
            name: "Navette Oval",
            icon: "⚪",
            description: "Oval with pointed ends",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 20,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // KITE
        kite: {
            id: "kite",
            name: "Kite",
            icon: "🪁",
            description: "Four-sided shape with perpendicular diagonals",
            difficulty: 4,
            unlockLevel: 6,
            totalDesigns: 30,
            popularDesigns: [
                "Kite Brilliant"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        // STAR
        star: {
            id: "star",
            name: "Star",
            icon: "⭐",
            description: "Multi-pointed star shapes",
            difficulty: 5,
            unlockLevel: 9,
            totalDesigns: 15,
            popularDesigns: [
                "Six Pointed Star", "Eight Pointed Star", "Double Star"
            ],
            indexGear: 96,
            baseRarity: "epic"
        },

        // SHIELD
        shield: {
            id: "shield",
            name: "Shield",
            icon: "🛡️",
            description: "Heraldic shield-shaped gems",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 35,
            popularDesigns: [
                "Shield Cut"
            ],
            indexGear: 96,
            baseRarity: "rare"
        },

        // BARREL
        barrel: {
            id: "barrel",
            name: "Barrel",
            icon: "🛢️",
            description: "Curved rectangular barrel shape",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 25,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // CUSHION
        antiqueCushion: {
            id: "antiqueCushion",
            name: "Antique Cushion",
            icon: "🛋️",
            description: "Classic cushion cut with vintage appeal",
            difficulty: 3,
            unlockLevel: 5,
            totalDesigns: 40,
            popularDesigns: [
                "Old Mine Cut", "Antique Cushion Brilliant"
            ],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        sqAntqCushion: {
            id: "sqAntqCushion",
            name: "Square Antique Cushion",
            icon: "🔲",
            description: "Square cushion with rounded corners",
            difficulty: 3,
            unlockLevel: 5,
            totalDesigns: 30,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        // COFFIN
        coffin: {
            id: "coffin",
            name: "Coffin",
            icon: "⚰️",
            description: "Hexagonal coffin-shaped cut",
            difficulty: 4,
            unlockLevel: 8,
            totalDesigns: 20,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // EPAULETTE
        epaulette: {
            id: "epaulette",
            name: "Epaulette",
            icon: "🎖️",
            description: "Military shoulder-badge inspired shape",
            difficulty: 5,
            unlockLevel: 9,
            totalDesigns: 15,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "epic"
        },

        // FAN
        fan: {
            id: "fan",
            name: "Fan",
            icon: "🪭",
            description: "Fan-shaped wedge cut",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 25,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // KEYSTONE
        keystone: {
            id: "keystone",
            name: "Keystone",
            icon: "🔑",
            description: "Architectural keystone shape",
            difficulty: 4,
            unlockLevel: 7,
            totalDesigns: 20,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // LOZENGE / RHOMBOID
        lozenge: {
            id: "lozenge",
            name: "Lozenge",
            icon: "🔷",
            description: "Diamond/lozenge shape",
            difficulty: 3,
            unlockLevel: 5,
            totalDesigns: 25,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        rhomboid: {
            id: "rhomboid",
            name: "Rhomboid",
            icon: "◆",
            description: "Parallelogram diamond shape",
            difficulty: 4,
            unlockLevel: 6,
            totalDesigns: 20,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // TRAPEZE
        trapeze: {
            id: "trapeze",
            name: "Trapeze",
            icon: "🔻",
            description: "Trapezoidal four-sided shape",
            difficulty: 4,
            unlockLevel: 6,
            totalDesigns: 25,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "rare"
        },

        // WHISTLE
        whistle: {
            id: "whistle",
            name: "Whistle",
            icon: "📯",
            description: "Unique whistle-shaped design",
            difficulty: 5,
            unlockLevel: 10,
            totalDesigns: 10,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "legendary"
        },

        // OLD MINE
        oldMine: {
            id: "oldMine",
            name: "Old Mine",
            icon: "⛏️",
            description: "Historic old mine cut style",
            difficulty: 3,
            unlockLevel: 4,
            totalDesigns: 35,
            popularDesigns: [
                "Old Mine Cut", "Vintage Cushion"
            ],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        // CALFS HEAD
        calfsHead: {
            id: "calfsHead",
            name: "Calf's Head",
            icon: "🐄",
            description: "Historic calf's head shape",
            difficulty: 5,
            unlockLevel: 9,
            totalDesigns: 25,
            popularDesigns: [
                "Calf's Head", "Scarab"
            ],
            indexGear: 96,
            baseRarity: "epic"
        },

        // FREEFORM
        freeformLarge: {
            id: "freeformLarge",
            name: "Freeform Large",
            icon: "🎨",
            description: "Large freeform artistic shapes",
            difficulty: 6,
            unlockLevel: 10,
            totalDesigns: 40,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "legendary"
        },

        // SQUARE EMERALD
        sqEmerald: {
            id: "sqEmerald",
            name: "Square Emerald",
            icon: "💎",
            description: "Square step-cut emerald style",
            difficulty: 3,
            unlockLevel: 5,
            totalDesigns: 45,
            popularDesigns: [
                "Asscher Cut"
            ],
            indexGear: 96,
            baseRarity: "uncommon"
        },

        // LONG HEXAGON
        longHexagon: {
            id: "longHexagon",
            name: "Long Hexagon",
            icon: "⬡",
            description: "Elongated hexagonal shape",
            difficulty: 5,
            unlockLevel: 8,
            totalDesigns: 20,
            popularDesigns: [],
            indexGear: 96,
            baseRarity: "epic"
        }
    },

    // Sample design data structure (example from Round Brilliant)
    sampleDesigns: {
        "12-20_round_brilliant": {
            id: "12-20_round_brilliant",
            name: "12-20 Round Brilliant",
            shape: "round",
            sourceFile: "pc01515",
            sourceUrl: "http://www.facetdiagrams.org/database/files/pc01515.html",
            
            // Faceting data
            pavilion: [
                { name: "1", angle: 43.00, indices: "02-08-12-16-22-26-32-36-40-46-50-56-60-64-70-74-80-84-88-94" },
                { name: "g1", angle: 90.00, indices: "02-08-12-16-22-26-32-36-40-46-50-56-60-64-70-74-80-84-88-94" },
                { name: "2", angle: 41.00, indices: "96-10-14-24-34-38-48-58-62-72-82-86" }
            ],
            crown: [
                { name: "1", angle: 39.00, indices: "02-08-12-16-22-26-32-36-40-46-50-56-60-64-70-74-80-84-88-94" },
                { name: "2", angle: 37.00, indices: "96-10-14-24-34-38-48-58-62-72-82-86" },
                { name: "3", angle: 27.00, indices: "96-10-14-24-34-38-48-58-62-72-82-86" },
                { name: "4", angle: 0.00, indices: "Table" }
            ],
            
            // Game data
            gameData: {
                difficulty: 2,
                unlockLevel: 1,
                rarity: "common",
                facetCount: 57,
                estimatedTime: 45, // minutes
                xpReward: 100,
                coinReward: 50,
                materials: ["quartz", "topaz", "amethyst"]
            }
        }
    },

    // Difficulty ratings
    difficultyRatings: {
        1: { name: "Beginner", color: "#4caf50", multiplier: 1.0 },
        2: { name: "Easy", color: "#8bc34a", multiplier: 1.2 },
        3: { name: "Moderate", color: "#ffeb3b", multiplier: 1.5 },
        4: { name: "Advanced", color: "#ff9800", multiplier: 2.0 },
        5: { name: "Expert", color: "#f44336", multiplier: 3.0 },
        6: { name: "Master", color: "#9c27b0", multiplier: 5.0 }
    },

    // Rarity tiers for designs
    designRarity: {
        common: { color: "#9e9e9e", xpMultiplier: 1.0, dropRate: 0.50 },
        uncommon: { color: "#4caf50", xpMultiplier: 1.5, dropRate: 0.30 },
        rare: { color: "#2196f3", xpMultiplier: 2.5, dropRate: 0.15 },
        epic: { color: "#9c27b0", xpMultiplier: 4.0, dropRate: 0.04 },
        legendary: { color: "#ff9800", xpMultiplier: 8.0, dropRate: 0.01 }
    },

    // Material compatibility (which materials work best with which shapes)
    materialCompatibility: {
        quartz: ["round", "oval", "square", "emerald", "hexagon"],
        amethyst: ["round", "oval", "cushionTriangle", "heart", "pear"],
        topaz: ["round", "emerald", "rectangle", "octagon"],
        sapphire: ["round", "oval", "emerald", "cushion"],
        ruby: ["round", "oval", "heart", "pear"],
        emerald: ["emerald", "rectangle", "sqEmerald"],
        diamond: ["round", "princess", "emerald", "heart", "marquise"],
        garnet: ["round", "oval", "cushion", "hexagon"],
        tourmaline: ["rectangle", "emerald", "longOctagon"],
        citrine: ["round", "oval", "emerald", "cushion"],
        peridot: ["round", "oval", "cushion", "rectangle"],
        aquamarine: ["emerald", "rectangle", "oval", "pear"],
        opal: ["round", "oval", "freeformLarge"],
        tanzanite: ["oval", "cushion", "emerald"],
        spinel: ["round", "oval", "cushion", "octagon"]
    },

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Get all shape categories
     */
    getAllCategories() {
        return Object.values(this.shapeCategories);
    },

    /**
     * Get category by ID
     */
    getCategoryById(categoryId) {
        return this.shapeCategories[categoryId];
    },

    /**
     * Get categories by difficulty level
     */
    getCategoriesByDifficulty(difficulty) {
        return this.getAllCategories().filter(cat => cat.difficulty === difficulty);
    },

    /**
     * Get categories by unlock level
     */
    getCategoriesByUnlockLevel(level) {
        return this.getAllCategories().filter(cat => cat.unlockLevel <= level);
    },

    /**
     * Get categories by rarity
     */
    getCategoriesByRarity(rarity) {
        return this.getAllCategories().filter(cat => cat.baseRarity === rarity);
    },

    /**
     * Get total design count across all categories
     */
    getTotalDesignCount() {
        return this.getAllCategories().reduce((total, cat) => total + cat.totalDesigns, 0);
    },

    /**
     * Get compatible materials for a shape
     */
    getCompatibleMaterials(shapeId) {
        const materials = [];
        for (const [material, shapes] of Object.entries(this.materialCompatibility)) {
            if (shapes.includes(shapeId)) {
                materials.push(material);
            }
        }
        return materials;
    },

    /**
     * Calculate XP reward for completing a design
     */
    calculateXPReward(categoryId, designRarity = 'common') {
        const category = this.getCategoryById(categoryId);
        if (!category) return 0;
        
        const difficultyMultiplier = this.difficultyRatings[category.difficulty]?.multiplier || 1;
        const rarityMultiplier = this.designRarity[designRarity]?.xpMultiplier || 1;
        
        return Math.round(100 * difficultyMultiplier * rarityMultiplier);
    },

    /**
     * Calculate estimated cutting time
     */
    calculateCuttingTime(categoryId, facetCount = 50) {
        const category = this.getCategoryById(categoryId);
        if (!category) return 30;
        
        const baseTime = 30; // minutes
        const difficultyBonus = category.difficulty * 10;
        const facetBonus = Math.floor(facetCount / 10) * 5;
        
        return baseTime + difficultyBonus + facetBonus;
    },

    /**
     * Get random design from a category
     */
    getRandomDesignFromCategory(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category || !category.popularDesigns.length) return null;
        
        return category.popularDesigns[
            Math.floor(Math.random() * category.popularDesigns.length)
        ];
    },

    /**
     * Check if player can access a category
     */
    canAccessCategory(categoryId, playerLevel) {
        const category = this.getCategoryById(categoryId);
        return category && playerLevel >= category.unlockLevel;
    },

    /**
     * Parse index string to array
     */
    parseIndices(indexString) {
        if (indexString === "Table") return ["Table"];
        return indexString.split('-').map(idx => parseInt(idx));
    },

    /**
     * Generate category card HTML
     */
    generateCategoryCardHTML(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category) return '';
        
        const rarityColor = this.designRarity[category.baseRarity]?.color || '#9e9e9e';
        const difficultyInfo = this.difficultyRatings[category.difficulty];
        
        return `
            <div class="category-card" style="border-color: ${rarityColor}">
                <div class="category-header">
                    <span class="category-icon">${category.icon}</span>
                    <span class="category-name">${category.name}</span>
                </div>
                <div class="category-body">
                    <p class="category-description">${category.description}</p>
                    <div class="category-stats">
                        <span class="stat">📊 Designs: ${category.totalDesigns}</span>
                        <span class="stat" style="color: ${difficultyInfo?.color}">⚔️ ${difficultyInfo?.name}</span>
                        <span class="stat">🔓 Level ${category.unlockLevel}</span>
                    </div>
                    ${category.popularDesigns.length > 0 ? `
                        <div class="popular-designs">
                            <span class="label">Popular:</span>
                            ${category.popularDesigns.slice(0, 3).join(', ')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Get progression path for new players
     */
    getProgressionPath() {
        return this.getAllCategories()
            .sort((a, b) => a.unlockLevel - b.unlockLevel)
            .map(cat => ({
                level: cat.unlockLevel,
                categoryId: cat.id,
                name: cat.name,
                icon: cat.icon,
                difficulty: cat.difficulty
            }));
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotFacetingDesigns;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.GemBotFacetingDesigns = GemBotFacetingDesigns;
}

console.log('💎 GemBot Faceting Designs Database loaded!');
console.log(`📁 Shape categories: ${Object.keys(GemBotFacetingDesigns.shapeCategories).length}`);
console.log(`📊 Total designs: ${GemBotFacetingDesigns.getTotalDesignCount()}`);
