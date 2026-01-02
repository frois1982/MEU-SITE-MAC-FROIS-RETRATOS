
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Skeleton, Button } from '../components/UI';
import { Calendar, Clock, ArrowRight, BookOpen, Share2, ChevronLeft, User } from 'lucide-react';

// MAC: Mantenha sua URL do script aqui
const DRIVE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvauekYnaF2p429x0aB2eaAWNIBKdth4INNZtooTpH62GATSPzXEbYhM3jEgwAFedynw/exec";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string;
  contentUrl: string;
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
          // 1. Filtragem Rigorosa: Apenas arquivos que são REALMENTE .txt
          const textFiles = data.filter((f: any) => {
            const name = f.name.toLowerCase();
            return name.startsWith('post_') && name.endsWith('.txt');
          });
          
          const mappedPosts: BlogPost[] = textFiles.map((file: any) => {
            const parts = file.name.split('_');
            const rawDate = parts[1] || 'RECENTE';
            const category = parts[2] || 'ESTRATÉGIA';
            
            // Limpeza Profunda do Título
            let title = parts[3] || 'SEM TÍTULO';
            // Remove qualquer extensão (.txt, .TXT, .png, etc) de forma agressiva
            title = title.split('.')[0].replace(/-/g, ' ');
            
            const dateParts = rawDate.split('-');
            const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : rawDate;

            // Busca da Imagem Correspondente
            // Pegamos o nome base do arquivo (ex: POST_2024_ESTRATEGIA_TITULO)
            const baseName = file.name.split('.')[0].toLowerCase();
            
            const imgFile = data.find((f: any) => {
              const fName = f.name.toLowerCase();
              const isImage = fName.endsWith('.jpg') || fName.endsWith('.png') || fName.endsWith('.jpeg') || fName.endsWith('.webp');
              // A imagem deve ter o MESMO nome base do arquivo de texto
              return isImage && fName.startsWith(baseName);
            });

            return {
              id: file.id,
              title: title.toUpperCase(),
              excerpt: "A verdade por trás da imagem e o impacto da autoridade visual no mundo real. Clique para ler o editorial completo.",
              date: formattedDate,
              category: category.toUpperCase(),
              content: "", 
              contentUrl: file.url,
              imageUrl: imgFile ? imgFile.url : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop&grayscale=true'
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
    setSelectedPost({ ...post, content: 'Carregando editorial...' });
    
    try {
      const res = await fetch(post.contentUrl);
      const text = await res.text();
      
      // Validação de Segurança contra "Código de Barras" (Arquivos binários)
      // Se o texto contiver marcas d'água de arquivos de imagem (PNG, JFIF, Exif)
      const isBinary = text.substring(0, 100).match(/PNG|JFIF|Exif||IHDR/);
      
      if (isBinary || text.length > 100000) {
        setSelectedPost({ 
          ...post, 
          content: 'ERRO DE FORMATO: O sistema detectou que este arquivo não é um texto puro. \n\nCertifique-se de que no Google Drive você salvou como "Documento de Texto (.txt)" e não apenas renomeou uma imagem com .txt no final.' 
        });
      } else {
        setSelectedPost({ ...post, content: text });
      }
    } catch (e) {
      setSelectedPost({ ...post, content: 'Não foi possível carregar o texto. Verifique se o arquivo está público no Drive.' });
    }
  };

  if (selectedPost) {
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
              <div className="flex items-center gap-4 text-zinc-500 text-[10px] tracking-widest uppercase border-y border-zinc-900 py-6">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-gold-500 font-serif text-xs">MF</div>
                <span>Por Mac Frois</span>
                <span className="mx-2 opacity-20">|</span>
                <Clock size={12} className="mr-1" /> Editorial
              </div>
            </div>
            
            <div className="w-full h-[450px] overflow-hidden mb-16 rounded-sm shadow-2xl border border-zinc-900 bg-zinc-900">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale brightness-75" alt={selectedPost.title} />
            </div>

            <div className="prose prose-invert max-w-none">
               <div className="text-zinc-300 text-lg leading-loose font-light tracking-wide space-y-10 whitespace-pre-wrap first-letter:text-5xl first-letter:font-serif first-letter:text-gold-500 first-letter:mr-3 first-letter:float-left">
                  {selectedPost.content}
               </div>
            </div>

            <div className="mt-32 pt-16 border-t border-zinc-900 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-gold-600 rounded-full flex items-center justify-center text-black font-bold text-2xl mb-6 shadow-2xl">MF</div>
               <h4 className="text-white text-sm font-bold tracking-[0.4em] mb-2 uppercase">Mac Frois</h4>
               <p className="text-zinc-500 text-xs tracking-widest uppercase max-w-xs leading-relaxed">
                 Retratista focado em extrair a verdade e construir autoridade através da imagem estratégica.
               </p>
               <button className="mt-10 text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
                  <Share2 size={16} /> Compartilhar Visão
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
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
          
          <div className="grid gap-24 mt-20">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-[450px] w-full" />)
            ) : posts.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-zinc-900 rounded-lg">
                <p className="text-zinc-700 tracking-[0.5em] uppercase text-xs">O silêncio precede a grande história.</p>
                <p className="text-zinc-800 text-[10px] mt-4 uppercase tracking-[0.2em]">Crie arquivos com prefixo POST_ no seu Drive para começar.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => openPost(post)}
                  className="group cursor-pointer grid lg:grid-cols-12 gap-12 items-center"
                >
                  <div className="lg:col-span-7 overflow-hidden aspect-[16/9] bg-zinc-900 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 to-transparent opacity-60"></div>
                  </div>
                  <div className="lg:col-span-5 flex flex-col">
                    <span className="text-gold-600 text-[10px] font-bold tracking-[0.5em] uppercase mb-4">{post.category} • {post.date}</span>
                    <h3 className="text-3xl md:text-4xl font-serif text-white mb-6 group-hover:text-gold-500 transition-colors tracking-widest leading-tight uppercase italic">
                      {post.title}
                    </h3>
                    <p className="text-zinc-500 text-sm font-light leading-loose tracking-[0.1em] uppercase mb-8 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-gold-500 text-[10px] tracking-[0.3em] uppercase mt-auto group-hover:translate-x-2 transition-transform duration-500">
                      Ler Editorial Completo <ArrowRight size={14} className="ml-3" />
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
