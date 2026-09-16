/**
 * Pickup.js
 * Drop nutrisi, molekul ATP, dan tetesan sitokin yang mengapung di arena.
 */

import { PICKUP_TYPES } from '../data/items.js';

export class Pickup {
  constructor(x, y, typeKey) {
    this.x = x;
    this.y = y;
    this.typeKey = typeKey;
    this.def = PICKUP_TYPES[typeKey] || PICKUP_TYPES.atp_orb;

    this.radius = this.def.radius;
    this.color = this.def.color;
    this.glowColor = this.def.glowColor;
    if (this.def.canvasIcon) {
      this.icon = this.def.canvasIcon;
    } else if (this.def.icon) {
      this.icon = this.def.icon.includes('<svg') ? '✚' : this.def.icon;
    } else {
      this.icon = null;
    }

    this.bobOffset = Math.random() * Math.PI * 2;
    this.bobSpeed = 3;
    this.magnetRadius = 140;
    this.dead = false;
    this.lifetime = 45; // 45 seconds before dissolve
  }

  update(dt, player) {
    this.bobOffset += dt * this.bobSpeed;
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.dead = true;
      return;
    }

    // Magnetism towards player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < this.magnetRadius) {
      const pullSpeed = 280 * (1 - dist / this.magnetRadius) + 120;
      this.x += (dx / dist) * pullSpeed * dt;
      this.y += (dy / dist) * pullSpeed * dt;

      // Pickup collision
      if (dist < player.radius + this.radius) {
        this.dead = true;
        return true; // Collected!
      }
    }
    return false;
  }

  render(ctx, camera) {
    const camOffset = camera.getRenderOffset();
    const sx = this.x - camOffset.x;
    const sy = this.y - camOffset.y + Math.sin(this.bobOffset) * 4;

    if (
      sx < -30 || sx > camera.viewportWidth + 30 ||
      sy < -30 || sy > camera.viewportHeight + 30
    ) return;

    ctx.save();
    ctx.translate(sx, sy);

    // Glowing aura
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = 12;

    if (this.icon) {
      // Capsule or nutrient item with emoji
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.icon, 0, 0);
    } else {
      // Shimmering ATP or Cytokine orb
      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, this.color);
      grad.addColorStop(1, 'rgba(0,0,0,0.2)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
