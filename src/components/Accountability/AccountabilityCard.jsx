import { useApp } from "../../context/AppContext";
import {
  getAccountabilityMessage,
  getStreak,
  getDayRate,
  getDateStr,
} from "../../utils/streaks";
import {
  FlameIcon,
  CircleCheckIcon,
  SparklesIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "../UI/Icons";

const TYPE_META = {
  fire:     { Icon: FlameIcon,       cls: "fire"     },
  success:  { Icon: CircleCheckIcon, cls: "success"  },
  progress: { Icon: SparklesIcon,    cls: "progress" },
  streak:   { Icon: FlameIcon,       cls: "fire"     },
  encourage:{ Icon: ShieldIcon,      cls: "encourage"},
  challenge:{ Icon: ShieldIcon,      cls: "challenge"},
  neutral:  { Icon: SparklesIcon,    cls: "neutral"  },
  start:    { Icon: ArrowRightIcon,  cls: "neutral"  },
};

export default function AccountabilityCard() {
  const { habits, todayData, getTodaysIntentions } = useApp();
  const msg = getAccountabilityMessage(habits, todayData);
  const streak = getStreak(habits);
  const { Icon, cls } = TYPE_META[msg.type] || TYPE_META.neutral;

  const todayRate =
    habits.length
      ? habits.filter((h) => todayData[h.id]?.completed).length / habits.length
      : 0;

  const pastDots = Array.from({ length: 6 }, (_, i) => ({
    key: getDateStr(i + 1),
    filled: getDayRate(getDateStr(i + 1), habits) >= 0.5,
  }));

  const intentions = getTodaysIntentions();

  return (
    <div className="accountability-card">
      <div className={`accountability-icon icon-${cls}`}>
        <Icon size={20} />
      </div>

      <div className="accountability-body">
        <div className="accountability-overline">{msg.label}</div>
        <p className="accountability-message">{msg.text}</p>

        {intentions && (
          <div className="accountability-intentions">
            <span className="intentions-label">Today's intention</span>
            <p className="intentions-text">{intentions}</p>
          </div>
        )}

        <div className="streak-dots">
          {pastDots.map(({ key, filled }) => (
            <div key={key} className={`streak-dot${filled ? " filled" : ""}`} />
          ))}
          <div className={`streak-dot today${todayRate >= 0.5 ? " filled" : ""}`} />
          {streak > 7 && (
            <span className="streak-more">+{streak - 7}</span>
          )}
        </div>
      </div>
    </div>
  );
}
