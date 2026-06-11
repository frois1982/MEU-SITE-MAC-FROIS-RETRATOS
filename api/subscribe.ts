export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  const { nome, email } = req.body ?? {};
  if (!email || !email.includes("@")) return res.status(400).json({ error: "E-mail inválido." });

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuração incompleta." });

  try {h
        // Cria ou atualiza o contato E adiciona à lista #7 (Newsletter Estúdio Frois)
    const resp = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes: { FIRSTNAME: (nome ?? "").trim() },
        listIds: [7],
        updateEnabled: true,
      }),
    });

    const text = await resp.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch {}

    if (resp.ok || resp.status === 204 || data?.code === "duplicate_parameter") {
      return res.status(200).json({ ok: true, message: "Cadastro realizado!" });
    }

    console.error("Brevo error:", text);
    return res.status(400).json({ error: data?.message ?? "Erro no cadastro." });

  } catch (err: any) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ error: "Erro interno." });
  }
}
