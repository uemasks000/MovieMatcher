-- Create tables for movies and user_likes

CREATE TABLE IF NOT EXISTS "movies" (
  "id" SERIAL PRIMARY KEY,
  "tmdb_id" INTEGER NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "poster_path" TEXT,
  "backdrop_path" TEXT,
  "release_date" TEXT,
  "vote_average" TEXT,
  "genres" TEXT[]
);

CREATE TABLE IF NOT EXISTS "user_likes" (
  "id" SERIAL PRIMARY KEY,
  "tmdb_id" INTEGER NOT NULL,
  "username" TEXT NOT NULL,
  "liked" BOOLEAN NOT NULL DEFAULT true
);

-- Create index on username to speed up queries
CREATE INDEX IF NOT EXISTS "user_likes_username_idx" ON "user_likes" ("username");
-- Create index on tmdbId and username for faster lookups
CREATE INDEX IF NOT EXISTS "user_likes_tmdb_username_idx" ON "user_likes" ("tmdb_id", "username");