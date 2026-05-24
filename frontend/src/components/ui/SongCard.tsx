import { FaBookmark, FaPlay, FaPause } from "react-icons/fa";
import { useUserData } from "../../context/user/UserContext";
import { useSongData } from "../../context/song/SongContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard = ({ image, name, desc, id }: SongCardProps) => {
  const { addToPlaylist, isAuth } = useUserData();
  const { setSelectedSong, setIsPlaying, isPlaying, selectedSong } = useSongData();

  const isActive = selectedSong === id;

  const handlePlay = () => {
    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedSong(id);
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`
        group flex flex-col gap-3 p-3 rounded-xl cursor-pointer
        transition-colors duration-200 min-w-[160px] w-[160px]
        ${isActive ? "bg-elevated" : "bg-surface hover:bg-elevated"}
      `}
    >
      <div className="relative w-full aspect-square">
        <img
          src={image || "/download.jpg"}
          alt={name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <div
          className="absolute inset-0 rounded-lg bg-black/40
                     flex items-end justify-between p-2
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-200"
        >
          {isAuth && (
            <button
              onClick={(e) => { e.stopPropagation(); addToPlaylist(id); }}
              className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center
                         text-white hover:bg-black/70 transition-colors"
              aria-label="Save to playlist"
            >
              <FaBookmark size={11} />
            </button>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); handlePlay(); }}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center shadow-lg
              translate-y-2 group-hover:translate-y-0 transition-transform duration-200 ml-auto
              ${isActive ? "bg-accent hover:bg-accent-light" : "bg-accent"}
            `}
            aria-label={isActive && isPlaying ? "Pause" : "Play"}
          >
            {isActive && isPlaying ? (
              <FaPause size={12} className="text-black" />
            ) : (
              <FaPlay size={12} className="text-black ml-0.5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isActive ? "text-accent" : "text-white"}`}>
          {name}
        </p>
        <p className="text-xs text-dim truncate">{desc}</p>
      </div>
    </div>
  );
};

export default SongCard;
