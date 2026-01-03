
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, ImagePlus, ArrowRight, Save, Info, FileText, FolderOpen } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // NOVO PADRÃO: Sem extensão no nome para evitar erro de .txt.txt
  const getBaseFileName = () => {
    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const cleanTopic = topic
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .substring(0, 25)
      .toUpperCase();
    return `blog_${date}_EDITORIAL_${cleanTopic || 'POST'}`;
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (process.env.API_KEY) {
        setHasKey(true);
        return;
      }
      try {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          const selected = await window.aistudio.hasSelectedApiKey();
          if (selected) setHasKey(true);
        }
      } catch (e) {
        console.warn("Aguardando ativação de chave...");
      }
    };
    checkStatus();
  }, []);

  const handleKeyActivation = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
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
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um editorial de blog para Mac Frois, um fotógrafo retratista de luxo. 
        O tema é: "${topic}". 
        O texto deve ser sofisticado, focado em posicionamento e autoridade visual. 
        Tamanho: aprox. 200 palavras. Não use títulos, apenas parágrafos fluidos.`,
        config: { temperature: 0.8 }
      });
      setGeneratedText(response.text || '');
    } catch (e) {
      console.error(e);
      alert("Houve um erro técnico. Verifique o faturamento Pro.");
    }
    setLoadingText(false);
  };

  const generateCover = async () => {
    if (!topic) return;
    setLoadingImg(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `High-end professional luxury portrait photography, black and white cinematic style, dramatic lighting, sharp focus, 8k resolution, representing the theme: ${topic}. Only photography, no text.` }],
        },
        config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } },
      });
      
      let foundImg = false;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImg(`data:image/png;base64,${part.inlineData.data}`);
            foundImg = true;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingImg(false);
  };

  const baseName = getBaseFileName();

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
           <div>
             <h2 className="text-gold-500 text-xs font-bold tracking-[0.5em] uppercase mb-2">Ambiente de Criação</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest">Laboratório Criativo</h1>
           </div>
           {!hasKey ? (
             <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-3 flex items-center gap-3 font-bold">
               <Key size={18} /> ATIVAR FERRAMENTAS PRO
             </Button>
           ) : (
             <div className="flex items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-widest border border-zinc-800 px-4 py-2 rounded-full">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               Estúdio Conectado
             </div>
           )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-zinc-800 pb-4">
                <PenTool size={18} className="text-gold-500" /> 
                Configuração do Post
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Tema do Editorial</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Por que o preto e branco revela a alma..."
                    rows={4}
                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-wide transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-4 flex items-center justify-center gap-3 group">
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    GERAR TEXTO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-4 flex items-center justify-center gap-3">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                    GERAR IMAGEM
                  </Button>
                </div>
              </div>
            </Card>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-sm space-y-4">
               <h4 className="text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                 <FolderOpen size={14} className="text-gold-500" /> Organização do Drive
               </h4>
               <p className="text-zinc-500 text-[10px] uppercase leading-relaxed tracking-widest">
                 DICA: Você pode criar uma pasta chamada <strong className="text-zinc-300">BLOG</strong> dentro da pasta do site para não bagunçar a raiz. O sistema vai encontrar os arquivos lá.
               </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {/* Bloco de Instruções de Salvamento Ultra-Claras */}
            {(generatedText || generatedImg) && (
              <div className="bg-gold-600/10 border border-gold-600/30 p-8 rounded-sm animate-fade-in shadow-2xl">
                <h4 className="text-gold-500 text-[11px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                  <Save size={18} /> Protocolo de Salvamento:
                </h4>
                
                <div className="space-y-6">
                  {/* Arquivo de Texto */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-black/40 border border-zinc-800 rounded-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-zinc-500"><FileText size={20}/></div>
                      <div>
                        <p className="text-white text-[10px] font-bold tracking-widest uppercase mb-1">1. Salvar Texto como:</p>
                        <code className="text-gold-500 text-xs font-mono">{baseName}</code>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(baseName);
                        alert('Nome copiado! Cole no nome do arquivo ao salvar no Bloco de Notas.');
                      }}
                      className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-2 uppercase tracking-widest"
                    >
                      <Copy size={14}/> Copiar Nome
                    </button>
                  </div>

                  {/* Arquivo de Imagem */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-black/40 border border-zinc-800 rounded-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-zinc-500"><ImageIcon size={20}/></div>
                      <div>
                        <p className="text-white text-[10px] font-bold tracking-widest uppercase mb-1">2. Salvar Imagem como:</p>
                        <code className="text-gold-500 text-xs font-mono">CAPA_{baseName}</code>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`CAPA_${baseName}`);
                        alert('Nome da Capa copiado!');
                      }}
                      className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-2 uppercase tracking-widest"
                    >
                      <Copy size={14}/> Copiar Nome
                    </button>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gold-600/5 border border-gold-600/20 rounded-sm">
                  <p className="text-zinc-400 text-[9px] uppercase tracking-[0.2em] leading-loose">
                    <strong className="text-gold-500">ATENÇÃO:</strong> Ao salvar no Bloco de Notas, não digite ".txt". Apenas cole o nome. Isso evita que o arquivo fique com nome duplo.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                   <ArrowRight size={14} className="text-gold-500" /> Editorial Gerado
                </span>
                {generatedText && (
                  <button onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                    setCopyStatus(true);
                    setTimeout(() => setCopyStatus(false), 2000);
                  }} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase">
                    {copyStatus ? <Check size={14} /> : <Copy size={14} />} {copyStatus ? 'Copiado' : 'Copiar Texto'}
                  </button>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-10 min-h-[250px] relative overflow-hidden rounded-sm">
                 {loadingText && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 text-center">
                       <Loader2 size={40} className="text-gold-500 animate-spin mx-auto mb-4" />
                       <p className="text-gold-500 text-[10px] tracking-[0.4em] uppercase font-bold">Redigindo...</p>
                    </div>
                 )}
                 <div className="text-zinc-400 text-lg leading-loose font-light italic whitespace-pre-wrap font-serif">
                   {generatedText || "O rascunho do editorial aparecerá aqui..."}
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                   <ArrowRight size={14} className="text-gold-500" /> Capa sugerida (16:9)
                </span>
                {generatedImg && (
                  <a href={generatedImg} download={`CAPA_${baseName}.png`} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase">
                    <Download size={14} /> Baixar Capa
                  </a>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 aspect-video relative overflow-hidden rounded-sm flex items-center justify-center group shadow-2xl">
                 {loadingImg && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-10 text-center">
                       <Loader2 size={40} className="text-gold-500 animate-spin mx-auto mb-4" />
                       <p className="text-gold-500 text-[10px] tracking-[0.4em] uppercase font-bold">Processando Luz...</p>
                    </div>
                 )}
                 {generatedImg ? (
                   <img src={generatedImg} alt="Capa" className="w-full h-full object-cover animate-fade-in" />
                 ) : (
                   <div className="text-center opacity-20">
                      <ImageIcon size={64} className="text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-700 text-xs tracking-[0.5em] uppercase font-bold">Aguardando geração visual</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
