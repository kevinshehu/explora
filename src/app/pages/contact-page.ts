import { Component } from '@angular/core';
import { whatsappUrl } from '../shared/whatsapp';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [],
  template: `
    <section class="page-hero page-hero-soft">
      <div class="container page-hero-inner">
        <p class="eyebrow">Contact</p>
        <h1>Let’s plan the right coast for you.</h1>
      </div>
    </section>

    <section class="container section-shell">
      <div class="contact-grid">
        <div class="contact-card">
          <h3>Ask about availability</h3>
          <p>Tell us your destination, dates, and travel style and we’ll help you find the right Riviera stay.</p>
          <a class="button-primary" [href]="whatsAppLink" target="_blank" rel="noopener">Message on WhatsApp</a>
        </div>

        <div class="contact-card">
          <h3>Reach us</h3>
          <ul class="contact-list">
            <li>Email: hello@explora-riviera.com</li>
            <li>WhatsApp: +355 69 000 0000</li>
            <li>Location: Southern Albania</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class ContactPage {
  whatsAppLink = whatsappUrl('Hi! I would like help planning a trip on the Albanian Riviera.');
}
