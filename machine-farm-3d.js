/**
 * Machine Farm 3D Environment - Three.js Implementation
 * Integrated with GemBot Control System
 */

class GemBot3DEnvironment {
    constructor() {
        this.machines = new Map();
        this.selectedMachine = null;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

        this.init();
    }

    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLights();
        this.initEnvironment();
        this.initControls();
        this.initRaycaster();

        // Add demo machines
        this.addMachine({ id: 'GEMBOT-001', position: { x: 0, z: 0 } });
        this.addMachine({ id: 'GEMBOT-002', position: { x: 10, z: 0 } });
        this.addMachine({ id: 'GEMBOT-003', position: { x: -10, z: 0 } });

        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 30, 100);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(15, 12, 20);
        this.camera.lookAt(0, 0, 0);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: !this.isMobile });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;

        // Find the canvas container or create one
        let container = document.getElementById('canvas-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'canvas-container';
            container.style.cssText = 'width: 100vw; height: 100vh; position: fixed; top: 0; left: 0;';
            document.body.insertBefore(container, document.body.firstChild);
        }
        container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
        mainLight.position.set(30, 40, 20);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // Green accent lights
        const greenLight1 = new THREE.PointLight(0x00ff00, 1, 30);
        greenLight1.position.set(-15, 5, -15);
        this.scene.add(greenLight1);

        const greenLight2 = new THREE.PointLight(0x00ff00, 1, 30);
        greenLight2.position.set(15, 5, 15);
        this.scene.add(greenLight2);
    }

    initEnvironment() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Grid
        const gridHelper = new THREE.GridHelper(100, 50, 0x00ff00, 0x003300);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    initControls() {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;

        document.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);

        if (!this.isMobile) {
            document.addEventListener('mousemove', (e) => {
                if (document.pointerLockElement === this.renderer.domElement) {
                    this.mouseX += e.movementX * 0.002;
                    this.mouseY += e.movementY * 0.002;
                    this.mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouseY));
                }
            });

            this.renderer.domElement.addEventListener('click', () => {
                if (!document.pointerLockElement) {
                    this.renderer.domElement.requestPointerLock();
                }
            });
        }
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.renderer.domElement.addEventListener('click', (e) => {
            if (document.pointerLockElement) return;

            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const machineMeshes = Array.from(this.machines.values()).map(m => m.group);
            const intersects = this.raycaster.intersectObjects(machineMeshes, true);

            if (intersects.length > 0) {
                const clicked = this.findMachineByMesh(intersects[0].object);
                if (clicked) this.selectMachine(clicked.id);
            }
        });
    }

    // ==================== MACHINE CREATION ====================

    createMachineMesh() {
        const group = new THREE.Group();

        // Base enclosure (black box)
        const baseGeometry = new THREE.BoxGeometry(4, 2, 4);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.5,
            metalness: 0.8
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 1;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Frame (vertical extrusions)
        const frameGeometry = new THREE.BoxGeometry(0.1, 6, 0.1);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.3
        });

        const positions = [
            [-1.95, 5, -1.95],
            [1.95, 5, -1.95],
            [-1.95, 5, 1.95],
            [1.95, 5, 1.95]
        ];

        positions.forEach(pos => {
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(...pos);
            frame.castShadow = true;
            group.add(frame);
        });

        // Top frame (horizontal rails)
        const topFrameGeometry = new THREE.BoxGeometry(4, 0.1, 0.1);
        const topFrame1 = new THREE.Mesh(topFrameGeometry, frameMaterial);
        topFrame1.position.set(0, 8, -1.95);
        group.add(topFrame1);

        const topFrame2 = new THREE.Mesh(topFrameGeometry, frameMaterial);
        topFrame2.position.set(0, 8, 1.95);
        group.add(topFrame2);

        const topFrame3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 4), frameMaterial);
        topFrame3.position.set(-1.95, 8, 0);
        group.add(topFrame3);

        const topFrame4 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 4), frameMaterial);
        topFrame4.position.set(1.95, 8, 0);
        group.add(topFrame4);

        // Print head/gantry
        const gantryGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.6);
        const gantryMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.4
        });
        const gantry = new THREE.Mesh(gantryGeometry, gantryMaterial);
        gantry.position.set(0, 6, 0);
        gantry.castShadow = true;
        group.add(gantry);
        group.userData.gantry = gantry;

        // Nozzle
        const nozzleGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.3, 8);
        const nozzleMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 1,
            roughness: 0.2
        });
        const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
        nozzle.position.set(0, 5.7, 0);
        group.add(nozzle);

        // Control display (front)
        const displayGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.05);
        const displayMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a3a1a,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.set(0, 3, 2.05);
        group.add(display);

        // Small control screen
        const screenGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.02);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x003300,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 3, 2.1);
        group.add(screen);

        // Green LED strip at base
        const ledGeometry = new THREE.BoxGeometry(3.8, 0.1, 0.1);
        const ledMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 1
        });

        const led1 = new THREE.Mesh(ledGeometry, ledMaterial);
        led1.position.set(0, 0.3, -1.95);
        group.add(led1);

        const led2 = new THREE.Mesh(ledGeometry, ledMaterial);
        led2.position.set(0, 0.3, 1.95);
        group.add(led2);

        // LED Point light
        const ledLight = new THREE.PointLight(0x00ff00, 2, 8);
        ledLight.position.set(0, 0.5, 0);
        group.add(ledLight);
        group.userData.ledLight = ledLight;

        return group;
    }

    addMachine(config) {
        const { id, position = { x: 0, z: 0 } } = config;

        if (this.machines.has(id)) return;

        const machineGroup = this.createMachineMesh();
        machineGroup.position.set(position.x, 0, position.z);
        this.scene.add(machineGroup);

        this.machines.set(id, {
            id,
            group: machineGroup,
            state: 'idle',
            progress: 0,
            temperature: { hotend: 25, bed: 22 },
            position: { x: 0, y: 0, z: 0 },
            jobsComplete: 0,
            runtime: 0
        });

        this.updateMachineCount();
    }

    selectMachine(id) {
        const machine = this.machines.get(id);
        if (!machine) return;

        this.selectedMachine = id;
        document.getElementById('machine-name').textContent = id;
        document.getElementById('machine-panel').classList.add('active');

        this.updateMachinePanel(machine);
    }

    deselectMachine() {
        this.selectedMachine = null;
        document.getElementById('machine-panel').classList.remove('active');
    }

    updateMachinePanel(machine) {
        // Update LCD
        document.getElementById('lcd-line1').textContent = `>>> ${machine.id} SYSTEM`;
        document.getElementById('lcd-line2').textContent = `STATUS: ${machine.state.toUpperCase()}`;
        document.getElementById('lcd-line3').textContent =
            `POS: X:${machine.position.x.toFixed(1)} Y:${machine.position.y.toFixed(1)} Z:${machine.position.z.toFixed(1)}`;
        document.getElementById('lcd-line4').textContent = `PROGRESS: ${machine.progress}%`;

        // Update temps
        document.getElementById('temp-hotend').textContent = machine.temperature.hotend;
        document.getElementById('temp-bed').textContent = machine.temperature.bed;

        // Update progress
        document.getElementById('progress-fill').style.width = machine.progress + '%';
        document.getElementById('progress-text').textContent = machine.progress + '%';

        // Update status
        document.getElementById('machine-state').textContent = machine.state.toUpperCase();
        document.getElementById('jobs-complete').textContent = machine.jobsComplete;

        const hours = Math.floor(machine.runtime / 3600);
        const minutes = Math.floor((machine.runtime % 3600) / 60);
        const seconds = machine.runtime % 60;
        document.getElementById('runtime').textContent =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startMachine() {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.state = 'printing';
        machine.temperature.hotend = 210;
        machine.temperature.bed = 60;
        this.updateMachinePanel(machine);
    }

    pauseMachine() {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.state = 'paused';
        this.updateMachinePanel(machine);
    }

    stopMachine() {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.state = 'idle';
        machine.progress = 0;
        machine.temperature.hotend = 25;
        machine.temperature.bed = 22;
        this.updateMachinePanel(machine);
    }

    homeMachine() {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.position = { x: 0, y: 0, z: 0 };
        machine.group.userData.gantry.position.set(0, 6, 0);
        this.updateMachinePanel(machine);
    }

    findMachineByMesh(mesh) {
        for (const machine of this.machines.values()) {
            if (machine.group === mesh || machine.group.children.includes(mesh)) {
                return machine;
            }
            // Check nested children
            for (const child of machine.group.children) {
                if (child.children && child.children.includes(mesh)) {
                    return machine;
                }
            }
        }
        return null;
    }

    updateMachineCount() {
        document.getElementById('machine-count').textContent = this.machines.size;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Camera controls
        const speed = 0.3;
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        right.y = 0;
        right.normalize();

        if (this.keys['w']) this.camera.position.add(forward.multiplyScalar(speed));
        if (this.keys['s']) this.camera.position.add(forward.multiplyScalar(-speed));
        if (this.keys['a']) this.camera.position.add(right.multiplyScalar(-speed));
        if (this.keys['d']) this.camera.position.add(right.multiplyScalar(speed));

        // Apply mouse look
        if (!this.isMobile) {
            this.camera.rotation.order = 'YXZ';
            this.camera.rotation.y = this.mouseX;
            this.camera.rotation.x = this.mouseY;
        }

        // Update machines
        this.machines.forEach((machine) => {
            if (machine.state === 'printing') {
                // Simulate progress
                machine.progress = Math.min(100, machine.progress + 0.1);
                machine.runtime++;

                // Animate gantry
                const gantry = machine.group.userData.gantry;
                gantry.position.x = Math.sin(Date.now() * 0.001) * 1.5;
                gantry.position.z = Math.cos(Date.now() * 0.0008) * 1.5;

                // Update position
                machine.position.x = gantry.position.x;
                machine.position.z = gantry.position.z;

                // Pulse LED when printing
                const led = machine.group.userData.ledLight;
                led.intensity = 2 + Math.sin(Date.now() * 0.005) * 0.5;

                // Complete job
                if (machine.progress >= 100) {
                    machine.state = 'idle';
                    machine.progress = 0;
                    machine.jobsComplete++;
                    machine.temperature.hotend = 25;
                    machine.temperature.bed = 22;
                }

                // Update panel if selected
                if (this.selectedMachine === machine.id) {
                    this.updateMachinePanel(machine);
                }
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gemBot3D = new GemBot3DEnvironment();
        console.log('🤖 GemBot Machine Farm Online');
        console.log('API: window.gemBot3D.addMachine({ id: "GEMBOT-XXX", position: { x: 0, z: 0 } })');
    });
} else {
    window.gemBot3D = new GemBot3DEnvironment();
    console.log('🤖 GemBot Machine Farm Online');
    console.log('API: window.gemBot3D.addMachine({ id: "GEMBOT-XXX", position: { x: 0, z: 0 } })');
}
