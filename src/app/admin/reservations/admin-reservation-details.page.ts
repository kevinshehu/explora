import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminApiService } from '../admin-api.service';
import { RESERVATION_STATUS_LABELS } from '../admin.constants';
import { buildReservationWhatsAppUrl } from '../admin-whatsapp';
import { ReservationRecord } from '../admin.models';

@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: `
    <section class="admin-page-stack">
      @if (reservation(); as item) {
        <div class="admin-page-header">
          <div>
            <p class="admin-eyebrow">Reservation details</p>
            <h1>{{ item.reservationCode }}</h1>
          </div>
          <div class="admin-topbar-actions">
            <a routerLink="/admin/reservations" class="admin-button admin-button--secondary">Back to list</a>
            <a [href]="whatsappUrl()" target="_blank" rel="noopener" class="admin-button admin-button--primary">Open WhatsApp</a>
          </div>
        </div>

        <section class="admin-split-grid">
          <article class="admin-card admin-panel-card">
            <h2>Reservation summary</h2>
            <dl class="admin-detail-grid">
              <div><dt>Customer</dt><dd>{{ item.customerName }}</dd></div>
              <div><dt>Contact</dt><dd>{{ item.email }} · {{ item.phone }}</dd></div>
              <div><dt>Destination</dt><dd>{{ item.destinationName }}</dd></div>
              <div><dt>Tour</dt><dd>{{ item.tourName }}</dd></div>
              <div><dt>Date</dt><dd>{{ item.reservationDate }}</dd></div>
              <div><dt>Time</dt><dd>{{ item.startTime || '—' }} - {{ item.endTime || '—' }}</dd></div>
              <div><dt>Guests</dt><dd>{{ item.totalGuests }}</dd></div>
              <div><dt>Total</dt><dd>{{ item.totalPrice | currency:item.currency }}</dd></div>
              <div><dt>Status</dt><dd><span class="admin-status-badge admin-status-badge--{{ item.status }}">{{ statusLabel(item.status) }}</span></dd></div>
              <div><dt>Booking source</dt><dd>{{ item.bookingSource }}</dd></div>
              <div><dt>Pickup</dt><dd>{{ item.pickupLocation || '—' }}</dd></div>
              <div><dt>Created</dt><dd>{{ item.createdAt | date:'medium' }}</dd></div>
              <div><dt>Updated</dt><dd>{{ item.updatedAt | date:'medium' }}</dd></div>
            </dl>
          </article>

          <article class="admin-card admin-panel-card">
            <h2>Actions</h2>
            <div class="admin-action-stack">
              <button type="button" class="admin-button admin-button--secondary" (click)="changeStatus('confirmed')">Mark confirmed</button>
              <button type="button" class="admin-button admin-button--secondary" (click)="changeStatus('completed')">Mark completed</button>
              <button type="button" class="admin-button admin-button--secondary" (click)="changeStatus('cancelled')">Cancel</button>
              <button type="button" class="admin-button admin-button--secondary" (click)="duplicate()">Duplicate</button>
              <button type="button" class="admin-button admin-button--ghost" (click)="remove()">Delete</button>
            </div>
          </article>
        </section>
      } @else {
        <article class="admin-card admin-panel-card">Loading reservation…</article>
      }
    </section>
  `,
})
export class AdminReservationDetailsPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly reservation = signal<ReservationRecord | null>(null);
  readonly whatsappUrl = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigateByUrl('/admin/reservations');
      return;
    }

    this.loadReservation(id);
  }

  changeStatus(status: ReservationRecord['status']): void {
    const current = this.reservation();
    if (!current) {
      return;
    }

    this.api.updateReservation(current.id, { status }).subscribe((updated) => {
      this.reservation.set(updated);
      this.whatsappUrl.set(buildReservationWhatsAppUrl(updated));
    });
  }

  duplicate(): void {
    const current = this.reservation();
    if (!current) {
      return;
    }

    const { id, reservationCode, createdAt, updatedAt, ...payload } = current;
    this.api.createReservation(payload).subscribe((created) => {
      void this.router.navigate(['/admin/reservations', created.id]);
    });
  }

  remove(): void {
    const current = this.reservation();
    if (!current) {
      return;
    }

    if (!confirm('Delete this reservation?')) {
      return;
    }

    this.api.deleteReservation(current.id).subscribe(() => void this.router.navigateByUrl('/admin/reservations'));
  }

  statusLabel(status: ReservationRecord['status']): string {
    return RESERVATION_STATUS_LABELS[status];
  }

  private loadReservation(id: string): void {
    this.api.getReservation(id).subscribe((item) => {
      this.reservation.set(item);
      this.whatsappUrl.set(buildReservationWhatsAppUrl(item));
    });
  }
}