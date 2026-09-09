import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ADMIN_LOGIN } from './admin-credentials';
import { ADMIN_STORAGE_KEY, ADMIN_USERNAME_KEY } from './admin.constants';

interface AdminSessionState {
  ready: boolean;
  authenticated: boolean;
  username: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminSessionService {
  readonly state = signal<AdminSessionState>({ ready: false, authenticated: false, username: null });
  readonly authenticated = computed(() => this.state().authenticated);
  readonly ready = computed(() => this.state().ready);
  readonly username = computed(() => this.state().username);

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.restoreSession();
  }

  restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.state.set({ ready: true, authenticated: false, username: null });
      return;
    }

    const authenticated = sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    const username = authenticated ? sessionStorage.getItem(ADMIN_USERNAME_KEY) : null;
    this.state.set({ ready: true, authenticated, username });
  }

  signIn(username: string, password: string): boolean {
    const authenticated = username.trim() === ADMIN_LOGIN.username && password === ADMIN_LOGIN.password;

    if (!authenticated) {
      this.state.set({ ready: true, authenticated: false, username: null });
      return false;
    }

    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      sessionStorage.setItem(ADMIN_USERNAME_KEY, username.trim());
    }

    this.state.set({ ready: true, authenticated: true, username: username.trim() });
    return true;
  }

  signOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_USERNAME_KEY);
    }

    this.state.set({ ready: true, authenticated: false, username: null });
  }
}