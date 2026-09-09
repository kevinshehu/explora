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
    path: 'admin',
    children: [
      { path: '', pathMatch: 'full', component: AdminLoginPage },
      {
        path: '',
        canActivate: [adminAuthGuard],
        component: AdminShellComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            loadComponent: () => import('./admin/dashboard/admin-dashboard.page').then((page) => page.AdminDashboardPage),
          },
          {
            path: 'reservations',
            loadComponent: () => import('./admin/reservations/admin-reservations.page').then((page) => page.AdminReservationsPage),
          },
          {
            path: 'reservations/:id',
            loadComponent: () => import('./admin/reservations/admin-reservation-details.page').then((page) => page.AdminReservationDetailsPage),
          },
          {
            path: 'calendar',
            loadComponent: () => import('./admin/calendar/admin-calendar.page').then((page) => page.AdminCalendarPage),
          },
          {
            path: 'customers',
            loadComponent: () => import('./admin/customers/admin-customers.page').then((page) => page.AdminCustomersPage),
          },
          {
            path: 'customers/:id',
            loadComponent: () => import('./admin/customers/admin-customer-details.page').then((page) => page.AdminCustomerDetailsPage),
          },
          {
            path: 'destinations',
            loadComponent: () => import('./admin/destinations/admin-destinations.page').then((page) => page.AdminDestinationsPage),
          },
          {
            path: 'tours',
            loadComponent: () => import('./admin/tours/admin-tours.page').then((page) => page.AdminToursPage),
          },
          {
            path: 'settings',
            loadComponent: () => import('./admin/settings/admin-settings.page').then((page) => page.AdminSettingsPage),
          },
        ],
      },
    ],
  },
  { path: 'home', redirectTo: '' },
  { path: '**', component: NotFoundPage },
];
