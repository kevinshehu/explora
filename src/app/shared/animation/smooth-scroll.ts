import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * Lightweight momentum smoothing for the main window scroll (desktop pointer
 * only). Wheel input is eased toward a target position so the page feels like it
 * glides. Disabled for touch devices, reduced-motion users and SSR.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScroll {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private target = 0;
  private current = 0;
  private running = false;
  private raf = 0;
  private selfScroll = false;

  init(): void {
    if (!this.isBrowser) {
      return;
    }
    const fine = matchMedia('(pointer: fine)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) {
      return;
    }

    this.target = window.scrollY;
    this.current = window.scrollY;

    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  private maxScroll(): number {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  private onWheel = (event: WheelEvent): void => {
    if (event.ctrlKey || event.defaultPrevented) {
      return;
    }
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
    event.preventDefault();
    this.target = Math.min(Math.max(this.target + delta, 0), this.maxScroll());
    if (!this.running) {
      this.running = true;
      this.raf = requestAnimationFrame(this.tick);
    }
  };

  private onScroll = (): void => {
    if (this.selfScroll) {
      this.selfScroll = false;
      return;
    }
    // External scroll (keyboard, scrollbar, anchor): resync so we don't fight it.
    this.target = window.scrollY;
    this.current = window.scrollY;
  };

  private onResize = (): void => {
    this.target = Math.min(this.target, this.maxScroll());
  };

  private tick = (): void => {
    const diff = this.target - this.current;
    if (Math.abs(diff) < 0.4) {
      this.current = this.target;
      this.applyScroll();
      this.running = false;
      return;
    }
    this.current += diff * 0.14;
    this.applyScroll();
    this.raf = requestAnimationFrame(this.tick);
  };

  private applyScroll(): void {
    this.selfScroll = true;
    window.scrollTo(0, this.current);
  }
}
