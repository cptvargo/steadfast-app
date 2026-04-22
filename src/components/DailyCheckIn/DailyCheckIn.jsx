import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRightIcon, ShieldIcon } from "../UI/Icons";

function SkipWarning({ streak, name }) {
  let message;
  if (streak >= 30) {
    message = `${name ? `${name}, a` : "A"} month of skipping this. That's not a busy season — that's a pattern. You downloaded this app because something in you wants more. That part of you is still right. Today, don't skip.`;
  } else if (streak >= 21) {
    message = `Three weeks in a row. You're not too busy — you're avoiding it. Accountability only works when you show up for it. Write something, even one sentence. That's all it takes to break the streak.`;
  } else {
    message = `You've skipped ${streak} days straight. That's okay — life gets loud. But this app exists because you wanted to be intentional. Skipping every day quietly works against that. Take 30 seconds and write what you're committing to today.`;
  }

  return (
    <div className="skip-warning">
      <div className="skip-warning-icon">
        <ShieldIcon size={18} />
      </div>
      <p className="skip-warning-text">{message}</p>
    </div>
  );
}

function getGreeting(name) {
  const h = new Date().getHours();
  let base;
  if (h >= 5  && h < 12) base = "Good morning";
  else if (h >= 12 && h < 17) base = "Good afternoon";
  else if (h >= 17 && h < 21) base = "Good evening";
  else base = "You're up late";
  return name ? `${base}, ${name}.` : `${base}.`;
}

export default function DailyCheckIn() {
  const { completeCheckIn, getYesterdaysIntentions, userName, skipStreak } = useApp();
  const yesterday = getYesterdaysIntentions();
  const [intentions, setIntentions] = useState(yesterday);
  const [useYesterday, setUseYesterday] = useState(!!yesterday);

  function handleStart() {
    completeCheckIn(intentions.trim());
  }

  function handleSkip() {
    completeCheckIn("");
  }

  function handleLoadYesterday() {
    setIntentions(yesterday);
    setUseYesterday(true);
  }

  function handleFresh() {
    setIntentions("");
    setUseYesterday(false);
  }

  return (
    <div className="checkin-screen">
      <div className="checkin-content">
        <p className="checkin-greeting">{getGreeting(userName)}</p>
        <h1 className="checkin-title">What are we being accountable on today?</h1>

        {skipStreak >= 15 && <SkipWarning streak={skipStreak} name={userName} />}
        <p className="checkin-sub">
          Write out what you're committing to. You'll see this on your dashboard all day.
        </p>

        {yesterday && (
          <div className="checkin-yesterday-bar">
            <span className="checkin-yesterday-label">Yesterday's intentions</span>
            <div className="checkin-yesterday-actions">
              <button
                className={`checkin-toggle${useYesterday ? " active" : ""}`}
                onClick={handleLoadYesterday}
              >
                Use these
              </button>
              <button
                className={`checkin-toggle${!useYesterday ? " active" : ""}`}
                onClick={handleFresh}
              >
                Start fresh
              </button>
            </div>
            {useYesterday && (
              <p className="checkin-yesterday-preview">{yesterday}</p>
            )}
          </div>
        )}

        <textarea
          className="checkin-textarea"
          value={intentions}
          onChange={(e) => setIntentions(e.target.value)}
          placeholder={
            yesterday
              ? "Edit or keep yesterday's intentions…"
              : "e.g. Pray for 10 minutes, finish the project proposal, exercise after work…"
          }
          rows={5}
          autoFocus
        />

        <button
          className="btn btn-primary checkin-submit"
          onClick={handleStart}
          disabled={!intentions.trim()}
        >
          Start My Day
          <ArrowRightIcon size={18} />
        </button>

        <button className="btn-text checkin-skip" onClick={handleSkip}>
          Skip for today
        </button>
      </div>
    </div>
  );
}
