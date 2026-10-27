import React from 'react';
import { Star } from 'lucide-react';

// Link oficial de avaliação do Perfil da Empresa (Google Meu Negócio): abre direto a tela de estrelas.
export const LINK_AVALIACAO_GOOGLE = 'https://g.page/r/CRUJqKRkYwEEEAE/review';

const Estrelas: React.FC<{ tamanho: number; className?: string }> = ({ tamanho, className = '' }) => (
  <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star
        key={i}
        size={tamanho}
        fill="currentColor"
        strokeWidth={0}
        className="text-gold-500 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-0.5"
        style={{ transitionDelay: `${i * 60}ms` }}
      />
    ))}
  </span>
);

// Cartão grande, para a página de contato.
export const AvalieGoogle: React.FC = () => (
  <section
    aria-labelledby="avalie-titulo"
    className="relative mt-20 overflow-hidden border border-gold-600/30 bg-gradient-to-b from-zinc-900/70 to-black px-6 py-14 text-center md:px-12"
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
    <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-gold-500">Sua opinião importa</p>
    <h2 id="avalie-titulo" className="mx-auto max-w-2xl text-2xl font-serif leading-snug text-white md:text-4xl">
      Já foi fotografado por aqui? Conte como foi.
    </h2>
    <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed tracking-wide text-zinc-400 md:text-base">
      Leva menos de um minuto. A sua avaliação ajuda outras pessoas a encontrar o estúdio e me ajuda a continuar melhorando cada sessão.
    </p>
    <a
      href={LINK_AVALIACAO_GOOGLE}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-auto mt-10 inline-flex flex-col items-center gap-3 border border-gold-500 bg-gold-600/10 px-10 py-5 transition-all duration-500 hover:bg-gold-500 hover:shadow-[0_0_40px_rgba(217,119,6,0.25)] sm:px-14"
    >
      <Estrelas tamanho={22} />
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-400 transition-colors duration-500 group-hover:text-black">
        Avaliar no Google
      </span>
    </a>
    <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-zinc-600">Abre o Google em uma nova aba</p>
  </section>
);

// Versão compacta, para o rodapé.
export const AvalieGoogleRodape: React.FC = () => (
  <a
    href={LINK_AVALIACAO_GOOGLE}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 border border-zinc-800 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-gold-500 hover:text-gold-500"
  >
    <Estrelas tamanho={12} />
    Avalie no Google
  </a>
);
