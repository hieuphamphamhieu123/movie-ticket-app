// src/types/booking.types.ts

export interface SeatInfo {
  seatId: string;
  row: string;
  number: number;
  type: 'regular' | 'vip';
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  poster: string;
  bookedDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  paymentMethod?: 'credit_card' | 'paypal';
  seats?: SeatInfo[];
  totalPrice?: number;
  showtime?: string;
}

export interface CreateBookingData {
  userId: string;
  movieId: string;
  movieTitle: string;
  poster: string;
  paymentMethod: 'credit_card' | 'paypal';
  seats: SeatInfo[];
  totalPrice: number;
  showtime?: string;
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