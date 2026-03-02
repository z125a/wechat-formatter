import { useState } from 'react';
import { useAppStore } from '../store/app-store';
import type { ThemeConfig, ThemeStyles, HeadingLevel } from '../types';
import { getTheme } from '../core/theme-manager';

const DEFAULT_STYLES: ThemeStyles = {
  fontSize: 16, lineHeight: 1.75, color: '#333333', titleColor: '#1a1a1a',
  titleFontSize: { 1: 24, 2: 22, 3: 20, 4: 18, 5: 16, 6: 14 },
  blockquoteBg: '#f7f7f7', blockquoteBorder: '#ddd', codeBg: '#f5f5f5',
  linkColor: '#576b95', firstLineIndent: false, paragraphSpacing: 16, letterSpacing: 0.5,
};

export function CustomThemeEditor() {
  const [open, setOpen] = useState(false);
  const customThemes = useAppStore((s) => s.customThemes);
  const saveCustomTheme = useAppStore((s) => s.saveCustomTheme);
  const deleteCustomTheme = useAppStore((s) => s.deleteCustomTheme);
  const setThemeId = useAppStore((s) => s.setThemeId);
  const currentThemeId = useAppStore((s) => s.currentThemeId);

  const [name, setName] = useState('我的主题');
  const [styles, setStyles] = useState<ThemeStyles>({ ...DEFAULT_STYLES });
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!open) {
    return (
      <button className="toolbar-btn toolbar-btn-ghost" onClick={() => setOpen(true)} title="自定义主题">
        🎨 自定义
      </button>
    );
  }

  const handleSave = () => {
    const id = editingId || 'custom_' + Date.now().toString(36);
    const theme: ThemeConfig = { id, name: name.trim() || '自定义主题', styles };
    saveCustomTheme(theme);
    setThemeId(id);
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (theme: ThemeConfig) => {
    setEditingId(theme.id);
    setName(theme.name);
    setStyles({ ...theme.styles });
  };

  const handleLoadCurrent = () => {
    const theme = getTheme(currentThemeId);
    if (theme) setStyles({ ...theme.styles });
  };

  const updateStyle = <K extends keyof ThemeStyles>(key: K, value: ThemeStyles[K]) => {
    setStyles((prev) => ({ ...prev, [key]: value }));
  };

  const colorFields: { key: keyof ThemeStyles; label: string }[] = [
    { key: 'color', label: '正文色' },
    { key: 'titleColor', label: '标题色' },
    { key: 'linkColor', label: '链接色' },
    { key: 'blockquoteBg', label: '引用背景' },
    { key: 'blockquoteBorder', label: '引用边框' },
    { key: 'codeBg', label: '代码背景' },
  ];

  return (
    <div className="dialog-overlay" onClick={() => setOpen(false)}>
      <div className="dialog-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">🎨 自定义主题编辑器</div>
        <div className="dialog-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Existing custom themes */}
          {customThemes.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>已保存的自定义主题：</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {customThemes.map((t) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--surface-dim)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                    <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => handleEdit(t)}>{t.name}</span>
                    <button onClick={() => deleteCustomTheme(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)', padding: '0 2px' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theme name */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>主题名称</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: '6px 10px', fontSize: '13px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text)' }} />
              <button onClick={handleLoadCurrent} className="dialog-btn dialog-btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>从当前主题加载</button>
            </div>
          </div>

          {/* Color pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            {colorFields.map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>{f.label}</label>
                <input type="color" value={styles[f.key] as string} onChange={(e) => updateStyle(f.key, e.target.value as never)} style={{ width: '100%', height: '32px', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
              </div>
            ))}
          </div>

          {/* Number fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {([
              ['fontSize', '字号', 12, 24, 1],
              ['lineHeight', '行高', 1.2, 2.5, 0.1],
              ['letterSpacing', '字间距', 0, 3, 0.1],
              ['paragraphSpacing', '段间距', 8, 40, 2],
            ] as const).map(([key, label, min, max, step]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <label>{label}</label>
                <input type="number" min={min} max={max} step={step} value={styles[key] as number}
                  onChange={(e) => updateStyle(key, Number(e.target.value) as never)}
                  style={{ width: '60px', padding: '3px 6px', fontSize: '12px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface)', color: 'var(--text)' }} />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <label>首行缩进</label>
              <button onClick={() => updateStyle('firstLineIndent', !styles.firstLineIndent)}
                style={{ padding: '3px 10px', fontSize: '11px', border: '1px solid var(--border)', borderRadius: '4px', background: styles.firstLineIndent ? 'rgba(99,102,241,0.15)' : 'var(--surface)', color: styles.firstLineIndent ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}>
                {styles.firstLineIndent ? '✓ 开' : '关'}
              </button>
            </div>
          </div>

          {/* Preview swatch */}
          <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', marginBottom: '8px' }}>
            <p style={{ fontSize: `${styles.fontSize}px`, lineHeight: styles.lineHeight, color: styles.color, letterSpacing: `${styles.letterSpacing}px`, margin: '0 0 8px', textIndent: styles.firstLineIndent ? '2em' : '0' }}>
              预览文本：这是一段示例正文，用于展示当前主题的排版效果。
            </p>
            <p style={{ fontSize: `${styles.titleFontSize[2]}px`, color: styles.titleColor, fontWeight: 'bold', margin: 0 }}>标题预览</p>
          </div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-secondary" onClick={() => setOpen(false)}>取消</button>
          <button className="dialog-btn dialog-btn-primary" onClick={handleSave}>
            {editingId ? '更新主题' : '保存主题'}
          </button>
        </div>
      </div>
    </div>
  );
}
