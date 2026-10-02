import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import page from '../data/ensaio-familia.json';

const WHATSAPP = (assunto: string) =>
  'https://wa.me/5548996231894?text=' + encodeURIComponent(`Olá Mac, vi a página de ensaio de família e gostaria de saber mais sobre ${assunto}.`);

const brl = (n: number) => 'R$ ' + n.toLocaleString('pt-BR');

const GALERIA = [
  { src: '/familia/garoto-no-barco.jpg', alt: 'Menino sorrindo olhando para o horizonte, em ensaio ao ar livre em Florianópolis' },
  { src: '/familia/irmaos-na-colina.jpg', alt: 'Dois irmãos sentados juntos em uma colina verde em Florianópolis' },
  { src: '/familia/mae-e-filhos-na-praia.jpg', alt: 'Mãe abraçando os filhos na praia em um dia de sol' },
  { src: '/familia/irmaos-campo-de-trigo.jpg', alt: 'Irmãos brincando em um campo de trigo dourado' },
  { src: '/familia/avo-e-bebe.jpg', alt: 'Avó e neto bebê sorrindo em um jardim' },
  { src: '/familia/por-do-sol-na-praia.jpg', alt: 'Criança sentada na areia olhando o pôr do sol na praia' },
];

const PASSOS = [
  ['Conversa e escolha', 'Você me conta como é a sua família e escolhe o pacote e o local: estúdio ou externa.'],
  ['Orientação de figurino', 'Cores e estilo combinados antes da sessão, para todos ficarem à vontade.'],
  ['Sessão leve', 'Direção sem pose forçada, no ritmo das crianças e de quem não gosta de ser fotografado.'],
  ['Entrega que fica', 'Galeria digital e, nos pacotes maiores, quadros e álbuns impressos com qualidade fotográfica.'],
];

const C = { creme: 'bg-[#FBF6EE]', terra: 'text-[#B5573A]', terraBg: 'bg-[#B5573A]', marrom: 'text-[#3A2A22]' };

export const FamilyPhotographer: React.FC = () => {
  useEffect(() => {
    document.title = page.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', page.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.macfrois.com.br/ensaio-de-familia-florianopolis');
  }, []);

  const at = page.alemDoTempo;

  return (
    <div className={`min-h-screen ${C.creme} ${C.marrom}`}>
      {/* Hero */}
      <div className="bg-[#3A2A22] text-[#FBF6EE]">
        <header className="pt-32 pb-16 px-6 text-center max-w-3xl mx-auto">
          <p className="text-[#E0A58F] text-xs tracking-[0.4em] uppercase mb-4">Estúdio Frois · Estreito, Florianópolis — SC</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{page.h1}</h1>
          <div className="w-12 h-px bg-[#E0A58F] mx-auto mb-6" />
          <p className="text-[#E8DAC8] text-sm md:text-base leading-relaxed mb-10">{page.intro}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP('o ensaio de família')} target="_blank" rel="noopener noreferrer"
               className="px-8 py-4 bg-[#E0A58F] text-[#3A2A22] text-xs tracking-[0.3em] uppercase font-semibold hover:bg-[#f0b9a4] transition-all">
              Falar no WhatsApp
            </a>
            <a href="#pacotes"
               className="px-8 py-4 border border-[#E0A58F] text-[#E0A58F] text-xs tracking-[0.3em] uppercase hover:bg-[#E0A58F] hover:text-[#3A2A22] transition-all">
              Ver os pacotes
            </a>
          </div>
        </header>
      </div>
      <div className="h-14" />

      {/* Galeria */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALERIA.map((g) => (
            <img key={g.src} src={g.src} alt={g.alt} loading="lazy" className="w-full aspect-[4/5] object-cover bg-[#EADFCF]" />
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className={`${C.terra} text-xs tracking-[0.4em] uppercase mb-3 text-center`}>Como funciona</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">Da conversa à parede da sua casa</h2>
        <ol className="grid md:grid-cols-4 gap-4">
          {PASSOS.map(([t, d], i) => (
            <li key={t} className="bg-white border border-[#EADFCF] p-6">
              <span className={`${C.terra} font-serif text-2xl`}>0{i + 1}</span>
              <h3 className="font-serif text-base mt-3 mb-2">{t}</h3>
              <p className="text-[#6B5648] text-sm leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Pacotes */}
      <section id="pacotes" className="max-w-6xl mx-auto px-6 pb-20 scroll-mt-24">
        <p className={`${C.terra} text-xs tracking-[0.4em] uppercase mb-3 text-center`}>Pacotes</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-3">Quanto custa um ensaio de família em Florianópolis?</h2>
        <p className="text-[#6B5648] text-sm text-center mb-10">Três formas de guardar a sua família. O Memória é o mais escolhido.</p>
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {page.packages.map((p) => (
            <article key={p.id}
                     className={`relative bg-white p-8 flex flex-col ${p.destaque ? 'border-2 border-[#B5573A] shadow-lg' : 'border border-[#EADFCF]'}`}>
              {p.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B5573A] text-white text-[10px] tracking-[0.3em] uppercase px-4 py-1">Recomendado</span>
              )}
              <h3 className="font-serif text-2xl mb-1">{p.nome}</h3>
              <p className="text-[#6B5648] text-sm italic mb-5">{p.frase}</p>
              <p className={`${C.terra} text-4xl font-serif mb-6`}>{brl(p.preco)}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {p.itens.map((i) => (
                  <li key={i} className="flex items-start text-sm text-[#4a382e]">
                    <Check size={14} className={`${C.terra} mr-3 shrink-0 mt-1`} />{i}
                  </li>
                ))}
              </ul>
              <a href={WHATSAPP(`o pacote ${p.nome}`)} target="_blank" rel="noopener noreferrer"
                 className={`text-center px-6 py-3 text-xs tracking-[0.3em] uppercase font-semibold transition-all ${p.destaque ? 'bg-[#B5573A] text-white hover:bg-[#9c472d]' : 'border border-[#B5573A] text-[#B5573A] hover:bg-[#B5573A] hover:text-white'}`}>
                Quero o {p.nome}
              </a>
            </article>
          ))}
        </div>
        <ul className="max-w-3xl mx-auto mt-10 space-y-2 text-xs text-[#6B5648] text-center">
          {page.extras.map((e) => <li key={e}>{e}</li>)}
        </ul>
      </section>

      {/* Além do Tempo */}
      <section className="bg-[#3A2A22] text-[#FBF6EE]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-[#E0A58F] text-xs tracking-[0.4em] uppercase mb-3 text-center">Legado + Além do Tempo</p>
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-4">O que é o Além do Tempo?</h2>
          <p className="text-[#E8DAC8] text-sm md:text-base leading-relaxed text-center max-w-2xl mx-auto mb-3 italic">{at.frase}</p>
          <p className="text-[#E8DAC8] text-sm leading-relaxed text-center max-w-2xl mx-auto mb-12">{at.texto}</p>
          <div className="grid md:grid-cols-2 gap-5">
            {at.contratos.map((c) => (
              <article key={c.id} className="border border-[#7a5a49] p-8 flex flex-col">
                <h3 className="font-serif text-xl mb-2">{c.nome}</h3>
                <p className="text-[#E0A58F] text-4xl font-serif mb-6">{brl(c.preco)}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {c.itens.map((i) => (
                    <li key={i} className="flex items-start text-sm text-[#E8DAC8]">
                      <Check size={14} className="text-[#E0A58F] mr-3 shrink-0 mt-1" />{i}
                    </li>
                  ))}
                </ul>
                <a href={WHATSAPP(`o ${c.nome}`)} target="_blank" rel="noopener noreferrer"
                   className="text-center px-6 py-3 bg-[#E0A58F] text-[#3A2A22] text-xs tracking-[0.3em] uppercase font-semibold hover:bg-[#f0b9a4] transition-all">
                  Quero saber mais
                </a>
              </article>
            ))}
          </div>
          <ul className="mt-8 space-y-2 text-xs text-[#C9B8A5] text-center">
            {at.notas.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
      </section>

      {/* Sobre */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className={`${C.terra} text-xs tracking-[0.4em] uppercase mb-3`}>Quem fotografa</p>
        <h2 className="text-2xl md:text-3xl font-serif mb-6">Um olhar que aprendeu a ler pessoas</h2>
        <p className="text-[#6B5648] text-sm md:text-base leading-relaxed">
          Sou Mac Frois, retratista em Florianópolis há mais de 10 anos. Antes disso, foram quase 20 anos como enfermeiro em
          atendimentos de emergência, e foi ali que aprendi a perceber as pessoas antes de ouvir palavras. Levo esse cuidado
          para o ensaio de família: um ambiente calmo, sem pose forçada, em que cada um aparece como é.
          Conheça também o meu trabalho de <Link to="/fotografo-corporativo-florianopolis" className={`${C.terra} underline underline-offset-4`}>fotografia corporativa</Link>.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <p className={`${C.terra} text-xs tracking-[0.4em] uppercase mb-3 text-center`}>Dúvidas frequentes</p>
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">Antes de agendar</h2>
        <div className="space-y-3">
          {page.faq.map((f) => (
            <details key={f.q} className="group bg-white border border-[#EADFCF] p-5">
              <summary className="flex justify-between items-center cursor-pointer list-none text-sm md:text-base">
                {f.q}
                <ChevronDown size={16} className={`${C.terra} shrink-0 ml-4 group-open:rotate-180 transition-transform`} />
              </summary>
              <p className="text-[#6B5648] text-sm leading-relaxed mt-4">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-24 text-center">
        <h2 className="text-2xl md:text-3xl font-serif mb-4">Vamos guardar a sua família?</h2>
        <p className="text-[#6B5648] text-sm mb-8">Estúdio Frois · Estreito, Florianópolis — SC · Atendimento presencial</p>
        <a href={WHATSAPP('o ensaio de família')} target="_blank" rel="noopener noreferrer"
           className={`inline-block px-10 py-4 ${C.terraBg} text-white text-xs tracking-[0.3em] uppercase font-semibold hover:bg-[#9c472d] transition-all`}>
          Chamar no WhatsApp
        </a>
      </section>
    </div>
  );
};
