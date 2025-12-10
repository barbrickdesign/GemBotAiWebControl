# 🏪 GemBot Marketplace Integration Guide

## Overview

The GemBot Marketplace integrates Earth Art Gems real-world jewelry with the in-game economy, allowing players to forge virtual jewelry and eventually convert it to real items using the $GEMBOT crypto token.

## Token Information

- **Token Name**: $GEMBOT
- **Token Address**: `DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump`
- **Network**: Solana
- **Decimals**: 9

## Core Features

### 1. Earth Art Gems Catalog Integration
The marketplace pulls jewelry designs from [earthartgems.com](https://earthartgems.com), including:
- Rings (opal, diamond, topaz, fire agate)
- Pendants and medallions
- Wedding sets
- Custom jewelry pieces

### 2. Forging System
Players can forge virtual copies of jewelry using:
- **Precious Metals**: Gold (🥇), Rose Gold (🌹), Silver (🥈), Platinum (⚪)
- **Cut Gemstones**: From gameplay
- **$GEMBOT Tokens**: Forging fee (default 50 tokens)

### 3. Virtual-to-Real Conversion
- Collect **10 virtual copies** of an item
- Convert to the **real item** from Earth Art Gems
- Payment processed via Solana blockchain
- Item shipped to provided address

### 4. Player Trading
- List forged items for sale
- Browse other players' listings
- Trade with $GEMBOT tokens

## Files Modified/Created

### New Files
- `gembot-marketplace.js` - Complete marketplace system (~1000 lines)

### Modified Files
- `GemBot_Control_AI.html`
  - Added script reference
  - Added marketplace CSS styles (~500 lines)
  - Added marketplaceUI controller object
  - Added item detail modal HTML
  
- `merlin-enhanced-responses.js`
  - Added marketplace knowledge base
  - Added marketplace response templates
  - Added Q&A functionality for marketplace topics

## CSS Classes Added

### Marketplace Layout
- `.marketplace-wallet-bar` - Wallet and token display
- `.marketplace-banner` - Earth Art Gems partnership banner
- `.market-section` - Section containers
- `.featured-items-scroll` - Horizontal scrolling featured items

### Item Display
- `.item-card` - Jewelry item cards
- `.item-detail-modal` - Item detail popup
- `.catalog-item` - Catalog grid items
- `.virtual-progress-bar` - Progress to real item

### Forge System
- `.forge-workshop` - Forge interface
- `.forge-item-selector` - Item selection grid
- `.forge-requirements` - Requirements display
- `.forge-button` - Forge action button

### Metal Shop
- `.metals-grid` - Metal cards grid
- `.metal-card` - Individual metal card
- `.metal-buy-btn` - Purchase buttons

### Trading
- `.trade-section` - Trading interface
- `.trade-listing` - Individual listings
- `.trade-buy-btn` - Buy buttons

### Forms
- `.shipping-form` - Shipping info form
- `.conversion-summary` - Order summary
- `.btn-complete-order` - Order button

## JavaScript API

### GemBotMarketplace Object (gembot-marketplace.js)

```javascript
// Initialize marketplace
await window.GemBotMarketplace.init();

// Get catalog items
const items = GemBotMarketplace.getCatalogForUI(filters);

// Forge an item
const result = await GemBotMarketplace.forgeItem(itemId, playerInventory);

// Check conversion eligibility
const conversion = GemBotMarketplace.checkRealWorldConversion(itemId);

// Buy metals
const result = GemBotMarketplace.buyMetal('gold', grams);

// Get market stats
const stats = GemBotMarketplace.getMarketStats();

// Get inventory summary
const inventory = GemBotMarketplace.getInventorySummary();
```

### marketplaceUI Object (GemBot_Control_AI.html)

```javascript
// Open marketplace
marketplaceUI.open('jewelry');

// View item details
marketplaceUI.showDetail(itemId);

// Close detail modal
marketplaceUI.closeDetail();

// Forge from detail view
marketplaceUI.forgeFromDetail(itemId);

// Connect wallet
marketplaceUI.connectWallet();

// Convert to real item
marketplaceUI.convertToReal(itemId);
```

### MerlinEnhancedResponses (merlin-enhanced-responses.js)

```javascript
// Get marketplace tip
const tip = MerlinEnhancedResponses.generateMarketplaceTip();

// Generate forging message
const msg = MerlinEnhancedResponses.generateForgingMessage(itemName, progress, context);

// Answer marketplace questions
const answer = MerlinEnhancedResponses.answerMarketplaceQuestion(question);
```

## Price Synchronization

Prices are synchronized using:
- Base conversion rate: 1 USD = 100 $GEMBOT tokens
- Token prices fetched from Jupiter DEX API
- Refresh interval: 5 minutes

## User Flow

1. **Browse Catalog**: View Earth Art Gems jewelry in marketplace
2. **Select Item**: Click to see details and forging requirements
3. **Acquire Resources**: 
   - Cut gems through gameplay
   - Buy metals with $GEMBOT tokens
4. **Forge Virtual Copy**: Combine materials to create virtual jewelry
5. **Repeat**: Forge 10 virtual copies
6. **Convert to Real**: Enter shipping info, pay with $GEMBOT
7. **Receive Real Item**: Earth Art Gems ships the actual jewelry

## Merlin AI Integration

Merlin understands and can answer questions about:
- $GEMBOT token and crypto payments
- Earth Art Gems products and catalog
- Forging requirements and process
- Virtual-to-real conversion
- Metal purchasing
- Player trading

Example queries Merlin can handle:
- "What is $GEMBOT?"
- "How do I forge a ring?"
- "How many virtual copies do I need?"
- "What metals can I buy?"
- "How does trading work?"

## Demo Mode

When no Phantom wallet is connected, the system provides a demo wallet with:
- 10,000 $GEMBOT tokens
- Full marketplace functionality
- Simulated transactions

## Future Enhancements

- [ ] Shopify API integration for real-time inventory
- [ ] Jupiter DEX integration for live token prices
- [ ] Phantom wallet deep integration
- [ ] Real-world order tracking
- [ ] NFT certificates for forged items
- [ ] Auction system for rare items
- [ ] Achievement rewards in $GEMBOT

## Technical Notes

- State is persisted to localStorage
- Images loaded with lazy loading
- Responsive design for mobile
- Error handling for wallet disconnection
- Rate limiting for API calls

## Support

For issues with the marketplace:
1. Check browser console for errors
2. Verify wallet connection
3. Refresh catalog if items not loading
4. Contact support at earthartgems.com for order issues

---

*Last Updated: December 2024*
*Version: 1.0.0*
