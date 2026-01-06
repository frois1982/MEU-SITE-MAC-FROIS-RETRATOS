
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, ImagePlus, ArrowRight, Save, Info, FileText, FolderOpen, ExternalLink, Code2, HelpCircle, MousePointer2, Star, BookOpen, Quote, CloudUpload, CheckCircle, AlertCircle, Rocket } from 'lucide-react';

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

  // ESTE É O CÓDIGO QUE O USUÁRIO DEVE COLAR NO GOOGLE APPS SCRIPT
  const scriptCode = `function doGet(e) {
  var folderId = "1CsNAC51-bP11LKz9YtjwenbwmAgda9IE"; 
  var results = [];
  var folder = DriveApp.getFolderById(folderId);
  function getFilesRecursively(currentFolder) {
    var files = currentFolder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      results.push({
        name: file.getName(),
        id: file.getId(),
        url: "https://docs.google.com/uc?id=" + file.getId() + "&export=download"
      });
    }
    var subfolders = currentFolder.getFolders();
    while (subfolders.hasNext()) {
      getFilesRecursively(subfolders.next());
    }
  }
  getFilesRecursively(folder);
  return ContentService.createTextOutput(JSON.stringify(results))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var folderId = "1CsNAC51-bP11LKz9YtjwenbwmAgda9IE";
  var folder = DriveApp.getFolderById(folderId);
  
  // Parse dos dados enviados para evitar erro de CORS
  var data = JSON.parse(e.postData.contents);
  
  try {
    // 1. Criar Editorial (Texto)
    var textFileName = data.fileName + ".txt";
    folder.createFile(textFileName, data.content);
    
    // 2. Criar Capa (Imagem)
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
        contents: `Escreva um editorial de luxo para o retratista Mac Frois.
        TEMA: "${topic}"
        ESTRUTURA: 
        1. Comece com citação filosófica (Barthes/Sontag).
        2. Fale de ciência visual e tecnologia.
        3. Termine na simplicidade do Retrato Real do Mac Frois.`,
        config: { temperature: 0.9, thinkingConfig: { thinkingBudget: 2000 } }
      });
      setGeneratedText(response.text || '');
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
        contents: { parts: [{ text: `High-end black and white editorial portrait, sharp detail, dramatic lighting, minimalist. Theme: ${topic}` }] },
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

      await fetch(DRIVE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      setPublishStatus('success');
      setTimeout(() => {
        setPublishStatus('idle');
        setTopic('');
        setGeneratedText('');
        setGeneratedImg('');
      }, 4000);
    } catch (e) {
      setPublishStatus('error');
    }
    setLoadingPublish(false);
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
           <div className="text-center md:text-left">
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editorial de Autoridade</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest">Laboratório Criativo</h1>
           </div>
           
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowHelp(!showHelp)}
               className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all px-6 py-2.5 border rounded-full font-bold ${showHelp ? 'bg-gold-600 text-black border-gold-600' : 'text-zinc-500 border-zinc-800 hover:text-white'}`}
             >
               <Code2 size={14} /> {showHelp ? 'Fechar Guia' : 'Configurar Script'}
             </button>
             {!hasKey && (
               <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-2.5 flex items-center gap-3 font-bold border-none shadow-xl">
                 <Key size={16} /> ATIVAR IA
               </Button>
             )}
           </div>
        </div>

        {showHelp && (
          <div className="mb-12 bg-zinc-900/80 border border-gold-600/30 p-10 rounded-sm animate-fade-in backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/10 blur-3xl rounded-full"></div>
             <div className="flex items-center gap-4 mb-8">
                <CloudUpload className="text-gold-500" size={24} />
                <h4 className="text-white text-xs font-bold tracking-[0.4em] uppercase">Passo a Passo: Ativar Publicação Direta</h4>
             </div>
             
             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6 text-[10px] text-zinc-400 tracking-[0.2em] uppercase leading-relaxed">
                   <p className="flex items-start gap-3"><span className="text-gold-500 font-bold">01.</span> Abra seu Google Apps Script e apague todo o código anterior.</p>
                   <p className="flex items-start gap-3"><span className="text-gold-500 font-bold">02.</span> Clique no botão ao lado para copiar o novo código de segurança.</p>
                   <p className="flex items-start gap-3"><span className="text-gold-500 font-bold">03.</span> Salve e clique em "Implantar" > "Nova Implantação".</p>
                   <p className="flex items-start gap-3"><span className="text-gold-500 font-bold">04.</span> Escolha "App da Web" e acesso para "Qualquer pessoa".</p>
                   <p className="flex items-start gap-3"><span className="text-gold-500 font-bold">05.</span> Copie a URL e cole-a no seu arquivo config.ts.</p>
                </div>
                <div className="relative group">
                   <pre className="bg-black/60 p-6 rounded-sm text-[9px] h-48 overflow-y-auto border border-zinc-800 font-mono text-zinc-500 select-all">
                     {scriptCode}
                   </pre>
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(scriptCode);
                       setCopyStatus(true);
                       setTimeout(() => setCopyStatus(false), 2000);
                     }}
                     className="absolute top-4 right-4 bg-gold-600 text-black px-4 py-2 rounded-sm text-[9px] font-bold tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
                   >
                     {copyStatus ? <Check size={12} /> : <Copy size={12} />} {copyStatus ? 'COPIADO' : 'COPIAR'}
                   </button>
                </div>
             </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8 shadow-2xl backdrop-blur-md">
              <h3 className="text-white text-[11px] font-bold tracking-[0.4em] uppercase mb-8 flex items-center gap-4 border-b border-zinc-800/50 pb-6">
                <PenTool size={18} className="text-gold-500" /> Composição de Pauta
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-bold">Ideia Central</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: A verdade por trás do olhar..."
                    rows={4}
                    className="w-full bg-black/60 border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest transition-all placeholder:text-zinc-800"
                  />
                </div>
                
                <div className="space-y-4">
                  <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-6 flex items-center justify-center gap-4 group !bg-gold-600/80 hover:!bg-gold-600 border-none shadow-lg tracking-[0.4em]">
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    REDIGIR TEXTO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-6 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-600 tracking-[0.4em]">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    CRIAR CAPA
                  </Button>
                </div>
              </div>
            </Card>

            {generatedText && (
               <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-sm space-y-6 shadow-2xl animate-slide-up backdrop-blur-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gold-600/5 blur-2xl"></div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                      <Rocket size={16} className="text-gold-500" /> Publicação Instantânea
                    </h4>
                    {publishStatus === 'success' && <CheckCircle size={18} className="text-green-500" />}
                  </div>
                  
                  <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] leading-loose">
                    Este comando enviará o manuscrito e a capa visual para a biblioteca do Drive, manifestando-os automaticamente na aba Editorial do site.
                  </p>
                  
                  <Button 
                    onClick={publishToBlog} 
                    disabled={loadingPublish || !generatedText}
                    className={`w-full py-6 flex items-center justify-center gap-4 border-none transition-all duration-1000 font-bold tracking-[0.4em] shadow-2xl ${publishStatus === 'success' ? '!bg-green-600 text-white' : '!bg-white text-black hover:!bg-gold-500'}`}
                  >
                    {loadingPublish ? <Loader2 size={20} className="animate-spin" /> : publishStatus === 'success' ? <CheckCircle size={20} /> : <CloudUpload size={20} />}
                    {publishStatus === 'success' ? 'PUBLICADO COM SUCESSO' : 'PUBLICAR NO BLOG AGORA'}
                  </Button>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-zinc-500 text-[10px] font-bold tracking-[0.6em] uppercase flex items-center gap-3">
                   <FileText size={14} className="text-gold-500" /> Manuscrito Editorial
                </span>
                {generatedText && (
                  <button onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                    setCopyStatus(true);
                    setTimeout(() => setCopyStatus(false), 2000);
                  }} className="text-gold-500 hover:text-white transition-colors flex items-center gap-3 text-[10px] tracking-[0.5em] uppercase font-bold">
                    {copyStatus ? <Check size={14} /> : <Copy size={14} />} {copyStatus ? 'Copiado' : 'Copiar'}
                  </button>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-0 min-h-[500px] relative overflow-hidden rounded-sm group shadow-2xl">
                 {loadingText && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[11px] tracking-[1em] uppercase font-bold animate-pulse">Tecendo Pensamento...</p>
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
                   <ImageIcon size={14} className="text-gold-500" /> Visual do Editorial
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 aspect-video relative overflow-hidden rounded-sm flex items-center justify-center shadow-2xl group">
                 {loadingImg && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[11px] tracking-[1em] uppercase font-bold animate-pulse">Compondo Luz...</p>
                    </div>
                 )}
                 {generatedImg ? (
                    <img src={generatedImg} alt="Capa" className="w-full h-full object-cover animate-fade-in grayscale transition-all duration-1000 group-hover:grayscale-0" />
                 ) : (
                   <div className="text-center opacity-10">
                      <ImageIcon size={64} className="text-zinc-700 mx-auto mb-6" />
                      <p className="text-zinc-700 text-[11px] tracking-[0.8em] uppercase font-bold">Espaço Estético</p>
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
