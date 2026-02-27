import { describe, it, expect } from 'vitest';
import { apply } from './inline-styler';
import { toStyleMap, getTheme } from './theme-manager';
import type { StyleMap } from '../types';

describe('InlineStyler', () => {
  const classicTheme = getTheme('classic')!;
  const warmTheme = getTheme('warm-literary')!;
  const styleMap = toStyleMap(classicTheme);

  describe('apply() — basic tag-name style injection', () => {
    it('injects inline style on a <p> tag', () => {
      const html = '<p>Hello</p>';
      const result = apply(html, styleMap);
      expect(result).toContain('<p style="');
      expect(result).toContain(`font-size: ${classicTheme.styles.fontSize}px`);
      expect(result).toContain(`color: ${classicTheme.styles.color}`);
    });

    it('injects inline style on heading tags h1-h6', () => {
      for (let level = 1; level <= 6; level++) {
        const html = `<h${level}>Title</h${level}>`;
        const result = apply(html, styleMap);
        expect(result).toContain(`<h${level} style="`);
        expect(result).toContain(`color: ${classicTheme.styles.titleColor}`);
      }
    });

    it('injects inline style on <blockquote>', () => {
      const html = '<blockquote><p>Quote</p></blockquote>';
      const result = apply(html, styleMap);
      expect(result).toContain('<blockquote style="');
      expect(result).toContain(`background: ${classicTheme.styles.blockquoteBg}`);
    });

    it('injects inline style on <a> tags', () => {
      const html = '<a href="https://example.com">Link</a>';
      const result = apply(html, styleMap);
      expect(result).toContain('<a style="');
      expect(result).toContain(`color: ${classicTheme.styles.linkColor}`);
    });

    it('injects inline style on <ul> and <ol>', () => {
      const html = '<ul><li>Item</li></ul><ol><li>Item</li></ol>';
      const result = apply(html, styleMap);
      expect(result).toContain('<ul style="');
      expect(result).toContain('<ol style="');
    });
  });

  describe('apply() — special elements', () => {
    it('img gets max-width: 100% and height: auto', () => {
      const html = '<img src="photo.jpg" alt="photo">';
      const result = apply(html, styleMap);
      expect(result).toContain('max-width: 100%');
      expect(result).toContain('height: auto');
    });

    it('hr gets decorative style (border: none + border-top)', () => {
      const html = '<hr>';
      const result = apply(html, styleMap);
      expect(result).toContain('border: none');
      expect(result).toContain('border-top:');
    });

    it('p gets text-indent: 2em when firstLineIndent is true', () => {
      const warmMap = toStyleMap(warmTheme);
      const html = '<p>中文段落内容</p>';
      const result = apply(html, warmMap);
      expect(result).toContain('text-indent: 2em');
    });

    it('p does NOT get text-indent when firstLineIndent is false', () => {
      const html = '<p>English paragraph</p>';
      const result = apply(html, styleMap);
      expect(result).not.toContain('text-indent');
    });
  });

  describe('apply() — class attribute removal', () => {
    it('removes class attributes from elements', () => {
      const html = '<code class="hljs language-js">const x = 1;</code>';
      const result = apply(html, styleMap);
      expect(result).not.toContain('class=');
    });

    it('removes class attributes while preserving other attributes', () => {
      const html = '<a href="https://example.com" class="link-style">Link</a>';
      const result = apply(html, styleMap);
      expect(result).not.toContain('class=');
      expect(result).toContain('href="https://example.com"');
    });
  });

  describe('apply() — <style> and <link> tag removal', () => {
    it('removes <style> blocks', () => {
      const html = '<style>.foo { color: red; }</style><p>Text</p>';
      const result = apply(html, styleMap);
      expect(result).not.toContain('<style');
      expect(result).toContain('<p style="');
    });

    it('removes <link> tags', () => {
      const html = '<link rel="stylesheet" href="style.css"><p>Text</p>';
      const result = apply(html, styleMap);
      expect(result).not.toContain('<link');
    });
  });

  describe('apply() — existing style merging', () => {
    it('merges existing inline styles with styleMap styles', () => {
      const html = '<p style="font-weight: bold;">Text</p>';
      const result = apply(html, styleMap);
      // Should have both the existing style and the mapped style
      expect(result).toContain('font-weight: bold');
      expect(result).toContain(`font-size: ${classicTheme.styles.fontSize}px`);
    });
  });

  describe('apply() — elements not in styleMap', () => {
    it('leaves elements without matching styleMap entry unchanged (except class removal)', () => {
      const map: StyleMap = { p: 'color: red;' };
      const html = '<div class="wrapper"><p>Text</p></div>';
      const result = apply(html, map);
      expect(result).toContain('<div>');
      expect(result).not.toContain('class=');
      expect(result).toContain('<p style="color: red;">');
    });
  });

  describe('apply() — integration with markdown-it output', () => {
    it('handles typical markdown-it HTML output', () => {
      const html =
        '<h1>Title</h1>\n' +
        '<p>Paragraph with <strong>bold</strong> and <em>italic</em>.</p>\n' +
        '<blockquote>\n<p>A quote</p>\n</blockquote>\n' +
        '<pre><code class="hljs language-js">const x = 1;</code></pre>\n' +
        '<p><img src="img.png" alt="image"></p>\n' +
        '<hr>\n';

      const result = apply(html, styleMap);

      // All major elements should have inline styles
      expect(result).toContain('<h1 style="');
      expect(result).toContain('<p style="');
      expect(result).toContain('<blockquote style="');
      expect(result).toContain('<pre style="');
      expect(result).toContain('<img style="');
      expect(result).toContain('<hr style="');

      // No class attributes remain
      expect(result).not.toContain('class=');
    });
  });
});
