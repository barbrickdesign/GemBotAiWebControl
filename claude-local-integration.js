/**
 * 🤖 Local Claude LLM Integration
 * 
 * Integrates local Claude API instance with $GBUV gas fee payment
 * - Routes questions through local Claude for better responses
 * - Charges $GBUV tokens as "gas fees" for API calls
 * - Maintains Merlin personality in responses
 * - Fallback to basic Q&A if Claude unavailable
 * 
 * @version 1.0.0
 * @date December 14, 2025
 */

class ClaudeLocalIntegration {
    constructor(config = {}) {
        this.config = {
            claudeEndpoint: config.claudeEndpoint || 'http://localhost:8000',
            apiPath: config.apiPath || '/v1/chat',
            gasFeePerCall: config.gasFeePerCall || 10, // $GBUV tokens per API call
            tokenAddress: 'DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump',
            maxRetries: config.maxRetries || 3,
            timeout: config.timeout || 30000, // 30 seconds
            fallbackToBasic: config.fallbackToBasic !== false,
            ...config
        };

        this.state = {
            isAvailable: false,
            lastCheck: null,
            totalCalls: 0,
            totalGasPaid: 0,
            failedCalls: 0
        };

        // Initialize
        this.checkAvailability();
        
        console.log('🤖 Claude Local Integration initialized', this.config);
    }

    /**
     * Check if local Claude API is available
     */
    async checkAvailability() {
        try {
            const response = await fetch(`${this.config.claudeEndpoint}/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            this.state.isAvailable = response.ok;
            this.state.lastCheck = Date.now();
            
            if (this.state.isAvailable) {
                console.log('✅ Local Claude API is available');
            } else {
                console.warn('⚠️ Local Claude API returned non-OK status');
            }
            
            return this.state.isAvailable;
        } catch (error) {
            console.warn('⚠️ Local Claude API not available:', error.message);
            this.state.isAvailable = false;
            this.state.lastCheck = Date.now();
            return false;
        }
    }

    /**
     * Check if user has enough $GBUV tokens for gas fee
     */
    async checkGasBalance(userWallet) {
        try {
            // Get user's $GBUV balance from marketplace
            const marketplace = window.GemBotMarketplace;
            if (!marketplace || !marketplace.wallet) {
                console.warn('Marketplace not initialized');
                return false;
            }

            const balance = marketplace.wallet.tokenBalance || 0;
            const hasSufficient = balance >= this.config.gasFeePerCall;
            
            if (!hasSufficient) {
                console.warn(`Insufficient $GBUV balance: ${balance} < ${this.config.gasFeePerCall}`);
            }
            
            return hasSufficient;
        } catch (error) {
            console.error('Error checking gas balance:', error);
            return false;
        }
    }

    /**
     * Charge gas fee in $GBUV tokens
     */
    async chargeGasFee(userWallet, amount = this.config.gasFeePerCall) {
        try {
            const marketplace = window.GemBotMarketplace;
            if (!marketplace || !marketplace.wallet) {
                throw new Error('Marketplace not initialized');
            }

            // Deduct tokens from user's balance
            const previousBalance = marketplace.wallet.tokenBalance || 0;
            
            if (previousBalance < amount) {
                throw new Error(`Insufficient balance: ${previousBalance} $GBUV`);
            }

            marketplace.wallet.tokenBalance -= amount;
            
            // Track gas paid
            this.state.totalGasPaid += amount;
            
            // Save state
            marketplace.saveState();
            
            console.log(`⛽ Gas fee charged: ${amount} $GBUV (Balance: ${marketplace.wallet.tokenBalance})`);
            
            // Emit event
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('gembot:gas-fee-charged', {
                    detail: {
                        amount,
                        previousBalance,
                        newBalance: marketplace.wallet.tokenBalance,
                        timestamp: Date.now()
                    }
                });
                window.dispatchEvent(event);
            }
            
            return true;
        } catch (error) {
            console.error('Error charging gas fee:', error);
            throw error;
        }
    }

    /**
     * Ask Claude a question with Merlin personality context
     */
    async askClaude(question, context = {}) {
        // Check if Claude is available (recheck periodically)
        if (!this.state.isAvailable || Date.now() - this.state.lastCheck > 60000) {
            await this.checkAvailability();
        }

        if (!this.state.isAvailable) {
            if (this.config.fallbackToBasic) {
                console.log('📝 Claude unavailable, falling back to basic Q&A');
                return this.fallbackResponse(question, context);
            }
            throw new Error('Local Claude API is not available');
        }

        // Check gas balance
        const hasBalance = await this.checkGasBalance();
        if (!hasBalance) {
            throw new Error('Insufficient $GBUV balance for gas fee');
        }

        try {
            // Build prompt with Merlin personality
            const prompt = this.buildMerlinPrompt(question, context);
            
            // Make API call to local Claude
            const response = await this.callClaudeAPI(prompt);
            
            // Charge gas fee after successful response
            await this.chargeGasFee();
            
            // Track successful call
            this.state.totalCalls++;
            
            // Wrap response in Merlin style
            const wrappedResponse = this.wrapMerlinResponse(response, context);
            
            console.log(`✅ Claude response received (Call #${this.state.totalCalls})`);
            
            return wrappedResponse;
            
        } catch (error) {
            console.error('Error calling Claude API:', error);
            this.state.failedCalls++;
            
            // Fallback if enabled
            if (this.config.fallbackToBasic) {
                console.log('📝 Claude call failed, falling back to basic Q&A');
                return this.fallbackResponse(question, context);
            }
            
            throw error;
        }
    }

    /**
     * Build prompt with Merlin personality and context
     */
    buildMerlinPrompt(question, context) {
        const personality = `You are Merlin, an ancient wizard mentor teaching gemstone cutting.
        
Your personality:
- Wise, patient, and encouraging
- Use metaphors relating to gems, crystals, and craftsmanship
- Address the student warmly
- Occasionally reference "the ancient arts" or "time-honored traditions"
- Be concise but insightful
- Use emoji sparingly for emphasis (🔮, ✨, 💎, ⚡)

Context:
${context.playerLevel ? `- Student level: ${context.playerLevel}` : ''}
${context.currentStone ? `- Working on: ${context.currentStone}` : ''}
${context.recentActions ? `- Recent actions: ${context.recentActions.join(', ')}` : ''}
${context.struggles ? `- Struggling with: ${context.struggles.join(', ')}` : ''}

Question: ${question}

Respond as Merlin would, keeping it under 200 words:`;

        return personality;
    }

    /**
     * Call local Claude API
     */
    async callClaudeAPI(prompt) {
        const url = `${this.config.claudeEndpoint}${this.config.apiPath}`;
        
        const requestBody = {
            model: 'claude-3-sonnet',
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 500,
            temperature: 0.7
        };

        let lastError;
        
        for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody),
                    timeout: this.config.timeout
                });

                if (!response.ok) {
                    throw new Error(`Claude API returned ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                // Extract response text based on API format
                if (data.content && Array.isArray(data.content) && data.content[0]) {
                    return data.content[0].text || data.content[0].content;
                } else if (data.message) {
                    return data.message;
                } else if (data.response) {
                    return data.response;
                }
                
                throw new Error('Unexpected API response format');
                
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt + 1} failed:`, error.message);
                
                if (attempt < this.config.maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Wrap Claude's response in Merlin style if needed
     */
    wrapMerlinResponse(response, context) {
        // Claude should already respond as Merlin due to prompt
        // But we can add finishing touches
        
        let wrapped = response.trim();
        
        // Ensure it sounds like Merlin
        if (!wrapped.match(/student|apprentice|young one|my (friend|dear)/i)) {
            wrapped = `My friend, ${wrapped}`;
        }
        
        return wrapped;
    }

    /**
     * Fallback to basic Q&A system
     */
    fallbackResponse(question, context) {
        // Use existing Merlin knowledge base
        const merlinKnowledge = window.MerlinEnhancedResponses;
        
        if (merlinKnowledge) {
            // Try to find relevant response
            const response = merlinKnowledge.smartResponse(question, context);
            return response || "I sense your question, though the mystical energies are unclear. Perhaps rephrase your query?";
        }
        
        return "The ancient wisdom is temporarily clouded. Try asking again, or consult the knowledge archives.";
    }

    /**
     * Get integration statistics
     */
    getStats() {
        return {
            available: this.state.isAvailable,
            totalCalls: this.state.totalCalls,
            failedCalls: this.state.failedCalls,
            successRate: this.state.totalCalls > 0 ? 
                ((this.state.totalCalls - this.state.failedCalls) / this.state.totalCalls * 100).toFixed(1) + '%' : 
                'N/A',
            totalGasPaid: this.state.totalGasPaid,
            gasFeePerCall: this.config.gasFeePerCall,
            lastCheck: this.state.lastCheck ? new Date(this.state.lastCheck).toLocaleString() : 'Never'
        };
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.ClaudeLocalIntegration = ClaudeLocalIntegration;
}

console.log('🤖 Claude Local Integration module loaded');
