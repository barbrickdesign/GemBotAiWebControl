/**
 * GemBot 3D Printer Board Detection & Communication System
 * Detects and communicates with various 3D printer control boards
 * 
 * Supported Firmwares:
 * - Marlin (most common - Ender, Prusa, CR-10, etc.)
 * - Klipper (Raspberry Pi based)
 * - RepRapFirmware (Duet boards)
 * - Smoothieware (Smoothieboard)
 * - grbl (CNC/laser cutters)
 * - TinyG (Othermill, Shapeoko)
 * 
 * © 2024-2025 Ryan Barbrick / Barbrick Design
 */

const GemBotPrinterBridge = {
    version: '1.0.0',
    initialized: false,
    
    // Connection state
    connection: {
        port: null,
        reader: null,
        writer: null,
        connected: false,
        boardType: null,
        firmware: null,
        firmwareVersion: null
    },
    
    // Detected printer info
    printer: {
        name: null,
        manufacturer: null,
        model: null,
        serialNumber: null,
        features: [],
        axes: { x: true, y: true, z: true, e: true },
        bedSize: { x: 0, y: 0, z: 0 },
        hotendCount: 1,
        heatedBed: false,
        autoLevel: false
    },
    
    // Firmware signatures for detection
    firmwareSignatures: {
        marlin: {
            patterns: [
                /FIRMWARE_NAME:Marlin/i,
                /Marlin\s+[\d\.]+/i,
                /echo:Marlin/i
            ],
            probe: 'M115\n',
            responseKey: 'FIRMWARE_NAME',
            gcodeDialect: 'marlin'
        },
        klipper: {
            patterns: [
                /Klipper/i,
                /klippy/i
            ],
            probe: 'M115\n',
            responseKey: 'FIRMWARE_NAME',
            gcodeDialect: 'klipper',
            note: 'Usually accessed via Moonraker API, not direct serial'
        },
        reprap: {
            patterns: [
                /RepRapFirmware/i,
                /FIRMWARE_NAME:RepRap/i,
                /Duet/i
            ],
            probe: 'M115\n',
            responseKey: 'FIRMWARE_NAME',
            gcodeDialect: 'reprap'
        },
        smoothie: {
            patterns: [
                /Smoothie/i,
                /FIRMWARE_NAME:Smoothie/i
            ],
            probe: 'M115\n',
            responseKey: 'FIRMWARE_NAME',
            gcodeDialect: 'smoothie'
        },
        grbl: {
            patterns: [
                /Grbl\s+[\d\.]+/i,
                /\[VER:/,
                /\$\$/  // Settings dump
            ],
            probe: '$I\n',
            responseKey: 'VER',
            gcodeDialect: 'grbl'
        },
        tinyg: {
            patterns: [
                /tinyg/i,
                /TinyG/,
                /"fv":/  // JSON response
            ],
            probe: '{"sr":""}\n',
            responseKey: 'fv',
            gcodeDialect: 'tinyg'
        },
        prusa: {
            patterns: [
                /Prusa-Firmware/i,
                /FIRMWARE_NAME:Prusa/i
            ],
            probe: 'M115\n',
            responseKey: 'FIRMWARE_NAME',
            gcodeDialect: 'marlin' // Prusa uses Marlin dialect
        }
    },
    
    // Board identification database
    boardDatabase: {
        'RAMPS': {
            manufacturer: 'RepRap',
            mcu: 'ATmega2560',
            voltage: '12V/24V',
            drivers: 'A4988/DRV8825',
            features: ['5 stepper drivers', 'heated bed', '3 thermistors']
        },
        'SKR': {
            manufacturer: 'BigTreeTech',
            mcu: 'STM32/LPC1768',
            voltage: '12V/24V',
            drivers: 'TMC2208/2209/5160',
            features: ['silent drivers', 'SD card', 'USB-C']
        },
        'Duet': {
            manufacturer: 'Duet3D',
            mcu: 'SAM4E8E/SAM4S',
            voltage: '12V/24V',
            drivers: 'TMC2660/5160',
            features: ['WiFi', 'web interface', 'expansion boards']
        },
        'Smoothieboard': {
            manufacturer: 'Smoothie',
            mcu: 'LPC1769',
            voltage: '12V/24V',
            drivers: 'A5984',
            features: ['ethernet', 'SD card', 'modular']
        },
        'Einsy': {
            manufacturer: 'Prusa Research',
            mcu: 'ATmega2560',
            voltage: '24V',
            drivers: 'TMC2130',
            features: ['silent mode', 'PINDA probe', 'removable bed']
        },
        'Creality': {
            manufacturer: 'Creality',
            mcu: 'STM32F103/GD32F303',
            voltage: '24V',
            drivers: 'A4988/TMC2208',
            features: ['basic LCD', 'SD card', 'upgradeable']
        },
        'MKS': {
            manufacturer: 'Makerbase',
            mcu: 'STM32F407',
            voltage: '12V/24V',
            drivers: 'TMC2209',
            features: ['WiFi module', 'TFT display', 'relay control']
        },
        'Archim': {
            manufacturer: 'UltiMachine',
            mcu: 'SAM3X8E',
            voltage: '12V/24V',
            drivers: 'TMC2130',
            features: ['32-bit', 'USB host', 'expandable']
        }
    },
    
    /**
     * Initialize the printer bridge
     */
    async init() {
        if (this.initialized) return this;
        
        console.log('🖨️ GemBot Printer Bridge initializing...');
        
        // Check for Web Serial API support
        if (!('serial' in navigator)) {
            console.warn('⚠️ Web Serial API not supported in this browser');
            this.webSerialSupported = false;
        } else {
            this.webSerialSupported = true;
            console.log('✅ Web Serial API available');
        }
        
        // Load saved printer configurations
        this.loadSavedPrinters();
        
        this.initialized = true;
        console.log('✅ Printer Bridge initialized');
        
        return this;
    },
    
    /**
     * Request USB serial port access and connect
     */
    async connect() {
        if (!this.webSerialSupported) {
            throw new Error('Web Serial API not supported. Use Chrome, Edge, or Opera.');
        }
        
        try {
            // Request port from user
            const port = await navigator.serial.requestPort();
            
            // Open port with common baud rates
            const baudRates = [115200, 250000, 57600, 9600];
            let connected = false;
            
            for (const baud of baudRates) {
                try {
                    await port.open({ baudRate: baud });
                    console.log(`📡 Connected at ${baud} baud`);
                    connected = true;
                    break;
                } catch (e) {
                    console.log(`❌ ${baud} baud failed, trying next...`);
                }
            }
            
            if (!connected) {
                throw new Error('Could not connect at any standard baud rate');
            }
            
            this.connection.port = port;
            this.connection.connected = true;
            
            // Setup reader/writer
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            this.connection.reader = textDecoder.readable.getReader();
            
            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            this.connection.writer = textEncoder.writable.getWriter();
            
            // Detect firmware
            await this.detectFirmware();
            
            // Dispatch connection event
            window.dispatchEvent(new CustomEvent('printerConnected', {
                detail: {
                    firmware: this.connection.firmware,
                    version: this.connection.firmwareVersion,
                    printer: this.printer
                }
            }));
            
            return true;
            
        } catch (error) {
            console.error('❌ Connection failed:', error);
            throw error;
        }
    },
    
    /**
     * Detect firmware type by probing the board
     */
    async detectFirmware() {
        console.log('🔍 Detecting firmware...');
        
        // Send M115 (universal firmware info command)
        await this.sendCommand('M115');
        
        // Wait for response
        const response = await this.readResponse(2000);
        console.log('📨 Firmware response:', response);
        
        // Match against known signatures
        for (const [name, sig] of Object.entries(this.firmwareSignatures)) {
            for (const pattern of sig.patterns) {
                if (pattern.test(response)) {
                    this.connection.firmware = name;
                    this.connection.boardType = this.detectBoardFromResponse(response);
                    
                    // Extract version
                    const versionMatch = response.match(/[\d]+\.[\d]+\.[\d]+/);
                    if (versionMatch) {
                        this.connection.firmwareVersion = versionMatch[0];
                    }
                    
                    console.log(`✅ Detected: ${name} ${this.connection.firmwareVersion || ''}`);
                    
                    // Get printer capabilities
                    await this.queryCapabilities();
                    
                    return;
                }
            }
        }
        
        console.warn('⚠️ Unknown firmware detected');
        this.connection.firmware = 'unknown';
    },
    
    /**
     * Detect board type from firmware response
     */
    detectBoardFromResponse(response) {
        const boardPatterns = {
            'SKR': /BTT\s*SKR|BIGTREETECH.*SKR/i,
            'RAMPS': /RAMPS/i,
            'Duet': /Duet/i,
            'Smoothieboard': /Smoothie/i,
            'Einsy': /Einsy|Prusa/i,
            'Creality': /Creality|CR-|Ender/i,
            'MKS': /MKS|Makerbase/i,
            'Archim': /Archim|UltiMachine/i
        };
        
        for (const [board, pattern] of Object.entries(boardPatterns)) {
            if (pattern.test(response)) {
                return board;
            }
        }
        
        return 'Generic';
    },
    
    /**
     * Query printer capabilities
     */
    async queryCapabilities() {
        const firmware = this.connection.firmware;
        
        if (firmware === 'marlin' || firmware === 'prusa') {
            // Get bed size from M503 (EEPROM settings)
            await this.sendCommand('M503');
            const settings = await this.readResponse(3000);
            
            // Parse bed size from M211 response
            const sizeMatch = settings.match(/M211.*X([\d.]+).*Y([\d.]+).*Z([\d.]+)/i);
            if (sizeMatch) {
                this.printer.bedSize = {
                    x: parseFloat(sizeMatch[1]),
                    y: parseFloat(sizeMatch[2]),
                    z: parseFloat(sizeMatch[3])
                };
            }
            
            // Check for auto-level (G29)
            this.printer.autoLevel = /G29|BLTouch|PINDA|ABL/i.test(settings);
            
            // Check extruder count
            const extruderMatch = settings.match(/EXTRUDERS[:\s]+(\d+)/i);
            if (extruderMatch) {
                this.printer.hotendCount = parseInt(extruderMatch[1]);
            }
        }
        
        if (firmware === 'grbl') {
            // grbl settings
            await this.sendCommand('$$');
            const grblSettings = await this.readResponse(2000);
            
            // Parse work area from $130, $131, $132
            const xMax = grblSettings.match(/\$130=([\d.]+)/);
            const yMax = grblSettings.match(/\$131=([\d.]+)/);
            const zMax = grblSettings.match(/\$132=([\d.]+)/);
            
            if (xMax && yMax && zMax) {
                this.printer.bedSize = {
                    x: parseFloat(xMax[1]),
                    y: parseFloat(yMax[1]),
                    z: parseFloat(zMax[1])
                };
            }
        }
        
        console.log('📊 Printer capabilities:', this.printer);
    },
    
    /**
     * Send G-code command to printer
     */
    async sendCommand(command) {
        if (!this.connection.connected || !this.connection.writer) {
            throw new Error('Not connected to printer');
        }
        
        const cmd = command.endsWith('\n') ? command : command + '\n';
        await this.connection.writer.write(cmd);
        console.log('📤 Sent:', command);
    },
    
    /**
     * Read response from printer with timeout
     */
    async readResponse(timeout = 1000) {
        if (!this.connection.reader) {
            throw new Error('No reader available');
        }
        
        let response = '';
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                const { value, done } = await Promise.race([
                    this.connection.reader.read(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('timeout')), 100)
                    )
                ]);
                
                if (done) break;
                if (value) response += value;
                
                // Check for end markers
                if (response.includes('ok') || response.includes('error')) {
                    break;
                }
            } catch (e) {
                if (e.message !== 'timeout') throw e;
            }
        }
        
        return response;
    },
    
    /**
     * Disconnect from printer
     */
    async disconnect() {
        if (this.connection.reader) {
            await this.connection.reader.cancel();
        }
        if (this.connection.writer) {
            await this.connection.writer.close();
        }
        if (this.connection.port) {
            await this.connection.port.close();
        }
        
        this.connection = {
            port: null,
            reader: null,
            writer: null,
            connected: false,
            boardType: null,
            firmware: null,
            firmwareVersion: null
        };
        
        console.log('🔌 Disconnected from printer');
        
        window.dispatchEvent(new CustomEvent('printerDisconnected'));
    },
    
    /**
     * Inject GemBot menu into printer's display
     * Works by sending custom M117 messages or LCD commands
     */
    async injectGemBotMenu() {
        if (!this.connection.connected) {
            throw new Error('Not connected to printer');
        }
        
        const firmware = this.connection.firmware;
        
        console.log('💉 Injecting GemBot menu into', firmware, 'firmware...');
        
        // Display GemBot welcome message
        if (firmware === 'marlin' || firmware === 'prusa') {
            await this.sendCommand('M117 GemBot Connected!');
            await this.sendCommand('M300 S440 P200'); // Beep
        } else if (firmware === 'reprap') {
            await this.sendCommand('M291 P"GemBot Connected!" R"GemBot" S0 T5');
        } else if (firmware === 'klipper') {
            // Klipper uses macros - would need to define via Moonraker
            console.log('📝 Klipper detected - menu injection requires Moonraker API');
        }
        
        // Set up status polling
        this.startStatusPolling();
        
        return true;
    },
    
    /**
     * Start polling printer status
     */
    startStatusPolling() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
        }
        
        this.statusInterval = setInterval(async () => {
            if (!this.connection.connected) {
                clearInterval(this.statusInterval);
                return;
            }
            
            try {
                await this.sendCommand('M105'); // Get temperatures
                const tempResponse = await this.readResponse(500);
                
                // Parse temperature
                const hotendMatch = tempResponse.match(/T:(\d+\.?\d*)/);
                const bedMatch = tempResponse.match(/B:(\d+\.?\d*)/);
                
                const status = {
                    hotendTemp: hotendMatch ? parseFloat(hotendMatch[1]) : null,
                    bedTemp: bedMatch ? parseFloat(bedMatch[1]) : null,
                    timestamp: Date.now()
                };
                
                window.dispatchEvent(new CustomEvent('printerStatus', { detail: status }));
                
            } catch (e) {
                // Ignore polling errors
            }
        }, 2000);
    },
    
    /**
     * Execute GemBot-specific operations
     */
    async executeGemBotOperation(operation, params = {}) {
        console.log('🔧 Executing GemBot operation:', operation);
        
        switch (operation) {
            case 'homeAll':
                await this.sendCommand('G28');
                break;
                
            case 'homeXY':
                await this.sendCommand('G28 X Y');
                break;
                
            case 'homeZ':
                await this.sendCommand('G28 Z');
                break;
                
            case 'moveToPosition':
                const { x, y, z, feedrate = 3000 } = params;
                let cmd = `G0 F${feedrate}`;
                if (x !== undefined) cmd += ` X${x}`;
                if (y !== undefined) cmd += ` Y${y}`;
                if (z !== undefined) cmd += ` Z${z}`;
                await this.sendCommand(cmd);
                break;
                
            case 'setHotend':
                await this.sendCommand(`M104 S${params.temp || 0}`);
                break;
                
            case 'setBed':
                await this.sendCommand(`M140 S${params.temp || 0}`);
                break;
                
            case 'startSpindle':
                // For CNC/gemstone operations
                const rpm = params.rpm || 10000;
                if (this.connection.firmware === 'grbl') {
                    await this.sendCommand(`M3 S${rpm}`);
                } else {
                    await this.sendCommand(`M3 S${rpm}`);
                }
                break;
                
            case 'stopSpindle':
                await this.sendCommand('M5');
                break;
                
            case 'emergencyStop':
                await this.sendCommand('M112');
                break;
                
            case 'gemCutSequence':
                // Custom gemstone cutting sequence
                await this.executeGemCutSequence(params);
                break;
                
            default:
                console.warn('Unknown operation:', operation);
        }
    },
    
    /**
     * Execute gemstone cutting sequence
     */
    async executeGemCutSequence(params) {
        const { facets = 8, angle = 42, depth = 0.5 } = params;
        
        console.log(`💎 Starting gem cut: ${facets} facets at ${angle}°`);
        
        // Home first
        await this.sendCommand('G28');
        await this.readResponse(30000);
        
        // Move to safe height
        await this.sendCommand('G0 Z50 F1000');
        await this.readResponse(5000);
        
        // Start spindle
        await this.sendCommand('M3 S10000');
        await new Promise(r => setTimeout(r, 2000));
        
        // Cut each facet
        const angleStep = 360 / facets;
        for (let i = 0; i < facets; i++) {
            const rotationAngle = i * angleStep;
            console.log(`  Cutting facet ${i + 1}/${facets} at ${rotationAngle}°`);
            
            // Rotate A-axis (if available)
            await this.sendCommand(`G0 A${rotationAngle} F1000`);
            await this.readResponse(3000);
            
            // Approach cut
            await this.sendCommand(`G1 Z${-depth} F100`);
            await this.readResponse(5000);
            
            // Retract
            await this.sendCommand('G0 Z5 F500');
            await this.readResponse(2000);
        }
        
        // Stop spindle
        await this.sendCommand('M5');
        
        // Return home
        await this.sendCommand('G28');
        
        console.log('✅ Gem cut sequence complete');
    },
    
    /**
     * Load saved printer configurations from localStorage
     */
    loadSavedPrinters() {
        try {
            const saved = localStorage.getItem('gembot_saved_printers');
            if (saved) {
                this.savedPrinters = JSON.parse(saved);
                console.log('📂 Loaded', Object.keys(this.savedPrinters).length, 'saved printers');
            } else {
                this.savedPrinters = {};
            }
        } catch (e) {
            this.savedPrinters = {};
        }
    },
    
    /**
     * Save current printer configuration
     */
    savePrinterConfig(name) {
        if (!this.connection.connected) {
            console.warn('No printer connected');
            return;
        }
        
        this.savedPrinters[name] = {
            firmware: this.connection.firmware,
            firmwareVersion: this.connection.firmwareVersion,
            boardType: this.connection.boardType,
            printer: { ...this.printer },
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('gembot_saved_printers', JSON.stringify(this.savedPrinters));
        console.log('💾 Saved printer config:', name);
    },
    
    /**
     * Render connection UI
     */
    renderConnectionUI() {
        const connected = this.connection.connected;
        const firmware = this.connection.firmware;
        const version = this.connection.firmwareVersion;
        
        return `
            <div class="printer-connection-panel" style="
                background: linear-gradient(135deg, #1a1f3a 0%, #2d1f3a 100%);
                border: 2px solid ${connected ? '#4affff' : '#667eea'};
                border-radius: 12px;
                padding: 20px;
                color: white;
                font-family: system-ui, sans-serif;
            ">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <span style="font-size: 32px;">${connected ? '🖨️' : '🔌'}</span>
                    <div>
                        <h3 style="margin: 0; color: #4affff;">3D Printer Bridge</h3>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #9f7aea;">
                            ${connected ? `Connected: ${firmware} ${version}` : 'Not connected'}
                        </p>
                    </div>
                </div>
                
                ${connected ? `
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                            <div>📐 Board: <span style="color: #ffd700;">${this.connection.boardType}</span></div>
                            <div>🔧 Firmware: <span style="color: #ffd700;">${firmware}</span></div>
                            <div>📏 Bed: <span style="color: #4affff;">${this.printer.bedSize.x}×${this.printer.bedSize.y}×${this.printer.bedSize.z}mm</span></div>
                            <div>🔥 Hotends: <span style="color: #4affff;">${this.printer.hotendCount}</span></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button onclick="GemBotPrinterBridge.executeGemBotOperation('homeAll')" 
                            style="padding: 8px 16px; background: #667eea; border: none; border-radius: 6px; color: white; cursor: pointer;">
                            🏠 Home All
                        </button>
                        <button onclick="GemBotPrinterBridge.executeGemBotOperation('startSpindle', {rpm: 10000})" 
                            style="padding: 8px 16px; background: #10b981; border: none; border-radius: 6px; color: white; cursor: pointer;">
                            ⚡ Start Spindle
                        </button>
                        <button onclick="GemBotPrinterBridge.executeGemBotOperation('stopSpindle')" 
                            style="padding: 8px 16px; background: #f59e0b; border: none; border-radius: 6px; color: white; cursor: pointer;">
                            ⏹️ Stop
                        </button>
                        <button onclick="GemBotPrinterBridge.executeGemBotOperation('emergencyStop')" 
                            style="padding: 8px 16px; background: #ef4444; border: none; border-radius: 6px; color: white; cursor: pointer;">
                            🚨 E-STOP
                        </button>
                        <button onclick="GemBotPrinterBridge.disconnect()" 
                            style="padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid #667eea; border-radius: 6px; color: white; cursor: pointer;">
                            🔌 Disconnect
                        </button>
                    </div>
                ` : `
                    <button onclick="GemBotPrinterBridge.connect().catch(e => alert(e.message))" 
                        style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #9f7aea); 
                        border: none; border-radius: 8px; color: white; font-size: 16px; cursor: pointer;">
                        🔗 Connect to 3D Printer
                    </button>
                    ${!this.webSerialSupported ? `
                        <p style="color: #f59e0b; font-size: 12px; margin-top: 8px;">
                            ⚠️ Web Serial not supported. Use Chrome, Edge, or Opera.
                        </p>
                    ` : ''}
                `}
            </div>
        `;
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GemBotPrinterBridge.init());
} else {
    GemBotPrinterBridge.init();
}

// Export
window.GemBotPrinterBridge = GemBotPrinterBridge;
