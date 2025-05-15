import express, { type Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, insertUserLikeSchema } from "@shared/schema";
import { z } from "zod";
import { mockGenres, mockMovies, mockMovieDetails } from "./mockData";
import { ParsedQs } from "qs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes using mock data
  app.get("/api/genres", async (req, res) => {
    try {
      res.json(mockGenres);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  app.get("/api/movies/discover", async (req, res) => {
    try {
      const { genre, page = 1 } = req.query;
      const pageNum = Number(page);
      
      // Filter movies by genre if specified
      let filteredMovies = [...mockMovies];
      if (genre && genre !== "all") {
        // Parse the genre ID from the query parameter
        let genreIdStr = "";
        
        if (Array.isArray(genre)) {
          genreIdStr = genre.length > 0 ? String(genre[0]) : "";
        } else if (typeof genre === "object" && genre !== null) {
          const firstVal = Object.values(genre)[0];
          if (firstVal) {
            if (Array.isArray(firstVal)) {
              genreIdStr = firstVal.length > 0 ? String(firstVal[0]) : "";
            } else if (typeof firstVal === "object" && firstVal !== null) {
              const nestedVal = Object.values(firstVal)[0];
              genreIdStr = nestedVal ? String(nestedVal) : "";
            } else {
              genreIdStr = String(firstVal);
            }
          }
        } else {
          genreIdStr = String(genre);
        }
        
        const genreId = parseInt(genreIdStr);
        
        if (!isNaN(genreId)) {
          filteredMovies = mockMovies.filter(movie => 
            movie.genre_ids?.includes(genreId)
          );
        }
      }
      
      // Paginate results - 5 movies per page
      const pageSize = 5;
      const startIndex = (pageNum - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = filteredMovies.slice(startIndex, endIndex);
      
      res.json({
        page: pageNum,
        results: paginatedResults,
        total_pages: Math.ceil(filteredMovies.length / pageSize),
        total_results: filteredMovies.length
      });
    } catch (error) {
      console.error("Error fetching discover movies:", error);
      res.status(500).json({ message: "Failed to fetch discover movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const movieId = parseInt(id);
      
      if (isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const movieDetail = mockMovieDetails(movieId);
      
      if (!movieDetail) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      res.json(movieDetail);
    } catch (error) {
      console.error(`Error fetching movie details for ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch movie details" });
    }
  });

  // Like/dislike a movie
  app.post("/api/movies/like", async (req, res) => {
    try {
      const likeData = insertUserLikeSchema.parse(req.body);
      const userLike = await storage.saveLike(likeData);
      res.status(201).json(userLike);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error saving movie like:", error);
      res.status(500).json({ message: "Failed to save like information" });
    }
  });

  // Get user liked movies
  app.get("/api/movies/likes/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const likedMovies = await storage.getLikedMoviesByUsername(username);
      
      // If there are liked movies, get their details from mock data
      if (likedMovies.length > 0) {
        const movieDetails = likedMovies.map(like => {
          const movieDetail = mockMovieDetails(like.tmdbId);
          return movieDetail;
        }).filter(Boolean);
        
        res.json(movieDetails);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error fetching liked movies:", error);
      res.status(500).json({ message: "Failed to fetch liked movies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
