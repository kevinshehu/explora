import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { destinations } from '../../data/travel-data';
import { Tour } from '../models/travel.model';
import { whatsappUrl } from '../whatsapp';
import { WhatsappIcon } from './whatsapp-icon';

interface CalculatorOption {
  id: string;
  label: string;
  multiplier: number;
  description: string;
}

interface DurationOption {
  id: string;
  label: string;
  extraPerPerson: number;
}

let calculatorInstance = 0;

@Component({
  selector: 'app-price-calculator',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, WhatsappIcon],
  template: `
    <article class="price-calculator">
      <div class="calculator-heading">
        <p class="section-label">{{ label }}</p>
        <h3>{{ tour.title }}</h3>
        <p>{{ destinationName }} · {{ tour.duration }}</p>
      </div>

      <div class="calculator-controls">
        <label [attr.for]="instanceId + '-people'">
          <span>People</span>
          <select [id]="instanceId + '-people'" [(ngModel)]="guests">
            @for (count of guestOptions; track count) {
              <option [value]="count">{{ count }} guest{{ count > 1 ? 's' : '' }}</option>
            }
          </select>
        </label>

        <label [attr.for]="instanceId + '-package'">
          <span>Package</span>
          <select [id]="instanceId + '-package'" [(ngModel)]="selectedPackageId">
            @for (option of packageOptions; track option.id) {
              <option [value]="option.id">{{ option.label }}</option>
            }
          </select>
        </label>

        <label [attr.for]="instanceId + '-duration'">
          <span>Duration</span>
          <select [id]="instanceId + '-duration'" [(ngModel)]="selectedDurationId">
            @for (option of durationOptions; track option.id) {
              <option [value]="option.id">{{ option.label }}</option>
            }
          </select>
        </label>

        @if (showDate) {
          <label [attr.for]="instanceId + '-date'">
            <span>Date</span>
            <input [id]="instanceId + '-date'" type="date" [(ngModel)]="travelDate" />
          </label>
        }

        @if (showContactFields) {
          <label [attr.for]="instanceId + '-name'">
            <span>Name</span>
            <input [id]="instanceId + '-name'" [(ngModel)]="name" placeholder="John Doe" />
          </label>

          <label [attr.for]="instanceId + '-phone'">
            <span>Phone</span>
            <input [id]="instanceId + '-phone'" [(ngModel)]="phone" type="tel" placeholder="+355 6x xxx xxxx" />
          </label>

          <label class="calculator-notes" [attr.for]="instanceId + '-notes'">
            <span>Notes</span>
            <textarea [id]="instanceId + '-notes'" [(ngModel)]="notes" rows="4" placeholder="Pickup location, hotel preference, or questions"></textarea>
          </label>
        }
      </div>

      <div class="calculator-summary">
        <div>
          <p class="summary-label">Estimated total</p>
          <p class="summary-price">{{ total | currency:'EUR' }}</p>
        </div>
        <p>{{ guests }} guest{{ guests > 1 ? 's' : '' }} · {{ selectedPackage.label }} · {{ selectedDuration.label }}</p>
        <p class="summary-note">{{ selectedPackage.description }}</p>
      </div>

      <div class="calculator-actions">
        <a class="button-ghost" [href]="infoWhatsAppUrl" target="_blank" rel="noopener">
          <app-whatsapp-icon />
          Ask on WhatsApp
        </a>
        <a class="button-whatsapp" [href]="bookingWhatsAppUrl" target="_blank" rel="noopener">
          <app-whatsapp-icon />
          Book via WhatsApp
        </a>
      </div>
    </article>
  `,
})
export class PriceCalculator {
  private currentTour!: Tour;
  readonly instanceId = `price-calculator-${++calculatorInstance}`;

  @Input({ required: true }) set tour(value: Tour) {
    this.currentTour = value;
    this.durationOptions = [
      {
        id: 'base',
        label: value.duration,
        extraPerPerson: 0,
      },
      {
        id: 'relaxed',
        label: `${value.durationDays + 1} days relaxed pace`,
        extraPerPerson: 95,
      },
      {
        id: 'sunset',
        label: `${value.durationDays} days with sunset add-on`,
        extraPerPerson: 65,
      },
    ];
  }

  get tour(): Tour {
    return this.currentTour;
  }

  @Input() label = 'Calculate price';
  @Input() showDate = true;
  @Input() showContactFields = false;
  @Input() set initialDate(value: string | null | undefined) {
    const nextDate = value ?? '';
    if (this.travelDate !== nextDate) {
      this.travelDate = nextDate;
    }
  }

  guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
  guests = 2;
  selectedPackageId = 'signature';
  selectedDurationId = 'base';
  travelDate = '';
  name = '';
  phone = '';
  notes = '';
  durationOptions: DurationOption[] = [];

  packageOptions: CalculatorOption[] = [
    {
      id: 'signature',
      label: 'Signature package',
      multiplier: 1,
      description: 'Core itinerary with guided support',
    },
    {
      id: 'private',
      label: 'Private comfort',
      multiplier: 1.18,
      description: 'Private transfers and flexible timing',
    },
    {
      id: 'premium',
      label: 'Premium coastal',
      multiplier: 1.35,
      description: 'Priority planning and premium stops',
    },
  ];

  get destinationName(): string {
    return destinations.find((destination) => destination.id === this.tour.destinationId)?.city ?? this.tour.location;
  }

  get selectedPackage(): CalculatorOption {
    return this.packageOptions.find((option) => option.id === this.selectedPackageId) ?? this.packageOptions[0];
  }

  get selectedDuration(): DurationOption {
    return this.durationOptions.find((option) => option.id === this.selectedDurationId) ?? this.durationOptions[0];
  }

  get perPerson(): number {
    return Math.round(this.tour.priceFrom * this.selectedPackage.multiplier + this.selectedDuration.extraPerPerson);
  }

  get total(): number {
    return this.perPerson * Number(this.guests);
  }

  get infoWhatsAppUrl(): string {
    return whatsappUrl(
      `Hi! I'm interested in the ${this.tour.title} experience in ${this.destinationName}. Can you provide more information?`,
    );
  }

  get bookingWhatsAppUrl(): string {
    const details = [
      `Hi! I'd like to book the ${this.tour.title}.`,
      `Destination: ${this.destinationName}`,
      `Guests: ${this.guests}`,
      `Package: ${this.selectedPackage.label}`,
      `Duration: ${this.selectedDuration.label}`,
      `Estimated price: EUR ${this.total}`,
    ];

    if (this.travelDate) {
      details.push(`Date: ${this.travelDate}`);
      details.push('Please confirm availability and the next steps.');
    } else {
      details.push("I'd like to know the available dates.");
    }

    if (this.name) {
      details.push(`Name: ${this.name}`);
    }

    if (this.phone) {
      details.push(`Phone: ${this.phone}`);
    }

    if (this.notes) {
      details.push(`Notes: ${this.notes}`);
    }

    return whatsappUrl(details.join('\n'));
  }
}
