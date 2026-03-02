import { useState } from 'react';
import { useAppStore } from '../store/app-store';

export function SaveTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const markdown = useAppStore((s) => s.markdown);
  const saveAsTemplate = useAppStore((s) => s.saveAsTemplate);
  const userTemplates = useAppStore((s) => s.userTemplates);
  const deleteUserTemplate = useAppStore((s) => s.deleteUserTemplate);
  const setMarkdown = useAppStore((s) => s.setMarkdown);
  const format = useAppStore((s) => s.format);

  if (!open) {
    return (
      <button className="toolbar-btn toolbar-btn-ghost" onClick={() => setOpen(true)} title="我的模板">
        💾 我的模板 {userTemplates.length > 0 ? `(${userTemplates.length})` : ''}
      </button>
    );
  }

  const handleSave = () => {
    if (!name.trim() || !markdown.trim()) return;
    saveAsTemplate(name.trim());
    setName('');
  };

  const handleUse = (content: string) => {
    if (markdown.trim() && !window.confirm('当前编辑器中已有内容，使用模板将替换所有内容。是否继续？')) return;
    setMarkdown(content);
    format();
    setOpen(false);
  };

  return (
    <div className="dialog-overlay" onClick={() => setOpen(false)}>
      <div className="dialog-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">💾 我的模板</div>
        <div className="dialog-body" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {/* Save current as template */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="输入模板名称，保存当前内容..."
              style={{ flex: 1, padding: '8px 12px', fontSize: '13px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button className="dialog-btn dialog-btn-primary" onClick={handleSave} disabled={!name.trim() || !markdown.trim()} style={{ opacity: name.trim() && markdown.trim() ? 1 : 0.5 }}>
              保存
            </button>
          </div>

          {/* User templates list */}
          {userTemplates.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '13px' }}>还没有保存的模板，在编辑器中写好内容后保存即可</p>
          ) : (
            userTemplates.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px', border: '1px solid var(--border)', background: 'var(--surface-dim)', cursor: 'pointer', transition: 'all 150ms ease' }}
                onClick={() => handleUse(t.content)}>
                <span style={{ fontSize: '16px' }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(t.createdAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' · '}{t.content.length} 字
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`删除模板「${t.name}」？`)) deleteUserTemplate(t.id); }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px', color: 'var(--text-muted)' }} title="删除">
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setOpen(false)}>关闭</button>
        </div>
      </div>
    </div>
  );
}
