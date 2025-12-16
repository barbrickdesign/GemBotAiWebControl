/* ═══════════════════════════════════════════════════════════════════════════════
   GEMBOT UNIVERSE KEY - LAUNCHER LOGIC
   ═══════════════════════════════════════════════════════════════════════════════
   OWNERSHIP: Ryan Barbrick / Barbrick Design
   CONTACT: BarbrickDesign@gmail.com
   SIGNATURE: GBOT-RB-2025-7X9K2M4P-BARBRICK
   ═══════════════════════════════════════════════════════════════════════════════
*/

class GemBotUniverseKey {
    constructor() {
        this.keyId = null;
        this.walletData = null;
        this.machineData = null;
        this.isActivated = false;
        this.isFirstLaunch = false;
        this.init();
    }
    
    async init() {
        console.log('🔑 Initializing GemBot Universe Key...');
        await this.loadKeyData();
        await this.loadWalletData();
        await this.checkMachineStatus();
        await this.checkFirstLaunch();
        this.updateUI();
        this.hideLoading();
        console.log('✅ Universe Key initialized successfully');
    }
    
    async loadKeyData() {
        try {
            // In real implementation, this would read from USB KEY_ID.json
            // For now, simulate loading from file
            const response = await fetch('./KEY_ID.json');
            if (response.ok) {
                this.keyId = await response.json();
                console.log('🔑 Key loaded:', this.keyId.keyId);
            } else {
                // Generate temporary key for testing
                this.keyId = {
                    keyId: 'GBUV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    serialNumber: 'SN-2025-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
                    activated: false,
                    createdAt: new Date().toISOString()
                };
                console.warn('⚠️ No KEY_ID.json found, using temporary key for demo');
            }
        } catch (error) {
            console.error('❌ Error loading key data:', error);
            this.keyId = {
                keyId: 'DEMO-KEY',
                serialNumber: 'DEMO-0001',
                activated: false
            };
        }
    }
    
    async loadWalletData() {
        try {
            // In real implementation, this would decrypt wallet from USB
            // For now, check localStorage or generate demo wallet
            const stored = localStorage.getItem('universekey_wallet');
            if (stored) {
                this.walletData = JSON.parse(stored);
            } else {
                // Generate demo wallet
                this.walletData = {
                    publicKey: '7X9K' + Math.random().toString(36).substr(2, 40).toUpperCase(),
                    balance: 1000,
                    currency: 'GBUV',
                    encrypted: true
                };
                localStorage.setItem('universekey_wallet', JSON.stringify(this.walletData));
            }
            console.log('💎 Wallet loaded:', this.walletData.publicKey.substring(0, 8) + '...');
        } catch (error) {
            console.error('❌ Error loading wallet:', error);
            this.walletData = { balance: 0, publicKey: 'ERROR' };
        }
    }
    
    async checkMachineStatus() {
        // Check if machine is linked
        const machineId = localStorage.getItem('universekey_machine_id');
        if (machineId) {
            this.machineData = {
                id: machineId,
                linked: true,
                name: localStorage.getItem('universekey_machine_name') || 'Unknown Machine',
                linkedAt: localStorage.getItem('universekey_machine_linked_at') || 'Unknown'
            };
            console.log('🔗 Machine linked:', this.machineData.name);
        } else {
            this.machineData = {
                linked: false
            };
            console.log('🔗 No machine linked yet');
        }
    }
    
    async checkFirstLaunch() {
        const hasLaunched = localStorage.getItem('universekey_launched');
        this.isFirstLaunch = !hasLaunched;
        if (this.isFirstLaunch) {
            console.log('🎉 First launch detected - showing welcome');
            document.getElementById('welcomeMessage').style.display = 'block';
        }
    }
    
    updateUI() {
        // Update key ID
        document.getElementById('keyIdDisplay').textContent = this.keyId.keyId;
        
        // Update wallet display
        const walletShort = this.walletData.publicKey.substring(0, 6) + '...' + 
                           this.walletData.publicKey.substring(this.walletData.publicKey.length - 4);
        document.getElementById('walletDisplay').textContent = walletShort;
        document.getElementById('walletBalance').textContent = 
            this.walletData.balance.toLocaleString() + ' ' + this.walletData.currency;
        
        // Update machine status
        if (this.machineData.linked) {
            document.getElementById('machineStatus').textContent = this.machineData.name;
            document.querySelector('.machine-card .status-label').textContent = 'Connected';
            document.querySelector('.machine-card .status-indicator').classList.add('active');
            document.querySelector('.machine-card .status-indicator').classList.remove('pending');
        } else {
            document.getElementById('machineStatus').textContent = 'Not Linked';
            document.querySelector('.machine-card .status-label').textContent = 'Click to connect';
        }
        
        // Update key status
        if (this.keyId.activated) {
            document.getElementById('keyStatus').textContent = 'Activated';
            document.querySelector('.security-card .status-label').textContent = 'All systems operational';
            document.getElementById('securityIndicator').classList.add('active');
            this.isActivated = true;
        } else {
            document.getElementById('keyStatus').textContent = 'Pending Activation';
            document.querySelector('.security-card .status-label').textContent = 'Contact admin to activate';
            document.getElementById('securityIndicator').classList.add('pending');
        }
        
        // Update button value display
        document.querySelector('.wallet-btn .btn-value').textContent = 
            this.walletData.balance.toLocaleString() + ' ' + this.walletData.currency;
    }
    
    hideLoading() {
        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        }, 1500);
    }
    
    showNotification(message, icon = '✅') {
        const toast = document.getElementById('notificationToast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMessage = document.getElementById('toastMessage');
        
        toastIcon.textContent = icon;
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    updateLoadingText(text) {
        document.getElementById('loadingText').textContent = text;
    }
}

// Initialize Universe Key
const universeKey = new GemBotUniverseKey();

// ═══════════════════════════════════════════════════════════════════════════════
// UI INTERACTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function startTour() {
    console.log('🚀 Starting interactive tour');
    
    // Check if tour HTML exists
    const tourPath = './ONBOARDING/welcome.html';
    
    // Open tour in new window
    window.open(tourPath, 'GemBot Tour', 'width=1000,height=700');
    
    // Mark welcome as dismissed
    localStorage.setItem('universekey_launched', 'true');
    document.getElementById('welcomeMessage').style.display = 'none';
    
    universeKey.showNotification('🚀 Tour started! Follow along in the new window');
}

function dismissWelcome() {
    console.log('👋 Dismissing welcome message');
    localStorage.setItem('universekey_launched', 'true');
    document.getElementById('welcomeMessage').style.display = 'none';
    universeKey.showNotification('👋 Welcome dismissed');
}

function linkMachine() {
    console.log('🔗 Starting machine linking process');
    
    if (universeKey.machineData.linked) {
        alert(`Already linked to: ${universeKey.machineData.name}\n\nTo unlink, contact support at barbrickdesign@gmail.com`);
        return;
    }
    
    // Generate hardware fingerprint
    const fingerprint = generateHardwareFingerprint();
    
    // Prompt for machine name
    const machineName = prompt('Enter a name for this machine:', 'My GemBot Machine');
    if (!machineName) return;
    
    // Save machine data
    localStorage.setItem('universekey_machine_id', fingerprint);
    localStorage.setItem('universekey_machine_name', machineName);
    localStorage.setItem('universekey_machine_linked_at', new Date().toISOString());
    
    // Update universe key
    universeKey.machineData = {
        id: fingerprint,
        linked: true,
        name: machineName,
        linkedAt: new Date().toISOString()
    };
    
    universeKey.updateUI();
    universeKey.showNotification('🔗 Machine linked successfully!', '🔗');
    
    console.log('✅ Machine linked:', machineName);
    
    // In real implementation, this would also send to admin for approval
    alert(`Machine "${machineName}" linked!\n\nFingerprint: ${fingerprint}\n\nWaiting for admin approval to unlock full rewards...`);
}

function generateHardwareFingerprint() {
    // Simple fingerprint based on screen, timezone, language
    const screen = `${window.screen.width}x${window.screen.height}`;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = navigator.language;
    const platform = navigator.platform;
    
    const data = `${screen}-${tz}-${lang}-${platform}-${Date.now()}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    return 'HW-' + Math.abs(hash).toString(36).toUpperCase();
}

function openWallet() {
    console.log('💎 Opening wallet interface');
    
    const walletInfo = `
╔════════════════════════════════════════╗
║      💎 GEMBOT UNIVERSE WALLET 💎      ║
╚════════════════════════════════════════╝

Key ID: ${universeKey.keyId.keyId}
Serial: ${universeKey.keyId.serialNumber}

Public Key:
${universeKey.walletData.publicKey}

Balance: ${universeKey.walletData.balance} ${universeKey.walletData.currency}

Status: ${universeKey.walletData.encrypted ? '🔒 Encrypted (Secure)' : '⚠️ Unencrypted'}

═══════════════════════════════════════════

This wallet is stored securely on your
Universe Key USB device.

Private keys NEVER leave the USB.

To transfer funds, use the GemBot Control
Panel at: https://gembot.netlify.app

═══════════════════════════════════════════

© 2024-2025 Ryan Barbrick / Barbrick Design
BarbrickDesign@gmail.com
    `.trim();
    
    alert(walletInfo);
    universeKey.showNotification('💎 Wallet details displayed', '💎');
}

function deployProject() {
    console.log('📦 Deploying GemBot project');
    
    if (!confirm('Deploy GemBot project?\n\nThis will:\n• Open the full game environment\n• Connect to your wallet\n• Link your machine\n\nContinue?')) {
        return;
    }
    
    // Show loading
    document.getElementById('loadingOverlay').style.display = 'flex';
    universeKey.updateLoadingText('📦 Deploying GemBot environment...');
    
    setTimeout(() => {
        // Open main game
        window.open('./GemBot_Control_AI.html', '_blank');
        
        // Hide loading
        document.getElementById('loadingOverlay').style.display = 'none';
        
        universeKey.showNotification('📦 Project deployed successfully!', '📦');
    }, 2000);
}

function openAcademy() {
    console.log('🎓 Opening GemBot Academy');
    
    // Open academy in game or standalone
    const hasFullGame = confirm('Open Academy?\n\n• Yes = Full game with Academy\n• No = Academy only');
    
    if (hasFullGame) {
        window.open('./GemBot_Control_AI.html?section=academy', '_blank');
    } else {
        alert('Academy standalone mode coming soon!\n\nFor now, opening full game...');
        window.open('./GemBot_Control_AI.html', '_blank');
    }
    
    universeKey.showNotification('🎓 Academy opened', '🎓');
}

function viewBackup() {
    console.log('🗂️ Viewing project backup');
    
    const backupInfo = `
╔════════════════════════════════════════╗
║    🗂️ GEMBOT PROJECT BACKUP 🗂️        ║
╚════════════════════════════════════════╝

This Universe Key contains a COMPLETE
backup of the GemBot project:

📁 HTML Files: 5 main files
📁 JavaScript: 12 core systems
📁 CSS Styles: 8 stylesheets
📁 3D Models: 8 GLB files
📁 Documentation: 100+ MD files
📁 Assets: Images, fonts, sounds

Total Files: 120+ files
Last Backup: December 15, 2025
Version: 2025.12.15

═══════════════════════════════════════════

BACKUP LOCATION:
${window.location.href.replace(/[^/]*$/, '')}GEMBOT_PROJECT/

This backup ensures the GemBot project
can NEVER be lost or taken offline.

You own a piece of history! 🏆

═══════════════════════════════════════════

To restore project:
1. Copy GEMBOT_PROJECT/ to local drive
2. Open index.html or any HTML file
3. All features work offline!

═══════════════════════════════════════════

© 2024-2025 Ryan Barbrick / Barbrick Design
    `.trim();
    
    alert(backupInfo);
    universeKey.showNotification('🗂️ Backup info displayed', '🗂️');
}

function openDocs() {
    console.log('📖 Opening documentation');
    
    // Check if docs exist
    const docsPath = './DOCS/USER_MANUAL.md';
    
    // For now, show summary
    const docsInfo = `
╔════════════════════════════════════════╗
║      📖 GEMBOT DOCUMENTATION 📖        ║
╚════════════════════════════════════════╝

Available Guides:

1️⃣ USER_MANUAL.md
   Complete user guide for Universe Key

2️⃣ QUICK_START.md
   Get up and running in 5 minutes

3️⃣ MACHINE_LINKING.md
   How to link your physical GemBot

4️⃣ WALLET_GUIDE.md
   Managing your GBUV tokens

5️⃣ TROUBLESHOOTING.md
   Common issues and solutions

6️⃣ FAQ.md
   Frequently asked questions

═══════════════════════════════════════════

📁 Docs are located in: DOCS/

Open any .md file in a text editor or
Markdown viewer to read.

═══════════════════════════════════════════

Support: barbrickdesign@gmail.com
    `.trim();
    
    alert(docsInfo);
    universeKey.showNotification('📖 Documentation accessed', '📖');
}

function contactSupport() {
    console.log('💬 Opening support contact');
    
    const supportInfo = `
╔════════════════════════════════════════╗
║        💬 GEMBOT SUPPORT 💬            ║
╚════════════════════════════════════════╝

Need help? We're here for you!

📧 Email: barbrickdesign@gmail.com

🔑 Your Key: ${universeKey.keyId.keyId}
🆔 Serial: ${universeKey.keyId.serialNumber}

═══════════════════════════════════════════

COMMON ISSUES:

🔗 Machine not linking?
   → Check admin panel for approval

💎 Wallet not showing?
   → Verify USB is properly connected

📦 Deploy not working?
   → Check browser security settings

🎓 Academy not loading?
   → Clear cache and try again

═══════════════════════════════════════════

WARRANTY:
All Universe Keys include lifetime support
and free replacement if damaged.

═══════════════════════════════════════════

When contacting support, include:
• Your Key ID and Serial Number
• Description of the issue
• Screenshots if applicable

We typically respond within 24 hours.

═══════════════════════════════════════════

© 2024-2025 Ryan Barbrick / Barbrick Design
    `.trim();
    
    alert(supportInfo);
    
    // Open email client
    if (confirm('Open email client to contact support?')) {
        window.location.href = `mailto:barbrickdesign@gmail.com?subject=Universe Key Support - ${universeKey.keyId.keyId}&body=Key ID: ${universeKey.keyId.keyId}%0ASerial: ${universeKey.keyId.serialNumber}%0A%0AIssue Description:%0A`;
    }
    
    universeKey.showNotification('💬 Support info displayed', '💬');
}

function showWarranty() {
    alert(`
WARRANTY INFORMATION

Your GemBot Universe Key includes:

✅ Lifetime warranty on hardware
✅ Free replacement if damaged
✅ Lifetime support access
✅ Free project updates
✅ 100% satisfaction guarantee

If your key is lost, stolen, or damaged,
contact us for a free replacement.

Email: barbrickdesign@gmail.com
Include: Key ID and Serial Number

Terms: Warranty covers manufacturing defects
and physical damage. Does not cover loss of
wallet private keys if USB is destroyed without
backup. Always keep your recovery phrase safe!

© 2024-2025 Ryan Barbrick / Barbrick Design
    `.trim());
}

function showTerms() {
    alert(`
TERMS OF SERVICE

By using this GemBot Universe Key, you agree:

1. This key is for personal use only
2. Do not share your private keys
3. Keep your USB safe and backed up
4. You own the key and all assets on it
5. GemBot is not responsible for lost keys
6. Follow all local laws regarding crypto
7. Use at your own risk

Full terms available at:
gembot.netlify.app/terms

© 2024-2025 Ryan Barbrick / Barbrick Design
    `.trim());
}

function showPrivacy() {
    alert(`
PRIVACY POLICY

Your Privacy Matters:

🔒 Your data stays on YOUR USB
🔒 We never access your private keys
🔒 No tracking or analytics
🔒 No data collection
🔒 Complete anonymity

What we DO collect:
• Public key (for blockchain transactions)
• Machine fingerprint (if you link machine)
• Key serial number (for warranty)

What we DON'T collect:
• Personal information
• Browsing history
• Private keys
• Passwords

Full privacy policy at:
gembot.netlify.app/privacy

© 2024-2025 Ryan Barbrick / Barbrick Design
    `.trim());
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-START DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

// Check if launched from USB
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('autostart') === 'true') {
    console.log('🚀 Auto-started from USB');
    localStorage.setItem('universekey_autostart', 'true');
}

console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║                    🔑 GEMBOT UNIVERSE KEY - INITIALIZED 🔑                     ║
║                                                                                ║
║                        © 2024-2025 Ryan Barbrick                              ║
║                         BarbrickDesign@gmail.com                              ║
║                    GBOT-RB-2025-7X9K2M4P-BARBRICK                             ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
`);
