import { 
  movies, 
  userLikes, 
  type Movie, 
  type InsertMovie, 
  type UserLike, 
  type InsertUserLike 
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private movies: Map<number, Movie>;
  private userLikes: Map<number, UserLike>;
  private movieIdCounter: number;
  private likeIdCounter: number;

  constructor() {
    this.movies = new Map();
    this.userLikes = new Map();
    this.movieIdCounter = 1;
    this.likeIdCounter = 1;
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(
      (movie) => movie.tmdbId === tmdbId
    );
  }

  async saveMovie(movie: InsertMovie): Promise<Movie> {
    const existingMovie = await this.getMovieByTmdbId(movie.tmdbId);
    if (existingMovie) {
      return existingMovie;
    }
    
    const id = this.movieIdCounter++;
    const newMovie: Movie = { 
      ...movie, 
      id,
      posterPath: movie.posterPath || null,
      backdropPath: movie.backdropPath || null,
      releaseDate: movie.releaseDate || null,
      voteAverage: movie.voteAverage || null,
      genres: movie.genres || null
    };
    this.movies.set(id, newMovie);
    return newMovie;
  }

  async saveLike(like: InsertUserLike): Promise<UserLike> {
    const existingLike = await this.getLikeByTmdbIdAndUsername(like.tmdbId, like.username);
    
    if (existingLike) {
      // Update existing like
      const updatedLike: UserLike = { 
        ...existingLike, 
        liked: like.liked !== undefined ? like.liked : true 
      };
      this.userLikes.set(existingLike.id, updatedLike);
      return updatedLike;
    }
    
    // Create new like
    const id = this.likeIdCounter++;
    const newLike: UserLike = { 
      ...like, 
      id, 
      liked: like.liked !== undefined ? like.liked : true 
    };
    this.userLikes.set(id, newLike);
    return newLike;
  }

  async getLikeByTmdbIdAndUsername(tmdbId: number, username: string): Promise<UserLike | undefined> {
    return Array.from(this.userLikes.values()).find(
      (like) => like.tmdbId === tmdbId && like.username === username
    );
  }

  async getLikedMoviesByUsername(username: string): Promise<UserLike[]> {
    return Array.from(this.userLikes.values()).filter(
      (like) => like.username === username && like.liked === true
    );
  }
}

export const storage = new MemStorage();
