/**
 * Web Audio API synthesizer for workout rest timer alerts and countdown chimes.
 * Requires zero external audio files and works reliably across modern browsers.
 */

export function playRestTimerBeep(): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Pleasant high-energy double chime (D5: 587.33Hz -> A5: 880.00Hz)
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    playTone(587.33, 0, 0.15);
    playTone(880.0, 0.16, 0.35);
  } catch {
    // Graceful fallback if autoplay restrictions or browser policy blocks audio
  }
}
