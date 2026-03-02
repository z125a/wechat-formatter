import { useState, useEffect } from 'react';

const SHORTCUTS = [
  { keys: 'Ctrl + B', desc: '加粗' },
  { keys: 'Ctrl + I', desc: '斜体' },
  { keys: 'Ctrl + K', desc: '插入链接' },
  { keys: 'Ctrl + Z', desc: '撤销' },
  { keys: 'Ctrl + Shift + Z', desc: '重做' },
  { keys: 'Ctrl + Y', desc: '重做' },
  { keys: 'F11', desc: '全屏模式' },
  { keys: 'Esc', desc: '退出全屏' },
];

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={() => setOpen(false)}>
      <div className="dialog-content" style={{ maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">⌨️ 快捷键</div>
        <div className="dialog-body">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.desc}</span>
              <kbd style={{ padding: '2px 8px', fontSize: '11px', background: 'var(--surface-dim)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'monospace', color: 'var(--text)' }}>{s.keys}</kbd>
            </div>
          ))}
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>按 Ctrl + ? 打开/关闭此面板</p>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setOpen(false)}>关闭</button>
        </div>
      </div>
    </div>
  );
}
