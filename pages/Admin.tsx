
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, ImagePlus, ArrowRight, Save, Info, FileText, FolderOpen, ExternalLink, Code2, HelpCircle, MousePointer2, Star, BookOpen, Quote, CloudUpload, CheckCircle, AlertCircle, Rocket, FileDown } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle');
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
    // Gera um ID curto e único para ligar Texto e Foto
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const getCleanFileName = (prefix: string, extension: string) => {
    const cleanTopic = topic
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 20);
    
    // FORMATO: PREFIXO_ID_TEMA.extensao
    // Ex: BLOG_X9Y2_POSICIONAMENTO.txt
    return `${prefix}_${currentSyncID}_${cleanTopic}.${extension}`;
  };

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    setPublishStatus('idle');
    const newID = generateSyncID();
    setCurrentSyncID(newID);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um editorial de luxo para o retratista Mac Frois sobre: "${topic}".
        
        REGRAS ABSOLUTAS:
        - NUNCA use hashtags (#), asteriscos (*), negritos (**) ou listas (-).
        - O texto deve ser PURO, apenas parágrafos elegantes e quebras de linha.
        - Comece com uma reflexão filosófica sobre a essência e a verdade.
        - Use um tom poético e sofisticado.`,
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
        contents: { parts: [{ text: `High-end black and white editorial photography, cinematic deep shadows, minimalist composition. Concept: ${topic}` }] },
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

  const downloadText = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getCleanFileName('BLOG', 'txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadImage = () => {
    if (!generatedImg) return;
    const a = document.createElement('a');
    a.href = generatedImg;
    a.download = getCleanFileName('CAPA', 'png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
           <div className="text-center md:text-left">
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editoria Mac Frois</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest uppercase">Laboratório Criativo</h1>
           </div>
           
           <div className="flex items-center gap-4">
             {!hasKey && (
               <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-2.5 flex items-center gap-3 font-bold border-none shadow-xl">
                 <Key size={16} /> ATIVAR IA
               </Button>
             )}
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8 shadow-2xl backdrop-blur-md">
              <h3 className="text-white text-[11px] font-bold tracking-[0.4em] uppercase mb-8 flex items-center gap-4 border-b border-zinc-800/50 pb-6">
                <PenTool size={18} className="text-gold-500" /> Composição
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Ideia Central</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Qual a verdade de hoje?"
                    rows={4}
                    className="w-full bg-black/60 border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest transition-all placeholder:text-zinc-800"
                  />
                </div>
                
                <div className="space-y-4">
                  <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-6 flex items-center justify-center gap-4 group !bg-gold-600/80 hover:!bg-gold-600 border-none shadow-lg tracking-[0.4em]">
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    MANIFESTAR TEXTO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-6 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-600 tracking-[0.4em]">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    MANIFESTAR CAPA
                  </Button>
                </div>
              </div>
            </Card>

            {(generatedText || generatedImg) && (
               <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-sm space-y-6 shadow-2xl animate-slide-up backdrop-blur-xl border-l-2 border-gold-600">
                  <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                    <Save size={16} className="text-gold-500" /> Downloads de Sincronia
                  </h4>
                  
                  <div className="space-y-3">
                    {generatedText && (
                      <button onClick={downloadText} className="w-full bg-white text-black p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all rounded-sm font-bold shadow-xl hover:bg-gold-500">
                        <FileDown size={18} /> Baixar Texto (Drive)
                      </button>
                    )}
                    {generatedImg && (
                      <button onClick={downloadImage} className="w-full bg-zinc-800 text-white p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all rounded-sm font-bold border border-zinc-700 hover:bg-zinc-700">
                        <Download size={18} /> Baixar Imagem (Drive)
                      </button>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                      Sincronizador Ativo: <span className="text-gold-500 font-bold">{currentSyncID}</span><br/><br/>
                      Para postar, apenas suba estes arquivos na sua pasta do Google Drive. O site fará a mágica.
                    </p>
                  </div>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-zinc-500 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center gap-3">
                   <FileText size={14} className="text-gold-500" /> Editorial em Revelação
                </span>
                {generatedText && (
                  <button onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                    setCopyStatus(true);
                    setTimeout(() => setCopyStatus(false), 2000);
                  }} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase font-bold">
                    {copyStatus ? <Check size={14} /> : <Copy size={14} />} {copyStatus ? 'Copiado' : 'Copiar Texto'}
                  </button>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-0 min-h-[500px] relative overflow-hidden rounded-sm shadow-2xl">
                 {loadingText && (
                    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[11px] tracking-[1em] uppercase font-bold">Manifestando...</p>
                    </div>
                 )}
                 <textarea
                   value={generatedText}
                   onChange={(e) => setGeneratedText(e.target.value)}
                   className="w-full h-full min-h-[500px] bg-transparent p-16 text-zinc-300 text-lg leading-relaxed font-light italic outline-none font-serif resize-none border-none"
                   placeholder="O editorial será manifestado aqui..."
                 />
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-zinc-500 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center gap-3 ml-4">
                 <ImageIcon size={14} className="text-gold-500" /> Capa Visual
              </span>
              <div className="bg-zinc-900 border border-zinc-800 aspect-video relative overflow-hidden rounded-sm flex items-center justify-center shadow-2xl">
                 {loadingImg && <Loader2 size={48} className="text-gold-500 animate-spin" />}
                 {generatedImg && (
                    <img src={generatedImg} alt="Capa" className="w-full h-full object-cover grayscale transition-all duration-[2s] hover:grayscale-0" />
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
