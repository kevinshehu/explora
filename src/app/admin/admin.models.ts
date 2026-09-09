export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type BookingSource = 'whatsapp' | 'website' | 'phone' | 'walk-in' | 'other';
export type PriceType = 'fixed' | 'per-person' | 'per-day' | 'custom';
export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

export interface DashboardMetric {
  label: string;
  value: number;
  hint?: string;
}

export interface ReservationSummary {
  id: string;
  reservationCode: string;
  customerName: string;
  destinationName: string;
  tourName: string;
  reservationDate: string;
  startTime?: string | null;
  endTime?: string | null;
  totalGuests: number;
  status: ReservationStatus;
  totalPrice: number;
  currency: string;
  bookingSource: BookingSource;
}

export interface DashboardBreakdownItem {
  label: string;
  value: number;
  color?: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  statusBreakdown: DashboardBreakdownItem[];
  destinationBreakdown: DashboardBreakdownItem[];
  tourBreakdown: DashboardBreakdownItem[];
  upcomingReservations: ReservationSummary[];
}

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

export interface DestinationRecord {
  id: string;
  name: string;
  location: string;
  description: string;
  category: string;
  image: string;
  startingPrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourRecord {
  id: string;
  name: string;
  destinationId: string;
  destinationName?: string;
  description: string;
  duration: string;
  price: number;
  priceType: PriceType;
  availableDays: string[];
  maximumGuests: number;
  images: string[];
  category: string;
  active: boolean;
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
  destinationId: string;
  destinationName: string;
  tourId: string;
  tourName: string;
  reservationDate: string;
  startTime: string | null;
  endTime: string | null;
  numberOfDays: number | null;
  adults: number;
  children: number;
  totalGuests: number;
  basePrice: number;
  pricePerPerson: number;
  additionalCosts: number;
  discount: number;
  totalPrice: number;
  currency: string;
  status: ReservationStatus;
  bookingSource: BookingSource;
  pickupLocation: string;
  customerNotes: string;
  internalNotes: string;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationFilters {
  query?: string;
  status?: ReservationStatus | 'all';
  destinationId?: string | 'all';
  tourId?: string | 'all';
  bookingSource?: BookingSource | 'all';
  from?: string;
  to?: string;
}

export interface ReservationUpsertPayload {
  id?: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  destinationId: string;
  tourId: string;
  reservationDate: string;
  startTime: string | null;
  endTime: string | null;
  numberOfDays: number | null;
  adults: number;
  children: number;
  totalGuests: number;
  basePrice: number;
  pricePerPerson: number;
  additionalCosts: number;
  discount: number;
  totalPrice: number;
  currency: string;
  status: ReservationStatus;
  bookingSource: BookingSource;
  pickupLocation: string;
  customerNotes: string;
  internalNotes: string;
  specialRequests: string;
}

export interface CustomerUpsertPayload {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  notes: string;
}

export interface DestinationUpsertPayload {
  id?: string;
  name: string;
  location: string;
  description: string;
  category: string;
  image: string;
  startingPrice: number;
  active: boolean;
}

export interface TourUpsertPayload {
  id?: string;
  name: string;
  destinationId: string;
  description: string;
  duration: string;
  price: number;
  priceType: PriceType;
  availableDays: string[];
  maximumGuests: number;
  images: string[];
  category: string;
  active: boolean;
}