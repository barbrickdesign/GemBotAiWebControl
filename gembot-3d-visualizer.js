/**
 * GemBot Professional 3D Visualization System
 * Safety-Critical Real-Time Machine Mirror
 * 
 * This module renders an accurate 3D model of the GemBot machine
 * and synchronizes it with control panel data in real-time.
 * 
 * Safety: This system is designed for remote operation of physical hardware.
 * All position data must be validated against mechanical limits and
 * collision detection before execution.
 */

class GemBot3DVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    
    // Machine state
    this.machine = {
      xMicrosteps: 0,
      yMicrosteps: 0,
      indexPosition: 0, // 0-95 discrete positions
      angleDegrees: 90, // Default perpendicular
      spindleRPM: 0,
      motorPower: false
    };
    
    // Physical limits (safety-critical)
    this.limits = {
      x: { min: -192000, max: 192000, label: "X-Axis (±240mm)" },
      y: { min: 0, max: 10240, label: "Y-Axis (0-20.6mm)" },
      index: { min: 0, max: 95, label: "Index (0-95)" },
      angle: { min: 0, max: 360, label: "Angle (0-360°)" },
      spindle: { min: 0, max: 10000, label: "Spindle (0-10000 RPM)" }
    };
    
    // 3D objects
    this.meshes = {};
    this.selectableObjects = [];
    this.currentlySelected = null;
    
    // Synchronization
    this.updateRate = 60; // FPS
    this.motorUpdateRate = 100; // milliseconds
    this.lastUpdate = 0;
    
    // Connection status
    this.connectionMode = "VIRTUAL"; // VIRTUAL or PHYSICAL
    this.isConnected = false;
    this.connectionCheckInterval = null;
    
    // Logging & debugging
    this.debugMode = false;
    this.positionHistory = [];
    this.maxHistoryLength = 100;
  }

  /**
   * Initialize the 3D scene
   */
  async init() {
    console.log("[GemBot3D] Initializing visualization system...");
    
    // Setup Three.js scene
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLighting();
    this.setupControls();
    
    // Build machine geometry
    await this.buildMachineGeometry();
    await this.buildWorkbench();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start animation loop
    this.animate();
    
    console.log("[GemBot3D] Initialization complete. Mode: " + this.connectionMode);
    return true;
  }

  /**
   * Setup Three.js scene with black background
   */
  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 5000, 10000);
  }

  /**
   * Setup camera with good view of workbench
   */
  setupCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      10000
    );
    
    // Position camera for good machine view
    // Slightly elevated, angled down, offset to side
    this.camera.position.set(600, 800, 800);
    this.camera.lookAt(300, 300, 300);
    this.camera.up.set(0, 0, 1);
  }

  /**
   * Setup WebGL renderer with antialiasing
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      precision: "highp"
    });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    this.container.appendChild(this.renderer.domElement);
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Setup 3-point lighting (professional)
   */
  setupLighting() {
    // Ambient light (base illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Key light (main light from front-left-above)
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(800, 600, 800);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.far = 2000;
    keyLight.shadow.camera.near = 100;
    keyLight.shadow.camera.left = -1000;
    keyLight.shadow.camera.right = 1000;
    keyLight.shadow.camera.top = 1000;
    keyLight.shadow.camera.bottom = -1000;
    this.scene.add(keyLight);
    this.meshes.keyLight = keyLight;
    
    // Fill light (from opposite side)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-600, 400, 500);
    this.scene.add(fillLight);
    
    // Back light (for depth)
    const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
    backLight.position.set(0, 500, -800);
    this.scene.add(backLight);
  }

  /**
   * Setup camera controls (orbit camera around machine)
   */
  setupControls() {
    // Basic orbit controls implementation
    // In production, use THREE.OrbitControls from CDN
    this.cameraTarget = new THREE.Vector3(300, 300, 300);
    this.cameraDistance = Math.hypot(
      this.camera.position.x - this.cameraTarget.x,
      this.camera.position.y - this.cameraTarget.y,
      this.camera.position.z - this.cameraTarget.z
    );
    
    // Setup mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    this.renderer.domElement.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      // Rotate camera around target
      const theta = Math.atan2(
        this.camera.position.y - this.cameraTarget.y,
        this.camera.position.x - this.cameraTarget.x
      );
      const phi = Math.acos(
        (this.camera.position.z - this.cameraTarget.z) / this.cameraDistance
      );
      
      const newTheta = theta + (deltaX * Math.PI / 500);
      const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi - (deltaY * Math.PI / 500)));
      
      this.camera.position.x = this.cameraTarget.x + this.cameraDistance * Math.sin(newPhi) * Math.cos(newTheta);
      this.camera.position.y = this.cameraTarget.y + this.cameraDistance * Math.sin(newPhi) * Math.sin(newTheta);
      this.camera.position.z = this.cameraTarget.z + this.cameraDistance * Math.cos(newPhi);
      this.camera.lookAt(this.cameraTarget);
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    this.renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    // Zoom with mouse wheel
    this.renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance += (e.deltaY > 0 ? 50 : -50);
      this.cameraDistance = Math.max(300, Math.min(2000, this.cameraDistance));
      
      const theta = Math.atan2(
        this.camera.position.y - this.cameraTarget.y,
        this.camera.position.x - this.cameraTarget.x
      );
      const phi = Math.acos(
        (this.camera.position.z - this.cameraTarget.z) / 
        Math.hypot(
          this.camera.position.x - this.cameraTarget.x,
          this.camera.position.y - this.cameraTarget.y,
          this.camera.position.z - this.cameraTarget.z
        )
      );
      
      this.camera.position.x = this.cameraTarget.x + this.cameraDistance * Math.sin(phi) * Math.cos(theta);
      this.camera.position.y = this.cameraTarget.y + this.cameraDistance * Math.sin(phi) * Math.sin(theta);
      this.camera.position.z = this.cameraTarget.z + this.cameraDistance * Math.cos(phi);
      this.camera.lookAt(this.cameraTarget);
    });
  }

  /**
   * Build complete machine geometry
   */
  async buildMachineGeometry() {
    console.log("[GemBot3D] Building machine geometry...");
    
    // Create root group for machine
    this.machineRoot = new THREE.Group();
    this.machineRoot.position.set(300, 300, 0);
    this.scene.add(this.machineRoot);
    
    // Build components
    this.buildFrame();
    this.buildSpindle();
    this.buildXAxisSystem();
    this.buildPanels();
    this.buildCoolingSystem();
    
    console.log("[GemBot3D] Machine geometry built successfully");
  }

  /**
   * Build aluminum frame structure (20x20mm extrusion)
   */
  buildFrame() {
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.7,
      roughness: 0.3
    });
    
    const railGeometry = new THREE.BoxGeometry(20, 20, 1);
    
    // Front-left vertical rail
    const flRail = new THREE.Mesh(railGeometry, frameMaterial);
    flRail.scale.set(1, 1, 150);
    flRail.position.set(-200, -150, 75);
    flRail.castShadow = true;
    flRail.receiveShadow = true;
    this.machineRoot.add(flRail);
    
    // Front-right vertical rail
    const frRail = new THREE.Mesh(railGeometry, frameMaterial);
    frRail.scale.set(1, 1, 150);
    frRail.position.set(200, -150, 75);
    frRail.castShadow = true;
    frRail.receiveShadow = true;
    this.machineRoot.add(frRail);
    
    // Back-left vertical rail
    const blRail = new THREE.Mesh(railGeometry, frameMaterial);
    blRail.scale.set(1, 1, 150);
    blRail.position.set(-200, 150, 75);
    blRail.castShadow = true;
    blRail.receiveShadow = true;
    this.machineRoot.add(blRail);
    
    // Back-right vertical rail
    const brRail = new THREE.Mesh(railGeometry, frameMaterial);
    brRail.scale.set(1, 1, 150);
    brRail.position.set(200, 150, 75);
    brRail.castShadow = true;
    brRail.receiveShadow = true;
    this.machineRoot.add(brRail);
    
    // Top front horizontal rail (for X-axis ball screw)
    const tfRail = new THREE.Mesh(railGeometry, frameMaterial);
    tfRail.scale.set(200, 1, 1);
    tfRail.position.set(0, -150, 150);
    tfRail.castShadow = true;
    tfRail.receiveShadow = true;
    this.machineRoot.add(tfRail);
    
    // Top back horizontal rail
    const tbRail = new THREE.Mesh(railGeometry, frameMaterial);
    tbRail.scale.set(200, 1, 1);
    tbRail.position.set(0, 150, 150);
    tbRail.castShadow = true;
    tbRail.receiveShadow = true;
    this.machineRoot.add(tbRail);
    
    // Base platform
    const basePlatformGeometry = new THREE.BoxGeometry(400, 300, 20);
    const basePlatformMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.8
    });
    const basePlatform = new THREE.Mesh(basePlatformGeometry, basePlatformMaterial);
    basePlatform.position.set(0, 0, -10);
    basePlatform.castShadow = true;
    basePlatform.receiveShadow = true;
    this.machineRoot.add(basePlatform);
    
    this.meshes.frame = this.machineRoot;
  }

  /**
   * Build grinding wheel and spindle motor
   */
  buildSpindle() {
    const spindle = new THREE.Group();
    
    // Motor housing (black aluminum)
    const motorHousingGeometry = new THREE.BoxGeometry(50, 50, 50);
    const motorMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.2,
      roughness: 0.8
    });
    const motorHousing = new THREE.Mesh(motorHousingGeometry, motorMaterial);
    motorHousing.position.set(0, 180, 100);
    motorHousing.castShadow = true;
    motorHousing.receiveShadow = true;
    spindle.add(motorHousing);
    
    // Motor shaft (stainless steel)
    const shaftGeometry = new THREE.CylinderGeometry(8, 8, 60, 16);
    const shaftMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.1
    });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.set(0, 180, 130);
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    spindle.add(shaft);
    this.meshes.motorShaft = shaft;
    
    // Grinding wheel (100mm diameter, 14mm thickness)
    const wheelGeometry = new THREE.CylinderGeometry(50, 50, 14, 64);
    this.wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0xC0C0C0, // Light gray (coarse grit default)
      metalness: 0.4,
      roughness: 0.6,
      side: THREE.DoubleSide
    });
    const wheel = new THREE.Mesh(wheelGeometry, this.wheelMaterial);
    wheel.position.set(0, 180, 157);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    spindle.add(wheel);
    this.meshes.grindingWheel = wheel;
    
    // Wheel flange/support
    const flangeGeometry = new THREE.CylinderGeometry(60, 60, 5, 32);
    const flangeMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.5,
      roughness: 0.6
    });
    const flange = new THREE.Mesh(flangeGeometry, flangeMaterial);
    flange.position.set(0, 180, 165);
    flange.castShadow = true;
    flange.receiveShadow = true;
    spindle.add(flange);
    
    this.machineRoot.add(spindle);
    this.meshes.spindle = spindle;
  }

  /**
   * Build X and Y axis systems with ball screws
   */
  buildXAxisSystem() {
    // X-Axis ball screw (horizontal, along Y direction)
    const screwGeometry = new THREE.CylinderGeometry(6, 6, 400, 12);
    const screwMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.8,
      roughness: 0.2
    });
    const xScrew = new THREE.Mesh(screwGeometry, screwMaterial);
    xScrew.rotation.z = Math.PI / 2;
    xScrew.position.set(0, 0, 140);
    xScrew.castShadow = true;
    xScrew.receiveShadow = true;
    this.machineRoot.add(xScrew);
    
    // X-Axis carriage (moves along screw)
    this.xAxisCarriage = new THREE.Group();
    this.xAxisCarriage.position.set(0, 0, 140);
    this.machineRoot.add(this.xAxisCarriage);
    
    const carriageGeometry = new THREE.BoxGeometry(80, 60, 80);
    const carriageMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.5,
      roughness: 0.5
    });
    const carriage = new THREE.Mesh(carriageGeometry, carriageMaterial);
    carriage.castShadow = true;
    carriage.receiveShadow = true;
    this.xAxisCarriage.add(carriage);
    
    // Y-Axis ball screw (vertical, along Z direction)
    const yScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 130, 12),
      screwMaterial
    );
    yScrew.position.set(0, 0, 65);
    yScrew.castShadow = true;
    yScrew.receiveShadow = true;
    this.xAxisCarriage.add(yScrew);
    
    // Y-Axis platform (moves along Y screw)
    this.yAxisPlatform = new THREE.Group();
    this.yAxisPlatform.position.set(0, 0, 65);
    this.xAxisCarriage.add(this.yAxisPlatform);
    
    const platformGeometry = new THREE.BoxGeometry(100, 90, 80);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.4,
      roughness: 0.6
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.castShadow = true;
    platform.receiveShadow = true;
    this.yAxisPlatform.add(platform);
    
    this.buildIndexMotor();
    
    this.meshes.xAxisCarriage = this.xAxisCarriage;
    this.meshes.yAxisPlatform = this.yAxisPlatform;
  }

  /**
   * Build index motor, chuck, and dop stick assembly
   */
  buildIndexMotor() {
    // Index motor housing
    const motorHousingGeometry = new THREE.BoxGeometry(45, 45, 45);
    const motorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.8
    });
    const motorHousing = new THREE.Mesh(motorHousingGeometry, motorMaterial);
    motorHousing.position.set(0, 0, 40);
    motorHousing.castShadow = true;
    motorHousing.receiveShadow = true;
    this.yAxisPlatform.add(motorHousing);
    
    // Index gear (96-tooth, animated)
    const gearGeometry = new THREE.CylinderGeometry(35, 35, 20, 96);
    const gearMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.6,
      roughness: 0.4
    });
    this.indexGear = new THREE.Mesh(gearGeometry, gearMaterial);
    this.indexGear.position.set(0, 0, 60);
    this.indexGear.castShadow = true;
    this.indexGear.receiveShadow = true;
    this.yAxisPlatform.add(this.indexGear);
    
    // Chuck assembly (rotates with gear)
    this.chuck = new THREE.Group();
    this.chuck.position.set(0, 0, 70);
    this.yAxisPlatform.add(this.chuck);
    
    const chuckGeometry = new THREE.CylinderGeometry(15, 15, 30, 32);
    const chuckMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.5,
      roughness: 0.7
    });
    const chuckBody = new THREE.Mesh(chuckGeometry, chuckMaterial);
    chuckBody.castShadow = true;
    chuckBody.receiveShadow = true;
    this.chuck.add(chuckBody);
    
    // Dop stick (inserted in chuck, can be removed)
    const dopGeometry = new THREE.CylinderGeometry(5, 5, 80, 16);
    const dopMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5DEB3, // Wheat/cream color
      metalness: 0.1,
      roughness: 0.7
    });
    this.dopStick = new THREE.Mesh(dopGeometry, dopMaterial);
    this.dopStick.position.set(0, 0, 40);
    this.dopStick.castShadow = true;
    this.dopStick.receiveShadow = true;
    this.dopStick.userData.removable = true;
    this.chuck.add(this.dopStick);
    
    // Gemstone (on end of dop stick)
    const gemGeometry = this.createGemstoneGeometry();
    const gemMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700, // Golden
      metalness: 0.3,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    this.gemstone = new THREE.Mesh(gemGeometry, gemMaterial);
    this.gemstone.position.set(0, 0, 80);
    this.gemstone.scale.set(2, 2, 2);
    this.gemstone.castShadow = true;
    this.gemstone.receiveShadow = true;
    this.gemstone.userData.removable = true;
    this.chuck.add(this.gemstone);
    
    this.meshes.indexGear = this.indexGear;
    this.meshes.chuck = this.chuck;
    this.meshes.dopStick = this.dopStick;
    this.meshes.gemstone = this.gemstone;
  }

  /**
   * Create gemstone geometry (polyhedron)
   */
  createGemstoneGeometry() {
    const vertices = [
      -1, -1, -1,
       1, -1, -1,
       1,  1, -1,
      -1,  1, -1,
       0,  0,  1,
       0,  1.5, 0
    ];
    
    const indices = [
      0, 1, 4,
      1, 2, 4,
      2, 3, 4,
      3, 0, 4,
      0, 1, 5,
      1, 2, 5,
      2, 3, 5,
      3, 0, 5
    ];
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    geometry.computeVertexNormals();
    
    return geometry;
  }

  /**
   * Build control panel and display areas
   */
  buildPanels() {
    // Control panel base (front-facing)
    const panelGeometry = new THREE.BoxGeometry(200, 120, 30);
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.3,
      roughness: 0.8
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(0, -140, 30);
    panel.castShadow = true;
    panel.receiveShadow = true;
    this.machineRoot.add(panel);
    
    // Display screen indicator
    const screenGeometry = new THREE.BoxGeometry(150, 80, 5);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x001a4d,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0033ff,
      emissiveIntensity: 0.3
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, -140, 45);
    screen.castShadow = true;
    screen.receiveShadow = true;
    this.machineRoot.add(screen);
  }

  /**
   * Build cooling system
   */
  buildCoolingSystem() {
    // Coolant tank
    const tankGeometry = new THREE.BoxGeometry(100, 80, 100);
    const tankMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.2,
      roughness: 0.8
    });
    const tank = new THREE.Mesh(tankGeometry, tankMaterial);
    tank.position.set(-150, 100, 50);
    tank.castShadow = true;
    tank.receiveShadow = true;
    this.machineRoot.add(tank);
    
    // Water pump
    const pumpGeometry = new THREE.BoxGeometry(40, 40, 60);
    const pumpMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.5,
      roughness: 0.5
    });
    const pump = new THREE.Mesh(pumpGeometry, pumpMaterial);
    pump.position.set(-150, 140, 120);
    pump.castShadow = true;
    pump.receiveShadow = true;
    this.machineRoot.add(pump);
  }

  /**
   * Build interactive workbench with objects
   */
  async buildWorkbench() {
    console.log("[GemBot3D] Building workbench...");
    
    // Workbench table
    const tableGeometry = new THREE.BoxGeometry(1200, 800, 30);
    const tableMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B7355,
      metalness: 0.1,
      roughness: 0.8
    });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(300, 300, -45);
    table.castShadow = true;
    table.receiveShadow = true;
    this.scene.add(table);
    
    // Build interactive objects
    this.buildStoneHolder();
    this.buildDopStickHolder();
    this.buildWheelStorage();
    this.buildSupplyArea();
    
    console.log("[GemBot3D] Workbench complete");
  }

  /**
   * Build rough stone holder with selectable stones
   */
  buildStoneHolder() {
    const holderGroup = new THREE.Group();
    holderGroup.position.set(100, 100, 0);
    this.scene.add(holderGroup);
    
    // Holder structure
    const holderGeometry = new THREE.BoxGeometry(150, 150, 60);
    const holderMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.3,
      roughness: 0.7
    });
    const holder = new THREE.Mesh(holderGeometry, holderMaterial);
    holder.position.set(0, 0, 0);
    holder.castShadow = true;
    holder.receiveShadow = true;
    holderGroup.add(holder);
    
    // Rough stones (6 different shapes/colors)
    const stoneColors = [0xFF6347, 0x4169E1, 0x32CD32, 0xFF8C00, 0x9370DB, 0x20B2AA];
    const positions = [
      [-40, -40, 30],
      [40, -40, 30],
      [-40, 40, 30],
      [40, 40, 30],
      [0, 0, 30],
      [0, -50, 30]
    ];
    
    positions.forEach((pos, idx) => {
      const stoneGeometry = this.createGemstoneGeometry();
      const stoneMaterial = new THREE.MeshStandardMaterial({
        color: stoneColors[idx],
        metalness: 0.2,
        roughness: 0.6
      });
      const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
      stone.position.set(pos[0], pos[1], pos[2]);
      stone.scale.set(1.5, 1.5, 1.5);
      stone.castShadow = true;
      stone.receiveShadow = true;
      stone.userData.selectable = true;
      stone.userData.type = "rough_stone";
      stone.userData.index = idx;
      holderGroup.add(stone);
      this.selectableObjects.push(stone);
    });
    
    this.meshes.stoneHolder = holderGroup;
  }

  /**
   * Build dop stick holder
   */
  buildDopStickHolder() {
    const holderGroup = new THREE.Group();
    holderGroup.position.set(400, 100, 0);
    this.scene.add(holderGroup);
    
    // Holder structure
    const holderGeometry = new THREE.BoxGeometry(120, 150, 60);
    const holderMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.3,
      roughness: 0.7
    });
    const holder = new THREE.Mesh(holderGeometry, holderMaterial);
    holder.castShadow = true;
    holder.receiveShadow = true;
    holderGroup.add(holder);
    
    // 4 dop sticks
    const positions = [[-30, -30, 30], [30, -30, 30], [-30, 30, 30], [30, 30, 30]];
    
    positions.forEach((pos, idx) => {
      const dopGeometry = new THREE.CylinderGeometry(4, 4, 70, 12);
      const dopMaterial = new THREE.MeshStandardMaterial({
        color: 0xF5DEB3,
        metalness: 0.1,
        roughness: 0.7
      });
      const dop = new THREE.Mesh(dopGeometry, dopMaterial);
      dop.position.set(pos[0], pos[1], pos[2]);
      dop.castShadow = true;
      dop.receiveShadow = true;
      dop.userData.selectable = true;
      dop.userData.type = "dop_stick";
      dop.userData.index = idx;
      holderGroup.add(dop);
      this.selectableObjects.push(dop);
    });
    
    this.meshes.dopStickHolder = holderGroup;
  }

  /**
   * Build grinding wheel storage
   */
  buildWheelStorage() {
    const storageGroup = new THREE.Group();
    storageGroup.position.set(700, 100, 0);
    this.scene.add(storageGroup);
    
    // Storage structure
    const shelfGeometry = new THREE.BoxGeometry(140, 160, 40);
    const shelfMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.3,
      roughness: 0.7
    });
    const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    storageGroup.add(shelf);
    
    // 4 wheels with different grits
    const wheelColors = [0xC0C0C0, 0xA9A9A9, 0x808080, 0x696969];
    const wheelLabels = ["60", "120", "220", "Polish"];
    const positions = [[-35, -35, 20], [35, -35, 20], [-35, 35, 20], [35, 35, 20]];
    
    positions.forEach((pos, idx) => {
      const wheelGeometry = new THREE.CylinderGeometry(30, 30, 10, 32);
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: wheelColors[idx],
        metalness: 0.4,
        roughness: 0.6
      });
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      wheel.userData.selectable = true;
      wheel.userData.type = "grinding_wheel";
      wheel.userData.grit = wheelLabels[idx];
      wheel.userData.index = idx;
      storageGroup.add(wheel);
      this.selectableObjects.push(wheel);
    });
    
    this.meshes.wheelStorage = storageGroup;
  }

  /**
   * Build miscellaneous supply area
   */
  buildSupplyArea() {
    const supplyGroup = new THREE.Group();
    supplyGroup.position.set(200, 500, 0);
    this.scene.add(supplyGroup);
    
    // Coolant bottle
    const bottleGeometry = new THREE.CylinderGeometry(15, 15, 80, 16);
    const bottleMaterial = new THREE.MeshStandardMaterial({
      color: 0x0066cc,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.7
    });
    const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
    bottle.position.set(-50, 0, 40);
    bottle.castShadow = true;
    bottle.receiveShadow = true;
    supplyGroup.add(bottle);
    
    // Polish compound tube
    const tubeGeometry = new THREE.CylinderGeometry(8, 8, 100, 16);
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xDC143C,
      metalness: 0.2,
      roughness: 0.6
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.position.set(50, 0, 50);
    tube.castShadow = true;
    tube.receiveShadow = true;
    supplyGroup.add(tube);
    
    this.meshes.supplyArea = supplyGroup;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Click to select objects
    this.renderer.domElement.addEventListener('click', (event) => {
      this.handleObjectSelection(event);
    });
    
    // Listen for UI control changes
    if (window.motorControlPanel) {
      window.addEventListener('motorUpdate', (e) => {
        this.updateMachineState(e.detail);
      });
    }
  }

  /**
   * Handle 3D object selection via click
   */
  handleObjectSelection(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.selectableObjects, true);
    
    if (intersects.length > 0) {
      const selected = intersects[0].object;
      this.selectObject(selected);
    }
  }

  /**
   * Select and highlight an object
   */
  selectObject(obj) {
    // Deselect previous
    if (this.currentlySelected) {
      this.currentlySelected.material.emissive.setHex(0x000000);
    }
    
    // Select new
    this.currentlySelected = obj;
    this.currentlySelected.material.emissive.setHex(0x0088ff);
    
    console.log(`[GemBot3D] Selected: ${obj.userData.type} (${obj.userData.index})`);
  }

  /**
   * Update machine state from UI or physical hardware
   */
  updateMachineState(data) {
    // Update position data
    if (data.xMicrosteps !== undefined) this.machine.xMicrosteps = data.xMicrosteps;
    if (data.yMicrosteps !== undefined) this.machine.yMicrosteps = data.yMicrosteps;
    if (data.indexPosition !== undefined) this.machine.indexPosition = data.indexPosition;
    if (data.angleDegrees !== undefined) this.machine.angleDegrees = data.angleDegrees;
    if (data.spindleRPM !== undefined) this.machine.spindleRPM = data.spindleRPM;
    if (data.motorPower !== undefined) this.machine.motorPower = data.motorPower;
    
    // Validate against limits
    this.validateMachineState();
  }

  /**
   * Validate machine state against safety limits
   */
  validateMachineState() {
    const state = this.machine;
    
    // X-axis limits
    if (state.xMicrosteps < this.limits.x.min || state.xMicrosteps > this.limits.x.max) {
      console.warn(`[GemBot3D] X-axis limit exceeded: ${state.xMicrosteps}`);
      state.xMicrosteps = Math.max(this.limits.x.min, Math.min(this.limits.x.max, state.xMicrosteps));
    }
    
    // Y-axis limits
    if (state.yMicrosteps < this.limits.y.min || state.yMicrosteps > this.limits.y.max) {
      console.warn(`[GemBot3D] Y-axis limit exceeded: ${state.yMicrosteps}`);
      state.yMicrosteps = Math.max(this.limits.y.min, Math.min(this.limits.y.max, state.yMicrosteps));
    }
    
    // Index position (0-95 discrete)
    state.indexPosition = Math.max(0, Math.min(95, state.indexPosition));
  }

  /**
   * Get current 3D positions (in millimeters)
   */
  getMachinePositions() {
    const state = this.machine;
    
    // Convert microsteps to millimeters (2mm pitch ball screw)
    const xPositionMm = (state.xMicrosteps / 3200) * 2 - 120; // Offset to center
    const yPositionMm = (state.yMicrosteps / 3200) * 2; // Direct conversion
    
    // Index angle
    const indexAngle = (state.indexPosition / 96) * Math.PI * 2;
    
    // Stone position in 3D world coordinates
    const stoneWorldX = 300 + xPositionMm;
    const stoneWorldY = 300 + yPositionMm;
    const stoneWorldZ = 157 - yPositionMm; // Wheel at 157mm height
    
    return {
      x: xPositionMm,
      y: yPositionMm,
      indexAngle: indexAngle,
      stoneWorldX: stoneWorldX,
      stoneWorldY: stoneWorldY,
      stoneWorldZ: stoneWorldZ,
      distanceToWheel: Math.max(0, 157 - stoneWorldZ)
    };
  }

  /**
   * Main animation loop
   */
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const now = Date.now();
    const elapsed = now - this.lastUpdate;
    
    if (elapsed >= (1000 / this.updateRate)) {
      // Update machine geometry based on state
      this.updateMachineGeometry();
      
      // Render scene
      this.renderer.render(this.scene, this.camera);
      
      this.lastUpdate = now;
    }
  }

  /**
   * Update machine geometry positions based on motor values
   */
  updateMachineGeometry() {
    const positions = this.getMachinePositions();
    
    // X-axis carriage movement (along Y direction)
    const xPositionMm = (this.machine.xMicrosteps / 3200) * 2 - 120;
    this.xAxisCarriage.position.y = xPositionMm;
    
    // Y-axis platform movement (along Z direction)
    const yPositionMm = (this.machine.yMicrosteps / 3200) * 2;
    this.yAxisPlatform.position.z = yPositionMm;
    
    // Index rotation (96-step positions)
    const indexAngle = (this.machine.indexPosition / 96) * Math.PI * 2;
    this.chuck.rotation.z = indexAngle;
    this.indexGear.rotation.z = indexAngle;
    
    // Spindle rotation (continuous)
    if (this.machine.motorPower && this.machine.spindleRPM > 0) {
      this.meshes.grindingWheel.rotation.y += (this.machine.spindleRPM / 60) * 0.01;
    }
    
    // Record position history
    if (this.positionHistory.length >= this.maxHistoryLength) {
      this.positionHistory.shift();
    }
    this.positionHistory.push({
      timestamp: Date.now(),
      ...positions
    });
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Get system status
   */
  getStatus() {
    const positions = this.getMachinePositions();
    return {
      mode: this.connectionMode,
      isConnected: this.isConnected,
      machineState: this.machine,
      positions: positions,
      historyLength: this.positionHistory.length
    };
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GemBot3DVisualizer;
}
