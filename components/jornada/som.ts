// Som da jornada, sintetizado no próprio navegador (sem arquivo, sem licença).
// Começa DESLIGADO: navegadores só liberam áudio depois de um toque do usuário.
let ctx: AudioContext | null = null;
let mestre: GainNode | null = null;
import { construirAmbiente, Ambiente } from './ambiente';
let ambiente: Ambiente | null = null;
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
  // Meditativo, afinado em 432 Hz (ver ambiente.ts).
  ambiente = construirAmbiente(ctx, mestre);
};

export const somLigado = () => ligado;

export const alternarSom = async (): Promise<boolean> => {
  criar();
  if (!ctx || !mestre) return false;
  if (!ligado) {
    await ctx.resume();
    iniciarAmbiente();
    mestre.gain.cancelScheduledValues(ctx.currentTime);
    mestre.gain.setValueAtTime(mestre.gain.value, ctx.currentTime);
    mestre.gain.linearRampToValueAtTime(1, ctx.currentTime + 6);   // entra devagar, como uma respiração
    ligado = true;
    clique();
  } else {
    mestre.gain.cancelScheduledValues(ctx.currentTime);
    mestre.gain.setValueAtTime(mestre.gain.value, ctx.currentTime);
    mestre.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    ligado = false;
    // depois do fade, desliga de verdade (economiza bateria)
    setTimeout(() => { if (!ligado) { ambiente?.parar(); ambiente = null; } }, 1700);
  }
  return ligado;
};

// Clique de trackpad: um estalo seco e curtíssimo (ruído filtrado) + um "tum" grave quase inaudível.
let ruido: AudioBuffer | null = null;
let ultimoClique = 0;
export const clique = (deClique = false) => {
  if (!ligado || !ctx || !mestre) return;
  // Rolagem rápida não pode empilhar cliques: no máximo um a cada meio segundo.
  // Um clique de verdade (mouse ou toque) é mais curto: até um a cada 120 ms.
  const agora = performance.now();
  if (agora - ultimoClique < (deClique ? 120 : 500)) return;
  ultimoClique = agora;
  const t = ctx.currentTime;
  if (!ruido) {
    ruido = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
    const d = ruido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  }
  const src = ctx.createBufferSource();
  src.buffer = ruido;
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'bandpass';
  filtro.frequency.value = 2600;
  filtro.Q.value = 0.9;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  src.connect(filtro).connect(g).connect(mestre);
  src.start(t);

  const o = ctx.createOscillator();
  const g2 = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(170, t);
  o.frequency.exponentialRampToValueAtTime(90, t + 0.04);
  g2.gain.setValueAtTime(0.0001, t);
  g2.gain.exponentialRampToValueAtTime(0.06, t + 0.003);
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g2).connect(mestre);
  o.start(t);
  o.stop(t + 0.06);
};
