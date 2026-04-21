import { useState } from "react";
import { saveData, getData } from "../../utils/storage";

const DEFAULT_HABITS = ["Prayer", "Bible Reading", "Exercise", "Journaling"];

function getStoredChecks() {
  return getData("tracker_checks") || {};
}

export default function Tracker() {
  const [checks, setChecks] = useState(getStoredChecks);

  function toggle(habit) {
    const updated = { ...checks, [habit]: !checks[habit] };
    setChecks(updated);
    saveData("tracker_checks", updated);
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Daily Tracker</h2>
      <ul style={styles.list}>
        {DEFAULT_HABITS.map((habit) => (
          <li key={habit} style={styles.item} onClick={() => toggle(habit)}>
            <span style={{ ...styles.check, color: checks[habit] ? "var(--color-primary)" : "var(--color-border)" }}>
              {checks[habit] ? "✔" : "○"}
            </span>
            <span style={checks[habit] ? styles.done : undefined}>{habit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const styles = {
  section: { padding: "1rem 0" },
  heading: { fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--color-primary)" },
  list: { listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" },
  item: { display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.4rem 0" },
  check: { fontSize: "1.2rem", width: "1.4rem", textAlign: "center" },
  done: { textDecoration: "line-through", color: "var(--color-text-muted)" },
};
