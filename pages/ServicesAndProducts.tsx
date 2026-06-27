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
    document.title = 'Produtos Digitais | Mac Frois — Cursos de Fotografia';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Cursos digitais de fotografia por Mac Frois. Iluminacao Profissional e Retratos que Vendem disponíveis agora no Hotmart.');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">

      <div className="pt-32 pb-16 text-center px-6">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4">Mac Frois Digital</p>
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Cursos e Produtos</h1>
        <div className="w-12 h-px bg-gold-600 mx-auto mb-6" />
        <p className="text-zinc-500 text-sm max-w-lg mx-auto tracking-wider leading-relaxed">
          Conhecimento pratico para fotografos e criadores de conteudo que querem resultados reais.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">

          {/* Retratos que Vendem */}
          <div className="bg-zinc-900 border border-gold-600/40 hover:border-gold-500 transition-all duration-500 flex flex-col group relative overflow-hidden">
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src="https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/CORP_Empresario.jpg_15_HOME_m6bzke"
                alt="Retratos que Vendem"
                className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute top-3 left-3 bg-gold-600 text-black text-[10px] font-bold px-3 py-1 tracking-widest">
                DISPONIVEL
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <p className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-2">Curso Completo</p>
              <h3 className="text-2xl font-serif text-white mb-3">Retratos que Vendem</h3>
              <p className="text-zinc-500 text-sm tracking-wider leading-relaxed mb-6 flex-1">
                Curso completo de fotografia de retratos corporativos. Aprenda do zero ou evolua como profissional — tecnicas de iluminacao, camera, lente, posicionamento e como fechar clientes de alto valor com sua fotografia.
              </p>
              <div className="mb-6">
                <p className="text-zinc-600 text-xs tracking-widest uppercase mb-1">Investimento</p>
                <p className="text-white text-2xl font-serif">R$ 247</p>
                <p className="text-zinc-600 text-xs">ou R$ 297 no evergreen</p>
              </div>
              <a
                href="https://go.hotmart.com/I106036177H"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-gold-600 text-black text-xs tracking-[0.3em] uppercase hover:bg-gold-500 transition-all duration-300 font-semibold"
              >
                Ver o Curso
              </a>
            </div>
          </div>

          {/* Iluminacao Profissional */}
          <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-500 flex flex-col group relative overflow-hidden">
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src="https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_7_m4gl6u"
                alt="Iluminacao Profissional"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute top-3 left-3 bg-zinc-700 text-zinc-200 text-[10px] font-bold px-3 py-1 tracking-widest">
                DISPONIVEL
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <p className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-2">Mini-curso</p>
              <h3 className="text-2xl font-serif text-white mb-3">Iluminacao Profissional</h3>
              <p className="text-zinc-500 text-sm tracking-wider leading-relaxed mb-6 flex-1">
                Tecnicas de iluminacao profissional para foto e video. Funciona com smartphone ou camera. Para criadores de conteudo e fotografos.
              </p>
              <div className="mb-6">
                <p className="text-zinc-600 text-xs tracking-widest uppercase mb-1">Investimento</p>
                <p className="text-white text-2xl font-serif">R$ 97</p>
                <p className="text-zinc-600 text-xs">Acesso imediato na Hotmart</p>
              </div>
              <a
                href="/metodo-frois/minicurso.html"
                className="block w-full text-center py-3 border border-zinc-600 text-zinc-300 text-xs tracking-[0.3em] uppercase hover:border-gold-600 hover:text-gold-500 transition-all duration-300"
              >
                Ver o Curso
              </a>
            </div>
          </div>

          {/* Retratos pelo Celular — Em breve */}
          <div className="bg-zinc-900/50 border border-zinc-900 flex flex-col relative overflow-hidden opacity-60">
            <div className="relative overflow-hidden aspect-[4/3] bg-zinc-900 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/PORT_RetratoMulher_bzzoge"
                alt="Retratos pelo Celular"
                className="w-full h-full object-cover grayscale opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase">Em Construcao</p>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <p className="text-zinc-600 text-xs tracking-[0.3em] uppercase mb-2">Em breve</p>
              <h3 className="text-2xl font-serif text-zinc-600 mb-3">Retratos pelo Celular</h3>
              <p className="text-zinc-700 text-sm tracking-wider leading-relaxed mb-6 flex-1">
                Aprenda a criar retratos profissionais usando apenas o seu smartphone. Em producao.
              </p>
              <div className="mb-6">
                <p className="text-zinc-700 text-xs tracking-widest uppercase mb-1">Investimento</p>
                <p className="text-zinc-600 text-2xl font-serif">Em breve</p>
              </div>
              <a
                href="https://wa.me/5548996231894?text=Ola%20Mac!%20Quero%20ser%20avisado%20sobre%20o%20lancamento%20do%20curso%20Retratos%20pelo%20Celular!"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 border border-zinc-800 text-zinc-600 text-xs tracking-[0.3em] uppercase hover:border-zinc-600 hover:text-zinc-400 transition-all duration-300"
              >
                Avisar no Lancamento
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
