// Web Audio API Sound Synthesizer for Chess
// Clean, low-latency, 100% reliable procedural audio without external mp3 dependencies.

class ChessAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('chess_muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('chess_volume') || '0.7');
    this.initialized = false;
  }

  init() {
    if (!this.initialized) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('AudioContext not supported:', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = !!muted;
    localStorage.setItem('chess_muted', this.muted);
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // Wooden Move Click
  playMove() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    // High subtle click click
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(1400, t);
    click.frequency.exponentialRampToValueAtTime(400, t + 0.02);
    clickGain.gain.setValueAtTime(this.volume * 0.3, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    click.connect(clickGain);
    gain.connect(this.ctx.destination);
    clickGain.connect(this.ctx.destination);

    osc.start(t);
    click.start(t);
    osc.stop(t + 0.08);
    click.stop(t + 0.03);
  }

  // Punchy Capture Snap
  playCapture() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    // Low resonant thud
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, t);
    osc1.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    gain1.gain.setValueAtTime(this.volume * 0.9, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    // Sharp snap transient
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(850, t);
    osc2.frequency.exponentialRampToValueAtTime(120, t + 0.07);
    gain2.gain.setValueAtTime(this.volume * 0.8, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.ctx.destination);
    gain2.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.14);
    osc2.stop(t + 0.09);
  }

  // Check alert chime
  playCheck() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [587.33, 880]; // D5, A5 tension chime

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(this.volume * 0.5, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.36);
    });
  }

  // Castle double-click slide
  playCastle() {
    this.playMove();
    setTimeout(() => {
      this.playMove();
    }, 130);
  }

  // Pawn Promotion fanfare
  playPromote() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);

      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(this.volume * 0.6, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.3);
    });
  }

  // Game Over chime
  playGameOver() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const chord = [392.00, 493.88, 587.33, 783.99]; // G major

    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volume * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  // Illegal move buzzer
  playIllegal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(110, t + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }
}

// Global singleton instance
window.chessAudio = new ChessAudio();
