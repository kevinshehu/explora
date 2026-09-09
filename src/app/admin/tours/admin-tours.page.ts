import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminApiService } from '../admin-api.service';
import { DestinationRecord, TourRecord } from '../admin.models';

@Component({
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Tours / Experiences</p>
          <h1>Manage offerings</h1>
        </div>
      </div>

      <article class="admin-card admin-panel-card">
        <h2>{{ editingId ? 'Edit tour' : 'Create tour' }}</h2>
        <form class="admin-form-grid admin-form-grid--wide" [formGroup]="form" (ngSubmit)="save()">
          <label><span>Name</span><input formControlName="name" /></label>
          <label><span>Destination</span><select formControlName="destinationId"><option value="">Select destination</option>@for (destination of destinations(); track destination.id) {<option [value]="destination.id">{{ destination.name }}</option>}</select></label>
          <label><span>Duration</span><input formControlName="duration" /></label>
          <label><span>Price</span><input type="number" formControlName="price" /></label>
          <label><span>Price type</span><select formControlName="priceType"><option value="fixed">Fixed</option><option value="per-person">Per person</option><option value="per-day">Per day</option><option value="custom">Custom</option></select></label>
          <label><span>Maximum guests</span><input type="number" formControlName="maximumGuests" /></label>
          <label><span>Category</span><input formControlName="category" /></label>
          <label><span>Available days</span><input formControlName="availableDaysText" placeholder="Mon, Tue, Wed" /></label>
          <label><span>Images</span><input formControlName="imagesText" placeholder="Comma-separated URLs" /></label>
          <label><span>Active</span><select formControlName="active"><option [ngValue]="true">Active</option><option [ngValue]="false">Inactive</option></select></label>
          <label class="admin-form-span-2"><span>Description</span><textarea rows="4" formControlName="description"></textarea></label>
          <div class="admin-form-actions">
            <button class="admin-button admin-button--primary" type="submit">Save tour</button>
            <button class="admin-button admin-button--ghost" type="button" (click)="clear()">Clear</button>
          </div>
        </form>
      </article>

      <article class="admin-card admin-panel-card">
        <div class="admin-table-scroll">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Destination</th><th>Duration</th><th>Price</th><th>Guests</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (tour of tours(); track tour.id) {
                <tr>
                  <td>{{ tour.name }}</td>
                  <td>{{ destinationName(tour.destinationId) }}</td>
                  <td>{{ tour.duration }}</td>
                  <td>{{ tour.price | currency:'EUR' }}</td>
                  <td>{{ tour.maximumGuests }}</td>
                  <td>{{ tour.active ? 'Active' : 'Inactive' }}</td>
                  <td>
                    <button type="button" class="admin-inline-link" (click)="edit(tour)">Edit</button>
                    <button type="button" class="admin-inline-link" (click)="toggle(tour)">{{ tour.active ? 'Deactivate' : 'Activate' }}</button>
                    <button type="button" class="admin-inline-link" (click)="remove(tour)">Delete</button>
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
export class AdminToursPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);

  readonly destinations = signal<DestinationRecord[]>([]);
  readonly tours = signal<TourRecord[]>([]);
  editingId: string | null = null;

  form = this.fb.nonNullable.group({
    name: [''],
    destinationId: [''],
    description: [''],
    duration: [''],
    price: [0],
    priceType: ['fixed'],
    availableDaysText: [''],
    maximumGuests: [0],
    imagesText: [''],
    category: [''],
    active: [true],
  });

  ngOnInit(): void {
    this.reload();
    this.api.listDestinations().subscribe((items) => this.destinations.set(items));
  }

  reload(): void {
    this.api.listTours().subscribe((items) => this.tours.set(items));
  }

  destinationName(id: string): string {
    return this.destinations().find((destination) => destination.id === id)?.name ?? '—';
  }

  edit(tour: TourRecord): void {
    this.editingId = tour.id;
    this.form.setValue({
      name: tour.name,
      destinationId: tour.destinationId,
      description: tour.description,
      duration: tour.duration,
      price: tour.price,
      priceType: tour.priceType,
      availableDaysText: tour.availableDays.join(', '),
      maximumGuests: tour.maximumGuests,
      imagesText: tour.images.join(', '),
      category: tour.category,
      active: tour.active,
    });
  }

  save(): void {
    const value = this.form.getRawValue();
    const payload = {
      name: value.name,
      destinationId: value.destinationId,
      description: value.description,
      duration: value.duration,
      price: Number(value.price),
      priceType: value.priceType as any,
      availableDays: value.availableDaysText.split(',').map((entry) => entry.trim()).filter(Boolean),
      maximumGuests: Number(value.maximumGuests),
      images: value.imagesText.split(',').map((entry) => entry.trim()).filter(Boolean),
      category: value.category,
      active: value.active,
    };

    const request = this.editingId ? this.api.updateTour(this.editingId, payload) : this.api.createTour(payload);

    request.subscribe(() => {
      this.clear();
      this.reload();
    });
  }

  toggle(tour: TourRecord): void {
    this.api.updateTour(tour.id, { active: !tour.active }).subscribe(() => this.reload());
  }

  remove(tour: TourRecord): void {
    if (!confirm(`Delete ${tour.name}?`)) {
      return;
    }

    this.api.deleteTour(tour.id).subscribe(() => this.reload());
  }

  clear(): void {
    this.editingId = null;
    this.form.reset({ name: '', destinationId: '', description: '', duration: '', price: 0, priceType: 'fixed', availableDaysText: '', maximumGuests: 0, imagesText: '', category: '', active: true });
  }
}