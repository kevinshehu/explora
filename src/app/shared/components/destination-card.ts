import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Destination } from '../../shared/models/travel.model';

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <article class="modern-card">
      <img class="card-media" [src]="destination.image" [alt]="destination.city" />
      <div class="card-content">
        <div class="card-top">
          <p class="badge">{{ destination.category }}</p>
          <p class="rating">{{ destination.rating }} ★</p>
        </div>
        <h3>{{ destination.city }}, {{ destination.country }}</h3>
        <p class="tagline">{{ destination.tagline }}</p>
        <p class="desc">{{ destination.description }}</p>
        <div class="meta">
          <p><span class="material-symbols-outlined">route</span> {{ destination.experiences }} experiences</p>
          <p><span class="material-symbols-outlined">reviews</span> {{ destination.reviews }} reviews</p>
        </div>
        <div class="card-foot">
          <p class="price">from {{ destination.priceFrom | currency:'USD' }}</p>
          <a [routerLink]="['/destinations', destination.slug]">Explore</a>
        </div>
      </div>
    </article>
  `,
})
export class DestinationCard {
  @Input({ required: true }) destination!: Destination;
}
