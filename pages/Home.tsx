
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionTitle, Button, Skeleton } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, MessageCircle, Camera, Quote } from 'lucide-react';
import { PortfolioItem } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [heroImg, setHeroImg] = useState<string>('https://images.unsplash.com/photo-1492691523567-6170f0295dbd?q=80&w=1920&auto=format&fit=crop&grayscale=true');
  const [manifestoImg, setManifestoImg] = useState<string>('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop&grayscale=true');
  const [featuredItems, setFeaturedItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const whatsappUrl = "https://wa.me/5548996231894?text=Olá%20Mac,%20vi%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20retratos%20de%20posicionamento.";

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) {
      setLoading(false);
      return;
    }

    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtro restrito: Apenas arquivos que contenham explicitamente HOME ou BANNER
          const capa = data.find((f: any) => {
            const name = f.name.toUpperCase();
            return (name.includes('CAPA_HOME') || name.includes('BANNER_HOME')) && !name.includes('BLOG');
          });
          
          const manif = data.find((f: any) => {
            const name = f.name.toUpperCase();
            return name.includes('MANIF_HOME') || (name.startsWith('MANIF_') && !name.includes('BLOG'));
          });

          if (capa) setHeroImg(capa.url);
          if (manif) setManifestoImg(manif.url);

          const homeTagged = data.filter((f: any) => f.name.toUpperCase().includes('_HOME'));
          const artFallback = data.filter((f: any) => 
            f.name.toUpperCase().startsWith('ART_') && 
            !f.name.toUpperCase().includes('_HOME') &&
            !f.name.toUpperCase().includes('BLOG')
          );

          const combined = [...homeTagged, ...artFallback]
            .slice(0, 4)
            .map((file: any) => {
              const nameUpper = file.name.toUpperCase();
              let cat: 'Corporate' | 'Portrait' | 'Artistic' = 'Artistic';
              if (nameUpper.includes('CORP_')) cat = 'Corporate';
              else if (nameUpper.includes('PORT_')) cat = 'Portrait';

              return {
                id: file.id,
                title: file.name.split('_')[1]?.split('.')[0] || 'Obra',
                category: cat,
                imageUrl: file.url
              };
            });

          setFeaturedItems(combined);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro Home Drive:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="text-zinc-200">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {loading ? <Skeleton className="w-full h-full" /> : (
            <img src={heroImg} alt="Capa" className="w-full h-full object-cover opacity-40 transition-opacity duration-1000" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-gold-500 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 font-bold">FLORIANÓPOLIS, BRASIL</h2>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white mb-8 leading-tight tracking-[0.1em]">IMAGEM É<br /><span className="italic text-gold-500/90">AUTORIDADE</span></h1>
          <p className="max-w-2xl mx-auto text-zinc-400 mb-12 text-sm md:text-lg font-light tracking-[0.05em] uppercase opacity-80">A CIÊNCIA POR TRÁS DO RETRATO ESTRATÉGICO.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
             <Link to="/portfolio" className="w-full md:w-auto">
               <Button className="w-full md:px-12 py-5 tracking-[0.3em] !bg-gold-600/70 hover:!bg-gold-600/90 backdrop-blur-md border-none">PORTFÓLIO</Button>
             </Link>
             <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
               <Button className="w-full md:px-12 py-5 tracking-[0.3em] !bg-[#25D366]/70 hover:!bg-[#25D366]/90 border-none flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.1)] backdrop-blur-md">
                 <MessageCircle size={20} />
                 WHATSAPP
               </Button>
             </a>
             <Link to="/servicos" className="w-full md:w-auto">
               <Button variant="outline" className="w-full md:px-12 py-5 tracking-[0.3em] !bg-white/5 backdrop-blur-md !border-zinc-700 hover:!bg-white/10">PROJETOS</Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 bg-black border-y border-zinc-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-gold-600/5 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 relative">
               <div className="absolute -top-10 -left-10 w-40 h-40 border-t border-l border-gold-600/20 hidden lg:block"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b border-r border-gold-600/20 hidden lg:block"></div>
               
               <div className="relative aspect-[4/5] overflow-hidden shadow-2xl rounded-sm border border-zinc-800">
                  {loading ? <Skeleton className="w-full h-full" /> : (
                    <img 
                      src={manifestoImg} 
                      alt="Mac Frois" 
                      className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 transition-all duration-[2s] hover:scale-105" 
                    />
                  )}
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
                 <h2 className="text-4xl md:text-6xl font-serif text-white italic tracking-widest leading-tight">
                   A Verdade é o único <br/>
                   <span className="text-gold-500/90">filtro que importa.</span>
                 </h2>
               </div>

               <div className="relative p-10 bg-zinc-900/70 backdrop-blur-3xl border border-zinc-800/50 rounded-sm shadow-2xl">
                  <Quote className="text-gold-600/20 absolute -top-4 -left-4 w-16 h-16" />
                  <p className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed tracking-wide font-serif italic mb-8">
                    "Minha missão não é criar uma máscara, mas revelar a autoridade que já habita em você. Através da luz e da semiótica, traduzimos sua essência em um ativo estratégico de poder."
                  </p>
                  <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] leading-loose font-light">
                    Não fazemos apenas fotos. Criamos narrativas visuais que posicionam você no topo do seu mercado. Em um mundo saturado de filtros, a autenticidade é o luxo definitivo.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <Link to="/contato">
                    <Button className="w-full sm:w-auto px-10 py-5 tracking-[0.3em] !bg-gold-600/80 hover:!bg-gold-600 border-none shadow-xl">
                      AGENDAR SESSÃO
                    </Button>
                  </Link>
                  <Link to="/blog">
                    <Button variant="outline" className="w-full sm:w-auto px-10 py-5 tracking-[0.3em] !bg-transparent !border-zinc-800 hover:!border-gold-500 backdrop-blur-sm">
                      LER EDITORIAL
                    </Button>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="A Estética da Verdade" subtitle="Portfólio em Destaque" />
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {featuredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate('/portfolio')}
                  className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group cursor-pointer relative shadow-2xl border border-zinc-900 rounded-sm"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center p-6">
                     <div className="text-center border border-white/10 bg-white/5 backdrop-blur-3xl p-8 w-full h-full flex flex-col items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-700">
                       <span className="text-white text-[11px] tracking-[0.5em] uppercase border-b border-gold-600/50 pb-3 block mb-4 font-bold">Ver Obra</span>
                       <span className="text-gold-500 text-[9px] tracking-[0.4em] uppercase opacity-80 italic font-medium">{item.title}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-800 tracking-[0.6em] uppercase text-xs border border-dashed border-zinc-900 rounded-lg mt-16 font-bold">
              Sincronize arquivos '_HOME' para destacar fotos aqui.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
