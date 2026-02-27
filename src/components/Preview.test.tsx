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
    expect(
      screen.getByText('预览区域 - 请在左侧输入 Markdown 内容'),
    ).toBeInTheDocument();
  });

  it('shows placeholder when markdown is only whitespace', () => {
    useAppStore.setState({ markdown: '   \n\t  ', formattedHtml: '' });
    render(<Preview />);
    expect(
      screen.getByText('预览区域 - 请在左侧输入 Markdown 内容'),
    ).toBeInTheDocument();
  });

  it('renders formatted HTML when available', () => {
    useAppStore.setState({
      markdown: '# Hello',
      formattedHtml: '<h1>Hello</h1>',
    });
    render(<Preview />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(
      screen.queryByText('预览区域 - 请在左侧输入 Markdown 内容'),
    ).not.toBeInTheDocument();
  });

  it('supports independent scrolling via overflow-y auto', () => {
    render(<Preview />);
    const container = screen.getByText(
      '预览区域 - 请在左侧输入 Markdown 内容',
    ).parentElement!;
    expect(container).toHaveStyle({ overflowY: 'auto' });
  });

  it('does not show placeholder when markdown has content but formattedHtml is empty', () => {
    useAppStore.setState({ markdown: 'some content', formattedHtml: '' });
    render(<Preview />);
    expect(
      screen.queryByText('预览区域 - 请在左侧输入 Markdown 内容'),
    ).not.toBeInTheDocument();
  });
});
