import { Component } from '@angular/core';
import { Reveal } from '../../shared/animation/reveal';
import { ScrollScene } from '../../shared/animation/scroll-scene';
import { whatsappUrl } from '../../shared/whatsapp';

@Component({
  selector: 'app-coastal-drive',
  standalone: true,
  imports: [ScrollScene, Reveal],
  template: `
    <section class="dr-scene" appScene aria-label="Private driver">
      <div class="dr-stage">
        <div class="dr-sky" aria-hidden="true"></div>
        <div class="dr-mountains dr-far" aria-hidden="true"></div>
        <div class="dr-mountains dr-near" aria-hidden="true"></div>
        <div class="dr-sea" aria-hidden="true"></div>
        <div class="dr-road" aria-hidden="true">
          <div class="dr-lane"></div>
        </div>

        <div class="dr-marker" aria-hidden="true">
          <span class="dr-pin"></span>
          <span class="dr-pin-label">Your villa</span>
        </div>

        <div class="dr-car" aria-hidden="true">
          <svg viewBox="0 0 420 150" role="img" aria-label="Luxury car">
            <defs>
              <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#20303f" />
                <stop offset="1" stop-color="#0c151d" />
              </linearGradient>
            </defs>
            <path
              class="dr-body"
              d="M20 104 L58 104 Q78 66 128 62 L250 58 Q320 58 356 92 L396 100 Q404 102 404 112 L404 118 Q404 124 396 124 L28 124 Q20 124 20 116 Z"
              fill="url(#carBody)"
            />
            <path class="dr-glass" d="M126 66 Q150 46 210 46 L246 46 Q296 46 322 74 L250 74 L138 76 Z" />
            <circle class="dr-wheel" cx="118" cy="122" r="22" />
            <circle class="dr-wheel" cx="322" cy="122" r="22" />
            <circle class="dr-hub" cx="118" cy="122" r="8" />
            <circle class="dr-hub" cx="322" cy="122" r="8" />
          </svg>
        </div>

        <div class="dr-copy container">
          <p class="eyebrow" appReveal>Private driver &amp; transfers</p>
          <h2 appReveal>Arrive differently</h2>
          <p class="dr-lead" appReveal>
            A discreet chauffeur, the coastal road unspooling beside you, and the sea in view
            the entire way to your door.
          </p>
          <a class="button-primary dr-cta" [href]="bookUrl" target="_blank" rel="noopener">
            Book a transfer
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
      .dr-scene {
        --p: 0;
        position: relative;
        height: 300vh;
      }
      .dr-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(180deg, #cfe8f0 0%, #eaf6f6 100%);
      }
      .dr-sky {
        position: absolute;
        inset: 0 0 40% 0;
        background: linear-gradient(180deg, #8fc4dc 0%, #d5edf2 100%);
      }
      .dr-mountains {
        position: absolute;
        left: -20%;
        right: -20%;
        bottom: 38%;
        height: 32%;
        background-repeat: repeat-x;
        background-size: 50% 100%;
        will-change: transform;
      }
      .dr-far {
        background-image: linear-gradient(135deg, transparent 46%, #7fa9b8 46%, #6c98a8 54%, transparent 54%);
        opacity: 0.55;
        transform: translateX(calc(var(--p) * -30%));
      }
      .dr-near {
        bottom: 40%;
        height: 26%;
        background-image: linear-gradient(120deg, transparent 44%, #4d7f8c 44%, #3c6b78 56%, transparent 56%);
        transform: translateX(calc(var(--p) * -68%));
      }
      .dr-sea {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 34%;
        height: 12%;
        background: linear-gradient(180deg, #2f7d97 0%, #1f5f76 100%);
        opacity: calc((var(--p) - 0.1) * 1.6);
      }
      .dr-road {
        position: absolute;
        left: -10%;
        right: -10%;
        bottom: 0;
        height: 36%;
        background: linear-gradient(180deg, #35424c 0%, #232d35 100%);
        transform: skewY(-1.4deg);
        transform-origin: left;
        overflow: hidden;
      }
      .dr-lane {
        position: absolute;
        left: 0;
        right: -40%;
        top: 34%;
        height: 6px;
        background: repeating-linear-gradient(90deg, #f4e7c4 0 60px, transparent 60px 130px);
        animation: laneMove 1.2s linear infinite;
      }
      .dr-car {
        position: absolute;
        left: 46%;
        bottom: 21%;
        width: 320px;
        transform: translateX(-50%);
        animation: carBob 3.2s ease-in-out infinite;
        filter: drop-shadow(0 14px 12px rgba(6, 20, 30, 0.35));
      }
      .dr-car svg {
        width: 100%;
        height: auto;
        display: block;
      }
      .dr-glass {
        fill: rgba(150, 200, 220, 0.6);
      }
      .dr-wheel {
        fill: #10161c;
      }
      .dr-hub {
        fill: #8fa3b3;
      }
      .dr-marker {
        position: absolute;
        right: 14%;
        bottom: 40%;
        display: grid;
        justify-items: center;
        gap: 6px;
        transform: translateY(calc((1 - var(--p)) * 20px)) scale(calc(0.6 + var(--p) * 0.4));
        opacity: calc((var(--p) - 0.55) * 3);
      }
      .dr-pin {
        width: 18px;
        height: 18px;
        border-radius: 50% 50% 50% 0;
        background: #e0785a;
        transform: rotate(-45deg);
        box-shadow: 0 6px 16px rgba(224, 120, 90, 0.5);
      }
      .dr-pin-label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #14303c;
        background: rgba(255, 255, 255, 0.85);
        padding: 4px 10px;
        border-radius: 999px;
      }
      .dr-copy {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 12vh;
        gap: 14px;
        color: #10222c;
      }
      .dr-copy h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2.4rem, 5vw, 4.2rem);
        line-height: 1;
        letter-spacing: -0.04em;
        margin: 0;
      }
      .dr-lead {
        max-width: 30rem;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(16, 34, 44, 0.82);
      }
      .dr-cta {
        align-self: flex-start;
        margin-top: 6px;
      }
      @keyframes laneMove {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-130px);
        }
      }
      @keyframes carBob {
        0%,
        100% {
          transform: translateX(-50%) translateY(0);
        }
        50% {
          transform: translateX(-50%) translateY(-4px);
        }
      }
      @media (max-width: 720px) {
        .dr-car {
          width: 220px;
        }
      }
    `,
  ],
})
export class CoastalDrive {
  bookUrl = whatsappUrl('Hi! I would like to arrange a private driver on the Riviera.');
}
