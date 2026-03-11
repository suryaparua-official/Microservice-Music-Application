import { useMemo } from "react";
import Layout from "../../components/layout/Layout";
import { useSongData } from "../../context/song/SongContext";
import { useUserData } from "../../context/user/UserContext";
import { FaBookmark, FaPlay, FaPause } from "react-icons/fa";
import Loading from "../../components/ui/Loading";
import type { Song } from "../../context/song/SongContext";

export const PlayList = () => {
  const {
    songs,
    setIsPlaying,
    setSelectedSong,
    selectedSong,
    isPlaying,
    loading,
  } = useSongData();

  const { user, addToPlaylist } = useUserData();

  const myPlayList: Song[] = useMemo(() => {
    if (!songs || !user?.playlist) return [];
    return songs.filter((song) =>
      user.playlist.includes(String(song.id))
    );
  }, [songs, user]);

  const handlePlayClick = (id: string) => {
    if (selectedSong === id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedSong(id);
      setIsPlaying(true);
    }
  };

  return (
    <Layout>
      {loading && <Loading />}

      {!loading && (
        <>
          {/* ================= Header ================= */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-end mt-6 px-4 sm:px-6">
            <img
              src="/download.jpg"
              alt=""
              className="w-32 h-32 sm:w-52 sm:h-52 object-cover rounded-md shadow-lg"
            />

            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="uppercase text-[10px] sm:text-xs tracking-widest text-gray-300">
                Playlist
              </p>

              <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white">
                {user?.username || "My Playlist"}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Your favourite songs
              </p>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">
                <img src="/logo.png" className="w-5 h-5 sm:w-6 sm:h-6" alt="" />
                <span className="font-semibold">Music App</span>
                <span>•</span>
                <span>{myPlayList.length} songs</span>
              </div>
            </div>
          </div>

          {/* ================= Table Header ================= */}
          <div className="mt-6 sm:mt-10 px-4 sm:px-6">
            <div
              className="grid grid-cols-[40px_1fr_90px]
                         sm:grid-cols-[50px_2fr_2fr_120px]
                         text-[10px] sm:text-xs uppercase tracking-wider
                         text-gray-400 border-b border-[#2a2a2a] pb-2 sm:pb-3"
            >
              <p>#</p>
              <p>Title</p>
              <p className="hidden sm:block">Description</p>
              <p className="text-center">Actions</p>
            </div>
          </div>

          {/* ================= Songs List ================= */}
          <div className="px-4 sm:px-6">
            {myPlayList.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-[40px_1fr_90px]
                           sm:grid-cols-[50px_2fr_2fr_120px]
                           items-center py-2 sm:py-3
                           text-gray-300 text-xs sm:text-sm
                           hover:bg-[#1a1a1a]
                           rounded-md transition"
              >
                {/* index */}
                <p className="text-gray-400">{index + 1}</p>

                {/* title */}
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <img
                    src={song.thumbnail || "/download.jpeg"}
                    alt=""
                    className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                  />
                  <span className="text-white font-medium truncate">
                    {song.title}
                  </span>
                </div>

                {/* description */}
                <p className="hidden sm:block text-gray-400 truncate">
                  {song.description.slice(0, 40)}...
                </p>

                {/* actions */}
                <div className="flex justify-center items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => addToPlaylist(song.id)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FaBookmark size={14} />
                  </button>

                  <button
                    onClick={() => handlePlayClick(song.id)}
                    className="w-7 h-7 sm:w-8 sm:h-8
                               bg-white text-black rounded-full
                               flex items-center justify-center"
                  >
                    {selectedSong === song.id && isPlaying ? (
                      <FaPause size={11} />
                    ) : (
                      <FaPlay size={11} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {myPlayList.length === 0 && (
              <p className="text-center text-gray-400 mt-8 sm:mt-10 text-sm">
                Your playlist is empty 🎵
              </p>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};
