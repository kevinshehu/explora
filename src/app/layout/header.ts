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
          <a routerLink="/destinations" routerLinkActive="active">Explore</a>
          <a routerLink="/tours" routerLinkActive="active">Packages</a>
        </nav>
        <a class="button-primary nav-cta" routerLink="/booking">
          <span class="material-symbols-outlined" aria-hidden="true">travel_explore</span>
          <span>Plan trip</span>
        </a>
      </div>
    </header>
  `,
})
export class Header {}
