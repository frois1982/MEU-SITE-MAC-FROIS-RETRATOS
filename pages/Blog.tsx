
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
          // Filtrar APENAS arquivos .txt para o corpo do blog
          const textFiles = data.filter((f: any) => 
            f.name.toLowerCase().endsWith('.txt') && f.name.toUpperCase().includes('BLOG')
          );
          
          const mappedPosts: BlogPost[] = textFiles.map((file: any) => {
            const fileNameUpper = file.name.toUpperCase();
            const parts = file.name.split('_');
            
            // DNA de sincronia (ID Único)
            const identifier = parts.find(p => p.startsWith('ID')) || parts[2] || 'NO-ID';
            
            // Busca a imagem que contém o MESMO ID do texto
            const imgFile = data.find((f: any) => {
              const fNameUpper = f.name.toUpperCase();
              const isImg = fNameUpper.endsWith('.JPG') || fNameUpper.endsWith('.PNG') || fNameUpper.endsWith('.JPEG') || fNameUpper.endsWith('.WEBP');
              // Critério rigoroso: Deve ser imagem e conter o ID do post
              return isImg && fNameUpper.includes(identifier);
            });

            // Extração limpa do título (tudo após o ID)
            const titlePart = fileNameUpper.split(identifier)[1] || file.name;
            const title = titlePart.replace('.TXT', '').replace(/_/g, ' ').replace(/-/g, ' ').trim();
            
            return {
              id: file.id,
              fileName: file.name,
              title: title || 'EDITORIAL SEM TÍTULO',
              excerpt: "Manifesto sobre a verdade visual e o poder do posicionamento.",
              date: parts[1] || 'RECENTE',
              category: 'EDITORIAL',
              content: "", 
              contentUrl: getDirectDownloadUrl(file.url),
              viewUrl: file.url,
              imageUrl: imgFile ? getDirectDownloadUrl(imgFile.url) : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'
            };
          });

          // Inverter para mostrar os mais novos primeiro
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
    setSelectedPost({ ...post, content: 'Manifestando editorial...' });
    
    try {
      const res = await fetch(post.contentUrl);
      const text = await res.text();
      
      // Validação: Se o texto começar com o cabeçalho de uma imagem, o Drive enviou o arquivo errado
      if (text.includes('PNG') || text.includes('JFIF') || text.includes('Exif')) {
        setSelectedPost({ ...post, content: 'ERRO DE SINCRONIA: O sistema detectou um arquivo de imagem onde deveria estar o texto. Verifique os nomes no Drive.' });
        return;
      }

      if (text.includes('<!doctype') || text.includes('<html')) {
        setSelectedPost({ ...post, content: 'ACESSO PRIVADO: O arquivo no Drive precisa estar compartilhado como "Qualquer pessoa com o link".' });
      } else {
        setSelectedPost({ ...post, content: text.replace(/[#*`_]/g, '').trim() });
      }
    } catch (e) {
      setSelectedPost({ ...post, content: 'Falha na conexão com o laboratório de arquivos.' });
    }
  };

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-3xl">
          <button onClick={() => setSelectedPost(null)} className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-12 hover:text-white transition-all group font-bold">
            <ChevronLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Voltar à Biblioteca
          </button>
          
          <article>
            <div className="mb-12">
               <span className="text-gold-600 text-[10px] font-bold tracking-[0.6em] uppercase mb-4 block">{selectedPost.date} • EDITORIAL</span>
               <h1 className="text-3xl md:text-5xl font-serif text-white mb-8 tracking-widest uppercase italic leading-tight">{selectedPost.title}</h1>
            </div>

            <div className="aspect-video overflow-hidden mb-16 rounded-sm border border-zinc-900 bg-zinc-900 shadow-2xl">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale" alt={selectedPost.title} />
            </div>

            <div className="text-zinc-300 text-lg leading-[2.2] font-light italic whitespace-pre-wrap font-serif">
              {selectedPost.content}
            </div>
            
            <div className="mt-24 pt-12 border-t border-zinc-900 text-center">
               <p className="text-zinc-600 text-[10px] tracking-[0.8em] uppercase font-bold italic">A verdade é o luxo definitivo.</p>
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
          {loading ? (
             [1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)
          ) : posts.length === 0 ? (
            <div className="text-center py-40 border border-dashed border-zinc-900 rounded-sm">
              <BookOpen size={48} className="text-zinc-800 mx-auto mb-8 opacity-20" />
              <p className="text-zinc-700 tracking-[0.6em] uppercase text-xs font-bold">Nenhum manifesto encontrado no Drive.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => openPost(post)} 
                className="group cursor-pointer grid lg:grid-cols-12 gap-12 items-center hover:bg-white/5 p-4 transition-all rounded-sm"
              >
                <div className="lg:col-span-6 aspect-video overflow-hidden bg-zinc-900 rounded-sm shadow-xl relative">
                  <img src={post.imageUrl} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt={post.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="lg:col-span-6">
                  <span className="text-gold-600 text-[10px] font-bold tracking-[0.6em] uppercase block mb-4">{post.date}</span>
                  <h3 className="text-2xl font-serif text-white mb-6 group-hover:text-gold-500 transition-colors tracking-widest leading-tight uppercase italic">{post.title}</h3>
                  <div className="flex items-center text-gold-500 text-[10px] tracking-[0.4em] uppercase font-bold group-hover:translate-x-3 transition-transform">
                    ABRIR EDITORIAL <ArrowRight size={14} className="ml-4" />
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
