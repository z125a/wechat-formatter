import { describe, it, expect } from 'vitest';
import { parse, toMarkdown } from './markdown-parser';

describe('MarkdownParser', () => {
  // -------------------------------------------------------
  // parse() — Markdown → HTML
  // -------------------------------------------------------

  describe('parse()', () => {
    it('should parse headings h1-h6', () => {
      for (let level = 1; level <= 6; level++) {
        const md = `${'#'.repeat(level)} Heading ${level}`;
        const html = parse(md);
        expect(html).toContain(`<h${level}>`);
        expect(html).toContain(`Heading ${level}`);
        expect(html).toContain(`</h${level}>`);
      }
    });

    it('should parse bold text', () => {
      const html = parse('**bold**');
      expect(html).toContain('<strong>bold</strong>');
    });

    it('should parse italic text', () => {
      const html = parse('*italic*');
      expect(html).toContain('<em>italic</em>');
    });

    it('should parse strikethrough text', () => {
      const html = parse('~~deleted~~');
      expect(html).toContain('<s>deleted</s>');
    });

    it('should parse unordered lists', () => {
      const html = parse('- item 1\n- item 2');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('item 1');
      expect(html).toContain('item 2');
    });

    it('should parse ordered lists', () => {
      const html = parse('1. first\n2. second');
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>');
      expect(html).toContain('first');
      expect(html).toContain('second');
    });

    it('should parse blockquotes', () => {
      const html = parse('> quoted text');
      expect(html).toContain('<blockquote>');
      expect(html).toContain('quoted text');
    });

    it('should parse inline code', () => {
      const html = parse('use `console.log`');
      expect(html).toContain('<code>console.log</code>');
    });

    it('should parse code blocks with syntax highlighting', () => {
      const md = '```javascript\nconst x = 1;\n```';
      const html = parse(md);
      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('language-javascript');
      // highlight.js should produce span tags with styles
      expect(html).toContain('<span');
    });

    it('should parse code blocks without language', () => {
      const md = '```\nplain code\n```';
      const html = parse(md);
      expect(html).toContain('<pre>');
      expect(html).toContain('plain code');
    });

    it('should parse links', () => {
      const html = parse('[example](https://example.com)');
      expect(html).toContain('<a href="https://example.com"');
      expect(html).toContain('example</a>');
    });

    it('should parse images', () => {
      const html = parse('![alt text](https://img.example.com/pic.png)');
      expect(html).toContain('<img');
      expect(html).toContain('src="https://img.example.com/pic.png"');
      expect(html).toContain('alt="alt text"');
    });

    it('should parse horizontal rules', () => {
      const html = parse('---');
      expect(html).toContain('<hr>');
    });

    it('should parse footnotes', () => {
      const md = 'Text with a footnote[^1].\n\n[^1]: This is the footnote content.';
      const html = parse(md);
      // Should contain footnote reference (superscript link)
      expect(html).toContain('footnote');
      // Should contain footnote section at the end
      expect(html).toContain('footnote-item');
    });

    it('should return empty-ish HTML for empty input', () => {
      const html = parse('');
      expect(html.trim()).toBe('');
    });
  });

  // -------------------------------------------------------
  // toMarkdown() — HTML → Markdown
  // -------------------------------------------------------

  describe('toMarkdown()', () => {
    it('should convert heading HTML back to markdown', () => {
      const html = '<h2>Title</h2>';
      const md = toMarkdown(html);
      expect(md.trim()).toBe('## Title');
    });

    it('should convert paragraph HTML back to markdown', () => {
      const html = '<p>Hello world</p>';
      const md = toMarkdown(html);
      expect(md.trim()).toBe('Hello world');
    });

    it('should convert bold HTML back to markdown', () => {
      const html = '<p><strong>bold</strong></p>';
      const md = toMarkdown(html);
      expect(md).toContain('**bold**');
    });

    it('should convert italic HTML back to markdown', () => {
      const html = '<p><em>italic</em></p>';
      const md = toMarkdown(html);
      expect(md).toContain('*italic*');
    });

    it('should convert links back to markdown', () => {
      const html = '<p><a href="https://example.com">link</a></p>';
      const md = toMarkdown(html);
      expect(md).toContain('[link](https://example.com)');
    });

    it('should convert code blocks back to markdown', () => {
      const html = '<pre><code class="hljs language-js">const x = 1;</code></pre>';
      const md = toMarkdown(html);
      expect(md).toContain('```js');
      expect(md).toContain('const x = 1;');
      expect(md).toContain('```');
    });

    it('should convert unordered lists back to markdown', () => {
      const html = '<ul><li>a</li><li>b</li></ul>';
      const md = toMarkdown(html);
      expect(md).toContain('- a');
      expect(md).toContain('- b');
    });

    it('should convert ordered lists back to markdown', () => {
      const html = '<ol><li>first</li><li>second</li></ol>';
      const md = toMarkdown(html);
      expect(md).toContain('1. first');
      expect(md).toContain('2. second');
    });

    it('should convert blockquotes back to markdown', () => {
      const html = '<blockquote><p>quoted</p></blockquote>';
      const md = toMarkdown(html);
      expect(md).toContain('> quoted');
    });

    it('should convert horizontal rules back to markdown', () => {
      const html = '<hr>';
      const md = toMarkdown(html);
      expect(md).toContain('---');
    });
  });

  // -------------------------------------------------------
  // Round-trip: parse → toMarkdown → parse
  // -------------------------------------------------------

  describe('round-trip consistency', () => {
    it('parse(toMarkdown(parse(md))) should equal parse(md) for basic content', () => {
      const md = '## Hello\n\nA paragraph with **bold** and *italic*.\n\n- item 1\n- item 2\n';
      const firstParse = parse(md);
      const roundTripped = parse(toMarkdown(firstParse));
      expect(roundTripped).toBe(firstParse);
    });
  });
});
