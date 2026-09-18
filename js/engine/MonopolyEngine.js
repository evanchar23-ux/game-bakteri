// js/engine/MonopolyEngine.js
// Mesin Utama Permainan Papan Bio-Monopoly (Monopoli Imunologis)
// 100% Bebas Emoji - Dilengkapi Panduan Interaktif & Indikator Aksi Real-time

import { BOARD_TILES, PAWN_TYPES } from '../data/monopolyBoardData.js';
import { MONOPOLY_QUESTIONS } from '../data/monopolyQuestions.js';
import { MONOPOLY_EVENTS } from '../data/monopolyEvents.js';

export class MonopolyEngine {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.tiles = JSON.parse(JSON.stringify(BOARD_TILES));
    this.questions = [...MONOPOLY_QUESTIONS];
    this.events = [...MONOPOLY_EVENTS];
    this.usedQuestions = new Set();
    this.usedEvents = new Set();

    this.mode = 'vs_ai'; // 'vs_ai' or 'pass_and_play'
    this.players = [];
    this.currentPlayerIdx = 0;
    this.isRolling = false;
    this.isTurnProcessing = false;
    this.targetATPWin = 2500;
    this.turnCount = 1;

    // DOM references
    this.screen = document.getElementById('monopoly-screen');
    this.boardEl = document.getElementById('monopoly-board');
    this.diceEl = document.getElementById('monopoly-dice-cube');
    this.btnRoll = document.getElementById('btn-monopoly-roll');
    this.turnBanner = document.getElementById('monopoly-turn-banner');
    this.stepHintEl = document.getElementById('mono-hub-step-hint');
    this.playersListEl = document.getElementById('monopoly-players-list');
    this.logListEl = document.getElementById('monopoly-log-list');

    // Modals
    this.quizModal = document.getElementById('monopoly-quiz-modal');
    this.eventModal = document.getElementById('monopoly-event-modal');
    this.propertyModal = document.getElementById('monopoly-property-modal');
    this.winnerModal = document.getElementById('monopoly-winner-modal');
    this.setupModal = document.getElementById('monopoly-setup-modal');
    this.guideModal = document.getElementById('monopoly-guide-modal');

    this.timerInterval = null;
    this.setupListeners();
  }

  setupListeners() {
    if (this.btnRoll) {
      this.btnRoll.onclick = () => this.handlePlayerRoll();
    }

    const btnCloseMonopoly = document.getElementById('btn-close-monopoly');
    if (btnCloseMonopoly) {
      btnCloseMonopoly.onclick = () => this.exitMonopoly();
    }

    // Guide Modal
    const btnGuide = document.getElementById('btn-mono-guide');
    if (btnGuide) {
      btnGuide.onclick = () => this.openGuide();
    }

    const btnCloseGuide = document.getElementById('btn-close-mono-guide');
    if (btnCloseGuide) {
      btnCloseGuide.onclick = () => this.closeGuide();
    }

    const btnGuideOk = document.getElementById('btn-mono-guide-ok');
    if (btnGuideOk) {
      btnGuideOk.onclick = () => this.closeGuide();
    }

    // Setup mode buttons
    const btnStartVsAi = document.getElementById('btn-mono-start-ai');
    if (btnStartVsAi) {
      btnStartVsAi.onclick = () => this.startNewGame('vs_ai');
    }

    const btnStartPassPlay = document.getElementById('btn-mono-start-pass');
    if (btnStartPassPlay) {
      btnStartPassPlay.onclick = () => this.startNewGame('pass_and_play');
    }

    const btnWinnerMenu = document.getElementById('btn-mono-winner-menu');
    if (btnWinnerMenu) {
      btnWinnerMenu.onclick = () => this.exitMonopoly();
    }

    const btnWinnerPlayAgain = document.getElementById('btn-mono-winner-again');
    if (btnWinnerPlayAgain) {
      btnWinnerPlayAgain.onclick = () => this.openSetup();
    }
  }

  openGuide() {
    if (this.guideModal) {
      this.guideModal.classList.remove('hidden');
    }
  }

  closeGuide() {
    if (this.guideModal) {
      this.guideModal.classList.add('hidden');
    }
  }

  openSetup() {
    this.resetBoardState();
    if (this.setupModal) {
      this.setupModal.classList.remove('hidden');
    }
    if (this.winnerModal) {
      this.winnerModal.classList.add('hidden');
    }
    if (this.guideModal) {
      this.guideModal.classList.add('hidden');
    }
  }

  startNewGame(mode = 'vs_ai') {
    this.mode = mode;
    this.resetBoardState();

    if (this.setupModal) {
      this.setupModal.classList.add('hidden');
    }

    if (mode === 'vs_ai') {
      this.players = [
        {
          id: 'p1',
          name: 'Pemain (Sel Imun)',
          isAI: false,
          pawn: PAWN_TYPES[0], // Makrofag
          atp: 1000,
          position: 0,
          inJailTurns: 0,
          properties: [],
          color: '#00f2fe'
        },
        {
          id: 'ai1',
          name: 'Superbug (AI Patogen)',
          isAI: true,
          pawn: PAWN_TYPES[1], // Sel T / Mutan
          atp: 1000,
          position: 0,
          inJailTurns: 0,
          properties: [],
          color: '#ff3d78'
        }
      ];
    } else {
      // Pass & Play 2 Players
      this.players = [
        {
          id: 'p1',
          name: 'Pemain 1 (Makrofag)',
          isAI: false,
          pawn: PAWN_TYPES[0],
          atp: 1000,
          position: 0,
          inJailTurns: 0,
          properties: [],
          color: '#00f2fe'
        },
        {
          id: 'p2',
          name: 'Pemain 2 (Neutrofil)',
          isAI: false,
          pawn: PAWN_TYPES[3],
          atp: 1000,
          position: 0,
          inJailTurns: 0,
          properties: [],
          color: '#2fe7c8'
        }
      ];
    }

    this.currentPlayerIdx = 0;
    this.turnCount = 1;
    this.isRolling = false;
    this.isTurnProcessing = false;

    this.renderBoard();
    this.updateHUD();
    this.addLog(`<span class="mono-log-tag tag-start">START</span> Sesi Monopoli Imun dimulai. Giliran awal: <b>${this.getCurrentPlayer().name}</b>.`);
    this.updateTurnUI();
  }

  resetBoardState() {
    this.tiles = JSON.parse(JSON.stringify(BOARD_TILES));
    this.usedQuestions.clear();
    this.usedEvents.clear();
    if (this.logListEl) this.logListEl.innerHTML = '';
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIdx];
  }

  setStepHint(text) {
    if (this.stepHintEl) {
      this.stepHintEl.innerText = text;
    }
  }

  renderBoard() {
    if (!this.boardEl) return;
    this.boardEl.innerHTML = '';

    this.tiles.forEach((tile) => {
      const tileDiv = document.createElement('div');
      tileDiv.className = `mono-tile tile-type-${tile.type}`;
      tileDiv.dataset.index = tile.index;
      tileDiv.id = `mono-tile-${tile.index}`;

      // Property header bar if applicable
      let headerBar = '';
      if (tile.type === 'property') {
        const ownerColor = tile.owner ? tile.owner.color : tile.groupColor;
        const ownerLabel = tile.owner ? `POS: ${tile.owner.name.slice(0, 8)}` : `BIAYA: ${tile.price} ATP`;
        headerBar = `<div class="mono-tile-bar" style="background: ${ownerColor};">
          <span>${ownerLabel}</span>
          ${tile.level > 0 ? `<span class="tile-lvl-badge">★${tile.level}</span>` : ''}
        </div>`;
      }

      tileDiv.innerHTML = `
        ${headerBar}
        <div class="mono-tile-content">
          <span class="mono-tile-icon">${tile.icon}</span>
          <span class="mono-tile-name">${tile.name}</span>
          <span class="mono-tile-sub">${tile.sub}</span>
        </div>
        <div class="mono-tile-pawns" id="mono-tile-pawns-${tile.index}"></div>
      `;

      this.boardEl.appendChild(tileDiv);
    });

    this.renderPawns();
  }

  renderPawns() {
    // Clear all pawns from tiles
    this.tiles.forEach((tile) => {
      const pContainer = document.getElementById(`mono-tile-pawns-${tile.index}`);
      if (pContainer) pContainer.innerHTML = '';
    });

    // Render active pawns on their current tile
    this.players.forEach((player) => {
      const pContainer = document.getElementById(`mono-tile-pawns-${player.position}`);
      if (pContainer) {
        const pawnEl = document.createElement('div');
        pawnEl.className = `mono-pawn-token ${player.pawn.avatarClass}`;
        pawnEl.style.borderColor = player.color;
        pawnEl.style.boxShadow = `0 0 10px ${player.color}`;
        pawnEl.title = `${player.name} (${player.atp} ATP)`;
        pawnEl.innerHTML = player.pawn.icon;
        pContainer.appendChild(pawnEl);
      }
    });
  }

  updateHUD() {
    if (!this.playersListEl) return;
    this.playersListEl.innerHTML = '';

    this.players.forEach((p, idx) => {
      const isCurrent = idx === this.currentPlayerIdx;
      const card = document.createElement('div');
      card.className = `mono-player-card ${isCurrent ? 'active-turn' : ''}`;
      card.style.borderColor = isCurrent ? p.color : 'rgba(255,255,255,0.1)';

      card.innerHTML = `
        <div class="mono-player-pawn-avatar" style="border-color: ${p.color}; box-shadow: 0 0 8px ${p.color};">
          ${p.pawn.icon}
        </div>
        <div class="mono-player-meta">
          <div class="mono-player-name-row">
            <span class="mono-player-name" style="color: ${p.color};">${p.name}</span>
            ${p.inJailTurns > 0 ? '<span class="mono-jail-badge">ISOLASI</span>' : ''}
          </div>
          <div class="mono-player-atp-row">
            <span class="mono-atp-label">ENERGI:</span>
            <span class="mono-atp-val">${p.atp} ATP</span>
          </div>
          <div class="mono-player-props-row">
            <span>Pos Organ: ${p.properties.length}</span>
            <span>Target: ${this.targetATPWin} ATP</span>
          </div>
        </div>
      `;
      this.playersListEl.appendChild(card);
    });
  }

  updateTurnUI() {
    const player = this.getCurrentPlayer();
    if (this.turnBanner) {
      this.turnBanner.innerHTML = `
        <span class="pulse-beacon" style="background: ${player.color}; box-shadow: 0 0 8px ${player.color};"></span>
        <span>GILIRAN: <b style="color: ${player.color};">${player.name.toUpperCase()}</b> (PUTARAN #${this.turnCount})</span>
      `;
    }

    if (this.btnRoll) {
      if (player.isAI) {
        this.btnRoll.disabled = true;
        this.btnRoll.innerHTML = `<span>MEMPROSES GILIRAN AI...</span>`;
        this.setStepHint(`GILIRAN ${player.name.toUpperCase()}: SEDANG MENGHITUNG STRATEGI...`);
        setTimeout(() => this.handleAIRoll(), 900);
      } else {
        this.btnRoll.disabled = false;
        this.btnRoll.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15" style="margin-right: 6px;"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>
          <span>KOCOK DADU IMUN</span>
        `;
        this.setStepHint(`GILIRAN ANDA: KLIK TOMBOL KOCOK DADU DI BAWAH`);
      }
    }
  }

  handlePlayerRoll() {
    if (this.isRolling || this.isTurnProcessing) return;
    const player = this.getCurrentPlayer();
    if (player.isAI) return;

    this.executeDiceRoll(player);
  }

  handleAIRoll() {
    if (this.isRolling || this.isTurnProcessing) return;
    const player = this.getCurrentPlayer();
    if (!player.isAI) return;

    this.executeDiceRoll(player);
  }

  executeDiceRoll(player) {
    this.isRolling = true;
    if (this.btnRoll) this.btnRoll.disabled = true;

    // Check jail condition
    if (player.inJailTurns > 0) {
      player.inJailTurns--;
      this.addLog(`<span class="mono-log-tag tag-jail">ISOLASI</span> ${player.name} menjalani masa karantina dan istirahat di petak isolasi.`);
      this.setStepHint(`ISOLASI MEDIS: ${player.name} menyelesaikan masa karantina.`);
      this.isRolling = false;
      setTimeout(() => this.nextTurn(), 1200);
      return;
    }

    this.setStepHint(`MENGUMPULKAN ENERGI & MENGINJAK SIRKUIT...`);

    // Play rolling animation
    if (window.sound && window.sound.playClick) {
      window.sound.playClick();
    }

    if (this.diceEl) {
      this.diceEl.classList.add('rolling');
    }

    // Random roll 1..6
    const rollValue = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      if (this.diceEl) {
        this.diceEl.classList.remove('rolling');
        this.setDiceFace(rollValue);
      }

      this.addLog(`<span class="mono-log-tag tag-roll">DADU</span> ${player.name} melempar dadu dan mendapatkan angka <b>${rollValue}</b>.`);
      this.setStepHint(`MELANGKAH ${rollValue} PETAK DI JALUR ORGAN...`);
      this.movePlayerSteps(player, rollValue);
    }, 850);
  }

  setDiceFace(val) {
    if (!this.diceEl) return;
    this.diceEl.dataset.value = val;
    this.diceEl.innerText = val;
  }

  movePlayerSteps(player, steps) {
    let stepsLeft = steps;
    const stepInterval = setInterval(() => {
      if (stepsLeft > 0) {
        player.position = (player.position + 1) % this.tiles.length;
        stepsLeft--;

        // Passed START
        if (player.position === 0) {
          player.atp += 200;
          this.addLog(`<span class="mono-log-tag tag-start">PASOKAN</span> ${player.name} melintasi Sumsum Tulang (+200 ATP suplai leukosit)!`);
          this.showToast(`+200 ATP (Sumsum Tulang)!`, '#00f2fe');
        }

        if (window.sound && window.sound.playClick) {
          window.sound.playClick();
        }

        this.renderPawns();
        this.updateHUD();
      } else {
        clearInterval(stepInterval);
        this.isRolling = false;
        setTimeout(() => this.handleTileLanding(player), 500);
      }
    }, 480);
  }

  handleTileLanding(player) {
    this.isTurnProcessing = true;
    const tile = this.tiles[player.position];
    this.addLog(`<span class="mono-log-tag tag-info">SEKTOR</span> ${player.name} tiba di <b>${tile.name}</b> (${tile.sub}).`);

    switch (tile.type) {
      case 'start':
        player.atp += 100;
        this.addLog(`<span class="mono-log-tag tag-start">BONUS</span> ${player.name} mendarat tepat di Base Sumsum Tulang (+100 ATP)!`);
        this.showToast(`Bonus Tepat Start +100 ATP!`, '#00f2fe');
        this.setStepHint(`BONUS TEPAT START: +100 ATP!`);
        setTimeout(() => this.finishTileAction(), 1000);
        break;

      case 'property':
        this.handlePropertyLanding(player, tile);
        break;

      case 'quiz':
        this.handleQuizLanding(player, tile);
        break;

      case 'event':
        this.handleEventLanding(player, tile);
        break;

      case 'parking':
        player.atp += 50;
        this.addLog(`<span class="mono-log-tag tag-start">DETOKS</span> ${player.name} menikmati relaksasi detoksifikasi hati (+50 ATP).`);
        this.showToast(`Detoksifikasi Hepar +50 ATP!`, '#00ffcc');
        this.setStepHint(`DETOKSIFIKASI HEPAR: +50 ATP`);
        setTimeout(() => this.finishTileAction(), 1000);
        break;

      case 'go_to_jail':
        this.addLog(`<span class="mono-log-tag tag-jail">BAHAYA</span> ${player.name} terpapar patogen dan dipindahkan ke Ruang Karantina!`);
        this.showToast(`Masuk Ruang Karantina!`, '#ff3d78');
        this.setStepHint(`TERPAPAR INFEKSI: Masuk Ruang Karantina.`);
        player.position = 5; // Jail tile
        player.inJailTurns = 1;
        this.renderPawns();
        setTimeout(() => this.finishTileAction(), 1200);
        break;

      case 'jail':
        this.addLog(`<span class="mono-log-tag tag-jail">SINGGAH</span> ${player.name} sedang singgah di pos pengawasan isolasi.`);
        this.setStepHint(`SINGGAH AMAN: Pos Isolasi`);
        setTimeout(() => this.finishTileAction(), 800);
        break;

      case 'booster':
        player.atp += 100;
        this.addLog(`<span class="mono-log-tag tag-start">KLINIK</span> ${player.name} menerima booster klinik imunisasi (+100 ATP)!`);
        this.showToast(`Klinik Vaksinasi +100 ATP!`, '#4cc9f0');
        this.setStepHint(`KLINIK VAKSINASI: +100 ATP`);
        setTimeout(() => this.finishTileAction(), 1000);
        break;

      default:
        setTimeout(() => this.finishTileAction(), 600);
    }
  }

  handlePropertyLanding(player, tile) {
    if (!tile.owner) {
      // Unowned property: Prompt buy
      if (player.isAI) {
        // AI logic: Buy if ATP > price + 150
        if (player.atp >= tile.price + 150) {
          player.atp -= tile.price;
          tile.owner = player;
          player.properties.push(tile);
          this.addLog(`<span class="mono-log-tag tag-prop">POS</span> AI ${player.name} mendirikan Pos di <b>${tile.name}</b> seharga ${tile.price} ATP.`);
          this.renderBoard();
        } else {
          this.addLog(`<span class="mono-log-tag tag-prop">LEWATI</span> AI ${player.name} melewati kesempatan pos di ${tile.name}.`);
        }
        setTimeout(() => this.finishTileAction(), 1000);
      } else {
        // Human player: Show Buy Modal
        this.setStepHint(`KEPUTUSAN: DIRIKAN POS PERTAHANAN ATAU LEWATI`);
        this.showPropertyBuyModal(player, tile);
      }
    } else if (tile.owner.id === player.id) {
      // Owned by self: Upgrade pos
      if (player.isAI) {
        const upgradeCost = Math.round(tile.price * 0.5);
        if (tile.level < 3 && player.atp >= upgradeCost + 200) {
          player.atp -= upgradeCost;
          tile.level++;
          tile.rent = Math.round(tile.rent * 1.5);
          this.addLog(`<span class="mono-log-tag tag-prop">UPGRADE</span> AI ${player.name} meningkatkan Pos ${tile.name} ke Level ${tile.level} (Sewa: ${tile.rent} ATP).`);
          this.renderBoard();
        }
        setTimeout(() => this.finishTileAction(), 1000);
      } else {
        this.setStepHint(`UPGRADE ORGAN: PERKUAT BENTENG PERTAHANAN ANDA`);
        this.showPropertyUpgradeModal(player, tile);
      }
    } else {
      // Owned by opponent: Pay rent!
      const rentAmount = tile.rent;
      const actualRent = Math.min(player.atp, rentAmount);
      player.atp -= actualRent;
      tile.owner.atp += actualRent;

      this.addLog(`<span class="mono-log-tag tag-rent">SEWA</span> ${player.name} singgah di sektor ${tile.owner.name} (${tile.name}) dan bayar sewa ${actualRent} ATP.`);
      this.showToast(`Bayar Sewa ${actualRent} ATP ke ${tile.owner.name}`, '#ffaa00');
      this.setStepHint(`BAYAR SEWA: -${actualRent} ATP ke ${tile.owner.name}`);

      if (player.atp <= 0) {
        this.handleBankruptcy(player, tile.owner);
        return;
      }

      this.updateHUD();
      setTimeout(() => this.finishTileAction(), 1200);
    }
  }

  showPropertyBuyModal(player, tile) {
    if (!this.propertyModal) {
      setTimeout(() => this.finishTileAction(), 600);
      return;
    }

    const titleEl = document.getElementById('mono-prop-title');
    const descEl = document.getElementById('mono-prop-desc');
    const priceEl = document.getElementById('mono-prop-price');
    const rentEl = document.getElementById('mono-prop-rent');
    const btnBuy = document.getElementById('btn-mono-prop-buy');
    const btnSkip = document.getElementById('btn-mono-prop-skip');

    if (titleEl) titleEl.innerText = tile.name;
    if (descEl) descEl.innerText = `${tile.sub} — Sektor anatomis strategis untuk mendirikan pos imun.`;
    if (priceEl) priceEl.innerText = `${tile.price} ATP`;
    if (rentEl) rentEl.innerText = `${tile.rent} ATP`;

    const canAfford = player.atp >= tile.price;
    if (btnBuy) {
      btnBuy.disabled = !canAfford;
      btnBuy.onclick = () => {
        if (player.atp >= tile.price) {
          player.atp -= tile.price;
          tile.owner = player;
          player.properties.push(tile);
          this.addLog(`<span class="mono-log-tag tag-prop">POS</span> ${player.name} berhasil mendirikan Pos Pertahanan di <b>${tile.name}</b> (${tile.price} ATP)!`);
          this.showToast(`Mendirikan Pos di ${tile.name}!`, '#00f2fe');
          this.renderBoard();
          this.updateHUD();
        }
        this.propertyModal.classList.add('hidden');
        this.finishTileAction();
      };
    }

    if (btnSkip) {
      btnSkip.onclick = () => {
        this.propertyModal.classList.add('hidden');
        this.addLog(`<span class="mono-log-tag tag-prop">LEWATI</span> ${player.name} melewati penawaran pos di ${tile.name}.`);
        this.finishTileAction();
      };
    }

    this.propertyModal.classList.remove('hidden');
  }

  showPropertyUpgradeModal(player, tile) {
    if (!this.propertyModal) {
      setTimeout(() => this.finishTileAction(), 600);
      return;
    }

    const upgradeCost = Math.round(tile.price * 0.5);
    const newRent = Math.round(tile.rent * 1.5);

    const titleEl = document.getElementById('mono-prop-title');
    const descEl = document.getElementById('mono-prop-desc');
    const priceEl = document.getElementById('mono-prop-price');
    const rentEl = document.getElementById('mono-prop-rent');
    const btnBuy = document.getElementById('btn-mono-prop-buy');
    const btnSkip = document.getElementById('btn-mono-prop-skip');

    if (titleEl) titleEl.innerText = `Upgrade ${tile.name} (Lvl ${tile.level + 1})`;
    if (descEl) descEl.innerText = `Perkuat pos pertahanan organ agar sewa lawan meningkat!`;
    if (priceEl) priceEl.innerText = `${upgradeCost} ATP`;
    if (rentEl) rentEl.innerText = `${newRent} ATP (Naik dari ${tile.rent})`;

    const canAfford = player.atp >= upgradeCost;
    if (btnBuy) {
      btnBuy.disabled = !canAfford;
      btnBuy.innerText = 'UPGRADE POS!';
      btnBuy.onclick = () => {
        if (player.atp >= upgradeCost) {
          player.atp -= upgradeCost;
          tile.level++;
          tile.rent = newRent;
          this.addLog(`<span class="mono-log-tag tag-prop">UPGRADE</span> ${player.name} meng-upgrade Pos ${tile.name} ke Level ${tile.level}!`);
          this.showToast(`Pos Naik ke Lvl ${tile.level}!`, '#00ffcc');
          this.renderBoard();
          this.updateHUD();
        }
        this.propertyModal.classList.add('hidden');
        btnBuy.innerText = 'DIRIKAN POS PERTAHANAN';
        this.finishTileAction();
      };
    }

    if (btnSkip) {
      btnSkip.onclick = () => {
        this.propertyModal.classList.add('hidden');
        btnBuy.innerText = 'DIRIKAN POS PERTAHANAN';
        this.finishTileAction();
      };
    }

    this.propertyModal.classList.remove('hidden');
  }

  handleQuizLanding(player, tile) {
    // Pick random question
    const available = this.questions.filter((q) => !this.usedQuestions.has(q.id));
    const question = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : this.questions[Math.floor(Math.random() * this.questions.length)];

    this.usedQuestions.add(question.id);

    if (player.isAI) {
      // AI solves question with 75% accuracy
      const isCorrect = Math.random() < 0.75;
      setTimeout(() => {
        if (isCorrect) {
          player.atp += question.rewardATP;
          this.addLog(`<span class="mono-log-tag tag-quiz">KUIS</span> AI ${player.name} menjawab kuis dengan benar (+${question.rewardATP} ATP).`);
          this.showToast(`AI Benar +${question.rewardATP} ATP`, '#38ef7d');
        } else {
          const penalty = Math.min(player.atp, question.penaltyATP);
          player.atp -= penalty;
          this.addLog(`<span class="mono-log-tag tag-quiz">KUIS</span> AI ${player.name} salah menjawab kuis (-${penalty} ATP).`);
        }
        this.updateHUD();
        this.finishTileAction();
      }, 1000);
      return;
    }

    // Human player: Show Quiz Modal
    this.setStepHint(`TANTANGAN KUIS: PILIH JAWABAN SAINS SEBELUM WAKTU HABIS`);
    this.showQuizModal(player, question);
  }

  showQuizModal(player, question) {
    if (!this.quizModal) {
      setTimeout(() => this.finishTileAction(), 600);
      return;
    }

    const catEl = document.getElementById('mono-quiz-category');
    const kisiEl = document.getElementById('mono-quiz-kisi-text');
    const textEl = document.getElementById('mono-quiz-text');
    const optionsEl = document.getElementById('mono-quiz-options');
    const feedbackEl = document.getElementById('mono-quiz-feedback');
    const timerEl = document.getElementById('mono-quiz-timer');

    if (catEl) catEl.innerText = `${question.category} // ${question.difficulty.toUpperCase()}`;
    if (kisiEl) kisiEl.innerText = question.kisiKisi || 'Ensiklopedia Imunologi';
    if (textEl) textEl.innerText = question.question;
    if (feedbackEl) {
      feedbackEl.classList.add('hidden');
      feedbackEl.innerHTML = '';
    }

    let timeLeft = 18;
    if (timerEl) timerEl.innerText = `${timeLeft}s`;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.innerText = `${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.resolveQuizAnswer(player, question, -1, optionsEl, feedbackEl);
      }
    }, 1000);

    if (optionsEl) {
      optionsEl.innerHTML = '';
      question.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'mono-quiz-opt-btn';
        btn.innerHTML = `<span class="opt-key">${String.fromCharCode(65 + idx)}</span> <span class="opt-label">${opt}</span>`;
        btn.onclick = () => {
          clearInterval(this.timerInterval);
          this.resolveQuizAnswer(player, question, idx, optionsEl, feedbackEl);
        };
        optionsEl.appendChild(btn);
      });
    }

    this.quizModal.classList.remove('hidden');
  }

  resolveQuizAnswer(player, question, selectedIdx, optionsEl, feedbackEl) {
    if (optionsEl) {
      const allBtns = optionsEl.querySelectorAll('.mono-quiz-opt-btn');
      allBtns.forEach((b, i) => {
        b.disabled = true;
        if (i === question.correct) {
          b.classList.add('correct');
        } else if (i === selectedIdx) {
          b.classList.add('wrong');
        }
      });
    }

    const isCorrect = selectedIdx === question.correct;
    if (isCorrect) {
      player.atp += question.rewardATP;
      this.addLog(`<span class="mono-log-tag tag-quiz">KUIS</span> ${player.name} menjawab benar kuis biologi (+${question.rewardATP} ATP)!`);
      this.showToast(`Jawaban Benar! +${question.rewardATP} ATP`, '#38ef7d');
    } else {
      const penalty = Math.min(player.atp, question.penaltyATP);
      player.atp -= penalty;
      this.addLog(`<span class="mono-log-tag tag-quiz">KUIS</span> ${player.name} salah menjawab kuis biologi (-${penalty} ATP).`);
      this.showToast(`Salah Jawab (-${penalty} ATP)`, '#ff3d78');
    }

    this.updateHUD();

    if (feedbackEl) {
      feedbackEl.classList.remove('hidden');
      feedbackEl.innerHTML = `
        <div class="feedback-badge ${isCorrect ? 'correct' : 'wrong'}">
          ${isCorrect ? 'JAWABAN ANDA TEPAT!' : 'JAWABAN KURANG TEPAT!'}
        </div>
        <div class="feedback-kisi-ref">
          <span class="fk-tag">KISI-KISI DOSEN // IMUNPEDIA:</span>
          <span class="fk-val">${question.kisiKisi || 'Ensiklopedia Imun'}</span>
        </div>
        <p class="feedback-explanation"><b>BEDAH SAINS:</b> ${question.explanation}</p>
        <button type="button" id="btn-mono-quiz-continue" class="btn-primary glow-btn" style="margin-top: 10px; width: 100%; padding: 8px;">
          LANJUTKAN PERMAINAN
        </button>
      `;

      const btnContinue = document.getElementById('btn-mono-quiz-continue');
      if (btnContinue) {
        btnContinue.onclick = () => {
          this.quizModal.classList.add('hidden');
          this.finishTileAction();
        };
      }
    }
  }

  handleEventLanding(player, tile) {
    // Pick random event
    const available = this.events.filter((e) => !this.usedEvents.has(e.id));
    const event = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : this.events[Math.floor(Math.random() * this.events.length)];

    this.usedEvents.add(event.id);

    if (player.isAI) {
      const logText = event.apply(player, this);
      this.addLog(`<span class="mono-log-tag tag-event">EVENT</span> ${logText}`);
      if (event.moveSteps) {
        player.position = (player.position + event.moveSteps + this.tiles.length) % this.tiles.length;
        this.renderPawns();
      } else if (event.sendToJail) {
        player.position = 5;
        player.inJailTurns = 1;
        this.renderPawns();
      }
      this.updateHUD();
      setTimeout(() => this.finishTileAction(), 1000);
      return;
    }

    // Human player: Show Event Modal
    this.setStepHint(`KARTU MEDIS BIO-HAZARD: BACA EFEK DAN TEKAN TERAPKAN`);
    this.showEventModal(player, event);
  }

  showEventModal(player, event) {
    if (!this.eventModal) {
      setTimeout(() => this.finishTileAction(), 600);
      return;
    }

    const iconEl = document.getElementById('mono-event-icon');
    const titleEl = document.getElementById('mono-event-title');
    const descEl = document.getElementById('mono-event-desc');
    const effectEl = document.getElementById('mono-event-effect');
    const btnOk = document.getElementById('btn-mono-event-ok');

    if (iconEl) iconEl.innerHTML = event.icon;
    if (titleEl) titleEl.innerText = event.title;
    if (descEl) descEl.innerText = event.description;
    if (effectEl) {
      effectEl.innerText = event.effectText;
      effectEl.className = `mono-event-effect-pill ${event.type}`;
    }

    if (btnOk) {
      btnOk.onclick = () => {
        this.eventModal.classList.add('hidden');
        const logText = event.apply(player, this);
        this.addLog(`<span class="mono-log-tag tag-event">EVENT</span> ${logText}`);

        if (event.moveSteps) {
          player.position = (player.position + event.moveSteps + this.tiles.length) % this.tiles.length;
          this.renderPawns();
        } else if (event.sendToJail) {
          player.position = 5;
          player.inJailTurns = 1;
          this.renderPawns();
        }

        this.updateHUD();
        this.finishTileAction();
      };
    }

    this.eventModal.classList.remove('hidden');
  }

  finishTileAction() {
    this.isTurnProcessing = false;
    this.checkVictoryConditions();
  }

  checkVictoryConditions() {
    // 1. Target ATP reached
    const topPlayer = this.players.find((p) => p.atp >= this.targetATPWin);
    if (topPlayer) {
      this.declareWinner(topPlayer, `Mencapai target energi maksimum ${this.targetATPWin} ATP!`);
      return;
    }

    // 2. Controlled majority of properties (>= 6 properties)
    const propertyLeader = this.players.find((p) => p.properties.length >= 6);
    if (propertyLeader) {
      this.declareWinner(propertyLeader, `Menguasai 6 pos pertahanan organ tubuh secara mutlak!`);
      return;
    }

    this.nextTurn();
  }

  handleBankruptcy(bankruptPlayer, recipient) {
    this.addLog(`<span class="mono-log-tag tag-jail">BANGKRUT</span> ${bankruptPlayer.name} kehabisan seluruh energi ATP dan tereliminasi!`);
    this.declareWinner(recipient, `${bankruptPlayer.name} bangkrut dan tereliminasi dari pertempuran!`);
  }

  declareWinner(winner, reason) {
    if (!this.winnerModal) return;

    const winnerNameEl = document.getElementById('mono-winner-name');
    const winnerReasonEl = document.getElementById('mono-winner-reason');
    const winnerAtpEl = document.getElementById('mono-winner-atp');
    const winnerPropsEl = document.getElementById('mono-winner-props');

    if (winnerNameEl) {
      winnerNameEl.innerText = winner.name.toUpperCase();
      winnerNameEl.style.color = winner.color;
    }
    if (winnerReasonEl) winnerReasonEl.innerText = reason;
    if (winnerAtpEl) winnerAtpEl.innerText = `${winner.atp} ATP`;
    if (winnerPropsEl) winnerPropsEl.innerText = `${winner.properties.length} Pos Organ`;

    this.winnerModal.classList.remove('hidden');
    this.addLog(`<span class="mono-log-tag tag-start">MENANG</span> Kemenangan mutlak diraih oleh <b>${winner.name}</b>!`);
    this.setStepHint(`MISI SELESAI: ${winner.name} MEMENANGKAN PERMAINAN`);
  }

  nextTurn() {
    this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
    if (this.currentPlayerIdx === 0) {
      this.turnCount++;
    }

    this.updateHUD();
    this.updateTurnUI();
  }

  addLog(msg) {
    if (!this.logListEl) return;
    const entry = document.createElement('div');
    entry.className = 'mono-log-entry';
    entry.innerHTML = `<span class="log-bullet">•</span> <span class="log-text">${msg}</span>`;
    this.logListEl.prepend(entry);

    // Keep log max 25 items
    while (this.logListEl.children.length > 25) {
      this.logListEl.removeChild(this.logListEl.lastChild);
    }
  }

  showToast(text, color = '#00f2fe') {
    const toast = document.createElement('div');
    toast.className = 'mono-toast-pop';
    toast.style.borderColor = color;
    toast.style.color = color;
    toast.innerText = text;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 1800);
  }

  openScreen() {
    if (this.screen) {
      this.screen.classList.remove('hidden');
      this.screen.classList.add('active');
    }
    this.openSetup();
  }

  exitMonopoly() {
    if (this.screen) {
      this.screen.classList.add('hidden');
      this.screen.classList.remove('active');
    }
    if (this.game && this.game.uiMenu) {
      this.game.showScreen(this.game.uiMenu);
    }
  }
}
