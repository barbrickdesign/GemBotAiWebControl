# 💰 PayPal AI Agent Toolkit Integration Guide

Complete guide for using PayPal payment functionality across all GemBot pages.

**Author:** Ryan Barbrick - BarbrickDesign@gmail.com  
**Copyright:** © 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Merlin AI Integration](#merlin-ai-integration)
7. [Security Best Practices](#security-best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The PayPal AI Agent Toolkit integration provides comprehensive payment capabilities across all GemBot pages:

### Features
- ✅ **Invoice Management** - Create, send, and track invoices
- ✅ **Payment Processing** - Handle one-time payments and checkouts
- ✅ **Subscription Management** - Create and manage recurring billing
- ✅ **Transaction Reporting** - View payment history and analytics
- ✅ **Merlin AI Integration** - Process payments through conversational AI
- ✅ **UI Widget** - Floating PayPal interface on all pages
- ✅ **Sandbox Testing** - Safe testing environment

### Integrated Pages
- `GemBot_Control_AI.html` - Main control interface
- `admin-dashboard.html` - Admin dashboard
- `WORKING2025/GemBotWebControlAI.html` - Web control
- `WORKING2025/GemBotAiWebControlMenuControl.html` - Menu control
- `WORKING2025/GemBotAIWebControlWithVoice2025.html` - Voice control

---

## 🚀 Setup

### Step 1: Get PayPal API Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal account
3. Navigate to **My Apps & Credentials**
4. Under **REST API apps**, click **Create App**
5. Name your app (e.g., "GemBot Integration")
6. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   PAYPAL_CLIENT_ID=your_client_id_here
   PAYPAL_CLIENT_SECRET=your_client_secret_here
   PAYPAL_SANDBOX=true
   ```

### Step 3: Install Dependencies

```bash
npm install
```

Dependencies installed:
- `@paypal/agent-toolkit` - PayPal AI Agent Toolkit
- `@ai-sdk/openai` - AI SDK for OpenAI
- `ai` - Vercel AI SDK
- `express` - Web server
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Step 4: Start the PayPal API Server (Optional)

For server-side operations:

```bash
node paypal-api-server.js
```

The server will start on port 3001 (configurable via `PAYPAL_API_PORT`).

---

## ⚙️ Configuration

### Browser Configuration

Add this to your HTML page before loading PayPal scripts:

```html
<script>
    // PayPal Configuration
    window.PAYPAL_CONFIG = {
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET', // Only for server-side
        sandbox: true // Set to false for production
    };
</script>

<!-- PayPal SDK (for buttons) -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>

<!-- PayPal Integration Scripts -->
<script src="paypal-integration.js"></script>
<script src="paypal-ui-widget.js"></script>
<script src="merlin-paypal-integration.js"></script>
```

### Initialize PayPal Widget

```html
<!-- Add container for PayPal widget -->
<div id="paypal-widget-container"></div>

<script>
    // Initialize PayPal widget
    const paypalWidget = new PayPalUIWidget('paypal-widget-container', {
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        theme: 'dark', // dark or light
        compact: false, // true for icon-only button
        showBalance: true
    });
</script>
```

---

## 📖 Usage

### 1. Invoice Management

#### Create and Send Invoice

```javascript
// Initialize PayPal
const paypal = new PayPalIntegration({
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    sandbox: true
});

// Create invoice
const invoice = await paypal.createInvoice({
    detail: {
        invoice_number: 'INV-001',
        invoice_date: '2025-12-19'
    },
    invoicerEmail: 'BarbrickDesign@gmail.com',
    recipients: [{
        billing_info: {
            email_address: 'customer@example.com'
        }
    }],
    items: [{
        name: 'GemBot Training Session',
        quantity: '1',
        unit_amount: {
            currency_code: 'USD',
            value: '150.00'
        }
    }]
});

// Send invoice
await paypal.sendInvoice(invoice.id);
console.log('Invoice sent:', invoice.id);
```

#### List Invoices

```javascript
const result = await paypal.listInvoices({
    page: 1,
    pageSize: 10
});

console.log('Invoices:', result.items);
```

### 2. Payment Processing

#### Create Payment Order

```javascript
const order = await paypal.createOrder({
    intent: 'CAPTURE',
    purchaseUnits: [{
        reference_id: 'GEMBOT-ORDER-001',
        description: 'GemBot Service',
        amount: {
            currency_code: 'USD',
            value: '50.00'
        }
    }]
});

// Get approval link
const approveLink = order.links.find(l => l.rel === 'approve').href;
console.log('Pay here:', approveLink);
```

#### Capture Payment

```javascript
const result = await paypal.captureOrder(orderId);
console.log('Payment captured:', result);
```

#### Quick Payment Helper

```javascript
const order = await paypal.processGemBotPayment({
    amount: '99.99',
    description: 'GemBot Premium Service',
    referenceId: 'CUSTOM-REF-123'
});
```

### 3. PayPal Buttons

```html
<div id="paypal-button-container"></div>

<script>
    paypal.Buttons({
        createOrder: async (data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: '10.00' }
                }]
            });
        },
        onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            alert('Payment successful!');
            console.log(order);
        }
    }).render('#paypal-button-container');
</script>
```

### 4. Subscription Management

#### Create Subscription Plan

```javascript
const plan = await paypal.createSubscriptionPlan({
    productId: 'PROD-XXX',
    name: 'GemBot Premium Monthly',
    description: 'Premium access to GemBot features',
    billingCycles: [{
        frequency: {
            interval_unit: 'MONTH',
            interval_count: 1
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        pricing_scheme: {
            fixed_price: {
                value: '29.99',
                currency_code: 'USD'
            }
        }
    }]
});
```

#### Create Subscription

```javascript
const subscription = await paypal.createSubscription({
    planId: plan.id,
    subscriber: {
        email_address: 'subscriber@example.com',
        name: {
            given_name: 'John',
            surname: 'Doe'
        }
    }
});
```

### 5. Transaction Reporting

```javascript
// List recent transactions
const transactions = await paypal.listTransactions({
    startDate: '2025-12-01T00:00:00Z',
    endDate: '2025-12-19T23:59:59Z',
    pageSize: 100
});

console.log('Transactions:', transactions.transaction_details);
```

---

## 🧙‍♂️ Merlin AI Integration

### Talk to Merlin for Payment Operations

Users can interact with PayPal through natural conversation with Merlin AI.

#### Example Conversations

**Create Invoice:**
```
User: "Create an invoice for $150 to customer@email.com for consulting"
Merlin: ✅ Invoice created and sent!
        Invoice ID: INV-XXXX
        Amount: $150
        Recipient: customer@email.com
```

**View Transactions:**
```
User: "Show my recent transactions"
Merlin: 📊 Recent Transactions:
        1. TXN-123 - $150.00 USD
        2. TXN-124 - $50.00 USD
```

**Create Payment:**
```
User: "Create payment link for $29.99"
Merlin: 💳 Payment link created!
        Order ID: ORDER-XXX
        Amount: $29.99
        [Complete Payment] (clickable link)
```

#### Setup Merlin PayPal Integration

```javascript
// Initialize Merlin AI (your existing implementation)
const merlin = window.merlinAI || {};

// Initialize PayPal
const paypal = new PayPalIntegration({
    clientId: window.PAYPAL_CONFIG.clientId,
    clientSecret: window.PAYPAL_CONFIG.clientSecret,
    sandbox: true
});

// Connect Merlin with PayPal
const merlinPayPal = new MerlinPayPalIntegration(paypal, merlin);

// Process messages through PayPal integration
async function handleMerlinMessage(message, userId) {
    // Check for PayPal intents
    const paypalResponse = await merlinPayPal.processMessage(message, userId);
    
    if (paypalResponse) {
        // Display PayPal response in chat
        displayMerlinResponse(paypalResponse.message);
        return;
    }
    
    // Handle other Merlin functionality
    // ... your existing Merlin code
}
```

---

## 🔒 Security Best Practices

### 1. Never Expose Client Secret in Browser

❌ **WRONG:**
```html
<script>
    const paypal = new PayPalIntegration({
        clientSecret: 'YOUR_SECRET' // NEVER DO THIS!
    });
</script>
```

✅ **CORRECT:**
```javascript
// Use server-side API
fetch('/api/paypal/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
});
```

### 2. Use Environment Variables

```javascript
// Server-side only
require('dotenv').config();
const secret = process.env.PAYPAL_CLIENT_SECRET;
```

### 3. Validate All Inputs

```javascript
// Validate amounts
if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount');
}

// Validate emails
if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Invalid email');
}
```

### 4. Use Sandbox for Testing

Always test with sandbox credentials before going to production:

```javascript
const paypal = new PayPalIntegration({
    sandbox: true // Always true during development
});
```

### 5. Implement Rate Limiting

```javascript
// Limit API calls per user
const rateLimiter = new Map();
const MAX_CALLS_PER_MINUTE = 10;
```

---

## 🛠️ API Reference

### PayPalIntegration Class

#### Constructor
```javascript
new PayPalIntegration(config)
```

**Parameters:**
- `config.clientId` (string) - PayPal Client ID
- `config.clientSecret` (string) - PayPal Client Secret
- `config.sandbox` (boolean) - Use sandbox environment (default: true)
- `config.currency` (string) - Default currency (default: 'USD')

#### Methods

##### createInvoice(invoiceData)
Create a new invoice.

**Returns:** Promise<Invoice>

##### sendInvoice(invoiceId)
Send an invoice to recipient.

**Returns:** Promise<boolean>

##### listInvoices(params)
List invoices with pagination.

**Returns:** Promise<InvoiceList>

##### createOrder(orderData)
Create a payment order.

**Returns:** Promise<Order>

##### captureOrder(orderId)
Capture payment for an order.

**Returns:** Promise<CaptureResult>

##### createSubscriptionPlan(planData)
Create a subscription plan.

**Returns:** Promise<Plan>

##### listTransactions(params)
List transactions with filters.

**Returns:** Promise<TransactionList>

---

## 🐛 Troubleshooting

### Issue: "Failed to get access token"

**Solution:**
1. Verify your Client ID and Secret are correct
2. Check if credentials are for the right environment (sandbox vs production)
3. Ensure your app is approved in PayPal Developer Dashboard

### Issue: "CORS error"

**Solution:**
- Use the PayPal API server for server-side operations
- Or configure CORS headers on your server:
  ```javascript
  app.use(cors({
      origin: 'https://yourdomain.com'
  }));
  ```

### Issue: "Invoice not sending"

**Solution:**
1. Verify recipient email is valid
2. Check invoice has all required fields
3. Ensure invoice is in correct status for sending
4. Check PayPal API logs for specific error

### Issue: "PayPal buttons not appearing"

**Solution:**
1. Ensure PayPal SDK script is loaded:
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_ID"></script>
   ```
2. Check browser console for errors
3. Verify container element exists
4. Check if client ID is valid

---

## 📞 Support

For issues or questions:

- **Email:** BarbrickDesign@gmail.com
- **GitHub:** [barbrickdesign/GemBotAiWebControl](https://github.com/barbrickdesign/GemBotAiWebControl)
- **PayPal Developer Docs:** [developer.paypal.com](https://developer.paypal.com)

---

## 📄 License

Copyright © 2024-2025 Ryan Barbrick / Barbrick Design. All Rights Reserved.

This PayPal integration is part of the GemBot AI Control System proprietary software.

---

## 🎯 Quick Start Checklist

- [ ] Get PayPal API credentials from Developer Dashboard
- [ ] Copy `.env.example` to `.env` and add credentials
- [ ] Install npm dependencies (`npm install`)
- [ ] Add PayPal configuration to HTML pages
- [ ] Initialize PayPal widget on desired pages
- [ ] Test with sandbox credentials
- [ ] Integrate with Merlin AI for conversational payments
- [ ] Switch to production credentials when ready

---

**Built with ❤️ by Ryan Barbrick**
