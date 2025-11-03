import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBookingThunk } from '../../store/slices/bookingSlice';

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

type PaymentMethodType = 'credit_card' | 'paypal';

const PaymentScreen = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const route = useRoute<PaymentScreenRouteProp>();
  const dispatch = useAppDispatch();

  const { movieId, movieTitle, poster, seats, totalPrice } = route.params;
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.booking);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [errors, setErrors] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  // Format expiration date (MM/YY)
  const formatExpirationDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    if (cleaned.length <= 16) {
      setCardNumber(formatCardNumber(cleaned));
      if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpirationDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      setExpirationDate(formatExpirationDate(cleaned));
      if (errors.expirationDate) setErrors({ ...errors, expirationDate: '' });
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setCvv(cleaned);
      if (errors.cvv) setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    };

    // Validate card number (16 digits)
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    } else if (!/^\d+$/.test(cleanedCardNumber)) {
      newErrors.cardNumber = 'Card number must contain only digits';
    }

    // Validate expiration date (MM/YY format)
    if (!expirationDate) {
      newErrors.expirationDate = 'Expiration date is required';
    } else if (expirationDate.length !== 5) {
      newErrors.expirationDate = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = expirationDate.split('/');
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt('20' + year, 10);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (monthNum < 1 || monthNum > 12) {
        newErrors.expirationDate = 'Invalid month';
      } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        newErrors.expirationDate = 'Card has expired';
      }
    }

    // Validate CVV (3 digits)
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return !newErrors.cardNumber && !newErrors.expirationDate && !newErrors.cvv;
  };

  const handleConfirmPayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to make a booking');
      return;
    }

    try {
      // Mock payment processing with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking
      const bookingData = {
        userId: user.id,
        movieId,
        movieTitle,
        poster,
        paymentMethod: selectedMethod,
        seats,
        totalPrice,
      };

      const result = await dispatch(createBookingThunk(bookingData)).unwrap();

      // Show success message
      Alert.alert(
        'Payment Successful!',
        `Your booking for "${movieTitle}" has been confirmed.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to Bookings tab
              navigation.navigate('MainTabs', { screen: 'BookingsTab' });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Payment Failed', error || 'An error occurred while processing your payment');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      {/* Movie Info */}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movieTitle}</Text>
      </View>

      {/* Booking Summary */}
      <View style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Selected Seats:</Text>
          <Text style={styles.summaryValue}>
            {seats.map((s) => `${s.row}${s.number}`).join(', ')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Number of Tickets:</Text>
          <Text style={styles.summaryValue}>{seats.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={[styles.summaryValue, styles.totalAmount]}>
            {totalPrice.toLocaleString('vi-VN')} VND
          </Text>
        </View>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Payment</Text>

      {/* Payment Method Selection */}
      <Text style={styles.label}>Choose Payment Method:</Text>

      <View style={styles.paymentMethods}>
        {/* Credit Card */}
        <TouchableOpacity
          style={[
            styles.paymentMethodButton,
            selectedMethod === 'credit_card' && styles.paymentMethodButtonSelected,
          ]}
          onPress={() => setSelectedMethod('credit_card')}
        >
          <Ionicons
            name="card"
            size={24}
            color={selectedMethod === 'credit_card' ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
          />
          <Text
            style={[
              styles.paymentMethodText,
              selectedMethod === 'credit_card' && styles.paymentMethodTextSelected,
            ]}
          >
            Credit Card
          </Text>
        </TouchableOpacity>

        {/* PayPal (Disabled) */}
        <TouchableOpacity style={[styles.paymentMethodButton, styles.paymentMethodButtonDisabled]} disabled>
          <Ionicons name="logo-paypal" size={24} color={COLORS.TEXT_SECONDARY} />
          <Text style={[styles.paymentMethodText, styles.paymentMethodTextDisabled]}>PayPal</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Form */}
      {selectedMethod === 'credit_card' && (
        <View style={styles.form}>
          {/* Card Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={[styles.input, errors.cardNumber && styles.inputError]}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19} // 16 digits + 3 spaces
            />
            {errors.cardNumber ? <Text style={styles.errorText}>{errors.cardNumber}</Text> : null}
          </View>

          {/* Expiration Date and CVV */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Expiration Date</Text>
              <TextInput
                style={[styles.input, errors.expirationDate && styles.inputError]}
                placeholder="MM/YY"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={expirationDate}
                onChangeText={handleExpirationDateChange}
                keyboardType="numeric"
                maxLength={5}
              />
              {errors.expirationDate ? <Text style={styles.errorText}>{errors.expirationDate}</Text> : null}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError]}
                placeholder="123"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={cvv}
                onChangeText={handleCvvChange}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
              {errors.cvv ? <Text style={styles.errorText}>{errors.cvv}</Text> : null}
            </View>
          </View>
        </View>
      )}

      {/* Confirm Payment Button */}
      <TouchableOpacity
        style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
        onPress={handleConfirmPayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.TEXT_PRIMARY} />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  movieInfo: {
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  bookingSummary: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD_BACKGROUND,
    gap: 8,
  },
  paymentMethodButtonSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
  },
  paymentMethodButtonDisabled: {
    opacity: 0.5,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  paymentMethodTextSelected: {
    color: COLORS.PRIMARY,
  },
  paymentMethodTextDisabled: {
    color: COLORS.TEXT_SECONDARY,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default PaymentScreen;
