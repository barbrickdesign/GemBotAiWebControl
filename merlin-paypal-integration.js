/**
 * Merlin AI + PayPal Integration
 * Allows users to perform PayPal operations through chat with Merlin
 * 
 * @author Ryan Barbrick - BarbrickDesign@gmail.com
 * @copyright © 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.
 */

class MerlinPayPalIntegration {
    constructor(paypalIntegration, merlinAI) {
        this.paypal = paypalIntegration;
        this.merlin = merlinAI;
        this.conversationContext = new Map();
        
        console.log('🧙‍♂️ Merlin PayPal Integration initialized');
        this.setupPayPalCommands();
    }

    /**
     * Setup PayPal commands for Merlin
     */
    setupPayPalCommands() {
        // Register PayPal intents with Merlin
        const paypalIntents = [
            {
                keywords: ['invoice', 'send invoice', 'create invoice', 'bill', 'billing'],
                handler: this.handleInvoiceIntent.bind(this)
            },
            {
                keywords: ['payment', 'pay', 'checkout', 'purchase', 'buy'],
                handler: this.handlePaymentIntent.bind(this)
            },
            {
                keywords: ['subscription', 'subscribe', 'recurring', 'monthly'],
                handler: this.handleSubscriptionIntent.bind(this)
            },
            {
                keywords: ['transaction', 'transactions', 'payment history', 'orders'],
                handler: this.handleTransactionIntent.bind(this)
            },
            {
                keywords: ['paypal status', 'paypal config', 'payment settings'],
                handler: this.handleStatusIntent.bind(this)
            }
        ];

        // Add to Merlin's command registry if available
        if (this.merlin && this.merlin.registerIntents) {
            paypalIntents.forEach(intent => {
                this.merlin.registerIntents(intent.keywords, intent.handler);
            });
        }

        console.log('✅ PayPal commands registered with Merlin');
    }

    /**
     * Process user message for PayPal intents
     */
    async processMessage(message, userId) {
        const lowerMessage = message.toLowerCase();

        // Check for PayPal-related keywords
        if (this.containsPayPalIntent(lowerMessage)) {
            return await this.handlePayPalQuery(message, userId);
        }

        return null; // No PayPal intent detected
    }

    /**
     * Check if message contains PayPal intent
     */
    containsPayPalIntent(message) {
        const paypalKeywords = [
            'invoice', 'payment', 'pay', 'checkout', 'subscription',
            'transaction', 'paypal', 'billing', 'purchase', 'buy',
            'order', 'refund', 'receipt'
        ];
        return paypalKeywords.some(keyword => message.includes(keyword));
    }

    /**
     * Handle PayPal queries
     */
    async handlePayPalQuery(message, userId) {
        const lowerMessage = message.toLowerCase();

        try {
            // Invoice operations
            if (lowerMessage.includes('invoice') || lowerMessage.includes('bill')) {
                return await this.handleInvoiceIntent(message, userId);
            }

            // Payment operations
            if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || 
                lowerMessage.includes('checkout') || lowerMessage.includes('purchase')) {
                return await this.handlePaymentIntent(message, userId);
            }

            // Subscription operations
            if (lowerMessage.includes('subscription') || lowerMessage.includes('subscribe')) {
                return await this.handleSubscriptionIntent(message, userId);
            }

            // Transaction history
            if (lowerMessage.includes('transaction') || lowerMessage.includes('history') ||
                lowerMessage.includes('orders')) {
                return await this.handleTransactionIntent(message, userId);
            }

            // Status check
            if (lowerMessage.includes('status') || lowerMessage.includes('config')) {
                return await this.handleStatusIntent(message, userId);
            }

            // General PayPal help
            return this.getPayPalHelp();

        } catch (error) {
            console.error('Error handling PayPal query:', error);
            return {
                success: false,
                message: `I encountered an error processing your PayPal request: ${error.message}`,
                type: 'error'
            };
        }
    }

    /**
     * Handle invoice intent
     */
    async handleInvoiceIntent(message, userId) {
        const context = this.conversationContext.get(userId) || {};

        // Check if user wants to create invoice
        if (message.includes('create') || message.includes('send') || message.includes('new')) {
            // Extract details from message
            const amountMatch = message.match(/\$?(\d+\.?\d*)/);
            const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);

            if (!amountMatch && !context.invoiceData) {
                return {
                    success: true,
                    message: `I can help you create an invoice! Please provide:
                    
1. Amount (e.g., $100.00)
2. Recipient email
3. Description of service/product

For example: "Create invoice for $150 to customer@email.com for GemBot training"`,
                    type: 'info',
                    requiresInput: true
                };
            }

            // If we have enough information, create the invoice
            if (amountMatch && emailMatch) {
                const amount = amountMatch[1];
                const email = emailMatch[1];
                const description = message.replace(amountMatch[0], '').replace(emailMatch[0], '').trim();

                try {
                    const invoice = await this.paypal.createInvoice({
                        detail: {
                            invoice_number: `INV-GEMBOT-${Date.now()}`,
                            invoice_date: new Date().toISOString().split('T')[0]
                        },
                        invoicerEmail: 'BarbrickDesign@gmail.com',
                        recipients: [{
                            billing_info: {
                                email_address: email
                            }
                        }],
                        items: [{
                            name: description || 'GemBot Service',
                            quantity: '1',
                            unit_amount: {
                                currency_code: 'USD',
                                value: amount
                            }
                        }]
                    });

                    // Send the invoice
                    await this.paypal.sendInvoice(invoice.id);

                    return {
                        success: true,
                        message: `✅ Invoice created and sent!
                        
Invoice ID: ${invoice.id}
Amount: $${amount}
Recipient: ${email}
Status: Sent

The recipient will receive an email with payment instructions.`,
                        type: 'success',
                        data: invoice
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: `❌ Failed to create invoice: ${error.message}`,
                        type: 'error'
                    };
                }
            }
        }

        // List invoices
        if (message.includes('list') || message.includes('show') || message.includes('view')) {
            try {
                const result = await this.paypal.listInvoices({ pageSize: 5 });
                const invoices = result.items || [];

                if (invoices.length === 0) {
                    return {
                        success: true,
                        message: 'You have no invoices yet.',
                        type: 'info'
                    };
                }

                const invoiceList = invoices.map((inv, i) => 
                    `${i + 1}. ${inv.id} - ${inv.status} - $${inv.amount?.value || 'N/A'}`
                ).join('\n');

                return {
                    success: true,
                    message: `📋 Recent Invoices:\n\n${invoiceList}`,
                    type: 'success',
                    data: invoices
                };
            } catch (error) {
                return {
                    success: false,
                    message: `❌ Failed to list invoices: ${error.message}`,
                    type: 'error'
                };
            }
        }

        return this.getInvoiceHelp();
    }

    /**
     * Handle payment intent
     */
    async handlePaymentIntent(message, userId) {
        const amountMatch = message.match(/\$?(\d+\.?\d*)/);

        if (!amountMatch) {
            return {
                success: true,
                message: `I can help you create a payment! Please specify the amount.

For example: "Create payment for $50" or "Checkout for $29.99"`,
                type: 'info',
                requiresInput: true
            };
        }

        const amount = amountMatch[1];
        const description = message.replace(amountMatch[0], '').trim() || 'GemBot Service';

        try {
            const order = await this.paypal.processGemBotPayment({
                amount: amount,
                description: description,
                referenceId: `GEMBOT-${userId}-${Date.now()}`
            });

            return {
                success: true,
                message: `💳 Payment link created!

Amount: $${amount}
Description: ${description}

Click the link to complete payment:
${order.links?.find(l => l.rel === 'approve')?.href || 'Payment link unavailable'}`,
                type: 'success',
                data: order
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Failed to create payment: ${error.message}`,
                type: 'error'
            };
        }
    }

    /**
     * Handle subscription intent
     */
    async handleSubscriptionIntent(message, userId) {
        return {
            success: true,
            message: `📅 Subscription Management

I can help you with:
- Creating subscription plans
- Managing existing subscriptions
- Canceling subscriptions

What would you like to do?`,
            type: 'info',
            requiresInput: true
        };
    }

    /**
     * Handle transaction intent
     */
    async handleTransactionIntent(message, userId) {
        try {
            const transactions = await this.paypal.listTransactions({
                pageSize: 10
            });

            const txList = transactions.transaction_details?.slice(0, 5) || [];

            if (txList.length === 0) {
                return {
                    success: true,
                    message: 'No recent transactions found.',
                    type: 'info'
                };
            }

            const txSummary = txList.map((tx, i) => 
                `${i + 1}. ${tx.transaction_info?.transaction_id} - ${tx.transaction_info?.transaction_amount?.value || 'N/A'} ${tx.transaction_info?.transaction_amount?.currency_code || 'USD'}`
            ).join('\n');

            return {
                success: true,
                message: `📊 Recent Transactions:\n\n${txSummary}`,
                type: 'success',
                data: transactions
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Failed to retrieve transactions: ${error.message}`,
                type: 'error'
            };
        }
    }

    /**
     * Handle status intent
     */
    async handleStatusIntent(message, userId) {
        return {
            success: true,
            message: `💰 PayPal Integration Status

Environment: ${this.paypal.config.sandbox ? '🧪 Sandbox (Testing)' : '🚀 Production'}
Currency: ${this.paypal.config.currency}
Initialized: ${this.paypal.initialized ? '✅ Yes' : '❌ No'}

Available Commands:
- Create invoice
- Process payment
- View transactions
- Manage subscriptions

Try saying: "Create invoice for $50 to email@example.com"`,
            type: 'success'
        };
    }

    /**
     * Get PayPal help message
     */
    getPayPalHelp() {
        return {
            success: true,
            message: `💰 PayPal Integration Help

I can assist you with:

📄 **Invoices**
- "Create invoice for $100 to customer@email.com"
- "List my invoices"

💳 **Payments**
- "Create payment for $50"
- "Process checkout for $29.99"

📅 **Subscriptions**
- "Create subscription plan"
- "Manage subscriptions"

📊 **Reports**
- "Show recent transactions"
- "View payment history"

What would you like to do?`,
            type: 'info'
        };
    }

    /**
     * Get invoice help message
     */
    getInvoiceHelp() {
        return {
            success: true,
            message: `📄 Invoice Help

I can help you with invoices:

**Create Invoice:**
"Create invoice for $150 to customer@email.com for consulting service"

**View Invoices:**
"Show my invoices" or "List recent invoices"

**Send Invoice:**
"Send invoice [invoice-id]"

What would you like to do?`,
            type: 'info'
        };
    }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MerlinPayPalIntegration;
}
if (typeof window !== 'undefined') {
    window.MerlinPayPalIntegration = MerlinPayPalIntegration;
}
