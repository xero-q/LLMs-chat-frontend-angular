import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const user = localStorage.getItem('user');

    if (user) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
