import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/types';
import { Seat, SeatStatus } from '../../types/seat.types';
import { SeatInfo } from '../../types/booking.types';

type SeatSelectionScreenRouteProp = RouteProp<RootStackParamList, 'SeatSelection'>;
type SeatSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SeatSelection'>;

const REGULAR_PRICE = 50000; // 50k VND
const VIP_PRICE = 100000; // 100k VND

const SeatSelectionScreen = () => {
  const navigation = useNavigation<SeatSelectionScreenNavigationProp>();
  const route = useRoute<SeatSelectionScreenRouteProp>();

  const { movieId, movieTitle, poster } = route.params;

  // Generate mock seat layout
  const [seats, setSeats] = useState<Seat[]>(() => {
    const seatLayout: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    rows.forEach((row, rowIndex) => {
      for (let number = 1; number <= 10; number++) {
        // VIP rows are E, F, G, H
        const isVip = rowIndex >= 4;
        // Random occupied seats (30% occupied)
        const isOccupied = Math.random() < 0.3;

        seatLayout.push({
          id: `${row}${number}`,
          row,
          number,
          status: isOccupied ? 'occupied' : 'available',
          type: isVip ? 'vip' : 'regular',
          price: isVip ? VIP_PRICE : REGULAR_PRICE,
        });
      }
    });

    return seatLayout;
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Toggle seat selection
  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'occupied') {
      return; // Can't select occupied seats
    }

    setSelectedSeats((prev) => {
      if (prev.includes(seat.id)) {
        // Deselect seat
        return prev.filter((id) => id !== seat.id);
      } else {
        // Select seat (max 8 seats)
        if (prev.length >= 8) {
          Alert.alert('Limit Reached', 'You can only select up to 8 seats');
          return prev;
        }
        return [...prev, seat.id];
      }
    });
  };

  // Get seat status for rendering
  const getSeatStatus = (seat: Seat): SeatStatus => {
    if (seat.status === 'occupied') return 'occupied';
    if (selectedSeats.includes(seat.id)) return 'selected';
    return 'available';
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  }, [selectedSeats, seats]);

  // Get selected seats info
  const selectedSeatsInfo: SeatInfo[] = useMemo(() => {
    return selectedSeats
      .map((seatId) => {
        const seat = seats.find((s) => s.id === seatId);
        if (!seat) return null;
        return {
          seatId: seat.id,
          row: seat.row,
          number: seat.number,
          type: seat.type,
          price: seat.price,
        };
      })
      .filter((s): s is SeatInfo => s !== null);
  }, [selectedSeats, seats]);

  // Continue to payment
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat');
      return;
    }

    navigation.navigate('Payment', {
      movieId,
      movieTitle,
      poster,
      seats: selectedSeatsInfo,
      totalPrice,
    });
  };

  // Group seats by row
  const seatsByRow = useMemo(() => {
    const grouped: { [key: string]: Seat[] } = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
    });
    return grouped;
  }, [seats]);

  const rows = Object.keys(seatsByRow).sort();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Seats</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Movie Title */}
        <Text style={styles.movieTitle}>{movieTitle}</Text>

        {/* Screen indicator */}
        <View style={styles.screenContainer}>
          <View style={styles.screen} />
          <Text style={styles.screenLabel}>SCREEN</Text>
        </View>

        {/* Seat Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.availableSeat]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.selectedSeat]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.occupiedSeat]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.vipSeat]} />
            <Text style={styles.legendText}>VIP</Text>
          </View>
        </View>

        {/* Seat Grid */}
        <View style={styles.seatGrid}>
          {rows.map((row) => (
            <View key={row} style={styles.seatRow}>
              {/* Row label */}
              <Text style={styles.rowLabel}>{row}</Text>

              {/* Seats */}
              <View style={styles.seatsContainer}>
                {seatsByRow[row].map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <TouchableOpacity
                      key={seat.id}
                      style={[
                        styles.seat,
                        seat.type === 'vip' && styles.vipSeat,
                        status === 'selected' && styles.selectedSeat,
                        status === 'occupied' && styles.occupiedSeat,
                        status === 'available' && styles.availableSeat,
                      ]}
                      onPress={() => handleSeatPress(seat)}
                      disabled={status === 'occupied'}
                    >
                      <Text
                        style={[
                          styles.seatNumber,
                          status === 'occupied' && styles.occupiedText,
                        ]}
                      >
                        {seat.number}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Price Info */}
        <View style={styles.priceInfo}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Regular Seat:</Text>
            <Text style={styles.priceValue}>
              {REGULAR_PRICE.toLocaleString('vi-VN')} VND
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>VIP Seat:</Text>
            <Text style={styles.priceValue}>{VIP_PRICE.toLocaleString('vi-VN')} VND</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <View>
            <Text style={styles.selectedCount}>
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
            </Text>
            {selectedSeats.length > 0 && (
              <Text style={styles.selectedSeatsText}>
                {selectedSeats.sort().join(', ')}
              </Text>
            )}
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')} VND</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, selectedSeats.length === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 24,
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  screen: {
    width: '80%',
    height: 4,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
    marginBottom: 8,
  },
  screenLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendSeat: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  seatGrid: {
    marginBottom: 24,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 24,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  seatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  availableSeat: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderColor: COLORS.TEXT_SECONDARY,
  },
  selectedSeat: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  occupiedSeat: {
    backgroundColor: COLORS.TEXT_SECONDARY,
    borderColor: COLORS.TEXT_SECONDARY,
    opacity: 0.5,
  },
  vipSeat: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  seatNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  occupiedText: {
    color: COLORS.BACKGROUND,
  },
  priceInfo: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.BACKGROUND,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  selectedSeatsText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  continueButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default SeatSelectionScreen;
