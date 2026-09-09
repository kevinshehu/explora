import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ADMIN_NAVIGATION } from '../admin.constants';
import { AdminSessionService } from '../admin-session.service';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <section class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-branding">
          <span class="admin-brand-mark">E</span>
          <div>
            <p class="admin-eyebrow">Explora Operations</p>
            <h1>Administration</h1>
          </div>
        </div>

        <nav class="admin-nav" aria-label="Admin navigation">
          @for (item of navigation; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="is-active" class="admin-nav-link">
              <span class="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <button type="button" class="admin-button admin-button--ghost" (click)="logout()">Logout</button>
      </aside>

      <div class="admin-panel">
        <header class="admin-topbar">
          <div>
            <p class="admin-eyebrow">Session authenticated</p>
            <h2>{{ session.username() || 'Admin' }}</h2>
          </div>
        </header>

        <main class="admin-content">
          <router-outlet />
        </main>
      </div>
    </section>
  `,
})
export class AdminShellComponent {
  readonly navigation = ADMIN_NAVIGATION;

  readonly session = inject(AdminSessionService);
  private readonly router = inject(Router);

  logout(): void {
    this.session.signOut();
    void this.router.navigateByUrl('/admin');
  }
}