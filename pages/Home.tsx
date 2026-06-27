import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionTitle, Button, Skeleton } from '../components/UI';
import { MessageCircle, Camera, Quote } from 'lucide-react';
import { PortfolioItem } from '../types';

export const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Mac Frois | Fotografo de Retratos Corporativos em Florianopolis';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Mac Frois e fotografo especialista em retratos corporativos.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.macfrois.com.br/');
  }, []);

  const navigate = useNavigate();

  const SLIDE_IMAGES = [
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_13_w535cm',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_20_a45w8y',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/CAPA_HOME_Banner_Home_zgijcd',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/CORP_Empresario.jpg_16_HOME_ua4vd7',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/PORT_RetratoMulher.jpg_15_rkn23u',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_12_snwwqv',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_21_xpxs8i',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_25_hku7p9',
  ];

  const MANIFESTO_IMG = 'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/MANIF__Manifesto_Home_efkwms';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const advanceSlide = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDE_IMAGES.length);
      setNextSlide(prev => (prev + 1) % SLIDE_IMAGES.length);
      setTransitioning(false);
    }, 1000);
  }, [SLIDE_IMAGES.length]);

  useEffect(() => {
    const timer = setInterval(advanceSlide, 5000);
    return () => clearInterval(timer);
  }, [advanceSlide]);

  useEffect(() => {
    const CLOUD_NAME = 'dlahvdclb';
    const fetchCloudinary = async () => {
      try {
        const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/portfolio.json`, { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          if (data.resources && Array.isArray(data.resources)) {
            const combined = data.resources.filter((f: any) => (f.public_id || '').toUpperCase().includes('_HOME')).slice(0, 4).map((file: any) => ({
              id: file.public_id,
              title: (file.public_id || '').split('_')[1]?.split('.')[0] || 'Obra',
              category: 'Artistic' as 'Artistic',
              imageUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/${file.public_id}`
            }));
            setFeaturedItems(combined);
          }
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchCloudinary();
  }, []);

  const whatsappUrl = "https://wa.me/5548996231894";

  return (
    <div className="text-zinc-200">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 transition-opacity duration-1000" style={{ opacity: transitioning ? 0 : 1 }}>
          <img src={SLIDE_IMAGES[currentSlide]} alt="Mac Frois Retrato" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="absolute inset-0 z-0 opacity-0">
          <img src={SLIDE_IMAGES[nextSlide]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col justify-end h-full pb-20">
          <div className="max-w-xl">
            <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-4">Florianopolis, Brasil</p>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-tight">Imagem e<br />Autoridade</h1>
            <p className="text-zinc-400 text-sm tracking-widest uppercase mb-10">A ciencia por tras do retrato estrategico.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/portfolio')} className="px-6 py-2.5 border border-gold-600 text-gold-500 text-xs tracking-[0.2em] uppercase hover:bg-gold-600/10 transition-all duration-300">Portfolio</button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 border border-zinc-600 text-zinc-400 text-xs tracking-[0.2em] uppercase hover:border-gold-600 hover:text-gold-500 transition-all duration-300 flex items-center gap-2"><MessageCircle size={14} />WhatsApp</a>
              <button onClick={() => navigate('/servicos')} className="px-6 py-2.5 border border-zinc-600 text-zinc-400 text-xs tracking-[0.2em] uppercase hover:border-gold-600 hover:text-gold-500 transition-all duration-300">Projetos</button>
            </div>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-2">
            {SLIDE_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-gold-500 w-4' : 'bg-zinc-600'}`} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-32 bg-black border-y border-zinc-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-gold-600/5 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 border-t border-l border-gold-600/20 hidden lg:block"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b border-r border-gold-600/20 hidden lg:block"></div>
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl rounded-sm border border-zinc-800">
                <img src={MANIFESTO_IMG} alt="Mac Frois" className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 transition-all duration-[2s] hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                  <span className="text-gold-500 text-[10px] font-bold tracking-[0.5em] uppercase">Mac Frois</span>
                  <p className="text-white text-xs tracking-widest uppercase italic font-light mt-1">Retratista</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.6em] block">O Manifesto</span>
                <h2 className="text-4xl md:text-6xl font-serif text-white italic tracking-widest leading-tight">A Verdade e o unico filtro que importa.</h2>
              </div>
              <div className="relative p-10 bg-zinc-900/70 backdrop-blur-3xl border border-zinc-800/50 rounded-sm shadow-2xl">
                <Quote className="text-gold-600/20 absolute -top-4 -left-4 w-16 h-16" />
                <p className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed tracking-wide font-serif italic mb-8">Minha missao nao e criar uma mascara, mas revelar a autoridade que ja habita em voce.</p>
                <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] leading-loose font-light">Nao fazemos apenas fotos. Criamos narrativas visuais que posicionam voce no topo do seu mercado.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link to="/contato"><Button className="w-full sm:w-auto px-10 py-5 tracking-[0.3em] !bg-gold-600/80 hover:!bg-gold-600 border-none shadow-xl">AGENDAR SESSAO</Button></Link>
                <Link to="/blog"><Button variant="outline" className="w-full sm:w-auto px-10 py-5 tracking-[0.3em] !bg-transparent !border-zinc-800 hover:!border-gold-500 backdrop-blur-sm">LER EDITORIAL</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="A Estetica da Verdade" subtitle="Portfolio em Destaque" />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">{[1,2,3,4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full" />)}</div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {featuredItems.map((item) => (
                <div key={item.id} onClick={() => navigate('/portfolio')} className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group cursor-pointer relative shadow-2xl border border-zinc-900 rounded-sm">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-60 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center p-6">
                    <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center">
                      <span className="text-white text-[11px] tracking-[0.5em] uppercase border-b border-gold-600/50 pb-3 block mb-4 font-bold">Ver Obra</span>
                      <span className="text-gold-500 text-[9px] tracking-[0.4em] uppercase opacity-80 italic font-medium">{item.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-800 tracking-[0.6em] uppercase text-xs border border-dashed border-zinc-900 rounded-lg mt-16 font-bold">Sincronize arquivos para destacar fotos aqui.</div>
          )}
        </div>
      </section>
    </div>
  );
};
