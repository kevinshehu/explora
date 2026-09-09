import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminApiService } from '../admin-api.service';
import { DestinationRecord } from '../admin.models';

@Component({
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Destinations</p>
          <h1>Manage Riviera destinations</h1>
        </div>
      </div>

      <article class="admin-card admin-panel-card">
        <h2>{{ editingId ? 'Edit destination' : 'Create destination' }}</h2>
        <form class="admin-form-grid admin-form-grid--wide" [formGroup]="form" (ngSubmit)="save()">
          <label><span>Name</span><input formControlName="name" /></label>
          <label><span>Location</span><input formControlName="location" /></label>
          <label><span>Category</span><input formControlName="category" /></label>
          <label><span>Image URL</span><input formControlName="image" /></label>
          <label><span>Starting price</span><input type="number" formControlName="startingPrice" /></label>
          <label><span>Active</span><select formControlName="active"><option [ngValue]="true">Active</option><option [ngValue]="false">Inactive</option></select></label>
          <label class="admin-form-span-2"><span>Description</span><textarea rows="4" formControlName="description"></textarea></label>
          <div class="admin-form-actions">
            <button class="admin-button admin-button--primary" type="submit">Save destination</button>
            <button class="admin-button admin-button--ghost" type="button" (click)="clear()">Clear</button>
          </div>
        </form>
      </article>

      <article class="admin-card admin-panel-card">
        <div class="admin-table-scroll">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Location</th><th>Category</th><th>Starting price</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (destination of destinations(); track destination.id) {
                <tr>
                  <td>{{ destination.name }}</td>
                  <td>{{ destination.location }}</td>
                  <td>{{ destination.category }}</td>
                  <td>{{ destination.startingPrice | currency:'EUR' }}</td>
                  <td>{{ destination.active ? 'Active' : 'Inactive' }}</td>
                  <td>
                    <button type="button" class="admin-inline-link" (click)="edit(destination)">Edit</button>
                    <button type="button" class="admin-inline-link" (click)="toggle(destination)">{{ destination.active ? 'Deactivate' : 'Activate' }}</button>
                    <button type="button" class="admin-inline-link" (click)="remove(destination)">Delete</button>
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
export class AdminDestinationsPage implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);

  readonly destinations = signal<DestinationRecord[]>([]);
  editingId: string | null = null;

  form = this.fb.nonNullable.group({
    name: [''],
    location: [''],
    description: [''],
    category: [''],
    image: [''],
    startingPrice: [0],
    active: [true],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.api.listDestinations().subscribe((items) => this.destinations.set(items));
  }

  edit(destination: DestinationRecord): void {
    this.editingId = destination.id;
    this.form.setValue({
      name: destination.name,
      location: destination.location,
      description: destination.description,
      category: destination.category,
      image: destination.image,
      startingPrice: destination.startingPrice,
      active: destination.active,
    });
  }

  save(): void {
    const payload = this.form.getRawValue();
    const request = this.editingId ? this.api.updateDestination(this.editingId, payload) : this.api.createDestination(payload);

    request.subscribe(() => {
      this.clear();
      this.reload();
    });
  }

  toggle(destination: DestinationRecord): void {
    this.api.updateDestination(destination.id, { active: !destination.active }).subscribe(() => this.reload());
  }

  remove(destination: DestinationRecord): void {
    if (!confirm(`Delete ${destination.name}?`)) {
      return;
    }

    this.api.deleteDestination(destination.id).subscribe(() => this.reload());
  }

  clear(): void {
    this.editingId = null;
    this.form.reset({ name: '', location: '', description: '', category: '', image: '', startingPrice: 0, active: true });
  }
}