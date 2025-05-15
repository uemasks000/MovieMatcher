import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Defining the movies table schema
export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  releaseDate: text("release_date"),
  voteAverage: text("vote_average"),
  genres: text("genres").array(),
});

// Defining the user likes table schema
export const userLikes = pgTable("user_likes", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull(),
  username: text("username").notNull(),
  liked: boolean("liked").notNull().default(true),
});

// Creating insert schemas
export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
});

export const insertUserLikeSchema = createInsertSchema(userLikes).omit({
  id: true,
});

// Types for Drizzle ORM
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export type InsertUserLike = z.infer<typeof insertUserLikeSchema>;
export type UserLike = typeof userLikes.$inferSelect;

// Types for TMDB API
export const genreIdSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().optional(),
  vote_average: z.number(),
  genre_ids: z.array(z.number()).optional(),
  genres: z.array(genreIdSchema).optional(),
});

export type TmdbMovie = z.infer<typeof movieSchema>;
export type Genre = z.infer<typeof genreIdSchema>;
