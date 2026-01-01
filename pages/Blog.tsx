import React from 'react';
import { SectionTitle, Card } from '../components/UI';
import { BlogPost } from '../types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'A História do Retrato: De Pinturas a Pixels',
    excerpt: 'Como a necessidade humana de ser lembrado moldou a arte visual através dos séculos e como isso impacta a fotografia moderna.',
    date: '12 Out 2023',
    category: 'História',
    imageUrl: 'https://picsum.photos/id/250/800/400?grayscale'
  },
  {
    id: '2',
    title: 'Arquétipos na Construção de Imagem',
    excerpt: 'O Governante, O Criador, O Sábio. Como utilizar os arquétipos junguianos para dirigir uma sessão fotográfica de sucesso.',
    date: '05 Nov 2023',
    category: 'Técnica',
    imageUrl: 'https://picsum.photos/id/1062/800/400?grayscale'
  },
  {
    id: '3',
    title: 'Guia: Hospedando seu Site (Grátis vs Pago)',
    excerpt: 'Respondendo sua dúvida: Onde colocar seu site no ar? Diferenças entre Vercel/Netlify e servidores tradicionais como Hostinger.',
    date: 'Hoje',
    category: 'Tech',
    content: `
      <p class="mb-4">Para colocar este site (React) no ar com seu domínio <strong>macfrois.com.br</strong>, você tem ótimas opções modernas.</p>
      
      <h4 class="text-white text-lg mt-6 mb-2">1. Opções Gratuitas (Recomendadas para este projeto)</h4>
      <p class="mb-4">Para sites "Estáticos" ou "SPA" como este que criamos (sem banco de dados pesado), as melhores opções são <strong>Vercel</strong> ou <strong>Netlify</strong>.</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Custo:</strong> R$ 0,00 mensais para uso pessoal/portfólio.</li>
        <li><strong>Domínio:</strong> Você pode conectar seu domínio comprado (macfrois.com.br) gratuitamente neles.</li>
        <li><strong>Vantagem:</strong> Muito rápidos (CDN global) e fáceis de atualizar.</li>
      </ul>

      <h4 class="text-white text-lg mt-6 mb-2">2. Opções Pagas (Hostgator, Hostinger)</h4>
      <p class="mb-4">Geralmente cobram R$ 15-30/mês. Valem a pena apenas se você precisar de contas de e-mail profissionais (ex: contato@macfrois.com.br) integradas no mesmo painel, ou se for usar WordPress/PHP.</p>
      
      <h4 class="text-white text-lg mt-6 mb-2">Minha Sugestão:</h4>
      <p>Hospede o site na <strong>Vercel (Grátis)</strong> e use o Zoho Mail (Grátis) para ter seu e-mail profissional, ou pague o Google Workspace apenas pelo e-mail.</p>
    `,
    imageUrl: 'https://picsum.photos/id/0/800/400?grayscale'
  }
];

export const Blog: React.FC = () => {
  const [expandedPost, setExpandedPost] = React.useState<string | null>(null);

  return (
    <div className="pt-32 pb-24 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Jornal Visual" subtitle="Ideias e História" />
        
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <Card key={post.id} className="!p-0 overflow-hidden flex flex-col group hover:border-gold-600/50">
              <div className="h-64 overflow-hidden relative">
                 <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute top-4 left-4 bg-gold-600 text-black text-xs font-bold px-3 py-1 uppercase">{post.category}</div>
              </div>
              <div className="p-8 flex flex-col flex-grow bg-zinc-900">
                <div className="flex items-center text-zinc-500 text-xs mb-4 space-x-4">
                  <span className="flex items-center"><Calendar size={12} className="mr-1"/> {post.date}</span>
                  <span className="flex items-center"><Clock size={12} className="mr-1"/> 5 min ler</span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-gold-500 transition-colors">{post.title}</h3>
                
                {expandedPost === post.id ? (
                   <div className="text-zinc-400 text-sm leading-relaxed animate-fade-in">
                      {post.content ? <div dangerouslySetInnerHTML={{__html: post.content}} /> : <p>{post.excerpt}</p>}
                      <button 
                        onClick={() => setExpandedPost(null)}
                        className="mt-4 text-gold-500 text-sm hover:underline"
                      >
                        Fechar
                      </button>
                   </div>
                ) : (
                  <>
                    <p className="text-zinc-400 text-sm mb-6 flex-grow">{post.excerpt}</p>
                    <button 
                      onClick={() => setExpandedPost(post.content ? post.id : null)}
                      className="flex items-center text-white text-sm uppercase tracking-widest hover:text-gold-500 transition-colors mt-auto"
                    >
                      Ler Artigo <ArrowRight size={16} className="ml-2" />
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};