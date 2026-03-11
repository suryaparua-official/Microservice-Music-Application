import Layout from "../../components/layout/Layout";
import SongCard from "../../components/ui/SongCard";
import { useSongData } from "../../context/song/SongContext";

const Search = () => {
  const { songs, searchQuery, setSearchQuery } = useSongData();

  const filteredSongs = songs.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="mt-4 mb-6">
        <div
          className="w-full max-w-2xl
                     bg-[#2a2a2a] rounded-full
                     px-4 py-2 flex items-center"
        >
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {filteredSongs.map((e) => (
          <SongCard
            key={e.id}
            image={e.thumbnail}
            name={e.title}
            desc={e.description}
            id={e.id}
          />
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <p className="text-gray-400 mt-6">No results found</p>
      )}
    </Layout>
  );
};

export default Search;
