
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card, SectionTitle } from '../components/UI';
// Added Info to imports from lucide-react
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, FlaskConical, PenTool, ImagePlus, ArrowRight, Save, Info } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // Checagem segura de chave para evitar erro de "Connection Refused" no preview
  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (window.aistudio) {
          const selected = await window.aistudio.hasSelectedApiKey();
          if (selected) setHasKey(true);
        } else if (process.env.API_KEY) {
          setHasKey(true);
        }
      } catch (e) {
        console.warn("Ambiente de preview restringindo acesso à API do Google AI Studio.");
        // Se houver API_KEY injetada, assumimos que pode funcionar
        if (process.env.API_KEY) setHasKey(true);
      }
    };
    checkStatus();
  }, []);

  const handleKeyActivation = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      } else {
        alert("O seletor de chave só está disponível no ambiente de desenvolvimento do AI Studio.");
      }
    } catch (e) {
      console.error("Falha ao abrir seletor:", e);
    }
  };

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um editorial de blog para Mac Frois, um fotógrafo retratista de luxo. 
        O tema é: "${topic}". 
        O texto deve ser sofisticado, focado em posicionamento e autoridade visual. 
        Tamanho: aprox. 200 palavras. Não use títulos, apenas parágrafos fluidos.`,
        config: { temperature: 0.8 }
      });
      // Use .text property to extract output
      setGeneratedText(response.text || '');
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar editorial. Verifique sua chave e plano de faturamento.");
    }
    setLoadingText(false);
  };

  const generateCover = async () => {
    if (!topic) return;
    setLoadingImg(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `High-end professional luxury portrait photography, black and white cinematic style, dramatic lighting, sharp focus, 8k resolution, representing the theme: ${topic}. Only photography, no text.` }],
        },
        config: { 
          imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
        },
      });
      
      let foundImg = false;
      // Iterate through parts to find the image part as per guidelines
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImg(`data:image/png;base64,${part.inlineData.data}`);
          foundImg = true;
          break;
        }
      }
      if (!foundImg) alert("Não foi possível gerar a imagem. Tente outro tema.");
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar imagem. Verifique se o modelo gemini-3-pro-image-preview está disponível na sua chave.");
    }
    setLoadingImg(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
           <div>
             <h2 className="text-gold-500 text-xs font-bold tracking-[0.5em] uppercase mb-2">Ambiente de Criação</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest">Laboratório Criativo</h1>
           </div>
           {!hasKey ? (
             <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-3 flex items-center gap-3">
               <Key size={18} /> ATIVAR CHAVE PRO
             </Button>
           ) : (
             <div className="flex items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-widest border border-zinc-800 px-4 py-2 rounded-full">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               Estúdio Conectado
             </div>
           )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Coluna de Controle */}
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
                  <Button 
                    onClick={generateEditorial} 
                    disabled={loadingText || !topic || !hasKey}
                    className="w-full py-4 flex items-center justify-center gap-3 group"
                  >
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                    GERAR TEXTO
                  </Button>
                  <Button 
                    onClick={generateCover} 
                    disabled={loadingImg || !topic || !hasKey}
                    variant="outline"
                    className="w-full py-4 flex items-center justify-center gap-3"
                  >
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                    GERAR IMAGEM
                  </Button>
                </div>
              </div>
            </Card>

            <div className="bg-gold-600/5 border border-gold-600/20 p-6 rounded-sm">
              <h4 className="text-gold-500 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                <Info size={14} /> Dica do Estúdio:
              </h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed uppercase tracking-widest">
                Ao gerar a imagem, ela usará automaticamente o contexto do seu texto para criar uma composição visual harmônica e estratégica.
              </p>
            </div>
          </div>

          {/* Coluna de Resultados */}
          <div className="lg:col-span-8 space-y-8">
            {/* Texto Gerado */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                   <ArrowRight size={14} className="text-gold-500" /> Editorial Sugerido
                </span>
                {generatedText && (
                  <button onClick={copyToClipboard} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase">
                    {copyStatus ? <Check size={14} /> : <Copy size={14} />} {copyStatus ? 'Copiado' : 'Copiar Texto'}
                  </button>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-10 min-h-[300px] relative overflow-hidden rounded-sm">
                 {loadingText && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                       <div className="text-center">
                          <Loader2 size={40} className="text-gold-500 animate-spin mx-auto mb-4" />
                          <p className="text-gold-500 text-[10px] tracking-[0.4em] uppercase font-bold">Redigindo Editorial...</p>
                       </div>
                    </div>
                 )}
                 <div className="text-zinc-400 text-lg leading-loose font-light italic whitespace-pre-wrap font-serif">
                   {generatedText || "O rascunho do seu próximo editorial aparecerá aqui..."}
                 </div>
              </div>
            </div>

            {/* Imagem Gerada */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                   <ArrowRight size={14} className="text-gold-500" /> Capa sugerida (16:9)
                </span>
                {generatedImg && (
                  <a href={generatedImg} download={`capa_${Date.now()}.png`} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase">
                    <Download size={14} /> Baixar Imagem
                  </a>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 aspect-video relative overflow-hidden rounded-sm flex items-center justify-center group shadow-2xl">
                 {loadingImg && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-10">
                       <div className="text-center">
                          <Loader2 size={40} className="text-gold-500 animate-spin mx-auto mb-4" />
                          <p className="text-gold-500 text-[10px] tracking-[0.4em] uppercase font-bold">Revelando com Luz...</p>
                       </div>
                    </div>
                 )}
                 {generatedImg ? (
                   <img src={generatedImg} alt="Gerada por IA" className="w-full h-full object-cover animate-fade-in" />
                 ) : (
                   <div className="text-center opacity-20 group-hover:opacity-40 transition-opacity">
                      <ImageIcon size={64} className="text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-700 text-xs tracking-[0.5em] uppercase font-bold">Aguardando geração visual</p>
                   </div>
                 )}
              </div>
              
              {generatedImg && (
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-sm animate-fade-in">
                  <h5 className="text-white text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                    <Save size={16} className="text-gold-500" /> Instruções de Publicação:
                  </h5>
                  <div className="grid md:grid-cols-2 gap-8 text-[10px] text-zinc-500 tracking-[0.2em] uppercase leading-relaxed">
                    <div className="space-y-2">
                      <p className="text-gold-600 font-bold">1. IMAGEM</p>
                      <p>Baixe a imagem acima. Ela já está no formato 16:9 ideal para o layout do blog.</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gold-600 font-bold">2. TEXTO</p>
                      <p>Copie o editorial e salve em um arquivo .txt seguindo o padrão (ex: blog_data_titulo.txt).</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
