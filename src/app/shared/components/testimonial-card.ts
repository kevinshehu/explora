import { Component, Input } from '@angular/core';
import { Testimonial } from '../../shared/models/travel.model';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  template: `
    <article class="testimonial-card">
      <p class="quote">“{{ testimonial.quote }}”</p>
      <div class="meta-row">
        <p class="name">{{ testimonial.name }}</p>
        <p class="place">{{ testimonial.location }}</p>
      </div>
      <p class="stars">{{ testimonial.rating }} ★</p>
    </article>
  `,
})
export class TestimonialCard {
  @Input({ required: true }) testimonial!: Testimonial;
}
