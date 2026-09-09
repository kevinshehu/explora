import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  host: { '[class.is-scrolled]': 'scrolled()' },
  template: `
    <header class="site-header">
      <div class="container topbar-grid">
        <a class="brand" routerLink="/">
          <span class="brand-mark">E</span>
          <span>
            <strong>Explora</strong>
            <small>South Albania</small>
          </span>
        </a>

        <nav class="desktop-nav" aria-label="Main navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/destinations" routerLinkActive="active">Villas</a>
          <a routerLink="/tours" routerLinkActive="active">Experiences</a>
          <a routerLink="/booking" routerLinkActive="active">Booking</a>
          <a routerLink="/concierge" routerLinkActive="active">Concierge</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/contact" class="nav-cta" routerLinkActive="active">Contact</a>
        </nav>
      </div>

      <div class="container mobile-nav-wrap">
        <nav class="mobile-nav" aria-label="Mobile navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/destinations" routerLinkActive="active">Villas</a>
          <a routerLink="/tours" routerLinkActive="active">Experiences</a>
          <a routerLink="/booking" routerLinkActive="active">Booking</a>
          <a routerLink="/concierge" routerLinkActive="active">Concierge</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
        </nav>
      </div>
    </header>
  `,
})
export class Header {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  readonly scrolled = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }
}
