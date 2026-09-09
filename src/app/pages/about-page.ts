import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitle } from '../shared/components/section-title';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [SectionTitle, RouterLink],
  template: `
    <section class="page-hero page-hero-soft">
      <div class="container page-hero-inner">
        <p class="eyebrow">About us</p>
        <h1>Discover the South Riviera with a slower, more beautiful rhythm.</h1>
      </div>
    </section>

    <section class="container section-shell">
      <div class="story-grid">
        <div>
          <app-section-title
            label="Our story"
            title="A local approach to the coast"
            description="We help travelers experience southern Albania in a way that feels effortless, genuine, and deeply memorable."
          />
          <p class="story-text">
            From cliffside coves to quiet village lanes, the Albanian Riviera is about more than beautiful beaches. It is a coastline shaped by warm hospitality, extraordinary views, and the perfect balance between adventure and calm.
          </p>
          <p class="story-text">
            Our role is simple: match the right home, the right pace, and the right local support so each stay feels personal from the first message to the final evening by the sea.
          </p>
        </div>

        <div class="info-card">
          <h3>Why travelers choose us</h3>
          <ul class="feature-list">
            <li>Curated villa selection across the South Riviera</li>
            <li>Personalized support for couples, families, and groups</li>
            <li>Local knowledge for beaches, dining, and hidden gem routes</li>
            <li>Easy booking and seamless arrival planning</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="container section-shell">
      <div class="mini-grid">
        <article class="mini-panel">
          <span>01</span>
          <h3>Carefully selected stays</h3>
          <p>We focus on homes with the right atmosphere, location, and comfort for a relaxed coastal escape.</p>
        </article>
        <article class="mini-panel">
          <span>02</span>
          <h3>Thoughtful planning</h3>
          <p>Every itinerary is shaped around how you want to move through the coast: slow, stylish, and easy.</p>
        </article>
        <article class="mini-panel">
          <span>03</span>
          <h3>Local expertise</h3>
          <p>We know which bays, restaurants, and experiences feel most special beyond the obvious stops.</p>
        </article>
      </div>
    </section>

    <section class="cta-strip compact">
      <div class="container cta-inner">
        <div>
          <p class="eyebrow">Ready to begin</p>
          <h2>Plan your Riviera getaway.</h2>
        </div>
        <a class="button-primary" routerLink="/destinations">Explore villas</a>
      </div>
    </section>
  `,
})
export class AboutPage {}
