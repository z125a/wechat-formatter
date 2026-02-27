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
      setTimeout(() => { setToast(null); setToastExiting(false); }, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCopy = async () => {
    const result = await copyToClipboard();
    setToast(result.success
      ? { message: '✓ 已复制到剪贴板', type: 'success' }
      : { message: result.error ?? '复制失败', type: 'error' });
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
    <>
      <button className="toolbar-btn toolbar-btn-primary" onClick={format}>
        ⚡ 一键排版
      </button>
      <button className="toolbar-btn toolbar-btn-ghost" onClick={handleCopy}>
        📋 复制
      </button>
      <button className="toolbar-btn toolbar-btn-ghost" onClick={() => setImageDialogOpen(true)}>
        🖼️ 图片
      </button>
      <button className="toolbar-btn toolbar-btn-ghost" onClick={() => setTemplateDialogOpen(true)}>
        📄 模板
      </button>
      <button
        className={`toolbar-btn toolbar-btn-ghost ${assetPanelOpen ? 'active' : ''}`}
        onClick={() => setAssetPanelOpen(!assetPanelOpen)}
      >
        🎨 素材库
      </button>

      {toast && (
        <div
          role="status"
          className={`toast-notification ${toast.type === 'success' ? 'toast-success' : 'toast-error'} ${toastExiting ? 'toast-exit' : 'toast-enter'}`}
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
    </>
  );
}
