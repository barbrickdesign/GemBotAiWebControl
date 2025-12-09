/**
 * Merlin Knowledge Integration
 * Connects Merlin AI responses with the GemBot Knowledge Base
 * Allows Merlin to reference documentation and provide context-aware answers
 */

class MerlinKnowledgeIntegration {
    constructor() {
        this.knowledgeBase = window.knowledgeBase;
        this.responseCache = new Map();
        this.conversationContext = [];
        this.maxContextMemory = 10; // Remember last 10 queries
    }

    /**
     * Wait for knowledge base to load
     */
    async ensureKnowledgeLoaded() {
        if (!this.knowledgeBase.isLoaded) {
            console.log('⏳ Waiting for knowledge base...');
            let attempts = 0;
            while (!this.knowledgeBase.isLoaded && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
        }
        return this.knowledgeBase.isLoaded;
    }

    /**
     * Enhance Merlin response with knowledge base context
     */
    async enhanceResponse(userQuery, merlinsInitialResponse) {
        if (!await this.ensureKnowledgeLoaded()) {
            return merlinsInitialResponse;
        }

        // Store conversation for context
        this.conversationContext.push({ query: userQuery, response: merlinsInitialResponse });
        if (this.conversationContext.length > this.maxContextMemory) {
            this.conversationContext.shift();
        }

        // Search for relevant documentation
        const contextInfo = this.knowledgeBase.getContextForQuery(userQuery, 3);
        
        if (contextInfo.foundRelevantDocs) {
            return this.buildEnhancedResponse(merlinsInitialResponse, contextInfo);
        }

        return merlinsInitialResponse;
    }

    /**
     * Build enhanced response with knowledge base references
     */
    buildEnhancedResponse(originalResponse, contextInfo) {
        let enhanced = originalResponse;

        // Add source citations
        if (contextInfo.context.length > 0) {
            enhanced += '\n\n📚 **Relevant Documentation:**\n';
            
            for (const source of contextInfo.context) {
                enhanced += `• **${source.title}** (${source.relevance} relevant)\n`;
            }
        }

        return enhanced;
    }

    /**
     * Get quick answer from knowledge base
     */
    async getQuickAnswer(query) {
        if (!await this.ensureKnowledgeLoaded()) {
            return null;
        }

        // Search for exact match
        const results = this.knowledgeBase.search(query);
        
        if (results.length === 0) {
            return null;
        }

        const topResult = results[0];
        const doc = this.knowledgeBase.getDocument(topResult.filename);

        return {
            found: true,
            title: topResult.title,
            category: topResult.category,
            preview: topResult.preview,
            fullContent: doc.raw,
            sections: doc.sections,
            relevance: Math.round((topResult.score / 100) * 100) + '%'
        };
    }

    /**
     * Generate context-aware Merlin prompt
     */
    async getMerlinSystemPrompt() {
        if (!await this.ensureKnowledgeLoaded()) {
            return this.getDefaultSystemPrompt();
        }

        const summary = this.knowledgeBase.getSummary();
        const categories = this.knowledgeBase.getCategories();

        return `You are Merlin, an intelligent AI mentor for the GemBot gemstone cutting machine system.

You have access to ${summary.totalDocuments} documentation files covering:
${categories.map(cat => `- ${cat}`).join('\n')}

When answering questions:
1. Reference specific documentation when relevant
2. Provide practical examples from the knowledge base
3. Offer step-by-step guidance using established procedures
4. Cite sources when you reference documented material
5. Adapt your explanations to the user's knowledge level

Your personality: Helpful, knowledgeable, encouraging. You celebrate user progress and help them learn effectively.`;
    }

    /**
     * Default system prompt (fallback)
     */
    getDefaultSystemPrompt() {
        return `You are Merlin, an intelligent AI mentor for the GemBot gemstone cutting machine system. You provide helpful guidance, practical advice, and encouragement.`;
    }

    /**
     * Search and return documentation snippets
     */
    async searchDocumentation(query) {
        if (!await this.ensureKnowledgeLoaded()) {
            return [];
        }

        const results = this.knowledgeBase.search(query);
        
        return results.map(result => ({
            filename: result.filename,
            title: result.title,
            category: result.category,
            preview: result.preview,
            sections: result.sections
        }));
    }

    /**
     * Get specific help by category
     */
    async getHelpByCategory(category) {
        if (!await this.ensureKnowledgeLoaded()) {
            return [];
        }

        const docs = this.knowledgeBase.getCategory(category);
        
        return docs.map(doc => ({
            title: doc.title,
            sections: doc.sections.map(s => s.title),
            preview: doc.processed.bullets.slice(0, 3)
        }));
    }

    /**
     * Get tutorial steps from knowledge base
     */
    async getTutorialSteps(topic) {
        const answer = await this.getQuickAnswer(topic);
        
        if (!answer) {
            return null;
        }

        const steps = [];
        let currentStep = 1;

        // Extract numbered steps or bullet points
        const lines = answer.fullContent.split('\n');
        for (const line of lines) {
            if (line.match(/^\d+\.\s/) || line.match(/^[-*]\s/)) {
                steps.push({
                    step: currentStep++,
                    instruction: line.replace(/^[\d.|-*\s]+/, '').trim()
                });
            }
        }

        return steps.length > 0 ? steps : null;
    }

    /**
     * Get code examples from knowledge base
     */
    async getCodeExamples(query) {
        const results = this.knowledgeBase.search(query);
        const examples = [];

        for (const result of results) {
            const doc = this.knowledgeBase.getDocument(result.filename);
            const codeBlocks = doc.processed.codeBlocks;
            
            if (codeBlocks.length > 0) {
                examples.push({
                    source: result.title,
                    examples: codeBlocks.slice(0, 3)
                });
            }
        }

        return examples;
    }

    /**
     * Create response with breadcrumbs
     */
    buildContextualResponse(query, primaryAnswer) {
        return {
            answer: primaryAnswer,
            moreHelp: async () => await this.searchDocumentation(query),
            relatedTopics: this.extractRelatedTopics(query),
            helpAvailable: this.knowledgeBase.isLoaded
        };
    }

    /**
     * Extract related topics from conversation
     */
    extractRelatedTopics(query) {
        const topics = [];
        const keywords = query.toLowerCase().split(/\s+/);

        for (const keyword of keywords) {
            const results = this.knowledgeBase.search(keyword);
            for (const result of results.slice(0, 2)) {
                if (!topics.includes(result.title)) {
                    topics.push(result.title);
                }
            }
        }

        return topics.slice(0, 5);
    }

    /**
     * Get status of knowledge base
     */
    getKnowledgeStatus() {
        const summary = this.knowledgeBase.getSummary();
        return {
            loaded: summary.isLoaded,
            totalDocs: summary.totalDocuments,
            categories: summary.categoryBreakdown,
            error: summary.loadError,
            memorySize: this.conversationContext.length
        };
    }

    /**
     * Cache response for fast retrieval
     */
    cacheResponse(query, response) {
        this.responseCache.set(query.toLowerCase(), response);
    }

    /**
     * Get cached response
     */
    getCachedResponse(query) {
        return this.responseCache.get(query.toLowerCase());
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.responseCache.clear();
    }
}

// Create global instance
window.merlinKnowledge = new MerlinKnowledgeIntegration();

// Expose helper functions
window.getMerlinKnowledgeStatus = () => window.merlinKnowledge.getKnowledgeStatus();
window.searchGemBotDocs = (query) => window.merlinKnowledge.searchDocumentation(query);
window.getCodeExample = (topic) => window.merlinKnowledge.getCodeExamples(topic);
window.getTutorial = (topic) => window.merlinKnowledge.getTutorialSteps(topic);
