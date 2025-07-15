import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    // Exclude login
    const excludedUrls = ['/auth/login'];

    // If request URL includes one of the excluded URLs, skip adding the token
    const shouldExclude = excludedUrls.some((url) => req.url.includes(url));

    if (token && !shouldExclude) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned).pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            (error.status === 403 || error.status === 401)
          ) {
            return this.handleUnauthorizedError(cloned, next);
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }

  private handleUnauthorizedError(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          const newAccessToken = response.access;
          const newRefreshToken =
            response.refresh ?? this.authService.getRefreshToken();
          this.authService.saveTokens(newAccessToken, newRefreshToken!);

          this.refreshTokenSubject.next(newAccessToken);
          return next.handle(
            req.clone({
              headers: req.headers.set(
                'Authorization',
                `Bearer ${newAccessToken}`
              ),
            })
          );
        }),
        catchError((err) => {
          this.authService.logout();
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) =>
          next.handle(
            req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`),
            })
          )
        )
      );
    }
  }
}
