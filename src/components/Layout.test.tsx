import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Layout } from './Layout';
import { useAppStore } from '../store/app-store';

describe('Layout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useAppStore.setState({
      markdown: '',
      currentThemeId: 'classic',
      customStyles: {},
      formattedHtml: '',
      charCount: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders all child components', () => {
    render(<Layout />);

    // Editor textarea
    expect(screen.getByLabelText('Markdown 编辑器')).toBeDefined();

    // Preview placeholder
    expect(screen.getByText(/预览区域/)).toBeDefined();

    // ThemeSelector
    expect(screen.getByRole('radiogroup', { name: '主题选择' })).toBeDefined();

    // StylePanel
    expect(screen.getByLabelText('样式微调')).toBeDefined();

    // Toolbar buttons
    expect(screen.getByText('一键排版')).toBeDefined();
    expect(screen.getByText('复制')).toBeDefined();
  });

  it('has a main area with layout-main class for responsive behavior', () => {
    const { container } = render(<Layout />);
    const main = container.querySelector('main.layout-main');
    expect(main).not.toBeNull();
  });

  it('wraps editor and preview in separate scrollable containers', () => {
    const { container } = render(<Layout />);
    const editorPane = container.querySelector('.layout-editor');
    const previewPane = container.querySelector('.layout-preview');
    expect(editorPane).not.toBeNull();
    expect(previewPane).not.toBeNull();
  });

  it('auto-formats after 500ms when markdown changes', () => {
    render(<Layout />);
    const textarea = screen.getByLabelText('Markdown 编辑器');

    act(() => {
      fireEvent.change(textarea, { target: { value: '# Hello' } });
    });

    // Before 500ms, formattedHtml should still be empty
    expect(useAppStore.getState().formattedHtml).toBe('');

    // Advance timers by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // After 500ms, format() should have been called and formattedHtml updated
    expect(useAppStore.getState().formattedHtml).not.toBe('');
  });

  it('debounces format calls within 500ms', () => {
    render(<Layout />);
    const textarea = screen.getByLabelText('Markdown 编辑器');

    const formatSpy = vi.fn(useAppStore.getState().format);
    useAppStore.setState({ format: formatSpy });

    act(() => {
      fireEvent.change(textarea, { target: { value: 'a' } });
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      fireEvent.change(textarea, { target: { value: 'ab' } });
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      fireEvent.change(textarea, { target: { value: 'abc' } });
    });

    // Only 500ms after the LAST change should format be called
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // format should have been called only once (for the last change)
    expect(formatSpy).toHaveBeenCalledTimes(1);
  });

  it('auto-formats when theme changes', () => {
    useAppStore.setState({ markdown: '# Test' });
    render(<Layout />);

    // Let initial format run
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const htmlAfterClassic = useAppStore.getState().formattedHtml;

    // Switch theme
    act(() => {
      useAppStore.getState().setThemeId('tech-blue');
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const htmlAfterTechBlue = useAppStore.getState().formattedHtml;
    // Both should have content, but styles differ
    expect(htmlAfterClassic).not.toBe('');
    expect(htmlAfterTechBlue).not.toBe('');
    expect(htmlAfterClassic).not.toBe(htmlAfterTechBlue);
  });
});
