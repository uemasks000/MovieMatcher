import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { insertMovieSchema, insertUserLikeSchema } from "@shared/schema";
import { z } from "zod";

// Setting up TMDB API key from environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY || "3e1dd2d638fd39d5cf997a60ae3e40aa";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/genres", async (req, res) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  app.get("/api/movies/discover", async (req, res) => {
    try {
      const { genre, page = 1 } = req.query;
      
      const params: Record<string, string | number> = {
        api_key: TMDB_API_KEY,
        language: "en-US",
        sort_by: "popularity.desc",
        include_adult: "false",
        page: Number(page),
      };
      
      if (genre && genre !== "all") {
        if (Array.isArray(genre)) {
          params.with_genres = String(genre[0]);
        } else if (typeof genre === 'object') {
          params.with_genres = String(Object.values(genre)[0] || '');
        } else {
          params.with_genres = String(genre);
        }
      }
      
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching discover movies:", error);
      res.status(500).json({ message: "Failed to fetch discover movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          append_to_response: "credits",
        },
      });
      res.json(response.data);
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
      
      // If there are liked movies, fetch their details from TMDB
      if (likedMovies.length > 0) {
        const movieDetailsPromises = likedMovies.map(async (like) => {
          try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${like.tmdbId}`, {
              params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
              },
            });
            return response.data;
          } catch (err) {
            console.error(`Error fetching details for movie ID ${like.tmdbId}:`, err);
            return null;
          }
        });
        
        const movieDetails = (await Promise.all(movieDetailsPromises)).filter(Boolean);
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
