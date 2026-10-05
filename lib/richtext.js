// Marcação leve para posts do blog (usada pelo navegador e pelo prerender).
// Posts antigos continuam em texto puro: isRich() só liga o modo "rico" quando
// o conteúdo usa algum destes recursos:
//   ## Título        -> h2        ### Subtítulo -> h3
//   [texto](url)     -> link (url interna começa com "/", âncora com "#")
//   **negrito**
//   ![alt](url "legenda opcional")  -> imagem em linha própria
//   - item           -> lista       > texto -> destaque
// Parágrafos são separados por linha em branco.

export function isRich(content) {
  return /^#{2,3} |^!\[|\]\((?:https?:\/\/|\/|#)/m.test(content || '');
}

export function slugify(s) {
  return String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Quebra um texto em tokens: { t: 'text' | 'a' | 'b', ... }
export function parseInline(str) {
  const out = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0, m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push({ t: 'text', v: str.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'a', label: m[1], href: m[2] });
    else out.push({ t: 'b', v: m[3] });
    last = re.lastIndex;
  }
  if (last < str.length) out.push({ t: 'text', v: str.slice(last) });
  return out;
}

export function parseBlocks(content) {
  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let para = [], list = null;
  const flushPara = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ') }); para = []; } };
  const flushList = () => { if (list) { blocks.push({ type: 'ul', items: list }); list = null; } };
  for (const raw of lines) {
    const line = raw.trim();
    let m;
    if (!line) { flushPara(); flushList(); continue; }
    if ((m = line.match(/^(#{2,3}) (.+)$/))) {
      flushPara(); flushList();
      blocks.push({ type: m[1].length === 2 ? 'h2' : 'h3', text: m[2], id: slugify(m[2]) });
    } else if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/))) {
      flushPara(); flushList();
      blocks.push({ type: 'img', alt: m[1], src: m[2], caption: m[3] || '' });
    } else if (line.startsWith('- ')) {
      flushPara();
      (list = list || []).push(line.slice(2));
    } else if (line.startsWith('> ')) {
      flushPara(); flushList();
      blocks.push({ type: 'quote', text: line.slice(2) });
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara(); flushList();
  return blocks;
}

// Texto sem marcação (descrição, JSON-LD).
export function plainText(str) {
  return String(str || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^#{2,3} /gm, '').replace(/^[->] /gm, '')
    .replace(/\s+/g, ' ').trim();
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function inlineToHtml(str) {
  return parseInline(str).map((k) => {
    if (k.t === 'text') return esc(k.v);
    if (k.t === 'b') return `<strong>${esc(k.v)}</strong>`;
    const ext = /^https?:\/\//.test(k.href) && !k.href.startsWith('https://www.macfrois.com.br');
    return `<a href="${esc(k.href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(k.label)}</a>`;
  }).join('');
}

// HTML estático (prerender) para o mesmo conteúdo.
export function blocksToHtml(blocks) {
  return blocks.map((b) => {
    if (b.type === 'h2') return `<h2 id="${b.id}">${esc(b.text)}</h2>`;
    if (b.type === 'h3') return `<h3 id="${b.id}">${esc(b.text)}</h3>`;
    if (b.type === 'p') return `<p>${inlineToHtml(b.text)}</p>`;
    if (b.type === 'quote') return `<blockquote>${inlineToHtml(b.text)}</blockquote>`;
    if (b.type === 'ul') return `<ul>${b.items.map((i) => `<li>${inlineToHtml(i)}</li>`).join('')}</ul>`;
    if (b.type === 'img') return `<figure><img src="${esc(b.src)}" alt="${esc(b.alt)}" loading="lazy">${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
    return '';
  }).join('');
}
