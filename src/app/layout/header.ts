import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="container topbar-grid">
        <a class="brand" routerLink="/">
          <span class="brand-mark">E</span>
          <span>
            <strong>Explora</strong>
            <small>Albanian Riviera</small>
          </span>
        </a>
        <nav class="desktop-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/destinations" routerLinkActive="active">Destinations</a>
          <a routerLink="/tours" routerLinkActive="active">Tours</a>
          <a routerLink="/booking" routerLinkActive="active">Booking</a>
        </nav>
        <a class="button-primary nav-cta" routerLink="/booking">
          <span class="material-symbols-outlined" aria-hidden="true">travel_explore</span>
          Plan your journey
        </a>
      </div>
    </header>
  `,
})
export class Header {}
