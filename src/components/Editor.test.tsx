import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from './Editor';
import { useAppStore } from '../store/app-store';
import { MAX_CHAR_LIMIT } from '../core/formatter';

describe('Editor', () => {
  beforeEach(() => {
    useAppStore.setState({ markdown: '' });
  });

  it('renders a textarea with monospace font', () => {
    render(<Editor />);
    const textarea = screen.getByRole('textbox', { name: /markdown/i });
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveStyle({ fontFamily: 'monospace' });
  });

  it('displays character count as "0 / 50000" when empty', () => {
    render(<Editor />);
    expect(screen.getByText(`0 / ${MAX_CHAR_LIMIT}`)).toBeInTheDocument();
  });

  it('updates store and character count on input', () => {
    render(<Editor />);
    const textarea = screen.getByRole('textbox', { name: /markdown/i });
    fireEvent.change(textarea, { target: { value: 'hello' } });
    expect(useAppStore.getState().markdown).toBe('hello');
    expect(screen.getByText(`5 / ${MAX_CHAR_LIMIT}`)).toBeInTheDocument();
  });

  it('prevents input beyond MAX_CHAR_LIMIT', () => {
    const longText = 'a'.repeat(MAX_CHAR_LIMIT);
    useAppStore.setState({ markdown: longText });
    render(<Editor />);
    const textarea = screen.getByRole('textbox', { name: /markdown/i });

    // Attempt to type one more character
    fireEvent.change(textarea, { target: { value: longText + 'x' } });
    // Should still be at the limit, not beyond
    expect(useAppStore.getState().markdown).toBe(longText);
  });

  it('shows over-limit warning when charCount exceeds limit', () => {
    // Directly set state beyond limit to simulate edge case
    const overText = 'a'.repeat(MAX_CHAR_LIMIT + 1);
    useAppStore.setState({ markdown: overText });
    render(<Editor />);
    expect(screen.getByRole('alert')).toHaveTextContent('字符数超出限制');
  });

  it('reflects store markdown value in textarea', () => {
    useAppStore.setState({ markdown: '# Title' });
    render(<Editor />);
    const textarea = screen.getByRole('textbox', { name: /markdown/i });
    expect(textarea).toHaveValue('# Title');
  });
});
