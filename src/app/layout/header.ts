import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
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
      </div>
    </header>
  `,
})
export class Header {}
