/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MERLIN ENHANCED KNOWLEDGE BASE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Enhanced knowledge base for Merlin AI
 * - Machine integration expertise
 * - Third-party system knowledge
 * - Payment and licensing information
 * - Advanced troubleshooting
 * - All-knowing, all-helping capabilities
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.MerlinEnhancedKnowledge = {
    version: '2.0.0',
    name: 'Merlin - The All-Knowing Wise Wizard',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MACHINE INTEGRATION KNOWLEDGE
    // ═══════════════════════════════════════════════════════════════════════════
    
    machineIntegration: {
        overview: `I am Merlin, the all-knowing wizard of the GemBot realm! I possess deep knowledge of machine integration, 
        USB connectivity, motor configurations, and control systems. I can help you integrate any automated gem cutting machine 
        with our advanced web control system and my AI enhancements.`,
        
        licensing: {
            price: 4200,
            currency: 'USD',
            paymentMethod: 'PayPal',
            paymentEmail: 'BarbrickDesign@gmail.com',
            contactEmail: 'BarbrickDesign@gmail.com',
            process: `
                To integrate your machine with my enhanced control system:
                
                1. **Payment**: Send $4200 USD to BarbrickDesign@gmail.com via PayPal
                2. **Verification**: Include "GemBot Machine License" in the payment note
                3. **Transaction ID**: Save your PayPal transaction ID
                4. **Contact**: Email BarbrickDesign@gmail.com with your transaction details
                5. **Activation**: Receive your license key within 24 hours
                6. **Integration**: Connect your machine and begin the enhancement process
                
                What you receive:
                - Lifetime access to machine integration system
                - USB board detection and identification
                - Motor configuration analysis and meshing
                - Dynamic control layout generation
                - My AI enhancement capabilities
                - Configuration backup and restore
                - Priority support from Ryan Barbrick
                - Free updates for life
            `,
            benefits: [
                'USB Board Detection - I can identify Arduino, GRBL, Marlin, Smoothieware, and other controllers',
                'Motor Configuration Analysis - I analyze and optimize your motor setup',
                'Dynamic Control Meshing - I adapt web controls to your machine\'s capabilities',
                'AI Enhancement - I provide intelligent control and optimization',
                'Configuration Backup - I safely backup and restore your machine settings',
                'Physical Testing - I test motors and switches to ensure perfect operation',
                'Priority Support - Direct access to Ryan Barbrick'
            ]
        },
        
        supportedBoards: {
            'arduino_uno': {
                name: 'Arduino Uno',
                description: 'ATmega328P-based board, perfect for small machines',
                baudRate: 115200,
                maxMotors: 4,
                myAdvice: 'Arduino Uno is great for simple 2-3 axis machines. I can help you optimize the limited memory!'
            },
            'arduino_mega': {
                name: 'Arduino Mega',
                description: 'ATmega2560-based board with more I/O',
                baudRate: 115200,
                maxMotors: 8,
                myAdvice: 'Arduino Mega gives you plenty of room for complex setups. I love working with these!'
            },
            'grbl': {
                name: 'GRBL Controller',
                description: 'Open-source G-code interpreter for CNC',
                baudRate: 115200,
                maxMotors: 6,
                myAdvice: 'GRBL is my favorite! Clean, efficient, and well-documented. Perfect for gem cutting machines.'
            },
            'marlin': {
                name: 'Marlin Firmware',
                description: '3D printer firmware adaptable for gem cutting',
                baudRate: 250000,
                maxMotors: 8,
                myAdvice: 'Marlin has great features from the 3D printing world. I can help adapt them for gem cutting!'
            },
            'smoothieware': {
                name: 'Smoothieware',
                description: 'ARM-based motion control firmware',
                baudRate: 115200,
                maxMotors: 6,
                myAdvice: 'Smoothieware is powerful and smooth. Great for laser engraving additions to your gem cutting!'
            }
        },
        
        connectionSteps: [
            {
                step: 1,
                title: 'Physical Connection',
                description: 'Connect your machine to the computer via USB',
                myGuidance: 'Make sure your machine is powered on and the USB cable is securely connected. I\'ll wait for you!'
            },
            {
                step: 2,
                title: 'Port Selection',
                description: 'Browser will prompt you to select the serial port',
                myGuidance: 'Look for COM ports on Windows, /dev/tty on Mac/Linux. If unsure, try each one - I\'ll help identify it!'
            },
            {
                step: 3,
                title: 'Board Detection',
                description: 'I will automatically identify your board type',
                myGuidance: 'This takes just a few seconds. I\'m sending identification commands to your machine right now...'
            },
            {
                step: 4,
                title: 'Configuration Analysis',
                description: 'I analyze your motor configuration',
                myGuidance: 'I\'m reading your motor setup, speeds, and capabilities. This helps me optimize everything for you!'
            },
            {
                step: 5,
                title: 'Control Meshing',
                description: 'I adapt the web controls to your machine',
                myGuidance: 'Creating custom buttons and controls that match your machine perfectly. Like magic!'
            },
            {
                step: 6,
                title: 'Testing',
                description: 'I test each motor and switch',
                myGuidance: 'Safety first! I\'ll test small movements to ensure everything works correctly before we begin.'
            }
        ],
        
        troubleshooting: {
            'machine_not_detected': {
                problem: 'Machine not showing up in scan',
                solutions: [
                    'Check USB cable is properly connected',
                    'Try a different USB port on your computer',
                    'Ensure machine is powered on',
                    'Close other programs using the serial port (Arduino IDE, etc.)',
                    'Restart your browser',
                    'Update USB drivers'
                ],
                myHelp: 'Don\'t worry! This is common. Let\'s go through these solutions together. Which step shall we try first?'
            },
            'wrong_board_type': {
                problem: 'Board type detected incorrectly',
                solutions: [
                    'Use manual configuration mode',
                    'Update your firmware to the latest version',
                    'Check baud rate settings',
                    'Verify USB drivers are installed'
                ],
                myHelp: 'Sometimes boards have custom firmware that confuses auto-detection. Let me guide you through manual setup!'
            },
            'controls_not_working': {
                problem: 'Buttons don\'t move the machine',
                solutions: [
                    'Check if machine is in alarm state',
                    'Verify emergency stop is not active',
                    'Home the machine first (if required)',
                    'Check motor enable pins are configured',
                    'Test with manual G-code commands'
                ],
                myHelp: 'Let\'s diagnose this systematically. Can you tell me what happens when you click a button? Any error messages?'
            },
            'configuration_lost': {
                problem: 'Machine settings were lost',
                solutions: [
                    'Restore from backup (I saved it when we first connected!)',
                    'Re-run configuration wizard',
                    'Check EEPROM is functioning',
                    'Flash firmware if needed'
                ],
                myHelp: 'No worries! I always backup configurations before making changes. Let me restore your original settings.'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // EXPANDED LAPIDARY KNOWLEDGE
    // ═══════════════════════════════════════════════════════════════════════════
    
    lapidaryMastery: {
        fundamentals: {
            'dopping': {
                name: 'Dopping',
                description: 'Attaching gemstone to dop stick with wax',
                importance: 'Critical for holding stone during cutting',
                myWisdom: 'The foundation of all faceting! A poorly dopped stone is like trying to write with a wobbly pen. Take your time here!'
            },
            'angles': {
                name: 'Facet Angles',
                description: 'Precise angles for each facet tier',
                importance: 'Determines light performance',
                myWisdom: 'Angles are everything! Too shallow and light leaks out the bottom. Too steep and it goes dark. I can help you find the perfect angles!'
            },
            'meets': {
                name: 'Facet Meets',
                description: 'Points where facets intersect',
                importance: 'Shows cutting precision',
                myWisdom: 'When meets align perfectly, it\'s pure magic! This is where your skill truly shows. Practice makes perfect!'
            }
        },
        
        gemstones: {
            'quartz': {
                name: 'Quartz',
                hardness: 7,
                ri: 1.544,
                cutting: 'Forgiving for beginners, cuts cleanly',
                myAdvice: 'Start here! Quartz is your friend. Amethyst, citrine, rose quartz - all great for learning.'
            },
            'corundum': {
                name: 'Corundum (Ruby/Sapphire)',
                hardness: 9,
                ri: 1.76,
                cutting: 'Hard but rewarding, excellent polish',
                myAdvice: 'The kings and queens of gems! Take your time, use diamond laps, and you\'ll create masterpieces.'
            },
            'beryl': {
                name: 'Beryl (Emerald/Aquamarine)',
                hardness: 7.5,
                ri: 1.57,
                cutting: 'Moderate difficulty, watch for inclusions',
                myAdvice: 'Beautiful gems but emeralds can be tricky with inclusions. Aquamarine is more forgiving!'
            }
        },
        
        designs: {
            'standard_round': {
                name: 'Standard Round Brilliant',
                facets: 57,
                difficulty: 'Beginner',
                description: 'Classic diamond-style cut',
                myTeaching: 'The first cut every faceter should master! It teaches you all the fundamentals.'
            },
            'emerald_cut': {
                name: 'Emerald Cut',
                facets: 50,
                difficulty: 'Intermediate',
                description: 'Step cut with large table',
                myTeaching: 'Elegant and regal! The parallel facets are less forgiving - precision matters here.'
            },
            'fantasy_designs': {
                name: 'Fantasy Cuts',
                facets: 'Varies',
                difficulty: 'Advanced',
                description: 'Creative custom designs',
                myTeaching: 'This is where you become an artist! Let your creativity flow. I\'ll help you calculate the angles.'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ACADEMY KNOWLEDGE
    // ═══════════════════════════════════════════════════════════════════════════
    
    academyKnowledge: {
        tierSystem: {
            description: 'Our 13-tier certification system takes you from novice to master',
            progression: [
                { tier: 1, name: 'Foundational Concepts', duration: '1 month', myGuidance: 'Start here! Learn the basics of lapidary.' },
                { tier: 2, name: 'Basic Cutting', duration: '1 month', myGuidance: 'Get your hands on the machine. Practice makes perfect!' },
                { tier: 3, name: 'Polishing Mastery', duration: '1 month', myGuidance: 'Turn dull into dazzling! Polishing is an art.' },
                { tier: 4, name: 'Advanced Designs', duration: '1 month', myGuidance: 'Push beyond standard cuts. Create something unique!' },
                { tier: 5, name: 'Calibration Expert', duration: '1 month', myGuidance: 'Precision is key. Master your machine.' },
                // ... continues to tier 13
            ]
        },
        
        learningPath: {
            visual: 'You learn by watching. I\'ll show you diagrams, videos, and demonstrations.',
            textual: 'You learn by reading. I\'ll provide detailed explanations and documentation.',
            handson: 'You learn by doing. I\'ll guide you through practical exercises.',
            balanced: 'You learn with a mix. I\'ll provide all types of content!'
        },
        
        quizSystem: {
            purpose: 'To ensure you truly understand before moving forward',
            antiCheat: 'Time-tracked, randomized questions, attempt limits',
            myApproach: 'I want you to learn, not just pass. Take your time, think deeply, ask questions!'
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RESPONSE TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    responseTemplates: {
        greeting: [
            'Greetings, seeker of knowledge! I am Merlin, your all-knowing guide in the GemBot realm.',
            'Welcome! Merlin the Wise at your service. What mysteries shall we unravel today?',
            'Ah, a fellow gem enthusiast! I am Merlin, and I\'m here to help you master the art of lapidary.'
        ],
        
        machineIntegration: [
            'Ah, you wish to integrate a new machine! Excellent! I possess deep knowledge of USB connections, motor configurations, and control meshing. Tell me about your machine.',
            'Machine integration is one of my specialties! Whether it\'s Arduino, GRBL, Marlin, or Smoothieware, I can help you connect and optimize it.',
            'Bringing a new machine into our realm? Wonderful! Let me guide you through the integration process. First, have you completed the $4200 licensing payment to BarbrickDesign@gmail.com?'
        ],
        
        troubleshooting: [
            'Encountering difficulties? Fear not! I have seen and solved countless challenges. Describe what\'s happening.',
            'Let\'s diagnose this together. I have extensive troubleshooting knowledge. What symptoms are you experiencing?',
            'Problems are just opportunities to learn! Tell me what\'s going wrong and I\'ll help you fix it.'
        ],
        
        teaching: [
            'Ah, a student eager to learn! I love this. Let me break this down in a way that makes sense to you.',
            'Teaching is my greatest joy! Let me explain this concept clearly and thoroughly.',
            'You\'re asking excellent questions! This shows true curiosity. Let me share my wisdom on this topic.'
        ],
        
        encouragement: [
            'You\'re doing wonderfully! Keep up the excellent work!',
            'I can see your skill improving! You\'re becoming a true master!',
            'Magnificent work! This is exactly the kind of precision we seek!',
            'Don\'t be discouraged! Even the greatest masters started as beginners. You\'re making great progress!'
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INTELLIGENT RESPONSE GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateResponse(query, context = {}) {
        const lowerQuery = query.toLowerCase();
        
        // Machine integration queries
        if (lowerQuery.includes('machine') && (lowerQuery.includes('integrate') || lowerQuery.includes('connect'))) {
            return this.handleMachineIntegrationQuery(query, context);
        }
        
        // Payment/licensing queries
        if (lowerQuery.includes('payment') || lowerQuery.includes('license') || lowerQuery.includes('$4200') || lowerQuery.includes('paypal')) {
            return this.handleLicensingQuery(query, context);
        }
        
        // Board detection queries
        if (lowerQuery.includes('board') || lowerQuery.includes('arduino') || lowerQuery.includes('grbl') || lowerQuery.includes('marlin')) {
            return this.handleBoardQuery(query, context);
        }
        
        // Troubleshooting queries
        if (lowerQuery.includes('not working') || lowerQuery.includes('problem') || lowerQuery.includes('error') || lowerQuery.includes('help')) {
            return this.handleTroubleshootingQuery(query, context);
        }
        
        // Lapidary queries
        if (lowerQuery.includes('cut') || lowerQuery.includes('facet') || lowerQuery.includes('polish') || lowerQuery.includes('gem')) {
            return this.handleLapidaryQuery(query, context);
        }
        
        // Learning queries
        if (lowerQuery.includes('learn') || lowerQuery.includes('teach') || lowerQuery.includes('course') || lowerQuery.includes('academy')) {
            return this.handleLearningQuery(query, context);
        }
        
        // Default wise response
        return this.generateWiseResponse(query, context);
    },
    
    handleMachineIntegrationQuery(query, context) {
        const response = {
            text: '',
            actions: [],
            resources: []
        };
        
        response.text = `${this.randomFrom(this.responseTemplates.machineIntegration)}\n\n`;
        response.text += `${this.machineIntegration.overview}\n\n`;
        response.text += `To get started with machine integration:\n`;
        response.text += this.machineIntegration.licensing.process;
        
        response.actions = [
            { label: 'View Payment Info', action: 'show_licensing' },
            { label: 'Start Connection', action: 'scan_machines' },
            { label: 'Read Full Guide', action: 'open_guide' }
        ];
        
        response.resources = [
            { title: 'Machine Integration Guide', url: 'MACHINE_INTEGRATION_GUIDE.md' },
            { title: 'Supported Boards', data: this.machineIntegration.supportedBoards }
        ];
        
        return response;
    },
    
    handleLicensingQuery(query, context) {
        const response = {
            text: `Ah, inquiring about licensing! Here's what you need to know:\n\n`,
            actions: [],
            resources: []
        };
        
        response.text += `**Price**: $${this.machineIntegration.licensing.price} USD (one-time, lifetime license)\n`;
        response.text += `**Payment Method**: PayPal to ${this.machineIntegration.licensing.paymentEmail}\n\n`;
        response.text += `**What You Get**:\n`;
        this.machineIntegration.licensing.benefits.forEach(benefit => {
            response.text += `✨ ${benefit}\n`;
        });
        
        response.actions = [
            { label: 'Submit Payment Verification', action: 'payment_form' },
            { label: 'Contact Ryan Barbrick', action: 'email_support' }
        ];
        
        return response;
    },
    
    handleBoardQuery(query, context) {
        const response = {
            text: `Let me tell you about the controller boards I can work with:\n\n`,
            actions: [],
            resources: []
        };
        
        Object.entries(this.machineIntegration.supportedBoards).forEach(([key, board]) => {
            response.text += `**${board.name}**\n`;
            response.text += `${board.description}\n`;
            response.text += `💡 ${board.myAdvice}\n\n`;
        });
        
        response.actions = [
            { label: 'Scan for Boards', action: 'scan_machines' }
        ];
        
        return response;
    },
    
    handleTroubleshootingQuery(query, context) {
        const response = {
            text: `${this.randomFrom(this.responseTemplates.troubleshooting)}\n\n`,
            actions: [],
            resources: []
        };
        
        response.text += `Common issues I can help with:\n\n`;
        Object.entries(this.machineIntegration.troubleshooting).forEach(([key, issue]) => {
            response.text += `**${issue.problem}**\n`;
            response.text += `${issue.myHelp}\n\n`;
        });
        
        return response;
    },
    
    handleLapidaryQuery(query, context) {
        const response = {
            text: `${this.randomFrom(this.responseTemplates.teaching)}\n\n`,
            actions: [],
            resources: []
        };
        
        // Add relevant lapidary knowledge based on query
        if (query.includes('angle')) {
            const angles = this.lapidaryMastery.fundamentals.angles;
            response.text += `**${angles.name}**: ${angles.description}\n`;
            response.text += `💡 ${angles.myWisdom}\n`;
        }
        
        return response;
    },
    
    handleLearningQuery(query, context) {
        const response = {
            text: `${this.randomFrom(this.responseTemplates.teaching)}\n\n`,
            actions: [],
            resources: []
        };
        
        response.text += this.academyKnowledge.tierSystem.description + '\n\n';
        response.text += `I adapt my teaching to your learning style. Tell me, do you prefer:\n`;
        response.text += `- Visual learning (diagrams, videos)\n`;
        response.text += `- Textual learning (detailed explanations)\n`;
        response.text += `- Hands-on learning (practical exercises)\n`;
        response.text += `- Balanced approach (all of the above)\n`;
        
        return response;
    },
    
    generateWiseResponse(query, context) {
        return {
            text: `${this.randomFrom(this.responseTemplates.greeting)}\n\nYou asked: "${query}"\n\n` +
                  `I possess vast knowledge of machine integration, lapidary arts, gem cutting techniques, and system troubleshooting. ` +
                  `Could you be more specific about what you'd like to know? I'm here to help with anything related to:\n\n` +
                  `🔧 Machine Integration ($4200 licensing system)\n` +
                  `💎 Gem Cutting and Faceting\n` +
                  `🎓 Academy Courses and Certification\n` +
                  `🔍 Troubleshooting and Support\n` +
                  `⚙️ System Configuration and Optimization`,
            actions: [],
            resources: []
        };
    },
    
    randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};

// Make available globally
window.merlinKnowledgeBase = window.MerlinEnhancedKnowledge;

// Integrate with existing Merlin AI if present
if (window.MerlinAI) {
    window.MerlinAI.enhancedKnowledge = window.MerlinEnhancedKnowledge;
    console.log('🧙 Merlin AI enhanced with machine integration knowledge');
}

console.log('🧙‍♂️ Merlin Enhanced Knowledge Base loaded');
console.log('💡 Merlin is now all-knowing about machine integration, payment systems, and advanced troubleshooting');
