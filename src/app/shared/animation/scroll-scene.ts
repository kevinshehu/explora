import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

/**
 * Drives a scroll-controlled "scene". The host element is a tall track; while it
 * passes through the viewport a normalized progress value (0..1) is written to the
 * `--p` custom property so child elements can be animated purely with CSS transforms.
 * A rAF loop only runs while the track is on screen, and honours reduced-motion.
 */
@Directive({
  selector: '[appScene]',
  standalone: true,
})
export class ScrollScene {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  readonly appSceneReducedProgress = input(0.6);

  private frame = 0;
  private visible = false;
  private lastValue = -1;

  constructor() {
    afterNextRender(() => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)');
      if (reduce.matches) {
        this.write(this.appSceneReducedProgress());
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          this.visible = entries[0].isIntersecting;
          if (this.visible) {
            this.loop();
          } else {
            cancelAnimationFrame(this.frame);
          }
        },
        { rootMargin: '20% 0px' },
      );
      observer.observe(this.host);

      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(this.frame);
      });
    });
  }

  private loop = (): void => {
    this.update();
    if (this.visible) {
      this.frame = requestAnimationFrame(this.loop);
    }
  };

  private update(): void {
    const rect = this.host.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    this.write(total > 0 ? scrolled / total : 0);
  }

  private write(value: number): void {
    if (Math.abs(value - this.lastValue) < 0.001) {
      return;
    }
    this.lastValue = value;
    this.host.style.setProperty('--p', value.toFixed(4));
  }
}
