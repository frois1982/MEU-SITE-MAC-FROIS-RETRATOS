
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Phone, MapPin, Camera, Youtube, Check, Loader2, MessageCircle, FlaskConical } from 'lucide-react';

interface LayoutProps { children: React.ReactNode; }

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  type NavItem = { name: string; path: string; children?: { name: string; path: string }[] };
  const navLinks: NavItem[] = [
    { name: 'Início', path: '/' },
    { name: 'Portfólio', path: '/portfolio' },
    { name: 'Retratos', path: '', children: [
      { name: 'Corporativo', path: '/fotografo-corporativo-florianopolis' },
      { name: 'Família', path: '/ensaio-de-familia-florianopolis' },
      { name: 'Casal', path: '/ensaio-de-casal-florianopolis' },
      { name: 'Família na praia', path: '/ensaio-de-familia-na-praia-florianopolis' },
    ] },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contato', path: '/contato' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/95 backdrop-blur-sm py-4 border-b border-zinc-900' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-2xl font-serif tracking-tighter text-white uppercase group">
          <img src="/logo-fs.png" alt="Estúdio Frois" width="26" height="40" className="h-9 w-auto" />
          <span>MAC <span className="text-gold-500 group-hover:text-gold-400 transition-colors">FROIS</span></span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => link.children ? (
            <div key={link.name} className="relative group">
              <button type="button" className={`text-[11px] uppercase tracking-[0.25em] hover:text-gold-500 transition-colors inline-flex items-center gap-1 ${link.children.some(c => c.path === location.pathname) ? 'text-gold-500 font-bold' : 'text-zinc-400'}`}>
                {link.name} <span aria-hidden className="text-[8px]">▾</span>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 hidden group-hover:block group-focus-within:block">
                <div className="bg-zinc-950 border border-zinc-800 py-3 min-w-[220px] shadow-xl">
                  {link.children.map((c) => (
                    <Link key={c.path} to={c.path} className={`block px-6 py-3 text-[11px] uppercase tracking-[0.25em] hover:text-gold-500 hover:bg-zinc-900 transition-colors ${location.pathname === c.path ? 'text-gold-500 font-bold' : 'text-zinc-400'}`}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link key={link.path} to={link.path} className={`text-[11px] uppercase tracking-[0.25em] hover:text-gold-500 transition-colors ${location.pathname === link.path ? 'text-gold-500 font-bold' : 'text-zinc-400'}`}>
              {link.name}
            </Link>
          ))}
          {/* Botão LAB removido daqui para privacidade */}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-zinc-950 border-t border-zinc-900 animate-fade-in">
          <div className="flex flex-col py-8 px-6 space-y-6">
            {navLinks.map((link) => link.children ? (
              <div key={link.name} className="flex flex-col items-center space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">{link.name}</span>
                {link.children.map((c) => (
                  <Link key={c.path} to={c.path} className="text-lg font-serif text-center text-zinc-300 hover:text-gold-500 uppercase tracking-widest">
                    {c.name}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={link.path} to={link.path} className="text-lg font-serif text-center text-zinc-300 hover:text-gold-500 uppercase tracking-widest">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nome: '' })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-fs.png" alt="Estúdio Frois" width="31" height="48" className="h-12 w-auto" />
              <h3 className="text-2xl font-serif text-white tracking-widest">MAC FROIS</h3>
            </div>
            <p className="text-zinc-500 mb-6 max-w-xs leading-relaxed font-light text-sm">
              RETRATISTA ESPECIALIZADO EM POSICIONAMENTO E AUTORIDADE VISUAL. ONDE A VERDADE ENCONTRA A ESTRATÉGIA.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/froisretratista/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-500 hover:border-gold-500 transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com/@macfroiss" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-500 hover:border-gold-500 transition-all">
                <Youtube size={18} />
              </a>
              <a href="mailto:frois.mac@gmail.com" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-gold-500 hover:border-gold-500 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6 tracking-widest">O ESTÚDIO</h4>
            <ul className="space-y-4 text-zinc-400 font-light text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-gold-600" />
                <span>RUA FÚLVIO ADUCCI<br />ESTREITO, FLORIANÓPOLIS - SC</span>
              </li>
              <li>
                <Link to="/fotografo-corporativo-florianopolis" className="hover:text-gold-500 transition-colors underline underline-offset-4 decoration-zinc-700">FOTÓGRAFO CORPORATIVO EM FLORIANÓPOLIS</Link>
              </li>
              <li>
                <Link to="/ensaio-de-familia-florianopolis" className="hover:text-gold-500 transition-colors underline underline-offset-4 decoration-zinc-700">ENSAIO DE FAMÍLIA EM FLORIANÓPOLIS</Link>
              </li>
              <li>
                <Link to="/ensaio-de-casal-florianopolis" className="hover:text-gold-500 transition-colors underline underline-offset-4 decoration-zinc-700">ENSAIO DE CASAL EM FLORIANÓPOLIS</Link>
              </li>
              <li>
                <Link to="/ensaio-de-familia-na-praia-florianopolis" className="hover:text-gold-500 transition-colors underline underline-offset-4 decoration-zinc-700">ENSAIO DE FAMÍLIA NA PRAIA</Link>
              </li>
              <li>
                <Link to="/fotografo-para-advogados-florianopolis" className="hover:text-gold-500 transition-colors underline underline-offset-4 decoration-zinc-700">FOTO PARA ADVOGADOS</Link>
              </li>
              <li>
                <Link to="/fotografo-para-medicos-florianopolis" className="hover:text-gold-500 transition-colors underline underline-offset-4 decoration-zinc-700">FOTO PARA MÉDICOS</Link>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-gold-600" />
                <span>(48) 99623-1894</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-gold-600" />
                <a href="mailto:frois.mac@gmail.com" className="hover:text-gold-500 transition-colors">FROIS.MAC@GMAIL.COM</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif text-lg mb-6 tracking-widest">NEWSLETTER</h4>
            <p className="text-zinc-500 mb-4 text-xs tracking-widest uppercase">CONTEÚDO EXCLUSIVO SOBRE IMAGEM.</p>
            <form onSubmit={handleNewsletter} className="flex">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="SEU MELHOR E-MAIL" 
                className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-gold-600 w-full rounded-l-sm text-xs font-light tracking-widest" 
              />
              <button 
                type="submit"
                disabled={status !== 'idle'}
                className={`${status === 'success' ? 'bg-green-600' : 'bg-gold-600 hover:bg-gold-500'} text-black px-5 py-3 rounded-r-sm font-bold transition-colors min-w-[70px] flex items-center justify-center text-xs tracking-[0.2em]`}
              >
                {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : status === 'success' ? <Check size={16} /> : 'OK'}
              </button>
            </form>
            {status === 'success' && <p className="text-gold-500 text-[10px] mt-2 animate-fade-in tracking-widest">INSCRIÇÃO REALIZADA.</p>}
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] tracking-[0.2em] uppercase relative">
          <p>&copy; {new Date().getFullYear()} MAC FROIS. TODOS OS DIREITOS RESERVADOS. 
            <Link to="/admin" className="ml-4 opacity-10 hover:opacity-100 hover:text-gold-500 transition-all cursor-default">PAINEL</Link>
          </p>
          <div className="flex items-center mt-4 md:mt-0 italic opacity-50">
             <Camera size={12} className="mr-2" />
             <span>A verdade é o único filtro que importa.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppFAB: React.FC = () => {
  const whatsappUrl = "https://wa.me/5548996231894?text=Olá%20Mac,%20vi%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20retratos%20de%20posicionamento.";
  
  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 group"
    >
      <span className="bg-white text-zinc-900 px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-2xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block">
        Falar com Mac
      </span>
      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:bg-[#25D366]/90 transition-all hover:scale-110 active:scale-95 animate-bounce-slow">
        <MessageCircle size={28} />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      </div>
    </a>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-0">{children}</main>
      <WhatsAppFAB />
      <Footer />
    </div>
  );
};
