import React from "react";
import { FaBookmark, FaPlay, FaPause } from "react-icons/fa";
import { useUserData } from "../../context/user/UserContext";
import { useSongData } from "../../context/song/SongContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, id, desc }) => {
  const { addToPlaylist, isAuth } = useUserData();
  const { setSelectedSong, setIsPlaying, isPlaying, selectedSong } =
    useSongData();

  const handlePlayClick = () => {
    if (selectedSong === id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedSong(id);
      setIsPlaying(true);
    }
  };

  const saveToPlayListHandler = () => {
    addToPlaylist(id);
  };

  return (
    <div className="min-w-45 p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-colors duration-200">
      <div className="relative group">
        <img
          src={image || "/download.jpg"}
          className="mr-1 rounded w-40"
          alt=""
        />

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex gap-2">
          {/* PLAY / PAUSE */}
          <button
            onClick={handlePlayClick}
            className="
              absolute bottom-2 right-14
              bg-green-500 text-black p-3 rounded-full
              transition-opacity duration-300

              /* desktop: only on hover */
              opacity-0 group-hover:opacity-100

              /* mobile: always visible */
              sm:opacity-0 sm:group-hover:opacity-100
              opacity-100
            "
          >
            {selectedSong === id && isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          {/* ADD TO PLAYLIST */}
          {isAuth && (
            <button
              onClick={saveToPlayListHandler}
              className="
                absolute bottom-2 right-2
                bg-green-500 text-black p-3 rounded-full
                transition-opacity duration-300

                /* desktop: only on hover */
                opacity-0 group-hover:opacity-100

                /* mobile: always visible */
                sm:opacity-0 sm:group-hover:opacity-100
                opacity-100
              "
            >
              <FaBookmark />
            </button>
          )}
        </div>
      </div>

      <p className="font-bold mt-2 mb-1">{name.slice(0, 15)}...</p>
      <p className="text-slate-200 text-sm">{desc.slice(0, 20)}...</p>
    </div>
  );
};

export default SongCard;
