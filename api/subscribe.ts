const ARQUETIPOS: {nome: string; frase: string; quem: string; desejo: string; medo: string; sessao: string; chips: string[]; marcas: string}[] = [
 {
  "nome": "O Inocente",
  "frase": "Pureza, confiança e otimismo genuíno.",
  "quem": "O Inocente acredita no bem e irradia otimismo genuíno. Sua imagem comunica confiança, leveza e autenticidade, sem exageros. As pessoas se conectam a você porque sentem que podem confiar plenamente. Você não precisa convencer ninguém; sua presença já fala.",
  "desejo": "Ser feliz e estar seguro(a).",
  "medo": "Fazer algo errado ou ser punido(a).",
  "sessao": "Ambientes iluminados naturalmente, sorrisos abertos e roupas em tons claros e neutros. Composições simples e diretas, evite cenários elaborados. Sua beleza está na transparência.",
  "chips": [
   "Confiança",
   "Pureza",
   "Otimismo",
   "Leveza",
   "Transparência"
  ],
  "marcas": "Dove, Natura, Johnson & Johnson"
 },
 {
  "nome": "O Explorador",
  "frase": "Liberdade, autenticidade e novos horizontes.",
  "quem": "O Explorador não se encaixa em caixas, e sua maior força é exatamente isso. Inquieto, curioso e independente, você inspira pessoas que querem romper padrões. Sua imagem deve comunicar movimento e autenticidade. Você não segue tendências; você abre caminhos.",
  "desejo": "Ser livre e encontrar seu próprio caminho.",
  "medo": "Ficar preso ou ser forçado a se conformar.",
  "sessao": "Locações externas, composições abertas e momentos espontâneos. Luz natural, movimento e expressões genuínas contam sua história melhor que qualquer pose estudada. Evite estúdio fechado e formalidade excessiva.",
  "chips": [
   "Liberdade",
   "Autenticidade",
   "Aventura",
   "Independência",
   "Descoberta"
  ],
  "marcas": "The North Face, Jeep, Patagonia"
 },
 {
  "nome": "O Sábio",
  "frase": "Conhecimento, clareza e profundidade.",
  "quem": "O Sábio é a referência que as pessoas buscam quando precisam de respostas verdadeiras. Seu diferencial é a profundidade e a capacidade de transformar complexidade em clareza. Sua imagem deve transmitir serenidade, domínio e credibilidade absoluta.",
  "desejo": "Descobrir a verdade e compartilhar o que sabe.",
  "medo": "Ser enganado ou passar informações erradas.",
  "sessao": "Poses reflexivas, olhar atento e ambientes ligados à sua área de expertise. Paleta sóbria, iluminação direcional clara e enquadramentos equilibrados. Cada detalhe deve reforçar: esta pessoa sabe do que está falando.",
  "chips": [
   "Sabedoria",
   "Clareza",
   "Credibilidade",
   "Profundidade",
   "Verdade"
  ],
  "marcas": "Google, TED, The Economist"
 },
 {
  "nome": "O Herói",
  "frase": "Superação, determinação e impacto real.",
  "quem": "O Herói é movido por propósito e determinação. Sua história de superação é o que conecta profundamente as pessoas a você. A imagem do Herói comunica que os obstáculos existem para ser vencidos, e você já provou isso várias vezes.",
  "desejo": "Provar seu valor através de atos corajosos.",
  "medo": "Fraqueza, covardia ou não fazer diferença.",
  "sessao": "Poses que transmitam ação, energia e propósito. Expressões intensas e cenários que remetam à sua jornada. Iluminação de alto contraste, enquadramentos dinâmicos e ângulos que transmitam força são seus aliados naturais.",
  "chips": [
   "Coragem",
   "Conquista",
   "Propósito",
   "Força",
   "Transformação"
  ],
  "marcas": "Nike, Adidas, FedEx"
 },
 {
  "nome": "O Fora da Lei",
  "frase": "Ruptura, ousadia e liberdade radical.",
  "quem": "O Fora da Lei existe para questionar o estabelecido. Sua imagem deve comunicar ousadia, independência e a coragem de ser diferente quando todos seguem o mesmo caminho. Você diz o que os outros não têm coragem de dizer, e isso é sua maior força.",
  "desejo": "Revolucionar e destruir o que não funciona.",
  "medo": "Ser irrelevante ou se tornar parte do sistema.",
  "sessao": "Composições assimétricas, ângulos inusitados e cenários que fogem do convencional. Iluminação de alto contraste, sombras dramáticas. Sua imagem deve incomodar levemente, e é exatamente isso que a torna inesquecível.",
  "chips": [
   "Ruptura",
   "Ousadia",
   "Rebeldia",
   "Autenticidade",
   "Provocação"
  ],
  "marcas": "Harley-Davidson, Diesel, Apple anos 80"
 },
 {
  "nome": "O Mago",
  "frase": "Transformação, visão e o extraordinário.",
  "quem": "O Mago tem a habilidade de ver o que os outros não veem e transformar perspectivas. Sua presença parece quase mágica, as pessoas saem de uma conversa com você sentindo que algo fundamental mudou. Você não apenas resolve problemas; você transforma realidades.",
  "desejo": "Fazer seus sonhos e os dos outros se realizarem.",
  "medo": "Ter consequências não-intencionais negativas.",
  "sessao": "Iluminação dramática e criativa, enquadramentos que criem profundidade e mistério. Poses que transmitam visão e transformação. Elementos visuais que sugiram processo de mudança são muito poderosos.",
  "chips": [
   "Transformação",
   "Visão",
   "Mistério",
   "Inovação",
   "Possibilidade"
  ],
  "marcas": "Disney, Apple, Dyson"
 },
 {
  "nome": "O Cara Comum",
  "frase": "Pertencimento, acessibilidade e conexão real.",
  "quem": "O Cara Comum tem o dom de fazer qualquer pessoa se sentir bem-vinda e igual. Sua imagem deve comunicar acessibilidade, calor humano e autenticidade sem pedantismo. As pessoas confiam em você porque você é genuíno, sem filtros, sem performance.",
  "desejo": "Conectar-se com os outros e ser aceito(a).",
  "medo": "Se destacar demais ou ser excluído(a).",
  "sessao": "Ambientes cotidianos, expressões descontraídas e roupas que não criam barreiras. Evite produções excessivamente elaboradas, elas criam distância. Luz natural ou artificial suave e composições abertas funcionam muito bem.",
  "chips": [
   "Pertencimento",
   "Acessibilidade",
   "Empatia",
   "Simplicidade",
   "Conexão"
  ],
  "marcas": "IKEA, eBay, Levi's"
 },
 {
  "nome": "O Amante",
  "frase": "Conexão profunda, beleza e experiência sensorial.",
  "quem": "O Amante vive para criar relações significativas e experiências que elevem os sentidos. Sua imagem deve comunicar sensibilidade, presença plena e a capacidade de fazer as pessoas se sentirem especiais. Você não vende produtos, você vende como as pessoas vão se sentir.",
  "desejo": "Criar relações significativas e intensas.",
  "medo": "Ser rejeitado(a) ou estar sozinho(a).",
  "sessao": "Iluminação suave e envolvente, paletas quentes e texturas ricas. Expressões de conexão genuína e poses que transmitam presença e escuta. Detalhes que remetam à sensorialidade e ao cuidado com cada elemento.",
  "chips": [
   "Paixão",
   "Beleza",
   "Sensibilidade",
   "Intimidade",
   "Desejo"
  ],
  "marcas": "Chanel, Häagen-Dazs, Victoria's Secret"
 },
 {
  "nome": "O Bobo da Corte",
  "frase": "Leveza, humor e sabedoria pela alegria.",
  "quem": "O Bobo da Corte tem o poder de descompressão, de fazer as pessoas rirem de si mesmas e do mundo. Sua imagem deve comunicar espontaneidade, humor inteligente e a coragem de não se levar tão a sério. Leveza é sua forma de sabedoria.",
  "desejo": "Viver o momento e trazer alegria ao mundo.",
  "medo": "Ser entediante ou chato(a).",
  "sessao": "Momentos descontraídos, expressões genuínas de alegria e enquadramentos dinâmicos. Evite rigidez e formalidade. Cores vivas, composições inesperadas e cenários que convidem ao sorriso são seus aliados.",
  "chips": [
   "Alegria",
   "Espontaneidade",
   "Humor",
   "Leveza",
   "Energia"
  ],
  "marcas": "Old Spice, Skittles, Ben & Jerry's"
 },
 {
  "nome": "O Cuidador",
  "frase": "Proteção, acolhimento e o outro em primeiro lugar.",
  "quem": "O Cuidador é a âncora emocional que as pessoas procuram. Seu diferencial é a capacidade de fazer qualquer pessoa se sentir vista, ouvida e cuidada. Sua imagem deve transmitir calor, segurança e presença genuína, você é onde as pessoas encontram conforto.",
  "desejo": "Proteger e cuidar das pessoas ao seu redor.",
  "medo": "Egoísmo ou ingratidão dos outros.",
  "sessao": "Expressões abertas, postura acolhedora e ambientes que transmitam conforto. Iluminação suave e tons quentes. Composições que mostrem conexão com o outro são muito mais poderosas do que poses individuais formais.",
  "chips": [
   "Cuidado",
   "Proteção",
   "Empatia",
   "Generosidade",
   "Presença"
  ],
  "marcas": "Pampers, Volvo, Cruz Vermelha"
 },
 {
  "nome": "O Criador",
  "frase": "Originalidade, imaginação e visão única.",
  "quem": "O Criador não segue tendências, ele as cria. Sua imagem deve ter personalidade, textura e autenticidade, mostrando alguém que pensa fora da caixa. A imperfeição intencional é mais poderosa que a perfeição genérica. Seu processo criativo é parte da sua marca.",
  "desejo": "Criar algo com valor e significado duradouros.",
  "medo": "Ter uma visão medíocre ou não ser original.",
  "sessao": "Ângulos inusitados, expressões genuínas e cenários ligados ao seu processo criativo. Cores e texturas que fujam do convencional. Seu espaço de trabalho conta muito sobre quem você é, use-o como cenário.",
  "chips": [
   "Originalidade",
   "Criatividade",
   "Imaginação",
   "Inovação",
   "Expressão"
  ],
  "marcas": "Lego, Adobe, Dyson"
 },
 {
  "nome": "O Governante",
  "frase": "Autoridade, estrutura e visão de longo prazo.",
  "quem": "O Governante define o padrão que os outros seguem. Sua presença é magnética e sua imagem deve transmitir poder com elegância. Cada decisão sua tem peso, e as pessoas sabem disso. Você não apenas lidera; você constrói estruturas que duram gerações.",
  "desejo": "Criar ordem, prosperidade e legado.",
  "medo": "Caos, perda de controle ou ser deposto(a).",
  "sessao": "Poses de poder, olhares diretos e composições simétricas que transmitam ordem. Paleta sóbria, trajes impecáveis e iluminação que crie profundidade e autoridade. Cada detalhe visual deve reforçar que você é quem define as regras.",
  "chips": [
   "Poder",
   "Autoridade",
   "Legado",
   "Estrutura",
   "Elegância"
  ],
  "marcas": "Rolex, Mercedes-Benz, Microsoft"
 }
];

export const config = { runtime: "nodejs" };

const SITE = "https://www.macfrois.com.br";
const NOME_ORIGEM: Record<string, string> = {
  ebook: "E-book Imagem com Intenção",
  quiz: "Quiz dos Arquétipos",
};

function rotuloOrigem(origem: string): string {
  if (NOME_ORIGEM[origem]) return NOME_ORIGEM[origem];
  const m = /^guia-ep(\d{1,2})$/.exec(origem);
  if (m) return `Guia do ep. ${parseInt(m[1], 10)} (Como Começar na Fotografia)`;
  return "Site";
}

function esc(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Faz uma chamada com limite de tempo; nunca lança erro (e-mail e CRM não podem derrubar o cadastro).
async function seguro(nome: string, fn: () => Promise<any>): Promise<void> {
  try {
    await Promise.race([fn(), new Promise((_, rej) => setTimeout(() => rej(new Error("tempo esgotado")), 8000))]);
  } catch (e: any) {
    console.error(`${nome} falhou:`, e?.message ?? e);
  }
}

function emailResultado(nome: string, p: number, s: number): { assunto: string; html: string } {
  const a = ARQUETIPOS[p], b = ARQUETIPOS[s];
  const chips = a.chips.map((c) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border:1px solid #C8B75C;color:#001021;font-size:13px">${esc(c)}</span>`).join("");
  const bloco = (t: string, v: string) => `<tr><td style="padding:12px 0;border-top:1px solid #e6dfb8"><div style="font-size:11px;letter-spacing:2px;color:#8a7a2a;text-transform:uppercase;margin-bottom:4px">${t}</div><div style="font-size:16px;line-height:1.55;color:#1a1a1a">${esc(v)}</div></td></tr>`;
  const botao = (href: string, txt: string, cheio: boolean) => `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;font-size:14px;text-decoration:none;${cheio ? "background:#EBCF8A;color:#001021" : "border:1px solid #001021;color:#001021"}">${txt}</a>`;
  const ola = nome ? `${esc(nome)}, o ` : "O ";
  const html = `<!doctype html><html><body style="margin:0;background:#f4f1e4;font-family:Georgia,'Times New Roman',serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffff0">
<tr><td style="background:#001021;padding:22px 28px"><div style="font-size:11px;letter-spacing:3px;color:#EBCF8A;text-transform:uppercase">Método Frois | Quiz dos arquétipos</div></td></tr>
<tr><td style="padding:28px">
<div style="font-size:16px;color:#1a1a1a;margin-bottom:6px">${ola}seu arquétipo principal é</div>
<div style="font-size:40px;line-height:1.1;font-weight:bold;color:#001021;margin-bottom:6px">${esc(a.nome)}</div>
<div style="font-size:16px;color:#5a5a3a;margin-bottom:18px">${esc(a.frase)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${bloco("Quem você é", a.quem)}${bloco("Desejo central", a.desejo)}${bloco("Maior medo", a.medo)}${bloco("Sua sessão fotográfica ideal", a.sessao)}
<tr><td style="padding:12px 0;border-top:1px solid #e6dfb8"><div style="font-size:11px;letter-spacing:2px;color:#8a7a2a;text-transform:uppercase;margin-bottom:6px">Palavras que definem a sua imagem</div>${chips}</td></tr>
${bloco("Seu arquétipo secundário: " + b.nome, b.frase)}
</table>
<div style="margin:22px 0 8px">${botao(SITE + "/metodo-frois/downloads/ebook-imagem-com-intencao.pdf", "Baixar o e-book completo", true)}${botao(SITE + "/como-comecar-na-fotografia", "Ver a série e os guias", false)}</div>
<div style="font-size:13px;color:#6b6b55;margin-top:18px">Este quiz é uma ferramenta de reflexão sobre imagem e comunicação, não um teste psicológico.</div>
</td></tr>
<tr><td style="background:#001021;padding:18px 28px;font-size:12px;color:#EBCF8A">Mac Frois, retratista | macfrois.com.br | @froisretratista</td></tr>
</table></td></tr></table></body></html>`;
  return { assunto: `O seu arquétipo: ${a.nome} (secundário: ${b.nome})`, html };
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  const { nome, email } = req.body ?? {};
  if (!email || typeof email !== "string" || !email.includes("@")) return res.status(400).json({ error: "E-mail inválido." });

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuração incompleta." });

  const origem = typeof req.body?.origem === "string" ? req.body.origem.replace(/[^a-z0-9-]/gi, "").slice(0, 40) : "";
  const quiz = req.body?.quiz;
  const qp = Number.isInteger(quiz?.p) && quiz.p >= 0 && quiz.p < 12 ? quiz.p : -1;
  const qs = Number.isInteger(quiz?.s) && quiz.s >= 0 && quiz.s < 12 ? quiz.s : -1;
  const nomeLimpo = (typeof nome === "string" ? nome : "").trim().slice(0, 80);
  const emailLimpo = email.toLowerCase().trim();

  // Todo cadastro entra na lista #7 (dispara a Sequência Newsletter). Quem baixa o e-book também entra na lista #3,
  // que dispara a automação "Welcome message" ("Seu e-book chegou").
  const listIds = origem === "ebook" ? [7, 3] : [7];

  try {
    const resp = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        email: emailLimpo,
        attributes: { FIRSTNAME: nomeLimpo },
        listIds,
        updateEnabled: true,
      }),
    });

    const text = await resp.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch {}

    if (!(resp.ok || resp.status === 204 || data?.code === "duplicate_parameter")) {
      console.error("Brevo error:", text);
      return res.status(400).json({ error: data?.message ?? "Erro no cadastro." });
    }

    const tarefas: Promise<void>[] = [];

    // 1) Resultado do quiz por e-mail (conteúdo vem do servidor; o cliente só informa os índices 0 a 11)
    if (qp >= 0 && qs >= 0) {
      tarefas.push(seguro("E-mail do quiz", async () => {
        const m = emailResultado(nomeLimpo, qp, qs);
        const r = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": apiKey },
          body: JSON.stringify({
            sender: { name: process.env.BREVO_SENDER_NAME ?? "Mac Frois", email: process.env.BREVO_SENDER_EMAIL ?? "contato@macfrois.com.br" },
            replyTo: { email: process.env.BREVO_REPLY_TO ?? "frois.mac@gmail.com", name: "Mac Frois" },
            to: [{ email: emailLimpo, name: nomeLimpo || undefined }],
            subject: m.assunto,
            htmlContent: m.html,
            tags: ["quiz-arquetipos"],
          }),
        });
        if (!r.ok) throw new Error(`Brevo smtp ${r.status}: ${await r.text()}`);
      }));
    }

    // 2) CRM no Notion (só se NOTION_TOKEN e NOTION_DB_ID estiverem configurados na Vercel)
    const nToken = process.env.NOTION_TOKEN, nDb = process.env.NOTION_DB_ID;
    if (nToken && nDb) {
      tarefas.push(seguro("Notion", async () => {
        const h = { "Authorization": `Bearer ${nToken}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" };
        const q = await fetch(`https://api.notion.com/v1/databases/${nDb}/query`, {
          method: "POST", headers: h,
          body: JSON.stringify({ filter: { property: "Email", email: { equals: emailLimpo } }, page_size: 1 }),
        });
        if (q.ok && ((await q.json()).results?.length ?? 0) > 0) return; // já está no CRM: não duplica
        const rotulo = rotuloOrigem(origem);
        const hoje = new Date().toISOString().slice(0, 10);
        const notas = `Entrou pelo site em ${hoje}: ${rotulo}.` + (qp >= 0 ? ` Quiz: principal ${ARQUETIPOS[qp].nome}, secundário ${ARQUETIPOS[qs].nome}.` : "");
        const r = await fetch("https://api.notion.com/v1/pages", {
          method: "POST", headers: h,
          body: JSON.stringify({
            parent: { database_id: nDb },
            properties: {
              "Nome": { title: [{ text: { content: nomeLimpo || emailLimpo.split("@")[0] } }] },
              "Email": { email: emailLimpo },
              "Origem": { select: { name: "Site" } },
              "Etapa": { select: { name: "Lead frio (site)" } },
              "Temperatura": { select: { name: "Frio" } },
              "Produto de Interesse": { rich_text: [{ text: { content: rotulo } }] },
              "Notas": { rich_text: [{ text: { content: notas } }] },
              "Último Contato": { date: { start: hoje } },
            },
          }),
        });
        if (!r.ok) throw new Error(`Notion ${r.status}: ${await r.text()}`);
      }));
    }

    await Promise.all(tarefas);
    return res.status(200).json({ ok: true, message: "Cadastro realizado!" });

  } catch (err: any) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ error: "Erro interno." });
  }
}
