/**
 * Utility functions for working with TMDB API
 */

/**
 * Get the full URL for a TMDB image
 * 
 * @param path The image path from TMDB API
 * @param type The type of image (poster or backdrop)
 * @returns The full URL for the image
 */
export function getTmdbImageUrl(path: string | null, type: 'poster' | 'backdrop'): string {
  if (!path) {
    return type === 'poster' 
      ? 'https://via.placeholder.com/500x750?text=No+Image+Available'
      : 'https://via.placeholder.com/1280x720?text=No+Image+Available';
  }
  
  // Use appropriate size based on image type
  const size = type === 'poster' ? 'w500' : 'w1280';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Get a human-readable release date
 */
export function formatReleaseDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Convert runtime minutes to hours and minutes
 */
export function formatRuntime(minutes?: number): string {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  
  return `${hours}h ${remainingMinutes}m`;
}
