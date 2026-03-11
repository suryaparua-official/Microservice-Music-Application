import { sql } from "../config/db.js";
import { redisClient } from "../config/redis.js";
import TryCatch from "../utils/TryCatch.js";

export const getAllAlbum = TryCatch(async (req, res) => {
  const CACHE_EXPIRY = 1800;

  // 1. Cache check first
  if (redisClient.isReady) {
    const cachedAlbums = await redisClient.get("albums");

    if (cachedAlbums) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedAlbums));
    }
  }

  // 2. DB query
  const albums = await sql`SELECT * FROM albums`;

  if (albums.length === 0) {
    return res.status(404).json({
      message: "No albums found",
    });
  }

  // 3. Save to cache
  if (redisClient.isReady) {
    await redisClient.setEx("albums", CACHE_EXPIRY, JSON.stringify(albums));
  }

  res.json(albums);
});

export const getAllSongs = TryCatch(async (req, res) => {
  const CACHE_KEY = "songs";
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    const cache = await redisClient.get(CACHE_KEY);
    if (cache) {
      console.log("Cache hit");
      return res.json(JSON.parse(cache));
    }
  }

  const songs = await sql`SELECT * FROM songs`;

  if (songs.length === 0) {
    return res.status(404).json({ message: "No songs found" });
  }

  if (redisClient.isReady) {
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRY, JSON.stringify(songs));
  }

  res.json(songs);
});

export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
  const { id } = req.params;
  const CACHE_KEY = `album:${id}:songs`;
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    const cache = await redisClient.get(CACHE_KEY);
    if (cache) {
      console.log("Cache hit");
      return res.json(JSON.parse(cache));
    }
  }

  const album = await sql`SELECT * FROM albums WHERE id = ${id}`;

  if (album.length === 0) {
    return res.status(404).json({ message: "No album with this id" });
  }

  const songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;

  if (songs.length === 0) {
    return res.status(404).json({ message: "No songs found for this album" });
  }

  const response = { album: album[0], songs };

  if (redisClient.isReady) {
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRY, JSON.stringify(response));
  }

  res.json(response);
});

export const getSingleSong = TryCatch(async (req, res) => {
  const { id } = req.params;
  const CACHE_KEY = `song:${id}`;
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    const cache = await redisClient.get(CACHE_KEY);
    if (cache) {
      console.log("Cache hit");
      return res.json(JSON.parse(cache));
    }
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

  if (song.length === 0) {
    return res.status(404).json({ message: "No song found with this id" });
  }

  if (redisClient.isReady) {
    await redisClient.setEx(CACHE_KEY, CACHE_EXPIRY, JSON.stringify(song[0]));
  }

  res.json(song[0]);
});
