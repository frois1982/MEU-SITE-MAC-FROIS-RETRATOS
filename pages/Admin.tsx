
import React, { useState } from 'react';
import { Button, Card } from '../components/UI';
import { DRIVE_SCRIPT_URL } from '../config';
import { Activity, Tag, BookOpen } from 'lucide-react';

export const Admin: React.FC = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const testConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Verificando conexão...');
    try {
      const response = await fetch(DRIVE_SCRIPT_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTestStatus('success');
        setTestMessage(`${data.length} arquivos sincronizados.`);
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage("Erro na conexão com o Drive.");
    }
  };

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen text-zinc-200">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-serif text-white italic tracking-widest uppercase mb-12">Painel de Controle</h1>

        <div className="grid gap-8">
           <Card className="bg-zinc-900 border-zinc-800 p-8">
              <h3 className="text-white text-xs font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                <Activity size={18} className="text-gold-500" /> Sincronização Drive
              </h3>
              <div className={`p-6 border rounded-sm mb-8 ${testStatus === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-black/40 border-zinc-800 text-zinc-500'}`}>
                 <p className="text-[10px] tracking-widest uppercase font-bold">{testMessage || "Pronto para sincronizar."}</p>
              </div>
              <Button onClick={testConnection} disabled={testStatus === 'testing'} className="w-full">
                {testStatus === 'testing' ? 'Sincronizando...' : 'Sincronizar Galeria'}
              </Button>
           </Card>

           <Card className="bg-zinc-900 border-zinc-800 p-8">
              <div className="flex items-center gap-4 mb-8">
                <BookOpen size={20} className="text-gold-500" />
                <h3 className="text-white text-xs font-bold tracking-widest uppercase">Guia de Nomes</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { p: 'CAPA_', t: 'Banner Home' },
                  { p: 'MANIF_', t: 'Manifesto Home' },
                  { p: 'CORP_', t: 'Corporativo' },
                  { p: 'PORT_', t: 'Retratos' },
                  { p: 'ART_', t: 'Artístico' },
                  { p: 'blog_', t: 'Post Editorial (.txt)' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-black/40 border border-zinc-800 rounded-sm">
                    <p className="text-gold-500 text-[10px] font-bold tracking-widest mb-1">{item.p}</p>
                    <p className="text-white text-xs font-serif italic">{item.t}</p>
                  </div>
                ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
