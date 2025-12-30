
class SoundService {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;

    constructor() {
        try {
            // @ts-ignore
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        } catch (e) {
            console.error('Web Audio API not supported');
        }
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
        if (!this.enabled || !this.ctx) return;

        // Resume context if suspended (browser policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playClick() {
        this.playTone(800, 'sine', 0.1);
    }

    playCorrect() {
        // Ascending major arpeggio
        this.playTone(523.25, 'sine', 0.1, 0);       // C5
        this.playTone(659.25, 'sine', 0.1, 0.1);     // E5
        this.playTone(783.99, 'sine', 0.2, 0.2);     // G5
    }

    playWrong() {
        // Descending dissonant
        this.playTone(300, 'sawtooth', 0.3, 0);
        this.playTone(200, 'sawtooth', 0.4, 0.2);
    }

    playGameOver() {
        this.playTone(400, 'triangle', 0.2, 0);
        this.playTone(300, 'triangle', 0.2, 0.2);
        this.playTone(200, 'triangle', 0.4, 0.4);
    }
}

export const soundService = new SoundService();
