import { getData } from "./storage";
import { localDateStr } from "./date";

export function getDateStr(daysAgo = 0) {
  return localDateStr(daysAgo);
}

export function getDayData(dateStr) {
  return getData(`tracker_${dateStr}`) || {};
}

export function getDayRate(dateStr, habits) {
  if (!habits.length) return 0;
  const data = getDayData(dateStr);
  return habits.filter((h) => data[h.id]?.completed).length / habits.length;
}

export function getStreak(habits) {
  if (!habits.length) return 0;
  let streak = 0;
  for (let i = 1; i <= 365; i++) {
    if (getDayRate(localDateStr(i), habits) >= 0.5) streak++;
    else break;
  }
  return streak;
}

export function getAccountabilityMessage(habits, todayData) {
  if (!habits.length) {
    return {
      type: "start",
      label: "Get Started",
      text: "Add your first habit below to begin building consistency.",
    };
  }

  const streak = getStreak(habits);
  const todayCompleted = habits.filter((h) => todayData[h.id]?.completed).length;
  const todayTotal = habits.length;
  const todayRate = todayCompleted / todayTotal;
  const yesterdayRate = getDayRate(localDateStr(1), habits);
  const last7Avg =
    Array.from({ length: 7 }, (_, i) => getDayRate(localDateStr(i + 1), habits))
      .reduce((a, b) => a + b, 0) / 7;

  if (streak >= 21)     return { type: "fire",     label: `${streak}-Day Streak`, text: "You've made this part of who you are. Don't stop." };
  if (streak >= 14)     return { type: "fire",     label: `${streak}-Day Streak`, text: "Two weeks of consistency. This is character, not chance." };
  if (streak >= 7)      return { type: "fire",     label: `${streak}-Day Streak`, text: "A full week. You're not just doing habits — you're building someone." };
  if (todayRate === 1)  return { type: "success",  label: "Today Complete",       text: "All done. You showed up for yourself today." };
  if (todayRate >= 0.5) return { type: "progress", label: "Keep Going",           text: `${todayCompleted} of ${todayTotal} done. Finish what you started.` };
  if (todayRate > 0)    return { type: "progress", label: "In Progress",           text: "You've started. Now follow through." };
  if (streak > 0)       return { type: "streak",   label: `${streak}-Day Streak`, text: `${streak} days strong. Don't let today be the one that breaks it.` };
  if (last7Avg < 0.1 && yesterdayRate === 0)
    return { type: "challenge", label: "Time to Refocus",  text: "It's been quiet. You don't need to catch up — just start today." };
  if (yesterdayRate === 0)
    return { type: "encourage", label: "Fresh Start", text: "Yesterday didn't go as planned. Today is yours — use it." };

  return { type: "neutral", label: "Today", text: "What are you committed to today?" };
}
