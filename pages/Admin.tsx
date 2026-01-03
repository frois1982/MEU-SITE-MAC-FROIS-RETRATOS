
import React, { useState } from 'react';
import { Button, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Activity, BookOpen, Tag, Code2, Copy, ExternalLink, HelpCircle } from 'lucide-react';

export const Admin: React.FC = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [showNamingGuide, setShowNamingGuide] = useState(true);

  const testConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Verificando conexão...');
    try {
      const response = await fetch(DRIVE_SCRIPT_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTestStatus('success');
        setTestMessage(`${data.length} arquivos sincronizados com sucesso.`);
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage("Erro: Verifique o link no config.ts ou permissões do Drive.");
    }
  };

  const namingConvention = [
    { prefix: 'CAPA_', target: 'Home - Topo', example: 'CAPA_Principal.jpg' },
    { prefix: 'MANIF_', target: 'Home - Manifesto', example: 'MANIF_Retrato.jpg' },
    { prefix: 'CORP_', target: 'Portfólio Corporativo', example: 'CORP_Empresario.jpg' },
    { prefix: 'PORT_', target: 'Portfólio Retratos', example: 'PORT_Mulher.jpg' },
    { prefix: 'ART_', target: 'Portfólio Artístico', example: 'ART_Conceito.jpg.jpg' },
    { prefix: 'blog_', target: 'Textos do Blog (.txt)', example: 'blog_01-01-2025.txt' },
  ];

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-center mb-12">
           <h1 className="text-3xl font-serif text-white italic tracking-widest uppercase">Laboratório Mac Frois</h1>
           <Button onClick={() => setShowNamingGuide(!showNamingGuide)} variant="outline" className="text-[10px]">
             {showNamingGuide ? 'Ocultar Guia' : 'Mostrar Guia de Nomes'}
           </Button>
        </div>

        <div className="grid gap-8">
           <Card className="bg-zinc-900 border-zinc-800 p-8">
              <h3 className="text-white text-xs font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                <Activity size={18} className="text-gold-500" /> Status da Central de Fotos
              </h3>
              <div className={`p-6 border rounded-sm mb-8 ${testStatus === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-black/40 border-zinc-800 text-zinc-500'}`}>
                 <p className="text-[10px] tracking-widest uppercase font-bold">{testMessage || "Pronto para sincronizar."}</p>
              </div>
              <Button onClick={testConnection} disabled={testStatus === 'testing'} className="w-full py-5 tracking-[0.4em]">
                {testStatus === 'testing' ? 'SINCRONIZANDO...' : 'Sincronizar Galeria'}
              </Button>
           </Card>

           {showNamingGuide && (
             <Card className="bg-zinc-900 border-gold-600/20 p-8 animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <Tag size={20} className="text-gold-500" />
                  <h3 className="text-white text-xs font-bold tracking-widest uppercase">Manual Visual de Arquivos</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {namingConvention.map((item, i) => (
                    <div key={i} className="p-4 bg-black/40 border border-zinc-800 rounded-sm">
                      <p className="text-gold-500 text-[10px] font-bold tracking-widest mb-1">{item.prefix}</p>
                      <p className="text-white text-xs font-serif italic mb-2">{item.target}</p>
                      <p className="text-zinc-600 text-[9px] font-mono">Ex: {item.example}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-zinc-800">
                   <p className="text-zinc-500 text-[9px] tracking-widest uppercase leading-relaxed italic">
                     * O site está configurado para ignorar automaticamente os sufixos ".jpg.jpg" ou números extras que o Google Drive possa adicionar.
                   </p>
                </div>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
};
