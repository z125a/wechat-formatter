import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useAppStore } from './store/app-store';

// Mock the Layout component to keep tests focused
vi.mock('./components/Layout', () => ({
  Layout: () => <div data-testid="layout">Layout</div>,
}));

describe('App', () => {
  beforeEach(() => {
    // Reset store to defaults
    useAppStore.setState({ storageAvailable: true });
  });

  it('should not show storage warning when localStorage is available', () => {
    render(<App />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('should show storage warning when localStorage is unavailable (Req 7.4)', () => {
    useAppStore.setState({ storageAvailable: false });
    render(<App />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toContain('本地存储不可用');
  });

  it('should always render Layout regardless of storage availability', () => {
    useAppStore.setState({ storageAvailable: false });
    render(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
