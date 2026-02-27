import { describe, it, expect } from 'vitest';
import { format, validate, MAX_CHAR_LIMIT } from './formatter';
import { getTheme } from './theme-manager';

const classicTheme = getTheme('classic')!;

describe('Formatter', () => {
  // -------------------------------------------------------
  // validate()
  // -------------------------------------------------------

  describe('validate()', () => {
    it('should return invalid for empty string', () => {
      const result = validate('');
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should return invalid for whitespace-only input', () => {
      expect(validate('   ').valid).toBe(false);
      expect(validate('\t\n ').valid).toBe(false);
      expect(validate('\n\n').valid).toBe(false);
    });

    it('should return invalid for input exceeding MAX_CHAR_LIMIT', () => {
      const longInput = 'a'.repeat(MAX_CHAR_LIMIT + 1);
      const result = validate(longInput);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('50000');
    });

    it('should return valid for input at exactly MAX_CHAR_LIMIT', () => {
      const input = 'a'.repeat(MAX_CHAR_LIMIT);
      expect(validate(input).valid).toBe(true);
    });

    it('should return valid for normal input', () => {
      expect(validate('Hello world').valid).toBe(true);
      expect(validate('# Title').valid).toBe(true);
    });
  });

  // -------------------------------------------------------
  // format()
  // -------------------------------------------------------

  describe('format()', () => {
    it('should return success: false for empty input', () => {
      const result = format('', classicTheme);
      expect(result.success).toBe(false);
      expect(result.html).toBe('');
      expect(result.error).toBeDefined();
    });

    it('should return success: false for whitespace-only input', () => {
      const result = format('   \n\t  ', classicTheme);
      expect(result.success).toBe(false);
    });

    it('should return charCount equal to markdown.length', () => {
      const md = '# Hello\n\nSome text here.';
      const result = format(md, classicTheme);
      expect(result.charCount).toBe(md.length);
    });

    it('should return charCount even for invalid input', () => {
      const empty = '';
      expect(format(empty, classicTheme).charCount).toBe(0);

      const long = 'x'.repeat(MAX_CHAR_LIMIT + 5);
      expect(format(long, classicTheme).charCount).toBe(long.length);
    });

    it('should produce HTML with inline styles for valid markdown', () => {
      const result = format('Hello world', classicTheme);
      expect(result.success).toBe(true);
      expect(result.html).toContain('style=');
      expect(result.html).toContain('Hello world');
    });

    it('should not contain class attributes in output', () => {
      const result = format('```js\nconst x = 1;\n```', classicTheme);
      expect(result.success).toBe(true);
      expect(result.html).not.toMatch(/class="/);
    });

    it('should apply theme styles to paragraphs', () => {
      const result = format('A paragraph.', classicTheme);
      expect(result.html).toContain(`font-size: ${classicTheme.styles.fontSize}px`);
      expect(result.html).toContain(`color: ${classicTheme.styles.color}`);
    });

    it('should apply theme styles to headings', () => {
      const result = format('# Title', classicTheme);
      expect(result.html).toContain(`color: ${classicTheme.styles.titleColor}`);
      expect(result.html).toContain(`font-size: ${classicTheme.styles.titleFontSize[1]}px`);
    });

    it('should handle different themes', () => {
      const techTheme = getTheme('tech-blue')!;
      const result = format('Hello', techTheme);
      expect(result.success).toBe(true);
      expect(result.html).toContain(`color: ${techTheme.styles.color}`);
    });
  });
});
