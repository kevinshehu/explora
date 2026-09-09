import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminApiService } from '../admin-api.service';
import { CustomerRecord, ReservationRecord } from '../admin.models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Customers</p>
          <h1>Customer management</h1>
        </div>
        <button type="button" class="admin-button admin-button--secondary" (click)="startCreate()">New customer</button>
      </div>

      <article class="admin-card admin-panel-card">
        <form class="admin-filter-grid" [formGroup]="filterForm">
          <label>
            <span>Search</span>
            <input formControlName="query" placeholder="Search name, email, phone" />
          </label>
        </form>

        <div class="admin-list-stack">
          @for (customer of filteredCustomers(); track customer.id) {
            <article class="admin-list-item admin-list-item--column">
              <div class="admin-customer-row">
                <div>
                  <strong>{{ customer.fullName }}</strong>
                  <p>{{ customer.email }} · {{ customer.phone }}</p>
                </div>
                <div class="admin-topbar-actions">
                  <button type="button" class="admin-button admin-button--ghost" (click)="selectCustomer(customer.id)">History</button>
                  <button type="button" class="admin-button admin-button--ghost" (click)="startEdit(customer)">Edit</button>
                  <button type="button" class="admin-button admin-button--ghost" (click)="remove(customer)">Delete</button>
                </div>
              </div>
            </article>
          }
        </div>
      </article>

      <section class="admin-split-grid">
        <article class="admin-card admin-panel-card">
          <h2>{{ editingCustomerId() ? 'Edit customer' : 'Create customer' }}</h2>
          <form class="admin-form-grid" [formGroup]="customerForm" (ngSubmit)="saveCustomer()">
            <label>
              <span>Full name</span>
              <input formControlName="fullName" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" formControlName="email" />
            </label>
            <label>
              <span>Phone</span>
              <input formControlName="phone" />
            </label>
            <label class="admin-form-span-2">
              <span>Notes</span>
              <textarea rows="3" formControlName="notes"></textarea>
            </label>
            <div class="admin-form-actions">
              @if (editingCustomerId()) {
                <button type="button" class="admin-button admin-button--ghost" (click)="startCreate()">Cancel</button>
              }
              <button type="submit" class="admin-button admin-button--primary">{{ editingCustomerId() ? 'Save customer' : 'Create customer' }}</button>
            </div>
          </form>
        </article>

        <article class="admin-card admin-panel-card">
          <h2>Reservation history</h2>
          @if (selectedCustomer(); as selected) {
            <p class="admin-muted">{{ selected.fullName }}</p>
            <div class="admin-list-stack">
              @for (reservation of selectedReservations(); track reservation.id) {
                <article class="admin-list-item">
                  <div>
                    <strong>{{ reservation.tourName }}</strong>
                    <p>{{ reservation.place }} · {{ reservation.totalGuests }} guests</p>
                  </div>
                  <span>{{ reservation.endDate && reservation.endDate !== reservation.startDate ? reservation.startDate + ' → ' + reservation.endDate : reservation.startDate }}</span>
                </article>
              }
              @if (selectedReservations().length === 0) {
                <p class="admin-muted">No reservations yet for this customer.</p>
              }
            </div>
          } @else {
            <p class="admin-muted">Select a customer to view reservation history.</p>
          }
        </article>
      </section>
    </section>
  `,
})
export class AdminCustomersPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);

  readonly customers = signal<CustomerRecord[]>([]);
  readonly reservations = signal<ReservationRecord[]>([]);
  readonly selectedCustomerId = signal<string | null>(null);
  readonly editingCustomerId = signal<string | null>(null);

  readonly filterForm = this.fb.nonNullable.group({ query: [''] });

  readonly customerForm = this.fb.nonNullable.group({
    fullName: [''],
    email: [''],
    phone: [''],
    notes: [''],
  });

  readonly filteredCustomers = computed(() => {
    const query = this.filterForm.controls.query.value.trim().toLowerCase();
    if (!query) {
      return this.customers();
    }

    return this.customers().filter((customer) =>
      [customer.fullName, customer.email, customer.phone].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  });

  readonly selectedCustomer = computed(() => {
    const id = this.selectedCustomerId();
    if (!id) {
      return null;
    }

    return this.customers().find((customer) => customer.id === id) ?? null;
  });

  readonly selectedReservations = computed(() => {
    const id = this.selectedCustomerId();
    if (!id) {
      return [];
    }

    return this.reservations()
      .filter((reservation) => reservation.customerId === id)
      .sort((a, b) => `${b.startDate} ${b.endDate}`.localeCompare(`${a.startDate} ${a.endDate}`));
  });

  ngOnInit(): void {
    this.reloadCustomers();
    this.reloadReservations();
  }

  reloadCustomers(): void {
    this.api.listCustomers().subscribe((items) => this.customers.set(items));
  }

  reloadReservations(): void {
    this.api.listReservations().subscribe((items) => this.reservations.set(items));
  }

  startCreate(): void {
    this.editingCustomerId.set(null);
    this.customerForm.reset({ fullName: '', email: '', phone: '', notes: '' });
  }

  startEdit(customer: CustomerRecord): void {
    this.editingCustomerId.set(customer.id);
    this.customerForm.reset({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      notes: customer.notes,
    });
  }

  selectCustomer(id: string): void {
    this.selectedCustomerId.set(id);
  }

  saveCustomer(): void {
    const payload = this.customerForm.getRawValue();
    const editingId = this.editingCustomerId();

    if (!editingId) {
      this.api.createCustomer(payload).subscribe((created) => {
        this.customers.update((items) => [created, ...items]);
        this.selectedCustomerId.set(created.id);
        this.startCreate();
      });
      return;
    }

    this.api.updateCustomer(editingId, payload).subscribe((updated) => {
      this.customers.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      this.selectedCustomerId.set(updated.id);
      this.startCreate();
    });
  }

  remove(customer: CustomerRecord): void {
    if (!confirm(`Delete customer ${customer.fullName}?`)) {
      return;
    }

    this.api.deleteCustomer(customer.id).subscribe(() => {
      this.customers.update((items) => items.filter((item) => item.id !== customer.id));
      this.reservations.update((items) => items.filter((item) => item.customerId !== customer.id));
      if (this.selectedCustomerId() === customer.id) {
        this.selectedCustomerId.set(null);
      }
      if (this.editingCustomerId() === customer.id) {
        this.startCreate();
      }
    });
  }

}
