import { useNavigate, useLocation } from "react-router-dom";
import { useUserData } from "../../context/user/UserContext";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, loading, logoutUser } = useUserData();

  const logoutUserHandler = () => logoutUser();

  const pillClass = (path: string) =>
    location.pathname === path
      ? "bg-white text-black"
      : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]";

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="w-full flex items-center justify-between font-semibold gap-2">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={() => onMenuClick?.()}
            className="lg:hidden w-8 h-8 flex items-center justify-center
                       bg-black rounded-full hover:bg-[#1a1a1a]"
          >
            ☰
          </button>

          {/* App Name */}
          <h1 className="text-white font-bold text-sm sm:text-base ml-1">
            Music App
          </h1>

          <img
            src="/left_arrow.png"
            onClick={() => navigate(-1)}
            alt=""
            className="w-7 h-7 sm:w-8 sm:h-8 p-1 bg-black rounded-full cursor-pointer
                       hover:bg-[#1a1a1a] transition-colors"
          />
          <img
            src="/right_arrow.png"
            onClick={() => navigate(+1)}
            alt=""
            className="w-7 h-7 sm:w-8 sm:h-8 p-1 bg-black rounded-full cursor-pointer
                       hover:bg-[#1a1a1a] transition-colors"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <p
            onClick={() => navigate("/premium")}
            className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm cursor-pointer bg-white text-black
                       rounded-full hidden md:block hover:scale-[1.03] transition"
          >
            Explore Premium
          </p>

          <p
            onClick={() => navigate("/install")}
            className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm cursor-pointer bg-white text-black
                       rounded-full hidden md:block hover:scale-[1.03] transition"
          >
            Install App
          </p>

          {!loading &&
            (isAuth ? (
              <p
                onClick={logoutUserHandler}
                className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm cursor-pointer bg-white text-black
                           rounded-full hover:scale-[1.03] transition"
              >
                Logout
              </p>
            ) : (
              <p
                onClick={() => navigate("/login")}
                className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm cursor-pointer bg-white text-black
                           rounded-full hover:scale-[1.03] transition"
              >
                Login
              </p>
            ))}
        </div>
      </div>

      {/* ================= FILTER PILLS ================= */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <p
          onClick={() => navigate("/")}
          className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full cursor-pointer ${pillClass("/")}`}
        >
          All
        </p>

        <p
          onClick={() => navigate("/music")}
          className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full cursor-pointer ${pillClass("/music")}`}
        >
          Music
        </p>

        <p
          onClick={() => navigate("/podcasts")}
          className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full cursor-pointer ${pillClass("/podcasts")}`}
        >
          Podcasts
        </p>

        {/* mobile shortcut */}
        <p
          onClick={() => navigate("/playlist")}
          className="px-3 sm:px-4 py-1 text-xs sm:text-sm bg-[#2a2a2a] text-white rounded-full cursor-pointer md:hidden
                     hover:bg-[#3a3a3a] transition"
        >
          PlayList
        </p>
      </div>
    </>
  );
};

export default Navbar;
