import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaMusic } from "react-icons/fa";
import PlayListCard from "../ui/PlayListCard";

const NAV_ITEMS = [
  { label: "Home",   path: "/",       icon: FaHome },
  { label: "Search", path: "/search", icon: FaSearch },
  { label: "Music",  path: "/music",  icon: FaMusic },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-60 h-full flex flex-col gap-2 p-2 shrink-0">
      {/* ── Navigation ─────────────────────────────── */}
      <nav className="bg-surface rounded-xl p-3 flex flex-col gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
          <img src="/logo.png" alt="Logo" className="w-7 h-7" />
          <span className="text-sm font-bold text-white tracking-tight">Music App</span>
        </div>

        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left
                transition-colors duration-150 text-sm font-medium
                ${active
                  ? "bg-elevated text-white"
                  : "text-dim hover:text-white hover:bg-elevated/50"}
              `}
            >
              <Icon size={15} className={active ? "text-white" : "text-dim"} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* ── Library ────────────────────────────────── */}
      <div className="bg-surface rounded-xl p-3 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1 mb-3">
          <span className="text-xs font-semibold text-dim uppercase tracking-wider">
            Your Library
          </span>
        </div>
        <PlayListCard />
      </div>
    </aside>
  );
};

export default Sidebar;
