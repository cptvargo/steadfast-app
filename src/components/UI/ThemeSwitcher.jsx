import { useApp } from "../../context/AppContext";

const THEMES = [
  {
    id: "feminine",
    label: "Steadfast",
    description: "Logo palette — dusty rose & copper",
    style: { background: "linear-gradient(135deg, #b56878, #c4906a)" },
  },
  {
    id: "neutral",
    label: "Modern",
    description: "Dark navy & indigo",
    style: { background: "linear-gradient(135deg, #6366f1, #818cf8)" },
  },
  {
    id: "masculine",
    label: "Edge",
    description: "Near-black & cyan",
    style: { background: "linear-gradient(135deg, #0891b2, #22d3ee)" },
  },
];

export default function ThemeSwitcher({ expanded = false }) {
  const { theme, applyTheme } = useApp();

  if (expanded) {
    return (
      <div className="theme-switcher-expanded" role="group" aria-label="Choose theme">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={`theme-option${theme === t.id ? " active" : ""}`}
            onClick={() => applyTheme(t.id)}
            aria-pressed={theme === t.id}
          >
            <span className="theme-option-swatch" style={t.style} />
            <span className="theme-option-info">
              <span className="theme-option-name">{t.label}</span>
              <span className="theme-option-desc">{t.description}</span>
            </span>
            {theme === t.id && (
              <span className="theme-option-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="theme-switcher" role="group" aria-label="Choose theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={`theme-dot${theme === t.id ? " active" : ""}`}
          style={t.style}
          onClick={() => applyTheme(t.id)}
          title={t.label}
          aria-label={t.label}
          aria-pressed={theme === t.id}
        />
      ))}
    </div>
  );
}
