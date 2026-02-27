import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { StylePanel } from './StylePanel';
import { useAppStore } from '../store/app-store';
import { getTheme } from '../core/theme-manager';

function expandPanel() {
  fireEvent.click(screen.getByText(/展开/));
}

describe('StylePanel', () => {
  beforeEach(() => {
    useAppStore.setState({ currentThemeId: 'classic', customStyles: {} });
  });

  it('renders all adjustable parameters after expanding', () => {
    render(<StylePanel />);
    expandPanel();
    expect(screen.getByLabelText('字号')).toBeInTheDocument();
    expect(screen.getByLabelText('行高')).toBeInTheDocument();
    expect(screen.getByLabelText('字间距')).toBeInTheDocument();
    expect(screen.getByLabelText('段间距')).toBeInTheDocument();
    expect(screen.getByLabelText('正文色')).toBeInTheDocument();
    expect(screen.getByLabelText('标题色')).toBeInTheDocument();
    expect(screen.getByLabelText('链接色')).toBeInTheDocument();
    expect(screen.getByLabelText('首行缩进')).toBeInTheDocument();
  });

  it('displays current theme default values', () => {
    render(<StylePanel />);
    expandPanel();
    const classic = getTheme('classic')!;
    expect(screen.getByLabelText('字号')).toHaveValue(classic.styles.fontSize);
    expect(screen.getByLabelText('行高')).toHaveValue(classic.styles.lineHeight);
    expect(screen.getByLabelText('正文色')).toHaveValue(classic.styles.color);
    expect(screen.getByLabelText('标题色')).toHaveValue(classic.styles.titleColor);
    expect(screen.getByLabelText('链接色')).toHaveValue(classic.styles.linkColor);
  });

  it('updates store customStyles when fontSize changes', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('字号'), { target: { value: '18' } });
    expect(useAppStore.getState().customStyles.fontSize).toBe(18);
  });

  it('updates store customStyles when lineHeight changes', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('行高'), { target: { value: '2.0' } });
    expect(useAppStore.getState().customStyles.lineHeight).toBe(2.0);
  });

  it('updates store customStyles when color changes', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('正文色'), { target: { value: '#ff0000' } });
    expect(useAppStore.getState().customStyles.color).toBe('#ff0000');
  });

  it('updates store customStyles when titleColor changes', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('标题色'), { target: { value: '#00ff00' } });
    expect(useAppStore.getState().customStyles.titleColor).toBe('#00ff00');
  });

  it('updates store customStyles when linkColor changes', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('链接色'), { target: { value: '#0000ff' } });
    expect(useAppStore.getState().customStyles.linkColor).toBe('#0000ff');
  });

  it('updates letterSpacing', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('字间距'), { target: { value: '1.5' } });
    expect(useAppStore.getState().customStyles.letterSpacing).toBe(1.5);
  });

  it('updates paragraphSpacing', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('段间距'), { target: { value: '24' } });
    expect(useAppStore.getState().customStyles.paragraphSpacing).toBe(24);
  });

  it('toggles firstLineIndent', () => {
    render(<StylePanel />);
    expandPanel();
    const btn = screen.getByLabelText('首行缩进');
    fireEvent.click(btn);
    expect(useAppStore.getState().customStyles.firstLineIndent).toBe(true);
    fireEvent.click(btn);
    expect(useAppStore.getState().customStyles.firstLineIndent).toBe(false);
  });

  it('clamps fontSize to min 12', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('字号'), { target: { value: '5' } });
    expect(useAppStore.getState().customStyles.fontSize).toBe(12);
  });

  it('clamps fontSize to max 24', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('字号'), { target: { value: '30' } });
    expect(useAppStore.getState().customStyles.fontSize).toBe(24);
  });

  it('clamps lineHeight to min 1.2', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('行高'), { target: { value: '0.5' } });
    expect(useAppStore.getState().customStyles.lineHeight).toBe(1.2);
  });

  it('clamps lineHeight to max 2.5', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('行高'), { target: { value: '5' } });
    expect(useAppStore.getState().customStyles.lineHeight).toBe(2.5);
  });

  it('resets to new theme defaults when theme changes', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('字号'), { target: { value: '20' } });
    expect(useAppStore.getState().customStyles.fontSize).toBe(20);

    act(() => {
      useAppStore.getState().setThemeId('tech-blue');
    });
    const { rerender } = render(<StylePanel />);
    rerender(<StylePanel />);

    const expandBtns = screen.getAllByText(/展开/);
    expandBtns.forEach(btn => fireEvent.click(btn));

    const techBlue = getTheme('tech-blue')!;
    expect(screen.getAllByLabelText('字号')[0]).toHaveValue(techBlue.styles.fontSize);
  });

  it('preserves other custom values when changing one param', () => {
    render(<StylePanel />);
    expandPanel();
    fireEvent.change(screen.getByLabelText('字号'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('链接色'), { target: { value: '#abcdef' } });
    const cs = useAppStore.getState().customStyles;
    expect(cs.fontSize).toBe(20);
    expect(cs.linkColor).toBe('#abcdef');
  });
});
