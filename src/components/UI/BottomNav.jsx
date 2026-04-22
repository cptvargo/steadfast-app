import { NavLink } from "react-router-dom";
import { HomeIcon, BookOpenIcon, TargetIcon, PenIcon, SettingsIcon } from "./Icons";

const ITEMS = [
  { to: "/",          label: "Today",     Icon: HomeIcon },
  { to: "/scripture", label: "Scripture", Icon: BookOpenIcon },
  { to: "/goals",     label: "Goals",     Icon: TargetIcon },
  { to: "/journal",   label: "Journal",   Icon: PenIcon },
  { to: "/settings",  label: "Settings",  Icon: SettingsIcon },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
