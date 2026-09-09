export interface DestinationSummary {
  city: string;
  title: string;
  image: string;
  blurb: string;
}

export interface Destination {
  id: string;
  slug: string;
  city: string;
  country: string;
  tagline: string;
  description: string;
  longDescription: string;
  priceFrom: number;
  rating: number;
  reviews: number;
  experiences: number;
  image: string;
  gallery: string[];
  category: string;
  highlights: string[];
  activities: string[];
  tags: string[];
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  category: string;
  duration: string;
  durationDays: number;
  rating: number;
  reviews: number;
  priceFrom: number;
  image: string;
  gallery: string[];
  location: string;
  overview: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: string[];
  tags: string[];
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  quote: string;
}
