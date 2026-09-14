/**
 * particles.js
 * Sistem Partikel Mikroskopik Fluida Tubuh yang Disesuaikan dengan Organ Spesifik
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.damageTexts = [];
    this.ambientCells = []; // Organ-specific ambient floating elements
    this.traps = []; // NETosis webs and ROS puddles
    this.confetti = []; // Celebratory victory confetti & cytokine sparks
    this.currentOrgan = 'lungs';
  }

  initAmbientCells(worldW, worldH, count = 260, organType = 'lungs') {
    this.ambientCells = [];
    this.currentOrgan = organType;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * worldW;
      const y = Math.random() * worldH;
      const rand = Math.random();

      if (organType === 'lungs') {
        // Alveolar capillaries: Aerosols, RBCs in capillary mesh, nutrient micelles
        let shape = 'aerosol';
        let color = 'rgba(0, 210, 255, 0.14)';
        if (rand < 0.35) {
          shape = 'aerosol';
          color = 'rgba(0, 210, 255, 0.15)';
        } else if (rand < 0.70) {
          shape = 'rbc';
          color = 'rgba(230, 57, 70, 0.20)';
        } else if (rand < 0.85) {
          shape = 'nutrient';
          color = 'rgba(255, 230, 100, 0.22)';
        } else {
          shape = 'platelet';
          color = 'rgba(255, 183, 3, 0.18)';
        }

        this.ambientCells.push({
          x, y,
          radius: 7 + Math.random() * 15,
          speedX: (Math.random() - 0.5) * 16,
          speedY: -18 - Math.random() * 25, // Upward ciliary breath
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          color,
          shape
        });
      } else if (organType === 'gut') {
        // Intestinal lumen & villi capillaries
        let shape = 'probiotic';
        let color = 'rgba(42, 157, 143, 0.18)';
        if (rand < 0.35) {
          shape = 'probiotic';
          color = 'rgba(42, 157, 143, 0.20)';
        } else if (rand < 0.65) {
          shape = 'rbc';
          color = 'rgba(200, 40, 50, 0.20)';
        } else if (rand < 0.85) {
          shape = 'nutrient';
          color = 'rgba(244, 162, 97, 0.22)';
        } else {
          shape = 'micelle';
          color = 'rgba(233, 196, 106, 0.16)';
        }

        this.ambientCells.push({
          x, y,
          radius: 8 + Math.random() * 14,
          speedX: 18 + Math.random() * 24, // Peristalsis drift
          speedY: (Math.random() - 0.5) * 14,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.025,
          color,
          shape
        });
      } else if (organType === 'skin') {
        // Epidermal tear: Extravasated RBCs, fibrin threads, keratin flakes, platelets
        let shape = 'keratin_flake';
        let color = 'rgba(244, 162, 97, 0.18)';
        if (rand < 0.30) {
          shape = 'keratin_flake';
          color = 'rgba(244, 162, 97, 0.18)';
        } else if (rand < 0.60) {
          shape = 'rbc';
          color = 'rgba(220, 40, 60, 0.24)';
        } else if (rand < 0.80) {
          shape = 'fibrin_thread';
          color = 'rgba(231, 111, 81, 0.22)';
        } else {
          shape = 'platelet';
          color = 'rgba(255, 200, 50, 0.25)';
        }

        this.ambientCells.push({
          x, y,
          radius: 8 + Math.random() * 16,
          speedX: (Math.random() - 0.5) * 10,
          speedY: (Math.random() - 0.5) * 10,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.018,
          color,
          shape
        });
      } else {
        // Bloodstream: Torrential arterial current
        let shape = rand < 0.65 ? 'rbc' : (rand < 0.85 ? 'platelet' : 'nutrient');
        let color = shape === 'rbc' ? 'rgba(230, 57, 70, 0.26)' : 'rgba(255, 183, 3, 0.24)';

        this.ambientCells.push({
          x, y,
          radius: 11 + Math.random() * 15,
          speedX: 35 + Math.random() * 50, // Rapid hemodynamic rush
          speedY: (Math.random() - 0.5) * 16,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          color,
          shape
        });
      }
    }
  }

  spawnLysis(x, y, color, count = 16, type = 'virus') {
    const isVirus = type === 'virus';
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isVirus ? (80 + Math.random() * 220) : (40 + Math.random() * 140);
      const rad = isVirus ? (1.5 + Math.random() * 2.5) : (2.5 + Math.random() * 5.0);
      
      // Color variations: Viruses sparkle with RNA neon yellow/pink; Bacteria have wall fragments
      let partColor = color || (isVirus ? '#ff007f' : '#9d4edd');
      if (isVirus && Math.random() < 0.35) {
        partColor = '#ffe600'; // Viral RNA/genome spark
      }

      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: rad,
        color: partColor,
        alpha: 1,
        life: 0.45 + Math.random() * 0.45,
        maxLife: 0.9,
        isFragment: !isVirus && Math.random() < 0.4 // Peptidoglycan fragment
      });
    }
  }

  spawnDamageText(x, y, text, isCrit = false, isHeal = false) {
    this.damageTexts.push({
      x: x + (Math.random() * 20 - 10),
      y: y - 10,
      text: String(text),
      vy: -45,
      alpha: 1,
      life: 0.75,
      isCrit,
      isHeal
    });
  }

  spawnNETWeb(x, y, radius = 90, duration = 4.5) {
    this.traps.push({
      type: 'net',
      x, y,
      radius,
      duration,
      maxDuration: duration,
      pulse: 0
    });
  }

  spawnROSPuddle(x, y, radius = 45, duration = 3.0) {
    this.traps.push({
      type: 'ros',
      x, y,
      radius,
      duration,
      maxDuration: duration,
      pulse: 0
    });
  }

  spawnDeploymentShockwave(x, y, color = '#00f2fe') {
    // 3 harmonic shockwave rings
    for (let i = 0; i < 3; i++) {
      this.traps.push({
        type: 'shockwave',
        x, y,
        radius: 18 + i * 14,
        speed: 340 - i * 35,
        duration: 0.95 + i * 0.15,
        maxDuration: 0.95 + i * 0.15,
        pulse: 0,
        color: color
      });
    }

    // Dense radial bio-spark ring
    for (let i = 0; i < 45; i++) {
      const angle = (Math.PI * 2 * i) / 45 + (Math.random() - 0.5) * 0.2;
      const speed = 100 + Math.random() * 240;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.5 + Math.random() * 3.5,
        color: color,
        alpha: 1,
        life: 0.7 + Math.random() * 0.5,
        maxLife: 1.2
      });
    }
  }

  // Tanda & Animasi Menang: Expansive bio-sterilization shockwave sweeping the whole tissue
  spawnVictorySterilizationPulse(x, y) {
    const pulseColors = ['#ffd700', '#00ff88', '#00f2fe', '#ffffff', '#ff9e00'];
    for (let i = 0; i < 5; i++) {
      this.traps.push({
        type: 'shockwave',
        x, y,
        radius: 20 + i * 25,
        speed: 480 + i * 90,
        duration: 2.2 + i * 0.25,
        maxDuration: 2.2 + i * 0.25,
        pulse: 0,
        color: pulseColors[i % pulseColors.length]
      });
    }

    // Huge celebratory fireworks spark bursts
    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 2 * i) / 90 + (Math.random() - 0.5) * 0.3;
      const speed = 120 + Math.random() * 380;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 4.5,
        color: pulseColors[Math.floor(Math.random() * pulseColors.length)],
        alpha: 1,
        life: 1.2 + Math.random() * 1.0,
        maxLife: 2.2
      });
    }
  }

  // Animasi Menang: Sparkling golden cytokine confetti, floating ribbons & bioluminescent stars
  spawnVictoryConfetti(x, y, count = 120) {
    const colors = ['#ffd700', '#ffb703', '#00f2fe', '#00ff88', '#ff3366', '#ffffff', '#e0aaff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 140 + Math.random() * 400;
      const shapeType = Math.random() < 0.45 ? 'ribbon' : (Math.random() < 0.75 ? 'star' : 'disk');

      this.confetti.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (120 + Math.random() * 180), // Upward burst
        gravity: 65 + Math.random() * 45,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 4 + Math.random() * 6,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapeType,
        life: 2.8 + Math.random() * 1.6,
        maxLife: 4.4,
        alpha: 1
      });
    }
  }

  update(dt, worldW, worldH, player = null) {
    // 1. Ambient organ particles with fluid dynamics
    for (let c of this.ambientCells) {
      c.x += c.speedX * dt;
      c.y += c.speedY * dt;
      c.rotation += c.rotSpeed;

      // Fluid displacement: gently part when player swims past
      if (player) {
        const dx = c.x - player.x;
        const dy = c.y - player.y;
        const dist = Math.hypot(dx, dy);
        const minDist = player.radius + c.radius + 15;
        if (dist < minDist && dist > 1) {
          const push = (minDist - dist) * 0.12;
          c.x += (dx / dist) * push;
          c.y += (dy / dist) * push;
        }
      }

      if (c.x < -60) c.x = worldW + 60;
      if (c.x > worldW + 60) c.x = -60;
      if (c.y < -60) c.y = worldH + 60;
      if (c.y > worldH + 60) c.y = -60;
    }

    // 2. Lysis particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 3. Damage numbers
    for (let i = this.damageTexts.length - 1; i >= 0; i--) {
      const d = this.damageTexts[i];
      d.y += d.vy * dt;
      d.vy *= 0.95;
      d.life -= dt;
      d.alpha = Math.max(0, d.life / 0.75);
      if (d.life <= 0) {
        this.damageTexts.splice(i, 1);
      }
    }

    // 4. Traps & Shockwaves
    for (let i = this.traps.length - 1; i >= 0; i--) {
      const tr = this.traps[i];
      tr.duration -= dt;
      tr.pulse += dt * 4;
      if (tr.type === 'shockwave') {
        tr.radius += tr.speed * dt;
      }
      if (tr.duration <= 0) {
        this.traps.splice(i, 1);
      }
    }

    // 5. Celebratory Victory Confetti & Fireworks
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const cf = this.confetti[i];
      cf.x += cf.vx * dt;
      cf.y += cf.vy * dt;
      cf.vy += cf.gravity * dt;
      cf.vx *= 0.985;
      cf.rotation += cf.rotSpeed * dt;
      cf.wobble += cf.wobbleSpeed * dt;
      cf.life -= dt;
      cf.alpha = Math.max(0, cf.life / cf.maxLife);
      if (cf.life <= 0) {
        this.confetti.splice(i, 1);
      }
    }
  }

  renderBackgroundCells(ctx, camera) {
    const camOffset = camera.getRenderOffset();

    for (let c of this.ambientCells) {
      const screenX = c.x - camOffset.x;
      const screenY = c.y - camOffset.y;

      if (
        screenX < -70 || screenX > camera.viewportWidth + 70 ||
        screenY < -70 || screenY > camera.viewportHeight + 70
      ) continue;

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate(c.rotation);

      if (c.shape === 'aerosol') {
        // Translucent glowing aerosol droplet
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, c.radius);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        grad.addColorStop(0.6, c.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.shape === 'probiotic') {
        // Harmless rod bacillus flora
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.roundRect(-c.radius, -c.radius * 0.4, c.radius * 2, c.radius * 0.8, c.radius * 0.4);
        ctx.fill();
      } else if (c.shape === 'nutrient') {
        // Bioluminescent nutrient ATP vesicle
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, c.radius);
        grad.addColorStop(0, 'rgba(255, 255, 200, 0.55)');
        grad.addColorStop(0.5, c.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.shape === 'micelle') {
        // Lipid micelle droplet
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.shape === 'keratin_flake') {
        // Jagged polygon keratin skin shard
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.moveTo(-c.radius, -c.radius * 0.5);
        ctx.lineTo(c.radius * 0.8, -c.radius * 0.8);
        ctx.lineTo(c.radius, c.radius * 0.6);
        ctx.lineTo(-c.radius * 0.4, c.radius);
        ctx.closePath();
        ctx.fill();
      } else if (c.shape === 'fibrin_thread') {
        // Wavy fibrin clotting thread
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-c.radius, 0);
        ctx.quadraticCurveTo(0, c.radius * 0.7, c.radius, -c.radius * 0.3);
        ctx.stroke();
      } else if (c.shape === 'platelet') {
        // Star-shaped thrombocyte
        ctx.fillStyle = c.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * Math.PI * 2) / 5;
          const px = Math.cos(a) * c.radius;
          const py = Math.sin(a) * c.radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Biconcave Erythrocyte (RBC)
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, c.radius, c.radius * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(80, 5, 15, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 0, c.radius * 0.45, c.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Traps rendering
    for (let tr of this.traps) {
      const screenX = tr.x - camOffset.x;
      const screenY = tr.y - camOffset.y;

      ctx.save();
      if (tr.type === 'net') {
        const alpha = Math.min(1, tr.duration / 1.0);
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.45 * alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, tr.radius, 0, Math.PI * 2);
        ctx.stroke();

        for (let a = 0; a < 8; a++) {
          const ang = (a * Math.PI) / 4 + tr.pulse * 0.1;
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX + Math.cos(ang) * tr.radius, screenY + Math.sin(ang) * tr.radius);
          ctx.stroke();
        }
      } else if (tr.type === 'ros') {
        const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, tr.radius);
        grad.addColorStop(0, 'rgba(255, 170, 0, 0.35)');
        grad.addColorStop(1, 'rgba(255, 80, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(screenX, screenY, tr.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (tr.type === 'shockwave') {
        const alpha = Math.max(0, tr.duration / tr.maxDuration);
        ctx.strokeStyle = tr.color || '#00f2fe';
        ctx.globalAlpha = alpha * 0.85;
        ctx.lineWidth = 4 * alpha + 1;
        ctx.shadowColor = tr.color || '#00f2fe';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(screenX, screenY, tr.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glowing harmonic ripple
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(0, tr.radius - 12), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  renderForeground(ctx, camera) {
    const camOffset = camera.getRenderOffset();

    // Lysis particles
    for (let p of this.particles) {
      const screenX = p.x - camOffset.x;
      const screenY = p.y - camOffset.y;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Damage numbers
    ctx.save();
    ctx.textAlign = 'center';
    for (let d of this.damageTexts) {
      const screenX = d.x - camOffset.x;
      const screenY = d.y - camOffset.y;

      ctx.globalAlpha = d.alpha;
      if (d.isHeal) {
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 15px Rajdhani, sans-serif';
      } else if (d.isCrit) {
        ctx.fillStyle = '#ffaa00';
        ctx.shadowColor = '#ff5500';
        ctx.shadowBlur = 8;
        ctx.font = 'bold 18px Rajdhani, sans-serif';
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px Outfit, sans-serif';
      }
      ctx.fillText(d.text, screenX, screenY);
    }
    ctx.restore();

    // Celebratory Victory Confetti & Cytokine Shimmer
    for (let cf of this.confetti) {
      const screenX = cf.x - camOffset.x;
      const screenY = cf.y - camOffset.y;

      if (
        screenX < -50 || screenX > camera.viewportWidth + 50 ||
        screenY < -50 || screenY > camera.viewportHeight + 50
      ) continue;

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate(cf.rotation);
      ctx.globalAlpha = cf.alpha;
      ctx.fillStyle = cf.color;
      ctx.shadowColor = cf.color;
      ctx.shadowBlur = 8;

      const scaleX = Math.cos(cf.wobble); // Flutter effect
      ctx.scale(scaleX, 1);

      if (cf.shape === 'ribbon') {
        ctx.fillRect(-cf.size, -cf.size * 0.45, cf.size * 2, cf.size * 0.9);
      } else if (cf.shape === 'star') {
        // 4-point cytokine sparkle star
        ctx.beginPath();
        const s = cf.size * 1.2;
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, cf.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}
