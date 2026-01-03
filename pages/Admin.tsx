
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Sparkles, Image as ImageIcon, Copy, Check, Download, Loader2, Key, PenTool, ImagePlus, ArrowRight, Save, Info, FileText, FolderOpen, ExternalLink, Code2, HelpCircle, MousePointer2, Activity, AlertCircle, BookOpen, Tag } from 'lucide-react';

export const Admin: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNamingGuide, setShowNamingGuide] = useState(false);
  
  // Estados de Diagnóstico
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const scriptCode = `function doGet() {
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
}`;

  const testConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Iniciando handshake...');
    try {
      const response = await fetch(DRIVE_SCRIPT_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTestStatus('success');
        setTestMessage(`Sucesso! ${data.length} arquivos detectados.`);
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage("Erro: Verifique permissões e o link no config.ts");
    }
  };

  const getBaseFileName = () => {
    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const cleanTopic = topic.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toUpperCase().substring(0, 20);
    return `blog_${date}_EDITORIAL_${cleanTopic || 'POST'}`;
  };

  useEffect(() => {
    if (process.env.API_KEY) setHasKey(true);
  }, []);

  const baseName = getBaseFileName();

  const namingConvention = [
    { prefix: 'CAPA_', target: 'Home - Imagem de Topo', example: 'CAPA_Principal.jpg' },
    { prefix: 'MANIF_', target: 'Home - Imagem do Manifesto', example: 'MANIF_Retrato_Mac.jpg' },
    { prefix: 'CORP_', target: 'Portfólio - Corporativo', example: 'CORP_Empresario_01.jpg' },
    { prefix: 'PORT_', target: 'Portfólio - Retratos', example: 'PORT_Mulher_Luz.jpg' },
    { prefix: 'ART_', target: 'Portfólio - Artístico', example: 'ART_Conceito_Sombra.jpg' },
    { prefix: 'PROD1_', target: 'Produtos - Lúmina Edição', example: 'PROD1_App_Cover.jpg' },
    { prefix: 'PROD2_', target: 'Produtos - Lúmina Pro', example: 'PROD2_IA_Dashboard.jpg' },
    { prefix: 'MENTORIA1_', target: 'Serviços - Foto Mentoria 01', example: 'MENTORIA1_Aula.jpg' },
  ];

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
           <div>
             <h2 className="text-gold-500 text-xs font-bold tracking-[0.5em] uppercase mb-2">Ambiente de Criação</h2>
             <h1 className="text-4xl font-serif text-white italic tracking-widest">Laboratório Criativo</h1>
           </div>
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowNamingGuide(!showNamingGuide)}
               className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all px-5 py-3 border rounded-full ${showNamingGuide ? 'bg-gold-600 text-black' : 'text-zinc-400 border-zinc-800'}`}
             >
               <BookOpen size={14} /> {showNamingGuide ? 'Fechar Manual' : 'Manual de Nomes'}
             </button>
             <button 
               onClick={() => setShowHelp(!showHelp)}
               className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all px-5 py-3 border rounded-full ${showHelp ? 'bg-zinc-200 text-black' : 'text-zinc-400 border-zinc-800'}`}
             >
               <HelpCircle size={14} /> Ajuda Técnica
             </button>
           </div>
        </div>

        {/* Manual de Nomenclatura Visual (A Colinha do Mac) */}
        {showNamingGuide && (
          <div className="mb-12 bg-zinc-900 border border-gold-600/30 p-8 rounded-sm animate-fade-in">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-gold-600/10 rounded-full flex items-center justify-center text-gold-500">
                 <Tag size={24} />
               </div>
               <div>
                 <h3 className="text-white text-sm font-bold tracking-widest uppercase">Manual de Nomenclatura</h3>
                 <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Como renomear suas fotos no Google Drive</p>
               </div>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {namingConvention.map((item, i) => (
                  <div key={i} className="p-4 bg-black/40 border border-zinc-800 rounded-sm group hover:border-gold-600/50 transition-colors">
                    <p className="text-gold-500 text-[10px] font-bold tracking-widest mb-1 uppercase">{item.prefix}</p>
                    <p className="text-white text-xs font-serif mb-3 italic">{item.target}</p>
                    <div className="flex items-center justify-between text-[9px] text-zinc-600 font-mono">
                       <span>Ex: {item.example}</span>
                       <button onClick={() => navigator.clipboard.writeText(item.prefix)} className="hover:text-gold-500"><Copy size={12}/></button>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-8 p-4 bg-gold-600/5 border border-gold-600/20 rounded-sm">
                <p className="text-zinc-400 text-[10px] uppercase tracking-widest leading-relaxed">
                  <span className="text-gold-500 font-bold">DICA:</span> O site ignora tudo o que vem antes do primeiro sublinhado (_). <br/>
                  Se você nomear como <code className="text-white">ART_Retrato_Luz.jpg</code>, o site mostrará apenas <code className="text-white">"Retrato Luz"</code>.
                </p>
             </div>
          </div>
        )}

        {/* Diagnóstico e Ajuda */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                <Activity size={16} className="text-gold-500" /> Status do Drive
              </h3>
              <div className={`p-4 border rounded-sm mb-6 ${testStatus === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-black/40 border-zinc-800 text-zinc-500'}`}>
                 <p className="text-[10px] tracking-widest uppercase">{testMessage || "Pronto para teste."}</p>
              </div>
              <Button onClick={testConnection} disabled={testStatus === 'testing'} className="w-full text-[10px]">
                {testStatus === 'testing' ? 'TESTANDO...' : 'TESTAR CONEXÃO'}
              </Button>
           </Card>

           {showHelp && (
             <Card className="bg-zinc-900 border-gold-600/30 p-6 animate-fade-in">
                <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Code2 size={16} className="text-gold-500" /> Script para o Google
                </h3>
                <pre className="bg-black p-4 text-[9px] text-zinc-500 overflow-x-auto border border-zinc-800 max-h-[100px] mb-4">
                  {scriptCode}
                </pre>
                <Button variant="outline" className="w-full text-[10px]" onClick={() => navigator.clipboard.writeText(scriptCode)}>
                  COPIAR SCRIPT
                </Button>
             </Card>
           )}
        </div>

        {/* Gerador de Conteúdo */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-zinc-800 pb-4">
                <PenTool size={18} className="text-gold-500" /> 
                Novo Editorial
              </h3>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Tema do post..."
                className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none rounded-sm text-sm mb-6"
                rows={4}
              />
              <div className="grid gap-4">
                <Button onClick={() => {}} disabled className="w-full text-[10px]">GERAR TEXTO AI</Button>
                <Button variant="outline" onClick={() => {}} disabled className="w-full text-[10px]">GERAR CAPA AI</Button>
              </div>
            </Card>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-sm text-center">
               <p className="text-white text-[10px] font-bold tracking-widest uppercase mb-4">Nome do Arquivo p/ Salvar:</p>
               <code className="text-gold-500 text-xs font-mono block bg-black p-3 border border-zinc-800 mb-4">{baseName}.txt</code>
               <button onClick={() => navigator.clipboard.writeText(baseName)} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mx-auto">
                 <Copy size={12}/> Copiar Nome
               </button>
            </div>
          </div>

          <div className="lg:col-span-8 flex items-center justify-center border border-dashed border-zinc-800 rounded-sm min-h-[400px]">
             <div className="text-center opacity-20">
                <ImageIcon size={64} className="mx-auto mb-4 text-zinc-700" />
                <p className="text-[10px] tracking-[0.5em] uppercase text-zinc-700">Prévia do Editorial</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
