
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Skeleton, Button } from '../components/UI';
import { Calendar, Clock, ArrowRight, BookOpen, Share2, ChevronLeft } from 'lucide-react';

const DRIVE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvauekYnaF2p429x0aB2eaAWNIBKdth4INNZtooTpH62GATSPzXEbYhM3jEgwAFedynw/exec";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string;
  imageUrl: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtra arquivos que começam com POST_
          const blogFiles = data.filter((f: any) => f.name.toUpperCase().startsWith('POST_'));
          
          const mappedPosts: BlogPost[] = blogFiles.map((file: any) => {
            // Nome esperado: POST_YYYY-MM-DD_Categoria_Titulo.txt
            const parts = file.name.split('_');
            const date = parts[1] || 'Recente';
            const category = parts[2] || 'Geral';
            const title = parts[3]?.replace('.txt', '').replace(/-/g, ' ') || 'Sem Título';
            
            // Tenta achar imagem correspondente (mesmo nome mas .jpg/.png)
            const imgName = file.name.replace('.txt', '');
            const imgFile = data.find((f: any) => 
              f.name.toUpperCase().startsWith(imgName.toUpperCase()) && 
              (f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.jpeg'))
            );

            return {
              id: file.id,
              title: title.toUpperCase(),
              excerpt: "Clique para ler este artigo completo sobre posicionamento e autoridade visual...",
              date: date,
              category: category.toUpperCase(),
              content: "Carregando conteúdo...", // Conteúdo será buscado ao abrir
              contentUrl: file.url,
              imageUrl: imgFile ? imgFile.url : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop&grayscale=true'
            };
          });

          setPosts(mappedPosts);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Blog Drive:", err);
        setLoading(false);
      });
  }, []);

  const openPost = async (post: any) => {
    setSelectedPost({ ...post, content: 'Buscando artigo...' });
    try {
      const res = await fetch(post.contentUrl);
      const text = await res.text();
      setSelectedPost({ ...post, content: text });
    } catch (e) {
      setSelectedPost({ ...post, content: 'Erro ao carregar o texto. Por favor, tente novamente.' });
    }
  };

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-4xl">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-gold-500 text-xs tracking-[0.3em] uppercase mb-12 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} className="mr-2" /> Voltar para o Editorial
          </button>
          
          <article>
            <span className="text-gold-600 font-bold text-[10px] tracking-[0.4em] uppercase mb-4 block">
              {selectedPost.category} • {selectedPost.date}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-12 leading-tight tracking-wider">
              {selectedPost.title}
            </h1>
            
            <div className="aspect-[21/9] w-full overflow-hidden mb-16 rounded-sm">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale brightness-75" alt={selectedPost.title} />
            </div>

            <div className="prose prose-invert max-w-none">
               <div className="text-zinc-400 text-lg leading-loose font-light tracking-wide space-y-8 whitespace-pre-wrap">
                  {selectedPost.content}
               </div>
            </div>

            <div className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center text-black font-bold">MF</div>
                  <div>
                    <p className="text-white text-xs font-bold tracking-widest uppercase">Mac Frois</p>
                    <p className="text-zinc-500 text-[10px] tracking-widest uppercase">Retratista & Estrategista</p>
                  </div>
               </div>
               <button className="text-zinc-500 hover:text-gold-500 transition-colors">
                  <Share2 size={20} />
               </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
          
          <div className="grid gap-16 mt-20">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full" />)
            ) : posts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800">
                <p className="text-zinc-600 tracking-widest uppercase text-xs">Aguardando novas histórias serem escritas...</p>
                <p className="text-zinc-800 text-[10px] mt-2 uppercase tracking-tighter">Suba arquivos com prefixo POST_ no seu Drive</p>
              </div>
            ) : (
              posts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => openPost(post)}
                  className="group cursor-pointer grid md:grid-cols-2 gap-10 items-center border-b border-zinc-900 pb-16"
                >
                  <div className="overflow-hidden aspect-video md:aspect-square bg-zinc-900">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gold-600 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">{post.category}</span>
                    <h3 className="text-3xl font-serif text-white mb-6 group-hover:text-gold-500 transition-colors tracking-widest leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-zinc-500 text-sm font-light leading-loose tracking-widest uppercase mb-8">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-zinc-600 text-[10px] tracking-[0.2em] uppercase mt-auto">
                      <Calendar size={12} className="mr-2" /> {post.date}
                      <span className="mx-4 opacity-20">|</span>
                      <BookOpen size={12} className="mr-2" /> 4 MIN LER
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
