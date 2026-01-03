
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card, SectionTitle } from '../components/UI';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, Info, ArrowUpCircle } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const checkKey = async () => {
    const selected = await window.aistudio.hasSelectedApiKey();
    if (selected) {
      setHasKey(true);
    } else {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generatePost = async () => {
    setLoadingText(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um editorial de blog para um fotógrafo retratista de luxo chamado Mac Frois. O tema é: ${topic}. 
        Use um tom sofisticado, estratégico e focado em autoridade visual e branding pessoal. 
        O texto deve ser impactante, curto (aprox 200 palavras). 
        Não use títulos internos, apenas o corpo do texto com parágrafos bem definidos.`,
        config: { temperature: 0.8 }
      });
      setGeneratedText(response.text || '');
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar texto.");
    }
    setLoadingText(false);
  };

  const generateImage = async () => {
    setLoadingImg(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `High-end professional luxury portrait photography, black and white cinematic style, dramatic chiaroscuro lighting, deep shadows, authentic skin textures, professional equipment in background, 8k resolution, symbolizing ${topic}` }],
        },
        config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImg(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar imagem.");
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
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-sm">
            <Key className="mx-auto text-gold-600 mb-6" size={40} />
            <h3 className="text-white font-serif text-xl mb-4">Acesso às Ferramentas Pro</h3>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-xs uppercase tracking-widest leading-loose">
              Para gerar conteúdos e imagens de alta qualidade, selecione sua chave da API Google Cloud.
            </p>
            <Button onClick={checkKey}>Ativar Laboratório</Button>
          </div>
        ) : (
          <div className="space-y-12">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-600 mb-4 block">Sobre o que vamos escrever hoje?</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: A importância do olhar no retrato executivo"
                  className="flex-grow bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm"
                />
                <Button onClick={() => { generatePost(); generateImage(); }} disabled={loadingText || loadingImg || !topic} className="flex items-center gap-2">
                   {loadingText ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                   GERAR TUDO
                </Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Resultado Texto */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-white">Editorial Sugerido</h4>
                  {generatedText && (
                    <button onClick={copyToClipboard} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase">
                      {copyStatus ? <Check size={14}/> : <Copy size={14}/>} {copyStatus ? 'COPIADO' : 'COPIAR TEXTO'}
                    </button>
                  )}
                </div>
                <div className="bg-black border border-zinc-900 p-8 min-h-[400px] text-sm leading-loose text-zinc-400 font-light whitespace-pre-wrap rounded-sm italic">
                  {generatedText || "O texto aparecerá aqui..."}
                </div>
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <Info size={12} /> Salve este texto em um arquivo .txt no seu Drive.
                </p>
              </div>

              {/* Resultado Imagem */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-white">Capa Sugerida</h4>
                  {generatedImg && (
                    <a href={generatedImg} download={`blog_capa_ia.png`} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase">
                      <Download size={14} /> BAIXAR IMAGEM
                    </a>
                  )}
                </div>
                <div className="bg-black border border-zinc-900 aspect-video rounded-sm overflow-hidden flex items-center justify-center relative">
                  {generatedImg ? (
                    <img src={generatedImg} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8">
                      <ImageIcon className="mx-auto text-zinc-800 mb-4" size={32} />
                      <p className="text-zinc-800 text-[10px] uppercase tracking-widest">Aguardando geração...</p>
                    </div>
                  )}
                </div>
                
                {generatedImg && (
                  <div className="bg-gold-600/10 border border-gold-600/30 p-6 rounded-sm">
                    <h5 className="text-gold-500 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                      <ArrowUpCircle size={14} /> Próximos Passos:
                    </h5>
                    <ol className="text-[10px] text-zinc-400 space-y-3 tracking-widest uppercase leading-relaxed">
                      <li>1. Baixe a imagem acima no seu computador.</li>
                      <li>2. Dê a ela o MESMO NOME do seu arquivo de texto do blog.</li>
                      <li>3. Suba AMBOS para a sua pasta no Google Drive.</li>
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
