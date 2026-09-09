import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { TransitionVeil } from './pages/experiences/transition-veil';
import { WhatsappIcon } from './shared/components/whatsapp-icon';
import { whatsappUrl } from './shared/whatsapp';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell">
      @if (showPublicShell) {
        <app-header />
      }
      <main class="app-main" [class.admin-main]="showAdminShell">
        <router-outlet />
      </main>
      @if (showPublicShell) {
        <app-footer />
      }
      @if (showFloatingWhatsApp) {
        <a class="floating-whatsapp" [href]="floatingWhatsAppUrl" target="_blank" rel="noopener" aria-label="Contact Explora on WhatsApp">
          <app-whatsapp-icon />
        </a>
      }
      <app-transition-veil />
    </div>
  `,
  imports: [Header, Footer, RouterOutlet, WhatsappIcon, TransitionVeil],
})
export class App {
  private readonly router = inject(Router);

  floatingWhatsAppUrl = whatsappUrl('Hi! I would like help planning a trip on the Albanian Riviera.');

  get showAdminShell(): boolean {
    return this.router.url.startsWith('/admin');
  }

  get showPublicShell(): boolean {
    return !this.showAdminShell;
  }

  get showFloatingWhatsApp(): boolean {
    return this.showPublicShell && !this.router.url.startsWith('/booking');
  }
}
