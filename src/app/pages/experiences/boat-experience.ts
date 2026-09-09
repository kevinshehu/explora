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
          <div class="boat-inner">
            <svg class="yacht" viewBox="0 0 420 150" role="img" aria-label="Private yacht">
              <defs>
                <linearGradient id="hullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#f5faff" />
                  <stop offset="0.55" stop-color="#dfe9f2" />
                  <stop offset="1" stop-color="#a9bccb" />
                </linearGradient>
                <linearGradient id="superGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#ffffff" />
                  <stop offset="1" stop-color="#cdd9e4" />
                </linearGradient>
              </defs>
              <path
                class="yacht-hull"
                d="M18 96 Q14 112 58 112 L332 112 Q392 112 408 88 L360 88 L352 96 Z"
                fill="url(#hullGrad)"
              />
              <path
                class="yacht-super"
                d="M92 88 L100 64 L168 64 L178 50 L258 50 L268 64 L318 64 L330 88 Z"
                fill="url(#superGrad)"
              />
              <rect class="yacht-window" x="112" y="70" width="150" height="9" rx="4" />
              <line class="yacht-mast" x1="214" y1="50" x2="214" y2="24" />
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
        height: 300vh;
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
        right: 62%;
        bottom: 4px;
        height: 26px;
        width: calc(60px + var(--p) * 260px);
        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 100%);
        border-radius: 50%;
        filter: blur(3px);
        opacity: 0.8;
      }

      .boat-inner {
        width: 260px;
        animation: bob 6.5s ease-in-out infinite;
        transform-origin: center bottom;
        filter: drop-shadow(0 18px 18px rgba(6, 20, 30, 0.35));
      }

      .yacht {
        width: 100%;
        height: auto;
        display: block;
      }

      .yacht-window {
        fill: rgba(40, 66, 92, 0.55);
      }

      .yacht-mast {
        stroke: #e6eef5;
        stroke-width: 2.5;
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
          height: 240vh;
        }
      }
    `,
  ],
})
export class BoatExperience {
  bookUrl = whatsappUrl('Hi! I would love a private boat day on the Albanian Riviera.');
}
