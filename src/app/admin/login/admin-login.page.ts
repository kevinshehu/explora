import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSessionService } from '../admin-session.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="admin-auth-screen">
      <div class="admin-auth-card">
        <p class="admin-eyebrow">Explora Admin</p>
        <h1>Sign in to manage reservations</h1>
        <p class="admin-muted">This temporary frontend login keeps the admin area separate while Supabase powers the data layer.</p>

        <form class="admin-form-grid" [formGroup]="form" (ngSubmit)="submit()">
          <label>
            <span>Username</span>
            <input type="text" formControlName="username" autocomplete="username" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" formControlName="password" autocomplete="current-password" />
          </label>
          @if (errorMessage) {
            <p class="admin-error">{{ errorMessage }}</p>
          }
          <button class="admin-button admin-button--primary" type="submit">Enter admin</button>
        </form>
      </div>
    </section>
  `,
})
export class AdminLoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(AdminSessionService);
  private readonly router = inject(Router);

  errorMessage = '';

  form = this.fb.nonNullable.group({
    username: ['admin', Validators.required],
    password: ['explora2026', Validators.required],
  });

  constructor() {
    if (this.session.authenticated()) {
      void this.router.navigateByUrl('/admin/dashboard');
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const authenticated = this.session.signIn(this.form.getRawValue().username, this.form.getRawValue().password);

    if (!authenticated) {
      this.errorMessage = 'Incorrect username or password.';
      return;
    }

    this.errorMessage = '';
    void this.router.navigateByUrl('/admin/dashboard');
  }
}