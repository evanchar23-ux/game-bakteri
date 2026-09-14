/**
 * camera.js
 * Kamera 2D Mengikuti Sel Imun + Efek Screen Shake Dampak Kerusakan
 */

export class Camera {
  constructor(viewportWidth, viewportHeight, worldWidth, worldHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;

    // Cinematic Zoom
    this.zoom = 1.0;
    this.targetZoom = 1.0;
    this.zoomSpeed = 2.0;
  }

  resize(w, h) {
    this.viewportWidth = w;
    this.viewportHeight = h;
  }

  setZoom(zoom) {
    this.zoom = zoom;
    this.targetZoom = zoom;
  }

  zoomTo(targetZoom, speed = 2.0) {
    this.targetZoom = targetZoom;
    this.zoomSpeed = speed;
  }

  follow(target, lerp = 0.08) {
    this.targetX = target.x - this.viewportWidth / 2;
    this.targetY = target.y - this.viewportHeight / 2;

    // Smooth lerp
    this.x += (this.targetX - this.x) * lerp;
    this.y += (this.targetY - this.y) * lerp;

    // Clamp to arena bounds
    this.x = Math.max(0, Math.min(this.worldWidth - this.viewportWidth, this.x));
    this.y = Math.max(0, Math.min(this.worldHeight - this.viewportHeight, this.y));
  }

  shake(intensity = 8, duration = 0.25) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  update(dt) {
    // Zoom lerp
    if (Math.abs(this.zoom - this.targetZoom) > 0.001) {
      this.zoom += (this.targetZoom - this.zoom) * Math.min(1, dt * this.zoomSpeed);
    } else {
      this.zoom = this.targetZoom;
    }

    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      const factor = this.shakeDuration;
      this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity * factor;
      this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity * factor;
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  getRenderOffset() {
    return {
      x: Math.round(this.x + this.shakeOffsetX),
      y: Math.round(this.y + this.shakeOffsetY)
    };
  }
}
