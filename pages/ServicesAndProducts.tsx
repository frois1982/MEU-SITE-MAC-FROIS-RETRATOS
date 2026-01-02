
import React, { useState, useEffect } from 'react';
import { SectionTitle, Button, Card, Skeleton } from '../components/UI';
import { Check, Target, Video, Zap, Smartphone, FileText, ClipboardCheck, Sparkles, Cpu, Clock } from 'lucide-react';
import { Service, Product } from '../types';

// MAC: Usando o mesmo script que já está funcionando no seu site!
const DRIVE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvauekYnaF2p429x0aB2eaAWNIBKdth4INNZtooTpH62GATSPzXEbYhM3jEgwAFedynw/exec";

export const Services: React.FC = () => {
  const getWhatsappLink = (projectName: string) => {
    const baseUrl = "https://wa.me/5548996231894";
    const message = encodeURIComponent(`Olá Mac, estive no seu site e gostaria de solicitar uma proposta para o ${projectName}. Como podemos prosseguir?`);
    return `${baseUrl}?text=${message}`;
  };

  const services: Service[] = [
    {
      id: 's1',
      title: 'Projeto Van Gogh',
      description: 'Seu primeiro retrato de impacto. Ideal para quem busca uma imagem profissional, autêntica e objetiva.',
      features: ['1 hora de estúdio', '2 trocas de roupa', '8 fotos tratadas', 'Consultoria de imagem']
    },
    {
      id: 's2',
      title: 'Projeto Da Vinci',
      description: 'Uma imersão profunda na sua marca pessoal com uso de arquétipos e storytelling.',
      features: ['3 horas de sessão', 'Direção Criativa', 'Arquétipos de Marca', '60 fotos tratadas premium']
    },
    {
      id: 's3',
      title: 'Projeto Apolo 360º',
      description: 'A parceria estratégica definitiva para toda a sua presença digital.',
      features: ['Acompanhamento Trimestral', 'Sessões Mensais', 'Produção de Vídeo', 'Gestão de Imagem']
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200">
        <SectionTitle title="Projetos de Posicionamento" subtitle="Imagem com Autoridade" />
        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={service.id} className={`bg-zinc-900 border ${idx === 1 ? 'border-gold-600' : 'border-zinc-800'} p-8 flex flex-col rounded-sm hover:border-gold-500 transition-all group relative overflow-hidden`}>
              {idx === 1 && (
                <div className="absolute top-0 right-0 bg-gold-600 text-black text-[10px] font-bold px-3 py-1 tracking-tighter">
                  MAIS PROCURADO
                </div>
              )}
              <h3 className="text-2xl font-serif text-white mb-6">{service.title}</h3>
              <p className="text-zinc-500 mb-8 text-sm flex-grow uppercase tracking-wider leading-relaxed">{service.description}</p>
              <ul className="space-y-4 mb-10 border-t border-zinc-800 pt-8">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start text-zinc-300 text-[11px] tracking-widest uppercase">
                    <Check size={14} className="text-gold-500 mr-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a 
                href={getWhatsappLink(service.title)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button variant={idx === 1 ? 'primary' : 'outline'} className="w-full py-4 shadow-xl">
                  Solicitar Proposta
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Products: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<{ [key: string]: string }>({
    p1: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop&grayscale=true',
    p2: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop&grayscale=true',
    p3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop&grayscale=true',
    ment1: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop&grayscale=true',
    ment2: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop&grayscale=true'
  });

  useEffect(() => {
    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const newImages = { ...images };
          data.forEach((file: any) => {
            const name = file.name.toUpperCase();
            if (name.startsWith('PROD1_')) newImages.p1 = file.url;
            if (name.startsWith('PROD2_')) newImages.p2 = file.url;
            if (name.startsWith('PROD3_')) newImages.p3 = file.url;
            if (name.startsWith('MENTORIA1_')) newImages.ment1 = file.url;
            if (name.startsWith('MENTORIA2_')) newImages.ment2 = file.url;
          });
          setImages(newImages);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro Produtos Drive:", err);
        setLoading(false);
      });
  }, []);

  const products: (Product & { features?: string[], icon?: React.ReactNode })[] = [
    {
      id: 'p1',
      title: 'Lúmina: Edição',
      description: 'Aplicativo de edição de fotos. Aplique presets com um clique, tratando sua pele com categoria de modelo e estilo instagramável.',
      price: 'R$ 297,00',
      badge: 'Aplicativo',
      ctaLink: '#',
      imageUrl: images.p1,
      icon: <Sparkles className="text-gold-500 mb-2" size={20} />,
      features: ['Presets One-Click', 'Pele de Modelo', 'Estética Visual']
    },
    {
      id: 'p2',
      title: 'Lúmina Pro',
      description: 'Gerenciamento de galeria com IA. Organiza, seleciona e limpa sua biblioteca em tempo real, 24h por dia, liberando seu tempo.',
      price: 'R$ 19,90/mês',
      badge: 'Inteligência Artificial',
      ctaLink: '#',
      imageUrl: images.p2,
      icon: <Cpu className="text-gold-500 mb-2" size={20} />,
      features: ['Organização IA', 'Seleção em Tempo Real', 'Suporte 24h']
    },
    {
      id: 'p3',
      title: 'Pack Ouro & Sombra',
      description: 'A coleção definitiva de presets para Lightroom. Em breve, a assinatura visual do Mac Frois disponível para o seu fluxo.',
      price: 'Em Breve',
      badge: 'Lançamento',
      ctaLink: '#',
      imageUrl: images.p3,
      icon: <Clock className="text-gold-500 mb-2" size={20} />,
      features: ['Presets Lightroom', 'Assinatura Mac Frois', 'Fila de Espera']
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6 text-zinc-200">
        <div className="text-center mb-16">
           <SectionTitle title="Mac Frois Digital" subtitle="Expanda sua autoridade" />
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {products.map((p) => (
            <Card key={p.id} className="!p-0 overflow-hidden group border-zinc-900 flex flex-col h-full bg-zinc-900/40">
               <div className="h-64 overflow-hidden relative">
                 {loading ? <Skeleton className="w-full h-full" /> : (
                   <img 
                    src={p.imageUrl} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                    alt={p.title} 
                   />
                 )}
                 <div className="absolute top-4 left-4">
                    <span className="bg-black/80 backdrop-blur-md text-gold-500 border border-gold-500/30 text-[9px] font-bold px-3 py-1 uppercase tracking-widest">{p.badge}</span>
                 </div>
               </div>
               <div className="p-8 flex flex-col flex-grow">
                 <div className="flex items-center gap-2 mb-2">
                    {p.icon}
                    <h3 className="text-xl font-serif text-white tracking-widest">{p.title}</h3>
                 </div>
                 <p className="text-zinc-500 text-[11px] mb-8 uppercase leading-relaxed font-light tracking-wider flex-grow">{p.description}</p>
                 
                 <div className="space-y-2 mb-8">
                    {p.features?.map((f, i) => (
                      <div key={i} className="flex items-center text-[9px] text-zinc-400 tracking-[0.2em] uppercase">
                        <div className="w-1 h-1 bg-gold-600 mr-3 rounded-full"></div>
                        {f}
                      </div>
                    ))}
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                    <span className="text-gold-500 font-bold tracking-widest">{p.price}</span>
                    <Button variant="outline" className="!py-2 !px-4 !text-[10px] !border-zinc-800 hover:!border-gold-500">
                      {p.price === 'Em Breve' ? 'ME AVISE' : 'CONHECER'}
                    </Button>
                 </div>
               </div>
            </Card>
          ))}
        </div>

        {/* Seção de Mentoria */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="md:w-1/2 relative z-10">
                <span className="text-gold-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Aplicação: Mentoria Retratista</span>
                <h3 className="text-4xl font-serif text-white mb-4 tracking-widest">Poder da Imagem que Vende</h3>
                <h4 className="text-gold-500 text-lg font-serif italic mb-8">Mentoria para profissionais • Resultados Reais</h4>
                
                <p className="text-zinc-400 mb-10 leading-relaxed font-light text-sm tracking-widest uppercase">
                    Acompanhamento individual para quem busca a construção de uma imagem que gera lucro, reconhecimento e presença. Retratos que vendem sua autoridade.
                </p>

                <ul className="space-y-5 mb-12">
                    <li className="flex items-center text-zinc-300 text-[11px] tracking-widest uppercase"><Video size={16} className="mr-4 text-gold-500"/> 06 Encontros Individuais e Ao Vivo</li>
                    <li className="flex items-center text-zinc-300 text-[11px] tracking-widest uppercase"><Target size={16} className="mr-4 text-gold-500"/> Estratégia de Posicionamento</li>
                    <li className="flex items-center text-zinc-300 text-[11px] tracking-widest uppercase"><Smartphone size={16} className="mr-4 text-gold-500"/> Suporte WhatsApp com Mac Frois</li>
                    <li className="flex items-center text-zinc-300 text-[11px] tracking-widest uppercase"><FileText size={16} className="mr-4 text-gold-500"/> Material de Apoio Personalizado</li>
                    <li className="flex items-center text-zinc-300 text-[11px] tracking-widest uppercase"><ClipboardCheck size={16} className="mr-4 text-gold-500"/> Entregáveis para sua Imagem</li>
                </ul>
                
                <a href="https://yhluvxb5n5l.typeform.com/to/IA5uA5eO" target="_blank" rel="noopener noreferrer" className="block w-full md:inline-block">
                  <Button className="px-12 py-5 tracking-[0.3em] w-full border-none shadow-[0_0_30px_rgba(217,119,6,0.1)]">APLICAR PARA A MENTORIA</Button>
                </a>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                <div className="overflow-hidden rounded-sm h-64 md:h-80">
                  {loading ? <Skeleton className="w-full h-full" /> : (
                    <img 
                      src={images.ment1} 
                      className="w-full h-full object-cover opacity-60 grayscale hover:opacity-100 transition-all duration-700 hover:scale-105" 
                      alt="Mentoria 1" 
                    />
                  )}
                </div>
                <div className="overflow-hidden rounded-sm h-64 md:h-80 mt-12 border-l border-gold-600/20">
                  {loading ? <Skeleton className="w-full h-full" /> : (
                    <img 
                      src={images.ment2} 
                      className="w-full h-full object-cover opacity-60 grayscale hover:opacity-100 transition-all duration-700 hover:scale-105" 
                      alt="Mentoria 2" 
                    />
                  )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
