import { useAppStore } from '../store/app-store';
import { getPresetThemes } from '../core/theme-manager';

const presetThemes = getPresetThemes();

export function ThemeSelector() {
  const currentThemeId = useAppStore((s) => s.currentThemeId);
  const setThemeId = useAppStore((s) => s.setThemeId);
  const customThemes = useAppStore((s) => s.customThemes);

  const themes = [...presetThemes, ...customThemes];

  return (
    <div role="radiogroup" aria-label="主题选择" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {themes.map((theme) => {
        const isSelected = theme.id === currentThemeId;
        const isCustom = customThemes.some((t) => t.id === theme.id);
        return (
          <button
            key={theme.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setThemeId(theme.id)}
            className={`theme-pill ${isSelected ? 'selected' : ''}`}
          >
            {isCustom ? '🎨 ' : ''}{theme.name}
          </button>
        );
      })}
    </div>
  );
}
