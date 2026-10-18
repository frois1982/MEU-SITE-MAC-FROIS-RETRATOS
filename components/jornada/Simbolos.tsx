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

export const SIMBOLOS: Record<string, React.FC<{ className?: string }>> = {
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
