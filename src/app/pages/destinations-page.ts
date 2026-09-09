import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { destinations } from '../data/travel-data';
import { DestinationCard } from '../shared/components/destination-card';
import { SectionTitle } from '../shared/components/section-title';

@Component({
  selector: 'app-destinations-page',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule, DestinationCard, SectionTitle],
  template: `
    <section class="container section-shell page-with-rail">
      <app-section-title
        label="Destinations"
        title="Find your next premium destination"
        description="Use category and budget filters to discover places crafted for meaningful stays."
      />
      <form class="filters" [formGroup]="filterForm">
        <input type="text" formControlName="query" placeholder="Search destination" />
        <select formControlName="category" [disabled]="categories.length === 0">
          <option value="all">All categories</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
        <select formControlName="experienceCount">
          <option value="all">Any experiences</option>
          <option value="20">20+</option>
          <option value="30">30+</option>
          <option value="40">40+</option>
        </select>
        <input type="number" formControlName="maxPrice" min="500" step="100" />
        <select formControlName="sort">
          <option value="featured">Featured</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </form>

      <div class="results-summary">Showing {{ filtered.length }} destinations</div>

      <ng-container *ngIf="filtered.length > 0; else emptyState">
        <div class="grid-3">
          <app-destination-card *ngFor="let item of filtered" [destination]="item" />
        </div>
      </ng-container>
      <ng-template #emptyState>
        <p class="empty-state">No destinations match your current filters. Try a broader category.</p>
      </ng-template>
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
