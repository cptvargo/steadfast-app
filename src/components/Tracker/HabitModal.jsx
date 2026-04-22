import { useState } from "react";
import Modal from "../UI/Modal";
import { useApp } from "../../context/AppContext";

export default function HabitModal({ habit, onClose }) {
  const { todayData, completeHabit, uncompleteHabit } = useApp();
  const entry = todayData[habit.id];
  const isComplete = !!entry?.completed;
  const [note, setNote] = useState(entry?.note || "");

  function handleComplete() {
    completeHabit(habit.id, note.trim());
    onClose();
  }

  function handleUncomplete() {
    uncompleteHabit(habit.id);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      {isComplete ? (
        <>
          <p className="modal-overline">Completed today</p>
          <h2 className="modal-title">{habit.name}</h2>
          {entry.note ? (
            <>
              <p className="modal-prompt">Your reflection</p>
              <div className="modal-note">{entry.note}</div>
            </>
          ) : (
            <p className="modal-empty-note">No reflection added for this one.</p>
          )}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={handleUncomplete}>
              Mark Incomplete
            </button>
            <button className="btn-text" onClick={onClose}>Close</button>
          </div>
        </>
      ) : (
        <>
          <p className="modal-overline">Complete Habit</p>
          <h2 className="modal-title">{habit.name}</h2>
          <p className="modal-prompt">
            Before you check this off — how did it go? Even a few words counts.
          </p>
          <textarea
            className="journal-textarea"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you notice? How did you show up?"
            autoFocus
            onFocus={(e) =>
              setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100)
            }
          />
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleComplete}>
              Mark Complete
            </button>
            <button className="btn-text" onClick={onClose}>Cancel</button>
          </div>
        </>
      )}
    </Modal>
  );
}
