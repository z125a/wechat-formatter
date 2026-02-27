import { useState } from 'react';
import { useAppStore } from '../store/app-store';
import { getTheme, mergeCustomStyles } from '../core/theme-manager';

/** Clamp a numeric value to [min, max] */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 24;
const LINE_HEIGHT_MIN = 1.2;
const LINE_HEIGHT_MAX = 2.5;

export function StylePanel() {
  const currentThemeId = useAppStore((s) => s.currentThemeId);
  const customStyles = useAppStore((s) => s.customStyles);
  const setCustomStyles = useAppStore((s) => s.setCustomStyles);
  const [collapsed, setCollapsed] = useState(false);

  const baseTheme = getTheme(currentThemeId);
  if (!baseTheme) return null;

  const merged = mergeCustomStyles(baseTheme, customStyles).styles;

  const handleFontSize = (value: string) => {
    const num = clamp(Number(value), FONT_SIZE_MIN, FONT_SIZE_MAX);
    if (!Number.isNaN(num)) {
      setCustomStyles({ ...customStyles, fontSize: num });
    }
  };

  const handleLineHeight = (value: string) => {
    const num = clamp(Number(value), LINE_HEIGHT_MIN, LINE_HEIGHT_MAX);
    if (!Number.isNaN(num)) {
      setCustomStyles({ ...customStyles, lineHeight: Math.round(num * 10) / 10 });
    }
  };

  const handleColor = (key: 'color' | 'titleColor' | 'linkColor', value: string) => {
    setCustomStyles({ ...customStyles, [key]: value });
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    fontSize: '13px',
    marginBottom: '8px',
  };

  return (
    <fieldset
      aria-label="样式微调"
      style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '12px', margin: 0 }}
    >
      <legend style={{ fontSize: '14px', fontWeight: 600, padding: '0 4px' }}>
        样式微调
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: '8px', fontSize: '12px', cursor: 'pointer', border: 'none', background: 'none', color: '#1976d2' }}
        >
          {collapsed ? '展开' : '收起'}
        </button>
      </legend>

      <div className={`panel-collapsible ${collapsed ? 'collapsed' : 'expanded'}`}>
      {/* 字体大小 */}
      <div style={labelStyle}>
        <label htmlFor="sp-font-size">字体大小</label>
        <input
          id="sp-font-size"
          type="number"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          step={1}
          value={merged.fontSize}
          onChange={(e) => handleFontSize(e.target.value)}
          style={{ width: '60px' }}
        />
      </div>

      {/* 行高 */}
      <div style={labelStyle}>
        <label htmlFor="sp-line-height">行高</label>
        <input
          id="sp-line-height"
          type="number"
          min={LINE_HEIGHT_MIN}
          max={LINE_HEIGHT_MAX}
          step={0.1}
          value={merged.lineHeight}
          onChange={(e) => handleLineHeight(e.target.value)}
          style={{ width: '60px' }}
        />
      </div>

      {/* 正文颜色 */}
      <div style={labelStyle}>
        <label htmlFor="sp-color">正文颜色</label>
        <input
          id="sp-color"
          type="color"
          value={merged.color}
          onChange={(e) => handleColor('color', e.target.value)}
        />
      </div>

      {/* 标题颜色 */}
      <div style={labelStyle}>
        <label htmlFor="sp-title-color">标题颜色</label>
        <input
          id="sp-title-color"
          type="color"
          value={merged.titleColor}
          onChange={(e) => handleColor('titleColor', e.target.value)}
        />
      </div>

      {/* 链接颜色 */}
      <div style={labelStyle}>
        <label htmlFor="sp-link-color">链接颜色</label>
        <input
          id="sp-link-color"
          type="color"
          value={merged.linkColor}
          onChange={(e) => handleColor('linkColor', e.target.value)}
        />
      </div>
      </div>
    </fieldset>
  );
}
