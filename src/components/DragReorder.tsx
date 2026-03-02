import { useState, useRef, useCallback } from 'react';
import { useAppStore } from '../store/app-store';

/** Split markdown into paragraphs (separated by blank lines) */
function splitParagraphs(md: string): string[] {
  return md.split(/\n\n+/).filter((p) => p.trim());
}

export function DragReorder() {
  const [open, setOpen] = useState(false);
  const markdown = useAppStore((s) => s.markdown);
  const setMarkdown = useAppStore((s) => s.setMarkdown);
  const format = useAppStore((s) => s.format);

  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const handleOpen = () => {
    setParagraphs(splitParagraphs(markdown));
    setOpen(true);
  };

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
    dragRef.current = idx;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  }, []);

  const handleDrop = useCallback((idx: number) => {
    const from = dragRef.current;
    if (from === null || from === idx) { setDragIdx(null); setOverIdx(null); return; }
    setParagraphs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setOverIdx(null);
  }, []);

  const handleApply = () => {
    setMarkdown(paragraphs.join('\n\n'));
    format();
    setOpen(false);
  };

  if (!open) {
    return (
      <button className="toolbar-btn toolbar-btn-ghost" onClick={handleOpen} title="段落排序">
        ↕️ 排序
      </button>
    );
  }

  return (
    <div className="dialog-overlay" onClick={() => setOpen(false)}>
      <div className="dialog-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">↕️ 拖拽段落排序</div>
        <div className="dialog-body" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
          {paragraphs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>暂无段落</p>
          ) : (
            paragraphs.map((p, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  padding: '10px 12px', marginBottom: '4px',
                  borderRadius: '8px', cursor: 'grab',
                  border: overIdx === i ? '2px dashed var(--primary)' : '1px solid var(--border)',
                  background: dragIdx === i ? 'rgba(99,102,241,0.06)' : 'var(--surface-dim)',
                  opacity: dragIdx === i ? 0.5 : 1,
                  transition: 'all 100ms ease',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', userSelect: 'none', cursor: 'grab', lineHeight: '20px' }}>⠿</span>
                <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', maxHeight: '60px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {p.slice(0, 150)}{p.length > 150 ? '...' : ''}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setOpen(false)}>取消</button>
          <button className="dialog-btn dialog-btn-primary" onClick={handleApply}>应用排序</button>
        </div>
      </div>
    </div>
  );
}
