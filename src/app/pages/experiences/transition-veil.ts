import { Component, inject } from '@angular/core';
import { PageTransitions } from '../../shared/animation/page-transitions';

@Component({
  selector: 'app-transition-veil',
  standalone: true,
  template: `
    <div class="tv-veil" [attr.data-phase]="t.veil()" aria-hidden="true">
      <svg class="tv-wave" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path d="M0 90 Q 240 0 480 80 T 960 80 T 1440 70 V220 H0 Z" />
      </svg>
      <div class="tv-fill"></div>
    </div>

    @if (t.expand(); as ex) {
      <div
        class="tv-expand"
        [class.is-full]="ex.full"
        [attr.data-variant]="ex.variant"
        [style.top.px]="ex.full ? 0 : ex.y"
        [style.left.px]="ex.full ? 0 : ex.x"
        [style.width.px]="ex.full ? ex.vw : ex.w"
        [style.height.px]="ex.full ? ex.vh : ex.h"
        [style.background-image]="'url(' + ex.image + ')'"
        aria-hidden="true"
      >
        <div class="tv-wash"></div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 120;
        pointer-events: none;
      }

      .tv-veil {
        position: absolute;
        inset: 0;
        transform: translateY(105%);
        transition: transform 0.72s cubic-bezier(0.76, 0, 0.24, 1);
        will-change: transform;
      }
      .tv-veil[data-phase='cover'] {
        transform: translateY(0);
      }
      .tv-veil[data-phase='reveal'] {
        transform: translateY(-105%);
      }
      .tv-fill {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, #0b3a4d 0%, #072633 100%);
      }
      .tv-wave {
        position: absolute;
        left: 0;
        bottom: 100%;
        width: 100%;
        height: 220px;
        fill: #0b3a4d;
      }

      .tv-expand {
        position: fixed;
        border-radius: 20px;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        box-shadow: 0 40px 90px rgba(6, 20, 30, 0.4);
        transition:
          top 0.64s cubic-bezier(0.65, 0, 0.35, 1),
          left 0.64s cubic-bezier(0.65, 0, 0.35, 1),
          width 0.64s cubic-bezier(0.65, 0, 0.35, 1),
          height 0.64s cubic-bezier(0.65, 0, 0.35, 1),
          border-radius 0.5s ease;
        will-change: top, left, width, height;
      }
      .tv-expand.is-full {
        border-radius: 0;
      }
      .tv-wash {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity 0.6s ease 0.12s;
        background: linear-gradient(180deg, rgba(6, 20, 30, 0) 30%, rgba(6, 20, 30, 0.55) 100%);
      }
      .is-full .tv-wash {
        opacity: 1;
      }
      .tv-expand[data-variant='villa'] .tv-wash {
        background: linear-gradient(180deg, rgba(70, 42, 20, 0) 30%, rgba(40, 24, 12, 0.6) 100%);
      }
      .tv-expand[data-variant='boat'] .tv-wash {
        background: linear-gradient(180deg, rgba(10, 60, 80, 0) 25%, rgba(7, 38, 51, 0.7) 100%);
      }
      .tv-expand[data-variant='concierge'] .tv-wash {
        background: linear-gradient(180deg, rgba(120, 80, 40, 0) 30%, rgba(60, 36, 16, 0.65) 100%);
      }
      .tv-expand[data-variant='beach'] .tv-wash {
        background: linear-gradient(180deg, rgba(20, 112, 143, 0) 30%, rgba(10, 76, 99, 0.65) 100%);
      }
    `,
  ],
})
export class TransitionVeil {
  readonly t = inject(PageTransitions);
}
