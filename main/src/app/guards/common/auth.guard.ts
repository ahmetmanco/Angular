import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/common/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const authService = inject(AuthService); // AuthService enjekte et

  const token = localStorage.getItem("accessToken");
  const isExpired = token ? jwtHelper.isTokenExpired(token) : true;

  if (!token || isExpired) {
    authService.removeToken(); // State'i temizle
    router.navigate(["login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};