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
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/1000057473.jpg_nqggbr',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/1000057474.jpg_s86ppk',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_13_w535cm',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_20_a45w8y',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/CAPA_HOME_Banner_Home_zgijcd',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/CORP_Empresario.jpg_16_HOME_ua4vd7',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/PORT_RetratoMulher.jpg_15_rkn23u',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_12_snwwqv',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_21_xpxs8i',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/ART_Conceito.jpg_25_hku7p9',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/1000057471.jpg_ugdmdm',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/1000057481.jpg_dzdvh4',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/1000057478.jpg_nyxnad',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1920/1000057477.jpg_s5cpsb',
  ];

  const SLIDE_IMAGES_MOBILE = [
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/1000057480.jpg_sdlegi',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_1_xv5ytm',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/PORT_RetratoMulher_bzzoge',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/CORP_Empresario.jpg_15_HOME_m6bzke',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_HOME_mnu0wx',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_33_dipbu3',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_28_gri96l',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_16_tcikmg',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_2_ysyoz3',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/CORP_Empresario.jpg_01_HOME_lr8raz',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_6_b1spfl',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/1000057479.jpg_df22ie',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/1000057476.jpg_ylmuf6',
  ];

  const CAROUSEL_IMAGES = [
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/CORP_Empresario.jpg_21_bjqwpc',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/CORP_Empresario.jpg_8_nxkkrn',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/CORP_Empresario.jpg_1_t7953b',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/PORT_RetratoMulher.jpg_tdfex5',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/PORT_RetratoMulher.jpg_4_k2hva7',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/PORT_RetratoMulher.jpg_1_wnepiz',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_37_dfmovo',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_25_hku7p9',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_15_ve3dfk',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/ART_Conceito.jpg_9_ijnyji',
  ];

  const MANIFESTO_IMG = 'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_800/MANIF__Manifesto_Home_efkwms';

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ACTIVE_SLIDES = isMobile ? SLIDE_IMAGES_MOBILE : SLIDE_IMAGES;

    const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  const advanceSlide = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % ACTIVE_SLIDES.length);
      setNextSlide(prev => (prev + 1) % ACTIVE_SLIDES.length);
      setTransitioning(false);
    }, 1000);
  }, [ACTIVE_SLIDES.length]);

  useEffect(() => {
    const timer = setInterval(advanceSlide, 3500);
    return () => clearInterval(timer);
  }, [advanceSlide]);

  // Adicionar estilo da animacao
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes carousel-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const whatsappUrl = "https://wa.me/5548996231894";

  return (
    <div className="text-zinc-200">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 transition-opacity duration-1000" style={{ opacity: transitioning ? 0 : 1 }}>
          <img src={ACTIVE_SLIDES[currentSlide]} alt="Mac Frois Retrato" className={`w-full h-full object-cover opacity-80 ${isMobile ? 'object-top' : 'object-center'}`} />
        </div>
        <div className="absolute inset-0 z-0 opacity-0">
          <img src={ACTIVE_SLIDES[nextSlide]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col justify-end h-full" style={{paddingBottom: 'max(5vh, 80px)'}}>
          <div className="max-w-xl">
            <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-2 md:mb-4">Florianopolis, Brasil</p>
            <h1 className="text-3xl md:text-7xl font-serif text-white mb-3 md:mb-4 leading-tight">Imagem e<br />Autoridade</h1>
            <p className="text-zinc-400 text-xs md:text-sm tracking-widest uppercase mb-6 md:mb-10">A ciencia por tras do retrato estrategico.</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button onClick={() => navigate('/portfolio')} className="px-4 py-2 md:px-6 md:py-2.5 border border-gold-600 text-gold-500 text-xs tracking-[0.2em] uppercase hover:bg-gold-600/10 transition-all duration-300">Portfolio</button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 md:px-6 md:py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 hover:border-gold-600 hover:text-gold-500"
                style={{
                  border: '1px solid #25D366',
                  backgroundColor: 'rgba(37, 211, 102, 0.15)',
                  color: '#25D366',
                }}
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
              <button onClick={() => navigate('/servicos')} className="px-4 py-2 md:px-6 md:py-2.5 border border-zinc-600 text-zinc-400 text-xs tracking-[0.2em] uppercase hover:border-gold-600 hover:text-gold-500 transition-all duration-300">Projetos</button>
            </div>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-2">
            {ACTIVE_SLIDES.map((_, i) => (
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
      {/* Carrossel de Portfolio */}
      <section className="py-24 bg-zinc-950 overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-16">
          <SectionTitle title="A Estetica da Verdade" subtitle="Portfolio em Destaque" />
        </div>

        <div className="relative">
          {/* Gradientes nas bordas */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

          {/* Track do carrossel */}
          <div
            className="flex gap-4"
            style={{
              animation: 'carousel-scroll 30s linear infinite',
              width: 'max-content',
            }}
          >
            {/* Duplicado para loop infinito */}
            {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((url, i) => (
              <div
                key={i}
                onClick={() => navigate('/portfolio')}
                className="relative overflow-hidden cursor-pointer flex-shrink-0 group border border-zinc-800 rounded-sm"
                style={{ width: '280px', height: '380px' }}
              >
                <img
                  src={url}
                  alt="Portfolio Mac Frois"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                  <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">Ver Portfolio</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/portfolio')}
            className="px-8 py-3 border border-gold-600 text-gold-500 text-xs tracking-[0.3em] uppercase hover:bg-gold-600/10 transition-all duration-300"
          >
            Ver Portfolio Completo
          </button>
        </div>
      </section>
    </div>
  );
};
