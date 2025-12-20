/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAYPAL CONFIGURATION - CENTRALIZED
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Centralized PayPal configuration for all GemBot integrations
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * Copyright: © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.PayPalConfig = {
    version: '1.0.0',
    
    // Primary PayPal Client ID - Used for all PayPal integrations
    primaryClientId: 'Ae5p9t_umXWYHWQuvxEiIb_DNYJUMQgC0NFCjPkIGnliAVW-0lOJRQw3niXh8NIkEkB0HaNbfMFkbSkZ',
    
    // Fallback PayPal Client ID - Used when primary API fails
    fallbackClientId: 'BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg',
    
    // PayPal Email for direct payments
    paypalEmail: 'BarbrickDesign@gmail.com',
    
    // Currency
    currency: 'USD',
    
    // SDK Components
    components: {
        primary: '', // Default components
        fallback: 'hosted-buttons' // Components for fallback
    },
    
    // Funding options
    funding: {
        primary: {
            disable: 'credit,card' // Disable credit cards on primary
        },
        fallback: {
            enable: 'venmo' // Enable Venmo on fallback
        }
    },
    
    /**
     * Get Primary PayPal SDK URL
     */
    getPrimarySDKUrl() {
        const params = new URLSearchParams({
            'client-id': this.primaryClientId,
            'currency': this.currency
        });
        
        if (this.funding.primary.disable) {
            params.set('disable-funding', this.funding.primary.disable);
        }
        
        return `https://www.paypal.com/sdk/js?${params.toString()}`;
    },
    
    /**
     * Get Fallback PayPal SDK URL
     */
    getFallbackSDKUrl() {
        const params = new URLSearchParams({
            'client-id': this.fallbackClientId,
            'currency': this.currency
        });
        
        if (this.components.fallback) {
            params.set('components', this.components.fallback);
        }
        
        if (this.funding.fallback.enable) {
            params.set('enable-funding', this.funding.fallback.enable);
        }
        
        return `https://www.paypal.com/sdk/js?${params.toString()}`;
    },
    
    /**
     * Load PayPal SDK with automatic fallback
     * @param {Function} onSuccess - Called when SDK loads successfully
     * @param {Function} onError - Called if both primary and fallback fail
     */
    loadSDK(onSuccess, onError) {
        console.log('💳 Loading PayPal SDK...');
        
        // Check if PayPal is already loaded
        if (window.paypal) {
            console.log('✅ PayPal SDK already loaded');
            if (onSuccess) onSuccess();
            return;
        }
        
        // Try loading primary SDK
        const primaryScript = document.createElement('script');
        primaryScript.src = this.getPrimarySDKUrl();
        
        let fallbackAttempted = false;
        
        primaryScript.onload = () => {
            console.log('✅ PayPal SDK loaded (primary)');
            if (onSuccess) onSuccess();
        };
        
        primaryScript.onerror = () => {
            if (fallbackAttempted) return;
            
            console.warn('⚠️ Primary PayPal SDK failed, trying fallback...');
            fallbackAttempted = true;
            
            // Try fallback SDK
            const fallbackScript = document.createElement('script');
            fallbackScript.src = this.getFallbackSDKUrl();
            
            fallbackScript.onload = () => {
                console.log('✅ PayPal SDK loaded (fallback)');
                if (onSuccess) onSuccess();
            };
            
            fallbackScript.onerror = () => {
                console.error('❌ Both PayPal SDK primary and fallback failed to load');
                if (onError) onError();
            };
            
            document.head.appendChild(fallbackScript);
        };
        
        document.head.appendChild(primaryScript);
    },
    
    /**
     * Create PayPal.me link for simple payments
     * @param {number} amount - Amount in USD
     * @param {string} note - Optional note
     */
    createPayPalMeLink(amount, note = '') {
        const email = this.paypalEmail.replace('@gmail.com', '');
        return `https://paypal.me/${email}/${amount}USD`;
    },
    
    /**
     * Verify PayPal SDK is loaded
     */
    isLoaded() {
        return typeof window.paypal !== 'undefined';
    },
    
    /**
     * Wait for PayPal SDK to load
     * @param {number} timeout - Timeout in milliseconds (default 10000)
     * @returns {Promise}
     */
    waitForSDK(timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (this.isLoaded()) {
                resolve();
                return;
            }
            
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (this.isLoaded()) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error('PayPal SDK load timeout'));
                }
            }, 100);
        });
    }
};

// Make configuration globally available
console.log('💳 PayPal Configuration loaded');
console.log(`   Primary Client ID: ${window.PayPalConfig.primaryClientId.substring(0, 20)}...`);
console.log(`   Fallback Client ID: ${window.PayPalConfig.fallbackClientId.substring(0, 20)}...`);
console.log(`   PayPal Email: ${window.PayPalConfig.paypalEmail}`);
