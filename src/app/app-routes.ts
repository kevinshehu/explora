import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found';
import { adminAuthGuard } from './admin/admin-auth.guard';
import { AdminLoginPage } from './admin/login/admin-login.page';
import { AdminShellComponent } from './admin/shell/admin-shell.component';

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
  {
    path: 'concierge',
    loadComponent: () => import('./pages/concierge-page').then((page) => page.ConciergePage),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page').then((page) => page.AboutPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page').then((page) => page.ContactPage),
  },
  {
    path: 'admin',
    children: [
      { path: '', pathMatch: 'full', component: AdminLoginPage },
      {
        path: '',
        canActivate: [adminAuthGuard],
        component: AdminShellComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'calendar' },
          {
            path: 'calendar',
            loadComponent: () => import('./admin/calendar/admin-calendar.page').then((page) => page.AdminCalendarPage),
          },
          {
            path: 'customers',
            loadComponent: () => import('./admin/customers/admin-customers.page').then((page) => page.AdminCustomersPage),
          },
          { path: '**', redirectTo: 'calendar' },
        ],
      },
    ],
  },
  { path: 'home', redirectTo: '' },
  { path: '**', component: NotFoundPage },
];
