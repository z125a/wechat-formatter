import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeSelector } from './ThemeSelector';
import { useAppStore } from '../store/app-store';
import { getPresetThemes } from '../core/theme-manager';

const themes = getPresetThemes();

describe('ThemeSelector', () => {
  beforeEach(() => {
    useAppStore.setState({ currentThemeId: 'classic', customStyles: {} });
  });

  it('renders all preset themes', () => {
    render(<ThemeSelector />);
    for (const theme of themes) {
      expect(screen.getByRole('radio', { name: theme.name })).toBeInTheDocument();
    }
  });

  it('highlights the currently selected theme', () => {
    render(<ThemeSelector />);
    const classicBtn = screen.getByRole('radio', { name: '经典黑白' });
    expect(classicBtn).toHaveAttribute('aria-checked', 'true');

    const techBtn = screen.getByRole('radio', { name: '科技蓝' });
    expect(techBtn).toHaveAttribute('aria-checked', 'false');
  });

  it('calls setThemeId on click and updates selection', () => {
    render(<ThemeSelector />);
    const techBtn = screen.getByRole('radio', { name: '科技蓝' });
    fireEvent.click(techBtn);

    expect(useAppStore.getState().currentThemeId).toBe('tech-blue');
  });

  it('reflects external store changes', () => {
    const { rerender } = render(<ThemeSelector />);
    act(() => {
      useAppStore.setState({ currentThemeId: 'warm-literary' });
    });
    rerender(<ThemeSelector />);

    expect(screen.getByRole('radio', { name: '暖色文艺' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '经典黑白' })).toHaveAttribute('aria-checked', 'false');
  });

  it('has a radiogroup with accessible label', () => {
    render(<ThemeSelector />);
    expect(screen.getByRole('radiogroup', { name: /主题选择/i })).toBeInTheDocument();
  });

  it('renders at least 3 theme options (Req 2.1)', () => {
    render(<ThemeSelector />);
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBeGreaterThanOrEqual(3);
  });
});
