/**
 * 🏪 GemBot Marketplace System - Earth Art Gems Integration
 * Real-world jewelry marketplace with crypto integration
 * 
 * Features:
 * - Live sync with earthartgems.com catalog
 * - In-game forging system (gold/silver + cut gems = rings)
 * - Crypto payment gateway ($GEMBOT token)
 * - Virtual-to-real-world item conversion
 * - Player-to-player trading
 * 
 * Token: DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump
 */

const GemBotMarketplace = {
    version: "1.0.0",
    initialized: false,
    
    // === CONFIGURATION ===
    config: {
        // Crypto token address on Solana
        tokenAddress: "DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump",
        tokenSymbol: "$GEMBOT",
        tokenDecimals: 9,
        
        // Earth Art Gems integration
        shopUrl: "https://earthartgems.com",
        apiEndpoint: null, // Will need Shopify API access
        
        // Price conversion ratios
        usdToToken: 100, // 1 USD = 100 $GEMBOT tokens (adjustable)
        tokenToInGameGold: 10, // 1 $GEMBOT = 10 in-game gold
        
        // Forging requirements
        forgingFee: 50, // Base token cost to forge
        
        // Virtual ring value accumulation
        virtualRingsNeededForReal: 10, // X virtual rings = 1 real ring potential
        
        // Auto-sync interval (ms)
        syncInterval: 300000 // 5 minutes
    },
    
    // === CATALOG DATA ===
    catalog: {
        items: [],
        lastSync: null,
        syncStatus: 'pending'
    },
    
    // === IN-GAME RESOURCES ===
    resources: {
        // Precious metals (purchasable with crypto)
        metals: {
            gold: {
                name: "14k Gold",
                symbol: "🥇",
                pricePerGram: 50, // in $GEMBOT
                inGameAmount: 0
            },
            roseGold: {
                name: "14k Rose Gold",
                symbol: "🌹",
                pricePerGram: 55,
                inGameAmount: 0
            },
            silver: {
                name: "Sterling Silver",
                symbol: "🥈",
                pricePerGram: 5,
                inGameAmount: 0
            },
            platinum: {
                name: "Platinum",
                symbol: "⚪",
                pricePerGram: 100,
                inGameAmount: 0
            }
        },
        
        // Cut gemstones from gameplay
        cutGems: [],
        
        // Forged items
        forgedItems: [],
        
        // Virtual rings collected
        virtualRings: []
    },
    
    // === PLAYER WALLET ===
    wallet: {
        connected: false,
        address: null,
        tokenBalance: 0,
        inGameGold: 0,
        inGameSilver: 0,
        pendingTransactions: []
    },
    
    // === MARKETPLACE LISTINGS ===
    listings: {
        // Player-created listings
        myListings: [],
        
        // Active market listings from other players
        marketListings: [],
        
        // Purchase history
        purchaseHistory: [],
        
        // Sales history
        salesHistory: []
    },
    
    // === INITIALIZATION ===
    async init() {
        if (this.initialized) {
            console.log('⚠️ Marketplace already initialized');
            return this;
        }
        
        console.log('🏪 Initializing GemBot Marketplace...');
        
        // Load saved state
        this.loadState();
        
        // Parse Earth Art Gems catalog
        await this.loadCatalog();
        
        // Setup price sync
        this.startPriceSync();
        
        // Register with Merlin AI
        this.registerWithMerlin();
        
        this.initialized = true;
        console.log('✅ Marketplace initialized with', this.catalog.items.length, 'items');
        
        return this;
    },
    
    // === CATALOG MANAGEMENT ===
    
    /**
     * Load and parse Earth Art Gems catalog
     */
    async loadCatalog() {
        console.log('📦 Loading Earth Art Gems catalog...');
        
        // Parse the CSV data (pre-loaded)
        const catalogData = this.parseEarthArtGemsCatalog();
        
        // Process each item
        this.catalog.items = catalogData.map((item, index) => ({
            id: `eag_${index}_${Date.now()}`,
            source: 'earthartgems',
            
            // Basic info
            name: item.name,
            url: item.url,
            imageUrl: item.imageUrl,
            
            // Availability
            available: item.availability !== 'Sold Out',
            soldOut: item.availability === 'Sold Out',
            
            // Pricing
            priceUSD: this.parsePrice(item.price),
            priceTokens: this.usdToTokens(this.parsePrice(item.price)),
            priceType: item.price.includes('From') ? 'starting' : 'fixed',
            
            // Extracted metadata
            metalType: this.extractMetalType(item.name),
            gemstones: this.extractGemstones(item.name),
            itemType: this.extractItemType(item.name),
            
            // In-game forging requirements
            forgingRequirements: this.calculateForgingRequirements(item),
            
            // Virtual ring tracking
            virtualCopiesOwned: 0,
            virtualValueAccumulated: 0
        }));
        
        this.catalog.lastSync = Date.now();
        this.catalog.syncStatus = 'synced';
        
        this.saveState();
        return this.catalog.items;
    },
    
    /**
     * Parse the Earth Art Gems CSV data
     */
    parseEarthArtGemsCatalog() {
        // This data comes from earthartgemsCatData.csv
        return [
            {
                url: "https://earthartgems.com/products/20-sided-rutile-quartz-medallion-sterling-and-14k-rose-gold",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0570_480x480.jpg?v=1697653777",
                name: "20 Sided Rutile Quartz Medallion - Sterling and 14k Rose gold",
                availability: "Sold Out",
                price: ""
            },
            {
                url: "https://earthartgems.com/products/mechanical-themed-fire-agate-ring-sterling-and-14k",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0609_480x480.jpg?v=1698709776",
                name: "Mechanical Themed Fire Agate Ring - Sterling and 14k",
                availability: "Sold Out",
                price: ""
            },
            {
                url: "https://earthartgems.com/products/5mm-wide-diamond-triforce-band",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0625_480x480.jpg?v=1699038086",
                name: "5mm wide Diamond Triforce Band",
                availability: "",
                price: "From $375"
            },
            {
                url: "https://earthartgems.com/products/strata-mens-noir-dog-tad-pendant-sterling-silver",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0651_480x480.jpg?v=1699227064",
                name: "Strata - Mens Noir Dog Tad Pendant - Sterling Silver",
                availability: "",
                price: "$350"
            },
            {
                url: "https://earthartgems.com/products/opal-kangaroo-mosaic-signet-ring-sterling-silver",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0654_480x480.jpg?v=1699315487",
                name: "Opal Kangaroo Mosaic Signet ring - Sterling Silver",
                availability: "",
                price: "$250"
            },
            {
                url: "https://earthartgems.com/products/landscape-jasper-statement-ring",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0660_480x480.jpg?v=1700089419",
                name: "Picture Jasper Landscape Statement Ring",
                availability: "Sold Out",
                price: ""
            },
            {
                url: "https://earthartgems.com/products/bird-on-a-branch-opal-mosaic-signet-ring",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0701_480x480.jpg?v=1701283622",
                name: "Bird on a branch - Opal Mosaic Signet Ring",
                availability: "Sold Out",
                price: ""
            },
            {
                url: "https://earthartgems.com/products/opal-and-diamond-starburst-ring-14k-gold",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0710_480x480.jpg?v=1701295873",
                name: "Opal and Diamond Starburst Ring - 14k gold",
                availability: "",
                price: "$1,175"
            },
            {
                url: "https://earthartgems.com/products/dark-mark-serpent-ring-sterling-silver",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0723_480x480.jpg?v=1701893838",
                name: "Dark Mark Serpent Ring - Sterling Silver",
                availability: "",
                price: "$250"
            },
            {
                url: "https://earthartgems.com/products/wrench-wedding-set-diamonds-in-14k-gold",
                imageUrl: "https://earthartgems.com/cdn/shop/files/mg_8722_480x480.jpg?v=1701894311",
                name: "Wrench Wedding Set - Diamonds in 14k Gold",
                availability: "",
                price: "$1,950"
            },
            {
                url: "https://earthartgems.com/products/moonrise-landscape-pendant-with-lapis-sterling-silver",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0741_480x480.jpg?v=1701973332",
                name: "Moonrise Landscape Pendant with Lapis - Sterling silver",
                availability: "Sold Out",
                price: ""
            },
            {
                url: "https://earthartgems.com/products/baby-groot-sterling-silver-or-gold",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0843_480x480.jpg?v=1706726309",
                name: "The Sapling Ring - Sterling Silver or Gold",
                availability: "",
                price: "$225"
            },
            {
                url: "https://earthartgems.com/products/black-and-white-clover-ring-sterling-and-topaz",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0847_480x480.jpg?v=1706727632",
                name: "Black and White Clover Ring - Sterling and Topaz",
                availability: "",
                price: "$450"
            },
            {
                url: "https://earthartgems.com/products/holy-hand-grenade-of-antioch-pendant",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0855_480x480.jpg?v=1706729101",
                name: "Holy Hand Grenade of Antioch Pendant!",
                availability: "",
                price: "From $200"
            },
            {
                url: "https://earthartgems.com/products/deluxe-house-signet-ring-the-eagle-sterling-silver-and-ancient-bronze",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_2183_480x480.jpg?v=1751226154",
                name: "Deluxe House Signet Ring - The Raven - Sterling Silver and Ancient Bronze",
                availability: "",
                price: "From $250"
            },
            {
                url: "https://earthartgems.com/products/sapphire-chaos-signet-ring-sterling-and-14k",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0910_480x480.jpg?v=1708021885",
                name: "Sapphire Chaos Signet Ring - Sterling and 14k",
                availability: "",
                price: "$440"
            },
            {
                url: "https://earthartgems.com/products/2-4ct-green-sunstone-solitaire-ring-sterling-and-14k",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0943_480x480.jpg?v=1708982337",
                name: "2.4ct Green Sunstone Solitaire Ring - Sterling and 14k",
                availability: "Sold Out",
                price: ""
            },
            {
                url: "https://earthartgems.com/products/1-15ct-blush-sunstone-solitaire-ring-sterling-and-14k",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0937_480x480.jpg?v=1708982461",
                name: "1.15ct Blush Sunstone Solitaire Ring - Sterling and 14k",
                availability: "",
                price: "$350"
            },
            {
                url: "https://earthartgems.com/products/marquise-sunstone-halo-cocktail-ring",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_0969_480x480.jpg?v=1709839336",
                name: "Marquise Sunstone Halo Cocktail ring",
                availability: "",
                price: "$500"
            },
            {
                url: "https://earthartgems.com/products/zelda-rupee-cut-topaz-ring",
                imageUrl: "https://earthartgems.com/cdn/shop/files/IMG_1005_480x480.jpg?v=1711642614",
                name: "Zelda Rupee Cut Topaz Ring",
                availability: "",
                price: "From $400"
            }
        ];
    },
    
    // === PRICE UTILITIES ===
    
    parsePrice(priceStr) {
        if (!priceStr || priceStr === '') return 0;
        // Remove "From ", "$", and commas
        const cleaned = priceStr.replace(/From\s*/i, '').replace(/[$,]/g, '');
        return parseFloat(cleaned) || 0;
    },
    
    usdToTokens(usd) {
        return Math.ceil(usd * this.config.usdToToken);
    },
    
    tokensToUsd(tokens) {
        return tokens / this.config.usdToToken;
    },
    
    tokensToInGameGold(tokens) {
        return tokens * this.config.tokenToInGameGold;
    },
    
    inGameGoldToTokens(gold) {
        return Math.ceil(gold / this.config.tokenToInGameGold);
    },
    
    // === METADATA EXTRACTION ===
    
    extractMetalType(name) {
        const metals = [];
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('14k gold') || nameLower.includes('14k yellow')) metals.push('14k_gold');
        if (nameLower.includes('rose gold')) metals.push('14k_rose_gold');
        if (nameLower.includes('sterling') || nameLower.includes('silver')) metals.push('sterling_silver');
        if (nameLower.includes('platinum')) metals.push('platinum');
        if (nameLower.includes('bronze')) metals.push('bronze');
        
        return metals.length > 0 ? metals : ['unknown'];
    },
    
    extractGemstones(name) {
        const gems = [];
        const nameLower = name.toLowerCase();
        
        const gemTypes = [
            'diamond', 'ruby', 'sapphire', 'emerald', 'opal', 'topaz',
            'quartz', 'amethyst', 'citrine', 'garnet', 'peridot', 'tourmaline',
            'sunstone', 'moonstone', 'agate', 'jasper', 'lapis', 'turquoise',
            'alexandrite', 'aquamarine', 'tanzanite', 'morganite', 'rutile'
        ];
        
        gemTypes.forEach(gem => {
            if (nameLower.includes(gem)) gems.push(gem);
        });
        
        return gems;
    },
    
    extractItemType(name) {
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('ring') || nameLower.includes('band')) return 'ring';
        if (nameLower.includes('pendant') || nameLower.includes('medallion')) return 'pendant';
        if (nameLower.includes('necklace')) return 'necklace';
        if (nameLower.includes('bracelet')) return 'bracelet';
        if (nameLower.includes('earring')) return 'earrings';
        if (nameLower.includes('wedding set')) return 'wedding_set';
        
        return 'jewelry';
    },
    
    // === FORGING SYSTEM ===
    
    /**
     * Calculate what's needed to forge a virtual copy of an item
     */
    calculateForgingRequirements(item) {
        const metals = this.extractMetalType(item.name);
        const gems = this.extractGemstones(item.name);
        const itemType = this.extractItemType(item.name);
        
        // Base metal requirements by item type
        const metalWeights = {
            ring: { gold: 5, silver: 8 },
            pendant: { gold: 3, silver: 5 },
            necklace: { gold: 10, silver: 15 },
            bracelet: { gold: 12, silver: 18 },
            earrings: { gold: 2, silver: 3 },
            wedding_set: { gold: 10, silver: 15 },
            jewelry: { gold: 5, silver: 8 }
        };
        
        const baseWeight = metalWeights[itemType] || metalWeights.jewelry;
        
        return {
            metals: metals.map(m => ({
                type: m,
                gramsRequired: m.includes('gold') ? baseWeight.gold : baseWeight.silver
            })),
            gems: gems.map(g => ({
                type: g,
                caratRequired: Math.random() * 2 + 0.5, // 0.5-2.5 carats
                qualityMin: 70 // Minimum quality % needed
            })),
            skillLevel: this.getRequiredSkillLevel(item),
            forgingFee: this.config.forgingFee,
            estimatedTime: this.estimateForgingTime(itemType)
        };
    },
    
    getRequiredSkillLevel(item) {
        const price = this.parsePrice(item.price);
        if (price >= 1000) return 'master';
        if (price >= 500) return 'artisan';
        if (price >= 250) return 'journeyman';
        return 'apprentice';
    },
    
    estimateForgingTime(itemType) {
        const times = {
            ring: 30, // minutes
            pendant: 20,
            necklace: 45,
            bracelet: 40,
            earrings: 25,
            wedding_set: 60,
            jewelry: 30
        };
        return times[itemType] || 30;
    },
    
    /**
     * Attempt to forge a virtual copy of an item
     */
    async forgeItem(itemId, playerInventory) {
        const item = this.catalog.items.find(i => i.id === itemId);
        if (!item) {
            return { success: false, error: 'Item not found' };
        }
        
        const requirements = item.forgingRequirements;
        
        // Check skill level
        const skillLevels = ['apprentice', 'journeyman', 'artisan', 'master', 'grandmaster'];
        const playerSkillIndex = skillLevels.indexOf(playerInventory.skillLevel || 'apprentice');
        const requiredSkillIndex = skillLevels.indexOf(requirements.skillLevel);
        
        if (playerSkillIndex < requiredSkillIndex) {
            return { 
                success: false, 
                error: `Requires ${requirements.skillLevel} skill level. You are ${playerInventory.skillLevel}.` 
            };
        }
        
        // Check metal availability
        for (const metalReq of requirements.metals) {
            const playerMetal = this.resources.metals[metalReq.type.replace('14k_', '').replace('sterling_', '')];
            if (!playerMetal || playerMetal.inGameAmount < metalReq.gramsRequired) {
                return { 
                    success: false, 
                    error: `Not enough ${metalReq.type}. Need ${metalReq.gramsRequired}g.` 
                };
            }
        }
        
        // Check gem availability
        for (const gemReq of requirements.gems) {
            const matchingGems = this.resources.cutGems.filter(g => 
                g.type.toLowerCase() === gemReq.type && 
                g.carat >= gemReq.caratRequired &&
                g.quality >= gemReq.qualityMin
            );
            
            if (matchingGems.length === 0) {
                return { 
                    success: false, 
                    error: `Need ${gemReq.caratRequired.toFixed(1)}ct ${gemReq.type} (${gemReq.qualityMin}%+ quality)` 
                };
            }
        }
        
        // Check forging fee
        if (this.wallet.tokenBalance < requirements.forgingFee) {
            return { 
                success: false, 
                error: `Need ${requirements.forgingFee} ${this.config.tokenSymbol} for forging fee` 
            };
        }
        
        // SUCCESS - Deduct resources and create virtual item
        // Deduct metals
        for (const metalReq of requirements.metals) {
            const metalKey = metalReq.type.replace('14k_', '').replace('sterling_', '');
            this.resources.metals[metalKey].inGameAmount -= metalReq.gramsRequired;
        }
        
        // Deduct gems (use first matching)
        for (const gemReq of requirements.gems) {
            const gemIndex = this.resources.cutGems.findIndex(g => 
                g.type.toLowerCase() === gemReq.type && 
                g.carat >= gemReq.caratRequired &&
                g.quality >= gemReq.qualityMin
            );
            if (gemIndex >= 0) {
                this.resources.cutGems.splice(gemIndex, 1);
            }
        }
        
        // Deduct forging fee
        this.wallet.tokenBalance -= requirements.forgingFee;
        
        // Create forged item
        const forgedItem = {
            id: `forged_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            originalItemId: itemId,
            name: item.name,
            imageUrl: item.imageUrl,
            forgedAt: Date.now(),
            virtualValue: Math.floor(item.priceTokens / this.config.virtualRingsNeededForReal),
            quality: this.calculateForgeQuality(playerInventory.skillLevel)
        };
        
        this.resources.forgedItems.push(forgedItem);
        
        // Track towards real item
        item.virtualCopiesOwned++;
        item.virtualValueAccumulated += forgedItem.virtualValue;
        
        this.saveState();
        
        return { 
            success: true, 
            item: forgedItem,
            message: `Successfully forged ${item.name}! Virtual value: ${forgedItem.virtualValue} ${this.config.tokenSymbol}`
        };
    },
    
    calculateForgeQuality(skillLevel) {
        const baseQuality = {
            apprentice: 60,
            journeyman: 70,
            artisan: 80,
            master: 90,
            grandmaster: 95
        };
        const base = baseQuality[skillLevel] || 60;
        return Math.min(100, base + Math.floor(Math.random() * 10));
    },
    
    // === VIRTUAL TO REAL CONVERSION ===
    
    /**
     * Check if player can convert virtual rings to real purchase
     */
    checkRealWorldConversion(itemId) {
        const item = this.catalog.items.find(i => i.id === itemId);
        if (!item) return { eligible: false, error: 'Item not found' };
        
        if (item.soldOut) {
            return { eligible: false, error: 'Item is sold out' };
        }
        
        const virtualCopies = item.virtualCopiesOwned;
        const requiredCopies = this.config.virtualRingsNeededForReal;
        const progress = (virtualCopies / requiredCopies) * 100;
        
        if (virtualCopies >= requiredCopies) {
            return {
                eligible: true,
                item: item,
                virtualCopiesOwned: virtualCopies,
                tokensRequired: item.priceTokens,
                usdValue: item.priceUSD,
                message: `You have ${virtualCopies} virtual copies! You can convert to a real ${item.name}.`
            };
        }
        
        return {
            eligible: false,
            progress: progress,
            virtualCopiesOwned: virtualCopies,
            copiesNeeded: requiredCopies - virtualCopies,
            message: `${virtualCopies}/${requiredCopies} virtual copies (${progress.toFixed(1)}% to real item)`
        };
    },
    
    /**
     * Initiate real-world purchase with crypto
     */
    async initiateRealWorldPurchase(itemId, shippingInfo) {
        const conversion = this.checkRealWorldConversion(itemId);
        
        if (!conversion.eligible) {
            return { success: false, error: conversion.message || conversion.error };
        }
        
        // Validate shipping info
        if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || 
            !shippingInfo.state || !shippingInfo.zip || !shippingInfo.country) {
            return { success: false, error: 'Incomplete shipping information' };
        }
        
        // Check wallet balance
        if (this.wallet.tokenBalance < conversion.tokensRequired) {
            return { 
                success: false, 
                error: `Insufficient ${this.config.tokenSymbol} balance. Need ${conversion.tokensRequired}, have ${this.wallet.tokenBalance}` 
            };
        }
        
        // Create pending order
        const order = {
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            itemId: itemId,
            item: conversion.item,
            status: 'pending_payment',
            createdAt: Date.now(),
            tokensAmount: conversion.tokensRequired,
            usdAmount: conversion.usdValue,
            shippingInfo: shippingInfo,
            cryptoTxHash: null,
            shopifyOrderId: null
        };
        
        this.wallet.pendingTransactions.push(order);
        this.saveState();
        
        return {
            success: true,
            order: order,
            nextStep: 'confirm_crypto_payment',
            message: `Order created! Please confirm payment of ${conversion.tokensRequired} ${this.config.tokenSymbol}`
        };
    },
    
    /**
     * Process crypto payment (would integrate with Solana wallet)
     */
    async processCryptoPayment(orderId) {
        const order = this.wallet.pendingTransactions.find(o => o.id === orderId);
        if (!order) {
            return { success: false, error: 'Order not found' };
        }
        
        // In production, this would:
        // 1. Connect to Phantom/Solflare wallet
        // 2. Send tokens to merchant wallet
        // 3. Get transaction hash
        // 4. Forward order to Shopify API
        
        // For now, simulate the flow
        console.log(`💳 Processing payment for order ${orderId}`);
        console.log(`   Token: ${this.config.tokenAddress}`);
        console.log(`   Amount: ${order.tokensAmount} ${this.config.tokenSymbol}`);
        console.log(`   USD Equivalent: $${order.usdAmount}`);
        
        // Deduct tokens
        this.wallet.tokenBalance -= order.tokensAmount;
        
        // Update order status
        order.status = 'payment_received';
        order.cryptoTxHash = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        order.paidAt = Date.now();
        
        // Burn virtual copies
        const item = this.catalog.items.find(i => i.id === order.itemId);
        if (item) {
            item.virtualCopiesOwned = Math.max(0, item.virtualCopiesOwned - this.config.virtualRingsNeededForReal);
        }
        
        this.saveState();
        
        return {
            success: true,
            order: order,
            txHash: order.cryptoTxHash,
            message: `Payment successful! Your order for ${order.item.name} is being processed.`
        };
    },
    
    // === PLAYER TRADING ===
    
    /**
     * List an item for sale on the marketplace
     */
    listItemForSale(itemId, priceTokens, description = '') {
        const item = this.resources.forgedItems.find(i => i.id === itemId);
        if (!item) {
            return { success: false, error: 'Item not found in your inventory' };
        }
        
        const listing = {
            id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            itemId: itemId,
            item: item,
            sellerId: this.wallet.address || 'anonymous',
            priceTokens: priceTokens,
            description: description,
            listedAt: Date.now(),
            status: 'active'
        };
        
        this.listings.myListings.push(listing);
        
        // Remove from inventory (held in escrow)
        const idx = this.resources.forgedItems.findIndex(i => i.id === itemId);
        if (idx >= 0) {
            this.resources.forgedItems.splice(idx, 1);
        }
        
        this.saveState();
        
        return { success: true, listing: listing };
    },
    
    /**
     * Buy an item from the marketplace
     */
    async buyListing(listingId) {
        const listing = this.listings.marketListings.find(l => l.id === listingId);
        if (!listing) {
            return { success: false, error: 'Listing not found' };
        }
        
        if (listing.status !== 'active') {
            return { success: false, error: 'Listing is no longer active' };
        }
        
        if (this.wallet.tokenBalance < listing.priceTokens) {
            return { 
                success: false, 
                error: `Insufficient balance. Need ${listing.priceTokens} ${this.config.tokenSymbol}` 
            };
        }
        
        // Process purchase
        this.wallet.tokenBalance -= listing.priceTokens;
        this.resources.forgedItems.push(listing.item);
        listing.status = 'sold';
        
        // Record in history
        this.listings.purchaseHistory.push({
            listingId: listingId,
            item: listing.item,
            priceTokens: listing.priceTokens,
            purchasedAt: Date.now()
        });
        
        this.saveState();
        
        return { 
            success: true, 
            item: listing.item,
            message: `Successfully purchased ${listing.item.name}!`
        };
    },
    
    // === METAL SHOP ===
    
    /**
     * Buy precious metals with crypto tokens
     */
    buyMetal(metalType, grams) {
        const metal = this.resources.metals[metalType];
        if (!metal) {
            return { success: false, error: 'Invalid metal type' };
        }
        
        const cost = metal.pricePerGram * grams;
        
        if (this.wallet.tokenBalance < cost) {
            return { 
                success: false, 
                error: `Insufficient ${this.config.tokenSymbol}. Need ${cost}, have ${this.wallet.tokenBalance}` 
            };
        }
        
        this.wallet.tokenBalance -= cost;
        metal.inGameAmount += grams;
        
        this.saveState();
        
        return { 
            success: true, 
            purchased: { metal: metalType, grams: grams, cost: cost },
            newBalance: metal.inGameAmount
        };
    },
    
    // === STATE MANAGEMENT ===
    
    saveState() {
        const state = {
            version: this.version,
            config: this.config,
            catalog: this.catalog,
            resources: this.resources,
            wallet: this.wallet,
            listings: this.listings,
            savedAt: Date.now()
        };
        
        try {
            localStorage.setItem('gembot_marketplace', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save marketplace state:', e);
        }
    },
    
    loadState() {
        try {
            const saved = localStorage.getItem('gembot_marketplace');
            if (saved) {
                const state = JSON.parse(saved);
                
                // Restore state
                if (state.config) Object.assign(this.config, state.config);
                if (state.catalog) this.catalog = state.catalog;
                if (state.resources) this.resources = state.resources;
                if (state.wallet) this.wallet = state.wallet;
                if (state.listings) this.listings = state.listings;
                
                console.log('📂 Loaded marketplace state from', new Date(state.savedAt).toLocaleString());
            }
        } catch (e) {
            console.error('Failed to load marketplace state:', e);
        }
    },
    
    // === PRICE SYNC ===
    
    startPriceSync() {
        // In production, this would fetch live prices from:
        // 1. earthartgems.com Shopify API
        // 2. Crypto price feeds for token value
        
        setInterval(() => {
            this.syncPrices();
        }, this.config.syncInterval);
    },
    
    async syncPrices() {
        console.log('🔄 Syncing marketplace prices...');
        // Would fetch from APIs here
        this.catalog.lastSync = Date.now();
        this.catalog.syncStatus = 'synced';
    },
    
    // === MERLIN INTEGRATION ===
    
    registerWithMerlin() {
        if (typeof window.merlin !== 'undefined' && window.merlin) {
            // Add marketplace knowledge to Merlin
            window.merlin.marketplaceKnowledge = {
                getItemInfo: (query) => this.searchCatalog(query),
                getPricing: (itemId) => this.getItemPricing(itemId),
                getPlayerInventory: () => this.getInventorySummary(),
                getForgeRequirements: (itemId) => {
                    const item = this.catalog.items.find(i => i.id === itemId);
                    return item?.forgingRequirements;
                }
            };
            
            console.log('🧙‍♂️ Marketplace registered with Merlin AI');
        }
    },
    
    searchCatalog(query) {
        const q = query.toLowerCase();
        return this.catalog.items.filter(item => 
            item.name.toLowerCase().includes(q) ||
            item.gemstones.some(g => g.includes(q)) ||
            item.metalType.some(m => m.includes(q)) ||
            item.itemType.includes(q)
        );
    },
    
    getItemPricing(itemId) {
        const item = this.catalog.items.find(i => i.id === itemId);
        if (!item) return null;
        
        return {
            usd: item.priceUSD,
            tokens: item.priceTokens,
            forgingFee: item.forgingRequirements.forgingFee,
            totalToForge: item.forgingRequirements.forgingFee + 
                item.forgingRequirements.metals.reduce((sum, m) => {
                    const metal = this.resources.metals[m.type.replace('14k_', '').replace('sterling_', '')];
                    return sum + (metal?.pricePerGram || 0) * m.gramsRequired;
                }, 0)
        };
    },
    
    getInventorySummary() {
        return {
            tokenBalance: this.wallet.tokenBalance,
            metals: Object.entries(this.resources.metals).map(([key, metal]) => ({
                type: key,
                name: metal.name,
                amount: metal.inGameAmount
            })),
            cutGems: this.resources.cutGems.length,
            forgedItems: this.resources.forgedItems.length,
            virtualRings: this.resources.virtualRings.length,
            activeListings: this.listings.myListings.filter(l => l.status === 'active').length
        };
    },
    
    // === UI HELPERS ===
    
    /**
     * Get catalog items formatted for UI display
     */
    getCatalogForUI(filters = {}) {
        let items = [...this.catalog.items];
        
        // Apply filters
        if (filters.available !== undefined) {
            items = items.filter(i => i.available === filters.available);
        }
        if (filters.itemType) {
            items = items.filter(i => i.itemType === filters.itemType);
        }
        if (filters.metalType) {
            items = items.filter(i => i.metalType.includes(filters.metalType));
        }
        if (filters.gemstone) {
            items = items.filter(i => i.gemstones.includes(filters.gemstone));
        }
        if (filters.maxPrice) {
            items = items.filter(i => i.priceUSD <= filters.maxPrice);
        }
        if (filters.minPrice) {
            items = items.filter(i => i.priceUSD >= filters.minPrice);
        }
        
        // Sort
        if (filters.sortBy === 'price_asc') {
            items.sort((a, b) => a.priceUSD - b.priceUSD);
        } else if (filters.sortBy === 'price_desc') {
            items.sort((a, b) => b.priceUSD - a.priceUSD);
        } else if (filters.sortBy === 'name') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return items;
    },
    
    /**
     * Format token amount for display
     */
    formatTokens(amount) {
        if (amount >= 1000000) return (amount / 1000000).toFixed(2) + 'M';
        if (amount >= 1000) return (amount / 1000).toFixed(1) + 'K';
        return amount.toLocaleString();
    },
    
    /**
     * Get market statistics
     */
    getMarketStats() {
        const available = this.catalog.items.filter(i => i.available);
        const avgPrice = available.reduce((sum, i) => sum + i.priceUSD, 0) / available.length;
        
        return {
            totalItems: this.catalog.items.length,
            availableItems: available.length,
            soldOutItems: this.catalog.items.filter(i => i.soldOut).length,
            averagePriceUSD: avgPrice,
            averagePriceTokens: this.usdToTokens(avgPrice),
            lastSync: this.catalog.lastSync,
            tokenSymbol: this.config.tokenSymbol,
            tokenAddress: this.config.tokenAddress
        };
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GemBotMarketplace.init());
} else {
    GemBotMarketplace.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotMarketplace;
}

window.GemBotMarketplace = GemBotMarketplace;
