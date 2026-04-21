import { useState } from "react";
import { saveData, getData } from "../../utils/storage";

function getStoredGoals() {
  return getData("goals") || [];
}

export default function Goals() {
  const [goals, setGoals] = useState(getStoredGoals);
  const [input, setInput] = useState("");

  function addGoal() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const updated = [...goals, { id: Date.now(), text: trimmed }];
    setGoals(updated);
    saveData("goals", updated);
    setInput("");
  }

  function removeGoal(id) {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveData("goals", updated);
  }

  function handleKey(e) {
    if (e.key === "Enter") addGoal();
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Goals</h2>
      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add a goal..."
        />
        <button className="primary" onClick={addGoal} style={{ marginLeft: "0.5rem", whiteSpace: "nowrap" }}>
          Add
        </button>
      </div>
      <ul style={styles.list}>
        {goals.map((g) => (
          <li key={g.id} style={styles.item}>
            <span style={{ flex: 1 }}>{g.text}</span>
            <button onClick={() => removeGoal(g.id)} style={styles.remove}>✕</button>
          </li>
        ))}
        {goals.length === 0 && <li style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>No goals yet.</li>}
      </ul>
    </section>
  );
}

const styles = {
  section: { padding: "1rem 0" },
  heading: { fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--color-primary)" },
  inputRow: { display: "flex", marginBottom: "0.75rem" },
  list: { listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" },
  item: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.5rem", background: "var(--color-surface)", borderRadius: "6px" },
  remove: { background: "none", border: "none", color: "var(--color-text-muted)", fontSize: "0.85rem", padding: "0 0.25rem" },
};
