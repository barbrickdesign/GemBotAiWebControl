/**
 * 📋 GemBot Changelog & Updates System
 * Tracks all system updates, features, and fixes for Merlin AI awareness
 * 
 * This module provides:
 * - Version history and changelog
 * - Real-time update notifications
 * - Feature announcements for players
 * - Debug/fix tracking for Merlin AI
 * - Integration with Render deployment events
 */

const GemBotChangelog = {
    version: "2.5.0",
    lastUpdated: "2025-12-09T21:00:00Z",
    
    // Current system status
    systemStatus: {
        status: "operational",
        lastDeployment: "2025-12-09T21:00:00Z",
        environment: "production",
        renderServiceId: "srv-d4rodfp5pdvs73bnh0gg"
    },
    
    // Version history with detailed changes
    versions: [
        {
            version: "2.5.0",
            date: "2025-12-09",
            title: "Enhanced AI & Marketplace Update",
            type: "major",
            changes: [
                {
                    category: "AI Enhancement",
                    items: [
                        "Connected MerlinEnhancedResponses module to main AI handler",
                        "Merlin now provides unique, non-repeating responses",
                        "Added marketplace-specific AI responses",
                        "Added gemstone research integration with Arya Intel",
                        "Enhanced mood system for personality depth"
                    ]
                },
                {
                    category: "Marketplace",
                    items: [
                        "Updated rough gem prices to real-world values",
                        "Fixed rough material purchasing (was broken due to wrong price property)",
                        "Adjusted cut gem values for realistic pricing",
                        "Updated lap, paste, and consumable prices"
                    ]
                },
                {
                    category: "UI/UX",
                    items: [
                        "Chat messages now show newest at top",
                        "Fixed camera video stretching issue",
                        "Fixed rotate overlay appearing on desktop",
                        "Improved strict mobile detection"
                    ]
                },
                {
                    category: "3D World",
                    items: [
                        "Added 3D Print Lab room with STL gallery",
                        "200+ printable gem-cutting parts available",
                        "NPC dialog system with portraits",
                        "Achievement tracking system",
                        "Key drop system based on achievements"
                    ]
                }
            ],
            fixes: [
                "buyRough() was using shopPrices.rough instead of shopPrices.roughPerCarat",
                "isMobile() now uses strict detection to exclude touch-enabled desktops",
                "handleOrientationChange() called on page load for safety"
            ]
        },
        {
            version: "2.4.0",
            date: "2025-12-08",
            title: "Quantum Visualizer & Arya Intel",
            type: "major",
            changes: [
                {
                    category: "New Features",
                    items: [
                        "Quantum gem visualizer with WebGL shaders",
                        "Arya Intel System for gemstone research",
                        "Real-time stone analysis capabilities",
                        "Recut calculator integration"
                    ]
                }
            ],
            fixes: []
        },
        {
            version: "2.3.0",
            date: "2025-12-07",
            title: "GemForge Economy & Teaching System",
            type: "major",
            changes: [
                {
                    category: "Economy",
                    items: [
                        "GemForge economy with gems currency",
                        "Achievement system with badges",
                        "Daily rewards and bonuses",
                        "Tier-based progression"
                    ]
                },
                {
                    category: "Teaching",
                    items: [
                        "Intelligent teaching path system",
                        "Adaptive lesson difficulty",
                        "Progress tracking across sessions",
                        "Verified learning through machine interaction"
                    ]
                }
            ],
            fixes: [
                "Button behavior on mobile",
                "Step mode execution timing"
            ]
        }
    ],
    
    // Upcoming features (for Merlin to mention)
    upcoming: [
        {
            feature: "Real jewelry forging system",
            eta: "Q1 2025",
            description: "Convert virtual forged items to real Earth Art Gems jewelry"
        },
        {
            feature: "Multiplayer trading",
            eta: "Q1 2025",
            description: "Trade cut gems and forged items with other players"
        },
        {
            feature: "Advanced ML stone analysis",
            eta: "Q1 2025",
            description: "AI-powered stone quality assessment and cutting recommendations"
        }
    ],
    
    // Known issues (for Merlin to help debug)
    knownIssues: [
        {
            id: "ISSUE-001",
            status: "investigating",
            description: "3D world may render unexpectedly on some browsers",
            workaround: "Close and reopen the 3D world from user menu"
        }
    ],
    
    // Get the latest version info
    getLatestVersion() {
        return this.versions[0];
    },
    
    // Get changelog for Merlin to announce
    getRecentChanges(count = 3) {
        const latest = this.versions[0];
        const allChanges = [];
        
        latest.changes.forEach(cat => {
            cat.items.forEach(item => {
                allChanges.push(`${cat.category}: ${item}`);
            });
        });
        
        return allChanges.slice(0, count);
    },
    
    // Generate announcement message for Merlin
    generateAnnouncement() {
        const latest = this.versions[0];
        const highlights = this.getRecentChanges(3);
        
        return `🎉 **GemBot ${latest.version}** is live! (${latest.title})\n\n` +
               `Recent highlights:\n` +
               highlights.map(h => `• ${h}`).join('\n') +
               `\n\nAsk me about any new features!`;
    },
    
    // Check if user has seen latest version
    hasSeenVersion(version) {
        const seen = localStorage.getItem('gembot_seen_version');
        return seen === version;
    },
    
    // Mark version as seen
    markVersionSeen(version) {
        localStorage.setItem('gembot_seen_version', version);
    },
    
    // Get system health for Merlin awareness
    getSystemHealth() {
        return {
            status: this.systemStatus.status,
            version: this.version,
            lastDeployment: this.systemStatus.lastDeployment,
            uptime: this.calculateUptime(),
            knownIssues: this.knownIssues.filter(i => i.status !== 'resolved').length
        };
    },
    
    calculateUptime() {
        const lastDeploy = new Date(this.systemStatus.lastDeployment);
        const now = new Date();
        const diff = now - lastDeploy;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    },
    
    // For Merlin to report issues
    reportIssue(description, context = {}) {
        const issue = {
            id: `ISSUE-${Date.now()}`,
            timestamp: new Date().toISOString(),
            description,
            context,
            status: 'new'
        };
        
        console.log('🐛 Issue reported:', issue);
        
        // Store locally for debugging
        const issues = JSON.parse(localStorage.getItem('gembot_reported_issues') || '[]');
        issues.push(issue);
        localStorage.setItem('gembot_reported_issues', JSON.stringify(issues.slice(-50)));
        
        return issue;
    },
    
    // Get tips about new features for Merlin
    getFeatureTip() {
        const tips = [
            "💡 Did you know? Chat messages now show newest at the top for easier reading!",
            "💡 The marketplace now uses real-world gem prices. Check out the updated rough stone costs!",
            "💡 Try asking me about specific gemstones - I can now provide detailed market info!",
            "💡 Explore the 3D Academy! Click 'Explore Academy' in the user menu.",
            "💡 The 3D Print Lab has 200+ printable parts for your gem cutting equipment!",
            "💡 Your achievements can unlock special keys for new areas in the Academy!",
            "💡 I can now remember what topics you've struggled with and offer targeted help."
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotChangelog;
}

if (typeof window !== 'undefined') {
    window.GemBotChangelog = GemBotChangelog;
}

console.log(`📋 GemBot Changelog loaded - v${GemBotChangelog.version}`);
console.log(`📅 Last updated: ${GemBotChangelog.lastUpdated}`);
