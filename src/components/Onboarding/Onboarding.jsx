import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRightIcon } from "../UI/Icons";
import logoUrl from "/steadfast-logo.png";

export default function Onboarding() {
  const { setUserName } = useApp();
  const [name, setName] = useState("");

  function handleContinue() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserName(trimmed);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleContinue();
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-content">
        <img
          src={logoUrl}
          alt="Steadfast"
          className="onboarding-logo"
        />

        <div className="onboarding-text">
          <h1 className="onboarding-title">Welcome to Steadfast</h1>
          <p className="onboarding-sub">
            Faith. Discipline. Purpose.
          </p>
        </div>

        <div className="onboarding-form">
          <label className="onboarding-label" htmlFor="onboarding-name">
            What should we call you?
          </label>
          <input
            id="onboarding-name"
            className="onboarding-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Your name…"
            autoFocus
            maxLength={40}
          />
          <button
            className="btn btn-primary onboarding-btn"
            onClick={handleContinue}
            disabled={!name.trim()}
          >
            Get Started
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
