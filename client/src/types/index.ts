// Additional TypeScript types for the application

/**
 * Direction type for swipes
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Movie card ref type
 */
export interface CardRef {
  swipe: (dir: SwipeDirection) => void;
}

/**
 * Movie detail from TMDB API
 */
export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  adult: boolean;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

/**
 * State of the current swiping action
 */
export interface SwipeState {
  direction: SwipeDirection | null;
  movie: number | null;
  swiping: boolean;
}

/**
 * Theme modes
 */
export type ThemeMode = 'dark' | 'light' | 'system';
