/**
 * game.js
 * Inti Game Loop & State Manager Viral Slayer
 * Mengatur siklus permainan, gelombang patogen, collision, HUD, modal debriefing, dan telemetri imunologi.
 */

import { IMMUNE_CELLS } from './data/cells.js';
import { PATHOGENS } from './data/pathogens.js';
import { ORGAN_STAGES, SUBJECT_DATA } from './data/organs.js';
import { CYTOKINE_UPGRADES } from './data/upgrades.js';
import { PICKUP_TYPES } from './data/items.js';
import { IMMUNOPEDIA_DATA } from './data/immunopediaData.js';
import { getSpecimenIllustrationSVG } from './engine/specimenVisualizer.js';

import { Player } from './entities/Player.js';
import { Pathogen } from './entities/Pathogen.js';
import { Pickup } from './entities/Pickup.js';
import { Projectile } from './entities/Projectile.js';
import { AlliedSentinel } from './entities/AlliedSentinel.js';

import { Camera } from './engine/camera.js';
import { InputHandler } from './engine/input.js';
import { ParticleSystem } from './engine/particles.js';
import { WorldRenderer } from './engine/renderer.js';
import { sound } from './audio/sound.js';
import { EducationalCinema } from './engine/educationalCinema.js';
import { Hologram3DViewer } from './engine/hologram3d.js';
import { Cell3DViewer } from './engine/cell3d.js';
import { CinematicIntro3D } from './engine/CinematicIntro3D.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Dimensions
    this.worldWidth = 2400;
    this.worldHeight = 2400;

    // Subsystems
    this.camera = new Camera(window.innerWidth, window.innerHeight, this.worldWidth, this.worldHeight);
    this.input = new InputHandler(this.canvas);
    this.particles = new ParticleSystem();
    this.renderer = new WorldRenderer();

    // Game State
    this.state = 'MENU'; // MENU, PLAYING, UPGRADE, VICTORY, GAMEOVER
    this.selectedCellKey = 'macrophage';
    this.selectedOrganKey = 'lungs';

    // Entities
    this.player = null;
    this.allies = [];
    this.pathogens = [];
    this.projectiles = [];
    this.pickups = [];

    // Stage & Wave Metrics
    this.currentSubjectIndex = 0;
    this.organDef = ORGAN_STAGES.lungs;
    this.currentWaveIdx = 0;
    this.spawnTimer = 0;
    this.enemiesRemainingToSpawn = [];
    this.cfuCleared = 0;
    this.antigenTiter = 0;
    this.organIntegrity = 100; // 0 - 100%
    this.missionStartTime = 0;

    // Dynamic Swarm Events & Biological Pulse
    this.swarmEventTimer = 22;
    this.heartbeatTimer = 2.4;

    // Buffs & Modifiers
    this.activeBuffs = [];
    this.freezeViruses = false;

    // Telemetry log queue
    this.telemetryQueue = [];

    // Stage Entrance Cinematic State
    this.isCinematicActive = false;
    this.cinematicTimer = 0;
    this.cinematicImpactTriggered = false;

    // UI Cache
    this.bindUIElements();
    this.initMenuLivingEngine();
    this.particles.initAmbientCells(this.worldWidth, this.worldHeight, 80);

    // Resize handler
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.resize(this.canvas.width, this.canvas.height);
    if (this.menuAmbientCanvas) {
      this.menuAmbientCanvas.width = window.innerWidth;
      this.menuAmbientCanvas.height = window.innerHeight;
    }
  }

  bindUIElements() {
    // Overlays
    // Savage 3D Cinematic Intro Engine (Bioskop 3D Dive)
    this.uiPrologue = document.getElementById('prologue-overlay');
    this.btnSkipPrologue = document.getElementById('btn-skip-prologue');
    this.cinematicPrompt = document.getElementById('cinematic-start-prompt');
    this.cinematicCanvas = document.getElementById('cinematicIntroCanvas');
    this.isPrologueFinished = false;

    if (this.cinematicCanvas) {
      this.cinematicIntro = new CinematicIntro3D(this.cinematicCanvas, () => {
        this.finishPrologue();
      });

      const launchCinematic = () => {
        if (this.isPrologueFinished) return;
        if (this.cinematicPrompt) {
          this.cinematicPrompt.classList.add('dismissed');
          setTimeout(() => {
            if (this.cinematicPrompt) this.cinematicPrompt.style.display = 'none';
          }, 450);
        }
        if (this.cinematicIntro) {
          this.cinematicIntro.start();
        }
      };

      if (this.cinematicPrompt) {
        this.cinematicPrompt.onclick = (e) => {
          e.stopPropagation();
          launchCinematic();
        };
      }

      if (this.uiPrologue) {
        this.uiPrologue.onclick = () => {
          launchCinematic();
        };
      }

      // Fallback: auto launch after 2 seconds if user doesn't click prompt
      this.autoLaunchTimer = setTimeout(() => {
        if (!this.isPrologueFinished && (!this.cinematicIntro || !this.cinematicIntro.isPlaying)) {
          launchCinematic();
        }
      }, 2200);
    }

    if (this.btnSkipPrologue) {
      this.btnSkipPrologue.onclick = (e) => {
        e.stopPropagation();
        this.finishPrologue();
      };
    }

    this.uiMenu = document.getElementById('main-menu');
    this.uiCharSelect = document.getElementById('character-select');
    this.uiOrganSelect = document.getElementById('organ-select');
    this.uiUpgrade = document.getElementById('upgrade-modal');
    this.uiVictory = document.getElementById('victory-modal');
    this.uiGameOver = document.getElementById('gameover-modal');
    this.uiImmunopedia = document.getElementById('immunopedia-modal');
    this.uiHowToPlay = document.getElementById('howtoplay-modal');
    this.uiTeaser = document.getElementById('teaser-modal');
    this.uiHUD = document.getElementById('hud');

    // Stage Entrance Cinematic Overlay
    this.uiEntranceCinematic = document.getElementById('entrance-cinematic');
    this.entranceOrganIcon = document.getElementById('entrance-organ-icon');
    this.entranceOrganTitle = document.getElementById('entrance-organ-title');
    this.entranceOrganSubtitle = document.getElementById('entrance-organ-subtitle');
    this.entranceThreatLevel = document.getElementById('entrance-threat-level');
    this.entranceCellUnit = document.getElementById('entrance-cell-unit');
    this.entranceDirective = document.getElementById('entrance-mission-directive');

    if (this.uiEntranceCinematic) {
      this.uiEntranceCinematic.onclick = () => {
        if (this.isCinematicActive) {
          this.finishCinematic();
        }
      };
    }

    // Educational Cinema Engine (Durasi >= 60 detik, Multi-Voice Edukasi Interaktif)
    this.teaserCanvas = document.getElementById('teaserCanvas');
    if (this.teaserCanvas) {
      this.eduCinema = new EducationalCinema(this.teaserCanvas, () => {
        const b = document.getElementById('btn-play-from-teaser');
        if (b) b.classList.add('glow-btn');
      });
    }

    // HUD bars
    this.hudHpBar = document.getElementById('hud-hp-bar');
    this.hudHpText = document.getElementById('hud-hp-text');
    this.hudAtpBar = document.getElementById('hud-atp-bar');
    this.hudAtpText = document.getElementById('hud-atp-text');
    this.hudExpBar = document.getElementById('hud-exp-bar');
    this.hudExpText = document.getElementById('hud-exp-percent');
    this.hudLevel = document.getElementById('hud-level');
    this.hudCellName = document.getElementById('hud-cell-name');
    this.hudAvatar = document.getElementById('hud-avatar');

    this.hudOrganName = document.getElementById('hud-organ-name');
    this.hudOrganIcon = document.getElementById('hud-organ-icon');
    this.hudOrganBar = document.getElementById('hud-organ-bar');
    this.hudOrganText = document.getElementById('hud-organ-text');
    this.hudWaveNum = document.getElementById('hud-wave-num');
    this.hudEnemyCount = document.getElementById('hud-enemy-count');

    this.hudCfu = document.getElementById('hud-cfu-cleared');
    this.hudTiter = document.getElementById('hud-antigen-titer');
    this.telemetryBox = document.getElementById('telemetry-box');
    this.buffsDock = document.getElementById('hud-buffs-dock');
    this.hudSwarmBanner = document.getElementById('hud-swarm-banner');
    this.hudSwarmBannerText = document.getElementById('hud-swarm-banner-text');

    // Progres Sterilisasi Organ & Tanda Mau Menang
    this.hudClearanceWrap = document.getElementById('hud-clearance-wrap');
    this.hudClearancePercent = document.getElementById('hud-clearance-percent');
    this.hudClearanceBar = document.getElementById('hud-clearance-bar');
    this.hudVictoryCountdown = document.getElementById('hud-victory-countdown');
    this.hudVictoryCountdownText = document.getElementById('hud-victory-countdown-text');
    this.hudVictoryBanner = document.getElementById('hud-victory-banner');

    // Debrief & Rewards Elements
    this.debOrganName = document.getElementById('deb-organ-name');
    this.debGradeLetter = document.getElementById('deb-grade-letter');
    this.debGradeTitle = document.getElementById('deb-grade-title');
    this.debMedalIcon = document.getElementById('deb-medal-icon');
    this.debMedalName = document.getElementById('deb-medal-name');
    this.debMedalDesc = document.getElementById('deb-medal-desc');
    this.debRewardTiter = document.getElementById('deb-reward-titer');
    this.debRewardUnlock = document.getElementById('deb-reward-unlock');

    // Skill slots
    this.cdTactical = document.getElementById('cd-tactical');
    this.cdUltimate = document.getElementById('cd-ultimate');
    this.skillBasicName = document.getElementById('skill-basic-name');
    this.skillBasicIcon = document.getElementById('skill-basic-icon');
    this.skillTacticalName = document.getElementById('skill-tactical-name');
    this.skillTacticalIcon = document.getElementById('skill-tactical-icon');
    this.skillUltimateName = document.getElementById('skill-ultimate-name');
    this.skillUltimateIcon = document.getElementById('skill-ultimate-icon');

    // Setup interactive buttons
    this.setupButtonEvents();
    this.renderCharacterSelectionCards();
    this.renderOrganSelectionCards();
    this.initHologram3DRotator();
    this.initBioTerminal();
  }

  showSwarmBanner(text) {
    if (!this.hudSwarmBanner) return;
    if (this.hudSwarmBannerText) this.hudSwarmBannerText.innerText = text;
    this.hudSwarmBanner.classList.remove('hidden');
    clearTimeout(this.swarmBannerTimeout);
    this.swarmBannerTimeout = setTimeout(() => {
      if (this.hudSwarmBanner) this.hudSwarmBanner.classList.add('hidden');
    }, 3200);
  }

  setupButtonEvents() {
    // Start Game -> Character Selection FIRST!
    document.getElementById('btn-start-expedition').onclick = () => {
      sound.init();
      this.showScreen(this.uiCharSelect);
      this.renderCharacterSelectionCards();
      if (this.cell3d) {
        setTimeout(() => this.cell3d.handleResize(), 60);
      }
    };

    // Pilih Karakter button in main menu
    const btnMenuChar = document.getElementById('btn-menu-char-select');
    if (btnMenuChar) {
      btnMenuChar.onclick = () => {
        sound.init();
        this.showScreen(this.uiCharSelect);
        this.renderCharacterSelectionCards();
        if (this.cell3d) {
          setTimeout(() => this.cell3d.handleResize(), 60);
        }
      };
    }

    // Settings modal
    const uiSettings = document.getElementById('settings-modal');
    const btnSettings = document.getElementById('btn-menu-settings');
    if (btnSettings && uiSettings) {
      btnSettings.onclick = () => {
        sound.init();
        this.showScreen(uiSettings);
      };
      document.getElementById('btn-close-settings').onclick = () => this.hideScreen(uiSettings);
      document.getElementById('btn-ok-settings').onclick = () => this.hideScreen(uiSettings);
      document.getElementById('btn-toggle-sound-settings').onclick = (e) => {
        const muted = sound.toggleMute();
        e.target.innerText = muted ? '🔇 SENYAP' : '🔊 AKTIF';
        document.getElementById('audio-icon').innerText = muted ? '🔇' : '🔊';
      };
    }

    // Trailer preview click -> Launch Educational Cinema (60s+ Multi-Voice)
    const trailerBox = document.getElementById('trailer-box');
    if (trailerBox) {
      trailerBox.onclick = () => {
        sound.init();
        if (this.uiTeaser && this.eduCinema) {
          this.showScreen(this.uiTeaser);
          this.eduCinema.start();
        }
      };
    }

    // Educational Cinema controls
    const btnCloseTeaser = document.getElementById('btn-close-teaser');
    if (btnCloseTeaser) {
      btnCloseTeaser.onclick = () => {
        if (this.eduCinema) this.eduCinema.stop();
        this.hideScreen(this.uiTeaser);
        this.showScreen(this.uiMenu);
      };
    }

    const btnPlayPause = document.getElementById('edu-btn-playpause');
    if (btnPlayPause) {
      btnPlayPause.onclick = () => {
        if (this.eduCinema) {
          this.eduCinema.togglePlayPause();
        }
      };
    }

    const btnReplay = document.getElementById('btn-replay-teaser');
    if (btnReplay) {
      btnReplay.onclick = () => {
        if (this.eduCinema) {
          this.eduCinema.start();
        }
      };
    }

    const btnMute = document.getElementById('edu-btn-mute');
    if (btnMute) {
      btnMute.onclick = () => {
        if (this.eduCinema) {
          this.eduCinema.toggleMute();
        }
      };
    }

    const progressTrack = document.getElementById('edu-progress-track');
    if (progressTrack) {
      progressTrack.onclick = (e) => {
        if (this.eduCinema) {
          const rect = progressTrack.getBoundingClientRect();
          const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const pct = clickX / rect.width;
          this.eduCinema.seek(pct * this.eduCinema.duration);
        }
      };
    }

    const btnPlayFromTeaser = document.getElementById('btn-play-from-teaser');
    if (btnPlayFromTeaser) {
      btnPlayFromTeaser.onclick = () => {
        if (this.eduCinema) this.eduCinema.stop();
        this.hideScreen(this.uiTeaser);
        this.showScreen(this.uiCharSelect);
        this.renderCharacterSelectionCards();
        if (this.cell3d) {
          setTimeout(() => this.cell3d.handleResize(), 60);
        }
      };
    }

    // Open Immunopedia Holographic Bio-Terminal
    const btnOpenImmunopedia = document.getElementById('btn-open-immunopedia');
    if (btnOpenImmunopedia) {
      btnOpenImmunopedia.onclick = () => {
        sound.init();
        this.showScreen(this.uiImmunopedia);
        this.displayTerminalSpecimen(this.currentTerminalIndex);
        if (sound.playRewardClaim) sound.playRewardClaim();
        else if (window.sound && window.sound.playClick) window.sound.playClick();
      };
    }
    const btnCloseImmunopedia = document.getElementById('btn-close-immunopedia');
    if (btnCloseImmunopedia) {
      btnCloseImmunopedia.onclick = () => {
        this.hideScreen(this.uiImmunopedia);
        if (window.sound && window.sound.playClick) window.sound.playClick();
      };
    }

    // Open How To Play
    document.getElementById('btn-open-howtoplay').onclick = () => {
      sound.init();
      this.showScreen(this.uiHowToPlay);
    };
    document.getElementById('btn-close-howtoplay').onclick = () => {
      this.hideScreen(this.uiHowToPlay);
    };
    document.getElementById('btn-ok-howtoplay').onclick = () => {
      this.hideScreen(this.uiHowToPlay);
    };

    // Character Select navigation
    document.getElementById('btn-back-to-main').onclick = () => {
      this.showScreen(this.uiMenu);
    };
    document.getElementById('btn-proceed-to-organ').onclick = () => {
      this.showScreen(this.uiOrganSelect);
      this.renderSubjectUI();
      if (this.hologram3d) {
        setTimeout(() => this.hologram3d.handleResize(), 60);
      }
    };

    // Subject Selection
    document.getElementById('btn-prev-subject').onclick = () => {
      this.currentSubjectIndex--;
      if (this.currentSubjectIndex < 0) this.currentSubjectIndex = SUBJECT_DATA.length - 1;
      this.renderSubjectUI();
      if (window.sound) window.sound.playClick();
    };
    
    document.getElementById('btn-next-subject').onclick = () => {
      this.currentSubjectIndex++;
      if (this.currentSubjectIndex >= SUBJECT_DATA.length) this.currentSubjectIndex = 0;
      this.renderSubjectUI();
      if (window.sound) window.sound.playClick();
    };

    // Organ Select navigation
    document.getElementById('btn-back-to-char').onclick = () => {
      this.showScreen(this.uiCharSelect);
      this.renderCharacterSelectionCards();
      if (this.cell3d) {
        setTimeout(() => this.cell3d.handleResize(), 60);
      }
    };
    document.getElementById('btn-deploy-mission').onclick = () => {
      this.startMission();
    };

    // Debriefing actions
    const btnVictoryHome = document.getElementById('btn-victory-home');
    if (btnVictoryHome) {
      btnVictoryHome.onclick = () => {
        sound.playRewardClaim();
        this.showScreen(this.uiMenu);
      };
    }
    const btnVictoryRetry = document.getElementById('btn-victory-retry');
    if (btnVictoryRetry) {
      btnVictoryRetry.onclick = () => {
        sound.playRewardClaim();
        this.startMission();
      };
    }
    document.getElementById('btn-retry').onclick = () => {
      this.startMission();
    };
    document.getElementById('btn-gameover-home').onclick = () => {
      this.showScreen(this.uiMenu);
    };

    // Audio toggle
    document.getElementById('audio-toggle').onclick = () => {
      sound.init();
      const muted = sound.toggleMute();
      document.getElementById('audio-icon').innerText = muted ? '🔇' : '🔊';
    };

    // Immunopedia Bio-Terminal Category Filters
    document.querySelectorAll('.terminal-filter-btn').forEach((btn) => {
      btn.onclick = () => {
        sound.init();
        if (window.sound && window.sound.playClick) window.sound.playClick();
        const filter = btn.dataset.filter || 'all';
        this.filterTerminalCategory(filter);
      };
    });

    // Bio-Terminal Navigation Paddles
    const btnTermPrev = document.getElementById('terminal-btn-prev');
    const btnTermNext = document.getElementById('terminal-btn-next');
    if (btnTermPrev) {
      btnTermPrev.onclick = () => {
        sound.init();
        this.navigateTerminalSpecimen(-1);
      };
    }
    if (btnTermNext) {
      btnTermNext.onclick = () => {
        sound.init();
        this.navigateTerminalSpecimen(1);
      };
    }

    // Bio-Terminal Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (this.uiImmunopedia && !this.uiImmunopedia.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          this.navigateTerminalSpecimen(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          this.navigateTerminalSpecimen(1);
        } else if (e.key === 'Escape') {
          this.hideScreen(this.uiImmunopedia);
        }
      }
    });
  }

  finishPrologue() {
    if (this.isPrologueFinished) return;
    this.isPrologueFinished = true;
    if (this.autoLaunchTimer) clearTimeout(this.autoLaunchTimer);

    if (this.cinematicIntro) {
      this.cinematicIntro.finish();
    }

    if (this.uiPrologue) {
      this.uiPrologue.classList.add('hidden');
      this.uiPrologue.style.pointerEvents = 'none';
      setTimeout(() => {
        if (this.uiPrologue) {
          this.uiPrologue.style.display = 'none';
          if (this.uiPrologue.parentNode) {
            this.uiPrologue.remove();
          }
        }
      }, 900);
    }

    if (this.uiMenu) {
      this.uiMenu.classList.remove('hidden');
      this.uiMenu.classList.add('active');
      this.uiMenu.classList.add('menu-fade-enter');
      this.uiMenu.style.pointerEvents = 'auto';

      setTimeout(() => {
        if (this.uiMenu) {
          this.uiMenu.classList.remove('menu-fade-enter');
          this.uiMenu.style.opacity = '1';
        }
      }, 980);
    }
    sound.init();
    sound.playCinematicMenuWhoosh();
    sound.playAmbientLoop();
  }

  showScreen(targetOverlay) {
    [this.uiPrologue, this.uiMenu, this.uiCharSelect, this.uiOrganSelect, this.uiUpgrade, this.uiVictory, this.uiGameOver, this.uiTeaser, this.uiEntranceCinematic].forEach((el) => {
      if (el) el.classList.add('hidden');
    });
    if (this.uiEntranceCinematic) this.uiEntranceCinematic.classList.remove('active');
    if (targetOverlay) targetOverlay.classList.remove('hidden');
  }

  hideScreen(targetOverlay) {
    if (targetOverlay) targetOverlay.classList.add('hidden');
  }

  initMenuLivingEngine() {
    this.menuArtwork = document.getElementById('main-menu-artwork');
    this.menuAmbientCanvas = document.getElementById('menuAmbientCanvas');
    if (this.menuAmbientCanvas) {
      this.menuAmbientCtx = this.menuAmbientCanvas.getContext('2d');
      this.menuAmbientCanvas.width = window.innerWidth;
      this.menuAmbientCanvas.height = window.innerHeight;
    }

    this.menuParallaxX = 0;
    this.menuParallaxY = 0;
    this.menuParallaxTargetX = 0;
    this.menuParallaxTargetY = 0;

    // Track mouse for 3D parallax depth
    window.addEventListener('mousemove', (e) => {
      if (this.uiMenu && !this.uiMenu.classList.contains('hidden')) {
        this.menuParallaxTargetX = (e.clientX / window.innerWidth - 0.5) * -18;
        this.menuParallaxTargetY = (e.clientY / window.innerHeight - 0.5) * -14;
      }
    });

    // Seed menu ambient floating cellular particles
    this.menuParticles = [];
    for (let i = 0; i < 32; i++) {
      this.menuParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 8 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 14,
        speedY: -8 - Math.random() * 18,
        parallaxFactor: 0.3 + Math.random() * 1.1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        type: Math.random() > 0.35 ? 'rbc' : 'cytokine',
        alpha: 0.12 + Math.random() * 0.22
      });
    }

    // Attach bio-acoustic hover and click sounds to all action buttons & cards
    document.querySelectorAll('.action-btn-pill, .sensor-feed-box, .organ-threat-pill, .menu-btn, .video-panel, .threat').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        sound.init();
        sound.playHover();
      });
      btn.addEventListener('click', () => {
        sound.init();
        sound.playClick();
      });
    });
  }

  updateMenuLivingEngine(dt) {
    if (!this.uiMenu || this.uiMenu.classList.contains('hidden')) return;

    // Smooth Parallax Lerp
    this.menuParallaxX += (this.menuParallaxTargetX - this.menuParallaxX) * 0.08;
    this.menuParallaxY += (this.menuParallaxTargetY - this.menuParallaxY) * 0.08;

    if (this.menuArtwork) {
      this.menuArtwork.style.transform = `scale(1.06) translate(${this.menuParallaxX.toFixed(2)}px, ${this.menuParallaxY.toFixed(2)}px)`;
    }

    if (!this.menuAmbientCtx) return;
    const ctx = this.menuAmbientCtx;
    const w = this.menuAmbientCanvas.width;
    const h = this.menuAmbientCanvas.height;
    ctx.clearRect(0, 0, w, h);

    // Update & Render Floating Menu Cells
    for (let p of this.menuParticles) {
      p.x += p.speedX * dt;
      p.y += p.speedY * dt;
      p.rotation += p.rotSpeed;

      if (p.x < -40) p.x = w + 40;
      if (p.x > w + 40) p.x = -40;
      if (p.y < -40) p.y = h + 40;
      if (p.y > h + 40) p.y = -40;

      const px = p.x + this.menuParallaxX * p.parallaxFactor;
      const py = p.y + this.menuParallaxY * p.parallaxFactor;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;

      if (p.type === 'rbc') {
        // Translucent floating biconcave red blood cell
        ctx.fillStyle = 'rgba(215, 35, 65, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius, p.radius * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner dimple
        ctx.fillStyle = 'rgba(120, 10, 25, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 0.45, p.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Luminous floating cytokine spore
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, p.radius * 0.6);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#00f2fe');
        grad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  renderCharacterSelectionCards() {
    const chipsContainer = document.getElementById('cell-selector-chips');
    const dossierContainer = document.getElementById('cell-active-dossier');
    const telemetryStatus = document.getElementById('cell-telemetry-status');
    const btnNext = document.getElementById('btn-proceed-to-organ');
    if (!chipsContainer || !dossierContainer) return;

    if (!this.cell3d && document.getElementById('cell3dCanvas')) {
      this.cell3d = new Cell3DViewer({
        container: document.getElementById('cell-3d-pod'),
        canvas: document.getElementById('cell3dCanvas'),
        telemetryEl: telemetryStatus
      });
    }

    if (!this.selectedCellKey || !IMMUNE_CELLS[this.selectedCellKey]) {
      this.selectedCellKey = 'macrophage';
    }

    const updateDossier = (cellKey) => {
      const cell = IMMUNE_CELLS[cellKey] || IMMUNE_CELLS.macrophage;

      if (telemetryStatus) {
        telemetryStatus.innerText = `MIKROSKOPI 3D AKTIF // ${cell.name.toUpperCase()} (DIAMETER: ${cell.radius}µm)`;
      }

      dossierContainer.innerHTML = `
        <div class="cell-dossier-header">
          <div class="cell-dossier-title-wrap">
            <h3><span>${cell.avatar}</span> ${cell.name}</h3>
            <span class="cell-dossier-badge" style="color: ${cell.color}; border-color: ${cell.color}44; background: ${cell.color}15;">${cell.badge}</span>
          </div>
          <div style="font-size: 11px; color: ${cell.color}; font-weight: 700; font-family: var(--font-display);">
            STATUS: SIAP DISTRIBUSI ⚔️
          </div>
        </div>

        <p class="cell-dossier-lore">${cell.lore}</p>

        <div class="cell-stats-skills-grid">
          <!-- Left: Stats -->
          <div class="cell-stats-box">
            <span class="box-micro-label">📊 STATISTIK BIOLOGIS</span>
            
            <div class="stat-metric-row">
              <span class="stat-metric-name">Daya Tahan (HP)</span>
              <div class="stat-metric-bar-wrap">
                <div class="stat-metric-bar">
                  <div class="stat-metric-fill" style="width: ${(cell.baseStats.maxHp / 800) * 100}%; background: #ff007f;"></div>
                </div>
                <span class="stat-metric-val">${cell.baseStats.maxHp}</span>
              </div>
            </div>

            <div class="stat-metric-row">
              <span class="stat-metric-name">Mobilitas (Speed)</span>
              <div class="stat-metric-bar-wrap">
                <div class="stat-metric-bar">
                  <div class="stat-metric-fill" style="width: ${(cell.baseStats.speed / 220) * 100}%; background: #00ff88;"></div>
                </div>
                <span class="stat-metric-val">${cell.baseStats.speed}</span>
              </div>
            </div>

            <div class="stat-metric-row">
              <span class="stat-metric-name">Critical Affinity</span>
              <div class="stat-metric-bar-wrap">
                <div class="stat-metric-bar">
                  <div class="stat-metric-fill" style="width: ${(cell.baseStats.critChance / 0.3) * 100}%; background: #ffaa00;"></div>
                </div>
                <span class="stat-metric-val">${Math.round(cell.baseStats.critChance * 100)}%</span>
              </div>
            </div>

            <div class="stat-metric-row">
              <span class="stat-metric-name">ATP Regen / Detik</span>
              <div class="stat-metric-bar-wrap">
                <div class="stat-metric-bar">
                  <div class="stat-metric-fill" style="width: ${(cell.baseStats.atpRegen / 15) * 100}%; background: #00f2fe;"></div>
                </div>
                <span class="stat-metric-val">${cell.baseStats.atpRegen}</span>
              </div>
            </div>
          </div>

          <!-- Right: Arsenal & Skills -->
          <div class="cell-skills-box">
            <span class="box-micro-label">⚡ ARSENAL & TAKTIK</span>
            <div class="cell-skill-row">
              <span class="cell-skill-tag">💥 <strong>Utama:</strong> ${cell.basicAttack.name}</span>
              <span class="cell-skill-desc">${cell.basicAttack.description || ''}</span>
            </div>
            <div class="cell-skill-row">
              <span class="cell-skill-tag"><svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> <strong>Taktis:</strong> ${cell.tacticalSkill.name}</span>
              <span class="cell-skill-desc">${cell.tacticalSkill.description || ''}</span>
            </div>
            <div class="cell-skill-row">
              <span class="cell-skill-tag">⚡ <strong>Bio-Ult:</strong> ${cell.ultimateSkill.name}</span>
              <span class="cell-skill-desc">${cell.ultimateSkill.description || ''}</span>
            </div>
          </div>
        </div>

        <div class="cell-bio-fact">
          <strong>🔬 CATATAN FISIOLOGI & IMUNOLOGI:</strong> ${cell.passive.description}
        </div>
      `;

      if (btnNext) {
        btnNext.disabled = false;
        btnNext.innerHTML = `PILIH ORGAN TUBUH UNTUK ${cell.name.toUpperCase()} ➔`;
      }
    };

    const selectCell = (cellKey, shouldPlaySound = true) => {
      this.selectedCellKey = cellKey;
      if (shouldPlaySound && window.sound) window.sound.playClick();

      // Update 3D Model
      if (this.cell3d) {
        this.cell3d.showCell(cellKey);
      }

      // Update Tiles
      document.querySelectorAll('.cell-tile-btn').forEach((btn) => {
        if (btn.dataset.cell === cellKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      updateDossier(cellKey);
    };

    // Render Quick Selector Tiles
    chipsContainer.innerHTML = '';
    Object.values(IMMUNE_CELLS).forEach((cell) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = `cell-tile-btn ${cell.id === this.selectedCellKey ? 'active' : ''}`;
      tile.dataset.cell = cell.id;
      tile.style.setProperty('--tile-color', cell.color);
      tile.style.setProperty('--tile-active-bg', `${cell.color}22`);
      tile.style.setProperty('--tile-glow', `${cell.color}66`);

      tile.innerHTML = `
        <div class="cell-tile-avatar" style="border-color: ${cell.color}44;">${cell.avatar}</div>
        <span class="cell-tile-name">${cell.name}</span>
        <span class="cell-tile-sub" style="color: ${cell.color}">${cell.badge}</span>
      `;

      tile.onclick = () => selectCell(cell.id, true);
      tile.onmouseenter = () => { if (window.sound) window.sound.playHover(); };
      chipsContainer.appendChild(tile);
    });

    // Initial select
    selectCell(this.selectedCellKey, false);
  }

  renderSubjectUI() {
    const subject = SUBJECT_DATA[this.currentSubjectIndex];
    const nameDisplay = document.getElementById('subject-name-display');
    if (nameDisplay) nameDisplay.innerText = `SUBJECT: ${subject.name}`;

    if (this.hologram3d) {
      this.hologram3d.changeModel(subject.model, subject.targetHeight, subject.internalScale);
      this.hologram3d.showOrgans(subject.organs.map(o => o.id));
    }
    
    // Clear dynamic hotspots
    const svgGroup = document.getElementById('dynamic-hotspots');
    if (svgGroup) {
      svgGroup.innerHTML = '';
      subject.organs.forEach(orgDef => {
        const organKey = orgDef.id;
        const organData = ORGAN_STAGES[organKey];
        if (!organData) return;
        
        let svgIcon = '';
        if (organKey === 'lungs') {
          svgIcon = `<path d="M12 4v8M12 7c-2-2-5-1-6 2s0 7 2 9 4 1 4 1M12 7c2-2 5-1 6 2s0 7-2 9-4 1-4 1" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>`;
        } else if (organKey === 'bloodstream') {
          svgIcon = `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="none" stroke="#ffffff" stroke-width="2.4"/>`;
        } else if (organKey === 'gut') {
          svgIcon = `<path d="M6 7c0-2 2-3 4-3s4 1.5 4 3.5c0 3-4 3-4 5.5s4 2.5 4 5c0 2-2 3-4 3s-4-1.5-4-3.5" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>`;
        } else if (organKey === 'skin') {
          svgIcon = `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="#ffffff" stroke-width="2.4"/>`;
        } else if (organKey === 'brain') {
          svgIcon = `<path d="M12 4c-3.3 0-6 2.7-6 6 0 1.9 1 3.6 2.4 4.6.4.3.6.8.6 1.4v2c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2c0-.5.2-1.1.6-1.4 1.4-1 2.4-2.7 2.4-4.6 0-3.3-2.7-6-6-6z" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>`;
        } else if (organKey === 'stomach') {
          svgIcon = `<path d="M7 6c0-2.2 1.8-4 4-4s4 1.8 4 4c0 3.3-2 6-4 9-2-3-4-5.7-4-9z" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>`;
        }

        const labelText = organData.name.split(' ')[0].toUpperCase();
        const alignLeft = orgDef.cx < 160;

        const nodeHtml = `
          <g class="organ-hotspot-node" id="hotspot-${organKey}" data-organ="${organKey}" transform="translate(${orgDef.cx}, ${orgDef.cy})">
            <circle class="hotspot-pulse-ring" r="23"/>
            <circle class="hotspot-pulse-ring-outer" r="34"/>
            <circle class="hotspot-core" r="14"/>
            <g transform="translate(-7, -7) scale(0.6)">
              ${svgIcon}
            </g>
            <text class="hotspot-label" x="${alignLeft ? -28 : 32}" y="${orgDef.cy > 180 ? 22 : -4}">${labelText}</text>
          </g>
        `;
        svgGroup.insertAdjacentHTML('beforeend', nodeHtml);
      });
    }

    // Default select first organ of this subject
    this.selectedOrganKey = subject.organs[0].id;
    this.renderOrganSelectionCards();
  }

  renderOrganSelectionCards() {
    const dossierPanel = document.getElementById('organ-dossier-panel');
    const chipsContainer = document.getElementById('organ-quick-chips');
    const btnDeploy = document.getElementById('btn-deploy-mission');
    if (!dossierPanel || !chipsContainer) return;

    if (!this.selectedOrganKey || !ORGAN_STAGES[this.selectedOrganKey]) {
      this.selectedOrganKey = 'lungs';
    }

    const threatMap = {
      lungs: { label: 'BIO-HAZARD KELAS IV [AEROSOL]', color: '#00d2ff', bg: 'rgba(0, 210, 255, 0.12)' },
      bloodstream: { label: 'STATUS KRITIS [RISIKO SEPSIS SISTEMIK]', color: '#e63946', bg: 'rgba(230, 57, 70, 0.15)' },
      gut: { label: 'BIO-HAZARD KELAS III [TOKSIN ENTERIK]', color: '#2a9d8f', bg: 'rgba(42, 157, 143, 0.12)' },
      skin: { label: 'TRAUMA TERBUKA [KOLONISASI BIOFILM]', color: '#e76f51', bg: 'rgba(231, 111, 81, 0.12)' },
      brain: { label: 'ANCAMAN NEUROLOGIS [INFEKSI SISTEM SARAF]', color: '#b388ff', bg: 'rgba(179, 136, 255, 0.15)' },
      stomach: { label: 'ANCAMAN ASAM TINGGI [KOLONISASI LAMBUNG]', color: '#ffeb3b', bg: 'rgba(255, 235, 59, 0.15)' }
    };

    const pathogenNameMap = {
      sars_cov_2: 'SARS-CoV-2 (Aerosol)',
      influenza: 'Influenza A',
      rhinovirus: 'Rhinovirus',
      streptococcus: 'Streptococcus pneumoniae',
      staph_aureus: 'Staphylococcus aureus',
      escherichia_coli: 'Escherichia coli (Enterotoksigenik)'
    };

    const bossNameMap = {
      boss_sars_cov_2: 'SARS-CoV-2 Supercluster (Spike Variant)',
      boss_e_coli: 'E. coli Biofilm Colony (Shiga-like Toxin)',
      boss_mrsa: 'MRSA Biofilm Nexus (Resistan Multiobat)'
    };

    const updateDossier = (organKey) => {
      const organ = ORGAN_STAGES[organKey] || ORGAN_STAGES.lungs;
      const threat = threatMap[organKey] || threatMap.lungs;

      // Collect unique enemy pathogen types from waves
      const enemySet = new Set();
      let bossKey = null;
      if (organ.waves) {
        organ.waves.forEach((w) => {
          if (w.enemies) w.enemies.forEach((e) => enemySet.add(e.type));
          if (w.boss) bossKey = w.boss;
        });
      }

      const enemyTagsHtml = Array.from(enemySet)
        .map((type) => `<span class="pathogen-tag">● ${pathogenNameMap[type] || type}</span>`)
        .join('');

      const bossTitle = bossKey ? (bossNameMap[bossKey] || bossKey) : 'Patogen Mutan Alfa';

      dossierPanel.innerHTML = `
        <div class="dossier-top">
          <div class="dossier-title-wrap">
            <div class="dossier-avatar" style="background: ${organ.colorTheme}1a; border-color: ${organ.colorTheme}">
              ${organ.icon}
            </div>
            <div class="dossier-titles">
              <h3>${organ.name}</h3>
              <span class="dossier-subtitle" style="color: ${organ.colorTheme}">${organ.subtitle}</span>
            </div>
          </div>
          <div class="dossier-threat-badge" style="color: ${threat.color}; background: ${threat.bg}; border-color: ${threat.color}44;">
            ${threat.label}
          </div>
        </div>

        <p class="dossier-lore">${organ.lore}</p>

        <div class="dossier-grid">
          <div class="dossier-subbox hazard-box">
            <span class="subbox-label">⚡ LINGKUNGAN MIKRO & HAZARD</span>
            <span class="subbox-val-title">${organ.hazard.name}</span>
            <p class="subbox-desc">${organ.hazard.description}</p>
          </div>
          <div class="dossier-subbox threat-box">
            <span class="subbox-label">☣️ INTELIJEN PATOGEN & BOSS</span>
            <span class="subbox-val-title" style="color: #ff5577;">BOSS: ${bossTitle}</span>
            <div class="pathogen-roster-tags">
              ${enemyTagsHtml}
            </div>
          </div>
        </div>

        <div class="dossier-funfact">
          <strong>KOLOM SAINS & EDUKASI:</strong> ${organ.funFact}
        </div>
      `;

      if (btnDeploy) {
        btnDeploy.disabled = false;
        btnDeploy.innerHTML = `KERAHKAN SEL IMUN KE ${organ.name.toUpperCase()}! ⚔️`;
      }
    };

    const selectOrgan = (organKey, shouldPlaySound = true) => {
      this.selectedOrganKey = organKey;
      if (shouldPlaySound && window.sound) window.sound.playClick();

      // Update SVG hotspots
      document.querySelectorAll('.organ-hotspot-node').forEach((node) => {
        if (node.dataset.organ === organKey) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });

      // Update Quick Chips
      document.querySelectorAll('.organ-chip-btn').forEach((chip) => {
        if (chip.dataset.organ === organKey) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      updateDossier(organKey);
    };

    // Render Quick Selector Chips for CURRENT SUBJECT ONLY
    chipsContainer.innerHTML = '';
    const currentSubject = SUBJECT_DATA[this.currentSubjectIndex];
    
    currentSubject.organs.forEach((orgDef) => {
      const organ = ORGAN_STAGES[orgDef.id];
      if (!organ) return;
      
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `organ-chip-btn ${organ.id === this.selectedOrganKey ? 'active' : ''}`;
      chip.dataset.organ = organ.id;
      chip.style.setProperty('--chip-color', organ.colorTheme);
      chip.style.setProperty('--chip-active-bg', `${organ.colorTheme}22`);
      chip.style.setProperty('--chip-glow', `${organ.colorTheme}55`);

      chip.innerHTML = `
        <div class="chip-icon-box" style="color: ${organ.colorTheme}">${organ.icon}</div>
        <div class="chip-text-wrap">
          <span class="chip-organ-name">${organ.name}</span>
          <span class="chip-organ-sub">${organ.subtitle}</span>
        </div>
      `;

      chip.onclick = () => selectOrgan(organ.id, true);
      chip.onmouseenter = () => { if (window.sound) window.sound.playHover(); };
      chipsContainer.appendChild(chip);
    });

    // Attach click and hover to Mannequin SVG Hotspots (now dynamically rendered)
    document.querySelectorAll('.organ-hotspot-node').forEach((node) => {
      const organKey = node.dataset.organ;
      node.onclick = () => selectOrgan(organKey, true);
      // Double click or direct click deploy
      node.ondblclick = () => {
        selectOrgan(organKey, true);
        this.startMission();
      };
      node.onmouseenter = () => {
        if (window.sound) window.sound.playHover();
      };
    });

    if (btnDeploy) {
      btnDeploy.onmouseenter = () => {
        if (window.sound) window.sound.playHover();
      };
    }

    // Initial population
    selectOrgan(this.selectedOrganKey, false);
  }

  initHologram3DRotator() {
    this.hologram3d = new Hologram3DViewer({
      container: document.getElementById('mannequin-container'),
      canvas: document.getElementById('hologram3dCanvas'),
      angleDisplay: document.getElementById('holo-angle-display')
    });

    const btnLeft = document.getElementById('btn-holo-rotate-left');
    const btnRight = document.getElementById('btn-holo-rotate-right');
    const btnUp = document.getElementById('btn-holo-rotate-up');
    const btnDown = document.getElementById('btn-holo-rotate-down');
    const btnReset = document.getElementById('btn-holo-reset');
    const btnAutoOrbit = document.getElementById('btn-holo-auto-orbit');

    if (btnLeft) {
      btnLeft.onclick = () => {
        if (window.sound) window.sound.playClick();
        if (this.hologram3d) this.hologram3d.rotateBy(-28, 0);
      };
    }
    if (btnRight) {
      btnRight.onclick = () => {
        if (window.sound) window.sound.playClick();
        if (this.hologram3d) this.hologram3d.rotateBy(28, 0);
      };
    }
    if (btnUp) {
      btnUp.onclick = () => {
        if (window.sound) window.sound.playClick();
        if (this.hologram3d) this.hologram3d.rotateBy(0, 14);
      };
    }
    if (btnDown) {
      btnDown.onclick = () => {
        if (window.sound) window.sound.playClick();
        if (this.hologram3d) this.hologram3d.rotateBy(0, -14);
      };
    }
    if (btnReset) {
      btnReset.onclick = () => {
        if (window.sound) window.sound.playClick();
        if (this.hologram3d) this.hologram3d.resetView();
      };
    }
    if (btnAutoOrbit) {
      btnAutoOrbit.onclick = () => {
        if (window.sound) window.sound.playClick();
        if (this.hologram3d) {
          this.hologram3d.setAutoOrbit(!this.hologram3d.isAutoOrbit);
        }
      };
    }
  }

  initBioTerminal() {
    this.allTerminalEntries = [];
    for (const [catKey, list] of Object.entries(IMMUNOPEDIA_DATA)) {
      for (const item of list) {
        this.allTerminalEntries.push({ ...item, categoryKey: catKey });
      }
    }
    this.currentTerminalFilter = 'all';
    this.filteredTerminalEntries = [...this.allTerminalEntries];
    this.currentTerminalIndex = 0;

    this.renderTerminalDock();
    this.displayTerminalSpecimen(0);
  }

  filterTerminalCategory(filterKey) {
    this.currentTerminalFilter = filterKey;
    document.querySelectorAll('.terminal-filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filterKey);
    });

    if (filterKey === 'all') {
      this.filteredTerminalEntries = [...this.allTerminalEntries];
    } else {
      this.filteredTerminalEntries = this.allTerminalEntries.filter((item) => item.categoryKey === filterKey);
    }

    this.currentTerminalIndex = 0;
    this.renderTerminalDock();
    this.displayTerminalSpecimen(0);
  }

  renderTerminalDock() {
    const scroller = document.getElementById('terminal-dock-scroller');
    if (!scroller) return;

    scroller.innerHTML = '';
    this.filteredTerminalEntries.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = `dock-card ${idx === this.currentTerminalIndex ? 'active' : ''}`;
      card.dataset.index = idx;

      const firstName = item.name.split(' ')[0] || item.name;
      card.innerHTML = `
        <span class="dock-card-icon">${item.icon || '🧬'}</span>
        <div class="dock-card-info">
          <span class="dock-card-name">${firstName}</span>
          <span class="dock-card-tag">${item.specimenCode || 'SPEC'}</span>
        </div>
      `;

      card.onclick = () => {
        this.selectTerminalSpecimen(idx);
      };

      scroller.appendChild(card);
    });
  }

  selectTerminalSpecimen(index) {
    if (index < 0 || index >= this.filteredTerminalEntries.length) return;
    this.currentTerminalIndex = index;
    this.displayTerminalSpecimen(index);
  }

  navigateTerminalSpecimen(delta) {
    const newIdx = this.currentTerminalIndex + delta;
    if (newIdx >= 0 && newIdx < this.filteredTerminalEntries.length) {
      this.selectTerminalSpecimen(newIdx);
    }
  }

  displayTerminalSpecimen(index) {
    if (!this.filteredTerminalEntries || this.filteredTerminalEntries.length === 0) return;
    const item = this.filteredTerminalEntries[index];
    if (!item) return;

    // Specimen Art Display with iris bloom effect
    const elSpecArt = document.getElementById('terminal-specimen-art');
    if (elSpecArt) {
      elSpecArt.innerHTML = getSpecimenIllustrationSVG(item.visualType);
      elSpecArt.classList.remove('focus-in');
      void elSpecArt.offsetWidth; // force reflow for smooth re-trigger
      elSpecArt.classList.add('focus-in');
    }

    // Specimen Pod Code & Threat Badge
    const elCode = document.getElementById('terminal-spec-code');
    if (elCode) elCode.textContent = item.specimenCode || `SPEC-${index + 1}`;

    const elThreat = document.getElementById('terminal-threat-badge');
    if (elThreat) {
      elThreat.className = 'pod-threat-badge';
      if (item.categoryKey === 'cells') {
        elThreat.classList.add('threat-ally');
        elThreat.textContent = 'SENTINEL DEFENDER';
      } else if (item.categoryKey === 'nutrients') {
        elThreat.classList.add('threat-nutrient');
        elThreat.textContent = 'BIO-CATALYST / NUTRIENT';
      } else {
        elThreat.classList.add('threat-danger');
        elThreat.textContent = item.categoryKey === 'viruses' ? 'THREAT: VIRAL PATHOGEN' : 'THREAT: BACTERIAL PATHOGEN';
      }
    }

    // Scale label
    const elScale = document.getElementById('terminal-scale-label');
    if (elScale) {
      if (item.categoryKey === 'viruses') elScale.textContent = 'SKALA OPTIK: 50 – 120 nm';
      else if (item.categoryKey === 'nutrients') elScale.textContent = 'SKALA MOLEKULER: ~1 nm';
      else elScale.textContent = 'SKALA SITOLOGI: 10 – 25 µm';
    }

    // Right Dossier elements
    const elCat = document.getElementById('terminal-category-tag');
    if (elCat) elCat.textContent = (item.chapter || 'DATABASE SPESIMEN MIKROBIOLOGI').toUpperCase();

    const elName = document.getElementById('terminal-spec-name');
    if (elName) elName.textContent = item.name;

    const elIcon = document.getElementById('terminal-spec-icon');
    if (elIcon) elIcon.textContent = item.icon || '🧬';

    const elLatin = document.getElementById('terminal-latin-name');
    if (elLatin) elLatin.textContent = item.scientificName || '';

    // 4 Metrics
    const elDiam = document.getElementById('terminal-metric-diameter');
    if (elDiam) elDiam.textContent = item.diameter || '-';

    const elMorph = document.getElementById('terminal-metric-morphology');
    if (elMorph) elMorph.textContent = item.morphology || '-';

    const elTarget = document.getElementById('terminal-metric-target');
    if (elTarget) elTarget.textContent = item.target || '-';

    const elTaxon = document.getElementById('terminal-metric-taxonomy');
    if (elTaxon) elTaxon.textContent = item.taxonomy || '-';

    // Descriptions & Mechanism
    const elDesc = document.getElementById('terminal-spec-desc');
    if (elDesc) elDesc.textContent = item.desc || '';

    const elMech = document.getElementById('terminal-spec-mechanism');
    if (elMech) elMech.textContent = item.mechanism || '';

    const elFact = document.getElementById('terminal-spec-funfact');
    if (elFact) elFact.textContent = item.funFact || '';

    // Counter
    const elCounter = document.getElementById('terminal-counter-label');
    if (elCounter) {
      elCounter.textContent = `SPESIMEN ${index + 1} / ${this.filteredTerminalEntries.length}`;
    }

    // Update Paddles
    const btnPrev = document.getElementById('terminal-btn-prev');
    const btnNext = document.getElementById('terminal-btn-next');
    if (btnPrev) btnPrev.disabled = (index === 0);
    if (btnNext) btnNext.disabled = (index === this.filteredTerminalEntries.length - 1);

    // Update Dock Cards Active State & Scroll active card into view
    const dockCards = document.querySelectorAll('#terminal-dock-scroller .dock-card');
    dockCards.forEach((card, cIdx) => {
      const isActive = cIdx === index;
      card.classList.toggle('active', isActive);
      if (isActive) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Sound effect
    if (window.sound && window.sound.playClick) {
      window.sound.playClick();
    }
  }

  startMission() {
    this.organDef = ORGAN_STAGES[this.selectedOrganKey] || ORGAN_STAGES.lungs;
    const cellDef = IMMUNE_CELLS[this.selectedCellKey] || IMMUNE_CELLS.macrophage;

    // Instantiate Player at center of arena
    this.player = new Player(this.worldWidth / 2, this.worldHeight / 2, this.selectedCellKey);

    // Reset combat state
    this.pathogens = [];
    this.projectiles = [];
    this.pickups = [];
    this.currentWaveIdx = 0;
    this.cfuCleared = 0;
    this.antigenTiter = 0;
    this.organIntegrity = 100;
    this.missionStartTime = Date.now();
    this.activeBuffs = [];
    this.telemetryQueue = [];

    // Total mission pathogens tracking for clearance percentage & victory proximity
    let totalMissionCount = 0;
    if (this.organDef.waves) {
      this.organDef.waves.forEach((w) => {
        if (w.enemies) {
          w.enemies.forEach((e) => { totalMissionCount += e.count; });
        }
        if (w.boss) totalMissionCount += 1;
      });
    }
    this.totalMissionPathogens = Math.max(1, totalMissionCount);
    this.totalPathogensKilled = 0;
    this.isVictoryNearAnnounced = false;
    this.isVictorySequenceActive = false;
    this.lastCountdownCount = -1;

    // Reset HUD victory banners
    if (this.hudVictoryBanner) this.hudVictoryBanner.classList.add('hidden');
    if (this.hudVictoryCountdown) this.hudVictoryCountdown.classList.add('hidden');

    // Re-seed dense ambient biological particles tailored to this specific organ (erythrocytes, platelets, nutrients)
    this.particles.initAmbientCells(this.worldWidth, this.worldHeight, 260, this.organDef.themeType || this.selectedOrganKey);

    // Spawn friendly immune squad sentinels (Allied Support)
    this.allies = [
      new AlliedSentinel(this.player, 'helper_t', -0.8, 68),
      new AlliedSentinel(this.player, 'dendritic', 2.3, 72)
    ];

    // Setup HUD Info
    this.hudCellName.innerText = cellDef.name;
    this.hudAvatar.innerText = cellDef.avatar;
    this.hudOrganName.innerText = this.organDef.name;
    this.hudOrganIcon.innerHTML = this.organDef.icon;
    this.skillBasicName.innerText = cellDef.basicAttack.name;
    this.skillBasicIcon.innerText = cellDef.basicAttack.icon;
    this.skillTacticalName.innerText = cellDef.tacticalSkill.name;
    this.skillTacticalIcon.innerText = cellDef.tacticalSkill.icon;
    this.skillUltimateName.innerText = cellDef.ultimateSkill.name;
    this.skillUltimateIcon.innerText = cellDef.ultimateSkill.icon;

    // Load initial wave
    this.prepareWave(0);

    // Close all menu screens
    this.showScreen(null);

    // Populate Cinematic Deployment Banner Data
    if (this.entranceOrganIcon) this.entranceOrganIcon.innerHTML = this.organDef.icon;
    if (this.entranceOrganTitle) this.entranceOrganTitle.innerText = this.organDef.name.toUpperCase();
    if (this.entranceOrganSubtitle) this.entranceOrganSubtitle.innerText = (this.organDef.subtitle || 'ZONA INFEKSI PATOGEN').toUpperCase();
    if (this.entranceCellUnit) this.entranceCellUnit.innerText = `${cellDef.name.toUpperCase()} [${cellDef.badge}]`;
    if (this.entranceDirective) {
      let directive = 'Eliminasi patogen & amankan organ';
      if (this.selectedOrganKey === 'lungs') directive = 'Basmi SARS-CoV-2 & lindungi alveoli';
      else if (this.selectedOrganKey === 'gut') directive = 'Bersihkan toksin & lindungi vili usus';
      else if (this.selectedOrganKey === 'skin') directive = 'Tutup luka & cegah invasi bakteri';
      else if (this.selectedOrganKey === 'bloodstream') directive = 'Lisis patogen & hentikan sepsis';
      this.entranceDirective.innerText = directive;
      this.entranceDirective.title = directive;
    }
    if (this.entranceThreatLevel) {
      let threat = 'BIO-HAZARD KELAS IV';
      if (this.selectedOrganKey === 'bloodstream') threat = 'LEVEL SEPSIS AKUT (KRITIS)';
      else if (this.selectedOrganKey === 'lungs') threat = 'AEROSOL TRANSMISSION (TINGGI)';
      else if (this.selectedOrganKey === 'skin') threat = 'TRAUMA EPIDERMAL TERBUKA';
      else if (this.selectedOrganKey === 'gut') threat = 'KOLONISASI ENTERIK TOKSIK';
      this.entranceThreatLevel.innerText = threat;
    }

    // Set camera to player location with wide dive zoom
    this.camera.x = this.player.x - this.camera.viewportWidth / 2;
    this.camera.y = this.player.y - this.camera.viewportHeight / 2;
    this.camera.setZoom(0.62);
    this.camera.zoomTo(1.0, 1.15);

    // Play Epic Deep Sub-Bass Drop sound
    sound.init();
    sound.playCinematicBassDrop();

    // Show Cinematic Overlay & Anamorphic Letterbox
    if (this.uiEntranceCinematic) {
      this.uiEntranceCinematic.classList.remove('hidden');
      requestAnimationFrame(() => {
        if (this.uiEntranceCinematic) this.uiEntranceCinematic.classList.add('active');
      });
    }

    // Keep HUD hidden until cinematic lands
    this.uiHUD.classList.add('hidden');

    this.isCinematicActive = true;
    this.cinematicTimer = 3.2;
    this.cinematicImpactTriggered = false;
    this.state = 'PLAYING';

    this.postTelemetry(`[DEPLOY] ${cellDef.name} memasuki mikrosirkulasi ${this.organDef.name}.`);
  }

  finishCinematic() {
    if (!this.isCinematicActive) return;
    this.isCinematicActive = false;

    this.camera.setZoom(1.0);

    if (!this.cinematicImpactTriggered) {
      this.cinematicImpactTriggered = true;
      this.camera.shake(12, 0.35);
      if (this.player) {
        this.particles.spawnDeploymentShockwave(this.player.x, this.player.y, this.player.def.color);
      }
    }

    if (this.uiEntranceCinematic) {
      this.uiEntranceCinematic.classList.remove('active');
      setTimeout(() => {
        if (this.uiEntranceCinematic) this.uiEntranceCinematic.classList.add('hidden');
      }, 450);
    }

    this.uiHUD.classList.remove('hidden');
    this.postTelemetry(`[TEMPUR] Sel imun mendarat di jaringan. Mulai eliminasi patogen!`);
  }

  prepareWave(waveIdx) {
    this.currentWaveIdx = waveIdx;
    const waveData = this.organDef.waves[waveIdx];
    if (!waveData) {
      this.triggerVictory();
      return;
    }

    this.enemiesRemainingToSpawn = [];
    waveData.enemies.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        this.enemiesRemainingToSpawn.push(group.type);
      }
    });

    // Shuffle spawn array
    this.enemiesRemainingToSpawn.sort(() => Math.random() - 0.5);

    if (waveData.boss) {
      this.enemiesRemainingToSpawn.push(waveData.boss);
    }

    this.spawnTimer = 0.5;
    this.hudWaveNum.innerText = waveIdx + 1;
    this.postTelemetry(`[WAVE ${waveIdx + 1}] ${waveData.title}!`);
  }

  spawnSingleEnemy(typeKey, clusterCount = 1, fixedAngle = null, fixedDist = null) {
    if (!this.player) return;
    const isBoss = typeKey.startsWith('boss_');
    const angle = fixedAngle !== null ? fixedAngle : Math.random() * Math.PI * 2;
    const dist = fixedDist !== null ? fixedDist : (520 + Math.random() * 180);

    const baseX = Math.max(70, Math.min(this.worldWidth - 70, this.player.x + Math.cos(angle) * dist));
    const baseY = Math.max(70, Math.min(this.worldHeight - 70, this.player.y + Math.sin(angle) * dist));

    for (let c = 0; c < clusterCount; c++) {
      const offsetX = c === 0 ? 0 : (Math.random() - 0.5) * 55;
      const offsetY = c === 0 ? 0 : (Math.random() - 0.5) * 55;
      const px = Math.max(50, Math.min(this.worldWidth - 50, baseX + offsetX));
      const py = Math.max(50, Math.min(this.worldHeight - 50, baseY + offsetY));

      const enemy = new Pathogen(px, py, typeKey, isBoss);
      this.pathogens.push(enemy);

      if (isBoss) {
        sound.playAlarm();
        this.camera.shake(15, 0.6);
        this.postTelemetry(`[PERINGATAN PATOGEN APEX] ${enemy.def.name} MUNCUL!`);
        this.showSwarmBanner(`⚠️ PERINGATAN: APEX PATOGEN ${enemy.def.name.toUpperCase()} MUNCUL!`);
        break; // Boss never multiplies
      }
    }
  }

  triggerSwarmEvent() {
    if (this.state !== 'PLAYING' || !this.player) return;
    sound.playAlarm();
    this.camera.shake(6, 0.35);

    const flankAngle = Math.random() * Math.PI * 2;
    const waveConfig = this.organDef.waves[this.currentWaveIdx];
    const swarmEnemies = (waveConfig && waveConfig.enemies) ? waveConfig.enemies : [{ type: 'rhinovirus' }];
    const chosenType = swarmEnemies[Math.floor(Math.random() * swarmEnemies.length)].type;

    const count = 3 + Math.floor(Math.random() * 2); // 3 to 4 units
    for (let i = 0; i < count; i++) {
      const scatterAngle = flankAngle + (Math.random() - 0.5) * 0.45;
      const dist = 600 + Math.random() * 120;
      this.spawnSingleEnemy(chosenType, 1, scatterAngle, dist);
    }

    this.postTelemetry(`[BIOHAZARD] ⚠️ KELOMPOK PATOGEN (${count}x ${chosenType.toUpperCase()}) MENDEKATI!`);
    this.showSwarmBanner(`⚠️ PERINGATAN: KELOMPOK PATOGEN MENDEKATI!`);
  }

  addExp(amount) {
    if (!this.player) return;
    this.player.exp += amount;
    this.antigenTiter += Math.round(amount * 0.5);

    if (this.player.exp >= this.player.expNext) {
      this.player.exp -= this.player.expNext;
      this.player.expNext = Math.round(this.player.expNext * 1.5);
      this.player.level += 1;
      sound.playLevelUp();
      this.postTelemetry(`[DIFERENSIASI] Sel imun berevolusi ke Level ${this.player.level}!`);
      this.openUpgradeModal();
    }
  }

  openUpgradeModal() {
    this.state = 'UPGRADE';
    this.uiUpgrade.classList.remove('hidden');
    const container = document.getElementById('upgrade-choices-container');
    container.innerHTML = '';

    // Pick 3 random distinct upgrades
    const pool = [...CYTOKINE_UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3);

    pool.forEach((upg) => {
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `
        <div class="upgrade-icon">${upg.icon}</div>
        <div class="upgrade-title">${upg.title}</div>
        <div class="upgrade-effect">${upg.effectDesc}</div>
        <div class="upgrade-bio-lore">${upg.lore}</div>
      `;
      card.onclick = () => {
        upg.apply(this.player, this);
        this.uiUpgrade.classList.add('hidden');
        this.state = 'PLAYING';
        this.postTelemetry(`[MUTASI DIAKTIFKAN] ${upg.title}`);
      };
      container.appendChild(card);
    });
  }

  postTelemetry(msg) {
    const line = document.createElement('div');
    line.className = 'telemetry-line';
    line.innerText = msg;
    this.telemetryBox.appendChild(line);

    while (this.telemetryBox.children.length > 4) {
      this.telemetryBox.removeChild(this.telemetryBox.children[0]);
    }
  }

  applyBuff(buffId, label, duration, onStart, onEnd) {
    onStart();
    this.activeBuffs.push({ id: buffId, label, duration, maxDur: duration, onEnd });
    sound.playPickup('buff');
    this.postTelemetry(`[NUTRISI AKTIF] ${label}`);
  }

  // --- SPECIAL COMBAT ACTIONS ---

  performMeleeBite(x, y, angle, range, damage, isCrit) {
    for (let p of this.pathogens) {
      if (p.dead) continue;
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist <= range + p.radius) {
        const angleToTarget = Math.atan2(p.y - y, p.x - x);
        let diff = Math.abs(angleToTarget - angle);
        while (diff > Math.PI) diff = Math.PI * 2 - diff;

        if (diff <= Math.PI / 2.2) {
          // Inside front cone
          const res = p.takeDamage(damage, isCrit, this.player.ignoreArmor);
          this.particles.spawnDamageText(p.x, p.y, res.damage, isCrit);
          if (res.dead) {
            this.handleEnemyDeath(p);
            // Macrophage HP absorption
            const heal = Math.round(35 * (this.player.killHealBonus || 1));
            this.player.hp = Math.min(this.player.stats.maxHp, this.player.hp + heal);
            this.particles.spawnDamageText(this.player.x, this.player.y, `+${heal} HP`, false, true);
          }
        }
      }
    }
  }

  triggerMHCWave(x, y, radius) {
    for (let p of this.pathogens) {
      if (p.dead) continue;
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist <= radius) {
        p.slowTimer = 4.0;
        p.applyOpsonization(4.0);
        this.particles.spawnDamageText(p.x, p.y, 'MHC-II REVEAL', true);
      }
    }
  }

  triggerOpsonizeAll() {
    for (let p of this.pathogens) {
      if (p.dead) continue;
      p.applyOpsonization(6.0);
    }
  }

  triggerRadialBlast(x, y, radius, damage) {
    for (let p of this.pathogens) {
      if (p.dead) continue;
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist <= radius) {
        const res = p.takeDamage(damage, true, true);
        this.particles.spawnDamageText(p.x, p.y, res.damage, true);
        if (res.dead) this.handleEnemyDeath(p);
      }
    }
  }

  triggerAgglutinationBlast() {
    let affectedCount = 0;
    for (let p of this.pathogens) {
      if (p.dead) continue;
      if (p.opsonized) {
        affectedCount++;
        const res = p.takeDamage(320, true, true);
        this.particles.spawnDamageText(p.x, p.y, res.damage, true);
        this.particles.spawnLysis(p.x, p.y, '#ff007f', 12);
        if (res.dead) this.handleEnemyDeath(p);
      }
    }
  }

  triggerGranzymeApoptosis(x, y, radius) {
    for (let p of this.pathogens) {
      if (p.dead) continue;
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist <= radius) {
        const res = p.takeDamage(p.isBoss ? 650 : p.hp, true, true);
        this.particles.spawnDamageText(p.x, p.y, 'APOPTOSIS!', true);
        this.particles.spawnLysis(p.x, p.y, '#ffaa00', 16);
        if (res.dead) this.handleEnemyDeath(p);
      }
    }
  }

  spawnAlliedDrone() {
    this.postTelemetry('[REKRUTMEN IL-8] Neutrofil sekutu tiba di medan pertempuran!');
    this.allies.push(new AlliedSentinel(this.player, 'helper_t', Math.random() * Math.PI * 2, 75));
    sound.playPickup('buff');
  }

  handleEnemyDeath(enemy) {
    this.cfuCleared++;
    this.totalPathogensKilled++;
    sound.playLysis();
    this.particles.spawnLysis(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 40 : 16, enemy.def.type);

    // Cleansing pathogens restores organ health
    this.organIntegrity = Math.min(100, this.organIntegrity + 0.35);

    // Drop EXP Cytokines & ATP
    this.pickups.push(new Pickup(enemy.x, enemy.y, 'cytokine_drop'));

    if (Math.random() < 0.45) {
      this.pickups.push(new Pickup(enemy.x + (Math.random() * 20 - 10), enemy.y + (Math.random() * 20 - 10), 'atp_orb'));
    }

    // Chance for nutritional items
    const r = Math.random();
    if (r < 0.12) {
      const nutTypes = ['vitamin_c', 'zinc', 'vitamin_d3', 'amino_acid'];
      const chosen = nutTypes[Math.floor(Math.random() * nutTypes.length)];
      this.pickups.push(new Pickup(enemy.x, enemy.y, chosen));
    }
  }

  // --- GAME OVER & VICTORY ---

  triggerVictory() {
    if (this.isVictorySequenceActive) return;
    this.isVictorySequenceActive = true;
    this.state = 'VICTORY_CINEMATIC';

    // 1. Play Triumphant Fanfare Sound SFX
    sound.playVictoryFanfare();

    // 2. Camera slow-motion / gentle celebratory shake
    this.camera.shake(12, 0.6);

    // 3. Celebratory Golden Bio-Sterilization Shockwave & Confetti Burst
    const px = this.player ? this.player.x : this.worldWidth / 2;
    const py = this.player ? this.player.y : this.worldHeight / 2;
    this.particles.spawnVictorySterilizationPulse(px, py);
    this.particles.spawnVictoryConfetti(px, py, 140);

    // 4. Show On-Screen In-Game Celebratory Victory Banner
    if (this.hudVictoryBanner) {
      this.hudVictoryBanner.classList.remove('hidden');
    }

    this.postTelemetry(`[KEMENANGAN] Remisi klinis tercapai! Organ ${this.organDef.name} bebas patogen.`);

    // 5. After 2.4s of celebratory animation, smoothly transition to the Medical Debrief & Rewards Modal
    setTimeout(() => {
      if (this.hudVictoryBanner) this.hudVictoryBanner.classList.add('hidden');
      this.state = 'VICTORY';
      this.uiHUD.classList.add('hidden');
      this.showScreen(this.uiVictory);

      const elapsed = Math.round((Date.now() - this.missionStartTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;

      // Stats
      document.getElementById('deb-cfu').innerText = this.cfuCleared;
      document.getElementById('deb-tissue').innerText = `${Math.round(this.organIntegrity)}%`;
      document.getElementById('deb-titer').innerText = `+${this.antigenTiter}`;
      document.getElementById('deb-time').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      document.getElementById('deb-fun-fact').innerText = this.organDef.funFact;
      if (this.debOrganName) {
        this.debOrganName.innerText = `Organ ${this.organDef.name} Berhasil Disterilkan Sepenuhnya!`;
      }

      // Calculate Clinical Grade
      let gradeLetter = 'S';
      let gradeTitle = 'CLINICAL MASTER DEFENDER';

      if (this.organIntegrity >= 90 && elapsed <= 240) {
        gradeLetter = 'S+';
        gradeTitle = 'APEX CYTOKINE COMMANDER';
      } else if (this.organIntegrity >= 75) {
        gradeLetter = 'S';
        gradeTitle = 'SENIOR CLINICAL SPECIALIST';
      } else if (this.organIntegrity >= 50) {
        gradeLetter = 'A';
        gradeTitle = 'PROFICIENT IMMUNOLOGIST';
      } else {
        gradeLetter = 'B';
        gradeTitle = 'TACTICAL SURVIVOR';
      }

      if (this.debGradeLetter) this.debGradeLetter.innerText = gradeLetter;
      if (this.debGradeTitle) this.debGradeTitle.innerText = gradeTitle;

      // Medal of Honor tailored to organ
      const medals = {
        lungs: {
          icon: '🏅',
          name: 'Medali Emas Sterilisasi Alveolar Pulmonal',
          desc: 'Dianugerahkan atas perlindungan alveolar dari droplet SARS-CoV-2 tanpa pneumonia fatal.'
        },
        gut: {
          icon: '🎖️',
          name: 'Medali Emas Integritas Mikrobioma Enterik',
          desc: 'Dianugerahkan atas pembersihan total endotoksin Salmonella & Shigella pada epitel vili.'
        },
        bloodstream: {
          icon: '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
          name: 'Salib Emas Proteksi Vaskular & Anti-Sepsis',
          desc: 'Dianugerahkan atas eliminasi bakteremia Staphylococcus sebelum memicu badai sepsis.'
        },
        skin: {
          icon: '🌟',
          name: 'Bintang Emas Regenerasi Epidermal Dermis',
          desc: 'Dianugerahkan atas pencegahan invasi luka terbuka dan pembentukan barier keratin kuat.'
        }
      };
      const curMedal = medals[this.selectedOrganKey] || medals.lungs;
      if (this.debMedalIcon) this.debMedalIcon.innerText = curMedal.icon;
      if (this.debMedalName) this.debMedalName.innerText = curMedal.name;
      if (this.debMedalDesc) this.debMedalDesc.innerText = curMedal.desc;

      // Bonus Titer reward calculation
      const bonusTiter = 1200 + Math.round(this.organIntegrity * 10);
      if (this.debRewardTiter) {
        this.debRewardTiter.innerText = `+${bonusTiter} Titer Memori`;
      }
      this.antigenTiter += bonusTiter;

      // Unlocks
      if (this.debRewardUnlock) {
        const nextOrgans = { lungs: 'Usus (Gut)', gut: 'Vaskular (Bloodstream)', bloodstream: 'Dermis (Kulit)', skin: 'Semua Organ Terlindungi' };
        this.debRewardUnlock.innerText = `Organ Berikutnya: ${nextOrgans[this.selectedOrganKey] || 'Tingkat Mahir'} Terbuka!`;
      }
    }, 2400);
  }

  triggerGameOver(cause) {
    this.state = 'GAMEOVER';
    this.uiHUD.classList.add('hidden');
    this.showScreen(this.uiGameOver);
    document.getElementById('gameover-cause').innerText = cause || 'Kerusakan integritas jaringan tubuh mencapai batas kritis sepsis.';
  }

  // --- MAIN LOOP UPDATE & RENDER ---

  update(dt) {
    // 0. Update Living Main Menu Engine (Parallax & Ambient Cells)
    this.updateMenuLivingEngine(dt);

    // 0.1 Update Cinematic Teaser if active
    if (this.teaser && this.teaser.isPlaying) {
      this.teaser.update(dt);
      this.teaser.render();
    }

    // 0.2 Celebratory Victory Cinematic Animation State
    if (this.state === 'VICTORY_CINEMATIC') {
      if (this.player) this.camera.follow(this.player, 0.08);
      this.camera.update(dt);
      this.particles.update(dt, this.worldWidth, this.worldHeight, this.player);
      return;
    }

    if (this.state !== 'PLAYING') return;

    // 0.5 Stage Entrance Cinematic Animation
    if (this.isCinematicActive) {
      this.cinematicTimer -= dt;

      // Landing moment (~1.65s remaining): trigger camera shockwave & bass landing
      if (this.cinematicTimer <= 1.65 && !this.cinematicImpactTriggered) {
        this.cinematicImpactTriggered = true;
        this.camera.shake(14, 0.45);
        if (this.player) {
          this.particles.spawnDeploymentShockwave(this.player.x, this.player.y, this.player.def.color);
        }
      }

      // Allow quick skip with Space key or click
      if (this.input.keys['Space'] || this.input.keys[' ']) {
        this.finishCinematic();
      } else if (this.cinematicTimer <= 0) {
        this.finishCinematic();
      }

      // Smooth camera follow & ambient particles update during cinematic
      this.camera.follow(this.player, 0.12);
      this.camera.update(dt);
      this.particles.update(dt, this.worldWidth, this.worldHeight);
      return;
    }

    // 1. Update Buffs
    for (let i = this.activeBuffs.length - 1; i >= 0; i--) {
      const b = this.activeBuffs[i];
      b.duration -= dt;
      if (b.duration <= 0) {
        if (b.onEnd) b.onEnd();
        this.activeBuffs.splice(i, 1);
      }
    }

    // 1.5 Living Biological Pulse & Swarm Invasion Timer
    this.heartbeatTimer -= dt;
    if (this.heartbeatTimer <= 0) {
      this.heartbeatTimer = 2.4;
      sound.playHeartbeat();
    }

    this.swarmEventTimer -= dt;
    if (this.swarmEventTimer <= 0) {
      this.swarmEventTimer = 45 + Math.random() * 15;
      this.triggerSwarmEvent();
    }

    // 2. Wave Spawner with Balanced Pacing & Active Cap
    if (this.enemiesRemainingToSpawn.length > 0) {
      const waveConfig = this.organDef.waves[this.currentWaveIdx];
      this.spawnTimer -= dt;

      // Active safety cap: if already 14 active enemies on screen, hold spawn so it never gets chaotic
      if (this.pathogens.length < 14) {
        const targetInterval = waveConfig.spawnInterval || 0.95;

        if (this.spawnTimer <= 0) {
          this.spawnTimer = targetInterval;
          const enemyType = this.enemiesRemainingToSpawn.pop();

          // 1 enemy at a time, with occasional pair for fast viruses
          let packSize = 1;
          if (!enemyType.startsWith('boss_')) {
            const pDef = PATHOGENS[enemyType];
            if (pDef && pDef.type === 'virus' && Math.random() < 0.25) {
              packSize = 2;
            }
          }
          this.spawnSingleEnemy(enemyType, packSize);
        }
      }
    } else if (this.pathogens.length === 0) {
      // Wave Cleared! Move to next wave
      this.prepareWave(this.currentWaveIdx + 1);
    }

    // 3. Update Player
    this.player.update(dt, this.input, this.camera, this.projectiles, sound, this);
    this.camera.follow(this.player);
    this.camera.update(dt);

    // 3.5 Update Allied Immune Squad Sentinels
    for (let ally of this.allies) {
      ally.update(dt, this.player, this.pathogens, this.projectiles, sound);
    }

    // 4. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.update(dt, this.pathogens);

      if (proj.dead) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check collision with player (for enemy spikes)
      if (proj.isEnemy) {
        const dist = Math.hypot(this.player.x - proj.x, this.player.y - proj.y);
        if (dist < this.player.radius + proj.radius) {
          proj.dead = true;
          const hit = this.player.takeDamage(proj.damage);
          this.camera.shake(6, 0.2);
          sound.playHit();
          this.particles.spawnDamageText(this.player.x, this.player.y, hit.damage, false, false);
          if (hit.dead) {
            this.triggerGameOver('Sel imun mengalami kerusakan membran parah akibat toksin virus.');
          }
        }
      } else {
        // Player projectiles vs Pathogens
        for (let p of this.pathogens) {
          if (p.dead) continue;
          const dist = Math.hypot(p.x - proj.x, p.y - proj.y);
          if (dist < p.radius + proj.radius) {
            proj.hits++;
            if (proj.hits >= proj.penetration) {
              proj.dead = true;
            }

            const isCrit = Math.random() < this.player.stats.critChance;
            let dmg = proj.damage * (isCrit ? this.player.stats.critMult : 1);
            if (p.def.type === 'virus') dmg *= this.player.virusDamageBonus || 1;
            if (p.def.type === 'bacteria') dmg *= this.player.bacteriaDamageBonus || 1;

            const res = p.takeDamage(dmg, isCrit, this.player.ignoreArmor);
            this.particles.spawnDamageText(p.x, p.y, res.damage, isCrit);

            // Visual biological feedback: Bacteria peptidoglycan armor absorption
            if (res.blocked > 3 && p.def.type === 'bacteria' && Math.random() < 0.4) {
              this.particles.spawnDamageText(p.x, p.y - 14, `<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> DINDING SEL -${res.blocked}`, false, false);
            }

            if (res.dead) {
              this.handleEnemyDeath(p);
            }
            break;
          }
        }
      }
    }

    // 5. Update Pathogens
    for (let i = this.pathogens.length - 1; i >= 0; i--) {
      const p = this.pathogens[i];
      if (p.dead) {
        this.pathogens.splice(i, 1);
        continue;
      }

      if (!this.freezeViruses || p.def.type !== 'virus') {
        p.update(dt, this.player, this.organDef.hazard, this.projectiles);
      }

      // Pathogen contact damage with player
      const dist = Math.hypot(this.player.x - p.x, this.player.y - p.y);
      if (dist < this.player.radius + p.radius) {
        const hit = this.player.takeDamage(p.damage * dt * 1.5);
        if (hit.dead) {
          this.triggerGameOver('Sel imun dihancurkan oleh serbuan patogen.');
        }
      }
    }

    // 6. Update Pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pu = this.pickups[i];
      const collected = pu.update(dt, this.player);
      if (collected) {
        pu.def.apply(this.player, this);
        sound.playPickup(pu.def.type);
        this.pickups.splice(i, 1);
      } else if (pu.dead) {
        this.pickups.splice(i, 1);
      }
    }

    // 7. Update Particles & Traps (with fluid drag for player)
    this.particles.update(dt, this.worldWidth, this.worldHeight, this.player);

    // Trap collision against pathogens
    for (let tr of this.particles.traps) {
      for (let p of this.pathogens) {
        if (p.dead) continue;
        const dist = Math.hypot(p.x - tr.x, p.y - tr.y);
        if (dist <= tr.radius + p.radius) {
          if (tr.type === 'net') p.applyTrap(1.5);
          if (tr.type === 'ros') p.takeDamage(35 * dt, false, true);
        }
      }
    }

    // 8. Organ Integrity Mechanics
    // Sepsis risk triggers only if massive outbreak exceeds 35 active pathogens
    if (this.pathogens.length > 35) {
      const overload = this.pathogens.length - 35;
      this.organIntegrity -= overload * 0.12 * dt;
      if (this.organIntegrity <= 0) {
        this.organIntegrity = 0;
        this.triggerGameOver('Integritas organ kolaps akibat kegagalan eliminasi patogen masif (Sepsis).');
      }
    }

    // 9. Sync HUD Elements
    this.updateHUD();
  }

  updateHUD() {
    if (!this.player) return;

    // HP Bar
    const hpPct = Math.max(0, (this.player.hp / this.player.stats.maxHp) * 100);
    this.hudHpBar.style.width = `${hpPct}%`;
    this.hudHpText.innerText = `${Math.round(this.player.hp)} / ${this.player.stats.maxHp} HP`;

    // ATP Bar
    const atpPct = Math.max(0, (this.player.atp / this.player.stats.atpMax) * 100);
    this.hudAtpBar.style.width = `${atpPct}%`;
    this.hudAtpText.innerText = `${Math.round(this.player.atp)} / ${this.player.stats.atpMax} ATP`;

    // EXP Bar
    const expPct = Math.min(100, (this.player.exp / this.player.expNext) * 100);
    this.hudExpBar.style.width = `${expPct}%`;
    this.hudExpText.innerText = `${Math.round(expPct)}%`;
    this.hudLevel.innerText = this.player.level;

    // Organ Bar
    this.hudOrganBar.style.width = `${this.organIntegrity}%`;
    this.hudOrganText.innerText = `${Math.round(this.organIntegrity)}%`;
    this.hudOrganBar.className = 'bar-fill organ-integrity-fill';
    if (this.organIntegrity < 30) this.hudOrganBar.classList.add('danger');
    else if (this.organIntegrity < 65) this.hudOrganBar.classList.add('warning');

    // Counters
    this.hudEnemyCount.innerText = this.pathogens.length;
    this.hudCfu.innerText = this.cfuCleared;
    this.hudTiter.innerText = this.antigenTiter;

    // Skill Cooldowns
    const cdFactor = 1 - (this.player.cooldownReduction || 0);
    const maxTacCd = this.player.def.tacticalSkill.cooldown * cdFactor;
    const tacPct = Math.max(0, (this.player.cooldowns.tactical / maxTacCd) * 100);
    this.cdTactical.style.height = `${tacPct}%`;

    const maxUltCd = this.player.def.ultimateSkill.cooldown * cdFactor;
    const ultPct = Math.max(0, (this.player.cooldowns.ultimate / maxUltCd) * 100);
    this.cdUltimate.style.height = `${ultPct}%`;

    // Mission Sterilization Clearance Progress Bar & Impending Victory Countdown
    if (this.hudClearancePercent && this.hudClearanceBar) {
      const progressPct = Math.min(100, Math.round((this.totalPathogensKilled / Math.max(1, this.totalMissionPathogens)) * 100));
      this.hudClearancePercent.innerText = `${progressPct}%`;
      this.hudClearanceBar.style.width = `${progressPct}%`;
    }

    // Impending Victory Live Alert Badge (Tanda Mau Menang)
    if (this.hudVictoryCountdown && this.organDef.waves) {
      const isLastWave = (this.currentWaveIdx >= this.organDef.waves.length - 1);
      const remainingEnemiesInWave = (this.enemiesRemainingToSpawn ? this.enemiesRemainingToSpawn.length : 0) + this.pathogens.length;

      if (isLastWave) {
        this.hudVictoryCountdown.classList.remove('hidden');

        if (remainingEnemiesInWave <= 0) {
          if (this.hudVictoryCountdownText) this.hudVictoryCountdownText.innerText = '🏆 STERILISASI JARINGAN 100% SUKSES!';
        } else if (remainingEnemiesInWave <= 5) {
          if (this.hudVictoryCountdownText) {
            this.hudVictoryCountdownText.innerText = `🎯 ${remainingEnemiesInWave} PATOGEN TERSISA MENUJU KEMENANGAN!`;
          }
          // Sound trigger & Telemetry when entering proximity or counter changes
          if (this.lastCountdownCount !== remainingEnemiesInWave) {
            this.lastCountdownCount = remainingEnemiesInWave;
            sound.playProximityAlert();
            this.postTelemetry(`[RADAR KLINIK] ${remainingEnemiesInWave} mikroba tersisa! Jaringan mendekati remisi total!`);
          }
        } else {
          if (this.hudVictoryCountdownText) this.hudVictoryCountdownText.innerText = '⚡ FASE TERAKHIR: HABISI APEX PATOGEN!';
        }
      } else {
        this.hudVictoryCountdown.classList.add('hidden');
      }
    }

    // Buffs Dock
    this.buffsDock.innerHTML = '';
    this.activeBuffs.forEach((b) => {
      const item = document.createElement('div');
      item.className = 'buff-item';
      item.innerText = `${b.label} (${Math.ceil(b.duration)}s)`;
      this.buffsDock.appendChild(item);
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state === 'PLAYING' || this.state === 'UPGRADE' || this.state === 'VICTORY_CINEMATIC') {
      this.ctx.save();

      // Smooth camera zoom during cinematic entrance / impact
      if (this.camera.zoom !== 1.0) {
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      }

      // 1. Background fluida organ
      this.renderer.renderBackground(this.ctx, this.camera, this.organDef, this.particles);

      // 2. Pickups
      for (let pu of this.pickups) {
        pu.render(this.ctx, this.camera);
      }

      // 3. Projectiles
      for (let pr of this.projectiles) {
        pr.render(this.ctx, this.camera);
      }

      // 4. Pathogens
      for (let pa of this.pathogens) {
        pa.render(this.ctx, this.camera);
      }

      // 4.5 Allied Immune Squad Sentinels
      for (let al of this.allies) {
        al.render(this.ctx, this.camera);
      }

      // 5. Player Cell
      if (this.player) {
        this.player.render(this.ctx, this.camera);
      }

      // 6. Foreground Particles & Damage numbers
      this.particles.renderForeground(this.ctx, this.camera);

      this.ctx.restore();
    }
  }
}

