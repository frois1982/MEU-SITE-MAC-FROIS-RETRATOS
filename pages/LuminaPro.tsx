
import React from 'react';
import { Button, SectionTitle } from '../components/UI';
import { Cpu, Zap, Clock, ShieldCheck, Check, Smartphone, Layers, LayoutGrid } from 'lucide-react';

export const LuminaPro: React.FC = () => {
  // MAC: Quando tiver o link da Play Store, coloque aqui!
  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.macfrois.luminapro";

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

          {/* Placeholder para VSL (Vídeo de Vendas) */}
          <div className="max-w-4xl mx-auto aspect-video bg-zinc-900 border border-zinc-800 rounded-sm mb-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 group-hover:bg-black/40 transition-all cursor-pointer">
                <div className="w-20 h-20 bg-gold-600 rounded-full flex items-center justify-center text-black shadow-2xl transform group-hover:scale-110 transition-transform">
                    <Zap size={40} fill="currentColor" />
                </div>
            </div>
            {/* Aqui entrará o seu iframe do YouTube ou Vimeo */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase">Assista ao Manifesto e Entenda o Poder</p>
            </div>
          </div>

          <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
            <Button className="px-16 py-6 text-lg tracking-[0.4em] shadow-[0_0_30px_rgba(217,119,6,0.3)] animate-pulse hover:animate-none">
              BAIXAR NA GOOGLE PLAY
            </Button>
          </a>
          <p className="text-zinc-600 text-[10px] mt-6 tracking-[0.2em] uppercase">Disponível agora para Android</p>
        </div>
      </section>

      {/* Problema e Solução */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl font-serif text-white mb-8 tracking-widest italic">O Caos Silencioso da sua Galeria</h2>
              <div className="space-y-6 text-zinc-400 font-light text-sm tracking-widest uppercase leading-relaxed">
                <p>Quantas fotos você tem hoje que nunca mais vai olhar? Quantos prints, fotos repetidas e imagens sem qualidade entopem seu armazenamento e sua produtividade?</p>
                <p className="text-gold-500 font-bold">O Lúmina Pro nasceu para te devolver o tempo que você perde procurando o que importa.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <Cpu />, title: 'IA Ativa', desc: 'Processamento em tempo real' },
                 { icon: <LayoutGrid />, title: 'Clusters', desc: 'Organização por contexto' },
                 { icon: <ShieldCheck />, title: 'Privacy', desc: 'Segurança total dos dados' },
                 { icon: <Clock />, title: 'Tempo', desc: 'Recupere horas da sua semana' }
               ].map((item, i) => (
                 <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm text-center group hover:border-gold-500 transition-all">
                    <div className="text-gold-500 mb-4 flex justify-center">{item.icon}</div>
                    <h4 className="text-white text-xs font-bold mb-2 tracking-widest uppercase">{item.title}</h4>
                    <p className="text-zinc-500 text-[10px] tracking-tighter uppercase">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle title="A Ciência da Organização" subtitle="Processo Automatizado" />
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Escaneamento', desc: 'A IA mapeia toda sua biblioteca sem necessidade de upload.' },
              { step: '02', title: 'Triagem Inteligente', desc: 'Fotos similares e desnecessárias são agrupadas para exclusão.' },
              { step: '03', title: 'Álbuns Dinâmicos', desc: 'Suas melhores lembranças são categorizadas automaticamente.' }
            ].map((step, i) => (
              <div key={i} className="relative p-8 border-l border-zinc-800">
                <span className="text-6xl font-serif text-gold-600/20 absolute -top-4 -left-8">{step.step}</span>
                <h3 className="text-xl font-serif text-white mb-4 tracking-widest relative z-10 uppercase">{step.title}</h3>
                <p className="text-zinc-500 text-sm tracking-widest uppercase leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gold-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-black mb-10 tracking-widest">LIBERTE SEU TEMPO AGORA</h2>
          <p className="text-black/80 max-w-xl mx-auto mb-12 font-bold tracking-widest uppercase">
            Apenas R$ 19,90/mês para ter um assistente pessoal cuidando da sua imagem digital.
          </p>
          <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
            <button className="bg-black text-white px-16 py-6 rounded-sm font-bold tracking-[0.5em] uppercase hover:scale-105 transition-all shadow-2xl">
              INSTALAR LÚMINA PRO
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};
