/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PICKEM AI - ANALYTICS & REPORTING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Community analytics, success metrics, and social proof
 * 
 * OWNER: Ryan Barbrick / Barbrick Design
 * CONTACT: BarbrickDesign@gmail.com
 * COPYRIGHT: © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.PickEmAnalytics = {
    version: '1.0.0',
    
    // Analytics data
    analyticsData: {
        totalUsers: 0,
        totalGenerations: 0,
        totalWinners: 0,
        totalPrizeMoney: 0,
        tierPerformance: {
            basic: { winRate: 0, avgWin: 0, totalUsers: 0 },
            standard: { winRate: 0, avgWin: 0, totalUsers: 0 },
            premium: { winRate: 0, avgWin: 0, totalUsers: 0 }
        },
        recentWins: [],
        topWinners: []
    },
    
    /**
     * Initialize analytics system
     */
    init() {
        console.log('📈 PickEm Analytics initializing...');
        
        // Load analytics data
        this.loadAnalyticsData();
        
        // Initialize with demo data if empty
        if (this.analyticsData.totalUsers === 0) {
            this.initializeDemoData();
        }
        
        console.log('✅ PickEm Analytics ready');
        console.log('📊 Community stats:', this.getCommunityStats());
        
        return this;
    },
    
    /**
     * Initialize with demo data for new installations
     * NOTE: This is demonstration data. In production, start with empty stats.
     */
    initializeDemoData() {
        console.log('⚠️ Initializing with DEMO DATA for demonstration purposes');
        
        // Simulate existing user base (DEMO DATA)
        this.analyticsData = {
            totalUsers: 1247,
            totalGenerations: 8932,
            totalWinners: 423,
            totalPrizeMoney: 2847650,
            isDemoData: true,  // Flag to indicate this is demo data
            tierPerformance: {
                basic: { 
                    winRate: 12.5, 
                    avgWin: 1250, 
                    totalUsers: 487,
                    totalWins: 61
                },
                standard: { 
                    winRate: 18.3, 
                    avgWin: 3750, 
                    totalUsers: 532,
                    totalWins: 97
                },
                premium: { 
                    winRate: 24.7, 
                    avgWin: 8900, 
                    totalUsers: 228,
                    totalWins: 56
                }
            },
            recentWins: [
                { user: 'Sarah M.', amount: 50000, tier: 'standard', date: '2025-01-15' },
                { user: 'John D.', amount: 10000, tier: 'premium', date: '2025-01-14' },
                { user: 'Maria G.', amount: 5000, tier: 'basic', date: '2025-01-13' },
                { user: 'Mike R.', amount: 100000, tier: 'premium', date: '2025-01-12' },
                { user: 'Lisa K.', amount: 25000, tier: 'standard', date: '2025-01-11' }
            ],
            topWinners: [
                { user: 'Mike R.', amount: 287500, tier: 'premium', wins: 12 },
                { user: 'Sarah M.', amount: 156000, tier: 'standard', wins: 18 },
                { user: 'John D.', amount: 143200, tier: 'premium', wins: 9 }
            ]
        };
        
        this.saveAnalyticsData();
    },
    
    /**
     * Load analytics data
     */
    loadAnalyticsData() {
        const saved = localStorage.getItem('pickEm_analyticsData');
        
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.analyticsData = { ...this.analyticsData, ...data };
            } catch (e) {
                console.warn('Failed to load analytics data:', e);
            }
        }
    },
    
    /**
     * Save analytics data
     */
    saveAnalyticsData() {
        localStorage.setItem('pickEm_analyticsData', JSON.stringify(this.analyticsData));
    },
    
    /**
     * Track a generation
     */
    trackGeneration(tier) {
        this.analyticsData.totalGenerations++;
        
        this.saveAnalyticsData();
    },
    
    /**
     * Track a new user
     */
    trackNewUser(tier) {
        this.analyticsData.totalUsers++;
        
        if (this.analyticsData.tierPerformance[tier]) {
            this.analyticsData.tierPerformance[tier].totalUsers++;
        }
        
        this.saveAnalyticsData();
    },
    
    /**
     * Track a win
     */
    trackWin(userData) {
        this.analyticsData.totalWinners++;
        this.analyticsData.totalPrizeMoney += userData.amount;
        
        // Update tier performance
        if (this.analyticsData.tierPerformance[userData.tier]) {
            const tierData = this.analyticsData.tierPerformance[userData.tier];
            
            if (!tierData.totalWins) {
                tierData.totalWins = 0;
                tierData.totalWinAmount = 0;
            }
            
            tierData.totalWins++;
            tierData.totalWinAmount = (tierData.totalWinAmount || 0) + userData.amount;
            
            // Recalculate average win
            tierData.avgWin = tierData.totalWinAmount / tierData.totalWins;
            
            // Recalculate win rate (assuming some losses tracked elsewhere)
            const totalGames = tierData.totalUsers * 5; // Rough estimate
            tierData.winRate = (tierData.totalWins / totalGames) * 100;
        }
        
        // Add to recent wins
        this.analyticsData.recentWins.unshift({
            user: this.anonymizeUsername(userData.userId),
            amount: userData.amount,
            tier: userData.tier,
            date: new Date().toISOString().split('T')[0]
        });
        
        // Keep only last 10 recent wins
        if (this.analyticsData.recentWins.length > 10) {
            this.analyticsData.recentWins.pop();
        }
        
        this.saveAnalyticsData();
    },
    
    /**
     * Anonymize username for privacy
     */
    anonymizeUsername(userId) {
        // Convert user ID to anonymized display name
        const hash = userId.split('-').pop() || 'XXXX';
        const names = [
            'Sarah', 'John', 'Maria', 'Mike', 'Lisa', 'David', 'Emma', 'Ryan',
            'Alex', 'Chris', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Morgan'
        ];
        const lastInitials = ['M.', 'D.', 'G.', 'R.', 'K.', 'S.', 'W.', 'P.', 'B.', 'T.'];
        
        const nameIndex = parseInt(hash.substring(0, 2), 36) % names.length;
        const initialIndex = parseInt(hash.substring(2, 4), 36) % lastInitials.length;
        
        return names[nameIndex] + ' ' + lastInitials[initialIndex];
    },
    
    /**
     * Get community statistics
     */
    getCommunityStats() {
        const totalGames = this.analyticsData.totalGenerations;
        const winRate = totalGames > 0 
            ? (this.analyticsData.totalWinners / totalGames) * 100
            : 0;
        
        return {
            totalUsers: this.analyticsData.totalUsers,
            totalGenerations: this.analyticsData.totalGenerations,
            totalWinners: this.analyticsData.totalWinners,
            totalPrizeMoney: this.analyticsData.totalPrizeMoney,
            winRate: winRate
        };
    },
    
    /**
     * Get tier performance data
     */
    getTierPerformance() {
        return this.analyticsData.tierPerformance;
    },
    
    /**
     * Get recent wins
     */
    getRecentWins() {
        return this.analyticsData.recentWins;
    },
    
    /**
     * Get top winners
     */
    getTopWinners() {
        return this.analyticsData.topWinners;
    },
    
    /**
     * Update community stats (called after user actions)
     */
    updateCommunityStats() {
        // Get data from tracker
        if (!window.PickEmTracker) return;
        
        const communityData = window.PickEmTracker.getCommunityData();
        
        // Update analytics based on community data
        const totalGames = communityData.totalWins + communityData.totalLosses;
        
        this.analyticsData.totalWinners = communityData.winners.length;
        this.analyticsData.totalPrizeMoney = communityData.totalPrizeMoney;
        
        // Calculate overall win rate
        if (totalGames > 0) {
            const winRate = (communityData.totalWins / totalGames) * 100;
            // Update in analytics
        }
        
        this.saveAnalyticsData();
    },
    
    /**
     * Generate performance report
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            community: this.getCommunityStats(),
            tierPerformance: this.getTierPerformance(),
            recentWins: this.getRecentWins(),
            topWinners: this.getTopWinners(),
            insights: this.generateInsights()
        };
        
        return report;
    },
    
    /**
     * Generate insights from data
     */
    generateInsights() {
        const insights = [];
        
        // Analyze tier performance
        const tiers = this.analyticsData.tierPerformance;
        
        // Find best performing tier
        let bestTier = 'basic';
        let bestRate = tiers.basic.winRate;
        
        Object.keys(tiers).forEach(tier => {
            if (tiers[tier].winRate > bestRate) {
                bestRate = tiers[tier].winRate;
                bestTier = tier;
            }
        });
        
        insights.push({
            type: 'best_tier',
            message: `${bestTier.toUpperCase()} tier has the highest win rate at ${bestRate.toFixed(1)}%`,
            tier: bestTier,
            value: bestRate
        });
        
        // Analyze average wins
        Object.keys(tiers).forEach(tier => {
            if (tiers[tier].avgWin > 0) {
                insights.push({
                    type: 'average_win',
                    message: `Average win for ${tier.toUpperCase()} tier: $${tiers[tier].avgWin.toLocaleString()}`,
                    tier: tier,
                    value: tiers[tier].avgWin
                });
            }
        });
        
        // Total prize money insight
        if (this.analyticsData.totalPrizeMoney > 0) {
            insights.push({
                type: 'total_prizes',
                message: `Total prizes won by community: $${this.analyticsData.totalPrizeMoney.toLocaleString()}`,
                value: this.analyticsData.totalPrizeMoney
            });
        }
        
        return insights;
    },
    
    /**
     * Calculate ROI for each tier
     */
    calculateTierROI() {
        const tiers = this.analyticsData.tierPerformance;
        const pricing = { basic: 5, standard: 15, premium: 30 };
        
        const roiData = {};
        
        Object.keys(tiers).forEach(tier => {
            const tierData = tiers[tier];
            const price = pricing[tier];
            
            if (tierData.totalWins > 0 && tierData.avgWin > 0) {
                const expectedValue = (tierData.winRate / 100) * tierData.avgWin;
                const roi = ((expectedValue - price) / price) * 100;
                
                roiData[tier] = {
                    expectedValue: expectedValue,
                    roi: roi,
                    breakeven: price / (tierData.winRate / 100)
                };
            }
        });
        
        return roiData;
    },
    
    /**
     * Export analytics data
     */
    exportAnalytics() {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: this.version,
            analytics: this.analyticsData,
            report: this.generateReport(),
            tierROI: this.calculateTierROI()
        };
        
        return exportData;
    },
    
    /**
     * Get visualization data for charts
     */
    getVisualizationData() {
        return {
            tierComparison: {
                labels: ['Basic', 'Standard', 'Premium'],
                winRates: [
                    this.analyticsData.tierPerformance.basic.winRate,
                    this.analyticsData.tierPerformance.standard.winRate,
                    this.analyticsData.tierPerformance.premium.winRate
                ],
                avgWins: [
                    this.analyticsData.tierPerformance.basic.avgWin,
                    this.analyticsData.tierPerformance.standard.avgWin,
                    this.analyticsData.tierPerformance.premium.avgWin
                ],
                userCounts: [
                    this.analyticsData.tierPerformance.basic.totalUsers,
                    this.analyticsData.tierPerformance.standard.totalUsers,
                    this.analyticsData.tierPerformance.premium.totalUsers
                ]
            },
            recentActivity: this.analyticsData.recentWins,
            topPerformers: this.analyticsData.topWinners
        };
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PickEmAnalytics.init());
} else {
    window.PickEmAnalytics.init();
}
