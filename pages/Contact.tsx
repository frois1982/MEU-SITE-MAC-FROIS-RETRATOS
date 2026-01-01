
import React, { useState } from 'react';
import { SectionTitle, Button, Card } from '../components/UI';
import { Mail, Phone, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    projeto: 'Projeto Van Gogh',
    mensagem: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Integração Real com seu Formspree: xykzkago
    try {
      const response = await fetch('https://formspree.io/f/xykzkago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.nome,
          Phone: formData.telefone,
          Email: formData.email,
          Project: formData.projeto,
          Message: formData.mensagem
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        alert('Ocorreu um erro ao enviar. Por favor, tente novamente ou use o WhatsApp.');
        setStatus('idle');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="pt-32 pb-24 bg-black min-h-screen flex items-center">
        <div className="container mx-auto px-6 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-600/20 rounded-full mb-8 text-gold-500">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-serif text-white mb-4">MENSAGEM ENVIADA</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-10 text-lg font-light">
            Obrigado por iniciar seu processo de posicionamento, {formData.nome.split(' ')[0]}. Analisaremos seu perfil em breve.
          </p>
          <Button onClick={() => setStatus('idle')} variant="outline">Enviar Nova Mensagem</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Fale Conosco" subtitle="O RETRATO COMO ATIVO ESTRATÉGICO" />
        
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="animate-fade-in">
            <h3 className="text-3xl font-serif text-white mb-6">ESTÚDIO MAC FROIS</h3>
            <p className="text-zinc-400 mb-10 leading-relaxed text-lg font-light tracking-wide">
              Um ambiente projetado para capturar a autoridade que você já possui.
              Atendimento exclusivo mediante agendamento.
            </p>
            
            <div className="space-y-8 mb-10">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center text-gold-500 mr-4 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1 text-sm tracking-widest">LOCALIZAÇÃO</h4>
                  <p className="text-zinc-500 text-sm font-light">Rua Fúlvio Aducci, 757, Sala 201<br/>Estreito, Florianópolis - SC</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center text-gold-500 mr-4 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1 text-sm tracking-widest">EMAIL</h4>
                  <a href="mailto:frois.mac@gmail.com" className="text-zinc-500 text-sm hover:text-gold-500 transition-colors font-light">frois.mac@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center text-gold-500 mr-4 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1 text-sm tracking-widest">TELEFONE</h4>
                  <p className="text-zinc-500 text-sm font-light">(48) 99623-1894</p>
                </div>
              </div>
            </div>

            <div className="w-full h-64 bg-zinc-900 rounded-sm overflow-hidden relative grayscale opacity-40 hover:opacity-100 transition-all duration-700">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.845941913406!2d-48.58332465!3d-27.5960013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527386000c010c9%3A0xa648834d8d1e3450!2sRua%20F%C3%BAlvio%20Aducci%2C%20757%20-%20Estreito%2C%20Florian%C3%B3polis%20-%20SC%2C%2088075-001!5e0!3m2!1spt-BR!2sbr!4v1698712345678!5m2!1spt-BR!2sbr" 
                 width="100%" 
                 height="100%" 
                 style={{border:0}} 
                 allowFullScreen={true} 
                 loading="lazy"
                 title="Localização Estúdio"
               ></iframe>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-zinc-900/30 border-zinc-800 backdrop-blur-sm">
            <h3 className="text-2xl font-serif text-white mb-8 text-center lg:text-left">SOLICITE UM ORÇAMENTO</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">NOME COMPLETO</label>
                  <input 
                    type="text" 
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none transition-colors rounded-sm text-sm font-light" 
                    placeholder="DIGITE SEU NOME" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">TELEFONE / WHATSAPP</label>
                  <input 
                    type="text" 
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none transition-colors rounded-sm text-sm font-light" 
                    placeholder="(48) 9XXXX-XXXX" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">EMAIL PROFISSIONAL</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none transition-colors rounded-sm text-sm font-light" 
                  placeholder="EXEMPLO@EMAIL.COM" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">PROJETO DE INTERESSE</label>
                <select 
                  name="projeto"
                  value={formData.projeto}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none transition-colors rounded-sm appearance-none text-sm font-light"
                >
                  <option>Projeto Van Gogh</option>
                  <option>Projeto Da Vinci</option>
                  <option>Projeto Apolo 360º</option>
                  <option>Mentoria / Digital</option>
                  <option>Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">OBJETIVO DA IMAGEM</label>
                <textarea 
                  name="mensagem"
                  required
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={4} 
                  className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-gold-600 outline-none transition-colors rounded-sm text-sm font-light" 
                  placeholder="DESCREVA A MENSAGEM QUE DESEJA TRANSMITIR"
                ></textarea>
              </div>

              <Button 
                type="submit" 
                className="w-full shadow-lg flex items-center justify-center py-5 tracking-[0.3em]"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ENVIANDO...
                  </>
                ) : 'ENVIAR SOLICITAÇÃO'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
