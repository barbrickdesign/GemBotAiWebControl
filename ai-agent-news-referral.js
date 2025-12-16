/**
 * GemBot Changelog & News Publisher
 * Public-facing changelog and news system for transparency and engagement
 * 
 * @author Ryan Barbrick / Barbrick Design
 */

class ChangelogPublisher {
    constructor() {
        this.changelogs = [];
        this.newsItems = [];
        
        this.init();
    }
    
    init() {
        console.log('📰 Changelog Publisher initialized');
        this.load();
    }
    
    /**
     * Publish daily changelog
     */
    publish(news) {
        const changelog = {
            id: `changelog-${Date.now()}`,
            ...news,
            published: Date.now()
        };
        
        this.changelogs.unshift(changelog);
        
        // Keep last 30 days
        const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
        this.changelogs = this.changelogs.filter(c => c.published > cutoff);
        
        this.save();
        
        console.log('📰 Changelog published:', news.title);
    }
    
    /**
     * Add news item
     */
    addNews(item) {
        this.newsItems.unshift({
            id: `news-${Date.now()}`,
            ...item,
            timestamp: Date.now()
        });
        
        this.save();
    }
    
    /**
     * Generate changelog HTML
     */
    generateHTML() {
        let html = `
            <div class="changelog-container">
                <div class="changelog-header">
                    <h2>📰 What's New</h2>
                    <p>Daily updates, fixes, and improvements</p>
                </div>
                
                <div class="changelog-timeline">
                    ${this.changelogs.map(log => this.generateChangelogHTML(log)).join('')}
                </div>
            </div>
        `;
        
        return html;
    }
    
    /**
     * Generate single changelog HTML
     */
    generateChangelogHTML(changelog) {
        return `
            <div class="changelog-entry">
                <div class="changelog-date">
                    ${new Date(changelog.published).toLocaleDateString()}
                </div>
                <div class="changelog-content">
                    <h3>${changelog.title}</h3>
                    ${changelog.sections.map(section => `
                        <div class="changelog-section">
                            <h4>${section.title}</h4>
                            <ul>
                                ${section.content.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Open changelog UI
     */
    open() {
        let modal = document.getElementById('changelog-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'changelog-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content changelog-modal-content">
                    <button class="modal-close" onclick="window.ChangelogPublisher.close()">×</button>
                    ${this.generateHTML()}
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            modal.querySelector('.modal-content').innerHTML = `
                <button class="modal-close" onclick="window.ChangelogPublisher.close()">×</button>
                ${this.generateHTML()}
            `;
        }
        
        modal.style.display = 'flex';
    }
    
    /**
     * Close changelog UI
     */
    close() {
        const modal = document.getElementById('changelog-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    /**
     * Save to localStorage
     */
    save() {
        try {
            localStorage.setItem('gembot_changelogs', JSON.stringify(this.changelogs));
            localStorage.setItem('gembot_news', JSON.stringify(this.newsItems));
        } catch (error) {
            console.warn('Failed to save changelog:', error);
        }
    }
    
    /**
     * Load from localStorage
     */
    load() {
        try {
            const changelogs = localStorage.getItem('gembot_changelogs');
            const news = localStorage.getItem('gembot_news');
            
            if (changelogs) this.changelogs = JSON.parse(changelogs);
            if (news) this.newsItems = JSON.parse(news);
            
            console.log(`✅ Loaded ${this.changelogs.length} changelogs`);
        } catch (error) {
            console.warn('Failed to load changelog:', error);
        }
    }
}

/**
 * Referral System
 * Track referrals, conversions, and rewards
 */
class ReferralSystem {
    constructor() {
        this.referrals = {};
        this.conversions = [];
        this.rewards = {
            referrer: 1000, // Gems for referrer
            referred: 500   // Gems for new player
        };
        
        this.init();
    }
    
    init() {
        console.log('🔗 Referral System initialized');
        this.load();
        
        // Check for referral code in URL
        this.checkReferralCode();
    }
    
    /**
     * Generate referral link for player
     */
    generateLink(playerId) {
        const code = `REF-${playerId}-${Date.now().toString(36)}`;
        
        this.referrals[code] = {
            referrerId: playerId,
            code,
            created: Date.now(),
            conversions: 0,
            totalReward: 0
        };
        
        this.save();
        
        return `https://gembot.game/ref/${code}`;
    }
    
    /**
     * Check URL for referral code
     */
    checkReferralCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        
        if (refCode && this.referrals[refCode]) {
            this.processReferral(refCode);
        }
    }
    
    /**
     * Process a referral conversion
     */
    processReferral(code) {
        const referral = this.referrals[code];
        
        if (!referral) return;
        
        // Reward referrer
        if (window.GBUV) {
            window.GBUV.addGems(this.rewards.referrer, `referral_bonus_${code}`);
        }
        
        // Reward new player
        if (window.GBUV) {
            window.GBUV.addGems(this.rewards.referred, 'welcome_bonus');
        }
        
        // Track conversion
        referral.conversions++;
        referral.totalReward += this.rewards.referrer;
        
        this.conversions.push({
            code,
            timestamp: Date.now(),
            referrerId: referral.referrerId
        });
        
        this.save();
        
        console.log(`🎁 Referral bonus: ${this.rewards.referred} gems!`);
        
        // Show notification
        if (window.MerlinCardIntegrated) {
            window.MerlinCardIntegrated.showNotification(
                `Welcome! You received ${this.rewards.referred} bonus gems from a referral! 🎁`
            );
        }
    }
    
    /**
     * Get player referral stats
     */
    getPlayerStats(playerId) {
        const playerReferrals = Object.values(this.referrals)
            .filter(r => r.referrerId === playerId);
        
        const totalConversions = playerReferrals.reduce((sum, r) => sum + r.conversions, 0);
        const totalReward = playerReferrals.reduce((sum, r) => sum + r.totalReward, 0);
        
        return {
            referralLinks: playerReferrals.length,
            conversions: totalConversions,
            totalReward
        };
    }
    
    /**
     * Save to localStorage
     */
    save() {
        try {
            localStorage.setItem('gembot_referrals', JSON.stringify(this.referrals));
            localStorage.setItem('gembot_conversions', JSON.stringify(this.conversions));
        } catch (error) {
            console.warn('Failed to save referrals:', error);
        }
    }
    
    /**
     * Load from localStorage
     */
    load() {
        try {
            const referrals = localStorage.getItem('gembot_referrals');
            const conversions = localStorage.getItem('gembot_conversions');
            
            if (referrals) this.referrals = JSON.parse(referrals);
            if (conversions) this.conversions = JSON.parse(conversions);
            
            console.log(`✅ Loaded ${Object.keys(this.referrals).length} referral links`);
        } catch (error) {
            console.warn('Failed to load referrals:', error);
        }
    }
}

// Initialize global systems
window.ChangelogPublisher = new ChangelogPublisher();
window.ReferralSystem = new ReferralSystem();

// Convenience functions
window.openChangelog = () => window.ChangelogPublisher.open();
window.generateReferralLink = (playerId) => window.ReferralSystem.generateLink(playerId);

console.log('✅ Changelog and Referral systems loaded');
console.log('📝 Commands:');
console.log('   openChangelog()           - View updates');
console.log('   generateReferralLink(id)  - Generate referral link');
