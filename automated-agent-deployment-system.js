/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTOMATED AGENT DEPLOYMENT SYSTEM - MAIN ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Main coordination system that ties together all components of the automated
 * agent deployment system. Manages the complete lifecycle of repository scanning,
 * agent deployment, network building, and resource allocation.
 * 
 * Purpose: Help developers in intense development mode by automatically deploying
 * agents that create links between repositories, enabling resource sharing and
 * collaboration. The system creates a network effect that amplifies signals and
 * resources across the developer community.
 * 
 * Components:
 * - Repository Scanner: Discovers and indexes repository files
 * - Agent Deployment Orchestrator: Deploys and manages agents
 * - Repository Network Builder: Creates and maintains repository links
 * - Bubble Map Visualizer: Visualizes the network
 * - Resource Monitor: Tracks resource demand and allocation
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class AutomatedAgentDeploymentSystem {
    constructor() {
        this.initialized = false;
        this.components = {
            scanner: null,
            orchestrator: null,
            network: null,
            visualizer: null
        };
        
        this.state = {
            systemHealth: 100,
            activeRepositories: 0,
            activeAgents: 0,
            activeLinks: 0,
            totalResourcesShared: 0
        };
        
        // Auto-deployment settings
        this.autoDeployEnabled = true;
        this.autoDeployInterval = 60000; // 1 minute
        this.networkOptimizeInterval = 300000; // 5 minutes
        
        this.intervals = [];
        
        console.log('🤖 Automated Agent Deployment System created');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Initialize the entire system
     * @param {Object} config - System configuration
     * @returns {Promise<void>}
     */
    async init(config = {}) {
        console.log('🚀 Initializing Automated Agent Deployment System...');
        
        try {
            // Initialize components with fallbacks
            await this.initializeComponents(config);
            
            // Setup automatic processes
            this.setupAutomation();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            
            console.log('✅ System initialized successfully');
            
            // Show welcome message
            this.showWelcomeMessage();
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize system:', error);
            
            // Try fallback initialization
            console.log('Attempting fallback initialization...');
            await this.fallbackInitialization();
            
            return false;
        }
    }
    
    /**
     * Initialize all system components
     */
    async initializeComponents(config) {
        console.log('Initializing components...');
        
        // Initialize Repository Scanner
        try {
            this.components.scanner = window.repoScanner || new window.RepositoryScanner();
            console.log('  ✓ Repository Scanner ready');
        } catch (error) {
            console.error('  ✗ Scanner initialization failed:', error);
            throw error;
        }
        
        // Initialize Agent Orchestrator
        try {
            this.components.orchestrator = window.agentOrchestrator || new window.AgentDeploymentOrchestrator();
            console.log('  ✓ Agent Orchestrator ready');
        } catch (error) {
            console.error('  ✗ Orchestrator initialization failed:', error);
            throw error;
        }
        
        // Initialize Network Builder
        try {
            this.components.network = window.repoNetwork || new window.RepositoryNetworkBuilder();
            console.log('  ✓ Network Builder ready');
        } catch (error) {
            console.error('  ✗ Network builder initialization failed:', error);
            throw error;
        }
        
        // Initialize Visualizer (optional)
        if (config.visualizerId) {
            try {
                this.components.visualizer = new window.BubbleMapVisualizer(config.visualizerId);
                await this.components.visualizer.init();
                console.log('  ✓ Bubble Map Visualizer ready');
            } catch (error) {
                console.warn('  ⚠ Visualizer initialization failed (non-critical):', error);
                this.components.visualizer = null;
            }
        }
    }
    
    /**
     * Fallback initialization if primary method fails
     */
    async fallbackInitialization() {
        console.log('Running fallback initialization...');
        
        // Create minimal working system
        this.components.scanner = { initialized: true };
        this.components.orchestrator = { initialized: true };
        this.components.network = { initialized: true };
        
        console.log('⚠️ System running in degraded mode');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AUTOMATION SETUP
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Setup automatic processes
     */
    setupAutomation() {
        console.log('Setting up automation...');
        
        if (this.autoDeployEnabled) {
            // Auto-deploy agents
            const deployInterval = setInterval(async () => {
                await this.runAutoDeployment();
            }, this.autoDeployInterval);
            this.intervals.push(deployInterval);
            
            // Auto-discover links
            const linkInterval = setInterval(async () => {
                await this.runAutoLinking();
            }, this.autoDeployInterval * 2);
            this.intervals.push(linkInterval);
            
            // Optimize network
            const optimizeInterval = setInterval(() => {
                this.optimizeNetwork();
            }, this.networkOptimizeInterval);
            this.intervals.push(optimizeInterval);
            
            // Monitor health
            const healthInterval = setInterval(() => {
                this.monitorSystemHealth();
            }, 30000); // 30 seconds
            this.intervals.push(healthInterval);
            
            console.log('✓ Automation enabled');
        }
    }
    
    /**
     * Run automatic agent deployment
     */
    async runAutoDeployment() {
        console.log('🤖 Running automatic agent deployment...');
        
        try {
            const deployed = await this.components.orchestrator.autoDeployAgents();
            console.log(`✅ Auto-deployed ${deployed.length} agents`);
            
            // Update state
            this.updateState();
            
        } catch (error) {
            console.error('Auto-deployment failed:', error);
        }
    }
    
    /**
     * Run automatic link discovery
     */
    async runAutoLinking() {
        console.log('🔗 Running automatic link discovery...');
        
        try {
            const links = await this.components.network.autoDiscoverLinks();
            console.log(`✅ Auto-discovered ${links.length} links`);
            
            // Update state
            this.updateState();
            
        } catch (error) {
            console.error('Auto-linking failed:', error);
        }
    }
    
    /**
     * Optimize network topology
     */
    optimizeNetwork() {
        console.log('⚙️ Optimizing network...');
        
        try {
            this.components.network.optimizeNetwork();
            console.log('✅ Network optimized');
        } catch (error) {
            console.error('Network optimization failed:', error);
        }
    }
    
    /**
     * Monitor system health
     */
    monitorSystemHealth() {
        try {
            // Check component health
            let healthScore = 100;
            
            if (!this.components.scanner) healthScore -= 25;
            if (!this.components.orchestrator) healthScore -= 25;
            if (!this.components.network) healthScore -= 25;
            if (!this.components.visualizer) healthScore -= 10;
            
            // Monitor agents
            if (this.components.orchestrator) {
                this.components.orchestrator.monitorAgentHealth();
            }
            
            this.state.systemHealth = healthScore;
            
            if (healthScore < 50) {
                console.warn(`⚠️ System health low: ${healthScore}`);
            }
        } catch (error) {
            console.error('Health monitoring failed:', error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // REPOSITORY MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Add and scan a repository
     */
    async addRepository(repoInfo) {
        console.log(`📦 Adding repository: ${repoInfo.owner}/${repoInfo.name}`);
        
        try {
            // Scan repository
            const repo = await this.components.scanner.scanRepository(repoInfo);
            
            if (!repo) {
                throw new Error('Repository scan failed');
            }
            
            // Deploy initial agents
            const agents = await this.deployInitialAgents(repo.id);
            console.log(`  Deployed ${agents.length} initial agents`);
            
            // Discover links
            const links = await this.discoverLinks(repo.id);
            console.log(`  Discovered ${links.length} links`);
            
            // Update state
            this.updateState();
            
            // Refresh visualization
            if (this.components.visualizer) {
                this.components.visualizer.refresh();
            }
            
            console.log(`✅ Repository added: ${repo.id}`);
            
            return repo;
            
        } catch (error) {
            console.error(`Failed to add repository:`, error);
            return null;
        }
    }
    
    /**
     * Deploy initial agents to a repository
     */
    async deployInitialAgents(repoId) {
        const agents = [];
        
        // Always deploy resource monitor
        try {
            const monitor = await this.components.orchestrator.deployAgent(
                repoId,
                'RESOURCE_MONITOR',
                { priority: 'high' }
            );
            if (monitor) agents.push(monitor);
        } catch (error) {
            console.warn('Failed to deploy resource monitor:', error);
        }
        
        // Deploy code helper
        try {
            const helper = await this.components.orchestrator.deployAgent(
                repoId,
                'CODE_HELPER',
                { priority: 'medium' }
            );
            if (helper) agents.push(helper);
        } catch (error) {
            console.warn('Failed to deploy code helper:', error);
        }
        
        return agents;
    }
    
    /**
     * Discover links for a repository
     */
    async discoverLinks(repoId) {
        const links = [];
        const allRepos = this.components.scanner.getAllRepositories();
        
        for (const otherRepo of allRepos) {
            if (otherRepo.id === repoId) continue;
            
            try {
                const link = await this.components.network.createLink(
                    repoId,
                    otherRepo.id,
                    { allowWeakLinks: true }
                );
                
                if (link) links.push(link);
            } catch (error) {
                // Expected to fail for some pairs
            }
        }
        
        return links;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RESOURCE ALLOCATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Allocate resources to a repository in need
     */
    async allocateResources(targetRepoId, amount) {
        console.log(`📦 Allocating ${amount} resources to ${targetRepoId}`);
        
        try {
            // Find repositories with spare resources
            const allRepos = this.components.scanner.getAllRepositories();
            const donors = allRepos.filter(r =>
                r.id !== targetRepoId &&
                r.health.resourceDemand === 'low' &&
                r.health.score > 70
            );
            
            if (donors.length === 0) {
                console.warn('No donors available');
                return false;
            }
            
            // Distribute from donors
            const perDonor = Math.ceil(amount / donors.length);
            
            for (const donor of donors) {
                try {
                    await this.components.network.shareResources(
                        donor.id,
                        targetRepoId,
                        perDonor
                    );
                } catch (error) {
                    console.warn(`Resource sharing failed from ${donor.id}:`, error);
                }
            }
            
            this.state.totalResourcesShared += amount;
            
            console.log(`✅ Resources allocated`);
            return true;
            
        } catch (error) {
            console.error('Resource allocation failed:', error);
            return false;
        }
    }
    
    /**
     * Request help for a repository
     */
    async requestHelp(repoId, helpType = 'general') {
        console.log(`🆘 Help requested for ${repoId}: ${helpType}`);
        
        try {
            // Deploy specialized agents
            const agentTypes = this.determineHelpAgents(helpType);
            const agents = [];
            
            for (const type of agentTypes) {
                const agent = await this.components.orchestrator.deployAgent(repoId, type);
                if (agent) agents.push(agent);
            }
            
            // Amplify signal through network
            const message = {
                type: 'help-request',
                repoId: repoId,
                helpType: helpType,
                timestamp: new Date().toISOString()
            };
            
            const reached = this.components.network.amplifySignal(repoId, message, 3);
            
            console.log(`✅ Help deployed: ${agents.length} agents, signal reached ${reached.length} repos`);
            
            return { agents, reached };
            
        } catch (error) {
            console.error('Help request failed:', error);
            return null;
        }
    }
    
    /**
     * Determine which agents to deploy for help type
     */
    determineHelpAgents(helpType) {
        const agentMap = {
            general: ['CODE_HELPER', 'DOC_WRITER'],
            testing: ['TEST_RUNNER', 'SECURITY_SCANNER'],
            deployment: ['DEPLOY_AGENT', 'RESOURCE_MONITOR'],
            documentation: ['DOC_WRITER', 'CODE_HELPER'],
            security: ['SECURITY_SCANNER', 'CODE_HELPER'],
            collaboration: ['COLLAB_COORDINATOR', 'LINK_BUILDER']
        };
        
        return agentMap[helpType] || agentMap.general;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Update system state
     */
    updateState() {
        this.state.activeRepositories = this.components.scanner?.getAllRepositories().length || 0;
        this.state.activeAgents = this.components.orchestrator?.getAllAgents().length || 0;
        this.state.activeLinks = this.components.network?.getStats().totalLinks || 0;
    }
    
    /**
     * Get system statistics
     */
    getStats() {
        return {
            system: this.state,
            repositories: this.components.scanner?.getStats(),
            agents: this.components.orchestrator?.getStats(),
            network: this.components.network?.getStats()
        };
    }
    
    /**
     * Get system status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            health: this.state.systemHealth,
            autoDeployEnabled: this.autoDeployEnabled,
            components: {
                scanner: !!this.components.scanner,
                orchestrator: !!this.components.orchestrator,
                network: !!this.components.network,
                visualizer: !!this.components.visualizer
            },
            stats: this.state
        };
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT HANDLING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for developer value events
        window.addEventListener('devvalue:contribution', (e) => {
            console.log('Developer contribution detected:', e.detail);
        });
        
        // Listen for network events
        window.addEventListener('repo-network', (e) => {
            this.handleNetworkEvent(e.detail);
        });
        
        // Listen for agent events
        window.addEventListener('agent-deployment', (e) => {
            this.handleAgentEvent(e.detail);
        });
    }
    
    handleNetworkEvent(detail) {
        console.log('Network event:', detail.event);
        this.updateState();
    }
    
    handleAgentEvent(detail) {
        console.log('Agent event:', detail.event);
        this.updateState();
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UI HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        console.log(`
═══════════════════════════════════════════════════════════════════════════════
🤖 AUTOMATED AGENT DEPLOYMENT SYSTEM READY
═══════════════════════════════════════════════════════════════════════════════

The system is now actively helping developers by:
✓ Automatically scanning and indexing repositories
✓ Deploying agents to assist with development tasks
✓ Creating links between repositories for resource sharing
✓ Amplifying signals across the network
✓ Allocating resources to repositories in need

Get Started:
  window.aads.addRepository({owner: 'user', name: 'repo'})
  window.aads.requestHelp('user/repo', 'testing')
  window.aads.getStats()

Owner: Ryan Barbrick / Barbrick Design
Contact: BarbrickDesign@gmail.com

═══════════════════════════════════════════════════════════════════════════════
        `);
    }
    
    /**
     * Shutdown the system
     */
    shutdown() {
        console.log('Shutting down system...');
        
        // Clear intervals
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        
        // Stop visualizer
        if (this.components.visualizer) {
            this.components.visualizer.stop();
        }
        
        this.initialized = false;
        console.log('✅ System shut down');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

window.AutomatedAgentDeploymentSystem = AutomatedAgentDeploymentSystem;
window.aads = new AutomatedAgentDeploymentSystem();

console.log('✅ Automated Agent Deployment System loaded');
console.log('📖 Initialize: await window.aads.init()');
