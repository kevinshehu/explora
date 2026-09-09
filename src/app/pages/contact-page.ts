import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { whatsappUrl } from '../shared/whatsapp';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-hero page-hero-soft">
      <div class="container page-hero-inner">
        <p class="eyebrow">Contact</p>
        <h1>Plan your Riviera escape.</h1>
      </div>
    </section>

    <section class="container section-shell">
      <div class="contact-layout">
        <aside class="contact-info-panel">
          <div class="info-block">
            <p class="label">Plan your stay</p>
            <h2>Let’s match your dates, villa, and coastal mood.</h2>
          </div>

          <div class="contact-points">
            <div class="contact-point">
              <span>Email</span>
              <strong>hello@explora-riviera.com</strong>
            </div>
            <div class="contact-point">
              <span>WhatsApp</span>
              <strong>+355 69 000 0000</strong>
            </div>
            <div class="contact-point">
              <span>Based in</span>
              <strong>South Albania</strong>
            </div>
          </div>

          <a class="button-primary button-light" [href]="whatsAppLink" target="_blank" rel="noopener">
            Message on WhatsApp
          </a>
        </aside>

        <form class="contact-card" (ngSubmit)="submitForm()" novalidate>
          <div class="form-header">
            <p class="label">Send a message</p>
            <h3>Ask about availability and custom planning</h3>
          </div>

          <div class="form-grid">
            <label>
              <span>Full name</span>
              <input type="text" name="fullName" [(ngModel)]="form.fullName" required placeholder="Your name" />
            </label>

            <label>
              <span>Email</span>
              <input type="email" name="email" [(ngModel)]="form.email" required placeholder="you@example.com" />
            </label>

            <label>
              <span>Phone / WhatsApp</span>
              <input type="tel" name="phone" [(ngModel)]="form.phone" placeholder="+355 ..." />
            </label>

            <label>
              <span>Travel dates</span>
              <input type="text" name="travelDates" [(ngModel)]="form.travelDates" placeholder="June 2026" />
            </label>
          </div>

          <label>
            <span>Message</span>
            <textarea
              name="message"
              [(ngModel)]="form.message"
              rows="6"
              required
              placeholder="Tell us where you want to stay, how many guests, and what kind of trip you have in mind."
            ></textarea>
          </label>

          @if (errorMessage) {
            <div class="feedback error">{{ errorMessage }}</div>
          }

          @if (successMessage) {
            <div class="feedback success">{{ successMessage }}</div>
          }

          <button class="button-primary" type="submit" [disabled]="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send enquiry' }}
          </button>
        </form>
      </div>
    </section>
  `,
})
export class ContactPage {
  private readonly http = inject(HttpClient);

  whatsAppLink = whatsappUrl('Hi! I would like help planning a trip on the Albanian Riviera.');

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  form = {
    fullName: '',
    email: '',
    phone: '',
    travelDates: '',
    message: '',
  };

  submitForm(): void {
    const payload = {
      fullName: this.form.fullName.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone.trim(),
      travelDates: this.form.travelDates.trim(),
      message: this.form.message.trim(),
    };

    if (!payload.fullName || !payload.email || !payload.message) {
      this.errorMessage = 'Please fill in your name, email, and message.';
      this.successMessage = '';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http
      .post<{ message?: string }>('/.netlify/functions/contact-email', payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Thank you. Your message has been sent successfully and we will reply soon.';
          this.form = {
            fullName: '',
            email: '',
            phone: '',
            travelDates: '',
            message: '',
          };
        },
        error: (error: HttpErrorResponse) => {
          const fallback = 'We could not send your message right now. Please contact us on WhatsApp instead.';
          this.errorMessage = error?.error?.message ?? fallback;
        },
      });
  }
}
