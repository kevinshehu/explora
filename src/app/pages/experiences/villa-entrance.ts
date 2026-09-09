import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../shared/animation/reveal';
import { ScrollScene } from '../../shared/animation/scroll-scene';

@Component({
  selector: 'app-villa-entrance',
  standalone: true,
  imports: [ScrollScene, Reveal, RouterLink],
  template: `
    <section class="vx-scene" appScene aria-label="Enter the villa">
      <div class="vx-stage">
        <div class="vx-interior" aria-hidden="true"></div>
        <div class="vx-exterior" aria-hidden="true"></div>
        <div class="vx-vignette" aria-hidden="true"></div>

        <div class="vx-copy container">
          <p class="eyebrow" appReveal>Signature villas</p>
          <h2 appReveal>Enter the villa</h2>
          <p class="vx-lead" appReveal>
            Cross the threshold into light-filled rooms, private pools and sea-facing terraces
            kept for you alone.
          </p>
          <a class="button-primary vx-cta" routerLink="/destinations">Step inside</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .vx-scene {
        --p: 0;
        position: relative;
        height: 300vh;
      }
      .vx-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: #0a1620;
      }
      .vx-exterior {
        position: absolute;
        inset: 0;
        background: url('https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=2200&q=80')
          center/cover no-repeat;
        transform: scale(calc(1 + var(--p) * 0.7));
        filter: blur(calc(var(--p) * 6px)) brightness(calc(1 - var(--p) * 0.25));
        clip-path: circle(calc(150% - var(--p) * 118%) at 50% 56%);
        will-change: transform, clip-path;
      }
      .vx-interior {
        position: absolute;
        inset: 0;
        background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=80')
          center/cover no-repeat;
        transform: scale(calc(1.25 - var(--p) * 0.25));
        opacity: calc((var(--p) - 0.15) * 1.4);
      }
      .vx-vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(120% 100% at 50% 60%, rgba(6, 18, 28, 0) 40%, rgba(6, 18, 28, 0.7) 100%);
      }
      .vx-copy {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 14px;
        color: #fff;
        text-shadow: 0 2px 22px rgba(6, 20, 30, 0.5);
      }
      .vx-copy h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2.4rem, 5vw, 4.4rem);
        line-height: 1;
        letter-spacing: -0.04em;
        margin: 0;
      }
      .vx-lead {
        max-width: 32rem;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.88);
      }
      .vx-cta {
        align-self: flex-start;
        margin-top: 6px;
        opacity: calc((var(--p) - 0.55) * 4);
      }
    `,
  ],
})
export class VillaEntrance {}
