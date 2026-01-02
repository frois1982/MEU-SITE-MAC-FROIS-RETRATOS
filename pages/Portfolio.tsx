
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton } from '../components/UI';
import { PortfolioItem } from '../types';

const DRIVE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvauekYnaF2p429x0aB2eaAWNIBKdth4INNZtooTpH62GATSPzXEbYhM3jEgwAFedynw/exec"; 

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

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

  const categories = [
    { id: 'All', label: 'Todos', description: 'Uma visão geral da busca pela verdade visual.' },
    { id: 'Corporate', label: 'Corporativo', description: 'Retratos que comunicam poder e autoridade.' },
    { id: 'Portrait', label: 'Retratos', description: 'A celebração da essência humana.' },
    { id: 'Artistic', label: 'Artístico', description: 'Narrativas criadas com luz e sombra.' }
  ];

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200">
        <SectionTitle title="Portfólio" subtitle="Trabalhos Dinâmicos" />
        
        <div className="flex flex-col items-center mb-20">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((cat) => (
               <button 
                 key={cat.id} 
                 onClick={() => setActiveCategory(cat.id)} 
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
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group overflow-hidden break-inside-avoid rounded-sm border border-zinc-900 bg-zinc-900 shadow-xl">
                <img src={item.imageUrl} alt={item.title} className="w-full h-auto grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-2xl font-serif text-white mb-2">{item.title}</h3>
                  <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em]">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
