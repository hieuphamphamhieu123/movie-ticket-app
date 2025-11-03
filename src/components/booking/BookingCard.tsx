import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Booking } from '../../types/booking.types';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const formattedDate = format(new Date(booking.bookedDate), 'MMM dd, yyyy');
  const formattedTime = format(new Date(booking.bookedDate), 'hh:mm a');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return COLORS.SUCCESS;
      case 'cancelled':
        return COLORS.ERROR;
      case 'completed':
        return COLORS.TEXT_SECONDARY;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Movie Poster */}
        <Image source={{ uri: booking.poster }} style={styles.poster} resizeMode="cover" />

        {/* Booking Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {booking.movieTitle}
          </Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.detailText}>{formattedTime}</Text>
          </View>

          {booking.seats && booking.seats.length > 0 && (
            <View style={styles.detailRow}>
              <Ionicons name="airplane-outline" size={16} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.detailText}>
                Seats: {booking.seats.map((s) => `${s.row}${s.number}`).join(', ')}
              </Text>
            </View>
          )}

          {booking.totalPrice && (
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={16} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.detailText}>
                {booking.totalPrice.toLocaleString('vi-VN')} VND
              </Text>
            </View>
          )}

          {booking.paymentMethod && (
            <View style={styles.detailRow}>
              <Ionicons
                name={booking.paymentMethod === 'credit_card' ? 'card-outline' : 'logo-paypal'}
                size={16}
                color={COLORS.TEXT_SECONDARY}
              />
              <Text style={styles.detailText}>
                {booking.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}
              </Text>
            </View>
          )}

          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
              <Ionicons name={getStatusIcon(booking.status)} size={16} color={getStatusColor(booking.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cancel Button (only for confirmed bookings) */}
      {booking.status === 'confirmed' && onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => onCancel(booking.id)}>
          <Ionicons name="close-circle-outline" size={20} color={COLORS.ERROR} />
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  content: {
    flexDirection: 'row',
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ERROR,
  },
});

export default BookingCard;
