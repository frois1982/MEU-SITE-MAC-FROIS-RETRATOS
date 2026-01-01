
import React from 'react';
import { SectionTitle, Button, Card } from '../components/UI';
import { Check, Target, Video, Zap, Smartphone, FileText, ClipboardCheck } from 'lucide-react';
import { Service, Product } from '../types';

export const Services: React.FC = () => {
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
            <div key={service.id} className={`bg-zinc-900 border ${idx === 1 ? 'border-gold-600' : 'border-zinc-800'} p-8 flex flex-col rounded-sm hover:border-gold-500 transition-all`}>
              <h3 className="text-2xl font-serif text-white mb-6">{service.title}</h3>
              <p className="text-zinc-500 mb-8 text-sm flex-grow uppercase tracking-wider">{service.description}</p>
              <ul className="space-y-4 mb-10 border-t border-zinc-800 pt-8">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start text-zinc-300 text-xs tracking-widest uppercase">
                    <Check size={14} className="text-gold-500 mr-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={idx === 1 ? 'primary' : 'outline'} className="w-full">Solicitar Proposta</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Products: React.FC = () => {
  const products: Product[] = [
    {
      id: 'p1',
      title: 'Lúmina: Edição',
      description: 'Masterclass de edição de pele e luz.',
      price: 'R$ 297,00',
      badge: 'Curso',
      ctaLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop&grayscale=true'
    },
    {
      id: 'p2',
      title: 'Lumina Pro',
      description: 'Aplicativo de seleção de galerias.',
      price: 'R$ 19,90/mês',
      badge: 'Software',
      ctaLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop&grayscale=true'
    },
    {
      id: 'p3',
      title: 'Pack Ouro & Sombra',
      description: 'Presets exclusivos para Lightroom.',
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
           <SectionTitle title="Mac Frois Digital" subtitle="Expanda sua autoridade" />
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {products.map((p) => (
            <Card key={p.id} className="!p-0 overflow-hidden group border-zinc-900">
               <div className="h-64 overflow-hidden"><img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={p.title} /></div>
               <div className="p-8">
                 <h3 className="text-xl font-serif text-white mb-4 tracking-widest">{p.title}</h3>
                 <p className="text-zinc-500 text-xs mb-8 uppercase leading-relaxed">{p.description}</p>
                 <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                    <span className="text-gold-500 font-bold">{p.price}</span>
                    <Button variant="outline" className="!py-2 !px-4 !text-[10px]">VER MAIS</Button>
                 </div>
               </div>
            </Card>
          ))}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 backdrop-blur-sm">
            <div className="md:w-1/2">
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
                  <Button className="px-12 py-5 tracking-[0.3em] w-full border-none">APLICAR PARA A MENTORIA</Button>
                </a>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop&grayscale=true" className="rounded-sm opacity-60 grayscale hover:opacity-100 transition-all duration-700" alt="Mentoria" />
                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop&grayscale=true" className="rounded-sm opacity-60 grayscale hover:opacity-100 transition-all duration-700 mt-12" alt="Resultados" />
            </div>
        </div>
      </div>
    </div>
  );
};