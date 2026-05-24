import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import SongRow from "../../components/ui/SongRow";
import EmptyState from "../../components/ui/EmptyState";
import { RowSkeleton } from "../../components/ui/Skeleton";
import { useSongData, type Song } from "../../context/song/SongContext";
import { useUserData } from "../../context/user/UserContext";
import { FaMusic } from "react-icons/fa";

export const PlayList = () => {
  const {
    songs,
    setIsPlaying,
    setSelectedSong,
    selectedSong,
    isPlaying,
    loading,
  } = useSongData();

  const { user, isAuth, addToPlaylist } = useUserData();
  const navigate = useNavigate();

  const myPlayList: Song[] = useMemo(() => {
    if (!songs || !user?.playlist) return [];
    return songs.filter((song) => user.playlist.includes(String(song.id)));
  }, [songs, user]);

  const handlePlay = (id: string) => {
    if (selectedSong === id) setIsPlaying(!isPlaying);
    else { setSelectedSong(id); setIsPlaying(true); }
  };

  return (
    <Layout>
      {loading && (
        <div className="mt-4 px-4">
          {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div
            className="flex flex-col sm:flex-row gap-5 sm:gap-8
                        items-center sm:items-end
                        p-6 sm:p-8 rounded-xl
                        bg-gradient-to-b from-elevated/60 to-transparent"
          >
            <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-lg shadow-2xl shrink-0
                            bg-elevated flex items-center justify-center">
              <FaMusic size={52} className="text-dim" />
            </div>
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-widest text-dim font-semibold">
                Playlist
              </p>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {user?.username ?? "My Playlist"}
              </h1>
              <p className="text-sm text-dim">Your favourite songs</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-dim mt-1">
                <img src="/logo.png" className="w-4 h-4" alt="" />
                <span className="font-semibold text-white">Music App</span>
                <span>•</span>
                <span>{myPlayList.length} songs</span>
              </div>
            </div>
          </div>

          {myPlayList.length === 0 ? (
            <EmptyState
              icon={<FaMusic size={24} />}
              title="Your playlist is empty"
              description="Find songs you love and save them here to build your personal collection."
              action={{ label: "Browse music", onClick: () => navigate("/") }}
            />
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_1fr_auto]
                              gap-3 sm:gap-4 px-3 sm:px-4 pb-2 mt-4
                              text-[10px] uppercase tracking-wider text-dim font-semibold
                              border-b border-divider">
                <span>#</span>
                <span>Title</span>
                <span className="hidden sm:block">Description</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="mt-1">
                {myPlayList.map((song, index) => (
                  <SongRow
                    key={song.id}
                    index={index}
                    song={song}
                    isActive={selectedSong === song.id}
                    isPlaying={isPlaying}
                    isAuth={isAuth}
                    onPlay={() => handlePlay(song.id)}
                    onSave={() => addToPlaylist(song.id)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};
