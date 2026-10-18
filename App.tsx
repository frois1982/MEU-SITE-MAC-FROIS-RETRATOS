import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Jornada } from './pages/Jornada';

// Só a página inicial (Jornada) vem junto com o primeiro carregamento.
// As demais páginas são baixadas quando a pessoa entra nelas: a abertura do site fica bem mais leve no celular.
const Portfolio = lazy(() => import('./pages/Portfolio').then((m) => ({ default: m.Portfolio })));
const Services = lazy(() => import('./pages/ServicesAndProducts').then((m) => ({ default: m.Services })));
const Products = lazy(() => import('./pages/ServicesAndProducts').then((m) => ({ default: m.Products })));
const Blog = lazy(() => import('./pages/Blog').then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const LuminaPro = lazy(() => import('./pages/LuminaPro').then((m) => ({ default: m.LuminaPro })));
const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })));
const CorporatePhotographer = lazy(() => import('./pages/CorporatePhotographer').then((m) => ({ default: m.CorporatePhotographer })));
const FamilyPhotographer = lazy(() => import('./pages/FamilyPhotographer').then((m) => ({ default: m.FamilyPhotographer })));
const LandingRota = lazy(() => import('./pages/LandingRota'));

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<div className="min-h-[70vh] bg-zinc-950" />}>
          <Routes>
            <Route path="/" element={<Jornada />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/lumina-pro" element={<LuminaPro />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/fotografo-corporativo-florianopolis" element={<CorporatePhotographer />} />
            <Route path="/ensaio-de-familia-florianopolis" element={<FamilyPhotographer />} />
            <Route path="/jornada" element={<Navigate to="/" replace />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* qualquer outro endereço: páginas de destino (casal, praias, advogados, médicos...) */}
            <Route path="*" element={<LandingRota />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
