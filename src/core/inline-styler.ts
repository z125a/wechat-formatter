import type { StyleMap } from '../types';

// ============================================================
// InlineStyler — 将 HTML 中的 CSS class 替换为内联样式
// ============================================================

/**
 * 将 HTML 中的元素根据标签名匹配 StyleMap 并注入内联样式，
 * 同时移除所有 class 属性、<style> 和 <link> 标签。
 *
 * 实现策略：基于正则的标签名匹配，不依赖 DOM 解析器或 juice 等重量级库。
 *
 * @param html  - 带有 class 属性的 HTML（来自 markdown-it）
 * @param styleMap - 标签名 → 内联样式字符串 的映射表（来自 ThemeManager.toStyleMap）
 * @returns 仅包含内联 style 属性的 HTML，无 class / <style> / <link>
 */
export function apply(html: string, styleMap: StyleMap): string {
  let result = html;

  // 1. 移除 <style>...</style> 和 <link ...> 标签
  result = result.replace(/<style[\s\S]*?<\/style>/gi, '');
  result = result.replace(/<link[^>]*>/gi, '');

  // 2. 对每个开标签注入内联样式并移除 class 属性
  result = result.replace(/<(\w+)(\s[^>]*)?\s*>/g, (_match, tagName: string, attrs: string | undefined) => {
    const tag = tagName.toLowerCase();
    const style = styleMap[tag];

    let cleanAttrs = attrs || '';

    // 移除已有的 class 属性
    cleanAttrs = cleanAttrs.replace(/\s*class="[^"]*"/gi, '');
    cleanAttrs = cleanAttrs.replace(/\s*class='[^']*'/gi, '');

    if (style) {
      // 如果元素已有 style 属性，合并样式
      const existingStyleMatch = cleanAttrs.match(/\s*style="([^"]*)"/i);
      if (existingStyleMatch) {
        const existingStyle = existingStyleMatch[1];
        const merged = mergeStyles(style, existingStyle);
        cleanAttrs = cleanAttrs.replace(/\s*style="[^"]*"/i, '');
        cleanAttrs = ` style="${merged}"${cleanAttrs}`;
      } else {
        cleanAttrs = ` style="${style}"${cleanAttrs}`;
      }
    }

    // 清理多余空格
    cleanAttrs = cleanAttrs.replace(/\s+/g, ' ').trim();

    return cleanAttrs ? `<${tagName} ${cleanAttrs}>` : `<${tagName}>`;
  });

  return result;
}

/**
 * 合并两段内联样式字符串。
 * 后者（existing）中的属性优先级更高，会覆盖前者（base）中的同名属性。
 */
function mergeStyles(base: string, existing: string): string {
  const map = new Map<string, string>();

  for (const decl of parseDeclarations(base)) {
    map.set(decl.prop, decl.value);
  }
  for (const decl of parseDeclarations(existing)) {
    map.set(decl.prop, decl.value);
  }

  return Array.from(map.entries())
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ') + ';';
}

/** 将 "font-size: 16px; color: red;" 解析为 [{prop, value}] */
function parseDeclarations(style: string): { prop: string; value: string }[] {
  return style
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((decl) => {
      const colonIdx = decl.indexOf(':');
      if (colonIdx === -1) return null;
      return {
        prop: decl.slice(0, colonIdx).trim(),
        value: decl.slice(colonIdx + 1).trim(),
      };
    })
    .filter((d): d is { prop: string; value: string } => d !== null);
}
