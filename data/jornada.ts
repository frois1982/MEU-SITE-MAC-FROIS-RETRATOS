// Conteúdo da página /jornada. Cada cena é um arquétipo.
// RASCUNHO: textos e fotos são provisórios, o Mac revisa e troca.
export type CenaJornada = {
  id: string;
  arquetipo: string;
  frase: string;
  linhas: string[]; // aparecem uma a uma conforme a rolagem
  fotoRosto: string; // retrato que é revelado
  fotoCaminho: string | null; // foto de costas na estrada (null = ilustração provisória)
  altRosto: string;
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
    // Foto provisória, já publicada no site. Trocar pelo retrato real do arquétipo.
    fotoRosto: '/metodo-frois/img/minicurso/retrato-2.jpg',
    fotoCaminho: null,
    altRosto: 'Retrato em preto e branco de uma mulher olhando para o lado, com leve sorriso',
  },
];

export const WHATSAPP_JORNADA =
  'https://wa.me/5548996231894?text=' +
  encodeURIComponent('Olá Mac, vi a Jornada no seu site e quero entender qual é o meu arquétipo.');
