import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { destinations, tours } from '../data/travel-data';
import { Destination } from '../shared/models/travel.model';
import { TourCard } from '../shared/components/tour-card';
import { SectionTitle } from '../shared/components/section-title';
import { WhatsappIcon } from '../shared/components/whatsapp-icon';
import { whatsappUrl } from '../shared/whatsapp';
import { PriceCalculator } from '../shared/components/price-calculator';

@Component({
  selector: 'app-destination-detail-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, TourCard, SectionTitle, WhatsappIcon, PriceCalculator],
  template: `
    @if (destination) {
    <section class="container section-shell">
      <a class="back-link" routerLink="/destinations">← Back to destinations</a>
      <div class="detail-header">
        <div class="detail-title-group">
          <p class="section-label">Destination on the Albanian Riviera</p>
          <h1>{{ destination.city }}, {{ destination.country }}</h1>
          <p class="tagline">{{ destination.tagline }}</p>
        </div>
        <div class="detail-price">
          <p>From</p>
          <p class="value">{{ destination.priceFrom | currency:'EUR' }}</p>
          <p>{{ destination.rating }} ★ ({{ destination.reviews }} reviews)</p>
        </div>
      </div>

      <div class="gallery-grid">
        <img [src]="destination.image" [alt]="destination.city" class="gallery-main" />
        @for (image of destination.gallery; track image) {
          <img [src]="image" [alt]="destination.city" class="gallery-thumb" />
        }
      </div>

      <div class="two-col">
        <div>
          <app-section-title title="Overview" [description]="destination.longDescription" />
          <h3>Highlights</h3>
          <ul class="feature-bullets">
            @for (item of destination.highlights; track item) {
              <li>{{ item }}</li>
            }
          </ul>
          <h3>Popular activities</h3>
          <div class="chip-row">
            @for (activity of destination.activities; track activity) {
              <span>{{ activity }}</span>
            }
          </div>
        </div>
        <aside class="info-card">
          <p><strong>Category</strong> {{ destination.category }}</p>
          <p><strong>Available experiences</strong> {{ destination.experiences }}</p>
          <p><strong>Best for</strong> {{ destination.tags.join(', ') }}</p>
          <a class="button-whatsapp" [href]="destinationWhatsAppUrl" target="_blank" rel="noopener">
            <app-whatsapp-icon />
            Ask on WhatsApp
          </a>
          <a class="button-primary" href="#destination-calculator">Calculate price</a>
          <a class="button-ghost" [routerLink]="['/tours']" [queryParams]="{ destination: destination.city }">View package list</a>
        </aside>
      </div>

      @if (relatedTours[0]; as primaryTour) {
      <section id="destination-calculator" class="section-shell">
        <app-section-title
          label="Price calculator"
          title="Estimate a {{ destination.city }} experience"
          description="Choose people, package level, and duration before opening WhatsApp."
        />
        <app-price-calculator [tour]="primaryTour" [showDate]="true" />
      </section>
      }

      <app-section-title
        title="Available tours"
        description="Packages selected to match this destination's character and best travel windows."
      />
      <div class="grid-3">
        @for (tour of relatedTours; track tour.id) {
          <app-tour-card [tour]="tour" />
        }
      </div>
    </section>
    } @else {

    <section class="container section-shell">
      <p class="empty-state">Destination not found.</p>
      <a class="button-primary" routerLink="/destinations">Explore destinations</a>
    </section>
    }
  `,
})
export class DestinationDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  destination: Destination | undefined = undefined;
  relatedTours = tours.slice(0, 0);
  destinationWhatsAppUrl = whatsappUrl();

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.destination = destinations.find((item) => item.slug === slug);
    if (!this.destination) {
      this.router.navigate(['/destinations']);
      return;
    }
    this.relatedTours = tours.filter(
      (tour) => tour.destinationId === this.destination!.id,
    );
    this.destinationWhatsAppUrl = whatsappUrl(
      `Hi! I'm interested in the ${this.destination.city} experience. Can you provide more information?`,
    );
  }
}
