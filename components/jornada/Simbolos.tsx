import React from 'react';

// Símbolos do Rebelde em SVG (provisórios, traço fino). O estilo final é aprovado pelo Mac.
const traco = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const CorrenteQuebrada: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true" {...traco}>
    <rect x="8" y="42" width="46" height="26" rx="13" transform="rotate(-28 31 55)" />
    <rect x="66" y="52" width="46" height="26" rx="13" transform="rotate(-28 89 65)" />
    <path d="M56 58 l4 -4 M60 64 l-5 3 M62 54 l1 -6" />
  </svg>
);

export const Chama: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} aria-hidden="true" {...traco}>
    <path d="M50 8 C58 32 82 44 80 72 C78 98 62 112 50 112 C34 112 20 98 22 76 C23 62 32 56 36 44 C40 54 44 56 46 54 C48 40 46 24 50 8 Z" />
    <path d="M50 112 C42 104 40 92 46 82 C50 90 58 92 58 102 C58 108 54 112 50 112 Z" />
  </svg>
);

export const Raio: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 80 120" className={className} aria-hidden="true" {...traco}>
    <path d="M48 6 L14 66 H38 L28 114 L68 48 H42 Z" />
  </svg>
);

// ---- Governante (provisórios) ----
export const Coroa: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 100" className={className} aria-hidden="true" {...traco}>
    <path d="M14 78 L8 30 L38 54 L60 18 L82 54 L112 30 L106 78 Z" />
    <path d="M14 90 H106" />
    <circle cx="8" cy="26" r="4" /><circle cx="60" cy="13" r="4" /><circle cx="112" cy="26" r="4" />
  </svg>
);

export const Cetro: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 60 140" className={className} aria-hidden="true" {...traco}>
    <circle cx="30" cy="22" r="14" />
    <path d="M30 8 V36 M16 22 H44" />
    <path d="M24 38 H36 L33 50 H27 Z" />
    <path d="M30 50 V128" />
    <path d="M22 132 H38" />
  </svg>
);

export const Torre: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 130" className={className} aria-hidden="true" {...traco}>
    <path d="M22 122 V44 H14 V20 H30 V30 H40 V20 H60 V30 H70 V20 H86 V44 H78 V122 Z" />
    <path d="M42 122 V94 Q50 84 58 94 V122" />
    <path d="M44 62 H56 M44 74 H56" />
  </svg>
);

// ---- Amante (provisórios) ----
export const Coracao: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...traco}>
    <path d="M50 90 C8 58 12 20 36 20 C46 20 50 28 50 34 C50 28 54 20 64 20 C88 20 92 58 50 90 Z" />
  </svg>
);

export const Rosa: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 130" className={className} aria-hidden="true" {...traco}>
    <path d="M50 40 C34 40 28 22 44 16 C58 10 76 22 70 40 C66 54 46 58 38 46 C32 36 42 28 50 30 C56 32 56 40 50 40 Z" />
    <path d="M50 58 V124" />
    <path d="M50 98 C64 92 76 96 82 82 C66 80 56 86 50 98 Z" />
    <path d="M50 84 C38 80 28 84 22 72 C36 70 46 74 50 84 Z" />
  </svg>
);

export const Aneis: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 110 80" className={className} aria-hidden="true" {...traco}>
    <circle cx="40" cy="40" r="26" />
    <circle cx="70" cy="40" r="26" />
  </svg>
);

// ---- Herói e Mago (provisórios) ----
export const Espada: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 60 140" className={className} aria-hidden="true" {...traco}>
    <path d="M30 4 L36 22 V92 H24 V22 Z" />
    <path d="M10 92 H50" />
    <path d="M30 92 V118" />
    <circle cx="30" cy="126" r="7" />
  </svg>
);

export const Escudo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} aria-hidden="true" {...traco}>
    <path d="M50 8 L90 22 V58 C90 86 70 104 50 114 C30 104 10 86 10 58 V22 Z" />
    <path d="M50 8 V114 M10 52 H90" />
  </svg>
);

export const Sol: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className} aria-hidden="true" {...traco}>
    <path d="M30 70 A30 30 0 0 1 90 70" />
    <path d="M6 70 H114 M60 14 V28 M24 30 L34 40 M96 30 L86 40 M10 52 L22 56 M110 52 L98 56" />
  </svg>
);

export const Estrela: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...traco}>
    <path d="M50 6 C54 36 64 46 94 50 C64 54 54 64 50 94 C46 64 36 54 6 50 C36 46 46 36 50 6 Z" />
    <path d="M82 14 V26 M76 20 H88" />
  </svg>
);

export const Lua: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 90 110" className={className} aria-hidden="true" {...traco}>
    <path d="M62 8 C30 14 14 38 14 58 C14 84 36 102 62 100 C42 94 32 76 32 58 C32 38 44 18 62 8 Z" />
  </svg>
);

export const Olho: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 70" className={className} aria-hidden="true" {...traco}>
    <path d="M6 35 C24 8 96 8 114 35 C96 62 24 62 6 35 Z" />
    <circle cx="60" cy="35" r="14" /><circle cx="60" cy="35" r="4" />
  </svg>
);

// ---- Bobo da Corte e Pessoa Comum (provisórios) ----
export const Mascara: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 110" className={className} aria-hidden="true" {...traco}>
    <path d="M12 16 C34 8 66 8 88 16 C92 58 76 96 50 102 C24 96 8 58 12 16 Z" />
    <path d="M26 40 Q36 32 44 40 M56 40 Q64 32 74 40" />
    <path d="M28 62 Q50 88 72 62" />
  </svg>
);

export const Chapeu: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 100" className={className} aria-hidden="true" {...traco}>
    <path d="M14 84 L22 34 L46 58 L60 22 L74 58 L98 34 L106 84 Z" />
    <path d="M10 84 H110" />
    <circle cx="22" cy="28" r="6" /><circle cx="60" cy="16" r="6" /><circle cx="98" cy="28" r="6" />
  </svg>
);

export const Confete: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...traco}>
    <path d="M14 22 L26 30 M70 12 L74 26 M86 52 L74 58 M20 70 L32 64 M52 86 L56 74 M44 30 L50 42" />
    <circle cx="80" cy="30" r="4" /><circle cx="36" cy="50" r="4" /><circle cx="68" cy="76" r="4" /><circle cx="14" cy="46" r="3" />
  </svg>
);

export const Casa: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 110 100" className={className} aria-hidden="true" {...traco}>
    <path d="M10 50 L55 12 L100 50" />
    <path d="M22 44 V92 H88 V44" />
    <path d="M46 92 V64 H64 V92" />
  </svg>
);

export const Maos: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className} aria-hidden="true" {...traco}>
    <path d="M6 44 L30 28 L52 30 L66 42 L52 54 L34 52" />
    <path d="M114 44 L90 28 L68 30 L54 42 L68 54 L86 52" />
    <path d="M30 28 L36 16 M90 28 L84 16" />
  </svg>
);

export const Cafe: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...traco}>
    <path d="M18 40 H74 V66 C74 82 62 90 46 90 C30 90 18 82 18 66 Z" />
    <path d="M74 48 H84 C92 48 92 66 82 66 H74" />
    <path d="M34 28 C28 20 40 16 34 8 M50 28 C44 20 56 16 50 8" />
  </svg>
);

// ---- Inocente, Explorador e Sábio (provisórios) ----
export const Margarida: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 130" className={className} aria-hidden="true" {...traco}>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <ellipse key={a} cx="50" cy="36" rx="7" ry="16" transform={`rotate(${a} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="8" />
    <path d="M50 66 V124" /><path d="M50 100 C62 94 72 96 78 84 C64 82 54 88 50 100 Z" />
  </svg>
);

export const Pomba: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className} aria-hidden="true" {...traco}>
    <path d="M8 50 C28 16 52 24 60 46 C68 24 92 16 112 50 C92 42 72 50 60 64 C48 50 28 42 8 50 Z" />
  </svg>
);

export const Nuvem: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 90" className={className} aria-hidden="true" {...traco}>
    <path d="M30 72 H88 C102 72 108 56 94 50 C94 34 72 28 64 42 C54 32 34 38 38 54 C22 54 18 72 30 72 Z" />
  </svg>
);

export const Bussola: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...traco}>
    <circle cx="50" cy="50" r="40" />
    <path d="M50 18 L58 50 L50 82 L42 50 Z" />
    <path d="M50 6 V12 M50 88 V94 M6 50 H12 M88 50 H94" />
  </svg>
);

export const Montanha: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 100" className={className} aria-hidden="true" {...traco}>
    <path d="M6 88 L42 30 L60 58 L74 40 L114 88 Z" />
    <path d="M32 46 L42 30 L52 44 L46 42 L42 49 L37 42 Z" />
  </svg>
);

export const Trilha: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 110" className={className} aria-hidden="true" {...traco}>
    <path d="M24 102 C14 70 80 74 68 48 C60 30 36 36 44 18" strokeDasharray="3 7" />
    <circle cx="44" cy="12" r="6" />
  </svg>
);

export const Livro: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 110 100" className={className} aria-hidden="true" {...traco}>
    <path d="M8 22 C24 16 42 18 55 28 V86 C42 78 24 76 8 82 Z" />
    <path d="M102 22 C86 16 68 18 55 28 V86 C68 78 86 76 102 82 Z" />
  </svg>
);

export const Coruja: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 110" className={className} aria-hidden="true" {...traco}>
    <path d="M22 24 L30 36 C40 30 60 30 70 36 L78 24 L80 58 C80 90 66 102 50 102 C34 102 20 90 20 58 Z" />
    <circle cx="38" cy="52" r="10" /><circle cx="62" cy="52" r="10" />
    <circle cx="38" cy="52" r="3" /><circle cx="62" cy="52" r="3" />
    <path d="M50 60 L46 70 L54 70 Z" />
  </svg>
);

export const Vela: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 60 120" className={className} aria-hidden="true" {...traco}>
    <path d="M30 6 C40 20 42 28 30 36 C18 28 20 20 30 6 Z" />
    <path d="M30 36 V46 M20 46 H40 V104 H20 Z M12 104 H48" />
  </svg>
);

export const SIMBOLOS: Record<string, React.FC<{ className?: string }>> = {
  margarida: Margarida, pomba: Pomba, nuvem: Nuvem, bussola: Bussola, montanha: Montanha,
  trilha: Trilha, livro: Livro, coruja: Coruja, vela: Vela,
  mascara: Mascara, chapeu: Chapeu, confete: Confete, casa: Casa, maos: Maos, cafe: Cafe,
  espada: Espada, escudo: Escudo, sol: Sol, estrela: Estrela, lua: Lua, olho: Olho,
  corrente: CorrenteQuebrada, chama: Chama, raio: Raio, coroa: Coroa, cetro: Cetro, torre: Torre,
  coracao: Coracao, rosa: Rosa, aneis: Aneis,
};

// Estrada em perspectiva, ilustração provisória até existir a foto de costas.
export const EstradaProvisoria: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="jr-ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b0b0d" />
        <stop offset="1" stopColor="#5a5a60" />
      </linearGradient>
      <linearGradient id="jr-chao" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2a2e" />
        <stop offset="1" stopColor="#0a0a0b" />
      </linearGradient>
    </defs>
    <rect width="400" height="700" fill="url(#jr-ceu)" />
    <path d="M0 300 L70 270 L130 292 L200 250 L270 288 L330 266 L400 296 V330 H0Z" fill="#17171a" />
    <rect y="320" width="400" height="380" fill="url(#jr-chao)" />
    <path d="M188 320 L212 320 L420 700 H-20Z" fill="#1d1d21" />
    {[0, 1, 2, 3, 4].map((i) => {
      const y = 340 + i * i * 14 + i * 22;
      const h = 8 + i * 9;
      const w = 2 + i * 2;
      return <rect key={i} x={200 - w / 2} y={y} width={w} height={h} fill="#8a8a90" opacity={0.5 + i * 0.1} />;
    })}
    {/* silhueta de costas */}
    <g fill="#050506">
      <circle cx="200" cy="430" r="11" />
      <path d="M182 446 Q200 438 218 446 L224 520 H176Z" />
      <rect x="182" y="518" width="14" height="62" />
      <rect x="204" y="518" width="14" height="62" />
    </g>
  </svg>
);
