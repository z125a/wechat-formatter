import { useState, useEffect, useCallback } from 'react';
import { getPresetTemplates, getTemplatesByCategory, TEMPLATE_CATEGORIES } from '../core/template-manager';
import type { TemplateCategoryKey } from '../core/template-manager';

export interface TemplateDialogProps {
  open: boolean;
  onSelect: (templateId: string) => void;
  onCancel: () => void;
}

export function TemplateDialog({ open, onSelect, onCancel }: TemplateDialogProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryKey>('all');

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleCancel]);

  if (!open) return null;

  const templates = getTemplatesByCategory(activeCategory);

  return (
    <div
      data-testid="template-dialog-overlay"
      onClick={handleCancel}
      className="dialog-overlay"
    >
      <div
        role="dialog"
        aria-label="选择模板"
        onClick={(e) => e.stopPropagation()}
        className="dialog-content"
        style={{ maxWidth: '640px', maxHeight: '85vh' }}
      >
        <div className="dialog-header">选择文章模板</div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '6px', padding: '12px 24px', flexWrap: 'wrap' }}>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key as TemplateCategoryKey)}
              style={{
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: activeCategory === cat.key ? 600 : 400,
                border: '1px solid',
                borderColor: activeCategory === cat.key ? 'var(--primary)' : 'var(--border)',
                borderRadius: 'var(--radius-full)',
                background: activeCategory === cat.key ? 'rgba(99,102,241,0.08)' : 'var(--surface)',
                color: activeCategory === cat.key ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Template list */}
        <div className="dialog-body" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {templates.map((t) => (
              <button
                key={t.id}
                data-testid={`template-item-${t.id}`}
                onClick={() => onSelect(t.id)}
                style={{
                  textAlign: 'left',
                  padding: '14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-dim)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{t.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.4 }}>{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="dialog-footer">
          <button onClick={handleCancel} className="dialog-btn dialog-btn-secondary">
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
