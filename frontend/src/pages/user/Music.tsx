import Layout from "../../components/layout/Layout";
import SongCard from "../../components/ui/SongCard";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { useSongData } from "../../context/song/SongContext";

const Music = () => {
  const { songs, loading } = useSongData();

  return (
    <Layout>
      <h2 className="text-xl font-bold text-white tracking-tight mb-4 mt-1">All Music</h2>

      <div className="flex flex-wrap gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[160px]">
                <CardSkeleton />
              </div>
            ))
          : songs.map((e) => (
              <SongCard
                key={e.id}
                image={e.thumbnail}
                name={e.title}
                desc={e.description}
                id={e.id}
              />
            ))}
      </div>
    </Layout>
  );
};

export default Music;
