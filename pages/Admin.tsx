
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Check, Loader2, Key, PenTool, Code, Terminal, Save, Eye, Layout, Info, AlertTriangle } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
    } catch (e) { if (process.env.API_KEY) setHasKey(true); }
  };

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um manifesto editorial de luxo para o retratista Mac Frois sobre o tema: "${topic}". 
        ESTILO: Intelectual, minimalista, focado em posicionamento e autoridade.
        REGRAS: Use parágrafos limpos. Sem hashtags. Sem negritos exagerados.`,
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
        contents: { parts: [{ text: `High-end black and white fine art portrait, dramatic lighting, minimalist architecture background, cinematic photography, theme: ${topic}` }] },
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

  const getFullPostObject = () => {
    const id = "POST-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    const date = new Date().toISOString().split('T')[0];
    
    // O código gerado já é um objeto pronto para o array do config.ts
    const code = `  {
    id: "${id}",
    date: "${date}",
    title: "${topic.toUpperCase()}",
    content: \`${generatedText}\`,
    imageUrl: "${generatedImg || 'URL_DA_SUA_FOTO_AQUI'}"
  },`;
    
    return code;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFullPostObject());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-zinc-900 pb-12 gap-8">
           <div className="flex-grow">
             <div className="flex items-center gap-4 mb-4">
                <Layout className="text-gold-500" size={20} />
                <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase">Editorial Studio</h2>
             </div>
             <h1 className="text-5xl font-serif text-white italic tracking-tighter uppercase">Laboratório Criativo</h1>
           </div>
           
           <div className="flex gap-4">
             {!hasKey && (
               <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-4 font-bold border-none shadow-2xl">
                 ATIVAR INTELIGÊNCIA
               </Button>
             )}
             {generatedText && (
               <Button onClick={() => setPreviewMode(!previewMode)} variant="outline" className="px-8 border-zinc-800">
                 {previewMode ? <PenTool size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                 {previewMode ? "MODO EDITOR" : "PRÉVIA VISUAL"}
               </Button>
             )}
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Coluna de Configuração */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/60 border-zinc-800 p-8 shadow-2xl sticky top-32">
              <label className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">1. Definir Pauta</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: A importância do olhar no retrato corporativo..."
                className="w-full bg-black border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-32 mb-8 transition-colors"
              />
              
              <div className="space-y-4">
                <Button 
                  onClick={generateEditorial} 
                  disabled={loadingText || !topic || !hasKey} 
                  className="w-full py-5 !bg-gold-600 text-black border-none font-bold tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} 
                  {loadingText ? "CONCEBENDO..." : "GERAR TEXTO"}
                </Button>
                
                <Button 
                  onClick={generateCover} 
                  disabled={loadingImg || !topic || !hasKey} 
                  variant="outline" 
                  className="w-full py-5 border-zinc-800 hover:border-gold-500 tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />} 
                  {loadingImg ? "REVELANDO..." : "GERAR CAPA"}
                </Button>
              </div>

              {generatedText && (
                <div className="mt-12 pt-8 border-t border-zinc-800 space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="text-green-500" size={18} />
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Post Finalizado</h4>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-sm flex gap-3">
                     <Info size={16} className="text-blue-400 shrink-0" />
                     <p className="text-[9px] text-blue-300 uppercase tracking-widest leading-loose">
                       A imagem gerada pela IA já está embutida no código. Você não precisa de links externos.
                     </p>
                  </div>

                  <Button 
                    onClick={copyToClipboard} 
                    className={`w-full py-6 flex flex-col items-center justify-center gap-1 border-none transition-all duration-500 ${copied ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gold-500 shadow-xl'}`}
                  >
                    <div className="flex items-center gap-2">
                       {copied ? <Check size={20} /> : <Terminal size={20} />}
                       <span className="font-black tracking-[0.2em] text-[11px]">{copied ? "COPIADO!" : "COPIAR CÓDIGO"}</span>
                    </div>
                  </Button>

                  <div className="pt-4 space-y-3">
                     <div className="flex items-center gap-2 text-[9px] text-zinc-500 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-gold-600 rounded-full"></div>
                        Vá no arquivo <span className="text-white">config.ts</span>
                     </div>
                     <div className="flex items-center gap-2 text-[9px] text-zinc-500 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-gold-600 rounded-full"></div>
                        Cole abaixo do marcador de "Novo Post"
                     </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Coluna de Visualização/Edição */}
          <div className="lg:col-span-8">
            {previewMode ? (
              <div className="bg-black border border-zinc-900 p-12 md:p-24 rounded-sm animate-fade-in min-h-[800px] shadow-2xl">
                <div className="max-w-3xl mx-auto">
                   <span className="text-gold-600 text-[10px] font-bold tracking-[0.8em] uppercase mb-8 block text-center">PRÉVIA EDITORIAL</span>
                   <h2 className="text-4xl md:text-6xl font-serif text-white text-center italic tracking-widest uppercase mb-16 leading-tight">{topic || "Título do Manifesto"}</h2>
                   
                   {generatedImg && (
                     <img src={generatedImg} className="w-full aspect-video object-cover grayscale mb-16 border border-zinc-800" alt="Capa" />
                   )}
                   
                   <div className="text-zinc-300 text-xl md:text-2xl leading-[2.4] font-light italic font-serif whitespace-pre-wrap">
                     {generatedText || "O conteúdo aparecerá aqui..."}
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-zinc-900/40 border border-zinc-800 p-8 md:p-12 relative rounded-sm backdrop-blur-md">
                   <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">Refinar Manifesto (Opcional)</span>
                      <span className="text-zinc-700 text-[9px] font-mono tracking-widest uppercase">EDITOR ATIVO</span>
                   </div>
                   <textarea 
                     value={generatedText} 
                     onChange={(e) => setGeneratedText(e.target.value)}
                     className="w-full bg-transparent text-zinc-300 text-xl md:text-2xl leading-[2.2] font-light italic outline-none font-serif h-[700px] resize-none selection:bg-gold-600/30" 
                     placeholder="Escreva ou gere seu manifesto..." 
                   />
                </div>
                
                {generatedImg && (
                  <div className="relative group rounded-sm overflow-hidden border border-zinc-800 shadow-2xl">
                    <img src={generatedImg} className="w-full aspect-video object-cover grayscale brightness-75 group-hover:brightness-100 transition-all duration-1000" alt="Capa Gerada" />
                    <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md border border-zinc-800 px-4 py-2 text-[10px] text-gold-500 font-bold tracking-widest uppercase">IMAGEM CONCEITUAL AI</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
