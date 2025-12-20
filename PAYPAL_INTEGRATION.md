# PayPal Integration Guide

## Overview

This document describes the PayPal integration setup for GemBot AI Web Control system.

## Configuration

All PayPal client IDs and configuration are centralized in `paypal-config.js`.

### Client IDs

**Primary Client ID:**
```
Ae5p9t_umXWYHWQuvxEiIb_DNYJUMQgC0NFCjPkIGnliAVW-0lOJRQw3niXh8NIkEkB0HaNbfMFkbSkZ
```

**Fallback Client ID:**
```
BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg
```

The fallback client ID includes:
- `hosted-buttons` component
- Venmo funding enabled

### PayPal Account

**Email:** BarbrickDesign@gmail.com

**Business ID:** BARBRICKDESIGN

## Files Updated

### 1. `paypal-config.js` (NEW)

Centralized PayPal configuration file that includes:
- Primary and fallback client IDs
- PayPal SDK URL generators
- Automatic fallback mechanism
- PayPal.me link generator
- SDK loading utilities

**Usage:**
```javascript
// Include in HTML before other PayPal-dependent scripts
<script src="paypal-config.js"></script>

// Load PayPal SDK with automatic fallback
window.PayPalConfig.loadSDK(
    () => console.log('PayPal loaded'),
    () => console.error('PayPal failed')
);

// Wait for SDK
await window.PayPalConfig.waitForSDK();

// Check if loaded
if (window.PayPalConfig.isLoaded()) {
    // Use PayPal SDK
}
```

### 2. `pickEm.html`

Updated to use the new primary client ID with automatic fallback:
- Primary SDK loads with main client ID
- Falls back to secondary client ID if primary fails
- Includes hosted-buttons and Venmo support in fallback

### 3. `gbuv-paypal-topup.js`

Updated header to reference centralized configuration.
- Uses `paypal-config.js` for client IDs
- Maintains existing GBUV wallet top-up functionality

### 4. `gembot-marketplace-enhanced.js`

Updated PayPal config to use centralized client ID:
```javascript
this.paypalConfig = {
    clientId: window.PayPalConfig ? window.PayPalConfig.primaryClientId : '...',
    donationEmail: 'BarbrickDesign@gmail.com',
    minDonation: 1.00,
    currency: 'USD'
};
```

### 5. `gembot-game-master.js`

Updated payment providers config:
```javascript
paymentProviders: {
    stripe: { enabled: false, publicKey: "" },
    paypal: { 
        enabled: true, 
        clientId: window.PayPalConfig ? window.PayPalConfig.primaryClientId : "..."
    }
}
```

## Integration Guide

### For HTML Pages

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include PayPal Config First -->
    <script src="paypal-config.js"></script>
    
    <!-- Then load PayPal SDK with fallback -->
    <script>
        window.PayPalConfig.loadSDK(
            () => console.log('✅ PayPal SDK loaded'),
            () => console.error('❌ PayPal SDK failed')
        );
    </script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### For JavaScript Modules

```javascript
// Check if PayPalConfig is available
if (window.PayPalConfig) {
    // Use centralized config
    const clientId = window.PayPalConfig.primaryClientId;
    
    // Or load SDK programmatically
    await window.PayPalConfig.waitForSDK();
    
    // Now use window.paypal
    paypal.Buttons({...}).render('#paypal-button');
} else {
    console.warn('PayPalConfig not loaded, using fallback');
}
```

## Fallback Mechanism

The system implements automatic fallback:

1. **Primary Load:** Attempts to load SDK with primary client ID
2. **Fallback:** If primary fails, automatically loads fallback client ID
3. **Error Handling:** If both fail, error callback is triggered

### Fallback Features

The fallback configuration includes:
- `components=hosted-buttons` - Enables hosted button functionality
- `enable-funding=venmo` - Allows Venmo payments
- Full backward compatibility

## Testing

### Test Primary SDK

```javascript
// Should load successfully
window.PayPalConfig.loadSDK(
    () => console.log('✅ Primary SDK works'),
    () => console.log('❌ Primary SDK failed')
);
```

### Test Fallback

To test fallback, you can temporarily block the primary URL or use an invalid client ID:

```javascript
// Force fallback by using invalid primary
window.PayPalConfig.primaryClientId = 'invalid';
window.PayPalConfig.loadSDK(
    () => console.log('✅ Fallback SDK works'),
    () => console.log('❌ Both failed')
);
```

### Verify Client IDs

```javascript
console.log('Primary:', window.PayPalConfig.primaryClientId);
console.log('Fallback:', window.PayPalConfig.fallbackClientId);
console.log('Email:', window.PayPalConfig.paypalEmail);
```

## Security Notes

1. **Client IDs are PUBLIC:** These are meant to be public-facing identifiers
2. **Server-Side Verification:** Always verify payments server-side
3. **Never Store Secrets:** Secret keys should NEVER be in client-side code
4. **HTTPS Required:** PayPal SDK requires HTTPS in production

## Production Checklist

- [x] Update primary client ID
- [x] Configure fallback client ID
- [x] Test primary SDK loading
- [x] Test fallback mechanism
- [x] Verify PayPal email correct
- [ ] Set up server-side payment verification
- [ ] Configure PayPal webhook endpoints
- [ ] Test in production environment
- [ ] Monitor PayPal dashboard for transactions

## Support

**Owner:** Ryan Barbrick / Barbrick Design

**Contact:** BarbrickDesign@gmail.com

**PayPal Account:** BarbrickDesign@gmail.com

## References

- [PayPal SDK Documentation](https://developer.paypal.com/sdk/js/)
- [PayPal Client ID Setup](https://developer.paypal.com/api/rest/)
- [PayPal Webhooks](https://developer.paypal.com/api/rest/webhooks/)

## Changelog

### 2025-12-20
- Created centralized `paypal-config.js`
- Updated `pickEm.html` with new client IDs and fallback
- Updated `gbuv-paypal-topup.js` documentation
- Updated `gembot-marketplace-enhanced.js` with new client ID
- Updated `gembot-game-master.js` with new client ID and enabled PayPal
- Added comprehensive documentation

---

© 2024-2025 Ryan Barbrick. All Rights Reserved.
