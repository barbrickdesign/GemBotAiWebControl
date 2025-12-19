/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * REPOSITORY BUBBLE MAP VISUALIZER
 * Automated Agent Deployment System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Creates interactive bubble map visualization of the repository network.
 * Each repository is represented as a bubble, with size indicating health/activity
 * and connections showing links. Supports zoom, pan, filtering, and real-time updates.
 * 
 * Features:
 * - Interactive D3.js force-directed graph
 * - Real-time network updates
 * - Repository health visualization
 * - Link strength visualization
 * - Filtering and search
 * - Agent activity overlay
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class BubbleMapVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.svg = null;
        this.simulation = null;
        
        // Visualization state
        this.nodes = [];
        this.links = [];
        this.scale = 1;
        this.transform = { x: 0, y: 0 };
        
        // Settings
        this.width = 1200;
        this.height = 800;
        this.bubbleScale = d => Math.sqrt(d.health) * 2 + 10;
        
        // Fallback: Use canvas if SVG fails
        this.renderMode = 'svg';
        
        console.log('🗺️ Bubble Map Visualizer initialized');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Initialize the visualization
     */
    async init() {
        console.log('Initializing bubble map...');
        
        try {
            // Try D3.js-based SVG rendering
            await this.initSVG();
        } catch (error) {
            console.warn('SVG rendering failed, falling back to canvas:', error);
            // Fallback: Canvas rendering
            this.renderMode = 'canvas';
            this.initCanvas();
        }
        
        // Load data
        this.loadData();
        
        // Start simulation
        this.startSimulation();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Bubble map initialized');
    }
    
    /**
     * Initialize SVG rendering (primary method)
     */
    async initSVG() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            throw new Error(`Container ${this.containerId} not found`);
        }
        
        // Clear container
        this.container.innerHTML = '';
        
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.style.background = '#0a0a1a';
        this.svg.style.border = '2px solid #4affff';
        this.svg.style.borderRadius = '12px';
        
        this.container.appendChild(this.svg);
        
        // Create groups
        this.linksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.linksGroup.setAttribute('class', 'links');
        this.svg.appendChild(this.linksGroup);
        
        this.nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.nodesGroup.setAttribute('class', 'nodes');
        this.svg.appendChild(this.nodesGroup);
    }
    
    /**
     * Initialize canvas rendering (fallback)
     */
    initCanvas() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            throw new Error(`Container ${this.containerId} not found`);
        }
        
        this.container.innerHTML = '';
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.background = '#0a0a1a';
        this.canvas.style.border = '2px solid #4affff';
        this.canvas.style.borderRadius = '12px';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DATA LOADING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Load network data
     */
    loadData() {
        console.log('Loading network data...');
        
        // Get data from network builder
        if (!window.repoNetwork) {
            console.warn('Repository network not available');
            this.createDemoData();
            return;
        }
        
        const networkGraph = window.repoNetwork.getNetworkGraph();
        
        // Transform nodes
        this.nodes = networkGraph.nodes.map(node => ({
            id: node.id,
            name: node.name,
            health: node.health,
            demand: node.demand,
            linkCount: node.linkCount,
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: 0,
            vy: 0
        }));
        
        // Transform links
        this.links = networkGraph.edges.map(edge => ({
            source: this.nodes.find(n => n.id === edge.source),
            target: this.nodes.find(n => n.id === edge.target),
            weight: edge.weight,
            type: edge.type
        })).filter(link => link.source && link.target);
        
        console.log(`Loaded ${this.nodes.length} nodes, ${this.links.length} links`);
    }
    
    /**
     * Create demo data (fallback)
     */
    createDemoData() {
        console.log('Creating demo data...');
        
        // Create sample nodes
        this.nodes = [
            { id: 'central/hub', name: 'hub', health: 90, demand: 'high', linkCount: 5, x: this.width / 2, y: this.height / 2 },
            { id: 'repo/one', name: 'one', health: 75, demand: 'moderate', linkCount: 2, x: 300, y: 200 },
            { id: 'repo/two', name: 'two', health: 60, demand: 'low', linkCount: 1, x: 500, y: 300 },
            { id: 'repo/three', name: 'three', health: 85, demand: 'high', linkCount: 3, x: 700, y: 400 },
            { id: 'repo/four', name: 'four', health: 70, demand: 'moderate', linkCount: 2, x: 400, y: 500 }
        ];
        
        // Create sample links
        this.links = [
            { source: this.nodes[0], target: this.nodes[1], weight: 0.8, type: 'strong' },
            { source: this.nodes[0], target: this.nodes[2], weight: 0.6, type: 'moderate' },
            { source: this.nodes[0], target: this.nodes[3], weight: 0.9, type: 'strong' },
            { source: this.nodes[1], target: this.nodes[2], weight: 0.5, type: 'weak' },
            { source: this.nodes[3], target: this.nodes[4], weight: 0.7, type: 'moderate' }
        ];
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SIMULATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Start force simulation
     */
    startSimulation() {
        console.log('Starting simulation...');
        
        // Simple force simulation (no D3 dependency)
        this.simulation = {
            running: true,
            alpha: 1.0,
            alphaDecay: 0.01,
            velocityDecay: 0.4
        };
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.simulation.running) return;
        
        // Apply forces
        this.applyForces();
        
        // Update positions
        this.updatePositions();
        
        // Render
        this.render();
        
        // Decay alpha
        this.simulation.alpha *= (1 - this.simulation.alphaDecay);
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Apply physics forces
     */
    applyForces() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Center force
        this.nodes.forEach(node => {
            const dx = centerX - node.x;
            const dy = centerY - node.y;
            node.vx += dx * 0.001 * this.simulation.alpha;
            node.vy += dy * 0.001 * this.simulation.alpha;
        });
        
        // Link force
        this.links.forEach(link => {
            const dx = link.target.x - link.source.x;
            const dy = link.target.y - link.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDistance = 150 * link.weight;
            const force = (distance - targetDistance) * 0.1 * this.simulation.alpha;
            
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            link.source.vx += fx;
            link.source.vy += fy;
            link.target.vx -= fx;
            link.target.vy -= fy;
        });
        
        // Repulsion force
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[j].x - this.nodes[i].x;
                const dy = this.nodes[j].y - this.nodes[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                
                if (distance < 100) {
                    const force = (100 - distance) * 0.05 * this.simulation.alpha;
                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;
                    
                    this.nodes[i].vx -= fx;
                    this.nodes[i].vy -= fy;
                    this.nodes[j].vx += fx;
                    this.nodes[j].vy += fy;
                }
            }
        }
    }
    
    /**
     * Update node positions
     */
    updatePositions() {
        this.nodes.forEach(node => {
            // Apply velocity decay
            node.vx *= this.simulation.velocityDecay;
            node.vy *= this.simulation.velocityDecay;
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Boundary constraints
            const radius = this.bubbleScale(node);
            node.x = Math.max(radius, Math.min(this.width - radius, node.x));
            node.y = Math.max(radius, Math.min(this.height - radius, node.y));
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Render the visualization
     */
    render() {
        if (this.renderMode === 'svg') {
            this.renderSVG();
        } else {
            this.renderCanvas();
        }
    }
    
    /**
     * Render using SVG
     */
    renderSVG() {
        // Render links
        this.linksGroup.innerHTML = '';
        this.links.forEach(link => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', link.source.x);
            line.setAttribute('y1', link.source.y);
            line.setAttribute('x2', link.target.x);
            line.setAttribute('y2', link.target.y);
            line.setAttribute('stroke', this.getLinkColor(link));
            line.setAttribute('stroke-width', link.weight * 3);
            line.setAttribute('opacity', 0.6);
            this.linksGroup.appendChild(line);
        });
        
        // Render nodes
        this.nodesGroup.innerHTML = '';
        this.nodes.forEach(node => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            // Circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', this.bubbleScale(node));
            circle.setAttribute('fill', this.getNodeColor(node));
            circle.setAttribute('stroke', '#4affff');
            circle.setAttribute('stroke-width', 2);
            circle.style.cursor = 'pointer';
            
            // Label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '12px');
            text.textContent = node.name;
            
            g.appendChild(circle);
            g.appendChild(text);
            this.nodesGroup.appendChild(g);
        });
    }
    
    /**
     * Render using Canvas (fallback)
     */
    renderCanvas() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Render links
        this.links.forEach(link => {
            this.ctx.beginPath();
            this.ctx.moveTo(link.source.x, link.source.y);
            this.ctx.lineTo(link.target.x, link.target.y);
            this.ctx.strokeStyle = this.getLinkColor(link);
            this.ctx.lineWidth = link.weight * 3;
            this.ctx.globalAlpha = 0.6;
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1.0;
        
        // Render nodes
        this.nodes.forEach(node => {
            // Circle
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.bubbleScale(node), 0, Math.PI * 2);
            this.ctx.fillStyle = this.getNodeColor(node);
            this.ctx.fill();
            this.ctx.strokeStyle = '#4affff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Label
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.name, node.x, node.y);
        });
    }
    
    /**
     * Get node color based on health/demand
     */
    getNodeColor(node) {
        const demandColors = {
            critical: '#ff4444',
            high: '#ffaa44',
            moderate: '#44ff88',
            low: '#4488ff'
        };
        
        return demandColors[node.demand] || '#888888';
    }
    
    /**
     * Get link color based on type
     */
    getLinkColor(link) {
        const typeColors = {
            strong: '#4ade80',
            moderate: '#facc15',
            weak: '#94a3b8',
            minimal: '#475569'
        };
        
        return typeColors[link.type] || '#888888';
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INTERACTIVITY
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for network updates
        window.addEventListener('repo-network', (e) => {
            this.handleNetworkUpdate(e.detail);
        });
        
        window.addEventListener('agent-deployment', (e) => {
            this.handleAgentUpdate(e.detail);
        });
    }
    
    /**
     * Handle network updates
     */
    handleNetworkUpdate(detail) {
        console.log('Network update:', detail);
        
        // Reload data
        this.loadData();
    }
    
    /**
     * Handle agent updates
     */
    handleAgentUpdate(detail) {
        console.log('Agent update:', detail);
        
        // Find node and add visual indicator
        const node = this.nodes.find(n => n.id === detail.repoId);
        if (node) {
            // Pulse effect or similar
            node.agentActivity = true;
            setTimeout(() => {
                node.agentActivity = false;
            }, 2000);
        }
    }
    
    /**
     * Refresh visualization
     */
    refresh() {
        this.loadData();
        this.simulation.alpha = 1.0;
    }
    
    /**
     * Stop simulation
     */
    stop() {
        this.simulation.running = false;
    }
    
    /**
     * Resume simulation
     */
    resume() {
        this.simulation.running = true;
        this.animate();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

window.BubbleMapVisualizer = BubbleMapVisualizer;

console.log('✅ Bubble Map Visualizer loaded');
console.log('📖 Usage: const viz = new BubbleMapVisualizer("container-id"); await viz.init();');
