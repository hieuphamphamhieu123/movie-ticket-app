// src/types/movie.types.ts

export interface Movie {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  description: string;
  rating: number;
  releaseDate: string;
  genres: string[];
  duration?: number;
  language?: string;
  isFavorite?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieState {
  movies: Movie[];
  popularMovies: Movie[];
  favorites: Movie[];
  selectedMovie: Movie | null;
  isLoading: boolean;
  error: string | null;
}

export interface MovieListResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}