import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Home from "./pages/Home";
import ScripturePage from "./pages/ScripturePage";
import GoalsPage from "./pages/GoalsPage";
import JournalPage from "./pages/JournalPage";
import SettingsPage from "./pages/SettingsPage";
import BottomNav from "./components/UI/BottomNav";
import DailyCheckIn from "./components/DailyCheckIn/DailyCheckIn";
import Onboarding from "./components/Onboarding/Onboarding";
import "./App.css";

function AppShell() {
  const { userName, checkInDone } = useApp();

  if (!userName) {
    return <Onboarding />;
  }

  if (!checkInDone) {
    return <DailyCheckIn />;
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/scripture" element={<ScripturePage />} />
        <Route path="/goals"     element={<GoalsPage />} />
        <Route path="/journal"   element={<JournalPage />} />
        <Route path="/settings"  element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppShell />
      </Router>
    </AppProvider>
  );
}
