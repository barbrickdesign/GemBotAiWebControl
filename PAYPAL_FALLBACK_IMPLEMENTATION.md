# PayPal SDK Fallback Implementation

## Overview

This implementation provides an automatic fallback mechanism for the PayPal SDK to ensure payment functionality remains available even when the primary API is not working.

## How It Works

### Primary SDK
The primary PayPal SDK is loaded via a script tag in the HTML:
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
```

### Fallback SDK
If the primary SDK fails to load or is not working, the system automatically loads a fallback SDK using:

**Fallback Client ID:**
```
BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg
```

**Fallback Configuration:**
- Components: `hosted-buttons`
- Enable Funding: `venmo`
- Currency: `USD`

**Full Fallback URL:**
```
https://www.paypal.com/sdk/js?client-id=BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg&components=hosted-buttons&enable-funding=venmo&currency=USD
```

## Files Modified

### New Files Created
1. **paypal-sdk-loader.js** - Automatic PayPal SDK loader with fallback logic

### Files Updated
1. **GemBot_Control_AI.html** - Added paypal-sdk-loader.js script tag
2. **pickEm.html** - Added paypal-sdk-loader.js script tag
3. **paypal-machine-licensing.js** - Updated documentation to reference fallback
4. **gbuv-paypal-topup.js** - Updated documentation to reference fallback

## Implementation Details

### Automatic Detection and Loading

The `paypal-sdk-loader.js` module:

1. **Checks for Existing SDK**: First checks if PayPal SDK is already loaded
2. **Waits for Primary**: If a PayPal script tag exists, waits for it to load
3. **Loads Fallback**: If primary fails or times out, automatically loads fallback
4. **Retry Logic**: Attempts to load the fallback SDK up to 2 times with delays
5. **Event Notifications**: Dispatches events when SDK is ready or fails

### Events

#### `paypal-sdk-ready`
Dispatched when PayPal SDK is successfully loaded (primary or fallback)

```javascript
window.addEventListener('paypal-sdk-ready', (event) => {
    console.log('PayPal SDK Ready:', event.detail);
    // event.detail.isPrimary - true if primary SDK loaded
    // event.detail.isFallback - true if fallback SDK loaded
    // event.detail.paypal - PayPal SDK object
});
```

#### `paypal-sdk-error`
Dispatched when both primary and fallback fail

```javascript
window.addEventListener('paypal-sdk-error', (event) => {
    console.error('PayPal SDK Error:', event.detail.error);
});
```

### Callbacks

You can also use global callbacks:

```javascript
// Called when SDK is ready
window.onPayPalReady = function(paypal) {
    console.log('PayPal SDK is ready:', paypal);
};

// Called on error
window.onPayPalError = function(error) {
    console.error('PayPal SDK error:', error);
};
```

## Usage

### In HTML Files

Add the paypal-sdk-loader.js script after any existing PayPal SDK script tags:

```html
<!-- Primary PayPal SDK (optional) -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

<!-- PayPal SDK Loader with Fallback -->
<script src="./paypal-sdk-loader.js"></script>
```

The loader will:
- Use the primary SDK if it loads successfully
- Automatically load the fallback if primary fails
- Notify your application when ready

### Checking SDK Status

```javascript
// Check if PayPal SDK is ready
if (window.PayPalSDKLoader.isReady()) {
    console.log('PayPal SDK is ready to use');
}

// Get detailed status
const status = window.PayPalSDKLoader.getStatus();
console.log('Status:', status);
// {
//     ready: true/false,
//     primaryLoaded: true/false,
//     fallbackLoaded: true/false,
//     loading: true/false,
//     error: null or error message
// }
```

## Testing

### Test Primary SDK Success
1. Load a page with valid primary PayPal client-id
2. Check console for: "✅ PayPal SDK loaded successfully"
3. Verify `window.paypal` object is available

### Test Fallback Activation
1. Load a page with invalid or missing primary client-id
2. Check console for: "⚠️ No PayPal SDK detected, loading fallback..."
3. Check console for: "✅ PayPal fallback SDK loaded successfully"
4. Verify `window.paypal` object is available

### Test Complete Failure
1. Block paypal.com in browser network settings
2. Check console for retry attempts
3. Check console for: "❌ PayPal fallback SDK failed to load"
4. Verify error event is dispatched

## Configuration

You can modify the fallback configuration in `paypal-sdk-loader.js`:

```javascript
config: {
    // Fallback PayPal SDK configuration
    fallbackClientId: 'YOUR_FALLBACK_CLIENT_ID',
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
}
```

## Benefits

✅ **Automatic Fallback**: No manual intervention required when primary API fails  
✅ **Seamless Experience**: Users don't see errors or broken payment flows  
✅ **Retry Logic**: Multiple attempts to load SDK before giving up  
✅ **Event-Driven**: Easy integration with existing code via events  
✅ **Status Monitoring**: Check SDK status at any time  
✅ **Zero Breaking Changes**: Works alongside existing PayPal implementations  

## Payment Systems Using This

1. **Machine Licensing** (`paypal-machine-licensing.js`)
   - $4200 CNC machine licenses
   - Payment to: BarbrickDesign@gmail.com

2. **GBUV Token Top-Up** (`gbuv-paypal-topup.js`)
   - GBUV token purchases
   - Payment to: barbrickdesign@gmail.com

3. **PickEm AI** (`pickEm.html`)
   - Lottery number generation credits
   - Demo payment system

## Support

For issues or questions about PayPal integration:
- Email: BarbrickDesign@gmail.com
- Owner: Ryan Barbrick / Barbrick Design

## Copyright

© 2024-2025 Ryan Barbrick. All Rights Reserved.
