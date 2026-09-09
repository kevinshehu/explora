import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { AdminApiService } from '../admin-api.service';
import { CURRENCY_OPTIONS, RESERVATION_STATUS_OPTIONS } from '../admin.constants';
import { CalendarViewMode, CustomerRecord, ReservationRecord, ReservationUpsertPayload } from '../admin.models';

@Component({
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Calendar</p>
          <h1>Reservations workspace</h1>
        </div>
        <div class="admin-topbar-actions">
          <button type="button" class="admin-button admin-button--secondary" (click)="goToday()">Today</button>
          <button type="button" class="admin-button admin-button--ghost" (click)="previous()">Previous</button>
          <button type="button" class="admin-button admin-button--ghost" (click)="next()">Next</button>
        </div>
      </div>

      <article class="admin-card admin-panel-card">
        <div class="admin-toolbar-row">
          <div class="admin-segmented-control">
            @for (mode of viewModes; track mode) {
              <button type="button" [class.is-active]="viewMode() === mode" (click)="viewMode.set(mode)">{{ mode }}</button>
            }
          </div>
          <strong>{{ calendarLabel() }}</strong>
        </div>

        @if (viewMode() === 'month') {
          <div class="admin-calendar-grid admin-calendar-grid--month">
            @for (day of weekdayLabels; track day) {
              <div class="admin-calendar-head">{{ day }}</div>
            }

            @for (day of monthDays(); track day.toISOString()) {
              <article class="admin-calendar-cell admin-calendar-cell--clickable" [class.is-muted]="!isCurrentMonth(day)" [class.is-today]="isToday(day)" (click)="openCreate(day)">
                <header class="admin-calendar-cell-header">
                  <strong>{{ day.getDate() }}</strong>
                  @if (isToday(day)) {
                    <span class="today-dot" aria-label="Today"></span>
                  }
                </header>

                <div class="admin-calendar-events">
                  @for (reservation of reservationsForDay(day); track reservation.id) {
                    <button type="button" class="admin-calendar-event admin-calendar-event--{{ reservation.status }}" (click)="$event.stopPropagation(); openEdit(reservation)">
                      <span>{{ reservation.startTime || 'All day' }}</span>
                      <strong>{{ reservation.customerName }}</strong>
                      <small>{{ reservation.tourName }} · {{ reservation.totalGuests }} guests</small>
                    </button>
                  }
                </div>
              </article>
            }
          </div>
        } @else if (viewMode() === 'week') {
          <div class="admin-calendar-stack">
            @for (day of weekDays(); track day.toISOString()) {
              <article class="admin-calendar-day-row admin-calendar-day-row--clickable" [class.is-today]="isToday(day)" (click)="openCreate(day)">
                <header class="admin-calendar-day-header">
                  <strong>{{ day | date:'EEE, MMM d' }}</strong>
                  @if (isToday(day)) {
                    <span class="today-dot" aria-label="Today"></span>
                  }
                </header>
                <div class="admin-calendar-events admin-calendar-events--row">
                  @for (reservation of reservationsForDay(day); track reservation.id) {
                    <button type="button" class="admin-calendar-event admin-calendar-event--{{ reservation.status }}" (click)="$event.stopPropagation(); openEdit(reservation)">
                      <strong>{{ reservation.customerName }}</strong>
                      <small>{{ reservation.tourName }} · {{ reservation.startTime || 'All day' }}</small>
                    </button>
                  }
                </div>
              </article>
            }
          </div>
        } @else if (viewMode() === 'day') {
          <article class="admin-calendar-day-view">
            <header class="admin-calendar-day-header">
              <strong>{{ selectedDate() | date:'EEEE, MMMM d, yyyy' }}</strong>
              @if (isToday(selectedDate())) {
                <span class="today-dot" aria-label="Today"></span>
              }
            </header>

            <div class="admin-slot-grid">
              @for (slot of daySlots; track slot) {
                <article class="admin-slot-row">
                  <button type="button" class="admin-slot-time" (click)="openCreate(selectedDate(), slot)">{{ slot }}</button>
                  <div class="admin-calendar-events admin-calendar-events--list">
                    @for (reservation of reservationsForSlot(selectedDate(), slot); track reservation.id) {
                      <button type="button" class="admin-calendar-event admin-calendar-event--{{ reservation.status }}" (click)="openEdit(reservation)">
                        <strong>{{ reservation.customerName }}</strong>
                        <small>{{ reservation.tourName }} · {{ reservation.place }} · {{ reservation.totalGuests }} guests</small>
                      </button>
                    }
                  </div>
                </article>
              }
            </div>
          </article>
        } @else {
          <div class="admin-list-stack">
            @for (reservation of agendaReservations(); track reservation.id) {
              <button type="button" class="admin-list-item" (click)="openEdit(reservation)">
                <div>
                  <strong>{{ reservation.customerName }}</strong>
                  <p>{{ reservation.tourName }} · {{ reservation.place }}</p>
                </div>
                <span>{{ reservation.reservationDate }} · {{ reservation.startTime || 'All day' }}</span>
              </button>
            }
          </div>
        }
      </article>
    </section>

    @if (isFormOpen()) {
      <div class="admin-modal-backdrop" (click)="closeForm()">
        <section class="admin-modal" (click)="$event.stopPropagation()">
          <header class="admin-modal-header">
            <div>
              <p class="admin-eyebrow">Reservation</p>
              <h2>{{ editingReservationId() ? 'Edit reservation' : 'New reservation' }}</h2>
            </div>
            <button type="button" class="admin-button admin-button--ghost" (click)="closeForm()">Close</button>
          </header>

          <form class="admin-form-grid admin-form-grid--wide" [formGroup]="reservationForm" (ngSubmit)="saveReservation()">
            <section class="admin-form-section admin-form-span-2">
              <header class="admin-form-section-header">
                <span>Client</span>
              </header>
              <div class="admin-form-section-grid">
                <label>
                  <span>Customer</span>
                  <select formControlName="customerId" (change)="applyCustomerSelection()">
                    <option value="">Select existing customer or enter details</option>
                    @for (customer of customers(); track customer.id) {
                      <option [value]="customer.id">{{ customer.fullName }} · {{ customer.phone }}</option>
                    }
                  </select>
                </label>
                <label>
                  <span>Customer name</span>
                  <input formControlName="customerName" />
                </label>
                <label>
                  <span>Phone / WhatsApp</span>
                  <input formControlName="phone" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" formControlName="email" />
                </label>
                <label>
                  <span>WhatsApp</span>
                  <input formControlName="whatsapp" />
                </label>
              </div>
            </section>

            <section class="admin-form-section admin-form-span-2">
              <header class="admin-form-section-header">
                <span>Dates & schedule</span>
              </header>
              <div class="admin-form-section-grid">
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
                  <span>Status</span>
                  <select formControlName="status">
                    @for (status of statusOptions; track status.value) {
                      <option [value]="status.value">{{ status.label }}</option>
                    }
                  </select>
                </label>
              </div>
            </section>

            <section class="admin-form-section admin-form-span-2">
              <header class="admin-form-section-header">
                <span>Trip details</span>
              </header>
              <div class="admin-form-section-grid">
                <label>
                  <span>Place</span>
                  <input formControlName="place" />
                </label>
                <label>
                  <span>Tour / experience name</span>
                  <input formControlName="tourName" />
                </label>
                <label>
                  <span>Pickup location</span>
                  <input formControlName="pickupLocation" />
                </label>
                <label class="admin-form-span-2">
                  <span>Notes</span>
                  <textarea rows="3" formControlName="notes"></textarea>
                </label>
              </div>
            </section>

            <section class="admin-form-section admin-form-span-2">
              <header class="admin-form-section-header">
                <span>Guests & pricing</span>
              </header>
              <div class="admin-form-section-grid">
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
                  <span>Price</span>
                  <input type="number" min="0" formControlName="price" />
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
              </div>
            </section>

            <div class="admin-form-actions">
              @if (editingReservationId()) {
                <button type="button" class="admin-button admin-button--ghost" (click)="removeReservation()">Delete reservation</button>
              }
              <button type="submit" class="admin-button admin-button--primary">{{ editingReservationId() ? 'Save changes' : 'Create reservation' }}</button>
            </div>
          </form>
        </section>
      </div>
    }
  `,
})
export class AdminCalendarPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);

  readonly viewModes: CalendarViewMode[] = ['month', 'week', 'day', 'agenda'];
  readonly viewMode = signal<CalendarViewMode>('month');
  readonly selectedDate = signal(new Date());
  readonly reservations = signal<ReservationRecord[]>([]);
  readonly customers = signal<CustomerRecord[]>([]);

  readonly isFormOpen = signal(false);
  readonly editingReservationId = signal<string | null>(null);

  readonly statusOptions = RESERVATION_STATUS_OPTIONS.filter((option) => option.value !== 'all');
  readonly currencies = CURRENCY_OPTIONS;
  readonly weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly daySlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  readonly calendarLabel = computed(() => format(this.selectedDate(), this.viewMode() === 'day' ? 'EEEE, MMMM d yyyy' : 'MMMM yyyy'));

  readonly reservationForm = this.fb.nonNullable.group({
    customerId: [''],
    customerName: [''],
    phone: [''],
    email: [''],
    whatsapp: [''],
    adults: [2],
    children: [0],
    totalGuests: [2],
    reservationDate: [''],
    startTime: [''],
    endTime: [''],
    place: [''],
    tourName: [''],
    status: ['pending'],
    pickupLocation: [''],
    notes: [''],
    price: [0],
    additionalCosts: [0],
    discount: [0],
    totalPrice: [0],
    currency: ['EUR'],
  });

  ngOnInit(): void {
    this.loadReservations();
    this.api.listCustomers().subscribe((items) => this.customers.set(items));

    this.reservationForm.valueChanges.subscribe((value) => {
      const adults = Number(value.adults ?? 0);
      const children = Number(value.children ?? 0);
      const totalGuests = Math.max(1, adults + children);
      const totalPrice = Math.max(
        0,
        Number(value.price ?? 0) + Number(value.additionalCosts ?? 0) - Number(value.discount ?? 0),
      );

      this.reservationForm.controls.totalGuests.setValue(totalGuests, { emitEvent: false });
      this.reservationForm.controls.totalPrice.setValue(totalPrice, { emitEvent: false });
    });
  }

  loadReservations(): void {
    this.api.listReservations().subscribe((items) => this.reservations.set(items));
  }

  goToday(): void {
    this.selectedDate.set(new Date());
  }

  previous(): void {
    this.selectedDate.update((date) =>
      this.viewMode() === 'day' ? addDays(date, -1) : this.viewMode() === 'week' ? addWeeks(date, -1) : addMonths(date, -1),
    );
  }

  next(): void {
    this.selectedDate.update((date) =>
      this.viewMode() === 'day' ? addDays(date, 1) : this.viewMode() === 'week' ? addWeeks(date, 1) : addMonths(date, 1),
    );
  }

  isCurrentMonth(day: Date): boolean {
    return isSameMonth(day, this.selectedDate());
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && day.getDate() === today.getDate();
  }

  monthDays(): Date[] {
    const start = startOfWeek(startOfMonth(this.selectedDate()));
    const end = endOfWeek(endOfMonth(this.selectedDate()));
    const days: Date[] = [];
    let cursor = start;

    while (cursor <= end) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }

    return days;
  }

  weekDays(): Date[] {
    const start = startOfWeek(this.selectedDate());
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }

  agendaReservations(): ReservationRecord[] {
    return [...this.reservations()].sort((a, b) => `${a.reservationDate} ${a.startTime || ''}`.localeCompare(`${b.reservationDate} ${b.startTime || ''}`));
  }

  reservationsForDay(day: Date): ReservationRecord[] {
    const dayKey = format(day, 'yyyy-MM-dd');
    return this.reservations()
      .filter((reservation) => reservation.reservationDate === dayKey)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }

  reservationsForSlot(day: Date, slot: string): ReservationRecord[] {
    const dayKey = format(day, 'yyyy-MM-dd');
    return this.reservations()
      .filter((reservation) => reservation.reservationDate === dayKey && (reservation.startTime || '').slice(0, 5) === slot)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }

  openCreate(date: Date, time?: string): void {
    this.editingReservationId.set(null);
    this.isFormOpen.set(true);
    this.reservationForm.reset({
      customerId: '',
      customerName: '',
      phone: '',
      email: '',
      whatsapp: '',
      adults: 2,
      children: 0,
      totalGuests: 2,
      reservationDate: format(date, 'yyyy-MM-dd'),
      startTime: time ?? '',
      endTime: '',
      place: '',
      tourName: '',
      status: 'pending',
      pickupLocation: '',
      notes: '',
      price: 0,
      additionalCosts: 0,
      discount: 0,
      totalPrice: 0,
      currency: 'EUR',
    });
  }

  openEdit(reservation: ReservationRecord): void {
    this.editingReservationId.set(reservation.id);
    this.isFormOpen.set(true);
    this.reservationForm.reset({
      customerId: reservation.customerId,
      customerName: reservation.customerName,
      phone: reservation.phone,
      email: reservation.email,
      whatsapp: reservation.whatsapp,
      adults: reservation.adults,
      children: reservation.children,
      totalGuests: reservation.totalGuests,
      reservationDate: reservation.reservationDate,
      startTime: reservation.startTime ?? '',
      endTime: reservation.endTime ?? '',
      place: reservation.place,
      tourName: reservation.tourName,
      status: reservation.status,
      pickupLocation: reservation.pickupLocation,
      notes: reservation.notes,
      price: reservation.price,
      additionalCosts: reservation.additionalCosts,
      discount: reservation.discount,
      totalPrice: reservation.totalPrice,
      currency: reservation.currency,
    });
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingReservationId.set(null);
  }

  applyCustomerSelection(): void {
    const selectedId = this.reservationForm.controls.customerId.value;
    if (!selectedId) {
      return;
    }

    const customer = this.customers().find((item) => item.id === selectedId);
    if (!customer) {
      return;
    }

    this.reservationForm.patchValue({
      customerName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      whatsapp: customer.phone,
    });
  }

  saveReservation(): void {
    const payload = this.toPayload();
    const editingId = this.editingReservationId();

    if (!editingId) {
      this.api.createReservation(payload).subscribe((created) => {
        this.reservations.update((items) => [created, ...items]);
        this.closeForm();
      });
      return;
    }

    this.api.updateReservation(editingId, payload).subscribe((updated) => {
      this.reservations.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      this.closeForm();
    });
  }

  removeReservation(): void {
    const editingId = this.editingReservationId();
    if (!editingId) {
      return;
    }

    if (!confirm('Delete this reservation?')) {
      return;
    }

    this.api.deleteReservation(editingId).subscribe(() => {
      this.reservations.update((items) => items.filter((item) => item.id !== editingId));
      this.closeForm();
    });
  }

  private toPayload(): ReservationUpsertPayload {
    const value = this.reservationForm.getRawValue();

    return {
      customerId: value.customerId || undefined,
      customerName: value.customerName,
      phone: value.phone,
      email: value.email,
      whatsapp: value.whatsapp,
      adults: Number(value.adults),
      children: Number(value.children),
      totalGuests: Number(value.totalGuests),
      reservationDate: value.reservationDate,
      startTime: value.startTime || null,
      endTime: value.endTime || null,
      place: value.place,
      tourName: value.tourName,
      status: value.status as ReservationRecord['status'],
      pickupLocation: value.pickupLocation,
      notes: value.notes,
      price: Number(value.price),
      additionalCosts: Number(value.additionalCosts),
      discount: Number(value.discount),
      totalPrice: Number(value.totalPrice),
      currency: value.currency,
    };
  }
}
