import { useState } from 'react';
import { useAppStore } from '../store/app-store';
import { getTheme, mergeCustomStyles } from '../core/theme-manager';

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
  const [collapsed, setCollapsed] = useState(true);

  const baseTheme = getTheme(currentThemeId);
  if (!baseTheme) return null;

  const merged = mergeCustomStyles(baseTheme, customStyles).styles;

  const handleFontSize = (value: string) => {
    const num = clamp(Number(value), FONT_SIZE_MIN, FONT_SIZE_MAX);
    if (!Number.isNaN(num)) setCustomStyles({ ...customStyles, fontSize: num });
  };

  const handleLineHeight = (value: string) => {
    const num = clamp(Number(value), LINE_HEIGHT_MIN, LINE_HEIGHT_MAX);
    if (!Number.isNaN(num)) setCustomStyles({ ...customStyles, lineHeight: Math.round(num * 10) / 10 });
  };

  const handleColor = (key: 'color' | 'titleColor' | 'linkColor', value: string) => {
    setCustomStyles({ ...customStyles, [key]: value });
  };

  return (
    <fieldset className="style-panel-fieldset" aria-label="样式微调">
      <legend>
        🎛️ 样式
        <button className="style-panel-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '展开 ▾' : '收起 ▴'}
        </button>
      </legend>

      <div className={`panel-collapsible ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="style-panel-row">
          <label htmlFor="sp-font-size">字号</label>
          <input id="sp-font-size" className="style-panel-input" type="number"
            min={FONT_SIZE_MIN} max={FONT_SIZE_MAX} step={1}
            value={merged.fontSize} onChange={(e) => handleFontSize(e.target.value)} />
        </div>
        <div className="style-panel-row">
          <label htmlFor="sp-line-height">行高</label>
          <input id="sp-line-height" className="style-panel-input" type="number"
            min={LINE_HEIGHT_MIN} max={LINE_HEIGHT_MAX} step={0.1}
            value={merged.lineHeight} onChange={(e) => handleLineHeight(e.target.value)} />
        </div>
        <div className="style-panel-row">
          <label htmlFor="sp-color">正文色</label>
          <input id="sp-color" className="style-panel-color" type="color"
            value={merged.color} onChange={(e) => handleColor('color', e.target.value)} />
        </div>
        <div className="style-panel-row">
          <label htmlFor="sp-title-color">标题色</label>
          <input id="sp-title-color" className="style-panel-color" type="color"
            value={merged.titleColor} onChange={(e) => handleColor('titleColor', e.target.value)} />
        </div>
        <div className="style-panel-row">
          <label htmlFor="sp-link-color">链接色</label>
          <input id="sp-link-color" className="style-panel-color" type="color"
            value={merged.linkColor} onChange={(e) => handleColor('linkColor', e.target.value)} />
        </div>
      </div>
    </fieldset>
  );
}
