export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  const { nome, email } = req.body ?? {};
  if (!email || !email.includes("@")) return res.status(400).json({ error: "E-mail inválido." });

  const apiKey = process.env.MAILCHIMP_API_KEY ?? "";
  const listId = process.env.MAILCHIMP_LIST_ID ?? "";

  // DIAGNÓSTICO — remove depois que funcionar
  if (!apiKey) return res.status(500).json({ error: "API KEY VAZIA no Vercel." });
  if (!listId) return res.status(500).json({ error: "LIST ID VAZIO no Vercel." });

  const dc = apiKey.split("-").pop();

  const mcRes = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`any:${apiKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      email_address: email.toLowerCase().trim(),
      status: "subscribed",
      merge_fields: { FNAME: (nome ?? "").trim() },
      tags: ["ebook-lead", "metodo-frois"],
    }),
  });

  const mcData = await mcRes.json() as any;

  // Retorna tudo — para diagnóstico
  if (mcRes.ok || mcData?.title === "Member Exists") {
    return res.status(200).json({
      ok: true,
      message: "Cadastro realizado com sucesso!",
      downloadUrl: "/metodo-frois/downloads/ebook-imagem-com-intencao.pdf",
    });
  }

  // Mostra o erro COMPLETO do Mailchimp
  return res.status(400).json({
    error: mcData?.detail ?? "Erro desconhecido",
    debug_title: mcData?.title,
    debug_status: mcRes.status,
    debug_dc: dc,
    debug_listId: listId,
    debug_keySize: apiKey.length,
    debug_keyFim: apiKey.slice(-8),
  });
}
