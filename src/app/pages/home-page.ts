import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  destinations,
  promotionalTestimonials,
  tours,
} from '../data/travel-data';
import { DestinationCard } from '../shared/components/destination-card';
import { SectionTitle } from '../shared/components/section-title';
import { TestimonialCard } from '../shared/components/testimonial-card';
import { TourCard } from '../shared/components/tour-card';
import { WhatsappIcon } from '../shared/components/whatsapp-icon';
import { PriceCalculator } from '../shared/components/price-calculator';
import { whatsappUrl } from '../shared/whatsapp';

const heroImage =
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=80';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DestinationCard, TourCard, TestimonialCard, SectionTitle, RouterLink, WhatsappIcon, PriceCalculator],
  template: `
    <section class="hero section-shell">
      <img class="hero-image" [src]="heroImage" alt="Albanian Riviera coastline" />
      <div class="container hero-content">
        <p class="hero-kicker">Discover the Albanian Riviera</p>
        <h1>Albanian Riviera, planned beautifully</h1>
        <p>
          Crystal-clear waters, hidden beaches, coastal villages, and signature experiences across Southern Albania.
        </p>
        <div class="hero-actions">
          <a class="button-primary" routerLink="/destinations">Explore destinations</a>
          <a class="button-whatsapp hero-whatsapp" [href]="heroWhatsAppUrl" target="_blank" rel="noopener">
            <app-whatsapp-icon />
            Ask Explora
          </a>
        </div>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Explore the Albanian Riviera"
        title="A modern coastal destination map"
        description="From Dhërmi to Vlorë, every route is crafted around beach time, village culture, and premium comfort."
      />
      <div class="riviera-grid">
        @for (destination of rivieraDestinations; track destination.id) {
          <app-destination-card [destination]="destination" />
        }
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Price calculators"
        title="Know your estimate before WhatsApp"
        description="Choose people, package level, and trip length. Explora handles availability and final details with you on WhatsApp."
      />
      <div class="calculator-grid">
        @for (tour of calculatorTours; track tour.id) {
          <app-price-calculator [tour]="tour" [showDate]="false" />
        }
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Why Explora"
        title="Focused on South Albania"
        description="Simple pricing, local route planning, and fast WhatsApp support for travelers who want clear next steps."
      />
      <div class="feature-grid">
        <article>
          <h3>Curated coastal routes</h3>
          <p>Each experience is built around real Riviera highlights, not generic travel lists.</p>
        </article>
        <article>
          <h3>Clear estimates</h3>
          <p>See the price before starting the booking conversation.</p>
        </article>
        <article>
          <h3>WhatsApp-first booking</h3>
          <p>Ask questions, confirm availability, and finalize details directly with Explora.</p>
        </article>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Packages"
        title="Clean routes for the Ionian coast"
        description="Focused itineraries with private transfers, coastal stops, local guides, and clear pricing."
      />
      <div class="grid-3">
        @for (tour of featuredTours; track tour.id) {
          <app-tour-card [tour]="tour" />
        }
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Traveler stories"
        title="Trusted by modern travelers"
        description="Experiences shared by people discovering the Albanian South Riviera."
      />
      <div class="testimonial-grid">
        @for (testimonial of testimonials; track testimonial.name) {
          <app-testimonial-card [testimonial]="testimonial" />
        }
      </div>
    </section>

    <section class="container section-shell">
      <div class="cta-panel">
        <h2>Your South Albania plan starts here.</h2>
        <p>Choose a package and send your details directly to Explora on WhatsApp.</p>
        <div class="cta-actions">
          <a class="button-whatsapp" [href]="generalWhatsAppUrl" target="_blank" rel="noopener">
            <app-whatsapp-icon />
            Plan on WhatsApp
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HomePage {
  heroImage = heroImage;
  rivieraDestinations = destinations.slice(0, 8);
  featuredTours = tours.slice(0, 3);
  calculatorTours = tours.slice(0, 2);
  testimonials = promotionalTestimonials;
  generalWhatsAppUrl = whatsappUrl('Hi! I would like to plan a South Albania trip with Explora.');
  heroWhatsAppUrl = whatsappUrl('Hi! I would like to discover the Albanian Riviera with Explora. Can you help me choose the right destination or experience?');
}
