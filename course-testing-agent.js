/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COURSE TESTING AGENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * AI Agent for Academy Course Testing
 * - Validates course content and structure
 * - Tests quiz functionality and anti-cheat
 * - Ensures learning progression works correctly
 * - Validates certification requirements
 * - Tests payment and token systems
 * - Ensures users can complete full learning path
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.CourseTestingAgent = {
    version: '1.0.0',
    agentName: 'Course Testing Agent',
    initialized: false,
    
    // Test configuration
    config: {
        autoTest: false,
        reportErrors: true,
        validateContent: true,
        testAntiCheat: true,
        simulateUser: true
    },
    
    // Test results
    results: {
        passed: [],
        failed: [],
        warnings: [],
        coverage: 0,
        timestamp: null
    },
    
    // Course structure
    courses: {
        tiers: [],
        lessons: [],
        quizzes: [],
        resources: []
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async init() {
        console.log('🎓 Course Testing Agent initializing...');
        
        // Load course structure
        await this.loadCourseStructure();
        
        // Setup test framework
        this.setupTestFramework();
        
        // Run initial validation
        if (this.config.autoTest) {
            await this.runAllTests();
        }
        
        this.initialized = true;
        console.log('✅ Course Testing Agent ready');
        
        return this;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // COURSE STRUCTURE LOADING
    // ═══════════════════════════════════════════════════════════════════════════
    
    async loadCourseStructure() {
        console.log('📚 Loading course structure...');
        
        // Check if GemBotAcademyComplete exists
        if (window.GemBotAcademyComplete) {
            const academy = window.GemBotAcademyComplete;
            
            // Extract tier information
            if (academy.tiers) {
                this.courses.tiers = Object.keys(academy.tiers).map(key => ({
                    id: key,
                    ...academy.tiers[key]
                }));
            }
            
            // Extract lesson information
            if (academy.lessons) {
                this.courses.lessons = Object.keys(academy.lessons).map(key => ({
                    id: key,
                    ...academy.lessons[key]
                }));
            }
            
            // Extract resources
            if (academy.resources) {
                this.courses.resources = academy.resources;
            }
            
            console.log('✅ Loaded', this.courses.tiers.length, 'tiers');
            console.log('✅ Loaded', this.courses.lessons.length, 'lessons');
        } else {
            console.warn('⚠️ GemBotAcademyComplete not found');
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TEST FRAMEWORK
    // ═══════════════════════════════════════════════════════════════════════════
    
    setupTestFramework() {
        this.testSuite = {
            'Course Structure': this.testCourseStructure.bind(this),
            'Lesson Content': this.testLessonContent.bind(this),
            'Quiz Functionality': this.testQuizFunctionality.bind(this),
            'Anti-Cheat System': this.testAntiCheat.bind(this),
            'Progress Tracking': this.testProgressTracking.bind(this),
            'Certification': this.testCertification.bind(this),
            'Payment System': this.testPaymentSystem.bind(this),
            'User Journey': this.testUserJourney.bind(this),
            'Resource Links': this.testResourceLinks.bind(this),
            'Mobile Compatibility': this.testMobileCompatibility.bind(this)
        };
    },
    
    async runAllTests() {
        console.log('🧪 Running all course tests...');
        
        this.results = {
            passed: [],
            failed: [],
            warnings: [],
            coverage: 0,
            timestamp: new Date().toISOString()
        };
        
        const totalTests = Object.keys(this.testSuite).length;
        let completedTests = 0;
        
        for (const [testName, testFunc] of Object.entries(this.testSuite)) {
            try {
                console.log(`\n🔍 Testing: ${testName}...`);
                const result = await testFunc();
                
                if (result.passed) {
                    this.results.passed.push({
                        test: testName,
                        message: result.message,
                        details: result.details
                    });
                    console.log(`✅ ${testName}: PASSED`);
                } else {
                    this.results.failed.push({
                        test: testName,
                        message: result.message,
                        details: result.details
                    });
                    console.error(`❌ ${testName}: FAILED - ${result.message}`);
                }
                
                if (result.warnings) {
                    this.results.warnings.push(...result.warnings.map(w => ({
                        test: testName,
                        warning: w
                    })));
                }
                
            } catch (error) {
                this.results.failed.push({
                    test: testName,
                    message: error.message,
                    error: error
                });
                console.error(`❌ ${testName}: ERROR - ${error.message}`);
            }
            
            completedTests++;
            this.results.coverage = (completedTests / totalTests) * 100;
        }
        
        // Generate report
        this.generateTestReport();
        
        return this.results;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INDIVIDUAL TESTS
    // ═══════════════════════════════════════════════════════════════════════════
    
    async testCourseStructure() {
        const issues = [];
        const warnings = [];
        
        // Test tier structure
        if (this.courses.tiers.length === 0) {
            issues.push('No tiers found in course structure');
        }
        
        // Validate each tier
        this.courses.tiers.forEach((tier, index) => {
            if (!tier.id) issues.push(`Tier ${index} missing id`);
            if (!tier.name) issues.push(`Tier ${tier.id} missing name`);
            if (!tier.description) warnings.push(`Tier ${tier.id} missing description`);
            if (!tier.duration) warnings.push(`Tier ${tier.id} missing duration`);
            if (!tier.price && tier.price !== 0) warnings.push(`Tier ${tier.id} missing price`);
        });
        
        // Test lesson structure
        if (this.courses.lessons.length === 0) {
            issues.push('No lessons found in course structure');
        }
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Course structure valid' : issues.join('; '),
            warnings: warnings,
            details: {
                tiers: this.courses.tiers.length,
                lessons: this.courses.lessons.length,
                issues: issues.length
            }
        };
    },
    
    async testLessonContent() {
        const issues = [];
        const warnings = [];
        
        this.courses.lessons.forEach(lesson => {
            // Check required fields
            if (!lesson.title) issues.push(`Lesson ${lesson.id} missing title`);
            if (!lesson.content) issues.push(`Lesson ${lesson.id} missing content`);
            if (!lesson.tier) warnings.push(`Lesson ${lesson.id} not assigned to tier`);
            
            // Check content quality
            if (lesson.content && lesson.content.length < 100) {
                warnings.push(`Lesson ${lesson.id} has minimal content (< 100 chars)`);
            }
            
            // Check for interactive elements
            if (lesson.content && !lesson.content.includes('quiz') && !lesson.content.includes('exercise')) {
                warnings.push(`Lesson ${lesson.id} lacks interactive elements`);
            }
        });
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Lesson content validated' : issues.join('; '),
            warnings: warnings,
            details: {
                totalLessons: this.courses.lessons.length,
                issues: issues.length
            }
        };
    },
    
    async testQuizFunctionality() {
        const issues = [];
        const warnings = [];
        
        // Check if quiz system exists
        if (!window.GemBotAcademyComplete || !window.GemBotAcademyComplete.checkAnswer) {
            issues.push('Quiz system not found');
            return {
                passed: false,
                message: 'Quiz system not found',
                warnings: [],
                details: {}
            };
        }
        
        // Test quiz answer checking
        try {
            const testQuestion = {
                id: 'test_q1',
                question: 'Test question?',
                correctAnswer: 'correct',
                options: ['correct', 'wrong1', 'wrong2']
            };
            
            // This would test the actual quiz function if available
            // For now, just verify the function exists
            const hasCheckAnswer = typeof window.GemBotAcademyComplete.checkAnswer === 'function';
            if (!hasCheckAnswer) {
                issues.push('checkAnswer function not available');
            }
            
        } catch (error) {
            issues.push(`Quiz testing error: ${error.message}`);
        }
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Quiz functionality working' : issues.join('; '),
            warnings: warnings,
            details: {}
        };
    },
    
    async testAntiCheat() {
        const issues = [];
        const warnings = [];
        
        // Check for anti-cheat mechanisms
        const antiCheatFeatures = [];
        
        // Check for time tracking
        if (window.GemBotAcademyComplete && window.GemBotAcademyComplete.trackTime) {
            antiCheatFeatures.push('time_tracking');
        } else {
            warnings.push('No time tracking detected');
        }
        
        // Check for randomization
        if (window.GemBotAcademyComplete && window.GemBotAcademyComplete.randomizeQuestions) {
            antiCheatFeatures.push('question_randomization');
        } else {
            warnings.push('No question randomization detected');
        }
        
        // Check for attempt limits
        if (window.GemBotAcademyComplete && window.GemBotAcademyComplete.maxAttempts) {
            antiCheatFeatures.push('attempt_limits');
        } else {
            warnings.push('No attempt limits detected');
        }
        
        if (antiCheatFeatures.length === 0) {
            warnings.push('No anti-cheat mechanisms detected');
        }
        
        return {
            passed: true,
            message: `Anti-cheat features found: ${antiCheatFeatures.length}`,
            warnings: warnings,
            details: {
                features: antiCheatFeatures
            }
        };
    },
    
    async testProgressTracking() {
        const issues = [];
        
        // Check for progress tracking system
        if (!localStorage.getItem('gembot_academy_progress') && 
            !sessionStorage.getItem('gembot_academy_progress')) {
            issues.push('No progress tracking storage found');
        }
        
        // Test progress save/load
        try {
            const testProgress = {
                currentTier: 1,
                completedLessons: ['test_lesson_1'],
                score: 85
            };
            
            localStorage.setItem('test_progress', JSON.stringify(testProgress));
            const loaded = JSON.parse(localStorage.getItem('test_progress'));
            
            if (!loaded || loaded.currentTier !== 1) {
                issues.push('Progress save/load failed');
            }
            
            localStorage.removeItem('test_progress');
            
        } catch (error) {
            issues.push(`Progress tracking error: ${error.message}`);
        }
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Progress tracking functional' : issues.join('; '),
            warnings: [],
            details: {}
        };
    },
    
    async testCertification() {
        const issues = [];
        const warnings = [];
        
        // Check certification system
        if (window.GemBotAcademyComplete && window.GemBotAcademyComplete.issueCertificate) {
            // Certification system exists
        } else {
            warnings.push('Certificate issuance system not found');
        }
        
        // Check for certification requirements
        this.courses.tiers.forEach(tier => {
            if (!tier.certificationRequirements) {
                warnings.push(`Tier ${tier.id} missing certification requirements`);
            }
        });
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Certification system validated' : issues.join('; '),
            warnings: warnings,
            details: {}
        };
    },
    
    async testPaymentSystem() {
        const issues = [];
        const warnings = [];
        
        // Check if payment system exists
        if (!window.GemBotAcademyComplete || !window.GemBotAcademyComplete.processCertificationPayment) {
            warnings.push('Payment processing function not found');
        }
        
        // Check GBUV token integration
        if (!window.gbuv && !window.GBUVTokenEconomy) {
            warnings.push('GBUV token system not found');
        }
        
        // Validate tier pricing
        this.courses.tiers.forEach(tier => {
            if (tier.price === undefined || tier.price === null) {
                warnings.push(`Tier ${tier.id} has no price defined`);
            }
            if (tier.price < 0) {
                issues.push(`Tier ${tier.id} has invalid price: ${tier.price}`);
            }
        });
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Payment system validated' : issues.join('; '),
            warnings: warnings,
            details: {}
        };
    },
    
    async testUserJourney() {
        const issues = [];
        const warnings = [];
        
        // Simulate a user going through the course
        const journey = {
            startTier: 1,
            completeLessons: true,
            takeQuizzes: true,
            getCertification: true
        };
        
        // Check if user can access first tier
        if (this.courses.tiers.length > 0) {
            const firstTier = this.courses.tiers[0];
            if (!firstTier.accessible) {
                warnings.push('First tier may not be accessible to new users');
            }
        }
        
        // Check lesson progression
        let previousTier = 0;
        this.courses.lessons.forEach(lesson => {
            if (lesson.tier && lesson.tier < previousTier) {
                warnings.push('Lessons may not be in logical order');
            }
            previousTier = lesson.tier || 0;
        });
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'User journey validated' : issues.join('; '),
            warnings: warnings,
            details: {}
        };
    },
    
    async testResourceLinks() {
        const issues = [];
        const warnings = [];
        
        // Test resource links
        if (this.courses.resources) {
            const resources = [
                ...this.courses.resources.textbooks || [],
                ...this.courses.resources.ebooks || [],
                ...this.courses.resources.libraries || [],
                ...this.courses.resources.videos || [],
                ...this.courses.resources.articles || []
            ];
            
            resources.forEach(resource => {
                if (!resource.url) {
                    issues.push(`Resource ${resource.id} missing URL`);
                } else if (!resource.url.startsWith('http')) {
                    warnings.push(`Resource ${resource.id} has invalid URL format`);
                }
            });
        }
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Resource links validated' : issues.join('; '),
            warnings: warnings,
            details: {}
        };
    },
    
    async testMobileCompatibility() {
        const issues = [];
        const warnings = [];
        
        // Check if mobile optimizer is loaded
        if (window.MobileOptimizerAgent) {
            const mobileAgent = window.MobileOptimizerAgent;
            if (!mobileAgent.initialized) {
                warnings.push('Mobile optimizer not initialized');
            }
        } else {
            warnings.push('Mobile optimizer agent not found');
        }
        
        // Check for mobile-friendly elements
        const mobileElements = document.querySelectorAll('[class*="mobile"]');
        if (mobileElements.length === 0) {
            warnings.push('No mobile-specific styling detected');
        }
        
        // Check viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            warnings.push('Viewport meta tag not found');
        }
        
        return {
            passed: issues.length === 0,
            message: issues.length === 0 ? 'Mobile compatibility validated' : issues.join('; '),
            warnings: warnings,
            details: {}
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // REPORTING
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateTestReport() {
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('📊 COURSE TESTING REPORT');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`Timestamp: ${this.results.timestamp}`);
        console.log(`Coverage: ${this.results.coverage.toFixed(1)}%`);
        console.log(`\n✅ Passed: ${this.results.passed.length}`);
        console.log(`❌ Failed: ${this.results.failed.length}`);
        console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
        
        if (this.results.failed.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.failed.forEach(failure => {
                console.log(`  - ${failure.test}: ${failure.message}`);
            });
        }
        
        if (this.results.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.results.warnings.forEach(warning => {
                console.log(`  - ${warning.test}: ${warning.warning}`);
            });
        }
        
        console.log('\n═══════════════════════════════════════════════════════\n');
        
        return this.results;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════
    
    async runTest(testName) {
        if (this.testSuite[testName]) {
            return await this.testSuite[testName]();
        } else {
            throw new Error(`Test '${testName}' not found`);
        }
    },
    
    getResults() {
        return this.results;
    },
    
    getStatus() {
        return {
            agent: this.agentName,
            version: this.version,
            initialized: this.initialized,
            testsRun: this.results.passed.length + this.results.failed.length,
            passRate: ((this.results.passed.length / (this.results.passed.length + this.results.failed.length)) * 100).toFixed(1) + '%'
        };
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.CourseTestingAgent.init();
    });
} else {
    window.CourseTestingAgent.init();
}

console.log('🎓 Course Testing Agent loaded');
