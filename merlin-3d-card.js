/**
 * 🎴 Merlin AI 3D Card System
 * Interactive 3D card with Merlin chat on front, controller on back
 * Features: Draggable, animated, context-aware tooltips, game mechanics integration
 * 
 * © 2024-2025 Ryan Barbrick / Barbrick Design
 * SIGNATURE: GBOT-RB-2025-7X9K2M4P-BARBRICK
 */

const MerlinAICard = {
    version: '1.0.0',
    initialized: false,
    
    // Card state
    state: {
        isFlipped: false,
        position: { x: window.innerWidth - 420, y: 100 },
        size: { width: 400, height: 600 },
        isMinimized: false,
        isDragging: false,
        isSpeaking: false,
        tooltips: []
    },
    
    // Drag state
    dragState: {
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
    },
    
    // Current context for tooltips
    currentContext: {
        topic: null,
        keywords: [],
        suggestions: []
    },
    
    /**
     * Initialize the 3D Merlin card
     */
    init() {
        if (this.initialized) return;
        
        console.log('🎴 Initializing Merlin 3D Card...');
        
        // Create card structure
        this.createCard();
        
        // Setup event listeners
        this.setupEvents();
        
        // Load saved position
        this.loadState();
        
        // Migrate existing chat to card
        this.migrateChat();
        
        this.initialized = true;
        console.log('✅ Merlin 3D Card initialized');
    },
    
    /**
     * Create the 3D card HTML structure
     */
    createCard() {
        const cardHTML = `
            <div id="merlinCard" class="merlin-3d-card" style="transform: translate(${this.state.position.x}px, ${this.state.position.y}px); width: ${this.state.size.width}px; height: ${this.state.size.height}px;">
                <!-- Card Inner Container (flippable) -->
                <div class="merlin-card-inner ${this.state.isFlipped ? 'flipped' : ''}">
                    
                    <!-- FRONT SIDE: Chat Interface -->
                    <div class="merlin-card-face merlin-card-front">
                        <!-- Card Header -->
                        <div class="merlin-card-header">
                            <div class="merlin-avatar-animated" id="merlinAvatar">
                                <div class="merlin-avatar-circle">🧙‍♂️</div>
                                <div class="merlin-speaking-indicator"></div>
                            </div>
                            <div class="merlin-card-title">
                                <h3>Merlin AI</h3>
                                <span class="merlin-status">Ready to assist</span>
                            </div>
                            <div class="merlin-card-controls">
                                <button class="card-btn" onclick="MerlinAICard.minimize()" title="Minimize">_</button>
                                <button class="card-btn" onclick="MerlinAICard.flip()" title="Settings">⚙️</button>
                            </div>
                        </div>
                        
                        <!-- Chat Messages Area -->
                        <div class="merlin-chat-messages" id="merlinChatMessages">
                            <!-- Messages will be migrated here -->
                        </div>
                        
                        <!-- Context Tooltips (Dynamic) -->
                        <div class="merlin-tooltips" id="merlinTooltips">
                            <!-- Contextual help buttons appear here -->
                        </div>
                        
                        <!-- Quick Actions Bar -->
                        <div class="merlin-quick-actions">
                            <button class="quick-action-btn" onclick="MerlinAICard.quickAction('help')" title="Help">❓</button>
                            <button class="quick-action-btn" onclick="MerlinAICard.quickAction('tutorial')" title="Tutorial">📚</button>
                            <button class="quick-action-btn" onclick="MerlinAICard.quickAction('tips')" title="Tips">💡</button>
                            <button class="quick-action-btn" onclick="MerlinAICard.quickAction('achievement')" title="Achievements">🏆</button>
                        </div>
                    </div>
                    
                    <!-- BACK SIDE: Controller & Settings -->
                    <div class="merlin-card-face merlin-card-back">
                        <!-- Back Header -->
                        <div class="merlin-card-header">
                            <div class="merlin-card-title">
                                <h3>⚙️ Controls & Settings</h3>
                            </div>
                            <div class="merlin-card-controls">
                                <button class="card-btn" onclick="MerlinAICard.flip()" title="Back to Chat">🔙</button>
                            </div>
                        </div>
                        
                        <!-- Voice Controls -->
                        <div class="control-section">
                            <h4>🔊 Voice Settings</h4>
                            <div class="control-item">
                                <label>Voice</label>
                                <select id="merlinVoiceSelect" onchange="MerlinAICard.updateVoice()">
                                    <option value="default">Default Voice</option>
                                </select>
                            </div>
                            <div class="control-item">
                                <label>Speed: <span id="merlinRateValue">100%</span></label>
                                <input type="range" id="merlinRateSlider" min="0.5" max="2" step="0.1" value="1" 
                                       oninput="MerlinAICard.updateRate(this.value)">
                            </div>
                            <div class="control-item">
                                <label>Pitch: <span id="merlinPitchValue">1.0</span></label>
                                <input type="range" id="merlinPitchSlider" min="0.5" max="2" step="0.1" value="1" 
                                       oninput="MerlinAICard.updatePitch(this.value)">
                            </div>
                            <div class="control-item">
                                <label>Volume: <span id="merlinVolumeValue">100%</span></label>
                                <input type="range" id="merlinVolumeSlider" min="0" max="1" step="0.1" value="1" 
                                       oninput="MerlinAICard.updateVolume(this.value)">
                            </div>
                            <button class="control-btn" onclick="MerlinAICard.toggleVoice()">
                                <span id="merlinVoiceStatus">🔊 Voice ON</span>
                            </button>
                        </div>
                        
                        <!-- Animation Settings -->
                        <div class="control-section">
                            <h4>🎭 Animation Settings</h4>
                            <div class="control-item">
                                <label>
                                    <input type="checkbox" id="merlinAnimationsToggle" checked onchange="MerlinAICard.toggleAnimations()">
                                    Enable Animations
                                </label>
                            </div>
                            <div class="control-item">
                                <label>
                                    <input type="checkbox" id="merlinSpeakingAnimToggle" checked onchange="MerlinAICard.toggleSpeakingAnim()">
                                    Speaking Animation
                                </label>
                            </div>
                        </div>
                        
                        <!-- Tooltip Settings -->
                        <div class="control-section">
                            <h4>💬 Tooltip Settings</h4>
                            <div class="control-item">
                                <label>
                                    <input type="checkbox" id="merlinTooltipsToggle" checked onchange="MerlinAICard.toggleTooltips()">
                                    Show Context Tooltips
                                </label>
                            </div>
                            <div class="control-item">
                                <label>Tooltip Style</label>
                                <select id="merlinTooltipStyle" onchange="MerlinAICard.updateTooltipStyle()">
                                    <option value="compact">Compact</option>
                                    <option value="detailed">Detailed</option>
                                    <option value="minimal">Minimal</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Position Controls -->
                        <div class="control-section">
                            <h4>📍 Position</h4>
                            <button class="control-btn" onclick="MerlinAICard.resetPosition()">Reset Position</button>
                            <button class="control-btn" onclick="MerlinAICard.saveState()">Save State</button>
                        </div>
                    </div>
                </div>
                
                <!-- Drag Handle -->
                <div class="merlin-card-drag-handle">⋮⋮</div>
            </div>
            
            <!-- Minimized State -->
            <div id="merlinCardMinimized" class="merlin-card-minimized hidden" onclick="MerlinAICard.restore()">
                <div class="minimized-avatar">🧙‍♂️</div>
                <span>Merlin AI</span>
            </div>
        `;
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', cardHTML);
    },
    
    /**
     * Setup event listeners
     */
    setupEvents() {
        const card = document.getElementById('merlinCard');
        const dragHandle = card.querySelector('.merlin-card-drag-handle');
        
        // Drag events
        dragHandle.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', (e) => this.endDrag(e));
        
        // Touch events for mobile
        dragHandle.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => this.handleDrag(e.touches[0]));
        document.addEventListener('touchend', (e) => this.endDrag(e));
    },
    
    /**
     * Start dragging
     */
    startDrag(e) {
        this.state.isDragging = true;
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        this.dragState.offsetX = this.state.position.x;
        this.dragState.offsetY = this.state.position.y;
        
        const card = document.getElementById('merlinCard');
        card.style.cursor = 'grabbing';
    },
    
    /**
     * Handle drag movement
     */
    handleDrag(e) {
        if (!this.state.isDragging) return;
        
        const deltaX = e.clientX - this.dragState.startX;
        const deltaY = e.clientY - this.dragState.startY;
        
        this.state.position.x = this.dragState.offsetX + deltaX;
        this.state.position.y = this.dragState.offsetY + deltaY;
        
        // Keep card within viewport
        this.state.position.x = Math.max(0, Math.min(window.innerWidth - this.state.size.width, this.state.position.x));
        this.state.position.y = Math.max(0, Math.min(window.innerHeight - this.state.size.height, this.state.position.y));
        
        this.updateCardPosition();
    },
    
    /**
     * End dragging
     */
    endDrag(e) {
        if (!this.state.isDragging) return;
        
        this.state.isDragging = false;
        const card = document.getElementById('merlinCard');
        card.style.cursor = '';
        
        // Save position
        this.saveState();
    },
    
    /**
     * Update card position
     */
    updateCardPosition() {
        const card = document.getElementById('merlinCard');
        card.style.transform = `translate(${this.state.position.x}px, ${this.state.position.y}px)`;
    },
    
    /**
     * Flip card (front <-> back)
     */
    flip() {
        this.state.isFlipped = !this.state.isFlipped;
        const inner = document.querySelector('.merlin-card-inner');
        inner.classList.toggle('flipped');
        
        // Animate flip
        if (window.GemBotAnimations) {
            const card = document.getElementById('merlinCard');
            GemBotAnimations.animate(card, 'flipInY');
        }
    },
    
    /**
     * Minimize card
     */
    minimize() {
        this.state.isMinimized = true;
        document.getElementById('merlinCard').classList.add('hidden');
        document.getElementById('merlinCardMinimized').classList.remove('hidden');
        
        if (window.GemBotAnimations) {
            GemBotAnimations.animate(document.getElementById('merlinCardMinimized'), 'bounceIn');
        }
    },
    
    /**
     * Restore from minimized
     */
    restore() {
        this.state.isMinimized = false;
        document.getElementById('merlinCardMinimized').classList.add('hidden');
        document.getElementById('merlinCard').classList.remove('hidden');
        
        if (window.GemBotAnimations) {
            GemBotAnimations.animate(document.getElementById('merlinCard'), 'bounceIn');
        }
    },
    
    /**
     * Migrate chat from right panel to card
     */
    migrateChat() {
        const oldMessages = document.getElementById('aiMessages');
        const newMessages = document.getElementById('merlinChatMessages');
        
        if (oldMessages && newMessages) {
            // Copy all messages
            newMessages.innerHTML = oldMessages.innerHTML;
            
            // Hide old panel (keep it for now in case we need to revert)
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) {
                rightPanel.style.display = 'none';
            }
        }
    },
    
    /**
     * Add message to card
     */
    addMessage(text, type = 'ai') {
        const messagesDiv = document.getElementById('merlinChatMessages');
        if (!messagesDiv) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = text;
        
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Animate message
        if (window.GemBotAnimations) {
            GemBotAnimations.message.add(messageEl);
        }
        
        // Trigger speaking animation
        if (type === 'ai') {
            this.triggerSpeakingAnimation();
        }
    },
    
    /**
     * Trigger speaking animation
     */
    triggerSpeakingAnimation() {
        this.state.isSpeaking = true;
        const avatar = document.querySelector('.merlin-avatar-animated');
        const indicator = document.querySelector('.merlin-speaking-indicator');
        
        if (avatar) {
            avatar.classList.add('speaking');
            if (window.GemBotAnimations) {
                GemBotAnimations.merlin.speak(avatar);
            }
        }
        
        if (indicator) {
            indicator.classList.add('active');
        }
        
        // Stop after 3 seconds (or when speech ends)
        setTimeout(() => this.stopSpeakingAnimation(), 3000);
    },
    
    /**
     * Stop speaking animation
     */
    stopSpeakingAnimation() {
        this.state.isSpeaking = false;
        const avatar = document.querySelector('.merlin-avatar-animated');
        const indicator = document.querySelector('.merlin-speaking-indicator');
        
        if (avatar) avatar.classList.remove('speaking');
        if (indicator) indicator.classList.remove('active');
    },
    
    /**
     * Update context and show relevant tooltips
     */
    updateContext(topic, keywords = [], suggestions = []) {
        this.currentContext = { topic, keywords, suggestions };
        this.renderTooltips();
    },
    
    /**
     * Render contextual tooltips
     */
    renderTooltips() {
        const tooltipsDiv = document.getElementById('merlinTooltips');
        if (!tooltipsDiv) return;
        
        let html = '';
        this.currentContext.suggestions.forEach((suggestion, idx) => {
            html += `
                <button class="merlin-tooltip-btn animate__animated animate__fadeInUp" 
                        style="animation-delay: ${idx * 0.1}s"
                        onclick="MerlinAICard.executeSuggestion('${suggestion.action}', '${suggestion.param}')">
                    ${suggestion.icon} ${suggestion.text}
                </button>
            `;
        });
        
        tooltipsDiv.innerHTML = html;
    },
    
    /**
     * Execute tooltip suggestion
     */
    executeSuggestion(action, param) {
        console.log('Executing suggestion:', action, param);
        
        switch(action) {
            case 'connect':
                if (typeof serial !== 'undefined') serial.scanPorts();
                break;
            case 'tutorial':
                // Open tutorial
                break;
            case 'marketplace':
                if (typeof marketplaceUI !== 'undefined') marketplaceUI.open();
                break;
            case 'game':
                if (typeof openGameMode !== 'undefined') openGameMode();
                break;
            default:
                console.log('Unknown action:', action);
        }
    },
    
    /**
     * Quick action buttons
     */
    quickAction(type) {
        switch(type) {
            case 'help':
                this.addMessage('How can I help you today? Ask me about: connecting your machine, game tips, marketplace, or tutorials!', 'ai');
                break;
            case 'tutorial':
                this.updateContext('tutorial', ['learning', 'guide'], [
                    { icon: '🔌', text: 'Connect Machine', action: 'connect', param: '' },
                    { icon: '🎮', text: 'Game Tutorial', action: 'tutorial', param: 'game' },
                    { icon: '💎', text: 'Gem Cutting 101', action: 'tutorial', param: 'cutting' }
                ]);
                break;
            case 'tips':
                this.addMessage('💡 Tip: Use CTRL+drag to move panels around. Double-click to reset positions!', 'system');
                break;
            case 'achievement':
                if (typeof leaderboardUI !== 'undefined') leaderboardUI.open();
                leaderboardUI.switchTab('achievements');
                break;
        }
    },
    
    /**
     * Voice control methods
     */
    toggleVoice() {
        // Hook into existing voice system
        const btn = document.getElementById('voiceToggleBtn');
        if (btn) btn.click();
    },
    
    updateVoice() {
        const select = document.getElementById('merlinVoiceSelect');
        const oldSelect = document.getElementById('voiceSelect');
        if (oldSelect && select) {
            oldSelect.value = select.value;
            oldSelect.dispatchEvent(new Event('change'));
        }
    },
    
    updateRate(value) {
        document.getElementById('merlinRateValue').textContent = Math.round(value * 100) + '%';
        const oldSlider = document.getElementById('rateSlider');
        if (oldSlider) oldSlider.value = value;
    },
    
    updatePitch(value) {
        document.getElementById('merlinPitchValue').textContent = value;
        const oldSlider = document.getElementById('pitchSlider');
        if (oldSlider) oldSlider.value = value;
    },
    
    updateVolume(value) {
        document.getElementById('merlinVolumeValue').textContent = Math.round(value * 100) + '%';
        const oldSlider = document.getElementById('volumeSlider');
        if (oldSlider) oldSlider.value = value;
    },
    
    /**
     * Setting toggles
     */
    toggleAnimations() {
        // Toggle animations globally
    },
    
    toggleSpeakingAnim() {
        // Toggle speaking animation
    },
    
    toggleTooltips() {
        const tooltipsDiv = document.getElementById('merlinTooltips');
        if (tooltipsDiv) {
            tooltipsDiv.style.display = document.getElementById('merlinTooltipsToggle').checked ? 'flex' : 'none';
        }
    },
    
    updateTooltipStyle() {
        const style = document.getElementById('merlinTooltipStyle').value;
        const tooltipsDiv = document.getElementById('merlinTooltips');
        if (tooltipsDiv) {
            tooltipsDiv.className = `merlin-tooltips tooltip-style-${style}`;
        }
    },
    
    /**
     * Position management
     */
    resetPosition() {
        this.state.position = { x: window.innerWidth - 420, y: 100 };
        this.updateCardPosition();
        this.saveState();
    },
    
    /**
     * Save state to localStorage
     */
    saveState() {
        localStorage.setItem('merlinCardState', JSON.stringify(this.state));
    },
    
    /**
     * Load state from localStorage
     */
    loadState() {
        const saved = localStorage.getItem('merlinCardState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.state = { ...this.state, ...state };
                this.updateCardPosition();
            } catch (e) {
                console.error('Failed to load Merlin card state:', e);
            }
        }
    }
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => MerlinAICard.init(), 1500);
    });
} else {
    setTimeout(() => MerlinAICard.init(), 1500);
}

// Export to window
window.MerlinAICard = MerlinAICard;
