
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton, Button } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  viewUrl: string;
  imageUrl: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) return;

    fetch(`${DRIVE_SCRIPT_URL}?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Busca arquivos que começam com blog_ e terminam em .txt
          const textFiles = data.filter((f: any) => f.name.toLowerCase().startsWith('blog_') && f.name.toLowerCase().endsWith('.txt'));
          
          const mappedPosts: BlogPost[] = textFiles.map((file: any) => {
            const parts = file.name.split('_');
            const dateStr = parts[1] ? parts[1].replace('.txt', '').replace(/-/g, '/') : 'RECENTE';
            const title = parts[2] ? parts[2].replace('.txt', '').replace(/-/g, ' ') : dateStr;

            // Busca imagem correspondente
            const baseSearch = file.name.replace('.txt', '').toLowerCase();
            const imgFile = data.find((f: any) => f.name.toLowerCase().includes(baseSearch) && (f.name.endsWith('.jpg') || f.name.endsWith('.png')));

            return {
              id: file.id,
              title: title.toUpperCase(),
              date: dateStr,
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

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Jornal Editorial" subtitle="A Verdade em Palavras" />
        <div className="grid gap-12 mt-20 max-w-4xl mx-auto">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : posts.length === 0 ? (
            <p className="text-center text-zinc-700 uppercase tracking-widest">Nenhum editorial encontrado.</p>
          ) : (
            posts.map((post) => (
              <a 
                key={post.id} 
                href={post.viewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-zinc-900/30 border border-zinc-900 p-6 md:p-10 hover:border-gold-600/50 transition-all rounded-sm"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/3 aspect-video overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" />
                  </div>
                  <div className="flex-grow">
                    <span className="text-gold-600 text-[10px] tracking-widest uppercase mb-2 block">{post.date}</span>
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-6 group-hover:text-gold-500 transition-colors uppercase italic">{post.title}</h3>
                    <div className="text-gold-500 text-[10px] tracking-widest uppercase flex items-center">
                      Ler Editorial <ArrowRight size={14} className="ml-3" />
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
