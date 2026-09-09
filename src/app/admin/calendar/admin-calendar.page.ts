import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { AdminApiService } from '../admin-api.service';
import { CalendarViewMode, ReservationRecord } from '../admin.models';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Calendar</p>
          <h1>Reservation timeline</h1>
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
              <article class="admin-calendar-cell" [class.is-muted]="!isCurrentMonth(day)">
                <header>
                  <strong>{{ day.getDate() }}</strong>
                </header>
                <div class="admin-calendar-events">
                  @for (reservation of reservationsForDay(day); track reservation.id) {
                    <a class="admin-calendar-event admin-calendar-event--{{ reservation.status }}" [routerLink]="['/admin/reservations', reservation.id]">
                      <span>{{ reservation.startTime || 'All day' }}</span>
                      <strong>{{ reservation.customerName }}</strong>
                      <small>{{ reservation.tourName }} · {{ reservation.totalGuests }} guests</small>
                    </a>
                  }
                </div>
              </article>
            }
          </div>
        } @else if (viewMode() === 'week') {
          <div class="admin-calendar-stack">
            @for (day of weekDays(); track day.toISOString()) {
              <article class="admin-calendar-day-row">
                <header>
                  <strong>{{ day | date:'EEE, MMM d' }}</strong>
                </header>
                <div class="admin-calendar-events admin-calendar-events--row">
                  @for (reservation of reservationsForDay(day); track reservation.id) {
                    <a class="admin-calendar-event admin-calendar-event--{{ reservation.status }}" [routerLink]="['/admin/reservations', reservation.id]">
                      <strong>{{ reservation.customerName }}</strong>
                      <small>{{ reservation.tourName }} · {{ reservation.startTime || 'All day' }}</small>
                    </a>
                  }
                </div>
              </article>
            }
          </div>
        } @else if (viewMode() === 'day') {
          <article class="admin-calendar-day-view">
            <header class="admin-calendar-day-header">
              <strong>{{ selectedDate() | date:'EEEE, MMMM d, yyyy' }}</strong>
            </header>
            <div class="admin-calendar-events admin-calendar-events--list">
              @for (reservation of reservationsForDay(selectedDate()); track reservation.id) {
                <a class="admin-calendar-event admin-calendar-event--{{ reservation.status }}" [routerLink]="['/admin/reservations', reservation.id]">
                  <strong>{{ reservation.customerName }}</strong>
                  <small>{{ reservation.tourName }} · {{ reservation.destinationName }} · {{ reservation.totalGuests }} guests · {{ reservation.startTime || 'All day' }}</small>
                </a>
              }
            </div>
          </article>
        } @else {
          <div class="admin-list-stack">
            @for (reservation of agendaReservations(); track reservation.id) {
              <a class="admin-list-item" [routerLink]="['/admin/reservations', reservation.id]">
                <div>
                  <strong>{{ reservation.customerName }}</strong>
                  <p>{{ reservation.tourName }} · {{ reservation.destinationName }}</p>
                </div>
                <span>{{ reservation.reservationDate }} · {{ reservation.startTime || 'All day' }}</span>
              </a>
            }
          </div>
        }
      </article>
    </section>
  `,
})
export class AdminCalendarPage implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly viewModes: CalendarViewMode[] = ['month', 'week', 'day', 'agenda'];
  readonly viewMode = signal<CalendarViewMode>('month');
  readonly selectedDate = signal(new Date());
  readonly reservations = signal<ReservationRecord[]>([]);

  readonly weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  readonly calendarLabel = computed(() => format(this.selectedDate(), 'MMMM yyyy'));

  ngOnInit(): void {
    this.api.listReservations().subscribe((items) => this.reservations.set(items));
  }

  goToday(): void {
    this.selectedDate.set(new Date());
  }

  previous(): void {
    this.selectedDate.update((date) => (this.viewMode() === 'day' ? addDays(date, -1) : this.viewMode() === 'week' ? addWeeks(date, -1) : addMonths(date, -1)));
  }

  next(): void {
    this.selectedDate.update((date) => (this.viewMode() === 'day' ? addDays(date, 1) : this.viewMode() === 'week' ? addWeeks(date, 1) : addMonths(date, 1)));
  }

  isCurrentMonth(day: Date): boolean {
    return isSameMonth(day, this.selectedDate());
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
}