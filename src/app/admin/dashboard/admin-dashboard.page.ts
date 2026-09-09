import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../admin-api.service';
import { DashboardData } from '../admin.models';

const EMPTY_DASHBOARD: DashboardData = {
  metrics: [
    { label: 'Total reservations', value: 0 },
    { label: 'Pending reservations', value: 0 },
    { label: 'Confirmed reservations', value: 0 },
    { label: 'Completed reservations', value: 0 },
    { label: 'Cancelled reservations', value: 0 },
    { label: "Today's reservations", value: 0 },
    { label: 'Upcoming reservations', value: 0 },
    { label: 'Total booking value', value: 0, hint: 'Across all reservations' },
  ],
  statusBreakdown: [
    { label: 'Pending', value: 0 },
    { label: 'Confirmed', value: 0 },
    { label: 'Completed', value: 0 },
    { label: 'Cancelled', value: 0 },
  ],
  destinationBreakdown: [],
  tourBreakdown: [],
  upcomingReservations: [],
};

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Dashboard</p>
          <h1>Reservations overview</h1>
        </div>
        <p class="admin-muted">Live operational metrics loaded from Supabase-backed data.</p>
      </div>

      @if (dashboard(); as data) {
        <section class="admin-kpi-grid">
          @for (metric of data.metrics; track metric.label) {
            <article class="admin-card admin-kpi-card">
              <p class="admin-muted">{{ metric.label }}</p>
              <strong>{{ metric.value }}</strong>
              @if (metric.hint) {
                <small>{{ metric.hint }}</small>
              }
            </article>
          }
        </section>

        <section class="admin-split-grid">
          <article class="admin-card admin-panel-card">
            <h2>Reservations by status</h2>
            <div class="admin-breakdown-list">
              @for (item of data.statusBreakdown; track item.label) {
                <div class="admin-breakdown-row">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              }
            </div>
          </article>

          <article class="admin-card admin-panel-card">
            <h2>Upcoming reservations</h2>
            <div class="admin-list-stack">
              @for (reservation of data.upcomingReservations; track reservation.id) {
                <a class="admin-list-item" [routerLink]="['/admin/reservations', reservation.id]">
                  <div>
                    <strong>{{ reservation.customerName }}</strong>
                    <p>{{ reservation.tourName }} · {{ reservation.destinationName }}</p>
                  </div>
                  <span>{{ reservation.reservationDate }}</span>
                </a>
              }
            </div>
          </article>
        </section>

        <section class="admin-split-grid">
          <article class="admin-card admin-panel-card">
            <h2>Reservations by destination</h2>
            <div class="admin-bar-chart">
              @for (item of data.destinationBreakdown; track item.label) {
                <div class="admin-bar-row">
                  <span>{{ item.label }}</span>
                  <div class="admin-bar-track"><i [style.width.%]="Math.min(100, item.value * 12)"></i></div>
                  <strong>{{ item.value }}</strong>
                </div>
              }
            </div>
          </article>

          <article class="admin-card admin-panel-card">
            <h2>Reservations by tour</h2>
            <div class="admin-bar-chart">
              @for (item of data.tourBreakdown; track item.label) {
                <div class="admin-bar-row">
                  <span>{{ item.label }}</span>
                  <div class="admin-bar-track"><i [style.width.%]="Math.min(100, item.value * 12)"></i></div>
                  <strong>{{ item.value }}</strong>
                </div>
              }
            </div>
          </article>
        </section>
      }
    </section>
  `,
})
export class AdminDashboardPage implements OnInit {
  private readonly api = inject(AdminApiService);
  readonly Math = Math;
  readonly dashboard = signal<DashboardData>(EMPTY_DASHBOARD);

  ngOnInit(): void {
    this.api.getDashboard().subscribe({
      next: (data) => this.dashboard.set(data),
      error: () => this.dashboard.set(EMPTY_DASHBOARD),
    });
  }
}