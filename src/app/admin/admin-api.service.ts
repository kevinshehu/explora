import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CustomerRecord,
  CustomerUpsertPayload,
  DashboardData,
  DestinationRecord,
  DestinationUpsertPayload,
  ReservationFilters,
  ReservationRecord,
  ReservationUpsertPayload,
  TourRecord,
  TourUpsertPayload,
} from './admin.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  getDashboard() {
    return this.http.get<DashboardData>('/api/admin/dashboard');
  }

  listReservations(filters: ReservationFilters = {}) {
    return this.http.get<ReservationRecord[]>('/api/admin/reservations', {
      params: this.buildReservationParams(filters),
    });
  }

  getReservation(id: string) {
    return this.http.get<ReservationRecord>(`/api/admin/reservations/${id}`);
  }

  createReservation(payload: ReservationUpsertPayload) {
    return this.http.post<ReservationRecord>('/api/admin/reservations', payload);
  }

  updateReservation(id: string, payload: Partial<ReservationUpsertPayload>) {
    return this.http.patch<ReservationRecord>(`/api/admin/reservations/${id}`, payload);
  }

  deleteReservation(id: string) {
    return this.http.delete<void>(`/api/admin/reservations/${id}`);
  }

  listCustomers(query?: string) {
    const params = query ? new HttpParams().set('query', query) : undefined;
    return this.http.get<CustomerRecord[]>('/api/admin/customers', { params });
  }

  getCustomer(id: string) {
    return this.http.get<CustomerRecord>(`/api/admin/customers/${id}`);
  }

  createCustomer(payload: CustomerUpsertPayload) {
    return this.http.post<CustomerRecord>('/api/admin/customers', payload);
  }

  updateCustomer(id: string, payload: Partial<CustomerUpsertPayload>) {
    return this.http.patch<CustomerRecord>(`/api/admin/customers/${id}`, payload);
  }

  listDestinations() {
    return this.http.get<DestinationRecord[]>('/api/admin/destinations');
  }

  createDestination(payload: DestinationUpsertPayload) {
    return this.http.post<DestinationRecord>('/api/admin/destinations', payload);
  }

  updateDestination(id: string, payload: Partial<DestinationUpsertPayload>) {
    return this.http.patch<DestinationRecord>(`/api/admin/destinations/${id}`, payload);
  }

  deleteDestination(id: string) {
    return this.http.delete<void>(`/api/admin/destinations/${id}`);
  }

  listTours() {
    return this.http.get<TourRecord[]>('/api/admin/tours');
  }

  createTour(payload: TourUpsertPayload) {
    return this.http.post<TourRecord>('/api/admin/tours', payload);
  }

  updateTour(id: string, payload: Partial<TourUpsertPayload>) {
    return this.http.patch<TourRecord>(`/api/admin/tours/${id}`, payload);
  }

  deleteTour(id: string) {
    return this.http.delete<void>(`/api/admin/tours/${id}`);
  }

  private buildReservationParams(filters: ReservationFilters): HttpParams {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '' || value === 'all') {
        continue;
      }

      params = params.set(key, value);
    }

    return params;
  }
}