// src/types/booking.types.ts

export interface Booking {
  id: string;
  userId: string;
  movieId: number;
  movieTitle: string;
  poster: string;
  bookedDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface CreateBookingData {
  userId: string;
  movieId: number;
  movieTitle: string;
  poster: string;
  paymentMethod: 'credit_card' | 'paypal';
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  label: string;
  icon: string;
}

export interface PaymentData {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}