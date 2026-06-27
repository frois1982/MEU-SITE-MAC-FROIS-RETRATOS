import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

export const Services: React.FC = () => {
  useEffect(() => {
    document.title = 'Projetos | Mac Frois — Retratos Corporativos e Posicionamento de Imagem';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Fotografia corporativa e projetos estrategicos de imagem em Florianopolis, SC. Pacotes a partir de R$890.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.macfrois.com.br/servicos');
  }, []);

  const getWhatsappLink = (projectName: string) => {
    const baseUrl = "https://wa.me/5548996231894";
    const message = encodeURIComponent(`Ola Mac, estive no seu site e gostaria de solicitar uma proposta para ${projectName}. Como podemos prosseguir?`);
    return `${baseUrl}?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* Header */}
      <div className="pt-32 pb-16 text-center px-6">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4">Estudio Frois · Florianopolis, SC</p>
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Autoridade em Imagem</h1>
        <div className="w-12 h-px bg-gold-600 mx-auto mb-6" />
        <p className="text-zinc-500 text-sm max-w-lg mx-auto tracking-wider leading-relaxed">
          Fotografia corporativa para profissionais que querem ser reconhecidos como referencia.
        </p>
      </div>

      {/* Dois retangulos principais */}
      <div className="flex-1 grid md:grid-cols-2 gap-0 max-w-7xl mx-auto w-full px-6 pb-16">

        {/* RETANGULO 1 — Fotografia Corporativa */}
        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 p-10 md:p-14 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-600 group-hover:bg-gold-600 transition-colors duration-500" />

          <div className="mb-8">
            <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase mb-3">Pacote 01 · 02 · 03</p>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
              Fotografia<br />Corporativa
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed tracking-wide">
              Para o profissional que precisa de uma imagem solida, impactante e autentica. Sessoes focadas com resultado direto para LinkedIn, site, Google Meu Negocio e redes sociais.
            </p>
          </div>

          <ul className="space-y-4 mb-10 flex-1">
            {[
              'Sessao fotografica de 1 a 3 horas',
              'Estudio ou locacao externa a sua escolha',
              '10 a 40 fotos tratadas profissionalmente',
              'Alta resolucao + versao web otimizada',
              'Orientacoes de figurino e estrategia',
              'Entrega em galeria digital',
              'Ideal para LinkedIn, Google e Instagram',
            ].map((f, i) => (
              <li key={i} className="flex items-start text-zinc-400 text-xs tracking-wider">
                <Check size={13} className="text-gold-500 mr-3 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          <div className="border-t border-zinc-800 pt-8">
            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">A partir de</p>
            <p className="text-white text-4xl font-serif mb-1">R$ 890</p>
            <p className="text-zinc-600 text-xs mb-8">3 pacotes disponiveis · Presenca, Autoridade e Lideranca</p>
            <a
              href={getWhatsappLink('Fotografia Corporativa')}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 border border-zinc-600 text-zinc-300 text-xs tracking-[0.3em] uppercase hover:border-gold-600 hover:text-gold-500 transition-all duration-300"
            >
              Solicitar Proposta
            </a>
          </div>
        </div>

        {/* RETANGULO 2 — Projetos Estrategicos de Imagem */}
        <div className="bg-zinc-900 border border-gold-600/40 hover:border-gold-500 transition-all duration-500 p-10 md:p-14 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold-600" />
          <div className="absolute top-0 right-0 bg-gold-600 text-black text-[10px] font-bold px-4 py-1.5 tracking-widest">
            MAXIMA PROFUNDIDADE
          </div>

          <div className="mb-8">
            <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3">Projeto Da Vinci · Michelangelo</p>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
              Projetos<br />Estrategicos<br />de Imagem
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed tracking-wide">
              Uma imersao profunda na sua marca pessoal. Unimos arquetipos de marca, direcao comportamental e fotografia estrategica para construir uma imagem que comunica autoridade antes mesmo de voce abrir a boca.
            </p>
          </div>

          <ul className="space-y-4 mb-10 flex-1">
            {[
              'Analise de arquetipos de marca pessoal',
              'Calls estrategicas de alinhamento',
              'Sessao fotografica de 3 a 6 horas',
              '50 a 60 fotos tratadas premium',
              'Dossie estrategico personalizado',
              'Diretrizes de figurino e locacao',
              'Acompanhamento pos-entrega',
            ].map((f, i) => (
              <li key={i} className="flex items-start text-zinc-300 text-xs tracking-wider">
                <Check size={13} className="text-gold-500 mr-3 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          <div className="border-t border-zinc-800 pt-8">
            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">A partir de</p>
            <p className="text-white text-4xl font-serif mb-1">R$ 7.990</p>
            <p className="text-zinc-600 text-xs mb-8">Projeto Da Vinci R$7.990 · Michelangelo R$16.990</p>
            <a
              href={getWhatsappLink('Projetos Estrategicos de Imagem')}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 bg-gold-600 text-black text-xs tracking-[0.3em] uppercase hover:bg-gold-500 transition-all duration-300 font-semibold"
            >
              Solicitar Proposta
            </a>
          </div>
        </div>
      </div>

      {/* Rodape */}
      <div className="text-center pb-16 px-6">
        <p className="text-zinc-700 text-xs tracking-widest uppercase">
          Atendimento presencial em Florianopolis, SC · Contrato e nota fiscal em todos os projetos
        </p>
        <p className="text-zinc-800 text-xs mt-2 tracking-wider">
          Pagamento via Pix, cartao em ate 12x ou transferencia bancaria
        </p>
      </div>

    </div>
  );
};

export const Products: React.FC = () => {
  useEffect(() => {
    document.title = 'Produtos Digitais | Mac Frois';
  }, []);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200 text-center">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4">Mac Frois Digital</p>
        <h1 className="text-4xl font-serif text-white mb-6">Em Breve</h1>
        <div className="w-12 h-px bg-gold-600 mx-auto mb-8" />
        <p className="text-zinc-500 text-sm tracking-wider">
          Novos produtos digitais chegando em breve.
        </p>
        <a
          href="https://wa.me/5548996231894"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-10 px-8 py-3 border border-gold-600 text-gold-500 text-xs tracking-[0.3em] uppercase hover:bg-gold-600/10 transition-all duration-300"
        >
          Falar com Mac Frois
        </a>
      </div>
    </div>
  );
};
