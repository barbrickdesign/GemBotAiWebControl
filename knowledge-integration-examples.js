/**
 * GemBot Knowledge Base Integration Examples
 * Shows how to use the knowledge system with Merlin and the console
 */

// Examples for console testing - try these in the browser console (F12):

/**
 * QUICK START COMMANDS
 * Copy and paste these into your browser console (F12)
 */

// 1. Check knowledge base status
console.log('Knowledge Base Status:', window.getMerlinKnowledgeStatus());

// 2. Search for gemstone cutting information
window.searchGemBotDocs('gemstone cutting').then(results => {
    console.log('🔍 Search Results:', results);
    results.forEach(doc => console.log(`  📄 ${doc.title} (${doc.category})`));
});

// 3. Get code examples
window.getCodeExample('motor control').then(examples => {
    console.log('💻 Code Examples:', examples);
});

// 4. Get tutorial steps
window.getTutorial('grinding wheel').then(steps => {
    console.log('📚 Tutorial Steps:', steps);
    if (steps) steps.forEach(s => console.log(`  Step ${s.step}: ${s.instruction}`));
});

// ============================================
// ADVANCED USAGE
// ============================================

/**
 * Example 1: Get specific category help
 */
async function getHelpCategory(category) {
    const help = await window.merlinKnowledge.getHelpByCategory(category);
    console.log(`📚 Help for ${category}:`, help);
    return help;
}

// Usage:
// getHelpCategory('lapidary-machine')
// getHelpCategory('merlin-ai')
// getHelpCategory('hardware-setup')


/**
 * Example 2: Search and get full document
 */
async function getFullDocument(filename) {
    const doc = window.knowledgeBase.getDocument(filename);
    if (doc) {
        console.log('📖 Document:', doc.title);
        console.log('Category:', doc.category);
        console.log('Sections:', doc.sections.map(s => s.title));
        return doc;
    }
    return null;
}

// Usage:
// getFullDocument('GEMBOT_QUICK_REFERENCE_LAPIDARY.md')
// getFullDocument('MERLIN_FINAL_SUMMARY.md')


/**
 * Example 3: Get quick facts about a topic
 */
async function getQuickFacts(topic) {
    if (!window.knowledgeBase.isLoaded) {
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    const facts = window.knowledgeBase.getQuickFacts(topic);
    console.log(`📋 Quick Facts about "${topic}":`, facts);
    return facts;
}

// Usage:
// getQuickFacts('motor control')
// getQuickFacts('grinding wheels')


/**
 * Example 4: Get documentation categories
 */
function listDocCategories() {
    const categories = window.knowledgeBase.getCategories();
    console.log('📁 Available Documentation Categories:');
    categories.forEach(cat => {
        const count = window.knowledgeBase.categories[cat].length;
        console.log(`  ${cat}: ${count} documents`);
    });
    return categories;
}

// Usage:
// listDocCategories()


/**
 * Example 5: Get context for Merlin response
 */
async function getMerlinContext(userQuery) {
    const context = window.knowledgeBase.getContextForQuery(userQuery, 5);
    console.log(`📚 Merlin Context for "${userQuery}":`, context);
    return context;
}

// Usage:
// getMerlinContext('How do I cut a diamond?')
// getMerlinContext('Help with Arduino connection')


/**
 * Example 6: Enhance Merlin response
 */
async function enhanceResponse(userQuery, merlinsResponse) {
    const enhanced = await window.merlinKnowledge.enhanceResponse(userQuery, merlinsResponse);
    console.log('Enhanced Response:', enhanced);
    return enhanced;
}

// Usage:
// enhanceResponse('What is the index motor?', 'The index motor controls facet positioning')


/**
 * Example 7: Search within a category
 */
async function searchInCategory(query, category) {
    if (!window.knowledgeBase.isLoaded) {
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    const results = window.knowledgeBase.search(query, category);
    console.log(`🔍 Search for "${query}" in ${category}:`, results);
    return results;
}

// Usage:
// searchInCategory('motor', 'lapidary-machine')
// searchInCategory('setup', 'hardware-setup')


/**
 * Example 8: Get complete knowledge base summary
 */
function getKnowledgeSummary() {
    const summary = window.knowledgeBase.getSummary();
    console.log('=== KNOWLEDGE BASE SUMMARY ===');
    console.log('Total Documents:', summary.totalDocuments);
    console.log('Loaded:', summary.isLoaded);
    console.log('Categories:');
    Object.entries(summary.categoryBreakdown).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
    });
    return summary;
}

// Usage:
// getKnowledgeSummary()


/**
 * Example 9: Watch knowledge base load
 */
function watchKnowledgeLoad() {
    let attempt = 0;
    const interval = setInterval(() => {
        attempt++;
        const status = window.getMerlinKnowledgeStatus();
        console.log(`[${attempt}] KB Status:`, status);
        
        if (status.loaded) {
            console.log('✅ Knowledge Base LOADED!');
            clearInterval(interval);
        }
        
        if (attempt > 50) {
            console.log('❌ Knowledge Base load timeout');
            clearInterval(interval);
        }
    }, 200);
}

// Usage:
// watchKnowledgeLoad()


/**
 * Example 10: Extract and display a tutorial
 */
async function displayTutorial(topic) {
    const steps = await window.merlinKnowledge.getTutorialSteps(topic);
    
    if (!steps) {
        console.log(`No tutorial found for "${topic}"`);
        return;
    }
    
    console.log(`📚 Tutorial: ${topic}`);
    console.log('='.repeat(50));
    steps.forEach(step => {
        console.log(`${step.step}. ${step.instruction}`);
    });
    console.log('='.repeat(50));
    
    return steps;
}

// Usage:
// displayTutorial('grinding wheel')
// displayTutorial('motor control')


// ============================================
// CONSOLE SHORTCUTS
// ============================================

// Quick alias for common operations
window.kb = {
    status: () => window.getMerlinKnowledgeStatus(),
    search: (q) => window.searchGemBotDocs(q),
    code: (q) => window.getCodeExample(q),
    tutorial: (q) => window.getTutorial(q),
    categories: () => window.knowledgeBase.getCategories(),
    docs: () => window.knowledgeBase.getSummary().totalDocuments,
    facts: (q) => window.knowledgeBase.getQuickFacts(q)
};

console.log(`
╔════════════════════════════════════════════╗
║  🧠 GEMBOT KNOWLEDGE BASE LOADED           ║
╠════════════════════════════════════════════╣
║ Quick commands:                            ║
║  kb.status()    - Check knowledge base    ║
║  kb.search(q)   - Search documentation   ║
║  kb.code(q)     - Get code examples       ║
║  kb.tutorial(q) - Get tutorial steps      ║
║  kb.categories()- List all categories     ║
║  kb.docs()      - Count total documents   ║
║  kb.facts(q)    - Get quick facts         ║
║                                           ║
║ Or use full names:                        ║
║  getMerlinKnowledgeStatus()               ║
║  searchGemBotDocs(query)                  ║
║  getCodeExample(topic)                    ║
║  getTutorial(topic)                       ║
╚════════════════════════════════════════════╝
`);
