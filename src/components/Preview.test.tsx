import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Preview } from './Preview';
import { useAppStore } from '../store/app-store';

describe('Preview', () => {
  beforeEach(() => {
    useAppStore.setState({ markdown: '', formattedHtml: '' });
  });

  it('shows placeholder when markdown and formattedHtml are empty', () => {
    render(<Preview />);
    expect(screen.getByText('预览区域')).toBeInTheDocument();
    expect(screen.getByText(/在左侧输入 Markdown 内容/)).toBeInTheDocument();
  });

  it('shows placeholder when markdown is only whitespace', () => {
    useAppStore.setState({ markdown: '   \n\t  ', formattedHtml: '' });
    render(<Preview />);
    expect(screen.getByText('预览区域')).toBeInTheDocument();
  });

  it('renders formatted HTML when available', () => {
    useAppStore.setState({
      markdown: '# Hello',
      formattedHtml: '<h1>Hello</h1>',
    });
    render(<Preview />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByText('预览区域')).not.toBeInTheDocument();
  });

  it('has a preview-container class for styling', () => {
    const { container } = render(<Preview />);
    expect(container.querySelector('.preview-container')).not.toBeNull();
  });

  it('does not show placeholder when markdown has content but formattedHtml is empty', () => {
    useAppStore.setState({ markdown: 'some content', formattedHtml: '' });
    render(<Preview />);
    expect(screen.queryByText('预览区域')).not.toBeInTheDocument();
  });
});
