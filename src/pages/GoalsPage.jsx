import { useState } from "react";
import { getData, saveData } from "../utils/storage";
import { PlusIcon, CheckIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from "../components/UI/Icons";

function loadGoals() {
  return (getData("goals") || []).map((g) => ({
    completed:   false,
    completedAt: null,
    notes:       "",
    createdAt:   g.id,
    ...g,
  }));
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function GoalsPage() {
  const [goals,      setGoals]      = useState(loadGoals);
  const [input,      setInput]      = useState("");
  const [filter,     setFilter]     = useState("active");
  const [expandedId, setExpandedId] = useState(null);

  function persist(updated) {
    setGoals(updated);
    saveData("goals", updated);
  }

  function addGoal() {
    const text = input.trim();
    if (!text) return;
    persist([
      { id: Date.now(), text, completed: false, completedAt: null, notes: "", createdAt: Date.now() },
      ...goals,
    ]);
    setInput("");
  }

  function toggleGoal(id) {
    persist(
      goals.map((g) =>
        g.id === id
          ? { ...g, completed: !g.completed, completedAt: !g.completed ? Date.now() : null }
          : g
      )
    );
  }

  function deleteGoal(id) {
    persist(goals.filter((g) => g.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function updateNotes(id, notes) {
    persist(goals.map((g) => (g.id === id ? { ...g, notes } : g)));
  }

  const activeCount = goals.filter((g) => !g.completed).length;
  const doneCount   = goals.filter((g) =>  g.completed).length;

  const visible = goals.filter((g) =>
    filter === "active" ? !g.completed :
    filter === "done"   ?  g.completed : true
  );

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">Vision &amp; Intention</p>
        <h1 className="page-title">Goals</h1>
      </header>

      <div className="card">
        <div className="section-label">Add Goal</div>
        <div className="input-row">
          <input
            className="text-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            placeholder="What are you working toward?"
          />
          <button className="btn btn-primary" onClick={addGoal} style={{ padding: "0.5rem 0.85rem" }}>
            <PlusIcon size={16} />
          </button>
        </div>
      </div>

      <div className="filter-tabs">
        {[
          { key: "active", label: `Active (${activeCount})` },
          { key: "all",    label: "All" },
          { key: "done",   label: `Done (${doneCount})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`filter-tab${filter === key ? " active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="goals-page-list">
        {visible.map((goal) => {
          const expanded = expandedId === goal.id;
          return (
            <li key={goal.id} className={`goal-card${goal.completed ? " completed-goal" : ""}`}>
              <div className="goal-card-header">
                <button
                  className="goal-check-btn"
                  onClick={() => toggleGoal(goal.id)}
                  aria-label={goal.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {goal.completed && <CheckIcon size={11} />}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="goal-card-text">{goal.text}</p>
                  <p className="goal-card-meta">
                    {goal.completed
                      ? `Completed ${formatDate(goal.completedAt)}`
                      : `Added ${formatDate(goal.createdAt)}`}
                  </p>
                </div>

                <button
                  className="btn-danger"
                  onClick={() => deleteGoal(goal.id)}
                  aria-label="Delete goal"
                >
                  <XIcon size={14} />
                </button>
              </div>

              <button
                className="goal-expand-btn"
                onClick={() => setExpandedId(expanded ? null : goal.id)}
              >
                {expanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
                {expanded ? "Hide notes" : goal.notes ? "View notes" : "Add notes"}
              </button>

              {expanded && (
                <textarea
                  className="goal-notes-textarea"
                  rows={3}
                  value={goal.notes}
                  onChange={(e) => updateNotes(goal.id, e.target.value)}
                  placeholder="Add context, progress updates, or next steps…"
                  autoFocus
                />
              )}
            </li>
          );
        })}

        {visible.length === 0 && (
          <li className="goals-empty">
            {filter === "done"
              ? "No completed goals yet."
              : "No active goals. Write one above."}
          </li>
        )}
      </ul>
    </div>
  );
}
