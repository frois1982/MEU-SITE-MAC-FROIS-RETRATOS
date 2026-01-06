
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

  // Script do Drive - Use este código no seu Google Apps Script
  const scriptCode = `function doPost(e) {
  var folderId = "1CsNAC51-bP11LKz9YtjwenbwmAgda9IE";
  var folder = DriveApp.getFolderById(folderId);
  var data = JSON.parse(e.postData.contents);
  
  try {
    // 1. Criar Editorial (.txt)
    var textFileName = data.fileName + ".txt";
    folder.createFile(textFileName, data.content);
    
    // 2. Criar Capa (.png)
    if (data.image) {
      var contentType = data.image.split(",")[0].split(":")[1].split(";")[0];
      var bytes = Utilities.base64Decode(data.image.split(",")[1]);
      var blob = Utilities.newBlob(bytes, contentType, "CAPA_" + data.fileName + ".png");
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

  const publishToBlog = async () => {
    if (!generatedText || !DRIVE_SCRIPT_URL) return;
    setLoadingPublish(true);
    setPublishStatus('idle');
    try {
      // DNA único do Post para garantir sincronia perfeita
      const syncID = "ID" + Math.random().toString(36).substring(2, 9).toUpperCase();
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
      const cleanTopic = topic
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 25);
      
      const fileName = `BLOG_${dateStr}_${syncID}_${cleanTopic}`;

      const payload = {
        fileName: fileName,
        content: generatedText,
        image: generatedImg || null
      };

      // Usando mode: 'no-cors' caso o Google não responda com os headers corretos
      await fetch(DRIVE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      // Como o no-cors não permite ler a resposta, assumimos sucesso se não houver erro de rede
      setPublishStatus('success');
      setTopic('');
      setGeneratedText('');
      setGeneratedImg('');
      setTimeout(() => setPublishStatus('idle'), 6000);
    } catch (e) {
      console.error(e);
      setPublishStatus('error');
    }
    setLoadingPublish(false);
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
           <div className="text-center md:text-left">
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editoria Mac Frois</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest">Laboratório Criativo</h1>
           </div>
           
           <div className="flex items-center gap-4">
             <button onClick={() => setShowHelp(!showHelp)} className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all px-6 py-2.5 border rounded-full font-bold ${showHelp ? 'bg-gold-600 text-black border-gold-600' : 'text-zinc-500 border-zinc-800 hover:text-white'}`}>
               <Code2 size={14} /> {showHelp ? 'Ocultar Guia' : 'Configurar Sincronia'}
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
             <p className="text-zinc-500 text-[10px] tracking-widest uppercase mb-6 leading-relaxed">
               Certifique-se de que no Google Scripts você selecionou <br/>
               <strong className="text-gold-500">"Quem pode acessar: Qualquer Pessoa"</strong> ao implantar.
             </p>
             <div className="relative">
                <pre className="bg-black/60 p-6 rounded-sm text-[9px] h-32 overflow-y-auto border border-zinc-800 font-mono text-zinc-600">
                  {scriptCode}
                </pre>
             </div>
          </div>
        )}

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
                    GERAR TEXTO PURO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-6 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-600 tracking-[0.4em]">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    GERAR CAPA VISUAL
                  </Button>
                </div>
              </div>
            </Card>

            {generatedText && (
               <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-sm space-y-6 shadow-2xl animate-slide-up backdrop-blur-xl border-l-2 border-gold-600">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                      <Rocket size={16} className="text-gold-500" /> Publicação Direta
                    </h4>
                    {publishStatus === 'success' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
                  </div>
                  
                  <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] leading-loose">
                    Manifeste seu editorial. O sistema sincronizará o texto e a imagem simultaneamente no Drive.
                  </p>

                  <Button 
                    onClick={publishToBlog} 
                    disabled={loadingPublish || !generatedText}
                    className={`w-full py-6 flex items-center justify-center gap-4 border-none transition-all duration-1000 font-bold tracking-[0.4em] shadow-2xl ${publishStatus === 'success' ? '!bg-green-600 text-white' : '!bg-white text-black hover:!bg-gold-500'}`}
                  >
                    {loadingPublish ? <Loader2 size={20} className="animate-spin" /> : publishStatus === 'success' ? <CheckCircle size={20} /> : <CloudUpload size={20} />}
                    {publishStatus === 'success' ? 'EDITORIAL PUBLICADO' : 'PUBLICAR NO DRIVE AGORA'}
                  </Button>
                  
                  {publishStatus === 'error' && (
                    <p className="text-red-500 text-[9px] uppercase tracking-widest text-center animate-pulse">
                      Erro na conexão. Verifique o Google Script.
                    </p>
                  )}
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <span className="text-zinc-500 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center gap-3 ml-4">
                 <FileText size={14} className="text-gold-500" /> Manuscrito Editorial
              </span>
              <div className="bg-zinc-900 border border-zinc-800 p-0 min-h-[500px] relative overflow-hidden rounded-sm shadow-2xl">
                 {loadingText && (
                    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[11px] tracking-[1em] uppercase font-bold">Processando...</p>
                    </div>
                 )}
                 <textarea
                   value={generatedText}
                   onChange={(e) => setGeneratedText(e.target.value)}
                   className="w-full h-full min-h-[500px] bg-transparent p-16 text-zinc-300 text-lg leading-relaxed font-light italic outline-none font-serif resize-none border-none"
                   placeholder="O editorial aparecerá aqui..."
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
                    <img src={generatedImg} alt="Capa" className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0" />
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
