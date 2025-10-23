import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase.config';

export interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genres: string[];
  duration?: number;
}

export const movieService = {
  // Get all movies from Firebase
  getAllMovies: async (): Promise<Movie[]> => {
    try {
      console.log('🔄 Fetching ALL movies from Firebase...');
      
      if (!db) {
        console.error('❌ Firestore DB is null');
        return [];
      }

      const moviesRef = collection(db, 'movies');
      console.log('📍 Collection reference created');
      
      const snapshot = await getDocs(moviesRef);
      console.log('📊 Snapshot received, size:', snapshot.size);
      console.log('📊 Snapshot empty?:', snapshot.empty);
      
      if (snapshot.empty) {
        console.warn('⚠️ No documents found in movies collection');
        return [];
      }

      const movies: Movie[] = [];
      
      snapshot.forEach((docSnap) => {
        console.log('📄 Processing doc:', docSnap.id);
        const data = docSnap.data();
        console.log('📄 Doc data:', JSON.stringify(data, null, 2));
        
        const movie: Movie = {
          id: docSnap.id,
          title: data.title || 'Untitled',
          overview: data.description || data.overview || '',
          poster_path: data.poster || data.poster_path || '',
          backdrop_path: data.poster || data.poster_path || data.backdrop_path || '',
          vote_average: data.rating || data.vote_average || 0,
          release_date: data.releaseDate || data.release_date || '',
          genres: Array.isArray(data.genres) ? data.genres : [],
          duration: data.duration || 0,
        };
        
        movies.push(movie);
        console.log('✅ Added movie:', movie.title);
      });

      console.log('✅ Total movies fetched:', movies.length);
      return movies;
    } catch (error) {
      console.error('❌ Error in getAllMovies:', error);
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      return [];
    }
  },

  // Get popular movies (sorted by rating)
  getPopularMovies: async (limitCount: number = 20): Promise<Movie[]> => {
    try {
      console.log('🔄 Getting popular movies...');
      const allMovies = await movieService.getAllMovies();
      
      if (allMovies.length === 0) {
        console.warn('⚠️ No movies to sort');
        return [];
      }

      // Sort by rating DESC
      const sorted = allMovies.sort((a, b) => b.vote_average - a.vote_average);
      const limited = sorted.slice(0, limitCount);
      
      console.log('✅ Popular movies:', limited.length);
      return limited;
    } catch (error) {
      console.error('❌ Error in getPopularMovies:', error);
      return [];
    }
  },

  // Get now showing movies (sorted by release date)
  getNowShowingMovies: async (limitCount: number = 20): Promise<Movie[]> => {
    try {
      console.log('🔄 Getting now showing movies...');
      const allMovies = await movieService.getAllMovies();
      
      if (allMovies.length === 0) {
        console.warn('⚠️ No movies to sort');
        return [];
      }

      // Sort by release date DESC
      const sorted = allMovies.sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return dateB - dateA;
      });
      const limited = sorted.slice(0, limitCount);
      
      console.log('✅ Now showing movies:', limited.length);
      return limited;
    } catch (error) {
      console.error('❌ Error in getNowShowingMovies:', error);
      return [];
    }
  },

  // Get movie by ID
  getMovieById: async (movieId: string): Promise<Movie | null> => {
    try {
      console.log('🔄 Fetching movie by ID:', movieId);
      
      if (!db) {
        console.error('❌ Firestore DB is null');
        return null;
      }

      const movieRef = doc(db, 'movies', movieId);
      const movieDoc = await getDoc(movieRef);

      if (!movieDoc.exists()) {
        console.warn('⚠️ Movie not found');
        return null;
      }

      const data = movieDoc.data();
      const movie: Movie = {
        id: movieDoc.id,
        title: data.title || 'Untitled',
        overview: data.description || data.overview || '',
        poster_path: data.poster || data.poster_path || '',
        backdrop_path: data.poster || data.poster_path || data.backdrop_path || '',
        vote_average: data.rating || data.vote_average || 0,
        release_date: data.releaseDate || data.release_date || '',
        genres: Array.isArray(data.genres) ? data.genres : [],
        duration: data.duration || 0,
      };

      console.log('✅ Found movie:', movie.title);
      return movie;
    } catch (error) {
      console.error('❌ Error in getMovieById:', error);
      return null;
    }
  },

  // Search movies
  searchMovies: async (searchQuery: string): Promise<Movie[]> => {
    try {
      console.log('🔍 Searching for:', searchQuery);
      const allMovies = await movieService.getAllMovies();
      
      const filtered = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      console.log('✅ Search results:', filtered.length);
      return filtered;
    } catch (error) {
      console.error('❌ Error in searchMovies:', error);
      return [];
    }
  },

  // Get favorites (placeholder)
  getFavoriteMovies: async (userId: string): Promise<Movie[]> => {
    console.log('ℹ️ Favorites not implemented for user:', userId);
    return [];
  },
};