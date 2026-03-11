import { FaMusic } from "react-icons/fa";
import { useUserData } from "../../context/user/UserContext";
import { useNavigate } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";

const PlayListCard = () => {
  const navigate = useNavigate();
  const { user, isAuth } = useUserData();

  return (
    <div className="flex flex-col rounded-md transition-colors duration-200">
      
      <div
        className="flex items-center gap-4 px-3 py-2 cursor-pointer
                   hover:bg-[#1a1a1a]"
        onClick={() => navigate("/playlist")}
      >
        <div className="w-10 h-10 bg-[#2a2a2a] flex items-center justify-center rounded-md">
          <FaMusic className="text-gray-200 text-lg" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-gray-200">
            My Playlist
          </h2>
          <p className="text-xs text-gray-400">
            Playlist •{" "}
            <span>{isAuth && user?.username ? user.username : "User"}</span>
          </p>
        </div>
      </div>


      <div className="mx-3 mb-3 mt-2 p-4 bg-[#181818] rounded-lg flex flex-col gap-2">
        <h1 className="text-sm font-semibold text-white">
          Let’s find some podcasts to follow
        </h1>

        <p className="text-xs text-gray-400">
          We’ll keep you updated on new episodes
        </p>

        <button className="mt-3 px-4 py-1.5 bg-white text-black text-sm font-semibold rounded-full w-fit">
          Browse Podcasts
        </button>
      </div>

      {user?.role === "admin" && (
        <div className="px-3 pb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/admin/dashboard");
            }}
            className="flex items-center gap-2 px-4 py-2
                       bg-[#1DB954] text-black text-sm font-semibold
                       rounded-full hover:scale-[1.03] transition"
          >
            <MdAdminPanelSettings size={18} />
            Admin Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayListCard;
