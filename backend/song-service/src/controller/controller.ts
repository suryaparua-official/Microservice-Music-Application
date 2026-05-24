import { sql } from "../config/db.js";
import { redisClient } from "../config/redis.js";
import TryCatch from "../utils/TryCatch.js";

const CACHE_TTL = 1800;

export const getAllAlbum = TryCatch(async (_req, res) => {
  if (redisClient.isReady) {
    const cached = await redisClient.get("albums");
    if (cached) return res.json(JSON.parse(cached));
  }

  const albums = await sql`SELECT * FROM albums ORDER BY created_at DESC`;

  if (albums.length === 0) {
    return res.status(404).json({ message: "No albums found" });
  }

  if (redisClient.isReady) {
    await redisClient.setEx("albums", CACHE_TTL, JSON.stringify(albums));
  }

  res.json(albums);
});

export const getAllSongs = TryCatch(async (_req, res) => {
  if (redisClient.isReady) {
    const cached = await redisClient.get("songs");
    if (cached) return res.json(JSON.parse(cached));
  }

  const songs = await sql`SELECT * FROM songs ORDER BY created_at DESC`;

  if (songs.length === 0) {
    return res.status(404).json({ message: "No songs found" });
  }

  if (redisClient.isReady) {
    await redisClient.setEx("songs", CACHE_TTL, JSON.stringify(songs));
  }

  res.json(songs);
});

export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing id" });

  const cacheKey = `album:${id}:songs`;

  if (redisClient.isReady) {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  }

  const album = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (album.length === 0) {
    return res.status(404).json({ message: "Album not found" });
  }

  const songs = await sql`SELECT * FROM songs WHERE album_id = ${id} ORDER BY created_at ASC`;

  if (songs.length === 0) {
    return res.status(404).json({ message: "No songs found for this album" });
  }

  const payload = { album: album[0], songs };

  if (redisClient.isReady) {
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(payload));
  }

  res.json(payload);
});

export const getSingleSong = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing id" });

  const cacheKey = `song:${id}`;

  if (redisClient.isReady) {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    return res.status(404).json({ message: "Song not found" });
  }

  if (redisClient.isReady) {
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(song[0]));
  }

  res.json(song[0]);
});
