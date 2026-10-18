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
};

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
];

export const WHATSAPP_JORNADA =
  'https://wa.me/5548996231894?text=' +
  encodeURIComponent('Olá Mac, vi a Jornada no seu site e quero entender qual é o meu arquétipo.');
