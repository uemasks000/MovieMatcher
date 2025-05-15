import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useContext } from "react";
import { UserContext } from "../App";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MovieDetailProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onDislike: () => void;
}

const MovieDetail = ({ movieId, isOpen, onClose, onLike, onDislike }: MovieDetailProps) => {
  const { username } = useContext(UserContext);
  const { toast } = useToast();

  const { data: movie, isLoading } = useQuery({
    queryKey: [`/api/movies/${movieId}`, movieId],
    enabled: !!movieId && isOpen
  });

  const handleLike = async () => {
    try {
      await apiRequest("POST", "/api/movies/like", {
        tmdbId: movie.id,
        username,
        liked: true
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/movies/likes/${username}`] });
      toast({
        title: "Movie Liked!",
        description: `${movie.title} has been added to your matches.`,
      });
      
      onLike();
    } catch (error) {
      console.error("Error liking movie:", error);
      toast({
        title: "Error",
        description: "Failed to like the movie. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDislike = async () => {
    try {
      await apiRequest("POST", "/api/movies/like", {
        tmdbId: movie.id,
        username,
        liked: false
      });
      
      onDislike();
    } catch (error) {
      console.error("Error disliking movie:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to dislike the movie. Please try again.",
      });
    }
  };

  if (!movieId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark text-white max-w-lg max-h-[90vh] overflow-hidden p-0 rounded-xl">
        {isLoading ? (
          <div className="p-6 flex justify-center items-center h-96">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="relative">
              <img
                src={getTmdbImageUrl(movie.backdrop_path || movie.poster_path, 'backdrop')}
                alt={`${movie.title} backdrop`}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/800x450?text=No+Image+Available";
                }}
              />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition"
              >
                <i className="ri-close-line text-white text-xl"></i>
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-heading font-bold">{movie.title}</h3>
                  <div className="flex items-center">
                    <i className="ri-star-fill text-accent mr-1"></i>
                    <span className="font-bold">{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(90vh - 16rem)" }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
                <div><i className="ri-calendar-line mr-1"></i> {movie.release_date?.slice(0, 4) || 'N/A'}</div>
                {movie.runtime && <div><i className="ri-time-line mr-1"></i> {movie.runtime} min</div>}
                {movie.adult !== undefined && <div><i className="ri-group-line mr-1"></i> {movie.adult ? 'R' : 'PG-13'}</div>}
              </div>
              
              <p className="text-gray-300 mb-4">{movie.overview}</p>
              
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <>
                  <h4 className="font-heading font-bold mb-2">Cast</h4>
                  <div className="flex overflow-x-auto space-x-3 pb-2 mb-4">
                    {movie.credits.cast.slice(0, 8).map((person) => (
                      <div key={person.id} className="flex-shrink-0 w-20">
                        <div className="w-16 h-16 rounded-full bg-gray-700 mb-1 overflow-hidden">
                          {person.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-center">
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center truncate">{person.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {movie.credits?.crew && (
                <>
                  <h4 className="font-heading font-bold mb-2">Director</h4>
                  <p className="mb-4">
                    {movie.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown'}
                  </p>
                </>
              )}
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1 py-6 mr-2 border-gray-600 hover:bg-gray-800"
                  onClick={handleDislike}
                >
                  <i className="ri-close-line text-red-500 mr-1"></i> Pass
                </Button>
                <Button 
                  className="flex-1 py-6 bg-primary hover:bg-red-700"
                  onClick={handleLike}
                >
                  <i className="ri-heart-line mr-1"></i> Like
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetail;
