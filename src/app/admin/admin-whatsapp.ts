import { whatsappUrl } from '../shared/whatsapp';
import { ReservationRecord } from './admin.models';

function formatReservationDate(reservation: ReservationRecord): string {
  const date = new Date(`${reservation.reservationDate}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export function buildReservationWhatsAppMessage(reservation: ReservationRecord): string {
  return [
    `Hi! This is Explora regarding your ${reservation.tourName} reservation for ${formatReservationDate(reservation)} for ${reservation.totalGuests} guests.`,
    `We'd like to confirm your booking details.`,
  ].join(' ');
}

export function buildGeneralInquiryMessage(destinationName?: string): string {
  if (!destinationName) {
    return 'Hi! I would like more information about the available experiences in Southern Albania.';
  }

  return `Hi! I'm interested in visiting ${destinationName} and would like more information about the available experiences.`;
}

export function buildCalculatedTourMessage(tourName: string, totalGuests: number, estimatedPrice: number): string {
  return `Hi! I'm interested in the ${tourName} for ${totalGuests} guests. The estimated price is €${estimatedPrice.toFixed(0)}. I'd like to know the available dates.`;
}

export function buildSpecificBookingMessage(tourName: string, totalGuests: number, reservationDate: string, estimatedPrice: number): string {
  const date = new Date(`${reservationDate}T00:00:00`);
  const formatted = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  return `Hi! I'd like to book the ${tourName} for ${totalGuests} guests on ${formatted}. The estimated price is €${estimatedPrice.toFixed(0)}. Please confirm availability and the next steps.`;
}

export function buildReservationWhatsAppUrl(reservation: ReservationRecord): string {
  return whatsappUrl(buildReservationWhatsAppMessage(reservation));
}