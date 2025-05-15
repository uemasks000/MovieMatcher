import { useQuery } from "@tanstack/react-query";
import { Genre } from "@shared/schema";
import { useState, useEffect } from "react";

interface GenreFilterProps {
  onSelectGenre: (genreId: string) => void;
  selectedGenre: string;
}

const GenreFilter = ({ onSelectGenre, selectedGenre }: GenreFilterProps) => {
  const { data: genresData, isLoading } = useQuery<{ genres: Genre[] }>({
    queryKey: ["/api/genres"],
  });

  const handleGenreClick = (genreId: string) => {
    onSelectGenre(genreId);
  };

  if (isLoading) {
    return (
      <div className="mt-16 px-4 py-3 sticky top-16 bg-dark bg-opacity-80 backdrop-blur-sm z-40">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-heading">Discover Movies</h2>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-secondary animate-pulse border border-gray-600 h-8 w-20 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 px-4 py-3 sticky top-16 bg-dark bg-opacity-80 backdrop-blur-sm z-40">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-heading">Discover Movies</h2>
        <button className="text-sm text-primary flex items-center">
          <i className="ri-filter-3-line mr-1"></i> Filters
        </button>
      </div>
      <div className="genre-pill flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleGenreClick("all")}
          className={`${
            selectedGenre === "all" ? "bg-primary" : "bg-secondary border border-gray-600 hover:bg-primary"
          } px-4 py-1 rounded-full text-white text-sm whitespace-nowrap transition`}
        >
          All
        </button>
        
        {genresData?.genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre.id.toString())}
            className={`${
              selectedGenre === genre.id.toString() ? "bg-primary" : "bg-secondary border border-gray-600 hover:bg-primary"
            } px-4 py-1 rounded-full text-white text-sm whitespace-nowrap transition`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
