
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, FileText, Save, FileDown, Info, AlertTriangle } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
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

  const getFormattedDate = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
  };

  const getCleanTopic = () => {
    return topic
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toUpperCase()
      .substring(0, 20);
  };

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    const newID = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSyncID(newID);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um manifesto editorial de luxo para o retratista Mac Frois sobre: "${topic}". 
        REGRAS: Texto visceral, profundo, sem negritos, sem hashtags, apenas parágrafos puros e elegantes.`,
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
        contents: { parts: [{ text: `High-end black and white fine art portrait, cinematic shadows, minimalist composition, theme: ${topic}` }] },
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

  const downloadTextFile = () => {
    const date = getFormattedDate();
    const topicSlug = getCleanTopic();
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `EDITORIAL_${date}_${syncID}_${topicSlug}_TEXTO.txt`;
    link.click();
  };

  const downloadImageFile = () => {
    if (!generatedImg) return;
    const date = getFormattedDate();
    const topicSlug = getCleanTopic();
    const link = document.createElement('a');
    link.href = generatedImg;
    link.download = `EDITORIAL_${date}_${syncID}_${topicSlug}_IMG.png`;
    link.click();
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-zinc-900 pb-12">
           <div>
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editorial Hub</h2>
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
              <h3 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-8 flex items-center gap-3">
                <PenTool size={16} className="text-gold-500" /> Nova Composição
              </h3>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Tema do manifesto..."
                className="w-full bg-black border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-32 mb-8"
              />
              <div className="space-y-4">
                <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-5 flex items-center justify-center gap-4 !bg-gold-600 text-black border-none font-bold tracking-[0.3em]">
                  {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} GERAR TEXTO
                </Button>
                <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-5 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-500 tracking-[0.3em]">
                  {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />} GERAR CAPA
                </Button>
              </div>
            </Card>

            {syncID && (
               <div className="bg-zinc-900 border border-gold-600/30 p-8 rounded-sm space-y-6 animate-slide-up shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Save size={18} className="text-gold-500" />
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Exportação Manual</h4>
                  </div>
                  
                  <div className="bg-gold-600/10 border border-gold-600/30 p-5 rounded-sm flex items-start gap-4">
                    <AlertTriangle className="text-gold-500 shrink-0" size={20} />
                    <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest leading-relaxed">
                      IMPORTANTE: Baixe os arquivos e <span className="underline">arraste</span> para o Drive. <br/>
                      Não crie "Google Docs" manualmente no Drive, pois a IA não conseguirá ler o texto.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Button onClick={downloadTextFile} className="w-full py-5 flex items-center justify-center gap-3 !bg-white text-black hover:!bg-gold-500 border-none font-bold tracking-[0.2em] text-[11px]">
                      <FileDown size={18} /> BAIXAR TEXTO (.TXT)
                    </Button>
                    <Button onClick={downloadImageFile} disabled={!generatedImg} variant="outline" className="w-full py-5 flex items-center justify-center gap-3 border-zinc-800 text-zinc-300 hover:border-white font-bold tracking-[0.2em] text-[11px]">
                      <ImageIcon size={18} /> BAIXAR CAPA (.PNG)
                    </Button>
                  </div>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-zinc-900/30 border border-zinc-800 min-h-[500px] p-12 md:p-20 relative backdrop-blur-sm rounded-sm">
               {loadingText && (
                 <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
                    <Loader2 size={48} className="text-gold-500 animate-spin mb-4" />
                    <p className="text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold">Revelando manifesto...</p>
                 </div>
               )}
               <textarea 
                 value={generatedText} 
                 onChange={(e) => setGeneratedText(e.target.value)}
                 className="w-full bg-transparent text-zinc-300 text-xl md:text-2xl leading-[2.2] font-light italic outline-none font-serif h-[600px] resize-none" 
                 placeholder="O manifesto aparecerá aqui..." 
               />
               <div className="absolute bottom-8 right-8 text-[10px] text-zinc-800 tracking-[0.4em] font-bold uppercase">
                 ID DE SINCRONIA: {syncID || '---'}
               </div>
            </div>
            {generatedImg && (
              <div className="relative group rounded-sm overflow-hidden border border-zinc-800">
                <img src={generatedImg} className="w-full aspect-video object-cover grayscale" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
