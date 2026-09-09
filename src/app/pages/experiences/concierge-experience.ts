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
          <div class="cx-door cx-door-left">
            <span class="cx-handle"></span>
          </div>
          <div class="cx-door cx-door-right">
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
        height: 280vh;
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
      .cx-door {
        position: relative;
        background:
          linear-gradient(90deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0) 12%),
          linear-gradient(180deg, #24160c 0%, #3a2413 50%, #1c110a 100%);
        box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.55);
        will-change: transform;
        backface-visibility: hidden;
      }
      .cx-door::before {
        content: '';
        position: absolute;
        inset: 22px;
        border: 2px solid rgba(246, 216, 168, 0.28);
        border-radius: 6px;
      }
      .cx-door-left {
        transform-origin: left center;
        transform: rotateY(calc(var(--p) * -108deg));
        border-right: 1px solid rgba(0, 0, 0, 0.5);
      }
      .cx-door-right {
        transform-origin: right center;
        transform: rotateY(calc(var(--p) * 108deg));
        border-left: 1px solid rgba(0, 0, 0, 0.5);
      }
      .cx-handle {
        position: absolute;
        top: 50%;
        width: 10px;
        height: 46px;
        border-radius: 6px;
        background: linear-gradient(180deg, #f5d9a6, #b98b4e);
        transform: translateY(-50%);
      }
      .cx-door-left .cx-handle {
        right: 26px;
      }
      .cx-door-right .cx-handle {
        left: 26px;
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
