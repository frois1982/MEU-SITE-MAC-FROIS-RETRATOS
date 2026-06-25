'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
process.env.PYTHONIOENCODING = 'utf-8';
Buffer.prototype.toJSON = Buffer.prototype.toJSON;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY não definida');
  process.exit(1);
}

const IMAGENS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200',
  'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=1200',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200'
];

const TOPICOS = [
  { titulo_base: 'Como uma boa foto de perfil pode aumentar suas vendas', keyword_principal: 'foto de perfil profissional', keywords: ['foto perfil linkedin', 'foto profissional florianopolis', 'retrato corporativo'], angulo: 'cases e dados concretos' },
  { titulo_base: 'Presença digital: porque sua imagem online vale mais do que parece', keyword_principal: 'presença digital imagem', keywords: ['marca pessoal digital', 'imagem profissional online', 'posicionamento digital'], angulo: 'transformação e resultado' },
  { titulo_base: 'Quanto custa um fotógrafo corporativo em Florianópolis', keyword_principal: 'fotógrafo corporativo Florianópolis', keywords: ['preço ensaio corporativo', 'fotógrafo executivo florianopolis', 'valor sessão foto profissional'], angulo: 'educação e transparência' },
  { titulo_base: 'Como escolher o fotógrafo certo para sua marca pessoal', keyword_principal: 'fotógrafo marca pessoal', keywords: ['escolher fotógrafo profissional', 'fotógrafo executivos florianopolis', 'retrato marca pessoal'], angulo: 'guia prático' },
  { titulo_base: 'O que é posicionamento de imagem e por que executivos precisam disso', keyword_principal: 'posicionamento de imagem executivos', keywords: ['imagem pessoal profissional', 'marca pessoal executivo', 'autoridade imagem'], angulo: 'conceito e aplicação' },
  { titulo_base: 'Headshot para LinkedIn: como uma foto transforma seu perfil', keyword_principal: 'headshot LinkedIn Florianópolis', keywords: ['foto linkedin profissional', 'headshot executivo', 'foto perfil linkedin florianopolis'], angulo: 'resultado prático' },
  { titulo_base: 'Como preparar seu figurino para um ensaio de marca pessoal', keyword_principal: 'figurino ensaio fotográfico corporativo', keywords: ['roupa para foto profissional', 'figurino retrato corporativo', 'como se vestir para foto profissional'], angulo: 'guia passo a passo' },
  { titulo_base: 'Arquétipos de marca: como usar sua personalidade para atrair clientes', keyword_principal: 'arquétipos de marca pessoal', keywords: ['arquetipo marca', 'personalidade marca pessoal', 'identidade visual executivo'], angulo: 'metodologia Método Frois' },
  { titulo_base: 'Por que advogados e médicos precisam de fotos profissionais', keyword_principal: 'foto profissional advogado médico Florianópolis', keywords: ['fotógrafo profissionais liberais', 'retrato advogado florianopolis', 'foto médico profissional'], angulo: 'nicho específico' },
  { titulo_base: 'Fotografia de autoridade: o que diferencia uma foto comum de uma foto que vende', keyword_principal: 'fotografia de autoridade', keywords: ['foto que vende', 'retrato autoridade', 'imagem que atrai clientes'], angulo: 'técnica e resultado' },
  { titulo_base: 'Como empresários de Florianópolis estão usando retratos para fechar mais negócios', keyword_principal: 'retratos corporativos empresários Florianópolis', keywords: ['ensaio empresarial florianopolis', 'foto empresario', 'retrato corporativo resultado'], angulo: 'case local' },
  { titulo_base: 'Antes e depois: como uma sessão de retratos transforma a percepção de um profissional', keyword_principal: 'antes e depois retratos profissionais', keywords: ['transformação imagem profissional', 'sessão foto antes depois', 'resultado ensaio corporativo'], angulo: 'transformação visual' },
  { titulo_base: 'O erro mais comum que profissionais cometem com sua imagem nas redes sociais', keyword_principal: 'erro imagem profissional redes sociais', keywords: ['erros foto profissional instagram', 'imagem ruim redes sociais', 'como melhorar imagem online'], angulo: 'problema e solução' },
  { titulo_base: 'Podcast e imagem: como construir autoridade em vídeo e foto ao mesmo tempo', keyword_principal: 'podcast imagem autoridade', keywords: ['produção podcast florianopolis', 'imagem autoridade video', 'marca pessoal podcast'], angulo: 'sinergia de canais' },
  { titulo_base: 'Método Frois: a abordagem que une arquétipos, direção e fotografia estratégica', keyword_principal: 'Método Frois fotografia estratégica', keywords: ['metodo frois', 'fotografia arquétipos', 'direção comportamental fotografia'], angulo: 'apresentação da metodologia' }
];

function gerarSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80);
}

function gerarId() {
  return 'POST-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function dataHoje() {
  return new Date().toLocaleDateString('pt-BR');
}

function escolherTopico(postsExistentes) {
  const titulosUsados = postsExistentes.map(p => p.title);
  const disponiveis = TOPICOS.filter(t => !titulosUsados.includes(t.titulo_base));
  if (disponiveis.length === 0) return TOPICOS[Math.floor(Math.random() * TOPICOS.length)];
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

function escolherImagem(postsExistentes) {
  const usadas = postsExistentes.map(p => p.imageUrl);
  const disponiveis = IMAGENS.filter(i => !usadas.includes(i));
  if (disponiveis.length === 0) return IMAGENS[Math.floor(Math.random() * IMAGENS.length)];
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

function montarPrompt(topico) {
  return `Você é Mac Frois, fotógrafo especialista em retratos corporativos e posicionamento de imagem em Florianópolis, SC. Escreva um artigo de blog profissional em português brasileiro.

TEMA: ${topico.titulo_base}
KEYWORD PRINCIPAL: ${topico.keyword_principal}
KEYWORDS SECUNDÁRIAS: ${topico.keywords.join(', ')}
ÂNGULO: ${topico.angulo}

REGRAS OBRIGATÓRIAS:
1. Título exato: "${topico.titulo_base}"
2. Entre 600 e 900 palavras
3. Tom: profissional, direto, sem exageros
4. Mencione Florianópolis naturalmente ao longo do texto
5. Use a keyword principal nos primeiros 100 caracteres
6. Inclua subtítulos em MAIÚSCULAS seguidos de dois pontos
7. Sem markdown, sem asteriscos, sem hashtags — texto corrido
8. Finalize com um parágrafo de CTA mencionando o Método Frois e o WhatsApp (48) 99623-1894
9. Retorne APENAS o texto do artigo, sem comentários adicionais`;
}

function chamarAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.content[0].text);
        } catch (e) {
          reject(new Error('Erro ao parsear resposta: ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function carregarIndex() {
  const indexPath = path.join(__dirname, '../public/posts/index.json');
  if (!fs.existsSync(indexPath)) return [];
  return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
}

function salvarPost(id, slug, topico, conteudo, imageUrl, data) {
  const postsDir = path.join(__dirname, '../public/posts');
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

  const post = {
    id,
    slug,
    title: topico.titulo_base,
    date: data,
    imageUrl,
    keyword: topico.keyword_principal,
    excerpt: conteudo.substring(0, 200).replace(/\n/g, ' ') + '...',
    content: conteudo
  };
  fs.writeFileSync(path.join(postsDir, `${slug}.json`), JSON.stringify(post, null, 2), 'utf-8');

  const indexPath = path.join(__dirname, '../public/posts/index.json');
  const index = carregarIndex();
  index.unshift({ id, slug, title: topico.titulo_base, date: data, imageUrl, keyword: topico.keyword_principal, excerpt: post.excerpt });
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');

  console.log(`Post salvo: public/posts/${slug}.json`);
}

async function main() {
  console.log('Iniciando geração de post...');
  const index = carregarIndex();
  const topico = escolherTopico(index);
  const imageUrl = escolherImagem(index);
  const id = gerarId();
  const slug = gerarSlug(topico.titulo_base);
  const data = dataHoje();

  console.log(`Tópico: ${topico.titulo_base}`);
  const prompt = montarPrompt(topico);
  const conteudo = await chamarAPI(prompt);
  salvarPost(id, slug, topico, conteudo, imageUrl, data);
  console.log('Concluído.');
}

main().catch(err => { console.error(err); process.exit(1); });
