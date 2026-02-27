import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImageDialog } from './ImageDialog';

describe('ImageDialog', () => {
  const defaultProps = {
    open: true,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  const setup = (overrides: Partial<typeof defaultProps> = {}) => {
    const props = { ...defaultProps, ...overrides };
    // Reset mocks each call
    props.onConfirm = overrides.onConfirm ?? vi.fn();
    props.onCancel = overrides.onCancel ?? vi.fn();
    return { ...render(<ImageDialog {...props} />), props };
  };

  it('renders nothing when open is false', () => {
    const { container } = render(
      <ImageDialog open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders dialog when open is true', () => {
    setup();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('图片 URL')).toBeInTheDocument();
    expect(screen.getByText('确认')).toBeInTheDocument();
    expect(screen.getByText('取消')).toBeInTheDocument();
  });

  it('disables confirm button when URL is empty', () => {
    setup();
    expect(screen.getByText('确认')).toBeDisabled();
  });

  it('disables confirm button when URL is whitespace only', () => {
    setup();
    fireEvent.change(screen.getByLabelText('图片 URL'), { target: { value: '   ' } });
    expect(screen.getByText('确认')).toBeDisabled();
  });

  it('enables confirm button when URL is non-empty', () => {
    setup();
    fireEvent.change(screen.getByLabelText('图片 URL'), {
      target: { value: 'https://example.com/img.png' },
    });
    expect(screen.getByText('确认')).toBeEnabled();
  });

  it('calls onConfirm with trimmed URL and clears input', () => {
    const { props } = setup();
    const input = screen.getByLabelText('图片 URL');
    fireEvent.change(input, { target: { value: '  https://example.com/img.png  ' } });
    fireEvent.click(screen.getByText('确认'));
    expect(props.onConfirm).toHaveBeenCalledWith('https://example.com/img.png');
  });

  it('does not call onConfirm when URL is empty', () => {
    const { props } = setup();
    fireEvent.click(screen.getByText('确认'));
    expect(props.onConfirm).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const { props } = setup();
    fireEvent.click(screen.getByText('取消'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Escape key is pressed', () => {
    const { props } = setup();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when overlay backdrop is clicked', () => {
    const { props } = setup();
    fireEvent.click(screen.getByTestId('image-dialog-overlay'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when dialog content is clicked', () => {
    const { props } = setup();
    fireEvent.click(screen.getByRole('dialog'));
    expect(props.onCancel).not.toHaveBeenCalled();
  });
});
