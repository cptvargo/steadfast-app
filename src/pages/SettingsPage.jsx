import ThemeSwitcher from "../components/UI/ThemeSwitcher";

export default function SettingsPage() {
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
    </div>
  );
}
