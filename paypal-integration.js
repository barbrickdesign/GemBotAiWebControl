/**
 * PayPal AI Agent Toolkit Integration
 * Provides PayPal payment capabilities across all GemBot pages
 * 
 * Features:
 * - Invoice creation and management
 * - Order processing
 * - Payment handling
 * - Subscription management
 * - Transaction reporting
 * 
 * @author Ryan Barbrick - BarbrickDesign@gmail.com
 * @copyright © 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.
 */

class PayPalIntegration {
    constructor(config = {}) {
        this.config = {
            clientId: config.clientId || this.getEnvVar('PAYPAL_CLIENT_ID'),
            clientSecret: config.clientSecret || this.getEnvVar('PAYPAL_CLIENT_SECRET'),
            sandbox: config.sandbox !== undefined ? config.sandbox : true,
            currency: config.currency || 'USD',
            ...config
        };

        // Validate client ID is not a placeholder
        if (this.config.clientId === 'YOUR_PAYPAL_CLIENT_ID' || !this.config.clientId) {
            console.warn('⚠️ PayPal Client ID not configured. Set it via localStorage or environment variables.');
            this.config.clientId = null;
        }

        this.initialized = false;
        this.accessToken = null;
        this.tokenExpiry = null;
        
        console.log('🔷 PayPal Integration initialized', {
            sandbox: this.config.sandbox,
            hasClientId: !!this.config.clientId,
            hasClientSecret: !!this.config.clientSecret
        });
    }

    /**
     * Get environment variable (supports browser and Node.js)
     */
    getEnvVar(key) {
        // Browser environment
        if (typeof window !== 'undefined' && window.PAYPAL_CONFIG) {
            return window.PAYPAL_CONFIG[key];
        }
        // Node.js environment
        if (typeof process !== 'undefined' && process.env) {
            return process.env[key];
        }
        // localStorage fallback for browser
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    }

    /**
     * Get PayPal API base URL
     */
    getBaseUrl() {
        return this.config.sandbox 
            ? 'https://api-m.sandbox.paypal.com'
            : 'https://api-m.paypal.com';
    }

    /**
     * Get OAuth2 access token
     */
    async getAccessToken() {
        // Return cached token if still valid
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const auth = btoa(`${this.config.clientId}:${this.config.clientSecret}`);
            const response = await fetch(`${this.getBaseUrl()}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials'
            });

            if (!response.ok) {
                throw new Error(`Failed to get access token: ${response.statusText}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            // Set expiry to 5 minutes before actual expiry for safety
            this.tokenExpiry = Date.now() + ((data.expires_in - 300) * 1000);
            this.initialized = true;

            console.log('✅ PayPal access token obtained');
            return this.accessToken;
        } catch (error) {
            console.error('❌ Failed to get PayPal access token:', error);
            throw error;
        }
    }

    /**
     * Make authenticated API request
     */
    async apiRequest(endpoint, options = {}) {
        const token = await this.getAccessToken();
        const url = `${this.getBaseUrl()}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`PayPal API error: ${response.statusText} - ${error}`);
        }

        return await response.json();
    }

    /**
     * Create an invoice
     */
    async createInvoice(invoiceData) {
        try {
            const invoice = await this.apiRequest('/v2/invoicing/invoices', {
                method: 'POST',
                body: JSON.stringify({
                    detail: {
                        currency_code: this.config.currency,
                        ...invoiceData.detail
                    },
                    invoicer: invoiceData.invoicer || {
                        name: { given_name: "GemBot", surname: "System" },
                        email_address: invoiceData.invoicerEmail || "BarbrickDesign@gmail.com"
                    },
                    primary_recipients: invoiceData.recipients || [],
                    items: invoiceData.items || [],
                    configuration: {
                        allow_tip: true,
                        tax_calculated_after_discount: true,
                        tax_inclusive: false,
                        ...invoiceData.configuration
                    }
                })
            });

            console.log('✅ Invoice created:', invoice.id);
            return invoice;
        } catch (error) {
            console.error('❌ Failed to create invoice:', error);
            throw error;
        }
    }

    /**
     * Send invoice
     */
    async sendInvoice(invoiceId) {
        try {
            await this.apiRequest(`/v2/invoicing/invoices/${invoiceId}/send`, {
                method: 'POST',
                body: JSON.stringify({
                    send_to_invoicer: true
                })
            });
            console.log('✅ Invoice sent:', invoiceId);
            return true;
        } catch (error) {
            console.error('❌ Failed to send invoice:', error);
            throw error;
        }
    }

    /**
     * Get invoice details
     */
    async getInvoice(invoiceId) {
        try {
            const invoice = await this.apiRequest(`/v2/invoicing/invoices/${invoiceId}`);
            return invoice;
        } catch (error) {
            console.error('❌ Failed to get invoice:', error);
            throw error;
        }
    }

    /**
     * List invoices
     */
    async listInvoices(params = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: params.page || 1,
                page_size: params.pageSize || 10,
                total_required: params.totalRequired !== undefined ? params.totalRequired : true
            });

            const result = await this.apiRequest(`/v2/invoicing/invoices?${queryParams}`);
            return result;
        } catch (error) {
            console.error('❌ Failed to list invoices:', error);
            throw error;
        }
    }

    /**
     * Create an order
     */
    async createOrder(orderData) {
        try {
            const order = await this.apiRequest('/v2/checkout/orders', {
                method: 'POST',
                body: JSON.stringify({
                    intent: orderData.intent || 'CAPTURE',
                    purchase_units: orderData.purchaseUnits || [],
                    application_context: {
                        brand_name: 'GemBot',
                        landing_page: 'NO_PREFERENCE',
                        user_action: 'PAY_NOW',
                        ...orderData.applicationContext
                    }
                })
            });

            console.log('✅ Order created:', order.id);
            return order;
        } catch (error) {
            console.error('❌ Failed to create order:', error);
            throw error;
        }
    }

    /**
     * Capture order payment
     */
    async captureOrder(orderId) {
        try {
            const result = await this.apiRequest(`/v2/checkout/orders/${orderId}/capture`, {
                method: 'POST'
            });
            console.log('✅ Order captured:', orderId);
            return result;
        } catch (error) {
            console.error('❌ Failed to capture order:', error);
            throw error;
        }
    }

    /**
     * Get order details
     */
    async getOrder(orderId) {
        try {
            const order = await this.apiRequest(`/v2/checkout/orders/${orderId}`);
            return order;
        } catch (error) {
            console.error('❌ Failed to get order:', error);
            throw error;
        }
    }

    /**
     * Create subscription plan
     */
    async createSubscriptionPlan(planData) {
        try {
            const plan = await this.apiRequest('/v1/billing/plans', {
                method: 'POST',
                body: JSON.stringify({
                    product_id: planData.productId,
                    name: planData.name,
                    description: planData.description,
                    billing_cycles: planData.billingCycles || [],
                    payment_preferences: planData.paymentPreferences || {
                        auto_bill_outstanding: true,
                        setup_fee_failure_action: 'CONTINUE',
                        payment_failure_threshold: 3
                    }
                })
            });

            console.log('✅ Subscription plan created:', plan.id);
            return plan;
        } catch (error) {
            console.error('❌ Failed to create subscription plan:', error);
            throw error;
        }
    }

    /**
     * Create subscription
     */
    async createSubscription(subscriptionData) {
        try {
            const subscription = await this.apiRequest('/v1/billing/subscriptions', {
                method: 'POST',
                body: JSON.stringify({
                    plan_id: subscriptionData.planId,
                    subscriber: subscriptionData.subscriber || {},
                    application_context: {
                        brand_name: 'GemBot',
                        locale: 'en-US',
                        user_action: 'SUBSCRIBE_NOW',
                        ...subscriptionData.applicationContext
                    }
                })
            });

            console.log('✅ Subscription created:', subscription.id);
            return subscription;
        } catch (error) {
            console.error('❌ Failed to create subscription:', error);
            throw error;
        }
    }

    /**
     * Get transaction details
     */
    async getTransaction(transactionId) {
        try {
            const transaction = await this.apiRequest(`/v1/reporting/transactions/${transactionId}`);
            return transaction;
        } catch (error) {
            console.error('❌ Failed to get transaction:', error);
            throw error;
        }
    }

    /**
     * List transactions
     */
    async listTransactions(params = {}) {
        try {
            const queryParams = new URLSearchParams({
                start_date: params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                end_date: params.endDate || new Date().toISOString(),
                fields: params.fields || 'all',
                page_size: params.pageSize || 100,
                page: params.page || 1
            });

            const result = await this.apiRequest(`/v1/reporting/transactions?${queryParams}`);
            return result;
        } catch (error) {
            console.error('❌ Failed to list transactions:', error);
            throw error;
        }
    }

    /**
     * Process GemBot-specific payment (helper method)
     */
    async processGemBotPayment(paymentData) {
        try {
            const order = await this.createOrder({
                intent: 'CAPTURE',
                purchaseUnits: [{
                    reference_id: paymentData.referenceId || `GEMBOT_${Date.now()}`,
                    description: paymentData.description || 'GemBot Service',
                    amount: {
                        currency_code: this.config.currency,
                        value: paymentData.amount,
                        breakdown: paymentData.breakdown
                    },
                    payee: {
                        email_address: paymentData.payeeEmail || 'BarbrickDesign@gmail.com'
                    }
                }],
                applicationContext: {
                    return_url: paymentData.returnUrl || window.location.href,
                    cancel_url: paymentData.cancelUrl || window.location.href
                }
            });

            return order;
        } catch (error) {
            console.error('❌ Failed to process GemBot payment:', error);
            throw error;
        }
    }

    /**
     * Initialize PayPal buttons on page
     */
    initializePayPalButtons(containerId, config = {}) {
        if (typeof paypal === 'undefined') {
            console.warn('⚠️ PayPal SDK not loaded. Add script tag to page.');
            return;
        }

        const buttons = paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal',
                ...config.style
            },
            createOrder: async (data, actions) => {
                if (config.createOrder) {
                    return await config.createOrder(data, actions);
                }
                // Default order creation
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: config.amount || '10.00'
                        }
                    }]
                });
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                console.log('✅ Payment approved:', order);
                if (config.onApprove) {
                    await config.onApprove(order, data);
                }
                return order;
            },
            onError: (err) => {
                console.error('❌ PayPal button error:', err);
                if (config.onError) {
                    config.onError(err);
                }
            }
        });

        buttons.render(`#${containerId}`);
        console.log('✅ PayPal buttons initialized');
    }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PayPalIntegration;
}
if (typeof window !== 'undefined') {
    window.PayPalIntegration = PayPalIntegration;
}
