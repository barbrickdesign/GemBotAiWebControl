/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PICKEM AI - AUTOMATED TESTING AGENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Automated testing and validation system
 * 
 * OWNER: Ryan Barbrick / Barbrick Design
 * CONTACT: BarbrickDesign@gmail.com
 * COPYRIGHT: © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const PickEmTestingAgent = {
    version: '1.0.0',
    
    testResults: [],
    
    /**
     * Initialize testing agent
     */
    init() {
        console.log('🤖 PickEm Testing Agent initializing...');
        console.log('📋 Running automated tests...');
        
        this.runAllTests();
    },
    
    /**
     * Run all test suites
     */
    async runAllTests() {
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('🧪 PICKEM AI - AUTOMATED TEST SUITE');
        console.log('═══════════════════════════════════════════════════════\n');
        
        // Test 1: Algorithm Module
        await this.testAlgorithmModule();
        
        // Test 2: Tracker Module
        await this.testTrackerModule();
        
        // Test 3: Analytics Module
        await this.testAnalyticsModule();
        
        // Test 4: Number Generation
        await this.testNumberGeneration();
        
        // Test 5: Payment Flow
        await this.testPaymentFlow();
        
        // Test 6: Data Persistence
        await this.testDataPersistence();
        
        // Test 7: UI Components
        await this.testUIComponents();
        
        // Generate test report
        this.generateTestReport();
    },
    
    /**
     * Test Algorithm Module
     */
    async testAlgorithmModule() {
        console.log('🧠 Testing Algorithm Module...');
        
        try {
            // Check if module exists
            this.assert(
                typeof window.PickEmAlgorithm !== 'undefined',
                'Algorithm module loaded',
                'CRITICAL'
            );
            
            // Test basic generation
            const basicNumbers = window.PickEmAlgorithm.generate('basic');
            this.assert(
                basicNumbers.length === 6,
                'Basic tier generates 6 numbers',
                'HIGH'
            );
            
            // Test standard generation
            const standardNumbers = window.PickEmAlgorithm.generate('standard');
            this.assert(
                standardNumbers.length === 6,
                'Standard tier generates 6 numbers',
                'HIGH'
            );
            
            // Test premium generation
            const premiumNumbers = window.PickEmAlgorithm.generate('premium');
            this.assert(
                premiumNumbers.length === 6,
                'Premium tier generates 6 numbers',
                'HIGH'
            );
            
            // Test number ranges
            const mainNumbers = premiumNumbers.slice(0, 5);
            this.assert(
                mainNumbers.every(n => n >= 1 && n <= 69),
                'Main numbers within valid range (1-69)',
                'CRITICAL'
            );
            
            const powerball = premiumNumbers[5];
            this.assert(
                powerball >= 1 && powerball <= 26,
                'Powerball within valid range (1-26)',
                'CRITICAL'
            );
            
            // Test uniqueness
            const uniqueNumbers = new Set(mainNumbers);
            this.assert(
                uniqueNumbers.size === 5,
                'Main numbers are unique',
                'CRITICAL'
            );
            
            console.log('✅ Algorithm Module tests passed\n');
        } catch (error) {
            console.error('❌ Algorithm Module tests failed:', error);
        }
    },
    
    /**
     * Test Tracker Module
     */
    async testTrackerModule() {
        console.log('📊 Testing Tracker Module...');
        
        try {
            // Check if module exists
            this.assert(
                typeof window.PickEmTracker !== 'undefined',
                'Tracker module loaded',
                'CRITICAL'
            );
            
            // Test user ID initialization
            this.assert(
                window.PickEmTracker.userData.userId !== null,
                'User ID initialized',
                'HIGH'
            );
            
            // Test purchase logging
            const purchase = window.PickEmTracker.logPurchase({
                tier: 'basic',
                amount: 5,
                transactionId: 'TEST-' + Date.now()
            });
            
            this.assert(
                purchase.id.startsWith('PURCHASE-'),
                'Purchase logged successfully',
                'HIGH'
            );
            
            // Test generation logging
            const generation = window.PickEmTracker.logGeneration({
                numbers: [1, 2, 3, 4, 5, 6],
                tier: 'basic',
                timestamp: new Date().toISOString()
            });
            
            this.assert(
                generation.id.startsWith('GEN-'),
                'Generation logged successfully',
                'HIGH'
            );
            
            // Test stats calculation
            const stats = window.PickEmTracker.getUserStats();
            this.assert(
                stats.totalInvested >= 5,
                'Stats calculated correctly',
                'MEDIUM'
            );
            
            console.log('✅ Tracker Module tests passed\n');
        } catch (error) {
            console.error('❌ Tracker Module tests failed:', error);
        }
    },
    
    /**
     * Test Analytics Module
     */
    async testAnalyticsModule() {
        console.log('📈 Testing Analytics Module...');
        
        try {
            // Check if module exists
            this.assert(
                typeof window.PickEmAnalytics !== 'undefined',
                'Analytics module loaded',
                'CRITICAL'
            );
            
            // Test community stats
            const stats = window.PickEmAnalytics.getCommunityStats();
            this.assert(
                typeof stats.totalUsers === 'number',
                'Community stats available',
                'MEDIUM'
            );
            
            // Test tier performance
            const tierPerformance = window.PickEmAnalytics.getTierPerformance();
            this.assert(
                tierPerformance.basic !== undefined,
                'Tier performance data available',
                'MEDIUM'
            );
            
            // Test insights generation
            const report = window.PickEmAnalytics.generateReport();
            this.assert(
                report.insights.length > 0,
                'Insights generated successfully',
                'LOW'
            );
            
            console.log('✅ Analytics Module tests passed\n');
        } catch (error) {
            console.error('❌ Analytics Module tests failed:', error);
        }
    },
    
    /**
     * Test Number Generation
     */
    async testNumberGeneration() {
        console.log('🎲 Testing Number Generation...');
        
        try {
            // Generate multiple sets and validate
            for (let i = 0; i < 10; i++) {
                const numbers = window.PickEmAlgorithm.generate('premium');
                
                // Validate format
                this.assert(
                    Array.isArray(numbers) && numbers.length === 6,
                    `Generation ${i + 1}: Correct format`,
                    'HIGH'
                );
                
                // Validate ranges
                const valid = numbers.slice(0, 5).every(n => n >= 1 && n <= 69) &&
                              numbers[5] >= 1 && numbers[5] <= 26;
                
                this.assert(
                    valid,
                    `Generation ${i + 1}: Valid ranges`,
                    'CRITICAL'
                );
            }
            
            console.log('✅ Number Generation tests passed\n');
        } catch (error) {
            console.error('❌ Number Generation tests failed:', error);
        }
    },
    
    /**
     * Test Payment Flow
     */
    async testPaymentFlow() {
        console.log('💳 Testing Payment Flow...');
        
        try {
            // Check PayPal container exists
            const paypalContainer = document.getElementById('paypal-button-container');
            this.assert(
                paypalContainer !== null,
                'PayPal button container exists',
                'CRITICAL'
            );
            
            // Check tier selection
            const tierCards = document.querySelectorAll('.tier-card');
            this.assert(
                tierCards.length === 3,
                'All tier cards rendered',
                'HIGH'
            );
            
            console.log('✅ Payment Flow tests passed\n');
        } catch (error) {
            console.error('❌ Payment Flow tests failed:', error);
        }
    },
    
    /**
     * Test Data Persistence
     */
    async testDataPersistence() {
        console.log('💾 Testing Data Persistence...');
        
        try {
            // Test localStorage availability
            this.assert(
                typeof localStorage !== 'undefined',
                'localStorage available',
                'CRITICAL'
            );
            
            // Test data saving
            const testKey = 'pickEm_test_' + Date.now();
            const testData = { test: true, timestamp: Date.now() };
            
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            
            this.assert(
                retrieved.test === true,
                'Data persisted correctly',
                'HIGH'
            );
            
            // Cleanup
            localStorage.removeItem(testKey);
            
            console.log('✅ Data Persistence tests passed\n');
        } catch (error) {
            console.error('❌ Data Persistence tests failed:', error);
        }
    },
    
    /**
     * Test UI Components
     */
    async testUIComponents() {
        console.log('🎨 Testing UI Components...');
        
        try {
            // Check main containers
            const containers = [
                'numbersDisplay',
                'numbersContainer',
                'paypal-button-container',
                'historyTableBody',
                'totalInvested',
                'totalWon',
                'winRate',
                'roi'
            ];
            
            containers.forEach(id => {
                const element = document.getElementById(id);
                this.assert(
                    element !== null,
                    `Element '${id}' exists`,
                    'MEDIUM'
                );
            });
            
            // Check tier cards
            const tierCards = document.querySelectorAll('.tier-card');
            tierCards.forEach((card, index) => {
                this.assert(
                    card.dataset.tier !== undefined,
                    `Tier card ${index + 1} has tier data`,
                    'MEDIUM'
                );
            });
            
            console.log('✅ UI Components tests passed\n');
        } catch (error) {
            console.error('❌ UI Components tests failed:', error);
        }
    },
    
    /**
     * Assert helper
     */
    assert(condition, message, severity = 'MEDIUM') {
        const result = {
            passed: condition,
            message: message,
            severity: severity,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        if (condition) {
            console.log(`  ✅ ${message}`);
        } else {
            console.error(`  ❌ ${message} [${severity}]`);
        }
        
        return condition;
    },
    
    /**
     * Generate test report
     */
    generateTestReport() {
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('📋 TEST REPORT');
        console.log('═══════════════════════════════════════════════════════\n');
        
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.passed).length;
        const failed = total - passed;
        const passRate = (passed / total * 100).toFixed(1);
        
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed} ✅`);
        console.log(`Failed: ${failed} ❌`);
        console.log(`Pass Rate: ${passRate}%`);
        
        // Group by severity
        const critical = this.testResults.filter(r => !r.passed && r.severity === 'CRITICAL');
        const high = this.testResults.filter(r => !r.passed && r.severity === 'HIGH');
        const medium = this.testResults.filter(r => !r.passed && r.severity === 'MEDIUM');
        
        if (critical.length > 0) {
            console.log('\n🚨 CRITICAL FAILURES:');
            critical.forEach(r => console.log(`  - ${r.message}`));
        }
        
        if (high.length > 0) {
            console.log('\n⚠️ HIGH PRIORITY FAILURES:');
            high.forEach(r => console.log(`  - ${r.message}`));
        }
        
        if (medium.length > 0) {
            console.log('\n⚡ MEDIUM PRIORITY FAILURES:');
            medium.forEach(r => console.log(`  - ${r.message}`));
        }
        
        if (failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED! System is ready for deployment.');
        } else {
            console.log('\n⚠️ Some tests failed. Please review and fix issues before deployment.');
        }
        
        console.log('\n═══════════════════════════════════════════════════════\n');
        
        // Save report
        localStorage.setItem('pickEm_testReport', JSON.stringify({
            timestamp: new Date().toISOString(),
            total, passed, failed, passRate,
            results: this.testResults
        }));
    }
};

// Auto-run tests when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PickEmTestingAgent.init());
} else {
    PickEmTestingAgent.init();
}

// Export for manual testing
window.PickEmTestingAgent = PickEmTestingAgent;
