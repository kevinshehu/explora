import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { destinations } from '../data/travel-data';
import { SectionTitle } from '../shared/components/section-title';
import { whatsappUrl } from '../shared/whatsapp';
import { ExpandLink } from '../shared/animation/expand-link';
import { BeachDive } from './experiences/beach-dive';
import { BoatExperience } from './experiences/boat-experience';
import { CoastalDrive } from './experiences/coastal-drive';
import { ConciergeExperience } from './experiences/concierge-experience';
import { RivieraJourney } from './experiences/riviera-journey';
import { SunsetExperience } from './experiences/sunset-experience';
import { VillaEntrance } from './experiences/villa-entrance';

const heroImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    SectionTitle,
    CurrencyPipe,
    BoatExperience,
    RivieraJourney,
    CoastalDrive,
    VillaEntrance,
    ConciergeExperience,
    BeachDive,
    SunsetExperience,
    ExpandLink,
  ],
  template: `
    <section class="luxury-home-hero">
      <div class="luxury-hero-image" [style.background-image]="'url(' + heroImage + ')'" aria-hidden="true"></div>
      <div class="container luxury-hero-inner">
        <div class="luxury-hero-copy">
          <p class="eyebrow">Luxury stays in South Albania</p>
          <h1>Live the Riviera at its best</h1>
          <p class="lead">
            Discover elegant villas, quiet coves, and unforgettable sea views across southern Albania’s most beautiful coastline.
          </p>
          <div class="hero-actions">
            <a class="button-primary" routerLink="/destinations">Explore villas</a>
            <a class="button-ghost light" [href]="heroWhatsAppUrl" target="_blank" rel="noopener">Plan by WhatsApp</a>
          </div>
          <div class="luxury-stats">
            <div>
              <strong>161</strong>
              <span>Villas</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Concierge</span>
            </div>
            <div>
              <strong>€129</strong>
              <span>p/night</span>
            </div>
          </div>
        </div>

        <aside class="luxury-hero-booking">
          <p class="panel-label">Most loved</p>
          <h2>Dhërmi Escape</h2>
          <div class="booking-meta">
            <span>Clifftop view</span>
            <span>Private pool</span>
            <span>Beach access</span>
          </div>
          <div class="booking-price-row">
            <span>From</span>
            <strong>€1,200</strong>
          </div>
          <div class="booking-price-row muted">
            <span>Location</span>
            <strong>Dhërmi</strong>
          </div>
          <a class="button-primary full" routerLink="/destinations">Check availability</a>
        </aside>
      </div>
    </section>

    <div class="villa-strip-wrap">
      <div class="container villa-strip">
        @for (name of villaNames; track name) {
          <span>{{ name }}</span>
        }
      </div>
    </div>

    <section class="container section-shell">
      <app-section-title
        label="Tailored Riviera services"
        title="Everything you need for a complete Albanian coast escape"
        description="From airport transfers to private chefs and curated coastal adventures, every detail is planned around your best beach days."
      />

      <div class="service-grid">
        @for (service of services; track service.title) {
          <article class="service-card">
            <div class="service-image" [style.background-image]="'url(' + service.image + ')'" aria-hidden="true"></div>
            <div class="service-body">
              <h3>{{ service.title }}</h3>
              <p>{{ service.copy }}</p>
              <a routerLink="/destinations">See more</a>
            </div>
          </article>
        }
      </div>
    </section>

    <app-boat-experience />

    <app-riviera-journey />

    <app-coastal-drive />

    <section class="container section-shell">
      <app-section-title
        label="Top villas"
        title="These stays are highly recommended for location, cleanliness, and amenities"
      />

      <div class="showcase-grid">
        @for (destination of featuredDestinations; track destination.id) {
          <article
            class="showcase-card is-expandable"
            [appExpand]="destination.image"
            [appExpandTo]="['/destinations', destination.slug]"
            appExpandVariant="villa"
            [attr.aria-label]="'View ' + destination.city"
          >
            <img [src]="destination.image" [alt]="destination.city" />
            <div class="showcase-content">
              <div class="showcase-meta">
                <span>{{ destination.category }}</span>
                <span>{{ destination.rating }} ★</span>
              </div>
              <h3>{{ destination.city }}, {{ destination.country }}</h3>
              <p>{{ destination.tagline }}</p>
              <div class="showcase-footer">
                <strong>from {{ destination.priceFrom | currency:'EUR' }}</strong>
                <span class="showcase-cta">View stay <span class="showcase-arrow" aria-hidden="true">→</span></span>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    <app-villa-entrance />

    <app-concierge-experience />

    <app-beach-dive />

    <section class="about-band">
      <div class="container about-band-inner">
        <div class="about-image" aria-hidden="true"></div>
        <div class="about-copy">
          <p class="eyebrow light">About us</p>
          <h2>Need a coastline that feels both wild and refined?</h2>
          <p>
            The South Riviera is a perfect blend of turquoise water, dramatic cliffs, hidden coves, and slow luxury. We help you choose the right stay and shape a getaway that feels unmistakably Albanian.
          </p>
          <a class="button-primary" routerLink="/destinations">Read more</a>
        </div>
      </div>
    </section>

    <app-sunset-experience />

    <section class="container section-shell">
      <app-section-title
        label="Explore"
        title="Lifestyle and inspiration"
      />

      <div class="lifestyle-grid">
        @for (item of lifestyleItems; track item.title) {
          <article class="lifestyle-card">
            <div class="lifestyle-image" [style.background-image]="'url(' + item.image + ')'" aria-hidden="true"></div>
            <div class="lifestyle-body">
              <span>{{ item.label }}</span>
              <h3>{{ item.title }}</h3>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class HomePage {
  heroImage = heroImage;
  villaNames = [
    'Dhërmi',
    'Himarë',
    'Ksamil',
    'Sarandë',
    'Qeparo',
    'Borsh',
    'Jale',
    'Gjipe',
    'Porto Palermo',
    'Llogara',
    'Borsh Cove',
    'Albanian Riviera',
  ];
  featuredDestinations = destinations.slice(0, 4);
  services = [
    {
      title: 'Airport transfers',
      copy: 'Arrive smoothly with local drivers and easy connections along the coast.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Private chefs',
      copy: 'Enjoy refined dining in your villa with personalized menus and local flavors.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Coastal boat days',
      copy: 'Let us arrange elegant day escapes, swimming stops, and hidden bay discoveries.',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Villa concierge',
      copy: 'From beach club bookings to local recommendations, everything is handled with ease.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    },
  ];
  lifestyleItems = [
    {
      label: 'Coastal views',
      title: 'Sunset moments over the Ionian sea',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'South Albania',
      title: 'The rhythm of a slow Riviera summer',
      image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Travel notes',
      title: 'Quiet coves, beach clubs, and coastal escapes',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80',
    },
  ];
  heroWhatsAppUrl = whatsappUrl('Hi! I want to book a Riviera trip with Explora.');
}
