
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, FileText, Save, FileDown, AlertCircle, Info } from 'lucide-react';

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
    // ID curto de 5 caracteres, ex: 7X9K2
    return Math.random().toString(36).substring(2, 7).toUpperCase();
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
        REGRAS: Texto puro, elegante, sem markdown, focado em essência e verdade.`,
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
        contents: { parts: [{ text: `High-end black and white editorial photography, cinematic, minimalist. Concept: ${topic}` }] },
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

  const downloadFile = (data: string, type: 'TEXTO' | 'CAPA') => {
    const cleanTopic = topic.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 15);
    const fileName = `${type}_${currentSyncID}_${cleanTopic}.${type === 'TEXTO' ? 'txt' : 'png'}`;
    
    const link = document.createElement('a');
    if (type === 'TEXTO') {
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
      link.href = URL.createObjectURL(blob);
    } else {
      link.href = data;
    }
    link.download = fileName;
    link.click();
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
           <div>
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editoria Mac Frois</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest uppercase">Laboratório de Arquivos</h1>
           </div>
           {!hasKey && (
             <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-2.5 font-bold border-none shadow-xl">
               <Key size={16} className="mr-3" /> ATIVAR IA
             </Button>
           )}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Coluna de Controle */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8 shadow-2xl backdrop-blur-md">
              <h3 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-8 border-b border-zinc-800/50 pb-6 flex items-center gap-3">
                <PenTool size={16} className="text-gold-500" /> Compor Novo Post
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Ideia Central</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Sobre o que vamos escrever?"
                    className="w-full bg-black/60 border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-32 resize-none"
                  />
                </div>
                
                <div className="space-y-4">
                  <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-5 flex items-center justify-center gap-4 !bg-gold-600 text-black border-none font-bold tracking-[0.3em]">
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    GERAR TEXTO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-5 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-600 tracking-[0.3em]">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    GERAR CAPA
                  </Button>
                </div>
              </div>
            </Card>

            {currentSyncID && (
               <div className="bg-zinc-900 border border-gold-600/30 p-8 rounded-sm space-y-6 shadow-2xl animate-slide-up border-l-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Save size={18} className="text-gold-500" />
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Sincronia Identificada</h4>
                  </div>
                  
                  <div className="p-4 bg-black/40 rounded-sm mb-4">
                    <p className="text-zinc-500 text-[10px] tracking-widest uppercase mb-2">DNA de Conexão:</p>
                    <span className="text-gold-500 font-mono text-xl font-bold tracking-widest">{currentSyncID}</span>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => downloadFile(generatedText, 'TEXTO')}
                      disabled={!generatedText}
                      className="w-full bg-white hover:bg-gold-500 text-black p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 transition-all rounded-sm font-black shadow-xl disabled:opacity-20"
                    >
                      <FileDown size={20} /> 1. BAIXAR TEXTO
                    </button>
                    
                    <button 
                      onClick={() => downloadFile(generatedImg, 'CAPA')}
                      disabled={!generatedImg}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 transition-all rounded-sm font-black border border-zinc-700 disabled:opacity-20"
                    >
                      <Download size={20} /> 2. BAIXAR CAPA
                    </button>
                  </div>

                  <div className="flex gap-3 text-gold-500/50">
                    <AlertCircle size={14} className="shrink-0" />
                    <p className="text-[8px] uppercase tracking-widest leading-relaxed">
                      Instrução: Suba ambos os arquivos baixados na sua pasta do Drive. O sistema usará o DNA {currentSyncID} para unir os dois no site.
                    </p>
                  </div>
               </div>
            )}
          </div>

          {/* Coluna de Visualização */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-zinc-900/50 border border-zinc-800 p-0 min-h-[500px] relative rounded-sm shadow-2xl overflow-hidden">
               {loadingText && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
                     <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                     <p className="text-gold-500 text-[10px] tracking-[1em] uppercase font-bold">Processando Editorial...</p>
                  </div>
               )}
               <div className="p-12 md:p-20">
                  <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
                    <span className="text-zinc-500 text-[9px] tracking-[0.6em] uppercase font-bold flex items-center gap-3">
                      <FileText size={14} className="text-gold-500" /> Manuscrito
                    </span>
                    {generatedText && (
                      <button onClick={() => {
                        navigator.clipboard.writeText(generatedText);
                        setCopyStatus(true);
                        setTimeout(() => setCopyStatus(false), 2000);
                      }} className="text-zinc-500 hover:text-white transition-all text-[9px] tracking-[0.3em] uppercase flex items-center gap-2">
                        {copyStatus ? <Check size={12} /> : <Copy size={12} />} {copyStatus ? 'Copiado' : 'Copiar'}
                      </button>
                    )}
                  </div>
                  <textarea
                    value={generatedText}
                    onChange={(e) => setGeneratedText(e.target.value)}
                    className="w-full bg-transparent text-zinc-300 text-xl leading-relaxed font-light italic outline-none font-serif h-[600px] resize-none"
                    placeholder="O editorial será revelado aqui..."
                  />
               </div>
            </div>
            
            <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-sm shadow-2xl overflow-hidden relative group">
               {loadingImg && (
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
                     <Loader2 size={40} className="text-gold-500 animate-spin" />
                  </div>
               )}
               {generatedImg ? (
                 <img src={generatedImg} className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0" alt="Preview" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800">
                    <ImageIcon size={48} className="mb-4 opacity-10" />
                    <p className="text-[9px] tracking-[0.5em] uppercase font-bold opacity-10">Aguardando Imagem</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
