import { NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { destinations, tours } from '../data/travel-data';
import { TourCard } from '../shared/components/tour-card';
import { SectionTitle } from '../shared/components/section-title';
import { Tour } from '../shared/models/travel.model';

@Component({
  selector: 'app-tours-page',
  standalone: true,
  imports: [NgForOf, NgIf, ReactiveFormsModule, TourCard, SectionTitle],
  template: `
    <section class="container section-shell">
      <app-section-title
        label="Tours"
        title="Modern tour packages"
        description="Curated packages with clear duration, budget, and rating signals."
      />
      <form class="filters" [formGroup]="filterForm">
        <input type="text" formControlName="query" placeholder="Search tours" />
        <select formControlName="destination">
          <option value="all">All destinations</option>
          <option *ngFor="let destination of destinationOptions" [value]="destination">{{ destination }}</option>
        </select>
        <select formControlName="category">
          <option value="all">All themes</option>
          <option value="Adventure">Adventure</option>
          <option value="Luxury">Luxury</option>
          <option value="Wellness">Wellness</option>
          <option value="Culture">Culture</option>
          <option value="Scenic">Scenic</option>
          <option value="Premium Nature">Premium Nature</option>
        </select>
        <select formControlName="sort">
          <option value="featured">Featured</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
          <option value="duration">Duration</option>
          <option value="rating">Top rated</option>
        </select>
      </form>

      <div class="results-summary">Showing {{ filteredTours.length }} tours</div>

      <ng-container *ngIf="filteredTours.length > 0; else emptyState">
        <div class="grid-3">
          <app-tour-card *ngFor="let tour of filteredTours" [tour]="tour" />
        </div>
      </ng-container>
      <ng-template #emptyState>
        <p class="empty-state">No tours match your search. Adjust filters and try again.</p>
      </ng-template>
    </section>
  `,
})
export class ToursPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  destinationOptions = destinations.map((destination) => destination.city);

  tours = tours;
  filteredTours: Tour[] = [];

  filterForm = this.fb.group({
    query: [''],
    destination: ['all', Validators.required],
    category: ['all'],
    sort: ['featured'],
  });

  constructor() {
    this.applyFilters();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('destination') ?? '';
      const sort = params.get('sort') ?? 'featured';
      const category = params.get('category') ?? 'all';
      this.filterForm.patchValue(
        {
          query,
          category,
          sort,
        },
        { emitEvent: false },
      );
      this.applyFilters();
    });
  }

  applyFilters() {
    const values = this.filterForm.value;
    let result = [...this.tours];

    const query = String(values.query ?? '').toLowerCase();
    if (query) {
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.overview.toLowerCase().includes(query),
      );
    }

    if (values.destination && values.destination !== 'all') {
      result = result.filter((tour) => tour.location.includes(values.destination as string));
    }

    if (values.category && values.category !== 'all') {
      result = result.filter((tour) => tour.category === values.category);
    }

    if (values.sort === 'priceLow') {
      result.sort((a, b) => a.priceFrom - b.priceFrom);
    } else if (values.sort === 'priceHigh') {
      result.sort((a, b) => b.priceFrom - a.priceFrom);
    } else if (values.sort === 'duration') {
      result.sort((a, b) => a.durationDays - b.durationDays);
    } else if (values.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    this.filteredTours = result;

    this.router.navigate(['/tours'], {
      queryParams: {
        query: values.query,
        destination: values.destination,
        category: values.category,
        sort: values.sort,
      },
      queryParamsHandling: 'replace',
    });
  }
}
