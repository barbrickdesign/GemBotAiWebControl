/**
 * PayPal API Server
 * Handles server-side PayPal operations for GemBot
 * 
 * @author Ryan Barbrick - BarbrickDesign@gmail.com
 * @copyright © 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PayPalIntegration = require('./paypal-integration.js');

// Initialize Express app
const app = express();
const PORT = process.env.PAYPAL_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize PayPal integration
const paypal = new PayPalIntegration({
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    sandbox: process.env.PAYPAL_SANDBOX !== 'false' // Defaults to sandbox unless explicitly set to false
});

// Health check endpoint
app.get('/api/paypal/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'PayPal API Server',
        timestamp: new Date().toISOString(),
        initialized: paypal.initialized
    });
});

// Create invoice
app.post('/api/paypal/invoices', async (req, res) => {
    try {
        const invoice = await paypal.createInvoice(req.body);
        res.json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send invoice
app.post('/api/paypal/invoices/:id/send', async (req, res) => {
    try {
        await paypal.sendInvoice(req.params.id);
        res.json({ success: true, message: 'Invoice sent successfully' });
    } catch (error) {
        console.error('Error sending invoice:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get invoice
app.get('/api/paypal/invoices/:id', async (req, res) => {
    try {
        const invoice = await paypal.getInvoice(req.params.id);
        res.json(invoice);
    } catch (error) {
        console.error('Error getting invoice:', error);
        res.status(500).json({ error: error.message });
    }
});

// List invoices
app.get('/api/paypal/invoices', async (req, res) => {
    try {
        const invoices = await paypal.listInvoices({
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 10
        });
        res.json(invoices);
    } catch (error) {
        console.error('Error listing invoices:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create order
app.post('/api/paypal/orders', async (req, res) => {
    try {
        const order = await paypal.createOrder(req.body);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Capture order
app.post('/api/paypal/orders/:id/capture', async (req, res) => {
    try {
        const result = await paypal.captureOrder(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error capturing order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get order
app.get('/api/paypal/orders/:id', async (req, res) => {
    try {
        const order = await paypal.getOrder(req.params.id);
        res.json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create subscription plan
app.post('/api/paypal/subscription-plans', async (req, res) => {
    try {
        const plan = await paypal.createSubscriptionPlan(req.body);
        res.json(plan);
    } catch (error) {
        console.error('Error creating subscription plan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create subscription
app.post('/api/paypal/subscriptions', async (req, res) => {
    try {
        const subscription = await paypal.createSubscription(req.body);
        res.json(subscription);
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get transaction
app.get('/api/paypal/transactions/:id', async (req, res) => {
    try {
        const transaction = await paypal.getTransaction(req.params.id);
        res.json(transaction);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: error.message });
    }
});

// List transactions
app.get('/api/paypal/transactions', async (req, res) => {
    try {
        const transactions = await paypal.listTransactions({
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 100
        });
        res.json(transactions);
    } catch (error) {
        console.error('Error listing transactions:', error);
        res.status(500).json({ error: error.message });
    }
});

// GemBot-specific payment endpoint
app.post('/api/paypal/gembot-payment', async (req, res) => {
    try {
        const order = await paypal.processGemBotPayment(req.body);
        res.json(order);
    } catch (error) {
        console.error('Error processing GemBot payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🔷 PayPal API Server running on port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/api/paypal/health`);
        console.log(`🔐 Sandbox mode: ${paypal.config.sandbox}`);
    });
}

module.exports = app;
