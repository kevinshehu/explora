import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { PageTransitions } from './page-transitions';

/**
 * Turns any element into a cinematic link: on activation the element's media is
 * expanded to fullscreen before the router navigates to the target route.
 */
@Directive({
  selector: '[appExpand]',
  standalone: true,
  host: { role: 'link', tabindex: '0', class: 'ex-expand-link' },
})
export class ExpandLink {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly transitions = inject(PageTransitions);

  readonly appExpand = input.required<string>();
  readonly appExpandTo = input.required<unknown[]>();
  readonly appExpandVariant = input('default');

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    event.preventDefault();
    this.launch();
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKey(event: Event): void {
    event.preventDefault();
    this.launch();
  }

  private launch(): void {
    const media =
      (this.host.querySelector('img, .card-media, [data-expand-media]') as HTMLElement | null) ??
      this.host;
    const rect = media.getBoundingClientRect();
    this.transitions.expandTo(
      {
        image: this.appExpand(),
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        vw: window.innerWidth,
        vh: window.innerHeight,
        variant: this.appExpandVariant(),
      },
      this.appExpandTo(),
    );
  }
}
