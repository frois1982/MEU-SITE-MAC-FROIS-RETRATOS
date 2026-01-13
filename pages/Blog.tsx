
import React, { useState, useEffect, useMemo } from 'react';
import { SectionTitle } from '../components/UI';
import { EDITORIAL_DATABASE } from '../config';
import { ArrowRight, ChevronLeft, BookOpen, Quote } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
}

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  const posts = useMemo(() => {
    try {
      if (!Array.isArray(EDITORIAL_DATABASE)) return [];
      // Filtra posts válidos e garante que a ordem seja a da colagem (topo primeiro)
      return EDITORIAL_DATABASE.filter(post => 
        post && post.id && post.title && post.content
      );
    } catch (e) {
      console.error("Erro banco de dados:", e);
      return [];
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPost]);

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 bg-[#050505] min-h-screen animate-fade-in text-zinc-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <button 
            onClick={() => setSelectedPost(null)} 
            className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-12 hover:text-white transition-all font-bold group"
          >
            <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Voltar ao Jornal
          </button>
          
          <article className="animate-slide-up">
            {/* HERO IMAGE NO TOPO DO ARTIGO */}
            <div className="relative w-full mb-16 overflow-hidden rounded-sm shadow-2xl border border-zinc-900 group bg-zinc-900 aspect-video md:aspect-[16/7]">
              <img 
                src={selectedPost.imageUrl} 
                className="w-full h-full object-cover grayscale brightness-90 group-hover:brightness-110 transition-all duration-[3s] scale-105 group-hover:scale-100" 
                alt={selectedPost.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6 border-l-2 border-gold-600 pl-4">
                 <p className="text-white text-[10px] tracking-[0.4em] uppercase font-bold">Mac Frois • Retratista</p>
                 <p className="text-zinc-500 text-[8px] tracking-[0.3em] uppercase italic">Estúdio Editorial</p>
              </div>
            </div>

            <header className="mb-16 text-center">
               <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-gold-600 text-[9px] font-bold tracking-[0.6em] uppercase block">MANIFESTO EDITORIAL • {selectedPost.date}</span>
               </div>
               <h1 className="text-3xl md:text-6xl font-serif text-white tracking-[0.2em] uppercase italic leading-tight mb-8">
                 {selectedPost.title}
               </h1>
               <div className="w-16 h-px bg-gold-600/40 mx-auto"></div>
            </header>

            <div className="max-w-2xl mx-auto">
               <div className="text-zinc-300 text-lg md:text-2xl leading-[2.4] font-light italic font-serif whitespace-pre-wrap selection:bg-gold-600/30 drop-shadow-sm first-letter:text-7xl first-letter:font-serif first-letter:text-gold-500 first-letter:mr-4 first-letter:float-left first-letter:mt-2">
                  {selectedPost.content}
               </div>
               
               <div className="mt-32 pt-16 border-t border-zinc-900 flex flex-col items-center opacity-40">
                  <Quote className="text-gold-600 w-10 h-10 mb-6" />
                  <p className="text-zinc-500 text-[9px] tracking-[0.6em] uppercase font-bold italic text-center max-w-sm">
                    A verdade é a única estrutura que não cede ao tempo.
                  </p>
               </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-24 text-center">
          <SectionTitle title="Jornal Editorial" subtitle="A Narrativa de Mac Frois" />
        </div>
        
        <div className="grid gap-32">
          {posts.length === 0 ? (
            <div className="text-center py-40 border border-dashed border-zinc-900 rounded-sm opacity-50">
              <BookOpen size={40} className="text-zinc-800 mx-auto mb-6" />
              <p className="text-zinc-700 tracking-[0.4em] uppercase text-[9px] font-bold">O arquivo está sendo atualizado.</p>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)} 
                className={`group cursor-pointer grid lg:grid-cols-12 gap-12 items-center animate-fade-in transition-all duration-1000`}
              >
                <div className={`lg:col-span-6 aspect-[16/9] overflow-hidden bg-zinc-900 rounded-sm shadow-xl relative border border-zinc-900 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <img 
                    src={post.imageUrl} 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-[2s] group-hover:scale-105" 
                    alt={post.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                </div>
                
                <div className={`lg:col-span-6 ${idx % 2 !== 0 ? 'lg:order-1 lg:text-right' : ''}`}>
                  <div className={`flex items-center gap-3 mb-6 ${idx % 2 !== 0 ? 'justify-end' : ''}`}>
                    <span className="text-gold-600 text-[8px] font-bold tracking-[0.6em] uppercase">{post.date}</span>
                    <span className="h-px w-6 bg-gold-600/20"></span>
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-serif text-white mb-8 group-hover:text-gold-500 transition-all duration-700 tracking-wider uppercase italic leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-zinc-500 text-[11px] tracking-widest leading-relaxed mb-10 line-clamp-2 uppercase font-light max-w-md mx-auto lg:mx-0">
                    {post.content.substring(0, 150)}...
                  </p>
                  
                  <div className={`flex items-center text-gold-500 text-[9px] tracking-[0.4em] uppercase font-black group-hover:text-white transition-all ${idx % 2 !== 0 ? 'justify-end' : ''}`}>
                    Ler Manifesto 
                    <ArrowRight size={14} className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
