import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { destinations, tours } from '../data/travel-data';
import { Tour } from '../shared/models/travel.model';
import { PriceCalculator } from '../shared/components/price-calculator';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [FormsModule, PriceCalculator],
  template: `
    <section class="container section-shell">
      <div class="detail-title-group">
        <p class="section-label">Calculate and book</p>
        <h1>Choose, calculate, then WhatsApp</h1>
        <p class="tagline">Select an experience, estimate the price, and send the details to Explora for availability and next steps.</p>
      </div>

      <div class="booking-grid calculator-page-grid">
        <div class="booking-form">
          <label for="booking-experience">
            <span>Experience</span>
            <select id="booking-experience" [(ngModel)]="selectedTourSlug">
              @for (tour of tours; track tour.id) {
                <option [value]="tour.slug">{{ tour.title }}</option>
              }
            </select>
          </label>

          @if (selectedTour; as tour) {
            <app-price-calculator
              [tour]="tour"
              [showDate]="true"
              [showContactFields]="true"
              [initialDate]="initialDate"
              label="Your estimate"
            />
          }
        </div>
        <aside class="info-card booking-summary">
          <h3>How booking works</h3>
          <p><strong>1.</strong> Calculate your estimated price.</p>
          <p><strong>2.</strong> Send the details to Explora on WhatsApp.</p>
          <p><strong>3.</strong> Confirm availability, questions, and final arrangements in chat.</p>
        </aside>
      </div>
    </section>
  `,
})
export class BookingPage {
  private readonly route = inject(ActivatedRoute);

  tours = tours;
  destinations = destinations;
  selectedTourSlug = tours[0]?.slug ?? '';
  initialDate = '';

  constructor() {
    const queryTour = this.route.snapshot.queryParamMap.get('tour');
    const queryDestination = this.route.snapshot.queryParamMap.get('destination');
    const queryDate = this.route.snapshot.queryParamMap.get('startDate');
    this.initialDate = queryDate ?? '';

    const selected = queryTour
      ? this.tours.find((tour) => tour.slug === queryTour)
      : undefined;

    if (selected) {
      this.selectedTourSlug = selected.slug;
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
          this.selectedTourSlug = fallback.slug;
        }
      }
    }
  }

  get selectedTour(): Tour | undefined {
    return this.tours.find((tour) => tour.slug === this.selectedTourSlug);
  }
}
