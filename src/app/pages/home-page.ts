import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { destinations } from '../data/travel-data';
import { SectionTitle } from '../shared/components/section-title';
import { whatsappUrl } from '../shared/whatsapp';

const heroImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, SectionTitle, CurrencyPipe],
  template: `
    <section class="luxury-home-hero">
      <div class="luxury-hero-image" [style.background-image]="'url(' + heroImage + ')'" aria-hidden="true"></div>
      <div class="container luxury-hero-inner">
        <div class="luxury-hero-copy">
          <p class="eyebrow">Luxury villas in Albania</p>
          <h1>Luxury Villas in Mykonos</h1>
          <p class="lead">
            Discover a handpicked collection of elegant beach villas, private pools, and personalized stays across the Riviera.
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
          <h2>Villa Azalea</h2>
          <div class="booking-meta">
            <span>Sea view</span>
            <span>Private pool</span>
            <span>Beach access</span>
          </div>
          <div class="booking-price-row">
            <span>From</span>
            <strong>€1,200</strong>
          </div>
          <div class="booking-price-row muted">
            <span>Location</span>
            <strong>Aleomandra</strong>
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
        label="Personalized tourism services"
        title="Everything you need for a complete Riviera holiday"
        description="From airport transfers to private chefs and curated island adventures, all your planning is handled seamlessly."
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

    <section class="container section-shell">
      <app-section-title
        label="Top villas"
        title="These stays are highly recommended for location, cleanliness, and amenities"
      />

      <div class="showcase-grid">
        @for (destination of featuredDestinations; track destination.id) {
          <article class="showcase-card">
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
                <a [routerLink]="['/destinations', destination.slug]">View stay</a>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="about-band">
      <div class="container about-band-inner">
        <div class="about-image" aria-hidden="true"></div>
        <div class="about-copy">
          <p class="eyebrow light">About us</p>
          <h2>Need to find a paradise-like getaway island?</h2>
          <p>
            Mykonos is the perfect destination for memorable escapes, and we are here to support the vacation of your dreams with the right villa, pace, and service.
          </p>
          <a class="button-primary" routerLink="/destinations">Read more</a>
        </div>
      </div>
    </section>

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
    'Villa Magna',
    'Villa Azalea',
    'Villa Zen',
    'Villa Dreamrock',
    'Villa Anassa',
    'Villa Chanel',
    'Villa Iconic',
    'Villa Diamond',
    'Villa Infinity Blue',
    'Villa Skye',
    'Villa Negra',
    'Villa Phos',
  ];
  featuredDestinations = destinations.slice(0, 4);
  services = [
    {
      title: 'Chauffeur services',
      copy: 'Arrive on time with style, comfort, and effortless island transfers.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Private chefs',
      copy: 'Enjoy refined dining in your villa with personalized menus and local flavors.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Yacht services',
      copy: 'Let us arrange elegant day escapes, coastal dining, and island-hopping moments.',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'VIP bookings',
      copy: 'From nightlife entries to premium experiences, we make every reservation effortless.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    },
  ];
  lifestyleItems = [
    {
      label: 'View from our villa',
      title: 'Sunset moments by the sea',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Mykonos lifestyle',
      title: 'The rhythm of a slow island summer',
      image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1000&q=80',
    },
    {
      label: 'Travel notes',
      title: 'Chic corners, beach clubs, and quiet escapes',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80',
    },
  ];
  heroWhatsAppUrl = whatsappUrl('Hi! I want to book a Riviera trip with Explora.');
}
