import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { tours } from '../data/travel-data';
import { Tour } from '../shared/models/travel.model';
import { WhatsappIcon } from '../shared/components/whatsapp-icon';
import { whatsappUrl } from '../shared/whatsapp';

@Component({
  selector: 'app-tour-detail-page',
  standalone: true,
  imports: [NgIf, NgForOf, CurrencyPipe, RouterLink, WhatsappIcon],
  template: `
    <section *ngIf="tour" class="container section-shell">
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
        <img *ngFor="let image of tour.gallery" [src]="image" [alt]="tour.title" class="gallery-thumb" />
      </div>

      <div class="two-col">
        <div>
          <h3>Overview</h3>
          <p class="detail-copy">{{ tour.overview }}</p>

          <h3>Highlights</h3>
          <ul class="feature-bullets">
            <li *ngFor="let item of tour.highlights">{{ item }}</li>
          </ul>

          <h3>Itinerary</h3>
          <ol class="itinerary-list">
            <li *ngFor="let item of tour.itinerary">{{ item }}</li>
          </ol>

          <h3>Included</h3>
          <ul class="feature-bullets">
            <li *ngFor="let item of tour.included">{{ item }}</li>
          </ul>

          <h3>Not included</h3>
          <ul class="feature-bullets muted-list">
            <li *ngFor="let item of tour.excluded">{{ item }}</li>
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
          <a class="button-primary" [routerLink]="['/booking']" [queryParams]="{ tour: tour.slug }">Plan details</a>
        </aside>
      </div>
    </section>

    <section *ngIf="!tour" class="container section-shell">
      <p class="empty-state">Tour not found.</p>
      <a class="button-primary" routerLink="/tours">Browse tours</a>
    </section>
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
