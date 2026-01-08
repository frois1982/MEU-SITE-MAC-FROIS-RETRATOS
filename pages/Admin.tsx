
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, FileText, Save, FileDown, Rocket } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [syncID, setSyncID] = useState('');

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

  const getCleanTopic = () => {
    return topic
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toUpperCase()
      .substring(0, 15);
  };

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    // Gera um ID curto e memorável como no vídeo
    const newID = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSyncID(newID);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um manifesto editorial de luxo para o retratista Mac Frois sobre: "${topic}". 
        REGRAS: Texto visceral, sem negritos, sem hashtags, apenas parágrafos puros e elegantes.`,
        config: { temperature: 0.8 }
      });
      setGeneratedText(response.text?.replace(/[#*`_]/g, '').trim() || '');
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
        contents: { parts: [{ text: `High-end black and white portrait, cinematic, minimalist, theme: ${topic}` }] },
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

  const downloadTXT = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `POST_${syncID}_${getCleanTopic()}_TEXTO.txt`;
    link.click();
  };

  const downloadJPG = () => {
    // Converte base64 para Blob para garantir download correto
    fetch(generatedImg)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `POST_${syncID}_${getCleanTopic()}_FOTO.jpg`;
        link.click();
      });
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 border-b border-zinc-900 pb-12">
           <div>
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editoria Mac Frois</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest uppercase">Creative Lab</h1>
           </div>
           {!hasKey && (
             <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-3 font-bold border-none shadow-xl">
               <Key size={16} className="mr-3" /> ATIVAR IA
             </Button>
           )}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8 shadow-2xl">
              <h3 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-10 flex items-center gap-3">
                <PenTool size={16} className="text-gold-500" /> Composição Editorial
              </h3>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Conceito central do manifesto..."
                className="w-full bg-black border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-40 mb-8"
              />
              <div className="space-y-4">
                <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-5 flex items-center justify-center gap-4 !bg-gold-600 text-black border-none font-bold tracking-[0.3em]">
                  {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} GERAR CONTEÚDO
                </Button>
                <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-5 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-500 tracking-[0.3em]">
                  {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />} GERAR CAPA
                </Button>
              </div>
            </Card>

            {syncID && (
               <div className="bg-zinc-900 border border-gold-600/30 p-8 rounded-sm space-y-6 animate-slide-up shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Save size={18} className="text-gold-500" />
                      <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Sincronia Manual</h4>
                    </div>
                    <span className="text-gold-500 text-[10px] font-mono font-bold bg-gold-600/10 px-2 py-1 rounded-sm">{syncID}</span>
                  </div>
                  
                  <p className="text-zinc-500 text-[9px] uppercase tracking-widest leading-relaxed mb-4">
                    Baixe os arquivos abaixo e coloque-os na sua pasta <strong className="text-white">CONTEUDO_BLOG</strong> no Drive.
                  </p>

                  <button onClick={downloadTXT} disabled={!generatedText} className="w-full bg-white text-black p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 font-black rounded-sm hover:bg-gold-500 transition-colors disabled:opacity-20">
                    <FileDown size={22} /> BAIXAR TEXTO (.txt)
                  </button>
                  <button onClick={downloadJPG} disabled={!generatedImg} className="w-full bg-zinc-800 text-white p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 font-black border border-zinc-700 rounded-sm hover:border-gold-500 transition-colors disabled:opacity-20">
                    <Download size={22} /> BAIXAR CAPA (.jpg)
                  </button>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div className="bg-zinc-900/30 border border-zinc-800 min-h-[500px] p-12 md:p-20 relative overflow-hidden backdrop-blur-sm rounded-sm">
               {loadingText && (
                 <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
                    <Loader2 size={48} className="text-gold-500 animate-spin mb-4" />
                    <p className="text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold">Manifestando Editorial...</p>
                 </div>
               )}
               <textarea 
                 value={generatedText} 
                 onChange={(e) => setGeneratedText(e.target.value)}
                 className="w-full bg-transparent text-zinc-300 text-xl md:text-2xl leading-[2.2] font-light italic outline-none font-serif h-[600px] resize-none" 
                 placeholder="O manifesto aparecerá aqui..." 
               />
               <div className="absolute bottom-8 right-8 text-[9px] text-zinc-700 tracking-[0.4em] font-bold uppercase">
                 DNA: {syncID}
               </div>
            </div>
            {generatedImg && (
              <div className="relative group">
                <img src={generatedImg} className="w-full aspect-video object-cover grayscale border border-zinc-800 rounded-sm shadow-2xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <p className="text-white text-[10px] tracking-[0.5em] font-bold uppercase">Capa Visual Ativa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
