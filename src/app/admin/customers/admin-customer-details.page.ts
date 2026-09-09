import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminApiService } from '../admin-api.service';
import { CustomerRecord, ReservationRecord } from '../admin.models';

@Component({
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  template: `
    <section class="admin-page-stack">
      @if (customer(); as item) {
        <div class="admin-page-header">
          <div>
            <p class="admin-eyebrow">Customer</p>
            <h1>{{ item.fullName }}</h1>
          </div>
          <a routerLink="/admin/customers" class="admin-button admin-button--secondary">Back to customers</a>
        </div>

        <section class="admin-split-grid">
          <article class="admin-card admin-panel-card">
            <h2>Contact details</h2>
            <dl class="admin-detail-grid">
              <div><dt>Email</dt><dd>{{ item.email }}</dd></div>
              <div><dt>Phone</dt><dd>{{ item.phone }}</dd></div>
              <div><dt>WhatsApp</dt><dd>{{ item.whatsapp }}</dd></div>
              <div><dt>Notes</dt><dd>{{ item.notes || '—' }}</dd></div>
              <div><dt>Created</dt><dd>{{ item.createdAt | date:'medium' }}</dd></div>
              <div><dt>Updated</dt><dd>{{ item.updatedAt | date:'medium' }}</dd></div>
            </dl>
          </article>

          <article class="admin-card admin-panel-card">
            <h2>Reservation history</h2>
            <div class="admin-list-stack">
              @for (reservation of previousReservations(); track reservation.id) {
                <a class="admin-list-item" [routerLink]="['/admin/reservations', reservation.id]">
                  <div>
                    <strong>{{ reservation.tourName }}</strong>
                    <p>{{ reservation.destinationName }}</p>
                  </div>
                  <span>{{ reservation.reservationDate }} · {{ reservation.totalPrice | currency:reservation.currency }}</span>
                </a>
              }
            </div>
          </article>
        </section>
      } @else {
        <article class="admin-card admin-panel-card">Loading customer…</article>
      }
    </section>
  `,
})
export class AdminCustomerDetailsPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);

  readonly customer = signal<CustomerRecord | null>(null);
  readonly previousReservations = signal<ReservationRecord[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.api.getCustomer(id).subscribe((customer) => this.customer.set(customer));
    this.api.listReservations().subscribe((reservations) => {
      const customerReservations = reservations.filter((reservation) => reservation.customerId === id);
      this.previousReservations.set([...customerReservations].sort((a, b) => a.reservationDate.localeCompare(b.reservationDate)));
    });
  }
}