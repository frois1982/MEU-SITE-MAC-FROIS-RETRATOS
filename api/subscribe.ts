export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  const { nome, email } = req.body ?? {};

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "E-mail inválido." });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Configuração incompleta." });
  }

  try {
    const resp = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes: { FIRSTNAME: (nome ?? "").trim() },
        updateEnabled: true,
      }),
    });

    const data = await resp.json() as any;

    // 201 = criado | 204 = atualizado | duplicado é OK
    if (resp.ok || resp.status === 204 || data?.code === "duplicate_parameter") {
      return res.status(200).json({
        ok: true,
        message: "Cadastro realizado com sucesso!",
      });
    }

    console.error("Brevo error:", data);
    return res.status(400).json({
      error: data?.message ?? "Não foi possível realizar o cadastro.",
    });

  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Erro interno. Tente novamente." });
  }
}
