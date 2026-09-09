import { Component } from '@angular/core';
import { SectionTitle } from '../shared/components/section-title';

@Component({
  selector: 'app-concierge-page',
  standalone: true,
  imports: [SectionTitle],
  template: `
    <section class="page-hero page-hero-soft">
      <div class="container page-hero-inner">
        <p class="eyebrow">Concierge</p>
        <h1>Everything arranged, nothing complicated.</h1>
      </div>
    </section>

    <section class="container section-shell">
      <app-section-title
        label="Our services"
        title="Add ease to every part of your Riviera stay"
        description="From transfers and beach club access to chef bookings and local route planning, we create a smoother arrival and a more memorable stay."
      />

      <div class="service-grid large">
        <article class="service-card">
          <div class="service-image" style="background-image: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80')" aria-hidden="true"></div>
          <div class="service-body">
            <h3>Airport transfers</h3>
            <p>Private airport pickups and smooth coastal transfers across the Riviera.</p>
          </div>
        </article>

        <article class="service-card">
          <div class="service-image" style="background-image: url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80')" aria-hidden="true"></div>
          <div class="service-body">
            <h3>Private chefs</h3>
            <p>Curated dining experiences in your villa with tailored menus and local ingredients.</p>
          </div>
        </article>

        <article class="service-card">
          <div class="service-image" style="background-image: url('https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80')" aria-hidden="true"></div>
          <div class="service-body">
            <h3>Coastal excursions</h3>
            <p>Boat days, hidden-cove escapes, and day plans designed for easy luxury.</p>
          </div>
        </article>

        <article class="service-card">
          <div class="service-image" style="background-image: url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80')" aria-hidden="true"></div>
          <div class="service-body">
            <h3>Local recommendations</h3>
            <p>Thoughtful suggestions for beaches, dining, and the most scenic routes by the sea.</p>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class ConciergePage {}
