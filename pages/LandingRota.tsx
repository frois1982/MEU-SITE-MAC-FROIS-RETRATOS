import React from 'react';
import { useLocation } from 'react-router-dom';
import { LandingPage, PAGINAS_LANDING } from './LandingPage';

// Escolhe a página de destino (data/paginas/*.json) pelo endereço. Fica num arquivo próprio para que
// a página inicial não baixe os textos de todas as páginas de destino: este trecho só carrega quando preciso.
const LandingRota: React.FC = () => {
  const { pathname } = useLocation();
  const rota = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const pagina = PAGINAS_LANDING.find((p) => p.rota === rota);
  return pagina ? <LandingPage page={pagina} /> : null;
};

export default LandingRota;
