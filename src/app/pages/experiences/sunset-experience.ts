import { Component } from '@angular/core';
import { Reveal } from '../../shared/animation/reveal';
import { ScrollScene } from '../../shared/animation/scroll-scene';
import { whatsappUrl } from '../../shared/whatsapp';

@Component({
  selector: 'app-sunset-experience',
  standalone: true,
  imports: [ScrollScene, Reveal],
  template: `
    <section class="sx-scene" appScene aria-label="Sunset experiences">
      <div class="sx-stage">
        <div class="sx-day" aria-hidden="true"></div>
        <div class="sx-golden" aria-hidden="true"></div>
        <div class="sx-dusk" aria-hidden="true"></div>
        <div class="sx-sun" aria-hidden="true"></div>
        <div class="sx-sea" aria-hidden="true">
          <div class="sx-reflection"></div>
        </div>

        <div class="sx-copy container">
          <p class="eyebrow" appReveal>Sunset, your way</p>
          <h2 appReveal>Golden hour on the Ionian</h2>
          <p class="sx-lead" appReveal>
            A private terrace, a chilled glass, and the sky turning to fire over the water —
            arranged exactly to your evening.
          </p>
          <a class="button-primary sx-cta" [href]="bookUrl" target="_blank" rel="noopener">
            Plan your sunset
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .sx-scene {
        --p: 0;
        position: relative;
        height: 300vh;
      }
      .sx-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: #0a1620;
      }
      .sx-day,
      .sx-golden,
      .sx-dusk {
        position: absolute;
        inset: 0;
      }
      .sx-day {
        background: linear-gradient(180deg, #79b7d6 0%, #bfe0ea 60%, #e7f4f6 100%);
      }
      .sx-golden {
        background: linear-gradient(180deg, #4a6f9c 0%, #e8955c 55%, #f6cf8c 100%);
        opacity: calc(var(--p) * 2);
      }
      .sx-dusk {
        background: linear-gradient(180deg, #1b2447 0%, #7c3a55 45%, #d9683f 72%, #f3a95f 100%);
        opacity: calc((var(--p) - 0.5) * 2.2);
      }
      .sx-sun {
        position: absolute;
        left: 50%;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        top: 0;
        transform: translate(-50%, calc(6vh + var(--p) * 46vh));
        background: radial-gradient(circle, #fff6df 0%, #ffd27f 46%, rgba(255, 176, 106, 0) 72%);
        filter: drop-shadow(0 0 60px rgba(255, 197, 120, 0.7));
      }
      .sx-sea {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 34%;
        background: linear-gradient(180deg, #1f5f76 0%, #0a3245 100%);
        overflow: hidden;
      }
      .sx-reflection {
        position: absolute;
        left: 50%;
        top: 0;
        width: 120px;
        height: 100%;
        transform: translateX(-50%);
        background: linear-gradient(180deg, rgba(255, 210, 130, 0.85), rgba(255, 210, 130, 0));
        filter: blur(6px);
        opacity: calc(0.3 + var(--p) * 0.7);
        animation: ripple 4s ease-in-out infinite;
      }
      .sx-copy {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 14px;
        color: #fff;
        text-shadow: 0 2px 22px rgba(6, 20, 30, 0.45);
      }
      .sx-copy .eyebrow {
        color: #ffe6c2;
      }
      .sx-copy h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2.4rem, 5vw, 4.4rem);
        line-height: 1;
        letter-spacing: -0.04em;
        margin: 0;
        max-width: 14ch;
      }
      .sx-lead {
        max-width: 32rem;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.9);
      }
      .sx-cta {
        align-self: flex-start;
        margin-top: 6px;
      }
      @keyframes ripple {
        0%,
        100% {
          transform: translateX(-50%) scaleX(1);
        }
        50% {
          transform: translateX(-50%) scaleX(1.6);
        }
      }
    `,
  ],
})
export class SunsetExperience {
  bookUrl = whatsappUrl('Hi! I would love to plan a private sunset experience.');
}
