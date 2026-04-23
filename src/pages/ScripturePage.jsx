import { useEffect, useState } from "react";
import { getDailyScripture } from "../services/bibleApi";
import { getVerseInsight } from "../services/claudeApi";
import { getData, saveData } from "../utils/storage";
import { localDateStr } from "../utils/date";
import { ChevronDownIcon, ChevronUpIcon } from "../components/UI/Icons";

const FALLBACK_PROMPTS = [
  "What does this verse reveal about God's character?",
  "What does it say about who you are — or who you're becoming?",
  "How can you carry this truth into the hours ahead?",
];

function getReflectionKey(dateStr) {
  return `scripture_reflection_${dateStr}`;
}

function getVerseKey(dateStr) {
  return `daily_verse_${dateStr}`;
}

function getPastReadings(limit = 30) {
  const entries = [];
  for (let i = 1; i <= limit; i++) {
    const dateStr = localDateStr(i);
    const verse = getData(getVerseKey(dateStr));
    const reflection = getData(getReflectionKey(dateStr));
    if (verse || reflection) {
      entries.push({ dateStr, verse, reflection });
    }
  }
  return entries;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function PastReadingRow({ entry }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="history-row">
      <button className="history-row-header" onClick={() => setOpen((o) => !o)}>
        <span className="history-row-date">{formatDate(entry.dateStr)}</span>
        <span className="history-row-ref">{entry.verse?.reference || ""}</span>
        {open ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
      </button>
      {open && (
        <div className="history-row-body">
          {entry.verse && (
            <p className="history-verse-text">"{entry.verse.text}"</p>
          )}
          {entry.reflection ? (
            <>
              <p className="history-label">Your reflection</p>
              <p className="history-reflection-text">{entry.reflection}</p>
            </>
          ) : (
            <p className="history-empty">No reflection saved for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScripturePage() {
  const today = localDateStr();
  const verseCacheKey  = `daily_verse_${today}`;
  const insightCacheKey = `verse_insight_${today}`;
  const hasApiKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY;

  // Seed from cache immediately — no spinner on return visits
  const [verse,        setVerse]        = useState(() => getData(verseCacheKey) || null);
  const [verseLoad,    setVerseLoad]    = useState(() => !getData(verseCacheKey));
  const [insight,      setInsight]      = useState(() => getData(insightCacheKey) || null);
  const [insightLoad,  setInsightLoad]  = useState(() => hasApiKey && !getData(insightCacheKey));
  const [insightTried, setInsightTried] = useState(() => !!getData(insightCacheKey));
  const [reflection,   setReflection]   = useState(() => getData(getReflectionKey(today)) || "");
  const [saved,        setSaved]        = useState(false);
  const [pastOpen,     setPastOpen]     = useState(false);
  const [pastEntries,  setPastEntries]  = useState([]);

  useEffect(() => {
    // Already cached — nothing to fetch
    if (!verseLoad && !insightLoad) return;

    getDailyScripture().then((v) => {
      setVerse(v);
      setVerseLoad(false);

      if (hasApiKey && !getData(insightCacheKey)) {
        setInsightLoad(true);
        getVerseInsight(v).then((result) => {
          setInsight(result);
          setInsightLoad(false);
          setInsightTried(true);
        });
      }
    });
  }, []);

  function saveReflection() {
    saveData(getReflectionKey(today), reflection);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePastToggle() {
    if (!pastOpen && pastEntries.length === 0) {
      setPastEntries(getPastReadings(60));
    }
    setPastOpen((o) => !o);
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">Daily Scripture</p>
        <h1 className="page-title">Meditate &amp; Reflect</h1>
      </header>

      {/* ── Verse ── */}
      <section className="card scripture-card">
        <div className="scripture-label">Today's Verse</div>
        {verseLoad ? (
          <p className="scripture-loading">Loading verse…</p>
        ) : (
          <>
            <p className="scripture-text">"{verse.text}"</p>
            <footer className="scripture-ref">— {verse.reference}</footer>
          </>
        )}
      </section>

      {/* ── AI Breakdown ── */}
      {hasApiKey && (
        <section className="card insight-card">
          <div className="section-label">What this is saying</div>
          {insightLoad ? (
            <div className="insight-skeleton">
              <div className="skeleton-line" style={{ width: "92%" }} />
              <div className="skeleton-line" style={{ width: "80%" }} />
              <div className="skeleton-line" style={{ width: "87%" }} />
            </div>
          ) : insight ? (
            <p className="insight-breakdown">{insight.breakdown}</p>
          ) : insightTried ? (
            <p className="insight-error">Could not load reflection for this verse. Check back later.</p>
          ) : null}
        </section>
      )}

      {/* ── Life Scenarios ── */}
      {hasApiKey && (
        <section className="card">
          <div className="section-label">Where you might see this</div>
          <p className="insight-subtext">Real moments where this truth shows up — sit with whichever one resonates.</p>
          {insightLoad ? (
            <div className="insight-skeleton">
              {[88, 76, 83].map((w, i) => (
                <div key={i} className="skeleton-line" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : insight ? (
            <ol className="application-list">
              {insight.applications.map((app, i) => (
                <li key={i} className="application-item">
                  <span className="application-number">{i + 1}</span>
                  <span className="application-text">{app}</span>
                </li>
              ))}
            </ol>
          ) : insightTried ? (
            <p className="insight-error">Life scenarios unavailable right now.</p>
          ) : null}
        </section>
      )}

      {/* ── Personal Reflection ── */}
      <section className="card">
        <div className="section-label">Your reflection</div>
        <div className="reflection-prompts">
          {(insight?.reflectionPrompts || FALLBACK_PROMPTS).map((p, i) => (
            <p key={i} className="reflection-prompt">{p}</p>
          ))}
        </div>
        <textarea
          className="journal-textarea"
          rows={6}
          value={reflection}
          onChange={(e) => { setReflection(e.target.value); setSaved(false); }}
          placeholder="Write what this verse stirs in you. No filter needed — just be honest."
          style={{ minHeight: "140px" }}
        />
        <div className="journal-footer">
          <button className="btn btn-primary" onClick={saveReflection}>
            Save reflection
          </button>
          {saved && <span className="save-feedback">Saved</span>}
        </div>
      </section>

      {/* ── Past Readings ── */}
      <section className="card">
        <button className="history-toggle-btn" onClick={handlePastToggle}>
          <span>Past readings</span>
          {pastOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </button>
        {pastOpen && (
          <div className="history-list">
            {pastEntries.length === 0 ? (
              <p className="history-empty">No past readings yet. Come back tomorrow.</p>
            ) : (
              pastEntries.map((entry) => (
                <PastReadingRow key={entry.dateStr} entry={entry} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
