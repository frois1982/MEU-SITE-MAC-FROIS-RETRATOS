// scripts/generate-post.js
// Gerador automático de posts SEO — Método Frois / Mac Frois Retratista
// Roda via GitHub Actions: Segunda, Quarta e Sexta às 8h (Brasília)

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY não encontrada. Configure o secret no GitHub.');
  process.exit(1);
}

// ─── BANCO DE TÓPICOS SEO ────────────────────────────────────────────────────
// Temas estratégicos para ranquear no Google para o nicho de Mac Frois
// Palavras-chave principais: fotografia corporativa Florianópolis,
// retrato profissional, identidade visual, imagem profissional, arquétipos de marca
const TOPICOS = [
  {
    titulo_base: "O que é fotografia corporativa e por que ela importa para o seu negócio",
    keyword_principal: "fotografia corporativa Florianópolis",
    keywords: ["fotografia corporativa", "foto profissional empresa", "imagem corporativa"],
    angulo: "educativo — explicar o conceito, benefícios práticos e quando investir"
  },
  {
    titulo_base: "Como uma boa foto de perfil pode aumentar suas vendas",
    keyword_principal: "foto de perfil profissional",
    keywords: ["foto de perfil LinkedIn", "foto profissional para negócios", "imagem profissional"],
    angulo: "prático — dados reais sobre impacto de foto profissional em conversão"
  },
  {
    titulo_base: "Arquétipos de marca: o que são e como definem sua identidade visual",
    keyword_principal: "arquétipos de marca",
    keywords: ["arquétipos de marca fotografia", "identidade visual empresa", "branding pessoal"],
    angulo: "educativo — explicar os 12 arquétipos de forma simples com exemplos do dia a dia"
  },
  {
    titulo_base: "Identidade visual para profissionais liberais: por onde começar",
    keyword_principal: "identidade visual profissional liberal",
    keywords: ["branding pessoal", "imagem para advogados médicos consultores", "posicionamento profissional"],
    angulo: "guia prático para profissionais que nunca pensaram em identidade visual"
  },
  {
    titulo_base: "Iluminação profissional para lives e videoconferências: guia completo",
    keyword_principal: "iluminação para lives profissionais",
    keywords: ["iluminação para Zoom", "como melhorar imagem em videochamada", "setup de luz para vídeo"],
    angulo: "tutorial passo a passo, linguagem acessível, sem jargão técnico"
  },
  {
    titulo_base: "Retrato profissional vs. foto de celular: qual a diferença real?",
    keyword_principal: "retrato profissional fotógrafo",
    keywords: ["foto profissional vs selfie", "qualidade foto para LinkedIn", "retratista Florianópolis"],
    angulo: "comparativo honesto — quando vale contratar fotógrafo e quando o celular resolve"
  },
  {
    titulo_base: "Como se preparar para uma sessão de fotos profissional",
    keyword_principal: "sessão de fotos profissional",
    keywords: ["como se preparar para foto profissional", "dicas para sessão fotográfica", "o que vestir na sessão de fotos"],
    angulo: "guia prático com checklist — roupa, expressão, postura, mentalidade"
  },
  {
    titulo_base: "Posicionamento de marca pessoal para empreendedores em 2025",
    keyword_principal: "posicionamento de marca pessoal",
    keywords: ["personal branding empreendedor", "como se posicionar no mercado", "marca pessoal para negócios"],
    angulo: "estratégico — como imagem e posicionamento se conectam para gerar mais clientes"
  },
  {
    titulo_base: "Fotógrafo corporativo em Florianópolis: o que você precisa saber",
    keyword_principal: "fotógrafo corporativo Florianópolis",
    keywords: ["fotógrafo profissional Florianópolis", "estúdio fotográfico Florianópolis", "fotografia corporativa SC"],
    angulo: "informativo local — o que considerar ao contratar, diferenciais, Studio Frois"
  },
  {
    titulo_base: "Presença digital: por que sua imagem online vale mais do que parece",
    keyword_principal: "presença digital imagem profissional",
    keywords: ["imagem online profissional", "como aparecer bem na internet", "foto para redes sociais"],
    angulo: "provocativo e reflexivo — dados sobre como pessoas são julgadas online antes de falar"
  },
  {
    titulo_base: "Como o seu arquétipo define a forma como você deve ser fotografado",
    keyword_principal: "arquétipo fotografia profissional",
    keywords: ["arquétipo de imagem", "fotografia personalizada", "identidade visual fotografia"],
    angulo: "único e diferenciado — apresentar o Método Frois de forma natural e educativa"
  },
  {
    titulo_base: "Conteúdo de vídeo para empreendedores: como parecer profissional com qualquer câmera",
    keyword_principal: "como parecer profissional no vídeo",
    keywords: ["conteúdo profissional para Instagram", "como gravar vídeo profissional", "setup para conteúdo"],
    angulo: "prático — dicas de luz, ângulo, fundo e postura que qualquer pessoa pode aplicar hoje"
  },
  {
    titulo_base: "LinkedIn: como usar sua foto para atrair oportunidades de negócio",
    keyword_principal: "foto profissional para LinkedIn",
    keywords: ["LinkedIn foto corporativa", "imagem LinkedIn profissional", "perfil LinkedIn fotografia"],
    angulo: "prático e específico — o que a foto do LinkedIn comunica e como otimizá-la"
  },
  {
    titulo_base: "Personal branding para médicos e profissionais da saúde",
    keyword_principal: "personal branding para médicos",
    keywords: ["foto profissional médico", "imagem para profissional de saúde", "branding médico Florianópolis"],
    angulo: "nicho específico — como médicos e profissionais de saúde podem usar imagem para construir autoridade"
  },
  {
    titulo_base: "Sessão de fotos para empresas: como fazer um book corporativo completo",
    keyword_principal: "book fotográfico corporativo",
    keywords: ["book corporativo empresa", "fotos para site institucional", "fotografia para equipe"],
    angulo: "guia completo — o que incluir, como planejar, quanto custa e o que entregar"
  },
];

// ─── GERADOR DE ID ÚNICO ─────────────────────────────────────────────────────
function gerarId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'POST-';
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ─── DATA FORMATADA ──────────────────────────────────────────────────────────
function dataHoje() {
  const hoje = new Date();
  return hoje.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

// ─── ESCOLHER TÓPICO (evita repetição recente) ───────────────────────────────
function escolherTopico(configContent) {
  // Pega tópicos que ainda não aparecem no config.ts (por keyword principal)
  const topicosNaoUsados = TOPICOS.filter(t =>
    !configContent.includes(t.keyword_principal.substring(0, 20))
  );
  const lista = topicosNaoUsados.length > 0 ? topicosNaoUsados : TOPICOS;
  return lista[Math.floor(Math.random() * lista.length)];
}

// ─── PROMPT SEO OTIMIZADO ────────────────────────────────────────────────────
function montarPrompt(topico) {
  return `Você é o Mac Frois, fotógrafo retratista há mais de 10 anos com estúdio próprio (Studio Frois) no Estreito, Florianópolis, Santa Catarina. Você também foi enfermeiro por 20 anos, o que te deu uma capacidade única de ler pessoas e contar histórias reais através da fotografia. Você criou o Método Frois, baseado nos 12 arquétipos de Carol S. Pearson, para ajudar profissionais e empreendedores a construírem uma identidade visual autêntica.

Escreva um post para o blog do seu site (macfrois.com.br) sobre o seguinte tema:

TEMA: ${topico.titulo_base}
PALAVRA-CHAVE PRINCIPAL: ${topico.keyword_principal}
PALAVRAS-CHAVE SECUNDÁRIAS: ${topico.keywords.join(', ')}
ÂNGULO DO CONTEÚDO: ${topico.angulo}

REGRAS DE ESCRITA E SEO:
1. Tom: acessível, inteligente e útil. Como um especialista que explica de forma clara, sem jargão desnecessário. Nem muito técnico, nem superficial.
2. Estrutura obrigatória:
   - Parágrafo de abertura impactante (2-3 frases que prendem o leitor)
   - Pelo menos 4 seções com subtítulos em CAPS ou com dois-pontos (ex: "POR QUE ISSO IMPORTA:" ou "COMO FUNCIONA NA PRÁTICA:")
   - Uma seção com perguntas e respostas simples (formato FAQ — mínimo 3 perguntas)
   - Parágrafo de encerramento com chamada para ação natural e não forçada
3. Comprimento: entre 800 e 1.000 palavras
4. Use a palavra-chave principal nas primeiras 100 palavras do texto
5. Mencione Florianópolis naturalmente quando fizer sentido (você é local)
6. Mencione o Método Frois ou Studio Frois de forma natural em pelo menos um ponto
7. Não use markdown (sem # ou ** ou *). Use apenas texto corrido com quebras de linha \\n para separar parágrafos e seções.
8. Escreva na primeira pessoa (você é o Mac Frois falando diretamente ao leitor)
9. Seja específico e prático — dê pelo menos um conselho concreto que o leitor pode aplicar hoje

RETORNE APENAS o texto do post, sem nenhuma introdução, explicação ou comentário seu.`;
}

// ─── CHAMADA À API DA ANTHROPIC ──────────────────────────────────────────────
async function gerarPost(topico) {
  const { default: fetch } = await import('node-fetch');

  console.log(`📝 Gerando post sobre: "${topico.titulo_base}"`);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: montarPrompt(topico)
        }
      ]
    })
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(`Erro na API: ${response.status} — ${erro}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

// ─── INJETAR POST NO CONFIG.TS ───────────────────────────────────────────────
function injetarNoConfig(conteudoPost, topico) {
  const configPath = './config.ts';
  let config = readFileSync(configPath, 'utf-8');

  const id = gerarId();
  const data = dataHoje();

  // Escapar aspas e quebras de linha para TypeScript string
  const conteudoEscapado = conteudoPost
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  // Gerar slug SEO-friendly a partir da keyword principal
  const slug = topico.keyword_principal
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 60);

  // Gerar meta description (primeiras ~155 chars do conteúdo)
  const primeiraLinha = conteudoPost.split('\n').filter(l => l.trim().length > 0)[0] || '';
  const metaDescription = primeiraLinha.substring(0, 155).replace(/"/g, "'");

  // Novo objeto do post
  const novoPost = `  {
    id: "${id}",
    date: "${data}",
    title: "${topico.titulo_base.toUpperCase()}",
    slug: "${slug}",
    keywords: "${topico.keywords.join(', ')}",
    description: "${metaDescription}",
    content: \`${conteudoEscapado}\`,
  },`;

  // Encontrar o fechamento do array e inserir antes
  const fechamentoArray = config.lastIndexOf('];');
  if (fechamentoArray === -1) {
    throw new Error('❌ Não encontrei o fechamento ]; no config.ts');
  }

  // Inserir o novo post antes do ];
  const configAtualizado =
    config.substring(0, fechamentoArray) +
    novoPost + '\n' +
    config.substring(fechamentoArray);

  writeFileSync(configPath, configAtualizado, 'utf-8');

  console.log(`✅ Post "${id}" inserido com sucesso no config.ts`);
  console.log(`📌 Slug: ${slug}`);
  console.log(`🔑 Keywords: ${topico.keywords.join(', ')}`);

  return { id, slug };
}

// ─── EXECUÇÃO PRINCIPAL ──────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🚀 Iniciando geração de post — Método Frois Blog');
    console.log(`📅 Data: ${dataHoje()}`);

    // Ler config atual para evitar repetição
    const configAtual = readFileSync('./config.ts', 'utf-8');

    // Escolher tópico
    const topico = escolherTopico(configAtual);
    console.log(`🎯 Tópico escolhido: ${topico.titulo_base}`);

    // Gerar conteúdo via IA
    const conteudo = await gerarPost(topico);
    console.log(`📄 Post gerado: ${conteudo.length} caracteres`);

    // Injetar no config.ts
    const { id, slug } = injetarNoConfig(conteudo, topico);

    console.log(`\n🎉 Sucesso! Post ${id} publicado.`);
    console.log(`🌐 URL futura: macfrois.com.br/blog/${slug}`);

  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

main();
