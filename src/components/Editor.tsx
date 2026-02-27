import { useState } from 'react';
import { useAppStore } from '../store/app-store';
import { MAX_CHAR_LIMIT } from '../core/formatter';
import { fileToDataUrl, insertAtCursor, buildImageMarkdown } from '../core/image-inserter';

export function Editor() {
  const markdown = useAppStore((s) => s.markdown);
  const setMarkdown = useAppStore((s) => s.setMarkdown);
  const cursorPosition = useAppStore((s) => s.cursorPosition);
  const setCursorPosition = useAppStore((s) => s.setCursorPosition);
  const format = useAppStore((s) => s.format);

  const [isDragging, setIsDragging] = useState(false);

  const charCount = markdown.length;
  const isOverLimit = charCount > MAX_CHAR_LIMIT;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_CHAR_LIMIT) return;
    setMarkdown(value);
  };

  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

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
      <textarea
        value={markdown}
        onChange={handleChange}
        onSelect={handleCursorChange}
        onClick={handleCursorChange}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`editor-textarea ${isDragging ? 'dragging' : ''}`}
        placeholder="在此输入 Markdown 内容..."
        aria-label="Markdown 编辑器"
      />
      <div className={`editor-status ${isOverLimit ? 'over-limit' : ''}`}>
        {isOverLimit && <span role="alert">字符数超出限制，请删减内容</span>}
        <span style={{ marginLeft: 'auto' }}>
          {charCount.toLocaleString()} / {MAX_CHAR_LIMIT.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
