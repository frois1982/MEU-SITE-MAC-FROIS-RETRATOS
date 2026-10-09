'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
process.env.PYTHONIOENCODING = 'utf-8';
Buffer.prototype.toJSON = Buffer.prototype.toJSON;

const { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '..');
const POSTS_DIR = process.env.POSTS_DIR || path.join(ROOT, 'public/posts');
const MODELO = process.env.BLOG_MODEL || 'claude-haiku-4-5-20251001';
const MOCK_ARTICLE = process.env.MOCK_ARTICLE || ''; // testes: lê o artigo de um arquivo em vez de chamar a API
const SKIP_NET = process.env.SKIP_NET === '1';       // testes: não faz requisições de rede

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY && !MOCK_ARTICLE) {
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
  { /* já publicado à mão em 05/10/2026 com as 4 avaliações reais do Google (o gerador não escreve depoimentos) */ titulo_base: 'Depoimentos reais de quem passou pelo Método Frois', keyword_principal: 'depoimentos Método Frois', keywords: ['resultado metodo frois', 'cliente metodo frois', 'avaliação estudio frois'], angulo: 'prova social' },
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
  return new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function semAcento(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Seleção calculada, não aleatória: TOPICOS[i] sempre é publicado com IMAGENS[i].
// Percorre a lista em ordem e usa o primeiro tópico ainda não publicado e não bloqueado.
// Tópicos com a marca "bloqueado" são pulados (ex.: dependem de material real que o gerador não pode inventar).
// Fila esgotada: recomeça em ordem entre os tópicos liberados.
function escolherProximoPar(postsExistentes) {
  const titulosUsados = new Set(postsExistentes.map(p => p.title));
  TOPICOS.forEach(t => {
    if (t.bloqueado && !titulosUsados.has(t.titulo_base)) {
      console.log(`Tópico pulado (bloqueado): ${t.titulo_base} — ${t.bloqueado}`);
    }
  });
  let index = TOPICOS.findIndex(t => !t.bloqueado && !titulosUsados.has(t.titulo_base));
  if (index === -1) {
    const livres = TOPICOS.map((t, i) => i).filter(i => !TOPICOS[i].bloqueado);
    index = livres[postsExistentes.length % livres.length];
  }
  return { topico: TOPICOS[index], imageUrl: IMAGENS[index] };
}

// ---------- Fontes de verdade (fatos do negócio, links permitidos) ----------

function carregarFatos() {
  let fatos = '';
  try {
    const llms = fs.readFileSync(path.join(ROOT, 'public/llms.txt'), 'utf-8');
    const m = llms.match(/## Dados do negócio\n([\s\S]*?)(\n## |$)/);
    if (m) fatos += m[1].trim() + '\n';
  } catch (e) { /* segue sem llms */ }
  try {
    const corp = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/fotografo-corporativo.json'), 'utf-8'));
    (corp.faq || []).forEach(f => { fatos += `- ${f.q} ${f.a}\n`; });
  } catch (e) { /* segue */ }
  return fatos.trim();
}

function carregarFontesExternas() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'data/fontes-externas.json'), 'utf-8')).fontes;
  } catch (e) { return []; }
}

const PAGINAS_INTERNAS = [
  ['/fotografo-corporativo-florianopolis', 'serviço de retrato corporativo e fotografia de autoridade'],
  ['/ensaio-de-familia-florianopolis', 'ensaio de família (pacotes Momento, Memória, Legado)'],
  ['/ensaio-de-casal-florianopolis', 'ensaio de casal (pacotes Momento, Memória, Legado)'],
  ['/ensaio-de-familia-na-praia-florianopolis', 'ensaio de família na praia (Praia do Forte, Campeche, Jurerê, Guarda do Embaú, Praia do Maço)'],
  ['/fotografo-para-advogados-florianopolis', 'foto profissional para advogados'],
  ['/fotografo-para-medicos-florianopolis', 'foto profissional para médicos'],
  ['/portfolio', 'portfólio de fotos'],
  ['/servicos', 'projetos e pacotes'],
  ['/contato', 'contato'],
  ['/blog', 'lista de artigos']
];
const LINKS_DIRETOS = [
  'https://wa.me/5548996231894',
  'https://instagram.com/froisretratista',
  'https://youtube.com/@macfroiss'
];

function montarPermitidos(index) {
  const internos = new Map(PAGINAS_INTERNAS);
  index.forEach(p => internos.set('/blog/' + p.slug, 'artigo: ' + p.title));
  return internos;
}

// ---------- Prompt ----------

function montarPrompt(topico, fatos, internos, fontes, erros) {
  const listaInternos = [...internos.entries()].map(([h, d]) => `- ${h} → ${d}`).join('\n');
  const listaExternos = fontes.map(f => `- ${f.url} → ${f.titulo}: ${f.tema}`).join('\n');
  const correcao = erros && erros.length
    ? `\nATENÇÃO — a tentativa anterior foi REPROVADA pelos motivos abaixo. Corrija TODOS:\n${erros.map(e => '- ' + e).join('\n')}\n`
    : '';
  return `Você é Mac Frois, fotógrafo especialista em retratos corporativos e posicionamento de imagem em Florianópolis, SC. Escreva um artigo de blog em português brasileiro, em primeira pessoa, tom profissional e direto.

TEMA: ${topico.titulo_base}
KEYWORD PRINCIPAL: ${topico.keyword_principal}
KEYWORDS SECUNDÁRIAS: ${topico.keywords.join(', ')}
ÂNGULO: ${topico.angulo}
${correcao}
FATOS SOBRE O NEGÓCIO (única fonte para dados do estúdio, preços, prazos, formas de pagamento):
${fatos}

REGRA MAIS IMPORTANTE — NÃO INVENTE NADA:
- Não invente números, porcentagens, estatísticas, estudos, pesquisas, datas, leis, resoluções ou prazos.
- Não invente clientes, casos, depoimentos ou histórias ("uma cliente me contou…" é proibido).
- Preços e prazos do estúdio só podem ser os que constam em FATOS acima, copiados exatamente.
- Se não tiver certeza de um fato, não o escreva. Prefira princípios, orientações práticas e a experiência de fotografar, que não dependem de dado externo.

FORMATO (markup simples, sem HTML):
- "## Título" para seções, "### Título" para subseções (títulos curtos, em caso de frase, sem dois pontos no fim).
- Links no formato [texto](endereço). Só use endereços das listas abaixo, copiados exatamente. Nenhum outro endereço é permitido.
- Listas com "- ". Negrito com **texto**. Citação com "> ".
- Não use imagens, tabelas, HTML nem hashtags. A foto de abertura é inserida automaticamente.

LINKS INTERNOS PERMITIDOS (use de 3 a 6, no meio de frases naturais, com texto âncora descritivo; inclua ao menos um da página de serviço e, se fizer sentido, outros artigos do blog):
${listaInternos}
Também permitidos: https://wa.me/5548996231894 (WhatsApp), https://instagram.com/froisretratista, https://youtube.com/@macfroiss

FONTES EXTERNAS PERMITIDAS (use de 2 a 4, apenas as que tiverem relação real com a frase; não force):
${listaExternos}

ESTRUTURA OBRIGATÓRIA DA RESPOSTA, exatamente com estes marcadores, nesta ordem:
RESUMO: <uma frase de 110 a 160 caracteres, que contenha a keyword principal e diga do que trata o artigo>
===CORPO===
<parágrafo de abertura, com a keyword principal nos primeiros 100 caracteres>

> **Resposta rápida:** <2 a 3 frases que respondem direto ao tema do título>

## <de 4 a 6 seções, cada uma com um ou mais parágrafos; use listas e ### quando ajudar o leitor>
...
## <última seção: convite para conversar, citando o Método Frois, com link para o WhatsApp>
===FAQ===
P: <pergunta que um leitor faria no Google sobre o tema>
R: <resposta direta de 25 a 70 palavras>
(de 4 a 6 pares P/R, cada P e cada R em uma única linha)

REQUISITOS: corpo entre 900 e 1400 palavras; mencione Florianópolis naturalmente; termine o corpo com a seção de convite (WhatsApp (48) 99623-1894). Responda APENAS no formato acima, sem comentários.`;
}

// ---------- API ----------

function chamarAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODELO,
      max_tokens: 8000,
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
          if (parsed.error) return reject(new Error('API: ' + JSON.stringify(parsed.error)));
          resolve(parsed.content.filter(c => c.type === 'text').map(c => c.text).join(''));
        } catch (e) {
          reject(new Error('Erro ao parsear resposta: ' + data.slice(0, 500)));
        }
      });
    });
    req.setTimeout(180000, () => req.destroy(new Error('timeout na API')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ---------- Rede (checagem de URLs) ----------

function statusHttp(url, metodo = 'HEAD', saltos = 0) {
  return new Promise((resolve) => {
    let u;
    try { u = new URL(url); } catch (e) { return resolve(0); }
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: metodo,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FroisBlogBot/1.0; +https://www.macfrois.com.br)' }
    }, (res) => {
      res.resume();
      const loc = res.headers.location;
      if (res.statusCode >= 300 && res.statusCode < 400 && loc && saltos < 4) {
        return resolve(statusHttp(new URL(loc, url).toString(), metodo, saltos + 1));
      }
      if ((res.statusCode === 405 || res.statusCode === 403) && metodo === 'HEAD') {
        return resolve(statusHttp(url, 'GET', saltos));
      }
      resolve({ status: res.statusCode, tipo: res.headers['content-type'] || '' });
    });
    req.setTimeout(15000, () => { req.destroy(); resolve(0); });
    req.on('error', () => resolve(0));
    req.end();
  });
}

async function urlOk(url, exigirImagem) {
  const r = await statusHttp(url);
  if (!r || r.status !== 200) return false;
  return exigirImagem ? /^image\//.test(r.tipo) : true;
}

// Anotações do GitHub Actions: aparecem no resumo da execução, mesmo sem abrir o log.
function anotar(nivel, titulo, msg) {
  const limpa = String(msg).replace(/%/g, '%25').replace(/\r/g, '').replace(/\n/g, '%0A').slice(0, 1800);
  console.log(`::${nivel} title=${titulo}::${limpa}`);
}

// ---------- Parsing e validação ----------

function extrairPartes(texto) {
  const m = texto.match(/RESUMO:\s*([^\n]+)\n+===CORPO===\n([\s\S]*?)\n===FAQ===\n([\s\S]*)$/);
  if (!m) throw new Error('Formato inesperado: marcadores RESUMO / ===CORPO=== / ===FAQ=== não encontrados');
  const faq = [];
  const linhas = m[3].split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < linhas.length; i++) {
    if (/^P:\s*/.test(linhas[i]) && /^R:\s*/.test(linhas[i + 1] || '')) {
      faq.push({ q: linhas[i].replace(/^P:\s*/, ''), a: linhas[i + 1].replace(/^R:\s*/, '') });
      i++;
    }
  }
  return { resumo: m[1].trim(), corpo: m[2].trim(), faq };
}

const contaPalavras = (t) => (t.replace(/[#>*\-\[\]()]/g, ' ').match(/\S+/g) || []).length;
const textoLimpo = (t) => t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
const norm = (s) => s.replace(/\s+/g, ' ');

const canon = (u) => { try { return decodeURI(u); } catch (e) { return u; } };

// Remove (mantendo o texto) qualquer link que não esteja nas listas permitidas.
// Links absolutos para o próprio site viram caminhos relativos; endereços externos são
// comparados na forma decodificada (acentos codificados ou não) e gravados na forma da lista.
function sanitizarLinks(texto, ctx, avisos) {
  texto = texto.replace(/\]\(https?:\/\/(?:www\.)?macfrois\.com\.br(\/[^)\s]*)?\)/g, (m, p) => `](${p || '/'})`);
  return texto.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (todo, rotulo, url) => {
    if (url.startsWith('#')) {
      if (ctx.ancoras.has(url.slice(1))) return todo;
      avisos.push(`âncora inexistente removida: ${url}`); return rotulo;
    }
    if (url.startsWith('/')) {
      const p = url.split('#')[0].replace(/\/$/, '') || '/';
      if (ctx.internos.has(p)) return `[${rotulo}](${url.includes('#') ? url.replace(/\/#/, '#') : p})`;
      avisos.push(`link interno fora da lista removido: ${url}`); return rotulo;
    }
    if (LINKS_DIRETOS.includes(url)) return todo;
    const oficial = ctx.externosCanon.get(canon(url));
    if (oficial) return `[${rotulo}](${oficial})`;
    avisos.push(`link externo fora da lista removido: ${url}`); return rotulo;
  });
}


// Garante links externos relevantes: se o modelo usou menos de 2, linka a primeira ocorrência de termos
// específicos (ex.: "LinkedIn", "arquétipo", "hora dourada") para páginas da lista permitida.
// Só age em parágrafos comuns, fora de links, títulos, citações e negrito.
function autoLinkExterno(corpo, fontes, minimo, maximo) {
  const jaUsados = new Set([...corpo.matchAll(/\]\((https:\/\/pt\.wikipedia[^)\s]*)\)/g)].map(m => canon(m[1])));
  let total = jaUsados.size;
  if (total >= minimo) return corpo;
  let linhas = corpo.split('\n');
  for (const f of fontes) {
    if (total >= maximo) break;
    if (!f.termos || !f.termos.length || jaUsados.has(canon(f.url))) continue;
    let feito = false;
    for (const termo of f.termos) {
      if (feito) break;
      const re = new RegExp('(^|[^\\p{L}*])(' + termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![\\p{L}*])', 'iu');
      linhas = linhas.map(l => {
        if (feito || /^\s*(#|>|!\[)/.test(l)) return l;
        const partes = l.split(/(\[[^\]]*\]\([^)]*\))/);
        for (let i = 0; i < partes.length && !feito; i += 2) {
          const m = partes[i].match(re);
          if (m) {
            partes[i] = partes[i].replace(re, `$1[$2](${f.url})`);
            feito = true;
          }
        }
        return partes.join('');
      });
    }
    if (feito) { total++; jaUsados.add(canon(f.url)); }
  }
  return linhas.join('\n');
}

function validarConteudo(partes, topico, ctx) {
  const erros = [];
  const avisos = [];
  let corpo = partes.corpo.split('\n').filter(l => !/^!\[/.test(l.trim())).join('\n');

  const { parseBlocks } = ctx.richtext;
  const ancoras = new Set(parseBlocks(corpo).filter(b => b.type === 'h2' || b.type === 'h3').map(b => b.id));
  ctx.ancoras = ancoras;
  corpo = sanitizarLinks(corpo, ctx, avisos);
  corpo = autoLinkExterno(corpo, ctx.fontes, 2, 3);
  const faq = partes.faq.map(f => ({ q: f.q, a: sanitizarLinks(f.a, ctx, avisos) }));

  if (/\uFFFD/.test(corpo + partes.resumo + JSON.stringify(faq))) erros.push('caractere corrompido (U+FFFD) no texto');
  const corpoSemUrls = corpo.replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, ' ').replace(/(^|\s)\/[a-z0-9\-\/#]+/gi, ' ');
  if (/\b(ejecutivo|empresario|fotografo|negocio)\b/i.test(corpoSemUrls)) erros.push('palavra em espanhol/sem acento no texto');
  const h2 = parseBlocks(corpo).filter(b => b.type === 'h2').length;
  if (h2 < 4) erros.push(`poucas seções "##" (${h2}); são necessárias de 4 a 6`);
  const palavras = contaPalavras(corpo);
  if (palavras < 800 || palavras > 1700) erros.push(`corpo com ${palavras} palavras; precisa ficar entre 900 e 1400`);
  if (faq.length < 4) erros.push(`FAQ com ${faq.length} pares; são necessários de 4 a 6, no formato P:/R: (uma linha cada)`);
  faq.forEach((f, i) => {
    const n = contaPalavras(f.a);
    if (n < 15 || n > 120) erros.push(`resposta ${i + 1} do FAQ com ${n} palavras; deve ter de 25 a 70`);
  });
  if (partes.resumo.length < 70 || partes.resumo.length > 175) erros.push(`RESUMO com ${partes.resumo.length} caracteres; deve ter de 110 a 160`);
  if (semAcento(partes.resumo).startsWith(semAcento(topico.titulo_base))) erros.push('RESUMO não pode começar repetindo o título do artigo; reescreva com outras palavras');
  const resumoNorm = semAcento(partes.resumo);
  const faltam = semAcento(topico.keyword_principal).split(/\s+/).filter(w => w.length > 3 && !resumoNorm.includes(w));
  if (faltam.length) erros.push(`RESUMO sem as palavras da keyword principal (${faltam.join(', ')})`);

  const internosUsados = [...corpo.matchAll(/\]\((\/[^)\s]*)\)/g)].length;
  const externosUsados = [...corpo.matchAll(/\]\((https:\/\/pt\.wikipedia[^)\s]*)\)/g)].length;
  if (internosUsados < 2) erros.push(`apenas ${internosUsados} link(s) interno(s) válidos; use de 3 a 6, somente da lista permitida`);
  if (externosUsados < 1) erros.push('nenhum link externo válido; use de 2 a 4 da lista de fontes permitidas, só quando fizer sentido');

  // Varredura de afirmações que o modelo não pode inventar.
  const tudo = norm(textoLimpo(partes.resumo + '\n' + corpo + '\n' + faq.map(f => f.q + ' ' + f.a).join('\n')));
  const fatos = norm(ctx.fatos);
  for (const m of tudo.matchAll(/R\$\s?(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?/g)) {
    if (!fatos.includes(m[0].replace(/\s/g, '')) && !fatos.includes(m[0])) erros.push(`preço "${m[0]}" não consta nos FATOS`);
  }
  for (const m of tudo.matchAll(/\d+(?:[.,]\d+)?\s?%/g)) erros.push(`porcentagem "${m[0]}" não é permitida (sem fonte)`);
  for (const m of tudo.matchAll(/\b(Lei|Resolução|Provimento|Decreto|Portaria|Artigo|Art\.)\s*(n[º°.]?\s*)?\d[\d./-]*/gi)) erros.push(`referência legal "${m[0]}" não é permitida (sem fonte)`);
  if (/(segundo|de acordo com|conforme)\s+(um|uma|o|a)?\s*(estudo|pesquisa|levantamento|relatório)/i.test(tudo) || /\b(estudos|pesquisas)\s+(mostram|apontam|indicam|revelam)/i.test(tudo)) {
    erros.push('citação de estudo/pesquisa sem fonte');
  }
  const anoAtual = new Date().getFullYear();
  for (const m of tudo.matchAll(/\b(19|20)\d{2}\b/g)) {
    if (![anoAtual, anoAtual + 1].includes(Number(m[0]))) erros.push(`ano "${m[0]}" não é permitido (sem fonte)`);
  }
  if (/(minha cliente|meu cliente|uma cliente|um cliente|certa vez|já atendi|recentemente atendi|me contou que)/i.test(tudo)) {
    erros.push('história/caso de cliente inventado');
  }
  return { erros, avisos, corpo, faq };
}

// ---------- Montagem do conteúdo ----------

// Fotos de apoio curadas por tópico (opcional): topico.imagens_apoio = [{ url, alt, legenda }].
// A foto da capa já aparece como banner no topo da página, então NÃO é repetida no corpo.
function montarConteudo(resumo, corpo, topico, richtext) {
  const { parseBlocks } = richtext;
  const blocos = corpo.split(/\n{2,}/);

  const apoio = topico.imagens_apoio || [];
  apoio.forEach((img, k) => {
    const idxH2 = [];
    blocos.forEach((b, i) => { if (/^## /.test(b.trim())) idxH2.push(i); });
    const alvo = idxH2[1 + 2 * k];
    if (alvo === undefined) return;
    // depois do primeiro bloco de texto da seção
    const pos = blocos.findIndex((b, i) => i > alvo && b.trim() && !/^(#|>|-|!)/.test(b.trim()));
    const fig = `![${img.alt}](${img.url} "${img.legenda || 'Foto: Mac Frois / Estúdio Frois.'}")`;
    blocos.splice(pos >= 0 ? pos + 1 : alvo + 1, 0, fig);
  });

  // Sumário automático antes da primeira seção "##".
  const h2s = parseBlocks(corpo).filter(b => b.type === 'h2');
  const iSecao = blocos.findIndex(b => /^## /.test(b.trim()));
  if (h2s.length >= 4 && iSecao >= 0) {
    const toc = '**Neste guia:**\n\n' + h2s.map(b => `- [${b.text}](#${b.id})`).join('\n');
    blocos.splice(iSecao, 0, toc);
  }
  return resumo + '\n\n' + blocos.join('\n\n');
}

function carregarIndex() {
  const indexPath = path.join(POSTS_DIR, 'index.json');
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

function salvarPost(id, slugBase, topico, resumo, conteudo, faq, imageUrl, data) {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  // Nunca sobrescreve um post existente.
  const slug = slugUnico(slugBase, POSTS_DIR);

  const post = {
    id,
    slug,
    title: topico.titulo_base,
    date: data,
    imageUrl,
    keyword: topico.keyword_principal,
    excerpt: resumo,
    content: conteudo,
    faq,
    cta: topico.cta || {
      href: '/fotografo-corporativo-florianopolis',
      label: 'Conheça a sessão de fotografia corporativa em Florianópolis →'
    }
  };
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.json`), JSON.stringify(post, null, 2), 'utf-8');

  const index = carregarIndex();
  index.unshift({ id, slug, title: topico.titulo_base, date: data, imageUrl, keyword: topico.keyword_principal, excerpt: resumo });
  fs.writeFileSync(path.join(POSTS_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf-8');

  console.log(`Post salvo: ${path.join(POSTS_DIR, slug + '.json')}`);
}

async function main() {
  console.log('Iniciando geração de post (formato rico)...');
  const richtext = await import(pathToFileURL(path.join(ROOT, 'lib/richtext.js')).href);
  const index = carregarIndex();
  const { topico, imageUrl } = escolherProximoPar(index);
  console.log(`Tópico: ${topico.titulo_base}`);

  // A foto precisa existir antes de qualquer coisa: sem imagem, não publica.
  if (!SKIP_NET) {
    const okCapa = await urlOk(imageUrl, true);
    const apoioOk = await Promise.all((topico.imagens_apoio || []).map(i => urlOk(i.url, true)));
    if (!okCapa || apoioOk.includes(false)) throw new Error(`Imagem (capa ou apoio) não respondeu 200 como imagem: ${imageUrl}. Post NÃO publicado.`);
  }

  const fatos = carregarFatos();
  const internos = montarPermitidos(index);
  const fontes = carregarFontesExternas();
  const ctx = { richtext, fatos, fontes, internos, externosCanon: new Map(fontes.map(f => [canon(f.url), f.url])) };

  let resultado = null;
  let erros = [];
  for (let tentativa = 1; tentativa <= 3 && !resultado; tentativa++) {
    const texto = MOCK_ARTICLE
      ? fs.readFileSync(MOCK_ARTICLE, 'utf-8')
      : await chamarAPI(montarPrompt(topico, fatos, internos, fontes, erros));
    let partes;
    try { partes = extrairPartes(texto); } catch (e) { erros = [e.message]; console.log(`Tentativa ${tentativa} reprovada:`, erros); anotar('warning', `Tentativa ${tentativa} reprovada (formato)`, e.message + '\n--- início da resposta ---\n' + texto.slice(0, 600)); if (MOCK_ARTICLE) break; continue; }
    const v = validarConteudo(partes, topico, ctx);
    v.avisos.forEach(a => console.log('Aviso:', a));
    if (v.erros.length) {
      erros = v.erros;
      console.log(`Tentativa ${tentativa} reprovada:`); v.erros.forEach(e => console.log(' -', e));
      const brutos = [...partes.corpo.matchAll(/\]\(([^)\s]*)\)/g)].map(m => m[1]);
      anotar('warning', `Tentativa ${tentativa} reprovada`, v.erros.join('\n') + '\n--- links na resposta do modelo (' + brutos.length + ') ---\n' + brutos.slice(0, 15).join('\n') + '\n--- avisos ---\n' + v.avisos.join('\n') + '\n--- trecho do corpo ---\n' + partes.corpo.slice(0, 500));
      if (MOCK_ARTICLE) break;
      continue;
    }
    resultado = { resumo: partes.resumo, corpo: v.corpo, faq: v.faq };
  }
  if (!resultado) throw new Error('Artigo reprovado na validação após as tentativas. Post NÃO publicado.');

  // Testa cada link externo usado; remove o que não responder.
  if (!SKIP_NET) {
    const usados = [...new Set([...resultado.corpo.matchAll(/\]\((https:\/\/pt\.wikipedia[^)\s]*)\)/g)].map(m => m[1]))];
    for (const u of usados) {
      if (!(await urlOk(u, false))) {
        console.log('Aviso: link externo fora do ar, removido:', u);
        const re = new RegExp('\\[([^\\]]+)\\]\\(' + u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\)', 'g');
        resultado.corpo = resultado.corpo.replace(re, '$1');
      }
    }
  }

  const conteudo = montarConteudo(resultado.resumo, resultado.corpo, topico, richtext);
  if (!richtext.isRich(conteudo)) throw new Error('Conteúdo final não é reconhecido como formato rico');
  salvarPost(gerarId(), gerarSlug(topico.titulo_base), topico, resultado.resumo, conteudo, resultado.faq, imageUrl, dataHoje());
  console.log('Concluído.');
}

main().catch(err => { console.error(err); anotar('error', 'Geração de post falhou', err && err.message ? err.message : err); process.exit(1); });
