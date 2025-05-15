import { 
  movies, 
  userLikes, 
  type Movie, 
  type InsertMovie, 
  type UserLike, 
  type InsertUserLike 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Movie operations
  getMovie(id: number): Promise<Movie | undefined>;
  getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined>;
  saveMovie(movie: InsertMovie): Promise<Movie>;
  
  // User likes operations
  saveLike(like: InsertUserLike): Promise<UserLike>;
  getLikeByTmdbIdAndUsername(tmdbId: number, username: string): Promise<UserLike | undefined>;
  getLikedMoviesByUsername(username: string): Promise<UserLike[]>;
}

export class DatabaseStorage implements IStorage {
  async getMovie(id: number): Promise<Movie | undefined> {
    const result = await db.select().from(movies).where(eq(movies.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined> {
    const result = await db.select().from(movies).where(eq(movies.tmdbId, tmdbId));
    return result.length > 0 ? result[0] : undefined;
  }

  async saveMovie(movie: InsertMovie): Promise<Movie> {
    const existingMovie = await this.getMovieByTmdbId(movie.tmdbId);
    if (existingMovie) {
      return existingMovie;
    }
    
    // Ensure all fields are properly defined to match the schema
    const newMovie = {
      ...movie,
      posterPath: movie.posterPath || null,
      backdropPath: movie.backdropPath || null,
      releaseDate: movie.releaseDate || null,
      voteAverage: movie.voteAverage || null,
      genres: movie.genres || null
    };
    
    const result = await db.insert(movies).values(newMovie).returning();
    return result[0];
  }

  async saveLike(like: InsertUserLike): Promise<UserLike> {
    const existingLike = await this.getLikeByTmdbIdAndUsername(like.tmdbId, like.username);
    
    if (existingLike) {
      // Update existing like
      const updatedLike = {
        ...existingLike,
        liked: like.liked !== undefined ? like.liked : true
      };
      
      const result = await db
        .update(userLikes)
        .set({ liked: updatedLike.liked })
        .where(eq(userLikes.id, existingLike.id))
        .returning();
        
      return result[0];
    }
    
    // Create new like with a default value for liked if not provided
    const newLike = {
      ...like,
      liked: like.liked !== undefined ? like.liked : true
    };
    
    const result = await db.insert(userLikes).values(newLike).returning();
    return result[0];
  }

  async getLikeByTmdbIdAndUsername(tmdbId: number, username: string): Promise<UserLike | undefined> {
    const result = await db
      .select()
      .from(userLikes)
      .where(
        and(
          eq(userLikes.tmdbId, tmdbId),
          eq(userLikes.username, username)
        )
      );
      
    return result.length > 0 ? result[0] : undefined;
  }

  async getLikedMoviesByUsername(username: string): Promise<UserLike[]> {
    return db
      .select()
      .from(userLikes)
      .where(
        and(
          eq(userLikes.username, username),
          eq(userLikes.liked, true)
        )
      );
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
