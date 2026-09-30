import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import page from '../data/fotografo-corporativo.json';

const CLOUD = 'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_900/';
const GALLERY = [
  { id: 'CORP_Empresario.jpg_15_HOME_m6bzke', alt: 'Retrato de empresário de terno azul, fotografia corporativa em Florianópolis' },
  { id: 'ART_Conceito.jpg_3_HOME_awekl7', alt: 'Retrato de empresária de camisa branca, posicionamento de imagem profissional' },
  { id: '1000380124.jpg_dmperd', alt: 'Retrato de autoridade para profissional liberal, Mac Frois' },
  { id: '12-iluminacao-e-imagem-profissional', alt: 'Retrato de executiva sorrindo com iluminação profissional de estúdio' },
  { id: 'CORP_Executivo_01', alt: 'Retrato executivo de terno cinza, fotografia corporativa em Florianópolis' },
  { id: 'ART_Conceito.jpg_HOME_mnu0wx', alt: 'Retrato autoral de executivo com luz dramática, Mac Frois' },
];

const PUBLICO = [
  ['Advogados e médicos', 'Imagem que transmite confiança e competência antes da primeira consulta.'],
  ['Empresários e executivos', 'Retratos para site, apresentações, imprensa e perfil institucional.'],
  ['Mentores, consultores e coaches', 'Fotos que sustentam um posicionamento premium e atraem os clientes certos.'],
  ['Profissionais liberais', 'Presença profissional consistente no LinkedIn, no Google e nas redes sociais.'],
];

const PASSOS = [
  ['Conversa inicial', 'Entendo sua atuação, seu público e o que a imagem precisa comunicar.'],
  ['Direção e figurino', 'Você recebe orientações de figurino e de estratégia antes da sessão.'],
  ['Sessão dirigida', 'De 1 a 3 horas, com direção de pose, no estúdio ou no seu local de trabalho.'],
  ['Entrega tratada', 'Fotos em alta resolução e em versão para web, em galeria digital.'],
];

const WHATSAPP = 'https://wa.me/5548996231894?text=' +
  encodeURIComponent('Olá Mac, vi a página de fotógrafo corporativo em Florianópolis e gostaria de saber mais sobre a sessão.');

export const CorporatePhotographer: React.FC = () => {
  useEffect(() => {
    document.title = page.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', page.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.macfrois.com.br/fotografo-corporativo-florianopolis');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <header className="pt-32 pb-16 px-6 text-center max-w-3xl mx-auto">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4">Mac Frois · Estreito, Florianópolis — SC</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{page.h1}</h1>
        <div className="w-12 h-px bg-gold-600 mx-auto mb-6" />
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed tracking-wide mb-10">{page.intro}</p>
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
      </header>

      {/* Galeria */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY.map((g) => (
            <img key={g.id} src={CLOUD + g.id} alt={g.alt} loading="lazy"
                 className="w-full aspect-[4/5] object-cover bg-zinc-900" />
          ))}
        </div>
      </section>

      {/* Para quem */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3 text-center">Para quem é</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">Fotografia corporativa para quem vive de confiança</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {PUBLICO.map(([t, d]) => (
            <div key={t} className="bg-zinc-900 border border-zinc-800 p-6">
              <h3 className="text-white font-serif text-lg mb-2">{t}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Método */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3">Método Frois</p>
        <h2 className="text-2xl md:text-3xl font-serif mb-6">Não é só uma foto bonita. É posicionamento.</h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          O Método Frois une arquétipos de marca, direção comportamental e fotografia estratégica. Antes de
          fotografar, eu entendo quem você é e o que a sua imagem precisa dizer. Foram quase 20 anos como
          enfermeiro em atendimentos de emergência antes de me dedicar à fotografia, há mais de 10 anos. Ali
          aprendi a ler pessoas antes de ouvir palavras, e é isso que levo para cada retrato corporativo em
          Florianópolis: uma imagem profissional que se parece com você, natural, sem pose forçada, e não uma mera cópia.
        </p>
      </section>

      {/* Como funciona */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3 text-center">Como funciona</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">Da conversa à entrega, em 4 etapas</h2>
        <ol className="grid md:grid-cols-4 gap-4">
          {PASSOS.map(([t, d], i) => (
            <li key={t} className="bg-zinc-900 border border-zinc-800 p-6">
              <span className="text-gold-500 font-serif text-2xl">0{i + 1}</span>
              <h3 className="text-white font-serif text-base mt-3 mb-2">{t}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Investimento */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-zinc-900 border border-gold-600/40 p-10 text-center">
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Fotografia corporativa · a partir de</p>
          <p className="text-white text-4xl font-serif mb-6">R$ 890</p>
          <ul className="inline-block text-left space-y-3 mb-8">
            {['Sessão de 1 a 3 horas, no estúdio ou em locação',
              '10 a 40 fotos tratadas, conforme o pacote',
              'Alta resolução + versão web otimizada',
              'Orientações de figurino e estratégia'].map((f) => (
              <li key={f} className="flex items-start text-zinc-300 text-sm">
                <Check size={14} className="text-gold-500 mr-3 shrink-0 mt-1" />{f}
              </li>
            ))}
          </ul>
          <p className="text-zinc-500 text-xs mb-6">
            Para uma imersão completa, conheça os <Link to="/servicos" className="text-gold-500 hover:underline">Projetos Estratégicos de Imagem</Link> (investimento sob consulta).
          </p>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
             className="inline-block px-8 py-4 bg-gold-600 text-black text-xs tracking-[0.3em] uppercase font-semibold hover:bg-gold-500 transition-all">
            Solicitar proposta
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3 text-center">Dúvidas frequentes</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">Antes de agendar</h2>
        <div className="space-y-3">
          {page.faq.map((f) => (
            <details key={f.q} className="group bg-zinc-900 border border-zinc-800 p-5">
              <summary className="flex justify-between items-center cursor-pointer list-none text-white text-sm md:text-base">
                {f.q}
                <ChevronDown size={16} className="text-gold-500 shrink-0 ml-4 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-zinc-400 text-sm leading-relaxed mt-4">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Leituras */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4 text-center">Leia também</p>
        <ul className="space-y-2 text-center text-sm">
          {[
            ['/blog/quanto-custa-um-fotografo-corporativo-em-florianopolis', 'Quanto custa um fotógrafo corporativo em Florianópolis'],
            ['/blog/headshot-para-linkedin-como-uma-foto-transforma-seu-perfil', 'Headshot para LinkedIn: como uma foto transforma seu perfil'],
            ['/blog/por-que-advogados-e-medicos-precisam-de-fotos-profissionais', 'Por que advogados e médicos precisam de fotos profissionais'],
            ['/blog/como-escolher-o-fotografo-certo-para-sua-marca-pessoal', 'Como escolher o fotógrafo certo para sua marca pessoal'],
          ].map(([href, label]) => (
            <li key={href}><Link to={href} className="text-zinc-400 hover:text-gold-500 underline-offset-4 hover:underline">{label}</Link></li>
          ))}
        </ul>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-24 text-center">
        <h2 className="text-2xl md:text-3xl font-serif mb-4">Vamos construir a sua imagem de autoridade?</h2>
        <p className="text-zinc-500 text-sm mb-8">Mac Frois · Estreito, Florianópolis — SC · Atendimento presencial</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
           className="inline-block px-10 py-4 bg-gold-600 text-black text-xs tracking-[0.3em] uppercase font-semibold hover:bg-gold-500 transition-all">
          Chamar no WhatsApp
        </a>
      </section>
    </div>
  );
};
