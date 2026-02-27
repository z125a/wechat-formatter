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
    if (value.length > MAX_CHAR_LIMIT) {
      return;
    }
    setMarkdown(value);
  };

  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      const imgMarkdown = buildImageMarkdown(dataUrl);
      const newContent = insertAtCursor(markdown, cursorPosition, imgMarkdown);
      setMarkdown(newContent);
      format();
    } catch {
      // silently ignore read errors
    }
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
        className="focus-highlight"
        placeholder="在此输入 Markdown 内容..."
        aria-label="Markdown 编辑器"
        style={{
          flex: 1,
          resize: 'none',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: 1.6,
          padding: '12px',
          border: isDragging ? '2px dashed #1976d2' : '1px solid #ddd',
          borderRadius: '4px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          fontSize: '12px',
          color: isOverLimit ? '#d32f2f' : '#888',
        }}
      >
        {isOverLimit && <span role="alert">字符数超出限制，请删减内容</span>}
        <span style={{ marginLeft: 'auto' }}>
          {charCount} / {MAX_CHAR_LIMIT}
        </span>
      </div>
    </div>
  );
}
