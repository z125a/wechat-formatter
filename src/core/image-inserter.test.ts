import { describe, it, expect } from 'vitest';
import {
  buildImageMarkdown,
  isValidImageUrl,
  insertAtCursor,
  fileToDataUrl,
} from './image-inserter';

describe('image-inserter', () => {
  // -------------------------------------------------------
  // buildImageMarkdown()
  // -------------------------------------------------------

  describe('buildImageMarkdown()', () => {
    it('should return markdown image syntax with url only', () => {
      expect(buildImageMarkdown('https://example.com/img.png')).toBe(
        '![](https://example.com/img.png)'
      );
    });

    it('should include alt text when provided', () => {
      expect(buildImageMarkdown('https://example.com/img.png', 'my image')).toBe(
        '![my image](https://example.com/img.png)'
      );
    });

    it('should handle empty alt text explicitly', () => {
      expect(buildImageMarkdown('https://example.com/img.png', '')).toBe(
        '![](https://example.com/img.png)'
      );
    });

    it('should handle data URLs', () => {
      const dataUrl = 'data:image/png;base64,abc123';
      expect(buildImageMarkdown(dataUrl)).toBe(`![](${dataUrl})`);
    });
  });

  // -------------------------------------------------------
  // isValidImageUrl()
  // -------------------------------------------------------

  describe('isValidImageUrl()', () => {
    it('should return true for a normal URL', () => {
      expect(isValidImageUrl('https://example.com/img.png')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidImageUrl('')).toBe(false);
    });

    it('should return false for whitespace-only strings', () => {
      expect(isValidImageUrl('   ')).toBe(false);
      expect(isValidImageUrl('\t')).toBe(false);
      expect(isValidImageUrl('\n')).toBe(false);
      expect(isValidImageUrl('  \t\n  ')).toBe(false);
    });

    it('should return true for strings with leading/trailing whitespace but non-empty content', () => {
      expect(isValidImageUrl('  https://example.com  ')).toBe(true);
    });
  });

  // -------------------------------------------------------
  // insertAtCursor()
  // -------------------------------------------------------

  describe('insertAtCursor()', () => {
    it('should insert text at the beginning', () => {
      expect(insertAtCursor('hello', 0, 'X')).toBe('Xhello');
    });

    it('should insert text at the end', () => {
      expect(insertAtCursor('hello', 5, 'X')).toBe('helloX');
    });

    it('should insert text in the middle', () => {
      expect(insertAtCursor('hello', 2, 'XX')).toBe('heXXllo');
    });

    it('should handle empty content', () => {
      expect(insertAtCursor('', 0, 'text')).toBe('text');
    });

    it('should handle empty insertion text', () => {
      expect(insertAtCursor('hello', 2, '')).toBe('hello');
    });

    it('should clamp negative position to 0', () => {
      expect(insertAtCursor('hello', -5, 'X')).toBe('Xhello');
    });

    it('should clamp position beyond content length', () => {
      expect(insertAtCursor('hello', 100, 'X')).toBe('helloX');
    });
  });

  // -------------------------------------------------------
  // fileToDataUrl()
  // -------------------------------------------------------

  describe('fileToDataUrl()', () => {
    it('should convert an image file to a data URL', async () => {
      const content = new Uint8Array([137, 80, 78, 71]); // PNG magic bytes
      const file = new File([content], 'test.png', { type: 'image/png' });

      const result = await fileToDataUrl(file);
      expect(result).toMatch(/^data:image\/png;base64,/);
    });

    it('should handle different image types', async () => {
      const file = new File(['fake-jpeg-data'], 'photo.jpg', { type: 'image/jpeg' });

      const result = await fileToDataUrl(file);
      expect(result).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('should reject when FileReader encounters an error', async () => {
      // Create a file and mock FileReader error scenario
      const file = new File(['data'], 'test.png', { type: 'image/png' });

      // Override FileReader to simulate error
      const OriginalFileReader = globalThis.FileReader;
      globalThis.FileReader = class MockFileReader {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        result: string | null = null;
        readAsDataURL() {
          setTimeout(() => this.onerror?.(), 0);
        }
      } as unknown as typeof FileReader;

      await expect(fileToDataUrl(file)).rejects.toThrow('文件读取失败');

      globalThis.FileReader = OriginalFileReader;
    });
  });
});
