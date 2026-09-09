import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  template: `
    <section class="section-title">
      <p class="section-label">{{ label }}</p>
      <h2 class="section-heading">{{ title }}</h2>
      <p class="section-copy">{{ description }}</p>
    </section>
  `,
})
export class SectionTitle {
  @Input() label = '';
  @Input() title = '';
  @Input() description = '';
}
