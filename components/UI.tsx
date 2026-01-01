import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyle = "px-6 py-3 rounded-sm font-medium transition-all duration-300 tracking-wide uppercase text-sm";
  
  const variants = {
    primary: "bg-gold-600 text-black hover:bg-gold-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]",
    secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
    outline: "border border-gold-600 text-gold-500 hover:bg-gold-600/10"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-12 text-center">
    {subtitle && <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold mb-2 block">{subtitle}</span>}
    <h2 className="text-3xl md:text-5xl text-white italic">{title}</h2>
    <div className="w-16 h-0.5 bg-gold-600 mx-auto mt-6"></div>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 hover:border-gold-600/50 transition-colors duration-300 ${className}`}>
    {children}
  </div>
);