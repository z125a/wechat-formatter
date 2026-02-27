import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  }));

  return { useAppStore };
});

describe('Toolbar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset mock functions before each test
    const state = useAppStore.getState();
    (state.format as ReturnType<typeof vi.fn>).mockClear();
    (state.copyToClipboard as ReturnType<typeof vi.fn>).mockReset().mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders format and copy buttons', () => {
    render(<Toolbar />);
    expect(screen.getByText('一键排版')).toBeInTheDocument();
    expect(screen.getByText('复制')).toBeInTheDocument();
  });

  it('calls store.format() when "一键排版" button is clicked', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByText('一键排版'));
    expect(useAppStore.getState().format).toHaveBeenCalledTimes(1);
  });

  it('calls store.copyToClipboard() when "复制" button is clicked', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText('复制'));
    });
    expect(useAppStore.getState().copyToClipboard).toHaveBeenCalledTimes(1);
  });

  it('shows success toast after successful copy', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText('复制'));
    });
    expect(screen.getByRole('status')).toHaveTextContent('复制成功');
  });

  it('shows error toast after failed copy', async () => {
    (useAppStore.getState().copyToClipboard as ReturnType<typeof vi.fn>)
      .mockResolvedValue({ success: false, error: '剪贴板不可用' });

    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText('复制'));
    });
    expect(screen.getByRole('status')).toHaveTextContent('剪贴板不可用');
  });

  it('shows generic error message when error field is undefined', async () => {
    (useAppStore.getState().copyToClipboard as ReturnType<typeof vi.fn>)
      .mockResolvedValue({ success: false });

    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText('复制'));
    });
    expect(screen.getByRole('status')).toHaveTextContent('复制失败');
  });

  it('auto-dismisses toast after 3 seconds', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText('复制'));
    });
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // toast is now in exit animation state
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

  it('applies success styling to success toast', async () => {
    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText('复制'));
    });
    const toast = screen.getByRole('status');
    expect(toast).toHaveStyle({ backgroundColor: '#43a047' });
  });

  it('applies error styling to error toast', async () => {
    (useAppStore.getState().copyToClipboard as ReturnType<typeof vi.fn>)
      .mockResolvedValue({ success: false, error: '失败' });

    render(<Toolbar />);
    await act(async () => {
      fireEvent.click(screen.getByText('复制'));
    });
    const toast = screen.getByRole('status');
    expect(toast).toHaveStyle({ backgroundColor: '#d32f2f' });
  });
});
