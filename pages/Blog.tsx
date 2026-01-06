
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, BookOpen, ChevronLeft, AlertTriangle, RefreshCw, ExternalLink, Quote, FileText } from 'lucide-react';

interface BlogPost {
  id: string;
  syncID: string;
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
          // 1. Filtrar apenas arquivos que são explicitamente TEXTO e começam com TEXTO_ ou BLOG_
          const textFiles = data.filter((f: any) => {
            const name = f.name.toUpperCase();
            return name.endsWith('.TXT') && (name.startsWith('TEXTO_') || name.startsWith('BLOG_') || name.startsWith('EDITORIAL_'));
          });
          
          const mappedPosts: BlogPost[] = textFiles.map((file: any) => {
            const fileNameUpper = file.name.toUpperCase();
            // Suportar tanto sublinhado quanto traço
            const parts = fileNameUpper.replace(/-/g, '_').split('_'); 
            
            // O SyncID é a segunda parte do nome
            const syncID = parts[1] || 'VOID';
            
            // Extrair o tema/título do final do nome do arquivo
            const rawTitle = parts.slice(2).join(' ').replace('.TXT', '').trim();
            const cleanTitle = rawTitle.replace(/-/g, ' ') || 'MANIFESTO EDITORIAL';
            
            // 2. Localizar a imagem (CAPA_) que tenha o mesmo SyncID no nome
            const imgFile = data.find((f: any) => {
              const fNameUpper = f.name.toUpperCase();
              const isImg = fNameUpper.endsWith('.JPG') || fNameUpper.endsWith('.PNG') || fNameUpper.endsWith('.JPEG') || fNameUpper.endsWith('.WEBP');
              return isImg && fNameUpper.includes(syncID);
            });

            return {
              id: file.id,
              syncID: syncID,
              title: cleanTitle,
              excerpt: "Uma jornada visual sobre a verdade e o posicionamento estratégico.",
              date: "MAC FROIS",
              category: "EDITORIAL",
              content: "", 
              contentUrl: getDirectDownloadUrl(file.url),
              viewUrl: file.url,
              imageUrl: imgFile ? getDirectDownloadUrl(imgFile.url) : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'
            };
          });

          // Mostrar os últimos primeiro
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
    setSelectedPost({ ...post, content: 'Sincronizando conteúdo...' });
    
    try {
      const res = await fetch(post.contentUrl);
      const text = await res.text();
      
      // TRAVA DE SEGURANÇA: Se o texto começar com os símbolos de imagem (PNG), nós impedimos a exibição
      if (text.includes('PNG') && text.includes('IHDR')) {
        setSelectedPost({ 
          ...post, 
          content: 'ERRO DE SINCRONIA: O arquivo lixo foi detectado. Por favor, certifique-se de que o arquivo no Drive é um .txt e não uma imagem renomeada.' 
        });
        return;
      }

      if (text.includes('<!doctype') || text.includes('<html') || text.length < 10) {
        setSelectedPost({ 
          ...post, 
          content: `ACESSO PENDENTE: O arquivo no Drive precisa estar compartilhado como "Qualquer pessoa com o link".` 
        });
      } else {
        // Limpeza de caracteres Markdown remanescentes
        const cleanText = text.replace(/[#*`_]/g, '').trim();
        setSelectedPost({ ...post, content: cleanText });
      }
    } catch (e) {
      setSelectedPost({ ...post, content: 'Falha na conexão orbital. Verifique o compartilhamento do arquivo no Drive.' });
    }
  };

  if (selectedPost) {
    const isError = selectedPost.content.includes('ERRO') || selectedPost.content.includes('PENDENTE') || selectedPost.content.includes('Falha');

    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-4xl">
          <button onClick={() => setSelectedPost(null)} className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-12 hover:text-white transition-all group font-bold">
            <ChevronLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Voltar
          </button>
          
          <article>
            <div className="mb-16 text-center">
               <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase mb-6 block">Editorial</span>
               <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase italic leading-tight">{selectedPost.title}</h1>
               <div className="w-20 h-px bg-gold-600/30 mx-auto mt-10"></div>
            </div>

            <div className="aspect-video overflow-hidden mb-20 rounded-sm border border-zinc-900 bg-zinc-900 shadow-2xl relative group">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt={selectedPost.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>

            <div className="max-w-3xl mx-auto">
               {isError ? (
                 <div className="bg-zinc-900 border border-gold-600/20 p-12 text-center rounded-sm">
                    <AlertTriangle size={32} className="text-gold-500 mx-auto mb-6" />
                    <h3 className="text-white font-serif italic text-xl mb-4 tracking-widest uppercase">Falha de Leitura</h3>
                    <p className="text-zinc-500 text-[11px] tracking-[0.3em] uppercase leading-loose mb-10 whitespace-pre-wrap">
                      {selectedPost.content}
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                       <Button onClick={() => openPost(selectedPost)} className="text-[9px] tracking-[0.4em] py-4">
                         <RefreshCw size={14} className="mr-3" /> TENTAR RECONEXÃO
                       </Button>
                       <a href={selectedPost.viewUrl} target="_blank" rel="noreferrer">
                         <Button variant="outline" className="text-[9px] tracking-[0.4em] py-4 w-full">
                           <ExternalLink size={14} className="mr-3" /> VER NO DRIVE
                         </Button>
                       </a>
                    </div>
                 </div>
               ) : (
                 <div className="text-zinc-300 text-xl md:text-2xl leading-[2.2] font-light italic whitespace-pre-wrap font-serif selection:bg-gold-600/30">
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
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Jornal Editorial" subtitle="Arquivo de Manifestos" />
        <div className="grid gap-24 mt-32">
          {loading ? (
             [1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full" />)
          ) : posts.length === 0 ? (
            <div className="text-center py-40 border border-dashed border-zinc-900 rounded-sm">
              <BookOpen size={48} className="text-zinc-800 mx-auto mb-8 opacity-20" />
              <p className="text-zinc-700 tracking-[0.6em] uppercase text-xs font-bold">Aguardando novos manifestos no Drive.</p>
              <p className="text-zinc-800 text-[10px] mt-6 tracking-widest uppercase font-bold italic">Os arquivos devem começar com TEXTO_ID e CAPA_ID.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} onClick={() => openPost(post)} className="group cursor-pointer grid lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-7 aspect-[16/9] overflow-hidden bg-zinc-900 rounded-sm shadow-2xl relative">
                  <img src={post.imageUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-all duration-[2s] group-hover:scale-105" alt={post.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
                <div className="lg:col-span-5">
                  <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase block mb-6">{post.category}</span>
                  <h3 className="text-3xl font-serif text-white mb-10 group-hover:text-gold-500 transition-all tracking-widest leading-tight uppercase italic">{post.title}</h3>
                  <div className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold group-hover:translate-x-4 transition-transform duration-700">
                    LER MANIFESTO <ArrowRight size={16} className="ml-5" />
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
