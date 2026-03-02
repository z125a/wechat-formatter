import { useMemo } from 'react';
import { useAppStore } from '../store/app-store';

interface HeadingItem {
  level: number;
  text: string;
  line: number;
}

export function Outline() {
  const markdown = useAppStore((s) => s.markdown);

  const headings = useMemo<HeadingItem[]>(() => {
    if (!markdown) return [];
    const lines = markdown.split('\n');
    const result: HeadingItem[] = [];
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^(#{1,6})\s+(.+)/);
      if (match) {
        result.push({ level: match[1].length, text: match[2].trim(), line: i });
      }
    }
    return result;
  }, [markdown]);

  if (headings.length === 0) return null;

  return (
    <div className="outline-panel">
      <div className="outline-title">📑 大纲</div>
      <div className="outline-list">
        {headings.map((h, i) => (
          <button
            key={`${h.line}-${i}`}
            className="outline-item"
            style={{ paddingLeft: `${(h.level - 1) * 12 + 8}px` }}
            onClick={() => {
              // Scroll editor to the heading line
              const ta = document.querySelector('.editor-textarea') as HTMLTextAreaElement | null;
              if (!ta) return;
              const lines = ta.value.split('\n');
              let pos = 0;
              for (let j = 0; j < h.line && j < lines.length; j++) {
                pos += lines[j].length + 1;
              }
              ta.focus();
              ta.setSelectionRange(pos, pos);
              // Approximate scroll position
              const lineHeight = ta.scrollHeight / (lines.length || 1);
              ta.scrollTop = h.line * lineHeight - ta.clientHeight / 3;
            }}
            title={h.text}
          >
            <span className="outline-level">H{h.level}</span>
            <span className="outline-text">{h.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
