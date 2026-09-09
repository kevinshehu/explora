import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CustomerRecord,
  CustomerUpsertPayload,
  ReservationRecord,
  ReservationUpsertPayload,
  ReservationStatus,
} from './admin.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  listReservations(filters: { query?: string; status?: ReservationStatus | 'all'; from?: string; to?: string } = {}) {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '' || value === 'all') {
        continue;
      }

      params = params.set(key, String(value));
    }

    return this.http.get<ReservationRecord[]>('/api/admin/reservations', { params });
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

  deleteCustomer(id: string) {
    return this.http.delete<void>(`/api/admin/customers/${id}`);
  }
}
