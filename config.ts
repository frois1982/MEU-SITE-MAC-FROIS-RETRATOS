// config.ts — Blog Mac Frois Retratista
// Gerenciado automaticamente pelo GitHub Actions (blog-auto.yml)
// NÃO edite manualmente — posts são inseridos pelo script generate-post.js

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
}

export const EDITORIAL_DATABASE: BlogPost[] = [
  {
    id: "POST-SEED1",
    date: "11/06/2026",
    title: "A Imagem que Você Projeta Vale Mais do que Pensa",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    content: `Bem-vindo ao Jornal Editorial do Estúdio Frois.

Este é o espaço onde fotografia, identidade e imagem profissional se encontram. Aqui você encontra conteúdo real sobre como construir uma presença visual autêntica — sem filtros, sem poses, sem fórmulas.

Sou Mac Frois, retratista há mais de 10 anos com estúdio próprio em Florianópolis, SC. Antes de fotografar, fui enfermeiro por 20 anos. Essa experiência me deu algo que nenhuma escola de fotografia ensina: a capacidade de ler pessoas. De enxergar além da superfície.

Criei o Método Frois baseado nos 12 arquétipos de Carol S. Pearson para ajudar profissionais a construírem uma identidade visual que realmente representa quem eles são.

Se você é empresário, médico, advogado, consultor ou qualquer profissional que entende que sua imagem é parte do seu negócio — você está no lugar certo.

Novas edições toda semana. Fique à vontade para explorar.

Estúdio Frois — Florianópolis, SC`,
  },
];
