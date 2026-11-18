// Sample-based SFX plus a Web Audio synth for ambience and UI blips.
const SAMPLES = {
  flip: '/sounds/card-flip.mp3',
  damage: '/sounds/damage.mp3',
  item: '/sounds/item-use.mp3',
  victory: '/sounds/victory.mp3',
  defeat: '/sounds/defeat.mp3',
};

const PENTATONIC = [0, 3, 5, 7, 10, 12, 15];

class AudioEngine {
  constructor() {
    this.muted = false;
    this.ctx = null;
    this.master = null;
    this.ambient = null;
    this.heartbeat = null;
    this.samples = {};
    if (typeof Audio !== 'undefined') {
      for (const [name, src] of Object.entries(SAMPLES)) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.45;
        this.samples[name] = audio;
      }
    }
  }

  // Must be called from a user gesture (browser autoplay policy).
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.1);
    if (muted) Object.values(this.samples).forEach((a) => a.pause());
  }

  play(name) {
    if (this.muted) return;
    const base = this.samples[name];
    if (!base) return;
    const node = base.cloneNode();
    node.volume = base.volume;
    node.play().catch(() => {});
  }

  tone(freq, { dur = 0.12, type = 'sine', gain = 0.08, slideTo, delay = 0 } = {}) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  noiseBurst({ dur = 0.3, from = 300, to = 3000, gain = 0.05, q = 2 } = {}) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
  }

  blip(kind) {
    switch (kind) {
      case 'hover':
        return this.tone(1400, { dur: 0.04, gain: 0.025, type: 'triangle' });
      case 'select':
        return this.tone(520, { dur: 0.14, slideTo: 1040, gain: 0.06, type: 'triangle' });
      case 'deal':
        this.noiseBurst({ dur: 0.35, from: 400, to: 4000, gain: 0.05 });
        return [0, 0.08, 0.16].forEach((d, i) => this.tone(660 + i * 220, { dur: 0.08, gain: 0.04, delay: d, type: 'square' }));
      case 'deny':
        return this.tone(160, { dur: 0.18, gain: 0.06, type: 'square' });
      case 'heal':
        return [0, 4, 7, 12].forEach((s, i) => this.tone(440 * 2 ** (s / 12), { dur: 0.25, gain: 0.05, delay: i * 0.07 }));
      case 'shield':
        this.tone(1200, { dur: 0.5, gain: 0.06, slideTo: 600 });
        return this.tone(1800, { dur: 0.4, gain: 0.03, delay: 0.05 });
      case 'glitch':
        return this.noiseBurst({ dur: 0.18, from: 6000, to: 200, gain: 0.07, q: 8 });
      case 'signal':
        return [0, 7, 3].forEach((s, i) => this.tone(330 * 2 ** (s / 12), { dur: 0.3, gain: 0.04, delay: i * 0.12, type: 'sawtooth' }));
      case 'safe':
        return this.tone(220, { dur: 0.6, gain: 0.04, slideTo: 180 });
      default:
        return undefined;
    }
  }

  startAmbient(theme) {
    if (!this.ctx) return;
    const { root, filter, wobble } = theme.ambient;
    if (this.ambient) {
      const t = this.ctx.currentTime;
      this.ambient.oscs.forEach((o, i) => o.frequency.setTargetAtTime(root * [1, 1.006, 2][i], t, 1.5));
      this.ambient.baseFilter = filter;
      this.ambient.baseWobble = wobble;
      this.setTension(this.ambient.tension);
      return;
    }

    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.setTargetAtTime(0.06, ctx.currentTime, 2);
    out.connect(this.master);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = filter;
    lp.Q.value = 6;
    lp.connect(out);

    const oscs = [1, 1.006, 2].map((mult, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'sine' : 'sawtooth';
      o.frequency.value = root * mult;
      o.connect(lp);
      o.start();
      return o;
    });

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = wobble;
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();

    // Echoing pings give the halls a sense of space.
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.45;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.45;
    delay.connect(feedback).connect(delay);
    delay.connect(this.master);

    this.ambient = { oscs, filter: lp, lfo, delay, baseFilter: filter, baseWobble: wobble, tension: 0 };

    const schedulePing = () => {
      setTimeout(() => {
        if (!this.muted) {
          const step = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
          const freq = oscs[0].frequency.value * 8 * 2 ** (step / 12);
          const t = ctx.currentTime;
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.025, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
          o.connect(g);
          g.connect(delay);
          g.connect(this.master);
          o.start(t);
          o.stop(t + 1.5);
        }
        schedulePing();
      }, 4000 + Math.random() * 7000);
    };
    schedulePing();
  }

  // 0 = calm, 1 = critical. Opens the filter, speeds the wobble, and adds a heartbeat when low.
  setTension(level) {
    if (!this.ctx || !this.ambient) return;
    this.ambient.tension = level;
    const t = this.ctx.currentTime;
    this.ambient.filter.frequency.setTargetAtTime(this.ambient.baseFilter * (1 + level * 1.2), t, 0.8);
    this.ambient.lfo.frequency.setTargetAtTime(this.ambient.baseWobble + level * 0.6, t, 0.8);
    if (level >= 0.6 && !this.heartbeat) {
      this.heartbeat = setInterval(() => {
        this.tone(58, { dur: 0.16, gain: 0.18, slideTo: 40 });
        this.tone(52, { dur: 0.16, gain: 0.12, slideTo: 38, delay: 0.22 });
      }, 1100);
    } else if (level < 0.6 && this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
  }
}

const audio = new AudioEngine();
export default audio;
