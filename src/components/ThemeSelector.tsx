import { useAppStore } from '../store/app-store';
import { getPresetThemes } from '../core/theme-manager';

const themes = getPresetThemes();

export function ThemeSelector() {
  const currentThemeId = useAppStore((s) => s.currentThemeId);
  const setThemeId = useAppStore((s) => s.setThemeId);

  return (
    <div role="radiogroup" aria-label="主题选择" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {themes.map((theme) => {
        const isSelected = theme.id === currentThemeId;
        return (
          <button
            key={theme.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setThemeId(theme.id)}
            className={`theme-pill ${isSelected ? 'selected' : ''}`}
          >
            {theme.name}
          </button>
        );
      })}
    </div>
  );
}
