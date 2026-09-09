import { Component } from '@angular/core';
import { Reveal } from '../../shared/animation/reveal';
import { ScrollScene } from '../../shared/animation/scroll-scene';

@Component({
  selector: 'app-beach-dive',
  standalone: true,
  imports: [ScrollScene, Reveal],
  template: `
    <section class="bd-scene" appScene aria-label="Beach experiences">
      <div class="bd-stage">
        <div class="bd-land" aria-hidden="true"></div>
        <div class="bd-beach" aria-hidden="true"></div>
        <div class="bd-water" aria-hidden="true">
          <div class="bd-caustics"></div>
        </div>
        <svg class="bd-crest" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120 Q 240 40 480 110 T 960 110 T 1440 100 V200 H0 Z" />
        </svg>

        <div class="bd-copy container">
          <p class="eyebrow" appReveal>Beach experiences</p>
          <h2 appReveal>Dive into the Mediterranean</h2>
          <p class="bd-lead" appReveal>
            Secret coves, glass-clear water and beach clubs reached only by boat — the Ionian
            at its most alive.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .bd-scene {
        --p: 0;
        position: relative;
        height: 175vh;
      }
      .bd-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: #0a1620;
      }
      .bd-land {
        position: absolute;
        inset: 0;
        background: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80')
          center/cover no-repeat;
        transform: scale(calc(1 + var(--p) * 0.25));
      }
      .bd-beach {
        position: absolute;
        inset: 0;
        background: url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=80')
          center/cover no-repeat;
        opacity: calc((var(--p) - 0.62) * 3);
      }
      .bd-water {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 130%;
        background: linear-gradient(180deg, #2aa4c4 0%, #14708f 45%, #0a4c63 100%);
        transform: translateY(calc(100% - var(--p) * 118%));
        will-change: transform;
      }
      .bd-caustics {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(60px 30px at 20% 30%, rgba(255, 255, 255, 0.25), transparent 70%),
          radial-gradient(80px 34px at 60% 55%, rgba(255, 255, 255, 0.2), transparent 70%),
          radial-gradient(70px 30px at 82% 40%, rgba(255, 255, 255, 0.18), transparent 70%);
        animation: shimmer 6s ease-in-out infinite;
      }
      .bd-crest {
        position: absolute;
        left: 0;
        width: 100%;
        height: 200px;
        fill: rgba(255, 255, 255, 0.85);
        bottom: calc(-40px + var(--p) * 118vh);
        opacity: calc(1 - var(--p) * 0.4);
      }
      .bd-copy {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 14px;
        color: #fff;
        text-align: center;
        align-items: center;
        text-shadow: 0 2px 22px rgba(6, 20, 30, 0.5);
      }
      .bd-copy h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2.2rem, 5vw, 4.2rem);
        line-height: 1;
        letter-spacing: -0.04em;
        margin: 0;
        max-width: 16ch;
      }
      .bd-lead {
        max-width: 32rem;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.9);
      }
      @keyframes shimmer {
        0%,
        100% {
          transform: translateX(-2%);
          opacity: 0.7;
        }
        50% {
          transform: translateX(2%);
          opacity: 1;
        }
      }
    `,
  ],
})
export class BeachDive {}
