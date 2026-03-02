import { create } from 'zustand';
import type { AppState, ArticleMeta, CopyResult, ThemeStyles } from '../types';
import { format } from '../core/formatter';
import { getTheme, mergeCustomStyles } from '../core/theme-manager';
import { storageService } from '../services/storage-service';
import { clipboardService } from '../services/clipboard-service';

// ============================================================
// Undo/Redo history (kept outside zustand to avoid serialization)
// ============================================================
const MAX_HISTORY = 100;
let undoStack: string[] = [];
let redoStack: string[] = [];

function pushUndo(content: string) {
  undoStack.push(content);
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
  redoStack = [];
}

// ============================================================
// Multi-article helpers
// ============================================================
const ARTICLES_KEY = 'wf_articles';
const ACTIVE_KEY = 'wf_active_article';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadArticles(): ArticleMeta[] {
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveArticles(articles: ArticleMeta[]) {
  try { localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles)); } catch { /* */ }
}

function loadActiveId(): string {
  try { return localStorage.getItem(ACTIVE_KEY) || ''; } catch { return ''; }
}

function saveActiveId(id: string) {
  try { localStorage.setItem(ACTIVE_KEY, id); } catch { /* */ }
}

function loadArticleContent(id: string): string {
  try { return localStorage.getItem(`wf_art_${id}`) || ''; } catch { return ''; }
}

function saveArticleContent(id: string, content: string) {
  try { localStorage.setItem(`wf_art_${id}`, content); } catch { /* */ }
}

function deleteArticleContent(id: string) {
  try { localStorage.removeItem(`wf_art_${id}`); } catch { /* */ }
}

// ============================================================
// Initial state
// ============================================================

function loadInitialState(): {
  markdown: string;
  currentThemeId: string;
  customStyles: Partial<ThemeStyles>;
  storageAvailable: boolean;
  articles: ArticleMeta[];
  activeArticleId: string;
} {
  const available = storageService.isAvailable();
  let articles = loadArticles();
  let activeId = loadActiveId();

  // Migration: if articles empty but old storage exists, migrate
  if (articles.length === 0 && available) {
    const saved = storageService.load();
    const id = generateId();
    articles = [{ id, name: '未命名文章', updatedAt: Date.now() }];
    activeId = id;
    if (saved) {
      saveArticleContent(id, saved.content);
      saveArticles(articles);
      saveActiveId(id);
      return {
        markdown: saved.content,
        currentThemeId: saved.themeId,
        customStyles: saved.customStyles,
        storageAvailable: true,
        articles,
        activeArticleId: id,
      };
    }
    saveArticles(articles);
    saveActiveId(id);
  }

  if (!activeId && articles.length > 0) {
    activeId = articles[0].id;
    saveActiveId(activeId);
  }

  const markdown = activeId ? loadArticleContent(activeId) : '';

  if (available) {
    const saved = storageService.load();
    if (saved) {
      return {
        markdown: markdown || saved.content,
        currentThemeId: saved.themeId,
        customStyles: saved.customStyles,
        storageAvailable: true,
        articles,
        activeArticleId: activeId,
      };
    }
  }

  return {
    markdown,
    currentThemeId: 'classic',
    customStyles: {},
    storageAvailable: available,
    articles,
    activeArticleId: activeId,
  };
}

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

  // 全屏模式
  fullscreen: false,
  setFullscreen: (fs: boolean) => set({ fullscreen: fs }),

  // 撤销/重做
  canUndo: false,
  canRedo: false,

  undo: () => {
    if (undoStack.length === 0) return;
    const current = get().markdown;
    redoStack.push(current);
    const prev = undoStack.pop()!;
    set({ markdown: prev, canUndo: undoStack.length > 0, canRedo: true });
    const state = get();
    triggerSave(prev, state.currentThemeId, state.customStyles);
    saveArticleContent(state.activeArticleId, prev);
  },

  redo: () => {
    if (redoStack.length === 0) return;
    const current = get().markdown;
    undoStack.push(current);
    const next = redoStack.pop()!;
    set({ markdown: next, canUndo: true, canRedo: redoStack.length > 0 });
    const state = get();
    triggerSave(next, state.currentThemeId, state.customStyles);
    saveArticleContent(state.activeArticleId, next);
  },

  // 多文章管理
  articles: initial.articles,
  activeArticleId: initial.activeArticleId,

  createArticle: (name?: string) => {
    const id = generateId();
    const meta: ArticleMeta = { id, name: name || '未命名文章', updatedAt: Date.now() };
    // Save current article content first
    const state = get();
    saveArticleContent(state.activeArticleId, state.markdown);
    const articles = [...state.articles, meta];
    saveArticles(articles);
    saveActiveId(id);
    saveArticleContent(id, '');
    undoStack = [];
    redoStack = [];
    set({ articles, activeArticleId: id, markdown: '', formattedHtml: '', canUndo: false, canRedo: false });
  },

  switchArticle: (id: string) => {
    const state = get();
    if (id === state.activeArticleId) return;
    // Save current
    saveArticleContent(state.activeArticleId, state.markdown);
    // Load target
    const content = loadArticleContent(id);
    saveActiveId(id);
    undoStack = [];
    redoStack = [];
    set({ activeArticleId: id, markdown: content, canUndo: false, canRedo: false });
    triggerSave(content, state.currentThemeId, state.customStyles);
  },

  deleteArticle: (id: string) => {
    const state = get();
    const articles = state.articles.filter((a) => a.id !== id);
    deleteArticleContent(id);
    if (articles.length === 0) {
      // Create a new default article
      const newId = generateId();
      const meta: ArticleMeta = { id: newId, name: '未命名文章', updatedAt: Date.now() };
      articles.push(meta);
      saveArticles(articles);
      saveActiveId(newId);
      saveArticleContent(newId, '');
      undoStack = [];
      redoStack = [];
      set({ articles, activeArticleId: newId, markdown: '', formattedHtml: '', canUndo: false, canRedo: false });
      return;
    }
    saveArticles(articles);
    if (id === state.activeArticleId) {
      const newActive = articles[0].id;
      const content = loadArticleContent(newActive);
      saveActiveId(newActive);
      undoStack = [];
      redoStack = [];
      set({ articles, activeArticleId: newActive, markdown: content, canUndo: false, canRedo: false });
    } else {
      set({ articles });
    }
  },

  renameArticle: (id: string, name: string) => {
    const articles = get().articles.map((a) =>
      a.id === id ? { ...a, name, updatedAt: Date.now() } : a
    );
    saveArticles(articles);
    set({ articles });
  },

  // 存储状态
  storageAvailable: initial.storageAvailable,

  setMarkdown: (md: string) => {
    const prev = get().markdown;
    if (prev !== md) pushUndo(prev);
    set({ markdown: md, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0 });
    const state = get();
    triggerSave(md, state.currentThemeId, state.customStyles);
    // Update article content & meta
    saveArticleContent(state.activeArticleId, md);
    const articles = state.articles.map((a) =>
      a.id === state.activeArticleId ? { ...a, updatedAt: Date.now() } : a
    );
    saveArticles(articles);
    set({ articles });
  },

  setThemeId: (id: string) => {
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
