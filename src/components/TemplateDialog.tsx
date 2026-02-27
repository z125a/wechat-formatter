import { useEffect, useCallback } from 'react';
import { getPresetTemplates } from '../core/template-manager';

export interface TemplateDialogProps {
  open: boolean;
  onSelect: (templateId: string) => void;
  onCancel: () => void;
}

export function TemplateDialog({ open, onSelect, onCancel }: TemplateDialogProps) {
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleCancel]);

  if (!open) return null;

  const templates = getPresetTemplates();

  return (
    <div
      data-testid="template-dialog-overlay"
      onClick={handleCancel}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
      }}
    >
      <div
        role="dialog"
        aria-label="选择模板"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '360px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>选择文章模板</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {templates.map((t) => (
            <button
              key={t.id}
              data-testid={`template-item-${t.id}`}
              onClick={() => onSelect(t.id)}
              style={{
                textAlign: 'left',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                background: '#fafafa',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{t.name}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>{t.description}</div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
