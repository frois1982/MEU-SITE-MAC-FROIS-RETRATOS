// Som da jornada, sintetizado no próprio navegador (sem arquivo, sem licença).
// Começa DESLIGADO: navegadores só liberam áudio depois de um toque do usuário.
let ctx: AudioContext | null = null;
let mestre: GainNode | null = null;
let ambiente: { osc: OscillatorNode[]; stop: () => void } | null = null;
let ligado = false;

const criar = () => {
  if (ctx) return;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  mestre = ctx.createGain();
  mestre.gain.value = 0;
  mestre.connect(ctx.destination);
};

const iniciarAmbiente = () => {
  if (!ctx || !mestre || ambiente) return;
  // Pad grave e suave: duas ondas levemente desafinadas + filtro + oscilação lenta.
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.value = 420;
  const ganho = ctx.createGain();
  ganho.gain.value = 0.07;
  const lfo = ctx.createOscillator();
  const lfoGanho = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoGanho.gain.value = 0.03;
  lfo.connect(lfoGanho).connect(ganho.gain);
  const osc = [55, 82.6, 110.4].map((f) => {
    const o = ctx!.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    o.connect(filtro);
    o.start();
    return o;
  });
  filtro.connect(ganho).connect(mestre);
  lfo.start();
  ambiente = { osc: [...osc, lfo], stop: () => { osc.forEach((o) => o.stop()); lfo.stop(); } };
};

export const somLigado = () => ligado;

export const alternarSom = async (): Promise<boolean> => {
  criar();
  if (!ctx || !mestre) return false;
  if (!ligado) {
    await ctx.resume();
    iniciarAmbiente();
    mestre.gain.cancelScheduledValues(ctx.currentTime);
    mestre.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    ligado = true;
    clique();
  } else {
    mestre.gain.cancelScheduledValues(ctx.currentTime);
    mestre.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    ligado = false;
  }
  return ligado;
};

// Clique sutil ao interagir.
export const clique = () => {
  if (!ligado || !ctx || !mestre) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(880, t);
  o.frequency.exponentialRampToValueAtTime(520, t + 0.09);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  o.connect(g).connect(mestre);
  o.start(t);
  o.stop(t + 0.16);
};
