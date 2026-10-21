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
const FAM = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/ensaio-familia.json'), 'utf-8'));
const SEO = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/home-seo.json'), 'utf-8'));
const PAGINAS = [
  // A Jornada é a página inicial ("/"): mantém o título e a descrição de busca da home de sempre.
  { rota: '/', title: 'Mac Frois | Fotografo de Retratos Corporativos em Florianopolis', desc: SEO.description, jornada: true },
  { rota: '/ensaio-de-familia-florianopolis', title: FAM.title, desc: FAM.description, fam: true },
  { rota: '/fotografo-corporativo-florianopolis', title: LP.title, desc: LP.description, lp: true },
  { rota: '/portfolio', title: 'Portfolio | Mac Frois - Retratos Corporativos Florianopolis', desc: 'Veja o portfolio de Mac Frois - retratos corporativos, posicionamento de imagem e fotografia de marca pessoal para executivos e profissionais liberais em Florianopolis, SC.' },
  { rota: '/servicos', title: 'Projetos | Mac Frois — Retratos Corporativos e Posicionamento de Imagem', desc: 'Fotografia corporativa e projetos estrategicos de imagem em Florianopolis, SC. Pacotes a partir de R$890.' },
  { rota: '/produtos', title: 'Produtos Digitais | Mac Frois — Cursos de Fotografia', desc: 'Cursos digitais de fotografia por Mac Frois. Iluminacao Profissional e Retratos que Vendem disponíveis agora no Hotmart.' },
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

function descricaoPost(p, limpar) {
  let txt = limpar(p.content || p.excerpt || '').replace(/\s+/g, ' ').trim();
  if (txt.toLowerCase().startsWith(p.title.toLowerCase())) txt = txt.slice(p.title.length).trim();
  if (txt.length <= 158) return txt;
  return txt.slice(0, 155).replace(/\s+\S*$/, '').replace(/[.,;:\s]+$/, '') + '...';
}

function isoData(br) { return br.split('/').reverse().join('-'); }

let base = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

// Na página inicial o CSS principal vai para dentro do próprio HTML (~10 KB compactados): o navegador pinta o texto
// assim que recebe a página, sem esperar um segundo pedido de rede só pelos estilos. Medido: celular 79 -> 100.
// As páginas internas ficam com o CSS em arquivo à parte: lá embutir engorda o HTML sem ganho (medido: nota igual ou 2 pontos menor).
let baseInicio = base;
const linkCss = base.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (linkCss) {
  const css = fs.readFileSync(path.join(DIST, linkCss[1]), 'utf-8');
  baseInicio = base.replace(linkCss[0], () => `<style>${css}</style>`);
}
let n = 0;

for (const p of PAGINAS) {
  let extra = {};
  if (p.jornada) {
    // A abertura vem já formatada, com as mesmas classes e a mesma estrutura que o React monta (Layout + Jornada):
    // o texto aparece na primeira pintura e, quando o React assume, nada muda de lugar nem de aparência.
    extra.corpo = '<div class="min-h-screen bg-black flex flex-col"><main class="flex-grow pt-24 md:pt-0"><main class="jr-root"><header class="jr-hero"><div class="jr-hero-texto relative z-10 max-w-2xl mx-auto text-center">' +
      `<p class="text-[10px] uppercase tracking-[0.4em] text-gold-500">${esc(SEO.eyebrow)}</p>` +
      `<h1 class="mt-6 text-3xl sm:text-5xl text-white leading-tight">${esc(SEO.h1)}</h1>` +
      `<p class="mt-6 text-sm sm:text-base text-zinc-100 leading-relaxed">${esc(SEO.intro)}</p>` +
      `<p class="mt-6 text-[11px] uppercase tracking-[0.2em] text-zinc-300">${SEO.links.map((l) => `<a href="${l.to}" class="underline underline-offset-4 hover:text-gold-400">${esc(l.label)}</a>`).join('<span class="text-zinc-600"> · </span>')}</p>` +
      `<p class="mt-10 text-[10px] uppercase tracking-[0.3em] text-zinc-500 jr-pulso">${esc(SEO.rolar)}</p></div></header>` +
      '<section class="relative px-6 py-24 bg-zinc-950 text-zinc-300 text-center"><p>São doze jeitos de ser, os arquétipos do Método Frois:</p>' +
      '<h2>O Rebelde</h2><p>Quebrar o que já não serve. O retrato do Rebelde não pede licença: ele mostra quem rompeu.</p>' +
      '<h2>O Governante</h2><p>Construir o que permanece. O retrato do Governante não levanta a voz: a presença já organiza a sala.</p>' +
      '<h2>O Amante</h2><p>Quando o vínculo aparece, a foto também. O retrato do Amante não encena intimidade: ele a encontra.</p>' +
      '<h2>O Herói</h2><p>Provar o próprio valor na travessia. O retrato do Herói mostra o preço pago e a força que sobrou.</p>' +
      '<h2>O Mago</h2><p>Fazer o impossível parecer inevitável. O retrato do Mago transforma presença em visão.</p>' +
      '<h2>O Bobo da Corte</h2><p>Levar a vida a sério sem perder o riso. O retrato do Bobo da Corte não é piada: é presença que desarma.</p>' +
      '<h2>A Pessoa Comum</h2><p>Ser inteiro sem precisar parecer especial. O retrato da Pessoa Comum tem a coragem do natural: ninguém precisa fingir.</p>' +
      '<h2>O Explorador</h2><p>Ir além do mapa para se encontrar. O retrato do Explorador guarda a estrada que o trouxe até aqui.</p>' +
      '<h2>O Sábio</h2><p>Ver com clareza para guiar os outros. O retrato do Sábio mostra a calma de quem já pensou duas vezes.</p>' +
      '<h2>O Inocente</h2><p>Voltar a olhar o mundo sem medo. O retrato do Inocente é feito de luz suave e verdade simples.</p>' +
      '<h2>O Cuidador</h2><p>Quem cuida também precisa de pausa. O retrato do Cuidador mostra a força que mora na delicadeza.</p>' +
      '<h2>O Criador</h2><p>Dar forma ao que ainda não existe. O retrato do Criador é o instante em que a ideia ganha rosto.</p>' +
      `<h2>${esc(SEO.arquetipos.h2)}</h2><p>${esc(SEO.arquetipos.abertura)}</p>` +
      SEO.arquetipos.blocos.map((b) => `<h3>${esc(b.h3)}</h3><p>${esc(b.p)}</p>`).join('') +
      `<h2>${esc(SEO.convite.h2)}</h2><p>${esc(SEO.convite.texto)}</p><p><a href="${SEO.convite.quiz}">${esc(SEO.convite.botao)}</a></p><p>${esc(SEO.convite.aviso)}</p>` +
      '<nav><a href="/portfolio">Portfólio</a> · <a href="/servicos">Serviços</a> · <a href="/fotografo-corporativo-florianopolis">Fotógrafo corporativo em Florianópolis</a> · ' +
      '<a href="/ensaio-de-familia-florianopolis">Ensaio de família em Florianópolis</a> · <a href="/blog">Blog</a> · <a href="/contato">Contato</a></nav></section></main></main></div>';
  }
  if (p.lp) {
    extra.jsonld = { '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: LP.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
    extra.corpo = `<main><h1>${esc(LP.h1)}</h1><p>${esc(LP.intro)}</p>` +
      LP.faq.map((f) => `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`).join('') + '</main>';
  }
  if (p.fam) {
    const ofertas = [
      ...FAM.packages.map((k) => ({ nome: `Ensaio de família ${k.nome}`, preco: k.preco })),
      ...FAM.alemDoTempo.contratos.map((k) => ({ nome: k.nome, preco: k.preco })),
    ];  // preço só quando divulgado; os demais são sob consulta
    extra.jsonld = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'FAQPage', mainEntity: FAM.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      { '@type': 'Service', name: 'Ensaio fotográfico de família em Florianópolis', serviceType: 'Fotografia de família',
        provider: { '@id': BASE + '/#negocio' }, areaServed: { '@type': 'City', name: 'Florianópolis' },
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Pacotes de ensaio de família',
          itemListElement: ofertas.map((o) => ({ '@type': 'Offer', ...(o.preco ? { priceCurrency: 'BRL', price: String(o.preco) } : {}), itemOffered: { '@type': 'Service', name: o.nome } })) } },
    ] };
    extra.corpo = `<main><h1>${esc(FAM.h1)}</h1><p>${esc(FAM.intro)}</p>` +
      FAM.packages.map((k) => `<h2>${esc(k.nome)}: ${esc(k.precoRotulo)}</h2><ul>${k.itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`).join('') +
      FAM.faq.map((f) => `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`).join('') + '</main>';
  }
  gravar(p.rota, aplicar(p.jornada ? baseInicio : base, { title: p.title, desc: p.desc, url: BASE + p.rota, ...extra }));
  n++;
}

// Páginas de destino genéricas (data/paginas/*.json): casal, praias, advogados, médicos.
const DIR_LP = path.join(__dirname, '../data/paginas');
for (const arq of fs.readdirSync(DIR_LP).filter((f) => f.endsWith('.json'))) {
  const D = JSON.parse(fs.readFileSync(path.join(DIR_LP, arq), 'utf-8'));
  const sv = D.servico;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: D.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@type': 'Service', name: sv.nome, serviceType: sv.tipo, provider: { '@id': BASE + '/#negocio' },
      areaServed: { '@type': 'City', name: 'Florianópolis' },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: sv.catalogo,
        itemListElement: D.pacotes.map((k) => ({ '@type': 'Offer', ...(k.preco ? { priceCurrency: 'BRL', price: String(k.preco) } : {}),
          itemOffered: { '@type': 'Service', name: `${sv.prefixo} ${k.nome}` } })) } },
  ] };
  const corpo = `<main><h1>${esc(D.h1)}</h1><p>${esc(D.intro)}</p>` +
    (D.galeria || []).map((g) => `<img src="${esc(g.src)}" alt="${esc(g.alt)}">`).join('') +
    D.secoes.map((x) => `<h2>${esc(x.h2)}</h2>${(x.paragrafos || []).map((t) => `<p>${esc(t)}</p>`).join('')}${x.lista ? `<ul>${x.lista.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}`).join('') +
    (D.praias ? D.praias.map((x) => `<h2>${esc(x.h)}</h2>${x.p.map((t) => `<p>${esc(t)}</p>`).join('')}${x.link ? `<p><a href="${x.link}">${esc(x.nome)}</a></p>` : ''}`).join('') : '') +
    `<h2>${esc(D.pacotesTitulo)}</h2>` +
    D.pacotes.map((k) => `<h3>${esc(k.nome)}: ${esc(k.rotulo)}</h3><ul>${k.itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`).join('') +
    D.extras.map((e) => `<p>${esc(e)}</p>`).join('') +
    D.faq.map((f) => `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`).join('') +
    `<p>${D.links.map((l) => `<a href="${l.to}">${esc(l.label)}</a>`).join(' · ')}</p></main>`;
  gravar(D.rota, aplicar(base, { title: D.title, desc: D.description, url: BASE + D.rota, jsonld, corpo }));
  n++;
}

(async () => {
  // lib/richtext.js é ESM (compartilhado com o React); aqui entra por import dinâmico.
  const { isRich, parseBlocks, blocksToHtml, inlineToHtml, plainText } = await import('../lib/richtext.js');
  const manifesto = JSON.parse(fs.readFileSync(path.join(POSTS, 'index.json'), 'utf-8'));
  const vistos = new Set();
  for (const m of manifesto) {
    if (vistos.has(m.slug)) continue;
    vistos.add(m.slug);
    const arq = path.join(POSTS, `${m.slug}.json`);
    if (!fs.existsSync(arq)) { console.warn(`AVISO: ${m.slug}.json não existe`); continue; }
    const p = JSON.parse(fs.readFileSync(arq, 'utf-8'));
    const url = `${BASE}/blog/${p.slug}`;
    const rico = isRich(p.content);
    // posts antigos (texto puro) seguem exatamente como antes; só o modo rico remove a marcação
    // Posts no formato rico: a primeira linha do conteúdo é o resumo escrito para ser a meta description.
    const resumoRico = rico ? plainText((p.content || '').split(/\n{2,}/)[0]).replace(/\s+/g, ' ').trim() : '';
    const desc = rico && resumoRico.length >= 70 && resumoRico.length <= 170
      ? resumoRico
      : descricaoPost(p, rico ? plainText : (t) => t);
    const blogPosting = {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: p.title, description: desc, image: p.imageUrl,
      datePublished: isoData(p.date), dateModified: isoData(p.date),
      mainEntityOfPage: url,
      author: { '@type': 'Person', name: 'Mac Frois', url: BASE },
      publisher: { '@type': 'Organization', name: 'Mac Frois' },
    };
    const faqHtml = (p.faq && p.faq.length)
      ? `<section><h2 id="perguntas-frequentes">Perguntas frequentes</h2>${p.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${inlineToHtml(f.a)}</p>`).join('')}</section>`
      : '';
    const faqLd = (p.faq && p.faq.length)
      ? { '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) } })) }
      : null;
    const jsonld = faqLd ? [blogPosting, faqLd] : blogPosting;
    const corpo = rico
      ? `<article><h1>${esc(p.title)}</h1><p>${esc(p.date)}</p>${blocksToHtml(parseBlocks(p.content))}${faqHtml}</article>`
      : `<article><h1>${esc(p.title)}</h1><p>${esc(p.date)}</p><div style="white-space:pre-wrap">${esc(p.content)}</div></article>`;
    gravar(`/blog/${p.slug}`, aplicar(base, { title: `${p.title} | Mac Frois`, desc, url, image: p.imageUrl, type: 'article', jsonld, corpo }));
    n++;
  }
  console.log(`Prerender: ${n} páginas geradas em dist/`);
})();
