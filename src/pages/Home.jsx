import Tracker from "../components/Tracker/Tracker";
import Goals from "../components/Goals/Goals";
import Scripture from "../components/Scripture/Scripture";
import Journal from "../components/Journal/Journal";
import ThemeSwitcher from "../components/UI/ThemeSwitcher";

export default function Home() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>Accountability</h1>
        <ThemeSwitcher />
      </header>

      <div style={styles.divider} />
      <Scripture />
      <div style={styles.divider} />
      <Tracker />
      <div style={styles.divider} />
      <Goals />
      <div style={styles.divider} />
      <Journal />
    </main>
  );
}

const styles = {
  main: { maxWidth: "640px", margin: "0 auto", padding: "1rem 1.25rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", paddingBottom: "0.75rem" },
  title: { fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary)" },
  divider: { height: "1px", background: "var(--color-border)", margin: "0.25rem 0" },
};
