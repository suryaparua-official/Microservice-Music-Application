import type { Request, Response } from "express";
import TryCatch from "../utils/TryCatch.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../config/db.js";
import { cloudinary } from "../config/cloudinary.js";
import { redisClient } from "../config/redis.js";
import type { AuthRequest } from "../middleware/middleware.js";

// ── Cache helpers ─────────────────────────────────────────────────────────────

async function invalidate(...keys: string[]): Promise<void> {
  if (!redisClient.isReady) return;
  await Promise.all(keys.map((k) => redisClient.del(k)));
}

// ── Handlers ──────────────────────────────────────────────────────────────────

export const addAlbum = TryCatch(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { title, description } = req.body as {
    title: string;
    description: string;
  };
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer?.content) {
    res.status(500).json({ message: "Failed to process file" });
    return;
  }

  const upload = await cloudinary.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });

  const result = await sql`
    INSERT INTO albums (title, description, thumbnail)
    VALUES (${title}, ${description}, ${upload.secure_url})
    RETURNING *
  `;

  await invalidate("albums");

  res.json({ message: "Album created", album: result[0] });
});

export const addSong = TryCatch(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { title, description, album } = req.body as {
    title: string;
    description: string;
    album: string;
  };

  const albumRows = await sql`SELECT id FROM albums WHERE id = ${album}`;
  if (albumRows.length === 0) {
    res.status(404).json({ message: "Album not found" });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer?.content) {
    res.status(500).json({ message: "Failed to process file" });
    return;
  }

  const upload = await cloudinary.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });

  const result = await sql`
    INSERT INTO songs (title, description, audio, album_id)
    VALUES (${title}, ${description}, ${upload.secure_url}, ${album})
    RETURNING *
  `;

  await invalidate("songs", `album:${album}:songs`);

  res.json({ message: "Song added", song: result[0] });
});

export const addThumbnail = TryCatch(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { id: songId } = req.params;
  if (!songId) {
    res.status(400).json({ message: "Missing song id" });
    return;
  }

  const song = await sql`SELECT id, album_id FROM songs WHERE id = ${songId}`;
  if (song.length === 0) {
    res.status(404).json({ message: "Song not found" });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer?.content) {
    res.status(500).json({ message: "Failed to process file" });
    return;
  }

  const upload = await cloudinary.uploader.upload(fileBuffer.content, {
    folder: "thumbnails",
  });

  const result = await sql`
    UPDATE songs SET thumbnail = ${upload.secure_url}
    WHERE id = ${songId}
    RETURNING *
  `;

  const albumId = song[0]?.album_id as string | null;
  const cacheKeys = ["songs", `song:${songId}`];
  if (albumId) cacheKeys.push(`album:${albumId}:songs`);
  await invalidate(...cacheKeys);

  res.json({ message: "Thumbnail added", song: result[0] });
});

export const deleteAlbum = TryCatch(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Missing album id" });
    return;
  }

  const album = await sql`SELECT id FROM albums WHERE id = ${id}`;
  if (album.length === 0) {
    res.status(404).json({ message: "Album not found" });
    return;
  }

  // Collect song IDs before deletion so we can invalidate per-record cache keys
  const songs = await sql`SELECT id FROM songs WHERE album_id = ${id}`;
  const songIds = songs.map((s) => String(s.id));

  // Delete songs and album atomically
  await sql.begin(async (tx) => {
    await tx`DELETE FROM songs WHERE album_id = ${id}`;
    await tx`DELETE FROM albums WHERE id = ${id}`;
  });

  const cacheKeys = ["albums", "songs", `album:${id}:songs`];
  for (const songId of songIds) cacheKeys.push(`song:${songId}`);
  await invalidate(...cacheKeys);

  res.json({ message: "Album deleted" });
});

export const deleteSong = TryCatch(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Missing song id" });
    return;
  }

  const song = await sql`SELECT id, album_id FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    res.status(404).json({ message: "Song not found" });
    return;
  }

  await sql`DELETE FROM songs WHERE id = ${id}`;

  const albumId = song[0]?.album_id as string | null;
  const cacheKeys = ["songs", `song:${id}`];
  if (albumId) cacheKeys.push(`album:${albumId}:songs`);
  await invalidate(...cacheKeys);

  res.json({ message: "Song deleted" });
});
