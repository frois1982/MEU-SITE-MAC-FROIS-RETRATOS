// Estado compartilhado entre as cenas e o fundo (sem React, para não re-renderizar a cada rolagem).
export const estado = {
  // cenas que estão cobrindo a tela inteira agora: o fundo não precisa desenhar atrás delas
  cobertos: new Set<string>(),
  // quanto de texto está aparecendo em cada trecho (0 a 1): o feixe escurece para a leitura ficar tranquila
  texto: new Map<string, number>(),
};

export const nivelTexto = () => {
  let m = 0;
  estado.texto.forEach((v) => { if (v > m) m = v; });
  return m;
};
