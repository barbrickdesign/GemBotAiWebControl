/**
 * 🤖 GemBot Local AI Integration
 * 
 * Integrates local LLM endpoints (Ollama, LM Studio, etc.) with $GBUV gas fee payment
 * - Routes questions through local AI models for better responses
 * - Charges $GBUV tokens as "gas fees" for API calls
 * - Maintains Merlin personality in responses
 * - Fallback to basic Q&A if AI unavailable
 * 
 * Supported Local LLM Providers:
 * - Ollama (http://localhost:11434)
 * - LM Studio (http://localhost:1234)
 * - Text Generation WebUI (http://localhost:5000)
 * - Any OpenAI-compatible API
 * 
 * @version 2.0.0
 * @date December 14, 2025
 */

class GemBotLocalAI {
    constructor(config = {}) {
        this.config = {
            // Local AI endpoint
            aiEndpoint: config.aiEndpoint || 'http://localhost:11434', // Default: Ollama
            apiType: config.apiType || 'ollama', // 'ollama', 'lmstudio', 'openai-compatible'
            model: config.model || 'llama2', // Model name
            
            // Gas fee configuration
            gasFeePerCall: config.gasFeePerCall || 10, // $GBUV tokens per API call
            tokenAddress: 'DPHcbu7wJEbcrnCYjXC8vHBkM39kT9xZg4mYayvrpump',
            
            // API settings
            maxRetries: config.maxRetries || 3,
            timeout: config.timeout || 30000, // 30 seconds
            fallbackToBasic: config.fallbackToBasic !== false,
            
            // Generation parameters
            temperature: config.temperature || 0.7,
            maxTokens: config.maxTokens || 500,
            
            ...config
        };

        this.state = {
            isAvailable: false,
            lastCheck: null,
            totalCalls: 0,
            totalGasPaid: 0,
            failedCalls: 0,
            registeredUsers: new Map() // Track registered users
        };

        // API path mappings for different providers
        this.apiPaths = {
            'ollama': '/api/generate',
            'lmstudio': '/v1/chat/completions',
            'openai-compatible': '/v1/chat/completions',
            'textgen': '/api/v1/generate'
        };

        // Initialize
        this.checkAvailability();
        
        console.log('🤖 GemBot Local AI Integration initialized', {
            endpoint: this.config.aiEndpoint,
            type: this.config.apiType,
            model: this.config.model,
            gasFee: this.config.gasFeePerCall
        });
    }

    /**
     * Register a user for AI access
     */
    registerUser(userId, walletAddress) {
        if (!userId || !walletAddress) {
            throw new Error('User ID and wallet address required for registration');
        }

        this.state.registeredUsers.set(userId, {
            walletAddress,
            registeredAt: Date.now(),
            totalCalls: 0,
            totalGasPaid: 0
        });

        console.log(`✅ User registered: ${userId} (${walletAddress})`);
        
        // Emit registration event
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('gembot:user-registered', {
                detail: { userId, walletAddress, timestamp: Date.now() }
            });
            window.dispatchEvent(event);
        }

        return true;
    }

    /**
     * Check if user is registered
     */
    isUserRegistered(userId) {
        return this.state.registeredUsers.has(userId);
    }

    /**
     * Get user registration info
     */
    getUserInfo(userId) {
        return this.state.registeredUsers.get(userId);
    }

    /**
     * Check if local AI endpoint is available
     */
    async checkAvailability() {
        try {
            let healthUrl;
            
            // Different health check endpoints for different providers
            switch (this.config.apiType) {
                case 'ollama':
                    healthUrl = `${this.config.aiEndpoint}/api/tags`;
                    break;
                case 'lmstudio':
                case 'openai-compatible':
                    healthUrl = `${this.config.aiEndpoint}/v1/models`;
                    break;
                default:
                    healthUrl = `${this.config.aiEndpoint}/health`;
            }

            const response = await fetch(healthUrl, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            
            this.state.isAvailable = response.ok;
            this.state.lastCheck = Date.now();
            
            if (this.state.isAvailable) {
                console.log(`✅ Local AI is available (${this.config.apiType})`);
            } else {
                console.warn(`⚠️ Local AI returned status ${response.status}`);
            }
            
            return this.state.isAvailable;
        } catch (error) {
            console.warn('⚠️ Local AI not available:', error.message);
            this.state.isAvailable = false;
            this.state.lastCheck = Date.now();
            return false;
        }
    }

    /**
     * Check if user has enough $GBUV tokens for gas fee
     */
    async checkGasBalance(userId) {
        try {
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
    async chargeGasFee(userId, amount = this.config.gasFeePerCall) {
        try {
            const marketplace = window.GemBotMarketplace;
            if (!marketplace || !marketplace.wallet) {
                throw new Error('Marketplace not initialized');
            }

            const previousBalance = marketplace.wallet.tokenBalance || 0;
            
            if (previousBalance < amount) {
                throw new Error(`Insufficient balance: ${previousBalance} $GBUV`);
            }

            marketplace.wallet.tokenBalance -= amount;
            
            // Track gas paid globally
            this.state.totalGasPaid += amount;
            
            // Track per user if registered
            if (userId && this.state.registeredUsers.has(userId)) {
                const userInfo = this.state.registeredUsers.get(userId);
                userInfo.totalGasPaid += amount;
                userInfo.totalCalls++;
            }
            
            // Save state
            if (marketplace.saveState) {
                marketplace.saveState();
            }
            
            console.log(`⛽ Gas fee charged: ${amount} $GBUV (Balance: ${marketplace.wallet.tokenBalance})`);
            
            // Emit event
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('gembot:gas-fee-charged', {
                    detail: {
                        userId,
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
     * Ask AI a question with Merlin personality context
     */
    async askAI(question, context = {}) {
        const userId = context.userId || 'guest';

        // Check if AI is available (recheck periodically)
        if (!this.state.isAvailable || Date.now() - this.state.lastCheck > 60000) {
            await this.checkAvailability();
        }

        if (!this.state.isAvailable) {
            if (this.config.fallbackToBasic) {
                console.log('📝 AI unavailable, falling back to basic Q&A');
                return this.fallbackResponse(question, context);
            }
            throw new Error('Local AI is not available');
        }

        // Check gas balance
        const hasBalance = await this.checkGasBalance(userId);
        if (!hasBalance) {
            throw new Error('Insufficient $GBUV balance for gas fee');
        }

        try {
            // Build prompt with Merlin personality
            const prompt = this.buildMerlinPrompt(question, context);
            
            // Make API call to local AI
            const response = await this.callLocalAI(prompt);
            
            // Charge gas fee after successful response
            await this.chargeGasFee(userId);
            
            // Track successful call
            this.state.totalCalls++;
            
            // Wrap response in Merlin style
            const wrappedResponse = this.wrapMerlinResponse(response, context);
            
            console.log(`✅ AI response received (Call #${this.state.totalCalls})`);
            
            return wrappedResponse;
            
        } catch (error) {
            console.error('Error calling local AI:', error);
            this.state.failedCalls++;
            
            // Fallback if enabled
            if (this.config.fallbackToBasic) {
                console.log('📝 AI call failed, falling back to basic Q&A');
                return this.fallbackResponse(question, context);
            }
            
            throw error;
        }
    }

    /**
     * Build prompt with Merlin personality and context
     */
    buildMerlinPrompt(question, context) {
        const personality = `You are Merlin, an ancient wizard mentor teaching gemstone cutting in a 3D game world.
        
Your personality:
- Wise, patient, and encouraging
- Use metaphors relating to gems, crystals, and craftsmanship
- Address the student warmly (e.g., "young apprentice", "my friend")
- Occasionally reference "the ancient arts" or "time-honored traditions"
- Be concise but insightful (under 200 words)
- Use emoji sparingly for emphasis (🔮, ✨, 💎, ⚡)

Context:
${context.playerLevel ? `- Student level: ${context.playerLevel}` : ''}
${context.currentStone ? `- Working on: ${context.currentStone}` : ''}
${context.recentActions ? `- Recent actions: ${context.recentActions.join(', ')}` : ''}
${context.struggles ? `- Struggling with: ${context.struggles.join(', ')}` : ''}
${context.in3DWorld ? '- Currently in 3D game environment' : ''}

Question: ${question}

Respond as Merlin would:`;

        return personality;
    }

    /**
     * Call local AI API
     */
    async callLocalAI(prompt) {
        const apiPath = this.apiPaths[this.config.apiType] || '/api/generate';
        const url = `${this.config.aiEndpoint}${apiPath}`;
        
        let requestBody;
        
        // Build request based on API type
        switch (this.config.apiType) {
            case 'ollama':
                requestBody = {
                    model: this.config.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: this.config.temperature,
                        num_predict: this.config.maxTokens
                    }
                };
                break;
                
            case 'lmstudio':
            case 'openai-compatible':
                requestBody = {
                    model: this.config.model,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    temperature: this.config.temperature,
                    max_tokens: this.config.maxTokens
                };
                break;
                
            default:
                throw new Error(`Unsupported API type: ${this.config.apiType}`);
        }

        let lastError;
        
        for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`AI API returned ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                // Extract response text based on API format
                let responseText;
                
                if (this.config.apiType === 'ollama') {
                    responseText = data.response;
                } else if (data.choices && data.choices[0]) {
                    responseText = data.choices[0].message?.content || data.choices[0].text;
                } else if (data.content) {
                    responseText = data.content;
                } else if (data.text) {
                    responseText = data.text;
                }
                
                if (!responseText) {
                    throw new Error('Unexpected AI response format');
                }
                
                return responseText;
                
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
     * Wrap AI response in Merlin style if needed
     */
    wrapMerlinResponse(response, context) {
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
            const response = merlinKnowledge.smartResponse?.(question, context);
            if (response) return response;
        }
        
        return "The ancient wisdom flows differently today. Perhaps the mystical energies need time to realign. Try asking again shortly, or explore the knowledge archives.";
    }

    /**
     * Get integration statistics
     */
    getStats() {
        return {
            available: this.state.isAvailable,
            endpoint: this.config.aiEndpoint,
            model: this.config.model,
            apiType: this.config.apiType,
            totalCalls: this.state.totalCalls,
            failedCalls: this.state.failedCalls,
            successRate: this.state.totalCalls > 0 ? 
                ((this.state.totalCalls - this.state.failedCalls) / this.state.totalCalls * 100).toFixed(1) + '%' : 
                'N/A',
            totalGasPaid: this.state.totalGasPaid,
            gasFeePerCall: this.config.gasFeePerCall,
            registeredUsers: this.state.registeredUsers.size,
            lastCheck: this.state.lastCheck ? new Date(this.state.lastCheck).toLocaleString() : 'Never'
        };
    }

    /**
     * Get all registered users
     */
    getRegisteredUsers() {
        return Array.from(this.state.registeredUsers.entries()).map(([userId, info]) => ({
            userId,
            ...info
        }));
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.GemBotLocalAI = GemBotLocalAI;
}

console.log('🤖 GemBot Local AI Integration module loaded');
