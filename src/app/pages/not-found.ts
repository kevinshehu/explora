import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container section-shell">
      <h1>Page not found</h1>
      <p>We couldn’t find the page you were looking for.</p>
      <div class="cta-row">
        <a class="button-primary" routerLink="/">Back home</a>
        <a class="button-ghost" routerLink="/destinations">Browse destinations</a>
      </div>
    </section>
  `,
})
export class NotFoundPage {}
