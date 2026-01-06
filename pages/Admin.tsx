
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
  const [showHelp, setShowHelp] = useState(false);

  // Script atualizado para garantir a recepção correta
  const scriptCode = `function doPost(e) {
  var folderId = "1CsNAC51-bP11LKz9YtjwenbwmAgda9IE";
  var folder = DriveApp.getFolderById(folderId);
  var data = JSON.parse(e.postData.contents);
  
  try {
    // 1. Criar arquivo de Texto
    var textFileName = data.fileName + ".txt";
    folder.createFile(textFileName, data.content);
    
    // 2. Criar arquivo de Imagem
    if (data.image) {
      var contentType = data.image.split(",")[0].split(":")[1].split(";")[0];
      var bytes = Utilities.base64Decode(data.image.split(",")[1]);
      var blob = Utilities.newBlob(bytes, contentType, "capa_" + data.fileName + ".png");
      folder.createFile(blob);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}`;

  const getBaseFileName = () => {
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const time = now.getHours() + "h" + now.getMinutes();
    const cleanTopic = topic
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .substring(0, 15)
      .toUpperCase();
    return `blog_${date}_${time}_${cleanTopic || 'POST'}`;
  };

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
    setPublishStatus('idle');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um editorial de luxo para o retratista Mac Frois sobre: "${topic}".
        
        REGRAS DE FORMATAÇÃO:
        - NUNCA use hashtags (#), negritos (**) ou listas (-).
        - Retorne APENAS o texto puro em parágrafos elegantes.
        - Comece com uma reflexão sobre a verdade da imagem.
        - Use um tom poético, mas profissional.`,
        config: { temperature: 0.7, thinkingConfig: { thinkingBudget: 1500 } }
      });
      // Limpeza manual adicional para garantir texto puro
      const cleanText = (response.text || '').replace(/[#*`]/g, '');
      setGeneratedText(cleanText.trim());
    } catch (e) { console.error(e); }
    setLoadingText(false);
  };

  const generateCover = async () => {
    if (!topic) return;
    setLoadingImg(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `Masterpiece black and white portrait, editorial style, cinematic light, minimalist mood: ${topic}` }] },
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

  const publishToBlog = async () => {
    if (!generatedText || !DRIVE_SCRIPT_URL) return;
    setLoadingPublish(true);
    setPublishStatus('idle');
    try {
      const payload = {
        fileName: getBaseFileName(),
        content: generatedText,
        image: generatedImg || null
      };

      // Usando mode: 'no-cors' para garantir que o envio ocorra sem bloqueios do navegador
      await fetch(DRIVE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      setPublishStatus('success');
      setTimeout(() => setPublishStatus('idle'), 5000);
    } catch (e) {
      console.error("Erro na publicação:", e);
      setPublishStatus('error');
    }
    setLoadingPublish(false);
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${getBaseFileName()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const baseName = getBaseFileName();

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
           <div className="text-center md:text-left">
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editorial de Autoridade</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest">Laboratório Criativo</h1>
           </div>
           
           <div className="flex items-center gap-4">
             <button onClick={() => setShowHelp(!showHelp)} className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all px-6 py-2.5 border rounded-full font-bold ${showHelp ? 'bg-gold-600 text-black border-gold-600' : 'text-zinc-500 border-zinc-800 hover:text-white'}`}>
               <Code2 size={14} /> {showHelp ? 'Fechar Guia' : 'Configurar Sincronia'}
             </button>
             {!hasKey && (
               <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-2.5 flex items-center gap-3 font-bold border-none shadow-xl">
                 <Key size={16} /> ATIVAR IA
               </Button>
             )}
           </div>
        </div>

        {showHelp && (
          <div className="mb-12 bg-zinc-900/80 border border-gold-600/30 p-10 rounded-sm animate-fade-in backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-8">
                <CloudUpload className="text-gold-500" size={24} />
                <h4 className="text-white text-xs font-bold tracking-[0.4em] uppercase">Sincronia Editorial Ativa</h4>
             </div>
             <p className="text-zinc-500 text-[10px] tracking-widest uppercase mb-6">Seus arquivos serão criados com o prefixo <strong className="text-white">blog_</strong> e a capa com <strong className="text-white">capa_</strong>. Nada será deletado.</p>
             <div className="relative">
                <pre className="bg-black/60 p-6 rounded-sm text-[9px] h-32 overflow-y-auto border border-zinc-800 font-mono text-zinc-600">
                  {scriptCode}
                </pre>
             </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
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
                    placeholder="Sobre o que vamos escrever hoje?"
                    rows={4}
                    className="w-full bg-black/60 border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest transition-all placeholder:text-zinc-800"
                  />
                </div>
                
                <div className="space-y-4">
                  <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-6 flex items-center justify-center gap-4 group !bg-gold-600/80 hover:!bg-gold-600 border-none shadow-lg tracking-[0.4em]">
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    GERAR TEXTO LIMPO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-6 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-600 tracking-[0.4em]">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    GERAR CAPA VISUAL
                  </Button>
                </div>
              </div>
            </Card>

            {generatedText && (
               <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-sm space-y-6 shadow-2xl animate-slide-up backdrop-blur-xl border-l-2 border-l-gold-600">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                      <Rocket size={16} className="text-gold-500" /> Central de Publicação
                    </h4>
                  </div>
                  
                  <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] leading-loose">
                    Manifeste este editorial e sua capa agora. O processo é sincronizado para garantir que ambos cheguem juntos.
                  </p>
                  
                  <Button 
                    onClick={publishToBlog} 
                    disabled={loadingPublish || !generatedText}
                    className={`w-full py-6 flex items-center justify-center gap-4 border-none transition-all duration-700 font-bold tracking-[0.4em] shadow-2xl ${publishStatus === 'success' ? '!bg-green-600 text-white' : '!bg-white text-black hover:!bg-gold-500'}`}
                  >
                    {loadingPublish ? <Loader2 size={20} className="animate-spin" /> : publishStatus === 'success' ? <CheckCircle size={20} /> : <CloudUpload size={20} />}
                    {publishStatus === 'success' ? 'PUBLICADO COM SUCESSO' : 'PUBLICAR EDITORIAL AGORA'}
                  </Button>

                  {publishStatus === 'error' && (
                    <p className="text-red-500 text-[8px] tracking-[0.2em] uppercase text-center font-bold">Erro na conexão. Verifique o Script ou use os botões de backup.</p>
                  )}
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-zinc-500 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center gap-3">
                   <FileText size={14} className="text-gold-500" /> Manuscrito Final
                </span>
                <div className="flex gap-6">
                  {generatedText && (
                    <button onClick={downloadText} className="text-gold-500 hover:text-white transition-colors flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase font-bold">
                      <FileDown size={14} /> Backup Texto
                    </button>
                  )}
                  {generatedText && (
                    <button onClick={() => {
                      navigator.clipboard.writeText(generatedText);
                      setCopyStatus(true);
                      setTimeout(() => setCopyStatus(false), 2000);
                    }} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase font-bold">
                      {copyStatus ? <Check size={14} /> : <Copy size={14} />} {copyStatus ? 'Copiado' : 'Copiar'}
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-0 min-h-[500px] relative overflow-hidden rounded-sm group shadow-2xl">
                 {loadingText && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[11px] tracking-[1em] uppercase font-bold animate-pulse">Tecendo Editorial...</p>
                    </div>
                 )}
                 <textarea
                   value={generatedText}
                   onChange={(e) => setGeneratedText(e.target.value)}
                   className="w-full h-full min-h-[500px] bg-transparent p-16 text-zinc-300 text-lg leading-relaxed font-light italic outline-none font-serif resize-none border-none focus:ring-0"
                   placeholder="O editorial será manifestado aqui..."
                 />
                 <div className="absolute bottom-8 right-10 text-[10px] text-zinc-800 tracking-[0.5em] uppercase font-bold">
                    © Mac Frois Lab
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-zinc-500 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center gap-3">
                   <ImageIcon size={14} className="text-gold-500" /> Visão Editorial
                </span>
                {generatedImg && (
                  <a href={generatedImg} download={`CAPA_${baseName}.png`} className="text-gold-500 hover:text-white transition-colors flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase font-bold">
                    <Download size={14} /> Backup Imagem
                  </a>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 aspect-video relative overflow-hidden rounded-sm flex items-center justify-center shadow-2xl group">
                 {loadingImg && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[11px] tracking-[1em] uppercase font-bold animate-pulse">Revelando Imagem...</p>
                    </div>
                 )}
                 {generatedImg ? (
                    <img src={generatedImg} alt="Capa" className="w-full h-full object-cover animate-fade-in grayscale transition-all duration-1000 group-hover:grayscale-0" />
                 ) : (
                   <div className="text-center opacity-10">
                      <ImageIcon size={64} className="text-zinc-700 mx-auto mb-6" />
                      <p className="text-zinc-700 text-[11px] tracking-[0.8em] uppercase font-bold">Aguardando Conceito</p>
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
