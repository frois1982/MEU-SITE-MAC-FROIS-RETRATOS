
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Check, Loader2, Terminal, Trash2, Layout, Info } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [copied, setCopied] = useState(false);

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
        contents: `Aja como o Diretor Criativo da Vogue. Escreva um manifesto intelectual e profundo sobre "${topic}" para o retratista Mac Frois.
        REGRAS DE OURO: 
        1. O TÍTULO deve ser curto, impactante e em caixa alta (máximo 4 palavras).
        2. O CONTEÚDO deve ser um texto corrido, denso, sem tópicos, focado em autoridade visual.
        3. Formate rigorosamente assim:
        TITULO: [Título]
        CONTEUDO: [Texto]`,
      });
      
      const fullText = response.text || '';
      const titleMatch = fullText.match(/TITULO:\s*(.*)/i);
      const contentMatch = fullText.match(/CONTEUDO:\s*([\s\S]*)/i);
      
      if (titleMatch) setTitle(titleMatch[1].trim().toUpperCase());
      if (contentMatch) setGeneratedText(contentMatch[1].trim());
      else setGeneratedText(fullText);
      
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
        contents: { parts: [{ text: `Black and white high-end fashion photography, 8k resolution, cinematic lighting, sharp focus on eyes, dramatic shadows, editorial style for Mac Frois, theme: ${topic}` }] },
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

  const resetStudio = () => {
    setTopic('');
    setTitle('');
    setGeneratedText('');
    setGeneratedImg('');
    setCopied(false);
  };

  const getFullPostObject = () => {
    const id = "POST-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    const date = new Date().toLocaleDateString('pt-BR');
    const postData = {
      id: id,
      date: date,
      title: title || topic.toUpperCase(),
      content: generatedText,
      imageUrl: generatedImg || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?grayscale=true"
    };
    return JSON.stringify(postData, null, 2) + ",";
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
                <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase">Estúdio Editorial</h2>
             </div>
             <h1 className="text-5xl font-serif text-white italic tracking-tighter uppercase">Creative Lab</h1>
           </div>
           <div className="flex gap-4">
             <Button onClick={resetStudio} variant="secondary" className="px-6 border-zinc-800">
               <Trash2 size={18} className="mr-2" /> REINICIAR
             </Button>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/60 border-zinc-800 p-8 shadow-2xl sticky top-32">
              <label className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">1. Tema do Manifesto</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: A Geometria da Verdade na Luz..."
                className="w-full bg-black border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-32 mb-8"
              />
              
              <div className="space-y-4">
                <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-5 !bg-gold-600 text-black border-none font-bold tracking-[0.3em] flex items-center justify-center gap-3">
                  {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} 
                  CRIAR TEXTO
                </Button>
                <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-5 border-zinc-800 hover:border-gold-500 tracking-[0.3em] flex items-center justify-center gap-3">
                  {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />} 
                  GERAR IMAGEM
                </Button>
              </div>

              {generatedText && (
                <div className="mt-12 pt-8 border-t border-zinc-800 space-y-6">
                  <div className="bg-gold-950/20 border border-gold-600/20 p-4 rounded-sm flex gap-3">
                     <Info size={16} className="text-gold-500 shrink-0" />
                     <p className="text-[9px] text-gold-400 uppercase tracking-widest leading-loose">
                       Texto e Imagem prontos. Clique abaixo e cole no <span className="text-white">config.ts</span>.
                     </p>
                  </div>
                  <Button onClick={copyToClipboard} className={`w-full py-6 flex flex-col items-center justify-center gap-1 border-none transition-all duration-500 ${copied ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gold-500 shadow-xl'}`}>
                    <div className="flex items-center gap-2">
                       {copied ? <Check size={20} /> : <Terminal size={20} />}
                       <span className="font-black tracking-[0.2em] text-[11px] uppercase">{copied ? "CÓDIGO COPIADO!" : "COPIAR CÓDIGO DO POST"}</span>
                    </div>
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-12">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 md:p-12 rounded-sm backdrop-blur-md">
                 <input 
                   value={title}
                   onChange={(e) => setTitle(e.target.value.toUpperCase())}
                   placeholder="TÍTULO DO MANIFESTO"
                   className="w-full bg-transparent border-b border-zinc-800 pb-4 mb-8 text-white font-serif text-3xl italic outline-none focus:border-gold-600"
                 />
                 <textarea 
                   value={generatedText} 
                   onChange={(e) => setGeneratedText(e.target.value)}
                   className="w-full bg-transparent text-zinc-300 text-xl leading-[2.2] font-light italic outline-none font-serif h-[500px] resize-none" 
                   placeholder="O texto editorial aparecerá aqui..." 
                 />
              </div>
              
              {generatedImg && (
                <div className="rounded-sm overflow-hidden border border-zinc-800 shadow-2xl relative aspect-video">
                  <img src={generatedImg} className="w-full h-full object-cover grayscale" alt="Capa" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
