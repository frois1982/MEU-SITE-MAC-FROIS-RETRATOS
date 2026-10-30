import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { CENAS_NA_RODA, TRIADES, CenaJornada, infoArquetipo } from '../data/jornada';
import seo from '../data/home-seo.json';
// O fundo animado e o cursor chegam logo depois da primeira pintura: o texto de abertura não espera por eles.
const Fundo = lazy(() => import('../components/jornada/Fundo').then((m) => ({ default: m.Fundo })));
const CursorJornada = lazy(() => import('../components/jornada/Cursor').then((m) => ({ default: m.CursorJornada })));
import { estado } from '../components/jornada/estado';
import { alternarSom, clique } from '../components/jornada/somCarga';
import './jornada.css';

const ELA = 'Retrato corporativo de uma mulher de cabelo longo, em estúdio';
const ELE = 'Retrato corporativo de um homem de barba, em estúdio';
// Fotos do site (public/retratos), uma de cada, alternando ela e ele.
const RETRATOS_RECENTES = [
  ['ela-2582', ELA], ['ele-2788', ELE], ['ela-2615', ELA], ['ele-2781', ELE], ['ela-2670', ELA],
  ['ele-2805', ELE], ['ela-2709', ELA], ['ele-2825', ELE], ['ela-2742', ELA], ['ele-2873', ELE],
].map(([arquivo, alt]) => ({ arquivo, alt }));

const reduzido = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reenquadramento: desce a foto; em foto que enche a altura, o vão que sobra no topo ganha um degradê escuro.
const estiloDescer = (n: number | undefined, caber: boolean): React.CSSProperties | undefined =>
  n ? ({ ['--desce' as any]: `${n}svh`, ['--tem-desce' as any]: caber ? 0 : 1 } as React.CSSProperties) : undefined;

const Cena: React.FC<{ cena: CenaJornada; numero: number }> = ({ cena, numero }) => {
  const trilho = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const movimento = !reduzido();
    let raf = 0;
    let tocou = false;
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
      // Um único clique por cena, quando o título começa a ser revelado.
      if (!tocou && atual > 0.34) { clique(); tocou = true; }
      else if (tocou && atual < 0.2) tocou = false;
      publicar();
      if (atual !== alvo) raf = requestAnimationFrame(quadro);
    };
    // Avisa o fundo: se esta cena cobre a tela (ele para de desenhar) e quanto texto está aparecendo (ele escurece).
    const publicar = () => {
      const r = el.getBoundingClientRect();
      const cobre = r.top <= 0 && r.bottom >= window.innerHeight;
      if (cobre) estado.cobertos.add(cena.id); else estado.cobertos.delete(cena.id);
      const visivel = r.bottom > 0 && r.top < window.innerHeight;
      // borda em degradê enquanto uma extremidade da cena está à vista (passagem entre cenas)
      const vh = window.innerHeight;
      const passando = visivel && !cobre;
      el.classList.toggle('jr-bordas', passando);
      if (passando) {
        const L = vh * 0.24;
        el.style.setProperty('--ft', `${Math.max(0, Math.min(L, r.top)).toFixed(0)}px`);
        el.style.setProperty('--fb', `${Math.max(0, Math.min(L, vh - r.bottom)).toFixed(0)}px`);
      }
      // camadas pesadas só enquanto a cena está perto da tela
      el.classList.toggle('jr-ativa', r.bottom > -window.innerHeight * 0.5 && r.top < window.innerHeight * 1.5);
      const s = (x: number) => Math.min(1, Math.max(0, x));
      estado.texto.set(cena.id, visivel ? s((atual - 0.3) / 0.2) * (1 - s((atual - 0.97) / 0.03)) : 0);
    };
    const atualizar = () => {
      medir();
      publicar();
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
      estado.cobertos.delete(cena.id);
      estado.texto.delete(cena.id);
    };
  }, []);

  const info = infoArquetipo(cena.id);
  const t = (n: number) => ({ ['--t' as any]: n } as React.CSSProperties);

  return (
    <section ref={trilho} className={`jr-trilho${cena.cor === 'revela' ? ' jr-revela' : cena.cor ? ' jr-cor' : ''}`} aria-labelledby={`cena-${cena.id}`} style={{ ['--fx' as any]: cena.foco[0], ['--fy' as any]: cena.foco[1] }}>
      <div ref={palco} className="jr-palco" data-cursor data-rotulo="Ver">
        <div className="jr-barra" />

        <div className={`jr-camada jr-rosto${cena.ajuste?.rosto ? ' jr-caber' : ''}`}
             style={estiloDescer(cena.descer?.rosto, !!cena.ajuste?.rosto)}>
          {cena.ajuste?.rosto && <img src={cena.fotoRosto} alt="" aria-hidden="true" className="jr-desfoque" loading="lazy" decoding="async" />}
          <img src={cena.fotoRosto} alt={cena.altRosto} className="jr-principal" loading="lazy" decoding="async" style={{ objectPosition: cena.posRosto }} />
        </div>

        <div className={`jr-camada jr-caminho${cena.ajuste?.caminho ? ' jr-caber' : ''}`} aria-hidden="true"
             style={estiloDescer(cena.descer?.caminho, !!cena.ajuste?.caminho)}>
          {cena.ajuste?.caminho && <img src={cena.fotoCaminho} alt="" className="jr-desfoque" loading="lazy" decoding="async" />}
          <img src={cena.fotoCaminho} alt={cena.altCaminho} className="jr-principal" loading="lazy" decoding="async" style={{ objectPosition: cena.posCaminho }} />
        </div>

        <div className="jr-camada jr-vinheta" />

        <div className="jr-etiqueta">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500">Capítulo {numero} · {info.triade}</p>
          <p className="mt-3 text-xs text-zinc-400 tracking-[0.2em] uppercase jr-pulso">role para seguir o caminho</p>
        </div>

        <div className="jr-texto">
          <div className="max-w-xl mx-auto text-center">
            <p className="jr-in jr-rotulo" style={t(0.22)}>Busca: {info.motivacao}</p>
            <h2 id={`cena-${cena.id}`} className="jr-in jr-titulo" style={t(0.26)}>
              {cena.arquetipo.split(' ')[0]} <em>{cena.arquetipo.split(' ').slice(1).join(' ')}</em>
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
  const [longeDoTopo, setLongeDoTopo] = useState(false);
  const [longeDoFim, setLongeDoFim] = useState(true);

  // Salto rápido: sem rolar a página inteira (são doze cenas). Muda o estado só quando cruza o limite.
  useEffect(() => {
    const ver = () => {
      const topo = window.scrollY > window.innerHeight * 0.5;
      const convite = document.getElementById('convite');
      const fim = !convite || convite.getBoundingClientRect().top > window.innerHeight * 0.4;
      setLongeDoTopo((a) => (a === topo ? a : topo));
      setLongeDoFim((a) => (a === fim ? a : fim));
    };
    ver();
    window.addEventListener('scroll', ver, { passive: true });
    return () => window.removeEventListener('scroll', ver);
  }, []);
  const irAoInicio = () => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  const irAoFim = () => {
    const convite = document.getElementById('convite');
    if (convite) window.scrollTo({ top: convite.getBoundingClientRect().top + window.scrollY - 40, behavior: 'instant' as ScrollBehavior });
  };

  useEffect(() => {
    const anterior = document.title;
    // A Jornada é a página inicial: mantém o título e a descrição de busca da home de sempre.
    document.title = 'Mac Frois | Fotografo de Retratos Corporativos em Florianopolis';
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://www.macfrois.com.br/');

    // Na abertura há texto na tela: o feixe fica mais discreto para a leitura ser tranquila.
    const hero = document.querySelector('.jr-hero');
    const marcarHero = () => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      estado.texto.set('hero', 0.8 * Math.min(1, Math.max(0, r.bottom / (window.innerHeight * 0.6))));
    };
    marcarHero();
    window.addEventListener('scroll', marcarHero, { passive: true });

    // O mesmo clique suave do título toca também quando o visitante clica (mouse) ou toca (celular).
    // "click" não dispara quando a pessoa só rola a tela, então não há barulho na rolagem.
    const aoClicarNaPagina = () => clique(true);
    window.addEventListener('click', aoClicarNaPagina);
    return () => {
      document.title = anterior;
      window.removeEventListener('scroll', marcarHero);
      window.removeEventListener('click', aoClicarNaPagina);
      estado.texto.delete('hero');
    };
  }, []);

  return (
    <main className="jr-root">
      <Suspense fallback={null}>
        <Fundo />
        <CursorJornada />
      </Suspense>

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

      <div className="jr-setas">
        <button type="button" onClick={irAoInicio} aria-label="Voltar ao início da jornada" title="Início"
          className={longeDoTopo ? '' : 'jr-seta-oculta'} tabIndex={longeDoTopo ? 0 : -1}>
          <ChevronUp size={18} />
        </button>
        <button type="button" onClick={irAoFim} aria-label="Ir ao fim da jornada" title="Fim"
          className={longeDoFim ? '' : 'jr-seta-oculta'} tabIndex={longeDoFim ? 0 : -1}>
          <ChevronDown size={18} />
        </button>
      </div>

      <header className="jr-hero">
        <div className="jr-hero-texto relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500">{seo.eyebrow}</p>
          <h1 className="mt-6 text-3xl sm:text-5xl text-white leading-tight">{seo.h1}</h1>
          <p className="mt-6 text-sm sm:text-base text-zinc-100 leading-relaxed">{seo.intro}</p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
            {seo.links.map((l, i) => (
              <React.Fragment key={l.to}>
                {i > 0 && <span className="text-zinc-600"> · </span>}
                <Link to={l.to} className="underline underline-offset-4 hover:text-gold-400">{l.label}</Link>
              </React.Fragment>
            ))}
          </p>
          <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-zinc-500 jr-pulso">{seo.rolar}</p>
        </div>
      </header>

      {CENAS_NA_RODA.map((c, i) => (
        <React.Fragment key={c.id}>
          {/* Intervalo: o texto some e o feixe e os retratos voltam a aparecer, antes do próximo capítulo */}
          <div className="jr-intervalo">
            <p>{i === 0 ? 'Começa por aqui' : 'Próximo'}<strong>{c.arquetipo}</strong></p>
          </div>
          <Cena cena={c} numero={i + 1} />
        </React.Fragment>
      ))}
      <div className="jr-intervalo" />

      <section className="relative px-6 py-24 bg-zinc-950 border-t border-zinc-900" aria-labelledby="roda">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold-500">A roda</p>
          <h2 id="roda" className="jr-titulo !text-3xl sm:!text-5xl text-center">Doze arquétipos, <em>quatro</em> desejos</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {TRIADES.map((tri) => (
              <div key={tri.id} className="border border-zinc-800 p-6">
                <h3 className="text-[11px] tracking-[0.3em] text-gold-400">{tri.nome}</h3>
                <ul className="mt-4 space-y-2">
                  {tri.arquetipos.map((a) => {
                    const pronto = CENAS_NA_RODA.some((c) => c.id === a.id);
                    return (
                      <li key={a.id} className={`flex justify-between text-sm ${pronto ? 'text-white' : 'text-zinc-600'}`}>
                        <span>{a.nome}<small className="block text-[10px] text-zinc-500">ex.: {(seo.marcas as Record<string, string>)[a.id]}</small></span>
                        <span className="text-xs">{pronto ? a.motivacao : 'em breve'}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24 bg-black border-t border-zinc-900" aria-labelledby="arquetipos-o-que-sao">
        <div className="max-w-2xl mx-auto">
          <h2 id="arquetipos-o-que-sao" className="jr-titulo !text-3xl sm:!text-4xl text-center">{seo.arquetipos.h2}</h2>
          <p className="mt-8 text-sm sm:text-base text-zinc-300 leading-relaxed">{seo.arquetipos.abertura}</p>
          {seo.arquetipos.blocos.map((b) => (
            <div key={b.h3} className="mt-10">
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-400">{b.h3}</h3>
              <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">{b.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative px-6 py-24 bg-zinc-950 border-t border-zinc-900" aria-labelledby="retratos-recentes">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500 text-center">Trabalhos recentes</p>
          <h2 id="retratos-recentes" className="mt-5 jr-titulo !text-3xl sm:!text-4xl text-center">Retratos feitos no estúdio</h2>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {RETRATOS_RECENTES.map((r) => (
              <Link key={r.arquivo} to="/portfolio" className="block overflow-hidden rounded-sm border border-zinc-900 bg-zinc-900 aspect-[2/3]">
                <img
                  src={`/retratos/${r.arquivo}-w_800.jpg`}
                  srcSet={`/retratos/${r.arquivo}-w_480.jpg 480w, /retratos/${r.arquivo}-w_800.jpg 800w`}
                  sizes="(min-width: 768px) 20vw, 50vw"
                  alt={r.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/portfolio" className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 hover:text-gold-400 underline underline-offset-8">
              Ver o portfólio completo
            </Link>
          </div>
        </div>
      </section>

      <section id="convite" className="relative px-6 py-28 text-center bg-zinc-950">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold-500">{seo.convite.rotulo}</p>
          <h2 className="mt-5 text-2xl sm:text-3xl text-white">{seo.convite.h2}</h2>
          <p className="mt-5 text-sm text-zinc-400 leading-relaxed">{seo.convite.texto}</p>
          <a
            href={seo.convite.quiz}
            onClick={() => clique()}
            className="mt-10 inline-flex items-center gap-3 bg-gold-600 hover:bg-gold-500 text-black px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-semibold transition-colors"
          >
            {seo.convite.botao}
          </a>
          <p className="mt-4 text-[11px] text-zinc-500 leading-relaxed">{seo.convite.aviso}</p>
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
