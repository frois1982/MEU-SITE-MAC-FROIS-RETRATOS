
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card, SectionTitle } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, Info, ArrowUpCircle, RefreshCw } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // Auto-checar chave ao entrar na página
  useEffect(() => {
    const autoCheck = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        if (selected) {
          setHasKey(true);
        }
      } catch (e) {
        console.error("Erro na detecção automática:", e);
      }
    };
    autoCheck();
  }, []);

  const checkKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume sucesso após abrir o diálogo conforme as regras da plataforma
      setHasKey(true);
    } catch (e) {
      console.error("Erro ao abrir seletor de chave:", e);
    }
  };

  const generatePost = async () => {
    if (!topic) return;
    setLoadingText(true);
    
    try {
      // Criar instância nova no momento do clique para garantir a chave atualizada
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um editorial de blog para um fotógrafo retratista de luxo chamado Mac Frois. O tema é: ${topic}. 
        Use um tom sofisticado, estratégico e focado em autoridade visual e branding pessoal. 
        O texto deve ser impactante, curto (aprox 200 palavras). 
        Não use títulos internos, apenas o corpo do texto com parágrafos bem definidos.`,
        config: { temperature: 0.8 }
      });
      setGeneratedText(response.text || '');
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("not found")) {
        alert("Chave de API expirada ou inválida. Por favor, selecione-a novamente.");
        setHasKey(false);
      } else {
        alert("Erro ao gerar editorial. Tente novamente.");
      }
    }
    setLoadingText(false);
  };

  const generateImage = async () => {
    if (!topic) return;
    setLoadingImg(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `High-end professional luxury portrait photography, black and white cinematic style, dramatic chiaroscuro lighting, deep shadows, authentic skin textures, professional equipment in background, 8k resolution, symbolizing ${topic}` }],
        },
        config: { 
          imageConfig: { 
            aspectRatio: "16:9", 
            imageSize: "1K" 
          } 
        },
      });
      
      let foundImg = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImg(`data:image/png;base64,${part.inlineData.data}`);
          foundImg = true;
          break;
        }
      }
      
      if (!foundImg) alert("A IA não gerou uma imagem válida para este tema.");
      
    } catch (e: any) {
      console.error(e);
      if (!e.message?.includes("not found")) {
        alert("Erro ao gerar imagem de capa.");
      }
    }
    setLoadingImg(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen text-zinc-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionTitle title="Laboratório Criativo" subtitle="Mac Frois Editorial" />
        
        {!hasKey ? (
          <div className="text-center py-24 bg-zinc-900/50 border border-zinc-800 rounded-sm animate-fade-in">
            <Key className="mx-auto text-gold-600 mb-8" size={48} />
            <h3 className="text-white font-serif text-2xl mb-4 tracking-widest uppercase italic">Acesso às Ferramentas Pro</h3>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-[10px] uppercase tracking-[0.2em] leading-loose">
              Para gerar conteúdos e imagens de alta qualidade, selecione sua chave da API Google Cloud vinculada ao seu faturamento.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button onClick={checkKey} className="px-12 py-5 tracking-[0.3em]">ATIVAR LABORATÓRIO</Button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[9px] text-zinc-600 hover:text-gold-500 underline tracking-widest uppercase"
              >
                Documentação de Faturamento
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            <Card className="bg-zinc-900/50 border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <button onClick={() => setHasKey(false)} className="text-zinc-800 hover:text-gold-600 transition-colors">
                  <Key size={14} />
                </button>
              </div>
              <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-600 mb-4 block">Sobre o que vamos escrever hoje?</label>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: O valor da verdade no retrato corporativo"
                  className="flex-grow bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-wide"
                />
                <Button 
                  onClick={() => { generatePost(); generateImage(); }} 
                  disabled={loadingText || loadingImg || !topic} 
                  className="flex items-center justify-center gap-3 min-w-[200px]"
                >
                   {loadingText || loadingImg ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                   {loadingText || loadingImg ? 'PROCESSANDO...' : 'GERAR TUDO'}
                </Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Resultado Texto */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">Editorial Sugerido</h4>
                  {generatedText && (
                    <button onClick={copyToClipboard} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase">
                      {copyStatus ? <Check size={14}/> : <Copy size={14}/>} {copyStatus ? 'COPIADO' : 'COPIAR TEXTO'}
                    </button>
                  )}
                </div>
                <div className="bg-black border border-zinc-900 p-8 min-h-[450px] text-sm leading-loose text-zinc-400 font-light whitespace-pre-wrap rounded-sm italic shadow-inner">
                  {generatedText || (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-800 opacity-30">
                      <RefreshCw size={32} className="mb-4" />
                      <p className="text-[10px] uppercase tracking-widest">Aguardando definição do tema...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resultado Imagem */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">Capa Sugerida (16:9)</h4>
                  {generatedImg && (
                    <a href={generatedImg} download={`blog_capa_ia.png`} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase">
                      <Download size={14} /> BAIXAR IMAGEM
                    </a>
                  )}
                </div>
                <div className="bg-black border border-zinc-900 aspect-video rounded-sm overflow-hidden flex items-center justify-center relative shadow-2xl">
                  {generatedImg ? (
                    <img src={generatedImg} className="w-full h-full object-cover animate-fade-in" alt="Geração IA" />
                  ) : (
                    <div className="text-center p-8 opacity-30">
                      <ImageIcon className="mx-auto text-zinc-800 mb-4" size={32} />
                      <p className="text-zinc-800 text-[10px] uppercase tracking-widest">Aguardando geração...</p>
                    </div>
                  )}
                  {loadingImg && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                       <Loader2 className="animate-spin text-gold-500 mb-4" size={32} />
                       <p className="text-[9px] text-gold-500 tracking-[0.3em] uppercase font-bold">Pintando com Luz Artificial...</p>
                    </div>
                  )}
                </div>
                
                {generatedImg && (
                  <div className="bg-gold-600/5 border border-gold-600/20 p-8 rounded-sm animate-fade-in">
                    <h5 className="text-gold-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                      <ArrowUpCircle size={16} /> Checklist de Publicação:
                    </h5>
                    <ol className="text-[9px] text-zinc-500 space-y-4 tracking-[0.2em] uppercase leading-relaxed">
                      <li className="flex gap-3"><span className="text-gold-600 font-bold">1.</span> <span>Baixe a imagem acima clicando em "BAIXAR IMAGEM".</span></li>
                      <li className="flex gap-3"><span className="text-gold-600 font-bold">2.</span> <span>Crie um arquivo .txt no Bloco de Notas com o texto gerado.</span></li>
                      <li className="flex gap-3"><span className="text-gold-600 font-bold">3.</span> <span>Nomeie ambos identicamente (Ex: <span className="text-zinc-300 italic">blog_01-01_IA</span>).</span></li>
                      <li className="flex gap-3"><span className="text-gold-600 font-bold">4.</span> <span>Suba para a sua pasta do Google Drive.</span></li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
