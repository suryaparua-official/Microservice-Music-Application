import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { useSongData } from "../../context/song/SongContext";

const formatTime = (t: number) => {
  if (!t || isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

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
  const [volume, setVolume]     = useState(1);
  const [muted, setMuted]       = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const progressPct = duration ? (progress / duration) * 100 : 0;

  /* ── Audio events ─────────────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onMeta  = () => setDuration(audio.duration || 0);
    const onTime  = () => setProgress(audio.currentTime || 0);
    const onEnded = () => { nextSong(); };
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [song, nextSong]);

  useEffect(() => {
    fetchSingleSongs();
  }, [selectedSong, fetchSingleSongs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && song?.audio) audio.play().catch(() => {});
    else audio.pause();
  }, [song, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;
    const t = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = t;
    setProgress(t);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.volume = next ? 0 : volume;
  };

  if (!song) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50
                 bg-[#0a0a0a] border-t border-divider
                 px-4 py-3 flex items-center gap-4"
      style={{ height: "80px" }}
    >
      {song.audio && <audio ref={audioRef} src={song.audio} />}

      {/* ── Song info ─────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0 w-[200px] shrink-0">
        <img
          src={song.thumbnail || "/download.jpg"}
          alt=""
          className="w-11 h-11 rounded-md object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{song.title}</p>
          <p className="text-xs text-dim truncate">{song.description}</p>
        </div>
      </div>

      {/* ── Controls + progress ────────────────────── */}
      <div className="flex-1 flex flex-col items-center gap-1.5 max-w-xl mx-auto">
        <div className="flex items-center gap-5">
          <button
            onClick={prevSong}
            className="text-dim hover:text-white transition-colors duration-150"
            aria-label="Previous"
          >
            <IoPlaySkipBack size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-white text-black hover:scale-105 transition-transform duration-150"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={13} /> : <FaPlay size={13} className="ml-0.5" />}
          </button>

          <button
            onClick={nextSong}
            className="text-dim hover:text-white transition-colors duration-150"
            aria-label="Next"
          >
            <IoPlaySkipForward size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full text-[10px] text-dim">
          <span className="w-8 text-right tabular-nums">{formatTime(progress)}</span>
          <div className="relative flex-1 h-4 flex items-center group">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPct}
              onChange={onSeek}
              className="w-full"
              style={{
                background: `linear-gradient(to right, #1db954 ${progressPct}%, #3a3a3a ${progressPct}%)`,
              }}
              aria-label="Seek"
            />
          </div>
          <span className="w-8 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* ── Volume ─────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2 w-[120px] justify-end shrink-0">
        <button
          onClick={toggleMute}
          className="text-dim hover:text-white transition-colors duration-150"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted || volume === 0 ? <HiVolumeOff size={17} /> : <HiVolumeUp size={17} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={onVolume}
          className="w-20"
          style={{
            background: `linear-gradient(to right, #ffffff ${(muted ? 0 : volume) * 100}%, #3a3a3a ${(muted ? 0 : volume) * 100}%)`,
          }}
          aria-label="Volume"
        />
      </div>
    </div>
  );
};

export default Player;
