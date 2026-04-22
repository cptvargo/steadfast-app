import { useApp } from "../context/AppContext";
import AccountabilityCard from "../components/Accountability/AccountabilityCard";
import Tracker from "../components/Tracker/Tracker";

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function Home() {
  const { userName } = useApp();

  return (
    <div className="page">
      <header className="app-header">
        <div>
          <h1 className="app-title">Steadfast</h1>
          <p className="app-subtitle">
            {userName ? `Welcome back, ${userName}` : TODAY}
          </p>
          {userName && <p className="app-date">{TODAY}</p>}
        </div>
      </header>

      <AccountabilityCard />
      <Tracker />
    </div>
  );
}
