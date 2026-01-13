
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, ChevronLeft, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const fetchPosts = () => {
    if (!DRIVE_SCRIPT_URL) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        // O Script já filtra os posts válidos
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Sincronia Blog:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-4xl">
          <button onClick={() => setSelectedPost(null)} className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-16 hover:text-white transition-all group font-bold">
            <ChevronLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Retornar à Biblioteca
          </button>
          
          <article>
            <div className="mb-20 text-center">
               <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase mb-6 block">MANIFESTO EDITORIAL • {selectedPost.date}</span>
               <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase italic leading-tight">{selectedPost.title}</h1>
               <div className="w-24 h-px bg-gold-600/40 mx-auto mt-12"></div>
            </div>

            <div className="relative aspect-video mb-24 rounded-sm border border-zinc-900 overflow-hidden shadow-2xl bg-zinc-900">
              <img 
                src={selectedPost.imageUrl || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'} 
                className="w-full h-full object-cover grayscale brightness-75" 
                alt={selectedPost.title} 
                onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>

            <div className="max-w-3xl mx-auto">
               <div className="text-zinc-300 text-xl md:text-2xl leading-[2.4] font-light italic whitespace-pre-wrap font-serif selection:bg-gold-600/30">
                  {selectedPost.content || "O conteúdo está sendo processado pelo laboratório..."}
               </div>
            </div>
            
            <div className="mt-32 pt-12 border-t border-zinc-900 text-center">
               <p className="text-zinc-700 text-[10px] tracking-[0.8em] uppercase font-bold italic">A verdade é o luxo definitivo.</p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
          <button onClick={fetchPosts} className="text-gold-500 hover:text-white transition-colors mb-4 md:mb-12 flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase font-bold bg-zinc-900/50 px-6 py-3 rounded-full border border-zinc-800">
            <RefreshCw size={14} className={loading ? 'animate-spin text-gold-500' : ''} /> 
            {loading ? 'Sincronizando...' : 'Atualizar Editorial'}
          </button>
        </div>
        
        <div className="grid gap-32 mt-16">
          {loading ? (
             [1, 2, 3].map(i => <Skeleton key={i} className="h-96 w-full" />)
          ) : posts.length === 0 ? (
            <div className="text-center py-48 border border-dashed border-zinc-900 rounded-sm bg-zinc-900/20">
              <BookOpen size={48} className="text-zinc-800 mx-auto mb-8 opacity-20" />
              <h3 className="text-white text-lg font-serif mb-4 tracking-widest italic">O laboratório está vazio</h3>
              <p className="text-zinc-700 tracking-[0.4em] uppercase text-[10px] font-bold max-w-md mx-auto leading-loose">
                Não encontramos manifestos válidos na sua pasta.<br/>
                Certifique-se de que enviou arquivos <strong className="text-white">.txt</strong> e <strong className="text-white">.png</strong> reais (não Google Docs).
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} onClick={() => setSelectedPost(post)} className="group cursor-pointer grid lg:grid-cols-12 gap-16 items-center animate-fade-in">
                <div className="lg:col-span-7 aspect-[16/9] overflow-hidden bg-zinc-900 rounded-sm shadow-2xl relative border border-zinc-800">
                  <img 
                    src={post.imageUrl} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-all duration-[1.5s] group-hover:scale-105" 
                    alt={post.title} 
                    onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
                <div className="lg:col-span-5">
                  <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase block mb-6">{post.date} • EDITORIAL</span>
                  <h3 className="text-3xl font-serif text-white mb-10 group-hover:text-gold-500 transition-all tracking-[0.1em] leading-tight uppercase italic decoration-gold-600/0 group-hover:decoration-gold-600/50 underline underline-offset-8 duration-700">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold group-hover:translate-x-6 transition-transform duration-500">
                    REVELAR MANIFESTO <ArrowRight size={18} className="ml-6" />
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
