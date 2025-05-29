import { CanActivateFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtHelper = inject(JwtHelperService);
  const token: string | null = localStorage.getItem("accessToken");
  if (token) {
    const decodeToken = jwtHelper.decodeToken(token);
    const expirationDate: Date | null = jwtHelper.getTokenExpirationDate(token);
    const expired: boolean = jwtHelper.isTokenExpired(token);

    if (!expired) {
      return true;
    }
  }
  return false; // Token yoksa ya da expired ise erişimi engelle
};
