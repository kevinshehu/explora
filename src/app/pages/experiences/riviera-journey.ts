import { Component } from '@angular/core';
import { Reveal } from '../../shared/animation/reveal';
import { ScrollScene } from '../../shared/animation/scroll-scene';

interface Stop {
  name: string;
  x: number;
  y: number;
  at: number;
}

const ROUTE =
  'M300 60 C 360 140 240 200 300 280 C 360 360 250 420 300 500 C 350 580 260 640 300 720 C 340 790 300 820 300 860';

@Component({
  selector: 'app-riviera-journey',
  standalone: true,
  imports: [ScrollScene, Reveal],
  template: `
    <section class="rj-scene" appScene aria-label="Discover the Riviera">
      <div class="rj-stage">
        <div class="rj-copy container">
          <p class="eyebrow" appReveal>Discover the Riviera</p>
          <h2 appReveal>One coastline, nine escapes</h2>
          <p class="rj-lead" appReveal>
            Follow the route south — from Vlorë to Ksamil — as the journey draws itself along
            the Albanian coast.
          </p>
        </div>

        <div class="rj-mapwrap" aria-hidden="true">
          <div class="rj-map">
            <svg viewBox="0 0 600 920" class="rj-svg">
              <path class="rj-route-bg" [attr.d]="route" />
              <path class="rj-route" [attr.d]="route" pathLength="1" />
              @for (stop of stops; track stop.name) {
                <g class="rj-stop" [style.--t]="stop.at">
                  <circle [attr.cx]="stop.x" [attr.cy]="stop.y" r="7" class="rj-dot" />
                  <circle [attr.cx]="stop.x" [attr.cy]="stop.y" r="7" class="rj-ping" />
                  <text [attr.x]="stop.x + 18" [attr.y]="stop.y + 5" class="rj-label">
                    {{ stop.name }}
                  </text>
                </g>
              }
            </svg>
            <div class="rj-boat">
              <svg viewBox="0 0 48 30">
                <path d="M6 16 L42 16 L34 26 L12 26 Z" fill="#fff" />
                <path d="M24 2 L24 16 L10 16 Z" fill="#f6d8a8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .rj-scene {
        --p: 0;
        position: relative;
        height: 340vh;
      }
      .rj-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: radial-gradient(120% 90% at 80% 10%, #0f2f3f 0%, #081720 60%, #050e14 100%);
        display: grid;
        place-items: center;
      }
      .rj-copy {
        position: absolute;
        top: 10vh;
        left: 0;
        right: 0;
        z-index: 2;
        color: #eaf6f6;
        max-width: 34rem;
      }
      .rj-copy .eyebrow {
        color: #f6d8a8;
      }
      .rj-copy h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2rem, 4vw, 3.4rem);
        line-height: 1.02;
        letter-spacing: -0.03em;
        margin: 0 0 10px;
      }
      .rj-lead {
        font-size: 1rem;
        line-height: 1.7;
        color: rgba(234, 246, 246, 0.82);
      }
      .rj-mapwrap {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
      }
      .rj-map {
        position: relative;
        width: 600px;
        height: 920px;
        transform: scale(min(0.62, calc(100vh / 980)));
      }
      .rj-svg {
        width: 600px;
        height: 920px;
        overflow: visible;
      }
      .rj-route-bg {
        fill: none;
        stroke: rgba(246, 216, 168, 0.14);
        stroke-width: 3;
      }
      .rj-route {
        fill: none;
        stroke: #f6d8a8;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-dasharray: 1;
        stroke-dashoffset: calc(1 - var(--p));
        filter: drop-shadow(0 0 6px rgba(246, 216, 168, 0.6));
      }
      .rj-dot {
        fill: #f6d8a8;
        opacity: calc((var(--p) - var(--t)) * 10);
      }
      .rj-ping {
        fill: none;
        stroke: #f6d8a8;
        stroke-width: 2;
        transform-box: fill-box;
        transform-origin: center;
        opacity: calc((var(--p) - var(--t)) * 6);
        animation: ping 2.4s ease-out infinite;
      }
      .rj-label {
        fill: #eaf6f6;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 22px;
        opacity: calc((var(--p) - var(--t)) * 10);
      }
      .rj-boat {
        position: absolute;
        top: 0;
        left: 0;
        width: 34px;
        height: 22px;
        margin: -11px 0 0 -17px;
        offset-path: path(
          'M300 60 C 360 140 240 200 300 280 C 360 360 250 420 300 500 C 350 580 260 640 300 720 C 340 790 300 820 300 860'
        );
        offset-distance: calc(var(--p) * 100%);
        offset-rotate: auto 90deg;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
      }
      .rj-boat svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      @keyframes ping {
        0% {
          transform: scale(1);
          opacity: 0.7;
        }
        100% {
          transform: scale(3);
          opacity: 0;
        }
      }
      @media (max-width: 720px) {
        .rj-copy {
          top: 6vh;
        }
      }
    `,
  ],
})
export class RivieraJourney {
  route = ROUTE;
  stops: Stop[] = [
    { name: 'Vlorë', x: 300, y: 60, at: 0.02 },
    { name: 'Dhërmi', x: 300, y: 280, at: 0.28 },
    { name: 'Himarë', x: 300, y: 500, at: 0.52 },
    { name: 'Sarandë', x: 300, y: 720, at: 0.78 },
    { name: 'Ksamil', x: 300, y: 860, at: 0.94 },
  ];
}
