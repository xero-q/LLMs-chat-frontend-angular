import { Injectable } from '@angular/core';
import environment from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    const payload = {
      username,
      password,
    };

    return this.httpClient.post(`${this.apiUrl}/api/auth/login`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem('user', username);
        this.saveTokens(response.access, response.refresh);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  signup(username: string, email: string, password: string) {
    const payload = {
      username,
      email,
      password,
    };

    return this.httpClient.post(`${this.apiUrl}/api/auth/signup`, payload);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  saveTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post(`${environment.API_URL}/api/auth/refresh`, {
      refresh: this.getRefreshToken(),
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
