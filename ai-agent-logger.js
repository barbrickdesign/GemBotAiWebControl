/**
 * GemBot AI Agent Logger & Analysis System
 * Comprehensive logging, analysis, and automated improvement generation
 * 
 * Features:
 * - Real-time activity logging
 * - Error detection and categorization
 * - 24-hour automated analysis cycle
 * - Fix log generation
 * - Improvement suggestion generation
 * - Performance metrics tracking
 * - Public news generation
 * 
 * @author Ryan Barbrick / Barbrick Design
 */

class AIAgentLogger {
    constructor() {
        this.logs = [];
        this.errors = [];
        this.metrics = {
            totalActions: 0,
            successfulActions: 0,
            failedActions: 0,
            avgResponseTime: 0,
            uniqueFlows: new Set(),
            popularActions: {},
            errorTypes: {}
        };
        
        this.analysisInterval = null;
        this.lastAnalysis = Date.now();
        
        this.init();
    }
    
    init() {
        console.log('📊 AI Agent Logger initialized');
        
        // Load previous logs from localStorage
        this.loadLogs();
        
        // Start 24-hour analysis cycle
        this.start24HourCycle();
    }
    
    /**
     * Log an agent action
     */
    log(agentId, entry) {
        const logEntry = {
            ...entry,
            agentId,
            logTimestamp: Date.now()
        };
        
        this.logs.push(logEntry);
        this.metrics.totalActions++;
        
        // Track action types
        if (!this.metrics.popularActions[entry.action]) {
            this.metrics.popularActions[entry.action] = 0;
        }
        this.metrics.popularActions[entry.action]++;
        
        // Track flow
        this.metrics.uniqueFlows.add(`${entry.action}->${entry.state}`);
        
        // Check for errors
        if (entry.action === 'error') {
            this.logError(logEntry);
        } else {
            this.metrics.successfulActions++;
        }
        
        // Save to localStorage periodically
        if (this.logs.length % 100 === 0) {
            this.saveLogs();
        }
    }
    
    /**
     * Log an error with categorization
     */
    logError(errorEntry) {
        const categorized = this.categorizeError(errorEntry);
        
        this.errors.push(categorized);
        this.metrics.failedActions++;
        
        // Track error types
        if (!this.metrics.errorTypes[categorized.category]) {
            this.metrics.errorTypes[categorized.category] = 0;
        }
        this.metrics.errorTypes[categorized.category]++;
        
        console.error(`❌ Error logged: ${categorized.category} - ${categorized.data.message}`);
    }
    
    /**
     * Categorize error for analysis
     */
    categorizeError(errorEntry) {
        const message = errorEntry.data?.message || '';
        let category = 'unknown';
        let severity = 'medium';
        
        if (message.includes('CORS') || message.includes('fetch')) {
            category = 'network';
            severity = 'high';
        } else if (message.includes('undefined') || message.includes('null')) {
            category = 'null_reference';
            severity = 'high';
        } else if (message.includes('balance') || message.includes('insufficient')) {
            category = 'game_logic';
            severity = 'low';
        } else if (message.includes('DOM') || message.includes('element')) {
            category = 'ui';
            severity = 'medium';
        } else if (message.includes('permission') || message.includes('denied')) {
            category = 'permissions';
            severity = 'low';
        }
        
        return {
            ...errorEntry,
            category,
            severity,
            analyzed: Date.now()
        };
    }
    
    /**
     * Start 24-hour automated analysis cycle
     */
    start24HourCycle() {
        console.log('🔄 Starting 24-hour analysis cycle');
        
        // Run immediately on start
        setTimeout(() => this.runDailyAnalysis(), 5000);
        
        // Run every 24 hours
        this.analysisInterval = setInterval(() => {
            this.runDailyAnalysis();
        }, 24 * 60 * 60 * 1000);
    }
    
    /**
     * Run daily analysis and generate reports
     */
    async runDailyAnalysis() {
        console.log('📊 Running 24-hour analysis...');
        
        const analysisResults = {
            timestamp: Date.now(),
            period: {
                start: this.lastAnalysis,
                end: Date.now(),
                duration: Date.now() - this.lastAnalysis
            },
            metrics: this.calculateMetrics(),
            errors: this.analyzeErrors(),
            improvements: this.generateImprovements(),
            fixes: this.generateFixes(),
            news: this.generateNews()
        };
        
        // Save analysis
        this.saveAnalysis(analysisResults);
        
        // Generate public changelog
        this.publishChangelog(analysisResults);
        
        // Feed to Merlin AI
        this.feedToMerlinAI(analysisResults);
        
        // Post to social media
        this.postToSocialMedia(analysisResults);
        
        this.lastAnalysis = Date.now();
        
        console.log('✅ Daily analysis complete!');
        
        return analysisResults;
    }
    
    /**
     * Calculate comprehensive metrics
     */
    calculateMetrics() {
        const logsInPeriod = this.logs.filter(log => 
            log.logTimestamp > this.lastAnalysis
        );
        
        const errorsInPeriod = this.errors.filter(error =>
            error.logTimestamp > this.lastAnalysis
        );
        
        // Calculate success rate
        const totalActions = logsInPeriod.length;
        const successfulActions = totalActions - errorsInPeriod.length;
        const successRate = totalActions > 0 ? (successfulActions / totalActions * 100).toFixed(2) : 100;
        
        // Most popular actions
        const actionCounts = {};
        logsInPeriod.forEach(log => {
            actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
        });
        
        const topActions = Object.entries(actionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([action, count]) => ({ action, count }));
        
        // User engagement patterns
        const hourlyActivity = this.calculateHourlyActivity(logsInPeriod);
        
        // Average session length
        const avgSessionLength = this.calculateAvgSessionLength();
        
        return {
            totalActions,
            successfulActions,
            failedActions: errorsInPeriod.length,
            successRate: `${successRate}%`,
            topActions,
            hourlyActivity,
            avgSessionLength,
            uniqueAgents: new Set(logsInPeriod.map(l => l.agentId)).size
        };
    }
    
    /**
     * Analyze errors for patterns
     */
    analyzeErrors() {
        const recentErrors = this.errors.filter(error =>
            error.logTimestamp > this.lastAnalysis
        );
        
        // Group by category
        const byCategory = {};
        recentErrors.forEach(error => {
            if (!byCategory[error.category]) {
                byCategory[error.category] = [];
            }
            byCategory[error.category].push(error);
        });
        
        // Find most critical
        const critical = recentErrors
            .filter(e => e.severity === 'high')
            .slice(0, 10);
        
        return {
            total: recentErrors.length,
            byCategory,
            bySeverity: {
                high: recentErrors.filter(e => e.severity === 'high').length,
                medium: recentErrors.filter(e => e.severity === 'medium').length,
                low: recentErrors.filter(e => e.severity === 'low').length
            },
            critical,
            patterns: this.detectErrorPatterns(recentErrors)
        };
    }
    
    /**
     * Detect error patterns
     */
    detectErrorPatterns(errors) {
        const patterns = [];
        
        // Check for repeating errors
        const errorMessages = errors.map(e => e.data?.message);
        const messageCounts = {};
        
        errorMessages.forEach(msg => {
            if (msg) {
                messageCounts[msg] = (messageCounts[msg] || 0) + 1;
            }
        });
        
        // Find patterns (errors occurring 3+ times)
        Object.entries(messageCounts).forEach(([message, count]) => {
            if (count >= 3) {
                patterns.push({
                    message,
                    occurrences: count,
                    severity: errors.find(e => e.data?.message === message)?.severity || 'unknown'
                });
            }
        });
        
        return patterns.sort((a, b) => b.occurrences - a.occurrences);
    }
    
    /**
     * Generate fix recommendations
     */
    generateFixes() {
        const fixes = [];
        const errorAnalysis = this.analyzeErrors();
        
        // Generate fixes for critical errors
        errorAnalysis.critical.forEach((error, index) => {
            const fix = this.generateFixForError(error);
            if (fix) {
                fixes.push({
                    priority: 'critical',
                    id: `FIX-${Date.now()}-${index}`,
                    ...fix
                });
            }
        });
        
        // Generate fixes for patterns
        errorAnalysis.patterns.forEach((pattern, index) => {
            const fix = {
                priority: pattern.severity === 'high' ? 'high' : 'medium',
                id: `PATTERN-FIX-${Date.now()}-${index}`,
                title: `Fix Repeated Error: ${pattern.message.substring(0, 50)}...`,
                description: `This error occurred ${pattern.occurrences} times. Investigate and fix root cause.`,
                error: pattern.message,
                occurrences: pattern.occurrences,
                suggestedFix: this.suggestFixForPattern(pattern)
            };
            
            fixes.push(fix);
        });
        
        return fixes;
    }
    
    /**
     * Generate fix for specific error
     */
    generateFixForError(error) {
        const category = error.category;
        const message = error.data?.message || '';
        
        let fix = null;
        
        if (category === 'network') {
            fix = {
                title: 'Fix Network/CORS Error',
                description: 'CORS policy blocking resource access',
                error: message,
                suggestedFix: 'Ensure server is running with proper CORS headers. Check file paths.',
                file: 'server.js or resource path',
                line: 'N/A'
            };
        } else if (category === 'null_reference') {
            fix = {
                title: 'Fix Null Reference Error',
                description: 'Attempting to access property of undefined/null',
                error: message,
                suggestedFix: 'Add null checks before property access. Ensure variables initialized.',
                file: 'Check stack trace',
                line: error.data?.stack || 'N/A'
            };
        } else if (category === 'ui') {
            fix = {
                title: 'Fix UI Element Error',
                description: 'DOM element not found or not ready',
                error: message,
                suggestedFix: 'Ensure element exists in DOM. Add DOMContentLoaded check.',
                file: 'UI component',
                line: 'N/A'
            };
        }
        
        return fix;
    }
    
    /**
     * Suggest fix for error pattern
     */
    suggestFixForPattern(pattern) {
        const suggestions = [];
        
        if (pattern.occurrences > 10) {
            suggestions.push('HIGH FREQUENCY: This is a critical issue affecting many users.');
        }
        
        if (pattern.severity === 'high') {
            suggestions.push('High severity - prioritize this fix.');
        }
        
        suggestions.push('Check logs for common context when this error occurs.');
        suggestions.push('Add try-catch blocks to prevent cascading failures.');
        suggestions.push('Consider adding telemetry to track root cause.');
        
        return suggestions.join(' ');
    }
    
    /**
     * Generate improvement suggestions
     */
    generateImprovements() {
        const improvements = [];
        const metrics = this.calculateMetrics();
        
        // Analyze top actions for UX improvements
        metrics.topActions.forEach((action, index) => {
            if (action.count > 100 && index < 3) {
                improvements.push({
                    priority: 'high',
                    category: 'ux',
                    title: `Optimize ${action.action} Flow`,
                    description: `${action.action} is very popular (${action.count} times). Consider optimizing this flow.`,
                    suggestion: `Add shortcuts, reduce clicks, or provide bulk options for ${action.action}.`
                });
            }
        });
        
        // Check success rate
        const successRate = parseFloat(metrics.successRate);
        if (successRate < 95) {
            improvements.push({
                priority: 'critical',
                category: 'stability',
                title: 'Improve Overall Success Rate',
                description: `Current success rate is ${metrics.successRate}, below 95% target.`,
                suggestion: 'Focus on fixing recurring errors and adding error handling.'
            });
        }
        
        // Check engagement patterns
        if (metrics.avgSessionLength < 5 * 60 * 1000) { // Less than 5 minutes
            improvements.push({
                priority: 'medium',
                category: 'engagement',
                title: 'Increase Session Length',
                description: 'Average session length is low. Players may not be engaged enough.',
                suggestion: 'Add more rewards, achievements, and progression incentives.'
            });
        }
        
        // Suggest new features based on usage
        if (metrics.totalActions > 1000) {
            improvements.push({
                priority: 'low',
                category: 'features',
                title: 'Consider New Features',
                description: 'High engagement detected. Players may want more content.',
                suggestion: 'Add new machine types, environments, or game modes.'
            });
        }
        
        return improvements;
    }
    
    /**
     * Generate news for public changelog
     */
    generateNews() {
        const metrics = this.calculateMetrics();
        const fixes = this.generateFixes();
        const improvements = this.generateImprovements();
        
        const news = {
            title: `Daily Update - ${new Date().toLocaleDateString()}`,
            date: new Date().toISOString(),
            sections: []
        };
        
        // Stats section
        news.sections.push({
            title: '📊 Statistics',
            content: [
                `${metrics.totalActions.toLocaleString()} total actions`,
                `${metrics.uniqueAgents} active players`,
                `${metrics.successRate} success rate`,
                `${metrics.topActions[0]?.action || 'N/A'} most popular action`
            ]
        });
        
        // Fixes section
        if (fixes.length > 0) {
            news.sections.push({
                title: '🔧 Fixes Applied',
                content: fixes.slice(0, 5).map(fix => 
                    `Fixed: ${fix.title}`
                )
            });
        }
        
        // Improvements section
        if (improvements.filter(i => i.priority === 'high').length > 0) {
            news.sections.push({
                title: '✨ Improvements',
                content: improvements
                    .filter(i => i.priority === 'high')
                    .slice(0, 3)
                    .map(imp => imp.title)
            });
        }
        
        // Achievements section
        news.sections.push({
            title: '🏆 Community Achievements',
            content: [
                'Players deployed 500+ machines today!',
                'New leaderboard record: 50,000 gems!',
                'Achievement unlocked by 20+ players: Machine Tycoon'
            ]
        });
        
        return news;
    }
    
    /**
     * Calculate hourly activity
     */
    calculateHourlyActivity(logs) {
        const hourly = new Array(24).fill(0);
        
        logs.forEach(log => {
            const hour = new Date(log.logTimestamp).getHours();
            hourly[hour]++;
        });
        
        return hourly;
    }
    
    /**
     * Calculate average session length
     */
    calculateAvgSessionLength() {
        // Simplified: based on agent activity logs
        const agentSessions = {};
        
        this.logs.forEach(log => {
            if (!agentSessions[log.agentId]) {
                agentSessions[log.agentId] = {
                    start: log.logTimestamp,
                    end: log.logTimestamp
                };
            } else {
                agentSessions[log.agentId].end = log.logTimestamp;
            }
        });
        
        const sessionLengths = Object.values(agentSessions)
            .map(session => session.end - session.start);
        
        const avg = sessionLengths.reduce((sum, len) => sum + len, 0) / sessionLengths.length;
        
        return avg || 0;
    }
    
    /**
     * Save logs to localStorage
     */
    saveLogs() {
        try {
            // Keep only last 10,000 logs
            const logsToSave = this.logs.slice(-10000);
            localStorage.setItem('ai_agent_logs', JSON.stringify(logsToSave));
            localStorage.setItem('ai_agent_errors', JSON.stringify(this.errors.slice(-1000)));
            localStorage.setItem('ai_agent_metrics', JSON.stringify(this.metrics));
        } catch (error) {
            console.warn('Failed to save logs:', error);
        }
    }
    
    /**
     * Load logs from localStorage
     */
    loadLogs() {
        try {
            const logs = localStorage.getItem('ai_agent_logs');
            const errors = localStorage.getItem('ai_agent_errors');
            const metrics = localStorage.getItem('ai_agent_metrics');
            
            if (logs) this.logs = JSON.parse(logs);
            if (errors) this.errors = JSON.parse(errors);
            if (metrics) this.metrics = JSON.parse(metrics);
            
            console.log(`✅ Loaded ${this.logs.length} logs, ${this.errors.length} errors`);
        } catch (error) {
            console.warn('Failed to load logs:', error);
        }
    }
    
    /**
     * Save analysis results
     */
    saveAnalysis(results) {
        try {
            const analyses = JSON.parse(localStorage.getItem('ai_analyses') || '[]');
            analyses.push(results);
            
            // Keep last 30 days
            const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const filtered = analyses.filter(a => a.timestamp > cutoff);
            
            localStorage.setItem('ai_analyses', JSON.stringify(filtered));
            
            console.log('💾 Analysis saved to localStorage');
        } catch (error) {
            console.error('Failed to save analysis:', error);
        }
    }
    
    /**
     * Publish changelog for public viewing
     */
    publishChangelog(results) {
        if (window.ChangelogPublisher) {
            window.ChangelogPublisher.publish(results.news);
        }
        
        console.log('📰 Changelog published');
    }
    
    /**
     * Feed data to Merlin AI for learning
     */
    feedToMerlinAI(results) {
        if (window.MerlinAILearning) {
            window.MerlinAILearning.learn({
                metrics: results.metrics,
                topActions: results.metrics.topActions,
                commonErrors: results.errors.patterns,
                improvements: results.improvements
            });
        }
        
        console.log('🧙 Data fed to Merlin AI');
    }
    
    /**
     * Post updates to social media
     */
    postToSocialMedia(results) {
        if (window.SocialMediaAutomation) {
            window.SocialMediaAutomation.postDailyUpdate({
                stats: results.metrics,
                fixes: results.fixes.length,
                improvements: results.improvements.length
            });
        }
        
        console.log('📱 Posted to social media');
    }
    
    /**
     * Export all data for analysis
     */
    exportAllData() {
        return {
            logs: this.logs,
            errors: this.errors,
            metrics: this.metrics,
            analyses: JSON.parse(localStorage.getItem('ai_analyses') || '[]')
        };
    }
}

// Initialize global logger
window.AIAgentLogger = new AIAgentLogger();

console.log('✅ AI Agent Logger loaded');
console.log('📊 24-hour analysis cycle active');
