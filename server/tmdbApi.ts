import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Create axios instance for TMDB API
const tmdbApiClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US'
  }
});

/**
 * Get a list of genres from TMDB
 */
export async function getGenres() {
  try {
    const response = await tmdbApiClient.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching genres from TMDB:', error);
    throw error;
  }
}

/**
 * Discover movies with optional genre filtering
 */
export async function discoverMovies(page = 1, genreId?: number) {
  try {
    let params: any = {
      page,
      sort_by: 'popularity.desc',
      include_adult: false
    };
    
    if (genreId) {
      params.with_genres = genreId;
    }
    
    const response = await tmdbApiClient.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    console.error('Error discovering movies from TMDB:', error);
    throw error;
  }
}

/**
 * Get details for a specific movie
 */
export async function getMovieDetails(movieId: number) {
  try {
    const response = await tmdbApiClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId} from TMDB:`, error);
    throw error;
  }
}