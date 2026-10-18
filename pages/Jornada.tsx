import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { CENAS, WHATSAPP_JORNADA, CenaJornada } from '../data/jornada';
import { CursorJornada } from '../components/jornada/Cursor';
import { SIMBOLOS, EstradaProvisoria } from '../components/jornada/Simbolos';
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
    let alvo = 0;   // onde a rolagem está
    let atual = 0;  // o que aparece na tela: persegue o alvo com inércia (efeito "desliza")

    const medir = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      alvo = Math.min(1, Math.max(0, -r.top / total));
    };
    const quadro = () => {
      raf = 0;
      atual += (alvo - atual) * 0.09;
      if (Math.abs(alvo - atual) < 0.0004) atual = alvo;
      el.style.setProperty('--p', atual.toFixed(4));
      const d = atual > 0.74 ? 3 : atual > 0.62 ? 2 : atual > 0.5 ? 1 : atual > 0.3 ? 0 : -1;
      if (d !== degrau) { if (degrau !== -1 || d > -1) clique(); degrau = d; }
      if (atual !== alvo) raf = requestAnimationFrame(quadro);
    };
    const atualizar = () => {
      medir();
      if (!movimento) return;
      if (!raf) raf = requestAnimationFrame(quadro);
    };
    const aoRolar = atualizar;

    // Clicar na cena leva direto ao próximo momento (rosto, texto, fim).
    const momentos = [0, 0.5, 0.78, 1];
    const aoClicar = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button')) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const topo = window.scrollY + r.top;
      const proximo = momentos.find((m) => m > alvo + 0.04);
      if (proximo === undefined) return;
      clique();
      window.scrollTo({ top: topo + total * proximo, behavior: 'smooth' });
    };
    if (movimento) el.addEventListener('click', aoClicar);

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
      el.removeEventListener('click', aoClicar);
    };
  }, []);

  const t = (n: number) => ({ ['--t' as any]: n } as React.CSSProperties);

  return (
    <section ref={trilho} className="jr-trilho" aria-labelledby={`cena-${cena.id}`} style={{ ['--fx' as any]: cena.foco[0], ['--fy' as any]: cena.foco[1] }}>
      <div ref={palco} className="jr-palco" data-cursor data-rotulo="Ver">
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

        {cena.simbolos.map((s, i) => {
          const Simbolo = SIMBOLOS[s];
          return <div key={s} className={`jr-simbolo jr-s${i + 1}`}><Simbolo /></div>;
        })}

        <div className="jr-etiqueta">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500">Capítulo {numero} · Arquétipo</p>
          <p className="mt-3 text-xs text-zinc-400 tracking-[0.2em] uppercase jr-pulso">role para seguir o caminho</p>
        </div>

        <div className="jr-texto">
          <div className="max-w-xl mx-auto text-center">
            <p className="jr-in jr-rotulo" style={t(0.22)}>Arquétipo</p>
            <h2 id={`cena-${cena.id}`} className="jr-in jr-titulo" style={t(0.26)}>
              O <em>{cena.arquetipo.replace(/^O\s+/, '')}</em>
            </h2>
            <p className="jr-in jr-lema" style={t(0.3)}>{cena.lema.join(' · ')}</p>
            <p className="jr-in jr-frase" style={t(0.36)}>{cena.frase}</p>
            <div className="mt-6 space-y-3">
              {cena.linhas.map((l, i) => (
                <p key={i} className="jr-in jr-corpo" style={t(0.46 + i * 0.12)}>{l}</p>
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
    const fonte = document.createElement('link');
    fonte.rel = 'stylesheet';
    fonte.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap';
    document.head.appendChild(fonte);
    return () => { document.title = anterior; fonte.remove(); };
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
