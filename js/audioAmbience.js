// Subtle Futuristic Ambient Sound Generator using Web Audio API (Zero external assets)

export function createAmbientAudio() {
  let ctx = null;
  let isPlaying = false;
  let masterGain = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let noiseNode = null;

  function init() {
    if (ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioContext();

    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Warm chord tone (D minor root - 146.83 Hz & 220.0 Hz)
    droneOsc1 = ctx.createOscillator();
    droneOsc1.type = "sine";
    droneOsc1.frequency.setValueAtTime(146.83, ctx.currentTime);

    droneOsc2 = ctx.createOscillator();
    droneOsc2.type = "triangle";
    droneOsc2.frequency.setValueAtTime(220.0, ctx.currentTime);

    // Low pass filter for soft mellow warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(masterGain);

    droneOsc1.start();
    droneOsc2.start();
  }

  function toggle() {
    init();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (!isPlaying) {
      masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);
      isPlaying = true;
    } else {
      masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
      isPlaying = false;
    }
    return isPlaying;
  }

  function playChime() {
    if (!isPlaying || !ctx) return;
    const osc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);

    chimeGain.gain.setValueAtTime(0.04, ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  return {
    toggle,
    playChime,
    get isPlaying() { return isPlaying; }
  };
}
