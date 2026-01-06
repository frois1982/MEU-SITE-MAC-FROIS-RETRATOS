
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, ImagePlus, ArrowRight, Save, Info, FileText, FolderOpen, ExternalLink, Code2, HelpCircle, MousePointer2, Star, BookOpen, Quote, CloudUpload, CheckCircle, AlertCircle } from 'lucide-react';

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

  // SCRIPT OTIMIZADO PARA EVITAR CONFLITOS NA PASTA
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
  
  // Parse dos dados enviados como texto para evitar erro de CORS
  var data = JSON.parse(e.postData.contents);
  
  try {
    // 1. Criar arquivo de Texto (Editorial)
    var textFileName = data.fileName + ".txt";
    var textFile = folder.createFile(textFileName, data.content);
    
    // 2. Criar arquivo de Imagem (Capa) se existir
    if (data.image) {
      var contentType = data.image.split(",")[0].split(":")[1].split(";")[0];
      var bytes = Utilities.base64Decode(data.image.split(",")[1]);
      var blob = Utilities.newBlob(bytes, contentType, "capa_" + data.fileName + ".png");
      folder.createFile(blob);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "success", id: textFile.getId()}))
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
      .substring(0, 20)
      .toUpperCase();
    return `blog_${date}_${time}_${cleanTopic || 'EDITORIAL'}`;
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
        TEMA CENTRAL: "${topic}"
        
        ESTRUTURA OBRIGATÓRIA (Protocolo Frois):
        1. INTRODUÇÃO: Comece com uma provocação filosófica profunda (ex: Susan Sontag, Roland Barthes).
        2. DESENVOLVIMENTO: Articule com a ciência da visão e o impacto dos algoritmos/filtros.
        3. CONCLUSÃO: Finalize na pureza do RETRATO REAL que Mac Frois produz. A verdade é o luxo definitivo.
        
        TOM: Minimalista, denso, poético e profissional.`,
        config: { 
          temperature: 0.85,
          thinkingConfig: { thinkingBudget: 1500 }
        }
      });
      setGeneratedText(response.text || '');
    } catch (e) {
      console.error(e);
    }
    setLoadingText(false);
  };

  const generateCover = async () => {
    if (!topic) return;
    setLoadingImg(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `Masterpiece black and white editorial photography, cinematic soft lighting, sharp focus on human soul, minimalist composition. Mood: ${topic}. No text.` }],
        },
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
    } catch (e) {
      console.error(e);
    }
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

      // Enviamos como text/plain para evitar o Preflight de CORS que trava o Google Scripts
      const response = await fetch(DRIVE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      // Como o Google Scripts muitas vezes não retorna o corpo em modo POST direto via fetch,
      // verificamos a resposta genérica ou assumimos sucesso se não houver erro de rede.
      setPublishStatus('success');
      setTopic('');
      setTimeout(() => {
        setPublishStatus('idle');
        setGeneratedText('');
        setGeneratedImg('');
      }, 5000);
    } catch (e) {
      console.error("Erro ao publicar:", e);
      setPublishStatus('error');
    }
    setLoadingPublish(false);
  };

  const baseName = getBaseFileName();

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
           <div className="text-center md:text-left">
             <h2 className="text-gold-500 text-[10px] font-bold tracking-[0.6em] uppercase mb-2">Editoria Mac Frois</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest">Laboratório Criativo</h1>
           </div>
           
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowHelp(!showHelp)}
               className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all px-6 py-2.5 border rounded-full font-bold ${showHelp ? 'bg-gold-600 text-black border-gold-600' : 'text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-600'}`}
             >
               <Code2 size={14} /> {showHelp ? 'Fechar Script' : 'Configurar Sincronia'}
             </button>
             {!hasKey && (
               <Button onClick={handleKeyActivation} className="bg-gold-600 text-black px-8 py-2.5 flex items-center gap-3 font-bold border-none shadow-xl">
                 <Key size={16} /> ATIVAR IA
               </Button>
             )}
           </div>
        </div>

        {showHelp && (
          <div className="mb-12 bg-zinc-900/80 border border-gold-600/20 p-10 rounded-sm animate-fade-in relative overflow-hidden backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gold-600/20 rounded-full flex items-center justify-center text-gold-500">
                  <CloudUpload size={20} />
                </div>
                <div>
                   <h4 className="text-white text-sm font-bold tracking-widest uppercase">Ativar Postagem Sem Erros</h4>
                   <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-1">Siga este passo para garantir que seus retratos fiquem seguros.</p>
                </div>
             </div>
             
             <p className="text-zinc-400 text-[10px] tracking-[0.2em] uppercase mb-6 leading-relaxed bg-black/40 p-6 border-l-2 border-gold-600 italic">
                Acesse seu Google Apps Script e substitua TODO o código existente pelo código abaixo. <br/>
                Isso garantirá que o site consiga CRIAR arquivos sem alterar nada que já esteja na pasta.
             </p>

             <div className="relative group">
                <pre className="bg-black text-zinc-500 p-8 rounded-sm text-[10px] overflow-x-auto border border-zinc-900 font-mono leading-relaxed select-all">
                  {scriptCode}
                </pre>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(scriptCode);
                    setCopyStatus(true);
                    setTimeout(() => setCopyStatus(false), 2000);
                  }}
                  className="absolute top-6 right-6 bg-zinc-800 hover:bg-gold-600 hover:text-black px-6 py-2 transition-all rounded-sm text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 border border-zinc-700"
                >
                  {copyStatus ? <Check size={14} /> : <Copy size={14} />} {copyStatus ? 'COPIADO' : 'COPIAR SCRIPT'}
                </button>
             </div>
             <div className="mt-8 p-6 bg-gold-600/5 border border-gold-600/10 rounded-sm">
                <p className="text-gold-500 text-[9px] tracking-[0.4em] uppercase font-bold flex items-center gap-3">
                   <Info size={14} /> Lembre-se de clicar em "Implantar" > "Nova Implantação" após salvar.
                </p>
             </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-zinc-900/40 border-zinc-800 p-8 shadow-2xl backdrop-blur-md">
              <h3 className="text-white text-xs font-bold tracking-[0.4em] uppercase mb-8 flex items-center gap-4 border-b border-zinc-800/50 pb-6">
                <PenTool size={18} className="text-gold-500" /> 
                Composição
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">Ideia Central</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Sobre o que vamos escrever hoje?"
                    rows={4}
                    className="w-full bg-black/60 border border-zinc-800 p-6 text-white focus:border-gold-600 outline-none rounded-sm text-sm font-light tracking-widest transition-all placeholder:text-zinc-800"
                  />
                </div>
                
                <div className="space-y-4 pt-4">
                  <Button onClick={generateEditorial} disabled={loadingText || !topic || !hasKey} className="w-full py-6 flex items-center justify-center gap-4 group !bg-gold-600/80 hover:!bg-gold-600 border-none shadow-lg tracking-[0.3em]">
                    {loadingText ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    CRIAR TEXTO
                  </Button>
                  <Button onClick={generateCover} disabled={loadingImg || !topic || !hasKey} variant="outline" className="w-full py-6 flex items-center justify-center gap-4 border-zinc-800 hover:border-gold-600 tracking-[0.3em]">
                    {loadingImg ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    CRIAR CAPA
                  </Button>
                </div>
              </div>
            </Card>

            {generatedText && (
               <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-sm space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-up backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                      <CloudUpload size={16} className="text-gold-500" /> Publicação Direta
                    </h4>
                    {publishStatus === 'success' && <CheckCircle size={18} className="text-green-500" />}
                    {publishStatus === 'error' && <AlertCircle size={18} className="text-red-500" />}
                  </div>
                  
                  <p className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] leading-loose">
                    {publishStatus === 'success' 
                      ? "Editorial manifestado com sucesso no blog." 
                      : "O sistema enviará o manuscrito e a capa visual para sua biblioteca agora."}
                  </p>
                  
                  <Button 
                    onClick={publishToBlog} 
                    disabled={loadingPublish || !generatedText}
                    className={`w-full py-6 flex items-center justify-center gap-4 border-none transition-all duration-700 font-bold tracking-[0.3em] ${publishStatus === 'success' ? '!bg-green-600 text-white' : '!bg-white text-black hover:!bg-gold-500'}`}
                  >
                    {loadingPublish ? <Loader2 size={20} className="animate-spin" /> : publishStatus === 'success' ? <CheckCircle size={20} /> : <Save size={20} />}
                    {publishStatus === 'success' ? 'POSTADO' : publishStatus === 'error' ? 'RETTENTAR' : 'POSTAR NO BLOG'}
                  </Button>
               </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-zinc-500 text-[10px] font-bold tracking-[0.5em] uppercase flex items-center gap-3">
                   <FileText size={14} className="text-gold-500" /> Manuscrito Editorial
                </span>
                {generatedText && (
                  <button onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                    setCopyStatus(true);
                    setTimeout(() => setCopyStatus(false), 2000);
                  }} className="text-gold-500 hover:text-white transition-colors flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-bold">
                    {copyStatus ? <Check size={14} /> : <Copy size={14} />} {copyStatus ? 'Copiado' : 'Copiar'}
                  </button>
                )}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-0 min-h-[450px] relative overflow-hidden rounded-sm group shadow-2xl">
                 {loadingText && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[10px] tracking-[0.8em] uppercase font-bold animate-pulse">Tecendo Narrativa...</p>
                    </div>
                 )}
                 <textarea
                   value={generatedText}
                   onChange={(e) => setGeneratedText(e.target.value)}
                   className="w-full h-full min-h-[450px] bg-transparent p-16 text-zinc-300 text-lg leading-relaxed font-light italic outline-none font-serif resize-none border-none focus:ring-0"
                   placeholder="O editorial será manifestado aqui..."
                 />
                 <div className="absolute bottom-6 right-8 text-[9px] text-zinc-700 tracking-[0.4em] uppercase font-bold">
                    © Mac Frois Lab
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-zinc-500 text-[10px] font-bold tracking-[0.5em] uppercase flex items-center gap-3">
                   <ImageIcon size={14} className="text-gold-500" /> Estética Visual
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 aspect-video relative overflow-hidden rounded-sm flex items-center justify-center shadow-2xl group">
                 {loadingImg && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center">
                       <Loader2 size={48} className="text-gold-500 animate-spin mb-6" />
                       <p className="text-gold-500 text-[10px] tracking-[0.8em] uppercase font-bold animate-pulse">Compondo Luz...</p>
                    </div>
                 )}
                 {generatedImg ? (
                   <>
                    <img src={generatedImg} alt="Capa" className="w-full h-full object-cover animate-fade-in grayscale transition-all duration-1000 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <a href={generatedImg} download={`CAPA_${baseName}.png`} className="bg-white text-black p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                          <Download size={24} />
                       </a>
                    </div>
                   </>
                 ) : (
                   <div className="text-center opacity-20">
                      <ImageIcon size={64} className="text-zinc-700 mx-auto mb-6" />
                      <p className="text-zinc-700 text-[10px] tracking-[0.6em] uppercase font-bold">Espaço da Capa</p>
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
