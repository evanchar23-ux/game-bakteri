/**
 * AlliedSentinel.js
 * Unit Pendukung Imun Sekutu (Friendly Immune Sentinels)
 * Membantu sel pemain di medan tempur:
 * - Sel T-Helper (CD4+): Mengorbit pemain, menembakkan sitokin proyektil pendukung.
 * - Sel Dendritik: Mengintai patogen terdekat, mengopsonisasi dan memperlambat infeksi.
 */

import { Projectile } from './Projectile.js';

export class AlliedSentinel {
  constructor(player, type = 'helper_t', relAngle = 0, orbitDist = 70) {
    this.player = player;
    this.type = type; // 'helper_t' or 'dendritic'
    this.relAngle = relAngle;
    this.orbitDist = orbitDist;
    this.x = player.x + Math.cos(relAngle) * orbitDist;
    this.y = player.y + Math.sin(relAngle) * orbitDist;
    this.radius = type === 'helper_t' ? 14 : 16;
    this.shootTimer = Math.random() * 1.5;
    this.shootInterval = type === 'helper_t' ? 1.2 : 1.9;
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.name = type === 'helper_t' ? 'Sel T-Helper (CD4+)' : 'Sel Dendritik';
    this.color = type === 'helper_t' ? '#ffd166' : '#00f2fe';
  }

  update(dt, player, pathogens, outProjectiles, sound) {
    this.wobblePhase += dt * 3;
    this.relAngle += dt * 0.85; // Orbiting player
    const targetX = player.x + Math.cos(this.relAngle) * this.orbitDist;
    const targetY = player.y + Math.sin(this.relAngle) * this.orbitDist;

    // Smooth lerp to target orbit
    this.x += (targetX - this.x) * dt * 5.5;
    this.y += (targetY - this.y) * dt * 5.5;

    // Combat targeting: find closest pathogen within range
    this.shootTimer -= dt;
    if (this.shootTimer <= 0 && pathogens.length > 0 && outProjectiles) {
      let closest = null;
      let closestDist = 420;
      for (let p of pathogens) {
        if (p.dead) continue;
        const d = Math.hypot(p.x - this.x, p.y - this.y);
        if (d < closestDist) {
          closestDist = d;
          closest = p;
        }
      }

      if (closest) {
        this.shootTimer = this.shootInterval;
        const ang = Math.atan2(closest.y - this.y, closest.x - this.x);
        const isHelper = this.type === 'helper_t';

        outProjectiles.push(new Projectile({
          x: this.x,
          y: this.y,
          vx: Math.cos(ang) * 440,
          vy: Math.sin(ang) * 440,
          speed: 440,
          damage: isHelper ? 26 : 20,
          range: 420,
          radius: isHelper ? 5 : 6,
          color: this.color,
          isEnemy: false,
          penetration: 1
        }));

        // Dendritic shot applies opsonization to target
        if (!isHelper && Math.random() < 0.6) {
          closest.applyOpsonization(3.5);
        }
      }
    }
  }

  render(ctx, camera) {
    const camOffset = camera.getRenderOffset();
    const sx = this.x - camOffset.x;
    const sy = this.y - camOffset.y;

    if (
      sx < -80 || sx > camera.viewportWidth + 80 ||
      sy < -80 || sy > camera.viewportHeight + 80
    ) return;

    const playerSx = this.player.x - camOffset.x;
    const playerSy = this.player.y - camOffset.y;

    ctx.save();

    // 1. Cytokine signaling tether line to player
    ctx.strokeStyle = this.type === 'helper_t' ? 'rgba(255, 209, 102, 0.22)' : 'rgba(0, 242, 254, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(playerSx, playerSy);
    ctx.lineTo(sx, sy);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Sentinel Body
    ctx.translate(sx, sy);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;

    if (this.type === 'helper_t') {
      // CD4+ Helper T-Cell: Glowing golden-amber lymphocyte
      ctx.fillStyle = 'rgba(255, 209, 102, 0.88)';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Radiating CD4 nodes
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 + this.wobblePhase;
        const nx = Math.cos(a) * (this.radius + 3);
        const ny = Math.sin(a) * (this.radius + 3);
        ctx.beginPath();
        ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Dendritic cell: Star-like branching arms
      ctx.fillStyle = 'rgba(0, 242, 254, 0.88)';
      ctx.beginPath();
      const arms = 6;
      for (let i = 0; i < arms * 2; i++) {
        const a = (i * Math.PI) / arms + this.wobblePhase * 0.5;
        const r = i % 2 === 0 ? this.radius + 4 : this.radius * 0.65;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // 3. Overhead Friendly Badge
    ctx.save();
    const badgeY = sy - this.radius - 12;
    const badgeText = this.type === 'helper_t' ? 'REKAN: T-HELPER' : 'REKAN: DENDRITIK';
    ctx.font = 'bold 8.5px Rajdhani, sans-serif';
    const tw = ctx.measureText(badgeText).width + 8;

    ctx.fillStyle = 'rgba(5, 20, 35, 0.85)';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(sx - tw / 2, badgeY - 10, tw, 12, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, sx, badgeY - 1);
    ctx.restore();
  }
}
