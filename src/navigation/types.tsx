import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main Bottom Tabs
export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  BookingsTab: undefined;
  ProfileTab: undefined;
};

// Main Stack (contains tabs + other screens)
export type MainStackParamList = {
  MainTabs: undefined;
  MovieDetail: {
    movieId: string;
  };
  Payment: {
    movieId: string;
    movieTitle: string;
    poster: string;
  };
};

// Root Stack
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};