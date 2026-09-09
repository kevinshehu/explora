import { Component } from '@angular/core';
import { Reveal } from '../../shared/animation/reveal';
import { ScrollScene } from '../../shared/animation/scroll-scene';
import { whatsappUrl } from '../../shared/whatsapp';

@Component({
  selector: 'app-boat-experience',
  standalone: true,
  imports: [ScrollScene, Reveal],
  template: `
    <section class="boat-scene" appScene aria-label="Private boat experiences">
      <div class="boat-stage">
        <div class="boat-sky" aria-hidden="true"></div>
        <div class="boat-sunset" aria-hidden="true"></div>
        <div class="boat-sun" aria-hidden="true"></div>

        <div class="boat-sea" aria-hidden="true">
          <div class="boat-grade"></div>
          <svg class="boat-wave boat-wave-back" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0 60 Q 180 20 360 60 T 720 60 T 1080 60 T 1440 60 V120 H0 Z" />
          </svg>
          <svg class="boat-wave boat-wave-front" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0 70 Q 200 30 400 70 T 800 70 T 1200 70 T 1600 70 V120 H0 Z" />
          </svg>
        </div>

        <div class="boat-track" aria-hidden="true">
          <div class="boat-wake"></div>
          <div class="boat-reflection">
            <svg class="yacht" viewBox="0 0 460 170" role="presentation">
              <use href="#yachtBody" />
            </svg>
          </div>
          <div class="boat-inner">
            <svg class="yacht" viewBox="0 0 460 170" role="img" aria-label="Private luxury yacht">
              <defs>
                <linearGradient id="hullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#ffffff" />
                  <stop offset="0.5" stop-color="#e4edf5" />
                  <stop offset="1" stop-color="#9fb3c4" />
                </linearGradient>
                <linearGradient id="hullDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#20323f" />
                  <stop offset="1" stop-color="#0c1a24" />
                </linearGradient>
                <linearGradient id="superGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#ffffff" />
                  <stop offset="1" stop-color="#d3dfea" />
                </linearGradient>
                <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#8fb8cf" />
                  <stop offset="1" stop-color="#39566a" />
                </linearGradient>
                <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#f4f8fb" />
                  <stop offset="0.5" stop-color="#b9c6d1" />
                  <stop offset="1" stop-color="#7d8f9d" />
                </linearGradient>
              </defs>

              <g id="yachtBody">
                <path
                  class="yacht-hull-dark"
                  d="M14 108 Q10 128 60 130 L360 130 Q416 128 446 96 L392 96 L372 108 Z"
                  fill="url(#hullDark)"
                />
                <path
                  class="yacht-hull"
                  d="M22 104 L372 104 L392 96 L446 96 Q420 82 372 84 L60 92 Q30 94 22 104 Z"
                  fill="url(#hullGrad)"
                />
                <rect class="yacht-boot" x="30" y="101" width="342" height="4" rx="2" />

                <path
                  class="yacht-deck2"
                  d="M96 84 L108 58 L214 56 L226 44 L308 44 L322 60 L346 84 Z"
                  fill="url(#superGrad)"
                />
                <path
                  class="yacht-deck3"
                  d="M150 44 L160 30 L286 30 L298 44 Z"
                  fill="url(#superGrad)"
                />

                <path class="yacht-glass" d="M112 78 L120 62 L206 60 L206 78 Z" fill="url(#glassGrad)" />
                <path class="yacht-glass" d="M216 60 L300 60 L318 78 L216 78 Z" fill="url(#glassGrad)" />
                <rect class="yacht-glass2" x="164" y="34" width="120" height="8" rx="3" fill="url(#glassGrad)" />

                <g class="yacht-portholes">
                  <circle cx="70" cy="112" r="3.4" />
                  <circle cx="92" cy="112" r="3.4" />
                  <circle cx="114" cy="112" r="3.4" />
                  <circle cx="136" cy="112" r="3.4" />
                </g>

                <line class="yacht-rail" x1="60" y1="92" x2="372" y2="88" />
                <g class="yacht-stanchions">
                  <line x1="90" y1="84" x2="90" y2="92" />
                  <line x1="140" y1="82" x2="140" y2="92" />
                  <line x1="190" y1="82" x2="190" y2="92" />
                  <line x1="240" y1="82" x2="240" y2="92" />
                  <line x1="300" y1="82" x2="300" y2="90" />
                </g>

                <rect class="yacht-chrome" x="330" y="70" width="18" height="14" rx="3" fill="url(#chrome)" />
                <line class="yacht-mast" x1="224" y1="30" x2="224" y2="6" />
                <line class="yacht-radar" x1="212" y1="12" x2="236" y2="12" />
                <circle class="yacht-light" cx="224" cy="6" r="2.4" />
                <path class="yacht-bowlight" d="M436 96 l8 -2 -8 -2 Z" />
              </g>
            </svg>
          </div>
        </div>

        <div class="boat-copy container">
          <p class="eyebrow" appReveal>Private boat experiences</p>
          <h2 appReveal>Sail the Albanian Riviera</h2>
          <p class="boat-lead" appReveal>
            Glide from Vlorë to Ksamil aboard a private yacht — hidden coves, secret swims,
            and a sunset that belongs only to you.
          </p>
          <a class="button-primary boat-cta" [href]="bookUrl" target="_blank" rel="noopener">
            Explore the coastline
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

      .boat-scene {
        --p: 0;
        position: relative;
        height: 200vh;
      }

      .boat-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: #0a1f2e;
      }

      .boat-sky {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, #7db6d6 0%, #bfe0ea 46%, #eaf6f6 72%);
      }

      .boat-sunset {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, #24344f 0%, #cf6a4f 52%, #f3b06a 74%, #f6d8a8 86%);
        opacity: calc((var(--p) - 0.32) * 2.4);
      }

      .boat-sun {
        position: absolute;
        left: 50%;
        top: 0;
        width: 220px;
        height: 220px;
        border-radius: 50%;
        background: radial-gradient(circle, #fff7e6 0%, #ffcf87 42%, rgba(255, 176, 106, 0) 70%);
        transform: translate(-50%, calc(-14vh + var(--p) * 58vh));
        opacity: calc(0.35 + var(--p) * 0.65);
      }

      .boat-sea {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 46%;
        background: url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=80')
          center/cover no-repeat;
        transform: translateY(calc((1 - var(--p)) * 6vh));
      }

      .boat-grade {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(10, 31, 46, 0.1) 0%, rgba(10, 31, 46, 0.55) 100%);
        mix-blend-mode: multiply;
        opacity: calc(0.4 + (var(--p) - 0.32) * 1.2);
      }

      .boat-wave {
        position: absolute;
        left: -10%;
        bottom: 42%;
        width: 130%;
        height: 90px;
        fill: rgba(233, 246, 250, 0.55);
      }

      .boat-wave-back {
        animation: waveDrift 17s linear infinite;
        opacity: 0.5;
      }

      .boat-wave-front {
        bottom: 40%;
        fill: rgba(255, 255, 255, 0.75);
        animation: waveDrift 11s linear infinite reverse;
      }

      .boat-track {
        position: absolute;
        left: 0;
        bottom: 40%;
        width: 100%;
        transform: translateX(calc(-58% + var(--p) * 168%));
        will-change: transform;
      }

      .boat-wake {
        position: absolute;
        right: 60%;
        bottom: 2px;
        height: 30px;
        width: calc(70px + var(--p) * 300px);
        background:
          radial-gradient(60% 120% at 100% 50%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 60%),
          linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 100%);
        border-radius: 50%;
        filter: blur(4px);
        opacity: 0.85;
      }

      .boat-reflection {
        position: absolute;
        left: 0;
        bottom: -8%;
        width: 300px;
        transform: scaleY(-1);
        opacity: 0.22;
        filter: blur(3px);
        -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 78%);
        mask-image: linear-gradient(180deg, #000 0%, transparent 78%);
        animation: reflectionWobble 5s ease-in-out infinite;
      }

      .boat-inner {
        width: 300px;
        animation: bob 6.5s ease-in-out infinite;
        transform-origin: center bottom;
        filter: drop-shadow(0 16px 16px rgba(6, 20, 30, 0.4));
      }

      .yacht {
        width: 100%;
        height: auto;
        display: block;
      }

      .yacht-boot {
        fill: #1b2d3a;
      }
      .yacht-glass,
      .yacht-glass2 {
        stroke: rgba(255, 255, 255, 0.5);
        stroke-width: 0.6;
      }
      .yacht-portholes circle {
        fill: rgba(200, 228, 240, 0.85);
      }
      .yacht-rail,
      .yacht-stanchions line {
        stroke: rgba(220, 232, 242, 0.85);
        stroke-width: 1.4;
      }
      .yacht-mast,
      .yacht-radar {
        stroke: #dfe9f2;
        stroke-width: 2;
      }
      .yacht-light {
        fill: #ffd27f;
      }
      .yacht-bowlight {
        fill: #ffe6b0;
      }

      .boat-copy {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 14px;
        color: #fff;
        text-shadow: 0 2px 22px rgba(6, 20, 30, 0.45);
        pointer-events: none;
      }

      .boat-copy .eyebrow {
        color: #f6d8a8;
      }

      .boat-copy h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2.4rem, 5vw, 4.4rem);
        line-height: 1;
        letter-spacing: -0.04em;
        margin: 0;
        max-width: 14ch;
      }

      .boat-lead {
        max-width: 34rem;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.88);
      }

      .boat-cta {
        align-self: flex-start;
        margin-top: 8px;
        pointer-events: auto;
        opacity: calc((var(--p) - 0.6) * 5);
        transform: translateY(calc((1 - var(--p)) * 14px));
        transition: opacity 0.3s ease;
      }

      .ex-reveal {
        opacity: 0;
        transform: translateY(26px);
        transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
          transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .ex-reveal.is-revealed {
        opacity: 1;
        transform: none;
      }

      @keyframes bob {
        0%,
        100% {
          transform: translateY(0) rotate(-1.1deg);
        }
        50% {
          transform: translateY(-9px) rotate(1.1deg);
        }
      }

      @keyframes reflectionWobble {
        0%,
        100% {
          transform: scaleY(-1) skewX(-2deg);
        }
        50% {
          transform: scaleY(-1) skewX(2deg);
        }
      }

      @keyframes waveDrift {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-18%);
        }
      }

      @media (max-width: 720px) {
        .boat-inner {
          width: 190px;
        }
        .boat-scene {
          height: 170vh;
        }
      }
    `,
  ],
})
export class BoatExperience {
  bookUrl = whatsappUrl('Hi! I would love a private boat day on the Albanian Riviera.');
}
