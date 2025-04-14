import { Injectable } from '@angular/core';
import environment from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string) {
    const payload = {
      username,
      password,
    };

    return this.httpClient.post(`${this.apiUrl}/api/auth/login`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem('user', username);
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
