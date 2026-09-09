import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  template: `
    <section class="mb-4 md:mb-6">
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
