
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle, Button, Card } from '../components/UI';
import { ArrowRight, User, Aperture, Heart, Instagram } from 'lucide-react';

export const Home: React.FC = () => {
  const instagramPhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop&grayscale=true' },
    { id: 2, url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop&grayscale=true' },
    { id: 3, url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop&grayscale=true' },
    { id: 4, url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop&grayscale=true' },
    { id: 5, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop&grayscale=true' },
    { id: 6, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  ];

  const instagramLink = "https://www.instagram.com/froisretratista/";
  const instagramHandle = "@froisretratista";

  return (
    <div className="text-zinc-200">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/433/1920/1080?grayscale" 
            alt="Mac Frois Photography" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-gold-500 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 animate-fade-in-up font-bold">
            FLORIANÓPOLIS, BRASIL
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white mb-8 leading-tight tracking-[0.1em]">
            IMAGEM É<br />
            <span className="italic text-gold-500/90 tracking-normal">AUTORIDADE</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 mb-12 text-sm md:text-lg font-light tracking-[0.05em] leading-relaxed uppercase opacity-80">
            A CIÊNCIA POR TRÁS DO RETRATO ESTRATÉGICO QUE TRANSFORMA CARREIRAS.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
             <Link to="/portfolio">
                <Button className="px-12 py-5 tracking-[0.3em]">PORTFÓLIO</Button>
             </Link>
             <Link to="/contato">
                <Button variant="outline" className="px-12 py-5 tracking-[0.3em]">CONTATO</Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="w-full md:w-1/2 relative">
               <img 
                 src="https://picsum.photos/id/91/800/1000?grayscale" 
                 alt="Mac Frois" 
                 className="w-full h-auto object-cover grayscale opacity-80"
               />
               <div className="absolute inset-0 border-[20px] border-black/20 m-4"></div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-gold-600 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">O MANIFESTO</span>
              <h2 className="text-5xl font-serif text-white mb-10 tracking-widest">A VERDADE COMO FILTRO</h2>
              <div className="space-y-8 text-zinc-400 font-light text-base md:text-lg leading-loose tracking-wide">
                <p>
                  EM UM MUNDO SATURADO DE FILTROS ARTIFICIAIS, <strong className="text-zinc-200 font-bold">SUA ESSÊNCIA É SEU ÚNICO DIFERENCIAL COMPETITIVO.</strong>
                </p>
                <p>
                  MEU TRABALHO NÃO É SOBRE ESTÉTICA VAZIA. É SOBRE ENCONTRAR O PONTO DE INTERSECÇÃO ENTRE QUEM VOCÊ É E QUEM VOCÊ PRECISA PARECER PARA O MERCADO.
                </p>
                <p>
                  UM RETRATO CORPORATIVO NÃO É UMA FOTO. É UM ATIVO FINANCEIRO QUE ENCURTA O CAMINHO ENTRE VOCÊ E O SEU PRÓXIMO GRANDE NEGÓCIO.
                </p>
              </div>
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-zinc-900 pt-10">
                <div>
                   <h4 className="text-3xl font-serif text-white">10+</h4>
                   <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-zinc-500 font-bold">ANOS DE EXP.</p>
                </div>
                <div>
                   <h4 className="text-3xl font-serif text-white">5K+</h4>
                   <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-zinc-500 font-bold">RETRATOS</p>
                </div>
                <div>
                   <h4 className="text-3xl font-serif text-white">100%</h4>
                   <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-zinc-500 font-bold">LEGADO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-32 bg-black border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
            <div>
              <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">INSTAGRAM</span>
              <h2 className="text-5xl font-serif text-white tracking-widest italic">BASTIDORES</h2>
            </div>
            <a 
              href={instagramLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-4 text-zinc-400 hover:text-gold-500 transition-colors tracking-widest text-sm"
            >
              {instagramHandle}
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {instagramPhotos.map((photo) => (
              <a 
                key={photo.id} 
                href={instagramLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden group"
              >
                <img 
                  src={photo.url} 
                  alt="Post" 
                  className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="text-[10px] font-bold tracking-[0.3em]">VER POST</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
