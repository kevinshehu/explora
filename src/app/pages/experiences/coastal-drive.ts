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
        <div class="dr-sun" aria-hidden="true"></div>
        <div class="dr-mountains dr-far" aria-hidden="true"></div>
        <div class="dr-mountains dr-mid" aria-hidden="true"></div>
        <div class="dr-sea" aria-hidden="true"></div>
        <div class="dr-mountains dr-near" aria-hidden="true"></div>

        <div class="dr-scenery" aria-hidden="true">
          <span class="dr-cypress" style="left: 8%"></span>
          <span class="dr-cypress short" style="left: 15%"></span>
          <span class="dr-bush" style="left: 24%"></span>
          <span class="dr-cypress" style="left: 70%"></span>
          <span class="dr-bush" style="left: 82%"></span>
          <span class="dr-cypress short" style="left: 92%"></span>
        </div>

        <div class="dr-road" aria-hidden="true">
          <div class="dr-road-sheen"></div>
          <div class="dr-lane"></div>
        </div>

        <div class="dr-marker" aria-hidden="true">
          <span class="dr-pin"></span>
          <span class="dr-pin-label">Your villa</span>
        </div>

        <div class="dr-car" aria-hidden="true">
          <div class="dr-car-shadow"></div>
          <svg viewBox="0 0 460 170" role="img" aria-label="Luxury chauffeur car">
            <defs>
              <linearGradient id="carPaint" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#3a4b5c" />
                <stop offset="0.4" stop-color="#1c2a36" />
                <stop offset="1" stop-color="#0a121a" />
              </linearGradient>
              <linearGradient id="carSheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="rgba(255,255,255,0)" />
                <stop offset="0.5" stop-color="rgba(255,255,255,0.35)" />
                <stop offset="1" stop-color="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#cfe6f2" />
                <stop offset="1" stop-color="#4b6577" />
              </linearGradient>
              <radialGradient id="rim" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stop-color="#e9eef2" />
                <stop offset="0.6" stop-color="#9aa8b4" />
                <stop offset="1" stop-color="#41505c" />
              </radialGradient>
            </defs>

            <path
              class="dr-body"
              d="M18 118 L36 116 Q52 84 96 78 L150 72 Q180 58 250 56 L300 56 Q356 58 388 84 L430 100 Q446 104 446 120 L446 130 Q446 138 436 138 L30 138 Q18 138 18 128 Z"
              fill="url(#carPaint)"
            />
            <path
              class="dr-lower"
              d="M22 132 L440 132 Q446 132 446 126 L446 132 Q446 140 436 140 L30 140 Q22 140 22 132 Z"
              fill="#050b10"
            />
            <path class="dr-sheen" d="M40 112 Q160 92 430 104 L430 110 Q160 100 42 118 Z" fill="url(#carSheen)" />

            <path class="dr-glass" d="M108 78 Q140 60 196 58 L196 82 L118 84 Z" fill="url(#carGlass)" />
            <path class="dr-glass" d="M206 58 L292 58 Q330 60 350 80 L206 82 Z" fill="url(#carGlass)" />
            <line class="dr-pillar" x1="200" y1="58" x2="200" y2="82" />

            <path class="dr-headlight" d="M430 100 Q446 104 446 116 L430 114 Z" />
            <circle class="dr-taillight" cx="30" cy="120" r="4" />
            <path class="dr-grille" d="M436 118 L446 120 L446 128 L434 126 Z" />

            <g class="dr-wheelset">
              <circle class="dr-tyre" cx="124" cy="134" r="28" />
              <circle class="dr-rim" cx="124" cy="134" r="17" fill="url(#rim)" />
              <circle class="dr-tyre" cx="360" cy="134" r="28" />
              <circle class="dr-rim" cx="360" cy="134" r="17" fill="url(#rim)" />
              <g class="dr-spokes">
                <line x1="124" y1="120" x2="124" y2="148" />
                <line x1="110" y1="134" x2="138" y2="134" />
                <line x1="114" y1="124" x2="134" y2="144" />
                <line x1="114" y1="144" x2="134" y2="124" />
                <line x1="360" y1="120" x2="360" y2="148" />
                <line x1="346" y1="134" x2="374" y2="134" />
                <line x1="350" y1="124" x2="370" y2="144" />
                <line x1="350" y1="144" x2="370" y2="124" />
              </g>
            </g>
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
        height: 190vh;
      }
      .dr-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(180deg, #f4d9a8 0%, #eaf1ee 55%);
      }
      .dr-sky {
        position: absolute;
        inset: 0 0 36% 0;
        background: linear-gradient(180deg, #8bb9d4 0%, #e6d9b8 70%, #f6e8c8 100%);
      }
      .dr-sun {
        position: absolute;
        right: 18%;
        top: 8%;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: radial-gradient(circle, #fff7e0 0%, #ffd98a 45%, rgba(255, 200, 120, 0) 72%);
        opacity: 0.9;
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
        background-image: linear-gradient(135deg, transparent 44%, #9db6bd 44%, #86a4ad 56%, transparent 56%);
        opacity: 0.5;
        transform: translateX(calc(var(--p) * -26%));
      }
      .dr-mid {
        bottom: 39%;
        height: 28%;
        background-image: linear-gradient(126deg, transparent 44%, #6e9392 44%, #5c8482 56%, transparent 56%);
        opacity: 0.7;
        transform: translateX(calc(var(--p) * -46%));
      }
      .dr-near {
        bottom: 40%;
        height: 24%;
        background-image: linear-gradient(120deg, transparent 44%, #3f6f6b 44%, #2f5b58 56%, transparent 56%);
        transform: translateX(calc(var(--p) * -72%));
      }
      .dr-sea {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 34%;
        height: 12%;
        background: linear-gradient(180deg, #3a8aa2 0%, #1f5f76 100%);
        opacity: calc((var(--p) - 0.1) * 1.6);
      }
      .dr-scenery {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 30%;
        height: 20%;
        transform: translateX(calc(var(--p) * -120%));
        will-change: transform;
      }
      .dr-cypress {
        position: absolute;
        bottom: 0;
        width: 16px;
        height: 78px;
        background: linear-gradient(180deg, #2c5344 0%, #16382c 100%);
        border-radius: 50% 50% 40% 40% / 70% 70% 30% 30%;
        box-shadow: 0 8px 10px rgba(10, 30, 24, 0.25);
      }
      .dr-cypress.short {
        height: 54px;
        width: 13px;
      }
      .dr-bush {
        position: absolute;
        bottom: 0;
        width: 42px;
        height: 26px;
        background: radial-gradient(circle at 40% 30%, #4a7a58, #2c5140);
        border-radius: 50% 50% 44% 44%;
      }
      .dr-road {
        position: absolute;
        left: -10%;
        right: -10%;
        bottom: 0;
        height: 36%;
        background: linear-gradient(180deg, #3c4954 0%, #212b33 100%);
        transform: skewY(-1.4deg);
        transform-origin: left;
        overflow: hidden;
      }
      .dr-road-sheen {
        position: absolute;
        inset: 0;
        background: radial-gradient(120% 60% at 60% 0%, rgba(255, 220, 160, 0.28) 0%, rgba(255, 220, 160, 0) 60%);
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
        bottom: 20%;
        width: 360px;
        transform: translateX(-50%);
        animation: carBob 3.4s ease-in-out infinite;
      }
      .dr-car-shadow {
        position: absolute;
        left: 8%;
        right: 6%;
        bottom: -6px;
        height: 20px;
        background: radial-gradient(closest-side, rgba(6, 16, 22, 0.5), rgba(6, 16, 22, 0));
        filter: blur(3px);
      }
      .dr-car svg {
        width: 100%;
        height: auto;
        display: block;
        filter: drop-shadow(0 10px 10px rgba(6, 20, 30, 0.3));
      }
      .dr-lower {
        opacity: 0.9;
      }
      .dr-glass {
        stroke: rgba(255, 255, 255, 0.4);
        stroke-width: 0.8;
      }
      .dr-pillar {
        stroke: #0c151d;
        stroke-width: 3;
      }
      .dr-headlight {
        fill: #fff4d6;
      }
      .dr-taillight {
        fill: #e0785a;
      }
      .dr-grille {
        fill: #7d8f9d;
      }
      .dr-tyre {
        fill: #0c1218;
      }
      .dr-spokes line {
        stroke: #cdd8e0;
        stroke-width: 1.6;
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
