import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../admin-api.service';
import { CustomerRecord } from '../admin.models';

@Component({
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Customers</p>
          <h1>Customer directory</h1>
        </div>
      </div>

      <article class="admin-card admin-panel-card">
        <form class="admin-filter-grid" [formGroup]="filterForm">
          <label>
            <span>Search</span>
            <input formControlName="query" placeholder="Search name, email, phone" />
          </label>
        </form>

        <div class="admin-table-scroll">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>WhatsApp</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (customer of filteredCustomers(); track customer.id) {
                <tr>
                  <td>{{ customer.fullName }}</td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.phone }}</td>
                  <td>{{ customer.whatsapp }}</td>
                  <td>{{ customer.createdAt | date:'mediumDate' }}</td>
                  <td><a class="admin-inline-link" [routerLink]="['/admin/customers', customer.id]">Open</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
})
export class AdminCustomersPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);

  readonly customers = signal<CustomerRecord[]>([]);
  readonly filterForm = this.fb.nonNullable.group({ query: [''] });

  readonly filteredCustomers = computed(() => {
    const query = this.filterForm.controls.query.value.trim().toLowerCase();
    if (!query) {
      return this.customers();
    }

    return this.customers().filter((customer) => [customer.fullName, customer.email, customer.phone, customer.whatsapp].some((value) => value.toLowerCase().includes(query)));
  });

  ngOnInit(): void {
    this.api.listCustomers().subscribe((items) => this.customers.set(items));
  }
}