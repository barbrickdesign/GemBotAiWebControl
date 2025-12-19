/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AGENT DEPLOYMENT ORCHESTRATOR
 * Automated Agent Deployment System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Automatically deploys agents to repositories based on resource demand.
 * Agents help with development tasks, resource allocation, and cross-repository
 * collaboration. The system creates a network of agents that can spawn additional
 * agents and create links between repositories to increase signal and resources.
 * 
 * Features:
 * - Automatic agent deployment based on demand
 * - Agent spawning and lifecycle management
 * - Cross-repository agent collaboration
 * - Resource allocation and balancing
 * - Agent performance monitoring
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class AgentDeploymentOrchestrator {
    constructor() {
        this.agents = new Map();
        this.deploymentQueue = [];
        this.deploymentHistory = [];
        this.agentTypes = this.initializeAgentTypes();
        
        // Storage
        this.STORAGE_KEY = 'agent_deployment_v1';
        this.HISTORY_KEY = 'agent_deployment_history_v1';
        
        // Deployment settings
        this.MAX_AGENTS_PER_REPO = 10;
        this.MIN_HEALTH_FOR_DEPLOYMENT = 30;
        this.AGENT_SPAWN_THRESHOLD = 0.7; // 70% capacity triggers spawn
        
        this.loadFromStorage();
        console.log('🤖 Agent Deployment Orchestrator initialized');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AGENT TYPE DEFINITIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    initializeAgentTypes() {
        return {
            // Code assistance agents
            CODE_HELPER: {
                name: 'Code Helper',
                description: 'Assists with code quality, patterns, and best practices',
                resourceCost: 1,
                capabilities: ['code-review', 'pattern-detection', 'refactoring'],
                demandTrigger: 'moderate',
                priority: 2
            },
            
            // Testing agents
            TEST_RUNNER: {
                name: 'Test Runner',
                description: 'Runs tests and reports results',
                resourceCost: 2,
                capabilities: ['test-execution', 'coverage-analysis', 'failure-detection'],
                demandTrigger: 'high',
                priority: 1
            },
            
            // Documentation agents
            DOC_WRITER: {
                name: 'Documentation Writer',
                description: 'Generates and maintains documentation',
                resourceCost: 1,
                capabilities: ['doc-generation', 'readme-updates', 'api-docs'],
                demandTrigger: 'moderate',
                priority: 3
            },
            
            // Resource monitoring agents
            RESOURCE_MONITOR: {
                name: 'Resource Monitor',
                description: 'Monitors resource usage and demand',
                resourceCost: 1,
                capabilities: ['usage-tracking', 'demand-detection', 'alert-generation'],
                demandTrigger: 'low',
                priority: 1
            },
            
            // Link creation agents
            LINK_BUILDER: {
                name: 'Link Builder',
                description: 'Creates and maintains repository links',
                resourceCost: 2,
                capabilities: ['link-creation', 'network-building', 'signal-amplification'],
                demandTrigger: 'high',
                priority: 2
            },
            
            // Deployment agents
            DEPLOY_AGENT: {
                name: 'Deploy Agent',
                description: 'Handles deployment tasks',
                resourceCost: 3,
                capabilities: ['ci-cd-management', 'deployment-automation', 'rollback'],
                demandTrigger: 'critical',
                priority: 1
            },
            
            // Security agents
            SECURITY_SCANNER: {
                name: 'Security Scanner',
                description: 'Scans for security vulnerabilities',
                resourceCost: 2,
                capabilities: ['vulnerability-scan', 'dependency-check', 'security-audit'],
                demandTrigger: 'moderate',
                priority: 1
            },
            
            // Collaboration agents
            COLLAB_COORDINATOR: {
                name: 'Collaboration Coordinator',
                description: 'Coordinates cross-repository collaboration',
                resourceCost: 2,
                capabilities: ['agent-coordination', 'resource-sharing', 'task-distribution'],
                demandTrigger: 'high',
                priority: 2
            }
        };
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STORAGE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                this.agents = new Map(Object.entries(parsed));
            }
            
            const historyData = localStorage.getItem(this.HISTORY_KEY);
            if (historyData) {
                this.deploymentHistory = JSON.parse(historyData);
            }
        } catch (error) {
            console.error('Error loading deployment data:', error);
        }
    }
    
    saveToStorage() {
        try {
            const agentsObj = Object.fromEntries(this.agents);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(agentsObj));
            
            // Keep last 1000 history entries
            const recentHistory = this.deploymentHistory.slice(-1000);
            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(recentHistory));
        } catch (error) {
            console.error('Error saving deployment data:', error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AGENT DEPLOYMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Deploy agent to a repository
     * @param {string} repoId - Repository ID
     * @param {string} agentType - Type of agent to deploy
     * @param {Object} options - Deployment options
     * @returns {Promise<Object>} Deployed agent
     */
    async deployAgent(repoId, agentType, options = {}) {
        console.log(`🚀 Deploying ${agentType} to ${repoId}`);
        
        try {
            // Validation with fallback
            const validation = this.validateDeployment(repoId, agentType);
            if (!validation.valid) {
                console.warn(`Deployment validation failed: ${validation.reason}`);
                
                // Fallback: Try lighter agent type
                if (validation.fallbackType) {
                    console.log(`Falling back to ${validation.fallbackType}`);
                    return await this.deployAgent(repoId, validation.fallbackType, options);
                }
                
                throw new Error(validation.reason);
            }
            
            // Create agent instance
            const agent = this.createAgentInstance(repoId, agentType, options);
            
            // Initialize agent with fallback
            try {
                await this.initializeAgent(agent);
            } catch (initError) {
                console.error('Agent initialization failed:', initError);
                // Fallback: Mark as degraded mode
                agent.status = 'degraded';
                agent.degradedReason = initError.message;
            }
            
            // Register agent
            const agentKey = `${repoId}:${agent.id}`;
            this.agents.set(agentKey, agent);
            
            // Record deployment
            this.recordDeployment(agent);
            
            // Save state
            this.saveToStorage();
            
            console.log(`✅ Agent deployed: ${agent.id} (${agent.type})`);
            
            // Notify repository
            this.notifyRepository(repoId, 'agent-deployed', agent);
            
            return agent;
            
        } catch (error) {
            console.error(`Failed to deploy agent to ${repoId}:`, error);
            
            // Record failed deployment
            this.recordDeployment({
                repoId: repoId,
                type: agentType,
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            return null;
        }
    }
    
    /**
     * Validate deployment request
     */
    validateDeployment(repoId, agentType) {
        // Check if agent type exists
        if (!this.agentTypes[agentType]) {
            return {
                valid: false,
                reason: `Unknown agent type: ${agentType}`,
                fallbackType: 'CODE_HELPER'
            };
        }
        
        // Check repository exists
        const repo = window.repoScanner?.getRepository(repoId);
        if (!repo) {
            return {
                valid: false,
                reason: `Repository not found: ${repoId}`,
                fallbackType: null
            };
        }
        
        // Check repository health
        if (repo.health.score < this.MIN_HEALTH_FOR_DEPLOYMENT) {
            return {
                valid: false,
                reason: `Repository health too low: ${repo.health.score}`,
                fallbackType: 'RESOURCE_MONITOR' // Deploy lighter agent instead
            };
        }
        
        // Check agent limit
        const existingAgents = this.getRepositoryAgents(repoId);
        if (existingAgents.length >= this.MAX_AGENTS_PER_REPO) {
            return {
                valid: false,
                reason: `Maximum agents reached for ${repoId}`,
                fallbackType: null
            };
        }
        
        return { valid: true };
    }
    
    /**
     * Create agent instance
     */
    createAgentInstance(repoId, agentType, options) {
        const typeConfig = this.agentTypes[agentType];
        
        return {
            id: `AGENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
            type: agentType,
            name: typeConfig.name,
            repoId: repoId,
            status: 'initializing',
            health: 100,
            resourceUsage: 0,
            capabilities: typeConfig.capabilities,
            deployedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            tasksCompleted: 0,
            tasksActive: [],
            links: [],
            spawnedAgents: [],
            options: options
        };
    }
    
    /**
     * Initialize agent
     */
    async initializeAgent(agent) {
        console.log(`Initializing agent ${agent.id}...`);
        
        // Simulate initialization (would connect to actual agent systems)
        await this.delay(100);
        
        // Set up agent capabilities
        agent.capabilities.forEach(capability => {
            console.log(`  ✓ Capability enabled: ${capability}`);
        });
        
        agent.status = 'active';
        return agent;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AUTOMATIC DEPLOYMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Automatically deploy agents based on repository demand
     */
    async autoDeployAgents() {
        console.log('🤖 Starting automatic agent deployment...');
        
        if (!window.repoScanner) {
            console.warn('Repository scanner not available');
            return [];
        }
        
        const repositories = window.repoScanner.getAllRepositories();
        const deployments = [];
        
        for (const repo of repositories) {
            const agentsToDeployTypes = this.determineRequiredAgents(repo);
            
            for (const agentType of agentsToDeployTypes) {
                try {
                    const agent = await this.deployAgent(repo.id, agentType);
                    if (agent) {
                        deployments.push(agent);
                    }
                } catch (error) {
                    console.error(`Failed to auto-deploy ${agentType} to ${repo.id}:`, error);
                }
            }
        }
        
        console.log(`✅ Auto-deployed ${deployments.length} agents`);
        return deployments;
    }
    
    /**
     * Determine which agents a repository needs
     */
    determineRequiredAgents(repo) {
        const needed = [];
        const existingAgents = this.getRepositoryAgents(repo.id);
        const existingTypes = new Set(existingAgents.map(a => a.type));
        
        // Check each agent type
        Object.entries(this.agentTypes).forEach(([type, config]) => {
            // Skip if already deployed
            if (existingTypes.has(type)) return;
            
            // Check if demand level triggers deployment
            const demandLevels = ['low', 'moderate', 'high', 'critical'];
            const repoDemandfIndex = demandLevels.indexOf(repo.health.resourceDemand);
            const triggerIndex = demandLevels.indexOf(config.demandTrigger);
            
            if (repoDemandfIndex >= triggerIndex) {
                needed.push(type);
            }
        });
        
        // Sort by priority
        needed.sort((a, b) => {
            return this.agentTypes[a].priority - this.agentTypes[b].priority;
        });
        
        return needed;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AGENT SPAWNING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Agent spawns another agent (for load distribution)
     */
    async spawnAgent(parentAgentKey, targetRepoId, agentType) {
        console.log(`🔄 Agent ${parentAgentKey} spawning ${agentType} for ${targetRepoId}`);
        
        const parentAgent = this.agents.get(parentAgentKey);
        if (!parentAgent) {
            throw new Error('Parent agent not found');
        }
        
        // Deploy the new agent
        const newAgent = await this.deployAgent(targetRepoId, agentType, {
            spawnedBy: parentAgentKey,
            parentCapabilities: parentAgent.capabilities
        });
        
        if (newAgent) {
            // Link parent and child
            parentAgent.spawnedAgents.push(newAgent.id);
            this.saveToStorage();
            
            console.log(`✅ Agent spawned: ${newAgent.id}`);
        }
        
        return newAgent;
    }
    
    /**
     * Check if agent should spawn helpers
     */
    shouldSpawnHelper(agentKey) {
        const agent = this.agents.get(agentKey);
        if (!agent) return false;
        
        // Check resource usage
        if (agent.resourceUsage >= this.AGENT_SPAWN_THRESHOLD) {
            return true;
        }
        
        // Check active tasks
        if (agent.tasksActive.length > 5) {
            return true;
        }
        
        return false;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AGENT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get all agents for a repository
     */
    getRepositoryAgents(repoId) {
        return Array.from(this.agents.values()).filter(
            agent => agent.repoId === repoId
        );
    }
    
    /**
     * Get agent by key
     */
    getAgent(agentKey) {
        return this.agents.get(agentKey);
    }
    
    /**
     * Get all active agents
     */
    getAllAgents() {
        return Array.from(this.agents.values());
    }
    
    /**
     * Update agent status
     */
    updateAgentStatus(agentKey, status, metadata = {}) {
        const agent = this.agents.get(agentKey);
        if (!agent) return false;
        
        agent.status = status;
        agent.lastActive = new Date().toISOString();
        
        Object.assign(agent, metadata);
        
        this.saveToStorage();
        return true;
    }
    
    /**
     * Retire an agent
     */
    async retireAgent(agentKey, reason = 'completed') {
        console.log(`👋 Retiring agent ${agentKey}: ${reason}`);
        
        const agent = this.agents.get(agentKey);
        if (!agent) return false;
        
        // Update status
        agent.status = 'retired';
        agent.retiredAt = new Date().toISOString();
        agent.retireReason = reason;
        
        // Notify repository
        this.notifyRepository(agent.repoId, 'agent-retired', agent);
        
        // Remove from active agents after delay
        setTimeout(() => {
            this.agents.delete(agentKey);
            this.saveToStorage();
        }, 5000);
        
        return true;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MONITORING & HEALTH
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Monitor agent health
     */
    monitorAgentHealth() {
        console.log('💓 Monitoring agent health...');
        
        let healthyCount = 0;
        const now = Date.now();
        
        this.agents.forEach((agent, key) => {
            const lastActive = new Date(agent.lastActive).getTime();
            const minutesSinceActive = (now - lastActive) / 1000 / 60;
            
            // Mark as unhealthy if inactive too long
            if (minutesSinceActive > 30) {
                agent.health = Math.max(0, agent.health - 10);
                if (agent.health < 30) {
                    agent.status = 'unhealthy';
                }
            } else {
                healthyCount++;
            }
        });
        
        console.log(`✅ ${healthyCount}/${this.agents.size} agents healthy`);
    }
    
    /**
     * Get deployment statistics
     */
    getStats() {
        const agents = this.getAllAgents();
        
        return {
            totalAgents: agents.length,
            activeAgents: agents.filter(a => a.status === 'active').length,
            degradedAgents: agents.filter(a => a.status === 'degraded').length,
            unhealthyAgents: agents.filter(a => a.status === 'unhealthy').length,
            totalDeployments: this.deploymentHistory.length,
            agentsByType: this.getAgentCountByType(),
            averageHealth: agents.reduce((sum, a) => sum + a.health, 0) / agents.length || 0
        };
    }
    
    getAgentCountByType() {
        const counts = {};
        this.getAllAgents().forEach(agent => {
            counts[agent.type] = (counts[agent.type] || 0) + 1;
        });
        return counts;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    recordDeployment(agent) {
        this.deploymentHistory.push({
            agentId: agent.id,
            type: agent.type,
            repoId: agent.repoId,
            status: agent.status,
            timestamp: new Date().toISOString()
        });
    }
    
    notifyRepository(repoId, event, data) {
        window.dispatchEvent(new CustomEvent('agent-deployment', {
            detail: { repoId, event, data }
        }));
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

window.AgentDeploymentOrchestrator = AgentDeploymentOrchestrator;
window.agentOrchestrator = new AgentDeploymentOrchestrator();

console.log('✅ Agent Deployment Orchestrator loaded');
console.log('📖 Usage: await window.agentOrchestrator.deployAgent("owner/repo", "CODE_HELPER")');
