
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Calendar, Clock, ArrowRight, ChevronLeft, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

interface BlogPost {
  id: string;
  fileName: string;
  title: string;
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

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) return;

    fetch(`${DRIVE_SCRIPT_URL}?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const textFiles = data.filter((f: any) => f.name.toLowerCase().startsWith('blog_') && f.name.toLowerCase().endsWith('.txt'));
          
          const mappedPosts: BlogPost[] = textFiles.map((file: any) => {
            const parts = file.name.split('_');
            const dateStr = parts[1] ? parts[1].replace('.txt', '').replace(/-/g, '/') : 'RECENTE';
            let title = parts[2] ? parts[2].replace('.txt', '').replace(/-/g, ' ') : dateStr;

            const baseSearch = file.name.replace('.txt', '').toLowerCase();
            const imgFile = data.find((f: any) => {
              const fName = f.name.toLowerCase();
              return fName.includes(baseSearch) && (fName.endsWith('.jpg') || fName.endsWith('.png'));
            });

            return {
              id: file.id,
              fileName: file.name,
              title: title.toUpperCase(),
              date: dateStr,
              category: 'EDITORIAL',
              content: "", 
              contentUrl: file.url,
              viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
              imageUrl: imgFile ? imgFile.url : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop&grayscale=true'
            };
          });

          setPosts(mappedPosts.reverse());
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openPost = async (post: BlogPost) => {
    window.scrollTo(0, 0);
    setSelectedPost({ ...post, content: 'Sincronizando...' });
    
    try {
      const res = await fetch(post.contentUrl);
      if (!res.ok) throw new Error();
      const text = await res.text();
      setSelectedPost({ ...post, content: text.replace(/^\uFEFF/, '') });
    } catch (e) {
      setSelectedPost({ ...post, content: 'ACESSO_RESTALTO' });
    }
  };

  if (selectedPost) {
    const isRestricted = selectedPost.content === 'ACESSO_RESTALTO' || selectedPost.content.includes('<!doctype');

    return (
      <div className="pt-32 pb-24 bg-black min-h-screen animate-fade-in">
        <div className="container mx-auto px-6 max-w-3xl">
          <button onClick={() => setSelectedPost(null)} className="flex items-center text-gold-500 text-xs tracking-widest uppercase mb-12 hover:text-white transition-all">
            <ChevronLeft size={16} className="mr-2" /> Voltar
          </button>
          
          <article>
            <span className="text-gold-600 font-bold text-[10px] tracking-[0.5em] uppercase mb-4 block">
              {selectedPost.date}
            </span>
            <h1 className="text-4xl font-serif text-white mb-8 tracking-widest uppercase italic">{selectedPost.title}</h1>
            
            <img src={selectedPost.imageUrl} className="w-full h-80 object-cover grayscale mb-12 rounded-sm border border-zinc-900" alt={selectedPost.title} />

            <div className="prose prose-invert max-w-none">
               {isRestricted ? (
                 <div className="bg-zinc-900/50 border border-gold-600/30 p-10 rounded-sm text-center">
                    <AlertTriangle size={32} className="text-gold-500 mx-auto mb-6" />
                    <p className="text-zinc-400 text-[10px] tracking-[0.2em] uppercase leading-loose mb-10">
                      O conteúdo deste editorial está protegido ou requer acesso direto pelo Google Drive.
                    </p>
                    <a href={selectedPost.viewUrl} target="_blank" rel="noreferrer">
                      <Button variant="primary" className="text-[10px] w-full">
                        <ExternalLink size={14} className="mr-2" /> Ler no Google Drive
                      </Button>
                    </a>
                 </div>
               ) : (
                 <div className="text-zinc-300 text-lg leading-loose font-light tracking-wide whitespace-pre-wrap">
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
        <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
        <div className="grid gap-16 mt-20 max-w-5xl mx-auto">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : posts.length === 0 ? (
            <p className="text-center text-zinc-700 uppercase tracking-widest">Aguardando editoriais...</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} onClick={() => openPost(post)} className="group cursor-pointer grid md:grid-cols-2 gap-8 items-center border-b border-zinc-900 pb-16">
                <div className="aspect-video overflow-hidden bg-zinc-900">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <div>
                  <span className="text-gold-600 text-[10px] tracking-widest uppercase mb-4 block">{post.date}</span>
                  <h3 className="text-2xl font-serif text-white mb-6 group-hover:text-gold-500 transition-colors uppercase italic">{post.title}</h3>
                  <div className="text-gold-500 text-[10px] tracking-widest uppercase flex items-center">
                    Ler Editorial <ArrowRight size={14} className="ml-3" />
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
