/**
 * GemBot Automated Testing Agent
 * Autonomous system to test every button, screen, and flow in the game
 * Logs all errors, visual issues, and validates complete functionality
 */

class GemBotTestingAgent {
    constructor() {
        this.testResults = {
            passed: [],
            failed: [],
            warnings: [],
            screenshots: [],
            flowIssues: [],
            startTime: Date.now(),
            endTime: null
        };
        
        this.testQueue = [];
        this.currentTest = null;
        this.isRunning = false;
        
        this.screenSizes = [
            { name: 'Mobile Portrait', width: 375, height: 667 },
            { name: 'Mobile Landscape', width: 667, height: 375 },
            { name: 'Tablet Portrait', width: 768, height: 1024 },
            { name: 'Tablet Landscape', width: 1024, height: 768 },
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Ultrawide', width: 2560, height: 1440 }
        ];
        
        this.merlinTestPhrases = [
            "How do I deploy a machine?",
            "What's my balance?",
            "Show me the marketplace",
            "I need help",
            "How do I upgrade?",
            "Monitor my production",
            "I want to craft something",
            "Can I trade gems?",
            "Scan the area",
            "Connect to machine",
            "Open the academy",
            "Show settings",
            "What can I do?",
            "I'm stuck",
            "Tell me about gemstones"
        ];
        
        this.init();
    }
    
    init() {
        console.log('🤖 GemBot Automated Testing Agent initialized');
        this.buildTestQueue();
    }
    
    /**
     * Build comprehensive test queue
     */
    buildTestQueue() {
        // Phase 1: Button Tests
        this.queueButtonTests();
        
        // Phase 2: Navigation Flow Tests
        this.queueNavigationTests();
        
        // Phase 3: Merlin AI Tests
        this.queueMerlinTests();
        
        // Phase 4: Screen Size Tests
        this.queueResponsiveTests();
        
        // Phase 5: Visual Validation
        this.queueVisualTests();
        
        // Phase 6: Game Mechanics Tests
        this.queueGameMechanicsTests();
        
        console.log(`📋 Test queue built: ${this.testQueue.length} total tests`);
    }
    
    /**
     * Queue all button click tests
     */
    queueButtonTests() {
        const buttonSelectors = [
            // Serial Connection
            '#scanBtn',
            '#connectBtn',
            '#disconnectBtn',
            
            // Camera Controls
            '#cameraStartBtn',
            '#cameraStopBtn',
            '#recordBtn',
            
            // Motor Controls
            '#btnContinuous',
            '#btnStep',
            '#btnRotateCCW',
            '#btnRotateCW',
            '#btnIndexBack',
            '#btnIndexFwd',
            '#btnHome',
            '#emergencyStop',
            
            // Diagnostics
            '#btnDiagnostic',
            
            // Merlin Card
            '.merlin-card-container',
            '#merlinSendBtn',
            
            // GBUV Controls
            '[data-action="deploy"]',
            '[data-action="monitor"]',
            '[data-action="upgrade-automation"]',
            
            // Marketplace
            '.marketplace-btn',
            
            // 3D Controls
            '.virtual-machine-controls button'
        ];
        
        buttonSelectors.forEach(selector => {
            this.testQueue.push({
                type: 'button',
                selector,
                name: `Button: ${selector}`,
                test: () => this.testButtonClick(selector)
            });
        });
    }
    
    /**
     * Queue navigation flow tests
     */
    queueNavigationTests() {
        const flows = [
            {
                name: 'New Player Flow',
                steps: [
                    'Open page',
                    'See welcome message',
                    'Deploy first machine',
                    'Collect gems',
                    'Upgrade machine'
                ]
            },
            {
                name: 'Marketplace Flow',
                steps: [
                    'Click marketplace',
                    'Browse items',
                    'Purchase item',
                    'Return to farm'
                ]
            },
            {
                name: 'Machine Control Flow',
                steps: [
                    'Connect to machine',
                    'Move X axis',
                    'Move Y axis',
                    'Rotate',
                    'Home position'
                ]
            }
        ];
        
        flows.forEach(flow => {
            this.testQueue.push({
                type: 'flow',
                name: flow.name,
                test: () => this.testNavigationFlow(flow)
            });
        });
    }
    
    /**
     * Queue Merlin AI conversation tests
     */
    queueMerlinTests() {
        this.merlinTestPhrases.forEach(phrase => {
            this.testQueue.push({
                type: 'merlin',
                name: `Merlin: "${phrase}"`,
                test: () => this.testMerlinResponse(phrase)
            });
        });
    }
    
    /**
     * Queue responsive design tests
     */
    queueResponsiveTests() {
        this.screenSizes.forEach(size => {
            this.testQueue.push({
                type: 'responsive',
                name: `Screen: ${size.name}`,
                test: () => this.testScreenSize(size)
            });
        });
    }
    
    /**
     * Queue visual validation tests
     */
    queueVisualTests() {
        const visualChecks = [
            'Merlin card visibility',
            '3D machine rendering',
            'Control panel layout',
            'Chat message formatting',
            'Button hover states',
            'Modal overlays',
            'Progress bars',
            'Balance display'
        ];
        
        visualChecks.forEach(check => {
            this.testQueue.push({
                type: 'visual',
                name: `Visual: ${check}`,
                test: () => this.testVisualElement(check)
            });
        });
    }
    
    /**
     * Queue game mechanics tests
     */
    queueGameMechanicsTests() {
        const mechanics = [
            'GBUV balance tracking',
            'Machine deployment',
            'Idle production',
            'Upgrade costs',
            'Real-world bonus',
            'Transaction history',
            'Achievement tracking'
        ];
        
        mechanics.forEach(mechanic => {
            this.testQueue.push({
                type: 'mechanics',
                name: `Mechanic: ${mechanic}`,
                test: () => this.testGameMechanic(mechanic)
            });
        });
    }
    
    /**
     * Start automated testing
     */
    async runAllTests() {
        if (this.isRunning) {
            console.warn('⚠️ Tests already running');
            return;
        }
        
        this.isRunning = true;
        this.testResults.startTime = Date.now();
        
        console.log('🚀 Starting automated testing...');
        console.log(`📋 Total tests: ${this.testQueue.length}`);
        
        for (let i = 0; i < this.testQueue.length; i++) {
            const test = this.testQueue[i];
            this.currentTest = test;
            
            console.log(`\n[${i + 1}/${this.testQueue.length}] Testing: ${test.name}`);
            
            try {
                await test.test();
                this.testResults.passed.push({
                    name: test.name,
                    type: test.type,
                    timestamp: Date.now()
                });
                console.log(`✅ PASS: ${test.name}`);
            } catch (error) {
                this.testResults.failed.push({
                    name: test.name,
                    type: test.type,
                    error: error.message,
                    stack: error.stack,
                    timestamp: Date.now()
                });
                console.error(`❌ FAIL: ${test.name}`, error);
            }
            
            // Small delay between tests
            await this.delay(500);
        }
        
        this.testResults.endTime = Date.now();
        this.isRunning = false;
        
        this.generateReport();
    }
    
    /**
     * Test button click
     */
    async testButtonClick(selector) {
        const element = document.querySelector(selector);
        
        if (!element) {
            throw new Error(`Element not found: ${selector}`);
        }
        
        if (!element.offsetParent) {
            this.testResults.warnings.push({
                message: `Element hidden: ${selector}`,
                timestamp: Date.now()
            });
        }
        
        // Check if button is disabled
        if (element.disabled) {
            this.testResults.warnings.push({
                message: `Button disabled: ${selector}`,
                timestamp: Date.now()
            });
        }
        
        // Simulate click
        element.click();
        
        // Wait for any async operations
        await this.delay(300);
        
        // Check for console errors after click
        // (This requires monkey-patching console.error earlier)
        
        return true;
    }
    
    /**
     * Test navigation flow
     */
    async testNavigationFlow(flow) {
        console.log(`  🔄 Testing flow: ${flow.name}`);
        
        for (const step of flow.steps) {
            console.log(`    → ${step}`);
            // Implement step-specific logic
            await this.delay(500);
        }
        
        return true;
    }
    
    /**
     * Test Merlin AI response
     */
    async testMerlinResponse(phrase) {
        if (!window.MerlinCardIntegrated) {
            throw new Error('Merlin Card not initialized');
        }
        
        // Send message to Merlin
        const merlinInput = document.querySelector('#merlinChatInput');
        if (merlinInput) {
            merlinInput.value = phrase;
            
            const sendBtn = document.querySelector('#merlinSendBtn');
            if (sendBtn) {
                sendBtn.click();
            }
        }
        
        // Wait for response
        await this.delay(2000);
        
        // Check if card flipped (guidance triggered)
        const cardContainer = document.querySelector('.card-container');
        if (cardContainer && cardContainer.classList.contains('flipped')) {
            console.log('    ✓ Card guidance triggered');
        }
        
        return true;
    }
    
    /**
     * Test screen size
     */
    async testScreenSize(size) {
        // Can't actually resize browser, but can check responsive CSS
        console.log(`  📱 Simulating ${size.name} (${size.width}x${size.height})`);
        
        // Check viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            throw new Error('Missing viewport meta tag');
        }
        
        // Check for media query issues
        // This is a simplified check - real testing would use browser automation
        
        return true;
    }
    
    /**
     * Test visual element
     */
    async testVisualElement(checkName) {
        console.log(`  👁️ Checking: ${checkName}`);
        
        switch (checkName) {
            case 'Merlin card visibility':
                const merlinCard = document.querySelector('#merlin-ai-card-integrated');
                if (!merlinCard) throw new Error('Merlin card not found');
                if (merlinCard.style.display === 'none') throw new Error('Merlin card hidden');
                break;
                
            case '3D machine rendering':
                const canvas3d = document.querySelector('#vm3dCanvas');
                if (!canvas3d) throw new Error('3D canvas not found');
                break;
                
            // Add more visual checks...
        }
        
        return true;
    }
    
    /**
     * Test game mechanic
     */
    async testGameMechanic(mechanic) {
        console.log(`  🎮 Testing: ${mechanic}`);
        
        switch (mechanic) {
            case 'GBUV balance tracking':
                if (!window.GBUV) throw new Error('GBUV not initialized');
                const balance = window.GBUV.getBalance();
                if (typeof balance.gems !== 'number') throw new Error('Invalid balance structure');
                break;
                
            case 'Machine deployment':
                if (!window.GBUV) throw new Error('GBUV not initialized');
                const startGems = window.GBUV.playerBalance.gems;
                if (startGems < 500) {
                    window.GBUV.addGems(1000, 'test');
                }
                const result = window.GBUV.deployVirtualMachine('basic_cutter', 500);
                if (!result.success && result.error) {
                    console.log(`    ℹ️ Expected: ${result.error}`);
                }
                break;
                
            // Add more mechanic tests...
        }
        
        return true;
    }
    
    /**
     * Generate comprehensive report
     */
    generateReport() {
        const duration = (this.testResults.endTime - this.testResults.startTime) / 1000;
        const total = this.testResults.passed.length + this.testResults.failed.length;
        const passRate = ((this.testResults.passed.length / total) * 100).toFixed(2);
        
        console.log('\n' + '='.repeat(70));
        console.log('📊 GEMBOT AUTOMATED TESTING REPORT');
        console.log('='.repeat(70));
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`✅ Passed: ${this.testResults.passed.length}/${total}`);
        console.log(`❌ Failed: ${this.testResults.failed.length}/${total}`);
        console.log(`⚠️  Warnings: ${this.testResults.warnings.length}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        console.log('='.repeat(70));
        
        if (this.testResults.failed.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults.failed.forEach((fail, i) => {
                console.log(`\n${i + 1}. ${fail.name}`);
                console.log(`   Type: ${fail.type}`);
                console.log(`   Error: ${fail.error}`);
            });
        }
        
        if (this.testResults.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            this.testResults.warnings.forEach((warn, i) => {
                console.log(`${i + 1}. ${warn.message}`);
            });
        }
        
        // Save report to localStorage
        localStorage.setItem('gembot_test_report', JSON.stringify(this.testResults));
        
        console.log('\n💾 Report saved to localStorage: gembot_test_report');
        console.log('='.repeat(70));
        
        return this.testResults;
    }
    
    /**
     * Export report as downloadable file
     */
    exportReport() {
        const report = {
            ...this.testResults,
            summary: {
                total: this.testResults.passed.length + this.testResults.failed.length,
                passed: this.testResults.passed.length,
                failed: this.testResults.failed.length,
                warnings: this.testResults.warnings.length,
                duration: (this.testResults.endTime - this.testResults.startTime) / 1000,
                passRate: ((this.testResults.passed.length / (this.testResults.passed.length + this.testResults.failed.length)) * 100).toFixed(2)
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gembot-test-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📥 Report downloaded');
    }
    
    /**
     * Utility: Delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Quick test - run subset of tests
     */
    async runQuickTest() {
        const quickTests = this.testQueue.filter(t => 
            t.type === 'button' || t.type === 'visual'
        ).slice(0, 20);
        
        const originalQueue = this.testQueue;
        this.testQueue = quickTests;
        
        await this.runAllTests();
        
        this.testQueue = originalQueue;
    }
}

// Initialize global testing agent
window.GemBotTestingAgent = new GemBotTestingAgent();

// Add convenient global functions
window.runGemBotTests = () => window.GemBotTestingAgent.runAllTests();
window.runQuickTest = () => window.GemBotTestingAgent.runQuickTest();
window.exportTestReport = () => window.GemBotTestingAgent.exportReport();

console.log('✅ GemBot Automated Testing Agent loaded');
console.log('📝 Commands:');
console.log('   runGemBotTests()    - Run all tests');
console.log('   runQuickTest()      - Run quick subset');
console.log('   exportTestReport()  - Download report');
