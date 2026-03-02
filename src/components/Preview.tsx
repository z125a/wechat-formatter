import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/app-store';

export function Preview() {
  const formattedHtml = useAppStore((s) => s.formattedHtml);
  const markdown = useAppStore((s) => s.markdown);
  const containerRef = useRef<HTMLDivElement>(null);

  const isEmpty = !formattedHtml && !markdown.trim();
  const charCount = markdown.length;
  const readingMinutes = Math.max(1, Math.ceil(charCount / 400));

  // Sync scroll: listen for editor scroll events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const el = containerRef.current;
      if (!el || typeof detail?.ratio !== 'number') return;
      el.scrollTop = detail.ratio * (el.scrollHeight - el.clientHeight);
    };
    window.addEventListener('editor-scroll', handler);
    return () => window.removeEventListener('editor-scroll', handler);
  }, []);

  return (
    <div className="preview-container" ref={containerRef}>
      {!isEmpty && charCount > 0 && (
        <div className="preview-stats">
          约 {readingMinutes} 分钟阅读 · {charCount.toLocaleString()} 字
        </div>
      )}
      {isEmpty ? (
        <div className="preview-empty">
          <div className="preview-empty-icon">📝</div>
          <p>预览区域</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>在左侧输入 Markdown 内容即可实时预览</p>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
      )}
    </div>
  );
}
