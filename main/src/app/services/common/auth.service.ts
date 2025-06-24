import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper : JwtHelperService) { }
  identityCheck() {
    const token: string | null = localStorage.getItem("accessToken");
  if (token) {
    //const decodeToken = jwtHelper.decodeToken(token);
    //const expirationDate: Date | null = jwtHelper.getTokenExpirationDate(token);
    const expired: boolean = this.jwtHelper.isTokenExpired(token);

  }
}
}
