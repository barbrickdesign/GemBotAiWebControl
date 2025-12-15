/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌟 GemBot Fantasy Marketplace - Premium Gemstone Trading System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * INTEGRATIONS:
 * - Fantasy Gemstones (fantasygemstones.com) - Nick Alexander's Fantasy Cuts
 * - Rio Grande (riogrande.com) - Base metals & gemstone pricing
 * - Earth Art Gems (earthartgems.com) - Austin's Custom Jewelry
 * 
 * FEATURES:
 * - Fantasy Cut recuts (upgrade regular cuts to fantasy cuts for 10x value)
 * - Custom ring orders (forged ring blank + fantasy stone → Austin custom piece)
 * - Live metal pricing from Rio Grande
 * - 25% crypto transaction fee on all purchases
 * - Real-time price conversion to $GBUV tokens
 * 
 * TOKEN: DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump
 * NAME: Gem Bot Universe Vault ($GBUV)
 * 
 * COPYRIGHT © 2024-2025 Ryan Barbrick / Barbrick Design
 * Creator: Ryan Barbrick | Contact: BarbrickDesign@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const FantasyMarketplace = {
    version: "2.0.0",
    initialized: false,
    
    // === CONFIGURATION ===
    config: {
        // Crypto settings
        tokenAddress: "DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump",
        tokenSymbol: "$GBUV",
        tokenName: "Gem Bot Universe Vault",
        tokenDecimals: 9,
        
        // 25% crypto transaction fee
        cryptoFeePercent: 0.25,
        
        // Price conversions
        usdToToken: 100, // 1 USD = 100 $GBUV
        
        // Data sources
        sources: {
            fantasyGemstones: "https://fantasygemstones.com",
            rioGrande: "https://www.riogrande.com",
            earthArtGems: "https://earthartgems.com"
        },
        
        // Sync settings
        syncInterval: 300000, // 5 minutes
        lastPriceUpdate: null
    },
    
    // === LIVE METAL PRICES (from Rio Grande) ===
    metalPrices: {
        // Updated from Rio Grande homepage - live prices
        silver: {
            name: "Sterling Silver",
            symbol: "🥈",
            pricePerOz: 64.51, // Live from Rio Grande
            pricePerGram: 2.07,
            lastUpdate: null
        },
        gold: {
            name: "14k Gold",
            symbol: "🥇",
            pricePerOz: 4346.95, // Live from Rio Grande (24k, adjusted for 14k)
            pricePerGram: 81.62, // 14k = ~58% of 24k
            lastUpdate: null
        },
        roseGold: {
            name: "14k Rose Gold",
            symbol: "🌹",
            pricePerOz: 4346.95,
            pricePerGram: 83.25, // Slight premium
            lastUpdate: null
        },
        platinum: {
            name: "Platinum",
            symbol: "⚪",
            pricePerOz: 1774.00,
            pricePerGram: 57.03,
            lastUpdate: null
        },
        palladium: {
            name: "Palladium",
            symbol: "💿",
            pricePerOz: 1536.00,
            pricePerGram: 49.38,
            lastUpdate: null
        }
    },
    
    // === FANTASY GEMSTONES CATALOG ===
    // Nick Alexander's Award-Winning Fantasy Cuts (AGTA Spectrum Winner)
    fantasyCatalog: {
        items: [],
        collections: ['fantasy-gemstones', 'faceted-gemstones', 'cabochons', 'carvings'],
        lastSync: null,
        
        // Pre-loaded from fantasygemstones.com
        rawData: [
            // Fantasy Cut Gemstones (46 products)
            { name: "Sunstone - 29.90cts", price: 18000.00, type: "fantasy", carats: 29.90, material: "Sunstone", url: "https://fantasygemstones.com/products/sunstone" },
            { name: "Oregon Sunstone - 25.55cts", price: 11250.00, type: "fantasy", carats: 25.55, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-25-55cts" },
            { name: "Amethyst - 18.90cts", price: 2250.00, type: "fantasy", carats: 18.90, material: "Amethyst", url: "https://fantasygemstones.com/products/amethyst-18-90cts" },
            { name: "Oregon Sunstone - 37.65cts", price: 9600.00, type: "fantasy", carats: 37.65, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-37-65cts" },
            { name: "Oregon Sunstone - 10.75cts", price: 8250.00, type: "fantasy", carats: 10.75, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-10-75cts" },
            { name: "Praseolite - 45.97cts", price: 6210.00, type: "fantasy", carats: 45.97, material: "Praseolite", url: "https://fantasygemstones.com/products/praseolite-45-97cts" },
            { name: "Oregon Sunstone - 15.80cts", price: 6000.00, type: "fantasy", carats: 15.80, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-15-80cts" },
            { name: "Oregon Sunstone - 15.30cts", price: 3450.00, type: "fantasy", carats: 15.30, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-15-30cts" },
            { name: "Amethyst - 15.40cts", price: 1500.00, type: "fantasy", carats: 15.40, material: "Amethyst", url: "https://fantasygemstones.com/products/amethyst-15-40cts" },
            { name: "Green Tourmaline - 37.74cts", price: 3000.00, type: "fantasy", carats: 37.74, material: "Tourmaline", url: "https://fantasygemstones.com/products/green-tourmaline-37-74cts" },
            { name: "Tourmalated Quartz - 77.70cts", price: 3000.00, type: "fantasy", carats: 77.70, material: "Quartz", url: "https://fantasygemstones.com/products/tourmalated-quartz-77-70cts" },
            { name: "Rutilated Quartz - 31.55cts", price: 2840.00, type: "fantasy", carats: 31.55, material: "Quartz", url: "https://fantasygemstones.com/products/rutilated-quartz-31-55cts" },
            { name: "Praseolite - 20.88cts", price: 1875.00, type: "fantasy", carats: 20.88, material: "Praseolite", url: "https://fantasygemstones.com/products/praseolite-20-88cts" },
            { name: "Rutilated Quartz - 114.25cts", price: 5140.00, type: "fantasy", carats: 114.25, material: "Quartz", url: "https://fantasygemstones.com/products/rutilated-quartz-114-25cts" },
            { name: "Lemon Quartz - 5.70cts", price: 900.00, type: "fantasy", carats: 5.70, material: "Quartz", url: "https://fantasygemstones.com/products/lemon-quartz-5-70cts" },
            { name: "Lavender Quartz - 7.99cts", price: 720.00, type: "fantasy", carats: 7.99, material: "Quartz", url: "https://fantasygemstones.com/products/lavender-quartz-7-99cts" },
            { name: "Rose Quartz - 14.89cts", price: 670.00, type: "fantasy", carats: 14.89, material: "Quartz", url: "https://fantasygemstones.com/products/rose-quartz-14-89cts" },
            { name: "Topaz - 10cts", price: 1182.00, type: "fantasy", carats: 10.00, material: "Topaz", url: "https://fantasygemstones.com/products/topaz" },
            { name: "Sunstone - 13.85cts", price: 4155.00, type: "fantasy", carats: 13.85, material: "Sunstone", url: "https://fantasygemstones.com/products/sunstone-13-85cts" },
            { name: "Smokey Citrine - 13.95cts", price: 1470.00, type: "fantasy", carats: 13.95, material: "Citrine", url: "https://fantasygemstones.com/products/smokey-citrine-13-95cts" },
            { name: "Rose Quartz - 20.80cts", price: 2496.00, type: "fantasy", carats: 20.80, material: "Quartz", url: "https://fantasygemstones.com/products/rose-quartz-20-80cts" },
            { name: "Rutilated Quartz - 16.65cts", price: 1747.00, type: "fantasy", carats: 16.65, material: "Quartz", url: "https://fantasygemstones.com/products/rutilated-quartz" },
            { name: "Citrine - 26.70cts", price: 3186.00, type: "fantasy", carats: 26.70, material: "Citrine", url: "https://fantasygemstones.com/products/citrine-6" },
            { name: "Praseolite - 13.94cts", price: 1254.00, type: "fantasy", carats: 13.94, material: "Praseolite", url: "https://fantasygemstones.com/products/praseolite-1" },
            
            // Faceted Gemstones (14 products)
            { name: "Garnet Set - 3.45cts", price: 310.00, type: "faceted", carats: 3.45, material: "Garnet", url: "https://fantasygemstones.com/products/garnet-set-3-45cts" },
            { name: "Oregon Sunstone - 15.6cts", price: 1350.00, type: "faceted", carats: 15.60, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-15-6cts" },
            { name: "Aquamarine - 9cts", price: 4860.00, type: "faceted", carats: 9.00, material: "Aquamarine", url: "https://fantasygemstones.com/products/aquamarine-9cts" },
            { name: "Oregon Sunstone - 15.3cts", price: 9180.00, type: "faceted", carats: 15.30, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-15-3cts" },
            { name: "Oregon Sunstone - 15.05cts", price: 4500.00, type: "faceted", carats: 15.05, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-15-05cts" },
            { name: "Bicolor Smokey Citrine - 39.45cts", price: 750.00, type: "faceted", carats: 39.45, material: "Citrine", url: "https://fantasygemstones.com/products/bicolor-smokey-citrine-39-45cts" },
            { name: "Oregon Sunstone - 7.04cts", price: 1470.00, type: "faceted", carats: 7.04, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-7-04cts" },
            { name: "Tourmaline - 1.66cts", price: 375.00, type: "faceted", carats: 1.66, material: "Tourmaline", url: "https://fantasygemstones.com/products/tourmaline-1-66cts" },
            { name: "Verde Quartz Set - 20.05cts", price: 1800.00, type: "faceted", carats: 20.05, material: "Quartz", url: "https://fantasygemstones.com/products/verde-quartz-set-20-05cts" },
            { name: "Pakistan Peridot - 12.21cts", price: 2160.00, type: "faceted", carats: 12.21, material: "Peridot", url: "https://fantasygemstones.com/products/pakistan-peridot-12-21cts" },
            { name: "Oregon Sunstone - 6.28cts", price: 2700.00, type: "faceted", carats: 6.28, material: "Oregon Sunstone", url: "https://fantasygemstones.com/products/oregon-sunstone-6-28cts" },
            { name: "Sunstone - 7.42cts", price: 2226.00, type: "faceted", carats: 7.42, material: "Sunstone", url: "https://fantasygemstones.com/products/sunstone-7-42cts" },
            { name: "Apatite Set - 2.14cts", price: 375.00, type: "faceted", carats: 2.14, material: "Apatite", url: "https://fantasygemstones.com/products/apatite-set-2-14cts" },
            { name: "African Aquamarine - 2.49cts", price: 2850.00, type: "faceted", carats: 2.49, material: "Aquamarine", url: "https://fantasygemstones.com/products/african-aquamarine" },
            
            // Carvings & Cabochons
            { name: "Australian Agate - 28.20cts", price: 1500.00, type: "carving", carats: 28.20, material: "Agate", url: "https://fantasygemstones.com/products/australian-agate-28-20cts" },
            { name: "Australian Agate - 36.60cts", price: 1800.00, type: "carving", carats: 36.60, material: "Agate", url: "https://fantasygemstones.com/products/australian-agate-36-60cts" },
            { name: "Elisa Turquoise - 15.25cts", price: 1050.00, type: "carving", carats: 15.25, material: "Turquoise", url: "https://fantasygemstones.com/products/elisa-turquoise-15-25cts" },
            { name: "Elisa Turquoise - 10.65cts", price: 600.00, type: "carving", carats: 10.65, material: "Turquoise", url: "https://fantasygemstones.com/products/elisa-turquoise-10-65cts" },
            { name: "Elisa Turquoise - 19.25cts", price: 1050.00, type: "carving", carats: 19.25, material: "Turquoise", url: "https://fantasygemstones.com/products/elisa-turquoise-19-25cts" },
            { name: "Elisa Turquoise - 17.65cts", price: 1050.00, type: "carving", carats: 17.65, material: "Turquoise", url: "https://fantasygemstones.com/products/elisa-turquoise-17-65cts" },
            { name: "Elisa Turquoise - 29.50cts", price: 1500.00, type: "carving", carats: 29.50, material: "Turquoise", url: "https://fantasygemstones.com/products/elisa-turquoise-29-50cts" },
            { name: "Elisa Turquoise - 10.55cts", price: 600.00, type: "carving", carats: 10.55, material: "Turquoise", url: "https://fantasygemstones.com/products/elisa-turquoise-10-55ctss" }
        ]
    },
    
    // === RIO GRANDE BASE GEMSTONE PRICING ===
    // Base prices per carat for common gemstones (wholesale pricing)
    baseGemPricing: {
        // Precious stones
        diamond: { pricePerCarat: 5000.00, rarity: "precious", hardness: 10 },
        ruby: { pricePerCarat: 3000.00, rarity: "precious", hardness: 9 },
        sapphire: { pricePerCarat: 2500.00, rarity: "precious", hardness: 9 },
        emerald: { pricePerCarat: 2000.00, rarity: "precious", hardness: 7.5 },
        
        // Semi-precious
        aquamarine: { pricePerCarat: 350.00, rarity: "semi-precious", hardness: 7.5 },
        tanzanite: { pricePerCarat: 600.00, rarity: "semi-precious", hardness: 6.5 },
        alexandrite: { pricePerCarat: 15000.00, rarity: "rare", hardness: 8.5 },
        tourmaline: { pricePerCarat: 150.00, rarity: "semi-precious", hardness: 7 },
        peridot: { pricePerCarat: 100.00, rarity: "semi-precious", hardness: 6.5 },
        topaz: { pricePerCarat: 75.00, rarity: "semi-precious", hardness: 8 },
        garnet: { pricePerCarat: 50.00, rarity: "common", hardness: 7 },
        amethyst: { pricePerCarat: 25.00, rarity: "common", hardness: 7 },
        citrine: { pricePerCarat: 20.00, rarity: "common", hardness: 7 },
        
        // Oregon Sunstone (specialty)
        "oregon sunstone": { pricePerCarat: 300.00, rarity: "rare", hardness: 6.5 },
        sunstone: { pricePerCarat: 200.00, rarity: "semi-precious", hardness: 6.5 },
        
        // Quartz varieties
        quartz: { pricePerCarat: 10.00, rarity: "common", hardness: 7 },
        "rose quartz": { pricePerCarat: 15.00, rarity: "common", hardness: 7 },
        "smoky quartz": { pricePerCarat: 12.00, rarity: "common", hardness: 7 },
        "rutilated quartz": { pricePerCarat: 25.00, rarity: "common", hardness: 7 },
        praseolite: { pricePerCarat: 20.00, rarity: "common", hardness: 7 },
        
        // Other
        opal: { pricePerCarat: 100.00, rarity: "semi-precious", hardness: 5.5 },
        turquoise: { pricePerCarat: 50.00, rarity: "semi-precious", hardness: 6 },
        agate: { pricePerCarat: 10.00, rarity: "common", hardness: 7 },
        jasper: { pricePerCarat: 8.00, rarity: "common", hardness: 7 },
        lapis: { pricePerCarat: 30.00, rarity: "semi-precious", hardness: 5.5 }
    },
    
    // === PLAYER INVENTORY ===
    inventory: {
        // Metals owned
        metals: {
            gold: 0,
            roseGold: 0,
            silver: 0,
            platinum: 0,
            palladium: 0
        },
        
        // Cut gemstones (from gameplay)
        cutGems: [],
        
        // Fantasy cut stones (upgraded/purchased)
        fantasyGems: [],
        
        // Forged ring blanks
        ringBlanks: [],
        
        // Completed custom orders
        customOrders: [],
        
        // Tokens
        tokenBalance: 0
    },
    
    // === CUSTOM ORDER SYSTEM ===
    // Combine forged ring blank + fantasy stone → Austin custom piece
    customOrders: {
        pending: [],
        completed: [],
        
        // Austin's crafting fee (in addition to materials)
        craftingFeeBase: 150.00, // USD
        
        // Time estimates
        estimatedDays: {
            simple: 14,
            moderate: 21,
            complex: 30
        }
    },
    
    // === INITIALIZATION ===
    async init() {
        if (this.initialized) {
            console.log('⚠️ Fantasy Marketplace already initialized');
            return this;
        }
        
        console.log('🌟 Initializing Fantasy Marketplace v2.0...');
        
        // Load saved state
        this.loadState();
        
        // Process fantasy catalog
        this.processFantasyCatalog();
        
        // Update metal prices
        await this.updateMetalPrices();
        
        // Start price sync
        this.startPriceSync();
        
        // Register with Merlin
        this.registerWithMerlin();
        
        this.initialized = true;
        console.log('✅ Fantasy Marketplace initialized');
        console.log(`   📦 ${this.fantasyCatalog.items.length} fantasy gemstones available`);
        console.log(`   💰 25% crypto fee applied to all transactions`);
        
        return this;
    },
    
    // === CATALOG PROCESSING ===
    processFantasyCatalog() {
        this.fantasyCatalog.items = this.fantasyCatalog.rawData.map((item, index) => {
            const basePrice = item.price;
            const cryptoFee = basePrice * this.config.cryptoFeePercent;
            const totalPrice = basePrice + cryptoFee;
            
            return {
                id: `fantasy_${index}_${Date.now()}`,
                source: 'fantasygemstones',
                
                // Basic info
                name: item.name,
                material: item.material,
                carats: item.carats,
                type: item.type, // fantasy, faceted, carving, cabochon
                url: item.url,
                
                // Nick Alexander is 2x AGTA Spectrum Award Winner
                artist: "Nick Alexander",
                awards: ["AGTA Spectrum 2019", "AGTA Spectrum 2022"],
                
                // Pricing with 25% crypto fee
                basePriceUSD: basePrice,
                cryptoFeeUSD: cryptoFee,
                totalPriceUSD: totalPrice,
                priceTokens: this.usdToTokens(totalPrice),
                
                // Per-carat pricing
                pricePerCarat: basePrice / item.carats,
                
                // Fantasy cut multiplier (compared to base stone)
                fantasyMultiplier: this.calculateFantasyMultiplier(item),
                
                // Availability
                available: true,
                inStock: 1
            };
        });
        
        this.fantasyCatalog.lastSync = Date.now();
    },
    
    calculateFantasyMultiplier(item) {
        // Fantasy cuts are worth significantly more than base cuts
        const baseMaterial = item.material.toLowerCase();
        const basePrice = this.baseGemPricing[baseMaterial]?.pricePerCarat || 10;
        const fantasyCostPerCarat = item.price / item.carats;
        
        return Math.round((fantasyCostPerCarat / basePrice) * 10) / 10;
    },
    
    // === PRICE UTILITIES ===
    usdToTokens(usd) {
        return Math.ceil(usd * this.config.usdToToken);
    },
    
    tokensToUsd(tokens) {
        return tokens / this.config.usdToToken;
    },
    
    applyeCryptoFee(usdAmount) {
        return usdAmount * (1 + this.config.cryptoFeePercent);
    },
    
    formatPrice(usd, includeTokens = true) {
        const formatted = `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (includeTokens) {
            return `${formatted} (${this.usdToTokens(usd).toLocaleString()} ${this.config.tokenSymbol})`;
        }
        return formatted;
    },
    
    // === METAL PRICING (Rio Grande Live) ===
    async updateMetalPrices() {
        console.log('📊 Updating metal prices from Rio Grande...');
        
        // In production, this would fetch from Rio Grande's API
        // Current prices from riogrande.com (as of fetch):
        // Silver $64.51 | Gold $4,346.95 | Platinum $1,774.00 | Palladium $1,536.00
        
        const now = Date.now();
        
        // Update timestamps
        Object.keys(this.metalPrices).forEach(metal => {
            this.metalPrices[metal].lastUpdate = now;
        });
        
        // Calculate per-gram from per-oz (31.1035 grams per troy ounce)
        const ozToGram = 31.1035;
        
        this.metalPrices.silver.pricePerGram = this.metalPrices.silver.pricePerOz / ozToGram;
        this.metalPrices.gold.pricePerGram = (this.metalPrices.gold.pricePerOz * 0.585) / ozToGram; // 14k = 58.5% pure
        this.metalPrices.roseGold.pricePerGram = (this.metalPrices.roseGold.pricePerOz * 0.585) / ozToGram;
        this.metalPrices.platinum.pricePerGram = this.metalPrices.platinum.pricePerOz / ozToGram;
        this.metalPrices.palladium.pricePerGram = this.metalPrices.palladium.pricePerOz / ozToGram;
        
        this.config.lastPriceUpdate = now;
        this.saveState();
        
        console.log('✅ Metal prices updated');
        return this.metalPrices;
    },
    
    getMetalPrice(metalType, grams = 1) {
        const metal = this.metalPrices[metalType];
        if (!metal) return null;
        
        const basePrice = metal.pricePerGram * grams;
        const withFee = this.applyeCryptoFee(basePrice);
        
        return {
            metal: metal.name,
            grams: grams,
            basePriceUSD: basePrice,
            cryptoFeeUSD: withFee - basePrice,
            totalPriceUSD: withFee,
            priceTokens: this.usdToTokens(withFee)
        };
    },
    
    // === FANTASY CUT RECUT SYSTEM ===
    /**
     * Calculate the cost and value increase of recutting a regular cut stone
     * into a fantasy cut (sent to Nick Alexander)
     */
    calculateRecutCost(stone) {
        const baseValue = this.calculateStoneValue(stone);
        
        // Nick Alexander's recutting service fee
        // Based on stone size and complexity
        const baseFee = 250.00; // Starting price
        const perCaratFee = 50.00;
        const complexityMultiplier = stone.hardness > 7 ? 1.5 : 1.0;
        
        const recutFee = (baseFee + (stone.carats * perCaratFee)) * complexityMultiplier;
        const recutFeeWithCrypto = this.applyeCryptoFee(recutFee);
        
        // Expected value increase (fantasy cuts are typically 5-15x base value)
        const fantasyMultiplier = 8; // Average increase
        const newValue = baseValue * fantasyMultiplier;
        
        return {
            originalStone: stone,
            originalValue: baseValue,
            recutFeeUSD: recutFee,
            recutFeeWithCryptoUSD: recutFeeWithCrypto,
            recutFeeTokens: this.usdToTokens(recutFeeWithCrypto),
            estimatedNewValue: newValue,
            valueIncrease: newValue - baseValue,
            roi: ((newValue - baseValue - recutFeeWithCrypto) / recutFeeWithCrypto * 100).toFixed(1) + '%',
            estimatedDays: 14, // Nick typically takes 2 weeks
            artist: "Nick Alexander (AGTA Spectrum Winner)"
        };
    },
    
    /**
     * Submit a stone for fantasy recutting
     */
    async submitForRecut(stoneId) {
        const stoneIndex = this.inventory.cutGems.findIndex(s => s.id === stoneId);
        if (stoneIndex === -1) {
            return { success: false, error: 'Stone not found in inventory' };
        }
        
        const stone = this.inventory.cutGems[stoneIndex];
        const recutInfo = this.calculateRecutCost(stone);
        
        // Check token balance
        if (this.inventory.tokenBalance < recutInfo.recutFeeTokens) {
            return {
                success: false,
                error: `Insufficient ${this.config.tokenSymbol}. Need ${recutInfo.recutFeeTokens}, have ${this.inventory.tokenBalance}`
            };
        }
        
        // Deduct fee
        this.inventory.tokenBalance -= recutInfo.recutFeeTokens;
        
        // Remove from cut gems
        this.inventory.cutGems.splice(stoneIndex, 1);
        
        // Create pending recut order
        const order = {
            id: `recut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            originalStone: stone,
            status: 'submitted',
            submittedAt: Date.now(),
            estimatedCompletion: Date.now() + (14 * 24 * 60 * 60 * 1000), // 14 days
            feePaid: recutInfo.recutFeeTokens,
            artist: "Nick Alexander"
        };
        
        // In production, this would notify the fulfillment system
        console.log('💎 Recut order submitted to Nick Alexander');
        
        this.saveState();
        
        return {
            success: true,
            order: order,
            message: `Stone submitted to Nick Alexander for fantasy recutting! Estimated completion: 14 days.`
        };
    },
    
    // === CUSTOM RING ORDER SYSTEM ===
    /**
     * Calculate custom ring order (forged ring blank + fantasy stone → Austin custom piece)
     */
    calculateCustomOrder(ringBlankId, fantasyGemId) {
        const ringBlank = this.inventory.ringBlanks.find(r => r.id === ringBlankId);
        const fantasyGem = this.inventory.fantasyGems.find(g => g.id === fantasyGemId);
        
        if (!ringBlank || !fantasyGem) {
            return { error: 'Ring blank or fantasy gem not found' };
        }
        
        // Austin's base crafting fee
        const baseCraftingFee = this.customOrders.craftingFeeBase;
        
        // Complexity adjustment based on gem size and ring style
        const complexityMultiplier = fantasyGem.carats > 10 ? 1.5 : (fantasyGem.carats > 5 ? 1.25 : 1.0);
        
        const craftingFee = baseCraftingFee * complexityMultiplier;
        const craftingFeeWithCrypto = this.applyeCryptoFee(craftingFee);
        
        // Total value of completed piece
        const materialValue = ringBlank.metalValue + fantasyGem.value;
        const totalValue = materialValue + craftingFee;
        const totalWithCrypto = materialValue + craftingFeeWithCrypto;
        
        // Estimate days based on complexity
        let estimatedDays = this.customOrders.estimatedDays.simple;
        if (fantasyGem.carats > 10 || ringBlank.complexity === 'complex') {
            estimatedDays = this.customOrders.estimatedDays.complex;
        } else if (fantasyGem.carats > 5 || ringBlank.complexity === 'moderate') {
            estimatedDays = this.customOrders.estimatedDays.moderate;
        }
        
        return {
            ringBlank: ringBlank,
            fantasyGem: fantasyGem,
            craftingFeeUSD: craftingFee,
            craftingFeeWithCryptoUSD: craftingFeeWithCrypto,
            craftingFeeTokens: this.usdToTokens(craftingFeeWithCrypto),
            materialValueUSD: materialValue,
            totalValueUSD: totalWithCrypto,
            totalTokens: this.usdToTokens(totalWithCrypto),
            estimatedDays: estimatedDays,
            jeweler: "Austin (Earth Art Gems)",
            description: `Custom ${ringBlank.metalType} ring featuring ${fantasyGem.name} by Nick Alexander, set by Austin`
        };
    },
    
    /**
     * Submit custom ring order to Austin
     */
    async submitCustomOrder(ringBlankId, fantasyGemId, shippingInfo) {
        const orderCalc = this.calculateCustomOrder(ringBlankId, fantasyGemId);
        
        if (orderCalc.error) {
            return { success: false, error: orderCalc.error };
        }
        
        // Validate shipping
        if (!shippingInfo || !shippingInfo.name || !shippingInfo.address) {
            return { success: false, error: 'Complete shipping information required' };
        }
        
        // Check token balance
        if (this.inventory.tokenBalance < orderCalc.craftingFeeTokens) {
            return {
                success: false,
                error: `Insufficient ${this.config.tokenSymbol}. Need ${orderCalc.craftingFeeTokens} for crafting fee.`
            };
        }
        
        // Deduct crafting fee
        this.inventory.tokenBalance -= orderCalc.craftingFeeTokens;
        
        // Remove ring blank and fantasy gem from inventory
        const ringIndex = this.inventory.ringBlanks.findIndex(r => r.id === ringBlankId);
        const gemIndex = this.inventory.fantasyGems.findIndex(g => g.id === fantasyGemId);
        
        if (ringIndex >= 0) this.inventory.ringBlanks.splice(ringIndex, 1);
        if (gemIndex >= 0) this.inventory.fantasyGems.splice(gemIndex, 1);
        
        // Create order
        const order = {
            id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'custom_ring',
            ringBlank: orderCalc.ringBlank,
            fantasyGem: orderCalc.fantasyGem,
            description: orderCalc.description,
            craftingFeePaid: orderCalc.craftingFeeTokens,
            totalValue: orderCalc.totalValueUSD,
            status: 'pending',
            submittedAt: Date.now(),
            estimatedCompletion: Date.now() + (orderCalc.estimatedDays * 24 * 60 * 60 * 1000),
            shippingInfo: shippingInfo,
            jeweler: "Austin (Earth Art Gems)",
            stoneArtist: "Nick Alexander"
        };
        
        this.customOrders.pending.push(order);
        this.saveState();
        
        // In production, this triggers notification to Ryan to coordinate
        console.log('💍 Custom order submitted!');
        console.log('   Ring blank + Fantasy stone will be shipped to Austin for setting');
        
        return {
            success: true,
            order: order,
            message: `Custom ring order submitted! Austin at Earth Art Gems will create your piece. Estimated: ${orderCalc.estimatedDays} days.`,
            note: "Ryan will facilitate getting your fantasy cut stone to Austin for the custom setting."
        };
    },
    
    // === STONE VALUE CALCULATION ===
    calculateStoneValue(stone) {
        const material = stone.material?.toLowerCase() || 'quartz';
        const basePrice = this.baseGemPricing[material]?.pricePerCarat || 10;
        
        let value = basePrice * stone.carats;
        
        // Quality multiplier
        if (stone.quality) {
            value *= (stone.quality / 100);
        }
        
        // Cut quality bonus
        if (stone.cutQuality === 'excellent') value *= 1.5;
        else if (stone.cutQuality === 'good') value *= 1.2;
        
        return value;
    },
    
    // === METAL PURCHASES ===
    buyMetal(metalType, grams) {
        const priceInfo = this.getMetalPrice(metalType, grams);
        if (!priceInfo) {
            return { success: false, error: 'Invalid metal type' };
        }
        
        if (this.inventory.tokenBalance < priceInfo.priceTokens) {
            return {
                success: false,
                error: `Insufficient ${this.config.tokenSymbol}. Need ${priceInfo.priceTokens}, have ${this.inventory.tokenBalance}`
            };
        }
        
        // Deduct tokens
        this.inventory.tokenBalance -= priceInfo.priceTokens;
        
        // Add metal
        this.inventory.metals[metalType] = (this.inventory.metals[metalType] || 0) + grams;
        
        this.saveState();
        
        return {
            success: true,
            purchased: priceInfo,
            newBalance: this.inventory.metals[metalType],
            message: `Purchased ${grams}g of ${priceInfo.metal} for ${priceInfo.priceTokens} ${this.config.tokenSymbol}`
        };
    },
    
    // === FANTASY GEM PURCHASES ===
    buyFantasyGem(itemId) {
        const item = this.fantasyCatalog.items.find(i => i.id === itemId);
        if (!item) {
            return { success: false, error: 'Fantasy gem not found' };
        }
        
        if (!item.available || item.inStock < 1) {
            return { success: false, error: 'Item not available' };
        }
        
        if (this.inventory.tokenBalance < item.priceTokens) {
            return {
                success: false,
                error: `Insufficient ${this.config.tokenSymbol}. Need ${item.priceTokens}, have ${this.inventory.tokenBalance}`
            };
        }
        
        // Deduct tokens
        this.inventory.tokenBalance -= item.priceTokens;
        item.inStock--;
        
        // Add to inventory
        const purchasedGem = {
            id: `fgem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            originalItemId: itemId,
            name: item.name,
            material: item.material,
            carats: item.carats,
            type: item.type,
            artist: item.artist,
            value: item.totalPriceUSD,
            purchasedAt: Date.now(),
            url: item.url
        };
        
        this.inventory.fantasyGems.push(purchasedGem);
        this.saveState();
        
        return {
            success: true,
            gem: purchasedGem,
            message: `Purchased ${item.name} by ${item.artist}!`
        };
    },
    
    // === RING BLANK FORGING ===
    forgeRingBlank(metalType, grams, style = 'simple') {
        const metal = this.metalPrices[metalType];
        if (!metal) {
            return { success: false, error: 'Invalid metal type' };
        }
        
        if ((this.inventory.metals[metalType] || 0) < grams) {
            return {
                success: false,
                error: `Insufficient ${metal.name}. Need ${grams}g, have ${this.inventory.metals[metalType] || 0}g`
            };
        }
        
        // Deduct metal
        this.inventory.metals[metalType] -= grams;
        
        // Calculate value
        const metalValue = metal.pricePerGram * grams;
        
        // Create ring blank
        const ringBlank = {
            id: `blank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            metalType: metal.name,
            grams: grams,
            style: style,
            complexity: style === 'ornate' ? 'complex' : (style === 'detailed' ? 'moderate' : 'simple'),
            metalValue: metalValue,
            forgedAt: Date.now()
        };
        
        this.inventory.ringBlanks.push(ringBlank);
        this.saveState();
        
        return {
            success: true,
            ringBlank: ringBlank,
            message: `Forged ${style} ${metal.name} ring blank (${grams}g)`
        };
    },
    
    // === STATE MANAGEMENT ===
    saveState() {
        const state = {
            version: this.version,
            config: this.config,
            metalPrices: this.metalPrices,
            inventory: this.inventory,
            customOrders: this.customOrders,
            fantasyCatalog: {
                lastSync: this.fantasyCatalog.lastSync,
                itemStockLevels: this.fantasyCatalog.items.map(i => ({ id: i.id, inStock: i.inStock }))
            },
            savedAt: Date.now()
        };
        
        try {
            localStorage.setItem('gembot_fantasy_marketplace', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save Fantasy Marketplace state:', e);
        }
    },
    
    loadState() {
        try {
            const saved = localStorage.getItem('gembot_fantasy_marketplace');
            if (saved) {
                const state = JSON.parse(saved);
                
                if (state.config) Object.assign(this.config, state.config);
                if (state.metalPrices) Object.assign(this.metalPrices, state.metalPrices);
                if (state.inventory) this.inventory = state.inventory;
                if (state.customOrders) this.customOrders = state.customOrders;
                
                console.log('📂 Loaded Fantasy Marketplace state from', new Date(state.savedAt).toLocaleString());
            }
        } catch (e) {
            console.error('Failed to load Fantasy Marketplace state:', e);
        }
    },
    
    // === PRICE SYNC ===
    startPriceSync() {
        // Update prices periodically
        setInterval(() => {
            this.updateMetalPrices();
        }, this.config.syncInterval);
    },
    
    // === MERLIN INTEGRATION ===
    registerWithMerlin() {
        if (typeof window.merlin !== 'undefined' && window.merlin) {
            window.merlin.fantasyMarketplace = {
                getFantasyGems: () => this.fantasyCatalog.items,
                getMetalPrices: () => this.metalPrices,
                getInventory: () => this.inventory,
                getRecutCost: (stone) => this.calculateRecutCost(stone),
                getCustomOrderCost: (ringId, gemId) => this.calculateCustomOrder(ringId, gemId)
            };
            
            console.log('🧙‍♂️ Fantasy Marketplace registered with Merlin AI');
        }
    },
    
    // === UI HELPERS ===
    getFantasyGemsForUI(filters = {}) {
        let items = [...this.fantasyCatalog.items];
        
        if (filters.type) {
            items = items.filter(i => i.type === filters.type);
        }
        if (filters.material) {
            items = items.filter(i => i.material.toLowerCase().includes(filters.material.toLowerCase()));
        }
        if (filters.maxPrice) {
            items = items.filter(i => i.totalPriceUSD <= filters.maxPrice);
        }
        if (filters.minPrice) {
            items = items.filter(i => i.totalPriceUSD >= filters.minPrice);
        }
        if (filters.available !== undefined) {
            items = items.filter(i => i.available === filters.available);
        }
        
        // Sort
        if (filters.sortBy === 'price_asc') {
            items.sort((a, b) => a.totalPriceUSD - b.totalPriceUSD);
        } else if (filters.sortBy === 'price_desc') {
            items.sort((a, b) => b.totalPriceUSD - a.totalPriceUSD);
        } else if (filters.sortBy === 'carats') {
            items.sort((a, b) => b.carats - a.carats);
        }
        
        return items;
    },
    
    getMarketStats() {
        const items = this.fantasyCatalog.items;
        const available = items.filter(i => i.available);
        
        return {
            totalFantasyGems: items.length,
            availableGems: available.length,
            totalCarats: items.reduce((sum, i) => sum + i.carats, 0).toFixed(2),
            averagePrice: (items.reduce((sum, i) => sum + i.totalPriceUSD, 0) / items.length).toFixed(2),
            highestPrice: Math.max(...items.map(i => i.totalPriceUSD)),
            lowestPrice: Math.min(...items.map(i => i.totalPriceUSD)),
            cryptoFeePercent: this.config.cryptoFeePercent * 100 + '%',
            tokenSymbol: this.config.tokenSymbol,
            metalPricesLive: this.metalPrices,
            lastUpdate: this.config.lastPriceUpdate
        };
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FantasyMarketplace.init());
} else {
    FantasyMarketplace.init();
}

// Export
window.FantasyMarketplace = FantasyMarketplace;

console.log('💎 Fantasy Marketplace module loaded (Nick Alexander + Rio Grande + Austin Integration)');
