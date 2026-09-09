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
