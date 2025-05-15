import { TmdbMovie } from "@shared/schema";

// Mock genres for the application
export const mockGenres = {
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ]
};

// Mock movies data
export const mockMovies: TmdbMovie[] = [
  {
    id: 1,
    title: "The Adventure Begins",
    overview: "A thrilling journey through unknown lands where heroes are made and legends are born.",
    poster_path: "/poster1.jpg",
    backdrop_path: "/backdrop1.jpg",
    release_date: "2025-01-15",
    vote_average: 8.7,
    genre_ids: [28, 12, 14]
  },
  {
    id: 2,
    title: "City of Shadows",
    overview: "In a metropolis plagued by crime, one detective risks everything to uncover the truth.",
    poster_path: "/poster2.jpg",
    backdrop_path: "/backdrop2.jpg",
    release_date: "2024-11-05",
    vote_average: 7.9,
    genre_ids: [80, 53, 9648]
  },
  {
    id: 3,
    title: "Love in Paris",
    overview: "Two strangers meet in the city of love and find their lives forever changed.",
    poster_path: "/poster3.jpg",
    backdrop_path: "/backdrop3.jpg",
    release_date: "2025-02-14",
    vote_average: 8.2,
    genre_ids: [10749, 18]
  },
  {
    id: 4,
    title: "Galactic Odyssey",
    overview: "The fate of humanity rests in the hands of explorers venturing to the edge of the universe.",
    poster_path: "/poster4.jpg",
    backdrop_path: "/backdrop4.jpg",
    release_date: "2024-09-21",
    vote_average: 9.1,
    genre_ids: [878, 12, 28]
  },
  {
    id: 5,
    title: "Laugh Factory",
    overview: "A struggling comedian gets the opportunity of a lifetime, but success comes at a price.",
    poster_path: "/poster5.jpg",
    backdrop_path: "/backdrop5.jpg",
    release_date: "2024-08-03",
    vote_average: 7.6,
    genre_ids: [35, 18]
  },
  {
    id: 6,
    title: "Historical Heroes",
    overview: "Based on true events, a group of unlikely allies changes the course of history.",
    poster_path: "/poster6.jpg",
    backdrop_path: "/backdrop6.jpg",
    release_date: "2024-12-12",
    vote_average: 8.4,
    genre_ids: [36, 18, 10752]
  },
  {
    id: 7,
    title: "Enchanted Forest",
    overview: "A family adventure into a magical world where nothing is quite as it seems.",
    poster_path: "/poster7.jpg",
    backdrop_path: "/backdrop7.jpg",
    release_date: "2025-03-20",
    vote_average: 7.8,
    genre_ids: [10751, 14, 12]
  },
  {
    id: 8,
    title: "Midnight Terror",
    overview: "What started as a simple house party becomes a fight for survival as night falls.",
    poster_path: "/poster8.jpg",
    backdrop_path: "/backdrop8.jpg",
    release_date: "2024-10-31",
    vote_average: 6.9,
    genre_ids: [27, 53]
  },
  {
    id: 9,
    title: "The Final Heist",
    overview: "A master thief assembles a team for one last job that will set them up for life.",
    poster_path: "/poster9.jpg",
    backdrop_path: "/backdrop9.jpg",
    release_date: "2025-01-05",
    vote_average: 8.0,
    genre_ids: [80, 28, 53]
  },
  {
    id: 10,
    title: "Rhythms of Life",
    overview: "A musical journey following a talented but unknown band as they rise to stardom.",
    poster_path: "/poster10.jpg",
    backdrop_path: "/backdrop10.jpg",
    release_date: "2024-07-15",
    vote_average: 7.5,
    genre_ids: [10402, 18]
  },
  {
    id: 11,
    title: "Western Frontiers",
    overview: "In the untamed wilderness of the Old West, a sheriff fights to protect a town from outlaws.",
    poster_path: "/poster11.jpg",
    backdrop_path: "/backdrop11.jpg",
    release_date: "2024-08-25",
    vote_average: 7.7,
    genre_ids: [37, 28]
  },
  {
    id: 12,
    title: "Animated Dreams",
    overview: "In a world where drawings come to life, an artist discovers the power of imagination.",
    poster_path: "/poster12.jpg",
    backdrop_path: "/backdrop12.jpg",
    release_date: "2025-04-10",
    vote_average: 8.6,
    genre_ids: [16, 10751, 14]
  }
];

// Mock movie details with additional information
export const mockMovieDetails = (id: number) => {
  const movie = mockMovies.find(m => m.id === id);
  if (!movie) return null;
  
  return {
    ...movie,
    genres: movie.genre_ids?.map(gid => 
      mockGenres.genres.find(g => g.id === gid) || { id: gid, name: "Unknown" }
    ),
    runtime: Math.floor(Math.random() * 60) + 90, // Random runtime between 90-150 mins
    adult: false,
    credits: {
      cast: [
        { id: 101, name: "John Actor", character: "Main Character", profile_path: "/actor1.jpg" },
        { id: 102, name: "Jane Star", character: "Supporting Role", profile_path: "/actor2.jpg" },
        { id: 103, name: "Bob Famous", character: "Villain", profile_path: "/actor3.jpg" },
        { id: 104, name: "Alice Talented", character: "Friend", profile_path: "/actor4.jpg" },
        { id: 105, name: "Tom Performer", character: "Mentor", profile_path: "/actor5.jpg" }
      ],
      crew: [
        { id: 201, name: "Famous Director", job: "Director", department: "Directing" },
        { id: 202, name: "Talented Writer", job: "Screenplay", department: "Writing" },
        { id: 203, name: "Music Composer", job: "Original Music Composer", department: "Sound" }
      ]
    }
  };
};