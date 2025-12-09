/**
 * GemBot Rotating Cube UI Controller
 * Futuristic 3D interface with 6 faces (pages)
 * Touch/Mouse swipe to rotate between faces
 */

class RotatingCubeUI {
    constructor() {
        this.currentFace = 0; // 0-5 faces
        this.isRotating = false;
        this.rotationDuration = 600; // ms
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.faces = [
            { name: 'dashboard', title: '📊 Dashboard', icon: '📈' },
            { name: 'virtual-machine', title: '🤖 Virtual Machine', icon: '⚙️' },
            { name: 'learning', title: '📚 Learning', icon: '🎓' },
            { name: 'controls', title: '🎮 Controls', icon: '🕹️' },
            { name: 'stats', title: '🏆 Stats', icon: '⭐' },
            { name: 'settings', title: '⚙️ Settings', icon: '🔧' }
        ];
    }

    init() {
        this.setupCubeHTML();
        this.setupEventListeners();
        this.setupKeyboardControls();
        console.log('✅ Rotating Cube UI initialized');
    }

    setupCubeHTML() {
        const container = document.getElementById('cube-container');
        if (!container) return;

        let cubeHTML = `
            <div class="cube" id="mainCube">
        `;

        // Create 6 faces
        this.faces.forEach((face, index) => {
            const faceHTML = this.createFaceHTML(face, index);
            cubeHTML += `<div class="cube-face face-${index}" data-face="${index}">
                ${faceHTML}
            </div>`;
        });

        cubeHTML += `</div>`;

        // Add controls
        cubeHTML += `
            <div class="cube-controls">
                <button class="cube-nav-btn" id="cubePrev" title="Previous (← or Swipe)">◀</button>
                <div class="cube-indicator" id="cubeIndicator">
                    <span class="indicator-dot" id="indicator-0"></span>
                    <span class="indicator-dot" id="indicator-1"></span>
                    <span class="indicator-dot" id="indicator-2"></span>
                    <span class="indicator-dot" id="indicator-3"></span>
                    <span class="indicator-dot" id="indicator-4"></span>
                    <span class="indicator-dot" id="indicator-5"></span>
                </div>
                <button class="cube-nav-btn" id="cubeNext" title="Next (→ or Swipe)">▶</button>
            </div>
            <div class="cube-title" id="cubeTitle">${this.faces[0].title}</div>
        `;

        container.innerHTML = cubeHTML;
        this.updateIndicators();
    }

    createFaceHTML(face, index) {
        switch (face.name) {
            case 'dashboard':
                return `
                    <div class="face-content">
                        <div class="face-header">${face.icon} ${face.title}</div>
                        <div class="face-body">
                            <div class="stat-box">
                                <div class="stat-label">Session Time</div>
                                <div class="stat-value" id="sessionTime">0h 0m</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Mode</div>
                                <div class="stat-value" id="currentMode">Virtual</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Connection</div>
                                <div class="stat-value" id="connectionStatus">Ready</div>
                            </div>
                        </div>
                    </div>
                `;
            case 'virtual-machine':
                return `
                    <div class="face-content">
                        <div class="face-header">${face.icon} ${face.title}</div>
                        <div class="face-body">
                            <div id="babylon-canvas-mini" style="width: 100%; height: 200px; background: #0a0e27; border-radius: 8px; margin-bottom: 12px;"></div>
                            <div class="motor-display">
                                <div class="motor-axis">
                                    <span>X:</span>
                                    <span id="motorXPos" style="color: #4affff;">0</span>
                                </div>
                                <div class="motor-axis">
                                    <span>Y:</span>
                                    <span id="motorYPos" style="color: #4affff;">0</span>
                                </div>
                                <div class="motor-axis">
                                    <span>P:</span>
                                    <span id="motorPPos" style="color: #4affff;">0°</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 'learning':
                return `
                    <div class="face-content">
                        <div class="face-header">${face.icon} ${face.title}</div>
                        <div class="face-body">
                            <div class="lesson-box">
                                <div class="lesson-title" id="lessonTitle">Welcome to GemBot</div>
                                <div class="lesson-content" id="lessonContent">
                                    Tap to start learning...
                                </div>
                            </div>
                            <button class="face-btn" id="startLessonBtn">📖 Start Lesson</button>
                        </div>
                    </div>
                `;
            case 'controls':
                return `
                    <div class="face-content">
                        <div class="face-header">${face.icon} ${face.title}</div>
                        <div class="face-body">
                            <div class="joystick-grid">
                                <button class="joystick-btn" id="btnUp">⬆️</button>
                                <button class="joystick-btn" id="btnDown">⬇️</button>
                                <button class="joystick-btn" id="btnLeft">⬅️</button>
                                <button class="joystick-btn" id="btnRight">➡️</button>
                                <button class="joystick-btn" id="btnRotate">🔄</button>
                                <button class="joystick-btn" id="btnHome">🏠</button>
                            </div>
                            <button class="face-btn emergency-btn">🛑 E-Stop</button>
                        </div>
                    </div>
                `;
            case 'stats':
                return `
                    <div class="face-content">
                        <div class="face-header">${face.icon} ${face.title}</div>
                        <div class="face-body">
                            <div class="stats-container">
                                <div class="stat-item">
                                    <div class="stat-icon">🎮</div>
                                    <div class="stat-name">Playtime</div>
                                    <div class="stat-number" id="statPlaytime">24h</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">💎</div>
                                    <div class="stat-name">Stones Cut</div>
                                    <div class="stat-number" id="statStones">12</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">⭐</div>
                                    <div class="stat-name">Skill Level</div>
                                    <div class="stat-number" id="statLevel">5</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 'settings':
                return `
                    <div class="face-content">
                        <div class="face-header">${face.icon} ${face.title}</div>
                        <div class="face-body">
                            <div class="setting-item">
                                <label>Volume</label>
                                <input type="range" min="0" max="100" value="80" class="setting-slider">
                            </div>
                            <div class="setting-item">
                                <label>Brightness</label>
                                <input type="range" min="0" max="100" value="100" class="setting-slider">
                            </div>
                            <button class="face-btn" id="logoutBtn">🚪 Logout</button>
                        </div>
                    </div>
                `;
            default:
                return '<div class="face-content">Unknown Face</div>';
        }
    }

    setupEventListeners() {
        const cube = document.getElementById('mainCube');
        const prevBtn = document.getElementById('cubePrev');
        const nextBtn = document.getElementById('cubeNext');

        // Button controls
        if (prevBtn) prevBtn.addEventListener('click', () => this.rotateCube(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.rotateCube(1));

        // Touch swipe
        if (cube) {
            cube.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
            cube.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
            cube.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
        }

        // Mouse drag
        if (cube) {
            cube.addEventListener('mousedown', (e) => this.handleTouchStart(e), false);
            cube.addEventListener('mousemove', (e) => this.handleTouchMove(e), false);
            cube.addEventListener('mouseup', (e) => this.handleTouchEnd(e), false);
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.rotateCube(-1);
            if (e.key === 'ArrowRight') this.rotateCube(1);
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches ? e.touches[0].clientX : e.clientX;
        this.touchStartY = e.touches ? e.touches[0].clientY : e.clientY;
    }

    handleTouchMove(e) {
        // Optional: show visual feedback
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const touchEndY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

        const diffX = this.touchStartX - touchEndX;
        const diffY = this.touchStartY - touchEndY;

        // Horizontal swipe > 50px
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            this.rotateCube(diffX > 0 ? 1 : -1);
        }
    }

    rotateCube(direction) {
        if (this.isRotating) return;

        this.isRotating = true;
        this.currentFace = (this.currentFace + direction + 6) % 6;

        const cube = document.getElementById('mainCube');
        const angle = this.currentFace * 60;

        cube.style.transform = `rotateY(${angle}deg)`;

        setTimeout(() => {
            this.isRotating = false;
            this.updateTitle();
            this.updateIndicators();
        }, this.rotationDuration);
    }

    updateTitle() {
        const title = document.getElementById('cubeTitle');
        if (title) {
            title.textContent = this.faces[this.currentFace].title;
        }
    }

    updateIndicators() {
        for (let i = 0; i < 6; i++) {
            const indicator = document.getElementById(`indicator-${i}`);
            if (indicator) {
                indicator.classList.toggle('active', i === this.currentFace);
            }
        }
    }

    getCurrentFace() {
        return this.faces[this.currentFace];
    }

    updateMotorDisplay(x, y, p) {
        const xEl = document.getElementById('motorXPos');
        const yEl = document.getElementById('motorYPos');
        const pEl = document.getElementById('motorPPos');

        if (xEl) xEl.textContent = Math.round(x);
        if (yEl) yEl.textContent = Math.round(y);
        if (pEl) pEl.textContent = Math.round(p) + '°';
    }

    updateStats(playtime, stones, level) {
        const ptEl = document.getElementById('statPlaytime');
        const stEl = document.getElementById('statStones');
        const lvEl = document.getElementById('statLevel');

        if (ptEl) ptEl.textContent = playtime;
        if (stEl) stEl.textContent = stones;
        if (lvEl) lvEl.textContent = level;
    }
}

// Export
window.RotatingCubeUI = RotatingCubeUI;
