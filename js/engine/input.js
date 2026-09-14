/**
 * input.js
 * Manajemen Kontrol: Keyboard (WASD/Panah/Space/Q/E), Mouse Position & Click.
 */

export class InputHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      worldX: 0,
      worldY: 0,
      isDown: false,
      rightDown: false
    };

    this.spacePressed = false;
    this.qPressed = false;
    this.ePressed = false;

    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') {
        this.spacePressed = true;
        e.preventDefault();
      }
      if (e.code === 'KeyQ') this.qPressed = true;
      if (e.code === 'KeyE') this.ePressed = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') this.spacePressed = false;
      if (e.code === 'KeyQ') this.qPressed = false;
      if (e.code === 'KeyE') this.ePressed = false;
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.mouse.isDown = true;
      } else if (e.button === 2) {
        this.mouse.rightDown = true;
        this.spacePressed = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.isDown = false;
      if (e.button === 2) {
        this.mouse.rightDown = false;
        this.spacePressed = false;
      }
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  updateWorldMouse(camera) {
    this.mouse.worldX = this.mouse.x + camera.x;
    this.mouse.worldY = this.mouse.y + camera.y;
  }

  getMovementVector() {
    let dx = 0;
    let dy = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    return { dx, dy };
  }

  consumeSpace() {
    const p = this.spacePressed;
    this.spacePressed = false;
    return p;
  }

  consumeQorE() {
    const p = this.qPressed || this.ePressed;
    this.qPressed = false;
    this.ePressed = false;
    return p;
  }
}
