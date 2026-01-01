import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Services, Products } from './pages/ServicesAndProducts';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';

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
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contato" element={<Contact />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;