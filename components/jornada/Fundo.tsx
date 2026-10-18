import React, { useEffect, useRef, useState } from 'react';
import { MINIATURAS } from '../../data/jornada';
import { estado, nivelTexto } from './estado';

// Fundo fixo da jornada: feixe de energia no centro (do chão ao céu), partículas e um anel de
// retratos girando em volta. Três níveis, escolhidos pelo aparelho:
//   cheio    = feixe animado + partículas (canvas)
//   simples  = feixe só em CSS, sem partículas (aparelho fraco)
//   estatico = nada se move (quem pede "menos movimento")
type Nivel = 'cheio' | 'simples' | 'estatico';

const detectar = (): Nivel => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'estatico';
  const nav = navigator as any;
  if (nav.connection?.saveData) return 'simples';
  if ((nav.deviceMemory ?? 8) <= 2) return 'simples';
  try { if (sessionStorage.getItem('jr-nivel') === 'simples') return 'simples'; } catch { /* sem storage */ }
  return 'cheio';
};

type Particula = { x: number; y: number; vx: number; vy: number; vida: number; max: number; t: number };

export const Fundo: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasP = useRef<HTMLCanvasElement>(null);   // partículas da troca de fotos, por cima do anel
  const anel = useRef<HTMLDivElement>(null);
  const [nivel, setNivel] = useState<Nivel>('cheio');

  useEffect(() => {
    let atual: Nivel = detectar();
    setNivel(atual);

    const cv = canvas.current;
    const ringEl = anel.current;
    if (!cv || !ringEl) return;
    const ctx = cv.getContext('2d');
    const cartas = Array.from(ringEl.children) as HTMLElement[];

    // O anel é uma ELIPSE: larga na horizontal (ocupa a tela do computador) e com menos profundidade.
    // rx = meia-largura da elipse; rz = profundidade; passo = o quanto a espiral sobe/desce por carta.
    let w = 0, h = 0, dpr = 1, rx = 150, rz = 230, cw = 140, passo = 22;
    // Posição e altura de cada capítulo na página: é o que liga o anel à rolagem.
    let cenas: { top: number; altura: number }[] = [];
    const medir = () => {
      w = window.innerWidth; h = window.innerHeight;
      const largo = w >= 768;
      dpr = 1; // o feixe é suave e as partículas minúsculas: resolução cheia só gastaria bateria
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (canvasP.current) { canvasP.current.width = Math.round(w * dpr); canvasP.current.height = Math.round(h * dpr); }
      if (largo) { cw = Math.min(290, w * 0.2); rx = w * 0.38; rz = Math.min(400, w * 0.28); passo = 36; }
      else { cw = 140; rx = 150; rz = 230; passo = 22; }
      ringEl.style.setProperty('--cw', `${cw}px`);
      cenas = Array.from(document.querySelectorAll('.jr-trilho')).map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, altura: r.height };
      });
    };
    medir();

    const N = cartas.length;     // 12 cartas, uma por capítulo, na ordem dos capítulos
    const P = 1100;              // perspectiva (px), igual ao CSS

    // O anel gira sozinho, devagar, o tempo todo (4 graus por segundo). Quando um capítulo se aproxima, a carta dele
    // sai de onde estiver no anel e VOA até o centro da frente, tomando o lugar da que estava lá (que esmaece).
    let ang = 0;
    const velocidade = 4;
    const suave = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

    // Linha do tempo de cada carta k (guiada pela rolagem, então vale para descer e para subir). c1 = centro do intervalo seguinte:
    //   chegada  : a carta k voa da órbita até o centro, POR TRÁS da que está lá (antes de c_k − 0,25 tela);
    //   dissolve : quando a próxima carta chega, a carta k se desfaz em pixels no próprio lugar, revelando a nova por baixo;
    //   volta    : os pixels se refazem enquanto ela segue de volta para a órbita.
    const alvoDaCarta = (k: number): [number, number, number] => {
      const c = cenas[k];
      if (!c) return [0, 0, 0];
      const meio = window.scrollY + h / 2;
      const ck = c.top - 0.35 * h;                   // o intervalo tem 70% da altura da tela
      const chegada = suave((meio - (ck - 0.95 * h)) / (0.7 * h));
      const prox = cenas[k + 1];
      if (!prox) return [chegada, 0, 0];              // a última carta fica em foco
      const c1 = prox.top - 0.35 * h;
      const dissolve = suave((meio - (c1 - 0.25 * h)) / (0.4 * h));
      const volta = suave((meio - (c1 + 0.1 * h)) / (0.75 * h));
      return [chegada, dissolve, volta];
    };
    const pa = new Array(N).fill(0) as number[];     // chegada, dissolve e volta com inércia, para fluir em vez de pular
    const dd = new Array(N).fill(0) as number[];
    const rr = new Array(N).fill(0) as number[];

    // --- A foto da frente vira uma nuvem de partículas finas (as cores da própria foto) e volta para trás se refazendo ---
    // Para ser leve no celular: as partículas são agrupadas por cor (64 cores, um único "fill" por cor), tudo o que é fixo
    // (direção, cor, posição na foto) é calculado uma só vez, e a quantidade se ajusta ao aparelho durante a troca.
    const COLUNAS = w < 768 ? 48 : 60, LINHAS = w < 768 ? 63 : 79;
    const TOTAL = COLUNAS * LINHAS;
    const dirX = new Float32Array(TOTAL), dirY = new Float32Array(TOTAL), alcanceJ = new Float32Array(TOTAL), faseJ = new Float32Array(TOTAL);
    for (let j = 0; j < TOTAL; j++) {
      const a = Math.random() * Math.PI * 2;
      dirX[j] = Math.cos(a); dirY[j] = Math.sin(a) * 0.8;
      alcanceJ[j] = 0.2 + Math.random() * 0.95; faseJ[j] = Math.random();
    }
    type Amostra = { baldes: Uint16Array[]; cores: string[] };
    const amostras_: (Amostra | null)[] = new Array(N).fill(null);
    const amostrar = (i: number) => {                // lê as cores da miniatura uma única vez
      const img = cartas[i].querySelector('img') as HTMLImageElement | null;
      if (!img || !img.complete || !img.naturalWidth) return false;
      try {
        const c = document.createElement('canvas'); c.width = COLUNAS; c.height = LINHAS;
        const g = c.getContext('2d'); if (!g) return false;
        g.drawImage(img, 0, 0, COLUNAS, LINHAS);
        const d = g.getImageData(0, 0, COLUNAS, LINHAS).data;
        const listas: number[][] = Array.from({ length: 64 }, () => []);
        const soma = Array.from({ length: 64 }, () => [0, 0, 0, 0]);
        for (let j = 0; j < TOTAL; j++) {
          if (d[j * 4 + 3] < 30) continue;                       // borda transparente da miniatura
          const b = ((d[j * 4] >> 6) << 4) | ((d[j * 4 + 1] >> 6) << 2) | (d[j * 4 + 2] >> 6);
          listas[b].push(j); const s = soma[b]; s[0] += d[j * 4]; s[1] += d[j * 4 + 1]; s[2] += d[j * 4 + 2]; s[3]++;
        }
        const cores = soma.map((s) => (s[3] ? `rgb(${Math.round(s[0] / s[3])},${Math.round(s[1] / s[3])},${Math.round(s[2] / s[3])})` : '#000'));
        amostras_[i] = { baldes: listas.map((l) => Uint16Array.from(l)), cores };
        return true;
      } catch { return false; }
    };
    // prepara as cores das 12 fotos aos poucos, em momentos livres, antes de a primeira troca acontecer
    let proximaAmostra = 0;
    const prepararAmostras = () => {
      if (proximaAmostra >= N) return;
      amostrar(proximaAmostra);
      proximaAmostra++;
      window.setTimeout(prepararAmostras, 250);
    };
    const prepararTimer = window.setTimeout(prepararAmostras, 2500);

    const cvP = canvasP.current;
    const ctxP = cvP ? cvP.getContext('2d') : null;
    const comParticulas = atual === 'cheio' && !!ctxP;
    let desenhouAntes = false;
    let saltoParticulas = 1;                         // 1 = todas; 2 = metade; 3 = um terço... (se o aparelho não acompanhar)
    let lentos = 0, rapidos = 0;
    const desenharNuvens = (lista: { i: number; amp: number; rect: DOMRect }[], agora: number) => {
      if (!ctxP) return;
      if (lista.length === 0) { if (desenhouAntes) { ctxP.clearRect(0, 0, w, h); desenhouAntes = false; } return; }
      const t0 = performance.now();
      ctxP.clearRect(0, 0, w, h);
      desenhouAntes = true;
      for (const { i, amp, rect } of lista) {
        if (!amostras_[i] && !amostrar(i)) continue;
        const am = amostras_[i]!;
        const cx0 = rect.left + rect.width / 2, cy0 = rect.top + rect.height / 2;
        const alcance = rect.width * 1.15 * Math.sin(Math.min(1, amp) * Math.PI * 0.5);   // nuvem se abre e se fecha com a rolagem
        // no começo cada partícula é um quadradinho do tamanho da célula (a foto vira um mosaico completo);
        // conforme a nuvem se abre, cada uma encolhe até virar um grão fino, como as partículas do fundo
        const fino = w < 768 ? 1.1 : 1.35;
        const tamanho = fino;                        // sempre fina, do primeiro instante ao último (fagulhas minúsculas)
        ctxP.globalAlpha = suave(amp / 0.12) * (0.95 - 0.35 * amp);
        // a nuvem brilha (soma luz) em vez de escurecer a foto que aparece por baixo
        ctxP.globalCompositeOperation = 'lighter';
        const salto = saltoParticulas;
        const tam = tamanho * Math.sqrt(salto);      // se o aparelho pedir menos partículas, cada uma fica só um pouco maior
        const u0 = rect.width / COLUNAS, v0 = rect.height / LINHAS;
        const bx = cx0 - rect.width / 2 + u0 / 2, by = cy0 - rect.height / 2 + v0 / 2;
        const pisca = agora * 1.6;
        for (let b = 0; b < 64; b++) {
          const idx = am.baldes[b];
          if (!idx.length) continue;
          ctxP.fillStyle = am.cores[b];
          ctxP.beginPath();
          for (let q = 0; q < idx.length; q += salto) {
            const j = idx[q];
            const rad = alcanceJ[j] * alcance;
            const cint = Math.sin(pisca + j) * amp * 5;
            ctxP.rect(bx + (j % COLUNAS) * u0 + dirX[j] * rad + cint, by + ((j / COLUNAS) | 0) * v0 + dirY[j] * rad - amp * 36 * faseJ[j], tam, tam);
          }
          ctxP.fill();
        }
      }
      ctxP.globalAlpha = 1; ctxP.globalCompositeOperation = 'source-over';
      // se o desenho está caro, usa menos partículas; se sobra folga, volta a usar mais
      const gasto = performance.now() - t0;
      if (gasto > 9) { lentos++; rapidos = 0; if (lentos > 6 && saltoParticulas < 4) { saltoParticulas++; lentos = 0; } }
      else if (gasto < 3.5) { rapidos++; lentos = 0; if (rapidos > 90 && saltoParticulas > 1) { saltoParticulas--; rapidos = 0; } }
      else { lentos = 0; rapidos = 0; }
    };

    const posicionar = (dimTexto: number, dt: number, agora: number) => {
      const nuvens: { i: number; amp: number; rect: DOMRect }[] = [];
      const passo_ = Math.min(1, dt * 4);
      let focoMax = 0;
      for (let i = 0; i < N; i++) {
        const [a, d, r] = alvoDaCarta(i);
        pa[i] += (a - pa[i]) * passo_; dd[i] += (d - dd[i]) * passo_; rr[i] += (r - rr[i]) * passo_ * 0.5;   // a volta e o refazer são mais lentos
        const f = pa[i] * (1 - rr[i]);
        if (f > focoMax) focoMax = f;
      }
      const dim = Math.max(dimTexto, focoMax);       // texto na tela OU uma carta em foco: o miolo da frente esmaece
      // ponto de chegada: centrado na tela (compensa a inclinação do anel)
      const zFoco = rz + 30;
      const sFoco = P / (P - zFoco);
      const yFoco = ((0.06 * h) / sFoco - zFoco * 0.1736) / 0.985;
      for (let i = 0; i < N; i++) {
        const th = ((i * 360) / N + ang) * (Math.PI / 180);
        const sx = Math.sin(th), cz = Math.cos(th);
        const ox = rx * sx, oy = (i - (N - 1) / 2) * passo, oz = rz * cz;
        const k = (cz + 1) / 2;                      // 1 = na frente, 0 = atrás
        const luz = 0.1 + 0.9 * Math.pow(k, 1.4);
        const f = pa[i] * (1 - rr[i]);               // 0 = na órbita, 1 = no centro da frente
        const x = ox * (1 - f), y = oy + (yFoco - oy) * f;
        // no centro, as cartas de capítulos anteriores ficam um pouco mais à frente: a nova chega por trás delas
        const z = oz + (zFoco - oz) * f + (N - i) * 2 * f;
        const el = cartas[i];
        // no celular o anel é pequeno: a carta em foco cresce mais ao chegar, para o voo ser bem visível
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${(1 + (w < 768 ? 0.5 : 0.08) * f).toFixed(3)})`;
        // as outras cartas esmaecem no miolo (atrás do texto, ou onde a carta em foco está); a carta em foco acende
        const miolo = Math.exp(-Math.pow(ox / (w * 0.24), 2));
        const base = luz * (1 - 0.88 * dim * miolo);
        const desfeita = dd[i] * (1 - rr[i]);        // 0 = inteira, 1 = totalmente desfeita em partículas
        if (desfeita > 0.015) {
          // a foto vira nuvem de partículas finas (desenhadas no canvas de cima); nos aparelhos simples, só esmaece
          // a foto inteira some aos poucos, enquanto o mosaico de partículas aparece por cima (sem corte brusco)
          el.style.opacity = String((base + (1 - base) * f) * (1 - suave(desfeita / (comParticulas ? 0.45 : 1))));
          if (comParticulas) nuvens.push({ i, amp: desfeita, rect: el.getBoundingClientRect() });
        } else {
          el.style.opacity = String(base + (1 - base) * f);
        }
      }
      if (ctxP) desenharNuvens(nuvens, agora);
    };
    posicionar(0, 0.016, 0);

    if (atual === 'estatico' || !ctx) return () => undefined;

    const parts: Particula[] = [];
    let ultimo = performance.now();
    let acumulador = 0;
    let raf = 0;
    const amostras: number[] = [];
    let medindo = true;

    const gerar = (x: number, y: number, vx: number, vy: number) => {
      const max = 1.6 + Math.random() * 2.2;
      parts.push({ x, y, vx, vy, vida: max, max, t: Math.random() < 0.5 ? 1 : 2 });
    };

    const desenhar = (t: number, e: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const cx = w / 2;
      const bw = Math.max(54, w * 0.1);

      // halo largo e suave
      let g = ctx.createLinearGradient(cx - bw * 4, 0, cx + bw * 4, 0);
      g.addColorStop(0, 'rgba(255,170,70,0)');
      g.addColorStop(0.5, `rgba(255,190,100,${0.1 * e})`);
      g.addColorStop(1, 'rgba(255,170,70,0)');
      ctx.fillStyle = g; ctx.fillRect(cx - bw * 4, 0, bw * 8, h);

      // núcleo do feixe
      g = ctx.createLinearGradient(cx - bw, 0, cx + bw, 0);
      g.addColorStop(0, 'rgba(255,190,100,0)');
      g.addColorStop(0.38, `rgba(255,205,130,${0.2 * e})`);
      g.addColorStop(0.5, `rgba(255,248,230,${0.85 * e})`);
      g.addColorStop(0.62, `rgba(255,205,130,${0.2 * e})`);
      g.addColorStop(1, 'rgba(255,190,100,0)');
      ctx.fillStyle = g; ctx.fillRect(cx - bw, 0, bw * 2, h);

      // fios ondulando: a sensação de energia
      ctx.lineWidth = 1.2;
      for (let s = 0; s < 5; s++) {
        ctx.beginPath();
        for (let y = 0; y <= h; y += 22) {
          const x = cx + Math.sin(y * 0.011 + t * 1.3 + s * 1.7) * bw * 0.6 * (0.45 + 0.55 * Math.sin(t * 0.7 + s));
          if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,226,170,${0.34 * e})`;
        ctx.stroke();
      }

      // partículas: nascem no feixe e nos retratos da frente
      const taxa = (w < 768 ? 38 : 85) * e;
      acumulador += taxa * dt;
      const max = w < 768 ? 110 : 220;
      while (acumulador >= 1 && parts.length < max) {
        acumulador -= 1;
        if (Math.random() < 0.55) {
          const lado = Math.random() < 0.5 ? -1 : 1;
          gerar(cx + (Math.random() - 0.5) * bw, Math.random() * h, lado * (15 + Math.random() * 55), -(20 + Math.random() * 70));
        } else {
          const i = Math.floor(Math.random() * N);
          const th = ((i * 360) / N + ang) * (Math.PI / 180);
          const c = Math.cos(th);
          if (c > 0.25) {
            const s = P / (P - rz * c);
            gerar(cx + rx * Math.sin(th) * s, h * 0.42 + (i - (N - 1) / 2) * passo * s, (Math.random() - 0.5) * 50, (Math.random() - 0.7) * 40);
          }
        }
      }
      acumulador = Math.min(acumulador, 3);

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vida -= dt;
        if (p.vida <= 0) { parts.splice(i, 1); continue; }
        // colisões simuladas: bate nas bordas e é lançada para outro lado ao cruzar o feixe
        if (Math.abs(p.x - cx) < bw * 0.45 && Math.random() < 0.04) { p.vx = -p.vx * 1.3 + (Math.random() - 0.5) * 60; p.vy += (Math.random() - 0.5) * 50; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0 || p.x > w) p.vx = -p.vx;
        if (p.y < 0 || p.y > h) { p.vy = -p.vy * 0.6; }
        const a = Math.min(1, p.vida / p.max * 1.4) * 0.9 * e;
        ctx.fillStyle = `rgba(255,${215 + (p.t * 10)},150,${a})`;
        const r = p.t === 1 ? 1.4 : 2.2;
        ctx.fillRect(p.x - r / 2, p.y - r / 2, r, r);
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const quadro = (agora: number) => {
      raf = requestAnimationFrame(quadro);
      if (document.hidden) { ultimo = agora; return; }
      const dt = Math.min(0.05, (agora - ultimo) / 1000);
      ultimo = agora;
      ang = (ang + velocidade * dt) % 360;           // o anel nunca para de girar

      // se um capítulo cobre a tela, não gasta bateria desenhando atrás dele
      if (estado.cobertos.size > 0) return;

      const dim = nivelTexto();
      const e = 1 - 0.85 * dim;
      posicionar(dim, dt, agora / 1000);

      if (atual === 'cheio') {
        desenhar(agora / 1000, e, dt);
        // aparelho que não segura 42 quadros por segundo cai para a versão simples
        if (medindo) {
          amostras.push(dt);
          if (amostras.length >= 120) {
            medindo = false;
            const media = amostras.reduce((a, b) => a + b, 0) / amostras.length;
            if (1 / media < 42) {
              atual = 'simples';
              setNivel('simples');
              ctx.clearRect(0, 0, w, h);
              try { sessionStorage.setItem('jr-nivel', 'simples'); } catch { /* sem storage */ }
            }
          }
        }
      }
    };
    raf = requestAnimationFrame(quadro);

    // A barra de endereço do celular aparece e some ao rolar e dispara "resize" toda hora.
    // Refazer o canvas a cada vez causava tremor nas trocas de tela: só mede de novo se a largura
    // mudou ou se a altura mudou bastante (giro do aparelho), e com atraso.
    let ultimaLargura = window.innerWidth, ultimaAltura = window.innerHeight, atraso = 0;
    const aoRedimensionar = () => {
      window.clearTimeout(atraso);
      atraso = window.setTimeout(() => {
        if (window.innerWidth !== ultimaLargura || Math.abs(window.innerHeight - ultimaAltura) > 200) {
          ultimaLargura = window.innerWidth; ultimaAltura = window.innerHeight;
          medir();
        }
      }, 250);
    };
    window.addEventListener('resize', aoRedimensionar);
    // as posições dos capítulos podem mudar um pouco depois que fontes e imagens chegam: mede de novo
    const remedir = window.setTimeout(medir, 1500);
    window.addEventListener('load', medir);
    return () => {
      cancelAnimationFrame(raf); window.clearTimeout(atraso); window.clearTimeout(remedir); window.clearTimeout(prepararTimer);
      window.removeEventListener('resize', aoRedimensionar); window.removeEventListener('load', medir);
    };
  }, []);

  return (
    <div className={`jr-fundo-fixo jr-nivel-${nivel}`} aria-hidden="true">
      <div className="jr-feixe-css" />
      <canvas ref={canvas} className="jr-canvas" />
      <div className="jr-orbita">
        <div className="jr-anel" ref={anel}>
          {MINIATURAS.map((src) => (
            <div key={src} className="jr-carta">
              <img src={src} alt="" width={400} height={528} decoding="async" />
            </div>
          ))}
        </div>
      </div>
      <canvas ref={canvasP} className="jr-canvas" />
    </div>
  );
};
