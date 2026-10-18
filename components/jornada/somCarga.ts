// O som só é baixado quando a pessoa liga: o código do ambiente sonoro não pesa na abertura da página.
// "clique" não faz nada enquanto o som não foi ligado (igual a antes), então não precisa do módulo antes disso.
let modulo: typeof import('./som') | null = null;

export const alternarSom = async (): Promise<boolean> => {
  modulo = modulo ?? (await import('./som'));
  return modulo.alternarSom();
};

export const clique = (deClique = false) => {
  modulo?.clique(deClique);
};
