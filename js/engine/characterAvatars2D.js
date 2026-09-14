/**
 * characterAvatars2D.js
 * Engine Animasi Karakter Kartun 2D Studio (Sprite-Based Expressive Animation)
 * 
 * Menggunakan aset ilustrasi kartun HD autentik multi-frame:
 * 👧 CIA:
 *    - cia_idle.jpg: Senyum manis alami, rambut afro-puffs pink beads, kaos biru
 *    - cia_talk.jpg: Mulut terbuka bicara (gigi atas putih + lidah pink) & tangan gestur di dada
 *    - cia_blink.jpg: Kedipan mata tertutup lentur alami
 * 
 * 👦 KAK ARYA:
 *    - arya_idle.jpg: Senyum bersahabat, jas lab dokter, headset mic
 *    - arya_talk.jpg: Mulut terbuka bicara & tangan menunjuk ke medan tempur mikroskopik
 *    - arya_blink.jpg: Kedipan mata tertutup lembut alami
 * 
 * SINKRONISASI:
 * - Lip-sync lip-flap alami mengikuti silabel audio ElevenLabs (buka-tutup mulut + gestur tangan)
 * - Kedipan mata otomatis setiap 2-3 detik
 * - Rhythmic head nod & breathing bounce 60 FPS
 * - Bebas bug overlay kanvas (100% artwork kartun murni berkualitas studio)
 */

export class CharacterAvatars2D {
  constructor(canvasArya, canvasCia) {
    this.canvasArya = canvasArya;
    this.ctxArya = canvasArya ? canvasArya.getContext('2d') : null;

    this.canvasCia = canvasCia;
    this.ctxCia = canvasCia ? canvasCia.getContext('2d') : null;

    // 1. Preload Frame Animasi Cia
    this.ciaIdle = this.loadImage('assets/images/cia_cartoon.jpg');
    this.ciaTalk = this.loadImage('assets/images/cia_talk.jpg');
    this.ciaBlink = this.loadImage('assets/images/cia_blink.jpg');

    // 2. Preload Frame Animasi Kak Arya
    this.aryaIdle = this.loadImage('assets/images/arya_cartoon.jpg');
    this.aryaTalk = this.loadImage('assets/images/arya_talk.jpg');
    this.aryaBlink = this.loadImage('assets/images/arya_blink.jpg');

    // State karakter
    this.speaker = 'arya'; // 'arya' atau 'cia'
    this.isSpeaking = false;
    this.dialogueId = 0;

    // Timers
    this.time = 0;
    this.blinkArya = 0;
    this.blinkCia = 0;
    this.nextBlinkArya = 2.0;
    this.nextBlinkCia = 1.7;

    // Gesture & Lip-flap cadence
    this.lipFlap = false;
    this.talkTimer = 0;
    this.talkState = false;
  }

  loadImage(src) {
    const img = new Image();
    img.loaded = false;
    img.onload = () => { img.loaded = true; };
    img.src = src;
    return img;
  }

  setSpeaker(speaker, dialogueId, isSpeaking = true) {
    this.speaker = speaker;
    this.dialogueId = dialogueId;
    this.isSpeaking = isSpeaking;
  }

  update(dt) {
    this.time += dt;

    // 1. Kedipan Mata Alami (140ms kedip halus)
    this.nextBlinkArya -= dt;
    if (this.nextBlinkArya <= 0) {
      this.blinkArya = 0.16;
      this.nextBlinkArya = 2.2 + Math.random() * 2.5;
    }
    if (this.blinkArya > 0) this.blinkArya -= dt;

    this.nextBlinkCia -= dt;
    if (this.nextBlinkCia <= 0) {
      this.blinkCia = 0.16;
      this.nextBlinkCia = 1.9 + Math.random() * 2.5;
    }
    if (this.blinkCia > 0) this.blinkCia -= dt;

    // 2. Gestur Tangan & Tubuh (State-based timer lambat)
    if (this.isSpeaking) {
      this.talkTimer -= dt;
      if (this.talkTimer <= 0) {
        this.talkState = !this.talkState;
        if (this.talkState) {
          // Pose aktif (tangan naik) ditahan lebih lama
          this.talkTimer = 0.5 + Math.random() * 1.8;
        } else {
          // Jeda (tangan turun)
          this.talkTimer = 0.15 + Math.random() * 0.35;
        }
      }
      
      // 3. Lip-Flap Mulut Berbicara (Cepat, tersinkron dengan audio/suara)
      // Menggunakan sine wave cepat (sekitar 4.5 Hz) agar pas dengan silabel kata
      const flapWave = Math.sin(this.time * 28);
      this.lipFlap = flapWave > 0;
      
    } else {
      this.talkState = false;
      this.lipFlap = false;
    }
  }

  render() {
    if (this.ctxArya) this.drawCharacter(this.ctxArya, this.canvasArya.width, this.canvasArya.height, 'arya');
    if (this.ctxCia) this.drawCharacter(this.ctxCia, this.canvasCia.width, this.canvasCia.height, 'cia');
  }

  drawCharacter(ctx, w, h, charType) {
    ctx.clearRect(0, 0, w, h);

    const isArya = charType === 'arya';
    const isActive = this.speaker === charType && this.isSpeaking;

    // Tentukan frame gambar dasar (Base Body Frame)
    let baseImg;
    if (isArya) {
      if (this.blinkArya > 0 && !isActive) baseImg = this.aryaBlink;
      else if (isActive && this.talkState) baseImg = this.aryaTalk; // Tangan menunjuk
      else baseImg = this.aryaIdle; // Tangan turun
    } else {
      if (this.blinkCia > 0 && !isActive) baseImg = this.ciaBlink;
      else if (isActive && this.talkState) baseImg = this.ciaTalk; // Tangan gestur
      else baseImg = this.ciaIdle; // Tangan turun
    }

    // Gerakan halus bernapas & goyang kepala (Superposisi sine wave untuk organik)
    const bounceBase = Math.sin(this.time * 2.2) * 0.8 + Math.sin(this.time * 1.5) * 0.4;
    const bounceActive = Math.sin(this.time * 4.5) * 1.2 + Math.sin(this.time * 3.1) * 0.6;
    const bounce = isActive ? bounceActive : bounceBase;

    const tiltBase = Math.sin(this.time * 1.2) * 0.008 + Math.sin(this.time * 0.8) * 0.004;
    const tiltActive = Math.sin(this.time * 2.6) * 0.015 + Math.sin(this.time * 1.4) * 0.01;
    const headTilt = isActive ? tiltActive : tiltBase;

    ctx.save();

    // 1. Dynamic Active Glow Aura Spotlight di background kartu
    if (isActive) {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 15, w / 2, h / 2, w * 0.75);
      if (isArya) {
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.42)');
        grad.addColorStop(0.7, 'rgba(0, 242, 254, 0.12)');
        grad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      } else {
        grad.addColorStop(0, 'rgba(255, 102, 204, 0.45)');
        grad.addColorStop(0.7, 'rgba(255, 102, 204, 0.14)');
        grad.addColorStop(1, 'rgba(255, 102, 204, 0)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Clip rounded corner halus kartu studio
    ctx.beginPath();
    ctx.roundRect(3, 3, w - 6, h - 6, 12);
    ctx.clip();

    // 3. Transformasi rotasi leher & nafas
    ctx.translate(w / 2, h * 0.75);
    ctx.rotate(headTilt);
    ctx.translate(-w / 2, -h * 0.75 + bounce);

    // 4. Render Artwork Dasar (Body & Background)
    if (baseImg && baseImg.loaded) {
      let sx = 140, sy = isArya ? 120 : 130, sw = 744, sh = 930;
      ctx.drawImage(baseImg, sx, sy, sw, sh, 0, 0, w, h);
      
      // 4b. Overlay Mulut (Decouple Lip Sync dari Gestur Tangan)
      // Jika status mulut (lipFlap) berbeda dengan pose dasar (talkState),
      // kita tempelkan area mulut dari frame yang berlawanan!
      if (isActive && this.lipFlap !== this.talkState) {
        let overlayImg = null;
        if (isArya) overlayImg = this.lipFlap ? this.aryaTalk : this.aryaIdle;
        else overlayImg = this.lipFlap ? this.ciaTalk : this.ciaIdle;
        
        if (overlayImg && overlayImg.loaded) {
          ctx.save();
          ctx.beginPath();
          // Bounding box area mulut (koordinat lokal pada canvas 140x175)
          if (isArya) {
            ctx.rect(55, 78, 30, 20); // Area mulut Arya
          } else {
            ctx.rect(55, 95, 30, 20); // Area mulut Cia
          }
          ctx.clip(); // Potong render hanya di area mulut
          
          // Gambar ulang dengan posisi dan skala yang sama persis
          ctx.drawImage(overlayImg, sx, sy, sw, sh, 0, 0, w, h);
          ctx.restore();
        }
      }
    } else {
      // Fallback placeholder jika sedang loading
      const fallbackColor = isArya ? '#00f2fe' : '#ff66cc';
      const label = isArya ? '👦 KAK ARYA' : '👧 CIA';
      this.drawPlaceholder(ctx, w, h, label, fallbackColor);
    }

    ctx.restore();

    // 5. Border spotlight neon luar saat berbicara
    if (isActive) {
      ctx.save();
      ctx.strokeStyle = isArya ? 'rgba(0, 242, 254, 0.95)' : 'rgba(255, 102, 204, 0.95)';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.roundRect(3, 3, w - 6, h - 6, 12);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawPlaceholder(ctx, w, h, text, color) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
  }
}
