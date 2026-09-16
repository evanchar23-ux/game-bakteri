/**
 * Pathogen.js
 * Entitas Musuh: Virus, Bakteri, dan Superbug Boss.
 * Dilengkapi visualisasi morfologi mikroskopik biologis nyata:
 * - VIRUS: Partikel aseluler, getaran nano brownian, envelope transparan, duri spike trimer/HA-NA, inti genom RNA/DNA berdenyut.
 * - BAKTERI: Organisme seluler prokariotik, dinding sel peptidoglikan berlapis tebal (Gram+/Gram-), nukleoid sirkular, ribosom granuler, koloni rantai/tandan anggur/flagela.
 * - TACTICAL BADGE: Label melayang [VIRUS] vs [BAKTERI - Gram+/-] agar pemain seketika membedakannya.
 */

import { PATHOGENS } from '../data/pathogens.js';
import { Projectile } from './Projectile.js';

export class Pathogen {
  constructor(x, y, typeKey, isBoss = false) {
    this.x = x;
    this.y = y;
    this.typeKey = typeKey;
    this.def = PATHOGENS[typeKey] || PATHOGENS.influenza;
    this.isBoss = isBoss || this.def.isBoss || false;

    this.radius = this.def.radius;
    this.hp = this.def.hp;
    this.maxHp = this.def.hp;
    this.speed = this.def.speed;
    this.baseSpeed = this.def.speed;
    this.damage = this.def.damage;
    this.color = this.def.color;
    this.spikeColor = this.def.spikeColor || '#ffd166';
    this.spikes = this.def.spikes || 0;
    this.armor = this.def.armor || 0;

    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 1.5;
    this.wobblePhase = Math.random() * Math.PI * 2;

    this.dead = false;
    this.opsonized = false;
    this.opsonizeTimer = 0;
    this.trappedTimer = 0;
    this.slowTimer = 0;
    this.rosBurnTimer = 0;

    this.shieldHp = this.isBoss && this.def.id === 'boss_mrsa' ? 800 : 0;
    this.maxShieldHp = this.shieldHp;

    // AI timing
    this.shootTimer = Math.random() * 2;
    this.bossSpecialTimer = 3;
    this.hasFissioned = false; // for E. coli boss

    // Cache biological structures for bacteria
    if (this.def.type === 'bacteria') {
      // 1. Streptococcus chained cocci
      if (this.def.chainLength) {
        this.chainBeads = [];
        const count = this.def.chainLength;
        const beadR = this.radius * 0.72;
        for (let i = 0; i < count; i++) {
          this.chainBeads.push({
            relX: (i - (count - 1) / 2) * (beadR * 1.55),
            relY: (Math.sin(i * 1.3) * beadR * 0.3),
            radius: beadR * (0.9 + (i % 2) * 0.12)
          });
        }
      }
      // 2. Staphylococcus grape-like cluster of cocci
      else if (this.def.clusterCount) {
        this.clusterBeads = [];
        const count = this.def.clusterCount;
        const beadR = this.radius * (this.isBoss ? 0.44 : 0.54);
        this.clusterBeads.push({ relX: 0, relY: 0, radius: beadR * 1.15 });
        for (let i = 0; i < count - 1; i++) {
          const ang = (i * Math.PI * 2) / (count - 1) + 0.35;
          const dist = beadR * 1.18;
          this.clusterBeads.push({
            relX: Math.cos(ang) * dist,
            relY: Math.sin(ang) * dist,
            radius: beadR * (0.88 + (i % 3) * 0.1)
          });
        }
      }

      // Pre-seed cytoplasmic granules (ribosomes)
      this.granules = [];
      const gCount = this.isBoss ? 16 : 8;
      for (let i = 0; i < gCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * (this.radius * 0.62);
        this.granules.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, size: 1.2 + Math.random() * 1.2 });
      }
    }
  }

  takeDamage(amount, isCrit = false, ignoreArmor = false) {
    let effectiveArmor = ignoreArmor ? 0 : this.armor;
    let finalDmg = Math.max(1, amount * (1 - effectiveArmor / 100));

    if (this.opsonized) {
      finalDmg *= 1.8; // Opsonization amplifier!
    }

    if (this.shieldHp > 0) {
      this.shieldHp -= finalDmg;
      if (this.shieldHp < 0) {
        this.hp += this.shieldHp;
        this.shieldHp = 0;
      }
    } else {
      this.hp -= finalDmg;
    }

    if (this.hp <= 0) {
      this.dead = true;
    }

    return {
      damage: Math.round(finalDmg),
      isCrit,
      dead: this.dead,
      blocked: Math.round(amount - finalDmg),
      armor: effectiveArmor
    };
  }

  applyOpsonization(duration = 5.0) {
    this.opsonized = true;
    this.opsonizeTimer = duration;
  }

  applyTrap(duration = 4.0) {
    this.trappedTimer = duration;
  }

  update(dt, player, arenaHazard, outProjectiles) {
    this.wobblePhase += dt * 4;
    this.rotation += this.rotSpeed * dt;

    // Timers
    if (this.opsonized) {
      this.opsonizeTimer -= dt;
      if (this.opsonizeTimer <= 0) this.opsonized = false;
    }
    if (this.trappedTimer > 0) {
      this.trappedTimer -= dt;
      // NETosis poison damage
      this.takeDamage(12 * dt, false, true);
    }
    if (this.slowTimer > 0) this.slowTimer -= dt;

    // Movement calculation
    if (this.trappedTimer <= 0) {
      let currentSpeed = this.baseSpeed;
      if (this.slowTimer > 0 || this.opsonized) currentSpeed *= 0.65;

      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 1) {
        this.x += (dx / dist) * currentSpeed * dt;
        this.y += (dy / dist) * currentSpeed * dt;
      }

      // Apply organ environmental hazard drift
      if (arenaHazard) {
        this.x += (arenaHazard.driftX || 0) * dt;
        this.y += (arenaHazard.driftY || 0) * dt;
      }
    }

    // Boss special actions
    if (this.isBoss) {
      this.bossSpecialTimer -= dt;
      if (this.bossSpecialTimer <= 0) {
        this.bossSpecialTimer = 4.5;
        this.triggerBossSkill(player, outProjectiles);
      }
    } else if (this.def.canShoot && outProjectiles) {
      // Normal viral shooters (e.g. SARS-CoV-2 spikes)
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = this.def.shootInterval || 2.5;
        const ang = Math.atan2(player.y - this.y, player.x - this.x);
        outProjectiles.push(new Projectile({
          x: this.x,
          y: this.y,
          vx: Math.cos(ang) * 220,
          vy: Math.sin(ang) * 220,
          speed: 220,
          damage: this.damage * 0.8,
          range: 400,
          radius: 5,
          color: '#ff0055',
          isEnemy: true
        }));
      }
    }
  }

  triggerBossSkill(player, outProjectiles) {
    if (!outProjectiles) return;
    if (this.def.id === 'boss_sars_cov_2') {
      // Radial Spike Dart Volley (Cytokine storm barrage)
      const count = 12;
      for (let i = 0; i < count; i++) {
        const ang = (i * Math.PI * 2) / count + this.rotation;
        outProjectiles.push(new Projectile({
          x: this.x,
          y: this.y,
          vx: Math.cos(ang) * 250,
          vy: Math.sin(ang) * 250,
          speed: 250,
          damage: 18,
          range: 480,
          radius: 6,
          color: '#ff0054',
          isEnemy: true
        }));
      }
    } else if (this.def.id === 'boss_mrsa') {
      // Regenerate Biofilm Shield
      this.shieldHp = Math.min(this.maxShieldHp, this.shieldHp + 300);
    }
  }

  render(ctx, camera) {
    const camOffset = camera.getRenderOffset();
    const sx = this.x - camOffset.x;
    const sy = this.y - camOffset.y;

    if (
      sx < -120 || sx > camera.viewportWidth + 120 ||
      sy < -120 || sy > camera.viewportHeight + 120
    ) return;

    ctx.save();

    // Viruses have high-frequency brownian nano-jitter (Brownian agitation of sub-microscopic acellular virions)
    let drawX = sx;
    let drawY = sy;
    if (this.def.type === 'virus') {
      drawX += Math.sin(this.wobblePhase * 9) * 0.9;
      drawY += Math.cos(this.wobblePhase * 11) * 0.9;
    }
    ctx.translate(drawX, drawY);

    // 1. MRSA Biofilm Fortress Shield
    if (this.shieldHp > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 163, 115, 0.85)';
      ctx.fillStyle = 'rgba(212, 163, 115, 0.15)';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#d4a373';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Slime matrix filaments
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
      for (let s = 0; s < 6; s++) {
        const ang = (s * Math.PI) / 3 + this.rotation;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * (this.radius + 8), Math.sin(ang) * (this.radius + 8), 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Opsonization antibody glowing tags
    if (this.opsonized) {
      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 7, 0, Math.PI * 2);
      ctx.stroke();

      // Glowing Y-shaped antibody markers attached to membrane
      for (let y = 0; y < 4; y++) {
        const ang = (y * Math.PI) / 2 + this.rotation;
        const px = Math.cos(ang) * (this.radius + 6);
        const py = Math.sin(ang) * (this.radius + 6);
        ctx.fillStyle = '#ff007f';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Bacterial Capsule Halo (e.g. Streptococcus polysaccharide capsule)
    if (this.def.capsuleColor) {
      ctx.fillStyle = this.def.capsuleColor;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // ----------------------------------------------------
    // BRANCH A: VIRUS MORPHOLOGY (Non-cellular, spikes, genetic core)
    // ----------------------------------------------------
    if (this.def.type === 'virus') {
      if (this.def.shape === 'icosahedral') {
        // Rhinovirus: Naked crystalline icosahedral capsid
        ctx.rotate(this.rotation);

        // Crystalline facet fill & glowing geometric shell
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.spikeColor || '#ff007f';
        ctx.lineWidth = 2;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        const sides = 6;
        const pts = [];
        for (let i = 0; i < sides; i++) {
          const a = (i * Math.PI * 2) / sides;
          const px = Math.cos(a) * this.radius;
          const py = Math.sin(a) * this.radius;
          pts.push({ x: px, y: py });
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Internal crystalline facet lines (triangulation of icosahedron)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          ctx.moveTo(0, 0);
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.stroke();

        // Pulsating naked RNA genome core in center
        const corePulse = 0.85 + Math.sin(this.wobblePhase * 5) * 0.2;
        ctx.fillStyle = '#ffea00';
        ctx.shadowColor = '#ffea00';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.35 * corePulse, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Enveloped Spiked Virion (Influenza, SARS-CoV-2, Boss SARS)
        // 1. Glycoprotein spikes protruding from outer lipid envelope
        if (this.spikes > 0) {
          ctx.strokeStyle = this.spikeColor;
          ctx.fillStyle = this.spikeColor;
          ctx.lineWidth = this.isBoss ? 2.5 : 1.8;
          ctx.shadowColor = this.spikeColor;
          ctx.shadowBlur = this.isBoss ? 12 : 6;

          for (let i = 0; i < this.spikes; i++) {
            const a = (i * Math.PI * 2) / this.spikes + this.rotation;
            const stalkLen = this.radius + (this.isBoss ? 14 : 7);
            const x1 = Math.cos(a) * (this.radius * 0.85);
            const y1 = Math.sin(a) * (this.radius * 0.85);
            const x2 = Math.cos(a) * stalkLen;
            const y2 = Math.sin(a) * stalkLen;

            // Spike stalk
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Trimeric crown head (S-protein) or bulb head (HA/NA)
            ctx.beginPath();
            if (this.def.id === 'sars_cov_2' || this.def.id === 'boss_sars_cov_2') {
              // Coronavirus trimer head
              const headR = this.isBoss ? 3.5 : 2.2;
              ctx.arc(x2, y2, headR, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Influenza bulb head
              ctx.arc(x2, y2, this.isBoss ? 4 : 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // 2. Translucent viral lipid envelope
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.isBoss ? 18 : 8;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 3. Inner glowing genetic core (Pulsating coiled RNA/DNA nucleocapsid)
        const coreR = this.radius * 0.46;
        const pulse = 1 + Math.sin(this.wobblePhase * 4) * 0.16;

        ctx.save();
        ctx.rotate(this.rotation * -1.5);
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = this.isBoss ? 2.5 : 1.6;
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 10;

        // Coiled RNA spiral inside virion
        ctx.beginPath();
        const loops = 8;
        for (let l = 0; l <= loops; l++) {
          const theta = (l * Math.PI) / 2;
          const r = (coreR * pulse * l) / loops;
          const cx = Math.cos(theta) * r;
          const cy = Math.sin(theta) * r;
          if (l === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        ctx.restore();

        // Virion outer membrane rim
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

    // ----------------------------------------------------
    // BRANCH B: BACTERIA MORPHOLOGY (Cellular, thick peptidoglycan wall, nucleoid)
    // ----------------------------------------------------
    } else {
      // Distinct bacterial cell wall border style
      const isGramPos = this.def.gram && this.def.gram.includes('Positif');
      const wallColor = isGramPos ? '#c084fc' : '#2dd4bf';

      if (this.def.hasFlagella) {
        // --- B1: E. coli Rod Bacillus with waving Flagella tails ---
        ctx.rotate(this.rotation);

        // 1. Multiple trailing flagellar filaments undulating sinuously
        ctx.strokeStyle = isGramPos ? 'rgba(192, 132, 252, 0.7)' : 'rgba(45, 212, 191, 0.75)';
        ctx.lineWidth = this.isBoss ? 2.8 : 1.8;
        const flagellaCount = this.isBoss ? 5 : 3;
        const rodLength = this.radius * 2.4;
        const rodHalfW = this.radius * 0.7;

        for (let f = 0; f < flagellaCount; f++) {
          const offsetY = (f - (flagellaCount - 1) / 2) * (rodHalfW * 0.7);
          ctx.beginPath();
          ctx.moveTo(-rodLength * 0.5, offsetY);

          const tailLen = rodLength * (this.isBoss ? 1.6 : 1.2);
          const segs = 6;
          for (let s = 1; s <= segs; s++) {
            const frac = s / segs;
            const px = -rodLength * 0.5 - frac * tailLen;
            const wave = Math.sin(this.wobblePhase * 4 + f * 1.5 + frac * 4) * (this.radius * 0.45 * frac);
            ctx.lineTo(px, offsetY + wave);
          }
          ctx.stroke();
        }

        // 2. Thick Peptidoglycan Cell Wall (Double Layer Outer Boundary)
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.isBoss ? 16 : 8;

        // Outer peptidoglycan wall rim
        ctx.strokeStyle = wallColor;
        ctx.lineWidth = this.isBoss ? 4.5 : 3.2;
        ctx.beginPath();
        ctx.roundRect(-rodLength * 0.5, -rodHalfW, rodLength, rodHalfW * 2, rodHalfW);
        ctx.fill();
        ctx.stroke();

        // 3. Internal Cellular Nucleoid DNA & Cytoplasmic Granules
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        // Looping bacterial circular chromosome (nucleoid)
        ctx.ellipse(0, 0, rodLength * 0.28, rodHalfW * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Cytoplasmic ribosomes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        if (this.granules) {
          for (let g of this.granules) {
            ctx.beginPath();
            ctx.arc((g.x / this.radius) * (rodLength * 0.35), (g.y / this.radius) * (rodHalfW * 0.55), g.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

      } else if (this.chainBeads && this.chainBeads.length > 0) {
        // --- B2: Streptococcus Chain of Cocci (Kokus Rantai) ---
        ctx.rotate(this.rotation);

        for (let i = 0; i < this.chainBeads.length; i++) {
          const b = this.chainBeads[i];
          const wave = Math.sin(this.wobblePhase * 2.5 + i * 1.2) * (this.radius * 0.2);
          const bx = b.relX;
          const by = b.relY + wave;

          // Thick peptidoglycan wall for each coccus
          ctx.fillStyle = this.color;
          ctx.strokeStyle = wallColor;
          ctx.lineWidth = 3.0;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 6;

          ctx.beginPath();
          ctx.arc(bx, by, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Internal nucleoid dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.beginPath();
          ctx.arc(bx, by, b.radius * 0.32, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (this.clusterBeads && this.clusterBeads.length > 0) {
        // --- B3: Staphylococcus Grape-like Cluster (Tandan Anggur) ---
        ctx.rotate(this.rotation * 0.5);

        for (let b of this.clusterBeads) {
          ctx.fillStyle = this.color;
          ctx.strokeStyle = wallColor;
          ctx.lineWidth = this.isBoss ? 3.5 : 2.8;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = this.isBoss ? 12 : 6;

          ctx.beginPath();
          ctx.arc(b.relX, b.relY, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Internal nucleoid core
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(b.relX, b.relY, b.radius * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // Default Single Bacterium Coccus
        ctx.fillStyle = this.color;
        ctx.strokeStyle = wallColor;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Internal nucleoid loop
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();

    // ----------------------------------------------------
    // 4. OVERHEAD TACTICAL HUD: BIOLOGICAL IDENTIFIER BADGE & HP BAR
    // ----------------------------------------------------
    this.renderOverheadUI(ctx, sx, sy, camera);
  }

  renderOverheadUI(ctx, sx, sy, camera) {
    const isVirus = this.def.type === 'virus';
    const isBacteria = this.def.type === 'bacteria';
    const isDamaged = this.hp < this.maxHp;

    const barW = Math.max(34, this.radius * 2 + (this.isBoss ? 20 : 8));
    const barH = this.isBoss ? 8 : 4;
    const barX = sx - barW / 2;
    const barY = sy - this.radius - (this.isBoss ? 30 : 16);

    ctx.save();

    // 1. FLOATING BIOLOGICAL TYPE BADGE
    const badgeY = barY - (this.isBoss ? 14 : 10);
    let badgeText = '';
    let badgeBorder = '';
    let badgeFill = '';
    let textColor = '';

    if (isVirus) {
      badgeText = this.isBoss ? `VIRUS APEX: ${this.def.name}` : `VIRUS`;
      badgeBorder = 'rgba(255, 0, 100, 0.85)';
      badgeFill = 'rgba(20, 5, 15, 0.8)';
      textColor = '#ff5588';
    } else {
      const gramTag = this.def.gram ? (this.def.gram.includes('Positif') ? 'Gram+' : 'Gram-') : '';
      const armorTag = this.armor > 0 ? ` [${this.armor}% ARMOR]` : '';
      badgeText = this.isBoss ? `SUPERBUG: ${this.def.name}` : `BAKTERI [${gramTag}]${armorTag}`;
      const isGramPos = this.def.gram && this.def.gram.includes('Positif');
      badgeBorder = isGramPos ? 'rgba(168, 85, 247, 0.85)' : 'rgba(16, 185, 129, 0.85)';
      badgeFill = 'rgba(10, 15, 25, 0.8)';
      textColor = isGramPos ? '#c084fc' : '#34d399';
    }

    // Measure text
    ctx.font = this.isBoss ? 'bold 11px Rajdhani, sans-serif' : 'bold 9px Rajdhani, sans-serif';
    const textMetrics = ctx.measureText(badgeText);
    const badgeW = textMetrics.width + 12;
    const badgeH = this.isBoss ? 16 : 13;
    const badgeX = sx - badgeW / 2;

    // Draw Badge Pill
    ctx.fillStyle = badgeFill;
    ctx.strokeStyle = badgeBorder;
    ctx.lineWidth = 1;
    ctx.shadowColor = badgeBorder;
    ctx.shadowBlur = this.isBoss ? 8 : 4;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY - badgeH + 2, badgeW, badgeH, 4);
    ctx.fill();
    ctx.stroke();

    // Draw Badge Text
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, sx, badgeY - 2);

    // 2. HEALTH BAR (For Bosses or damaged units)
    if (this.isBoss || isDamaged) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 2);
      ctx.fill();
      ctx.stroke();

      const pct = Math.max(0, this.hp / this.maxHp);
      // Health color: Crimson for Virus, Purple/Emerald for Bacteria
      if (isVirus) {
        ctx.fillStyle = this.isBoss ? '#ff0054' : '#ff3366';
      } else {
        ctx.fillStyle = this.isBoss ? '#f59e0b' : '#10b981';
      }
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * pct, barH, 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
