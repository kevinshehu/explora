import { ReservationStatus } from './admin.models';

export const ADMIN_STORAGE_KEY = 'explora-admin-session';
export const ADMIN_USERNAME_KEY = 'explora-admin-username';

export const ADMIN_NAVIGATION = [
  { label: 'Calendar', path: '/admin/calendar', icon: 'calendar_month' },
  { label: 'Customers', path: '/admin/customers', icon: 'group' },
] as const;

export const RESERVATION_STATUS_OPTIONS: Array<{ label: string; value: ReservationStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const CURRENCY_OPTIONS = ['EUR', 'USD', 'ALL'];

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};