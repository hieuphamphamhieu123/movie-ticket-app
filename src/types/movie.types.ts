export interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string; // Remove ? to make it required
  vote_average: number;
  release_date: string;
  genres: string[];
  duration?: number;
  isFavorite?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}