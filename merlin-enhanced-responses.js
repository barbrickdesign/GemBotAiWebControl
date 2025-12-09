/**
 * 💎 GemBot Enhanced Merlin AI Response System
 * Generates unique, never-duplicate responses with deep context awareness
 * 
 * Features:
 * - Response history tracking to prevent duplicates
 * - Context-aware message generation
 * - Integration with all game systems
 * - Dynamic personality variations
 * - Time-of-day and session-based variations
 * - Mood system for personality depth
 */

const MerlinEnhancedResponses = {
    version: "1.0.0",
    lastUpdated: "2025-12-09",

    // Track recent responses to prevent duplicates
    responseHistory: {
        greetings: [],
        tips: [],
        encouragements: [],
        celebrations: [],
        warnings: [],
        maxHistory: 50 // Remember last 50 of each type
    },

    // Merlin's current mood (affects response style)
    moodState: {
        current: "wise",
        intensity: 0.7,
        lastChanged: Date.now()
    },

    // Mood types and their characteristics
    moods: {
        wise: {
            prefixes: ["Hmm, let me ponder...", "The ancients teach us...", "In my centuries of learning...", "Consider this wisdom..."],
            suffixes: ["...such is the way of the craft.", "...as all masters eventually learn.", "...patience reveals all.", "...the stones themselves guide us."],
            emoji: "🧙"
        },
        excited: {
            prefixes: ["Marvelous!", "By the crystals!", "How splendid!", "Extraordinary!"],
            suffixes: ["...this excites even an old wizard like me!", "...your potential knows no bounds!", "...I haven't seen such promise in ages!", "...the spirits of the stones rejoice!"],
            emoji: "✨"
        },
        cautious: {
            prefixes: ["Careful now...", "Proceed with awareness...", "A word of caution...", "Mind the dangers..."],
            suffixes: ["...haste leads to shattered dreams.", "...even masters respect the risks.", "...better slow than sorry.", "...the craft demands respect."],
            emoji: "⚠️"
        },
        playful: {
            prefixes: ["Aha!", "Well well...", "Now here's a fun thought...", "Between you and me..."],
            suffixes: ["...even wizards need to smile sometimes!", "...but don't tell the other apprentices!", "...the stones appreciate humor too.", "...a light heart cuts better gems!"],
            emoji: "😊"
        },
        mysterious: {
            prefixes: ["The stars whisper...", "In the deepest mines...", "Ancient secrets reveal...", "Between shadow and light..."],
            suffixes: ["...some truths are best discovered alone.", "...the greatest gems hide their beauty.", "...mystery is the heart of mastery.", "...not all knowledge comes from books."],
            emoji: "🔮"
        }
    },

    // Time-based greeting variations
    timeBasedGreetings: {
        earlyMorning: { // 5-8 AM
            phrases: [
                "The dawn breaks, and with it, new possibilities for your craft.",
                "Early risers catch the clearest stones! Your dedication impresses me.",
                "The morning light reveals a gem's true colors. A perfect time to learn.",
                "Few students arrive at this hour. Your commitment speaks volumes."
            ],
            mood: "wise"
        },
        morning: { // 8 AM - 12 PM
            phrases: [
                "A fine morning for the lapidary arts!",
                "The day is young, and so is your potential.",
                "Morning clarity makes for precision cuts.",
                "Fresh minds make the best facets."
            ],
            mood: "excited"
        },
        afternoon: { // 12 - 5 PM
            phrases: [
                "The afternoon sun reminds me of a topaz's inner fire.",
                "Steady hands in the afternoon light—good for detail work.",
                "The day progresses, as does your skill.",
                "Afternoon sessions build lasting muscle memory."
            ],
            mood: "wise"
        },
        evening: { // 5 - 9 PM
            phrases: [
                "Evening's calm brings focus to the finest cuts.",
                "The setting sun paints gems in their truest hues.",
                "Night approaches, but your learning never sleeps.",
                "Evening practice transforms good cutters into great ones."
            ],
            mood: "mysterious"
        },
        night: { // 9 PM - 5 AM
            phrases: [
                "The midnight hour—when true dedication is revealed.",
                "Night owls often become master cutters. The quiet helps.",
                "Stars guide us at this hour. What guides your cuts?",
                "Late night sessions have produced many masterpieces throughout history."
            ],
            mood: "mysterious"
        }
    },

    // Session milestone responses
    sessionMilestones: {
        2: "You return! I remember your curiosity from before.",
        5: "Five sessions together now. Our bond grows.",
        10: "A decade of visits! You're truly committed.",
        25: "Twenty-five sessions—you're becoming a regular!",
        50: "Fifty sessions! Even I'm impressed by such dedication.",
        100: "A hundred sessions! You're practically family now.",
        250: "Two hundred fifty visits. I believe you've surpassed many.",
        500: "Five hundred sessions! A true lifelong learner."
    },

    // Dynamic response templates with variables
    responseTemplates: {
        greeting: {
            firstTime: [
                "Welcome, {title}. I am Merlin, and the crystal arts await your discovery.",
                "A new seeker arrives. I am Merlin—your guide through the lapidary mysteries.",
                "Greetings, fresh spirit. I sense curiosity in you. I am Merlin, keeper of gem wisdom.",
                "Ah, a newcomer to the ancient craft! I am Merlin. Let us begin your transformation."
            ],
            returning: [
                "{timeGreeting} Welcome back, {title}. {sessionMilestone}",
                "Ah, {name}! {timeGreeting} {progressNote}",
                "{timeGreeting} My {title} returns. {lastTopicReference}",
                "The stones whispered of your return, {name}. {encouragement}"
            ],
            reconnection: [
                "Your absence was noted, {name}. {timeAway} But all journeys have pauses. Ready to continue?",
                "You return after {timeAway}! The craft has been patient, as have I.",
                "{name}! {timeAway} since our last session. Much wisdom awaits your rediscovery.",
                "The prodigal student returns! {timeAway}—but mastery has no deadline."
            ]
        },
        tips: {
            beginner: [
                "New cutters should know: {fact}. This foundation saves many stones.",
                "A beginner's secret: {fact}. Master this first.",
                "Before all else, understand: {fact}. Everything builds on this.",
                "The first lesson I give every student: {fact}."
            ],
            intermediate: [
                "Now that you've grown, consider: {fact}. Few think of this.",
                "An intermediate insight for you: {fact}.",
                "Ready for this? {fact}. It separates good from great.",
                "Your skill allows me to share: {fact}. Use it wisely."
            ],
            advanced: [
                "Between masters: {fact}. Only the experienced understand.",
                "A secret I rarely share: {fact}. You've earned this knowledge.",
                "The masters whisper of: {fact}. Now you know too.",
                "Advanced wisdom: {fact}. Handle it with care."
            ]
        },
        encouragement: [
            "Your persistence honors the ancient tradition, {name}.",
            "{name}, your {achievement} shows true growth.",
            "The stones would be proud of your progress, {title}.",
            "I've watched many students—{name}, you stand out.",
            "Every session with you, {title}, reveals new potential.",
            "{name}, you're becoming what you practice."
        ],
        celebration: {
            levelUp: [
                "LEVEL {level}! The crystals sing of {name}'s ascension!",
                "By the ancient gems! {name} reaches level {level}!",
                "A milestone achieved: Level {level}! The craft acknowledges {name}.",
                "{name} grows stronger! Level {level}—new powers await!"
            ],
            perfectCut: [
                "PERFECTION! This cut would make the old masters weep with joy!",
                "Flawless! In {years} years, I've rarely seen such precision!",
                "A perfect cut! The stone's inner fire is fully unleashed!",
                "Magnificent! This is what mastery looks like, {name}!"
            ],
            achievement: [
                "🏆 ACHIEVEMENT UNLOCKED: {achievement}! Well earned, {name}!",
                "{achievement}! Another badge of honor for your journey!",
                "You've earned '{achievement}'! Your collection grows, as does your skill!",
                "Achievement: {achievement}! Few reach this milestone!"
            ]
        },
        warnings: [
            "Careful! {warning}. I've seen many stones lost this way.",
            "A word of caution, {name}: {warning}.",
            "Stop! {warning}. Heed this warning or face consequences.",
            "My experience demands I warn you: {warning}."
        ],
        gameIntegration: [
            "Your {system} skills could improve. Try practicing with {suggestion}.",
            "I notice your {system} progress. Have you considered {suggestion}?",
            "The {system} offers new challenges. {suggestion} might interest you.",
            "Between lessons, the {system} awaits. {suggestion}!"
        ]
    },

    // Facts for tips (categorized by level)
    factDatabase: {
        beginner: [
            "dop wax must be heated slowly—rushing causes weak bonds",
            "quartz is the perfect learner's stone: hard enough to teach, forgiving enough to survive mistakes",
            "the pavilion is always cut first because it's easier to transfer to than a finished crown",
            "water keeps the lap cool and carries away debris—never cut dry",
            "each facet must meet precisely at the girdle or light leaks through",
            "the 96-tooth index wheel gives you 96 possible facet positions",
            "speed control matters: fast removes material, slow creates polish",
            "always check your angles before committing to a cut",
            "patience is not optional in gem cutting—it's mandatory"
        ],
        intermediate: [
            "the 'critical angle' determines how light reflects inside each gem type",
            "a stone's girdle thickness affects durability—too thin cracks, too thick looks dead",
            "pre-forming saves time and reduces risk of chipping fine facets",
            "transfer is the most dangerous moment—support the stone completely",
            "each grit level should remove the scratches of the previous, nothing more",
            "color orientation in rough determines where the best color ends up in the finished stone",
            "lap speed affects both cutting rate and surface temperature",
            "the kerf (cut width) must be considered when calculating final yield"
        ],
        advanced: [
            "dispersion (fire) and brilliance are inversely related at extreme angles",
            "Portuguese cuts maximize fire through multiple tier reflections",
            "inclusions can be hidden by strategic pavilion placement",
            "some master cutters vary angles by 0.1° per tier for optical effects",
            "the 'window' effect from wrong pavilion angles can sometimes be fixed with crown modifications",
            "heat treatment before cutting can improve some stones but ruins others",
            "certain rough shows 'silk' that can create star effects if cut correctly",
            "the relationship between table size and crown angle determines light return vs. fire"
        ]
    },

    /**
     * Get current time period
     */
    getTimePeriod() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 8) return "earlyMorning";
        if (hour >= 8 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 21) return "evening";
        return "night";
    },

    /**
     * Get a unique response that hasn't been used recently
     */
    getUniqueResponse(category, options = []) {
        if (options.length === 0) return null;
        
        const history = this.responseHistory[category] || [];
        const available = options.filter(opt => !history.includes(opt));
        
        // If all options used, clear history and start fresh
        if (available.length === 0) {
            this.responseHistory[category] = [];
            return options[Math.floor(Math.random() * options.length)];
        }
        
        const chosen = available[Math.floor(Math.random() * available.length)];
        
        // Add to history
        if (!this.responseHistory[category]) {
            this.responseHistory[category] = [];
        }
        this.responseHistory[category].push(chosen);
        
        // Trim history if too long
        if (this.responseHistory[category].length > this.maxHistory) {
            this.responseHistory[category].shift();
        }
        
        return chosen;
    },

    /**
     * Update Merlin's mood based on context
     */
    updateMood(context = {}) {
        const moods = Object.keys(this.moods);
        
        // Contextual mood selection
        if (context.achievement || context.levelUp || context.perfectCut) {
            this.moodState.current = "excited";
        } else if (context.warning || context.failure) {
            this.moodState.current = "cautious";
        } else if (context.firstTime || context.milestone) {
            this.moodState.current = "wise";
        } else if (context.game || context.playful) {
            this.moodState.current = "playful";
        } else if (context.night || context.deepQuestion) {
            this.moodState.current = "mysterious";
        } else {
            // Random mood shift occasionally
            if (Math.random() < 0.1) {
                this.moodState.current = moods[Math.floor(Math.random() * moods.length)];
            }
        }
        
        this.moodState.lastChanged = Date.now();
        this.moodState.intensity = 0.5 + Math.random() * 0.5;
    },

    /**
     * Apply mood styling to a response
     */
    applyMood(message) {
        const mood = this.moods[this.moodState.current];
        if (!mood || this.moodState.intensity < 0.5) return message;
        
        // Only apply mood styling sometimes for variety
        if (Math.random() > this.moodState.intensity) return message;
        
        const prefix = mood.prefixes[Math.floor(Math.random() * mood.prefixes.length)];
        const suffix = mood.suffixes[Math.floor(Math.random() * mood.suffixes.length)];
        
        // Randomly choose prefix, suffix, or both
        const style = Math.random();
        if (style < 0.33) return `${prefix} ${message}`;
        if (style < 0.66) return `${message} ${suffix}`;
        return `${prefix} ${message} ${suffix}`;
    },

    /**
     * Fill template variables
     */
    fillTemplate(template, vars = {}) {
        let result = template;
        for (const [key, value] of Object.entries(vars)) {
            result = result.replace(new RegExp(`{${key}}`, 'g'), value);
        }
        return result;
    },

    /**
     * Generate a unique greeting
     */
    generateGreeting(context = {}) {
        const timePeriod = this.getTimePeriod();
        const timeData = this.timeBasedGreetings[timePeriod];
        const timeGreeting = this.getUniqueResponse('timeGreetings', timeData.phrases);
        
        this.updateMood({ firstTime: context.isFirstTime, milestone: context.isMilestone });
        
        const vars = {
            name: context.userName || "seeker",
            title: context.title || "apprentice",
            timeGreeting: timeGreeting,
            sessionMilestone: context.sessionCount ? (this.sessionMilestones[context.sessionCount] || "") : "",
            progressNote: context.progressNote || "",
            lastTopicReference: context.lastTopic ? `I recall we discussed ${context.lastTopic}.` : "",
            encouragement: this.getUniqueResponse('encouragements', this.responseTemplates.encouragement),
            timeAway: context.daysSinceLastVisit ? `${context.daysSinceLastVisit} days` : "some time"
        };
        
        let templates;
        if (context.isFirstTime) {
            templates = this.responseTemplates.greeting.firstTime;
        } else if (context.daysSinceLastVisit > 7) {
            templates = this.responseTemplates.greeting.reconnection;
        } else {
            templates = this.responseTemplates.greeting.returning;
        }
        
        const template = this.getUniqueResponse('greetings', templates);
        const greeting = this.fillTemplate(template, vars);
        
        return this.applyMood(greeting);
    },

    /**
     * Generate a unique tip
     */
    generateTip(context = {}) {
        const skillLevel = context.skillLevel || "beginner";
        const facts = this.factDatabase[skillLevel] || this.factDatabase.beginner;
        const fact = this.getUniqueResponse('facts_' + skillLevel, facts);
        
        const templates = this.responseTemplates.tips[skillLevel] || this.responseTemplates.tips.beginner;
        const template = this.getUniqueResponse('tips', templates);
        
        const vars = {
            fact: fact,
            name: context.userName || "student"
        };
        
        this.updateMood({});
        const tip = this.fillTemplate(template, vars);
        return this.applyMood(tip);
    },

    /**
     * Generate celebration message
     */
    generateCelebration(type, context = {}) {
        this.updateMood({ achievement: true });
        
        const templates = this.responseTemplates.celebration[type] || this.responseTemplates.celebration.achievement;
        const template = this.getUniqueResponse('celebrations', templates);
        
        const vars = {
            name: context.userName || "champion",
            level: context.level || 1,
            achievement: context.achievement || "Unknown Achievement",
            years: Math.floor(Math.random() * 900) + 100 // Merlin's "years of experience"
        };
        
        return this.fillTemplate(template, vars);
    },

    /**
     * Generate warning message
     */
    generateWarning(warningText, context = {}) {
        this.updateMood({ warning: true });
        
        const template = this.getUniqueResponse('warnings', this.responseTemplates.warnings);
        const vars = {
            warning: warningText,
            name: context.userName || "student"
        };
        
        return this.fillTemplate(template, vars);
    },

    /**
     * Generate game integration message
     */
    generateGameIntegration(system, suggestion, context = {}) {
        this.updateMood({ game: true });
        
        const template = this.getUniqueResponse('gameIntegration', this.responseTemplates.gameIntegration);
        const vars = {
            system: system,
            suggestion: suggestion,
            name: context.userName || "player"
        };
        
        return this.fillTemplate(template, vars);
    },

    /**
     * Get statistics about response uniqueness
     */
    getResponseStats() {
        const stats = {};
        for (const [category, history] of Object.entries(this.responseHistory)) {
            stats[category] = {
                used: history.length,
                maxHistory: this.maxHistory
            };
        }
        stats.currentMood = this.moodState.current;
        stats.moodIntensity = this.moodState.intensity;
        return stats;
    },

    /**
     * Reset response history (for testing or fresh start)
     */
    resetHistory() {
        for (const category of Object.keys(this.responseHistory)) {
            this.responseHistory[category] = [];
        }
        console.log('🧙 Merlin response history reset');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MerlinEnhancedResponses;
}

// Global access in browser
if (typeof window !== 'undefined') {
    window.MerlinEnhancedResponses = MerlinEnhancedResponses;
}

console.log('🧙 Merlin Enhanced Response System loaded!');
console.log(`📚 Fact database: ${Object.values(MerlinEnhancedResponses.factDatabase).flat().length} facts`);
console.log(`🎭 Moods available: ${Object.keys(MerlinEnhancedResponses.moods).length}`);
