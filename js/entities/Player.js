/**
 * Player.js
 * Entitas Sel Imun yang Dikendalikan Pemain
 * Setiap sel imun memiliki bentuk fisik, organel anatomis, siluet, dan ekspresi yang SANGAT BERBEDA:
 * - Makrofag: Raksasa amoeboid dengan pseudopodia menjulur, mulut fagositosis, dan nukleus ginjal.
 * - Neutrofil: Sel PMN dengan nukleus multilobus (3 lobus), granula defensin, dan moncong granula ganda.
 * - Limfosit B: Sel speris dipenuhi reseptor molekul antibodi Y bercahaya dan nukleus bulat besar.
 * - Limfosit T: Bentuk delta aerodinamis dengan bilah pedang perforin ganda dan polarisasi granzyme.
 */

import { IMMUNE_CELLS } from '../data/cells.js';
import { Projectile } from './Projectile.js';

export class Player {
  constructor(x, y, cellKey = 'macrophage') {
    this.x = x;
    this.y = y;
    this.cellKey = cellKey;
    this.def = IMMUNE_CELLS[cellKey] || IMMUNE_CELLS.macrophage;

    // Deep copy stats
    this.stats = JSON.parse(JSON.stringify(this.def.baseStats));
    this.hp = this.stats.maxHp;
    this.atp = this.stats.atpMax;
    this.radius = this.def.radius;

    this.cooldowns = {
      basic: 0,
      tactical: 0,
      ultimate: 0
    };

    this.cooldownReduction = 0;
    this.shield = 0;
    this.shieldMax = 0;
    this.hasRegenShield = false;
    this.shieldRegenTimer = 0;

    this.facingAngle = 0;
    this.wobblePhase = 0;
    this.wobbleSpeed = 4.5;

    // Level progression
    this.level = 1;
    this.exp = 0;
    this.expNext = 50;

    // Biological perks & modifiers
    this.virusDamageBonus = 1;
    this.bacteriaDamageBonus = 1;
    this.damageMultiplier = 1;
    this.ignoreArmor = false;
    this.killHealBonus = 1;
    this.leavesROSPatch = false;
    this.consecutiveHits = 0;
    this.lastTargetSpecies = null;

    // Tactical Dash state
    this.dashTimer = 0;
    this.dashVx = 0;
    this.dashVy = 0;
  }

  takeDamage(amount) {
    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        amount = Math.abs(this.shield);
        this.shield = 0;
      } else {
        return { damage: Math.round(amount), absorbed: true };
      }
    }

    const finalDmg = Math.max(1, amount * (1 - this.stats.armor / 100));
    this.hp -= finalDmg;
    return { damage: Math.round(finalDmg), absorbed: false, dead: this.hp <= 0 };
  }

  update(dt, input, camera, outProjectiles, sound, game) {
    this.wobblePhase += dt * this.wobbleSpeed;

    // Regens
    this.hp = Math.min(this.stats.maxHp, this.hp + this.stats.hpRegen * dt);
    this.atp = Math.min(this.stats.atpMax, this.atp + this.stats.atpRegen * dt);

    // Shield regen
    if (this.hasRegenShield && this.shield < this.shieldMax) {
      this.shieldRegenTimer += dt;
      if (this.shieldRegenTimer >= 10) {
        this.shield = this.shieldMax;
        this.shieldRegenTimer = 0;
      }
    }

    // Cooldown decrements
    const cdFactor = 1 - (this.cooldownReduction || 0);
    if (this.cooldowns.basic > 0) this.cooldowns.basic -= dt;
    if (this.cooldowns.tactical > 0) this.cooldowns.tactical -= dt;
    if (this.cooldowns.ultimate > 0) this.cooldowns.ultimate -= dt;

    // Dash update
    if (this.dashTimer > 0) {
      this.dashTimer -= dt;
      this.x += this.dashVx * dt;
      this.y += this.dashVy * dt;
    } else {
      const move = input.getMovementVector();
      this.x += move.dx * this.stats.speed * dt;
      this.y += move.dy * this.stats.speed * dt;
    }

    // Clamp inside world bounds
    this.x = Math.max(this.radius, Math.min(camera.worldWidth - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(camera.worldHeight - this.radius, this.y));

    // Mouse aiming
    input.updateWorldMouse(camera);
    this.facingAngle = Math.atan2(input.mouse.worldY - this.y, input.mouse.worldX - this.x);

    // 1. Basic Attack
    if (input.mouse.isDown && this.cooldowns.basic <= 0) {
      this.performBasicAttack(outProjectiles, sound, game);
      this.cooldowns.basic = this.def.basicAttack.cooldown * cdFactor;
    }

    // 2. Tactical Skill
    if (input.consumeSpace() && this.cooldowns.tactical <= 0) {
      if (this.atp >= this.def.tacticalSkill.atpCost) {
        this.atp -= this.def.tacticalSkill.atpCost;
        this.performTacticalSkill(sound, game, outProjectiles);
        this.cooldowns.tactical = this.def.tacticalSkill.cooldown * cdFactor;
      }
    }

    // 3. Ultimate Skill
    if (input.consumeQorE() && this.cooldowns.ultimate <= 0) {
      if (this.atp >= this.def.ultimateSkill.atpCost) {
        this.atp -= this.def.ultimateSkill.atpCost;
        this.performUltimateSkill(sound, game, outProjectiles);
        this.cooldowns.ultimate = this.def.ultimateSkill.cooldown * cdFactor;
      }
    }
  }

  performBasicAttack(outProjectiles, sound, game) {
    const atk = this.def.basicAttack;
    let baseDmg = atk.damage * (this.damageMultiplier || 1);

    const isCrit = Math.random() < this.stats.critChance;
    if (isCrit) baseDmg *= this.stats.critMult;

    if (this.cellKey === 'macrophage') {
      sound.playPhagocytosis();
      game.performMeleeBite(this.x, this.y, this.facingAngle, atk.range, baseDmg, isCrit);
    } else if (this.cellKey === 'neutrophil') {
      sound.playShoot('granule');
      const spread = (Math.random() - 0.5) * (atk.spread || 0.1);
      const ang = this.facingAngle + spread;
      outProjectiles.push(new Projectile({
        x: this.x + Math.cos(ang) * (this.radius + 12),
        y: this.y + Math.sin(ang) * (this.radius + 12),
        vx: Math.cos(ang) * atk.bulletSpeed,
        vy: Math.sin(ang) * atk.bulletSpeed,
        speed: atk.bulletSpeed,
        damage: baseDmg,
        range: atk.range,
        radius: 4.5,
        color: this.def.color,
        type: 'granule',
        penetration: 1
      }));
    } else if (this.cellKey === 'b_cell') {
      sound.playShoot('antibody');
      outProjectiles.push(new Projectile({
        x: this.x + Math.cos(this.facingAngle) * (this.radius + 14),
        y: this.y + Math.sin(this.facingAngle) * (this.radius + 14),
        vx: Math.cos(this.facingAngle) * atk.bulletSpeed,
        vy: Math.sin(this.facingAngle) * atk.bulletSpeed,
        speed: atk.bulletSpeed,
        damage: baseDmg,
        range: atk.range,
        radius: 6,
        color: '#ff007f',
        type: 'antibody',
        penetration: 1,
        homingStrength: 6
      }));
    } else if (this.cellKey === 't_cell') {
      sound.playShoot('lance');
      outProjectiles.push(new Projectile({
        x: this.x + Math.cos(this.facingAngle) * (this.radius + 14),
        y: this.y + Math.sin(this.facingAngle) * (this.radius + 14),
        vx: Math.cos(this.facingAngle) * atk.bulletSpeed,
        vy: Math.sin(this.facingAngle) * atk.bulletSpeed,
        speed: atk.bulletSpeed,
        damage: baseDmg,
        range: atk.range,
        radius: 7,
        color: '#ffaa00',
        type: 'perforin',
        penetration: 3
      }));
    }
  }

  performTacticalSkill(sound, game, outProjectiles) {
    if (this.cellKey === 'macrophage') {
      sound.playShoot('lance');
      game.triggerMHCWave(this.x, this.y, 220);
      game.postTelemetry('[MHC-II] Presentasi antigen mengaktifkan respons inflamasi!');
    } else if (this.cellKey === 'neutrophil') {
      sound.playNETosis();
      game.particles.spawnNETWeb(this.x, this.y, 110, 4.5);
      game.postTelemetry('[NETosis] Jaring kromatin menjerat mikroba patogen!');
    } else if (this.cellKey === 'b_cell') {
      sound.playShoot('antibody');
      game.triggerOpsonizeAll();
      game.postTelemetry('[OPSONISASI] Seluruh patogen ditandai antibodi IgG!');
    } else if (this.cellKey === 't_cell') {
      sound.playShoot('lance');
      this.dashTimer = 0.25;
      this.dashVx = Math.cos(this.facingAngle) * 750;
      this.dashVy = Math.sin(this.facingAngle) * 750;
      game.postTelemetry('[SEL T] Klonal ekspansi kilat menembus kawanan patogen!');
    }
  }

  performUltimateSkill(sound, game, outProjectiles) {
    if (this.cellKey === 'macrophage') {
      sound.playLysis();
      game.camera.shake(12, 0.4);
      game.triggerRadialBlast(this.x, this.y, 200, 240);
      game.postTelemetry('[NO BURST] Reactive Nitrogen Species melisiskan patogen!');
    } else if (this.cellKey === 'neutrophil') {
      sound.playLysis();
      game.camera.shake(14, 0.4);
      game.particles.spawnROSPuddle(this.x, this.y, 90, 4.0);
      game.triggerRadialBlast(this.x, this.y, 180, 220);
      game.postTelemetry('[RESPIRATORY BURST] Semburan O2- dan H2O2 melenyapkan invasi!');
    } else if (this.cellKey === 'b_cell') {
      sound.playLysis();
      game.camera.shake(15, 0.5);
      game.triggerAgglutinationBlast();
      game.postTelemetry('[AGLUTINASI] Gumpalan antigen diledakkan via Komplemen!');
    } else if (this.cellKey === 't_cell') {
      sound.playLysis();
      game.camera.shake(12, 0.4);
      game.triggerGranzymeApoptosis(this.x, this.y, 250);
      game.postTelemetry('[GRANZYME] Kaskade caspase mematikan sel target!');
    }
  }

  render(ctx, camera) {
    const camOffset = camera.getRenderOffset();
    const sx = this.x - camOffset.x;
    const sy = this.y - camOffset.y;

    ctx.save();
    ctx.translate(sx, sy);

    // Shield Aura
    if (this.shield > 0) {
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.75)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 12, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Orient whole cell body towards facingAngle
    ctx.rotate(this.facingAngle);

    // Render unique cell morphology based on cellKey
    if (this.cellKey === 'macrophage') {
      this.renderMacrophage(ctx);
    } else if (this.cellKey === 'neutrophil') {
      this.renderNeutrophil(ctx);
    } else if (this.cellKey === 'b_cell') {
      this.renderBCell(ctx);
    } else if (this.cellKey === 't_cell') {
      this.renderTCell(ctx);
    }

    // Render determined cell eyes facing forward
    this.renderCellFace(ctx);

    ctx.restore();
  }

  // =========================================================================
  // 1. MAKROFAG: Amoeboid Besar, Pseudopodia Merayap, Nukleus Ginjal, Mulut Fagositosis
  // =========================================================================
  renderMacrophage(ctx) {
    const t = this.wobblePhase;
    const r = this.radius;

    // Pseudopodia Leg Extensions (Tentakel amoeba yang merayap di belakang dan samping)
    ctx.fillStyle = 'rgba(0, 229, 255, 0.35)';
    for (let i = 0; i < 4; i++) {
      const legAngle = Math.PI * 0.7 + (i * Math.PI * 0.6) / 3;
      const legLen = r + 10 + Math.sin(t * 3 + i * 2) * 6;
      ctx.beginPath();
      ctx.arc(Math.cos(legAngle) * legLen, Math.sin(legAngle) * legLen, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main Amoeboid Body with Engulfing Cleft Mouth in Front
    ctx.fillStyle = this.def.color;
    ctx.shadowColor = this.def.color;
    ctx.shadowBlur = 16;

    ctx.beginPath();
    const pts = 20;
    for (let i = 0; i < pts; i++) {
      const a = (i * Math.PI * 2) / pts;
      let dist = r + Math.sin(t * 2 + i * 1.8) * 3.5;

      // Front Phagocytic Cleft (Mulut terbuka melengkung di depan)
      if (Math.abs(a) < 0.35) {
        dist = r * 0.7; // indent forming mouth
      } else if (Math.abs(a) < 0.75) {
        dist = r * 1.25; // upper & lower engulfing jaws
      }

      const px = Math.cos(a) * dist;
      const py = Math.sin(a) * dist;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Kidney-shaped (Reniform) Nucleus khas Makrofag / Monosit
    ctx.fillStyle = '#005f9e';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(-r * 0.25, 0, r * 0.45, r * 0.32, 0.4, 0.2, Math.PI * 1.8);
    ctx.fill();

    // Lysosome and phagosome vesicles (Bintik-bintik lisosom pencerna di sitoplasma)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const lysCoords = [
      { x: -r * 0.5, y: -r * 0.3 },
      { x: -r * 0.4, y: r * 0.4 },
      { x: 0, y: -r * 0.5 },
      { x: 0, y: r * 0.5 }
    ];
    lysCoords.forEach((l) => {
      ctx.beginPath();
      ctx.arc(l.x, l.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // =========================================================================
  // 2. NEUTROFIL: Multilobus PMN (3-4 Lobus), Granula Defensin, Moncong Ganda
  // =========================================================================
  renderNeutrophil(ctx) {
    const t = this.wobblePhase;
    const r = this.radius;

    // Twin Granule Cannon Barrels in Front (Moncong penembak granula)
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 12;

    // Upper and lower barrel
    ctx.beginPath();
    ctx.roundRect(r * 0.6, -7, 12, 4.5, 2);
    ctx.roundRect(r * 0.6, 2.5, 12, 4.5, 2);
    ctx.fill();

    // Main Spherical-Granular Cell Body
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Trailing NETosis micro-threads behind
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
    ctx.lineWidth = 1.5;
    for (let w = -1; w <= 1; w++) {
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, w * 5);
      const wave = Math.sin(t * 4 + w) * 6;
      ctx.quadraticCurveTo(-r * 1.4, w * 8 + wave, -r * 1.9, w * 6 - wave);
      ctx.stroke();
    }

    // Classic Polymorphonuclear (PMN) 3-Lobed Nucleus connected by chromatin bridges
    ctx.fillStyle = '#007f4f';
    ctx.shadowBlur = 0;
    const lobes = [
      { x: -r * 0.35, y: -r * 0.3, rad: 5.5 },
      { x: -r * 0.45, y: r * 0.25, rad: 6 },
      { x: 0, y: 0, rad: 5 }
    ];
    // Chromatin bridges
    ctx.strokeStyle = '#007f4f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(lobes[0].x, lobes[0].y);
    ctx.lineTo(lobes[1].x, lobes[1].y);
    ctx.lineTo(lobes[2].x, lobes[2].y);
    ctx.closePath();
    ctx.stroke();

    // Lobes
    lobes.forEach((lb) => {
      ctx.beginPath();
      ctx.arc(lb.x, lb.y, lb.rad, 0, Math.PI * 2);
      ctx.fill();
    });

    // Swirling Antimicrobial Defensin Granules (Bintik-bintik granula berputar)
    ctx.fillStyle = '#ffffff';
    for (let g = 0; g < 6; g++) {
      const gAng = t * 2 + (g * Math.PI * 2) / 6;
      const gDist = r * 0.65;
      ctx.beginPath();
      ctx.arc(Math.cos(gAng) * gDist * 0.6, Math.sin(gAng) * gDist, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // =========================================================================
  // 3. LIMFOSIT B: Membran Dikelilingi Antibodi Y, Reseptor BCR Ganda di Depan
  // =========================================================================
  renderBCell(ctx) {
    const t = this.wobblePhase;
    const r = this.radius;

    // Membrane Surface Antibodies (Molekul Y-shaped IgG menancap melingkar di membran)
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 10;

    const antibodyCount = 8;
    for (let i = 0; i < antibodyCount; i++) {
      const a = (i * Math.PI * 2) / antibodyCount + t * 0.2;
      const ax = Math.cos(a) * (r + 4);
      const ay = Math.sin(a) * (r + 4);

      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(a);
      // Small Y-shape
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(4, -4);
      ctx.moveTo(0, 0);
      ctx.lineTo(4, 4);
      ctx.stroke();
      ctx.restore();
    }

    // Two Large Front BCR Sight Antennas (Penembak ganda antibodi di depan)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    for (let f = -1; f <= 1; f += 2) {
      ctx.beginPath();
      ctx.moveTo(r * 0.6, f * 8);
      ctx.lineTo(r + 8, f * 10);
      ctx.lineTo(r + 14, f * 15);
      ctx.moveTo(r + 8, f * 10);
      ctx.lineTo(r + 14, f * 6);
      ctx.stroke();
    }

    // Main Spherical Cell Body
    ctx.fillStyle = this.def.color;
    ctx.shadowColor = this.def.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Giant Spherical Nucleus khas Limfosit (High N:C ratio memenuhi hampir seluruh sel)
    ctx.fillStyle = '#6a0080';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(-r * 0.1, 0, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Endoplasmic Reticulum / Plasma Cell antibody factory lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-r * 0.1, 0, r * 0.45, 0.8, Math.PI * 1.3);
    ctx.stroke();
  }

  // =========================================================================
  // 4. LIMFOSIT T SITOTOKSIK: Delta Aerodinamis, Pedang Perforin Ganda, Granzyme
  // =========================================================================
  renderTCell(ctx) {
    const t = this.wobblePhase;
    const r = this.radius;

    // Dual Perforin Energy Lances on Sides (Bilah pedang laser energi pembobol)
    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 16;

    for (let s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.moveTo(r + 10, s * 6);
      ctx.lineTo(-r * 0.2, s * (r + 12));
      ctx.lineTo(-r * 0.6, s * (r + 7));
      ctx.lineTo(r * 0.2, s * 4);
      ctx.closePath();
      ctx.fill();
    }

    // Aerodynamic Delta Cell Body (Tubuh ramping seperti ujung panah pemburu)
    ctx.fillStyle = this.def.color;
    ctx.shadowColor = this.def.color;
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(r * 1.3, 0); // sharp nose
    ctx.quadraticCurveTo(r * 0.8, -r, -r * 0.8, -r * 0.8);
    ctx.lineTo(-r * 0.5, 0); // notched back
    ctx.lineTo(-r * 0.8, r * 0.8);
    ctx.quadraticCurveTo(r * 0.8, r, r * 1.3, 0);
    ctx.closePath();
    ctx.fill();

    // Rear Filopodia Thrusters
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.6)';
    ctx.lineWidth = 2;
    for (let th = -1; th <= 1; th += 2) {
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, th * 4);
      ctx.lineTo(-r * 1.5, th * 8);
      ctx.stroke();
    }

    // Polarized Lytic Granzyme Granules in Front (Granula racun apoptosis siap ditembakkan)
    ctx.fillStyle = '#ff0033';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 8;
    const granzymeDots = [
      { x: r * 0.7, y: -4 },
      { x: r * 0.7, y: 4 },
      { x: r * 0.9, y: 0 }
    ];
    granzymeDots.forEach((g) => {
      ctx.beginPath();
      ctx.arc(g.x, g.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Nucleus
    ctx.fillStyle = '#b35400';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(-r * 0.2, 0, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // CELL EYES / FACE: Wajah Sel Imun Pejuang yang Hidup & Berkarakter
  // =========================================================================
  renderCellFace(ctx) {
    const r = this.radius;

    // Determined, focused hero eyes (Mata pejuang menghadap ke depan target)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 4;

    const eyeOffsetX = r * 0.22;
    const eyeSpacingY = r * 0.32;

    // Left and Right Eyes
    for (let side = -1; side <= 1; side += 2) {
      const ey = side * eyeSpacingY;
      ctx.beginPath();
      ctx.arc(eyeOffsetX, ey, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Pupil looking forward
      ctx.fillStyle = '#030814';
      ctx.beginPath();
      ctx.arc(eyeOffsetX + 1.2, ey, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Slanted Eyebrow (Alis tajam bertekad)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(eyeOffsetX - 2, ey - side * 4);
      ctx.lineTo(eyeOffsetX + 3.5, ey - side * 2.5);
      ctx.stroke();

      ctx.fillStyle = '#ffffff'; // reset for second eye
    }

    ctx.restore();
  }
}
