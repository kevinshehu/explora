import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { destinations } from '../data/travel-data';
import { DestinationCard } from '../shared/components/destination-card';

@Component({
  selector: 'app-destinations-page',
  standalone: true,
  imports: [ReactiveFormsModule, DestinationCard],
  template: `
    <section class="destination-page-hero">
      <div class="destination-page-hero-image" aria-hidden="true"></div>
      <div class="container destination-page-hero-inner">
        <div class="destination-page-copy">
          <p class="eyebrow">Explore Southern Albania</p>
          <h1>Find a stay that feels like your kind of beach day.</h1>
          <p>
            Browse beach villas, coastal escapes, and curated stays designed for relaxed luxury and easy planning.
          </p>
        </div>
      </div>
    </section>

    <section class="container section-shell destination-page-shell">
      <form class="luxury-filters" [formGroup]="filterForm">
        <label>
          <span>Search</span>
          <input type="text" formControlName="query" placeholder="Destination or vibe" />
        </label>
        <label>
          <span>Style</span>
          <select formControlName="category">
            <option value="all">All styles</option>
            @for (category of categories; track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </label>
        <label>
          <span>Experiences</span>
          <select formControlName="experienceCount">
            <option value="all">Any</option>
            <option value="10">10+ experiences</option>
            <option value="20">20+</option>
            <option value="30">30+</option>
          </select>
        </label>
        <label>
          <span>Max €</span>
          <input type="number" formControlName="maxPrice" min="70" step="20" placeholder="2500" />
        </label>
        <label>
          <span>Sort</span>
          <select formControlName="sort">
            <option value="featured">Featured</option>
            <option value="priceLow">Price: low to high</option>
            <option value="priceHigh">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </form>

      <div class="results-summary">
        <span>Showing {{ filtered.length }} stays in South Albania</span>
      </div>

      @if (filtered.length > 0) {
        <div class="grid-3 luxury-grid">
          @for (item of filtered; track item.id) {
            <app-destination-card [destination]="item" />
          }
        </div>
      } @else {
        <p class="empty-state">No destinations match your current filters. Try a broader search.</p>
      }
    </section>
  `,
})
export class DestinationsPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly allDestinations = destinations;

  categories = [...new Set(this.allDestinations.flatMap((destination) => destination.tags))].sort();

  filterForm = this.fb.group({
    query: [''],
    category: ['all', Validators.required],
    experienceCount: ['all'],
    maxPrice: ['2500'],
    sort: ['featured'],
  });

  filtered = this.allDestinations.slice();

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const category = params.get('category');
      const query = params.get('query');
      const maxPrice = params.get('maxPrice');
      const sort = params.get('sort');
      this.filterForm.patchValue(
        {
          category: category ?? 'all',
          query: query ?? '',
          maxPrice: maxPrice ?? '2500',
          sort: sort ?? 'featured',
        },
        { emitEvent: false },
      );
      this.applyFilters();
    });

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.applyFilters();
  }

  applyFilters() {
    const values = this.filterForm.value;
    let result = [...this.allDestinations];

    const query = (values.query ?? '').toLowerCase();
    if (query) {
      result = result.filter(
        (destination) =>
          destination.city.toLowerCase().includes(query) ||
          destination.country.toLowerCase().includes(query) ||
          destination.tagline.toLowerCase().includes(query) ||
          destination.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (values.category && values.category !== 'all') {
      result = result.filter((destination) => destination.tags.includes(values.category as string));
    }

    const experiencesLimit = Number(values.experienceCount);
    if (values.experienceCount && values.experienceCount !== 'all') {
      result = result.filter((destination) => destination.experiences >= experiencesLimit);
    }

    const maxPrice = Number(values.maxPrice);
    if (maxPrice > 0) {
      result = result.filter((destination) => destination.priceFrom <= maxPrice);
    }

    if (values.sort === 'priceLow') {
      result.sort((a, b) => a.priceFrom - b.priceFrom);
    } else if (values.sort === 'priceHigh') {
      result.sort((a, b) => b.priceFrom - a.priceFrom);
    } else if (values.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    this.filtered = result;

    this.router.navigate(['/destinations'], {
      queryParams: {
        query: values.query ?? '',
        category: values.category ?? 'all',
        experienceCount: values.experienceCount ?? 'all',
        maxPrice: values.maxPrice ?? '2500',
        sort: values.sort ?? 'featured',
      },
      queryParamsHandling: 'replace',
    });
  }
}
