/**
 * sound.js
 * Synthesizer Audio Mikroskopik Berbasis Web Audio API murni
 * Menghasilkan sound effects sci-fi & bio-acoustics tanpa memerlukan file audio eksternal.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.musicGain = null;
    this.isInitialized = false;
    this.isMenuMusicPlaying = false;
    this.droneNodes = null;
    this.musicInterval = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume || 0.85, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  setVolume(vol) {
    this.currentVolume = vol;
    if (this.masterGain && this.ctx && !this.isMuted) {
      // Small ramp to avoid clicking sounds when volume changes abruptly
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  // --- AUDIO SYNTHESIS SFX ---

  playShoot(type = 'normal') {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'antibody') {
      // Soft high chirp for antibody
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.12);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    } else if (type === 'lance') {
      // Perforin beam laser
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.15);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    } else {
      // Granule rapid fire
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  playPhagocytosis() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.25);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  playNETosis() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    // Low whoosh with white noise simulation
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.35);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  playLysis() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    // Microscopic explosion/squish
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.23);
  }

  playHit() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  playPickup(type = 'atp') {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    let freq1 = 523.25; // C5
    let freq2 = 659.25; // E5

    if (type === 'buff') {
      freq1 = 659.25;
      freq2 = 880.00; // A5
    } else if (type === 'heal') {
      freq1 = 440.0;
      freq2 = 587.33; // D5
    }

    osc.frequency.setValueAtTime(freq1, t);
    osc.frequency.setValueAtTime(freq2, t + 0.08);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.21);
  }

  playLevelUp() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A Major arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.26);
    });
  }

  playAlarm() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(660, t + 0.12);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.24);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  playCinematicBassDrop() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;

    // 1. Deep Sub-Bass Plummet (Braam / Heavy cinematic bass drop from 115Hz to 32Hz)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(115, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 1.6);

    subGain.gain.setValueAtTime(0.55, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t);
    subOsc.stop(t + 2.3);

    // 2. Gritty Low-Pass Filtered Body
    const midOsc = this.ctx.createOscillator();
    const midFilter = this.ctx.createBiquadFilter();
    const midGain = this.ctx.createGain();

    midOsc.type = 'sawtooth';
    midOsc.frequency.setValueAtTime(65, t);
    midOsc.frequency.exponentialRampToValueAtTime(28, t + 1.2);

    midFilter.type = 'lowpass';
    midFilter.frequency.setValueAtTime(450, t);
    midFilter.frequency.exponentialRampToValueAtTime(80, t + 1.2);

    midGain.gain.setValueAtTime(0.35, t);
    midGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

    midOsc.connect(midFilter);
    midFilter.connect(midGain);
    midGain.connect(this.masterGain);
    midOsc.start(t);
    midOsc.stop(t + 1.9);

    // 3. Impact Thump Click
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'triangle';
    thump.frequency.setValueAtTime(160, t);
    thump.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    thumpGain.gain.setValueAtTime(0.4, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
    thump.connect(thumpGain);
    thumpGain.connect(this.masterGain);
    thump.start(t);
    thump.stop(t + 0.2);
  }

  playHover() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.035);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playClick() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.06);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  playPageTurn() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    try {
      const t = this.ctx.currentTime;
      const dur = 0.24;
      const bufSize = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.45));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.frequency.exponentialRampToValueAtTime(800, t + dur);
      filter.Q.setValueAtTime(1.8, t);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(t);
    } catch (e) {
      console.warn('Page turn audio fallback:', e);
    }
  }

  playHeartbeat() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.18);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.19);
  }

  // Tanda mau menang: High-tech sonar ping / telemetry alert
  playProximityAlert() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.exponentialRampToValueAtTime(1760, t + 0.12);
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.36);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, t + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(2640, t + 0.22);
    gain2.gain.setValueAtTime(0.15, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.42);
  }

  // Sound Menang: Triumphant Sci-Fi Major Brass & Shimmering Glockenspiel Fanfare
  playVictoryFanfare() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;

    // 1. Ascending Triumphant Horn Arpeggio: C4, G4, C5, E5, G5, C6
    const arpeggioNotes = [
      { freq: 261.63, delay: 0.0,  dur: 0.22 }, // C4
      { freq: 392.00, delay: 0.14, dur: 0.22 }, // G4
      { freq: 523.25, delay: 0.28, dur: 0.28 }, // C5
      { freq: 659.25, delay: 0.44, dur: 0.28 }, // E5
      { freq: 783.99, delay: 0.60, dur: 0.38 }, // G5
      { freq: 1046.50, delay: 0.85, dur: 1.8 }  // C6 (Triumphant climax)
    ];

    arpeggioNotes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.freq, t + n.delay);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, t + n.delay);
      filter.frequency.exponentialRampToValueAtTime(800, t + n.delay + n.dur);

      gain.gain.setValueAtTime(0.18, t + n.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.delay + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + n.delay);
      osc.stop(t + n.delay + n.dur + 0.05);
    });

    // 2. Harmonic Major Chords Sustain Bed (C - E - G - B)
    const chordFreqs = [523.25, 659.25, 783.99, 1046.5];
    chordFreqs.forEach((freq) => {
      const chordOsc = this.ctx.createOscillator();
      const chordGain = this.ctx.createGain();
      chordOsc.type = 'triangle';
      chordOsc.frequency.setValueAtTime(freq, t + 0.85);

      chordGain.gain.setValueAtTime(0.12, t + 0.85);
      chordGain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);

      chordOsc.connect(chordGain);
      chordGain.connect(this.masterGain);

      chordOsc.start(t + 0.85);
      chordOsc.stop(t + 2.9);
    });

    // 3. Sparkling Crystal / Cytokine Glockenspiel Chimes at climax
    const sparkleTimes = [0.95, 1.1, 1.25, 1.4, 1.55, 1.7, 1.9];
    const chimeFreqs = [1318.5, 1567.98, 2093.0, 1760.0, 2637.0, 3135.96, 4186.0];

    sparkleTimes.forEach((delay, idx) => {
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(chimeFreqs[idx % chimeFreqs.length], t + delay);

      chimeGain.gain.setValueAtTime(0.14, t + delay);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.45);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      chimeOsc.start(t + delay);
      chimeOsc.stop(t + delay + 0.5);
    });
  }

  // Reward Claim chime
  playRewardClaim() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880, 1174.66]; // D Major bright chime
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.16, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.42);
    });
  }

  // =========================================================================
  // PROLOGUE "MERINDING & SAVAGE" INTRO AUDIO ENGINE
  // =========================================================================

  // --- VISCERAL SUBMERGED BLOODSTREAM & MUFFLED ICU MONITOR SOUND ENGINE ---

  // 1. Continuous Subterranean / Underwater Visceral Blood Flow Rush (Desiran Aliran Darah)
  startBloodstreamFlow(duration = 9.0) {
    if (!this.isInitialized || this.isMuted) return null;
    this.resume();
    const t = this.ctx.currentTime;

    // Pink/Brown noise generator through lowpass resonant filter
    const bufferSize = this.ctx.sampleRate * Math.min(10, duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Submerged biological fluid resonant filter (180Hz - 420Hz swirl)
    const fluidFilter = this.ctx.createBiquadFilter();
    fluidFilter.type = 'lowpass';
    fluidFilter.frequency.setValueAtTime(140, t);
    fluidFilter.frequency.exponentialRampToValueAtTime(360, t + 3.0);
    fluidFilter.frequency.exponentialRampToValueAtTime(180, t + duration);
    fluidFilter.Q.value = 3.2;

    // Swirling fluid LFO modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.45; // Gentle fluid whoosh cycle
    lfoGain.gain.value = 90;
    lfo.connect(fluidFilter.frequency);
    lfo.start(t);
    lfo.stop(t + duration);

    const flowGain = this.ctx.createGain();
    flowGain.gain.setValueAtTime(0.001, t);
    flowGain.gain.linearRampToValueAtTime(0.38, t + 1.2);
    flowGain.gain.setValueAtTime(0.38, t + duration - 1.5);
    flowGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noiseSource.connect(fluidFilter);
    fluidFilter.connect(flowGain);
    flowGain.connect(this.masterGain);

    noiseSource.start(t);
    noiseSource.stop(t + duration);

    return { noiseSource, flowGain };
  }

  // 2. Submerged / Muffled ICU Heart Monitor Beep (Suara "Tit... Tit..." Ruang ICU Tenggelam)
  playSubmergedICUBeep(timeOffset = 0, isCritical = false) {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime + timeOffset;

    // Primary pure sine pulse (clinical tone)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    const freq = isCritical ? 880 : (Math.random() < 0.2 ? 698.46 : 659.25); // E5/F5 hospital monitor tone
    osc.frequency.setValueAtTime(freq, t);

    // Muffled acoustic filter (simulating listening from inside dense body fluid/blood vessel)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isCritical ? 1100 : 750, t); // Cuts sharp high frequencies
    filter.Q.value = 1.4;

    // Soft clinical envelope with gentle attack & subtle aquatic echo tail
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(isCritical ? 0.22 : 0.15, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

    // Secondary sub-harmonic reverberation (suara berdengung di dalam cairan tubuh)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, t); // 1 octave below
    subGain.gain.setValueAtTime(0.0001, t);
    subGain.gain.linearRampToValueAtTime(0.08, t + 0.03);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.4);
    subOsc.start(t);
    subOsc.stop(t + 0.45);
  }

  // 3. Deep In-Vivo Cardiac Systolic Thump (Detak Jantung Organik Dalam Tubuh: Lub-Dub)
  playDeepOrganicHeartbeat(timeOffset = 0, intensity = 1.0) {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime + timeOffset;

    // "LUB" (first lower valve closure)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(75, t);
    osc1.frequency.exponentialRampToValueAtTime(26, t + 0.16);

    gain1.gain.setValueAtTime(0.42 * intensity, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.2);

    // "DUB" (secondary aortic valve closure, slightly higher & tighter)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(95, t + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(32, t + 0.29);

    gain2.gain.setValueAtTime(0.35 * intensity, t + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.14);
    osc2.stop(t + 0.35);
  }

  // 4. Submerged Ambient Drone for Cinematic Apex (Tenggelam dan Menggetarkan Ruang)
  playSubmergedClimaxDrone() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;

    // Deep warm visceral sub-bass pulse (48Hz down to 30Hz)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(54, t);
    subOsc.frequency.exponentialRampToValueAtTime(34, t + 2.8);

    subGain.gain.setValueAtTime(0.001, t);
    subGain.gain.linearRampToValueAtTime(0.45, t + 0.4);
    subGain.gain.setValueAtTime(0.45, t + 2.0);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 3.2);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t);
    subOsc.stop(t + 3.3);

    // Warm resonant body texture (no abrasive 2D noise)
    const droneOsc = this.ctx.createOscillator();
    const droneFilter = this.ctx.createBiquadFilter();
    const droneGain = this.ctx.createGain();

    droneOsc.type = 'triangle';
    droneOsc.frequency.setValueAtTime(108, t);
    droneOsc.frequency.exponentialRampToValueAtTime(68, t + 2.8);

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(180, t);
    droneFilter.Q.value = 1.8;

    droneGain.gain.setValueAtTime(0.001, t);
    droneGain.gain.linearRampToValueAtTime(0.22, t + 0.5);
    droneGain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start(t);
    droneOsc.stop(t + 3.1);
  }

  // Orchestrated Submerged Atmospheric Sequence (Tanpa Bunyi Game 2D)
  playSubmergedIntroAtmosphere() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();

    this.stopSubmergedIntroAtmosphere();
    this.introTimers = [];

    // 1. Continuous viscous blood flow rush from 0s to 9s
    this.startBloodstreamFlow(9.2);

    // 2. Realistic Submerged ICU Heart Monitor ("Tit... Tit...")
    // Timing beats pacing patient's failing vitals echoing from outside the body
    const icuBeepTimings = [
      { delay: 0.4, critical: false },
      { delay: 1.5, critical: false },
      { delay: 2.6, critical: false },
      { delay: 3.6, critical: false },
      { delay: 4.5, critical: true },
      { delay: 5.3, critical: true },
      { delay: 6.0, critical: true },
      { delay: 6.6, critical: true }
    ];

    icuBeepTimings.forEach((b) => {
      this.introTimers.push(setTimeout(() => {
        this.playSubmergedICUBeep(0, b.critical);
      }, b.delay * 1000));
    });

    // 3. Deep In-Vivo Organic Cardiac Thumps (Lub-Dub detak jantung)
    const heartTimings = [0.2, 1.4, 2.5, 3.5, 4.4, 5.2, 5.9, 6.5];
    heartTimings.forEach((sec, idx) => {
      this.introTimers.push(setTimeout(() => {
        const intensity = 0.7 + (idx / heartTimings.length) * 0.5;
        this.playDeepOrganicHeartbeat(0, intensity);
      }, sec * 1000));
    });

    // 4. Climax at breach moment (~5.0s): Visceral Submerged Resonance
    this.introTimers.push(setTimeout(() => {
      this.playSubmergedClimaxDrone();
    }, 5000));
  }

  stopSubmergedIntroAtmosphere() {
    if (this.introTimers) {
      this.introTimers.forEach((t) => clearTimeout(t));
      this.introTimers = [];
    }
  }

  // Cinematic Submerged-to-Menu Sci-Fi Whoosh & Sub-Bass Impact
  playCinematicMenuWhoosh() {
    if (!this.isInitialized || this.isMuted) return;
    this.resume();
    const t = this.ctx.currentTime;
    const duration = 0.92;

    // 1. Filtered Air/Fluid Rush Noise
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.1;
      b2 = 0.85 * b2 + white * 0.15;
      data[i] = (b0 + b1 + b2 + white * 0.08) * 0.65;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    // Dynamic high-to-low bandpass sweep for whoosh air rush
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(160, t);
    filter.frequency.exponentialRampToValueAtTime(3400, t + 0.32);
    filter.frequency.exponentialRampToValueAtTime(140, t + duration);
    filter.Q.setValueAtTime(2.6, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.48, t + 0.28);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + duration);

    // 2. Cinematic Sub-Bass Drop (Sub-bass boom accompanying the transition)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(36, t + 0.55);

    subGain.gain.setValueAtTime(0.0001, t);
    subGain.gain.linearRampToValueAtTime(0.45, t + 0.22);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.78);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(t);
    subOsc.stop(t + 0.8);
  }

  // =========================================================================
  // CINEMATIC TENSION & SUSPENSE SOUNDTRACK SYNTHESIZER (IN-VIVO BIO-THRILLER)
  // Menghasilkan musik latar menegangkan bernuansa dark sci-fi thriller (Hans Zimmer / Cyberpunk)
  // =========================================================================

  startMenuMusic() {
    if (!this.isInitialized) {
      this.init();
    }
    if (!this.ctx) return;
    this.resume();

    if (this.isMenuMusicPlaying) return;
    this.isMenuMusicPlaying = true;

    const t = this.ctx.currentTime;

    // Music master gain node with fast, loud presence
    if (!this.musicGain) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);
    }

    this.musicGain.gain.cancelScheduledValues(t);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value || 0.0001, t);
    this.musicGain.gain.linearRampToValueAtTime(0.88, t + 0.6);

    // 1. Start rich audible bass drone (D2 + D3 registers)
    this.startTensionDrone();

    // 2. Start rhythmic tension sequencer (heartbeat + clock ticks + cyberpunk synth arp + sonar)
    this.startTensionSequencer();
  }

  stopMenuMusic() {
    if (!this.isMenuMusicPlaying) return;
    this.isMenuMusicPlaying = false;

    if (this.musicGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, t + 0.8);
    }

    setTimeout(() => {
      if (!this.isMenuMusicPlaying) {
        this.stopTensionDrone();
        this.stopTensionSequencer();
      }
    }, 850);
  }

  playAmbientLoop() {
    this.startMenuMusic();
  }

  // --- Rich Audible Tension Bass Drone (D2 73.4Hz + D3 146.8Hz) ---
  startTensionDrone() {
    this.stopTensionDrone();
    if (!this.ctx || !this.musicGain) return;

    const t = this.ctx.currentTime;

    // Dual detuned oscillators: Sawtooth + Triangle for rich mid-range harmonic audibility
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // D2 note (73.42 Hz) and D3 octave (146.83 Hz) with detuning
    osc1.frequency.setValueAtTime(73.42, t);
    osc2.frequency.setValueAtTime(146.83, t);
    osc2.detune.setValueAtTime(8, t);

    // Resonant lowpass filter with prominent cutoff for phone/laptop speaker presence
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, t);
    filter.Q.setValueAtTime(3.2, t);

    // Sinister slow breathing LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, t);
    lfoGain.gain.setValueAtTime(110, t); // modulates cutoff between 210Hz and 430Hz
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(t);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.0001, t);
    droneGain.gain.linearRampToValueAtTime(0.65, t + 0.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.musicGain);

    osc1.start(t);
    osc2.start(t);

    this.droneNodes = { osc1, osc2, lfo, droneGain };
  }

  stopTensionDrone() {
    if (this.droneNodes) {
      try {
        const t = this.ctx ? this.ctx.currentTime : 0;
        if (this.droneNodes.droneGain && this.ctx) {
          this.droneNodes.droneGain.gain.linearRampToValueAtTime(0.0001, t + 0.4);
        }
        setTimeout(() => {
          try {
            if (this.droneNodes) {
              if (this.droneNodes.osc1) this.droneNodes.osc1.stop();
              if (this.droneNodes.osc2) this.droneNodes.osc2.stop();
              if (this.droneNodes.lfo) this.droneNodes.lfo.stop();
              this.droneNodes = null;
            }
          } catch (e) {}
        }, 450);
      } catch (e) {
        this.droneNodes = null;
      }
    }
  }

  // --- Rhythmic Tension Sequencer (Heartbeat + Clock Ticks + Cyberpunk Plucks + Sonar) ---
  startTensionSequencer() {
    this.stopTensionSequencer();
    if (!this.ctx || !this.musicGain) return;

    // Tempo: 66 BPM, 16th-note clock grid
    const stepDuration = (60 / 66) / 4; // 0.2272s
    let nextStepTime = this.ctx.currentTime + 0.05;
    let stepIndex = 0;

    // Audible Mid-Range D Phrygian Melodic Pattern (D3 to D4 octave: 146Hz to 293Hz)
    const D3 = 146.83, Eb3 = 155.56, F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63, D4 = 293.66;
    const arpPattern = [
      D3, D3, F3, D3,
      Eb3, D3, A3, D3,
      D3, F3, D3, G3,
      Bb3, A3, F3, Eb3,
      D3, D3, F3, D3,
      Eb3, D3, C4, D3,
      D3, F3, G3, Bb3,
      A3, G3, F3, Eb3
    ];

    const scheduleAheadTime = 0.22;

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.isMenuMusicPlaying) return;

      const currentTime = this.ctx.currentTime;
      while (nextStepTime < currentTime + scheduleAheadTime) {
        const stepInBar = stepIndex % 16;
        const totalStep = stepIndex % 64;

        // 1. RELENTLESS TENSION CLOCKWORK TICKING (Hans Zimmer / Dunkirk suspense pulse)
        // High-frequency tick audible on every laptop/phone speaker
        const isTickAccent = (stepInBar === 0 || stepInBar === 4 || stepInBar === 8 || stepInBar === 12);
        this.playSynthesizedClockTick(nextStepTime, isTickAccent);

        // 2. HEAVY CARDIAC SUB-KICK WITH MID PUNCH ("LUB... DUB...")
        // Beats at 0 and 3 of each 16-step bar
        if (stepInBar === 0 || stepInBar === 3) {
          const isDub = stepInBar === 3;
          this.playSynthesizedHeartbeat(nextStepTime, isDub);
        }

        // 3. AGGRESSIVE CYBERPUNK SYNTH ARPEGGIO PLUCK (LOUD & CRISP)
        const noteFreq = arpPattern[stepIndex % arpPattern.length];
        const isArpAccent = (stepInBar === 0 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14);
        this.playSynthesizedTensionPluck(nextStepTime, noteFreq, isArpAccent);

        // 4. EERIE BIO-HAZARD DUAL-TONE SONAR CHIME (Every 32 steps / 2 bars)
        if (totalStep % 32 === 0) {
          this.playSynthesizedSonarPing(nextStepTime);
        }

        // 5. DRAMATIC CINEMATIC BIO-STAB IMPACT (On bar 1 of every 64-step loop)
        if (totalStep === 0) {
          this.playSynthesizedBioStab(nextStepTime);
        }

        // 6. LIQUID AIR BREATH SWELL (at steps 22-28)
        if (totalStep % 32 === 22) {
          this.playSynthesizedBreathSwell(nextStepTime, stepDuration * 6);
        }

        nextStepTime += stepDuration;
        stepIndex++;
      }
    }, 25);
  }

  stopTensionSequencer() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // 1. Relentless Suspense Clockwork Tick (Highpass filtered click)
  playSynthesizedClockTick(time, isAccent = false) {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(isAccent ? 3800 : 4800, time);

    const gain = this.ctx.createGain();
    const vol = isAccent ? 0.38 : 0.22;
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.028);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + 0.035);
  }

  // 2. Punchy Visceral Heartbeat Thump (Punch at 180Hz dropping to 42Hz)
  playSynthesizedHeartbeat(time, isDub = false) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    const startFreq = isDub ? 140 : 185;
    const endFreq = isDub ? 36 : 42;
    const dur = isDub ? 0.17 : 0.24;

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);

    const vol = isDub ? 0.72 : 0.95;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  // 3. Crisp, Punchy Cyberpunk Synth Arpeggio Pluck (Dual Saw+Square in D3-D4 register)
  playSynthesizedTensionPluck(time, freq, isAccent = false) {
    if (!this.ctx || !this.musicGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq, time);
    osc2.detune.setValueAtTime(7, time);

    // Resonant bandpass filter opening wide for bite and snap
    filter.type = 'bandpass';
    const startCutoff = isAccent ? 1650 : 1150;
    filter.frequency.setValueAtTime(startCutoff, time);
    filter.frequency.exponentialRampToValueAtTime(320, time + 0.16);
    filter.Q.setValueAtTime(3.6, time);

    const dur = 0.17;
    const vol = isAccent ? 0.78 : 0.54;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.009);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur + 0.02);
    osc2.stop(time + dur + 0.02);
  }

  // 4. Bio-Hazard Sonar Chime (D5 + D6 Dual Tone)
  playSynthesizedSonarPing(time) {
    if (!this.ctx || !this.musicGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, time); // D5
    osc2.frequency.setValueAtTime(1174.66, time); // D6
    osc2.frequency.exponentialRampToValueAtTime(1080, time + 1.8);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.38, time + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.9);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.musicGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 1.95);
    osc2.stop(time + 1.95);
  }

  // 5. Cinematic Bio-Stab Impact (Low Brassy Synth Hit on loop turnaround)
  playSynthesizedBioStab(time) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(73.42, time); // D2
    osc.frequency.exponentialRampToValueAtTime(36.71, time + 0.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + 0.7);
    filter.Q.setValueAtTime(4.2, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.75, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.9);
  }

  // 6. Fluidic Respirator Breath Swell
  playSynthesizedBreathSwell(time, duration) {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 2.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, time);
    filter.frequency.linearRampToValueAtTime(850, time + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(280, time + duration);
    filter.Q.setValueAtTime(2.4, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.28, time + duration * 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + duration);
  }
}

export const sound = new SoundEngine();
