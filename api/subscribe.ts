import { ARQUETIPOS } from "./_arquetipos";

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
