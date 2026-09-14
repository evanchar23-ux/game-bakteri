/**
 * cell3d.js
 * 3D Microscopic Holographic Bio-Chamber Viewer
 * Renders living 3D immune cells with membrane physics, organelles, and surface receptors.
 */

export class Cell3DViewer {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('cell-3d-pod');
    this.canvas = options.canvas || document.getElementById('cell3dCanvas');
    this.telemetryEl = options.telemetryEl || document.getElementById('cell-telemetry-badge');

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.cellGroup = null;
    this.activeCellId = null;

    this.clock = null;
    this.isInitialized = false;

    // Cell internal animation handles
    this.animators = {};

    this.init();
  }

  init() {
    if (!window.THREE) {
      setTimeout(() => this.init(), 100);
      return;
    }

    if (this.isInitialized || !this.canvas) return;
    this.isInitialized = true;

    const width = this.container ? (this.container.clientWidth || 360) : 360;
    const height = this.container ? (this.container.clientHeight || 380) : 380;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    this.camera.position.set(0, 0.2, 3.2);

    // 3. WebGL Renderer with Transparent Background
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    // 4. Clock
    this.clock = new THREE.Clock();

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    this.keyLight = new THREE.DirectionalLight(0x00f2fe, 1.8);
    this.keyLight.position.set(3, 4, 3);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0xff00aa, 1.6);
    this.rimLight.position.set(-3, -2, -3);
    this.scene.add(this.rimLight);

    this.centerGlow = new THREE.PointLight(0x00f2fe, 1.2, 4);
    this.centerGlow.position.set(0, 0, 0);
    this.scene.add(this.centerGlow);

    // 6. Bio-Chamber Containment Holographic Rings
    this.createContainmentField();

    // 7. Active Cell Root Group
    this.cellGroup = new THREE.Group();
    this.scene.add(this.cellGroup);

    if (this.pendingCellId) {
      const p = this.pendingCellId;
      this.pendingCellId = null;
      this.showCell(p);
    }

    // 8. Orbit Controls (Interactive 360 rotation)
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.enablePan = false;
      this.controls.minDistance = 1.8;
      this.controls.maxDistance = 5.0;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 2.0;
    }

    // 9. Resize Listener
    window.addEventListener('resize', () => this.handleResize());

    // 10. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 360;
    const height = this.container.clientHeight || 380;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  createContainmentField() {
    this.fieldGroup = new THREE.Group();

    // Outer Rotating Optical Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    this.containmentRing1 = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.43, 64), ringMat1);
    this.containmentRing1.rotation.x = Math.PI / 2.6;
    this.fieldGroup.add(this.containmentRing1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    this.containmentRing2 = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.62, 64), ringMat2);
    this.containmentRing2.rotation.y = Math.PI / 3.2;
    this.fieldGroup.add(this.containmentRing2);

    // Floating Bio-Dust Particles
    const dustCount = 48;
    const dustGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3.2;
      positions[i + 1] = (Math.random() - 0.5) * 3.2;
      positions[i + 2] = (Math.random() - 0.5) * 3.2;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.dustParticles = new THREE.Points(dustGeom, dustMat);
    this.fieldGroup.add(this.dustParticles);

    this.scene.add(this.fieldGroup);
  }

  showCell(cellId) {
    if (!this.cellGroup) {
      this.pendingCellId = cellId;
      return;
    }
    if (this.activeCellId === cellId && this.cellGroup.children.length > 0) return;
    this.activeCellId = cellId;

    // Clear previous cell model
    while (this.cellGroup.children.length > 0) {
      const obj = this.cellGroup.children[0];
      this.cellGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    this.animators = {};

    switch (cellId) {
      case 'macrophage':
        this.buildMacrophage();
        this.updateLighting(0x00e5ff, 0x0088cc);
        break;
      case 'neutrophil':
        this.buildNeutrophil();
        this.updateLighting(0x00ff88, 0x00aa55);
        break;
      case 'b_cell':
        this.buildBCell();
        this.updateLighting(0xd946ef, 0x8b5cf6);
        break;
      case 't_cell':
        this.buildTCell();
        this.updateLighting(0xf59e0b, 0xef4444);
        break;
      default:
        this.buildMacrophage();
        this.updateLighting(0x00e5ff, 0x0088cc);
    }

    // Spawn pop animation
    this.cellGroup.scale.set(0.2, 0.2, 0.2);
    this.popTime = 0;
  }

  updateLighting(primaryColor, secondaryColor) {
    if (this.keyLight) this.keyLight.color.setHex(primaryColor);
    if (this.centerGlow) this.centerGlow.color.setHex(primaryColor);
    if (this.rimLight) this.rimLight.color.setHex(secondaryColor);
    if (this.containmentRing1) this.containmentRing1.material.color.setHex(primaryColor);
    if (this.containmentRing2) this.containmentRing2.material.color.setHex(secondaryColor);
  }

  // =========================================================================
  // 1. MAKROFAG: Large Amoeboid Cell with Pseudopodia & Phagocytic Vacuoles
  // =========================================================================
  buildMacrophage() {
    const group = new THREE.Group();

    // Amoeboid Deformable Membrane
    const geom = new THREE.IcosahedronGeometry(0.85, 4);
    // Store initial positions for organic wave deformation
    geom.userData = { originalPositions: geom.attributes.position.array.slice() };

    const mat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x004466,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.72,
      roughness: 0.2,
      metalness: 0.4,
      wireframe: false
    });
    const membrane = new THREE.Mesh(geom, mat);
    group.add(membrane);

    // Inner Organelle: Kidney-shaped / Spherical Large Nucleus
    const nucleusGeom = new THREE.SphereGeometry(0.36, 24, 24);
    nucleusGeom.scale(1.1, 0.85, 0.9);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    });
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    nucleus.position.set(-0.12, 0.05, 0);
    group.add(nucleus);

    // Phagocytic Lysosome Spheres (Digestive Vesicles)
    const lysosomes = [];
    const lysosomeColors = [0x00f2fe, 0x38bdf8, 0x0284c7, 0xf59e0b];
    for (let i = 0; i < 9; i++) {
      const lysoGeom = new THREE.SphereGeometry(0.06 + Math.random() * 0.04, 16, 16);
      const lysoMat = new THREE.MeshBasicMaterial({
        color: lysosomeColors[i % lysosomeColors.length],
        transparent: true,
        opacity: 0.9
      });
      const lyso = new THREE.Mesh(lysoGeom, lysoMat);
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 0.45 + Math.random() * 0.25;
      lyso.position.set(r * Math.sin(theta) * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(theta));
      group.add(lyso);
      lysosomes.push({ mesh: lyso, basePos: lyso.position.clone(), speed: 1.2 + Math.random() });
    }

    // Pseudopodia Protrusions (Tentacle-like feeding lobes)
    const pseudopodia = [];
    for (let p = 0; p < 4; p++) {
      const pGeom = new THREE.ConeGeometry(0.18, 0.5, 16);
      pGeom.translate(0, 0.25, 0);
      const pMesh = new THREE.Mesh(pGeom, mat);
      const angle = (p * Math.PI * 2) / 4;
      pMesh.position.set(Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, (Math.random() - 0.5) * 0.3);
      pMesh.rotation.z = angle - Math.PI / 2;
      group.add(pMesh);
      pseudopodia.push({ mesh: pMesh, baseAngle: angle, phase: p * 1.5 });
    }

    this.cellGroup.add(group);

    this.animators.macrophage = (time) => {
      // 1. Organic membrane undulating noise
      const pos = geom.attributes.position;
      const orig = geom.userData.originalPositions;
      for (let i = 0; i < pos.count; i++) {
        const ox = orig[i * 3];
        const oy = orig[i * 3 + 1];
        const oz = orig[i * 3 + 2];
        const wave = Math.sin(ox * 3.5 + time * 2.8) * Math.cos(oy * 3.5 + time * 2.2) * 0.08;
        pos.setXYZ(i, ox * (1 + wave), oy * (1 + wave), oz * (1 + wave));
      }
      pos.needsUpdate = true;

      // 2. Nucleus pulse
      const nScale = 1 + Math.sin(time * 2) * 0.05;
      nucleus.scale.set(1.1 * nScale, 0.85 * nScale, 0.9 * nScale);

      // 3. Floating Lysosomes
      lysosomes.forEach((l) => {
        l.mesh.position.y = l.basePos.y + Math.sin(time * l.speed) * 0.04;
        l.mesh.position.x = l.basePos.x + Math.cos(time * l.speed * 0.8) * 0.04;
      });

      // 4. Extending Pseudopodia
      pseudopodia.forEach((p) => {
        const ext = 0.9 + Math.sin(time * 2.4 + p.phase) * 0.35;
        p.mesh.scale.set(ext * 0.9, ext * 1.3, ext * 0.9);
      });
    };
  }

  // =========================================================================
  // 2. NEUTROFIL: Polymorphonuclear Multi-Lobed Nucleus & Antimicrobial Granules
  // =========================================================================
  buildNeutrophil() {
    const group = new THREE.Group();

    // Translucent Green Membrane
    const geom = new THREE.IcosahedronGeometry(0.8, 3);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x006633,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.65,
      roughness: 0.25,
      metalness: 0.3
    });
    const membrane = new THREE.Mesh(geom, mat);
    group.add(membrane);

    // Multi-Lobed Nucleus (3-4 lobes connected with nuclear strands)
    const nucleusGroup = new THREE.Group();
    const nMat = new THREE.MeshStandardMaterial({
      color: 0x4c1d95,
      emissive: 0x5b21b6,
      emissiveIntensity: 0.85,
      roughness: 0.3
    });

    const lobePositions = [
      new THREE.Vector3(-0.24, 0.16, 0.05),
      new THREE.Vector3(0.18, 0.22, -0.05),
      new THREE.Vector3(0.12, -0.22, 0.1),
      new THREE.Vector3(-0.18, -0.18, -0.1)
    ];

    lobePositions.forEach((pos, idx) => {
      const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 18), nMat);
      lobe.position.copy(pos);
      nucleusGroup.add(lobe);

      // Connect to next lobe with chromosome filament
      const nextPos = lobePositions[(idx + 1) % lobePositions.length];
      const curve = new THREE.LineCurve3(pos, nextPos);
      const tubeGeom = new THREE.TubeGeometry(curve, 8, 0.055, 8, false);
      const tube = new THREE.Mesh(tubeGeom, nMat);
      nucleusGroup.add(tube);
    });
    group.add(nucleusGroup);

    // Dense Antimicrobial Granules (Defensin & Lysozyme)
    const granuleCount = 42;
    const granuleGroup = new THREE.Group();
    const gGeom = new THREE.SphereGeometry(0.035, 10, 10);
    const gMat1 = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const gMat2 = new THREE.MeshBasicMaterial({ color: 0xa3e635 });
    const granules = [];

    for (let i = 0; i < granuleCount; i++) {
      const g = new THREE.Mesh(gGeom, i % 2 === 0 ? gMat1 : gMat2);
      const r = 0.38 + Math.random() * 0.34;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      g.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      granuleGroup.add(g);
      granules.push({
        mesh: g,
        orbitRadius: r,
        orbitSpeed: 0.8 + Math.random() * 1.5,
        theta,
        phi
      });
    }
    group.add(granuleGroup);

    // NETosis Web Rings (Extracellular Trap filaments)
    const netRingGeom = new THREE.RingGeometry(0.9, 0.93, 32);
    const netRingMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const netRing = new THREE.Mesh(netRingGeom, netRingMat);
    netRing.rotation.x = Math.PI / 3;
    group.add(netRing);

    this.cellGroup.add(group);

    this.animators.neutrophil = (time) => {
      // Rotate multi-lobed nucleus slowly
      nucleusGroup.rotation.y = time * 0.4;
      nucleusGroup.rotation.z = Math.sin(time * 0.6) * 0.15;

      // Swirling granules
      granules.forEach((g) => {
        g.theta += g.orbitSpeed * 0.02;
        g.mesh.position.x = g.orbitRadius * Math.sin(g.phi) * Math.cos(g.theta);
        g.mesh.position.z = g.orbitRadius * Math.sin(g.phi) * Math.sin(g.theta);
      });

      // NETosis ring pulsing
      netRing.rotation.z += 0.008;
      const s = 1 + Math.sin(time * 3) * 0.08;
      netRing.scale.set(s, s, s);
    };
  }

  // =========================================================================
  // 3. LIMFOSIT B: Spherical Body with Y-Shaped Antibodies & Orbiting BCR Rings
  // =========================================================================
  buildBCell() {
    const group = new THREE.Group();

    // Spherical Magenta Lymphocyte Body
    const geom = new THREE.SphereGeometry(0.72, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      emissive: 0x701a75,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2
    });
    const membrane = new THREE.Mesh(geom, mat);
    group.add(membrane);

    // Large Round Nucleus (characteristic of lymphocytes)
    const nGeom = new THREE.SphereGeometry(0.48, 24, 24);
    const nMat = new THREE.MeshStandardMaterial({
      color: 0x4a044e,
      emissive: 0x701a75,
      emissiveIntensity: 0.8
    });
    const nucleus = new THREE.Mesh(nGeom, nMat);
    group.add(nucleus);

    // Surface Y-Shaped B-Cell Receptors (BCRs)
    const bcrCount = 28;
    const bcrGroup = new THREE.Group();
    const bcrMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });

    // Helper: Create a single mini Y-shaped antibody receptor
    const createYAntibody = () => {
      const yGroup = new THREE.Group();
      // Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), bcrMat);
      stem.position.y = 0.06;
      yGroup.add(stem);
      // Left Arm
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.09, 8), bcrMat);
      leftArm.position.set(-0.032, 0.14, 0);
      leftArm.rotation.z = Math.PI / 4;
      yGroup.add(leftArm);
      // Right Arm
      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.09, 8), bcrMat);
      rightArm.position.set(0.032, 0.14, 0);
      rightArm.rotation.z = -Math.PI / 4;
      yGroup.add(rightArm);
      return yGroup;
    };

    for (let i = 0; i < bcrCount; i++) {
      const y = createYAntibody();
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.72;

      y.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      y.lookAt(y.position.clone().multiplyScalar(2));
      y.rotateX(Math.PI / 2);
      bcrGroup.add(y);
    }
    group.add(bcrGroup);

    // Orbiting Satellite Antibodies (IgG / IgM) in outer ring
    const orbitSatellites = [];
    const satGroup = new THREE.Group();
    for (let s = 0; s < 6; s++) {
      const sat = createYAntibody();
      sat.scale.set(1.4, 1.4, 1.4);
      satGroup.add(sat);
      orbitSatellites.push({
        mesh: sat,
        baseAngle: (s * Math.PI * 2) / 6,
        radius: 1.15
      });
    }
    group.add(satGroup);

    this.cellGroup.add(group);

    this.animators.b_cell = (time) => {
      // Membrane breathing pulse
      const pulse = 1 + Math.sin(time * 2.2) * 0.03;
      membrane.scale.set(pulse, pulse, pulse);

      // Orbiting antibodies
      orbitSatellites.forEach((sat) => {
        const curAngle = sat.baseAngle + time * 1.2;
        sat.mesh.position.set(Math.cos(curAngle) * sat.radius, Math.sin(time * 2 + sat.baseAngle) * 0.18, Math.sin(curAngle) * sat.radius);
        sat.mesh.rotation.y = curAngle + Math.PI / 2;
        sat.mesh.rotation.z = Math.sin(time * 3) * 0.3;
      });

      // Slowly rotate surface BCRs
      bcrGroup.rotation.y += 0.006;
      bcrGroup.rotation.x += 0.003;
    };
  }

  // =========================================================================
  // 4. LIMFOSIT T SITOTOKSIK (CD8+): Killer Spike Array & Perforin Emitters
  // =========================================================================
  buildTCell() {
    const group = new THREE.Group();

    // Spherical Golden-Amber Lymphocyte Body
    const geom = new THREE.SphereGeometry(0.74, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.78,
      roughness: 0.18
    });
    const membrane = new THREE.Mesh(geom, mat);
    group.add(membrane);

    // Dense Compact Nucleus
    const nGeom = new THREE.SphereGeometry(0.46, 24, 24);
    const nMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      emissive: 0x9a3412,
      emissiveIntensity: 0.8
    });
    const nucleus = new THREE.Mesh(nGeom, nMat);
    group.add(nucleus);

    // Cytotoxic Perforin / Granzyme Core Spikes & CD8 Coreceptors
    const spikeCount = 36;
    const spikeGroup = new THREE.Group();
    const spikeMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

    for (let i = 0; i < spikeCount; i++) {
      const sGeom = new THREE.ConeGeometry(0.038, 0.24, 8);
      sGeom.translate(0, 0.12, 0);
      const spike = new THREE.Mesh(sGeom, spikeMat);

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.74;

      spike.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      spike.lookAt(spike.position.clone().multiplyScalar(2));
      spike.rotateX(Math.PI / 2);
      spikeGroup.add(spike);
    }
    group.add(spikeGroup);

    // Deadly Cytotoxic Target Reticle (Pulsing holographic kill-ring)
    const ringGeom = new THREE.RingGeometry(0.96, 1.02, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const targetRing = new THREE.Mesh(ringGeom, ringMat);
    targetRing.rotation.x = Math.PI / 2;
    group.add(targetRing);

    this.cellGroup.add(group);

    this.animators.t_cell = (time) => {
      // Rapid, lethal spike vibrations
      const sPulse = 1 + Math.sin(time * 4) * 0.05;
      spikeGroup.scale.set(sPulse, sPulse, sPulse);
      spikeGroup.rotation.y += 0.008;

      // Target reticle sweep
      targetRing.rotation.z += 0.015;
      const rPulse = 1 + Math.sin(time * 3.2) * 0.09;
      targetRing.scale.set(rPulse, rPulse, rPulse);
    };
  }

  animate() {
    requestAnimationFrame(this.animate);

    const charSelectModal = document.getElementById('character-select');
    const isVisible = charSelectModal && !charSelectModal.classList.contains('hidden');
    if (!isVisible) return;

    const time = this.clock ? this.clock.getElapsedTime() : performance.now() * 0.001;

    // 1. Update OrbitControls
    if (this.controls) {
      this.controls.update();
    }

    // 2. Spawn Pop Lerp
    if (this.cellGroup && this.cellGroup.scale.x < 1.0) {
      const nextScale = Math.min(1.0, this.cellGroup.scale.x + 0.08);
      this.cellGroup.scale.set(nextScale, nextScale, nextScale);
    }

    // 3. Containment Field Animation
    if (this.containmentRing1) this.containmentRing1.rotation.z += 0.005;
    if (this.containmentRing2) this.containmentRing2.rotation.z -= 0.007;

    // Dust particles slow drift
    if (this.dustParticles) {
      this.dustParticles.rotation.y = time * 0.05;
    }

    // 4. Run Active Cell Animator
    if (this.activeCellId && this.animators[this.activeCellId]) {
      this.animators[this.activeCellId](time);
    }

    // 5. Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
