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
        <div class="sx-haze" aria-hidden="true"></div>

        <div class="sx-clouds" aria-hidden="true">
          <span class="sx-cloud" style="top: 16%; left: 8%; --s: 1.2"></span>
          <span class="sx-cloud" style="top: 26%; left: 52%; --s: 0.9"></span>
          <span class="sx-cloud" style="top: 12%; left: 74%; --s: 1.4"></span>
          <span class="sx-cloud" style="top: 34%; left: 30%; --s: 0.8"></span>
        </div>

        <div class="sx-sun" aria-hidden="true"></div>
        <div class="sx-mountains" aria-hidden="true"></div>

        <div class="sx-sea" aria-hidden="true">
          <div class="sx-reflection"></div>
          <div class="sx-shimmer"></div>
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
        height: 200vh;
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
        background: linear-gradient(180deg, #101a3e 0%, #5c2b52 38%, #c0553c 66%, #f0994f 86%, #f6c874 100%);
        opacity: calc((var(--p) - 0.5) * 2.2);
      }
      .sx-haze {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 30%;
        height: 24%;
        background: linear-gradient(180deg, rgba(255, 220, 170, 0) 0%, rgba(255, 210, 150, 0.5) 100%);
        opacity: calc(0.3 + var(--p) * 0.7);
        filter: blur(8px);
      }
      .sx-clouds {
        position: absolute;
        inset: 0 0 34% 0;
      }
      .sx-cloud {
        position: absolute;
        width: calc(160px * var(--s));
        height: calc(34px * var(--s));
        border-radius: 40px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 220, 180, 0.3));
        filter: blur(6px);
        opacity: calc(0.5 + var(--p) * 0.4);
        mix-blend-mode: screen;
        animation: cloudDrift 26s ease-in-out infinite;
      }
      .sx-cloud:nth-child(even) {
        animation-duration: 34s;
        animation-direction: reverse;
      }
      .sx-mountains {
        position: absolute;
        left: -5%;
        right: -5%;
        bottom: 32%;
        height: 14%;
        background:
          linear-gradient(115deg, transparent 40%, #2a2140 40%, #1c1730 60%, transparent 60%),
          linear-gradient(70deg, transparent 44%, #34283f 44%, #241a33 56%, transparent 56%);
        background-size: 44% 100%, 40% 100%;
        background-position: 10% bottom, 68% bottom;
        background-repeat: no-repeat;
        opacity: calc(0.5 + var(--p) * 0.5);
      }
      .sx-sun {
        position: absolute;
        left: 50%;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        top: 0;
        transform: translate(-50%, calc(6vh + var(--p) * 48vh)) scale(calc(1 + var(--p) * 0.35));
        background: radial-gradient(circle, #fff6df 0%, #ffcf7a 44%, rgba(255, 150, 90, 0) 72%);
        filter: drop-shadow(0 0 70px rgba(255, 180, 110, calc(0.5 + var(--p) * 0.5)));
      }
      .sx-sea {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 34%;
        background: linear-gradient(180deg, #2b6f86 0%, #0a3245 100%);
        overflow: hidden;
      }
      .sx-reflection {
        position: absolute;
        left: 50%;
        top: 0;
        width: calc(90px + var(--p) * 90px);
        height: 100%;
        transform: translateX(-50%);
        background: linear-gradient(180deg, rgba(255, 200, 120, 0.9), rgba(255, 190, 110, 0));
        filter: blur(7px);
        opacity: calc(0.3 + var(--p) * 0.7);
        animation: ripple 4s ease-in-out infinite;
      }
      .sx-shimmer {
        position: absolute;
        left: 50%;
        top: 8%;
        width: calc(160px + var(--p) * 160px);
        height: 90%;
        transform: translateX(-50%);
        background: repeating-linear-gradient(
          180deg,
          rgba(255, 235, 190, 0.32) 0 3px,
          rgba(255, 235, 190, 0) 3px 12px
        );
        -webkit-mask-image: radial-gradient(60% 100% at 50% 0%, #000 0%, transparent 80%);
        mask-image: radial-gradient(60% 100% at 50% 0%, #000 0%, transparent 80%);
        opacity: calc(var(--p) * 0.8);
        animation: shimmerMove 5s ease-in-out infinite;
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
      @keyframes cloudDrift {
        0%,
        100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(40px);
        }
      }
      @keyframes shimmerMove {
        0%,
        100% {
          transform: translateX(-50%) scaleX(1);
          opacity: 0.6;
        }
        50% {
          transform: translateX(-50%) scaleX(1.15);
          opacity: 0.9;
        }
      }
    `,
  ],
})
export class SunsetExperience {
  bookUrl = whatsappUrl('Hi! I would love to plan a private sunset experience.');
}
