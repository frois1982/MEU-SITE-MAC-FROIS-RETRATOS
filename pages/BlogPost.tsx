import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  keyword: string;
  excerpt: string;
  content: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/posts/${slug}.json`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/blog'); });
  }, [slug, navigate]);

  if (loading) return <div style={{ color: '#C9A84C', padding: '4rem', textAlign: 'center' }}>Carregando...</div>;
  if (!post) return null;

  // Atualiza title e meta description dinamicamente por post
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Mac Frois`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', post.excerpt);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://www.macfrois.com.br/blog/${post.slug}`);
    }
  }, [post]);

  return (
    <article style={{ maxWidth: '780px', margin: '0 auto', padding: '4rem 2rem', color: '#fff' }}>
      <button onClick={() => navigate('/blog')} style={{ background: 'none', border: '1px solid #C9A84C', color: '#C9A84C', padding: '0.5rem 1.2rem', cursor: 'pointer', marginBottom: '2rem', borderRadius: '4px' }}>
        ← Voltar ao Blog
      </button>
      <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem' }} />
      <p style={{ color: '#C9A84C', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{post.date}</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '1rem 0 2rem', lineHeight: 1.3 }}>{post.title}</h1>
      <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#ccc', whiteSpace: 'pre-wrap' }}>{post.content}</div>
      <div style={{ marginTop: '3rem', padding: '2rem', border: '1px solid #C9A84C', borderRadius: '8px' }}>
        <p style={{ color: '#C9A84C', fontWeight: 600, marginBottom: '0.5rem' }}>Quer transformar sua imagem?</p>
        <p style={{ color: '#ccc' }}>Fale com Mac Frois pelo WhatsApp: <a href="https://wa.me/5548996231894" style={{ color: '#C9A84C' }}>(48) 99623-1894</a></p>
      </div>
    </article>
  );
};

export default BlogPost;
