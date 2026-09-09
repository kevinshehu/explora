import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminApiService } from '../admin-api.service';
import { BOOKING_SOURCE_OPTIONS, RESERVATION_STATUS_LABELS, RESERVATION_STATUS_OPTIONS } from '../admin.constants';
import {
  CustomerRecord,
  DestinationRecord,
  ReservationRecord,
  ReservationUpsertPayload,
  TourRecord,
} from '../admin.models';

@Component({
  standalone: true,
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Reservations</p>
          <h1>Manage bookings</h1>
        </div>
        <a routerLink="/admin/calendar" class="admin-button admin-button--secondary">Open calendar</a>
      </div>

      <article class="admin-card admin-panel-card">
        <h2>Create reservation</h2>
        <form class="admin-form-grid admin-form-grid--wide" [formGroup]="reservationForm" (ngSubmit)="createReservation()">
          <label>
            <span>Existing customer</span>
            <select formControlName="customerId">
              <option value="">Reuse customer if available</option>
              @for (customer of customers(); track customer.id) {
                <option [value]="customer.id">{{ customer.fullName }} · {{ customer.email }}</option>
              }
            </select>
          </label>
          <label>
            <span>Full name</span>
            <input formControlName="customerName" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" formControlName="email" />
          </label>
          <label>
            <span>Phone</span>
            <input formControlName="phone" />
          </label>
          <label>
            <span>WhatsApp</span>
            <input formControlName="whatsapp" />
          </label>
          <label>
            <span>Destination</span>
            <select formControlName="destinationId" (change)="syncTourOptions()">
              <option value="">Select destination</option>
              @for (destination of destinations(); track destination.id) {
                <option [value]="destination.id">{{ destination.name }}</option>
              }
            </select>
          </label>
          <label>
            <span>Tour / experience</span>
            <select formControlName="tourId">
              <option value="">Select tour</option>
              @for (tour of filteredTours(); track tour.id) {
                <option [value]="tour.id">{{ tour.name }}</option>
              }
            </select>
          </label>
          <label>
            <span>Date</span>
            <input type="date" formControlName="reservationDate" />
          </label>
          <label>
            <span>Start time</span>
            <input type="time" formControlName="startTime" />
          </label>
          <label>
            <span>End time</span>
            <input type="time" formControlName="endTime" />
          </label>
          <label>
            <span>Adults</span>
            <input type="number" min="0" formControlName="adults" />
          </label>
          <label>
            <span>Children</span>
            <input type="number" min="0" formControlName="children" />
          </label>
          <label>
            <span>Total guests</span>
            <input type="number" min="1" formControlName="totalGuests" />
          </label>
          <label>
            <span>Base price</span>
            <input type="number" min="0" formControlName="basePrice" />
          </label>
          <label>
            <span>Price per person</span>
            <input type="number" min="0" formControlName="pricePerPerson" />
          </label>
          <label>
            <span>Additional costs</span>
            <input type="number" min="0" formControlName="additionalCosts" />
          </label>
          <label>
            <span>Discount</span>
            <input type="number" min="0" formControlName="discount" />
          </label>
          <label>
            <span>Total price</span>
            <input type="number" min="0" formControlName="totalPrice" />
          </label>
          <label>
            <span>Currency</span>
            <select formControlName="currency">
              @for (currency of currencies; track currency) {
                <option [value]="currency">{{ currency }}</option>
              }
            </select>
          </label>
          <label>
            <span>Status</span>
            <select formControlName="status">
              @for (status of statusOptions; track status.value) {
                <option [value]="status.value">{{ status.label }}</option>
              }
            </select>
          </label>
          <label>
            <span>Booking source</span>
            <select formControlName="bookingSource">
              @for (source of bookingSourceOptions; track source.value) {
                <option [value]="source.value">{{ source.label }}</option>
              }
            </select>
          </label>
          <label>
            <span>Pickup location</span>
            <input formControlName="pickupLocation" />
          </label>
          <label>
            <span>Customer notes</span>
            <textarea rows="3" formControlName="customerNotes"></textarea>
          </label>
          <label>
            <span>Internal admin notes</span>
            <textarea rows="3" formControlName="internalNotes"></textarea>
          </label>
          <label>
            <span>Special requests</span>
            <textarea rows="3" formControlName="specialRequests"></textarea>
          </label>
          <div class="admin-form-actions">
            <button class="admin-button admin-button--primary" type="submit">Create reservation</button>
          </div>
        </form>
      </article>

      <article class="admin-card admin-panel-card">
        <div class="admin-table-toolbar">
          <h2>Reservation list</h2>
          <button type="button" class="admin-button admin-button--ghost" (click)="reload()">Reload</button>
        </div>

        <form class="admin-filter-grid" [formGroup]="filterForm">
          <label>
            <span>Search</span>
            <input formControlName="query" placeholder="Search customer, tour, reservation code" />
          </label>
          <label>
            <span>Status</span>
            <select formControlName="status">
              @for (status of statusOptions; track status.value) {
                <option [value]="status.value">{{ status.label }}</option>
              }
            </select>
          </label>
          <label>
            <span>Destination</span>
            <select formControlName="destinationId">
              <option value="all">All destinations</option>
              @for (destination of destinations(); track destination.id) {
                <option [value]="destination.id">{{ destination.name }}</option>
              }
            </select>
          </label>
          <label>
            <span>Tour</span>
            <select formControlName="tourId">
              <option value="all">All tours</option>
              @for (tour of tours(); track tour.id) {
                <option [value]="tour.id">{{ tour.name }}</option>
              }
            </select>
          </label>
          <label>
            <span>Booking source</span>
            <select formControlName="bookingSource">
              @for (source of bookingSourceOptions; track source.value) {
                <option [value]="source.value">{{ source.label }}</option>
              }
            </select>
          </label>
          <label>
            <span>Date from</span>
            <input type="date" formControlName="from" />
          </label>
          <label>
            <span>Date to</span>
            <input type="date" formControlName="to" />
          </label>
        </form>

        <div class="admin-table-scroll">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Reservation</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Tour</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (reservation of filteredReservations(); track reservation.id) {
                <tr>
                  <td>{{ reservation.reservationCode }}</td>
                  <td>{{ reservation.customerName }}</td>
                  <td>{{ reservation.destinationName }}</td>
                  <td>{{ reservation.tourName }}</td>
                  <td>{{ reservation.reservationDate }}</td>
                  <td>{{ reservation.totalGuests }}</td>
                  <td>{{ reservation.totalPrice | currency:reservation.currency }}</td>
                  <td><span class="admin-status-badge admin-status-badge--{{ reservation.status }}">{{ statusLabel(reservation.status) }}</span></td>
                  <td>{{ reservation.bookingSource }}</td>
                  <td>
                    <a class="admin-inline-link" [routerLink]="['/admin/reservations', reservation.id]">Open</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
})
export class AdminReservationsPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusOptions = RESERVATION_STATUS_OPTIONS;
  readonly bookingSourceOptions = BOOKING_SOURCE_OPTIONS;
  readonly currencies = ['EUR', 'USD', 'ALL'];

  readonly customers = signal<CustomerRecord[]>([]);
  readonly destinations = signal<DestinationRecord[]>([]);
  readonly tours = signal<TourRecord[]>([]);
  readonly reservations = signal<ReservationRecord[]>([]);

  readonly filteredTours = computed(() => {
    const destinationId = this.reservationForm.controls.destinationId.value;
    if (!destinationId) {
      return this.tours();
    }
    return this.tours().filter((tour) => tour.destinationId === destinationId);
  });

  readonly filteredReservations = computed(() => {
    const filters = this.filterForm.getRawValue();
    return this.reservations().filter((reservation) => {
      const matchesQuery = !filters.query || [reservation.reservationCode, reservation.customerName, reservation.tourName, reservation.destinationName].some((value) => value.toLowerCase().includes(filters.query.toLowerCase()));
      const matchesStatus = filters.status === 'all' || reservation.status === filters.status;
      const matchesDestination = filters.destinationId === 'all' || reservation.destinationId === filters.destinationId;
      const matchesTour = filters.tourId === 'all' || reservation.tourId === filters.tourId;
      const matchesSource = filters.bookingSource === 'all' || reservation.bookingSource === filters.bookingSource;
      const matchesFrom = !filters.from || reservation.reservationDate >= filters.from;
      const matchesTo = !filters.to || reservation.reservationDate <= filters.to;
      return matchesQuery && matchesStatus && matchesDestination && matchesTour && matchesSource && matchesFrom && matchesTo;
    });
  });

  readonly filterForm = this.fb.nonNullable.group({
    query: [''],
    status: ['all'],
    destinationId: ['all'],
    tourId: ['all'],
    bookingSource: ['all'],
    from: [''],
    to: [''],
  });

  readonly reservationForm = this.fb.nonNullable.group({
    customerId: [''],
    customerName: [''],
    email: [''],
    phone: [''],
    whatsapp: [''],
    destinationId: [''],
    tourId: [''],
    reservationDate: [''],
    startTime: [''],
    endTime: [''],
    adults: [2],
    children: [0],
    totalGuests: [2],
    basePrice: [0],
    pricePerPerson: [0],
    additionalCosts: [0],
    discount: [0],
    totalPrice: [0],
    currency: ['EUR'],
    status: ['pending'],
    bookingSource: ['whatsapp'],
    pickupLocation: [''],
    customerNotes: [''],
    internalNotes: [''],
    specialRequests: [''],
  });

  ngOnInit(): void {
    this.reload();
    this.api.listDestinations().subscribe((items) => this.destinations.set(items));
    this.api.listTours().subscribe((items) => this.tours.set(items));
    this.api.listCustomers().subscribe((items) => this.customers.set(items));

    this.reservationForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const adults = Number(value.adults ?? 0);
      const children = Number(value.children ?? 0);
      const totalGuests = Math.max(1, adults + children);
      const totalPrice = this.calculateTotal({
        basePrice: Number(value.basePrice ?? 0),
        pricePerPerson: Number(value.pricePerPerson ?? 0),
        totalGuests,
        additionalCosts: Number(value.additionalCosts ?? 0),
        discount: Number(value.discount ?? 0),
      });

      this.reservationForm.controls.totalGuests.setValue(totalGuests, { emitEvent: false });
      this.reservationForm.controls.totalPrice.setValue(totalPrice, { emitEvent: false });
    });
  }

  reload(): void {
    this.api.listReservations().subscribe((items) => this.reservations.set(items));
  }

  syncTourOptions(): void {
    const destinationId = this.reservationForm.controls.destinationId.value;
    const matchingTour = this.filteredTours()[0];
    if (destinationId && matchingTour) {
      this.reservationForm.controls.tourId.setValue(matchingTour.id);
    }
  }

  createReservation(): void {
    const payload = this.toPayload(this.reservationForm.getRawValue());
    this.api.createReservation(payload).subscribe((created) => {
      this.reservations.update((items) => [created, ...items]);
      this.reservationForm.reset({
        customerId: '',
        customerName: '',
        email: '',
        phone: '',
        whatsapp: '',
        destinationId: '',
        tourId: '',
        reservationDate: '',
        startTime: '',
        endTime: '',
        adults: 2,
        children: 0,
        totalGuests: 2,
        basePrice: 0,
        pricePerPerson: 0,
        additionalCosts: 0,
        discount: 0,
        totalPrice: 0,
        currency: 'EUR',
        status: 'pending',
        bookingSource: 'whatsapp',
        pickupLocation: '',
        customerNotes: '',
        internalNotes: '',
        specialRequests: '',
      });
    });
  }

  statusLabel(status: string): string {
    return RESERVATION_STATUS_LABELS[status as keyof typeof RESERVATION_STATUS_LABELS] ?? status;
  }

  private calculateTotal(input: { basePrice: number; pricePerPerson: number; totalGuests: number; additionalCosts: number; discount: number }): number {
    return Math.max(0, input.basePrice + input.pricePerPerson * input.totalGuests + input.additionalCosts - input.discount);
  }

  private toPayload(value: Record<string, unknown>): ReservationUpsertPayload {
    const formValue = value as any;

    return {
      customerId: (formValue.customerId as string) || undefined,
      customerName: String(formValue.customerName ?? ''),
      email: String(formValue.email ?? ''),
      phone: String(formValue.phone ?? ''),
      whatsapp: String(formValue.whatsapp ?? ''),
      destinationId: String(formValue.destinationId ?? ''),
      tourId: String(formValue.tourId ?? ''),
      reservationDate: String(formValue.reservationDate ?? ''),
      startTime: (formValue.startTime as string) || null,
      endTime: (formValue.endTime as string) || null,
      numberOfDays: null,
      adults: Number(formValue.adults ?? 0),
      children: Number(formValue.children ?? 0),
      totalGuests: Number(formValue.totalGuests ?? 0),
      basePrice: Number(formValue.basePrice ?? 0),
      pricePerPerson: Number(formValue.pricePerPerson ?? 0),
      additionalCosts: Number(formValue.additionalCosts ?? 0),
      discount: Number(formValue.discount ?? 0),
      totalPrice: Number(formValue.totalPrice ?? 0),
      currency: String(formValue.currency ?? 'EUR'),
      status: formValue.status as any,
      bookingSource: formValue.bookingSource as any,
      pickupLocation: String(formValue.pickupLocation ?? ''),
      customerNotes: String(formValue.customerNotes ?? ''),
      internalNotes: String(formValue.internalNotes ?? ''),
      specialRequests: String(formValue.specialRequests ?? ''),
    };
  }
}