import AlbumCard from "../../components/ui/AlbumCard";
import Layout from "../../components/layout/Layout";
import SongCard from "../../components/ui/SongCard";
import Loading from "../../components/ui/Loading";
import { useSongData } from "../../context/song/SongContext";

const Home = () => {
  const { albums, songs, loading } = useSongData();

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="flex overflow-auto">
          {albums?.map((e, i) => (
            <AlbumCard
              key={i}
              image={e.thumbnail}
              name={e.title}
              desc={e.description}
              id={e.id}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-auto">
          {songs?.map((e, i) => (
            <SongCard
              key={i}
              image={e.thumbnail}
              name={e.title}
              desc={e.description}
              id={e.id}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
