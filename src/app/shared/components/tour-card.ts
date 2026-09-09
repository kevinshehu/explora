import { CurrencyPipe, NgForOf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tour } from '../../shared/models/travel.model';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [RouterLink, NgForOf, CurrencyPipe],
  template: `
    <article class="modern-card">
      <img class="card-media" [src]="tour.image" [alt]="tour.title" />
      <div class="card-content">
        <div class="card-top">
          <p class="badge">{{ tour.category }}</p>
          <p class="rating">{{ tour.rating }} ★ ({{ tour.reviews }})</p>
        </div>
        <h3>{{ tour.title }}</h3>
        <p class="tagline">{{ tour.location }}</p>
        <p class="desc">{{ tour.overview }}</p>
        <ul class="tour-highlights">
          <li *ngFor="let item of tour.highlights">{{ item }}</li>
        </ul>
        <div class="card-foot">
          <p class="price">from {{ tour.priceFrom | currency:'EUR' }}</p>
          <p class="duration">{{ tour.duration }}</p>
        </div>
        <a class="primary card-link" [routerLink]="['/tours', tour.slug]">
          View itinerary
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </a>
      </div>
    </article>
  `,
})
export class TourCard {
  @Input({ required: true }) tour!: Tour;
}
