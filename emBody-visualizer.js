/**
 * emBody Visualization Engine
 * High-performance WebGL-based particle system for visualizing 30 trillion cells
 * Optimized for real-time simulation and interaction
 */

class CellVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualization-canvas');
        this.gl = null;
        this.program = null;
        this.particleCount = 100000; // Rendered particles representing 30 trillion
        this.particles = [];
        this.animationId = null;
        this.isAnimating = true;
        this.view3D = false;
        this.zoom = 1.0;
        this.rotation = 0;
        this.currentCancerType = 'overview';
        
        // Camera controls
        this.camera = {
            x: 0,
            y: 0,
            z: 5,
            rotX: 0,
            rotY: 0
        };
        
        // Mouse interaction
        this.mouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Simulation parameters
        this.simulationSpeed = 1.0;
        this.cellDensity = 0.5;
        this.cancerProgression = 0;
        
        this.init();
    }

    async init() {
        console.log('🧬 Initializing emBody Visualization Engine...');
        
        // Setup WebGL
        this.setupWebGL();
        
        if (!this.gl) {
            console.warn('WebGL not available, using fallback 2D canvas');
            this.setupCanvas2D();
        } else {
            this.setupShaders();
            this.createParticles();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Hide loading screen
        document.getElementById('loading').classList.add('hidden');
        
        // Start animation
        this.animate();
        
        console.log('✅ emBody Visualization Engine ready!');
    }

    setupWebGL() {
        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            
            if (this.gl) {
                console.log('✅ WebGL initialized successfully');
                this.resizeCanvas();
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
                this.gl.clearColor(0.05, 0.05, 0.12, 1.0);
                this.gl.enable(this.gl.BLEND);
                this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            }
        } catch (e) {
            console.error('WebGL initialization failed:', e);
        }
    }

    setupCanvas2D() {
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        console.log('✅ 2D Canvas fallback initialized');
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    setupShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec4 a_color;
            attribute float a_size;
            
            uniform vec2 u_resolution;
            uniform float u_zoom;
            uniform vec2 u_offset;
            uniform mat4 u_matrix;
            
            varying vec4 v_color;
            
            void main() {
                vec2 position = (a_position + u_offset) * u_zoom;
                vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
                gl_Position = u_matrix * vec4(clipSpace * vec2(1, -1), 0, 1);
                gl_PointSize = a_size * u_zoom;
                v_color = a_color;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard;
                
                float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
            }
        `;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Shader program failed to link:', this.gl.getProgramInfoLog(this.program));
            return;
        }

        this.gl.useProgram(this.program);
        
        // Get attribute and uniform locations
        this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
        this.sizeLocation = this.gl.getAttribLocation(this.program, 'a_size');
        this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.zoomLocation = this.gl.getUniformLocation(this.program, 'u_zoom');
        this.offsetLocation = this.gl.getUniformLocation(this.program, 'u_offset');
        this.matrixLocation = this.gl.getUniformLocation(this.program, 'u_matrix');
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createParticles() {
        console.log(`Creating ${this.particleCount} particles...`);
        
        this.particles = [];
        const positions = [];
        const colors = [];
        const sizes = [];

        const width = this.canvas.width;
        const height = this.canvas.height;

        for (let i = 0; i < this.particleCount; i++) {
            // Position - distributed across canvas
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * Math.min(width, height) * 0.4;
            const x = Math.cos(angle) * radius + width / 2;
            const y = Math.sin(angle) * radius + height / 2;
            
            // Determine cell type (healthy, cancer, pre-cancerous, immune)
            const rand = Math.random();
            let cellType;
            
            if (rand < this.cancerProgression / 100) {
                cellType = 'cancer'; // Red
            } else if (rand < this.cancerProgression / 100 + 0.05) {
                cellType = 'precancer'; // Orange
            } else if (rand < this.cancerProgression / 100 + 0.1) {
                cellType = 'immune'; // Green
            } else {
                cellType = 'healthy'; // Blue
            }

            const color = this.getCellColor(cellType);
            
            this.particles.push({
                x: x,
                y: y,
                z: (Math.random() - 0.5) * 200,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.5,
                type: cellType,
                size: 2 + Math.random() * 2
            });

            positions.push(x, y);
            colors.push(color.r, color.g, color.b, color.a);
            sizes.push(2 + Math.random() * 2);
        }

        // Create buffers
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.DYNAMIC_DRAW);

        this.sizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sizes), this.gl.STATIC_DRAW);

        console.log('✅ Particles created successfully');
    }

    getCellColor(type) {
        const colors = {
            healthy: { r: 0.29, g: 0.62, b: 1.0, a: 0.8 },    // Blue
            cancer: { r: 1.0, g: 0.28, b: 0.34, a: 0.9 },     // Red
            precancer: { r: 1.0, g: 0.65, b: 0.01, a: 0.85 }, // Orange
            immune: { r: 0.15, g: 0.87, b: 0.51, a: 0.8 }     // Green
        };
        return colors[type] || colors.healthy;
    }

    updateParticles() {
        if (!this.isAnimating) return;

        const positions = [];
        const colors = [];
        const width = this.canvas.width;
        const height = this.canvas.height;
        const speed = this.simulationSpeed;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx * speed;
            p.y += p.vy * speed;
            p.z += p.vz * speed;

            // Wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            if (p.z < -100) p.z = 100;
            if (p.z > 100) p.z = -100;

            // Cancer cell spreading simulation
            if (p.type === 'cancer' && Math.random() < 0.0001 * this.cancerProgression) {
                // Find nearby healthy cell and convert it
                for (let j = 0; j < 5; j++) {
                    const idx = Math.floor(Math.random() * this.particles.length);
                    const other = this.particles[idx];
                    const dx = p.x - other.x;
                    const dy = p.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 50 && other.type === 'healthy') {
                        other.type = 'precancer';
                        if (Math.random() < 0.3) {
                            other.type = 'cancer';
                        }
                        break;
                    }
                }
            }

            // Update color based on type
            const color = this.getCellColor(p.type);
            
            positions.push(p.x, p.y);
            colors.push(color.r, color.g, color.b, color.a);
        }

        // Update buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.DYNAMIC_DRAW);
    }

    render() {
        if (!this.gl) {
            this.render2D();
            return;
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Update uniforms
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.zoomLocation, this.zoom);
        this.gl.uniform2f(this.offsetLocation, this.camera.x, this.camera.y);

        // Create transformation matrix
        const matrix = this.create3DMatrix();
        this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Bind color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.enableVertexAttribArray(this.colorLocation);
        this.gl.vertexAttribPointer(this.colorLocation, 4, this.gl.FLOAT, false, 0, 0);

        // Bind size buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.enableVertexAttribArray(this.sizeLocation);
        this.gl.vertexAttribPointer(this.sizeLocation, 1, this.gl.FLOAT, false, 0, 0);

        // Draw particles
        this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
    }

    render2D() {
        if (!this.ctx) return;

        this.ctx.fillStyle = 'rgba(12, 12, 30, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this.canvas.width / 2 + this.camera.x, -this.canvas.height / 2 + this.camera.y);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const color = this.getCellColor(p.type);
            
            this.ctx.fillStyle = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    create3DMatrix() {
        const matrix = new Float32Array(16);
        
        if (!this.view3D) {
            // Identity matrix for 2D view
            matrix[0] = 1; matrix[5] = 1; matrix[10] = 1; matrix[15] = 1;
        } else {
            // Simple rotation matrix for 3D view
            const c = Math.cos(this.rotation);
            const s = Math.sin(this.rotation);
            matrix[0] = c; matrix[1] = s; matrix[4] = -s; matrix[5] = c;
            matrix[10] = 1; matrix[15] = 1;
        }
        
        return matrix;
    }

    animate() {
        this.updateParticles();
        this.render();
        
        if (this.view3D) {
            this.rotation += 0.002 * this.simulationSpeed;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());

        // Mouse controls for panning
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.mouseDown) return;
            
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;
            
            this.camera.x += dx;
            this.camera.y += dy;
            
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom *= delta;
            this.zoom = Math.max(0.1, Math.min(5, this.zoom));
        });

        // Slider controls
        document.getElementById('cell-density').addEventListener('input', (e) => {
            this.cellDensity = e.target.value / 100;
            document.getElementById('density-value').textContent = e.target.value + '%';
            this.updateParticleCount();
        });

        document.getElementById('simulation-speed').addEventListener('input', (e) => {
            this.simulationSpeed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value + 'x';
        });

        document.getElementById('cancer-progression').addEventListener('input', (e) => {
            this.cancerProgression = parseFloat(e.target.value);
            document.getElementById('progression-value').textContent = e.target.value + '%';
            this.createParticles(); // Recreate with new progression
        });
    }

    updateParticleCount() {
        const baseCount = 100000;
        this.particleCount = Math.floor(baseCount * this.cellDensity);
        this.createParticles();
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
    }

    toggleView() {
        this.view3D = !this.view3D;
    }

    zoomIn() {
        this.zoom *= 1.2;
        this.zoom = Math.min(5, this.zoom);
    }

    zoomOut() {
        this.zoom *= 0.8;
        this.zoom = Math.max(0.1, this.zoom);
    }

    reset() {
        this.zoom = 1.0;
        this.camera.x = 0;
        this.camera.y = 0;
        this.rotation = 0;
        this.cancerProgression = 0;
        document.getElementById('cancer-progression').value = 0;
        document.getElementById('progression-value').textContent = '0%';
        this.createParticles();
    }

    exportImage() {
        const link = document.createElement('a');
        link.download = `emBody-${this.currentCancerType}-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        console.log('📷 Screenshot saved!');
    }

    loadCancerType(type) {
        this.currentCancerType = type;
        const data = CancerData.getCancerType(type);
        
        // Update stats
        document.getElementById('total-cells').textContent = '30T';
        document.getElementById('cancer-cells').textContent = this.formatNumber(CancerData.calculateCancerCells(type));
        document.getElementById('annual-cases').textContent = data.annualCases;
        document.getElementById('survival-rate').textContent = data.survivalRate;
        
        // Update educational info
        this.updateEducationalInfo(data);
        
        // Update progression
        this.cancerProgression = data.cellPercentage * 1000; // Scale for visibility
        document.getElementById('cancer-progression').value = this.cancerProgression;
        document.getElementById('progression-value').textContent = this.cancerProgression.toFixed(1) + '%';
        
        // Recreate particles
        this.createParticles();
        
        console.log(`📊 Loaded cancer type: ${data.name}`);
    }

    updateEducationalInfo(data) {
        const infoDiv = document.getElementById('educational-info');
        
        let html = `
            <h3>${data.name}</h3>
            <p>${data.description}</p>
            
            <h3>Key Characteristics</h3>
            <ul>
                ${data.characteristics.map(c => `<li>${c}</li>`).join('')}
            </ul>
            
            <h3>Treatment Options</h3>
            <ul>
                ${data.treatmentOptions.map(t => `<li>${t}</li>`).join('')}
            </ul>
        `;
        
        if (data.riskFactors) {
            html += `
                <h3>Risk Factors</h3>
                <ul>
                    ${data.riskFactors.map(r => `<li>${r}</li>`).join('')}
                </ul>
            `;
        }
        
        if (data.researchLinks) {
            html += `<h3>Learn More</h3>`;
            data.researchLinks.forEach(link => {
                html += `<a href="${link.url}" target="_blank" class="link-button">${link.text}</a>`;
            });
        }
        
        infoDiv.innerHTML = html;
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toString();
    }
}

// Global functions for UI buttons
let visualizer;

function loadCancerType() {
    const select = document.getElementById('cancer-type');
    visualizer.loadCancerType(select.value);
}

function toggleAnimation() {
    visualizer.toggleAnimation();
}

function resetVisualization() {
    visualizer.reset();
}

function zoomIn() {
    visualizer.zoomIn();
}

function zoomOut() {
    visualizer.zoomOut();
}

function toggleView() {
    visualizer.toggleView();
}

function exportImage() {
    visualizer.exportImage();
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    visualizer = new CellVisualizer();
});
