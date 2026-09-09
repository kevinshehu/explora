import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found';

export const appRoutes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'destinations',
    loadComponent: () =>
      import('./pages/destinations-page').then((page) => page.DestinationsPage),
  },
  {
    path: 'destinations/:slug',
    loadComponent: () =>
      import('./pages/destination-detail-page').then(
        (page) => page.DestinationDetailPage,
      ),
  },
  {
    path: 'tours',
    loadComponent: () => import('./pages/tours-page').then((page) => page.ToursPage),
  },
  {
    path: 'tours/:slug',
    loadComponent: () =>
      import('./pages/tour-detail-page').then((page) => page.TourDetailPage),
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking-page').then((page) => page.BookingPage),
  },
  { path: 'home', redirectTo: '' },
  { path: '**', component: NotFoundPage },
];
