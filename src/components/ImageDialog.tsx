import { useState, useEffect, useCallback } from 'react';
import { isValidImageUrl } from '../core/image-inserter';

export interface ImageDialogProps {
  open: boolean;
  onConfirm: (url: string) => void;
  onCancel: () => void;
}

export function ImageDialog({ open, onConfirm, onCancel }: ImageDialogProps) {
  const [url, setUrl] = useState('');

  const handleCancel = useCallback(() => {
    setUrl('');
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

  const valid = isValidImageUrl(url);

  const handleConfirm = () => {
    if (!valid) return;
    onConfirm(url.trim());
    setUrl('');
  };

  return (
    <div
      data-testid="image-dialog-overlay"
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
        aria-label="插入图片"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '360px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>插入图片</h3>
        <input
          type="text"
          placeholder="请输入图片 URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="图片 URL"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
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
          <button
            onClick={handleConfirm}
            disabled={!valid}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: valid ? '#1976d2' : '#bdbdbd',
              color: '#fff',
              cursor: valid ? 'pointer' : 'not-allowed',
              fontSize: '14px',
            }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
