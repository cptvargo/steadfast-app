import { useEffect, useState } from "react";
import { getDailyScripture } from "../../services/bibleApi";

export default function Scripture() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyScripture().then((data) => {
      setVerse(data);
      setLoading(false);
    });
  }, []);

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Daily Scripture</h2>
      {loading ? (
        <p style={styles.muted}>Loading verse...</p>
      ) : (
        <blockquote style={styles.quote}>
          <p style={styles.text}>"{verse.text}"</p>
          <footer style={styles.ref}>— {verse.reference}</footer>
        </blockquote>
      )}
    </section>
  );
}

const styles = {
  section: { padding: "1rem 0" },
  heading: { fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--color-primary)" },
  muted: { color: "var(--color-text-muted)", fontSize: "0.9rem" },
  quote: { borderLeft: "3px solid var(--color-primary)", paddingLeft: "1rem", margin: 0 },
  text: { fontStyle: "italic", lineHeight: 1.6 },
  ref: { marginTop: "0.4rem", fontSize: "0.85rem", color: "var(--color-text-muted)" },
};
