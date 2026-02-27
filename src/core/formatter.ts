import type { ThemeConfig, FormatterResult } from '../types';
import { parse } from './markdown-parser';
import { apply } from './inline-styler';
import { toStyleMap } from './theme-manager';

// ============================================================
// Formatter — 排版引擎，协调 MarkdownParser 和 InlineStyler
// ============================================================

/** 最大字符数限制 */
export const MAX_CHAR_LIMIT = 50000;

/**
 * 验证输入内容是否合法。
 *
 * - 空白/空字符串 → valid: false
 * - 超过 50000 字符 → valid: false
 * - 其他 → valid: true
 */
export function validate(markdown: string): { valid: boolean; message?: string } {
  if (!markdown || markdown.trim().length === 0) {
    return { valid: false, message: '输入内容不能为空' };
  }

  if (markdown.length > MAX_CHAR_LIMIT) {
    return { valid: false, message: `输入内容超过 ${MAX_CHAR_LIMIT} 字符限制` };
  }

  return { valid: true };
}

/**
 * 执行一键排版：Markdown → 带内联样式的 HTML。
 *
 * 流程：
 * 1. parse() 将 Markdown 转为 HTML
 * 2. toStyleMap() 从 ThemeConfig 生成样式映射
 * 3. apply() 将内联样式注入 HTML
 */
export function format(markdown: string, theme: ThemeConfig): FormatterResult {
  const charCount = markdown.length;

  const validation = validate(markdown);
  if (!validation.valid) {
    return { html: '', charCount, success: false, error: validation.message };
  }

  try {
    const rawHtml = parse(markdown);
    const styleMap = toStyleMap(theme);
    const html = apply(rawHtml, styleMap);

    return { html, charCount, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : '排版引擎异常';
    return { html: '', charCount, success: false, error: message };
  }
}
