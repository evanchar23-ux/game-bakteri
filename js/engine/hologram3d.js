/**
 * hologram3d.js
 * Real True-3D Holographic Human Anatomical Body Scanner
 * Powered by Three.js WebGL with Full 360-Degree Multi-Axis OrbitControls
 */

export class Hologram3DViewer {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('mannequin-container');
    this.canvas = options.canvas || document.getElementById('hologram3dCanvas');
    this.angleDisplay = options.angleDisplay || document.getElementById('holo-angle-display');

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.humanGroup = null;
    this.humanModelWrapper = null;

    this.organs = {};
    this.clock = null;
    this.isInitialized = false;
    this.isAutoOrbit = true;

    this.init();
  }

  init() {
    if (!window.THREE) {
      console.warn('Three.js not loaded. Retrying in 100ms...');
      setTimeout(() => this.init(), 100);
      return;
    }

    if (this.isInitialized || !this.container) return;
    this.isInitialized = true;

    const width = this.container.clientWidth || 340;
    const height = this.container.clientHeight || 460;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0.95, 2.75);

    // 3. WebGL Renderer with 100% Transparent Alpha
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // 100% TRANSPARENT BACKGROUND (No Black Box)

    // 4. Clock
    this.clock = new THREE.Clock();

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0x00f2fe, 0.9);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00ffff, 1.5);
    keyLight.position.set(2, 3, 3);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0088ff, 1.8);
    rimLight.position.set(-2, 2, -3);
    this.scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x00f2fe, 1.4, 4);
    bottomGlow.position.set(0, 0.1, 0);
    this.scene.add(bottomGlow);

    // 6. Root Human Group
    this.humanGroup = new THREE.Group();
    this.scene.add(this.humanGroup);

    // 7. Holographic Pedestal & Laser Scan Ring
    this.createHoloPedestal();

    // 8. Internal 3D Anatomical Organs
    this.createInternalOrgans();

    // 9. Load Authentic 3D Human Body Model
    this.loadHumanModel();

    // 10. Orbit Controls (Full Multi-Axis Pitch, Yaw, Zoom)
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.target.set(0, 0.95, 0);
      this.controls.minDistance = 1.2;
      this.controls.maxDistance = 4.2;
      this.controls.minPolarAngle = Math.PI * 0.10; // Pitch up (inspect from top)
      this.controls.maxPolarAngle = Math.PI * 0.90; // Pitch down (inspect from bottom)
      this.controls.autoRotate = this.isAutoOrbit;
      this.controls.autoRotateSpeed = 1.75;
      this.controls.enablePan = false;

      // User manual interaction pauses auto-rotate
      this.controls.addEventListener('start', () => {
        if (this.isAutoOrbit) {
          this.setAutoOrbit(false);
        }
      });
    }

    // 11. Resize Listener
    window.addEventListener('resize', () => this.handleResize());

    // 12. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 340;
    const height = this.container.clientHeight || 460;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  createHoloPedestal() {
    // Holographic Circular Platform Rings
    const ringGeom1 = new THREE.RingGeometry(0.55, 0.58, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.02;
    this.humanGroup.add(ring1);
    this.pedestalRing1 = ring1;

    const ringGeom2 = new THREE.RingGeometry(0.72, 0.74, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00a8ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.01;
    this.humanGroup.add(ring2);
    this.pedestalRing2 = ring2;

    // Polar Grid Disc under feet
    const gridHelper = new THREE.PolarGridHelper(0.75, 8, 4, 32, 0x00f2fe, 0x005577);
    gridHelper.position.y = 0.015;
    this.humanGroup.add(gridHelper);

    // Sleek Holographic Laser Scanning Ring (Sweeps up and down the body)
    const scanRingGeom = new THREE.RingGeometry(0.38, 0.41, 48);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.scanRing = new THREE.Mesh(scanRingGeom, scanRingMat);
    this.scanRing.rotation.x = -Math.PI / 2;
    this.scanRing.position.set(0, 0.95, 0);
    this.humanGroup.add(this.scanRing);
  }

  createInternalOrgans() {
    // 1. PULMO / LUNGS (Two anatomical lobes in thorax)
    const lungGroup = new THREE.Group();
    lungGroup.position.set(0, 1.22, 0.02);

    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00b4d8,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.75,
      roughness: 0.3
    });

    const leftLungGeom = new THREE.SphereGeometry(0.08, 16, 16);
    leftLungGeom.scale(0.8, 1.45, 0.75);
    const leftLung = new THREE.Mesh(leftLungGeom, lungMat);
    leftLung.position.set(-0.075, 0, 0);
    leftLung.rotation.z = -0.15;
    lungGroup.add(leftLung);

    const rightLungGeom = new THREE.SphereGeometry(0.08, 16, 16);
    rightLungGeom.scale(0.8, 1.45, 0.75);
    const rightLung = new THREE.Mesh(rightLungGeom, lungMat);
    rightLung.position.set(0.075, 0, 0);
    rightLung.rotation.z = 0.15;
    lungGroup.add(rightLung);

    this.humanGroup.add(lungGroup);
    this.organs.lungs = lungGroup;

    // 2. VASKULAR / HEART (Pulsing cardiac organ in upper left chest)
    const heartGroup = new THREE.Group();
    heartGroup.position.set(0.04, 1.23, 0.05);

    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xff1744,
      emissive: 0xff0055,
      emissiveIntensity: 0.95,
      transparent: true,
      opacity: 0.85
    });
    const heartGeom = new THREE.SphereGeometry(0.05, 16, 16);
    heartGeom.scale(0.85, 1.1, 0.85);
    this.heartMesh = new THREE.Mesh(heartGeom, heartMat);
    heartGroup.add(this.heartMesh);

    // Heartbeat point light
    this.heartLight = new THREE.PointLight(0xff0055, 1.2, 0.8);
    heartGroup.add(this.heartLight);

    this.humanGroup.add(heartGroup);
    this.organs.bloodstream = heartGroup;

    // 3. USUS / DIGESTIVE GUT (Coiled luminous intestinal organ in abdomen)
    const gutGroup = new THREE.Group();
    gutGroup.position.set(0, 0.96, 0.04);

    const gutMat = new THREE.MeshStandardMaterial({
      color: 0x00f5d4,
      emissive: 0x00bbf9,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 4; i++) {
      const torusGeom = new THREE.TorusGeometry(0.058 - i * 0.007, 0.02, 10, 24);
      const torus = new THREE.Mesh(torusGeom, gutMat);
      torus.position.set((i % 2 === 0 ? 0.015 : -0.015), (i - 1.5) * 0.026, (i % 2) * 0.01);
      torus.rotation.x = Math.PI / 2.3;
      gutGroup.add(torus);
    }

    this.humanGroup.add(gutGroup);
    this.organs.gut = gutGroup;

    // 4. DERMIS / SKIN (Right forearm biological telemetry beacon)
    const dermisGroup = new THREE.Group();
    dermisGroup.position.set(-0.28, 1.02, 0.04);

    const dermisRingGeom = new THREE.RingGeometry(0.022, 0.038, 24);
    const dermisRingMat = new THREE.MeshBasicMaterial({
      color: 0xff6b35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    this.dermisBeacon = new THREE.Mesh(dermisRingGeom, dermisRingMat);
    dermisGroup.add(this.dermisBeacon);

    this.humanGroup.add(dermisGroup);
    this.organs.skin = dermisGroup;

    // 5. CEREBRAL BRAIN (Cranium)
    const brainGeom = new THREE.SphereGeometry(0.07, 16, 16);
    brainGeom.scale(0.85, 0.95, 1.05);
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0x80d8ff,
      emissive: 0x0091ea,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.65,
      wireframe: true
    });
    const brainMesh = new THREE.Mesh(brainGeom, brainMat);
    brainMesh.position.set(0, 1.58, 0.01);
    this.humanGroup.add(brainMesh);

    // 6. 3D VERTEBRAL SPINE (Back Column)
    const spineGroup = new THREE.Group();
    const spineMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.6
    });
    for (let v = 0; v < 14; v++) {
      const vertGeom = new THREE.CylinderGeometry(0.018, 0.022, 0.02, 10);
      const vertebra = new THREE.Mesh(vertGeom, spineMat);
      vertebra.position.set(0, 0.92 + v * 0.036, -0.045);
      spineGroup.add(vertebra);
    }
    this.humanGroup.add(spineGroup);

    // 7. 3D HOLOGRAPHIC RIBCAGE (Thoracic Cage)
    const ribGroup = new THREE.Group();
    const ribMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.4
    });
    for (let r = 0; r < 5; r++) {
      const ribRadius = 0.11 + (r < 3 ? r * 0.01 : (5 - r) * 0.01);
      const ribGeom = new THREE.TorusGeometry(ribRadius, 0.006, 6, 24, Math.PI * 1.6);
      const rib = new THREE.Mesh(ribGeom, ribMat);
      rib.position.set(0, 1.14 + r * 0.042, -0.01);
      rib.rotation.x = Math.PI / 2 + 0.12;
      rib.rotation.z = Math.PI * 0.2;
      ribGroup.add(rib);
    }
    this.humanGroup.add(ribGroup);
  }

  changeModel(modelUrl, targetHeight) {
    if (this.humanModelWrapper) {
      this.humanGroup.remove(this.humanModelWrapper);
      this.humanModelWrapper = null;
    }

    // Group and scale internal organs proportionally
    if (!this.internalOrgansGroup) {
      this.internalOrgansGroup = new THREE.Group();
      const childrenToMove = [];
      this.humanGroup.children.forEach(c => {
        if (c !== this.humanModelWrapper) childrenToMove.push(c);
      });
      childrenToMove.forEach(c => this.internalOrgansGroup.add(c));
      this.humanGroup.add(this.internalOrgansGroup);
    }
    const ratio = targetHeight / 1.75;
    this.internalOrgansGroup.scale.set(ratio, ratio, ratio);

    this.loadHumanModel(modelUrl, targetHeight);
  }

  loadHumanModel(modelUrl = 'assets/human_model.glb', targetHeight = 1.75) {
    if (!THREE.GLTFLoader) {
      return;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Compute precise bounding box from meshes only
        const box = new THREE.Box3();
        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeBoundingBox();
            const childBox = child.geometry.boundingBox.clone();
            childBox.applyMatrix4(child.matrixWorld);
            box.union(childBox);
          }
        });
        
        if (box.isEmpty()) {
           box.setFromObject(model);
        }

        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const wrapper = new THREE.Group();
        wrapper.add(model);

        // Center on X and Z, stand on ground Y=0
        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -box.min.y;

        const actualHeight = size.y > 0.1 ? size.y : 1.8;
        const scale = targetHeight / actualHeight;
        wrapper.scale.set(scale, scale, scale);

        // Apply Translucent Cyber-Holographic Shader Material
        const holoMat = new THREE.MeshStandardMaterial({
          color: 0x00d2fe,
          emissive: 0x004466,
          emissiveIntensity: 0.45,
          transparent: true,
          opacity: 0.38,
          roughness: 0.2,
          metalness: 0.7,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        model.traverse((child) => {
          if (child.isMesh) {
            // Hide internal mouth/teeth meshes for clean anatomy silhouette
            if (child.name && child.name.toLowerCase().includes('teeth')) {
              child.visible = false;
              return;
            }

            const mat = holoMat.clone();
            if (child.isSkinnedMesh) {
              mat.skinning = true;
            }
            child.material = mat;
          }
        });

        this.humanGroup.add(wrapper);
        this.humanModelWrapper = wrapper;
      },
      undefined,
      (err) => {
        console.warn('GLTF humanoid overlay load note:', err);
      }
    );
  }

  rotateBy(deltaYawDeg, deltaPitchDeg = 0) {
    if (!this.controls) return;
    this.setAutoOrbit(false);

    const radY = (deltaYawDeg * Math.PI) / 180;
    const radX = (deltaPitchDeg * Math.PI) / 180;

    // Rotate camera spherical coords
    const offset = this.camera.position.clone().sub(this.controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);

    spherical.theta += radY;
    spherical.phi = Math.max(this.controls.minPolarAngle, Math.min(this.controls.maxPolarAngle, spherical.phi - radX));

    offset.setFromSpherical(spherical);
    this.camera.position.copy(this.controls.target).add(offset);
    this.camera.lookAt(this.controls.target);
    this.controls.update();
  }

  resetView() {
    if (!this.controls) return;
    this.setAutoOrbit(false);
    this.camera.position.set(0, 0.95, 2.75);
    this.controls.target.set(0, 0.95, 0);
    this.controls.update();
  }

  setAutoOrbit(enabled) {
    this.isAutoOrbit = enabled;
    if (this.controls) {
      this.controls.autoRotate = enabled;
    }
    const btn = document.getElementById('btn-holo-auto-orbit');
    if (btn) {
      if (enabled) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  updateHotspotsProjection() {
    if (!this.camera || !this.container) return;
    const width = 340;  // SVG coordinate system width
    const height = 600; // SVG coordinate system height

    const tempV = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);

    Object.entries(this.organs).forEach(([organKey, obj3d]) => {
      const node = document.getElementById(`hotspot-${organKey}`);
      if (!node) return;

      obj3d.getWorldPosition(tempV);

      // Vector from camera to organ
      const toOrgan = tempV.clone().sub(this.camera.position).normalize();
      const dot = toOrgan.dot(camDir);

      // Project 3D vector to Normalized Device Coordinates (-1 to +1)
      tempV.project(this.camera);

      // Convert NDC to SVG viewBox (0 to 340, 0 to 600)
      const screenX = (tempV.x * 0.5 + 0.5) * width;
      const screenY = (-tempV.y * 0.5 + 0.5) * height;

      node.setAttribute('transform', `translate(${screenX.toFixed(1)}, ${screenY.toFixed(1)})`);

      // Depth Occlusion: when organ is on backside of the 3D model
      if (tempV.z > 0.98 || dot < 0.2) {
        node.style.opacity = '0.25';
        node.style.filter = 'brightness(0.5) grayscale(0.7)';
      } else {
        node.style.opacity = '1';
        node.style.filter = 'none';
      }
    });

    // Update telemetry angle readout
    if (this.angleDisplay && this.controls) {
      const offset = this.camera.position.clone().sub(this.controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);

      let yawDeg = Math.round((spherical.theta * 180) / Math.PI) % 360;
      if (yawDeg < 0) yawDeg += 360;

      const pitchDeg = Math.round(90 - (spherical.phi * 180) / Math.PI);

      let viewDesc = 'DEPAN';
      if (yawDeg >= 315 || yawDeg < 45) viewDesc = 'ANTERIOR (DEPAN)';
      else if (yawDeg >= 45 && yawDeg < 135) viewDesc = 'LATERAL KANAN';
      else if (yawDeg >= 135 && yawDeg < 225) viewDesc = 'POSTERIOR (PUNGGUNG)';
      else viewDesc = 'LATERAL KIRI';

      this.angleDisplay.innerText = `3D: ${yawDeg}° (${viewDesc}) | PITCH: ${pitchDeg}°`;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const organSelectModal = document.getElementById('organ-select');
    const isVisible = organSelectModal && !organSelectModal.classList.contains('hidden');
    if (!isVisible) return;

    const time = this.clock ? this.clock.getElapsedTime() : performance.now() * 0.001;

    // 1. Update OrbitControls
    if (this.controls) {
      this.controls.update();
    }

    // 2. Beating Heart animation
    if (this.heartMesh) {
      const beat = 1 + Math.pow(Math.sin(time * 3.8), 6) * 0.22;
      this.heartMesh.scale.set(0.85 * beat, 1.1 * beat, 0.85 * beat);
      if (this.heartLight) {
        this.heartLight.intensity = 0.8 + beat * 0.8;
      }
    }

    // 3. Rotating Pedestal Rings
    if (this.pedestalRing1) this.pedestalRing1.rotation.z += 0.008;
    if (this.pedestalRing2) this.pedestalRing2.rotation.z -= 0.005;

    // 4. Subtle Laser Scan Ring Sweep (No thick horizontal plank)
    if (this.scanRing) {
      this.scanRing.position.y = 0.15 + (Math.sin(time * 1.8) * 0.5 + 0.5) * 1.55;
    }

    // 5. Pulsing Dermis Beacon
    if (this.dermisBeacon) {
      const s = 1 + Math.sin(time * 4) * 0.15;
      this.dermisBeacon.scale.set(s, s, s);
    }

    // 6. Project 3D Organs to SVG 2D Hotspots
    this.updateHotspotsProjection();

    // 7. Render 3D WebGL Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
