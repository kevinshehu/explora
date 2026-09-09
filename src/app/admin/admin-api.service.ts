import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
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
  private readonly baseUrl = environment.adminApiBase;

  listReservations(filters: { query?: string; status?: ReservationStatus | 'all'; from?: string; to?: string } = {}) {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '' || value === 'all') {
        continue;
      }

      params = params.set(key, String(value));
    }

    return this.http.get<ReservationRecord[]>(`${this.baseUrl}/reservations`, { params });
  }

  getReservation(id: string) {
    return this.http.get<ReservationRecord>(`${this.baseUrl}/reservations/${id}`);
  }

  createReservation(payload: ReservationUpsertPayload) {
    return this.http.post<ReservationRecord>(`${this.baseUrl}/reservations`, payload);
  }

  updateReservation(id: string, payload: Partial<ReservationUpsertPayload>) {
    return this.http.patch<ReservationRecord>(`${this.baseUrl}/reservations/${id}`, payload);
  }

  deleteReservation(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/reservations/${id}`);
  }

  listCustomers(query?: string) {
    const params = query ? new HttpParams().set('query', query) : undefined;
    return this.http.get<CustomerRecord[]>(`${this.baseUrl}/customers`, { params });
  }

  getCustomer(id: string) {
    return this.http.get<CustomerRecord>(`${this.baseUrl}/customers/${id}`);
  }

  createCustomer(payload: CustomerUpsertPayload) {
    return this.http.post<CustomerRecord>(`${this.baseUrl}/customers`, payload);
  }

  updateCustomer(id: string, payload: Partial<CustomerUpsertPayload>) {
    return this.http.patch<CustomerRecord>(`${this.baseUrl}/customers/${id}`, payload);
  }

  deleteCustomer(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/customers/${id}`);
  }
}
