import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { destinations, tours } from '../data/travel-data';
import { Tour } from '../shared/models/travel.model';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule, CurrencyPipe],
  template: `
    <section class="container section-shell">
      <div class="detail-title-group">
        <p class="section-label">Plan by WhatsApp</p>
        <h1>Send your Riviera trip request</h1>
        <p class="tagline">Choose a package, add the essentials, and continue the conversation directly on WhatsApp.</p>
      </div>

      <div class="booking-grid">
        <form class="booking-form" [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <label>
            <span>Package</span>
            <select formControlName="tourId">
              <option value="">Select a package</option>
              <optgroup label="Tours">
                <option *ngFor="let tour of tours" [value]="tour.slug">{{ tour.title }} — {{ tour.priceFrom | currency:'EUR' }}</option>
              </optgroup>
            </select>
          </label>

          <label>
            <span>Travel date</span>
            <input type="date" formControlName="startDate" />
          </label>

          <label>
            <span>Travellers</span>
            <select formControlName="travellers">
              <option *ngFor="let count of travellers" [value]="count">{{ count }}</option>
            </select>
          </label>

          <label>
            <span>Full name</span>
            <input formControlName="name" placeholder="John Doe" />
          </label>

          <label>
            <span>Phone</span>
            <input formControlName="phone" type="tel" placeholder="+355 6x xxx xxxx" />
          </label>

          <label>
            <span>Notes</span>
            <textarea formControlName="notes" rows="4" placeholder="Preferred hotel style, pickup location, or activities"></textarea>
          </label>

          <button class="button-primary" type="submit" [disabled]="bookingForm.invalid || redirecting">
            <span class="material-symbols-outlined" aria-hidden="true">chat</span>
            Send to WhatsApp
          </button>
        </form>

        <aside class="info-card booking-summary">
          <h3>Price summary</h3>
          <ng-container *ngIf="selectedTour as tour; else pickPrompt">
            <p><strong>Tour</strong> {{ tour.title }}</p>
            <p><strong>Duration</strong> {{ tour.duration }}</p>
            <p><strong>Price</strong> {{ tour.priceFrom | currency:'EUR' }} per person</p>
            <p><strong>Travellers</strong> {{ travellersCount }}</p>
            <p><strong>Travel date</strong> {{ bookingForm.value.startDate }}</p>
            <hr />
            <p class="total">Total {{ quoteTotal | currency:'EUR' }}</p>
          </ng-container>
          <ng-template #pickPrompt>
            <p>Select a tour to see the live pricing summary.</p>
          </ng-template>
        </aside>
      </div>

      <section *ngIf="redirecting" class="confirmation">
        <h2>Opening WhatsApp</h2>
        <p>Your selected package and trip details are being prepared as a WhatsApp message.</p>
      </section>
    </section>
  `,
})
export class BookingPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  tours = tours;
  destinations = destinations;
  travellers = ['1', '2', '3', '4', '5', '6', '7', '8'];
  redirecting = false;
  selectedTour?: Tour;

  bookingForm = this.fb.group({
    tourId: ['', Validators.required],
    startDate: ['', Validators.required],
    travellers: ['2', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    notes: [''],
  });

  constructor() {
    const today = new Date();

    const queryTour = this.route.snapshot.queryParamMap.get('tour');
    const queryDestination = this.route.snapshot.queryParamMap.get('destination');
    const queryDate = this.route.snapshot.queryParamMap.get('startDate');

    const selected = queryTour
      ? this.tours.find((tour) => tour.slug === queryTour)
      : undefined;

    if (selected) {
      this.selectedTour = selected;
      this.bookingForm.patchValue({ tourId: selected.slug }, { emitEvent: false });
    }

    if (queryDestination && !selected) {
      const destination = this.destinations.find(
        (item) => item.slug === queryDestination,
      );
      if (destination) {
        const fallback = this.tours.find(
          (tour) => tour.destinationId === destination.id,
        );
        if (fallback) {
          this.bookingForm.patchValue({ tourId: fallback.slug }, { emitEvent: false });
          this.selectedTour = fallback;
        }
      }
    }

    if (!queryTour && !this.selectedTour && this.tours.length) {
      this.selectedTour = this.tours[0];
      this.bookingForm.patchValue({ tourId: this.selectedTour.slug }, { emitEvent: false });
    }

    this.bookingForm.patchValue({
      startDate: queryDate ?? today.toISOString().slice(0, 10),
      tourId: this.bookingForm.value.tourId,
    });

    this.bookingForm.valueChanges.subscribe(() => {
      this.redirecting = false;
      this.updateSelectedTour();
    });

    this.updateSelectedTour();
  }

  get quoteTotal(): number {
    const selected = this.selectedTour;
    const travellers = Number(this.bookingForm.get('travellers')?.value || 1);
    if (!selected) {
      return 0;
    }
    return selected.priceFrom * travellers;
  }

  get travellersCount() {
    return this.bookingForm.value.travellers || '1';
  }

  updateSelectedTour() {
    const tourId = this.bookingForm.value.tourId;
    if (tourId) {
      this.selectedTour = this.tours.find((tour) => tour.slug === tourId);
    }
  }

  onSubmit() {
    if (!this.bookingForm.valid || !this.selectedTour) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const destination = this.destinations.find(
      (item) => item.id === this.selectedTour?.destinationId,
    );

    this.redirecting = true;
    window.location.href = this.whatsAppUrl([
      'Hello Explora, I would like to plan a South Albania trip.',
      '',
      `Package: ${this.selectedTour.title}`,
      `Destination: ${destination?.city ?? this.selectedTour.location}`,
      `Travel date: ${this.bookingForm.value.startDate}`,
      `Travellers: ${this.bookingForm.value.travellers}`,
      `Estimated total: EUR ${this.quoteTotal}`,
      '',
      `Name: ${this.bookingForm.value.name}`,
      `Phone: ${this.bookingForm.value.phone}`,
      `Notes: ${this.bookingForm.value.notes || 'No extra notes'}`,
    ].join('\n'));
  }

  private whatsAppUrl(message: string): string {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
}
