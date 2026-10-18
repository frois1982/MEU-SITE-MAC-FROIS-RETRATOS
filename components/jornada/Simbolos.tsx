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
