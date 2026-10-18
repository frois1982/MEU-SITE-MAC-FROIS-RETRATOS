// Faixa própria da jornada, sintetizada no navegador (sem arquivo, sem licença de terceiros).
// Afinada em A = 432 Hz. Três camadas:
//   1. pad: um acorde aberto e estável (A, E, A) que respira devagar, com reverb longo;
//   2. oud: uma melodia original em escala árabe hijaz (A Bb C# D E F G), notas "dedilhadas" sintetizadas;
//   3. tigelas: duas notas longas e suaves, uma no meio e outra no fim do ciclo.
// O ciclo dura 66 s e se repete sem emendas audíveis (termina em A, começa subindo para E).
export const A4 = 432;
export type Ambiente = { parar: () => void };

// Razões justas a partir de A3 (= A4 / 2).
const A3 = A4 / 2;
const nota = (r: number) => A3 * r;
const N = {
  A3: nota(1), Bb3: nota(16 / 15), Cs4: nota(5 / 4), D4: nota(4 / 3), E4: nota(3 / 2),
  F4: nota(8 / 5), G4: nota(16 / 9), A4: nota(2),
};

type Evento = [number, number, number, number]; // [início (s), frequência, duração (s), força 0-1]
type Frase = { inicio: number; notas: Evento[]; tigela?: [number, number] }; // tigela: [início relativo, frequência]
const CICLO = 66;

const FRASES: Frase[] = [
  // I: desce de E até A, em tempo livre
  { inicio: 0, notas: [
    [0, N.E4, 3.2, 0.9], [3.4, N.D4, 1.6, 0.7], [5.2, N.Cs4, 1.8, 0.7], [7.2, N.Bb3, 2.2, 0.75], [9.6, N.A3, 4.5, 0.9],
  ] },
  // II: sobe pelo intervalo característico Bb → C# e volta
  { inicio: 16, notas: [
    [0, N.A3, 1.4, 0.7], [1.6, N.Bb3, 1.4, 0.7], [3.2, N.Cs4, 2.2, 0.8], [5.6, N.D4, 1.4, 0.7],
    [7.2, N.E4, 3.0, 0.85], [10.4, N.D4, 1.4, 0.65], [12, N.Cs4, 2.0, 0.7], [14.4, N.A3, 4.0, 0.85],
  ], tigela: [14.6, N.E4 * 2] },
  // III: um pouco mais alto, com F
  { inicio: 36, notas: [
    [0, N.E4, 1.5, 0.8], [1.7, N.F4, 1.5, 0.75], [3.4, N.E4, 1.6, 0.7], [5.2, N.D4, 1.6, 0.7],
    [7, N.Cs4, 1.8, 0.7], [9, N.D4, 1.4, 0.65], [10.6, N.Bb3, 2.2, 0.7], [13, N.A3, 5.0, 0.85],
  ] },
  // IV: resolução
  { inicio: 56, notas: [
    [0, N.Cs4, 2.0, 0.7], [2.2, N.Bb3, 2.4, 0.7], [4.8, N.A3, 3.2, 0.8],
  ], tigela: [4.9, N.A4] },
];

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

export const construirAmbiente = (
  ctx: BaseAudioContext,
  destino: AudioNode,
  opcoes: { preAgendar?: boolean } = {},
): Ambiente => {
  const fontes: AudioScheduledSourceNode[] = [];

  // --- saída comum: filtro, reverb e compressor de segurança ---
  const barramento = ctx.createGain();               // pad e tigelas (som escuro)
  barramento.gain.value = 1.6;
  const filtro = ctx.createBiquadFilter();           // nada áspero: corta acima de ~1,5 kHz
  filtro.type = 'lowpass'; filtro.frequency.value = 1500; filtro.Q.value = 0.3;

  const saidaOud = ctx.createGain();                 // oud: precisa de mais brilho que o pad
  saidaOud.gain.value = 0.7;                         // medido offline: com 1,0 o pico chegava a -7,5 dB; assim fica ≈ -10 dB

  const seco = ctx.createGain(); seco.gain.value = 0.55;
  const molhado = ctx.createGain(); molhado.gain.value = 0.75;
  const rev = reverb(ctx);
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.05; comp.release.value = 0.4;

  barramento.connect(filtro);
  filtro.connect(seco); filtro.connect(rev);
  saidaOud.connect(seco); saidaOud.connect(rev);
  seco.connect(comp);
  rev.connect(molhado).connect(comp);
  comp.connect(destino);

  // --- 1. pad: acorde aberto A, E, A que respira ---
  const vozes: [number, number, number][] = [
    [A4 / 4, 0.05, 0], [A4 / 2, 0.05, -0.3], [(A4 * 3) / 4, 0.04, 0.25], [A4, 0.045, -0.15], [A4 * 2, 0.01, 0.3],
  ];
  vozes.forEach(([f, g, pan], i) => {
    [-3, 3].forEach((cents) => {
      const o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = f; o.detune.value = cents;
      const vg = ctx.createGain(); vg.gain.value = g * 0.35;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.035 + i * 0.011 + (cents > 0 ? 0.007 : 0);
      const lg = ctx.createGain(); lg.gain.value = g * 0.3;
      lfo.connect(lg).connect(vg.gain);
      const p = estereo(ctx, pan);
      if (p) o.connect(vg).connect(p).connect(barramento); else o.connect(vg).connect(barramento);
      o.start(); lfo.start();
      fontes.push(o, lfo);
    });
  });

  // --- 2. oud: corda dedilhada sintetizada ---
  const corpo = ctx.createBiquadFilter();            // ressonância da caixa do instrumento
  corpo.type = 'peaking'; corpo.frequency.value = 380; corpo.gain.value = 5; corpo.Q.value = 1;
  const corpo2 = ctx.createBiquadFilter();
  corpo2.type = 'peaking'; corpo2.frequency.value = 1100; corpo2.gain.value = 3; corpo2.Q.value = 1;
  const brilho = ctx.createBiquadFilter();
  brilho.type = 'lowpass'; brilho.frequency.value = 3400;
  corpo.connect(corpo2).connect(brilho).connect(saidaOud);

  const ruido = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.02), ctx.sampleRate);
  { const d = ruido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); }

  const dedilhar = (f: number, t: number, dur: number, forca: number, escorrega = false) => {
    const ressoa = dur + 1.8;                         // a nota continua soando depois de "acabar"
    [-2, 2].forEach((cents) => {                      // duas cordas quase iguais, como no oud (cordas duplas)
      for (let n = 1; n <= 7; n++) {
        const o = ctx.createOscillator();
        o.type = 'sine';
        const fn = f * n * (1 + 0.0003 * n * n);      // pequena inarmonicidade: som de corda de verdade
        if (escorrega && n === 1) {
          o.frequency.setValueAtTime(fn * 0.985, t);
          o.frequency.exponentialRampToValueAtTime(fn, t + 0.07);
        } else o.frequency.value = fn;
        o.detune.value = cents;
        const g = ctx.createGain();
        const a = (forca * 0.06) / Math.pow(n, 1.15);
        const decai = ressoa / (1 + 0.55 * (n - 1)); // harmônicos agudos somem antes
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(a, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + decai);
        o.connect(g).connect(corpo);
        o.start(t); o.stop(t + decai + 0.1);
      }
    });
    const b = ctx.createBufferSource();               // o estalo da palheta
    b.buffer = ruido;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1;
    const bg = ctx.createGain(); bg.gain.value = 0.05 * forca;
    b.connect(bp).connect(bg).connect(corpo);
    b.start(t);
  };

  const tocarNota = (t: number, f: number, dur: number, forca: number) => {
    dedilhar(f, t, dur, forca, Math.random() < 0.3);
    if (dur > 3) dedilhar(f, t + dur * 0.55, dur * 0.4, forca * 0.35); // nota longa: rededilhado suave, como num tremolo
  };

  // --- 3. tigela suave ---
  const tigela = (t: number, f: number) => {
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
  };

  // --- agendamento: uma frase por vez, sempre um pouco à frente do relógio de áudio ---
  let vivo = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const base0 = ctx.currentTime + 5;                  // o pad entra primeiro; o oud começa depois de 5 s
  let baseCiclo = base0, indice = 0;

  const agendarFrase = () => {
    if (!vivo) return;
    const fr = FRASES[indice];
    const t0 = baseCiclo + fr.inicio;
    fr.notas.forEach(([dt, f, dur, forca]) => tocarNota(t0 + dt, f, dur, forca));
    if (fr.tigela) tigela(t0 + fr.tigela[0], fr.tigela[1]);
    indice += 1;
    if (indice === FRASES.length) { indice = 0; baseCiclo += CICLO; }
  };

  if (opcoes.preAgendar) {
    for (let i = 0; i < FRASES.length; i++) agendarFrase();
  } else {
    const proxima = () => {
      if (!vivo) return;
      agendarFrase();
      const quando = baseCiclo + FRASES[indice].inicio;
      timer = setTimeout(proxima, Math.max(0, (quando - ctx.currentTime - 2.5) * 1000));
    };
    proxima();
  }

  return {
    parar: () => {
      vivo = false;
      if (timer) clearTimeout(timer);
      fontes.forEach((n) => { try { n.stop(); } catch { /* já parou */ } });
      try { comp.disconnect(); } catch { /* ok */ }
    },
  };
};
