import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PostMeta {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  excerpt: string;
}

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/posts/index.json')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ color: '#C9A84C', padding: '4rem', textAlign: 'center', letterSpacing: '3px' }}>
      CARREGANDO...
    </div>
  );

  return (
    <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'right', marginBottom: '3rem' }}>
        <p style={{ color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Conteúdo & Estratégia
        </p>
        <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: 700 }}>BLOG</h1>
        <div style={{ width: '60px', height: '2px', background: '#C9A84C', marginLeft: 'auto' }} />
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', padding: '4rem' }}>
          <p style={{ letterSpacing: '2px' }}>NOVOS ARTIGOS EM BREVE</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {posts.map(post => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              style={{ cursor: 'pointer', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden', transition: 'border-color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1.5rem' }}>
                <p style={{ color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                  {post.date}
                </p>
                <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem', lineHeight: 1.4 }}>
                  {post.title}
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {post.excerpt}
                </p>
                <p style={{ color: '#C9A84C', fontSize: '0.8rem', marginTop: '1rem', letterSpacing: '1px' }}>
                  LER ARTIGO →
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export { Blog };
