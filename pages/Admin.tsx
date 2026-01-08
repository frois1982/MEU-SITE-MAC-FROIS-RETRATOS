
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, FileText, Save, FileDown, Code2, CloudUpload } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [syncID, setSyncID] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // NOVO SCRIPT PARA O GOOGLE APPS SCRIPT (COPIE ESTE!)
  const scriptCode = `function doGet() {
  var folderId = "1CsNAC51-bP11LKz9YtjwenbwmAgda9IE";
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var result = [];
  
  while (files.hasNext()) {
    var file = files.next();
    var name = file.getName();
    var content = "";
    
    // Se for texto, o script já lê o conteúdo para o site
    if (name.toLowerCase().endsWith(".txt")) {
      content = file.getBlob().getDataAsString();
    }
    
    result.push({
      id: file.getId(),
      name: name,
      url: "https://docs.google.com/uc?id=" + file.getId() + "&export=download",
      content: content
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
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

  const getCleanTopic = () => {
    return topic
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 10);
  };

  const generateEditorial = async () => {
    if (!topic) return;
    setLoadingText(true);
    const newID = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSyncID(newID);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Escreva um manifesto editorial de luxo para o retratista Mac Frois sobre: "${topic}". 
        REGRAS: Texto visceral, sem negritos, sem hashtags, apenas parágrafos puros e elegantes.`,
        config: { temperature: 0.8 }
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
        contents: { parts: [{ text: `High-end black and white portrait, cinematic, minimalist, theme: ${topic}` }] },
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

  const downloadTXT = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `POST_${syncID}_${getCleanTopic()}_TEXTO.txt`;
    link.click();
  };

  const downloadJPG = () => {
    fetch(generatedImg)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `POST_${syncID}_${getCleanTopic()}_FOTO.jpg`;
        link.click();
      });
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 border-b border-zinc-900 pb-12">
           <div>
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editoria Mac Frois</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest uppercase">Creative Lab</h1>
           </div>
           <div className="flex gap-4">
             <button onClick={() => setShowHelp(!showHelp)} className="text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest border border-zinc-800 px-4 py-2 rounded-sm transition-all">
                <Code2 size={14} /> {showHelp ? 'Fechar Guia' : 'Configurar Script'}
             </button>
             {!hasKey && (
               <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-3 font-bold border-none shadow-xl">
                 <Key size={16} className="mr-3" /> ATIVAR IA
               </Button>
             )}
           </div>
        </div>

        {showHelp && (
          <div className="mb-12 bg-zinc-900/80 border border-gold-600/20 p-8 rounded-sm animate-fade-in backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-4">
                <CloudUpload className="text-gold-500" size={20} />
                <h4 className="text-white text-xs font-bold tracking-[0.4em] uppercase">Instruções de Sincronia</h4>
             </div>
             <p className="text-zinc-500 text-[10px] tracking-widest uppercase mb-6 leading-relaxed">
               Para que o blog funcione sem erros de "Conteúdo não processado", você precisa atualizar o seu script no Google com este novo código:
             </p>
             <pre className="bg-black/60 p-6 rounded-sm text-[9px] h-48 overflow-y-auto border border-zinc-800 font-mono text-zinc-400">
               {scriptCode}
             </pre>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8 shadow-2xl">
              <h3 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-10 flex items-center gap-3">
                <PenTool size={16} className="text-gold-500" /> Composição Editorial
              </h3>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Conceito central..."
                className="w-full bg-black border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest h-40 mb-8"
              />
              <div className="space-y-4">
                <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-5 flex items-center justify-center gap-4 !bg-gold-600 text-black border-none font-bold tracking-[0.3em]">
                  {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} GERAR TEXTO
                </Button>
                <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-5 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-500 tracking-[0.3em]">
                  {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />} GERAR CAPA
                </Button>
              </div>
            </Card>

            {syncID && (
               <div className="bg-zinc-900 border border-gold-600/30 p-8 rounded-sm space-y-6 animate-slide-up shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">DNA: <span className="text-gold-500">{syncID}</span></h4>
                    <Save size={16} className="text-gold-500" />
                  </div>
                  
                  <button onClick={downloadTXT} disabled={!generatedText} className="w-full bg-white text-black p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 font-black rounded-sm hover:bg-gold-500 transition-colors">
                    <FileDown size={20} /> BAIXAR TEXTO
                  </button>
                  <button onClick={downloadJPG} disabled={!generatedImg} className="w-full bg-zinc-800 text-white p-5 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 font-black border border-zinc-700 rounded-sm hover:border-gold-500 transition-colors">
                    <ImageIcon size={20} /> BAIXAR FOTO
                  </button>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div className="bg-zinc-900/30 border border-zinc-800 min-h-[500px] p-12 md:p-20 relative overflow-hidden backdrop-blur-sm rounded-sm">
               {loadingText && (
                 <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
                    <Loader2 size={48} className="text-gold-500 animate-spin mb-4" />
                    <p className="text-gold-500 text-[10px] tracking-[0.5em] uppercase font-bold">Processando...</p>
                 </div>
               )}
               <textarea 
                 value={generatedText} 
                 onChange={(e) => setGeneratedText(e.target.value)}
                 className="w-full bg-transparent text-zinc-300 text-xl md:text-2xl leading-[2.2] font-light italic outline-none font-serif h-[600px] resize-none" 
                 placeholder="O manifesto aparecerá aqui..." 
               />
            </div>
            {generatedImg && (
              <img src={generatedImg} className="w-full aspect-video object-cover grayscale border border-zinc-800 rounded-sm shadow-2xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
