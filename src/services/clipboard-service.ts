import type { CopyResult } from '../types';

/**
 * ClipboardService - 封装剪贴板操作，处理浏览器兼容性。
 *
 * 主方案：使用 navigator.clipboard.write() 写入富文本 HTML（text/html Blob）。
 * 降级方案：创建临时 div 设置 innerHTML，选中后使用 document.execCommand('copy')。
 */
export class ClipboardService {
  /** 检查现代 Clipboard API 是否可用 */
  isSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      typeof navigator.clipboard !== 'undefined' &&
      typeof navigator.clipboard.write === 'function'
    );
  }

  /**
   * 复制富文本 HTML 到系统剪贴板。
   * 优先使用 Clipboard API，不可用时自动降级到 execCommand。
   */
  async copyRichText(html: string): Promise<CopyResult> {
    if (this.isSupported()) {
      return this.copyViaClipboardAPI(html);
    }
    return this.copyViaExecCommand(html);
  }

  /** 使用现代 Clipboard API 复制富文本 */
  private async copyViaClipboardAPI(html: string): Promise<CopyResult> {
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const item = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([item]);
      return { success: true };
    } catch (err) {
      // Clipboard API 失败时尝试降级方案
      return this.copyViaExecCommand(html);
    }
  }

  /** 降级方案：创建临时元素 + document.execCommand('copy') */
  private copyViaExecCommand(html: string): CopyResult {
    try {
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.opacity = '0';
      document.body.appendChild(container);

      const range = document.createRange();
      range.selectNodeContents(container);

      const selection = window.getSelection();
      if (!selection) {
        document.body.removeChild(container);
        return { success: false, error: '无法获取选区对象' };
      }

      selection.removeAllRanges();
      selection.addRange(range);

      const ok = document.execCommand('copy');
      selection.removeAllRanges();
      document.body.removeChild(container);

      if (!ok) {
        return { success: false, error: '复制失败，请手动选择内容后按 Ctrl+C 复制' };
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      return { success: false, error: `复制失败: ${message}` };
    }
  }
}

/** 单例实例 */
export const clipboardService = new ClipboardService();
