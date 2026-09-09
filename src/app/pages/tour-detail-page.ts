import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { tours } from '../data/travel-data';
import { Tour } from '../shared/models/travel.model';
import { SectionTitle } from '../shared/components/section-title';
import { WhatsappIcon } from '../shared/components/whatsapp-icon';
import { whatsappUrl } from '../shared/whatsapp';
import { PriceCalculator } from '../shared/components/price-calculator';

@Component({
  selector: 'app-tour-detail-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, SectionTitle, WhatsappIcon, PriceCalculator],
  template: `
    @if (tour) {
    <section class="container section-shell">
      <a class="back-link" routerLink="/tours">← Back to tours</a>
      <div class="detail-header">
        <div class="detail-title-group">
          <p class="section-label">Tour package</p>
          <h1>{{ tour.title }}</h1>
          <p class="tagline">{{ tour.location }}</p>
        </div>
        <div class="detail-price">
          <p>From</p>
          <p class="value">{{ tour.priceFrom | currency:'EUR' }}</p>
          <p>{{ tour.duration }} · {{ tour.rating }} ★</p>
        </div>
      </div>

      <div class="gallery-grid">
        <img [src]="tour.image" [alt]="tour.title" class="gallery-main" />
        @for (image of tour.gallery; track image) {
          <img [src]="image" [alt]="tour.title" class="gallery-thumb" />
        }
      </div>

      <div class="two-col">
        <div>
          <h3>Overview</h3>
          <p class="detail-copy">{{ tour.overview }}</p>

          <h3>Highlights</h3>
          <ul class="feature-bullets">
            @for (item of tour.highlights; track item) {
              <li>{{ item }}</li>
            }
          </ul>

          <h3>Itinerary</h3>
          <ol class="itinerary-list">
            @for (item of tour.itinerary; track item) {
              <li>{{ item }}</li>
            }
          </ol>

          <h3>Included</h3>
          <ul class="feature-bullets">
            @for (item of tour.included; track item) {
              <li>{{ item }}</li>
            }
          </ul>

          <h3>Not included</h3>
          <ul class="feature-bullets muted-list">
            @for (item of tour.excluded; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </div>

        <aside class="info-card">
          <p><strong>Category</strong> {{ tour.category }}</p>
          <p><strong>Reviews</strong> {{ tour.reviews }}</p>
          <p><strong>Duration</strong> {{ tour.duration }}</p>
          <a class="button-whatsapp" [href]="tourWhatsAppUrl" target="_blank" rel="noopener">
            <app-whatsapp-icon />
            Ask on WhatsApp
          </a>
          <a class="button-primary" href="#tour-calculator">Calculate price</a>
        </aside>
      </div>

      <section id="tour-calculator" class="section-shell">
        <app-section-title
          label="Price calculator"
          title="Calculate before you book"
          description="Select your group size, package option, duration, and optional date before opening WhatsApp."
        />
        <app-price-calculator [tour]="tour" [showDate]="true" />
      </section>
    </section>
    } @else {

    <section class="container section-shell">
      <p class="empty-state">Tour not found.</p>
      <a class="button-primary" routerLink="/tours">Browse tours</a>
    </section>
    }
  `,
})
export class TourDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tour: Tour | undefined;
  tourWhatsAppUrl = whatsappUrl();

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.tour = tours.find((item) => item.slug === slug);
    if (!this.tour) {
      this.router.navigate(['/tours']);
      return;
    }
    this.tourWhatsAppUrl = whatsappUrl(
      `Hi! I'm interested in the ${this.tour.title} experience. Can you provide more information?`,
    );
  }
}
