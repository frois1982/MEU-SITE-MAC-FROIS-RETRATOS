
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionTitle, Button, Skeleton, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, MessageCircle, Sparkles, User, Target, Zap, Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, PortfolioItem } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const [heroImg, setHeroImg] = useState<string>('https://images.unsplash.com/photo-1492691523567-6170f0295dbd?q=80&w=1920&auto=format&fit=crop&grayscale=true');
  const [manifestoImg, setManifestoImg] = useState<string>('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop&grayscale=true');
  const [featuredItems, setFeaturedItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para a Consultoria IA
  const [profession, setProfession] = useState('');
  const [goal, setGoal] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  const whatsappUrl = "https://wa.me/5548996231894?text=Olá%20Mac,%20vi%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20retratos%20de%20posicionamento.";

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

          const homeTagged = data.filter((f: any) => f.name.toUpperCase().includes('_HOME'));
          const artFallback = data.filter((f: any) => 
            f.name.toUpperCase().startsWith('ART_') && 
            !f.name.toUpperCase().includes('_HOME')
          );

          const combined = [...homeTagged, ...artFallback]
            .slice(0, 4)
            .map((file: any) => {
              const nameUpper = file.name.toUpperCase();
              let cat: 'Corporate' | 'Portrait' | 'Artistic' = 'Artistic';
              if (nameUpper.includes('CORP_')) cat = 'Corporate';
              else if (nameUpper.includes('PORT_')) cat = 'Portrait';

              return {
                id: file.id,
                title: file.name.split('_')[1]?.split('.')[0] || 'Obra',
                category: cat,
                imageUrl: file.url
              };
            });

          setFeaturedItems(combined);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro Home Drive:", err);
        setLoading(false);
      });
  }, []);

  const handleAiConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profession || !goal) return;

    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analise o perfil para um retrato estratégico:
        Profissão: "${profession}"
        Objetivo de Imagem: "${goal}"`,
        config: { 
          systemInstruction: "Você é o consultor de imagem do Estúdio Mac Frois. Seu tom é sofisticado, minimalista e focado em autoridade. Analise o perfil e sugira um dos projetos: 'Van Gogh' (Essencial), 'Da Vinci' (Storytelling) ou 'Apolo 360º' (Gestão Completa).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projeto: { type: Type.STRING, description: "Nome do projeto sugerido" },
              estrategia: { type: Type.STRING, description: "Uma frase impactante sobre a narrativa visual" },
              arquetipo: { type: Type.STRING, description: "O arquétipo que melhor comunica o objetivo" },
              dicaVisual: { type: Type.STRING, description: "Dica curta de vestimenta ou tom de iluminação" }
            },
            required: ["projeto", "estrategia", "arquetipo", "dicaVisual"]
          }
        }
      });
      
      const data = JSON.parse(response.text || '{}');
      setRecommendation(data);
      
      // Scroll suave para o resultado em dispositivos móveis
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (error) {
      console.error("Erro na consultoria IA:", error);
    }
    setAiLoading(false);
  };

  const resetConsultation = () => {
    setRecommendation(null);
    setProfession('');
    setGoal('');
  };

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
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
             <Link to="/portfolio" className="w-full md:w-auto">
               <Button className="w-full md:px-12 py-5 tracking-[0.3em] !bg-gold-600/50 hover:!bg-gold-600/70 backdrop-blur-md border-none">PORTFÓLIO</Button>
             </Link>
             <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
               <Button className="w-full md:px-12 py-5 tracking-[0.3em] !bg-[#25D366]/50 hover:!bg-[#25D366]/70 border-none flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.1)] backdrop-blur-md">
                 <MessageCircle size={20} />
                 WHATSAPP
               </Button>
             </a>
             <Link to="/servicos" className="w-full md:w-auto">
               <Button variant="outline" className="w-full md:px-12 py-5 tracking-[0.3em] !bg-white/5 backdrop-blur-md !border-zinc-700 hover:!bg-white/10">PROJETOS</Button>
             </Link>
          </div>
        </div>
      </section>

      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="w-full md:w-1/2 relative">
               {loading ? <Skeleton className="w-full h-[600px]" /> : (
                 <img src={manifestoImg} alt="Manifesto" className="w-full h-auto grayscale opacity-80 shadow-2xl" />
               )}
               <div className="absolute inset-0 border-[20px] border-black/20 m-4 pointer-events-none"></div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-gold-600 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">O MANIFESTO</span>
              <h2 className="text-5xl font-serif text-white mb-10 tracking-widest">A VERDADE COMO FILTRO</h2>
              <div className="space-y-8 text-zinc-400 font-light text-base md:text-lg leading-loose tracking-wide">
                <p>EM UM MUNDO SATURADO DE FILTROS ARTIFICIAIS, <strong className="text-zinc-200 font-bold">SUA ESSÊNCIA É SEU ÚNICO DIFERENCIAL.</strong></p>
                <p>UM RETRATO CORPORATIVO NÃO É UMA FOTO. É UM ATIVO FINANCEIRO QUE ENCURTA O CAMINHO PARA O SUCESSO.</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-gold-500 hover:text-gold-400 tracking-[0.2em] uppercase text-sm font-bold border-b border-gold-600 pb-1 transition-all">
                  Iniciar meu projeto agora →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Funcional: Espelho da Autoridade */}
      <section className="py-32 bg-black border-y border-zinc-900 overflow-hidden relative" id="espelho">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Consultoria com IA</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 italic tracking-widest">Espelho da Autoridade</h2>
              <p className="text-zinc-500 text-sm tracking-[0.2em] uppercase max-w-xl mx-auto font-light">
                Descubra em segundos a estratégia visual que elevará seu ticket médio e percepção de valor.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <form onSubmit={handleAiConsultation} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-2">
                      <User size={12} className="text-gold-600" /> Sua Profissão Atual
                    </label>
                    <input 
                      type="text" 
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Ex: CEO, Advogada, Arquiteto..."
                      required
                      disabled={!!recommendation || aiLoading}
                      className="w-full bg-zinc-900/50 border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-wide transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Target size={12} className="text-gold-600" /> Objetivo de Imagem
                    </label>
                    <input 
                      type="text" 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Ex: Transmitir confiança e luxo..."
                      required
                      disabled={!!recommendation || aiLoading}
                      className="w-full bg-zinc-900/50 border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-wide transition-all disabled:opacity-50"
                    />
                  </div>
                  
                  {!recommendation ? (
                    <Button 
                      type="submit" 
                      disabled={aiLoading || !profession || !goal}
                      className="w-full py-5 flex items-center justify-center gap-3 tracking-[0.3em] shadow-[0_10px_30px_rgba(217,119,6,0.1)]"
                    >
                      {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      {aiLoading ? 'ANALISANDO PERFIL...' : 'OBTER DIAGNÓSTICO'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={resetConsultation}
                      variant="outline"
                      className="w-full py-5 flex items-center justify-center gap-3 tracking-[0.3em] border-zinc-800 hover:border-gold-500"
                    >
                      <RotateCcw size={18} />
                      NOVA CONSULTA
                    </Button>
                  )}
                </form>
                
                <div className="p-6 border-l-2 border-zinc-900 bg-zinc-900/20 rounded-r-md">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck size={14} className="text-gold-600" />
                    <span className="text-white text-[9px] font-bold uppercase tracking-widest">Tecnologia Segura</span>
                  </div>
                  <p className="text-zinc-600 text-[10px] uppercase leading-relaxed tracking-widest">
                    Algoritmo exclusivo baseado em semiótica e arquétipos aplicados pelo Estúdio Mac Frois.
                  </p>
                </div>
              </div>

              <div className="relative min-h-[400px]" ref={resultRef}>
                <div className={`transition-all duration-700 transform ${recommendation ? 'opacity-100 translate-y-0' : 'opacity-20 blur-md pointer-events-none translate-y-10'}`}>
                  <Card className="border-gold-600/30 bg-zinc-900/50 backdrop-blur-xl h-full flex flex-col justify-between shadow-2xl">
                    <div>
                      <h4 className="text-gold-500 text-xs font-bold tracking-[0.4em] uppercase mb-8 border-b border-zinc-800 pb-4 flex items-center gap-3">
                        <Zap size={16} /> Diagnóstico de Autoridade
                      </h4>
                      
                      {recommendation && (
                        <div className="space-y-8 animate-fade-in">
                          <div>
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-2 font-bold">Projeto Recomendado</span>
                            <p className="text-white text-3xl font-serif tracking-widest uppercase italic group flex items-center gap-3">
                              {recommendation.projeto}
                            </p>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-2 font-bold">Estratégia Narrativa</span>
                            <p className="text-zinc-200 text-sm font-light tracking-wide italic leading-relaxed border-l border-gold-600/50 pl-4 py-1">
                              "{recommendation.estrategia}"
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="bg-black/20 p-4 rounded-sm border border-zinc-800/50">
                              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-2">Arquétipo</span>
                              <p className="text-gold-600 text-[11px] font-bold tracking-[0.2em] uppercase">{recommendation.arquetipo}</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-sm border border-zinc-800/50">
                              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-2">Direção de Look</span>
                              <p className="text-zinc-300 text-[10px] uppercase tracking-wider font-light">{recommendation.dicaVisual}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 flex flex-col gap-3">
                      <Link to="/servicos">
                        <Button className="w-full py-4 text-[10px] tracking-[0.3em] !bg-gold-600 hover:!bg-gold-500">
                          SOLICITAR ESTE PROJETO <ArrowRight size={14} className="ml-2 inline" />
                        </Button>
                      </Link>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full py-4 text-[10px] tracking-[0.3em] border-zinc-800">
                          Falar com o Retratista
                        </Button>
                      </a>
                    </div>
                  </Card>
                </div>
                {!recommendation && !aiLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 animate-pulse">
                    <Sparkles size={48} className="text-zinc-800 mb-6" />
                    <p className="text-zinc-700 text-xs tracking-[0.5em] uppercase font-bold">Aguardando dados para diagnóstico...</p>
                  </div>
                )}
                {aiLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <Loader2 size={48} className="text-gold-600 animate-spin mb-6" />
                    <p className="text-gold-500 text-xs tracking-[0.5em] uppercase font-bold">Consultando a Ciência do Retrato...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Mini Grid */}
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="A Estética da Verdade" subtitle="Recortes do Portfólio" />
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {featuredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate('/portfolio')}
                  className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 group cursor-pointer relative shadow-2xl border border-zinc-900"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="text-center">
                       <span className="text-white text-[10px] tracking-[0.5em] uppercase border-b border-gold-600 pb-1 block mb-2">Ver Obra</span>
                       <span className="text-gold-500 text-[8px] tracking-[0.3em] uppercase opacity-70 italic">{item.title}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-800 tracking-[0.5em] uppercase text-xs border border-dashed border-zinc-900 rounded-lg mt-16">
              Sincronize arquivos 'ART_' ou use a tag '_HOME' nos nomes.
            </div>
          )}
          
          <div className="mt-16">
             <Link to="/portfolio" className="text-gold-500 hover:text-white transition-colors text-xs tracking-[0.5em] uppercase font-bold border-b border-gold-600/30 pb-1">Explorar Portfólio Completo →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
