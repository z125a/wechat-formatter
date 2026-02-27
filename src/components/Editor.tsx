import { useState, useRef, useCallback } from 'react';
import { useAppStore } from '../store/app-store';
import { MAX_CHAR_LIMIT } from '../core/formatter';
import { fileToDataUrl, insertAtCursor, buildImageMarkdown } from '../core/image-inserter';
import { EditorToolbar } from './EditorToolbar';

export function Editor() {
  const markdown = useAppStore((s) => s.markdown);
  const setMarkdown = useAppStore((s) => s.setMarkdown);
  const cursorPosition = useAppStore((s) => s.cursorPosition);
  const setCursorPosition = useAppStore((s) => s.setCursorPosition);
  const format = useAppStore((s) => s.format);

  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = markdown.length;
  const isOverLimit = charCount > MAX_CHAR_LIMIT;
  const lineCount = markdown ? markdown.split('\n').length : 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_CHAR_LIMIT) return;
    setMarkdown(value);
  };

  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.ctrlKey || e.metaKey;
    if (!isMod) return;

    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = markdown.slice(start, end);

    let prefix = '';
    let suffix = '';

    if (e.key === 'b') {
      prefix = '**'; suffix = '**';
    } else if (e.key === 'i') {
      prefix = '*'; suffix = '*';
    } else if (e.key === 'k') {
      prefix = '['; suffix = '](url)';
    } else {
      return;
    }

    e.preventDefault();
    const newText = markdown.slice(0, start) + prefix + selected + suffix + markdown.slice(end);
    setMarkdown(newText);
  }, [markdown, setMarkdown]);

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const newContent = insertAtCursor(markdown, cursorPosition, buildImageMarkdown(dataUrl));
      setMarkdown(newContent);
      format();
    } catch { /* silently ignore */ }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EditorToolbar />
      <textarea
        ref={textareaRef}
        value={markdown}
        onChange={handleChange}
        onSelect={handleCursorChange}
        onClick={handleCursorChange}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`editor-textarea ${isDragging ? 'dragging' : ''}`}
        placeholder="在此输入 Markdown 内容...&#10;&#10;支持快捷键：Ctrl+B 加粗 / Ctrl+I 斜体 / Ctrl+K 链接"
        aria-label="Markdown 编辑器"
      />
      <div className={`editor-status ${isOverLimit ? 'over-limit' : ''}`}>
        {isOverLimit && <span role="alert">字符数超出限制，请删减内容</span>}
        <span className="editor-status-info">
          {lineCount} 行
        </span>
        <span style={{ marginLeft: 'auto' }}>
          {charCount.toLocaleString()} / {MAX_CHAR_LIMIT.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
