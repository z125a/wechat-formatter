import { useState, useCallback } from 'react';
import { useAppStore } from '../store/app-store';

export function FindReplace() {
  const [open, setOpen] = useState(false);
  const markdown = useAppStore((s) => s.markdown);
  const setMarkdown = useAppStore((s) => s.setMarkdown);

  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [result, setResult] = useState('');

  const getMatchCount = useCallback(() => {
    if (!find) return 0;
    try {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      return (markdown.match(regex) || []).length;
    } catch { return 0; }
  }, [find, markdown, caseSensitive]);

  const handleReplace = () => {
    if (!find) return;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const count = (markdown.match(regex) || []).length;
    const newMd = markdown.replace(regex, replace);
    setMarkdown(newMd);
    setResult(`已替换 ${count} 处`);
    setTimeout(() => setResult(''), 2000);
  };

  const handleReplaceFirst = () => {
    if (!find) return;
    const flags = caseSensitive ? '' : 'i';
    const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    if (regex.test(markdown)) {
      setMarkdown(markdown.replace(regex, replace));
      setResult('已替换 1 处');
      setTimeout(() => setResult(''), 2000);
    }
  };

  if (!open) {
    return (
      <button className="toolbar-btn toolbar-btn-ghost" onClick={() => setOpen(true)} title="查找替换">
        🔍 查找
      </button>
    );
  }

  const matchCount = getMatchCount();

  return (
    <div className="dialog-overlay" onClick={() => setOpen(false)}>
      <div className="dialog-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">🔍 查找和替换</div>
        <div className="dialog-body">
          <div style={{ marginBottom: '10px' }}>
            <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="查找内容..."
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
              autoFocus />
            {find && <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>找到 {matchCount} 处匹配</span>}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="替换为..."
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
              区分大小写
            </label>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="dialog-btn dialog-btn-secondary" onClick={handleReplaceFirst} disabled={matchCount === 0} style={{ flex: 1, opacity: matchCount > 0 ? 1 : 0.5 }}>
              替换第一个
            </button>
            <button className="dialog-btn dialog-btn-primary" onClick={handleReplace} disabled={matchCount === 0} style={{ flex: 1, opacity: matchCount > 0 ? 1 : 0.5 }}>
              全部替换
            </button>
          </div>
          {result && <p style={{ fontSize: '12px', color: 'var(--primary)', textAlign: 'center', marginTop: '8px' }}>{result}</p>}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setOpen(false)}>关闭</button>
        </div>
      </div>
    </div>
  );
}
