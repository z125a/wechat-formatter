import { useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { ThemeSelector } from './ThemeSelector';
import { StylePanel } from './StylePanel';
import { Toolbar } from './Toolbar';
import { AssetPanel } from './AssetPanel';
import { Outline } from './Outline';
import { ShortcutsHelp } from './ShortcutsHelp';
import { useAppStore } from '../store/app-store';
import { insertAtCursor } from '../core/image-inserter';

export function Layout() {
  const markdown = useAppStore((s) => s.markdown);
  const currentThemeId = useAppStore((s) => s.currentThemeId);
  const customStyles = useAppStore((s) => s.customStyles);
  const formatFn = useAppStore((s) => s.format);
  const assetPanelOpen = useAppStore((s) => s.assetPanelOpen);
  const setAssetPanelOpen = useAppStore((s) => s.setAssetPanelOpen);
  const setMarkdown = useAppStore((s) => s.setMarkdown);
  const cursorPosition = useAppStore((s) => s.cursorPosition);
  const fullscreen = useAppStore((s) => s.fullscreen);
  const setFullscreen = useAppStore((s) => s.setFullscreen);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => formatFn(), 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [markdown, currentThemeId, customStyles, formatFn]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) setFullscreen(false);
      // F11 toggles fullscreen
      if (e.key === 'F11') { e.preventDefault(); setFullscreen(!fullscreen); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen, setFullscreen]);

  const handleAssetInsert = (content: string) => {
    const newMarkdown = insertAtCursor(markdown, cursorPosition, content);
    setMarkdown(newMarkdown);
    formatFn();
  };

  if (fullscreen) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--surface-dim)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', padding: '16px' }}>
          <Editor />
        </div>
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          <Preview />
        </div>
        <button
          onClick={() => setFullscreen(false)}
          style={{
            position: 'fixed', top: '12px', right: '12px', zIndex: 2000,
            padding: '6px 14px', fontSize: '12px', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', background: 'var(--surface)',
            color: 'var(--text-secondary)', cursor: 'pointer', boxShadow: 'var(--shadow-md)',
          }}
          title="退出全屏 (Esc)"
        >
          ✕ 退出全屏
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header className="app-header">
        <div className="header-top">
          <div className="header-brand">
            <span className="header-logo">✨</span>
            <span className="header-title">微信排版助手</span>
          </div>
          <div className="header-toolbar">
            <Toolbar />
          </div>
        </div>
        <div className="header-bottom">
          <ThemeSelector />
          <StylePanel />
        </div>
      </header>

      <main className="layout-main">
        <Outline />
        <div className="layout-editor">
          <Editor />
        </div>
        <div className="layout-preview">
          <Preview />
        </div>
      </main>

      <AssetPanel
        open={assetPanelOpen}
        onClose={() => setAssetPanelOpen(false)}
        onInsert={handleAssetInsert}
      />
      <ShortcutsHelp />
    </div>
  );
}
