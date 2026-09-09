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
        <div>
          <h3>Explora</h3>
          <p>Premium travel planning for the Albanian Riviera and Southern Albania.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <a routerLink="/destinations">Riviera destinations</a>
          <a routerLink="/tours">Packages</a>
          <a routerLink="/booking">Plan by WhatsApp</a>
        </div>
        <div>
          <h4>Support</h4>
          <a routerLink="/booking">Travel support</a>
          <a class="footer-whatsapp" [href]="contactWhatsAppUrl" target="_blank" rel="noopener">
            <app-whatsapp-icon />
            WhatsApp
          </a>
          <a routerLink="/destinations">Riviera guide</a>
        </div>
      </div>
      <p class="copyright">© 2026 Explora. Albanian Riviera travel experiences.</p>
    </footer>
  `,
})
export class Footer {
  contactWhatsAppUrl = whatsappUrl('Hi! I would like to contact Explora about the Albanian Riviera.');
}
