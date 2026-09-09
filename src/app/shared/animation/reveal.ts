import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
} from '@angular/core';

/**
 * Adds the `is-revealed` class the first time the host enters the viewport so
 * content can fade/rise into place. SSR-safe and reduced-motion aware.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { class: 'ex-reveal' },
})
export class Reveal {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.host.classList.add('is-revealed');
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.host.classList.add('is-revealed');
            observer.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(this.host);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
