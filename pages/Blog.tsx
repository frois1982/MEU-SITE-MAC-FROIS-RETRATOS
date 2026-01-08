
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, ChevronLeft, Search, BookOpen, Clock, AlertTriangle } from 'lucide-react';

interface BlogPost {
  id: string;
  syncID: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
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
          // FILTRAGEM: Busca arquivos de texto que contenham POST_ no nome
          const textFiles = data.filter((f: any) => 
            f.name.toUpperCase().includes('POST_') && 
            f.name.toUpperCase().endsWith('.TXT')
          );
          
          const mapped = textFiles.map((file: any) => {
            const fileNameUpper = file.name.toUpperCase();
            const parts = fileNameUpper.split('_');
            
            // O ID de sincronia costuma ser a segunda parte: POST_[ID]_...
            // Mas vamos buscar qualquer parte que tenha 5 caracteres (nosso padrão de ID)
            const syncID = parts.find(p => p.length === 5) || parts[1] || 'POST';
            
            // Busca a imagem correspondente que tenha o mesmo SyncID e contenha FOTO ou CAPA
            const imgFile = data.find((f: any) => {
              const fNameUpper = f.name.toUpperCase();
              const isImg = fNameUpper.endsWith('.JPG') || fNameUpper.endsWith('.JPEG') || fNameUpper.endsWith('.PNG');
              return isImg && fNameUpper.includes(syncID);
            });

            // Limpeza do título: remove prefixos e sufixos
            let title = file.name
              .replace(/POST_/gi, '')
              .replace(new RegExp(syncID, 'gi'), '')
              .replace(/_TEXTO/gi, '')
              .replace(/_/g, ' ')
              .replace('.txt', '')
              .replace('.TXT', '')
              .trim();

            return {
              id: file.id,
              syncID: syncID,
              title: title.toUpperCase() || 'MANIFESTO EDITORIAL',
              content: file.content || 'CONTEÚDO NÃO ENCONTRADO NO ARQUIVO.',
              imageUrl: imgFile ? imgFile.url : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true',
              date: new Date().toLocaleDateString('pt-BR') // Fallback para data
            };
          });

          // Mostra os mais recentes primeiro
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
            <ChevronLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Retornar à Biblioteca
          </button>
          
          <article>
            <div className="mb-20 text-center">
               <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase mb-6 block">Editorial • {selectedPost.syncID}</span>
               <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase italic leading-tight">{selectedPost.title}</h1>
               <div className="w-24 h-px bg-gold-600/40 mx-auto mt-12"></div>
            </div>

            <div className="relative aspect-video mb-24 rounded-sm border border-zinc-900 overflow-hidden shadow-2xl">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale brightness-75" alt={selectedPost.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="max-w-3xl mx-auto">
               <div className="text-zinc-300 text-xl md:text-2xl leading-[2.4] font-light italic whitespace-pre-wrap font-serif selection:bg-gold-600/30">
                  {selectedPost.content}
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
        <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
        
        <div className="grid gap-32 mt-32">
          {loading ? (
             [1, 2, 3].map(i => <Skeleton key={i} className="h-96 w-full" />)
          ) : posts.length === 0 ? (
            <div className="text-center py-48 border border-dashed border-zinc-900 rounded-sm bg-zinc-900/20">
              <BookOpen size={48} className="text-zinc-800 mx-auto mb-8 opacity-20" />
              <h3 className="text-white text-lg font-serif mb-4 tracking-widest italic">Nenhum Manifesto Encontrado</h3>
              <p className="text-zinc-700 tracking-[0.4em] uppercase text-[10px] font-bold max-w-md mx-auto leading-loose">
                Certifique-se de que os arquivos na pasta do Drive começam com <strong className="text-gold-500">POST_</strong> e estão como <strong className="text-gold-500">Públicos</strong>.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} onClick={() => setSelectedPost(post)} className="group cursor-pointer grid lg:grid-cols-12 gap-16 items-center animate-fade-in">
                <div className="lg:col-span-7 aspect-[16/9] overflow-hidden bg-zinc-900 rounded-sm shadow-2xl relative border border-zinc-800">
                  <img src={post.imageUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-all duration-[1.5s] group-hover:scale-105" alt={post.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] px-3 py-1 tracking-widest uppercase font-bold">{post.syncID}</span>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase block mb-6 flex items-center gap-4">
                    <Clock size={12} /> EDITORIAL
                  </span>
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
