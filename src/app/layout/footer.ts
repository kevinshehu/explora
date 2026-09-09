import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsappIcon } from '../shared/components/whatsapp-icon';
import { whatsappUrl } from '../shared/whatsapp';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, WhatsappIcon],
  template: `
    <footer class="site-footer">
      <svg class="footer-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path
          class="footer-wave-back"
          d="M0 60 C 240 20 480 100 720 60 C 960 20 1200 100 1440 60 V120 H0 Z"
        />
        <path
          class="footer-wave-front"
          d="M0 80 C 240 50 480 110 720 80 C 960 50 1200 110 1440 80 V120 H0 Z"
        />
      </svg>
      <div class="container footer-grid">
        <div class="footer-brand">
          <h3>Explora</h3>
          <p>Compact travel planning for the Albanian Riviera.</p>
        </div>
        <nav class="footer-links" aria-label="Footer links">
          <a routerLink="/destinations">Destinations</a>
          <a routerLink="/tours">Tours</a>
          <a routerLink="/booking">Booking</a>
        </nav>
        <div class="footer-contact">
          <a class="footer-whatsapp" [href]="contactWhatsAppUrl" target="_blank" rel="noopener">
            <app-whatsapp-icon />
            WhatsApp
          </a>
        </div>
      </div>
      <div class="container">
        <p class="copyright">© 2026 Explora</p>
      </div>
    </footer>
  `,
})
export class Footer {
  contactWhatsAppUrl = whatsappUrl('Hi! I would like to contact Explora about the Albanian Riviera.');
}
