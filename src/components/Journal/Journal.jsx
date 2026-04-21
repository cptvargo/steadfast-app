import { useState } from "react";
import { saveData, getData } from "../../utils/storage";

function getTodayKey() {
  return `journal_${new Date().toISOString().slice(0, 10)}`;
}

export default function Journal() {
  const [entry, setEntry] = useState(() => getData(getTodayKey()) || "");
  const [saved, setSaved] = useState(false);

  function save() {
    saveData(getTodayKey(), entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Journal</h2>
      <textarea
        rows={6}
        value={entry}
        onChange={(e) => { setEntry(e.target.value); setSaved(false); }}
        placeholder="Write your thoughts for today..."
        style={styles.textarea}
      />
      <div style={styles.footer}>
        <button className="primary" onClick={save}>Save</button>
        {saved && <span style={styles.saved}>Saved!</span>}
      </div>
    </section>
  );
}

const styles = {
  section: { padding: "1rem 0" },
  heading: { fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--color-primary)" },
  textarea: { resize: "vertical", minHeight: "120px" },
  footer: { display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" },
  saved: { fontSize: "0.85rem", color: "var(--color-primary)" },
};
