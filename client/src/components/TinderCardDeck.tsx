import { useState, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import MovieCard from "./MovieCard";
import { TmdbMovie } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useContext } from "react";
import { UserContext } from "../App";
import { queryClient } from "@/lib/queryClient";

interface TinderCardDeckProps {
  movies: TmdbMovie[];
  onInfoClick: (movie: TmdbMovie) => void;
  onSwipe: (direction: string, movie: TmdbMovie) => void;
  isLoading: boolean;
  onEmpty: () => void;
}

const TinderCardDeck = ({ 
  movies, 
  onInfoClick, 
  onSwipe,
  isLoading, 
  onEmpty
}: TinderCardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const [showOverlay, setShowOverlay] = useState<{ like: boolean; visible: boolean }>({ like: false, visible: false });
  const { username } = useContext(UserContext);

  const childRefs = useRef<any[]>([]);

  useEffect(() => {
    // Reset on new movies
    setCurrentIndex(0);
    childRefs.current = Array(movies.length)
      .fill(0)
      .map((_, i) => childRefs.current[i] || null);
  }, [movies]);

  useEffect(() => {
    // Check if we've swiped all cards
    if (currentIndex >= movies.length && movies.length > 0) {
      onEmpty();
    }
  }, [currentIndex, movies.length, onEmpty]);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
  };

  const canSwipe = currentIndex < movies.length;

  const swiped = (direction: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index + 1);
    onSwipe(direction, movies[index]);
    setShowOverlay({ like: false, visible: false });
  };

  const outOfFrame = (idx: number) => {
    // Handle the case where the card is removed (smooth fade)
  };

  const swipe = async (dir: string) => {
    if (canSwipe && childRefs.current[currentIndex]) {
      setShowOverlay({ 
        like: dir === 'right', 
        visible: true 
      });
      
      // Short delay to show the overlay before actual swipe
      setTimeout(() => {
        childRefs.current[currentIndex].swipe(dir);
      }, 200);
      
      // Save to backend
      try {
        await apiRequest("POST", "/api/movies/like", {
          tmdbId: movies[currentIndex].id,
          username,
          liked: dir === 'right'
        });
        
        if (dir === 'right') {
          queryClient.invalidateQueries({ queryKey: [`/api/movies/likes/${username}`] });
        }
      } catch (error) {
        console.error("Error saving swipe:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full max-w-md h-[70vh] mt-4 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (movies.length === 0 || currentIndex >= movies.length) {
    return (
      <div className="relative w-full max-w-md h-[70vh] mt-4 flex flex-col justify-center items-center text-center">
        <i className="ri-film-line text-primary text-6xl mb-4"></i>
        <h3 className="text-2xl font-bold mb-2">No more movies!</h3>
        <p className="text-gray-300 mb-6">You've seen all the movies in this category.</p>
        <Button onClick={onEmpty} className="bg-primary hover:bg-red-700">
          Refresh Movies
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md h-[70vh] mt-4">
      {movies.map((movie, index) => (
        <div key={movie.id} className="absolute w-full">
          <TinderCard
            ref={(el) => (childRefs.current[index] = el)}
            className="absolute"
            onSwipe={(dir) => swiped(dir, index)}
            onCardLeftScreen={() => outOfFrame(index)}
            preventSwipe={["up", "down"]}
          >
            <MovieCard 
              movie={movie} 
              isTop={index === currentIndex}
              onInfoClick={onInfoClick}
              index={index - currentIndex}
              showOverlay={index === currentIndex ? showOverlay : undefined}
            />
          </TinderCard>
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex items-center justify-center space-x-6 mt-[70vh] pb-20">
        <Button 
          id="dislike-btn" 
          onClick={() => swipe('left')}
          className="p-4 bg-white hover:bg-gray-100 rounded-full shadow-lg transition transform hover:scale-110 active:scale-95 h-16 w-16"
          variant="ghost"
          disabled={!canSwipe}
        >
          <i className="ri-close-line text-red-500 text-3xl"></i>
        </Button>
        
        <Button 
          id="like-btn" 
          onClick={() => swipe('right')}
          className="p-4 bg-white hover:bg-gray-100 rounded-full shadow-lg transition transform hover:scale-110 active:scale-95 h-16 w-16"
          variant="ghost"
          disabled={!canSwipe}
        >
          <i className="ri-heart-line text-primary text-3xl"></i>
        </Button>
      </div>
    </div>
  );
};

export default TinderCardDeck;
