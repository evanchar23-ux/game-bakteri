/**
 * touch.js
 * Mobile Touch Controls Engine for Viral Slayer
 * Provides Virtual Analog Joystick (Left thumb) & Action Buttons (Right thumb)
 * Supports Auto-Aim, Multi-touch, and Auto-Fullscreen.
 */

export class TouchControls {
  constructor(game) {
    this.game = game;
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);

    // Joystick state
    this.joystickZone = document.getElementById('joystick-zone');
    this.joystickBase = document.getElementById('joystick-base');
    this.joystickKnob = document.getElementById('joystick-knob');
    this.mobileControls = document.getElementById('mobile-controls');

    this.joystickTouchId = null;
    this.joystickOrigin = { x: 0, y: 0 };
    this.joystickVector = { dx: 0, dy: 0 };
    this.maxRadius = 45; // max displacement in pixels

    // Action buttons
    this.btnFire = document.getElementById('btn-touch-fire');
    this.btnDash = document.getElementById('btn-touch-dash');
    this.btnUlt = document.getElementById('btn-touch-ult');

    this.cdDash = document.getElementById('touch-cd-dash');
    this.cdUlt = document.getElementById('touch-cd-ult');

    this.isFiring = false;
    this.autoAimEnabled = localStorage.getItem('viral_slayer_autoaim') !== 'false'; // default: true
    this.autoFullscreenTriggered = false;

    this.init();
  }

  init() {
    this.setupAutoFullscreen();
    this.setupJoystick();
    this.setupActionButtons();
    this.setupCanvasTouchAim();
    this.setupPortraitWarning();
    this.updateControlsVisibility();

    window.addEventListener('resize', () => this.updateControlsVisibility());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateControlsVisibility();
        if (this.game) this.game.handleResize();
      }, 250);
    });
  }

  setupPortraitWarning() {
    const btnDismiss = document.getElementById('btn-dismiss-portrait');
    const warningOverlay = document.getElementById('portrait-warning-overlay');
    if (btnDismiss && warningOverlay) {
      btnDismiss.onclick = (e) => {
        e.stopPropagation();
        warningOverlay.classList.add('dismissed');
      };
    }
  }

  setAutoAim(enabled) {
    this.autoAimEnabled = enabled;
    try {
      localStorage.setItem('viral_slayer_autoaim', enabled ? 'true' : 'false');
    } catch (e) {
      console.warn('localStorage access denied', e);
    }
  }

  setupAutoFullscreen() {
    const triggerFullscreen = () => {
      if (this.autoFullscreenTriggered) return;
      if (this.isTouchDevice && !document.fullscreenElement) {
        const el = document.documentElement;
        const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs) {
          try {
            const res = rfs.call(el);
            if (res && typeof res.then === 'function') {
              res.then(() => {
                this.autoFullscreenTriggered = true;
              }).catch(() => {});
            } else {
              this.autoFullscreenTriggered = true;
            }
          } catch (e) {
            // Fullscreen not permitted or gesture missing
          }
        }
      }
    };

    window.addEventListener('touchstart', triggerFullscreen, { once: false, passive: true });
    window.addEventListener('click', triggerFullscreen, { once: false, passive: true });
  }

  updateControlsVisibility() {
    if (!this.mobileControls) return;
    const isMobileSize = window.innerWidth <= 1024 || ('ontouchstart' in window);
    const isPlaying = this.game && this.game.state === 'PLAYING';

    if (isMobileSize && isPlaying) {
      this.mobileControls.classList.remove('hidden');
    } else {
      this.mobileControls.classList.add('hidden');
      this.resetJoystick();
      this.isFiring = false;
    }
  }

  setupJoystick() {
    if (!this.joystickZone || !this.joystickBase || !this.joystickKnob) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      if (this.joystickTouchId !== null) return;

      const touch = e.changedTouches[0];
      this.joystickTouchId = touch.identifier;

      const baseRect = this.joystickBase.getBoundingClientRect();
      this.joystickOrigin = {
        x: baseRect.left + baseRect.width / 2,
        y: baseRect.top + baseRect.height / 2
      };

      this.updateJoystick(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystickTouchId) {
          this.updateJoystick(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.joystickTouchId) {
          this.resetJoystick();
          break;
        }
      }
    };

    this.joystickZone.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
  }

  updateJoystick(clientX, clientY) {
    const deltaX = clientX - this.joystickOrigin.x;
    const deltaY = clientY - this.joystickOrigin.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance === 0) {
      this.joystickVector = { dx: 0, dy: 0 };
      this.joystickKnob.style.transform = 'translate(0px, 0px)';
      return;
    }

    const angle = Math.atan2(deltaY, deltaX);
    const clampedDist = Math.min(distance, this.maxRadius);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;
    this.joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;

    const intensity = Math.min(1, distance / this.maxRadius);
    this.joystickVector = {
      dx: Math.cos(angle) * intensity,
      dy: Math.sin(angle) * intensity
    };
  }

  resetJoystick() {
    this.joystickTouchId = null;
    this.joystickVector = { dx: 0, dy: 0 };
    if (this.joystickKnob) {
      this.joystickKnob.style.transform = 'translate(0px, 0px)';
    }
  }

  setupActionButtons() {
    // 1. Primary Fire Button (Touch & Hold to continuously fire)
    if (this.btnFire) {
      const startFire = (e) => {
        e.preventDefault();
        this.isFiring = true;
        this.btnFire.classList.add('active');
        if (this.game && this.game.input) {
          this.game.input.mouse.isDown = true;
        }
      };

      const stopFire = (e) => {
        e.preventDefault();
        this.isFiring = false;
        this.btnFire.classList.remove('active');
        if (this.game && this.game.input) {
          this.game.input.mouse.isDown = false;
        }
      };

      this.btnFire.addEventListener('touchstart', startFire, { passive: false });
      this.btnFire.addEventListener('touchend', stopFire, { passive: false });
      this.btnFire.addEventListener('touchcancel', stopFire, { passive: false });
    }

    // 2. Tactical Skill (Dash / Phagocytosis)
    if (this.btnDash) {
      const triggerDash = (e) => {
        e.preventDefault();
        if (this.game && this.game.input) {
          this.game.input.spacePressed = true;
        }
        this.btnDash.classList.add('pressed');
        setTimeout(() => this.btnDash.classList.remove('pressed'), 180);
      };

      this.btnDash.addEventListener('touchstart', triggerDash, { passive: false });
    }

    // 3. Ultimate Skill (Cytokine Response)
    if (this.btnUlt) {
      const triggerUlt = (e) => {
        e.preventDefault();
        if (this.game && this.game.input) {
          this.game.input.qPressed = true;
        }
        this.btnUlt.classList.add('pressed');
        setTimeout(() => this.btnUlt.classList.remove('pressed'), 250);
      };

      this.btnUlt.addEventListener('touchstart', triggerUlt, { passive: false });
    }
  }

  setupCanvasTouchAim() {
    if (!this.game || !this.game.canvas) return;

    this.game.canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      const rect = this.game.canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      // Don't override if touching the joystick zone or action cluster
      if (touch.clientX < 220 && touch.clientY > window.innerHeight - 220) return;
      if (touch.clientX > window.innerWidth - 220 && touch.clientY > window.innerHeight - 220) return;

      if (this.game.input) {
        this.game.input.mouse.x = touchX;
        this.game.input.mouse.y = touchY;
      }
    }, { passive: true });
  }

  update(dt) {
    if (!this.game || this.game.state !== 'PLAYING') return;

    // Sync Action Buttons Cooldown Overlays with Player skills
    const player = this.game.player;
    if (player && player.cooldowns) {
      const cdFactor = 1 - (player.cooldownReduction || 0);

      if (this.cdDash && player.def && player.def.tacticalSkill) {
        const maxTacCd = player.def.tacticalSkill.cooldown * cdFactor;
        const tacPct = Math.max(0, (player.cooldowns.tactical / maxTacCd) * 100);
        this.cdDash.style.height = `${tacPct}%`;
      }

      if (this.cdUlt && player.def && player.def.ultimateSkill) {
        const maxUltCd = player.def.ultimateSkill.cooldown * cdFactor;
        const ultPct = Math.max(0, (player.cooldowns.ultimate / maxUltCd) * 100);
        this.cdUlt.style.height = `${ultPct}%`;
      }
    }

    // Handle Auto-Aiming when Firing on Mobile
    if (this.isFiring && this.autoAimEnabled && player) {
      const target = this.findBestTarget(player);
      if (target && this.game.camera && this.game.input) {
        const screenTargetX = target.x - this.game.camera.x;
        const screenTargetY = target.y - this.game.camera.y;
        this.game.input.mouse.x = screenTargetX;
        this.game.input.mouse.y = screenTargetY;
        this.game.input.mouse.worldX = target.x;
        this.game.input.mouse.worldY = target.y;
      }
    }
  }

  findBestTarget(player) {
    if (!this.game.pathogens || this.game.pathogens.length === 0) return null;

    let closestEnemy = null;
    let minDist = 750; // max aim range

    for (let p of this.game.pathogens) {
      if (p.dead) continue;
      const dist = Math.hypot(p.x - player.x, p.y - player.y);
      if (dist < minDist) {
        minDist = dist;
        closestEnemy = p;
      }
    }

    return closestEnemy;
  }
}
