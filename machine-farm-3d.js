/**
 * GemBot Machine Farm - Professional Gemstone Cutting Machine 3D Environment
 * Features 96-step index motor precision, dop stick chucks, and grinding wheel system
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

        // ==================== BASE FRAME ====================
        // Main frame (aluminum extrusion)
        const frameGeometry = new THREE.BoxGeometry(4, 2, 4);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.3,
            metalness: 0.8
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.y = 1;
        frame.castShadow = true;
        frame.receiveShadow = true;
        group.add(frame);

        // Vertical corner posts (20x20 extrusion)
        const postGeometry = new THREE.BoxGeometry(0.2, 6, 0.2);
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.2
        });

        const postPositions = [
            [-1.9, 5, -1.9],
            [1.9, 5, -1.9],
            [-1.9, 5, 1.9],
            [1.9, 5, 1.9]
        ];

        postPositions.forEach(pos => {
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.set(...pos);
            post.castShadow = true;
            group.add(post);
        });

        // Top horizontal rails
        const railGeometry = new THREE.BoxGeometry(4, 0.2, 0.2);
        const rail1 = new THREE.Mesh(railGeometry, postMaterial);
        rail1.position.set(0, 8, -1.9);
        group.add(rail1);

        const rail2 = new THREE.Mesh(railGeometry, postMaterial);
        rail2.position.set(0, 8, 1.9);
        group.add(rail2);

        const rail3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 4), postMaterial);
        rail3.position.set(-1.9, 8, 0);
        group.add(rail3);

        const rail4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 4), postMaterial);
        rail4.position.set(1.9, 8, 0);
        group.add(rail4);

        // ==================== GRINDING WHEEL SYSTEM ====================
        // Grinding wheel (100mm diameter, horizontal orientation)
        const wheelGeometry = new THREE.CylinderGeometry(5, 5, 1.2, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // Gray wheel
            roughness: 0.8,
            metalness: 0.1
        });
        const grindingWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        grindingWheel.rotation.z = Math.PI / 2; // Horizontal orientation
        grindingWheel.position.set(-3, 4, 0);
        grindingWheel.castShadow = true;
        group.add(grindingWheel);
        group.userData.grindingWheel = grindingWheel;

        // Wheel spindle housing
        const spindleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
        const spindleMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1
        });
        const spindle = new THREE.Mesh(spindleGeometry, spindleMaterial);
        spindle.position.set(-3, 4, 0);
        group.add(spindle);

        // ==================== INDEX MOTOR & CHUCK ASSEMBLY ====================
        // Index motor housing (96-step stepper, left side)
        const indexMotorGeometry = new THREE.BoxGeometry(1.2, 1.5, 1.2);
        const motorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.4
        });
        const indexMotor = new THREE.Mesh(indexMotorGeometry, motorMaterial);
        indexMotor.position.set(-1.5, 6, 0);
        indexMotor.castShadow = true;
        group.add(indexMotor);
        group.userData.indexMotor = indexMotor;

        // 96-tooth index gear (visual representation)
        const indexGearGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 96);
        const gearMaterial = new THREE.MeshStandardMaterial({
            color: 0x404040,
            metalness: 0.9,
            roughness: 0.3
        });
        const indexGear = new THREE.Mesh(indexGearGeometry, gearMaterial);
        indexGear.position.set(-1.5, 6, 0);
        group.add(indexGear);
        group.userData.indexGear = indexGear;

        // Chuck assembly (rotates with index motor)
        const chuckGeometry = new THREE.CylinderGeometry(0.4, 0.6, 0.8, 16);
        const chuckMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.7,
            roughness: 0.5
        });
        const chuck = new THREE.Mesh(chuckGeometry, chuckMaterial);
        chuck.position.set(-0.5, 6, 0);
        group.add(chuck);
        group.userData.chuck = chuck;

        // Dop stick (wooden/polymer rod inserted into chuck)
        const dopStickGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
        const dopMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // Wooden brown
            roughness: 0.8,
            metalness: 0.1
        });
        const dopStick = new THREE.Mesh(dopStickGeometry, dopMaterial);
        dopStick.position.set(-0.5, 4.5, 0);
        group.add(dopStick);
        group.userData.dopStick = dopStick;

        // Gemstone on dop stick (octahedral rough)
        const gemGeometry = new THREE.OctahedronGeometry(0.3, 0);
        const gemMaterial = new THREE.MeshStandardMaterial({
            color: 0x4169E1, // Royal blue sapphire
            transparent: true,
            opacity: 0.8,
            roughness: 0.1,
            metalness: 0.1
        });
        const gemstone = new THREE.Mesh(gemGeometry, gemMaterial);
        gemstone.position.set(-0.5, 3.2, 0);
        gemstone.castShadow = true;
        group.add(gemstone);
        group.userData.gemstone = gemstone;

        // ==================== Y-AXIS PLATFORM ====================
        // Cutting platform (moves up/down)
        const platformGeometry = new THREE.BoxGeometry(2, 0.3, 2);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.6,
            metalness: 0.4
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(1, 2, 0);
        platform.castShadow = true;
        group.add(platform);
        group.userData.platform = platform;

        // Linear bearings on platform
        const bearingGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
        const bearingMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.9,
            roughness: 0.1
        });

        const bearingPositions = [
            [0.8, 2, 0.8],
            [0.8, 2, -0.8],
            [-0.8, 2, 0.8],
            [-0.8, 2, -0.8]
        ];

        bearingPositions.forEach(pos => {
            const bearing = new THREE.Mesh(bearingGeometry, bearingMaterial);
            bearing.position.set(...pos);
            group.add(bearing);
        });

        // ==================== X-AXIS CARRIAGE ====================
        // Ball screw for X-axis movement
        const screwGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
        const screwMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.8,
            roughness: 0.2
        });
        const ballScrew = new THREE.Mesh(screwGeometry, screwMaterial);
        ballScrew.rotation.z = Math.PI / 2;
        ballScrew.position.set(0, 7.5, 0);
        group.add(ballScrew);

        // ==================== ANGLE CONTROL MOTOR ====================
        // Secondary angle motor (controls facet angle)
        const angleMotorGeometry = new THREE.BoxGeometry(0.8, 1, 0.8);
        const angleMotor = new THREE.Mesh(angleMotorGeometry, motorMaterial);
        angleMotor.position.set(1.5, 6, 0);
        group.add(angleMotor);

        // Angle adjustment arm
        const armGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.1);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x777777,
            metalness: 0.6,
            roughness: 0.4
        });
        const angleArm = new THREE.Mesh(armGeometry, armMaterial);
        angleArm.position.set(1.5, 4.5, 0);
        group.add(angleArm);
        group.userData.angleArm = angleArm;

        // ==================== CONTROL PANEL ====================
        // Front control display
        const displayGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.05);
        const displayMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a3a1a,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.set(0, 3, 2.05);
        group.add(display);

        // LCD screen
        const screenGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.02);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x003300,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 3, 2.1);
        group.add(screen);

        // ==================== COOLANT SYSTEM ====================
        // Water reservoir (visual)
        const reservoirGeometry = new THREE.BoxGeometry(1, 0.8, 1);
        const reservoirMaterial = new THREE.MeshStandardMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.6,
            roughness: 0.1
        });
        const reservoir = new THREE.Mesh(reservoirGeometry, reservoirMaterial);
        reservoir.position.set(-1.5, 2.5, -1.5);
        group.add(reservoir);

        // Coolant spray nozzle
        const nozzleGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.3, 8);
        const nozzleMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.8,
            roughness: 0.2
        });
        const coolantNozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
        coolantNozzle.position.set(-2, 4.5, 0.5);
        group.add(coolantNozzle);

        // ==================== LED LIGHTING ====================
        // Status LED strips
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

        // LED point light
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
            indexPosition: 0, // 96-step index position (0-95)
            facetAngle: 0, // Current facet angle in degrees
            platformHeight: 2, // Y-axis position
            carriagePosition: 1, // X-axis position
            currentFacet: 0,
            totalFacets: 58, // Brilliant cut has 58 facets
            temperature: { wheel: 25, coolant: 22 },
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
        // Update LCD with gemstone cutting data
        document.getElementById('lcd-line1').textContent = `>>> ${machine.id} CUTTING`;
        document.getElementById('lcd-line2').textContent = `STATUS: ${machine.state.toUpperCase()}`;
        document.getElementById('lcd-line3').textContent =
            `INDEX: ${machine.indexPosition}/96 ANGLE: ${machine.facetAngle.toFixed(1)}°`;
        document.getElementById('lcd-line4').textContent = `FACET: ${machine.currentFacet}/${machine.totalFacets} PROG: ${machine.progress}%`;

        // Update temperatures (wheel and coolant)
        document.getElementById('temp-hotend').textContent = machine.temperature.wheel;
        document.getElementById('temp-bed').textContent = machine.temperature.coolant;

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
        machine.state = 'cutting';
        machine.temperature.wheel = 45; // Grinding wheel temperature
        machine.temperature.coolant = 18; // Coolant temperature
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
        machine.currentFacet = 0;
        machine.indexPosition = 0;
        machine.facetAngle = 0;
        machine.temperature.wheel = 25;
        machine.temperature.coolant = 22;
        this.updateMachinePanel(machine);
    }

    homeMachine() {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.indexPosition = 0;
        machine.facetAngle = 0;
        machine.platformHeight = 2;
        machine.carriagePosition = 1;
        machine.currentFacet = 0;

        // Reset all components to home positions
        machine.group.userData.chuck.rotation.y = 0;
        machine.group.userData.dopStick.rotation.y = 0;
        machine.group.userData.angleArm.rotation.z = 0;
        machine.group.userData.platform.position.y = 2;

        this.updateMachinePanel(machine);
    }

    // Additional control methods for gemstone cutting
    nextFacet() {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.indexPosition = (machine.indexPosition + 1) % 96; // 96-step index
        machine.currentFacet = Math.min(machine.currentFacet + 1, machine.totalFacets);
        this.updateMachinePanel(machine);
    }

    setFacetAngle(angle) {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.facetAngle = Math.max(0, Math.min(360, angle));
        this.updateMachinePanel(machine);
    }

    movePlatform(height) {
        if (!this.selectedMachine) return;
        const machine = this.machines.get(this.selectedMachine);
        machine.platformHeight = Math.max(0, Math.min(5, height));
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
            // Always animate grinding wheel when machine is active
            if (machine.state === 'cutting' || machine.state === 'paused') {
                const grindingWheel = machine.group.userData.grindingWheel;
                if (grindingWheel) {
                    grindingWheel.rotation.y += 0.1; // Continuous wheel rotation
                }
            }

            if (machine.state === 'cutting') {
                // Simulate gemstone cutting progress
                machine.progress = Math.min(100, machine.progress + 0.05); // Slower progress for realistic cutting
                machine.runtime++;

                // Animate index motor and chuck rotation (96 steps per revolution = 3.75° per step)
                const indexAngle = (machine.indexPosition / 96) * Math.PI * 2; // Convert to radians
                machine.group.userData.chuck.rotation.y = indexAngle;
                machine.group.userData.dopStick.rotation.y = indexAngle;
                machine.group.userData.gemstone.rotation.y = indexAngle;

                // Animate angle arm for facet angle adjustment
                machine.group.userData.angleArm.rotation.z = (machine.facetAngle * Math.PI) / 180;

                // Animate platform height for cutting depth
                machine.group.userData.platform.position.y = machine.platformHeight;

                // Simulate facet cutting progression
                if (machine.progress > machine.currentFacet * (100 / machine.totalFacets)) {
                    machine.currentFacet = Math.min(machine.currentFacet + 1, machine.totalFacets);
                    machine.indexPosition = (machine.indexPosition + 1) % 96; // Advance to next facet position
                }

                // Pulse LED when cutting
                const led = machine.group.userData.ledLight;
                led.intensity = 2 + Math.sin(Date.now() * 0.01) * 0.3;

                // Simulate temperature increase during cutting
                machine.temperature.wheel = Math.min(60, 25 + (machine.progress / 100) * 35);
                machine.temperature.coolant = Math.max(15, 22 - (machine.progress / 100) * 7);

                // Complete stone cutting
                if (machine.progress >= 100) {
                    machine.state = 'idle';
                    machine.progress = 0;
                    machine.jobsComplete++;
                    machine.temperature.wheel = 25;
                    machine.temperature.coolant = 22;

                    // Reset to home position
                    machine.indexPosition = 0;
                    machine.facetAngle = 0;
                    machine.currentFacet = 0;
                }

                // Update panel if selected
                if (this.selectedMachine === machine.id) {
                    this.updateMachinePanel(machine);
                }
            } else if (machine.state === 'idle') {
                // Slowly rotate index gear even when idle for visual interest
                const indexGear = machine.group.userData.indexGear;
                if (indexGear) {
                    indexGear.rotation.y += 0.002;
                }

                // Cool down temperatures
                if (machine.temperature.wheel > 25) {
                    machine.temperature.wheel = Math.max(25, machine.temperature.wheel - 0.1);
                }
                if (machine.temperature.coolant < 22) {
                    machine.temperature.coolant = Math.min(22, machine.temperature.coolant + 0.05);
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
        console.log('💎 GemBot Gemstone Cutting Machine Farm Online');
        console.log('API: window.gemBot3D.addMachine({ id: "GEMBOT-XXX", position: { x: 0, z: 0 } })');
        console.log('Features: 96-step index motor, dop stick chucks, grinding wheels, facet angle control');
    });
} else {
    window.gemBot3D = new GemBot3DEnvironment();
    console.log('💎 GemBot Gemstone Cutting Machine Farm Online');
    console.log('API: window.gemBot3D.addMachine({ id: "GEMBOT-XXX", position: { x: 0, z: 0 } })');
    console.log('Features: 96-step index motor, dop stick chucks, grinding wheels, facet angle control');
}
