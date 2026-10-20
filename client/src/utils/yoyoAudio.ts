/**
 * Programmatic Web Audio API Synthesizer for Yo-Yo Intermittent Recovery Test
 * Zero external audio files or copyright liabilities.
 * High-precision synthesized waveforms with smooth gain envelopes.
 */

class YoYoAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public init(): void {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = "sine", gainVal: number = 0.35): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Envelope: Fast attack, gentle decay
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, this.ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.02);
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * Start Beep (High crisp 880Hz A5 beep)
   * Signals the runner to sprint off the start line.
   */
  public playStartBeep(): void {
    this.playTone(880, 0.28, "triangle", 0.45);
  }

  /**
   * Turn Beep (Distinct 784Hz G5 beep)
   * Signals the runner to touch the 20-meter turn line and sprint back.
   */
  public playTurnBeep(): void {
    this.playTone(784, 0.22, "sine", 0.42);
  }

  /**
   * Shuttle End Beep (Punchy 587Hz D5 beep)
   * Signals arrival at the start line finishing the 40m shuttle.
   */
  public playShuttleEndBeep(): void {
    this.playTone(587, 0.24, "sine", 0.4);
  }

  /**
   * Recovery Cue (Two-tone descending cue: 523Hz -> 392Hz)
   * Signals start of 10-second active recovery walk/jog window.
   */
  public playRecoveryCue(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(392.00, now + 0.16); // G4

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // ignore
    }
  }

  /**
   * Countdown warning pip (440Hz short pip)
   * Used for 3... 2... 1... warning countdowns
   */
  public playCountdownPip(highPitch: boolean = false): void {
    this.playTone(highPitch ? 880 : 440, 0.12, "triangle", highPitch ? 0.45 : 0.3);
  }

  /**
   * Level Up Cue (Ascending triad chord: 523Hz -> 659Hz -> 784Hz)
   * Celebrates speed increase entering a new speed stage.
   */
  public playLevelUp(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);

        gain.gain.setValueAtTime(0.001, now + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.11 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Test End / Fatigue Final Cue (Low descending chord)
   */
  public playTestEnd(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 349.23, 261.63]; // A4 -> F4 -> C4
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0.001, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.35, now + idx * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.35);
      });
    } catch {
      // ignore
    }
  }
}

export const yoyoAudio = new YoYoAudioEngine();
