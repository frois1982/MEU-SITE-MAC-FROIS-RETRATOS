import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Services, Products } from './pages/ServicesAndProducts';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { LuminaPro } from './pages/LuminaPro';
import { Admin } from './pages/Admin';
import BlogPost from './pages/BlogPost';
import { CorporatePhotographer } from './pages/CorporatePhotographer';
import { FamilyPhotographer } from './pages/FamilyPhotographer';
import { LandingPage, PAGINAS_LANDING } from './pages/LandingPage';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/lumina-pro" element={<LuminaPro />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/fotografo-corporativo-florianopolis" element={<CorporatePhotographer />} />
          <Route path="/ensaio-de-familia-florianopolis" element={<FamilyPhotographer />} />
          {PAGINAS_LANDING.map((p) => (
            <Route key={p.rota} path={p.rota} element={<LandingPage page={p} />} />
          ))}
          <Route path="/contato" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
