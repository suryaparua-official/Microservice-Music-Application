import { sql } from "../config/db.js";

export async function initDB() {
  try {
    // albums
    await sql`
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      ALTER TABLE albums
      ADD COLUMN IF NOT EXISTS description VARCHAR(255)
    `;

    // songs
    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      ALTER TABLE songs
      ADD COLUMN IF NOT EXISTS description VARCHAR(255)
    `;

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
