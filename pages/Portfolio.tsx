import React, { useState } from 'react';
import { SectionTitle } from '../components/UI';
import { PortfolioItem } from '../types';

const portfolioItems: PortfolioItem[] = [
  { id: '1', title: 'A Essência do Líder', category: 'Corporate', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '2', title: 'Alma Artística', category: 'Artistic', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '3', title: 'O Olhar', category: 'Portrait', imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '4', title: 'Elegância Atemporal', category: 'Portrait', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '5', title: 'Estrutura e Forma', category: 'Artistic', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '6', title: 'Executivo Moderno', category: 'Corporate', imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '7', title: 'Luz Natural', category: 'Portrait', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '8', title: 'Contraste', category: 'Artistic', imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop&grayscale=true' },
  { id: '9', title: 'Autenticidade', category: 'Portrait', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop&grayscale=true' },
];

export const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const getButtonClass = (category: string) => {
    const baseStyle = "relative px-8 py-2.5 rounded-full text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-500 border outline-none select-none overflow-hidden";
    
    if (activeCategory === category) {
      return `${baseStyle} border-gold-500 text-gold-500 bg-gold-500/10 font-bold animate-active-pulse`;
    }
    
    return `${baseStyle} border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900 active:scale-95`;
  };

  const categories = [
    { id: 'All', label: 'Todos', description: 'Uma visão geral da nossa busca pela verdade visual.' },
    { id: 'Corporate', label: 'Corporativo', description: 'Retratos que comunicam poder, confiança e autoridade estratégica.' },
    { id: 'Portrait', label: 'Retratos', description: 'A celebração da essência humana em sua forma mais pura.' },
    { id: 'Artistic', label: 'Artístico', description: 'Explorações visuais onde a luz e a sombra ditam a narrativa.' }
  ];

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6">
        <style>{`
          @keyframes active-pulse {
            0% { 
              transform: scale(1); 
              box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.4);
              border-color: rgba(217, 119, 6, 0.5);
            }
            50% { 
              transform: scale(1.04); 
              box-shadow: 0 0 20px 2px rgba(217, 119, 6, 0.2);
              border-color: rgba(217, 119, 6, 1);
            }
            100% { 
              transform: scale(1); 
              box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.4);
              border-color: rgba(217, 119, 6, 0.5);
            }
          }
          .animate-active-pulse {
            animation: active-pulse 3s infinite ease-in-out;
          }
        `}</style>

        <SectionTitle title="Portfólio" subtitle="Trabalhos Selecionados" />
        
        {/* Category Filters */}
        <div className="flex flex-col items-center mb-20">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((cat) => (
               <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)} 
                  className={getButtonClass(cat.id)}
               >
                  {cat.label}
               </button>
            ))}
          </div>
          <p className="text-zinc-500 text-sm max-w-md text-center italic animate-fade-in" key={activeCategory}>
            {currentCategory?.description}
          </p>
        </div>

        {/* Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="relative group overflow-hidden break-inside-avoid rounded-sm border border-zinc-900 bg-zinc-900 shadow-xl"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-auto object-cover grayscale transition-all duration-1000 ease-out group-hover:scale-110 group-hover:grayscale-0"
              />
              
              <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center cursor-pointer">
                <div className="overflow-hidden mb-2">
                  <h3 className="text-2xl font-serif text-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {item.title}
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-150 ease-out">
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-4 border border-gold-600/20 pointer-events-none transition-all duration-700 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
