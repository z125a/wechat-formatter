// ============================================================
// 核心类型定义 - 微信公众号推文排版工具
// ============================================================

// --- 主题相关类型 ---

/** 各级标题字号映射 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** 主题样式配置 */
export interface ThemeStyles {
  fontSize: number;                          // 正文字体大小 (px)
  lineHeight: number;                        // 正文行高
  color: string;                             // 正文颜色
  titleColor: string;                        // 标题颜色
  titleFontSize: Record<HeadingLevel, number>; // 各级标题字号
  blockquoteBg: string;                      // 引用块背景色
  blockquoteBorder: string;                  // 引用块边框色
  codeBg: string;                            // 代码块背景色
  linkColor: string;                         // 链接颜色
  firstLineIndent: boolean;                  // 是否首行缩进
  paragraphSpacing: number;                  // 段间距 (px)
  letterSpacing: number;                     // 字间距 (px)
}

/** 主题配置 */
export interface ThemeConfig {
  id: string;
  name: string;
  styles: ThemeStyles;
}

// --- 样式映射 ---

/** CSS 选择器 → 内联样式字符串 的映射表 */
export type StyleMap = Record<string, string>;

// --- 排版引擎 ---

/** 排版结果 */
export interface FormatterResult {
  html: string;        // 带内联样式的 HTML
  charCount: number;   // 字符计数
  success: boolean;    // 是否成功
  error?: string;      // 错误信息
}

// --- 本地存储 ---

/** 本地存储数据结构 */
export interface StorageData {
  content: string;                      // 编辑器内容
  themeId: string;                      // 当前主题 ID
  customStyles: Partial<ThemeStyles>;   // 用户自定义样式
  lastSaved: number;                    // 最后保存时间戳
}

// --- 剪贴板 ---

/** 复制操作结果 */
export interface CopyResult {
  success: boolean;
  error?: string;
}

// --- Markdown 解析器选项 ---

/** Markdown 解析器配置 */
export interface MarkdownParserOptions {
  html: boolean;         // 是否允许 HTML 标签
  breaks: boolean;       // 是否将换行转为 <br>
  linkify: boolean;      // 是否自动识别链接
  typographer: boolean;  // 是否启用排版优化
}

// --- 状态管理 ---

/** 应用全局状态 */
export interface AppState {
  // 编辑器状态
  markdown: string;
  setMarkdown: (md: string) => void;

  // 主题状态
  currentThemeId: string;
  setThemeId: (id: string) => void;
  customStyles: Partial<ThemeStyles>;
  setCustomStyles: (styles: Partial<ThemeStyles>) => void;

  // 排版结果
  formattedHtml: string;
  charCount: number;

  // 存储状态
  storageAvailable: boolean;

  // 光标位置（用于图片插入）
  cursorPosition: number;
  setCursorPosition: (pos: number) => void;

  // 素材面板状态
  assetPanelOpen: boolean;
  setAssetPanelOpen: (open: boolean) => void;

  // 操作
  format: () => void;
  copyToClipboard: () => Promise<CopyResult>;
}

// --- 素材库类型 ---

/** 素材分类 */
export type AssetCategory = 'image' | 'divider' | 'emoji' | 'text-block';

/** 素材项基础结构 */
export interface AssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  tags: string[];
  content: string;       // 插入编辑器的文本内容（Markdown 或 HTML）
  preview?: string;      // 可选的预览用 HTML（用于面板中展示）
}

/** 图片分类 */
export type ImageCategory = 'technology' | 'business' | 'nature' | 'food' | 'city' | 'people' | 'abstract';

/** 图片素材 */
export interface ImageAsset {
  id: string;
  name: string;
  category: ImageCategory;
  thumbnailUrl: string;  // 缩略图 URL
  fullUrl: string;       // 完整图片 URL
  alt: string;           // 替代文本
}

/** Emoji 分类 */
export type EmojiCategory = 'faces' | 'gestures' | 'animals' | 'food' | 'travel' | 'objects' | 'symbols';

/** Emoji 项 */
export interface EmojiItem {
  char: string;          // Emoji 字符
  name: string;          // 名称（中文）
  category: EmojiCategory;
}
