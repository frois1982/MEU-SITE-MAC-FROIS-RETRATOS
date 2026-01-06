
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionTitle, Button, Skeleton, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { ArrowRight, MessageCircle, Sparkles, User, Target, Zap, Loader2, RotateCcw, ShieldCheck, AlertCircle, Key } from 'lucide-react';
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
  const [apiError, setApiError] = useState<string | null>(null);

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

  const handleKeyActivation = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        setApiError(null);
      }
    } catch (e) {
      console.error("Erro ao abrir seletor de chaves:", e);
    }
  };

  const handleAiConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profession || !goal) return;

    setAiLoading(true);
    setApiError(null);

    try {
      // Tenta usar a chave do ambiente (Vercel) ou a do seletor do Studio
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        throw new Error("Chave de API não configurada.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `CLIENTE: 
        Profissão: "${profession}"
        Objetivo Visual: "${goal}"`,
        config: { 
          systemInstruction: `Você é o estrategista de imagem de luxo do Estúdio Mac Frois. 
          Sua missão é dar um diagnóstico curto e impactante sobre o posicionamento visual do cliente.
          O tom deve ser sofisticado e minimalista.
          Escolha um dos projetos: "Van Gogh", "Da Vinci" ou "Apolo 360º".`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projeto: { type: Type.STRING },
              estrategia: { type: Type.STRING },
              arquetipo: { type: Type.STRING },
              dicaVisual: { type: Type.STRING }
            },
            required: ["projeto", "estrategia", "arquetipo", "dicaVisual"]
          }
        }
      });
      
      const text = response.text;
      if (text) {
        setRecommendation(JSON.parse(text));
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } catch (error: any) {
      console.error("Erro na IA:", error);
      if (error.message?.includes("Chave")) {
        setApiError("Chave de API ausente. Se você for o administrador, ative-a abaixo.");
      } else {
        setApiError("Erro de conexão com o servidor de IA. Tente novamente.");
      }
    }
    setAiLoading(false);
  };

  const resetConsultation = () => {
    setRecommendation(null);
    setProfession('');
    setGoal('');
    setApiError(null);
  };

  return (
    <div className="text-zinc-200">
      {/* Hero Section */}
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
               <Button className="w-full md:px-12 py-5 tracking-[0.3em] !bg-gold-600/70 hover:!bg-gold-600/90 backdrop-blur-md border-none">PORTFÓLIO</Button>
             </Link>
             <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
               <Button className="w-full md:px-12 py-5 tracking-[0.3em] !bg-[#25D366]/70 hover:!bg-[#25D366]/90 border-none flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.1)] backdrop-blur-md">
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

      {/* Manifesto */}
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

      {/* Espelho da Autoridade (IA Section) */}
      <section className="py-32 bg-black border-y border-zinc-900 overflow-hidden relative" id="espelho">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Protótipo • Consultoria IA</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 italic tracking-widest">Espelho da Autoridade</h2>
              <p className="text-zinc-500 text-sm tracking-[0.2em] uppercase max-w-xl mx-auto font-light">
                Descubra qual narrativa visual melhor serve ao seu momento profissional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <form onSubmit={handleAiConsultation} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-2">
                      <User size={12} className="text-gold-600" /> Qual sua profissão?
                    </label>
                    <input 
                      type="text" 
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Ex: CEO, Advogada, Arquiteto..."
                      required
                      disabled={aiLoading}
                      className="w-full bg-zinc-900/40 border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-wide transition-all backdrop-blur-md focus:bg-zinc-900/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Target size={12} className="text-gold-600" /> O que deseja transmitir?
                    </label>
                    <input 
                      type="text" 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Ex: Confiança e Autoridade..."
                      required
                      disabled={aiLoading}
                      className="w-full bg-zinc-900/40 border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-wide transition-all backdrop-blur-md focus:bg-zinc-900/60"
                    />
                  </div>
                  
                  {apiError ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-sm flex items-start gap-3">
                        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-200 text-[10px] uppercase tracking-widest leading-relaxed">{apiError}</p>
                      </div>
                      <div className="flex gap-2">
                         <Button onClick={handleKeyActivation} variant="outline" className="flex-1 py-4 text-[10px] border-zinc-800">
                           <Key size={14} className="mr-2" /> ATIVAR CHAVE
                         </Button>
                         <Button onClick={resetConsultation} variant="secondary" className="px-4">
                           <RotateCcw size={14} />
                         </Button>
                      </div>
                    </div>
                  ) : !recommendation ? (
                    <Button 
                      type="submit" 
                      disabled={aiLoading || !profession || !goal}
                      className="w-full py-5 flex items-center justify-center gap-3 tracking-[0.3em] !bg-gold-600/70 hover:!bg-gold-600 backdrop-blur-md shadow-[0_10px_30px_rgba(217,119,6,0.1)] transition-all active:scale-[0.98]"
                    >
                      {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      {aiLoading ? 'ANALISANDO...' : 'OBTER DIAGNÓSTICO'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={resetConsultation}
                      variant="outline"
                      className="w-full py-5 flex items-center justify-center gap-3 tracking-[0.3em] border-zinc-800 hover:border-gold-500 backdrop-blur-sm"
                    >
                      <RotateCcw size={18} />
                      REFAZER ANÁLISE
                    </Button>
                  )}
                </form>
                
                <div className="p-6 border-l-2 border-zinc-900 bg-zinc-900/40 rounded-r-md backdrop-blur-md border border-zinc-800/30">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck size={14} className="text-gold-600" />
                    <span className="text-white text-[9px] font-bold uppercase tracking-widest">Tecnologia Mac Frois</span>
                  </div>
                  <p className="text-zinc-600 text-[10px] uppercase leading-relaxed tracking-widest font-medium">
                    Diagnóstico baseado em semiótica visual e arquétipos de marca pessoal.
                  </p>
                </div>
              </div>

              <div className="relative min-h-[420px]" ref={resultRef}>
                <div className={`transition-all duration-700 transform h-full ${recommendation ? 'opacity-100 translate-y-0 scale-100' : 'opacity-10 blur-xl pointer-events-none translate-y-10 scale-95'}`}>
                  <Card className="border-gold-600/30 bg-zinc-900/70 backdrop-blur-2xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold-600/10 rounded-full blur-[60px] group-hover:bg-gold-600/15 transition-all"></div>
                    <div className="relative z-10">
                      <h4 className="text-gold-500 text-[10px] font-bold tracking-[0.5em] uppercase mb-10 border-b border-zinc-800 pb-4 flex items-center gap-3">
                        <Zap size={14} className="animate-pulse" /> Diagnóstico de Imagem
                      </h4>
                      
                      {recommendation && (
                        <div className="space-y-10 animate-fade-in">
                          <div>
                            <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-2 font-bold opacity-60">Projeto Recomendado</span>
                            <p className="text-white text-4xl font-serif tracking-[0.2em] uppercase italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                              {recommendation.projeto}
                            </p>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-2 font-bold opacity-60">Estratégia Narrativa</span>
                            <p className="text-zinc-200 text-sm font-light tracking-wide italic leading-relaxed border-l-2 border-gold-600/60 pl-6 py-2">
                              "{recommendation.estrategia}"
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 p-5 rounded-sm border border-zinc-800/60 backdrop-blur-md">
                              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-2 font-bold">Arquétipo</span>
                              <p className="text-gold-600 text-[11px] font-bold tracking-[0.2em] uppercase">{recommendation.arquetipo}</p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-sm border border-zinc-800/60 backdrop-blur-md">
                              <span className="text-zinc-500 text-[9px] uppercase tracking-widest block mb-2 font-bold">Look e Estilo</span>
                              <p className="text-zinc-400 text-[10px] uppercase tracking-wider font-light leading-snug">{recommendation.dicaVisual}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 flex flex-col gap-3 relative z-10">
                      <Link to="/servicos">
                        <Button className="w-full py-5 text-[10px] tracking-[0.4em] !bg-gold-600/80 hover:!bg-gold-600 shadow-xl">
                          RESERVAR PROJETO <ArrowRight size={14} className="ml-2 inline" />
                        </Button>
                      </Link>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full py-5 text-[10px] tracking-[0.4em] !border-zinc-800 hover:!border-gold-600/40 backdrop-blur-sm">
                          Consultar Retratista
                        </Button>
                      </a>
                    </div>
                  </Card>
                </div>
                {!recommendation && !aiLoading && !apiError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 animate-pulse">
                    <div className="relative mb-8">
                       <div className="absolute inset-0 bg-gold-600/20 blur-2xl rounded-full"></div>
                       <Sparkles size={56} className="text-zinc-800 relative z-10" />
                    </div>
                    <p className="text-zinc-700 text-[10px] tracking-[0.6em] uppercase font-bold max-w-[200px] leading-loose">Aguardando dados para diagnóstico...</p>
                  </div>
                )}
                {aiLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 z-20">
                    <div className="w-48 h-1 bg-zinc-900 mb-10 overflow-hidden rounded-full relative">
                       <div className="absolute inset-0 bg-gold-600/40 animate-[loading_1.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(217,119,6,0.4)]"></div>
                    </div>
                    <Loader2 size={56} className="text-gold-500 animate-spin mb-8 opacity-80" />
                    <p className="text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">Mapeando Autoridade...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="A Estética da Verdade" subtitle="Portfólio em Destaque" />
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {featuredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate('/portfolio')}
                  className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 group cursor-pointer relative shadow-2xl border border-zinc-900 rounded-sm"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                     <div className="text-center border border-white/10 bg-white/5 backdrop-blur-md p-6 w-full h-full flex flex-col items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                       <span className="text-white text-[10px] tracking-[0.5em] uppercase border-b border-gold-600/50 pb-2 block mb-3 font-bold">Ver Obra</span>
                       <span className="text-gold-500 text-[8px] tracking-[0.3em] uppercase opacity-70 italic font-medium">{item.title}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-800 tracking-[0.5em] uppercase text-xs border border-dashed border-zinc-900 rounded-lg mt-16">
              Sincronize arquivos '_HOME' para destacar fotos aqui.
            </div>
          )}
          
          <div className="mt-16">
             <Link to="/portfolio" className="text-gold-500 hover:text-white transition-colors text-xs tracking-[0.5em] uppercase font-bold border-b border-gold-600/30 pb-1">Portfólio Completo →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
