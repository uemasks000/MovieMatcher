/**
 * Utility functions for working with movie images
 */

/**
 * Get the image URL for a movie poster or backdrop
 * 
 * @param path The image path
 * @param type The type of image (poster or backdrop)
 * @returns The URL for the image
 */
export function getTmdbImageUrl(path: string | null, type: 'poster' | 'backdrop'): string {
  // For mock data, we just have simple path names without a full URL
  if (!path) {
    return type === 'poster' 
      ? 'https://via.placeholder.com/500x750?text=No+Image+Available'
      : 'https://via.placeholder.com/1280x720?text=No+Image+Available';
  }
  
  // If path starts with http, use it directly
  if (path.startsWith('http')) {
    return path;
  }
  
  // For our mock data with paths like "/poster1.jpg"
  if (path.startsWith('/poster') || path.startsWith('/backdrop') || path.startsWith('/actor')) {
    // Use placeholder images with custom text
    const dimensions = type === 'poster' ? '500x750' : '1280x720';
    const filename = path.substring(1).split('.')[0]; // Get "poster1" from "/poster1.jpg"
    return `https://via.placeholder.com/${dimensions}?text=${filename}`;
  }
  
  // Fallback to placeholder
  return type === 'poster' 
    ? 'https://via.placeholder.com/500x750?text=Movie+Poster' 
    : 'https://via.placeholder.com/1280x720?text=Movie+Backdrop';
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
