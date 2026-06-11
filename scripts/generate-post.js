// scripts/generate-post.js
// Gerador automático de posts SEO — Método Frois / Mac Frois Retratista
// Versão 4.0 — compatível com EDITORIAL_DATABASE + imageUrl

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY não encontrada. Configure o secret no GitHub.');
  process.exit(1);
}

// ─── IMAGENS UNSPLASH (rotativas, sem API key) ────────────────────────────────
const IMAGENS = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
  "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=80",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80",
  "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1200&q=80",
  "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=1200&q=80",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
  "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=1200&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
  "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=1200&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?w=1200&q=80",
];

// ─── BANCO DE TÓPICOS SEO ────────────────────────────────────────────────────
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
    angulo: "prático — impacto de foto profissional em conversão e primeiras impressões"
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
    titulo_base: "Posicionamento de marca pessoal para empreendedores",
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
    angulo: "provocativo e reflexivo — como pessoas são julgadas online antes de falar"
  },
  {
    titulo_base: "Como o seu arquétipo define a forma como você deve ser fotografado",
    keyword_principal: "arquétipo fotografia profissional",
    keywords: ["arquétipo de imagem", "fotografia personalizada", "identidade visual fotografia"],
    angulo: "único e diferenciado — apresentar o Método Frois de forma natural e educativa"
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
    angulo: "nicho específico — como usar imagem para construir autoridade na área da saúde"
  },
  {
    titulo_base: "Sessão de fotos para empresas: como fazer um book corporativo completo",
    keyword_principal: "book fotográfico corporativo",
    keywords: ["book corporativo empresa", "fotos para site institucional", "fotografia para equipe"],
    angulo: "guia completo — o que incluir, como planejar e o que esperar do resultado"
  },
  {
    titulo_base: "Conteúdo de vídeo para empreendedores: como parecer profissional",
    keyword_principal: "como parecer profissional no vídeo",
    keywords: ["conteúdo profissional para Instagram", "como gravar vídeo profissional", "setup para conteúdo"],
    angulo: "prático — dicas de luz, ângulo, fundo e postura aplicáveis hoje"
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function gerarId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'POST-';
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function dataHoje() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function escolherTopico(configContent) {
  const naoUsados = TOPICOS.filter(t =>
    !configContent.includes(t.keyword_principal.substring(0, 25))
  );
  const lista = naoUsados.length > 0 ? naoUsados : TOPICOS;
  return lista[Math.floor(Math.random() * lista.length)];
}

function escolherImagem(configContent) {
  const naoUsadas = IMAGENS.filter(img => !configContent.includes(img.substring(0, 50)));
  return naoUsadas.length > 0
    ? naoUsadas[Math.floor(Math.random() * naoUsadas.length)]
    : IMAGENS[Math.floor(Math.random() * IMAGENS.length)];
}

function montarPrompt(topico) {
  return `Você é o Mac Frois, fotógrafo retratista há mais de 10 anos com estúdio próprio (Studio Frois) em Florianópolis, SC. Você foi enfermeiro por 20 anos, o que te deu uma capacidade única de ler pessoas. Você criou o Método Frois, baseado nos 12 arquétipos de Carol S. Pearson, para ajudar profissionais a construírem uma identidade visual autêntica.

Escreva um post editorial para o blog do site macfrois.com.br sobre:

TEMA: ${topico.titulo_base}
PALAVRA-CHAVE PRINCIPAL: ${topico.keyword_principal}
PALAVRAS-CHAVE SECUNDÁRIAS: ${topico.keywords.join(', ')}
ÂNGULO: ${topico.angulo}

REGRAS OBRIGATÓRIAS:
1. Tom: editorial, inteligente, autêntico. Especialista que fala de pessoa para pessoa.
2. Use a palavra-chave principal nas primeiras 100 palavras
3. Estrutura: abertura impactante (2-3 parágrafos) + 4 seções com títulos em CAPS + FAQ com 3 perguntas e respostas + encerramento com CTA natural
4. Comprimento: 800 a 1000 palavras
5. Mencione Florianópolis naturalmente quando fizer sentido
6. Mencione o Método Frois ou Studio Frois em pelo menos um ponto
7. Use apenas texto corrido com quebras de linha. Sem markdown, sem # ou **.
8. Escreva na primeira pessoa
9. Dê pelo menos um conselho concreto que o leitor pode aplicar hoje

RETORNE APENAS o texto do post, sem introdução ou comentário.`;
}

// ─── CHAMADA À API ────────────────────────────────────────────────────────────
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
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API retornou status ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.content[0].text.trim());
        } catch (e) {
          reject(new Error(`Erro ao parsear resposta: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── INJETAR NO CONFIG.TS ────────────────────────────────────────────────────
function injetarNoConfig(conteudo, topico, imageUrl) {
  const configPath = path.join(process.cwd(), 'config.ts');

  if (!fs.existsSync(configPath)) {
    throw new Error(`config.ts não encontrado em: ${configPath}`);
  }

  let config = fs.readFileSync(configPath, 'utf-8');

  if (!config.includes('EDITORIAL_DATABASE')) {
    throw new Error('config.ts não contém EDITORIAL_DATABASE. Verifique se o arquivo está correto.');
  }

  const id = gerarId();
  const data = dataHoje();

  // Escapar o conteúdo para template literal do TypeScript
  const conteudoEscapado = conteudo
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  const novoPost = `  {
    id: "${id}",
    date: "${data}",
    title: "${topico.titulo_base}",
    imageUrl: "${imageUrl}",
    content: \`${conteudoEscapado}\`,
  },`;

  // Inserir antes do último ]; do arquivo
  const posicao = config.lastIndexOf('];');
  if (posicao === -1) {
    throw new Error('Não encontrei o fechamento ]; no config.ts. Estrutura inválida.');
  }

  const configAtualizado =
    config.substring(0, posicao) +
    novoPost + '\n' +
    config.substring(posicao);

  fs.writeFileSync(configPath, configAtualizado, 'utf-8');

  console.log(`✅ Post "${id}" inserido com sucesso`);
  console.log(`📌 Título: ${topico.titulo_base}`);
  console.log(`🖼️  Imagem: ${imageUrl}`);

  return { id };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🚀 Iniciando geração de post — Blog Mac Frois');
    console.log(`📅 Data: ${dataHoje()}`);

    const configPath = path.join(process.cwd(), 'config.ts');
    const configAtual = fs.readFileSync(configPath, 'utf-8');

    const topico = escolherTopico(configAtual);
    console.log(`🎯 Tópico: ${topico.titulo_base}`);

    const imageUrl = escolherImagem(configAtual);
    console.log(`🖼️  Imagem selecionada`);

    const conteudo = await chamarAPI(montarPrompt(topico));
    console.log(`📄 Conteúdo gerado: ${conteudo.length} caracteres`);

    injetarNoConfig(conteudo, topico, imageUrl);

    console.log('\n🎉 Post publicado com sucesso!');

  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

main();
