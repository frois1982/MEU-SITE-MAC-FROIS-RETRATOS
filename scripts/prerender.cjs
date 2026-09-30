// Pós-build: gera um HTML por rota com title/description/canonical/OG corretos,
// para que o Google veja os metadados certos sem depender de JavaScript.
// Roda depois do "vite build" (ver package.json).
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.macfrois.com.br';
const DIST = path.join(__dirname, '../dist');
const POSTS = path.join(__dirname, '../public/posts');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const LP = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/fotografo-corporativo.json'), 'utf-8'));
const PAGINAS = [
  { rota: '/fotografo-corporativo-florianopolis', title: LP.title, desc: LP.description, lp: true },
  { rota: '/portfolio', title: 'Portfolio | Mac Frois - Retratos Corporativos Florianopolis', desc: 'Veja o portfolio de Mac Frois - retratos corporativos, posicionamento de imagem e fotografia de marca pessoal para executivos e profissionais liberais em Florianopolis, SC.' },
  { rota: '/servicos', title: 'Projetos | Mac Frois — Retratos Corporativos e Posicionamento de Imagem', desc: 'Fotografia corporativa e projetos estrategicos de imagem em Florianopolis, SC. Pacotes a partir de R$890.' },
  { rota: '/produtos', title: 'Produtos Digitais | Mac Frois — Cursos de Fotografia', desc: 'Cursos digitais de fotografia por Mac Frois. Iluminacao Profissional e Retratos que Vendem disponíveis agora no Hotmart.' },
  { rota: '/lumina-pro', title: 'Lumina Pro | Mac Frois — Minicurso de Iluminação Profissional', desc: 'Lumina Pro — Minicurso de Iluminação Profissional por Mac Frois. Aprenda as técnicas de iluminação usadas em retratos corporativos de alto impacto. R$97.' },
  { rota: '/blog', title: 'Blog | Mac Frois — Fotografia, Imagem e Marca Pessoal', desc: 'Artigos sobre fotografia corporativa, posicionamento de imagem, marca pessoal e estratégias para profissionais e executivos em Florianópolis, SC.' },
  { rota: '/contato', title: 'Contato | Mac Frois — Fotógrafo Corporativo em Florianópolis', desc: 'Entre em contato com Mac Frois para agendar sua sessão de retratos corporativos em Florianópolis, SC. WhatsApp (48) 99623-1894.' },
];

function aplicar(html, { title, desc, url, image, type, jsonld, corpo }) {
  const t = esc(title), d = esc(desc), u = esc(url);
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${u}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${type || 'website'}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${u}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
  if (image) {
    html = html
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(image)}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${esc(image)}$2`);
  }
  if (jsonld) html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n</head>`);
  if (corpo) html = html.replace('<div id="root"></div>', `<div id="root">${corpo}</div>`);
  return html;
}

function gravar(rota, html) {
  const dir = path.join(DIST, rota);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
}

function descricaoPost(p) {
  let txt = (p.content || p.excerpt || '').replace(/\s+/g, ' ').trim();
  if (txt.toLowerCase().startsWith(p.title.toLowerCase())) txt = txt.slice(p.title.length).trim();
  if (txt.length <= 158) return txt;
  return txt.slice(0, 155).replace(/\s+\S*$/, '') + '...';
}

function isoData(br) { return br.split('/').reverse().join('-'); }

const base = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
let n = 0;

for (const p of PAGINAS) {
  let extra = {};
  if (p.lp) {
    extra.jsonld = { '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: LP.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
    extra.corpo = `<main><h1>${esc(LP.h1)}</h1><p>${esc(LP.intro)}</p>` +
      LP.faq.map((f) => `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`).join('') + '</main>';
  }
  gravar(p.rota, aplicar(base, { title: p.title, desc: p.desc, url: BASE + p.rota, ...extra }));
  n++;
}

const manifesto = JSON.parse(fs.readFileSync(path.join(POSTS, 'index.json'), 'utf-8'));
const vistos = new Set();
for (const m of manifesto) {
  if (vistos.has(m.slug)) continue;
  vistos.add(m.slug);
  const arq = path.join(POSTS, `${m.slug}.json`);
  if (!fs.existsSync(arq)) { console.warn(`AVISO: ${m.slug}.json não existe`); continue; }
  const p = JSON.parse(fs.readFileSync(arq, 'utf-8'));
  const url = `${BASE}/blog/${p.slug}`;
  const desc = descricaoPost(p);
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: p.title, description: desc, image: p.imageUrl,
    datePublished: isoData(p.date), dateModified: isoData(p.date),
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: 'Mac Frois', url: BASE },
    publisher: { '@type': 'Organization', name: 'Estúdio Frois' },
  };
  const corpo = `<article><h1>${esc(p.title)}</h1><p>${esc(p.date)}</p><div style="white-space:pre-wrap">${esc(p.content)}</div></article>`;
  gravar(`/blog/${p.slug}`, aplicar(base, { title: `${p.title} | Mac Frois`, desc, url, image: p.imageUrl, type: 'article', jsonld, corpo }));
  n++;
}
console.log(`Prerender: ${n} páginas geradas em dist/`);
