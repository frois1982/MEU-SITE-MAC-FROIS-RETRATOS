
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton } from '../components/UI';
import { PortfolioItem } from '../types';
import { DRIVE_SCRIPT_URL } from '../config';
import { X, Maximize2, AlertTriangle } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
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
              let title = file.name.split('.')[0].split('_')[1] || "OBRA VISUAL";
              title = title.replace(/-/g, ' ');

              return {
                id: file.id,
                title: title.toUpperCase(),
                category: name.startsWith('CORP') ? 'Corporate' : 
                          name.startsWith('PORT') ? 'Portrait' : 'Artistic',
                imageUrl: file.url
              };
            });
          setItems(mappedItems);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'All', label: 'Todos' },
    { id: 'Corporate', label: 'Corporativo' },
    { id: 'Portrait', label: 'Retratos' },
    { id: 'Artistic', label: 'Artístico' }
  ];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen text-zinc-200">
      <div className="container mx-auto px-6">
        <SectionTitle title="Portfólio" subtitle="Trabalhos Dinâmicos" />
        
        <div className="flex justify-center gap-4 mb-16 overflow-x-auto pb-4">
          {categories.map((cat) => (
             <button 
               key={cat.id} 
               onClick={() => { setActiveCategory(cat.id); setSelectedIndex(null); }} 
               className={`px-8 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all border ${activeCategory === cat.id ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-zinc-800 text-zinc-500'}`}
             >
                {cat.label}
             </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div key={item.id} onClick={() => setSelectedIndex(index)} className="relative group overflow-hidden bg-zinc-900 cursor-zoom-in">
                <img src={item.imageUrl} alt={item.title} className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                  <Maximize2 className="text-gold-500 mb-4" />
                  <h3 className="text-white font-serif italic text-lg">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedIndex(null)}>
          <button className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X size={40} /></button>
          <img src={filteredItems[selectedIndex].imageUrl} className="max-w-full max-h-[85vh] object-contain shadow-2xl" alt="Preview" />
        </div>
      )}
    </div>
  );
};
