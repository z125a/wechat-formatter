import { useState } from 'react';
import { useAppStore } from '../store/app-store';

export function ArticleManager() {
  const articles = useAppStore((s) => s.articles);
  const activeArticleId = useAppStore((s) => s.activeArticleId);
  const createArticle = useAppStore((s) => s.createArticle);
  const switchArticle = useAppStore((s) => s.switchArticle);
  const deleteArticle = useAppStore((s) => s.deleteArticle);
  const renameArticle = useAppStore((s) => s.renameArticle);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!open) {
    return (
      <button
        className="toolbar-btn toolbar-btn-ghost"
        onClick={() => setOpen(true)}
        title="文章管理"
      >
        📂 文章 ({articles.length})
      </button>
    );
  }

  const handleRenameStart = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleRenameConfirm = () => {
    if (editingId && editName.trim()) {
      renameArticle(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="dialog-overlay" onClick={() => setOpen(false)}>
      <div
        className="dialog-content"
        style={{ maxWidth: '420px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📂 文章管理</span>
          <button
            className="dialog-btn dialog-btn-primary"
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => createArticle()}
          >
            + 新建
          </button>
        </div>
        <div className="dialog-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {articles.map((a) => (
            <div
              key={a.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
                background: a.id === activeArticleId ? 'rgba(99,102,241,0.08)' : 'transparent',
                border: a.id === activeArticleId ? '1px solid var(--primary-light)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 150ms ease',
              }}
              onClick={() => { switchArticle(a.id); setOpen(false); }}
            >
              <span style={{ fontSize: '16px' }}>{a.id === activeArticleId ? '📝' : '📄'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingId === a.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleRenameConfirm}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameConfirm()}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    style={{
                      width: '100%', padding: '2px 6px', fontSize: '13px',
                      border: '1px solid var(--primary)', borderRadius: '4px',
                      outline: 'none', background: 'var(--surface)',
                      color: 'var(--text)', boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(a.updatedAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRenameStart(a.id, a.name); }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px', color: 'var(--text-muted)' }}
                title="重命名"
              >✏️</button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`确定删除「${a.name}」吗？`)) deleteArticle(a.id);
                }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px', color: 'var(--text-muted)' }}
                title="删除"
              >🗑️</button>
            </div>
          ))}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setOpen(false)}>关闭</button>
        </div>
      </div>
    </div>
  );
}
