
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Skeleton, Button } from '../components/UI';
import { Calendar, Clock, ArrowRight, BookOpen, Share2, ChevronLeft, User, AlertTriangle, RefreshCw, ImageIcon, ExternalLink } from 'lucide-react';

const DRIVE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvauekYnaF2p429x0aB2eaAWNIBKdth4INNZtooTpH62GATSPzXEbYhM3jEgwAFedynw/exec";

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
  hasCustomImage: boolean;
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
    if (fileId) {
      return `https://docs.google.com/uc?id=${fileId}&export=download&t=${Date.now()}`;
    }
    return url;
  };

  useEffect(() => {
    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtrar apenas arquivos de texto do blog
          const textFiles = data.filter((f: any) => {
            const name = f.name.toLowerCase();
            return name.startsWith('blog_') && name.endsWith('.txt');
          });
          
          const mappedPosts: BlogPost[] = textFiles.map((file: any) => {
            const parts = file.name.split('_');
            const rawDate = parts[1] || 'RECENTE';
            const category = parts[2] || 'EDITORIAL';
            let title = parts[3] || 'SEM TÍTULO';
            title = title.replace(/\.[^/.]+$/, "").replace(/-/g, ' ');
            
            let formattedDate = rawDate;
            const dateParts = rawDate.split('-');
            if (dateParts.length === 3) {
              formattedDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
            }

            // BUSCA PRECISA DA IMAGEM: Agora usa o prefixo CAPA_BLOG_
            const baseSearch = file.name.replace('.txt', '').toLowerCase();
            const imgFile = data.find((f: any) => {
              const fName = f.name.toLowerCase();
              const isImg = fName.endsWith('.jpg') || fName.endsWith('.png') || fName.endsWith('.jpeg') || fName.endsWith('.webp');
              // Tenta achar a imagem com CAPA_ na frente
              return isImg && fName.includes(baseSearch) && fName.startsWith('capa_');
            });

            return {
              id: file.id,
              fileName: file.name,
              title: title.toUpperCase(),
              excerpt: "A verdade por trás da imagem e o impacto da autoridade visual no branding pessoal.",
              date: formattedDate,
              category: category.toUpperCase(),
              content: "", 
              contentUrl: getDirectDownloadUrl(file.url),
              viewUrl: file.url,
              imageUrl: imgFile ? getDirectDownloadUrl(imgFile.url) : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true',
              hasCustomImage: !!imgFile
            };
          });

          setPosts(mappedPosts.reverse());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Blog Drive:", err);
        setLoading(false);
      });
  }, []);

  const openPost = async (post: BlogPost) => {
    window.scrollTo(0, 0);
    setSelectedPost({ ...post, content: 'Sincronizando editorial...' });
    
    try {
      const res = await fetch(post.contentUrl);
      const text = await res.text();
      
      // VERIFICAÇÃO BINÁRIA: Se o texto começar com "PNG" ou "JFIF", o Google mandou a imagem no lugar do texto
      if (text.includes('PNG') || text.includes('JFIF') || text.includes('Exif')) {
         setSelectedPost({ 
          ...post, 
          content: `ERRO DE ARQUIVO: O sistema detectou que você salvou a imagem com o nome do texto.\n\nCERTIFIQUE-SE DE QUE:\n1. O arquivo .txt contém apenas texto.\n2. O arquivo .jpg é a imagem.` 
        });
        return;
      }

      if (text.includes('<!doctype') || text.includes('<html')) {
        setSelectedPost({ 
          ...post, 
          content: `ACESSO NEGADO: O arquivo no Drive precisa ser compartilhado como "Qualquer pessoa com o link".` 
        });
      } else {
        const cleanText = text.replace(/^\uFEFF/, '');
        setSelectedPost({ ...post, content: cleanText });
      }
    } catch (e) {
      setSelectedPost({ ...post, content: 'Erro de conexão com o servidor de arquivos.' });
    }
  };

  if (selectedPost) {
    const hasError = selectedPost.content.includes('ERRO DE ARQUIVO') || selectedPost.content.includes('ACESSO NEGADO');

    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-3xl">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-gold-500 text-xs tracking-[0.4em] uppercase mb-12 hover:text-white transition-all group"
          >
            <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar ao Editorial
          </button>
          
          <article>
            <div className="mb-12">
              <span className="text-gold-600 font-bold text-[10px] tracking-[0.5em] uppercase mb-4 block">
                {selectedPost.category} • {selectedPost.date}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight tracking-wider uppercase italic">
                {selectedPost.title}
              </h1>
            </div>
            
            <div className="aspect-video overflow-hidden mb-16 rounded-sm border border-zinc-900 bg-zinc-900 shadow-2xl">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale brightness-75" alt={selectedPost.title} />
            </div>

            <div className="prose prose-invert max-w-none">
               {hasError ? (
                 <div className="bg-zinc-900/50 border border-gold-600/30 p-10 rounded-sm text-center">
                    <AlertTriangle size={32} className="text-gold-500 mx-auto mb-6" />
                    <h3 className="text-white text-xl font-serif mb-6 tracking-widest uppercase italic">Aviso de Sincronia</h3>
                    <p className="text-zinc-400 text-[11px] tracking-[0.2em] uppercase leading-loose whitespace-pre-wrap mb-10">
                      {selectedPost.content}
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <Button onClick={() => openPost(selectedPost)} variant="primary" className="text-[10px]">
                        <RefreshCw size={14} className="mr-2" /> Tentar Sincronizar
                      </Button>
                      <a href={selectedPost.viewUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" className="text-[10px] w-full">
                          <ExternalLink size={14} className="mr-2" /> Ver no Drive
                        </Button>
                      </a>
                    </div>
                 </div>
               ) : (
                 <div className="text-zinc-300 text-lg leading-loose font-light tracking-wide space-y-10 whitespace-pre-wrap">
                    {selectedPost.content}
                 </div>
               )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
          
          <div className="grid gap-24 mt-20">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-[400px] w-full" />)
            ) : posts.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-zinc-900 rounded-lg">
                <p className="text-zinc-700 tracking-[0.5em] uppercase text-xs">Aguardando novos editoriais...</p>
              </div>
            ) : (
              posts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => openPost(post)}
                  className="group cursor-pointer grid lg:grid-cols-12 gap-12 items-center"
                >
                  <div className="lg:col-span-7 aspect-video overflow-hidden bg-zinc-900 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100" 
                    />
                  </div>
                  <div className="lg:col-span-5 flex flex-col">
                    <span className="text-gold-600 text-[10px] font-bold tracking-[0.5em] uppercase mb-4">{post.category} • {post.date}</span>
                    <h3 className="text-3xl font-serif text-white mb-6 group-hover:text-gold-500 transition-colors tracking-widest leading-tight uppercase italic">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-gold-500 text-[10px] tracking-[0.3em] uppercase group-hover:translate-x-2 transition-transform duration-500">
                      Ler Editorial <ArrowRight size={14} className="ml-3" />
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
