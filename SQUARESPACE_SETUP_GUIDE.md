# 🚀 GemBot AI Control System - Squarespace Integration Guide

**Owner:** Ryan Barbrick / Barbrick Design  
**Contact:** BarbrickDesign@gmail.com  
**Date:** December 15, 2025

---

## 📋 Quick Setup (5 Minutes)

### Step 1: Upload Files to GitHub Pages

1. Go to your GitHub repository: `barbrickdesign/GemBotAiWebControl`
2. Enable GitHub Pages:
   - Go to **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** → **/root**
   - Click **Save**
3. Wait 2-3 minutes for deployment
4. Your GemBot URL will be: `https://barbrickdesign.github.io/GemBotAiWebControl/`

### Step 2: Copy Code Injection File

1. Open [SQUARESPACE_INTEGRATION.html](v:\GemBotMemory2025\GemBotAiWebControl\SQUARESPACE_INTEGRATION.html)
2. Select ALL content (Ctrl+A)
3. Copy to clipboard (Ctrl+C)

### Step 3: Add to Squarespace

1. Log in to your Squarespace site
2. Go to: **Settings** → **Advanced** → **Code Injection**
3. Find the **HEADER** section
4. Paste the entire code
5. Click **Save**

### Step 4: Verify Installation

1. Visit your Squarespace site
2. Open browser console (F12)
3. Look for: `"🚀 Initializing GemBot AI Control System on Squarespace..."`
4. You should see:
   - ✅ Merlin AI card (floating wizard) appears
   - ✅ Live Activity Feed (bottom-right)
   - ✅ No error messages

---

## 🎯 What Gets Added to Your Site

### Features Automatically Included:

1. **🧙 Merlin AI Assistant**
   - Floating 3D card interface
   - Intelligent chat responses
   - Always accessible

2. **📡 Live Activity Feed**
   - Real-time site activity
   - AI agent actions
   - Error display
   - User interactions

3. **🤖 AI Agent System**
   - 4+ autonomous AI agents
   - Testing and engagement
   - Leaderboard integration

4. **💰 Solana Wallet Integration**
   - $GBUV token support
   - Wallet management
   - Transaction logging

5. **🎮 Game Systems**
   - GemBot Farm
   - GemBot Forge
   - Marketplace
   - 3D visualization

6. **📊 Real-Time Stats**
   - Player leaderboard
   - Achievement tracking
   - Performance metrics

---

## ⚙️ Configuration

### Update Base URL

In the code injection, find this line:

```javascript
window.GEMBOT_BASE_URL = 'https://barbrickdesign.github.io/GemBotAiWebControl/';
```

**Change to your actual hosting location:**

#### Option 1: GitHub Pages (Recommended)
```javascript
window.GEMBOT_BASE_URL = 'https://yourusername.github.io/YourRepo/';
```

#### Option 2: Custom Domain
```javascript
window.GEMBOT_BASE_URL = 'https://yourdomain.com/gembot/';
```

#### Option 3: Squarespace Storage (Advanced)
```javascript
window.GEMBOT_BASE_URL = '/s/gembot/'; // Upload to Squarespace File Storage
```

---

## 🎨 Customization Options

### Position Merlin Card

Add this CSS to your Squarespace **Custom CSS**:

```css
/* Move Merlin to different position */
.merlin-card-container {
    right: 20px !important;  /* Distance from right */
    bottom: 100px !important; /* Distance from bottom */
    top: auto !important;
}
```

### Position Activity Feed

```css
/* Move activity feed */
#live-activity-feed {
    bottom: 20px !important;
    left: 20px !important;  /* Move to left side */
    right: auto !important;
}
```

### Hide on Mobile

```css
@media (max-width: 768px) {
    .merlin-card-container,
    #live-activity-feed {
        display: none !important;
    }
}
```

### Change Colors

```css
/* Customize activity feed colors */
#live-activity-feed {
    border-color: #your-color !important;
    background: rgba(your, colors, here, 0.95) !important;
}
```

---

## 🔧 Advanced Configuration

### Disable Specific Features

Add to header code injection BEFORE the script loads:

```javascript
<script>
    // Disable specific features
    window.GEMBOT_CONFIG = {
        disableAIAgents: false,      // Set true to disable AI agents
        disableActivityFeed: false,  // Set true to hide activity feed
        disableMerlinCard: false,    // Set true to hide Merlin
        disable3D: false,            // Set true to disable 3D features
        disableWallet: false,        // Set true to disable wallet features
        
        // Custom settings
        agentCount: 4,               // Number of AI agents (1-10)
        activityFeedPosition: 'bottom-right', // Position: top-left, top-right, bottom-left, bottom-right
        merlinStartMinimized: false  // Start Merlin minimized
    };
</script>
```

### Custom Initialization

```javascript
<script>
    window.addEventListener('gembot-loaded', function() {
        console.log('GemBot is ready!');
        
        // Custom code here
        if (window.liveActivityFeed) {
            window.liveActivityFeed.log('SYSTEM', 'Welcome to my site!');
        }
    });
</script>
```

---

## 🐛 Troubleshooting

### Problem: "Failed to Load GemBot"

**Solutions:**
1. Check BASE_URL is correct
2. Verify GitHub Pages is enabled
3. Wait 2-3 minutes after enabling GitHub Pages
4. Check browser console for specific errors

### Problem: Merlin Card Not Visible

**Solutions:**
1. Check z-index conflicts with Squarespace theme
2. Add to Custom CSS:
   ```css
   .merlin-card-container {
       z-index: 999999999 !important;
   }
   ```
3. Clear browser cache (Ctrl+Shift+Del)

### Problem: Activity Feed Not Appearing

**Solutions:**
1. Verify `live-activity-feed.js` loaded (check console)
2. Check for JavaScript errors blocking initialization
3. Add to Custom CSS:
   ```css
   #live-activity-feed {
       display: block !important;
       visibility: visible !important;
   }
   ```

### Problem: Scripts Not Loading

**Solutions:**
1. Check BASE_URL ends with `/`
2. Verify all files uploaded to GitHub
3. Check CORS settings on your hosting
4. Try different CDN for dependencies

### Problem: Conflicts with Squarespace Features

**Solutions:**
1. Ensure code is in HEADER section (not footer)
2. Add no-conflict mode:
   ```javascript
   window.GEMBOT_NO_CONFLICT = true;
   ```
3. Contact support: BarbrickDesign@gmail.com

---

## 📊 Performance Optimization

### Lazy Load for Better Performance

```javascript
<script>
    // Only load GemBot when user scrolls or interacts
    let gemBotLoaded = false;
    
    function loadGemBot() {
        if (gemBotLoaded) return;
        gemBotLoaded = true;
        
        // Trigger GemBot load
        initGemBot();
    }
    
    // Load on scroll
    window.addEventListener('scroll', loadGemBot, { once: true });
    
    // Load on click
    document.addEventListener('click', loadGemBot, { once: true });
    
    // Load after 3 seconds anyway
    setTimeout(loadGemBot, 3000);
</script>
```

### Reduce AI Agent Count

```javascript
<script>
    window.GEMBOT_CONFIG = {
        agentCount: 2  // Lower number = better performance
    };
</script>
```

---

## 🎯 Testing Checklist

After installation, verify:

- [ ] No console errors
- [ ] Merlin card appears
- [ ] Activity feed visible
- [ ] Can chat with Merlin
- [ ] Activity feed updates
- [ ] Site loads normally
- [ ] Mobile responsive
- [ ] No Squarespace conflicts

---

## 🌐 Hosting Options Comparison

| Option | Speed | Cost | Setup Difficulty | Updates |
|--------|-------|------|------------------|---------|
| **GitHub Pages** | ⭐⭐⭐⭐⭐ | Free | Easy | Auto via Git |
| **Custom Domain** | ⭐⭐⭐⭐⭐ | Paid | Medium | Manual |
| **Squarespace Storage** | ⭐⭐⭐ | Free | Hard | Manual upload |
| **CDN (Cloudflare)** | ⭐⭐⭐⭐⭐ | Free/Paid | Medium | Manual |

**Recommendation:** Use **GitHub Pages** for easiest setup and automatic updates.

---

## 📞 Support & Updates

### Getting Help

**Email:** BarbrickDesign@gmail.com  
**Subject:** "GemBot Squarespace Support"  
**Include:**
- Your Squarespace site URL
- Browser console errors (screenshot)
- Description of issue

### Updating GemBot

1. Push updates to your GitHub repository
2. GitHub Pages auto-deploys (2-3 minutes)
3. Squarespace users get updates automatically
4. No code injection changes needed!

### Version Checking

Add to any page on your site:

```html
<script>
    console.log('GemBot Version:', window.GEMBOT_VERSION || 'Unknown');
</script>
```

---

## 🎨 Example Customizations

### Branded Welcome Message

```javascript
<script>
    window.addEventListener('gembot-loaded', function() {
        setTimeout(function() {
            if (window.liveActivityFeed) {
                window.liveActivityFeed.log('SYSTEM', 'Welcome to [Your Company Name]! 🚀');
                window.liveActivityFeed.log('MERLIN', 'I\'m Merlin, your AI assistant. How can I help?');
            }
        }, 2000);
    });
</script>
```

### Custom Merlin Personality

```javascript
<script>
    window.GEMBOT_CONFIG = {
        merlinPersonality: 'friendly', // Options: professional, friendly, playful, technical
        merlinGreeting: 'Welcome! I\'m here to guide you through GemBot.',
        activityFeedTitle: 'Site Activity'
    };
</script>
```

### Integration with Squarespace Forms

```javascript
<script>
    // Notify GemBot when someone submits a form
    document.addEventListener('submit', function(e) {
        if (window.liveActivityFeed) {
            window.liveActivityFeed.log('USER', 'New form submission received! 📝');
        }
    });
</script>
```

---

## 🚀 Going Live Checklist

Before launching on your live site:

1. **Test on staging site first**
   - Squarespace allows trial sites
   - Test all features thoroughly

2. **Verify mobile responsiveness**
   - Check on real mobile devices
   - Test landscape and portrait

3. **Check performance**
   - Use Google PageSpeed Insights
   - Ensure acceptable load times

4. **Review privacy**
   - GemBot stores data in browser localStorage
   - No external data collection
   - Review with legal team if needed

5. **Monitor console**
   - Check for errors first 24 hours
   - Monitor user feedback

6. **Backup**
   - Save code injection to separate file
   - Document customizations made

---

## 💡 Best Practices

### DO:
✅ Test on staging site first  
✅ Keep BASE_URL updated  
✅ Monitor browser console  
✅ Customize for your brand  
✅ Update regularly via GitHub  

### DON'T:
❌ Modify core GemBot files directly  
❌ Remove copyright notices  
❌ Use in iframe (won't work properly)  
❌ Disable security features  
❌ Forget to test mobile  

---

## 📈 Analytics Integration

### Track GemBot Usage

```javascript
<script>
    window.addEventListener('gembot-loaded', function() {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'gembot_loaded', {
                'event_category': 'engagement',
                'event_label': 'GemBot AI Initialized'
            });
        }
        
        // Track Merlin interactions
        if (window.merlinCard) {
            window.merlinCard.onMessage = function(msg) {
                gtag('event', 'merlin_chat', {
                    'event_category': 'engagement',
                    'event_label': 'Merlin AI Chat'
                });
            };
        }
    });
</script>
```

---

## 🎉 Success!

Your GemBot AI Control System is now live on Squarespace! 🚀

**What's Next?**

1. Test all features
2. Customize appearance
3. Monitor user engagement
4. Share feedback: BarbrickDesign@gmail.com

---

**Created by:** Ryan Barbrick  
**Signature:** GBOT-RB-2025-7X9K2M4P-BARBRICK  
**Last Updated:** December 15, 2025
