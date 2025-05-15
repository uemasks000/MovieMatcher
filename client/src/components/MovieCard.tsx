import { TmdbMovie } from "@shared/schema";
import { getTmdbImageUrl } from "@/lib/tmdb";

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
    // This would normally be replaced with proper genre mapping from the API
    const placeholder = ["Loading genres..."];
    return placeholder;
  };

  return (
    <div 
      className={`card absolute card-container w-full bg-dark rounded-xl overflow-hidden shadow-xl ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
      style={getCardStyle()}
      data-movie-id={movie.id}
    >
      <img 
        src={getTmdbImageUrl(movie.poster_path, 'poster')} 
        alt={`${movie.title} poster`} 
        className="w-full h-[60vh] object-cover"
        onError={(e) => {
          // Fallback for missing images
          e.currentTarget.src = "https://via.placeholder.com/500x750?text=No+Image+Available";
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
      
      {showOverlay && showOverlay.visible && (
        <>
          {showOverlay.like ? (
            <div className="action-overlay absolute top-1/2 right-5 transform -translate-y-1/2 bg-green-500 bg-opacity-80 text-white p-6 rounded-full border-4 border-white block">
              <span className="text-3xl font-bold transform rotate-12 block">LIKE</span>
            </div>
          ) : (
            <div className="action-overlay absolute top-1/2 left-5 transform -translate-y-1/2 bg-red-500 bg-opacity-80 text-white p-6 rounded-full border-4 border-white block">
              <span className="text-3xl font-bold transform -rotate-12 block">NOPE</span>
            </div>
          )}
        </>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent pt-10">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-heading font-bold">{movie.title}</h3>
            <div className="flex items-center mt-1">
              <span className="bg-accent text-black font-bold px-2 py-0.5 rounded text-sm mr-2">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-gray-300">
                {movie.release_date?.slice(0, 4) || 'N/A'} • {movie.genre_ids?.length ? getGenreNames(movie.genre_ids).join(', ') : 'N/A'}
              </span>
            </div>
          </div>
          {isTop && (
            <button className="bg-dark bg-opacity-60 p-2 rounded-full hover:bg-primary transition" onClick={handleInfoClick}>
              <i className="ri-information-line text-xl"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
