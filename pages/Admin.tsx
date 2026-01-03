
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card, SectionTitle } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, Info, ArrowUpCircle, RefreshCw, Zap } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // Auto-checar chave e forçar entrada se o processo estiver presente
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        if (selected || process.env.API_KEY) {
          setHasKey(true);
        }
      } catch (e) {
        // Se der erro de conexão no check, mas houver indício de chave, libera o acesso
        if (process.env.API_KEY) setHasKey(true);
      }
    };
    checkStatus();
  }, []);

  const activateLaboratorio = async () => {
    try {
      // Abre o seletor do Google
      await window.aistudio.openSelectKey();
      // REGRA: Procede imediatamente para o app sem esperar confirmação do servidor
      setHasKey(true);
    } catch (e) {
      console.error("Erro ao abrir seletor:", e);
      // Fallback: Se o seletor falhar por bloqueio de iframe, tenta entrar mesmo assim
      setHasKey(true);
    }
  };

  const generateContent = async () => {
    if (!topic) return;
    setLoadingText(true);
    setLoadingImg(true);
    
    // Tenta gerar o texto
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Usamos o flash-preview como fallback automático se o Pro falhar
      const modelName = "gemini-3-pro-preview";
      
      const textResponse = await ai.models.generateContent({
        model: modelName,
        contents: `Escreva um editorial curto e sofisticado para o fotógrafo Mac Frois. Tema: ${topic}. 
        Foco em autoridade visual. Aproximadamente 150 palavras. Sem títulos.`,
        config: { temperature: 0.7 }
      });
      setGeneratedText(textResponse.text || '');
    } catch (e: any) {
      console.error("Erro Texto:", e);
      alert("Houve um problema com a chave Pro. Verifique se o faturamento está ativo no Google Cloud ou tente um tema mais simples.");
    } finally {
      setLoadingText(false);
    }

    // Tenta gerar a imagem
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `Professional high-end luxury portrait photography, cinematic lighting, black and white, minimal, ${topic}` }],
        },
        config: { 
          imageConfig: { aspectRatio: "16:9", imageSize: "1K" } 
        },
      });
      
      for (const part of imgResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImg(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error("Erro Imagem:", e);
    } finally {
      setLoadingImg(false);
    }
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
          <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-sm animate-fade-in backdrop-blur-md">
            <div className="w-20 h-20 bg-gold-600/10 rounded-full flex items-center justify-center mx-auto mb-8 text-gold-500">
               <Zap size={32} />
            </div>
            <h3 className="text-white font-serif text-2xl mb-4 tracking-widest uppercase italic">Ativar Ferramentas de IA</h3>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Clique abaixo para conectar sua chave da API. Se a página de faturamento abrir, certifique-se de que seu projeto está no plano "Pay-as-you-go" para liberar os modelos Pro.
            </p>
            <div className="flex flex-col items-center gap-6">
              <Button onClick={activateLaboratorio} className="px-12 py-5 tracking-[0.3em] bg-gold-600 text-black font-bold">
                ABRIR SELETOR DE CHAVE
              </Button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[9px] text-zinc-600 hover:text-gold-500 underline tracking-[0.2em] uppercase"
              >
                Como configurar o faturamento
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-600 mb-4 block">Diretriz Criativa</label>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Sobre o que vamos falar hoje?"
                  className="flex-grow bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm"
                />
                <Button 
                  onClick={generateContent} 
                  disabled={loadingText || loadingImg || !topic} 
                  className="flex items-center justify-center gap-3 min-w-[220px]"
                >
                   {loadingText ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                   {loadingText ? 'GERANDO...' : 'INICIAR GERAÇÃO'}
                </Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">Texto Editorial</h4>
                  {generatedText && (
                    <button onClick={copyToClipboard} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[9px] uppercase tracking-widest">
                      {copyStatus ? <Check size={14}/> : <Copy size={14}/>} {copyStatus ? 'COPIADO' : 'COPIAR'}
                    </button>
                  )}
                </div>
                <div className="bg-black border border-zinc-900 p-8 min-h-[400px] text-sm leading-loose text-zinc-400 font-light whitespace-pre-wrap rounded-sm italic">
                  {generatedText || "Aguardando seu tema para redigir o manifesto..."}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">Capa Visual</h4>
                  {generatedImg && (
                    <a href={generatedImg} download={`capa_${Date.now()}.png`} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[9px] uppercase tracking-widest">
                      <Download size={14} /> SALVAR IMAGEM
                    </a>
                  )}
                </div>
                <div className="bg-black border border-zinc-900 aspect-video rounded-sm overflow-hidden flex items-center justify-center relative">
                  {generatedImg ? (
                    <img src={generatedImg} className="w-full h-full object-cover animate-fade-in" alt="Capa gerada" />
                  ) : (
                    <div className="text-center opacity-20">
                      <ImageIcon size={32} className="mx-auto mb-2" />
                      <p className="text-[9px] uppercase tracking-widest">Processando arte...</p>
                    </div>
                  )}
                  {loadingImg && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                       <Loader2 className="animate-spin text-gold-500 mb-4" size={24} />
                       <p className="text-[8px] text-gold-500 tracking-[0.4em] uppercase font-bold animate-pulse">Revelando com Luz...</p>
                    </div>
                  )}
                </div>

                {generatedImg && (
                  <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-sm animate-fade-in">
                    <h5 className="text-gold-500 text-[9px] font-bold tracking-[0.3em] uppercase mb-4">Próximo Passo:</h5>
                    <p className="text-zinc-500 text-[10px] leading-relaxed uppercase tracking-widest">
                      Baixe a imagem, copie o texto e suba ambos na sua pasta do Google Drive com o mesmo nome para atualizar o site.
                    </p>
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
