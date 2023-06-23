import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private tokenExpiredSubject = new BehaviorSubject<boolean>(false);
  tokenExpired = this.tokenExpiredSubject.asObservable();

  constructor() {
    setInterval(() => this.checkTokenExpiration(), 1000 * 60); // Check every minute
  }
  // set user logged in status or logged out
  setLoggedIn(value: boolean, token: string | null = null) {
    if (value && token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // get stored token
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.token;
    if (!token) return true;

    const decoded: any = jwt_decode(token);
    const exp = decoded.exp;

    if (!exp) {
      return true;
    }

    const current_time = Date.now() / 1000;
    if (exp < current_time) {
      return true;
    } else {
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }

  private checkTokenExpiration() {
    if (this.isLoggedIn()) {
      const tokenExpired = this.isTokenExpired();
      this.tokenExpiredSubject.next(tokenExpired);
    }
  }
}
