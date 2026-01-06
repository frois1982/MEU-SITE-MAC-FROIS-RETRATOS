
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Calendar, Clock, ArrowRight, BookOpen, Share2, ChevronLeft, User, AlertTriangle, RefreshCw, ImageIcon, ExternalLink, Quote } from 'lucide-react';

interface BlogPost {
  id: string;
  fileName: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string;
  contentUrl: string;
  viewUrl: string;
  imageUrl: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const getDirectDownloadUrl = (url: string) => {
    if (!url) return '';
    let fileId = '';
    if (url.includes('drive.google.com')) {
      fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
    }
    return fileId ? `https://docs.google.com/uc?id=${fileId}&export=download&t=${Date.now()}` : url;
  };

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) return;

    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtrar apenas arquivos .txt que sejam do BLOG
          const textFiles = data.filter((f: any) => 
            f.name.toLowerCase().endsWith('.txt') && f.name.toLowerCase().includes('blog')
          );
          
          const mappedPosts: BlogPost[] = textFiles.map((file: any) => {
            const fileName = file.name.toUpperCase();
            const parts = file.name.split('_');
            
            // Extrair o Identificador (ID ou Slug)
            // Ex: blog_06-01-2026_ID123456_TEMA.txt -> ID123456
            const identifier = parts.find(p => p.includes('ID')) || parts[parts.length - 1].split('.')[0];
            
            // Busca Inteligente pela imagem:
            // Procura qualquer imagem que contenha o mesmo Identificador Único
            const imgFile = data.find((f: any) => {
              const fName = f.name.toUpperCase();
              const isImg = fName.endsWith('.JPG') || fName.endsWith('.PNG') || fName.endsWith('.JPEG') || fName.endsWith('.WEBP');
              return isImg && fName.includes(identifier.split('.')[0]);
            });

            let title = parts[parts.length - 1].split('.')[0].replace(/-/g, ' ');
            
            return {
              id: file.id,
              fileName: file.name,
              title: title.toUpperCase(),
              excerpt: "Manifesto Editorial Mac Frois.",
              date: parts[1] || 'RECENTE',
              category: 'EDITORIAL',
              content: "", 
              contentUrl: getDirectDownloadUrl(file.url),
              viewUrl: file.url,
              imageUrl: imgFile ? getDirectDownloadUrl(imgFile.url) : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'
            };
          });

          setPosts(mappedPosts.reverse());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Blog:", err);
        setLoading(false);
      });
  }, []);

  const openPost = async (post: BlogPost) => {
    window.scrollTo(0, 0);
    setSelectedPost({ ...post, content: 'Sincronizando...' });
    
    try {
      const res = await fetch(post.contentUrl);
      const text = await res.text();
      
      // Se o Drive retornar HTML (erro de permissão), avisa o usuário
      if (text.includes('<!doctype') || text.includes('<html')) {
        setSelectedPost({ ...post, content: 'ERRO: O arquivo no Drive não está público. Altere para "Qualquer pessoa com o link".' });
      } else {
        setSelectedPost({ ...post, content: text.replace(/[#*`_]/g, '') });
      }
    } catch (e) {
      setSelectedPost({ ...post, content: 'Falha ao conectar com o servidor de arquivos.' });
    }
  };

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-3xl">
          <button onClick={() => setSelectedPost(null)} className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-12 font-bold">
            <ChevronLeft size={16} className="mr-3" /> Voltar
          </button>
          
          <article>
            <h1 className="text-4xl font-serif text-white mb-8 tracking-widest uppercase italic">{selectedPost.title}</h1>
            <div className="aspect-video overflow-hidden mb-16 rounded-sm border border-zinc-900 shadow-2xl">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale" alt={selectedPost.title} />
            </div>
            <div className="text-zinc-300 text-lg leading-[2.2] font-light italic whitespace-pre-wrap font-serif">
              {selectedPost.content}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
        <div className="grid gap-20 mt-24">
          {loading ? <Skeleton className="h-64 w-full" /> : posts.map((post) => (
            <div key={post.id} onClick={() => openPost(post)} className="group cursor-pointer grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 aspect-video overflow-hidden bg-zinc-900 rounded-sm">
                <img src={post.imageUrl} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" alt={post.title} />
              </div>
              <div className="lg:col-span-5">
                <span className="text-gold-600 text-[10px] font-bold tracking-[0.6em] uppercase block mb-4">{post.date}</span>
                <h3 className="text-2xl font-serif text-white mb-6 group-hover:text-gold-500 transition-colors tracking-widest leading-tight uppercase italic">{post.title}</h3>
                <div className="flex items-center text-gold-500 text-[10px] tracking-[0.4em] uppercase font-bold group-hover:translate-x-3 transition-transform">
                  LER EDITORIAL <ArrowRight size={14} className="ml-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
