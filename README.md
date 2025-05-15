# FlickMatch - A Tinder-like App for Movie Discovery

FlickMatch is a modern web application that helps users discover movies through a familiar swipe interface, similar to dating apps like Tinder. Users can swipe through movie recommendations, view detailed information about each film, and save their favorites for later viewing.

## Features

- **Swipe Interface**: Intuitive Tinder-like card swiping mechanism for movie discovery
- **Real Movie Data**: Integration with TMDB (The Movie Database) API for up-to-date movie information
- **Responsive Design**: Mobile-first interface that works well on all devices
- **Movie Details**: View comprehensive information about each movie including cast, rating, and synopsis
- **Saved Preferences**: Track movies you've liked for future reference
- **Genre Filtering**: Discover movies by specific genres

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **API**: TMDB (The Movie Database) API

## Setup Instructions

1. Clone the repository
   ```
   git clone https://github.com/your-username/flickmatch.git
   cd flickmatch
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   TMDB_API_KEY=your_tmdb_api_key
   DATABASE_URL=your_postgres_database_url
   ```

4. Set up the database
   ```
   npm run db:migrate
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open the application at `http://localhost:5000`

## API Endpoints

- `GET /api/genres`: Fetch all available movie genres
- `GET /api/movies/discover`: Get movie recommendations, with optional genre filtering
- `GET /api/movies/:id`: Get detailed information about a specific movie
- `POST /api/movies/like`: Save a movie as liked or disliked
- `GET /api/movies/likes/:username`: Get all movies liked by a specific user

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie data API
- [React Tinder Card](https://github.com/3DJakob/react-tinder-card) for the swipe functionality