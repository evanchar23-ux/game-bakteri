/**
 * CinematicIntro3D.js
 * Full 60 FPS Real-time 3D Biological Cinema Dive (Powered by Three.js)
 *
 * Memberikan pengalaman sinematik 3D imersif dan hidup:
 * 1. Hyperspeed Arterial 3D Tunnel Warp (Kamera meluncur menembus lorong pembuluh darah 3D)
 * 2. Hundreds of 3D Biconcave Red Blood Cells (Sel darah merah 3D melayang dan melesat melewati kamera)
 * 3. Terrifying 3D Apex Mutated Virus (Virus 3D organik dengan 38 duri reseptor bioluminescent yang berdenyut & menerjang)
 * 4. Bio-Shockwave & Telemetry Target-Lock (Gelombang kejut benturan 3D & HUD sensor real-time)
 * 5. Hollywood Title Slam & Smooth Menu Transition
 */

import { sound } from '../audio/sound.js';

export class CinematicIntro3D {
  constructor(canvas, onComplete) {
    this.canvas = canvas;
    this.onComplete = onComplete;

    this.isPlaying = false;
    this.isFinished = false;
    this.currentTime = 0;
    this.duration = 9.4; // 9.4 detik petualangan sinematik 3D

    // HUD DOM Elements
    this.hudLayer = document.getElementById('cine-hud-layer');
    this.hudTelemetry = document.getElementById('cine-hud-telemetry');
    this.hudO2 = document.getElementById('cine-hud-o2');
    this.hudO2Bar = document.getElementById('cine-hud-o2-bar');
    this.targetBracket = document.getElementById('cine-target-bracket');
    this.targetLabel = document.getElementById('cine-target-label');
    this.titleSlam = document.getElementById('cine-title-slam');

    // Initialize Three.js Subsystems
    this.initThree();

    window.addEventListener('resize', () => {
      if (this.isPlaying) this.handleResize();
    });
  }

  initThree() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 1. Scene with Deep Atmospheric Biological Fluid Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x180206, 0.016);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 800);
    this.camera.position.set(0, 0, 40);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 4. Dynamic Lighting Rig
    this.ambientLight = new THREE.AmbientLight(0x4a0a14, 1.2);
    this.scene.add(this.ambientLight);

    // Main traveling biological spotlight (illuminates tunnel and objects ahead)
    this.headlight = new THREE.PointLight(0xff2a55, 3.5, 160);
    this.headlight.position.set(0, 0, 30);
    this.scene.add(this.headlight);

    // Bioluminescent Cyan Fill Light
    this.cyanLight = new THREE.PointLight(0x00f2fe, 2.8, 120);
    this.cyanLight.position.set(0, 6, -60);
    this.scene.add(this.cyanLight);

    // Threat Strobe Light (Flashes during breach)
    this.threatLight = new THREE.PointLight(0xff0000, 0, 200);
    this.threatLight.position.set(0, 0, -140);
    this.scene.add(this.threatLight);

    // 5. Build 3D Entities
    this.buildArterialTunnel();
    this.buildRedBloodCells();
    this.buildApexVirus();
    this.buildShockwaves();
  }

  handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // =========================================================================
  // 3D ENTITY BUILDERS
  // =========================================================================

  buildArterialTunnel() {
    const tunnelLength = 480;
    const tunnelRadius = 16;
    const tunnelGeo = new THREE.CylinderGeometry(tunnelRadius, tunnelRadius, tunnelLength, 32, 80, true);
    // Invert normals to view from inside
    tunnelGeo.scale(1, 1, -1);
    tunnelGeo.rotateX(Math.PI / 2);

    // Deform vertices with organic ribbed capillary ridges
    const pos = tunnelGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      const angle = Math.atan2(pos.getY(i), pos.getX(i));
      const bump = Math.sin(z * 0.16) * 1.5 + Math.sin(angle * 7 + z * 0.06) * 0.9;
      const r = Math.sqrt(pos.getX(i) ** 2 + pos.getY(i) ** 2) + bump;
      pos.setX(i, Math.cos(angle) * r);
      pos.setY(i, Math.sin(angle) * r);
    }
    tunnelGeo.computeVertexNormals();

    const tunnelMat = new THREE.MeshStandardMaterial({
      color: 0x3d0710,
      roughness: 0.45,
      metalness: 0.2,
      side: THREE.BackSide,
      emissive: 0x180205,
      emissiveIntensity: 0.5
    });

    this.tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
    this.tunnel.position.z = -tunnelLength / 2 + 60;
    this.scene.add(this.tunnel);
  }

  buildRedBloodCells() {
    // True 3D Biconcave Erythrocyte Geometry
    const rbcGeo = new THREE.SphereGeometry(1.3, 20, 14);
    const pos = rbcGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      let y = pos.getY(i);
      const z = pos.getZ(i);
      const r2 = x * x + z * z;
      y *= 0.35; // squash thickness
      if (r2 < 0.9) {
        y *= (r2 / 0.9) * 0.45 + 0.55; // biconcave dimple indentation
      }
      pos.setY(i, y);
    }
    rbcGeo.computeVertexNormals();

    const rbcMat = new THREE.MeshStandardMaterial({
      color: 0xcc0424,
      roughness: 0.25,
      metalness: 0.1,
      emissive: 0x330006,
      emissiveIntensity: 0.4
    });

    this.rbcPool = [];
    const count = 95;
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(rbcGeo, rbcMat);
      mesh.position.set(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 24,
        -Math.random() * 380 + 30
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      mesh.scale.setScalar(0.75 + Math.random() * 0.6);
      this.scene.add(mesh);

      this.rbcPool.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 2.5,
        rotSpeedY: (Math.random() - 0.5) * 2.8,
        rotSpeedZ: (Math.random() - 0.5) * 2.0,
        speedZ: 24 + Math.random() * 26
      });
    }
  }

  buildApexVirus() {
    this.virusGroup = new THREE.Group();

    // 1. Organic Viral Capsid with Procedural Membrane Lumps
    const coreGeo = new THREE.IcosahedronGeometry(4.8, 3);
    const pos = coreGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const bump = Math.sin(v.x * 2.2) * Math.cos(v.y * 2.2) * Math.sin(v.z * 2.2) * 0.45;
      v.addScaledVector(v.clone().normalize(), bump);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    coreGeo.computeVertexNormals();

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x6e0618,
      roughness: 0.35,
      metalness: 0.25,
      emissive: 0x3d000f,
      emissiveIntensity: 0.8
    });
    this.virusCore = new THREE.Mesh(coreGeo, coreMat);
    this.virusGroup.add(this.virusCore);

    // 2. 3D Spike Glycoproteins (Fibonacci Sphere Distribution)
    const spikeCount = 42;
    const stalkGeo = new THREE.CylinderGeometry(0.2, 0.35, 2.4, 8);
    stalkGeo.translate(0, 1.2, 0);

    const headGeo = new THREE.DodecahedronGeometry(0.52);
    headGeo.translate(0, 2.5, 0);

    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0xff0055,
      roughness: 0.3,
      metalness: 0.1,
      emissive: 0xff0044,
      emissiveIntensity: 0.75
    });

    const headMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      roughness: 0.2,
      metalness: 0.1,
      emissive: 0x00f2fe,
      emissiveIntensity: 1.4
    });

    this.spikes = [];
    for (let i = 0; i < spikeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / spikeCount);
      const theta = Math.sqrt(spikeCount * Math.PI) * phi;

      const dir = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(phi)
      ).normalize();

      const spikeMeshGroup = new THREE.Group();
      const stalk = new THREE.Mesh(stalkGeo, stalkMat);
      const head = new THREE.Mesh(headGeo, headMat);
      spikeMeshGroup.add(stalk);
      spikeMeshGroup.add(head);

      spikeMeshGroup.position.copy(dir.clone().multiplyScalar(4.5));
      spikeMeshGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

      this.virusGroup.add(spikeMeshGroup);
      this.spikes.push({
        group: spikeMeshGroup,
        dir,
        baseScale: 1,
        phase: Math.random() * Math.PI * 2,
        speed: 4.5 + Math.random() * 4.0
      });
    }

    // 3. Smaller Swirling Virions Around Apex Pathogen
    this.satelliteVirions = [];
    const miniCoreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const miniCoreMat = new THREE.MeshStandardMaterial({
      color: 0x990033,
      emissive: 0x550015,
      emissiveIntensity: 0.9
    });
    for (let i = 0; i < 8; i++) {
      const mini = new THREE.Mesh(miniCoreGeo, miniCoreMat);
      mini.position.set(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 20
      );
      this.virusGroup.add(mini);
      this.satelliteVirions.push({
        mesh: mini,
        orbitRadius: 9 + Math.random() * 8,
        orbitSpeed: 1.2 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2
      });
    }

    // Place Virus deep in the arterial tunnel
    this.virusGroup.position.set(0, 0, -185);
    this.scene.add(this.virusGroup);
  }

  buildShockwaves() {
    this.shockwaves = [];
    const ringGeo = new THREE.RingGeometry(0.5, 1.8, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });

    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat.clone());
      ring.position.set(0, 0, -100);
      ring.visible = false;
      this.scene.add(ring);
      this.shockwaves.push({
        mesh: ring,
        active: false,
        scale: 0.1,
        maxScale: 28,
        opacity: 1
      });
    }
  }

  trigger3DShockwave() {
    this.shockwaves.forEach((sw, idx) => {
      setTimeout(() => {
        sw.active = true;
        sw.scale = 0.5;
        sw.opacity = 1;
        sw.mesh.visible = true;
        sw.mesh.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z - 8);
        sw.mesh.material.color.setHex(idx % 2 === 0 ? 0x00f2fe : 0xff0055);
      }, idx * 120);
    });
  }

  // =========================================================================
  // ANIMATION & TIMELINE CONTROLLER
  // =========================================================================

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isFinished = false;
    this.currentTime = 0;

    // Reset Camera & Entities
    this.camera.position.set(0, 0, 40);
    this.camera.rotation.set(0, 0, 0);
    this.virusGroup.position.set(0, 0, -185);

    // Reset HUD
    if (this.hudLayer) this.hudLayer.style.display = 'block';
    if (this.targetBracket) this.targetBracket.classList.add('hidden');
    if (this.titleSlam) this.titleSlam.classList.add('hidden');

    // Trigger Orchestrated Visceral Submerged Audio (Desiran Darah & Monitor ICU)
    sound.init();
    sound.playSubmergedIntroAtmosphere();

    this.lastFrameTime = performance.now();
    this.loop = (now) => {
      if (!this.isPlaying) return;
      const dt = Math.min(0.08, (now - this.lastFrameTime) / 1000);
      this.lastFrameTime = now;

      this.update(dt);
      this.render();

      if (this.currentTime >= this.duration) {
        this.finish();
      } else {
        requestAnimationFrame(this.loop);
      }
    };

    requestAnimationFrame(this.loop);
  }

  update(dt) {
    this.currentTime += dt;
    const t = this.currentTime;

    // --- 1. Real-time Camera Motion & Story Phases ---
    if (t < 3.5) {
      // Phase 1: High-Speed Arterial Capillary Dive (0.0s - 3.5s)
      const p = t / 3.5;
      // Camera dives from z = 40 to z = -75
      this.camera.position.z = 40 - p * 115;
      this.camera.position.x = Math.sin(t * 2.2) * 1.8;
      this.camera.position.y = Math.cos(t * 1.8) * 1.4;
      this.camera.rotation.z = Math.sin(t * 1.4) * 0.14; // Banking motion

      // HUD Telemetry
      if (this.hudTelemetry) {
        this.hudTelemetry.innerText = `ARTERI PULMONALIS // LAJU: ${(48.2 + Math.sin(t * 4) * 4.2).toFixed(1)} CM/S`;
      }
      if (this.hudO2) this.hudO2.innerText = '98.5%';
      if (this.hudO2Bar) {
        this.hudO2Bar.style.width = '98.5%';
        this.hudO2Bar.style.background = 'linear-gradient(90deg, #00f2fe, #00ff88)';
      }
      if (this.targetBracket) this.targetBracket.classList.add('hidden');

      this.threatLight.intensity = 0;
    } else if (t >= 3.5 && t < 6.6) {
      // Phase 2: Apex Mutated Virus Looming & Aggressive Lunge (3.5s - 6.6s)
      const p = (t - 3.5) / 3.1;
      // Camera dives closer to z = -140
      this.camera.position.z = -75 - p * 60;
      this.camera.position.x = Math.sin(t * 4.5) * (0.8 + p * 1.2);
      this.camera.position.y = Math.cos(t * 3.8) * (0.8 + p * 1.2);

      // At t = 5.2s, the Apex Virus accelerates forward to strike the camera!
      if (t >= 5.2) {
        const lungeProgress = (t - 5.2) / 1.4;
        this.virusGroup.position.z = -185 + lungeProgress * 55; // lunges from -185 to -130
        this.camera.position.x += (Math.random() - 0.5) * 0.6; // camera jitter
        this.camera.position.y += (Math.random() - 0.5) * 0.6;
        this.threatLight.intensity = Math.sin(t * 24) > 0 ? 4.5 : 0; // Red emergency strobe
      } else {
        this.virusGroup.position.z = -185;
        this.threatLight.intensity = 0;
      }

      // HUD Target Lock onto Virus
      if (this.targetBracket) {
        this.targetBracket.classList.remove('hidden');
        this.targetBracket.style.display = 'block';
        if (this.targetLabel) {
          this.targetLabel.innerText = `ANCAMAN BIOHAZARD MUTAN: APEX VIRUS LEVEL V`;
        }
      }
      if (this.hudTelemetry) {
        this.hudTelemetry.innerText = `PERINGATAN: PATOGEN MUTAN MEROBEK MEMBRAN!`;
      }
      const o2Drop = Math.max(74, 98.5 - p * 24.5);
      if (this.hudO2) this.hudO2.innerText = `${o2Drop.toFixed(1)}%`;
      if (this.hudO2Bar) {
        this.hudO2Bar.style.width = `${o2Drop}%`;
        this.hudO2Bar.style.background = '#ff0055';
      }
    } else if (t >= 6.6 && t < 7.8) {
      // Phase 3: Biohazard Shockwave Impact & Retaliation (6.6s - 7.8s)
      if (this.targetBracket) {
        this.targetBracket.classList.add('hidden');
        this.targetBracket.style.display = 'none';
      }
      if (this.hudTelemetry) {
        this.hudTelemetry.innerText = `[DEKRIT IMUNOLOGIS] MEMBRAN PECAH! AKTIVASI FAGOSITOSIS!`;
      }
      if (this.hudO2) this.hudO2.innerText = '89.2%';

      // Trigger 3D Shockwave expansion on camera
      if (!this.shockwaveTriggered) {
        this.shockwaveTriggered = true;
        this.trigger3DShockwave();
      }

      // Heavy impact camera shake
      this.camera.position.x += (Math.random() - 0.5) * 1.5;
      this.camera.position.y += (Math.random() - 0.5) * 1.5;
      this.camera.rotation.z += (Math.random() - 0.5) * 0.08;
      this.threatLight.intensity = 2.5;
    } else {
      // Phase 4: Hollywood Title Slam & Stabilization (7.8s - 9.4s)
      if (this.targetBracket) {
        this.targetBracket.classList.add('hidden');
        this.targetBracket.style.display = 'none';
      }
      if (this.titleSlam) {
        this.titleSlam.classList.remove('hidden');
        this.titleSlam.style.display = 'flex';
      }
      if (this.hudTelemetry) {
        this.hudTelemetry.innerText = `SISTEM DEPLOYMENT SIAP // MEMUAT PROTOKOL TEMPUR...`;
      }
      this.threatLight.intensity = 0;

      // Gentle drift as dust settles
      this.camera.position.x *= 0.95;
      this.camera.position.y *= 0.95;
      this.camera.rotation.z *= 0.95;
    }

    // Synchronize Headlight with Camera
    this.headlight.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z + 5
    );

    // --- 2. Update 3D Red Blood Cells ---
    for (let r of this.rbcPool) {
      r.mesh.rotation.x += r.rotSpeedX * dt;
      r.mesh.rotation.y += r.rotSpeedY * dt;
      r.mesh.rotation.z += r.rotSpeedZ * dt;

      // Move forward towards and past camera
      r.mesh.position.z += r.speedZ * dt;

      // Recycle to distance ahead of camera
      if (r.mesh.position.z > this.camera.position.z + 20) {
        r.mesh.position.z = this.camera.position.z - 280;
        r.mesh.position.x = (Math.random() - 0.5) * 26;
        r.mesh.position.y = (Math.random() - 0.5) * 26;
      }
    }

    // --- 3. Update Apex Virus Rotation & Organic Spikes Twitch ---
    this.virusGroup.rotation.y += dt * 0.85;
    this.virusGroup.rotation.x += dt * 0.55;

    // Organic pulsating capsid
    const pulseScale = 1 + Math.sin(t * 6) * 0.04;
    this.virusCore.scale.setScalar(pulseScale);

    // Spikes twitching and flexing
    for (let s of this.spikes) {
      const spikeFlex = 1 + Math.sin(t * s.speed + s.phase) * 0.18;
      s.group.scale.set(1, spikeFlex, 1);
    }

    // Satellite virions orbiting
    for (let v of this.satelliteVirions) {
      v.angle += v.orbitSpeed * dt;
      v.mesh.position.x = Math.cos(v.angle) * v.orbitRadius;
      v.mesh.position.y = Math.sin(v.angle) * v.orbitRadius * 0.75;
      v.mesh.rotation.x += dt * 2;
    }

    // --- 4. Update 3D Shockwaves ---
    for (let sw of this.shockwaves) {
      if (!sw.active) continue;
      sw.scale += dt * 32;
      sw.mesh.scale.setScalar(sw.scale);
      sw.opacity -= dt * 1.4;
      sw.mesh.material.opacity = Math.max(0, sw.opacity);
      if (sw.opacity <= 0) {
        sw.active = false;
        sw.mesh.visible = false;
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  finish() {
    if (this.isFinished) return;
    this.isFinished = true;
    this.isPlaying = false;

    // Stop intro sound sequence
    sound.stopSubmergedIntroAtmosphere();

    // Hide intro HUD and title elements cleanly
    if (this.hudLayer) this.hudLayer.style.display = 'none';
    if (this.targetBracket) this.targetBracket.classList.add('hidden');
    if (this.titleSlam) this.titleSlam.classList.add('hidden');

    if (this.onComplete) {
      const cb = this.onComplete;
      this.onComplete = null;
      cb();
    }
  }
}
