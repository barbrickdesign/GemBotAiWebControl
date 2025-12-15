/**
 * Merlin AI 3D Card - Integrated Reference Design
 * Meshes reference design (index.html) structure with GemBot API functions
 */

class MerlinAICardIntegrated {
    constructor() {
        this.card = null;
        this.canvasState = {
            t: 0,
            mouseX: 0,
            mouseY: 0,
            tiltX: 0,
            tiltY: 0,
            bob: 0,
            gem: {
                x: 0.7,
                y: 0.62,
                targetX: 0.7,
                targetY: 0.62,
                drag: false
            },
            img: null
        };
        this.state = {
            isMinimized: false,
            isFlipped: false,
            position: { x: window.innerWidth - 420, y: 100 },
            isDragging: false,
            dragOffset: { x: 0, y: 0 },
            messages: [],
            currentLevel: 1,
            currentXP: 0,
            maxXP: 100,
            userName: 'Guest',
            heartProgress: 0,
            starProgress: 0
        };
        this.init();
    }

    init() {
        this.createCard();
        this.attachEventListeners();
        this.initCanvas3D();
        this.updatePosition();
        
        // Auto-connect to existing user profile if available
        if (window.merlin && window.merlin.userProfile) {
            this.updateLevel(
                window.merlin.userProfile.level || 1,
                window.merlin.userProfile.currentXP || 0,
                window.merlin.userProfile.maxXP || 100,
                window.merlin.userProfile.name || 'Guest'
            );
        }
    }

    createCard() {
        this.card = document.createElement('div');
        this.card.id = 'merlin-ai-card-integrated';
        this.card.className = 'merlin-card-container';
        
        // Reference design HTML structure
        this.card.innerHTML = `
            <div class="magical-bg"></div>
            <div class="card-container ${this.state.isFlipped ? 'flipped' : ''}">
                <div class="card-flip-inner">
                    <!-- FRONT SIDE -->
                    <div class="card-front">
                        <div class="glass-blocker"></div>
                        <div class="card-glow"></div>
                        
                        <div class="card-frame">
                            <!-- User Info Header -->
                            <div id="merlin-user-info" style="display:flex;align-items:center;justify-content:space-between;padding:8px 18px 0 18px;">
                                <span id="merlin-user-name" style="font-weight:bold;font-size:1.1em;">${this.state.userName}</span>
                                <span id="merlin-user-level" style="font-size:1.1em;">Lv${this.state.currentLevel}</span>
                            </div>
                            
                            <!-- Level XP Progress Bar -->
                            <div class="level-xp-bar">
                                <div class="level-section">
                                    <span class="level-number" id="merlinLevelNum">Lv${this.state.currentLevel}</span>
                                </div>
                                <div class="xp-section">
                                    <div class="xp-fill" id="merlinXpFill" style="width: 0%"></div>
                                    <div class="xp-text">
                                        <span class="xp-text-full" id="merlinXpFull">${this.state.currentXP} / ${this.state.maxXP} XP</span>
                                        <span class="xp-text-short" id="merlinXpShort">${this.formatXP(this.state.currentXP)}/${this.formatXP(this.state.maxXP)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Card Art with 3D Canvas -->
                            <div class="card-art">
                                <canvas id="merlin3dCanvas"></canvas>
                                <div id="merlinGem" class="merlin-gem-draggable">
                                    <svg class="merlin-gemstone" id="merlinGemstone" viewBox="0 0 100 100" width="60" height="60">
                                        <defs>
                                            <filter id="gemGlow">
                                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"/>
                                                    <feMergeNode in="SourceGraphic"/>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <polygon points="50,10 70,35 60,70 40,70 30,35" 
                                                 fill="var(--gem-color, #a855f7)" 
                                                 stroke="#fff" 
                                                 stroke-width="2" 
                                                 filter="url(#gemGlow)"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <!-- Card Name / Title -->
                            <div class="card-name">
                                <h2>Merlin AI Assistant</h2>
                                <div class="merlin-status">
                                    <span class="status-dot"></span>
                                    <span class="status-text">Ready</span>
                                </div>
                            </div>
                            
                            <!-- Progress Indicators -->
                            <div class="merlin-progress-section">
                                <div class="progress-stat heart">
                                    <div class="progress-icon">❤️</div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill heart-fill" id="merlinHeartFill" style="width: 0%"></div>
                                        <div class="progress-bar-text" id="merlinHeartText">0%</div>
                                    </div>
                                </div>
                                <div class="progress-stat star">
                                    <div class="progress-icon">⭐</div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill star-fill" id="merlinStarFill" style="width: 0%"></div>
                                        <div class="progress-bar-text" id="merlinStarText">0%</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Chat Messages -->
                            <div class="merlin-chat-messages" id="merlinMessages"></div>
                            
                            <!-- Chat Input -->
                            <div class="merlin-input-container">
                                <textarea class="merlin-input" id="merlinInput" placeholder="Ask Merlin anything..." rows="2"></textarea>
                                <button class="merlin-send-btn" id="merlinSendBtn">Send</button>
                            </div>
                            
                            <!-- Card Controls -->
                            <div class="card-controls">
                                <button class="card-btn minimize-btn" id="merlinMinimize" title="Minimize">_</button>
                                <button class="card-btn flip-btn" id="merlinFlip" title="Flip Card">⚙️</button>
                            </div>
                            
                            <!-- Border Decorations -->
                            <div class="border-decoration top"></div>
                            <div class="border-decoration bottom"></div>
                            <div class="border-decoration left"></div>
                            <div class="border-decoration right"></div>
                        </div>
                    </div>
                    
                    <!-- BACK SIDE - Control Panel -->
                    <div class="card-back">
                        <div class="glass-blocker"></div>
                        <div class="card-glow"></div>
                        
                        <div class="card-frame">
                            <div class="card-name">
                                <h2>🎮 GemBot Controls</h2>
                            </div>
                            
                            <!-- Merlin's Advice Banner -->
                            <div class="merlin-advice-banner" id="merlinAdvice">
                                <div class="advice-icon">🧙‍♂️</div>
                                <div class="advice-text" id="adviceText">Select the highlighted action below...</div>
                            </div>
                            
                            <!-- Control Panel Grid -->
                            <div class="control-panel-grid">
                                <!-- Farm Controls -->
                                <div class="control-section">
                                    <h3>🌾 Farm</h3>
                                    <button class="control-btn" data-action="plant" id="btn-plant">
                                        <span class="btn-icon">🌱</span>
                                        <span class="btn-label">Plant Gems</span>
                                    </button>
                                    <button class="control-btn" data-action="harvest" id="btn-harvest">
                                        <span class="btn-icon">💎</span>
                                        <span class="btn-label">Harvest</span>
                                    </button>
                                    <button class="control-btn" data-action="upgrade-farm" id="btn-upgrade-farm">
                                        <span class="btn-icon">⬆️</span>
                                        <span class="btn-label">Upgrade Farm</span>
                                    </button>
                                </div>
                                
                                <!-- Forge Controls -->
                                <div class="control-section">
                                    <h3>🔨 Forge</h3>
                                    <button class="control-btn" data-action="craft" id="btn-craft">
                                        <span class="btn-icon">⚒️</span>
                                        <span class="btn-label">Craft Item</span>
                                    </button>
                                    <button class="control-btn" data-action="repair" id="btn-repair">
                                        <span class="btn-icon">🔧</span>
                                        <span class="btn-label">Repair</span>
                                    </button>
                                    <button class="control-btn" data-action="enhance" id="btn-enhance">
                                        <span class="btn-icon">✨</span>
                                        <span class="btn-label">Enhance</span>
                                    </button>
                                </div>
                                
                                <!-- Machine Controls -->
                                <div class="control-section">
                                    <h3>🤖 Machine</h3>
                                    <button class="control-btn" data-action="scan" id="btn-scan">
                                        <span class="btn-icon">🔍</span>
                                        <span class="btn-label">Scan Area</span>
                                    </button>
                                    <button class="control-btn" data-action="connect" id="btn-connect">
                                        <span class="btn-icon">🔗</span>
                                        <span class="btn-label">Connect</span>
                                    </button>
                                    <button class="control-btn" data-action="analyze" id="btn-analyze">
                                        <span class="btn-icon">📊</span>
                                        <span class="btn-label">Analyze</span>
                                    </button>
                                </div>
                                
                                <!-- Trading Controls -->
                                <div class="control-section">
                                    <h3>🏪 Trading</h3>
                                    <button class="control-btn" data-action="marketplace" id="btn-marketplace">
                                        <span class="btn-icon">🛒</span>
                                        <span class="btn-label">Marketplace</span>
                                    </button>
                                    <button class="control-btn" data-action="trade" id="btn-trade">
                                        <span class="btn-icon">💰</span>
                                        <span class="btn-label">Trade Gems</span>
                                    </button>
                                    <button class="control-btn" data-action="inventory" id="btn-inventory">
                                        <span class="btn-icon">🎒</span>
                                        <span class="btn-label">Inventory</span>
                                    </button>
                                </div>
                                
                                <!-- Academy Controls -->
                                <div class="control-section">
                                    <h3>📚 Academy</h3>
                                    <button class="control-btn" data-action="learn" id="btn-learn">
                                        <span class="btn-icon">📖</span>
                                        <span class="btn-label">Learn Skill</span>
                                    </button>
                                    <button class="control-btn" data-action="tutorial" id="btn-tutorial">
                                        <span class="btn-icon">🎓</span>
                                        <span class="btn-label">Tutorial</span>
                                    </button>
                                    <button class="control-btn" data-action="guide" id="btn-guide">
                                        <span class="btn-icon">📜</span>
                                        <span class="btn-label">Guide</span>
                                    </button>
                                </div>
                                
                                <!-- System Controls -->
                                <div class="control-section">
                                    <h3>⚙️ System</h3>
                                    <button class="control-btn" data-action="settings" id="btn-settings">
                                        <span class="btn-icon">⚙️</span>
                                        <span class="btn-label">Settings</span>
                                    </button>
                                    <button class="control-btn" data-action="help" id="btn-help">
                                        <span class="btn-icon">❓</span>
                                        <span class="btn-label">Help</span>
                                    </button>
                                    <button class="control-btn" data-action="exit" id="btn-exit">
                                        <span class="btn-icon">🚪</span>
                                        <span class="btn-label">Exit</span>
                                    </button>
                                </div>
                            </div>
                            
                            <button class="card-btn back-btn" id="merlinFlipBack">← Back to Chat</button>
                            
                            <div class="border-decoration top"></div>
                            <div class="border-decoration bottom"></div>
                            <div class="border-decoration left"></div>
                            <div class="border-decoration right"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.card);
    }

    attachEventListeners() {
        // Dragging
        const header = this.card.querySelector('.card-name');
        if (header) {
            header.style.cursor = 'move';
            header.addEventListener('mousedown', (e) => this.startDrag(e));
        }

        // Minimize button
        const minimizeBtn = this.card.querySelector('#merlinMinimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.minimize());
        }

        // Flip buttons
        const flipBtn = this.card.querySelector('#merlinFlip');
        const flipBackBtn = this.card.querySelector('#merlinFlipBack');
        if (flipBtn) flipBtn.addEventListener('click', () => this.flip());
        if (flipBackBtn) flipBackBtn.addEventListener('click', () => this.flip());

        // Send message
        const sendBtn = this.card.querySelector('#merlinSendBtn');
        const input = this.card.querySelector('#merlinInput');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Settings
        const gemColorPicker = this.card.querySelector('#gemColorPicker');
        if (gemColorPicker) {
            gemColorPicker.addEventListener('change', (e) => this.updateGemstoneColor(e.target.value));
        }

        // Control panel buttons
        const controlBtns = this.card.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                this.handleControlAction(action);
            });
        });

        // Gem dragging
        this.setupGemDragging();
    }

    initCanvas3D() {
        const canvas = this.card.querySelector('#merlin3dCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Find wizard image from reference
        const wizardImageBase64 = this.getWizardImage();
        
        const img = new Image();
        img.onload = () => {
            this.canvasState.img = img;
            this.fitCanvas(canvas, ctx);
            this.startCanvasLoop(canvas, ctx);
        };
        img.crossOrigin = 'anonymous';
        img.src = wizardImageBase64 || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzJhMmE0MCIvPjx0ZXh0IHg9IjI1MCIgeT0iMjUwIiBmb250LXNpemU9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+nmeKAjeKZgjwvdGV4dD48L3N2Zz4=';

        // Mouse tilt tracking
        const cardContainer = this.card.querySelector('.card-container');
        if (cardContainer) {
            cardContainer.addEventListener('mousemove', (e) => {
                const r = cardContainer.getBoundingClientRect();
                this.canvasState.mouseX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
                this.canvasState.mouseY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            });
            cardContainer.addEventListener('mouseleave', () => {
                this.canvasState.mouseX = 0;
                this.canvasState.mouseY = 0;
            });
        }
    }

    getWizardImage() {
        // Use the actual Merlin wizard image
        return './merlin-wizard.png'; // Will use provided image
    }

    fitCanvas(canvas, ctx) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        if (ctx) ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    startCanvasLoop(canvas, ctx) {
        const loop = (now) => {
            this.canvasState.t = (now || performance.now()) / 1000;
            this.updatePhysics();
            this.renderCanvas(canvas, ctx);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    updatePhysics() {
        // Bobbing motion
        const bob = Math.sin(this.canvasState.t * 1.2) * 6;
        this.canvasState.bob = bob;

        // Tilt smoothing
        this.canvasState.tiltX += (this.canvasState.mouseY * 12 - this.canvasState.tiltX) * 0.08;
        this.canvasState.tiltY += (this.canvasState.mouseX * -12 - this.canvasState.tiltY) * 0.08;

        // Gem position smoothing
        this.canvasState.gem.x += (this.canvasState.gem.targetX - this.canvasState.gem.x) * 0.12;
        this.canvasState.gem.y += (this.canvasState.gem.targetY - this.canvasState.gem.y) * 0.12;
    }

    renderCanvas(canvas, ctx) {
        if (!ctx || !this.canvasState.img) return;

        const w = canvas.width / devicePixelRatio;
        const h = canvas.height / devicePixelRatio;

        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2 + this.canvasState.bob;

        // Magical glow background
        const grd = ctx.createRadialGradient(cx, cy - 30, 10, cx, cy, Math.max(w, h));
        grd.addColorStop(0, 'rgba(120,80,200,0.12)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        // Draw wizard portrait with tilt
        const scale = 1.02 + Math.abs(this.canvasState.tiltX + this.canvasState.tiltY) * 0.002;
        const drawW = w * 0.95 * scale;
        const drawH = h * 0.95 * scale;
        const offsetX = this.canvasState.tiltY * 6;
        const offsetY = this.canvasState.tiltX * 6 + this.canvasState.bob;

        ctx.save();
        ctx.translate(cx + offsetX, cy + offsetY);
        ctx.rotate(this.canvasState.tiltY * 0.02);
        ctx.drawImage(this.canvasState.img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        // Magical aura
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(180,140,255,0.06)';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 20, drawW * 0.55, drawH * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update gem position
        const gemEl = this.card.querySelector('#merlinGem');
        if (gemEl) {
            const gx = this.canvasState.gem.x * w;
            const gy = this.canvasState.gem.y * h;
            gemEl.style.left = gx + 'px';
            gemEl.style.top = gy + 'px';
        }
    }

    setupGemDragging() {
        const gemEl = this.card.querySelector('#merlinGem');
        const canvas = this.card.querySelector('#merlin3dCanvas');
        if (!gemEl || !canvas) return;

        let dragging = false;

        gemEl.addEventListener('mousedown', (e) => {
            e.preventDefault();
            dragging = true;
            gemEl.style.cursor = 'grabbing';
            this.canvasState.gem.drag = true;
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const r = canvas.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width;
            const ny = (e.clientY - r.top) / r.height;
            this.canvasState.gem.targetX = Math.max(0.08, Math.min(0.92, nx));
            this.canvasState.gem.targetY = Math.max(0.08, Math.min(0.92, ny));
        });

        window.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                gemEl.style.cursor = 'grab';
                this.canvasState.gem.drag = false;
            }
        });
    }

    // ============= PUBLIC API METHODS =============

    /**
     * Update user level and XP progress
     */
    updateLevel(level, currentXP, maxXP, username) {
        this.state.currentLevel = level || 1;
        this.state.currentXP = currentXP || 0;
        this.state.maxXP = maxXP || 100;
        if (username) this.state.userName = username;

        // Update UI
        const userNameEl = this.card.querySelector('#merlin-user-name');
        const userLevelEl = this.card.querySelector('#merlin-user-level');
        const levelNumEl = this.card.querySelector('#merlinLevelNum');
        const xpFillEl = this.card.querySelector('#merlinXpFill');
        const xpFullEl = this.card.querySelector('#merlinXpFull');
        const xpShortEl = this.card.querySelector('#merlinXpShort');

        if (userNameEl) userNameEl.textContent = this.state.userName;
        if (userLevelEl) userLevelEl.textContent = `Lv${level}`;
        if (levelNumEl) levelNumEl.textContent = `Lv${level}`;

        const xpPercent = (currentXP / maxXP) * 100;
        if (xpFillEl) {
            xpFillEl.style.width = `${xpPercent}%`;
            xpFillEl.style.animation = 'xp-flash 0.8s ease-out';
            setTimeout(() => xpFillEl.style.animation = '', 800);
        }

        if (xpFullEl) xpFullEl.textContent = `${currentXP} / ${maxXP} XP`;
        if (xpShortEl) xpShortEl.textContent = `${this.formatXP(currentXP)}/${this.formatXP(maxXP)}`;

        console.log(`[Merlin] Level updated: Lv${level}, XP: ${currentXP}/${maxXP}`);
    }

    /**
     * Update heart (in-game) and star (academy) progress
     */
    updateProgress(heartProgress, starProgress) {
        this.state.heartProgress = Math.max(0, Math.min(100, heartProgress || 0));
        this.state.starProgress = Math.max(0, Math.min(100, starProgress || 0));

        const heartFillEl = this.card.querySelector('#merlinHeartFill');
        const heartTextEl = this.card.querySelector('#merlinHeartText');
        const starFillEl = this.card.querySelector('#merlinStarFill');
        const starTextEl = this.card.querySelector('#merlinStarText');

        if (heartFillEl) heartFillEl.style.width = `${this.state.heartProgress}%`;
        if (heartTextEl) heartTextEl.textContent = `${Math.round(this.state.heartProgress)}%`;
        if (starFillEl) starFillEl.style.width = `${this.state.starProgress}%`;
        if (starTextEl) starTextEl.textContent = `${Math.round(this.state.starProgress)}%`;

        // Glow effect for >75%
        if (this.state.heartProgress > 75) heartFillEl?.classList.add('glowing');
        else heartFillEl?.classList.remove('glowing');

        if (this.state.starProgress > 75) starFillEl?.classList.add('glowing');
        else starFillEl?.classList.remove('glowing');

        console.log(`[Merlin] Progress updated: ❤️${this.state.heartProgress}% ⭐${this.state.starProgress}%`);
    }

    /**
     * Update gemstone color based on context
     */
    updateGemstoneColor(context) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            thinking: '#3b82f6',
            question: '#f59e0b',
            magic: '#a855f7'
        };

        const color = colors[context] || context || '#a855f7';
        
        const gemstone = this.card.querySelector('#merlinGemstone polygon');
        if (gemstone) {
            gemstone.setAttribute('fill', color);
            gemstone.style.animation = 'gem-pulse 0.8s ease-out';
            setTimeout(() => gemstone.style.animation = '', 800);
        }

        this.card.style.setProperty('--gem-color', color);
        console.log(`[Merlin] Gemstone color: ${context || color}`);
    }

    /**
     * Animate wizard with optional pointing
     */
    animateWizard(options = {}) {
        const { pointTo, intensity = 2, color } = options;

        if (pointTo) {
            this.canvasState.gem.targetX = pointTo.x || 0.5;
            this.canvasState.gem.targetY = pointTo.y || 0.6;
        }

        // Pulse gemstone
        const gemEl = this.card.querySelector('#merlinGem');
        if (gemEl) {
            try {
                gemEl.animate([
                    { transform: 'translate(-50%,-50%) scale(1)' },
                    { transform: 'translate(-50%,-50%) scale(1.22)' },
                    { transform: 'translate(-50%,-50%) scale(1)' }
                ], {
                    duration: 900,
                    easing: 'cubic-bezier(.2,.8,.2,1)'
                });
            } catch (e) { }
        }

        // Create magic particles
        this.createMagicParticles(intensity * 6, color);

        console.log(`[Merlin] Wizard animated with intensity ${intensity}`);
    }

    /**
     * Create magic particle effects
     */
    createMagicParticles(count = 12, color = null) {
        const canvas = this.card.querySelector('#merlin3dCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width / devicePixelRatio;
        const h = canvas.height / devicePixelRatio;

        for (let i = 0; i < count; i++) {
            const ang = Math.random() * Math.PI * 2;
            const r = 8 + Math.random() * 36;
            const px = (this.canvasState.gem.targetX * w) + Math.cos(ang) * r;
            const py = (this.canvasState.gem.targetY * h) + Math.sin(ang) * r;

            if (color) {
                ctx.fillStyle = this.hexToRGBA(color, 0.9 + Math.random() * 0.1);
            } else {
                ctx.fillStyle = `rgba(255,${120 + Math.floor(Math.random() * 120)},${200 + Math.floor(Math.random() * 55)},0.9)`;
            }

            ctx.beginPath();
            ctx.arc(px, py, 1 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        console.log(`[Merlin] Created ${count} magic particles`);
    }

    // ============= HELPER METHODS =============

    formatXP(xp) {
        if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
        return xp.toString();
    }

    hexToRGBA(hex, alpha = 1) {
        if (!hex) return `rgba(255,255,255,${alpha})`;
        try {
            if (hex.startsWith('#')) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r},${g},${b},${alpha})`;
            }
            if (hex.startsWith('rgb')) {
                return hex.replace('rgb', 'rgba').replace(')', `,${alpha})`);
            }
        } catch (e) { }
        return `rgba(255,200,255,${alpha})`;
    }

    startDrag(e) {
        this.state.isDragging = true;
        const rect = this.card.getBoundingClientRect();
        this.state.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        const mouseMoveHandler = (e) => {
            if (!this.state.isDragging) return;
            this.state.position.x = e.clientX - this.state.dragOffset.x;
            this.state.position.y = e.clientY - this.state.dragOffset.y;
            this.updatePosition();
        };

        const mouseUpHandler = () => {
            this.state.isDragging = false;
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
        };

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
    }

    updatePosition() {
        this.card.style.position = 'fixed';
        this.card.style.left = `${this.state.position.x}px`;
        this.card.style.top = `${this.state.position.y}px`;
        this.card.style.zIndex = '10000';
    }

    minimize() {
        this.state.isMinimized = !this.state.isMinimized;
        if (this.state.isMinimized) {
            this.card.style.transform = 'scale(0.3)';
            this.card.style.opacity = '0.7';
        } else {
            this.card.style.transform = 'scale(1)';
            this.card.style.opacity = '1';
        }
    }

    flip() {
        this.state.isFlipped = !this.state.isFlipped;
        const container = this.card.querySelector('.card-container');
        if (container) {
            if (this.state.isFlipped) {
                container.classList.add('flipped');
            } else {
                container.classList.remove('flipped');
            }
        }
    }

    sendMessage() {
        const input = this.card.querySelector('#merlinInput');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        this.addMessage('user', message);
        input.value = '';

        // Analyze message and guide to control if relevant
        const wasGuided = this.analyzeAndGuide(message);

        if (!wasGuided) {
            // Standard response if no control was suggested
            setTimeout(() => {
                this.addMessage('merlin', 'I received your message: ' + message);
                this.animateWizard({ intensity: 2, color: '#3b82f6' });
            }, 500);
        }
    }

    addMessage(sender, text) {
        const messagesContainer = this.card.querySelector('#merlinMessages');
        if (!messagesContainer) return;

        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}-message`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    clearChat() {
        const messagesContainer = this.card.querySelector('#merlinMessages');
        if (messagesContainer) messagesContainer.innerHTML = '';
        this.state.messages = [];
    }

    /**
     * Guide user to specific control (flip card + highlight button)
     */
    guideToControl(actionId, advice) {
        // Flip to back to show controls
        if (!this.state.isFlipped) {
            this.flip();
        }

        // Update advice text
        const adviceText = this.card.querySelector('#adviceText');
        if (adviceText) {
            adviceText.textContent = advice || `Press the highlighted button to continue...`;
        }

        // Clear previous highlights
        const allBtns = this.card.querySelectorAll('.control-btn');
        allBtns.forEach(btn => btn.classList.remove('highlighted', 'pulsing'));

        // Highlight target button
        const targetBtn = this.card.querySelector(`#btn-${actionId}`);
        if (targetBtn) {
            targetBtn.classList.add('highlighted', 'pulsing');
            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Animate gemstone to point at the control
        this.updateGemstoneColor('question');
        this.animateWizard({ intensity: 2, color: '#f59e0b' });

        console.log(`[Merlin] Guiding to: ${actionId} - "${advice}"`);
    }

    /**
     * Analyze message context and auto-guide to relevant controls
     */
    analyzeAndGuide(userMessage) {
        const msg = userMessage.toLowerCase();
        
        // Farm keywords
        if (msg.includes('plant') || msg.includes('grow') || msg.includes('seed')) {
            this.guideToControl('plant', '🌱 Press "Plant Gems" to start growing your gem farm!');
            return true;
        }
        if (msg.includes('harvest') || msg.includes('collect') || msg.includes('pick')) {
            this.guideToControl('harvest', '💎 Press "Harvest" to collect your mature gems!');
            return true;
        }
        
        // Forge keywords
        if (msg.includes('craft') || msg.includes('make') || msg.includes('create')) {
            this.guideToControl('craft', '⚒️ Press "Craft Item" to forge something new!');
            return true;
        }
        if (msg.includes('repair') || msg.includes('fix') || msg.includes('broken')) {
            this.guideToControl('repair', '🔧 Press "Repair" to fix damaged items!');
            return true;
        }
        if (msg.includes('enhance') || msg.includes('upgrade') || msg.includes('improve')) {
            this.guideToControl('enhance', '✨ Press "Enhance" to power up your items!');
            return true;
        }
        
        // Machine keywords
        if (msg.includes('scan') || msg.includes('search') || msg.includes('find')) {
            this.guideToControl('scan', '🔍 Press "Scan Area" to discover nearby resources!');
            return true;
        }
        if (msg.includes('connect') || msg.includes('link') || msg.includes('pair')) {
            this.guideToControl('connect', '🔗 Press "Connect" to link your machine!');
            return true;
        }
        if (msg.includes('analyze') || msg.includes('check') || msg.includes('inspect')) {
            this.guideToControl('analyze', '📊 Press "Analyze" to examine the data!');
            return true;
        }
        
        // Trading keywords
        if (msg.includes('buy') || msg.includes('shop') || msg.includes('market')) {
            this.guideToControl('marketplace', '🛒 Press "Marketplace" to browse items!');
            return true;
        }
        if (msg.includes('trade') || msg.includes('sell') || msg.includes('exchange')) {
            this.guideToControl('trade', '💰 Press "Trade Gems" to exchange resources!');
            return true;
        }
        if (msg.includes('inventory') || msg.includes('items') || msg.includes('bag')) {
            this.guideToControl('inventory', '🎒 Press "Inventory" to view your items!');
            return true;
        }
        
        // Academy keywords
        if (msg.includes('learn') || msg.includes('teach') || msg.includes('skill')) {
            this.guideToControl('learn', '📖 Press "Learn Skill" to gain new abilities!');
            return true;
        }
        if (msg.includes('tutorial') || msg.includes('how to') || msg.includes('guide')) {
            this.guideToControl('tutorial', '🎓 Press "Tutorial" to learn the basics!');
            return true;
        }
        
        // Help keywords
        if (msg.includes('help') || msg.includes('stuck') || msg.includes('confused')) {
            this.guideToControl('help', '❓ Press "Help" for detailed assistance!');
            return true;
        }

        return false;
    }

    /**
     * Handle control button press
     */
    handleControlAction(action) {
        console.log(`[Merlin] Control action: ${action}`);
        
        // Remove highlight after press
        const allBtns = this.card.querySelectorAll('.control-btn');
        allBtns.forEach(btn => btn.classList.remove('highlighted', 'pulsing'));
        
        // Flip back to chat
        setTimeout(() => {
            if (this.state.isFlipped) {
                this.flip();
            }
            this.addMessage('merlin', `Executing ${action}... ✨`);
            this.updateGemstoneColor('success');
            this.animateWizard({ intensity: 2, color: '#10b981' });
        }, 300);

        // Trigger event for main system to handle
        window.dispatchEvent(new CustomEvent('merlinControlAction', {
            detail: { action, timestamp: Date.now() }
        }));
    }
}

// Auto-initialize
let MerlinCardIntegrated;
window.addEventListener('load', () => {
    MerlinCardIntegrated = new MerlinAICardIntegrated();
    window.MerlinCardIntegrated = MerlinCardIntegrated;
    console.log('[Merlin Integrated] 3D Card initialized with reference design');
});
