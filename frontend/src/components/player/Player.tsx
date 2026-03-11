import { useEffect, useRef, useState } from "react";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { useSongData } from "../../context/song/SongContext";
import { FaPause, FaPlay, FaVolumeUp } from "react-icons/fa";

const Player = () => {
  const {
    song,
    fetchSingleSongs,
    selectedSong,
    isPlaying,
    setIsPlaying,
    prevSong,
    nextSong,
  } = useSongData();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  /* ===== audio events ===== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  useEffect(() => {
    fetchSingleSongs();
  }, [selectedSong, fetchSingleSongs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && song?.audio) audio.play().catch(() => {});
    else audio.pause();
  }, [song, isPlaying]);

  return (
    <div>
      {song && (
        <div
          className="
            fixed bottom-0 left-0 right-0 z-30
            bg-black border-t border-[#2a2a2a] text-white
            px-3 py-2
            flex items-center gap-3
            sm:static sm:px-4 sm:py-3
          "
        >
          {/* ===== Song Info ===== */}
          <div className="flex items-center gap-2 min-w-0 sm:min-w-[180px]">
            <img
              src={song.thumbnail || "/download.jpg"}
              className="w-9 h-9 sm:w-12 sm:h-12 rounded object-cover"
              alt=""
            />
            <div className="truncate">
              <p className="text-xs sm:text-sm font-semibold truncate">
                {song.title}
              </p>
              <p className="hidden sm:block text-xs text-gray-400 truncate">
                {song.description?.slice(0, 30)}...
              </p>
            </div>
          </div>

          {/* ===== Controls ===== */}
          <div className="flex flex-col items-center gap-1 flex-1">
            {song.audio && <audio ref={audioRef} src={song.audio} />}

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className="text-gray-300 hover:text-white"
                onClick={prevSong}
              >
                <GrChapterPrevious size={16} />
              </button>

              <button
                className="bg-white text-black rounded-full
                           w-8 h-8 sm:w-10 sm:h-10
                           flex items-center justify-center
                           hover:scale-105 transition"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <FaPause size={12} />
                ) : (
                  <FaPlay size={12} />
                )}
              </button>

              <button
                className="text-gray-300 hover:text-white"
                onClick={nextSong}
              >
                <GrChapterNext size={16} />
              </button>
            </div>

            {/* ===== Progress ===== */}
            <div className="flex items-center gap-1 w-full max-w-md text-[10px] sm:text-xs text-gray-400">
              <span>{formatTime(progress)}</span>

              <input
                type="range"
                min="0"
                max="100"
                className="flex-1 accent-blue-500 cursor-pointer"
                value={(progress / duration) * 100 || 0}
                onChange={durationChange}
              />

              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* ===== Volume (desktop only) ===== */}
          <div className="hidden md:flex items-center gap-2 min-w-[120px]">
            <FaVolumeUp className="text-gray-300" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={volumeChange}
              className="accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
