import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminSessionService } from '../admin-session.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="admin-page-stack">
      <div class="admin-page-header">
        <div>
          <p class="admin-eyebrow">Settings</p>
          <h1>Admin configuration</h1>
        </div>
      </div>

      <article class="admin-card admin-panel-card">
        <h2>Session</h2>
        <p class="admin-muted">Temporary frontend login active for {{ session.username() || 'anonymous' }}.</p>
        <div class="admin-form-actions">
          <button type="button" class="admin-button admin-button--secondary" (click)="session.restoreSession()">Refresh session</button>
          <a routerLink="/admin" class="admin-button admin-button--ghost">Return to login</a>
        </div>
      </article>

      <article class="admin-card admin-panel-card">
        <h2>Supabase configuration</h2>
        <p class="admin-muted">Set <code>SUPABASE_URL</code>, <code>SUPABASE_ANON_KEY</code>, and a server-side service role key in your environment before connecting the admin data source.</p>
        <p class="admin-muted">The browser should never receive the service role credential.</p>
      </article>
    </section>
  `,
})
export class AdminSettingsPage {
  readonly session = inject(AdminSessionService);
}