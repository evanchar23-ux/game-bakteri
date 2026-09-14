/**
 * Projectile.js
 * Representasi proyektil imunologis (Antibodi IgG, Granula Defensin, Perforin Lance)
 * serta tembakan patogen (Spike Glycoprotein Darts).
 */

export class Projectile {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.speed = config.speed || 400;
    this.damage = config.damage || 25;
    this.range = config.range || 500;
    this.distanceTraveled = 0;
    this.radius = config.radius || 5;
    this.color = config.color || '#00f2fe';
    this.type = config.type || 'granule'; // 'granule' | 'antibody' | 'perforin' | 'enemy_spike'
    this.isEnemy = config.isEnemy || false;
    this.penetration = config.penetration || 1;
    this.hits = 0;
    this.dead = false;
    this.target = config.target || null; // for homing antibodies
    this.homingStrength = config.homingStrength || 0;
    this.angle = Math.atan2(this.vy, this.vx);
  }

  update(dt, pathogens) {
    // Homing behavior for antibodies
    if (this.type === 'antibody' && (!this.target || this.target.dead) && pathogens && pathogens.length > 0) {
      // Find closest alive pathogen
      let closest = null;
      let minDist = 300;
      for (let p of pathogens) {
        if (p.dead) continue;
        const dist = Math.hypot(p.x - this.x, p.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          closest = p;
        }
      }
      this.target = closest;
    }

    if (this.target && !this.target.dead) {
      const targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      let diff = targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += diff * 8 * dt;

      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
    }

    const stepX = this.vx * dt;
    const stepY = this.vy * dt;
    this.x += stepX;
    this.y += stepY;
    this.distanceTraveled += Math.hypot(stepX, stepY);

    if (this.distanceTraveled >= this.range) {
      this.dead = true;
    }
  }

  render(ctx, camera) {
    const camOffset = camera.getRenderOffset();
    const sx = this.x - camOffset.x;
    const sy = this.y - camOffset.y;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(this.angle);

    if (this.type === 'antibody') {
      // Draw biological Y-shaped Immunoglobulin
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      // Stem of Y (Fc region)
      ctx.moveTo(-6, 0);
      ctx.lineTo(0, 0);
      // Fab arms of Y
      ctx.lineTo(6, -6);
      ctx.moveTo(0, 0);
      ctx.lineTo(6, 6);
      ctx.stroke();
    } else if (this.type === 'perforin') {
      // Sharpened biological lance beam
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, -3);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-10, 3);
      ctx.closePath();
      ctx.fill();
    } else if (this.isEnemy) {
      // Red spike thorn
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Defensin granule glow bullet
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
