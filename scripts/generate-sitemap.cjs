const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.macfrois.com.br';
const hoje = new Date().toISOString().split('T')[0];

const paginasEstaticas = [
  { url: '/', priority: '1.0' },
  { url: '/portfolio', priority: '0.9' },
  { url: '/servicos', priority: '0.9' },
  { url: '/blog', priority: '0.8' },
  { url: '/contato', priority: '0.7' },
  { url: '/lumina-pro', priority: '0.7' },
  { url: '/metodo-frois/minicurso.html', priority: '0.8' },
  { url: '/metodo-frois/captura.html', priority: '0.7' },
  { url: '/retratos-que-vendem', priority: '0.8' },
];

function carregarPosts() {
  const indexPath = path.join(__dirname, '../public/posts/index.json');
  if (!fs.existsSync(indexPath)) return [];
  return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
}

function gerarSitemap() {
  const posts = carregarPosts();

  const urlsEstaticas = paginasEstaticas.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${hoje}</lastmod>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const urlsPosts = posts.map(p => `
  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <lastmod>${hoje}</lastmod>
    <priority>0.7</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsEstaticas}
${urlsPosts}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap.trim(), 'utf-8');
  console.log(`Sitemap gerado com ${paginasEstaticas.length + posts.length} URLs em public/sitemap.xml`);
}

gerarSitemap();
