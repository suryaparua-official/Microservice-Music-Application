import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { AlbumHeaderSkeleton, RowSkeleton } from "../../components/ui/Skeleton";
import SongRow from "../../components/ui/SongRow";
import { useSongData } from "../../context/song/SongContext";
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
    if (params.id) fetchAlbumsongs(params.id);
  }, [params.id, fetchAlbumsongs]);

  const handlePlay = (id: string) => {
    if (selectedSong === id) setIsPlaying(!isPlaying);
    else { setSelectedSong(id); setIsPlaying(true); }
  };

  return (
    <Layout>
      {loading && (
        <>
          <AlbumHeaderSkeleton />
          <div className="mt-4 px-4">
            {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
          </div>
        </>
      )}

      {!loading && albumData && (
        <>
          {/* Header */}
          <div
            className="flex flex-col sm:flex-row gap-5 sm:gap-8
                        items-center sm:items-end
                        p-6 sm:p-8 rounded-xl
                        bg-gradient-to-b from-elevated/60 to-transparent"
          >
            <img
              src={albumData.thumbnail}
              alt=""
              className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-lg shadow-2xl shrink-0"
            />
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-widest text-dim font-semibold">
                Playlist
              </p>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {albumData.title}
              </h1>
              <p className="text-sm text-dim max-w-xl">{albumData.description}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-dim mt-1">
                <img src="/logo.png" className="w-4 h-4" alt="" />
                <span className="font-semibold text-white">Music App</span>
                <span>•</span>
                <span>{albumSong.length} songs</span>
              </div>
            </div>
          </div>

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

          {/* Song rows */}
          <div className="mt-1">
            {albumSong.map((song, index) => (
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
    </Layout>
  );
};
