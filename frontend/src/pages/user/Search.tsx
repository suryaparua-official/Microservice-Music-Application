import Layout from "../../components/layout/Layout";
import SongCard from "../../components/ui/SongCard";
import EmptyState from "../../components/ui/EmptyState";
import { useSongData } from "../../context/song/SongContext";
import { FiSearch } from "react-icons/fi";
import { FaMusic } from "react-icons/fa";

const Search = () => {
  const { songs, searchQuery, setSearchQuery } = useSongData();

  const filteredSongs = songs.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Search bar */}
      <div className="mt-2 mb-6">
        <div className="relative w-full max-w-xl">
          <FiSearch
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none"
          />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-elevated text-white text-sm
                       pl-10 pr-4 py-2.5 rounded-full
                       border border-divider
                       focus:outline-none focus:ring-2 focus:ring-accent
                       placeholder:text-muted transition-colors duration-150"
          />
        </div>
      </div>

      {/* Results */}
      {filteredSongs.length > 0 ? (
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
      ) : (
        <EmptyState
          icon={<FaMusic size={24} />}
          title={searchQuery ? "No results found" : "Start searching"}
          description={
            searchQuery
              ? `No songs match "${searchQuery}". Try a different search term.`
              : "Type a song name above to find music."
          }
        />
      )}
    </Layout>
  );
};

export default Search;
