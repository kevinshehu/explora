import { Component } from '@angular/core';
import { Reveal } from '../../shared/animation/reveal';
import { ScrollScene } from '../../shared/animation/scroll-scene';
import { whatsappUrl } from '../../shared/whatsapp';

@Component({
  selector: 'app-concierge-experience',
  standalone: true,
  imports: [ScrollScene, Reveal],
  template: `
    <section class="cx-scene" appScene aria-label="Concierge services">
      <div class="cx-stage">
        <div class="cx-interior" aria-hidden="true">
          <div class="cx-glow"></div>
          <div class="cx-services container">
            <p class="eyebrow" appReveal>Your private concierge is waiting</p>
            <h2 appReveal>Step inside</h2>
            <ul class="cx-list">
              @for (service of services; track service) {
                <li appReveal>{{ service }}</li>
              }
            </ul>
            <a class="button-primary cx-cta" [href]="bookUrl" target="_blank" rel="noopener">
              Open the door
            </a>
          </div>
        </div>

        <div class="cx-frame" aria-hidden="true">
          <div class="cx-arch"></div>
          <div class="cx-floor"></div>
          <div class="cx-sconce cx-sconce-left"></div>
          <div class="cx-sconce cx-sconce-right"></div>
          <div class="cx-plant cx-plant-left"></div>
          <div class="cx-plant cx-plant-right"></div>

          <div class="cx-door cx-door-left">
            <span class="cx-panel cx-panel-top"></span>
            <span class="cx-panel cx-panel-bottom"></span>
            <span class="cx-handle"></span>
          </div>
          <div class="cx-door cx-door-right">
            <span class="cx-panel cx-panel-top"></span>
            <span class="cx-panel cx-panel-bottom"></span>
            <span class="cx-handle"></span>
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
      .cx-scene {
        --p: 0;
        position: relative;
        height: 190vh;
      }
      .cx-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: #07131b;
        perspective: 2000px;
      }
      .cx-interior {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background:
          radial-gradient(120% 90% at 50% 40%, #6a4a2a 0%, #2c1c10 60%, #120b06 100%);
        opacity: calc(0.15 + var(--p) * 0.85);
      }
      .cx-glow {
        position: absolute;
        left: 50%;
        top: 44%;
        width: 60vw;
        height: 60vw;
        transform: translate(-50%, -50%) scale(calc(0.4 + var(--p) * 0.8));
        background: radial-gradient(circle, rgba(255, 214, 150, 0.75) 0%, rgba(255, 190, 110, 0) 62%);
        opacity: calc((var(--p) - 0.2) * 1.6);
      }
      .cx-services {
        position: relative;
        z-index: 1;
        text-align: center;
        color: #fff7ec;
        display: grid;
        gap: 14px;
        justify-items: center;
        opacity: calc((var(--p) - 0.5) * 2.4);
      }
      .cx-services .eyebrow {
        color: #f6d8a8;
      }
      .cx-services h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2.2rem, 4.4vw, 3.8rem);
        margin: 0;
        letter-spacing: -0.03em;
      }
      .cx-list {
        list-style: none;
        padding: 0;
        margin: 6px 0 4px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px 18px;
        max-width: 40rem;
      }
      .cx-list li {
        font-size: 0.95rem;
        letter-spacing: 0.02em;
        color: rgba(255, 247, 236, 0.9);
        border: 1px solid rgba(246, 216, 168, 0.4);
        border-radius: 999px;
        padding: 8px 16px;
      }
      .cx-cta {
        margin-top: 6px;
      }
      .cx-frame {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        transform-style: preserve-3d;
      }
      .cx-arch {
        position: absolute;
        left: 50%;
        top: 0;
        width: min(74vw, 780px);
        height: 15%;
        transform: translateX(-50%);
        border-radius: 0 0 26px 26px;
        background: linear-gradient(180deg, #6a6157 0%, #4c463d 100%);
        box-shadow:
          inset 0 -6px 0 #5b5349,
          0 20px 50px rgba(0, 0, 0, 0.4);
        z-index: 3;
      }
      .cx-arch::after {
        content: '';
        position: absolute;
        left: 8%;
        right: 8%;
        top: 22%;
        height: 40%;
        border-radius: 4px;
        background: repeating-linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.05) 0 30px,
          rgba(0, 0, 0, 0.12) 30px 32px
        );
      }
      .cx-floor {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 12%;
        background: linear-gradient(180deg, #2a251f 0%, #17130f 100%);
        box-shadow: inset 0 20px 40px rgba(0, 0, 0, 0.5);
        z-index: 3;
      }
      .cx-sconce {
        position: absolute;
        top: 34%;
        width: 10px;
        height: 46px;
        border-radius: 6px;
        background: linear-gradient(180deg, #f6d8a8, #8a6a3a);
        z-index: 4;
        box-shadow: 0 0 30px 10px rgba(255, 205, 130, calc(0.1 + var(--p) * 0.6));
      }
      .cx-sconce-left {
        left: 10%;
      }
      .cx-sconce-right {
        right: 10%;
      }
      .cx-plant {
        position: absolute;
        bottom: 9%;
        width: 46px;
        height: 120px;
        z-index: 4;
        background: radial-gradient(20px 60px at 50% 0%, #2f5140 0%, #1c3527 70%, transparent 72%);
      }
      .cx-plant::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 40px;
        height: 34px;
        transform: translateX(-50%);
        background: linear-gradient(180deg, #7a5a34, #4a3620);
        border-radius: 6px 6px 4px 4px;
      }
      .cx-plant-left {
        left: 6%;
      }
      .cx-plant-right {
        right: 6%;
      }
      .cx-door {
        position: relative;
        z-index: 2;
        margin: 13% 0 12%;
        background:
          linear-gradient(90deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0) 14%),
          repeating-linear-gradient(180deg, #3a2413 0 40px, #34200f 40px 80px),
          linear-gradient(180deg, #45280f 0%, #2a1809 100%);
        box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.6);
        will-change: transform;
        backface-visibility: hidden;
      }
      .cx-panel {
        position: absolute;
        left: 18%;
        right: 18%;
        border: 2px solid rgba(246, 216, 168, 0.22);
        border-radius: 6px;
        box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.4);
      }
      .cx-panel-top {
        top: 10%;
        height: 40%;
      }
      .cx-panel-bottom {
        bottom: 10%;
        height: 34%;
      }
      .cx-door-left {
        transform-origin: left center;
        transform: perspective(1600px) rotateY(calc(var(--p) * -112deg));
        border-right: 1px solid rgba(0, 0, 0, 0.5);
      }
      .cx-door-right {
        transform-origin: right center;
        transform: perspective(1600px) rotateY(calc(var(--p) * 112deg));
        border-left: 1px solid rgba(0, 0, 0, 0.5);
      }
      .cx-handle {
        position: absolute;
        top: 50%;
        width: 8px;
        height: 52px;
        border-radius: 6px;
        background: linear-gradient(180deg, #fff0cf 0%, #f5d9a6 40%, #a97e42 100%);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        transform: translateY(-50%);
      }
      .cx-door-left .cx-handle {
        right: 22px;
      }
      .cx-door-right .cx-handle {
        left: 22px;
      }
    `,
  ],
})
export class ConciergeExperience {
  services = [
    'Private driver',
    'Restaurant reservations',
    'Yacht charter',
    'Beach club access',
    'Private chef',
    'Villa service',
    'Airport transfer',
    'Custom experiences',
  ];
  bookUrl = whatsappUrl('Hi! I would like to arrange concierge services on the Riviera.');
}
