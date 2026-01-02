
import React, { useState, useEffect } from 'react';
import { SectionTitle, Skeleton } from '../components/UI';
import { PortfolioItem } from '../types';
import { X, Maximize2 } from 'lucide-react';

const DRIVE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvauekYnaF2p429x0aB2eaAWNIBKdth4INNZtooTpH62GATSPzXEbYhM3jEgwAFedynw/exec"; 

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);

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

  // Previne scroll do corpo quando a imagem está aberta
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

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
              <div 
                key={item.id} 
                onClick={() => setSelectedImage(item)}
                className="relative group overflow-hidden break-inside-avoid rounded-sm border border-zinc-900 bg-zinc-900 shadow-xl cursor-zoom-in"
              >
                {/* Imagem com Zoom e Escurecimento no Hover */}
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-auto grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-[0.4]" 
                />
                
                {/* Overlay com informações e ícone de expandir */}
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

      {/* Lightbox / Modal de Tela Cheia */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} strokeWidth={1} />
          </button>
          
          <div className="relative max-w-7xl max-h-full flex items-center justify-center">
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar na própria imagem
            />
            
            <div className="absolute -bottom-16 left-0 right-0 text-center animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-serif text-white">{selectedImage.title}</h3>
              <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mt-2">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
