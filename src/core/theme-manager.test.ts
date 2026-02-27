import { describe, it, expect } from 'vitest';
import {
  getPresetThemes,
  getTheme,
  mergeCustomStyles,
  toStyleMap,
} from './theme-manager';
import type { ThemeConfig } from '../types';

describe('ThemeManager', () => {
  describe('getPresetThemes', () => {
    it('returns at least 3 preset themes', () => {
      const themes = getPresetThemes();
      expect(themes.length).toBeGreaterThanOrEqual(3);
    });

    it('includes classic, tech-blue, and warm-literary themes', () => {
      const themes = getPresetThemes();
      const ids = themes.map((t) => t.id);
      expect(ids).toContain('classic');
      expect(ids).toContain('tech-blue');
      expect(ids).toContain('warm-literary');
    });

    it('each theme has complete styles with all required fields', () => {
      const themes = getPresetThemes();
      for (const theme of themes) {
        expect(theme.id).toBeTruthy();
        expect(theme.name).toBeTruthy();
        const s = theme.styles;
        expect(s.fontSize).toBeGreaterThan(0);
        expect(s.lineHeight).toBeGreaterThan(0);
        expect(s.color).toBeTruthy();
        expect(s.titleColor).toBeTruthy();
        expect(s.blockquoteBg).toBeTruthy();
        expect(s.blockquoteBorder).toBeTruthy();
        expect(s.codeBg).toBeTruthy();
        expect(s.linkColor).toBeTruthy();
        expect(typeof s.firstLineIndent).toBe('boolean');
        expect(s.paragraphSpacing).toBeGreaterThan(0);
        expect(typeof s.letterSpacing).toBe('number');
        // titleFontSize must have levels 1-6
        for (let level = 1; level <= 6; level++) {
          expect(s.titleFontSize[level as 1 | 2 | 3 | 4 | 5 | 6]).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('getTheme', () => {
    it('returns the correct theme by id', () => {
      const theme = getTheme('classic');
      expect(theme).toBeDefined();
      expect(theme!.name).toBe('经典黑白');
    });

    it('returns undefined for unknown id', () => {
      expect(getTheme('nonexistent')).toBeUndefined();
    });
  });

  describe('mergeCustomStyles', () => {
    it('overrides specified style properties', () => {
      const base = getTheme('classic')!;
      const merged = mergeCustomStyles(base, { fontSize: 20, color: '#000' });
      expect(merged.styles.fontSize).toBe(20);
      expect(merged.styles.color).toBe('#000');
      // unchanged fields stay the same
      expect(merged.styles.lineHeight).toBe(base.styles.lineHeight);
    });

    it('does not mutate the original theme', () => {
      const base = getTheme('classic')!;
      const originalFontSize = base.styles.fontSize;
      mergeCustomStyles(base, { fontSize: 99 });
      expect(base.styles.fontSize).toBe(originalFontSize);
    });

    it('deep merges titleFontSize', () => {
      const base = getTheme('classic')!;
      const merged = mergeCustomStyles(base, {
        titleFontSize: { 1: 30 } as any,
      });
      expect(merged.styles.titleFontSize[1]).toBe(30);
      // other levels preserved
      expect(merged.styles.titleFontSize[2]).toBe(base.styles.titleFontSize[2]);
    });
  });

  describe('toStyleMap', () => {
    let theme: ThemeConfig;
    let styleMap: Record<string, string>;

    beforeEach(() => {
      theme = getTheme('classic')!;
      styleMap = toStyleMap(theme);
    });

    it('generates style entries for all required elements', () => {
      const requiredKeys = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'a', 'img', 'ul', 'ol', 'hr'];
      for (const key of requiredKeys) {
        expect(styleMap[key]).toBeDefined();
      }
    });

    it('p style contains correct fontSize and color', () => {
      const s = theme.styles;
      expect(styleMap['p']).toContain(`font-size: ${s.fontSize}px`);
      expect(styleMap['p']).toContain(`color: ${s.color}`);
      expect(styleMap['p']).toContain(`line-height: ${s.lineHeight}`);
      expect(styleMap['p']).toContain(`letter-spacing: ${s.letterSpacing}px`);
    });

    it('heading styles use titleFontSize and titleColor', () => {
      const s = theme.styles;
      for (let level = 1; level <= 6; level++) {
        const key = `h${level}`;
        expect(styleMap[key]).toContain(`font-size: ${s.titleFontSize[level as 1 | 2 | 3 | 4 | 5 | 6]}px`);
        expect(styleMap[key]).toContain(`color: ${s.titleColor}`);
      }
    });

    it('blockquote style uses blockquoteBg and blockquoteBorder', () => {
      const s = theme.styles;
      expect(styleMap['blockquote']).toContain(`background: ${s.blockquoteBg}`);
      expect(styleMap['blockquote']).toContain(`${s.blockquoteBorder}`);
    });

    it('code style uses codeBg', () => {
      expect(styleMap['code']).toContain(`background: ${theme.styles.codeBg}`);
      expect(styleMap['pre']).toContain(`background: ${theme.styles.codeBg}`);
    });

    it('link style uses linkColor', () => {
      expect(styleMap['a']).toContain(`color: ${theme.styles.linkColor}`);
    });

    it('img style includes max-width: 100%', () => {
      expect(styleMap['img']).toContain('max-width: 100%');
    });

    it('does not include text-indent when firstLineIndent is false', () => {
      expect(styleMap['p']).not.toContain('text-indent');
    });

    it('includes text-indent: 2em when firstLineIndent is true', () => {
      const warmTheme = getTheme('warm-literary')!;
      const warmMap = toStyleMap(warmTheme);
      expect(warmMap['p']).toContain('text-indent: 2em');
    });

    it('hr has decorative style (not default browser)', () => {
      expect(styleMap['hr']).toContain('border: none');
      expect(styleMap['hr']).toContain('border-top:');
    });
  });
});
