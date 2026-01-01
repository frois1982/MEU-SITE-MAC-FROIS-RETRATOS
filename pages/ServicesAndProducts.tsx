
import React from 'react';
import { SectionTitle, Button, Card } from '../components/UI';
import { Check, Star, Download, Smartphone, Video, Zap, FileText, ClipboardCheck } from 'lucide-react';
import { Service, Product } from '../types';

/**
 * DICA PARA O MAC:
 * Para trocar as fotos de qualquer lugar do site:
 * 1. Procure por "imageUrl" ou "src=".
 * 2. Substitua o link entre aspas (https://images.unsplash...) pelo seu link da foto.
 */

// Services Page Component
export const Services: React.FC = () => {
  const services: Service[] = [
    {
      id: 's1',
      title: 'Projeto Van Gogh',
      description: 'Seu primeiro retrato de impacto. Ideal para quem busca uma imagem profissional, autêntica e objetiva para LinkedIn, currículos e imprensa.',
      price: 'Sob Consulta',
      features: [
        '1 hora de estúdio', 
        '2 trocas de roupa', 
        '8 fotos tratadas em alta resolução, com preview', 
        'Consultoria de imagem prévia'
      ]
    },
    {
      id: 's2',
      title: 'Projeto Da Vinci',
      description: 'Uma imersão profunda na sua marca pessoal. Um processo de consultoria que une arquétipos e storytelling para criar um banco de imagens que comunica sua verdadeira potência.',
      price: 'Sob Consulta',
      features: [
        '3 horas de sessão estúdio ou externa (podendo ser divididas em três sessões)', 
        'Direção Criativa e Storytelling', 
        'Arquétipos de Marca', 
        '60 fotos tratadas premium', 
        'Curadoria completa de manequins, roupas e estilo'
      ]
    },
    {
      id: 's3',
      title: 'Projeto Apolo 360º',
      description: 'A parceria estratégica definitiva. Cuidamos de toda a sua presença digital, da imagem ao conteúdo, com produção de retratos, podcast e gestão de canais.',
      price: 'Sob Consulta',
      features: [
        'Acompanhamento Trimestral', 
        'Sessões Mensais de Retratos', 
        'Produção de Podcast/Vídeo', 
        'Direção de Arte para Redes', 
        'Gestão de Imagem Corporativa'
      ]
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200">
        <SectionTitle title="Projetos de Posicionamento" subtitle="Invista na sua imagem estratégica" />
        
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={service.id} className={`bg-zinc-900 border ${idx === 1 ? 'border-gold-600 transform lg:-translate-y-4 shadow-[0_0_40px_rgba(217,119,6,0.1)]' : 'border-zinc-800'} p-8 flex flex-col relative rounded-sm transition-all duration-500 hover:border-gold-500/50`}>
              {idx === 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-600 text-black text-[10px] font-bold px-6 py-1.5 uppercase tracking-[0.2em] whitespace-nowrap shadow-xl">
                  A Transformação Completa
                </div>
              )}
              <h3 className="text-2xl font-serif text-white mb-6 tracking-widest">{service.title}</h3>
              <p className="text-zinc-500 mb-8 text-sm flex-grow leading-relaxed font-light uppercase tracking-wider">{service.description}</p>
              
              <ul className="space-y-5 mb-10 border-t border-zinc-800 pt-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-zinc-300 text-xs tracking-widest uppercase leading-snug">
                    <Check size={14} className="text-gold-500 mr-4 mt-0.5 shrink-0" />
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={idx === 1 ? 'primary' : 'outline'} className="w-full py-4 tracking-[0.3em]">
                Solicitar Proposta
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Products Page Component (Landing Page)
export const Products: React.FC = () => {
  const products: Product[] = [
    {
      id: 'p1',
      title: 'Lúmina: Edição Profissional',
      description: 'Minha masterclass de edição na palma da sua mão. Aprenda a tratar pele e luz mantendo a textura real.',
      price: 'R$ 297,00',
      badge: 'Masterclass',
      ctaLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop&grayscale=true'
    },
    {
      id: 'p2',
      title: 'Lumina Pro',
      description: 'Meu aplicativo exclusivo para selecionar e organizar suas galerias em minutos. Ganhe tempo para o que importa.',
      price: 'R$ 19,90/mês',
      badge: 'Software',
      ctaLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop&grayscale=true'
    },
    {
      id: 'p3',
      title: 'Pack "Ouro & Sombra"',
      description: 'As cores exatas que uso nos meus retratos de estúdio. Para Lightroom e Capture One.',
      price: 'R$ 149,00',
      badge: 'Presets',
      ctaLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop&grayscale=true'
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200">
        <div className="text-center mb-16">
           <SectionTitle title="Mac Frois Digital" subtitle="Expanda seu conhecimento" />
           <p className="max-w-2xl mx-auto text-zinc-500 text-sm tracking-[0.1em] uppercase font-light">
             Ferramentas e conhecimentos que acumulei em 10 anos de carreira, empacotados para acelerar a sua evolução.
           </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full !p-0 overflow-hidden group border-zinc-900 bg-zinc-900/40">
               <div className="relative h-64 overflow-hidden">
                 <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                 <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-[10px] px-4 py-1.5 border border-zinc-700 rounded-full font-bold tracking-widest uppercase">
                   {product.badge}
                 </div>
               </div>
               <div className="p-8 flex flex-col flex-grow">
                 <h3 className="text-xl font-serif text-white mb-4 tracking-widest uppercase">{product.title}</h3>
                 <p className="text-zinc-500 text-xs mb-8 flex-grow leading-relaxed font-light tracking-wider uppercase">{product.description}</p>
                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800">
                    <span className="text-gold-500 font-bold text-lg tracking-widest">{product.price}</span>
                    <Button variant="outline" className="!py-2 !px-6 !text-[10px] tracking-[0.2em]">
                      {product.id === 'p2' ? 'ASSINAR' : 'COMPRAR'}
                    </Button>
                 </div>
               </div>
            </Card>
          ))}
        </div>

        {/* Feature Highlight Section: Mentoria */}
        <div className="mt-24 bg-zinc-900/50 border border-zinc-800 rounded-sm p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 backdrop-blur-sm">
            <div className="md:w-1/2">
                <span className="text-gold-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">EXCLUSIVO</span>
                <h3 className="text-4xl font-serif text-white mb-8 tracking-widest">MENTORIA DE CARREIRA</h3>
                <p className="text-zinc-400 mb-10 leading-relaxed font-light text-sm tracking-widest uppercase">
                    Acompanhamento individual para fotógrafos que desejam migrar para o mercado de luxo e retrato corporativo de alta performance.
                </p>
                <ul className="space-y-5 mb-10">
                    <li className="flex items-center text-zinc-300 text-xs tracking-widest uppercase">
                        <Video size={16} className="mr-4 text-gold-500 shrink-0"/> 
                        6 ENCONTROS INDIVIDUAIS E AO VIVO
                    </li>
                    <li className="flex items-center text-zinc-300 text-xs tracking-widest uppercase">
                        <Zap size={16} className="mr-4 text-gold-500 shrink-0"/> 
                        ESTRATÉGIA DE POSICIONAMENTO
                    </li>
                    <li className="flex items-center text-zinc-300 text-xs tracking-widest uppercase">
                        <Smartphone size={16} className="mr-4 text-gold-500 shrink-0"/> 
                        SUPORTE DIRETO VIA WHATSAPP
                    </li>
                    <li className="flex items-center text-zinc-300 text-xs tracking-widest uppercase">
                        <FileText size={16} className="mr-4 text-gold-500 shrink-0"/> 
                        MATERIAL DE APOIO
                    </li>
                    <li className="flex items-center text-zinc-300 text-xs tracking-widest uppercase">
                        <ClipboardCheck size={16} className="mr-4 text-gold-500 shrink-0"/> 
                        ENTREGÁVEIS DURANTE A MENTORIA
                    </li>
                </ul>
                
                {/* 
                  MAC: Cole o link do seu formulário aqui no 'href' abaixo. 
                  Exemplo: href="https://forms.gle/SeuLinkAqui" 
                */}
                <a 
                  href="https://forms.gle/seu-formulario-aqui" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full md:w-auto"
                >
                  <Button className="px-10 py-4 tracking-[0.3em] w-full">APLICAR PARA MENTORIA</Button>
                </a>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop&grayscale=true" className="rounded-sm opacity-40 grayscale hover:opacity-80 transition-opacity duration-700" alt="Mentoria" />
                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop&grayscale=true" className="rounded-sm opacity-40 grayscale mt-12 hover:opacity-80 transition-opacity duration-700" alt="Mentoria" />
            </div>
        </div>
      </div>
    </div>
  );
};
