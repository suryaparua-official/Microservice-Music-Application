import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/ui/Loading";
import { useSongData } from "../../context/song/SongContext";
import { FaBookmark, FaPlay, FaPause } from "react-icons/fa";
import { useUserData } from "../../context/user/UserContext";

export const Album = () => {
  const {
    fetchAlbumsongs,
    albumSong,
    albumData,
    setIsPlaying,
    setSelectedSong,
    isPlaying,
    selectedSong,
    loading,
  } = useSongData();

  const { isAuth, addToPlaylist } = useUserData();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params.id) {
      fetchAlbumsongs(params.id);
    }
  }, [params.id, fetchAlbumsongs]);

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

      {!loading && albumData && (
        <>
          {/* ================= HEADER ================= */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6
                          items-center sm:items-end
                          mt-6 sm:mt-8 px-4 sm:px-6 text-center sm:text-left">
            <img
              src={albumData.thumbnail}
              alt=""
              className="w-40 h-40 sm:w-52 sm:h-52
                         object-cover rounded-md shadow-lg"
            />

            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="uppercase text-[10px] sm:text-xs tracking-widest text-gray-300">
                Playlist
              </p>

              <h1 className="text-2xl sm:text-4xl md:text-6xl
                             font-extrabold text-white leading-tight">
                {albumData.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                {albumData.description}
              </p>

              <div className="flex justify-center sm:justify-start
                              items-center gap-2 text-xs sm:text-sm
                              text-gray-300 mt-1 sm:mt-2">
                <img src="/logo.png" className="w-5 h-5 sm:w-6 sm:h-6" alt="" />
                <span className="font-semibold">Music App</span>
                <span>•</span>
                <span>{albumSong.length} songs</span>
              </div>
            </div>
          </div>

          {/* ================= TABLE HEADER ================= */}
          <div className="mt-8 sm:mt-10 px-4 sm:px-6">
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

          {/* ================= SONG LIST ================= */}
          <div className="px-4 sm:px-6">
            {albumSong.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-[40px_1fr_90px]
                           sm:grid-cols-[50px_2fr_2fr_120px]
                           items-center py-2 sm:py-3
                           text-gray-300 text-xs sm:text-sm
                           hover:bg-[#1a1a1a]
                           rounded-md transition"
              >
                <p className="text-gray-400">{index + 1}</p>

                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={song.thumbnail || "/download.jpeg"}
                    alt=""
                    className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded"
                  />
                  <span className="text-white font-medium truncate max-w-35 sm:max-w-none">
                    {song.title}
                  </span>
                </div>

                <p className="hidden sm:block text-gray-400 truncate">
                  {song.description.slice(0, 40)}...
                </p>

                <div className="flex justify-center items-center gap-3 sm:gap-4">
                  {isAuth && (
                    <button
                      className="text-gray-400 hover:text-white transition"
                      onClick={() => addToPlaylist(song.id)}
                      title="Save to playlist"
                    >
                      <FaBookmark size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => handlePlayClick(song.id)}
                    className="w-7 h-7 sm:w-8 sm:h-8
                               flex items-center justify-center
                               bg-white text-black rounded-full
                               hover:scale-105 transition"
                    title="Play / Pause"
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
          </div>
        </>
      )}
    </Layout>
  );
};
