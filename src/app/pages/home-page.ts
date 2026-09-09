import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { destinations } from '../data/travel-data';
import { DestinationCard } from '../shared/components/destination-card';
import { SectionTitle } from '../shared/components/section-title';
import { WhatsappIcon } from '../shared/components/whatsapp-icon';
import { whatsappUrl } from '../shared/whatsapp';

const heroImage =
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=80';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DestinationCard, SectionTitle, RouterLink, WhatsappIcon],
  template: `
    <section class="hero section-shell">
      <img class="hero-image" [src]="heroImage" alt="Albanian Riviera coastline" />
      <div class="container hero-content">
        <div class="hero-panel">
          <p class="hero-kicker">Explora</p>
          <h1>Simple Riviera travel planning</h1>
          <p>Choose destination, pick experience, book fast on WhatsApp.</p>
          <div class="hero-actions">
            <a class="button-primary" routerLink="/destinations">Explore destinations</a>
            <a class="button-whatsapp" [href]="heroWhatsAppUrl" target="_blank" rel="noopener">
              <app-whatsapp-icon />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Destinations"
        title="Top places"
        description="Clean destination list for quick choice."
      />
      <div class="riviera-grid">
        @for (destination of rivieraDestinations; track destination.id) {
          <app-destination-card [destination]="destination" />
        }
      </div>
    </section>

  `,
})
export class HomePage {
  heroImage = heroImage;
  rivieraDestinations = destinations.slice(0, 6);
  heroWhatsAppUrl = whatsappUrl('Hi! I want to book a Riviera trip with Explora.');
}
