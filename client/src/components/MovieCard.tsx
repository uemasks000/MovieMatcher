import { TmdbMovie } from "@shared/schema";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";

interface MovieCardProps {
  movie: TmdbMovie;
  isTop: boolean;
  onInfoClick: (movie: TmdbMovie) => void;
  index: number;
  showOverlay?: {
    like: boolean;
    visible: boolean;
  };
}

const MovieCard = ({ movie, isTop, onInfoClick, index, showOverlay }: MovieCardProps) => {
  const isMobile = useIsMobile();
  
  // Fetch genres for this card
  const { data: genresData } = useQuery<{ genres: {id: number, name: string}[] }>({
    queryKey: ["/api/genres"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Calculate styling based on card position in stack
  const getCardStyle = () => {
    if (!isTop) {
      const topOffset = index * 3;
      const widthPercentage = 100 - (index * 5 > 10 ? 10 : index * 5);
      const opacity = 1 - (index * 0.2 > 0.6 ? 0.6 : index * 0.2);
      const scale = 1 - (index * 0.02 > 0.04 ? 0.04 : index * 0.02);
      
      return {
        top: `${topOffset}px`,
        width: `${widthPercentage}%`,
        opacity,
        transform: `scale(${scale})`,
        margin: '0 auto',
        pointerEvents: 'none' as 'none'
      };
    }
    
    return {};
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInfoClick(movie);
  };

  const getGenreNames = (genreIds: number[] = []) => {
    if (!genresData || !genresData.genres) return ["Loading genres..."];
    
    return genreIds
      .map(id => genresData.genres.find(g => g.id === id)?.name)
      .filter(Boolean) as string[];
  };

  // Determine card height based on device
  const cardHeight = isMobile ? "h-[50vh]" : "h-[60vh]";
  
  // Determine overlay size based on device
  const overlaySize = isMobile ? "p-4 text-2xl" : "p-6 text-3xl";
  
  return (
    <div 
      className={`card absolute card-container w-full bg-dark rounded-xl overflow-hidden shadow-xl ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
      style={getCardStyle()}
      data-movie-id={movie.id}
    >
      <img 
        src={getTmdbImageUrl(movie.poster_path, 'poster')} 
        alt={`${movie.title} poster`} 
        className={`w-full ${cardHeight} object-cover`}
        onError={(e) => {
          // Fallback for missing images
          e.currentTarget.src = "https://via.placeholder.com/500x750?text=No+Image+Available";
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
      
      {showOverlay && showOverlay.visible && (
        <>
          {showOverlay.like ? (
            <div className={`action-overlay absolute top-1/2 right-5 transform -translate-y-1/2 bg-green-500 bg-opacity-80 text-white ${overlaySize} rounded-full border-4 border-white block`}>
              <span className="font-bold transform rotate-12 block">LIKE</span>
            </div>
          ) : (
            <div className={`action-overlay absolute top-1/2 left-5 transform -translate-y-1/2 bg-red-500 bg-opacity-80 text-white ${overlaySize} rounded-full border-4 border-white block`}>
              <span className="font-bold transform -rotate-12 block">NOPE</span>
            </div>
          )}
        </>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent pt-10">
        <div className="flex justify-between items-end">
          <div className="flex-1 pr-2">
            <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-heading font-bold truncate`}>{movie.title}</h3>
            <div className="flex flex-wrap items-center mt-1">
              <span className="bg-accent text-black font-bold px-2 py-0.5 rounded text-sm mr-2 mb-1">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-gray-300">
                {movie.release_date?.slice(0, 4) || 'N/A'} 
                {movie.genre_ids?.length ? 
                  <>
                    {" • "}
                    <span className="truncate max-w-[120px] inline-block align-bottom">
                      {getGenreNames(movie.genre_ids).join(', ')}
                    </span>
                  </> 
                  : null
                }
              </span>
            </div>
          </div>
          {isTop && (
            <button 
              className="bg-dark bg-opacity-60 p-2 rounded-full hover:bg-primary transition flex-shrink-0"
              onClick={handleInfoClick}
              aria-label="More information"
            >
              <i className="ri-information-line text-xl"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
