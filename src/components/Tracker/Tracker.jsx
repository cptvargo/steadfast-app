import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PlusIcon, XIcon, CheckIcon } from "../UI/Icons";
import HabitModal from "./HabitModal";

const RADIUS = 27;
const CIRC = 2 * Math.PI * RADIUS;

const GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#818cf8)",
  "linear-gradient(135deg,#db2777,#f472b6)",
  "linear-gradient(135deg,#059669,#34d399)",
  "linear-gradient(135deg,#d97706,#fbbf24)",
  "linear-gradient(135deg,#7c3aed,#a78bfa)",
  "linear-gradient(135deg,#dc2626,#f87171)",
];

function avatarGradient(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

export default function Tracker() {
  const { habits, setHabits, todayData } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [activeHabit, setActiveHabit] = useState(null);

  const completed = habits.filter((h) => todayData[h.id]?.completed).length;
  const total = habits.length;
  const fillOffset = total ? CIRC - (completed / total) * CIRC : CIRC;

  function addHabit() {
    const name = newName.trim();
    if (!name) return;
    setHabits([...habits, { id: `habit_${Date.now()}`, name, createdAt: Date.now() }]);
    setNewName("");
  }

  function removeHabit(id) {
    setHabits(habits.filter((h) => h.id !== id));
  }

  function handleTap(habit) {
    if (editMode) return;
    setActiveHabit(habit);
  }

  return (
    <>
      <section className="card">
        <div className="tracker-header">
          <div className="tracker-header-text">
            <div className="section-label">Daily Tracker</div>
            <p className="tracker-sub">
              {total === 0
                ? "Add your first habit below"
                : completed === total
                ? "All habits complete — great work"
                : `${total - completed} remaining today`}
            </p>
          </div>

          <div className="tracker-controls">
            <button
              className={`btn ${editMode ? "btn-primary" : "btn-ghost"}`}
              style={{ padding: "0.35rem 0.8rem", fontSize: "0.78rem" }}
              onClick={() => { setEditMode((v) => !v); setNewName(""); }}
            >
              {editMode ? "Done" : "Edit"}
            </button>

            {!editMode && total > 0 && (
              <div className="progress-ring-wrap">
                <svg width="68" height="68" viewBox="0 0 68 68">
                  <circle className="progress-ring-bg" cx="34" cy="34" r={RADIUS} />
                  <circle
                    className="progress-ring-fill"
                    cx="34" cy="34" r={RADIUS}
                    strokeDasharray={CIRC}
                    strokeDashoffset={fillOffset}
                  />
                </svg>
                <div className="progress-ring-label">
                  <span className="progress-ring-count">{completed}</span>
                  <span className="progress-ring-total">/ {total}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <ul className="habits-list">
          {habits.map((habit) => {
            const done = !!todayData[habit.id]?.completed;
            return (
              <li
                key={habit.id}
                className={`habit-item${done ? " done" : ""}`}
                onClick={() => handleTap(habit)}
              >
                <span
                  className="habit-avatar"
                  style={{ background: avatarGradient(habit.name) }}
                >
                  {habit.name.charAt(0).toUpperCase()}
                </span>
                <span className="habit-name">{habit.name}</span>
                {editMode ? (
                  <button
                    className="btn-danger"
                    onClick={(e) => { e.stopPropagation(); removeHabit(habit.id); }}
                    aria-label={`Remove ${habit.name}`}
                  >
                    <XIcon size={14} />
                  </button>
                ) : (
                  <span className="habit-check">
                    {done && <CheckIcon size={14} />}
                  </span>
                )}
              </li>
            );
          })}

          {total === 0 && (
            <li className="goals-empty">No habits yet — add one below.</li>
          )}
        </ul>

        {(editMode || total === 0) && (
          <div className="add-habit-row">
            <input
              className="text-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder="Name your habit…"
              autoFocus={editMode && total > 0}
            />
            <button className="btn btn-primary" onClick={addHabit} style={{ padding: "0.5rem 0.85rem" }}>
              <PlusIcon size={16} />
            </button>
          </div>
        )}
      </section>

      {activeHabit && (
        <HabitModal habit={activeHabit} onClose={() => setActiveHabit(null)} />
      )}
    </>
  );
}
