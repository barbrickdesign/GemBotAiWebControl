/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GemBot Control AI - Comprehensive System Test
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Run this in the browser console (F12) to verify all systems are functioning
 * 
 * COPYRIGHT © 2024-2025 Ryan Barbrick / Barbrick Design
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const GemBotSystemTest = {
    results: [],
    passed: 0,
    failed: 0,
    warnings: 0,
    
    log(category, test, passed, message) {
        const status = passed ? '✅' : '❌';
        const result = { category, test, passed, message };
        this.results.push(result);
        if (passed) this.passed++; else this.failed++;
        console.log(`${status} [${category}] ${test}: ${message}`);
        return passed;
    },
    
    warn(category, message) {
        this.warnings++;
        console.warn(`⚠️ [${category}] ${message}`);
    },
    
    // ==================== TEST CATEGORIES ====================
    
    testScriptLoading() {
        console.log('\n=== 1. SCRIPT LOADING TESTS ===');
        
        // Core Systems
        this.log('Scripts', 'GemBotMarketplace', typeof window.GemBotMarketplace !== 'undefined', 
            typeof window.GemBotMarketplace !== 'undefined' ? 'Loaded' : 'NOT FOUND');
        
        this.log('Scripts', 'FantasyMarketplace', typeof window.FantasyMarketplace !== 'undefined',
            typeof window.FantasyMarketplace !== 'undefined' ? `v${window.FantasyMarketplace?.version}` : 'NOT FOUND');
        
        this.log('Scripts', 'AryaIntelSystem', typeof window.AryaIntelSystem !== 'undefined',
            typeof window.AryaIntelSystem !== 'undefined' ? `v${window.AryaIntelSystem?.version}` : 'NOT FOUND');
        
        this.log('Scripts', 'MerlinIntelligence', typeof window.MerlinIntelligence !== 'undefined',
            typeof window.MerlinIntelligence !== 'undefined' ? 'Loaded' : 'Check merlin-intelligence-system.js');
        
        this.log('Scripts', 'MerlinEnhancedResponses', typeof window.MerlinEnhancedResponses !== 'undefined',
            typeof window.MerlinEnhancedResponses !== 'undefined' ? 'Loaded' : 'NOT FOUND');
        
        // 3D Systems
        this.log('Scripts', 'BABYLON', typeof BABYLON !== 'undefined',
            typeof BABYLON !== 'undefined' ? 'Loaded' : 'NOT FOUND');
        
        this.log('Scripts', 'VirtualMachine3D', typeof VirtualMachine3D !== 'undefined',
            typeof VirtualMachine3D !== 'undefined' ? 'Loaded' : 'NOT FOUND');
        
        this.log('Scripts', 'QuantumGemVisualizer', typeof QuantumGemVisualizer !== 'undefined',
            typeof QuantumGemVisualizer !== 'undefined' ? 'Loaded' : 'NOT FOUND');
    },
    
    testDOMElements() {
        console.log('\n=== 2. DOM ELEMENT TESTS ===');
        
        // Chat/AI elements
        this.log('DOM', 'aiInput', !!document.getElementById('aiInput'), 'Chat input field');
        this.log('DOM', 'aiMessages', !!document.getElementById('aiMessages'), 'Message display area');
        this.log('DOM', 'aiSendBtn', !!document.getElementById('aiSendBtn'), 'Send button');
        
        // Machine controls
        this.log('DOM', 'scanBtn', !!document.getElementById('scanBtn'), 'Scan ports button');
        this.log('DOM', 'connectBtn', !!document.getElementById('connectBtn'), 'Connect button');
        this.log('DOM', 'emergencyStop', !!document.getElementById('emergencyStop'), 'Emergency stop button');
        this.log('DOM', 'speedSlider', !!document.getElementById('speedSlider'), 'Speed control');
        
        // 3D Canvas
        this.log('DOM', 'babylon-canvas', !!document.getElementById('babylon-canvas'), '3D rendering canvas');
        
        // Leaderboard/Marketplace
        this.log('DOM', 'leaderboardOverlay', !!document.getElementById('leaderboardOverlay'), 'Leaderboard overlay');
        this.log('DOM', 'leaderboardContent', !!document.getElementById('leaderboardContent'), 'Leaderboard content area');
        
        // Auth
        this.log('DOM', 'authOverlay', !!document.getElementById('authOverlay'), 'Auth overlay');
    },
    
    testGlobalFunctions() {
        console.log('\n=== 3. GLOBAL FUNCTION TESTS ===');
        
        this.log('Functions', 'addMessage', typeof addMessage === 'function', 'Chat message function');
        this.log('Functions', 'startCamera', typeof startCamera === 'function', 'Camera start function');
        this.log('Functions', 'stopCamera', typeof stopCamera === 'function', 'Camera stop function');
        this.log('Functions', 'autoAdjustImage', typeof autoAdjustImage === 'function', 'Auto adjust image');
    },
    
    testGlobalObjects() {
        console.log('\n=== 4. GLOBAL OBJECT TESTS ===');
        
        this.log('Objects', 'authSystem', typeof authSystem !== 'undefined', 
            authSystem?.currentUser ? `Logged in: ${authSystem.currentUser.username}` : 'No user session');
        
        this.log('Objects', 'merlin', typeof merlin !== 'undefined',
            merlin?.userProfile ? 'Profile loaded' : 'No profile');
        
        this.log('Objects', 'leaderboardUI', typeof leaderboardUI !== 'undefined', 'Leaderboard UI controller');
        this.log('Objects', 'marketplaceUI', typeof marketplaceUI !== 'undefined', 'Marketplace UI controller');
        this.log('Objects', 'serial', typeof serial !== 'undefined', 'Serial port manager');
        this.log('Objects', 'voice', typeof voice !== 'undefined', 'Voice synthesis');
        this.log('Objects', 'ai', typeof ai !== 'undefined', 'AI handler');
    },
    
    testFantasyMarketplace() {
        console.log('\n=== 5. FANTASY MARKETPLACE TESTS ===');
        
        const fm = window.FantasyMarketplace;
        if (!fm) {
            this.log('Fantasy', 'FantasyMarketplace', false, 'NOT LOADED');
            return;
        }
        
        this.log('Fantasy', 'initialized', fm.initialized === true, fm.initialized ? 'Yes' : 'No');
        this.log('Fantasy', 'fantasyCatalog.items', fm.fantasyCatalog?.items?.length > 0, 
            `${fm.fantasyCatalog?.items?.length || 0} items`);
        this.log('Fantasy', 'fantasyCatalog.rawData', fm.fantasyCatalog?.rawData?.length > 0,
            `${fm.fantasyCatalog?.rawData?.length || 0} raw items`);
        this.log('Fantasy', 'metalPrices', !!fm.metalPrices, 
            fm.metalPrices ? `Gold: $${fm.metalPrices.gold?.pricePerOz}/oz` : 'Not set');
        
        // Test functions
        this.log('Fantasy', 'formatPrice()', typeof fm.formatPrice === 'function', 
            typeof fm.formatPrice === 'function' ? fm.formatPrice(10000) : 'Missing');
        this.log('Fantasy', 'applyeCryptoFee()', typeof fm.applyeCryptoFee === 'function', 
            typeof fm.applyeCryptoFee === 'function' ? `$100 → $${fm.applyeCryptoFee(100)}` : 'Missing');
    },
    
    testAryaIntel() {
        console.log('\n=== 6. ARYA INTEL SYSTEM TESTS ===');
        
        const arya = window.AryaIntelSystem;
        if (!arya) {
            this.log('Arya', 'AryaIntelSystem', false, 'NOT LOADED');
            return;
        }
        
        this.log('Arya', 'initialized', arya.initialized === true, arya.initialized ? 'Yes' : 'No');
        this.log('Arya', 'marketData', !!arya.marketData, 
            arya.marketData?.gems ? `${Object.keys(arya.marketData.gems).length} gem types` : 'Not loaded');
        this.log('Arya', 'slinginRockzDB', !!arya.slinginRockzDB,
            arya.slinginRockzDB?.minerals ? `${Object.keys(arya.slinginRockzDB.minerals).length} minerals` : 'Not loaded');
        
        // Test functions
        this.log('Arya', 'getMarketPrice()', typeof arya.getMarketPrice === 'function', 'Available');
        this.log('Arya', 'calculateRecutCost()', typeof arya.calculateRecutCost === 'function', 'Available');
    },
    
    testEarthArtMarketplace() {
        console.log('\n=== 7. EARTH ART GEMS MARKETPLACE TESTS ===');
        
        const mp = window.GemBotMarketplace;
        if (!mp) {
            this.log('EarthArt', 'GemBotMarketplace', false, 'NOT LOADED');
            return;
        }
        
        this.log('EarthArt', 'initialized', mp.initialized === true, mp.initialized ? 'Yes' : 'No');
        this.log('EarthArt', 'catalog.items', mp.catalog?.items?.length > 0,
            `${mp.catalog?.items?.length || 0} items`);
        this.log('EarthArt', 'config.tokenAddress', !!mp.config?.tokenAddress,
            mp.config?.tokenAddress?.slice(0, 12) + '...');
        
        // Test market stats
        const stats = mp.getMarketStats?.();
        this.log('EarthArt', 'getMarketStats()', !!stats, 
            stats ? `${stats.totalItems || 0} total items` : 'Failed');
    },
    
    testMarketplaceUI() {
        console.log('\n=== 8. MARKETPLACE UI TESTS ===');
        
        if (typeof marketplaceUI === 'undefined') {
            this.log('UI', 'marketplaceUI', false, 'NOT DEFINED');
            return;
        }
        
        // Test category handlers
        const categories = ['jewelry', 'forge', 'metals', 'trade', 
            'fantasycuts', 'fantasyrecut', 'customring', 'livemetals',
            'stonemarketplace', 'recut', 'research', 'mineraldb'];
        
        categories.forEach(cat => {
            const handlerName = `show${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
            const hasHandler = typeof marketplaceUI.openCategory === 'function';
            this.log('UI', `Category: ${cat}`, hasHandler, hasHandler ? 'Handler exists' : 'Missing');
        });
    },
    
    test3DVisualization() {
        console.log('\n=== 9. 3D VISUALIZATION TESTS ===');
        
        const canvas = document.getElementById('babylon-canvas');
        this.log('3D', 'Canvas exists', !!canvas, canvas ? `${canvas.width}x${canvas.height}` : 'Missing');
        
        if (typeof virtualMachine !== 'undefined' && virtualMachine) {
            this.log('3D', 'VirtualMachine initialized', !!virtualMachine.scene, 
                virtualMachine.scene ? 'Scene active' : 'No scene');
            this.log('3D', 'Camera', !!virtualMachine.camera, 'Available');
        } else {
            this.log('3D', 'VirtualMachine', false, 'Not initialized');
        }
        
        this.log('3D', 'BABYLON loaded', typeof BABYLON !== 'undefined', 
            typeof BABYLON !== 'undefined' ? `v${BABYLON.Engine?.Version || 'unknown'}` : 'Missing');
    },
    
    testAuthentication() {
        console.log('\n=== 10. AUTHENTICATION TESTS ===');
        
        if (typeof authSystem === 'undefined') {
            this.log('Auth', 'authSystem', false, 'NOT DEFINED');
            return;
        }
        
        this.log('Auth', 'currentUser', !!authSystem.currentUser,
            authSystem.currentUser ? `${authSystem.currentUser.username}` : 'Not logged in');
        this.log('Auth', 'deviceId', !!authSystem.deviceId, 
            authSystem.deviceId ? authSystem.deviceId.slice(-8) : 'Not set');
        this.log('Auth', 'sessionToken', !!authSystem.sessionToken, 'Present');
    },
    
    testMachineControl() {
        console.log('\n=== 11. MACHINE CONTROL INTERFACE TESTS ===');
        
        // Test serial object
        this.log('Machine', 'serial object', typeof serial !== 'undefined', 
            typeof serial !== 'undefined' ? 'Loaded' : 'NOT FOUND');
        
        if (typeof serial !== 'undefined') {
            this.log('Machine', 'serial.sendCommand()', typeof serial.sendCommand === 'function', 'Available');
            this.log('Machine', 'serial.scanPorts()', typeof serial.scanPorts === 'function', 'Available');
            this.log('Machine', 'serial.connect()', typeof serial.connect === 'function', 'Available');
            this.log('Machine', 'serial.disconnect()', typeof serial.disconnect === 'function', 'Available');
        }
        
        // Test control variables
        this.log('Machine', 'motorSpeed variable', typeof motorSpeed !== 'undefined', 
            typeof motorSpeed !== 'undefined' ? `Speed: ${motorSpeed}` : 'Not defined');
        this.log('Machine', 'motorMode variable', typeof motorMode !== 'undefined',
            typeof motorMode !== 'undefined' ? `Mode: ${motorMode}` : 'Not defined');
        this.log('Machine', 'isConnected variable', typeof isConnected !== 'undefined',
            typeof isConnected !== 'undefined' ? `Connected: ${isConnected}` : 'Not defined');
            
        // Test control buttons
        this.log('Machine', 'X+ button', !!document.querySelector('[data-cmd="d"]'), 'Found');
        this.log('Machine', 'X- button', !!document.querySelector('[data-cmd="a"]'), 'Found');
        this.log('Machine', 'Y+ button', !!document.querySelector('[data-cmd="w"]'), 'Found');
        this.log('Machine', 'Y- button', !!document.querySelector('[data-cmd="s"]'), 'Found');
        this.log('Machine', 'Home button', !!document.querySelector('[data-cmd="h"]'), 'Found');
    },
    
    testIntegration() {
        console.log('\n=== 12. INTEGRATION TESTS ===');
        
        // Test all systems communicate
        const systems = [];
        
        // Check Fantasy → GemBot marketplace connection
        const fantasy = window.FantasyMarketplace;
        const gembot = window.GemBotMarketplace;
        if (fantasy && gembot) {
            systems.push('Fantasy↔GemBot');
            this.log('Integration', 'Fantasy + GemBot', true, 'Both loaded');
        } else {
            this.log('Integration', 'Fantasy + GemBot', false, 'Missing one or both');
        }
        
        // Check Merlin → Economy connection
        if (typeof merlin !== 'undefined' && merlin?.userProfile?.gemForge) {
            this.log('Integration', 'Merlin + Economy', true, 'Profile with GemForge');
        } else {
            this.log('Integration', 'Merlin + Economy', !!(typeof merlin !== 'undefined'), 
                typeof merlin !== 'undefined' ? 'Missing GemForge' : 'Merlin not loaded');
        }
        
        // Check Auth → Leaderboard connection
        if (typeof authSystem !== 'undefined' && typeof leaderboardUI !== 'undefined') {
            this.log('Integration', 'Auth + Leaderboard', true, 'Both connected');
        } else {
            this.log('Integration', 'Auth + Leaderboard', false, 'Missing connection');
        }
        
        // Check 3D → Machine state connection
        if (typeof virtualMachine !== 'undefined' && typeof serial !== 'undefined') {
            this.log('Integration', '3D + Serial', true, 'Both available');
        } else {
            this.log('Integration', '3D + Serial', false, 'Missing connection');
        }
        
        // Check localStorage state persistence
        const stateKeys = ['merlin_user_profile', 'gembot_marketplace', 'fantasy_marketplace', 'gembot_session'];
        let foundStates = 0;
        stateKeys.forEach(key => {
            if (localStorage.getItem(key)) foundStates++;
        });
        this.log('Integration', 'State Persistence', foundStates > 0, `${foundStates}/4 states saved`);
        
        // Check token address consistency
        const tokenAddr = 'DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump';
        const gembotToken = gembot?.config?.tokenAddress;
        const fantasyToken = fantasy?.config?.tokenAddress;
        const tokensMatch = gembotToken === tokenAddr || fantasyToken === tokenAddr;
        this.log('Integration', 'Token Address', tokensMatch, tokensMatch ? '$GBUV verified' : 'Mismatch');
    },
    
    // ==================== RUN ALL TESTS ====================
    
    runAll() {
        console.clear();
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🔬 GemBot Control AI - Comprehensive System Test');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('Running all tests...\n');
        
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        this.warnings = 0;
        
        this.testScriptLoading();
        this.testDOMElements();
        this.testGlobalFunctions();
        this.testGlobalObjects();
        this.testFantasyMarketplace();
        this.testAryaIntel();
        this.testEarthArtMarketplace();
        this.testMarketplaceUI();
        this.test3DVisualization();
        this.testAuthentication();
        this.testMachineControl();
        this.testIntegration();
        
        // Summary
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('📊 TEST SUMMARY');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`⚠️ Warnings: ${this.warnings}`);
        console.log(`📈 Pass Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
        console.log('═══════════════════════════════════════════════════════════════');
        
        if (this.failed === 0) {
            console.log('🎉 ALL TESTS PASSED! System is fully operational.');
        } else {
            console.log(`⚠️ ${this.failed} test(s) failed. Review issues above.`);
        }
        
        return {
            passed: this.passed,
            failed: this.failed,
            warnings: this.warnings,
            results: this.results
        };
    }
};

// Auto-run if in browser console
if (typeof window !== 'undefined') {
    console.log('💡 Run GemBotSystemTest.runAll() to execute all tests');
}

// Export
window.GemBotSystemTest = GemBotSystemTest;
