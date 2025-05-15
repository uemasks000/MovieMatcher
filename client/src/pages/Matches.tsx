import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderBar from "@/components/HeaderBar";
import MobileNavbar from "@/components/MobileNavbar";
import { TmdbMovie } from "@shared/schema";
import { UserContext } from "../App";
import { Card, CardContent } from "@/components/ui/card";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { useState } from "react";
import MovieDetail from "@/components/MovieDetail";

const Matches = () => {
  const { username } = useContext(UserContext);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: likedMovies, isLoading } = useQuery<TmdbMovie[]>({
    queryKey: [`/api/movies/likes/${username}`],
  });

  const handleMovieClick = (movieId: number) => {
    setSelectedMovie(movieId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-16">
      <HeaderBar />
      
      <div className="mt-16 px-4 py-3 sticky top-16 bg-dark bg-opacity-80 backdrop-blur-sm z-40">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-heading">Your Movie Matches</h2>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-dark animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
        ) : likedMovies && likedMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedMovies.map((movie) => (
              <Card key={movie.id} className="bg-dark border-0 overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => handleMovieClick(movie.id)}>
                <CardContent className="p-0 relative">
                  <img 
                    src={getTmdbImageUrl(movie.poster_path, 'poster')} 
                    alt={`${movie.title} poster`}
                    className="w-full aspect-[2/3] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-80 transition flex items-end">
                    <div className="p-3">
                      <h3 className="font-bold text-white">{movie.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="bg-accent text-black font-bold px-1 py-0.5 rounded text-xs mr-1">
                          {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-300">{movie.release_date?.slice(0, 4) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-96">
            <i className="ri-heart-line text-primary text-6xl mb-4"></i>
            <h3 className="text-2xl font-bold mb-2">No matches yet</h3>
            <p className="text-gray-300 max-w-md">
              Start swiping right on movies you like to build your collection of matches.
            </p>
          </div>
        )}
      </main>
      
      <MobileNavbar />
      
      <MovieDetail 
        movieId={selectedMovie} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onLike={handleCloseModal}
        onDislike={handleCloseModal}
      />
    </div>
  );
};

export default Matches;
