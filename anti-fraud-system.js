/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GEMBOT ANTI-FRAUD & SECURITY SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * Prevents multiple account creation for bonus farming
 * Multi-layered detection: IP, fingerprint, device, behavior, email patterns
 * ═══════════════════════════════════════════════════════════════════════════
 */

class GemBotSecuritySystem {
    constructor() {
        this.maxAccountsPerIP = 3; // Max accounts from same IP
        this.maxAccountsPerDevice = 2; // Max accounts per device
        this.suspicionThreshold = 50; // 0-100 score
        this.banThreshold = 80; // Auto-ban above this
        
        // Rate limiting
        this.registrationCooldown = 300000; // 5 minutes between registrations
        this.lastRegistration = {};
        
        console.log('🛡️ GemBot Security System initialized');
    }
    
    /**
     * Main security check - called before account creation
     * Returns: { allowed: boolean, reason: string, score: number }
     */
    async checkRegistrationSecurity(username, email) {
        console.log(`🔍 Security check for: ${username}`);
        
        const checks = {
            ipCheck: await this.checkIPAddress(),
            deviceCheck: await this.checkDeviceFingerprint(),
            emailCheck: this.checkEmailPattern(email),
            behaviorCheck: this.checkBehavior(),
            rateLimit: this.checkRateLimit(),
            existingAccount: this.checkExistingAccount(username, email)
        };
        
        // Calculate suspicion score (0-100)
        const score = this.calculateSuspicionScore(checks);
        
        // Log to activity feed
        if (window.liveActivityFeed) {
            if (score > this.suspicionThreshold) {
                window.liveActivityFeed.logError(
                    `⚠️ Suspicious registration attempt: ${username} (Score: ${score})`
                );
            }
        }
        
        // Decision logic
        if (score >= this.banThreshold) {
            return {
                allowed: false,
                reason: 'Security violation detected. Please contact support.',
                score: score,
                blocked: true
            };
        } else if (score >= this.suspicionThreshold) {
            return {
                allowed: true,
                reason: 'Account flagged for review',
                score: score,
                flagged: true,
                reducedBonus: true // Give only 10 GBUV instead of 100
            };
        } else {
            return {
                allowed: true,
                reason: 'Security checks passed',
                score: score,
                flagged: false
            };
        }
    }
    
    /**
     * IP Address Tracking
     */
    async checkIPAddress() {
        try {
            // Get user's IP address
            const ipData = await this.getUserIP();
            const ip = ipData.ip;
            
            // Check how many accounts from this IP
            const accounts = this.getAccountsByIP(ip);
            const count = accounts.length;
            
            // Store this IP
            this.saveIPData(ip, ipData);
            
            return {
                ip: ip,
                accountCount: count,
                suspicious: count >= this.maxAccountsPerIP,
                vpnDetected: ipData.vpn || false,
                proxyDetected: ipData.proxy || false,
                country: ipData.country,
                risk: this.calculateIPRisk(count, ipData)
            };
            
        } catch (error) {
            console.error('IP check failed:', error);
            return { ip: 'unknown', accountCount: 0, suspicious: false, risk: 0 };
        }
    }
    
    /**
     * Get user's IP address
     */
    async getUserIP() {
        try {
            // Use multiple IP detection services for reliability
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            
            // Enhanced data from ipapi.co (includes VPN/proxy detection)
            const enhanced = await fetch(`https://ipapi.co/${data.ip}/json/`);
            const enriched = await enhanced.json();
            
            return {
                ip: data.ip,
                country: enriched.country_name,
                city: enriched.city,
                vpn: enriched.threat?.is_vpn || false,
                proxy: enriched.threat?.is_proxy || false,
                tor: enriched.threat?.is_tor || false,
                datacenter: enriched.threat?.is_datacenter || false
            };
        } catch (error) {
            console.error('IP detection failed:', error);
            return { ip: 'unknown' };
        }
    }
    
    /**
     * Calculate IP risk score (0-50)
     */
    calculateIPRisk(accountCount, ipData) {
        let risk = 0;
        
        // Multiple accounts from same IP
        if (accountCount >= 5) risk += 30;
        else if (accountCount >= 3) risk += 20;
        else if (accountCount >= 2) risk += 10;
        
        // VPN/Proxy usage
        if (ipData.vpn) risk += 15;
        if (ipData.proxy) risk += 15;
        if (ipData.tor) risk += 20;
        if (ipData.datacenter) risk += 10;
        
        return Math.min(risk, 50);
    }
    
    /**
     * Device Fingerprinting
     */
    async checkDeviceFingerprint() {
        const fingerprint = await this.generateDeviceFingerprint();
        
        // Check how many accounts from this device
        const accounts = this.getAccountsByFingerprint(fingerprint);
        const count = accounts.length;
        
        // Store fingerprint
        this.saveFingerprintData(fingerprint);
        
        return {
            fingerprint: fingerprint,
            accountCount: count,
            suspicious: count >= this.maxAccountsPerDevice,
            risk: count >= 3 ? 30 : count >= 2 ? 20 : 0
        };
    }
    
    /**
     * Generate unique device fingerprint
     */
    async generateDeviceFingerprint() {
        const components = {
            // Browser info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages?.join(','),
            
            // Screen info
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            
            // Timezone
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            
            // Hardware
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            
            // Canvas fingerprint
            canvas: await this.getCanvasFingerprint(),
            
            // WebGL fingerprint
            webgl: this.getWebGLFingerprint(),
            
            // Audio fingerprint
            audio: await this.getAudioFingerprint(),
            
            // Fonts
            fonts: this.getInstalledFonts(),
            
            // Plugins
            plugins: Array.from(navigator.plugins || []).map(p => p.name).join(',')
        };
        
        // Hash all components
        const fingerprint = await this.hashObject(components);
        return fingerprint;
    }
    
    /**
     * Canvas fingerprinting
     */
    async getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 50;
            
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('GemBot Security 🛡️', 2, 15);
            
            return canvas.toDataURL();
        } catch (error) {
            return 'unavailable';
        }
    }
    
    /**
     * WebGL fingerprinting
     */
    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) return 'unavailable';
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            
            return `${vendor}|${renderer}`;
        } catch (error) {
            return 'unavailable';
        }
    }
    
    /**
     * Audio fingerprinting
     */
    async getAudioFingerprint() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return 'unavailable';
            
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const analyser = context.createAnalyser();
            const gainNode = context.createGain();
            const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
            
            gainNode.gain.value = 0;
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.start(0);
            
            return new Promise((resolve) => {
                scriptProcessor.onaudioprocess = (event) => {
                    const output = event.inputBuffer.getChannelData(0);
                    const sum = output.reduce((a, b) => a + b, 0);
                    oscillator.stop();
                    scriptProcessor.disconnect();
                    resolve(sum.toString());
                };
            });
        } catch (error) {
            return 'unavailable';
        }
    }
    
    /**
     * Font detection
     */
    getInstalledFonts() {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New',
            'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS',
            'Impact', 'Trebuchet MS', 'Arial Black', 'Lucida Console'
        ];
        
        const detected = testFonts.filter(font => this.isFontAvailable(font, baseFonts));
        return detected.join(',');
    }
    
    isFontAvailable(font, baseFonts) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const text = 'mmmmmmmmmmlli';
        
        ctx.font = '72px ' + baseFonts[0];
        const baseWidth = ctx.measureText(text).width;
        
        ctx.font = '72px ' + font + ', ' + baseFonts[0];
        const testWidth = ctx.measureText(text).width;
        
        return baseWidth !== testWidth;
    }
    
    /**
     * Email pattern analysis
     */
    checkEmailPattern(email) {
        const patterns = {
            disposable: this.isDisposableEmail(email),
            sequential: this.isSequentialEmail(email),
            suspicious: this.isSuspiciousPattern(email),
            tempmail: this.isTempMail(email)
        };
        
        const risk = 
            (patterns.disposable ? 25 : 0) +
            (patterns.sequential ? 15 : 0) +
            (patterns.suspicious ? 10 : 0) +
            (patterns.tempmail ? 20 : 0);
        
        return {
            email: email,
            patterns: patterns,
            suspicious: risk > 20,
            risk: risk
        };
    }
    
    /**
     * Check if email is from disposable provider
     */
    isDisposableEmail(email) {
        const disposableDomains = [
            'tempmail.com', 'guerrillamail.com', '10minutemail.com',
            'throwaway.email', 'mailinator.com', 'temp-mail.org',
            'yopmail.com', 'maildrop.cc', 'trashmail.com'
        ];
        
        const domain = email.split('@')[1]?.toLowerCase();
        return disposableDomains.some(d => domain?.includes(d));
    }
    
    /**
     * Check for sequential patterns (user1, user2, user3, etc.)
     */
    isSequentialEmail(email) {
        const pattern = /^[a-z]+\d+@/i;
        return pattern.test(email);
    }
    
    /**
     * Check for suspicious patterns
     */
    isSuspiciousPattern(email) {
        const suspicious = [
            /test\d+@/, /fake\d+@/, /spam\d+@/,
            /bot\d+@/, /temp\d+@/, /throw\d+@/
        ];
        
        return suspicious.some(pattern => pattern.test(email));
    }
    
    /**
     * Check if temp mail service
     */
    isTempMail(email) {
        const domain = email.split('@')[1]?.toLowerCase();
        return domain?.includes('temp') || domain?.includes('trash') || domain?.includes('throw');
    }
    
    /**
     * Behavior analysis
     */
    checkBehavior() {
        const behavior = {
            mouseMovements: this.getMouseMovementData(),
            keyboardTiming: this.getKeyboardTimingData(),
            timeOnSite: this.getTimeOnSite(),
            interactions: this.getInteractionCount()
        };
        
        // Bot-like behavior detection
        const botScore = 
            (behavior.mouseMovements.score || 0) +
            (behavior.keyboardTiming.score || 0) +
            (behavior.timeOnSite < 10 ? 10 : 0) + // Too fast
            (behavior.interactions < 3 ? 10 : 0); // Too few interactions
        
        return {
            behavior: behavior,
            suspicious: botScore > 15,
            risk: Math.min(botScore, 20)
        };
    }
    
    getMouseMovementData() {
        const data = JSON.parse(localStorage.getItem('mouse_tracking') || '[]');
        // Bots have linear, unnatural mouse movements
        return { movements: data.length, score: data.length < 5 ? 10 : 0 };
    }
    
    getKeyboardTimingData() {
        const data = JSON.parse(localStorage.getItem('keyboard_timing') || '[]');
        // Bots have perfectly timed keystrokes
        return { strokes: data.length, score: 0 };
    }
    
    getTimeOnSite() {
        const start = localStorage.getItem('session_start');
        if (!start) return 0;
        return (Date.now() - parseInt(start)) / 1000;
    }
    
    getInteractionCount() {
        return parseInt(localStorage.getItem('interaction_count') || '0');
    }
    
    /**
     * Rate limiting
     */
    checkRateLimit() {
        const now = Date.now();
        const lastAttempt = localStorage.getItem('last_registration_attempt');
        
        if (lastAttempt) {
            const timeSince = now - parseInt(lastAttempt);
            if (timeSince < this.registrationCooldown) {
                return {
                    limited: true,
                    waitTime: Math.ceil((this.registrationCooldown - timeSince) / 1000),
                    risk: 20
                };
            }
        }
        
        localStorage.setItem('last_registration_attempt', now.toString());
        return { limited: false, risk: 0 };
    }
    
    /**
     * Check for existing account
     */
    checkExistingAccount(username, email) {
        const wallets = JSON.parse(localStorage.getItem('gembot_wallets') || '{}');
        
        // Check username
        const usernameExists = Object.values(wallets).some(w => 
            w.username?.toLowerCase() === username.toLowerCase()
        );
        
        // Check email
        const emailExists = Object.values(wallets).some(w => 
            w.email?.toLowerCase() === email.toLowerCase()
        );
        
        return {
            usernameExists: usernameExists,
            emailExists: emailExists,
            suspicious: false,
            risk: 0
        };
    }
    
    /**
     * Calculate total suspicion score
     */
    calculateSuspicionScore(checks) {
        let score = 0;
        
        score += checks.ipCheck.risk || 0;
        score += checks.deviceCheck.risk || 0;
        score += checks.emailCheck.risk || 0;
        score += checks.behaviorCheck.risk || 0;
        score += checks.rateLimit.risk || 0;
        
        return Math.min(score, 100);
    }
    
    /**
     * Storage helpers
     */
    getAccountsByIP(ip) {
        const ips = JSON.parse(localStorage.getItem('ip_tracking') || '{}');
        return ips[ip] || [];
    }
    
    saveIPData(ip, data) {
        const ips = JSON.parse(localStorage.getItem('ip_tracking') || '{}');
        if (!ips[ip]) ips[ip] = [];
        ips[ip].push({ timestamp: Date.now(), data: data });
        localStorage.setItem('ip_tracking', JSON.stringify(ips));
    }
    
    getAccountsByFingerprint(fingerprint) {
        const prints = JSON.parse(localStorage.getItem('fingerprint_tracking') || '{}');
        return prints[fingerprint] || [];
    }
    
    saveFingerprintData(fingerprint) {
        const prints = JSON.parse(localStorage.getItem('fingerprint_tracking') || '{}');
        if (!prints[fingerprint]) prints[fingerprint] = [];
        prints[fingerprint].push({ timestamp: Date.now() });
        localStorage.setItem('fingerprint_tracking', JSON.stringify(prints));
    }
    
    /**
     * Hash object for fingerprinting
     */
    async hashObject(obj) {
        const str = JSON.stringify(obj);
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    /**
     * Track user behavior (call these in your app)
     */
    trackMouseMovement(event) {
        const data = JSON.parse(localStorage.getItem('mouse_tracking') || '[]');
        data.push({ x: event.clientX, y: event.clientY, t: Date.now() });
        if (data.length > 100) data.shift();
        localStorage.setItem('mouse_tracking', JSON.stringify(data));
    }
    
    trackKeyboard(event) {
        const data = JSON.parse(localStorage.getItem('keyboard_timing') || '[]');
        data.push({ key: event.key, t: Date.now() });
        if (data.length > 50) data.shift();
        localStorage.setItem('keyboard_timing', JSON.stringify(data));
    }
    
    trackInteraction() {
        const count = parseInt(localStorage.getItem('interaction_count') || '0');
        localStorage.setItem('interaction_count', (count + 1).toString());
    }
    
    /**
     * Initialize session tracking
     */
    initSessionTracking() {
        if (!localStorage.getItem('session_start')) {
            localStorage.setItem('session_start', Date.now().toString());
        }
        
        // Track mouse movements
        document.addEventListener('mousemove', (e) => this.trackMouseMovement(e));
        
        // Track keyboard
        document.addEventListener('keydown', (e) => this.trackKeyboard(e));
        
        // Track interactions
        document.addEventListener('click', () => this.trackInteraction());
    }
}

// Initialize global security system
window.securitySystem = new GemBotSecuritySystem();
window.securitySystem.initSessionTracking();

console.log('✅ Anti-Fraud Security System loaded');
