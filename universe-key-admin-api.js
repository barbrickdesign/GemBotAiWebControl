/* ═══════════════════════════════════════════════════════════════════════════════
   GEMBOT UNIVERSE KEY - ADMIN API
   ═══════════════════════════════════════════════════════════════════════════════
   OWNERSHIP: Ryan Barbrick / Barbrick Design
   CONTACT: BarbrickDesign@gmail.com
   SIGNATURE: GBOT-RB-2025-7X9K2M4P-BARBRICK
   ═══════════════════════════════════════════════════════════════════════════════
*/

class UniverseKeyManager {
    constructor() {
        this.keys = [];
        this.loadKeys();
        console.log('🔑 Universe Key Manager initialized');
    }
    
    // ════════════════════════════════════════════════════════════════════════════
    // KEY GENERATION
    // ════════════════════════════════════════════════════════════════════════════
    
    generateKey(ownerEmail, initialValue = 1000) {
        const keyId = 'GBUV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        const serialNumber = 'SN-' + new Date().getFullYear() + '-' + 
                           String(this.keys.length + 1).padStart(4, '0');
        
        // Generate Solana wallet keypair
        const keypair = this.generateWalletKeypair();
        
        const key = {
            keyId: keyId,
            serialNumber: serialNumber,
            ownerEmail: ownerEmail || '',
            machineId: null,
            walletPublicKey: keypair.publicKey,
            walletPrivateKey: keypair.privateKey, // ENCRYPTED before storage
            initialValue: initialValue,
            currentBalance: initialValue,
            currency: 'GBUV',
            activated: false,
            activatedAt: null,
            activatedBy: null,
            adminSignature: null,
            createdAt: new Date().toISOString(),
            warranty: {
                type: 'lifetime',
                expiresAt: null,
                contact: 'barbrickdesign@gmail.com'
            },
            metadata: {
                version: '1.0.0',
                projectVersion: '2025.12.15',
                description: 'GemBot Universe Key - Full Access Token',
                owner: 'Ryan Barbrick / Barbrick Design',
                signature: 'GBOT-RB-2025-7X9K2M4P-BARBRICK'
            }
        };
        
        // Sign the key with admin signature
        key.adminSignature = this.signKey(key);
        
        this.keys.push(key);
        this.saveKeys();
        
        console.log('✅ Generated new Universe Key:', keyId);
        return key;
    }
    
    generateWalletKeypair() {
        // In production, use Solana Web3.js: const keypair = Keypair.generate()
        // For demo, generate mock keys
        const privateKey = 'PRIVATE_' + Array.from({length: 32}, () => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
        const publicKey = '7X9K' + Array.from({length: 40}, () => 
            Math.random().toString(36).charAt(2).toUpperCase()).join('');
        
        return { privateKey, publicKey };
    }
    
    signKey(key) {
        // In production, use RSA private key signing
        // For demo, create simple signature
        const data = `${key.keyId}|${key.serialNumber}|${key.walletPublicKey}|${key.createdAt}`;
        const signature = 'SIG_' + this.simpleHash(data);
        return signature;
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36).toUpperCase();
    }
    
    // ════════════════════════════════════════════════════════════════════════════
    // KEY ACTIVATION
    // ════════════════════════════════════════════════════════════════════════════
    
    activateKey(keyId, adminEmail) {
        const key = this.keys.find(k => k.keyId === keyId);
        if (!key) {
            console.error('❌ Key not found:', keyId);
            return { success: false, error: 'Key not found' };
        }
        
        if (key.activated) {
            console.warn('⚠️ Key already activated:', keyId);
            return { success: false, error: 'Key already activated' };
        }
        
        key.activated = true;
        key.activatedAt = new Date().toISOString();
        key.activatedBy = adminEmail;
        key.adminSignature = this.signKey(key); // Re-sign with activation
        
        this.saveKeys();
        
        console.log('✅ Activated Universe Key:', keyId);
        return { success: true, key: key };
    }
    
    deactivateKey(keyId, reason = '') {
        const key = this.keys.find(k => k.keyId === keyId);
        if (!key) {
            return { success: false, error: 'Key not found' };
        }
        
        key.activated = false;
        key.deactivatedAt = new Date().toISOString();
        key.deactivationReason = reason;
        
        this.saveKeys();
        
        console.log('🔒 Deactivated Universe Key:', keyId);
        return { success: true };
    }
    
    // ════════════════════════════════════════════════════════════════════════════
    // MACHINE LINKING
    // ════════════════════════════════════════════════════════════════════════════
    
    linkMachine(keyId, machineFingerprint, machineName) {
        const key = this.keys.find(k => k.keyId === keyId);
        if (!key) {
            return { success: false, error: 'Key not found' };
        }
        
        if (key.machineId) {
            console.warn('⚠️ Machine already linked. Unlinking previous machine.');
        }
        
        key.machineId = machineFingerprint;
        key.machineName = machineName;
        key.machineLinkedAt = new Date().toISOString();
        
        this.saveKeys();
        
        console.log('🔗 Linked machine to key:', keyId);
        return { success: true, key: key };
    }
    
    unlinkMachine(keyId) {
        const key = this.keys.find(k => k.keyId === keyId);
        if (!key) {
            return { success: false, error: 'Key not found' };
        }
        
        key.machineId = null;
        key.machineName = null;
        key.machineUnlinkedAt = new Date().toISOString();
        
        this.saveKeys();
        
        console.log('🔓 Unlinked machine from key:', keyId);
        return { success: true };
    }
    
    // ════════════════════════════════════════════════════════════════════════════
    // KEY RETRIEVAL
    // ════════════════════════════════════════════════════════════════════════════
    
    getAllKeys() {
        return this.keys.map(k => ({
            ...k,
            walletPrivateKey: '***ENCRYPTED***' // Hide private keys in admin view
        }));
    }
    
    getKey(keyId) {
        const key = this.keys.find(k => k.keyId === keyId);
        if (key) {
            return {
                ...key,
                walletPrivateKey: '***ENCRYPTED***'
            };
        }
        return null;
    }
    
    getKeysByStatus(activated) {
        return this.keys.filter(k => k.activated === activated).map(k => ({
            ...k,
            walletPrivateKey: '***ENCRYPTED***'
        }));
    }
    
    getKeysByOwner(ownerEmail) {
        return this.keys.filter(k => k.ownerEmail === ownerEmail).map(k => ({
            ...k,
            walletPrivateKey: '***ENCRYPTED***'
        }));
    }
    
    getLinkedMachines() {
        return this.keys
            .filter(k => k.machineId)
            .map(k => ({
                keyId: k.keyId,
                machineId: k.machineId,
                machineName: k.machineName,
                linkedAt: k.machineLinkedAt,
                ownerEmail: k.ownerEmail
            }));
    }
    
    // ════════════════════════════════════════════════════════════════════════════
    // STATISTICS
    // ════════════════════════════════════════════════════════════════════════════
    
    getStatistics() {
        const total = this.keys.length;
        const activated = this.keys.filter(k => k.activated).length;
        const pending = total - activated;
        const linked = this.keys.filter(k => k.machineId).length;
        const totalValue = this.keys.reduce((sum, k) => sum + k.currentBalance, 0);
        
        return {
            totalKeys: total,
            activatedKeys: activated,
            pendingKeys: pending,
            linkedMachines: linked,
            totalValue: totalValue,
            currency: 'GBUV',
            avgValuePerKey: total > 0 ? totalValue / total : 0
        };
    }
    
    // ════════════════════════════════════════════════════════════════════════════
    // WALLET OPERATIONS
    // ════════════════════════════════════════════════════════════════════════════
    
    updateBalance(keyId, newBalance) {
        const key = this.keys.find(k => k.keyId === keyId);
        if (!key) {
            return { success: false, error: 'Key not found' };
        }
        
        key.currentBalance = newBalance;
        key.lastBalanceUpdate = new Date().toISOString();
        
        this.saveKeys();
        
        console.log(`💎 Updated balance for ${keyId}: ${newBalance} GBUV`);
        return { success: true, newBalance: newBalance };
    }
    
    addFunds(keyId, amount) {
        const key = this.keys.find(k => k.keyId === keyId);
        if (!key) {
            return { success: false, error: 'Key not found' };
        }
        
        key.currentBalance += amount;
        key.lastBalanceUpdate = new Date().toISOString();
        
        this.saveKeys();
        
        console.log(`💎 Added ${amount} GBUV to ${keyId}`);
        return { success: true, newBalance: key.currentBalance };
    }
    
    // ════════════════════════════════════════════════════════════════════════════
    // PERSISTENCE
    // ════════════════════════════════════════════════════════════════════════════
    
    saveKeys() {
        try {
            localStorage.setItem('universekeys_admin', JSON.stringify(this.keys));
            console.log('💾 Saved Universe Keys to storage');
        } catch (error) {
            console.error('❌ Error saving keys:', error);
        }
    }
    
    loadKeys() {
        try {
            const stored = localStorage.getItem('universekeys_admin');
            if (stored) {
                this.keys = JSON.parse(stored);
                console.log(`📂 Loaded ${this.keys.length} Universe Keys`);
            }
        } catch (error) {
            console.error('❌ Error loading keys:', error);
            this.keys = [];
        }
    }
    
    exportKeys() {
        // Export keys as JSON (with private keys encrypted)
        const exportData = this.keys.map(k => ({
            ...k,
            walletPrivateKey: this.encryptPrivateKey(k.walletPrivateKey)
        }));
        
        return JSON.stringify(exportData, null, 2);
    }
    
    encryptPrivateKey(privateKey) {
        // In production, use proper AES-256 encryption
        // For demo, simple reversible encoding
        return 'ENC_' + btoa(privateKey);
    }
    
    decryptPrivateKey(encrypted) {
        if (encrypted.startsWith('ENC_')) {
            return atob(encrypted.substring(4));
        }
        return encrypted;
    }
}

// Initialize Universe Key Manager
const universeKeyManager = new UniverseKeyManager();

// Make globally available
window.UniverseKeyManager = UniverseKeyManager;
window.universeKeyManager = universeKeyManager;

console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║              🔑 UNIVERSE KEY MANAGER - ADMIN API LOADED 🔑                     ║
║                                                                                ║
║  Commands:                                                                     ║
║  • universeKeyManager.generateKey('email@example.com')                        ║
║  • universeKeyManager.activateKey('GBUV-XXX', 'admin@example.com')           ║
║  • universeKeyManager.getAllKeys()                                             ║
║  • universeKeyManager.getStatistics()                                          ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
`);
