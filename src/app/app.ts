import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { WhatsappIcon } from './shared/components/whatsapp-icon';
import { whatsappUrl } from './shared/whatsapp';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell">
      <app-header />
      <main class="app-main">
        <router-outlet />
      </main>
      <app-footer />
      <a *ngIf="showFloatingWhatsApp" class="floating-whatsapp" [href]="floatingWhatsAppUrl" target="_blank" rel="noopener" aria-label="Contact Explora on WhatsApp">
        <app-whatsapp-icon />
      </a>
    </div>
  `,
  imports: [Header, Footer, RouterOutlet, WhatsappIcon, NgIf],
})
export class App {
  constructor(private readonly router: Router) {}

  floatingWhatsAppUrl = whatsappUrl('Hi! I would like help planning a trip on the Albanian Riviera.');

  get showFloatingWhatsApp(): boolean {
    return !this.router.url.startsWith('/booking');
  }
}
