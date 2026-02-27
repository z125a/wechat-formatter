import { useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { ThemeSelector } from './ThemeSelector';
import { StylePanel } from './StylePanel';
import { Toolbar } from './Toolbar';
import { AssetPanel } from './AssetPanel';
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

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      formatFn();
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [markdown, currentThemeId, customStyles, formatFn]);

  const handleAssetInsert = (content: string) => {
    const newMarkdown = insertAtCursor(markdown, cursorPosition, content);
    setMarkdown(newMarkdown);
    formatFn();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <header
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <ThemeSelector />
        <StylePanel />
        <Toolbar />
      </header>

      {/* Main area: Editor + Preview */}
      <main className="layout-main">
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
    </div>
  );
}
