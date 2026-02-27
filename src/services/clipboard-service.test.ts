import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClipboardService } from './clipboard-service';

describe('ClipboardService', () => {
  let service: ClipboardService;

  beforeEach(() => {
    service = new ClipboardService();
    // jsdom doesn't define document.execCommand, so we add it
    document.execCommand = vi.fn().mockReturnValue(false);
  });

  // --- isSupported ---

  describe('isSupported', () => {
    it('should return true when Clipboard API write is available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { write: vi.fn() },
        writable: true,
        configurable: true,
      });
      expect(service.isSupported()).toBe(true);
    });

    it('should return false when clipboard is undefined', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      expect(service.isSupported()).toBe(false);
    });

    it('should return false when clipboard.write is not a function', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn() },
        writable: true,
        configurable: true,
      });
      expect(service.isSupported()).toBe(false);
    });
  });

  // --- copyRichText with Clipboard API ---

  describe('copyRichText - Clipboard API path', () => {
    let mockWrite: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockWrite = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { write: mockWrite },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(globalThis, 'ClipboardItem', {
        value: class MockClipboardItem {
          items: Record<string, Blob>;
          constructor(items: Record<string, Blob>) {
            this.items = items;
          }
        },
        writable: true,
        configurable: true,
      });
    });

    it('should copy HTML via Clipboard API and return success', async () => {
      const html = '<p style="color:red">Hello</p>';
      const result = await service.copyRichText(html);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockWrite).toHaveBeenCalledTimes(1);

      const clipboardItem = mockWrite.mock.calls[0][0][0];
      expect(clipboardItem.items['text/html']).toBeInstanceOf(Blob);
      expect(clipboardItem.items['text/html'].type).toBe('text/html');
    });

    it('should fall back to execCommand when Clipboard API throws', async () => {
      mockWrite.mockRejectedValue(new Error('NotAllowedError'));
      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await service.copyRichText('<p>Fallback test</p>');

      expect(result.success).toBe(true);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  // --- copyRichText with execCommand fallback ---

  describe('copyRichText - execCommand fallback', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });
    });

    it('should use execCommand when Clipboard API is not supported', async () => {
      document.execCommand = vi.fn().mockReturnValue(true);

      const result = await service.copyRichText('<p style="font-size:16px">Content</p>');

      expect(result.success).toBe(true);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });

    it('should return error when execCommand returns false', async () => {
      document.execCommand = vi.fn().mockReturnValue(false);

      const result = await service.copyRichText('<p>Test</p>');

      expect(result.success).toBe(false);
      expect(result.error).toContain('复制失败');
    });

    it('should return error when execCommand throws', async () => {
      document.execCommand = vi.fn().mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const result = await service.copyRichText('<p>Test</p>');

      expect(result.success).toBe(false);
      expect(result.error).toContain('SecurityError');
    });

    it('should clean up temporary element after copy', async () => {
      document.execCommand = vi.fn().mockReturnValue(true);
      const childCountBefore = document.body.children.length;

      await service.copyRichText('<p>Cleanup test</p>');

      expect(document.body.children.length).toBe(childCountBefore);
    });

    it('should return error when window.getSelection returns null', async () => {
      vi.spyOn(window, 'getSelection').mockReturnValue(null);

      const result = await service.copyRichText('<p>No selection</p>');

      expect(result.success).toBe(false);
      expect(result.error).toContain('无法获取选区对象');
    });
  });
});
