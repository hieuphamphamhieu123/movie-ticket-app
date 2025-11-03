import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase.config';
import { Booking, CreateBookingData } from '../types/booking.types';

const BOOKINGS_COLLECTION = 'bookings';

export const bookingService = {
  /**
   * Create a new booking in Firestore
   */
  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      const bookingDoc = {
        ...bookingData,
        bookedDate: Timestamp.now(),
        status: 'confirmed',
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingDoc);

      return {
        id: docRef.id,
        ...bookingData,
        bookedDate: new Date().toISOString(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  },

  /**
   * Get all bookings for a specific user
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookings.push({
          id: doc.id,
          userId: data.userId,
          movieId: data.movieId,
          movieTitle: data.movieTitle,
          poster: data.poster,
          bookedDate: data.bookedDate?.toDate().toISOString() || new Date().toISOString(),
          status: data.status,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          paymentMethod: data.paymentMethod,
          seats: data.seats || [],
          totalPrice: data.totalPrice || 0,
          showtime: data.showtime,
        });
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  },

  /**
   * Update booking status (e.g., cancel booking)
   */
  async updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed'): Promise<void> {
    try {
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
      await updateDoc(bookingRef, { status });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  },

  /**
   * Get all bookings (admin function)
   */
  async getAllBookings(): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookings.push({
          id: doc.id,
          userId: data.userId,
          movieId: data.movieId,
          movieTitle: data.movieTitle,
          poster: data.poster,
          bookedDate: data.bookedDate?.toDate().toISOString() || new Date().toISOString(),
          status: data.status,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          paymentMethod: data.paymentMethod,
          seats: data.seats || [],
          totalPrice: data.totalPrice || 0,
          showtime: data.showtime,
        });
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  },
};
