/**
 * GemBot Quantum Gem Visualizer
 * Integrates 3D quantum neural network visuals and pulse shaders
 * for stunning gemstone rendering and room effects
 * 
 * Based on:
 * - 3D Quantum Neural Network (VoXelo CodePen)
 * - Pulse Shader 2 (VaaLaa CodePen)
 */

window.QuantumGemVisualizer = {
    version: '1.0.0',
    initialized: false,
    canvas: null,
    gl: null,
    animationId: null,
    
    // Color themes for different gem types
    gemThemes: {
        sapphire: {
            primary: [0.2, 0.4, 1.0],
            secondary: [0.0, 0.8, 1.0],
            glow: [0.4, 0.6, 1.0]
        },
        ruby: {
            primary: [1.0, 0.1, 0.2],
            secondary: [1.0, 0.4, 0.5],
            glow: [1.0, 0.2, 0.3]
        },
        emerald: {
            primary: [0.0, 0.8, 0.3],
            secondary: [0.2, 1.0, 0.5],
            glow: [0.1, 0.9, 0.4]
        },
        diamond: {
            primary: [0.9, 0.95, 1.0],
            secondary: [1.0, 1.0, 1.0],
            glow: [0.8, 0.9, 1.0]
        },
        amethyst: {
            primary: [0.6, 0.2, 0.8],
            secondary: [0.8, 0.4, 1.0],
            glow: [0.7, 0.3, 0.9]
        },
        topaz: {
            primary: [1.0, 0.6, 0.2],
            secondary: [1.0, 0.8, 0.4],
            glow: [1.0, 0.7, 0.3]
        },
        alexandrite: {
            primary: [0.4, 0.7, 0.5],
            secondary: [0.6, 0.3, 0.7],
            glow: [0.5, 0.5, 0.6]
        },
        opal: {
            primary: [0.9, 0.9, 0.95],
            secondary: [0.8, 0.6, 1.0],
            glow: [1.0, 0.7, 0.8]
        }
    },
    
    // ==================== INITIALIZATION ====================
    init(containerId = 'quantum-gem-canvas') {
        console.log('⚛️ Initializing Quantum Gem Visualizer...');
        
        // Create or get canvas
        this.canvas = document.getElementById(containerId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = containerId;
            this.canvas.className = 'quantum-gem-canvas';
        }
        
        // Get WebGL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('⚠️ WebGL not available for quantum effects');
            return this;
        }
        
        this.initialized = true;
        console.log('✅ Quantum Gem Visualizer ready!');
        
        return this;
    },
    
    // ==================== SHADER SOURCE CODE ====================
    // Vertex shader for fullscreen quad
    vertexShaderSource: `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `,
    
    // Fragment shader for gem pulse effect
    pulseFragmentShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec3 u_primary;
        uniform vec3 u_secondary;
        uniform vec3 u_glow;
        
        vec3 palette(float t) {
            vec3 a = u_primary;
            vec3 b = u_secondary;
            vec3 c = vec3(1.0);
            vec3 d = u_glow;
            return a + b * cos(6.28318 * (c * t + d));
        }
        
        void main() {
            vec2 st = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0;
            st.x *= u_resolution.x / u_resolution.y;
            vec3 finalColor = vec3(0.0);
            
            for (float i = 2.0; i < 4.0; i++) {
                float d = length(st);
                d = sin(sin(-d + u_time * 0.5) / 100.0);
                d *= cos(st.x * 8.0) + cos(st.y * 16.0) * sin(st.y * d + u_time * 0.5);
                d *= cos(st.y * 8.0) + cos(st.x * 16.0) * sin(st.x * d + u_time * 0.5);
                d = abs(d);
                vec3 col = palette(d);
                d = pow(0.0002 / d, 0.5);
                finalColor += col * d;
            }
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
    
    // Fragment shader for quantum neural network effect
    neuralFragmentShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        void main() {
            vec2 st = gl_FragCoord.xy / u_resolution;
            st.x *= u_resolution.x / u_resolution.y;
            
            vec3 color = vec3(0.0);
            
            // Create neural network-like pattern
            float n = 0.0;
            for (float i = 1.0; i < 8.0; i++) {
                n += noise(st * i * 3.0 + u_time * 0.1 * i);
            }
            n /= 8.0;
            
            // Add pulsing nodes
            float nodes = 0.0;
            for (float i = 0.0; i < 5.0; i++) {
                vec2 nodePos = vec2(
                    sin(u_time * 0.3 + i * 1.5) * 0.3 + 0.5,
                    cos(u_time * 0.2 + i * 1.2) * 0.3 + 0.5
                );
                float dist = distance(st, nodePos);
                nodes += 0.01 / dist;
            }
            
            // Combine effects
            color = mix(u_color1, u_color2, n);
            color += nodes * u_color2 * 0.3;
            
            // Add glow
            float glow = sin(u_time) * 0.1 + 0.9;
            color *= glow;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    
    // Crystalline gemstone shader
    crystalFragmentShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec3 u_gemColor;
        uniform float u_refractiveIndex;
        
        #define PI 3.14159265359
        
        float polygon(vec2 st, int sides, float size) {
            float a = atan(st.x, st.y) + PI;
            float r = 2.0 * PI / float(sides);
            return cos(floor(0.5 + a / r) * r - a) * length(st) - size;
        }
        
        void main() {
            vec2 st = gl_FragCoord.xy / u_resolution;
            st = st * 2.0 - 1.0;
            st.x *= u_resolution.x / u_resolution.y;
            
            vec3 color = vec3(0.0);
            
            // Create rotating facets
            float angle = u_time * 0.2;
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            vec2 rotSt = rot * st;
            
            // Draw multiple facet layers
            for (float i = 1.0; i < 6.0; i++) {
                float facet = polygon(rotSt, int(6.0 + i), 0.1 * i);
                facet = 1.0 - smoothstep(0.0, 0.02, facet);
                
                // Simulate light refraction
                float refract = sin(facet * u_refractiveIndex * 10.0 + u_time);
                vec3 facetColor = u_gemColor * (0.5 + 0.5 * refract);
                
                color = mix(color, facetColor, facet * 0.3);
            }
            
            // Add sparkle
            float sparkle = sin(st.x * 50.0 + u_time * 5.0) * sin(st.y * 50.0 + u_time * 3.0);
            sparkle = pow(max(0.0, sparkle), 8.0);
            color += vec3(1.0) * sparkle * 0.3;
            
            // Add center brilliance
            float center = 1.0 - length(st) * 0.5;
            center = pow(max(0.0, center), 2.0);
            color += u_gemColor * center * 0.5;
            
            // Add edge glow
            float edge = smoothstep(0.8, 1.0, length(st));
            color = mix(color, u_gemColor * 1.5, edge * 0.3);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    
    // ==================== SHADER COMPILATION ====================
    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    },
    
    createProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) return null;
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    },
    
    // ==================== VISUALIZATION METHODS ====================
    
    // Render a pulsing gem effect
    renderPulseGem(gemType = 'sapphire', containerId = null) {
        if (!this.initialized) this.init();
        
        const gl = this.gl;
        const canvas = containerId ? document.getElementById(containerId) : this.canvas;
        if (!canvas) return;
        
        // Resize canvas
        canvas.width = canvas.offsetWidth || 400;
        canvas.height = canvas.offsetHeight || 400;
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        // Create program
        const program = this.createProgram(this.vertexShaderSource, this.pulseFragmentShader);
        if (!program) return;
        
        // Set up geometry
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        gl.useProgram(program);
        
        // Get uniform locations
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const primaryLocation = gl.getUniformLocation(program, 'u_primary');
        const secondaryLocation = gl.getUniformLocation(program, 'u_secondary');
        const glowLocation = gl.getUniformLocation(program, 'u_glow');
        
        // Get gem colors
        const theme = this.gemThemes[gemType] || this.gemThemes.sapphire;
        
        // Animation loop
        const startTime = Date.now();
        const render = () => {
            const time = (Date.now() - startTime) * 0.001;
            
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, time);
            gl.uniform3fv(primaryLocation, theme.primary);
            gl.uniform3fv(secondaryLocation, theme.secondary);
            gl.uniform3fv(glowLocation, theme.glow);
            
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            this.animationId = requestAnimationFrame(render);
        };
        
        render();
    },
    
    // Render neural network effect for quantum chamber
    renderNeuralNetwork(containerId = null) {
        if (!this.initialized) this.init();
        
        const gl = this.gl;
        const canvas = containerId ? document.getElementById(containerId) : this.canvas;
        if (!canvas) return;
        
        canvas.width = canvas.offsetWidth || 400;
        canvas.height = canvas.offsetHeight || 400;
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        const program = this.createProgram(this.vertexShaderSource, this.neuralFragmentShader);
        if (!program) return;
        
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        gl.useProgram(program);
        
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const color1Location = gl.getUniformLocation(program, 'u_color1');
        const color2Location = gl.getUniformLocation(program, 'u_color2');
        
        const startTime = Date.now();
        const render = () => {
            const time = (Date.now() - startTime) * 0.001;
            
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, time);
            gl.uniform3f(color1Location, 0.1, 0.0, 0.2);
            gl.uniform3f(color2Location, 0.5, 0.2, 0.8);
            
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            this.animationId = requestAnimationFrame(render);
        };
        
        render();
    },
    
    // Render crystalline gem with refraction
    renderCrystalGem(gemType = 'diamond', refractiveIndex = 2.42, containerId = null) {
        if (!this.initialized) this.init();
        
        const gl = this.gl;
        const canvas = containerId ? document.getElementById(containerId) : this.canvas;
        if (!canvas) return;
        
        canvas.width = canvas.offsetWidth || 400;
        canvas.height = canvas.offsetHeight || 400;
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        const program = this.createProgram(this.vertexShaderSource, this.crystalFragmentShader);
        if (!program) return;
        
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        gl.useProgram(program);
        
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const gemColorLocation = gl.getUniformLocation(program, 'u_gemColor');
        const riLocation = gl.getUniformLocation(program, 'u_refractiveIndex');
        
        const theme = this.gemThemes[gemType] || this.gemThemes.diamond;
        
        const startTime = Date.now();
        const render = () => {
            const time = (Date.now() - startTime) * 0.001;
            
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, time);
            gl.uniform3fv(gemColorLocation, theme.primary);
            gl.uniform1f(riLocation, refractiveIndex);
            
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            this.animationId = requestAnimationFrame(render);
        };
        
        render();
    },
    
    // Stop current animation
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    // Create a gem preview element
    createGemPreview(gemType, size = 100) {
        const container = document.createElement('div');
        container.className = 'quantum-gem-preview';
        container.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
        `;
        
        const canvas = document.createElement('canvas');
        canvas.id = `gem-preview-${Date.now()}`;
        canvas.width = size;
        canvas.height = size;
        canvas.style.cssText = `width: 100%; height: 100%;`;
        
        container.appendChild(canvas);
        
        // Start rendering after append
        setTimeout(() => {
            this.renderCrystalGem(gemType, 2.0, canvas.id);
        }, 0);
        
        return container;
    },
    
    // Get refractive index for gem type
    getRefractiveIndex(gemType) {
        const indices = {
            diamond: 2.42,
            sapphire: 1.77,
            ruby: 1.77,
            emerald: 1.58,
            amethyst: 1.55,
            topaz: 1.63,
            alexandrite: 1.75,
            opal: 1.45,
            zircon: 1.95,
            spinel: 1.72
        };
        return indices[gemType] || 1.60;
    }
};

// CSS for quantum gem elements
const quantumGemStyles = document.createElement('style');
quantumGemStyles.textContent = `
    .quantum-gem-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    
    .quantum-gem-preview {
        display: inline-block;
        box-shadow: 0 0 30px rgba(136, 0, 255, 0.5);
        animation: quantumPulse 3s ease-in-out infinite;
    }
    
    @keyframes quantumPulse {
        0%, 100% { box-shadow: 0 0 30px rgba(136, 0, 255, 0.5); }
        50% { box-shadow: 0 0 50px rgba(136, 0, 255, 0.8); }
    }
    
    .quantum-gem-showcase {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
        padding: 20px;
    }
    
    .quantum-gem-showcase .gem-item {
        text-align: center;
    }
    
    .quantum-gem-showcase .gem-label {
        margin-top: 10px;
        color: #fff;
        font-size: 12px;
        text-shadow: 0 0 10px rgba(136, 0, 255, 0.8);
    }
`;
document.head.appendChild(quantumGemStyles);

console.log('📦 Quantum Gem Visualizer loaded');
