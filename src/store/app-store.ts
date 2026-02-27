import { create } from 'zustand';
import type { AppState, CopyResult, ThemeStyles } from '../types';
import { format } from '../core/formatter';
import { getTheme, mergeCustomStyles } from '../core/theme-manager';
import { storageService } from '../services/storage-service';
import { clipboardService } from '../services/clipboard-service';

/** 从 StorageService 恢复初始状态 */
function loadInitialState(): {
  markdown: string;
  currentThemeId: string;
  customStyles: Partial<ThemeStyles>;
  storageAvailable: boolean;
} {
  const available = storageService.isAvailable();
  if (available) {
    const saved = storageService.load();
    if (saved) {
      return {
        markdown: saved.content,
        currentThemeId: saved.themeId,
        customStyles: saved.customStyles,
        storageAvailable: true,
      };
    }
  }
  return {
    markdown: '',
    currentThemeId: 'classic',
    customStyles: {},
    storageAvailable: available,
  };
}

/** 触发防抖保存 */
function triggerSave(
  markdown: string,
  currentThemeId: string,
  customStyles: Partial<ThemeStyles>,
): void {
  storageService.debouncedSave({
    content: markdown,
    themeId: currentThemeId,
    customStyles,
    lastSaved: Date.now(),
  });
}

const initial = loadInitialState();

export const useAppStore = create<AppState>((set, get) => ({
  // 编辑器状态
  markdown: initial.markdown,
  currentThemeId: initial.currentThemeId,
  customStyles: initial.customStyles,

  // 排版结果
  formattedHtml: '',
  charCount: 0,

  // 光标位置
  cursorPosition: 0,

  // 素材面板状态
  assetPanelOpen: false,
  setAssetPanelOpen: (open: boolean) => set({ assetPanelOpen: open }),

  // 存储状态
  storageAvailable: initial.storageAvailable,

  setMarkdown: (md: string) => {
    set({ markdown: md });
    const state = get();
    triggerSave(md, state.currentThemeId, state.customStyles);
  },

  setThemeId: (id: string) => {
    // Requirement 8.3: 切换主题时重置自定义样式
    set({ currentThemeId: id, customStyles: {} });
    const state = get();
    triggerSave(state.markdown, id, {});
  },

  setCustomStyles: (styles: Partial<ThemeStyles>) => {
    set({ customStyles: styles });
  },

  setCursorPosition: (pos: number) => {
    set({ cursorPosition: pos });
  },

  format: () => {
    const { markdown, currentThemeId, customStyles } = get();
    const theme = getTheme(currentThemeId);
    if (!theme) {
      set({ formattedHtml: '', charCount: markdown.length });
      return;
    }
    const merged = mergeCustomStyles(theme, customStyles);
    const result = format(markdown, merged);
    set({
      formattedHtml: result.html,
      charCount: result.charCount,
    });
  },

  copyToClipboard: async (): Promise<CopyResult> => {
    const { formattedHtml } = get();
    return clipboardService.copyRichText(formattedHtml);
  },
}));
