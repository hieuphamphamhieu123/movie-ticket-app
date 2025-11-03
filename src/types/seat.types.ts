// Seat types for cinema seat selection

export type SeatStatus = 'available' | 'selected' | 'occupied';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: 'regular' | 'vip';
  price: number;
}

export interface SeatRow {
  row: string;
  seats: Seat[];
}

export interface SeatLayout {
  rows: SeatRow[];
  totalSeats: number;
  availableSeats: number;
}

export interface SelectedSeatInfo {
  seatId: string;
  row: string;
  number: number;
  type: 'regular' | 'vip';
  price: number;
}
