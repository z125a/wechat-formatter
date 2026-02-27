import { useState, useEffect } from 'react';
import { useAppStore } from '../store/app-store';
import { ImageDialog } from './ImageDialog';
import { TemplateDialog } from './TemplateDialog';
import { buildImageMarkdown, insertAtCursor } from '../core/image-inserter';
import { getTemplate } from '../core/template-manager';

export function Toolbar() {
  const format = useAppStore((s) => s.format);
  const copyToClipboard = useAppStore((s) => s.copyToClipboard);
  const markdown = useAppStore((s) => s.markdown);
  const setMarkdown = useAppStore((s) => s.setMarkdown);
  const cursorPosition = useAppStore((s) => s.cursorPosition);
  const assetPanelOpen = useAppStore((s) => s.assetPanelOpen);
  const setAssetPanelOpen = useAppStore((s) => s.setAssetPanelOpen);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => {
        setToast(null);
        setToastExiting(false);
      }, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCopy = async () => {
    const result = await copyToClipboard();
    if (result.success) {
      setToast({ message: '复制成功', type: 'success' });
    } else {
      setToast({ message: result.error ?? '复制失败', type: 'error' });
    }
  };

  const handleImageConfirm = (url: string) => {
    const newMarkdown = insertAtCursor(markdown, cursorPosition, buildImageMarkdown(url));
    setMarkdown(newMarkdown);
    setImageDialogOpen(false);
    format();
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplate(templateId);
    if (!template) return;
    setTemplateDialogOpen(false);
    if (markdown.trim().length > 0) {
      const confirmed = window.confirm('当前编辑器中已有内容，选择模板将替换所有内容。是否继续？');
      if (!confirmed) return;
    }
    setMarkdown(template.content);
    format();
  };

  return (
    <div className="toolbar-enhanced" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
      <button
        className="btn-animated"
        onClick={format}
        style={{
          padding: '8px 16px',
          backgroundColor: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        一键排版
      </button>
      <button
        className="btn-animated"
        onClick={handleCopy}
        style={{
          padding: '8px 16px',
          backgroundColor: '#43a047',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        复制
      </button>
      <button
        className="btn-animated"
        onClick={() => setImageDialogOpen(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#7b1fa2',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        插入图片
      </button>
      <button
        className="btn-animated"
        onClick={() => setTemplateDialogOpen(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#f57c00',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        选择模板
      </button>
      <button
        className="btn-animated"
        onClick={() => setAssetPanelOpen(!assetPanelOpen)}
        style={{
          padding: '8px 16px',
          backgroundColor: assetPanelOpen ? '#00897b' : '#00acc1',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        素材库
      </button>

      {toast && (
        <div
          role="status"
          className={toastExiting ? 'toast-exit' : 'toast-enter'}
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 20px',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '14px',
            zIndex: 1000,
            backgroundColor: toast.type === 'success' ? '#43a047' : '#d32f2f',
          }}
        >
          {toast.message}
        </div>
      )}

      <ImageDialog
        open={imageDialogOpen}
        onConfirm={handleImageConfirm}
        onCancel={() => setImageDialogOpen(false)}
      />
      <TemplateDialog
        open={templateDialogOpen}
        onSelect={handleTemplateSelect}
        onCancel={() => setTemplateDialogOpen(false)}
      />
    </div>
  );
}
