import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  
  const token: string | null = localStorage.getItem("accessToken");
  if (token) {
    //const decodeToken = jwtHelper.decodeToken(token);
    //const expirationDate: Date | null = jwtHelper.getTokenExpirationDate(token);
    const expired: boolean = jwtHelper.isTokenExpired(token);

    if (!token || expired) {
      router.navigate(["login"], {queryParams: {returnUrl:state.url}});
      return false;
    }
  }
  return true; // Token geçerli
};
