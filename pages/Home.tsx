
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle, Button, Skeleton } from '../components/UI';
import { ArrowRight } from 'lucide-react';

// MAC: Mantenha este link. Lembre-se de atualizar o ID da PASTA dentro do Google Script!
const DRIVE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvauekYnaF2p429x0aB2eaAWNIBKdth4INNZtooTpH62GATSPzXEbYhM3jEgwAFedynw/exec";

export const Home: React.FC = () => {
  const [heroImg, setHeroImg] = useState<string>('https://images.unsplash.com/photo-1492691523567-6170f0295dbd?q=80&w=1920&auto=format&fit=crop&grayscale=true');
  const [manifestoImg, setManifestoImg] = useState<string>('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop&grayscale=true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!DRIVE_SCRIPT_URL) {
      setLoading(false);
      return;
    }

    fetch(DRIVE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const capa = data.find((f: any) => f.name.toUpperCase().startsWith('CAPA_'));
          const manif = data.find((f: any) => f.name.toUpperCase().startsWith('MANIF_'));
          if (capa) setHeroImg(capa.url);
          if (manif) setManifestoImg(manif.url);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro Home Drive:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="text-zinc-200">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {loading ? <Skeleton className="w-full h-full" /> : (
            <img src={heroImg} alt="Capa" className="w-full h-full object-cover opacity-40 transition-opacity duration-1000" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-gold-500 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 font-bold">FLORIANÓPOLIS, BRASIL</h2>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white mb-8 leading-tight tracking-[0.1em]">IMAGEM É<br /><span className="italic text-gold-500/90">AUTORIDADE</span></h1>
          <p className="max-w-2xl mx-auto text-zinc-400 mb-12 text-sm md:text-lg font-light tracking-[0.05em] uppercase opacity-80">A CIÊNCIA POR TRÁS DO RETRATO ESTRATÉGICO.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
             <Link to="/portfolio"><Button className="px-12 py-5 tracking-[0.3em]">PORTFÓLIO</Button></Link>
             <Link to="/contato"><Button variant="outline" className="px-12 py-5 tracking-[0.3em]">CONTATO</Button></Link>
          </div>
        </div>
      </section>

      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="w-full md:w-1/2 relative">
               {loading ? <Skeleton className="w-full h-[600px]" /> : (
                 <img src={manifestoImg} alt="Manifesto" className="w-full h-auto grayscale opacity-80" />
               )}
               <div className="absolute inset-0 border-[20px] border-black/20 m-4"></div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-gold-600 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">O MANIFESTO</span>
              <h2 className="text-5xl font-serif text-white mb-10 tracking-widest">A VERDADE COMO FILTRO</h2>
              <div className="space-y-8 text-zinc-400 font-light text-base md:text-lg leading-loose tracking-wide">
                <p>EM UM MUNDO SATURADO DE FILTROS ARTIFICIAIS, <strong className="text-zinc-200 font-bold">SUA ESSÊNCIA É SEU ÚNICO DIFERENCIAL.</strong></p>
                <p>UM RETRATO CORPORATIVO NÃO É UMA FOTO. É UM ATIVO FINANCEIRO QUE ENCURTA O CAMINHO PARA O SUCESSO.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
