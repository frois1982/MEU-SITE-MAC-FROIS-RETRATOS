
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, FileText, Save, FileDown, AlertCircle, Info, ArrowRight, ShieldCheck } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [currentSyncID, setCurrentSyncID] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        if (selected || process.env.API_KEY) setHasKey(true);
      } else if (process.env.API_KEY) {
        setHasKey(true);
      }
    };
    checkStatus();
  }, []);

  const handleKeyActivation = async () => {
    try {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setHasKey(true);
      }
    } catch (e) {
      if (process.env.API_KEY) setHasKey(true);
    }
  };

  const generateSyncID = () => {
    // ID único alfa-numérico para garantir sincronia absoluta
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem O ou 0 para evitar erro humano
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    const newID = generateSyncID();
    setCurrentSyncID(newID);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um editorial de luxo para o retratista Mac Frois sobre: "${topic}".
        ESTILO: Minimalista, sofisticado, sem markdown, foco em autoridade e verdade.`,
        config: { temperature: 0.8 }
      });
      const pureText = (response.text || '').replace(/[#*`_]/g, '').trim();
      setGeneratedText(pureText);
    } catch (e) { console.error(e); }
    setLoadingText(false);
  };

  const generateCover = async () => {
    if (!topic) return;
    setLoadingImg(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `High-end black and white editorial portrait, cinematic depth, minimalist. Theme: ${topic}` }] },
        config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } },
      });
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImg(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (e) { console.error(e); }
    setLoadingImg(false);
  };

  const downloadManual = (type: 'MANIF' | 'IMAGEM') => {
    const cleanTopic = topic.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 15);
    const fileName = `${type}_${currentSyncID}_${cleanTopic}.${type === 'MANIF' ? 'txt' : 'png'}`;
    
    const link = document.createElement('a');
    if (type === 'MANIF') {
      const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
      link.href = URL.createObjectURL(blob);
    } else {
      link.href = generatedImg;
    }
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 border-b border-zinc-900 pb-12">
           <div>
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editoria Mac Frois</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest uppercase">Laboratório Criativo</h1>
           </div>
           {!hasKey ? (
             <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-3 font-bold border-none shadow-xl">
               <Key size={16} className="mr-3" /> ATIVAR INTELIGÊNCIA
             </Button>
           ) : (
             <div className="flex items-center gap-3 bg-zinc-900/50 px-6 py-3 border border-zinc-800 rounded-sm">
                <ShieldCheck size={16} className="text-green-500" />
                <span className="text-zinc-500 text-[9px] tracking-[0.3em] uppercase font-bold">IA Sincronizada</span>
             </div>
           )}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Controles de Geração */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8 shadow-2xl backdrop-blur-md">
              <h3 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-10 flex items-center gap-3 border-b border-zinc-800/50 pb-6">
                <PenTool size={16} className="text-gold-500" /> Nova Composição
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Tema do Manifesto</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: A essência do olhar..."
                    className="w-full bg-black/60 border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-40 resize-none transition-all"
                  />
                </div>
                
                <div className="space-y-4 pt-4">
                  <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-5 flex items-center justify-center gap-4 !bg-gold-600 text-black border-none font-bold tracking-[0.3em] shadow-lg">
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    GERAR CONTEÚDO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-5 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-500 tracking-[0.3em] transition-all">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    GERAR CAPA
                  </Button>
                </div>
              </div>
            </Card>

            {currentSyncID && (
               <div className="bg-zinc-900 border-l-4 border-gold-600 p-8 rounded-sm space-y-8 shadow-2xl animate-slide-up">
                  <div className="flex items-center gap-3">
                    <Save size={18} className="text-gold-500" />
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Sincronia por DNA</h4>
                  </div>
                  
                  <div className="bg-black/60 p-6 rounded-sm text-center border border-zinc-800">
                    <p className="text-zinc-600 text-[9px] tracking-widest uppercase mb-2 font-bold">Código Identificador:</p>
                    <span className="text-gold-500 font-serif text-3xl font-bold tracking-[0.3em]">{currentSyncID}</span>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => downloadManual('MANIF')}
                      disabled={!generatedText}
                      className="w-full bg-white hover:bg-gold-500 text-black p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 transition-all rounded-sm font-black shadow-xl disabled:opacity-20"
                    >
                      <FileDown size={22} /> 1. BAIXAR MANIFESTO (.txt)
                    </button>
                    
                    <button 
                      onClick={() => downloadManual('IMAGEM')}
                      disabled={!generatedImg}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 transition-all rounded-sm font-black border border-zinc-700 disabled:opacity-20"
                    >
                      <Download size={22} /> 2. BAIXAR CAPA (.png)
                    </button>
                  </div>

                  <div className="bg-gold-600/5 p-4 rounded-sm border border-gold-600/10">
                    <p className="text-[9px] text-gold-500/70 uppercase tracking-widest leading-relaxed font-bold italic">
                      IMPORTANTE: Suba os dois arquivos na mesma pasta do Google Drive. O site fará a união automática pelo código {currentSyncID}.
                    </p>
                  </div>
               </div>
            )}
          </div>

          {/* Visualização de Produção */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-zinc-900/30 border border-zinc-800 min-h-[600px] relative rounded-sm shadow-2xl overflow-hidden backdrop-blur-sm">
               {loadingText && (
                  <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
                     <Loader2 size={56} className="text-gold-500 animate-spin mb-8" />
                     <p className="text-gold-500 text-[11px] tracking-[1.2em] uppercase font-bold animate-pulse">Revelando a Verdade...</p>
                  </div>
               )}
               <div className="p-12 md:p-24">
                  <div className="flex justify-between items-center mb-16 border-b border-zinc-800/50 pb-8">
                    <div className="flex items-center gap-4">
                      <FileText size={16} className="text-gold-500" />
                      <span className="text-zinc-500 text-[10px] tracking-[0.6em] uppercase font-bold">Manuscrito Editorial</span>
                    </div>
                    {generatedText && (
                      <button onClick={() => {
                        navigator.clipboard.writeText(generatedText);
                        setCopyStatus(true);
                        setTimeout(() => setCopyStatus(false), 2000);
                      }} className="text-zinc-500 hover:text-white transition-all text-[10px] tracking-[0.3em] uppercase flex items-center gap-3">
                        {copyStatus ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {copyStatus ? 'Copiado' : 'Copiar'}
                      </button>
                    )}
                  </div>
                  <textarea
                    value={generatedText}
                    onChange={(e) => setGeneratedText(e.target.value)}
                    className="w-full bg-transparent text-zinc-300 text-2xl leading-[2.2] font-light italic outline-none font-serif h-[800px] resize-none selection:bg-gold-600/30"
                    placeholder="O editorial será revelado aqui após a composição..."
                  />
               </div>
            </div>
            
            <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-sm shadow-2xl overflow-hidden relative group">
               {loadingImg && (
                  <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-20">
                     <Loader2 size={48} className="text-gold-500 animate-spin" />
                  </div>
               )}
               {generatedImg ? (
                 <img src={generatedImg} className="w-full h-full object-cover grayscale transition-all duration-[2.5s] group-hover:grayscale-0" alt="Preview Capa" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800">
                    <ImageIcon size={64} className="mb-6 opacity-5" />
                    <p className="text-[10px] tracking-[0.8em] uppercase font-bold opacity-5 italic">Aguardando Conceito Visual</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
