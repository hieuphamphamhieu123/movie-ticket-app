/**
 * API Configuration
 * Contains all API endpoints and keys
 */

export const CONFIG = {
  // Your Backend API (sẽ setup sau)
  API_BASE_URL: 'https://your-api.com/api',
  
  // TMDB API (The Movie Database)
  TMDB_API_KEY: 'your_tmdb_key_here', // Tạm để string, lấy key sau
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
};

// Alternative: Export individual configs
export const API_BASE_URL = 'https://your-api.com/api';
export const TMDB_API_KEY = 'your_tmdb_key_here';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';