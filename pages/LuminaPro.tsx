
import React from 'react';
import { Button, SectionTitle } from '../components/UI';
import { Cpu, Zap, Clock, ShieldCheck, Check, Smartphone, Layers, LayoutGrid, Play } from 'lucide-react';

export const LuminaPro: React.FC = () => {
  // MAC: Quando tiver o link da Play Store, coloque aqui!
  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.macfrois.luminapro";
  
  // MAC: Se você subir o vídeo pro YouTube, coloque o ID dele aqui (Ex: https://www.youtube.com/watch?v=XXXX -> XXXX)
  const vslVideoId = ""; 

  return (
    <div className="bg-black text-zinc-200 min-h-screen">
      {/* Hero Section / VSL */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-600/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-gold-500 font-bold tracking-[0.5em] text-[10px] uppercase mb-6 block">Inteligência Artificial Aplicada</span>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-wider">LÚMINA PRO</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-12 text-sm md:text-lg font-light tracking-widest uppercase leading-relaxed">
            Elimine o caos da sua galeria. A IA que organiza, limpa e seleciona suas fotos em tempo real, 24h por dia.
          </p>

          {/* VSL (Vídeo de Vendas) */}
          <div className="max-w-4xl mx-auto aspect-video bg-zinc-900 border border-zinc-800 rounded-sm mb-16 shadow-[0_0_80px_rgba(217,119,6,0.15)] overflow-hidden relative group">
            {vslVideoId ? (
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${vslVideoId}?autoplay=0&controls=1&rel=0`}
                title="Lumina Pro VSL"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 group-hover:bg-black/40 transition-all cursor-pointer">
                  <div className="w-24 h-24 bg-gold-600 rounded-full flex items-center justify-center text-black shadow-2xl transform group-hover:scale-110 transition-transform mb-6">
                      <Play size={40} fill="currentColor" className="ml-2" />
                  </div>
                  <p className="text-gold-500 text-[10px] font-bold tracking-[0.5em] uppercase">Assistir Apresentação</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="w-full max-w-md">
              <Button className="w-full py-6 text-lg tracking-[0.4em] shadow-[0_0_30px_rgba(217,119,6,0.3)] animate-pulse hover:animate-none">
                INSTALAR LÚMINA PRO
              </Button>
            </a>
            <div className="flex items-center gap-4 opacity-50">
                <span className="h-[1px] w-8 bg-zinc-800"></span>
                <p className="text-zinc-500 text-[9px] tracking-[0.3em] uppercase">Processamento 100% Seguro</p>
                <span className="h-[1px] w-8 bg-zinc-800"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Problema e Solução */}
      <section className="py-32 bg-zinc-950 border-y border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-gold-600 font-bold text-[10px] tracking-[0.4em] uppercase mb-6 block">O Problema</span>
              <h2 className="text-4xl font-serif text-white mb-10 tracking-widest italic leading-tight">Sua Galeria é um<br/>Cemitério de Gigabytes</h2>
              <div className="space-y-8 text-zinc-400 font-light text-sm tracking-widest uppercase leading-loose">
                <p>Quantas fotos você tem hoje que nunca mais vai olhar? Prints inúteis, fotos tremidas e duplicatas que sufocam sua memória e seu tempo.</p>
                <p className="text-zinc-200 border-l-2 border-gold-600 pl-6 font-bold italic">O Lúmina Pro é o primeiro assistente que pensa por você, devolvendo o controle da sua história visual.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               {[
                 { icon: <Cpu />, title: 'IA Ativa', desc: 'Processamento Neural' },
                 { icon: <LayoutGrid />, title: 'Agrupamento', desc: 'Lógica por Contexto' },
                 { icon: <ShieldCheck />, title: 'Privacidade', desc: 'Dados Encriptados' },
                 { icon: <Clock />, title: 'Tempo Real', desc: 'Monitoramento 24h' }
               ].map((item, i) => (
                 <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-sm text-center group hover:border-gold-500 transition-all duration-500">
                    <div className="text-gold-500 mb-6 flex justify-center transform group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="text-white text-xs font-bold mb-3 tracking-widest uppercase">{item.title}</h4>
                    <p className="text-zinc-600 text-[9px] tracking-widest uppercase leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <SectionTitle title="Inteligência Silenciosa" subtitle="Como o Lúmina age por você" />
          <div className="grid md:grid-cols-3 gap-16 mt-20">
            {[
              { step: '01', title: 'Escaneamento Local', desc: 'A IA mapeia sua biblioteca localmente. Nada sai do seu celular sem sua permissão.' },
              { step: '02', title: 'Triagem Estética', desc: 'O algoritmo identifica fotos tecnicamente ruins, duplicatas e lixo digital instantaneamente.' },
              { step: '03', title: 'Curadoria de Elite', desc: 'Suas melhores fotos são destacadas em álbuns dinâmicos para fácil acesso e compartilhamento.' }
            ].map((step, i) => (
              <div key={i} className="relative p-10 bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-all group">
                <span className="text-8xl font-serif text-gold-600/5 absolute -top-4 -left-2 group-hover:text-gold-600/10 transition-colors">{step.step}</span>
                <h3 className="text-xl font-serif text-white mb-6 tracking-widest relative z-10 uppercase">{step.title}</h3>
                <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase leading-loose font-light relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-600/5 opacity-30 pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-10 tracking-widest">A Revolução na palma da sua mão</h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-16 font-light tracking-[0.3em] uppercase leading-relaxed">
            Pare de gerenciar arquivos. Comece a reviver memórias. Por apenas <span className="text-gold-500 font-bold">R$ 19,90/mês</span>.
          </p>
          <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
            <button className="bg-gold-600 text-black px-20 py-6 rounded-sm font-bold tracking-[0.5em] uppercase hover:bg-gold-500 transition-all hover:scale-105 shadow-[0_0_50px_rgba(217,119,6,0.2)]">
              QUERO O LÚMINA PRO AGORA
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};
