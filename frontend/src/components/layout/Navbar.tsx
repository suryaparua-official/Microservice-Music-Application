import { useNavigate, useLocation } from "react-router-dom";
import { useUserData } from "../../context/user/UserContext";
import { FiChevronLeft, FiChevronRight, FiMenu, FiLogOut, FiLogIn } from "react-icons/fi";

interface NavbarProps {
  onMenuClick?: () => void;
}

const FILTER_PILLS = [
  { label: "All",      path: "/" },
  { label: "Music",    path: "/music" },
  { label: "Podcasts", path: "/podcasts" },
];

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, loading, logoutUser, user } = useUserData();

  return (
    <div className="flex flex-col gap-3">
      {/* ── Top bar ───────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Left: hamburger (mobile) + history nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center
                       rounded-full bg-surface hover:bg-elevated
                       transition-colors duration-150 text-dim hover:text-white mr-1"
            aria-label="Open menu"
          >
            <FiMenu size={16} />
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-black/50 hover:bg-elevated text-dim hover:text-white
                       transition-colors duration-150"
            aria-label="Go back"
          >
            <FiChevronLeft size={18} />
          </button>

          <button
            onClick={() => navigate(+1)}
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-black/50 hover:bg-elevated text-dim hover:text-white
                       transition-colors duration-150"
            aria-label="Go forward"
          >
            <FiChevronRight size={18} />
          </button>
        </div>

        {/* Right: auth actions */}
        {!loading && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/premium")}
              className="hidden md:block px-4 py-1.5 text-xs font-semibold
                         text-white border border-divider rounded-full
                         hover:border-white transition-colors duration-150"
            >
              Explore Premium
            </button>

            {isAuth ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5
                                bg-surface rounded-full border border-divider">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-black text-[10px] font-bold shrink-0">
                    {user?.username?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-xs font-medium text-white max-w-[100px] truncate">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={logoutUser}
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             bg-surface hover:bg-elevated text-dim hover:text-white
                             transition-colors duration-150 border border-divider"
                  aria-label="Log out"
                >
                  <FiLogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold
                           bg-white text-black rounded-full
                           hover:scale-[1.02] transition-transform duration-150"
              >
                <FiLogIn size={13} />
                Log in
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Filter pills ──────────────────────────── */}
      <div className="flex items-center gap-2">
        {FILTER_PILLS.map(({ label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`
                px-3.5 py-1.5 text-xs font-semibold rounded-full
                transition-colors duration-150
                ${active
                  ? "bg-white text-black"
                  : "bg-elevated text-white hover:bg-subtle"}
              `}
            >
              {label}
            </button>
          );
        })}

        {/* Playlist shortcut — mobile only */}
        <button
          onClick={() => navigate("/playlist")}
          className="md:hidden px-3.5 py-1.5 text-xs font-semibold bg-elevated
                     text-white rounded-full hover:bg-subtle transition-colors duration-150"
        >
          Playlist
        </button>
      </div>
    </div>
  );
};

export default Navbar;
