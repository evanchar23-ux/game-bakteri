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
  // PLAYFUL CARTOON ARCADE SOUNDTRACK SYNTHESIZER ("HAVE FUN" VIBES)
  // Musik ceria, upbeat, bouncy & energetic bernuansa kartun 3D retro-modern
  // (F Major, 120 BPM, Bouncy Bass, Marimba Lead, Bubble Pops & Skank Chords)
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

    // Music master gain node with balanced, warm presence
    if (!this.musicGain) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);
    }

    this.musicGain.gain.cancelScheduledValues(t);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value || 0.0001, t);
    this.musicGain.gain.linearRampToValueAtTime(0.82, t + 0.5);

    // Start upbeat fun cartoon sequencer
    this.startFunCartoonSequencer();
  }

  stopMenuMusic() {
    if (!this.isMenuMusicPlaying) return;
    this.isMenuMusicPlaying = false;

    if (this.musicGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, t + 0.6);
    }

    setTimeout(() => {
      if (!this.isMenuMusicPlaying) {
        this.stopFunCartoonSequencer();
      }
    }, 650);
  }

  playAmbientLoop() {
    this.startMenuMusic();
  }

  // --- Upbeat Fun Cartoon Sequencer (120 BPM, 8-Bar Melodic Arcade Loop) ---
  startFunCartoonSequencer() {
    this.stopFunCartoonSequencer();
    if (!this.ctx || !this.musicGain) return;

    // Tempo: 120 BPM -> 16th-note step is 0.125s (125ms)
    const stepDuration = 0.125;
    let nextStepTime = this.ctx.currentTime + 0.05;
    let stepIndex = 0;

    // Frequencies (F Major Scale)
    const D2 = 73.42, F2 = 87.31, G2 = 98.00, A2 = 110.00, Bb2 = 116.54, C3 = 130.81, D3 = 146.83, E3 = 164.81;
    const F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63, D4 = 293.66, E4 = 329.63;
    const F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, C6 = 1046.50;

    // 128-step / 8-bar Bouncy Bassline (null when silent)
    const bassTrack = new Array(128).fill(null);
    // Bar 1 (F Maj): Steps 0-15
    bassTrack[0] = F2; bassTrack[3] = F2; bassTrack[6] = C3; bassTrack[8] = F2; bassTrack[11] = A2; bassTrack[14] = C3;
    // Bar 2 (Bb Maj): Steps 16-31
    bassTrack[16] = Bb2; bassTrack[19] = Bb2; bassTrack[22] = F3; bassTrack[24] = Bb2; bassTrack[27] = D3; bassTrack[30] = F3;
    // Bar 3 (C Maj): Steps 32-47
    bassTrack[32] = C3; bassTrack[35] = C3; bassTrack[38] = G2; bassTrack[40] = C3; bassTrack[43] = E3; bassTrack[46] = G3;
    // Bar 4 (F Maj Turnaround): Steps 48-63
    bassTrack[48] = F2; bassTrack[51] = F2; bassTrack[54] = C3; bassTrack[56] = F2; bassTrack[58] = A2; bassTrack[60] = Bb2; bassTrack[62] = C3;
    // Bar 5 (D min): Steps 64-79
    bassTrack[64] = D2; bassTrack[67] = D2; bassTrack[70] = A2; bassTrack[72] = D3; bassTrack[75] = F3; bassTrack[78] = D3;
    // Bar 6 (Bb Maj): Steps 80-95
    bassTrack[80] = Bb2; bassTrack[83] = Bb2; bassTrack[86] = F3; bassTrack[88] = Bb2; bassTrack[91] = D3; bassTrack[94] = F3;
    // Bar 7 (G min): Steps 96-111
    bassTrack[96] = G2; bassTrack[99] = G2; bassTrack[102] = D3; bassTrack[104] = G2; bassTrack[107] = Bb2; bassTrack[110] = D3;
    // Bar 8 (C7 to F): Steps 112-127
    bassTrack[112] = C3; bassTrack[115] = C3; bassTrack[118] = E3; bassTrack[120] = G2; bassTrack[122] = Bb2; bassTrack[124] = C3;

    // 128-step / 8-bar Playful Marimba Melody
    const melodyTrack = new Array(128).fill(null);
    // Phrase 1 (Bars 1-2):
    melodyTrack[0] = C5; melodyTrack[2] = A4; melodyTrack[4] = F4; melodyTrack[6] = G4; melodyTrack[8] = A4; melodyTrack[11] = C5;
    melodyTrack[16] = D5; melodyTrack[18] = D5; melodyTrack[20] = F5; melodyTrack[22] = D5; melodyTrack[24] = C5; melodyTrack[27] = A4;
    // Phrase 2 (Bars 3-4):
    melodyTrack[32] = G4; melodyTrack[34] = A4; melodyTrack[36] = C5; melodyTrack[38] = E5; melodyTrack[40] = D5; melodyTrack[43] = C5;
    melodyTrack[48] = F5; melodyTrack[52] = C5; melodyTrack[56] = A4;
    // Phrase 3 (Bars 5-6):
    melodyTrack[64] = F5; melodyTrack[66] = E5; melodyTrack[68] = D5; melodyTrack[70] = E5; melodyTrack[72] = F5; melodyTrack[75] = A5;
    melodyTrack[80] = G5; melodyTrack[82] = F5; melodyTrack[84] = D5; melodyTrack[86] = F5; melodyTrack[88] = G5; melodyTrack[91] = D5;
    // Phrase 4 (Bars 7-8):
    melodyTrack[96] = E5; melodyTrack[98] = D5; melodyTrack[100] = C5; melodyTrack[102] = D5; melodyTrack[104] = E5; melodyTrack[107] = G5;
    melodyTrack[112] = F5; // Bar 8 concludes with glockenspiel fanfare

    // Chord Stabs (Upbeat off-beat skank on steps 2, 6, 10, 14 of each 16-step bar)
    const chordMap = {
      0: [A3, C4, F4],   // Bar 1: F Major
      1: [Bb3, D4, F4],  // Bar 2: Bb Major
      2: [G3, C4, E4],   // Bar 3: C Major
      3: [A3, C4, F4],   // Bar 4: F Major
      4: [A3, D4, F4],   // Bar 5: D minor
      5: [Bb3, D4, F4],  // Bar 6: Bb Major
      6: [Bb3, D4, G4],  // Bar 7: G minor
      7: [Bb3, C4, E4]   // Bar 8: C7
    };

    const scheduleAheadTime = 0.25;

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.isMenuMusicPlaying) return;

      const currentTime = this.ctx.currentTime;
      while (nextStepTime < currentTime + scheduleAheadTime) {
        const stepIn128 = stepIndex % 128;
        const stepIn16 = stepIndex % 16;
        const barIndex = Math.floor(stepIn128 / 16);

        // 1. BOUNCY CARTOON BASSLINE (Rubber/Slap Arcade Bass)
        const bassNote = bassTrack[stepIn128];
        if (bassNote) {
          const isAccent = (stepIn16 === 0 || stepIn16 === 8);
          this.playCartoonBouncyBass(nextStepTime, bassNote, isAccent);
        }

        // 2. PLAYFUL OFF-BEAT CHORD STABS (Ska/Arcade Sunshine Bounce on steps 2, 6, 10, 14)
        if (stepIn16 === 2 || stepIn16 === 6 || stepIn16 === 10 || stepIn16 === 14) {
          const chord = chordMap[barIndex];
          if (chord) {
            this.playCartoonChordStab(nextStepTime, chord);
          }
        }

        // 3. CUTE MARIMBA / XYLOPHONE CARTOON MELODY
        const melodyNote = melodyTrack[stepIn128];
        if (melodyNote) {
          this.playCartoonMarimbaMelody(nextStepTime, melodyNote, 0.2);
        }

        // 4. FUN CARTOON PERCUSSION GROOVE
        // Bouncy Kick on beats 1 and 3 (step 0 and 8), plus syncopated bounce on step 14
        if (stepIn16 === 0 || stepIn16 === 8 || stepIn16 === 14) {
          this.playCartoonKick(nextStepTime, stepIn16 === 14);
        }

        // Snappy Clap / Snare on beats 2 and 4 (step 4 and 12)
        if (stepIn16 === 4 || stepIn16 === 12) {
          this.playCartoonSnare(nextStepTime);
        }

        // Crisp Shaker / Hi-Hat on every 8th note (steps 0, 2, 4, 6, 8, 10, 12, 14)
        if (stepIn16 % 2 === 0) {
          const isHatAccent = (stepIn16 === 2 || stepIn16 === 6 || stepIn16 === 10 || stepIn16 === 14);
          this.playCartoonHiHat(nextStepTime, isHatAccent);
        }

        // 5. CUTE BUBBLE POPS & CARTOON ACCENTS
        // Soap bubble pop at turnaround of bar 4 (steps 59, 61, 63)
        if (stepIn128 === 59) this.playCartoonBubblePop(nextStepTime, 520, 1100);
        if (stepIn128 === 61) this.playCartoonBubblePop(nextStepTime, 680, 1380);
        if (stepIn128 === 63) this.playCartoonBubblePop(nextStepTime, 880, 1720);

        // Ascending Cartoon Glockenspiel Flourish at turnaround of bar 8 (steps 116..126)
        if (stepIn128 >= 116 && stepIn128 <= 126 && stepIn128 % 2 === 0) {
          const runNotes = [C5, D5, E5, F5, G5, A5, C6];
          const runIdx = (stepIn128 - 116) / 2;
          if (runIdx < runNotes.length) {
            this.playCartoonGlockenspiel(nextStepTime, runNotes[runIdx]);
          }
        }

        nextStepTime += stepDuration;
        stepIndex++;
      }
    }, 30);
  }

  stopFunCartoonSequencer() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // --- Instrument 1: Bouncy Rubber/Slap Cartoon Bass (Triangle + Square with Snappy Filter) ---
  playCartoonBouncyBass(time, freq, isAccent = false) {
    if (!this.ctx || !this.musicGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq, time);

    // Warm snappy lowpass sweep
    filter.type = 'lowpass';
    const startCutoff = isAccent ? 980 : 750;
    filter.frequency.setValueAtTime(startCutoff, time);
    filter.frequency.exponentialRampToValueAtTime(160, time + 0.14);
    filter.Q.setValueAtTime(2.2, time);

    const dur = 0.16;
    const vol = isAccent ? 0.65 : 0.48;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    // Mix 75% triangle, 25% square for warm rubbery cartoon bite
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.32, time);
    osc2.connect(subGain);
    subGain.connect(filter);
    osc1.connect(filter);

    filter.connect(gain);
    gain.connect(this.musicGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur + 0.02);
    osc2.stop(time + dur + 0.02);
  }

  // --- Instrument 2: Cheerful Marimba / Toy Mallet Melody ---
  playCartoonMarimbaMelody(time, freq, dur = 0.2) {
    if (!this.ctx || !this.musicGain) return;

    const fundamental = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    fundamental.type = 'sine';
    overtone.type = 'triangle';

    // Inharmonic wooden bar mallet resonance (ratio 2.76)
    fundamental.frequency.setValueAtTime(freq, time);
    overtone.frequency.setValueAtTime(freq * 2.76, time);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(Math.min(3200, freq * 1.8), time);
    filter.Q.setValueAtTime(1.8, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.55, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    const overGain = this.ctx.createGain();
    overGain.gain.setValueAtTime(0.18, time);
    overtone.connect(overGain);
    overGain.connect(filter);
    fundamental.connect(filter);

    filter.connect(gain);
    gain.connect(this.musicGain);

    fundamental.start(time);
    overtone.start(time);
    fundamental.stop(time + dur + 0.02);
    overtone.stop(time + dur + 0.02);
  }

  // --- Instrument 3: Upbeat Cartoon Reggae/Arcade Skank Chords ---
  playCartoonChordStab(time, chordNotes) {
    if (!this.ctx || !this.musicGain || !chordNotes) return;

    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0.0001, time);
    chordGain.gain.linearRampToValueAtTime(0.24, time + 0.005);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.085);
    chordGain.connect(this.musicGain);

    chordNotes.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.frequency.exponentialRampToValueAtTime(450, time + 0.08);

      osc.connect(filter);
      filter.connect(chordGain);

      osc.start(time);
      osc.stop(time + 0.095);
    });
  }

  // --- Instrument 4: Cheerful Punchy Arcade Kick ---
  playCartoonKick(time, isLight = false) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = isLight ? 115 : 135;
    const endFreq = isLight ? 48 : 52;
    const dur = isLight ? 0.07 : 0.09;

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + dur);

    const vol = isLight ? 0.42 : 0.62;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + dur + 0.01);
  }

  // --- Instrument 5: Snappy Pop Snare / Clap ---
  playCartoonSnare(time) {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.07);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1750, time);
    filter.Q.setValueAtTime(1.6, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.38, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.065);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + 0.075);
  }

  // --- Instrument 6: Crisp Cheerful Shaker / Hi-Hat ---
  playCartoonHiHat(time, isAccent = false) {
    if (!this.ctx || !this.musicGain) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.025);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(isAccent ? 7200 : 8500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.22 : 0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.022);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + 0.03);
  }

  // --- Instrument 7: Cute Soap Bubble Pop (Upward Sine Sweep) ---
  playCartoonBubblePop(time, startFreq = 550, endFreq = 1200) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.045);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.35, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  // --- Instrument 8: Bright Cartoon Glockenspiel Chime ---
  playCartoonGlockenspiel(time, freq) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.42, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.38);
  }

  // --- Legacy Compatibility Stubs (Clean No-Ops) ---
  startTensionDrone() {}
  stopTensionDrone() {}
  startTensionSequencer() {}
  stopTensionSequencer() {}
}

export const sound = new SoundEngine();
if (typeof window !== 'undefined') {
  window.sound = sound;
}
