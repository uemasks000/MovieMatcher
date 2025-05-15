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
    // For better randomization, use one of several sorting methods
    const sortMethods = [
      'popularity.desc',
      'vote_average.desc',
      'vote_count.desc',
      'primary_release_date.desc',
      'revenue.desc'
    ];
    
    // Randomly choose a sort method
    const randomSort = sortMethods[Math.floor(Math.random() * sortMethods.length)];
    
    // Also add some randomization through different years
    const currentYear = new Date().getFullYear();
    const randomYear = Math.floor(Math.random() * 20) + (currentYear - 30); // Random year between (current-30) and (current-10)
    const randomPage = Math.floor(Math.random() * 5) + 1; // Random page between 1 and 5
    
    let params: any = {
      page: page === 1 ? randomPage : page, // Only randomize first page
      sort_by: randomSort,
      include_adult: false,
      'primary_release_date.gte': `${randomYear}-01-01`,
      'vote_count.gte': 100 // Ensure we get movies with enough votes
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