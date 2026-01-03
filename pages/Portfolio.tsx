
import React, { useState, useEffect, useRef } from 'react';
import { SectionTitle, Skeleton } from '../components/UI';
import { PortfolioItem } from '../types';
import { DRIVE_SCRIPT_URL } from '../config';
import { X, Maximize2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) {
      setLoading(false);
      return;
    }

    fetch(`${DRIVE_SCRIPT_URL}?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mappedItems: PortfolioItem[] = data
            .filter((file: any) => {
              const name = file.name.toUpperCase();
              return name.startsWith('CORP') || name.startsWith('PORT') || name.startsWith('ART');
            })
            .map((file: any) => {
              const name = file.name.toUpperCase();
              
              // Limpa o nome: pega o que vem após o _ e remove tudo após o primeiro ponto ou espaço extra
              let cleanTitle = file.name;
              if (cleanTitle.includes('_')) cleanTitle = cleanTitle.split('_')[1];
              cleanTitle = cleanTitle.split('.')[0].split(' ')[0].replace(/[-_]/g, ' ');

              return {
                id: file.id,
                title: cleanTitle.toUpperCase() || "OBRA VISUAL",
                category: name.startsWith('CORP') ? 'Corporate' : 
                          name.startsWith('PORT') ? 'Portrait' : 'Artistic',
                imageUrl: file.url
              };
            });
          setItems(mappedItems);
          setError(null);
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Erro de Sincronia");
        setLoading(false);
      });
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

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
                 onClick={() => { setActiveCategory(cat.id); setSelectedIndex(null); }} 
                 className={`px-8 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-500 border ${activeCategory === cat.id ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-zinc-800 text-zinc-500'}`}
               >
                  {cat.label}
               </button>
            ))}
          </div>
          <p className="text-zinc-500 text-sm max-w-md text-center italic">{currentCategory?.description}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div key={item.id} onClick={() => setSelectedIndex(index)} className="relative group overflow-hidden rounded-sm border border-zinc-900 bg-zinc-900 cursor-zoom-in">
                <img src={item.imageUrl} alt={item.title} className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:brightness-[0.3]" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-8 text-center">
                  <Maximize2 className="text-gold-500 mb-4 w-6 h-6" />
                  <h3 className="text-xl font-serif text-white mb-2">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedIndex(null)}>
          <button className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X size={40} /></button>
          <img src={selectedItem.imageUrl} alt={selectedItem.title} className="max-w-full max-h-[85vh] object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
};
