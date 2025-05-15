import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderBar from "@/components/HeaderBar";
import GenreFilter from "@/components/GenreFilter";
import TinderCardDeck from "@/components/TinderCardDeck";
import MovieDetail from "@/components/MovieDetail";
import MobileNavbar from "@/components/MobileNavbar";
import { TmdbMovie } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const Discover = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch movies based on genre and page
  const { data, isLoading, refetch } = useQuery<{ results: TmdbMovie[] }>({
    queryKey: ["/api/movies/discover", selectedGenre, page],
    queryFn: async () => {
      const url = `/api/movies/discover?${selectedGenre !== "all" ? `genre=${selectedGenre}&` : ""}page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      return response.json();
    },
  });

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenre(genreId);
    setPage(1); // Reset to page 1
  };

  const handleInfoClick = (movie: TmdbMovie) => {
    setSelectedMovie(movie.id);
    setIsModalOpen(true);
  };

  const handleSwipe = (direction: string, movie: TmdbMovie) => {
    if (direction === 'right') {
      toast({
        title: "Liked",
        description: `${movie.title} has been added to your matches`,
        duration: 1500,
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRefresh = () => {
    // Load next page or refetch current page
    const nextPage = page + 1;
    setPage(nextPage);
    refetch();
  };

  return (
    <div className="min-h-screen pb-16">
      <HeaderBar />
      <GenreFilter onSelectGenre={handleSelectGenre} selectedGenre={selectedGenre} />
      
      <main className="container mx-auto px-4 py-6 flex flex-col items-center justify-start min-h-screen">
        <TinderCardDeck 
          movies={data?.results || []} 
          onInfoClick={handleInfoClick}
          onSwipe={handleSwipe}
          isLoading={isLoading}
          onEmpty={handleRefresh}
        />
      </main>
      
      <MobileNavbar />
      
      <MovieDetail 
        movieId={selectedMovie} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onLike={() => {
          handleCloseModal();
        }}
        onDislike={() => {
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default Discover;
