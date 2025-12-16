/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GEMBOT ENHANCED ADMIN API
 * ═══════════════════════════════════════════════════════════════════════════
 * Connects admin dashboard to all GemBot systems
 * - AI Agents
 * - Automated Wallets
 * - Anti-Fraud Security
 * - Multi-Domain Network
 * - Live Site Editing
 * ═══════════════════════════════════════════════════════════════════════════
 */

class GemBotAdminAPI {
    constructor() {
        this.adminEmail = 'barbrickdesign@gmail.com';
        this.githubToken = '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';
        this.authenticated = false;
        
        console.log('🔧 GemBot Admin API initialized');
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * AI AGENTS MANAGEMENT
     * ═══════════════════════════════════════════════════════════════════
     */
    
    /**
     * Get all AI agents with full details
     */
    getAllAIAgents() {
        if (!window.AIAgentManager) {
            console.warn('⚠️ AIAgentManager not loaded');
            return [];
        }
        
        const agents = window.AIAgentManager.getAllData();
        
        // Enrich with wallet and security data
        return agents.map(agent => ({
            ...agent,
            wallet: this.getAgentWallet(agent.id),
            security: this.getAgentSecurity(agent.id),
            type: 'AI'
        }));
    }
    
    /**
     * Get AI agent statistics
     */
    getAIStats() {
        if (!window.AIAgentManager) return null;
        return window.AIAgentManager.getStatistics();
    }
    
    /**
     * Spawn AI agents
     */
    spawnAIAgents(count) {
        if (!window.spawnAIAgents) {
            console.error('❌ AI Agent system not loaded');
            return false;
        }
        window.spawnAIAgents(count);
        return true;
    }
    
    /**
     * Stop all AI agents
     */
    stopAllAIAgents() {
        if (!window.stopAIAgents) return false;
        window.stopAIAgents();
        return true;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * USER & WALLET MANAGEMENT
     * ═══════════════════════════════════════════════════════════════════
     */
    
    /**
     * Get all users (real users)
     */
    getAllUsers() {
        const wallets = JSON.parse(localStorage.getItem('gembot_wallets') || '{}');
        
        return Object.values(wallets).map(wallet => ({
            id: wallet.publicKey,
            username: wallet.username,
            email: wallet.email,
            walletAddress: wallet.publicKey,
            balance: wallet.gbuvBalance || 0,
            welcomeBonus: wallet.welcomeBonus || 100,
            security: wallet.security || { score: 0, flagged: false },
            created: wallet.created,
            type: 'USER'
        }));
    }
    
    /**
     * Get all entities (users + AI agents)
     */
    getAllEntities() {
        const users = this.getAllUsers();
        const agents = this.getAllAIAgents();
        
        return [...users, ...agents].sort((a, b) => {
            // Sort by GBUV balance descending
            return (b.balance || 0) - (a.balance || 0);
        });
    }
    
    /**
     * Get agent wallet
     */
    getAgentWallet(agentId) {
        const wallets = JSON.parse(localStorage.getItem('gembot_wallets') || '{}');
        const agentWallet = Object.values(wallets).find(w => w.username === agentId);
        return agentWallet || null;
    }
    
    /**
     * Get agent security data
     */
    getAgentSecurity(agentId) {
        const wallet = this.getAgentWallet(agentId);
        return wallet?.security || { score: 0, flagged: false };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * SECURITY & FRAUD DETECTION
     * ═══════════════════════════════════════════════════════════════════
     */
    
    /**
     * Get security dashboard data
     */
    getSecurityDashboard() {
        const wallets = JSON.parse(localStorage.getItem('gembot_wallets') || '{}');
        const allWallets = Object.values(wallets);
        
        const total = allWallets.length;
        const flagged = allWallets.filter(w => w.security?.flagged).length;
        const safe = total - flagged;
        
        const totalBonus = allWallets.reduce((sum, w) => sum + (w.welcomeBonus || 100), 0);
        const avgScore = total > 0 
            ? allWallets.reduce((sum, w) => sum + (w.security?.score || 0), 0) / total 
            : 0;
        
        return {
            total,
            safe,
            flagged,
            flaggedPercent: total > 0 ? (flagged / total * 100).toFixed(1) : 0,
            totalBonusDistributed: totalBonus,
            averageSecurityScore: avgScore.toFixed(1),
            recentFlagged: allWallets
                .filter(w => w.security?.flagged)
                .slice(0, 10)
                .map(w => ({
                    username: w.username,
                    email: w.email,
                    score: w.security.score,
                    bonus: w.welcomeBonus,
                    created: w.created
                }))
        };
    }
    
    /**
     * Get IP tracking data
     */
    getIPTracking() {
        const ipData = JSON.parse(localStorage.getItem('ip_tracking') || '{}');
        
        return Object.entries(ipData).map(([ip, accounts]) => ({
            ip,
            accountCount: accounts.length,
            suspicious: accounts.length >= 3,
            firstSeen: accounts[0]?.timestamp,
            lastSeen: accounts[accounts.length - 1]?.timestamp
        })).sort((a, b) => b.accountCount - a.accountCount);
    }
    
    /**
     * Get device fingerprint data
     */
    getDeviceFingerprints() {
        const prints = JSON.parse(localStorage.getItem('fingerprint_tracking') || '{}');
        
        return Object.entries(prints).map(([fp, accounts]) => ({
            fingerprint: fp.substring(0, 16) + '...',
            accountCount: accounts.length,
            suspicious: accounts.length >= 2,
            firstSeen: accounts[0]?.timestamp,
            lastSeen: accounts[accounts.length - 1]?.timestamp
        })).sort((a, b) => b.accountCount - a.accountCount);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * MULTI-DOMAIN NETWORK
     * ═══════════════════════════════════════════════════════════════════
     */
    
    /**
     * Get all 15 domains
     */
    getAllDomains() {
        return [
            { name: 'betterbook.co.uk', theme: 'Knowledge Hub', status: 'pending' },
            { name: 'electrical-airplane.com', theme: 'Aviation', status: 'pending' },
            { name: 'hermeticmicro.com', theme: 'Esoteric Tech', status: 'pending' },
            { name: 'madeinnatoalliance.org', theme: 'Defense', status: 'pending' },
            { name: 'messier-45.com', theme: 'Space', status: 'pending' },
            { name: 'oc-tc.com', theme: 'Corporate', status: 'pending' },
            { name: 'orioncrusader.com', theme: 'Military', status: 'pending' },
            { name: 'realhogwarts.com', theme: 'Magic Education', status: 'pending' },
            { name: 'robertcrobertsoniii.com', theme: 'Personal', status: 'pending' },
            { name: 'the-autobots.com', theme: 'Robotics', status: 'active' },
            { name: 'theduesenberg.com', theme: 'Luxury', status: 'pending' },
            { name: 'topofthepyramid.org', theme: 'Elite Network', status: 'pending' },
            { name: 'trismegistus-capital.com', theme: 'Finance', status: 'pending' },
            { name: 'trismegistustech.com', theme: 'Technology', status: 'pending' },
            { name: 'truetemple.org', theme: 'Spiritual', status: 'pending' }
        ];
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * MACHINE CONTROL
     * ═══════════════════════════════════════════════════════════════════
     */
    
    /**
     * Get all deployed machines
     */
    getAllMachines() {
        // Get from localStorage
        const allKeys = Object.keys(localStorage);
        const saveKeys = allKeys.filter(k => k.includes('gembot_farm_save'));
        
        const machines = [];
        saveKeys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data?.machines) {
                    data.machines.forEach((machine, index) => {
                        machines.push({
                            owner: key.replace('gembot_farm_save_', ''),
                            machineId: `${key}_${index}`,
                            type: machine.type || 'standard',
                            level: machine.level || 1,
                            earnings: machine.earnings || 0,
                            deployed: machine.deployed || Date.now()
                        });
                    });
                }
            } catch (e) {}
        });
        
        return machines;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * LIVE ACTIVITY FEED
     * ═══════════════════════════════════════════════════════════════════
     */
    
    /**
     * Get recent activity
     */
    getRecentActivity(limit = 50) {
        if (!window.liveActivityFeed) return [];
        
        // Get from activity feed's internal log
        const log = window.liveActivityFeed.activityLog || [];
        return log.slice(0, limit);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * AUTHENTICATION
     * ═══════════════════════════════════════════════════════════════════
     */
    
    /**
     * Authenticate admin
     */
    async authenticate(email, token) {
        if (email === this.adminEmail && token === this.githubToken) {
            this.authenticated = true;
            sessionStorage.setItem('gembot_admin_auth_v2', 'true');
            sessionStorage.setItem('gembot_admin_email', email);
            return { success: true, message: 'Authenticated successfully' };
        }
        return { success: false, message: 'Invalid credentials' };
    }
    
    /**
     * Check if authenticated
     */
    isAuthenticated() {
        return sessionStorage.getItem('gembot_admin_auth_v2') === 'true';
    }
    
    /**
     * Logout
     */
    logout() {
        this.authenticated = false;
        sessionStorage.removeItem('gembot_admin_auth_v2');
        sessionStorage.removeItem('gembot_admin_email');
    }
}

// Initialize global admin API
window.gemBotAdminAPI = new GemBotAdminAPI();

console.log('✅ GemBot Admin API loaded');
console.log('📝 Access via: window.gemBotAdminAPI');
console.log('👤 Admin Email: barbrickdesign@gmail.com');
