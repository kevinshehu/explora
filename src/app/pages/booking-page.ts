import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { destinations, tours } from '../data/travel-data';
import { Destination, Tour } from '../shared/models/travel.model';

interface BookingSummary {
  tourTitle: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travellers: number;
  nights: number;
  total: number;
  totalLabel: string;
}

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule, CurrencyPipe],
  template: `
    <section class="container section-shell">
      <div class="detail-title-group">
        <p class="section-label">Booking</p>
        <h1>Build your South Albania itinerary</h1>
        <p class="tagline">A clean booking flow with pricing, availability timing, and confirmation state.</p>
      </div>

      <div class="booking-grid">
        <form class="booking-form" [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <label>
            <span>Destination or tour</span>
            <select formControlName="tourId">
              <option value="">Select a destination or package</option>
              <optgroup label="Tours">
                <option *ngFor="let tour of tours" [value]="tour.slug">{{ tour.title }} — {{ tour.priceFrom | currency:'EUR' }}</option>
              </optgroup>
            </select>
          </label>

          <label>
            <span>Check-in date</span>
            <input type="date" formControlName="startDate" />
          </label>

          <label>
            <span>Check-out date</span>
            <input type="date" formControlName="endDate" />
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
            <span>Email</span>
            <input formControlName="email" type="email" placeholder="you@example.com" />
          </label>

          <label>
            <span>Phone</span>
            <input formControlName="phone" type="tel" placeholder="+355 6x xxx xxxx" />
          </label>

          <label>
            <span>Notes</span>
            <textarea formControlName="notes" rows="4" placeholder="Preferred room type, access needs, and activity focus"></textarea>
          </label>

          <button class="button-primary" type="submit" [disabled]="bookingForm.invalid || submitted">Reserve now</button>
        </form>

        <aside class="info-card booking-summary">
          <h3>Price summary</h3>
          <ng-container *ngIf="selectedTour as tour; else pickPrompt">
            <p><strong>Tour</strong> {{ tour.title }}</p>
            <p><strong>Duration</strong> {{ tour.duration }}</p>
            <p><strong>Price</strong> {{ tour.priceFrom | currency:'EUR' }} per person</p>
            <p><strong>Travellers</strong> {{ travellersCount }}</p>
            <p><strong>Check-in</strong> {{ bookingForm.value.startDate }}</p>
            <p><strong>Check-out</strong> {{ bookingForm.value.endDate }}</p>
            <p><strong>Nights</strong> {{ nights }}</p>
            <hr />
            <p class="total">Total {{ quoteTotal | currency:'EUR' }}</p>
          </ng-container>
          <ng-template #pickPrompt>
            <p>Select a tour to see the live pricing summary.</p>
          </ng-template>
        </aside>
      </div>

      <section *ngIf="confirmed" class="confirmation">
        <h2>Booking confirmed</h2>
        <p class="confirmed-title">{{ confirmation.tourTitle }}</p>
        <p>Destination: {{ confirmation.destinationName }}</p>
        <p>Date: {{ confirmation.startDate }} → {{ confirmation.endDate }}</p>
        <p>Travellers: {{ confirmation.travellers }}</p>
        <p>Stay: {{ confirmation.nights }} nights</p>
        <p>Total: {{ confirmation.total | currency:'EUR' }} {{ confirmation.totalLabel }}</p>
        <p>Your travel team will email {{ bookingForm.get('email')?.value }} shortly.</p>
      </section>
    </section>
  `,
})
export class BookingPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tours = tours;
  destinations = destinations;
  travellers = ['1', '2', '3', '4', '5', '6', '7', '8'];
  submitted = false;
  selectedTour?: Tour;
  confirmation!: BookingSummary;
  confirmed = false;

  bookingForm = this.fb.group({
    tourId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    travellers: ['2', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    notes: [''],
  });

  constructor() {
    const today = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 6);

    const queryTour = this.route.snapshot.queryParamMap.get('tour');
    const queryDestination = this.route.snapshot.queryParamMap.get('destination');

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
      startDate: today.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      tourId: this.bookingForm.value.tourId,
    });

    this.bookingForm.valueChanges.subscribe(() => {
      this.confirmed = false;
      this.updateSelectedTour();
    });

    this.updateSelectedTour();
  }

  get quoteTotal(): number {
    const selected = this.selectedTour;
    const travellers = Number(this.bookingForm.get('travellers')?.value || 1);
    const start = this.bookingForm.value.startDate;
    const end = this.bookingForm.value.endDate;
    const nights = this.calculateNights(start ?? '', end ?? '');
    if (!selected) {
      return 0;
    }
    return selected.priceFrom * travellers * Math.max(1, nights);
  }

  get nights(): number {
    const start = this.bookingForm.value.startDate;
    const end = this.bookingForm.value.endDate;
    return this.calculateNights(start ?? '', end ?? '');
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

  calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 1;
    }
    const diff = end.getTime() - start.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(1, nights);
  }

  onSubmit() {
    this.submitted = true;
    if (!this.bookingForm.valid || !this.selectedTour) {
      return;
    }

    const destination = this.destinations.find(
      (item) => item.id === this.selectedTour?.destinationId,
    );

    this.confirmation = {
      tourTitle: this.selectedTour.title,
      destinationName: destination?.city ?? this.selectedTour.location,
      startDate: this.bookingForm.value.startDate ?? '',
      endDate: this.bookingForm.value.endDate ?? '',
      travellers: Number(this.bookingForm.value.travellers ?? 1),
      nights: this.nights,
      total: this.quoteTotal,
      totalLabel: 'EUR',
    };

    this.confirmed = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        confirmation: 'success',
      },
      queryParamsHandling: 'merge',
    });
  }
}
