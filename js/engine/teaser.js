/**
 * teaser.js
 * Interactive Tactical Combat Showcase Engine (Auto-Pause Tutorial)
 * Menampilkan simulasi pertarungan langsung yang otomatis jeda (freeze-frame bullet time)
 * di setiap aksi karakter untuk memaparkan kontrol tombol dan mekanisme biologis.
 */

import { sound } from '../audio/sound.js';

export class CinematicTeaser {
  constructor(canvas, onComplete) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onComplete = onComplete;

    this.isPlaying = false;
    this.isPausedForCard = false;
    this.userPaused = false;
    this.currentTime = 0;
    this.currentStep = 0; // 0: Macrophage, 1: Neutrophil, 2: B-Cell, 3: T-Cell

    // DOM Tactical Card Elements
    this.uiCard = document.getElementById('tactical-card');
    this.tacStepTag = document.getElementById('tac-step-tag');
    this.tacKeyBadge = document.getElementById('tac-key-badge');
    this.tacAvatar = document.getElementById('tac-avatar');
    this.tacTitle = document.getElementById('tac-title');
    this.tacCellName = document.getElementById('tac-cell-name');
    this.tacBioDesc = document.getElementById('tac-bio-desc');
    this.tacEffectDesc = document.getElementById('tac-effect-desc');
    this.btnNext = document.getElementById('btn-tactical-next');

    // Tactical Steps Definition
    this.steps = [
      {
        triggerTime: 3.2,
        stepTag: 'TAHAP 1/4 • SISTEM IMUN BAWAAN',
        keyBadge: '<kbd>L-CLICK</kbd> SERANGAN UTAMA',
        avatar: '🛡️',
        title: 'Fagositosis & Lisis Lisosom',
        cellName: 'Makrofag (The Giant Sentinel)',
        bioDesc: 'Membran sel menjulurkan pseudopodia untuk memerangkap patogen ke dalam vakuola fagosom, lalu memfusikannya dengan lisosom asam berisi hidrolase untuk melisiskan mikroba.',
        effectDesc: 'Menghasilkan damage melee masif dalam jarak dekat dan menyerap 35 HP setiap kali berhasil menelan partikel patogen.',
        btnText: 'LANJUT KE TAKTIK BERIKUTNYA ➔'
      },
      {
        triggerTime: 7.2,
        stepTag: 'TAHAP 2/4 • FIRST RESPONDER AKUT',
        keyBadge: '<kbd>SPASI</kbd> / <kbd>R-CLICK</kbd> SKILL TAKTIS',
        avatar: '⚡',
        title: 'NETosis (Neutrophil Extracellular Trap)',
        cellName: 'Neutrofil (Polymorphonuclear PMN)',
        bioDesc: 'Neutrofil mengekstrusi perangkap jaring serat DNA kromatin yang dilapisi protein defensin antimikroba untuk menjerat kawanan mikroba sekaligus.',
        effectDesc: 'Mengunci pergerakan patogen di area jaring dan memberikan racun berkelanjutan (continuous damage over time).',
        btnText: 'LANJUT KE TAKTIK BERIKUTNYA ➔'
      },
      {
        triggerTime: 11.2,
        stepTag: 'TAHAP 3/4 • IMUNITAS HUMORAL ADAPTIF',
        keyBadge: '<kbd>L-CLICK</kbd> / <kbd>SPASI</kbd> SERANGAN & TAKTIS',
        avatar: '🏹',
        title: 'Opsonisasi & Kunci Afinitas Antibodi',
        cellName: 'Limfosit B (The Antibody Fortress)',
        bioDesc: 'Antibodi IgG mengikat epitop spesifik antigen patogen (Opsonisasi), menandai mikroba asing agar mudah dikenali dan dilipatgandakan kerentanannya oleh sel imun.',
        effectDesc: 'Proyektil melengkung mengejar antigen (homing) dan memberikan efek 100% Critical Vulnerability (2x Damage).',
        btnText: 'LANJUT KE TAKTIK BERIKUTNYA ➔'
      },
      {
        triggerTime: 15.2,
        stepTag: 'TAHAP 4/4 • IMUNITAS SELULER ADAPTIF',
        keyBadge: '<kbd>Q</kbd> / <kbd>E</kbd> RESPON BIO-ULTIMATE',
        avatar: '⚔️',
        title: 'Perforin Lance & Granzyme Apoptosis',
        cellName: 'Limfosit T Sitotoksik (CD8+ Assassin)',
        bioDesc: 'Perforin melubangi membran sel target, memungkinkan enzim granzyme masuk dan memicu kaskade caspase untuk memicu bunuh diri sel (Programmed Cell Death).',
        effectDesc: 'Menembus pertahanan perisai (True Damage) dan melisiskan patogen kuat serta Superbug Boss seketika.',
        btnText: '⚔️ TERJUN KE ARENA PERTEMPURAN SEKARANG!'
      }
    ];

    // Bind continue button
    if (this.btnNext) {
      this.btnNext.onclick = () => this.advanceFromCard();
    }

    this.actors = [];
    this.particles = [];
    this.triggeredSteps = {};
  }

  start() {
    this.isPlaying = true;
    this.isPausedForCard = false;
    this.userPaused = false;
    this.currentTime = 0;
    this.currentStep = 0;
    this.triggeredSteps = {};

    sound.init();
    sound.resume();
    sound.playAlarm();

    if (this.uiCard) this.uiCard.classList.add('hidden');
    this.updateStepperUI(0);
    this.initSceneActors();
  }

  stop() {
    this.isPlaying = false;
    this.isPausedForCard = false;
    if (this.uiCard) this.uiCard.classList.add('hidden');
  }

  togglePause() {
    this.userPaused = !this.userPaused;
    return this.userPaused;
  }

  advanceFromCard() {
    if (this.currentStep >= this.steps.length - 1) {
      // Completed all 4 steps!
      this.stop();
      if (this.onComplete) this.onComplete();
      return;
    }

    this.currentStep++;
    this.isPausedForCard = false;
    if (this.uiCard) this.uiCard.classList.add('hidden');
    this.updateStepperUI(this.currentStep);
    sound.playPickup('buff');
  }

  triggerPauseCard(stepIdx) {
    this.isPausedForCard = true;
    const stepData = this.steps[stepIdx];
    if (!stepData || !this.uiCard) return;

    sound.playLevelUp();

    this.tacStepTag.innerText = stepData.stepTag;
    this.tacKeyBadge.innerHTML = stepData.keyBadge;
    this.tacAvatar.innerText = stepData.avatar;
    this.tacTitle.innerText = stepData.title;
    this.tacCellName.innerText = stepData.cellName;
    this.tacBioDesc.innerText = stepData.bioDesc;
    this.tacEffectDesc.innerText = stepData.effectDesc;
    this.btnNext.innerText = stepData.btnText;

    this.uiCard.classList.remove('hidden');
    this.updateStepperUI(stepIdx);
  }

  updateStepperUI(stepIdx) {
    for (let i = 0; i < 4; i++) {
      const pill = document.getElementById(`step-pill-${i}`);
      if (!pill) continue;
      pill.className = 'step-pill';
      if (i === stepIdx) pill.classList.add('active');
      else if (i < stepIdx) pill.classList.add('completed');
    }
  }

  initSceneActors() {
    this.actors = [];
    this.particles = [];

    // Ambient floating erythrocytes & fluid droplets
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        type: 'ambient',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 15,
        vy: -15 - Math.random() * 20,
        radius: 8 + Math.random() * 12,
        color: 'rgba(0, 210, 255, 0.12)'
      });
    }

    // Pathogens on the right
    const enemyTypes = ['influenza', 'sars_cov_2', 'streptococcus', 'influenza'];
    for (let i = 0; i < 4; i++) {
      this.actors.push({
        id: `enemy_${i}`,
        type: enemyTypes[i],
        x: this.canvas.width * 0.68 + (i * 30),
        y: this.canvas.height * 0.32 + (i * 45),
        radius: 16,
        color: i % 2 === 0 ? '#ff4b72' : '#9d4edd',
        dead: false,
        opsonized: false,
        trapped: false,
        spikes: 10
      });
    }

    // Immune Cell Actors
    this.macro = { x: -60, y: this.canvas.height * 0.42, radius: 30, color: '#00e5ff', active: true };
    this.neutro = { x: -60, y: this.canvas.height * 0.30, radius: 22, color: '#00ff88', active: false };
    this.bcell = { x: -60, y: this.canvas.height * 0.65, radius: 23, color: '#ff007f', active: false };
    this.tcell = { x: -60, y: this.canvas.height * 0.50, radius: 22, color: '#ffaa00', active: false };
  }

  update(dt) {
    if (!this.isPlaying || this.isPausedForCard || this.userPaused) return;

    this.currentTime += dt;
    const t = this.currentTime;

    // Check Trigger Points for Auto-Pause
    this.steps.forEach((step, idx) => {
      if (t >= step.triggerTime && !this.triggeredSteps[idx]) {
        this.triggeredSteps[idx] = true;
        this.triggerPauseCard(idx);
      }
    });

    // --- SCENE CHOREOGRAPHY ---

    // 1. Stage 0: Makrofag enters & swallows enemy 0
    if (this.currentStep === 0) {
      const targetX = this.canvas.width * 0.48;
      const targetY = this.canvas.height * 0.40;
      this.macro.x += (targetX - this.macro.x) * 0.08;
      this.macro.y += (targetY - this.macro.y) * 0.08;

      if (t > 2.2 && !this.triggeredSteps['phago_sfx']) {
        this.triggeredSteps['phago_sfx'] = true;
        sound.playPhagocytosis();
        const victim = this.actors[0];
        if (victim) {
          victim.dead = true;
          this.spawnDebris(victim.x, victim.y, victim.color, 20);
        }
      }
    }

    // 2. Stage 1: Neutrofil rushes & deploys NETosis
    if (this.currentStep === 1) {
      this.neutro.active = true;
      const targetX = this.canvas.width * 0.42;
      const targetY = this.canvas.height * 0.30;
      this.neutro.x += (targetX - this.neutro.x) * 0.12;
      this.neutro.y += (targetY - this.neutro.y) * 0.12;

      if (t > 5.5 && !this.triggeredSteps['net_sfx']) {
        this.triggeredSteps['net_sfx'] = true;
        sound.playNETosis();
        this.actors.forEach((a) => { if (!a.dead) a.trapped = true; });
        this.netWeb = { x: this.canvas.width * 0.72, y: this.canvas.height * 0.45, radius: 105 };
      }
    }

    // 3. Stage 2: Limfosit B fires Opsonization Antibodies
    if (this.currentStep === 2) {
      this.bcell.active = true;
      const targetX = this.canvas.width * 0.38;
      const targetY = this.canvas.height * 0.65;
      this.bcell.x += (targetX - this.bcell.x) * 0.09;
      this.bcell.y += (targetY - this.bcell.y) * 0.09;

      if (t > 9.5 && !this.triggeredSteps['opson_sfx']) {
        this.triggeredSteps['opson_sfx'] = true;
        sound.playShoot('antibody');
        this.actors.forEach((a) => { if (!a.dead) a.opsonized = true; });
      }
    }

    // 4. Stage 3: Limfosit T executes Granzyme Apoptosis
    if (this.currentStep === 3) {
      this.tcell.active = true;
      const targetX = this.canvas.width * 0.58;
      const targetY = this.canvas.height * 0.45;
      this.tcell.x += (targetX - this.tcell.x) * 0.14;
      this.tcell.y += (targetY - this.tcell.y) * 0.14;

      if (t > 13.5 && !this.triggeredSteps['apoptosis_sfx']) {
        this.triggeredSteps['apoptosis_sfx'] = true;
        sound.playLysis();
        this.actors.forEach((a) => {
          if (!a.dead) {
            a.dead = true;
            this.spawnDebris(a.x, a.y, a.color, 24);
          }
        });
      }
    }

    // Update Particles
    this.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < -20) p.y = this.canvas.height + 20;
    });

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.type === 'debris') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
    }
  }

  spawnDebris(x, y, color, count = 18) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 160;
      this.particles.push({
        type: 'debris',
        x, y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2 + Math.random() * 4,
        color,
        life: 0.6 + Math.random() * 0.3
      });
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.currentTime;

    // 1. Deep Respiratory Epithelium Backdrop
    ctx.fillStyle = '#030a17';
    ctx.fillRect(0, 0, w, h);

    // Alveolar air pocket rings
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const ax = (w * 0.15) + (i * 180) % (w * 0.85);
      const ay = (h * 0.3) + Math.sin(i * 2) * 70;
      ctx.beginPath();
      ctx.arc(ax, ay, 75, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Ambient fluid particles
    this.particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. NETosis Chromatin Web if deployed
    if (this.netWeb) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.netWeb.x, this.netWeb.y, this.netWeb.radius, 0, Math.PI * 2);
      ctx.stroke();
      for (let a = 0; a < 8; a++) {
        const ang = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(this.netWeb.x, this.netWeb.y);
        ctx.lineTo(this.netWeb.x + Math.cos(ang) * this.netWeb.radius, this.netWeb.y + Math.sin(ang) * this.netWeb.radius);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Pathogen Targets
    this.actors.forEach((a) => {
      if (a.dead) return;
      ctx.save();
      ctx.translate(a.x, a.y);

      // Opsonization Y-marks
      if (a.opsonized) {
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, a.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Spikes
      ctx.strokeStyle = '#ffd166';
      ctx.fillStyle = '#ffd166';
      ctx.lineWidth = 1.5;
      for (let s = 0; s < a.spikes; s++) {
        const ang = (s * Math.PI * 2) / a.spikes + t * 0.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * a.radius, Math.sin(ang) * a.radius);
        ctx.lineTo(Math.cos(ang) * (a.radius + 7), Math.sin(ang) * (a.radius + 7));
        ctx.stroke();
      }

      ctx.fillStyle = a.color;
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 5. Draw Actors with Distinct Morphologies
    if (this.macro.active) {
      this.renderDetailedActor(ctx, this.macro, 'macrophage', 0);
    }
    if (this.neutro.active) {
      this.renderDetailedActor(ctx, this.neutro, 'neutrophil', 0.1);
    }
    if (this.bcell.active) {
      this.renderDetailedActor(ctx, this.bcell, 'b_cell', -0.1);
    }
    if (this.tcell.active) {
      this.renderDetailedActor(ctx, this.tcell, 't_cell', 0);
    }

    // 6. Freeze Spotlight Vignette when paused for card
    if (this.isPausedForCard) {
      ctx.save();
      ctx.fillStyle = 'rgba(2, 6, 16, 0.65)';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 7. Widescreen Letterbox Bars
    const barH = 38;
    ctx.fillStyle = '#02050c';
    ctx.fillRect(0, 0, w, barH);
    ctx.fillRect(0, h - barH, w, barH);

    // Header Status Ticker
    ctx.font = 'bold 12px Rajdhani, sans-serif';
    ctx.fillStyle = '#00d2ff';
    ctx.textAlign = 'left';
    ctx.fillText('🔴 SIMULASI TAKTIK REAL-TIME • PANDUAN PENGGUNAAN SEL IMUN', 20, 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffd166';
    ctx.fillText(this.isPausedForCard ? '⏸ WAKTU DIHENTIKAN UNTUK PENJELASAN' : '▶ SIMULASI BERJALAN', w - 20, 24);
  }

  renderDetailedActor(ctx, actor, type, angle) {
    ctx.save();
    ctx.translate(actor.x, actor.y);
    ctx.rotate(angle);

    const r = actor.radius;

    if (type === 'macrophage') {
      // Amoeboid with kidney nucleus and pseudopodia
      ctx.fillStyle = actor.color;
      ctx.shadowColor = actor.color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0.35, Math.PI * 1.65);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Kidney nucleus
      ctx.fillStyle = '#005f9e';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(-r * 0.25, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'neutrophil') {
      // Twin granule cannon barrels & 3 PMN lobes
      ctx.fillStyle = actor.color;
      ctx.shadowColor = actor.color;
      ctx.shadowBlur = 12;
      ctx.fillRect(r * 0.65, -6, 12, 4);
      ctx.fillRect(r * 0.65, 2, 12, 4);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // 3-Lobed Nucleus
      ctx.fillStyle = '#007f4f';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(-5, -4, 5, 0, Math.PI * 2);
      ctx.arc(-5, 4, 5, 0, Math.PI * 2);
      ctx.arc(4, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'b_cell') {
      // Y-shaped BCR sight receptors
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(r * 0.7, -6);
      ctx.lineTo(r + 9, -9);
      ctx.moveTo(r * 0.7, 6);
      ctx.lineTo(r + 9, 9);
      ctx.stroke();

      ctx.fillStyle = actor.color;
      ctx.shadowColor = actor.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Giant nucleus
      ctx.fillStyle = '#6a0080';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 't_cell') {
      // Delta arrow body with twin perforin lances
      ctx.fillStyle = '#ffaa00';
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 14;
      ctx.fillRect(0, -r - 5, 14, 4);
      ctx.fillRect(0, r + 1, 14, 4);

      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(-r * 0.6, -r * 0.8);
      ctx.lineTo(-r * 0.3, 0);
      ctx.lineTo(-r * 0.6, r * 0.8);
      ctx.closePath();
      ctx.fill();
    }

    // Hero eye
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(r * 0.3, -4, 3, 0, Math.PI * 2);
    ctx.arc(r * 0.3, 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(r * 0.3 + 1, -4, 1.5, 0, Math.PI * 2);
    ctx.arc(r * 0.3 + 1, 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
