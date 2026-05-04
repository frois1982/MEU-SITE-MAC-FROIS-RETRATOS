export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { nome, email } = req.body ?? {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "E-mail inválido." });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    return res.status(500).json({ error: "Configuração do servidor incompleta." });
  }

  const dc = apiKey.split("-").pop();
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const payload = {
    email_address: email.toLowerCase().trim(),
    status: "subscribed",
    merge_fields: { FNAME: (nome ?? "").trim() },
    tags: ["ebook-lead", "metodo-frois"],
  };

  try {
    const mcRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify(payload),
    });

    const mcData = await mcRes.json() as any;

    if (mcRes.ok || mcData?.title === "Member Exists") {
      return res.status(200).json({
        ok: true,
        message: "Cadastro realizado com sucesso!",
        downloadUrl: "/metodo-frois/downloads/ebook-imagem-com-intencao.pdf",
      });
    }

    return res.status(400).json({
      error: mcData?.detail ?? "Não foi possível realizar o cadastro. Tente novamente.",
    });

  } catch (err) {
    return res.status(500).json({ error: "Erro interno. Tente novamente em instantes." });
  }
}
