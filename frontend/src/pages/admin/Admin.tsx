import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../../context/user/UserContext";
import {
  useSongData,
  type Song,
  type Album,
} from "../../context/song/SongContext";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const server = import.meta.env.VITE_ADMIN_SERVER_URL ?? "http://localhost:7000";

export const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [albumThumb, setAlbumThumb] = useState<File | null>(null);

  const [songTitle, setSongTitle] = useState("");
  const [songDesc, setSongDesc] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);
  const [albumId, setAlbumId] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);
  const [thumbnailFor, setThumbnailFor] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const addAlbumHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!albumThumb) return;

    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDesc);
    formData.append("file", albumThumb);

    setBtnLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${server}/api/admin/album/new`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message);
      fetchAlbums();
      setAlbumTitle("");
      setAlbumDesc("");
      setAlbumThumb(null);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBtnLoading(false);
    }
  };

  const addSongHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!songFile || !albumId) return;

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDesc);
    formData.append("file", songFile);
    formData.append("album", albumId);

    setBtnLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${server}/api/admin/song/new`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message);
      fetchSongs();
      setSongTitle("");
      setSongDesc("");
      setSongFile(null);
      setAlbumId("");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBtnLoading(false);
    }
  };

  const addThumbnailHandler = async (id: string) => {
    if (!songFile) return;

    const formData = new FormData();
    formData.append("file", songFile);

    setBtnLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${server}/api/admin/song/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message);
      fetchSongs();
      setSongFile(null);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteAlbumHandler = async (id: string) => {
    if (!window.confirm("Delete this album?")) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${server}/api/admin/album/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchAlbums();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete album");
    }
  };

  const deleteSongHandler = async (id: string) => {
    if (!window.confirm("Delete this song?")) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${server}/api/admin/song/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchSongs();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete song");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#121212]
                    text-white px-3 sm:px-6 lg:px-10 pb-28">

      {/* ===== Top ===== */}
      <div className="py-4 mb-8 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/home.png" alt="Home" className="w-7 h-7 group-hover:scale-110 transition" />
          <span className="font-semibold text-sm">Home</span>
        </Link>
      </div>

      {/* ===== Header ===== */}
      <div className="mb-12">
        <p className="uppercase text-xs sm:text-sm tracking-widest text-gray-400">
          Admin Panel
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-2">
          Manage Album & Song
        </h1>
      </div>

      {/* ===== Forms ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">

        {/* Add Album */}
        <section className="bg-[#181818] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a] shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Add Album</h2>

          <form onSubmit={addAlbumHandler} className="flex flex-col gap-4">
            <input className="spotify-input" placeholder="Album title"
              value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required />

            <input className="spotify-input" placeholder="Album description"
              value={albumDesc} onChange={(e) => setAlbumDesc(e.target.value)} required />

            <label className="inline-flex items-center justify-center px-4 py-2
                              rounded-full bg-[#2a2a2a] text-white text-xs sm:text-sm
                              cursor-pointer hover:bg-[#3a3a3a] transition w-fit">
              {albumThumb ? albumThumb.name : "Choose album thumbnail"}
              <input type="file" hidden accept="image/*"
                onChange={(e) => setAlbumThumb(e.target.files?.[0] || null)} />
            </label>

            <button disabled={btnLoading} className="spotify-btn">
              {btnLoading ? "Please wait..." : "Add Album"}
            </button>
          </form>
        </section>

        {/* Add Song */}
        <section className="bg-[#181818] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a] shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Add Song</h2>

          <form onSubmit={addSongHandler} className="flex flex-col gap-4">
            <input className="spotify-input" placeholder="Song title"
              value={songTitle} onChange={(e) => setSongTitle(e.target.value)} required />

            <input className="spotify-input" placeholder="Song description"
              value={songDesc} onChange={(e) => setSongDesc(e.target.value)} required />

            <select className="spotify-input"
              value={albumId} onChange={(e) => setAlbumId(e.target.value)} required>
              <option value="">Choose Album</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>

            <label className="inline-flex items-center justify-center px-4 py-2
                              rounded-full bg-[#2a2a2a] text-white text-xs sm:text-sm
                              cursor-pointer hover:bg-[#3a3a3a] transition w-fit">
              {songFile ? songFile.name : "Choose audio file"}
              <input type="file" hidden accept="audio/*"
                onChange={(e) => setSongFile(e.target.files?.[0] || null)} />
            </label>

            <button disabled={btnLoading} className="spotify-btn">
              {btnLoading ? "Please wait..." : "Add Song"}
            </button>
          </form>
        </section>
      </div>

      {/* ===== Albums ===== */}
      <div className="mb-14">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Added Albums</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((e: Album) => (
            <div key={e.id} className="bg-[#181818] p-3 rounded-xl shadow-md">
              <img src={e.thumbnail}
                className="w-full aspect-square object-cover rounded-lg" alt="" />
              <h4 className="font-bold mt-2 text-sm">{e.title.slice(0, 18)}...</h4>
              <p className="text-xs text-gray-400">
                {e.description.slice(0, 20)}...
              </p>
              <button disabled={btnLoading}
                onClick={() => deleteAlbumHandler(e.id)}
                className="mt-2 p-2 bg-red-600 rounded-full hover:bg-red-700">
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Songs ===== */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Added Songs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {songs.map((e: Song) => (
            <div key={e.id} className="bg-[#181818] p-3 rounded-xl shadow-md">
              {e.thumbnail ? (
                <img src={e.thumbnail}
                  className="w-full aspect-square object-cover rounded-lg" alt="" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <input
                    className="px-3 py-1 rounded-full bg-[#2a2a2a]
                               text-white text-xs cursor-pointer"
                    type="file"
                    onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                      setSongFile(ev.target.files?.[0] || null);
                      setThumbnailFor(e.id);
                    }}
                  />
                  <button
                    className="auth-btn"
                    disabled={btnLoading || thumbnailFor !== e.id}
                    onClick={() => addThumbnailHandler(e.id)}
                  >
                    {btnLoading ? "Uploading..." : "Add Thumbnail"}
                  </button>
                </div>
              )}

              <h4 className="font-bold mt-2 text-sm">{e.title.slice(0, 18)}...</h4>
              <p className="text-xs text-gray-400">
                {e.description.slice(0, 20)}...
              </p>

              <button disabled={btnLoading}
                onClick={() => deleteSongHandler(e.id)}
                className="mt-2 p-2 bg-red-600 rounded-full hover:bg-red-700">
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
