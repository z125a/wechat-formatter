import MarkdownIt from 'markdown-it';
import footnotePlugin from 'markdown-it-footnote';
import hljs from 'highlight.js';
import type { MarkdownParserOptions } from '../types';

// ============================================================
// MarkdownParser — Markdown ↔ HTML 转换
// ============================================================

/**
 * 创建配置好的 markdown-it 实例
 * - 代码块语法高亮（highlight.js）
 * - 脚注支持（markdown-it-footnote）
 */
function createMarkdownIt(options?: Partial<MarkdownParserOptions>): MarkdownIt {
  const opts: MarkdownParserOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: false,
    ...options,
  };

  const md = new MarkdownIt({
    html: opts.html,
    breaks: opts.breaks,
    linkify: opts.linkify,
    typographer: opts.typographer,
    highlight(str: string, lang: string): string {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const result = hljs.highlight(str, { language: lang, ignoreIllegals: true });
          return `<pre><code class="hljs language-${lang}">${result.value}</code></pre>`;
        } catch {
          // fall through to default
        }
      }
      // No language or highlight failed — escape and wrap
      return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });

  // Plugins
  md.use(footnotePlugin);

  return md;
}

/** Singleton markdown-it instance */
let mdInstance: MarkdownIt | null = null;

function getMd(options?: Partial<MarkdownParserOptions>): MarkdownIt {
  if (!mdInstance) {
    mdInstance = createMarkdownIt(options);
  }
  return mdInstance;
}

// ============================================================
// parse(): Markdown → HTML
// ============================================================

/**
 * 将 Markdown 文本解析为 HTML 字符串。
 *
 * 支持的语法元素：h1-h6、有序/无序列表、粗体、斜体、删除线、
 * 引用块、行内代码、代码块（带语法高亮）、链接、图片、脚注。
 */
export function parse(markdown: string, options?: Partial<MarkdownParserOptions>): string {
  const md = getMd(options);
  return md.render(markdown);
}

// ============================================================
// toMarkdown(): HTML → Markdown（用于往返测试）
// ============================================================

/**
 * 将 HTML 转回 Markdown 格式。
 *
 * 这是一个轻量级实现，主要用于往返一致性测试。
 * 处理 parse() 输出的常见 HTML 结构。
 */
export function toMarkdown(html: string): string {
  let md = html;

  // --- Block-level elements (process outer → inner) ---

  // Headings h1-h6
  for (let level = 1; level <= 6; level++) {
    const prefix = '#'.repeat(level);
    const re = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi');
    md = md.replace(re, (_match, content) => `${prefix} ${stripInlineTags(content).trim()}\n\n`);
  }

  // Horizontal rules (before paragraphs)
  md = md.replace(/<hr\s*\/?>/gi, '---\n\n');

  // Code blocks: <pre><code ...>...</code></pre>
  md = md.replace(
    /<pre><code(?:\s+class="[^"]*language-(\w+)[^"]*")?[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    (_match, lang, code) => {
      const decoded = decodeHtmlEntities(code);
      const langTag = lang ? lang : '';
      return `\`\`\`${langTag}\n${decoded}\`\`\`\n\n`;
    },
  );

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_match, inner) => {
    const innerMd = toMarkdown(inner).trim();
    const lines = innerMd.split('\n');
    return lines.map((l: string) => `> ${l}`).join('\n') + '\n\n';
  });

  // Unordered lists — produce tight list (no blank lines between items)
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match, inner) => {
    const items = extractListItems(inner);
    return items.map((item: string) => `- ${item}`).join('\n') + '\n\n';
  });

  // Ordered lists — produce tight list
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_match, inner) => {
    const items = extractListItems(inner);
    return items.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') + '\n\n';
  });

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_match, content) => {
    return `${convertInlineHtml(content).trim()}\n\n`;
  });

  // Images (standalone, not inside paragraphs)
  md = md.replace(/<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)\n\n');
  md = md.replace(/<img\s+[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)\n\n');

  // Footnote section — strip it (footnote references are kept inline)
  md = md.replace(/<section[^>]*class="footnotes"[^>]*>[\s\S]*?<\/section>/gi, '');
  // Also strip footnote <hr> separators
  md = md.replace(/<hr\s+class="footnotes-sep"\s*\/?>/gi, '');

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode remaining entities
  md = decodeHtmlEntities(md);

  // Normalise whitespace: collapse 3+ newlines to 2
  md = md.replace(/\n{3,}/g, '\n\n');

  return md.trim() + '\n';
}

// ============================================================
// Helpers
// ============================================================

/** Convert inline HTML (bold, italic, code, links, images, strikethrough) to Markdown */
function convertInlineHtml(html: string): string {
  let result = html;

  // Images (must come before links)
  result = result.replace(/<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  result = result.replace(/<img\s+[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');

  // Links
  result = result.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, text) => {
    return `[${stripInlineTags(text)}](${href})`;
  });

  // Bold + italic
  result = result.replace(/<(strong|b)><(em|i)>([\s\S]*?)<\/\2><\/\1>/gi, '***$3***');
  result = result.replace(/<(em|i)><(strong|b)>([\s\S]*?)<\/\2><\/\1>/gi, '***$3***');

  // Bold
  result = result.replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**');

  // Italic
  result = result.replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, '*$1_content*'.replace('$1_content', '$2'));
  // Fix: simpler approach
  result = result.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*');
  result = result.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*');

  // Strikethrough
  result = result.replace(/<(del|s)>([\s\S]*?)<\/\1>/gi, '~~$2~~');

  // Inline code
  result = result.replace(/<code>([\s\S]*?)<\/code>/gi, (_m, content) => {
    return `\`${decodeHtmlEntities(content)}\``;
  });

  // Line breaks
  result = result.replace(/<br\s*\/?>/gi, '\n');

  // Footnote references — convert sup links to [^n]
  result = result.replace(
    /<sup\s+class="footnote-ref"[^>]*><a[^>]*>(\d+)<\/a><\/sup>/gi,
    '[^$1]',
  );

  return result;
}

/** Strip all inline HTML tags, keeping text content */
function stripInlineTags(html: string): string {
  return convertInlineHtml(html).replace(/<[^>]+>/g, '');
}

/** Extract text content from <li> elements, stripping wrapping <p> tags */
function extractListItems(html: string): string[] {
  const items: string[] = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    let content = match[1];
    // Strip wrapping <p> tags that markdown-it adds for loose lists
    content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1');
    items.push(stripInlineTags(content).trim());
  }
  return items;
}

/** Decode common HTML entities */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
