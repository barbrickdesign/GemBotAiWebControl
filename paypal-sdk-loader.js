/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAYPAL SDK LOADER WITH FALLBACK
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Automatically loads PayPal SDK with fallback if primary client-id fails
 * 
 * Primary: Uses environment-specific client-id (from main script tag)
 * Fallback: Uses backup client-id with hosted buttons
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.PayPalSDKLoader = {
    version: '1.0.0',
    
    // Configuration
    config: {
        // Fallback PayPal SDK configuration
        fallbackClientId: 'BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg',
        fallbackParams: {
            components: 'hosted-buttons',
            'enable-funding': 'venmo',
            currency: 'USD'
        },
        
        // Timeout for SDK load attempt (ms)
        loadTimeout: 10000,
        
        // Retry configuration
        maxRetries: 2,
        retryDelay: 2000
    },
    
    // State
    state: {
        primaryLoaded: false,
        fallbackLoaded: false,
        loading: false,
        error: null,
        currentRetry: 0
    },
    
    /**
     * Initialize PayPal SDK loader
     * Checks if PayPal SDK is already loaded, otherwise attempts to load it
     */
    init() {
        console.log('💳 PayPal SDK Loader initializing...');
        
        // Check if PayPal is already loaded
        if (window.paypal) {
            console.log('✅ PayPal SDK already loaded');
            this.state.primaryLoaded = true;
            this.notifyReady();
            return Promise.resolve(true);
        }
        
        // Check if a PayPal script tag already exists in the page
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (existingScript) {
            console.log('📦 PayPal SDK script tag found, waiting for load...');
            return this.waitForPayPal();
        }
        
        // No PayPal found, attempt to load fallback
        console.log('⚠️ No PayPal SDK detected, loading fallback...');
        return this.loadFallback();
    },
    
    /**
     * Wait for PayPal SDK to load (if script tag exists but SDK not ready)
     */
    waitForPayPal() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds total
            
            const checkInterval = setInterval(() => {
                attempts++;
                
                if (window.paypal) {
                    clearInterval(checkInterval);
                    console.log('✅ PayPal SDK loaded successfully');
                    this.state.primaryLoaded = true;
                    this.notifyReady();
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.warn('⚠️ PayPal SDK timeout, attempting fallback...');
                    this.loadFallback().then(resolve).catch(reject);
                }
            }, 100);
        });
    },
    
    /**
     * Load fallback PayPal SDK
     */
    loadFallback() {
        if (this.state.fallbackLoaded || this.state.loading) {
            console.log('ℹ️ Fallback already loaded or loading...');
            return Promise.resolve(true);
        }
        
        this.state.loading = true;
        console.log('🔄 Loading PayPal fallback SDK...');
        
        return new Promise((resolve, reject) => {
            // Build fallback URL
            const params = new URLSearchParams({
                'client-id': this.config.fallbackClientId,
                ...this.config.fallbackParams
            });
            
            const fallbackUrl = `https://www.paypal.com/sdk/js?${params.toString()}`;
            
            // Create script element
            const script = document.createElement('script');
            script.src = fallbackUrl;
            script.async = true;
            script.dataset.namespace = 'paypal';
            script.dataset.fallback = 'true';
            
            // Handle successful load
            script.onload = () => {
                console.log('✅ PayPal fallback SDK loaded successfully');
                this.state.fallbackLoaded = true;
                this.state.loading = false;
                this.notifyReady();
                resolve(true);
            };
            
            // Handle load error
            script.onerror = (error) => {
                console.error('❌ PayPal fallback SDK failed to load:', error);
                this.state.error = 'Failed to load PayPal SDK';
                this.state.loading = false;
                
                // Attempt retry
                if (this.state.currentRetry < this.config.maxRetries) {
                    this.state.currentRetry++;
                    console.log(`🔄 Retrying PayPal SDK load (${this.state.currentRetry}/${this.config.maxRetries})...`);
                    
                    setTimeout(() => {
                        script.remove();
                        this.state.loading = false;
                        this.loadFallback().then(resolve).catch(reject);
                    }, this.config.retryDelay);
                } else {
                    this.notifyError();
                    reject(error);
                }
            };
            
            // Append to document head
            document.head.appendChild(script);
            
            // Set timeout
            setTimeout(() => {
                if (!this.state.fallbackLoaded && !window.paypal) {
                    console.warn('⏱️ PayPal SDK load timeout');
                    script.onerror(new Error('Load timeout'));
                }
            }, this.config.loadTimeout);
        });
    },
    
    /**
     * Notify listeners that PayPal SDK is ready
     */
    notifyReady() {
        // Dispatch custom event
        const event = new CustomEvent('paypal-sdk-ready', {
            detail: {
                isPrimary: this.state.primaryLoaded,
                isFallback: this.state.fallbackLoaded,
                paypal: window.paypal
            }
        });
        
        window.dispatchEvent(event);
        
        // Also call global callback if defined
        if (typeof window.onPayPalReady === 'function') {
            window.onPayPalReady(window.paypal);
        }
        
        console.log('📢 PayPal SDK ready event dispatched');
    },
    
    /**
     * Notify listeners of error
     */
    notifyError() {
        const event = new CustomEvent('paypal-sdk-error', {
            detail: {
                error: this.state.error
            }
        });
        
        window.dispatchEvent(event);
        
        if (typeof window.onPayPalError === 'function') {
            window.onPayPalError(this.state.error);
        }
        
        console.error('📢 PayPal SDK error event dispatched');
    },
    
    /**
     * Check if PayPal SDK is available
     */
    isReady() {
        return !!(window.paypal && (this.state.primaryLoaded || this.state.fallbackLoaded));
    },
    
    /**
     * Get PayPal SDK status
     */
    getStatus() {
        return {
            ready: this.isReady(),
            primaryLoaded: this.state.primaryLoaded,
            fallbackLoaded: this.state.fallbackLoaded,
            loading: this.state.loading,
            error: this.state.error
        };
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PayPalSDKLoader.init().catch(error => {
            console.error('Failed to initialize PayPal SDK:', error);
        });
    });
} else {
    // DOM already loaded
    window.PayPalSDKLoader.init().catch(error => {
        console.error('Failed to initialize PayPal SDK:', error);
    });
}

console.log('💳 PayPal SDK Loader module loaded');
