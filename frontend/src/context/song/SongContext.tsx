import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

const server = import.meta.env.VITE_API_BASE_URL;

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album_id: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface SongContextType {
  songs: Song[];
  song: Song | null;
  albums: Album[];
  selectedSong: string | null;
  setSelectedSong: (id: string | null) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  loading: boolean;
  fetchSingleSongs: () => Promise<void>;
  nextSong: () => void;
  prevSong: () => void;
  albumSong: Song[];
  albumData: Album | null;
  fetchAlbumsongs: (id: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

/* ── Context ─────────────────────────────────────────────────────────────── */

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [albumSong, setAlbumSong] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album | null>(null);

  /* ── Fetchers ─────────────────────────────────────────────────────────── */

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Song[]>(`${server}/api/songs/song/all`);
      setSongs(data);
      if (data.length > 0) {
        setIndex(0);
        setSelectedSong(data[0].id);
      }
    } catch {
      // API returns 404 when no songs exist — treat as empty list
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Album[]>(`${server}/api/songs/album/all`);
      setAlbums(data);
    } catch {
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleSongs = useCallback(async () => {
    if (!selectedSong) return;
    try {
      const { data } = await axios.get<Song>(
        `${server}/api/songs/song/${selectedSong}`
      );
      setSong(data);
    } catch {
      // Non-fatal — player will show previous song or nothing
    }
  }, [selectedSong]);

  const fetchAlbumsongs = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ songs: Song[]; album: Album }>(
        `${server}/api/songs/album/${id}`
      );
      setAlbumData(data.album);
      setAlbumSong(data.songs);
    } catch {
      setAlbumData(null);
      setAlbumSong([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Navigation ───────────────────────────────────────────────────────── */

  const nextSong = useCallback(() => {
    if (songs.length === 0) return;
    const next = index === songs.length - 1 ? 0 : index + 1;
    setIndex(next);
    setSelectedSong(songs[next].id);
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (songs.length === 0) return;
    const prev = index === 0 ? songs.length - 1 : index - 1;
    setIndex(prev);
    setSelectedSong(songs[prev].id);
  }, [index, songs]);

  /* ── Initial fetch ────────────────────────────────────────────────────── */

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, [fetchSongs, fetchAlbums]);

  return (
    <SongContext.Provider
      value={{
        songs,
        song,
        albums,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        loading,
        fetchSingleSongs,
        nextSong,
        prevSong,
        fetchAlbumsongs,
        albumData,
        albumSong,
        fetchSongs,
        fetchAlbums,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

/* ── Hook ────────────────────────────────────────────────────────────────── */

// eslint-disable-next-line react-refresh/only-export-components
export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongData must be used within a SongProvider");
  }
  return context;
};
