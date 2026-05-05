export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const apiKey = process.env.MAILCHIMP_API_KEY ?? "";
  const listId = process.env.MAILCHIMP_LIST_ID ?? "";

  // Mostra info segura — nunca a chave completa
  const info = {
    apiKey_existe: apiKey.length > 0,
    apiKey_tamanho: apiKey.length,
    apiKey_inicio: apiKey.substring(0, 6),
    apiKey_fim: apiKey.substring(apiKey.length - 5),
    apiKey_tem_hifen: apiKey.includes("-"),
    apiKey_datacenter: apiKey.split("-").pop(),
    listId_existe: listId.length > 0,
    listId_tamanho: listId.length,
    listId_valor: listId,
  };

  // Testa a conexão real com o Mailchimp
  try {
    const dc = apiKey.split("-").pop();
    const resp = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${listId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`any:${apiKey}`).toString("base64")}`,
        },
      }
    );
    const data = await resp.json() as any;
    return res.status(200).json({
      ...info,
      mailchimp_status: resp.status,
      mailchimp_resposta: data?.name ?? data?.title ?? data?.detail ?? data,
    });
  } catch (err: any) {
    return res.status(200).json({ ...info, erro_conexao: err.message });
  }
}
