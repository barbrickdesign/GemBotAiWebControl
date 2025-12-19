/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * REPOSITORY NETWORK BUILDER
 * Automated Agent Deployment System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Creates and maintains links between repositories to enable resource sharing,
 * collaboration, and signal amplification. Agents from different repositories
 * can collaborate through these links to help each other and create a network
 * effect that benefits all developers.
 * 
 * Features:
 * - Automatic link creation based on similarities
 * - Cross-repository resource sharing
 * - Signal amplification network
 * - Link strength and quality metrics
 * - Network topology optimization
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class RepositoryNetworkBuilder {
    constructor() {
        this.links = new Map();
        this.network = {
            nodes: new Map(),
            edges: []
        };
        
        // Storage
        this.STORAGE_KEY = 'repo_network_v1';
        
        // Link settings
        this.MIN_SIMILARITY_SCORE = 0.3; // 30% similarity to create link
        this.MAX_LINKS_PER_REPO = 20;
        this.LINK_STRENGTH_DECAY = 0.01; // Links decay 1% per day without activity
        
        this.loadFromStorage();
        console.log('🌐 Repository Network Builder initialized');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STORAGE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                this.links = new Map(Object.entries(parsed.links || {}));
                this.network.edges = parsed.edges || [];
                
                // Rebuild nodes from repositories
                this.rebuildNetwork();
            }
        } catch (error) {
            console.error('Error loading network data:', error);
        }
    }
    
    saveToStorage() {
        try {
            const data = {
                links: Object.fromEntries(this.links),
                edges: this.network.edges
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving network data:', error);
        }
    }
    
    rebuildNetwork() {
        if (!window.repoScanner) return;
        
        const repos = window.repoScanner.getAllRepositories();
        repos.forEach(repo => {
            this.network.nodes.set(repo.id, {
                id: repo.id,
                name: repo.name,
                owner: repo.owner,
                health: repo.health.score,
                demand: repo.health.resourceDemand,
                linkCount: 0
            });
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LINK CREATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Create a link between two repositories
     * @param {string} repoA - First repository ID
     * @param {string} repoB - Second repository ID
     * @param {Object} options - Link options
     * @returns {Object} Created link
     */
    async createLink(repoA, repoB, options = {}) {
        console.log(`🔗 Creating link: ${repoA} <-> ${repoB}`);
        
        try {
            // Validation with fallbacks
            const validation = this.validateLink(repoA, repoB);
            if (!validation.valid) {
                console.warn(`Link validation failed: ${validation.reason}`);
                
                // Fallback: Create weaker link instead
                if (validation.fallbackStrength && options.allowWeakLinks) {
                    console.log('Creating weak link as fallback');
                    options.initialStrength = validation.fallbackStrength;
                } else {
                    throw new Error(validation.reason);
                }
            }
            
            // Calculate similarity
            const similarity = await this.calculateSimilarity(repoA, repoB);
            
            // Create link
            const link = {
                id: `LINK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
                repoA: repoA,
                repoB: repoB,
                similarity: similarity,
                strength: options.initialStrength || similarity,
                type: options.type || this.determineLinkType(similarity),
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                resourceShared: 0,
                signalAmplification: 1.0,
                metadata: {
                    createdBy: options.createdBy || 'system',
                    purpose: options.purpose || 'auto-discovery'
                }
            };
            
            // Store link (bidirectional)
            const linkKeyAB = `${repoA}:${repoB}`;
            const linkKeyBA = `${repoB}:${repoA}`;
            this.links.set(linkKeyAB, link);
            this.links.set(linkKeyBA, link);
            
            // Add to network edges
            this.network.edges.push({
                source: repoA,
                target: repoB,
                weight: link.strength,
                type: link.type
            });
            
            // Update node link counts
            this.updateNodeLinkCount(repoA);
            this.updateNodeLinkCount(repoB);
            
            // Save state
            this.saveToStorage();
            
            console.log(`✅ Link created: ${link.id} (strength: ${link.strength.toFixed(2)})`);
            
            // Notify repositories
            this.notifyRepositories([repoA, repoB], 'link-created', link);
            
            return link;
            
        } catch (error) {
            console.error(`Failed to create link ${repoA} <-> ${repoB}:`, error);
            return null;
        }
    }
    
    /**
     * Validate link creation
     */
    validateLink(repoA, repoB) {
        // Can't link to self
        if (repoA === repoB) {
            return {
                valid: false,
                reason: 'Cannot link repository to itself'
            };
        }
        
        // Check if repositories exist
        const scannerAvailable = window.repoScanner;
        if (!scannerAvailable) {
            return {
                valid: false,
                reason: 'Repository scanner not available'
            };
        }
        
        const repoDataA = window.repoScanner.getRepository(repoA);
        const repoDataB = window.repoScanner.getRepository(repoB);
        
        if (!repoDataA || !repoDataB) {
            return {
                valid: false,
                reason: 'One or both repositories not found'
            };
        }
        
        // Check if link already exists
        const linkKey = `${repoA}:${repoB}`;
        if (this.links.has(linkKey)) {
            return {
                valid: false,
                reason: 'Link already exists',
                existingLink: this.links.get(linkKey)
            };
        }
        
        // Check link limit
        const linksA = this.getRepositoryLinks(repoA);
        const linksB = this.getRepositoryLinks(repoB);
        
        if (linksA.length >= this.MAX_LINKS_PER_REPO) {
            return {
                valid: false,
                reason: `Repository ${repoA} has maximum links`,
                fallbackStrength: 0.2 // Allow weak link
            };
        }
        
        if (linksB.length >= this.MAX_LINKS_PER_REPO) {
            return {
                valid: false,
                reason: `Repository ${repoB} has maximum links`,
                fallbackStrength: 0.2
            };
        }
        
        return { valid: true };
    }
    
    /**
     * Calculate similarity between two repositories
     */
    async calculateSimilarity(repoA, repoB) {
        if (!window.repoScanner) return 0.5; // Default fallback
        
        const dataA = window.repoScanner.getRepository(repoA);
        const dataB = window.repoScanner.getRepository(repoB);
        
        if (!dataA || !dataB) return 0;
        
        let score = 0;
        let factors = 0;
        
        // Language similarity
        const langsA = Object.keys(dataA.stats.languages);
        const langsB = Object.keys(dataB.stats.languages);
        const commonLangs = langsA.filter(l => langsB.includes(l));
        
        if (langsA.length > 0 && langsB.length > 0) {
            score += (commonLangs.length / Math.max(langsA.length, langsB.length)) * 0.3;
            factors++;
        }
        
        // Size similarity
        const sizeA = dataA.stats.totalFiles;
        const sizeB = dataB.stats.totalFiles;
        const sizeRatio = Math.min(sizeA, sizeB) / Math.max(sizeA, sizeB);
        score += sizeRatio * 0.2;
        factors++;
        
        // Health similarity
        const healthDiff = Math.abs(dataA.health.score - dataB.health.score);
        score += (100 - healthDiff) / 100 * 0.2;
        factors++;
        
        // Resource demand similarity
        const demandLevels = ['low', 'moderate', 'high', 'critical'];
        const demandA = demandLevels.indexOf(dataA.health.resourceDemand);
        const demandB = demandLevels.indexOf(dataB.health.resourceDemand);
        const demandDiff = Math.abs(demandA - demandB);
        score += (3 - demandDiff) / 3 * 0.3;
        factors++;
        
        // Normalize
        return factors > 0 ? score / factors : 0.5;
    }
    
    /**
     * Determine link type based on similarity
     */
    determineLinkType(similarity) {
        if (similarity >= 0.8) return 'strong';
        if (similarity >= 0.5) return 'moderate';
        if (similarity >= 0.3) return 'weak';
        return 'minimal';
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AUTOMATIC NETWORK BUILDING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Automatically discover and create links between repositories
     */
    async autoDiscoverLinks() {
        console.log('🔍 Auto-discovering repository links...');
        
        if (!window.repoScanner) {
            console.warn('Repository scanner not available');
            return [];
        }
        
        const repos = window.repoScanner.getAllRepositories();
        const createdLinks = [];
        
        // Compare each pair of repositories
        for (let i = 0; i < repos.length; i++) {
            for (let j = i + 1; j < repos.length; j++) {
                const repoA = repos[i];
                const repoB = repos[j];
                
                // Calculate similarity
                const similarity = await this.calculateSimilarity(repoA.id, repoB.id);
                
                // Create link if similar enough
                if (similarity >= this.MIN_SIMILARITY_SCORE) {
                    try {
                        const link = await this.createLink(repoA.id, repoB.id, {
                            purpose: 'auto-discovery',
                            allowWeakLinks: true
                        });
                        
                        if (link) {
                            createdLinks.push(link);
                        }
                    } catch (error) {
                        console.error(`Failed to create auto link:`, error);
                    }
                }
            }
        }
        
        console.log(`✅ Auto-discovered ${createdLinks.length} links`);
        return createdLinks;
    }
    
    /**
     * Optimize network topology
     */
    optimizeNetwork() {
        console.log('⚙️ Optimizing network topology...');
        
        // Remove weak links
        let removed = 0;
        this.links.forEach((link, key) => {
            if (link.strength < 0.2) {
                this.removeLink(key);
                removed++;
            }
        });
        
        // Apply decay to inactive links
        this.applyLinkDecay();
        
        console.log(`✅ Network optimized (removed ${removed} weak links)`);
    }
    
    /**
     * Apply decay to links based on inactivity
     */
    applyLinkDecay() {
        const now = Date.now();
        
        this.links.forEach((link, key) => {
            const lastActivity = new Date(link.lastActivity).getTime();
            const daysSinceActivity = (now - lastActivity) / 1000 / 60 / 60 / 24;
            
            if (daysSinceActivity > 1) {
                const decay = this.LINK_STRENGTH_DECAY * Math.floor(daysSinceActivity);
                link.strength = Math.max(0, link.strength - decay);
            }
        });
        
        this.saveToStorage();
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RESOURCE SHARING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Share resources between linked repositories
     */
    async shareResources(fromRepo, toRepo, amount) {
        console.log(`📦 Sharing resources: ${fromRepo} -> ${toRepo} (${amount})`);
        
        const linkKey = `${fromRepo}:${toRepo}`;
        const link = this.links.get(linkKey);
        
        if (!link) {
            throw new Error('No link exists between repositories');
        }
        
        // Update link metrics
        link.resourceShared += amount;
        link.lastActivity = new Date().toISOString();
        link.strength = Math.min(1.0, link.strength + 0.01); // Strengthen link
        
        this.saveToStorage();
        
        // Notify repositories
        this.notifyRepositories([fromRepo, toRepo], 'resource-shared', {
            from: fromRepo,
            to: toRepo,
            amount: amount
        });
        
        return true;
    }
    
    /**
     * Amplify signal through network
     */
    amplifySignal(sourceRepo, message, hops = 2) {
        console.log(`📡 Amplifying signal from ${sourceRepo} (${hops} hops)`);
        
        const reached = new Set([sourceRepo]);
        const toVisit = [{ repo: sourceRepo, hopsRemaining: hops }];
        
        while (toVisit.length > 0) {
            const current = toVisit.shift();
            
            if (current.hopsRemaining <= 0) continue;
            
            // Get linked repositories
            const links = this.getRepositoryLinks(current.repo);
            
            links.forEach(link => {
                const otherRepo = link.repoA === current.repo ? link.repoB : link.repoA;
                
                if (!reached.has(otherRepo)) {
                    reached.add(otherRepo);
                    
                    // Apply signal amplification
                    const amplifiedMessage = {
                        ...message,
                        amplification: (message.amplification || 1.0) * link.signalAmplification
                    };
                    
                    // Notify repository
                    this.notifyRepositories([otherRepo], 'signal-received', amplifiedMessage);
                    
                    // Add to visit queue
                    toVisit.push({
                        repo: otherRepo,
                        hopsRemaining: current.hopsRemaining - 1
                    });
                }
            });
        }
        
        console.log(`✅ Signal reached ${reached.size} repositories`);
        return Array.from(reached);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LINK MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get all links for a repository
     */
    getRepositoryLinks(repoId) {
        return Array.from(this.links.values()).filter(
            link => link.repoA === repoId || link.repoB === repoId
        );
    }
    
    /**
     * Get link between two repositories
     */
    getLink(repoA, repoB) {
        const key = `${repoA}:${repoB}`;
        return this.links.get(key);
    }
    
    /**
     * Remove a link
     */
    removeLink(linkKey) {
        const link = this.links.get(linkKey);
        if (!link) return false;
        
        // Remove both directions
        this.links.delete(`${link.repoA}:${link.repoB}`);
        this.links.delete(`${link.repoB}:${link.repoA}`);
        
        // Remove from edges
        this.network.edges = this.network.edges.filter(
            edge => !(edge.source === link.repoA && edge.target === link.repoB)
        );
        
        this.saveToStorage();
        return true;
    }
    
    /**
     * Update node link count
     */
    updateNodeLinkCount(repoId) {
        const node = this.network.nodes.get(repoId);
        if (node) {
            node.linkCount = this.getRepositoryLinks(repoId).length;
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // NETWORK QUERIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get network graph data
     */
    getNetworkGraph() {
        return {
            nodes: Array.from(this.network.nodes.values()),
            edges: this.network.edges
        };
    }
    
    /**
     * Find path between two repositories
     */
    findPath(fromRepo, toRepo, maxHops = 5) {
        const visited = new Set();
        const queue = [{ repo: fromRepo, path: [fromRepo] }];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.path.length > maxHops) continue;
            if (current.repo === toRepo) return current.path;
            
            visited.add(current.repo);
            
            const links = this.getRepositoryLinks(current.repo);
            links.forEach(link => {
                const nextRepo = link.repoA === current.repo ? link.repoB : link.repoA;
                
                if (!visited.has(nextRepo)) {
                    queue.push({
                        repo: nextRepo,
                        path: [...current.path, nextRepo]
                    });
                }
            });
        }
        
        return null; // No path found
    }
    
    /**
     * Get network statistics
     */
    getStats() {
        const links = Array.from(this.links.values());
        const uniqueLinks = links.filter((link, index, self) =>
            index === self.findIndex(l => l.id === link.id)
        );
        
        return {
            totalNodes: this.network.nodes.size,
            totalLinks: uniqueLinks.length,
            averageLinkStrength: uniqueLinks.reduce((sum, l) => sum + l.strength, 0) / uniqueLinks.length || 0,
            linksByType: this.getLinkCountByType(),
            totalResourceShared: uniqueLinks.reduce((sum, l) => sum + l.resourceShared, 0),
            mostConnectedRepo: this.getMostConnectedRepository()
        };
    }
    
    getLinkCountByType() {
        const counts = {};
        const uniqueLinks = Array.from(new Set(Array.from(this.links.values()).map(l => l.id)));
        
        uniqueLinks.forEach(linkId => {
            const link = Array.from(this.links.values()).find(l => l.id === linkId);
            if (link) {
                counts[link.type] = (counts[link.type] || 0) + 1;
            }
        });
        
        return counts;
    }
    
    getMostConnectedRepository() {
        let maxLinks = 0;
        let topRepo = null;
        
        this.network.nodes.forEach((node, repoId) => {
            if (node.linkCount > maxLinks) {
                maxLinks = node.linkCount;
                topRepo = repoId;
            }
        });
        
        return topRepo ? { repoId: topRepo, linkCount: maxLinks } : null;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    notifyRepositories(repoIds, event, data) {
        repoIds.forEach(repoId => {
            window.dispatchEvent(new CustomEvent('repo-network', {
                detail: { repoId, event, data }
            }));
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

window.RepositoryNetworkBuilder = RepositoryNetworkBuilder;
window.repoNetwork = new RepositoryNetworkBuilder();

console.log('✅ Repository Network Builder loaded');
console.log('📖 Usage: await window.repoNetwork.createLink("owner1/repo1", "owner2/repo2")');
