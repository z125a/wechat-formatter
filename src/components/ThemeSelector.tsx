import { useAppStore } from '../store/app-store';
import { getPresetThemes } from '../core/theme-manager';

const themes = getPresetThemes();

export function ThemeSelector() {
  const currentThemeId = useAppStore((s) => s.currentThemeId);
  const setThemeId = useAppStore((s) => s.setThemeId);

  return (
    <div role="radiogroup" aria-label="主题选择" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {themes.map((theme) => {
        const isSelected = theme.id === currentThemeId;
        return (
          <button
            key={theme.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setThemeId(theme.id)}
            className="btn-animated"
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              border: isSelected ? '2px solid #1565c0' : '1px solid #ccc',
              background: isSelected ? '#e3f2fd' : '#fff',
              fontWeight: isSelected ? 600 : 400,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {theme.name}
          </button>
        );
      })}
    </div>
  );
}
