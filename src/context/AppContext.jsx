import { createContext, useContext, useState, useEffect, useRef } from "react";
import { saveData, getData } from "../utils/storage";
import { localDateStr } from "../utils/date";

const AppContext = createContext(null);

const DEFAULT_HABITS = [
  { id: "habit_prayer",   name: "Morning Prayer", createdAt: Date.now() },
  { id: "habit_bible",    name: "Bible Reading",  createdAt: Date.now() },
  { id: "habit_exercise", name: "Exercise",       createdAt: Date.now() },
];

function initTheme() {
  const stored = getData("app_theme") || "feminine";
  document.documentElement.setAttribute("data-theme", stored);
  return stored;
}

function isCheckInDone() {
  return !!getData(`daily_checkin_${localDateStr()}`);
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initTheme);
  const [userName, setUserNameState] = useState(() => getData("user_name") || "");
  const [habits, setHabitsState] = useState(
    () => getData("habits") || DEFAULT_HABITS
  );
  const [todayData, setTodayDataState] = useState(
    () => getData(`tracker_${localDateStr()}`) || {}
  );
  const [checkInDone, setCheckInDone] = useState(isCheckInDone);
  const [skipStreak, setSkipStreakState] = useState(() => getData("checkin_skip_streak") || 0);
  const activeDateRef = useRef(localDateStr());

  // When the app comes back to the foreground, check if the date rolled over
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState !== "visible") return;
      const today = localDateStr();
      if (today !== activeDateRef.current) {
        activeDateRef.current = today;
        setTodayDataState(getData(`tracker_${today}`) || {});
        setCheckInDone(!!getData(`daily_checkin_${today}`));
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  function setUserName(name) {
    setUserNameState(name);
    saveData("user_name", name);
  }

  function applyTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
    setTheme(name);
    saveData("app_theme", name);
  }

  function setHabits(updated) {
    setHabitsState(updated);
    saveData("habits", updated);
  }

  function completeHabit(habitId, note) {
    const updated = {
      ...todayData,
      [habitId]: { completed: true, note: note || "", completedAt: Date.now() },
    };
    setTodayDataState(updated);
    saveData(`tracker_${localDateStr()}`, updated);
  }

  function uncompleteHabit(habitId) {
    const { [habitId]: _removed, ...rest } = todayData;
    setTodayDataState(rest);
    saveData(`tracker_${localDateStr()}`, rest);
  }

  function completeCheckIn(intentions) {
    saveData(`daily_checkin_${localDateStr()}`, {
      intentions,
      submittedAt: Date.now(),
    });
    if (intentions.trim()) {
      setSkipStreakState(0);
      saveData("checkin_skip_streak", 0);
    } else {
      const next = skipStreak + 1;
      setSkipStreakState(next);
      saveData("checkin_skip_streak", next);
    }
    setCheckInDone(true);
  }

  function getYesterdaysIntentions() {
    return getData(`daily_checkin_${localDateStr(1)}`)?.intentions || "";
  }

  function getTodaysIntentions() {
    return getData(`daily_checkin_${localDateStr()}`)?.intentions || "";
  }

  return (
    <AppContext.Provider
      value={{
        theme, applyTheme,
        userName, setUserName,
        habits, setHabits,
        todayData, completeHabit, uncompleteHabit,
        checkInDone, completeCheckIn, skipStreak,
        getYesterdaysIntentions, getTodaysIntentions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext);
}
