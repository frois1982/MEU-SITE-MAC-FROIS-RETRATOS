import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const EMAIL_CONTATO = 'contato@macfrois.com.br';
export const MAILTO_CONTATO = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent('E-mail pelo site')}`;

export const CopiarEmail: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_CONTATO);
    } catch {
      const t = document.createElement('textarea');
      t.value = EMAIL_CONTATO;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); } catch { /* sem suporte */ }
      document.body.removeChild(t);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copiar}
      aria-label="Copiar o e-mail de contato"
      className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-gold-500 transition-colors ${className}`}
    >
      {copiado ? <Check size={12} /> : <Copy size={12} />}
      {copiado ? 'Copiado' : 'Copiar'}
    </button>
  );
};
