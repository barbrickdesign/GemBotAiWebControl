# PayPal Fallback Quick Reference

## Quick Start

### 1. Include the Loader
Add to your HTML file after any existing PayPal SDK script:

```html
<script src="./paypal-sdk-loader.js"></script>
```

### 2. That's It!
The fallback is automatic. No code changes needed.

## Fallback Configuration

### Client ID
```
BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg
```

### Parameters
- **Components**: `hosted-buttons`
- **Enable Funding**: `venmo`
- **Currency**: `USD`

### Full URL
```
https://www.paypal.com/sdk/js?client-id=BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg&components=hosted-buttons&enable-funding=venmo&currency=USD
```

## Usage Patterns

### Check if SDK is Ready
```javascript
if (window.PayPalSDKLoader.isReady()) {
    // Use window.paypal
    console.log('PayPal is ready!');
}
```

### Get Status
```javascript
const status = window.PayPalSDKLoader.getStatus();
console.log(status);
// {
//     ready: true,
//     primaryLoaded: false,
//     fallbackLoaded: true,
//     loading: false,
//     error: null
// }
```

### Listen for Events
```javascript
// SDK Ready
window.addEventListener('paypal-sdk-ready', (event) => {
    const { isPrimary, isFallback, paypal } = event.detail;
    console.log('PayPal SDK loaded!');
    if (isFallback) {
        console.log('Using fallback SDK');
    }
});

// SDK Error
window.addEventListener('paypal-sdk-error', (event) => {
    console.error('PayPal failed:', event.detail.error);
});
```

### Use Callbacks
```javascript
// Global callback when ready
window.onPayPalReady = function(paypal) {
    console.log('PayPal SDK is ready:', paypal);
};

// Global callback on error
window.onPayPalError = function(error) {
    console.error('PayPal error:', error);
};
```

## Files Using This

1. **GemBot_Control_AI.html** - Main control interface
2. **pickEm.html** - Lottery number generator
3. **gbuv-paypal-topup.js** - Token top-up system
4. **paypal-machine-licensing.js** - Machine licensing

## Testing

### Quick Test
Open `test-paypal-fallback.html` in browser:
- See real-time status
- View event logs
- Test different scenarios

### Console Test
```javascript
// Check status in console
window.PayPalSDKLoader.getStatus()

// Check if PayPal available
!!window.paypal

// Manually trigger fallback (for testing)
window.PayPalSDKLoader.loadFallback()
```

## Behavior

### When Primary SDK Works
✅ Primary loads normally  
❌ Fallback doesn't load  
📊 Status: `{ primaryLoaded: true, fallbackLoaded: false }`

### When Primary SDK Fails
⚠️ Primary fails or times out  
✅ Fallback loads automatically  
🔄 Retries up to 2 times  
📊 Status: `{ primaryLoaded: false, fallbackLoaded: true }`

### When Both Fail
❌ Primary fails  
❌ Fallback fails after retries  
📊 Status: `{ ready: false, error: "Failed to load PayPal SDK" }`  
🎯 Event: `paypal-sdk-error` dispatched

## Configuration Options

Edit `paypal-sdk-loader.js` to customize:

```javascript
config: {
    fallbackClientId: 'YOUR_FALLBACK_CLIENT_ID',
    fallbackParams: {
        components: 'hosted-buttons',
        'enable-funding': 'venmo',
        currency: 'USD'
    },
    loadTimeout: 10000,    // 10 seconds
    maxRetries: 2,         // 2 retry attempts
    retryDelay: 2000       // 2 seconds between retries
}
```

## Common Issues

### Issue: "PayPalSDKLoader is not defined"
**Solution**: Include `paypal-sdk-loader.js` in your HTML

### Issue: Fallback not loading
**Solution**: Check browser console for errors. May be network blocked.

### Issue: Both SDKs fail
**Solution**: Check network connectivity. PayPal.com may be blocked.

### Issue: Primary loads but functionality broken
**Solution**: Fallback only helps if primary fails to load. If primary loads but is broken (invalid client-id with valid SDK), fallback won't activate. Use valid client-id or remove primary script tag.

## Support

- **Documentation**: PAYPAL_FALLBACK_IMPLEMENTATION.md
- **Test Page**: test-paypal-fallback.html
- **Contact**: BarbrickDesign@gmail.com
- **Owner**: Ryan Barbrick / Barbrick Design

## Copyright

© 2024-2025 Ryan Barbrick. All Rights Reserved.
