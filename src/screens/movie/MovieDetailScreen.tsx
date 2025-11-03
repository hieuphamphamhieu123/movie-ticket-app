import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMovieById } from '../../store/slices/movieSlice';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type MovieDetailScreenRouteProp = RouteProp<MainStackParamList, 'MovieDetail'>;
type MovieDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MovieDetail'>;

const MovieDetailScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<MovieDetailScreenNavigationProp>();
  const route = useRoute<MovieDetailScreenRouteProp>();
  
  const { movieId } = route.params;
  const { selectedMovie, loading } = useAppSelector((state) => state.movie);

  useEffect(() => {
    loadMovieDetail();
  }, [movieId]);

  const loadMovieDetail = async () => {
    try {
      await dispatch(fetchMovieById(movieId)).unwrap();
    } catch (error) {
      console.error('Error loading movie detail:', error);
    }
  };

  const handleBookNow = () => {
    if (selectedMovie) {
      navigation.navigate('SeatSelection', {
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        poster: selectedMovie.poster_path,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading || !selectedMovie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop Image with Gradient */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: selectedMovie.backdrop_path || selectedMovie.poster_path }}
            style={styles.backdrop}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
            style={styles.gradient}
          />
          
          {/* Back Button - FIX HERE */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Movie Info */}
        <View style={styles.contentContainer}>
          {/* Poster and Basic Info */}
          <View style={styles.headerSection}>
            <Image
              source={{ uri: selectedMovie.poster_path }}
              style={styles.poster}
              resizeMode="cover"
            />
            
            <View style={styles.infoSection}>
              <Text style={styles.title}>{selectedMovie.title}</Text>
              
              {/* Rating */}
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.rating}>
                  {selectedMovie.vote_average.toFixed(1)}/10
                </Text>
              </View>

              {/* Release Date */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Release Date: </Text>
                <Text style={styles.metaValue}>{selectedMovie.release_date}</Text>
              </View>

              {/* Duration */}
              {selectedMovie.duration && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Duration: </Text>
                  <Text style={styles.metaValue}>{selectedMovie.duration} min</Text>
                </View>
              )}

              {/* Genres */}
              <View style={styles.genresContainer}>
                {selectedMovie.genres?.map((genre, index) => (
                  <View key={index} style={styles.genreChip}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Overview */}
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{selectedMovie.overview}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button - Fixed at Bottom */}
      <SafeAreaView style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropContainer: {
    width: width,
    height: height * 0.4,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerSection: {
    flexDirection: 'row',
    marginTop: -60,
    marginBottom: 24,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  infoSection: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  metaLabel: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '600',
  },
  metaValue: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genreChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  overviewSection: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overview: {
    color: '#B0B0B0',
    fontSize: 15,
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  bookButton: {
    backgroundColor: '#E50914',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MovieDetailScreen;