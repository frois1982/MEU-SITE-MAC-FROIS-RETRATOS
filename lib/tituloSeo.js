// Título que vai para a aba e para o Google: no máximo 60 caracteres (o Google corta o que passa disso).
// Se o artigo tem um título de busca escolhido à mão em data/titulos-seo.json, usa esse; senão aplica a regra.
export function tituloSeo(slug, titulo, mapa) {
  if (mapa && mapa[slug]) return mapa[slug];
  const com = `${titulo} | Mac Frois`;
  if (com.length <= 60) return com;
  if (titulo.length <= 60) return titulo;
  return titulo.slice(0, 57).replace(/\s+\S*$/, '').replace(/[.,;:\s]+$/, '') + '...';
}
