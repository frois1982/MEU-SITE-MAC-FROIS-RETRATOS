// Conteúdo da página /jornada. Cada cena é um arquétipo.
// RASCUNHO: textos e fotos são provisórios, o Mac revisa e troca.
export type CenaJornada = {
  id: string;
  arquetipo: string;
  frase: string;
  linhas: string[]; // aparecem uma a uma conforme a rolagem
  fotoRosto: string; // retrato que é revelado
  fotoCaminho: string | null; // foto que dissolve por cima (null = ilustração provisória)
  altRosto: string;
  altCaminho: string;
  posRosto: string; // object-position (recorte no celular)
  posCaminho: string;
  foco: [string, string]; // onde o círculo de revelação nasce (x, y), em %
  lema: string[]; // três palavras
  simbolos: [string, string, string]; // chaves de SIMBOLOS (components/jornada/Simbolos.tsx)
  cor?: boolean; // true = mantém a cor da foto (padrão: preto e branco)
  ajuste?: 'caber'; // fotos horizontais: no celular mostra a cena inteira em vez de cortar
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

export const CENAS: CenaJornada[] = [
  {
    id: 'rebelde',
    arquetipo: 'O Rebelde',
    frase: 'Quebrar o que já não serve.',
    linhas: [
      'Existe quem segue a estrada que lhe entregaram.',
      'E existe quem para, olha para frente e escolhe outro caminho.',
      'O retrato do Rebelde não pede licença: ele mostra quem rompeu.',
    ],
    // Ensaio do arquétipo Rebelde. Sobram duas fotos (charuto e olhar baixo) para outros momentos.
    fotoRosto: '/jornada/rebelde-frontal.webp',
    fotoCaminho: '/jornada/rebelde-fumaca.webp',
    altRosto: 'Retrato em preto e branco de um homem de óculos escuros, jaqueta jeans e taco de beisebol no ombro, sentado num sofá de couro',
    altCaminho: 'Retrato em preto e branco de um homem de óculos escuros soltando fumaça, com taco de beisebol no ombro',
    posRosto: '50% 20%',
    posCaminho: '30% 25%',
    foco: ['50%', '22%'],
    lema: ['Romper', 'Ousar', 'Libertar'],
    simbolos: ['corrente', 'chama', 'raio'],
  },
  {
    id: 'governante',
    arquetipo: 'O Governante',
    frase: 'Construir o que permanece.',
    linhas: [
      'Existe quem espera que alguém assuma o comando.',
      'E existe quem assume a responsabilidade e põe ordem no que importa.',
      'O retrato do Governante não levanta a voz: a presença já organiza a sala.',
    ],
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
    simbolos: ['coroa', 'cetro', 'torre'],
  },
  {
    id: 'amante',
    arquetipo: 'O Amante',
    frase: 'Quando o vínculo aparece, a foto também.',
    linhas: [
      'Existe quem posa para a câmera.',
      'E existe quem se entrega ao momento, ao outro, ao que sente.',
      'O retrato do Amante não encena intimidade: ele a encontra.',
    ],
    // Mesmo casal nas duas fotos: o olhar que se busca dissolve e revela o sorriso.
    fotoCaminho: '/jornada/amante-olhar.webp',
    fotoRosto: '/jornada/amante-sorriso.webp',
    altCaminho: 'Casal em sala de luz quente: ela, de vestido claro, toca o queixo dele, de terno azul, que a olha sorrindo',
    altRosto: 'Casal em sala de luz quente: ela sorri enquanto ajeita o lenço do paletó dele, que a olha de volta',
    posCaminho: '48% 50%',
    posRosto: '55% 50%',
    foco: ['50%', '34%'],
    lema: ['Sentir', 'Conectar', 'Encantar'],
    simbolos: ['coracao', 'rosa', 'aneis'],
    cor: true,
    ajuste: 'caber',
  },
];

// As cenas seguem a ordem da roda: identidade, estrutura, conexão, marca.
const ORDEM = TRIADES.flatMap((t) => t.arquetipos.map((a) => a.id));
export const CENAS_NA_RODA = [...CENAS].sort((a, b) => ORDEM.indexOf(a.id) - ORDEM.indexOf(b.id));

export const WHATSAPP_JORNADA =
  'https://wa.me/5548996231894?text=' +
  encodeURIComponent('Olá Mac, vi a Jornada no seu site e quero entender qual é o meu arquétipo.');
