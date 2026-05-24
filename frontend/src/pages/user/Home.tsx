import AlbumCard from "../../components/ui/AlbumCard";
import Layout from "../../components/layout/Layout";
import SongCard from "../../components/ui/SongCard";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { useSongData } from "../../context/song/SongContext";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-baseline justify-between mb-4">
    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
  </div>
);

const CardRow = ({ count = 6 }: { count?: number }) => (
  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="min-w-[160px] w-[160px]">
        <CardSkeleton />
      </div>
    ))}
  </div>
);

const Home = () => {
  const { albums, songs, loading } = useSongData();

  return (
    <Layout>
      <section className="mb-8">
        <SectionHeader title="Featured Charts" />
        {loading ? (
          <CardRow />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {albums?.map((e) => (
              <AlbumCard
                key={e.id}
                image={e.thumbnail}
                name={e.title}
                desc={e.description}
                id={e.id}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <SectionHeader title="Today's Biggest Hits" />
        {loading ? (
          <CardRow />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {songs?.map((e) => (
              <SongCard
                key={e.id}
                image={e.thumbnail}
                name={e.title}
                desc={e.description}
                id={e.id}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
