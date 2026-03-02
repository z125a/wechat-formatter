import type { ThemeConfig, ThemeStyles, StyleMap, HeadingLevel } from '../types';

// ============================================================
// 预设主题配置
// ============================================================

const PRESET_THEMES: ThemeConfig[] = [
  {
    id: 'classic',
    name: '经典黑白',
    styles: {
      fontSize: 16,
      lineHeight: 1.75,
      color: '#333333',
      titleColor: '#1a1a1a',
      titleFontSize: { 1: 24, 2: 22, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#f7f7f7',
      blockquoteBorder: '#ddd',
      codeBg: '#f5f5f5',
      linkColor: '#576b95',
      firstLineIndent: false,
      paragraphSpacing: 16,
      letterSpacing: 0.5,
    },
  },
  {
    id: 'tech-blue',
    name: '科技蓝',
    styles: {
      fontSize: 15,
      lineHeight: 1.8,
      color: '#2c3e50',
      titleColor: '#1565c0',
      titleFontSize: { 1: 24, 2: 22, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#e3f2fd',
      blockquoteBorder: '#1565c0',
      codeBg: '#263238',
      linkColor: '#1565c0',
      firstLineIndent: false,
      paragraphSpacing: 16,
      letterSpacing: 0.5,
    },
  },
  {
    id: 'warm-literary',
    name: '暖色文艺',
    styles: {
      fontSize: 16,
      lineHeight: 2.0,
      color: '#5b4636',
      titleColor: '#8b4513',
      titleFontSize: { 1: 26, 2: 23, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#fdf6ec',
      blockquoteBorder: '#d4a574',
      codeBg: '#faf4ed',
      linkColor: '#c0392b',
      firstLineIndent: true,
      paragraphSpacing: 20,
      letterSpacing: 1,
    },
  },
  {
    id: 'wechat-green',
    name: '微信绿',
    styles: {
      fontSize: 15,
      lineHeight: 1.8,
      color: '#3c3c3c',
      titleColor: '#07c160',
      titleFontSize: { 1: 24, 2: 22, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#f0faf4',
      blockquoteBorder: '#07c160',
      codeBg: '#f4f5f5',
      linkColor: '#07c160',
      firstLineIndent: false,
      paragraphSpacing: 16,
      letterSpacing: 0.5,
    },
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    styles: {
      fontSize: 16,
      lineHeight: 1.8,
      color: '#3d3451',
      titleColor: '#7c3aed',
      titleFontSize: { 1: 26, 2: 23, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#f5f3ff',
      blockquoteBorder: '#7c3aed',
      codeBg: '#faf5ff',
      linkColor: '#7c3aed',
      firstLineIndent: false,
      paragraphSpacing: 18,
      letterSpacing: 0.5,
    },
  },
  {
    id: 'sunset-orange',
    name: '日落橙',
    styles: {
      fontSize: 15,
      lineHeight: 1.75,
      color: '#44403c',
      titleColor: '#ea580c',
      titleFontSize: { 1: 24, 2: 22, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#fff7ed',
      blockquoteBorder: '#ea580c',
      codeBg: '#fffbeb',
      linkColor: '#ea580c',
      firstLineIndent: false,
      paragraphSpacing: 16,
      letterSpacing: 0.5,
    },
  },
  {
    id: 'rose-pink',
    name: '玫瑰粉',
    styles: {
      fontSize: 15,
      lineHeight: 1.85,
      color: '#4a3f47',
      titleColor: '#e11d48',
      titleFontSize: { 1: 24, 2: 22, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#fff1f2',
      blockquoteBorder: '#e11d48',
      codeBg: '#fdf2f8',
      linkColor: '#e11d48',
      firstLineIndent: false,
      paragraphSpacing: 16,
      letterSpacing: 0.5,
    },
  },
  {
    id: 'dark-mode',
    name: '暗夜模式',
    styles: {
      fontSize: 15,
      lineHeight: 1.8,
      color: '#d1d5db',
      titleColor: '#f9fafb',
      titleFontSize: { 1: 24, 2: 22, 3: 20, 4: 18, 5: 16, 6: 14 },
      blockquoteBg: '#1f2937',
      blockquoteBorder: '#4b5563',
      codeBg: '#111827',
      linkColor: '#60a5fa',
      firstLineIndent: false,
      paragraphSpacing: 16,
      letterSpacing: 0.5,
    },
  },
  {
    id: 'minimalist',
    name: '极简主义',
    styles: {
      fontSize: 16,
      lineHeight: 2.0,
      color: '#555555',
      titleColor: '#222222',
      titleFontSize: { 1: 22, 2: 20, 3: 18, 4: 16, 5: 15, 6: 14 },
      blockquoteBg: '#fafafa',
      blockquoteBorder: '#e0e0e0',
      codeBg: '#f5f5f5',
      linkColor: '#555555',
      firstLineIndent: false,
      paragraphSpacing: 24,
      letterSpacing: 1,
    },
  },
];

// ============================================================
// ThemeManager 实现
// ============================================================

/** 获取所有预设主题 */
export function getPresetThemes(): ThemeConfig[] {
  return PRESET_THEMES;
}

/** 获取指定 ID 的主题（含自定义主题） */
export function getTheme(id: string): ThemeConfig | undefined {
  const preset = PRESET_THEMES.find((theme) => theme.id === id);
  if (preset) return preset;
  // Check custom themes from localStorage
  try {
    const raw = localStorage.getItem('wf_custom_themes');
    if (raw) {
      const customs: ThemeConfig[] = JSON.parse(raw);
      return customs.find((t) => t.id === id);
    }
  } catch { /* */ }
  return undefined;
}

/** 合并用户自定义样式到主题，返回新的 ThemeConfig */
export function mergeCustomStyles(
  theme: ThemeConfig,
  overrides: Partial<ThemeStyles>,
): ThemeConfig {
  return {
    ...theme,
    styles: {
      ...theme.styles,
      ...overrides,
      // titleFontSize 需要深合并
      titleFontSize: overrides.titleFontSize
        ? { ...theme.styles.titleFontSize, ...overrides.titleFontSize }
        : theme.styles.titleFontSize,
    },
  };
}

/**
 * 将主题配置转换为 StyleMap（CSS 选择器 → 内联样式字符串）
 *
 * 映射规则（来自设计文档）：
 * - p:          fontSize, lineHeight, color, letterSpacing, paragraphSpacing, firstLineIndent
 * - h1-h6:     titleFontSize[level], titleColor, lineHeight
 * - blockquote: blockquoteBg, blockquoteBorder, fontSize, color
 * - pre, code:  codeBg, fontSize
 * - a:          linkColor
 * - img:        max-width: 100%
 * - ul, ol:     fontSize, color, lineHeight
 * - hr:         装饰样式（根据主题色生成）
 */
export function toStyleMap(theme: ThemeConfig): StyleMap {
  const s = theme.styles;
  const map: StyleMap = {};

  // 段落
  let pStyle =
    `font-size: ${s.fontSize}px; ` +
    `line-height: ${s.lineHeight}; ` +
    `color: ${s.color}; ` +
    `letter-spacing: ${s.letterSpacing}px; ` +
    `margin-bottom: ${s.paragraphSpacing}px;`;
  if (s.firstLineIndent) {
    pStyle += ' text-indent: 2em;';
  }
  map['p'] = pStyle;

  // 标题 h1-h6
  for (let level = 1; level <= 6; level++) {
    map[`h${level}`] =
      `font-size: ${s.titleFontSize[level as HeadingLevel]}px; ` +
      `color: ${s.titleColor}; ` +
      `line-height: ${s.lineHeight}; ` +
      `font-weight: bold; ` +
      `margin-bottom: ${s.paragraphSpacing}px;`;
  }

  // 引用块
  map['blockquote'] =
    `background: ${s.blockquoteBg}; ` +
    `border-left: 4px solid ${s.blockquoteBorder}; ` +
    `padding: 12px 16px; ` +
    `font-size: ${s.fontSize}px; ` +
    `color: ${s.color}; ` +
    `margin-bottom: ${s.paragraphSpacing}px;`;

  // 代码块
  map['pre'] =
    `background: ${s.codeBg}; ` +
    `padding: 12px 16px; ` +
    `border-radius: 4px; ` +
    `overflow-x: auto; ` +
    `font-size: ${s.fontSize - 1}px; ` +
    `margin-bottom: ${s.paragraphSpacing}px;`;

  map['code'] =
    `background: ${s.codeBg}; ` +
    `padding: 2px 4px; ` +
    `border-radius: 3px; ` +
    `font-size: ${s.fontSize - 1}px;`;

  // 链接
  map['a'] =
    `color: ${s.linkColor}; ` +
    `text-decoration: none;`;

  // 图片
  map['img'] =
    'max-width: 100%; ' +
    'height: auto;';

  // 列表
  const listStyle =
    `font-size: ${s.fontSize}px; ` +
    `color: ${s.color}; ` +
    `line-height: ${s.lineHeight}; ` +
    `margin-bottom: ${s.paragraphSpacing}px;`;
  map['ul'] = listStyle;
  map['ol'] = listStyle;

  // 分割线 - 装饰样式
  map['hr'] =
    'border: none; ' +
    `border-top: 1px solid ${s.blockquoteBorder}; ` +
    `margin: ${s.paragraphSpacing}px 0;`;

  return map;
}
