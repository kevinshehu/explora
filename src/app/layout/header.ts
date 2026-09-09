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

        <nav class="desktop-nav" aria-label="Main navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/destinations" routerLinkActive="active">Villas</a>
          <a routerLink="/tours" routerLinkActive="active">Experiences</a>
          <a routerLink="/booking" routerLinkActive="active">Booking</a>
          <a routerLink="/destinations" routerLinkActive="active">About</a>
        </nav>

        <a class="button-primary header-button" routerLink="/destinations">Find a villa</a>
      </div>
    </header>
  `,
})
export class Header {}
