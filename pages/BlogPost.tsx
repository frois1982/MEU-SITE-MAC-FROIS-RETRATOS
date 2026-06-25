import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  keyword?: string;
  excerpt?: string;
  content: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate('/blog');
      return;
    }

    fetch(`/posts/${slug}.json`)
      .then(r => {
        if (!r.ok) throw new Error('Post não encontrado');
        return r.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
        document.title = `${data.title} | Mac Frois`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', data.excerpt || data.title);
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', `https://www.macfrois.com.br/blog/${data.slug}`);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug, navigate]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}>
      <p style={{ color: '#C9A84C', letterSpacing: '3px', fontSize: '0.8rem' }}>CARREGANDO...</p>
    </div>
  );

  if (error || !post) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090b', gap: '1.5rem' }}>
      <p style={{ color: '#888', letterSpacing: '2px', fontSize: '0.8rem' }}>POST NAO ENCONTRADO</p>
      <button
        onClick={() => navigate('/blog')}
        style={{ background: 'none', border: '1px solid #C9A84C', color: '#C9A84C', padding: '0.6rem 1.5rem', cursor: 'pointer', letterSpacing: '2px', fontSize: '0.75rem' }}
      >
        VOLTAR AO BLOG
      </button>
    </div>
  );

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '6rem' }}>
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem', color: '#fff' }}>
        <button
          onClick={() => navigate('/blog')}
          style={{ background: 'none', border: '1px solid #C9A84C', color: '#C9A84C', padding: '0.5rem 1.2rem', cursor: 'pointer', marginBottom: '2.5rem', letterSpacing: '2px', fontSize: '0.75rem' }}
        >
          VOLTAR AO BLOG
        </button>

        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ width: '100%', height: '400px', objectFit: 'cover', marginBottom: '2rem' }}
        />

        <p style={{ color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
          {post.date}
        </p>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2.5rem', lineHeight: 1.3, fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {post.title}
        </h1>

        <div style={{ lineHeight: 1.9, fontSize: '1rem', color: '#aaa', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid #C9A84C' }}>
          <p style={{ color: '#C9A84C', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '1px', fontSize: '0.9rem' }}>
            QUER TRANSFORMAR SUA IMAGEM?
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Fale com Mac Frois pelo WhatsApp:{' '}
            <a href="https://wa.me/5548996231894" style={{ color: '#C9A84C' }}>
              (48) 99623-1894
            </a>
          </p>
        </div>
      </article>
    </div>
  );
};

export { BlogPost };
export default BlogPost;
