/**
 * PayPal UI Widget
 * Provides a reusable PayPal interface component for all GemBot pages
 * 
 * @author Ryan Barbrick - BarbrickDesign@gmail.com
 * @copyright © 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.
 */

class PayPalUIWidget {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            position: options.position || 'bottom-right', // bottom-right, bottom-left, top-right, top-left
            theme: options.theme || 'dark', // dark, light
            compact: options.compact !== undefined ? options.compact : false,
            showBalance: options.showBalance !== undefined ? options.showBalance : true,
            ...options
        };

        this.isOpen = false;
        this.paypal = null;

        console.log('🔷 PayPal UI Widget initialized');
        this.render();
    }

    /**
     * Initialize PayPal integration
     */
    async initializePayPal() {
        if (!window.PayPalIntegration) {
            console.error('PayPalIntegration class not found. Load paypal-integration.js first.');
            return;
        }

        this.paypal = new window.PayPalIntegration({
            clientId: window.PAYPAL_CONFIG?.clientId,
            clientSecret: window.PAYPAL_CONFIG?.clientSecret,
            sandbox: window.PAYPAL_CONFIG?.sandbox !== false
        });

        await this.paypal.getAccessToken();
    }

    /**
     * Render the widget
     */
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }

        const widgetHTML = `
            <div class="paypal-widget ${this.options.theme}" style="${this.getPositionStyles()}">
                <!-- Floating Button -->
                <button class="paypal-widget-button" id="paypal-widget-toggle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.028.15a.8.8 0 0 1-.79.679H8.864c-.322 0-.596-.232-.673-.547L6.739 11.94a.8.8 0 0 1 .787-.955h3.588a.8.8 0 0 0 .788-.68l.893-5.662c.076-.482.49-.843.983-.843h2.742c2.137 0 3.634.446 4.547 1.678z" fill="currentColor"/>
                    </svg>
                    ${this.options.compact ? '' : '<span>PayPal</span>'}
                </button>

                <!-- Widget Panel -->
                <div class="paypal-widget-panel" id="paypal-widget-panel" style="display: none;">
                    <div class="paypal-widget-header">
                        <h3>💰 PayPal</h3>
                        <button class="paypal-widget-close" id="paypal-widget-close">×</button>
                    </div>

                    <div class="paypal-widget-content">
                        <!-- Status Section -->
                        <div class="paypal-status">
                            <div class="status-item">
                                <span class="status-label">Status:</span>
                                <span class="status-value" id="paypal-status">Initializing...</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Mode:</span>
                                <span class="status-value" id="paypal-mode">Sandbox</span>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="paypal-actions">
                            <button class="paypal-action-btn" onclick="paypalWidget.showInvoiceForm()">
                                📄 Create Invoice
                            </button>
                            <button class="paypal-action-btn" onclick="paypalWidget.showPaymentForm()">
                                💳 Process Payment
                            </button>
                            <button class="paypal-action-btn" onclick="paypalWidget.showTransactions()">
                                📊 View Transactions
                            </button>
                            <button class="paypal-action-btn" onclick="paypalWidget.showSubscriptions()">
                                📅 Subscriptions
                            </button>
                        </div>

                        <!-- Dynamic Content Area -->
                        <div class="paypal-dynamic-content" id="paypal-dynamic-content">
                            <p class="text-center">Select an action above to get started.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = widgetHTML;
        this.addStyles();
        this.attachEventListeners();
        this.initializePayPal();
    }

    /**
     * Get position styles based on configuration
     */
    getPositionStyles() {
        const positions = {
            'bottom-right': 'position: fixed; bottom: 20px; right: 20px; z-index: 10000;',
            'bottom-left': 'position: fixed; bottom: 20px; left: 20px; z-index: 10000;',
            'top-right': 'position: fixed; top: 20px; right: 20px; z-index: 10000;',
            'top-left': 'position: fixed; top: 20px; left: 20px; z-index: 10000;'
        };
        return positions[this.options.position] || positions['bottom-right'];
    }

    /**
     * Add widget styles
     */
    addStyles() {
        if (document.getElementById('paypal-widget-styles')) return;

        const styles = `
            <style id="paypal-widget-styles">
                .paypal-widget {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .paypal-widget-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #0070ba, #1546a0);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0, 112, 186, 0.3);
                    transition: all 0.3s ease;
                }

                .paypal-widget-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 112, 186, 0.4);
                }

                .paypal-widget-panel {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    width: 400px;
                    max-width: 90vw;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .paypal-widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: rgba(0, 112, 186, 0.1);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .paypal-widget-header h3 {
                    margin: 0;
                    color: white;
                    font-size: 18px;
                }

                .paypal-widget-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }

                .paypal-widget-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .paypal-widget-content {
                    padding: 20px;
                    max-height: 500px;
                    overflow-y: auto;
                }

                .paypal-status {
                    background: rgba(0, 112, 186, 0.1);
                    border: 1px solid rgba(0, 112, 186, 0.3);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 16px;
                }

                .status-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    color: white;
                    font-size: 13px;
                }

                .status-item:last-child {
                    margin-bottom: 0;
                }

                .status-label {
                    opacity: 0.7;
                }

                .status-value {
                    font-weight: 600;
                }

                .paypal-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 16px;
                }

                .paypal-action-btn {
                    padding: 12px;
                    background: rgba(0, 112, 186, 0.2);
                    border: 1px solid rgba(0, 112, 186, 0.4);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s;
                }

                .paypal-action-btn:hover {
                    background: rgba(0, 112, 186, 0.3);
                    transform: translateY(-2px);
                }

                .paypal-dynamic-content {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 16px;
                    color: white;
                    font-size: 13px;
                    line-height: 1.6;
                }

                .text-center {
                    text-align: center;
                }

                .paypal-form-group {
                    margin-bottom: 16px;
                }

                .paypal-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    color: white;
                    font-size: 13px;
                    font-weight: 500;
                }

                .paypal-form-group input,
                .paypal-form-group textarea {
                    width: 100%;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    color: white;
                    font-size: 13px;
                }

                .paypal-form-group textarea {
                    resize: vertical;
                    min-height: 60px;
                }

                .paypal-submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #0070ba, #1546a0);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .paypal-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 112, 186, 0.4);
                }

                .paypal-transaction-item {
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    margin-bottom: 10px;
                }

                .paypal-transaction-item:last-child {
                    margin-bottom: 0;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const toggleBtn = document.getElementById('paypal-widget-toggle');
        const closeBtn = document.getElementById('paypal-widget-close');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.togglePanel());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePanel());
        }
    }

    /**
     * Toggle panel visibility
     */
    togglePanel() {
        const panel = document.getElementById('paypal-widget-panel');
        if (!panel) return;

        this.isOpen = !this.isOpen;
        panel.style.display = this.isOpen ? 'block' : 'none';

        if (this.isOpen && this.paypal?.initialized) {
            this.updateStatus();
        }
    }

    /**
     * Close panel
     */
    closePanel() {
        const panel = document.getElementById('paypal-widget-panel');
        if (panel) {
            panel.style.display = 'none';
            this.isOpen = false;
        }
    }

    /**
     * Show error notification
     */
    showError(message) {
        const content = document.getElementById('paypal-dynamic-content');
        if (content) {
            content.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="color: #ff4444; font-size: 48px; margin-bottom: 10px;">❌</div>
                    <h4 style="color: #ff4444; margin-bottom: 10px;">Error</h4>
                    <p style="color: #ccc;">${message}</p>
                </div>
            `;
        }
    }

    /**
     * Show success notification
     */
    showSuccess(message) {
        const content = document.getElementById('paypal-dynamic-content');
        if (content) {
            content.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="color: #00ff88; font-size: 48px; margin-bottom: 10px;">✅</div>
                    <h4 style="color: #00ff88; margin-bottom: 10px;">Success</h4>
                    <p style="color: #ccc;">${message}</p>
                </div>
            `;
        }
    }

    /**
     * Update status display
     */
    updateStatus() {
        const statusEl = document.getElementById('paypal-status');
        const modeEl = document.getElementById('paypal-mode');

        if (statusEl) {
            statusEl.textContent = this.paypal?.initialized ? '✅ Connected' : '❌ Disconnected';
        }

        if (modeEl) {
            modeEl.textContent = this.paypal?.config?.sandbox ? '🧪 Sandbox' : '🚀 Production';
        }
    }

    /**
     * Show invoice form
     */
    showInvoiceForm() {
        const content = document.getElementById('paypal-dynamic-content');
        if (!content) return;

        content.innerHTML = `
            <h4 style="margin-top: 0; color: white;">Create Invoice</h4>
            <form id="invoice-form" onsubmit="return paypalWidget.submitInvoice(event)">
                <div class="paypal-form-group">
                    <label>Amount ($)</label>
                    <input type="number" step="0.01" name="amount" required>
                </div>
                <div class="paypal-form-group">
                    <label>Recipient Email</label>
                    <input type="email" name="email" required>
                </div>
                <div class="paypal-form-group">
                    <label>Description</label>
                    <textarea name="description" required></textarea>
                </div>
                <button type="submit" class="paypal-submit-btn">Create & Send Invoice</button>
            </form>
        `;
    }

    /**
     * Submit invoice
     */
    async submitInvoice(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const invoicerEmail = this.options.invoicerEmail || 
                                  window.PAYPAL_CONFIG?.invoicerEmail || 
                                  'BarbrickDesign@gmail.com';
            
            const invoice = await this.paypal.createInvoice({
                detail: {
                    invoice_number: `INV-GEMBOT-${Date.now()}`,
                    invoice_date: new Date().toISOString().split('T')[0]
                },
                invoicerEmail: invoicerEmail,
                recipients: [{
                    billing_info: {
                        email_address: formData.get('email')
                    }
                }],
                items: [{
                    name: formData.get('description'),
                    quantity: '1',
                    unit_amount: {
                        currency_code: 'USD',
                        value: formData.get('amount')
                    }
                }]
            });

            await this.paypal.sendInvoice(invoice.id);

            const content = document.getElementById('paypal-dynamic-content');
            if (content) {
                content.innerHTML = `
                    <div style="text-align: center;">
                        <h4 style="color: #4af; margin-top: 0;">✅ Invoice Created!</h4>
                        <p>Invoice ID: ${invoice.id}</p>
                        <p>Amount: $${formData.get('amount')}</p>
                        <p>Sent to: ${formData.get('email')}</p>
                        <button class="paypal-submit-btn" onclick="paypalWidget.showInvoiceForm()" style="margin-top: 16px;">
                            Create Another Invoice
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            this.showError(`Failed to create invoice: ${error.message}`);
        }

        return false;
    }

    /**
     * Show payment form
     */
    showPaymentForm() {
        const content = document.getElementById('paypal-dynamic-content');
        if (!content) return;

        content.innerHTML = `
            <h4 style="margin-top: 0; color: white;">Process Payment</h4>
            <form id="payment-form" onsubmit="return paypalWidget.submitPayment(event)">
                <div class="paypal-form-group">
                    <label>Amount ($)</label>
                    <input type="number" step="0.01" name="amount" required>
                </div>
                <div class="paypal-form-group">
                    <label>Description</label>
                    <input type="text" name="description" required>
                </div>
                <button type="submit" class="paypal-submit-btn">Create Payment Link</button>
            </form>
        `;
    }

    /**
     * Submit payment
     */
    async submitPayment(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const order = await this.paypal.processGemBotPayment({
                amount: formData.get('amount'),
                description: formData.get('description')
            });

            const approveLink = order.links?.find(l => l.rel === 'approve')?.href;

            const content = document.getElementById('paypal-dynamic-content');
            if (content) {
                content.innerHTML = `
                    <div style="text-align: center;">
                        <h4 style="color: #4af; margin-top: 0;">✅ Payment Link Created!</h4>
                        <p>Order ID: ${order.id}</p>
                        <p>Amount: $${formData.get('amount')}</p>
                        ${approveLink ? `
                            <a href="${approveLink}" target="_blank" class="paypal-submit-btn" style="display: inline-block; text-decoration: none; margin-top: 16px;">
                                Complete Payment
                            </a>
                        ` : '<p>Payment link unavailable</p>'}
                    </div>
                `;
            }
        } catch (error) {
            this.showError(`Failed to create payment: ${error.message}`);
        }

        return false;
    }

    /**
     * Show transactions
     */
    async showTransactions() {
        const content = document.getElementById('paypal-dynamic-content');
        if (!content) return;

        content.innerHTML = '<p style="text-align: center;">Loading transactions...</p>';

        try {
            const result = await this.paypal.listTransactions({ pageSize: 10 });
            const transactions = result.transaction_details?.slice(0, 5) || [];

            if (transactions.length === 0) {
                content.innerHTML = '<p style="text-align: center;">No recent transactions found.</p>';
                return;
            }

            const txHTML = transactions.map(tx => `
                <div class="paypal-transaction-item">
                    <strong>${tx.transaction_info?.transaction_id || 'N/A'}</strong><br>
                    Amount: ${tx.transaction_info?.transaction_amount?.value || 'N/A'} ${tx.transaction_info?.transaction_amount?.currency_code || 'USD'}<br>
                    Status: ${tx.transaction_info?.transaction_status || 'N/A'}
                </div>
            `).join('');

            content.innerHTML = `
                <h4 style="margin-top: 0; color: white;">Recent Transactions</h4>
                ${txHTML}
            `;
        } catch (error) {
            content.innerHTML = `<p style="color: #ff4444;">Error loading transactions: ${error.message}</p>`;
        }
    }

    /**
     * Show subscriptions
     */
    showSubscriptions() {
        const content = document.getElementById('paypal-dynamic-content');
        if (!content) return;

        content.innerHTML = `
            <h4 style="margin-top: 0; color: white;">Subscription Management</h4>
            <p>Subscription features coming soon!</p>
            <p style="font-size: 12px; opacity: 0.7;">
                You'll be able to create subscription plans, manage recurring billing, and track subscriber activity.
            </p>
        `;
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.PayPalUIWidget = PayPalUIWidget;
}
