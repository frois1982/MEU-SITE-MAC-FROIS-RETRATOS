
import React, { useState, useEffect } from 'react';
import { SectionTitle } from '../components/UI';
import { EDITORIAL_DATABASE } from '../config';
import { ArrowRight, ChevronLeft, BookOpen, Quote, Clock, Share2, ArrowUpRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
}

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // O blog agora consome diretamente do arquivo de configuração, sem necessidade de fetch ou scripts externos.
  // Isso garante que o conteúdo esteja SEMPRE disponível e nunca dê erro de carregamento.
  const posts = EDITORIAL_DATABASE;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPost]);

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-4xl">
          <button 
            onClick={() => setSelectedPost(null)} 
            className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-16 hover:text-white transition-all group font-bold"
          >
            <ChevronLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
            Biblioteca Editorial
          </button>
          
          <article className="animate-slide-up">
            <div className="mb-24 text-center">
               <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="h-px w-8 bg-gold-600/30"></span>
                  <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase block">MANIFESTO • {selectedPost.date}</span>
                  <span className="h-px w-8 bg-gold-600/30"></span>
               </div>
               <h1 className="text-4xl md:text-7xl font-serif text-white tracking-widest uppercase italic leading-[1.1] selection:bg-gold-600/30">
                 {selectedPost.title}
               </h1>
            </div>

            <div className="relative aspect-video mb-24 rounded-sm border border-zinc-900 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] bg-zinc-900 group">
              <img 
                src={selectedPost.imageUrl} 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 transition-all duration-[2s] scale-105 group-hover:scale-100" 
                alt={selectedPost.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 border-l border-gold-600 pl-6">
                 <p className="text-white text-[10px] tracking-[0.4em] uppercase font-bold">Mac Frois</p>
                 <p className="text-zinc-500 text-[9px] tracking-[0.3em] uppercase italic">Retratista de Posicionamento</p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
               <div className="text-zinc-300 text-xl md:text-2xl leading-[2.6] font-light italic font-serif whitespace-pre-wrap selection:bg-gold-600/30 drop-shadow-sm">
                  {selectedPost.content}
               </div>
               
               <div className="mt-32 pt-16 border-t border-zinc-900 flex flex-col items-center">
                  <Quote className="text-gold-600/20 w-16 h-16 mb-8" />
                  <p className="text-zinc-700 text-xs tracking-[0.6em] uppercase font-bold italic text-center max-w-sm">
                    A verdade é o único luxo que resiste ao tempo.
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
        <div className="mb-32">
          <SectionTitle title="Jornal Editorial" subtitle="A Narrativa Visual de Mac Frois" />
        </div>
        
        <div className="grid gap-40 mt-32">
          {posts.length === 0 ? (
            <div className="text-center py-48 border border-dashed border-zinc-900 rounded-sm bg-zinc-900/20">
              <BookOpen size={48} className="text-zinc-800 mx-auto mb-8 opacity-20" />
              <p className="text-zinc-700 tracking-[0.4em] uppercase text-[10px] font-bold">O Cofre Editorial está aguardando o primeiro manifesto.</p>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)} 
                className={`group cursor-pointer grid lg:grid-cols-12 gap-16 items-center animate-fade-in transition-all duration-700 ${idx % 2 !== 0 ? 'lg:direction-rtl' : ''}`}
              >
                <div className={`lg:col-span-7 aspect-[16/10] overflow-hidden bg-zinc-900 rounded-sm shadow-2xl relative border border-zinc-900 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <img 
                    src={post.imageUrl} 
                    className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-100 transition-all duration-[2s] group-hover:scale-105" 
                    alt={post.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-8 right-8 text-[40px] font-serif text-white/5 font-bold italic">0{idx + 1}</div>
                </div>
                
                <div className={`lg:col-span-5 ${idx % 2 !== 0 ? 'lg:order-1 lg:text-right' : ''}`}>
                  <div className={`flex items-center gap-4 mb-8 ${idx % 2 !== 0 ? 'justify-end' : ''}`}>
                    <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase">{post.date}</span>
                    <span className="h-px w-8 bg-gold-600/30"></span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-10 group-hover:text-gold-500 transition-all duration-500 tracking-widest uppercase italic leading-tight group-hover:translate-x-2 transition-transform">
                    {post.title}
                  </h3>
                  
                  <p className="text-zinc-500 text-xs tracking-widest leading-loose mb-10 line-clamp-3 uppercase font-light">
                    {post.content.substring(0, 180)}...
                  </p>
                  
                  <div className={`flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold group-hover:text-white transition-all ${idx % 2 !== 0 ? 'justify-end' : ''}`}>
                    {idx % 2 !== 0 && <ArrowUpRight size={16} className="mr-4 opacity-0 group-hover:opacity-100 transition-all" />}
                    LER MANIFESTO COMPLETO 
                    {idx % 2 === 0 && <ArrowRight size={18} className="ml-6 group-hover:translate-x-4 transition-transform" />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-60 border-t border-zinc-900 pt-20 text-center">
           <h4 className="text-white text-sm font-serif italic tracking-[0.4em] uppercase mb-6">Assine a Verdade</h4>
           <p className="text-zinc-600 text-[9px] tracking-[0.4em] uppercase font-bold max-w-sm mx-auto leading-loose">
             Receba as reflexões de Mac Frois sobre estética e posicionamento diretamente.
           </p>
        </div>
      </div>
    </div>
  );
};
