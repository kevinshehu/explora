import { BookingSource, ReservationStatus } from './admin.models';

export const ADMIN_STORAGE_KEY = 'explora-admin-session';
export const ADMIN_USERNAME_KEY = 'explora-admin-username';

export const ADMIN_NAVIGATION = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'space_dashboard' },
  { label: 'Reservations', path: '/admin/reservations', icon: 'event_note' },
  { label: 'Calendar', path: '/admin/calendar', icon: 'calendar_month' },
  { label: 'Customers', path: '/admin/customers', icon: 'group' },
  { label: 'Destinations', path: '/admin/destinations', icon: 'location_on' },
  { label: 'Tours / Experiences', path: '/admin/tours', icon: 'explore' },
  { label: 'Settings', path: '/admin/settings', icon: 'settings' },
] as const;

export const RESERVATION_STATUS_OPTIONS: Array<{ label: string; value: ReservationStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const BOOKING_SOURCE_OPTIONS: Array<{ label: string; value: BookingSource | 'all' }> = [
  { label: 'All sources', value: 'all' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Website', value: 'website' },
  { label: 'Phone', value: 'phone' },
  { label: 'Walk-in', value: 'walk-in' },
  { label: 'Other', value: 'other' },
];

export const CURRENCY_OPTIONS = ['EUR', 'USD', 'ALL'];

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};