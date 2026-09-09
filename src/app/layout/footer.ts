import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <h3>Explora</h3>
          <p>Premium travel planning for the Albanian Riviera and Southern Albania.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <a routerLink="/destinations">Destinations</a>
          <a routerLink="/tours">Tours</a>
          <a routerLink="/booking">Booking</a>
        </div>
        <div>
          <h4>Support</h4>
          <a routerLink="/booking">Travel support</a>
          <a href="mailto:hello@explora.al">Contact</a>
          <a routerLink="/destinations">Riviera guide</a>
        </div>
      </div>
      <p class="copyright">© 2026 Explora. Albanian Riviera travel experiences.</p>
    </footer>
  `,
})
export class Footer {}
