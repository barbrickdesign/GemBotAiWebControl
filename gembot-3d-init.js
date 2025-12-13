/**
 * GemBot 3D Visualizer Initialization
 * Integrates with GemBot_Control_AI.html
 */

let gembot3DVisualizer = null;
let machineState = null;

// Initialize 3D visualization when page is ready
function initializeGemBot3DVisualizer() {
    console.log('🎨 Initializing GemBot 3D Visualizer...');
    
    // Try to find container (machineViewContainer is primary, canvas3D is fallback)
    let container3D = document.getElementById('machineViewContainer');
    if (!container3D) {
        container3D = document.getElementById('canvas3D');
    }
    
    if (!container3D) {
        console.warn('⚠️ 3D Canvas container not found. Creating...');
        const workspacePanel = document.querySelector('.workspace-main');
        if (workspacePanel) {
            const canvas3DDiv = document.createElement('div');
            canvas3DDiv.id = 'canvas3D';
            canvas3DDiv.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%);
                border-radius: 12px;
                overflow: hidden;
                position: relative;
            `;
            workspacePanel.appendChild(canvas3DDiv);
            container3D = canvas3DDiv;
            console.log('✅ 3D Canvas container created');
        }
    }
    
    // Initialize visualizer
    try {
        if (typeof BABYLON === 'undefined') {
            console.error('❌ Babylon.js not loaded. Retrying in 1s...');
            setTimeout(initializeGemBot3DVisualizer, 1000);
            return;
        }
        
        // Use correct container ID
        const containerId = container3D.id || 'machineViewContainer';
        gembot3DVisualizer = new GemBot3DVisualizer(containerId);
        machineState = gembot3DVisualizer.machine;
        
        console.log('✅ GemBot 3D Visualizer initialized successfully');
        
        // Link to control panel
        linkControlsTo3DVisualizer();
        
    } catch (error) {
        console.error('❌ Error initializing 3D Visualizer:', error);
    }
}

/**
 * Links control panel inputs to 3D machine visualization
 */
function linkControlsTo3DVisualizer() {
    console.log('🔗 Linking control panel to 3D visualizer...');
    
    // X-Axis Control
    const xControlElements = document.querySelectorAll('[data-control="x-axis"]');
    xControlElements.forEach(el => {
        el.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (gembot3DVisualizer) {
                gembot3DVisualizer.setXAxis(value);
            }
        });
    });
    
    // Y-Axis Control
    const yControlElements = document.querySelectorAll('[data-control="y-axis"]');
    yControlElements.forEach(el => {
        el.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (gembot3DVisualizer) {
                gembot3DVisualizer.setYAxis(value);
            }
        });
    });
    
    // Index Control
    const indexElements = document.querySelectorAll('[data-control="index"]');
    indexElements.forEach(el => {
        el.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (gembot3DVisualizer) {
                gembot3DVisualizer.setIndex(value);
            }
        });
    });
    
    // Angle Control
    const angleElements = document.querySelectorAll('[data-control="angle"]');
    angleElements.forEach(el => {
        el.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (gembot3DVisualizer) {
                gembot3DVisualizer.setAngle(value);
            }
        });
    });
    
    // Spindle Speed Control
    const spindleElements = document.querySelectorAll('[data-control="spindle"]');
    spindleElements.forEach(el => {
        el.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (gembot3DVisualizer) {
                gembot3DVisualizer.setSpindle(value);
            }
        });
    });
    
    console.log('✅ Controls linked to 3D visualizer');
}

/**
 * Updates 3D machine state from external data
 */
function updateMachineFromData(data) {
    if (!gembot3DVisualizer) return;
    
    if (data.xLocation !== undefined) gembot3DVisualizer.setXAxis(data.xLocation);
    if (data.yLocation !== undefined) gembot3DVisualizer.setYAxis(data.yLocation);
    if (data.indexPosition !== undefined) gembot3DVisualizer.setIndex(data.indexPosition);
    if (data.angle !== undefined) gembot3DVisualizer.setAngle(data.angle);
    if (data.spindleRPM !== undefined) gembot3DVisualizer.setSpindle(data.spindleRPM);
}

/**
 * Get current machine state for transmission to physical hardware
 */
function getMachineState() {
    if (!gembot3DVisualizer) return null;
    return gembot3DVisualizer.getMachineState();
}

/**
 * Enable/disable 3D visualization
 */
function toggle3DVisualization(enabled) {
    if (!gembot3DVisualizer) return;
    if (enabled) {
        gembot3DVisualizer.show();
        gembot3DVisualizer.startRenderLoop();
    } else {
        gembot3DVisualizer.stopRenderLoop();
        gembot3DVisualizer.hide();
    }
}

/**
 * Simplified GemBot3DVisualizer class stub
 * Full implementation in gembot-3d-visualizer.js
 */
class GemBot3DVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        
        this.machine = {
            xMicrosteps: 0,
            yMicrosteps: 0,
            indexPosition: 0,
            angleDegrees: 90,
            spindleRPM: 0,
            motorPower: false
        };
        
        this.meshes = {};
        this.isRendering = false;
        
        this.init();
    }
    
    init() {
        try {
            if (!this.container) {
                console.error('❌ Container not found for 3D visualizer');
                return;
            }
            
            // Create canvas
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                width: 100%;
                height: 100%;
                display: block;
            `;
            this.container.appendChild(this.canvas);
            
            // Initialize Babylon.js
            this.engine = new BABYLON.Engine(this.canvas, true);
            this.createScene();
            
            // Handle window resize
            window.addEventListener('resize', () => this.engine.resize());
            
            console.log('✅ 3D Visualizer initialized');
            this.startRenderLoop();
            
        } catch (error) {
            console.error('❌ Error initializing 3D Visualizer:', error);
        }
    }
    
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.background = new BABYLON.Color3(0.1, 0.12, 0.15);
        
        // Lighting
        const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 1), this.scene);
        light1.intensity = 0.8;
        
        const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(5, 10, 5), this.scene);
        light2.intensity = 0.6;
        
        // Camera
        this.camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 20, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.wheelPrecision = 50;
        this.camera.inertia = 0.7;
        
        // Ground (workbench)
        const groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMaterial.diffuse = new BABYLON.Color3(0.4, 0.3, 0.25);
        
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 30, height: 20 }, this.scene);
        ground.material = groundMaterial;
        ground.position.y = -0.5;
        
        this.createMachine();
    }
    
    createMachine() {
        // Base platform
        const baseMaterial = new BABYLON.StandardMaterial('baseMat', this.scene);
        baseMaterial.diffuse = new BABYLON.Color3(0.2, 0.2, 0.2);
        baseMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        
        const base = BABYLON.MeshBuilder.CreateBox('base', { width: 0.28, height: 0.05, depth: 0.22 }, this.scene);
        base.material = baseMaterial;
        base.position.y = 0;
        this.meshes.base = base;
        
        // Frame structure
        const frameMaterial = new BABYLON.StandardMaterial('frameMat', this.scene);
        frameMaterial.diffuse = new BABYLON.Color3(0.15, 0.15, 0.15);
        
        // Create 4 corner posts
        for (let i = 0; i < 4; i++) {
            const post = BABYLON.MeshBuilder.CreateBox('post' + i, { width: 0.02, height: 0.2, depth: 0.02 }, this.scene);
            post.material = frameMaterial;
            
            const x = (i % 2) * 0.26 - 0.13;
            const z = (Math.floor(i / 2)) * 0.2 - 0.1;
            post.position = new BABYLON.Vector3(x, 0.1, z);
            this.meshes['post' + i] = post;
        }
        
        // Grinding wheel (main component)
        const wheelMaterial = new BABYLON.StandardMaterial('wheelMat', this.scene);
        wheelMaterial.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
        wheelMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        wheelMaterial.specularPower = 64;
        
        const wheel = BABYLON.MeshBuilder.CreateCylinder('wheel', { diameter: 0.1, height: 0.014, tessellation: 32 }, this.scene);
        wheel.material = wheelMaterial;
        wheel.rotation.z = Math.PI / 2;
        wheel.position = new BABYLON.Vector3(0.09, 0.15, 0);
        this.meshes.wheel = wheel;
        
        // Chuck assembly
        const chuckMaterial = new BABYLON.StandardMaterial('chuckMat', this.scene);
        chuckMaterial.diffuse = new BABYLON.Color3(0.1, 0.1, 0.1);
        
        const chuck = BABYLON.MeshBuilder.CreateCylinder('chuck', { diameter: 0.03, height: 0.04 }, this.scene);
        chuck.material = chuckMaterial;
        chuck.position = new BABYLON.Vector3(-0.05, 0.15, 0);
        this.meshes.chuck = chuck;
        
        // Dop stick
        const dopMaterial = new BABYLON.StandardMaterial('dopMat', this.scene);
        dopMaterial.diffuse = new BABYLON.Color3(0.8, 0.75, 0.7);
        
        const dop = BABYLON.MeshBuilder.CreateCylinder('dop', { diameter: 0.008, height: 0.08, tessellation: 16 }, this.scene);
        dop.material = dopMaterial;
        dop.position = new BABYLON.Vector3(-0.05, 0.18, 0);
        dop.parent = chuck;
        this.meshes.dop = dop;
        
        console.log('✅ Machine geometry created');
    }
    
    setXAxis(value) {
        this.machine.xMicrosteps = Math.max(this.machine.xMicrosteps, Math.min(value, 192000));
        if (this.meshes.chuck) {
            this.meshes.chuck.position.x = (value / 192000) * 0.2 - 0.1;
        }
    }
    
    setYAxis(value) {
        this.machine.yMicrosteps = Math.max(0, Math.min(value, 10240));
        if (this.meshes.chuck) {
            this.meshes.chuck.position.y = 0.15 + (value / 10240) * 0.1;
        }
    }
    
    setIndex(value) {
        this.machine.indexPosition = value % 96;
        if (this.meshes.chuck) {
            const angle = (this.machine.indexPosition / 96) * Math.PI * 2;
            this.meshes.chuck.rotation.z = angle;
        }
    }
    
    setAngle(value) {
        this.machine.angleDegrees = value % 360;
        if (this.meshes.dop) {
            this.meshes.dop.rotation.x = (value * Math.PI) / 180;
        }
    }
    
    setSpindle(value) {
        this.machine.spindleRPM = Math.max(0, Math.min(value, 10000));
        if (this.meshes.wheel) {
            this.meshes.wheel.rotation.x += (this.machine.spindleRPM / 10000) * 0.01;
        }
    }
    
    getMachineState() {
        return {
            x: this.machine.xMicrosteps,
            y: this.machine.yMicrosteps,
            index: this.machine.indexPosition,
            angle: this.machine.angleDegrees,
            spindle: this.machine.spindleRPM
        };
    }
    
    startRenderLoop() {
        if (this.isRendering) return;
        this.isRendering = true;
        
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                // Rotate wheel continuously if spindle is running
                if (this.meshes.wheel && this.machine.spindleRPM > 0) {
                    this.meshes.wheel.rotation.x += (this.machine.spindleRPM / 1000) * 0.001;
                }
                this.scene.render();
            }
        });
    }
    
    stopRenderLoop() {
        this.isRendering = false;
    }
    
    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
    
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
}

// Initialize when document is ready (unless deterministic boot disables auto-init)
function __gembot3dMaybeAutoInit() {
    if (typeof window !== 'undefined' && window.GemBotAutoInit === false) {
        console.log('ℹ️ GemBot3DInitializer: auto-init disabled (GemBotAutoInit=false). Waiting for GemBotApp/bootstrap.');
        return;
    }
    setTimeout(initializeGemBot3DVisualizer, 500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', __gembot3dMaybeAutoInit);
} else {
    __gembot3dMaybeAutoInit();
}

console.log('📦 GemBot 3D Initializer module loaded');
