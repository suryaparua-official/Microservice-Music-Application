import { FaMusic } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useUserData } from "../../context/user/UserContext";
import { useNavigate } from "react-router-dom";

const PlayListCard = () => {
  const navigate = useNavigate();
  const { user, isAuth } = useUserData();

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => navigate("/playlist")}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                   hover:bg-elevated transition-colors duration-150 w-full text-left"
      >
        <div className="w-9 h-9 bg-subtle rounded-md flex items-center justify-center shrink-0">
          <FaMusic className="text-dim text-sm" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">My Playlist</p>
          <p className="text-xs text-dim truncate">
            {isAuth && user?.username ? user.username : "Not signed in"}
          </p>
        </div>
      </button>

      {user?.role === "admin" && (
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                     hover:bg-elevated transition-colors duration-150 w-full text-left mt-1"
        >
          <div className="w-9 h-9 bg-accent/10 rounded-md flex items-center justify-center shrink-0">
            <MdAdminPanelSettings className="text-accent text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-accent truncate">Admin Panel</p>
            <p className="text-xs text-dim">Manage content</p>
          </div>
        </button>
      )}
    </div>
  );
};

export default PlayListCard;
