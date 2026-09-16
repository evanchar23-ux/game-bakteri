/**
 * educationalCinema.js
 * Engine Bioskop Mini Animasi Edukasi Imunologi (Durasi ~2 Menit / 24 Baris Dialog)
 * 
 * FITUR UTAMA:
 * 1. Multi-Voice Over Asli Studio ElevenLabs (24 File MP3 Jernih):
 *    - Kak Arya (Dokter / Host Sains Cerdas & Berwibawa)
 *    - Cia (Adik Cewek Ceria, Penasaran & Menggemaskan)
 * 2. Avatar Animasi 2D Interaktif (CharacterAvatars2D):
 *    - Mulut berbicara dinamis (Lip-Flap)
 *    - Kedipan mata alami (Eye Blink)
 *    - Nafas halus (Breathing Sway LFO)
 *    - Gestur tangan (menunjuk mikroskop, memegang pipi saat kaget, kepalan tangan semangat)
 *    - Kartu spotlight aktif menyala otomatis mengikuti suara yang bicara
 * 3. 7 Babak Edukasi Ilmiah & Tips Kesehatan Nyata:
 *    - Babak 1: Invasi Kuman - Bakteri vs Virus
 *    - Babak 2: Garda Depan - Makrofag Fagositosis & Jaring NETosis Neutrofil
 *    - Babak 3: Pasukan Cerdas - Sel B & Rudal Antibodi "Y" (Opsonisasi)
 *    - Babak 4: Pasukan Assassin - Sel T Sitotoksik & Apoptosis
 *    - Babak 5: Simulasi Militer - Vaksinasi & Pembentukan Sel Memori
 *    - Babak 6: Edukasi Resep - Bahaya Superbug Kebal Obat & Bakteri Baik Usus
 *    - Babak 7: Tips Hidup Sehat & Komando Tempur Sel Imun
 * 4. Event-Driven Audio Playback (onended + 450ms jeda napas manusia)
 */

import { sound } from '../audio/sound.js';
import { CharacterAvatars2D } from './characterAvatars2D.js';

export class EducationalCinema {
  constructor(canvas, onComplete) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onComplete = onComplete;

    this.totalDuration = 135.0; // Sekitar 2 menit 15 detik penuh ilmu
    this.currentTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.isMuted = false;

    // Cache UI Elements
    this.uiModal = document.getElementById('teaser-modal');
    this.uiSubtitleBox = document.getElementById('edu-subtitle-box');
    this.uiSpeakerAvatar = document.getElementById('edu-speaker-avatar');
    this.uiSpeakerName = document.getElementById('edu-speaker-name');
    this.uiSubtitleText = document.getElementById('edu-subtitle-text');
    this.uiProgressBar = document.getElementById('edu-progress-bar');
    this.uiTimeDisplay = document.getElementById('edu-time-display');
    this.uiChapterTag = document.getElementById('edu-chapter-tag');
    this.uiPlayPauseBtn = document.getElementById('edu-btn-playpause');
    this.uiPlayPauseIcon = document.getElementById('edu-playpause-icon');
    this.uiMuteBtn = document.getElementById('edu-btn-mute');
    this.uiMuteIcon = document.getElementById('edu-mute-icon');
    this.uiHostsStage = document.getElementById('edu-hosts-stage');
    this.uiPlayerControls = document.querySelector('.edu-player-controls');

    // Host Cards UI
    this.cardArya = document.getElementById('card-host-arya');
    this.cardCia = document.getElementById('card-host-cia');

    // Premium Background Image & Camera System
    this.bgImage = new Image();
    this.bgImage.loaded = false;
    this.bgImage.onload = () => { this.bgImage.loaded = true; };
    this.bgImage.src = 'assets/images/bg_bloodstream.jpg';
    
    this.camX = 0;
    this.camY = 0;
    this.camZoom = 1.0;
    this.targetCamX = 0;
    this.targetCamY = 0;
    this.targetCamZoom = 1.0;

    // 2D Character Avatars Rig
    const canvasArya = document.getElementById('canvas-host-arya');
    const canvasCia = document.getElementById('canvas-host-cia');
    this.avatars = new CharacterAvatars2D(canvasArya, canvasCia);

    // Naskah Lengkap 24 Dialog (Line 0 s/d Line 23)
    this.dialogue = [
      // BABAK 1: INVASI KUMAN (BAKTERI VS VIRUS)
      {
        id: 0,
        act: 1,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_0.mp3',
        estDuration: 5.5,
        text: 'Halo dek! Pernah mikir gak sih, pas kamu luka gores atau kena bersin orang di jalan, apa yang sebenernya terjadi di dalem tubuh kita?'
      },
      {
        id: 1,
        act: 1,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_1.mp3',
        estDuration: 4.5,
        text: 'Hah? Emang kuman jahat apa aja yang suka masuk ke tubuh kita, Kak?!'
      },
      {
        id: 2,
        act: 1,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_2.mp3',
        estDuration: 7.5,
        text: 'Nih liat! Ada dua jenis biang kerok: Bakteri sama Virus. Bakteri itu makhluk hidup mandiri yang bisa ngebelah diri sendiri terus nyebar racun. Tapi virus itu parasit licik yang ngebajak sel tubuh kita biar bisa beranak pinak!'
      },

      // BABAK 2: GARDA DEPAN (MAKROFAG & NEUTROFIL)
      {
        id: 3,
        act: 2,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_3.mp3',
        estDuration: 3.5,
        text: 'Waduh gawat banget! Terus tubuh kita kalah dong, Kak?!'
      },
      {
        id: 4,
        act: 2,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_4.mp3',
        estDuration: 6.0,
        text: 'Santai Cia, pasukan imun kita langsung gercep! Liat tuh si Makrofag, sel raksasa yang nelen kuman bulet-bulet kayak Pac-Man lewat proses fagositosis!'
      },
      {
        id: 5,
        act: 2,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_5.mp3',
        estDuration: 4.8,
        text: 'Wiiih mantap banget! Terus sel yang nembak jaring laba-laba bercahaya itu siapa, Kak?'
      },
      {
        id: 6,
        act: 2,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_6.mp3',
        estDuration: 5.0,
        text: 'Itu Neutrofil! Dia nembakin jaring DNA bernama NETosis buat ngejebak gerombolan bakteri biar gak bisa kabur ke mana-mana!'
      },

      // BABAK 3: PASUKAN PINTAR (SEL B & ANTIBODI)
      {
        id: 7,
        act: 3,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_7.mp3',
        estDuration: 3.8,
        text: 'Tapi kalau kumannya makin banyak dan pinter sembunyi gimana, Kak?'
      },
      {
        id: 8,
        act: 3,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_8.mp3',
        estDuration: 6.0,
        text: 'Nah, giliran pasukan cerdas yang turun! Kenalin Sel B, dia pabrik senjata biologis yang bikin jutaan rudal antibodi berbentuk huruf Y buat ngunci target dengan super presisi!'
      },
      {
        id: 9,
        act: 3,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_9.mp3',
        estDuration: 4.2,
        text: 'Keren parah! Kuman yang udah ditempeli antibodi jadi terkunci dan gak berkutik!'
      },

      // BABAK 4: ASSASSIN KHUSUS (SEL T SITOTOKSIK)
      {
        id: 10,
        act: 4,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_10.mp3',
        estDuration: 5.5,
        text: 'Dan yang paling mematikan: Sel T Sitotoksik! Sang agen assassin khusus yang tugasnya membasmi sel tubuh yang terlanjur dibajak virus.'
      },
      {
        id: 11,
        act: 4,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_11.mp3',
        estDuration: 4.8,
        text: 'Ditembak tombak protein perforin sampe meledak secara teratur ya, Kak?!'
      },
      {
        id: 12,
        act: 4,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_12.mp3',
        estDuration: 4.5,
        text: 'Tepat banget! Namanya apoptosis. Kuman musnah, sel bersih, dan tubuh kita sembuh total!'
      },

      // BABAK 5: VAKSINASI & MEMORI IMUN
      {
        id: 13,
        act: 5,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_13.mp3',
        estDuration: 4.5,
        text: 'Wah canggih banget! Terus Kak, kenapa pas kecil kita harus disuntik vaksin?'
      },
      {
        id: 14,
        act: 5,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_14.mp3',
        estDuration: 12.5,
        text: 'Vaksin itu ibarat latihan simulasi militer buat sel imun kita! Vaksin ngasih liat potongan kuman yang udah dilemahkan, jadi Sel B bisa bikin Sel Memori. Nanti pas kuman aslinya beneran masuk, tubuh kita udah hafal dan langsung bantai kumannya sebelum kita sempat jatuh sakit!'
      },
      {
        id: 15,
        act: 5,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_15.mp3',
        estDuration: 4.2,
        text: 'Waaah gokil! Jadi tubuh kita punya catatan memori kayak komputer ya!'
      },

      // BABAK 6: EDUKASI ANTIBIOTIK & BAKTERI BAIK
      {
        id: 16,
        act: 6,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_16.mp3',
        estDuration: 10.0,
        text: 'Satu hal penting lagi dek: Jangan pernah minum antibiotik sembarangan kalau cuma batuk pilek biasa! Karena antibiotik itu cuma mempan buat BAKTERI, bukan VIRUS. Kalau salah pakai, bakterinya malah bisa kebal dan jadi Superbug yang berbahaya!'
      },
      {
        id: 17,
        act: 6,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_17.mp3',
        estDuration: 3.5,
        text: 'Ooh gitu! Terus apa semua bakteri itu jahat, Kak?'
      },
      {
        id: 18,
        act: 6,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_18.mp3',
        estDuration: 6.8,
        text: 'Gak dong! Di usus kita ada triliunan bakteri baik yang justru bantu mencerna makanan dan melindungi tubuh kita dari infeksi kuman jahat!'
      },

      // BABAK 7: TIPS HIDUP SEHAT & CLOSING CALL-TO-ACTION
      {
        id: 19,
        act: 7,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_19.mp3',
        estDuration: 8.5,
        text: 'Paham banget sekarang! Berarti biar pasukan imun kita selalu kuat: harus rajin cuci tangan, makan sayur buah, banyak minum air, dan tidur yang cukup kan Kak?'
      },
      {
        id: 20,
        act: 7,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_20.mp3',
        estDuration: 4.8,
        text: 'Seratus buat Cia! Pas kita tidur nyenyak, sel imun lagi aktif-aktifnya memperbaiki jaringan tubuh kita.'
      },
      {
        id: 21,
        act: 7,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_21.mp3',
        estDuration: 5.5,
        text: 'Siap Kak! Mulai sekarang Cia gak bakal begadang lagi! Terus sekarang kita ngapain nih Kak?'
      },
      {
        id: 22,
        act: 7,
        speaker: 'arya',
        name: 'Kak Arya',
        speakerRole: 'host',
        badgeColor: '#00f2fe',
        audioSrc: 'assets/audio/edu/line_22.mp3',
        estDuration: 5.2,
        text: 'Sekarang giliran kamu yang jadi komandan! Yuk kita terjun langsung pimpin pasukan sel imun di medan tempur Viral Slayer!'
      },
      {
        id: 23,
        act: 7,
        speaker: 'cia',
        name: 'Cia',
        speakerRole: 'guest',
        badgeColor: '#ff66cc',
        audioSrc: 'assets/audio/edu/line_23.mp3',
        estDuration: 3.5,
        text: 'Siap Komandan! Ayo basmi semua patogen jahat! Gasss!'
      }
    ];

    // Preload Audio Files
    this.audioClips = [];
    this.preloadAudio();

    this.currentLineIndex = -1;
    this.currentAudio = null;
    this.nextTimeout = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  preloadAudio() {
    this.audioClips = this.dialogue.map((item) => {
      const a = new Audio(item.audioSrc);
      a.preload = 'auto';
      return a;
    });
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 880;
    this.height = rect.height || 495;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initEntities() {
    this.particles = [];
    for (let i = 0; i < 65; i++) {
      this.particles.push({
        x: Math.random() * (this.width || 880),
        y: Math.random() * (this.height || 495),
        radius: 2 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 0.5) * 22,
        color: Math.random() < 0.75 ? 'rgba(230, 25, 60, 0.4)' : 'rgba(0, 242, 254, 0.35)',
        pulse: Math.random() * Math.PI * 2
      });
    }

    this.bacteriaSwarm = [];
    for (let i = 0; i < 7; i++) {
      this.bacteriaSwarm.push({
        x: 180 + Math.random() * 220,
        y: 160 + Math.random() * 180,
        length: 28,
        width: 12,
        rot: Math.random() * Math.PI * 2,
        divideProgress: 0,
        color: '#00ff88',
        speed: 18 + Math.random() * 15
      });
    }

    this.virusSwarm = [];
    for (let i = 0; i < 9; i++) {
      this.virusSwarm.push({
        x: 520 + Math.random() * 240,
        y: 150 + Math.random() * 190,
        radius: 12,
        rot: 0,
        isOpsonized: false,
        pulse: Math.random() * Math.PI * 2,
        color: '#ff0055'
      });
    }

    this.macrophage = {
      x: 130,
      y: 250,
      radius: 46,
      mouthOpen: 0
    };

    this.neutrophil = {
      x: 710,
      y: 260,
      radius: 34,
      netActive: false,
      netRadius: 0
    };

    this.bCell = {
      x: 220,
      y: 240,
      radius: 38,
      antibodies: []
    };

    this.tCell = {
      x: 280,
      y: 240,
      radius: 36,
      beamActive: false
    };

    this.infectedHostCell = {
      x: 580,
      y: 240,
      radius: 56,
      virusInside: 5,
      apoptosisProgress: 0
    };

    // Entitas Baru Babak 5 & 6 (Vaksin, Sel Memori & Bakteri Baik)
    this.memoryCell = {
      x: 440,
      y: 230,
      radius: 40,
      glow: 0
    };

    this.goodBacteriaSwarm = [];
    for (let i = 0; i < 8; i++) {
      this.goodBacteriaSwarm.push({
        x: 300 + Math.random() * 280,
        y: 160 + Math.random() * 160,
        length: 24,
        width: 10,
        rot: Math.random() * Math.PI * 2,
        color: '#00e5ff'
      });
    }
  }

  // =========================================================================
  // KONTROL UTAMA & PLAYBACK EVENT-DRIVEN
  // =========================================================================

  start() {
    this.isPlaying = true;
    this.isPaused = false;
    this.currentTime = 0;
    this.currentLineIndex = -1;
    
    // Cinematic Timers
    this.introTime = 4.0;
    this.outroTime = 0;

    // Sembunyikan UI selama intro agar lebih imersif
    const uiElements = [this.uiSubtitleBox, this.uiChapterTag, this.uiHostsStage, this.uiPlayerControls];
    uiElements.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transition = 'opacity 1.5s ease-in-out';
        el.style.pointerEvents = 'none';
      }
    });

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.onended = null;
      this.currentAudio = null;
    }
    if (this.nextTimeout) {
      clearTimeout(this.nextTimeout);
      this.nextTimeout = null;
    }

    this.initEntities();
    this.updateControlsUI();
    this.startAudioBGM();

    // Line 0 akan dipanggil setelah introTime habis di update()

    // Animasi Loop 60 FPS
    this.lastTime = performance.now();
    this.animateLoop = (now) => {
      if (!this.isPlaying) return;
      const dt = Math.min(0.08, (now - this.lastTime) / 1000);
      this.lastTime = now;

      if (!this.isPaused) {
        this.update(dt);
      }
      this.render();

      this.animFrameId = requestAnimationFrame(this.animateLoop);
    };

    this.animFrameId = requestAnimationFrame(this.animateLoop);
  }

  playLine(index) {
    if (!this.isPlaying) return;

    if (index >= this.dialogue.length) {
      // Selesai seluruh 24 dialog -> Tampilkan ajakan perang imun
      if (this.uiSubtitleText) {
        this.uiSubtitleText.innerText = 'SIAPKAN PASUKAN! Waktunya terjun langsung ke medan tempur Viral Slayer!';
      }
      this.avatars.setSpeaker('arya', 23, false);
      if (this.cardArya) this.cardArya.classList.remove('active-arya');
      if (this.cardCia) this.cardCia.classList.remove('active-cia');
      
      // Mulai transisi penutup
      this.outroTime = 4.0;
      return;
    }

    this.currentLineIndex = index;
    const line = this.dialogue[index];

    // 1. Update Subtitle UI
    if (this.uiSpeakerAvatar) {
      this.uiSpeakerAvatar.innerHTML = line.speaker === 'cia'
        ? `<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 16l3-3 3 3"/></svg>`
        : `<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    }
    if (this.uiSpeakerName) {
      this.uiSpeakerName.innerText = line.name;
      this.uiSpeakerName.style.color = line.badgeColor;
    }
    if (this.uiSubtitleText) {
      this.uiSubtitleText.innerText = line.text;
    }

    // 2. Update Chapter Tag
    if (this.uiChapterTag) {
      const actTitles = [
        'BABAK 1/7 • INVASI KUMAN: BAKTERI VS VIRUS',
        'BABAK 2/7 • GARDA DEPAN: MAKROFAG & NEUTROFIL',
        'BABAK 3/7 • PASUKAN PINTAR: SEL B & ANTIBODI',
        'BABAK 4/7 • ASSASSIN KHUSUS: SEL T & APOPTOSIS',
        'BABAK 5/7 • LATIHAN MILITER: VAKSIN & SEL MEMORI',
        'BABAK 6/7 • EDUKASI RESEP: SUPERBUG & BAKTERI BAIK',
        'BABAK 7/7 • TIPS SEHAT & KOMANDO PERANG IMUN'
      ];
      this.uiChapterTag.innerText = actTitles[line.act - 1] || actTitles[0];
    }

    // 3. Highlight Card & Aktifkan Lip-Sync Avatar 2D
    if (line.speaker === 'arya') {
      if (this.cardArya) this.cardArya.classList.add('active-arya');
      if (this.cardCia) this.cardCia.classList.remove('active-cia');
      this.avatars.setSpeaker('arya', line.id, true);
    } else {
      if (this.cardCia) this.cardCia.classList.add('active-cia');
      if (this.cardArya) this.cardArya.classList.remove('active-arya');
      this.avatars.setSpeaker('cia', line.id, true);
    }

    // 4. Trigger Foley Sound Effect Tepat Sesuai Aksi Pertempuran
    if (line.id === 4) this.playFoleySFX('swallow'); // Makrofag nelen kuman bulet-bulet
    else if (line.id === 6) this.playFoleySFX('laser'); // Neutrofil nembakin NETosis
    else if (line.id === 8) this.playFoleySFX('laser'); // Sel B bikin rudal antibodi
    else if (line.id === 11) this.playFoleySFX('laser'); // Sel T tombak perforin
    else if (line.id === 14) this.playFoleySFX('chime'); // Vaksinasi & Sel Memori Emas
    else if (line.id === 18) this.playFoleySFX('chime'); // Triliunan Bakteri Baik Usus
    else if (line.id === 20) this.playFoleySFX('chime'); // Tips Sehat Regenerasi

    // 5. Play Audio Asli Studio ElevenLabs
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.onended = null;
    }

    const audio = this.audioClips[index];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = this.isMuted ? 0 : 1.0;
      audio.playbackRate = 1.0; // Suara studio ElevenLabs natural murni

      this.currentAudio = audio;

      const p = audio.play();
      if (p !== undefined) {
        p.catch((err) => console.warn('Audio play notice:', err));
      }

      // Event onended: Menunggu kalimat tuntas sebelum berganti
      audio.onended = () => {
        if (!this.isPlaying || this.isPaused) return;

        this.avatars.setSpeaker(line.speaker, line.id, false); // Berhenti gerak mulut

        // Jeda napas percakapan manusia alami (450ms)
        this.nextTimeout = setTimeout(() => {
          if (this.isPlaying && !this.isPaused) {
            this.playLine(index + 1);
          }
        }, 450);
      };
    } else {
      this.nextTimeout = setTimeout(() => {
        if (this.isPlaying && !this.isPaused) {
          this.playLine(index + 1);
        }
      }, (line.estDuration || 5.0) * 1000);
    }
  }

  togglePlayPause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      if (this.currentAudio) this.currentAudio.pause();
      if (this.nextTimeout) clearTimeout(this.nextTimeout);
      this.avatars.setSpeaker(this.avatars.speaker, this.avatars.dialogueId, false);
    } else {
      if (this.currentAudio && !this.currentAudio.ended) {
        this.currentAudio.play().catch(() => {});
        this.avatars.setSpeaker(this.avatars.speaker, this.avatars.dialogueId, true);
      } else {
        this.playLine(this.currentLineIndex >= 0 ? this.currentLineIndex : 0);
      }
      this.lastTime = performance.now();
    }
    this.updateControlsUI();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.currentAudio) {
      this.currentAudio.volume = this.isMuted ? 0 : 1.0;
    }
    if (this.bgmGain && sound.ctx) {
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.16, sound.ctx.currentTime);
    }
    if (this.uiMuteIcon) {
      this.uiMuteIcon.innerHTML = this.isMuted
        ? `<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
        : `<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    }
  }

  seek(targetSeconds) {
    this.currentTime = Math.max(0, Math.min(this.totalDuration, targetSeconds));
    const fraction = this.currentTime / this.totalDuration;
    const targetIdx = Math.min(this.dialogue.length - 1, Math.floor(fraction * this.dialogue.length));

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.onended = null;
    }
    if (this.nextTimeout) {
      clearTimeout(this.nextTimeout);
    }

    this.playLine(targetIdx);
  }

  updateControlsUI() {
    if (this.uiPlayPauseIcon) {
      this.uiPlayPauseIcon.innerHTML = this.isPaused
        ? `<svg class="inline-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
        : `<svg class="inline-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    }
  }

  startAudioBGM() {
    if (!sound.isInitialized) sound.init();
    sound.resume();

    try {
      const ctx = sound.ctx;
      const t = ctx.currentTime;

      // 1. Warm Acoustic Synth Bass Pad (C major / G foundation)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      this.bgmGain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(130.81, t); // C3 warm baseline
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(196.00, t); // G3 5th harmonic

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, t);

      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, t);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.bgmGain);
      this.bgmGain.connect(sound.masterGain);

      osc1.start(t);
      osc2.start(t);
      this.bgmOscs = [osc1, osc2];

      // 2. Playful Upbeat Educational Marimba Arpeggiator (Cheerful Cartoon Progression)
      const marimbaNotes = [523.25, 659.25, 783.99, 880.00, 1046.50, 783.99, 659.25, 587.33];
      let noteIdx = 0;
      if (this.bgmMarimbaInterval) clearInterval(this.bgmMarimbaInterval);
      this.bgmMarimbaInterval = setInterval(() => {
        if (!this.isPlaying || this.isPaused || this.isMuted || !sound.ctx) return;
        try {
          const now = sound.ctx.currentTime;
          const osc = sound.ctx.createOscillator();
          const g = sound.ctx.createGain();
          const f = sound.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(marimbaNotes[noteIdx % marimbaNotes.length], now);
          noteIdx++;

          f.type = 'bandpass';
          f.frequency.setValueAtTime(1150, now);
          f.Q.setValueAtTime(2.2, now);

          g.gain.setValueAtTime(0.038, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

          osc.connect(f);
          f.connect(g);
          g.connect(sound.masterGain);

          osc.start(now);
          osc.stop(now + 0.28);
        } catch (e) {}
      }, 390); // Arpeggio nada kartun santai setiap 390ms
    } catch (e) {
      console.warn('BGM pad notice:', e);
    }
  }

  playFoleySFX(type) {
    if (this.isMuted || !sound.ctx) return;
    try {
      const now = sound.ctx.currentTime;
      if (type === 'swallow') {
        // Pop / Gulp Lembut saat Makrofag Menelan
        const osc = sound.ctx.createOscillator();
        const g = sound.ctx.createGain();
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
        g.gain.setValueAtTime(0.12, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(g);
        g.connect(sound.masterGain);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'laser') {
        // Laser NETosis / Tombak Perforin
        const osc = sound.ctx.createOscillator();
        const g = sound.ctx.createGain();
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);
        g.gain.setValueAtTime(0.09, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(g);
        g.connect(sound.masterGain);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'chime') {
        // Chime Harpa Emas saat Sel Memori / Tips Sukses
        [659, 880, 1174].forEach((freq, idx) => {
          const osc = sound.ctx.createOscillator();
          const g = sound.ctx.createGain();
          const t = now + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.07, t);
          g.gain.exponentialRampToValueAtTime(0.005, t + 0.35);
          osc.connect(g);
          g.connect(sound.masterGain);
          osc.start(t);
          osc.stop(t + 0.4);
        });
      }
    } catch (e) {}
  }

  // =========================================================================
  // UPDATE LOOP & AKTIVITAS VISUAL
  // =========================================================================

  update(dt) {
    if (this.introTime > 0) {
      this.introTime -= dt;
      if (this.introTime <= 0) {
        // Tampilkan kembali UI setelah intro selesai
        const uiElements = [this.uiSubtitleBox, this.uiChapterTag, this.uiHostsStage, this.uiPlayerControls];
        uiElements.forEach(el => {
          if (el) {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
          }
        });
        
        this.playLine(0); // Mulai dialog pertama
      }
    } else if (this.outroTime > 0) {
      this.outroTime -= dt;
      if (this.outroTime <= 0) {
        this.finish();
      }
    } else {
      this.currentTime = Math.min(this.totalDuration, this.currentTime + dt);
    }

    const t = this.currentTime;

    // 1. Update Timeline Scrubber Bar
    if (this.uiProgressBar) {
      const pct = (t / this.totalDuration) * 100;
      this.uiProgressBar.style.width = `${pct}%`;
    }
    if (this.uiTimeDisplay) {
      const curM = Math.floor(t / 60);
      const curS = Math.floor(t % 60);
      const totM = Math.floor(this.totalDuration / 60);
      const totS = Math.floor(this.totalDuration % 60);
      this.uiTimeDisplay.innerText = `${curM}:${curS < 10 ? '0' : ''}${curS} / ${totM}:${totS < 10 ? '0' : ''}${totS}`;
    }

    // 2. Update Rig Avatar Karakter 2D
    if (this.avatars) {
      this.avatars.update(dt);
    }

    // 3. Partikel Darah Mikroskopis
    for (let p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.pulse += dt * 3;
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      if (p.y > this.height + 20) p.y = -20;
    }

    // 4. Logika Visual & Kamera (Dialogue-Driven)
    const curLine = this.dialogue[Math.max(0, this.currentLineIndex)] || this.dialogue[0];
    const act = curLine.act;

    // Smooth Camera Interpolation (Lerp)
    this.camX += (this.targetCamX - this.camX) * dt * 2.5;
    this.camY += (this.targetCamY - this.camY) * dt * 2.5;
    this.camZoom += (this.targetCamZoom - this.camZoom) * dt * 2.0;

    if (act === 1) {
      this.targetCamX = 0;
      this.targetCamY = 0;
      this.targetCamZoom = 1.0;
      for (let b of this.bacteriaSwarm) {
        b.divideProgress = (Math.sin(t * 2.5 + b.speed) + 1) * 0.5;
        b.rot += dt * 0.8;
      }
      for (let v of this.virusSwarm) {
        v.rot += dt * 2.5;
        v.pulse += dt * 4;
      }
    } else if (act === 2) {
      if (this.currentLineIndex <= 4) {
        // Fokus ke Makrofag (Kiri)
        this.targetCamX = -120;
        this.targetCamY = 50;
        this.targetCamZoom = 1.3;
        
        this.macrophage.x = 130 + Math.sin(t * 1.5) * 120 + (t % 10) * 12;
        this.macrophage.mouthOpen = Math.sin(t * 7) * 0.35 + 0.35;
      } else {
        // Fokus ke Neutrofil (Kanan)
        this.targetCamX = 180;
        this.targetCamY = 50;
        this.targetCamZoom = 1.35;
        
        this.neutrophil.netActive = true;
        this.neutrophil.netRadius = Math.min(240, this.neutrophil.netRadius + dt * 110);
      }
    } else if (act === 3) {
      // Fokus ke Sel B (Tengah Kiri)
      this.targetCamX = -60;
      this.targetCamY = 40;
      this.targetCamZoom = 1.25;
      if (Math.random() < 0.35 && this.bCell.antibodies.length < 24) {
        const targetV = this.virusSwarm[Math.floor(Math.random() * this.virusSwarm.length)];
        this.bCell.antibodies.push({
          x: this.bCell.x,
          y: this.bCell.y,
          tx: targetV.x,
          ty: targetV.y,
          speed: 280,
          latched: false,
          progress: 0
        });
      }
      for (let ab of this.bCell.antibodies) {
        if (!ab.latched) {
          ab.progress += dt * 1.8;
          ab.x = this.bCell.x + (ab.tx - this.bCell.x) * ab.progress;
          ab.y = this.bCell.y + (ab.ty - this.bCell.y) * ab.progress;
          if (ab.progress >= 1) ab.latched = true;
        }
      }
    } else if (act === 4) {
      // Fokus ke Sel T (Tengah)
      this.targetCamX = 40;
      this.targetCamY = 20;
      this.targetCamZoom = 1.3;
      
      if (this.currentLineIndex >= 11) {
        this.tCell.beamActive = true;
        this.infectedHostCell.apoptosisProgress = Math.min(1, this.infectedHostCell.apoptosisProgress + dt * 0.4);
      } else {
        this.tCell.x = 280 + Math.sin(t * 2) * 40;
      }
    } else if (act === 5) {
      // Zoom out perlahan
      this.targetCamX = 0;
      this.targetCamY = 0;
      this.targetCamZoom = 1.0;
      
      // Babak 5: Vaksinasi & Sel Memori
      this.memoryCell.glow = Math.sin(t * 4) * 0.4 + 0.6;
    } else if (act === 6) {
      // Babak 6: Bakteri Baik di Saluran Pencernaan
      for (let gb of this.goodBacteriaSwarm) {
        gb.rot += dt * 1.2;
      }
    }
  }

  // =========================================================================
  // RENDERING CANVAS 60 FPS
  // =========================================================================

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Render Background Premium Image
    if (this.bgImage && this.bgImage.loaded) {
      // Buat efek parallax pelan di background saat intro
      const bgScale = this.introTime > 0 ? 1.0 + (this.introTime * 0.05) : 1.0;
      
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(bgScale, bgScale);
      ctx.drawImage(this.bgImage, -w / 2, -h / 2, w, h);
      ctx.restore();
      
      // Darken overlay agar elemen foreground tetap mencolok
      ctx.fillStyle = 'rgba(10, 0, 15, 0.4)';
      ctx.fillRect(0, 0, w, h);
    } else {
      // Fallback Fluid Background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.75);
      bgGrad.addColorStop(0, '#16020c');
      bgGrad.addColorStop(0.6, '#090105');
      bgGrad.addColorStop(1, '#020002');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // Terapkan Dynamic Camera Transform
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(this.camZoom, this.camZoom);
    ctx.translate(-w / 2 - this.camX, -h / 2 - this.camY);

    // 2. Partikel Darah
    for (let p of this.particles) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, Math.max(1, p.radius + Math.sin(p.pulse) * 1.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Render Babak Cerita Aktif (Dengan Transform Kamera)
    const curLine = this.dialogue[Math.max(0, this.currentLineIndex)] || this.dialogue[0];
    const act = curLine.act;

    if (act === 1) {
      this.renderAct1(ctx);
    } else if (act === 2) {
      this.renderAct2(ctx);
    } else if (act === 3) {
      this.renderAct3(ctx);
    } else if (act === 4) {
      this.renderAct4(ctx);
    } else if (act === 5) {
      this.renderAct5(ctx);
    } else if (act === 6) {
      this.renderAct6(ctx);
    } else if (act === 7) {
      this.renderAct7(ctx);
    }

    // Kembalikan konteks kamera ke normal (UI & Avatar tidak terpengaruh zoom)
    ctx.restore();

    // 4. Render Karakter Avatar 2D (Overlay di atas kamera)
    if (this.avatars) {
      this.avatars.render();
    }

    // 5. Cinematic Transitions (Intro / Outro Overlay)
    if (this.introTime > 0) {
      // Fade out layar hitam di 1.5 detik terakhir
      const alpha = Math.min(1, this.introTime / 1.5);
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      const scale = 1 + (4.0 - this.introTime) * 0.1;
      ctx.scale(scale, scale);

      ctx.fillStyle = `rgba(0, 242, 254, ${Math.min(1, this.introTime)})`;
      ctx.font = '900 28px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 20;
      ctx.fillText('MEMASUKI ZONA INFEKSI...', 0, -10);

      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, this.introTime)})`;
      ctx.font = '700 16px Rajdhani, sans-serif';
      ctx.fillText('MENYIAPKAN PASUKAN IMUN...', 0, 20);
      ctx.restore();
    } else if (this.outroTime > 0) {
      // Fade to black di 2 detik terakhir
      let alpha = 0;
      if (this.outroTime < 2.0) {
        alpha = 1 - (this.outroTime / 2.0);
      }
      if (alpha > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, w, h);
      }
    }

    // 6. Scanlines Overlay
    this.renderScanlines(ctx, w, h);
  }

  // --- ACT 1: BAKTERI VS VIRUS ---
  renderAct1(ctx) {
    ctx.save();
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('// BAKTERI: SEL MANDIRI MEMBELAH DIRI   vs   VIRUS: PARASIT PEMBAJAK', 45, 45);
    ctx.restore();

    for (let b of this.bacteriaSwarm) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 14;

      // Glow & Pulsating Core Bacteria
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(-b.length / 2, -b.width / 2, b.length, b.width, 8);
      ctx.fill();

      if (b.divideProgress > 0.1) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -b.width / 2 - 2);
        ctx.lineTo(0, b.width / 2 + 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 10px Rajdhani, sans-serif';
      ctx.fillText('BAKTERI', -20, -14);
      ctx.restore();
    }

    for (let v of this.virusSwarm) {
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.rotate(v.rot);
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 16;

      // Spiky Virus with Core
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.arc(0, 0, v.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Virus DNA Core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, v.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ff3377';
      ctx.lineWidth = 2.5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const sx = Math.cos(a) * (v.radius + 8);
        const sy = Math.sin(a) * (v.radius + 8);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * v.radius, Math.sin(a) * v.radius);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 10px Rajdhani, sans-serif';
      ctx.fillText('VIRUS', -14, -20);
      ctx.restore();
    }
  }

  // --- ACT 2: MAKROFAG & NEUTROFIL ---
  renderAct2(ctx) {
    ctx.save();
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillStyle = '#ff9100';
    ctx.fillText('// MAKROFAG: FAGOSITOSIS (MENELAN KUMAN)   &   NEUTROFIL: JALA DNA NETOSIS', 45, 45);
    ctx.restore();

    const m = this.macrophage;
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.shadowColor = '#ff9100';
    ctx.shadowBlur = 22;

    ctx.fillStyle = '#ff6d00';
    ctx.beginPath();
    const mouth = m.mouthOpen || 0.2;
    ctx.arc(0, 0, m.radius, mouth, Math.PI * 2 - mouth);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    
    // Amoeba Tentacles / Pseudopodia effect
    ctx.strokeStyle = '#ff9100';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, m.radius + 6, mouth + 0.2, Math.PI * 2 - mouth - 0.2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.fillText('MAKROFAG', -40, -8);

    // Floating Informative Text
    if (this.currentLineIndex === 4) {
      ctx.fillStyle = '#ffcc00';
      ctx.font = '800 16px Outfit, sans-serif';
      ctx.fillText('FAGOSITOSIS AKTIF', -60, -65);
    }

    ctx.fillStyle = '#7a3800';
    ctx.beginPath();
    ctx.ellipse(-16, -4, 16, 12, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const n = this.neutrophil;
    ctx.save();
    ctx.translate(n.x, n.y);
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(0, 0, n.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#006064';
    ctx.beginPath();
    ctx.arc(-8, -4, 10, 0, Math.PI * 2);
    ctx.arc(8, -6, 9, 0, Math.PI * 2);
    ctx.arc(2, 10, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText('NEUTROFIL', -30, 26);

    // Floating Informative Text
    if (this.currentLineIndex === 6) {
      ctx.fillStyle = '#00f2fe';
      ctx.font = '800 16px Outfit, sans-serif';
      ctx.fillText('JARING NETosis', -65, -55);
    }

    if (n.netActive) {
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 25;

      for (let r = 20; r < n.netRadius; r += 28) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * n.netRadius, Math.sin(a) * n.netRadius);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // --- ACT 3: SEL B & ANTIBODI ---
  renderAct3(ctx) {
    ctx.save();
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('// LIMFOSIT B: MEMPRODUKSI JUTAAN RUDAL ANTIBODI "Y" (OPSONISASI)', 45, 45);
    ctx.restore();

    const b = this.bCell;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 30;
    
    // B-Cell Core Glow
    const bgGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, b.radius);
    bgGrad.addColorStop(0, '#e0f7fa');
    bgGrad.addColorStop(0.5, '#00b0ff');
    bgGrad.addColorStop(1, '#0091ea');
    ctx.fillStyle = bgGrad;
    
    ctx.beginPath();
    ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.fillText('SEL B', -18, 5);

    // Floating Informative Text
    if (this.currentLineIndex === 8) {
      ctx.fillStyle = '#ffd700';
      ctx.font = '800 16px Outfit, sans-serif';
      ctx.fillText('PABRIK ANTIBODI', -75, -55);
    }
    ctx.restore();

    for (let ab of b.antibodies) {
      ctx.save();
      ctx.translate(ab.x, ab.y);
      
      // Antibody Trail Effect
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 4, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffee58';
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, 0);
      ctx.lineTo(-7, -9);
      ctx.moveTo(0, 0);
      ctx.lineTo(7, -9);
      ctx.stroke();
      ctx.restore();
    }

    for (let v of this.virusSwarm) {
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 12;

      ctx.fillStyle = '#d50000';
      ctx.beginPath();
      ctx.arc(0, 0, v.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffd700';
      ctx.font = '700 9px monospace';
      ctx.fillText('TERIKAT ANTIBODI', -22, -18);
      ctx.restore();
    }
  }

  // --- ACT 4: SEL T & APOPTOSIS ---
  renderAct4(ctx) {
    ctx.save();
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillStyle = '#ff0055';
    ctx.fillText('// LIMFOSIT T SITOTOKSIK: TOMBAK PERFORIN & APOPTOSIS TERATUR', 45, 45);
    ctx.restore();

    const tc = this.tCell;
    ctx.save();
    ctx.translate(tc.x, tc.y);
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 30;

    const tcGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, tc.radius);
    tcGrad.addColorStop(0, '#ff8a80');
    tcGrad.addColorStop(0.5, '#ff1744');
    tcGrad.addColorStop(1, '#d50000');
    ctx.fillStyle = tcGrad;

    ctx.beginPath();
    ctx.arc(0, 0, tc.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.fillText('SEL T CD8+', -34, 5);

    // Floating Informative Text
    if (this.currentLineIndex === 10) {
      ctx.fillStyle = '#ff1744';
      ctx.font = '800 16px Outfit, sans-serif';
      ctx.fillText('ASSASSIN SITOTOKSIK', -85, -55);
    }
    ctx.restore();

    const host = this.infectedHostCell;
    if (tc.beamActive) {
      ctx.save();
      // Laser Perforin (Distorsi energi berlapis)
      ctx.shadowBlur = 35;
      
      // Core laser
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.moveTo(tc.x + tc.radius, tc.y);
      ctx.lineTo(host.x - host.radius, host.y);
      ctx.stroke();

      // Outer laser glow
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(tc.x + tc.radius, tc.y);
      ctx.lineTo(host.x - host.radius, host.y);
      ctx.stroke();
      
      // Energi gelombang
      ctx.strokeStyle = 'rgba(255, 102, 204, 0.5)';
      ctx.lineWidth = 12;
      ctx.setLineDash([15, 10]);
      ctx.lineDashOffset = -this.currentTime * 200;
      ctx.beginPath();
      ctx.moveTo(tc.x + tc.radius, tc.y);
      ctx.lineTo(host.x - host.radius, host.y);
      ctx.stroke();

      ctx.restore();
    }

    ctx.save();
    ctx.translate(host.x, host.y);
    const scale = Math.max(0.2, 1 - host.apoptosisProgress * 0.75);
    ctx.scale(scale, scale);

    ctx.fillStyle = host.apoptosisProgress > 0.5 ? '#1a2327' : '#78909c';
    ctx.shadowColor = host.apoptosisProgress > 0.5 ? '#ff0055' : '#00e5ff';
    ctx.shadowBlur = 25;
    
    // Efek retakan apoptosis
    ctx.beginPath();
    ctx.arc(0, 0, host.radius, 0, Math.PI * 2);
    ctx.fill();

    if (host.apoptosisProgress > 0.1) {
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, -20);
      ctx.lineTo(20, 20);
      ctx.moveTo(20, -20);
      ctx.lineTo(-20, 20);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px Rajdhani, sans-serif';
    ctx.fillText(host.apoptosisProgress > 0.5 ? 'APOPTOSIS TERPROGRAM' : 'SEL INANG TERINFEKSI', -58, 4);
    
    if (this.currentLineIndex >= 12 && host.apoptosisProgress > 0.5) {
      ctx.fillStyle = '#ff1744';
      ctx.font = '900 18px Outfit, sans-serif';
      ctx.fillText('LISIS PARSIAL HANCUR!', -80, -70);
    }
    ctx.restore();
  }

  // --- ACT 5: VAKSINASI & MEMORI IMUN ---
  renderAct5(ctx) {
    ctx.save();
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('// VAKSINASI: SIMULASI MILITER & PEMBENTUKAN SEL MEMORI EMAS', 45, 45);
    ctx.restore();

    const mc = this.memoryCell;
    ctx.save();
    ctx.translate(mc.x, mc.y);
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 24 * mc.glow;

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(0, 0, mc.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 13px Outfit, sans-serif';
    ctx.fillText('SEL MEMORI', -36, 5);

    // Ikon Kunci Memori DNA Emas
    ctx.fillStyle = '#fef08a';
    ctx.font = '700 10px monospace';
    ctx.fillText('DATA ANTIGEN TERSIMPAN', -70, 32);
    ctx.restore();
  }

  // --- ACT 6: EDUKASI ANTIBIOTIK & BAKTERI BAIK USUS ---
  renderAct6(ctx) {
    ctx.save();
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('// SALURAN CERNA: TRILIUNAN BAKTERI BAIK (MIKROBIOTA) PENJAGA TUBUH', 45, 45);
    ctx.restore();

    for (let gb of this.goodBacteriaSwarm) {
      ctx.save();
      ctx.translate(gb.x, gb.y);
      ctx.rotate(gb.rot);
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 12;

      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.roundRect(-gb.length / 2, -gb.width / 2, gb.length, gb.width, 5);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 8px monospace';
      ctx.fillText('PROBIOTIK', -20, -10);
      ctx.restore();
    }
  }

  // --- ACT 7: TIPS HIDUP SEHAT & CLOSING CALL-TO-ACTION ---
  renderAct7(ctx) {
    ctx.save();
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 20;
    ctx.fillText('RAWAT SISTEM IMUN: CUCI TANGAN, NUTRISI & TIDUR CUKUP!', this.width / 2, this.height / 2 - 20);

    ctx.font = '700 16px Rajdhani, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 15;
    ctx.fillText('KLIK TOMBOL DI BAWAH UNTUK MEMIMPIN PASUKAN IMUN DI VIRAL SLAYER!', this.width / 2, this.height / 2 + 25);
    ctx.restore();
  }

  renderScanlines(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1.5);
    }
    ctx.restore();
  }

  finish() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.bgmMarimbaInterval) {
      clearInterval(this.bgmMarimbaInterval);
      this.bgmMarimbaInterval = null;
    }
    if (this.bgmOscs) {
      this.bgmOscs.forEach((o) => {
        try { o.stop(); o.disconnect(); } catch (e) {}
      });
      this.bgmOscs = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.onended = null;
      this.currentAudio = null;
    }
    if (this.nextTimeout) {
      clearTimeout(this.nextTimeout);
      this.nextTimeout = null;
    }
    if (this.bgmGain && sound.ctx) {
      this.bgmGain.gain.setValueAtTime(0, sound.ctx.currentTime);
    }

    if (this.onComplete) {
      this.onComplete();
    }
  }

  stop() {
    this.finish();
  }
}
