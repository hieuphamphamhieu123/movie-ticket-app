import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieService, Movie } from '../../services/movie.service'; // Import Movie from service

interface MovieState {
  popularMovies: Movie[];
  nowShowingMovies: Movie[];
  favoriteMovies: Movie[];
  selectedMovie: Movie | null;
  searchResults: Movie[];
  loading: boolean;
  error: string | null;
  searchLoading: boolean;
}

const initialState: MovieState = {
  popularMovies: [],
  nowShowingMovies: [],
  favoriteMovies: [],
  selectedMovie: null,
  searchResults: [],
  loading: false,
  error: null,
  searchLoading: false,
};

// Async thunks
export const fetchPopularMovies = createAsyncThunk(
  'movie/fetchPopular',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await movieService.getPopularMovies(20);
      return movies;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNowShowingMovies = createAsyncThunk(
  'movie/fetchNowShowing',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await movieService.getNowShowingMovies(20);
      return movies;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movie/fetchById',
  async (movieId: string, { rejectWithValue }) => {
    try {
      const movie = await movieService.getMovieById(movieId);
      return movie;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movie/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const movies = await movieService.searchMovies(query);
      return movies;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFavoriteMovies = createAsyncThunk(
  'movie/fetchFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const movies = await movieService.getFavoriteMovies(userId);
      return movies;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Popular Movies
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.popularMovies = action.payload;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Now Showing Movies
    builder
      .addCase(fetchNowShowingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNowShowingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.nowShowingMovies = action.payload;
      })
      .addCase(fetchNowShowingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Movie By ID
    builder
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Movies
    builder
      .addCase(searchMovies.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Favorites
    builder
      .addCase(fetchFavoriteMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavoriteMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteMovies = action.payload;
      })
      .addCase(fetchFavoriteMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults, clearSelectedMovie, clearError } = movieSlice.actions;
export default movieSlice.reducer;