/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAYPAL MACHINE LICENSING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Handles $4200 machine licensing payments via PayPal
 * Contact: BarbrickDesign@gmail.com for payment and activation
 * 
 * PayPal SDK:
 * - Primary SDK should be loaded via script tag in HTML
 * - Fallback SDK automatically loaded by paypal-sdk-loader.js if primary fails
 * - Fallback uses: client-id=BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg
 * 
 * Payment Process:
 * 1. Customer sends $4200 to BarbrickDesign@gmail.com via PayPal
 * 2. Customer receives transaction ID
 * 3. Customer contacts BarbrickDesign@gmail.com with transaction ID
 * 4. Ryan Barbrick verifies payment and activates license
 * 5. Customer receives license key and access link
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.PayPalMachineLicensing = {
    version: '1.0.0',
    
    // Configuration
    config: {
        paypalEmail: 'BarbrickDesign@gmail.com',
        licensePrice: 4200, // USD
        licenseDuration: 'lifetime', // or 'monthly' for subscription
        contactEmail: 'BarbrickDesign@gmail.com',
        supportEmail: 'BarbrickDesign@gmail.com'
    },
    
    // License database (in production, this would be server-side)
    licenses: {},
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LICENSE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate a unique license key
     */
    async generateLicenseKey(customerEmail, transactionId) {
        const timestamp = Date.now();
        const hash = await this.generateSecureHash(customerEmail + transactionId + timestamp);
        return `GBMI-${hash.substring(0, 4)}-${hash.substring(4, 4)}-${hash.substring(8, 4)}`.toUpperCase();
    },
    
    /**
     * Cryptographic hash function for license key generation
     * Note: In production, use server-side crypto for enhanced security
     */
    async generateSecureHash(str) {
        // Use Web Crypto API for cryptographically secure hashing
        const encoder = new TextEncoder();
        const data = encoder.encode(str + Date.now() + Math.random());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex.substring(0, 12); // Use substring instead of deprecated substr
    },
    
    /**
     * Create a new license record (admin only)
     */
    async createLicense(customerData) {
        console.log('🔑 Creating new machine license...');
        
        const license = {
            licenseKey: this.generateLicenseKey(customerData.email, customerData.transactionId),
            customerName: customerData.name,
            customerEmail: customerData.email,
            transactionId: customerData.transactionId,
            paymentAmount: this.config.licensePrice,
            paymentDate: new Date().toISOString(),
            activatedDate: new Date().toISOString(),
            expiryDate: null, // Lifetime license
            status: 'active',
            machineId: null, // Will be set when machine connects
            machineFingerprint: null,
            usageCount: 0,
            lastUsed: null,
            features: {
                machineIntegration: true,
                merlinAI: true,
                customControls: true,
                backupRestore: true,
                prioritySupport: true
            },
            metadata: {
                createdBy: 'admin',
                createdAt: new Date().toISOString(),
                notes: ''
            }
        };
        
        // Store license
        this.licenses[license.licenseKey] = license;
        this.saveLicenses();
        
        console.log('✅ License created:', license.licenseKey);
        
        return license;
    },
    
    /**
     * Verify a license key
     */
    async verifyLicense(licenseKey) {
        console.log('🔍 Verifying license:', licenseKey);
        
        // Load licenses from storage
        this.loadLicenses();
        
        const license = this.licenses[licenseKey];
        
        if (!license) {
            return {
                valid: false,
                message: 'License key not found'
            };
        }
        
        if (license.status !== 'active') {
            return {
                valid: false,
                message: `License is ${license.status}`
            };
        }
        
        if (license.expiryDate && new Date(license.expiryDate) < new Date()) {
            return {
                valid: false,
                message: 'License has expired'
            };
        }
        
        // Update usage
        license.usageCount++;
        license.lastUsed = new Date().toISOString();
        this.saveLicenses();
        
        return {
            valid: true,
            license: license,
            message: 'License is valid and active'
        };
    },
    
    /**
     * Link license to a specific machine
     */
    async linkMachine(licenseKey, machineFingerprint) {
        console.log('🔗 Linking machine to license...');
        
        const verification = await this.verifyLicense(licenseKey);
        
        if (!verification.valid) {
            throw new Error(verification.message);
        }
        
        const license = this.licenses[licenseKey];
        
        // If machine already linked, verify it's the same machine
        if (license.machineFingerprint && license.machineFingerprint !== machineFingerprint) {
            throw new Error('License is already linked to a different machine. Contact support to transfer.');
        }
        
        // Link machine
        license.machineFingerprint = machineFingerprint;
        license.machineId = machineFingerprint.split('-')[0];
        this.saveLicenses();
        
        console.log('✅ Machine linked successfully');
        
        return true;
    },
    
    /**
     * Generate machine fingerprint
     * Note: This is a basic fingerprint for tracking purposes only.
     * In production, combine with server-side validation for license enforcement.
     * Users are notified that fingerprints are for single-machine licensing.
     */
    async generateMachineFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            navigator.hardwareConcurrency,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            navigator.platform,
            navigator.maxTouchPoints
        ];
        
        const fingerprint = await this.generateSecureHash(components.join('|'));
        return `MACHINE-${fingerprint.substring(0, 12)}`;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PAYMENT VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Submit payment verification request
     */
    async submitPaymentVerification(paymentData) {
        console.log('💳 Submitting payment verification...');
        
        const request = {
            customerName: paymentData.name,
            customerEmail: paymentData.email,
            transactionId: paymentData.transactionId,
            amount: this.config.licensePrice,
            paymentDate: paymentData.date || new Date().toISOString(),
            status: 'pending_verification',
            submittedAt: new Date().toISOString()
        };
        
        // Store pending request
        const pendingKey = `pending_${request.transactionId}`;
        localStorage.setItem(pendingKey, JSON.stringify(request));
        
        // Generate verification email content
        const emailContent = this.generateVerificationEmail(request);
        
        console.log('✅ Payment verification request submitted');
        console.log('📧 Please email the following to:', this.config.contactEmail);
        console.log(emailContent);
        
        return {
            success: true,
            request: request,
            emailContent: emailContent,
            message: `Payment verification submitted. Please email ${this.config.contactEmail} with your transaction details.`
        };
    },
    
    /**
     * Generate email content for payment verification
     */
    generateVerificationEmail(request) {
        return `
Subject: GemBot Machine Integration License - Payment Verification

Dear Ryan Barbrick,

I would like to verify my payment for the GemBot Machine Integration License.

Payment Details:
- Name: ${request.customerName}
- Email: ${request.customerEmail}
- PayPal Transaction ID: ${request.transactionId}
- Amount: $${this.config.licensePrice} USD
- Payment Date: ${new Date(request.paymentDate).toLocaleDateString()}

Please verify my payment and activate my license.

Thank you,
${request.customerName}
${request.customerEmail}
        `.trim();
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS (For Ryan Barbrick)
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Admin: Verify payment and create license (manual verification)
     */
    async adminVerifyPayment(transactionId, customerEmail) {
        console.log('👑 Admin: Verifying payment...');
        
        // Load pending request
        const pendingKey = `pending_${transactionId}`;
        const pending = localStorage.getItem(pendingKey);
        
        if (!pending) {
            throw new Error('Pending payment request not found');
        }
        
        const request = JSON.parse(pending);
        
        // Create license
        const license = await this.createLicense({
            name: request.customerName,
            email: request.customerEmail,
            transactionId: transactionId
        });
        
        // Remove pending request
        localStorage.removeItem(pendingKey);
        
        // Generate activation email
        const activationEmail = this.generateActivationEmail(license);
        
        console.log('✅ Payment verified and license created');
        console.log('📧 Send this activation email to customer:');
        console.log(activationEmail);
        
        return {
            license: license,
            activationEmail: activationEmail
        };
    },
    
    /**
     * Generate activation email for customer
     */
    generateActivationEmail(license) {
        return `
Subject: GemBot Machine Integration License - ACTIVATED

Dear ${license.customerName},

Your GemBot Machine Integration License has been activated!

License Details:
- License Key: ${license.licenseKey}
- Status: Active
- Duration: Lifetime
- Activated: ${new Date(license.activatedDate).toLocaleDateString()}

Features Included:
✅ Third-Party Machine Integration
✅ USB Board Detection & Configuration
✅ Merlin AI Enhancement System
✅ Custom Control Layout Generator
✅ Configuration Backup & Restore
✅ Priority Support

Getting Started:
1. Visit: https://barbrickdesign.github.io/GemBotAiWebControl/
2. Navigate to "Machine Integration" in the menu
3. Enter your license key: ${license.licenseKey}
4. Connect your machine via USB
5. Follow the setup wizard

Documentation:
- Machine Integration Guide: See MACHINE_INTEGRATION_GUIDE.md
- Support Email: ${this.config.supportEmail}

Thank you for choosing GemBot!

Best regards,
Ryan Barbrick
Barbrick Design
${this.config.contactEmail}
        `.trim();
    },
    
    /**
     * Admin: List all licenses
     */
    adminListLicenses() {
        this.loadLicenses();
        return Object.values(this.licenses);
    },
    
    /**
     * Admin: Revoke a license
     */
    adminRevokeLicense(licenseKey, reason) {
        this.loadLicenses();
        
        const license = this.licenses[licenseKey];
        if (!license) {
            throw new Error('License not found');
        }
        
        license.status = 'revoked';
        license.metadata.revokedAt = new Date().toISOString();
        license.metadata.revokeReason = reason;
        
        this.saveLicenses();
        
        console.log('❌ License revoked:', licenseKey);
        
        return license;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STORAGE
    // ═══════════════════════════════════════════════════════════════════════════
    
    saveLicenses() {
        localStorage.setItem('machine_licenses', JSON.stringify(this.licenses));
    },
    
    loadLicenses() {
        const stored = localStorage.getItem('machine_licenses');
        if (stored) {
            try {
                this.licenses = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading licenses:', e);
                this.licenses = {};
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UI HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Create payment instruction panel
     */
    createPaymentUI() {
        const container = document.createElement('div');
        container.className = 'machine-license-payment';
        container.innerHTML = `
            <div style="max-width: 600px; margin: 20px auto; padding: 30px; background: rgba(0,0,0,0.8); border-radius: 15px; border: 2px solid #4af;">
                <h2 style="color: #4af; text-align: center; margin-bottom: 20px;">
                    🔧 GemBot Machine Integration License
                </h2>
                
                <div style="background: rgba(74, 170, 255, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #4af; margin-top: 0;">License Information</h3>
                    <p style="color: #fff; line-height: 1.6;">
                        <strong>Price:</strong> $${this.config.licensePrice} USD<br>
                        <strong>Duration:</strong> Lifetime<br>
                        <strong>Payment Method:</strong> PayPal<br>
                        <strong>PayPal Email:</strong> ${this.config.paypalEmail}
                    </p>
                </div>
                
                <div style="background: rgba(255, 200, 0, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #fc0; margin-top: 0;">📦 What's Included</h3>
                    <ul style="color: #fff; line-height: 1.8;">
                        <li>✅ USB Board Detection & Identification</li>
                        <li>✅ Motor Configuration Analysis</li>
                        <li>✅ Dynamic Control Layout Generator</li>
                        <li>✅ Merlin AI Enhancement System</li>
                        <li>✅ Configuration Backup & Restore</li>
                        <li>✅ Priority Support Access</li>
                        <li>✅ Lifetime Updates</li>
                    </ul>
                </div>
                
                <div style="background: rgba(0, 255, 100, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #0f0; margin-top: 0;">💳 Payment Instructions</h3>
                    <ol style="color: #fff; line-height: 1.8;">
                        <li>Send <strong>$${this.config.licensePrice} USD</strong> to <strong>${this.config.paypalEmail}</strong> via PayPal</li>
                        <li>Include "GemBot Machine License" in the payment note</li>
                        <li>Save your PayPal transaction ID</li>
                        <li>Fill out the verification form below</li>
                        <li>Email the verification to ${this.config.contactEmail}</li>
                        <li>Receive your license key within 24 hours</li>
                    </ol>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px;">
                    <h3 style="color: #4af; margin-top: 0;">✍️ Verification Form</h3>
                    <form id="licenseVerificationForm" style="color: #fff;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Your Name:</label>
                            <input type="text" id="customerName" required 
                                   style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #4af; background: rgba(0,0,0,0.5); color: #fff;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Your Email:</label>
                            <input type="email" id="customerEmail" required 
                                   style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #4af; background: rgba(0,0,0,0.5); color: #fff;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">PayPal Transaction ID:</label>
                            <input type="text" id="transactionId" required 
                                   style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #4af; background: rgba(0,0,0,0.5); color: #fff;">
                        </div>
                        <button type="submit" 
                                style="width: 100%; padding: 15px; background: linear-gradient(135deg, #4af, #06f); border: none; border-radius: 10px; color: #fff; font-size: 16px; font-weight: bold; cursor: pointer;">
                            📧 Generate Verification Email
                        </button>
                    </form>
                </div>
                
                <div id="verificationResult" style="margin-top: 20px; padding: 15px; border-radius: 10px; display: none;"></div>
            </div>
        `;
        
        // Setup form handler
        const form = container.querySelector('#licenseVerificationForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('customerName').value;
            const email = document.getElementById('customerEmail').value;
            const transactionId = document.getElementById('transactionId').value;
            
            const result = await this.submitPaymentVerification({
                name, email, transactionId
            });
            
            const resultDiv = container.querySelector('#verificationResult');
            resultDiv.style.display = 'block';
            resultDiv.style.background = 'rgba(0, 255, 100, 0.2)';
            resultDiv.style.border = '2px solid #0f0';
            resultDiv.style.color = '#fff';
            resultDiv.innerHTML = `
                <h4 style="color: #0f0; margin-top: 0;">✅ Verification Email Generated</h4>
                <p>Copy the text below and email it to: <strong>${this.config.contactEmail}</strong></p>
                <textarea readonly style="width: 100%; height: 300px; padding: 10px; background: rgba(0,0,0,0.7); color: #0f0; border: 1px solid #0f0; border-radius: 5px; font-family: monospace; font-size: 12px;">${result.emailContent}</textarea>
                <button onclick="navigator.clipboard.writeText(this.previousElementSibling.value)" 
                        style="margin-top: 10px; padding: 10px 20px; background: #0f0; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    📋 Copy to Clipboard
                </button>
            `;
        });
        
        return container;
    }
};

// Make available globally
console.log('💳 PayPal Machine Licensing System loaded');
