export type Inline = { t: 'text'; v: string } | { t: 'b'; v: string } | { t: 'a'; label: string; href: string };
export type Block =
  | { type: 'h2' | 'h3'; text: string; id: string }
  | { type: 'p' | 'quote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'img'; alt: string; src: string; caption: string };
export function isRich(content: string): boolean;
export function slugify(s: string): string;
export function parseInline(str: string): Inline[];
export function parseBlocks(content: string): Block[];
export function plainText(str: string): string;
export function inlineToHtml(str: string): string;
export function blocksToHtml(blocks: Block[]): string;
