import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Toolbar } from './Toolbar';
import { useAppStore } from '../store/app-store';

// Mock the store actions
vi.mock('../store/app-store', async () => {
  const { create } = await import('zustand');

  let mockFormat = vi.fn();
  let mockCopyToClipboard = vi.fn().mockResolvedValue({ success: true });

  const useAppStore = create(() => ({
    markdown: '',
    currentThemeId: 'classic',
    customStyles: {},
    formattedHtml: '',
    charCount: 0,
    setMarkdown: vi.fn(),
    setThemeId: vi.fn(),
    setCustomStyles: vi.fn(),
    format: mockFormat,
    copyToClipboard: mockCopyToClipboard,
    cursorPosition: 0,
    setCursorPosition: vi.fn(),
    assetPanelOpen: false,
    setAssetPanelOpen: vi.fn(),
    fullscreen: false,
    setFullscreen: vi.fn(),
    canUndo: false,
    canRedo: false,
    undo: vi.fn(),
    redo: vi.fn(),
    articles: [{ id: 'test-1', name: '测试文章', updatedAt: Date.now() }],
    activeArticleId: 'test-1',
    createArticle: vi.fn(),
    switchArticle: vi.fn(),
    deleteArticle: vi.fn(),
    renameArticle: vi.fn(),
  }));

  return { useAppStore };
});

describe('Toolbar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const state = useAppStore.getState();
    (state.format as ReturnType<typeof vi.fn>).mockClear();
    (state.copyToClipboard as ReturnType<typeof vi.fn>).mockReset().mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders format and copy buttons', () => {
    render(<Toolbar />);
    expect(screen.getByText(/一键排版/)).toBeInTheDocument();
    expect(screen.getByText(/复制/)).toBeInTheDocument();
  });

  it('calls store.format() when format button is clicked', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByText(/一键排版/));
    expect(useAppStore.getState().format).toHaveBeenCalledTimes(1);
  });

  it('calls store.copyToClipboard() when copy button is clicked', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText(/复制/));
    });
    expect(useAppStore.getState().copyToClipboard).toHaveBeenCalledTimes(1);
  });

  it('shows success toast after successful copy', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText(/复制/));
    });
    expect(screen.getByRole('status')).toHaveTextContent('已复制到剪贴板');
  });

  it('shows error toast after failed copy', async () => {
    (useAppStore.getState().copyToClipboard as ReturnType<typeof vi.fn>)
      .mockResolvedValue({ success: false, error: '剪贴板不可用' });

    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText(/复制/));
    });
    expect(screen.getByRole('status')).toHaveTextContent('剪贴板不可用');
  });

  it('shows generic error message when error field is undefined', async () => {
    (useAppStore.getState().copyToClipboard as ReturnType<typeof vi.fn>)
      .mockResolvedValue({ success: false });

    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText(/复制/));
    });
    expect(screen.getByRole('status')).toHaveTextContent('复制失败');
  });

  it('auto-dismisses toast after 3 seconds', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText(/复制/));
    });
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not show toast initially', () => {
    render(<Toolbar />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('applies success class to success toast', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText(/复制/));
    });
    const toast = screen.getByRole('status');
    expect(toast.classList.contains('toast-success')).toBe(true);
  });

  it('applies error class to error toast', async () => {
    (useAppStore.getState().copyToClipboard as ReturnType<typeof vi.fn>)
      .mockResolvedValue({ success: false, error: '失败' });

    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText(/复制/));
    });
    const toast = screen.getByRole('status');
    expect(toast.classList.contains('toast-error')).toBe(true);
  });
});
