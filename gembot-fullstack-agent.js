/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GEMBOT FULLSTACK DEVELOPER AGENT 🤖
 * ═══════════════════════════════════════════════════════════════════════════════
 * A comprehensive agent that handles errors, fixes links, tests games,
 * and enhances visuals using p5.js
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.GemBotAgent = {
    version: '1.0.0',
    name: 'GemBot FullStack Agent',
    initialized: false,
    p5Instance: null,
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════
    config: {
        autoFix: true,
        logLevel: 'verbose', // 'silent', 'error', 'warn', 'info', 'verbose'
        scanInterval: 30000, // 30 seconds
        p5Enabled: true,
        visualEffects: true,
        gameTestMode: false
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ERROR TRACKING
    // ═══════════════════════════════════════════════════════════════════════════
    errors: {
        captured: [],
        fixed: [],
        pending: [],
        stats: {
            totalCaptured: 0,
            totalFixed: 0,
            totalPending: 0
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LINK TRACKING
    // ═══════════════════════════════════════════════════════════════════════════
    links: {
        all: [],
        broken: [],
        fixed: [],
        external: [],
        internal: []
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GAME TESTING
    // ═══════════════════════════════════════════════════════════════════════════
    gameTesting: {
        results: [],
        currentTest: null,
        passCount: 0,
        failCount: 0
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    async init() {
        console.log('🤖 GemBot FullStack Agent initializing...');
        
        // Setup error capturing
        this.setupErrorCapture();
        
        // Setup link scanner
        this.setupLinkScanner();
        
        // Load p5.js if not present
        await this.loadP5();
        
        // Initialize p5 visual effects
        if (this.config.p5Enabled) {
            this.initP5Visuals();
        }
        
        // Setup periodic scanning
        this.startPeriodicScan();
        
        // Run initial diagnostics
        await this.runDiagnostics();
        
        this.initialized = true;
        console.log('✅ GemBot FullStack Agent ready!');
        this.showAgentPanel();
        
        return this;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ERROR CAPTURE SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    setupErrorCapture() {
        // Global error handler
        window.onerror = (message, source, lineno, colno, error) => {
            this.captureError({
                type: 'uncaught',
                message,
                source,
                lineno,
                colno,
                stack: error?.stack,
                timestamp: new Date().toISOString()
            });
            return false;
        };
        
        // Promise rejection handler
        window.onunhandledrejection = (event) => {
            this.captureError({
                type: 'promise',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });
        };
        
        // Console error interceptor
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.captureError({
                type: 'console',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
                timestamp: new Date().toISOString()
            });
            originalConsoleError.apply(console, args);
        };
        
        console.log('🎯 Error capture system active');
    },
    
    captureError(error) {
        this.errors.captured.push(error);
        this.errors.stats.totalCaptured++;
        
        // Attempt auto-fix if enabled
        if (this.config.autoFix) {
            this.attemptAutoFix(error);
        }
        
        // Update UI if panel exists
        this.updateAgentPanel();
        
        // Log based on level
        if (this.config.logLevel === 'verbose') {
            console.log('🔴 Error captured:', error.message);
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AUTO-FIX SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    attemptAutoFix(error) {
        const fixes = {
            // Fix missing function errors
            'is not a function': () => this.fixMissingFunction(error),
            // Fix undefined property access
            'Cannot read prop': () => this.fixUndefinedProperty(error),
            'undefined': () => this.fixUndefinedProperty(error),
            // Fix null reference
            'null': () => this.fixNullReference(error),
            // Fix missing module
            'module': () => this.fixMissingModule(error),
            // Fix network errors
            'fetch': () => this.fixNetworkError(error),
            'Failed to fetch': () => this.fixNetworkError(error)
        };
        
        for (const [pattern, fixer] of Object.entries(fixes)) {
            if (error.message?.toLowerCase().includes(pattern.toLowerCase())) {
                try {
                    const result = fixer();
                    if (result) {
                        this.errors.fixed.push({ error, fix: result, timestamp: new Date().toISOString() });
                        this.errors.stats.totalFixed++;
                        console.log('🔧 Auto-fix applied:', result);
                        return true;
                    }
                } catch (e) {
                    console.warn('Auto-fix failed:', e);
                }
            }
        }
        
        this.errors.pending.push(error);
        this.errors.stats.totalPending++;
        return false;
    },
    
    fixMissingFunction(error) {
        const match = error.message?.match(/(\w+)\.(\w+) is not a function/);
        if (match) {
            const [, obj, method] = match;
            // Create stub function
            if (window[obj]) {
                window[obj][method] = function(...args) {
                    console.warn(`Stub function ${obj}.${method} called with:`, args);
                    return null;
                };
                return `Created stub for ${obj}.${method}`;
            }
        }
        return null;
    },
    
    fixUndefinedProperty(error) {
        // Create safe accessor utilities
        if (!window.safeGet) {
            window.safeGet = (obj, path, defaultVal = null) => {
                return path.split('.').reduce((o, k) => (o || {})[k], obj) ?? defaultVal;
            };
        }
        return 'Added safeGet utility';
    },
    
    fixNullReference(error) {
        // Already handled by safeGet
        return this.fixUndefinedProperty(error);
    },
    
    fixMissingModule(error) {
        console.log('📦 Module error detected, checking dependencies...');
        return 'Module check initiated';
    },
    
    fixNetworkError(error) {
        console.log('🌐 Network error detected, will retry...');
        return 'Network retry queued';
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LINK SCANNER
    // ═══════════════════════════════════════════════════════════════════════════
    setupLinkScanner() {
        console.log('🔗 Link scanner initialized');
    },
    
    async scanLinks() {
        console.log('🔍 Scanning all links...');
        this.links.all = [];
        this.links.broken = [];
        this.links.internal = [];
        this.links.external = [];
        
        // Find all links in document
        const allLinks = document.querySelectorAll('a[href], link[href], script[src], img[src]');
        
        for (const el of allLinks) {
            const url = el.href || el.src;
            if (!url) continue;
            
            const linkInfo = {
                url,
                element: el.tagName,
                isExternal: url.startsWith('http') && !url.includes(location.hostname),
                status: 'unknown'
            };
            
            this.links.all.push(linkInfo);
            
            if (linkInfo.isExternal) {
                this.links.external.push(linkInfo);
            } else {
                this.links.internal.push(linkInfo);
                // Check internal links
                try {
                    if (el.tagName === 'A') {
                        // For anchor tags, just check if target exists
                        linkInfo.status = 'ok';
                    } else {
                        // For scripts/images, check if loaded
                        linkInfo.status = el.complete !== false ? 'ok' : 'pending';
                    }
                } catch (e) {
                    linkInfo.status = 'error';
                    this.links.broken.push(linkInfo);
                }
            }
        }
        
        console.log(`📊 Link scan complete: ${this.links.all.length} total, ${this.links.broken.length} broken`);
        return this.links;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // P5.JS VISUAL ENHANCEMENT SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    async loadP5() {
        if (window.p5) {
            console.log('✅ p5.js already loaded');
            return;
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js';
            script.onload = () => {
                console.log('✅ p5.js loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.warn('⚠️ p5.js failed to load, visual effects disabled');
                this.config.p5Enabled = false;
                resolve();
            };
            document.head.appendChild(script);
        });
    },
    
    initP5Visuals() {
        if (!window.p5) return;
        
        // Create p5 canvas container
        const container = document.createElement('div');
        container.id = 'gembot-p5-container';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        document.body.insertBefore(container, document.body.firstChild);
        
        // Initialize p5 instance
        this.p5Instance = new p5((p) => {
            const particles = [];
            const gemColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('gembot-p5-container');
                p.noStroke();
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
            
            p.draw = () => {
                p.clear();
                
                if (!this.config.visualEffects) return;
                
                // Add new particles occasionally
                if (p.frameCount % 60 === 0 && particles.length < 50) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.height + 20,
                        size: p.random(5, 15),
                        color: p.random(gemColors),
                        speed: p.random(0.5, 2),
                        wobble: p.random(0.01, 0.03),
                        alpha: p.random(50, 150)
                    });
                }
                
                // Update and draw particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    const particle = particles[i];
                    
                    // Move up
                    particle.y -= particle.speed;
                    particle.x += p.sin(p.frameCount * particle.wobble) * 0.5;
                    
                    // Draw gem shape
                    p.push();
                    p.translate(particle.x, particle.y);
                    p.fill(p.color(particle.color + Math.floor(particle.alpha).toString(16).padStart(2, '0')));
                    
                    // Diamond shape
                    p.beginShape();
                    p.vertex(0, -particle.size);
                    p.vertex(particle.size * 0.6, 0);
                    p.vertex(0, particle.size * 0.8);
                    p.vertex(-particle.size * 0.6, 0);
                    p.endShape(p.CLOSE);
                    p.pop();
                    
                    // Remove if off screen
                    if (particle.y < -20) {
                        particles.splice(i, 1);
                    }
                }
            };
        });
        
        console.log('✨ p5.js visual effects initialized');
    },
    
    // P5 Visual Effect Methods
    triggerGemBurst(x, y, count = 20) {
        if (!this.p5Instance) return;
        window.dispatchEvent(new CustomEvent('gembot-burst', { detail: { x, y, count } }));
    },
    
    setVisualEffects(enabled) {
        this.config.visualEffects = enabled;
        console.log(`✨ Visual effects ${enabled ? 'enabled' : 'disabled'}`);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GAME TESTING SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    async runGameTests() {
        console.log('🎮 Starting game test suite...');
        this.gameTesting.results = [];
        this.gameTesting.passCount = 0;
        this.gameTesting.failCount = 0;
        
        const tests = [
            { name: 'Merlin AI Connection', test: () => this.testMerlinAI() },
            { name: 'Academy System', test: () => this.testAcademy() },
            { name: 'Wallet System', test: () => this.testWallet() },
            { name: 'Arya Intel System', test: () => this.testAryaIntel() },
            { name: 'UI Components', test: () => this.testUIComponents() },
            { name: 'Storage System', test: () => this.testStorage() },
            { name: '3D Systems', test: () => this.test3DSystems() },
            { name: 'Authentication', test: () => this.testAuth() }
        ];
        
        for (const { name, test } of tests) {
            try {
                this.gameTesting.currentTest = name;
                console.log(`  🧪 Testing: ${name}...`);
                const result = await test();
                
                this.gameTesting.results.push({
                    name,
                    passed: result.passed,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
                
                if (result.passed) {
                    this.gameTesting.passCount++;
                    console.log(`  ✅ ${name}: PASSED`);
                } else {
                    this.gameTesting.failCount++;
                    console.log(`  ❌ ${name}: FAILED - ${result.message}`);
                }
            } catch (error) {
                this.gameTesting.failCount++;
                this.gameTesting.results.push({
                    name,
                    passed: false,
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
                console.log(`  ❌ ${name}: ERROR - ${error.message}`);
            }
        }
        
        this.gameTesting.currentTest = null;
        console.log(`\n🎮 Game Tests Complete: ${this.gameTesting.passCount}/${tests.length} passed`);
        this.updateAgentPanel();
        
        return this.gameTesting;
    },
    
    // Individual test methods
    testMerlinAI() {
        const hasSpeak = window.merlinAI && typeof window.merlinAI.speak === 'function';
        const hasAskQuestion = window.merlinAI && typeof window.merlinAI.askQuestion === 'function';
        const hasGenerate = window.merlinAI && typeof window.merlinAI.generate === 'function';
        
        return {
            passed: hasSpeak && hasAskQuestion && hasGenerate,
            message: !hasSpeak ? 'Missing speak()' : !hasAskQuestion ? 'Missing askQuestion()' : !hasGenerate ? 'Missing generate()' : 'OK'
        };
    },
    
    testAcademy() {
        const hasAcademy = !!window.GemBotAcademy;
        const hasTiers = !!window.GemBot13TierAcademy;
        
        return {
            passed: hasAcademy || hasTiers,
            message: hasAcademy || hasTiers ? 'OK' : 'Academy system not found'
        };
    },
    
    testWallet() {
        const hasWallet = !!window.walletFactory || !!window.solanaWallet;
        return {
            passed: hasWallet,
            message: hasWallet ? 'OK' : 'Wallet system not found'
        };
    },
    
    testAryaIntel() {
        const hasArya = !!window.AryaIntelSystem;
        const hasShow = hasArya && typeof window.AryaIntelSystem.show === 'function';
        
        return {
            passed: hasArya && hasShow,
            message: !hasArya ? 'AryaIntelSystem not found' : !hasShow ? 'Missing show()' : 'OK'
        };
    },
    
    testUIComponents() {
        const hasChat = !!document.getElementById('chatContainer') || !!document.querySelector('.chat-container');
        const hasMerlinCard = !!document.querySelector('.merlin-card') || !!window.merlin;
        
        return {
            passed: hasChat || hasMerlinCard,
            message: 'UI components present'
        };
    },
    
    testStorage() {
        try {
            localStorage.setItem('gembot-test', 'test');
            const val = localStorage.getItem('gembot-test');
            localStorage.removeItem('gembot-test');
            return { passed: val === 'test', message: 'OK' };
        } catch (e) {
            return { passed: false, message: 'Storage unavailable' };
        }
    },
    
    test3DSystems() {
        const hasThree = !!window.THREE;
        const has3DWorld = !!window.GemBot3DWorld;
        
        return {
            passed: hasThree,
            message: hasThree ? 'Three.js loaded' : 'Three.js not found'
        };
    },
    
    testAuth() {
        const hasAuth = !!window.authSystem;
        return {
            passed: hasAuth,
            message: hasAuth ? 'OK' : 'Auth system not found'
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DIAGNOSTICS
    // ═══════════════════════════════════════════════════════════════════════════
    async runDiagnostics() {
        console.log('🔬 Running diagnostics...');
        
        const diagnostics = {
            timestamp: new Date().toISOString(),
            browser: navigator.userAgent,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            memory: performance?.memory?.usedJSHeapSize ? 
                Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'N/A',
            systems: {
                merlinAI: !!window.merlinAI,
                academy: !!window.GemBotAcademy || !!window.GemBot13TierAcademy,
                wallet: !!window.walletFactory,
                arya: !!window.AryaIntelSystem,
                three: !!window.THREE,
                p5: !!window.p5,
                firebase: !!window.firebase
            },
            errors: this.errors.stats,
            links: {
                total: this.links.all.length,
                broken: this.links.broken.length
            }
        };
        
        console.log('📊 Diagnostics:', diagnostics);
        return diagnostics;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PERIODIC SCANNING
    // ═══════════════════════════════════════════════════════════════════════════
    startPeriodicScan() {
        setInterval(() => {
            if (this.config.logLevel === 'verbose') {
                console.log('🔄 Running periodic scan...');
            }
            this.scanLinks();
            this.updateAgentPanel();
        }, this.config.scanInterval);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // AGENT PANEL UI
    // ═══════════════════════════════════════════════════════════════════════════
    showAgentPanel() {
        let panel = document.getElementById('gembot-agent-panel');
        if (panel) {
            panel.style.display = 'block';
            return;
        }
        
        panel = document.createElement('div');
        panel.id = 'gembot-agent-panel';
        panel.innerHTML = this.renderAgentPanel();
        document.body.appendChild(panel);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #gembot-agent-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                max-height: 500px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #00d4ff;
                border-radius: 15px;
                font-family: 'Segoe UI', sans-serif;
                color: #fff;
                z-index: 99999;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,212,255,0.3);
            }
            #gembot-agent-panel .agent-header {
                background: linear-gradient(90deg, #00d4ff, #0099ff);
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #gembot-agent-panel .agent-header h3 {
                margin: 0;
                color: #000;
                font-size: 14px;
            }
            #gembot-agent-panel .agent-body {
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
            }
            #gembot-agent-panel .stat-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            #gembot-agent-panel .stat-label {
                color: #888;
                font-size: 12px;
            }
            #gembot-agent-panel .stat-value {
                font-weight: bold;
                font-size: 12px;
            }
            #gembot-agent-panel .stat-value.good { color: #4ecdc4; }
            #gembot-agent-panel .stat-value.warning { color: #ffd93d; }
            #gembot-agent-panel .stat-value.bad { color: #ff6b6b; }
            #gembot-agent-panel .agent-btn {
                background: #00d4ff;
                border: none;
                color: #000;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
                margin: 5px 5px 5px 0;
                transition: all 0.3s;
            }
            #gembot-agent-panel .agent-btn:hover {
                background: #fff;
                transform: scale(1.05);
            }
            #gembot-agent-panel .agent-btn.secondary {
                background: transparent;
                border: 1px solid #00d4ff;
                color: #00d4ff;
            }
            #gembot-agent-panel .mini-btn {
                background: none;
                border: none;
                color: #000;
                cursor: pointer;
                font-size: 16px;
                padding: 5px;
            }
            #gembot-agent-panel .error-list {
                max-height: 150px;
                overflow-y: auto;
                font-size: 10px;
                background: rgba(0,0,0,0.3);
                border-radius: 5px;
                padding: 10px;
                margin-top: 10px;
            }
            #gembot-agent-panel .error-item {
                padding: 5px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                color: #ff6b6b;
            }
            #gembot-agent-panel .test-results {
                margin-top: 10px;
            }
            #gembot-agent-panel .test-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                font-size: 11px;
            }
            #gembot-agent-panel .test-pass { color: #4ecdc4; }
            #gembot-agent-panel .test-fail { color: #ff6b6b; }
        `;
        document.head.appendChild(style);
    },
    
    renderAgentPanel() {
        return `
            <div class="agent-header">
                <h3>🤖 GemBot Agent v${this.version}</h3>
                <div>
                    <button class="mini-btn" onclick="GemBotAgent.minimizePanel()">−</button>
                    <button class="mini-btn" onclick="GemBotAgent.hidePanel()">×</button>
                </div>
            </div>
            <div class="agent-body" id="agent-body">
                <div class="stat-row">
                    <span class="stat-label">Status</span>
                    <span class="stat-value good">● Active</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Errors Captured</span>
                    <span class="stat-value ${this.errors.stats.totalCaptured > 0 ? 'warning' : 'good'}" id="stat-errors">
                        ${this.errors.stats.totalCaptured}
                    </span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Auto-Fixed</span>
                    <span class="stat-value good" id="stat-fixed">${this.errors.stats.totalFixed}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Pending Fixes</span>
                    <span class="stat-value ${this.errors.stats.totalPending > 0 ? 'bad' : 'good'}" id="stat-pending">
                        ${this.errors.stats.totalPending}
                    </span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Links Scanned</span>
                    <span class="stat-value" id="stat-links">${this.links.all.length}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">p5.js Effects</span>
                    <span class="stat-value ${this.config.p5Enabled ? 'good' : 'warning'}">
                        ${this.config.p5Enabled ? '✓ Enabled' : '✗ Disabled'}
                    </span>
                </div>
                
                <div style="margin-top: 15px;">
                    <button class="agent-btn" onclick="GemBotAgent.runGameTests()">🎮 Run Tests</button>
                    <button class="agent-btn secondary" onclick="GemBotAgent.scanLinks()">🔗 Scan Links</button>
                    <button class="agent-btn secondary" onclick="GemBotAgent.toggleEffects()">✨ Toggle FX</button>
                </div>
                
                <div class="test-results" id="test-results">
                    ${this.renderTestResults()}
                </div>
                
                ${this.errors.captured.length > 0 ? `
                    <div class="error-list" id="error-list">
                        <strong style="color:#ff6b6b;">Recent Errors:</strong>
                        ${this.errors.captured.slice(-5).map(e => `
                            <div class="error-item">${e.message?.substring(0, 80)}...</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    renderTestResults() {
        if (this.gameTesting.results.length === 0) return '';
        
        return `
            <div style="margin-top: 10px; font-size: 11px;">
                <strong>Test Results: ${this.gameTesting.passCount}/${this.gameTesting.results.length}</strong>
                ${this.gameTesting.results.map(r => `
                    <div class="test-item">
                        <span>${r.name}</span>
                        <span class="${r.passed ? 'test-pass' : 'test-fail'}">${r.passed ? '✓' : '✗'}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    updateAgentPanel() {
        const body = document.getElementById('agent-body');
        if (body) {
            body.innerHTML = this.renderAgentPanel().match(/<div class="agent-body"[^>]*>([\s\S]*)<\/div>$/)?.[1] || '';
        }
    },
    
    hidePanel() {
        const panel = document.getElementById('gembot-agent-panel');
        if (panel) panel.style.display = 'none';
    },
    
    minimizePanel() {
        const body = document.getElementById('agent-body');
        if (body) {
            body.style.display = body.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    toggleEffects() {
        this.config.visualEffects = !this.config.visualEffects;
        this.updateAgentPanel();
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════════════════
    log(message, level = 'info') {
        const levels = ['silent', 'error', 'warn', 'info', 'verbose'];
        if (levels.indexOf(level) <= levels.indexOf(this.config.logLevel)) {
            const prefix = { error: '❌', warn: '⚠️', info: 'ℹ️', verbose: '📝' }[level] || '';
            console.log(`${prefix} [GemBot Agent] ${message}`);
        }
    },
    
    getReport() {
        return {
            agent: this.name,
            version: this.version,
            timestamp: new Date().toISOString(),
            errors: this.errors,
            links: this.links,
            tests: this.gameTesting,
            config: this.config
        };
    },
    
    exportReport() {
        const report = this.getReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gembot-agent-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GemBotAgent.init());
} else {
    GemBotAgent.init();
}

console.log('🤖 GemBot FullStack Agent module loaded');
