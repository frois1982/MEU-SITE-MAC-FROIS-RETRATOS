
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, FileText, Save, FileDown, ShieldCheck, Camera } from 'lucide-react';

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

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    const newID = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSyncID(newID);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Manifesto editorial curto para Mac Frois (retratista de elite). Tema: "${topic}". Texto visceral, sem formatação.`,
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
        contents: { parts: [{ text: `High-end black and white portrait, minimalist, cinematic, theme: ${topic}` }] },
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

  const downloadJPG = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = `POST_${syncID}_FOTO.jpg`;
        link.click();
      }
    };
    img.src = generatedImg;
  };

  const downloadTXT = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `POST_${syncID}_TEXTO.txt`;
    link.click();
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
                <PenTool size={16} className="text-gold-500" /> Novo Post
              </h3>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Qual o conceito de hoje?"
                className="w-full bg-black border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-40 mb-8"
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
               <div className="bg-zinc-900 border-l-4 border-gold-600 p-8 rounded-sm space-y-6 animate-slide-up">
                  <div className="flex items-center gap-3 mb-4">
                    <Save size={18} className="text-gold-500" />
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Sincronia: {syncID}</h4>
                  </div>
                  <button onClick={downloadTXT} disabled={!generatedText} className="w-full bg-white text-black p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 font-black rounded-sm disabled:opacity-20">
                    <FileDown size={22} /> 1. BAIXAR TEXTO
                  </button>
                  <button onClick={downloadJPG} disabled={!generatedImg} className="w-full bg-zinc-800 text-white p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 font-black border border-zinc-700 rounded-sm disabled:opacity-20">
                    <Download size={22} /> 2. BAIXAR CAPA (JPG)
                  </button>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div className="bg-zinc-900/30 border border-zinc-800 min-h-[500px] p-12 md:p-24 relative overflow-hidden backdrop-blur-sm">
               {loadingText && <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-20"><Loader2 className="text-gold-500 animate-spin" /></div>}
               <textarea value={generatedText} readOnly className="w-full bg-transparent text-zinc-300 text-2xl leading-[2.2] font-light italic outline-none font-serif h-[600px] resize-none" placeholder="O texto aparecerá aqui..." />
            </div>
            {generatedImg && <img src={generatedImg} className="w-full aspect-video object-cover grayscale border border-zinc-800" />}
          </div>
        </div>
      </div>
    </div>
  );
};
