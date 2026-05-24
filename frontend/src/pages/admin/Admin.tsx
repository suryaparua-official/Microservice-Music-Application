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
import { FiChevronLeft, FiImage, FiMusic, FiUpload } from "react-icons/fi";

const server = import.meta.env.VITE_ADMIN_SERVER_URL ?? "http://localhost:7000";

const FileButton = ({
  label,
  accept,
  onChange,
}: {
  label: string;
  accept: string;
  onChange: (f: File | null) => void;
}) => (
  <label
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
               bg-elevated border border-divider text-white text-sm
               cursor-pointer hover:bg-subtle transition-colors duration-150 w-full"
  >
    <FiUpload size={14} className="text-dim shrink-0" />
    <span className="truncate text-dim">{label}</span>
    <input
      type="file"
      hidden
      accept={accept}
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
    />
  </label>
);

export const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDesc, setAlbumDesc]   = useState("");
  const [albumThumb, setAlbumThumb] = useState<File | null>(null);

  const [songTitle, setSongTitle] = useState("");
  const [songDesc, setSongDesc]   = useState("");
  const [songFile, setSongFile]   = useState<File | null>(null);
  const [albumId, setAlbumId]     = useState("");

  const [btnLoading, setBtnLoading]   = useState(false);
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
      const { data } = await axios.post(`${server}/api/admin/album/new`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchAlbums();
      setAlbumTitle(""); setAlbumDesc(""); setAlbumThumb(null);
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
      const { data } = await axios.post(`${server}/api/admin/song/new`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchSongs();
      setSongTitle(""); setSongDesc(""); setSongFile(null); setAlbumId("");
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
      const { data } = await axios.post(`${server}/api/admin/song/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchSongs();
      setSongFile(null); setThumbnailFor(null);
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
    } catch (error) {
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
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete song");
    }
  };

  const inputCls = `w-full bg-elevated text-white text-sm px-3.5 py-2.5 rounded-lg
    border border-divider focus:outline-none focus:ring-2 focus:ring-accent
    placeholder:text-muted transition-colors duration-150`;

  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 sm:px-6 lg:px-10 pb-28">
      {/* Top bar */}
      <div className="py-5 mb-2 flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-dim hover:text-white transition-colors duration-150 text-sm"
        >
          <FiChevronLeft size={16} />
          Back to home
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold">Manage Content</h1>
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        {/* Add Album */}
        <section className="bg-surface rounded-2xl border border-divider p-5 sm:p-6">
          <h2 className="text-base font-bold mb-5 flex items-center gap-2">
            <FiImage size={16} className="text-accent" />
            Add Album
          </h2>
          <form onSubmit={addAlbumHandler} className="flex flex-col gap-3">
            <input
              className={inputCls}
              placeholder="Album title"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="Album description"
              value={albumDesc}
              onChange={(e) => setAlbumDesc(e.target.value)}
              required
            />
            <FileButton
              label={albumThumb ? albumThumb.name : "Choose album thumbnail"}
              accept="image/*"
              onChange={setAlbumThumb}
            />
            <button
              type="submit"
              disabled={btnLoading}
              className="mt-1 w-full bg-accent hover:bg-accent-light text-black font-semibold
                         py-2.5 rounded-full transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoading ? "Please wait…" : "Add Album"}
            </button>
          </form>
        </section>

        {/* Add Song */}
        <section className="bg-surface rounded-2xl border border-divider p-5 sm:p-6">
          <h2 className="text-base font-bold mb-5 flex items-center gap-2">
            <FiMusic size={16} className="text-accent" />
            Add Song
          </h2>
          <form onSubmit={addSongHandler} className="flex flex-col gap-3">
            <input
              className={inputCls}
              placeholder="Song title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="Song description"
              value={songDesc}
              onChange={(e) => setSongDesc(e.target.value)}
              required
            />
            <select
              className={selectCls}
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              required
            >
              <option value="">Choose album</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <FileButton
              label={songFile ? songFile.name : "Choose audio file"}
              accept="audio/*"
              onChange={setSongFile}
            />
            <button
              type="submit"
              disabled={btnLoading}
              className="mt-1 w-full bg-accent hover:bg-accent-light text-black font-semibold
                         py-2.5 rounded-full transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoading ? "Please wait…" : "Add Song"}
            </button>
          </form>
        </section>
      </div>

      {/* Albums list */}
      <div className="mb-12">
        <h3 className="text-base font-bold mb-4 text-dim uppercase tracking-wider text-xs">
          Albums ({albums.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {albums.map((e: Album) => (
            <div key={e.id} className="bg-surface rounded-xl border border-divider p-3 flex flex-col gap-2">
              <img
                src={e.thumbnail}
                className="w-full aspect-square object-cover rounded-lg"
                alt=""
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{e.title}</p>
                <p className="text-xs text-dim truncate">{e.description}</p>
              </div>
              <button
                disabled={btnLoading}
                onClick={() => deleteAlbumHandler(e.id)}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs
                           bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg
                           border border-red-600/20 transition-colors duration-150
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdDelete size={14} />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Songs list */}
      <div>
        <h3 className="text-base font-bold mb-4 text-dim uppercase tracking-wider text-xs">
          Songs ({songs.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.map((e: Song) => (
            <div key={e.id} className="bg-surface rounded-xl border border-divider p-3 flex flex-col gap-2">
              {e.thumbnail ? (
                <img
                  src={e.thumbnail}
                  className="w-full aspect-square object-cover rounded-lg"
                  alt=""
                />
              ) : (
                <div className="w-full aspect-square rounded-lg bg-elevated flex flex-col
                                items-center justify-center gap-2 p-3">
                  <p className="text-[10px] text-dim text-center">No thumbnail</p>
                  <label
                    className="text-[10px] px-2.5 py-1.5 rounded-md bg-surface border border-divider
                               text-white cursor-pointer hover:bg-elevated transition-colors duration-150"
                  >
                    Choose image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                        setSongFile(ev.target.files?.[0] ?? null);
                        setThumbnailFor(e.id);
                      }}
                    />
                  </label>
                  {thumbnailFor === e.id && songFile && (
                    <button
                      disabled={btnLoading}
                      onClick={() => addThumbnailHandler(e.id)}
                      className="text-[10px] px-2.5 py-1.5 rounded-md bg-accent text-black
                                 font-semibold disabled:opacity-50 transition-colors duration-150"
                    >
                      {btnLoading ? "Uploading…" : "Upload"}
                    </button>
                  )}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{e.title}</p>
                <p className="text-xs text-dim truncate">{e.description}</p>
              </div>
              <button
                disabled={btnLoading}
                onClick={() => deleteSongHandler(e.id)}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs
                           bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg
                           border border-red-600/20 transition-colors duration-150
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdDelete size={14} />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
