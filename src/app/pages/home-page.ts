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
  promotionalTestimonials,
  tours,
} from '../data/travel-data';
import { DestinationCard } from '../shared/components/destination-card';
import { SectionTitle } from '../shared/components/section-title';
import { TestimonialCard } from '../shared/components/testimonial-card';
import { TourCard } from '../shared/components/tour-card';

const heroImage =
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=80';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, DestinationCard, TourCard, TestimonialCard, SectionTitle, RouterLink],
  template: `
    <section class="hero section-shell">
      <img class="hero-image" [src]="heroImage" alt="Albanian Riviera coastline" />
      <div class="container hero-content">
        <p class="hero-kicker">Discover the Albanian Riviera</p>
        <h1>Albanian Riviera, planned beautifully</h1>
        <p>
          Crystal-clear waters, hidden beaches, coastal villages, and signature experiences across Southern Albania.
        </p>
        <form class="search-strip" [formGroup]="searchForm" (ngSubmit)="search()">
          <label>
            <span>Destination</span>
            <input type="text" formControlName="destination" placeholder="e.g. Sarandë, Vlorë, Gjipe" />
          </label>
          <label>
            <span>Travel date</span>
            <input type="date" formControlName="startDate" />
          </label>
          <label>
            <span>Guests</span>
            <select formControlName="travellers">
              <option *ngFor="let count of travellerOptions" [value]="count">{{ count }} guest{{ count > 1 ? 's' : '' }}</option>
            </select>
          </label>
          <button class="button-primary" type="submit">
            <span class="material-symbols-outlined" aria-hidden="true">search</span>
            Search routes
          </button>
        </form>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Explore the Albanian Riviera"
        title="A modern coastal destination map"
        description="From Dhërmi to Vlorë, every route is crafted around beach time, village culture, and premium comfort."
      />
      <div class="riviera-showcase">
        <div class="riviera-featured">
          <app-destination-card [destination]="rivieraLead" [featured]="true" />
        </div>
        <div class="riviera-grid">
          <app-destination-card *ngFor="let destination of rivieraGrid" [destination]="destination" />
        </div>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Packages"
        title="Clean routes for the Ionian coast"
        description="Focused itineraries with private transfers, coastal stops, local guides, and clear pricing."
      />
      <div class="grid-3">
        <app-tour-card *ngFor="let tour of featuredTours" [tour]="tour" />
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Traveler stories"
        title="Trusted by modern travelers"
        description="Experiences shared by people discovering the Albanian South Riviera."
      />
      <div class="testimonial-grid">
        <app-testimonial-card *ngFor="let testimonial of testimonials" [testimonial]="testimonial" />
      </div>
    </section>

    <section class="container section-shell">
      <div class="cta-panel">
        <h2>Your South Albania plan starts here.</h2>
        <p>Choose a package and send your details directly to Explora on WhatsApp.</p>
        <div class="cta-actions">
          <a class="button-primary" routerLink="/booking">Plan on WhatsApp</a>
          <a class="button-ghost" routerLink="/destinations">Explore destinations</a>
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
  rivieraLead = destinations[0];
  rivieraGrid = destinations.slice(1, 8);
  featuredTours = tours.slice(0, 3);
  testimonials = promotionalTestimonials;
  travellerOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

  constructor() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.searchForm = this.fb.group({
      destination: ['', Validators.required],
      startDate: [tomorrow.toISOString().slice(0, 10)],
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
