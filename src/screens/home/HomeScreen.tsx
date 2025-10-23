import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchPopularMovies,
  fetchNowShowingMovies,
  fetchFavoriteMovies,
} from '../../store/slices/movieSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import MovieList from '../../components/movie/MovieList';
import SectionHeader from '../../components/common/SectionHeader';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const { popularMovies, nowShowingMovies, favoriteMovies, loading } = useAppSelector(
    (state) => state.movie
  );
  const { user } = useAppSelector((state) => state.auth);

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      await Promise.all([
        dispatch(fetchPopularMovies()).unwrap(),
        dispatch(fetchNowShowingMovies()).unwrap(),
      ]);
      
      if (user?.id) {
        await dispatch(fetchFavoriteMovies(user.id)).unwrap();
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  const handleMoviePress = (movieId: string) => {
    navigation.navigate('MovieDetail', { movieId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E50914"
          />
        }
      >
        {/* Popular Movies Section */}
        <SectionHeader title="Popular Movies" />
        <MovieList
          movies={popularMovies}
          onMoviePress={handleMoviePress}
          loading={loading && popularMovies.length === 0}
          horizontal={true}
        />

        {/* Favorites Section */}
        {favoriteMovies.length > 0 && (
          <>
            <SectionHeader title="Favorites" />
            <MovieList
              movies={favoriteMovies}
              onMoviePress={handleMoviePress}
              horizontal={true}
            />
          </>
        )}

        {/* Now Showing Section */}
        <SectionHeader title="Now Showing" />
        <MovieList
          movies={nowShowingMovies}
          onMoviePress={handleMoviePress}
          loading={loading && nowShowingMovies.length === 0}
          horizontal={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;