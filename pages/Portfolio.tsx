
import React, { useState, useEffect, useRef } from 'react';
import { SectionTitle, Skeleton } from '../components/UI';
import { PortfolioItem } from '../types';
import { DRIVE_SCRIPT_URL } from '../config';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) {
      setLoading(false);
      return;
    }

    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mappedItems: PortfolioItem[] = data
            .filter((file: any) => {
              const name = file.name.toUpperCase();
              return name.startsWith('CORP_') || name.startsWith('PORT_') || name.startsWith('ART_');
            })
            .map((file: any) => {
              const name = file.name.toUpperCase();
              return {
                id: file.id,
                title: file.name.split('_')[1]?.split('.')[0] || 'Sem Título',
                category: name.startsWith('CORP_') ? 'Corporate' : 
                          name.startsWith('PORT_') ? 'Portrait' : 'Artistic',
                imageUrl: file.url
              };
            });
          setItems(mappedItems);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Portfolio Drive:", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(prev => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedIndex]);

  const categories = [
    { id: 'All', label: 'Todos', description: 'Uma visão geral da busca pela verdade visual.' },
    { id: 'Corporate', label: 'Corporativo', description: 'Retratos que comunicam poder e autoridade.' },
    { id: 'Portrait', label: 'Retratos', description: 'A celebração da essência humana.' },
    { id: 'Artistic', label: 'Artístico', description: 'Narrativas criadas com luz e sombra.' }
  ];

  const currentCategory = categories.find(c => c.id === activeCategory);
  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200">
        <SectionTitle title="Portfólio" subtitle="Trabalhos Dinâmicos" />
        
        <div className="flex flex-col items-center mb-20">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((cat) => (
               <button 
                 key={cat.id} 
                 onClick={() => {
                   setActiveCategory(cat.id);
                   setSelectedIndex(null);
                 }} 
                 className={`px-8 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-500 border ${activeCategory === cat.id ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-zinc-800 text-zinc-500'}`}
               >
                  {cat.label}
               </button>
            ))}
          </div>
          <p className="text-zinc-500 text-sm max-w-md text-center italic">{currentCategory?.description}</p>
        </div>

        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 w-full" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-zinc-700 tracking-[0.3em] uppercase text-xs border border-dashed border-zinc-900 rounded-lg">
            Aguardando sincronização com Google Drive... <br/>
            <span className="text-[10px] mt-4 block text-zinc-500">Certifique-se de que a pasta está pública e as fotos têm os prefixos corretos.</span>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedIndex(index)}
                className="relative group overflow-hidden break-inside-avoid rounded-sm border border-zinc-900 bg-zinc-900 shadow-xl cursor-zoom-in"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-auto grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-[0.4]" 
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                  <Maximize2 className="text-gold-500 mb-4 w-6 h-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" />
                  <h3 className="text-2xl font-serif text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.title}</h3>
                  <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.3em] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedIndex(null)}
          >
            <X size={40} strokeWidth={1} />
          </button>

          <button 
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-gold-500 transition-all z-[110] p-2 bg-black/20 rounded-full hover:bg-black/50"
            onClick={handlePrev}
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>

          <div className="relative max-w-7xl max-h-full flex items-center justify-center px-4">
            <img 
              key={selectedItem.id}
              src={selectedItem.imageUrl} 
              alt={selectedItem.title} 
              className="max-w-full max-h-[80vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500 select-none"
              onClick={(e) => e.stopPropagation()} 
            />
            
            <div className="absolute -bottom-20 left-0 right-0 text-center animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-serif text-white">{selectedItem.title}</h3>
              <div className="flex items-center justify-center gap-4 mt-2">
                <p className="text-gold-500 text-[10px] tracking-[0.4em] uppercase">{selectedItem.category}</p>
                <span className="text-zinc-600 text-[10px] font-mono">{(selectedIndex! + 1).toString().padStart(2, '0')} / {filteredItems.length.toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <button 
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-gold-500 transition-all z-[110] p-2 bg-black/20 rounded-full hover:bg-black/50"
            onClick={handleNext}
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </div>
      )}
    </div>
  );
};
