// Ambiente sonoro meditativo da jornada, sintetizado no navegador (sem arquivo, sem licença).
// Afinado em A = 432 Hz: um acorde aberto e estável (A, E, A, B, C#), vozes levemente desafinadas
// que respiram bem devagar, reverb longo e, de tempos em tempos, uma "tigela tibetana" suave.
export const A4 = 432;
export type Ambiente = { parar: () => void };

const reverb = (ctx: BaseAudioContext, segundos = 5) => {
  const n = Math.floor(ctx.sampleRate * segundos);
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
};

const estereo = (ctx: BaseAudioContext, pan: number) => {
  if (!(ctx as any).createStereoPanner) return null;
  const p = ctx.createStereoPanner();
  p.pan.value = pan;
  return p;
};

export const construirAmbiente = (ctx: BaseAudioContext, destino: AudioNode, comSinos = true): Ambiente => {
  const fontes: AudioScheduledSourceNode[] = [];

  const barramento = ctx.createGain();
  barramento.gain.value = 1.6;                       // medido offline: pico ≈ -14 dB e volume médio ≈ -26 dB, suave e sem distorção
  const filtro = ctx.createBiquadFilter();           // tira qualquer aspereza: nada acima de ~1,5 kHz
  filtro.type = 'lowpass'; filtro.frequency.value = 1500; filtro.Q.value = 0.3;
  const seco = ctx.createGain(); seco.gain.value = 0.55;
  const molhado = ctx.createGain(); molhado.gain.value = 0.75;
  const rev = reverb(ctx);
  const comp = ctx.createDynamicsCompressor();       // segurança contra picos
  comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.05; comp.release.value = 0.4;

  barramento.connect(filtro);
  filtro.connect(seco).connect(comp);
  filtro.connect(rev).connect(molhado).connect(comp);
  comp.connect(destino);

  // [frequência, volume, posição no estéreo]
  const vozes: [number, number, number][] = [
    [A4 / 4, 0.05, 0],        // A2 108 Hz: o chão do acorde
    [A4 / 2, 0.05, -0.3],     // A3 216
    [(A4 * 3) / 4, 0.04, 0.25], // E4 324 (quinta justa)
    [A4, 0.05, -0.15],        // A4 432
    [(A4 * 9) / 8, 0.02, 0.2],  // B4 486
    [(A4 * 5) / 4, 0.025, 0.35], // C#5 540
  ];
  vozes.forEach(([f, g, pan], i) => {
    [-3, 3].forEach((cents) => {                      // duas ondas quase iguais: o "coral" lento
      const o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = f; o.detune.value = cents;
      const vg = ctx.createGain(); vg.gain.value = g * 0.35;
      const lfo = ctx.createOscillator();             // cada voz respira num ritmo próprio (≈ 20 a 30 s)
      lfo.frequency.value = 0.035 + i * 0.011 + (cents > 0 ? 0.007 : 0);
      const lg = ctx.createGain(); lg.gain.value = g * 0.3;
      lfo.connect(lg).connect(vg.gain);
      const p = estereo(ctx, pan);
      if (p) o.connect(vg).connect(p).connect(barramento); else o.connect(vg).connect(barramento);
      o.start(); lfo.start();
      fontes.push(o, lfo);
    });
  });

  let vivo = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const notas = [A4, (A4 * 5) / 4, (A4 * 3) / 2, A4 * 2];   // A4, C#5, E5, A5
  const tigela = () => {
    if (!vivo) return;
    const f = notas[Math.floor(Math.random() * notas.length)];
    const t = ctx.currentTime;
    const sai = ctx.createGain();
    const p = estereo(ctx, Math.random() * 1.2 - 0.6);
    if (p) sai.connect(p).connect(barramento); else sai.connect(barramento);
    ([[1, 0.05, 9], [2.71, 0.012, 5], [5.4, 0.004, 3]] as [number, number, number][]).forEach(([r, g, dur]) => {
      const o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = f * r;
      const e = ctx.createGain();
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(g, t + 0.04);
      e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(e).connect(sai);
      o.start(t); o.stop(t + dur + 0.2);
    });
    timer = setTimeout(tigela, 11000 + Math.random() * 8000);
  };
  if (comSinos) timer = setTimeout(tigela, 4000);

  return {
    parar: () => {
      vivo = false;
      if (timer) clearTimeout(timer);
      fontes.forEach((n) => { try { n.stop(); } catch { /* já parou */ } });
      try { comp.disconnect(); } catch { /* ok */ }
    },
  };
};
