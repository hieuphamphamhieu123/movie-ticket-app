import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import MovieCard from './MovieCard';
import { Movie } from '../../types/movie.types';

interface MovieListProps {
  movies: Movie[];
  onMoviePress: (movieId: string) => void;
  loading?: boolean;
  horizontal?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  onMoviePress,
  loading = false,
  horizontal = true,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No movies found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()} // Convert to string
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          onPress={() => onMoviePress(item.id.toString())} // FIX: Convert to string
        />
      )}
      contentContainerStyle={styles.listContent}
      numColumns={horizontal ? undefined : 2}
      key={horizontal ? 'h' : 'v'}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingLeft: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#808080',
    fontSize: 16,
  },
});

export default MovieList;