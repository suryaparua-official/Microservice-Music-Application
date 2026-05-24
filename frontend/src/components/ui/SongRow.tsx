import { FaBookmark, FaPlay, FaPause } from "react-icons/fa";
import NowPlayingBars from "./NowPlayingBars";
import type { Song } from "../../context/song/SongContext";

interface SongRowProps {
  index: number;
  song: Song;
  isActive: boolean;
  isPlaying: boolean;
  isAuth: boolean;
  onPlay: () => void;
  onSave: () => void;
}

const SongRow = ({
  index,
  song,
  isActive,
  isPlaying,
  isAuth,
  onPlay,
  onSave,
}: SongRowProps) => {
  return (
    <div
      className={`
        group grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_1fr_auto]
        items-center gap-3 sm:gap-4
        px-3 sm:px-4 py-2.5 rounded-lg
        transition-colors duration-150 cursor-default
        ${isActive ? "bg-elevated" : "hover:bg-elevated/60"}
      `}
    >
      {/* Index / playing indicator */}
      <div className="flex items-center justify-center w-6">
        {isActive && isPlaying ? (
          <NowPlayingBars />
        ) : (
          <span
            className={`text-sm font-medium tabular-nums
              ${isActive ? "text-accent" : "text-dim group-hover:hidden"}`}
          >
            {index + 1}
          </span>
        )}
        {!isActive && (
          <button
            onClick={onPlay}
            className="hidden group-hover:flex items-center justify-center text-white"
            aria-label="Play"
          >
            <FaPlay size={12} />
          </button>
        )}
        {isActive && !isPlaying && (
          <button
            onClick={onPlay}
            className="text-accent"
            aria-label="Play"
          >
            <FaPlay size={12} />
          </button>
        )}
      </div>

      {/* Thumbnail + title */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song.thumbnail || "/download.jpg"}
          alt=""
          className="w-10 h-10 rounded-md object-cover shrink-0"
        />
        <span
          className={`text-sm font-medium truncate
            ${isActive ? "text-accent" : "text-white"}`}
        >
          {song.title}
        </span>
      </div>

      {/* Description — desktop only */}
      <p className="hidden sm:block text-sm text-dim truncate">
        {song.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 justify-end">
        {isAuth && (
          <button
            onClick={onSave}
            className="text-dim hover:text-white transition-colors duration-150 opacity-0 group-hover:opacity-100"
            aria-label="Save to playlist"
          >
            <FaBookmark size={13} />
          </button>
        )}
        <button
          onClick={onPlay}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full
            transition-all duration-150
            ${isActive
              ? "bg-accent text-black hover:bg-accent-light"
              : "bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100"
            }
          `}
          aria-label={isActive && isPlaying ? "Pause" : "Play"}
        >
          {isActive && isPlaying ? (
            <FaPause size={10} />
          ) : (
            <FaPlay size={10} />
          )}
        </button>
      </div>
    </div>
  );
};

export default SongRow;
