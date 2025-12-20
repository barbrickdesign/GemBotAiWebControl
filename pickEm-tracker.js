/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PICKEM AI - USER TRACKING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Tracks user purchases, generations, wins, and losses
 * 
 * OWNER: Ryan Barbrick / Barbrick Design
 * CONTACT: BarbrickDesign@gmail.com
 * COPYRIGHT: © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.PickEmTracker = {
    version: '1.0.0',
    
    // User data structure
    userData: {
        userId: null,
        purchases: [],
        generations: [],
        results: [],
        stats: {
            totalInvested: 0,
            totalWon: 0,
            totalDrawings: 0,
            wins: 0,
            losses: 0
        }
    },
    
    /**
     * Initialize the tracking system
     */
    init() {
        console.log('📊 PickEm Tracker initializing...');
        
        // Generate or load user ID
        this.initializeUserId();
        
        // Load user data
        this.loadUserData();
        
        console.log('✅ PickEm Tracker ready');
        console.log('📈 User stats:', this.userData.stats);
        
        return this;
    },
    
    /**
     * Initialize user ID with cryptographically secure random
     */
    initializeUserId() {
        let userId = localStorage.getItem('pickEm_userId');
        
        if (!userId) {
            // Generate unique user ID using crypto API for security
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                userId = 'USER-' + crypto.randomUUID();
            } else {
                // Fallback for older browsers
                userId = 'USER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
            localStorage.setItem('pickEm_userId', userId);
        }
        
        this.userData.userId = userId;
    },
    
    /**
     * Load user data from localStorage
     */
    loadUserData() {
        const saved = localStorage.getItem('pickEm_userData');
        
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.userData = { ...this.userData, ...data };
            } catch (e) {
                console.warn('Failed to load user data:', e);
            }
        }
    },
    
    /**
     * Save user data to localStorage
     */
    saveUserData() {
        localStorage.setItem('pickEm_userData', JSON.stringify(this.userData));
        console.log('💾 User data saved');
    },
    
    /**
     * Log a purchase
     */
    logPurchase(purchaseData) {
        const purchase = {
            id: 'PURCHASE-' + Date.now(),
            tier: purchaseData.tier,
            amount: purchaseData.amount,
            transactionId: purchaseData.transactionId,
            timestamp: new Date().toISOString(),
            setsIncluded: this.getSetsForTier(purchaseData.tier)
        };
        
        this.userData.purchases.push(purchase);
        this.userData.stats.totalInvested += purchaseData.amount;
        
        this.saveUserData();
        
        console.log('💰 Purchase logged:', purchase);
        
        // Update community stats
        this.updateCommunityPurchase(purchase);
        
        return purchase;
    },
    
    /**
     * Get number of sets for tier
     */
    getSetsForTier(tier) {
        const setsMap = {
            'basic': 5,
            'standard': 20,
            'premium': 50
        };
        return setsMap[tier] || 5;
    },
    
    /**
     * Log a number generation
     */
    logGeneration(generationData) {
        const generation = {
            id: 'GEN-' + Date.now(),
            numbers: generationData.numbers,
            tier: generationData.tier,
            timestamp: generationData.timestamp || new Date().toISOString(),
            result: null  // Will be updated when result is logged
        };
        
        this.userData.generations.push(generation);
        this.userData.stats.totalDrawings++;
        
        this.saveUserData();
        
        console.log('🎲 Generation logged:', generation);
        
        return generation;
    },
    
    /**
     * Log a result (win or loss)
     */
    logResult(resultData) {
        const result = {
            id: 'RESULT-' + Date.now(),
            result: resultData.result,  // 'win' or 'loss'
            amount: resultData.amount || 0,
            tier: resultData.tier,
            numbers: this.getLastGeneratedNumbers(),
            timestamp: resultData.timestamp || new Date().toISOString()
        };
        
        this.userData.results.push(result);
        
        if (result.result === 'win') {
            this.userData.stats.wins++;
            this.userData.stats.totalWon += result.amount;
        } else {
            this.userData.stats.losses++;
        }
        
        // Update last generation with result
        if (this.userData.generations.length > 0) {
            const lastGen = this.userData.generations[this.userData.generations.length - 1];
            lastGen.result = result.result;
            lastGen.winAmount = result.amount;
        }
        
        this.saveUserData();
        
        console.log('📝 Result logged:', result);
        
        // Update algorithm with result
        if (window.PickEmAlgorithm && result.numbers) {
            window.PickEmAlgorithm.updateFromResults(
                result.numbers,
                result.result,
                result.amount
            );
        }
        
        // Update community stats
        this.updateCommunityResult(result);
        
        return result;
    },
    
    /**
     * Get last generated numbers
     */
    getLastGeneratedNumbers() {
        if (this.userData.generations.length === 0) {
            return null;
        }
        return this.userData.generations[this.userData.generations.length - 1].numbers;
    },
    
    /**
     * Get user statistics
     */
    getUserStats() {
        const stats = this.userData.stats;
        
        // Calculate derived stats
        const totalGames = stats.wins + stats.losses;
        const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;
        const netProfit = stats.totalWon - stats.totalInvested;
        const roi = stats.totalInvested > 0 
            ? ((netProfit / stats.totalInvested) * 100)
            : 0;
        
        return {
            totalInvested: stats.totalInvested,
            totalWon: stats.totalWon,
            netProfit: netProfit,
            totalDrawings: stats.totalDrawings,
            wins: stats.wins,
            losses: stats.losses,
            winRate: winRate,
            roi: roi
        };
    },
    
    /**
     * Get user history
     */
    getHistory() {
        // Combine generations and results
        const history = [];
        
        this.userData.results.forEach(result => {
            history.push({
                timestamp: result.timestamp,
                numbers: result.numbers || [],
                tier: result.tier,
                result: result.result,
                amount: result.amount
            });
        });
        
        return history.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
    },
    
    /**
     * Get tier statistics
     */
    getTierStats() {
        const tierStats = {
            basic: { purchases: 0, wins: 0, losses: 0, totalWon: 0, totalInvested: 0 },
            standard: { purchases: 0, wins: 0, losses: 0, totalWon: 0, totalInvested: 0 },
            premium: { purchases: 0, wins: 0, losses: 0, totalWon: 0, totalInvested: 0 }
        };
        
        // Count purchases by tier
        this.userData.purchases.forEach(purchase => {
            if (tierStats[purchase.tier]) {
                tierStats[purchase.tier].purchases++;
                tierStats[purchase.tier].totalInvested += purchase.amount;
            }
        });
        
        // Count results by tier
        this.userData.results.forEach(result => {
            if (tierStats[result.tier]) {
                if (result.result === 'win') {
                    tierStats[result.tier].wins++;
                    tierStats[result.tier].totalWon += result.amount;
                } else {
                    tierStats[result.tier].losses++;
                }
            }
        });
        
        // Calculate win rates
        Object.keys(tierStats).forEach(tier => {
            const stats = tierStats[tier];
            const totalGames = stats.wins + stats.losses;
            stats.winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;
            stats.roi = stats.totalInvested > 0 
                ? ((stats.totalWon - stats.totalInvested) / stats.totalInvested) * 100
                : 0;
        });
        
        return tierStats;
    },
    
    /**
     * Export user data
     */
    exportData() {
        const exportData = {
            userId: this.userData.userId,
            exportDate: new Date().toISOString(),
            stats: this.getUserStats(),
            tierStats: this.getTierStats(),
            purchases: this.userData.purchases,
            results: this.userData.results,
            history: this.getHistory()
        };
        
        return exportData;
    },
    
    /**
     * Update community purchase stats
     */
    updateCommunityPurchase(purchase) {
        const communityData = this.getCommunityData();
        
        communityData.totalPurchases++;
        communityData.totalRevenue += purchase.amount;
        
        if (!communityData.tierPurchases[purchase.tier]) {
            communityData.tierPurchases[purchase.tier] = 0;
        }
        communityData.tierPurchases[purchase.tier]++;
        
        this.saveCommunityData(communityData);
    },
    
    /**
     * Update community result stats
     */
    updateCommunityResult(result) {
        const communityData = this.getCommunityData();
        
        if (result.result === 'win') {
            communityData.totalWins++;
            communityData.totalPrizeMoney += result.amount;
            
            // Track unique winners
            if (!communityData.winners.includes(this.userData.userId)) {
                communityData.winners.push(this.userData.userId);
            }
        } else {
            communityData.totalLosses++;
        }
        
        this.saveCommunityData(communityData);
    },
    
    /**
     * Get community data
     */
    getCommunityData() {
        const saved = localStorage.getItem('pickEm_communityData');
        
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to load community data:', e);
            }
        }
        
        // Default structure
        return {
            totalPurchases: 0,
            totalRevenue: 0,
            totalWins: 0,
            totalLosses: 0,
            totalPrizeMoney: 0,
            winners: [],
            tierPurchases: {
                basic: 0,
                standard: 0,
                premium: 0
            }
        };
    },
    
    /**
     * Save community data
     */
    saveCommunityData(data) {
        localStorage.setItem('pickEm_communityData', JSON.stringify(data));
    },
    
    /**
     * Reset user data (for testing or user request)
     */
    resetUserData() {
        if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
            this.userData = {
                userId: this.userData.userId,  // Keep user ID
                purchases: [],
                generations: [],
                results: [],
                stats: {
                    totalInvested: 0,
                    totalWon: 0,
                    totalDrawings: 0,
                    wins: 0,
                    losses: 0
                }
            };
            
            this.saveUserData();
            console.log('🗑️ User data reset');
            alert('Your data has been reset successfully.');
            location.reload();
        }
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PickEmTracker.init());
} else {
    window.PickEmTracker.init();
}
