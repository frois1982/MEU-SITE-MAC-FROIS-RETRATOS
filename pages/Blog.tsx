
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, ChevronLeft, AlertTriangle, RefreshCw, Search } from 'lucide-react';

interface BlogPost {
  id: string;
  syncID: string;
  title: string;
  content: string;
  imageUrl: string;
  viewUrl: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) return;

    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // FILTRAGEM: Busca apenas arquivos que comecem com POST_
          const textFiles = data.filter((f: any) => f.name.toUpperCase().startsWith('POST_') && f.name.toUpperCase().endsWith('.TXT'));
          
          const mapped = textFiles.map((file: any) => {
            const parts = file.name.split('_');
            const syncID = parts[1]; // ID de sincronia
            
            // Busca a imagem correspondente pelo ID
            const imgFile = data.find((f: any) => 
              f.name.toUpperCase().startsWith('POST_') && 
              f.name.toUpperCase().includes(syncID) && 
              (f.name.toUpperCase().endsWith('.JPG') || f.name.toUpperCase().endsWith('.JPEG') || f.name.toUpperCase().endsWith('.PNG'))
            );

            return {
              id: file.id,
              syncID: syncID,
              title: parts.slice(2).join(' ').replace('.TXT', '').replace('.txt', '').replace(/-/g, ' ') || 'MANIFESTO EDITORIAL',
              content: file.content || 'Erro: Conteúdo não processado pelo script.',
              imageUrl: imgFile ? imgFile.url : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true',
              viewUrl: file.url
            };
          });

          setPosts(mapped.reverse());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Blog:", err);
        setLoading(false);
      });
  }, []);

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-4xl">
          <button onClick={() => setSelectedPost(null)} className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-16 hover:text-white transition-all group font-bold">
            <ChevronLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Retornar
          </button>
          
          <article>
            <div className="mb-20 text-center">
               <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase mb-6 block">Editorial • {selectedPost.syncID}</span>
               <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase italic leading-tight">{selectedPost.title}</h1>
               <div className="w-24 h-px bg-gold-600/40 mx-auto mt-12"></div>
            </div>

            <img src={selectedPost.imageUrl} className="w-full aspect-video object-cover grayscale brightness-90 mb-24 rounded-sm border border-zinc-900 shadow-2xl" alt={selectedPost.title} />

            <div className="max-w-3xl mx-auto">
               <div className="text-zinc-300 text-xl md:text-2xl leading-[2.4] font-light italic whitespace-pre-wrap font-serif selection:bg-gold-600/30">
                  {selectedPost.content}
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
        <SectionTitle title="Jornal Editorial" subtitle="Arquivo de Manifestos" />
        
        <div className="grid gap-28 mt-32">
          {loading ? (
             [1, 2, 3].map(i => <Skeleton key={i} className="h-96 w-full" />)
          ) : posts.length === 0 ? (
            <div className="text-center py-48 border border-dashed border-zinc-900 rounded-sm">
              <Search size={48} className="text-zinc-800 mx-auto mb-8 opacity-20" />
              <p className="text-zinc-700 tracking-[0.6em] uppercase text-xs font-bold">Suba arquivos 'POST_' na sua pasta do Drive.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} onClick={() => setSelectedPost(post)} className="group cursor-pointer grid lg:grid-cols-12 gap-20 items-center animate-fade-in">
                <div className="lg:col-span-7 aspect-[16/9] overflow-hidden bg-zinc-900 rounded-sm shadow-2xl relative">
                  <img src={post.imageUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" alt={post.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
                <div className="lg:col-span-5">
                  <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase block mb-6">Editorial</span>
                  <h3 className="text-3xl font-serif text-white mb-10 group-hover:text-gold-500 transition-all tracking-[0.2em] leading-tight uppercase italic">{post.title}</h3>
                  <div className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold group-hover:translate-x-6 transition-transform">
                    REVELAR CONTEÚDO <ArrowRight size={18} className="ml-6" />
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
