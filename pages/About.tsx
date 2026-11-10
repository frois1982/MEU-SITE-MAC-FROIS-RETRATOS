import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import page from '../data/sobre.json';

const WHATSAPP = 'https://wa.me/5548996231894?text=' +
  encodeURIComponent('Olá Mac, li a página sobre você e gostaria de conversar sobre uma sessão.');
const LIVRO = 'https://www.amazon.com.br/dp/B0HQ4XGDYY';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = page.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', page.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.macfrois.com.br/sobre');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="pt-28 md:pt-36 pb-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1 text-center md:text-left">
          <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4">Sobre · Florianópolis, SC</p>
          <h1 className="text-5xl md:text-6xl mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{page.h1}</h1>
          <div className="w-12 h-px bg-gold-600 mb-6 mx-auto md:mx-0" />
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{page.intro}</p>
        </div>
        <div className="order-1 md:order-2">
          <img
            src="/sobre/mac-frois-1080.webp"
            srcSet="/sobre/mac-frois-640.webp 640w, /sobre/mac-frois-1080.webp 1080w"
            sizes="(min-width: 768px) 520px, 90vw"
            width={1080} height={1080}
            alt="Retrato em preto e branco de Mac Frois, fotógrafo retratista em Florianópolis"
            className="w-full max-w-md md:max-w-none mx-auto aspect-square object-cover bg-zinc-900"
          />
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-16 space-y-14">
        {page.secoes.map((s) => (
          <div key={s.h2}>
            <h2 className="text-2xl md:text-3xl mb-5 text-gold-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.h2}</h2>
            {s.paragrafos.map((t) => (
              <p key={t} className="text-zinc-300 text-base md:text-[17px] leading-loose mb-4">{t}</p>
            ))}
            {s.h2 === 'O Método Frois' && (
              <p className="text-sm"><Link to="/servicos" className="text-gold-500 underline underline-offset-4 hover:text-gold-400">Ver projetos de posicionamento de imagem</Link></p>
            )}
            {s.h2 === 'Ensinar e escrever' && (
              <p className="text-sm space-x-6">
                <Link to="/produtos" className="text-gold-500 underline underline-offset-4 hover:text-gold-400">Ver os cursos</Link>
                <a href={LIVRO} target="_blank" rel="noopener noreferrer" className="text-gold-500 underline underline-offset-4 hover:text-gold-400">Ver o livro na Amazon</a>
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="w-12 h-px bg-gold-600 mx-auto mb-8" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
             className="px-8 py-4 bg-gold-600 text-black text-xs tracking-[0.3em] uppercase font-semibold hover:bg-gold-500 transition-all">
            Falar no WhatsApp
          </a>
          <Link to="/portfolio"
                className="px-8 py-4 border border-zinc-600 text-zinc-300 text-xs tracking-[0.3em] uppercase hover:border-gold-600 hover:text-gold-500 transition-all">
            Ver portfólio
          </Link>
        </div>
      </section>
    </div>
  );
};
