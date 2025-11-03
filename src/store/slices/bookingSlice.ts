import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookingService } from '../../services/booking.service';
import { Booking, CreateBookingData, BookingState } from '../../types/booking.types';

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

// Async thunk to create a booking
export const createBookingThunk = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: CreateBookingData, { rejectWithValue }) => {
    try {
      console.log('<« Creating booking...');
      const result = await bookingService.createBooking(bookingData);
      console.log(' Booking created:', result);
      return result;
    } catch (error: any) {
      console.error('L Booking creation error:', error);
      return rejectWithValue(error.message || 'Failed to create booking');
    }
  }
);

// Async thunk to fetch user's bookings
export const fetchUserBookingsThunk = createAsyncThunk(
  'booking/fetchUserBookings',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('=Ë Fetching user bookings...');
      const bookings = await bookingService.getUserBookings(userId);
      console.log(` Found ${bookings.length} bookings`);
      return bookings;
    } catch (error: any) {
      console.error('L Error fetching bookings:', error);
      return rejectWithValue(error.message || 'Failed to fetch bookings');
    }
  }
);

// Async thunk to update booking status
export const updateBookingStatusThunk = createAsyncThunk(
  'booking/updateStatus',
  async (
    { bookingId, status }: { bookingId: string; status: 'confirmed' | 'cancelled' | 'completed' },
    { rejectWithValue }
  ) => {
    try {
      console.log('= Updating booking status...');
      await bookingService.updateBookingStatus(bookingId, status);
      console.log(' Booking status updated');
      return { bookingId, status };
    } catch (error: any) {
      console.error('L Error updating booking:', error);
      return rejectWithValue(error.message || 'Failed to update booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    clearBookings: (state) => {
      state.bookings = [];
    },
  },
  extraReducers: (builder) => {
    // Create booking
    builder.addCase(createBookingThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createBookingThunk.fulfilled, (state, action: PayloadAction<Booking>) => {
      state.isLoading = false;
      state.bookings.unshift(action.payload); // Add new booking to the beginning
    });
    builder.addCase(createBookingThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch user bookings
    builder.addCase(fetchUserBookingsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserBookingsThunk.fulfilled, (state, action: PayloadAction<Booking[]>) => {
      state.isLoading = false;
      state.bookings = action.payload;
    });
    builder.addCase(fetchUserBookingsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update booking status
    builder.addCase(updateBookingStatusThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      updateBookingStatusThunk.fulfilled,
      (state, action: PayloadAction<{ bookingId: string; status: string }>) => {
        state.isLoading = false;
        const booking = state.bookings.find((b) => b.id === action.payload.bookingId);
        if (booking) {
          booking.status = action.payload.status as 'confirmed' | 'cancelled' | 'completed';
        }
      }
    );
    builder.addCase(updateBookingStatusThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearBookingError, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
