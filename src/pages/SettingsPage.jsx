import { useState } from "react";
import ThemeSwitcher from "../components/UI/ThemeSwitcher";
import { getData } from "../utils/storage";

export default function SettingsPage() {
  const [showDebug, setShowDebug] = useState(false);
  const insightError = getData("insight_last_error");
  const apiKeyPresent = !!import.meta.env.VITE_ANTHROPIC_API_KEY;
  const bibleKeyPresent = !!import.meta.env.VITE_API_BIBLE_KEY;

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">Preferences</p>
        <h1 className="page-title">Settings</h1>
      </header>

      <section className="card">
        <div className="section-label">App theme</div>
        <p className="settings-description">
          Choose how Steadfast looks. The default palette is drawn from the Steadfast logo.
        </p>
        <ThemeSwitcher expanded />
      </section>

      <section className="card">
        <button className="history-toggle-btn" onClick={() => setShowDebug((o) => !o)}>
          <span>Diagnostics</span>
        </button>
        {showDebug && (
          <div style={{ marginTop: "1rem", fontSize: "0.8rem", lineHeight: 1.6 }}>
            <p>Bible API key: <strong>{bibleKeyPresent ? "✓ present" : "✗ missing"}</strong></p>
            <p>Anthropic API key: <strong>{apiKeyPresent ? "✓ present" : "✗ missing"}</strong></p>
            {insightError && (
              <p style={{ marginTop: "0.5rem", color: "var(--color-error, #c0392b)" }}>
                Last insight error: {insightError}
              </p>
            )}
            {!insightError && <p>No insight errors recorded.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
