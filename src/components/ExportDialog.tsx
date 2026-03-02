import { useState } from 'react';
import { useAppStore } from '../store/app-store';

type ExportFormat = 'html' | 'markdown' | 'text';

export function ExportDialog() {
  const [open, setOpen] = useState(false);
  const formattedHtml = useAppStore((s) => s.formattedHtml);
  const markdown = useAppStore((s) => s.markdown);

  if (!open) {
    return (
      <button className="toolbar-btn toolbar-btn-ghost" onClick={() => setOpen(true)}>
        📥 导出
      </button>
    );
  }

  const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const handleExport = (fmt: ExportFormat) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    switch (fmt) {
      case 'html': {
        const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>微信文章</title>
<style>body{max-width:680px;margin:40px auto;padding:0 20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}</style>
</head><body>${formattedHtml}</body></html>`;
        download(fullHtml, `article-${timestamp}.html`, 'text/html');
        break;
      }
      case 'markdown':
        download(markdown, `article-${timestamp}.md`, 'text/markdown');
        break;
      case 'text':
        download(markdown, `article-${timestamp}.txt`, 'text/plain');
        break;
    }
  };

  const formats: { key: ExportFormat; icon: string; label: string; desc: string }[] = [
    { key: 'html', icon: '🌐', label: 'HTML 文件', desc: '带样式的完整网页，可直接浏览器打开' },
    { key: 'markdown', icon: '📝', label: 'Markdown 文件', desc: '原始 Markdown 源文件' },
    { key: 'text', icon: '📄', label: '纯文本', desc: '不含格式的纯文本文件' },
  ];

  return (
    <div className="dialog-overlay" onClick={() => setOpen(false)}>
      <div className="dialog-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">📥 导出文章</div>
        <div className="dialog-body">
          {formats.map((f) => (
            <button
              key={f.key}
              onClick={() => handleExport(f.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                padding: '14px 16px', marginBottom: '8px', border: '1px solid var(--border)',
                borderRadius: '10px', background: 'var(--surface)', cursor: 'pointer',
                textAlign: 'left', transition: 'all 150ms ease',
              }}
            >
              <span style={{ fontSize: '24px' }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{f.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setOpen(false)}>取消</button>
        </div>
      </div>
    </div>
  );
}
