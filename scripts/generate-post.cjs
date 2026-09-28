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
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/CORP_Empresario.jpg_21_bjqwpc',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/CORP_Empresario.jpg_8_nxkkrn',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/CORP_Empresario.jpg_15_HOME_m6bzke',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/PORT_RetratoMulher.jpg_tdfex5',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/PORT_RetratoMulher.jpg_4_k2hva7',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/PORT_RetratoMulher.jpg_15_rkn23u',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/ART_Conceito.jpg_7_m4gl6u',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/ART_Conceito.jpg_25_hku7p9',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/ART_Conceito.jpg_20_a45w8y',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/EU4A6541_ztrudm',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/EU4A6402_joygri',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/EU4A6476_bqdogp',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/13062026-EU4A8850_tud2ed',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/EU4A6345_jaf2v8',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/1000380124.jpg_dmperd.jpg',
    // 'CORP_Empresario.jpg' etc acima — removido: '1000057474.jpg_s86ppk' (retornava 404 no Cloudinary, causou post sem imagem em 25/09/2026)

    // ===== TEMPORADA 2 (out/2026 em diante) =====
    // Imagens em blog/temporada-2/, Public ID = nome do arquivo (sem sufixo aleatório),
    // pareadas 1:1 pelo índice com TOPICOS_TEMPORADA_2 abaixo.
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/01-foto-perfil-ia-ou-fotografo-profissional',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/02-estudio-fotografico-florianopolis-como-escolher',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/03-ensaio-fotografico-profissional-o-que-esperar',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/04-quando-trocar-foto-de-perfil-profissional',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/05-personal-branding-o-que-e',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/06-fotografo-para-corretores-de-imoveis',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/07-coaches-e-mentores-fotografia-autoridade',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/08-prazo-fotos-profissionais-de-qualidade',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/09-perguntas-frequentes-retrato-corporativo',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/10-fotografia-corporativa-x-fotografia-comum',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/11-como-se-preparar-para-ensaio-de-retratos',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/12-iluminacao-e-imagem-profissional',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/13-depoimentos-reais-metodo-frois',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/14-vale-a-pena-investir-em-fotografia-profissional',
    'https://res.cloudinary.com/dlahvdclb/image/upload/q_auto,f_auto,w_1200,h_630,c_fill,g_face/15-como-usar-fotos-profissionais-nas-redes',
  ];

const TOPICOS_TEMPORADA_1 = [
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

// ===== TEMPORADA 2 (out/2026 em diante) =====
// Tópicos pesquisados a partir de dados reais do Search Console + pesquisa de concorrência,
// pareados 1:1 pelo índice com as últimas 15 posições de IMAGENS acima.
const TOPICOS_TEMPORADA_2 = [
  { titulo_base: 'Foto de perfil feita por IA ou por fotógrafo profissional: qual realmente funciona', keyword_principal: 'foto de perfil profissional ou IA', keywords: ['foto de perfil gerada por IA', 'ia vs fotografo profissional', 'foto de perfil linkedin IA'], angulo: 'comparação e critérios de decisão' },
  { titulo_base: 'Como escolher um estúdio fotográfico em Florianópolis', keyword_principal: 'estúdio fotográfico Florianópolis', keywords: ['melhor estúdio fotográfico florianopolis', 'estudio de fotografia estreito', 'fotografo profissional florianopolis'], angulo: 'guia de decisão local' },
  { titulo_base: 'O que esperar de um ensaio fotográfico profissional', keyword_principal: 'ensaio fotográfico profissional', keywords: ['como funciona um ensaio fotografico', 'primeira sessão de fotos profissional', 'o que levar no ensaio fotografico'], angulo: 'guia passo a passo' },
  { titulo_base: 'Quando é hora de trocar sua foto de perfil profissional', keyword_principal: 'trocar foto de perfil profissional', keywords: ['foto de perfil desatualizada', 'quando atualizar foto linkedin', 'foto de perfil antiga'], angulo: 'sinais de alerta e ação' },
  { titulo_base: 'O que é personal branding e por que ele começa pela sua imagem', keyword_principal: 'o que é personal branding', keywords: ['personal branding imagem pessoal', 'marca pessoal o que é', 'personal branding fotografia'], angulo: 'conceito e aplicação prática' },
  { titulo_base: 'Por que corretores de imóveis precisam de fotos profissionais', keyword_principal: 'fotógrafo para corretor de imóveis', keywords: ['foto profissional corretor de imoveis', 'imagem corretor de imoveis', 'fotografo imobiliario florianopolis'], angulo: 'nicho específico e ROI' },
  { titulo_base: 'Fotografia de autoridade para coaches e mentores', keyword_principal: 'fotógrafo para coaches e mentores', keywords: ['foto profissional coach', 'imagem de autoridade mentor', 'fotografo para infoprodutor'], angulo: 'nicho específico' },
  { titulo_base: 'Quanto tempo leva para ter fotos profissionais de qualidade', keyword_principal: 'prazo entrega fotos profissionais', keywords: ['prazo ensaio fotografico', 'quanto tempo demora tratamento de fotos', 'entrega de fotos profissionais'], angulo: 'educação e transparência' },
  { titulo_base: 'Perguntas frequentes sobre retrato corporativo', keyword_principal: 'dúvidas retrato corporativo', keywords: ['faq retrato corporativo', 'perguntas sobre ensaio corporativo', 'duvidas fotografia profissional'], angulo: 'formato FAQ' },
  { titulo_base: 'Fotografia corporativa x fotografia comum: qual a diferença', keyword_principal: 'fotografia corporativa x fotografia comum', keywords: ['diferença foto profissional e foto amadora', 'o que é fotografia corporativa', 'fotografia comercial x pessoal'], angulo: 'comparação técnica' },
  { titulo_base: 'Como se preparar para um ensaio de retratos', keyword_principal: 'como se preparar para ensaio de retratos', keywords: ['preparação ensaio fotografico', 'dicas antes do ensaio de fotos', 'como chegar bem no ensaio'], angulo: 'guia prático' },
  { titulo_base: 'Como a iluminação influencia sua imagem profissional', keyword_principal: 'iluminação fotografia profissional', keywords: ['importancia da iluminação em fotos', 'luz natural x estudio', 'iluminação retrato corporativo'], angulo: 'técnica e resultado' },
  { titulo_base: 'Depoimentos reais de quem passou pelo Método Frois', keyword_principal: 'depoimentos Método Frois', keywords: ['resultado metodo frois', 'cliente metodo frois', 'avaliação estudio frois'], angulo: 'prova social' },
  { titulo_base: 'Vale a pena investir em fotografia profissional', keyword_principal: 'vale a pena fotografia profissional', keywords: ['investimento em fotografia profissional', 'retorno ensaio fotografico', 'vale a pena foto corporativa'], angulo: 'educação e ROI' },
  { titulo_base: 'Como usar fotos profissionais nas redes sociais', keyword_principal: 'fotos profissionais redes sociais', keywords: ['como usar foto profissional instagram', 'imagem redes sociais profissional', 'fotos para linkedin e instagram'], angulo: 'guia prático' },
];

const TOPICOS = [...TOPICOS_TEMPORADA_1, ...TOPICOS_TEMPORADA_2];

function gerarSlug(titulo) {
    const slug = titulo
      .toLowerCase()
      .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    if (slug.length <= 100) return slug;

    const cortado = slug.substring(0, 100);
    const ultimoHifen = cortado.lastIndexOf('-');
    return ultimoHifen > 60 ? cortado.substring(0, ultimoHifen) : cortado;
}

function gerarId() {
  return 'POST-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function dataHoje() {
  return new Date().toLocaleDateString('pt-BR');
}

// Seleção calculada, não aleatória: TOPICOS[i] sempre é publicado com IMAGENS[i].
// Percorre a lista em ordem e usa o primeiro tópico cujo título ainda não foi publicado.
// Se todos os tópicos já foram usados (fila esgotada), recomeça o ciclo em ordem
// (postsExistentes.length % TOPICOS.length) em vez de sortear.
function escolherProximoPar(postsExistentes) {
  const titulosUsados = postsExistentes.map(p => p.title);
  let index = TOPICOS.findIndex(t => !titulosUsados.includes(t.titulo_base));
  if (index === -1) index = postsExistentes.length % TOPICOS.length;
  return { topico: TOPICOS[index], imageUrl: IMAGENS[index] };
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

function slugUnico(slugBase, postsDir) {
  let slug = slugBase;
  let sufixo = 2;
  while (fs.existsSync(path.join(postsDir, `${slug}.json`))) {
    slug = `${slugBase}-${sufixo}`;
    sufixo++;
  }
  return slug;
}

function salvarPost(id, slugBase, topico, conteudo, imageUrl, data) {
  const postsDir = path.join(__dirname, '../public/posts');
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

  // Se já existe um post com esse slug (tópico repetido após esgotar a lista),
  // gera um slug único em vez de sobrescrever o post antigo.
  const slug = slugUnico(slugBase, postsDir);

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
  const { topico, imageUrl } = escolherProximoPar(index);
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
