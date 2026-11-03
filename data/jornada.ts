import TEXTOS from './home-cenas.json';

// Conteúdo da página /jornada. Cada cena é um arquétipo.
// RASCUNHO: textos e fotos são provisórios, o Mac revisa e troca.
export type CenaJornada = {
  id: string;
  arquetipo: string;
  titulo: [string, string]; // H2 buscável: [parte normal, parte em itálico]
  frase: string;
  link: { to: string; label: string }; // página que aprofunda o assunto
  linhas: string[]; // aparecem uma a uma conforme a rolagem
  fotoRosto: string; // retrato que é revelado
  fotoCaminho: string; // foto que dissolve por cima
  altRosto: string;
  altCaminho: string;
  posRosto: string; // object-position (recorte no celular)
  posCaminho: string;
  foco: [string, string]; // onde o círculo de revelação nasce (x, y), em %
  lema: string[]; // três palavras
  cor?: boolean | 'revela'; // true = cor nas duas fotos; 'revela' = foto de cima em cinza, revelada em cor (padrão: preto e branco)
  ajuste?: { caminho?: boolean; rosto?: boolean }; // foto horizontal: no celular mostra a cena inteira em vez de cortar
  descer?: { caminho?: number; rosto?: number }; // reenquadramento: desce a foto (em % da altura da tela) para o rosto sair de baixo da barra do site
};

// Estrutura da roda dos 12 arquétipos (Carol S. Pearson), definida pelo Mac em 18/10/2026.
// Quatro tríades; cada uma busca uma coisa. `motivacao` é o anel interno da roda.
export type Triade = { id: string; nome: string; arquetipos: { id: string; nome: string; motivacao: string }[] };

export const TRIADES: Triade[] = [
  { id: 'identidade', nome: 'Descobrir sua identidade', arquetipos: [
    { id: 'inocente', nome: 'O Inocente', motivacao: 'Felicidade' },
    { id: 'explorador', nome: 'O Explorador', motivacao: 'Liberdade' },
    { id: 'sabio', nome: 'O Sábio', motivacao: 'Conhecimento' } ] },
  { id: 'estrutura', nome: 'Fornecer estrutura', arquetipos: [
    { id: 'cuidador', nome: 'O Cuidador', motivacao: 'Compaixão' },
    { id: 'criador', nome: 'O Criador', motivacao: 'Criatividade' },
    { id: 'governante', nome: 'O Governante', motivacao: 'Prosperidade' } ] },
  { id: 'conexao', nome: 'Conectar-se aos outros', arquetipos: [
    { id: 'pessoa-comum', nome: 'A Pessoa Comum', motivacao: 'Segurança' },
    { id: 'amante', nome: 'O Amante', motivacao: 'Amor' },
    { id: 'bobo', nome: 'O Bobo da Corte', motivacao: 'Diversão' } ] },
  { id: 'marca', nome: 'Deixar sua marca', arquetipos: [
    { id: 'heroi', nome: 'O Herói', motivacao: 'Sucesso' },
    { id: 'rebelde', nome: 'O Rebelde', motivacao: 'Ruptura' },
    { id: 'mago', nome: 'O Mago', motivacao: 'Poder' } ] },
];

export const infoArquetipo = (id: string) => {
  for (const t of TRIADES) {
    const a = t.arquetipos.find((x) => x.id === id);
    if (a) return { triade: t.nome, motivacao: a.motivacao };
  }
  return { triade: 'Arquétipo', motivacao: '' };
};

export const CENAS_ORDENADAS_PELA_RODA = ['identidade', 'estrutura', 'conexao', 'marca'];

type Base = Omit<CenaJornada, 'titulo' | 'frase' | 'linhas' | 'link'>;
const BASE: Base[] = [
  {
    id: 'rebelde',
    arquetipo: 'O Rebelde',
    // Ensaio do arquétipo Rebelde. Sobram duas fotos (charuto e olhar baixo) para outros momentos.
    fotoRosto: '/jornada/rebelde-frontal.webp',
    fotoCaminho: '/jornada/rebelde-fumaca.webp',
    altRosto: 'Retrato em preto e branco de um homem de óculos escuros, jaqueta jeans e taco de beisebol no ombro, sentado num sofá de couro',
    altCaminho: 'Retrato em preto e branco de um homem de óculos escuros soltando fumaça, com taco de beisebol no ombro',
    posRosto: '50% 20%',
    posCaminho: '30% 25%',
    foco: ['50%', '22%'],
    lema: ['Romper', 'Ousar', 'Libertar'],
  },
  {
    id: 'governante',
    arquetipo: 'O Governante',
    // Mesma pessoa nas duas fotos: o calmo na poltrona dissolve e revela o olhar de comando.
    // Sobra governante-mesa.webp (outra pessoa, ponta da mesa) para um momento próprio.
    fotoCaminho: '/jornada/governante-calmo.webp',
    fotoRosto: '/jornada/governante-comando.webp',
    altCaminho: 'Retrato de um homem grisalho de terno preto e camisa marrom, sentado numa poltrona de couro com as mãos entrelaçadas',
    altRosto: 'Retrato de um homem grisalho de barba curta, olhando firme para a câmera enquanto ajeita a gola do terno, com relógio no pulso',
    posCaminho: '50% 30%',
    posRosto: '50% 18%',
    foco: ['46%', '20%'],
    lema: ['Liderar', 'Ordenar', 'Perdurar'],
  },
  {
    id: 'amante',
    arquetipo: 'O Amante',
    // Mesmo casal nas duas fotos: o olhar que se busca dissolve e revela o sorriso.
    fotoCaminho: '/jornada/amante-olhar.webp',
    fotoRosto: '/jornada/amante-sorriso.webp',
    altCaminho: 'Casal em sala de luz quente: ela, de vestido claro, toca o queixo dele, de terno azul, que a olha sorrindo',
    altRosto: 'Casal em sala de luz quente: ela sorri enquanto ajeita o lenço do paletó dele, que a olha de volta',
    posCaminho: '48% 50%',
    posRosto: '55% 50%',
    foco: ['50%', '34%'],
    lema: ['Sentir', 'Conectar', 'Encantar'],
    descer: { caminho: 8, rosto: 8 },
    cor: true,
    ajuste: { caminho: true, rosto: true },
  },
  {
    id: 'heroi',
    arquetipo: 'O Herói',
    // Mesma pessoa: de costas diante do sol, dissolve e revela o herói ajoelhado sobre a espada.
    // Sobram heroi de cabeça baixa com a espada e o do martelo nas pedras (Cloudinary 1000380118 e 1000380122).
    fotoCaminho: '/jornada/heroi-costas.webp',
    fotoRosto: '/jornada/heroi-espada.webp',
    altCaminho: 'Homem de costas, agachado sobre uma pedra no mar, com uma espada sobre o ombro diante do pôr do sol',
    altRosto: 'Homem ajoelhado de olhos baixos, com as mãos sobre o cabo de uma espada cravada no chão, ao pôr do sol',
    posCaminho: '60% 50%',
    posRosto: '80% 30%',
    foco: ['50%', '24%'],
    lema: ['Enfrentar', 'Superar', 'Vencer'],
    cor: true,
    ajuste: { caminho: true },
  },
  {
    id: 'mago',
    arquetipo: 'O Mago',
    // Mesma pessoa: o olhar longe, na floresta, dissolve e revela o homem na sala verde. A troca de cenário é a transformação.
    // Sobram a foto sentado com o livro na floresta e a de cabeça baixa na adega (ART_Conceito 28 e HOME).
    fotoCaminho: '/jornada/mago-floresta.webp',
    fotoRosto: '/jornada/mago-sala.webp',
    altCaminho: 'Homem de casaco escuro com as mãos nos bolsos, em uma floresta, olhando para longe',
    altRosto: 'Homem de roupa escura sentado numa poltrona verde, mãos entrelaçadas, olhando de lado em uma sala com painéis de madeira',
    posCaminho: '53% 40%',
    posRosto: '52% 40%',
    foco: ['50%', '31%'],
    lema: ['Imaginar', 'Transformar', 'Revelar'],
    cor: true,
  },
  {
    id: 'bobo',
    arquetipo: 'O Bobo da Corte',
    // Mesma pessoa: o sorriso sereno dissolve e revela a gargalhada.
    fotoCaminho: '/jornada/bobo-calma.webp',
    fotoRosto: '/jornada/bobo-riso.webp',
    altCaminho: 'Mulher de óculos e blazer azul, sentada numa poltrona de couro, sorrindo para a câmera',
    altRosto: 'Mulher de óculos e blazer amarelo rindo de cabeça inclinada, diante de um fundo verde',
    posCaminho: '50% 50%',
    posRosto: '66% 30%',
    foco: ['50%', '24%'],
    lema: ['Rir', 'Aliviar', 'Aproximar'],
    descer: { caminho: 8, rosto: 9 },
    cor: true,
    ajuste: { caminho: true },
  },
  {
    id: 'pessoa-comum',
    arquetipo: 'A Pessoa Comum',
    // Só há uma foto: ela aparece em cinza e se revela em cor. O comum ganha cor.
    // Ideal: um ensaio com par de fotos da mesma pessoa, como nos outros arquétipos.
    fotoCaminho: '/jornada/comum-riso.webp',
    fotoRosto: '/jornada/comum-riso.webp',
    altCaminho: 'Homem de óculos e barba rindo de cabeça baixa, de camisa xadrez',
    altRosto: 'Homem de óculos e barba rindo de cabeça baixa, de camisa xadrez clara',
    posCaminho: '53% 40%',
    posRosto: '53% 40%',
    foco: ['50%', '40%'],
    lema: ['Pertencer', 'Acolher', 'Confiar'],
    cor: 'revela',
  },
  {
    id: 'explorador',
    arquetipo: 'O Explorador',
    // Mesma pessoa (a mesma do Herói): de costas diante do horizonte, dissolve e revela o rosto.
    fotoCaminho: '/jornada/explorador-horizonte.webp',
    fotoRosto: '/jornada/explorador-retrato.webp',
    altCaminho: 'Homem de costas sobre as pedras, apoiado num martelo, olhando o mar ao entardecer',
    altRosto: 'Homem de barba grisalha e camiseta verde, com uma tatuagem no braço, em pé diante de uma parede de pedra',
    posCaminho: '70% 40%',
    posRosto: '40% 25%',
    foco: ['50%', '19%'],
    lema: ['Buscar', 'Atravessar', 'Descobrir'],
    cor: true,
  },
  {
    id: 'sabio',
    arquetipo: 'O Sábio',
    // Mesma pessoa: o olhar distante entre os livros dissolve e revela o olhar firme na escada da biblioteca.
    fotoCaminho: '/jornada/sabio-biblioteca.webp',
    fotoRosto: '/jornada/sabio-escada.webp',
    altCaminho: 'Mulher de blazer bege sentada num sofá de couro diante de uma estante de livros, com um livro nas mãos, olhando ao longe',
    altRosto: 'Mulher de blazer preto em pé ao lado de uma escada de biblioteca, olhando para a câmera',
    posCaminho: '94% 50%',
    posRosto: '61% 30%',
    foco: ['50%', '28%'],
    lema: ['Estudar', 'Compreender', 'Iluminar'],
    cor: true,
    ajuste: { caminho: true },
  },
  {
    id: 'inocente',
    arquetipo: 'O Inocente',
    fotoCaminho: '/jornada/inocente-familia-abraco.webp',
    fotoRosto: '/jornada/inocente-familia-sorriso.webp',
    altCaminho: 'Casal e filho abraçados em um sofá de couro, em ensaio de estúdio com fundo verde',
    altRosto: 'Retrato de família em estúdio: pai, mãe e filho sorrindo juntos diante de um fundo verde',
    posCaminho: '50% 25%',
    posRosto: '50% 25%',
    foco: ['50%', '30%'],
    lema: ['Confiar', 'Recomeçar', 'Florescer'],
    cor: true,
  },
  {
    id: 'cuidador',
    arquetipo: 'O Cuidador',
    fotoCaminho: '/jornada/cuidador-sofa.webp',
    fotoRosto: '/jornada/cuidador-retrato.webp',
    altCaminho: 'Mulher de casaco bege sentada num sofá de couro, olhando para o lado em uma biblioteca de madeira',
    altRosto: 'Retrato de um homem de camisa preta e barba, sentado em uma sala de madeira com cortina vermelha, olhando de lado',
    posCaminho: '50% 25%',
    posRosto: '50% 25%',
    foco: ['50%', '35%'],
    lema: ['Cuidar', 'Proteger', 'Nutrir'],
    cor: true,
    ajuste: { caminho: true },
  },
  {
    id: 'criador',
    arquetipo: 'O Criador',
    // Mesma pessoa (a mesma do Mago): o perfil no ambiente industrial dissolve e revela o rosto sorrindo.
    fotoCaminho: '/jornada/criador-trilho.webp',
    fotoRosto: '/jornada/criador-retrato.webp',
    altCaminho: 'Retrato em preto e branco de um homem de casaco, de perfil, apoiado num corrimão em um ambiente industrial',
    altRosto: 'Retrato em preto e branco de um homem de barba olhando para o lado com leve sorriso, em um ambiente escuro',
    posCaminho: '18% 30%',
    posRosto: '85% 30%',
    foco: ['50%', '33%'],
    lema: ['Inventar', 'Moldar', 'Expressar'],
  },
];

// Os textos (H2 buscável, frase, linhas e link) ficam em home-cenas.json: o mesmo arquivo alimenta o React e o HTML pré-renderizado.
export const CENAS: CenaJornada[] = BASE.map((c) => ({ ...c, ...(TEXTOS as unknown as Record<string, Pick<CenaJornada, 'titulo' | 'frase' | 'linhas' | 'link'>>)[c.id] }));

// As cenas seguem a ordem da roda: identidade, estrutura, conexão, marca.
const ORDEM = TRIADES.flatMap((t) => t.arquetipos.map((a) => a.id));
export const CENAS_NA_RODA = [...CENAS].sort((a, b) => ORDEM.indexOf(a.id) - ORDEM.indexOf(b.id));

// Miniaturas (400x528) dos rostos revelados, para o anel do fundo. Na MESMA ordem dos capítulos:
// a carta de número k é o retrato do capítulo k, e a rolagem traz essa carta para a frente.
export const MINIATURAS = CENAS_NA_RODA.map((c) => c.fotoRosto.replace('/jornada/', '/jornada/mini/'));

export const WHATSAPP_JORNADA =
  'https://wa.me/5548996231894?text=' +
  encodeURIComponent('Olá Mac, vi a Jornada no seu site e quero entender qual é o meu arquétipo.');
