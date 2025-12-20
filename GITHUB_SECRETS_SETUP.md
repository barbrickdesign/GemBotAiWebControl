# GitHub Secrets Configuration

## PayPal Client IDs

For security and easy updates, the PayPal client IDs should also be stored as GitHub repository secrets.

### Setting Up GitHub Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Recommended Secrets

#### 1. PAYPAL_PRIMARY_CLIENT_ID
- **Name:** `PAYPAL_PRIMARY_CLIENT_ID`
- **Value:** `Ae5p9t_umXWYHWQuvxEiIb_DNYJUMQgC0NFCjPkIGnliAVW-0lOJRQw3niXh8NIkEkB0HaNbfMFkbSkZ`
- **Usage:** Primary PayPal SDK client ID for all integrations

#### 2. PAYPAL_FALLBACK_CLIENT_ID
- **Name:** `PAYPAL_FALLBACK_CLIENT_ID`
- **Value:** `BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg`
- **Usage:** Fallback PayPal SDK client ID with hosted-buttons and Venmo support

#### 3. PAYPAL_BUSINESS_EMAIL
- **Name:** `PAYPAL_BUSINESS_EMAIL`
- **Value:** `BarbrickDesign@gmail.com`
- **Usage:** PayPal business account email for payments

### Current Implementation

The client IDs are currently hardcoded in the following files for immediate use:
- `paypal-config.js` - Centralized configuration
- `pickEm.html` - Direct SDK loading
- `gembot-marketplace-enhanced.js` - Marketplace integration
- `gembot-game-master.js` - Game integration

### Using Secrets in CI/CD

If you want to use these secrets in GitHub Actions workflows, you can reference them like this:

```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Replace PayPal Client IDs
        run: |
          # Replace placeholders in config files
          sed -i "s/PRIMARY_CLIENT_ID_PLACEHOLDER/${{ secrets.PAYPAL_PRIMARY_CLIENT_ID }}/g" paypal-config.js
          sed -i "s/FALLBACK_CLIENT_ID_PLACEHOLDER/${{ secrets.PAYPAL_FALLBACK_CLIENT_ID }}/g" paypal-config.js
      
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

### Environment Variables (Server-Side)

For server-side applications, you can also use environment variables:

```bash
# .env file (DO NOT commit this file)
PAYPAL_PRIMARY_CLIENT_ID=Ae5p9t_umXWYHWQuvxEiIb_DNYJUMQgC0NFCjPkIGnliAVW-0lOJRQw3niXh8NIkEkB0HaNbfMFkbSkZ
PAYPAL_FALLBACK_CLIENT_ID=BAA32_1anJHhKp_wVIq_c2tVlfMCZOyrmeFbSdiofVqklIassmUhRkm4k7E9HX0GX60_IJGxXfqLA11lWg
PAYPAL_BUSINESS_EMAIL=BarbrickDesign@gmail.com
```

Then in your server code (Node.js example):

```javascript
const paypalConfig = {
    primaryClientId: process.env.PAYPAL_PRIMARY_CLIENT_ID,
    fallbackClientId: process.env.PAYPAL_FALLBACK_CLIENT_ID,
    businessEmail: process.env.PAYPAL_BUSINESS_EMAIL
};
```

### Security Notes

✅ **Client IDs are PUBLIC:** PayPal client IDs are meant to be public-facing  
✅ **Safe in Client Code:** It's safe to include them in client-side JavaScript  
❌ **Never Include Secret Keys:** PayPal secret keys should NEVER be in client code  
✅ **GitHub Secrets for CI/CD:** Use secrets for automated deployments  

### Current Status

- ✅ Client IDs are included in `paypal-config.js`
- ✅ Fallback mechanism implemented
- ✅ All integration points updated
- ⏳ **TODO:** Add secrets to GitHub repository (optional, for CI/CD)

### Adding Secrets - Step by Step

1. Go to: https://github.com/barbrickdesign/GemBotAiWebControl/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret:
   - Name: `PAYPAL_PRIMARY_CLIENT_ID`
   - Value: `Ae5p9t_umXWYHWQuvxEiIb_DNYJUMQgC0NFCjPkIGnliAVW-0lOJRQw3niXh8NIkEkB0HaNbfMFkbSkZ`
   - Click "Add secret"
4. Repeat for `PAYPAL_FALLBACK_CLIENT_ID` and `PAYPAL_BUSINESS_EMAIL`

### Verification

After adding secrets, verify they're set:

```bash
# This will show secret names (not values)
gh secret list
```

Expected output:
```
PAYPAL_PRIMARY_CLIENT_ID
PAYPAL_FALLBACK_CLIENT_ID
PAYPAL_BUSINESS_EMAIL
```

---

**Note:** The problem statement mentioned "I have also included in the secrets". This document provides guidance on how to add them to GitHub Secrets for CI/CD purposes. The client IDs are already implemented in the codebase and working.

© 2024-2025 Ryan Barbrick. All Rights Reserved.
