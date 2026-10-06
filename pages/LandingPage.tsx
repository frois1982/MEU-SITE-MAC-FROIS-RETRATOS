import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';

// Página de destino genérica, guiada por data/paginas/*.json.
// O mesmo JSON alimenta o prerender (scripts/prerender.cjs), para o Google ler o texto sem JavaScript.

export type Pacote = { nome: string; frase: string; preco: number | null; rotulo: string; destaque: boolean; itens: string[] };
export type Secao = { h2: string; paragrafos?: string[]; lista?: string[] };
export type Praia = { id: string; nome: string; h: string; p: string[]; link?: string };
export type PaginaData = {
  rota: string; tema: 'warm' | 'mono' | 'dark'; title: string; description: string; kicker: string; h1: string; intro: string;
  whatsapp: string; pagina: string; galeriaLegenda?: string; galeria: { src: string; alt: string }[]; secoes: Secao[]; praias?: Praia[];
  pacotesTitulo: string; pacotesSub: string; pacotes: Pacote[]; extras: string[];
  links: { to: string; label: string }[]; faq: { q: string; a: string }[];
};

const T = {
  warm: {
    page: 'bg-[#FBF6EE] text-[#3A2A22]', hero: 'bg-[#3A2A22] text-[#FBF6EE]', kicker: 'text-[#E0A58F]', rule: 'bg-[#E0A58F]',
    introText: 'text-[#E8DAC8]', accent: 'text-[#B5573A]', muted: 'text-[#6B5648]', card: 'bg-white border border-[#EADFCF]',
    cardBody: 'text-[#4a382e]', cta: 'bg-[#E0A58F] text-[#3A2A22] hover:bg-[#f0b9a4]', ghost: 'border border-[#E0A58F] text-[#E0A58F] hover:bg-[#E0A58F] hover:text-[#3A2A22]',
    pkgHi: 'border-2 border-[#B5573A] shadow-lg', badge: 'bg-[#B5573A] text-white', price: 'text-[#B5573A]', check: 'text-[#B5573A]',
    pkgBtn: 'bg-[#B5573A] text-white hover:bg-[#9c472d]', pkgBtnOff: 'border border-[#B5573A] text-[#B5573A] hover:bg-[#B5573A] hover:text-white',
    img: 'bg-[#EADFCF]', final: 'bg-[#B5573A] text-white hover:bg-[#9c472d]',
  },
  mono: {
    page: 'bg-[#F5F5F3] text-[#1a1a1a]', hero: 'bg-[#0d0d0d] text-[#F5F5F3]', kicker: 'text-[#bdbdbd]', rule: 'bg-[#bdbdbd]',
    introText: 'text-[#d6d6d6]', accent: 'text-[#1a1a1a]', muted: 'text-[#5c5c5c]', card: 'bg-white border border-[#dcdcd8]',
    cardBody: 'text-[#333]', cta: 'bg-white text-[#0d0d0d] hover:bg-[#e6e6e6]', ghost: 'border border-white text-white hover:bg-white hover:text-[#0d0d0d]',
    pkgHi: 'border-2 border-[#0d0d0d] shadow-lg', badge: 'bg-[#0d0d0d] text-white', price: 'text-[#0d0d0d]', check: 'text-[#0d0d0d]',
    pkgBtn: 'bg-[#0d0d0d] text-white hover:bg-[#333]', pkgBtnOff: 'border border-[#0d0d0d] text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white',
    img: 'bg-[#dcdcd8]', final: 'bg-[#0d0d0d] text-white hover:bg-[#333]',
  },
  dark: {
    page: 'bg-zinc-950 text-zinc-100', hero: 'bg-zinc-950 text-zinc-100', kicker: 'text-gold-500', rule: 'bg-gold-500',
    introText: 'text-zinc-400', accent: 'text-gold-500', muted: 'text-zinc-400', card: 'bg-zinc-900 border border-zinc-800',
    cardBody: 'text-zinc-300', cta: 'bg-gold-600 text-zinc-950 hover:bg-gold-500', ghost: 'border border-gold-600 text-gold-500 hover:bg-gold-600 hover:text-zinc-950',
    pkgHi: 'border-2 border-gold-600 shadow-lg', badge: 'bg-gold-600 text-zinc-950', price: 'text-gold-500', check: 'text-gold-500',
    pkgBtn: 'bg-gold-600 text-zinc-950 hover:bg-gold-500', pkgBtnOff: 'border border-gold-600 text-gold-500 hover:bg-gold-600 hover:text-zinc-950',
    img: 'bg-zinc-800', final: 'bg-gold-600 text-zinc-950 hover:bg-gold-500',
  },
} as const;

const wa = (pagina: string, assunto: string) =>
  'https://wa.me/5548996231894?text=' + encodeURIComponent(`Olá Mac, vi a página de ${pagina} e gostaria de saber mais sobre ${assunto}.`);

export const LandingPage: React.FC<{ page: PaginaData }> = ({ page }) => {
  const c = T[page.tema];
  useEffect(() => {
    document.title = page.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', page.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.macfrois.com.br' + page.rota);
  }, [page]);

  return (
    <div className={`min-h-screen ${c.page}`}>
      <div className={c.hero}>
        <header className="pt-32 pb-16 px-6 text-center max-w-3xl mx-auto">
          <p className={`${c.kicker} text-xs tracking-[0.4em] uppercase mb-4`}>{page.kicker}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{page.h1}</h1>
          <div className={`w-12 h-px ${c.rule} mx-auto mb-6`} />
          <p className={`${c.introText} text-sm md:text-base leading-relaxed mb-10`}>{page.intro}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={wa(page.pagina, page.whatsapp)} target="_blank" rel="noopener noreferrer"
               className={`px-8 py-4 text-xs tracking-[0.3em] uppercase font-semibold transition-all ${c.cta}`}>Falar no WhatsApp</a>
            <a href="#pacotes" className={`px-8 py-4 text-xs tracking-[0.3em] uppercase transition-all ${c.ghost}`}>Ver os pacotes</a>
          </div>
        </header>
      </div>
      <div className="h-14" />

      {page.galeria.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className={`grid gap-3 ${page.galeria.length === 2 ? 'grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-2 md:grid-cols-3'}`}>
            {page.galeria.map((g) => (
              <img key={g.src} src={g.src} alt={g.alt} loading="lazy" className={`w-full aspect-[4/5] object-cover ${c.img}`} />
            ))}
          </div>
          {page.galeriaLegenda && <p className={`${c.muted} text-xs text-center mt-3`}>{page.galeriaLegenda}</p>}
        </section>
      )}

      {page.secoes.map((s) => (
        <section key={s.h2} className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-serif mb-5">{s.h2}</h2>
          {s.paragrafos?.map((p) => <p key={p} className={`${c.muted} text-sm md:text-base leading-relaxed mb-4`}>{p}</p>)}
          {s.lista && (
            <ul className="space-y-3">
              {s.lista.map((i) => (
                <li key={i} className={`flex items-start text-sm md:text-base ${c.cardBody}`}>
                  <Check size={14} className={`${c.check} mr-3 shrink-0 mt-1.5`} />{i}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {page.praias && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <p className={`${c.accent} text-xs tracking-[0.4em] uppercase mb-3`}>Praias</p>
          <h2 className="text-2xl md:text-3xl font-serif mb-8">Onde fotografo famílias na praia</h2>
          <div className="space-y-6">
            {page.praias.map((p) => (
              <article key={p.id} id={p.id} className={`${c.card} p-6 scroll-mt-24`}>
                <h3 className="font-serif text-xl mb-3">{p.h}</h3>
                {p.p.map((t) => <p key={t} className={`${c.muted} text-sm leading-relaxed mb-3`}>{t}</p>)}
                {p.link && <Link to={p.link} className={`${c.accent} text-sm underline underline-offset-4`}>Ver a página da {p.nome}</Link>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="pacotes" className="max-w-6xl mx-auto px-6 pb-20 scroll-mt-24">
        <p className={`${c.accent} text-xs tracking-[0.4em] uppercase mb-3 text-center`}>Pacotes</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-3">{page.pacotesTitulo}</h2>
        <p className={`${c.muted} text-sm text-center mb-10`}>{page.pacotesSub}</p>
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {page.pacotes.map((p) => (
            <article key={p.nome} className={`relative p-8 flex flex-col ${c.card} ${p.destaque ? c.pkgHi : ''}`}>
              {p.destaque && <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase px-4 py-1 ${c.badge}`}>Recomendado</span>}
              <h3 className="font-serif text-2xl mb-1">{p.nome}</h3>
              <p className={`${c.muted} text-sm italic mb-5`}>{p.frase}</p>
              <p className={`${c.price} text-3xl font-serif mb-6`}>{p.rotulo}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {p.itens.map((i) => (
                  <li key={i} className={`flex items-start text-sm ${c.cardBody}`}>
                    <Check size={14} className={`${c.check} mr-3 shrink-0 mt-1`} />{i}
                  </li>
                ))}
              </ul>
              <a href={wa(page.pagina, `o pacote ${p.nome}`)} target="_blank" rel="noopener noreferrer"
                 className={`text-center px-6 py-3 text-xs tracking-[0.3em] uppercase font-semibold transition-all ${p.destaque ? c.pkgBtn : c.pkgBtnOff}`}>
                Quero o {p.nome}
              </a>
            </article>
          ))}
        </div>
        <ul className={`max-w-3xl mx-auto mt-10 space-y-2 text-xs ${c.muted} text-center`}>
          {page.extras.map((e) => <li key={e}>{e}</li>)}
        </ul>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className={`${c.accent} text-xs tracking-[0.4em] uppercase mb-3`}>Quem fotografa</p>
        <h2 className="text-2xl md:text-3xl font-serif mb-5">Um olhar que aprendeu a ler pessoas</h2>
        <p className={`${c.muted} text-sm md:text-base leading-relaxed`}>
          Sou Mac Frois, retratista em Florianópolis há mais de 10 anos. Antes disso, foram quase 20 anos em atendimento de
          emergência, e foi ali que aprendi a perceber as pessoas antes de ouvir palavras. Levo esse cuidado para a sessão:
          ambiente calmo, direção leve e cada um aparecendo como é.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-6">
          {page.links.map((l) => <Link key={l.to} to={l.to} className={`${c.accent} text-sm underline underline-offset-4`}>{l.label}</Link>)}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <p className={`${c.accent} text-xs tracking-[0.4em] uppercase mb-3 text-center`}>Dúvidas frequentes</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">Antes de agendar</h2>
        <div className="space-y-3">
          {page.faq.map((f) => (
            <details key={f.q} className={`group ${c.card} p-5`}>
              <summary className="flex justify-between items-center cursor-pointer list-none text-sm md:text-base">
                {f.q}
                <ChevronDown size={16} className={`${c.accent} shrink-0 ml-4 group-open:rotate-180 transition-transform`} />
              </summary>
              <p className={`${c.muted} text-sm leading-relaxed mt-4`}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 text-center">
        <h2 className="text-2xl md:text-3xl font-serif mb-4">Vamos conversar?</h2>
        <p className={`${c.muted} text-sm mb-8`}>Estúdio Frois · Estreito, Florianópolis — SC · WhatsApp (48) 99623-1894</p>
        <a href={wa(page.pagina, page.whatsapp)} target="_blank" rel="noopener noreferrer"
           className={`inline-block px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold transition-all ${c.final}`}>Chamar no WhatsApp</a>
      </section>
    </div>
  );
};

const modulos = import.meta.glob('../data/paginas/*.json', { eager: true }) as Record<string, { default: PaginaData }>;
export const PAGINAS_LANDING: PaginaData[] = Object.values(modulos).map((m) => m.default);
