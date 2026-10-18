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

    let w = 0, h = 0, dpr = 1, raio = 230, cw = 118, passo = 20;
    const medir = () => {
      w = window.innerWidth; h = window.innerHeight;
      const largo = w >= 768;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      raio = largo ? 380 : 230; cw = largo ? 190 : 118; passo = largo ? 30 : 20;
      ringEl.style.setProperty('--cw', `${cw}px`);
    };
    medir();

    let ang = 0;                 // graus: o anel nunca fica parado
    const velocidade = 4;        // graus por segundo
    const P = 1100;              // perspectiva (px), igual ao CSS

    const posicionar = (dimTexto: number) => {
      for (let i = 0; i < cartas.length; i++) {
        const th = i * 30 + ang;
        const c = Math.cos((th * Math.PI) / 180);
        const k = (c + 1) / 2;                       // 1 = na frente, 0 = atrás
        const luz = 0.1 + 0.9 * Math.pow(k, 1.4);
        const el = cartas[i];
        // a carta sempre olha para a tela (billboard): gira em volta e desgira em si mesma
        el.style.transform =
          `rotateY(${th}deg) translateZ(${raio}px) translateY(${(i - 5.5) * passo}px) rotateY(${-th}deg)`;
        el.style.opacity = String(luz * (1 - 0.6 * dimTexto));
        (el.lastElementChild as HTMLElement).style.opacity = String(0.65 * (1 - k)); // sombra: mais escura atrás
      }
    };
    posicionar(0);

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
      const bw = Math.max(46, w * 0.085);

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
          const i = Math.floor(Math.random() * cartas.length);
          const th = (i * 30 + ang) * Math.PI / 180;
          const c = Math.cos(th);
          if (c > 0.25) {
            const s = P / (P - raio * c);
            gerar(cx + raio * Math.sin(th) * s, h * 0.42 + (i - 5.5) * passo * s, (Math.random() - 0.5) * 50, (Math.random() - 0.7) * 40);
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
      ang = (ang + velocidade * dt) % 360;

      // se um capítulo cobre a tela, não gasta bateria desenhando atrás dele
      if (estado.cobertos.size > 0) return;

      const dim = nivelTexto();
      const e = 1 - 0.85 * dim;
      posicionar(dim);

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
    return () => { cancelAnimationFrame(raf); window.clearTimeout(atraso); window.removeEventListener('resize', aoRedimensionar); };
  }, []);

  return (
    <div className={`jr-fundo-fixo jr-nivel-${nivel}`} aria-hidden="true">
      <div className="jr-feixe-css" />
      <canvas ref={canvas} className="jr-canvas" />
      <div className="jr-orbita">
        <div className="jr-anel" ref={anel}>
          {MINIATURAS.map((src) => (
            <div key={src} className="jr-carta">
              <img src={src} alt="" width={220} height={290} decoding="async" />
              <div className="jr-sombra" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
