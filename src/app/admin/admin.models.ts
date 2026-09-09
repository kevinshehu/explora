export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

export interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationRecord {
  id: string;
  reservationCode: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  reservationDate: string;
  startTime: string | null;
  endTime: string | null;
  adults: number;
  children: number;
  totalGuests: number;
  place: string;
  tourName: string;
  status: ReservationStatus;
  pickupLocation: string;
  notes: string;
  price: number;
  additionalCosts: number;
  discount: number;
  totalPrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationUpsertPayload {
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  reservationDate: string;
  startTime: string | null;
  endTime: string | null;
  adults: number;
  children: number;
  totalGuests: number;
  place: string;
  tourName: string;
  status: ReservationStatus;
  pickupLocation: string;
  notes: string;
  price: number;
  additionalCosts: number;
  discount: number;
  totalPrice: number;
  currency: string;
}

export interface CustomerUpsertPayload {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  notes: string;
}
