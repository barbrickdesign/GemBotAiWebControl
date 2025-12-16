// ═════════════════════════════════════════════════════════════════════════════
// MERLIN AI - GEMINI INTEGRATION FOR GEMBOT 🧙‍♂️
// ═════════════════════════════════════════════════════════════════════════════
// Powered by Google Gemini 1.5 Flash via Genkit
// Owner: Ryan Barbrick / Barbrick Design
// Contact: BarbrickDesign@gmail.com
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Merlin AI - The Brain Behind Repository Valuation
 * Uses Google Gemini AI to provide intelligent code analysis, suggestions, and insights
 */
window.merlinAI = {
    // Configuration
    apiKey: 'AIzaSyCKuf5EVZ-ldHErhG3OkIw9Zz6jb_w3nMc',
    model: 'gemini-1.5-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    isInitialized: false,
    
    /**
     * Initialize Merlin AI System
     */
    async initialize() {
        try {
            console.log('🧙‍♂️ Initializing Merlin AI...');
            
            // Test connection
            const response = await this.generate('Hello! Please respond with "Merlin AI online" if you can hear me.');
            
            if (response.text) {
                this.isInitialized = true;
                console.log('✅ Merlin AI initialized successfully');
                console.log('🧙‍♂️ Merlin says:', response.text);
                return true;
            }
            
            throw new Error('No response from Gemini API');
        } catch (error) {
            console.error('❌ Merlin AI initialization failed:', error);
            return false;
        }
    },
    
    /**
     * Core Generation Function - Calls Gemini API
     * @param {string} prompt - The prompt to send to Gemini
     * @param {object} options - Generation options (temperature, maxTokens, etc.)
     * @returns {Promise<object>} - {text, model, timestamp, error?}
     */
    async generate(prompt, options = {}) {
        try {
            const response = await fetch(
                `${this.endpoint}/models/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: options.temperature || 0.7,
                            maxOutputTokens: options.maxTokens || 2048,
                            topP: options.topP || 0.95,
                            topK: options.topK || 40
                        }
                    })
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0]) {
                return {
                    text: data.candidates[0].content.parts[0].text,
                    model: this.model,
                    timestamp: new Date().toISOString(),
                    usage: data.usageMetadata
                };
            }
            
            throw new Error('No candidates in response');
        } catch (error) {
            console.error('❌ Merlin AI Generation Error:', error);
            return {
                text: '',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    },
    
    /**
     * FLOW: Analyze Code File
     * Provides quality assessment, suggestions, and improvement estimates
     * @param {object} nodeData - {name, language, metrics, value, functions}
     * @returns {Promise<object>} - {quality, suggestions, security, performance, refactorHours}
     */
    async analyzeCodeFlow(nodeData) {
        const prompt = `You are Merlin, an expert code analyst for the GemBot repository valuation system.

Analyze this code file and provide a comprehensive assessment:

📄 FILE: ${nodeData.name}
💻 LANGUAGE: ${nodeData.language || 'Unknown'}
📊 METRICS:
- Lines of Code: ${nodeData.metrics?.lines || 0}
- Functions: ${nodeData.metrics?.functions || 0}
- Classes: ${nodeData.metrics?.classes || 0}
- Complexity Score: ${nodeData.metrics?.complexity || 0}
- Comments: ${nodeData.metrics?.comments || 0}
💰 CALCULATED VALUE: $${nodeData.value?.toFixed(2) || 0}

Please provide your analysis in the following JSON format (no markdown, just pure JSON):

{
  "quality": <number 1-10>,
  "qualityReason": "<brief explanation>",
  "suggestions": [
    "<specific actionable improvement 1>",
    "<specific actionable improvement 2>",
    "<specific actionable improvement 3>"
  ],
  "security": [
    "<security concern 1 if any>",
    "<security concern 2 if any>"
  ],
  "performance": [
    "<performance optimization 1>",
    "<performance optimization 2>"
  ],
  "refactorHours": <estimated hours to implement all suggestions>,
  "strengths": [
    "<what this file does well>"
  ],
  "valueAccuracy": "<is the $${nodeData.value?.toFixed(2)} valuation fair, too high, or too low?>"
}`;

        const response = await this.generate(prompt, { temperature: 0.3, maxTokens: 1500 });
        
        try {
            // Extract JSON from response (handle markdown code blocks)
            let text = response.text.trim();
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
            if (jsonMatch) text = jsonMatch[1];
            
            const parsed = JSON.parse(text);
            return {
                ...parsed,
                rawResponse: response.text,
                model: response.model,
                timestamp: response.timestamp
            };
        } catch (error) {
            console.warn('⚠️ Could not parse AI response as JSON:', response.text);
            // Return fallback structure
            return {
                quality: 5,
                qualityReason: 'Unable to parse AI response',
                suggestions: [response.text.substring(0, 200)],
                security: [],
                performance: [],
                refactorHours: 0,
                strengths: [],
                valueAccuracy: 'Unknown',
                rawResponse: response.text,
                parseError: error.message
            };
        }
    },
    
    /**
     * FLOW: Summarize Entire Repository
     * Provides high-level analysis of architecture, value, and priorities
     * @param {object} repoData - {name, totalValue, totalHours, nodeCount, avgComplexity, topNodes}
     * @returns {Promise<object>} - {text, model, timestamp}
     */
    async summarizeRepositoryFlow(repoData) {
        const topNodesList = repoData.topNodes?.map(n => 
            `  - ${n.name}: $${n.value.toFixed(2)} (${n.metrics?.functions || 0} functions, complexity ${n.metrics?.complexity || 0})`
        ).join('\n') || '  - None';
        
        const prompt = `You are Merlin, the AI brain behind GemBot's repository valuation system. 

Provide a comprehensive analysis of this repository:

📦 REPOSITORY: ${repoData.name || 'Unknown Repository'}
💰 TOTAL VALUE: $${repoData.totalValue?.toFixed(2) || 0}
⏱️ DEVELOPMENT HOURS: ${repoData.totalHours?.toFixed(1) || 0} hours
📊 FILES ANALYZED: ${repoData.nodeCount || 0}
🎯 AVERAGE COMPLEXITY: ${repoData.avgComplexity?.toFixed(1) || 0}

🏆 TOP 10 MOST VALUABLE FILES:
${topNodesList}

Please provide a detailed markdown report with:

## 🎯 Executive Summary
A 2-3 sentence overview of this repository's quality and value.

## 📈 Architecture Quality: X/10
Rate the overall architecture and explain your score.

## 💪 Key Strengths (Top 3)
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

## ⚠️ Critical Issues (Top 3)
1. [Issue 1 with severity]
2. [Issue 2 with severity]
3. [Issue 3 with severity]

## 🛠️ Technology Stack Assessment
Evaluate the technologies used based on the file extensions and patterns.

## 🚀 Recommended Next Steps (5 Priorities)
1. [Priority 1 with time estimate]
2. [Priority 2 with time estimate]
3. [Priority 3 with time estimate]
4. [Priority 4 with time estimate]
5. [Priority 5 with time estimate]

## 💵 Fair Market Value Estimate
Based on the code quality, complexity, and value calculations:
- **Calculated Value**: $${repoData.totalValue?.toFixed(2) || 0}
- **Fair Market Value**: $[your estimate]
- **Justification**: [explain any difference]

## 🧙‍♂️ Merlin's Final Verdict
Your overall assessment and key takeaway for the development team.`;

        const response = await this.generate(prompt, { temperature: 0.7, maxTokens: 2500 });
        return response;
    },
    
    /**
     * FLOW: Suggest Fix for Issue
     * Provides actionable steps to resolve a detected code issue
     * @param {object} issue - {type, file, description, metrics}
     * @returns {Promise<object>} - {text, model, timestamp}
     */
    async suggestFixFlow(issue) {
        const prompt = `You are Merlin, a code fix specialist in the GemBot system.

Analyze this issue and provide a detailed fix plan:

🐛 ISSUE TYPE: ${issue.type}
📄 FILE: ${issue.file}
📝 DESCRIPTION: ${issue.description}
📊 CURRENT METRICS: ${JSON.stringify(issue.metrics || {}, null, 2)}

Please provide a structured fix plan in markdown:

## 🔍 Root Cause Analysis
[Explain what's causing this issue]

## 💡 Proposed Solution
[Describe the fix at a high level]

## 🔧 Implementation Steps
1. [Specific step 1]
2. [Specific step 2]
3. [Specific step 3]
...

## 🧪 Testing Approach
- [How to test this fix]
- [Expected outcomes]

## ⏱️ Time Estimate
- **Implementation**: X hours
- **Testing**: Y hours
- **Total**: Z hours

## ⚠️ Risk Assessment
- **Risk Level**: Low/Medium/High
- **Potential Issues**: [any concerns]
- **Rollback Plan**: [if things go wrong]

## 💵 Value Impact
How will this fix improve the repository value?

## 🧙‍♂️ Merlin's Recommendation
Should this be fixed now, later, or not at all?`;

        const response = await this.generate(prompt, { temperature: 0.6, maxTokens: 1800 });
        return response;
    },
    
    /**
     * FLOW: Compare Two Repositories
     * Compares architecture, value, and quality between two repos
     * @param {object} repo1Data - First repository data
     * @param {object} repo2Data - Second repository data
     * @returns {Promise<object>} - {text, model, timestamp}
     */
    async compareRepositoriesFlow(repo1Data, repo2Data) {
        const prompt = `You are Merlin, comparing two repositories in the GemBot system.

📦 REPOSITORY 1: ${repo1Data.name}
- Value: $${repo1Data.totalValue?.toFixed(2)}
- Hours: ${repo1Data.totalHours?.toFixed(1)}
- Files: ${repo1Data.nodeCount}
- Avg Complexity: ${repo1Data.avgComplexity?.toFixed(1)}

📦 REPOSITORY 2: ${repo2Data.name}
- Value: $${repo2Data.totalValue?.toFixed(2)}
- Hours: ${repo2Data.totalHours?.toFixed(1)}
- Files: ${repo2Data.nodeCount}
- Avg Complexity: ${repo2Data.avgComplexity?.toFixed(1)}

Provide a comparative analysis:

## 📊 Side-by-Side Comparison
| Metric | ${repo1Data.name} | ${repo2Data.name} | Winner |
|--------|---------|---------|--------|
| Total Value | $${repo1Data.totalValue?.toFixed(2)} | $${repo2Data.totalValue?.toFixed(2)} | [which one] |
| Code Quality | [score/10] | [score/10] | [which one] |
| Complexity | [assessment] | [assessment] | [which one] |
| Documentation | [assessment] | [assessment] | [which one] |

## 🏆 Overall Winner
[Which repository is better and why]

## 💡 Recommendations
- For ${repo1Data.name}: [key improvement]
- For ${repo2Data.name}: [key improvement]`;

        const response = await this.generate(prompt, { temperature: 0.7, maxTokens: 2000 });
        return response;
    },
    
    /**
     * FLOW: Predict Value After Changes
     * Estimates how proposed changes will affect repository value
     * @param {object} currentRepo - Current repository state
     * @param {array} proposedChanges - List of changes to make
     * @returns {Promise<object>} - {text, model, timestamp}
     */
    async predictValueImpactFlow(currentRepo, proposedChanges) {
        const changesList = proposedChanges.map((c, i) => 
            `  ${i + 1}. ${c.description} (${c.estimatedHours} hours)`
        ).join('\n');
        
        const prompt = `You are Merlin, predicting value changes in the GemBot system.

📦 CURRENT STATE:
- Repository: ${currentRepo.name}
- Value: $${currentRepo.totalValue?.toFixed(2)}
- Files: ${currentRepo.nodeCount}

🔧 PROPOSED CHANGES:
${changesList}

Predict the impact:

## 📈 Value Prediction
- **Current Value**: $${currentRepo.totalValue?.toFixed(2)}
- **Predicted New Value**: $[your estimate]
- **Delta**: +$[difference]
- **Confidence**: [percentage]%

## 🎯 Impact by Change
${proposedChanges.map((c, i) => `\n### Change ${i + 1}: ${c.description}\n- Value Impact: $[estimate]\n- Risk: [low/medium/high]\n- Recommendation: [do it / skip it / modify]`).join('\n')}

## 🧙‍♂️ Merlin's Advice
Should you proceed with these changes?`;

        const response = await this.generate(prompt, { temperature: 0.6, maxTokens: 1500 });
        return response;
    },
    
    /**
     * Quick Hello Flow - Test Connection
     * @param {string} name - User's name
     * @returns {Promise<object>} - {text, model, timestamp}
     */
    async helloFlow(name) {
        const prompt = `Hello! I'm ${name} from the GemBot team. You are Merlin AI, the intelligent brain behind our repository valuation system. Please introduce yourself in 2-3 sentences and explain how you help analyze code repositories.`;
        return await this.generate(prompt);
    }
};

// Auto-initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.merlinAI.initialize();
    });
} else {
    window.merlinAI.initialize();
}

console.log('🧙‍♂️ Merlin AI module loaded');
