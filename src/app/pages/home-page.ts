import { NgForOf } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  destinations,
  featuredDestinationIds,
  promotionalTestimonials,
  tours,
} from '../data/travel-data';
import { DestinationCard } from '../shared/components/destination-card';
import { SectionTitle } from '../shared/components/section-title';
import { TestimonialCard } from '../shared/components/testimonial-card';
import { TourCard } from '../shared/components/tour-card';

const heroImage =
  'https://images.unsplash.com/photo-1539650116574-75c0c0b3fa1e?auto=format&fit=crop&w=1920&q=80';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, DestinationCard, TourCard, TestimonialCard, SectionTitle, RouterLink],
  template: `
    <section class="hero section-shell">
      <img class="hero-image" [src]="heroImage" alt="Traveler on mountain" />
      <div class="container hero-content">
        <p class="hero-kicker">Premium destinations for modern travel</p>
        <h1>Explore the world with Explora</h1>
        <p>
          Discover carefully curated trips built around beautiful places, meaningful experiences,
          and seamless planning.
        </p>
        <form class="search-strip" [formGroup]="searchForm" (ngSubmit)="search()">
          <label>
            <span>Destination</span>
            <input type="text" formControlName="destination" placeholder="Where do you want to go?" />
          </label>
          <label>
            <span>Check in</span>
            <input type="date" formControlName="startDate" />
          </label>
          <label>
            <span>Check out</span>
            <input type="date" formControlName="endDate" />
          </label>
          <label>
            <span>Guests</span>
            <select formControlName="travellers">
              <option *ngFor="let count of travellerOptions" [value]="count">{{ count }} traveller{{ count > 1 ? 's' : '' }}</option>
            </select>
          </label>
          <button class="button-primary" type="submit">Search</button>
        </form>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Featured Destinations"
        title="Top places to discover now"
        description="Editor picks balancing iconic landmarks, scenic stays, and premium access."
      />
      <div class="grid-3">
        <app-destination-card *ngFor="let destination of featuredDestinations" [destination]="destination" />
      </div>
    </section>

    <section class="container section-shell">
      <div class="two-col">
        <div>
          <app-section-title
            label="Popular destinations"
            title="Where travelers go next"
            description="From islands to mountain retreats, each destination is selected for standout moments."
          />
          <ul class="feature-list">
            <li *ngFor="let destination of popularDestinations">{{ destination }}</li>
          </ul>
        </div>
        <div class="panel">
          <h3>Need a faster plan?</h3>
          <p>
            Compare tours in minutes and lock in a travel flow in one confirmation.
          </p>
          <a routerLink="/booking" class="button-primary">Open booking</a>
        </div>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Recommended tours"
        title="Tailored packages for every traveler"
        description="Choose experiences by mood: adventure, luxury, wellness, and cultural discovery."
      />
      <div class="grid-3">
        <app-tour-card *ngFor="let tour of featuredTours" [tour]="tour" />
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Why choose Explora"
        title="Design-led travel, no compromises"
        description="Curated logistics, practical timelines, and premium service partners."
      />
      <div class="feature-grid">
        <article>
          <h3>Destination-first planning</h3>
          <p>Every trip is built around local experiences that genuinely represent the destination.</p>
        </article>
        <article>
          <h3>Transparent pricing</h3>
          <p>Clear packages with no unnecessary upsells and easy-to-read includes.</p>
        </article>
        <article>
          <h3>Modern UX</h3>
          <p>Fast search, instant filters, and clear booking states on desktop and mobile.</p>
        </article>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Traveler stories"
        title="Guests trusted Explora"
        description="Real feedback from families, solo travelers, and couples."
      />
      <div class="testimonial-grid">
        <app-testimonial-card *ngFor="let testimonial of testimonials" [testimonial]="testimonial" />
      </div>
    </section>

    <section class="container section-shell">
      <div class="cta-panel">
        <h2>Ready to begin your next journey?</h2>
        <p>Browse all destinations or plan a custom experience today.</p>
        <div class="cta-actions">
          <a class="button-primary" routerLink="/destinations">Explore destinations</a>
          <a class="button-ghost" routerLink="/tours">See tours</a>
        </div>
      </div>
    </section>
  `,
})
export class HomePage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  searchForm: ReturnType<typeof this.fb.group>;
  heroImage = heroImage;
  featuredDestinations = destinations.filter((item) => featuredDestinationIds.includes(item.id));
  featuredTours = tours.slice(0, 3);
  popularDestinations = ['Azores', 'Bali', 'Iceland', 'Santorini', 'Kyoto', 'Norway Fjords'];
  testimonials = promotionalTestimonials;
  travellerOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

  constructor() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    this.searchForm = this.fb.group({
      destination: ['', Validators.required],
      startDate: [tomorrow.toISOString().slice(0, 10)],
      endDate: [nextWeek.toISOString().slice(0, 10)],
      travellers: ['2', Validators.required],
    });
  }

  search() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const value = this.searchForm.value;
    this.router.navigate(['/tours'], {
      queryParams: {
        destination: value.destination,
        startDate: value.startDate,
        travellers: value.travellers,
      },
    });
  }
}
