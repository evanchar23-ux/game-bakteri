/**
 * menuBioSimulation.js
 * In-Vivo Bioluminescent Micro-Organism Swarm Engine
 * Animasi dinamis virus & bakteri melayang, berenang, dan berkeliaran di background Main Menu.
 */

export class MenuBioSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.entities = [];
    this.dustParticles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mouse = { x: -9999, y: -9999, active: false, vx: 0, vy: 0, prevX: 0, prevY: 0 };
    this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.time = 0;
    this.isRunning = false;

    this.initCanvas();
    this.initEntities();
    this.initEvents();
  }

  initCanvas() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  initEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
      this.mouse.vx = e.clientX - this.mouse.prevX;
      this.mouse.vy = e.clientY - this.mouse.prevY;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;

      // Parallax target
      this.parallax.targetX = (e.clientX / this.width - 0.5) * 24;
      this.parallax.targetY = (e.clientY / this.height - 0.5) * 20;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.parallax.targetX = 0;
      this.parallax.targetY = 0;
    });
  }

  initEntities() {
    this.entities = [];
    this.dustParticles = [];

    // 1. Ambient microscopic fluid dust (depth bokeh)
    const dustCount = 50;
    for (let i = 0; i < dustCount; i++) {
      this.dustParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 1 + Math.random() * 2.5,
        depth: 0.2 + Math.random() * 0.9,
        vx: (Math.random() - 0.5) * 12,
        vy: -4 - Math.random() * 14,
        alpha: 0.15 + Math.random() * 0.35,
        pulseSpeed: 1 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? 'rgba(47, 231, 200,' : 'rgba(255, 61, 120,'
      });
    }

    // 2. Swarm of Microscopic Organisms (Viruses & Bacteria)
    const organismTypes = [
      'coronavirus',
      'bacteriophage',
      'bacillus',
      'spirillum',
      'streptococcus',
      'staphylococcus',
      'influenza'
    ];

    const totalCreatures = 32;
    for (let i = 0; i < totalCreatures; i++) {
      const type = organismTypes[i % organismTypes.length];
      this.entities.push(this.createOrganism(type));
    }
  }

  createOrganism(type, startOutside = false) {
    const depth = 0.45 + Math.random() * 0.75; // 0.45 (distant) to 1.2 (crisp foreground)
    const angle = Math.random() * Math.PI * 2;
    const speed = (18 + Math.random() * 28) * (0.6 + depth * 0.4);

    let x = Math.random() * this.width;
    let y = Math.random() * this.height;

    if (startOutside) {
      // Spawn just beyond viewport
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { x = Math.random() * this.width; y = -60; }
      else if (edge === 1) { x = this.width + 60; y = Math.random() * this.height; }
      else if (edge === 2) { x = Math.random() * this.width; y = this.height + 60; }
      else { x = -60; y = Math.random() * this.height; }
    }

    return {
      type,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      speed,
      targetAngle: angle,
      rotation: angle,
      rotSpeed: (Math.random() - 0.5) * 0.8,
      depth,
      scale: (0.7 + depth * 0.5),
      pulsePhase: Math.random() * Math.PI * 2,
      wigglePhase: Math.random() * Math.PI * 2,
      wanderTimer: Math.random() * 3,
      alpha: 0.35 + depth * 0.5,
      // Flagella points history for bacilli/spirilla
      tailHistory: []
    };
  }

  update(dt) {
    this.time += dt;

    // Smooth parallax lerp
    this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
    this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

    // Update ambient dust particles
    for (const d of this.dustParticles) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;

      if (d.x < -20) d.x = this.width + 20;
      if (d.x > this.width + 20) d.x = -20;
      if (d.y < -20) d.y = this.height + 20;
      if (d.y > this.height + 20) d.y = -20;
    }

    // Update organism movements
    const padding = 80;
    for (const org of this.entities) {
      org.pulsePhase += dt * 2.2;
      org.wigglePhase += dt * 5.5;
      org.rotation += org.rotSpeed * dt;
      org.wanderTimer -= dt;

      // Autonomous gentle wandering
      if (org.wanderTimer <= 0) {
        org.wanderTimer = 2 + Math.random() * 3.5;
        org.targetAngle += (Math.random() - 0.5) * 1.6;
      }

      // Smooth turn towards target angle
      const curAngle = Math.atan2(org.vy, org.vx);
      let angleDiff = org.targetAngle - curAngle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      const steerAngle = curAngle + angleDiff * Math.min(dt * 1.5, 1);
      org.vx = Math.cos(steerAngle) * org.speed;
      org.vy = Math.sin(steerAngle) * org.speed;

      // Interactive fluid push away from mouse
      if (this.mouse.active) {
        const dx = org.x - this.mouse.x;
        const dy = org.y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        const avoidDist = 180;

        if (distSq < avoidDist * avoidDist && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / avoidDist) * 160 * org.depth;
          const nx = dx / dist;
          const ny = dy / dist;

          // Tangential swirl + outward repulsion
          org.vx += (nx * 1.2 - ny * 0.6) * force * dt;
          org.vy += (ny * 1.2 + nx * 0.6) * force * dt;
        }
      }

      // Move organism
      org.x += org.vx * dt;
      org.y += org.vy * dt;

      // Wrap-around screen bounds
      if (org.x < -padding) org.x = this.width + padding;
      if (org.x > this.width + padding) org.x = -padding;
      if (org.y < -padding) org.y = this.height + padding;
      if (org.y > this.height + padding) org.y = -padding;
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render ambient bio-dust particles
    for (const d of this.dustParticles) {
      const px = d.x + this.parallax.x * d.depth;
      const py = d.y + this.parallax.y * d.depth;
      const pulseAlpha = d.alpha * (0.7 + Math.sin(this.time * d.pulseSpeed) * 0.3);

      ctx.fillStyle = `${d.color} ${pulseAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, d.r * d.depth, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sort organisms by depth for natural depth-of-field layering
    this.entities.sort((a, b) => a.depth - b.depth);

    // 2. Render each organism
    for (const org of this.entities) {
      const renderX = org.x + this.parallax.x * org.depth;
      const renderY = org.y + this.parallax.y * org.depth;

      ctx.save();
      ctx.translate(renderX, renderY);
      ctx.scale(org.scale, org.scale);
      ctx.globalAlpha = org.alpha;

      // Glow intensity tailored to depth
      if (org.depth > 0.8) {
        ctx.shadowBlur = 14 * org.depth;
      } else {
        ctx.shadowBlur = 0;
      }

      switch (org.type) {
        case 'coronavirus':
          this.drawCoronavirus(ctx, org);
          break;
        case 'influenza':
          this.drawInfluenza(ctx, org);
          break;
        case 'bacteriophage':
          this.drawBacteriophage(ctx, org);
          break;
        case 'bacillus':
          this.drawBacillus(ctx, org);
          break;
        case 'spirillum':
          this.drawSpirillum(ctx, org);
          break;
        case 'streptococcus':
          this.drawStreptococcus(ctx, org);
          break;
        case 'staphylococcus':
          this.drawStaphylococcus(ctx, org);
          break;
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     INDIVIDUAL ORGANISM RENDERERS
     ========================================================================== */

  // 1. Coronavirus (Spiked Crown Spherical Virion)
  drawCoronavirus(ctx, org) {
    const baseR = 18;
    const pulse = 1 + Math.sin(org.pulsePhase) * 0.05;
    const r = baseR * pulse;

    ctx.rotate(org.rotation);
    ctx.shadowColor = '#ff3d78';

    // Spikes (12 radiating club glycoproteins)
    const spikeCount = 12;
    for (let i = 0; i < spikeCount; i++) {
      const ang = (i / spikeCount) * Math.PI * 2;
      const sx = Math.cos(ang) * r;
      const sy = Math.sin(ang) * r;
      const spikeLen = 8;
      const tipX = Math.cos(ang) * (r + spikeLen);
      const tipY = Math.sin(ang) * (r + spikeLen);

      // Spike stem
      ctx.strokeStyle = '#ff3d78';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // Spike bulbous crown head (trimer)
      ctx.fillStyle = '#ffa6c0';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer viral envelope
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    grad.addColorStop(0, '#ffa6c0');
    grad.addColorStop(0.65, '#ff3d78');
    grad.addColorStop(1, '#9b1b42');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Internal coiled RNA genome
    ctx.strokeStyle = 'rgba(255, 240, 245, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.45, 0.4, Math.PI * 1.7);
    ctx.stroke();
  }

  // 2. Influenza A (HA & NA Spiked Spherical Virion)
  drawInfluenza(ctx, org) {
    const baseR = 15;
    const pulse = 1 + Math.cos(org.pulsePhase * 0.9) * 0.04;
    const r = baseR * pulse;

    ctx.rotate(org.rotation);
    ctx.shadowColor = '#ffb44d';

    // Alternating HA (pointed) and NA (mushroom) spikes
    const spikeCount = 10;
    for (let i = 0; i < spikeCount; i++) {
      const ang = (i / spikeCount) * Math.PI * 2;
      const tipR = r + (i % 2 === 0 ? 7 : 5);
      const tipX = Math.cos(ang) * tipR;
      const tipY = Math.sin(ang) * tipR;

      ctx.strokeStyle = i % 2 === 0 ? '#ffb44d' : '#ff4b72';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#ff758f';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Envelope
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    grad.addColorStop(0, '#ffe8b3');
    grad.addColorStop(0.7, '#ffaa00');
    grad.addColorStop(1, '#a66a00');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Bacteriophage (T4 Lunar Lander Virus)
  drawBacteriophage(ctx, org) {
    const moveAngle = Math.atan2(org.vy, org.vx) + Math.PI / 2;
    ctx.rotate(moveAngle);
    ctx.shadowColor = '#2fe7c8';

    // Icosahedral Head (Hexagonal diamond polygon)
    const headW = 12;
    const headH = 14;
    ctx.fillStyle = 'rgba(47, 231, 200, 0.3)';
    ctx.strokeStyle = '#2fe7c8';
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    ctx.moveTo(0, -headH - 10);
    ctx.lineTo(headW, -headH / 2 - 10);
    ctx.lineTo(headW * 0.7, -10);
    ctx.lineTo(0, -8);
    ctx.lineTo(-headW * 0.7, -10);
    ctx.lineTo(-headW, -headH / 2 - 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing DNA capsule core
    ctx.fillStyle = '#00ffc4';
    ctx.beginPath();
    ctx.arc(0, -headH / 2 - 10, 3, 0, Math.PI * 2);
    ctx.fill();

    // Contractile Tail Sheath (Neck)
    ctx.strokeStyle = '#2fe7c8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 6);
    ctx.stroke();

    // Baseplate
    ctx.fillStyle = '#0f4a44';
    ctx.fillRect(-4, 6, 8, 3);
    ctx.strokeRect(-4, 6, 8, 3);

    // Flexing Tail Fibers (4-6 spider legs waving)
    const legWiggle = Math.sin(org.wigglePhase) * 3;
    const legPoints = [
      [-14, 18 + legWiggle, -6, 10],
      [-18, 14 - legWiggle, -4, 8],
      [14, 18 - legWiggle, 6, 10],
      [18, 14 + legWiggle, 4, 8]
    ];

    ctx.lineWidth = 1.2;
    for (const [lx, ly, kx, ky] of legPoints) {
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(kx, ky);
      ctx.lineTo(lx, ly);
      ctx.stroke();
    }
  }

  // 4. Bacillus (Rod / Capsule Bacteria with Wavy Flagella)
  drawBacillus(ctx, org) {
    const moveAngle = Math.atan2(org.vy, org.vx);
    ctx.rotate(moveAngle);
    ctx.shadowColor = '#2fe7c8';

    const length = 28;
    const width = 13;

    // Outer capsule layer
    ctx.fillStyle = 'rgba(47, 231, 200, 0.2)';
    ctx.strokeStyle = '#2fe7c8';
    ctx.lineWidth = 1.6;

    this.drawPill(ctx, -length / 2, -width / 2, length, width);
    ctx.fill();
    ctx.stroke();

    // Peptidoglycan inner border
    ctx.fillStyle = 'rgba(15, 74, 68, 0.6)';
    this.drawPill(ctx, -length / 2 + 2, -width / 2 + 2, length - 4, width - 4);
    ctx.fill();

    // Nucleoid DNA inside
    ctx.strokeStyle = '#8b6bff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, -1);
    ctx.quadraticCurveTo(0, 3, 6, -1);
    ctx.stroke();

    // Wavy trailing flagella (propulsion filaments at rear pole)
    const flagellaCount = 3;
    for (let f = 0; f < flagellaCount; f++) {
      const offsetY = (f - 1) * 3.5;
      ctx.strokeStyle = 'rgba(47, 231, 200, 0.7)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-length / 2, offsetY);

      const segments = 6;
      const segLen = 5;
      for (let s = 1; s <= segments; s++) {
        const px = -length / 2 - s * segLen;
        const wave = Math.sin(org.wigglePhase * 1.2 - s * 0.8 + f * 1.4) * (2.5 + s * 0.8);
        ctx.lineTo(px, offsetY + wave);
      }
      ctx.stroke();
    }
  }

  // 5. Spirillum (Spiral / Spirochete Undulating Bacteria)
  drawSpirillum(ctx, org) {
    const moveAngle = Math.atan2(org.vy, org.vx);
    ctx.rotate(moveAngle);
    ctx.shadowColor = '#8b6bff';

    const totalLen = 34;
    const segments = 16;
    const segStep = totalLen / segments;

    ctx.strokeStyle = '#a68fff';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();

    for (let i = 0; i <= segments; i++) {
      const px = -totalLen / 2 + i * segStep;
      const wave = Math.sin(org.wigglePhase * 1.5 + (i / segments) * Math.PI * 4) * 6;
      if (i === 0) ctx.moveTo(px, wave);
      else ctx.lineTo(px, wave);
    }
    ctx.stroke();

    // Glowing core ribbon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }

  // 6. Streptococcus (Chained Cocci Beads)
  drawStreptococcus(ctx, org) {
    ctx.rotate(org.rotation);
    ctx.shadowColor = '#9d4edd';

    const beadCount = 4;
    const beadR = 6;
    const step = beadR * 1.6;

    for (let i = 0; i < beadCount; i++) {
      const px = (i - (beadCount - 1) / 2) * step;
      const py = Math.sin(org.wigglePhase + i * 0.9) * 2;

      // Glow capsule
      ctx.fillStyle = 'rgba(157, 78, 221, 0.3)';
      ctx.beginPath();
      ctx.arc(px, py, beadR + 2, 0, Math.PI * 2);
      ctx.fill();

      // Core coccus
      ctx.fillStyle = '#b5179e';
      ctx.strokeStyle = '#e0aaff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(px, py, beadR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // 7. Staphylococcus (Grape Cluster Cocci)
  drawStaphylococcus(ctx, org) {
    ctx.rotate(org.rotation);
    ctx.shadowColor = '#ffd166';

    const clusterPoints = [
      [0, 0],
      [-6, -5],
      [6, -4],
      [-5, 5],
      [5, 6],
      [0, 8]
    ];
    const beadR = 5.2;

    for (const [cx, cy] of clusterPoints) {
      ctx.fillStyle = '#ffb44d';
      ctx.strokeStyle = '#ffe8b3';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx, cy, beadR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Pill shape helper
  drawPill(ctx, x, y, w, h) {
    const r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
  }
}
