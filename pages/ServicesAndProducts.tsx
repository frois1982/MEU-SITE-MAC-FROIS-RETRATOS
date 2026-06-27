import React, { useEffect } from 'react';
import { SectionTitle, Button } from '../components/UI';
import { Check, Clock, Star } from 'lucide-react';

export const Services: React.FC = () => {
  useEffect(() => {
    document.title = 'Projetos | Mac Frois — Retratos Corporativos e Posicionamento de Imagem';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Projetos Da Vinci e Michelangelo — metodologia exclusiva de retratos corporativos e posicionamento de imagem em Florianopolis, SC.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.macfrois.com.br/servicos');
  }, []);

  const getWhatsappLink = (projectName: string) => {
    const baseUrl = "https://wa.me/5548996231894";
    const message = encodeURIComponent(`Ola Mac, estive no seu site e gostaria de solicitar uma proposta para o ${projectName}. Como podemos prosseguir?`);
    return `${baseUrl}?text=${message}`;
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4">Imagem com Autoridade</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Projetos de Posicionamento</h1>
          <div className="w-16 h-px bg-gold-600 mx-auto mb-6" />
          <p className="text-zinc-500 text-sm max-w-xl mx-auto tracking-wider leading-relaxed">
            Metodologia exclusiva que une arquetipos de marca, direcao comportamental e fotografia estrategica para construir uma imagem que atrai os clientes certos.
          </p>
        </div>

        {/* Dois projetos principais */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">

          {/* Projeto Da Vinci */}
          <div className="bg-zinc-900 border border-zinc-800 p-10 flex flex-col rounded-sm hover:border-gold-600/50 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold-600 opacity-60" />
            <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3">Posicionamento Estrategico</p>
            <h2 className="text-3xl font-serif text-white mb-4">Projeto Da Vinci</h2>
            <p className="text-zinc-500 text-sm tracking-wider leading-relaxed mb-8">
              Uma imersao profunda na sua marca pessoal. Construimos juntos a narrativa visual que posiciona voce como referencia no seu mercado.
            </p>
            <ul className="space-y-4 mb-10 border-t border-zinc-800 pt-8">
              {[
                '4 calls estrategicas de alinhamento',
                'Analise de arquetipos de marca',
                'Sessao fotografica de 3 horas',
                '60 fotos tratadas premium',
                'Dossie de entrega personalizado',
                'Diretrizes de figurino e locacao'
              ].map((f, i) => (
                <li key={i} className="flex items-start text-zinc-300 text-xs tracking-widest uppercase">
                  <Check size={14} className="text-gold-500 mr-4 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mb-8">
              <p className="text-zinc-600 text-xs tracking-widest uppercase mb-1">Investimento</p>
              <p className="text-white text-2xl font-serif">R$ 6.990</p>
              <p className="text-zinc-600 text-xs mt-1">ou 8x R$ 998,75</p>
            </div>
            <a href={getWhatsappLink('Projeto Da Vinci')} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="outline" className="w-full py-4">
                Solicitar Proposta
              </Button>
            </a>
          </div>

          {/* Projeto Michelangelo */}
          <div className="bg-zinc-900 border border-gold-600 p-10 flex flex-col rounded-sm hover:border-gold-400 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold-600 text-black text-[10px] font-bold px-4 py-1.5 tracking-widest">
              IMERSAO COMPLETA
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-gold-600" />
            <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3">Maxima Profundidade</p>
            <h2 className="text-3xl font-serif text-white mb-4">Projeto Michelangelo</h2>
            <p className="text-zinc-500 text-sm tracking-wider leading-relaxed mb-8">
              A parceria mais completa para transformar sua presenca. Uma jornada de imersao total que redefine como o mundo percebe voce.
            </p>
            <ul className="space-y-4 mb-10 border-t border-zinc-800 pt-8">
              {[
                'Processo completo de arquetipos',
                'Sessao fotografica de 6 horas',
                '50+ fotos tratadas premium',
                'Calls de acompanhamento pos-entrega',
                'Consultoria de criacao de conteudo',
                'Dossie estrategico completo',
                'Revisao e proximos passos'
              ].map((f, i) => (
                <li key={i} className="flex items-start text-zinc-300 text-xs tracking-widest uppercase">
                  <Check size={14} className="text-gold-500 mr-4 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mb-8">
              <p className="text-zinc-600 text-xs tracking-widest uppercase mb-1">Investimento</p>
              <p className="text-white text-2xl font-serif">R$ 18.990</p>
              <p className="text-zinc-600 text-xs mt-1">ou 12x R$ 1.899,00</p>
            </div>
            <a href={getWhatsappLink('Projeto Michelangelo')} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="primary" className="w-full py-4">
                Solicitar Proposta
              </Button>
            </a>
          </div>
        </div>

        {/* Card menor Van Gogh */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-sm flex flex-col md:flex-row items-center gap-8 hover:border-zinc-700 transition-all duration-300">
            <div className="flex-1">
              <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-2">Ponto de Entrada</p>
              <h3 className="text-2xl font-serif text-white mb-3">Projeto Van Gogh</h3>
              <p className="text-zinc-500 text-sm tracking-wider leading-relaxed">
                Seu primeiro retrato de impacto. Ideal para quem busca uma imagem profissional, autentica e objetiva em 1 hora de sessao.
              </p>
            </div>
            <div className="flex flex-col gap-3 items-center md:items-end shrink-0">
              {['1 hora de sessao', '15 fotos tratadas', 'Consultoria de imagem'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-400 text-xs tracking-widest uppercase">
                  <Check size={12} className="text-gold-500" />
                  {f}
                </div>
              ))}
              <p className="text-white text-xl font-serif mt-2">R$ 2.890</p>
              <a href={getWhatsappLink('Projeto Van Gogh')} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="mt-2 px-8">
                  Solicitar Proposta
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Rodape informativo */}
        <div className="text-center mt-20">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">
            Todos os projetos incluem contrato, nota fiscal e atendimento presencial em Florianopolis, SC
          </p>
          <p className="text-zinc-700 text-xs mt-2 tracking-wider">
            Pagamento via Pix, cartao de credito em ate 12x ou transferencia bancaria
          </p>
        </div>

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
        <SectionTitle title="Em Breve" subtitle="Mac Frois Digital" />
        <p className="text-zinc-500 text-sm tracking-wider mt-8">
          Novos produtos digitais chegando em breve.
        </p>
        <a
          href="https://wa.me/5548996231894"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 px-8 py-3 border border-gold-600 text-gold-500 text-xs tracking-[0.3em] uppercase hover:bg-gold-600/10 transition-all duration-300"
        >
          Falar com Mac Frois
        </a>
      </div>
    </div>
  );
};
