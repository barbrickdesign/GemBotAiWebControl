/**
 * GemBot Knowledge Base Loader
 * Dynamically loads and indexes markdown documentation files
 * for Merlin AI to reference during conversations
 */

class KnowledgeBaseLoader {
    constructor() {
        this.knowledgeBase = {};
        this.categories = {};
        this.searchIndex = {};
        this.isLoaded = false;
        this.loadError = null;
        
        // Categorize knowledge files
        this.fileCategories = {
            'lapidary-machine': [
                'GEMBOT_GEMSTONE_CUTTING_MACHINE.md',
                'GEMBOT_QUICK_REFERENCE_LAPIDARY.md',
                'GEMBOT_API_REFERENCE_EXAMPLES.md',
                'GEMBOT_3D_VISUALIZATION_GUIDE.md'
            ],
            'merlin-ai': [
                'MERLIN_INTELLIGENT_MENTOR_COMPLETE_20251207.md',
                'MERLIN_FINAL_SUMMARY.md',
                'MERLIN_COMPREHENSIVE_KNOWLEDGE_BASE.md',
                'MERLIN_QUICK_REFERENCE.md',
                'MERLIN_PERSONALIZATION_UPGRADE.md'
            ],
            'hardware-setup': [
                'ARDUINO_INTEGRATION_GUIDE.md',
                'LOCAL_USB_BRIDGE_SETUP.md',
                'CONNECTION_SETUP_GUIDE.md',
                'MOBILE_AUTO_CONNECTION_SETUP.md'
            ],
            'menu-controls': [
                'MENU_CONTROLS_IMPLEMENTATION.md',
                'MENU_CONTROLS_QUICK_START.md',
                'MENU_TEACHING_SIMPLIFIED.md'
            ],
            'ai-learning': [
                'AI_LEARNING_PROGRESSION_SYSTEM.md',
                'AI_ENHANCEMENT_COMPLETE.md',
                'AI_QUICK_REFERENCE.md'
            ],
            'deployment': [
                'FINAL_DEPLOYMENT_SUMMARY_20251208.md',
                'IMPLEMENTATION_COMPLETE.md',
                'DEPLOYMENT_TESTING_CHECKLIST.md'
            ],
            'quick-reference': [
                'GETTING_STARTED.md',
                '30_SECOND_OVERVIEW.md',
                'COMPLETE_INDEX.md'
            ],
            'usfg-faceting': [
                'USFG_KNOWLEDGE_PACK.md'
            ]
        };
    }

    /**
     * Load all knowledge base files
     */
    async loadAllKnowledge() {
        console.log('🧠 Initializing GemBot Knowledge Base...');
        
        try {
            // Load files from each category
            for (const [category, files] of Object.entries(this.fileCategories)) {
                this.categories[category] = [];
                
                for (const file of files) {
                    try {
                        const content = await this.loadFile(file);
                        if (content) {
                            const processed = this.processMarkdown(content);
                            this.knowledgeBase[file] = {
                                raw: content,
                                processed: processed,
                                category: category,
                                title: this.extractTitle(content),
                                sections: this.extractSections(content)
                            };
                            this.categories[category].push(file);
                            this.indexSearchTerms(file, content);
                        }
                    } catch (error) {
                        console.warn(`⚠️ Failed to load ${file}:`, error.message);
                    }
                }
            }
            
            this.isLoaded = true;
            console.log(`✅ Knowledge Base loaded: ${Object.keys(this.knowledgeBase).length} documents indexed`);
            return true;
        } catch (error) {
            this.loadError = error.message;
            console.error('❌ Knowledge Base load failed:', error);
            return false;
        }
    }

    /**
     * Load a single markdown file
     */
    async loadFile(filename) {
        try {
            const response = await fetch(`./${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            throw new Error(`Cannot load ${filename}: ${error.message}`);
        }
    }

    /**
     * Extract title from markdown
     */
    extractTitle(content) {
        const match = content.match(/^#\s+(.+)$/m);
        return match ? match[1].trim() : 'Untitled';
    }

    /**
     * Extract major sections from markdown
     */
    extractSections(content) {
        const sections = [];
        const lines = content.split('\n');
        let currentSection = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.startsWith('## ')) {
                currentSection = {
                    title: line.replace(/^## /, '').trim(),
                    startLine: i,
                    content: []
                };
                sections.push(currentSection);
            } else if (currentSection && !line.startsWith('#')) {
                currentSection.content.push(line);
            }
        }

        return sections;
    }

    /**
     * Process markdown to extract key information
     */
    processMarkdown(content) {
        return {
            headings: this.extractHeadings(content),
            codeBlocks: this.extractCodeBlocks(content),
            bullets: this.extractBulletPoints(content),
            links: this.extractLinks(content)
        };
    }

    /**
     * Extract all headings
     */
    extractHeadings(content) {
        const headings = [];
        const regex = /^#{1,6}\s+(.+)$/gm;
        let match;

        while ((match = regex.exec(content)) !== null) {
            headings.push(match[1].trim());
        }

        return headings;
    }

    /**
     * Extract code blocks
     */
    extractCodeBlocks(content) {
        const blocks = [];
        const regex = /```[\s\S]*?```/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            blocks.push(match[0]);
        }

        return blocks;
    }

    /**
     * Extract bullet points
     */
    extractBulletPoints(content) {
        const bullets = [];
        const regex = /^[\s]*[-*+]\s+(.+)$/gm;
        let match;

        while ((match = regex.exec(content)) !== null) {
            bullets.push(match[1].trim());
        }

        return bullets;
    }

    /**
     * Extract links
     */
    extractLinks(content) {
        const links = [];
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            links.push({ text: match[1], url: match[2] });
        }

        return links;
    }

    /**
     * Build search index for quick lookup
     */
    indexSearchTerms(filename, content) {
        const words = content.toLowerCase().match(/\b\w+\b/g) || [];
        const uniqueWords = new Set(words);

        for (const word of uniqueWords) {
            if (word.length > 3) { // Only index words longer than 3 chars
                // Normalize index bucket to array (guards against accidental non-array assignments)
                if (!Array.isArray(this.searchIndex[word])) {
                    this.searchIndex[word] = this.searchIndex[word] ? [String(this.searchIndex[word])] : [];
                }
                if (!this.searchIndex[word].includes(filename)) {
                    this.searchIndex[word].push(filename);
                }
            }
        }
    }

    /**
     * Search knowledge base
     */
    search(query, category = null) {
        const results = [];
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/);

        for (const [filename, doc] of Object.entries(this.knowledgeBase)) {
            // Filter by category if specified
            if (category && doc.category !== category) continue;

            let score = 0;
            const content = doc.raw.toLowerCase();
            const title = doc.title.toLowerCase();

            // Score title matches higher
            for (const word of queryWords) {
                if (title.includes(word)) score += 10;
                if (content.includes(word)) score += 1;
            }

            if (score > 0) {
                results.push({
                    filename: filename,
                    title: doc.title,
                    category: doc.category,
                    score: score,
                    preview: this.getPreview(content, queryWords),
                    sections: doc.sections
                });
            }
        }

        // Sort by relevance score
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Get preview text around search terms
     */
    getPreview(content, words, maxLength = 150) {
        for (const word of words) {
            const index = content.indexOf(word);
            if (index !== -1) {
                const start = Math.max(0, index - 50);
                const end = Math.min(content.length, index + maxLength);
                return '...' + content.substring(start, end) + '...';
            }
        }
        return content.substring(0, maxLength);
    }

    /**
     * Get specific document
     */
    getDocument(filename) {
        return this.knowledgeBase[filename] || null;
    }

    /**
     * Get all documents in category
     */
    getCategory(categoryName) {
        const files = this.categories[categoryName] || [];
        return files.map(f => this.knowledgeBase[f]);
    }

    /**
     * Get document by title
     */
    getByTitle(title) {
        for (const [filename, doc] of Object.entries(this.knowledgeBase)) {
            if (doc.title.toLowerCase() === title.toLowerCase()) {
                return doc;
            }
        }
        return null;
    }

    /**
     * Get all categories
     */
    getCategories() {
        return Object.keys(this.categories);
    }

    /**
     * Get knowledge base summary
     */
    getSummary() {
        return {
            totalDocuments: Object.keys(this.knowledgeBase).length,
            categories: Object.keys(this.categories),
            categoryBreakdown: Object.fromEntries(
                Object.entries(this.categories).map(([cat, files]) => [cat, files.length])
            ),
            isLoaded: this.isLoaded,
            loadError: this.loadError
        };
    }

    /**
     * Get relevant context for Merlin response
     */
    getContextForQuery(query, maxResults = 3) {
        const results = this.search(query);
        const context = results.slice(0, maxResults).map(result => ({
            source: result.filename,
            title: result.title,
            preview: result.preview,
            relevance: Math.round((result.score / 100) * 100) + '%'
        }));

        return {
            query: query,
            foundRelevantDocs: context.length > 0,
            context: context,
            suggestion: context.length > 0 ? 
                `I found relevant information in: ${context.map(c => c.title).join(', ')}` :
                null
        };
    }

    /**
     * Get quick facts (bullet points and key info)
     */
    getQuickFacts(query) {
        const results = this.search(query, null);
        const facts = [];

        for (const result of results.slice(0, 2)) {
            const doc = this.knowledgeBase[result.filename];
            if (doc.processed.bullets.length > 0) {
                facts.push({
                    source: result.title,
                    facts: doc.processed.bullets.slice(0, 5)
                });
            }
        }

        return facts;
    }
}

// Create global instance
window.knowledgeBase = new KnowledgeBaseLoader();

// Auto-load on page ready (unless deterministic boot disables auto-init)
if (typeof window !== 'undefined' && window.GemBotAutoInit === false) {
    console.log('ℹ️ KnowledgeBaseLoader: auto-init disabled (GemBotAutoInit=false). Waiting for GemBotApp/bootstrap.');
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.knowledgeBase.loadAllKnowledge();
    });
} else {
    window.knowledgeBase.loadAllKnowledge();
}
