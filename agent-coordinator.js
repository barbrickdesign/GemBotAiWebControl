/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AGENT COORDINATOR
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Central coordination system for all AI agents
 * - Manages agent lifecycle
 * - Coordinates agent communications
 * - Handles agent tasks and priorities
 * - Ensures system coherence
 * - Provides unified API for agent access
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.AgentCoordinator = {
    version: '1.0.0',
    initialized: false,
    
    // Registered agents
    agents: new Map(),
    
    // Agent registry
    registry: {
        'mobile-optimizer': {
            name: 'Mobile Optimizer',
            object: null,
            file: 'mobile-optimizer-agent.js',
            priority: 1,
            autoStart: true,
            required: false
        },
        'course-testing': {
            name: 'Course Testing Agent',
            object: null,
            file: 'course-testing-agent.js',
            priority: 2,
            autoStart: false,
            required: false
        },
        'knowledge-enhancer': {
            name: 'Knowledge Enhancer',
            object: null,
            file: 'knowledge-enhancer-agent.js',
            priority: 1,
            autoStart: true,
            required: false
        },
        'deployment-organizer': {
            name: 'Deployment Organizer',
            object: null,
            file: 'deployment-organizer-agent.js',
            priority: 1,
            autoStart: true,
            required: false
        },
        'fullstack': {
            name: 'GemBot Fullstack Agent',
            object: null,
            file: 'gembot-fullstack-agent.js',
            priority: 2,
            autoStart: false,
            required: false
        },
        'merlin': {
            name: 'Merlin AI',
            object: null,
            file: 'merlin-ai-integration.js',
            priority: 0,
            autoStart: true,
            required: true
        }
    },
    
    // Communication bus
    messageBus: {
        subscribers: new Map(),
        messageQueue: []
    },
    
    // Coordination state
    state: {
        startupComplete: false,
        healthyAgents: 0,
        totalAgents: 0,
        lastHealthCheck: null
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async init() {
        console.log('🎯 Agent Coordinator initializing...');
        
        // Discover available agents
        await this.discoverAgents();
        
        // Initialize auto-start agents
        await this.initializeAgents();
        
        // Setup message bus
        this.setupMessageBus();
        
        // Setup health monitoring
        this.setupHealthMonitoring();
        
        // Register global API
        this.registerGlobalAPI();
        
        this.initialized = true;
        this.state.startupComplete = true;
        
        console.log('✅ Agent Coordinator ready');
        console.log(`   Active Agents: ${this.agents.size}/${Object.keys(this.registry).length}`);
        
        // Broadcast startup complete
        this.broadcast('system', 'startup-complete', {
            timestamp: new Date().toISOString()
        });
        
        return this;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AGENT DISCOVERY
    // ═══════════════════════════════════════════════════════════════════════════
    
    async discoverAgents() {
        console.log('🔍 Discovering agents...');
        
        const discoveries = {
            'mobile-optimizer': window.MobileOptimizerAgent,
            'course-testing': window.CourseTestingAgent,
            'knowledge-enhancer': window.KnowledgeEnhancerAgent,
            'deployment-organizer': window.DeploymentOrganizerAgent,
            'fullstack': window.GemBotAgent,
            'merlin': window.MerlinAI
        };
        
        Object.entries(discoveries).forEach(([key, agent]) => {
            if (agent) {
                this.registry[key].object = agent;
                console.log(`  ✓ Found: ${this.registry[key].name}`);
            } else {
                console.log(`  ✗ Missing: ${this.registry[key].name}`);
            }
        });
        
        this.state.totalAgents = Object.keys(this.registry).length;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AGENT INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async initializeAgents() {
        console.log('🚀 Initializing agents...');
        
        // Sort by priority
        const sorted = Object.entries(this.registry)
            .sort((a, b) => (a[1].priority || 5) - (b[1].priority || 5));
        
        for (const [key, config] of sorted) {
            if (config.autoStart && config.object) {
                try {
                    await this.startAgent(key);
                } catch (error) {
                    console.error(`Failed to start ${config.name}:`, error);
                    
                    if (config.required) {
                        throw new Error(`Required agent ${config.name} failed to start`);
                    }
                }
            }
        }
    },
    
    async startAgent(agentKey) {
        const config = this.registry[agentKey];
        
        if (!config || !config.object) {
            throw new Error(`Agent ${agentKey} not found`);
        }
        
        console.log(`  Starting: ${config.name}...`);
        
        const agent = config.object;
        
        // Initialize if not already initialized
        if (!agent.initialized && agent.init) {
            await agent.init();
        }
        
        // Register agent
        this.agents.set(agentKey, {
            key: agentKey,
            name: config.name,
            object: agent,
            status: 'active',
            startedAt: new Date().toISOString(),
            lastHealthCheck: null,
            messageCount: 0
        });
        
        console.log(`  ✅ Started: ${config.name}`);
        
        // Notify other agents
        this.broadcast('agent', 'agent-started', {
            agentKey: agentKey,
            agentName: config.name
        });
        
        return agent;
    },
    
    async stopAgent(agentKey) {
        const agentInfo = this.agents.get(agentKey);
        
        if (!agentInfo) {
            throw new Error(`Agent ${agentKey} not running`);
        }
        
        console.log(`Stopping agent: ${agentInfo.name}`);
        
        // Call shutdown if available
        if (agentInfo.object.shutdown) {
            await agentInfo.object.shutdown();
        }
        
        // Remove from active agents
        this.agents.delete(agentKey);
        
        // Notify other agents
        this.broadcast('agent', 'agent-stopped', {
            agentKey: agentKey,
            agentName: agentInfo.name
        });
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MESSAGE BUS
    // ═══════════════════════════════════════════════════════════════════════════
    
    setupMessageBus() {
        console.log('📡 Setting up message bus...');
        
        // Subscribe all agents to relevant messages
        this.agents.forEach((agentInfo, key) => {
            if (agentInfo.object.onMessage) {
                this.subscribe(key, '*', (message) => {
                    agentInfo.object.onMessage(message);
                });
            }
        });
    },
    
    subscribe(subscriberId, topic, callback) {
        if (!this.messageBus.subscribers.has(topic)) {
            this.messageBus.subscribers.set(topic, new Map());
        }
        
        this.messageBus.subscribers.get(topic).set(subscriberId, callback);
    },
    
    unsubscribe(subscriberId, topic) {
        const subscribers = this.messageBus.subscribers.get(topic);
        if (subscribers) {
            subscribers.delete(subscriberId);
        }
    },
    
    broadcast(category, type, data) {
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            category: category,
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            sender: 'coordinator'
        };
        
        // Add to queue
        this.messageBus.messageQueue.push(message);
        
        // Keep only last 100 messages
        if (this.messageBus.messageQueue.length > 100) {
            this.messageBus.messageQueue.shift();
        }
        
        // Deliver to subscribers
        this.deliverMessage(message);
    },
    
    sendMessage(fromAgent, toAgent, type, data) {
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            category: 'agent-to-agent',
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            sender: fromAgent,
            recipient: toAgent
        };
        
        this.messageBus.messageQueue.push(message);
        
        // Deliver to specific agent
        const agentInfo = this.agents.get(toAgent);
        if (agentInfo && agentInfo.object.onMessage) {
            agentInfo.object.onMessage(message);
            agentInfo.messageCount++;
        }
    },
    
    deliverMessage(message) {
        // Deliver to wildcard subscribers
        const wildcardSubscribers = this.messageBus.subscribers.get('*');
        if (wildcardSubscribers) {
            wildcardSubscribers.forEach((callback) => {
                try {
                    callback(message);
                } catch (error) {
                    console.error('Error in message callback:', error);
                }
            });
        }
        
        // Deliver to specific topic subscribers
        const topicSubscribers = this.messageBus.subscribers.get(message.type);
        if (topicSubscribers) {
            topicSubscribers.forEach((callback) => {
                try {
                    callback(message);
                } catch (error) {
                    console.error('Error in message callback:', error);
                }
            });
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HEALTH MONITORING
    // ═══════════════════════════════════════════════════════════════════════════
    
    setupHealthMonitoring() {
        // Check agent health every 30 seconds
        setInterval(() => {
            this.checkAgentHealth();
        }, 30000);
        
        // Initial health check after 10 seconds
        setTimeout(() => {
            this.checkAgentHealth();
        }, 10000);
    },
    
    checkAgentHealth() {
        console.log('💓 Checking agent health...');
        
        let healthyCount = 0;
        
        this.agents.forEach((agentInfo, key) => {
            const agent = agentInfo.object;
            
            // Check if agent is responsive
            const isHealthy = agent.initialized || agent.isAlive;
            
            if (isHealthy) {
                healthyCount++;
                agentInfo.status = 'active';
            } else {
                agentInfo.status = 'unresponsive';
                console.warn(`⚠️ Agent ${agentInfo.name} is unresponsive`);
            }
            
            agentInfo.lastHealthCheck = new Date().toISOString();
        });
        
        this.state.healthyAgents = healthyCount;
        this.state.lastHealthCheck = new Date().toISOString();
        
        console.log(`✅ ${healthyCount}/${this.agents.size} agents healthy`);
        
        // Broadcast health status
        this.broadcast('system', 'health-check-complete', {
            healthy: healthyCount,
            total: this.agents.size
        });
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GLOBAL API
    // ═══════════════════════════════════════════════════════════════════════════
    
    registerGlobalAPI() {
        // Create easy access to agents
        window.agents = {
            mobile: this.getAgent('mobile-optimizer'),
            courses: this.getAgent('course-testing'),
            knowledge: this.getAgent('knowledge-enhancer'),
            deployment: this.getAgent('deployment-organizer'),
            fullstack: this.getAgent('fullstack'),
            merlin: this.getAgent('merlin'),
            
            // Utility functions
            list: () => this.listAgents(),
            status: () => this.getStatus(),
            send: (from, to, type, data) => this.sendMessage(from, to, type, data),
            broadcast: (category, type, data) => this.broadcast(category, type, data)
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════
    
    getAgent(agentKey) {
        const agentInfo = this.agents.get(agentKey);
        return agentInfo ? agentInfo.object : null;
    },
    
    listAgents() {
        const list = [];
        
        this.agents.forEach((agentInfo, key) => {
            list.push({
                key: key,
                name: agentInfo.name,
                status: agentInfo.status,
                startedAt: agentInfo.startedAt,
                messageCount: agentInfo.messageCount
            });
        });
        
        return list;
    },
    
    getStatus() {
        return {
            initialized: this.initialized,
            startupComplete: this.state.startupComplete,
            activeAgents: this.agents.size,
            totalAgents: this.state.totalAgents,
            healthyAgents: this.state.healthyAgents,
            lastHealthCheck: this.state.lastHealthCheck,
            messageQueue: this.messageBus.messageQueue.length
        };
    },
    
    async requestAgentAction(agentKey, action, params = {}) {
        const agentInfo = this.agents.get(agentKey);
        
        if (!agentInfo) {
            throw new Error(`Agent ${agentKey} not found or not running`);
        }
        
        const agent = agentInfo.object;
        
        // Check if agent has the action
        if (typeof agent[action] !== 'function') {
            throw new Error(`Agent ${agentInfo.name} does not have action: ${action}`);
        }
        
        console.log(`🎯 Requesting action ${action} from ${agentInfo.name}`);
        
        // Execute action
        const result = await agent[action](params);
        
        agentInfo.messageCount++;
        
        return result;
    },
    
    async coordinateTask(task) {
        console.log(`🎯 Coordinating task: ${task.name}`);
        
        const results = {};
        
        // Assign task to relevant agents
        for (const agentKey of task.agents) {
            try {
                const result = await this.requestAgentAction(
                    agentKey,
                    task.action,
                    task.params
                );
                
                results[agentKey] = {
                    success: true,
                    result: result
                };
                
            } catch (error) {
                results[agentKey] = {
                    success: false,
                    error: error.message
                };
            }
        }
        
        return results;
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.AgentCoordinator.init();
    });
} else {
    window.AgentCoordinator.init();
}

console.log('🎯 Agent Coordinator loaded');
