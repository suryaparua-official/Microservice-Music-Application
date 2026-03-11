import Layout from "../../components/layout/Layout";
import SongCard from "../../components/ui/SongCard";
import Loading from "../../components/ui/Loading";
import { useSongData } from "../../context/song/SongContext";

const Music = () => {
  const { songs, loading } = useSongData();

  if (loading) return <Loading />;

  return (
    <Layout>
      <h1 className="my-5 font-bold text-2xl">All Music</h1>

      <div className="flex flex-wrap gap-4">
        {songs.map((e, i) => (
          <SongCard
            key={i}
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
