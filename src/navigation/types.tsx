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
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  MovieDetail: {
    movieId: string;
  };
  SeatSelection: {
    movieId: string;
    movieTitle: string;
    poster: string;
  };
  Payment: {
    movieId: string;
    movieTitle: string;
    poster: string;
    seats: Array<{
      seatId: string;
      row: string;
      number: number;
      type: 'regular' | 'vip';
      price: number;
    }>;
    totalPrice: number;
  };
};

// Root Stack
export type RootStackParamList = MainStackParamList & {
  Auth: undefined;
  Main: undefined;
};