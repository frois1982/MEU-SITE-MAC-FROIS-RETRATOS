import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { CENAS, WHATSAPP_JORNADA, CenaJornada } from '../data/jornada';
import { CursorJornada } from '../components/jornada/Cursor';
import { CorrenteQuebrada, Chama, Raio, EstradaProvisoria } from '../components/jornada/Simbolos';
import { alternarSom, clique } from '../components/jornada/som';
import './jornada.css';

const reduzido = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Cena: React.FC<{ cena: CenaJornada; numero: number }> = ({ cena, numero }) => {
  const trilho = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const movimento = !reduzido();
    let raf = 0;
    let degrau = -1;

    const atualizar = () => {
      raf = 0;
      if (!movimento) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      el.style.setProperty('--p', p.toFixed(4));
      const d = p > 0.74 ? 3 : p > 0.62 ? 2 : p > 0.5 ? 1 : p > 0.3 ? 0 : -1;
      if (d !== degrau) { if (degrau !== -1 || d > -1) clique(); degrau = d; }
    };
    const aoRolar = () => { if (!raf) raf = requestAnimationFrame(atualizar); };

    // Paralaxe com o mouse (só onde existe mouse).
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches && movimento;
    const aoMover = (e: PointerEvent) => {
      el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };

    atualizar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    if (mouse) window.addEventListener('pointermove', aoMover, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      window.removeEventListener('pointermove', aoMover);
    };
  }, []);

  const t = (n: number) => ({ ['--t' as any]: n } as React.CSSProperties);

  return (
    <section ref={trilho} className="jr-trilho" aria-labelledby={`cena-${cena.id}`} style={{ ['--fx' as any]: cena.foco[0], ['--fy' as any]: cena.foco[1] }}>
      <div ref={palco} className="jr-palco">
        <div className="jr-barra" />

        <div className="jr-camada jr-rosto">
          <img src={cena.fotoRosto} alt={cena.altRosto} loading="lazy" decoding="async" style={{ objectPosition: cena.posRosto }} />
        </div>

        <div className="jr-camada jr-caminho" aria-hidden="true">
          {cena.fotoCaminho
            ? <img src={cena.fotoCaminho} alt="" loading="lazy" decoding="async" style={{ objectPosition: cena.posCaminho }} />
            : <EstradaProvisoria className="jr-fundo" />}
        </div>

        <div className="jr-camada jr-vinheta" />

        <div className="jr-simbolo jr-s1"><CorrenteQuebrada /></div>
        <div className="jr-simbolo jr-s2"><Chama /></div>
        <div className="jr-simbolo jr-s3"><Raio /></div>

        <div className="jr-etiqueta">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500">Capítulo {numero} · Arquétipo</p>
          <p className="mt-3 text-xs text-zinc-400 tracking-[0.2em] uppercase jr-pulso">role para seguir o caminho</p>
        </div>

        <div className="jr-texto">
          <div className="max-w-xl mx-auto">
            <h2 id={`cena-${cena.id}`} className="jr-in text-4xl sm:text-5xl text-white leading-tight" style={t(0.3)}>
              {cena.arquetipo}
            </h2>
            <p className="jr-in mt-3 font-serif text-gold-400 text-sm sm:text-base tracking-[0.2em] uppercase" style={t(0.36)}>
              {cena.frase}
            </p>
            <div className="mt-5 space-y-3">
              {cena.linhas.map((l, i) => (
                <p key={i} className="jr-in text-sm sm:text-base text-zinc-200 leading-relaxed" style={t(0.5 + i * 0.12)}>{l}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Jornada: React.FC = () => {
  const [som, setSom] = useState(false);

  useEffect(() => {
    const anterior = document.title;
    document.title = 'Jornada dos Arquétipos | Mac Frois — Retratos que contam quem você é';
    return () => { document.title = anterior; };
  }, []);

  return (
    <main className="jr-root">
      <CursorJornada />

      <button
        type="button"
        onClick={async () => setSom(await alternarSom())}
        aria-pressed={som}
        aria-label={som ? 'Desligar som' : 'Ligar som'}
        className="fixed left-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/80 backdrop-blur px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-zinc-300 hover:text-gold-400 hover:border-gold-500 transition-colors"
      >
        {som ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>{som ? 'Som ligado' : 'Som desligado'}</span>
      </button>

      <header className="jr-hero">
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500">Método Frois</p>
          <h1 className="mt-6 text-3xl sm:text-5xl text-white leading-tight">
            Antes da câmera, existe uma história
          </h1>
          <p className="mt-6 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Todo retrato que eu faço começa por uma pergunta: que arquétipo você carrega?
            Siga a trilha e veja como a estratégia vem primeiro, e a câmera depois.
          </p>
          <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-zinc-500 jr-pulso">role para começar</p>
        </div>
      </header>

      {CENAS.map((c, i) => <Cena key={c.id} cena={c} numero={i + 1} />)}

      <section className="px-6 py-28 text-center bg-zinc-950">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500">Capítulos seguintes</p>
          <h2 className="mt-5 text-2xl sm:text-3xl text-white">Existem 12 arquétipos. Qual é o seu?</h2>
          <p className="mt-5 text-sm text-zinc-400 leading-relaxed">
            Descobrir isso é o primeiro passo do dossiê estratégico que antecede cada sessão.
          </p>
          <a
            href={WHATSAPP_JORNADA}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => clique()}
            className="mt-10 inline-flex items-center gap-3 bg-gold-600 hover:bg-gold-500 text-black px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-semibold transition-colors"
          >
            <MessageCircle size={18} /> Falar com o Mac no WhatsApp
          </a>
          <div className="mt-8">
            <Link to="/servicos" className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 hover:text-gold-400 underline underline-offset-8">
              Ver os projetos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
