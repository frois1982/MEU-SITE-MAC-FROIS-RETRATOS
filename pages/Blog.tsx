
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, BookOpen, ChevronLeft, AlertTriangle, RefreshCw, ExternalLink, FileText, Search } from 'lucide-react';

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

  const getDirectDownloadUrl = (url: string, id: string) => {
    if (!url && !id) return '';
    // Tentamos forçar o download direto para evitar páginas de visualização do Google
    return `https://docs.google.com/uc?id=${id}&export=download&t=${Date.now()}`;
  };

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) return;

    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // FILTRAGEM MANIF: Protocolo exclusivo para evitar conflito com arquivos antigos
          const manifestos = data.filter((f: any) => {
            const name = f.name.toUpperCase();
            return name.endsWith('.TXT') && name.startsWith('MANIF_');
          });
          
          const mappedPosts: BlogPost[] = manifestos.map((file: any) => {
            const fileNameUpper = file.name.toUpperCase();
            const parts = fileNameUpper.split('_'); 
            
            // DNA do Manifesto: MANIF_[ID]_[TEMA].txt
            const syncID = parts[1] || 'VOID';
            
            // Título limpo
            const rawTitle = parts.slice(2).join(' ').replace('.TXT', '').trim();
            const cleanTitle = rawTitle.replace(/-/g, ' ') || 'MANIFESTO EDITORIAL';
            
            // Localiza a CAPA correspondente pelo ID
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
              contentUrl: getDirectDownloadUrl(file.url, file.id),
              viewUrl: file.url,
              imageUrl: imgFile ? getDirectDownloadUrl(imgFile.url, imgFile.id) : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'
            };
          });

          // Mostrar mais recentes primeiro
          setPosts(mappedPosts.reverse());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Blog Sincronia:", err);
        setLoading(false);
      });
  }, []);

  const openPost = async (post: BlogPost) => {
    window.scrollTo(0, 0);
    setSelectedPost({ ...post, content: 'Sincronizando com o Drive...' });
    
    try {
      const res = await fetch(post.contentUrl);
      const text = await res.text();
      
      // SCANNER DE INTEGRIDADE: Evita o erro de leitura binária (imagem como texto)
      if ((text.includes('PNG') && text.includes('IHDR')) || text.includes('JFIF') || text.includes('Exif')) {
        setSelectedPost({ 
          ...post, 
          content: 'ERRO DE INTEGRIDADES: O arquivo detectado no Drive é uma imagem. Certifique-se de que o arquivo de manifesto tem a extensão .txt e contém apenas texto puro.' 
        });
        return;
      }

      // Scanner de Acesso
      if (text.includes('<!doctype') || text.includes('<html') || text.length < 5) {
        setSelectedPost({ 
          ...post, 
          content: `ACESSO RESTRITO: O arquivo no Drive não está público. No Google Drive, clique com o botão direito no arquivo > Compartilhar > Mudar para "Qualquer pessoa com o link".` 
        });
      } else {
        // Saneamento final
        const cleanText = text.replace(/[#*`_]/g, '').trim();
        setSelectedPost({ ...post, content: cleanText });
      }
    } catch (e) {
      setSelectedPost({ ...post, content: 'FALHA NA CONEXÃO: O Google Drive recusou a leitura automática. Verifique se o arquivo está compartilhado corretamente.' });
    }
  };

  if (selectedPost) {
    const isError = selectedPost.content.includes('ERRO') || selectedPost.content.includes('RESTRITO') || selectedPost.content.includes('FALHA');

    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-4xl">
          <button onClick={() => setSelectedPost(null)} className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase mb-16 hover:text-white transition-all group font-bold">
            <ChevronLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Retornar à Biblioteca
          </button>
          
          <article>
            <div className="mb-20 text-center">
               <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase mb-6 block">Editorial • Mac Frois</span>
               <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest uppercase italic leading-tight">{selectedPost.title}</h1>
               <div className="w-24 h-px bg-gold-600/40 mx-auto mt-12"></div>
            </div>

            <div className="aspect-video overflow-hidden mb-24 rounded-sm border border-zinc-900 bg-zinc-900 shadow-2xl relative group">
              <img src={selectedPost.imageUrl} className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt={selectedPost.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>

            <div className="max-w-3xl mx-auto">
               {isError ? (
                 <div className="bg-zinc-900/50 border border-gold-600/20 p-16 text-center rounded-sm backdrop-blur-md">
                    <AlertTriangle size={40} className="text-gold-500 mx-auto mb-8" />
                    <h3 className="text-white font-serif italic text-2xl mb-6 tracking-widest uppercase">Protocolo de Erro</h3>
                    <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase leading-loose mb-12 whitespace-pre-wrap font-light">
                      {selectedPost.content}
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                       <Button onClick={() => openPost(selectedPost)} className="text-[10px] tracking-[0.5em] py-5 px-10 !bg-gold-600 text-black border-none font-bold">
                         <RefreshCw size={14} className="mr-4" /> RECONECTAR
                       </Button>
                       <a href={selectedPost.viewUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto">
                         <Button variant="outline" className="text-[10px] tracking-[0.5em] py-5 px-10 w-full border-zinc-800 hover:border-white">
                           <ExternalLink size={14} className="mr-4" /> ABRIR NO DRIVE
                         </Button>
                       </a>
                    </div>
                 </div>
               ) : (
                 <div className="text-zinc-300 text-xl md:text-2xl leading-[2.4] font-light italic whitespace-pre-wrap font-serif selection:bg-gold-600/30">
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
        
        <div className="grid gap-28 mt-32">
          {loading ? (
             [1, 2, 3].map(i => <Skeleton key={i} className="h-96 w-full" />)
          ) : posts.length === 0 ? (
            <div className="text-center py-48 border border-dashed border-zinc-900 rounded-sm">
              <Search size={48} className="text-zinc-800 mx-auto mb-8 opacity-20" />
              <p className="text-zinc-700 tracking-[0.6em] uppercase text-xs font-bold">Nenhum manifesto sincronizado via protocolo MANIF.</p>
              <div className="max-w-md mx-auto mt-8 p-6 bg-zinc-900/30 border border-zinc-900">
                <p className="text-zinc-800 text-[9px] tracking-widest uppercase font-bold italic">Instrução Sênior: Use o Admin para gerar arquivos "MANIF_" e suba-os na pasta do Drive configurada.</p>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} onClick={() => openPost(post)} className="group cursor-pointer grid lg:grid-cols-12 gap-20 items-center animate-fade-in">
                <div className="lg:col-span-7 aspect-[16/9] overflow-hidden bg-zinc-900 rounded-sm shadow-2xl relative">
                  <img src={post.imageUrl} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-100 transition-all duration-[2.5s] group-hover:scale-105" alt={post.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all">
                    <span className="bg-black/60 backdrop-blur-md border border-gold-600/30 text-gold-500 text-[8px] font-bold px-3 py-1 tracking-[0.3em]">DNA: {post.syncID}</span>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase block mb-6">Editorial</span>
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-10 group-hover:text-gold-500 transition-all tracking-[0.2em] leading-tight uppercase italic">{post.title}</h3>
                  <div className="flex items-center text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold group-hover:translate-x-6 transition-transform duration-1000">
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
