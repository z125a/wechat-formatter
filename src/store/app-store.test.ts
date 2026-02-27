import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { StorageData, CopyResult } from '../types';

// --- Mock dependencies before importing the store ---

const mockLoad = vi.fn<() => StorageData | null>().mockReturnValue(null);
const mockDebouncedSave = vi.fn();
const mockCancelPendingDebounce = vi.fn();
const mockSave = vi.fn().mockReturnValue(true);
const mockIsAvailable = vi.fn().mockReturnValue(true);

vi.mock('../services/storage-service', () => ({
  storageService: {
    load: (...args: unknown[]) => mockLoad(...(args as [])),
    save: (...args: unknown[]) => mockSave(...(args as [])),
    debouncedSave: (...args: unknown[]) => mockDebouncedSave(...(args as [])),
    cancelPendingDebounce: (...args: unknown[]) => mockCancelPendingDebounce(...(args as [])),
    isAvailable: (...args: unknown[]) => mockIsAvailable(...(args as [])),
  },
}));

const mockCopyRichText = vi.fn<(html: string) => Promise<CopyResult>>()
  .mockResolvedValue({ success: true });

vi.mock('../services/clipboard-service', () => ({
  clipboardService: {
    copyRichText: (...args: unknown[]) => mockCopyRichText(...(args as [string])),
  },
}));

// We don't mock formatter or theme-manager — they are pure functions and safe to use directly.

// Dynamic import so mocks are in place before module evaluation
async function createFreshStore() {
  // Reset modules so loadInitialState() re-runs with current mockLoad value
  vi.resetModules();
  const mod = await import('./app-store');
  return mod.useAppStore;
}

describe('useAppStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoad.mockReturnValue(null);
    mockIsAvailable.mockReturnValue(true);
  });

  // --- Initial state ---

  it('should have correct default initial state when storage is empty', async () => {
    const useStore = await createFreshStore();
    const state = useStore.getState();

    expect(state.markdown).toBe('');
    expect(state.currentThemeId).toBe('classic');
    expect(state.customStyles).toEqual({});
    expect(state.formattedHtml).toBe('');
    expect(state.charCount).toBe(0);
    expect(state.storageAvailable).toBe(true);
  });

  it('should restore state from StorageService on initialization', async () => {
    mockLoad.mockReturnValue({
      content: '# Restored',
      themeId: 'tech-blue',
      customStyles: { fontSize: 18 },
      lastSaved: 1000,
    });

    const useStore = await createFreshStore();
    const state = useStore.getState();

    expect(state.markdown).toBe('# Restored');
    expect(state.currentThemeId).toBe('tech-blue');
    expect(state.customStyles).toEqual({ fontSize: 18 });
  });

  it('should set storageAvailable to false when localStorage is unavailable (Req 7.4)', async () => {
    mockIsAvailable.mockReturnValue(false);

    const useStore = await createFreshStore();
    const state = useStore.getState();

    expect(state.storageAvailable).toBe(false);
    expect(state.markdown).toBe('');
    expect(state.currentThemeId).toBe('classic');
    // load() should not be called when storage is unavailable
    expect(mockLoad).not.toHaveBeenCalled();
  });

  // --- setMarkdown ---

  it('should update markdown via setMarkdown', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setMarkdown('hello');
    expect(useStore.getState().markdown).toBe('hello');
  });

  it('should trigger debouncedSave when markdown changes', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setMarkdown('new content');

    expect(mockDebouncedSave).toHaveBeenCalledTimes(1);
    const savedData = mockDebouncedSave.mock.calls[0][0] as StorageData;
    expect(savedData.content).toBe('new content');
    expect(savedData.themeId).toBe('classic');
  });

  // --- setThemeId ---

  it('should update currentThemeId via setThemeId', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setThemeId('warm-literary');
    expect(useStore.getState().currentThemeId).toBe('warm-literary');
  });

  it('should reset customStyles to {} when theme changes (Req 8.3)', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setCustomStyles({ fontSize: 20, color: '#000' });
    expect(useStore.getState().customStyles).toEqual({ fontSize: 20, color: '#000' });

    useStore.getState().setThemeId('tech-blue');
    expect(useStore.getState().customStyles).toEqual({});
  });

  it('should trigger debouncedSave when theme changes', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setThemeId('tech-blue');

    expect(mockDebouncedSave).toHaveBeenCalledTimes(1);
    const savedData = mockDebouncedSave.mock.calls[0][0] as StorageData;
    expect(savedData.themeId).toBe('tech-blue');
    expect(savedData.customStyles).toEqual({});
  });

  // --- setCustomStyles ---

  it('should update customStyles via setCustomStyles', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setCustomStyles({ lineHeight: 2.0 });
    expect(useStore.getState().customStyles).toEqual({ lineHeight: 2.0 });
  });

  // --- format ---

  it('should format markdown and update formattedHtml and charCount', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setMarkdown('**bold text**');
    useStore.getState().format();

    const state = useStore.getState();
    expect(state.formattedHtml).toContain('<strong>bold text</strong>');
    expect(state.charCount).toBe('**bold text**'.length);
  });

  it('should produce empty html for empty markdown', async () => {
    const useStore = await createFreshStore();
    // markdown is '' by default
    useStore.getState().format();

    const state = useStore.getState();
    expect(state.formattedHtml).toBe('');
  });

  it('should apply customStyles when formatting', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setMarkdown('Hello world');
    useStore.getState().setCustomStyles({ fontSize: 20 });
    useStore.getState().format();

    const state = useStore.getState();
    expect(state.formattedHtml).toContain('font-size: 20px');
  });

  it('should produce empty html when theme is not found', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setMarkdown('some text');
    useStore.getState().setThemeId('nonexistent-theme');
    useStore.getState().format();

    const state = useStore.getState();
    expect(state.formattedHtml).toBe('');
    expect(state.charCount).toBe('some text'.length);
  });

  // --- Requirement 2.5: theme switch preserves markdown ---

  it('should preserve markdown content when switching themes (Req 2.5)', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setMarkdown('# My Article');
    useStore.getState().setThemeId('tech-blue');

    expect(useStore.getState().markdown).toBe('# My Article');
  });

  // --- copyToClipboard ---

  it('should call clipboardService.copyRichText with formattedHtml', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setMarkdown('test');
    useStore.getState().format();

    const result = await useStore.getState().copyToClipboard();
    expect(result.success).toBe(true);
    expect(mockCopyRichText).toHaveBeenCalledWith(useStore.getState().formattedHtml);
  });

  it('should propagate clipboard failure', async () => {
    mockCopyRichText.mockResolvedValueOnce({ success: false, error: 'denied' });

    const useStore = await createFreshStore();
    const result = await useStore.getState().copyToClipboard();
    expect(result.success).toBe(false);
    expect(result.error).toBe('denied');
  });

  // --- assetPanelOpen ---

  it('should default assetPanelOpen to false', async () => {
    const useStore = await createFreshStore();
    expect(useStore.getState().assetPanelOpen).toBe(false);
  });

  it('should set assetPanelOpen to true via setAssetPanelOpen', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setAssetPanelOpen(true);
    expect(useStore.getState().assetPanelOpen).toBe(true);
  });

  it('should set assetPanelOpen back to false via setAssetPanelOpen', async () => {
    const useStore = await createFreshStore();
    useStore.getState().setAssetPanelOpen(true);
    expect(useStore.getState().assetPanelOpen).toBe(true);
    useStore.getState().setAssetPanelOpen(false);
    expect(useStore.getState().assetPanelOpen).toBe(false);
  });
});
