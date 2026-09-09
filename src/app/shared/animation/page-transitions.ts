import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

export type VeilPhase = 'idle' | 'cover' | 'reveal';

export interface ExpandState {
  image: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vw: number;
  vh: number;
  variant: string;
  full: boolean;
}

/**
 * Orchestrates cinematic navigation: a water "veil" wipe between public routes
 * (#10) and a card → fullscreen expansion before navigating (#11). SSR-safe and
 * skipped entirely for reduced-motion users.
 */
@Injectable({ providedIn: 'root' })
export class PageTransitions {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly veil = signal<VeilPhase>('idle');
  readonly expand = signal<ExpandState | null>(null);

  private booted = false;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!this.booted || this.expand() || this.reduced() || event.url.startsWith('/admin')) {
          return;
        }
        this.veil.set('cover');
        return;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (this.expand()) {
          setTimeout(() => this.expand.set(null), 280);
        } else if (this.veil() === 'cover') {
          setTimeout(() => {
            this.veil.set('reveal');
            setTimeout(() => this.veil.set('idle'), 760);
          }, 40);
        }
        this.booted = true;
      }
    });
  }

  expandTo(state: Omit<ExpandState, 'full'>, route: unknown[]): void {
    if (!this.isBrowser || this.reduced()) {
      void this.router.navigate(route as never);
      return;
    }

    this.expand.set({ ...state, full: false });
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        this.expand.update((current) => (current ? { ...current, full: true } : current)),
      ),
    );
    setTimeout(() => void this.router.navigate(route as never), 640);
  }

  private reduced(): boolean {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
