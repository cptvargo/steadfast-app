import { useApp } from "../../context/AppContext";

const THEMES = ["feminine", "neutral", "masculine"];

export default function ThemeSwitcher() {
  const { theme, applyTheme } = useApp();

  return (
    <div style={styles.row}>
      {THEMES.map((t) => (
        <button
          key={t}
          onClick={() => applyTheme(t)}
          style={{ ...styles.btn, ...(theme === t ? styles.active : {}) }}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

const styles = {
  row: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  btn: { fontSize: "0.8rem", padding: "0.3rem 0.7rem" },
  active: { background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary)" },
};
