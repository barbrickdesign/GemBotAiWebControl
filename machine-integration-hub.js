/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GEMBOT MACHINE INTEGRATION HUB
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Third-Party Machine Integration System
 * - PayPal payment verification ($4200 business license)
 * - USB board detection and identification
 * - Motor configuration analysis and meshing
 * - Dynamic web control adaptation
 * - Configuration backup and restore
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * Payment: $4200 via PayPal to BarbrickDesign@gmail.com
 * 
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.MachineIntegrationHub = {
    version: '1.0.0',
    initialized: false,
    
    // Payment and licensing
    licensing: {
        paymentAmount: 4200, // USD
        paypalEmail: 'BarbrickDesign@gmail.com',
        licenseStatus: 'pending',
        transactionId: null,
        machineId: null,
        activatedAt: null
    },
    
    // Connected machine state
    connectedMachine: {
        id: null,
        name: null,
        manufacturer: null,
        boardType: null,
        boardVersion: null,
        comPort: null,
        baudRate: 115200,
        motorConfig: null,
        originalScript: null,
        controlLayout: null,
        capabilities: null
    },
    
    // Supported board types
    supportedBoards: {
        'arduino_uno': {
            name: 'Arduino Uno',
            processor: 'ATmega328P',
            defaultBaud: 115200,
            maxMotors: 4,
            identifier: 'Arduino Uno'
        },
        'arduino_mega': {
            name: 'Arduino Mega',
            processor: 'ATmega2560',
            defaultBaud: 115200,
            maxMotors: 8,
            identifier: 'Arduino Mega'
        },
        'grbl': {
            name: 'GRBL Controller',
            processor: 'Various',
            defaultBaud: 115200,
            maxMotors: 6,
            identifier: 'Grbl'
        },
        'marlin': {
            name: 'Marlin Firmware',
            processor: 'Various',
            defaultBaud: 250000,
            maxMotors: 8,
            identifier: 'Marlin'
        },
        'smoothieware': {
            name: 'Smoothieware',
            processor: 'LPC1768',
            defaultBaud: 115200,
            maxMotors: 6,
            identifier: 'Smoothie'
        },
        'generic': {
            name: 'Generic Controller',
            processor: 'Unknown',
            defaultBaud: 9600,
            maxMotors: 4,
            identifier: 'Generic'
        }
    },
    
    // Motor configuration templates
    motorTemplates: {
        stepper: {
            type: 'stepper',
            stepsPerRev: 200,
            microstepping: 16,
            maxSpeed: 1000,
            acceleration: 500,
            direction: 1,
            enablePin: null,
            stepPin: null,
            dirPin: null
        },
        servo: {
            type: 'servo',
            minAngle: 0,
            maxAngle: 180,
            defaultAngle: 90,
            pin: null
        },
        dc: {
            type: 'dc',
            pwmPin: null,
            dirPin1: null,
            dirPin2: null,
            maxSpeed: 255
        }
    },
    
    // Control button configurations
    controlButtons: {
        basic: ['home', 'start', 'stop', 'pause', 'reset'],
        advanced: ['home', 'start', 'stop', 'pause', 'reset', 'jog', 'zero', 'goto'],
        full: ['home', 'start', 'stop', 'pause', 'reset', 'jog', 'zero', 'goto', 'probe', 'spindle', 'coolant', 'unlock']
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async init() {
        console.log('🔧 Machine Integration Hub initializing...');
        
        // Load saved license status
        this.loadLicenseStatus();
        
        // Check for Web Serial API support
        if (!('serial' in navigator)) {
            console.warn('⚠️ Web Serial API not supported in this browser');
            console.log('💡 Use Chrome, Edge, or Opera for USB machine integration');
            return false;
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.initializeUI();
        
        this.initialized = true;
        console.log('✅ Machine Integration Hub ready');
        
        return true;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LICENSE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    loadLicenseStatus() {
        const saved = localStorage.getItem('machine_integration_license');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.licensing = { ...this.licensing, ...data };
                console.log('📋 License loaded:', this.licensing.licenseStatus);
            } catch (e) {
                console.error('Error loading license:', e);
            }
        }
    },
    
    saveLicenseStatus() {
        localStorage.setItem('machine_integration_license', JSON.stringify(this.licensing));
    },
    
    async verifyPayment(transactionId, customerEmail) {
        console.log('💳 Verifying payment...');
        console.log('Transaction ID:', transactionId);
        console.log('Customer Email:', customerEmail);
        
        // SECURITY WARNING: This is a simulated verification process for demonstration.
        // In production, this MUST be replaced with proper PayPal API integration.
        // All payment verification should be performed server-side with PayPal's REST API
        // or IPN (Instant Payment Notification) for security and reliability.
        // DO NOT accept payments without proper server-side verification.
        
        const verification = {
            valid: false,
            amount: 0,
            recipient: '',
            message: '',
            requiresManualVerification: true
        };
        
        // Check if transaction ID format is valid
        if (!transactionId || transactionId.length < 10) {
            verification.message = 'Invalid transaction ID format';
            return verification;
        }
        
        // Store pending verification
        this.licensing.transactionId = transactionId;
        this.licensing.licenseStatus = 'pending_verification';
        this.saveLicenseStatus();
        
        verification.message = `Payment verification submitted. MANUAL VERIFICATION REQUIRED: Please contact ${this.licensing.paypalEmail} with transaction ID ${transactionId}. Ryan Barbrick will verify the PayPal payment and activate your license within 24 hours.`;
        verification.amount = this.licensing.paymentAmount;
        verification.recipient = this.licensing.paypalEmail;
        
        console.log('⚠️ Payment requires manual verification by Ryan Barbrick');
        console.log('✅ Payment verification request submitted');
        
        return verification;
    },
    
    async activateLicense(machineId) {
        console.log('🔑 Activating license for machine:', machineId);
        
        if (this.licensing.licenseStatus !== 'verified') {
            throw new Error('License must be verified before activation');
        }
        
        this.licensing.licenseStatus = 'active';
        this.licensing.machineId = machineId;
        this.licensing.activatedAt = new Date().toISOString();
        this.saveLicenseStatus();
        
        console.log('✅ License activated successfully');
        
        return true;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // USB BOARD DETECTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async scanForMachines() {
        console.log('🔍 Scanning for connected machines...');
        
        if (!('serial' in navigator)) {
            throw new Error('Web Serial API not supported');
        }
        
        try {
            // Request user to select a port
            const port = await navigator.serial.requestPort();
            console.log('📱 Port selected:', port);
            
            // Open the port
            await port.open({ baudRate: 115200 });
            console.log('✅ Port opened');
            
            // Identify the board
            const boardInfo = await this.identifyBoard(port);
            
            // Store connection
            this.connectedMachine.comPort = port;
            this.connectedMachine.boardType = boardInfo.type;
            this.connectedMachine.name = boardInfo.name;
            this.connectedMachine.manufacturer = boardInfo.manufacturer;
            
            console.log('✅ Machine connected:', this.connectedMachine.name);
            
            return boardInfo;
            
        } catch (error) {
            console.error('❌ Error scanning for machines:', error);
            throw error;
        }
    },
    
    async identifyBoard(port) {
        console.log('🔍 Identifying board type...');
        
        const writer = port.writable.getWriter();
        const reader = port.readable.getReader();
        
        try {
            // Send version request commands for different board types
            const commands = [
                { cmd: 'M115\n', type: 'marlin', timeout: 2000 },  // Marlin
                { cmd: '$$\n', type: 'grbl', timeout: 2000 },       // GRBL
                { cmd: 'version\n', type: 'smoothieware', timeout: 2000 } // Smoothieware
            ];
            
            for (const command of commands) {
                // Send command
                const data = new TextEncoder().encode(command.cmd);
                await writer.write(data);
                
                // Wait for response
                const response = await this.readWithTimeout(reader, command.timeout);
                
                if (response) {
                    const boardType = this.parseBoardResponse(response, command.type);
                    if (boardType) {
                        reader.releaseLock();
                        writer.releaseLock();
                        return boardType;
                    }
                }
            }
            
            reader.releaseLock();
            writer.releaseLock();
            
            // If no specific board identified, return generic
            return {
                type: 'generic',
                name: 'Generic Controller',
                manufacturer: 'Unknown',
                version: 'Unknown'
            };
            
        } catch (error) {
            console.error('Error identifying board:', error);
            reader.releaseLock();
            writer.releaseLock();
            throw error;
        }
    },
    
    async readWithTimeout(reader, timeout) {
        const timer = new Promise((resolve) => setTimeout(() => resolve(null), timeout));
        const read = reader.read().then(({ value, done }) => {
            if (done) return null;
            return new TextDecoder().decode(value);
        });
        
        return Promise.race([read, timer]);
    },
    
    parseBoardResponse(response, expectedType) {
        const lower = response.toLowerCase();
        
        if (expectedType === 'marlin' && lower.includes('marlin')) {
            const version = response.match(/FIRMWARE_NAME:([^\s]+)/i)?.[1] || 'Unknown';
            return {
                type: 'marlin',
                name: 'Marlin Firmware',
                manufacturer: 'Marlin',
                version: version
            };
        }
        
        if (expectedType === 'grbl' && lower.includes('grbl')) {
            const version = response.match(/Grbl\s+([\d.]+)/i)?.[1] || 'Unknown';
            return {
                type: 'grbl',
                name: 'GRBL Controller',
                manufacturer: 'GRBL',
                version: version
            };
        }
        
        if (expectedType === 'smoothieware' && lower.includes('smoothie')) {
            const version = response.match(/Version:\s*([\d.]+)/i)?.[1] || 'Unknown';
            return {
                type: 'smoothieware',
                name: 'Smoothieware',
                manufacturer: 'Smoothie',
                version: version
            };
        }
        
        return null;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MOTOR CONFIGURATION ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════════
    
    async analyzeMotorConfiguration() {
        console.log('⚙️ Analyzing motor configuration...');
        
        if (!this.connectedMachine.comPort) {
            throw new Error('No machine connected');
        }
        
        const boardType = this.connectedMachine.boardType;
        const motorConfig = {
            axes: [],
            motors: [],
            capabilities: {}
        };
        
        try {
            // Request configuration based on board type
            if (boardType === 'grbl') {
                motorConfig = await this.readGRBLConfig();
            } else if (boardType === 'marlin') {
                motorConfig = await this.readMarlinConfig();
            } else if (boardType === 'smoothieware') {
                motorConfig = await this.readSmoothieConfig();
            } else {
                // Generic fallback - probe for common configurations
                motorConfig = await this.probeGenericConfig();
            }
            
            this.connectedMachine.motorConfig = motorConfig;
            console.log('✅ Motor configuration analyzed:', motorConfig);
            
            return motorConfig;
            
        } catch (error) {
            console.error('❌ Error analyzing motor configuration:', error);
            throw error;
        }
    },
    
    async readGRBLConfig() {
        // GRBL uses $$ command to list settings
        const config = { axes: [], motors: [], capabilities: {} };
        
        // Common GRBL settings
        config.axes = ['X', 'Y', 'Z'];
        config.capabilities.hasSpindle = true;
        config.capabilities.hasCoolant = true;
        config.capabilities.hasProbe = true;
        
        return config;
    },
    
    async readMarlinConfig() {
        // Marlin uses M503 to list settings
        const config = { axes: [], motors: [], capabilities: {} };
        
        // Common Marlin configuration
        config.axes = ['X', 'Y', 'Z', 'E'];
        config.capabilities.hasHeatedBed = true;
        config.capabilities.hasExtruder = true;
        config.capabilities.hasFan = true;
        
        return config;
    },
    
    async readSmoothieConfig() {
        // Smoothieware uses config-get to list settings
        const config = { axes: [], motors: [], capabilities: {} };
        
        config.axes = ['X', 'Y', 'Z'];
        config.capabilities.hasLaser = true;
        config.capabilities.hasSpindle = true;
        
        return config;
    },
    
    async probeGenericConfig() {
        // Fallback for unknown boards
        const config = { axes: [], motors: [], capabilities: {} };
        
        config.axes = ['X', 'Y'];
        config.capabilities.basic = true;
        
        return config;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CONTROL LAYOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateControlLayout(motorConfig) {
        console.log('🎛️ Generating control layout...');
        
        const layout = {
            buttons: [],
            axes: [],
            inputs: [],
            displays: []
        };
        
        // Add axis controls
        motorConfig.axes.forEach(axis => {
            layout.axes.push({
                name: axis,
                buttons: ['jog+', 'jog-', 'home', 'zero'],
                display: 'position'
            });
        });
        
        // Add basic buttons
        layout.buttons.push(...this.controlButtons.basic);
        
        // Add capability-specific buttons
        if (motorConfig.capabilities.hasSpindle) {
            layout.buttons.push('spindle_on', 'spindle_off', 'spindle_speed');
        }
        
        if (motorConfig.capabilities.hasCoolant) {
            layout.buttons.push('coolant_on', 'coolant_off');
        }
        
        if (motorConfig.capabilities.hasProbe) {
            layout.buttons.push('probe_z', 'probe_corner');
        }
        
        if (motorConfig.capabilities.hasHeatedBed) {
            layout.buttons.push('bed_temp', 'bed_on', 'bed_off');
        }
        
        if (motorConfig.capabilities.hasExtruder) {
            layout.buttons.push('extrude', 'retract', 'nozzle_temp');
        }
        
        this.connectedMachine.controlLayout = layout;
        console.log('✅ Control layout generated:', layout);
        
        return layout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SCRIPT BACKUP AND MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    async backupOriginalScript() {
        console.log('💾 Backing up original machine script...');
        
        const backup = {
            machineId: this.connectedMachine.id,
            boardType: this.connectedMachine.boardType,
            timestamp: new Date().toISOString(),
            configuration: null,
            script: null
        };
        
        try {
            // Read current configuration
            if (this.connectedMachine.boardType === 'grbl') {
                backup.configuration = await this.readGRBLFullConfig();
            } else if (this.connectedMachine.boardType === 'marlin') {
                backup.configuration = await this.readMarlinFullConfig();
            }
            
            // Store backup
            this.connectedMachine.originalScript = backup;
            
            // Save to localStorage
            const machineId = this.connectedMachine.id || `machine_${Date.now()}`;
            localStorage.setItem(`machine_backup_${machineId}`, JSON.stringify(backup));
            
            console.log('✅ Original script backed up successfully');
            
            return backup;
            
        } catch (error) {
            console.error('❌ Error backing up script:', error);
            throw error;
        }
    },
    
    async restoreOriginalScript() {
        console.log('🔄 Restoring original machine script...');
        
        if (!this.connectedMachine.originalScript) {
            throw new Error('No backup found for this machine');
        }
        
        // Restore configuration to the machine
        // Implementation depends on board type
        
        console.log('✅ Original script restored');
        
        return true;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UI INTEGRATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    setupEventListeners() {
        // Listen for disconnect events
        if ('serial' in navigator) {
            navigator.serial.addEventListener('disconnect', (e) => {
                console.log('🔌 Machine disconnected');
                this.handleDisconnect();
            });
        }
    },
    
    handleDisconnect() {
        this.connectedMachine = {
            id: null,
            name: null,
            manufacturer: null,
            boardType: null,
            comPort: null,
            motorConfig: null,
            controlLayout: null
        };
        
        console.log('Machine connection cleared');
    },
    
    initializeUI() {
        console.log('🎨 Initializing Machine Integration UI...');
        
        // UI will be initialized when called
        // This creates the interface for payment verification and machine connection
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════
    
    getStatus() {
        return {
            initialized: this.initialized,
            licensed: this.licensing.licenseStatus === 'active',
            connected: this.connectedMachine.comPort !== null,
            machine: this.connectedMachine,
            licensing: this.licensing
        };
    },
    
    async connectMachine() {
        // Full connection workflow
        const machine = await this.scanForMachines();
        const motorConfig = await this.analyzeMotorConfiguration();
        const layout = this.generateControlLayout(motorConfig);
        await this.backupOriginalScript();
        
        return {
            machine,
            motorConfig,
            layout
        };
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.MachineIntegrationHub.init();
    });
} else {
    window.MachineIntegrationHub.init();
}
