import { useState } from "react";
import { getData, saveData } from "../utils/storage";
import { localDateStr } from "../utils/date";
import { ChevronDownIcon, ChevronUpIcon } from "../components/UI/Icons";

function getJournalKey(dateStr) {
  return `journal_${dateStr}`;
}

function getPastEntries(limit = 60) {
  const entries = [];
  for (let i = 1; i <= limit; i++) {
    const dateStr = localDateStr(i);
    const text = getData(getJournalKey(dateStr));
    if (text) entries.push({ dateStr, text });
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

function PastEntryRow({ entry }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="history-row">
      <button className="history-row-header" onClick={() => setOpen((o) => !o)}>
        <span className="history-row-date">{formatDate(entry.dateStr)}</span>
        {open ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
      </button>
      {open && (
        <div className="history-row-body">
          <p className="history-reflection-text">{entry.text}</p>
        </div>
      )}
    </div>
  );
}

const TODAY_LABEL = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function JournalPage() {
  const today = localDateStr();
  const [entry,    setEntry]    = useState(() => getData(getJournalKey(today)) || "");
  const [saved,    setSaved]    = useState(false);
  const [pastOpen, setPastOpen] = useState(false);
  const [pastEntries, setPastEntries] = useState([]);

  function save() {
    saveData(getJournalKey(today), entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePastToggle() {
    if (!pastOpen && pastEntries.length === 0) {
      setPastEntries(getPastEntries(60));
    }
    setPastOpen((o) => !o);
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">{TODAY_LABEL}</p>
        <h1 className="page-title">Journal</h1>
      </header>

      <section className="card">
        <div className="section-label">Today's Entry</div>
        <textarea
          className="journal-textarea"
          rows={12}
          value={entry}
          onChange={(e) => { setEntry(e.target.value); setSaved(false); }}
          placeholder="What happened today? What are you grateful for? What's weighing on you? Write without filter."
          style={{ minHeight: "260px" }}
        />
        <div className="journal-footer">
          <button className="btn btn-primary" onClick={save}>Save entry</button>
          {saved && <span className="save-feedback">Saved</span>}
        </div>
      </section>

      {/* ── Past Entries ── */}
      <section className="card">
        <button className="history-toggle-btn" onClick={handlePastToggle}>
          <span>Past entries</span>
          {pastOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </button>
        {pastOpen && (
          <div className="history-list">
            {pastEntries.length === 0 ? (
              <p className="history-empty">No past entries yet. Start writing today.</p>
            ) : (
              pastEntries.map((entry) => (
                <PastEntryRow key={entry.dateStr} entry={entry} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
